import { useQuery } from "@tanstack/react-query";

import { postApi } from "@/entities/post";
import { postsQueryKeys } from "@/entities/post/model/post.keys";

export function useTagsQuery() {
  return useQuery({
    queryKey: postsQueryKeys.tags,
    queryFn: () => postApi.getTags(),
    staleTime: 5 * 60_000,
  });
}
