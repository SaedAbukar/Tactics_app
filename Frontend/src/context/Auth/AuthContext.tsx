import {
  createContext,
  useState,
  useContext,
  useEffect,
  type ReactNode,
  useRef,
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
  refreshUser: () => Promise<void>;
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
  // Near your other state declarations
  const isRefreshing = useRef(false);

  const refreshAccessToken = async () => {
    // Prevent simultaneous refresh calls (The "Race Condition" fix)
    if (isRefreshing.current) return null;

    const currentRefresh =
      refreshTokenValue || sessionStorage.getItem("refreshToken");
    if (!currentRefresh) return null;

    try {
      isRefreshing.current = true; // Lock
      const data = await authService.refreshToken(currentRefresh);

      if (!data.accessToken || !data.refreshToken) {
        throw new Error("Invalid refresh token response");
      }

      saveTokens(data.accessToken, data.refreshToken);
      const userData = await authService.fetchUser(data.accessToken);
      setUser(userData);

      return { token: data.accessToken, user: userData };
    } catch (err: any) {
      // If the server returns a 500 (Internal Server Error), force logout
      // This handles the unique constraint crash on the backend
      if (err.message?.includes("500") || err.response?.status === 500) {
        logout();
        return null;
      }

      clearAuth();
      return null;
    } finally {
      isRefreshing.current = false; // Unlock
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

  const refreshUser = async () => {
    const currentToken = token || sessionStorage.getItem("token");
    if (!currentToken) return;

    try {
      const userData = await authService.fetchUser(currentToken);
      setUser(userData);
    } catch (err: any) {
      // If the error is a 401 (Unauthorized), try to refresh the token
      if (err.message?.includes("401")) {
        console.log(
          "Token expired during user refresh, attempting silent refresh..."
        );
        const result = await refreshAccessToken();

        // If refresh worked, try fetching the user one more time with the NEW token
        if (result) {
          const freshUserData = await authService.fetchUser(result.token);
          setUser(freshUserData);
        }
      } else {
        console.error("Failed to refresh user profile:", err);
      }
    }
  };

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
        refreshUser,
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
