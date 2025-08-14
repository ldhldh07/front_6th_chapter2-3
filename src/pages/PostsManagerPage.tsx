import { Plus, Search } from "lucide-react";
import { useCallback, useEffect } from "react";

import { splitByHighlight } from "@shared/lib/split-by-highlight";
import {
  Button,
  Input,
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
import type { Post } from "@entities/post";

import { PostsTableWidget } from "@widgets/post-table";

import { commentApi, useComments } from "@/entities/comment";
import { CommentAddDialogContainer, CommentEditDialogContainer } from "@/features/edit-comment";
import {
  PostAddDialogContainer,
  PostEditDialogContainer,
  useEditPostDialog,
  useNewPostForm,
  usePostEditor,
} from "@/features/edit-post";
import { usePostFilter } from "@/features/filter-post";
import { getPostsByTagWithAuthors, getPostsWithAuthors } from "@/features/load-posts";
import { useUserDetailModal, UserDetailDialogContainer } from "@/features/user-detail-modal";

const PostsManager = () => {
  const {
    posts,
    total,
    isLoading,
    selectedPost,
    setPosts,
    setTotal,
    setIsLoading,
    setSelectedPost,
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
    tags,

    setSkip,
    setLimit,
    setSearchQuery,
    setSortBy,
    setSortOrder,
    setSelectedTag,
    setTags,

    updateURL,
  } = usePostFilter();
  const { comments, setComments } = useComments();
  const { deletePost } = usePostEditor();
  const { setIsAddOpen: setIsAddPostOpen } = useNewPostForm();
  const { setIsEditOpen: setIsEditPostOpen } = useEditPostDialog();
  const { openById: openUserModal } = useUserDetailModal();

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

  // 게시물 검색
  const searchPosts = async () => {
    if (!searchQuery) {
      fetchPosts();
      return;
    }
    setIsLoading(true);
    try {
      const { posts, total } = await postApi.search(searchQuery);
      setPosts(posts);
      setTotal(total);
    } catch (error) {
      console.error("게시물 검색 오류:", error);
    }
    setIsLoading(false);
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

  const fetchComments = async (postId: number) => {
    if (comments[postId]) return;
    try {
      const { comments } = await commentApi.get(postId);
      setComments((prev) => ({ ...prev, [postId]: comments }));
    } catch (error) {
      console.error("댓글 가져오기 오류:", error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post: Post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setIsDetailPostOpen(true);
  };

  const handleOpenUserModal = (user: { id: number } | undefined) => {
    if (!user) return;
    void openUserModal(user.id);
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

  const handleEditPost = useCallback(
    (newPost: Post) => {
      setSelectedPost(newPost);
      setIsEditPostOpen(true);
    },
    [setSelectedPost, setIsEditPostOpen],
  );

  const handleSelectTag = useCallback(
    (tag: string) => {
      {
        setSelectedTag(tag);
        updateURL();
      }
    },
    [setSelectedTag, updateURL],
  );

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
          <div className="flex gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="게시물 검색..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === "Enter" && searchPosts()}
                />
              </div>
            </div>
            <Select
              value={selectedTag}
              onValueChange={(value) => {
                setSelectedTag(value);
                fetchPostsByTag(value);
                updateURL();
              }}
            >
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
            <Select value={sortBy} onValueChange={(v) => setSortBy(v as "none" | "id" | "title" | "reactions")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 기준" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">없음</SelectItem>
                <SelectItem value="id">ID</SelectItem>
                <SelectItem value="title">제목</SelectItem>
                <SelectItem value="reactions">반응</SelectItem>
              </SelectContent>
            </Select>
            <Select value={sortOrder} onValueChange={(v) => setSortOrder(v as "asc" | "desc")}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="정렬 순서" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="asc">오름차순</SelectItem>
                <SelectItem value="desc">내림차순</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* 게시물 테이블 */}
          {isLoading ? (
            <div className="flex justify-center p-4">로딩 중...</div>
          ) : (
            <PostsTableWidget
              posts={posts}
              selectedTag={selectedTag}
              makeTitleSegments={(title) => splitByHighlight(title, searchQuery)}
              onClickTag={handleSelectTag}
              onOpenUser={handleOpenUserModal}
              onOpenDetail={openPostDetail}
              onEdit={handleEditPost}
              onDelete={deletePost}
            />
          )}

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
