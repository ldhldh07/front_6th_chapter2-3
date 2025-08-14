export const postsQueryKeys = {
  all: ["posts"] as const,
  list: (params: { limit: number; skip: number }) => ["posts", "list", params] as const,
  byTag: (tag: string) => ["posts", "tag", tag] as const,
  search: (query: string) => ["posts", "search", query] as const,
  detail: (id: number) => ["posts", "detail", id] as const,
  tags: ["posts", "tags"] as const,
} as const;

export type PostsListParams = { limit: number; skip: number };
