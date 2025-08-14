import { Plus } from "lucide-react";

import { Button, Card, CardContent, CardHeader, CardTitle } from "@shared/ui";

import { PostDetailDialog, usePosts } from "@entities/post";

import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/comment-edit";
import { PostAddDialogContainer, PostEditDialogContainer, useNewPostForm } from "@/features/post-edit";
import { usePostFilter } from "@/features/post-filter";
import { PostFilterContainer } from "@/features/post-filter/ui/post-filter-container";
import { PostsTableContainer } from "@/features/post-load";
import { PostPagination } from "@/features/post-pagination/ui/post-pagination";
import { UserDetailDialogContainer } from "@/features/user-load";

const PostsManager = () => {
  const {
    total,
    isLoading,
    selectedPost,
    isDetailOpen: isDetailPostOpen,
    setIsDetailOpen: setIsDetailPostOpen,
  } = usePosts();
  const { skip, limit, searchQuery, setSkip, setLimit } = usePostFilter();
  const { setIsAddOpen: setIsAddPostOpen } = useNewPostForm();

  return (
    <Card className="w-full max-w-6xl mx-auto">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span>게시물 관리자</span>
          <Button onClick={() => setIsAddPostOpen(true)}>
            <Plus className="w-4 h-4 mr-2" />
            게시물 추가
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col gap-4">
          {/* 검색 및 필터 컨트롤 */}
          <PostFilterContainer />

          {/* 게시물 테이블 */}
          {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostsTableContainer />}

          {/* 페이지네이션 */}
          <PostPagination
            total={total}
            skip={skip}
            limit={limit}
            onChangeLimit={(value) => setLimit(Number(value))}
            onPrev={() => setSkip(Math.max(0, skip - limit))}
            onNext={() => setSkip(skip + limit)}
          />
        </div>
      </CardContent>

      {/* 게시물 추가 대화상자 */}
      <PostAddDialogContainer />

      {/* 게시물 수정 대화상자 */}
      <PostEditDialogContainer />

      {/* 댓글 추가 대화상자 */}
      <CommentAddDialogContainer />

      {/* 댓글 수정 대화상자 */}
      <CommentEditDialogContainer />

      {/* 게시물 상세 보기 대화상자 */}
      <PostDetailDialog
        open={isDetailPostOpen}
        onOpenChange={setIsDetailPostOpen}
        post={selectedPost}
        searchQuery={searchQuery}
      />

      <UserDetailDialogContainer />
    </Card>
  );
};

export default PostsManager;
