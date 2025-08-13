import { atom } from "jotai";

import { Post } from "./post.types";

export const postsAtom = atom<Post[]>([]);
export const totalPostAtom = atom<number>(0);
export const isPostsLoadingAtom = atom<boolean>(false);

export const selectedPostAtom = atom<Post | null>(null);
