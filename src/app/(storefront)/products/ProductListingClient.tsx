'use client';

import { useMemo, useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, X, Search, Heart } from 'lucide-react';
import type { Product } from '@/types';
import { formatPrice, isSupabaseStorageUrl, resolveProductImageUrl, shouldUnoptimizeImage } from '@/lib/utils';
import { useCartStore } from '@/store/cart';
import { useToast } from '@/components/shared/Toaster';

const SORT_OPTIONS = [
  { value: 'newest', label: 'Newest First' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'popular', label: 'Most Popular' },
  { value: 'rating', label: 'Highest Rated' },
];

const CATEGORY_OPTIONS = [
  { value: '', label: 'All categories' },
  { value: 'moisturisers', label: 'Moisturisers & Hydration' },
  { value: 'serums-treatments', label: 'Serums & Treatments' },
  { value: 'cleansers-toners', label: 'Cleansers & Toners' },
  { value: 'sunscreen-spf', label: 'Sunscreen & SPF' },
  { value: 'eye-lip-care', label: 'Eye & Lip Care' },
  { value: 'foundations-concealer', label: 'Foundations & Concealer' },
  { value: 'lipstick-lip-gloss', label: 'Lipstick & Lip Gloss' },
  { value: 'natural-organic', label: 'Natural & Organic' },
];

interface ProductListingClientProps {
  initialParams: Record<string, string | string[] | undefined>;
}

function ListingProductImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  const resolved = resolveProductImageUrl(src);
  const effectiveSrc = failed ? '/images/hero-image.jpg' : resolved ?? '/images/hero-image.jpg';

  if (isSupabaseStorageUrl(effectiveSrc)) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={effectiveSrc}
        alt={alt}
        className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <Image
      src={effectiveSrc}
      alt={alt}
      width={800}
      height={1000}
      className="h-full w-full object-cover object-center transition-transform duration-700 group-hover:scale-105"
      unoptimized={shouldUnoptimizeImage(effectiveSrc)}
      onError={() => setFailed(true)}
    />
  );
}

export function ProductListingClient({ initialParams }: ProductListingClientProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [products, setProducts] = useState<Product[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [minPrice, setMinPrice] = useState((initialParams.min_price as string) ?? '');
  const [maxPrice, setMaxPrice] = useState((initialParams.max_price as string) ?? '');
  const [selectedCategory, setSelectedCategory] = useState((initialParams.category as string) ?? '');
  const [selectedSort, setSelectedSort] = useState((initialParams.sort as string) ?? 'newest');
  const [searchTerm, setSearchTerm] = useState((initialParams.q as string) ?? '');
  const [addingProductId, setAddingProductId] = useState<string | null>(null);
  const { addItem } = useCartStore();
  const { add: showToast } = useToast();

  const q = initialParams.q as string | undefined;

  function handleAddToCart(product: Product) {
    const primaryImage = product.images?.find((img) => img.is_primary)?.url ?? product.images?.[0]?.url;
    setAddingProductId(product.id);
    addItem({
      productId: product.id,
      variantId: null,
      quantity: 1,
      product: {
        id: product.id,
        name: product.name,
        price: product.price,
        sale_price: product.sale_price,
        slug: product.slug,
        image: primaryImage,
      },
    });
    showToast(`${product.name} added to cart`);
    setTimeout(() => setAddingProductId((current) => (current === product.id ? null : current)), 500);
  }

  function updateSearchParam(key: string, value: string | undefined, resetPage = true) {
    const params = new URLSearchParams(searchParams.toString());
    if (value) params.set(key, value);
    else params.delete(key);
    if (resetPage && key !== 'page') {
      params.set('page', '1');
    }
    router.push(`${pathname}?${params.toString()}`, { scroll: false });
  }

  const queryString = useMemo(() => searchParams.toString(), [searchParams]);

  useEffect(() => {
    let isMounted = true;
    Promise.resolve().then(() => {
      if (!isMounted) return;
      setLoading(true);
      setError(null);
    });
    fetch(`/api/products?${queryString}`, { cache: 'no-store' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to load products');
        return res.json();
      })
      .then((json) => {
        if (!isMounted) return;
        setProducts(json.data ?? []);
        setTotal(json.total ?? 0);
      })
      .catch((e: unknown) => {
        if (!isMounted) return;
        setError(e instanceof Error ? e.message : 'Failed to load products');
      })
      .finally(() => {
        if (!isMounted) return;
        setLoading(false);
      });
    return () => {
      isMounted = false;
    };
  }, [queryString]);

  const FilterSidebar = (
    <div className="space-y-8">
      <div className="relative">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              updateSearchParam('q', searchTerm.trim() || undefined);
            }
          }}
          placeholder="Search..."
          className="w-full border-b border-neutral-200 bg-transparent py-2 pr-7 text-sm text-neutral-900 placeholder:text-neutral-400 outline-none focus:border-[var(--primary)]"
        />
        <Search className="absolute right-0 top-2.5 w-4 h-4 text-neutral-400" />
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] mb-4 text-neutral-900">Categories</h3>
        <div className="space-y-3">
          {CATEGORY_OPTIONS.map((option) => {
            const active = selectedCategory === option.value;
            return (
              <label key={option.value || 'all-categories'} className="flex items-center gap-3 cursor-pointer group">
                <input
                  type="checkbox"
                  checked={active}
                  onChange={() => {
                    const next = active ? '' : option.value;
                    setSelectedCategory(next);
                    updateSearchParam('category', next || undefined);
                  }}
                  className="sr-only peer"
                />
                <span className="relative h-4 w-4 border border-neutral-300 bg-white peer-checked:border-neutral-900 peer-checked:bg-neutral-900">
                  <span className="absolute inset-0 text-white text-[10px] leading-4 text-center opacity-0 peer-checked:opacity-100">✓</span>
                </span>
                <span className="text-sm text-neutral-600 group-hover:text-neutral-900">
                  {option.value === '' ? 'View All' : option.label}
                </span>
              </label>
            );
          })}
        </div>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] mb-4 text-neutral-900">Price</h3>
        <input
          type="range"
          min={0}
          max={10000}
          value={maxPrice || 10000}
          onChange={(e) => setMaxPrice(e.target.value)}
          className="w-full h-1 bg-neutral-200 rounded-lg appearance-none cursor-pointer accent-zinc-900"
        />
        <div className="mt-2 flex justify-between text-xs text-neutral-500 font-medium">
          <span>KES 0</span>
          <span>KES {Number(maxPrice || 10000).toLocaleString()}+</span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)] transition-colors"
          />
          <input type="number" placeholder="Max" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} className="w-full border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-[var(--primary)] transition-colors" />
        </div>
        <button
          onClick={() => {
            if (searchTerm.trim() !== (searchParams.get('q') ?? '')) updateSearchParam('q', searchTerm.trim() || undefined);
            if (minPrice) updateSearchParam('min_price', minPrice);
            if (maxPrice) updateSearchParam('max_price', maxPrice);
          }}
          className="mt-3 w-full h-9 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-zinc-800 transition-colors"
        >
          Apply Filters
        </button>
      </div>

      <div>
        <h3 className="text-xs font-semibold uppercase tracking-[0.16em] mb-3 text-neutral-900">Availability</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get('in_stock') === 'true'}
            onChange={(e) => updateSearchParam('in_stock', e.target.checked ? 'true' : undefined)}
            className="w-4 h-4 rounded border-neutral-300 accent-zinc-900"
          />
          <span className="text-sm text-neutral-600">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-6 py-12">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-100 pb-8">
        <div>
          {q ? (
            <h1 className="text-xl font-medium tracking-tight font-[family-name:var(--font-display)]">
              Results for &ldquo;{q}&rdquo;
            </h1>
          ) : (
            <h1 className="text-xl font-medium tracking-tight font-[family-name:var(--font-display)]">All Products</h1>
          )}
          <p className="text-sm text-neutral-500 mt-1">{total} items</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 rounded-sm border border-zinc-200 bg-white px-3 py-2 text-xs font-medium uppercase tracking-wider text-zinc-600 hover:border-zinc-900 hover:text-zinc-900 lg:hidden"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="relative group">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500 absolute left-2 top-1/2 -translate-y-1/2 pointer-events-none" />
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                updateSearchParam('sort', e.target.value);
              }}
              className="appearance-none rounded-none border-b border-zinc-200 bg-transparent py-2 pl-8 pr-8 text-sm font-medium text-zinc-600 focus:border-zinc-900 focus:outline-none cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="mt-8 flex gap-12">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-60 shrink-0 space-y-10">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-neutral-900">Filters</h2>
              {(selectedCategory || minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setMinPrice('');
                    setMaxPrice('');
                    setSearchTerm('');
                    router.push(pathname, { scroll: false });
                  }}
                  className="text-xs text-neutral-400 hover:text-neutral-700 flex items-center gap-1"
                >
                  <X className="w-3 h-3" /> Clear all
                </button>
              )}
            </div>
            {FilterSidebar}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          {loading && <p className="text-sm text-neutral-500 mb-4">Loading products...</p>}
          {error && <p className="text-sm text-red-600 mb-4">{error}</p>}
          {!loading && !error && products.length === 0 && (
            <p className="text-sm text-neutral-500">No products found for the selected filters.</p>
          )}
          {!error && products.length > 0 && (
            <div className="grid grid-cols-2 gap-x-6 gap-y-12 lg:grid-cols-3">
              {products.map((product) => (
                <article key={product.id} className="group relative flex flex-col">
                  <div className="aspect-[3/4] w-full overflow-hidden bg-zinc-100 relative">
                    <div className="absolute right-0 top-0 z-10 p-3">
                      <button className="rounded-full bg-white/80 p-2 text-zinc-400 backdrop-blur-sm transition hover:text-red-500">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>
                    <Link href={`/products/${product.slug}`}>
                      <ListingProductImage
                        src={product.images?.find((img) => img.is_primary)?.url ?? product.images?.[0]?.url ?? '/images/hero-image.jpg'}
                        alt={product.name}
                      />
                    </Link>
                    <div className="absolute inset-x-0 bottom-0 p-3 opacity-100 transition-opacity duration-300 md:p-4 md:opacity-0 md:group-hover:opacity-100">
                      <button
                        onClick={() => handleAddToCart(product)}
                        disabled={product.stock <= 0 || addingProductId === product.id}
                        className="w-full bg-white/95 py-2.5 text-[10px] font-semibold uppercase tracking-widest text-zinc-900 shadow-lg backdrop-blur-sm transition-colors hover:bg-zinc-900 hover:text-white disabled:cursor-not-allowed disabled:opacity-70 md:py-3 md:text-xs"
                      >
                        {product.stock <= 0 ? 'Out of Stock' : addingProductId === product.id ? 'Adding...' : 'Add to Cart'}
                      </button>
                    </div>
                  </div>
                  <div className="mt-4 flex justify-between gap-3">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-900">{product.name}</h3>
                      <p className="text-sm text-zinc-500">{product.brand ?? 'Anashe Beauty'}</p>
                    </div>
                    <p className="text-sm font-medium text-zinc-900">{formatPrice(Number(product.sale_price ?? product.price))}</p>
                  </div>
                </article>
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="mt-16 border-t border-zinc-100 pt-10 text-center">
            {[1, 2, 3, 4, 5].map((p, i) => (
              <button
                key={i}
                className={`inline-flex h-10 w-10 items-center justify-center border text-xs font-semibold uppercase tracking-widest transition ${
                  p === Number(initialParams.page ?? 1)
                    ? 'border-zinc-900 bg-zinc-900 text-white'
                    : 'border-zinc-200 bg-white text-zinc-700 hover:border-zinc-900 hover:text-zinc-900'
                }`}
                onClick={() => updateSearchParam('page', String(p), false)}
              >
                {p}
              </button>
            ))}
            <div className="mt-6">
              <button
                className="inline-flex h-10 w-32 items-center justify-center border border-zinc-900 bg-white text-xs font-semibold uppercase tracking-widest text-zinc-900 transition hover:bg-zinc-900 hover:text-white"
                onClick={() => updateSearchParam('page', String(Number(initialParams.page ?? 1) + 1), false)}
              >
                Load More
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Filter Drawer */}
      {isFilterOpen && (
        <>
          <div className="fixed inset-0 bg-black/40 z-40" onClick={() => setIsFilterOpen(false)} />
          <div className="fixed bottom-0 left-0 right-0 bg-white rounded-t-2xl z-50 max-h-[85vh] overflow-y-auto p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold">Filters</h2>
              <button onClick={() => setIsFilterOpen(false)}>
                <X className="w-5 h-5 text-neutral-500" />
              </button>
            </div>
            {FilterSidebar}
            <button
              onClick={() => setIsFilterOpen(false)}
              className="w-full h-12 bg-[var(--primary)] text-white font-semibold rounded-xl mt-6 hover:bg-[var(--primary-hover)] transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
