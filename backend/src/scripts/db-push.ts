import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { supabaseAdmin } from '../lib/supabase';

export async function runMigrations() {
  console.log('🗄️  Running database migrations...');
  
  const sqlDir = join(__dirname, '../../db/sql');
  const sqlFiles = readdirSync(sqlDir)
    .filter(file => file.endsWith('.sql'))
    .sort(); // Run in alphabetical order

  for (const file of sqlFiles) {
    console.log(`📄 Executing ${file}...`);
    
    try {
      const sqlContent = readFileSync(join(sqlDir, file), 'utf8');
      
      // Split by semicolon and execute each statement
      const statements = sqlContent
        .split(';')
        .map(stmt => stmt.trim())
        .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

      for (const statement of statements) {
        if (statement.trim()) {
          const { error } = await supabaseAdmin.rpc('exec_sql', { 
            sql: statement 
          });
          
          if (error) {
            console.error(`❌ Error in ${file}:`, error);
            throw error;
          }
        }
      }
      
      console.log(`✅ ${file} executed successfully`);
    } catch (error) {
      console.error(`❌ Failed to execute ${file}:`, error);
      throw error;
    }
  }
  
  console.log('🎉 All migrations completed successfully!');
}

// Run migrations if this script is called directly
if (require.main === module) {
  runMigrations()
    .then(() => process.exit(0))
    .catch((error) => {
      console.error('Migration failed:', error);
      process.exit(1);
    });
}