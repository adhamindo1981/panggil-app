'use client';

import React, { useState } from 'react';
import { Cafe, AppLanguage } from '@/types/database';
import { getAppBaseUrl } from '@/lib/feature-gates';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import {
  X,
  Copy,
  Check,
  ExternalLink,
  Share2,
  KeyRound,
  QrCode,
  MonitorCheck,
  UtensilsCrossed,
  MessageSquare,
} from 'lucide-react';

interface OnboardingKitModalProps {
  cafe: Cafe | null;
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export function OnboardingKitModal({
  cafe,
  isOpen,
  onClose,
  lang,
}: OnboardingKitModalProps) {
  const [copiedField, setCopiedField] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);

  if (!isOpen || !cafe) return null;

  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';
  const baseUrl = getAppBaseUrl();

  const cashierUrl = `${baseUrl}/c/${cafe.slug}/cashier`;
  const qrKitUrl = `${baseUrl}/c/${cafe.slug}/qr-kit`;
  const menuUrl = `${baseUrl}/c/${cafe.slug}/menu`;
  const pagerUrl = `${baseUrl}/c/${cafe.slug}/pager`;
  const pinCode = cafe.cashier_pin || '1234';

  const welcomeMessage =
    lang === 'ar'
      ? `🎉 مرحباً بكم في منصة نداء (Panggil) للبيجر الذكي!
تم تفعيل منشأتكم: *${cafe.name}* بنجاح.

إليكم بيانات التشغيل الخاصة بكم:
🔑 *رمز PIN السري للكاشير:* \`${pinCode}\`
💻 *رابط لوحة الكاشير:* ${cashierUrl}
📱 *رابط المنيو الرقمي للزبائن:* ${menuUrl}
🖨️ *رابط طباعة ستاندات وباركود الطاولات:* ${qrKitUrl}

نتمنى لكم تجربة مميزة وسريعة في خدمة عملائكم!`
      : `🎉 Selamat datang di Platform Panggil!
Akun usaha Anda: *${cafe.name}* telah resmi diaktifkan.

Berikut data login dan tautan operasional Anda:
🔑 *PIN Rahasia Kasir:* \`${pinCode}\`
💻 *Tautan Layar Kasir:* ${cashierUrl}
📱 *Tautan Menu Digital Pelanggan:* ${menuUrl}
🖨️ *Tautan Cetak Stand Meja & QR:* ${qrKitUrl}

Semoga operasional Anda semakin lancar dan efisien!`;

  const copyToClipboard = async (text: string, fieldId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedField(fieldId);
      setTimeout(() => setCopiedField(null), 2500);
    } catch {
      // Fallback
    }
  };

  const handleCopyAll = async () => {
    try {
      await navigator.clipboard.writeText(welcomeMessage);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2500);
    } catch {}
  };

  const cleanPhone = (cafe.owner_phone || '').replace(/[^\d+]/g, '');
  const whatsappUrl = `https://wa.me/${cleanPhone.replace('+', '')}?text=${encodeURIComponent(welcomeMessage)}`;

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d121e] border border-stone-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400">
              <Share2 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100">{t.onboardingKit.title}</h3>
              <p className="text-xs text-stone-400">{cafe.name}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4">
          <p className="text-xs text-stone-400 leading-relaxed">
            {t.onboardingKit.subtitle}
          </p>

          {/* Quick Copy Full Message CTA */}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={handleCopyAll}
              className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
                copiedAll
                  ? 'bg-emerald-500 text-stone-950 shadow-lg shadow-emerald-500/20'
                  : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 shadow-lg shadow-amber-500/20'
              }`}
            >
              {copiedAll ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span>{copiedAll ? t.onboardingKit.copied : t.onboardingKit.copyAll}</span>
            </button>

            {cleanPhone && (
              <a
                href={whatsappUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="py-3 px-4 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all"
              >
                <MessageSquare className="w-4 h-4" />
                <span>{t.onboardingKit.whatsappShare}</span>
              </a>
            )}
          </div>

          {/* Links & Access Cards */}
          <div className="space-y-3 pt-2">
            {/* PIN Code */}
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400">
                  <KeyRound className="w-4 h-4" />
                </div>
                <div>
                  <p className="text-xs text-stone-400">{t.onboardingKit.pinCode}</p>
                  <p className="text-base font-black text-amber-400 font-mono tracking-widest">{pinCode}</p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => copyToClipboard(pinCode, 'pin')}
                className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                title="Copy PIN"
              >
                {copiedField === 'pin' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Cashier Dashboard URL */}
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                <div className="w-8 h-8 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-400 shrink-0">
                  <MonitorCheck className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">{t.onboardingKit.cashierUrl}</p>
                  <p className="text-xs text-stone-200 font-mono truncate">{cashierUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(cashierUrl, 'cashier')}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                  title="Copy URL"
                >
                  {copiedField === 'cashier' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={cashierUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* QR Kit URL */}
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                  <QrCode className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">{t.onboardingKit.qrKitUrl}</p>
                  <p className="text-xs text-stone-200 font-mono truncate">{qrKitUrl}</p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() => copyToClipboard(qrKitUrl, 'qrkit')}
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  {copiedField === 'qrkit' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={qrKitUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Menu / Pager URL */}
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
              <div className="flex items-center gap-3 min-w-0 flex-1 mr-2">
                <div className="w-8 h-8 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-400 shrink-0">
                  <UtensilsCrossed className="w-4 h-4" />
                </div>
                <div className="min-w-0">
                  <p className="text-xs text-stone-400">{t.onboardingKit.menuUrl}</p>
                  <p className="text-xs text-stone-200 font-mono truncate">
                    {cafe.mode === 'menu_pager' ? menuUrl : pagerUrl}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-1 shrink-0">
                <button
                  type="button"
                  onClick={() =>
                    copyToClipboard(
                      cafe.mode === 'menu_pager' ? menuUrl : pagerUrl,
                      'menu'
                    )
                  }
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  {copiedField === 'menu' ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
                <a
                  href={cafe.mode === 'menu_pager' ? menuUrl : pagerUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-300 transition-colors"
                >
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="p-4 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            {t.onboardingKit.close}
          </button>
        </div>
      </div>
    </div>
  );
}
