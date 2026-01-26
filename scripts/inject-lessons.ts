import { createClient } from '@supabase/supabase-js';
import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import matter from 'gray-matter';

// Initialize Supabase
const supabaseUrl = process.env.SUPABASE_URL || 'https://ruhkuamtmgzjkcdyrpel.supabase.co';
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJ1aGt1YW10bWd6amtjZHlycGVsIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODcwMzcwNSwiZXhwIjoyMDg0Mjc5NzA1fQ.W4wsKofubQAWladqLvPyy6L68eBEI_RtK0bwChbTuc0';
const supabase = createClient(supabaseUrl, supabaseKey);

/**
 * Extract tasks from markdown
 */
function extractTasks(markdown: string): string[] {
    const tasks: string[] = [];
    const lines = markdown.split('\n');

    for (const line of lines) {
        const trimmed = line.trim();
        const match = trimmed.match(/^-\s+\[\s*\]\s+(.+)$/);
        if (match) {
            const taskText = match[1].trim().replace(/\*\*/g, '');
            tasks.push(taskText);
        }
    }

    return tasks;
}

/**
 * Get module ID from phase and module numbers
 */
async function getModuleId(phaseNumber: number, moduleNumber: number): Promise<string | null> {
    const { data: phase } = await supabase
        .from('phases')
        .select('id')
        .eq('phase_number', phaseNumber)
        .single();

    if (!phase) return null;

    const { data: module } = await supabase
        .from('modules')
        .select('id')
        .eq('phase_id', phase.id)
        .eq('module_number', moduleNumber)
        .single();

    return module?.id || null;
}

/**
 * Inject a single lesson
 */
async function injectLesson(
    filePath: string,
    metadata: any,
    content: string,
    moduleId: string
) {
    console.log(`\n📖 Injecting: Phase ${metadata.phase}, Module ${metadata.module}, Lesson ${metadata.lesson}`);
    console.log(`   Title: ${metadata.title_ar}`);

    try {
        // 1. Check if lesson already exists
        const { data: existing } = await supabase
            .from('lessons')
            .select('id')
            .eq('module_id', moduleId)
            .eq('lesson_number', metadata.lesson)
            .single();

        if (existing) {
            console.log(`   ⚠️  Lesson already exists, updating...`);

            // Update existing
            const { error: updateError } = await supabase
                .from('lessons')
                .update({
                    title_ar: metadata.title_ar,
                    title_en: metadata.title_en || '',
                    content_ar: content,
                    duration_minutes: metadata.duration_minutes || 30,
                    updated_at: new Date().toISOString(),
                })
                .eq('id', existing.id);

            if (updateError) {
                console.error(`   ❌ Update error:`, updateError.message);
                return null;
            }

            return existing.id;
        }

        // 2. Insert new lesson
        const { data: lesson, error: insertError } = await supabase
            .from('lessons')
            .insert({
                module_id: moduleId,
                lesson_number: metadata.lesson,
                title_ar: metadata.title_ar,
                title_en: metadata.title_en || '',
                content_ar: content,
                duration_minutes: metadata.duration_minutes || 30,
                is_locked: false,
            })
            .select()
            .single();

        if (insertError) {
            console.error(`   ❌ Insert error:`, insertError.message);
            return null;
        }

        console.log(`   ✅ Lesson inserted successfully!`);
        return lesson.id;

    } catch (error: any) {
        console.error(`   ❌ Error:`, error.message);
        return null;
    }
}

/**
 * Inject tasks for a lesson
 */
async function injectTasks(lessonId: string, content: string) {
    const tasks = extractTasks(content);

    if (tasks.length === 0) {
        console.log(`   ⚠️  No tasks found`);
        return;
    }

    console.log(`   🔍 Found ${tasks.length} tasks`);

    // Delete existing tasks
    await supabase.from('tasks').delete().eq('lesson_id', lessonId);

    // Insert new tasks
    const tasksToInsert = tasks.map((taskText, index) => ({
        lesson_id: lessonId,
        task_text_ar: taskText,
        order_index: index + 1,
    }));

    const { error } = await supabase.from('tasks').insert(tasksToInsert);

    if (error) {
        console.error(`   ❌ Task insert error:`, error.message);
    } else {
        console.log(`   ✅ ${tasks.length} tasks injected`);
    }
}

/**
 * Process all lessons in a directory
 */
async function processLessonsDirectory(dirPath: string, phaseNumber?: number, moduleNumber?: number) {
    console.log(`\n🚀 Processing directory: ${dirPath}\n`);

    let totalInjected = 0;
    let totalTasks = 0;

    try {
        // Get all markdown files
        const files = readdirSync(dirPath)
            .filter(f => f.endsWith('.md'))
            .sort();

        console.log(`📚 Found ${files.length} lesson files\n`);

        for (const file of files) {
            const filePath = join(dirPath, file);

            try {
                // Read and parse file
                const fileContent = readFileSync(filePath, 'utf-8');
                const { data: metadata, content } = matter(fileContent);

                // Validate metadata
                if (!metadata.phase || !metadata.module || !metadata.lesson) {
                    console.log(`\n⚠️  Skipping ${file}: Missing required metadata`);
                    continue;
                }

                // Skip if filtering by phase/module
                if (phaseNumber && metadata.phase !== phaseNumber) continue;
                if (moduleNumber && metadata.module !== moduleNumber) continue;

                // Get module ID
                const moduleId = await getModuleId(metadata.phase, metadata.module);
                if (!moduleId) {
                    console.log(`\n❌ Module not found for Phase ${metadata.phase}, Module ${metadata.module}`);
                    continue;
                }

                // Inject lesson
                const lessonId = await injectLesson(filePath, metadata, content, moduleId);

                if (!lessonId) {
                    console.log(`   ❌ Failed to inject lesson`);
                    continue;
                }

                // Inject tasks
                await injectTasks(lessonId, content);

                totalInjected++;
                const tasks = extractTasks(content);
                totalTasks += tasks.length;

            } catch (error: any) {
                console.error(`\n❌ Error processing ${file}:`, error.message);
            }
        }

        console.log(`\n${'='.repeat(60)}`);
        console.log(`🎉 COMPLETE!`);
        console.log(`   Lessons injected: ${totalInjected}`);
        console.log(`   Total tasks: ${totalTasks}`);
        console.log(`${'='.repeat(60)}\n`);

    } catch (error: any) {
        console.error(`❌ Directory error:`, error.message);
    }
}

/**
 * Main execution
 */
async function main() {
    const args = process.argv.slice(2);

    // Parse arguments
    let dirPath = 'content/lessons/phase-1/module-01';
    let phaseFilter: number | undefined;
    let moduleFilter: number | undefined;

    for (const arg of args) {
        if (arg.startsWith('--dir=')) {
            dirPath = arg.split('=')[1];
        } else if (arg.startsWith('--phase=')) {
            phaseFilter = parseInt(arg.split('=')[1]);
        } else if (arg.startsWith('--module=')) {
            moduleFilter = parseInt(arg.split('=')[1]);
        }
    }

    console.log(`\n${'='.repeat(60)}`);
    console.log(`📚 LESSON INJECTION SCRIPT`);
    console.log(`${'='.repeat(60)}`);
    console.log(`Directory: ${dirPath}`);
    if (phaseFilter) console.log(`Phase filter: ${phaseFilter}`);
    if (moduleFilter) console.log(`Module filter: ${moduleFilter}`);
    console.log(`${'='.repeat(60)}`);

    await processLessonsDirectory(dirPath, phaseFilter, moduleFilter);
}

// Run
main()
    .then(() => process.exit(0))
    .catch((error) => {
        console.error('\n💥 Fatal error:', error);
        process.exit(1);
    });
