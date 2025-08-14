import { useAtom } from "jotai";

import { selectedCommentAtom } from "./comment.atom";

export const useComments = () => {
  const [selectedComment, setSelectedComment] = useAtom(selectedCommentAtom);

  return {
    selectedComment,
    setSelectedComment,
  };
};
