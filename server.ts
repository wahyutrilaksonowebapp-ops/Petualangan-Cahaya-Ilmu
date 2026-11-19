import express from 'express';
import type { Request, Response } from 'express';
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { WebSocketServer } from 'ws';
import type { WebSocket } from 'ws';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const HOST = '0.0.0.0';
const DATA_DIR = path.join(__dirname, 'data');
const STORE_FILE = path.join(DATA_DIR, 'store.json');

interface DifficultyBucket {
  correct: number;
  total: number;
}

interface StageStat {
  attempts: number;
  bestScore: number;
  totalCorrect: number;
  totalAnswered: number;
  completed: boolean;
  lastPlayedAt: number;
}

interface AnswerLogEntry {
  timestamp: number;
  stageId: number;
  difficulty: 'mudah' | 'sedang' | 'sulit';
  correct: boolean;
  questionPreview: string;
}

interface StudentRecord {
  id: string;
  name: string;
  institution: string;
  grade: number;
  season: number;
  costume: string;
  xp: number;
  level: number;
  coins: number;
  badges: boolean[];
  stageStats: Record<string, StageStat>;
  difficultyStats: {
    mudah: DifficultyBucket;
    sedang: DifficultyBucket;
    sulit: DifficultyBucket;
  };
  recentAnswers: AnswerLogEntry[];
  online: boolean;
  currentStage: number;
  lastSeen: number;
}

interface MissionConfig {
  questionCounts: Record<string, number>;
  durationPerQuestionSec: number;
}

interface ChatMessage {
  id: string;
  fromId: string;
  fromName: string;
  fromInstitution: string;
  toId?: string;
  toName?: string;
  text: string;
  timestamp: number;
}

interface PersistedStore {
  missionConfig: MissionConfig;
  students: Record<string, StudentRecord>;
}

interface LivePlayerState {
  id: string;
  name: string;
  institution: string;
  grade: number;
  level: number;
  costume: string;
  stageId: number;
  x: number;
  y: number;
  z: number;
  rotY: number;
  isMoving: boolean;
}

interface ClientSession {
  ws: WebSocket;
  role: 'student' | 'teacher';
  studentId?: string;
}

const DEFAULT_MISSION_CONFIG: MissionConfig = {
  questionCounts: {
    '1': 10,
    '2': 10,
    '3': 10,
    '4': 10,
    '5': 10,
  },
  durationPerQuestionSec: 25,
};

function createEmptyStageStats(): Record<string, StageStat> {
  const stats: Record<string, StageStat> = {};
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

function loadStore(): PersistedStore {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
    if (fs.existsSync(STORE_FILE)) {
      const raw = fs.readFileSync(STORE_FILE, 'utf-8');
      const parsed = JSON.parse(raw) as PersistedStore;
      // Reset online flags on cold server start
      if (parsed.students) {
        for (const s of Object.values(parsed.students)) {
          s.online = false;
        }
      }
      return {
        missionConfig: {
          questionCounts: {
            ...DEFAULT_MISSION_CONFIG.questionCounts,
            ...(parsed.missionConfig?.questionCounts || {}),
          },
          durationPerQuestionSec:
            parsed.missionConfig?.durationPerQuestionSec || 25,
        },
        students: parsed.students || {},
      };
    }
  } catch (err) {
    console.warn('Could not load store.json, starting fresh:', err);
  }
  return {
    missionConfig: structuredClone(DEFAULT_MISSION_CONFIG),
    students: {},
  };
}

let saveTimer: ReturnType<typeof setTimeout> | null = null;
function scheduleSave() {
  if (saveTimer) return;
  saveTimer = setTimeout(() => {
    saveTimer = null;
    try {
      if (!fs.existsSync(DATA_DIR)) {
        fs.mkdirSync(DATA_DIR, { recursive: true });
      }
      fs.writeFileSync(STORE_FILE, JSON.stringify(store, null, 2), 'utf-8');
    } catch (err) {
      console.error('Failed to persist store:', err);
    }
  }, 400);
}

const store: PersistedStore = loadStore();
const livePlayers = new Map<string, LivePlayerState>();
const sessions = new Set<ClientSession>();
const chatHistory: ChatMessage[] = [];

function normalizeStudentKey(name: string, institution: string): string {
  const clean = `${name.trim().toLowerCase()}__${institution.trim().toLowerCase()}`
    .replace(/[^a-z0-9_]+/g, '-')
    .replace(/^-+|-+$/g, '');
  return `stu-${clean || Date.now()}`;
}

function clampQuestionCount(n: number): number {
  const parsed = Number(n);
  if (!Number.isFinite(parsed)) return 10;
  return Math.max(10, Math.min(15, Math.round(parsed)));
}

function buildAnalyticsPayload() {
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
    totalBadgesAll += s.badges.filter(Boolean).length;

    difficultyAggregate.mudah.correct += s.difficultyStats.mudah.correct;
    difficultyAggregate.mudah.total += s.difficultyStats.mudah.total;
    difficultyAggregate.sedang.correct += s.difficultyStats.sedang.correct;
    difficultyAggregate.sedang.total += s.difficultyStats.sedang.total;
    difficultyAggregate.sulit.correct += s.difficultyStats.sulit.correct;
    difficultyAggregate.sulit.total += s.difficultyStats.sulit.total;

    for (let st = 1; st <= 5; st++) {
      const stat = s.stageStats[String(st)];
      if (stat) {
        totalCorrectAll += stat.totalCorrect;
        totalAnsweredAll += stat.totalAnswered;
        if (stat.completed || s.badges[st - 1]) {
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

  const worldDistribution = [1, 2, 3, 4, 5].map((id) => {
    const completed = worldCompletions[id];
    const active = worldAttempts[id];
    const avgScore =
      worldScoredCount[id] > 0
        ? Math.round(worldScoresSum[id] / worldScoredCount[id])
        : 0;
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
    totalAnsweredAll > 0
      ? Math.round((totalCorrectAll / totalAnsweredAll) * 100)
      : 0;

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

function sendJson(ws: WebSocket, payload: unknown) {
  if (ws.readyState === 1) {
    ws.send(JSON.stringify(payload));
  }
}

function broadcastAll(payload: unknown, excludeWs?: WebSocket) {
  const encoded = JSON.stringify(payload);
  for (const s of sessions) {
    if (s.ws !== excludeWs && s.ws.readyState === 1) {
      s.ws.send(encoded);
    }
  }
}

function broadcastTeacherAnalytics() {
  const analytics = buildAnalyticsPayload();
  const encoded = JSON.stringify({ type: 'analytics:update', data: analytics });
  for (const s of sessions) {
    if (s.role === 'teacher' && s.ws.readyState === 1) {
      s.ws.send(encoded);
    }
  }
}

function csvEscape(val: string | number): string {
  const str = String(val ?? '');
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  return str;
}

async function startServer() {
  const app = express();
  app.use(express.json({ limit: '1mb' }));

  // ==================== REST API ENDPOINTS ====================

  // 1. Teacher Login (Exact credentials requested)
  app.post('/api/auth/teacher', (req: Request, res: Response) => {
    const username = String(req.body?.username || '').trim();
    const password = String(req.body?.password || '').trim();

    if (username === 'GPAIBEJI' && password === 'bejo-lan-aji') {
      res.json({
        ok: true,
        teacherName: 'Guru PAI Beji (Administrator Misi)',
        username: 'GPAIBEJI',
        analytics: buildAnalyticsPayload(),
      });
      return;
    }

    res.status(401).json({
      ok: false,
      error: 'Username atau Password Guru salah! Periksa kembali kredensial akun Guru.',
    });
  });

  // 2. Student Login / Registration (Name + Institution)
  app.post('/api/auth/student', (req: Request, res: Response) => {
    const name = String(req.body?.name || '').trim();
    const institution = String(req.body?.institution || '').trim();
    const grade = Math.max(1, Math.min(6, parseInt(String(req.body?.grade || '6'), 10) || 6));
    const season = Math.max(1, Math.min(2, parseInt(String(req.body?.season || '1'), 10) || 1));
    const costume = String(req.body?.costume || 'sd');

    if (!name || !institution) {
      res.status(400).json({
        ok: false,
        error: 'Nama Murid dan Nama Lembaga wajib diisi.',
      });
      return;
    }

    const id = normalizeStudentKey(name, institution);
    const now = Date.now();

    if (!store.students[id]) {
      store.students[id] = {
        id,
        name,
        institution,
        grade,
        season,
        costume,
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
        recentAnswers: [],
        online: true,
        currentStage: 0,
        lastSeen: now,
      };
    } else {
      const existing = store.students[id];
      existing.name = name;
      existing.institution = institution;
      existing.grade = grade;
      existing.season = season;
      existing.costume = costume;
      existing.online = true;
      existing.lastSeen = now;
    }

    scheduleSave();
    broadcastTeacherAnalytics();

    res.json({
      ok: true,
      student: store.students[id],
      missionConfig: store.missionConfig,
    });
  });

  // 3. Get Mission Config
  app.get('/api/mission-config', (_req: Request, res: Response) => {
    res.json({ ok: true, missionConfig: store.missionConfig });
  });

  // 4. Teacher: Get Real-Time Analytics
  app.get('/api/teacher/analytics', (_req: Request, res: Response) => {
    res.json({ ok: true, analytics: buildAnalyticsPayload() });
  });

  // 5. Teacher: Update Mission Configuration (10-15 questions per element + duration)
  app.post('/api/teacher/mission-config', (req: Request, res: Response) => {
    const incomingCounts = req.body?.questionCounts || {};
    const duration = Math.max(
      10,
      Math.min(60, Math.round(Number(req.body?.durationPerQuestionSec) || 25))
    );

    for (let st = 1; st <= 5; st++) {
      const key = String(st);
      if (incomingCounts[key] !== undefined) {
        store.missionConfig.questionCounts[key] = clampQuestionCount(incomingCounts[key]);
      }
    }
    store.missionConfig.durationPerQuestionSec = duration;

    scheduleSave();
    broadcastAll({ type: 'mission:config', config: store.missionConfig });
    broadcastTeacherAnalytics();

    res.json({ ok: true, missionConfig: store.missionConfig });
  });

  // 6. Student: Record Answer or Stage Completion via HTTP fallback too
  app.post('/api/student/progress', (req: Request, res: Response) => {
    const studentId = String(req.body?.studentId || '');
    const student = store.students[studentId];
    if (!student) {
      res.status(404).json({ ok: false, error: 'Student not found' });
      return;
    }

    const { xp, level, coins, badges, costume, stageId, difficulty, correct, questionPreview, stageCompleted, stageScore } = req.body;
    if (typeof xp === 'number') student.xp = xp;
    if (typeof level === 'number') student.level = level;
    if (typeof coins === 'number') student.coins = coins;
    if (Array.isArray(badges) && badges.length === 5) student.badges = badges.map(Boolean);
    if (typeof costume === 'string') student.costume = costume;
    student.lastSeen = Date.now();

    if (stageId && student.stageStats[String(stageId)]) {
      const st = student.stageStats[String(stageId)];
      if (typeof correct === 'boolean') {
        st.totalAnswered += 1;
        if (correct) st.totalCorrect += 1;
        st.lastPlayedAt = Date.now();

        const diffKey = difficulty === 'mudah' || difficulty === 'sulit' ? difficulty : 'sedang';
        student.difficultyStats[diffKey].total += 1;
        if (correct) student.difficultyStats[diffKey].correct += 1;

        student.recentAnswers.unshift({
          timestamp: Date.now(),
          stageId: Number(stageId),
          difficulty: diffKey,
          correct,
          questionPreview: String(questionPreview || '').slice(0, 80),
        });
        if (student.recentAnswers.length > 50) {
          student.recentAnswers.length = 50;
        }
      }
      if (stageCompleted) {
        st.attempts += 1;
        st.completed = true;
        if (typeof stageScore === 'number' && stageScore > st.bestScore) {
          st.bestScore = Math.round(stageScore);
        }
        st.lastPlayedAt = Date.now();
        student.badges[Number(stageId) - 1] = true;
      } else if (typeof stageScore === 'number') {
        if (stageScore > st.bestScore) {
          st.bestScore = Math.round(stageScore);
        }
      }
    }

    scheduleSave();
    broadcastTeacherAnalytics();
    res.json({ ok: true, student });
  });

  // 7. Teacher: Download CSV Student Analysis Report
  app.get('/api/teacher/export-csv', (_req: Request, res: Response) => {
    const analytics = buildAnalyticsPayload();
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
      const pct = (b: DifficultyBucket) =>
        b.total > 0 ? `${Math.round((b.correct / b.total) * 100)}% (${b.correct}/${b.total})` : '-';

      let totC = 0;
      let totA = 0;
      const stageCols: string[] = [];
      for (let st = 1; st <= 5; st++) {
        const stat = s.stageStats[String(st)];
        if (stat) {
          totC += stat.totalCorrect;
          totA += stat.totalAnswered;
          stageCols.push(stat.totalAnswered > 0 ? `${stat.bestScore}%${stat.completed ? ' (Tuntas)' : ''}` : 'Belum');
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
    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename="Analisis_AKM_PAI_Beji_${new Date().toISOString().slice(0, 10)}.csv"`
    );
    res.send(csvContent);
  });

  // ==================== HTTP SERVER + WEBSOCKET SERVER ====================
  const server = http.createServer(app);
  const wss = new WebSocketServer({ server, path: '/ws' });

  wss.on('connection', (ws: WebSocket) => {
    const session: ClientSession = { ws, role: 'student' };
    sessions.add(session);

    ws.on('message', (raw: Buffer | string) => {
      try {
        const msg = JSON.parse(raw.toString());

        if (msg.type === 'auth:join') {
          session.role = msg.role === 'teacher' ? 'teacher' : 'student';

          // Always send current mission config and recent chat
          sendJson(ws, { type: 'mission:config', config: store.missionConfig });
          sendJson(ws, { type: 'chat:history', messages: chatHistory.slice(-30) });

          if (session.role === 'teacher') {
            sendJson(ws, { type: 'players:snapshot', players: Array.from(livePlayers.values()) });
            sendJson(ws, { type: 'analytics:update', data: buildAnalyticsPayload() });
          } else if (msg.studentId && store.students[msg.studentId]) {
            session.studentId = String(msg.studentId);
            const stu = store.students[session.studentId];
            stu.online = true;
            stu.lastSeen = Date.now();
            if (typeof msg.costume === 'string') stu.costume = msg.costume;

            const playerState: LivePlayerState = {
              id: stu.id,
              name: stu.name,
              institution: stu.institution,
              grade: stu.grade,
              level: stu.level,
              costume: stu.costume,
              stageId: typeof msg.stageId === 'number' ? msg.stageId : 0,
              x: typeof msg.x === 'number' ? msg.x : (Math.random() - 0.5) * 6,
              y: 0,
              z: typeof msg.z === 'number' ? msg.z : 4 + Math.random() * 3,
              rotY: 0,
              isMoving: false,
            };
            livePlayers.set(stu.id, playerState);

            // Send snapshot to joiner
            sendJson(ws, {
              type: 'players:snapshot',
              players: Array.from(livePlayers.values()).filter((p) => p.id !== stu.id),
            });

            // Broadcast new player to everyone else
            broadcastAll({ type: 'player:joined', player: playerState }, ws);
            broadcastTeacherAnalytics();
          }
          return;
        }

        if (msg.type === 'player:move' && session.studentId) {
          const p = livePlayers.get(session.studentId);
          const stu = store.students[session.studentId];
          if (p) {
            p.x = Number(msg.x) || 0;
            p.y = Number(msg.y) || 0;
            p.z = Number(msg.z) || 0;
            p.rotY = Number(msg.rotY) || 0;
            p.stageId = Number(msg.stageId) || 0;
            p.isMoving = Boolean(msg.isMoving);
            if (typeof msg.costume === 'string') p.costume = msg.costume;
            if (typeof msg.level === 'number') p.level = msg.level;
            if (stu) {
              stu.currentStage = p.stageId;
              stu.lastSeen = Date.now();
              stu.costume = p.costume;
            }
            broadcastAll({ type: 'player:moved', player: p }, ws);
          }
          return;
        }

        if (msg.type === 'chat:send' && session.studentId) {
          const stu = store.students[session.studentId];
          const text = String(msg.text || '').trim().slice(0, 220);
          if (!stu || !text) return;

          const chatMsg: ChatMessage = {
            id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
            fromId: stu.id,
            fromName: stu.name,
            fromInstitution: stu.institution,
            toId: msg.toId ? String(msg.toId) : undefined,
            toName: msg.toName ? String(msg.toName) : undefined,
            text,
            timestamp: Date.now(),
          };
          chatHistory.push(chatMsg);
          if (chatHistory.length > 80) chatHistory.shift();

          broadcastAll({ type: 'chat:message', message: chatMsg });
          return;
        }

        if (msg.type === 'student:answer' && session.studentId) {
          const stu = store.students[session.studentId];
          if (!stu) return;

          const stageId = Number(msg.stageId) || 1;
          const diffKey =
            msg.difficulty === 'mudah' || msg.difficulty === 'sulit' ? msg.difficulty : 'sedang';
          const correct = Boolean(msg.correct);

          const st = stu.stageStats[String(stageId)];
          if (st) {
            st.totalAnswered += 1;
            if (correct) st.totalCorrect += 1;
            st.lastPlayedAt = Date.now();
            if (typeof msg.currentScore === 'number' && msg.currentScore > st.bestScore) {
              st.bestScore = Math.round(msg.currentScore);
            }
          }

          stu.difficultyStats[diffKey].total += 1;
          if (correct) stu.difficultyStats[diffKey].correct += 1;

          if (typeof msg.xp === 'number') stu.xp = msg.xp;
          if (typeof msg.level === 'number') stu.level = msg.level;
          if (typeof msg.coins === 'number') stu.coins = msg.coins;
          stu.lastSeen = Date.now();

          stu.recentAnswers.unshift({
            timestamp: Date.now(),
            stageId,
            difficulty: diffKey,
            correct,
            questionPreview: String(msg.questionPreview || '').slice(0, 80),
          });
          if (stu.recentAnswers.length > 50) stu.recentAnswers.length = 50;

          scheduleSave();
          broadcastTeacherAnalytics();
          return;
        }

        if (msg.type === 'student:stage_complete' && session.studentId) {
          const stu = store.students[session.studentId];
          if (!stu) return;

          const stageId = Number(msg.stageId) || 1;
          const score = Math.round(Number(msg.score) || 0);
          const st = stu.stageStats[String(stageId)];
          if (st) {
            st.attempts += 1;
            st.completed = true;
            if (score > st.bestScore) st.bestScore = score;
            st.lastPlayedAt = Date.now();
          }
          stu.badges[stageId - 1] = true;
          if (typeof msg.xp === 'number') stu.xp = msg.xp;
          if (typeof msg.level === 'number') stu.level = msg.level;
          if (typeof msg.coins === 'number') stu.coins = msg.coins;
          stu.lastSeen = Date.now();

          scheduleSave();
          broadcastTeacherAnalytics();
        }
      } catch (err) {
        console.warn('Invalid WS message:', err);
      }
    });

    ws.on('close', () => {
      sessions.delete(session);
      if (session.studentId) {
        const stuId = session.studentId;
        // Check if another tab for the same student is still connected
        let stillConnected = false;
        for (const s of sessions) {
          if (s.studentId === stuId) {
            stillConnected = true;
            break;
          }
        }
        if (!stillConnected) {
          livePlayers.delete(stuId);
          if (store.students[stuId]) {
            store.students[stuId].online = false;
            store.students[stuId].lastSeen = Date.now();
          }
          broadcastAll({ type: 'player:left', playerId: stuId });
          broadcastTeacherAnalytics();
        }
      }
    });
  });

  // ==================== VITE DEV / PROD STATIC SERVING ====================
  const isProd = process.env.NODE_ENV === 'production';
  const distDir = path.join(__dirname, 'dist');

  if (isProd && fs.existsSync(distDir)) {
    app.use(express.static(distDir));
    app.get('/{*path}', (_req: Request, res: Response) => {
      res.sendFile(path.join(distDir, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true, hmr: false },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  server.listen(PORT, HOST, () => {
    console.log(`Petualangan Cahaya Ilmu server listening at http://${HOST}:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start server:', err);
  process.exit(1);
});
