import { formatPhone } from '@/lib/utils';

type SmsPayload = {
  to: string;
  body: string;
};

function getTililConfig() {
  const apiUrl = process.env.SMS_ENDPOINT ?? process.env.TILIL_API_URL;
  const apiKey = process.env.TILIL_API_KEY;
  const senderId = process.env.TILIL_SHORTCODE ?? process.env.TILIL_SENDER_ID;
  if (!apiUrl || !apiKey || !senderId) return null;
  return { apiUrl, apiKey, senderId };
}

function normalizeToE164(phone: string) {
  const normalized = formatPhone(phone).replace(/[^\d]/g, '');
  if (normalized.startsWith('254')) return `+${normalized}`;
  if (normalized.startsWith('0')) return `+254${normalized.slice(1)}`;
  return phone;
}

export async function sendSmsNotification(payload: SmsPayload) {
  const config = getTililConfig();
  if (!config) return { success: false as const, skipped: true as const };

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${config.apiKey}`,
      },
      body: JSON.stringify({
        to: normalizeToE164(payload.to),
        message: payload.body,
        sender_id: config.senderId,
      }),
    });

    if (!response.ok) {
      const errorBody = await response.text().catch(() => '');
      console.error('[TILIL SMS Error]', response.status, errorBody);
      return { success: false as const, skipped: false as const };
    }

    return { success: true as const };
  } catch (error) {
    console.error('[TILIL SMS Error]', error);
    return { success: false as const, skipped: false as const };
  }
}

