type SmsPayload = {
  to: string;
  body: string;
};

type TililResponse = {
  status_code: string;
  status_desc: string;
  message_id: string | number;
  mobile_number: string;
  network_id: string;
  message_cost: string | number;
  credit_balance: string | number;
};

function getTililConfig() {
  const apiUrl = process.env.SMS_ENDPOINT;
  const apiKey = process.env.TILIL_API_KEY;
  const shortcode = process.env.TILIL_SHORTCODE;
  if (!apiUrl || !apiKey || !shortcode) return null;
  return { apiUrl, apiKey, shortcode };
}

function normalizeMobile(phone: string): string {
  const digits = phone.replace(/[^\d]/g, '');
  if (digits.startsWith('254') && digits.length === 12) return digits;
  if (digits.startsWith('0') && digits.length === 10) return `254${digits.slice(1)}`;
  if (digits.length === 9) return `254${digits}`;
  return digits;
}

export async function sendSmsNotification(payload: SmsPayload): Promise<{
  success: boolean;
  skipped?: boolean;
  messageId?: string | number;
  error?: string;
}> {
  const config = getTililConfig();
  if (!config) {
    console.warn('[TILIL SMS] Skipped — SMS_ENDPOINT, TILIL_API_KEY or TILIL_SHORTCODE not configured.');
    return { success: false, skipped: true };
  }

  const mobile = normalizeMobile(payload.to);

  try {
    const response = await fetch(config.apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        api_key: config.apiKey,
        service_id: 0,
        mobile,
        response_type: 'json',
        shortcode: config.shortcode,
        message: payload.body,
      }),
    });

    const raw = await response.text();
    let results: TililResponse[] = [];

    try {
      const parsed: unknown = JSON.parse(raw);
      results = Array.isArray(parsed) ? (parsed as TililResponse[]) : [parsed as TililResponse];
    } catch {
      console.error('[TILIL SMS] Non-JSON response:', raw);
      return { success: false, error: 'Non-JSON response from TILIL' };
    }

    const first = results[0];
    if (!first) {
      console.error('[TILIL SMS] Empty response array');
      return { success: false, error: 'Empty response from TILIL' };
    }

    if (first.status_code === '1000') {
      console.log(`[TILIL SMS] ✓ Sent to ${first.mobile_number} | msgId=${first.message_id} | cost=${first.message_cost} | balance=${first.credit_balance}`);
      return { success: true, messageId: first.message_id };
    }

    console.error(`[TILIL SMS] ✗ Failed to ${mobile} | code=${first.status_code} | reason=${first.status_desc}`);
    return { success: false, error: `${first.status_code}: ${first.status_desc}` };
  } catch (err) {
    console.error('[TILIL SMS] Network error:', err);
    return { success: false, error: err instanceof Error ? err.message : 'Unknown error' };
  }
}
