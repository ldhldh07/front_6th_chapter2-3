import { http } from "@/shared/api/client";

import { User } from "../model/user.types";

type UserLite = Pick<User, "id" | "username" | "image">;

interface getUserLiteResponse {
  users: UserLite[];
}

export async function getUsersData(): Promise<UserLite[]> {
  const data = await http.get<getUserLiteResponse>("/users", {
    params: { limit: 0, select: ["username", "image"] },
  });
  return data.users;
}
