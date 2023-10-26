'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { trackEvent, useTrackPage } from '@/hooks/useTrackPage';

import '../globals.css';

const RedirectPage: React.FC = () => {
  useTrackPage();
  const router = useRouter();
  let debounce = false;

  useEffect(() => {
    if (debounce) {
      return;
    }
    debounce = true;
    const urlParams = new URLSearchParams(window.location.search);
    const name = decodeURIComponent(urlParams.get('name') || '');
    const pic = decodeURIComponent(urlParams.get('pic') || '');
    if (!localStorage.getItem('name')) {
      // Track the conversion on first login
      trackEvent({
        action: 'conversion',
        send_to: 'AW-11389553886/blCDCMqT4fAYEN6Z-7Yq',
      });
    }
    localStorage.setItem('name', name);
    localStorage.setItem('pic', pic);
    const preAuthPath = localStorage.getItem('preAuthPath');
    if (preAuthPath) {
      router.push(preAuthPath, { scroll: false });
      localStorage.removeItem('preAuthPath');
    } else {
      router.push('/', { scroll: false });
    }
  }, []);

  return (
    <div className="flex justify-center items-center h-screen bg-black text-white space-x-1">
      Redirecting
      <span className="animate-pulse">.</span>
      <span className="animate-pulse delay-400">.</span>
      <span className="animate-pulse delay-800">.</span>
    </div>
  );
};

export default RedirectPage;
