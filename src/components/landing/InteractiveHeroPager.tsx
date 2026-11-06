'use client';

import React, { useState, useEffect } from 'react';
import { audioEngine } from '@/lib/audio-engine';
import { AnimatedBrandLogo } from './AnimatedBrandLogo';
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
      liveNotice: 'Tekan tombol 3D di bawah untuk menguji reaksi panggil & suara sirene:',
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
      liveNotice: 'اضغط الزر التفاعلي 3D بالأسفل لتجربة رنين واهتزاز البيجر الفعلي:',
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
      liveNotice: 'Press the 3D button below to trigger real pager buzzer sound & haptics:',
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

      // Auto stop sound after 6 seconds
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
      <div className="flex items-center gap-1.5 p-1 rounded-xl bg-white border border-zinc-200 text-xs font-mono mb-4 shadow-xs">
        <span className="text-zinc-400 text-[10px] px-1.5 font-semibold uppercase">Lang:</span>
        {(['id', 'ar', 'en'] as Lang[]).map((l) => (
          <button
            key={l}
            type="button"
            onClick={() => setLang(l)}
            className={`px-3 py-1 rounded-lg transition-all cursor-pointer font-bold ${
              lang === l
                ? 'bg-zinc-950 text-white shadow-xs scale-102'
                : 'text-zinc-600 hover:text-zinc-950 hover:bg-zinc-100'
            }`}
          >
            {l === 'id' ? 'ID · Bahasa' : l === 'ar' ? 'AR · العربية' : 'EN · English'}
          </button>
        ))}
      </div>

      {/* Smartphone Device Frame (Swiss Minimalist with Subtle 3D Depth) */}
      <div
        className={`w-full bg-white rounded-[40px] p-3.5 border-2 transition-all duration-300 shadow-xl ${
          status === 'ready'
            ? 'border-emerald-600 ring-8 ring-emerald-500/10 animate-buzz'
            : 'border-zinc-300 hover:shadow-2xl'
        }`}
      >
        {/* Device Inner Display Screen */}
        <div className="bg-zinc-50 rounded-[30px] border border-zinc-200 p-5 flex flex-col justify-between min-h-[460px] text-center relative overflow-hidden">
          {/* Top Notch & Dynamic Clock */}
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-3 px-1">
              <span>12:45</span>
              <div className="w-16 h-3.5 bg-zinc-200 rounded-full flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-zinc-300" />
              </div>
              <span>5G · 100%</span>
            </div>

            {/* Micro Brand Header with Animated Logo */}
            <div className="flex items-center justify-center gap-2 pb-2.5 border-b border-zinc-200/80 mb-3">
              <AnimatedBrandLogo size="sm" showRays={status === 'ready'} interactive={false} />
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
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 border border-amber-300 text-amber-900 text-xs font-mono font-bold shadow-xs">
                  <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
                  <span>{t.statusPreparing}</span>
                </div>
              ) : (
                <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-100 border border-emerald-400 text-emerald-900 text-xs font-mono font-bold shadow-xs animate-pulse">
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

            {/* Animated Buzzer Visual on Ready State */}
            {status === 'ready' && (
              <div className="relative w-16 h-16 mx-auto my-1 flex items-center justify-center">
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/30 animate-radar-1" />
                <div className="absolute inset-0 rounded-2xl bg-emerald-500/20 animate-radar-2" />
                <div className="relative w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-600/30 animate-bounce">
                  <BellRing className="w-7 h-7" />
                </div>
              </div>
            )}

            {/* Operational Message Box */}
            <div
              className={`p-3.5 rounded-2xl border text-xs leading-relaxed transition-all shadow-xs ${
                status === 'ready'
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-950 font-medium'
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

          {/* Interactive 3D Trigger Button */}
          <div className="pt-3 border-t border-zinc-200/80 space-y-2">
            <button
              type="button"
              onClick={toggleOrderStatus}
              className={`w-full py-3.5 px-4 rounded-xl font-mono font-bold text-xs flex items-center justify-center gap-2 ${
                status === 'preparing' ? 'btn-3d-orange' : 'btn-3d-dark'
              }`}
            >
              {status === 'preparing' ? (
                <>
                  <BellRing className="w-4 h-4 animate-bounce" />
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
                className="w-full py-2 px-3 rounded-lg bg-red-100 hover:bg-red-200 border border-red-200 text-red-800 font-mono text-[11px] font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <VolumeX className="w-3.5 h-3.5 text-red-600" />
                <span>{t.audioStopped}</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <p className="text-[11px] font-mono text-zinc-500 text-center mt-3">
        {t.liveNotice}
      </p>
    </div>
  );
}
