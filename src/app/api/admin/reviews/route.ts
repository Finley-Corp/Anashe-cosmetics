import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return { error: NextResponse.json({ error: 'Unauthorized' }, { status: 401 }), supabase: null, user: null };
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
    return { error: NextResponse.json({ error: 'Forbidden' }, { status: 403 }), supabase: null, user };
  }

  return { error: null, supabase, user };
}

export async function GET(req: Request) {
  const adminCheck = await requireAdmin();
  if (adminCheck.error) return adminCheck.error;
  const { supabase } = adminCheck;
  if (!supabase) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { searchParams } = new URL(req.url);
  const status = searchParams.get('status') ?? 'pending';
  const isApproved = status === 'approved';

  const { data, error } = await supabase
    .from('reviews')
    .select('id,rating,title,body,created_at,is_approved,product:products(id,name,slug),profile:profiles(id,full_name)')
    .eq('is_approved', isApproved)
    .order('created_at', { ascending: false })
    .limit(200);

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({ data: data ?? [] });
}

