import { atom } from "jotai";

import type { User } from "@/entities/user";

export const isUserDetailOpenAtom = atom<boolean>(false);
export const selectedUserAtom = atom<User | null>(null);
