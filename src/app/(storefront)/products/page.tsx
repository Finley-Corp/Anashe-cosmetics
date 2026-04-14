import { Suspense } from 'react';
import { ProductListingClient } from './ProductListingClient';

export const metadata = {
  title: 'All Products',
  description: 'Browse thousands of premium products with easy M-Pesa checkout. Filter by category, price, and more.',
};

export default function ProductsPage({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  return (
    <Suspense fallback={<ProductListingFallback />}>
      <ProductListingWrapper searchParams={searchParams} />
    </Suspense>
  );
}

async function ProductListingWrapper({
  searchParams,
}: {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
}) {
  const params = await searchParams;
  return <ProductListingClient initialParams={params} />;
}

function ProductListingFallback() {
  return (
    <div className="max-w-[1440px] mx-auto px-4 md:px-6 py-10">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="space-y-3">
            <div className="aspect-square bg-neutral-100 rounded-xl skeleton" />
            <div className="h-4 bg-neutral-100 rounded skeleton w-3/4" />
            <div className="h-3 bg-neutral-100 rounded skeleton w-1/2" />
          </div>
        ))}
      </div>
    </div>
  );
}
