import { NextRequest, NextResponse } from 'next/server';
import {
  getServerCategories,
  getServerMenuItems,
  saveServerCategory,
  deleteServerCategory,
  saveServerMenuItem,
  updateServerMenuItem,
  deleteServerMenuItem,
  seedStarterMenuForCafe,
} from '@/lib/server-menu-store';
import { MenuCategory, MenuItem } from '@/types/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cafeId = searchParams.get('cafe_id');

  if (!cafeId) {
    return NextResponse.json({
      success: true,
      categories: getServerCategories(),
      items: getServerMenuItems(),
    });
  }

  const cleanSlug = cafeId.replace(/^cafe-/, '').trim().toLowerCase();
  const matchingCafeIds = Array.from(
    new Set(
      cleanSlug.startsWith('ubk')
        ? ['cafe-ubk', 'ubk', 'cafe-ubkcaffe', 'ubkcaffe']
        : [cafeId, `cafe-${cleanSlug}`, cleanSlug]
    )
  ).filter(Boolean);

  let supabaseCategories: MenuCategory[] = [];
  let supabaseItems: MenuItem[] = [];

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(url, key);
      const { data: cats } = await supabase
        .from('menu_categories')
        .select('*')
        .in('cafe_id', matchingCafeIds)
        .order('display_order', { ascending: true });

      if (cats && cats.length > 0) {
        supabaseCategories = cats as MenuCategory[];
        const catIds = supabaseCategories.map((c) => c.id);
        const { data: items } = await supabase
          .from('menu_items')
          .select('*')
          .in('category_id', catIds)
          .order('created_at', { ascending: true });
        if (items) {
          supabaseItems = items as MenuItem[];
        }
      }
    } catch (err) {
      console.warn('Supabase menu fetch warning:', err);
    }
  }

  // Get server categories and items
  let serverCats = getServerCategories(cafeId);
  let serverItems = getServerMenuItems(cafeId);

  // Merge categories by id
  const catMap = new Map<string, MenuCategory>();
  supabaseCategories.forEach((c) => catMap.set(c.id, c));
  serverCats.forEach((c) => {
    if (!catMap.has(c.id)) {
      catMap.set(c.id, c);
    } else {
      catMap.set(c.id, { ...c, ...catMap.get(c.id)! });
    }
  });

  // Merge items by id
  const itemMap = new Map<string, MenuItem>();
  supabaseItems.forEach((i) => itemMap.set(i.id, i));
  serverItems.forEach((i) => {
    if (!itemMap.has(i.id)) {
      itemMap.set(i.id, i);
    } else {
      itemMap.set(i.id, { ...i, ...itemMap.get(i.id)! });
    }
  });

  let mergedCategories = Array.from(catMap.values());
  let mergedItems = Array.from(itemMap.values());

  // Only seed starter menu if absolutely zero categories exist anywhere
  if (mergedCategories.length === 0) {
    const seeded = seedStarterMenuForCafe(cafeId);
    mergedCategories = seeded.categories;
    mergedItems = seeded.items;
  }

  return NextResponse.json({
    success: true,
    categories: mergedCategories,
    items: mergedItems,
  });
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, data } = body;
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (type === 'category') {
      const saved = saveServerCategory(data as MenuCategory);

      if (url && key) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(url, key);
          await supabase.from('menu_categories').upsert([saved]);
        } catch (e) {
          console.warn('Supabase category post sync warning:', e);
        }
      }
      return NextResponse.json({ success: true, category: saved }, { status: 201 });
    }

    if (type === 'item') {
      const saved = saveServerMenuItem(data as MenuItem);

      if (url && key) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(url, key);
          const { description, description_ar, ...baseData } = saved;
          const { error: insertErr } = await supabase.from('menu_items').upsert([saved]);
          if (insertErr) {
            // Graceful fallback if description column does not exist in Supabase yet
            await supabase.from('menu_items').upsert([baseData]);
          }
        } catch (e) {
          console.warn('Supabase item post sync warning:', e);
        }
      }
      return NextResponse.json({ success: true, item: saved }, { status: 201 });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to create' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, updates } = body;

    if (!id || !updates) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const updated = updateServerMenuItem(id, updates);
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key && updated) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(url, key);
        const { description, description_ar, ...baseUpdates } = updates;
        const { error } = await supabase.from('menu_items').update(updates).eq('id', id);
        if (error) {
          await supabase.from('menu_items').update(baseUpdates).eq('id', id);
        }
      } catch (err) {
        console.warn('Supabase PUT menu update warning:', err);
      }
    }
    return NextResponse.json({ success: true, item: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to update' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const type = searchParams.get('type');
    const id = searchParams.get('id');

    if (!id || !type) {
      return NextResponse.json({ success: false, error: 'Missing parameters' }, { status: 400 });
    }

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

    if (type === 'category') {
      deleteServerCategory(id);
      if (url && key) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(url, key);
          await supabase.from('menu_categories').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase DELETE category warning:', err);
        }
      }
      return NextResponse.json({ success: true });
    }

    if (type === 'item') {
      deleteServerMenuItem(id);
      if (url && key) {
        try {
          const { createClient } = await import('@supabase/supabase-js');
          const supabase = createClient(url, key);
          await supabase.from('menu_items').delete().eq('id', id);
        } catch (err) {
          console.warn('Supabase DELETE item warning:', err);
        }
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, error: 'Invalid type' }, { status: 400 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Failed to delete' }, { status: 500 });
  }
}
