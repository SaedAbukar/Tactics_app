import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import { mockLogin, mockSignup, mockRefresh } from "../mock/mockAuth";
import * as jwt_decode from "jwt-decode";
import type { User } from "../types/types";

interface AuthContextType {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: Error | null;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  signup: (details: { email: string; password: string }) => Promise<void>;
  logout: () => void;
  refreshAccessToken: () => Promise<{ token: string; user: User } | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

let refreshTimeout: NodeJS.Timeout;

const isTokenValid = (token: string | null): boolean => {
  if (!token) return false;
  try {
    const decoded = (jwt_decode as unknown as (token: string) => JwtPayload)(
      token
    );
    return Date.now() / 1000 < decoded.exp;
  } catch {
    return false;
  }
};

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    const storedUser = sessionStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  const [token, setToken] = useState<string | null>(() => {
    const storedToken = sessionStorage.getItem("token");
    return isTokenValid(storedToken) ? storedToken : null;
  });
  const [refreshTokenValue, setRefreshTokenValue] = useState<string | null>(
    () => sessionStorage.getItem("refreshToken")
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const saveAuth = (
    userData: User,
    accessToken: string,
    refreshToken: string
  ) => {
    // Ensure arrays always exist
    userData.sessions ||= [];
    userData.practices ||= [];
    userData.tactics ||= [];

    setUser(userData);
    setToken(accessToken);
    setRefreshTokenValue(refreshToken);
    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);
    scheduleTokenRefresh(accessToken);
  };

  const clearAuth = () => {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    if (refreshTimeout) clearTimeout(refreshTimeout);
  };

  const scheduleTokenRefresh = (accessToken: string) => {
    try {
      const decoded = (jwt_decode as unknown as (token: string) => JwtPayload)(
        accessToken
      );
      const timeout = decoded.exp * 1000 - Date.now() - 30_000; // 30s before expiry
      if (refreshTimeout) clearTimeout(refreshTimeout);
      if (timeout > 0)
        refreshTimeout = setTimeout(() => refreshAccessToken(), timeout);
    } catch {
      // ignore
    }
  };

  const refreshAccessToken = async (): Promise<{
    token: string;
    user: User;
  } | null> => {
    if (!refreshTokenValue) {
      clearAuth();
      return null;
    }
    try {
      const data = await mockRefresh(refreshTokenValue);
      if (!data) throw new Error("Failed to refresh token");
      saveAuth(data.user, data.token, data.refreshToken);
      return data;
    } catch {
      clearAuth();
      return null;
    }
  };

  useEffect(() => {
    if (token && refreshTokenValue && !isTokenValid(token))
      refreshAccessToken();
  }, []);

  const authRequest = async (
    endpoint: string,
    body: { email: string; password: string }
  ) => {
    setLoading(true);
    setError(null);
    try {
      let data;
      if (endpoint === "/api/auth/login") data = await mockLogin(body);
      if (endpoint === "/api/auth/signup") data = await mockSignup(body);
      if (!data) throw new Error("Authentication failed: no data returned");
      saveAuth(data.user, data.token, data.refreshToken);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials: { email: string; password: string }) => {
    await authRequest("/api/auth/login", credentials);
  };

  const signup = async (details: { email: string; password: string }) => {
    await authRequest("/api/auth/signup", details);
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
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
