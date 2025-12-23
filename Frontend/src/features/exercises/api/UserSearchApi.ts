import type { UserSlice } from "../../../types/types";

type RequestFn = <T>(url: string, options?: RequestInit) => Promise<T>;

export class UserSearchApi {
  private readonly request: RequestFn;

  constructor(request: RequestFn) {
    this.request = request;
  }

  async searchUsers(
    query: string,
    page: number,
    size: number
  ): Promise<UserSlice> {
    // TypeScript now knows that data.content is an array of PublicUserResponse
    return this.request<UserSlice>(
      `/api/users/search?query=${encodeURIComponent(
        query
      )}&page=${page}&size=${size}`
    );
  }
}
