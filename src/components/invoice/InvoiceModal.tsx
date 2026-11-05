"use client";

import React, { useRef } from 'react';
import { Order, Cafe } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { PrintableReceipt } from './PrintableReceipt';
import { X, Printer, Download, FileText } from 'lucide-react';

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
    ? `${window.location.origin}/c/${cafe.slug}/pager/${order.id}?num=${encodeURIComponent(order.order_number)}&name=${encodeURIComponent(order.customer_name || '')}`
    : `/c/${cafe.slug}/pager/${order.id}?num=${encodeURIComponent(order.order_number)}&name=${encodeURIComponent(order.customer_name || '')}`;

  const handlePrint = () => {
    window.print();
  };

  const labels = {
    printOrPdf: {
      ar: 'طباعة / حفظ كـ PDF',
      id: 'Cetak / Unduh PDF',
      en: 'Print / Save as PDF',
    },
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 bg-zinc-950/60 no-print">
          <div className="flex items-center gap-2">
            <FileText className="w-5 h-5 text-amber-500" />
            <h3 className="font-bold text-zinc-100 text-sm sm:text-base">
              {t.invoice.title}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Receipt Content Scrollable */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 bg-zinc-950/40" ref={receiptRef}>
          <PrintableReceipt order={order} cafe={cafe} pagerUrl={pagerUrl} />
        </div>

        {/* Action Buttons (Strictly Privacy First: Direct Print & PDF Download) */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-900/90 flex flex-wrap gap-2 justify-end no-print">
          <button
            onClick={handlePrint}
            className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 text-xs font-bold text-zinc-950 bg-amber-500 hover:bg-amber-400 rounded-xl shadow-lg transition-all active:scale-95 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{labels.printOrPdf[lang]}</span>
          </button>

          <button
            onClick={onClose}
            className="px-4 py-2 text-xs font-medium text-zinc-400 hover:text-zinc-200 bg-zinc-800 hover:bg-zinc-700 rounded-xl transition-colors cursor-pointer"
          >
            {t.common.close}
          </button>
        </div>
      </div>
    </div>
  );
}
