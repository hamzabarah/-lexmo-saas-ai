"use server";

import { createClient } from "@/utils/supabase/server";
import { createClient as createAdminClient } from "@supabase/supabase-js";
import { redirect } from "next/navigation";
import { headers } from "next/headers";

export async function login(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
    });

    if (error) {
        let errorMessage = "حدث خطأ أثناء تسجيل الدخول";
        if (error.message.includes("Invalid login credentials")) {
            errorMessage = "البريد الإلكتروني أو كلمة المرور غير صحيحة";
        }
        return { error: errorMessage };
    }

    return redirect("/dashboard");
}

export async function signup(formData: FormData) {
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;

    // Verify payment exists before allowing registration
    const admin = createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );

    const { data: subscription } = await admin
        .from("user_subscriptions")
        .select("id")
        .eq("email", email)
        .single();

    if (!subscription) {
        return {
            error: "هذا البريد الإلكتروني غير مرتبط بعملية دفع. يرجى الدفع أولاً",
        };
    }

    const supabase = await createClient();

    const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
            data: {
                name,
                phone,
                country,
            },
        },
    });

    if (error) {
        console.error("Signup Error:", error);
        if (error.message.includes("already registered")) {
            return { error: "هذا البريد الإلكتروني مسجل بالفعل. جرب تسجيل الدخول" };
        }
        return { error: error.message };
    }

    return redirect("/dashboard");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/");
}

export async function resetPassword(formData: FormData) {
    const email = formData.get("email") as string;
    const headersList = await headers();
    const origin = headersList.get("origin");
    const supabase = await createClient();

    const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${origin}/auth/callback?next=/dashboard/reset-password`,
    });

    if (error) {
        console.error("Reset Password Error:", error);
        return { error: "حدث خطأ أثناء إرسال الرابط. تأكد من صحة البريد الإلكتروني." };
    }

    return { success: true };
}

export async function updatePassword(formData: FormData) {
    const password = formData.get("password") as string;
    const supabase = await createClient();

    const { error } = await supabase.auth.updateUser({
        password: password
    });

    if (error) {
        return { error: "Erreur lors de la mise à jour du mot de passe." };
    }

    return { success: true };
}
