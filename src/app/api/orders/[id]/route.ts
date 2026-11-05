import { NextRequest, NextResponse } from 'next/server';
import { getServerOrderById, updateServerOrderStatus } from '@/lib/server-order-store';
import { Order, OrderStatus } from '@/types/database';

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
    const body = (await request.json()) as { status: OrderStatus; order?: Partial<Order> };
    const updated = updateServerOrderStatus(id, body.status, { orderFallback: body.order });

    const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const key = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    if (url && key) {
      try {
        const { createClient } = await import('@supabase/supabase-js');
        const supabase = createClient(url, key);
        const updateData: Record<string, unknown> = {
          status: updated.status,
          ready_at: updated.ready_at,
          completed_at: updated.completed_at,
        };
        const { data: updatedRows } = await supabase
          .from('orders')
          .update(updateData)
          .eq('id', id)
          .select('id');

        // If not present in Supabase yet, upsert full order record
        if ((!updatedRows || updatedRows.length === 0) && body.order) {
          await supabase.from('orders').upsert([{ ...body.order, ...updateData, id }]);
        }
      } catch (err) {
        console.warn('Supabase patch sync notice:', err);
      }
    }

    return NextResponse.json({ success: true, order: updated });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Update failed' }, { status: 400 });
  }
}
