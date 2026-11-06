'use client';

import React from 'react';
import { Check, X } from 'lucide-react';
import { SpatialCard } from '@/components/cinematic/SpatialCard';

type Lang = 'id' | 'ar' | 'en';

interface Props {
  lang: Lang;
}

export function ComparisonTable({ lang }: Props) {
  const isRtl = lang === 'ar';

  const strings = {
    id: {
      tag: 'ANALISIS KOMPARASI OBJEKTIF',
      title: 'Panggil Digital vs Pager Fisik Plastik Tradisional',
      subtitle:
        'Perbandingan jelas antara sistem modern berbasis ponsel dan pager kuno dalam operasional harian',
      thParam: 'PARAMETER EVALUASI',
      thPanggil: 'PANGGIL (DIGITAL COASTER)',
      thHardware: 'PAGER FISIK PLASTIK KUNO',
    },
    ar: {
      tag: 'المقارنة الموضوعية الدقيقة',
      title: 'نظام نداء (Panggil) الرقمي مقابل أجهزة البيجر البلاستيكية',
      subtitle:
        'مقارنة تحليلية توضح الفوارق الجوهرية في التكلفة، الصحة، المدى، وهوية العلامة التجارية',
      thParam: 'معيار المقارنة',
      thPanggil: 'نظام نداء (PANGGIL DIGITAL)',
      thHardware: 'أجهزة البيجر البلاستيكية التقليدية',
    },
    en: {
      tag: 'OBJECTIVE BENCHMARK COMPARISON',
      title: 'Panggil Digital vs Traditional Plastic Hardware Pagers',
      subtitle:
        'A side-by-side operational breakdown of cost, operating range, hygiene, and branding',
      thParam: 'EVALUATION METRIC',
      thPanggil: 'PANGGIL (DIGITAL COASTER)',
      thHardware: 'LEGACY HARDWARE PAGERS',
    },
  };

  const t = strings[lang];

  const comparisonData = [
    {
      label: { id: 'Biaya Investasi Awal', ar: 'تكلفة الاستثمار والتأسيس', en: 'Initial Setup Investment' },
      panggil: { id: 'Rp 0 (Gunakan perangkat yang ada)', ar: '0 ر.س (بدون شراء أي أجهزة)', en: '$0 (Use existing mobile devices)' },
      hardware: { id: 'Rp 5.000.000 - Rp 15.000.000+ untuk beli pager', ar: 'تكلفة باهظة (3,000 - 8,000 ر.س للبيجر)', en: '$400 - $1,200+ for hardware set' },
    },
    {
      label: { id: 'Jangkauan Pemanggilan (Range)', ar: 'مدى ونطاق التغطية', en: 'Signal Range' },
      panggil: { id: 'Tanpa batas (Bisa tunggu di mobil / ruko sebelah)', ar: 'غير محدود إطلاقاً (يعمل بالإنترنت والجوال)', en: 'Unlimited (Customer can wait in car or nearby shops)' },
      hardware: { id: 'Terbatas 50 - 100m sinyal radio terputus', ar: 'محدود جداً (50-100 متر وتفقد الإشارة)', en: 'Limited to 50-100 meters, walls block signal' },
    },
    {
      label: { id: 'Kebersihan & Higienitas', ar: 'النظافة والتعقيم والصحة', en: 'Hygiene & Cleanliness' },
      panggil: { id: '100% Higienis (Pelanggan pegang HP sendiri)', ar: '100% صحي (كل عميل يمسك هاتفه الخاص)', en: '100% Hygienic (Customers hold their own phones)' },
      hardware: { id: 'Dipegang bergantian ratusan orang, butuh disinfeksi', ar: 'يتناقله مئات الأشخاص يومياً ويحتاج تعقيم دائم', en: 'Passed through hundreds of hands, requires constant sanitizing' },
    },
    {
      label: { id: 'Kehilangan & Kerusakan Alat', ar: 'تلف وفقدان الأجهزة', en: 'Loss & Breakage Costs' },
      panggil: { id: '0% risiko hilang (Pelanggan bawa HP sendiri)', ar: 'صفر مخاطر فقدان أو تلف', en: 'Zero risk of loss or broken discs' },
      hardware: { id: 'Sering terjatuh pecah, hilang dibawa pulang', ar: 'سقوط متكرر، بطاريات تالفة، وفقدان مستمر', en: 'High attrition: dropped, cracked, stolen accidentally' },
    },
    {
      label: { id: 'Branding & Identitas Merek', ar: 'الهوية البصرية للمنشأة', en: 'Branding & Identity' },
      panggil: { id: 'Layar elegan penuh warna, logo kafe, & foto menu', ar: 'صفحة أنيقة متكاملة بشعارك وألوان مقهاك وقائمتك', en: 'Stunning full-screen interface with your logo and menu' },
      hardware: { id: 'Kotak plastik hitam kusam tanpa identitas', ar: 'جهاز بلاستيكي عام خالي من أي طابع جمالي', en: 'Generic black plastic coaster with sticky sticker' },
    },
    {
      label: { id: 'Pengumpulan Ulasan Google Maps', ar: 'تقييمات خرائط Google', en: 'Google Maps Reviews' },
      panggil: { id: 'Otomatis minta rating bintang 5 setelah ambil pesanan', ar: 'دعوة مباشرة وفورية للتقييم بعد استلام الطلب', en: 'Automated 5-star review collection upon pickup' },
      hardware: { id: 'Tidak ada cara untuk meminta ulasan', ar: 'لا يتيح أي إمكانية لجمع التقييمات', en: 'Impossible to gather customer feedback' },
    },
    {
      label: { id: 'Katalog Menu Digital Terpadu', ar: 'منيو إلكتروني وقائمة طعام', en: 'Integrated Digital Menu' },
      panggil: { id: 'Tersedia! Pelanggan bisa jelajah menu & pesan lagi', ar: 'متوفر ومدمج بالكامل مع الصور والأسعار والأقسام', en: 'Included! Customers can browse rich photos & re-order' },
      hardware: { id: 'Tidak ada (Hanya pager nomor)', ar: 'غير موجود (مجرد لمبة ورقم)', en: 'None (Plain number buzzer)' },
    },
  ];

  return (
    <section
      id="comparison"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="py-24 px-4 sm:px-8 max-w-6xl mx-auto w-full border-t border-zinc-200/80 relative"
    >
      <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block">
          {t.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 ltr:tracking-tight rtl:tracking-normal rtl:leading-[1.44]">
          {t.title}
        </h2>
        <p className="text-sm text-zinc-600 leading-relaxed">{t.subtitle}</p>
      </div>

      <SpatialCard
        tiltIntensity={3}
        telemetryCode="BENCHMARK_MATRIX // PARITY_V2"
        badge="OBJECTIVE AUDIT"
        className="w-full"
      >
        <div className="overflow-x-auto -m-2">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50/80 text-zinc-700 font-mono">
                <th className="py-4.5 px-6 font-bold uppercase w-1/3 text-[11px]">{t.thParam}</th>
                <th className="py-4.5 px-6 font-bold uppercase w-1/3 text-orange-700 bg-orange-50/40 text-[11px]">
                  {t.thPanggil}
                </th>
                <th className="py-4.5 px-6 font-bold uppercase w-1/3 text-zinc-500 text-[11px]">
                  {t.thHardware}
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200/80 font-sans">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/70 transition-colors">
                  <td className="py-4 px-6 font-bold text-zinc-900 text-xs sm:text-sm">
                    {row.label[lang]}
                  </td>
                  <td className="py-4 px-6 font-semibold text-emerald-800 bg-orange-50/15 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{row.panggil[lang]}</span>
                    </div>
                  </td>
                  <td className="py-4 px-6 text-zinc-500 text-xs sm:text-sm">
                    <div className="flex items-center gap-2.5">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{row.hardware[lang]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </SpatialCard>
    </section>
  );
}
