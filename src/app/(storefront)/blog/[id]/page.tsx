import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';

type BlogPostRecord = {
  id: string;
  title: string;
  category: string | null;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
  is_published?: boolean | null;
  content?: string | null;
  body?: string | null;
};

function formatPostDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-KE', {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPostPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('*')
    .eq('id', id)
    .eq('is_published', true)
    .maybeSingle();

  if (!data) {
    notFound();
  }

  const post = data as BlogPostRecord;
  const postBody = post.content ?? post.body ?? post.excerpt ?? '';

  return (
    <article className="max-w-4xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <Link
        href="/blog"
        className="group inline-flex items-center gap-2 rounded-full border border-neutral-200 bg-white/90 px-4 py-2 text-sm font-medium text-neutral-600 shadow-sm transition-all hover:-translate-y-0.5 hover:border-neutral-300 hover:text-neutral-900 hover:shadow-md mb-8"
      >
        <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-0.5" />
        Back to The Journal
      </Link>

      <div className="mb-8">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-3">{post.category ?? 'Journal'}</p>
        <h1 className="text-3xl md:text-5xl font-medium tracking-tight font-[family-name:var(--font-display)] mb-4">{post.title}</h1>
        <p className="text-sm text-neutral-400">{formatPostDate(post.published_at ?? post.created_at)}</p>
      </div>

      <div className="relative w-full aspect-[16/9] overflow-hidden rounded-2xl bg-neutral-100 mb-10">
        <Image
          src={post.image_url ?? '/images/hero-1.jpg'}
          alt={post.title}
          fill
          className="object-cover"
          priority
        />
      </div>

      <div className="prose prose-neutral max-w-none">
        <p className="text-base leading-8 whitespace-pre-line text-neutral-700">
          {postBody || 'This article will be updated with full content soon.'}
        </p>
      </div>
    </article>
  );
}
