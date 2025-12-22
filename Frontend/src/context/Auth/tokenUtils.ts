import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../types/types";

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    // Correctly uses the generic type <JwtPayload>
    const decoded = jwtDecode<JwtPayload>(token);
    return Date.now() / 1000 < decoded.exp;
  } catch {
    return false;
  }
}

export function scheduleTokenRefresh(
  token: string,
  refreshCallback: () => void
) {
  try {
    const decoded = jwtDecode<JwtPayload>(token);
    const timeout = decoded.exp * 1000 - Date.now() - 30_000; // 30s before expiry
    if (timeout > 0) setTimeout(refreshCallback, timeout);
  } catch {
    // ignore invalid token
  }
}
