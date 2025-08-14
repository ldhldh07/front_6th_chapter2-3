import { atom } from "jotai";

import type { Comment } from "./comment.types";

export const selectedCommentAtom = atom<Comment | null>(null);
