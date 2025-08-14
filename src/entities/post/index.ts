export type { Post, Tag } from "./model/post.types";

export type { CreatePostParams, UpdatePostPayload } from "./api/posts.api";
export type { PostsParams, PostsResponse } from "./api/posts.api";

export { usePosts } from "./model/post.hook";

export { postApi } from "./api/posts.api";

export { PostAddDialog } from "./ui/post-add-dialog";

export { PostEditDialog } from "./ui/post-edit-dialog";

export { PostDetailDialog } from "./ui/post-detail-dialog";

export { PostsTable } from "./ui/posts-table";
export type { PostsTableProps } from "./ui/posts-table";
