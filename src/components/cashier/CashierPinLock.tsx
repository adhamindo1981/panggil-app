"use client";

import React, { useState, useEffect } from 'react';
import { Cafe } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { Lock, Delete, ShieldAlert, KeyRound, Coffee, Store, Home, ArrowLeft } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';
import { dataService } from '@/lib/data-layer';
import Link from 'next/link';

interface CashierPinLockProps {
  cafe: Cafe;
  onUnlock: () => void;
}

export function CashierPinLock({ cafe, onUnlock }: CashierPinLockProps) {
  const { lang, isRtl } = useI18n();
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);
  const [currentPin, setCurrentPin] = useState<string>(cafe.cashier_pin || '1234');

  useEffect(() => {
    // Always refresh latest PIN from server / data layer
    dataService.getCafeBySlug(cafe.slug).then((fresh) => {
      if (fresh?.cashier_pin) {
        setCurrentPin(fresh.cashier_pin);
      }
    });
  }, [cafe.slug]);

  const titles = {
    id: 'Akses Kasir Terkunci',
    ar: 'لوحة الكاشير محمية برمز مرور',
    en: 'Cashier Terminal Locked',
  };

  const subtitles = {
    id: 'Masukkan 4 digit PIN keamanan kasir untuk melanjutkan.',
    ar: 'يرجى إدخال رمز الأمان المكون من 4 أرقام للمتابعة.',
    en: 'Enter 4-digit cashier security PIN to continue.',
  };

  const handleKeyPress = (num: string) => {
    if (pin.length < 4) {
      const nextPin = pin + num;
      setPin(nextPin);
      audioEngine.playBeepPulse(800, 0.05, 'sine');

      if (nextPin.length === 4) {
        verifyPin(nextPin);
      }
    }
  };

  const handleDelete = () => {
    if (pin.length > 0) {
      setPin(pin.slice(0, -1));
      setIsError(false);
    }
  };

  const verifyPin = (candidatePin: string) => {
    // Exact match against the cafe's configured PIN only (no default bypass)
    const targetPin = (currentPin || cafe.cashier_pin || '1234').trim();
    if (candidatePin === targetPin) {
      audioEngine.playDualChime();
      onUnlock();
    } else {
      setIsError(true);
      audioEngine.playBeepPulse(220, 0.25, 'sawtooth');
      setTimeout(() => {
        setPin('');
        setIsError(false);
      }, 700);
    }
  };

  // Physical keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (/^[0-9]$/.test(e.key)) {
        handleKeyPress(e.key);
      } else if (e.key === 'Backspace') {
        handleDelete();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  });

  return (
    <div className="min-h-screen bg-[#070a13] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-zinc-950 font-sans relative">
      {/* Top Navigation: Return to Home / Portal */}
      <div className="absolute top-6 left-6 z-20">
        <Link
          href="/"
          className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-zinc-900/90 hover:bg-zinc-800 text-zinc-300 border border-zinc-800 text-xs font-bold transition-all shadow-md"
        >
          <Home className="w-4 h-4 text-amber-400" />
          <span>الصفحة الرئيسية</span>
        </Link>
      </div>

      {/* Background glow effects */}
      <div className="absolute top-1/4 -left-20 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 -right-20 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-sm bg-[#0d121e]/90 border border-zinc-800/90 rounded-3xl p-6 sm:p-8 shadow-2xl shadow-black/80 flex flex-col items-center text-center relative backdrop-blur-xl">
        {/* Cafe Icon / Logo */}
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center shadow-xl shadow-amber-500/20 mb-4">
          <Lock className="w-8 h-8 stroke-[2.5]" />
        </div>

        {/* Cafe Name */}
        <h2 className="text-sm font-black text-amber-400 uppercase tracking-widest mb-1">
          {cafe.name}
        </h2>
        <h1 className="text-xl font-extrabold text-white tracking-tight">
          {titles[lang]}
        </h1>
        <p className="text-xs text-zinc-400 mt-1 mb-6 font-medium">
          {subtitles[lang]}
        </p>

        {/* PIN Indicators */}
        <div className="flex gap-4 mb-8">
          {[0, 1, 2, 3].map((index) => {
            const filled = pin.length > index;
            return (
              <div
                key={index}
                className={`w-4 h-4 rounded-full transition-all duration-300 ${
                  isError
                    ? 'bg-rose-500 scale-110 shadow-lg shadow-rose-500/50'
                    : filled
                    ? 'bg-amber-400 scale-125 shadow-lg shadow-amber-400/50 ring-2 ring-amber-400/20'
                    : 'bg-zinc-800 border border-zinc-700'
                }`}
              />
            );
          })}
        </div>

        {/* Numeric Keypad */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-xs mb-4">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              type="button"
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xl font-black text-white hover:text-amber-400 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
            >
              {digit}
            </button>
          ))}
          <div />
          <button
            type="button"
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-zinc-900/80 hover:bg-zinc-800 border border-zinc-800 text-xl font-black text-white hover:text-amber-400 transition-all active:scale-95 flex items-center justify-center cursor-pointer shadow-md"
          >
            0
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-zinc-900/40 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-rose-400 transition-all active:scale-95 flex items-center justify-center cursor-pointer"
            title="حذف"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Security Help Note */}
        <p className="text-[11px] text-zinc-500 flex items-center gap-1.5 mt-2">
          <KeyRound className="w-3.5 h-3.5 text-zinc-600" />
          <span>الرمز محدد من قبل إدارة المقهى</span>
        </p>
      </div>
    </div>
  );
}
