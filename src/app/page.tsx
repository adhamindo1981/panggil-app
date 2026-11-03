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
} from 'lucide-react';

export default function HomePage() {
  const { t, lang, isRtl } = useI18n();

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
