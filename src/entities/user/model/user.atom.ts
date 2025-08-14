import { atom } from "jotai";

export const currentUserIdAtom = atom<number | null>(null);

import type { User } from "./user.types";

export const selectedUserAtom = atom<User | null>(null);
export const isUserModalOpenAtom = atom<boolean>(false);
