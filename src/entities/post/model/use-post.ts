import { useAtomValue, useSetAtom } from "jotai";

import { isPostsLoadingAtom, postsAtom, selectedPostAtom, totalPostAtom } from "./post-atoms";

import type { Post } from "./types";

export const usePost = () => {
  const posts = useAtomValue(postsAtom);
  const total = useAtomValue(totalPostAtom);
  const isLoading = useAtomValue(isPostsLoadingAtom);
  const selectedPost = useAtomValue(selectedPostAtom);

  const setPosts = useSetAtom(postsAtom);
  const setTotal = useSetAtom(totalPostAtom);
  const setIsLoading = useSetAtom(isPostsLoadingAtom);
  const setSelectedPost = useSetAtom(selectedPostAtom);

  const appendPost = (newPost: Post) => setPosts((prevPosts) => [newPost, ...prevPosts]);
  const updatePost = (newPost: Post) =>
    setPosts((prevPosts) => prevPosts.map((prevPost) => (prevPost.id === newPost.id ? newPost : prevPost)));
  const removePost = (postId: number) => setPosts((prev) => prev.filter((prevPost) => prevPost.id !== postId));

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
  };
};
