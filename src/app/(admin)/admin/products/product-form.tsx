'use client';

import { useEffect, useMemo, useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Star, X } from 'lucide-react';

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
  sale_price: number | '';
  stock: number;
  is_published: boolean;
};

export type ProductImageInput = {
  url: string;
  is_primary?: boolean | null;
  sort_order?: number | null;
};

type ImageDraft = {
  key: string;
  url: string;
  isPrimary: boolean;
  file?: File;
  objectUrl?: string;
};

function isLocalPreviewUrl(url: string) {
  return url.startsWith('blob:') || url.startsWith('data:');
}

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
  initialImages,
  productId,
}: {
  mode: 'create' | 'edit';
  categories: CategoryOption[];
  initialValues?: ProductFormValues;
  initialImages?: ProductImageInput[];
  productId?: string;
}) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);
  const [images, setImages] = useState<ImageDraft[]>(() => {
    const seeded = (initialImages ?? [])
      .slice()
      .sort((a, b) => Number(a.sort_order ?? 0) - Number(b.sort_order ?? 0))
      .map((img, idx) => ({
        key: `existing-${idx}-${img.url}`,
        url: img.url,
        isPrimary: Boolean(img.is_primary),
      }));
    if (seeded.length === 0) return [];
    const hasPrimary = seeded.some((i) => i.isPrimary);
    return hasPrimary ? seeded : seeded.map((i, idx) => ({ ...i, isPrimary: idx === 0 }));
  });

  useEffect(() => {
    return () => {
      images.forEach((img) => {
        if (img.objectUrl) URL.revokeObjectURL(img.objectUrl);
      });
    };
  }, [images]);

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
        sale_price: '',
        stock: 0,
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
      const pathSafeSlug = (values.slug.trim() || slugify(values.name) || 'product').slice(0, 80);

      const uploaded = await Promise.all(
        images.map(async (img, idx) => {
          if (!img.file) {
            return { url: img.url, is_primary: img.isPrimary, sort_order: idx };
          }

          const fd = new FormData();
          fd.set('file', img.file);
          fd.set('slug', pathSafeSlug);
          const res = await fetch('/api/admin/uploads/product-image', { method: 'POST', body: fd });
          const json = (await res.json().catch(() => ({}))) as { url?: string; error?: string };
          if (!res.ok) {
            throw new Error(json.error ?? 'Unable to upload image');
          }
          const publicUrl = json.url ?? null;
          if (!publicUrl) throw new Error('Upload succeeded but no URL returned');

          return { url: publicUrl, is_primary: img.isPrimary, sort_order: idx };
        })
      );

      const hasPrimary = uploaded.some((i) => i.is_primary);
      const imagesPayload = hasPrimary
        ? uploaded
        : uploaded.map((i, idx) => ({ ...i, is_primary: idx === 0 }));

      const payload = {
        ...values,
        slug: values.slug.trim() || slugify(values.name),
        category_id: values.category_id || null,
        sale_price:
          values.sale_price === '' || Number.isNaN(Number(values.sale_price))
            ? null
            : Number(values.sale_price),
        brand: values.brand || null,
        sku: values.sku || null,
        short_description: values.short_description || null,
        description: values.description || null,
        images: imagesPayload,
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

  function addFiles(fileList: FileList | null) {
    if (!fileList || fileList.length === 0) return;
    setImages((prev) => {
      const next = [...prev];
      for (const file of Array.from(fileList)) {
        const objectUrl = URL.createObjectURL(file);
        next.push({
          key: `new-${crypto.randomUUID()}`,
          url: objectUrl,
          objectUrl,
          file,
          isPrimary: false,
        });
      }
      if (!next.some((i) => i.isPrimary) && next.length > 0) next[0] = { ...next[0], isPrimary: true };
      return next;
    });
  }

  function setPrimary(key: string) {
    setImages((prev) => prev.map((img) => ({ ...img, isPrimary: img.key === key })));
  }

  function removeImage(key: string) {
    setImages((prev) => {
      const existing = prev.find((i) => i.key === key);
      if (existing?.objectUrl) URL.revokeObjectURL(existing.objectUrl);
      const next = prev.filter((i) => i.key !== key);
      if (next.length > 0 && !next.some((i) => i.isPrimary)) next[0] = { ...next[0], isPrimary: true };
      return next;
    });
  }

  return (
    <form onSubmit={onSubmit} className="space-y-5">
      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Name</span>
          <input
            value={values.name}
            onChange={(e) => {
              const nextName = e.target.value;
              update('name', nextName);
              if (!values.slug) update('slug', slugify(nextName));
            }}
            required
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Slug</span>
          <input
            value={values.slug}
            onChange={(e) => update('slug', slugify(e.target.value))}
            required
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
        </label>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Brand</span>
          <input
            value={values.brand}
            onChange={(e) => update('brand', e.target.value)}
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">SKU</span>
          <input
            value={values.sku}
            onChange={(e) => update('sku', e.target.value)}
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
        </label>
      </div>

      <div className="grid md:grid-cols-4 gap-4">
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Initial Price (KES)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.price}
            onChange={(e) => update('price', Number(e.target.value))}
            required
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">New Price (KES)</span>
          <input
            type="number"
            min={0}
            step="0.01"
            value={values.sale_price}
            onChange={(e) =>
              update('sale_price', e.target.value === '' ? '' : Number(e.target.value))
            }
            placeholder="Optional"
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
          />
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Stock</span>
          <select
            value={values.stock > 0 ? 'in' : 'out'}
            onChange={(e) => {
              const next = e.target.value;
              if (next === 'out') update('stock', 0);
              else update('stock', Math.max(1, Number(values.stock || 0)));
            }}
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30"
          >
            <option value="in">In Stock</option>
            <option value="out">Out of Stock</option>
          </select>
        </label>
        <label className="space-y-1.5">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Category</span>
          <select
            value={values.category_id}
            onChange={(e) => update('category_id', e.target.value)}
            className="w-full h-10 rounded-xl border border-white/10 bg-[#121417] px-3 text-sm text-white outline-none focus:border-white/30"
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

      <div className="space-y-3">
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Images</span>
          <input
            type="file"
            accept="image/*"
            multiple
            onChange={(e) => addFiles(e.target.files)}
            className="block w-full max-w-[360px] text-sm text-gray-300 file:mr-4 file:rounded-lg file:border-0 file:bg-white file:px-4 file:py-2 file:text-xs file:font-semibold file:text-black hover:file:bg-gray-200"
          />
        </div>

        <p className="text-xs text-gray-500">
          Upload multiple images. Pick one as <span className="text-gray-300 font-semibold">Primary</span>.
        </p>

        {images.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {images.map((img) => (
              <div key={img.key} className="rounded-xl border border-white/10 bg-[#121417] overflow-hidden">
                <div className="relative aspect-square">
                  {isLocalPreviewUrl(img.url) ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={img.url} alt="Product image" className="absolute inset-0 h-full w-full object-cover" />
                  ) : (
                    <Image src={img.url} alt="Product image" fill className="object-cover" />
                  )}
                  {img.isPrimary ? (
                    <span className="absolute left-2 top-2 inline-flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-[10px] font-bold text-black">
                      <Star className="h-3 w-3" /> Primary
                    </span>
                  ) : null}
                  <button
                    type="button"
                    onClick={() => removeImage(img.key)}
                    className="absolute right-2 top-2 inline-flex h-7 w-7 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80"
                    aria-label="Remove image"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
                <div className="p-2">
                  <button
                    type="button"
                    disabled={busy}
                    onClick={() => setPrimary(img.key)}
                    className="w-full h-9 rounded-lg border border-white/10 text-gray-300 hover:bg-white/5 disabled:opacity-60 text-xs font-semibold"
                  >
                    Set as Primary
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-xl border border-white/10 bg-[#121417] p-4 text-sm text-gray-500">
            No images yet. Add one or more images above.
          </div>
        )}
      </div>

      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Short Description</span>
        <textarea
          value={values.short_description}
          onChange={(e) => update('short_description', e.target.value)}
          rows={2}
          className="w-full rounded-xl border border-white/10 bg-[#121417] px-3 py-2 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold uppercase tracking-wider text-gray-500">Description</span>
        <textarea
          value={values.description}
          onChange={(e) => update('description', e.target.value)}
          rows={5}
          className="w-full rounded-xl border border-white/10 bg-[#121417] px-3 py-2 text-sm text-white outline-none focus:border-white/30 placeholder:text-gray-500"
        />
      </label>

      <label className="inline-flex items-center gap-2 text-sm text-gray-300">
        <input
          type="checkbox"
          checked={values.is_published}
          onChange={(e) => update('is_published', e.target.checked)}
          className="rounded border-white/20 bg-[#121417]"
        />
        Published
      </label>

      {error && <p className="text-sm text-red-300">{error}</p>}

      <div className="flex items-center gap-3">
        <button
          type="submit"
          disabled={busy}
          className="h-10 px-5 rounded-xl bg-white text-black text-sm font-semibold hover:bg-gray-200 disabled:opacity-60"
        >
          {busy ? 'Saving...' : mode === 'create' ? 'Create Product' : 'Save Changes'}
        </button>
        <button
          type="button"
          onClick={() => router.push('/admin/products')}
          className="h-10 px-5 rounded-xl border border-white/10 text-sm font-semibold text-gray-300 hover:bg-white/5"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
