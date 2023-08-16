import type { Metadata } from 'next';

import { Inter } from 'next/font/google';
// import { Head, Html, Main, NextScript } from 'next/document'

// import './globals.css';
// import "slick-carousel/slick/slick-theme.css"
// import "slick-carousel/slick/slick.css"


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
      <head>
        {/* <title>{metadata.title}</title> */}
        {/* <meta name="description" content={metadata.description} /> */}
        {/* <link rel="shortcut icon" href="/assets/img/favicon.png" /> */}
        {/* <link rel="preconnect" href="https://fonts.bunny.net" /> */}
        {/* <link href="https://fonts.bunny.net/css?family=outfit:100,200,300,400,500,600,700|playfair-display:400,400i,500,500i,600,600i,700,700i,800,800i|plus-jakarta-sans:400,400i,500,500i,600,600i,700,700i,800,800i" rel="stylesheet" /> */}
      </head>
      <body>
        <div className={inter.className}>
          <main>{children}</main>
        </div>
        {/* <NextScript /> */}
      </body>
    </html>
  );
}