import { useAtom } from "jotai";
import { useState } from "react";

import type { CreatePostParams, UpdatePostPayload } from "@/entities/post";
import { useCreatePostMutation, useDeletePostMutation, useUpdatePostMutation } from "@/entities/post/model/post.query";

import { isAddPostDialogOpenAtom, isEditPostDialogOpenAtom, newPostAtom } from "./edit-post.atoms";

export const useNewPostForm = () => {
  const [newPost, setNewPost] = useAtom(newPostAtom);
  const [isAddOpen, setIsAddOpen] = useAtom(isAddPostDialogOpenAtom);
  return { newPost, setNewPost, isAddOpen, setIsAddOpen } as const;
};

export const useEditPostDialog = () => {
  const [isEditOpen, setIsEditOpen] = useAtom(isEditPostDialogOpenAtom);
  return { isEditOpen, setIsEditOpen } as const;
};

export const usePostEditor = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const createMutation = useCreatePostMutation();
  const updateMutation = useUpdatePostMutation();
  const deleteMutation = useDeletePostMutation();

  const addPost = async (payload: CreatePostParams) => {
    setIsSubmitting(true);
    try {
      await createMutation.mutateAsync(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePost = async (payload: UpdatePostPayload) => {
    setIsSubmitting(true);
    try {
      await updateMutation.mutateAsync(payload);
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (id: number) => {
    setIsSubmitting(true);
    try {
      await deleteMutation.mutateAsync(id);
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addPost, updatePost, deletePost, isSubmitting };
};
