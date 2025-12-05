'use client';
import styles from './styles.module.scss';

import { PostForm } from '@/src/features/posts/components/postForm/PostForm';
import PostList from '@/src/features/posts/components/postList/PostList';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';
import { Modal } from '@/src/features/posts/components/modal/Modal';

const PlusIcon = () => (
  <svg viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
    <path d='M12 5V19M5 12H19' strokeLinecap='round' strokeLinejoin='round' />
  </svg>
);

export default function BlogPage() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const isCreateOpen = searchParams.get('create') === '1';

  const openCreateModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('create', '1');
    router.push(`${pathname}?${params.toString()}`);
  }, [router, pathname, searchParams]);

  const closeCreateModal = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString());
    params.delete('create');
    const queryString = params.toString();
    const url = queryString ? `${pathname}?${queryString}` : pathname;
    router.push(url);
  }, [router, pathname, searchParams]);

  return (
    <main className={styles.main}>
      <div className={styles.header}>
        <h1>Блог</h1>
        <button type='button' onClick={openCreateModal} className={styles.createButton}>
          <PlusIcon />
          <span>Створити пост</span>
        </button>
      </div>

      <section>
        <PostList />
      </section>

      <Modal isOpen={isCreateOpen} onClose={closeCreateModal} title='Новий пост'>
        <PostForm onSuccess={closeCreateModal} />
      </Modal>
    </main>
  );
}
