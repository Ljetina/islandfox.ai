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

// export default function Pricing() {
//   return (
//     // @ts-ignore
//     <Layout headTitle={'pricing'}>
//       <section
//         className="features-area pt-140 pb-130"
//         style={{
//           display: 'flex',
//           justifyContent: 'center',
//           alignItems: 'center',
//           height: '100vh',
//         }}
//       >
//         {/* @ts-ignore TODO */}
//         <iframe
//           src="https://docs.google.com/forms/d/e/1FAIpQLSek0x0l5yGQhLiwTxGDMzJvwoP5QWz1aa6AYOTAn2RMEq7X-Q/viewform?embedded=true"
//           width="640"
//           height="427"
//           frameborder="0"
//           marginheight="0"
//           marginwidth="0"
//         >
//           Loading…
//         </iframe>
//       </section>
//       {/* <section className="features-area pt-140 pb-130">
//         <iframe src="https://docs.google.com/forms/d/e/1FAIpQLSek0x0l5yGQhLiwTxGDMzJvwoP5QWz1aa6AYOTAn2RMEq7X-Q/viewform?embedded=true" width="640" height="427" frameborder="0" marginheight="0" marginwidth="0">Loading…</iframe>
//       </section> */}
//     </Layout>
//   );
// }

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
      // Handle error...
      console.error('An error occurred while trying to join the waiting list');
    } else {
      // Handle success...
      console.log('Successfully joined the waiting list');
      setEmail(''); // Clear the input field
      setFormSubmitted(true); // Set formSubmitted to true
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
                      We'll let you know as soon as our service is available!
                    </span>
                  </>
                ) : (
                  <>
                    <h3 className="title">Enter the waiting list</h3>
                    <span>
                      👋 We'll let you know as soon as our service is available!
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
