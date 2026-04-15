'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Search, X } from 'lucide-react';
import { formatPrice } from '@/lib/utils';

type SearchSuggestion = {
  id: string;
  name: string;
  slug: string;
  price: number;
  sale_price: number | null;
  image: string | null;
  skin_type?: string[];
};

export function SearchBar({
  isOpen,
  onClose,
}: {
  isOpen: boolean;
  onClose: () => void;
}) {
  const router = useRouter();
  const inputRef = useRef<HTMLInputElement>(null);
  const [query, setQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState(-1);
  const [loading, setLoading] = useState(false);
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);

  const hasSuggestions = suggestions.length > 0;
  const canShowDropdown = isOpen && query.trim().length >= 2;

  useEffect(() => {
    if (!isOpen) return;
    const timer = window.setTimeout(() => inputRef.current?.focus(), 50);
    return () => window.clearTimeout(timer);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const q = query.trim();
    if (q.length < 2) {
      setSuggestions([]);
      setActiveIndex(-1);
      setLoading(false);
      return;
    }

    let cancelled = false;
    const timeout = window.setTimeout(async () => {
      setLoading(true);
      try {
        const res = await fetch(`/api/search/suggestions?q=${encodeURIComponent(q)}`, {
          cache: 'no-store',
        });
        const payload = await res.json();
        if (!cancelled) {
          setSuggestions(payload.suggestions ?? []);
          setActiveIndex(-1);
        }
      } catch {
        if (!cancelled) {
          setSuggestions([]);
          setActiveIndex(-1);
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    }, 300);

    return () => {
      cancelled = true;
      window.clearTimeout(timeout);
    };
  }, [query, isOpen]);

  const selectedSuggestion = useMemo(
    () => (activeIndex >= 0 ? suggestions[activeIndex] : null),
    [activeIndex, suggestions]
  );

  function submitSearch(nextQuery?: string) {
    const q = (nextQuery ?? query).trim();
    if (!q) return;
    router.push(`/products?q=${encodeURIComponent(q)}`);
    setQuery('');
    setSuggestions([]);
    setActiveIndex(-1);
    onClose();
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!hasSuggestions) {
      if (e.key === 'Enter') {
        e.preventDefault();
        submitSearch();
      }
      if (e.key === 'Escape') onClose();
      return;
    }

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setActiveIndex((prev) => (prev < suggestions.length - 1 ? prev + 1 : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setActiveIndex((prev) => (prev > 0 ? prev - 1 : suggestions.length - 1));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (selectedSuggestion) {
        router.push(`/products/${selectedSuggestion.slug}`);
        onClose();
      } else {
        submitSearch();
      }
    } else if (e.key === 'Escape') {
      onClose();
    }
  }

  if (!isOpen) return null;

  return (
    <div className="absolute inset-0 bg-white z-60 flex items-center px-4 md:px-6">
      <div className="w-full max-w-[1440px] mx-auto">
        <div className="flex items-center gap-3">
          <Search className="w-5 h-5 text-neutral-400 shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products, ingredients, concerns..."
            className="flex-1 h-10 bg-transparent border-none outline-none text-sm text-neutral-900 placeholder:text-neutral-400"
          />
          <button
            type="button"
            onClick={onClose}
            className="p-2 hover:bg-neutral-100 rounded-full text-neutral-500 hover:text-neutral-900 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {canShowDropdown && (
          <div className="mt-3 rounded-xl border border-neutral-200 bg-white shadow-xl overflow-hidden">
            {loading && <p className="px-4 py-3 text-xs text-neutral-500">Searching...</p>}
            {!loading && suggestions.length === 0 && (
              <p className="px-4 py-3 text-xs text-neutral-500">No suggestions. Press Enter to search all products.</p>
            )}
            {!loading && suggestions.length > 0 && (
              <ul className="max-h-80 overflow-auto">
                {suggestions.map((item, idx) => {
                  const active = idx === activeIndex;
                  const price = item.sale_price ?? item.price;
                  return (
                    <li key={item.id}>
                      <button
                        type="button"
                        onMouseEnter={() => setActiveIndex(idx)}
                        onClick={() => {
                          router.push(`/products/${item.slug}`);
                          onClose();
                        }}
                        className={`w-full px-4 py-3 text-left flex items-center gap-3 ${
                          active ? 'bg-neutral-100' : 'hover:bg-neutral-50'
                        }`}
                      >
                        <div className="w-11 h-11 rounded-md overflow-hidden bg-neutral-100 shrink-0">
                          {item.image ? (
                            <Image src={item.image} alt={item.name} width={44} height={44} className="w-full h-full object-cover" />
                          ) : null}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-neutral-900 truncate">{item.name}</p>
                          <div className="flex items-center gap-2 mt-1">
                            <span className="text-xs font-semibold text-neutral-700">{formatPrice(price)}</span>
                            {(item.skin_type ?? []).slice(0, 2).map((skin) => (
                              <span key={skin} className="text-[10px] px-1.5 py-0.5 rounded-full bg-green-50 text-green-700 capitalize">
                                {skin}
                              </span>
                            ))}
                          </div>
                        </div>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
