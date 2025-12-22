import { jwtDecode } from "jwt-decode";
import type { JwtPayload } from "../../types/types";

export function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
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
    const expiresAt = decoded.exp * 1000;
    const now = Date.now();

    // Schedule 30 seconds before expiry
    const timeout = expiresAt - now - 30_000;

    if (timeout > 0) {
      setTimeout(refreshCallback, timeout);
    } else {
      refreshCallback();
    }
  } catch (error) {
    // MEANINGFUL HANDLING:
    // The token is unreadable (corrupt/malformed).
    // We treat this as "Expired" and attempt to get a new one immediately

    // This triggers the AuthContext refresh logic.
    // If successful -> Session is repaired.
    // If fails -> User is logged out.
    refreshCallback();
  }
}
