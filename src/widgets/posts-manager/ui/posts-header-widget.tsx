import { Plus } from "lucide-react";

import { Button, CardHeader, CardTitle } from "@shared/ui";

import { useNewPostForm } from "@/features/post-edit";

export function PostsHeaderWidget() {
  const { setIsAddOpen: setIsAddPostOpen } = useNewPostForm();

  return (
    <CardHeader>
      <CardTitle className="flex items-center justify-between">
        <span>게시물 관리자</span>
        <Button onClick={() => setIsAddPostOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          게시물 추가
        </Button>
      </CardTitle>
    </CardHeader>
  );
}

