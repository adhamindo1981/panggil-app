-- ====================================================================
-- Panggil / نداء - Database Migration & Schema
-- Multi-tenant Digital Pager & Digital Menu System for Cafes & Restaurants
-- ====================================================================

-- 1. Cafes / Tenants Table
CREATE TABLE IF NOT EXISTS cafes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  mode TEXT NOT NULL DEFAULT 'menu_pager' CHECK (mode IN ('pager_only', 'menu_pager')),
  default_lang TEXT NOT NULL DEFAULT 'id' CHECK (default_lang IN ('id', 'ar', 'en')),
  logo_url TEXT,
  phone TEXT,
  address TEXT,
  currency_symbol TEXT DEFAULT 'Rp',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Menu Categories Table
CREATE TABLE IF NOT EXISTS menu_categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  name_id TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Menu Items Table
CREATE TABLE IF NOT EXISTS menu_items (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id UUID NOT NULL REFERENCES menu_categories(id) ON DELETE CASCADE,
  name_id TEXT NOT NULL,
  name_ar TEXT NOT NULL,
  name_en TEXT NOT NULL,
  price NUMERIC(12, 2) NOT NULL DEFAULT 0,
  image_url TEXT,
  is_available BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Orders & Pagers Table
CREATE TABLE IF NOT EXISTS orders (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  cafe_id UUID NOT NULL REFERENCES cafes(id) ON DELETE CASCADE,
  order_number TEXT NOT NULL,
  customer_name TEXT,
  customer_phone TEXT,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'ready', 'completed', 'cancelled')),
  total_amount NUMERIC(12, 2) DEFAULT 0,
  push_subscription JSONB,
  items JSONB DEFAULT '[]'::jsonb,
  notes TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  ready_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ
);

-- Create Indexes for performance
CREATE INDEX IF NOT EXISTS idx_cafes_slug ON cafes(slug);
CREATE INDEX IF NOT EXISTS idx_orders_cafe_id ON orders(cafe_id);
CREATE INDEX IF NOT EXISTS idx_orders_status ON orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON orders(created_at DESC);

-- Enable Supabase Realtime for the orders table
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE orders;
  END IF;
END $$;

-- ====================================================================
-- SEED DATA (بيانات تجريبية أولية)
-- ====================================================================

-- 1. Insert Demo Cafes
INSERT INTO cafes (id, name, slug, mode, default_lang, logo_url, phone, address, currency_symbol)
VALUES 
  (
    '00000000-0000-0000-0000-000000000001',
    'Kopi Nusantara / قهوة نوسانتارا',
    'kopi-nusantara',
    'menu_pager',
    'id',
    'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    '+62 812-3456-7890',
    'Jl. Senopati No. 45, Jakarta Selatan',
    'Rp'
  ),
  (
    '00000000-0000-0000-0000-000000000002',
    'Nedaa Express / نداء إكسبريس',
    'nedaa-express',
    'pager_only',
    'ar',
    'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&auto=format&fit=crop&q=80',
    '+966 50 123 4567',
    'طريق الملك فهد، العليا، الرياض',
    'SAR'
  )
ON CONFLICT (slug) DO NOTHING;

-- 2. Insert Menu Categories for Kopi Nusantara
INSERT INTO menu_categories (id, cafe_id, name_id, name_ar, name_en, display_order)
VALUES
  ('10000000-0000-0000-0000-000000000001', '00000000-0000-0000-0000-000000000001', 'Kopi Signature', 'القهوة المختصة', 'Signature Coffee', 1),
  ('10000000-0000-0000-0000-000000000002', '00000000-0000-0000-0000-000000000001', 'Minuman Non-Kopi', 'المشروبات المنعشة', 'Non-Coffee Drinks', 2),
  ('10000000-0000-0000-0000-000000000003', '00000000-0000-0000-0000-000000000001', 'Makanan Berat', 'الوجبات الرئيسية', 'Main Meals', 3),
  ('10000000-0000-0000-0000-000000000004', '00000000-0000-0000-0000-000000000001', 'Camilan & Roti', 'الحلويات والمخبوزات', 'Snacks & Pastries', 4)
ON CONFLICT DO NOTHING;

-- 3. Insert Menu Items
INSERT INTO menu_items (id, category_id, name_id, name_ar, name_en, price, image_url, is_available)
VALUES
  -- Coffee
  ('20000000-0000-0000-0000-000000000001', '10000000-0000-0000-0000-000000000001', 'Es Kopi Susu Gula Aren', 'قهوة مثلجة بحليب نخيل السكر', 'Iced Palm Sugar Latte', 22000, 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80', true),
  ('20000000-0000-0000-0000-000000000002', '10000000-0000-0000-0000-000000000001', 'Americano Double Shot', 'أمريكانو دبل شوت', 'Double Shot Americano', 18000, 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80', true),
  ('20000000-0000-0000-0000-000000000003', '10000000-0000-0000-0000-000000000001', 'Spanish Latte Creamy', 'سبانش لاتيه كريمي', 'Creamy Spanish Latte', 28000, 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80', true),
  
  -- Non-Coffee
  ('20000000-0000-0000-0000-000000000004', '10000000-0000-0000-0000-000000000002', 'Matcha Latte Premium', 'ماتشا لاتيه فاخر', 'Premium Matcha Latte', 26000, 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80', true),
  ('20000000-0000-0000-0000-000000000005', '10000000-0000-0000-0000-000000000002', 'Signature Artisan Chocolate', 'شوكولاتة حرفية مميزة', 'Artisan Dark Chocolate', 25000, 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80', true),

  -- Food
  ('20000000-0000-0000-0000-000000000006', '10000000-0000-0000-0000-000000000003', 'Nasi Goreng Kampung Spesial', 'أرز مقلي مقرمش إندونيسي خاص', 'Special Kampung Fried Rice', 35000, 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80', true),
  ('20000000-0000-0000-0000-000000000007', '10000000-0000-0000-0000-000000000003', 'Crispy Chicken Mentai Rice', 'أرز دجاج مقرمش بصلصة المينتاي', 'Crispy Chicken Mentai', 38000, 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80', true),

  -- Snacks
  ('20000000-0000-0000-0000-000000000008', '10000000-0000-0000-0000-000000000004', 'Kentang Goreng Truffle & Keju', 'بطاطس مقلية بالكمأة والجبن', 'Truffle Parmesan Fries', 24000, 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80', true),
  ('20000000-0000-0000-0000-000000000009', '10000000-0000-0000-0000-000000000004', 'Croissant Butter Perancis', 'كرواسون زبدة فرنسي طازج', 'French Butter Croissant', 20000, 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80', true)
ON CONFLICT DO NOTHING;

-- 4. Initial Sample Orders
INSERT INTO orders (id, cafe_id, order_number, customer_name, customer_phone, status, total_amount, items, created_at)
VALUES
  (
    '30000000-0000-0000-0000-000000000001',
    '00000000-0000-0000-0000-000000000001',
    '#A-101',
    'Budi Santoso / بودي',
    '+628129876543',
    'pending',
    44000,
    '[{"id":"20000000-0000-0000-0000-000000000001","name_id":"Es Kopi Susu Gula Aren","name_ar":"قهوة مثلجة بحليب نخيل السكر","name_en":"Iced Palm Sugar Latte","price":22000,"quantity":2}]'::jsonb,
    NOW() - INTERVAL '4 minutes'
  ),
  (
    '30000000-0000-0000-0000-000000000002',
    '00000000-0000-0000-0000-000000000001',
    '#A-102',
    'Siti Rahma / سارة',
    '+628131122334',
    'ready',
    59000,
    '[{"id":"20000000-0000-0000-0000-000000000006","name_id":"Nasi Goreng Kampung Spesial","name_ar":"أرز مقلي مقرمش إندونيسي خاص","name_en":"Special Kampung Fried Rice","price":35000,"quantity":1},{"id":"20000000-0000-0000-0000-000000000008","name_id":"Kentang Goreng Truffle & Keju","name_ar":"بطاطس مقلية بالكمأة والجبن","name_en":"Truffle Parmesan Fries","price":24000,"quantity":1}]'::jsonb,
    NOW() - INTERVAL '12 minutes'
  )
ON CONFLICT DO NOTHING;
