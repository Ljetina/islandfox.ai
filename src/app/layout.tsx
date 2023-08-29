import { SessionProvider } from 'next-auth/react';

import type { Metadata } from 'next';
// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="en">
//       <body className={inter.className}>{children}</body>
//     </html>
//   )
// }
import { Session } from 'next-auth';
import { Inter } from 'next/font/google';
import { headers } from 'next/headers';

import { AuthContext } from './AuthContext';
import './globals.css';

import { getServerSession } from '@/lib/auth';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'IslandFox.ai',
  description: 'Created for power users',
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(headers().get('cookie') ?? '');
  // console.log({session})
  return (
    <html lang="en">
      {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
      <head>
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
      </head>
      <body>
        {children}
        {/* <App */}
        {/* <SessionProvider session={session}> </SessionProvider> */}

        {/* Hello World */}
        {/* <AuthContext session={session}>{children}</AuthContext> */}
      </body>
    </html>
  );
}
