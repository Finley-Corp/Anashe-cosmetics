import { NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient } from '@/lib/supabase/server';

const actionSchema = z.object({
  action: z.enum(['approve', 'reject']),
});

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), supabase: null };
  }

  const metadataRole =
    (user.app_metadata as { role?: string } | undefined)?.role ??
    (user.user_metadata as { role?: string } | undefined)?.role;

  let isAdmin = metadataRole === 'admin';
  if (!isAdmin) {
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).maybeSingle();
    isAdmin = profile?.role === 'admin';
  }

  if (!isAdmin) {
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), supabase: null };
  }

  return { error: null, supabase };
}

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { supabase } = adminCheck;
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await req.json();
  const parsed = actionSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid payload' }, { status: 422 });
  }

  const { id } = await params;

  if (parsed.data.action === 'approve') {
    const { error } = await supabase.from('reviews').update({ is_approved: true }).eq('id', id);
    if (error) return NextResponse.json({ error: error.message }, { status: 500 });
    return NextResponse.json({ success: true });
  }

  const { error } = await supabase.from('reviews').delete().eq('id', id);
  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ success: true });
}

