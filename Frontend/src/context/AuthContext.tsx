import React, {
  createContext,
  useState,
  useEffect,
  useContext,
  type ReactNode,
} from "react";
import * as jwt_decode from "jwt-decode";

// Minimal user type
export type AuthUser = {
  id: string;
  email: string;
  role: "user" | "admin";
  name?: string;
};

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

interface AuthProviderProps {
  children: ReactNode;
}

interface JwtPayload {
  exp: number;
  [key: string]: any;
}

let refreshTimeout: NodeJS.Timeout;

function isTokenValid(token: string | null): boolean {
  if (!token) return false;
  try {
    const decoded = (jwt_decode as unknown as (token: string) => JwtPayload)(
      token
    );
    return Date.now() / 1000 < decoded.exp;
  } catch {
    return false;
  }
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => {
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

  function saveAuth(
    userData: AuthUser,
    accessToken: string,
    refreshToken: string
  ) {
    setUser(userData);
    setToken(accessToken);
    setRefreshTokenValue(refreshToken);

    sessionStorage.setItem("user", JSON.stringify(userData));
    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    scheduleTokenRefresh(accessToken);
  }

  function saveTokensOnly(accessToken: string, refreshToken: string) {
    setToken(accessToken);
    setRefreshTokenValue(refreshToken);

    sessionStorage.setItem("token", accessToken);
    sessionStorage.setItem("refreshToken", refreshToken);

    scheduleTokenRefresh(accessToken);
  }

  function clearAuth() {
    setUser(null);
    setToken(null);
    setRefreshTokenValue(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("refreshToken");
    if (refreshTimeout) clearTimeout(refreshTimeout);
  }

  function scheduleTokenRefresh(accessToken: string) {
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
  }

  async function fetchUser(accessToken: string): Promise<AuthUser> {
    const res = await fetch("http://localhost:8085/auth/me", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    const data = await res.json().catch(() => ({}));
    console.log("User info response:", data);

    if (!data || !data.id) throw new Error("Failed to fetch user info");

    return {
      id: data.id,
      email: data.email,
      role: data.role as "user" | "admin",
      name: data.name,
    };
  }

  async function refreshAccessToken(): Promise<{
    token: string;
    user: AuthUser;
  } | null> {
    if (!refreshTokenValue) {
      clearAuth();
      return null;
    }
    try {
      const res = await fetch("http://localhost:8085/auth/refresh", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refreshToken: refreshTokenValue }),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Refresh response:", data);

      const tokenValue = data.token ?? data.accessToken;
      if (!tokenValue || !data.refreshToken)
        throw new Error("Invalid refresh response");

      saveTokensOnly(tokenValue, data.refreshToken);

      const userData = await fetchUser(tokenValue);
      setUser(userData);

      return { token: tokenValue, user: userData };
    } catch {
      clearAuth();
      return null;
    }
  }

  useEffect(() => {
    if (token && refreshTokenValue && !isTokenValid(token))
      refreshAccessToken();
  }, []);

  async function authRequest(
    endpoint: string,
    body: { email: string; password: string }
  ) {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const data = await res.json().catch(() => ({}));
      console.log("Auth response:", data);

      const tokenValue = data.token ?? data.accessToken;
      if (!tokenValue || !data.refreshToken)
        throw new Error("No tokens returned from server");

      // Save tokens first
      saveTokensOnly(tokenValue, data.refreshToken);

      // Fetch the user info
      const userData = await fetchUser(tokenValue);
      setUser(userData);
    } catch (err: any) {
      setError(err);
      throw err;
    } finally {
      setLoading(false);
    }
  }

  const login = async (credentials: { email: string; password: string }) => {
    await authRequest("http://localhost:8085/auth/login", credentials);
  };

  const signup = async (details: { email: string; password: string }) => {
    await authRequest("http://localhost:8085/auth/signup", details);
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
export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
}
