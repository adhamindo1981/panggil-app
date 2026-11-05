import React from 'react';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/data-layer';
import { LivePagerView } from '@/components/pager/LivePagerView';
import { Order, OrderStatus } from '@/types/database';

interface PageProps {
  params: Promise<{
    slug: string;
    orderId: string;
  }>;
  searchParams?: Promise<{
    num?: string;
    name?: string;
    status?: OrderStatus;
    t?: string;
  }>;
}

export default async function PagerPage({ params, searchParams }: PageProps) {
  const { slug, orderId } = await params;
  const search = searchParams ? await searchParams : {};
  let cafe = await dataService.getCafeBySlug(slug);

  if (!cafe) {
    const { getOrCreateDynamicCafe } = await import('@/lib/server-cafe-store');
    cafe = getOrCreateDynamicCafe(slug);
  }

  let order = await dataService.getOrderById(orderId);

  // Resilient fallback: If order is not immediately in serverless memory or cold instance,
  // reconstruct the active order state from URL parameters so the customer NEVER gets a 404
  if (!order) {
    const rawNum = search?.num ? decodeURIComponent(search.num) : '';
    const rawName = search?.name ? decodeURIComponent(search.name) : '';

    const fallbackOrder: Order = {
      id: orderId,
      cafe_id: cafe.id,
      order_number: rawNum || `#${orderId.slice(0, 5).toUpperCase()}`,
      customer_name: rawName || 'Pelanggan / عميل',
      customer_phone: '',
      status: (search?.status as OrderStatus) || 'pending',
      total_amount: search?.t ? Number(search.t) : 0,
      items: [],
      created_at: new Date().toISOString(),
    };

    order = fallbackOrder;
  }

  return <LivePagerView initialCafe={cafe} initialOrder={order} />;
}
