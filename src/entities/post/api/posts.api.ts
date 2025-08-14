import { http } from "@/shared/api/client";

import { Post } from "../model/post.types";

import type { Tag } from "../model/post.types";

export const postApi = {
  get({ limit, skip, sortBy, order }: PostsParams): Promise<PostsResponse> {
    return http.get<PostsResponse>("/posts", { params: { limit, skip, sortBy, order } });
  },
  create(payload: CreatePostParams): Promise<Post> {
    return http.post<Post>("/posts/add", payload);
  },
  update({ postId, params }: UpdatePostPayload): Promise<Post> {
    return http.put<Post>(`/posts/${postId}`, params);
  },
  remove(id: number): Promise<void> {
    return http.delete<void>(`/posts/${id}`);
  },
  async getByTag(
    tag: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    return http.get<PostsResponse>(`/posts/tag/${tag}`, { params });
  },
  async search(
    query: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    return http.get<PostsResponse>(`/posts/search`, { params: { q: query, ...params } });
  },
  async getTags(): Promise<Tag[]> {
    return http.get<Tag[]>(`/posts/tags`);
  },
} as const;

export type CreatePostParams = {
  title: string;
  body?: string;
  userId: number;
};

export type UpdatePostPayload = {
  postId: string;
  params: {
    title: string;
    body: string;
  };
};

export interface PostsParams {
  limit: number;
  skip: number;
  sortBy?: string;
  order?: "asc" | "desc";
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}
