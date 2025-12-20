import { createContext, useState, useContext, type ReactNode } from "react";
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
  const [user, setUser] = useState<AuthUser | null>({
    id: 1,
    email: "test@example.com",
    role: "USER", // or whatever your AuthUser type expects
  });
  const [token, setToken] = useState<string | null>("test-access-token");
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    "test-refresh-token"
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  // ... rest of your AuthProvider code remains unchanged

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
  // Refresh access token
  // ------------------------------
  const refreshAccessToken = async () => {
    if (!refreshTokenValue) return null;

    try {
      const data = await authService.refreshToken(refreshTokenValue);

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

// HMR-safe hook export
export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
