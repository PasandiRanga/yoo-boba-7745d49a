
import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

// Create a connection pool using environment variables
export const pool = new Pool({
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
