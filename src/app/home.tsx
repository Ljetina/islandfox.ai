'use client';

import Image from 'next/image';

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
  return (
    <>
      {/* @ts-ignore TODO */}
      <Layout mainCls="main-content fix" headTitle={'home'}>
        <Banner1 />
        <div style={{ flexDirection: 'row', display: 'flex' }}>
          <img id="first-image" src="/assets/img/images/home_1.jpeg" />
          <img id="second-image" src="/assets/img/images/home_2.jpeg" />
        </div>
      </Layout>
    </>
  );
}
