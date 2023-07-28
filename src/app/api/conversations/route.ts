import { NextRequest, NextResponse } from 'next/server';

import { authError, getServerSession, getTenant } from '@/lib/auth';
import { getDbClient } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

export async function GET(req: NextRequest) {
  const session = await getServerSession();
  console.log('conversation get', { session });
  const client = await getDbClient();
  const tenantId = req.headers.get('x-tenant-id');

  if (session && tenantId) {
    // @ts-ignore TODO
    const userId = session.user?.id;
    const tenant = await getTenant(userId, tenantId);
    if (userId && tenant) {
      const { rows } = await client.query(
        `
SELECT 
    conversations.name, 
    conversations.created_at, 
    conversations.updated_at, 
    conversations.folder_id, 
    conversations.name, 
    conversations.temperature, 
    conversations.model_id 
FROM 
    conversations
WHERE 
    conversations.user_id = $1 
    AND conversations.tenant_id = $2
ORDER BY 
    conversations.created_at DESC;
`,
        [userId, tenantId],
      );
      //   rows.map(r => r.)
      console.log(rows);
      NextResponse.json({});
    } else {
      return authError();
    }
  } else {
    return authError();
  }
}

export async function POST(req: NextRequest) {
  const session = await getSession({ req });

  if (session) {
    const {
      document_id,
      folder_id,
      name,
      prompt,
      temperature,
      model_id,
      tenant_id,
    } = req.body as any;
    const id = uuidv4();
    await client.query(
      'INSERT INTO conversations (id, document_id, folder_id, name, prompt, temperature, model_id, user_id, tenant_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)',
      [
        id,
        document_id,
        folder_id,
        name,
        prompt,
        temperature,
        model_id,
        session.user.id,
        tenant_id,
      ],
    );
    return NextResponse.json({ id });
  } else {
    return NextResponse.error({ status: 401 }); // Unauthorized
  }
}
