import { useAtom } from "jotai";

import { commentsAtom, isCommentsLoadingAtom, selectedCommentAtom } from "./comment.atom";

import type { Comment } from "./comment.types";

export const useComments = () => {
  const [comments, setComments] = useAtom(commentsAtom);
  const [isLoading, setIsLoading] = useAtom(isCommentsLoadingAtom);
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);

  const setCommentsForPost = (postId: number, comments: Comment[]) => {
    setComments((prev) => ({ ...prev, [postId]: comments }));
  };

  const appendComment = (comment: Comment) => {
    setComments((prev) => ({
      ...prev,
      [comment.postId]: [...(prev[comment.postId] ?? []), comment],
    }));
  };

  const changeComment = (comment: Comment) => {
    setComments((prev) => ({
      ...prev,
      [comment.postId]: (prev[comment.postId] ?? []).map((c) => (c.id === comment.id ? comment : c)),
    }));
  };

  const removeComment = (commentId: number, postId: number) => {
    setComments((prev) => ({
      ...prev,
      [postId]: (prev[postId] ?? []).filter((c) => c.id !== commentId),
    }));
  };

  return {
    comments,
    isLoading,
    selectedComment,
    setComments,
    setCommentsForPost,
    setIsLoading,
    setSelectedComment,
    appendComment,
    changeComment,
    removeComment,
  };
};
