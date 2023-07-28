import { Pool, PoolClient } from 'pg';

const pool = new Pool({
  connectionString: process.env.PG_DB_URL,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function getDbClient(): Promise<PoolClient> {
  const client = await pool.connect();
  return client;
}
