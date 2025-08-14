import { PostEditDialog } from "@/entities/post";
import { usePosts } from "@/entities/post";

import { useEditPostDialog, usePostEditor } from "../model/edit-post.hook";

export function PostEditDialogContainer() {
  const { isEditOpen, setIsEditOpen } = useEditPostDialog();
  const { updatePost } = usePostEditor();
  const { selectedPost, setSelectedPost } = usePosts();

  const handleSubmit = async () => {
    if (!selectedPost) return;
    try {
      await updatePost({
        postId: String(selectedPost.id),
        params: { title: selectedPost.title ?? "", body: selectedPost.body ?? "" },
      });
    } finally {
      setIsEditOpen(false);
    }
  };

  return (
    <PostEditDialog
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      post={selectedPost}
      onChange={setSelectedPost}
      onSubmit={handleSubmit}
    />
  );
}
