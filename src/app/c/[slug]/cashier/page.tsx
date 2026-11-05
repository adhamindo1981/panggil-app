import React from 'react';
import { notFound } from 'next/navigation';
import { dataService, INITIAL_CAFES } from '@/lib/data-layer';
import { CashierDashboard } from '@/components/cashier/CashierDashboard';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function CashierPage({ params }: PageProps) {
  const { slug } = await params;
  let cafe = await dataService.getCafeBySlug(slug);

  if (!cafe) {
    const { getOrCreateDynamicCafe } = await import('@/lib/server-cafe-store');
    cafe = getOrCreateDynamicCafe(slug);
  }

  const initialOrders = await dataService.getOrders(cafe.id);

  return <CashierDashboard initialCafe={cafe} initialOrders={initialOrders} />;
}
