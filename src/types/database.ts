/**
 * Database and Domain Types for "Panggil / نداء"
 * Production-Ready Type Definitions with Strict Typing
 */

export type CafeMode = 'pager_only' | 'menu_pager';
export type AppLanguage = 'id' | 'ar' | 'en';
export type OrderStatus = 'pending' | 'ready' | 'completed' | 'cancelled';
export type SubscriptionTier = 'basic' | 'bronze' | 'silver' | 'gold';
export type SubscriptionStatus = 'active' | 'trial' | 'expired' | 'suspended';

export interface CustomBranding {
  logo_url?: string;
  primary_color?: string;
  hide_powered_by?: boolean;
}

export interface SupportNote {
  id: string;
  author_name: string;
  note: string;
  type: 'general' | 'support' | 'billing' | 'onboarding';
  created_at: string;
}

export interface Cafe {
  id: string;
  name: string;
  slug: string;
  mode: CafeMode;
  default_lang: AppLanguage;
  subscription_tier: SubscriptionTier;
  subscription_status?: SubscriptionStatus;
  subscription_expires_at?: string;
  owner_name?: string;
  owner_phone?: string;
  owner_email?: string;
  support_notes?: SupportNote[];
  custom_branding?: CustomBranding;
  logo_url?: string;
  phone?: string;
  address?: string;
  currency_symbol?: string;
  google_maps_url?: string;
  cashier_pin?: string;
  created_at?: string;
}

export type PlatformUserRole = 'super_admin' | 'onboarding_staff' | 'support_agent';

export interface PlatformPermissions {
  can_create_tenant: boolean;
  can_edit_tier: boolean;
  can_suspend_tenant: boolean;
  can_manage_menu: boolean;
  can_view_crm: boolean;
  can_manage_staff: boolean;
}

export interface PlatformUser {
  id: string;
  email: string;
  name: string;
  role: PlatformUserRole;
  permissions: PlatformPermissions;
  is_active: boolean;
  created_at: string;
  last_login_at?: string;
  password?: string;
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
  buzzed_at?: number;
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
  id?: string;
  cafe_id: string;
  order_number?: string;
  customer_name?: string;
  customer_phone?: string;
  items?: OrderItem[];
  total_amount?: number;
  notes?: string;
}
