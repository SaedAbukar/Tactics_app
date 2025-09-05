import type { User } from "../types/types";
import { mockUsers } from "./users";

type LoginCredentials = { email: string; password: string };
type SignupDetails = {
  email: string;
  password: string;
  role?: "user" | "admin";
};
type TokenPayload = { userId: string; exp: number };

let refreshTokens: Record<string, string> = {};

export const mockLogin = async (credentials: LoginCredentials) => {
  const user = mockUsers.find(
    (u) => u.email === credentials.email && u.password === credentials.password
  );

  if (!user) throw new Error("Invalid email or password");

  const token = createJwt(user.id);
  const refreshToken = createJwt(user.id, 60 * 60); // 1 hour refresh

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
    role: details.role ?? "user", // default to "user" if undefined
    sessionIds: [],
    practiceIds: [],
    tacticIds: [],
  };

  mockUsers.push(newUser);

  const token = createJwt(newUser.id);
  const refreshToken = createJwt(newUser.id, 60 * 60);

  refreshTokens[newUser.id] = refreshToken;

  return { user: newUser, token, refreshToken };
};

export const mockRefresh = async (refreshToken: string) => {
  const payload = decodeJwt(refreshToken);
  if (
    !payload ||
    !refreshTokens[payload.userId] ||
    refreshTokens[payload.userId] !== refreshToken
  ) {
    throw new Error("Invalid refresh token");
  }

  const user = mockUsers.find((u) => u.id === payload.userId);
  if (!user) throw new Error("User not found");

  const newToken = createJwt(user.id);
  return { user, token: newToken, refreshToken };
};

/* ---------- Helper functions ---------- */

const createJwt = (userId: string, expiresInSeconds = 5 * 60) => {
  const exp = Math.floor(Date.now() / 1000) + expiresInSeconds;
  const payload = { userId, exp };
  return btoa(JSON.stringify(payload)); // simple base64 mock JWT
};

const decodeJwt = (token: string) => {
  try {
    return JSON.parse(atob(token)) as TokenPayload;
  } catch {
    return null;
  }
};

/* ---------- Mock CRUD for user entities ---------- */

type EntityType = "sessionIds" | "practiceIds" | "tacticIds";

export const mockAddEntityToUser = async (
  userId: string,
  entityType: EntityType,
  entityId: number
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  if (!user[entityType].includes(entityId)) {
    user[entityType].push(entityId);
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

  user[entityType] = user[entityType].filter((id) => id !== entityId);

  return user;
};

export const mockGetUserEntities = async (
  userId: string,
  entityType: EntityType
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  return user[entityType];
};

export const mockSetUserEntities = async (
  userId: string,
  entityType: EntityType,
  entityIds: number[]
) => {
  const user = mockUsers.find((u) => u.id === userId);
  if (!user) throw new Error("User not found");

  user[entityType] = [...entityIds];
  return user;
};
