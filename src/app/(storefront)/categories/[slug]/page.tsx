import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { createServiceClient } from '@/lib/supabase/service';
import { ProductListingClient } from '@/app/(storefront)/products/ProductListingClient';

type CategoryPageProps = {
  params: Promise<{ slug: string }>;
};

const FAQS: Record<string, { q: string; a: string }[]> = {
  'serums-treatments': [
    {
      q: 'What is a face serum?',
      a: 'A serum is a lightweight skincare product with concentrated active ingredients that target specific skin concerns.',
    },
    {
      q: 'How do I layer serums?',
      a: 'Apply thinner serums first and thicker serums after. Allow each layer to absorb before applying the next.',
    },
    {
      q: 'Which serum is best for oily skin in Kenya?',
      a: 'Niacinamide and salicylic acid serums are commonly preferred for oily skin and breakout-prone concerns.',
    },
  ],
  'sunscreen-spf': [
    {
      q: 'What SPF should I use daily in Kenya?',
      a: 'Given strong year-round UV levels, SPF 50+ is recommended for most daily outdoor routines in Kenya.',
    },
    {
      q: 'Is sunscreen necessary indoors?',
      a: 'Yes, UVA rays can pass through windows, so sunscreen is still beneficial while indoors during daytime.',
    },
    {
      q: 'Can I use SPF instead of moisturiser?',
      a: 'Some SPF products hydrate well, but many skin types still benefit from a dedicated moisturiser underneath.',
    },
  ],
};

async function getCategory(slug: string) {
  const supabase = createServiceClient();
  const { data } = await supabase
    .from('categories')
    .select('id,name,slug,description,image_url')
    .eq('slug', slug)
    .eq('is_active', true)
    .maybeSingle();
  return data;
}

export async function generateMetadata({ params }: CategoryPageProps): Promise<Metadata> {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) return { title: 'Category Not Found' };
  return {
    title: `${category.name} | Anashe`,
    description: category.description ?? `Shop ${category.name} at Anashe.`,
  };
}

export default async function CategoryPage({ params }: CategoryPageProps) {
  const { slug } = await params;
  const category = await getCategory(slug);
  if (!category) {
    notFound();
  }

  const faqs = FAQS[slug] ?? [];
  const faqJsonLd =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.q,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.a,
            },
          })),
        }
      : null;

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <section className="rounded-2xl border border-neutral-200 bg-neutral-50 px-6 py-8 md:px-10 md:py-12 mb-8">
        <p className="text-xs uppercase tracking-wider text-neutral-500 mb-2">Category</p>
        <h1 className="text-3xl md:text-4xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
          {category.name}
        </h1>
        {category.description ? <p className="text-sm text-neutral-600 mt-3 max-w-3xl">{category.description}</p> : null}
      </section>

      <ProductListingClient initialParams={{ category: slug }} />

      {faqJsonLd ? (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }} />
      ) : null}
    </div>
  );
}
