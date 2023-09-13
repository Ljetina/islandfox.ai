'use client';

import React, { MouseEventHandler, useEffect, useState } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';

import styles from './LoginButton.module.css';

export const LoginButton: React.FC = () => {
  const [isLoggedIn, setIsLoggedIn] = useLocalStorage('isLoggedIn', false);
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const handleLogin = () => {
    setIsLoading(true);
    localStorage.setItem('preAuthPath', window.location.pathname);
    window.location.href = 'http://localhost:3001/auth/google';
  };

  const handleLogout = () => {
    fetch('http://localhost:3001/logout', {
      method: 'POST',
      credentials: 'include', // Include credentials to send the session cookie
    })
      .then((response) => response.json())
      .then((data) => {
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
        <span>Loading....</span>
      ) : (
        <div className={styles.googlebutton} />
      )}
    </div>
  );
};

export const UserProfileView: React.FC<{
  onLogout: () => void;
}> = ({onLogout}) => {
  // Replace with actual data
  const userProfilePic = 'https://lh3.googleusercontent.com/a/ACg8ocLExIzTReIVMatGNt1qkaEmw0-CJA_ZYFA3NMugmRfR=s96-c';
  const tenantName = 'Bartol Karuza';

  return (
    // @ts-ignore
    <div className={styles.profile} onClick={onLogout}>
      <img
        className={styles.profilePic}
        src={userProfilePic}
        alt="User Profile"
      />
      <span className={styles.tenantName}>{tenantName}</span>
    </div>
  );
};
