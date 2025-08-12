import { http } from "@shared/api/client";

import type { Post } from "@entities/post";

export type CreatePostParams = {
  title: string;
  body?: string;
  userId: number;
};

export async function createPost(payload: CreatePostParams): Promise<Post> {
  return http.post<Post>("/posts/add", payload);
}
