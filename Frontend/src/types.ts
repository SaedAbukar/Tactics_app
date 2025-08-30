export type Player = { id: number; x: number; y: number; color: string };
export type Ball = { id: number; x: number; y: number };
export type Step = { players: Player[]; balls: Ball[] };
export type DragItem = { type: "player" | "ball"; id: number } | null;
