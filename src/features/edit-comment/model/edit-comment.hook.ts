import { useAtom } from "jotai";
import { useState } from "react";

import { commentApi, useComments } from "@/entities/comment";
import type { CreateCommentPayload, UpdateCommentPayload } from "@/entities/comment";

import {
  isAddCommentDialogOpenAtom,
  isEditCommentDialogOpenAtom,
  newCommentAtom,
  type NewCommentDraft,
} from "./edit-comment.atoms";

export function useCommentEditor() {
  const { appendComment, changeComment, removeComment, comments } = useComments();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newComment, setNewComment] = useAtom(newCommentAtom);
  const [isAddOpen, setIsAddOpen] = useAtom(isAddCommentDialogOpenAtom);
  const [isEditOpen, setIsEditOpen] = useAtom(isEditCommentDialogOpenAtom);

  const addComment = async (payload: CreateCommentPayload) => {
    setIsSubmitting(true);
    try {
      const created = await commentApi.create(payload);
      appendComment(created);
      setNewComment({ body: "", postId: null, userId: newComment.userId });
      setIsAddOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updateComment = async (payload: UpdateCommentPayload) => {
    setIsSubmitting(true);
    try {
      const updated = await commentApi.update(payload);
      changeComment(updated);
      setIsEditOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deleteComment = async (id: number, postId: number) => {
    setIsSubmitting(true);
    try {
      await commentApi.remove(id);
      removeComment(id, postId);
      setIsEditOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  };

  const likeComment = async (id: number, postId: number) => {
    const currentLikes = comments[postId]?.find((comment) => comment.id === id)?.likes ?? 0;
    setIsSubmitting(true);
    try {
      const updated = await commentApi.like({ id, likes: currentLikes + 1 });
      changeComment(updated);
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
