// ------------------------------
// Core Types
// ------------------------------

export type EntityType = "player" | "ball" | "goal" | "cone";

export type DragItem = {
  type: EntityType;
  id: number;
};

// Backend sends integer coordinates, Frontend might convert to %
export type Position = { x: number; y: number };

export const ShareRole = {
  OWNER: "OWNER",
  VIEWER: "VIEWER",
  EDITOR: "EDITOR",
  NONE: "NONE", // Helpful to have on frontend
} as const;

export type ShareRole = (typeof ShareRole)[keyof typeof ShareRole];

// ------------------------------
// Inner Entities (Steps, Players, etc.)
// ------------------------------

export type Player = {
  id: number;
  number: number;
  x: number;
  y: number;
  color: string;
  teamName?: string;
  teamId?: number; // Backend sends team ID often
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

export type FormationPosition = {
  id?: number;
  x: number;
  y: number;
  teamName?: string;
  teamColor?: string;
  teamId?: number;
};

export type Formation = {
  id: number;
  name: string;
  positions: FormationPosition[];
};

export type Step = {
  players: Player[];
  balls: Ball[];
  goals: Goal[];
  cones: Cone[];
  teams: Team[];
  formations: Formation[];
};

// ------------------------------
// 1. SESSION TYPES
// ------------------------------

// Light: Used in "My Sessions" / Tabs
export type SessionSummary = {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  stepCount: number;
  role: ShareRole; // <--- Critical: Used for UI permissions (Show Edit/Delete?)
};

// Heavy: Used in the Tactic Board (Canvas)
export type SessionDetail = {
  id: number;
  name: string;
  description: string;
  ownerId: number;
  role: ShareRole;
  steps: Step[]; // <--- Contains the heavy data
};

// Request: Supports Linking (id only) or Creating (name required)
export type SessionRequest = {
  id?: number; // Present if linking existing
  name?: string; // Required if creating new
  description?: string;
  steps?: Partial<Step>[]; // Simplify typing for request construction
};

// ------------------------------
// 2. PRACTICE TYPES
// ------------------------------

// Light: Used in Tabs
export type PracticeSummary = {
  id: number;
  name: string;
  description: string;
  isPremade: boolean;
  ownerId: number;
  sessions: SessionSummary[]; // <--- UPDATED: Holds list of summaries now
  role: ShareRole;
};

// Heavy: Used in Detail View
export type PracticeDetail = {
  id: number;
  name: string;
  description: string;
  isPremade: boolean;
  ownerId: number;
  role: ShareRole;
  sessions: SessionDetail[]; // Contains full sessions (with steps)
};

// ------------------------------
// 3. GAME TACTIC TYPES
// ------------------------------

// Light: Used in Tabs
export type GameTacticSummary = {
  id: number;
  name: string;
  description: string;
  isPremade: boolean;
  ownerId: number;
  sessions: SessionSummary[]; // <--- UPDATED: Holds list of summaries now
  role: ShareRole;
};

// Heavy: Used in Detail View
export type GameTacticDetail = {
  id: number;
  name: string;
  description: string;
  isPremade: boolean;
  ownerId: number;
  role: ShareRole;
  sessions: SessionDetail[]; // Contains full sessions (with steps)
};

// ------------------------------
// API Responses (Backend Contract)
// ------------------------------

// Generic Wrapper for the Tabbed View
export interface TabbedResponse<T> {
  personalItems: T[];
  userSharedItems: T[];
  groupSharedItems: T[];
}

// The "All Data" blob if you fetch everything at once (Optional)
export interface AllUserData {
  sessions: TabbedResponse<SessionSummary>;
  practices: TabbedResponse<PracticeSummary>;
  tactics: TabbedResponse<GameTacticSummary>;
}

// ------------------------------
// Auth / Users
// ------------------------------

export type AuthUser = {
  id: number;
  email: string;
  role: "USER" | "ADMIN";
  isPublic: boolean;
  name?: string;
  groups?: any[];
  createdAt?: string;
  lastLogin?: string;
};

export type JwtPayload = {
  exp: number;
  [key: string]: any;
};

export interface User {
  id: number;
  email: string;
  isPublic: boolean;
}

export interface UserProfileResponse {
  id: number;
  email: string;
  isPublic: boolean;
  message?: string;
}

export interface PublicUserResponse {
  id: number;
  email: string;
  isPublic: boolean;
}

export interface UserSlice {
  content: PublicUserResponse[];
  last: boolean;
  totalElements?: number;
  totalPages?: number;
  size?: number;
  number?: number;
}

// ------------------------------
// Sharing & Collaboration
// ------------------------------

export type CollaboratorType = "USER" | "GROUP";

export interface CollaboratorDTO {
  id: number;
  name: string;
  type: CollaboratorType;
  role: ShareRole;
}

export type ShareRequest = {
  targetId: number; // userId or groupId
  role: ShareRole;
};

export type ItemsState<T> = {
  personal: T[];
  userShared: T[];
  groupShared: T[];
};
