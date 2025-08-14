import { useAtom } from "jotai";
import { useState } from "react";

import { usePosts } from "@entities/post";

import { postApi, type CreatePostParams, type UpdatePostPayload } from "@/entities/post";

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
  const { posts, appendPost, changePost, removePost } = usePosts();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPost = async (payload: CreatePostParams) => {
    setIsSubmitting(true);
    try {
      const createdPost = await postApi.create(payload);
      appendPost(createdPost);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const updatePost = async (payload: UpdatePostPayload) => {
    setIsSubmitting(true);
    const prev = posts.find((post) => post.id === Number(payload.postId));
    try {
      const updated = await postApi.update(payload);
      changePost({
        ...updated,
        author: prev?.author,
      });
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  const deletePost = async (id: number) => {
    setIsSubmitting(true);
    try {
      await postApi.remove(id);
      removePost(id);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addPost, updatePost, deletePost, isSubmitting };
};
