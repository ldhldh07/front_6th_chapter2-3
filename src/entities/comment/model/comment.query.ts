import { useMutation, useQuery, useQueryClient, type QueryClient } from "@tanstack/react-query";

import { commentApi } from "@/entities/comment";

import { commentQueryKeys } from "./comment.keys";

import type { Comment } from "./comment.types";

export function useCommentsQuery(postId?: number) {
  return useQuery({
    enabled: !!postId,
    queryKey: postId ? commentQueryKeys.byPost(postId) : commentQueryKeys.all,
    queryFn: () => commentApi.get(postId as number).then((res) => res.comments),
    staleTime: 30_000,
  });
}

export const commentsByPostQuery = (postId: number) => ({
  queryKey: commentQueryKeys.byPost(postId),
  queryFn: () => commentApi.get(postId).then((res) => res.comments),
});

export const getCommentsFromCache = (client: QueryClient, postId: number): Comment[] => {
  return client.getQueryData<Comment[]>(commentQueryKeys.byPost(postId)) ?? [];
};

export const prefetchCommentsByPost = (client: QueryClient, postId: number) =>
  client.prefetchQuery(commentsByPostQuery(postId));

export const ensureCommentsByPost = (client: QueryClient, postId: number) =>
  client.ensureQueryData(commentsByPostQuery(postId));

export function useCreateCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.create,
    onMutate: async (payload) => {
      const key = commentQueryKeys.byPost(payload.postId);
      const prev = queryClient.getQueryData<Comment[]>(key);
      const optimistic = {
        id: Date.now(),
        body: payload.body,
        postId: payload.postId,
        likes: 0,
        user: { id: payload.userId, username: "you" },
      } satisfies Comment;
      queryClient.setQueryData<Comment[]>(key, [optimistic, ...(prev ?? [])]);
      return { key, prev, optimisticId: optimistic.id } as const;
    },
    onError: (_error, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData(context.key, context.prev);
    },
    onSuccess: (created, _variables, context) => {
      if (!context) return;
      const list = (queryClient.getQueryData<Comment[]>(context.key) ?? []).map((c) =>
        c.id === context.optimisticId ? created : c,
      );
      queryClient.setQueryData(context.key, list);
    },
  });
}

export interface UpdateCommentVariables {
  postId: number;
  id: number;
  body: string;
}

export function useUpdateCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (variables: UpdateCommentVariables) => commentApi.update({ id: variables.id, body: variables.body }),
    onMutate: async (variables) => {
      const key = commentQueryKeys.byPost(variables.postId);
      const prev = queryClient.getQueryData<Comment[]>(key);
      queryClient.setQueryData<Comment[]>(
        key,
        (prev ?? []).map((c) => (c.id === variables.id ? { ...c, body: variables.body } : c)),
      );
      return { key, prev } as const;
    },
    onError: (_error, _variables, context) => context && queryClient.setQueryData(context.key, context.prev),
    onSuccess: (updated, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Comment[]>(context.key, (prev) =>
        (prev ?? []).map((comment) => (comment.id === updated.id ? updated : comment)),
      );
    },
  });
}

export function useDeleteCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ id }: { id: number; postId: number }) => commentApi.remove(id),
    onMutate: async ({ id, postId }: { id: number; postId: number }) => {
      const key = commentQueryKeys.byPost(postId);
      const prev = queryClient.getQueryData<Comment[]>(key);
      queryClient.setQueryData<Comment[]>(
        key,
        (prev ?? []).filter((c) => c.id !== id),
      );
      return { key, prev } as const;
    },
    onError: (_error, _variables, context) => context && queryClient.setQueryData(context.key, context.prev),
  });
}

export function useLikeCommentMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: commentApi.like,
    onMutate: async ({ id, postId, likes }: { id: number; postId: number; likes: number }) => {
      const key = commentQueryKeys.byPost(postId);
      const prev = queryClient.getQueryData<Comment[]>(key);
      const previousLikes = (prev ?? []).find((c) => c.id === id)?.likes ?? 0;
      queryClient.setQueryData<Comment[]>(
        key,
        (prev ?? []).map((c) => (c.id === id ? { ...c, likes } : c)),
      );
      return { key, prev, id, optimisticLikes: likes, previousLikes } as const;
    },
    onError: (_error, _variables, context) => context && queryClient.setQueryData(context.key, context.prev),
    onSuccess: (updated, _variables, context) => {
      if (!context) return;
      queryClient.setQueryData<Comment[]>(context.key, (prev) =>
        (prev ?? []).map((c) =>
          c.id === updated.id
            ? { ...c, likes: Math.max(context.optimisticLikes, updated.likes ?? context.previousLikes) }
            : c,
        ),
      );
    },
  });
}
