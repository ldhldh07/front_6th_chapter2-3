import { PostsTable, PostsTableProps } from "@/entities/post";

export function PostsTableWidget({
  posts,
  selectedTag,
  makeTitleSegments,
  onClickTag,
  onOpenUser,
  onOpenDetail,
  onEdit,
  onDelete,
}: Readonly<PostsTableProps>) {
  return (
    <PostsTable
      posts={posts}
      selectedTag={selectedTag}
      makeTitleSegments={makeTitleSegments}
      onClickTag={onClickTag}
      onOpenUser={(user) => onOpenUser?.(user)}
      onOpenDetail={onOpenDetail}
      onEdit={onEdit}
      onDelete={onDelete}
    />
  );
}
