import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Read the lesson content from the markdown file
const lessonContentPath = join(__dirname, '..', 'content', 'lessons', 'phase-1', 'module-01', 'lesson-01.md');
const fileContent = readFileSync(lessonContentPath, 'utf-8');

// Extract the markdown content (everything after the frontmatter)
const contentMatch = fileContent.match(/---\n[\s\S]*?\n---\n([\s\S]*)/);
const lessonContent = contentMatch ? contentMatch[1].trim() : '';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://ruhkuamtmgzjkcdyrpel.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aGt1YW10bWd6amtjZHlycGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODcwMzcwNSwiZXhwIjoyMDg0Mjc5NzA1fQ.W4wsKofubQAWladqLvPyy6L68eBEI_RtK0bwChbTuc0';

const supabase = createClient(supabaseUrl, supabaseKey);

async function updateLesson1() {
    console.log('🚀 Starting Lesson 1 content update...');
    console.log(`📄 Content length: ${lessonContent.length} characters`);

    try {
        // Get the module ID for Phase 1, Module 1
        const { data: phases, error: phaseError } = await supabase
            .from('phases')
            .select('id')
            .eq('phase_number', 1)
            .single();

        if (phaseError) throw phaseError;

        const { data: modules, error: moduleError } = await supabase
            .from('modules')
            .select('id')
            .eq('phase_id', phases.id)
            .eq('module_number', 1)
            .single();

        if (moduleError) throw moduleError;

        console.log(`📦 Found Module ID: ${modules.id}`);

        // Update the lesson
        const { data, error } = await supabase
            .from('lessons')
            .update({
                content_ar: lessonContent,
                duration_minutes: 30,
                updated_at: new Date().toISOString()
            })
            .eq('module_id', modules.id)
            .eq('lesson_number', 1)
            .select();

        if (error) throw error;

        console.log('✅ Lesson 1 updated successfully!');
        console.log(`📊 Updated lesson:`, data[0]?.title_ar);
        console.log(`📝 Content length: ${data[0]?.content_ar?.length} characters`);

        // Verify the update
        const { data: verifyData, error: verifyError } = await supabase
            .from('lessons')
            .select('title_ar, duration_minutes, content_ar')
            .eq('module_id', modules.id)
            .eq('lesson_number', 1)
            .single();

        if (verifyError) throw verifyError;

        console.log('\n🔍 VERIFICATION:');
        console.log(`   Title: ${verifyData.title_ar}`);
        console.log(`   Duration: ${verifyData.duration_minutes} minutes`);
        console.log(`   Content length: ${verifyData.content_ar.length} characters`);
        console.log(`   Preview: ${verifyData.content_ar.substring(0, 100)}...`);

        return data;
    } catch (error) {
        console.error('❌ Error updating lesson:', error);
        throw error;
    }
}

// Run the update
updateLesson1()
    .then(() => {
        console.log('\n🎉 All done!');
        process.exit(0);
    })
    .catch((error) => {
        console.error('\n💥 Failed:', error.message);
        process.exit(1);
    });
