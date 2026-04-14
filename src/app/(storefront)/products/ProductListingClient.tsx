'use client';

import { useMemo, useState, useEffect } from 'react';
import { useRouter, usePathname, useSearchParams } from 'next/navigation';
import { Filter, SlidersHorizontal, X } from 'lucide-react';
import { ProductCard } from '@/components/storefront/ProductCard';
import type { Product } from '@/types';

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

  const q = initialParams.q as string | undefined;

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
    setLoading(true);
    setError(null);
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
      {/* Categories */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-neutral-900">Category</h3>
        <div className="space-y-2">
          {CATEGORY_OPTIONS.map((option) => (
            <button
              key={option.value || 'all-categories'}
              type="button"
              onClick={() => {
                setSelectedCategory(option.value);
                updateSearchParam('category', option.value || undefined);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg text-sm transition-colors ${
                selectedCategory === option.value
                  ? 'bg-neutral-900 text-white'
                  : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900'
              }`}
            >
              {option.label}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-neutral-900">Price (KES)</h3>
        <div className="grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-2 min-w-0">
          <input
            type="number"
            placeholder="Min"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className="w-full min-w-0 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition-colors"
          />
          <span className="text-neutral-400 text-sm">—</span>
          <input
            type="number"
            placeholder="Max"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className="w-full min-w-0 border border-neutral-200 rounded-lg px-3 py-2 text-sm outline-none focus:border-green-500 transition-colors"
          />
        </div>
        <button
          onClick={() => {
            if (minPrice) updateSearchParam('min_price', minPrice);
            if (maxPrice) updateSearchParam('max_price', maxPrice);
          }}
          className="mt-3 w-full h-9 bg-neutral-900 text-white text-xs font-semibold rounded-lg hover:bg-green-700 transition-colors"
        >
          Apply Price Filter
        </button>
      </div>

      {/* In Stock */}
      <div>
        <h3 className="text-sm font-semibold mb-3 text-neutral-900">Availability</h3>
        <label className="flex items-center gap-2.5 cursor-pointer">
          <input
            type="checkbox"
            checked={searchParams.get('in_stock') === 'true'}
            onChange={(e) => updateSearchParam('in_stock', e.target.checked ? 'true' : undefined)}
            className="w-4 h-4 rounded border-neutral-300 accent-green-700"
          />
          <span className="text-sm text-neutral-600">In Stock Only</span>
        </label>
      </div>
    </div>
  );

  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          {q ? (
            <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-display)]">
              Results for &ldquo;{q}&rdquo;
            </h1>
          ) : (
            <h1 className="text-2xl font-semibold tracking-tight font-[family-name:var(--font-display)]">All Products</h1>
          )}
          <p className="text-sm text-neutral-500 mt-1">{total} products</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsFilterOpen(true)}
            className="flex items-center gap-2 px-4 py-2.5 border border-neutral-200 rounded-full text-sm font-medium hover:border-neutral-400 transition-colors lg:hidden"
          >
            <Filter className="w-4 h-4" /> Filters
          </button>
          <div className="flex items-center gap-2 border border-neutral-200 rounded-full px-4 py-2.5 text-sm">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={selectedSort}
              onChange={(e) => {
                setSelectedSort(e.target.value);
                updateSearchParam('sort', e.target.value);
              }}
              className="outline-none bg-transparent text-sm font-medium text-neutral-700 cursor-pointer"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Desktop Sidebar */}
        <aside className="hidden lg:block w-72 shrink-0">
          <div className="sticky top-24">
            <div className="flex items-center justify-between mb-6">
              <h2 className="font-semibold text-neutral-900">Filters</h2>
              {(selectedCategory || minPrice || maxPrice) && (
                <button
                  onClick={() => {
                    setSelectedCategory('');
                    setMinPrice('');
                    setMaxPrice('');
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
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} priority={i < 4} />
              ))}
            </div>
          )}

          {/* Pagination */}
          <div className="flex justify-center gap-2 mt-14">
            {[1, 2, 3, 4, 5].map((p, i) => (
              <button
                key={i}
                className={`w-9 h-9 rounded-full text-sm font-medium transition-colors ${
                  p === Number(initialParams.page ?? 1) ? 'bg-neutral-900 text-white' : 'text-neutral-600 hover:bg-neutral-100'
                }`}
                onClick={() => updateSearchParam('page', String(p), false)}
              >
                {p}
              </button>
            ))}
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
              className="w-full h-12 bg-green-700 text-white font-semibold rounded-xl mt-6 hover:bg-green-800 transition-colors"
            >
              Apply Filters
            </button>
          </div>
        </>
      )}
    </div>
  );
}
