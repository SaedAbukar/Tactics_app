import { makeAutoObservable, runInAction } from "mobx";
import type {
  Player,
  Ball,
  Goal,
  Cone,
  Team,
  Step,
  DragItem,
  EntityType,
} from "../../../types/types";

let lastTime = 0;
let counter = 0;
function generateId(): number {
  const now = Date.now();
  if (now === lastTime) counter++;
  else counter = 0;
  lastTime = now;
  return now * 1000 + counter;
}

export class TacticalBoardViewModel {
  // --- State ---
  players: Player[] = [];
  balls: Ball[] = [];
  goals: Goal[] = [];
  cones: Cone[] = [];
  teams: Team[] = [];

  savedSteps: Step[] = [];
  currentStepIndex: number | null = null;
  activeSessionId: number | null = null;

  // Animation State
  isPlaying = false;
  isPaused = false;
  speed = 1;

  // Dragging State (kept in VM to coordinate with Pitch)
  dragItem: DragItem | null = null;

  // Private animation refs
  private animFrameId: number | null = null;
  private stepIndex = 0;
  private startTime = 0;
  private elapsedBeforePause = 0;
  private playerNumber = 1;

  constructor() {
    makeAutoObservable(this, {}, { autoBind: true });
  }

  // --- Actions: Session Management ---

  setActiveSessionId(id: number | null) {
    runInAction(() => {
      this.activeSessionId = id;
    });
  }

  // --- Actions: Adding Entities ---

  addEntity(type: EntityType, count: number = 1, color?: string, team?: Team) {
    if (type === "player") {
      const newPlayers: Player[] = Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        number: this.playerNumber++,
        x: 50 + this.players.length * 50 + i * 20,
        y: 100 + this.players.length * 30 + i * 10,
        color: team?.color || color || "white",
        teamName: team?.name,
      }));
      this.players.push(...newPlayers);
    } else if (type === "ball") {
      const newBalls = Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        x: 100 + this.balls.length * 50 + i * 20,
        y: 200,
        color: color || "white",
      }));
      this.balls.push(...newBalls);
    } else if (type === "goal") {
      const newGoals = Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        x: 50 + this.goals.length * 60 + i * 10,
        y: 350,
        width: 70,
        depth: 30,
        color: color || "white",
      }));
      this.goals.push(...newGoals);
    } else if (type === "cone") {
      const newCones = Array.from({ length: count }, (_, i) => ({
        id: generateId(),
        x: 50 + this.cones.length * 40 + i * 10,
        y: 100 + this.cones.length * 20 + i * 5,
        color: color || "orange",
      }));
      this.cones.push(...newCones);
    }
  }

  addTeam(name: string, color: string) {
    this.teams.push({ id: generateId(), name, color });
  }

  // --- Actions: Dragging ---

  startDrag(item: DragItem) {
    this.dragItem = item;
  }

  moveDrag(x: number, y: number) {
    if (!this.dragItem) return;

    const { type, id } = this.dragItem;

    // We update directly. MobX handles the reactivity.
    if (type === "player") {
      const p = this.players.find((i) => i.id === id);
      if (p) {
        p.x = x;
        p.y = y;
      }
    } else if (type === "ball") {
      const b = this.balls.find((i) => i.id === id);
      if (b) {
        b.x = x;
        b.y = y;
      }
    } else if (type === "cone") {
      const c = this.cones.find((i) => i.id === id);
      if (c) {
        c.x = x;
        c.y = y;
      }
    } else if (type === "goal") {
      const g = this.goals.find((i) => i.id === id);
      if (g) {
        g.x = x - g.width / 2;
        g.y = y - g.depth / 2;
      }
    }
  }

  stopDrag() {
    this.dragItem = null;
  }

  // --- Actions: Steps & Animation ---

  saveStep() {
    // Deep copy current state
    const newStep: Step = {
      players: JSON.parse(JSON.stringify(this.players)),
      balls: JSON.parse(JSON.stringify(this.balls)),
      goals: JSON.parse(JSON.stringify(this.goals)),
      cones: JSON.parse(JSON.stringify(this.cones)),
      teams: JSON.parse(JSON.stringify(this.teams)),
      formations: [], // Add formation logic if needed
    };

    if (this.currentStepIndex !== null) {
      this.savedSteps[this.currentStepIndex] = newStep;
    } else {
      this.savedSteps.push(newStep);
    }
    this.currentStepIndex = null;
  }

  loadStep(index: number) {
    const step = this.savedSteps[index];
    if (!step) return;

    this.currentStepIndex = index;
    // Deep copy back to active state
    this.players = JSON.parse(JSON.stringify(step.players));
    this.balls = JSON.parse(JSON.stringify(step.balls));
    this.goals = JSON.parse(JSON.stringify(step.goals));
    this.cones = JSON.parse(JSON.stringify(step.cones));
  }

  updateSavedSteps(steps: Step[]) {
    runInAction(() => {
      this.savedSteps = steps;
    });
  }

  clearPitch() {
    this.stopAnimation();
    this.players = [];
    this.balls = [];
    this.goals = [];
    this.cones = [];
    this.savedSteps = [];
    this.currentStepIndex = null;
  }

  // --- Animation Loop ---

  play() {
    if (this.savedSteps.length === 0) return;
    this.isPlaying = true;
    this.isPaused = false;
    this.stepIndex = 0;
    this.startTime = 0;
    this.elapsedBeforePause = 0;
    this.animFrameId = requestAnimationFrame(this.animateFrame);
  }

  pause() {
    if (!this.isPlaying || this.isPaused) return;
    this.isPaused = true;
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.elapsedBeforePause += performance.now() - this.startTime;
  }

  continue() {
    if (!this.isPlaying || !this.isPaused) return;
    this.isPaused = false;
    this.startTime = performance.now();
    this.animFrameId = requestAnimationFrame(this.animateFrame);
  }

  stopAnimation() {
    if (this.animFrameId) cancelAnimationFrame(this.animFrameId);
    this.isPlaying = false;
    this.isPaused = false;
    this.stepIndex = 0;
    this.startTime = 0;
    this.elapsedBeforePause = 0;

    // Reset to first step
    if (this.savedSteps.length > 0) {
      this.loadStep(0);
    }
    this.currentStepIndex = null;
  }

  setSpeed(val: number) {
    this.speed = val;
  }

  private animateFrame = (timestamp: number) => {
    if (!this.isPlaying || this.isPaused) return;

    if (!this.startTime) this.startTime = timestamp;

    const stepDuration = 1500 / this.speed;
    const elapsed = timestamp - this.startTime + this.elapsedBeforePause;
    const t = Math.min(elapsed / stepDuration, 1);

    const currentStep = this.savedSteps[this.stepIndex];
    const nextStep = this.savedSteps[this.stepIndex + 1] ?? currentStep;

    // Linear Interpolation helper
    const lerp = (start: number, end: number) => start + (end - start) * t;

    // Batch updates to avoid React trashing
    runInAction(() => {
      // Interpolate Players
      this.players = currentStep.players.map((p, i) => {
        const nextP = nextStep.players[i] || p;
        return { ...p, x: lerp(p.x, nextP.x), y: lerp(p.y, nextP.y) };
      });

      // Interpolate Balls
      this.balls = currentStep.balls.map((b, i) => {
        const nextB = nextStep.balls[i] || b;
        return { ...b, x: lerp(b.x, nextB.x), y: lerp(b.y, nextB.y) };
      });

      // (Repeat for cones/goals if they move, usually they don't, but here is the logic)
    });

    if (t < 1) {
      this.animFrameId = requestAnimationFrame(this.animateFrame);
    } else {
      // Step finished
      if (this.stepIndex + 1 < this.savedSteps.length) {
        this.stepIndex++;
        this.startTime = 0;
        this.elapsedBeforePause = 0;
        this.animFrameId = requestAnimationFrame(this.animateFrame);
      } else {
        this.stopAnimation();
      }
    }
  };
}
