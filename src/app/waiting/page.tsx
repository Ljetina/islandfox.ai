// @ts-nocheck
'use client';

import { FormEvent, useState } from 'react';

import Layout from '@/components/layout/Layout';

import '/public/assets/css/animate.min.css';
import '/public/assets/css/animatedheadline.css';
import '/public/assets/css/bootstrap.min.css';
import '/public/assets/css/default.css';
import '/public/assets/css/fontawesome-all.min.css';
import '/public/assets/css/magnific-popup.css';
import '/public/assets/css/odometer.css';
import '/public/assets/css/responsive.css';
import '/public/assets/css/select2.min.css';
import '/public/assets/css/style.css';

// @ts-nocheck

export default function Waiting() {
  const [email, setEmail] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const response = await fetch('/api/waitinglist', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email }),
    });

    if (!response.ok) {
      console.error('An error occurred while trying to join the waiting list');
    } else {
      console.log('Successfully joined the waiting list');
      setEmail('');
      setFormSubmitted(true);
    }
  };

  return (
    // @ts-ignore
    <Layout mainCls="main-content fix" headTitle={'home'}>
      <section className="login-area">
        <div className="container">
          <div className="row justify-content-center">
            <div className="col-lg-5 col-md-10">
              <div className="login-content">
                {formSubmitted ? (
                  <>
                    <h3 className="title">Thank You!</h3>
                    <span>
                      We&apos;ll let you know as soon as our service is available!
                    </span>
                  </>
                ) : (
                  <>
                    <h3 className="title">Enter the waiting list</h3>
                    <span>
                      👋 We&apos;ll let you know as soon as our service is available!
                    </span>
                    <form onSubmit={handleSubmit}>
                      <div className="form-grp">
                        <label htmlFor="email">Your Email</label>
                        <input
                          type="email"
                          id="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                        />
                      </div>
                      <button className="gradient-btn" type="submit">
                        Submit
                      </button>
                    </form>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
