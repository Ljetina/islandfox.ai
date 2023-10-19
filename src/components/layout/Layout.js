'use client';

import { useEffect, useState } from 'react';

// import BackToTop from '../elements/BackToTop'
import DataBg from '../elements/DataBg';
import Breadcrumb from './Breadcrumb';
import PageHead from './PageHead';
import Footer1 from './footer/Footer1';
import Header1 from './header/Header1';

export default function Layout({
  headTitle,
  breadcrumbTitle,
  children,
  mainCls,
}) {
  const [scroll, setScroll] = useState(0);
  // Mobile Menu
  const [isMobileMenu, setMobileMenu] = useState(false);
  const handleMobileMenu = () => {
    setMobileMenu(!isMobileMenu);
    !isMobileMenu
      ? document.body.classList.add('mobile-menu-visible')
      : document.body.classList.remove('mobile-menu-visible');
  };
  useEffect(() => {
    document.addEventListener('scroll', () => {
      const scrollCheck = window.scrollY > 100;
      if (scrollCheck !== scroll) {
        setScroll(scrollCheck);
      }
    });
    const WOW = require('wowjs');
    window.wow = new WOW.WOW({
      live: false,
    });
    window.wow.init();
  }, []);
  return (
    <>
      <PageHead headTitle={headTitle} />

      <Header1
        scroll={scroll}
        isMobileMenu={isMobileMenu}
        handleMobileMenu={handleMobileMenu}
      />
      <DataBg />

      <main className={mainCls ? mainCls : 'main-content'}>
        <div
          className="noise-bg"
          data-background="/assets/img/bg/noise_bg.png"
        />
        <div
          className="main-shape"
          data-background="/assets/img/images/main_shape_1.png"
        />
        {breadcrumbTitle && <Breadcrumb breadcrumbTitle={breadcrumbTitle} />}

        {children}
      </main>
      <Footer1 />

      {/* <BackToTop /> */}
    </>
  );
}
