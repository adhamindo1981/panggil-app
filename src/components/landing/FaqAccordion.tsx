'use client';

import React, { useState } from 'react';
import { ChevronDown, ChevronUp } from 'lucide-react';
import { SpatialCard } from '@/components/cinematic/SpatialCard';

type Lang = 'id' | 'ar' | 'en';

interface Props {
  lang: Lang;
}

export function FaqAccordion({ lang }: Props) {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isRtl = lang === 'ar';

  const faqs = [
    {
      q: {
        id: 'Apakah pelanggan perlu mengunduh aplikasi untuk menerima panggilan?',
        ar: 'هل يحتاج العميل لتحميل أي تطبيق على هاتفه لاستقبال النداء؟',
        en: 'Does the customer need to install an app to receive alerts?',
      },
      a: {
        id: 'Sama sekali tidak! Pelanggan cukup mengarahkan kamera ponsel ke kode QR pada struk atau meja. Halaman tiket pager akan langsung terbuka di browser mereka dalam 0,4 detik.',
        ar: 'إطلاقاً! يمسح العميل رمز الـ QR بكاميرا هاتفه الذكي فقط، فتفتح صفحة تتبع الطلب في المتصفح فوراً خلال 0.4 ثانية دون تحميل تطبيق أو إنشاء حساب.',
        en: 'Not at all! The customer simply points their mobile camera at the QR code. The live pager page opens instantly in their browser in under 0.4 seconds.',
      },
    },
    {
      q: {
        id: 'Bagaimana jika ponsel pelanggan dalam mode saku atau layar terkunci?',
        ar: 'ماذا لو كان جوال العميل في جيبه أو كانت الشاشة مقفلة؟',
        en: 'What if the customer locks their screen or puts their phone in their pocket?',
      },
      a: {
        id: 'Panggil dilengkapi teknologi Audio Keep-Alive canggih yang mempertahankan koneksi WebSocket tetap hidup di Safari iOS dan Chrome Android, sehingga bunyi sirene dan getaran tetap berbunyi saat pesanan siap.',
        ar: 'تم تزويد نظام نداء بتقنية صوتية مبتكرة (Audio Keep-Alive) تحافظ على اتصال WebSocket نشطاً في خلفية المتصفح على أجهزة iPhone و Android، فيرن التنبيه ويهتز الهاتف حتى والشاشة مقفلة.',
        en: 'Panggil is engineered with background audio survival protocols that keep the WebSocket connection alive on iOS Safari and Android Chrome, ensuring the siren sounds even when screen is pocketed.',
      },
    },
    {
      q: {
        id: 'Bagaimana cara kasir membuat tiket panggilan?',
        ar: 'كيف يقوم موظف الكاشير بإنشاء تذكرة استدعاء جديدة؟',
        en: 'How does the cashier generate a pager ticket?',
      },
      a: {
        id: 'Kasir cukup membuka Dashboard Kasir di browser (bisa lewat tablet, laptop, atau ponsel POS). Tersedia tombol "Auto #" untuk pembuatan nomor sekejap atau memasukkan nomor struk dari kasir Anda.',
        ar: 'يفتح الكاشير لوحة التحكم من أي جهاز (تابلت، لابتوب، أو جوال). يمكنه إدخال رقم الفاتورة أو الضغط على زر "Auto #" لتوليد تذكرة فورية وطباعة أو عرض الباركود للزبون.',
        en: 'The cashier simply opens the web dashboard on any tablet, PC, or POS phone. They can type the receipt number or tap "Auto #" for instant sequential ticket generation.',
      },
    },
    {
      q: {
        id: 'Apakah bisa digunakan untuk banyak cabang sekaligus?',
        ar: 'هل يمكن تشغيل النظام في سلاسل الفروع المتعددة والمطابخ السحابية؟',
        en: 'Can Panggil support multiple branches and franchises?',
      },
      a: {
        id: 'Ya, paket Enterprise kami mendukung manajemen multi-outlet terpusat dengan analitik waktu tunggu per cabang, pembatasan staf via PIN kasir, dan integrasi POS.',
        ar: 'نعم بالتأكيد! تدعم المنظومة إدارة فروع متعددة مركزياً مع تقارير أداء لكل فرع، وحماية شاشات الكاشير برمز PIN، والربط مع أنظمة نقاط البيع المختلفة.',
        en: 'Yes! Our Enterprise tier supports centralized multi-outlet governance, per-branch wait metrics, cashier PIN isolation, and custom POS integration.',
      },
    },
  ];

  const headers = {
    id: {
      tag: 'PERTANYAAN UMUM',
      title: 'Pertanyaan yang Sering Diajukan (FAQ)',
    },
    ar: {
      tag: 'الأسئلة الشائعة',
      title: 'الأسئلة الأكثر شيوعاً حول المنظومة (FAQ)',
    },
    en: {
      tag: 'FREQUENTLY ASKED QUESTIONS',
      title: 'Frequently Asked Questions (FAQ)',
    },
  };

  const t = headers[lang];

  return (
    <section
      id="faq"
      dir={isRtl ? 'rtl' : 'ltr'}
      className="py-24 px-4 sm:px-8 max-w-4xl mx-auto w-full border-t border-zinc-200/80 relative"
    >
      <div className="text-center max-w-xl mx-auto mb-12 space-y-2">
        <span className="text-xs font-mono font-bold text-orange-600 uppercase tracking-widest block">
          {t.tag}
        </span>
        <h2 className="text-3xl sm:text-4xl font-black text-zinc-950 ltr:tracking-tight rtl:tracking-normal rtl:leading-[1.44]">
          {t.title}
        </h2>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, idx) => {
          const isOpen = openFaq === idx;
          return (
            <SpatialCard
              key={idx}
              tiltIntensity={2}
              showCrosshairs={false}
              className="w-full"
            >
              <button
                type="button"
                onClick={() => setOpenFaq(isOpen ? null : idx)}
                className="w-full text-left rtl:text-right flex items-center justify-between gap-4 font-bold text-sm sm:text-base text-zinc-900 cursor-pointer p-1"
              >
                <span>{faq.q[lang]}</span>
                <span className="p-1 rounded-lg bg-zinc-100 border border-zinc-200 text-zinc-600">
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-orange-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </span>
              </button>
              {isOpen && (
                <div className="pt-3.5 pb-1 text-xs sm:text-sm text-zinc-600 leading-relaxed border-t border-zinc-100 mt-3 font-sans">
                  {faq.a[lang]}
                </div>
              )}
            </SpatialCard>
          );
        })}
      </div>
    </section>
  );
}
