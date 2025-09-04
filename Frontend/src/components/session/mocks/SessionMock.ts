import type { Player, Session, Team } from "../../../types/types";
import { formations } from "../../formation_selector/formation";

export const sessions: Session[] = [
  // Original 10 drills
  {
    id: 1,
    name: "Basic Passing Drill",
    description: "A simple drill to practice short passes between two players.",
    steps: [
      {
        players: [
          { id: 1, number: 1, x: 100, y: 400, color: "blue" },
          { id: 2, number: 2, x: 200, y: 400, color: "blue" },
        ],
        balls: [{ id: 1, x: 150, y: 400, color: "white" }],
        goals: [],
        cones: [],
        teams: [{ id: 1, name: "Blue", color: "blue" }],
      },
      {
        players: [
          { id: 1, number: 1, x: 120, y: 380, color: "blue" },
          { id: 2, number: 2, x: 220, y: 420, color: "blue" },
        ],
        balls: [{ id: 1, x: 170, y: 400, color: "white" }],
        goals: [],
        cones: [],
        teams: [{ id: 1, name: "Blue", color: "blue" }],
      },
      {
        players: [
          { id: 1, number: 1, x: 140, y: 360, color: "blue" },
          { id: 2, number: 2, x: 240, y: 440, color: "blue" },
        ],
        balls: [{ id: 1, x: 190, y: 400, color: "white" }],
        goals: [],
        cones: [],
        teams: [{ id: 1, name: "Blue", color: "blue" }],
      },
    ],
  },
  {
    id: 2,
    name: "Shooting Drill",
    description:
      "Player shoots the ball towards the goal from different angles.",
    steps: [
      {
        players: [{ id: 1, number: 1, x: 100, y: 300, color: "red" }],
        balls: [{ id: 1, x: 120, y: 300, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 2, name: "Red", color: "red" }],
      },
      {
        players: [{ id: 1, number: 1, x: 150, y: 280, color: "red" }],
        balls: [{ id: 1, x: 180, y: 290, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 2, name: "Red", color: "red" }],
      },
      {
        players: [{ id: 1, number: 1, x: 200, y: 260, color: "red" }],
        balls: [{ id: 1, x: 220, y: 270, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 2, name: "Red", color: "red" }],
      },
    ],
  },
  {
    id: 3,
    name: "Dribbling Practice",
    description: "Players practice dribbling around cones.",
    steps: [
      {
        players: [{ id: 1, number: 1, x: 150, y: 400, color: "yellow" }],
        balls: [{ id: 1, x: 160, y: 400, color: "white" }],
        goals: [],
        cones: [
          { id: 1, x: 200, y: 380, color: "orange" },
          { id: 2, x: 220, y: 420, color: "orange" },
        ],
        teams: [{ id: 3, name: "Yellow", color: "yellow" }],
      },
      {
        players: [{ id: 1, number: 1, x: 170, y: 380, color: "yellow" }],
        balls: [{ id: 1, x: 180, y: 380, color: "white" }],
        goals: [],
        cones: [
          { id: 1, x: 200, y: 380, color: "orange" },
          { id: 2, x: 220, y: 420, color: "orange" },
        ],
        teams: [{ id: 3, name: "Yellow", color: "yellow" }],
      },
      {
        players: [{ id: 1, number: 1, x: 190, y: 360, color: "yellow" }],
        balls: [{ id: 1, x: 200, y: 360, color: "white" }],
        goals: [],
        cones: [
          { id: 1, x: 200, y: 380, color: "orange" },
          { id: 2, x: 220, y: 420, color: "orange" },
        ],
        teams: [{ id: 3, name: "Yellow", color: "yellow" }],
      },
    ],
  },
  {
    id: 4,
    name: "Crossing Drill",
    description: "Practice crosses from the wing to forwards.",
    steps: [
      {
        players: [
          { id: 1, number: 7, x: 100, y: 200, color: "blue" },
          { id: 2, number: 9, x: 400, y: 300, color: "blue" },
        ],
        balls: [{ id: 1, x: 120, y: 200, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 1, name: "Blue", color: "blue" }],
      },
    ],
  },
  {
    id: 5,
    name: "Defensive Positioning",
    description: "Players practice maintaining defensive shape.",
    steps: [
      {
        players: [
          { id: 1, number: 2, x: 200, y: 400, color: "red" },
          { id: 2, number: 3, x: 300, y: 400, color: "red" },
          { id: 3, number: 4, x: 400, y: 400, color: "red" },
        ],
        balls: [],
        goals: [],
        cones: [],
        teams: [{ id: 2, name: "Red", color: "red" }],
      },
    ],
  },
  {
    id: 6,
    name: "Counter Attack Drill",
    description: "Simulate fast counter attack scenarios.",
    steps: [
      {
        players: [
          { id: 1, number: 10, x: 100, y: 500, color: "blue" },
          { id: 2, number: 9, x: 200, y: 450, color: "blue" },
        ],
        balls: [{ id: 1, x: 150, y: 480, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 1, name: "Blue", color: "blue" }],
      },
    ],
  },
  {
    id: 7,
    name: "Set Piece Drill",
    description: "Practice free kicks and corners.",
    steps: [
      {
        players: [
          { id: 1, number: 11, x: 100, y: 300, color: "green" },
          { id: 2, number: 8, x: 150, y: 280, color: "green" },
        ],
        balls: [{ id: 1, x: 120, y: 290, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 4, name: "Green", color: "green" }],
      },
    ],
  },
  {
    id: 8,
    name: "Wing Play Drill",
    description: "Focus on crossing and movement on the wings.",
    steps: [
      {
        players: [
          { id: 1, number: 7, x: 120, y: 250, color: "blue" },
          { id: 2, number: 11, x: 180, y: 240, color: "blue" },
        ],
        balls: [{ id: 1, x: 150, y: 245, color: "white" }],
        goals: [],
        cones: [],
        teams: [{ id: 1, name: "Blue", color: "blue" }],
      },
    ],
  },
  {
    id: 9,
    name: "One-Two Passing Drill",
    description: "Players practice quick one-two passing combinations.",
    steps: [
      {
        players: [
          { id: 1, number: 6, x: 100, y: 400, color: "yellow" },
          { id: 2, number: 8, x: 200, y: 400, color: "yellow" },
        ],
        balls: [{ id: 1, x: 150, y: 400, color: "white" }],
        goals: [],
        cones: [],
        teams: [{ id: 3, name: "Yellow", color: "yellow" }],
      },
    ],
  },
  {
    id: 10,
    name: "Attacking Combination",
    description:
      "Simulate multiple players attacking the goal with combinations.",
    steps: [
      {
        players: [
          { id: 1, number: 9, x: 100, y: 350, color: "red" },
          { id: 2, number: 10, x: 150, y: 340, color: "red" },
          { id: 3, number: 11, x: 200, y: 330, color: "red" },
        ],
        balls: [{ id: 1, x: 120, y: 345, color: "white" }],
        goals: [
          { id: 1, x: 600, y: 350, width: 70, depth: 30, color: "white" },
        ],
        cones: [],
        teams: [{ id: 2, name: "Red", color: "red" }],
      },
    ],
  },
  // Tactic Sessions
  {
    id: 11,
    name: "4-4-2 Formation",
    description: "Full 4-4-2 setup with two lines of midfield.",
    steps: [
      {
        players: [
          { id: 1, number: 1, x: 50, y: 90, color: "yellow" },
          { id: 2, number: 2, x: 20, y: 70, color: "blue" },
          { id: 3, number: 3, x: 35, y: 70, color: "blue" },
          { id: 4, number: 4, x: 65, y: 70, color: "blue" },
          { id: 5, number: 5, x: 80, y: 70, color: "blue" },
          { id: 6, number: 6, x: 25, y: 50, color: "red" },
          { id: 7, number: 7, x: 40, y: 50, color: "red" },
          { id: 8, number: 8, x: 60, y: 50, color: "red" },
          { id: 9, number: 9, x: 75, y: 50, color: "red" },
          { id: 10, number: 10, x: 40, y: 30, color: "green" },
          { id: 11, number: 11, x: 60, y: 30, color: "green" },
        ],
        balls: [{ id: 1, x: 50, y: 50 }],
        goals: [],
        cones: [],
        teams: [
          { id: 1, name: "Blue Team", color: "blue" },
          { id: 2, name: "Red Team", color: "red" },
        ],
      },
    ],
  },
  {
    id: 12,
    name: "Corner Tactics",
    description: "Attacking and defensive corner setups.",
    steps: [
      {
        players: [
          { id: 1, number: 1, x: 50, y: 90, color: "yellow" },
          { id: 2, number: 2, x: 30, y: 80, color: "blue" },
          { id: 3, number: 3, x: 70, y: 80, color: "blue" },
        ],
        balls: [{ id: 1, x: 80, y: 90 }],
        goals: [{ id: 1, x: 50, y: 0, width: 100, depth: 40, color: "white" }],
        cones: [],
        teams: [
          { id: 1, name: "Blue Team", color: "blue" },
          { id: 2, name: "Red Team", color: "red" },
        ],
      },
    ],
  },
  {
    id: 13,
    name: "High Press Drill",
    description: "Two teams practicing high pressing with multiple movements.",
    steps: [
      {
        players: [
          { id: 1, number: 1, x: 20, y: 70, color: "blue" },
          { id: 2, number: 2, x: 35, y: 70, color: "blue" },
          { id: 3, number: 3, x: 50, y: 70, color: "blue" },
          { id: 4, number: 4, x: 65, y: 70, color: "blue" },
          { id: 5, number: 5, x: 20, y: 50, color: "red" },
          { id: 6, number: 6, x: 35, y: 50, color: "red" },
          { id: 7, number: 7, x: 50, y: 50, color: "red" },
          { id: 8, number: 8, x: 65, y: 50, color: "red" },
        ],
        balls: [{ id: 1, x: 50, y: 60 }],
        goals: [],
        cones: [],
        teams: [
          { id: 1, name: "Blue Team", color: "blue" },
          { id: 2, name: "Red Team", color: "red" },
        ],
      },
      {
        players: [
          { id: 1, number: 1, x: 25, y: 65, color: "blue" },
          { id: 2, number: 2, x: 40, y: 65, color: "blue" },
          { id: 3, number: 3, x: 55, y: 65, color: "blue" },
          { id: 4, number: 4, x: 70, y: 65, color: "blue" },
          { id: 5, number: 5, x: 25, y: 45, color: "red" },
          { id: 6, number: 6, x: 40, y: 45, color: "red" },
          { id: 7, number: 7, x: 55, y: 45, color: "red" },
          { id: 8, number: 8, x: 70, y: 45, color: "red" },
        ],
        balls: [{ id: 1, x: 50, y: 55 }],
        goals: [],
        cones: [],
        teams: [
          { id: 1, name: "Blue Team", color: "blue" },
          { id: 2, name: "Red Team", color: "red" },
        ],
      },
    ],
  },
  {
    id: 14,
    name: "Compact Team Press",
    description:
      "Blue Team (4-4-2) and Red Team (4-3-3) practicing coordinated pressing.",
    steps: generateCompactPressSteps(),
  },
];

// Helper function to generate pressing steps
function generateCompactPressSteps(): {
  players: Player[];
  balls: { id: number; x: number; y: number }[];
  goals: {
    id: number;
    x: number;
    y: number;
    width: number;
    depth: number;
    color: string;
  }[];
  cones: { id: number; x: number; y: number; color: string }[];
  teams: Team[];
}[] {
  const blueFormation = formations.find((f) => f.name === "4-4-2")!;
  const redFormation = formations.find((f) => f.name === "4-3-3")!;

  const steps = [];

  for (let stepIndex = 0; stepIndex < 5; stepIndex++) {
    const players: Player[] = [];

    // Blue Team press forward
    blueFormation.teams[0].positions.forEach((pos, idx) => {
      const xShift = (idx % 2 === 0 ? -0.03 : 0.03) * stepIndex;
      const yShift = -0.04 * stepIndex;
      players.push({
        id: idx + 1,
        number: idx + 1,
        x: (pos.x + xShift) * 100,
        y: (pos.y + yShift) * 100,
        color: "blue",
        teamId: 1,
      });
    });

    // Red Team press forward
    redFormation.teams[0].positions.forEach((pos, idx) => {
      const xShift = (idx % 2 === 0 ? -0.02 : 0.02) * stepIndex;
      const yShift = -0.03 * stepIndex;
      players.push({
        id: idx + 11,
        number: idx + 1,
        x: (pos.x + xShift) * 100,
        y: (pos.y + yShift) * 100,
        color: "red",
        teamId: 2,
      });
    });

    const balls = [
      { id: 1, x: 50 + stepIndex * 3, y: 50 - stepIndex * 2, color: "white" },
    ];

    steps.push({
      players,
      balls,
      goals: [], // Correct type: Goal[]
      cones: [], // Correct type: Cone[]
      teams: [
        { id: 1, name: "Blue Team", color: "blue" },
        { id: 2, name: "Red Team", color: "red" },
      ],
    });
  }

  return steps;
}
