import { Plus, Search } from "lucide-react";
import { useCallback, useEffect, useState } from "react";

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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@shared/ui";
import { HighlightText } from "@shared/ui/highlight-text";

import { postApi, usePosts } from "@entities/post";
import type { Post } from "@entities/post";

import { PostsTableWidget } from "@widgets/post-table";

import { CommentList, commentApi, useComments } from "@/entities/comment";
import type { Comment } from "@/entities/comment";
import {
  CommentAddDialogContainer,
  CommentEditDialogContainer,
  useCommentEditor,
  useEditCommentDialog,
  useNewCommentForm,
} from "@/features/edit-comment";
import {
  PostAddDialogContainer,
  PostEditDialogContainer,
  useEditPostDialog,
  useNewPostForm,
  usePostEditor,
} from "@/features/edit-post";
import { usePostFilter } from "@/features/filter-post";
import { getPostsByTagWithAuthors, getPostsWithAuthors } from "@/features/load-posts";

const PostsManager = () => {
  const { posts, total, isLoading, selectedPost, setPosts, setTotal, setIsLoading, setSelectedPost } = usePosts();
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
  const { comments, setComments, setSelectedComment } = useComments();
  const { deletePost } = usePostEditor();
  const { setIsAddOpen: setIsAddPostOpen } = useNewPostForm();
  const { setIsEditOpen: setIsEditPostOpen } = useEditPostDialog();
  const { deleteComment, likeComment } = useCommentEditor();
  const [showPostDetailDialog, setShowPostDetailDialog] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const { setNewComment, setIsAddOpen: setIsAddCommentOpen } = useNewCommentForm();
  const { setIsEditOpen: setIsEditCommentOpen } = useEditCommentDialog();
  const [selectedUser, setSelectedUser] = useState(null);

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
  const fetchPostsByTag = async (tag) => {
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

  // 댓글 삭제
  const handleDeleteComment = async (id: number, postId: number) => {
    try {
      await deleteComment(id, postId);
      setComments((prev) => ({ ...prev, [postId]: prev[postId].filter((c) => c.id !== id) }));
    } catch (error) {
      console.error("댓글 삭제 오류:", error);
    }
  };

  // 댓글 좋아요
  const handleLikeComment = async (id: number, postId: number) => {
    try {
      await likeComment(id, postId);
    } catch (error) {
      console.error("댓글 좋아요 오류:", error);
    }
  };

  // 게시물 상세 보기
  const openPostDetail = (post) => {
    setSelectedPost(post);
    fetchComments(post.id);
    setShowPostDetailDialog(true);
  };

  // 사용자 모달 열기
  const openUserModal = async (user) => {
    try {
      const response = await fetch(`/api/users/${user.id}`);
      const userData = await response.json();
      setSelectedUser(userData);
      setShowUserModal(true);
    } catch (error) {
      console.error("사용자 정보 가져오기 오류:", error);
    }
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

  const handleEditComment = useCallback(
    (newComment: Comment) => {
      setSelectedComment(newComment);
      setIsEditCommentOpen(true);
    },
    [setSelectedComment, setIsEditCommentOpen],
  );

  // 댓글 렌더링
  const renderComments = (postId) => (
    <div className="mt-2">
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-semibold">댓글</h3>
        <Button
          size="sm"
          onClick={() => {
            setNewComment((prev) => ({ ...prev, postId }));
            setIsAddCommentOpen(true);
          }}
        >
          <Plus className="w-3 h-3 mr-1" />
          댓글 추가
        </Button>
      </div>
      <CommentList
        comments={comments[postId]}
        searchQuery={searchQuery}
        onLike={(id) => selectedPost && handleLikeComment(id, selectedPost.id)}
        onEdit={handleEditComment}
        onDelete={(id) => selectedPost && handleDeleteComment(id, selectedPost.id)}
      />
    </div>
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
            <Select value={sortBy} onValueChange={setSortBy}>
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
            <Select value={sortOrder} onValueChange={setSortOrder}>
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
              onClickTag={(tag) => {
                setSelectedTag(tag);
                updateURL();
              }}
              onOpenUser={openUserModal}
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
      <Dialog open={showPostDetailDialog} onOpenChange={setShowPostDetailDialog}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              <HighlightText segments={splitByHighlight(selectedPost?.title ?? "", searchQuery)} />
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>
              <HighlightText segments={splitByHighlight(selectedPost?.body ?? "", searchQuery)} />
            </p>
            {renderComments(selectedPost?.id)}
          </div>
        </DialogContent>
      </Dialog>

      {/* 사용자 모달 */}
      <Dialog open={showUserModal} onOpenChange={setShowUserModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>사용자 정보</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <img src={selectedUser?.image} alt={selectedUser?.username} className="w-24 h-24 rounded-full mx-auto" />
            <h3 className="text-xl font-semibold text-center">{selectedUser?.username}</h3>
            <div className="space-y-2">
              <p>
                <strong>이름:</strong> {selectedUser?.firstName} {selectedUser?.lastName}
              </p>
              <p>
                <strong>나이:</strong> {selectedUser?.age}
              </p>
              <p>
                <strong>이메일:</strong> {selectedUser?.email}
              </p>
              <p>
                <strong>전화번호:</strong> {selectedUser?.phone}
              </p>
              <p>
                <strong>주소:</strong> {selectedUser?.address?.address}, {selectedUser?.address?.city},{" "}
                {selectedUser?.address?.state}
              </p>
              <p>
                <strong>직장:</strong> {selectedUser?.company?.name} - {selectedUser?.company?.title}
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </Card>
  );
};

export default PostsManager;
