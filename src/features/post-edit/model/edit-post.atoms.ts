import { atom } from "jotai";

export type NewPostDraft = { title: string; body: string; userId: number };

export const newPostAtom = atom<NewPostDraft>({ title: "", body: "", userId: 1 });
export const isAddPostDialogOpenAtom = atom<boolean>(false);
export const isEditPostDialogOpenAtom = atom<boolean>(false);
