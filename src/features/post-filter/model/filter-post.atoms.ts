import { atom } from "jotai";

import { Tag } from "@/entities/post/model/post.types";

export type SortBy = "none" | "id" | "title" | "reactions";
export type SortOrder = "asc" | "desc";

export const skipAtom = atom<number>(0);
export const limitAtom = atom<number>(10);
export const searchQueryAtom = atom<string>("");
export const sortByAtom = atom<SortBy>("none");
export const sortOrderAtom = atom<SortOrder>("asc");
export const tagsAtom = atom<Tag[]>([]);
export const selectedTagAtom = atom<string>("");
