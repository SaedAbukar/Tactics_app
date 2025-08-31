import type { Formation } from "./types";

export const formations: Formation[] = [
  {
    name: "4-4-2",
    teams: [
      {
        teamId: 1,
        positions: [
          { x: 0.5, y: 0.9 }, // Goalkeeper
          { x: 0.25, y: 0.7 }, // Left back
          { x: 0.375, y: 0.7 }, // Center back
          { x: 0.625, y: 0.7 }, // Center back
          { x: 0.75, y: 0.7 }, // Right back
          { x: 0.25, y: 0.5 }, // Left mid
          { x: 0.375, y: 0.5 }, // Center mid
          { x: 0.625, y: 0.5 }, // Center mid
          { x: 0.75, y: 0.5 }, // Right mid
          { x: 0.4, y: 0.2 }, // Forward
          { x: 0.6, y: 0.2 }, // Forward
        ],
      },
    ],
  },
];
