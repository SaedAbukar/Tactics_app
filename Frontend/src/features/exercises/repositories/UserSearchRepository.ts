import type { UserSlice } from "../../../types/types";
import type { UserSearchApi } from "../api/UserSearchApi";

export class UserSearchRepository {
  private readonly api: UserSearchApi;

  constructor(api: UserSearchApi) {
    this.api = api;
  }
  async findUsers(query: string, page: number): Promise<UserSlice> {
    return this.api.searchUsers(query, page, 20);
  }
}
