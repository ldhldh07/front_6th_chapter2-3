import { PostAddDialog } from "@/entities/post";

import { useNewPostForm, usePostEditor } from "../model/edit-post.hook";

export function PostAddDialogContainer() {
  const { newPost, setNewPost, isAddOpen, setIsAddOpen } = useNewPostForm();
  const { addPost } = usePostEditor();

  const handleSubmit = async () => {
    try {
      await addPost(newPost);
    } finally {
      setIsAddOpen(false);
    }
    setNewPost({ title: "", body: "", userId: newPost.userId });
  };

  return (
    <PostAddDialog
      open={isAddOpen}
      onOpenChange={setIsAddOpen}
      value={newPost}
      onChange={setNewPost}
      onSubmit={handleSubmit}
    />
  );
}
