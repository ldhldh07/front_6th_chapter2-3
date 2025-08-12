import { useAtomValue, useSetAtom } from "jotai"

import { isPostsLoadingAtom, postsAtom, selectedPostAtom, totalPostAtom, type Post } from "./postAtoms"

export const usePost = () => {
  const posts = useAtomValue(postsAtom)
  const total = useAtomValue(totalPostAtom)
  const isLoading = useAtomValue(isPostsLoadingAtom)
  const selectedPost = useAtomValue(selectedPostAtom)

  const setPosts = useSetAtom(postsAtom)
  const setTotal = useSetAtom(totalPostAtom)
  const setIsLoading = useSetAtom(isPostsLoadingAtom)
  const setSelectedPost = useSetAtom(selectedPostAtom)

  const appendPost = (newPost: Post) => setPosts((prevPosts) => [newPost, ...prevPosts])
  const updatePost = (newPost: Post) =>
    setPosts((prevPosts) => prevPosts.map((prevPost) => (prevPost.id === prevPost.id ? newPost : prevPost)))
  const removePost = (postId: number) => setPosts((prev) => prev.filter((prevPost) => prevPost.id !== postId))

  return {
    posts,
    total,
    isLoading,
    selectedPost,
    setPosts,
    setTotal,
    setIsLoading,
    setSelectedPost,
    appendPost,
    updatePost,
    removePost,
  }
}
