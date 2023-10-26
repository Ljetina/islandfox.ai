'use client';

import Layout from '@/components/layout/Layout';

import Content from './content.mdx';
import '/public/assets/css/animate.min.css';
import '/public/assets/css/animatedheadline.css';
import '/public/assets/css/bootstrap.min.css';
import '/public/assets/css/default.css';
import '/public/assets/css/fontawesome-all.min.css';
import '/public/assets/css/magnific-popup.css';
import '/public/assets/css/odometer.css';
import '/public/assets/css/responsive.css';
import '/public/assets/css/select2.min.css';
import '/public/assets/css/style.css';
import { useTrackPage } from '@/hooks/useTrackPage';

export default function Page() {
  useTrackPage();
  return (
    // @ts-ignore
    <Layout headTitle={'privacy poliy'}>
      <section
        className="pb-110"
        style={{
          paddingRight: '16px',
          paddingLeft: '16px',
          paddingTop: '150px',
        }}
      >
        <Content />
      </section>
    </Layout>
  );
}
