import { makeAutoObservable, runInAction } from "mobx";
import type { ExercisesRepository } from "../repositories/ExercisesRepository";
import type {
  Session,
  Practice,
  GameTactic,
  ItemsState,
  ShareRole,
  CategorizedItems,
  Step,
} from "../../../types/types";

export class ExercisesViewModel {
  // Observables
  sessionsState: ItemsState<Session> = {
    personal: [],
    userShared: [],
    groupShared: [],
  };
  practicesState: ItemsState<Practice> = {
    personal: [],
    userShared: [],
    groupShared: [],
  };
  tacticsState: ItemsState<GameTactic> = {
    personal: [],
    userShared: [],
    groupShared: [],
  };

  selectedItem: Session | Practice | GameTactic | null = null;

  isLoading = false;
  error: string | null = null;

  private readonly repository: ExercisesRepository;

  constructor(repository: ExercisesRepository) {
    this.repository = repository;
    makeAutoObservable(this);
  }

  // =========================================================================
  //  CORE DATA LOADING
  // =========================================================================

  async loadData() {
    this.setLoading(true);
    this.clearError();

    try {
      const data = await this.repository.getDashboardData();

      runInAction(() => {
        // We use a helper to explicitly OVERWRITE the arrays.
        // This ensures the list is "cleared" of old data and replaced by new data.
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

  selectItem(item: Session | Practice | GameTactic) {
    runInAction(() => {
      this.selectedItem = item;
    });
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

  async createSession(data: Partial<Session>) {
    this.setLoading(true);
    try {
      await this.repository.createSession(data);
      await this.loadData();
    } catch (err) {
      this.handleError("Failed to create session.", err);
      this.setLoading(false);
    }
  }

  async updateSession(id: number, data: Partial<Session>) {
    this.setLoading(true);
    try {
      const updated = await this.repository.updateSession(id, data);
      runInAction(() => {
        this.updateInState(this.sessionsState, updated);
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

  async createPractice(data: Partial<Practice>) {
    this.setLoading(true);
    try {
      await this.repository.createPractice(data);
      await this.loadData();
    } catch (err) {
      this.handleError("Failed to create practice.", err);
      this.setLoading(false);
    }
  }

  async updatePractice(id: number, data: Partial<Practice>) {
    this.setLoading(true);
    try {
      const updated = await this.repository.updatePractice(id, data);
      runInAction(() => {
        this.updateInState(this.practicesState, updated);
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

  async createTactic(data: Partial<GameTactic>) {
    this.setLoading(true);
    try {
      await this.repository.createTactic(data);
      await this.loadData();
    } catch (err) {
      this.handleError("Failed to create tactic.", err);
      this.setLoading(false);
    }
  }

  async updateTactic(id: number, data: Partial<GameTactic>) {
    this.setLoading(true);
    try {
      const updated = await this.repository.updateTactic(id, data);
      runInAction(() => {
        this.updateInState(this.tacticsState, updated);
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

  async shareItem(
    type: "session" | "practice" | "tactic",
    id: number,
    targetId: number,
    role: ShareRole
  ) {
    this.setLoading(true);
    try {
      if (type === "session")
        await this.repository.shareSession(id, targetId, role);
      if (type === "practice")
        await this.repository.sharePractice(id, targetId, role);
      if (type === "tactic")
        await this.repository.shareTactic(id, targetId, role);

      await this.loadData();
    } catch (err) {
      this.handleError(`Failed to share ${type}.`, err);
      this.setLoading(false);
    }
  }

  async revokeShare(
    type: "session" | "practice" | "tactic",
    id: number,
    targetId: number
  ) {
    this.setLoading(true);
    try {
      if (type === "session")
        await this.repository.revokeSessionShare(id, targetId);
      if (type === "practice")
        await this.repository.revokePracticeShare(id, targetId);
      if (type === "tactic")
        await this.repository.revokeTacticShare(id, targetId);

      await this.loadData();
    } catch (err) {
      this.handleError(`Failed to revoke ${type} share.`, err);
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

  /**
   * REPLACES the contents of the state arrays with fresh data from the API.
   * This guarantees no duplication occurs on re-fetch.
   */
  private resetAndPopulateState<T>(
    state: ItemsState<T>,
    data: CategorizedItems<T>
  ) {
    state.personal = data.personalItems || [];
    state.userShared = data.userSharedItems || [];
    state.groupShared = data.groupSharedItems || [];
  }

  private removeFromState<T extends { id: number }>(
    state: ItemsState<T>,
    id: number
  ) {
    state.personal = state.personal.filter((i) => i.id !== id);
    state.userShared = state.userShared.filter((i) => i.id !== id);
    state.groupShared = state.groupShared.filter((i) => i.id !== id);
  }

  private updateInState<T extends { id: number }>(
    state: ItemsState<T>,
    updatedItem: T
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
    name: string,
    description: string,
    steps: Step[]
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
        (step.cones && step.cones.length > 0)
    );

    if (!hasContent) {
      return "The session is empty. Please add at least one player, ball, or object to the pitch.";
    }

    return null;
  }

  validateCollectionInput(
    name: string,
    description: string,
    sessions: Session[],
    type: string
  ): string | null {
    if (!name?.trim()) return `${type} name is required.`;
    if (!description?.trim()) return `${type} description is required.`;

    if (!sessions || sessions.length === 0) {
      return `A ${type.toLowerCase()} must have at least one attached session.`;
    }

    return null;
  }
}
