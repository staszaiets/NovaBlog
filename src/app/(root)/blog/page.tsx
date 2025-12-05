import { Suspense } from 'react';
import BlogClient from './BlogClient';

export default function BlogPage() {
  return (
    <Suspense fallback={<div>Завантаження блогу...</div>}>
      <BlogClient />
    </Suspense>
  );
}
