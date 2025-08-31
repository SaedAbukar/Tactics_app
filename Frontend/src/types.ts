export type Player = {
  id: number;
  x: number;
  y: number;
  color: string;
  teamId?: number;
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

export type EntityType = "player" | "ball" | "goal" | "cone";

export type Step = {
  players: Player[];
  balls: Ball[];
  goals: Goal[];
  cones: Cone[];
  teams: Team[];
};
