import { Resend } from 'resend';

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'noreply@ecomy.ai';

export async function sendActivationEmail(toEmail: string, plan: string = 'ecommerce') {
    const isFormation = plan !== 'diagnostic';

    const subject = isFormation
        ? '🎉 تم تفعيل حسابك في ECOMY'
        : '✅ تم تأكيد حجز جلسة التشخيص';

    const bodyTitle = isFormation
        ? 'مرحباً! تم تفعيل حسابك بنجاح 🎉'
        : 'تم تأكيد حجزك! جلسة التشخيص جاهزة ✅';

    const bodyText = isFormation
        ? 'يمكنك الآن الوصول إلى جميع الدروس والمراحل التعليمية'
        : 'يمكنك الآن إنشاء حسابك وحجز موعد جلسة التشخيص الخاصة بك';

    const ctaText = isFormation
        ? 'ابدأ التعلم الآن'
        : 'احجز موعد جلستك';

    const ctaColor = isFormation ? '#008060' : '#E8600A';

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">

                    <!-- Header -->
                    <tr>
                        <td style="background-color:#0A0A0A;padding:30px;text-align:center;">
                            <h1 style="margin:0;font-size:32px;font-weight:bold;color:#C5A04E;letter-spacing:2px;">ECOMY</h1>
                        </td>
                    </tr>

                    <!-- Body -->
                    <tr>
                        <td style="padding:40px 30px;">
                            <h2 style="margin:0 0 20px;font-size:24px;color:#1a1a1a;text-align:center;">
                                ${bodyTitle}
                            </h2>

                            <p style="margin:0 0 30px;font-size:16px;color:#555555;text-align:center;line-height:1.8;">
                                ${bodyText}
                            </p>

                            <!-- CTA Button -->
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:10px 0 30px;">
                                        <a href="https://ecomy.ai/register?email=${encodeURIComponent(toEmail)}" style="display:inline-block;background-color:${ctaColor};color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:18px;font-weight:bold;">
                                            ${ctaText}
                                        </a>
                                    </td>
                                </tr>
                            </table>

                            <hr style="border:none;border-top:1px solid #eeeeee;margin:20px 0;" />

                            <p style="margin:0;font-size:14px;color:#999999;text-align:center;line-height:1.8;">
                                إذا كان لديك أي سؤال، تواصل معنا على
                                <a href="mailto:academyfrance75@gmail.com" style="color:${ctaColor};text-decoration:none;">academyfrance75@gmail.com</a>
                            </p>
                        </td>
                    </tr>

                    <!-- Footer -->
                    <tr>
                        <td style="background-color:#fafafa;padding:20px 30px;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#bbbbbb;">
                                © ${new Date().getFullYear()} ECOMY. جميع الحقوق محفوظة.
                            </p>
                        </td>
                    </tr>

                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const { data, error } = await resend.emails.send({
        from: `ECOMY <${FROM_EMAIL}>`,
        to: toEmail,
        subject,
        html,
    });

    if (error) {
        console.error('Failed to send activation email:', error);
        throw error;
    }

    console.log(`✅ Activation email sent to ${toEmail} (plan: ${plan})`, data);
    return data;
}

export async function sendBookingConfirmationEmail(toEmail: string, bookingDate: string) {
    const date = new Date(bookingDate);
    const dateStr = date.toLocaleDateString('ar-u-nu-latn', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
    const timeStr = date.toLocaleTimeString('ar-u-nu-latn', { hour: '2-digit', minute: '2-digit' });

    const html = `
<!DOCTYPE html>
<html dir="rtl" lang="ar">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
</head>
<body style="margin:0;padding:0;background-color:#f4f4f4;font-family:Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f4f4f4;padding:40px 0;">
        <tr>
            <td align="center">
                <table role="presentation" width="600" cellpadding="0" cellspacing="0" style="background-color:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 4px 20px rgba(0,0,0,0.08);">
                    <tr>
                        <td style="background-color:#0A0A0A;padding:30px;text-align:center;">
                            <h1 style="margin:0;font-size:32px;font-weight:bold;color:#C5A04E;letter-spacing:2px;">ECOMY</h1>
                        </td>
                    </tr>
                    <tr>
                        <td style="padding:40px 30px;">
                            <h2 style="margin:0 0 20px;font-size:24px;color:#1a1a1a;text-align:center;">
                                تم تأكيد موعد جلستك! ✅
                            </h2>
                            <p style="margin:0 0 30px;font-size:16px;color:#555555;text-align:center;line-height:1.8;">
                                جلسة التشخيص الخاصة بك محجوزة بنجاح
                            </p>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:#f9f9f9;border-radius:8px;margin-bottom:30px;">
                                <tr>
                                    <td style="padding:20px;text-align:center;">
                                        <p style="margin:0 0 8px;font-size:14px;color:#999;">التاريخ</p>
                                        <p style="margin:0 0 16px;font-size:18px;color:#1a1a1a;font-weight:bold;">${dateStr}</p>
                                        <p style="margin:0 0 8px;font-size:14px;color:#999;">الساعة</p>
                                        <p style="margin:0;font-size:18px;color:#E8600A;font-weight:bold;">${timeStr}</p>
                                    </td>
                                </tr>
                            </table>
                            <table role="presentation" width="100%" cellpadding="0" cellspacing="0">
                                <tr>
                                    <td align="center" style="padding:10px 0 30px;">
                                        <a href="https://ecomy.ai/dashboard/coaching" style="display:inline-block;background-color:#E8600A;color:#ffffff;text-decoration:none;padding:16px 40px;border-radius:8px;font-size:18px;font-weight:bold;">
                                            عرض تفاصيل الجلسة
                                        </a>
                                    </td>
                                </tr>
                            </table>
                            <hr style="border:none;border-top:1px solid #eeeeee;margin:20px 0;" />
                            <p style="margin:0;font-size:14px;color:#999999;text-align:center;line-height:1.8;">
                                إذا كان لديك أي سؤال، تواصل معنا على
                                <a href="mailto:academyfrance75@gmail.com" style="color:#E8600A;text-decoration:none;">academyfrance75@gmail.com</a>
                            </p>
                        </td>
                    </tr>
                    <tr>
                        <td style="background-color:#fafafa;padding:20px 30px;text-align:center;">
                            <p style="margin:0;font-size:12px;color:#bbbbbb;">
                                &copy; ${new Date().getFullYear()} ECOMY. جميع الحقوق محفوظة.
                            </p>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>
</html>
    `.trim();

    const { data, error } = await resend.emails.send({
        from: `ECOMY <${FROM_EMAIL}>`,
        to: toEmail,
        subject: '✅ تأكيد موعد جلسة التشخيص',
        html,
    });

    if (error) {
        console.error('Failed to send booking confirmation email:', error);
        throw error;
    }

    console.log(`✅ Booking confirmation email sent to ${toEmail}`, data);
    return data;
}
