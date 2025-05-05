
import { Pool, PoolClient } from 'pg';
import { getDbConfig } from './config';

// Check if in browser environment
const isBrowser = typeof window !== 'undefined';

let pool: Pool | null = null;

// Initialize the database connection pool
export const initDb = (): Pool | null => {
  // Don't initialize in browser
  if (isBrowser) {
    console.warn('Database connection attempted in browser environment');
    return null;
  }
  
  if (pool) return pool;
  
  try {
    const config = getDbConfig();
    pool = new Pool(config);
    
    // Log connection errors
    pool.on('error', (err) => {
      console.error('Unexpected error on idle client', err);
      process.exit(-1);
    });
    
    return pool;
  } catch (error) {
    console.error('Failed to initialize database pool:', error);
    return null;
  }
};

// Execute a query and return the results
export const query = async <T>(text: string, params?: unknown[]): Promise<T[]> => {
  // Return empty array in browser
  if (isBrowser) {
    console.warn('Database query attempted in browser environment');
    return [] as T[];
  }
  
  const client = await getClient();
  if (!client) return [] as T[];
  
  try {
    const result = await client.query(text, params);
    return result.rows as T[];
  } catch (error) {
    console.error('Query error:', error);
    return [] as T[];
  } finally {
    if (client) client.release();
  }
};

// Get a client from the pool
export const getClient = async (): Promise<PoolClient | null> => {
  // Return null in browser
  if (isBrowser) {
    console.warn('Database client requested in browser environment');
    return null;
  }
  
  if (!pool) {
    pool = initDb();
  }
  
  if (!pool) return null;
  
  try {
    return await pool.connect();
  } catch (error) {
    console.error('Failed to get client from pool:', error);
    return null;
  }
};

// Run a transaction
export const transaction = async <T>(
  callback: (client: PoolClient) => Promise<T>
): Promise<T | null> => {
  // Return null in browser
  if (isBrowser) {
    console.warn('Database transaction attempted in browser environment');
    return null;
  }
  
  const client = await getClient();
  if (!client) return null;
  
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    if (client) client.release();
  }
};
