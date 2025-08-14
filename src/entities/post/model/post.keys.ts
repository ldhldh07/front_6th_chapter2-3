export const postsQueryKeys = {
  all: ["posts"] as const,
  list: (params: { limit: number; skip: number; sortBy?: string; order?: "asc" | "desc" }) =>
    ["posts", "list", params] as const,
  byTag: (tag: string, params?: { limit?: number; skip?: number; sortBy?: string; order?: "asc" | "desc" }) =>
    ["posts", "tag", tag, params] as const,
  search: (query: string, params?: { limit?: number; skip?: number; sortBy?: string; order?: "asc" | "desc" }) =>
    ["posts", "search", { q: query, ...params }] as const,
  detail: (id: number) => ["posts", "detail", id] as const,
  tags: ["posts", "tags"] as const,
} as const;

export type PostsListParams = { limit: number; skip: number; sortBy?: string; order?: "asc" | "desc" };
