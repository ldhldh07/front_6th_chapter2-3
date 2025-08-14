export const commentQueryKeys = {
  all: ["comments"] as const,
  byPost: (postId: number) => ["comments", postId] as const,
} as const;
