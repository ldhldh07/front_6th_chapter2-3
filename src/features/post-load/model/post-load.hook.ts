import { Post, postApi, usePosts } from "@/entities/post";
import { wrapWithLoading } from "@/shared/lib/with-loading";

import { getPostsWithAuthors } from "../api/post-load.api";

interface LoadPostsParams {
  searchQuery?: string;
  limit: number;
  skip: number;
}

interface BaseParams {
  limit: number;
  skip: number;
}

interface SearchParams extends BaseParams {
  query: string;
}

export const useLoadPost = () => {
  const { setPosts, setTotal, setIsLoading } = usePosts();

  const applyList = ({ posts, total }: { posts: Post[]; total: number }) => {
    setPosts(posts);
    setTotal(total);
  };

  const loadPosts = wrapWithLoading(setIsLoading, async ({ searchQuery, limit, skip }: LoadPostsParams) => {
    const query = searchQuery?.trim();
    const fetchList = query ? () => postApi.search(query) : () => getPostsWithAuthors({ limit, skip });
    const data = await fetchList();
    applyList(data);
  });

  const getPosts = wrapWithLoading(setIsLoading, async ({ limit, skip }: BaseParams) => {
    const data = await getPostsWithAuthors({ limit, skip });
    applyList(data);
  });

  const searchPosts = wrapWithLoading(setIsLoading, async ({ query }: SearchParams) => {
    const data = await postApi.search(query.trim());
    applyList(data);
  });

  return { loadPosts, getPosts, searchPosts } as const;
};
