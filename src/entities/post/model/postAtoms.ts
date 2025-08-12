import { atom } from "jotai"

export type User = { id: number; username: string; image?: string }

export type Post = {
  id: number
  title: string
  body?: string
  userId?: number
  tags?: string[]
  reactions?: { likes: number; dislikes: number }
  author?: User
}

export const postsAtom = atom<Post[]>([])
export const totalPostAtom = atom<number>(0)
export const isPostsLoadingAtom = atom<boolean>(false)

export const selectedPostAtom = atom<Post | null>(null)
