import type { Metadata } from 'next';
import { NextScript } from 'next/document';
import { Inter } from 'next/font/google';
import Head from 'next/head';
import Script from 'next/script';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IslandFox.ai',
  description: 'Chat assistant for power users',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <Head>
        <Script async src="https://js.stripe.com/v3/buy-button.js" />
        <Script
          src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}`}
        />
        <Script id="google-analytics">
          {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
 
          gtag('config', '${process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID}');
        `}
        </Script>
        <link
          rel="icon"
          type="image/png"
          sizes="16x16"
          href="/assets/img/16_favicon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="32x32"
          href="/assets/img/32_favicon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="64x64"
          href="/assets/img/64_favicon.png"
        />
        <link
          rel="icon"
          type="image/png"
          sizes="128x128"
          href="/assets/img/128_favicon.png"
        />
        <link rel="preconnect" href="https://fonts.bunny.net" />
        <link
          href="https://fonts.bunny.net/css?family=outfit:100,200,300,400,500,600,700|playfair-display:400,400i,500,500i,600,600i,700,700i,800,800i|plus-jakarta-sans:400,400i,500,500i,600,600i,700,700i,800,800i"
          rel="stylesheet"
        />
      </Head>
      <body>
        <div className={inter.className}>
          <main>{children}</main>
        </div>
        {/* <NextScript /> */}
      </body>
    </html>
  );
}
