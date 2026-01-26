import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = process.env.SUPABASE_URL || 'https://ruhkuamtmgzjkcdyrpel.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aGt1YW10bWd6amtjZHlycGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODcwMzcwNSwiZXhwIjoyMDg0Mjc5NzA1fQ.W4wsKofubQAWladqLvPyy6L68eBEI_RtK0bwChbTuc0';

const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Extract tasks from markdown content
 * Looks for lines starting with "- [ ]"
 */
function extractTasksFromMarkdown(markdown: string): string[] {
    const tasks: string[] = [];
    const lines = markdown.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        // Match "- [ ]" format exactly
        const match = trimmed.match(/^-\s+\[\s*\]\s+(.+)$/);
        if (match) {
            const taskText = match[1].trim();
            // Remove markdown bold markers if present
            const cleanText = taskText.replace(/\*\*/g, '');
            tasks.push(cleanText);
        }
    }

    return tasks;
}

/**
 * Extract tasks for a specific lesson and insert them into the tasks table
 */
async function extractAndInjectTasksForLesson(
    phaseNumber: number,
    moduleNumber: number,
    lessonNumber: number
) {
    console.log(`\n📚 Processing Phase ${phaseNumber}, Module ${moduleNumber}, Lesson ${lessonNumber}...`);

    try {
        // 1. Get the phase
        const { data: phase, error: phaseError } = await supabase
            .from('phases')
            .select('id')
            .eq('phase_number', phaseNumber)
            .single();

        if (phaseError || !phase) {
            console.error(`❌ Phase ${phaseNumber} not found`);
            return;
        }

        // 2. Get the module
        const { data: module, error: moduleError } = await supabase
            .from('modules')
            .select('id')
            .eq('phase_id', phase.id)
            .eq('module_number', moduleNumber)
            .single();

        if (moduleError || !module) {
            console.error(`❌ Module ${moduleNumber} not found`);
            return;
        }

        // 3. Get the lesson
        const { data: lesson, error: lessonError } = await supabase
            .from('lessons')
            .select('id, content_ar, title_ar')
            .eq('module_id', module.id)
            .eq('lesson_number', lessonNumber)
            .single();

        if (lessonError || !lesson) {
            console.error(`❌ Lesson ${lessonNumber} not found`);
            return;
        }

        console.log(`📖 Found lesson: ${lesson.title_ar}`);
        console.log(`📝 Content length: ${lesson.content_ar.length} characters`);

        // 4. Extract tasks from markdown
        const tasks = extractTasksFromMarkdown(lesson.content_ar);
        console.log(`🔍 Found ${tasks.length} tasks in markdown`);

        if (tasks.length === 0) {
            console.log('⚠️  No tasks found in this lesson');
            return;
        }

        // Display tasks
        tasks.forEach((task, i) => {
            console.log(`   ${i + 1}. ${task.substring(0, 60)}${task.length > 60 ? '...' : ''}`);
        });

        // 5. Delete existing tasks for this lesson (to avoid duplicates)
        const { error: deleteError } = await supabase
            .from('tasks')
            .delete()
            .eq('lesson_id', lesson.id);

        if (deleteError) {
            console.warn(`⚠️  Could not delete existing tasks: ${deleteError.message}`);
        }

        // 6. Insert new tasks
        const tasksToInsert = tasks.map((taskText, index) => ({
            lesson_id: lesson.id,
            task_text_ar: taskText,
            order_index: index + 1,
        }));

        const { data: insertedTasks, error: insertError } = await supabase
            .from('tasks')
            .insert(tasksToInsert)
            .select();

        if (insertError) {
            console.error(`❌ Error inserting tasks: ${insertError.message}`);
            return;
        }

        console.log(`✅ Successfully inserted ${insertedTasks?.length || 0} tasks!`);

    } catch (error: any) {
        console.error(`❌ Error: ${error.message}`);
    }
}

/**
 * Extract tasks for all lessons (batch processing)
 */
async function extractTasksForAllLessons() {
    console.log('🚀 Starting task extraction for all lessons...\n');

    try {
        // Get all lessons with content
        const { data: lessons, error } = await supabase
            .from('lessons')
            .select(`
        id,
        lesson_number,
        content_ar,
        title_ar,
        module_id,
        modules!inner (
          module_number,
          phase_id,
          phases!inner (
            phase_number
          )
        )
      `)
            .not('content_ar', 'is', null)
            .order('id');

        if (error) {
            console.error('❌ Error fetching lessons:', error);
            return;
        }

        console.log(`📚 Found ${lessons?.length || 0} lessons with content\n`);

        let totalTasksExtracted = 0;

        for (const lesson of lessons || []) {
            const phaseNumber = (lesson.modules as any).phases.phase_number;
            const moduleNumber = (lesson.modules as any).module_number;

            console.log(`\n📖 Processing: Phase ${phaseNumber}, Module ${moduleNumber}, Lesson ${lesson.lesson_number}`);
            console.log(`   Title: ${lesson.title_ar}`);

            // Extract tasks
            const tasks = extractTasksFromMarkdown(lesson.content_ar);

            if (tasks.length > 0) {
                console.log(`   🔍 Found ${tasks.length} tasks`);

                // Delete existing
                await supabase.from('tasks').delete().eq('lesson_id', lesson.id);

                // Insert new
                const tasksToInsert = tasks.map((taskText, index) => ({
                    lesson_id: lesson.id,
                    task_text_ar: taskText,
                    order_index: index + 1,
                }));

                const { error: insertError } = await supabase
                    .from('tasks')
                    .insert(tasksToInsert);

                if (insertError) {
                    console.error(`   ❌ Error inserting tasks: ${insertError.message}`);
                } else {
                    console.log(`   ✅ Inserted ${tasks.length} tasks`);
                    totalTasksExtracted += tasks.length;
                }
            } else {
                console.log(`   ⚠️  No tasks found`);
            }
        }

        console.log(`\n🎉 Complete! Total tasks extracted: ${totalTasksExtracted}`);

    } catch (error: any) {
        console.error(`❌ Error: ${error.message}`);
    }
}

// Run the script
const args = process.argv.slice(2);

if (args.length === 3) {
    // Single lesson mode
    const [phase, module, lesson] = args.map(Number);
    extractAndInjectTasksForLesson(phase, module, lesson)
        .then(() => {
            console.log('\n✅ Done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Failed:', error.message);
            process.exit(1);
        });
} else if (args[0] === 'all') {
    // All lessons mode
    extractTasksForAllLessons()
        .then(() => {
            console.log('\n✅ All done!');
            process.exit(0);
        })
        .catch((error) => {
            console.error('\n❌ Failed:', error.message);
            process.exit(1);
        });
} else {
    console.log('Usage:');
    console.log('  Single lesson: npx tsx scripts/extract-tasks.ts <phase> <module> <lesson>');
    console.log('  Example:       npx tsx scripts/extract-tasks.ts 1 1 1');
    console.log('');
    console.log('  All lessons:   npx tsx scripts/extract-tasks.ts all');
    process.exit(1);
}
