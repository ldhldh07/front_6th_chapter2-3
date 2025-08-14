import { useQueryClient } from "@tanstack/react-query";
import { useCallback } from "react";

import { prefetchCommentsByPost } from "@/entities/comment/model/comment.query";
import { PostsTable, usePosts } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useEditPostDialog, usePostEditor } from "@/features/post-edit";
import type { SortOrder } from "@/features/post-filter";
import { usePostSearchParams } from "@/features/post-filter/model/filter-post.hook";
import { usePostsQuery } from "@/features/post-load/model/posts.query.ts";
import { useUserDetailModal } from "@/features/user-load";
import { splitByHighlight } from "@/shared/lib/split-by-highlight";

export function PostsTableContainer() {
  const { setSelectedPost, setIsDetailOpen } = usePosts();
  const { params, setParams } = usePostSearchParams();
  const selectedTag = params.tag ?? "";
  const searchQuery = params.search ?? "";
  const { data } = usePostsQuery({
    limit: params.limit,
    skip: params.skip,
    tag: params.tag,
    search: params.search,
    sortBy: params.sortBy,
    sortOrder: (params.sortOrder as SortOrder) ?? "asc",
  });
  const posts: Post[] = data?.posts ?? [];
  const { openById } = useUserDetailModal();
  const { setIsEditOpen } = useEditPostDialog();
  const { deletePost } = usePostEditor();
  const queryClient = useQueryClient();

  const handleClickTag = useCallback(
    (tag: string) => {
      if (tag === selectedTag) return;
      setParams({ tag, skip: 0 });
    },
    [selectedTag, setParams],
  );

  const handleOpenUser = useCallback(
    (user: Post["author"]) => {
      if (!user) return;
      void openById(user.id);
    },
    [openById],
  );

  const handleOpenDetail = useCallback(
    async (post: Post) => {
      setSelectedPost(post);
      await prefetchCommentsByPost(queryClient, post.id);
      setIsDetailOpen(true);
    },
    [queryClient, setIsDetailOpen, setSelectedPost],
  );

  const handleEditPost = useCallback(
    (post: Post) => {
      setSelectedPost(post);
      setIsEditOpen(true);
    },
    [setIsEditOpen, setSelectedPost],
  );

  return (
    <PostsTable
      posts={posts}
      selectedTag={selectedTag}
      makeTitleSegments={(title) => splitByHighlight(title, searchQuery)}
      onClickTag={handleClickTag}
      onOpenUser={handleOpenUser}
      onOpenDetail={handleOpenDetail}
      onEdit={handleEditPost}
      onDelete={deletePost}
    />
  );
}
