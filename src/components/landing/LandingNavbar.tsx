'use client';

import React from 'react';
import Link from 'next/link';
import { ShieldCheck } from 'lucide-react';
import { AnimatedBrandLogo } from './AnimatedBrandLogo';
import { MagneticButton } from '@/components/cinematic/MagneticButton';

type Lang = 'id' | 'ar' | 'en';
type Currency = 'IDR' | 'SAR' | 'USD';

interface Props {
  lang: Lang;
  onLangChange: (newLang: Lang) => void;
  currency: Currency;
  onCurrencyChange: (newCurrency: Currency) => void;
}

export function LandingNavbar({
  lang,
  onLangChange,
  currency,
  onCurrencyChange,
}: Props) {
  const isRtl = lang === 'ar';

  const navLabels = {
    id: {
      simulator: 'SIMULATOR',
      features: 'FITUR',
      calculator: 'KALKULATOR ROI',
      comparison: 'KOMPARASI',
      pricing: 'HARGA',
      admin: 'Admin Portal',
    },
    ar: {
      simulator: 'المحاكي',
      features: 'المزايا',
      calculator: 'حاسبة التوفير',
      comparison: 'المقارنة',
      pricing: 'الباقات والأسعار',
      admin: 'بوابة الإدارة',
    },
    en: {
      simulator: 'SIMULATOR',
      features: 'FEATURES',
      calculator: 'ROI CALCULATOR',
      comparison: 'COMPARISON',
      pricing: 'PRICING',
      admin: 'Admin Portal',
    },
  };

  const t = navLabels[lang];

  return (
    <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 border-b border-zinc-200/80 backdrop-blur-xl px-4 sm:px-8 py-3 transition-all">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        {/* Brand & Animated Logo */}
        <Link href="/" className="flex items-center gap-3.5 group">
          <AnimatedBrandLogo size="sm" showRays={false} interactive={true} />
          <div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-bold tracking-tight text-zinc-950 font-mono">
                PANGGIL
              </span>
              <span className="text-xs font-medium text-zinc-500 font-arabic">/ نداء</span>
              <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                Smart Pager
              </span>
            </div>
            <p className="text-[11px] text-zinc-500 font-medium">Digital Coaster & Smart Menu</p>
          </div>
        </Link>

        {/* Desktop Anchor Navigation */}
        <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-zinc-600 font-mono">
          <a href="#simulator" className="hover:text-orange-600 transition-colors">
            {t.simulator}
          </a>
          <a href="#features" className="hover:text-orange-600 transition-colors">
            {t.features}
          </a>
          <a href="#calculator" className="hover:text-orange-600 transition-colors">
            {t.calculator}
          </a>
          <a href="#comparison" className="hover:text-orange-600 transition-colors">
            {t.comparison}
          </a>
          <a href="#pricing" className="hover:text-orange-600 transition-colors">
            {t.pricing}
          </a>
        </nav>

        {/* Currency & Language Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Currency Toggle */}
          <div className="flex bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/90 text-[11px] font-mono font-semibold shadow-xs">
            {(['IDR', 'SAR', 'USD'] as Currency[]).map((curr) => (
              <button
                key={curr}
                type="button"
                onClick={() => onCurrencyChange(curr)}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer ${
                  currency === curr
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200 font-bold'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                {curr === 'IDR' ? 'Rp' : curr === 'SAR' ? 'SAR' : '$'}
              </button>
            ))}
          </div>

          {/* Language Toggle */}
          <div className="flex bg-zinc-100/90 p-0.5 rounded-lg border border-zinc-200/90 text-[11px] font-mono font-semibold shadow-xs">
            {(['id', 'ar', 'en'] as Lang[]).map((l) => (
              <button
                key={l}
                type="button"
                onClick={() => onLangChange(l)}
                className={`px-2 py-1 rounded-md transition-all cursor-pointer uppercase ${
                  lang === l
                    ? 'bg-zinc-950 text-white shadow-xs font-bold'
                    : 'text-zinc-500 hover:text-zinc-950'
                }`}
              >
                {l}
              </button>
            ))}
          </div>

          {/* Admin Login Magnetic Button */}
          <div className="hidden sm:block">
            <MagneticButton
              variant="secondary"
              href="/admin/login"
              icon={<ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />}
              className="py-1.5! px-3.5! text-xs!"
            >
              {t.admin}
            </MagneticButton>
          </div>
        </div>
      </div>
    </header>
  );
}
