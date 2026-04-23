import Image from 'next/image';
import Link from 'next/link';
import { createClient } from '@/lib/supabase/server';

export const metadata = {
  title: 'The Journal',
  description: 'Skincare routines, ingredient guides, and beauty education from the Anashe team.',
};

type BlogPost = {
  id: string;
  title: string;
  category: string;
  excerpt: string | null;
  image_url: string | null;
  published_at: string | null;
  created_at: string | null;
};

function formatPostDate(value: string | null) {
  if (!value) return '';
  return new Date(value).toLocaleDateString('en-KE', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

export default async function BlogPage() {
  const supabase = await createClient();
  const { data } = await supabase
    .from('blog_posts')
    .select('id,title,category,excerpt,image_url,published_at,created_at')
    .eq('is_published', true)
    .order('published_at', { ascending: false, nullsFirst: false })
    .order('created_at', { ascending: false })
    .limit(30);

  const posts = (data ?? []) as BlogPost[];
  const featured = posts[0];
  const rest = posts.slice(1);

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <div className="mb-10">
        <p className="text-xs font-bold uppercase tracking-widest text-green-700 mb-2">Our Blog</p>
        <h1 className="text-3xl md:text-4xl font-medium tracking-tight font-[family-name:var(--font-display)]">The Journal</h1>
      </div>

      {featured ? (
        <Link href={`/blog/${featured.id}`} className="block">
          <article className="group grid md:grid-cols-2 gap-8 mb-16 bg-neutral-50 rounded-2xl overflow-hidden hover:shadow-md transition-shadow">
            <div className="relative h-64 md:h-auto overflow-hidden">
              <Image
                src={featured.image_url ?? '/images/hero-1.jpg'}
                alt={featured.title}
                fill
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </div>
            <div className="p-6 md:p-10 flex flex-col justify-center">
              <span className="text-xs font-bold uppercase tracking-wider text-green-700 mb-3">{featured.category}</span>
              <h2 className="text-2xl font-medium tracking-tight mb-4 group-hover:underline font-[family-name:var(--font-display)]">{featured.title}</h2>
              {featured.excerpt ? <p className="text-neutral-500 text-sm leading-relaxed mb-6">{featured.excerpt}</p> : null}
              <span className="text-xs text-neutral-400">{formatPostDate(featured.published_at ?? featured.created_at)}</span>
            </div>
          </article>
        </Link>
      ) : (
        <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-10 text-center text-neutral-500 text-sm mb-16">
          No blog posts yet.
        </div>
      )}

      {/* Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
        {rest.map((post) => (
          <Link key={post.id} href={`/blog/${post.id}`} className="block">
            <article className="group cursor-pointer">
              <div className="overflow-hidden rounded-xl mb-5 aspect-[16/10] bg-neutral-100">
                <Image
                  src={post.image_url ?? '/images/hero-2.jpg'}
                  alt={post.title}
                  width={800}
                  height={500}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
              </div>
              <div className="flex items-center gap-2 text-[10px] font-bold text-neutral-400 mb-2.5 uppercase tracking-wider">
                <span>{formatPostDate(post.published_at ?? post.created_at)}</span>
                <span className="w-1 h-1 bg-neutral-300 rounded-full" />
                <span>{post.category}</span>
              </div>
              <h3 className="text-lg font-medium tracking-tight mb-2 group-hover:underline decoration-1 underline-offset-4 font-[family-name:var(--font-display)]">{post.title}</h3>
              {post.excerpt ? <p className="text-sm text-neutral-500 line-clamp-2 leading-relaxed">{post.excerpt}</p> : null}
            </article>
          </Link>
        ))}
      </div>
    </div>
  );
}
