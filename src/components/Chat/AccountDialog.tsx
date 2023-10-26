import { useCallback, useEffect, useState } from 'react';

import Image from 'next/image';
import Link from 'next/link';

import { LoginButton } from '../Login/LoginButton';

interface Props {}

export const AccountDialog = (props: Props) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handle = setTimeout(() => {
      setIsVisible(true);
    }, 1000);
    return () => clearTimeout(handle);
  }, []);
  return (
    isVisible && (
      <div
        className="block fixed inset-0 flex flex-col items-center justify-center p-4"
        style={{
          backgroundImage:
            'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(/assets/img/images/data_tranquil.jpeg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          backgroundSize: 'cover',
        }}
      >
        <>
          <Link href="/">
            <Image
              style={{ marginBottom: '16px' }}
              src="/assets/img/logo/logo.png"
              alt="IslandFox.ai Logo"
              width={200}
              height={40}
            />
          </Link>
          <LoginButton />
          <div style={{ width: 200 }}>
            <p className="mt-4 text-center text-white">
              By logging in to IslandFox.ai you agree to our&nbsp;
              <a href="/legal/terms_and_conditions" className="underline">
                Terms of Service
              </a>
              &nbsp;and to our &nbsp;
              <a href="/legal/privacy_policy" className="underline">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </>
      </div>
    )
  );
};
