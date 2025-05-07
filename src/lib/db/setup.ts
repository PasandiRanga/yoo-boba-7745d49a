
import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { getDbConfig } from './config';

const setupDatabase = async () => {
  const config = getDbConfig();
  const pool = new Pool(config);

  try {
    console.log('Setting up database...');
    
    // Read schema SQL file
    const schemaPath = path.join(__dirname, 'schema.sql');
    const schemaSql = fs.readFileSync(schemaPath, 'utf8');
    
    // Execute schema SQL
    await pool.query(schemaSql);
    
    console.log('Database setup complete!');
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
};

// Run setup if this file is executed directly
if (require.main === module) {
  setupDatabase();
}

export default setupDatabase;