import { useAtom } from "jotai";

import {
  isPostDetailDialogOpenAtom,
  isPostsLoadingAtom,
  postsAtom,
  selectedPostAtom,
  totalPostAtom,
} from "./post.atom";

import type { Post } from "./post.types";

export const usePosts = () => {
  const [posts, setPosts] = useAtom(postsAtom);
  const [total, setTotal] = useAtom(totalPostAtom);
  const [isLoading, setIsLoading] = useAtom(isPostsLoadingAtom);
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [isDetailOpen, setIsDetailOpen] = useAtom(isPostDetailDialogOpenAtom);

  const appendPost = (newPost: Post) => setPosts((prevPosts) => [newPost, ...prevPosts]);
  const changePost = (newPost: Post) =>
    setPosts((prevPosts) => prevPosts.map((prevPost) => (prevPost.id === newPost.id ? newPost : prevPost)));
  const removePost = (postId: number) => setPosts((prev) => prev.filter((prevPost) => prevPost.id !== postId));

  return {
    posts,
    total,
    isLoading,
    selectedPost,
    isDetailOpen,
    setPosts,
    setTotal,
    setIsLoading,
    setSelectedPost,
    setIsDetailOpen,
    appendPost,
    changePost,
    removePost,
  };
};
