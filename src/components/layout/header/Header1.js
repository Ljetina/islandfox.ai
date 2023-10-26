import { useCallback } from 'react';

import Image from 'next/image';
import Link from 'next/link';
import { trackEvent } from '@/hooks/useTrackPage';

// import Sidebar from '../Sidebar';

export default function Header1({ scroll, isMobileMenu, handleMobileMenu }) {
  const toChat = useCallback(() => {
    trackEvent({ action: 'click', category: 'button', label: 'login' });
    window.location.href = '/chat';
  }, []);
  return (
    <>
      <header>
        <div
          id="sticky-header"
          className={`menu-area transparent-header ${
            scroll ? 'sticky-menu' : ''
          }`}
        >
          <div className="container custom-container">
            <div className="row">
              <div className="col-12">
                <div className="mobile-nav-toggler" onClick={handleMobileMenu}>
                  <i className="fas fa-bars" />
                </div>
                <div className="menu-wrap">
                  <nav className="menu-nav">
                    <div className="logo">
                      <Link href="/">
                        <Image
                          src="/assets/img/logo/logo.png"
                          alt="IslandFox.ai Logo"
                          width={200}
                          height={40}
                        />
                      </Link>
                    </div>
                    <div className="navbar-wrap main-menu d-none d-lg-flex">
                      <ul className="navigation">
                        <li>
                          <Link href="/docs">Documentation</Link>
                        </li>
                        <li>
                          <Link href="/pricing">Pricing</Link>
                        </li>
                      </ul>
                    </div>
                    <div
                      className="header-action d-none d-md-block"
                      style={{ marginRight: 140 }}
                    >
                      &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                      <ul className="list-wrap">
                        <li className="header-btn">
                          <button className="btn" onClick={toChat}>
                            Login
                          </button>
                        </li>
                      </ul>
                    </div>
                  </nav>
                </div>
                {/* Mobile Menu  */}
                <div className="mobile-menu">
                  <nav className="menu-box">
                    <div className="close-btn" onClick={handleMobileMenu}>
                      <i className="fas fa-times" />
                    </div>
                    <div className="nav-logo">
                      <Link href="/">
                        <Image
                          src="/assets/img/logo/logo.png"
                          alt="IslandFox.ai Logo"
                          width={200}
                          height={40}
                        />
                      </Link>
                    </div>
                    {/* <div className="menu-outer">
                      <Sidebar />
                    </div> */}
                  </nav>
                </div>
                <div className="menu-backdrop" onClick={handleMobileMenu} />
                {/* End Mobile Menu */}
              </div>
            </div>
          </div>
        </div>
      </header>
    </>
  );
}
