import { NextRequest, NextResponse } from 'next/server';
import { getServerOrders, createServerOrder } from '@/lib/server-order-store';
import { CreateOrderPayload } from '@/types/database';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const cafeId = searchParams.get('cafe_id') || undefined;
  const orders = getServerOrders(cafeId);
  return NextResponse.json({ success: true, orders });
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json()) as CreateOrderPayload;
    const newOrder = createServerOrder(body);
    return NextResponse.json({ success: true, order: newOrder }, { status: 201 });
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
