// ------------------------------
// Core Types
// ------------------------------

export type EntityType = "player" | "ball" | "goal" | "cone";

export type DragItem = {
  type: EntityType;
  id: number;
};

export type Position = { x: number; y: number }; // x,y as percentages (0–1)

export const ShareRole = {
  OWNER: "OWNER",
  VIEWER: "VIEWER",
  EDITOR: "EDITOR",
} as const;

export type ShareRole = (typeof ShareRole)[keyof typeof ShareRole];

// ------------------------------
// Player / Ball / Goal / Cone / Team
// ------------------------------

export type Player = {
  id: number;
  number: number;
  x: number;
  y: number;
  color: string;
  teamName?: string;
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

// ------------------------------
// Formations
// ------------------------------

export type FormationPosition = {
  x: number;
  y: number;
  teamName?: string;
  teamColor?: string;
};

export type Formation = {
  id?: number;
  name: string;
  positions: FormationPosition[];
};

// ------------------------------
// Step
// ------------------------------

export type Step = {
  players: Player[];
  balls: Ball[];
  goals: Goal[];
  cones: Cone[];
  teams: Team[];
  formations: Formation[];
};

// ------------------------------
// Entities
// ------------------------------

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
  isPremade?: boolean;
  sessions: Session[];
};

export type GameTactic = {
  id: number;
  name: string;
  description: string;
  isPremade?: boolean;
  sessions: Session[];
};

// ------------------------------
// Auth / Users
// ------------------------------

export type AuthUser = {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  name?: string;
  groups?: any[];
  createdAt?: string;
  lastLogin?: string;
};

export type JwtPayload = {
  exp: number;
  [key: string]: any;
};

// ------------------------------
// Frontend State (ViewModel)
// ------------------------------

export type ItemsState<T> = {
  personal: T[];
  userShared: T[];
  groupShared: T[];
};

// ------------------------------
// API Responses (Backend Contract)
// ------------------------------

// Corresponds to the shape returned by your backend endpoints
export interface CategorizedItems<T> {
  personalItems: T[];
  userSharedItems: T[];
  groupSharedItems: T[];
}

export interface AllUserData {
  sessions: CategorizedItems<Session>;
  practices: CategorizedItems<Practice>;
  tactics: CategorizedItems<GameTactic>;
}
