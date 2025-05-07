// import { Pool } from 'pg';
// import { getDbConfig } from './config';

// const config = getDbConfig();

// const pool = new Pool({
//   host: config.host,
//   port: config.port,
//   database: config.database,
//   user: config.user,
//   password: config.password,
//   ssl: config.ssl
// });

// // Test the connection
// pool.query('SELECT NOW()', (err) => {
//   if (err) {
//     console.error('Error connecting to PostgreSQL:', err);
//   } else {
//     console.log('Connected to PostgreSQL database');
//   }
// });

// // Add this new query function
// export const query = async <T = Record<string, unknown>>(text: string, params?: unknown[]): Promise<T[]> => {
//   const client = await pool.connect();
//   try {
//     const result = await client.query(text, params);
//     return result.rows;
//   } finally {
//     client.release();
//   }
// };

// // Export the raw pool for transactions if needed
// export { pool }; // Ensure pool is exported only once