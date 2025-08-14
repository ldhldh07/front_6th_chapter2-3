import { useMutation, useQueryClient } from "@tanstack/react-query";

import { postsQueryKeys } from "./post.keys";
import { CreatePostParams, postApi, UpdatePostPayload } from "../api/posts.api";

import type { Post } from "./post.types";

export const postsSearchQuery = (query: string) => ({
  queryKey: postsQueryKeys.search(query),
  queryFn: () => postApi.search(query),
});

export function useCreatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: CreatePostParams) => postApi.create(payload),
    onMutate: async (payload) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: postsQueryKeys.all });
      const previousSnapshots = listQueries.map((q) => ({
        key: q.queryKey,
        data: q.state.data as { posts: Post[]; total: number } | undefined,
      }));

      const currentMaxId = listQueries.reduce((maxId, query) => {
        const snapshot = (query.state.data as { posts: Post[]; total: number } | undefined)?.posts ?? [];
        const localMax = snapshot.reduce((m, p) => (p.id > m ? p.id : m), 0);
        return localMax > maxId ? localMax : maxId;
      }, 0);
      const optimisticId = currentMaxId + 1;
      const optimisticPost: Post = {
        id: optimisticId,
        title: payload.title,
        body: payload.body,
        userId: payload.userId,
      };

      listQueries.forEach((q) => {
        const data = (q.state.data as { posts: Post[]; total: number } | undefined) ?? { posts: [], total: 0 };
        queryClient.setQueryData(q.queryKey, { posts: [optimisticPost, ...data.posts], total: (data.total ?? 0) + 1 });
      });

      return { previousSnapshots, optimisticId } as const;
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      context.previousSnapshots.forEach((s) => queryClient.setQueryData(s.key, s.data));
    },
    onSuccess: async (created, _variables, context) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: postsQueryKeys.all });
      listQueries.forEach((q) => {
        const data = (q.state.data as { posts: Post[]; total: number } | undefined) ?? { posts: [], total: 0 };
        const replaced = context
          ? data.posts.map((p: Post) => (p.id === context.optimisticId ? created : p))
          : [created, ...data.posts];
        queryClient.setQueryData(q.queryKey, { posts: replaced, total: data.total });
      });
      await queryClient.invalidateQueries({ queryKey: postsQueryKeys.all });
    },
  });
}

export function useUpdatePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdatePostPayload) => postApi.update(payload),
    onMutate: async (payload) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: postsQueryKeys.all });
      const previousSnapshots = listQueries.map((q) => ({
        key: q.queryKey,
        data: q.state.data as { posts: Post[]; total: number } | undefined,
      }));

      const id = Number(payload.postId);
      listQueries.forEach((q) => {
        const data = (q.state.data as { posts: Post[]; total: number } | undefined) ?? { posts: [], total: 0 };
        const replaced = data.posts.map((p: Post) => (p.id === id ? { ...p, ...payload.params } : p));
        queryClient.setQueryData(q.queryKey, { posts: replaced, total: data.total });
      });

      return { previousSnapshots } as const;
    },
    onError: (_err, _variables, context) => {
      if (!context) return;
      context.previousSnapshots.forEach((s) => queryClient.setQueryData(s.key, s.data));
    },
    onSuccess: async (updated) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: postsQueryKeys.all });
      listQueries.forEach((q) => {
        const data = (q.state.data as { posts: Post[]; total: number } | undefined) ?? { posts: [], total: 0 };
        const replaced = data.posts.map((p: Post) => (p.id === updated.id ? { ...p, ...updated } : p));
        queryClient.setQueryData(q.queryKey, { posts: replaced, total: data.total });
      });
      await queryClient.invalidateQueries({ queryKey: postsQueryKeys.all });
    },
  });
}

export function useDeletePostMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => postApi.remove(id),
    onMutate: async (id) => {
      const listQueries = queryClient.getQueryCache().findAll({ queryKey: postsQueryKeys.all });
      const previousSnapshots = listQueries.map((q) => ({
        key: q.queryKey,
        data: q.state.data as { posts: Post[]; total: number } | undefined,
      }));

      listQueries.forEach((q) => {
        const data = (q.state.data as { posts: Post[]; total: number } | undefined) ?? { posts: [], total: 0 };
        const filtered = data.posts.filter((p: Post) => p.id !== id);
        queryClient.setQueryData(q.queryKey, { posts: filtered, total: Math.max(0, (data.total ?? 0) - 1) });
      });

      return { previousSnapshots } as const;
    },
    onError: (_err, _variables, context) => {
      if (!context) return;
      context.previousSnapshots.forEach((s) => queryClient.setQueryData(s.key, s.data));
    },
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: postsQueryKeys.all });
    },
  });
}
