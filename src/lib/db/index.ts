
import { Pool, PoolClient } from 'pg';
import { getDbConfig } from './config';

let pool: Pool | null = null;

// Initialize the database connection pool
export const initDb = (): Pool => {
  if (pool) return pool;
  
  const config = getDbConfig();
  pool = new Pool(config);
  
  // Log connection errors
  pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
    process.exit(-1);
  });
  
  return pool;
};

// Execute a query and return the results
export const query = async <T>(text: string, params?: any[]): Promise<T[]> => {
  const client = await getClient();
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } finally {
    client.release();
  }
};

// Get a client from the pool
export const getClient = async (): Promise<PoolClient> => {
  if (!pool) {
    initDb();
  }
  
  return pool!.connect();
};

// Run a transaction
export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T> => {
  const client = await getClient();
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
};
