"use client";

import React, { useState, useEffect } from 'react';
import { Cafe } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { Lock, Delete, ShieldAlert, KeyRound, Coffee, Store } from 'lucide-react';
import { audioEngine } from '@/lib/audio-engine';

interface CashierPinLockProps {
  cafe: Cafe;
  onUnlock: () => void;
}

export function CashierPinLock({ cafe, onUnlock }: CashierPinLockProps) {
  const { lang, isRtl } = useI18n();
  const [pin, setPin] = useState<string>('');
  const [isError, setIsError] = useState<boolean>(false);

  const expectedPin = cafe.cashier_pin || '1234';

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
    if (candidatePin === expectedPin) {
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
    <div className="min-h-screen bg-[#070a13] text-zinc-100 flex flex-col items-center justify-center p-4 selection:bg-amber-500 selection:text-zinc-950 font-sans">
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

        {/* 4 PIN Dots Indicator */}
        <div
          className={`flex gap-4 mb-8 transition-transform ${
            isError ? 'animate-buzz' : ''
          }`}
        >
          {Array.from({ length: 4 }).map((_, i) => {
            const isFilled = i < pin.length;
            return (
              <div
                key={i}
                className={`w-4 h-4 rounded-full transition-all duration-200 ${
                  isError
                    ? 'bg-red-500 shadow-[0_0_12px_#ef4444] scale-110'
                    : isFilled
                    ? 'bg-amber-400 shadow-[0_0_12px_#f59e0b] scale-125'
                    : 'bg-zinc-800 border border-zinc-700/60'
                }`}
              />
            );
          })}
        </div>

        {/* Numeric Touch Keypad (Numpad) */}
        <div className="grid grid-cols-3 gap-3 w-full max-w-[260px] select-none">
          {['1', '2', '3', '4', '5', '6', '7', '8', '9'].map((digit) => (
            <button
              key={digit}
              onClick={() => handleKeyPress(digit)}
              className="h-14 rounded-2xl bg-[#080c16] hover:bg-zinc-800 border border-zinc-800/80 text-white font-mono text-xl font-black shadow-md hover:border-amber-500/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
            >
              {digit}
            </button>
          ))}

          {/* Empty spacer / clear */}
          <button
            onClick={() => setPin('')}
            className="h-14 rounded-2xl bg-transparent text-zinc-500 hover:text-zinc-300 text-xs font-bold transition-colors flex items-center justify-center cursor-pointer"
          >
            Clear
          </button>

          {/* 0 */}
          <button
            onClick={() => handleKeyPress('0')}
            className="h-14 rounded-2xl bg-[#080c16] hover:bg-zinc-800 border border-zinc-800/80 text-white font-mono text-xl font-black shadow-md hover:border-amber-500/40 active:scale-95 transition-all flex items-center justify-center cursor-pointer"
          >
            0
          </button>

          {/* Backspace Delete */}
          <button
            onClick={handleDelete}
            className="h-14 rounded-2xl bg-[#080c16] hover:bg-zinc-800 border border-zinc-800/80 text-zinc-400 hover:text-white transition-all flex items-center justify-center active:scale-95 cursor-pointer"
            title="Delete"
          >
            <Delete className="w-5 h-5" />
          </button>
        </div>

        {/* Default PIN Hint for testing */}
        <div className="mt-6 pt-4 border-t border-zinc-800/80 w-full flex items-center justify-center gap-1.5 text-[11px] text-zinc-500 font-medium">
          <KeyRound className="w-3.5 h-3.5 text-amber-500/70" />
          <span>PIN Default: <strong className="text-zinc-300 font-mono">1234</strong></span>
        </div>
      </div>
    </div>
  );
}
