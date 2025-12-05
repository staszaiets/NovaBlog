'use client';

import { createAsyncThunk } from '@reduxjs/toolkit';
import { collection, getDocs, query, where, addDoc, doc, updateDoc, Timestamp, writeBatch } from 'firebase/firestore';
import { db } from '@/src/lib/firebase';
import { Post, PostCreateInput, PostFirestore } from '@/src/types/post';

const postsCol = collection(db, 'posts');

export const fetchPosts = createAsyncThunk<Post[]>('posts/fetchAll', async () => {
  const snapshot = await getDocs(postsCol);
  const posts: Post[] = snapshot.docs.map((d) => {
    const data = d.data() as any;
    return {
      id: d.id,
      authorName: data.authorName,
      title: data.title,
      slug: data.slug,
      content: data.content,
      excerpt: data.excerpt,
      authorId: data.authorId ?? null,
      tags: data.tags ?? [],
      commentCount: data.commentCount ?? 0,
      createdAt: data.createdAt.toMillis(),
      updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
    };
  });
  return posts.sort((a, b) => b.createdAt - a.createdAt);
});

export const fetchPostBySlug = createAsyncThunk<Post | null, string>('posts/fetchBySlug', async (slug) => {
  const q = query(postsCol, where('slug', '==', slug));
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const docSnap = snapshot.docs[0];
  const data = docSnap.data() as any;
  const post: Post = {
    authorName: data.authorName,
    id: docSnap.id,
    title: data.title,
    slug: data.slug,
    content: data.content,
    excerpt: data.excerpt,
    authorId: data.authorId ?? null,
    tags: data.tags ?? [],
    commentCount: data.commentCount ?? 0,
    createdAt: data.createdAt.toMillis(),
    updatedAt: data.updatedAt ? data.updatedAt.toMillis() : null,
  };
  return post;
});

export const createPost = createAsyncThunk<Post, Omit<Post, 'id' | 'createdAt' | 'updatedAt'>>(
  'posts/create',
  async (payload) => {
    const now = Timestamp.now();
    const docRef = await addDoc(postsCol, {
      ...payload,
      createdAt: now,
      updatedAt: null,
      commentCount: 0,
    });
    return {
      ...payload,
      id: docRef.id,
      commentCount: 0,
      createdAt: now.toMillis(),
      updatedAt: null,
    };
  },
);

export const updatePost = createAsyncThunk<Post, { id: string; data: Partial<PostCreateInput> }>(
  'posts/update',
  async ({ id, data }) => {
    const docRef = doc(db, 'posts', id);
    const now = Timestamp.now();

    const updatePayload: Partial<PostFirestore> = {
      ...data,
      updatedAt: now,
    };

    await updateDoc(docRef, updatePayload);

    return {
      id,
      authorName: data.authorName ?? '',
      title: data.title ?? '',
      slug: data.slug ?? '',
      content: data.content ?? '',
      excerpt: data.excerpt ?? '',
      authorId: data.authorId ?? null,
      tags: data.tags ?? [],
      commentCount: data.commentCount ?? 0,
      createdAt: now.toMillis(),
      updatedAt: now.toMillis(),
    };
  },
);

export const deletePost = createAsyncThunk<string, string>('posts/delete', async (postId, { rejectWithValue }) => {
  try {
    const batch = writeBatch(db);

    const postRef = doc(db, 'posts', postId);
    batch.delete(postRef);

    const commentsQuery = query(collection(db, 'comments'), where('postId', '==', postId));
    const commentsSnapshot = await getDocs(commentsQuery);

    commentsSnapshot.forEach((commentDoc) => {
      batch.delete(commentDoc.ref);
    });

    await batch.commit();

    return postId;
  } catch (err: any) {
    console.error('Failed to delete post and comments', err);
    return rejectWithValue(err?.message || 'Не вдалося видалити пост');
  }
});
