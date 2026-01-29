import {
  type SessionSummary,
  type SessionDetail,
  type PracticeSummary,
  type PracticeDetail,
  type GameTacticSummary,
  type GameTacticDetail,
  type TabbedResponse,
  type AllUserData,
  type UserProfileResponse,
  type CollaboratorDTO,
  type SessionRequest,
  ShareRole,
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
      body: JSON.stringify({ isPublic }),
    });
  }

  // =========================================================================
  //  BULK FETCH (TABS)
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

  // 1. Fetch List -> Returns Lightweight Summaries
  async fetchSessions(): Promise<TabbedResponse<SessionSummary>> {
    return this.request<TabbedResponse<SessionSummary>>("/sessions");
  }

  // 2. Fetch Single -> Returns Full Detail
  async fetchSessionById(id: number): Promise<SessionDetail> {
    return this.request<SessionDetail>(`/sessions/${id}`);
  }

  // 3. Create -> Returns Full Detail
  async createSession(data: SessionRequest): Promise<SessionDetail> {
    return this.post<SessionDetail>("/sessions", data);
  }

  // 4. Update -> Returns Full Detail
  async updateSession(
    id: number,
    data: SessionRequest,
  ): Promise<SessionDetail> {
    return this.put<SessionDetail>(`/sessions/${id}`, data);
  }

  async deleteSession(id: number): Promise<void> {
    return this.delete(`/sessions/${id}`);
  }

  /** Share a session with another user */
  async fetchCollaborators(sessionId: number): Promise<CollaboratorDTO[]> {
    return this.request<CollaboratorDTO[]>(
      `/sessions/share/${sessionId}/collaborators`,
    );
  }

  async shareSession(
    sessionId: number,
    targetId: number,
    role: ShareRole,
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

  async fetchPractices(): Promise<TabbedResponse<PracticeSummary>> {
    return this.request<TabbedResponse<PracticeSummary>>("/practices");
  }

  async fetchPracticeById(id: number): Promise<PracticeDetail> {
    return this.request<PracticeDetail>(`/practices/${id}`);
  }

  async createPractice(data: Partial<PracticeDetail>): Promise<PracticeDetail> {
    return this.post<PracticeDetail>("/practices", data);
  }

  async updatePractice(
    id: number,
    data: Partial<PracticeDetail>,
  ): Promise<PracticeDetail> {
    return this.put<PracticeDetail>(`/practices/${id}`, data);
  }

  async deletePractice(id: number): Promise<void> {
    return this.delete(`/practices/${id}`);
  }

  /** Share a practice with another user */
  async fetchPracticeCollaborators(
    practiceId: number,
  ): Promise<CollaboratorDTO[]> {
    return this.request<CollaboratorDTO[]>(
      `/practices/share/${practiceId}/collaborators`,
    );
  }

  async sharePractice(
    practiceId: number,
    targetId: number,
    role: ShareRole,
  ): Promise<void> {
    return this.post<void>("/practices/share/user", {
      practiceId,
      targetId,
      role,
    });
  }

  async revokePracticeShare(
    practiceId: number,
    targetId: number,
  ): Promise<void> {
    return this.deleteBody<void>("/practices/share/user", {
      practiceId,
      targetId,
    });
  }

  // =========================================================================
  //  GAME TACTICS (CRUD + SHARING)
  // =========================================================================

  async fetchTactics(): Promise<TabbedResponse<GameTacticSummary>> {
    return this.request<TabbedResponse<GameTacticSummary>>("/game-tactics");
  }

  async fetchTacticById(id: number): Promise<GameTacticDetail> {
    return this.request<GameTacticDetail>(`/game-tactics/${id}`);
  }

  async createTactic(
    data: Partial<GameTacticDetail>,
  ): Promise<GameTacticDetail> {
    return this.post<GameTacticDetail>("/game-tactics", data);
  }

  async updateTactic(
    id: number,
    data: Partial<GameTacticDetail>,
  ): Promise<GameTacticDetail> {
    return this.put<GameTacticDetail>(`/game-tactics/${id}`, data);
  }

  async deleteTactic(id: number): Promise<void> {
    return this.delete(`/game-tactics/${id}`);
  }

  /** Share a tactic with another user */
  async fetchTacticCollaborators(
    gameTacticId: number,
  ): Promise<CollaboratorDTO[]> {
    return this.request<CollaboratorDTO[]>(
      `/game-tactics/share/${gameTacticId}/collaborators`,
    );
  }

  async shareTactic(
    gameTacticId: number,
    targetId: number,
    role: ShareRole,
  ): Promise<void> {
    return this.post<void>("/game-tactics/share/user", {
      gameTacticId,
      targetId,
      role,
    });
  }

  async revokeTacticShare(
    gameTacticId: number,
    targetId: number,
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
