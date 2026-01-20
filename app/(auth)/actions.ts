"use server";

import { createClient } from "@/utils/supabase/server";
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
    const headersList = await headers();
    const origin = headersList.get("origin");
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;
    const name = formData.get("name") as string;
    const phone = formData.get("phone") as string;
    const country = formData.get("country") as string;

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
        return { error: error.message }; // Temporarily return raw error for debugging
    }

    return redirect("/dashboard");
}

export async function logout() {
    const supabase = await createClient();
    await supabase.auth.signOut();
    return redirect("/login");
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
