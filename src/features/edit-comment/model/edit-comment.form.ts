import { useAtom } from "jotai";

import {
  isAddCommentDialogOpenAtom,
  isEditCommentDialogOpenAtom,
  newCommentAtom,
  type NewCommentDraft,
} from "./edit-comment.atoms";

export function useNewCommentForm() {
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const [isAddOpen, setIsAddOpen] = useAtom(isAddCommentDialogOpenAtom);
  return { newComment, setNewComment, isAddOpen, setIsAddOpen } as const;
}

export function useEditCommentDialog() {
  const [isEditOpen, setIsEditOpen] = useAtom(isEditCommentDialogOpenAtom);
  return { isEditOpen, setIsEditOpen } as const;
}

export type { NewCommentDraft };
