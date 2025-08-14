import { postApi, type PostsParams } from "@/entities/post";
import { getUsersData } from "@/entities/user";

export async function getPostsWithAuthors(params: PostsParams) {
  const [{ posts, total }, users] = await Promise.all([postApi.get(params), getUsersData()]);
  const postsWithUsers = posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }));
  return { posts: postsWithUsers, total } as const;
}

export async function getPostsByTagWithAuthors(tag: string) {
  const [{ posts, total }, users] = await Promise.all([postApi.getByTag(tag), getUsersData()]);
  const postsWithUsers = posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }));
  return { posts: postsWithUsers, total } as const;
}
