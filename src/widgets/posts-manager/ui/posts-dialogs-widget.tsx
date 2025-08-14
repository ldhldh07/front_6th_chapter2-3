import { PostDetailDialog, usePosts } from "@/entities/post";
import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/comment-edit";
import { PostAddDialogContainer, PostEditDialogContainer } from "@/features/post-edit";
import { usePostFilter } from "@/features/post-filter";
import { UserDetailDialogContainer } from "@/features/user-load";

export function PostsDialogsWidget() {
  const { selectedPost, isDetailOpen, setIsDetailOpen } = usePosts();
  const { searchQuery } = usePostFilter();

  return (
    <>
      <PostAddDialogContainer />
      <PostEditDialogContainer />
      <CommentAddDialogContainer />
      <CommentEditDialogContainer />

      <PostDetailDialog
        open={isDetailOpen}
        onOpenChange={setIsDetailOpen}
        post={selectedPost}
        searchQuery={searchQuery}
      />

      <UserDetailDialogContainer />
    </>
  );
}

