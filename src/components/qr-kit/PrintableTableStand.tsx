"use client";

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Cafe } from '@/types/database';
import { Printer, ArrowLeft, Download, Sparkles, QrCode, Smartphone, Bell, Coffee } from 'lucide-react';
import Link from 'next/link';

interface PrintableTableStandProps {
  cafe: Cafe;
}

export function PrintableTableStand({ cafe }: PrintableTableStandProps) {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');

  const targetUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/c/${cafe.slug}/menu`
    : `https://panggil.adhamnur.site/c/${cafe.slug}/menu`;

  useEffect(() => {
    QRCode.toDataURL(targetUrl, {
      width: 480,
      margin: 1.5,
      color: {
        dark: '#070a13',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then(setQrDataUrl)
      .catch(console.error);
  }, [targetUrl]);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-[#070a13] text-zinc-100 p-4 sm:p-8 flex flex-col items-center">
      {/* Top Action Toolbar (Hidden when printing) */}
      <div className="w-full max-w-xl mb-6 flex items-center justify-between no-print bg-[#0d121e] border border-zinc-800 p-4 rounded-2xl shadow-xl">
        <Link
          href={`/c/${cafe.slug}/cashier`}
          className="flex items-center gap-2 text-xs font-bold text-zinc-300 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>العودة للوحة الكاشير</span>
        </Link>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-5 py-2.5 bg-gradient-to-r from-amber-500 to-amber-400 hover:from-amber-400 hover:to-amber-300 text-zinc-950 font-black text-xs rounded-xl shadow-lg shadow-amber-500/20 active:scale-95 transition-all cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>طباعة ستاند طاولة A6</span>
          </button>
        </div>
      </div>

      {/* ============================================================ */}
      {/* THE A6 ACRYLIC TABLE STAND CARD (105mm x 148mm)              */}
      {/* ============================================================ */}
      <div className="w-[105mm] h-[148mm] bg-[#090d18] text-zinc-100 rounded-3xl p-5 shadow-2xl border-2 border-amber-500/50 flex flex-col justify-between items-center text-center relative overflow-hidden select-none printable-stand-card">
        {/* Elegant Gold Accents */}
        <div className="absolute top-0 inset-x-0 h-1.5 bg-gradient-to-r from-amber-600 via-amber-400 to-amber-600" />
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-amber-500/15 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-12 -left-12 w-32 h-32 bg-amber-500/10 rounded-full blur-2xl pointer-events-none" />

        {/* Cafe Brand Header */}
        <div className="pt-2 z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 border border-amber-500/30 text-[9px] font-black text-amber-400 uppercase tracking-widest mb-1.5">
            <Coffee className="w-3 h-3" />
            <span>SMART ORDER & PAGER</span>
          </div>
          <h1 className="text-base font-black text-white tracking-tight uppercase line-clamp-1">
            {cafe.name}
          </h1>
          <p className="text-[9px] text-zinc-400 font-medium">
            Menu Digital & Pager Pintar • القائمة والبيجر الذكي
          </p>
        </div>

        {/* Central High-Resolution QR Code */}
        <div className="z-10 my-auto flex flex-col items-center">
          <div className="p-3 bg-white rounded-2xl shadow-2xl border-4 border-amber-500/40 relative group">
            {qrDataUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={qrDataUrl}
                alt="Table Stand QR Code"
                className="w-40 h-40 object-contain mx-auto"
              />
            ) : (
              <div className="w-40 h-40 bg-zinc-100 flex items-center justify-center text-zinc-400 text-xs">
                Generating QR...
              </div>
            )}
            <div className="absolute -bottom-2 inset-x-4 bg-zinc-950 text-amber-400 text-[8px] font-black uppercase py-0.5 rounded-full border border-amber-500/50 shadow-md">
              SCAN ME • امسح الرمز
            </div>
          </div>
        </div>

        {/* Trilingual 3-Step Instructions (AR / ID / EN) */}
        <div className="w-full z-10 space-y-1.5 pt-2 border-t border-zinc-800/80">
          {/* Indonesian (Default) */}
          <div className="flex items-center justify-between text-[9px] font-bold text-zinc-300 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/60">
            <span className="text-amber-400 font-black">ID</span>
            <span className="truncate">Pindai QR → Pilih Menu → Ponsel bergetar saat siap</span>
          </div>

          {/* Arabic (RTL) */}
          <div className="flex items-center justify-between text-[9px] font-bold text-zinc-200 bg-zinc-900/60 px-2.5 py-1 rounded-lg border border-zinc-800/60" dir="rtl">
            <span className="text-amber-400 font-black">عربي</span>
            <span className="truncate">امسح الرمز ← اطلب وجبتك ← سيهتز هاتفك فور جهوزيتها</span>
          </div>

          {/* English */}
          <div className="flex items-center justify-between text-[8.5px] font-medium text-zinc-400 bg-zinc-900/40 px-2.5 py-0.5 rounded-lg">
            <span className="text-amber-400 font-bold">EN</span>
            <span className="truncate">Scan QR → Order items → Phone buzzes when ready</span>
          </div>
        </div>

        {/* Footer Accent */}
        <div className="w-full pb-1 text-[7.5px] text-zinc-500 font-mono tracking-wider flex items-center justify-between z-10">
          <span>A6 STAND SIZE (105×148mm)</span>
          <span>POWERED BY PANGGIL</span>
        </div>
      </div>

      {/* Print Specific CSS */}
      <style jsx global>{`
        @media print {
          @page {
            size: A6 portrait;
            margin: 0;
          }
          body {
            background: white !important;
            padding: 0 !important;
            margin: 0 !important;
          }
          .no-print {
            display: none !important;
          }
          .printable-stand-card {
            width: 105mm !important;
            height: 148mm !important;
            box-shadow: none !important;
            border-radius: 0 !important;
            border: 1px solid #d4af37 !important;
            page-break-after: always;
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      `}</style>
    </div>
  );
}
