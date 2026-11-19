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

export interface MultiplayerCallbacks {
  onPlayersSnapshot?: (players: LiveRemotePlayer[]) => void;
  onPlayerJoined?: (player: LiveRemotePlayer) => void;
  onPlayerMoved?: (player: LiveRemotePlayer) => void;
  onPlayerLeft?: (playerId: string) => void;
  onChatHistory?: (messages: LiveChatMessage[]) => void;
  onChatMessage?: (message: LiveChatMessage) => void;
  onMissionConfig?: (config: MissionConfig) => void;
  onAnalyticsUpdate?: (data: TeacherAnalyticsPayload) => void;
  onConnectionChange?: (connected: boolean) => void;
}

export class MultiplayerClient {
  private ws: WebSocket | null = null;
  private callbacks: MultiplayerCallbacks = {};
  private joinPayload: Record<string, unknown> | null = null;
  private reconnectTimer: number | null = null;
  private pendingQueue: string[] = [];
  private lastMoveSentAt: number = 0;
  private manuallyClosed: boolean = false;

  public setCallbacks(cb: MultiplayerCallbacks) {
    this.callbacks = cb;
  }

  public connect(joinPayload: Record<string, unknown>) {
    this.manuallyClosed = false;
    this.joinPayload = joinPayload;

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
          }
        } catch (err) {
          console.warn('Error parsing WS message:', err);
        }
      };

      ws.onclose = () => {
        this.callbacks.onConnectionChange?.(false);
        this.ws = null;
        if (!this.manuallyClosed && this.joinPayload) {
          if (this.reconnectTimer) window.clearTimeout(this.reconnectTimer);
          this.reconnectTimer = window.setTimeout(() => {
            if (this.joinPayload && !this.manuallyClosed) {
              this.connect(this.joinPayload);
            }
          }, 2200);
        }
      };

      ws.onerror = () => {
        // onclose will handle reconnect
      };
    } catch (err) {
      console.warn('WebSocket init failed:', err);
    }
  }

  public disconnect() {
    this.manuallyClosed = true;
    this.joinPayload = null;
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
    this.sendRaw({ type: 'player:move', ...data }, false);
  }

  public sendChat(text: string, toId?: string, toName?: string) {
    this.sendRaw({ type: 'chat:send', text, toId, toName }, true);
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
    this.sendRaw({ type: 'student:answer', ...payload }, true);
  }

  public sendStageComplete(payload: {
    stageId: number;
    score: number;
    xp: number;
    level: number;
    coins: number;
  }) {
    this.sendRaw({ type: 'student:stage_complete', ...payload }, true);
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
