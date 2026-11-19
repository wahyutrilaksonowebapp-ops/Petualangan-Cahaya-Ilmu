import * as THREE from 'three';
import { CURRICULUM_DATA, StageCurriculum } from './curriculumData.ts';
import { buildAkmMissionDeck, AkmQuizQuestion, DifficultyLevel } from './akmQuestionBank.ts';
import {
  MultiplayerClient,
  MissionConfig,
  LiveRemotePlayer,
  LiveChatMessage,
  TeacherAnalyticsPayload,
  StudentAnalyticsRow,
} from './multiplayerClient.ts';
import { renderTeacherProgressPieChart } from './teacherChart.ts';
import {
  fetchMissionConfig,
  loginStudent,
  loginTeacher,
  fetchTeacherAnalytics,
  saveTeacherMissionConfig,
  recordLocalStudentProgress,
  markLocalStudentOffline,
  exportTeacherCsvReport,
} from './backendService.ts';
import { sound } from './soundEngine.ts';
import { World3D, CostumeType } from './world3d.ts';
import { downloadCertificateAsImage, printCertificate, CertificateInfo } from './certificateGenerator.ts';

declare const confetti: ((options?: {
  particleCount?: number;
  spread?: number;
  origin?: { y?: number; x?: number };
  colors?: string[];
}) => void) | undefined;

interface GameState {
  playerName: string;
  institution: string;
  grade: number;
  season: number;
  costume: CostumeType;
  unlockedCostumes: CostumeType[];
  xp: number;
  level: number;
  coins: number;
  badges: boolean[];
  skills: {
    f5050: boolean;
    shield: boolean;
    doubleXp: boolean;
  };
}

const DEFAULT_MISSION_CONFIG: MissionConfig = {
  questionCounts: { '1': 10, '2': 10, '3': 10, '4': 10, '5': 10 },
  durationPerQuestionSec: 25,
};

function escapeHtml(text: string): string {
  return text
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

class GameApp {
  private world: World3D;
  private multiplayer: MultiplayerClient;
  private state: GameState;

  // Auth & Role state
  private role: 'none' | 'student' | 'teacher' = 'none';
  private studentId: string | null = null;
  private missionConfig: MissionConfig = structuredClone(DEFAULT_MISSION_CONFIG);
  private latestAnalytics: TeacherAnalyticsPayload | null = null;
  private teacherSearchQuery: string = '';

  // Real-time Multiplayer Chat state
  private chatMessages: LiveChatMessage[] = [];
  private activeChatTarget: { id: string; name: string; institution: string } | null = null;

  // Active 3D Airplane "Rintangan Pemahaman" state
  private currentStageCurriculum: StageCurriculum | null = null;
  private currentStageId: number = 1;
  private flightDeck: AkmQuizQuestion[] = [];
  private currentQuestionIdx: number = 0;
  private flightCorrectCount: number = 0;
  private flightAnsweredCount: number = 0;
  private flightQuestionResolved: boolean = false;
  private flightDisabledLanes: number[] = [];
  private playerHearts: number = 3;
  private comboStreak: number = 0;
  private shieldActiveForStage: boolean = false;
  private is5050Used: boolean = false;

  // Input states
  private keys: { [key: string]: boolean } = {};
  private steerButtonAxis: number = 0;
  private joystickVector: THREE.Vector2 = new THREE.Vector2(0, 0);
  private isJoystickActive: boolean = false;

  // TTS & UI Timers
  private nuraDialogueIdx: number = 0;
  private nuraBubbleTimer: number | null = null;
  private toastTimer: number | null = null;

  // Clock
  private clock: THREE.Clock;

  constructor() {
    const canvas = document.getElementById('game-canvas') as HTMLCanvasElement;
    this.world = new World3D(canvas);
    this.multiplayer = new MultiplayerClient();
    this.clock = new THREE.Clock();

    this.state = this.loadState();
    this.world.setCostume(this.state.costume);

    this.initMultiplayerCallbacks();
    this.initFlightCallbacks();
    this.initLoginUI();
    this.initGameUI();
    this.initShopAndSocialFeatures();
    this.initTeacherDashboardUI();
    this.initInputListeners();
    this.updateHUD();
    void this.fetchInitialMissionConfig();

    window.addEventListener('beforeunload', () => {
      markLocalStudentOffline(this.studentId);
    });

    // Start main 3D animation loop
    this.tick();
  }

  private async fetchInitialMissionConfig() {
    this.missionConfig = await fetchMissionConfig();
  }

  private loadState(): GameState {
    const saved = localStorage.getItem('cahaya_ilmu_save_v2');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        return {
          playerName: parsed.playerName || '',
          institution: parsed.institution || 'SDN Kedungringin I Beji',
          grade: parsed.grade || 6,
          season: parsed.season || 1,
          costume: parsed.costume || 'sd',
          unlockedCostumes: Array.isArray(parsed.unlockedCostumes) ? parsed.unlockedCostumes : ['sd'],
          xp: typeof parsed.xp === 'number' ? parsed.xp : 0,
          level: typeof parsed.level === 'number' ? parsed.level : 1,
          coins: typeof parsed.coins === 'number' ? parsed.coins : 80,
          badges: Array.isArray(parsed.badges) && parsed.badges.length === 5 ? parsed.badges : [false, false, false, false, false],
          skills: {
            f5050: Boolean(parsed.skills?.f5050),
            shield: Boolean(parsed.skills?.shield),
            doubleXp: Boolean(parsed.skills?.doubleXp),
          },
        };
      } catch (e) {
        console.warn('Could not parse saved game state:', e);
      }
    }
    return {
      playerName: '',
      institution: 'SDN Kedungringin I Beji',
      grade: 6,
      season: 1,
      costume: 'sd',
      unlockedCostumes: ['sd'],
      xp: 0,
      level: 1,
      coins: 80,
      badges: [false, false, false, false, false],
      skills: {
        f5050: false,
        shield: false,
        doubleXp: false,
      },
    };
  }

  private saveState() {
    localStorage.setItem('cahaya_ilmu_save_v2', JSON.stringify(this.state));
  }

  private showToast(message: string, variant: 'info' | 'success' | 'warn' | 'error' = 'info') {
    const toast = document.getElementById('app-toast');
    if (!toast) return;

    const variantStyles: Record<string, string> = {
      info: 'bg-slate-900/95 border-amber-400/80 text-amber-200',
      success: 'bg-emerald-950/95 border-emerald-400/80 text-emerald-200',
      warn: 'bg-amber-950/95 border-amber-400/90 text-amber-100',
      error: 'bg-red-950/95 border-red-500/80 text-red-200',
    };

    toast.className = `pointer-events-none fixed top-20 left-1/2 -translate-x-1/2 z-[70] px-5 py-2.5 rounded-2xl border text-xs sm:text-sm font-bold shadow-2xl backdrop-blur-xl transition-all ${variantStyles[variant]}`;
    toast.textContent = message;
    toast.classList.remove('hidden');

    if (this.toastTimer) window.clearTimeout(this.toastTimer);
    this.toastTimer = window.setTimeout(() => {
      toast.classList.add('hidden');
    }, 3400);
  }

  private getRankTitle(level: number): string {
    if (level >= 10) return 'Duta Cahaya SDN Kedungringin I Beji';
    if (level >= 8) return 'Ksatria Ibadah';
    if (level >= 5) return 'Penjaga Akhlak';
    if (level >= 3) return 'Penjelajah Tajwid';
    return 'Santri Pemula';
  }

  private getFase(grade: number): string {
    if (grade <= 2) return 'Fase A';
    if (grade <= 4) return 'Fase B';
    return 'Fase C';
  }

  private updateHUD() {
    const pName = document.getElementById('hud-player-name');
    if (pName) pName.textContent = this.state.playerName || 'Santri';

    const instTag = document.getElementById('hud-institution-tag');
    if (instTag) {
      instTag.innerHTML = `<i class="fa-solid fa-school text-xs"></i> ${escapeHtml(this.state.institution || 'SDN Kedungringin I Beji')}`;
    }

    const lvlBadge = document.getElementById('hud-level-badge');
    if (lvlBadge) lvlBadge.textContent = `Lv. ${this.state.level}`;

    const rankTitle = document.getElementById('hud-rank-title');
    if (rankTitle) rankTitle.textContent = this.getRankTitle(this.state.level);

    const xpCurrent = this.state.xp % 100;
    const xpFill = document.getElementById('hud-xp-fill');
    if (xpFill) xpFill.style.width = `${Math.min(100, Math.max(5, xpCurrent))}%`;

    const gradeTag = document.getElementById('hud-grade-tag');
    if (gradeTag) {
      gradeTag.textContent = `Kelas ${this.state.grade} (${this.getFase(this.state.grade)})`;
    }

    const seasonTag = document.getElementById('hud-season-tag');
    if (seasonTag) {
      seasonTag.textContent = `Season ${this.state.season}`;
    }

    const coinsVal = document.getElementById('hud-coins-val');
    if (coinsVal) coinsVal.textContent = this.state.coins.toString();

    for (let i = 0; i < 5; i++) {
      const badgeElem = document.getElementById(`badge-icon-${i + 1}`);
      if (badgeElem) {
        if (this.state.badges[i]) {
          badgeElem.className =
            'w-6 h-6 rounded-lg bg-amber-500/20 border border-amber-400 flex items-center justify-center text-xs text-amber-300 shadow-sm';
        } else {
          badgeElem.className =
            'w-6 h-6 rounded-lg bg-slate-800 border border-slate-700 flex items-center justify-center text-xs text-slate-600 transition-all';
        }
      }
    }

    this.world.evolveNura(this.state.level);
    this.world.setCostume(this.state.costume);
    this.updateOnlineCounterUI();
  }

  private updateOnlineCounterUI() {
    const remoteCount = this.world.remotePlayers.size;
    const totalOnline = this.role === 'student' ? remoteCount + 1 : remoteCount;
    const badge = document.getElementById('hud-online-count');
    if (badge) {
      badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> ${totalOnline} Online`;
    }
    this.refreshSpectatorDropdown();
  }

  private refreshSpectatorDropdown() {
    const select = document.getElementById('select-spectate-student') as HTMLSelectElement | null;
    if (!select) return;

    const players = this.world.getRemotePlayersList();
    const currentSelection = this.world.spectatedPlayerId || select.value;

    select.innerHTML = '';
    if (players.length === 0) {
      const opt = document.createElement('option');
      opt.value = '';
      opt.textContent = 'Menunggu murid online bergabung...';
      select.appendChild(opt);
      return;
    }

    players.forEach((p) => {
      const opt = document.createElement('option');
      opt.value = p.id;
      const locLabel = p.stageId > 0 ? `Dunia ${p.stageId}` : 'Kampus Utama';
      opt.textContent = `${p.name} • ${p.institution} (${locLabel})`;
      if (p.id === currentSelection) opt.selected = true;
      select.appendChild(opt);
    });

    if (this.world.isTeacherSpectator && !this.world.spectatedPlayerId && players.length > 0) {
      this.world.spectatedPlayerId = players[0].id;
      select.value = players[0].id;
    }
  }

  private addXp(amount: number) {
    let finalAmount = amount;
    if (this.state.skills.doubleXp && this.comboStreak >= 3) {
      finalAmount *= 2;
    }
    this.state.xp += finalAmount;
    const newLevel = Math.floor(this.state.xp / 100) + 1;
    if (newLevel > this.state.level) {
      this.state.level = newLevel;
      sound.playFanfare();
      this.world.triggerNuraJoy();
      this.showToast(`Naik Level! Sekarang Lv. ${this.state.level} (${this.getRankTitle(this.state.level)})`, 'success');
      if (typeof confetti === 'function') {
        confetti({ particleCount: 70, spread: 80, origin: { y: 0.6 } });
      }
    }
    this.saveState();
    this.updateHUD();
  }

  private addCoins(amount: number) {
    this.state.coins += amount;
    this.saveState();
    this.updateHUD();
  }

  // ==================== MULTIPLAYER REAL-TIME CALLBACKS ====================
  private initMultiplayerCallbacks() {
    this.multiplayer.setCallbacks({
      onConnectionChange: (connected) => {
        const wsStatus = document.getElementById('teacher-ws-status');
        if (wsStatus) {
          if (connected) {
            wsStatus.className =
              'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 flex items-center gap-1.5';
            wsStatus.innerHTML = '<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span> LIVE SYNC';
          } else {
            wsStatus.className =
              'px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-500/20 border border-amber-400/50 text-amber-300 flex items-center gap-1.5';
            wsStatus.innerHTML = '<span class="w-2 h-2 rounded-full bg-amber-400"></span> MENYAMBUNG...';
          }
        }
      },
      onPlayersSnapshot: (players: LiveRemotePlayer[]) => {
        this.world.syncRemotePlayersSnapshot(players, this.studentId);
        this.updateOnlineCounterUI();
      },
      onPlayerJoined: (player: LiveRemotePlayer) => {
        this.world.upsertRemotePlayer(player, this.studentId);
        this.updateOnlineCounterUI();
        if (this.role === 'student' && player.id !== this.studentId) {
          this.showToast(`${player.name} (${player.institution}) baru saja bergabung!`, 'info');
        }
      },
      onPlayerMoved: (player: LiveRemotePlayer) => {
        this.world.upsertRemotePlayer(player, this.studentId);
        if (this.world.isTeacherSpectator) {
          this.refreshSpectatorDropdown();
        }
      },
      onPlayerLeft: (playerId: string) => {
        this.world.removeRemotePlayer(playerId);
        this.updateOnlineCounterUI();
      },
      onChatHistory: (messages: LiveChatMessage[]) => {
        this.chatMessages = messages;
        this.renderChatMessages();
      },
      onChatMessage: (message: LiveChatMessage) => {
        this.chatMessages.push(message);
        if (this.chatMessages.length > 80) this.chatMessages.shift();
        this.renderChatMessages();

        const chatModal = document.getElementById('modal-chat');
        const isClosed = chatModal?.classList.contains('hidden');
        if (isClosed && this.role === 'student' && message.fromId !== this.studentId) {
          sound.playDing();
          this.showToast(`💬 ${message.fromName}: "${message.text.slice(0, 50)}"`, 'info');
        }
      },
      onMissionConfig: (config: MissionConfig) => {
        this.missionConfig = config;
        this.syncMissionConfigInputs();
      },
      onAnalyticsUpdate: (data: TeacherAnalyticsPayload) => {
        this.latestAnalytics = data;
        this.missionConfig = data.missionConfig;
        if (this.role === 'teacher') {
          this.renderTeacherDashboard(data);
        }
      },
    });
  }

  // ==================== DUAL LOGIN UI (AKUN MURID & AKUN GURU) ====================
  private initLoginUI() {
    const tabStudent = document.getElementById('tab-login-student');
    const tabTeacher = document.getElementById('tab-login-teacher');
    const formStudent = document.getElementById('form-start-game') as HTMLFormElement | null;
    const formTeacher = document.getElementById('form-teacher-login') as HTMLFormElement | null;
    const studentError = document.getElementById('student-login-error');
    const teacherError = document.getElementById('teacher-login-error');

    const switchTab = (mode: 'student' | 'teacher') => {
      sound.playButtonClick();
      studentError?.classList.add('hidden');
      teacherError?.classList.add('hidden');

      if (mode === 'student') {
        tabStudent?.classList.add('bg-gradient-to-r', 'from-amber-500', 'to-yellow-400', 'text-slate-950', 'font-extrabold', 'shadow-md');
        tabStudent?.classList.remove('bg-transparent', 'text-slate-300');
        tabTeacher?.classList.remove('bg-gradient-to-r', 'from-emerald-500', 'to-teal-400', 'text-slate-950', 'font-extrabold', 'shadow-md');
        tabTeacher?.classList.add('bg-transparent', 'text-slate-300');
        formStudent?.classList.remove('hidden');
        formTeacher?.classList.add('hidden');
      } else {
        tabTeacher?.classList.add('bg-gradient-to-r', 'from-emerald-500', 'to-teal-400', 'text-slate-950', 'font-extrabold', 'shadow-md');
        tabTeacher?.classList.remove('bg-transparent', 'text-slate-300');
        tabStudent?.classList.remove('bg-gradient-to-r', 'from-amber-500', 'to-yellow-400', 'text-slate-950', 'font-extrabold', 'shadow-md');
        tabStudent?.classList.add('bg-transparent', 'text-slate-300');
        formTeacher?.classList.remove('hidden');
        formStudent?.classList.add('hidden');
      }
    };

    tabStudent?.addEventListener('click', () => switchTab('student'));
    tabTeacher?.addEventListener('click', () => switchTab('teacher'));

    // Pre-fill Student Login inputs
    const inputName = document.getElementById('input-player-name') as HTMLInputElement | null;
    const inputInstitution = document.getElementById('input-institution') as HTMLInputElement | null;
    const selGrade = document.getElementById('select-grade') as HTMLSelectElement | null;
    const selSeason = document.getElementById('select-season') as HTMLSelectElement | null;

    if (inputName && this.state.playerName) inputName.value = this.state.playerName;
    if (inputInstitution && this.state.institution) inputInstitution.value = this.state.institution;
    if (selGrade) selGrade.value = String(this.state.grade);
    if (selSeason) selSeason.value = String(this.state.season);

    // 1. Student Login Submit
    formStudent?.addEventListener('submit', async (e) => {
      e.preventDefault();
      sound.playButtonClick();
      studentError?.classList.add('hidden');

      const name = inputName?.value.trim() || '';
      const institution = inputInstitution?.value.trim() || '';
      const grade = parseInt(selGrade?.value || '6', 10) || 6;
      const season = parseInt(selSeason?.value || '1', 10) || 1;
      const checkedCostume = document.querySelector('input[name="costume-radio"]:checked') as HTMLInputElement | null;
      const costume = (checkedCostume?.value || 'sd') as CostumeType;

      if (!name || !institution) {
        if (studentError) {
          studentError.textContent = 'Nama Murid dan Nama Lembaga wajib diisi.';
          studentError.classList.remove('hidden');
        }
        return;
      }

      const submitBtn = document.getElementById('btn-student-login-submit') as HTMLButtonElement | null;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const result = await loginStudent({ name, institution, grade, season, costume });
        if (!result.ok) {
          throw new Error(result.error);
        }

        const srvStudent = result.student;
        this.missionConfig = result.missionConfig;

        this.role = 'student';
        this.studentId = srvStudent.id;
        this.state.playerName = srvStudent.name;
        this.state.institution = srvStudent.institution;
        this.state.grade = srvStudent.grade;
        this.state.season = srvStudent.season;
        this.state.costume = (srvStudent.costume as CostumeType) || costume;
        if (!this.state.unlockedCostumes.includes(this.state.costume)) {
          this.state.unlockedCostumes.push(this.state.costume);
        }
        this.state.xp = Math.max(this.state.xp, srvStudent.xp || 0);
        this.state.level = Math.max(this.state.level, srvStudent.level || 1);
        this.state.coins = Math.max(this.state.coins, srvStudent.coins || 80);
        if (Array.isArray(srvStudent.badges) && srvStudent.badges.length === 5) {
          this.state.badges = srvStudent.badges.map((b, idx) => Boolean(b || this.state.badges[idx]));
        }

        this.saveState();
        this.world.setTeacherSpectatorMode(false, null);
        this.world.returnToCampusLobby();
        this.updateHUD();

        // Connect WebSocket (or BroadcastChannel fallback if running on static preview)
        this.multiplayer.connect(
          {
            role: 'student',
            studentId: this.studentId,
            name: this.state.playerName,
            institution: this.state.institution,
            grade: this.state.grade,
            level: this.state.level,
            costume: this.state.costume,
            stageId: 0,
            x: this.world.playerGroup.position.x,
            z: this.world.playerGroup.position.z,
          },
          result.source === 'local'
        );

        document.getElementById('modal-start')?.classList.add('hidden');
        document.getElementById('modal-teacher-dashboard')?.classList.add('hidden');
        document.getElementById('teacher-spectator-bar')?.classList.add('hidden');
        document.getElementById('in-game-hud')?.classList.remove('hidden');
        document.getElementById('in-game-bottom')?.classList.remove('hidden');

        this.showToast(`Selamat datang ${this.state.playerName}! Data progresmu terekam real-time.`, 'success');
      } catch (err) {
        if (studentError) {
          studentError.textContent = err instanceof Error ? err.message : 'Gagal masuk sebagai murid.';
          studentError.classList.remove('hidden');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });

    // 2. Teacher Login Submit (GPAIBEJI / bejo-lan-aji)
    formTeacher?.addEventListener('submit', async (e) => {
      e.preventDefault();
      sound.playButtonClick();
      teacherError?.classList.add('hidden');

      const usernameInput = document.getElementById('input-teacher-username') as HTMLInputElement | null;
      const passwordInput = document.getElementById('input-teacher-password') as HTMLInputElement | null;
      const username = usernameInput?.value.trim() || '';
      const password = passwordInput?.value.trim() || '';

      const submitBtn = document.getElementById('btn-teacher-login-submit') as HTMLButtonElement | null;
      if (submitBtn) submitBtn.disabled = true;

      try {
        const result = await loginTeacher(username, password);
        if (!result.ok) {
          throw new Error(result.error);
        }

        this.role = 'teacher';
        this.studentId = null;
        this.latestAnalytics = result.analytics;
        this.missionConfig = this.latestAnalytics.missionConfig;

        // Connect WebSocket (or BroadcastChannel fallback if running on static preview)
        this.multiplayer.connect({ role: 'teacher' }, result.source === 'local');

        document.getElementById('modal-start')?.classList.add('hidden');
        document.getElementById('in-game-hud')?.classList.add('hidden');
        document.getElementById('in-game-bottom')?.classList.add('hidden');
        document.getElementById('stage-map-hud')?.classList.add('hidden');

        this.openTeacherDashboardModal();
        this.showToast('Login Guru berhasil! Dashboard real-time aktif.', 'success');
      } catch (err) {
        sound.playBuzz();
        if (teacherError) {
          teacherError.textContent = err instanceof Error ? err.message : 'Login Guru gagal.';
          teacherError.classList.remove('hidden');
        }
      } finally {
        if (submitBtn) submitBtn.disabled = false;
      }
    });
  }

  private logoutToLoginScreen() {
    sound.playButtonClick();
    this.stopTTS();
    markLocalStudentOffline(this.studentId);
    if (this.world.inFlightMode) {
      this.world.exitFlightChallenge();
      document.getElementById('modal-battle')?.classList.add('hidden');
    }
    this.world.setTeacherSpectatorMode(false, null);
    this.multiplayer.disconnect();
    this.role = 'none';
    this.studentId = null;

    // Hide all game overlays and return to dual login
    [
      'in-game-hud',
      'in-game-bottom',
      'stage-map-hud',
      'teacher-spectator-bar',
      'modal-teacher-dashboard',
      'modal-materi',
      'modal-battle',
      'modal-chat',
      'modal-shop',
      'modal-skilltree',
      'modal-badges',
      'modal-certificate',
      'modal-victory',
    ].forEach((id) => document.getElementById(id)?.classList.add('hidden'));

    document.getElementById('modal-start')?.classList.remove('hidden');
  }

  // ==================== TEACHER MODE DASHBOARD (RECHARTS + TABLE + ADMIN + CSV) ====================
  private initTeacherDashboardUI() {
    // Save Mission Config (10-15 questions per element + duration)
    document.getElementById('btn-save-mission-config')?.addEventListener('click', async () => {
      sound.playButtonClick();
      const questionCounts: Record<string, number> = {};
      for (let st = 1; st <= 5; st++) {
        const inp = document.getElementById(`cfg-stage-${st}`) as HTMLInputElement | null;
        const val = Math.max(10, Math.min(15, parseInt(inp?.value || '10', 10) || 10));
        if (inp) inp.value = String(val);
        questionCounts[String(st)] = val;
      }
      const durInp = document.getElementById('cfg-duration-sec') as HTMLInputElement | null;
      const durationPerQuestionSec = Math.max(12, Math.min(45, parseInt(durInp?.value || '25', 10) || 25));
      if (durInp) durInp.value = String(durationPerQuestionSec);

      const statusEl = document.getElementById('mission-config-status');
      try {
        this.missionConfig = await saveTeacherMissionConfig(questionCounts, durationPerQuestionSec);
        sound.playDing();
        if (statusEl) {
          statusEl.textContent = `✓ Tersimpan & diterapkan real-time (${this.missionConfig.durationPerQuestionSec} dtk/soal)`;
        }
        this.showToast('Pengaturan Misi AKM berhasil diterapkan ke semua murid!', 'success');
      } catch {
        if (statusEl) statusEl.textContent = 'Gagal menyimpan pengaturan misi.';
      }
    });

    // Export CSV Analysis Report (server CSV or client-side Blob fallback)
    document.getElementById('btn-teacher-export-csv')?.addEventListener('click', () => {
      sound.playButtonClick();
      void exportTeacherCsvReport(this.latestAnalytics);
      this.showToast('Mengunduh laporan analisis tugas murid (.CSV)...', 'success');
    });

    // Switch to Live 3D Spectator Mode
    document.getElementById('btn-teacher-watch-3d')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.enterTeacher3DSpectator(null);
    });

    // Return to Teacher Dashboard from 3D Spectator Bar
    document.getElementById('btn-open-teacher-dashboard-from-bar')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.openTeacherDashboardModal();
    });

    // Logout from Teacher Dashboard or Spectator Bar
    document.getElementById('btn-teacher-logout')?.addEventListener('click', () => this.logoutToLoginScreen());
    document.getElementById('btn-exit-spectator')?.addEventListener('click', () => this.logoutToLoginScreen());

    // Change Spectated Online Student
    document.getElementById('select-spectate-student')?.addEventListener('change', (e) => {
      const selectedId = (e.target as HTMLSelectElement).value || null;
      sound.playButtonClick();
      this.world.spectatedPlayerId = selectedId;
    });

    // Real-time search filter in Teacher Table
    document.getElementById('input-teacher-search')?.addEventListener('input', (e) => {
      this.teacherSearchQuery = ((e.target as HTMLInputElement).value || '').trim().toLowerCase();
      if (this.latestAnalytics) {
        this.renderTeacherStudentsTable(this.latestAnalytics.students);
      }
    });
  }

  private enterTeacher3DSpectator(targetPlayerId: string | null) {
    document.getElementById('modal-teacher-dashboard')?.classList.add('hidden');
    document.getElementById('teacher-spectator-bar')?.classList.remove('hidden');

    const players = this.world.getRemotePlayersList();
    const chosenId = targetPlayerId || (players.length > 0 ? players[0].id : null);
    this.world.setTeacherSpectatorMode(true, chosenId);
    this.refreshSpectatorDropdown();

    const select = document.getElementById('select-spectate-student') as HTMLSelectElement | null;
    if (select && chosenId) select.value = chosenId;
  }

  private async openTeacherDashboardModal() {
    document.getElementById('teacher-spectator-bar')?.classList.add('hidden');
    document.getElementById('modal-teacher-dashboard')?.classList.remove('hidden');

    if (this.latestAnalytics) {
      this.renderTeacherDashboard(this.latestAnalytics);
    }

    const fresh = await fetchTeacherAnalytics();
    this.latestAnalytics = fresh;
    this.missionConfig = fresh.missionConfig;
    this.renderTeacherDashboard(fresh);
  }

  private syncMissionConfigInputs() {
    for (let st = 1; st <= 5; st++) {
      const inp = document.getElementById(`cfg-stage-${st}`) as HTMLInputElement | null;
      if (inp && document.activeElement !== inp) {
        inp.value = String(this.missionConfig.questionCounts[String(st)] ?? 10);
      }
    }
    const durInp = document.getElementById('cfg-duration-sec') as HTMLInputElement | null;
    if (durInp && document.activeElement !== durInp) {
      durInp.value = String(this.missionConfig.durationPerQuestionSec ?? 25);
    }
  }

  private renderTeacherDashboard(data: TeacherAnalyticsPayload) {
    // 1. KPI Summary Cards
    const elTotal = document.getElementById('stat-total-students');
    const elOnline = document.getElementById('stat-online-students');
    const elAcc = document.getElementById('stat-avg-accuracy');
    const elAns = document.getElementById('stat-total-answered');
    const elBadges = document.getElementById('stat-total-badges');

    if (elTotal) elTotal.textContent = String(data.summary.totalStudents);
    if (elOnline) elOnline.textContent = String(data.summary.onlineStudents);
    if (elAcc) elAcc.textContent = `${data.summary.avgAccuracy}%`;
    if (elAns) elAns.textContent = `${data.summary.totalAnsweredQuestions} soal terjawab`;
    if (elBadges) elBadges.textContent = String(data.summary.totalBadgesEarned);

    // 2. Mount/Update Recharts Pie Chart for 5 Worlds Progress Distribution
    const chartMount = document.getElementById('teacher-recharts-pie-mount');
    renderTeacherProgressPieChart(chartMount, data.worldDistribution);

    // 3. AKM Difficulty Breakdown (10% Mudah / 60% Sedang / 30% Sulit)
    const fmtDiff = (bucket: { correct: number; total: number }) => {
      if (!bucket.total) return '0% (0/0)';
      const pct = Math.round((bucket.correct / bucket.total) * 100);
      return `${pct}% (${bucket.correct}/${bucket.total})`;
    };
    const elMudah = document.getElementById('stat-diff-mudah');
    const elSedang = document.getElementById('stat-diff-sedang');
    const elSulit = document.getElementById('stat-diff-sulit');
    if (elMudah) elMudah.textContent = fmtDiff(data.difficultyAggregate.mudah);
    if (elSedang) elSedang.textContent = fmtDiff(data.difficultyAggregate.sedang);
    if (elSulit) elSulit.textContent = fmtDiff(data.difficultyAggregate.sulit);

    // 4. Sync Mission Admin inputs
    this.syncMissionConfigInputs();

    // 5. Render Real-Time Student Performance Table
    this.renderTeacherStudentsTable(data.students);
  }

  private renderTeacherStudentsTable(students: StudentAnalyticsRow[]) {
    const tbody = document.getElementById('teacher-students-tbody');
    if (!tbody) return;

    const q = this.teacherSearchQuery;
    const filtered = q
      ? students.filter(
          (s) =>
            s.name.toLowerCase().includes(q) ||
            s.institution.toLowerCase().includes(q)
        )
      : students;

    if (filtered.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="7" class="py-8 text-center text-slate-400 italic">
            ${students.length === 0
              ? 'Belum ada murid yang masuk. Bagikan tautan game ini agar murid login dan datanya tampil real-time.'
              : 'Tidak ada murid yang cocok dengan pencarian.'}
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = '';
    const stageColors = ['text-emerald-300', 'text-purple-300', 'text-amber-300', 'text-sky-300', 'text-pink-300'];

    filtered.forEach((s) => {
      let totalCorrect = 0;
      let totalAnswered = 0;
      const worldBadgesHtml = [1, 2, 3, 4, 5]
        .map((stId, idx) => {
          const stat = s.stageStats[String(stId)];
          if (stat) {
            totalCorrect += stat.totalCorrect;
            totalAnswered += stat.totalAnswered;
          }
          const score = stat && stat.totalAnswered > 0 ? `${stat.bestScore}%` : '-';
          const done = stat?.completed || s.badges[idx];
          return `<span class="inline-flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-bold ${
            done
              ? 'bg-emerald-500/20 border border-emerald-400/50 text-emerald-200'
              : 'bg-slate-900 border border-slate-700 ' + stageColors[idx]
          }" title="Dunia ${stId}">E${stId}:${score}</span>`;
        })
        .join(' ');

      const acc = totalAnswered > 0 ? Math.round((totalCorrect / totalAnswered) * 100) : 0;
      const dM = s.difficultyStats.mudah;
      const dS = s.difficultyStats.sedang;
      const dH = s.difficultyStats.sulit;
      const fmtB = (b: { correct: number; total: number }) => (b.total > 0 ? `${Math.round((b.correct / b.total) * 100)}%` : '-');

      const tr = document.createElement('tr');
      tr.className = 'hover:bg-slate-900/70 transition-colors';
      tr.innerHTML = `
        <td class="py-2.5 px-2">
          <div class="font-bold text-white">${escapeHtml(s.name)}</div>
          <div class="text-[11px] text-slate-400">${escapeHtml(s.institution)}</div>
        </td>
        <td class="py-2.5 px-2">
          ${
            s.online
              ? `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-400/50 text-emerald-300 text-[10px] font-bold"><span class="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span> Online</span>`
              : `<span class="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-400 text-[10px] font-semibold">Offline</span>`
          }
        </td>
        <td class="py-2.5 px-2 text-slate-200 font-semibold whitespace-nowrap">Kls ${s.grade} • S${s.season}</td>
        <td class="py-2.5 px-2">
          <div class="flex flex-wrap gap-1">${worldBadgesHtml}</div>
        </td>
        <td class="py-2.5 px-2 font-mono text-[11px] whitespace-nowrap">
          <span class="text-emerald-300">${fmtB(dM)}</span> /
          <span class="text-amber-300">${fmtB(dS)}</span> /
          <span class="text-rose-300">${fmtB(dH)}</span>
        </td>
        <td class="py-2.5 px-2 whitespace-nowrap">
          <div class="font-extrabold ${acc >= 75 ? 'text-emerald-300' : acc >= 50 ? 'text-amber-300' : 'text-slate-300'}">${acc}% <span class="text-[10px] text-slate-400 font-normal">(${totalCorrect}/${totalAnswered})</span></div>
          <div class="text-[10px] text-amber-400">Lv.${s.level} • ${s.xp} XP</div>
        </td>
        <td class="py-2.5 px-2 text-right whitespace-nowrap">
          ${
            s.online
              ? `<button data-watch-id="${escapeHtml(s.id)}" class="btn-watch-student px-2.5 py-1 rounded-lg bg-sky-600/80 hover:bg-sky-500 text-white font-bold text-[10px] transition-colors"><i class="fa-solid fa-eye mr-1"></i>Pantau 3D</button>`
              : `<span class="text-[10px] text-slate-500">—</span>`
          }
        </td>
      `;

      const watchBtn = tr.querySelector('.btn-watch-student');
      watchBtn?.addEventListener('click', () => {
        sound.playButtonClick();
        this.enterTeacher3DSpectator(s.id);
      });

      tbody.appendChild(tr);
    });
  }

  // ==================== 3D AIRPLANE "RINTANGAN PEMAHAMAN" CALLBACKS ====================
  private initFlightCallbacks() {
    const letters = ['A', 'B', 'C', 'D'];

    this.world.onFlightLaneChange = (laneIndex: number) => {
      const indicator = document.getElementById('flight-lane-indicator');
      if (indicator) {
        indicator.textContent = `Jalur Aktif Pesawat: ${letters[laneIndex] || 'B'}`;
      }
      this.highlightActiveLaneOption(laneIndex);
    };

    this.world.onFlightTimerTick = (remainingSec: number, progress: number) => {
      const timerText = document.getElementById('flight-timer-text');
      const timerBar = document.getElementById('flight-timer-bar');
      if (timerText) {
        timerText.textContent = `${Math.max(0, remainingSec).toFixed(1)} dtk`;
      }
      if (timerBar) {
        const pctLeft = Math.max(0, Math.min(100, (1 - progress) * 100));
        timerBar.style.width = `${pctLeft}%`;
        if (pctLeft < 25) {
          timerBar.className = 'h-full bg-gradient-to-r from-rose-500 to-amber-500 transition-all duration-100';
        } else if (pctLeft < 55) {
          timerBar.className = 'h-full bg-gradient-to-r from-amber-400 to-yellow-300 transition-all duration-100';
        } else {
          timerBar.className = 'h-full bg-gradient-to-r from-emerald-400 via-sky-400 to-amber-400 transition-all duration-100';
        }
      }
    };

    this.world.onFlightAnswerReached = (laneIndex: number) => {
      this.resolveFlightAnswer(laneIndex);
    };
  }

  private highlightActiveLaneOption(activeLane: number) {
    if (this.flightQuestionResolved) return;
    for (let i = 0; i < 4; i++) {
      const btn = document.getElementById(`quiz-opt-btn-${i}`) as HTMLButtonElement | null;
      if (!btn || btn.disabled) continue;
      if (i === activeLane) {
        btn.className =
          'p-2.5 sm:p-3 rounded-2xl bg-amber-500/20 border-2 border-amber-400 text-left text-xs sm:text-sm font-bold flex items-center gap-2.5 transition-all shadow-lg ring-2 ring-amber-400/40 scale-[1.01]';
      } else {
        btn.className =
          'p-2.5 sm:p-3 rounded-2xl bg-slate-800/85 border border-slate-700 hover:border-sky-400 text-left text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all';
      }
    }
  }

  // ==================== GENERAL GAME UI BINDINGS ====================
  private initGameUI() {
    // Proximity Enter Button (Campus Portal -> Stage 3D Map)
    document.getElementById('btn-enter-stage-prompt')?.addEventListener('click', () => {
      sound.playButtonClick();
      if (this.world.activeNearPortal) {
        this.enterStageWorld(this.world.activeNearPortal.stageId);
      }
    });

    // Biome Gate Enter Button
    document.getElementById('btn-enter-biome-gate')?.addEventListener('click', () => {
      sound.playButtonClick();
      if (this.world.activeNearBiomeGate) {
        this.handleBiomeGateInteract(this.world.activeNearBiomeGate);
      }
    });

    // Stage Map HUD Buttons
    document.getElementById('btn-stage-open-materi')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.openMateriModal(this.currentStageId);
    });
    document.getElementById('btn-stage-start-boss')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.stopTTS();
      this.startFlightChallenge();
    });
    document.getElementById('btn-return-campus')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.exitStageToCampus();
    });

    // Touch Action Button
    document.getElementById('btn-touch-action')?.addEventListener('click', () => {
      sound.playButtonClick();
      if (this.world.activeNearPortal) {
        this.enterStageWorld(this.world.activeNearPortal.stageId);
      } else if (this.world.activeNearBiomeGate) {
        this.handleBiomeGateInteract(this.world.activeNearBiomeGate);
      } else if (this.world.activeNearRemotePlayer) {
        this.openChatModal({
          id: this.world.activeNearRemotePlayer.id,
          name: this.world.activeNearRemotePlayer.name,
          institution: this.world.activeNearRemotePlayer.institution,
        });
      }
    });

    // Materi Modal Buttons
    const closeMateri = () => {
      sound.playButtonClick();
      this.stopTTS();
      document.getElementById('modal-materi')?.classList.add('hidden');
    };
    document.getElementById('btn-close-materi')?.addEventListener('click', closeMateri);
    document.getElementById('btn-cancel-materi')?.addEventListener('click', closeMateri);

    document.getElementById('btn-start-quiz-battle')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.stopTTS();
      document.getElementById('modal-materi')?.classList.add('hidden');
      this.startFlightChallenge();
    });

    // TTS Buttons
    document.getElementById('btn-tts-play')?.addEventListener('click', () => this.playTTS());
    document.getElementById('btn-tts-stop')?.addEventListener('click', () => this.stopTTS());

    // Flight Challenge Lifelines & Controls
    document.getElementById('skill-5050')?.addEventListener('click', () => this.use5050());
    document.getElementById('skill-shield')?.addEventListener('click', () => this.useShield());
    document.getElementById('skill-hint')?.addEventListener('click', () => this.useHint());

    document.getElementById('btn-flight-boost')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.world.boostAirplaneToAnswer();
    });

    document.getElementById('btn-exit-flight')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.abortFlightChallenge();
    });

    // On-screen Steer Left / Right Buttons (both tap to change lane and hold for smooth steer)
    const bindSteerBtn = (id: string, dir: number) => {
      const btn = document.getElementById(id);
      if (!btn) return;
      const onDown = (e: Event) => {
        e.preventDefault();
        this.steerButtonAxis = dir;
        const nextLane = Math.max(0, Math.min(3, this.world.flightActiveLane + dir));
        this.world.selectAirplaneLane(nextLane);
      };
      const onUp = () => {
        if (this.steerButtonAxis === dir) this.steerButtonAxis = 0;
      };
      btn.addEventListener('pointerdown', onDown);
      btn.addEventListener('pointerup', onUp);
      btn.addEventListener('pointerleave', onUp);
      btn.addEventListener('pointercancel', onUp);
    };
    bindSteerBtn('btn-steer-left', -1);
    bindSteerBtn('btn-steer-right', 1);

    // Next Question Button
    document.getElementById('btn-next-question')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.advanceFlightQuestion();
    });

    // Victory Modal Buttons
    document.getElementById('btn-victory-continue')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-victory')?.classList.add('hidden');
      this.exitStageToCampus();
    });

    document.getElementById('btn-victory-view-cert')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-victory')?.classList.add('hidden');
      this.exitStageToCampus();
      this.openCertificateModal();
    });

    // Skill Tree Modal
    document.getElementById('btn-open-skilltree')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.openSkillTreeModal();
    });
    document.getElementById('btn-close-skilltree')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-skilltree')?.classList.add('hidden');
    });

    document.getElementById('btn-buy-skill-5050')?.addEventListener('click', () => this.buySkill('f5050', 100));
    document.getElementById('btn-buy-skill-shield')?.addEventListener('click', () => this.buySkill('shield', 150));
    document.getElementById('btn-buy-skill-double')?.addEventListener('click', () => this.buySkill('doubleXp', 200));

    // Badges Modal
    document.getElementById('btn-open-badges')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.openBadgesModal();
    });
    document.getElementById('btn-close-badges')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-badges')?.classList.add('hidden');
    });

    // Certificate Modal
    document.getElementById('btn-open-certificate')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.openCertificateModal();
    });
    document.getElementById('btn-close-cert')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-certificate')?.classList.add('hidden');
    });

    document.getElementById('btn-download-cert-img')?.addEventListener('click', () => {
      sound.playButtonClick();
      const certInfo: CertificateInfo = {
        playerName: this.state.playerName,
        grade: this.state.grade,
        fase: this.getFase(this.state.grade),
        season: this.state.season,
        rankTitle: this.getRankTitle(this.state.level),
        totalXp: this.state.xp,
        badges: this.state.badges,
      };
      downloadCertificateAsImage(certInfo);
    });

    document.getElementById('btn-print-cert')?.addEventListener('click', () => {
      sound.playButtonClick();
      printCertificate();
    });

    // Switch Account / Logout
    document.getElementById('btn-reset-character')?.addEventListener('click', () => {
      this.logoutToLoginScreen();
    });

    // Audio Toggle
    document.getElementById('btn-toggle-sound')?.addEventListener('click', () => {
      const isMuted = sound.toggleMute();
      const icon = document.getElementById('sound-icon');
      if (icon) {
        icon.className = isMuted ? 'fa-solid fa-volume-xmark text-red-400' : 'fa-solid fa-volume-high';
      }
    });

    // Nura Voice Assistant
    this.world.onNuraClicked = () => this.handleNuraVoiceInteraction();
    document.getElementById('btn-nura-hud')?.addEventListener('click', () => {
      this.handleNuraVoiceInteraction();
    });
    document.getElementById('btn-close-nura-bubble')?.addEventListener('click', () => {
      this.closeNuraSpeech();
    });
  }

  // ==================== TOKO BAJU & REAL-TIME LIVE CHAT ====================
  private initShopAndSocialFeatures() {
    document.getElementById('btn-open-shop')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.refreshShopUI();
      document.getElementById('modal-shop')?.classList.remove('hidden');
    });

    document.getElementById('btn-close-shop')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-shop')?.classList.add('hidden');
    });

    document.querySelectorAll('.btn-buy-costume').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const costume = target.getAttribute('data-costume') as CostumeType;
        const price = parseInt(target.getAttribute('data-price') || '0', 10);
        this.handleBuyOrEquipCostume(costume, price);
      });
    });

    document.querySelectorAll('.btn-equip-costume').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const target = e.currentTarget as HTMLButtonElement;
        const costume = target.getAttribute('data-costume') as CostumeType;
        this.handleBuyOrEquipCostume(costume, 0);
      });
    });

    // Open Live Chat (Proximity "Ngobrol yuk!" with real remote player)
    document.getElementById('btn-trigger-chat')?.addEventListener('click', () => {
      if (this.world.activeNearRemotePlayer) {
        sound.playDing();
        this.openChatModal({
          id: this.world.activeNearRemotePlayer.id,
          name: this.world.activeNearRemotePlayer.name,
          institution: this.world.activeNearRemotePlayer.institution,
        });
      }
    });

    // Open Live Room Chat from HUD
    document.getElementById('btn-open-room-chat')?.addEventListener('click', () => {
      sound.playButtonClick();
      this.openChatModal(null);
    });

    document.getElementById('btn-close-chat')?.addEventListener('click', () => {
      sound.playButtonClick();
      document.getElementById('modal-chat')?.classList.add('hidden');
    });

    // Quick Replies -> Broadcast real-time
    document.querySelectorAll('.btn-quick-reply').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        const reply = (e.currentTarget as HTMLButtonElement).getAttribute('data-reply') || '';
        if (!reply || this.role !== 'student') return;
        sound.playDing();
        this.multiplayer.sendChat(reply, this.activeChatTarget?.id, this.activeChatTarget?.name);
      });
    });

    // Chat Message Form Submit
    const chatForm = document.getElementById('form-chat-send') as HTMLFormElement | null;
    chatForm?.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = document.getElementById('input-chat-message') as HTMLInputElement | null;
      const text = input?.value.trim() || '';
      if (!text || this.role !== 'student') return;

      sound.playButtonClick();
      this.multiplayer.sendChat(text, this.activeChatTarget?.id, this.activeChatTarget?.name);
      if (input) input.value = '';
    });
  }

  private openChatModal(target: { id: string; name: string; institution: string } | null) {
    this.activeChatTarget = target;
    const peerName = document.getElementById('chat-peer-name');
    const peerTitle = document.getElementById('chat-peer-title');

    if (target) {
      if (peerName) peerName.textContent = `Ngobrol dengan ${target.name}`;
      if (peerTitle) peerTitle.textContent = `${target.institution} • Terhubung Real-Time`;
    } else {
      if (peerName) peerName.textContent = 'Ruang Obrolan Pemain';
      if (peerTitle) peerTitle.textContent = `Semua pemain dalam 1 tautan (${this.world.remotePlayers.size + 1} online)`;
    }

    this.renderChatMessages();
    document.getElementById('modal-chat')?.classList.remove('hidden');
    const input = document.getElementById('input-chat-message') as HTMLInputElement | null;
    input?.focus();
  }

  private renderChatMessages() {
    const list = document.getElementById('chat-messages-list');
    if (!list) return;

    if (this.chatMessages.length === 0) {
      list.innerHTML = `<p class="text-slate-500 text-center italic py-8">Belum ada pesan. Sapa kawan-kawan yang bergabung di tautan ini!</p>`;
      return;
    }

    list.innerHTML = '';
    this.chatMessages.forEach((msg) => {
      const isMe = msg.fromId === this.studentId;
      const timeStr = new Date(msg.timestamp).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' });
      const row = document.createElement('div');
      row.className = isMe ? 'flex flex-col items-end' : 'flex flex-col items-start';

      const targetTag = msg.toName ? `<span class="text-amber-300 ml-1">→ @${escapeHtml(msg.toName)}</span>` : '';
      row.innerHTML = `
        <div class="max-w-[85%] rounded-2xl px-3 py-2 ${
          isMe
            ? 'bg-sky-600/80 border border-sky-400/60 text-white'
            : 'bg-slate-800/90 border border-slate-700 text-slate-100'
        }">
          <div class="text-[10px] font-bold ${isMe ? 'text-sky-100' : 'text-amber-300'} mb-0.5">
            ${escapeHtml(msg.fromName)} <span class="text-slate-300 font-normal">(${escapeHtml(msg.fromInstitution)})</span>${targetTag}
          </div>
          <p class="leading-relaxed break-words">${escapeHtml(msg.text)}</p>
          <div class="text-[9px] text-right opacity-70 mt-0.5">${timeStr}</div>
        </div>
      `;
      list.appendChild(row);
    });

    list.scrollTop = list.scrollHeight;
  }

  private refreshShopUI() {
    const coinsVal = document.getElementById('shop-coins-val');
    if (coinsVal) coinsVal.textContent = String(this.state.coins);

    document.querySelectorAll('.btn-buy-costume').forEach((btnElem) => {
      const btn = btnElem as HTMLButtonElement;
      const cType = btn.getAttribute('data-costume') as CostumeType;
      const isOwned = this.state.unlockedCostumes.includes(cType);
      const isEquipped = this.state.costume === cType;

      if (isEquipped) {
        btn.textContent = 'Dipakai';
        btn.className = 'btn-buy-costume px-3 py-1 rounded-xl bg-slate-700 text-slate-300 font-bold text-xs cursor-default';
        btn.disabled = true;
      } else if (isOwned) {
        btn.textContent = 'Pakai';
        btn.className = 'btn-buy-costume px-3 py-1 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-sm';
        btn.disabled = false;
      } else {
        btn.textContent = 'Beli / Tukar';
        btn.className = 'btn-buy-costume px-3 py-1 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm';
        btn.disabled = false;
      }
    });
  }

  private handleBuyOrEquipCostume(costume: CostumeType, price: number) {
    if (this.state.unlockedCostumes.includes(costume)) {
      this.state.costume = costume;
      this.world.setCostume(costume);
      this.saveState();
      this.syncStudentProgressHttp();
      sound.playDing();
      this.refreshShopUI();
      this.showToast('Busana karakter 3D berhasil diganti!', 'success');
      return;
    }

    if (this.state.coins >= price) {
      this.state.coins -= price;
      this.state.unlockedCostumes.push(costume);
      this.state.costume = costume;
      this.world.setCostume(costume);
      this.saveState();
      this.syncStudentProgressHttp();
      sound.playFanfare();
      if (typeof confetti === 'function') {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
      this.updateHUD();
      this.refreshShopUI();
      this.showToast('Busana baru berhasil dibeli dan dipakai!', 'success');
    } else {
      sound.playBuzz();
      this.showToast(`Koin Berkah kurang! Butuh ${price} koin. Selesaikan Rintangan Pemahaman untuk menambah koin.`, 'warn');
    }
  }

  private syncStudentProgressHttp() {
    if (!this.studentId) return;
    recordLocalStudentProgress({
      studentId: this.studentId,
      xp: this.state.xp,
      level: this.state.level,
      coins: this.state.coins,
      badges: this.state.badges,
      costume: this.state.costume,
    });
  }

  // ==================== NURA VOICE ASSISTANT ====================
  public handleNuraVoiceInteraction() {
    sound.playDing();
    this.world.triggerNuraJoy();

    let textToSpeak = '';
    if (this.world.activeNearPortal) {
      const p = this.world.activeNearPortal;
      switch (p.stageId) {
        case 1:
          textToSpeak = `Assalamu'alaikum ${this.state.playerName}! Di Gerbang Al-Qur'an dan Hadis ini, kamu akan menjelajahi keindahan alam Hutan Tajwid dan menerbangkan pesawat 3D di Rintangan Pemahaman!`;
          break;
        case 2:
          textToSpeak = `Wahai ${this.state.playerName}, kamu di dekat Gerbang Puncak Keyakinan! Kokohkan iman dan kuasai Asmaulhusna sebelum terbang melewati kotak jawaban AKM.`;
          break;
        case 3:
          textToSpeak = `Di Gerbang Desa Budi Pekerti ini, mari teladani adab mulia kepada orang tua, guru, dan teman-teman yang bergabung bersamamu!`;
          break;
        case 4:
          textToSpeak = `Kamu berada di dekat Gerbang Simulasi Ibadah! Pahami syarat sah salat, wudu, dan zakat sebelum menghadapi Rintangan Pemahaman.`;
          break;
        case 5:
          textToSpeak = `Di Gerbang Lorong Waktu Sejarah Islam, mari pelajari kisah keteladanan Nabi Muhammad saw. dan para sahabat agung!`;
          break;
        default:
          textToSpeak = `Gerbang ilmu menantimu, ${this.state.playerName}!`;
      }
    } else {
      const generalHints = [
        `Assalamu'alaikum ${this.state.playerName}! Aku Nura, lentera pendampingmu. Dekati salah satu dari lima gerbang cahaya untuk masuk ke map dan menghadapi Rintangan Pemahaman dengan pesawat 3D!`,
        `Di Rintangan Pemahaman, arahkan pesawat 3D dengan tombol panah, mouse, atau layar sentuh menuju kotak jawaban yang benar!`,
        `Kamu juga bisa mendekati teman lain yang bergabung di tautan ini untuk mengobrol langsung bersama mereka!`,
      ];
      textToSpeak = generalHints[this.nuraDialogueIdx % generalHints.length];
      this.nuraDialogueIdx++;
    }

    const bubble = document.getElementById('nura-speech-bubble');
    const bubbleText = document.getElementById('nura-speech-text');
    const wave = document.getElementById('nura-audio-wave');

    if (bubble && bubbleText) {
      bubbleText.textContent = `"${textToSpeak}"`;
      bubble.classList.remove('hidden');
      if (wave) wave.classList.remove('hidden');
    }

    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(textToSpeak);
      utter.lang = 'id-ID';
      utter.rate = 0.98;
      utter.pitch = 1.15;
      utter.onend = utter.onerror = () => {
        if (wave) wave.classList.add('hidden');
      };
      window.speechSynthesis.speak(utter);
    }

    if (this.nuraBubbleTimer) clearTimeout(this.nuraBubbleTimer);
    this.nuraBubbleTimer = window.setTimeout(() => {
      this.closeNuraSpeech();
    }, 9000);
  }

  public closeNuraSpeech() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
    }
    document.getElementById('nura-speech-bubble')?.classList.add('hidden');
    if (this.nuraBubbleTimer) {
      clearTimeout(this.nuraBubbleTimer);
      this.nuraBubbleTimer = null;
    }
  }

  // ==================== STAGE WORLD & MATERI ====================
  private enterStageWorld(stageId: number) {
    this.currentStageId = stageId;
    const seasonData = CURRICULUM_DATA[this.state.season];
    const gradeData = seasonData ? seasonData[this.state.grade] : null;
    const stageCurriculum = gradeData ? gradeData[stageId] : null;
    if (!stageCurriculum) return;

    this.currentStageCurriculum = stageCurriculum;
    this.world.enterStageBiome(stageId);
    sound.playPortalEnter();
    this.world.triggerNuraJoy();

    const mapHud = document.getElementById('stage-map-hud');
    const mapBadge = document.getElementById('stage-map-badge');
    const mapTitle = document.getElementById('stage-map-title');

    const mapNames: Record<number, string> = {
      1: "Keindahan Alam • Pintu Awal Hutan Tajwid, Al-Qur'an, Hadis & Hijaiyah",
      2: 'Puncak Keyakinan • Altar Langit Tauhid & Asmaulhusna',
      3: 'Desa Budi Pekerti • Pendopo Adab & Toleransi',
      4: 'Simulasi Ibadah • Serambi Masjid Agung & Fikih',
      5: 'Lorong Waktu • Observatorium Sejarah Islam',
    };

    if (mapBadge) mapBadge.textContent = `Map Stage ${stageId}`;
    if (mapTitle) mapTitle.textContent = mapNames[stageId] || stageCurriculum.title;
    mapHud?.classList.remove('hidden');

    // Broadcast stage switch immediately to multiplayer peers & teacher
    if (this.role === 'student') {
      this.multiplayer.sendMove(
        {
          x: this.world.playerGroup.position.x,
          y: this.world.playerGroup.position.y,
          z: this.world.playerGroup.position.z,
          rotY: this.world.playerGroup.rotation.y,
          stageId,
          costume: this.state.costume,
          level: this.state.level,
          isMoving: false,
        },
        true
      );
    }
  }

  private exitStageToCampus() {
    this.stopTTS();
    document.getElementById('modal-materi')?.classList.add('hidden');
    document.getElementById('stage-map-hud')?.classList.add('hidden');
    document.getElementById('prompt-biome-gate')?.classList.add('hidden');
    this.world.returnToCampusLobby();

    if (this.role === 'student') {
      this.multiplayer.sendMove(
        {
          x: this.world.playerGroup.position.x,
          y: this.world.playerGroup.position.y,
          z: this.world.playerGroup.position.z,
          rotY: this.world.playerGroup.rotation.y,
          stageId: 0,
          costume: this.state.costume,
          level: this.state.level,
          isMoving: false,
        },
        true
      );
    }
  }

  private handleBiomeGateInteract(gate: { id: string; stageId: number; name: string; description: string }) {
    if (gate.id.endsWith('-boss')) {
      this.startFlightChallenge();
    } else {
      this.openMateriModal(gate.stageId, { name: gate.name, description: gate.description });
    }
  }

  private openMateriModal(stageId: number, forestGateContext?: { name: string; description: string }) {
    this.currentStageId = stageId;
    const seasonData = CURRICULUM_DATA[this.state.season];
    const gradeData = seasonData ? seasonData[this.state.grade] : null;
    const stageCurriculum = gradeData ? gradeData[stageId] : null;
    if (!stageCurriculum) return;

    this.currentStageCurriculum = stageCurriculum;

    const forestBanner = document.getElementById('materi-forest-banner');
    const forestTitle = document.getElementById('materi-forest-title');
    const forestDesc = document.getElementById('materi-forest-desc');
    if (forestBanner && forestTitle && forestDesc) {
      if (forestGateContext) {
        forestTitle.textContent = forestGateContext.name;
        forestDesc.textContent = forestGateContext.description;
        forestBanner.classList.remove('hidden');
      } else {
        forestBanner.classList.add('hidden');
      }
    }

    const elemTag = document.getElementById('materi-element-tag');
    if (elemTag) elemTag.textContent = `Elemen ${stageCurriculum.element} • ${stageCurriculum.fase}`;

    const titleElem = document.getElementById('materi-title');
    if (titleElem) titleElem.textContent = stageCurriculum.title;

    const arabicElem = document.getElementById('materi-arabic-text');
    if (arabicElem) arabicElem.textContent = stageCurriculum.arabic;

    const transElem = document.getElementById('materi-translation-text');
    if (transElem) transElem.textContent = `"${stageCurriculum.translation}"`;

    const descElem = document.getElementById('materi-description');
    if (descElem) descElem.textContent = stageCurriculum.description;

    const bulletList = document.getElementById('materi-bullet-points');
    if (bulletList) {
      bulletList.innerHTML = '';
      stageCurriculum.points.forEach((pt) => {
        const li = document.createElement('li');
        li.textContent = pt;
        bulletList.appendChild(li);
      });
    }

    const configuredCount = this.missionConfig.questionCounts[String(stageId)] ?? 10;
    const nuraHint = document.getElementById('materi-nura-hint');
    if (nuraHint) {
      nuraHint.textContent = `Rintangan Pemahaman pada elemen ini terdiri dari ${configuredCount} soal AKM (10% Mudah, 60% Sedang, 30% Sulit). Kendalikan pesawat 3D menuju kotak jawaban yang tepat!`;
    }

    document.getElementById('modal-materi')?.classList.remove('hidden');
  }

  private playTTS() {
    if (!this.currentStageCurriculum) return;
    this.stopTTS();

    if ('speechSynthesis' in window) {
      const text = `${this.currentStageCurriculum.title}. ${this.currentStageCurriculum.ttsText}. Poin penting: ${this.currentStageCurriculum.points.join('. ')}`;
      const utter = new SpeechSynthesisUtterance(text);
      utter.lang = 'id-ID';
      utter.rate = 0.95;

      utter.onstart = () => {
        document.getElementById('btn-tts-play')?.classList.add('bg-amber-300', 'animate-pulse');
      };
      utter.onend = utter.onerror = () => {
        document.getElementById('btn-tts-play')?.classList.remove('bg-amber-300', 'animate-pulse');
      };
      window.speechSynthesis.speak(utter);
    }
  }

  private stopTTS() {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      document.getElementById('btn-tts-play')?.classList.remove('bg-amber-300', 'animate-pulse');
    }
  }

  // ==================== 3D AIRPLANE "RINTANGAN PEMAHAMAN" ENGINE ====================
  private startFlightChallenge() {
    if (!this.currentStageCurriculum) return;

    const targetCount = this.missionConfig.questionCounts[String(this.currentStageId)] ?? 10;
    this.flightDeck = buildAkmMissionDeck(this.currentStageId, this.currentStageCurriculum.quiz, targetCount);

    this.currentQuestionIdx = 0;
    this.flightCorrectCount = 0;
    this.flightAnsweredCount = 0;
    this.flightQuestionResolved = false;
    this.flightDisabledLanes = [];
    this.playerHearts = 3;
    this.comboStreak = 0;
    this.shieldActiveForStage = this.state.skills.shield;
    this.is5050Used = false;

    // Hide roaming overlays
    document.getElementById('stage-map-hud')?.classList.add('hidden');
    document.getElementById('prompt-biome-gate')?.classList.add('hidden');
    document.getElementById('prompt-chat-student')?.classList.add('hidden');
    document.getElementById('in-game-hud')?.classList.add('hidden');
    document.getElementById('in-game-bottom')?.classList.add('hidden');

    // Enter 3D Airplane Sky Arena
    this.world.enterFlightChallenge(this.currentStageId);
    sound.playPortalEnter();

    const stageBadgeElem = document.getElementById('battle-stage-badge');
    if (stageBadgeElem) {
      stageBadgeElem.textContent = `Dunia ${this.currentStageId} • ${this.currentStageCurriculum.element}`;
    }

    const bossTitle = document.getElementById('battle-boss-name');
    if (bossTitle) {
      bossTitle.textContent = `Rintangan Pemahaman (${this.flightDeck.length} Soal AKM) • Pesawat 3D`;
    }

    document.getElementById('modal-battle')?.classList.remove('hidden');
    this.renderFlightHudState();
    this.launchFlightQuestionAt(0);
  }

  private abortFlightChallenge() {
    this.world.exitFlightChallenge();
    document.getElementById('modal-battle')?.classList.add('hidden');
    document.getElementById('in-game-hud')?.classList.remove('hidden');
    document.getElementById('in-game-bottom')?.classList.remove('hidden');
    if (this.world.currentActiveStage > 0) {
      document.getElementById('stage-map-hud')?.classList.remove('hidden');
    }
  }

  private renderFlightHudState() {
    const heartsCont = document.getElementById('battle-hearts-container');
    if (heartsCont) {
      let heartIcons = '';
      for (let i = 0; i < 3; i++) {
        heartIcons += i < this.playerHearts
          ? '<i class="fa-solid fa-heart text-red-500"></i>'
          : '<i class="fa-regular fa-heart text-slate-600"></i>';
      }
      heartsCont.innerHTML = heartIcons;
    }

    const comboElem = document.getElementById('battle-combo-badge');
    if (comboElem) {
      if (this.comboStreak >= 3 && this.state.skills.doubleXp) {
        comboElem.className = 'text-[10px] font-extrabold text-amber-300 bg-amber-400/20 px-2 py-0.5 rounded-lg border border-amber-400 animate-pulse';
        comboElem.textContent = `${this.comboStreak}x (2x XP)`;
      } else {
        comboElem.className = 'text-[10px] font-bold text-amber-300 bg-amber-400/10 px-2 py-0.5 rounded-lg border border-amber-400/30';
        comboElem.textContent = `${this.comboStreak}x`;
      }
    }

    const scoreLive = document.getElementById('flight-score-live');
    if (scoreLive) {
      scoreLive.textContent = `Benar: ${this.flightCorrectCount} / ${this.flightAnsweredCount}`;
    }

    const btn5050 = document.getElementById('skill-5050') as HTMLButtonElement | null;
    if (btn5050) btn5050.disabled = !this.state.skills.f5050 || this.is5050Used || this.flightQuestionResolved;

    const btnShield = document.getElementById('skill-shield') as HTMLButtonElement | null;
    if (btnShield) btnShield.disabled = !this.shieldActiveForStage;

    const btnBoost = document.getElementById('btn-flight-boost') as HTMLButtonElement | null;
    if (btnBoost) btnBoost.disabled = this.flightQuestionResolved;
  }

  private launchFlightQuestionAt(idx: number) {
    const q = this.flightDeck[idx];
    if (!q) return;

    this.currentQuestionIdx = idx;
    this.flightQuestionResolved = false;
    this.flightDisabledLanes = [];

    document.getElementById('quiz-feedback-banner')?.classList.add('hidden');
    document.getElementById('quiz-hint-box')?.classList.add('hidden');

    // Difficulty badge
    const diffBadge = document.getElementById('battle-difficulty-badge');
    if (diffBadge) {
      const diffStyle: Record<DifficultyLevel, { label: string; cls: string }> = {
        mudah: { label: 'AKM Mudah (10%)', cls: 'text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-400/40' },
        sedang: { label: 'AKM Sedang (60%)', cls: 'text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-400/40' },
        sulit: { label: 'AKM Sulit (30%)', cls: 'text-[10px] px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 font-bold border border-rose-400/40' },
      };
      const cfg = diffStyle[q.difficulty];
      diffBadge.textContent = cfg.label;
      diffBadge.className = cfg.cls;
    }

    // Stimulus
    const stimCard = document.getElementById('quiz-stimulus-card');
    const stimText = document.getElementById('quiz-stimulus-text');
    if (stimCard && stimText) {
      if (q.stimulus) {
        stimText.textContent = q.stimulus;
        stimCard.classList.remove('hidden');
      } else {
        stimCard.classList.add('hidden');
      }
    }

    const qNum = document.getElementById('quiz-question-number');
    if (qNum) {
      qNum.innerHTML = `<i class="fa-solid fa-plane"></i> Soal ${idx + 1} dari ${this.flightDeck.length} • Rintangan Pemahaman AKM`;
    }

    const qText = document.getElementById('quiz-question-text');
    if (qText) qText.textContent = q.question;

    // Build 4 Lane-Synced Option Cards
    const optCont = document.getElementById('quiz-options-container');
    if (optCont) {
      optCont.innerHTML = '';
      const letters = ['A', 'B', 'C', 'D'];
      const badgeColors = [
        'bg-emerald-500/20 border-emerald-400 text-emerald-300',
        'bg-sky-500/20 border-sky-400 text-sky-300',
        'bg-amber-500/20 border-amber-400 text-amber-300',
        'bg-pink-500/20 border-pink-400 text-pink-300',
      ];
      q.options.forEach((opt, optIdx) => {
        const btn = document.createElement('button');
        btn.id = `quiz-opt-btn-${optIdx}`;
        btn.type = 'button';
        btn.className =
          'p-2.5 sm:p-3 rounded-2xl bg-slate-800/85 border border-slate-700 hover:border-sky-400 text-left text-xs sm:text-sm font-semibold flex items-center gap-2.5 transition-all';
        btn.innerHTML = `
          <span class="w-7 h-7 rounded-xl border ${badgeColors[optIdx]} flex items-center justify-center font-black text-xs flex-shrink-0">${letters[optIdx]}</span>
          <span class="text-slate-100 leading-tight">${escapeHtml(opt)}</span>
        `;
        btn.addEventListener('click', () => {
          if (this.flightQuestionResolved || btn.disabled) return;
          sound.playButtonClick();
          // If airplane is already aligned with this lane, boost directly into the box; otherwise steer airplane to it
          if (this.world.flightActiveLane === optIdx) {
            this.world.boostAirplaneToAnswer();
          } else {
            this.world.selectAirplaneLane(optIdx);
          }
        });
        optCont.appendChild(btn);
      });
    }

    // Start 3D Airplane automatic approach timed to Teacher-configured duration
    const duration = this.missionConfig.durationPerQuestionSec || 25;
    this.world.startFlightQuestion(duration, q.options, []);
    this.highlightActiveLaneOption(this.world.flightActiveLane);
    this.renderFlightHudState();
  }

  private resolveFlightAnswer(chosenLane: number) {
    if (this.flightQuestionResolved) return;
    const q = this.flightDeck[this.currentQuestionIdx];
    if (!q) return;

    this.flightQuestionResolved = true;
    this.world.pauseFlightChallenge(true);
    this.flightAnsweredCount++;

    const isCorrect = chosenLane === q.answer;
    if (isCorrect) this.flightCorrectCount++;

    // Lock and colorize all 4 option buttons
    for (let i = 0; i < q.options.length; i++) {
      const b = document.getElementById(`quiz-opt-btn-${i}`) as HTMLButtonElement | null;
      if (!b) continue;
      b.disabled = true;
      if (i === q.answer) {
        b.className =
          'p-2.5 sm:p-3 rounded-2xl bg-emerald-950/90 border-2 border-emerald-400 text-left text-xs sm:text-sm font-bold flex items-center gap-2.5';
      } else if (i === chosenLane) {
        b.className =
          'p-2.5 sm:p-3 rounded-2xl bg-red-950/90 border-2 border-red-500 text-left text-xs sm:text-sm font-semibold flex items-center gap-2.5';
      }
    }

    const banner = document.getElementById('quiz-feedback-banner');
    const feedbackIcon = document.getElementById('quiz-feedback-icon');
    const feedbackText = document.getElementById('quiz-feedback-text');
    const nextBtn = document.getElementById('btn-next-question');
    const letters = ['A', 'B', 'C', 'D'];

    if (isCorrect) {
      sound.playDing();
      this.world.triggerFlightFeedback(true);
      this.comboStreak++;
      this.addXp(30);
      this.addCoins(12);

      if (banner && feedbackText) {
        banner.className =
          'p-2.5 sm:p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 bg-emerald-900/60 border border-emerald-500/60 text-emerald-100';
        if (feedbackIcon) {
          feedbackIcon.className = 'w-6 h-6 rounded-lg bg-emerald-500/25 text-emerald-300 flex items-center justify-center flex-shrink-0 text-xs';
          feedbackIcon.innerHTML = '<i class="fa-solid fa-check"></i>';
        }
        feedbackText.textContent = `TEPAT! Pesawat menembus kotak ${letters[chosenLane]}! ${q.explanation}`;
        banner.classList.remove('hidden');
      }
    } else {
      sound.playBuzz();
      this.world.triggerFlightFeedback(false);
      this.comboStreak = 0;

      if (this.shieldActiveForStage) {
        this.shieldActiveForStage = false;
        if (banner && feedbackText) {
          banner.className =
            'p-2.5 sm:p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 bg-amber-900/60 border border-amber-500/60 text-amber-100';
          if (feedbackIcon) {
            feedbackIcon.className = 'w-6 h-6 rounded-lg bg-amber-500/25 text-amber-300 flex items-center justify-center flex-shrink-0 text-xs';
            feedbackIcon.innerHTML = '<i class="fa-solid fa-shield"></i>';
          }
          feedbackText.textContent = `Perisai Sabar melindungi pesawatmu! Jawaban tepat: ${letters[q.answer]} (${q.options[q.answer]}).`;
          banner.classList.remove('hidden');
        }
      } else {
        this.playerHearts = Math.max(0, this.playerHearts - 1);
        if (banner && feedbackText) {
          banner.className =
            'p-2.5 sm:p-3 rounded-2xl text-xs font-semibold flex items-center justify-between gap-3 bg-red-900/60 border border-red-500/60 text-red-100';
          if (feedbackIcon) {
            feedbackIcon.className = 'w-6 h-6 rounded-lg bg-red-500/25 text-red-300 flex items-center justify-center flex-shrink-0 text-xs';
            feedbackIcon.innerHTML = '<i class="fa-solid fa-xmark"></i>';
          }
          feedbackText.textContent = `Pesawat memilih ${letters[chosenLane]}, jawaban tepat: ${letters[q.answer]} (${q.options[q.answer]}). ${q.explanation}`;
          banner.classList.remove('hidden');
        }
      }
    }

    const isLastQuestion = this.currentQuestionIdx + 1 >= this.flightDeck.length;
    if (nextBtn) {
      nextBtn.innerHTML = isLastQuestion
        ? 'Lihat Hasil Misi <i class="fa-solid fa-flag-checkered ml-1"></i>'
        : 'Soal Berikutnya <i class="fa-solid fa-arrow-right ml-1"></i>';
    }

    // Stream real-time student answer telemetry to server & Teacher Dashboard
    const currentScore = Math.round((this.flightCorrectCount / Math.max(1, this.flightAnsweredCount)) * 100);
    if (this.role === 'student' && this.studentId) {
      this.multiplayer.sendStudentAnswer({
        stageId: this.currentStageId,
        difficulty: q.difficulty,
        correct: isCorrect,
        questionPreview: q.question.slice(0, 75),
        currentScore,
        xp: this.state.xp,
        level: this.state.level,
        coins: this.state.coins,
      });
      recordLocalStudentProgress({
        studentId: this.studentId,
        stageId: this.currentStageId,
        difficulty: q.difficulty,
        correct: isCorrect,
        currentScore,
        xp: this.state.xp,
        level: this.state.level,
        coins: this.state.coins,
        badges: this.state.badges,
      });
    }

    this.renderFlightHudState();
  }

  private advanceFlightQuestion() {
    if (!this.flightQuestionResolved) return;

    if (this.currentQuestionIdx + 1 >= this.flightDeck.length) {
      this.finishFlightChallenge();
    } else {
      // Restore 1 heart if empty so student can still complete all 10-15 AKM items for complete analytics
      if (this.playerHearts <= 0) {
        this.playerHearts = 1;
        this.showToast('Semangat! Pesawat mendapat energi darurat untuk menuntaskan seluruh soal AKM.', 'info');
      }
      this.launchFlightQuestionAt(this.currentQuestionIdx + 1);
    }
  }

  private finishFlightChallenge() {
    document.getElementById('modal-battle')?.classList.add('hidden');
    this.world.exitFlightChallenge();
    document.getElementById('in-game-hud')?.classList.remove('hidden');
    document.getElementById('in-game-bottom')?.classList.remove('hidden');

    const finalScore = Math.round((this.flightCorrectCount / Math.max(1, this.flightDeck.length)) * 100);
    sound.playFanfare();
    if (typeof confetti === 'function') {
      confetti({ particleCount: 120, spread: 90, origin: { y: 0.5 } });
    }

    // Award Stage Badge & Completion Bonus
    const xpReward = 80 + this.flightCorrectCount * 8;
    const coinReward = 40 + this.flightCorrectCount * 4;
    this.state.badges[this.currentStageId - 1] = true;
    this.addXp(xpReward);
    this.addCoins(coinReward);

    // Report stage completion to server & Teacher Dashboard in real time
    if (this.role === 'student' && this.studentId) {
      this.multiplayer.sendStageComplete({
        stageId: this.currentStageId,
        score: finalScore,
        xp: this.state.xp,
        level: this.state.level,
        coins: this.state.coins,
      });
      recordLocalStudentProgress({
        studentId: this.studentId,
        stageId: this.currentStageId,
        stageCompleted: true,
        stageScore: finalScore,
        xp: this.state.xp,
        level: this.state.level,
        coins: this.state.coins,
        badges: this.state.badges,
      });
    }

    const badgeNames = ['Bintang Tajwid', 'Bintang Akidah', 'Bintang Akhlak', 'Bintang Ibadah', 'Bintang Tarikh'];
    const badgeName = badgeNames[this.currentStageId - 1] || 'Lencana Ilmu';

    const victTitle = document.getElementById('victory-stage-title');
    if (victTitle) {
      victTitle.textContent = `Dunia ${this.currentStageId}: ${this.currentStageCurriculum?.title} • Skor AKM ${finalScore}% (${this.flightCorrectCount}/${this.flightDeck.length} Benar)`;
    }

    const victBadge = document.getElementById('victory-badge-name');
    if (victBadge) victBadge.textContent = badgeName;

    const victXp = document.getElementById('victory-xp-gained');
    if (victXp) victXp.textContent = `+${xpReward} XP`;

    const victCoins = document.getElementById('victory-coins-gained');
    if (victCoins) victCoins.textContent = `+${coinReward} Koin`;

    document.getElementById('modal-victory')?.classList.remove('hidden');
  }

  private use5050() {
    if (this.is5050Used || this.flightQuestionResolved) return;
    const q = this.flightDeck[this.currentQuestionIdx];
    if (!q) return;

    sound.playButtonClick();
    this.is5050Used = true;

    const wrongIndices = [0, 1, 2, 3].filter((i) => i !== q.answer);
    wrongIndices.sort(() => Math.random() - 0.5);
    const toDisable = wrongIndices.slice(0, 2);
    this.flightDisabledLanes = toDisable;

    toDisable.forEach((idx) => {
      const b = document.getElementById(`quiz-opt-btn-${idx}`) as HTMLButtonElement | null;
      if (b) {
        b.disabled = true;
        b.style.opacity = '0.25';
      }
    });

    // Visually dim the 2 eliminated 3D Answer Boxes in the sky too!
    this.world.updateFlightBoxTextures(q.options, toDisable);

    // If airplane is currently on a disabled lane, gently nudge it to an active lane
    if (toDisable.includes(this.world.flightActiveLane)) {
      const safeLane = [0, 1, 2, 3].find((i) => !toDisable.includes(i)) ?? q.answer;
      this.world.selectAirplaneLane(safeLane);
    }

    this.renderFlightHudState();
  }

  private useShield() {
    if (!this.shieldActiveForStage) return;
    sound.playButtonClick();
    this.showToast('Perisai Sabar sedang aktif dan melindungimu dari 1 kesalahan jawaban!', 'info');
  }

  private useHint() {
    const q = this.flightDeck[this.currentQuestionIdx];
    if (!q) return;

    sound.playButtonClick();
    this.world.triggerNuraJoy();

    const hintBox = document.getElementById('quiz-hint-box');
    const hintText = document.getElementById('quiz-hint-text');
    if (hintBox && hintText) {
      hintText.textContent = `Bisikan Nura: "${q.hint}"`;
      hintBox.classList.remove('hidden');
    }
  }

  // ==================== SKILL TREE, BADGES & CERTIFICATE ====================
  private buySkill(skillKey: 'f5050' | 'shield' | 'doubleXp', cost: number) {
    if (this.state.skills[skillKey]) {
      this.showToast('Skill ini sudah kamu miliki!', 'info');
      return;
    }
    if (this.state.coins < cost) {
      sound.playBuzz();
      this.showToast(`Koin Berkah belum cukup! Butuh ${cost} Koin.`, 'warn');
      return;
    }

    sound.playFanfare();
    this.state.coins -= cost;
    this.state.skills[skillKey] = true;
    this.saveState();
    this.syncStudentProgressHttp();
    this.updateHUD();
    this.openSkillTreeModal();
    this.showToast('Keahlian baru berhasil dibuka!', 'success');
  }

  private openSkillTreeModal() {
    const updateSkillRow = (owned: boolean, tagId: string, btnId: string) => {
      const tag = document.getElementById(tagId);
      const btn = document.getElementById(btnId) as HTMLButtonElement | null;
      if (owned) {
        if (tag) {
          tag.textContent = 'Aktif';
          tag.className = 'text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold';
        }
        if (btn) {
          btn.textContent = 'Dimiliki';
          btn.disabled = true;
          btn.className = 'px-3 py-1.5 rounded-xl bg-slate-800 text-slate-500 text-xs font-bold';
        }
      }
    };

    updateSkillRow(this.state.skills.f5050, 'skill-tag-5050', 'btn-buy-skill-5050');
    updateSkillRow(this.state.skills.shield, 'skill-tag-shield', 'btn-buy-skill-shield');
    updateSkillRow(this.state.skills.doubleXp, 'skill-tag-double', 'btn-buy-skill-double');
    document.getElementById('modal-skilltree')?.classList.remove('hidden');
  }

  private openBadgesModal() {
    const grid = document.getElementById('badges-cards-grid');
    if (!grid) return;
    grid.innerHTML = '';

    const badgeData = [
      { id: 1, name: 'Bintang Tajwid', element: "Al-Qur'an & Hadis", icon: 'fa-book-quran', lore: 'Menjaga kemurnian kalam Ilahi dengan tajwid yang fasih dan tartil.' },
      { id: 2, name: 'Bintang Akidah', element: 'Akidah Tauhid', icon: 'fa-star-and-crescent', lore: 'Menancapkan keimanan teguh kepada Allah, malaikat, dan rukun iman.' },
      { id: 3, name: 'Bintang Akhlak', element: 'Budi Pekerti', icon: 'fa-heart', lore: 'Menghiasi diri dengan adab santun kepada orang tua, guru, dan sesama kawan.' },
      { id: 4, name: 'Bintang Ibadah', element: 'Fikih Ibadah', icon: 'fa-mosque', lore: 'Mendirikan salat dengan khusyuk, bersuci, dan menunaikan zakat serta sedekah.' },
      { id: 5, name: 'Bintang Tarikh', element: 'Sejarah Peradaban', icon: 'fa-hourglass-half', lore: 'Meneladani perjuangan mulia para nabi dan Khulafaur Rasyidin yang agung.' },
    ];

    badgeData.forEach((b) => {
      const isEarned = this.state.badges[b.id - 1];
      const card = document.createElement('div');
      card.className = isEarned
        ? 'p-4 rounded-2xl bg-slate-950/80 border-2 border-amber-400/60 shadow-lg'
        : 'p-4 rounded-2xl bg-slate-950/40 border border-slate-800 opacity-60';

      card.innerHTML = `
        <div class="flex items-center gap-3 mb-2">
          <div class="w-10 h-10 rounded-xl ${isEarned ? 'bg-amber-500/20 text-amber-400 border border-amber-400' : 'bg-slate-800 text-slate-600'} flex items-center justify-center text-lg">
            <i class="fa-solid ${b.icon}"></i>
          </div>
          <div>
            <h4 class="font-bold text-sm text-white">${b.name}</h4>
            <span class="text-[10px] font-bold uppercase tracking-wider text-amber-400">${b.element}</span>
          </div>
        </div>
        <p class="text-xs text-slate-300 italic">"${b.lore}"</p>
        <div class="mt-2 text-right">
          <span class="text-[10px] font-extrabold px-2 py-0.5 rounded-full ${isEarned ? 'bg-emerald-500/20 text-emerald-300' : 'bg-slate-800 text-slate-500'}">
            ${isEarned ? '✓ Diraih' : 'Belum Terbuka'}
          </span>
        </div>
      `;
      grid.appendChild(card);
    });

    document.getElementById('modal-badges')?.classList.remove('hidden');
  }

  private openCertificateModal() {
    const studentName = document.getElementById('cert-student-name');
    if (studentName) studentName.textContent = `${this.state.playerName} (${this.state.institution})`;

    const rankTitle = document.getElementById('cert-rank-title');
    if (rankTitle) rankTitle.textContent = this.getRankTitle(this.state.level);

    const gradeSeason = document.getElementById('cert-grade-season');
    if (gradeSeason) {
      gradeSeason.textContent = `Kelas ${this.state.grade} (${this.getFase(this.state.grade)}) • Season ${this.state.season} (Semester ${this.state.season})`;
    }

    const totalXp = document.getElementById('cert-total-xp');
    if (totalXp) totalXp.textContent = `${this.state.xp} XP Cahaya`;

    for (let i = 0; i < 5; i++) {
      const badgeElem = document.getElementById(`cert-badge-${i + 1}`);
      if (badgeElem) {
        if (this.state.badges[i]) {
          badgeElem.className =
            'w-10 h-10 rounded-full border-2 border-amber-600 bg-amber-200 flex items-center justify-center text-amber-900 text-sm shadow-md';
        } else {
          badgeElem.className =
            'w-10 h-10 rounded-full border-2 border-slate-300 bg-slate-100 flex items-center justify-center text-slate-400 text-sm opacity-50';
        }
      }
    }

    document.getElementById('modal-certificate')?.classList.remove('hidden');
  }

  // ==================== KEYBOARD & TOUCH INPUT ====================
  private isTypingInInput(target: EventTarget | null): boolean {
    if (!target || !(target instanceof HTMLElement)) return false;
    const tag = target.tagName.toLowerCase();
    return tag === 'input' || tag === 'textarea' || tag === 'select';
  }

  private initInputListeners() {
    window.addEventListener('keydown', (e) => {
      if (this.isTypingInInput(e.target)) return;
      const key = e.key.toLowerCase();
      this.keys[key] = true;

      // In 3D Airplane Flight Mode: quick lane keys 1-4, Space/Enter to boost or advance
      if (this.world.inFlightMode) {
        if (key === '1' && !this.flightDisabledLanes.includes(0)) this.world.selectAirplaneLane(0);
        if (key === '2' && !this.flightDisabledLanes.includes(1)) this.world.selectAirplaneLane(1);
        if (key === '3' && !this.flightDisabledLanes.includes(2)) this.world.selectAirplaneLane(2);
        if (key === '4' && !this.flightDisabledLanes.includes(3)) this.world.selectAirplaneLane(3);

        if (key === ' ' || key === 'enter') {
          e.preventDefault();
          if (this.flightQuestionResolved) {
            this.advanceFlightQuestion();
          } else {
            this.world.boostAirplaneToAnswer();
          }
        }
        return;
      }

      // Roaming interaction key (E or Space)
      if ((key === 'e' || key === ' ') && this.role === 'student') {
        const materiClosed = document.getElementById('modal-materi')?.classList.contains('hidden');
        const battleClosed = document.getElementById('modal-battle')?.classList.contains('hidden');
        const startClosed = document.getElementById('modal-start')?.classList.contains('hidden');
        const chatClosed = document.getElementById('modal-chat')?.classList.contains('hidden');

        if (materiClosed && battleClosed && startClosed && chatClosed) {
          if (this.world.activeNearPortal) {
            this.enterStageWorld(this.world.activeNearPortal.stageId);
          } else if (this.world.activeNearBiomeGate) {
            this.handleBiomeGateInteract(this.world.activeNearBiomeGate);
          } else if (this.world.activeNearRemotePlayer) {
            this.openChatModal({
              id: this.world.activeNearRemotePlayer.id,
              name: this.world.activeNearRemotePlayer.name,
              institution: this.world.activeNearRemotePlayer.institution,
            });
          }
        }
      }
    });

    window.addEventListener('keyup', (e) => {
      this.keys[e.key.toLowerCase()] = false;
    });

    // Touch Virtual Joystick (Mobile Roaming)
    const zone = document.getElementById('joystick-zone');
    const knob = document.getElementById('joystick-knob');

    if (zone && knob) {
      const handleTouchMove = (clientX: number, clientY: number) => {
        const rect = zone.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        const maxDist = rect.width / 2 - 10;
        let dx = clientX - centerX;
        let dy = clientY - centerY;
        const dist = Math.hypot(dx, dy);

        if (dist > maxDist) {
          dx = (dx / dist) * maxDist;
          dy = (dy / dist) * maxDist;
        }

        knob.style.transform = `translate(${dx}px, ${dy}px)`;
        this.joystickVector.set(dx / maxDist, dy / maxDist);
      };

      zone.addEventListener(
        'touchstart',
        (e) => {
          e.preventDefault();
          this.isJoystickActive = true;
          handleTouchMove(e.touches[0].clientX, e.touches[0].clientY);
        },
        { passive: false }
      );

      zone.addEventListener(
        'touchmove',
        (e) => {
          e.preventDefault();
          if (this.isJoystickActive && e.touches[0]) {
            handleTouchMove(e.touches[0].clientX, e.touches[0].clientY);
          }
        },
        { passive: false }
      );

      const resetJoystick = () => {
        this.isJoystickActive = false;
        this.joystickVector.set(0, 0);
        knob.style.transform = 'translate(0px, 0px)';
      };

      zone.addEventListener('touchend', resetJoystick);
      zone.addEventListener('touchcancel', resetJoystick);
    }
  }

  // ==================== MAIN ANIMATION & MULTIPLAYER SYNC LOOP ====================
  private tick() {
    requestAnimationFrame(this.tick.bind(this));

    const delta = Math.min(this.clock.getDelta(), 0.05);
    const move = new THREE.Vector2(0, 0);

    const anyBlockingModalOpen =
      !document.getElementById('modal-start')?.classList.contains('hidden') ||
      !document.getElementById('modal-chat')?.classList.contains('hidden') ||
      !document.getElementById('modal-teacher-dashboard')?.classList.contains('hidden');

    if (!anyBlockingModalOpen) {
      if (this.keys['w'] || this.keys['arrowup']) move.y -= 1;
      if (this.keys['s'] || this.keys['arrowdown']) move.y += 1;
      if (this.keys['a'] || this.keys['arrowleft']) move.x -= 1;
      if (this.keys['d'] || this.keys['arrowright']) move.x += 1;

      if (this.world.inFlightMode && this.steerButtonAxis !== 0) {
        move.x = this.steerButtonAxis;
      }

      if (this.isJoystickActive) {
        move.x = this.joystickVector.x;
        move.y = this.joystickVector.y;
      }

      if (move.lengthSq() > 1) move.normalize();
    }

    const isRunning = Boolean(this.keys['shift']);

    if (this.world.isTeacherSpectator || this.role !== 'student') {
      move.set(0, 0);
    }

    this.world.update(delta, move, isRunning);

    // Stream local student movement to server for real-time multiplayer & teacher spectator
    if (this.role === 'student' && this.studentId && !this.world.inFlightMode) {
      this.multiplayer.sendMove({
        x: Number(this.world.playerGroup.position.x.toFixed(2)),
        y: Number(this.world.playerGroup.position.y.toFixed(2)),
        z: Number(this.world.playerGroup.position.z.toFixed(2)),
        rotY: Number(this.world.playerGroup.rotation.y.toFixed(2)),
        stageId: this.world.currentActiveStage,
        costume: this.state.costume,
        level: this.state.level,
        isMoving: move.lengthSq() > 0.01,
      });
    }

    // Update Proximity Prompts only during active student roaming
    const showPrompts = this.role === 'student' && !this.world.inFlightMode && !anyBlockingModalOpen;

    const promptElem = document.getElementById('proximity-prompt');
    const promptName = document.getElementById('prompt-stage-name');
    if (showPrompts && this.world.activeNearPortal) {
      promptElem?.classList.remove('hidden');
      if (promptName) {
        promptName.textContent = `Stage ${this.world.activeNearPortal.stageId}: ${this.world.activeNearPortal.name}`;
      }
    } else {
      promptElem?.classList.add('hidden');
    }

    const biomePrompt = document.getElementById('prompt-biome-gate');
    const biomeName = document.getElementById('prompt-biome-name');
    const biomeSub = document.getElementById('prompt-biome-sub');
    if (showPrompts && this.world.activeNearBiomeGate) {
      biomePrompt?.classList.remove('hidden');
      if (biomeName) biomeName.textContent = this.world.activeNearBiomeGate.name;
      if (biomeSub) biomeSub.textContent = this.world.activeNearBiomeGate.subtitle;
    } else {
      biomePrompt?.classList.add('hidden');
    }

    // Real-time multiplayer player proximity prompt: "Ngobrol yuk!"
    const chatPrompt = document.getElementById('prompt-chat-student');
    const studentName = document.getElementById('prompt-student-name');
    if (showPrompts && this.world.activeNearRemotePlayer) {
      chatPrompt?.classList.remove('hidden');
      if (studentName) {
        const rp = this.world.activeNearRemotePlayer;
        studentName.textContent = `${rp.name} (${rp.institution})`;
      }
    } else {
      chatPrompt?.classList.add('hidden');
    }
  }
}

document.addEventListener('DOMContentLoaded', () => {
  new GameApp();
});
