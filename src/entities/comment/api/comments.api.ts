import type { Comment } from "@/entities/comment/model/comment.types";
import { http } from "@/shared/api/client";

export const commentApi = {
  get(postId: number): Promise<GetCommentsByPostIdResponse> {
    return http.get<GetCommentsByPostIdResponse>(`/comments/post/${postId}`);
  },
  create({ body, postId, userId }: CreateCommentPayload): Promise<Comment> {
    return http.post<Comment>("/comments/add", { body, postId, userId });
  },
  update(payload: UpdateCommentPayload): Promise<Comment> {
    const { id, body } = payload;
    return http.put<Comment>(`/comments/${id}`, { body });
  },
  remove(id: number): Promise<void> {
    return http.delete<void>(`/comments/${id}`);
  },
  like({ id, likes }: LikeCommentPayload): Promise<Comment> {
    return http.patch<Comment>(`/comments/${id}`, { likes });
  },
} as const;

export interface GetCommentsByPostIdResponse {
  comments: Comment[];
}
export interface CreateCommentPayload {
  body: string;
  postId: number;
  userId: number;
}

export interface UpdateCommentPayload {
  id: number;
  body: string;
}

export interface LikeCommentPayload {
  id: number;
  likes: number;
}
