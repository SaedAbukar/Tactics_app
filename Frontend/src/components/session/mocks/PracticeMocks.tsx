import type { Practice } from "../../../types/types";

export const practices: Practice[] = [
  {
    id: 1,
    name: "Warm-up Drills",
    description: "Light jogging and stretching.",
    sessionIds: [1],
  },
  {
    id: 2,
    name: "Passing Drills",
    description: "Short and long passing exercises.",
    sessionIds: [1, 9],
  },
  {
    id: 3,
    name: "Shooting Drills",
    description: "Finishing and accuracy practice.",
    sessionIds: [2, 10],
  },
  {
    id: 4,
    name: "Dribbling",
    description: "1v1 dribbling challenges.",
    sessionIds: [3],
  },
  {
    id: 5,
    name: "Defensive Shape",
    description: "Team defensive positioning.",
    sessionIds: [5],
  },
  {
    id: 6,
    name: "Attacking Shape",
    description: "Offensive team patterns.",
    sessionIds: [4, 8],
  },
  {
    id: 7,
    name: "Transition Game",
    description: "Switching from defense to attack.",
    sessionIds: [6],
  },
  {
    id: 8,
    name: "Set Pieces",
    description: "Corners, free kicks, and throw-ins.",
    sessionIds: [7],
  },
  {
    id: 9,
    name: "Wing Play",
    description: "Crossing and wing movements.",
    sessionIds: [8],
  },
  {
    id: 10,
    name: "Combination Play",
    description: "Quick combinations in attack.",
    sessionIds: [9, 10],
  },
];
