/**
 * LOCAL DEVELOPMENT ONLY — remove before shipping to production.
 * Hit this to fire a live TILIL SMS without placing an order.
 *
 * Usage:
 *   GET /api/dev/test-sms?phone=0712345678
 */
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ error: 'Not available in production' }, { status: 403 });
  }

  const url = new URL(req.url);
  const phone = url.searchParams.get('phone') ?? '';

  if (!phone) {
    return NextResponse.json({ error: 'Provide ?phone=07XXXXXXXX' }, { status: 400 });
  }

  const apiUrl = process.env.SMS_ENDPOINT;
  const apiKey = process.env.TILIL_API_KEY;
  const shortcode = process.env.TILIL_SHORTCODE;

  if (!apiUrl || !apiKey || !shortcode) {
    return NextResponse.json({
      error: 'TILIL env vars missing',
      present: {
        SMS_ENDPOINT: !!apiUrl,
        TILIL_API_KEY: !!apiKey,
        TILIL_SHORTCODE: !!shortcode,
      },
    }, { status: 500 });
  }

  const raw = phone.replace(/[^\d]/g, '');
  const mobile =
    raw.startsWith('254') && raw.length === 12
      ? raw
      : raw.startsWith('0') && raw.length === 10
        ? `254${raw.slice(1)}`
        : raw;

  const body = {
    api_key: apiKey,
    service_id: 0,
    mobile,
    response_type: 'json',
    shortcode,
    message: `Anashe dev test: SMS integration is working. Mobile=${mobile}`,
  };

  console.log('[dev/test-sms] Sending to mobile:', mobile, '| shortcode:', shortcode);

  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(body),
    });
    const text = await res.text();
    let tilil: unknown;
    try { tilil = JSON.parse(text); } catch { tilil = text; }
    console.log('[dev/test-sms] TILIL response:', JSON.stringify(tilil));
    return NextResponse.json({ mobile, shortcode, httpStatus: res.status, tilil });
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 });
  }
}
