import type { PostsParams, PostsResponse } from "@/entities/post";
import { postApi } from "@/entities/post";
import { postsQueryKeys } from "@/entities/post/model/post.query-keys";

import { postLoadApi } from "../api/post-load.api";

import type { QueryClient } from "@tanstack/react-query";

export const postsListQuery = (params: PostsParams) => ({
  queryKey: postsQueryKeys.list(params),
  queryFn: (): Promise<PostsResponse> => postLoadApi.getWithAuthors(params),
});

export const postsByTagQuery = (tag: string) => ({
  queryKey: postsQueryKeys.byTag(tag),
  queryFn: (): Promise<PostsResponse> => postLoadApi.getByTagWithAuthors(tag),
});

export const postsSearchQuery = (query: string) => ({
  queryKey: postsQueryKeys.search(query),
  queryFn: (): Promise<PostsResponse> => postApi.search(query),
});

export type BuildPostsQueryParams = {
  limit?: number;
  skip?: number;
  tag?: string;
  search?: string;
};

export const buildPostsQuery = (params: BuildPostsQueryParams) => {
  const search = params.search?.trim();
  if (search) return postsSearchQuery(search);
  if (params.tag) return postsByTagQuery(params.tag);
  if (typeof params.limit === "number" && typeof params.skip === "number") {
    return postsListQuery({ limit: params.limit, skip: params.skip });
  }
  return postsListQuery({ limit: 0, skip: 0 });
};

export const useGetPostList = (client: QueryClient, params: PostsParams) => client.fetchQuery(postsListQuery(params));

export const useGetPostsByTag = (client: QueryClient, tag: string) => client.fetchQuery(postsByTagQuery(tag));

export const useSearchPosts = (client: QueryClient, query: string) => client.fetchQuery(postsSearchQuery(query));
