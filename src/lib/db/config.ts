// Database configuration
export interface DbConfig {
  host: string;
  port: number;
  database: string;
  user: string;
  password: string;
  ssl?: boolean | { rejectUnauthorized: boolean };
}

// Get database configuration from environment variables
export const getDbConfig = (): DbConfig => {
  return {
    host: import.meta.env.VITE_DB_HOST || 'localhost',
    port: parseInt(import.meta.env.VITE_DB_PORT || '5432', 10),
    database: import.meta.env.VITE_DB_NAME || 'yooboba_db',
    user: import.meta.env.VITE_DB_USER || 'postgres',
    password: import.meta.env.VITE_DB_PASSWORD || '',
    ssl: import.meta.env.VITE_DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
};