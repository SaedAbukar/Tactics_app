import type { UserDataApi } from "../api/UserDataApi";
import type {
  ShareRole,
  AllUserData,
  UserProfileResponse,
  CollaboratorDTO,
  // New Types
  TabbedResponse,
  SessionSummary,
  SessionDetail,
  SessionRequest,
  PracticeSummary,
  PracticeDetail,
  GameTacticSummary,
  GameTacticDetail,
} from "../../../types/types";

export class ExercisesRepository {
  private readonly api: UserDataApi;

  constructor(api: UserDataApi) {
    this.api = api;
  }

  // =========================================================================
  //  USER & DASHBOARD
  // =========================================================================

  async getDashboardData(): Promise<AllUserData> {
    return this.api.fetchAllUserData();
  }

  async updatePublicStatus(isPublic: boolean): Promise<UserProfileResponse> {
    return this.api.updatePublicStatus(isPublic);
  }

  async getCollaborators(type: string, id: number): Promise<CollaboratorDTO[]> {
    if (type === "session") return this.api.fetchCollaborators(id);
    if (type === "practice") return this.api.fetchPracticeCollaborators(id);
    if (type === "tactic") return this.api.fetchTacticCollaborators(id);
    return [];
  }

  // =========================================================================
  //  SESSIONS
  // =========================================================================

  // Returns lightweight summaries for the list view
  async fetchSessions(): Promise<TabbedResponse<SessionSummary>> {
    return this.api.fetchSessions();
  }

  // Returns full details for the board view (New method usually needed by UI)
  async getSessionById(id: number): Promise<SessionDetail> {
    return this.api.fetchSessionById(id);
  }

  async createSession(data: SessionRequest): Promise<SessionDetail> {
    return this.api.createSession(data);
  }

  async updateSession(
    id: number,
    data: SessionRequest,
  ): Promise<SessionDetail> {
    return this.api.updateSession(id, data);
  }

  async deleteSession(id: number): Promise<void> {
    return this.api.deleteSession(id);
  }

  async shareSession(
    sessionId: number,
    targetId: number,
    role: ShareRole,
  ): Promise<void> {
    return this.api.shareSession(sessionId, targetId, role);
  }

  async revokeSessionShare(sessionId: number, targetId: number): Promise<void> {
    return this.api.revokeSessionShare(sessionId, targetId);
  }

  // =========================================================================
  //  PRACTICES
  // =========================================================================

  async fetchPractices(): Promise<TabbedResponse<PracticeSummary>> {
    return this.api.fetchPractices();
  }

  async getPracticeById(id: number): Promise<PracticeDetail> {
    return this.api.fetchPracticeById(id);
  }

  async createPractice(data: Partial<PracticeDetail>): Promise<PracticeDetail> {
    return this.api.createPractice(data);
  }

  async updatePractice(
    id: number,
    data: Partial<PracticeDetail>,
  ): Promise<PracticeDetail> {
    return this.api.updatePractice(id, data);
  }

  async deletePractice(id: number): Promise<void> {
    return this.api.deletePractice(id);
  }

  async sharePractice(
    practiceId: number,
    targetId: number,
    role: ShareRole,
  ): Promise<void> {
    return this.api.sharePractice(practiceId, targetId, role);
  }

  async revokePracticeShare(
    practiceId: number,
    targetId: number,
  ): Promise<void> {
    return this.api.revokePracticeShare(practiceId, targetId);
  }

  // =========================================================================
  //  GAME TACTICS
  // =========================================================================

  async fetchTactics(): Promise<TabbedResponse<GameTacticSummary>> {
    return this.api.fetchTactics();
  }

  async getTacticById(id: number): Promise<GameTacticDetail> {
    return this.api.fetchTacticById(id);
  }

  async createTactic(
    data: Partial<GameTacticDetail>,
  ): Promise<GameTacticDetail> {
    return this.api.createTactic(data);
  }

  async updateTactic(
    id: number,
    data: Partial<GameTacticDetail>,
  ): Promise<GameTacticDetail> {
    return this.api.updateTactic(id, data);
  }

  async deleteTactic(id: number): Promise<void> {
    return this.api.deleteTactic(id);
  }

  async shareTactic(
    gameTacticId: number,
    targetId: number,
    role: ShareRole,
  ): Promise<void> {
    return this.api.shareTactic(gameTacticId, targetId, role);
  }

  async revokeTacticShare(
    gameTacticId: number,
    targetId: number,
  ): Promise<void> {
    return this.api.revokeTacticShare(gameTacticId, targetId);
  }
}
