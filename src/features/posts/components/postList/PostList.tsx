'use client';

import AuthorLogo from '@/public/images/author.svg';
import Remove from '@/public/images/remove.svg';
import Edit from '@/public/images/edit.svg';
import Chat from '@/public/images/bubble-chat.svg';
import cocos from '@/public/images/cocos.webp';
import styles from './PostList.module.scss';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { useAppDispatch, useAppSelector } from '@/src/hooks/redux';
import { deletePost, fetchPosts } from '../../postsThunks';
import Image, { StaticImageData } from 'next/image';

import type { Post } from '@/src/types/post';
import { EditPostModal } from '@/src/features/posts/components/editPostModal/EditPostModal';
import { PostFilters } from '@/src/features/posts/components/postFilters/PostFilters';

function PostList() {
  const dispatch = useAppDispatch();
  const { items, isLoading, error } = useAppSelector((state) => state.posts);

  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteError, setDeleteError] = useState<string | null>(null);

  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState<StaticImageData | null>(null);

  const [editingPost, setEditingPost] = useState<Post | null>(null);

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchPosts());
  }, [dispatch]);

  const availableTags = useMemo(() => {
    const allTags = items.flatMap((post) => post.tags || []);
    return Array.from(new Set(allTags)).sort();
  }, [items]);

  const filteredItems = useMemo(() => {
    return items.filter((post) => {
      const query = searchQuery.toLowerCase();
      const matchesSearch = post.title.toLowerCase().includes(query) || post.excerpt?.toLowerCase().includes(query);

      const matchesTag = selectedTag ? post.tags?.includes(selectedTag) : true;

      return matchesSearch && matchesTag;
    });
  }, [items, searchQuery, selectedTag]);

  if (isLoading && items.length === 0) {
    return <p>Завантаження постів...</p>;
  }

  if (error) {
    return <p>Помилка: {error}</p>;
  }

  const handleDelete = async (id: string) => {
    const confirmed = window.confirm('Ти впевнений, що хочеш видалити цей пост?');
    if (!confirmed) return;

    setDeleteError(null);
    setIsDeleting(true);

    try {
      await dispatch(deletePost(id)).unwrap();
    } catch (err: any) {
      setDeleteError(err?.message || 'Не вдалося видалити пост');
    } finally {
      setIsDeleting(false);
    }
  };

  const openImagePreview = (image: StaticImageData) => {
    setPreviewImage(image);
    setIsImageModalOpen(true);
  };

  const closeImagePreview = () => {
    setIsImageModalOpen(false);
    setPreviewImage(null);
  };

  const openEditModal = (post: Post) => {
    setEditingPost(post);
  };

  const closeEditModal = () => {
    setEditingPost(null);
  };

  if (isLoading && items.length === 0) return <p>Завантаження постів...</p>;
  if (error) return <p>Помилка: {error}</p>;

  return (
    <div>
      <h2>Пости</h2>

      {deleteError && <p className={styles.postList__error}>{deleteError}</p>}

      <PostFilters
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        selectedTag={selectedTag}
        onTagSelect={setSelectedTag}
        availableTags={availableTags}
      />

      {!isLoading && items.length > 0 && filteredItems.length === 0 && (
        <p style={{ textAlign: 'center', color: '#666', marginTop: '32px' }}>За вашим запитом нічого не знайдено.</p>
      )}

      {!isLoading && items.length === 0 && <p>Постів поки немає. Створи перший!</p>}

      <ul className={styles.postList}>
        {filteredItems.map((post) => (
          <li key={post.id} className={styles.post}>
            <div>
              <div className={styles.authorInfo}>
                <div>
                  <AuthorLogo />
                </div>
                <div className={styles.authorInfo__name}>{post.authorName || 'Анонім'}</div>
              </div>
            </div>

            <div className={styles.postPreview}>
              <Link href={`/blog/${post.slug}`} className={styles.postPreview__collumn}>
                <div>
                  <h2 className={styles.postPreview__title}>{post.title}</h2>
                  <p className={styles.postPreview__excerpt}>{post.excerpt}</p>

                  {post.tags && post.tags.length > 0 && (
                    <div className={styles.postPreview__tags}>
                      {post.tags.map((tag) => (
                        <span key={tag} className={styles.postPreview__tag}>
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className={styles.postPreview__comments}>
                  <Chat />
                  <span className={styles.postPreview__commentCount}>{post.commentCount}</span>
                </div>
              </Link>

              <div className={styles.postPreview__imageWrapper}>
                <button
                  type='button'
                  className={styles.postPreview__imageButton}
                  onClick={() => openImagePreview(cocos)}
                >
                  <Image src={cocos} alt='Post image' width={160} height={107} className={styles.postPreview__image} />
                </button>

                <div className={styles.postPreview__actions}>
                  <button
                    className={styles.postPreview__removeButton}
                    onClick={() => handleDelete(post.id)}
                    disabled={isDeleting}
                  >
                    <Remove />
                  </button>

                  {/* Тепер кнопка відкриває модалку редагування */}
                  <button
                    className={styles.postPreview__editButton}
                    onClick={() => openEditModal(post)}
                    disabled={isDeleting}
                  >
                    <Edit />
                  </button>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>

      {isImageModalOpen && previewImage && (
        <div className={styles.imageModal} onClick={closeImagePreview}>
          <div className={styles.imageModal__content} onClick={(e) => e.stopPropagation()}>
            <button
              type='button'
              className={styles.imageModal__close}
              onClick={closeImagePreview}
              aria-label='Закрити превʼю'
            >
              ×
            </button>

            <div className={styles.imageModal__imageWrapper}>
              <Image
                src={previewImage}
                alt='Перегляд зображення поста'
                fill
                className={styles.imageModal__image}
                sizes='(max-width: 768px) 100vw, 70vw'
              />
            </div>
          </div>
        </div>
      )}

      {editingPost && <EditPostModal post={editingPost} onClose={closeEditModal} />}
    </div>
  );
}

export default PostList;
