import { makeAutoObservable, runInAction } from "mobx";
import type { ExercisesRepository } from "../repositories/ExercisesRepository";
import type {
  // Summary Types (For Lists)
  SessionSummary,
  PracticeSummary,
  GameTacticSummary,
  // Detail Types (For Selection/Editor)
  SessionDetail,
  PracticeDetail,
  GameTacticDetail,
  // Request Types
  SessionRequest,
  // Shared
  ItemsState,
  ShareRole,
  TabbedResponse,
  CollaboratorDTO,
  Step, // For validation
} from "../../../types/types";

export class ExercisesViewModel {
  // =========================================================================
  //  OBSERVABLES
  // =========================================================================

  // Lists stores Summaries (Lightweight)
  sessionsState: ItemsState<SessionSummary> = {
    personal: [],
    userShared: [],
    groupShared: [],
  };
  practicesState: ItemsState<PracticeSummary> = {
    personal: [],
    userShared: [],
    groupShared: [],
  };
  tacticsState: ItemsState<GameTacticSummary> = {
    personal: [],
    userShared: [],
    groupShared: [],
  };

  // Selection stores Details (Heavyweight)
  selectedItem: SessionDetail | PracticeDetail | GameTacticDetail | null = null;
  collaborators: CollaboratorDTO[] = [];

  isLoading = false;
  error: string | null = null;

  private readonly repository: ExercisesRepository;

  constructor(repository: ExercisesRepository) {
    this.repository = repository;
    makeAutoObservable(this);
  }

  // =========================================================================
  //  USER & PROFILE
  // =========================================================================

  async toggleProfileVisibility(isPublic: boolean): Promise<boolean> {
    runInAction(() => {
      this.isLoading = true;
      this.error = null;
    });

    try {
      await this.repository.updatePublicStatus(isPublic);
      runInAction(() => {
        this.isLoading = false;
      });
      return true;
    } catch (err) {
      runInAction(() => {
        this.isLoading = false;
        this.handleError("Failed to update profile visibility", err);
      });
      return false;
    }
  }

  // =========================================================================
  //  CORE DATA LOADING (DASHBOARD)
  // =========================================================================

  async loadData() {
    this.setLoading(true);
    this.clearError();

    try {
      const data = await this.repository.getDashboardData();

      runInAction(() => {
        this.resetAndPopulateState(this.sessionsState, data.sessions);
        this.resetAndPopulateState(this.practicesState, data.practices);
        this.resetAndPopulateState(this.tacticsState, data.tactics);
      });
    } catch (err) {
      this.handleError("Failed to load exercises data.", err);
    } finally {
      this.setLoading(false);
    }
  }

  // =========================================================================
  //  SELECTION ACTIONS
  // =========================================================================

  selectItem(item: SessionDetail | PracticeDetail | GameTacticDetail) {
    runInAction(() => {
      this.selectedItem = item;
    });
  }

  // 1. Fetch Session Detail
  async fetchAndSelectSession(id: number) {
    this.setLoading(true);
    try {
      const detail = await this.repository.getSessionById(id);
      runInAction(() => {
        this.selectedItem = detail;
      });
    } catch (err) {
      this.handleError("Failed to load session details", err);
    } finally {
      this.setLoading(false);
    }
  }

  // 2. Fetch Practice Detail (ADDED THIS)
  async fetchAndSelectPractice(id: number) {
    this.setLoading(true);
    try {
      const detail = await this.repository.getPracticeById(id);
      runInAction(() => {
        this.selectedItem = detail;
      });
    } catch (err) {
      this.handleError("Failed to load practice details", err);
    } finally {
      this.setLoading(false);
    }
  }

  // 3. Fetch Tactic Detail (ADDED THIS)
  async fetchAndSelectTactic(id: number) {
    this.setLoading(true);
    try {
      const detail = await this.repository.getTacticById(id);
      runInAction(() => {
        this.selectedItem = detail;
      });
    } catch (err) {
      this.handleError("Failed to load tactic details", err);
    } finally {
      this.setLoading(false);
    }
  }

  clearSelection() {
    runInAction(() => {
      this.selectedItem = null;
    });
  }

  // =========================================================================
  //  SESSIONS CRUD
  // =========================================================================

  async deleteSession(id: number) {
    this.setLoading(true);
    try {
      await this.repository.deleteSession(id);
      runInAction(() => {
        this.removeFromState(this.sessionsState, id);
        this.checkClearSelection(id);
      });
    } catch (err) {
      this.handleError("Failed to delete session.", err);
    } finally {
      this.setLoading(false);
    }
  }

  async createSession(data: SessionRequest) {
    this.setLoading(true);
    try {
      const created = await this.repository.createSession(data);
      await this.loadData();
      return created;
    } catch (err) {
      this.handleError("Failed to create session.", err);
      this.setLoading(false);
    }
  }

  async updateSession(id: number, data: SessionRequest) {
    this.setLoading(true);
    try {
      const updated = await this.repository.updateSession(id, data);
      runInAction(() => {
        this.updateInState(
          this.sessionsState,
          updated as unknown as SessionSummary,
        );

        if (this.selectedItem?.id === id) {
          this.selectedItem = updated;
        }
      });
    } catch (err) {
      this.handleError("Failed to update session.", err);
    } finally {
      this.setLoading(false);
    }
  }

  // =========================================================================
  //  PRACTICES CRUD
  // =========================================================================

  async deletePractice(id: number) {
    this.setLoading(true);
    try {
      await this.repository.deletePractice(id);
      runInAction(() => {
        this.removeFromState(this.practicesState, id);
        this.checkClearSelection(id);
      });
    } catch (err) {
      this.handleError("Failed to delete practice.", err);
    } finally {
      this.setLoading(false);
    }
  }

  async createPractice(data: Partial<PracticeDetail>) {
    this.setLoading(true);
    try {
      await this.repository.createPractice(data);
      await this.loadData();
    } catch (err) {
      this.handleError("Failed to create practice.", err);
      this.setLoading(false);
    }
  }

  async updatePractice(id: number, data: Partial<PracticeDetail>) {
    this.setLoading(true);
    try {
      const updated = await this.repository.updatePractice(id, data);
      runInAction(() => {
        this.updateInState(
          this.practicesState,
          updated as unknown as PracticeSummary,
        );
        if (this.selectedItem?.id === id) {
          this.selectedItem = updated;
        }
      });
    } catch (err) {
      this.handleError("Failed to update practice.", err);
    } finally {
      this.setLoading(false);
    }
  }

  // =========================================================================
  //  TACTICS CRUD
  // =========================================================================

  async deleteTactic(id: number) {
    this.setLoading(true);
    try {
      await this.repository.deleteTactic(id);
      runInAction(() => {
        this.removeFromState(this.tacticsState, id);
        this.checkClearSelection(id);
      });
    } catch (err) {
      this.handleError("Failed to delete tactic.", err);
    } finally {
      this.setLoading(false);
    }
  }

  async createTactic(data: Partial<GameTacticDetail>) {
    this.setLoading(true);
    try {
      await this.repository.createTactic(data);
      await this.loadData();
    } catch (err) {
      this.handleError("Failed to create tactic.", err);
      this.setLoading(false);
    }
  }

  async updateTactic(id: number, data: Partial<GameTacticDetail>) {
    this.setLoading(true);
    try {
      const updated = await this.repository.updateTactic(id, data);
      runInAction(() => {
        this.updateInState(
          this.tacticsState,
          updated as unknown as GameTacticSummary,
        );
        if (this.selectedItem?.id === id) {
          this.selectedItem = updated;
        }
      });
    } catch (err) {
      this.handleError("Failed to update tactic.", err);
    } finally {
      this.setLoading(false);
    }
  }

  // =========================================================================
  //  SHARING ACTIONS
  // =========================================================================

  async loadCollaborators(type: "session" | "practice" | "tactic", id: number) {
    try {
      const data = await this.repository.getCollaborators(type, id);
      runInAction(() => {
        this.collaborators = data;
      });
    } catch (err) {
      this.handleError("Failed to fetch collaborators", err);
    }
  }

  async shareItem(
    type: "session" | "practice" | "tactic",
    id: number,
    targetUserId: number,
    role: ShareRole,
  ) {
    this.setLoading(true);
    try {
      if (type === "session") {
        await this.repository.shareSession(id, targetUserId, role);
      } else if (type === "practice") {
        await this.repository.sharePractice(id, targetUserId, role);
      } else if (type === "tactic") {
        await this.repository.shareTactic(id, targetUserId, role);
      }

      await this.loadData();
    } catch (err) {
      this.handleError(`Failed to share ${type}.`, err);
    } finally {
      this.setLoading(false);
    }
  }

  async revokeUserAccess(
    type: "session" | "practice" | "tactic",
    id: number,
    targetUserId: number,
  ) {
    this.setLoading(true);
    try {
      if (type === "session") {
        await this.repository.revokeSessionShare(id, targetUserId);
      } else if (type === "practice") {
        await this.repository.revokePracticeShare(id, targetUserId);
      } else if (type === "tactic") {
        await this.repository.revokeTacticShare(id, targetUserId);
      }
      await this.loadData();
    } catch (err) {
      this.handleError(`Failed to revoke access.`, err);
    } finally {
      this.setLoading(false);
    }
  }

  // =========================================================================
  //  PRIVATE HELPERS
  // =========================================================================

  private setLoading(loading: boolean) {
    runInAction(() => {
      this.isLoading = loading;
    });
  }

  private clearError() {
    runInAction(() => {
      this.error = null;
    });
  }

  private handleError(message: string, err: any) {
    runInAction(() => {
      this.error = message;
      console.error(err);
    });
  }

  private checkClearSelection(deletedId: number) {
    if (this.selectedItem && this.selectedItem.id === deletedId) {
      this.selectedItem = null;
    }
  }

  private resetAndPopulateState<T>(
    state: ItemsState<T>,
    data: TabbedResponse<T>,
  ) {
    state.personal = data.personalItems || [];
    state.userShared = data.userSharedItems || [];
    state.groupShared = data.groupSharedItems || [];
  }

  private removeFromState<T extends { id: number }>(
    state: ItemsState<T>,
    id: number,
  ) {
    state.personal = state.personal.filter((i: { id: number }) => i.id !== id);
    state.userShared = state.userShared.filter(
      (i: { id: number }) => i.id !== id,
    );
    state.groupShared = state.groupShared.filter(
      (i: { id: number }) => i.id !== id,
    );
  }

  private updateInState<T extends { id: number }>(
    state: ItemsState<T>,
    updatedItem: T,
  ) {
    const updateList = (list: T[]) =>
      list.map((item) => (item.id === updatedItem.id ? updatedItem : item));

    state.personal = updateList(state.personal);
    state.userShared = updateList(state.userShared);
    state.groupShared = updateList(state.groupShared);
  }

  // =========================================================================
  //  VALIDATION HELPERS
  // =========================================================================

  validateSessionInput(
    name: string | undefined,
    description: string | undefined,
    steps: Partial<Step>[] | undefined,
  ): string | null {
    if (!name?.trim()) return "Session name is required.";
    if (!description?.trim()) return "Session description is required.";

    if (!steps || steps.length === 0) {
      return "A session must have at least one saved step.";
    }

    const hasContent = steps.some(
      (step) =>
        (step.players && step.players.length > 0) ||
        (step.balls && step.balls.length > 0) ||
        (step.goals && step.goals.length > 0) ||
        (step.cones && step.cones.length > 0),
    );

    if (!hasContent) {
      return "The session is empty. Please add at least one player, ball, or object to the pitch.";
    }

    return null;
  }

  validateCollectionInput(
    name: string | undefined,
    description: string | undefined,
    sessions: any[] | undefined,
    type: string,
  ): string | null {
    if (!name?.trim()) return `${type} name is required.`;
    if (!description?.trim()) return `${type} description is required.`;

    if (!sessions || sessions.length === 0) {
      return `A ${type.toLowerCase()} must have at least one attached session.`;
    }

    return null;
  }
}
