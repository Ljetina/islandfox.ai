import { getServerSession } from 'next-auth';

import { AuthContext } from '../AuthContext';
import ChatHome from './ChatHome';

import { AuthSession, authOptions } from '@/lib/auth';
import { initialServerData } from '@/lib/db';
import { signIn } from 'next-auth/react';
import { LoginButton } from '@/components/buttons.component';

export default async function ChatHomePage() {
  const session = await getServerSession(authOptions);
  console.log({session})
  if (!session) {
    // await signIn()
    return <LoginButton />
  }
  const initialData = await initialServerData((session as AuthSession).user.id);

  return (
    <AuthContext session={session}>
      <ChatHome initialData={initialData} />
    </AuthContext>
  );
}
