"use client";

import React from 'react';
import { useI18n } from '@/lib/i18n/context';
import { AppLanguage } from '@/types/database';
import { Globe, Radio } from 'lucide-react';

export function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { lang, setLang, t } = useI18n();

  const languages: { code: AppLanguage; label: string; flag: string }[] = [
    { code: 'id', label: 'Indonesia', flag: '🇮🇩' },
    { code: 'ar', label: 'العربية', flag: '🇸🇦' },
    { code: 'en', label: 'English', flag: '🇬🇧' },
  ];

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl shadow-inner backdrop-blur-md">
        {languages.map((item) => {
          const isActive = lang === item.code;
          return (
            <button
              key={item.code}
              onClick={() => setLang(item.code)}
              className={`flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold rounded-lg transition-all duration-200 ${
                isActive
                  ? 'bg-amber-500 text-zinc-950 shadow-md scale-102'
                  : 'text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/60'
              }`}
              title={item.label}
            >
              <span>{item.flag}</span>
              {!compact && <span>{item.label}</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}
