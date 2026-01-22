import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// Generate a secure random password
function generatePassword(length: number = 8): string {
    const lowercase = 'abcdefghijklmnopqrstuvwxyz';
    const uppercase = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const numbers = '0123456789';
    const all = lowercase + uppercase + numbers;

    let password = '';
    // Ensure at least one of each type
    password += lowercase[Math.floor(Math.random() * lowercase.length)];
    password += uppercase[Math.floor(Math.random() * uppercase.length)];
    password += numbers[Math.floor(Math.random() * numbers.length)];

    // Fill the rest randomly
    for (let i = 3; i < length; i++) {
        password += all[Math.floor(Math.random() * all.length)];
    }

    // Shuffle the password
    return password.split('').sort(() => Math.random() - 0.5).join('');
}

export async function POST(request: NextRequest) {
    try {
        // Verify admin access
        const authHeader = request.headers.get('authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Get request body
        const body = await request.json();
        const { name, email, plan, adminEmail } = body;

        // Verify admin email
        if (adminEmail !== 'academyfrance75@gmail.com') {
            return NextResponse.json({ error: 'Unauthorized: Admin access only' }, { status: 403 });
        }

        // Validate inputs
        if (!name || !email || !plan) {
            return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
        }

        // Check if SUPABASE_SERVICE_ROLE_KEY exists
        const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
        if (!serviceRoleKey) {
            return NextResponse.json({
                error: 'SUPABASE_SERVICE_ROLE_KEY not configured',
                help: 'Please add SUPABASE_SERVICE_ROLE_KEY to your .env.local file'
            }, { status: 500 });
        }

        // Create Supabase Admin Client
        const supabaseAdmin = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            serviceRoleKey,
            {
                auth: {
                    autoRefreshToken: false,
                    persistSession: false
                }
            }
        );

        // Generate password
        const password = generatePassword(8);

        // Create user in Supabase Auth
        const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
            email,
            password,
            email_confirm: true, // Auto-confirm email
            user_metadata: {
                name
            }
        });

        if (authError) {
            return NextResponse.json({ error: authError.message }, { status: 400 });
        }

        const userId = authData.user.id;

        // Create entry in users table
        const { error: usersError } = await supabaseAdmin
            .from('users')
            .insert({
                id: userId,
                email,
                name,
                created_at: new Date().toISOString()
            });

        if (usersError) {
            console.error('Error creating user entry:', usersError);
        }

        // Create entry in user_subscriptions with active status
        const { error: subscriptionError } = await supabaseAdmin
            .from('user_subscriptions')
            .insert({
                user_id: userId,
                email,
                plan,
                status: 'active',
                activated_at: new Date().toISOString(),
                created_at: new Date().toISOString()
            });

        if (subscriptionError) {
            console.error('Error creating subscription:', subscriptionError);
            return NextResponse.json({ error: subscriptionError.message }, { status: 400 });
        }

        // Return success with generated password
        return NextResponse.json({
            success: true,
            user: {
                id: userId,
                email,
                name
            },
            password,
            plan
        });

    } catch (error: any) {
        console.error('Error in create-student API:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
