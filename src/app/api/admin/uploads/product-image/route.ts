import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createServiceClient } from '@/lib/supabase/service';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const form = await req.formData();
  const file = form.get('file');
  const slug = String(form.get('slug') ?? '').trim();

  if (!file || !(file instanceof File)) {
    return NextResponse.json({ error: 'Missing file' }, { status: 422 });
  }

  const safeSlug = (slug || 'product').slice(0, 80);
  const originalName = file.name || 'image.jpg';
  const ext = originalName.split('.').pop() || 'jpg';
  const objectPath = `products/${safeSlug}/${crypto.randomUUID()}.${ext}`;

  const service = createServiceClient();
  const { error: uploadError } = await service.storage
    .from('product-images')
    .upload(objectPath, file, { upsert: true, contentType: file.type || undefined });

  if (uploadError) {
    return NextResponse.json({ error: uploadError.message }, { status: 500 });
  }

  const { data } = service.storage.from('product-images').getPublicUrl(objectPath);
  if (!data.publicUrl) {
    return NextResponse.json({ error: 'Unable to create public URL' }, { status: 500 });
  }

  return NextResponse.json({ url: data.publicUrl });
}

