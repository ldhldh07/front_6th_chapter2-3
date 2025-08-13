import { Edit2, MessageSquare, ThumbsDown, ThumbsUp, Trash2 } from "lucide-react";

import type { HighlightSegment } from "@shared/lib/split-by-highlight";
import { Table, Button, TableCell, TableRow, TableBody, TableHead, TableHeader } from "@shared/ui";
import {} from "@shared/ui";
import { HighlightText } from "@shared/ui/highlight-text";

import type { Post } from "../model/post.types";

type PostRowProps = {
  post: Post;
  titleSegments: HighlightSegment[];
  selectedTag?: string;
  onClickTag: (tag: string) => void;
  onOpenUser: (user: Post["author"]) => void;
  onOpenDetail: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
};

export function PostRow({
  post,
  titleSegments,
  selectedTag,
  onClickTag,
  onOpenUser,
  onOpenDetail,
  onEdit,
  onDelete,
}: PostRowProps) {
  return (
    <TableRow key={post.id}>
      <TableCell>{post.id}</TableCell>
      <TableCell>
        <div className="space-y-1">
          <div>
            <HighlightText segments={titleSegments} />
          </div>
          <div className="flex flex-wrap gap-1">
            {post.tags?.map((tag) => (
              <span
                key={tag}
                className={`px-1 text-[9px] font-semibold rounded-[4px] cursor-pointer ${
                  selectedTag === tag
                    ? "text-white bg-blue-500 hover:bg-blue-600"
                    : "text-blue-800 bg-blue-100 hover:bg-blue-200"
                }`}
                onClick={() => onClickTag(tag)}
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center space-x-2 cursor-pointer" onClick={() => onOpenUser(post.author)}>
          <img src={post.author?.image} alt={post.author?.username} className="w-8 h-8 rounded-full" />
          <span>{post.author?.username}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <ThumbsUp className="w-4 h-4" />
          <span>{post.reactions?.likes || 0}</span>
          <ThumbsDown className="w-4 h-4" />
          <span>{post.reactions?.dislikes || 0}</span>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={() => onOpenDetail(post)}>
            <MessageSquare className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onEdit(post)}>
            <Edit2 className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => onDelete(post.id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </TableCell>
    </TableRow>
  );
}

export interface PostsTableProps {
  posts: Post[];
  selectedTag?: string;
  makeTitleSegments: (title: string) => HighlightSegment[];
  onClickTag: (tag: string) => void;
  onOpenUser: (user: Post["author"]) => void;
  onOpenDetail: (post: Post) => void;
  onEdit: (post: Post) => void;
  onDelete: (id: number) => void;
}

export function PostsTable({
  posts,
  selectedTag,
  makeTitleSegments,
  onClickTag,
  onOpenUser,
  onOpenDetail,
  onEdit,
  onDelete,
}: Readonly<PostsTableProps>) {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead className="w-[50px]">ID</TableHead>
          <TableHead>제목</TableHead>
          <TableHead className="w-[150px]">작성자</TableHead>
          <TableHead className="w-[150px]">반응</TableHead>
          <TableHead className="w-[150px]">작업</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {posts.map((post) => (
          <PostRow
            key={post.id}
            post={post}
            titleSegments={makeTitleSegments(post.title)}
            selectedTag={selectedTag}
            onClickTag={onClickTag}
            onOpenUser={onOpenUser}
            onOpenDetail={onOpenDetail}
            onEdit={onEdit}
            onDelete={onDelete}
          />
        ))}
      </TableBody>
    </Table>
  );
}
