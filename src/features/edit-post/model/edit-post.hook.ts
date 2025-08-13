import { useState } from "react";

import { usePost } from "@entities/post";

import { createPost, type CreatePostParams } from "../api/create-post.api";
import { deletePostRequest } from "../api/delete-post.api";
import { updatePost as updatePostRequest, type UpdatePostPayload } from "../api/update-post.api";

export function usePostEditor() {
  const { posts, appendPost, changePost, removePost } = usePost();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addPost = async (payload: CreatePostParams) => {
    setIsSubmitting(true);
    try {
      const createdPost = await createPost(payload);
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
      const updated = await updatePostRequest(payload);
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
      await deletePostRequest(id);
      removePost(id);
    } catch (error) {
      if (error instanceof Error) throw error;
      throw new Error(String(error));
    } finally {
      setIsSubmitting(false);
    }
  };

  return { addPost, updatePost, deletePost, isSubmitting };
}
