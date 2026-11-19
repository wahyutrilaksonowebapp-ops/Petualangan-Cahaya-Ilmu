import type {
  MissionConfig,
  StudentAnalyticsRow,
  TeacherAnalyticsPayload,
  WorldProgressSlice,
} from './multiplayerClient.ts';

const SHARED_STORE_KEY = 'cahaya_ilmu_shared_store_v1';
const BROADCAST_CHANNEL_NAME = 'cahaya_ilmu_realtime_v1';

interface LocalStoreShape {
  missionConfig: MissionConfig;
  students: Record<string, StudentAnalyticsRow>;
}

const DEFAULT_MISSION_CONFIG: MissionConfig = {
  questionCounts: { '1': 10, '2': 10, '3': 10, '4': 10, '5': 10 },
  durationPerQuestionSec: 25,
};

let serverApiAvailable: boolean | null = null;
let broadcastChannel: BroadcastChannel | null = null;

function getChannel(): BroadcastChannel | null {
  if (typeof BroadcastChannel === 'undefined') return null;
  if (!broadcastChannel) {
    try {
      broadcastChannel = new BroadcastChannel(BROADCAST_CHANNEL_NAME);
    } catch {
      return null;
    }
  }
  return broadcastChannel;
}

function createEmptyStageStats(): StudentAnalyticsRow['stageStats'] {
  const stats: StudentAnalyticsRow['stageStats'] = {};
  for (let i = 1; i <= 5; i++) {
    stats[String(i)] = {
      attempts: 0,
      bestScore: 0,
      totalCorrect: 0,
      totalAnswered: 0,
      completed: false,
      lastPlayedAt: 0,
    };
  }
  return stats;
}

function normalizeStudentKey(name: string, institution: string): string {
  const clean = `${name.trim().toLowerCase()}__${institution.trim().toLowerCase()}`
    .replace(/[^a-z0-9_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `stu-${clean || Date.now()}`;
}

function readLocalStore(): LocalStoreShape {
  try {
    const raw = localStorage.getItem(SHARED_STORE_KEY);
    if (raw) {
      const parsed = JSON.parse(raw) as Partial<LocalStoreShape>;
      return {
        missionConfig: {
          questionCounts: {
            ...DEFAULT_MISSION_CONFIG.questionCounts,
            ...(parsed.missionConfig?.questionCounts || {}),
          },
          durationPerQuestionSec: parsed.missionConfig?.durationPerQuestionSec || 25,
        },
        students: parsed.students || {},
      };
    }
  } catch {
    // ignore corrupted local store
  }
  return {
    missionConfig: structuredClone(DEFAULT_MISSION_CONFIG),
    students: {},
  };
}

function writeLocalStore(data: LocalStoreShape) {
  try {
    localStorage.setItem(SHARED_STORE_KEY, JSON.stringify(data));
  } catch {
    // ignore storage quota errors
  }
}

export function buildLocalAnalyticsPayload(): TeacherAnalyticsPayload {
  const store = readLocalStore();
  const allStudents = Object.values(store.students).sort((a, b) => {
    if (a.online !== b.online) return a.online ? -1 : 1;
    return b.lastSeen - a.lastSeen;
  });

  const worldLabels: Record<number, { name: string; color: string }> = {
    1: { name: "Dunia 1: Al-Qur'an & Hadis", color: '#10b981' },
    2: { name: 'Dunia 2: Akidah', color: '#8b5cf6' },
    3: { name: 'Dunia 3: Akhlak', color: '#f59e0b' },
    4: { name: 'Dunia 4: Fikih Ibadah', color: '#0ea5e9' },
    5: { name: 'Dunia 5: Sejarah Islam', color: '#ec4899' },
  };

  let onlineCount = 0;
  let totalCorrectAll = 0;
  let totalAnsweredAll = 0;
  let totalBadgesAll = 0;

  const worldCompletions: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const worldAttempts: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const worldScoresSum: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const worldScoredCount: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };

  const difficultyAggregate = {
    mudah: { correct: 0, total: 0 },
    sedang: { correct: 0, total: 0 },
    sulit: { correct: 0, total: 0 },
  };

  for (const s of allStudents) {
    if (s.online) onlineCount++;
    totalBadgesAll += (s.badges || []).filter(Boolean).length;

    difficultyAggregate.mudah.correct += s.difficultyStats?.mudah?.correct || 0;
    difficultyAggregate.mudah.total += s.difficultyStats?.mudah?.total || 0;
    difficultyAggregate.sedang.correct += s.difficultyStats?.sedang?.correct || 0;
    difficultyAggregate.sedang.total += s.difficultyStats?.sedang?.total || 0;
    difficultyAggregate.sulit.correct += s.difficultyStats?.sulit?.correct || 0;
    difficultyAggregate.sulit.total += s.difficultyStats?.sulit?.total || 0;

    for (let st = 1; st <= 5; st++) {
      const stat = s.stageStats?.[String(st)];
      if (stat) {
        totalCorrectAll += stat.totalCorrect;
        totalAnsweredAll += stat.totalAnswered;
        if (stat.completed || s.badges?.[st - 1]) {
          worldCompletions[st]++;
        }
        if (stat.totalAnswered > 0 || stat.attempts > 0) {
          worldAttempts[st]++;
          worldScoresSum[st] += stat.bestScore;
          worldScoredCount[st]++;
        }
      }
    }
  }

  const worldDistribution: WorldProgressSlice[] = [1, 2, 3, 4, 5].map((id) => {
    const completed = worldCompletions[id];
    const active = worldAttempts[id];
    const avgScore =
      worldScoredCount[id] > 0 ? Math.round(worldScoresSum[id] / worldScoredCount[id]) : 0;
    return {
      stageId: id,
      name: worldLabels[id].name,
      shortName: `Dunia ${id}`,
      value: completed > 0 ? completed : active,
      completed,
      participants: active,
      avgScore,
      color: worldLabels[id].color,
    };
  });

  const avgAccuracy =
    totalAnsweredAll > 0 ? Math.round((totalCorrectAll / totalAnsweredAll) * 100) : 0;

  return {
    summary: {
      totalStudents: allStudents.length,
      onlineStudents: onlineCount,
      avgAccuracy,
      totalBadgesEarned: totalBadgesAll,
      totalAnsweredQuestions: totalAnsweredAll,
    },
    worldDistribution,
    difficultyAggregate,
    missionConfig: store.missionConfig,
    students: allStudents,
    timestamp: Date.now(),
  };
}

function broadcastLocalAnalytics() {
  const ch = getChannel();
  if (ch) {
    ch.postMessage({ type: 'analytics:update', data: buildLocalAnalyticsPayload() });
  }
}

/**
 * Safely calls an API route and verifies that the response is genuine JSON
 * (never throws "Unexpected token '<'" if a static host returns index.html).
 */
async function safeJsonFetch<T>(
  url: string,
  init?: RequestInit
): Promise<{ available: true; ok: boolean; status: number; data: T } | { available: false }> {
  try {
    const res = await fetch(url, init);
    const contentType = (res.headers.get('content-type') || '').toLowerCase();
    const rawText = await res.text();
    const trimmed = rawText.trim();

    if (!contentType.includes('application/json') || trimmed.startsWith('<')) {
      serverApiAvailable = false;
      return { available: false };
    }

    const parsed = JSON.parse(trimmed) as T;
    serverApiAvailable = true;
    return { available: true, ok: res.ok, status: res.status, data: parsed };
  } catch {
    serverApiAvailable = false;
    return { available: false };
  }
}

export function isBackendServerAvailable(): boolean {
  return serverApiAvailable === true;
}

export async function fetchMissionConfig(): Promise<MissionConfig> {
  const res = await safeJsonFetch<{ ok?: boolean; missionConfig?: MissionConfig }>('/api/mission-config');
  if (res.available && res.ok && res.data?.missionConfig) {
    return res.data.missionConfig;
  }
  return readLocalStore().missionConfig;
}

export async function loginStudent(payload: {
  name: string;
  institution: string;
  grade: number;
  season: number;
  costume: string;
}): Promise<{ ok: true; student: StudentAnalyticsRow; missionConfig: MissionConfig; source: 'server' | 'local' } | { ok: false; error: string }> {
  const name = payload.name.trim();
  const institution = payload.institution.trim();
  if (!name || !institution) {
    return { ok: false, error: 'Nama Murid dan Nama Lembaga wajib diisi.' };
  }

  const res = await safeJsonFetch<{
    ok?: boolean;
    student?: StudentAnalyticsRow;
    missionConfig?: MissionConfig;
    error?: string;
  }>('/api/auth/student', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  });

  if (res.available) {
    if (res.ok && res.data?.ok && res.data.student) {
      return {
        ok: true,
        student: res.data.student,
        missionConfig: res.data.missionConfig || structuredClone(DEFAULT_MISSION_CONFIG),
        source: 'server',
      };
    }
    return { ok: false, error: res.data?.error || 'Gagal masuk sebagai murid.' };
  }

  // Seamless client-side fallback when hosted as static SPA
  const store = readLocalStore();
  const id = normalizeStudentKey(name, institution);
  const now = Date.now();

  if (!store.students[id]) {
    store.students[id] = {
      id,
      name,
      institution,
      grade: payload.grade,
      season: payload.season,
      costume: payload.costume,
      xp: 0,
      level: 1,
      coins: 80,
      badges: [false, false, false, false, false],
      stageStats: createEmptyStageStats(),
      difficultyStats: {
        mudah: { correct: 0, total: 0 },
        sedang: { correct: 0, total: 0 },
        sulit: { correct: 0, total: 0 },
      },
      online: true,
      currentStage: 0,
      lastSeen: now,
    };
  } else {
    const existing = store.students[id];
    existing.name = name;
    existing.institution = institution;
    existing.grade = payload.grade;
    existing.season = payload.season;
    existing.costume = payload.costume;
    existing.online = true;
    existing.lastSeen = now;
  }

  writeLocalStore(store);
  broadcastLocalAnalytics();

  return {
    ok: true,
    student: store.students[id],
    missionConfig: store.missionConfig,
    source: 'local',
  };
}

export async function loginTeacher(
  username: string,
  password: string
): Promise<
  | { ok: true; analytics: TeacherAnalyticsPayload; source: 'server' | 'local' }
  | { ok: false; error: string }
> {
  const cleanUser = username.trim();
  const cleanPass = password.trim();

  const res = await safeJsonFetch<{
    ok?: boolean;
    analytics?: TeacherAnalyticsPayload;
    error?: string;
  }>('/api/auth/teacher', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username: cleanUser, password: cleanPass }),
  });

  if (res.available) {
    if (res.ok && res.data?.ok && res.data.analytics) {
      return { ok: true, analytics: res.data.analytics, source: 'server' };
    }
    return {
      ok: false,
      error: res.data?.error || 'Username atau Password Guru salah! Periksa kembali kredensial akun Guru.',
    };
  }

  // Exact teacher credential verification in static fallback mode
  if (cleanUser === 'GPAIBEJI' && cleanPass === 'bejo-lan-aji') {
    return {
      ok: true,
      analytics: buildLocalAnalyticsPayload(),
      source: 'local',
    };
  }

  return {
    ok: false,
    error: 'Username atau Password Guru salah! Periksa kembali kredensial akun Guru.',
  };
}

export async function fetchTeacherAnalytics(): Promise<TeacherAnalyticsPayload> {
  const res = await safeJsonFetch<{ ok?: boolean; analytics?: TeacherAnalyticsPayload }>(
    '/api/teacher/analytics'
  );
  if (res.available && res.ok && res.data?.analytics) {
    return res.data.analytics;
  }
  return buildLocalAnalyticsPayload();
}

export async function saveTeacherMissionConfig(
  questionCounts: Record<string, number>,
  durationPerQuestionSec: number
): Promise<MissionConfig> {
  const clampedCounts: Record<string, number> = {};
  for (let st = 1; st <= 5; st++) {
    const key = String(st);
    const val = Number(questionCounts[key]);
    clampedCounts[key] = Math.max(10, Math.min(15, Number.isFinite(val) ? Math.round(val) : 10));
  }
  const clampedDuration = Math.max(12, Math.min(45, Math.round(durationPerQuestionSec || 25)));

  const res = await safeJsonFetch<{ ok?: boolean; missionConfig?: MissionConfig }>(
    '/api/teacher/mission-config',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        questionCounts: clampedCounts,
        durationPerQuestionSec: clampedDuration,
      }),
    }
  );

  if (res.available && res.ok && res.data?.missionConfig) {
    return res.data.missionConfig;
  }

  const store = readLocalStore();
  store.missionConfig = {
    questionCounts: clampedCounts,
    durationPerQuestionSec: clampedDuration,
  };
  writeLocalStore(store);

  const ch = getChannel();
  ch?.postMessage({ type: 'mission:config', config: store.missionConfig });
  broadcastLocalAnalytics();
  return store.missionConfig;
}

export function recordLocalStudentProgress(payload: {
  studentId: string;
  xp?: number;
  level?: number;
  coins?: number;
  badges?: boolean[];
  costume?: string;
  stageId?: number;
  difficulty?: 'mudah' | 'sedang' | 'sulit';
  correct?: boolean;
  currentScore?: number;
  stageCompleted?: boolean;
  stageScore?: number;
}) {
  // Always mirror into local store so fallback analytics stay fresh
  const store = readLocalStore();
  const stu = store.students[payload.studentId];
  if (stu) {
    if (typeof payload.xp === 'number') stu.xp = payload.xp;
    if (typeof payload.level === 'number') stu.level = payload.level;
    if (typeof payload.coins === 'number') stu.coins = payload.coins;
    if (Array.isArray(payload.badges) && payload.badges.length === 5) {
      stu.badges = payload.badges.map(Boolean);
    }
    if (typeof payload.costume === 'string') stu.costume = payload.costume;
    stu.online = true;
    stu.lastSeen = Date.now();

    if (payload.stageId && stu.stageStats[String(payload.stageId)]) {
      const st = stu.stageStats[String(payload.stageId)];
      if (typeof payload.correct === 'boolean') {
        st.totalAnswered += 1;
        if (payload.correct) st.totalCorrect += 1;
        st.lastPlayedAt = Date.now();
        if (typeof payload.currentScore === 'number' && payload.currentScore > st.bestScore) {
          st.bestScore = Math.round(payload.currentScore);
        }
        const diffKey =
          payload.difficulty === 'mudah' || payload.difficulty === 'sulit'
            ? payload.difficulty
            : 'sedang';
        stu.difficultyStats[diffKey].total += 1;
        if (payload.correct) stu.difficultyStats[diffKey].correct += 1;
      }
      if (payload.stageCompleted) {
        st.attempts += 1;
        st.completed = true;
        if (typeof payload.stageScore === 'number' && payload.stageScore > st.bestScore) {
          st.bestScore = Math.round(payload.stageScore);
        }
        st.lastPlayedAt = Date.now();
        stu.badges[payload.stageId - 1] = true;
      }
    }
    writeLocalStore(store);
    broadcastLocalAnalytics();
  }

  // Also send to Express backend if server is reachable
  if (serverApiAvailable !== false) {
    void safeJsonFetch('/api/student/progress', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
  }
}

export function markLocalStudentOffline(studentId: string | null) {
  if (!studentId) return;
  const store = readLocalStore();
  if (store.students[studentId]) {
    store.students[studentId].online = false;
    store.students[studentId].lastSeen = Date.now();
    writeLocalStore(store);
    broadcastLocalAnalytics();
  }
}

function csvEscape(val: string | number): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

export async function exportTeacherCsvReport(analyticsFallback: TeacherAnalyticsPayload | null) {
  const filename = `Analisis_AKM_PAI_Beji_${new Date().toISOString().slice(0, 10)}.csv`;

  // Try real server CSV endpoint first
  if (serverApiAvailable !== false) {
    try {
      const res = await fetch(`/api/teacher/export-csv?t=${Date.now()}`);
      const contentType = (res.headers.get('content-type') || '').toLowerCase();
      if (res.ok && contentType.includes('text/csv')) {
        const blob = await res.blob();
        triggerBlobDownload(blob, filename);
        return;
      }
    } catch {
      // fall through to client-side CSV generation
    }
  }

  // Generate identical UTF-8 BOM CSV client-side from analytics data
  const analytics = analyticsFallback || buildLocalAnalyticsPayload();
  const header = [
    'No',
    'Nama Murid',
    'Nama Lembaga',
    'Kelas',
    'Season',
    'Status',
    'Level',
    'Total XP',
    'Lencana Tuntas (/5)',
    'Skor Dunia 1 (Al-Quran & Hadis)',
    'Skor Dunia 2 (Akidah)',
    'Skor Dunia 3 (Akhlak)',
    'Skor Dunia 4 (Fikih)',
    'Skor Dunia 5 (Sejarah)',
    'Akurasi Mudah (10%)',
    'Akurasi Sedang (60%)',
    'Akurasi Sulit (30%)',
    'Akurasi Total (%)',
    'Predikat Kemampuan AKM',
  ];

  const rows = analytics.students.map((s, index) => {
    const pct = (b: { correct: number; total: number }) =>
      b.total > 0 ? `${Math.round((b.correct / b.total) * 100)}% (${b.correct}/${b.total})` : '-';

    let totC = 0;
    let totA = 0;
    const stageCols: string[] = [];
    for (let st = 1; st <= 5; st++) {
      const stat = s.stageStats[String(st)];
      if (stat) {
        totC += stat.totalCorrect;
        totA += stat.totalAnswered;
        stageCols.push(
          stat.totalAnswered > 0 ? `${stat.bestScore}%${stat.completed ? ' (Tuntas)' : ''}` : 'Belum'
        );
      } else {
        stageCols.push('Belum');
      }
    }

    const acc = totA > 0 ? Math.round((totC / totA) * 100) : 0;
    const predikat =
      totA === 0
        ? 'Belum Mengerjakan'
        : acc >= 85
          ? 'Mahir (Sangat Baik)'
          : acc >= 70
            ? 'Cakap (Baik)'
            : acc >= 55
              ? 'Dasar (Perlu Penguatan)'
              : 'Perlu Intervensi Khusus';

    return [
      index + 1,
      s.name,
      s.institution,
      `Kelas ${s.grade}`,
      `Semester ${s.season}`,
      s.online ? 'Online' : 'Offline',
      s.level,
      s.xp,
      s.badges.filter(Boolean).length,
      ...stageCols,
      pct(s.difficultyStats.mudah),
      pct(s.difficultyStats.sedang),
      pct(s.difficultyStats.sulit),
      `${acc}%`,
      predikat,
    ]
      .map(csvEscape)
      .join(',');
  });

  const csvContent = '\uFEFF' + [header.map(csvEscape).join(','), ...rows].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerBlobDownload(blob, filename);
}

function triggerBlobDownload(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.setTimeout(() => URL.revokeObjectURL(url), 1000);
}
