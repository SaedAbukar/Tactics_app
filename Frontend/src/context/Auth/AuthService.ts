import type { AuthUser } from "../../types/types";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function fetchUser(accessToken: string): Promise<AuthUser> {
  const res = await fetch(`${API_BASE}/auth/me`, {
    headers: { Authorization: `Bearer ${accessToken}` },
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Failed to fetch user: ${res.status} ${errText}`);
  }

  const data = await res.json();

  return {
    id: data.id,
    email: data.email,
    role: data.role,
    name: data.name,
    groups: data.groups,
    createdAt: data.createdAt,
    lastLogin: data.lastLogin,
  };
}

export async function refreshToken(refreshToken: string) {
  const res = await fetch(`${API_BASE}/auth/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refreshToken }),
  });
  return res.json();
}

export async function authRequest(
  endpoint: string,
  body: { email: string; password: string }
) {
  const res = await fetch(`${API_BASE}${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const errText = await res.text().catch(() => res.statusText);
    throw new Error(`Request failed: ${res.status} ${errText}`);
  }

  return res.json();
}
