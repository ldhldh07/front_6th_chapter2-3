import { useQuery } from "@tanstack/react-query";

import type { PostsResponse } from "@/entities/post";

import { buildPostsQuery, type BuildPostsQueryParams } from "./post-load.query";

export function usePostsQuery(params: BuildPostsQueryParams) {
  const query = useQuery<PostsResponse>({
    ...buildPostsQuery(params),
    staleTime: 30_000,
    gcTime: 5 * 60_000,
  });
  return query;
}
