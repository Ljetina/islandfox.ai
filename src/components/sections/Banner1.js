import { useCallback } from 'react';

import Link from 'next/link';

import Typewriter from 'typewriter-effect';

export default function Banner1() {
  const toChat = useCallback(() => {
    window.location.href = '/chat';
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
                    Calling all <br />{' '}
                  </span>
                  <Typewriter
                    tag="span"
                    options={{
                      wrapperClassName: 'ah-words-wrapper',
                      strings: [
                        'Data Scientists',
                        'Researchers',
                        'Data Analysts',
                        'Machine Learning engineers',
                        'Quants',
                      ],
                      autoStart: true,
                      loop: true,
                    }}
                  />
                </h2>
                <p
                  style={{
                    backgroundColor: 'rgba(50, 0, 75, 0.3)',
                    borderRadius: '10px',
                    padding: '10px',
                    color: 'white'
                  }}
                >
                  Accelerate your data science projects with IslandFox.ai. By
                  seamlessly connecting to your own Jupyter servers, notebooks
                  and data infrastructure, we offer a new kind of chat
                  assistance. We facilitate rapid data analysis, visualization,
                  feature engineering and machine learning workflows.
                </p>
                <div className="banner-btn" onClick={toChat}>
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
