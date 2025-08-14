import { PostDetailDialog, usePosts } from "@/entities/post";
import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/comment-edit";
import { PostAddDialogContainer, PostEditDialogContainer } from "@/features/post-edit";
import { usePostSearchParams } from "@/features/post-filter/model/filter-post.hook";
import { UserDetailDialogContainer } from "@/features/user-load";

export function PostsDialogsWidget() {
  const { selectedPost, isDetailOpen, setIsDetailOpen } = usePosts();
  const { params } = usePostSearchParams();

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
        searchQuery={params.search ?? ""}
      />

      <UserDetailDialogContainer />
    </>
  );
}
