"use client";

import React, { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { Order, Cafe } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';

interface PrintableReceiptProps {
  order: Order;
  cafe: Cafe;
  pagerUrl: string;
}

export function PrintableReceipt({ order, cafe, pagerUrl }: PrintableReceiptProps) {
  const { t, formatCurrency } = useI18n();
  const [qrSrc, setQrSrc] = useState<string>('');

  useEffect(() => {
    QRCode.toDataURL(pagerUrl, {
      width: 160,
      margin: 1,
      color: { dark: '#000000', light: '#ffffff' },
    }).then(setQrSrc).catch(console.error);
  }, [pagerUrl]);

  const dateStr = new Date(order.created_at).toLocaleString();
  const subtotal = order.total_amount || 0;
  const taxRate = typeof cafe.tax_rate === 'number' ? cafe.tax_rate : 10;
  const tax = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + tax;
  const logoUrl = cafe.logo_url || cafe.custom_branding?.logo_url;

  return (
    <div className="bg-white text-zinc-900 p-6 rounded-lg font-mono text-xs w-full max-w-[340px] mx-auto shadow-2xl border border-zinc-200 printable-content">
      {/* Cafe Header & Logo */}
      <div className="text-center pb-3 border-b border-dashed border-zinc-400">
        {logoUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={logoUrl}
            alt={cafe.name}
            className="w-14 h-14 object-contain mx-auto mb-2 rounded-xl"
          />
        )}
        <h2 className="text-base font-bold tracking-tight text-zinc-950 uppercase">{cafe.name}</h2>
        {cafe.address && <p className="text-[10px] text-zinc-600 mt-1">{cafe.address}</p>}
        {cafe.phone && <p className="text-[10px] text-zinc-600">{cafe.phone}</p>}
      </div>

      {/* Ticket / Order Big Tag */}
      <div className="my-3 py-2 bg-zinc-100 rounded text-center border border-zinc-300">
        <span className="text-[10px] uppercase font-bold text-zinc-500 block">
          {t.cashier.orderNumber}
        </span>
        <span className="text-2xl font-black tracking-widest text-zinc-900 block">
          {order.order_number}
        </span>
        {order.customer_name && (
          <span className="text-xs font-semibold text-zinc-700 block mt-0.5">
            {order.customer_name}
          </span>
        )}
      </div>

      {/* Meta details */}
      <div className="space-y-1 py-2 text-[10px] border-b border-dashed border-zinc-300 text-zinc-600">
        <div className="flex justify-between">
          <span>{t.invoice.date}:</span>
          <span>{dateStr}</span>
        </div>
        <div className="flex justify-between">
          <span>{t.invoice.receiptNumber}:</span>
          <span>{order.id.slice(0, 8).toUpperCase()}</span>
        </div>
      </div>

      {/* Order Items (if any) */}
      {order.items && order.items.length > 0 ? (
        <div className="py-3 border-b border-dashed border-zinc-300">
          <div className="flex justify-between font-bold text-[10px] pb-1 border-b border-zinc-200">
            <span>{t.invoice.itemDescription}</span>
            <span>{t.common.total}</span>
          </div>
          <div className="space-y-1.5 pt-2">
            {order.items.map((item, index) => (
              <div key={index} className="flex justify-between items-start text-[11px]">
                <div className="flex-1 pr-2">
                  <p className="font-semibold text-zinc-800">{item.name_id || item.name_en}</p>
                  <p className="text-[9px] text-zinc-500">
                    {item.quantity} x {formatCurrency(item.price, cafe.currency_symbol)}
                  </p>
                </div>
                <span className="font-semibold text-zinc-800">
                  {formatCurrency(item.price * item.quantity, cafe.currency_symbol)}
                </span>
              </div>
            ))}
          </div>

          {/* Pricing calculations */}
          <div className="mt-3 pt-2 border-t border-dotted border-zinc-300 space-y-1">
            <div className="flex justify-between text-zinc-600 text-[10px]">
              <span>{t.invoice.subtotal}</span>
              <span>{formatCurrency(subtotal, cafe.currency_symbol)}</span>
            </div>
            <div className="flex justify-between text-zinc-600 text-[10px]">
              <span>{t.invoice.taxRate} ({taxRate}%)</span>
              <span>{formatCurrency(tax, cafe.currency_symbol)}</span>
            </div>
            <div className="flex justify-between font-bold text-xs pt-1 border-t border-zinc-400 text-zinc-950">
              <span>{t.invoice.grandTotal}</span>
              <span>{formatCurrency(grandTotal, cafe.currency_symbol)}</span>
            </div>
          </div>
        </div>
      ) : (
        <div className="py-3 text-center text-zinc-500 border-b border-dashed border-zinc-300">
          <p className="text-[11px] font-semibold">{t.modes.pagerOnly}</p>
        </div>
      )}

      {/* QR Code Section */}
      <div className="py-4 text-center">
        {qrSrc ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={qrSrc} alt="Pager QR Code" className="w-28 h-28 mx-auto border border-zinc-300 p-1 rounded" />
        ) : (
          <div className="w-28 h-28 mx-auto bg-zinc-100 flex items-center justify-center text-[10px] text-zinc-400">
            QR Code
          </div>
        )}
        <p className="text-[9px] font-semibold uppercase tracking-wider text-zinc-600 mt-2">
          {t.invoice.scanToTrack}
        </p>
      </div>

      {/* Footer message */}
      <div className="text-center pt-2 border-t border-dashed border-zinc-400 text-[9px] text-zinc-500 space-y-1">
        <p className="font-medium">{t.invoice.thankYouNote}</p>
        <p className="text-[8px] text-zinc-400">Powered by Panggil / نداء Pager System</p>
      </div>
    </div>
  );
}
