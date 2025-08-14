import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";

import type { Post } from "../model/post.types";

export interface PostEditDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  onChange: (next: Post) => void;
  onSubmit: () => Promise<void> | void;
}

export function PostEditDialog({ open, onOpenChange, post, onChange, onSubmit }: Readonly<PostEditDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>게시물 수정</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={post?.title || ""}
            onChange={(e) => post && onChange({ ...post, title: e.target.value })}
          />
          <Textarea
            rows={15}
            placeholder="내용"
            value={post?.body || ""}
            onChange={(e) => post && onChange({ ...post, body: (e.target as HTMLTextAreaElement).value })}
          />
          <Button onClick={() => void onSubmit()}>게시물 업데이트</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
