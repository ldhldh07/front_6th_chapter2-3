import { CommentAddDialog } from "@/entities/comment";

import { useCommentEditor } from "../model/edit-comment.hook";

export function CommentAddDialogContainer() {
  const { newComment, setNewComment, isAddOpen, setIsAddOpen, addComment } = useCommentEditor();

  const handleSubmit = async () => {
    if (newComment.postId == null) return;
    await addComment({ body: newComment.body, postId: newComment.postId, userId: newComment.userId });
  };

  return (
    <CommentAddDialog
      open={isAddOpen}
      onOpenChange={setIsAddOpen}
      body={newComment.body}
      onChange={(e) => setNewComment((prev) => ({ ...prev, body: e.currentTarget.value }))}
      onSubmit={handleSubmit}
    />
  );
}
