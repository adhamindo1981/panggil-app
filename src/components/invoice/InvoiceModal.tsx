"use client";

import React, { useRef } from 'react';
import { Order, Cafe } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { PrintableReceipt } from './PrintableReceipt';
import { X, Printer, Share2, MessageCircle } from 'lucide-react';
import { generateWhatsAppReadyUrl } from '@/lib/whatsapp';

interface InvoiceModalProps {
  isOpen: boolean;
  onClose: () => void;
  order: Order | null;
  cafe: Cafe;
}

export function InvoiceModal({ isOpen, onClose, order, cafe }: InvoiceModalProps) {
  const { t, lang } = useI18n();
  const receiptRef = useRef<HTMLDivElement>(null);

  if (!isOpen || !order) return null;

  const pagerUrl = typeof window !== 'undefined'
    ? `${window.location.origin}/c/${cafe.slug}/pager/${order.id}`
    : `/c/${cafe.slug}/pager/${order.id}`;

  const handlePrint = () => {
    window.print();
  };

  const handleWhatsApp = () => {
    if (!order.customer_phone) return;
    const url = generateWhatsAppReadyUrl(
      order.customer_phone,
      order.order_number,
      order.customer_name,
      cafe.name,
      pagerUrl,
      lang
    );
    window.open(url, '_blank');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/60 no-print">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-zinc-100 text-sm sm:text-base">
              {t.invoice.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-zinc-950/40" ref={receiptRef}>
          <PrintableReceipt order={order} cafe={cafe} pagerUrl={pagerUrl} />
        </div>

        {/* Action Buttons */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex flex-wrap gap-2 justify-end no-print">
          {order.customer_phone && (
            <button
              onClick={handleWhatsApp}
              className="flex items-center gap-2 px-3 py-2 text-xs font-semibold text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 border border-emerald-500/30 rounded-xl transition-all"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.cashier.sendWhatsapp}</span>
            </button>
          )}

          <button
            onClick={handlePrint}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-lg transition-all active:scale-95"
          >
            <Printer className="w-4 h-4" />
            <span>{t.common.print}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}
