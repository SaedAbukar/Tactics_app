import type { Session } from "../../types/types";

export const sessions: Session[] = [
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
];
