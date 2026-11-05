"use client";

import React, { useState, useEffect, useMemo } from 'react';
import { Cafe, Order } from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { CoasterPager } from './CoasterPager';
import { GoogleReviewModal } from './GoogleReviewModal';
import { LanguageSwitcher } from '../common/LanguageSwitcher';
import { audioEngine } from '@/lib/audio-engine';
import { vibrationEngine } from '@/lib/vibration-engine';
import { speechEngine } from '@/lib/speech-engine';
import { wakeLockManager } from '@/lib/wake-lock';
import { useI18n } from '@/lib/i18n/context';
import { getPlanFeatures, getCustomBrandingStyle } from '@/lib/feature-gates';
import { BellRing, Radio, Volume2, ShieldCheck, Check, Sparkles } from 'lucide-react';

interface LivePagerViewProps {
  initialCafe: Cafe;
  initialOrder: Order;
}

export function LivePagerView({ initialCafe, initialOrder }: LivePagerViewProps) {
  const { lang, isRtl } = useI18n();
  const [cafe] = useState<Cafe>(initialCafe);
  const [order, setOrder] = useState<Order>(initialOrder);
  const [isAudioUnlocked, setIsAudioUnlocked] = useState<boolean>(false);
  const [showReviewModal, setShowReviewModal] = useState<boolean>(false);
  const [hasDismissedReview, setHasDismissedReview] = useState<boolean>(false);

  const planFeatures = useMemo(() => getPlanFeatures(cafe.subscription_tier), [cafe.subscription_tier]);
  // Google Review modal is available on Bronze, Silver, and Gold tiers
  const canShowReview = planFeatures.canUseGoogleReview;
  const brandStyle = useMemo(() => getCustomBrandingStyle(cafe), [cafe]);

  // Check initial audio state
  useEffect(() => {
    if (audioEngine.getIsUnlocked()) {
      setIsAudioUnlocked(true);
    }
  }, []);

  // Subscribe to realtime order updates
  useEffect(() => {
    const unsubscribe = dataService.subscribeToOrder(order.id, (updatedOrder, wasBuzzed) => {
      setOrder(updatedOrder);

      // When order is completed, stop all alarms and trigger Review Modal once
      if (updatedOrder.status === 'completed') {
        audioEngine.stopAlarmLoop();
        vibrationEngine.stop();
        speechEngine.stop();
        if (canShowReview && !hasDismissedReview) {
          setTimeout(() => setShowReviewModal(true), 1000);
        }
      }
    });

    return () => unsubscribe();
  }, [order.id, canShowReview, hasDismissedReview]);

  // Guaranteed Trigger: Show Review Modal once whenever order status becomes completed
  useEffect(() => {
    if (order.status === 'completed') {
      audioEngine.stopAlarmLoop();
      vibrationEngine.stop();
      speechEngine.stop();
      if (canShowReview && !hasDismissedReview) {
        const timer = setTimeout(() => setShowReviewModal(true), 1000);
        return () => clearTimeout(timer);
      }
    }
  }, [order.status, canShowReview, hasDismissedReview]);

  const handleRefresh = async () => {
    const fresh = await dataService.getOrderById(order.id);
    if (fresh) {
      setOrder(fresh);
      if (fresh.status === 'completed') {
        audioEngine.stopAlarmLoop();
        vibrationEngine.stop();
        speechEngine.stop();
        if (canShowReview && !hasDismissedReview) {
          setShowReviewModal(true);
        }
      }
    }
  };

  // Interactive Unlock Gate Handler
  const handleUnlockGate = async () => {
    const unlocked = await audioEngine.unlockAudioAndKeepAlive();
    await wakeLockManager.requestWakeLock();
    setIsAudioUnlocked(unlocked);
    // Instant test alert so user confirms phone speaker volume is unmuted
    audioEngine.playTestPagerBeep();
  };

  const unlockBannerText = {
    id: 'Ketuk untuk mengaktifkan bel suara keras & layar aktif (Pastikan HP tidak mode hening)',
    ar: 'اضغط هنا لتفعيل صفارة التنبيه وقفل الشاشة (تأكد من إلغاء وضع الصامت)',
    en: 'Tap to activate loud pager alarm & wake lock (Ensure phone is unmuted)',
  };

  const readyAlertBannerText = {
    id: '🚨 PESANAN SIAP! Ketuk di sini untuk membunyikan alarm bel!',
    ar: '🚨 طلبك جاهز الآن! اضغط هنا لإطلاق صفارة الإنذار والاستلام!',
    en: '🚨 ORDER IS READY! Tap here to sound the pager alarm!',
  };

  const unlockedConfirmedText = {
    id: 'Bel Suara Keras & Layar Aktif',
    ar: 'صفارة التنبيه وقفل الشاشة مفعلان بنجاح',
    en: 'Loud Pager Alarm & Wake Lock Active',
  };

  return (
    <div
      className="min-h-screen bg-[#070a13] text-zinc-100 flex flex-col justify-between selection:bg-amber-500 selection:text-zinc-950 font-sans"
      style={brandStyle}
    >
      {/* Top Header */}
      <header className="px-4 py-3.5 bg-[#0d121e]/85 border-b border-zinc-800/80 backdrop-blur-xl flex items-center justify-between shadow-xl">
        <div className="flex items-center gap-2.5">
          {planFeatures.canUseCustomBranding && cafe.custom_branding?.logo_url ? (
            <div className="w-8 h-8 rounded-xl overflow-hidden border border-amber-500/40 shadow-sm shrink-0 bg-zinc-900">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={cafe.custom_branding.logo_url} alt={cafe.name} className="w-full h-full object-cover" />
            </div>
          ) : (
            <div className="p-2 bg-gradient-to-tr from-amber-600 to-amber-400 text-zinc-950 rounded-xl shadow-md">
              <BellRing className="w-4 h-4" />
            </div>
          )}
          <div>
            <h1 className="text-xs font-black text-white">{cafe.name}</h1>
            <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-bold">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              <span>Live Synced</span>
            </div>
          </div>
        </div>

        <LanguageSwitcher compact />
      </header>

      {/* PART 1: Interactive Unlock Gate Banner (if not yet unlocked by user gesture) */}
      {!isAudioUnlocked ? (
        <div className={`w-full px-4 py-3 shadow-xl ${
          order.status === 'ready'
            ? 'bg-gradient-to-r from-red-600 via-rose-600 to-amber-500 animate-bounce'
            : 'bg-gradient-to-r from-amber-500 via-orange-500 to-amber-600'
        } text-zinc-950`}>
          <button
            onClick={handleUnlockGate}
            className="w-full max-w-md mx-auto flex items-center justify-center gap-2.5 text-xs sm:text-sm font-black tracking-wide cursor-pointer active:scale-98 transition-transform"
          >
            <Volume2 className="w-5 h-5 shrink-0 animate-bounce" />
            <span className="text-center">
              {order.status === 'ready' ? readyAlertBannerText[lang] : unlockBannerText[lang]}
            </span>
          </button>
        </div>
      ) : (
        <div className="w-full bg-emerald-950/60 border-b border-emerald-500/30 px-4 py-1.5 text-emerald-300 text-[11px] font-bold text-center flex items-center justify-center gap-1.5">
          <Check className="w-3.5 h-3.5 text-emerald-400" />
          <span>{unlockedConfirmedText[lang]}</span>
        </div>
      )}

      {/* Main Pager Area */}
      <main className="flex-1 flex flex-col items-center justify-center p-4 sm:p-6 my-auto">
        <CoasterPager
          order={order}
          cafe={cafe}
          onRefresh={handleRefresh}
          onRateExperience={canShowReview ? () => {
            setHasDismissedReview(false);
            setShowReviewModal(true);
          } : undefined}
          onAcknowledgeReady={() => {
            // Customer acknowledges pickup alarm; silence audio
            audioEngine.stopAlarmLoop();
            vibrationEngine.stop();
            speechEngine.stop();
          }}
        />
      </main>

      {/* Footer Branding */}
      <footer className="py-4 text-center text-[10px] text-zinc-500 border-t border-zinc-900 bg-[#070a13]">
        {planFeatures.canUseCustomBranding && cafe.custom_branding?.hide_powered_by ? (
          <p className="font-semibold text-zinc-500">{cafe.name} — Coaster Pager Service</p>
        ) : (
          <p className="font-semibold text-zinc-400">Panggil / نداء — Zero-Hardware Coaster Pager Platform</p>
        )}
      </footer>

      {/* Google Review Conversion Modal (Feature Gated: Bronze / Silver / Gold) */}
      {canShowReview && (
        <GoogleReviewModal
          isOpen={showReviewModal}
          onClose={() => {
            setShowReviewModal(false);
            setHasDismissedReview(true);
          }}
          cafe={cafe}
          order={order}
        />
      )}
    </div>
  );
}
