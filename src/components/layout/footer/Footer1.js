import Link from "next/link";

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
                  <div className="footer-menu">
                    <ul className="list-wrap">
                      <li>
                        <Link href="/contact">Terms & Conditions</Link>
                      </li>
                      <li>
                        <Link href="/contact">Privacy Policy</Link>
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
