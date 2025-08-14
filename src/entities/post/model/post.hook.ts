import { useAtom } from "jotai";

import { isPostDetailDialogOpenAtom, selectedPostAtom } from "./post.atom";

export const usePosts = () => {
  const [selectedPost, setSelectedPost] = useAtom(selectedPostAtom);
  const [isDetailOpen, setIsDetailOpen] = useAtom(isPostDetailDialogOpenAtom);

  return {
    selectedPost,
    isDetailOpen,
    setSelectedPost,
    setIsDetailOpen,
  };
};
