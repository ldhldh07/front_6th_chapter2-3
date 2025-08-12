import { User } from "@/entities/user";

export type Post = {
  id: number;
  title: string;
  body?: string;
  userId?: number;
  tags?: string[];
  reactions?: { likes: number; dislikes: number };
  author?: User;
};

export type Tag = { slug: string; url?: string };
