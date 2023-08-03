import { getServerSession } from 'next-auth';
import { NextRequest, NextResponse } from 'next/server';

import {
  authError,
  authOptions,
  getUserAndTenant,
} from '@/lib/auth';
import { getDbClient, getMessages } from '@/lib/db';

export async function GET(
  request: NextRequest,
  { params: { conversation_id } }: { params: { conversation_id: string } },
) {
  const client = await getDbClient();
  const session = await getServerSession(authOptions);
  if (!session) {
    return authError();
  }
  const { user_id, tenant_id } = await getUserAndTenant(session, client);
  const page = Number(request.nextUrl.searchParams.get('page')) || 1;
  const limit = Number(request.nextUrl.searchParams.get('limit')) || 50;

  //   const resp = await getUserAndTenant(request, client);
  //   console.log({ resp });
  const responseBody = await getMessages({
    user_id,
    tenant_id,
    conversation_id,
    limit,
    page,
    client,
  });

  return new NextResponse(JSON.stringify(responseBody), {
    status: 200,
    headers: { 'Content-Type': 'application/json' },
  });
  // // const session = await getServerSession() as AuthUser
  // // session?.user.sub
  // // // Extract parameters from request
  // // request.nextUrl.searchParams.get('')
  // const { conversation_id } = request.nextUrl.
  // const page = Number(request.nextUrl.query.page) || 1;
  // const limit = Number(request.nextUrl.query.limit) || 10;

  // // Calculate offset
  // const offset = (page - 1) * limit;

  // // Prepare SQL query
  // const query = `
  //     SELECT *
  //     FROM messages
  //     WHERE user_id = $1 AND tenant_id = $2 AND conversation_id = $3
  //     ORDER BY created_at DESC
  //     LIMIT $4 OFFSET $5;
  // `;

  // try {
  //     // Execute query
  //     const result = await client.query(query, [user_id, tenant_id, conversation_id, limit, offset]);

  //     // Create response
  //     const responseBody = {
  //         data: result.rows,
  //         pagination: {
  //             current_page: page,
  //             per_page: limit,
  //             total_pages: Math.ceil(result.rowCount / limit),
  //             total_records: result.rowCount
  //         }
  //     };

  //     return new NextResponse(JSON.stringify(responseBody), {
  //         status: 200,
  //         headers: { 'Content-Type': 'application/json' },
  //     });
  // } catch (error) {
  //     // Handle error
  //     console.error(error);

  //     return new NextResponse(JSON.stringify({ error: 'An error occurred while fetching messages.' }), {
  //         status: 500,
  //         headers: { 'Content-Type': 'application/json' },
  //     });
  // } finally {
  //     // Release client
  //     client.release();
  // }
}
