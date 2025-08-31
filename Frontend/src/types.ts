export type Player = {
  id: number;
  x: number;
  y: number;
  color: string;
  teamId: number | undefined;
};
export type Ball = { id: number; x: number; y: number };
export type Step = { players: Player[]; balls: Ball[]; goals: Goal[] };
export type Goal = {
  id: number;
  x: number;
  y: number;
  width: number;
  depth: number;
};
export type Team = {
  id: number;
  name: string;
  color: string;
};

export type EntityType = "player" | "ball" | "goal";
export type DragItem = {
  type: EntityType;
  id?: number;
};
