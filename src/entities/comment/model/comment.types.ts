export interface CommentUser {
  id: number;
  username: string;
  fullName?: string;
  image?: string;
}

export interface Comment {
  id: number;
  postId: number;
  user: CommentUser;
  body: string;
  likes: number;
}

export type CommentsByPostId = Record<number, Comment[]>;
