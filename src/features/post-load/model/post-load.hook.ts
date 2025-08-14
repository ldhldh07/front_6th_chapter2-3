import { useCallback } from "react";

import { Post, postApi, usePosts } from "@/entities/post";

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

  const applyList = useCallback(
    ({ posts, total }: { posts: Post[]; total: number }) => {
      setPosts(posts);
      setTotal(total);
    },
    [setPosts, setTotal],
  );

  const loadPosts = useCallback(
    async ({ searchQuery, limit, skip }: LoadPostsParams) => {
      setIsLoading(true);
      try {
        const query = searchQuery?.trim();
        const data = query ? await postApi.search(query) : await postLoadApi.getWithAuthors({ limit, skip });
        applyList(data);
      } finally {
        setIsLoading(false);
      }
    },
    [applyList, setIsLoading],
  );

  const getPosts = useCallback(
    async ({ limit, skip }: getPostsParams) => {
      setIsLoading(true);
      try {
        const data = await postLoadApi.getWithAuthors({ limit, skip });
        applyList(data);
      } finally {
        setIsLoading(false);
      }
    },
    [applyList, setIsLoading],
  );

  const getPostsByTag = useCallback(
    async (tag: string) => {
      setIsLoading(true);
      try {
        const data = await postLoadApi.getByTagWithAuthors(tag);
        applyList(data);
      } finally {
        setIsLoading(false);
      }
    },
    [applyList, setIsLoading],
  );

  const searchPosts = useCallback(
    async ({ query }: SearchParams) => {
      setIsLoading(true);
      try {
        const data = await postApi.search(query.trim());
        applyList(data);
      } finally {
        setIsLoading(false);
      }
    },
    [applyList, setIsLoading],
  );

  return { loadPosts, getPosts, getPostsByTag, searchPosts } as const;
};
