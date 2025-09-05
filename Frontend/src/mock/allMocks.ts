import type {
  Practice,
  Session,
  GameTactic,
  Player,
  Ball,
  Goal,
  Cone,
  Team,
} from "../types/types";

// ------------------ Sessions ------------------
export const sessions: Session[] = [
  // --- Drill Sessions ---
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

  // --- Tactic Sessions ---
  {
    id: 11,
    name: "4-4-2 Formation",
    description: "Full 4-4-2 setup with two lines of midfield.",
    steps: generateTacticSteps("4-4-2"),
  },
  {
    id: 12,
    name: "Corner Tactics",
    description: "Attacking and defensive corner setups.",
    steps: generateTacticSteps("corner"),
  },
  {
    id: 13,
    name: "High Press Drill",
    description: "Two teams practicing high pressing with multiple movements.",
    steps: generateTacticSteps("highPress"),
  },
  {
    id: 14,
    name: "Compact Team Press",
    description:
      "Blue Team (4-4-2) and Red Team (4-3-3) practicing coordinated pressing.",
    steps: generateTacticSteps("compactPress"),
  },
];

// ------------------ Practices ------------------
export const practices: Practice[] = [
  {
    id: 1,
    name: "Warm-up Drills",
    description: "Light jogging and stretching.",
    sessions: sessions.filter((s) => [1].includes(s.id)),
  },
  {
    id: 2,
    name: "Passing Drills",
    description: "Short and long passing exercises.",
    sessions: sessions.filter((s) => [1, 9].includes(s.id)),
  },
  {
    id: 3,
    name: "Shooting Drills",
    description: "Finishing and accuracy practice.",
    sessions: sessions.filter((s) => [2, 10].includes(s.id)),
  },
  {
    id: 4,
    name: "Dribbling",
    description: "1v1 dribbling challenges.",
    sessions: sessions.filter((s) => [3].includes(s.id)),
  },
  {
    id: 5,
    name: "Defensive Shape",
    description: "Team defensive positioning.",
    sessions: sessions.filter((s) => [5].includes(s.id)),
  },
  {
    id: 6,
    name: "Attacking Shape",
    description: "Offensive team patterns.",
    sessions: sessions.filter((s) => [4, 8].includes(s.id)),
  },
  {
    id: 7,
    name: "Transition Game",
    description: "Switching from defense to attack.",
    sessions: sessions.filter((s) => [6].includes(s.id)),
  },
  {
    id: 8,
    name: "Set Pieces",
    description: "Corners, free kicks, and throw-ins.",
    sessions: sessions.filter((s) => [7].includes(s.id)),
  },
  {
    id: 9,
    name: "Wing Play",
    description: "Crossing and wing movements.",
    sessions: sessions.filter((s) => [8].includes(s.id)),
  },
  {
    id: 10,
    name: "Combination Play",
    description: "Quick combinations in attack.",
    sessions: sessions.filter((s) => [9, 10].includes(s.id)),
  },
];

// ------------------ Game Tactics ------------------
export const gameTactics: GameTactic[] = [
  {
    id: 201,
    name: "Game 1",
    description: "Game 1 tactic",
    sessions: sessions.filter((s) => [11, 12, 13].includes(s.id)),
  },
  {
    id: 202,
    name: "Game 2",
    description: "Game 2 tactic",
    sessions: sessions.filter((s) => [12, 14].includes(s.id)),
  },
  {
    id: 203,
    name: "Game 3",
    description: "Game 3 tactic",
    sessions: sessions.filter((s) => [13, 12].includes(s.id)),
  },
];

// ------------------ Helpers ------------------
function generateTacticSteps(
  type: "4-4-2" | "corner" | "highPress" | "compactPress"
): Session["steps"] {
  const steps: Session["steps"] = [];

  for (let i = 0; i < 3; i++) {
    const players: Player[] = [];
    if (type === "4-4-2") {
      for (let j = 0; j < 11; j++) {
        players.push({
          id: j + 1,
          number: j + 1,
          x: 50 + j * 5,
          y: 10 + j * 5,
          color: j < 6 ? "blue" : "red",
        });
      }
    }
    if (type === "corner") {
      for (let j = 0; j < 6; j++) {
        players.push({
          id: j + 1,
          number: j + 1,
          x: 20 + j * 10,
          y: 20,
          color: j % 2 === 0 ? "blue" : "red",
        });
      }
    }
    if (type === "highPress") {
      for (let j = 0; j < 8; j++) {
        players.push({
          id: j + 1,
          number: j + 1,
          x: 10 + j * 10,
          y: 20,
          color: j < 4 ? "blue" : "red",
        });
      }
    }
    if (type === "compactPress") {
      for (let j = 0; j < 10; j++) {
        players.push({
          id: j + 1,
          number: j + 1,
          x: 15 + j * 5,
          y: 25,
          color: j < 5 ? "blue" : "red",
        });
      }
    }

    const balls: Ball[] = [{ id: 1, x: 50 + i * 5, y: 50 + i * 5 }];
    const teams: Team[] = [
      { id: 1, name: "Blue", color: "blue" },
      { id: 2, name: "Red", color: "red" },
    ];
    steps.push({ players, balls, goals: [], cones: [], teams });
  }

  return steps;
}
