import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Comment } from '@/src/types/comment';
import { fetchCommentsByPost, addComment, deleteComment } from './commentsThunks';

export interface CommentsState {
  byPostId: Record<string, Comment[]>;
  isLoadingByPostId: Record<string, boolean>;
  errorByPostId: Record<string, string | null>;
}

const initialState: CommentsState = {
  byPostId: {},
  isLoadingByPostId: {},
  errorByPostId: {},
};

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCommentsByPost.pending, (state, action) => {
        const postId = action.meta.arg;
        state.isLoadingByPostId[postId] = true;
        state.errorByPostId[postId] = null;
      })
      .addCase(
        fetchCommentsByPost.fulfilled,
        (state, action: PayloadAction<{ postId: string; comments: Comment[] }>) => {
          const { postId, comments } = action.payload;
          state.isLoadingByPostId[postId] = false;
          state.byPostId[postId] = comments;
        },
      )
      .addCase(fetchCommentsByPost.rejected, (state, action) => {
        const postId = action.meta.arg;
        state.isLoadingByPostId[postId] = false;
        state.errorByPostId[postId] = action.error.message || 'Failed to load comments';
      })
      .addCase(addComment.fulfilled, (state, action: PayloadAction<Comment>) => {
        const c = action.payload;
        if (!state.byPostId[c.postId]) state.byPostId[c.postId] = [];
        state.byPostId[c.postId].push(c);
      })
      .addCase(deleteComment.fulfilled, (state, action: PayloadAction<{ postId: string; commentId: string }>) => {
        const { postId, commentId } = action.payload;
        if (!state.byPostId[postId]) return;
        state.byPostId[postId] = state.byPostId[postId].filter((c) => c.id !== commentId);
      });
  },
});

export const commentsReducer = commentsSlice.reducer;
