import { ChangeEventHandler } from "react";

import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Textarea } from "@shared/ui/textarea";

export interface CommentAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  body: string;
  onChange: ChangeEventHandler<HTMLTextAreaElement> | undefined;
  onSubmit: () => Promise<void> | void;
}

export function CommentAddDialog({ open, onOpenChange, body, onChange, onSubmit }: Readonly<CommentAddDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 댓글 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Textarea placeholder="댓글 내용" value={body} onChange={onChange} />
          <Button onClick={onSubmit}>댓글 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
