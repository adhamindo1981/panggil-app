import { NextRequest, NextResponse } from 'next/server';
import { updateServerOrderStatus } from '@/lib/server-order-store';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const updated = updateServerOrderStatus(id, 'ready', { buzzed: true });
  if (!updated) {
    return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
  }
  return NextResponse.json({ success: true, order: updated, buzzed_at: updated.buzzed_at || Date.now() });
}
