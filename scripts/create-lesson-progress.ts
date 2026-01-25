import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://ruhkuamtmgzjkcdyrpel.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aGt1YW10bWd6amtjZHlycGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODcwMzcwNSwiZXhwIjoyMDg0Mjc5NzA1fQ.W4wsKofubQAWladqLvPyy6L68eBEI_RtK0bwChbTuc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function createLessonProgressTable() {
    console.log('🚀 Creating lesson_progress table...');

    try {
        // Read the SQL file
        const sqlPath = join(__dirname, '..', 'supabase', 'create_lesson_progress_table.sql');
        const sql = readFileSync(sqlPath, 'utf-8');

        console.log('📄 SQL file loaded, executing...');

        // Execute the SQL (note: this uses the REST API, not direct SQL execution)
        // We'll need to execute it via the Supabase dashboard or use a different approach

        console.log('⚠️  Note: SQL must be executed via Supabase dashboard SQL editor');
        console.log('📋 Path to SQL file:', sqlPath);
        console.log('\n✅ Please execute the SQL file manually in Supabase dashboard');
        console.log('   OR use: psql with your database connection string');

        return true;
    } catch (error) {
        console.error('❌ Error:', error);
        throw error;
    }
}

// Run
createLessonProgressTable()
    .then(() => {
        console.log('\n🎉 Task preparation complete!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Failed:', error.message);
        process.exit(1);
    });
