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

export default function Features() {
  return (
    <Layout headTitle={"features"}>
      <section className="features-area pt-140 pb-130">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-70">
                <h2 className="title title-animation">
                  Our <span>Features</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="row justify-content-center">
            <div className="col-lg-12 col-md-9">
              <div className="features-timeline-wrap">
                <div
                  className="features-line"
                  data-background="assets/img/brand/Line.svg"
                />
                <ul className="list-wrap">
                  <li>
                    <div className="features-item">
                      <div
                        className="features-img wow fadeInLeft"
                        data-wow-delay=".2s"
                      >
                        <img
                          src="/assets/img/images/features_img01.png"
                          alt=""
                        />
                        <span className="number">01</span>
                      </div>
                      <div
                        className="features-content wow fadeInRight"
                        data-wow-delay=".2s"
                      >
                        <h4 className="title">Curated Plugins</h4>
                        <p>
                          Choose from a variety of plugins, including a Google
                          search plugin, to enhance your AI experience.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="features-item">
                      <div
                        className="features-img wow fadeInRight"
                        data-wow-delay=".2s"
                      >
                        <img
                          src="/assets/img/images/features_img02.png"
                          alt=""
                        />
                        <span className="number">02</span>
                      </div>
                      <div
                        className="features-content wow fadeInLeft"
                        data-wow-delay=".2s"
                      >
                        <h4 className="title">Best in Class Models</h4>
                        <p>
                          Our AI leverages GPT-4, the latest and most powerful
                          language model, for high-quality output.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="features-item">
                      <div
                        className="features-img wow fadeInLeft"
                        data-wow-delay=".2s"
                      >
                        <img
                          src="/assets/img/images/features_img03.png"
                          alt=""
                        />
                        <span className="number">03</span>
                      </div>
                      <div
                        className="features-content wow fadeInRight"
                        data-wow-delay=".2s"
                      >
                        <h4 className="title">Convenient API Integrations</h4>
                        <p>
                          Integrate with APIs like CoinMarketCap for real-time
                          data in your AI-generated content.
                        </p>
                      </div>
                    </div>
                  </li>
                  <li>
                    <div className="features-item">
                      <div
                        className="features-img wow fadeInRight"
                        data-wow-delay=".2s"
                      >
                        <img
                          src="/assets/img/images/features_img04.png"
                          alt=""
                        />
                        <span className="number">04</span>
                      </div>
                      <div
                        className="features-content wow fadeInLeft"
                        data-wow-delay=".2s"
                      >
                        <h4 className="title">
                          Intelligent Memory and Context Management
                        </h4>
                        <p>
                          Enjoy seamless conversations with our AI&apos;s ability to
                          manage context and memory effectively, ensuring a
                          smooth flow of conversation.
                        </p>
                      </div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}