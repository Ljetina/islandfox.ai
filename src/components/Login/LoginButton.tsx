'use client';

import React, { useEffect, useState } from 'react';

import { useLocalStorage } from '@/hooks/useLocalStorage';

import Spinner from '../Spinner/Spinner';
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
      credentials: 'include',
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
    <div className={styles.profile} onClick={toggleMenu}>
      <img
        className={styles.profilePic}
        src={userProfilePic}
        alt="User Profile"
      />
      <span className={styles.tenantName}>{tenantName}</span>
      {showMenu && (
        <div className={styles.menu}>
          <button onClick={onLogout}>Logout</button>
        </div>
      )}
    </div>
  );
};
