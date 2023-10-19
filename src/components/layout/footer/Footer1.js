import Link from 'next/link';

export default function Footer1() {
  return (
    <>
      <footer>
        <div className="footer-area">
          <div className="container">
            <div className="footer-bottom">
              <div className="row align-items-center">
                <div className="col-lg-8">
                  <div className="copyright-text">
                    <p>
                      Copyright © {new Date().getFullYear()} IslandFox.ai All
                      rights reserved.
                    </p>
                  </div>
                </div>
                <div className="col-lg-4">
                  <div>
                    <ul className="list-wrap">
                      <li>
                        <Link href="/legal/terms_and_conditions">
                          Terms & conditions
                        </Link>
                      </li>
                      <li>
                        <Link href="/legal/privacy_policy">Privacy Policy</Link>
                      </li>
                      <li>
                        <Link target="_blank" href="/md/ljetina_openai_data_processing_agreement.pdf">OpenAI Data Processing agreement</Link>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </>
  );
}
