import { useAuth } from "../context/AuthContext";

export const useFetchWithAuth = () => {
  const { token, refreshAccessToken, logout } = useAuth();

  const request = async (
    url: string,
    options: RequestInit = {}
  ): Promise<any> => {
    if (!token) throw new Error("No access token available");

    const makeRequest = async (accessToken: string) => {
      try {
        // ---------- MOCK JSON (for local testing) ----------
        if (url === "/api/profile") {
          const { mockGetProfile } = await import("../mock/api");
          return await mockGetProfile(accessToken);
        }

        // ---------- REAL SERVER (Spring Boot) ----------
        /*const headers: HeadersInit = {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
          ...options.headers,
        };
        const response = await fetch(url, { ...options, headers });
        if (!response.ok)
          throw new Error(`Request failed with status ${response.status}`);
        return await response.json();*/
      } catch (err: any) {
        // If token is invalid/expired, try refresh
        if (
          err.message.includes("401") ||
          err.message.includes("Invalid token")
        ) {
          const refreshed = await refreshAccessToken();
          if (refreshed) return await makeRequest(refreshed.token);
          logout();
          throw new Error("Session expired. Please log in again.");
        }
        throw err;
      }
    };

    return makeRequest(token);
  };

  return { request };
};
