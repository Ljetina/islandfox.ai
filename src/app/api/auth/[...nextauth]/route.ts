import NextAuth from 'next-auth/next';

import { authOptions } from '@/lib/auth';
import { headers } from 'next/headers';

// const handler = NextAuth(authOptions);

async function handler(...params: any[]) {
  const authHandler = NextAuth(authOptions);
  console.log('params',params[1]);
  const h = headers();
  console.log({
    cookie: h.get('cookie')
  })
  
  const response = await authHandler(...params);
  return response;
}

export { handler as GET, handler as POST };
