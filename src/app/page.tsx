'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  Zap,
  ArrowRight,
  Smartphone,
  Volume2,
  CheckCircle2,
  MessageCircle,
} from 'lucide-react';
import { LandingNavbar } from '@/components/landing/LandingNavbar';
import { InteractiveHeroPager } from '@/components/landing/InteractiveHeroPager';
import { AsymmetricBentoGrid } from '@/components/landing/AsymmetricBentoGrid';
import { InteractiveRoiCalculator } from '@/components/landing/InteractiveRoiCalculator';
import { ComparisonTable } from '@/components/landing/ComparisonTable';
import { PricingSection } from '@/components/landing/PricingSection';
import { FaqAccordion } from '@/components/landing/FaqAccordion';

type Lang = 'id' | 'ar' | 'en';
type Currency = 'IDR' | 'SAR' | 'USD';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('id');
  const [currency, setCurrency] = useState<Currency>('IDR');

  const isRtl = lang === 'ar';

  const heroStrings = {
    id: {
      badge: 'SISTEM PAGER DIGITAL & MENU CERDAS BERBASIS WEB',
      heroTitlePrefix: 'Ubah Ponsel Pelanggan Menjadi Pager.',
      heroTitleHighlight: 'Tanpa Perangkat Fisik.',
      heroSubtitle:
        'Solusi nirkabel berkinerja tinggi untuk kafe, restoran, food court, dan pusat layanan. Pelanggan cukup scan QR pada struk atau meja, menunggu tanpa cemas, dan ponsel mereka berdering kencang saat pesanan siap. Dilengkapi menu digital interaktif dan pendorong ulasan bintang 5 Google Maps.',
      ctaDemo: 'Buka Demo Kasir (POS)',
      ctaCustomer: 'Layar Tamu / Pelanggan',
      ctaTestBuzzer: 'Uji Suara Pager',
      metricsAppFree: '0 Aplikasi Diunduh',
      metricsAppFreeDesc: '100% Web-Native di Safari & Chrome',
      metricsLatency: '< 150ms Latensi',
      metricsLatencyDesc: 'Koneksi WebSocket real-time instan',
      metricsSavings: 'Hemat s/d 85%',
      metricsSavingsDesc: 'Bebas biaya beli & ganti pager fisik',
      ctaBottomTitle: 'Siap Menghapus Biaya Pager Plastik dari Pengeluaran Anda?',
      ctaBottomSubtitle:
        'Bergabunglah dengan ratusan pengusaha kafe dan restoran modern di Jakarta, Bali, dan Riyadh.',
      whatsappBtn: 'Konsultasi Cepat via WhatsApp',
    },
    ar: {
      badge: 'المنظومة السحابية الأذكى للبيجر الرقمي والمنيو التفاعلي',
      heroTitlePrefix: 'حوّل هاتف عميلك إلى جهاز نداء.',
      heroTitleHighlight: 'بدون أي أجهزة إضافية.',
      heroSubtitle:
        'منظومة لاسلكية عالية الكفاءة للمطاعم، المقاهي، مجمعات الطعام، ومراكز الخدمة. يمسح العميل رمز QR على الفاتورة أو الطاولة، ويستريح في سيارته أو مقعده، ليرن جواله ويهتز فور جهوزية طلبه. مدعومة بمنيو رقمي تفاعلي ومحرك تقييمات Google Maps التلقائي.',
      ctaDemo: 'تجربة لوحة الكاشير (POS)',
      ctaCustomer: 'شاشة استدعاء الزبون',
      ctaTestBuzzer: 'اختبر صوت الرنين',
      metricsAppFree: '0 تطبيق يتم تنزيله',
      metricsAppFreeDesc: 'يعمل 100% داخل Safari و Chrome فوراً',
      metricsLatency: 'استجابة < 150ms',
      metricsLatencyDesc: 'اتصال WebSocket لحظي سحابي',
      metricsSavings: 'توفير حتى 85%',
      metricsSavingsDesc: 'وداعاً لشراء وصيانة أجهزة البيجر البلاستيكية',
      ctaBottomTitle: 'هل أنت مستعد للتخلص من تكاليف البيجر البلاستيكي؟',
      ctaBottomSubtitle:
        'انضم إلى نخبة المقاهي والمطاعم الرائدة في إندونيسيا والخليج اليوم.',
      whatsappBtn: 'تحدث مع فريق المبيعات عبر واتساب',
    },
    en: {
      badge: 'WEB-NATIVE DIGITAL COASTER PAGER & SMART MENU',
      heroTitlePrefix: 'Turn Customer Phones into Pagers.',
      heroTitleHighlight: 'Zero Hardware Required.',
      heroSubtitle:
        'High-performance cloud paging system for cafes, restaurants, food courts, and service centers. Guests scan a QR code on receipt or table, wait comfortably anywhere, and their phone rings & vibrates when orders are ready. Built-in digital menu & automated 5-star Google review booster.',
      ctaDemo: 'Open POS Cashier Demo',
      ctaCustomer: 'Guest Screen Demo',
      ctaTestBuzzer: 'Test Pager Chime',
      metricsAppFree: '0 App Downloads',
      metricsAppFreeDesc: '100% Web-Native in Safari & Chrome',
      metricsLatency: '< 150ms Latency',
      metricsLatencyDesc: 'Instant cloud WebSocket connection',
      metricsSavings: 'Save up to 85%',
      metricsSavingsDesc: 'Zero hardware purchase & battery fees',
      ctaBottomTitle: 'Ready to Eliminate Plastic Pagers from Your Balance Sheet?',
      ctaBottomSubtitle:
        'Join modern cafes and cloud kitchens in Jakarta, Bali, and Riyadh today.',
      whatsappBtn: 'Chat with Sales on WhatsApp',
    },
  };

  const t = heroStrings[lang];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAFAFA] text-zinc-950 flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans antialiased overflow-x-hidden"
    >
      {/* ======================================================== */}
      {/* 1. TOP NAVBAR */}
      {/* ======================================================== */}
      <LandingNavbar
        lang={lang}
        onLangChange={setLang}
        currency={currency}
        onCurrencyChange={setCurrency}
      />

      {/* ======================================================== */}
      {/* 2. HERO SECTION (2-COLUMN SWISS EDITORIAL LAYOUT) */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
          {/* COLUMN 1: DIRECT VALUE HEADLINE & CTAS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* System Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-xs font-mono font-medium text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.badge}</span>
            </div>

            {/* Swiss High-Contrast Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-zinc-950 leading-[1.12]">
              {t.heroTitlePrefix}{' '}
              <span className="text-orange-600 underline decoration-orange-600/30 underline-offset-8">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Authoritative Subheading */}
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/c/ubk/cashier"
                target="_blank"
                className="py-3.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{t.ctaDemo}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>

              <Link
                href="/c/ubk/menu"
                target="_blank"
                className="py-3.5 px-5 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-mono font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-zinc-700" />
                <span>{t.ctaCustomer}</span>
              </Link>

              <a
                href="#simulator"
                className="py-3.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-mono font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-orange-600" />
                <span>{t.ctaTestBuzzer}</span>
              </a>
            </div>

            {/* Micro Metrics Line */}
            <div className="pt-6 grid grid-cols-3 gap-4 border-t border-zinc-200 text-zinc-600">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-zinc-950">0</p>
                <p className="text-xs text-zinc-500 font-medium">{t.metricsAppFreeDesc}</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-600">&lt; 150ms</p>
                <p className="text-xs text-zinc-500 font-medium">{t.metricsLatencyDesc}</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-zinc-950">85%</p>
                <p className="text-xs text-zinc-500 font-medium">{t.metricsSavingsDesc}</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: INTERACTIVE LIVE PAGER SIMULATOR (5 COLS) */}
          <div id="simulator" className="lg:col-span-5 flex flex-col items-center">
            <InteractiveHeroPager initialLang={lang} />
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ASYMMETRIC BENTO GRID (REAL MINIATURE UI ELEMENTS) */}
      {/* ======================================================== */}
      <AsymmetricBentoGrid lang={lang} />

      {/* ======================================================== */}
      {/* 4. INTERACTIVE ROI CALCULATOR */}
      {/* ======================================================== */}
      <InteractiveRoiCalculator lang={lang} currency={currency} />

      {/* ======================================================== */}
      {/* 5. SIDE-BY-SIDE BENCHMARK COMPARISON TABLE */}
      {/* ======================================================== */}
      <ComparisonTable lang={lang} />

      {/* ======================================================== */}
      {/* 6. TRANSPARENT PRICING PLANS */}
      {/* ======================================================== */}
      <PricingSection lang={lang} currency={currency} />

      {/* ======================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ======================================================== */}
      <FaqAccordion lang={lang} />

      {/* ======================================================== */}
      {/* 8. BOTTOM CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200">
        <div className="bg-zinc-950 text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-sm">
          <div className="max-w-2xl mx-auto space-y-3">
            <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black tracking-tight">
              {t.ctaBottomTitle}
            </h2>
            <p className="text-sm sm:text-base text-zinc-400">
              {t.ctaBottomSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3.5 pt-2">
            <a
              href="https://wa.me/966553865899?text=Halo%20Panggil%20App,%20saya%20ingin%20berlangganan%20sistem%20pager"
              target="_blank"
              rel="noreferrer"
              className="py-4 px-7 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2.5 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsappBtn}</span>
            </a>

            <Link
              href="/c/ubk/cashier"
              target="_blank"
              className="py-4 px-6 bg-white/10 hover:bg-white/20 text-white font-mono font-semibold text-sm rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              {t.ctaDemo}
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. SWISS MINIMALIST FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-zinc-200 bg-white py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-3.5">
            <div className="w-9 h-9 rounded-xl overflow-hidden border border-zinc-300 shrink-0 bg-white p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/panggil-logo.jpg"
                alt="Panggil Official Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <p className="font-bold text-zinc-950 font-sans text-sm">Panggil / نداء © 2026</p>
              <p className="text-[11px] text-zinc-500">Zero-Hardware Coaster Pager & Smart Menu Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-zinc-600">
            <Link href="/admin/login" className="hover:text-zinc-950 transition-colors">
              Admin Portal
            </Link>
            <Link href="/c/ubk/cashier" className="hover:text-zinc-950 transition-colors">
              Demo POS
            </Link>
            <Link href="/c/ubk/menu" className="hover:text-zinc-950 transition-colors">
              Demo Menu
            </Link>
          </div>

          <div className="text-center md:text-right rtl:md:text-left text-[11px] text-zinc-400">
            <span>Swiss Minimalist Precision · Southeast Asia & GCC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
