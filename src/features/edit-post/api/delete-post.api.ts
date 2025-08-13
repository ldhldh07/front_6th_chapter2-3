import { http } from "@shared/api/client";

export async function deletePostRequest(id: number): Promise<void> {
  await http.delete<void>(`/posts/${id}`);
}
