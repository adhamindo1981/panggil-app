'use client';

import React, { useState } from 'react';
import { SpatialCard } from '@/components/cinematic/SpatialCard';
import { MagneticButton } from '@/components/cinematic/MagneticButton';
import { ArrowRight, Calculator } from 'lucide-react';

type Lang = 'id' | 'ar' | 'en';
type Currency = 'IDR' | 'SAR' | 'USD';

interface Props {
  lang: Lang;
  currency: Currency;
}

export function InteractiveRoiCalculator({ lang, currency }: Props) {
  const [hardwarePagerCount, setHardwarePagerCount] = useState<number>(20);
  const [dailyOrderCount, setDailyOrderCount] = useState<number>(120);

  const isRtl = lang === 'ar';

  // Currency Exchange Rates (Base: IDR)
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

  // Hardware costs breakdown
  const hardwareUnitCostIDR = 380000;
  const initialHardwareSavedIDR = hardwarePagerCount * hardwareUnitCostIDR;
  const annualMaintenanceSavedIDR = Math.round(hardwarePagerCount * hardwareUnitCostIDR * 0.25);
  const totalSavingsIDR = initialHardwareSavedIDR + annualMaintenanceSavedIDR;

  const strings = {
    id: {
      tag: 'KALKULATOR ROI & PENGHEMATAN',
      title: 'Hitung Berapa Biaya yang Anda Hemat Setiap Tahun',
      subtitle:
        'Bandingkan biaya modal membeli perangkat pager fisik plastik vs berlangganan cloud Panggil',
      sliderPagers: 'Jumlah Pager Fisik yang Digunakan:',
      sliderOrders: 'Rata-rata Pesanan per Hari:',
      calcSavedHeading: 'TOTAL ESTIMASI PENGHEMATAN:',
      calcPerYear:
        'di tahun pertama (bebas pembelian alat baru, penggantian baterai bocor, dan ganti pager hilang)',
      costBreakdown1: '• Estimasi harga beli 1 pager fisik: Rp 380.000 (~$24 / 95 ر.س)',
      costBreakdown2: '• Rata-rata kerusakan & baterai drop: 25% per tahun',
      btnExplore: 'Lihat Pilihan Paket',
    },
    ar: {
      tag: 'حاسبة العائد المالي والتوفير',
      title: 'احسب كم ستوفّر منشأتك سنوياً عند الاستغناء عن أجهزة البيجر',
      subtitle:
        'مقارنة تكلفة شراء وصيانة أجهزة النداء البلاستيكية باشتراك سحابي ذكي في Panggil',
      sliderPagers: 'عدد أجهزة البيجر البلاستيكية الحالية:',
      sliderOrders: 'متوسط عدد الطلبات اليومية:',
      calcSavedHeading: 'إجمالي الوفورات السنوية التقديرية:',
      calcPerYear:
        'في السنة الأولى (توفير شراء أجهزة جديدة، واستبدال البطاريات، وتكاليف الفقدان والتلف)',
      costBreakdown1: '• متوسط تكلفة جهاز البيجر الواحد: ٩٥ ر.س (~380.000 روبية / 24$)',
      costBreakdown2: '• نسبة التلف وفقدان الأجهزة واستبدال البطاريات: ٢٥٪ سنوياً',
      btnExplore: 'عرض باقات الاشتراك',
    },
    en: {
      tag: 'ROI CALCULATOR & COST REDUCTION',
      title: 'Calculate Your Venue’s Exact Annual Cost Savings',
      subtitle:
        'Compare the capital expense of buying plastic hardware pagers against Panggil SaaS',
      sliderPagers: 'Physical Pagers Currently in Use:',
      sliderOrders: 'Average Daily Orders:',
      calcSavedHeading: 'TOTAL ESTIMATED ANNUAL SAVINGS:',
      calcPerYear:
        'in year one (zero equipment replacement, charging stations, or lost disc fees)',
      costBreakdown1: '• Average physical coaster purchase price: ~$24 / 95 SAR (Rp 380.000)',
      costBreakdown2: '• Average attrition, drop-cracks & battery loss: 25% annually',
      btnExplore: 'Explore Plans',
    },
  };

  const t = strings[lang];

  return (
    <section
      id="calculator"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="py-24 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-200/80 relative"
    >
      <SpatialCard
        tiltIntensity={4}
        badge="ROI & SAVINGS ENGINE"
      >
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block">
            {t.tag}
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-zinc-950 ltr:tracking-tight rtl:tracking-normal rtl:leading-[1.44]">
            {t.title}
          </h2>
          <p className="text-sm text-zinc-600 leading-relaxed">{t.subtitle}</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Sliders Input Column */}
          <div className="space-y-6">
            {/* Slider 1: Hardware Pager Count */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2.5">
                <span className="font-semibold text-zinc-700">{t.sliderPagers}</span>
                <span className="font-bold text-orange-600 text-sm bg-orange-50 px-2.5 py-1 rounded-md border border-orange-200 shadow-xs">
                  {hardwarePagerCount} unit
                </span>
              </div>
              <input
                type="range"
                min="5"
                max="100"
                step="5"
                value={hardwarePagerCount}
                onChange={(e) => setHardwarePagerCount(Number(e.target.value))}
                className="w-full accent-orange-600 cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
              />
            </div>

            {/* Slider 2: Daily Order Count */}
            <div>
              <div className="flex justify-between items-center text-xs font-mono mb-2.5">
                <span className="font-semibold text-zinc-700">{t.sliderOrders}</span>
                <span className="font-bold text-zinc-900 text-sm bg-zinc-100 px-2.5 py-1 rounded-md border border-zinc-200 shadow-xs">
                  {dailyOrderCount} order/hari
                </span>
              </div>
              <input
                type="range"
                min="20"
                max="500"
                step="10"
                value={dailyOrderCount}
                onChange={(e) => setDailyOrderCount(Number(e.target.value))}
                className="w-full accent-zinc-900 cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
              />
            </div>

            <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-2xl text-xs text-zinc-600 font-mono space-y-1.5 leading-relaxed">
              <p>{t.costBreakdown1}</p>
              <p>{t.costBreakdown2}</p>
            </div>
          </div>

          {/* Savings Result Card */}
          <div className="bg-zinc-50/90 border border-zinc-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-4 shadow-sm">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500 block">
              {t.calcSavedHeading}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-emerald-700">
              {formatPrice(totalSavingsIDR, currency)}
            </div>
            <p className="text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
              {t.calcPerYear}
            </p>
            <div className="pt-2">
              <MagneticButton
                variant="primary"
                href="#pricing"
                icon={<ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />}
              >
                {t.btnExplore}
              </MagneticButton>
            </div>
          </div>
        </div>
      </SpatialCard>
    </section>
  );
}
