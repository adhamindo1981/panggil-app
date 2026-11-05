'use client';

import React, { useState } from 'react';
import { Cafe, PlatformUser, SupportNote, AppLanguage } from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import {
  X,
  MessageSquare,
  Phone,
  Mail,
  Plus,
  Send,
  User,
  Clock,
  Tag,
  ShieldAlert,
} from 'lucide-react';

interface TenantSupportModalProps {
  cafe: Cafe | null;
  currentUser: PlatformUser | null;
  isOpen: boolean;
  onClose: () => void;
  lang: AppLanguage;
  onNoteAdded?: (note: SupportNote) => void;
}

export function TenantSupportModal({
  cafe,
  currentUser,
  isOpen,
  onClose,
  lang,
  onNoteAdded,
}: TenantSupportModalProps) {
  const [noteContent, setNoteContent] = useState('');
  const [noteType, setNoteType] = useState<SupportNote['type']>('support');
  const [saving, setSaving] = useState(false);
  const [notes, setNotes] = useState<SupportNote[]>(cafe?.support_notes || []);

  if (!isOpen || !cafe) return null;

  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const handleAddNote = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!noteContent.trim()) return;

    setSaving(true);
    try {
      const newNote = await dataService.addSupportNote(cafe.id, {
        author_name: currentUser?.name || 'Staff Member',
        note: noteContent.trim(),
        type: noteType,
      });

      setNotes((prev) => [newNote, ...prev]);
      if (onNoteAdded) onNoteAdded(newNote);
      setNoteContent('');
    } finally {
      setSaving(false);
    }
  };

  const cleanPhone = (cafe.owner_phone || '').replace(/[^\d+]/g, '');

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d121e] border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-500/10 border border-blue-500/20 flex items-center justify-center text-blue-400">
              <MessageSquare className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100">{t.crm.title}</h3>
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
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Tenant Contact Bar */}
          <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex flex-wrap items-center justify-between gap-4">
            <div>
              <p className="text-xs font-bold text-stone-200">
                {cafe.owner_name || 'اسم المالك غير محدد'}
              </p>
              <div className="flex items-center gap-3 mt-1 text-[11px] text-stone-400 font-mono">
                {cafe.owner_phone && <span>{cafe.owner_phone}</span>}
                {cafe.owner_email && <span>{cafe.owner_email}</span>}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {cleanPhone && (
                <a
                  href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5" />
                  <span>{t.crm.callOwner}</span>
                </a>
              )}
              {cafe.owner_email && (
                <a
                  href={`mailto:${cafe.owner_email}`}
                  className="px-3 py-1.5 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold flex items-center gap-1.5 transition-colors"
                >
                  <Mail className="w-3.5 h-3.5" />
                  <span>{t.crm.emailOwner}</span>
                </a>
              )}
            </div>
          </div>

          {/* New Note Form */}
          <form
            onSubmit={handleAddNote}
            className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3"
          >
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                <Plus className="w-3.5 h-3.5" />
                <span>{t.crm.addNoteTitle}</span>
              </span>
              <select
                value={noteType}
                onChange={(e) => setNoteType(e.target.value as SupportNote['type'])}
                className="bg-stone-950 border border-stone-800 rounded-lg px-2.5 py-1 text-xs text-stone-300"
              >
                <option value="support">دعم فني (Support)</option>
                <option value="billing">اشتراكات وفواتير (Billing)</option>
                <option value="onboarding">تدشين وتشغيل (Onboarding)</option>
                <option value="general">ملاحظة عامة (General)</option>
              </select>
            </div>

            <textarea
              rows={3}
              value={noteContent}
              onChange={(e) => setNoteContent(e.target.value)}
              placeholder="اكتب تفاصيل المحادثة، الاستفسار، أو المتابعة الفنية مع العميل..."
              required
              className="w-full bg-stone-950 border border-stone-800 rounded-xl p-3 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-all resize-none"
            />

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={saving || !noteContent.trim()}
                className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{saving ? 'جاري الحفظ...' : t.crm.saveNote}</span>
              </button>
            </div>
          </form>

          {/* Notes Log / History */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-stone-400 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-stone-500" />
              <span>{t.crm.viewNotes} ({notes.length})</span>
            </h4>

            {notes.length === 0 ? (
              <div className="p-8 text-center text-xs text-stone-600 bg-stone-900/40 rounded-2xl border border-stone-800/50">
                لا توجد ملاحظات مسجلة بعد لهذا المقهى.
              </div>
            ) : (
              <div className="space-y-2.5">
                {notes.map((n) => (
                  <div
                    key={n.id}
                    className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800/80 space-y-1.5"
                  >
                    <div className="flex items-center justify-between text-[11px]">
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-stone-300">{n.author_name}</span>
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-semibold ${
                            n.type === 'billing'
                              ? 'bg-purple-500/10 text-purple-400'
                              : n.type === 'support'
                              ? 'bg-blue-500/10 text-blue-400'
                              : n.type === 'onboarding'
                              ? 'bg-emerald-500/10 text-emerald-400'
                              : 'bg-stone-800 text-stone-400'
                          }`}
                        >
                          {t.crm.types[n.type] || n.type}
                        </span>
                      </div>
                      <span className="text-stone-500 font-mono">
                        {new Date(n.created_at).toLocaleDateString()} -{' '}
                        {new Date(n.created_at).toLocaleTimeString([], {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-xs text-stone-200 leading-relaxed whitespace-pre-wrap">
                      {n.note}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
