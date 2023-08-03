import {
  type NextAuthOptions,
  type Session,
  getServerSession,
} from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { headers as nextHeaders } from 'next/headers';
import { NextRequest } from 'next/server';

import { getDbClient } from './db';

import { PoolClient } from 'pg';

export interface AuthSession extends Session {
  user: {
    id: string;
    email: string;
  };
}

export const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID as string,
      clientSecret: process.env.GOOGLE_SECRET as string,
    }),
  ],
  events: {
    async signOut({ token }) {
      const client = await getDbClient();
      const tokenId: string = token.sub as string;
      await client.query('DELETE FROM oauth_tokens WHERE id = $1', [tokenId]);

      client.release();
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      const email = profile?.email;
      if (!email) {
        return false;
      }
      const client = await getDbClient();

      const createTokenRecord = async (userId: string) => {
        const tokenRes = await client.query(
          `INSERT INTO oauth_tokens (user_id, provider, provider_user_id, access_token, id_token, refresh_token, token_expiry) 
          VALUES ($1, $2, $3, $4, $5, $6, TO_TIMESTAMP($7)) RETURNING id`,
          [
            userId,
            account?.provider,
            user.id,
            account?.access_token,
            account?.id_token,
            account?.refresh_token,
            account?.expires_at,
          ],
        );
        return tokenRes.rows[0].id;
      };

      try {
        await client.query('BEGIN');
        const userId = await getUserByEmail(client, email);
        if (userId) {
          const tokenId = await createTokenRecord(userId);
          user.id = tokenId;
        } else {
          const tenantRes = await client.query(
            `INSERT INTO tenants (name) VALUES ($1) RETURNING id`,
            ['Your Organization'],
          );
          const tenantId = tenantRes.rows[0].id;
          const userRes = await client.query(
            `INSERT INTO users (name, email, selected_tenant_id) VALUES ($1, $2, $3) RETURNING id`,
            [user.name, user.email, tenantId],
          );
          const userId = userRes.rows[0].id;
          await client.query(
            `INSERT INTO user_tenants (user_id, tenant_id) VALUES ($1, $2)`,
            [userId, tenantId],
          );
          const tokenId = await createTokenRecord(userId);
          user.id = tokenId;
        }
        await client.query('COMMIT');
        return true;
      } catch (e) {
        client.query('ROLLBACK');
      } finally {
        client.release();
      }
      return false;
    },
    async session(props) {
      const { session, token, user } = props;
      if (session.user && token.sub) {
        (session as AuthSession).user.id = token.sub;
      }
      return session;
    },
  },
};

export async function getUserByEmail(client: PoolClient, email: string) {
  const result = await client.query(`SELECT * FROM users WHERE email = $1`, [
    email,
  ]);

  // If a user is found, return the user's id. Otherwise, return null.
  return result.rows.length > 0 ? result.rows[0].id : null;
}

export function authError() {
  // headers().set
  // TODO clear the session cookie
  return new Response('Authentication error', {
    status: 401,
  });
}

export async function getUserAndTenant(session: Session, client: PoolClient) {

  console.log({session})
  const resp = await client.query(
    `SELECT u.id as user_id, u.selected_tenant_id as tenant_id FROM users u INNER JOIN oauth_tokens ot ON ot.user_id = u.id WHERE ot.id = $1`,
    [(session as AuthSession)?.user.id],
  );
  console.log({resp})
  return resp.rows[0];
  // console.log('conversation get', { session });
  // const tenantId = req.headers.get('x-tenant-id');
}

export async function getTenant(userId: string, tenantId: string) {
  const client = await getDbClient();
  const res = await client.query(
    `SELECT tenants.* 
    FROM tenants 
    INNER JOIN user_tenants ON tenants.id = user_tenants.tenant_id 
    WHERE user_tenants.user_id = $1 AND user_tenants.tenant_id = $2`,
    [userId, tenantId],
  );

  return res.rows[0];
}

// export async function getServerSession(): Promise<Session | null> {
//   const cookie = nextHeaders().get('cookie');
//   if (!cookie) {
//     return null;
//   }
//   const response = await fetch(
//     `${process.env.LOCAL_AUTH_URL}/api/auth/session`,
//     // `${process.env.LOCAL_AUTH_URL}/api/auth/signin`,
//     {
//       headers: {
//         cookie,
//       },
//     },
//   );

//   if (response.headers.get('content-type') !== 'application/json') {
//     //   console.log(await response.text())
//     return null;
//   }
//   const session = await response.json();
//   if (!session.user) {
//     return null;
//   }
//   // console.log({session})

//   return Object.keys(session).length > 0 ? session : null;
// }
