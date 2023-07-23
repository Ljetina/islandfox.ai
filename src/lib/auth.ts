import NextAuth from "next-auth"
import type { NextAuthOptions, Session } from "next-auth";
import GoogleProvider from 'next-auth/providers/google';

export const authOptions: NextAuthOptions = {
    providers: [
      GoogleProvider({
        clientId: process.env.GOOGLE_ID as string,
        clientSecret: process.env.GOOGLE_SECRET as string,
      }),
    ],
    callbacks: {
      async jwt({ session, token, user }) {
        // console.log('jwt', {token, session, user})
        return token
      },
      async signIn({ user, account, profile, email, credentials }) {
        // console.log('signin', {user, account, profile, email, credentials})
        return true
      },
      async session({session, token, user}) {
        // console.log('session', {session, token, user})
        return session
      },
    },
};

export async function getServerSession(cookie: string): Promise<Session | null> {
    const response = await fetch(
      `${process.env.LOCAL_AUTH_URL}/api/auth/session`,
      // `${process.env.LOCAL_AUTH_URL}/api/auth/signin`,
      {
        headers: {
          cookie,
        },
      },
    );  
  
    if (response.headers.get('content-type') !== "application/json") {
    //   console.log(await response.text())
      return null
    }
    const session = await response.json();
    if (!session.user) {
        return null
    }
    // console.log({session})
  
    return Object.keys(session).length > 0 ? session : null;
  }