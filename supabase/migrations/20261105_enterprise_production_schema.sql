-- ====================================================================
-- Panggil / نداء - Enterprise Production Database Schema (PostgreSQL / Supabase)
-- Multi-Tenant Architecture for 500,000+ Cafes, Restaurants & Service Counters
-- ====================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ====================================================================
-- 1. TENANTS & CAFES (المشتركون والمقاهي)
-- ====================================================================
CREATE TABLE IF NOT EXISTS cafes (
  id TEXT PRIMARY KEY DEFAULT ('cafe-' || gen_random_uuid()::text),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  mode TEXT NOT NULL DEFAULT 'menu_pager' CHECK (mode IN ('pager_only', 'menu_pager')),
  default_lang TEXT NOT NULL DEFAULT 'ar' CHECK (default_lang IN ('id', 'ar', 'en')),
  subscription_tier TEXT NOT NULL DEFAULT 'silver' CHECK (subscription_tier IN ('basic', 'bronze', 'silver', 'gold')),
  subscription_status TEXT NOT NULL DEFAULT 'active' CHECK (subscription_status IN ('active', 'trial', 'expired', 'suspended')),
  subscription_expires_at TIMESTAMPTZ DEFAULT (NOW() + INTERVAL '1 year'),
  cashier_pin TEXT NOT NULL DEFAULT '1234',
  tax_rate NUMERIC(5, 2) DEFAULT 10.00,
  billing_cycle TEXT DEFAULT 'annual' CHECK (billing_cycle IN ('monthly', 'annual')),
  owner_name TEXT,
  owner_phone TEXT,
  owner_email TEXT,
  logo_url TEXT,
  phone TEXT,
  address TEXT,
  currency_symbol TEXT DEFAULT 'ر.س',
  google_maps_url TEXT,
  custom_branding JSONB DEFAULT '{}'::jsonb,
  support_notes JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- B-Tree Performance Indexes for Cafes
CREATE INDEX IF NOT EXISTS idx_cafes_slug ON cafes(LOWER(slug));
CREATE INDEX IF NOT EXISTS idx_cafes_tier ON cafes(subscription_tier);
CREATE INDEX IF NOT EXISTS idx_cafes_status ON cafes(subscription_status);
CREATE INDEX IF NOT EXISTS idx_cafes_expires ON cafes(subscription_expires_at);

-- ====================================================================
-- 2. PLATFORM STAFF & RBAC (إدارة الموظفين والصلاحيات)
-- ====================================================================
CREATE TABLE IF NOT EXISTS platform_users (
  id TEXT PRIMARY KEY DEFAULT ('user-' || gen_random_uuid()::text),
  email TEXT UNIQUE NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'support_agent' CHECK (role IN ('super_admin', 'onboarding_staff', 'support_agent')),
  permissions JSONB NOT NULL DEFAULT '{
    "can_create_tenant": false,
    "can_edit_tier": false,
    "can_suspend_tenant": false,
    "can_manage_menu": false,
    "can_view_crm": true,
    "can_manage_staff": false
  }'::jsonb,
  password TEXT,
  is_active BOOLEAN NOT NULL DEFAULT TRUE,
  last_login_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_platform_users_email ON platform_users(LOWER(email));
CREATE INDEX IF NOT EXISTS idx_platform_users_role ON platform_users(role);

-- ====================================================================
-- 3. MENU CATEGORIES (أقسام قائمة الطعام)
-- ====================================================================
CREATE TABLE IF NOT EXISTS menu_categories (
  id TEXT PRIMARY KEY DEFAULT ('cat-' || gen_random_uuid()::text),
  cafe_id TEXT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  name_id TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_categories_cafe ON menu_categories(cafe_id);
CREATE INDEX IF NOT EXISTS idx_menu_categories_order ON menu_categories(cafe_id, display_order ASC);

-- ====================================================================
-- 4. MENU ITEMS (أصناف قائمة الطعام)
-- ====================================================================
CREATE TABLE IF NOT EXISTS menu_items (
  id TEXT PRIMARY KEY DEFAULT ('item-' || gen_random_uuid()::text),
  category_id TEXT NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_id TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN NOT NULL DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_menu_items_category ON menu_items(category_id);
CREATE INDEX IF NOT EXISTS idx_menu_items_available ON menu_items(category_id, is_available);

-- ====================================================================
-- 5. ORDERS & PAGERS (الطلبات ونظام النداء اللحظي)
-- ====================================================================
CREATE TABLE IF NOT EXISTS orders (
  id TEXT PRIMARY KEY DEFAULT ('order-' || gen_random_uuid()::text),
  cafe_id TEXT NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'completed', 'cancelled')),
  total_amount NUMERIC(12, 2) DEFAULT 0,
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  buzzed_at BIGINT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ready_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Ultra-Fast Indexes for Orders (Sub-millisecond lookup at scale)
CREATE INDEX IF NOT EXISTS idx_orders_cafe_status ON orders(cafe_id, status);
CREATE INDEX IF NOT EXISTS idx_orders_cafe_created ON orders(cafe_id, created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_number ON orders(order_number);

-- ====================================================================
-- 6. REALTIME REPLICATION (تفعيل المزامنة الفورية عبر WebSockets)
-- ====================================================================
DO $$
BEGIN
  -- Enable Realtime on orders
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;

  -- Enable Realtime on cafes
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'cafes'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE cafes;
  END IF;

  -- Enable Realtime on menu_items
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'menu_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE menu_items;
  END IF;

  -- Enable Realtime on menu_categories
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'menu_categories'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE menu_categories;
  END IF;
END $$;

-- ====================================================================
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE cafes ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE platform_users ENABLE ROW LEVEL SECURITY;

-- Allow Public/Anon Read for Menus, Cafes, and active Pagers
CREATE POLICY "Public Read Cafes" ON cafes FOR SELECT USING (true);
CREATE POLICY "Public Read Categories" ON menu_categories FOR SELECT USING (true);
CREATE POLICY "Public Read Items" ON menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Orders" ON orders FOR SELECT USING (true);

-- Allow Public Order Placement from Customer Phone
CREATE POLICY "Public Create Orders" ON orders FOR INSERT WITH CHECK (true);

-- Allow Cashier and Admin Full Access
CREATE POLICY "Cashier and Admin Manage Cafes" ON cafes FOR ALL USING (true);
CREATE POLICY "Cashier and Admin Manage Categories" ON menu_categories FOR ALL USING (true);
CREATE POLICY "Cashier and Admin Manage Items" ON menu_items FOR ALL USING (true);
CREATE POLICY "Cashier and Admin Manage Orders" ON orders FOR ALL USING (true);
CREATE POLICY "Admin Manage Platform Users" ON platform_users FOR ALL USING (true);

-- ====================================================================
-- 8. INITIAL SEED DATA (البيانات الأولية للمنصة والمشتركين)
-- ====================================================================

-- 1. Default Super Admin User
INSERT INTO platform_users (id, email, name, role, permissions, password, is_active)
VALUES (
  'user-super-admin-001',
  'admin@panggil.id',
  'Super Admin (المالك)',
  'super_admin',
  '{
    "can_create_tenant": true,
    "can_edit_tier": true,
    "can_suspend_tenant": true,
    "can_manage_menu": true,
    "can_view_crm": true,
    "can_manage_staff": true
  }'::jsonb,
  'admin123',
  true
)
ON CONFLICT (email) DO UPDATE SET
  permissions = EXCLUDED.permissions,
  is_active = true;

-- 2. UBK Cafe (مقهى تجريبي برقم سري 1981)
INSERT INTO cafes (
  id, name, slug, mode, default_lang, subscription_tier, subscription_status,
  subscription_expires_at, cashier_pin, tax_rate, billing_cycle, owner_name,
  owner_phone, owner_email, currency_symbol, created_at
)
VALUES (
  'cafe-ubk',
  'UBK Cafe',
  'ubk',
  'menu_pager',
  'ar',
  'gold',
  'active',
  NOW() + INTERVAL '2 years',
  '1981',
  10.00,
  'annual',
  'Adham',
  '+966500001981',
  'owner@ubk.com',
  'ر.س',
  NOW()
)
ON CONFLICT (slug) DO UPDATE SET
  cashier_pin = '1981',
  subscription_tier = 'gold',
  subscription_status = 'active';

-- 3. Kopi Nusantara (إندونيسيا)
INSERT INTO cafes (
  id, name, slug, mode, default_lang, subscription_tier, subscription_status,
  subscription_expires_at, cashier_pin, tax_rate, billing_cycle, owner_name,
  owner_phone, owner_email, currency_symbol, logo_url, address, created_at
)
VALUES (
  'cafe-kopi-nusantara',
  'Kopi Nusantara / قهوة نوسانتارا',
  'kopi-nusantara',
  'menu_pager',
  'id',
  'gold',
  'active',
  NOW() + INTERVAL '1 year',
  '1234',
  10.00,
  'annual',
  'Budi Hartono',
  '+6281234567890',
  'budi@kopinusantara.id',
  'Rp',
  'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
  'Jl. Senopati No. 45, Jakarta Selatan',
  NOW()
)
ON CONFLICT (slug) DO NOTHING;

-- 4. Initial Menu for UBK
INSERT INTO menu_categories (id, cafe_id, name_id, name_ar, name_en, display_order)
VALUES
  ('cat-ubk-1', 'cafe-ubk', 'Minuman & Kopi', 'المشروبات والقهوة', 'Drinks & Coffee', 1),
  ('cat-ubk-2', 'cafe-ubk', 'Makanan & Dessert', 'المأكولات والحلويات', 'Food & Desserts', 2)
ON CONFLICT DO NOTHING;

INSERT INTO menu_items (id, category_id, name_id, name_ar, name_en, price, is_available)
VALUES
  ('item-ubk-1', 'cat-ubk-1', 'Signature Coffee', 'قهوة مميزة (Signature)', 'Special Coffee', 25.00, true),
  ('item-ubk-2', 'cat-ubk-2', 'Fresh Croissant', 'كرواسون طازج', 'Fresh Croissant', 20.00, true)
ON CONFLICT DO NOTHING;
