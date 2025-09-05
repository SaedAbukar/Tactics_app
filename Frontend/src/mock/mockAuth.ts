import type { User, Session, Practice, GameTactic } from "../types/types";
import { sessions, practices, gameTactics } from "../mock/allMocks";

/* ---------- Mock Users ---------- */
export const mockUsers: User[] = [
  {
    id: "1",
    email: "sessiononly@example.com",
    password: "password123",
    role: "user",
    sessions: [sessions[0], sessions[1]],
    practices: [],
    tactics: [],
  },
  {
    id: "2",
    email: "practiceonly@example.com",
    password: "password123",
    role: "user",
    sessions: [],
    practices: [practices[0], practices[1], practices[2]],
    tactics: [],
  },
  {
    id: "3",
    email: "tacticonly@example.com",
    password: "password123",
    role: "user",
    sessions: [],
    practices: [],
    tactics: [gameTactics[0], gameTactics[1]],
  },
  {
    id: "4",
    email: "a@a.com",
    password: "123",
    role: "admin",
    sessions: [sessions[0], sessions[2]],
    practices: [practices[3], practices[4]],
    tactics: [gameTactics[2]],
  },
];

/* ---------- Auth Helpers ---------- */
type LoginCredentials = { email: string; password: string };
type SignupDetails = {
  email: string;
  password: string;
  role?: "user" | "admin";
};
type TokenPayload = { userId: string; exp: number };

let refreshTokens: Record<string, string> = {};

const createJwt = (userId: string, expiresInSeconds = 5 * 60) => {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = { userId, exp };
  return btoa(JSON.stringify(payload));
};

const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token)) as TokenPayload;
  } catch {
    return null;
  }
};

/* ---------- Auth Functions ---------- */
export const mockLogin = async (credentials: LoginCredentials) => {
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
  const payload = decodeJwt(refreshToken);
  if (!payload || refreshTokens[payload.userId] !== refreshToken) {
    throw new Error("Invalid refresh token");
  }

  const user = mockUsers.find((u) => u.id === payload.userId);
  if (!user) throw new Error("User not found");

  const newToken = createJwt(user.id);
  return { user, token: newToken, refreshToken };
};

/* ---------- Mock CRUD for User Entities ---------- */
type EntityType = "sessions" | "practices" | "tactics";

export const mockAddEntityToUser = async (
  userId: string,
  entityType: EntityType,
  entityId: number
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  switch (entityType) {
    case "sessions": {
      const session = sessions.find((s) => s.id === entityId);
      if (!session) throw new Error("Session not found");
      if (!user.sessions.some((s) => s.id === entityId))
        user.sessions.push(session);
      break;
    }
    case "practices": {
      const practice = practices.find((p) => p.id === entityId);
      if (!practice) throw new Error("Practice not found");
      if (!user.practices.some((p) => p.id === entityId))
        user.practices.push(practice);
      break;
    }
    case "tactics": {
      const tactic = gameTactics.find((t) => t.id === entityId);
      if (!tactic) throw new Error("Tactic not found");
      if (!user.tactics.some((t) => t.id === entityId))
        user.tactics.push(tactic);
      break;
    }
  }

  return user;
};

export const mockRemoveEntityFromUser = async (
  userId: string,
  entityType: EntityType,
  entityId: number
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  switch (entityType) {
    case "sessions":
      user.sessions = user.sessions.filter((s) => s.id !== entityId);
      break;
    case "practices":
      user.practices = user.practices.filter((p) => p.id !== entityId);
      break;
    case "tactics":
      user.tactics = user.tactics.filter((t) => t.id !== entityId);
      break;
  }

  return user;
};

export const mockSetUserEntities = async (
  userId: string,
  entityType: EntityType,
  entityIds: number[]
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  switch (entityType) {
    case "sessions":
      user.sessions = sessions.filter((s) => entityIds.includes(s.id));
      break;
    case "practices":
      user.practices = practices.filter((p) => entityIds.includes(p.id));
      break;
    case "tactics":
      user.tactics = gameTactics.filter((t) => entityIds.includes(t.id));
      break;
  }

  return user;
};

export const mockGetUserEntities = async (
  userId: string,
  entityType: EntityType
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  switch (entityType) {
    case "sessions":
      return user.sessions;
    case "practices":
      return user.practices;
    case "tactics":
      return user.tactics;
  }
};
