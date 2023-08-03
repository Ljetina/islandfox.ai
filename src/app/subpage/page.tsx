import { getServerSession } from 'next-auth';

import { AuthSession, authOptions, getUserAndTenant } from '@/lib/auth';
import { getDbClient, getMessages } from '@/lib/db';
import SubpageComp from './subpageComp';

export default async function SubPage() {
  const client = await getDbClient();
  const session = await getServerSession(authOptions);
  const { user_id, tenant_id } = await getUserAndTenant(
    session as AuthSession,
    client,
  );
  const conversation_id = 'fef6c0e1-78fa-4858-8cd9-f2697c82adc0';
  const body = await getMessages({
    user_id,
    tenant_id,
    conversation_id,
    client,
  });

  return <div>
    <SubpageComp />
    <div>{JSON.stringify(body)}</div></div>;

}
