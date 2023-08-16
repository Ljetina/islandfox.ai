import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import { authOptions } from '@/lib/auth';
import { getDbClient } from '@/lib/db';

export interface UserPreferences {
  ui_show_converations: boolean;
  ui_show_prompts: boolean;
  selected_tenant_id: string;
  user_id: string;
}

// TODO Move out of here, re-use? Not sure
async function getUserPreferences(
  tokenId: string,
): Promise<UserPreferences | undefined> {
  const client = await getDbClient();
  const resp = await client.query(
    `
  SELECT ui_show_conversations, ui_show_prompts, selected_tenant_id, user_id
FROM users
         INNER JOIN oauth_tokens ot on users.id = ot.user_id
WHERE ot.id = $1;
`,
    [tokenId],
  );
  if (resp.rowCount > 0) {
    return resp.rows[0];
  }
}

export async function GET(req: NextRequest, res: NextResponse) {
  const session = await getServerSession(authOptions);
  if (session) {
    console.log({ session });
  }
}
