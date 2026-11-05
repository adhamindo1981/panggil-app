"use client";

import React, { useState } from 'react';
import { Cafe, Order } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { BellRing, Search, ArrowRight, Smartphone, ShieldCheck, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { dataService } from '@/lib/data-layer';

interface OrderLookupViewProps {
  cafe: Cafe;
  recentOrders?: Order[];
}

export function OrderLookupView({ cafe, recentOrders = [] }: OrderLookupViewProps) {
  const { lang, isRtl } = useI18n();
  const router = useRouter();
  const [orderQuery, setOrderQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const text = {
    title: {
      ar: 'متابعة نداء الطلب',
      id: 'Lacak Pager Pesanan',
      en: 'Track Order Pager',
    },
    subtitle: {
      ar: 'أدخل رقم طلبك المعطى من الكاشير لمتابعة جاهزية طلبك وتلقي التنبيه الصوتي',
      id: 'Masukkan nomor pesanan dari kasir untuk memantau status pesanan & alarm',
      en: 'Enter your order number from cashier to track order status & buzzer alarm',
    },
    placeholder: {
      ar: 'مثال: #A-101 أو 101',
      id: 'Contoh: #A-101 atau 101',
      en: 'Example: #A-101 or 101',
    },
    searchBtn: {
      ar: 'فتح جهاز البيجر',
      id: 'Buka Pager Digital',
      en: 'Open Digital Pager',
    },
    notFound: {
      ar: 'لم يتم العثور على طلب بهذا الرقم، يرجى التأكد من الرقم والمحاولة مجدداً',
      id: 'Nomor pesanan tidak ditemukan, silakan periksa kembali',
      en: 'Order number not found, please double check and try again',
    },
    recentTitle: {
      ar: 'أو اختر من الطلبات النشطة حالياً:',
      id: 'Atau pilih pesanan aktif saat ini:',
      en: 'Or select from currently active orders:',
    },
    serviceNotice: {
      ar: 'يعتمد هذا الفرع نظام النداء والبيجر الرقمي المباشر بدون منيو إلكتروني',
      id: 'Outlet ini menggunakan sistem pager digital langsung tanpa menu online',
      en: 'This outlet operates on instant coaster pager system without online ordering',
    },
  };

  const handleLookup = async (e: React.FormEvent) => {
    e.preventDefault();
    const query = orderQuery.trim().toUpperCase();
    if (!query) return;

    setIsSearching(true);
    setErrorMessage('');

    try {
      const orders = await dataService.getOrders(cafe.id);
      const matched = orders.find(
        (o) =>
          o.order_number.toUpperCase() === query ||
          o.order_number.toUpperCase() === `#${query}` ||
          o.order_number.toUpperCase().includes(query)
      );

      if (matched) {
        router.push(`/c/${cafe.slug}/pager/${matched.id}`);
      } else {
        setErrorMessage(text.notFound[lang]);
      }
    } catch (err) {
      setErrorMessage(text.notFound[lang]);
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="w-full max-w-lg mx-auto p-4 sm:p-6 my-auto flex flex-col items-center">
      {/* Decorative Glow Icon */}
      <div className="relative mb-6">
        <div className="absolute -inset-4 bg-amber-500/20 rounded-full blur-xl" />
        <div className="relative w-20 h-20 rounded-3xl bg-gradient-to-tr from-amber-600 via-amber-500 to-yellow-400 p-0.5 shadow-2xl flex items-center justify-center">
          <div className="w-full h-full bg-[#0a0f1d] rounded-[22px] flex items-center justify-center">
            <BellRing className="w-9 h-9 text-amber-400 animate-bounce" />
          </div>
        </div>
      </div>

      {/* Cafe Badge */}
      <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-800/80 border border-zinc-700/60 text-zinc-300 text-xs font-semibold mb-3">
        <Sparkles className="w-3.5 h-3.5 text-amber-400" />
        <span>{cafe.name}</span>
      </div>

      <h2 className="text-xl sm:text-2xl font-black text-white text-center mb-2">
        {text.title[lang]}
      </h2>
      <p className="text-xs sm:text-sm text-zinc-400 text-center max-w-sm mb-6 leading-relaxed">
        {text.subtitle[lang]}
      </p>

      {/* Order Lookup Form */}
      <form onSubmit={handleLookup} className="w-full space-y-3">
        <div className="relative">
          <div className="absolute inset-y-0 start-0 flex items-center ps-4 pointer-events-none text-zinc-500">
            <Search className="w-5 h-5 text-amber-500" />
          </div>
          <input
            type="text"
            value={orderQuery}
            onChange={(e) => setOrderQuery(e.target.value)}
            placeholder={text.placeholder[lang]}
            required
            className="w-full py-4 ps-12 pe-4 bg-[#0d121e] border-2 border-zinc-700/80 focus:border-amber-500 focus:ring-4 focus:ring-amber-500/20 rounded-2xl text-white font-mono text-lg font-bold placeholder:text-zinc-600 outline-none transition-all"
          />
        </div>

        {errorMessage && (
          <p className="text-xs text-rose-400 bg-rose-950/40 border border-rose-800/60 rounded-xl p-3 text-center font-medium">
            {errorMessage}
          </p>
        )}

        <button
          type="submit"
          disabled={isSearching}
          className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500 hover:from-amber-400 hover:to-yellow-400 text-zinc-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
        >
          <span>{isSearching ? '...' : text.searchBtn[lang]}</span>
          <ArrowRight className={`w-5 h-5 ${isRtl ? 'rotate-180' : ''}`} />
        </button>
      </form>

      {/* Active Orders Quick Access */}
      {recentOrders.length > 0 && (
        <div className="w-full mt-8 pt-6 border-t border-zinc-800/80">
          <p className="text-xs font-bold text-zinc-400 mb-3 text-center">
            {text.recentTitle[lang]}
          </p>
          <div className="grid grid-cols-2 gap-2.5">
            {recentOrders.slice(0, 4).map((ord) => (
              <button
                key={ord.id}
                onClick={() => router.push(`/c/${cafe.slug}/pager/${ord.id}`)}
                className="p-3 bg-[#0d121e] hover:bg-zinc-800/70 border border-zinc-800 rounded-xl text-left rtl:text-right transition-all flex items-center justify-between group active:scale-95"
              >
                <div>
                  <span className="font-mono font-black text-sm text-amber-400 block">
                    {ord.order_number}
                  </span>
                  <span className="text-[10px] text-zinc-400 truncate block max-w-[110px]">
                    {ord.customer_name || 'Customer'}
                  </span>
                </div>
                <span
                  className={`w-2 h-2 rounded-full ${
                    ord.status === 'ready'
                      ? 'bg-rose-500 animate-ping'
                      : 'bg-amber-400 animate-pulse'
                  }`}
                />
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Service Notice */}
      <div className="mt-8 flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800 text-[11px] text-zinc-400 text-center">
        <Smartphone className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{text.serviceNotice[lang]}</span>
      </div>
    </div>
  );
}
