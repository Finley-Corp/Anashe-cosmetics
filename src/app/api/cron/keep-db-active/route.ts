import { NextResponse } from 'next/server';

import { createServiceClient } from '@/lib/supabase/service';

export async function GET(request: Request) {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return NextResponse.json(
      { ok: false, error: 'CRON_SECRET is not configured' },
      { status: 500 }
    );
  }

  const authHeader = request.headers.get('authorization');
  const providedSecret = authHeader?.replace(/^Bearer\s+/i, '');

  if (providedSecret !== cronSecret) {
    return NextResponse.json({ ok: false, error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const supabase = createServiceClient();

    // Lightweight query to keep Postgres warm without changing data.
    const { error } = await supabase
      .from('products')
      .select('id', { head: true, count: 'exact' })
      .limit(1);

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message, at: new Date().toISOString() },
        { status: 500 }
      );
    }

    return NextResponse.json({ ok: true, at: new Date().toISOString() });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { ok: false, error: message, at: new Date().toISOString() },
      { status: 500 }
    );
  }
}
