import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const schema = z.object({
  phone: z.string().min(7).max(20),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), user: null };
  return { error: null, user };
}

export async function GET() {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const tilil = {
    SMS_ENDPOINT: process.env.SMS_ENDPOINT ? '✓ set' : '✗ MISSING',
    TILIL_API_KEY: process.env.TILIL_API_KEY
      ? `✓ set (…${process.env.TILIL_API_KEY.slice(-6)})`
      : '✗ MISSING',
    TILIL_SHORTCODE: process.env.TILIL_SHORTCODE
      ? `✓ set ("${process.env.TILIL_SHORTCODE}")`
      : '✗ MISSING',
    OWNER_PHONE: process.env.OWNER_PHONE
      ? `✓ set ("${process.env.OWNER_PHONE}")`
      : '✗ not set (owner will not receive order alerts)',
  };

  const resend = {
    RESEND_API_KEY: process.env.RESEND_API_KEY
      ? `✓ set (…${process.env.RESEND_API_KEY.slice(-6)})`
      : '✗ MISSING',
    RESEND_FROM_EMAIL: process.env.RESEND_FROM_EMAIL
      ? `✓ set ("${process.env.RESEND_FROM_EMAIL}")`
      : '✗ not set (will use onboarding@resend.dev fallback)',
  };

  const allReady = !Object.values(tilil).some((v) => v.startsWith('✗ MISSING'));

  return NextResponse.json({ tilil, resend, smsReady: allReady });
}

export async function POST(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;

  const parsed = schema.safeParse(await req.json());
  if (!parsed.success) {
    return NextResponse.json({ error: 'Provide a valid phone number' }, { status: 422 });
  }

  const apiUrl = process.env.SMS_ENDPOINT;
  const apiKey = process.env.TILIL_API_KEY;
  const shortcode = process.env.TILIL_SHORTCODE;

  if (!apiUrl || !apiKey || !shortcode) {
    return NextResponse.json(
      {
        error: 'SMS env vars not configured on this environment',
        missing: {
          SMS_ENDPOINT: !apiUrl,
          TILIL_API_KEY: !apiKey,
          TILIL_SHORTCODE: !shortcode,
        },
      },
      { status: 500 }
    );
  }

  const raw = parsed.data.phone.replace(/[^\d]/g, '');
  const mobile =
    raw.startsWith('254') && raw.length === 12
      ? raw
      : raw.startsWith('0') && raw.length === 10
        ? `254${raw.slice(1)}`
        : raw;

  const body = JSON.stringify({
    api_key: apiKey,
    service_id: 0,
    mobile,
    response_type: 'json',
    shortcode,
    message: `Anashe: This is a test SMS from your store. TILIL is working correctly.`,
  });

  let tilil: unknown;
  let httpStatus: number;
  try {
    const res = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body,
    });
    httpStatus = res.status;
    tilil = await res.json();
  } catch (err) {
    return NextResponse.json({ error: 'Fetch to TILIL failed', detail: String(err) }, { status: 500 });
  }

  return NextResponse.json({ success: true, mobile, httpStatus, tilil });
}
