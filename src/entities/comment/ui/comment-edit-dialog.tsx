import { ChangeEventHandler } from "react";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Textarea } from "@shared/ui/textarea";

import type { Comment } from "../model/comment.types";

export interface CommentEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  comment: Comment | null;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onSubmit: () => Promise<void> | void;
}

export function CommentEditDialog({
  open,
  onOpenChange,
  comment,
  onChange,
  onSubmit,
}: Readonly<CommentEditDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>댓글 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={comment?.body || ""} onChange={onChange} />
          <Button onClick={() => void onSubmit()}>댓글 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
