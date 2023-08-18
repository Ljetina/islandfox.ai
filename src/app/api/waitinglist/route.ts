import { NextRequest, NextResponse } from 'next/server';

import { getDbClient } from '@/lib/db';

export async function POST(req: NextRequest) {
  const client = await getDbClient();
  const requestBody = await req.json();
  await client.query(
    `INSERT INTO waitlist_items (email)
    VALUES ($1)`,
    [requestBody.email],
  );
  return NextResponse.json({ status: 'ok' });
}
