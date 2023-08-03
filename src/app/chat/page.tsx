import { getServerSession } from 'next-auth';

import { AuthContext } from '../AuthContext';
import ChatHome from './ChatHome';

import { AuthSession, authOptions } from '@/lib/auth';
import { initialServerData } from '@/lib/db';

export default async function ChatHomePage() {
  const session = await getServerSession(authOptions);
  const initialData = await initialServerData((session as AuthSession).user.id);

  return (
    <AuthContext session={session}>
      <ChatHome initialData={initialData} />
    </AuthContext>
  );
}
