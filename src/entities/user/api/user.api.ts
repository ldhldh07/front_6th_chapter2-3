import { http } from "@/shared/api/client";

import { User } from "../model/user.types";

export type UserLite = Pick<User, "id" | "username" | "image">;

interface GetUserLiteResponse {
  users: UserLite[];
}

export const userApi = {
  async getProfile(): Promise<UserLite[]> {
    const data = await http.get<GetUserLiteResponse>("/users", {
      params: { limit: 0, select: ["username", "image"] },
    });
    return data.users;
  },
  async getById(id: number): Promise<User> {
    return http.get<User>(`/users/${id}`);
  },
} as const;
