import { getUsersData } from "@/entities/user";
import { http } from "@/shared/api/client";

import { Post } from "../model/types";

export interface PostsParams {
  limit: number;
  skip: number;
}

export interface PostsResponse {
  posts: Post[];
  total: number;
}

export const getPosts = ({ limit, skip }: PostsParams): Promise<PostsResponse> => {
  return http.get<PostsResponse>("/posts", { params: { limit, skip } });
};

export async function getPostsWithAuthors(params: PostsParams): Promise<PostsResponse> {
  const [{ posts, total }, users] = await Promise.all([getPosts(params), getUsersData()]);
  const postsWithUsers: Post[] = posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }));
  return { posts: postsWithUsers, total };
}
