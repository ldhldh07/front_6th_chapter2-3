import { User } from "@/entities/user"
import { http } from "@/shared/api/client"

import { Post } from "../model/types"

export interface PostsParams {
  limit: number
  skip: number
}

export interface PostsResponse {
  posts: Post[]
  total: number
}

export const getPosts = ({ limit, skip }: PostsParams): Promise<PostsResponse> => {
  return http.get<PostsResponse>("/posts", { params: { limit, skip } })
}

type UserLite = Pick<User, "id" | "username" | "image">

interface getUserLiteResponse {
  users: UserLite[]
}

export async function getUsersData(): Promise<UserLite[]> {
  const data = await http.get<getUserLiteResponse>("/users", {
    params: { limit: 0, select: ["username", "image"] },
  })
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
