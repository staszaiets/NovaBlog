'use client';

import { useEffect, useState, FormEvent } from 'react';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { fetchCommentsByPost, addComment, deleteComment } from '@/src/features/comments/commentsThunks';
import styles from './CommentsSection.module.scss';

interface CommentsSectionProps {
  postId: string;
}

export const CommentsSection = ({ postId }: CommentsSectionProps) => {
  const dispatch = useAppDispatch();

  const comments = useAppSelector((state) => state.comments.byPostId[postId] || []);
  const isLoading = useAppSelector((state) => state.comments.isLoadingByPostId[postId]);

  const [authorName, setAuthorName] = useState('');
  const [text, setText] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (postId) {
      dispatch(fetchCommentsByPost(postId));
    }
  }, [dispatch, postId]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!text.trim() || !authorName.trim()) return;

    setIsSubmitting(true);
    try {
      await dispatch(
        addComment({
          postId,
          authorName,
          text,
        }),
      ).unwrap();

      setText('');
    } catch (err) {
      console.error('Failed to post comment:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = (commentId: string) => {
    if (confirm('Видалити цей коментар?')) {
      dispatch(deleteComment({ postId, commentId }));
    }
  };

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString('uk-UA', {
      day: 'numeric',
      month: 'long',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <section className={styles.commentsSection}>
      <h3 className={styles.commentsSection__title}>Коментарі ({comments.length})</h3>

      <div className={styles.commentsSection__list}>
        {isLoading && comments.length === 0 ? (
          <p>Завантаження коментарів...</p>
        ) : comments.length > 0 ? (
          comments.map((comment) => (
            <div key={comment.id} className={styles.commentItem}>
              <div className={styles.commentItem__header}>
                <span className={styles.commentItem__author}>{comment.authorName}</span>
                <span className={styles.commentItem__date}>{formatDate(comment.createdAt)}</span>
              </div>
              <p className={styles.commentItem__text}>{comment.text}</p>

              <button
                onClick={() => handleDelete(comment.id)}
                className={styles.commentItem__deleteBtn}
                title='Видалити'
              >
                &times;
              </button>
            </div>
          ))
        ) : (
          <p className={styles.commentsSection__empty}>Поки немає коментарів. Будьте першим!</p>
        )}
      </div>

      <form onSubmit={handleSubmit} className={styles.commentForm}>
        <h4 className={styles.commentForm__title}>Залишити коментар</h4>

        <div className={styles.commentForm__field}>
          <input
            type='text'
            placeholder="Ваше ім'я"
            value={authorName}
            onChange={(e) => setAuthorName(e.target.value)}
            className={styles.commentForm__input}
            required
          />
        </div>

        <div className={styles.commentForm__field}>
          <textarea
            placeholder='Напишіть щось цікаве...'
            value={text}
            onChange={(e) => setText(e.target.value)}
            className={styles.commentForm__textarea}
            required
            rows={3}
          />
        </div>

        <button
          type='submit'
          disabled={isSubmitting || !text.trim() || !authorName.trim()}
          className={styles.commentForm__submitBtn}
        >
          {isSubmitting ? 'Надсилаємо...' : 'Надіслати'}
        </button>
      </form>
    </section>
  );
};
