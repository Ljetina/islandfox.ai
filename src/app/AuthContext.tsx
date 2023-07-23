import { SessionProvider } from 'next-auth/react';

export function AuthContext({
  Component,
  pageProps: { session, ...pageProps },
}: any) {
  if (session) {
    return (
      <SessionProvider session={session}>
        <Component {...pageProps} />
      </SessionProvider>
    );
  }
  
}
