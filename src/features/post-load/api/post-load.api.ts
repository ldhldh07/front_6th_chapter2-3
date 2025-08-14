import { postApi, type PostsParams } from "@/entities/post";
import type { PostsResponse } from "@/entities/post";
import { userApi } from "@/entities/user";

export const postLoadApi = {
  async getWithAuthors(params: PostsParams): Promise<PostsResponse> {
    const [{ posts, total }, users] = await Promise.all([postApi.get(params), userApi.getProfile()]);
    const postsWithUsers = posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }));
    return { posts: postsWithUsers, total };
  },
  async getByTagWithAuthors(tag: string): Promise<PostsResponse> {
    const [{ posts, total }, users] = await Promise.all([postApi.getByTag(tag), userApi.getProfile()]);
    const postsWithUsers = posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }));
    return { posts: postsWithUsers, total };
  },
} as const;
