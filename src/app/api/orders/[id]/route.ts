import { NextRequest, NextResponse } from 'next/server';
import { getServerOrderById, updateServerOrderStatus } from '@/lib/server-order-store';
import { OrderStatus } from '@/types/database';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const order = getServerOrderById(id);
  if (!order) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, order });
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = (await request.json()) as { status: OrderStatus };
    const updated = updateServerOrderStatus(id, body.status);

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(url, key);
        const updateData: Record<string, unknown> = { status: body.status };
        if (body.status === 'ready') updateData.ready_at = new Date().toISOString();
        if (body.status === 'completed') updateData.completed_at = new Date().toISOString();
        await supabase.from('orders').update(updateData).eq('id', id);
      } catch {}
    }

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}
