import React from 'react';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/data-layer';
import { LivePagerView } from '@/components/pager/LivePagerView';

interface PageProps {
  params: Promise<{
    slug: string;
    orderId: string;
  }>;
}

export default async function PagerPage({ params }: PageProps) {
  const { slug, orderId } = await params;
  const cafe = await dataService.getCafeBySlug(slug);

  if (!cafe) {
    notFound();
  }

  const order = await dataService.getOrderById(orderId);

  if (!order) {
    notFound();
  }

  return <LivePagerView initialCafe={cafe} initialOrder={order} />;
}
