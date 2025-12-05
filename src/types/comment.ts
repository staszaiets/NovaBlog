import type { Timestamp } from 'firebase/firestore';
import type { PostId } from './post';

export type CommentId = string;

export interface CommentBase {
  postId: PostId;
  authorId: string | null;
  authorName: string;
  text: string;
  createdAt: number;
}

export interface Comment extends CommentBase {
  id: CommentId;
}

export interface CommentFirestore extends Omit<CommentBase, 'createdAt'> {
  createdAt: Timestamp;
}

export interface CommentCreateInput {
  postId: PostId;
  text: string;
  authorName: string;
  authorId?: string | null;
}

export interface CommentUpdateInput {
  text?: string;
}

export interface CommentFormValues {
  authorName: string;
  text: string;
}
