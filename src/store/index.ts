import { configureStore } from '@reduxjs/toolkit';
import { postsReducer } from '@/src/features/posts/postsSlice';
import { commentsReducer } from '@/src/features/comments/commentsSlice';
import { filtersReducer } from '@/src/features/filters/filtersSlice';

export const store = configureStore({
  reducer: {
    posts: postsReducer,
    comments: commentsReducer,
    filters: filtersReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
