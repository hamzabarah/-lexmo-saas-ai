import { redirect } from "next/navigation";
import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";

export default async function DashboardPage() {
    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) redirect('/login');

    // Check plan to redirect to correct dashboard
    const admin = createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: subscription } = await admin
        .from('user_subscriptions')
        .select('plan')
        .eq('email', user.email!)
        .eq('status', 'active')
        .single();

    if (subscription?.plan === 'diagnostic') {
        redirect('/dashboard/coaching');
    } else {
        redirect('/dashboard/phases');
    }
}
