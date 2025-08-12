import { User } from "@/entities/user"

import { Post } from "../model/types"

export interface PostsParams {
  limit: number
  skip: number
}

export interface PostsResponse {
  posts: Post[]
  total: number
}

export const getPosts = async ({ limit, skip }: PostsParams): Promise<PostsResponse> => {
  const response = await fetch(`/api/posts?limit=${limit}&skip=${skip}`)
  if (!response.ok) throw new Error()
  return response.json()
}

export interface getUserNameImageByUserIdParams {
  userId: number
}

export async function getUsersData(): Promise<Pick<User, "id" | "username" | "image">[]> {
  const response = await fetch("/api/users?limit=0&select=username,image")
  if (!response.ok) throw new Error()
  const data = await response.json()
  return data.users
}

export async function getPostsWithAuthors(params: PostsParams): Promise<PostsResponse> {
  const [{ posts, total }, users] = await Promise.all([getPosts(params), getUsersData()])
  const postsWithUsers: Post[] = posts.map((post) => ({
    ...post,
    author: users.find((user) => user.id === post.userId),
  }))
  return { posts: postsWithUsers, total }
}
