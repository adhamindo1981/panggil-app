"use client";

import React, { useState, useEffect, useMemo, useRef } from 'react';
import QRCode from 'qrcode';
import { Cafe, Order, OrderStatus, OrderItem, MenuCategory, MenuItem } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { dataService } from '@/lib/data-layer';
import { audioEngine } from '@/lib/audio-engine';
import { InvoiceModal } from '../invoice/InvoiceModal';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { CashierPinLock } from './CashierPinLock';
import { MenuManagerModal } from '../menu/MenuManagerModal';
import { getPlanFeatures, TIERS_META, getAppBaseUrl } from '@/lib/feature-gates';
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
  Copy,
  Clock,
  Volume2,
  Utensils,
  UtensilsCrossed,
  Layers,
  Radio,
  Check,
  X,
  Sparkles,
  ArrowUpRight,
  Lock,
  RefreshCw,
  Hash,
  FileText,
  Eye,
  ChefHat,
  Home,
  ArrowLeft,
  Minus,
  Plus,
  ShoppingBag,
  Trash2,
  Tag,
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
  const [isMenuManagerOpen, setIsMenuManagerOpen] = useState<boolean>(false);
  const [selectedOrderForInvoice, setSelectedOrderForInvoice] = useState<Order | null>(null);
  const [selectedOrderForQr, setSelectedOrderForQr] = useState<Order | null>(null);
  const [selectedOrderDetails, setSelectedOrderDetails] = useState<Order | null>(null);
  const [newOrderAlert, setNewOrderAlert] = useState<Order | null>(null);
  const [qrModalSrc, setQrModalSrc] = useState<string>('');
  const [copiedLink, setCopiedLink] = useState<boolean>(false);
  const knownOrderIdsRef = useRef<Set<string>>(new Set(initialOrders.map((o) => o.id)));

  // New Quick Ticket form (Supports manual invoice input from external POS/Accounting or auto-increment)
  const [quickOrderNumber, setQuickOrderNumber] = useState<string>('');
  const [quickCustomerName, setQuickCustomerName] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Auto-generate next sequential ticket number fallback
  const handleAutoGenerateOrderNumber = () => {
    const numbers = orders
      .map((o) => {
        const digits = o.order_number.replace(/\D/g, '');
        return digits ? parseInt(digits, 10) : 0;
      })
      .filter((n) => !isNaN(n) && n > 0);
    const nextNum = numbers.length > 0 ? Math.max(...numbers) + 1 : 101;
    setQuickOrderNumber(String(nextNum));
  };

  // Menu items and POS state
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [ticketTab, setTicketTab] = useState<'quick' | 'menu'>('quick');
  const [selectedCategoryTab, setSelectedCategoryTab] = useState<string>('all');
  const [selectedItemsInTicket, setSelectedItemsInTicket] = useState<{ item: MenuItem; quantity: number }[]>([]);

  const loadMenuData = async () => {
    try {
      const [cats, items] = await Promise.all([
        dataService.getMenuCategories(cafe.id),
        dataService.getMenuItems(cafe.id),
      ]);
      setCategories(cats);
      setMenuItems(items);
    } catch {}
  };

  useEffect(() => {
    loadMenuData();

    if (typeof window !== 'undefined') {
      let channel: BroadcastChannel | null = null;
      if ('BroadcastChannel' in window) {
        try {
          channel = new BroadcastChannel('panggil_channel');
          channel.onmessage = (event) => {
            if (event.data?.type === 'MENU_UPDATED') {
              loadMenuData();
            }
          };
        } catch {}
      }

      const handleStorage = (e: StorageEvent) => {
        if (e.key === 'panggil_menu_items' || e.key === 'panggil_menu_categories') {
          loadMenuData();
        }
      };
      window.addEventListener('storage', handleStorage);

      return () => {
        channel?.close();
        window.removeEventListener('storage', handleStorage);
      };
    }
  }, [cafe.id]);

  const handleAddItemToTicket = (item: MenuItem) => {
    setSelectedItemsInTicket((prev) => {
      const existing = prev.find((x) => x.item.id === item.id);
      if (existing) {
        return prev.map((x) => (x.item.id === item.id ? { ...x, quantity: x.quantity + 1 } : x));
      }
      return [...prev, { item, quantity: 1 }];
    });
  };

  const handleUpdateTicketItemQty = (itemId: string, delta: number) => {
    setSelectedItemsInTicket((prev) =>
      prev
        .map((x) => {
          if (x.item.id === itemId) {
            const newQty = x.quantity + delta;
            return newQty > 0 ? { ...x, quantity: newQty } : null;
          }
          return x;
        })
        .filter(Boolean) as { item: MenuItem; quantity: number }[]
    );
  };

  const ticketSubtotal = selectedItemsInTicket.reduce(
    (acc, curr) => acc + (curr.item.price || 0) * curr.quantity,
    0
  );
  const ticketTaxRate = typeof cafe.tax_rate === 'number' ? cafe.tax_rate : 10;
  const ticketGrandTotal =
    ticketSubtotal > 0 ? Math.round(ticketSubtotal + (ticketSubtotal * ticketTaxRate) / 100) : 0;

  const filteredMenuItems = useMemo(() => {
    if (selectedCategoryTab === 'all') return menuItems;
    return menuItems.filter((i) => i.category_id === selectedCategoryTab);
  }, [menuItems, selectedCategoryTab]);

  // Cashier PIN Lock State
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [upgradeNotice, setUpgradeNotice] = useState<string | null>(null);

  const planFeatures = useMemo(() => getPlanFeatures(cafe.subscription_tier), [cafe.subscription_tier]);
  const currentTierMeta = useMemo(() => TIERS_META[cafe.subscription_tier || 'basic'], [cafe.subscription_tier]);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const unlocked = sessionStorage.getItem(`cashier_unlocked_${cafe.id}`) === 'true';
      setIsUnlocked(unlocked);
      // Fetch latest cafe settings (PIN, Tax, Mode) from server / data layer
      dataService.getCafeBySlug(initialCafe.slug).then((fresh) => {
        if (fresh) setCafe(fresh);
      });
    }
  }, [cafe.id, initialCafe.slug]);

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

  // Refresh orders from data layer & detect incoming table orders
  const refreshOrders = async () => {
    const fresh = await dataService.getOrders(cafe.id);

    // Detect if a brand new pending order arrived from a table
    const brandNew = fresh.find(
      (o) => !knownOrderIdsRef.current.has(o.id) && o.status === 'pending'
    );
    if (brandNew) {
      // Play kitchen alert chime
      audioEngine.playDualChime();
      setNewOrderAlert(brandNew);
      // Auto-hide alert banner after 12 seconds
      setTimeout(() => {
        setNewOrderAlert((curr) => (curr?.id === brandNew.id ? null : curr));
      }, 12000);
    }

    fresh.forEach((o) => knownOrderIdsRef.current.add(o.id));
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
      const baseUrl = getAppBaseUrl();
      const url = `${baseUrl}/c/${cafe.slug}/pager/${selectedOrderForQr.id}?num=${encodeURIComponent(selectedOrderForQr.order_number)}&name=${encodeURIComponent(selectedOrderForQr.customer_name || '')}`;
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
    if (!planFeatures.canUseMenu) {
      const upgradeMsg = {
        ar: 'المنيو الإلكتروني متاح حصراً في الباقتين الفضية والذهبية (Silver & Gold). باقتك الحالية تدعم نظام البيجر فقط.',
        id: 'Menu digital hanya tersedia di Paket Silver & Gold. Paket Anda saat ini fokus pada sistem pager.',
        en: 'Digital Menu is available on Silver & Gold tiers. Your current plan focuses on coaster pager alerts.',
      };
      setUpgradeNotice(upgradeMsg[lang]);
      setTimeout(() => setUpgradeNotice(null), 5000);
      return;
    }
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
      const orderItems: OrderItem[] = selectedItemsInTicket.map(({ item, quantity }) => ({
        id: item.id,
        name_id: item.name_id,
        name_ar: item.name_ar,
        name_en: item.name_en,
        price: item.price,
        quantity,
      }));

      const newOrder = await dataService.createOrder({
        cafe_id: cafe.id,
        order_number: quickOrderNumber.trim(),
        customer_name: quickCustomerName.trim() || undefined,
        items: orderItems,
        total_amount: ticketGrandTotal,
      });

      setQuickOrderNumber('');
      setQuickCustomerName('');
      setSelectedItemsInTicket([]);
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

  // Buzz / Call Pager (Sends realtime siren signal to customer's mobile phone)
  const handleBuzzOrder = async (orderId: string) => {
    // 1. Optimistic UI update: instantly show buzzer state with 0ms latency
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'ready' as OrderStatus,
              ready_at: o.ready_at || new Date().toISOString(),
              buzzed_at: Date.now(),
            }
          : o
      )
    );
    // 2. Transmit buzz signal to customer's phone and persist
    await dataService.buzzOrder(orderId, cafe.id);
    await refreshOrders();
  };

  // Complete Order
  const handleCompleteOrder = async (orderId: string) => {
    // 1. Optimistic UI update: instantly mark completed with green check & 0ms latency
    setOrders((prev) =>
      prev.map((o) =>
        o.id === orderId
          ? {
              ...o,
              status: 'completed' as OrderStatus,
              completed_at: o.completed_at || new Date().toISOString(),
            }
          : o
      )
    );
    // 2. Persist to disk, cloud relay and Supabase
    await dataService.updateOrderStatus(orderId, 'completed', cafe.id);
    await refreshOrders();
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
    const baseUrl = getAppBaseUrl();
    const url = `${baseUrl}/c/${cafe.slug}/pager/${order.id}?num=${encodeURIComponent(order.order_number)}&name=${encodeURIComponent(order.customer_name || '')}`;
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
          {planFeatures.canUseCustomBranding && cafe.custom_branding?.logo_url ? (
            <div className="w-10 h-10 rounded-2xl overflow-hidden border border-amber-500/40 shadow-md shrink-0 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cafe.custom_branding.logo_url} alt={cafe.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <Link
              href="/"
              className="p-2.5 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-zinc-950 rounded-2xl shadow-lg shadow-amber-500/20 font-black hover:scale-105 transition-transform shrink-0"
              title="الرئيسية"
            >
              <BellRing className="w-5 h-5" />
            </Link>
          )}
          <div>
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-extrabold text-base sm:text-lg text-white tracking-tight">
                {cafe.name}
              </h1>

              {/* Subscription Tier Badge */}
              <span className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${currentTierMeta.badgeColor}`}>
                <Sparkles className="w-3 h-3" />
                <span>{currentTierMeta.name[lang]}</span>
              </span>

              <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                {t.common.realtimeActive}
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">{t.cashier.title}</p>
          </div>
        </div>

        {/* Controls: Mode Toggle & Menu & QR Stand & Lock & Language */}
        <div className="flex items-center gap-2 sm:gap-3">
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

          {/* Mode Switcher (With Feature Gating Lock for Basic/Bronze) */}
          <button
            onClick={handleToggleMode}
            className={`hidden md:flex items-center gap-2 px-3 py-1.5 text-xs font-bold rounded-xl transition-all shadow-sm ${
              !planFeatures.canUseMenu
                ? 'bg-zinc-900 text-zinc-400 border border-zinc-800 hover:border-amber-500/50 cursor-pointer'
                : 'bg-zinc-900/90 hover:bg-zinc-800 text-zinc-200 border border-zinc-700/80'
            }`}
            title={!planFeatures.canUseMenu ? 'المنيو الرقمي يتطلب باقة Silver أو Gold' : t.modes.switchMode}
          >
            {!planFeatures.canUseMenu ? (
              <>
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>{t.modes.pagerOnly}</span>
                <span className="text-[9px] px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/30">
                  Silver+
                </span>
              </>
            ) : (
              <>
                <Sliders className="w-3.5 h-3.5 text-amber-400" />
                <span>
                  {cafe.mode === 'pager_only' ? t.modes.pagerOnly : t.modes.menuPager}
                </span>
              </>
            )}
          </button>

          {/* Menu Manager Button */}
          <button
            onClick={() => setIsMenuManagerOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/40 rounded-xl transition-all shadow-sm cursor-pointer"
            title="إدارة قائمة الطعام والمنتجات وإضافة الأصناف"
          >
            <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
            <span>إدارة المنيو</span>
          </button>

          {/* Customer Menu / Lookup Link */}
          <Link
            href={`/c/${cafe.slug}/menu`}
            target="_blank"
            className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
              planFeatures.canUseMenu
                ? 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30'
                : 'bg-zinc-900 hover:bg-zinc-800 text-zinc-400 border border-zinc-800'
            }`}
            title={planFeatures.canUseMenu ? t.menu.title : 'شاشة تتبع البيجر للزبائن'}
          >
            <Utensils className="w-3.5 h-3.5" />
            <span>{planFeatures.canUseMenu ? t.menu.title : 'صفحة الزبائن'}</span>
            <ArrowUpRight className="w-3 h-3" />
          </Link>

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

      {/* Upgrade Notice Alert Banner */}
      {upgradeNotice && (
        <div className="w-full bg-gradient-to-r from-amber-600 via-amber-500 to-yellow-500 text-zinc-950 font-bold px-4 py-2.5 text-xs text-center flex items-center justify-center gap-2 shadow-lg animate-in slide-in-from-top">
          <Lock className="w-4 h-4 shrink-0" />
          <span>{upgradeNotice}</span>
          <button
            onClick={() => setUpgradeNotice(null)}
            className="ms-3 p-1 rounded-lg bg-black/20 hover:bg-black/30 text-zinc-950"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>
      )}

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

        {/* NEW INCOMING ORDER URGENT ALERT BANNER */}
        {newOrderAlert && (
          <div className="mb-6 p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600 text-zinc-950 shadow-2xl shadow-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border border-amber-300 animate-in fade-in slide-in-from-top-4 duration-300">
            <div className="flex items-center gap-3.5">
              <div className="p-3 bg-zinc-950 text-amber-400 rounded-2xl shadow-xl shrink-0">
                <BellRing className="w-6 h-6 animate-bounce" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-zinc-950 text-amber-300">
                    {t.cashier.newOrderIncoming}
                  </span>
                  <span className="font-mono text-base font-black text-zinc-950">
                    {newOrderAlert.order_number}
                  </span>
                </div>
                <p className="text-xs font-black text-zinc-900 mt-1">
                  {newOrderAlert.customer_name} • {newOrderAlert.items.reduce((s, i) => s + i.quantity, 0)} {t.cashier.orderedItems} • {formatCurrency(newOrderAlert.total_amount, cafe.currency_symbol)}
                </p>
                {newOrderAlert.notes && (
                  <p className="text-xs font-bold text-zinc-950 mt-1.5 bg-black/15 px-2.5 py-1 rounded-xl inline-block border border-black/10">
                    📝 {t.cashier.customerNotes}: &ldquo;{newOrderAlert.notes}&rdquo;
                  </p>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
              <button
                onClick={() => {
                  setSelectedOrderDetails(newOrderAlert);
                  setNewOrderAlert(null);
                }}
                className="py-2.5 px-4 bg-zinc-950 hover:bg-zinc-900 text-amber-300 font-black text-xs rounded-xl shadow-lg transition-transform active:scale-95 cursor-pointer flex items-center gap-1.5"
              >
                <Eye className="w-4 h-4 text-amber-400" />
                <span>{t.cashier.viewOrderDetails}</span>
              </button>
              <button
                onClick={() => setNewOrderAlert(null)}
                className="p-2.5 bg-black/15 hover:bg-black/25 text-zinc-950 rounded-xl transition-colors cursor-pointer"
                title={t.common.close}
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

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
                          {isPending && order.items && order.items.length > 0 && (
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">
                              {lang === 'ar' ? 'طلب طاولة' : 'Table Order'}
                            </span>
                          )}
                        </div>
                        {order.customer_name && (
                          <p className="text-xs font-bold text-zinc-200 mt-1">
                            {order.customer_name}
                          </p>
                        )}
                      </div>

                      {/* Small Quick Action Icons */}
                      <div className="flex items-center gap-1 bg-zinc-900/80 p-1 rounded-xl border border-zinc-800">
                        <button
                          onClick={() => setSelectedOrderDetails(order)}
                          className="p-2 text-zinc-400 hover:text-amber-400 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title={t.cashier.viewOrderDetails}
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrderForQr(order)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="عرض رمز QR"
                        >
                          <QrCode className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => setSelectedOrderForInvoice(order)}
                          className="p-2 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
                          title="طباعة الفاتورة"
                        >
                          <Printer className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    {/* CUSTOMER SPECIAL NOTES (HIGHLIGHTED CALLOUT) */}
                    {order.notes && (
                      <div className="my-3 p-3 rounded-2xl bg-gradient-to-r from-amber-500/15 via-yellow-500/10 to-transparent border border-amber-500/40 text-amber-200 text-xs shadow-inner">
                        <div className="flex items-center gap-1.5 font-black text-amber-400 mb-1">
                          <FileText className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>{t.cashier.customerNotes}:</span>
                        </div>
                        <p className="font-bold text-white whitespace-pre-wrap leading-relaxed text-xs">
                          {order.notes}
                        </p>
                      </div>
                    )}

                    {/* Order items preview (if menu order) */}
                    {order.items && order.items.length > 0 && (
                      <div className="my-3 py-2.5 px-3 rounded-2xl bg-zinc-900/60 border border-zinc-800/80 space-y-2 text-xs">
                        <div className="flex items-center justify-between text-[11px] font-black text-zinc-400 pb-1.5 border-b border-zinc-800/60">
                          <span className="flex items-center gap-1.5 text-zinc-300">
                            <Utensils className="w-3.5 h-3.5 text-amber-400" />
                            <span>{t.cashier.orderedItems} ({order.items.reduce((s, i) => s + i.quantity, 0)})</span>
                          </span>
                          <span className="font-mono text-amber-400 font-bold">
                            {formatCurrency(order.total_amount, cafe.currency_symbol)}
                          </span>
                        </div>
                        <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1 scrollbar-thin">
                          {order.items.map((item, idx) => {
                            const localizedName = lang === 'ar' ? (item.name_ar || item.name_id) : (lang === 'id' ? item.name_id : item.name_en);
                            return (
                              <div key={idx} className="flex justify-between items-center text-zinc-200 text-xs font-medium">
                                <span className="flex items-center gap-2 truncate pr-2">
                                  <span className="px-1.5 py-0.5 rounded-md bg-amber-500/20 text-amber-300 font-mono font-bold text-[10px]">
                                    {item.quantity}×
                                  </span>
                                  <span className="truncate">{localizedName}</span>
                                </span>
                                <span className="font-mono text-zinc-400 text-[11px] shrink-0">
                                  {formatCurrency(item.price * item.quantity, cafe.currency_symbol)}
                                </span>
                              </div>
                            );
                          })}
                        </div>
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
      {/* QUICK PAGER TICKET & POS MENU SELECTION MODAL */}
      {/* ======================================================== */}
      {isNewOrderModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div
            className={`w-full ${
              ticketTab === 'menu' ? 'max-w-4xl' : 'max-w-md'
            } max-h-[92vh] flex flex-col bg-[#0d121e] border border-zinc-800 rounded-3xl shadow-2xl relative overflow-hidden transition-all duration-300`}
          >
            {/* Modal Header */}
            <div className="flex items-center justify-between p-5 border-b border-zinc-800 bg-zinc-900/60 shrink-0">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-xl border border-amber-500/20">
                  <PlusCircle className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-extrabold text-white text-base">
                    {ticketTab === 'menu' ? 'نقطة البيع واختيار الأصناف من المنيو' : t.cashier.quickPagerTicket}
                  </h3>
                  <p className="text-[11px] text-zinc-400">
                    {ticketTab === 'menu'
                      ? `متاح ${menuItems.length} صنف عبر ${categories.length} أقسام`
                      : 'إصدار تذكرة استدعاء فورية برقم الطلب'}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Switcher between Quick and Menu */}
                <div className="flex bg-zinc-950 p-1 rounded-xl border border-zinc-800 text-xs font-bold">
                  <button
                    type="button"
                    onClick={() => setTicketTab('quick')}
                    className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                      ticketTab === 'quick'
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    رقم سريع
                  </button>
                  <button
                    type="button"
                    onClick={() => setTicketTab('menu')}
                    className={`px-3 py-1.5 rounded-lg transition-all flex items-center gap-1.5 cursor-pointer ${
                      ticketTab === 'menu'
                        ? 'bg-amber-500 text-zinc-950 shadow-sm'
                        : 'text-zinc-400 hover:text-white'
                    }`}
                  >
                    <Utensils className="w-3.5 h-3.5" />
                    <span>أصناف المنيو</span>
                    {menuItems.length > 0 && (
                      <span
                        className={`text-[10px] px-1.5 py-0.2 rounded-full font-mono ${
                          ticketTab === 'menu'
                            ? 'bg-zinc-950 text-amber-300'
                            : 'bg-zinc-800 text-zinc-300'
                        }`}
                      >
                        {menuItems.length}
                      </span>
                    )}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800/80 rounded-xl cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleCreateQuickTicket} className="flex-1 overflow-y-auto p-5 space-y-4">
              {/* Order Number & Customer Name Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-zinc-900/30 p-4 rounded-2xl border border-zinc-800/80">
                <div>
                  <div className="flex items-center justify-between mb-1.5">
                    <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      {t.cashier.orderNumber} *
                    </label>
                    <button
                      type="button"
                      onClick={handleAutoGenerateOrderNumber}
                      className="inline-flex items-center gap-1 text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-2.5 py-0.5 rounded-lg border border-amber-500/30 transition-all cursor-pointer"
                      title="توليد رقم تلقائي متسلسل"
                    >
                      <Hash className="w-3 h-3" />
                      <span>Auto #</span>
                    </button>
                  </div>
                  <input
                    type="text"
                    required
                    value={quickOrderNumber}
                    onChange={(e) => setQuickOrderNumber(e.target.value)}
                    placeholder="e.g. 104, A-12, INV-88"
                    className="w-full px-4 py-2.5 bg-[#070a13] border border-zinc-800 rounded-xl text-sm font-mono font-bold text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t.cashier.customerName}
                  </label>
                  <input
                    type="text"
                    value={quickCustomerName}
                    onChange={(e) => setQuickCustomerName(e.target.value)}
                    placeholder="اسم العميل أو رقم الطاولة (اختياري)"
                    className="w-full px-4 py-2.5 bg-[#070a13] border border-zinc-800 rounded-xl text-sm text-white focus:outline-none focus:border-amber-500"
                  />
                </div>
              </div>

              {/* MENU MODE: Category Tabs & Product Grid */}
              {ticketTab === 'menu' && (
                <div className="space-y-4">
                  {/* Category Pills & Quick Menu Manager button */}
                  <div className="flex items-center justify-between gap-2 overflow-x-auto pb-1">
                    <div className="flex items-center gap-1.5 flex-nowrap">
                      <button
                        type="button"
                        onClick={() => setSelectedCategoryTab('all')}
                        className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                          selectedCategoryTab === 'all'
                            ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                            : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                        }`}
                      >
                        الكل ({menuItems.length})
                      </button>
                      {categories.map((cat) => {
                        const count = menuItems.filter((i) => i.category_id === cat.id).length;
                        const catName = lang === 'ar' ? cat.name_ar || cat.name_id : cat.name_id;
                        return (
                          <button
                            key={cat.id}
                            type="button"
                            onClick={() => setSelectedCategoryTab(cat.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                              selectedCategoryTab === cat.id
                                ? 'bg-amber-500 text-zinc-950 font-black shadow-md'
                                : 'bg-zinc-900 text-zinc-400 hover:text-white border border-zinc-800'
                            }`}
                          >
                            <span>{catName}</span>
                            <span className="text-[10px] px-1.5 py-0.2 rounded-full font-mono bg-black/20">
                              {count}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsMenuManagerOpen(true)}
                      className="px-2.5 py-1.5 rounded-xl text-[11px] font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 whitespace-nowrap flex items-center gap-1 shrink-0 cursor-pointer"
                    >
                      <UtensilsCrossed className="w-3.5 h-3.5" />
                      <span>إدارة المنيو</span>
                    </button>
                  </div>

                  {/* Menu Items Grid */}
                  {filteredMenuItems.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-zinc-800 rounded-2xl bg-zinc-900/20">
                      <Utensils className="w-8 h-8 text-zinc-600 mx-auto mb-2" />
                      <p className="text-xs text-zinc-400 font-bold">لا توجد أصناف في هذا القسم حالياً</p>
                      <button
                        type="button"
                        onClick={() => setIsMenuManagerOpen(true)}
                        className="mt-3 px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-xl text-xs font-bold cursor-pointer"
                      >
                        + إضافة صنف جديد للمنيو
                      </button>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 max-h-72 overflow-y-auto p-1">
                      {filteredMenuItems.map((item) => {
                        const inTicket = selectedItemsInTicket.find((x) => x.item.id === item.id);
                        const qty = inTicket?.quantity || 0;
                        const localizedName = lang === 'ar' ? item.name_ar || item.name_id : item.name_id;
                        const localizedDesc =
                          lang === 'ar' ? item.description_ar || item.description : item.description;

                        return (
                          <div
                            key={item.id}
                            className={`p-3 rounded-2xl border transition-all flex flex-col justify-between ${
                              qty > 0
                                ? 'bg-amber-500/10 border-amber-500/50 shadow-md shadow-amber-500/5'
                                : 'bg-zinc-900/60 border-zinc-800/80 hover:border-zinc-700'
                            }`}
                          >
                            <div className="flex gap-3">
                              {item.image_url ? (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img
                                  src={item.image_url}
                                  alt={localizedName}
                                  className="w-14 h-14 rounded-xl object-cover shrink-0 border border-zinc-800"
                                />
                              ) : (
                                <div className="w-14 h-14 rounded-xl bg-zinc-800/80 flex items-center justify-center text-zinc-500 shrink-0">
                                  <Utensils className="w-6 h-6" />
                                </div>
                              )}
                              <div className="flex-1 min-w-0">
                                <h4 className="text-xs font-bold text-white truncate">{localizedName}</h4>
                                {localizedDesc && (
                                  <p className="text-[11px] text-zinc-400 line-clamp-2 mt-0.5">{localizedDesc}</p>
                                )}
                                <p className="text-xs font-mono font-black text-amber-400 mt-1">
                                  {formatCurrency(item.price, cafe.currency_symbol)}
                                </p>
                              </div>
                            </div>

                            <div className="mt-3 pt-2 border-t border-zinc-800/60 flex items-center justify-between">
                              {qty > 0 ? (
                                <div className="flex items-center gap-2 bg-zinc-950 px-2 py-1 rounded-xl border border-amber-500/40 w-full justify-between">
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateTicketItemQty(item.id, -1)}
                                    className="p-1 text-amber-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                                  >
                                    <Minus className="w-3.5 h-3.5" />
                                  </button>
                                  <span className="font-mono font-black text-amber-400 text-xs px-2">
                                    {qty}
                                  </span>
                                  <button
                                    type="button"
                                    onClick={() => handleUpdateTicketItemQty(item.id, 1)}
                                    className="p-1 text-amber-400 hover:text-white rounded-lg hover:bg-zinc-800 cursor-pointer"
                                  >
                                    <Plus className="w-3.5 h-3.5" />
                                  </button>
                                </div>
                              ) : (
                                <button
                                  type="button"
                                  onClick={() => handleAddItemToTicket(item)}
                                  className="w-full py-1.5 px-3 bg-zinc-800 hover:bg-amber-500 hover:text-zinc-950 text-zinc-200 text-xs font-bold rounded-xl transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                                >
                                  <Plus className="w-3.5 h-3.5" />
                                  <span>إضافة للتذكرة</span>
                                </button>
                              )}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Selected Items Basket Drawer / Summary */}
                  {selectedItemsInTicket.length > 0 && (
                    <div className="bg-zinc-950 border border-amber-500/30 rounded-2xl p-3.5 space-y-2">
                      <div className="flex items-center justify-between text-xs font-bold pb-2 border-b border-zinc-800 text-zinc-300">
                        <span className="flex items-center gap-1.5 text-amber-400">
                          <ShoppingBag className="w-4 h-4" />
                          <span>
                            الأصناف المختارة ({selectedItemsInTicket.reduce((s, i) => s + i.quantity, 0)})
                          </span>
                        </span>
                        <button
                          type="button"
                          onClick={() => setSelectedItemsInTicket([])}
                          className="text-[11px] text-zinc-500 hover:text-red-400 flex items-center gap-1 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3" />
                          <span>إفراغ</span>
                        </button>
                      </div>

                      <div className="max-h-32 overflow-y-auto divide-y divide-zinc-800/60 text-xs">
                        {selectedItemsInTicket.map(({ item, quantity }) => {
                          const localizedName = lang === 'ar' ? item.name_ar || item.name_id : item.name_id;
                          return (
                            <div key={item.id} className="py-1.5 flex items-center justify-between">
                              <span className="text-zinc-200">
                                {quantity}× {localizedName}
                              </span>
                              <span className="font-mono text-zinc-300">
                                {formatCurrency(item.price * quantity, cafe.currency_symbol)}
                              </span>
                            </div>
                          );
                        })}
                      </div>

                      <div className="flex items-center justify-between pt-2 border-t border-zinc-800 text-xs font-bold">
                        <span className="text-zinc-400">الإجمالي الشامل للضريبة:</span>
                        <span className="font-mono text-base font-black text-amber-400">
                          {formatCurrency(ticketGrandTotal, cafe.currency_symbol)}
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="pt-3 border-t border-zinc-800 flex gap-3">
                <button
                  type="button"
                  onClick={() => setIsNewOrderModalOpen(false)}
                  className="flex-1 py-3 px-4 rounded-xl bg-zinc-800 text-zinc-300 font-bold text-xs hover:bg-zinc-700 transition-colors cursor-pointer"
                >
                  {t.common.cancel}
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting || !quickOrderNumber.trim()}
                  className="flex-1 py-3.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 disabled:opacity-50 text-zinc-950 font-black text-xs shadow-lg shadow-amber-500/20 transition-all active:scale-98 cursor-pointer flex items-center justify-center gap-2"
                >
                  <BellRing className="w-4 h-4" />
                  <span>
                    {isSubmitting
                      ? t.common.loading
                      : ticketTab === 'menu' && selectedItemsInTicket.length > 0
                      ? `إصدار تذكرة (${selectedItemsInTicket.reduce((s, i) => s + i.quantity, 0)} أصناف)`
                      : t.cashier.createTicket}
                  </span>
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
                href={`/c/${cafe.slug}/pager/${selectedOrderForQr.id}?num=${encodeURIComponent(selectedOrderForQr.order_number)}&name=${encodeURIComponent(selectedOrderForQr.customer_name || '')}`}
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

              <button
                onClick={() => {
                  setSelectedOrderForInvoice(selectedOrderForQr);
                }}
                className="w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-xl flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{t.common.print} / حفظ كـ PDF</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ======================================================== */}
      {/* KITCHEN ORDER DETAILS MODAL */}
      {/* ======================================================== */}
      {selectedOrderDetails && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0d121e] border border-zinc-800 rounded-3xl p-6 sm:p-7 shadow-2xl relative">
            <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/10 text-amber-400 rounded-2xl">
                  <ChefHat className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="font-mono text-2xl font-black text-white">
                      {selectedOrderDetails.order_number}
                    </h3>
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                        selectedOrderDetails.status === 'ready'
                          ? 'bg-red-500 text-white animate-pulse'
                          : selectedOrderDetails.status === 'completed'
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                          : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      }`}
                    >
                      {t.statuses[selectedOrderDetails.status]}
                    </span>
                  </div>
                  <p className="text-xs text-zinc-400 font-semibold mt-0.5">
                    {selectedOrderDetails.customer_name} •{' '}
                    {new Date(selectedOrderDetails.created_at).toLocaleTimeString([], {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setSelectedOrderDetails(null)}
                className="p-2 text-zinc-400 hover:text-white rounded-xl hover:bg-zinc-800 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* CUSTOMER SPECIAL NOTES (HIGHLIGHTED BOX) */}
            {selectedOrderDetails.notes && (
              <div className="my-4 p-4 rounded-2xl bg-amber-500/15 border-2 border-amber-500/40 text-amber-200">
                <div className="flex items-center gap-2 font-black text-amber-400 mb-1.5 text-xs">
                  <FileText className="w-4 h-4 text-amber-400" />
                  <span>{t.cashier.customerNotes} (ملاحظات العميل للتحضير):</span>
                </div>
                <p className="font-bold text-white text-sm whitespace-pre-wrap leading-relaxed">
                  {selectedOrderDetails.notes}
                </p>
              </div>
            )}

            {/* ITEMS LIST */}
            <div className="my-4 space-y-2">
              <h4 className="text-xs font-black text-zinc-400 uppercase tracking-wider mb-2">
                {t.cashier.orderedItems} (
                {selectedOrderDetails.items.reduce((s, i) => s + i.quantity, 0)})
              </h4>
              <div className="border border-zinc-800 rounded-2xl overflow-hidden divide-y divide-zinc-800/80 bg-zinc-900/40 max-h-60 overflow-y-auto">
                {selectedOrderDetails.items.length === 0 ? (
                  <p className="p-4 text-xs text-zinc-500 text-center">
                    {lang === 'ar' ? 'تذكرة استدعاء سريعة بدون أصناف منيو' : 'Quick Pager Ticket'}
                  </p>
                ) : (
                  selectedOrderDetails.items.map((item, idx) => {
                    const localizedName =
                      lang === 'ar'
                        ? item.name_ar || item.name_id
                        : lang === 'id'
                        ? item.name_id
                        : item.name_en;
                    return (
                      <div key={idx} className="p-3 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <span className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-300 font-mono font-black text-sm flex items-center justify-center shrink-0">
                            {item.quantity}×
                          </span>
                          <div>
                            <p className="text-sm font-bold text-white">{localizedName}</p>
                            <p className="text-[11px] font-mono text-zinc-400">
                              {formatCurrency(item.price, cafe.currency_symbol)} / للواحد
                            </p>
                          </div>
                        </div>
                        <span className="font-mono text-sm font-bold text-zinc-200">
                          {formatCurrency(item.price * item.quantity, cafe.currency_symbol)}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>

              <div className="flex justify-between items-center pt-3 border-t border-zinc-800 text-sm font-bold">
                <span className="text-zinc-400">{t.common.total}:</span>
                <span className="font-mono text-lg font-black text-amber-400">
                  {formatCurrency(selectedOrderDetails.total_amount, cafe.currency_symbol)}
                </span>
              </div>
            </div>

            {/* MODAL ACTION BUTTONS */}
            <div className="mt-6 pt-4 border-t border-zinc-800 flex gap-3">
              {selectedOrderDetails.status === 'pending' && (
                <button
                  onClick={async () => {
                    await handleBuzzOrder(selectedOrderDetails.id);
                    setSelectedOrderDetails((curr) => (curr ? { ...curr, status: 'ready' } : null));
                  }}
                  className="flex-1 py-3.5 px-4 bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-xs uppercase tracking-wider rounded-2xl shadow-xl shadow-red-600/30 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <BellRing className="w-4 h-4" />
                  <span>{t.cashier.buzzPager}</span>
                </button>
              )}

              {selectedOrderDetails.status === 'ready' && (
                <button
                  onClick={async () => {
                    await handleCompleteOrder(selectedOrderDetails.id);
                    setSelectedOrderDetails(null);
                  }}
                  className="flex-1 py-3.5 px-4 bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-black text-xs rounded-2xl shadow-lg flex items-center justify-center gap-2 cursor-pointer"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{t.cashier.markCompleted}</span>
                </button>
              )}

              <button
                onClick={() => {
                  setSelectedOrderForInvoice(selectedOrderDetails);
                  setSelectedOrderDetails(null);
                }}
                className="py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 font-bold text-xs rounded-2xl flex items-center gap-2 cursor-pointer"
              >
                <Printer className="w-4 h-4 text-amber-400" />
                <span>{t.common.print}</span>
              </button>
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

      {/* Menu Manager Modal (Allows Cashier & Subscriber to Add/Edit/Delete Dishes & Upload Photos) */}
      <MenuManagerModal
        cafe={cafe}
        isOpen={isMenuManagerOpen}
        onClose={() => {
          setIsMenuManagerOpen(false);
          loadMenuData();
        }}
        lang={lang}
        isCashier={true}
      />
    </div>
  );
}
