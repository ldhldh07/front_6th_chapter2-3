import { useCallback } from "react";

import { useComments, commentApi } from "@/entities/comment";
import { PostsTable, usePosts } from "@/entities/post";
import type { Post } from "@/entities/post";
import { useEditPostDialog, usePostEditor } from "@/features/post-edit";
import { usePostFilter } from "@/features/post-filter";
import { useUserDetailModal } from "@/features/user-load";
import { splitByHighlight } from "@/shared/lib/split-by-highlight";

export function PostsTableContainer() {
  const { posts, setSelectedPost, setIsDetailOpen } = usePosts();
  const { selectedTag, searchQuery, setSelectedTag, updateURL } = usePostFilter();
  const { openById } = useUserDetailModal();
  const { setIsEditOpen } = useEditPostDialog();
  const { deletePost } = usePostEditor();
  const { comments, setComments } = useComments();

  const handleClickTag = useCallback(
    (tag: string) => {
      if (tag === selectedTag) return;
      setSelectedTag(tag);
      updateURL();
    },
    [selectedTag, setSelectedTag, updateURL],
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
