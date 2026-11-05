import React from 'react';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/data-layer';
import { OrderLookupView } from '@/components/menu/OrderLookupView';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { getCustomBrandingStyle } from '@/lib/feature-gates';
import { BellRing, ArrowLeft, Home } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function StaticPagerPage({ params }: PageProps) {
  const { slug } = await params;
  let cafe = await dataService.getCafeBySlug(slug);

  if (!cafe) {
    const { getOrCreateDynamicCafe } = await import('@/lib/server-cafe-store');
    cafe = getOrCreateDynamicCafe(slug);
  }

  const brandStyle = getCustomBrandingStyle(cafe);
  const orders = await dataService.getOrders(cafe.id);
  const activeOrders = orders.filter((o) => o.status !== 'completed' && o.status !== 'cancelled');

  return (
    <div
      className="min-h-screen bg-[#070a13] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950 font-sans"
      style={brandStyle}
    >
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-[#0d121e]/90 border-b border-zinc-800/80 backdrop-blur-xl px-4 sm:px-6 py-3 flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2 sm:gap-3">
          <Link
            href="/"
            className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-xl transition-colors"
            title="الصفحة الرئيسية"
          >
            <Home className="w-4 h-4" />
          </Link>
          <Link
            href={`/c/${cafe.slug}/cashier`}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
            title="Cashier view"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-500/40 shadow-md shrink-0 bg-zinc-950">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={cafe.custom_branding?.logo_url || '/panggil-logo.jpg'}
                alt={cafe.name}
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <h1 className="text-xs sm:text-sm font-black text-white">{cafe.name}</h1>
              <p className="text-[10px] text-amber-400 font-bold">Panggil / نداء Coaster Pager</p>
            </div>
          </div>
        </div>

        <LanguageSwitcher compact />
      </header>

      {/* Main Order / Invoice Lookup Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <OrderLookupView cafe={cafe} recentOrders={activeOrders} />
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-[10px] text-zinc-500 border-t border-zinc-900 bg-[#070a13]">
        <p className="font-semibold text-zinc-400">Panggil / نداء — Zero-Hardware Coaster Pager Platform</p>
      </footer>
    </div>
  );
}
