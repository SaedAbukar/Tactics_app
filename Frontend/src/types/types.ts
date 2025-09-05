export type User = {
  id: string; // Unique user ID
  email: string; // User email
  password: string; // Plain password (for mock/demo purposes)
  role: "user" | "admin"; // User role
  sessions: Session[]; // Sessions the user has access to
  practices: Practice[]; // Practices assigned to the user
  tactics: GameTactic[]; // Game tactics assigned to the user
};

export type Player = {
  id: number;
  number: number;
  x: number;
  y: number;
  color: string;
  team?: Team;
};

export type Ball = {
  id: number;
  x: number;
  y: number;
  color?: string;
};

export type Goal = {
  id: number;
  x: number;
  y: number;
  width: number;
  depth: number;
  color?: string;
};

export type Cone = {
  id: number;
  x: number;
  y: number;
  color?: string;
};

export type Team = {
  id: number;
  name: string;
  color: string;
};

export type DragItem = {
  type: "player" | "ball" | "goal" | "cone";
  id: number;
};

export type Position = { x: number; y: number }; // x,y as percentages (0–1)

export type TeamFormation = {
  team: Team;
  positions: Position[];
};

export type Formation = {
  name: string;
  teams: TeamFormation[];
};

export type EntityType = "player" | "ball" | "goal" | "cone";

export type Step = {
  players: Player[];
  balls: Ball[];
  goals: Goal[];
  cones: Cone[];
  teams: Team[];
};

export type Session = {
  id: number;
  name: string;
  description: string;
  steps: Step[];
};

export type Practice = {
  id: number;
  name: string;
  description: string;
  sessions: Session[];
};

export type GameTactic = {
  id: number;
  name: string;
  description: string;
  sessions: Session[];
};
