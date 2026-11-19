import * as THREE from 'three';
import { RoomEnvironment } from 'three/addons/environments/RoomEnvironment.js';
import type { LiveRemotePlayer } from './multiplayerClient.ts';

const _tmpScaleVec = new THREE.Vector3();

function detectSoftwareWebGL(): boolean {
  try {
    const probe = document.createElement('canvas');
    const gl = probe.getContext('webgl2') || probe.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param) || '');
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export interface PortalData {
  stageId: number;
  name: string;
  element: string;
  color: number;
  position: THREE.Vector3;
  meshGroup: THREE.Group;
  crystalMesh: THREE.Mesh;
  ringMesh: THREE.Mesh;
  portalLight: THREE.PointLight;
  particles: THREE.Points;
  particleGeo: THREE.BufferGeometry;
  particleMat: THREE.PointsMaterial;
  particleAngles: Float32Array;
  particleRadii: Float32Array;
  particleSpeeds: Float32Array;
}

export type CostumeType =
  | 'sd'
  | 'muslim'
  | 'pramuka'
  | 'koko_batik'
  | 'pendekar'
  | 'rompi_tahfidz'
  | 'gamis_madinah';

export interface ImpactBurst {
  points: THREE.Points;
  positions: Float32Array;
  velocities: THREE.Vector3[];
  life: number;
  maxLife: number;
}

export interface RemotePlayerAvatar {
  id: string;
  name: string;
  institution: string;
  grade: number;
  level: number;
  costume: CostumeType;
  stageId: number;
  isMoving: boolean;
  group: THREE.Group;
  bodyMesh: THREE.Mesh;
  armLeft: THREE.Mesh;
  armRight: THREE.Mesh;
  legLeft: THREE.Mesh;
  legRight: THREE.Mesh;
  capMesh: THREE.Mesh;
  nameplateMesh: THREE.Mesh;
  targetPos: THREE.Vector3;
  targetRotY: number;
  walkPhase: number;
}

export interface FlightAnswerBox {
  laneIndex: number;
  letter: string;
  group: THREE.Group;
  boxMesh: THREE.Mesh;
  frameMesh: THREE.Mesh;
  labelMesh: THREE.Mesh;
  baseColor: number;
}

export interface BiomeGateNode {
  id: string;
  stageId: number;
  name: string;
  subtitle: string;
  description: string;
  color: number;
  position: THREE.Vector3;
  ringMesh?: THREE.Mesh;
  crystalMesh?: THREE.Mesh;
}

function createGlowParticleTexture(): THREE.CanvasTexture {
  const pCanvas = document.createElement('canvas');
  pCanvas.width = 64;
  pCanvas.height = 64;
  const pCtx = pCanvas.getContext('2d');
  if (pCtx) {
    const grad = pCtx.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
    grad.addColorStop(0.25, 'rgba(255, 255, 255, 0.8)');
    grad.addColorStop(0.65, 'rgba(255, 255, 255, 0.25)');
    grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
    pCtx.fillStyle = grad;
    pCtx.fillRect(0, 0, 64, 64);
  }
  return new THREE.CanvasTexture(pCanvas);
}

export class World3D {
  public scene: THREE.Scene;
  public camera: THREE.PerspectiveCamera;
  public renderer!: THREE.WebGLRenderer;
  public canvas: HTMLCanvasElement;
  public isInitialized: boolean = false;
  public isSoftwareGl: boolean = false;
  private maxAnisotropy: number = 1;

  // Characters & Companion
  public playerGroup: THREE.Group;
  public playerBody: THREE.Mesh;
  public playerLegLeft: THREE.Mesh;
  public playerLegRight: THREE.Mesh;
  public playerArmLeft: THREE.Mesh;
  public playerArmRight: THREE.Mesh;
  public playerHead: THREE.Mesh;
  public playerCap: THREE.Mesh;
  public playerThrowTimer: number = 0;

  public nuraGroup: THREE.Group;
  public nuraCore: THREE.Mesh;
  public nuraRing: THREE.Mesh;
  public nuraLight: THREE.PointLight;
  public nuraHappyTimer: number = 0;
  public onNuraClicked?: () => void;

  // 3D Airplane "Rintangan Pemahaman" Challenge System
  public inFlightMode: boolean = false;
  public flightStageId: number = 1;
  public flightGroup: THREE.Group;
  public airplaneGroup: THREE.Group;
  public airplanePropeller: THREE.Group;
  public airplaneLight: THREE.PointLight;
  public answerBoxes: FlightAnswerBox[] = [];
  private flightClouds: THREE.Group[] = [];
  private flightStars: THREE.Points | null = null;
  private flightExhaust: THREE.Mesh | null = null;
  private flightContrails: THREE.Mesh[] = [];
  private flightLanePositions: number[] = [-5.25, -1.75, 1.75, 5.25];
  private airplaneTargetX: number = -1.75;
  private airplaneCurrentX: number = -1.75;
  private airplaneBankAngle: number = 0;
  private airplaneYawAngle: number = 0;
  private airplanePitchAngle: number = 0;
  public flightElapsed: number = 0;
  public flightDuration: number = 25;
  public flightPaused: boolean = true;
  private flightBoosted: boolean = false;
  public flightActiveLane: number = 1;
  private flightDisabledLanes: Set<number> = new Set();
  private flightRollTimer: number = 0;
  private flightShakeTimer: number = 0;
  private flightAnswerTriggered: boolean = false;
  private isFlightPointerDown: boolean = false;
  public onFlightAnswerReached?: (laneIndex: number) => void;
  public onFlightLaneChange?: (laneIndex: number) => void;
  public onFlightTimerTick?: (remainingSec: number, progress: number) => void;

  // Impact Particle Bursts
  public activeImpactBursts: ImpactBurst[] = [];

  // Portals
  public portals: PortalData[] = [];
  public activeNearPortal: PortalData | null = null;

  // Real-Time Multiplayer Remote Players (No NPCs)
  public remotePlayers: Map<string, RemotePlayerAvatar> = new Map();
  public activeNearRemotePlayer: RemotePlayerAvatar | null = null;
  private sharedFaceTexture: THREE.CanvasTexture;

  // 5 Distinct Biome Map Groups
  public campusGroup: THREE.Group = new THREE.Group();
  public biomeGroups: Map<number, THREE.Group> = new Map();
  public biomeGates: BiomeGateNode[] = [];
  public activeNearBiomeGate: BiomeGateNode | null = null;
  public currentActiveStage: number = 0; // 0 = School Campus Lobby, 1-5 = Unique Biomes

  // Mode Guru / Live Spectator Mode
  public isTeacherSpectator: boolean = false;
  public spectatedPlayerId: string | null = null;

  // Environment objects for animation
  private animRings: THREE.Mesh[] = [];
  private animFlag: THREE.Mesh | null = null;
  private natureClouds: THREE.Group[] = [];
  private waterfallStreams: THREE.Mesh[] = [];
  private stage1Fireflies: THREE.Points | null = null;
  private stage5AstroRings: THREE.Mesh[] = [];
  private walkCycleTime: number = 0;
  private glowTexture: THREE.CanvasTexture;
  private raycaster: THREE.Raycaster;
  private pointer: THREE.Vector2;
  private hemiLight!: THREE.HemisphereLight;
  private sunLight!: THREE.DirectionalLight;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.scene = new THREE.Scene();
    this.scene.background = new THREE.Color(0x070d1d);
    this.scene.fog = new THREE.FogExp2(0x070d1d, 0.025);

    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.camera = new THREE.PerspectiveCamera(52, w / h, 0.1, 210);
    this.camera.position.set(0, 7.6, 13.5);
    this.scene.add(this.campusGroup);

    // Lightweight placeholders before initialize(manager) attaches WebGL & builds assets
    this.playerGroup = new THREE.Group();
    this.playerBody = new THREE.Mesh();
    this.playerLegLeft = new THREE.Mesh();
    this.playerLegRight = new THREE.Mesh();
    this.playerArmLeft = new THREE.Mesh();
    this.playerArmRight = new THREE.Mesh();
    this.playerHead = new THREE.Mesh();
    this.playerCap = new THREE.Mesh();

    this.nuraGroup = new THREE.Group();
    this.nuraCore = new THREE.Mesh();
    this.nuraRing = new THREE.Mesh();
    this.nuraLight = new THREE.PointLight(0xfacc15, 2.5, 6);

    this.flightGroup = new THREE.Group();
    this.airplaneGroup = new THREE.Group();
    this.airplanePropeller = new THREE.Group();
    this.airplaneLight = new THREE.PointLight(0x38bdf8, 3.0, 12);

    this.glowTexture = createGlowParticleTexture();
    this.sharedFaceTexture = this.createFaceTexture();
    this.raycaster = new THREE.Raycaster();
    this.pointer = new THREE.Vector2();
  }

  /**
   * Attaches WebGLRenderer to #game-canvas and loads all procedural 3D textures,
   * studio PBR environment, campus, 5 worlds, 3D airplane arena, and shaders
   * tracked cleanly through THREE.LoadingManager.
   */
  public async initialize(
    manager: THREE.LoadingManager,
    onStageLabel?: (label: string) => void
  ): Promise<void> {
    if (this.isInitialized) return;
    if (!this.canvas || !document.body.contains(this.canvas)) {
      throw new Error('Elemen #game-canvas belum terpasang di DOM.');
    }

    const stepKeys = [
      { id: 'asset://webgl-renderer', label: 'Menghubungkan WebGL Renderer & Studio PBR...' },
      { id: 'asset://textures-core', label: 'Memuat tekstur partikel & karakter...' },
      { id: 'asset://lighting-campus', label: 'Membangun kampus SDN Kedungringin I Beji...' },
      { id: 'asset://portals-5-worlds', label: 'Membangun 5 gerbang & bioma 3D...' },
      { id: 'asset://player-nura', label: 'Menyiapkan avatar santri & Nura...' },
      { id: 'asset://airplane-arena', label: 'Merakit Pesawat 3D & Rintangan Pemahaman...' },
      { id: 'asset://shader-compile', label: 'Mengompilasi shader WebGL...' },
    ];

    // Pre-register all asset items so LoadingManager tracks exact 0% -> 100% progress
    stepKeys.forEach((s) => manager.itemStart(s.id));

    const nextTick = () => new Promise<void>((resolve) => window.setTimeout(resolve, 24));

    // Step 1: WebGLRenderer + Software WebGL Guard + RoomEnvironment PBR reflections
    onStageLabel?.(stepKeys[0].label);
    await nextTick();
    this.isSoftwareGl = detectSoftwareWebGL();
    this.renderer = new THREE.WebGLRenderer({
      canvas: this.canvas,
      antialias: !this.isSoftwareGl,
      powerPreference: 'high-performance',
    });
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.1;
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = !this.isSoftwareGl;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.maxAnisotropy = Math.min(8, this.renderer.capabilities.getMaxAnisotropy() || 1);

    try {
      const pmrem = new THREE.PMREMGenerator(this.renderer);
      this.scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;
      pmrem.dispose();
    } catch {
      // fallback safely if PMREM unsupported
    }

    this.canvas.addEventListener('webglcontextlost', (e) => {
      e.preventDefault();
    });
    manager.itemEnd(stepKeys[0].id);

    // Step 2: Core Procedural Textures via TextureLoader(manager)
    onStageLabel?.(stepKeys[1].label);
    await nextTick();
    this.glowTexture.colorSpace = THREE.SRGBColorSpace;
    this.sharedFaceTexture.colorSpace = THREE.SRGBColorSpace;
    this.sharedFaceTexture.anisotropy = this.maxAnisotropy;
    manager.itemEnd(stepKeys[1].id);

    // Step 3: Lighting & Campus
    onStageLabel?.(stepKeys[2].label);
    await nextTick();
    this.setupLighting();
    this.buildSchoolCampus();
    manager.itemEnd(stepKeys[2].id);

    // Step 4: Portals & 5 Biome Maps
    onStageLabel?.(stepKeys[3].label);
    await nextTick();
    this.buildPortals();
    this.build5BiomeMaps();
    manager.itemEnd(stepKeys[3].id);

    // Step 5: Player & Nura Companion
    onStageLabel?.(stepKeys[4].label);
    await nextTick();
    this.buildPlayerCharacter();
    this.buildNuraCompanion();
    manager.itemEnd(stepKeys[4].id);

    // Step 6: 3D Airplane "Rintangan Pemahaman" Arena
    onStageLabel?.(stepKeys[5].label);
    await nextTick();
    this.buildFlightChallengeArena();
    this.setupPointerInteractions(this.canvas);
    window.addEventListener('resize', this.onWindowResize.bind(this));
    manager.itemEnd(stepKeys[5].id);

    // Step 7: Pre-warm WebGL shaders before animation loop starts
    onStageLabel?.(stepKeys[6].label);
    await nextTick();
    if (!this.isSoftwareGl) {
      try {
        this.renderer.compile(this.scene, this.camera);
      } catch {
        // non-fatal
      }
    }
    this.isInitialized = true;
    manager.itemEnd(stepKeys[6].id);
  }

  /**
   * Software-WebGL GPU fence pacing helper so headless/CPU WebGL never starves the main thread.
   */
  public afterDraw(cb: () => void): number {
    const gl = this.renderer.getContext() as WebGL2RenderingContext | null;
    if (!gl || typeof gl.fenceSync !== 'function') {
      return window.setTimeout(cb, 80);
    }
    const sync = gl.fenceSync(gl.SYNC_GPU_COMMANDS_COMPLETE, 0);
    gl.flush();
    const poll = () => {
      const state = sync && gl.getSyncParameter(sync, gl.SYNC_STATUS);
      if (state === gl.UNSIGNALED) {
        window.setTimeout(poll, 5);
      } else {
        if (sync) gl.deleteSync(sync);
        window.setTimeout(cb, 80);
      }
    };
    return window.setTimeout(poll, 5);
  }

  private setupPointerInteractions(canvas: HTMLCanvasElement) {
    const updateFlightSteeringFromClientX = (clientX: number) => {
      if (!this.inFlightMode || this.flightPaused) return;
      const rect = canvas.getBoundingClientRect();
      const normX = ((clientX - rect.left) / rect.width) * 2 - 1; // -1..+1
      this.steerAirplaneToNormalizedX(normX);
    };

    const handlePointerDown = (event: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      if (this.inFlightMode) {
        this.isFlightPointerDown = true;

        // Direct click/tap raycasting onto any of the 4 3D Answer Boxes in the sky
        if (!this.flightPaused && !this.flightAnswerTriggered) {
          this.raycaster.setFromCamera(this.pointer, this.camera);
          const boxTargets = this.answerBoxes.map((b) => b.group);
          const hits = this.raycaster.intersectObjects(boxTargets, true);
          if (hits.length > 0) {
            let obj: THREE.Object3D | null = hits[0].object;
            while (obj && obj.parent !== this.flightGroup) {
              obj = obj.parent;
            }
            const matched = this.answerBoxes.find((b) => b.group === obj);
            if (matched && !this.flightDisabledLanes.has(matched.laneIndex)) {
              if (this.flightActiveLane === matched.laneIndex) {
                this.boostAirplaneToAnswer();
              } else {
                this.selectAirplaneLane(matched.laneIndex);
              }
              return;
            }
          }
        }

        updateFlightSteeringFromClientX(event.clientX);
        return;
      }

      this.raycaster.setFromCamera(this.pointer, this.camera);

      // Check Nura companion
      const nuraHits = this.raycaster.intersectObjects([this.nuraCore, this.nuraRing], true);
      if (nuraHits.length > 0) {
        this.triggerNuraJoy();
        this.onNuraClicked?.();
        return;
      }
    };

    const handlePointerMove = (event: PointerEvent) => {
      if (this.inFlightMode) {
        if (event.pointerType === 'mouse' || this.isFlightPointerDown) {
          updateFlightSteeringFromClientX(event.clientX);
        }
        canvas.style.cursor = 'ew-resize';
        return;
      }

      const rect = canvas.getBoundingClientRect();
      this.pointer.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      this.pointer.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      this.raycaster.setFromCamera(this.pointer, this.camera);
      const nuraHits = this.raycaster.intersectObjects([this.nuraCore, this.nuraRing], true);
      canvas.style.cursor = nuraHits.length > 0 ? 'pointer' : 'default';
    };

    const handlePointerUp = () => {
      this.isFlightPointerDown = false;
    };

    canvas.addEventListener('pointerdown', handlePointerDown);
    canvas.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
    window.addEventListener('pointercancel', handlePointerUp);
  }

  private onWindowResize() {
    if (!this.renderer) return;
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.camera.aspect = w / h;
    if (this.inFlightMode) {
      // Shift optical center upward so 3D airplane & 4 answer boxes sit dead-center inside upper 80% sky zone
      this.camera.setViewOffset(w, h, 0, Math.round(h * 0.1), w, h);
    } else {
      this.camera.clearViewOffset();
    }
    this.camera.updateProjectionMatrix();
    this.renderer.setSize(w, h);
    this.renderer.setPixelRatio(this.isSoftwareGl ? 1 : Math.min(window.devicePixelRatio, 2));
  }

  private setupLighting() {
    // Ambient / Hemisphere Sky Light
    this.hemiLight = new THREE.HemisphereLight(0xe0f2fe, 0x1e293b, 1.8);
    this.scene.add(this.hemiLight);

    // Warm Sun Directional Light
    this.sunLight = new THREE.DirectionalLight(0xfffbeb, 2.2);
    this.sunLight.position.set(15, 28, 15);
    this.sunLight.castShadow = true;
    this.sunLight.shadow.mapSize.width = 1024;
    this.sunLight.shadow.mapSize.height = 1024;
    this.sunLight.shadow.camera.near = 0.5;
    this.sunLight.shadow.camera.far = 75;
    const d = 28;
    this.sunLight.shadow.camera.left = -d;
    this.sunLight.shadow.camera.right = d;
    this.sunLight.shadow.camera.top = d;
    this.sunLight.shadow.camera.bottom = -d;
    this.sunLight.shadow.bias = -0.0005;
    this.scene.add(this.sunLight);
  }

  private buildSchoolCampus() {
    // Ground Terrain (Lush grass with pathway)
    const groundGeo = new THREE.PlaneGeometry(80, 80);
    const groundMat = new THREE.MeshStandardMaterial({
      color: 0x14532d, // Emerald dark green grass
      roughness: 0.85,
      metalness: 0.1,
    });
    const ground = new THREE.Mesh(groundGeo, groundMat);
    ground.rotation.x = -Math.PI / 2;
    ground.receiveShadow = true;
    this.campusGroup.add(ground);

    // Stone / Paved Courtyard Center
    const courtGeo = new THREE.CylinderGeometry(14, 14, 0.08, 32);
    const courtMat = new THREE.MeshStandardMaterial({
      color: 0x334155, // Slate paved stone
      roughness: 0.7,
      metalness: 0.2,
    });
    const courtyard = new THREE.Mesh(courtGeo, courtMat);
    courtyard.position.set(0, 0.04, 0);
    courtyard.receiveShadow = true;
    this.campusGroup.add(courtyard);

    // Main School Building (Rear Backdrop)
    const buildingGroup = new THREE.Group();
    buildingGroup.position.set(0, 0, -18);

    // Building Base
    const baseGeo = new THREE.BoxGeometry(26, 6, 8);
    const baseMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      roughness: 0.5,
    });
    const base = new THREE.Mesh(baseGeo, baseMat);
    base.position.y = 3;
    base.castShadow = true;
    base.receiveShadow = true;
    buildingGroup.add(base);

    // Terracotta Tile Roof
    const roofGeo = new THREE.ConeGeometry(17, 3.5, 4);
    const roofMat = new THREE.MeshStandardMaterial({
      color: 0x991b1b, // Terracotta red
      roughness: 0.6,
    });
    const roof = new THREE.Mesh(roofGeo, roofMat);
    roof.position.y = 7.75;
    roof.rotation.y = Math.PI / 4;
    roof.scale.set(1.1, 1, 0.65);
    roof.castShadow = true;
    buildingGroup.add(roof);

    // White Pillars
    for (let x = -10; x <= 10; x += 4) {
      const pillarGeo = new THREE.CylinderGeometry(0.3, 0.35, 6, 16);
      const pillarMat = new THREE.MeshStandardMaterial({ color: 0xffffff });
      const pillar = new THREE.Mesh(pillarGeo, pillarMat);
      pillar.position.set(x, 3, 4.1);
      pillar.castShadow = true;
      buildingGroup.add(pillar);
    }

    // Windows
    for (let x = -10; x <= 10; x += 4) {
      const winGeo = new THREE.PlaneGeometry(1.6, 2.2);
      const winMat = new THREE.MeshStandardMaterial({
        color: 0x38bdf8,
        roughness: 0.1,
        metalness: 0.8,
      });
      const win = new THREE.Mesh(winGeo, winMat);
      win.position.set(x, 3.2, 4.02);
      buildingGroup.add(win);
    }

    // School Signboard on Building
    const signCanvas = document.createElement('canvas');
    signCanvas.width = 1024;
    signCanvas.height = 256;
    const signCtx = signCanvas.getContext('2d');
    if (signCtx) {
      signCtx.fillStyle = '#0f172a';
      signCtx.fillRect(0, 0, 1024, 256);
      signCtx.strokeStyle = '#eab308';
      signCtx.lineWidth = 12;
      signCtx.strokeRect(8, 8, 1008, 240);
      signCtx.fillStyle = '#facc15';
      signCtx.font = 'bold 54px Arial, sans-serif';
      signCtx.textAlign = 'center';
      signCtx.fillText('SDN KEDUNGRINGIN I BEJI', 512, 105);
      signCtx.fillStyle = '#ffffff';
      signCtx.font = 'bold 36px Arial, sans-serif';
      signCtx.fillText('KABUPATEN PASURUAN • JAWA TIMUR', 512, 165);
      signCtx.font = '28px Arial, sans-serif';
      signCtx.fillStyle = '#38bdf8';
      signCtx.fillText('KAMPUS PEMBELAJARAN PAI & BUDI PEKERTI', 512, 215);
    }
    const signTex = new THREE.CanvasTexture(signCanvas);
    const signGeo = new THREE.PlaneGeometry(8, 2);
    const signMat = new THREE.MeshBasicMaterial({ map: signTex });
    const signMesh = new THREE.Mesh(signGeo, signMat);
    signMesh.position.set(0, 5, 4.15);
    buildingGroup.add(signMesh);

    this.campusGroup.add(buildingGroup);

    // Indonesian Flag Pole (Tiang Bendera Merah Putih) in courtyard
    const poleGeo = new THREE.CylinderGeometry(0.08, 0.12, 9, 16);
    const poleMat = new THREE.MeshStandardMaterial({ color: 0xe2e8f0, metalness: 0.8 });
    const pole = new THREE.Mesh(poleGeo, poleMat);
    pole.position.set(-6, 4.5, -4);
    pole.castShadow = true;
    this.campusGroup.add(pole);

    // Merah Putih Flag
    const flagGeo = new THREE.PlaneGeometry(2.2, 1.3, 10, 5);
    const flagCanvas = document.createElement('canvas');
    flagCanvas.width = 256;
    flagCanvas.height = 150;
    const flagCtx = flagCanvas.getContext('2d');
    if (flagCtx) {
      flagCtx.fillStyle = '#dc2626'; // Merah
      flagCtx.fillRect(0, 0, 256, 75);
      flagCtx.fillStyle = '#ffffff'; // Putih
      flagCtx.fillRect(0, 75, 256, 75);
    }
    const flagTex = new THREE.CanvasTexture(flagCanvas);
    const flagMat = new THREE.MeshStandardMaterial({
      map: flagTex,
      side: THREE.DoubleSide,
      roughness: 0.7,
    });
    this.animFlag = new THREE.Mesh(flagGeo, flagMat);
    this.animFlag.position.set(-4.85, 8.2, -4);
    this.animFlag.castShadow = true;
    this.campusGroup.add(this.animFlag);

    // School Musholla (Right flank)
    const mushollaGroup = new THREE.Group();
    mushollaGroup.position.set(18, 0, -8);

    const mushollaBase = new THREE.Mesh(
      new THREE.BoxGeometry(9, 5, 9),
      new THREE.MeshStandardMaterial({ color: 0xf1f5f9 })
    );
    mushollaBase.position.y = 2.5;
    mushollaBase.castShadow = true;
    mushollaBase.receiveShadow = true;
    mushollaGroup.add(mushollaBase);

    // Green Dome
    const dome = new THREE.Mesh(
      new THREE.SphereGeometry(3.2, 24, 16, 0, Math.PI * 2, 0, Math.PI / 2),
      new THREE.MeshStandardMaterial({
        color: 0x059669, // Emerald green dome
        roughness: 0.3,
        metalness: 0.4,
      })
    );
    dome.position.y = 5;
    mushollaGroup.add(dome);

    // Crescent on dome
    const crescent = new THREE.Mesh(
      new THREE.TorusGeometry(0.6, 0.12, 16, 32, Math.PI * 1.5),
      new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.8, roughness: 0.2 })
    );
    crescent.position.set(0, 8.5, 0);
    crescent.rotation.z = Math.PI / 4;
    mushollaGroup.add(crescent);

    this.campusGroup.add(mushollaGroup);

    // Surrounding Trees & Flowers (Low-poly foliage)
    const treePositions = [
      [-16, 0, -10],
      [-20, 0, 0],
      [-17, 0, 10],
      [18, 0, 6],
      [22, 0, -2],
      [-10, 0, 18],
      [10, 0, 18],
    ];
    treePositions.forEach(([x, y, z]) => {
      const tree = this.createStylizedTree();
      tree.position.set(x, y, z);
      this.campusGroup.add(tree);
    });
  }

  private createStylizedTree(): THREE.Group {
    const group = new THREE.Group();

    // Trunk
    const trunkGeo = new THREE.CylinderGeometry(0.4, 0.6, 3, 8);
    const trunkMat = new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 });
    const trunk = new THREE.Mesh(trunkGeo, trunkMat);
    trunk.position.y = 1.5;
    trunk.castShadow = true;
    group.add(trunk);

    // Foliage (layered cones)
    const foliageColors = [0x15803d, 0x16a34a, 0x22c55e];
    for (let i = 0; i < 3; i++) {
      const coneGeo = new THREE.ConeGeometry(2.4 - i * 0.4, 2.2, 8);
      const coneMat = new THREE.MeshStandardMaterial({
        color: foliageColors[i],
        roughness: 0.8,
      });
      const cone = new THREE.Mesh(coneGeo, coneMat);
      cone.position.y = 3 + i * 1.3;
      cone.castShadow = true;
      group.add(cone);
    }
    return group;
  }

  private buildPortals() {
    // 5 Stages positioned in an inviting semicircular arc around courtyard
    const portalConfigs = [
      { id: 1, name: "Alam Al-Qur'an & Hadis", element: "Keindahan Alam • 4 Hutan", color: 0x10b981, angle: -Math.PI * 0.65 },
      { id: 2, name: "Puncak Keyakinan", element: "Akidah", color: 0x8b5cf6, angle: -Math.PI * 0.35 },
      { id: 3, name: "Desa Budi Pekerti", element: "Akhlak", color: 0xf59e0b, angle: 0 },
      { id: 4, name: "Simulasi Ibadah", element: "Fikih", color: 0x0ea5e9, angle: Math.PI * 0.35 },
      { id: 5, name: "Lorong Waktu", element: "Tarikh Islam", color: 0xec4899, angle: Math.PI * 0.65 },
    ];

    const radius = 9.5;

    portalConfigs.forEach((cfg) => {
      const x = Math.sin(cfg.angle) * radius;
      const z = -Math.cos(cfg.angle) * radius * 0.7 - 2;

      const portalGroup = new THREE.Group();
      portalGroup.position.set(x, 0, z);

      // Stone Pedestal
      const pedGeo = new THREE.CylinderGeometry(1.5, 1.8, 0.35, 16);
      const pedMat = new THREE.MeshStandardMaterial({ color: 0x1e293b, roughness: 0.7 });
      const ped = new THREE.Mesh(pedGeo, pedMat);
      ped.position.y = 0.175;
      ped.receiveShadow = true;
      portalGroup.add(ped);

      // Portal Arch Pillars
      const archPillarGeo = new THREE.CylinderGeometry(0.18, 0.22, 3.8, 12);
      const archMat = new THREE.MeshStandardMaterial({
        color: 0x334155,
        metalness: 0.6,
        roughness: 0.3,
      });

      const pLeft = new THREE.Mesh(archPillarGeo, archMat);
      pLeft.position.set(-1.1, 1.9, 0);
      pLeft.castShadow = true;
      portalGroup.add(pLeft);

      const pRight = new THREE.Mesh(archPillarGeo, archMat);
      pRight.position.set(1.1, 1.9, 0);
      pRight.castShadow = true;
      portalGroup.add(pRight);

      // Arch Top Archway
      const archTop = new THREE.Mesh(
        new THREE.TorusGeometry(1.1, 0.18, 16, 24, Math.PI),
        archMat
      );
      archTop.position.set(0, 3.8, 0);
      archTop.castShadow = true;
      portalGroup.add(archTop);

      // Rotating Rune Ring
      const ringGeo = new THREE.TorusGeometry(0.85, 0.06, 16, 32);
      const ringMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.8,
        metalness: 0.9,
        roughness: 0.1,
      });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.set(0, 2.2, 0);
      portalGroup.add(ringMesh);
      this.animRings.push(ringMesh);

      // Floating Glow Crystal Monolith
      const crystalGeo = new THREE.OctahedronGeometry(0.55, 0);
      const crystalMat = new THREE.MeshStandardMaterial({
        color: cfg.color,
        emissive: cfg.color,
        emissiveIntensity: 0.6,
        roughness: 0.1,
        metalness: 0.2,
        transparent: true,
        opacity: 0.88,
      });
      const crystalMesh = new THREE.Mesh(crystalGeo, crystalMat);
      crystalMesh.position.set(0, 2.2, 0);
      portalGroup.add(crystalMesh);

      // Glow PointLight
      const portalLight = new THREE.PointLight(cfg.color, 2.2, 6);
      portalLight.position.set(0, 2.2, 0);
      portalGroup.add(portalLight);

      // Color-Coded 'Cahaya Ilmu' Particle System for this Portal
      const particleCount = 100;
      const positions = new Float32Array(particleCount * 3);
      const angles = new Float32Array(particleCount);
      const radii = new Float32Array(particleCount);
      const speeds = new Float32Array(particleCount);

      for (let i = 0; i < particleCount; i++) {
        angles[i] = Math.random() * Math.PI * 2;
        radii[i] = 0.45 + Math.random() * 0.95;
        speeds[i] = 0.7 + Math.random() * 1.1;
        positions[i * 3 + 0] = Math.cos(angles[i]) * radii[i];
        positions[i * 3 + 1] = 0.2 + Math.random() * 3.8;
        positions[i * 3 + 2] = Math.sin(angles[i]) * radii[i];
      }

      const particleGeo = new THREE.BufferGeometry();
      particleGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

      const particleMat = new THREE.PointsMaterial({
        color: cfg.color,
        size: 0.22,
        map: this.glowTexture,
        transparent: true,
        opacity: 0.4,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const particles = new THREE.Points(particleGeo, particleMat);
      portalGroup.add(particles);

      // 3D Canvas Label Above Portal
      const labelCanvas = document.createElement('canvas');
      labelCanvas.width = 512;
      labelCanvas.height = 160;
      const lctx = labelCanvas.getContext('2d');
      if (lctx) {
        lctx.fillStyle = 'rgba(15, 23, 42, 0.88)';
        lctx.roundRect(10, 10, 492, 140, 24);
        lctx.fill();
        lctx.strokeStyle = `#${cfg.color.toString(16).padStart(6, '0')}`;
        lctx.lineWidth = 6;
        lctx.stroke();

        lctx.fillStyle = '#ffffff';
        lctx.font = 'bold 36px Arial, sans-serif';
        lctx.textAlign = 'center';
        lctx.fillText(`Stage ${cfg.id}: ${cfg.name}`, 256, 68);

        lctx.font = 'bold 24px Arial, sans-serif';
        lctx.fillStyle = `#${cfg.color.toString(16).padStart(6, '0')}`;
        lctx.fillText(`Elemen ${cfg.element}`, 256, 115);
      }
      const labelTex = new THREE.CanvasTexture(labelCanvas);
      const labelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.8, 0.9),
        new THREE.MeshBasicMaterial({ map: labelTex, transparent: true, side: THREE.DoubleSide })
      );
      labelMesh.position.set(0, 4.4, 0);
      portalGroup.add(labelMesh);

      this.campusGroup.add(portalGroup);

      this.portals.push({
        stageId: cfg.id,
        name: cfg.name,
        element: cfg.element,
        color: cfg.color,
        position: new THREE.Vector3(x, 0, z),
        meshGroup: portalGroup,
        crystalMesh,
        ringMesh,
        portalLight,
        particles,
        particleGeo,
        particleMat,
        particleAngles: angles,
        particleRadii: radii,
        particleSpeeds: speeds,
      });
    });
  }

  // ==================== REAL-TIME MULTIPLAYER AVATARS (NO NPCS) ====================
  private createRemoteNameplateTexture(name: string, institution: string, level: number): THREE.CanvasTexture {
    const npCanvas = document.createElement('canvas');
    npCanvas.width = 440;
    npCanvas.height = 120;
    const npCtx = npCanvas.getContext('2d');
    if (npCtx) {
      npCtx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      npCtx.roundRect(8, 8, 424, 104, 22);
      npCtx.fill();
      npCtx.strokeStyle = '#38bdf8';
      npCtx.lineWidth = 4;
      npCtx.stroke();

      npCtx.fillStyle = '#ffffff';
      npCtx.font = 'bold 30px Arial, sans-serif';
      npCtx.textAlign = 'center';
      npCtx.fillText(name.slice(0, 22), 220, 50);

      npCtx.fillStyle = '#facc15';
      npCtx.font = 'bold 21px Arial, sans-serif';
      npCtx.fillText(`${institution.slice(0, 24)} • Lv. ${level}`, 220, 88);
    }
    const tex = new THREE.CanvasTexture(npCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private createRemotePlayerMesh(player: LiveRemotePlayer): RemotePlayerAvatar {
    const group = new THREE.Group();
    group.position.set(player.x, player.y, player.z);
    group.rotation.y = player.rotY;

    const bodyGeo = new THREE.CylinderGeometry(0.34, 0.37, 0.92, 12);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    const bodyMesh = new THREE.Mesh(bodyGeo, bodyMat);
    bodyMesh.position.y = 1.02;
    bodyMesh.castShadow = true;
    group.add(bodyMesh);

    const headGeo = new THREE.SphereGeometry(0.32, 18, 18);
    const headMat = new THREE.MeshStandardMaterial({ map: this.sharedFaceTexture, roughness: 0.5 });
    const headMesh = new THREE.Mesh(headGeo, headMat);
    headMesh.position.set(0, 1.74, 0);
    headMesh.rotation.y = -Math.PI / 2;
    headMesh.castShadow = true;
    group.add(headMesh);

    const capGeo = new THREE.CylinderGeometry(0.33, 0.34, 0.2, 14);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
    const capMesh = new THREE.Mesh(capGeo, capMat);
    capMesh.position.set(0, 1.92, 0);
    group.add(capMesh);

    const legGeo = new THREE.CylinderGeometry(0.11, 0.12, 0.62, 8);
    const legLMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });
    const legLeft = new THREE.Mesh(legGeo, legLMat);
    legLeft.position.set(-0.18, 0.35, 0);
    legLeft.castShadow = true;
    group.add(legLeft);

    const legRight = new THREE.Mesh(legGeo, legLMat.clone());
    legRight.position.set(0.18, 0.35, 0);
    legRight.castShadow = true;
    group.add(legRight);

    const armGeo = new THREE.CylinderGeometry(0.095, 0.095, 0.62, 8);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });
    const armLeft = new THREE.Mesh(armGeo, armMat);
    armLeft.position.set(-0.46, 1.06, 0);
    group.add(armLeft);

    const armRight = new THREE.Mesh(armGeo, armMat.clone());
    armRight.position.set(0.46, 1.06, 0);
    group.add(armRight);

    // Online green beacon ring under feet
    const footRing = new THREE.Mesh(
      new THREE.RingGeometry(0.45, 0.56, 20),
      new THREE.MeshBasicMaterial({ color: 0x38bdf8, side: THREE.DoubleSide, transparent: true, opacity: 0.65 })
    );
    footRing.rotation.x = -Math.PI / 2;
    footRing.position.y = 0.05;
    group.add(footRing);

    const npTex = this.createRemoteNameplateTexture(player.name, player.institution, player.level);
    const nameplateMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(1.9, 0.52),
      new THREE.MeshBasicMaterial({ map: npTex, transparent: true, side: THREE.DoubleSide })
    );
    nameplateMesh.position.set(0, 2.48, 0);
    group.add(nameplateMesh);

    const costume = (player.costume as CostumeType) || 'sd';
    this.applyCostumeToMaterials(
      costume,
      bodyMat,
      armMat,
      armRight.material as THREE.MeshStandardMaterial,
      legLMat,
      legRight.material as THREE.MeshStandardMaterial,
      capMat,
      capMesh
    );

    group.visible = !this.inFlightMode && player.stageId === this.currentActiveStage;
    this.scene.add(group);

    return {
      id: player.id,
      name: player.name,
      institution: player.institution,
      grade: player.grade,
      level: player.level,
      costume,
      stageId: player.stageId,
      isMoving: player.isMoving,
      group,
      bodyMesh,
      armLeft,
      armRight,
      legLeft,
      legRight,
      capMesh,
      nameplateMesh,
      targetPos: new THREE.Vector3(player.x, player.y, player.z),
      targetRotY: player.rotY,
      walkPhase: 0,
    };
  }

  public syncRemotePlayersSnapshot(players: LiveRemotePlayer[], localPlayerId: string | null) {
    const incomingIds = new Set<string>();
    for (const p of players) {
      if (localPlayerId && p.id === localPlayerId) continue;
      incomingIds.add(p.id);
      this.upsertRemotePlayer(p, localPlayerId);
    }
    for (const existingId of Array.from(this.remotePlayers.keys())) {
      if (!incomingIds.has(existingId)) {
        this.removeRemotePlayer(existingId);
      }
    }
  }

  public upsertRemotePlayer(player: LiveRemotePlayer, localPlayerId: string | null) {
    if (localPlayerId && player.id === localPlayerId) return;
    const existing = this.remotePlayers.get(player.id);
    if (!existing) {
      const avatar = this.createRemotePlayerMesh(player);
      this.remotePlayers.set(player.id, avatar);
      return;
    }

    const levelChanged = existing.level !== player.level || existing.name !== player.name || existing.institution !== player.institution;
    const costumeChanged = existing.costume !== player.costume;

    existing.name = player.name;
    existing.institution = player.institution;
    existing.grade = player.grade;
    existing.level = player.level;
    existing.stageId = player.stageId;
    existing.isMoving = player.isMoving;
    existing.targetPos.set(player.x, player.y, player.z);
    existing.targetRotY = player.rotY;

    if (costumeChanged) {
      existing.costume = (player.costume as CostumeType) || 'sd';
      this.applyCostumeToMaterials(
        existing.costume,
        existing.bodyMesh.material as THREE.MeshStandardMaterial,
        existing.armLeft.material as THREE.MeshStandardMaterial,
        existing.armRight.material as THREE.MeshStandardMaterial,
        existing.legLeft.material as THREE.MeshStandardMaterial,
        existing.legRight.material as THREE.MeshStandardMaterial,
        existing.capMesh.material as THREE.MeshStandardMaterial,
        existing.capMesh
      );
    }

    if (levelChanged) {
      const mat = existing.nameplateMesh.material as THREE.MeshBasicMaterial;
      mat.map?.dispose();
      mat.map = this.createRemoteNameplateTexture(player.name, player.institution, player.level);
      mat.needsUpdate = true;
    }
  }

  public removeRemotePlayer(playerId: string) {
    const avatar = this.remotePlayers.get(playerId);
    if (!avatar) return;
    const npMat = avatar.nameplateMesh.material as THREE.MeshBasicMaterial;
    npMat.map?.dispose();
    this.scene.remove(avatar.group);
    this.remotePlayers.delete(playerId);
    if (this.activeNearRemotePlayer?.id === playerId) {
      this.activeNearRemotePlayer = null;
    }
    if (this.spectatedPlayerId === playerId) {
      this.spectatedPlayerId = null;
    }
  }

  public getRemotePlayersList(): RemotePlayerAvatar[] {
    return Array.from(this.remotePlayers.values());
  }

  // ==================== HELPER: PROCEDURAL ARCHWAY SIGN GATE ====================
  private createForestArchGate(
    title: string,
    subtitle: string,
    accentColor: number,
    pillarColor: number,
    isEntranceArch: boolean = false
  ): { group: THREE.Group; ringMesh: THREE.Mesh; crystalMesh: THREE.Mesh } {
    const group = new THREE.Group();

    const width = isEntranceArch ? 2.8 : 1.7;
    const height = isEntranceArch ? 4.4 : 3.7;

    // Pedestal base
    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(width + 0.6, width + 0.85, 0.25, 16),
      new THREE.MeshStandardMaterial({ color: 0x334155, roughness: 0.85 })
    );
    base.position.y = 0.125;
    base.receiveShadow = true;
    group.add(base);

    // Timber / Stone Pillars
    const pGeo = new THREE.CylinderGeometry(0.19, 0.25, height, 10);
    const pMat = new THREE.MeshStandardMaterial({ color: pillarColor, roughness: 0.75 });
    const leftP = new THREE.Mesh(pGeo, pMat);
    leftP.position.set(-width, height / 2, 0);
    leftP.castShadow = true;
    group.add(leftP);

    const rightP = new THREE.Mesh(pGeo, pMat);
    rightP.position.set(width, height / 2, 0);
    rightP.castShadow = true;
    group.add(rightP);

    // Crossbeam / Arch
    const topBeam = new THREE.Mesh(
      new THREE.TorusGeometry(width, 0.2, 10, 24, Math.PI),
      new THREE.MeshStandardMaterial({ color: accentColor, roughness: 0.45, metalness: 0.3 })
    );
    topBeam.position.set(0, height, 0);
    topBeam.castShadow = true;
    group.add(topBeam);

    // Glowing Ring & Crystal Emblem inside Gate
    const ringMesh = new THREE.Mesh(
      new THREE.TorusGeometry(isEntranceArch ? 0.75 : 0.68, 0.05, 12, 28),
      new THREE.MeshStandardMaterial({
        color: accentColor,
        emissive: accentColor,
        emissiveIntensity: 0.9,
        roughness: 0.2,
      })
    );
    ringMesh.position.set(0, 2.3, 0);
    group.add(ringMesh);

    const crystalMesh = new THREE.Mesh(
      new THREE.OctahedronGeometry(isEntranceArch ? 0.4 : 0.38, 0),
      new THREE.MeshStandardMaterial({
        color: 0xffffff,
        emissive: accentColor,
        emissiveIntensity: 1.1,
        roughness: 0.1,
        transparent: true,
        opacity: 0.9,
      })
    );
    crystalMesh.position.set(0, 2.3, 0);
    group.add(crystalMesh);

    // Signboard Canvas above Arch
    const canvas = document.createElement('canvas');
    canvas.width = 560;
    canvas.height = 160;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      ctx.fillStyle = 'rgba(15, 23, 42, 0.92)';
      ctx.roundRect(10, 10, 540, 140, 24);
      ctx.fill();
      ctx.strokeStyle = `#${accentColor.toString(16).padStart(6, '0')}`;
      ctx.lineWidth = 6;
      ctx.stroke();

      ctx.fillStyle = '#ffffff';
      ctx.font = 'bold 34px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.fillText(title, 280, 68);

      ctx.fillStyle = `#${accentColor.toString(16).padStart(6, '0')}`;
      ctx.font = 'bold 22px Arial, sans-serif';
      ctx.fillText(subtitle, 280, 114);
    }
    const signTex = new THREE.CanvasTexture(canvas);
    signTex.colorSpace = THREE.SRGBColorSpace;
    const signMesh = new THREE.Mesh(
      new THREE.PlaneGeometry(isEntranceArch ? 4.4 : 3.2, isEntranceArch ? 1.25 : 0.92),
      new THREE.MeshBasicMaterial({ map: signTex, transparent: true, side: THREE.DoubleSide })
    );
    signMesh.position.set(0, height + width + 0.55, 0);
    group.add(signMesh);

    return { group, ringMesh, crystalMesh };
  }

  private createLeafyTree(scale: number = 1, canopyColor: number = 0x22c55e): THREE.Group {
    const group = new THREE.Group();
    const trunk = new THREE.Mesh(
      new THREE.CylinderGeometry(0.28 * scale, 0.42 * scale, 2.5 * scale, 8),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.9 })
    );
    trunk.position.y = 1.25 * scale;
    trunk.castShadow = true;
    group.add(trunk);

    const canopyOffsets = [
      [0, 3.0 * scale, 0, 1.55 * scale],
      [-0.7 * scale, 2.5 * scale, 0.4 * scale, 1.05 * scale],
      [0.75 * scale, 2.6 * scale, -0.35 * scale, 1.1 * scale],
    ];
    canopyOffsets.forEach(([cx, cy, cz, cr], idx) => {
      const leaf = new THREE.Mesh(
        new THREE.DodecahedronGeometry(cr, 1),
        new THREE.MeshStandardMaterial({
          color: idx === 0 ? canopyColor : 0x16a34a,
          roughness: 0.78,
        })
      );
      leaf.position.set(cx, cy, cz);
      leaf.castShadow = true;
      group.add(leaf);
    });
    return group;
  }

  private createCloudCluster(scale: number = 1): THREE.Group {
    const cloud = new THREE.Group();
    const mat = new THREE.MeshStandardMaterial({
      color: 0xffffff,
      roughness: 0.95,
      emissive: 0xe0f2fe,
      emissiveIntensity: 0.25,
    });
    const puffs = [
      [0, 0, 0, 1.4],
      [-1.1, -0.2, 0.2, 1.0],
      [1.2, -0.15, -0.1, 1.1],
      [0.3, 0.45, 0.3, 1.0],
    ];
    puffs.forEach(([x, y, z, r]) => {
      const mesh = new THREE.Mesh(new THREE.SphereGeometry(r * scale, 10, 10), mat);
      mesh.position.set(x * scale, y * scale, z * scale);
      cloud.add(mesh);
    });
    return cloud;
  }

  // ==================== 5 DISTINCT 3D BIOME MAPS ====================
  private build5BiomeMaps() {
    // ------------------------------------------------------------------
    // STAGE 1: MAP KEINDAHAN ALAM & PEMANDANGAN (Al-Qur'an dan Hadis)
    // Pintu Awal -> Hutan Tajwid, Hutan Al-Qur'an, Hutan Hadis, Hutan Hijaiyah
    // ------------------------------------------------------------------
    const s1Group = new THREE.Group();
    s1Group.visible = false;

    // 1A. Rolling Lush Meadow Ground
    const s1Ground = new THREE.Mesh(
      new THREE.PlaneGeometry(130, 130),
      new THREE.MeshStandardMaterial({ color: 0x22c55e, roughness: 0.88, metalness: 0.05 })
    );
    s1Ground.rotation.x = -Math.PI / 2;
    s1Ground.receiveShadow = true;
    s1Group.add(s1Ground);

    // Gentle Sunlit Grass Hills on flanks
    const hillConfigs = [
      [-26, -12, 14, 5.5],
      [26, -14, 15, 6.2],
      [-28, 8, 12, 4.2],
      [28, 9, 12, 4.5],
    ];
    hillConfigs.forEach(([hx, hz, hr, hh]) => {
      const hill = new THREE.Mesh(
        new THREE.SphereGeometry(hr, 18, 12, 0, Math.PI * 2, 0, Math.PI / 2),
        new THREE.MeshStandardMaterial({ color: 0x16a34a, roughness: 0.9 })
      );
      hill.position.set(hx, -0.3, hz);
      hill.scale.y = hh / hr;
      hill.receiveShadow = true;
      s1Group.add(hill);
    });

    // 1B. Stone Forest Paths from Pintu Awal (0, 13) -> Center Plaza (0, 0) & 4 Forest Gates
    const pathMat = new THREE.MeshStandardMaterial({ color: 0xd6d3d1, roughness: 0.9 });
    const mainPath = new THREE.Mesh(new THREE.BoxGeometry(3.4, 0.06, 29), pathMat);
    mainPath.position.set(0, 0.03, 2.5);
    mainPath.receiveShadow = true;
    s1Group.add(mainPath);

    // Circular Nature Plaza around Battle Center (clear arena for combat)
    const plaza = new THREE.Mesh(
      new THREE.CylinderGeometry(5.8, 6.2, 0.07, 24),
      new THREE.MeshStandardMaterial({ color: 0xe7e5e4, roughness: 0.82 })
    );
    plaza.position.set(0, 0.035, 0);
    plaza.receiveShadow = true;
    s1Group.add(plaza);

    // Branching Stone Stepping Paths to the 4 Forest Gates
    const branchTargets: [number, number][] = [
      [-12.5, 4.5], // Hutan Tajwid
      [-6.5, -3.5], // Hutan Al-Qur'an
      [6.5, -3.5],  // Hutan Hadis
      [12.5, 4.5],  // Hutan Hijaiyah
    ];
    branchTargets.forEach(([tx, tz]) => {
      for (let step = 1; step <= 6; step++) {
        const t = step / 6;
        const px = tx * t;
        const pz = 7 + (tz - 7) * t;
        const stone = new THREE.Mesh(new THREE.CylinderGeometry(0.8, 0.9, 0.07, 10), pathMat);
        stone.position.set(px, 0.035, pz);
        stone.receiveShadow = true;
        s1Group.add(stone);
      }
    });

    // 1C. Sparkling River, Waterfall Cliff & Wooden Arch Bridge
    const riverMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      emissive: 0x0369a1,
      emissiveIntensity: 0.35,
      roughness: 0.15,
      metalness: 0.6,
    });
    const river = new THREE.Mesh(new THREE.PlaneGeometry(110, 5.2), riverMat);
    river.rotation.x = -Math.PI / 2;
    river.position.set(0, 0.08, -11.5);
    s1Group.add(river);

    // Sandy/pebble riverbanks
    [-8.7, -14.3].forEach((rz) => {
      const bank = new THREE.Mesh(
        new THREE.BoxGeometry(110, 0.14, 0.9),
        new THREE.MeshStandardMaterial({ color: 0xfde68a, roughness: 0.9 })
      );
      bank.position.set(0, 0.05, rz);
      s1Group.add(bank);
    });

    // Wooden Bridge across the river at x = 0, z = -11.5
    const bridgeMat = new THREE.MeshStandardMaterial({ color: 0x92400e, roughness: 0.85 });
    const bridgeDeck = new THREE.Mesh(new THREE.BoxGeometry(3.6, 0.25, 6.4), bridgeMat);
    bridgeDeck.position.set(0, 0.35, -11.5);
    bridgeDeck.castShadow = true;
    bridgeDeck.receiveShadow = true;
    s1Group.add(bridgeDeck);

    [-1.65, 1.65].forEach((bx) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.65, 6.4), bridgeMat);
      rail.position.set(bx, 0.8, -11.5);
      s1Group.add(rail);
    });

    // Waterfall Cliff & Cascading Water at z = -22
    const cliffMat = new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 });
    const cliff = new THREE.Mesh(new THREE.DodecahedronGeometry(6.5, 1), cliffMat);
    cliff.position.set(-7, 4.5, -24);
    cliff.scale.set(1.4, 1.5, 0.9);
    s1Group.add(cliff);

    const cliffRight = new THREE.Mesh(new THREE.DodecahedronGeometry(6.0, 1), cliffMat);
    cliffRight.position.set(7, 4.2, -24);
    cliffRight.scale.set(1.4, 1.4, 0.9);
    s1Group.add(cliffRight);

    const wfStreamMat = new THREE.MeshStandardMaterial({
      color: 0x7dd3fc,
      emissive: 0x38bdf8,
      emissiveIntensity: 0.65,
      transparent: true,
      opacity: 0.85,
      roughness: 0.1,
    });
    for (let w = 0; w < 2; w++) {
      const stream = new THREE.Mesh(new THREE.BoxGeometry(3.2, 9.5, 0.6), wfStreamMat.clone());
      stream.position.set(0, 4.8, -21.2 + w * 0.35);
      s1Group.add(stream);
      this.waterfallStreams.push(stream);
    }
    // Splash pool foam
    const foam = new THREE.Mesh(
      new THREE.CylinderGeometry(4.2, 4.5, 0.16, 20),
      new THREE.MeshStandardMaterial({ color: 0xe0f2fe, emissive: 0x7dd3fc, emissiveIntensity: 0.5 })
    );
    foam.position.set(0, 0.12, -19);
    s1Group.add(foam);

    // 1D. Majestic Layered Mountains with Sunlit Peaks on Horizon
    const mtnSpecs = [
      [-32, -38, 16, 22, 0x15803d],
      [-15, -42, 18, 28, 0x166534],
      [14, -44, 20, 30, 0x14532d],
      [34, -36, 15, 21, 0x15803d],
      [0, -48, 22, 34, 0x166534],
    ];
    mtnSpecs.forEach(([mx, mz, mr, mh, mCol]) => {
      const mtn = new THREE.Mesh(
        new THREE.ConeGeometry(mr, mh, 7),
        new THREE.MeshStandardMaterial({ color: mCol, roughness: 0.92 })
      );
      mtn.position.set(mx, mh / 2 - 1, mz);
      s1Group.add(mtn);

      // Snow / Misty Peak Cap
      const cap = new THREE.Mesh(
        new THREE.ConeGeometry(mr * 0.32, mh * 0.32, 7),
        new THREE.MeshStandardMaterial({ color: 0xf0f9ff, roughness: 0.7 })
      );
      cap.position.set(mx, mh * 0.84 - 1, mz);
      s1Group.add(cap);
    });

    // Radiant Sun & Fluffy Drifting Clouds
    const sunDisc = new THREE.Mesh(
      new THREE.SphereGeometry(4.5, 20, 20),
      new THREE.MeshBasicMaterial({ color: 0xfef08a })
    );
    sunDisc.position.set(-22, 24, -45);
    s1Group.add(sunDisc);

    [
      [-18, 18, -28, 1.3],
      [16, 20, -32, 1.5],
      [2, 22, -38, 1.6],
      [-26, 16, -16, 1.1],
    ].forEach(([cx, cy, cz, cs]) => {
      const cl = this.createCloudCluster(cs);
      cl.position.set(cx, cy, cz);
      s1Group.add(cl);
      this.natureClouds.push(cl);
    });

    // 1E. Lush Diverse Forest Trees, River Boulders & Colorful Wildflowers
    const pineSpots = [
      [-18, 11], [-16, -5], [-21, 1], [-19, -18],
      [18, 11], [16, -5], [21, 1], [19, -18],
      [-11, -18], [11, -18], [-8, 14], [8, 14],
    ];
    pineSpots.forEach(([tx, tz], i) => {
      const tree = i % 2 === 0 ? this.createStylizedTree() : this.createLeafyTree(1.05, 0x22c55e);
      tree.position.set(tx, 0, tz);
      s1Group.add(tree);
    });

    const flowerColors = [0xfacc15, 0xf472b6, 0x38bdf8, 0xffffff, 0xfb923c];
    for (let f = 0; f < 42; f++) {
      const fx = (Math.random() - 0.5) * 44;
      const fz = (Math.random() - 0.5) * 34;
      if (Math.abs(fx) < 6 && Math.abs(fz) < 5) continue; // Keep battle center clean
      if (fz < -8 && fz > -15) continue; // Keep out of river
      const flower = new THREE.Mesh(
        new THREE.DodecahedronGeometry(0.18, 0),
        new THREE.MeshStandardMaterial({
          color: flowerColors[f % flowerColors.length],
          emissive: flowerColors[f % flowerColors.length],
          emissiveIntensity: 0.2,
        })
      );
      flower.position.set(fx, 0.18, fz);
      s1Group.add(flower);
    }

    // Floating Golden Sunbeams / Firefly Nature Particles
    const ffCount = 120;
    const ffPos = new Float32Array(ffCount * 3);
    for (let i = 0; i < ffCount; i++) {
      ffPos[i * 3 + 0] = (Math.random() - 0.5) * 42;
      ffPos[i * 3 + 1] = 0.6 + Math.random() * 5.5;
      ffPos[i * 3 + 2] = (Math.random() - 0.5) * 38;
    }
    const ffGeo = new THREE.BufferGeometry();
    ffGeo.setAttribute('position', new THREE.BufferAttribute(ffPos, 3));
    const ffMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.3,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.85,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.stage1Fireflies = new THREE.Points(ffGeo, ffMat);
    s1Group.add(this.stage1Fireflies);

    // 1F. PINTU AWAL + 4 FOREST ARCHWAYS (Hutan Tajwid, Hutan Al-Qur'an, Hutan Hadis, Hutan Hijaiyah) + GERBANG BOS
    const pintuAwal = this.createForestArchGate(
      '🌿 PINTU AWAL KEINDAHAN ALAM',
      'Hutan Tajwid • Al-Qur\'an • Hadis • Hijaiyah',
      0xfacc15,
      0x78350f,
      true
    );
    pintuAwal.group.position.set(0, 0, 12.8);
    s1Group.add(pintuAwal.group);

    const stage1ForestGates: Omit<BiomeGateNode, 'ringMesh' | 'crystalMesh'>[] = [
      {
        id: 's1-tajwid',
        stageId: 1,
        name: 'Hutan Tajwid',
        subtitle: 'Pintu Awal Ilmu Tajwid & Makharijul Huruf',
        description: 'Di rimbunnya Hutan Tajwid ini, gemericik air mengingatkan kita untuk membaca Al-Qur\'an secara tartil, menjaga dengung gunah serta panjang mad.',
        color: 0x10b981,
        position: new THREE.Vector3(-12.5, 0, 4.5),
      },
      {
        id: 's1-alquran',
        stageId: 1,
        name: 'Hutan Al-Qur\'an',
        subtitle: 'Pintu Awal Tadabur & Surah Pilihan',
        description: 'Hamparan pemandangan indah di Hutan Al-Qur\'an mengajak kita merenungi kebesaran Allah Swt. pencipta gunung, sungai, dan langit nan biru.',
        color: 0x14b8a6,
        position: new THREE.Vector3(-6.5, 0, -3.5),
      },
      {
        id: 's1-hadis',
        stageId: 1,
        name: 'Hutan Hadis',
        subtitle: 'Pintu Awal Teladan Sabda Nabi Muhammad saw.',
        description: 'Di Hutan Hadis dekat jembatan kayu ini, kita memetik mutiara sabda Rasulullah saw. tentang kasih sayang terhadap sesama dan alam semesta.',
        color: 0xf59e0b,
        position: new THREE.Vector3(6.5, 0, -3.5),
      },
      {
        id: 's1-hijaiyah',
        stageId: 1,
        name: 'Hutan Hijaiyah',
        subtitle: 'Pintu Awal Huruf Hijaiyah & Harakat',
        description: 'Kristal cahaya di Hutan Hijaiyah memancarkan keindahan 28 huruf hijaiyah sebagai gerbang pertama mencintai kitab suci Al-Qur\'an.',
        color: 0x06b6d4,
        position: new THREE.Vector3(12.5, 0, 4.5),
      },
      {
        id: 's1-boss',
        stageId: 1,
        name: 'Gerbang Penjaga Alam',
        subtitle: 'Arena Ujian AKM & Bos Penjaga Gerbang',
        description: 'Menyeberangi jembatan sungai menuju puncak ujian untuk membuktikan pemahaman Al-Qur\'an dan Hadis!',
        color: 0xef4444,
        position: new THREE.Vector3(0, 0, -16.5),
      },
    ];

    stage1ForestGates.forEach((cfg) => {
      const arch = this.createForestArchGate(
        cfg.name,
        cfg.subtitle,
        cfg.color,
        0x57534e,
        false
      );
      arch.group.position.copy(cfg.position);
      // Orient side gates politely toward central plaza
      arch.group.lookAt(0, 0, 6);
      s1Group.add(arch.group);
      this.biomeGates.push({
        ...cfg,
        ringMesh: arch.ringMesh,
        crystalMesh: arch.crystalMesh,
      });
    });

    this.scene.add(s1Group);
    this.biomeGroups.set(1, s1Group);

    // ------------------------------------------------------------------
    // STAGE 2: PUNCAK KEYAKINAN (Akidah) - Floating Sky Islands & Clouds
    // ------------------------------------------------------------------
    const s2Group = new THREE.Group();
    s2Group.visible = false;

    const s2Floor = new THREE.Mesh(
      new THREE.CylinderGeometry(24, 18, 2, 24),
      new THREE.MeshStandardMaterial({ color: 0x312e81, roughness: 0.75 })
    );
    s2Floor.position.set(0, -1, 0);
    s2Floor.receiveShadow = true;
    s2Group.add(s2Floor);

    const s2Rim = new THREE.Mesh(
      new THREE.TorusGeometry(23.8, 0.35, 10, 48),
      new THREE.MeshStandardMaterial({ color: 0xa78bfa, emissive: 0x7c3aed, emissiveIntensity: 0.7 })
    );
    s2Rim.rotation.x = Math.PI / 2;
    s2Rim.position.y = 0.05;
    s2Group.add(s2Rim);

    for (let i = 0; i < 6; i++) {
      const angle = (i / 6) * Math.PI * 2;
      const dist = 29;
      const island = new THREE.Mesh(
        new THREE.CylinderGeometry(3.8, 1.0, 2.6, 12),
        new THREE.MeshStandardMaterial({ color: 0x475569, roughness: 0.9 })
      );
      island.position.set(Math.cos(angle) * dist, 1.5 + Math.sin(i) * 2.5, Math.sin(angle) * dist - 4);
      s2Group.add(island);

      const spire = new THREE.Mesh(
        new THREE.ConeGeometry(0.9, 4.2, 6),
        new THREE.MeshStandardMaterial({ color: 0x8b5cf6, emissive: 0x7c3aed, emissiveIntensity: 1.0 })
      );
      spire.position.set(Math.cos(angle) * dist, 4.6 + Math.sin(i) * 2.5, Math.sin(angle) * dist - 4);
      s2Group.add(spire);
    }

    const s2StartArch = this.createForestArchGate('⛰️ PINTU AWAL PUNCAK KEYAKINAN', 'Pilar Rukun Iman & Asmaulhusna', 0xa78bfa, 0x334155, true);
    s2StartArch.group.position.set(0, 0, 12.8);
    s2Group.add(s2StartArch.group);

    const s2BossArch = this.createForestArchGate('⚡ Altar Ujian Tauhid', 'Tantang Bos Penjaga Puncak Keyakinan', 0x38bdf8, 0x1e293b, false);
    s2BossArch.group.position.set(0, 0, -10.5);
    s2Group.add(s2BossArch.group);
    this.biomeGates.push({
      id: 's2-boss',
      stageId: 2,
      name: 'Altar Puncak Keyakinan',
      subtitle: 'Tantangan Bos Akidah & Asmaulhusna',
      description: 'Teguhkan keimanan kepada Allah Swt. dan tantang penjaga gerbang Puncak Keyakinan!',
      color: 0x8b5cf6,
      position: new THREE.Vector3(0, 0, -10.5),
      ringMesh: s2BossArch.ringMesh,
      crystalMesh: s2BossArch.crystalMesh,
    });

    this.scene.add(s2Group);
    this.biomeGroups.set(2, s2Group);

    // ------------------------------------------------------------------
    // STAGE 3: DESA BUDI PEKERTI (Akhlak) - Joglo Village & Golden Sunset
    // ------------------------------------------------------------------
    const s3Group = new THREE.Group();
    s3Group.visible = false;

    const s3Ground = new THREE.Mesh(
      new THREE.PlaneGeometry(110, 110),
      new THREE.MeshStandardMaterial({ color: 0x15803d, roughness: 0.9 })
    );
    s3Ground.rotation.x = -Math.PI / 2;
    s3Ground.receiveShadow = true;
    s3Group.add(s3Ground);

    const s3Road = new THREE.Mesh(
      new THREE.BoxGeometry(4.5, 0.06, 36),
      new THREE.MeshStandardMaterial({ color: 0x78716c, roughness: 0.85 })
    );
    s3Road.position.set(0, 0.03, 0);
    s3Group.add(s3Road);

    for (let i = 0; i < 4; i++) {
      const houseGroup = new THREE.Group();
      houseGroup.position.set(i % 2 === 0 ? -12 : 12, 0, -6 + Math.floor(i / 2) * 12);

      const hBase = new THREE.Mesh(
        new THREE.BoxGeometry(6, 3.5, 6),
        new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
      );
      hBase.position.y = 1.75;
      houseGroup.add(hBase);

      const roof = new THREE.Mesh(
        new THREE.ConeGeometry(5.2, 2.5, 4),
        new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.7 })
      );
      roof.position.y = 4.75;
      roof.rotation.y = Math.PI / 4;
      houseGroup.add(roof);

      s3Group.add(houseGroup);
    }

    const s3StartArch = this.createForestArchGate('🏡 PINTU AWAL DESA BUDI PEKERTI', 'Adab Santun • Toleransi • Gotong Royong', 0xf59e0b, 0x78350f, true);
    s3StartArch.group.position.set(0, 0, 12.8);
    s3Group.add(s3StartArch.group);

    const s3BossArch = this.createForestArchGate('🏮 Pendopo Budi Pekerti', 'Ujian Kuis & Bos Desa Akhlak', 0xfbbf24, 0x78350f, false);
    s3BossArch.group.position.set(0, 0, -10.5);
    s3Group.add(s3BossArch.group);
    this.biomeGates.push({
      id: 's3-boss',
      stageId: 3,
      name: 'Pendopo Desa Budi Pekerti',
      subtitle: 'Tantangan Bos Akhlak Mulia',
      description: 'Tunjukkan akhlak terpuji, berbakti kepada orang tua dan guru, serta hidup rukun bersama sesama!',
      color: 0xf59e0b,
      position: new THREE.Vector3(0, 0, -10.5),
      ringMesh: s3BossArch.ringMesh,
      crystalMesh: s3BossArch.crystalMesh,
    });

    this.scene.add(s3Group);
    this.biomeGroups.set(3, s3Group);

    // ------------------------------------------------------------------
    // STAGE 4: SIMULASI IBADAH (Fikih) - Grand Mosque Courtyard & Minarets
    // ------------------------------------------------------------------
    const s4Group = new THREE.Group();
    s4Group.visible = false;

    const s4Ground = new THREE.Mesh(
      new THREE.PlaneGeometry(110, 110),
      new THREE.MeshStandardMaterial({ color: 0xe2e8f0, roughness: 0.3, metalness: 0.15 })
    );
    s4Ground.rotation.x = -Math.PI / 2;
    s4Ground.receiveShadow = true;
    s4Group.add(s4Ground);

    const s4Carpet = new THREE.Mesh(
      new THREE.BoxGeometry(6, 0.04, 30),
      new THREE.MeshStandardMaterial({ color: 0x059669, roughness: 0.85 })
    );
    s4Carpet.position.set(0, 0.02, 1);
    s4Group.add(s4Carpet);

    // Wudu Fountain Pools on Sides
    [-9, 9].forEach((fx) => {
      const poolRim = new THREE.Mesh(
        new THREE.CylinderGeometry(2.6, 2.8, 0.45, 8),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
      );
      poolRim.position.set(fx, 0.22, -2);
      s4Group.add(poolRim);
      const water = new THREE.Mesh(
        new THREE.CylinderGeometry(2.2, 2.2, 0.48, 8),
        new THREE.MeshStandardMaterial({ color: 0x0ea5e9, emissive: 0x0284c7, emissiveIntensity: 0.4, roughness: 0.1 })
      );
      water.position.set(fx, 0.23, -2);
      s4Group.add(water);
    });

    for (let i = 0; i < 2; i++) {
      const minaret = new THREE.Mesh(
        new THREE.CylinderGeometry(0.9, 1.3, 18, 16),
        new THREE.MeshStandardMaterial({ color: 0xf8fafc, roughness: 0.4 })
      );
      minaret.position.set(i === 0 ? -15 : 15, 9, -14);
      s4Group.add(minaret);

      const topDome = new THREE.Mesh(
        new THREE.SphereGeometry(1.3, 16, 16),
        new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.85, roughness: 0.2 })
      );
      topDome.position.set(i === 0 ? -15 : 15, 18.5, -14);
      s4Group.add(topDome);
    }

    const s4StartArch = this.createForestArchGate('🕌 PINTU AWAL SERAMBI MASJID', 'Bersuci • Salat Khusyuk • Zakat & Wakaf', 0x0ea5e9, 0xf8fafc, true);
    s4StartArch.group.position.set(0, 0, 12.8);
    s4Group.add(s4StartArch.group);

    const s4BossArch = this.createForestArchGate('✨ Mihrab Simulasi Ibadah', 'Ujian Fikih & Bos Gerbang Ibadah', 0x38bdf8, 0x0f172a, false);
    s4BossArch.group.position.set(0, 0, -10.5);
    s4Group.add(s4BossArch.group);
    this.biomeGates.push({
      id: 's4-boss',
      stageId: 4,
      name: 'Mihrab Simulasi Ibadah',
      subtitle: 'Tantangan Bos Fikih Ibadah',
      description: 'Masuki gerbang mihrab untuk membuktikan pemahaman fikih bersuci, salat, dan zakat!',
      color: 0x0ea5e9,
      position: new THREE.Vector3(0, 0, -10.5),
      ringMesh: s4BossArch.ringMesh,
      crystalMesh: s4BossArch.crystalMesh,
    });

    this.scene.add(s4Group);
    this.biomeGroups.set(4, s4Group);

    // ------------------------------------------------------------------
    // STAGE 5: LORONG WAKTU (Sejarah) - Desert Oasis & Celestial Time Rings
    // ------------------------------------------------------------------
    const s5Group = new THREE.Group();
    s5Group.visible = false;

    const s5Ground = new THREE.Mesh(
      new THREE.PlaneGeometry(110, 110),
      new THREE.MeshStandardMaterial({ color: 0xb45309, roughness: 0.92 })
    );
    s5Ground.rotation.x = -Math.PI / 2;
    s5Ground.receiveShadow = true;
    s5Group.add(s5Ground);

    const s5Path = new THREE.Mesh(
      new THREE.BoxGeometry(4, 0.06, 36),
      new THREE.MeshStandardMaterial({ color: 0x78350f, roughness: 0.8 })
    );
    s5Path.position.set(0, 0.03, 0);
    s5Group.add(s5Path);

    for (let i = 0; i < 7; i++) {
      const angle = (i / 7) * Math.PI * 2;
      const h = 8 + Math.sin(i) * 3;
      const monolith = new THREE.Mesh(
        new THREE.BoxGeometry(1.3, h, 1.3),
        new THREE.MeshStandardMaterial({
          color: 0x9f1239,
          emissive: 0x881337,
          emissiveIntensity: 0.45,
        })
      );
      monolith.position.set(Math.cos(angle) * 16, h / 2, Math.sin(angle) * 16 - 5);
      s5Group.add(monolith);
    }

    // Giant Celestial Astrolabe Rings in Sky
    for (let r = 0; r < 2; r++) {
      const astroRing = new THREE.Mesh(
        new THREE.TorusGeometry(11 - r * 2.5, 0.18, 12, 48),
        new THREE.MeshStandardMaterial({ color: 0xf472b6, emissive: 0xdb2777, emissiveIntensity: 0.8 })
      );
      astroRing.position.set(0, 11, -15);
      astroRing.rotation.x = r === 0 ? 0.35 : -0.45;
      s5Group.add(astroRing);
      this.stage5AstroRings.push(astroRing);
    }

    const s5StartArch = this.createForestArchGate('⏳ PINTU AWAL LORONG WAKTU', 'Teladan Nabi & Khulafaur Rasyidin', 0xec4899, 0x78350f, true);
    s5StartArch.group.position.set(0, 0, 12.8);
    s5Group.add(s5StartArch.group);

    const s5BossArch = this.createForestArchGate('🌟 Observatorium Sejarah', 'Ujian Tarikh & Bos Penjaga Waktu', 0xf472b6, 0x4c0519, false);
    s5BossArch.group.position.set(0, 0, -10.5);
    s5Group.add(s5BossArch.group);
    this.biomeGates.push({
      id: 's5-boss',
      stageId: 5,
      name: 'Observatorium Lorong Waktu',
      subtitle: 'Tantangan Bos Sejarah Peradaban Islam',
      description: 'Masuki pusat waktu untuk menguji pengetahuan kisah keteladanan Nabi dan Khulafaur Rasyidin!',
      color: 0xec4899,
      position: new THREE.Vector3(0, 0, -10.5),
      ringMesh: s5BossArch.ringMesh,
      crystalMesh: s5BossArch.crystalMesh,
    });

    this.scene.add(s5Group);
    this.biomeGroups.set(5, s5Group);
  }

  public enterStageBiome(stageId: number) {
    this.currentActiveStage = stageId;
    this.isTeacherSpectator = false;
    this.campusGroup.visible = false;
    this.biomeGroups.forEach((group, id) => {
      group.visible = id === stageId;
    });

    // Update Atmosphere & Lighting per Stage Map
    switch (stageId) {
      case 1:
        // Bright scenic morning nature sky
        this.scene.background = new THREE.Color(0x38bdf8);
        this.scene.fog = new THREE.FogExp2(0xbae6fd, 0.01);
        this.hemiLight.color.setHex(0xe0f2fe);
        this.hemiLight.groundColor.setHex(0x166534);
        this.hemiLight.intensity = 2.1;
        this.sunLight.color.setHex(0xfffbeb);
        this.sunLight.intensity = 2.4;
        break;
      case 2:
        this.scene.background = new THREE.Color(0x1e1b4b);
        this.scene.fog = new THREE.FogExp2(0x1e1b4b, 0.015);
        this.hemiLight.color.setHex(0xc4b5fd);
        this.hemiLight.groundColor.setHex(0x1e1b4b);
        this.hemiLight.intensity = 1.9;
        break;
      case 3:
        this.scene.background = new THREE.Color(0x7c2d12);
        this.scene.fog = new THREE.FogExp2(0x451a03, 0.014);
        this.hemiLight.color.setHex(0xfde68a);
        this.hemiLight.groundColor.setHex(0x14532d);
        this.hemiLight.intensity = 1.9;
        break;
      case 4:
        this.scene.background = new THREE.Color(0x0f172a);
        this.scene.fog = new THREE.FogExp2(0x0c4a6e, 0.014);
        this.hemiLight.color.setHex(0xe0f2fe);
        this.hemiLight.groundColor.setHex(0x334155);
        this.hemiLight.intensity = 2.0;
        break;
      case 5:
        this.scene.background = new THREE.Color(0x2e1065);
        this.scene.fog = new THREE.FogExp2(0x2e1065, 0.014);
        this.hemiLight.color.setHex(0xfbcfe8);
        this.hemiLight.groundColor.setHex(0x78350f);
        this.hemiLight.intensity = 1.9;
        break;
    }

    // Send character to Pintu Awal facing North (-Z) toward the map scenery & gates
    this.playerGroup.position.set(0, 0, 15.5);
    this.playerGroup.rotation.y = Math.PI;
    this.camera.position.set(0, 7.6, 25);
  }

  public returnToCampusLobby() {
    this.currentActiveStage = 0;
    this.campusGroup.visible = true;
    this.biomeGroups.forEach((group) => {
      group.visible = false;
    });
    this.activeNearBiomeGate = null;

    // Restore Campus Lobby sky & lighting
    this.scene.background = new THREE.Color(0x070d1d);
    this.scene.fog = new THREE.FogExp2(0x070d1d, 0.025);
    this.hemiLight.color.setHex(0xe0f2fe);
    this.hemiLight.groundColor.setHex(0x1e293b);
    this.hemiLight.intensity = 1.8;
    this.sunLight.color.setHex(0xfffbeb);
    this.sunLight.intensity = 2.2;

    this.playerGroup.position.set(0, 0, 5);
    this.playerGroup.rotation.y = 0;
    this.camera.position.set(0, 7.6, 13.5);
  }

  public setTeacherSpectatorMode(enabled: boolean, playerId: string | null = null) {
    this.isTeacherSpectator = enabled;
    this.spectatedPlayerId = playerId;
    if (enabled) {
      this.playerGroup.visible = false;
      if (playerId && this.remotePlayers.has(playerId)) {
        const target = this.remotePlayers.get(playerId)!;
        if (target.stageId === 0) this.returnToCampusLobby();
        else this.enterStageBiome(target.stageId);
        this.isTeacherSpectator = true;
      } else if (this.currentActiveStage !== 0) {
        this.returnToCampusLobby();
        this.isTeacherSpectator = true;
      }
    } else {
      this.playerGroup.visible = !this.inFlightMode;
    }
  }

  private createFaceTexture(): THREE.CanvasTexture {
    const fCanvas = document.createElement('canvas');
    fCanvas.width = 256;
    fCanvas.height = 256;
    const fCtx = fCanvas.getContext('2d');
    if (fCtx) {
      // Base skin tone
      fCtx.fillStyle = '#fbd0a8';
      fCtx.fillRect(0, 0, 256, 256);

      // Cute anime/chibi eyes (Left & Right)
      // Sclera & Dark pupil
      const drawEye = (x: number, y: number) => {
        // Shadow / contour
        fCtx.fillStyle = '#1e293b';
        fCtx.beginPath();
        fCtx.ellipse(x, y, 22, 28, 0, 0, Math.PI * 2);
        fCtx.fill();

        // Iris sparkle (deep hazel / amber)
        fCtx.fillStyle = '#475569';
        fCtx.beginPath();
        fCtx.ellipse(x, y + 6, 16, 18, 0, 0, Math.PI * 2);
        fCtx.fill();

        // Eye highlights (Cahaya binar santri)
        fCtx.fillStyle = '#ffffff';
        fCtx.beginPath();
        fCtx.arc(x - 6, y - 8, 7, 0, Math.PI * 2);
        fCtx.fill();

        fCtx.beginPath();
        fCtx.arc(x + 7, y + 8, 4, 0, Math.PI * 2);
        fCtx.fill();

        // Eyebrows
        fCtx.strokeStyle = '#334155';
        fCtx.lineWidth = 5;
        fCtx.lineCap = 'round';
        fCtx.beginPath();
        fCtx.moveTo(x - 22, y - 32);
        fCtx.quadraticCurveTo(x, y - 42, x + 22, y - 35);
        fCtx.stroke();
      };

      drawEye(85, 120);
      drawEye(171, 120);

      // Cheerful blushing cheeks
      fCtx.fillStyle = 'rgba(244, 63, 94, 0.4)';
      fCtx.beginPath();
      fCtx.ellipse(65, 155, 18, 10, 0, 0, Math.PI * 2);
      fCtx.fill();

      fCtx.beginPath();
      fCtx.ellipse(191, 155, 18, 10, 0, 0, Math.PI * 2);
      fCtx.fill();

      // Cute friendly smile
      fCtx.strokeStyle = '#881337';
      fCtx.lineWidth = 5;
      fCtx.lineCap = 'round';
      fCtx.beginPath();
      fCtx.arc(128, 162, 18, 0.15 * Math.PI, 0.85 * Math.PI, false);
      fCtx.stroke();

      // Little nose
      fCtx.fillStyle = '#e29d72';
      fCtx.beginPath();
      fCtx.arc(128, 146, 3.5, 0, Math.PI * 2);
      fCtx.fill();
    }
    const tex = new THREE.CanvasTexture(fCanvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }

  private buildPlayerCharacter() {
    this.playerGroup.position.set(0, 0, 5);

    // Torso / Body
    const bodyGeo = new THREE.CylinderGeometry(0.35, 0.38, 0.95, 14);
    const bodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.6 });
    this.playerBody = new THREE.Mesh(bodyGeo, bodyMat);
    this.playerBody.position.y = 1.05;
    this.playerBody.castShadow = true;
    this.playerGroup.add(this.playerBody);

    // School Belt with Brass Buckle
    const beltGeo = new THREE.CylinderGeometry(0.39, 0.39, 0.1, 14);
    const beltMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, roughness: 0.8 });
    const belt = new THREE.Mesh(beltGeo, beltMat);
    belt.position.y = 0.62;
    this.playerGroup.add(belt);

    const buckleGeo = new THREE.BoxGeometry(0.12, 0.08, 0.04);
    const buckleMat = new THREE.MeshStandardMaterial({ color: 0xfacc15, metalness: 0.9, roughness: 0.2 });
    const buckle = new THREE.Mesh(buckleGeo, buckleMat);
    buckle.position.set(0, 0.62, 0.39);
    this.playerGroup.add(buckle);

    // Detailed School Backpack with Zip Pockets
    const packGroup = new THREE.Group();
    packGroup.position.set(0, 1.1, -0.32);

    const packGeo = new THREE.BoxGeometry(0.46, 0.62, 0.26);
    const packMat = new THREE.MeshStandardMaterial({ color: 0x1e3a8a, roughness: 0.7 });
    const backpack = new THREE.Mesh(packGeo, packMat);
    backpack.castShadow = true;
    packGroup.add(backpack);

    const pocketGeo = new THREE.BoxGeometry(0.36, 0.28, 0.1);
    const pocketMat = new THREE.MeshStandardMaterial({ color: 0x2563eb, roughness: 0.6 });
    const pocket = new THREE.Mesh(pocketGeo, pocketMat);
    pocket.position.set(0, -0.1, -0.16);
    packGroup.add(pocket);

    // Backpack straps
    const strapGeo = new THREE.BoxGeometry(0.08, 0.55, 0.05);
    const strapMat = new THREE.MeshStandardMaterial({ color: 0x172554, roughness: 0.8 });
    const strapL = new THREE.Mesh(strapGeo, strapMat);
    strapL.position.set(-0.2, 0.02, 0.16);
    packGroup.add(strapL);
    const strapR = new THREE.Mesh(strapGeo, strapMat);
    strapR.position.set(0.2, 0.02, 0.16);
    packGroup.add(strapR);

    this.playerGroup.add(packGroup);

    // Head with Procedural Friendly Face Texture
    const headGeo = new THREE.SphereGeometry(0.33, 20, 20);
    const faceTex = this.createFaceTexture();
    const headMat = new THREE.MeshStandardMaterial({
      map: faceTex,
      roughness: 0.5,
    });
    this.playerHead = new THREE.Mesh(headGeo, headMat);
    this.playerHead.position.set(0, 1.78, 0);
    this.playerHead.rotation.y = -Math.PI / 2; // Face points forward (-Z is forward initially, adjusted by rotation)
    this.playerHead.castShadow = true;
    this.playerGroup.add(this.playerHead);

    // Cap / Peci
    const capGeo = new THREE.CylinderGeometry(0.34, 0.35, 0.22, 16);
    const capMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.4 });
    this.playerCap = new THREE.Mesh(capGeo, capMat);
    this.playerCap.position.set(0, 1.96, 0);
    this.playerCap.castShadow = true;
    this.playerGroup.add(this.playerCap);

    // Legs with White Socks & Black Shoes
    const legGeo = new THREE.CylinderGeometry(0.12, 0.13, 0.55, 10);
    const legMat = new THREE.MeshStandardMaterial({ color: 0xb91c1c, roughness: 0.6 });

    // Left Leg Group
    const legLGroup = new THREE.Group();
    legLGroup.position.set(-0.2, 0.45, 0);
    this.playerLegLeft = new THREE.Mesh(legGeo, legMat);
    this.playerLegLeft.position.y = -0.15;
    this.playerLegLeft.castShadow = true;
    legLGroup.add(this.playerLegLeft);

    // Left Sock & Shoe
    const sockGeo = new THREE.CylinderGeometry(0.122, 0.125, 0.16, 10);
    const sockMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.9 });
    const sockL = new THREE.Mesh(sockGeo, sockMat);
    sockL.position.y = -0.32;
    this.playerLegLeft.add(sockL);

    const shoeGeo = new THREE.BoxGeometry(0.18, 0.12, 0.28);
    const shoeMat = new THREE.MeshStandardMaterial({ color: 0x09090b, roughness: 0.4 });
    const shoeL = new THREE.Mesh(shoeGeo, shoeMat);
    shoeL.position.set(0, -0.42, 0.05);
    shoeL.castShadow = true;
    this.playerLegLeft.add(shoeL);

    this.playerGroup.add(legLGroup);

    // Right Leg Group
    const legRGroup = new THREE.Group();
    legRGroup.position.set(0.2, 0.45, 0);
    this.playerLegRight = new THREE.Mesh(legGeo, legMat.clone());
    this.playerLegRight.position.y = -0.15;
    this.playerLegRight.castShadow = true;
    legRGroup.add(this.playerLegRight);

    const sockR = new THREE.Mesh(sockGeo, sockMat);
    sockR.position.y = -0.32;
    this.playerLegRight.add(sockR);

    const shoeR = new THREE.Mesh(shoeGeo, shoeMat);
    shoeR.position.set(0, -0.42, 0.05);
    shoeR.castShadow = true;
    this.playerLegRight.add(shoeR);

    this.playerGroup.add(legRGroup);

    // Arms
    const armGeo = new THREE.CylinderGeometry(0.1, 0.1, 0.65, 10);
    const armMat = new THREE.MeshStandardMaterial({ color: 0xffffff, roughness: 0.5 });

    this.playerArmLeft = new THREE.Mesh(armGeo, armMat);
    this.playerArmLeft.position.set(-0.48, 1.1, 0);
    this.playerArmLeft.castShadow = true;
    this.playerGroup.add(this.playerArmLeft);

    this.playerArmRight = new THREE.Mesh(armGeo, armMat.clone());
    this.playerArmRight.position.set(0.48, 1.1, 0);
    this.playerArmRight.castShadow = true;
    this.playerGroup.add(this.playerArmRight);

    this.scene.add(this.playerGroup);
  }

  private applyCostumeToMaterials(
    costume: CostumeType,
    bodyMat: THREE.MeshStandardMaterial,
    armLMat: THREE.MeshStandardMaterial,
    armRMat: THREE.MeshStandardMaterial,
    legLMat: THREE.MeshStandardMaterial,
    legRMat: THREE.MeshStandardMaterial,
    capMat: THREE.MeshStandardMaterial,
    capMesh: THREE.Mesh
  ) {
    if (costume === 'sd') {
      bodyMat.color.setHex(0xffffff);
      armLMat.color.setHex(0xffffff);
      armRMat.color.setHex(0xffffff);
      legLMat.color.setHex(0xb91c1c);
      legRMat.color.setHex(0xb91c1c);
      capMat.color.setHex(0xb91c1c);
      capMesh.scale.set(1, 1, 1);
    } else if (costume === 'muslim') {
      bodyMat.color.setHex(0xf8fafc);
      armLMat.color.setHex(0xf8fafc);
      armRMat.color.setHex(0xf8fafc);
      legLMat.color.setHex(0x1e293b);
      legRMat.color.setHex(0x1e293b);
      capMat.color.setHex(0x0f172a);
      capMesh.scale.set(1, 0.9, 1);
    } else if (costume === 'pramuka') {
      bodyMat.color.setHex(0xd97706);
      armLMat.color.setHex(0xd97706);
      armRMat.color.setHex(0xd97706);
      legLMat.color.setHex(0x78350f);
      legRMat.color.setHex(0x78350f);
      capMat.color.setHex(0x78350f);
      capMesh.scale.set(1.05, 0.85, 1.05);
    } else if (costume === 'koko_batik') {
      bodyMat.color.setHex(0x0284c7);
      armLMat.color.setHex(0x0369a1);
      armRMat.color.setHex(0x0369a1);
      legLMat.color.setHex(0x334155);
      legRMat.color.setHex(0x334155);
      capMat.color.setHex(0x0369a1);
      capMesh.scale.set(1, 1, 1);
    } else if (costume === 'pendekar') {
      bodyMat.color.setHex(0x15803d);
      armLMat.color.setHex(0x166534);
      armRMat.color.setHex(0x166534);
      legLMat.color.setHex(0x14532d);
      legRMat.color.setHex(0x14532d);
      capMat.color.setHex(0xfacc15);
      capMesh.scale.set(1.08, 0.75, 1.08);
    } else if (costume === 'rompi_tahfidz') {
      bodyMat.color.setHex(0x9333ea);
      armLMat.color.setHex(0xf8fafc);
      armRMat.color.setHex(0xf8fafc);
      legLMat.color.setHex(0x581c87);
      legRMat.color.setHex(0x581c87);
      capMat.color.setHex(0xfacc15);
      capMesh.scale.set(1, 1.05, 1);
    } else if (costume === 'gamis_madinah') {
      bodyMat.color.setHex(0xfffbeb);
      armLMat.color.setHex(0xfffbeb);
      armRMat.color.setHex(0xfffbeb);
      legLMat.color.setHex(0x451a03);
      legRMat.color.setHex(0x451a03);
      capMat.color.setHex(0xd97706);
      capMesh.scale.set(1, 1, 1);
    }
  }

  public setCostume(costume: CostumeType) {
    this.applyCostumeToMaterials(
      costume,
      this.playerBody.material as THREE.MeshStandardMaterial,
      this.playerArmLeft.material as THREE.MeshStandardMaterial,
      this.playerArmRight.material as THREE.MeshStandardMaterial,
      this.playerLegLeft.material as THREE.MeshStandardMaterial,
      this.playerLegRight.material as THREE.MeshStandardMaterial,
      this.playerCap.material as THREE.MeshStandardMaterial,
      this.playerCap
    );
  }

  private buildNuraCompanion() {
    // Crystal Lantern Center
    const coreGeo = new THREE.OctahedronGeometry(0.24, 0);
    const coreMat = new THREE.MeshStandardMaterial({
      color: 0xfde047,
      emissive: 0xfacc15,
      emissiveIntensity: 1.2,
      metalness: 0.3,
      roughness: 0.1,
    });
    this.nuraCore = new THREE.Mesh(coreGeo, coreMat);
    this.nuraGroup.add(this.nuraCore);

    // Orbiting Golden Ring
    const ringGeo = new THREE.TorusGeometry(0.36, 0.03, 16, 32);
    const ringMat = new THREE.MeshStandardMaterial({
      color: 0xfef08a,
      emissive: 0xfacc15,
      emissiveIntensity: 0.5,
      metalness: 0.9,
    });
    this.nuraRing = new THREE.Mesh(ringGeo, ringMat);
    this.nuraGroup.add(this.nuraRing);

    // PointLight
    this.nuraLight.position.set(0, 0, 0);
    this.nuraGroup.add(this.nuraLight);

    this.nuraGroup.position.set(0.7, 1.8, 0.4);
    this.playerGroup.add(this.nuraGroup);
  }

  public evolveNura(level: number) {
    let colorHex = 0xfacc15; // Lv 1-2: Golden Amber
    if (level >= 10) colorHex = 0xffffff; // Celestial White / Rainbow
    else if (level >= 8) colorHex = 0xc084fc; // Amethyst Purple
    else if (level >= 5) colorHex = 0x38bdf8; // Sapphire Blue
    else if (level >= 3) colorHex = 0x34d399; // Emerald Green

    (this.nuraCore.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
    (this.nuraCore.material as THREE.MeshStandardMaterial).emissive.setHex(colorHex);
    (this.nuraRing.material as THREE.MeshStandardMaterial).color.setHex(colorHex);
    (this.nuraRing.material as THREE.MeshStandardMaterial).emissive.setHex(colorHex);
    this.nuraLight.color.setHex(colorHex);
  }

  public triggerNuraJoy() {
    this.nuraHappyTimer = 1.8;
  }

  // ==================== 3D FLYING AIRPLANE: RINTANGAN PEMAHAMAN ====================
  private createAnswerBoxTexture(letter: string, label: string, hexColor: string, isDisabled: boolean): THREE.CanvasTexture {
    const canvas = document.createElement('canvas');
    canvas.width = 1024;
    canvas.height = 640;
    const ctx = canvas.getContext('2d');
    if (ctx) {
      // High-contrast dark slate card with bright border
      ctx.fillStyle = isDisabled ? 'rgba(15, 23, 42, 0.55)' : 'rgba(9, 14, 30, 0.96)';
      ctx.beginPath();
      ctx.roundRect(18, 18, 988, 604, 44);
      ctx.fill();

      ctx.strokeStyle = isDisabled ? '#475569' : hexColor;
      ctx.lineWidth = 22;
      ctx.stroke();

      // Top Header Banner with Letter Badge
      ctx.fillStyle = isDisabled ? 'rgba(51, 65, 85, 0.5)' : `${hexColor}33`;
      ctx.beginPath();
      ctx.roundRect(38, 38, 948, 134, 28);
      ctx.fill();

      ctx.beginPath();
      ctx.arc(120, 105, 52, 0, Math.PI * 2);
      ctx.fillStyle = isDisabled ? '#475569' : hexColor;
      ctx.fill();

      ctx.fillStyle = isDisabled ? '#cbd5e1' : '#020617';
      ctx.font = '900 66px Arial, sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(letter, 120, 109);

      ctx.fillStyle = isDisabled ? '#94a3b8' : hexColor;
      ctx.font = '800 38px Arial, sans-serif';
      ctx.textAlign = 'left';
      ctx.fillText(isDisabled ? 'DIELIMINASI (50:50)' : `PILIHAN ${letter}`, 196, 108);

      // Full Crisp Wrapped Answer Text (options appear exclusively on these 3D boxes!)
      const cleaned = isDisabled ? 'Kotak jawaban ini telah dieliminasi oleh Firasat Tajwid.' : label;
      const fontSize = cleaned.length > 68 ? 38 : cleaned.length > 42 ? 44 : 50;
      const lineHeight = Math.round(fontSize * 1.32);
      ctx.fillStyle = isDisabled ? '#64748b' : '#ffffff';
      ctx.font = `700 ${fontSize}px Arial, sans-serif`;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      const maxWidth = 880;
      const words = cleaned.split(/\s+/);
      const lines: string[] = [];
      let current = '';

      for (const word of words) {
        const candidate = current ? `${current} ${word}` : word;
        if (ctx.measureText(candidate).width > maxWidth && current) {
          lines.push(current);
          current = word;
        } else {
          current = candidate;
        }
      }
      if (current) lines.push(current);

      const visibleLines = lines.slice(0, 4);
      if (lines.length > 4) {
        visibleLines[3] = visibleLines[3].slice(0, Math.max(8, visibleLines[3].length - 3)) + '...';
      }

      const blockHeight = visibleLines.length * lineHeight;
      const startY = 390 - blockHeight / 2 + lineHeight / 2;
      visibleLines.forEach((ln, idx) => {
        ctx.fillText(ln, 512, startY + idx * lineHeight);
      });
    }
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    tex.anisotropy = this.maxAnisotropy;
    return tex;
  }

  private buildFlightChallengeArena() {
    this.flightGroup = new THREE.Group();
    this.flightGroup.visible = false;

    // 1. Build 3D Pesawat Cahaya Ilmu (Detailed Composite Airplane)
    this.airplaneGroup = new THREE.Group();
    this.airplaneGroup.position.set(0, 4.2, 0);

    // Fuselage
    const bodyMat = new THREE.MeshStandardMaterial({
      color: 0xf8fafc,
      metalness: 0.35,
      roughness: 0.25,
    });
    const fuselage = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.42, 2.5, 16), bodyMat);
    fuselage.rotation.x = Math.PI / 2;
    fuselage.castShadow = true;
    this.airplaneGroup.add(fuselage);

    // Nose cone (Golden Amber)
    const accentMat = new THREE.MeshStandardMaterial({
      color: 0xf59e0b,
      emissive: 0xd97706,
      emissiveIntensity: 0.35,
      metalness: 0.5,
      roughness: 0.25,
    });
    const nose = new THREE.Mesh(new THREE.ConeGeometry(0.32, 0.72, 16), accentMat);
    nose.rotation.x = -Math.PI / 2;
    nose.position.z = -1.6;
    this.airplaneGroup.add(nose);

    // Tail Cone
    const tailCone = new THREE.Mesh(new THREE.ConeGeometry(0.42, 0.9, 16), bodyMat);
    tailCone.rotation.x = Math.PI / 2;
    tailCone.position.z = 1.65;
    this.airplaneGroup.add(tailCone);

    // Glass Cockpit Canopy
    const canopyMat = new THREE.MeshStandardMaterial({
      color: 0x38bdf8,
      emissive: 0x0284c7,
      emissiveIntensity: 0.5,
      roughness: 0.1,
      metalness: 0.85,
      transparent: true,
      opacity: 0.85,
    });
    const canopy = new THREE.Mesh(new THREE.SphereGeometry(0.32, 16, 12, 0, Math.PI * 2, 0, Math.PI / 2), canopyMat);
    canopy.scale.set(0.95, 0.85, 1.8);
    canopy.position.set(0, 0.25, -0.25);
    this.airplaneGroup.add(canopy);

    // Swept Main Wings
    const wingMat = new THREE.MeshStandardMaterial({
      color: 0x0ea5e9,
      metalness: 0.35,
      roughness: 0.3,
    });
    const mainWing = new THREE.Mesh(new THREE.BoxGeometry(3.5, 0.09, 0.82), wingMat);
    mainWing.position.set(0, 0.02, -0.1);
    mainWing.castShadow = true;
    this.airplaneGroup.add(mainWing);

    // Golden Wing Stripes & Wingtip Beacons
    [-1.4, 1.4].forEach((wx) => {
      const stripe = new THREE.Mesh(new THREE.BoxGeometry(0.35, 0.11, 0.84), accentMat);
      stripe.position.set(wx, 0.02, -0.1);
      this.airplaneGroup.add(stripe);

      const beacon = new THREE.Mesh(
        new THREE.SphereGeometry(0.11, 10, 10),
        new THREE.MeshBasicMaterial({ color: wx < 0 ? 0xf43f5e : 0x10b981 })
      );
      beacon.position.set(wx < 0 ? -1.78 : 1.78, 0.02, -0.1);
      this.airplaneGroup.add(beacon);
    });

    // Vertical Tail Fin & Horizontal Stabilizer
    const tailFin = new THREE.Mesh(new THREE.BoxGeometry(0.1, 0.85, 0.65), accentMat);
    tailFin.position.set(0, 0.45, 1.45);
    this.airplaneGroup.add(tailFin);

    const hStab = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.07, 0.42), wingMat);
    hStab.position.set(0, 0.18, 1.5);
    this.airplaneGroup.add(hStab);

    // Spinning Front Propeller
    this.airplanePropeller = new THREE.Group();
    this.airplanePropeller.position.set(0, 0, -1.96);
    const bladeMat = new THREE.MeshStandardMaterial({ color: 0x0f172a, metalness: 0.7, roughness: 0.3 });
    const blade1 = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.11, 0.03), bladeMat);
    const blade2 = new THREE.Mesh(new THREE.BoxGeometry(0.11, 1.1, 0.03), bladeMat);
    const hub = new THREE.Mesh(new THREE.SphereGeometry(0.1, 10, 10), accentMat);
    this.airplanePropeller.add(blade1, blade2, hub);
    this.airplaneGroup.add(this.airplanePropeller);

    // Engine Exhaust Glow Behind Tail
    const exhaust = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 1.35, 12),
      new THREE.MeshBasicMaterial({ color: 0xfacc15, transparent: true, opacity: 0.8 })
    );
    exhaust.rotation.x = Math.PI / 2;
    exhaust.position.set(0, 0, 2.45);
    this.flightExhaust = exhaust;
    this.airplaneGroup.add(exhaust);

    // Dual Wingtip Contrail Ribbons for dynamic swooping visual read
    this.flightContrails = [];
    [-1.75, 1.75].forEach((tx) => {
      const contrail = new THREE.Mesh(
        new THREE.PlaneGeometry(0.14, 3.6),
        new THREE.MeshBasicMaterial({
          color: 0xe0f2fe,
          transparent: true,
          opacity: 0.45,
          side: THREE.DoubleSide,
          depthWrite: false,
        })
      );
      contrail.rotation.x = -Math.PI / 2;
      contrail.position.set(tx, 0.02, 1.75);
      this.airplaneGroup.add(contrail);
      this.flightContrails.push(contrail);
    });

    // Airplane Glow Light
    this.airplaneLight = new THREE.PointLight(0x38bdf8, 3.0, 14);
    this.airplaneLight.position.set(0, 1.2, 0.5);
    this.airplaneGroup.add(this.airplaneLight);

    this.flightGroup.add(this.airplaneGroup);

    // 2. Build 4 Large, Crisp Floating 3D Answer Boxes (A, B, C, D)
    const letters = ['A', 'B', 'C', 'D'];
    const boxColors = [0x10b981, 0x38bdf8, 0xf59e0b, 0xec4899];
    const hexStrings = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899'];

    this.answerBoxes = letters.map((letter, idx) => {
      const group = new THREE.Group();
      group.position.set(this.flightLanePositions[idx], 4.6, -30);

      // Glowing outer crystal box
      const boxMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.05, 2.05, 1.1),
        new THREE.MeshStandardMaterial({
          color: boxColors[idx],
          emissive: boxColors[idx],
          emissiveIntensity: 0.35,
          transparent: true,
          opacity: 0.28,
          roughness: 0.2,
          metalness: 0.35,
        })
      );
      group.add(boxMesh);

      // Glowing Border Frame
      const frameMesh = new THREE.Mesh(
        new THREE.BoxGeometry(3.16, 2.16, 1.18),
        new THREE.MeshBasicMaterial({
          color: boxColors[idx],
          wireframe: true,
          transparent: true,
          opacity: 0.85,
        })
      );
      group.add(frameMesh);

      // High-Res Front Answer Plate Texture (1024x640)
      const labelTex = this.createAnswerBoxTexture(letter, `Pilihan ${letter}`, hexStrings[idx], false);
      const labelMesh = new THREE.Mesh(
        new THREE.PlaneGeometry(2.96, 1.88),
        new THREE.MeshBasicMaterial({ map: labelTex, transparent: true })
      );
      labelMesh.position.set(0, 0, 0.62);
      group.add(labelMesh);

      this.flightGroup.add(group);

      return {
        laneIndex: idx,
        letter,
        group,
        boxMesh,
        frameMesh,
        labelMesh,
        baseColor: boxColors[idx],
      };
    });

    // 3. Sky Corridor Guide Lanes (4 translucent glowing flight rails)
    this.flightLanePositions.forEach((lx, idx) => {
      const rail = new THREE.Mesh(
        new THREE.PlaneGeometry(0.14, 72),
        new THREE.MeshBasicMaterial({
          color: boxColors[idx],
          transparent: true,
          opacity: 0.25,
          side: THREE.DoubleSide,
        })
      );
      rail.rotation.x = -Math.PI / 2;
      rail.position.set(lx, 2.5, -30);
      this.flightGroup.add(rail);
    });

    // 4. Streaming Clouds Along Flight Corridor
    this.flightClouds = [];
    for (let i = 0; i < 18; i++) {
      const cl = this.createCloudCluster(0.75 + Math.random() * 0.7);
      const side = i % 2 === 0 ? -1 : 1;
      cl.position.set(
        side * (8.5 + Math.random() * 14),
        1.5 + Math.random() * 10,
        -Math.random() * 75
      );
      this.flightGroup.add(cl);
      this.flightClouds.push(cl);
    }

    // 5. Speed Stars / Light Streaks in Sky
    const starCount = 160;
    const starPositions = new Float32Array(starCount * 3);
    for (let i = 0; i < starCount; i++) {
      starPositions[i * 3 + 0] = (Math.random() - 0.5) * 44;
      starPositions[i * 3 + 1] = 1.5 + Math.random() * 16;
      starPositions[i * 3 + 2] = -Math.random() * 78 + 8;
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute('position', new THREE.BufferAttribute(starPositions, 3));
    const starMat = new THREE.PointsMaterial({
      color: 0xfef08a,
      size: 0.24,
      map: this.glowTexture,
      transparent: true,
      opacity: 0.8,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    this.flightStars = new THREE.Points(starGeo, starMat);
    this.flightGroup.add(this.flightStars);

    this.scene.add(this.flightGroup);
  }

  public enterFlightChallenge(stageId: number) {
    this.inFlightMode = true;
    this.flightStageId = stageId;
    this.flightPaused = true;
    this.flightBoosted = false;
    this.flightAnswerTriggered = false;
    this.flightDisabledLanes.clear();
    this.airplaneCurrentX = this.flightLanePositions[1];
    this.airplaneTargetX = this.flightLanePositions[1];
    this.airplaneBankAngle = 0;
    this.airplaneYawAngle = 0;
    this.airplanePitchAngle = 0;
    this.flightActiveLane = 1;
    this.airplaneGroup.position.set(this.airplaneCurrentX, 4.1, 0.6);
    this.airplaneGroup.rotation.set(0, 0, 0);

    // Hide walking meshes & show flight sky arena
    this.campusGroup.visible = false;
    this.biomeGroups.forEach((g) => (g.visible = false));
    this.playerGroup.visible = false;
    this.remotePlayers.forEach((rp) => (rp.group.visible = false));
    this.flightGroup.visible = true;

    // Set vibrant sky atmosphere per stage
    const skyColors: Record<number, { bg: number; fog: number }> = {
      1: { bg: 0x0284c7, fog: 0x38bdf8 },
      2: { bg: 0x312e81, fog: 0x4f46e5 },
      3: { bg: 0x0f766e, fog: 0x14b8a6 },
      4: { bg: 0x0c4a6e, fog: 0x0ea5e9 },
      5: { bg: 0x4c1d95, fog: 0x7c3aed },
    };
    const palette = skyColors[stageId] || skyColors[1];
    this.scene.background = new THREE.Color(palette.bg);
    this.scene.fog = new THREE.FogExp2(palette.fog, 0.0085);
    this.hemiLight.intensity = 2.2;
    this.sunLight.intensity = 2.4;

    // Frame optical center in the middle of the upper 80% sky viewport (above 20% bottom question panel)
    const w = Math.max(1, window.innerWidth);
    const h = Math.max(1, window.innerHeight);
    this.camera.setViewOffset(w, h, 0, Math.round(h * 0.1), w, h);
    this.camera.position.set(0, 6.2, 8.8);
    this.camera.lookAt(0, 4.3, -14);
  }

  public startFlightQuestion(durationSec: number, optionLabels: string[], disabledIndices: number[] = []) {
    this.flightDuration = Math.max(8, durationSec);
    this.flightElapsed = 0;
    this.flightPaused = false;
    this.flightBoosted = false;
    this.flightAnswerTriggered = false;
    this.flightDisabledLanes = new Set(disabledIndices);

    this.updateFlightBoxTextures(optionLabels);
    this.answerBoxes.forEach((b, idx) => {
      b.group.position.set(this.flightLanePositions[idx], 4.8, -30);
      b.group.scale.setScalar(1);
    });
  }

  public updateFlightBoxTextures(optionLabels: string[], disabledIndices?: number[]) {
    if (disabledIndices) {
      this.flightDisabledLanes = new Set(disabledIndices);
    }
    const hexStrings = ['#10b981', '#38bdf8', '#f59e0b', '#ec4899'];
    this.answerBoxes.forEach((b, idx) => {
      const isDisabled = this.flightDisabledLanes.has(idx);
      const labelMat = b.labelMesh.material as THREE.MeshBasicMaterial;
      labelMat.map?.dispose();
      labelMat.map = this.createAnswerBoxTexture(
        b.letter,
        optionLabels[idx] || `Pilihan ${b.letter}`,
        hexStrings[idx],
        isDisabled
      );
      labelMat.opacity = isDisabled ? 0.35 : 1.0;
      labelMat.needsUpdate = true;

      const boxMat = b.boxMesh.material as THREE.MeshStandardMaterial;
      boxMat.opacity = isDisabled ? 0.08 : 0.28;
    });
  }

  public pauseFlightChallenge(paused: boolean) {
    this.flightPaused = paused;
  }

  public steerAirplaneByAxis(axisX: number, delta: number) {
    if (!this.inFlightMode || this.flightPaused) return;
    this.airplaneTargetX += axisX * delta * 12.5;
    this.airplaneTargetX = Math.max(-5.6, Math.min(5.6, this.airplaneTargetX));
  }

  public steerAirplaneToNormalizedX(normX: number) {
    if (!this.inFlightMode || this.flightPaused) return;
    const clamped = Math.max(-1, Math.min(1, normX * 1.18));
    this.airplaneTargetX = clamped * 5.45;
  }

  public selectAirplaneLane(laneIndex: number) {
    if (!this.inFlightMode) return;
    const idx = Math.max(0, Math.min(3, laneIndex));
    this.airplaneTargetX = this.flightLanePositions[idx];
  }

  public boostAirplaneToAnswer() {
    if (!this.inFlightMode || this.flightPaused || this.flightAnswerTriggered) return;
    this.flightBoosted = true;
  }

  public triggerFlightFeedback(correct: boolean) {
    const pos = this.airplaneGroup.position.clone();
    pos.z -= 1.2;
    if (correct) {
      this.flightRollTimer = 0.75;
      this.createImpactBurst(pos, 0x10b981);
      this.createImpactBurst(pos, 0xfacc15);
    } else {
      this.flightShakeTimer = 0.55;
      this.createImpactBurst(pos, 0xf43f5e);
    }
  }

  public exitFlightChallenge() {
    this.inFlightMode = false;
    this.flightPaused = true;
    this.flightGroup.visible = false;
    this.playerGroup.visible = !this.isTeacherSpectator;
    this.camera.clearViewOffset();
    this.camera.updateProjectionMatrix();

    if (this.currentActiveStage > 0) {
      this.enterStageBiome(this.currentActiveStage);
    } else {
      this.returnToCampusLobby();
    }
  }

  public createImpactBurst(pos: THREE.Vector3, color: number = 0xfacc15) {
    const pCount = 50;
    const positions = new Float32Array(pCount * 3);
    const velocities: THREE.Vector3[] = [];

    for (let i = 0; i < pCount; i++) {
      positions[i * 3 + 0] = pos.x;
      positions[i * 3 + 1] = pos.y;
      positions[i * 3 + 2] = pos.z;

      const v = new THREE.Vector3(
        (Math.random() - 0.5) * 6,
        Math.random() * 5 + 1.2,
        (Math.random() - 0.5) * 6
      );
      velocities.push(v);
    }

    const geo = new THREE.BufferGeometry();
    geo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    const mat = new THREE.PointsMaterial({
      color,
      size: 0.28,
      map: this.glowTexture,
      transparent: true,
      opacity: 1.0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });

    const points = new THREE.Points(geo, mat);
    this.scene.add(points);

    this.activeImpactBursts.push({
      points,
      positions,
      velocities,
      life: 0.6,
      maxLife: 0.6,
    });
  }

  public update(delta: number, moveVector: THREE.Vector2, isRunning: boolean) {
    if (!this.isInitialized || !this.renderer) return;
    const time = performance.now() * 0.003;

    // 1. UPDATE 3D AIRPLANE "RINTANGAN PEMAHAMAN" MODE VS ROAMING MODE
    if (this.inFlightMode) {
      // Spin propeller continuously & pulse exhaust flame
      this.airplanePropeller.rotation.z += delta * (this.flightBoosted ? 48 : 30);
      if (this.flightExhaust) {
        const flameScale = (this.flightBoosted ? 1.55 : 1.0) + Math.sin(time * 24) * 0.16;
        this.flightExhaust.scale.set(1, flameScale, 1);
      }
      this.flightContrails.forEach((ct, i) => {
        const mat = ct.material as THREE.MeshBasicMaterial;
        mat.opacity = 0.28 + Math.sin(time * 5 + i) * 0.14 + (this.flightBoosted ? 0.22 : 0);
      });

      // Stream clouds & sky stars toward camera
      const speedMult = this.flightBoosted ? 3.8 : 1.15;
      this.flightClouds.forEach((cl) => {
        cl.position.z += delta * 15 * speedMult;
        if (cl.position.z > 14) {
          cl.position.z = -72;
        }
      });
      if (this.flightStars) {
        const sPos = this.flightStars.geometry.attributes.position.array as Float32Array;
        for (let i = 0; i < sPos.length; i += 3) {
          sPos[i + 2] += delta * 26 * speedMult;
          if (sPos[i + 2] > 12) {
            sPos[i + 2] = -76;
          }
        }
        this.flightStars.geometry.attributes.position.needsUpdate = true;
      }

      // Keyboard steering from horizontal moveVector
      if (!this.flightPaused && Math.abs(moveVector.x) > 0.05) {
        this.steerAirplaneByAxis(moveVector.x, delta);
      }

      // Smooth damped airplane swooping & weaving kinematics ("melintas, meliuk mencari jawaban")
      const prevX = this.airplaneCurrentX;
      this.airplaneCurrentX = THREE.MathUtils.damp(this.airplaneCurrentX, this.airplaneTargetX, 7.5, delta);
      const lateralVel = (this.airplaneCurrentX - prevX) / Math.max(0.001, delta);

      // Natural organic sky-weaving oscillation + expressive wing bank, nose yaw & climb/dive pitch
      const weaveX = Math.sin(time * 1.45) * 0.24;
      const weaveY = Math.sin(time * 2.15) * 0.34 + Math.cos(time * 1.1) * 0.14;
      const desiredBank = THREE.MathUtils.clamp(-lateralVel * 0.085 - Math.cos(time * 1.45) * 0.14, -0.68, 0.68);
      const desiredYaw = THREE.MathUtils.clamp(-lateralVel * 0.032, -0.26, 0.26);
      const desiredPitch = THREE.MathUtils.clamp(Math.cos(time * 2.15) * 0.12 + (this.flightBoosted ? 0.08 : 0), -0.22, 0.22);

      this.airplaneBankAngle = THREE.MathUtils.damp(this.airplaneBankAngle, desiredBank, 9, delta);
      this.airplaneYawAngle = THREE.MathUtils.damp(this.airplaneYawAngle, desiredYaw, 8, delta);
      this.airplanePitchAngle = THREE.MathUtils.damp(this.airplanePitchAngle, desiredPitch, 8, delta);

      let extraRoll = 0;
      if (this.flightRollTimer > 0) {
        this.flightRollTimer = Math.max(0, this.flightRollTimer - delta);
        const t = 1 - this.flightRollTimer / 0.75;
        extraRoll = t * Math.PI * 2;
      }

      let shakeX = 0;
      let shakeY = 0;
      if (this.flightShakeTimer > 0) {
        this.flightShakeTimer = Math.max(0, this.flightShakeTimer - delta);
        shakeX = (Math.random() - 0.5) * 0.35;
        shakeY = (Math.random() - 0.5) * 0.25;
      }

      const hoverY = 4.15 + weaveY + shakeY;
      this.airplaneGroup.position.set(this.airplaneCurrentX + weaveX + shakeX, hoverY, 0.6);
      this.airplaneGroup.rotation.set(
        this.airplanePitchAngle,
        this.airplaneYawAngle,
        this.airplaneBankAngle + extraRoll
      );

      // Determine nearest lane (0..3)
      let nearestLane = 0;
      let nearestDist = Infinity;
      for (let i = 0; i < this.flightLanePositions.length; i++) {
        const d = Math.abs(this.airplaneCurrentX - this.flightLanePositions[i]);
        if (d < nearestDist) {
          nearestDist = d;
          nearestLane = i;
        }
      }
      if (nearestLane !== this.flightActiveLane) {
        this.flightActiveLane = nearestLane;
        this.onFlightLaneChange?.(nearestLane);
      }

      // Advance approaching 4 3D answer boxes synchronized to question duration
      if (!this.flightPaused && !this.flightAnswerTriggered) {
        if (this.flightBoosted) {
          this.flightElapsed += Math.max(delta * 18, (this.flightDuration - this.flightElapsed) * delta * 8 + delta * 10);
        } else {
          this.flightElapsed += delta;
        }

        const progress = Math.max(0, Math.min(1, this.flightElapsed / this.flightDuration));
        const remainingSec = Math.max(0, this.flightDuration - this.flightElapsed);
        this.onFlightTimerTick?.(remainingSec, progress);

        const boxZ = -30 + progress * 30.6; // Approaches cleanly from z=-30 to z=0.6 (readable from second 1!)
        this.answerBoxes.forEach((b, idx) => {
          b.group.position.set(
            this.flightLanePositions[idx],
            4.8 + Math.sin(time * 2 + idx) * 0.18,
            boxZ
          );
          const isAligned = idx === this.flightActiveLane && !this.flightDisabledLanes.has(idx);
          const targetScale = isAligned ? 1.16 : 0.96;
          _tmpScaleVec.set(targetScale, targetScale, targetScale);
          b.group.scale.lerp(_tmpScaleVec, Math.min(1, delta * 10));
          const bMat = b.boxMesh.material as THREE.MeshStandardMaterial;
          if (!this.flightDisabledLanes.has(idx)) {
            bMat.emissiveIntensity = isAligned ? 1.05 : 0.3;
          }
        });

        if (progress >= 1.0) {
          this.flightAnswerTriggered = true;
          this.flightPaused = true;
          this.onFlightAnswerReached?.(this.flightActiveLane);
        }
      }

      // Dynamic behind-plane chase camera keeping 3D airplane & all 4 answer boxes centered in upper 80% sky zone
      const targetCamX = this.airplaneCurrentX * 0.36;
      const targetCamY = 6.15 + Math.sin(time * 1.2) * 0.12;
      const targetCamZ = 8.9;
      this.camera.position.x = THREE.MathUtils.damp(this.camera.position.x, targetCamX, 6, delta);
      this.camera.position.y = THREE.MathUtils.damp(this.camera.position.y, targetCamY, 6, delta);
      this.camera.position.z = THREE.MathUtils.damp(this.camera.position.z, targetCamZ, 6, delta);
      this.camera.lookAt(this.airplaneCurrentX * 0.28, 4.35, -14);
    } else {
      // Normal Campus / Stage Map Movement & Raised Panoramic Follow Camera
      const isMoving = moveVector.lengthSq() > 0.001;

      if (isMoving) {
        const speed = isRunning ? 8.2 : 5.0;
        this.playerGroup.position.x += moveVector.x * speed * delta;
        this.playerGroup.position.z += moveVector.y * speed * delta;

        if (this.currentActiveStage > 0) {
          this.playerGroup.position.x = Math.max(-26, Math.min(26, this.playerGroup.position.x));
          this.playerGroup.position.z = Math.max(-19, Math.min(19, this.playerGroup.position.z));
        } else {
          this.playerGroup.position.x = Math.max(-25, Math.min(25, this.playerGroup.position.x));
          this.playerGroup.position.z = Math.max(-14, Math.min(18, this.playerGroup.position.z));
        }

        const angle = Math.atan2(moveVector.x, moveVector.y);
        this.playerGroup.rotation.y = angle;

        this.walkCycleTime += delta * (isRunning ? 14 : 9);
        const legAngle = Math.sin(this.walkCycleTime) * 0.55;
        this.playerLegLeft.rotation.x = legAngle;
        this.playerLegRight.rotation.x = -legAngle;
        this.playerArmLeft.rotation.x = -legAngle;
        this.playerArmRight.rotation.x = legAngle;
        this.playerBody.position.y = 1.05 + Math.abs(Math.sin(this.walkCycleTime * 2)) * 0.06;
      } else {
        this.playerLegLeft.rotation.x *= 0.85;
        this.playerLegRight.rotation.x *= 0.85;
        this.playerArmLeft.rotation.x *= 0.85;
        this.playerArmRight.rotation.x *= 0.85;
        this.playerBody.position.y = 1.05;
      }

      if (!this.isTeacherSpectator) {
        const targetCamX = this.playerGroup.position.x;
        const targetCamZ = this.playerGroup.position.z + 9.4;
        const targetCamY = 6.9;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.08;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.08;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.08;
        this.camera.lookAt(
          this.playerGroup.position.x,
          this.playerGroup.position.y + 1.4,
          this.playerGroup.position.z - 0.8
        );
      }
    }

    // 2. UPDATE IMPACT BURSTS
    for (let i = this.activeImpactBursts.length - 1; i >= 0; i--) {
      const burst = this.activeImpactBursts[i];
      burst.life -= delta;

      if (burst.life <= 0) {
        burst.points.removeFromParent();
        this.activeImpactBursts.splice(i, 1);
      } else {
        const pPositions = burst.positions;
        const count = burst.velocities.length;
        const factor = burst.life / burst.maxLife;

        for (let j = 0; j < count; j++) {
          const v = burst.velocities[j];
          v.y -= delta * 9.8;
          pPositions[j * 3 + 0] += v.x * delta;
          pPositions[j * 3 + 1] += v.y * delta;
          pPositions[j * 3 + 2] += v.z * delta;
        }
        (burst.points.material as THREE.PointsMaterial).opacity = factor;
        (burst.points.material as THREE.PointsMaterial).size = 0.28 * factor;
        burst.points.geometry.attributes.position.needsUpdate = true;
      }
    }

    // 3. NURA COMPANION BOBBING
    const nuraY = 1.8 + Math.sin(time * 2.5) * 0.15;
    this.nuraGroup.position.y = nuraY;
    this.nuraRing.rotation.x += delta * 2;
    this.nuraRing.rotation.y += delta * 1.5;

    if (this.nuraHappyTimer > 0) {
      this.nuraHappyTimer -= delta;
      this.nuraCore.rotation.y += delta * 15;
      this.nuraLight.intensity = 4.5;
    } else {
      this.nuraCore.rotation.y += delta * 1.2;
      this.nuraLight.intensity = 2.5;
    }

    // 4. ANIMATE FLAG WAVING
    if (this.animFlag) {
      const pos = (this.animFlag.geometry as THREE.BufferGeometry).attributes.position;
      for (let i = 0; i < pos.count; i++) {
        const u = pos.getX(i);
        const wave = Math.sin(time * 6 + u * 3) * 0.12 * (u + 1.1);
        pos.setZ(i, wave);
      }
      pos.needsUpdate = true;
    }

    // 5. ANIMATE PORTAL CRYSTALS & 'CAHAYA ILMU' PARTICLES WITH PROXIMITY INTENSIFICATION
    this.portals.forEach((p, idx) => {
      const dist = this.playerGroup.position.distanceTo(p.position);
      const prox = Math.max(0, Math.min(1, (8.5 - dist) / 6.5));

      const spinSpeed = 0.8 + prox * 2.2;
      p.ringMesh.rotation.z += delta * (idx % 2 === 0 ? spinSpeed : -spinSpeed);
      p.crystalMesh.rotation.y += delta * (1.2 + prox * 2.0);
      p.crystalMesh.position.y = 2.2 + Math.sin(time * 2 + idx) * 0.12;

      p.portalLight.intensity = 2.0 + prox * 4.0;
      p.portalLight.distance = 5 + prox * 4.5;

      p.particleMat.opacity = 0.35 + prox * 0.63;
      p.particleMat.size = 0.22 + prox * 0.26;

      const positions = p.particleGeo.attributes.position.array as Float32Array;
      const count = p.particleAngles.length;
      const upwardSpeedMultiplier = 1.0 + prox * 2.5;

      for (let i = 0; i < count; i++) {
        p.particleAngles[i] += delta * p.particleSpeeds[i] * upwardSpeedMultiplier;
        const rad = p.particleRadii[i] * (1.0 + prox * 0.2);

        let y = positions[i * 3 + 1] + delta * p.particleSpeeds[i] * 0.9 * upwardSpeedMultiplier;
        if (y > 4.2) y = 0.2;
        positions[i * 3 + 1] = y;
        positions[i * 3 + 0] = Math.cos(p.particleAngles[i]) * rad;
        positions[i * 3 + 2] = Math.sin(p.particleAngles[i]) * rad;
      }
      p.particleGeo.attributes.position.needsUpdate = true;
    });

    // 6. ANIMATE REAL-TIME MULTIPLAYER REMOTE PLAYERS
    this.remotePlayers.forEach((rp) => {
      rp.group.visible = !this.inFlightMode && rp.stageId === this.currentActiveStage;
      if (!rp.group.visible) return;

      rp.group.position.lerp(rp.targetPos, Math.min(1, delta * 10));
      let angleDiff = rp.targetRotY - rp.group.rotation.y;
      while (angleDiff > Math.PI) angleDiff -= Math.PI * 2;
      while (angleDiff < -Math.PI) angleDiff += Math.PI * 2;
      rp.group.rotation.y += angleDiff * Math.min(1, delta * 10);

      // Keep nameplate facing camera
      rp.nameplateMesh.lookAt(this.camera.position);

      if (rp.isMoving) {
        rp.walkPhase += delta * 10;
        const swing = Math.sin(rp.walkPhase) * 0.5;
        rp.legLeft.rotation.x = swing;
        rp.legRight.rotation.x = -swing;
        rp.armLeft.rotation.x = -swing;
        rp.armRight.rotation.x = swing;
      } else {
        rp.legLeft.rotation.x *= 0.85;
        rp.legRight.rotation.x *= 0.85;
        rp.armLeft.rotation.x *= 0.85;
        rp.armRight.rotation.x *= 0.85;
      }
    });

    // 7. ANIMATE STAGE BIOME SCENERY
    if (this.currentActiveStage === 1 && !this.inFlightMode) {
      this.natureClouds.forEach((cl, idx) => {
        cl.position.x += delta * (0.35 + idx * 0.08);
        if (cl.position.x > 34) cl.position.x = -34;
      });
      this.waterfallStreams.forEach((wf, idx) => {
        const mat = wf.material as THREE.MeshStandardMaterial;
        mat.emissiveIntensity = 0.5 + Math.sin(time * 5 + idx * 1.5) * 0.25;
      });
      if (this.stage1Fireflies) {
        this.stage1Fireflies.rotation.y += delta * 0.06;
      }
    } else if (this.currentActiveStage === 5 && !this.inFlightMode) {
      this.stage5AstroRings.forEach((ring, idx) => {
        ring.rotation.z += delta * (idx === 0 ? 0.3 : -0.45);
      });
    }

    this.biomeGates.forEach((gate, idx) => {
      if (gate.stageId !== this.currentActiveStage) return;
      if (gate.ringMesh) gate.ringMesh.rotation.z += delta * (idx % 2 === 0 ? 1.1 : -1.1);
      if (gate.crystalMesh) {
        gate.crystalMesh.rotation.y += delta * 1.5;
        gate.crystalMesh.position.y = 2.3 + Math.sin(time * 2 + idx) * 0.14;
      }
    });

    // 8. TEACHER SPECTATOR CAMERA (Follows real online students)
    if (this.isTeacherSpectator && !this.inFlightMode) {
      const targetStudent =
        (this.spectatedPlayerId && this.remotePlayers.get(this.spectatedPlayerId)) ||
        Array.from(this.remotePlayers.values())[0] ||
        null;

      if (targetStudent) {
        if (targetStudent.stageId !== this.currentActiveStage) {
          if (targetStudent.stageId === 0) this.returnToCampusLobby();
          else this.enterStageBiome(targetStudent.stageId);
          this.isTeacherSpectator = true;
          this.playerGroup.visible = false;
        }
        const targetCamX = targetStudent.group.position.x;
        const targetCamZ = targetStudent.group.position.z + 6.8;
        const targetCamY = 5.4;

        this.camera.position.x += (targetCamX - this.camera.position.x) * 0.1;
        this.camera.position.z += (targetCamZ - this.camera.position.z) * 0.1;
        this.camera.position.y += (targetCamY - this.camera.position.y) * 0.1;
        this.camera.lookAt(
          targetStudent.group.position.x,
          targetStudent.group.position.y + 1.3,
          targetStudent.group.position.z
        );
      } else {
        // Gentle orbital panoramic overview of the campus when waiting for students to join
        const orbitAngle = time * 0.18;
        this.camera.position.x += (Math.sin(orbitAngle) * 14 - this.camera.position.x) * 0.04;
        this.camera.position.z += (Math.cos(orbitAngle) * 14 + 2 - this.camera.position.z) * 0.04;
        this.camera.position.y += (8.5 - this.camera.position.y) * 0.04;
        this.camera.lookAt(0, 1.5, -2);
      }
    }

    // 9. PROXIMITY CHECKS (Portals, Real Remote Players, Biome Gates)
    if (!this.inFlightMode && !this.isTeacherSpectator) {
      // Check proximity to real online remote players in the same stage (radius 2.8)
      let closestPeer: RemotePlayerAvatar | null = null;
      let closestPeerDistSq = 2.8 * 2.8;
      this.remotePlayers.forEach((rp) => {
        if (rp.stageId !== this.currentActiveStage) return;
        const distSq = this.playerGroup.position.distanceToSquared(rp.group.position);
        if (distSq < closestPeerDistSq) {
          closestPeerDistSq = distSq;
          closestPeer = rp;
        }
      });
      this.activeNearRemotePlayer = closestPeer;

      if (this.currentActiveStage === 0) {
        this.activeNearBiomeGate = null;

        let closestPortal: PortalData | null = null;
        let closestDistSq = 2.4 * 2.4;

        for (const p of this.portals) {
          const distSq = this.playerGroup.position.distanceToSquared(p.position);
          if (distSq < closestDistSq) {
            closestDistSq = distSq;
            closestPortal = p;
          }
        }
        this.activeNearPortal = closestPortal;
      } else {
        this.activeNearPortal = null;

        let closestGate: BiomeGateNode | null = null;
        let closestGateDistSq = 2.8 * 2.8;
        for (const gate of this.biomeGates) {
          if (gate.stageId !== this.currentActiveStage) continue;
          const distSq = this.playerGroup.position.distanceToSquared(gate.position);
          if (distSq < closestGateDistSq) {
            closestGateDistSq = distSq;
            closestGate = gate;
          }
        }
        this.activeNearBiomeGate = closestGate;
      }
    } else {
      this.activeNearPortal = null;
      this.activeNearRemotePlayer = null;
      this.activeNearBiomeGate = null;
    }

    this.renderer.render(this.scene, this.camera);
  }
}
