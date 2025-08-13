import { atom } from "jotai";

export interface NewCommentDraft {
  body: string;
  postId: number | null;
  userId: number | null;
}

const defaultCommentDraft = { body: "", postId: null, userId: null };

export const newCommentAtom = atom<NewCommentDraft>(defaultCommentDraft);

export const isAddCommentDialogOpenAtom = atom<boolean>(false);
export const isEditCommentDialogOpenAtom = atom<boolean>(false);
