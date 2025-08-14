import { atom } from "jotai";

export interface NewCommentDraft {
  body: string;
  postId: number | null;
  userId: number;
}

const defaultCommentDraft: NewCommentDraft = { body: "", postId: null, userId: 1 };

export const newCommentAtom = atom<NewCommentDraft>(defaultCommentDraft);

export const isAddCommentDialogOpenAtom = atom<boolean>(false);
export const isEditCommentDialogOpenAtom = atom<boolean>(false);
