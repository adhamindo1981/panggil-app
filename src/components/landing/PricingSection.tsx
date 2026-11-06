'use client';

import React, { useState } from 'react';
import { Check } from 'lucide-react';

type Lang = 'id' | 'ar' | 'en';
type Currency = 'IDR' | 'SAR' | 'USD';

interface Props {
  lang: Lang;
  currency: Currency;
}

export function PricingSection({ lang, currency }: Props) {
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');

  const isRtl = lang === 'ar';

  const rates = {
    IDR: 1,
    SAR: 4200,
    USD: 15800,
  };

  const formatPrice = (idrAmount: number, targetCurr: Currency) => {
    if (targetCurr === 'IDR') {
      return `Rp ${idrAmount.toLocaleString('id-ID')}`;
    }
    if (targetCurr === 'SAR') {
      const sar = Math.round(idrAmount / rates.SAR);
      return `${sar.toLocaleString()} ر.س`;
    }
    const usd = Math.round(idrAmount / rates.USD);
    return `$${usd.toLocaleString()}`;
  };

  const plans = [
    {
      id: 'bronze',
      tier: 'Bronze',
      name: { id: 'Dasar (Basic)', ar: 'الأساسية (Basic)', en: 'Basic Essential' },
      priceAnnualIDR: 1990000,
      priceMonthlyIDR: 210000,
      desc: {
        id: 'Cocok untuk kedai kopi permulaan yang ingin sistem panggil tanpa ribet.',
        ar: 'مثالية للمقاهي الناشئة التي تبحث عن نظام نداء فوري بأقل تكلفة.',
        en: 'Perfect for single-counter cafes seeking instant zero-hardware paging.',
      },
      features: {
        id: [
          'Pager digital tanpa batas pemanggilan',
          'Dashboard kasir berbasis web cepat',
          'Notifikasi suara, getar, & visual',
          'Cetak QR order otomatis',
          'Analitik waktu tunggu dasar',
          'Dukungan standar via chat',
        ],
        ar: [
          'نداء بيجر رقمي غير محدود للعملاء',
          'لوحة تحكم كاشير ويب فائقة السرعة',
          'تنبيهات صوتية واهتزاز وشاشة بصرية',
          'توليد وطباعة أكواد QR للطلبات',
          'تقارير أساسية لمعدل فترات الانتظار',
          'دعم فني قياسي عبر المحادثة',
        ],
        en: [
          'Unlimited digital coaster pager calls',
          'Lightning-fast web cashier dashboard',
          'Audio siren, vibration, & visual flashes',
          'Automated QR code order generation',
          'Basic wait-time analytics',
          'Standard chat support',
        ],
      },
      highlight: false,
    },
    {
      id: 'silver',
      tier: 'Silver',
      name: { id: 'Beridentitas (Branded)', ar: 'المصممة بهويتك (Branded)', en: 'Branded Identity' },
      priceAnnualIDR: 2890000,
      priceMonthlyIDR: 290000,
      desc: {
        id: 'Pilihan paling populer. Tampilkan logo kafe dan integrasikan ulasan Google.',
        ar: 'الباقة الأكثر طلباً ورواجاً. تبرز شعار وهوية مقهاك مع جمع تقييمات Google.',
        en: 'Our most popular plan. Showcase your brand identity & gather Google Reviews.',
      },
      features: {
        id: [
          'Semua fitur paket Dasar',
          'Kustomisasi Logo & Warna Kafe (Branded)',
          'Integrasi Ulasan Bintang 5 Google Maps',
          'Menu Digital Interaktif (Katalog produk & foto)',
          'Tampilan tanpa watermark / White-label',
          'Prioritas antrian server 99.9% uptime',
        ],
        ar: [
          'جميع ميزات الباقة الأساسية',
          'تخصيص كامل بشعار وألوان مقهاك (White-Label)',
          'دعوة تلقائية لتقييم المنشأة على خرائط Google',
          'منيو إلكتروني تفاعلي لعرض الأطباق والأسعار',
          'واجهة خالية تماماً من العلامات الخارجية',
          'أولوية معالجة في السيرفر بنسبة تواجد 99.9%',
        ],
        en: [
          'Everything in Basic Plan',
          'Full Cafe Logo & Color Customization (Branded)',
          'Automated 5-Star Google Maps Review Prompts',
          'Interactive Digital Menu (Photos & Descriptions)',
          'White-label customer screens (No Panggil badge)',
          'High-priority server uptime guarantee (99.9%)',
        ],
      },
      highlight: true,
      badge: { id: 'Paling Populer', ar: 'الأكثر طلباً', en: 'Most Popular' },
    },
    {
      id: 'gold',
      tier: 'Gold',
      name: { id: 'Bisnis Pro (Full Suite)', ar: 'الذهبية المتكاملة (Pro)', en: 'Business Pro' },
      priceAnnualIDR: 3990000,
      priceMonthlyIDR: 390000,
      desc: {
        id: 'Solusi lengkap dengan Dual-Mode POS, multi-kasir, dan kit akrilik meja.',
        ar: 'المنظومة الشاملة مع كاشير POS الداخلي، وتعدد الصلاحيات، وحاملات الأكريليك.',
        en: 'The complete hospitality suite with built-in POS, staff roles, and table kits.',
      },
      features: {
        id: [
          'Semua fitur paket Beridentitas',
          'Dual-Mode POS Kasir (Tiket cepat + Pilih menu)',
          'Multi-Kasir & Multi-Staf dengan PIN akses',
          'Kit Desain Stand Meja Akrilik siap cetak',
          'Kustomisasi audio suara panggil & jingle kafe',
          'Dukungan VIP 24/7 & Dedicated onboarding',
        ],
        ar: [
          'جميع ميزات باقة الهوية المخصصة',
          'نظام كاشير متكامل (Dual-Mode POS) لاختيار الوجبات',
          'تعدد أجهزة الكاشير والموظفين برمز PIN أمان',
          'حزمة تصاميم ستاندات الطاولات الأكريليك الجاهزة للطباعة',
          'تخصيص نغمات الرنين وصوت المناداة الخاص بالمتجر',
          'دعم فني VIP فوري على مدار الساعة',
        ],
        en: [
          'Everything in Branded Plan',
          'Dual-Mode Cashier POS (Quick ticket + Menu selection)',
          'Multi-staff accounts with secure Cashier PIN',
          'Printable Acrylic Table Stand Design Kit',
          'Custom brand chime audio & custom call sound',
          '24/7 VIP Priority support & dedicated onboarding',
        ],
      },
      highlight: false,
    },
    {
      id: 'enterprise',
      tier: 'Enterprise',
      name: { id: 'Jaringan Multi-Cabang', ar: 'الشركات وسلاسل الفروع', en: 'Multi-Outlet Chain' },
      priceAnnualIDR: 0,
      priceMonthlyIDR: 0,
      desc: {
        id: 'Untuk jaringan kafe, franchise, dan food court dengan puluhan cabang.',
        ar: 'مخصصة للعلامات التجارية وسلاسل الفروع الكبرى ومجمعات المطاعم.',
        en: 'For franchise cafe networks, cloud kitchens, and multi-branch food courts.',
      },
      features: {
        id: [
          'Lisensi multi-cabang terpusat (Centralized Dashboard)',
          'Integrasi API langsung ke POS (Moka, Pawoon, Odoo, Foodics)',
          'Server khusus & SLA 99.99% ketersediaan',
          'Manajer Akun Khusus (Dedicated Account Manager)',
          'Pelatihan staf langsung & setup onsite',
        ],
        ar: [
          'لوحة تحكم مركزية موحدة لجميع الفروع',
          'تكامل API مباشر مع برامج الكاشير (Foodics, Odoo, Moka)',
          'سيرفرات سحابية مخصصة وضمان تشغيل 99.99%',
          'مدير حساب تنفيذي مخصص لمنشأتك',
          'تدريب طاقم العمل وتجهيز الفروع',
        ],
        en: [
          'Centralized multi-outlet management dashboard',
          'Direct REST API integrations with POS (Odoo, Foodics, Moka)',
          'Dedicated server cluster & 99.99% SLA guarantee',
          'Dedicated Enterprise Account Executive',
          'Comprehensive staff onboarding & rollout',
        ],
      },
      highlight: false,
      isCustom: true,
    },
  ];

  const strings = {
    id: {
      tag: 'TRANSPARAN & TANPA BIAYA TERSEMBUNYI',
      title: 'Pilihan Paket Langganan Sesuai Skala Bisnis',
      subtitle: 'Mulai dari kedai kopi independen hingga jaringan franchise puluhan cabang',
      toggleAnnual: 'Tahunan (Hemat 20%)',
      toggleMonthly: 'Bulanan',
      btnChoose: 'Pilih Paket Ini',
      customQuote: 'Custom Quote',
      customQuoteSub: 'Sesuai jumlah cabang',
      perYear: '/ tahun',
      perMonth: '/ bulan',
    },
    ar: {
      tag: 'شفافية مطلقة وبدون رسوم خفية',
      title: 'باقات اشتراك مصممة لمختلف أحجام الأعمال',
      subtitle: 'من المقاهي الفردية الناشئة وحتى سلاسل الامتياز التجاري المتعددة',
      toggleAnnual: 'سنوي (وفر 20%)',
      toggleMonthly: 'شهري',
      btnChoose: 'اختر هذه الباقة',
      customQuote: 'عرض مخصص',
      customQuoteSub: 'بحسب عدد الفروع والعمليات',
      perYear: '/ سنوياً',
      perMonth: '/ شهرياً',
    },
    en: {
      tag: 'TRANSPARENT & PREDICTABLE',
      title: 'Simple Plans Built for Hospitality Scale',
      subtitle: 'From single-counter specialty coffee shops to multi-branch franchise operations',
      toggleAnnual: 'Annual (Save 20%)',
      toggleMonthly: 'Monthly',
      btnChoose: 'Select This Plan',
      customQuote: 'Custom Quote',
      customQuoteSub: 'Per outlet scale',
      perYear: '/ year',
      perMonth: '/ month',
    },
  };

  const t = strings[lang];

  return (
    <section
      id="pricing"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="py-20 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-3">
        <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest">
          {t.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-zinc-950 ltr:tracking-tight rtl:tracking-normal rtl:leading-[1.4]">
          {t.title}
        </h2>
        <p className="text-sm sm:text-base text-zinc-600">{t.subtitle}</p>

        {/* Billing Cycle Toggle */}
        <div className="pt-3 flex justify-center">
          <div className="inline-flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-mono font-semibold">
            <button
              type="button"
              onClick={() => setBillingCycle('annual')}
              className={`py-1.5 px-4 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                billingCycle === 'annual'
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              <span>{t.toggleAnnual}</span>
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
            </button>
            <button
              type="button"
              onClick={() => setBillingCycle('monthly')}
              className={`py-1.5 px-4 rounded-lg transition-colors cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                  : 'text-zinc-600 hover:text-zinc-950'
              }`}
            >
              {t.toggleMonthly}
            </button>
          </div>
        </div>
      </div>

      {/* Pricing Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {plans.map((p) => {
          const price = billingCycle === 'annual' ? p.priceAnnualIDR : p.priceMonthlyIDR;
          return (
            <div
              key={p.id}
              className={`bg-white rounded-3xl p-6 sm:p-7 border flex flex-col justify-between transition-colors shadow-xs ${
                p.highlight
                  ? 'border-orange-600 ring-2 ring-orange-600/10'
                  : 'border-zinc-200 hover:border-zinc-300'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                    {p.tier}
                  </span>
                  {p.badge && (
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
                      {p.badge[lang]}
                    </span>
                  )}
                </div>
                <h3 className="text-xl font-bold text-zinc-950 mb-1">{p.name[lang]}</h3>
                <p className="text-xs text-zinc-500 mb-6 leading-normal min-h-[32px]">{p.desc[lang]}</p>

                <div className="mb-6 pb-6 border-b border-zinc-200">
                  {!p.isCustom ? (
                    <>
                      <div className="text-3xl font-mono font-black text-zinc-950">
                        {formatPrice(price, currency)}
                      </div>
                      <span className="text-[11px] font-mono text-zinc-500">
                        {billingCycle === 'annual'
                          ? lang === 'id'
                            ? '/ tahun (Rp ' + Math.round(price / 12).toLocaleString('id-ID') + '/bln)'
                            : t.perYear
                          : t.perMonth}
                      </span>
                    </>
                  ) : (
                    <>
                      <div className="text-2xl font-mono font-bold text-zinc-900">{t.customQuote}</div>
                      <span className="text-[11px] text-zinc-500 font-mono">
                        {t.customQuoteSub}
                      </span>
                    </>
                  )}
                </div>

                {/* Feature Checklist */}
                <ul className="space-y-3 text-xs text-zinc-700 mb-8">
                  {p.features[lang].map((f, idx) => (
                    <li key={idx} className="flex items-start gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                      <span className="leading-snug">{f}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <a
                href={`https://wa.me/966553865899?text=${encodeURIComponent(
                  `Halo Panggil App, saya tertarik berlangganan paket ${p.tier} (${billingCycle})`
                )}`}
                target="_blank"
                rel="noreferrer"
                className={`w-full py-3.5 px-4 rounded-xl text-center font-mono font-bold text-xs ${
                  p.highlight ? 'btn-3d-orange' : 'btn-3d-dark'
                }`}
              >
                {t.btnChoose}
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}
