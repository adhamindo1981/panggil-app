"use client";

import React, { useState, useEffect, useMemo } from 'react';
import QRCode from 'qrcode';
import { Cafe, Order, OrderStatus } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { dataService } from '@/lib/data-layer';
import { audioEngine } from '@/lib/audio-engine';
import { generateWhatsAppReadyUrl } from '@/lib/whatsapp';
import { InvoiceModal } from '../invoice/InvoiceModal';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { CashierPinLock } from './CashierPinLock';
import {
  BellRing,
  PlusCircle,
  Search,
  CheckCircle2,
  Printer,
  QrCode,
  Share2,
  Sliders,
  ExternalLink,
  MessageCircle,
  Copy,
  Clock,
  Volume2,
  Utensils,
  Layers,
  Radio,
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  Lock,
} from 'lucide-react';
import Link from 'next/link';

interface CashierDashboardProps {
  initialCafe: Cafe;
  initialOrders: Order[];
}

export function CashierDashboard({ initialCafe, initialOrders }: CashierDashboardProps) {
  const { t, lang, formatCurrency, isRtl } = useI18n();

  const [cafe, setCafe] = useState<Cafe>(initialCafe);
  const [orders, setOrders] = useState<Order[]>(initialOrders);
  const [filter, setFilter] = useState<'all' | 'pending' | 'ready' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  
  // Modals state
  const [isNewOrderModalOpen, setIsNewOrderModalOpen] = useState<boolean>(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null);
  const [qrModalSrc, setQrModalSrc] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  // New Quick Ticket form
  const [quickOrderNumber, setQuickOrderNumber] = useState<string>('');
  const [quickCustomerName, setQuickCustomerName] = useState<string>('');
  const [quickCustomerPhone, setQuickCustomerPhone] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Cashier PIN Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem(`cashier_unlocked_${cafe.id}`) === 'true';
      setIsUnlocked(unlocked);
    }
  }, [cafe.id]);

  const handleUnlock = () => {
    setIsUnlocked(true);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem(`cashier_unlocked_${cafe.id}`, 'true');
    }
  };

  const handleLock = () => {
    setIsUnlocked(false);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem(`cashier_unlocked_${cafe.id}`);
    }
  };

  // Refresh orders from data layer
  const refreshOrders = async () => {
    const fresh = await dataService.getOrders(cafe.id);
    setOrders(fresh);
  };

  useEffect(() => {
    const unsubscribe = dataService.subscribeToOrders(cafe.id, () => {
      refreshOrders();
    });
    return () => unsubscribe();
  }, [cafe.id]);

  // Generate QR code for modal when order is selected
  useEffect(() => {
    if (selectedOrderForQr) {
      const url = `${window.location.origin}/c/${cafe.slug}/pager/${selectedOrderForQr.id}`;
      QRCode.toDataURL(url, {
        width: 280,
        margin: 1.5,
        color: { dark: '#070a13', light: '#ffffff' },
      }).then(setQrModalSrc).catch(console.error);
    } else {
      setQrModalSrc('');
    }
  }, [selectedOrderForQr, cafe.slug]);

  // Toggle Mode (Pager Only vs Menu + Pager)
  const handleToggleMode = async () => {
    const newMode = cafe.mode === 'pager_only' ? 'menu_pager' : 'pager_only';
    await dataService.updateCafeMode(cafe.id, newMode);
    setCafe((prev) => ({ ...prev, mode: newMode }));
  };

  // Quick ticket creation
  const handleCreateQuickTicket = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickOrderNumber.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const newOrder = await dataService.createOrder({
        cafe_id: cafe.id,
        order_number: quickOrderNumber.trim(),
        customer_name: quickCustomerName.trim() || undefined,
        customer_phone: quickCustomerPhone.trim() || undefined,
        items: [],
        total_amount: 0,
      });

      setQuickOrderNumber('');
      setQuickCustomerName('');
      setQuickCustomerPhone('');
      setIsNewOrderModalOpen(false);
      await refreshOrders();

      // Automatically open QR for customer
      setSelectedOrderForQr(newOrder);
    } catch (err) {
      console.error('Failed to create quick ticket:', err);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Buzz / Call Pager
  const handleBuzzOrder = async (orderId: string) => {
    audioEngine.playDualChime();
    await dataService.buzzOrder(orderId);
    refreshOrders();
  };

  // Complete Order
  const handleCompleteOrder = async (orderId: string) => {
    await dataService.updateOrderStatus(orderId, 'completed');
    refreshOrders();
  };

  // Filtered orders list
  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const matchesFilter = filter === 'all' ? true : order.status === filter;
      const matchesSearch =
        order.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (order.customer_name && order.customer_name.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchesFilter && matchesSearch;
    });
  }, [orders, filter, searchQuery]);

  // Analytics counts
  const pendingCount = orders.filter((o) => o.status === 'pending').length;
  const readyCount = orders.filter((o) => o.status === 'ready').length;
  const completedCount = orders.filter((o) => o.status === 'completed').length;
  const totalRevenue = orders
    .filter((o) => o.status === 'completed')
    .reduce((acc, curr) => acc + (curr.total_amount || 0), 0);

  const copyCustomerLink = (order: Order) => {
    const url = `${window.location.origin}/c/${cafe.slug}/pager/${order.id}`;
    navigator.clipboard.writeText(url);
    setCopiedLink(true);
    setTimeout(() => setCopiedLink(false), 2000);
  };

  if (!isUnlocked) {
    return <CashierPinLock cafe={cafe} onUnlock={handleUnlock} />;
  }

  return (
    <div className="min-h-screen bg-[#070a13] text-zinc-100 flex flex-col selection:bg-amber-500 selection:text-zinc-950 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d121e]/90 border-b border-zinc-800/80 backdrop-blur-xl px-4 sm:px-8 py-3.5 flex items-center justify-between shadow-2xl">
        <div className="flex items-center gap-3.5">
          <Link
            href="/"
            className="p-2.5 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-zinc-950 rounded-2xl shadow-lg shadow-amber-500/20 font-black hover:scale-105 transition-transform"
            title="الرئيسية"
          >
            <BellRing className="w-5 h-5" />
          </Link>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                {cafe.name}
              </h1>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                {t.common.realtimeActive}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">{t.cashier.title}</p>
          </div>
        </div>

        {/* Controls: Mode Toggle & Menu & QR Stand & Lock & Language */}
        <div className="flex items-center gap-2.5 sm:gap-3">
          {/* Printable QR Table Kit Link */}
          <Link
            href={`/c/${cafe.slug}/qr-kit`}
            target="_blank"
            className="hidden lg:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-zinc-900 hover:bg-zinc-800 text-zinc-300 border border-zinc-700/80 rounded-xl transition-all shadow-sm"
            title="طباعة ستاندات الطاولات A6"
          >
            <Printer className="w-3.5 h-3.5 text-amber-400" />
            <span>ستاند الطاولات A6</span>
          </Link>

          {/* Mode Switcher */}
          <button
            onClick={handleToggleMode}
            className="hidden md:flex items-center gap-2 px-3.5 py-2 text-xs font-bold bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80 rounded-xl transition-all shadow-sm"
            title={t.modes.switchMode}
          >
            <Sliders className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {cafe.mode === 'pager_only' ? t.modes.pagerOnly : t.modes.menuPager}
            </span>
          </button>

          {/* Customer Menu Link if menu_pager mode */}
          {cafe.mode === 'menu_pager' && (
            <Link
              href={`/c/${cafe.slug}/menu`}
              target="_blank"
              className="hidden sm:flex items-center gap-1.5 px-3.5 py-2 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl transition-all"
            >
              <Utensils className="w-3.5 h-3.5" />
              <span>{t.menu.title}</span>
              <ArrowUpRight className="w-3 h-3" />
            </Link>
          )}

          {/* Lock Screen Button */}
          <button
            onClick={handleLock}
            className="p-2 text-zinc-400 hover:text-white bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 rounded-xl transition-colors"
            title="قفل لوحة الكاشير"
          >
            <Lock className="w-4 h-4 text-amber-400" />
          </button>

          <LanguageSwitcher compact />
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-8 max-w-7xl w-full mx-auto space-y-7">
        {/* Metric Cards Banner (Interactive Filter Tabs) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
          {/* Card: Pending */}
          <button
            onClick={() => setFilter('pending')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
              filter === 'pending'
                ? 'bg-amber-950/40 border-amber-500/80 shadow-lg shadow-amber-500/10'
                : 'bg-[#0d121e]/80 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                {t.cashier.activeOrders}
              </span>
              <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                <Clock className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-amber-400 font-mono mt-3">{pendingCount}</p>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-amber-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Card: Ready / Buzzing */}
          <button
            onClick={() => setFilter('ready')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
              filter === 'ready'
                ? 'bg-red-950/50 border-red-500/80 shadow-lg shadow-red-500/20'
                : 'bg-[#0d121e]/80 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                {t.cashier.readyOrders}
              </span>
              <div className="p-2 bg-red-500/10 text-red-400 rounded-xl">
                <BellRing className="w-4 h-4 animate-bounce" />
              </div>
            </div>
            <p className="text-3xl font-black text-red-400 font-mono mt-3">{readyCount}</p>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-red-500/60 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Card: Completed */}
          <button
            onClick={() => setFilter('completed')}
            className={`p-5 rounded-2xl border text-left transition-all duration-200 relative overflow-hidden group ${
              filter === 'completed'
                ? 'bg-emerald-950/40 border-emerald-500/80 shadow-lg shadow-emerald-500/10'
                : 'bg-[#0d121e]/80 border-zinc-800/80 hover:border-zinc-700'
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                {t.cashier.completedOrders}
              </span>
              <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-xl">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>
            <p className="text-3xl font-black text-emerald-400 font-mono mt-3">{completedCount}</p>
            <div className="absolute bottom-0 inset-x-0 h-1 bg-emerald-500/40 opacity-0 group-hover:opacity-100 transition-opacity" />
          </button>

          {/* Card: Total Revenue */}
          <div className="p-5 rounded-2xl bg-[#0d121e]/80 border border-zinc-800/80 flex flex-col justify-between">
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400 font-bold uppercase tracking-wider">
                {t.cashier.totalRevenue}
              </span>
              <div className="p-2 bg-zinc-800 text-zinc-300 rounded-xl">
                <Layers className="w-4 h-4" />
              </div>
            </div>
            <p className="text-2xl sm:text-3xl font-black text-zinc-100 font-mono mt-3 truncate">
              {formatCurrency(totalRevenue, cafe.currency_symbol)}
            </p>
          </div>
        </div>

        {/* Action Toolbar: Search + Status Filter Pills + Create Ticket */}
        <div className="flex flex-col sm:flex-row gap-3.5 items-stretch sm:items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className={`w-4 h-4 text-zinc-400 absolute top-1/2 -translate-y-1/2 ${isRtl ? 'right-3.5' : 'left-3.5'}`} />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={t.cashier.searchOrders}
              className={`w-full py-3 bg-[#0d121e] border border-zinc-800 rounded-2xl text-xs text-zinc-100 placeholder-zinc-500 focus:outline-none focus:border-amber-500/80 transition-colors shadow-inner ${
                isRtl ? 'pr-10 pl-4' : 'pl-10 pr-4'
              }`}
            />
          </div>

          <div className="flex items-center gap-2 overflow-x-auto pb-1 sm:pb-0">
            <div className="flex p-1.5 bg-[#0d121e] border border-zinc-800 rounded-2xl shadow-inner">
              <button
                onClick={() => setFilter('all')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filter === 'all'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.cashier.filterAll}
              </button>
              <button
                onClick={() => setFilter('pending')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filter === 'pending'
                    ? 'bg-amber-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.cashier.filterPending}
              </button>
              <button
                onClick={() => setFilter('ready')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filter === 'ready'
                    ? 'bg-red-500 text-white shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.cashier.filterReady}
              </button>
              <button
                onClick={() => setFilter('completed')}
                className={`px-3.5 py-1.5 text-xs font-bold rounded-xl transition-all ${
                  filter === 'completed'
                    ? 'bg-emerald-500 text-zinc-950 shadow-md'
                    : 'text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {t.cashier.filterCompleted}
              </button>
            </div>

            {/* Quick Ticket Creation Button */}
            <button
              onClick={() => {
                setQuickOrderNumber(`#A-${Math.floor(100 + Math.random() * 900)}`);
                setIsNewOrderModalOpen(true);
              }}
              className="py-3 px-5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-2xl shadow-xl shadow-amber-500/20 transition-transform active:scale-95 flex items-center gap-2 whitespace-nowrap"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{t.cashier.quickPagerTicket}</span>
            </button>
          </div>
        </div>

        {/* Orders Cards Grid */}
        {filteredOrders.length === 0 ? (
          <div className="py-24 text-center bg-[#0d121e]/60 border border-zinc-800/80 rounded-3xl p-8 shadow-xl">
            <BellRing className="w-14 h-14 text-zinc-600 mx-auto mb-4 opacity-50" />
            <p className="text-zinc-400 text-sm font-semibold">{t.cashier.noOrders}</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredOrders.map((order) => {
              const isPending = order.status === 'pending';
              const isReady = order.status === 'ready';
              const isCompleted = order.status === 'completed';

              return (
                <div
                  key={order.id}
                  className={`p-6 rounded-3xl border transition-all duration-300 flex flex-col justify-between ${
                    isReady
                      ? 'bg-gradient-to-b from-[#181119] to-[#0d121e] border-red-500/80 shadow-2xl shadow-red-500/20 ring-1 ring-red-500/40'
                      : isCompleted
                      ? 'bg-[#0d121e]/50 border-zinc-800/60 opacity-60'
                      : 'bg-[#0d121e]/90 border-zinc-800/90 shadow-xl hover:border-zinc-700 hover:shadow-2xl'
                  }`}
                >
                  {/* Top Card Info */}
                  <div>
                    <div className="flex items-start justify-between pb-3 border-b border-zinc-800/80">
                      <div>
                        <div className="flex items-center gap-2.5">
                          <span className="font-mono text-3xl font-black tracking-wider text-white">
                            {order.order_number}
                          </span>
                          {isReady && (
                            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-red-500 text-white animate-pulse">
                              BUZZING
                            </span>
                          )}
                        </div>
                        {order.customer_name && (
                          <p className="text-xs font-bold text-zinc-200 mt-1">
                            {order.customer_name}
                          </p>
                        )}
                        {order.customer_phone && (
                          <p className="text-[11px] text-zinc-400 font-mono mt-0.5">
                            {order.customer_phone}
                          </p>
                        )}
                      </div>

                      {/* Small Quick Action Icons */}
                      <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                        <button
                          onClick={() => setSelectedOrderForQr(order)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="عرض رمز QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors"
                          title="طباعة الفاتورة"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* Order items preview (if menu order) */}
                    {order.items && order.items.length > 0 && (
                      <div className="my-4 py-2 border-b border-zinc-800/80 space-y-1.5 text-xs">
                        {order.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-zinc-300 text-xs font-medium">
                            <span className="truncate pr-2">
                              {item.quantity}× {item.name_id || item.name_en}
                            </span>
                            <span className="font-mono text-zinc-400 shrink-0">
                              {formatCurrency(item.price * item.quantity, cafe.currency_symbol)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Card Bottom Actions */}
                  <div className="mt-5 pt-3 border-t border-zinc-800/80 flex flex-col gap-2.5">
                    {/* Primary Buzz Action */}
                    {isPending && (
                      <button
                        onClick={() => handleBuzzOrder(order.id)}
                        className="w-full py-3.5 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 transition-all flex items-center justify-center gap-2 active:scale-98 animate-pulse"
                      >
                        <BellRing className="w-4 h-4" />
                        <span>{t.cashier.buzzPager}</span>
                      </button>
                    )}

                    {isReady && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => handleBuzzOrder(order.id)}
                          className="flex-1 py-3 px-3 bg-red-500/20 hover:bg-red-500/30 border border-red-500/40 text-red-200 font-bold text-xs rounded-xl transition-all flex items-center justify-center gap-1.5"
                        >
                          <Volume2 className="w-4 h-4" />
                          <span>{t.cashier.recallPager}</span>
                        </button>
                        <button
                          onClick={() => handleCompleteOrder(order.id)}
                          className="flex-1 py-3 px-3 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-xl shadow-lg transition-all flex items-center justify-center gap-1.5"
                        >
                          <CheckCircle2 className="w-4 h-4" />
                          <span>{t.cashier.markCompleted}</span>
                        </button>
                      </div>
                    )}

                    {isCompleted && (
                      <div className="flex items-center justify-between text-xs text-emerald-400 font-bold py-1">
                        <span className="flex items-center gap-1.5">
                          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                          {t.statuses.completed}
                        </span>
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="text-zinc-400 hover:text-white underline text-xs"
                        >
                          {t.customer.viewReceipt}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>

      {/* ======================================================== */}
      {/* QUICK PAGER TICKET MODAL */}
      {/* ======================================================== */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-md bg-[#0d121e] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <h3 className="font-extrabold text-white text-base">
                  {t.cashier.quickPagerTicket}
                </h3>
              </div>
              <button
                onClick={() => setIsNewOrderModalOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/80 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateQuickTicket} className="mt-5 space-y-4">
              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  {t.cashier.orderNumber} *
                </label>
                <input
                  type="text"
                  required
                  value={quickOrderNumber}
                  onChange={(e) => setQuickOrderNumber(e.target.value)}
                  placeholder={t.cashier.enterOrderNumber}
                  className="w-full px-4 py-3 bg-[#070a13] border border-zinc-800 rounded-2xl text-base font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  {t.cashier.customerName}
                </label>
                <input
                  type="text"
                  value={quickCustomerName}
                  onChange={(e) => setQuickCustomerName(e.target.value)}
                  placeholder={t.cashier.enterCustomerName}
                  className="w-full px-4 py-3 bg-[#070a13] border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-2">
                  {t.cashier.customerPhone} (WhatsApp)
                </label>
                <input
                  type="tel"
                  value={quickCustomerPhone}
                  onChange={(e) => setQuickCustomerPhone(e.target.value)}
                  placeholder={t.cashier.enterCustomerPhone}
                  className="w-full px-4 py-3 bg-[#070a13] border border-zinc-800 rounded-2xl text-sm text-white focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="pt-3 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition-colors"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !quickOrderNumber.trim()}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-98"
                >
                  {isSubmitting ? t.common.loading : t.cashier.createTicket}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* QR CODE & CUSTOMER PAGER SHARE MODAL */}
      {/* ======================================================== */}
      {selectedOrderForQr && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-sm bg-[#0d121e] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl text-center relative">
            <button
              onClick={() => setSelectedOrderForQr(null)}
              className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-xl"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="my-2">
              <span className="text-xs uppercase font-extrabold tracking-wider text-amber-500">
                {t.cashier.qrModalTitle}
              </span>
              <h3 className="font-mono text-4xl font-black text-white mt-1">
                {selectedOrderForQr.order_number}
              </h3>
              {selectedOrderForQr.customer_name && (
                <p className="text-sm font-semibold text-zinc-300 mt-1">{selectedOrderForQr.customer_name}</p>
              )}
            </div>

            {/* Rendered Dynamic QR Code */}
            <div className="p-4 bg-white rounded-3xl inline-block my-4 shadow-2xl">
              {qrModalSrc && (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={qrModalSrc} alt="Customer Pager QR" className="w-52 h-52 mx-auto" />
              )}
            </div>

            <p className="text-xs text-zinc-400 leading-relaxed mb-5">
              {t.cashier.qrModalSubtitle}
            </p>

            {/* Quick Action Links */}
            <div className="flex flex-col gap-2.5">
              <Link
                href={`/c/${cafe.slug}/pager/${selectedOrderForQr.id}`}
                target="_blank"
                className="w-full py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-xl flex items-center justify-center gap-2 transition-transform active:scale-98 shadow-lg shadow-amber-500/20"
              >
                <ExternalLink className="w-4 h-4" />
                <span>{t.cashier.openCustomerView}</span>
              </Link>

              <button
                onClick={() => copyCustomerLink(selectedOrderForQr)}
                className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
              >
                {copiedLink ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                <span>{copiedLink ? t.cashier.linkCopied : t.cashier.copyLink}</span>
              </button>

              {selectedOrderForQr.customer_phone && (
                <button
                  onClick={() => {
                    const url = generateWhatsAppReadyUrl(
                      selectedOrderForQr.customer_phone!,
                      selectedOrderForQr.order_number,
                      selectedOrderForQr.customer_name,
                      cafe.name,
                      `${window.location.origin}/c/${cafe.slug}/pager/${selectedOrderForQr.id}`,
                      lang
                    );
                    window.open(url, '_blank');
                  }}
                  className="w-full py-2.5 px-4 bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors"
                >
                  <MessageCircle className="w-4 h-4" />
                  <span>{t.cashier.sendWhatsapp}</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={Boolean(selectedOrderForInvoice)}
        onClose={() => setSelectedOrderForInvoice(null)}
        order={selectedOrderForInvoice}
        cafe={cafe}
      />
    </div>
  );
}
