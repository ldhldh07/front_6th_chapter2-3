export { commentApi } from "./api/comments.api";
export type {
  GetCommentsByPostIdResponse,
  CreateCommentPayload,
  UpdateCommentPayload,
  LikeCommentPayload,
} from "./api/comments.api";

export { useComments } from "./model/comment.hook";

export type { CommentUser, Comment, CommentsByPostId } from "./model/comment.types";
export { CommentList } from "./ui/comment-list";
