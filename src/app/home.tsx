'use client';

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
import Image from 'next/image';

export function WebHome() {
  return (
    <>
      {/* @ts-ignore TODO */}
      <Layout mainCls="main-content fix" headTitle={'home'}>
        <Banner1 />
        <div className="row">
          <div style={{display: 'flex', flexDirection: 'row', width:'100%'}}>
            <Image alt='robot helping out a data nerd' src="/assets/img/images/home_1.jpeg" style={{width: '50%'}}/>
            <Image alt='desk robot on a desk' src="/assets/img/images/home_2.jpeg" style={{width: '50%'}}/>
          </div>
        </div>
      </Layout>
    </>
  );
}
