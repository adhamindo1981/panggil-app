"use client";

import React, { useEffect, useState, useRef } from 'react';
import { Order, Cafe } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { audioEngine } from '@/lib/audio-engine';
import { vibrationEngine } from '@/lib/vibration-engine';
import { speechEngine } from '@/lib/speech-engine';
import { wakeLockManager } from '@/lib/wake-lock';
import { triggerLocalNotification } from '@/lib/push-notifications';
import confetti from 'canvas-confetti';
import {
  Volume2,
  VolumeX,
  Smartphone,
  CheckCircle2,
  Receipt,
  Clock,
  Sparkles,
  AlertTriangle,
  RotateCw,
  BellRing,
  Coffee,
} from 'lucide-react';
import { InvoiceModal } from '../invoice/InvoiceModal';

interface CoasterPagerProps {
  order: Order;
  cafe: Cafe;
  onRefresh?: () => void;
  onAcknowledgeReady?: () => void;
}

export function CoasterPager({ order, cafe, onRefresh, onAcknowledgeReady }: CoasterPagerProps) {
  const { t, lang, formatCurrency, isRtl } = useI18n();
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isMuted, setIsMuted] = useState<boolean>(false);
  const [soundEnabled, setSoundEnabled] = useState<boolean>(false);
  const [wakeLockActive, setWakeLockActive] = useState<boolean>(false);
  const [showInvoice, setShowInvoice] = useState<boolean>(false);
  const hasTriggeredReadyAlert = useRef<boolean>(false);
  const lastBuzzedAtRef = useRef<number | undefined>(order.buzzed_at);

  // Status flags
  const isPending = order.status === 'pending';
  const isReady = order.status === 'ready';
  const isCompleted = order.status === 'completed';

  // 1. Live Elapsed Waiting Timer
  useEffect(() => {
    const calculateElapsed = () => {
      const createdTime = new Date(order.created_at).getTime();
      const now = Date.now();
      const diffSec = Math.max(0, Math.floor((now - createdTime) / 1000));
      setElapsedSeconds(diffSec);
    };

    calculateElapsed();
    const timer = setInterval(calculateElapsed, 1000);
    return () => clearInterval(timer);
  }, [order.created_at]);

  // Format Elapsed Time MM:SS
  const formatTime = (totalSec: number) => {
    const mins = Math.floor(totalSec / 60);
    const secs = totalSec % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // 2. Manage Screen Wake Lock
  useEffect(() => {
    if (wakeLockManager.isSupported() && !isCompleted) {
      wakeLockManager.requestWakeLock().then((active) => {
        setWakeLockActive(active);
      });
    }

    return () => {
      wakeLockManager.releaseWakeLock();
    };
  }, [isCompleted]);

  // 3. React to Order Status Change & Realtime Cashier Buzz (Sub-second Alarm, Buzzer, Vibration & TTS)
  useEffect(() => {
    // If cashier triggers re-buzz or order newly ready
    const hasNewBuzz = Boolean(order.buzzed_at && order.buzzed_at !== lastBuzzedAtRef.current);
    if (hasNewBuzz) {
      lastBuzzedAtRef.current = order.buzzed_at;
      setIsMuted(false);
      hasTriggeredReadyAlert.current = true;
      audioEngine.startAlarmLoop(750);
      vibrationEngine.startRepeatingVibration([500, 200, 500], 1800);
      speechEngine.announceOrderReady(order.order_number, order.customer_name, lang);
      triggerLocalNotification(order.order_number, order.customer_name);
      return;
    }

    if (isReady && !hasTriggeredReadyAlert.current) {
      hasTriggeredReadyAlert.current = true;

      // Start Commercial Pager Alarm Loop if sound allowed
      if (!isMuted) {
        audioEngine.startAlarmLoop(750);
      }

      // Start Vibration Loop [500, 200, 500]
      vibrationEngine.startRepeatingVibration([500, 200, 500], 1800);

      // Voice Announcement via Web Speech API
      speechEngine.announceOrderReady(order.order_number, order.customer_name, lang);

      // Push Notification trigger
      triggerLocalNotification(order.order_number, order.customer_name);
    } else if (!isReady) {
      hasTriggeredReadyAlert.current = false;
      audioEngine.stopAlarmLoop();
      vibrationEngine.stop();
    }

    if (isCompleted) {
      audioEngine.stopAlarmLoop();
      vibrationEngine.stop();
      try {
        confetti({
          particleCount: 140,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#f59e0b', '#10b981', '#ef4444', '#3b82f6'],
        });
      } catch (e) {
        console.warn('Confetti error:', e);
      }
    }

    return () => {
      audioEngine.stopAlarmLoop();
      vibrationEngine.stop();
    };
  }, [isReady, isCompleted, isMuted, order.order_number, order.customer_name, order.buzzed_at, lang]);

  // User interactions
  const handleEnableAudio = async () => {
    setSoundEnabled(true);
    setIsMuted(false);
    await audioEngine.unlockAudioAndKeepAlive();
    // Test beep so user immediately verifies audio volume on their phone
    audioEngine.playTestPagerBeep();
    if (isReady) {
      audioEngine.startAlarmLoop(750);
      speechEngine.announceOrderReady(order.order_number, order.customer_name, lang);
    }
  };

  const handleMuteAlarm = () => {
    setIsMuted(true);
    audioEngine.stopAlarmLoop();
    vibrationEngine.stop();
    speechEngine.stop();
    onAcknowledgeReady?.();
  };

  const toggleWakeLock = async () => {
    if (wakeLockActive) {
      await wakeLockManager.releaseWakeLock();
      setWakeLockActive(false);
    } else {
      const active = await wakeLockManager.requestWakeLock();
      setWakeLockActive(active);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto flex flex-col items-center select-none py-4 px-2">
      {/* Top Banner Status Indicator */}
      <div className="w-full mb-6">
        {isReady && (
          <div className="w-full p-4 sm:p-5 rounded-3xl bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 text-white shadow-2xl shadow-red-500/30 animate-bounce flex items-center justify-between border border-red-400/40">
            <div className="flex items-center gap-3.5">
              <span className="relative flex h-5 w-5 shrink-0">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-90"></span>
                <span className="relative inline-flex rounded-full h-5 w-5 bg-white"></span>
              </span>
              <div>
                <p className="font-black text-sm uppercase tracking-wider">{t.customer.readyBanner}</p>
                <p className="text-xs text-white/90 font-medium">{t.customer.buzzingAlert}</p>
              </div>
            </div>
            <button
              onClick={handleMuteAlarm}
              className="p-2.5 bg-black/40 hover:bg-black/60 rounded-2xl text-white backdrop-blur-md transition-transform active:scale-95 shrink-0"
              title={t.customer.muteAlarm}
            >
              <VolumeX className="w-5 h-5" />
            </button>
          </div>
        )}

        {isCompleted && (
          <div className="w-full p-5 rounded-3xl bg-emerald-950/70 border border-emerald-500/50 text-emerald-200 shadow-2xl flex items-center gap-3.5 backdrop-blur-xl">
            <div className="p-2.5 bg-emerald-500/20 text-emerald-400 rounded-2xl shrink-0">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <div>
              <p className="font-extrabold text-sm text-white">{t.customer.thankYou}</p>
              <p className="text-xs text-emerald-300/80 font-medium">{t.customer.orderCompletedMessage}</p>
            </div>
          </div>
        )}
      </div>

      {/* ========================================================= */}
      {/* SKEUOMORPHIC HARDWARE COASTER PAGER DEVICE */}
      {/* ========================================================= */}
      <div className="relative group my-3">
        {/* Outer Luminous Atmospheric Glow */}
        <div
          className={`absolute -inset-6 rounded-full blur-3xl transition-all duration-700 pointer-events-none ${
            isReady
              ? 'bg-red-500/50 animate-pulse opacity-100 scale-110'
              : isPending
              ? 'bg-amber-500/20 opacity-70 animate-pulse'
              : 'bg-emerald-500/20 opacity-60'
          }`}
        />

        {/* Heavy Rugged Outer Coaster Housing (Matte Rubber Bezel) */}
        <div
          className={`relative w-80 h-80 sm:w-92 sm:h-92 rounded-full p-4 shadow-2xl transition-all duration-500 ${
            isReady
              ? 'bg-gradient-to-b from-zinc-800 via-[#1a0e14] to-red-950 border-4 border-red-500 shadow-[0_0_50px_rgba(239,68,68,0.5)] animate-buzz'
              : isCompleted
              ? 'bg-gradient-to-b from-zinc-800 via-[#0e1a14] to-emerald-950 border-4 border-emerald-500/70 shadow-[0_0_40px_rgba(16,185,129,0.3)]'
              : 'bg-gradient-to-b from-[#1c2333] via-[#0d121e] to-[#070a13] border-4 border-zinc-700/80 shadow-[0_25px_60px_rgba(0,0,0,0.8)]'
          }`}
        >
          {/* Circular 12 Perimeter LED Diodes */}
          <div className="absolute inset-0 rounded-full pointer-events-none">
            {Array.from({ length: 12 }).map((_, i) => {
              const rotation = i * 30;
              return (
                <div
                  key={i}
                  className="absolute top-1/2 left-1/2 w-3.5 h-3.5 -mt-1.75 -ml-1.75"
                  style={{
                    transform: `rotate(${rotation}deg) translate(0, -142px) sm:translate(0, -164px)`,
                  }}
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full transition-all duration-200 ${
                      isReady
                        ? i % 2 === 0
                          ? 'bg-red-500 shadow-[0_0_16px_#ef4444] scale-125'
                          : 'bg-amber-400 shadow-[0_0_16px_#f59e0b] scale-110'
                        : isCompleted
                        ? 'bg-emerald-400 shadow-[0_0_12px_#10b981]'
                        : i === Math.floor((elapsedSeconds % 12))
                        ? 'bg-amber-400 shadow-[0_0_14px_#f59e0b] scale-115'
                        : 'bg-zinc-800 border border-zinc-700/50 opacity-40'
                    }`}
                  />
                </div>
              );
            })}
          </div>

          {/* Inner Recessed Pager Faceplate */}
          <div className="w-full h-full rounded-full bg-[#080c16] border border-zinc-800/90 shadow-inner flex flex-col items-center justify-center relative overflow-hidden p-6">
            {/* Subtle Carbon-Fiber Pattern / Radial Sheen */}
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_30%,rgba(255,255,255,0.07),transparent_70%)]" />

            {/* Brand Logo & Name */}
            <div className="text-center z-10 mb-3">
              <span className="text-[11px] font-black tracking-widest text-amber-500 uppercase block">
                {cafe.name.split('/')[0]}
              </span>
              <span className="text-[9px] text-zinc-500 font-mono tracking-widest uppercase font-semibold">
                SMART DIGITAL PAGER
              </span>
            </div>

            {/* Central High-Contrast Digital LED Matrix Screen */}
            <div
              className={`w-full max-w-[220px] py-4 px-5 rounded-2xl border flex flex-col items-center justify-center transition-all duration-300 z-10 ${
                isReady
                  ? 'bg-red-950/80 border-red-500 shadow-[0_0_30px_rgba(239,68,68,0.4)] animate-pulse'
                  : isCompleted
                  ? 'bg-emerald-950/70 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]'
                  : 'bg-[#0a0f1d] border-zinc-800 shadow-inner'
              }`}
            >
              <span className="text-[10px] uppercase tracking-wider font-extrabold text-zinc-400 mb-1">
                {t.customer.yourOrderNumber}
              </span>
              <div
                className={`font-mono text-4xl sm:text-5xl font-black tracking-widest ${
                  isReady
                    ? 'text-red-400 drop-shadow-[0_0_15px_rgba(248,113,113,0.8)]'
                    : isCompleted
                    ? 'text-emerald-400 drop-shadow-[0_0_12px_rgba(52,211,153,0.6)]'
                    : 'text-amber-400 drop-shadow-[0_0_10px_rgba(251,191,36,0.4)]'
                }`}
              >
                {order.order_number}
              </div>
              {order.customer_name && (
                <span className="text-xs font-bold text-zinc-200 mt-1 truncate max-w-full">
                  {order.customer_name}
                </span>
              )}
            </div>

            {/* Status & Live Clock on Pager */}
            <div className="text-center mt-3.5 z-10 flex flex-col items-center">
              {isPending && (
                <div className="flex items-center gap-2 px-3 py-1 bg-zinc-900/80 border border-zinc-800 rounded-full text-zinc-300 text-xs font-mono font-bold shadow-inner">
                  <Clock className="w-3.5 h-3.5 text-amber-500 animate-spin" />
                  <span>{formatTime(elapsedSeconds)}</span>
                </div>
              )}

              {isReady && (
                <span className="text-xs font-black text-red-400 animate-bounce tracking-widest uppercase mt-1">
                  *** READY FOR PICKUP ***
                </span>
              )}

              {isCompleted && (
                <span className="text-xs font-bold text-emerald-400 tracking-wider uppercase mt-1">
                  ✓ COMPLETED
                </span>
              )}
            </div>

            {/* Coaster Speaker Grille */}
            <div className="flex gap-2 mt-4 opacity-40">
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
              <div className="w-1.5 h-1.5 rounded-full bg-zinc-400" />
            </div>
          </div>
        </div>
      </div>

      {/* ========================================================= */}
      {/* INTERACTIVE CONTROLS & STATUS CARDS */}
      {/* ========================================================= */}
      <div className="w-full mt-7 space-y-4">
        {/* Main Action Button */}
        {isReady ? (
          <button
            onClick={handleMuteAlarm}
            className="w-full py-4 px-6 rounded-2xl bg-gradient-to-r from-red-600 via-rose-500 to-amber-500 hover:from-red-500 hover:to-amber-400 text-white font-black text-base shadow-2xl shadow-red-500/40 transform active:scale-98 transition-all flex items-center justify-center gap-3 animate-pulse"
          >
            <VolumeX className="w-5 h-5" />
            <span>{t.customer.imComing}</span>
          </button>
        ) : isPending ? (
          <div className="p-5 rounded-3xl bg-[#0d121e]/90 border border-zinc-800 text-center space-y-3 shadow-xl backdrop-blur-xl">
            <p className="text-xs sm:text-sm text-zinc-300 leading-relaxed font-medium">
              {t.customer.waitingMessage}
            </p>
            {!soundEnabled && (
              <button
                onClick={handleEnableAudio}
                className="mt-1 inline-flex items-center gap-2 px-5 py-2.5 text-xs font-extrabold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 rounded-2xl transition-all shadow-md active:scale-95"
              >
                <Volume2 className="w-4 h-4" />
                <span>{t.customer.enableSound}</span>
              </button>
            )}
          </div>
        ) : null}

        {/* Hardware Sensors Status Badges */}
        <div className="grid grid-cols-2 gap-3 text-xs">
          {/* Screen Wake Lock */}
          <button
            onClick={toggleWakeLock}
            className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
              wakeLockActive
                ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 shadow-md'
                : 'bg-[#0d121e] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <Smartphone className="w-4 h-4 shrink-0 text-amber-500" />
            <div className="text-left">
              <p className="font-bold text-xs">{t.customer.keepScreenOn}</p>
              <p className="text-[10px] opacity-75 font-semibold">
                {wakeLockActive ? 'Aktif / نشط' : 'Nonaktif / معطل'}
              </p>
            </div>
          </button>

          {/* Audio Beeper Status */}
          <button
            onClick={handleEnableAudio}
            className={`p-3.5 rounded-2xl border flex items-center gap-3 transition-all ${
              soundEnabled && !isMuted
                ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300 shadow-md'
                : 'bg-[#0d121e] border-zinc-800 text-zinc-400 hover:border-zinc-700'
            }`}
          >
            <Volume2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <div className="text-left">
              <p className="font-bold text-xs">{t.customer.soundEnabled}</p>
              <p className="text-[10px] opacity-75 font-semibold">
                {soundEnabled && !isMuted ? 'Buzzer On' : 'Tap to Test'}
              </p>
            </div>
          </button>
        </div>

        {/* Receipt & Order Info Toggle */}
        <div className="flex gap-2.5">
          <button
            onClick={() => setShowInvoice(true)}
            className="flex-1 py-3.5 px-4 rounded-2xl bg-[#0d121e] hover:bg-zinc-800 border border-zinc-800 text-zinc-200 text-xs font-bold flex items-center justify-center gap-2 transition-all shadow-md active:scale-98"
          >
            <Receipt className="w-4 h-4 text-amber-500" />
            <span>{t.customer.viewReceipt}</span>
          </button>

          {onRefresh && (
            <button
              onClick={onRefresh}
              className="p-3.5 rounded-2xl bg-[#0d121e] hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white transition-all shadow-md"
              title="تحديث الحالة"
            >
              <RotateCw className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Invoice Modal */}
      <InvoiceModal
        isOpen={showInvoice}
        onClose={() => setShowInvoice(false)}
        order={order}
        cafe={cafe}
      />
    </div>
  );
}
