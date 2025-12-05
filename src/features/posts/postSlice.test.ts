import { postsReducer, PostsState } from './postsSlice';
import { fetchPosts, createPost, deletePost } from './postsThunks';
import { Post } from '@/src/types/post';

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
  writeBatch: jest.fn(),
  Timestamp: {
    now: () => ({ toMillis: () => 1234567890 }), // Фейковий час
  }
}));

const mockPost: Post = {
  id: '1',
  title: 'Test Post',
  content: 'Content',
  authorName: 'Author',
  slug: 'test-post',
  excerpt: 'excerpt',
  authorId: '123',
  tags: ['react'],
  commentCount: 0,
  createdAt: 1234567890,
  updatedAt: null,
};

describe('postsSlice', () => {
  const initialState: PostsState = {
    items: [],
    selectedPost: null,
    isLoading: false,
    error: null,
  };

  it('повинен обробляти початковий стан', () => {
    // @ts-ignore - передаємо undefined щоб перевірити дефолт
    expect(postsReducer(undefined, { type: 'unknown' })).toEqual(initialState);
  });

  describe('fetchPosts', () => {
    it('повинен встановлювати isLoading в true при pending', () => {
      const action = { type: fetchPosts.pending.type };
      const state = postsReducer(initialState, action);
      expect(state.isLoading).toBe(true);
      expect(state.error).toBeNull();
    });

    it('повинен заповнювати items при fulfilled', () => {
      const posts = [mockPost];
      const action = { type: fetchPosts.fulfilled.type, payload: posts };
      const state = postsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.items).toHaveLength(1);
      expect(state.items[0]).toEqual(mockPost);
    });

    it('повинен встановлювати error при rejected', () => {
      const errorMsg = 'Failed to fetch';
      const action = {
        type: fetchPosts.rejected.type,
        error: { message: errorMsg }
      };
      const state = postsReducer(initialState, action);

      expect(state.isLoading).toBe(false);
      expect(state.error).toBe(errorMsg);
    });
  });

  describe('createPost', () => {
    it('повинен додавати новий пост на початок списку', () => {
      const existingState: PostsState = {
        ...initialState,
        items: [{ ...mockPost, id: '2' }]
      };

      const newPost = { ...mockPost, id: '3', title: 'New Post' };
      const action = { type: createPost.fulfilled.type, payload: newPost };

      const state = postsReducer(existingState, action);

      expect(state.items).toHaveLength(2);
      expect(state.items[0]).toEqual(newPost);
    });
  });

  describe('deletePost', () => {
    it('повинен видаляти пост зі списку', () => {
      const existingState: PostsState = {
        ...initialState,
        items: [mockPost, { ...mockPost, id: '2' }]
      };

      const action = { type: deletePost.fulfilled.type, payload: '1' };
      const state = postsReducer(existingState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items.find(p => p.id === '1')).toBeUndefined();
    });

    it('повинен очищати selectedPost, якщо видалений пост був відкритий', () => {
      const existingState: PostsState = {
        ...initialState,
        items: [mockPost],
        selectedPost: mockPost
      };

      const action = { type: deletePost.fulfilled.type, payload: '1' };

      const state = postsReducer(existingState, action);

      expect(state.selectedPost).toBeNull();
    });
  });
});