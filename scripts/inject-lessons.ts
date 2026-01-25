import { createClient } from '@supabase/supabase-js';
import * as fs from 'fs';
import * as path from 'path';
import matter from 'gray-matter';
import { config } from 'dotenv';

// Load environment variables from .env.local
config({ path: path.join(process.cwd(), '.env.local') });

// ====================================
// 🔧 CONFIGURATION
// ====================================

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SUPABASE_SERVICE_KEY) {
    console.error('❌ Missing environment variables!');
    console.error('Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local');
    process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY);

// ====================================
// 📝 TYPES
// ====================================

interface LessonMetadata {
    phase: number;
    module: number;
    lesson: number;
    title_ar: string;
    title_en?: string;
    duration_minutes?: number;
    difficulty?: string;
    badge?: string;
}

interface LessonData extends LessonMetadata {
    content_ar: string;
    tasks: string[];
}

interface InjectionResult {
    success: boolean;
    filename: string;
    error?: string;
}

// ====================================
// 🛠️ HELPER FUNCTIONS
// ====================================

/**
 * Parse un fichier markdown avec frontmatter YAML
 */
function parseMarkdownFile(filePath: string): LessonData | null {
    try {
        const fileContent = fs.readFileSync(filePath, 'utf-8');
        const { data, content } = matter(fileContent);

        // Validation des champs requis
        const required = ['phase', 'module', 'lesson', 'title_ar'];
        for (const field of required) {
            if (!(field in data)) {
                throw new Error(`Missing required field: ${field}`);
            }
        }

        // Extraire les tâches (lignes commençant par - [ ])
        const tasks = content
            .split('\n')
            .filter(line => line.trim().startsWith('- [ ]'))
            .map(line => line.replace('- [ ]', '').trim());

        return {
            phase: data.phase,
            module: data.module,
            lesson: data.lesson,
            title_ar: data.title_ar,
            title_en: data.title_en,
            duration_minutes: data.duration_minutes || 15,
            difficulty: data.difficulty || 'intermediate',
            badge: data.badge || '📚',
            content_ar: content.trim(),
            tasks,
        };
    } catch (error: any) {
        console.error(`❌ Error parsing ${filePath}:`, error.message);
        return null;
    }
}

/**
 * Récupère l'ID du module depuis Supabase
 */
async function getModuleId(phaseNumber: number, moduleNumber: number): Promise<string | null> {
    const { data: phase } = await supabase
        .from('phases')
        .select('id')
        .eq('phase_number', phaseNumber)
        .single();

    if (!phase) {
        console.error(`❌ Phase ${phaseNumber} not found`);
        return null;
    }

    const { data: module } = await supabase
        .from('modules')
        .select('id')
        .eq('phase_id', phase.id)
        .eq('module_number', moduleNumber)
        .single();

    if (!module) {
        console.error(`❌ Module ${moduleNumber} not found in Phase ${phaseNumber}`);
        return null;
    }

    return module.id;
}

/**
 * Récupère l'ID de la leçon depuis Supabase
 */
async function getLessonId(moduleId: string, lessonNumber: number): Promise<string | null> {
    const { data: lesson } = await supabase
        .from('lessons')
        .select('id')
        .eq('module_id', moduleId)
        .eq('lesson_number', lessonNumber)
        .single();

    return lesson?.id || null;
}

/**
 * Met à jour une leçon dans Supabase
 */
async function updateLesson(lessonData: LessonData, dryRun: boolean): Promise<InjectionResult> {
    const filename = `lesson-${String(lessonData.module).padStart(2, '0')}-${String(lessonData.lesson).padStart(2, '0')}.md`;

    if (dryRun) {
        console.log(`🔍 [DRY RUN] Would update: ${filename}`);
        return { success: true, filename };
    }

    try {
        // 1. Récupérer l'ID du module
        const moduleId = await getModuleId(lessonData.phase, lessonData.module);
        if (!moduleId) {
            return {
                success: false,
                filename,
                error: `Module not found: Phase ${lessonData.phase}, Module ${lessonData.module}`,
            };
        }

        // 2. Récupérer l'ID de la leçon
        const lessonId = await getLessonId(moduleId, lessonData.lesson);
        if (!lessonId) {
            return {
                success: false,
                filename,
                error: `Lesson not found: Module ${moduleId}, Lesson ${lessonData.lesson}`,
            };
        }

        // 3. Mettre à jour la leçon
        const { error: updateError } = await supabase
            .from('lessons')
            .update({
                title_ar: lessonData.title_ar,
                title_en: lessonData.title_en,
                content_ar: lessonData.content_ar,
                updated_at: new Date().toISOString(),
            })
            .eq('id', lessonId);

        if (updateError) {
            return {
                success: false,
                filename,
                error: `Supabase error: ${updateError.message}`,
            };
        }

        // 4. Ajouter les tâches (si présentes)
        if (lessonData.tasks.length > 0) {
            // D'abord, supprimer les anciennes tâches
            await supabase.from('lesson_tasks').delete().eq('lesson_id', lessonId);

            // Ensuite, insérer les nouvelles
            const tasksToInsert = lessonData.tasks.map((task, index) => ({
                lesson_id: lessonId,
                task_text_ar: task,
                task_order: index + 1,
            }));

            const { error: tasksError } = await supabase
                .from('lesson_tasks')
                .insert(tasksToInsert);

            if (tasksError) {
                console.warn(`⚠️  Tasks insertion failed for ${filename}: ${tasksError.message}`);
            }
        }

        return { success: true, filename };
    } catch (error: any) {
        return {
            success: false,
            filename,
            error: error.message,
        };
    }
}

/**
 * Scanne un dossier et retourne tous les fichiers .md
 */
function getAllMarkdownFiles(dir: string): string[] {
    const files: string[] = [];

    function scanDir(currentDir: string) {
        const entries = fs.readdirSync(currentDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(currentDir, entry.name);

            if (entry.isDirectory()) {
                scanDir(fullPath);
            } else if (entry.isFile() && entry.name.endsWith('.md')) {
                files.push(fullPath);
            }
        }
    }

    scanDir(dir);
    return files;
}

// ====================================
// 🚀 MAIN FUNCTION
// ====================================

async function main() {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const moduleFilter = args.find(arg => arg.startsWith('--module='))?.split('=')[1];

    console.log('🚀 Starting lesson injection...\n');

    if (dryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made\n');
    }

    // Dossier contenant les fichiers markdown
    const contentDir = path.join(process.cwd(), 'content', 'lessons');

    if (!fs.existsSync(contentDir)) {
        console.error(`❌ Content directory not found: ${contentDir}`);
        console.error('Please create the directory and add your lesson files.');
        process.exit(1);
    }

    // Scanner tous les fichiers markdown
    const markdownFiles = getAllMarkdownFiles(contentDir);

    if (markdownFiles.length === 0) {
        console.error('❌ No markdown files found!');
        process.exit(1);
    }

    console.log(`📂 Found ${markdownFiles.length} markdown files\n`);

    // Statistiques
    let successCount = 0;
    let errorCount = 0;
    const errors: InjectionResult[] = [];

    // Traiter chaque fichier
    for (let i = 0; i < markdownFiles.length; i++) {
        const file = markdownFiles[i];
        const lessonData = parseMarkdownFile(file);

        if (!lessonData) {
            errorCount++;
            errors.push({
                success: false,
                filename: path.basename(file),
                error: 'Failed to parse file',
            });
            continue;
        }

        // Filtrer par module si spécifié
        if (moduleFilter && lessonData.module !== parseInt(moduleFilter)) {
            continue;
        }

        // Afficher la progression
        const progress = `[${i + 1}/${markdownFiles.length}]`;
        console.log(`${progress} Processing: ${path.basename(file)}`);
        console.log(`   Module ${lessonData.module}, Lesson ${lessonData.lesson}: ${lessonData.title_ar}`);

        // Injecter la leçon
        const result = await updateLesson(lessonData, dryRun);

        if (result.success) {
            console.log(`   ✅ Success\n`);
            successCount++;
        } else {
            console.log(`   ❌ Error: ${result.error}\n`);
            errorCount++;
            errors.push(result);
        }

        // Petite pause pour ne pas surcharger Supabase
        await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Rapport final
    console.log('━'.repeat(60));
    console.log('📊 INJECTION SUMMARY');
    console.log('━'.repeat(60));
    console.log(`✅ Successful: ${successCount}`);
    console.log(`❌ Failed: ${errorCount}`);
    console.log(`📁 Total: ${markdownFiles.length}`);

    if (errors.length > 0) {
        console.log('\n❌ ERRORS:');
        errors.forEach(err => {
            console.log(`   - ${err.filename}: ${err.error}`);
        });
    }

    console.log('\n🎉 Injection complete!');
}

// Exécuter le script
main().catch(console.error);
