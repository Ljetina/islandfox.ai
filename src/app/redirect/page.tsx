'use client';

import React, { useEffect } from 'react';

import { useRouter } from 'next/navigation';

import { useLocalStorage } from '@/hooks/useLocalStorage';

const RedirectPage: React.FC = () => {
  const [, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const router = useRouter();

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const name = decodeURIComponent(urlParams.get('name') || '');
    const pic = decodeURIComponent(urlParams.get('pic') || '');
    localStorage.setItem('name', name);
    localStorage.setItem('pic', pic);
    const preAuthPath = localStorage.getItem('preAuthPath');
    if (preAuthPath) {
      setIsLoggedIn(true);
      router.push(preAuthPath, { scroll: false });
      localStorage.removeItem('preAuthPath');
    } else {
      router.push('/', { scroll: false });
    }
  }, []);

  return <div>Redirecting...</div>;
};

export default RedirectPage;
