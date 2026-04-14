import { type ClassValue, clsx } from 'clsx';

export function cn(...inputs: ClassValue[]) {
  return inputs.filter(Boolean).join(' ');
}

export function formatPrice(amount: number, currency = 'KES'): string {
  return `${currency} ${amount.toLocaleString('en-KE', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
}

export function formatPhone(phone: string): string {
  // Convert to 254XXXXXXXXX format for M-Pesa
  const cleaned = phone.replace(/\s+/g, '').replace(/[^0-9+]/g, '');
  if (cleaned.startsWith('+254')) return cleaned.replace('+', '');
  if (cleaned.startsWith('254')) return cleaned;
  if (cleaned.startsWith('07') || cleaned.startsWith('01')) {
    return '254' + cleaned.substring(1);
  }
  return cleaned;
}

export function isValidKenyanPhone(phone: string): boolean {
  const cleaned = phone.replace(/\s+/g, '');
  return /^(\+?254|0)[17]\d{8}$/.test(cleaned);
}

export function generateOrderNumber(): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const random = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `ANS-${timestamp}-${random}`;
}

export function calculateDiscount(
  price: number,
  coupon: { type: string; value: number; min_order_value: number } | null,
  cartTotal: number
): number {
  if (!coupon) return 0;
  if (cartTotal < coupon.min_order_value) return 0;

  if (coupon.type === 'percentage') {
    return Math.round((price * coupon.value) / 100);
  }
  if (coupon.type === 'fixed') {
    return Math.min(coupon.value, price);
  }
  return 0;
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/[^\w-]+/g, '')
    .replace(/--+/g, '-')
    .trim();
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.substring(0, maxLength) + '...';
}

export function getStockStatus(stock: number, threshold = 5): 'in_stock' | 'low_stock' | 'out_of_stock' {
  if (stock <= 0) return 'out_of_stock';
  if (stock <= threshold) return 'low_stock';
  return 'in_stock';
}

export function getProductPrice(product: { price: number; sale_price: number | null }): number {
  return product.sale_price ?? product.price;
}

export function getDiscountPercent(original: number, sale: number): number {
  return Math.round(((original - sale) / original) * 100);
}
