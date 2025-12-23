import {
  type Session,
  type Practice,
  type GameTactic,
  type CategorizedItems, // Imported
  type AllUserData, // Imported
  ShareRole,
  type UserProfileResponse,
} from "../../../types/types";

type RequestFn = <T>(url: string, options?: RequestInit) => Promise<T>;

export class UserDataApi {
  private readonly request: RequestFn;

  constructor(request: RequestFn) {
    this.request = request;
  }

  async updatePublicStatus(isPublic: boolean): Promise<UserProfileResponse> {
    return this.request<UserProfileResponse>("/api/users/me/public", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublic }), // Key matches DTO
    });
  }

  // =========================================================================
  //  BULK FETCH
  // =========================================================================

  async fetchAllUserData(): Promise<AllUserData> {
    const [sessions, practices, tactics] = await Promise.all([
      this.fetchSessions(),
      this.fetchPractices(),
      this.fetchTactics(),
    ]);

    return { sessions, practices, tactics };
  }

  // =========================================================================
  //  SESSIONS (CRUD + SHARING)
  // =========================================================================

  async fetchSessions(): Promise<CategorizedItems<Session>> {
    return this.request<CategorizedItems<Session>>("/sessions");
  }

  async createSession(data: Partial<Session>): Promise<Session> {
    return this.post<Session>("/sessions", data);
  }

  async updateSession(id: number, data: Partial<Session>): Promise<Session> {
    return this.put<Session>(`/sessions/${id}`, data);
  }

  async deleteSession(id: number): Promise<void> {
    return this.delete(`/sessions/${id}`);
  }

  /** Share a session with another user */
  async shareSession(
    sessionId: number,
    targetId: number,
    role: ShareRole
  ): Promise<void> {
    return this.post<void>("/sessions/share/user", {
      sessionId,
      targetId,
      role,
    });
  }

  async revokeSessionShare(sessionId: number, targetId: number): Promise<void> {
    return this.deleteBody<void>("/sessions/share/user", {
      sessionId,
      targetId,
    });
  }

  // =========================================================================
  //  PRACTICES (CRUD + SHARING)
  // =========================================================================

  async fetchPractices(): Promise<CategorizedItems<Practice>> {
    return this.request<CategorizedItems<Practice>>("/practices");
  }

  async createPractice(data: Partial<Practice>): Promise<Practice> {
    return this.post<Practice>("/practices", data);
  }

  async updatePractice(id: number, data: Partial<Practice>): Promise<Practice> {
    return this.put<Practice>(`/practices/${id}`, data);
  }

  async deletePractice(id: number): Promise<void> {
    return this.delete(`/practices/${id}`);
  }

  /** Share a practice with another user */
  async sharePractice(
    practiceId: number,
    targetId: number,
    role: ShareRole
  ): Promise<void> {
    return this.post<void>("/practices/share/user", {
      practiceId,
      targetId,
      role,
    });
  }

  async revokePracticeShare(
    practiceId: number,
    targetId: number
  ): Promise<void> {
    return this.deleteBody<void>("/practices/share/user", {
      practiceId,
      targetId,
    });
  }

  // =========================================================================
  //  GAME TACTICS (CRUD + SHARING)
  // =========================================================================

  async fetchTactics(): Promise<CategorizedItems<GameTactic>> {
    return this.request<CategorizedItems<GameTactic>>("/game-tactics");
  }

  async createTactic(data: Partial<GameTactic>): Promise<GameTactic> {
    return this.post<GameTactic>("/game-tactics", data);
  }

  async updateTactic(
    id: number,
    data: Partial<GameTactic>
  ): Promise<GameTactic> {
    return this.put<GameTactic>(`/game-tactics/${id}`, data);
  }

  async deleteTactic(id: number): Promise<void> {
    return this.delete(`/game-tactics/${id}`);
  }

  /** Share a tactic with another user */
  async shareTactic(
    gameTacticId: number,
    targetId: number,
    role: ShareRole
  ): Promise<void> {
    return this.post<void>("/game-tactics/share/user", {
      gameTacticId,
      targetId,
      role,
    });
  }

  async revokeTacticShare(
    gameTacticId: number,
    targetId: number
  ): Promise<void> {
    return this.deleteBody<void>("/game-tactics/share/user", {
      gameTacticId,
      targetId,
    });
  }

  // =========================================================================
  //  PRIVATE HELPERS
  // =========================================================================

  private async post<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: "POST",
      body: JSON.stringify(body),
    });
  }

  private async put<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: "PUT",
      body: JSON.stringify(body),
    });
  }

  private async delete(url: string): Promise<void> {
    return this.request<void>(url, {
      method: "DELETE",
    });
  }

  private async deleteBody<T>(url: string, body: any): Promise<T> {
    return this.request<T>(url, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
  }
}
