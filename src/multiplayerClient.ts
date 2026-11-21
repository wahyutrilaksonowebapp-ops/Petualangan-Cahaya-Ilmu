export interface MissionConfig {
  questionCounts: Record<string, number>;
  durationPerQuestionSec: number;
}

export interface LiveRemotePlayer {
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

export interface LiveChatMessage {
  id: string;
  fromId: string;
  fromName: string;
  fromInstitution: string;
  toId?: string;
  toName?: string;
  text: string;
  timestamp: number;
}

export interface StudentAnalyticsRow {
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
  stageStats: Record<
    string,
    {
      attempts: number;
      bestScore: number;
      totalCorrect: number;
      totalAnswered: number;
      completed: boolean;
      lastPlayedAt: number;
    }
  >;
  difficultyStats: {
    mudah: { correct: number; total: number };
    sedang: { correct: number; total: number };
    sulit: { correct: number; total: number };
  };
  online: boolean;
  currentStage: number;
  lastSeen: number;
}

export interface WorldProgressSlice {
  stageId: number;
  name: string;
  shortName: string;
  value: number;
  completed: number;
  participants: number;
  avgScore: number;
  color: string;
}

export interface TeacherAnalyticsPayload {
  summary: {
    totalStudents: number;
    onlineStudents: number;
    avgAccuracy: number;
    totalBadgesEarned: number;
    totalAnsweredQuestions: number;
  };
  worldDistribution: WorldProgressSlice[];
  difficultyAggregate: {
    mudah: { correct: number; total: number };
    sedang: { correct: number; total: number };
    sulit: { correct: number; total: number };
  };
  missionConfig: MissionConfig;
  students: StudentAnalyticsRow[];
  timestamp: number;
}

export interface LeaderboardEntry {
  id: string;
  name: string;
  institution: string;
  grade: number;
  level: number;
  xp: number;
  coins: number;
  badgesCount: number;
  accuracy: number;
  online: boolean;
  lastSeen: number;
}

export interface MultiplayerCallbacks {
  onPlayersSnapshot?: (players: LiveRemotePlayer[]) => void;
  onPlayerJoined?: (player: LiveRemotePlayer) => void;
  onPlayerMoved?: (player: LiveRemotePlayer) => void;
  onPlayerLeft?: (playerId: string) => void;
  onChatHistory?: (messages: LiveChatMessage[]) => void;
  onChatMessage?: (message: LiveChatMessage) => void;
  onMissionConfig?: (config: MissionConfig) => void;
  onAnalyticsUpdate?: (data: TeacherAnalyticsPayload) => void;
  onLeaderboardUpdate?: (entries: LeaderboardEntry[]) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export class MultiplayerClient {
  private ws: WebSocket | null = null;
  private bc: BroadcastChannel | null = null;
  private callbacks: MultiplayerCallbacks = {};
  private joinPayload: Record<string, unknown> | null = null;
  private reconnectTimer: number | null = null;
  private pendingQueue: string[] = [];
  private lastMoveSentAt: number = 0;
  private manuallyClosed: boolean = false;
  private wsConnected: boolean = false;
  private wsFailCount: number = 0;

  public setCallbacks(cb: MultiplayerCallbacks) {
    this.callbacks = cb;
  }

  private ensureBroadcastChannel() {
    if (this.bc || typeof BroadcastChannel === 'undefined') return;
    try {
      this.bc = new BroadcastChannel('cahaya_ilmu_realtime_v1');
      this.bc.onmessage = (event) => {
        const msg = event.data;
        if (!msg || typeof msg !== 'object') return;
        // When WS is connected, let the authoritative server handle multiplayer events
        if (this.wsConnected && msg.type !== 'analytics:update' && msg.type !== 'leaderboard:update') return;

        switch (msg.type) {
          case 'bc:hello':
            if (this.joinPayload?.role === 'student' && this.joinPayload.studentId) {
              this.bc?.postMessage({
                type: 'player:joined',
                player: this.buildLocalPlayerState(),
              });
            }
            break;
          case 'player:joined':
            if (msg.player) this.callbacks.onPlayerJoined?.(msg.player);
            break;
          case 'player:moved':
            if (msg.player) this.callbacks.onPlayerMoved?.(msg.player);
            break;
          case 'player:left':
            if (msg.playerId) this.callbacks.onPlayerLeft?.(msg.playerId);
            break;
          case 'chat:message':
            if (msg.message) this.callbacks.onChatMessage?.(msg.message);
            break;
          case 'mission:config':
            if (msg.config) this.callbacks.onMissionConfig?.(msg.config);
            break;
          case 'analytics:update':
            if (msg.data) this.callbacks.onAnalyticsUpdate?.(msg.data);
            break;
          case 'leaderboard:update':
            if (Array.isArray(msg.entries)) this.callbacks.onLeaderboardUpdate?.(msg.entries);
            break;
        }
      };
    } catch {
      this.bc = null;
    }
  }

  private buildLocalPlayerState(): LiveRemotePlayer {
    const jp = this.joinPayload || {};
    return {
      id: String(jp.studentId || ''),
      name: String(jp.name || 'Santri'),
      institution: String(jp.institution || 'SDN Kedungringin I Beji'),
      grade: Number(jp.grade || 6),
      level: Number(jp.level || 1),
      costume: String(jp.costume || 'sd'),
      stageId: Number(jp.stageId || 0),
      x: Number(jp.x || 0),
      y: Number(jp.y || 0),
      z: Number(jp.z || 5),
      rotY: Number(jp.rotY || 0),
      isMoving: false,
    };
  }

  public connect(joinPayload: Record<string, unknown>, preferLocalOnly: boolean = false) {
    this.manuallyClosed = false;
    this.joinPayload = joinPayload;
    this.ensureBroadcastChannel();

    if (joinPayload.role === 'student' && joinPayload.studentId) {
      this.bc?.postMessage({ type: 'player:joined', player: this.buildLocalPlayerState() });
      this.bc?.postMessage({ type: 'bc:hello' });
    } else if (joinPayload.role === 'teacher') {
      this.bc?.postMessage({ type: 'bc:hello' });
    }

    if (preferLocalOnly) {
      this.callbacks.onConnectionChange?.(true);
      return;
    }

    if (this.ws && (this.ws.readyState === WebSocket.OPEN || this.ws.readyState === WebSocket.CONNECTING)) {
      this.sendRaw({ type: 'auth:join', ...joinPayload });
      return;
    }

    const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
    const wsUrl = `${protocol}//${window.location.host}/ws`;

    try {
      const ws = new WebSocket(wsUrl);
      this.ws = ws;

      ws.onopen = () => {
        this.wsConnected = true;
        this.wsFailCount = 0;
        this.callbacks.onConnectionChange?.(true);
        if (this.joinPayload) {
          ws.send(JSON.stringify({ type: 'auth:join', ...this.joinPayload }));
        }
        while (this.pendingQueue.length > 0) {
          const item = this.pendingQueue.shift();
          if (item && ws.readyState === WebSocket.OPEN) {
            ws.send(item);
          }
        }
      };

      ws.onmessage = (event) => {
        try {
          const msg = JSON.parse(String(event.data));
          switch (msg.type) {
            case 'players:snapshot':
              this.callbacks.onPlayersSnapshot?.(msg.players || []);
              break;
            case 'player:joined':
              if (msg.player) this.callbacks.onPlayerJoined?.(msg.player);
              break;
            case 'player:moved':
              if (msg.player) this.callbacks.onPlayerMoved?.(msg.player);
              break;
            case 'player:left':
              if (msg.playerId) this.callbacks.onPlayerLeft?.(msg.playerId);
              break;
            case 'chat:history':
              this.callbacks.onChatHistory?.(msg.messages || []);
              break;
            case 'chat:message':
              if (msg.message) this.callbacks.onChatMessage?.(msg.message);
              break;
            case 'mission:config':
              if (msg.config) this.callbacks.onMissionConfig?.(msg.config);
              break;
            case 'analytics:update':
              if (msg.data) this.callbacks.onAnalyticsUpdate?.(msg.data);
              break;
            case 'leaderboard:update':
              if (Array.isArray(msg.entries)) this.callbacks.onLeaderboardUpdate?.(msg.entries);
              break;
          }
        } catch (err) {
          console.warn('Error parsing WS message:', err);
        }
      };

      ws.onclose = () => {
        this.wsConnected = false;
        this.ws = null;
        this.wsFailCount++;
        // If BroadcastChannel is active, keep UI indicator healthy in local fallback mode
        this.callbacks.onConnectionChange?.(Boolean(this.bc));

        // Retry WS up to 3 times with backoff, then remain cleanly in BroadcastChannel mode
        if (!this.manuallyClosed && this.joinPayload && this.wsFailCount <= 3) {
          if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
          this.reconnectTimer = window.setTimeout(() => {
            if (this.joinPayload && !this.manuallyClosed) {
              this.connect(this.joinPayload, false);
            }
          }, 2500 * this.wsFailCount);
        }
      };

      ws.onerror = () => {
        // onclose handles graceful fallback
      };
    } catch {
      this.callbacks.onConnectionChange?.(Boolean(this.bc));
    }
  }

  public disconnect() {
    this.manuallyClosed = true;
    if (this.joinPayload?.studentId) {
      this.bc?.postMessage({ type: 'player:left', playerId: String(this.joinPayload.studentId) });
    }
    this.joinPayload = null;
    this.wsConnected = false;
    this.wsFailCount = 0;
    if (this.reconnectTimer) {
      window.clearTimeout(this.reconnectTimer);
      this.reconnectTimer = null;
    }
    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }

  public sendMove(data: {
    x: number;
    y: number;
    z: number;
    rotY: number;
    stageId: number;
    costume: string;
    level: number;
    isMoving: boolean;
  }, force: boolean = false) {
    const now = performance.now();
    if (!force && now - this.lastMoveSentAt < 65) return; // ~15Hz throttle
    this.lastMoveSentAt = now;

    if (this.joinPayload) {
      this.joinPayload.x = data.x;
      this.joinPayload.y = data.y;
      this.joinPayload.z = data.z;
      this.joinPayload.rotY = data.rotY;
      this.joinPayload.stageId = data.stageId;
      this.joinPayload.costume = data.costume;
      this.joinPayload.level = data.level;
    }

    if (this.wsConnected) {
      this.sendRaw({ type: 'player:move', ...data }, false);
    } else if (this.bc && this.joinPayload?.studentId) {
      this.bc.postMessage({
        type: 'player:moved',
        player: { ...this.buildLocalPlayerState(), isMoving: data.isMoving },
      });
    }
  }

  public sendChat(text: string, toId?: string, toName?: string) {
    if (this.wsConnected) {
      this.sendRaw({ type: 'chat:send', text, toId, toName }, true);
    } else if (this.joinPayload?.studentId) {
      const chatMsg: LiveChatMessage = {
        id: `msg-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`,
        fromId: String(this.joinPayload.studentId),
        fromName: String(this.joinPayload.name || 'Santri'),
        fromInstitution: String(this.joinPayload.institution || 'SDN Kedungringin I Beji'),
        toId,
        toName,
        text: text.slice(0, 220),
        timestamp: Date.now(),
      };
      this.callbacks.onChatMessage?.(chatMsg);
      this.bc?.postMessage({ type: 'chat:message', message: chatMsg });
    }
  }

  public sendStudentAnswer(payload: {
    stageId: number;
    difficulty: 'mudah' | 'sedang' | 'sulit';
    correct: boolean;
    questionPreview: string;
    currentScore: number;
    xp: number;
    level: number;
    coins: number;
  }) {
    if (this.wsConnected) {
      this.sendRaw({ type: 'student:answer', ...payload }, true);
    }
  }

  public sendStageComplete(payload: {
    stageId: number;
    score: number;
    xp: number;
    level: number;
    coins: number;
  }) {
    if (this.wsConnected) {
      this.sendRaw({ type: 'student:stage_complete', ...payload }, true);
    }
  }

  private sendRaw(payload: Record<string, unknown>, queueIfOffline: boolean = true) {
    const serialized = JSON.stringify(payload);
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      this.ws.send(serialized);
    } else if (queueIfOffline) {
      this.pendingQueue.push(serialized);
      if (this.pendingQueue.length > 40) this.pendingQueue.shift();
    }
  }
}
