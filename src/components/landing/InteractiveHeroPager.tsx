'use client';

import React, { useState, useEffect } from 'react';
import { audioEngine } from '@/lib/audio-engine';
import {
  BellRing,
  Coffee,
  CheckCircle2,
  Clock,
  Volume2,
  VolumeX,
  RotateCcw,
  Sparkles,
  QrCode,
  Check,
} from 'lucide-react';

type Lang = 'id' | 'ar' | 'en';
type OrderStatus = 'preparing' | 'ready';

interface Props {
  initialLang?: Lang;
}

export function InteractiveHeroPager({ initialLang = 'id' }: Props) {
  const [lang, setLang] = useState<Lang>(initialLang);
  const [status, setStatus] = useState<OrderStatus>('preparing');
  const [isAudioActive, setIsAudioActive] = useState(false);

  const isRtl = lang === 'ar';

  const strings = {
    id: {
      tag: 'SIMULATOR TIKET DIGITAL',
      orderNumber: '#A-108',
      outletName: 'Kopi Kenangan · Grand Indonesia',
      items: '1x Es Kopi Susu Aren (Less Sugar) · 1x Butter Croissant',
      customer: 'Tamu: Meja 08',
      statusPreparing: 'Sedang Diproses',
      statusPreparingSub: 'Barista sedang meracik pesanan Anda. Silakan duduk santai.',
      statusReady: 'Pesanan Siap Diambil!',
      statusReadySub: 'Silakan menuju ke Counter Pengambilan 01 untuk mengambil pesanan Anda.',
      pickupPoint: 'Counter Pengambilan 01',
      btnMakeReady: 'Simulasikan: Pesanan Siap! (Bunyikan Pager)',
      btnMakePreparing: '↺ Kembalikan ke: Sedang Diproses',
      audioPlaying: 'Sirene Pager Berdering…',
      audioStopped: 'Hentikan Bunyi Sirene',
      testSound: 'Uji Audio Saja',
      liveNotice: 'Coba klik tombol di bawah untuk mengubah status pesanan secara instan:',
    },
    ar: {
      tag: 'محاكي التذكرة الرقمية الحية',
      orderNumber: '#A-108',
      outletName: 'مقهى روعة للقهوة المختصة · الفرع الرئيسي',
      items: '١x سبانش لاتيه بارد (سكر خفيف) · ١x كرواسون زبدة',
      customer: 'العميل: طاولة رقم ٠٨',
      statusPreparing: 'قيد التجهيز',
      statusPreparingSub: 'الباريستا يجهز طلبك بعناية فائقة. استرح وسنناديك فور الانتهاء.',
      statusReady: 'طلبك جاهز للاستلام!',
      statusReadySub: 'تفضل بالتوجه إلى نافذة التسليم الرئيسية رقم ٠١ لاستلام طلبك.',
      pickupPoint: 'نافذة التسليم رقم ٠١',
      btnMakeReady: 'محاكاة: الطلب جاهز! (إطلاق الرنين)',
      btnMakePreparing: '↺ إعادة الطلب إلى: قيد التجهيز',
      audioPlaying: 'صوت التنبيه ينطلق في الهاتف…',
      audioStopped: 'إيقاف صوت الرنين',
      testSound: 'اختبار الصوت فقط',
      liveNotice: 'انقر على الزر بالأسفل للتبديل الفوري بين حالتي الطلب وتجربة الرنين:',
    },
    en: {
      tag: 'LIVE DIGITAL PAGER SIMULATOR',
      orderNumber: '#A-108',
      outletName: 'Artisan Specialty Coffee · Main Outlet',
      items: '1x Iced Spanish Latte (Less Sugar) · 1x Butter Croissant',
      customer: 'Guest: Table 08',
      statusPreparing: 'In Preparation',
      statusPreparingSub: 'Baristas are hand-crafting your items. Please sit back and relax.',
      statusReady: 'Your Order is Ready for Pickup!',
      statusReadySub: 'Please proceed to Pickup Counter 01 to collect your order.',
      pickupPoint: 'Pickup Counter 01',
      btnMakeReady: 'Simulate: Order Ready! (Buzz Pager)',
      btnMakePreparing: '↺ Reset to: In Preparation',
      audioPlaying: 'Pager Siren is Chiming…',
      audioStopped: 'Stop Chime Sound',
      testSound: 'Test Sound Only',
      liveNotice: 'Click the button below to toggle live order status and experience real audio:',
    },
  };

  const t = strings[lang];

  // Trigger audio siren when order becomes ready
  const toggleOrderStatus = async () => {
    if (status === 'preparing') {
      setStatus('ready');
      setIsAudioActive(true);
      try {
        await audioEngine.unlockAudioAndKeepAlive();
        audioEngine.startAlarmLoop(750);
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          navigator.vibrate([300, 150, 300, 150, 300]);
        }
      } catch {}

      // Auto stop sound after 6 seconds to avoid annoying user
      setTimeout(() => {
        audioEngine.stopAlarmLoop();
        setIsAudioActive(false);
      }, 6000);
    } else {
      audioEngine.stopAlarmLoop();
      setIsAudioActive(false);
      setStatus('preparing');
    }
  };

  const handleStopAudioOnly = () => {
    audioEngine.stopAlarmLoop();
    setIsAudioActive(false);
  };

  // Cleanup audio on unmount
  useEffect(() => {
    return () => {
      audioEngine.stopAlarmLoop();
    };
  }, []);

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="w-full max-w-[390px] mx-auto flex flex-col items-center select-none"
    >
      {/* Quick Language Preview Tabs */}
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-zinc-100 border border-zinc-200 text-xs font-mono mb-3 shadow-xs">
        <span className="text-zinc-400 text-[10px] px-1 font-semibold uppercase">Lang:</span>
        {(['id', 'ar', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer font-bold ${
              lang === l
                ? 'bg-zinc-950 text-white shadow-xs'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-200/60'
            }`}
          >
            {l === 'id' ? 'ID · Bahasa' : l === 'ar' ? 'AR · العربية' : 'EN · English'}
          </button>
        ))}
      </div>

      {/* Smartphone Device Frame (Swiss Minimalist) */}
      <div
        className={`w-full bg-white rounded-[38px] p-3.5 border-2 transition-all duration-300 shadow-xl ${
          status === 'ready'
            ? 'border-emerald-600 ring-4 ring-emerald-600/15'
            : 'border-zinc-300'
        }`}
      >
        {/* Device Inner Display Screen */}
        <div className="bg-zinc-50 rounded-[28px] border border-zinc-200 p-5 flex flex-col justify-between min-h-[440px] text-center relative overflow-hidden">
          {/* Top Notch & Status Line */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3 px-1">
              <span>12:45</span>
              <div className="w-14 h-3 bg-zinc-200 rounded-full" />
              <span>5G · 100%</span>
            </div>

            {/* Micro Brand Pill */}
            <div className="flex items-center justify-center gap-1.5 pb-2.5 border-b border-zinc-200/80 mb-3">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/panggil-logo.jpg"
                alt="Panggil"
                className="w-4 h-4 rounded-md object-cover border border-zinc-200"
              />
              <span className="text-[10px] font-mono font-bold tracking-wider text-zinc-500 uppercase">
                {t.tag}
              </span>
            </div>
          </div>

          {/* Ticket Body Content */}
          <div className="my-auto py-2 space-y-3">
            {/* Status Badge: Amber (Preparing) vs Emerald (Ready) */}
            <div>
              {status === 'preparing' ? (
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>{t.statusPreparing}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-mono font-bold animate-pulse">
                  <span className="w-2 h-2 rounded-full bg-emerald-600 animate-ping" />
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                  <span>{t.statusReady}</span>
                </div>
              )}
            </div>

            {/* Order Number in Bold Monospace */}
            <div className="py-1">
              <span className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 block mb-0.5">
                ORDER TICKET
              </span>
              <div
                className={`text-5xl sm:text-6xl font-mono font-black tracking-tight transition-colors ${
                  status === 'ready' ? 'text-emerald-700' : 'text-zinc-950'
                }`}
              >
                {t.orderNumber}
              </div>
            </div>

            {/* Visual Icon / Ringing State */}
            {status === 'ready' && (
              <div className="relative w-14 h-14 mx-auto my-1 animate-bounce">
                <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30">
                  <BellRing className="w-7 h-7" />
                </div>
              </div>
            )}

            {/* Operational Message Box */}
            <div
              className={`p-3 rounded-xl border text-xs leading-relaxed transition-colors shadow-xs ${
                status === 'ready'
                  ? 'bg-emerald-50/80 border-emerald-300 text-emerald-950 font-medium'
                  : 'bg-white border-zinc-200 text-zinc-700'
              }`}
            >
              <p className="font-semibold mb-1">
                {status === 'ready' ? t.statusReady : t.items}
              </p>
              <p className="text-[11px] text-zinc-500">
                {status === 'ready' ? t.statusReadySub : t.statusPreparingSub}
              </p>
            </div>

            {/* Outlet Name & Table Info */}
            <div className="text-[11px] font-mono text-zinc-500 flex items-center justify-center gap-2">
              <span>{t.outletName}</span>
              <span>·</span>
              <span className="font-bold text-zinc-700">{t.customer}</span>
            </div>
          </div>

          {/* Interactive Trigger Button */}
          <div className="pt-3 border-t border-zinc-200/80 space-y-2">
            <button
              type="button"
              onClick={toggleOrderStatus}
              className={`w-full py-3 px-4 rounded-xl font-mono font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs ${
                status === 'preparing'
                  ? 'bg-orange-600 hover:bg-orange-700 text-white'
                  : 'bg-zinc-900 hover:bg-zinc-800 text-white'
              }`}
            >
              {status === 'preparing' ? (
                <>
                  <BellRing className="w-4 h-4" />
                  <span>{t.btnMakeReady}</span>
                </>
              ) : (
                <>
                  <RotateCcw className="w-4 h-4 text-zinc-400" />
                  <span>{t.btnMakePreparing}</span>
                </>
              )}
            </button>

            {isAudioActive && (
              <button
                type="button"
                onClick={handleStopAudioOnly}
                className="w-full py-1.5 px-3 rounded-lg bg-red-100 hover:bg-red-200 border border-red-200 text-red-800 font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5 text-red-600" />
                <span>{t.audioStopped}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] font-mono text-zinc-400 text-center mt-2.5">
        {t.liveNotice}
      </p>
    </div>
  );
}
