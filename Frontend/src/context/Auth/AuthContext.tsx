import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
} from "react";
import type { AuthUser } from "../../types/types";
import * as authService from "./AuthService";
import * as tokenUtils from "./tokenUtils";

interface AuthContextType {
  user: AuthUser | null;
  token: string | null;
  loading: boolean;
  error: Error | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (details: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<{ token: string; user: AuthUser } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    null
  );

  // FIX 1: Start loading as TRUE. The app is "loading" until we prove otherwise.
  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<Error | null>(null);

  // ------------------------------
  // Token helpers
  // ------------------------------
  const saveTokens = (accessToken: string, refreshToken: string) => {
    setToken(accessToken);
    setRefreshTokenValue(refreshToken);
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    tokenUtils.scheduleTokenRefresh(accessToken, refreshAccessToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
    sessionStorage.clear();
  };

  // ------------------------------
  // FIX 2: Restore Session on Refresh
  // ------------------------------
  useEffect(() => {
    const initAuth = async () => {
      const storedToken = sessionStorage.getItem("token");
      const storedRefresh = sessionStorage.getItem("refreshToken");

      if (!storedToken || !storedRefresh) {
        setLoading(false); // No token found, we are done loading (user is guest)
        return;
      }

      try {
        // 1. Restore tokens to state immediately
        setToken(storedToken);
        setRefreshTokenValue(storedRefresh);

        // 2. Schedule the silent refresh
        tokenUtils.scheduleTokenRefresh(storedToken, refreshAccessToken);

        // 3. Fetch the user profile to verify token validity
        const userData = await authService.fetchUser(storedToken);
        setUser(userData);
      } catch (err) {
        console.error("Session restoration failed:", err);
        clearAuth(); // Token was invalid/expired
      } finally {
        setLoading(false); // ALWAYS release the loading gate
      }
    };

    initAuth();
  }, []);

  // ------------------------------
  // Refresh access token
  // ------------------------------
  const refreshAccessToken = async () => {
    // Fallback to storage if state is empty (e.g. during a race condition)
    const currentRefresh =
      refreshTokenValue || sessionStorage.getItem("refreshToken");

    if (!currentRefresh) return null;

    try {
      const data = await authService.refreshToken(currentRefresh);

      if (!data.accessToken || !data.refreshToken)
        throw new Error("Invalid refresh token response");

      saveTokens(data.accessToken, data.refreshToken);

      const userData = await authService.fetchUser(data.accessToken);
      setUser(userData);

      return { token: data.accessToken, user: userData };
    } catch (err) {
      clearAuth();
      return null;
    }
  };

  // ------------------------------
  // Login
  // ------------------------------
  const login = async (credentials: { email: string; password: string }) => {
    setLoading(true);
    setError(null);

    try {
      const data = await authService.authRequest("/auth/login", credentials);

      if (!data.accessToken || !data.refreshToken)
        throw new Error("No tokens returned from server");

      saveTokens(data.accessToken, data.refreshToken);

      const userData = await authService.fetchUser(data.accessToken);
      setUser(userData);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ------------------------------
  // Signup
  // ------------------------------
  const signup = async (
    details: { email: string; password: string },
    onSuccess?: () => void
  ) => {
    setLoading(true);
    setError(null);

    try {
      await authService.authRequest("/auth/signup", details);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => clearAuth();

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        error,
        login,
        signup,
        logout,
        refreshAccessToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
