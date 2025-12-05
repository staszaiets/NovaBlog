import styles from './styles.module.scss';
import Link from 'next/link';

export async function generateMetadata() {
  return {
    title: '404',
    description:
      "Page not found. The page you’re looking for isn't available. It was moved or deleted. Return to the homepage. Brochure. Find a dealer.",
  };
}

export default function NotFoundPage() {
  return (
    <div className='container'>
      <div className={styles.inner}>
        <div className={styles.content}>
          <h3 className={styles.title}>404</h3>
          <p className={styles.text}>Page not found</p>
          <p className={styles.subtext}>The page you’re looking for is not available.</p>
        </div>
        <div className={styles.buttonWrapper}>
          <Link href={'/'}>Back to home</Link>
        </div>
      </div>
    </div>
  );
}
