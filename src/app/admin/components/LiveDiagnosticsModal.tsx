'use client';

import React, { useState, useEffect } from 'react';
import { Cafe, Order, AppLanguage } from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { cloudRelay } from '@/lib/cloud-relay';
import {
  X,
  Activity,
  BellRing,
  CheckCircle2,
  Clock,
  Wifi,
  Sparkles,
  AlertCircle,
} from 'lucide-react';

interface LiveDiagnosticsModalProps {
  cafe: Cafe | null;
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
}

export function LiveDiagnosticsModal({
  cafe,
  isOpen,
  onClose,
  lang,
}: LiveDiagnosticsModalProps) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [testBuzzSuccess, setTestBuzzSuccess] = useState(false);

  const isRtl = lang === 'ar';

  useEffect(() => {
    if (!cafe || !isOpen) return;
    loadLiveOrders();
  }, [cafe, isOpen]);

  const loadLiveOrders = async () => {
    if (!cafe) return;
    setLoading(true);
    try {
      const live = await dataService.getOrders(cafe.id);
      setOrders(live);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !cafe) return null;

  const pending = orders.filter((o) => o.status === 'pending');
  const ready = orders.filter((o) => o.status === 'ready');
  const completed = orders.filter((o) => o.status === 'completed');

  const handleTestSignal = () => {
    const testOrder: Order = {
      id: 'diagnostic-' + Date.now(),
      cafe_id: cafe.id,
      order_number: '#TEST-99',
      customer_name: 'Diagnostic Ping / فحص اتصال',
      status: 'pending',
      total_amount: 0,
      items: [],
      created_at: new Date().toISOString(),
    };
    cloudRelay.publishCafeOrder(cafe.id, testOrder);
    setTestBuzzSuccess(true);
    setTimeout(() => setTestBuzzSuccess(false), 3000);
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d121e] border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400">
              <Activity className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100">فحص أداء الطابور والبيجر المباشر</h3>
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

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-5">
          {/* Quick Metrics */}
          <div className="grid grid-cols-3 gap-3">
            <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-center">
              <p className="text-xs text-amber-400 font-semibold mb-1">قيد التجهيز</p>
              <p className="text-2xl font-black text-amber-400 font-mono">{pending.length}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-center animate-pulse">
              <p className="text-xs text-emerald-400 font-semibold mb-1">يرن الآن (جاهز)</p>
              <p className="text-2xl font-black text-emerald-400 font-mono">{ready.length}</p>
            </div>
            <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 text-center">
              <p className="text-xs text-stone-400 font-semibold mb-1">مكتمل ومستلم</p>
              <p className="text-2xl font-black text-stone-200 font-mono">{completed.length}</p>
            </div>
          </div>

          {/* Test Signal Box */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400">
                <Wifi className="w-4 h-4" />
              </div>
              <div>
                <p className="text-xs font-bold text-stone-200">فحص اتصال Universal Cloud Relay</p>
                <p className="text-[11px] text-stone-500">إرسال نبضة اختبارية لقناة الكاشير والبيجر</p>
              </div>
            </div>

            <button
              type="button"
              onClick={handleTestSignal}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                testBuzzSuccess
                  ? 'bg-emerald-500 text-stone-950 shadow-md'
                  : 'bg-stone-800 hover:bg-stone-700 text-cyan-300'
              }`}
            >
              {testBuzzSuccess ? 'تم إرسال الإشارة!' : 'إرسال إشارة تجريبية'}
            </button>
          </div>

          {/* Live Orders List */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-amber-400" />
              <span>الطلبات النشطة في الطابور ({orders.length})</span>
            </h4>

            {loading ? (
              <div className="p-8 text-center text-stone-500 text-xs">جاري فحص الطلبات...</div>
            ) : orders.length === 0 ? (
              <div className="p-8 text-center text-stone-500 text-xs bg-stone-900/40 rounded-2xl border border-stone-800">
                لا توجد طلبات مسجلة في طابور هذا المقهى حالياً.
              </div>
            ) : (
              <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                {orders.map((o) => (
                  <div
                    key={o.id}
                    className="p-3 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between text-xs"
                  >
                    <div className="flex items-center gap-3">
                      <span className="font-mono font-black text-amber-400 text-sm">
                        {o.order_number}
                      </span>
                      <div>
                        <p className="font-semibold text-stone-200">{o.customer_name}</p>
                        <p className="text-[10px] text-stone-500 font-mono">
                          {new Date(o.created_at).toLocaleTimeString([], {
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2.5 py-1 rounded-lg text-[10px] font-bold ${
                          o.status === 'ready'
                            ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                            : o.status === 'pending'
                            ? 'bg-amber-500/20 text-amber-400 border border-amber-500/30'
                            : 'bg-stone-800 text-stone-400'
                        }`}
                      >
                        {o.status === 'ready'
                          ? 'يرن الآن'
                          : o.status === 'pending'
                          ? 'قيد التجهيز'
                          : 'مكتمل'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors"
          >
            إغلاق الفحص
          </button>
        </div>
      </div>
    </div>
  );
}
