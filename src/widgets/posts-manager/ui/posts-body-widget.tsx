import { CardContent } from "@shared/ui";

import { usePosts } from "@/entities/post";
import { usePostFilter } from "@/features/post-filter";
import { PostFilterContainer } from "@/features/post-filter/ui/post-filter-container";
import { PostsTableContainer } from "@/features/post-load";
import { usePostsQuery } from "@/features/post-load/model/posts.query";
import { PostPagination } from "@/features/post-pagination/ui/post-pagination";

export function PostsBodyWidget() {
  const { skip, limit, selectedTag, searchQuery, setSkip, setLimit } = usePostFilter();
  const { total, isLoading } = usePosts();

  usePostsQuery({ limit, skip, tag: selectedTag, search: searchQuery });

  return (
    <CardContent>
      <div className="flex flex-col gap-4">
        <PostFilterContainer />
        {isLoading ? <div className="flex justify-center p-4">로딩 중...</div> : <PostsTableContainer />}
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
  );
}
