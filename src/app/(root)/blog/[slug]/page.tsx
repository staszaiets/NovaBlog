'use client';

import { useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { fetchPostBySlug } from '@/src/features/posts/postsThunks';

import styles from './styles.module.scss';
import { CommentsSection } from '@/src/features/comments/components/commentsSection/CommentsSection';
import { calculateReadingTime, formatDate } from '@/src/utils/textUtils';

export default function PostDetailsPage() {
  const { slug } = useParams<{ slug: string }>();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { selectedPost, isLoading } = useAppSelector((s) => s.posts);

  useEffect(() => {
    if (slug) {
      dispatch(fetchPostBySlug(slug));
    }
  }, [dispatch, slug]);

  const readingTime = useMemo(() => {
    return selectedPost ? calculateReadingTime(selectedPost.content) : '';
  }, [selectedPost]);

  const formattedDate = useMemo(() => {
    return selectedPost ? formatDate(selectedPost.createdAt) : '';
  }, [selectedPost]);

  if (isLoading && !selectedPost) {
    return (
      <div className={styles.postDetails__loading}>
        <p>Завантаження поста...</p>
      </div>
    );
  }

  if (!selectedPost) {
    return (
      <main className={styles.postDetails}>
        <div className={styles.postDetails__error}>
          <button className={styles.postDetails__backButton} onClick={() => router.back()}>
            ← Назад
          </button>
          <p>Пост не знайдено.</p>
        </div>
      </main>
    );
  }

  return (
    <div className={styles.postDetails}>
      <button
        className={styles.postDetails__backButton}
        onClick={() => router.back()}
        title='Повернутися до списку блогу'
      >
        ← Назад
      </button>

      <div className={styles.postDetails__imagePlaceholder}>
        <p>Головне зображення статті</p>
      </div>

      <div className={styles.postDetails__contentWrapper}>
        <header className={styles.postDetails__header}>
          <h1 className={styles.postDetails__title}>{selectedPost.title}</h1>
          <p className={styles.postDetails__excerpt}>{selectedPost.excerpt}</p>

          <div className={styles.postDetails__metadata}>
            <div className={styles.postDetails__authorInfo}>
              <div className={styles.postDetails__authorAvatar} title={selectedPost.authorName}></div>
              <span className={styles.postDetails__authorName}>
                {selectedPost.authorName ? selectedPost.authorName : 'Анонім'}
              </span>
            </div>
            <div className={styles.postDetails__dateTime}>
              <span>{readingTime}</span>
              <span>&middot;</span>
              <span>{formattedDate}</span>
            </div>
          </div>
        </header>

        <article className={styles.postDetails__contentBody}>
          <div dangerouslySetInnerHTML={{ __html: selectedPost.content }} />
        </article>

        {selectedPost && selectedPost.id && <CommentsSection postId={selectedPost.id} />}
      </div>
    </div>
  );
}
