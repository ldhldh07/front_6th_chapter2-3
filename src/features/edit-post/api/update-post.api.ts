import { http } from "@shared/api/client";

import type { Post } from "@entities/post";

export type UpdatePostPayload = {
  postId: string;
  params: {
    title: string;
    body: string;
  };
};

export async function updatePost({ postId, params }: UpdatePostPayload): Promise<Post> {
  return http.put<Post>(`/posts/${postId}`, params);
}
