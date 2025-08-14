import { atom } from "jotai";

import { Post } from "./post.types";

export const selectedPostAtom = atom<Post | null>(null);
export const isPostDetailDialogOpenAtom = atom<boolean>(false);
