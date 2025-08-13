import { http } from "@/shared/api/client";

import type { Comment } from "../model/comment.types";

export interface GetCommentsByPostIdResponse {
  comments: Comment[];
}

export function getCommentsByPostId(postId: number): Promise<GetCommentsByPostIdResponse> {
  return http.get<GetCommentsByPostIdResponse>(`/comments/post/${postId}`);
}
