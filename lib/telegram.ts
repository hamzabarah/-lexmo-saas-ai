// Telegram notifier — sends admin notifications via the ECOMY bot.
// Requires TELEGRAM_BOT_TOKEN and TELEGRAM_ADMIN_CHAT_ID in env.

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const ADMIN_CHAT_ID = process.env.TELEGRAM_ADMIN_CHAT_ID;

export async function sendTelegramAdminMessage(text: string): Promise<void> {
    if (!BOT_TOKEN || !ADMIN_CHAT_ID) {
        console.warn('Telegram not configured — skipping admin notification');
        return;
    }

    try {
        const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                chat_id: ADMIN_CHAT_ID,
                text,
                parse_mode: 'HTML',
                disable_web_page_preview: true,
            }),
        });
        if (!res.ok) {
            const body = await res.text();
            console.error('Telegram sendMessage failed:', res.status, body);
        }
    } catch (err) {
        console.error('Telegram sendMessage threw:', err);
    }
}
