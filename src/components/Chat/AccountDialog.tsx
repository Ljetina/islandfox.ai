import { useCallback, useEffect, useState } from 'react';

import { LoginButton } from '../Login/LoginButton';

interface Props {}

export const AccountDialog = (props: Props) => {
  const [isVisible, setIsVisible] = useState(false);
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
          backgroundImage: 'url(/assets/img/images/data_tranquil.jpeg)',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
        }}
      >
        <>
          <img
            src="/assets/img/logo/logo.png"
            alt="Company Logo"
            className="mb-4"
          />
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
