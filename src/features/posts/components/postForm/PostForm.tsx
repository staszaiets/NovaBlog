'use client';

import styles from './PostForm.module.scss';

import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { postFormSchema, PostFormSchema } from '../../postFormSchema';
import { createPost } from '../../postsThunks';
import { useAppDispatch } from '@/src/hooks/redux';

interface PostFormProps {
  onSuccess?: () => void;
}

export function PostForm({ onSuccess }: PostFormProps) {
  const dispatch = useAppDispatch();
  const [submitError, setSubmitError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<PostFormSchema>({
    resolver: zodResolver(postFormSchema),
    defaultValues: {
      authorName: '',
      title: '',
      slug: '',
      content: '',
      excerpt: '',
      tags: '',
    },
  });

  const onSubmit = async (values: PostFormSchema) => {
    setSubmitError(null);

    try {
      const tagsArray =
        values.tags
          ?.split(',')
          .map((t) => t.trim())
          .filter(Boolean) ?? [];

      await dispatch(
        createPost({
          authorName: values.authorName,
          title: values.title,
          slug: values.slug,
          content: values.content,
          excerpt: values.excerpt || values.content.slice(0, 120),
          authorId: null,
          commentCount: 0,
          tags: tagsArray,
        }),
      ).unwrap();

      onSuccess?.();
      reset();
    } catch (err: any) {
      setSubmitError(err?.message || 'Не вдалося створити пост');
    }
  };

  return (
    <form className={styles.postForm} onSubmit={handleSubmit(onSubmit)}>
      <div className={styles.postForm__field}>
        <label className={styles.postForm__label}>
          Ім&apos;я автора
          <input type='text' className={styles.postForm__input} {...register('authorName')} />
        </label>
        {errors.authorName && <p className={styles.postForm__error}>{errors.authorName.message}</p>}
      </div>

      <div className={styles.postForm__field}>
        <label className={styles.postForm__label}>
          Назва
          <input type='text' className={styles.postForm__input} {...register('title')} />
        </label>
        {errors.title && <p className={styles.postForm__error}>{errors.title.message}</p>}
      </div>

      <div className={styles.postForm__field}>
        <label className={styles.postForm__label}>
          Slug
          <input type='text' className={styles.postForm__input} {...register('slug')} />
        </label>
        {errors.slug && <p className={styles.postForm__error}>{errors.slug.message}</p>}
      </div>

      <div className={styles.postForm__field}>
        <label className={styles.postForm__label}>
          Короткий опис (excerpt)
          <textarea
            className={`${styles.postForm__input} ${styles.postForm__textarea}`}
            rows={2}
            {...register('excerpt')}
          />
        </label>
        {errors.excerpt && <p className={styles.postForm__error}>{errors.excerpt.message}</p>}
      </div>

      <div className={styles.postForm__field}>
        <label className={styles.postForm__label}>
          Контент
          <textarea
            className={`${styles.postForm__input} ${styles.postForm__textarea}`}
            rows={6}
            {...register('content')}
          />
        </label>
        {errors.content && <p className={styles.postForm__error}>{errors.content.message}</p>}
      </div>

      <div className={styles.postForm__field}>
        <label className={styles.postForm__label}>
          Теги (через кому)
          <input type='text' className={styles.postForm__input} placeholder='react, nextjs' {...register('tags')} />
        </label>
        {errors.tags && <p className={styles.postForm__error}>{errors.tags.message}</p>}
      </div>
      {submitError && <p className={`${styles.postForm__error} ${styles['postForm__error--global']}`}>{submitError}</p>}

      <div className={styles.postForm__actions}>
        <button type='submit' className={styles.postForm__submit} disabled={isSubmitting}>
          {isSubmitting ? 'Збереження...' : 'Створити'}
        </button>
      </div>
    </form>
  );
}
