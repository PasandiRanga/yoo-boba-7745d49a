
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool using environment variables
const pool = new Pool({
  host: process.env.DB_HOST || 'localhost',
  port: Number(process.env.DB_PORT) || 5432,
  database: process.env.DB_NAME || 'yooboba_db',
  user: process.env.DB_USER || 'postgres',
  password: process.env.DB_PASSWORD || 'pasandi',
  ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false,
});

// Test the connection
pool.query('SELECT NOW()', (err) => {
  if (err) {
    console.error('Error connecting to database:', err);
  } else {
    console.log('Connected to PostgreSQL database successfully');
  }
});

// Add query function to execute basic database queries
export const query = async <T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> => {
  const client = await pool.connect();
  try {
    const result = await client.query(text, params);
    return result.rows;
  } finally {
    client.release();
  }
};

// Add transaction function to execute multiple queries in a transaction
export const transaction = async <T>(callback: (client: any) => Promise<T>): Promise<T> => {
  const client = await pool.connect();
  try {
    await client.query('BEGIN');
    const result = await callback(client);
    await client.query('COMMIT');
    return result;
  } catch (error) {
    await client.query('ROLLBACK');
    throw error;
  } finally {
    client.release();
  }
};

// Export the pool for direct access if needed
export { pool };
