import fs from 'fs';
import path from 'path';
import { Pool } from 'pg';
import { getDbConfig } from './config';

const setupDatabase = async () => {
  console.log('⏳ Connecting to database...');

  const config = getDbConfig();
  const pool = new Pool(config);

  try {
    console.log('📂 Reading schema.sql...');
    
    const schemaPath = path.join(path.resolve(), 'src', 'lib', 'db', 'schema.sql');
    console.log(`📄 Schema path: ${schemaPath}`);

    const schemaSql = fs.readFileSync(schemaPath, 'utf8');

    console.log('🚀 Executing SQL...');
    await pool.query(schemaSql);

    console.log('✅ Database setup complete!');
  } catch (error) {
    console.error('❌ Error setting up database:', error);
  } finally {
    await pool.end();
  }
};

// Run directly if not being imported
if (import.meta.url === `file://${process.argv[1]}`) {
  setupDatabase();
}

export default setupDatabase;