export type UserRole = 'customer' | 'admin';

export type OrderStatus =
  | 'pending_payment'
  | 'payment_confirmed'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type PaymentStatus = 'pending' | 'success' | 'failed' | 'timeout';

export type CouponType = 'percentage' | 'fixed' | 'free_shipping';

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  role: UserRole;
  created_at: string;
  updated_at: string;
}

export interface Address {
  id: string;
  user_id: string;
  line1: string;
  line2: string | null;
  city: string;
  county: string | null;
  country: string;
  is_default: boolean;
  created_at: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  parent_id: string | null;
  description: string | null;
  image_url: string | null;
  meta_title: string | null;
  meta_description: string | null;
  sort_order: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductImage {
  id: string;
  product_id: string;
  url: string;
  alt: string | null;
  sort_order: number;
  is_primary: boolean;
}

export interface ProductVariant {
  id: string;
  product_id: string;
  name: string;
  options: Record<string, string>;
  price_modifier: number;
  stock: number;
  sku: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string | null;
  short_description: string | null;
  category_id: string | null;
  price: number;
  sale_price: number | null;
  cost_price: number | null;
  sku: string | null;
  stock: number;
  low_stock_threshold: number;
  weight_kg: number | null;
  tags: string[];
  brand: string | null;
  is_published: boolean;
  is_featured: boolean;
  average_rating: number;
  review_count: number;
  meta_title: string | null;
  meta_description: string | null;
  created_at: string;
  updated_at: string;
  // Relations (joined)
  category?: Category;
  images?: ProductImage[];
  variants?: ProductVariant[];
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  added_at: string;
  // Joined
  product?: Product;
  variant?: ProductVariant;
}

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  items: CartItem[];
  created_at: string;
  updated_at: string;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  added_at: string;
  product?: Product;
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  variant_id: string | null;
  product_name: string;
  product_image: string | null;
  variant_name: string | null;
  quantity: number;
  unit_price: number;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  note: string | null;
  changed_by: string | null;
  changed_at: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id: string;
  status: OrderStatus;
  subtotal: number;
  discount_amount: number;
  shipping_amount: number;
  total: number;
  coupon_id: string | null;
  shipping_address: Address;
  notes: string | null;
  checkout_request_id: string | null;
  mpesa_receipt: string | null;
  payment_phone: string | null;
  shipping_rider_name?: string | null;
  shipping_rider_phone?: string | null;
  created_at: string;
  updated_at: string;
  // Joined
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
  profile?: Profile;
}

export interface Coupon {
  id: string;
  code: string;
  description: string | null;
  type: CouponType;
  value: number;
  min_order_value: number;
  max_uses: number | null;
  used_count: number;
  per_user_limit: number;
  product_id: string | null;
  category_id: string | null;
  is_stackable: boolean;
  is_active: boolean;
  starts_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  order_id: string | null;
  rating: number;
  title: string | null;
  body: string | null;
  is_approved: boolean;
  helpful_count: number;
  created_at: string;
  profile?: Profile;
}

export interface Payment {
  id: string;
  order_id: string;
  checkout_request_id: string;
  merchant_request_id: string | null;
  mpesa_receipt: string | null;
  phone: string | null;
  amount: number;
  status: PaymentStatus;
  result_code: number | null;
  result_desc: string | null;
  created_at: string;
  updated_at: string;
}

// Cart store types
export interface CartState {
  items: LocalCartItem[];
  isOpen: boolean;
  isLoading: boolean;
}

export interface LocalCartItem {
  productId: string;
  variantId: string | null;
  quantity: number;
  product: Pick<Product, 'id' | 'name' | 'price' | 'sale_price' | 'slug'> & {
    image?: string;
  };
  variant?: Pick<ProductVariant, 'id' | 'name' | 'price_modifier'>;
}

// API response types
export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  totalPages: number;
  perPage: number;
}

export interface ApiError {
  message: string;
  code?: string;
}

// Analytics types
export interface RevenueByDay {
  day: string;
  revenue: number;
}

export interface TopProduct {
  name: string;
  revenue: number;
  units: number;
}

export interface AdminStats {
  totalRevenue: number;
  totalOrders: number;
  totalCustomers: number;
  averageOrderValue: number;
  revenueByDay: RevenueByDay[];
  topProducts: TopProduct[];
  ordersByStatus: Record<OrderStatus, number>;
}
