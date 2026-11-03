"use client";

import React, { useState, useEffect } from 'react';
import { Cafe, Order } from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { CoasterPager } from './CoasterPager';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { BellRing, Radio, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

interface LivePagerViewProps {
  initialCafe: Cafe;
  initialOrder: Order;
}

export function LivePagerView({ initialCafe, initialOrder }: LivePagerViewProps) {
  const [cafe] = useState<Cafe>(initialCafe);
  const [order, setOrder] = useState<Order>(initialOrder);

  // Subscribe to realtime order updates
  useEffect(() => {
    const unsubscribe = dataService.subscribeToOrder(order.id, (updatedOrder) => {
      setOrder(updatedOrder);
    });

    return () => unsubscribe();
  }, [order.id]);

  const handleRefresh = async () => {
    const fresh = await dataService.getOrderById(order.id);
    if (fresh) setOrder(fresh);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col justify-between">
      {/* Top Header */}
      <header className="px-4 py-3 bg-zinc-900/80 border-b border-zinc-800/80 backdrop-blur-md flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="p-1.5 bg-amber-500 text-zinc-950 rounded-lg">
            <BellRing className="w-4 h-4" />
          </div>
          <div>
            <h1 className="text-xs font-bold text-zinc-200">{cafe.name}</h1>
            <div className="flex items-center gap-1 text-[10px] text-amber-400">
              <Radio className="w-2.5 h-2.5 animate-pulse" />
              <span>Live Synced</span>
            </div>
          </div>
        </div>

        <LanguageSwitcher compact />
      </header>

      {/* Main Pager Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <CoasterPager order={order} cafe={cafe} onRefresh={handleRefresh} />
      </main>

      {/* Footer Branding */}
      <footer className="py-4 text-center text-[10px] text-zinc-500 border-t border-zinc-900">
        <p>Panggil / نداء - Digital Coaster Pager Platform</p>
      </footer>
    </div>
  );
}
