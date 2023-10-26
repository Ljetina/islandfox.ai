'use client';

import Image from 'next/image';

import { useTrackPage } from '@/hooks/useTrackPage';

import Layout from '@/components/layout/Layout';
import Banner1 from '@/components/sections/Banner1';

import './globals.css';
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

export function WebHome() {
  useTrackPage();
  return (
    <>
      {/* @ts-ignore TODO */}
      <Layout mainCls="main-content fix" headTitle={'home'}>
        <Banner1 />
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <div id="first-image">
            <Image
              fill
              alt="robot working together"
              src="/assets/img/images/home_1.jpeg"
            />
          </div>
          <div id="second-image">
            <Image fill alt="desk robot" src="/assets/img/images/home_2.jpeg" />
          </div>
        </div>
      </Layout>
    </>
  );
}
