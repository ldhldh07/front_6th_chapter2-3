import { Plus } from "lucide-react";
import { useEffect } from "react";

import {
  Button,
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@shared/ui";

import { postApi, PostDetailDialog, usePosts } from "@entities/post";

import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/comment-edit";
import { PostAddDialogContainer, PostEditDialogContainer, useNewPostForm } from "@/features/post-edit";
import { usePostFilter } from "@/features/post-filter";
import { PostFilterContainer } from "@/features/post-filter/ui/post-filter-container";
import { getPostsByTagWithAuthors, PostsTableContainer, getPostsWithAuthors } from "@/features/post-load";
import { UserDetailDialogContainer } from "@/features/user-load";

const PostsManager = () => {
  const {
    total,
    isLoading,
    selectedPost,
    setPosts,
    setTotal,
    setIsLoading,
    isDetailOpen: isDetailPostOpen,
    setIsDetailOpen: setIsDetailPostOpen,
  } = usePosts();
  const {
    skip,
    limit,
    searchQuery,
    sortBy,
    sortOrder,
    selectedTag,

    setSkip,
    setLimit,
    setTags,

    updateURL,
  } = usePostFilter();
  const { setIsAddOpen: setIsAddPostOpen } = useNewPostForm();

  const fetchPosts = async () => {
    setIsLoading(true);
    try {
      const { posts, total } = await getPostsWithAuthors({ limit, skip });
      setPosts(posts);
      setTotal(total);
    } catch (error) {
      console.error("게시물 가져오기 오류:", error);
    } finally {
      setIsLoading(false);
    }
  };

  // 태그 가져오기
  const fetchTags = async () => {
    try {
      const data = await postApi.getTags();
      setTags(data);
    } catch (error) {
      console.error("태그 가져오기 오류:", error);
    }
  };

  // 태그별 게시물 가져오기
  const fetchPostsByTag = async (tag: string) => {
    if (!tag || tag === "all") {
      fetchPosts();
      return;
    }
    setIsLoading(true);
    try {
      const { posts, total } = await getPostsByTagWithAuthors(tag);
      setPosts(posts);
      setTotal(total);
    } catch (error) {
      console.error("태그별 게시물 가져오기 오류:", error);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    fetchTags();
  }, []);

  useEffect(() => {
    if (selectedTag) {
      fetchPostsByTag(selectedTag);
    } else {
      fetchPosts();
    }
    updateURL();
  }, [skip, limit, sortBy, sortOrder, selectedTag]);
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
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-2">
              <span>표시</span>
              <Select value={limit.toString()} onValueChange={(value) => setLimit(Number(value))}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="20">20</SelectItem>
                  <SelectItem value="30">30</SelectItem>
                </SelectContent>
              </Select>
              <span>항목</span>
            </div>
            <div className="flex gap-2">
              <Button disabled={skip === 0} onClick={() => setSkip(Math.max(0, skip - limit))}>
                이전
              </Button>
              <Button disabled={skip + limit >= total} onClick={() => setSkip(skip + limit)}>
                다음
              </Button>
            </div>
          </div>
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
