import type { User } from "../types/types";

export const mockUsers: User[] = [
  {
    id: "1",
    email: "sessiononly@example.com",
    password: "password123",
    role: "user",
    sessionIds: [1, 2],
    practiceIds: [],
    tacticIds: [],
  },
  {
    id: "2",
    email: "practiceonly@example.com",
    password: "password123",
    role: "user",
    sessionIds: [],
    practiceIds: [1, 2, 3],
    tacticIds: [],
  },
  {
    id: "3",
    email: "tacticonly@example.com",
    password: "password123",
    role: "user",
    sessionIds: [],
    practiceIds: [],
    tacticIds: [201, 202],
  },
  {
    id: "4",
    email: "a@a.com",
    password: "123",
    role: "admin",
    sessionIds: [1, 3],
    practiceIds: [4, 5],
    tacticIds: [203],
  },
];
