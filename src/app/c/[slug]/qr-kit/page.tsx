import React from 'react';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/data-layer';
import { PrintableTableStand } from '@/components/qr-kit/PrintableTableStand';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function QrKitPage({ params }: PageProps) {
  const { slug } = await params;
  const cafe = await dataService.getCafeBySlug(slug);

  if (!cafe) {
    notFound();
  }

  return <PrintableTableStand cafe={cafe} />;
}
