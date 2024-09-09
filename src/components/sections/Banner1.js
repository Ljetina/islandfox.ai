import { useCallback } from 'react';



import { trackEvent } from '@/hooks/useTrackPage';



import Typewriter from 'typewriter-effect';


export default function Banner1() {
  const toChat = useCallback(() => {
    trackEvent({ action: 'click', category: 'button', label: 'get-started' });
    window.location.href = 'https://github.com/Ljetina/islandfox.ai';
  }, []);

  return (
    <>
      <section className="banner-area">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="banner-content ta-animated-headline">
                <h2
                  className="title ah-headline wow fadeInUp"
                  data-wow-delay=".2s"
                >
                  <span>
                    Open Source Chat UI <br />
                  </span>
                </h2>
                <p
                  style={{
                    backgroundColor: 'rgba(50, 0, 75, 0.1)',
                    borderRadius: '10px',
                    padding: '10px',
                    color: 'white',
                  }}
                >
                  Formerly commercial, now fully open source conversational interface
                  for data science work.                  
                </p>
                <div className="banner-btn">
                  <div
                    className="gradient-btn"
                    data-wow-delay=".6s"
                    onClick={toChat}
                  >
                    Get Started
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}