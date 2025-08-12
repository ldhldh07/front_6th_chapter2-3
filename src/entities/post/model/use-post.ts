import { useAtom } from "jotai";

import { isPostsLoadingAtom, postsAtom, selectedPostAtom, totalPostAtom } from "./post-atoms";

import type { Post } from "./types";

export const usePost = () => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [total, setTotal] = useAtom(totalPostAtom);
  const [isLoading, setIsLoading] = useAtom(isPostsLoadingAtom);
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);

  const appendPost = (newPost: Post) => setPosts((prevPosts) => [newPost, ...prevPosts]);
  const changePost = (newPost: Post) =>
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
    changePost,
    removePost,
  };
};
