"use client";

import React from 'react';
import Link from 'next/link';
import { useI18n } from '@/lib/i18n/context';
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher';
import {
  BellRing,
  Coffee,
  Smartphone,
  Radio,
  Volume2,
  Printer,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  ExternalLink,
  Sliders,
  Utensils,
  Layers,
  Zap,
  Flame,
  ArrowUpRight,
  Check,
  X,
  Star,
  Crown,
  Lock,
} from 'lucide-react';
import { TIERS_META } from '@/lib/feature-gates';

export default function HomePage() {
  const { t, lang, isRtl } = useI18n();
  const [billingCycle, setBillingCycle] = React.useState<'monthly' | 'annual'>('monthly');

  return (
    <div className="min-h-screen bg-[#070a13] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950 font-sans">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 bg-[#0d121e]/85 border-b border-zinc-800/80 backdrop-blur-xl px-6 py-4 flex items-center justify-between max-w-7xl mx-auto w-full shadow-2xl">
        <div className="flex items-center gap-3.5">
          <div className="p-2.5 bg-gradient-to-tr from-amber-600 via-amber-500 to-amber-300 text-zinc-950 rounded-2xl shadow-lg shadow-amber-500/25 font-black">
            <BellRing className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl font-black tracking-tight text-white">
                Panggil / نداء
              </span>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-500/10 text-amber-400 border border-amber-500/30">
                PROD v1.0
              </span>
            </div>
            <p className="text-xs text-zinc-400 font-medium">{t.appTagline}</p>
          </div>
        </div>

        <LanguageSwitcher />
      </header>

      {/* Hero Section */}
      <main className="flex-1 max-w-6xl mx-auto px-6 py-12 w-full space-y-16">
        <div className="text-center max-w-3xl mx-auto space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d121e] border border-zinc-800 text-xs font-bold text-zinc-300 shadow-inner">
            <Zap className="w-3.5 h-3.5 text-amber-400" />
            <span>Zero-Hardware Digital Coaster Pager Platform</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white leading-tight">
            {lang === 'id' && (
              <>
                Tinggalkan Pager Fisik.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">
                  Gunakan Pager Digital
                </span>{' '}
                di Ponsel Pelanggan.
              </>
            )}
            {lang === 'ar' && (
              <>
                ودّع أجهزة البيجر التقليدية.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">
                  بيجر إلكتروني ذكي
                </span>{' '}
                على هاتف العميل مباشرة.
              </>
            )}
            {lang === 'en' && (
              <>
                Ditch Hardware Pagers.{' '}
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 via-amber-500 to-orange-500">
                  Zero-Hardware Digital Pager
                </span>{' '}
                on Every Smartphone.
              </>
            )}
          </h1>

          <p className="text-base sm:text-lg text-zinc-300 leading-relaxed font-normal">
            {lang === 'id' &&
              'Pelanggan cukup memindai kode QR dinamis di kasir untuk melacak kesiapan pesanan mereka secara realtime, menerima getaran dan alarm suara saat pesanan siap, serta mengunduh struk digital.'}
            {lang === 'ar' &&
              'يقوم العميل بمسح رمز QR ذكي لتتبع حالة تحضير طلبه لحظياً، مع اهتزاز الهاتف وصوت تنبيه Coaster Pager احترافي ونطق صوتي آلي بثلاث لغات عند جاهزية الطلب.'}
            {lang === 'en' &&
              'Customers scan a dynamic QR code to track food preparation in real-time, receiving simulated coaster buzzer alarms, phone vibrations, voice callouts, and digital invoices.'}
          </p>
        </div>

        {/* ========================================================= */}
        {/* INTERACTIVE DEMO CAFES (TENANTS) */}
        {/* ========================================================= */}
        <div className="space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <div>
              <h2 className="text-2xl font-black text-white">
                {lang === 'id' ? 'Pilih Demo Kafe / Restoran' : lang === 'ar' ? 'اختر تجربة المقهى التجريبي' : 'Explore Demo Branches'}
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
                {lang === 'id' ? 'Uji coba dua mode operasi: Menu + Pager atau Hanya Panggilan' : lang === 'ar' ? 'جرب نمطي التشغيل: القائمة والنداء أو النداء السريع فقط' : 'Test both operation modes: Menu + Pager or Pager Only'}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Cafe 1: Kopi Nusantara (Menu + Pager Mode) */}
            <div className="bg-gradient-to-b from-[#0d121e] to-[#070a13] border border-zinc-800/90 rounded-3xl p-7 shadow-2xl hover:border-amber-500/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3.5 bg-amber-500/10 border border-amber-500/25 text-amber-400 rounded-2xl">
                    <Coffee className="w-7 h-7" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-amber-500/15 text-amber-400 border border-amber-500/30">
                    Mode 2: {t.modes.menuPager}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mt-5">
                  Kopi Nusantara / قهوة نوسانتارا
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-semibold">
                  Jakarta, Indonesia • Currency: Rp (IDR)
                </p>
                <p className="text-sm text-zinc-300 mt-3.5 leading-relaxed font-normal">
                  قائمة طعام رقمية متكاملة للقهوة والوجبات، سلة تسوق، تتبع فوري، وفاتورة إلكترونية مع توليد بيجر رقمي فوري.
                </p>
              </div>

              {/* Action Links */}
              <div className="mt-8 pt-5 border-t border-zinc-800/80 flex flex-wrap gap-2.5">
                <Link
                  href="/c/kopi-nusantara/cashier"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-amber-500/20"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t.cashier.title}</span>
                </Link>

                <Link
                  href="/c/kopi-nusantara/menu"
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Utensils className="w-4 h-4" />
                  <span>{t.menu.title}</span>
                </Link>

                <Link
                  href="/c/kopi-nusantara/pager/30000000-0000-0000-0000-000000000002"
                  className="w-full py-2.5 px-4 bg-red-600/15 hover:bg-red-600/25 border border-red-500/30 text-red-200 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Smartphone className="w-4 h-4 text-red-400" />
                  <span>اختبار شاشة البيجر الجاهز (#A-102 Buzzing)</span>
                </Link>
              </div>
            </div>

            {/* Cafe 2: Nedaa Express (Pager Only Mode) */}
            <div className="bg-gradient-to-b from-[#0d121e] to-[#070a13] border border-zinc-800/90 rounded-3xl p-7 shadow-2xl hover:border-red-500/60 transition-all flex flex-col justify-between group">
              <div>
                <div className="flex items-start justify-between">
                  <div className="p-3.5 bg-red-500/10 border border-red-500/25 text-red-400 rounded-2xl">
                    <BellRing className="w-7 h-7" />
                  </div>
                  <span className="px-3.5 py-1 rounded-full text-xs font-black bg-zinc-800 text-zinc-300 border border-zinc-700">
                    Mode 1: {t.modes.pagerOnly}
                  </span>
                </div>

                <h3 className="text-2xl font-black text-white mt-5">
                  Nedaa Express / نداء إكسبريس
                </h3>
                <p className="text-xs text-zinc-400 mt-1 font-semibold">
                  الرياض، المملكة العربية السعودية • Currency: SAR (ر.س)
                </p>
                <p className="text-sm text-zinc-300 mt-3.5 leading-relaxed font-normal">
                  مخصص للمطاعم السريعة ونقاط الاستلام: الكاشير يُدخل رقم التذكرة واسم العميل مباشرة ويطبع أو يعرض الـ QR لندائه فورياً.
                </p>
              </div>

              {/* Action Links */}
              <div className="mt-8 pt-5 border-t border-zinc-800/80 flex flex-wrap gap-2.5">
                <Link
                  href="/c/nedaa-express/cashier"
                  className="flex-1 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-2xl flex items-center justify-center gap-2 transition-transform active:scale-95 shadow-xl shadow-amber-500/20"
                >
                  <Sliders className="w-4 h-4" />
                  <span>{t.cashier.title}</span>
                </Link>

                <Link
                  href="/c/nedaa-express/pager/30000000-0000-0000-0000-000000000003"
                  className="flex-1 py-3 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 font-bold text-xs rounded-2xl flex items-center justify-center gap-2 transition-colors"
                >
                  <Smartphone className="w-4 h-4" />
                  <span>تذكرة البيجر (#E-201)</span>
                </Link>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================= */}
        {/* 4-TIER SUBSCRIPTION & PRICING PLANS (IDR Focused) */}
        {/* ========================================================= */}
        <section className="space-y-8 pt-6">
          <div className="text-center max-w-2xl mx-auto space-y-4">
            <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold">
              <Crown className="w-3.5 h-3.5" />
              <span>
                {lang === 'ar' ? 'باقات الاشتراك والترقية' : lang === 'id' ? 'Paket Langganan & Fitur' : 'Subscription Plans & Tiers'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-white">
              {lang === 'ar' ? 'اختر الخطة المناسبة لحجم ونشاط مقهاك أو مكتبك' : lang === 'id' ? 'Pilih Paket Terbaik untuk Kafe & Kantor Layanan' : 'Choose the Perfect Plan for Your Business'}
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 leading-relaxed">
              {lang === 'ar'
                ? 'نظام مرن يلبي احتياجات المقاهي والمطاعم ومكاتب خدمة المراجعين (Queue Management) بدون أي عمولات على المبيعات.'
                : lang === 'id'
                ? 'Solusi fleksibel untuk kafe, resto, hingga loket pelayanan kantor. Tanpa perangkat mahal dan tanpa komisi.'
                : 'Flexible solution for cafes, restaurants, and service office queue counters. Zero commissions and zero hardware.'}
            </p>

            {/* Monthly / Annual Billing Toggle */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <span className={`text-xs font-bold ${billingCycle === 'monthly' ? 'text-amber-400 font-black' : 'text-zinc-400'}`}>
                {lang === 'ar' ? 'شهري' : lang === 'id' ? 'Bulanan' : 'Monthly'}
              </span>
              <button
                type="button"
                onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
                className="w-14 h-7 bg-zinc-800 rounded-full p-1 transition-colors border border-zinc-700 relative focus:outline-none"
              >
                <div
                  className={`w-5 h-5 rounded-full bg-amber-500 shadow-md transform transition-transform ${
                    billingCycle === 'annual' ? 'translate-x-7' : 'translate-x-0'
                  }`}
                />
              </button>
              <div className="flex items-center gap-1.5">
                <span className={`text-xs font-bold ${billingCycle === 'annual' ? 'text-amber-400 font-black' : 'text-zinc-400'}`}>
                  {lang === 'ar' ? 'سنوي' : lang === 'id' ? 'Tahunan' : 'Annual'}
                </span>
                <span className="text-[10px] font-black px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                  {lang === 'ar' ? 'وفر شهرين مجاناً' : lang === 'id' ? 'Hemat 2 Bulan' : '2 Months Free'}
                </span>
              </div>
            </div>
          </div>

          {/* 4 Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {/* 1. BASIC */}
            <div className="bg-gradient-to-b from-[#0d121e] to-[#070a13] border border-zinc-800 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-zinc-700 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                    {TIERS_META.basic.name[lang]}
                  </span>
                  <span className="p-2 rounded-xl bg-zinc-800 text-zinc-300">
                    <BellRing className="w-4 h-4" />
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {billingCycle === 'annual'
                        ? (lang === 'id' ? 'Rp 990.000' : lang === 'ar' ? '250 ر.س' : '$70')
                        : (lang === 'id' ? 'Rp 99.000' : lang === 'ar' ? '25 ر.س' : '$7')}
                    </span>
                    <span className="text-xs text-zinc-400">
                      /{billingCycle === 'annual' ? (lang === 'ar' ? 'سنوياً' : lang === 'id' ? 'thn' : 'yr') : (lang === 'ar' ? 'شهرياً' : lang === 'id' ? 'bln' : 'mo')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {TIERS_META.basic.tagline[lang]}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'صفارة بيجر واهتزاز ونطق صوتي' : lang === 'id' ? 'Alarm pager, getar & suara panggil' : 'Pager siren, vibration & voice call'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'إبقاء شاشة الهاتف يقظة (Wake Lock)' : lang === 'id' ? 'Layar HP selalu aktif (Wake Lock)' : 'Screen Wake Lock & Keep-Alive'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'لوحة كاشير/مكتب خدمة + قفل PIN' : lang === 'id' ? 'Dashboard kasir/loket + PIN lock' : 'Cashier/service desk + PIN lock'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>{lang === 'ar' ? 'تقييم Google Maps التلقائي' : lang === 'id' ? 'Ulasan bintang 5 Google Maps' : 'Google Review conversion'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>{lang === 'ar' ? 'المنيو الإلكتروني التفاعلي' : lang === 'id' ? 'Menu digital interaktif' : 'Interactive Digital Menu'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>{lang === 'ar' ? 'هوية بصرية مخصصة' : lang === 'id' ? 'Custom branding & logo kafe' : 'Custom branding & logo'}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/c/basic-cafe/cashier"
                className="mt-6 w-full py-2.5 px-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 text-xs font-bold rounded-xl text-center transition-colors block"
              >
                {lang === 'ar' ? 'تجربة باقة Basic' : lang === 'id' ? 'Coba Paket Basic' : 'Test Basic Tier'}
              </Link>
            </div>

            {/* 2. BRONZE */}
            <div className="bg-gradient-to-b from-[#15100c] to-[#070a13] border border-amber-900/40 rounded-3xl p-6 shadow-xl flex flex-col justify-between hover:border-amber-700/60 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-amber-400">
                    {TIERS_META.bronze.name[lang]}
                  </span>
                  <span className="p-2 rounded-xl bg-amber-950/60 text-amber-400">
                    <Star className="w-4 h-4" />
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {billingCycle === 'annual'
                        ? (lang === 'id' ? 'Rp 1.490.000' : lang === 'ar' ? '390 ر.س' : '$100')
                        : (lang === 'id' ? 'Rp 149.000' : lang === 'ar' ? '39 ر.س' : '$10')}
                    </span>
                    <span className="text-xs text-zinc-400">
                      /{billingCycle === 'annual' ? (lang === 'ar' ? 'سنوياً' : lang === 'id' ? 'thn' : 'yr') : (lang === 'ar' ? 'شهرياً' : lang === 'id' ? 'bln' : 'mo')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {TIERS_META.bronze.tagline[lang]}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'كافة ميزات باقة Basic' : lang === 'id' ? 'Semua fitur paket Basic' : 'All Basic features included'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-amber-300 font-bold">
                    <Check className="w-4 h-4 text-amber-400 shrink-0" />
                    <span>{lang === 'ar' ? 'تحويل الزبائن لتقييم 5 نجوم Google' : lang === 'id' ? 'Modal ulasan Google Maps 5 bintang' : 'Google Maps 5-Star Reviews'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'مولد بطاقات الطاولات A6' : lang === 'id' ? 'Kit cetak stand akrilik A6' : 'Printable A6 table stand'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>{lang === 'ar' ? 'المنيو الإلكتروني التفاعلي' : lang === 'id' ? 'Menu digital interaktif' : 'Interactive Digital Menu'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>{lang === 'ar' ? 'هوية بصرية مخصصة' : lang === 'id' ? 'Custom branding & logo kafe' : 'Custom branding & logo'}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/c/nedaa-express/cashier"
                className="mt-6 w-full py-2.5 px-4 bg-amber-950/70 hover:bg-amber-900/80 text-amber-300 border border-amber-800/60 text-xs font-bold rounded-xl text-center transition-colors block"
              >
                {lang === 'ar' ? 'تجربة باقة Bronze' : lang === 'id' ? 'Coba Paket Bronze' : 'Test Bronze Tier'}
              </Link>
            </div>

            {/* 3. SILVER (POPULAR) */}
            <div className="relative bg-gradient-to-b from-[#0a1520] to-[#070a13] border-2 border-cyan-500/70 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-cyan-400 transition-all scale-102">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-cyan-500 text-zinc-950 text-[10px] font-black uppercase tracking-wider shadow-lg">
                {lang === 'ar' ? 'الأكثر طلباً' : lang === 'id' ? 'Paling Populer' : 'Most Popular'}
              </div>

              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-cyan-400">
                    {TIERS_META.silver.name[lang]}
                  </span>
                  <span className="p-2 rounded-xl bg-cyan-950/70 text-cyan-400">
                    <Utensils className="w-4 h-4" />
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {billingCycle === 'annual'
                        ? (lang === 'id' ? 'Rp 1.990.000' : lang === 'ar' ? '500 ر.س' : '$140')
                        : (lang === 'id' ? 'Rp 199.000' : lang === 'ar' ? '50 ر.س' : '$14')}
                    </span>
                    <span className="text-xs text-zinc-400">
                      /{billingCycle === 'annual' ? (lang === 'ar' ? 'سنوياً' : lang === 'id' ? 'thn' : 'yr') : (lang === 'ar' ? 'شهرياً' : lang === 'id' ? 'bln' : 'mo')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {TIERS_META.silver.tagline[lang]}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'بيجر رقمي + تقييم Google Maps' : lang === 'id' ? 'Pager + review Google Maps' : 'Pager + Google Review conversion'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{lang === 'ar' ? 'منيو طعام رقمي وسلة طلبات' : lang === 'id' ? 'Menu makanan online & keranjang' : 'Full Digital Menu & Cart'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-cyan-300 font-bold">
                    <Check className="w-4 h-4 text-cyan-400 shrink-0" />
                    <span>{lang === 'ar' ? 'طباعة وحفظ فواتير PDF فورية' : lang === 'id' ? 'Struk thermal & unduh PDF instan' : 'Thermal receipt & instant PDF invoice'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'نطق صوتي آلي بـ 3 لغات' : lang === 'id' ? 'Panggilan suara 3 bahasa' : 'Voice synthesis in 3 languages'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-600 line-through">
                    <X className="w-4 h-4 text-zinc-600 shrink-0" />
                    <span>{lang === 'ar' ? 'هوية بصرية مخصصة' : lang === 'id' ? 'Custom branding & logo kafe' : 'Custom branding & logo'}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/c/silver-cafe/cashier"
                className="mt-6 w-full py-2.5 px-4 bg-gradient-to-r from-cyan-500 to-blue-500 hover:from-cyan-400 hover:to-blue-400 text-zinc-950 text-xs font-black rounded-xl text-center transition-all shadow-lg shadow-cyan-500/25 block"
              >
                {lang === 'ar' ? 'تجربة باقة Silver' : lang === 'id' ? 'Coba Paket Silver' : 'Test Silver Tier'}
              </Link>
            </div>

            {/* 4. GOLD */}
            <div className="bg-gradient-to-b from-[#1b1509] to-[#070a13] border-2 border-yellow-500/60 rounded-3xl p-6 shadow-2xl flex flex-col justify-between hover:border-yellow-400 transition-all">
              <div>
                <div className="flex items-center justify-between mb-4">
                  <span className="text-xs font-black uppercase tracking-wider text-yellow-400">
                    {TIERS_META.gold.name[lang]}
                  </span>
                  <span className="p-2 rounded-xl bg-yellow-950/70 text-yellow-400">
                    <Crown className="w-4 h-4" />
                  </span>
                </div>
                <div className="mb-4">
                  <div className="flex items-baseline gap-1">
                    <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                      {billingCycle === 'annual'
                        ? (lang === 'id' ? 'Rp 2.490.000' : lang === 'ar' ? '650 ر.س' : '$180')
                        : (lang === 'id' ? 'Rp 249.000' : lang === 'ar' ? '65 ر.س' : '$18')}
                    </span>
                    <span className="text-xs text-zinc-400">
                      /{billingCycle === 'annual' ? (lang === 'ar' ? 'سنوياً' : lang === 'id' ? 'thn' : 'yr') : (lang === 'ar' ? 'شهرياً' : lang === 'id' ? 'bln' : 'mo')}
                    </span>
                  </div>
                  <p className="text-[11px] text-zinc-400 mt-2 leading-relaxed">
                    {TIERS_META.gold.tagline[lang]}
                  </p>
                </div>

                <div className="space-y-2.5 pt-4 border-t border-zinc-800/80 text-xs">
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>{lang === 'ar' ? 'كامل ميزات النظام بدون قيود' : lang === 'id' ? 'Semua fitur lengkap tanpa batas' : 'Full complete feature access'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>{lang === 'ar' ? 'هوية خاصة: شعار وألوان مقهاك' : lang === 'id' ? 'Custom logo & warna brand kafe' : 'Custom logo & primary brand colors'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-yellow-300 font-bold">
                    <Check className="w-4 h-4 text-yellow-400 shrink-0" />
                    <span>{lang === 'ar' ? 'إخفاء شعار المنصة (White-label)' : lang === 'id' ? 'Hapus logo platform (White-label)' : 'White-label (Hide Powered by)'}</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-200">
                    <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{lang === 'ar' ? 'دعم فني مخصص وترقية فورية' : lang === 'id' ? 'Dukungan teknis prioritas' : 'Priority VIP customer support'}</span>
                  </div>
                </div>
              </div>

              <Link
                href="/c/kopi-nusantara/cashier"
                className="mt-6 w-full py-2.5 px-4 bg-gradient-to-r from-yellow-500 via-amber-400 to-amber-500 hover:from-yellow-400 hover:to-amber-400 text-zinc-950 text-xs font-black rounded-xl text-center transition-all shadow-lg shadow-yellow-500/25 block"
              >
                {lang === 'ar' ? 'تجربة باقة Gold VIP' : lang === 'id' ? 'Coba Paket Gold VIP' : 'Test Gold Tier'}
              </Link>
            </div>
          </div>
        </section>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 pt-8">
          <div className="p-6 rounded-3xl bg-[#0d121e]/80 border border-zinc-800/80 space-y-2.5 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <Radio className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Supabase Realtime Sync</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              مزامنة لحظية فائقة السرعة في أجزاء من الثانية بين نقرة زر الكاشير وجهاز العميل.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0d121e]/80 border border-zinc-800/80 space-y-2.5 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-red-500/10 text-red-400 flex items-center justify-center">
              <Volume2 className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Web Audio Synth & Vibration</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              توليد ذبذبات وترددات بيجر حقيقية (Beeper Tone) واهتزاز متكرر عبر Web APIs دون ملفات خارجية.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0d121e]/80 border border-zinc-800/80 space-y-2.5 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-blue-500/10 text-blue-400 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Web Speech API Voice Synthesis</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              نطق صوتي آلي مباشر بثلاث لغات (الإندونيسية، العربية، الإنجليزية) ينادي العميل باسمه ورقمه.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0d121e]/80 border border-zinc-800/80 space-y-2.5 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
              <Smartphone className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Screen Wake Lock API</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              إبقاء شاشة هاتف العميل نشطة ومضاءة تلقائياً طوال فترة تحضير الطلب لمنع تفويت النداء.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0d121e]/80 border border-zinc-800/80 space-y-2.5 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-purple-500/10 text-purple-400 flex items-center justify-center">
              <Printer className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Thermal Invoice & QR Engine</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              محرك فواتير رقمية وإيصال حراري (80mm) قابل للطباعة أو التنزيل مع QR فريد لكل تذكرة.
            </p>
          </div>

          <div className="p-6 rounded-3xl bg-[#0d121e]/80 border border-zinc-800/80 space-y-2.5 shadow-xl">
            <div className="w-10 h-10 rounded-2xl bg-amber-500/10 text-amber-400 flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-extrabold text-white text-base">Tri-Lingual & Multi-Tenant</h4>
            <p className="text-xs text-zinc-400 leading-relaxed">
              دعم ثلاثي اللغات مع اتجاه RTL العربي الصريح، وتعدد المقاهي والفروع بمنافذ مستقلة.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-8 px-6 bg-[#070a13] text-center text-xs text-zinc-500">
        <p className="font-bold text-zinc-400">
          Panggil / نداء — Zero-Hardware Restaurant Pager & Digital Menu
        </p>
        <p className="mt-1 text-[11px] text-zinc-600">
          Built with Next.js 15, TypeScript, Tailwind CSS, Supabase Realtime, and Web APIs
        </p>
      </footer>
    </div>
  );
}
