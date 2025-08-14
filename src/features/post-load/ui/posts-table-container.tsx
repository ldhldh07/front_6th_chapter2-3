import { useCallback } from "react";

import { useComments, commentApi } from "@/entities/comment";
import { PostsTable, usePosts } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useEditPostDialog, usePostEditor } from "@/features/post-edit";
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
  });
  const posts: Post[] = data?.posts ?? [];
  const { openById } = useUserDetailModal();
  const { setIsEditOpen } = useEditPostDialog();
  const { deletePost } = usePostEditor();
  const { comments, setComments } = useComments();

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
      if (comments[post.id]) {
        setIsDetailOpen(true);
        return;
      }
      const { comments: selectedPostComments } = await commentApi.get(post.id);
      setComments((prev) => ({ ...prev, [post.id]: selectedPostComments }));
      setIsDetailOpen(true);
    },
    [comments, setComments, setIsDetailOpen, setSelectedPost],
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
