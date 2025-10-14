import { useAuth } from "../context/Auth/AuthContext";

/**
 * Custom hook for making authenticated API requests.
 * Automatically attaches Bearer token, handles refresh, and parses JSON safely.
 */
interface ApiError extends Error {
  status?: number;
  data?: any;
}

export const useFetchWithAuth = () => {
  const { token, refreshAccessToken, logout } = useAuth();

  // Pick up the base API URL from your .env
  const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

  /**
   * Generic request function
   * @param url - API endpoint (relative or absolute)
   * @param options - Fetch options (method, headers, body, etc.)
   * @returns Parsed JSON or text data
   */
  const request = async <T = any>(
    url: string,
    options: RequestInit = {}
  ): Promise<T> => {
    if (!token) throw new Error("No access token available");

    // Build full URL
    const fullUrl = url.startsWith("http") ? url : `${API_BASE_URL}${url}`;

    const makeRequest = async (accessToken: string): Promise<T> => {
      const headers: HeadersInit = {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
        ...options.headers,
      };

      try {
        const response = await fetch(fullUrl, { ...options, headers });

        // Read body safely (handles empty or text responses)
        const text = await response.text();
        let data: any;
        try {
          data = text ? JSON.parse(text) : null;
        } catch {
          data = text;
        }

        // If not OK, throw a detailed error
        if (!response.ok) {
          const error: ApiError = new Error(
            data?.message || `Request failed with status ${response.status}`
          );
          error.status = response.status;
          error.data = data;
          throw error;
        }

        return data as T;
      } catch (err: any) {
        // Handle 401/expired token → try refresh
        if (
          err.status === 401 ||
          err.message?.includes("Invalid token") ||
          err.message?.includes("jwt expired")
        ) {
          const refreshed = await refreshAccessToken();
          if (refreshed?.token) return makeRequest(refreshed.token);
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
