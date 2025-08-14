import { postApi, type PostsParams } from "@/entities/post";
import type { Post, PostsResponse } from "@/entities/post";
import { userApi } from "@/entities/user";

export const postLoadApi = {
  async getWithAuthors(params: PostsParams): Promise<PostsResponse> {
    const [{ posts, total }, users] = await Promise.all([postApi.get(params), userApi.getProfile()]);
    const postsWithUsers: Post[] = posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }));
    return { posts: sortPosts(postsWithUsers, params.sortBy, params.order), total };
  },
  async getByTagWithAuthors(
    tag: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">,
  ): Promise<PostsResponse> {
    const [{ posts, total }, users] = await Promise.all([postApi.getByTag(tag, params), userApi.getProfile()]);
    const postsWithUsers: Post[] = posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }));
    return { posts: sortPosts(postsWithUsers, params?.sortBy, params?.order), total };
  },
  async searchWithAuthors(
    query: string,
    params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">
  ): Promise<PostsResponse> {
    const [{ posts, total }, users] = await Promise.all([postApi.search(query, params), userApi.getProfile()]);
    const postsWithUsers: Post[] = posts.map((post) => ({
      ...post,
      author: users.find((user) => user.id === post.userId),
    }));
    return { posts: sortPosts(postsWithUsers, params?.sortBy, params?.order), total };
  },
} as const;

function sortPosts(posts: Post[], sortBy?: string, order: "asc" | "desc" = "asc"): Post[] {
  if (!sortBy || sortBy === "none") return posts;
  const dir = order === "desc" ? -1 : 1;
  const sorted = [...posts].sort((a, b) => {
    switch (sortBy) {
      case "id":
        return (a.id - b.id) * dir;
      case "title":
        return (a.title ?? "").localeCompare(b.title ?? "") * dir;
      case "userId":
        return ((a.userId ?? 0) - (b.userId ?? 0)) * dir;
      case "reactions": {
        const la = a.reactions?.likes ?? 0;
        const lb = b.reactions?.likes ?? 0;
        return (la - lb) * dir;
      }
      default:
        return 0;
    }
  });
  return sorted;
}
