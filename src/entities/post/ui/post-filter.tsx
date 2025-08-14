import { Search } from "lucide-react";
import { ChangeEventHandler } from "react";

import { Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui";

import { Tag } from "../model/post.types";

interface PostFilterProps {
  searchQuery: string;
  onChange: ChangeEventHandler<HTMLInputElement>;
  onEnter?: () => void;
  tags: Tag[];
  selectedTag: string;
  onChangeTag: (value: string) => void;
  sortBy: string;
  onChangeSortBy: (value: string) => void;
  sortOrder: string;
  onChangeSortOrder: (value: string) => void;
}

export function PostFilter({
  searchQuery,
  onChange,
  onEnter,
  tags,
  selectedTag,
  onChangeTag,
  sortBy,
  onChangeSortBy,
  sortOrder,
  onChangeSortOrder,
}: Readonly<PostFilterProps>) {
  return (
    <div className="flex gap-4">
      <div className="flex-1">
        <div className="relative">
          <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="게시물 검색..."
            className="pl-8"
            value={searchQuery}
            onChange={onChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") onEnter?.();
            }}
          />
        </div>
      </div>
      <Select value={selectedTag} onValueChange={onChangeTag}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="태그 선택" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">모든 태그</SelectItem>
          {tags.map((tag) => (
            <SelectItem key={tag.url} value={tag.slug}>
              {tag.slug}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onChangeSortBy}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 기준" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="id">ID</SelectItem>
          <SelectItem value="title">제목</SelectItem>
          <SelectItem value="reactions">반응</SelectItem>
        </SelectContent>
      </Select>
      <Select value={sortOrder} onValueChange={onChangeSortOrder}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="정렬 순서" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="asc">오름차순</SelectItem>
          <SelectItem value="desc">내림차순</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
