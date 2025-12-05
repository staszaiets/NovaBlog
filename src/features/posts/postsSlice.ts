import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { fetchPosts, fetchPostBySlug, createPost, updatePost, deletePost } from './postsThunks';
import { Post } from '@/src/types/post';
import { deleteComment, addComment } from '@/src/features/comments/commentsThunks';

export interface PostsState {
  items: Post[];
  selectedPost: Post | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: PostsState = {
  items: [],
  selectedPost: null,
  isLoading: false,
  error: null,
};

const postsSlice = createSlice({
  name: 'posts',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action: PayloadAction<Post[]>) => {
        state.isLoading = false;
        state.items = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load posts';
      });

    builder
      .addCase(fetchPostBySlug.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchPostBySlug.fulfilled, (state, action: PayloadAction<Post | null>) => {
        state.isLoading = false;
        state.selectedPost = action.payload;
      })
      .addCase(fetchPostBySlug.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message || 'Failed to load post';
      });

    builder
      .addCase(createPost.fulfilled, (state, action: PayloadAction<Post>) => {
        state.items.unshift(action.payload);
      })
      .addCase(updatePost.fulfilled, (state, action: PayloadAction<Post>) => {
        const index = state.items.findIndex((p) => p.id === action.payload.id);
        if (index !== -1) state.items[index] = action.payload;
        if (state.selectedPost?.id === action.payload.id) {
          state.selectedPost = action.payload;
        }
      })
      .addCase(deletePost.fulfilled, (state, action: PayloadAction<string>) => {
        state.items = state.items.filter((p) => p.id !== action.payload);
        if (state.selectedPost?.id === action.payload) {
          state.selectedPost = null;
        }
      });

    builder.addCase(addComment.fulfilled, (state, action) => {
      const post = state.items.find((p) => p.id === action.payload.postId);
      if (post) {
        post.commentCount += 1;
      }
      if (state.selectedPost?.id === action.payload.postId) {
        state.selectedPost.commentCount += 1;
      }
    });

    builder.addCase(deleteComment.fulfilled, (state, action) => {
      const post = state.items.find((p) => p.id === action.payload.postId);
      if (post) {
        post.commentCount = Math.max(0, post.commentCount - 1);
      }
      if (state.selectedPost?.id === action.payload.postId) {
        state.selectedPost.commentCount = Math.max(0, state.selectedPost.commentCount - 1);
      }
    });
  },
});

export const postsReducer = postsSlice.reducer;
