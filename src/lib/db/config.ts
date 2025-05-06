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
    host: process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.DB_PORT || '5432', 10),
    database: process.env.DB_NAME || 'yooboba_db',
    user: process.env.DB_USER || 'postgres',
    password: process.env.DB_PASSWORD || 'pasandi',
    ssl: process.env.DB_SSL === 'true' ? { rejectUnauthorized: false } : false
  };
};