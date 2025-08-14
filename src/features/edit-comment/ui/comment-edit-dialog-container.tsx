import { CommentEditDialog, useComments } from "@/entities/comment";

import { useCommentEditor } from "../model/edit-comment.hook";

export function CommentEditDialogContainer() {
  const { isEditOpen, setIsEditOpen, updateComment } = useCommentEditor();
  const { selectedComment, setSelectedComment } = useComments();

  const handleSubmit = async () => {
    if (!selectedComment) return;
    await updateComment({ id: selectedComment.id, body: selectedComment.body });
  };

  return (
    <CommentEditDialog
      open={isEditOpen}
      onOpenChange={setIsEditOpen}
      comment={selectedComment}
      onChange={(e) => setSelectedComment((prev) => (prev ? { ...prev, body: e.currentTarget.value } : prev))}
      onSubmit={handleSubmit}
    />
  );
}
