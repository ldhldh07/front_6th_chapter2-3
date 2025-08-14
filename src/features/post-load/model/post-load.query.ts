import type { PostsParams, PostsResponse } from "@/entities/post";
import { postsQueryKeys } from "@/entities/post/model/post.keys";

import { postLoadApi } from "../api/post-load.api";

import type { QueryClient } from "@tanstack/react-query";

export const postsListQuery = (params: PostsParams) => ({
  queryKey: postsQueryKeys.list({
    limit: params.limit,
    skip: params.skip,
    sortBy: params.sortBy,
    order: params.order,
  }),
  queryFn: (): Promise<PostsResponse> => postLoadApi.getWithAuthors(params),
});

export const postsByTagQuery = (tag: string, params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">) => ({
  queryKey: postsQueryKeys.byTag(tag, params),
  queryFn: (): Promise<PostsResponse> => postLoadApi.getByTagWithAuthors(tag, params),
});

export const postsSearchQuery = (query: string, params?: Pick<PostsParams, "limit" | "skip" | "sortBy" | "order">) => ({
  queryKey: postsQueryKeys.search(query, params),
  queryFn: (): Promise<PostsResponse> => postLoadApi.searchWithAuthors(query, params),
});

export type BuildPostsQueryParams = {
  limit?: number;
  skip?: number;
  tag?: string;
  search?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
};

export const buildPostsQuery = (params: BuildPostsQueryParams) => {
  const search = params.search?.trim();
  const normalizedSortBy = params.sortBy && params.sortBy !== "none" ? params.sortBy : undefined;
  const sortParams = normalizedSortBy ? { sortBy: normalizedSortBy, order: params.sortOrder } : undefined;
  if (search) return postsSearchQuery(search, { ...sortParams, limit: params.limit ?? 0, skip: params.skip ?? 0 });
  if (params.tag)
    return postsByTagQuery(params.tag, { ...sortParams, limit: params.limit ?? 0, skip: params.skip ?? 0 });
  if (typeof params.limit === "number" && typeof params.skip === "number") {
    return postsListQuery({
      limit: params.limit,
      skip: params.skip,
      sortBy: normalizedSortBy,
      order: params.sortOrder,
    });
  }
  return postsListQuery({ limit: 0, skip: 0, sortBy: normalizedSortBy, order: params.sortOrder });
};

export const useGetPostList = (client: QueryClient, params: PostsParams) => client.fetchQuery(postsListQuery(params));

export const useGetPostsByTag = (client: QueryClient, tag: string) => client.fetchQuery(postsByTagQuery(tag));

export const useSearchPosts = (client: QueryClient, query: string) => client.fetchQuery(postsSearchQuery(query));
