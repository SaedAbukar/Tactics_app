import type { User, Session, Practice, GameTactic } from "../types/types";
import {
  sessions as allSessions,
  practices as allPractices,
  gameTactics as allTactics,
} from "../mock/allMocks";

type LoginCredentials = { email: string; password: string };
type SignupDetails = {
  email: string;
  password: string;
  role?: "user" | "admin";
};

let refreshTokens: Record<string, string> = {};

export let mockUsers: User[] = [
  {
    id: "1",
    email: "sessiononly@example.com",
    password: "password123",
    role: "user",
    sessions: [allSessions[0], allSessions[1]], // Sessions by index
    practices: [],
    tactics: [],
  },
  {
    id: "2",
    email: "practiceonly@example.com",
    password: "password123",
    role: "user",
    sessions: [],
    practices: [allPractices[0], allPractices[1], allPractices[2]],
    tactics: [],
  },
  {
    id: "3",
    email: "tacticonly@example.com",
    password: "password123",
    role: "user",
    sessions: [],
    practices: [],
    tactics: [allTactics[0], allTactics[1]],
  },
  {
    id: "4",
    email: "a@a.com",
    password: "123",
    role: "admin",
    sessions: [allSessions[0], allSessions[2]],
    practices: [allPractices[3], allPractices[4]],
    tactics: [allTactics[2]],
  },
];

const delay = (ms: number) => new Promise((res) => setTimeout(res, ms));

/* ---------- Auth ---------- */

export const mockLogin = async (credentials: LoginCredentials) => {
  await delay(100);

  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );
  if (!user) throw new Error("Invalid email or password");

  const token = createJwt(user.id);
  const refreshToken = createJwt(user.id, 60 * 60);

  refreshTokens[user.id] = refreshToken;

  return { user, token, refreshToken };
};

export const mockSignup = async (details: SignupDetails) => {
  await delay(100);

  if (mockUsers.some((u) => u.email === details.email)) {
    throw new Error("Email already exists");
  }

  const newUser: User = {
    id: (mockUsers.length + 1).toString(),
    email: details.email,
    password: details.password,
    role: details.role ?? "user",
    sessions: [],
    practices: [],
    tactics: [],
  };

  mockUsers.push(newUser);

  const token = createJwt(newUser.id);
  const refreshToken = createJwt(newUser.id, 60 * 60);
  refreshTokens[newUser.id] = refreshToken;

  return { user: newUser, token, refreshToken };
};

export const mockRefresh = async (refreshToken: string) => {
  await delay(100);

  const payload = decodeJwt(refreshToken);
  if (!payload || refreshTokens[payload.userId] !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const user = mockUsers.find((u) => u.id === payload.userId);
  if (!user) throw new Error("User not found");

  const newToken = createJwt(user.id);
  return { user, token: newToken, refreshToken };
};

/* ---------- JWT helpers ---------- */

type JwtPayload = { userId: string; exp: number };

const createJwt = (userId: string, expiresInSeconds = 5 * 60) => {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = { userId, exp };
  return btoa(JSON.stringify(payload));
};

const decodeJwt = (token: string): JwtPayload | null => {
  try {
    return JSON.parse(atob(token)) as JwtPayload;
  } catch {
    return null;
  }
};
