'use client';

import React, { useCallback, useContext, useEffect, useState } from 'react';

import { useEvent } from '@/hooks/useEvents';

import Spinner from '../Spinner/Spinner';
import styles from './LoginButton.module.css';

import { ChatContext } from '@/app/chat/chat.provider';
import { blurFetch } from '@/lib/api';

export const LoginButton: React.FC = () => {
  const {
    state: { isLoggedIn },
    setIsLoggedIn,
  } = useContext(ChatContext);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const onLoggedOut = useCallback(() => {
    setIsLoggedIn(false);
  }, []);

  useEvent('logged_out', onLoggedOut);

  useEffect(() => {
    new Image().src = '/assets/img/icon/btn_google_signin_dark_normal_web.png';
    new Image().src = '/assets/img/icon/btn_google_signin_dark_focus_web.png';
    new Image().src = '/assets/img/icon/btn_google_signin_dark_pressed_web.png';
    new Image().src =
      '/assets/img/icon/btn_google_signin_dark_disabled_web.png';
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    localStorage.setItem('preAuthPath', window.location.pathname);
    window.location.href = process.env.NEXT_PUBLIC_AUTH_URL as string;
  };

  const handleLogout = () => {
    blurFetch({ pathname: 'auth/logout', method: 'POST' }).then((data) => {
      console.log({ loggedOut: data });
      if (data.loggedOut) {
        setIsLoggedIn(data.loggedOut ? false : true);
      }
    });
  };
  if (!isClient) {
    return null;
  }

  return (
    <div>
      {isLoggedIn ? (
        <UserProfileView onLogout={handleLogout} />
      ) : (
        <SignInGoogleView onClick={handleLogin} isLoading={isLoading} />
      )}
    </div>
  );
};

const SignInGoogleView: React.FC<{
  onClick: () => void;
  disabled?: boolean;
  isLoading?: boolean;
}> = ({ onClick, disabled, isLoading }) => {
  return (
    <div className={styles.signIn} onClick={onClick}>
      {isLoading ? (
        <div className="mx-auto">
          <Spinner size="16px" className="mx-auto" />
        </div>
      ) : (
        <div className={styles.googlebutton} />
      )}
    </div>
  );
};

export const UserProfileView: React.FC<{
  onLogout: () => void;
}> = ({ onLogout }) => {
  // Replace with actual data
  const userProfilePic = localStorage.getItem('pic');
  const tenantName = localStorage.getItem('name');

  const [showMenu, setShowMenu] = useState(false);

  const toggleMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <div className={`flex flex-col ${showMenu ? 'flex-col-reverse' : ''}`}>
      {showMenu && (
        <button
          className="w-full text-left px-4 py-2 text-sm text-white bg-blue-500 hover:bg-blue-700 mt-2 rounded-lg"
          onClick={onLogout}
        >
          Logout
        </button>
      )}
      <div className="flex items-center cursor-pointer" onClick={toggleMenu}>
        <img
          className="h-8 w-8 rounded-full"
          src={userProfilePic ? userProfilePic : undefined}
          alt="User Profile"
        />
        <span className="ml-2 text-sm font-semibold">{tenantName}</span>
      </div>
    </div>
  );
};
