/**
 * Database and Domain Types for "Panggil / نداء"
 * Production-Ready Type Definitions with Strict Typing
 */

export type CafeMode = 'pager_only' | 'menu_pager';
export type AppLanguage = 'id' | 'ar' | 'en';
export type OrderStatus = 'pending' | 'ready' | 'completed' | 'cancelled';

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  mode: CafeMode;
  default_lang: AppLanguage;
  logo_url?: string;
  phone?: string;
  address?: string;
  currency_symbol?: string;
  created_at?: string;
}

export interface MenuCategory {
  id: string;
  cafe_id: string;
  name_id: string;
  name_ar: string;
  name_en: string;
  display_order: number;
  created_at?: string;
}

export interface MenuItem {
  id: string;
  category_id: string;
  name_id: string;
  name_ar: string;
  name_en: string;
  price: number;
  image_url?: string;
  is_available: boolean;
  created_at?: string;
}

export interface OrderItem {
  id: string;
  name_id: string;
  name_ar: string;
  name_en: string;
  price: number;
  quantity: number;
  notes?: string;
}

export interface Order {
  id: string;
  cafe_id: string;
  order_number: string;
  customer_name?: string;
  customer_phone?: string;
  status: OrderStatus;
  total_amount: number;
  push_subscription?: PushSubscriptionJSON | null;
  items: OrderItem[];
  notes?: string;
  created_at: string;
  ready_at?: string | null;
  completed_at?: string | null;
}

export interface PushSubscriptionJSON {
  endpoint: string;
  expirationTime?: number | null;
  keys: {
    p256dh: string;
    auth: string;
  };
}

export interface CreateOrderPayload {
  cafe_id: string;
  order_number?: string;
  customer_name?: string;
  customer_phone?: string;
  items?: OrderItem[];
  total_amount?: number;
  notes?: string;
}
