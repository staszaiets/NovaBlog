import type { Timestamp } from 'firebase/firestore';

export type PostId = string;

export interface PostBase {
  authorName: string;
  title: string;
  slug: string;
  content: string;
  excerpt: string;
  authorId: string | null;
  tags: string[];
  commentCount: number;
  createdAt: number;
  updatedAt: number | null;
}

export interface Post extends PostBase {
  id: PostId;
}

export interface PostFirestore extends Omit<PostBase, 'createdAt' | 'updatedAt'> {
  createdAt: Timestamp;
  updatedAt: Timestamp | null;
}

export interface PostCreateInput {
  authorName?: string;
  title: string;
  slug: string;
  content: string;
  commentCount?: number;
  excerpt?: string;
  authorId?: string | null;
  tags?: string[];
}
