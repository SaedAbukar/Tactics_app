import users from "./users.json";

// Simple fake JWT generator (base64 encoding)
const generateFakeJWT = (userId: string, expiresInSeconds = 60) => {
  const payload = {
    id: userId,
    exp: Math.floor(Date.now() / 1000) + expiresInSeconds,
  };
  return btoa(JSON.stringify(payload)); // browser-safe string
};

// Decode fake JWT
export const decodeFakeJWT = (token: string) => {
  try {
    const decoded = JSON.parse(atob(token));
    return decoded; // { id, exp }
  } catch {
    return null;
  }
};

interface Credentials {
  email: string;
  password: string;
}

export const mockLogin = async ({ email, password }: Credentials) => {
  const user = users.find((u) => u.email === email && u.password === password);
  if (!user) throw new Error("Invalid email or password");

  const token = generateFakeJWT(user.id);
  const refreshToken = generateFakeJWT(user.id, 300); // 5 minutes
  return { user, token, refreshToken };
};

export const mockSignup = async ({ email, password }: Credentials) => {
  const exists = users.find((u) => u.email === email);
  if (exists) throw new Error("User already exists");

  const id = (users.length + 1).toString();
  const newUser = { id, email, password, role: "user" };
  (users as any).push(newUser);

  const token = generateFakeJWT(id);
  const refreshToken = generateFakeJWT(id, 300);
  return { user: newUser, token, refreshToken };
};

export const mockRefresh = async (refreshToken: string) => {
  const decoded = decodeFakeJWT(refreshToken);
  if (!decoded) throw new Error("Invalid refresh token");

  const user = users.find((u) => u.id === decoded.id);
  if (!user) throw new Error("User not found");

  const token = generateFakeJWT(user.id);
  const newRefreshToken = generateFakeJWT(user.id, 300);
  return { user, token, refreshToken: newRefreshToken };
};

export const mockGetProfile = async (token: string) => {
  const decoded = decodeFakeJWT(token);
  if (!decoded) throw new Error("Invalid token");

  const user = users.find((u) => u.id === decoded.id);
  if (!user) throw new Error("User not found");

  return user;
};
