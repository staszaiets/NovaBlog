import { ReactNode } from 'react';

interface Metadata {
  title: string;
  description: string;
}

export async function generateMetadata(): Promise<Metadata> {
  return {
    title: 'title',
    description: 'description',
  };
}

interface RootLayoutProps {
  children: ReactNode;
}

export default async function RootLayout({ children }: RootLayoutProps) {
  return (
    <>
      <main>{children}</main>
    </>
  );
}
