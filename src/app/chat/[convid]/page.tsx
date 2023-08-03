import { getServerSession } from 'next-auth';

import ChatHome from '../ChatHome';

import { AuthContext } from '@/app/AuthContext';
import { AuthSession, authOptions } from '@/lib/auth';
import { initialServerData } from '@/lib/db';

export default async function ChatHomePage({
  params,
}: {
  params: { convid: string };
}) {
  const session = await getServerSession(authOptions);
  const initialData = await initialServerData((session as AuthSession).user.id);
  return (
    <AuthContext session={session}>
      <ChatHome conversationId={params.convid} initialData={initialData} />
    </AuthContext>
  );
}
