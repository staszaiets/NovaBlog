'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  DocumentData,
  getDocs,
  orderBy,
  query,
  Timestamp,
  where,
  increment,
  updateDoc,
} from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import type { Comment, CommentCreateInput, CommentFirestore, CommentId } from '@/src/types/comment';
import type { PostId } from '@/src/types/post';

const commentsCol = collection(db, 'comments');

function mapCommentDocToComment(d: DocumentData, id: string): Comment {
  const data = d as CommentFirestore;
  return {
    id,
    postId: data.postId,
    authorId: data.authorId ?? null,
    authorName: data.authorName,
    text: data.text,
    createdAt: (data.createdAt as Timestamp).toMillis(),
  };
}

export const fetchCommentsByPost = createAsyncThunk<{ postId: PostId; comments: Comment[] }, PostId>(
  'comments/fetchByPost',
  async (postId) => {
    const q = query(commentsCol, where('postId', '==', postId), orderBy('createdAt', 'asc'));

    const snapshot = await getDocs(q);

    const comments: Comment[] = snapshot.docs.map((docSnap) => mapCommentDocToComment(docSnap.data(), docSnap.id));

    return { postId, comments };
  },
);

export const addComment = createAsyncThunk<Comment, CommentCreateInput>('comments/add', async (payload) => {
  const now = Timestamp.now();

  const docRef = await addDoc(commentsCol, {
    postId: payload.postId,
    authorName: payload.authorName,
    authorId: payload.authorId ?? null,
    text: payload.text,
    createdAt: now,
  } as CommentFirestore);

  const postRef = doc(db, 'posts', payload.postId);
  await updateDoc(postRef, {
    commentCount: increment(1),
  });

  const comment: Comment = {
    id: docRef.id,
    postId: payload.postId,
    authorName: payload.authorName,
    authorId: payload.authorId ?? null,
    text: payload.text,
    createdAt: now.toMillis(),
  };

  return comment;
});
export const deleteComment = createAsyncThunk<
  { postId: PostId; commentId: CommentId },
  { postId: PostId; commentId: CommentId }
>('comments/delete', async ({ postId, commentId }) => {
  const ref = doc(db, 'comments', commentId);
  await deleteDoc(ref);
  const postRef = doc(db, 'posts', postId);
  await updateDoc(postRef, {
    commentCount: increment(-1),
  });
  return { postId, commentId };
});
