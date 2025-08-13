import { atom } from "jotai";

import type { Comment, CommentsByPostId } from "./comment.types";

export const commentsAtom = atom<CommentsByPostId>({});
export const isCommentsLoadingAtom = atom<boolean>(false);
export const selectedCommentAtom = atom<Comment | null>(null);
