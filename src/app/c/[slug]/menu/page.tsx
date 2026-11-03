import React from 'react';
import { notFound } from 'next/navigation';
import { dataService } from '@/lib/data-layer';
import { DigitalMenu } from '@/components/menu/DigitalMenu';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import { Coffee, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export default async function MenuPage({ params }: PageProps) {
  const { slug } = await params;
  const cafe = await dataService.getCafeBySlug(slug);

  if (!cafe) {
    notFound();
  }

  const categories = await dataService.getMenuCategories(cafe.id);
  const items = await dataService.getMenuItems(cafe.id);

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100">
      {/* Top Header */}
      <header className="sticky top-0 z-40 bg-zinc-900/90 border-b border-zinc-800 backdrop-blur-md px-4 sm:px-6 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link
            href={`/c/${cafe.slug}/cashier`}
            className="p-2 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-xl transition-colors"
            title="Cashier view"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <h1 className="font-extrabold text-sm sm:text-base text-zinc-100">
              {cafe.name}
            </h1>
            <p className="text-[11px] text-zinc-400">Digital Menu & Ordering</p>
          </div>
        </div>

        <LanguageSwitcher compact />
      </header>

      {/* Hero Banner */}
      <div className="relative h-44 sm:h-52 w-full bg-zinc-900 overflow-hidden border-b border-zinc-800">
        {cafe.logo_url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={cafe.logo_url}
            alt={cafe.name}
            className="w-full h-full object-cover opacity-30 filter blur-xs"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent flex flex-col justify-end p-6 max-w-4xl mx-auto">
          <span className="text-xs font-bold text-amber-500 uppercase tracking-widest">
            Welcome to
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-white">{cafe.name}</h2>
          {cafe.address && (
            <p className="text-xs text-zinc-300 mt-1">{cafe.address}</p>
          )}
        </div>
      </div>

      {/* Menu Container */}
      <main className="p-4 sm:p-6">
        <DigitalMenu cafe={cafe} categories={categories} items={items} />
      </main>
    </div>
  );
}
