import { useEffect } from "react";

import { Post, postApi, usePosts } from "@/entities/post";
import { wrapWithLoading } from "@/shared/lib/with-loading";

import { postLoadApi } from "../api/post-load.api";

interface LoadPostsParams {
  searchQuery?: string;
  limit: number;
  skip: number;
}

interface getPostsParams {
  limit: number;
  skip: number;
}

interface SearchParams extends getPostsParams {
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
    const fetchList = query ? () => postApi.search(query) : () => postLoadApi.getWithAuthors({ limit, skip });
    const data = await fetchList();
    applyList(data);
  });

  const getPosts = wrapWithLoading(setIsLoading, async ({ limit, skip }: getPostsParams) => {
    const data = await postLoadApi.getWithAuthors({ limit, skip });
    applyList(data);
  });

  const getPostsByTag = wrapWithLoading(setIsLoading, async (tag: string) => {
    const data = await postLoadApi.getByTagWithAuthors(tag);
    applyList(data);
  });

  const searchPosts = wrapWithLoading(setIsLoading, async ({ query }: SearchParams) => {
    const data = await postApi.search(query.trim());
    applyList(data);
  });

  return { loadPosts, getPosts, getPostsByTag, searchPosts } as const;
};

interface useSetFilterProps {
  skip: number;
  limit: number;
  selectedTag: string;
  loadTags: () => Promise<void> | void;
  updateURL: () => void;
  getPosts: (args: { limit: number; skip: number }) => Promise<void>;
  getPostsByTag: (tag: string) => Promise<void>;
}

export function useSetFilter({
  skip,
  limit,
  selectedTag,
  loadTags,
  updateURL,
  getPosts,
  getPostsByTag,
}: useSetFilterProps) {
  useEffect(() => {
    void loadTags();
  }, [loadTags]);

  useEffect(() => {
    if (selectedTag) {
      void getPostsByTag(selectedTag);
    } else {
      void getPosts({ limit, skip });
    }
    updateURL();
  }, [getPosts, getPostsByTag, limit, selectedTag, skip, updateURL]);
}
