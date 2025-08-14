export type { Post, Tag } from "./model/post.types";

export type { CreatePostParams, UpdatePostPayload } from "./api/posts.api";
export type { PostsParams, PostsResponse } from "./api/posts.api";

export { usePosts } from "./model/post.hook";

export { postApi } from "./api/posts.api";

export { PostsTable } from "./ui/posts-table";
export type { PostsTableProps } from "./ui/posts-table";
