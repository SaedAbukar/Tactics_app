import type { GameTactic } from "../../../types/types";

// Game tactics referencing only the tactic sessions (IDs 101+)
export const gameTactics: GameTactic[] = [
  {
    id: 201,
    name: "Game 1",
    description: "Game 1 tactic",
    sessionIds: [11, 12, 13], // Full Formation Session
  },
  {
    id: 202,
    name: "Game 2",
    description: "Game 2 tactic",
    sessionIds: [12, 14], // Corner Session
  },
  {
    id: 203,
    name: "Game 3",
    description: "Game 3 tactic",
    sessionIds: [13, 12], // High Press Drill
  },
];
