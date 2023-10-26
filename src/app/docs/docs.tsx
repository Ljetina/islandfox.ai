'use client';

import { useTrackPage } from '@/hooks/useTrackPage';

import DocsMd from './docs.mdx';
import styles from './docs.module.css';

export function Docs() {
  useTrackPage();
  return (
    <section>
      <div
        className="flex flex-column items-center justify-center min-h-screen"
        style={{
          paddingTop: '140px',
        }}
      >
        <div
          //   className={`${styles.docsContainer} w-full max-w-2xl mx-auto overflow-hidden shadow-2xl rounded-lg`}
          className={`${styles.docsContainer}`}
          style={{ marginBottom: '150px' }}
        >
          <DocsMd />
        </div>
      </div>
    </section>
  );
}
