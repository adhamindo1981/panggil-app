import React from 'react';
import {
  BellRing,
  Coffee,
  CheckCircle2,
  Clock,
  QrCode,
  Star,
  Smartphone,
  Layers,
  ShieldCheck,
  Zap,
  ArrowRight,
  Sparkles,
  Flame,
  Check,
  Store,
  Sliders,
} from 'lucide-react';
import { AnimatedBrandLogo } from './AnimatedBrandLogo';

type Lang = 'id' | 'ar' | 'en';

interface Props {
  lang: Lang;
}

export function AsymmetricBentoGrid({ lang }: Props) {
  const isRtl = lang === 'ar';

  const strings = {
    id: {
      tag: 'ARSITEKTUR & FITUR UTAMA',
      title: 'Satu Platform Utuh untuk Menggantikan Seluruh Pager Fisik',
      subtitle:
        'Didesain dengan presisi Swiss: cepat, higienis, andal, dan mengeliminasi antrean menumpuk di meja kasir.',
      bento1Tag: 'DISPATCHER KASIR REAL-TIME',
      bento1Title: 'Manajemen Antrean Pesanan POS Satu-Klik',
      bento1Desc:
        'Kasir melihat seluruh tiket antrean secara real-time. Cukup klik tombol panggil, sirene di ponsel pelanggan langsung berbunyi dan bergetar tanpa hambatan jarak.',
      bento2Tag: 'STAND AKRILIK MEJA ZERO-HARDWARE',
      bento2Title: 'Scan QR Langsung Buka Tiket',
      bento2Desc:
        'Pelanggan menggunakan kamera ponsel bawaan. Tidak ada alat pager fisik yang harus dicuci, dicas pada rak pengisi daya, atau takut hilang dibawa pulang.',
      bento3Tag: 'PENGUMPUL ULASAN OTOMATIS',
      bento3Title: 'Booster Rating 5-Bintang Google Maps',
      bento3Desc:
        'Begitu pesanan diambil, layar secara otomatis mengajak pelanggan memberikan ulasan bintang 5, mendongkrak peringkat lokal kafe Anda.',
      bento4Tag: 'MENU DIGITAL & UPSELLING',
      bento4Title: 'Katalog Menu Interaktif Terintegrasi',
      bento4Desc:
        'Pelanggan dapat menjelajahi foto menu beresolusi tinggi, memilih varian kopi (less sugar, oat milk), dan melakukan pesanan tambahan selagi menunggu.',
      bento5Tag: 'AUDIO KEEP-ALIVE SURVIVAL',
      bento5Title: 'Tetap Berdering Walau Layar Terkunci',
      bento5Desc:
        'Teknologi audio background survival menjaga koneksi WebSocket tetap hidup di iOS Safari & Android saat ponsel dimasukkan ke dalam saku.',
      bento6Tag: 'GOVERNANCE MULTI-CABANG',
      bento6Title: 'Kontrol Terpusat untuk Franchise & Jaringan',
      bento6Desc:
        'Pantau waktu tunggu rata-rata, volume pesanan, dan hak akses staf kasir di seluruh cabang dalam satu dashboard admin tunggal.',
    },
    ar: {
      tag: 'البنية البرمجية والمزايا الأساسية',
      title: 'منظومة متكاملة تُغنيك عن أجهزة البيجر البلاستيكية للأبد',
      subtitle:
        'صُممت بمعايير السلاسة السويسرية: دقيقة، صحية، فائقة السرعة، وتقضي على التزاحم عند شباك الاستلام.',
      bento1Tag: 'لوحة توزيع الكاشير اللحظية',
      bento1Title: 'إدارة طابور الطلبات بنقرة زر واحدة',
      bento1Desc:
        'يشاهد الكاشير جميع التذاكر النشطة في شاشة واحدة. بلمسة واحدة ينطلق الرنين والاهتزاز في جوال العميل دون قيود المسافة أو الجدران العازلة.',
      bento2Tag: 'ستاند الطاولة الأكريليك الذكي',
      bento2Title: 'مسح QR يفتح شاشة الطلب في 0.4 ثانية',
      bento2Desc:
        'يعتمد العميل كاميرا جواله الأصلية. لا أجهزة تتطلب شحناً كهربائياً مستمراً أو تتعرض للكسر أو الضياع.',
      bento3Tag: 'محرك التقييم التلقائي',
      bento3Title: 'مضاعفة تقييمات خرائط Google بخمس نجوم',
      bento3Desc:
        'فور تأكيد استلام الطلب، تظهر نافذة ذكية تدعو العميل لتقييم المنشأة بـ 5 نجوم لرفع ترتيب مقهاك في محركات البحث المحلية.',
      bento4Tag: 'منيو رقمي ومبيعات إضافية',
      bento4Title: 'قائمة طعام تفاعلية متزامنة بالكامل',
      bento4Desc:
        'يتصفح العميل صور الأطباق العالية الدقة، ويختار التعديلات (حليب شوفان، سكر قليل)، مما يرفع متوسط قيمة الفاتورة بنسبة 28%.',
      bento5Tag: 'استقرار الصوت في الخلفية',
      bento5Title: 'يرن ويهتز حتى لو كان الهاتف في الجيب أو مقفلاً',
      bento5Desc:
        'بروتوكول Audio Keep-Alive المتطور يحافظ على استمرار نفق WebSocket نشطاً في خلفية المتصفح على أجهزة iPhone و Android.',
      bento6Tag: 'إدارة الفروع المركزية',
      bento6Title: 'تحكم شامل لسلاسل الفروع والمطابخ السحابية',
      bento6Desc:
        'مراقبة متوسط فترات الانتظار، أحجام المبيعات، وصلاحيات طاقم الكاشير برمز PIN لجميع الفروع في لوحة إدارة مركزية موحدة.',
    },
    en: {
      tag: 'CORE ARCHITECTURE & CAPABILITIES',
      title: 'An All-in-One Cloud Engine to Retire Hardware Pagers',
      subtitle:
        'Engineered with Swiss precision: clean, hygienic, resilient, and eliminates service counter congestion.',
      bento1Tag: 'REAL-TIME CASHIER DISPATCHER',
      bento1Title: 'One-Click POS Order Queue Governance',
      bento1Desc:
        'Cashiers manage all active tickets in a unified live queue. A single tap triggers an audible buzzer and vibration directly on the customer’s phone.',
      bento2Tag: 'ZERO-HARDWARE ACRYLIC STAND',
      bento2Title: 'Native Camera Scan Opens Ticket in 0.4s',
      bento2Desc:
        'Customers use their native camera. No plastic discs to sanitize, charge on bulky charging racks, or lose to accidental takeaway.',
      bento3Tag: 'AUTOMATED FEEDBACK LOOP',
      bento3Title: '5-Star Google Maps Review Multiplier',
      bento3Desc:
        'As soon as the customer confirms pickup, an elegant prompt routes satisfied guests directly to your Google Maps listing.',
      bento4Tag: 'INTEGRATED DIGITAL MENU',
      bento4Title: 'Visual Upselling & High-Res Catalog',
      bento4Desc:
        'Guests browse signature drinks, select modifiers (oat milk, less sugar), and place repeat orders while waiting, lifting ticket sizes by 28%.',
      bento5Tag: 'BACKGROUND AUDIO KEEP-ALIVE',
      bento5Title: 'Alerts Sound Even With Pocketed & Locked Screens',
      bento5Desc:
        'Our proprietary audio keep-alive protocol keeps the WebSocket stream alive in iOS Safari and Android Chrome when the screen sleeps.',
      bento6Tag: 'MULTI-OUTLET GOVERNANCE',
      bento6Title: 'Centralized Multi-Branch Enterprise Console',
      bento6Desc:
        'Track average wait times, ticket volumes, and staff security PIN permissions across every franchise location from one central cockpit.',
    },
  };

  const t = strings[lang];

  return (
    <section id="features" dir={isRtl ? 'rtl' : 'ltr'} className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200">
      {/* Section Header */}
      <div className="mb-14 space-y-2 max-w-3xl">
        <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest">
          {t.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 tracking-tight leading-tight">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base text-zinc-600 leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Asymmetric Bento Grid (12 Columns) */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        {/* ======================================================== */}
        {/* TILE 1: CASHIER QUEUE & DISPATCHER (SPAN 8) */}
        {/* ======================================================== */}
        <div className="md:col-span-8 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-300">
          <div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider">
                {t.bento1Tag}
              </span>
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-emerald-50 border border-emerald-200 text-[11px] font-mono font-bold text-emerald-800">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-ping" />
                Live WebSocket Active
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 mb-2">
              {t.bento1Title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6 max-w-2xl">
              {t.bento1Desc}
            </p>
          </div>

          {/* REALISTIC MINIATURE CASHIER QUEUE INTERFACE */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5 font-mono text-xs">
            <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-zinc-500 text-[11px]">
              <div className="flex items-center gap-2">
                <Store className="w-3.5 h-3.5 text-zinc-700" />
                <span className="text-zinc-900 font-bold">Grand Indonesia · Counter 01</span>
              </div>
              <span className="text-zinc-500 font-semibold">4 Active Tickets</span>
            </div>

            <div className="divide-y divide-zinc-200">
              {/* Active Ticket 1 - Ready / Buzzed */}
              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-black text-emerald-600">#A-108</span>
                  <div>
                    <p className="font-sans font-semibold text-zinc-900 text-xs">Spanish Latte (Ice) + Almond Croissant</p>
                    <p className="text-[10px] text-zinc-400">Tamu: Adham · Struk #9402 · Wait: 3m 40s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-emerald-100 border border-emerald-300 text-emerald-900 font-bold text-[10px] flex items-center gap-1 shadow-xs">
                    <Check className="w-3 h-3 text-emerald-700" />
                    SIAP DIAMBIL
                  </span>
                  <button className="px-3 py-1.5 rounded-lg btn-3d-orange font-mono font-bold text-[10px]">
                    PANGGIL ULANG
                  </button>
                </div>
              </div>

              {/* Active Ticket 2 - In Preparation */}
              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-black text-zinc-800">#A-109</span>
                  <div>
                    <p className="font-sans font-semibold text-zinc-900 text-xs">Manual Brew V60 Gayo Wine</p>
                    <p className="text-[10px] text-zinc-400">Tamu: Walk-in Meja 04 · Wait: 1m 20s</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-md bg-amber-50 border border-amber-200 text-amber-900 font-bold text-[10px]">
                    SEDANG DIRACIK
                  </span>
                  <button className="px-3 py-1.5 rounded-lg btn-3d-dark font-mono font-bold text-[10px]">
                    PANGGIL PELANGGAN
                  </button>
                </div>
              </div>

              {/* Active Ticket 3 - New Order */}
              <div className="py-3 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                  <span className="text-lg font-mono font-black text-zinc-400">#A-110</span>
                  <div>
                    <p className="font-sans font-semibold text-zinc-900 text-xs">2x Caramel Macchiato · 1x Cheesecake</p>
                    <p className="text-[10px] text-zinc-400">Tamu: Online QR Kit · Baru Masuk</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-md bg-zinc-200/80 text-zinc-600 font-mono text-[10px] font-medium">
                  BARU MASUK
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 2: ZERO-HARDWARE ACRYLIC TABLE STAND (SPAN 4) */}
        {/* ======================================================== */}
        <div className="md:col-span-4 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
              {t.bento2Tag}
            </span>
            <h3 className="text-xl font-bold text-zinc-950 mb-2">
              {t.bento2Title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {t.bento2Desc}
            </p>
          </div>

          {/* REALISTIC 3D-STYLE ACRYLIC STAND GRAPHIC */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 flex flex-col items-center text-center">
            <div className="w-28 h-36 bg-white border-2 border-zinc-300 rounded-xl p-2.5 shadow-md flex flex-col justify-between items-center relative animate-float">
              <AnimatedBrandLogo size="sm" showRays={false} interactive={false} />
              <div className="w-16 h-16 bg-zinc-950 rounded-lg p-1.5 flex items-center justify-center shadow-inner">
                <QrCode className="w-full h-full text-white" />
              </div>
              <span className="text-[9px] font-mono font-bold text-zinc-700 uppercase tracking-wider">
                TABLE #08
              </span>
            </div>
            <p className="text-xs font-mono font-semibold text-zinc-900 mt-4">
              Scan Kamera Bawaan · Safari & Chrome
            </p>
            <p className="text-[11px] text-zinc-500 font-mono mt-0.5">
              0 Baterai Drop · 0 Alat Pecah
            </p>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 3: GOOGLE MAPS 5-STAR REVIEWS (SPAN 4) */}
        {/* ======================================================== */}
        <div className="md:col-span-4 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
              {t.bento3Tag}
            </span>
            <h3 className="text-xl font-bold text-zinc-950 mb-2">
              {t.bento3Title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {t.bento3Desc}
            </p>
          </div>

          {/* REALISTIC RATING MODAL PREVIEW */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 space-y-3">
            <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
              <span>CAPTURE RATE</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-md border border-emerald-200 shadow-xs">
                +38% REVIEWS
              </span>
            </div>
            <div className="bg-white p-4 rounded-xl border border-zinc-200 text-center shadow-xs">
              <div className="flex justify-center gap-1.5 text-amber-400 mb-2">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star key={s} className="w-5 h-5 fill-amber-400 transition-transform hover:scale-125 cursor-pointer" />
                ))}
              </div>
              <p className="text-xs font-bold text-zinc-900 mb-0.5">
                Ulasan Bintang 5 Terverifikasi
              </p>
              <p className="text-[10px] text-zinc-500">
                Otomatis redirect ke listing Google Maps kafe Anda
              </p>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 4: INTERACTIVE DIGITAL MENU (SPAN 8) */}
        {/* ======================================================== */}
        <div className="md:col-span-8 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
              {t.bento4Tag}
            </span>
            <h3 className="text-xl sm:text-2xl font-bold text-zinc-950 mb-2">
              {t.bento4Title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6 max-w-2xl">
              {t.bento4Desc}
            </p>
          </div>

          {/* REALISTIC DIGITAL MENU INTERFACE SNIPPET */}
          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-4 sm:p-5">
            <div className="flex gap-2 mb-4 overflow-x-auto pb-1 text-xs font-mono">
              <span className="px-3 py-1 bg-zinc-950 text-white rounded-lg font-bold shadow-xs">Semua Menu</span>
              <span className="px-3 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors cursor-pointer">Specialty Coffee</span>
              <span className="px-3 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors cursor-pointer">Artisan Bakery</span>
              <span className="px-3 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-lg hover:border-zinc-400 transition-colors cursor-pointer">Non-Coffee</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {/* Menu Item 1 */}
              <div className="bg-white p-3.5 rounded-xl border border-zinc-200 flex items-center justify-between shadow-xs hover:border-orange-300 transition-colors">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-sans font-bold text-xs text-zinc-950">Spanish Latte Signature</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded">
                      BEST
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500">Rp 38.000 · 9.5 ر.س</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg btn-3d-white font-mono text-[11px] font-semibold">
                  + Custom
                </button>
              </div>

              {/* Menu Item 2 */}
              <div className="bg-white p-3.5 rounded-xl border border-zinc-200 flex items-center justify-between shadow-xs hover:border-emerald-300 transition-colors">
                <div>
                  <div className="flex items-center gap-1.5 mb-1">
                    <span className="font-sans font-bold text-xs text-zinc-950">Almond Butter Croissant</span>
                    <span className="text-[9px] font-mono font-bold px-1.5 py-0.5 bg-emerald-100 text-emerald-800 rounded">
                      FRESH
                    </span>
                  </div>
                  <p className="text-[11px] font-mono text-zinc-500">Rp 32.000 · 8.0 ر.س</p>
                </div>
                <button className="px-3 py-1.5 rounded-lg btn-3d-white font-mono text-[11px] font-semibold">
                  + Custom
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 5: AUDIO KEEP-ALIVE SURVIVAL (SPAN 6) */}
        {/* ======================================================== */}
        <div className="md:col-span-6 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
              {t.bento5Tag}
            </span>
            <h3 className="text-xl font-bold text-zinc-950 mb-2">
              {t.bento5Title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {t.bento5Desc}
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 font-mono text-xs text-zinc-700 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span>iOS Safari Silent WebAudio Stream</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                ACTIVE (24KHz)
              </span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span>Android Vibration Haptics Engine</span>
              <span className="text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                300ms BURST
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span>Screen Sleep Survival Rate</span>
              <span className="text-zinc-950 font-bold">99.8% Reliability</span>
            </div>
          </div>
        </div>

        {/* ======================================================== */}
        {/* TILE 6: MULTI-OUTLET GOVERNANCE (SPAN 6) */}
        {/* ======================================================== */}
        <div className="md:col-span-6 bg-white border border-zinc-200 rounded-3xl p-6 sm:p-8 flex flex-col justify-between shadow-xs hover:border-zinc-300 hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
              {t.bento6Tag}
            </span>
            <h3 className="text-xl font-bold text-zinc-950 mb-2">
              {t.bento6Title}
            </h3>
            <p className="text-sm text-zinc-600 leading-relaxed mb-6">
              {t.bento6Desc}
            </p>
          </div>

          <div className="bg-zinc-50 border border-zinc-200 rounded-2xl p-5 font-mono text-xs text-zinc-700 space-y-2.5">
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span>Central Outlet Switcher</span>
              <span className="text-zinc-950 font-bold">Jakarta · Bali · Riyadh</span>
            </div>
            <div className="flex items-center justify-between pb-2 border-b border-zinc-200">
              <span>Cashier Staff PIN Isolation</span>
              <span className="text-zinc-950 font-bold">4-Digit Role Security</span>
            </div>
            <div className="flex items-center justify-between">
              <span>POS REST API Webhooks</span>
              <span className="text-emerald-700 font-bold">Foodics · Odoo · Moka</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
