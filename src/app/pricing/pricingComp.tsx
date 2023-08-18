'use client';

import Link from 'next/link';

import Pricing1 from '@/components/sections/Pricing1';

export function Pricing() {
  return (
    <>
      <section className="pricing-area pb-110" style={{ paddingTop: '150px' }}>
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title text-center mb-50">
                <h2 className="title title-animation">
                  Pay only for what you use. <br />
                  <span>No&nbsp;commitments.</span>
                </h2>
              </div>
            </div>
          </div>
          <div className="pricing-item-wrap">
            <div className="row justify-content-center">
              <div className="col-xl-4 col-lg-6 col-md-9 col-sm-10">
                <div
                  className="pricing-item active wow fadeInUp"
                  data-wow-delay=".5s"
                >
                  <span className="popular">Most&nbsp;popular</span>
                  <div className="pricing-shape">
                    <svg
                      viewBox="0 0 410 616"
                      fill="none"
                      x="0px"
                      y="0px"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M85.6497 0.634114C102.343 1.89097 115.705 2.89697 134 22.4989C134.632 23.176 135.238 23.8305 135.823 24.4624C145.21 34.5995 149.203 38.9119 168.5 37.4993C179.699 36.6795 228.167 37.1659 251 37.4993H251.001C262.001 37.4993 270.501 37.4993 289 16C301.111 1.92454 315.232 0.174842 333.448 0H380C396.569 0 410 13.4315 410 30V586C410 602.569 396.569 616 380 616H30C13.4315 616 0 602.569 0 586V30C0 13.4315 13.4315 0 30 0H78.0075C80.6454 0.257338 83.1839 0.448462 85.6497 0.634114Z"
                        fill="url(#pricing)"
                      />
                      <defs>
                        <linearGradient
                          id="pricing"
                          x1="-35.4999"
                          y1="-46.5001"
                          x2="393.384"
                          y2="749.254"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop offset="0.0246007" stopColor="#C8BDFF" />
                          <stop offset="0.0246007" stopColor="#BAA6FF" />
                          <stop offset="0.214137" stopColor="#6721FF" />
                          <stop offset="0.486687" stopColor="#6721FF" />
                          <stop offset={1} stopColor="#00CBFF" />
                        </linearGradient>
                      </defs>
                    </svg>
                  </div>
                  <div className="pricing-top">
                    <div className="left-side">
                      <div className="icon">
                        <img src="/assets/img/icon/pricing_icon.svg" alt="" />
                      </div>
                      <div className="content">
                        <h4 className="title">Pay&nbsp;as&nbsp;you&nbsp;go</h4>
                      </div>
                    </div>
                    <div className="pricing-price">
                      <h2 className="title one-time">$10</h2>
                    </div>
                  </div>
                  <div className="pricing-list">
                    <ul className="list-wrap">
                      <li>All the plugins, all the time</li>
                      <li>Pricing per api call</li>
                      <li>125.000 OpenAI gpt-4 tokens / $10</li>
                      <p>or</p>
                      <li>2200 Google search requests / $10</li>
                      <p>or</p>
                      <li>5000 news queries / $10</li>
                      <li>Prepaid bundles are available in various sizes</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="col-xl-4 col-lg-6 col-md-9 col-sm-10">
                <div
                  className="pricing-item wow fadeInRight"
                  data-wow-delay=".2s"
                >
                  <div className="pricing-shape">
                    <svg
                      viewBox="0 0 410 616"
                      fill="none"
                      x="0px"
                      y="0px"
                      preserveAspectRatio="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        fillRule="evenodd"
                        clipRule="evenodd"
                        d="M85.6497 0.634114C102.343 1.89097 115.705 2.89697 134 22.4989C134.632 23.176 135.238 23.8305 135.823 24.4624C145.21 34.5995 149.203 38.9119 168.5 37.4993C179.699 36.6795 228.167 37.1659 251 37.4993H251.001C262.001 37.4993 270.501 37.4993 289 16C301.111 1.92454 315.232 0.174842 333.448 0H380C396.569 0 410 13.4315 410 30V586C410 602.569 396.569 616 380 616H30C13.4315 616 0 602.569 0 586V30C0 13.4315 13.4315 0 30 0H78.0075C80.6454 0.257338 83.1839 0.448462 85.6497 0.634114Z"
                        fill="currentcolor"
                      />
                    </svg>
                  </div>
                  <div className="pricing-top">
                    <div className="left-side">
                      <div className="icon">
                        <img src="/assets/img/icon/pricing_icon.svg" alt="" />
                      </div>
                      <div className="content">
                        <h4 className="title">Enterprise</h4>
                      </div>
                    </div>
                  </div>
                  <div className="pricing-list">
                    <ul className="list-wrap">
                      <li>Custom plugins</li>
                      <li>Enterprise integrations</li>
                      <li>On-premise or appliance deployments</li>
                      <li>Flexible billing</li>
                    </ul>
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
