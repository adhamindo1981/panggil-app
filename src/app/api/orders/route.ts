import { NextRequest, NextResponse } from 'next/server';
import { getServerOrders, createServerOrder } from '@/lib/server-order-store';
import { CreateOrderPayload, Order } from '@/types/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cafeId = searchParams.get('cafe_id') || undefined;
  const diskOrders = getServerOrders(cafeId);

  let mergedOrders = diskOrders;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (url && key) {
    try {
      const { createClient } = await import('@supabase/supabase-js');
      const supabase = createClient(url, key);
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (cafeId) {
        const cleanSlug = cafeId.replace(/^cafe-/, '').trim().toLowerCase();
        query = query.in('cafe_id', [cafeId, `cafe-${cleanSlug}`, cleanSlug]);
      }
      const { data, error } = await query;
      if (!error && data && Array.isArray(data)) {
        const map = new Map<string, Order>();
        (data as Order[]).forEach((o) => map.set(o.id, o));
        diskOrders.forEach((o) => {
          if (!map.has(o.id)) {
            map.set(o.id, o);
          }
        });
        mergedOrders = Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      }
    } catch {}
  }

  return NextResponse.json({ success: true, orders: mergedOrders });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderPayload;
    const newOrder = createServerOrder(body);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(url, key);
        await supabase.from('orders').upsert(newOrder);
      } catch {}
    }

    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    const errorMsg = (err as Error)?.message || String(err);
    console.error('Order creation error:', err);
    return NextResponse.json({ success: false, error: errorMsg }, { status: 400 });
  }
}
