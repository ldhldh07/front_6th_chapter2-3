import { Button } from "@shared/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { Input } from "@shared/ui/input";
import { Textarea } from "@shared/ui/textarea";

export interface PostAddDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  value: { title: string; body: string; userId: number };
  onChange: (next: { title: string; body: string; userId: number }) => void;
  onSubmit: () => Promise<void> | void;
}

export function PostAddDialog({ open, onOpenChange, value, onChange, onSubmit }: Readonly<PostAddDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>새 게시물 추가</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <Input
            placeholder="제목"
            value={value.title}
            onChange={(e) => onChange({ ...value, title: e.target.value })}
          />
          <Textarea
            rows={30}
            placeholder="내용"
            value={value.body}
            onChange={(e) => onChange({ ...value, body: (e.target as HTMLTextAreaElement).value })}
          />
          <Input
            type="number"
            placeholder="사용자 ID"
            value={value.userId}
            onChange={(e) => onChange({ ...value, userId: Number(e.target.value) })}
          />
          <Button onClick={() => void onSubmit()}>게시물 추가</Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
