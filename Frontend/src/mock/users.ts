import type { User } from "../types/types";
import { sessions, practices, gameTactics } from "../mock/allMocks";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "sessiononly@example.com",
    password: "password123",
    role: "user",
    sessions: [sessions[0], sessions[1]], // First two sessions
    practices: [],
    tactics: [],
  },
  {
    id: "2",
    email: "practiceonly@example.com",
    password: "password123",
    role: "user",
    sessions: [],
    practices: [practices[0], practices[1], practices[2]], // First three practices
    tactics: [],
  },
  {
    id: "3",
    email: "tacticonly@example.com",
    password: "password123",
    role: "user",
    sessions: [],
    practices: [],
    tactics: [gameTactics[0], gameTactics[1]], // First two tactics
  },
  {
    id: "4",
    email: "a@a.com",
    password: "123",
    role: "admin",
    sessions: [sessions[0], sessions[2]], // Sessions 1 and 3
    practices: [practices[3], practices[4]], // Practices 4 and 5
    tactics: [gameTactics[2]], // Third tactic
  },
];
