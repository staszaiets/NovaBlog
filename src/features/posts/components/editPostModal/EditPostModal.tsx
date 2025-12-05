'use client';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { useAppDispatch } from '@/src/hooks/redux';
import type { Post } from '@/src/types/post';
import { EditPostFormSchema, editPostFormSchema } from '../../postFormSchema';

import styles from './EditPostModal.module.scss';
import { updatePost } from '@/src/features/posts/postsThunks';

interface EditPostModalProps {
  post: Post;
  onClose: () => void;
}

export function EditPostModal({ post, onClose }: EditPostModalProps) {
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<EditPostFormSchema>({
    resolver: zodResolver(editPostFormSchema),
    defaultValues: {
      title: post.title,
      slug: post.slug,
      content: post.content,
      excerpt: post.excerpt,
      tags: post.tags.join(', '),
    },
  });

  const onSubmit = async (values: EditPostFormSchema) => {
    setSubmitError(null);
    console.log(values);

    try {
      const tagsArray =
        values.tags
          ?.split(',')
          .map((t) => t.trim())
          .filter(Boolean) ?? [];

      await dispatch(
        updatePost({
          id: post.id,
          data: {
            title: values.title,
            slug: values.slug,
            content: values.content,
            excerpt: values.excerpt || values.content.slice(0, 120),
            tags: tagsArray,
          },
        }),
      ).unwrap();

      onClose();
    } catch (err: any) {
      setSubmitError(err?.message || 'Не вдалося оновити пост');
    }
  };

  return (
    <div className={styles.editPostModal} onClick={onClose}>
      <div className={styles.editPostModal__content} onClick={(e) => e.stopPropagation()}>
        <button type='button' className={styles.editPostModal__close} onClick={onClose} aria-label='Закрити модалку'>
          ×
        </button>

        <h2 className={styles.editPostModal__title}>Редагувати пост</h2>

        <form onSubmit={handleSubmit(onSubmit)} className={styles.editPostModal__form}>
          <div className={styles.editPostModal__field}>
            <label className={styles.editPostModal__label}>
              Назва
              <input type='text' className={styles.editPostModal__input} {...register('title')} />
            </label>
            {errors.title && <p className={styles.editPostModal__error}>{errors.title.message}</p>}
          </div>

          <div className={styles.editPostModal__field}>
            <label className={styles.editPostModal__label}>
              Slug
              <input type='text' className={styles.editPostModal__input} {...register('slug')} />
            </label>
            {errors.slug && <p className={styles.editPostModal__error}>{errors.slug.message}</p>}
          </div>

          <div className={styles.editPostModal__field}>
            <label className={styles.editPostModal__label}>
              Короткий опис (excerpt)
              <textarea
                className={`${styles.editPostModal__input} ${styles.editPostModal__textarea}`}
                rows={2}
                {...register('excerpt')}
              />
            </label>
            {errors.excerpt && <p className={styles.editPostModal__error}>{errors.excerpt.message}</p>}
          </div>

          <div className={styles.editPostModal__field}>
            <label className={styles.editPostModal__label}>
              Контент
              <textarea
                className={`${styles.editPostModal__input} ${styles.editPostModal__textarea}`}
                rows={6}
                {...register('content')}
              />
            </label>
            {errors.content && <p className={styles.editPostModal__error}>{errors.content.message}</p>}
          </div>

          <div className={styles.editPostModal__field}>
            <label className={styles.editPostModal__label}>
              Теги (через кому)
              <input
                type='text'
                className={styles.editPostModal__input}
                placeholder='react, nextjs'
                {...register('tags')}
              />
            </label>
            {errors.tags && <p className={styles.editPostModal__error}>{errors.tags.message}</p>}
          </div>

          {submitError && (
            <p className={`${styles.editPostModal__error} ${styles['editPostModal__error--global']}`}>{submitError}</p>
          )}

          <div className={styles.editPostModal__actions}>
            <button type='button' className={styles.editPostModal__secondary} onClick={onClose}>
              Скасувати
            </button>
            <button type='submit' className={styles.editPostModal__submit} disabled={isSubmitting}>
              {isSubmitting ? 'Збереження...' : 'Зберегти зміни'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
