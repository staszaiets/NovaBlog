import { redirect } from 'next/navigation';

export async function generateMetadata() {
  return {
    title: 'Home Page',
    description: 'Welcome to the Home Page',
  };
}

export default async function HomePage() {
  redirect('/blog');
}
