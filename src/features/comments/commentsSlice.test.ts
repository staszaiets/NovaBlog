import { commentsReducer, CommentsState } from './commentsSlice';
import { fetchCommentsByPost, addComment, deleteComment } from './commentsThunks';
import { Comment } from '@/src/types/comment';

jest.mock('@/src/lib/firebase', () => ({
  db: {},
}));

jest.mock('firebase/firestore', () => ({
  collection: jest.fn(),
  getDocs: jest.fn(),
  query: jest.fn(),
  where: jest.fn(),
  addDoc: jest.fn(),
  doc: jest.fn(),
  updateDoc: jest.fn(),
  deleteDoc: jest.fn(),
  Timestamp: {
    now: () => ({ toMillis: () => 1234567890 }),
  },
}));

const mockComment: Comment = {
  id: 'c1',
  postId: 'post-1',
  authorId: 'user-1',
  authorName: 'Test User',
  text: 'Test Comment',
  createdAt: 1234567890,
};

describe('commentsSlice', () => {
  const initialState: CommentsState = {
    byPostId: {},
    isLoadingByPostId: {},
    errorByPostId: {},
  };

  it('повинен обробляти початковий стан', () => {
    expect(commentsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchCommentsByPost', () => {
    it('pending: повинен ставити isLoading=true для конкретного postId', () => {
      const action = {
        type: fetchCommentsByPost.pending.type,
        meta: { arg: 'post-1' },
      };

      const state = commentsReducer(initialState, action);

      expect(state.isLoadingByPostId['post-1']).toBe(true);
      expect(state.errorByPostId['post-1']).toBeNull();
    });

    it('fulfilled: повинен записувати коментарі у byPostId', () => {
      const payload = { postId: 'post-1', comments: [mockComment] };
      const action = {
        type: fetchCommentsByPost.fulfilled.type,
        payload,
        meta: { arg: 'post-1' },
      };

      const state = commentsReducer(initialState, action);

      expect(state.isLoadingByPostId['post-1']).toBe(false);
      expect(state.byPostId['post-1']).toHaveLength(1);
      expect(state.byPostId['post-1'][0]).toEqual(mockComment);
    });

    it('rejected: повинен записувати помилку', () => {
      const errorMsg = 'Oops';
      const action = {
        type: fetchCommentsByPost.rejected.type,
        error: { message: errorMsg },
        meta: { arg: 'post-1' },
      };

      const state = commentsReducer(initialState, action);

      expect(state.isLoadingByPostId['post-1']).toBe(false);
      expect(state.errorByPostId['post-1']).toBe(errorMsg);
    });
  });

  describe('addComment', () => {
    it('fulfilled: повинен додавати коментар до існуючого списку', () => {
      const existingState: CommentsState = {
        ...initialState,
        byPostId: { 'post-1': [mockComment] },
      };

      const newComment = { ...mockComment, id: 'c2', text: 'New One' };
      const action = { type: addComment.fulfilled.type, payload: newComment };

      const state = commentsReducer(existingState, action);

      expect(state.byPostId['post-1']).toHaveLength(2);
      expect(state.byPostId['post-1'][1]).toEqual(newComment);
    });

    it('fulfilled: повинен створювати список, якщо це перший коментар', () => {
      const newComment = { ...mockComment, postId: 'post-2' };
      const action = { type: addComment.fulfilled.type, payload: newComment };

      const state = commentsReducer(initialState, action);

      expect(state.byPostId['post-2']).toBeDefined();
      expect(state.byPostId['post-2']).toHaveLength(1);
    });
  });

  describe('deleteComment', () => {
    it('fulfilled: повинен видаляти коментар зі списку', () => {
      const existingState: CommentsState = {
        ...initialState,
        byPostId: { 'post-1': [mockComment] },
      };

      const action = {
        type: deleteComment.fulfilled.type,
        payload: { postId: 'post-1', commentId: 'c1' },
      };

      const state = commentsReducer(existingState, action);

      expect(state.byPostId['post-1']).toHaveLength(0);
    });

    it('fulfilled: не повинен падати, якщо коментарів для цього посту ще не завантажено', () => {
      const action = {
        type: deleteComment.fulfilled.type,
        payload: { postId: 'unknown-post', commentId: 'c1' },
      };

      const state = commentsReducer(initialState, action);
      expect(state).toEqual(initialState);
    });
  });
});
