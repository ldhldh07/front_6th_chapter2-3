import { JSX } from "react";

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@shared/ui/dialog";
import { HighlightText } from "@shared/ui/highlight-text";

import { splitByHighlight } from "@/shared/lib/split-by-highlight";

import type { Post } from "../model/post.types";

export interface PostDetailDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  post: Post | null;
  searchQuery: string;
  renderComments: (postId: number) => JSX.Element;
}

export function PostDetailDialog({
  open,
  onOpenChange,
  post,
  searchQuery,
  renderComments,
}: Readonly<PostDetailDialogProps>) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>
            <HighlightText segments={splitByHighlight(post?.title ?? "", searchQuery) ?? []} />
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p>
            <HighlightText segments={splitByHighlight(post?.body ?? "", searchQuery) ?? []} />
          </p>
          {post?.id != null && renderComments(post.id)}
        </div>
      </DialogContent>
    </Dialog>
  );
}
