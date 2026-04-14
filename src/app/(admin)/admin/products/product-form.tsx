'use client';

import { useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';

type CategoryOption = { id: string; name: string };

type ProductFormValues = {
  name: string;
  slug: string;
  short_description: string;
  description: string;
  brand: string;
  sku: string;
  category_id: string;
  price: number;
  stock: number;
  image_url: string;
  is_published: boolean;
};

function slugify(value: string) {
  return value
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .replace(/--+/g, '-');
}

export function ProductForm({
  mode,
  categories,
  initialValues,
  productId,
}: {
  mode: 'create' | 'edit';
  categories: CategoryOption[];
  initialValues?: ProductFormValues;
  productId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const defaults = useMemo<ProductFormValues>(
    () =>
      initialValues ?? {
        name: '',
        slug: '',
        short_description: '',
        description: '',
        brand: '',
        sku: '',
        category_id: '',
        price: 0,
        stock: 0,
        image_url: '',
        is_published: false,
      },
    [initialValues]
  );

  const [values, setValues] = useState<ProductFormValues>(defaults);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);
    setBusy(true);

    try {
      const payload = {
        ...values,
        slug: values.slug.trim() || slugify(values.name),
        category_id: values.category_id || null,
        brand: values.brand || null,
        sku: values.sku || null,
        short_description: values.short_description || null,
        description: values.description || null,
        image_url: values.image_url || null,
      };

      const endpoint = mode === 'create' ? '/api/admin/products' : `/api/admin/products/${productId}`;
      const method = mode === 'create' ? 'POST' : 'PATCH';
      const res = await fetch(endpoint, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const json = await res.json().catch(() => ({}));
      if (!res.ok) {
        setError(json.error ?? 'Unable to save product');
        return;
      }

      router.push('/admin/products');
      router.refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Name</span>
          <input
            value={values.name}
            onChange={(e) => {
              const nextName = e.target.value;
              update('name', nextName);
              if (!values.slug) update('slug', slugify(nextName));
            }}
            required
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Slug</span>
          <input
            value={values.slug}
            onChange={(e) => update('slug', slugify(e.target.value))}
            required
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Brand</span>
          <input
            value={values.brand}
            onChange={(e) => update('brand', e.target.value)}
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">SKU</span>
          <input
            value={values.sku}
            onChange={(e) => update('sku', e.target.value)}
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </label>
      </div>

      <div className="grid md:grid-cols-3 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Price (KES)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.price}
            onChange={(e) => update('price', Number(e.target.value))}
            required
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Stock</span>
          <input
            type="number"
            min={0}
            step="1"
            value={values.stock}
            onChange={(e) => update('stock', Number(e.target.value))}
            required
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Category</span>
          <select
            value={values.category_id}
            onChange={(e) => update('category_id', e.target.value)}
            className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
          >
            <option value="">Uncategorized</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Primary Image URL</span>
        <input
          type="url"
          value={values.image_url}
          onChange={(e) => update('image_url', e.target.value)}
          placeholder="https://..."
          className="w-full h-10 rounded-xl border border-neutral-200 px-3 text-sm outline-none focus:border-neutral-400"
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Short Description</span>
        <textarea
          value={values.short_description}
          onChange={(e) => update('short_description', e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-neutral-500">Description</span>
        <textarea
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-neutral-200 px-3 py-2 text-sm outline-none focus:border-neutral-400"
        />
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-neutral-700">
        <input
          type="checkbox"
          checked={values.is_published}
          onChange={(e) => update('is_published', e.target.checked)}
          className="rounded border-neutral-300"
        />
        Published
      </label>

      {error && <p className="text-sm text-red-600">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="h-10 px-5 rounded-xl bg-neutral-900 text-white text-sm font-semibold disabled:opacity-60"
        >
          {busy ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="h-10 px-5 rounded-xl border border-neutral-200 text-sm font-semibold text-neutral-700"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
