import { useQueryClient } from "@tanstack/react-query";
import { useAtom } from "jotai";
import { useState } from "react";

import {
  useCreateCommentMutation,
  useUpdateCommentMutation,
  useDeleteCommentMutation,
  useLikeCommentMutation,
  useComments,
} from "@/entities/comment";
import type { CreateCommentPayload, UpdateCommentPayload, Comment } from "@/entities/comment";
import { commentQueryKeys } from "@/entities/comment/model/comment.keys";

import {
  isAddCommentDialogOpenAtom,
  isEditCommentDialogOpenAtom,
  newCommentAtom,
  type NewCommentDraft,
} from "./edit-comment.atoms";

export function useCommentEditor() {
  const queryClient = useQueryClient();
  const createMutation = useCreateCommentMutation();
  const deleteMutation = useDeleteCommentMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const [isAddOpen, setIsAddOpen] = useAtom(isAddCommentDialogOpenAtom);
  const [isEditOpen, setIsEditOpen] = useAtom(isEditCommentDialogOpenAtom);
  const updateMutation = useUpdateCommentMutation();
  const likeMutation = useLikeCommentMutation();
  const { selectedComment } = useComments();

  const addComment = async (payload: CreateCommentPayload) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(payload);
      setNewComment({ body: "", postId: null, userId: newComment.userId });
      setIsAddOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateComment = async (payload: UpdateCommentPayload) => {
    setIsSubmitting(true);
    try {
      const postId = selectedComment?.postId ?? 0;
      await updateMutation.mutateAsync({ postId, id: payload.id, body: payload.body });
      setIsEditOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (id: number, postId: number) => {
    setIsSubmitting(true);
    try {
      await deleteMutation.mutateAsync({ id, postId });
      setIsEditOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const likeComment = async (id: number, postId: number) => {
    const list = queryClient.getQueryData<Comment[]>(commentQueryKeys.byPost(postId)) ?? [];
    const currentLikes = list.find((c) => c.id === id)?.likes ?? 0;
    setIsSubmitting(true);
    try {
      await likeMutation.mutateAsync({ id, postId, likes: currentLikes + 1 });
    } finally {
      setIsSubmitting(false);
    }
  };

  const prepareNewComment = (postId: number, userId?: number) => {
    setNewComment((prev) => ({ ...prev, postId, userId: userId ?? prev.userId }));
    setIsAddOpen(true);
  };

  const resetDraft = () => setNewComment((prev) => ({ ...prev, body: "", postId: null }));

  return {
    addComment,
    updateComment,
    deleteComment,
    likeComment,
    isSubmitting,
    newComment,
    setNewComment,
    isAddOpen,
    setIsAddOpen,
    isEditOpen,
    setIsEditOpen,
    prepareNewComment,
    resetDraft,
  };
}

export function useNewCommentForm() {
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const [isAddOpen, setIsAddOpen] = useAtom(isAddCommentDialogOpenAtom);
  return { newComment, setNewComment, isAddOpen, setIsAddOpen } as const;
}

export function useEditCommentDialog() {
  const [isEditOpen, setIsEditOpen] = useAtom(isEditCommentDialogOpenAtom);
  return { isEditOpen, setIsEditOpen } as const;
}

export type { NewCommentDraft };
