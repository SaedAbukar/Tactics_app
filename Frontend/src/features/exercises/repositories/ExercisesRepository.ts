import type { UserDataApi } from "../api/UserDataApi";
import type {
  Session,
  Practice,
  GameTactic,
  ShareRole,
  AllUserData, // Moved here
  CategorizedItems, // Moved here
} from "../../../types/types";

export class ExercisesRepository {
  private readonly api: UserDataApi;

  constructor(api: UserDataApi) {
    this.api = api;
  }

  // =========================================================================
  //  DASHBOARD DATA
  // =========================================================================

  async getDashboardData(): Promise<AllUserData> {
    return this.api.fetchAllUserData();
  }

  // =========================================================================
  //  SESSIONS
  // =========================================================================

  async fetchSessions(): Promise<CategorizedItems<Session>> {
    return this.api.fetchSessions();
  }

  async createSession(data: Partial<Session>): Promise<Session> {
    return this.api.createSession(data);
  }

  async updateSession(id: number, data: Partial<Session>): Promise<Session> {
    return this.api.updateSession(id, data);
  }

  async deleteSession(id: number): Promise<void> {
    return this.api.deleteSession(id);
  }

  async shareSession(
    sessionId: number,
    targetId: number,
    role: ShareRole
  ): Promise<void> {
    return this.api.shareSession(sessionId, targetId, role);
  }

  async revokeSessionShare(sessionId: number, targetId: number): Promise<void> {
    return this.api.revokeSessionShare(sessionId, targetId);
  }

  // =========================================================================
  //  PRACTICES
  // =========================================================================

  async fetchPractices(): Promise<CategorizedItems<Practice>> {
    return this.api.fetchPractices();
  }

  async createPractice(data: Partial<Practice>): Promise<Practice> {
    return this.api.createPractice(data);
  }

  async updatePractice(id: number, data: Partial<Practice>): Promise<Practice> {
    return this.api.updatePractice(id, data);
  }

  async deletePractice(id: number): Promise<void> {
    return this.api.deletePractice(id);
  }

  async sharePractice(
    practiceId: number,
    targetId: number,
    role: ShareRole
  ): Promise<void> {
    return this.api.sharePractice(practiceId, targetId, role);
  }

  async revokePracticeShare(
    practiceId: number,
    targetId: number
  ): Promise<void> {
    return this.api.revokePracticeShare(practiceId, targetId);
  }

  // =========================================================================
  //  GAME TACTICS
  // =========================================================================

  async fetchTactics(): Promise<CategorizedItems<GameTactic>> {
    return this.api.fetchTactics();
  }

  async createTactic(data: Partial<GameTactic>): Promise<GameTactic> {
    return this.api.createTactic(data);
  }

  async updateTactic(
    id: number,
    data: Partial<GameTactic>
  ): Promise<GameTactic> {
    return this.api.updateTactic(id, data);
  }

  async deleteTactic(id: number): Promise<void> {
    return this.api.deleteTactic(id);
  }

  async shareTactic(
    gameTacticId: number,
    targetId: number,
    role: ShareRole
  ): Promise<void> {
    return this.api.shareTactic(gameTacticId, targetId, role);
  }

  async revokeTacticShare(
    gameTacticId: number,
    targetId: number
  ): Promise<void> {
    return this.api.revokeTacticShare(gameTacticId, targetId);
  }
}
