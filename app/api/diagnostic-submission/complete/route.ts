import { NextResponse } from 'next/server';
import { createClient } from '@/utils/supabase/server';
import { createClient as createAdminClient } from '@supabase/supabase-js';
import { Resend } from 'resend';
import { sendTelegramAdminMessage } from '@/lib/telegram';
import {
    countAnsweredQuestions,
    countVisibleQuestions,
    type ResponsesMap,
} from '@/lib/diagnostic-questions';

export const dynamic = 'force-dynamic';

const ADMIN_EMAIL = 'academyfrance75@gmail.com';
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@ecomy.ai';

function getAdmin() {
    return createAdminClient(
        process.env.SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
        { auth: { autoRefreshToken: false, persistSession: false } }
    );
}

export async function POST() {
    try {
        const supabase = await createClient();
        const { data: { user }, error: authError } = await supabase.auth.getUser();
        if (authError || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const admin = getAdmin();
        const { data: submission } = await admin
            .from('diagnostic_submissions')
            .select('*')
            .eq('user_id', user.id)
            .maybeSingle();
        if (!submission) {
            return NextResponse.json({ error: 'No submission' }, { status: 404 });
        }
        if (submission.status !== 'in_progress') {
            return NextResponse.json({ submission, alreadyFinalized: true });
        }

        const responses = (submission.responses as ResponsesMap) || {};
        const total = countVisibleQuestions(responses);
        const answered = countAnsweredQuestions(responses);
        if (answered < total) {
            return NextResponse.json({
                error: 'Not all visible questions answered',
                answered,
                total,
            }, { status: 400 });
        }

        const now = new Date().toISOString();
        const { data: updated, error } = await admin
            .from('diagnostic_submissions')
            .update({
                status: 'analyzing',
                completed_at: now,
                updated_at: now,
            })
            .eq('user_id', user.id)
            .select()
            .single();
        if (error) throw error;

        // Best-effort notifications — never fail the request if these throw.
        const clientName = (responses['1']?.answer as string) || user.email || 'عميل جديد';
        const adminUrl = 'https://ecomy.ai/dashboard/admin';

        const telegramText = `🔔 <b>ديانوستيك جديد</b>\n\n<b>${escapeHtml(clientName)}</b> كمل الاستبيان.\n\nشوف الأجوبة في لوحة الإدارة:\n${adminUrl}`;
        sendTelegramAdminMessage(telegramText).catch(err => console.error('Telegram notify failed:', err));

        if (process.env.RESEND_API_KEY) {
            const resend = new Resend(process.env.RESEND_API_KEY);
            resend.emails.send({
                from: `ECOMY <${FROM_EMAIL}>`,
                to: ADMIN_EMAIL,
                subject: `🔔 ديانوستيك جديد — ${clientName}`,
                html: `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
    <tr><td align="center">
      <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
        <tr><td style="background-color:#0A0A0A;padding:30px;text-align:center;">
          <h1 style="margin:0;font-size:32px;font-weight:bold;color:#C5A04E;letter-spacing:2px;">ECOMY</h1>
        </td></tr>
        <tr><td style="padding:40px 30px;">
          <h2 style="margin:0 0 20px;font-size:24px;color:#1a1a1a;text-align:center;">🔔 ديانوستيك جديد</h2>
          <p style="margin:0 0 20px;font-size:16px;color:#555;text-align:center;line-height:1.8;">
            <strong>${escapeHtml(clientName)}</strong> كمل الاستبيان (${answered} سؤال).
          </p>
          <p style="margin:0 0 20px;font-size:14px;color:#888;text-align:center;">
            البريد: <span dir="ltr">${escapeHtml(user.email || '')}</span>
          </p>
          <table role="presentation" width="100%"><tr><td align="center" style="padding:10px 0 30px;">
            <a href="${adminUrl}" style="display:inline-block;background-color:#C5A04E;color:#fff;text-decoration:none;padding:14px 32px;border-radius:8px;font-size:16px;font-weight:bold;">
              فتح لوحة الإدارة
            </a>
          </td></tr></table>
        </td></tr>
      </table>
    </td></tr>
  </table>
</body>
</html>`.trim(),
            }).then(() => console.log('Admin email notification sent'))
              .catch(err => console.error('Resend notify failed:', err));
        }

        return NextResponse.json({ submission: updated });
    } catch (err: any) {
        return NextResponse.json({ error: err.message }, { status: 500 });
    }
}

function escapeHtml(s: string): string {
    return s.replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]!));
}
