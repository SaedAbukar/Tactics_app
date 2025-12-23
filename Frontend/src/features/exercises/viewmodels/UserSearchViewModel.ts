import { makeAutoObservable, runInAction } from "mobx";
import { UserSearchRepository } from "../repositories/UserSearchRepository";
import type { PublicUserResponse } from "../../../types/types"; // Changed from User

export class UserSearchViewModel {
  // 1. Updated property type to match PublicUserResponse DTO
  users: PublicUserResponse[] = [];
  searchTerm: string = "";
  currentPage: number = 0;
  hasNextPage: boolean = true;
  isLoading: boolean = false;

  private repository: UserSearchRepository;

  constructor(repository: UserSearchRepository) {
    this.repository = repository;
    makeAutoObservable(this);
  }

  async setSearchTerm(term: string) {
    runInAction(() => {
      this.searchTerm = term;
      this.users = [];
      this.currentPage = 0;
      this.hasNextPage = true;
    });

    // Automatically trigger the first load if there is a term
    if (term.trim().length > 0) {
      await this.loadNextPage();
    }
  }

  async loadNextPage() {
    if (this.isLoading || !this.hasNextPage || !this.searchTerm.trim()) return;

    runInAction(() => {
      this.isLoading = true;
    });

    try {
      const data = await this.repository.findUsers(
        this.searchTerm,
        this.currentPage
      );

      runInAction(() => {
        // Now strictly typed as PublicUserResponse[]
        this.users = [...this.users, ...data.content];
        this.hasNextPage = !data.last;
        this.currentPage++;
        this.isLoading = false;
      });
    } catch (error) {
      runInAction(() => {
        this.isLoading = false;
        console.error("User search failed:", error);
      });
    }
  }
}
