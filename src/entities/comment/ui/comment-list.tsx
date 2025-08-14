import { ThumbsUp, Edit2, Trash2 } from "lucide-react";

import type { Comment } from "@/entities/comment/model/comment.types";
import { splitByHighlight } from "@/shared/lib/split-by-highlight";
import { Button } from "@/shared/ui/button";
import { HighlightText } from "@/shared/ui/highlight-text";

export interface CommentListProps {
  comments: Comment[] | undefined;
  searchQuery: string;
  onLike: (id: number) => void;
  onEdit: (comment: Comment) => void;
  onDelete: (id: number) => void;
}

export function CommentList({ comments, searchQuery, onLike, onEdit, onDelete }: CommentListProps) {
  if (!comments || comments.length === 0) return null;

  return (
    <div className="space-y-1">
      {comments.map((comment) => (
        <div key={comment.id} className="flex items-center justify-between text-sm border-b pb-1">
          <div className="flex items-center space-x-2 overflow-hidden">
            <span className="font-medium truncate">{comment.user.username}:</span>
            <span className="truncate">
              <HighlightText segments={splitByHighlight(comment.body, searchQuery)} />
            </span>
          </div>
          <div className="flex items-center space-x-1">
            <Button variant="ghost" size="sm" onClick={() => onLike(comment.id)}>
              <ThumbsUp className="w-3 h-3" />
              <span className="ml-1 text-xs">{comment.likes}</span>
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(comment)}>
              <Edit2 className="w-3 h-3" />
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onDelete(comment.id)}>
              <Trash2 className="w-3 h-3" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  );
}
