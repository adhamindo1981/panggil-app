"use client";

import React, { useEffect } from 'react';
import { Cafe, Order } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { audioEngine } from '@/lib/audio-engine';
import { vibrationEngine } from '@/lib/vibration-engine';
import { speechEngine } from '@/lib/speech-engine';
import { Star, X, MapPin, ExternalLink, ThumbsUp, Coffee } from 'lucide-react';

interface GoogleReviewModalProps {
  isOpen: boolean;
  onClose: () => void;
  cafe: Cafe;
  order: Order;
}

export function GoogleReviewModal({ isOpen, onClose, cafe, order }: GoogleReviewModalProps) {
  const { lang, isRtl } = useI18n();

  // Silence all audio, buzzer alarms, and vibrations whenever the review modal is displayed
  useEffect(() => {
    if (isOpen) {
      audioEngine.stopAlarmLoop();
      vibrationEngine.stop();
      speechEngine.stop();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const cleanName = (cafe.name || '').split('/')[0].trim();
  const googleMapsUrl =
    cafe.google_maps_url ||
    `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(cleanName || cafe.name)}`;

  const titles = {
    id: 'Bagaimana Pengalaman Anda?',
    ar: 'كيف كانت تجربتك اليوم؟',
    en: 'How Was Your Experience?',
  };

  const descriptions = {
    id: `Terima kasih telah berkunjung ke ${cafe.name}. Ulasan bintang 5 Anda di Google Maps sangat berarti untuk mendukung barista dan staf kami!`,
    ar: `شكراً لزيارتك لـ ${cafe.name}. رأيك وتقييمك بـ 5 نجوم على خرائط Google يدعم فريق العمل ويسعدنا دائماً!`,
    en: `Thank you for visiting ${cafe.name}. Your 5-star review on Google Maps means the world to our baristas and kitchen team!`,
  };

  const ctaLabels = {
    id: 'Beri Bintang 5 di Google Maps',
    ar: 'تقييم 5 نجوم على خرائط Google',
    en: 'Leave 5 Stars on Google Maps',
  };

  const closeLabels = {
    id: 'Mungkin Nanti',
    ar: 'لاحقاً',
    en: 'Maybe Later',
  };

  const handleReviewClick = () => {
    // 1. Forcefully kill any lingering buzzer sound & vibration immediately
    audioEngine.stopAlarmLoop();
    vibrationEngine.stop();
    speechEngine.stop();

    // 2. Allow native navigation to Google Maps to complete smoothly without abrupt DOM destruction
    setTimeout(() => {
      onClose();
    }, 600);
  };

  const handleClose = () => {
    audioEngine.stopAlarmLoop();
    vibrationEngine.stop();
    speechEngine.stop();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-sm bg-[#0d121e] border border-amber-500/40 rounded-3xl p-6 sm:p-7 shadow-2xl shadow-amber-500/10 text-center overflow-hidden">
        {/* Glow backdrop */}
        <div className="absolute -top-16 -right-16 w-36 h-36 bg-amber-500/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-16 -left-16 w-36 h-36 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

        {/* Close Button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 p-1.5 text-zinc-400 hover:text-white bg-zinc-800/80 rounded-xl transition-colors cursor-pointer"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header Icon */}
        <div className="mx-auto w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-500 to-amber-300 text-zinc-950 flex items-center justify-center shadow-xl shadow-amber-500/30 mb-4">
          <Star className="w-8 h-8 fill-zinc-950 stroke-zinc-950" />
        </div>

        {/* 5 Stars Rating Indicator */}
        <div className="flex justify-center gap-1.5 mb-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Star
              key={i}
              className="w-5 h-5 fill-amber-400 text-amber-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)] animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
            />
          ))}
        </div>

        {/* Title & Description */}
        <h3 className="text-xl font-black text-white tracking-tight mb-2">
          {titles[lang]}
        </h3>
        <p className="text-xs text-zinc-300 leading-relaxed font-medium mb-6">
          {descriptions[lang]}
        </p>

        {/* Actions */}
        <div className="flex flex-col gap-2.5">
          <a
            href={googleMapsUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={handleReviewClick}
            className="w-full py-3.5 px-5 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-zinc-950 font-black text-xs rounded-2xl shadow-xl shadow-amber-500/30 flex items-center justify-center gap-2 transition-transform active:scale-98 cursor-pointer"
          >
            <MapPin className="w-4 h-4 fill-zinc-950" />
            <span>{ctaLabels[lang]}</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>

          <button
            onClick={handleClose}
            className="w-full py-2.5 px-4 text-xs font-semibold text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            {closeLabels[lang]}
          </button>
        </div>
      </div>
    </div>
  );
}
