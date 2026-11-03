"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppLanguage } from '@/types/database';
import { translations, Translations } from './translations';

interface I18nContextType {
  lang: AppLanguage;
  setLang: (lang: AppLanguage) => void;
  t: Translations;
  dir: 'ltr' | 'rtl';
  isRtl: boolean;
  formatCurrency: (amount: number, currencySymbol?: string) => string;
}

const I18nContext = createContext<I18nContextType | undefined>(undefined);

export function I18nProvider({
  children,
  initialLang = 'id',
}: {
  children: React.ReactNode;
  initialLang?: AppLanguage;
}) {
  const [lang, setLangState] = useState<AppLanguage>(initialLang);

  useEffect(() => {
    // Check localStorage on client mount
    if (typeof window !== 'undefined') {
      const savedLang = localStorage.getItem('panggil_preferred_lang') as AppLanguage | null;
      if (savedLang && (savedLang === 'id' || savedLang === 'ar' || savedLang === 'en')) {
        setLangState(savedLang);
      }
    }
  }, []);

  const setLang = (newLang: AppLanguage) => {
    setLangState(newLang);
    if (typeof window !== 'undefined') {
      localStorage.setItem('panggil_preferred_lang', newLang);
      document.documentElement.dir = newLang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = newLang;
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.documentElement.dir = lang === 'ar' ? 'rtl' : 'ltr';
      document.documentElement.lang = lang;
    }
  }, [lang]);

  const dir: 'ltr' | 'rtl' = lang === 'ar' ? 'rtl' : 'ltr';
  const isRtl = lang === 'ar';

  /**
   * Currency Formatter:
   *  - Indonesian Rupiah (Rp X.XXX)
   *  - Saudi Riyal (SAR / ر.س)
   *  - Default USD / Numeric
   */
  const formatCurrency = (amount: number, customSymbol?: string): string => {
    if (lang === 'id' || customSymbol === 'Rp') {
      return `Rp ${Math.round(amount).toLocaleString('id-ID')}`;
    }
    if (lang === 'ar' || customSymbol === 'SAR') {
      return `${amount.toLocaleString('ar-SA')} ر.س`;
    }
    return `$${amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}`;
  };

  return (
    <I18nContext.Provider
      value={{
        lang,
        setLang,
        t: translations[lang],
        dir,
        isRtl,
        formatCurrency,
      }}
    >
      <div dir={dir} className={lang === 'ar' ? 'font-arabic' : 'font-sans'}>
        {children}
      </div>
    </I18nContext.Provider>
  );
}

export function useI18n() {
  const context = useContext(I18nContext);
  if (!context) {
    throw new Error('useI18n must be used within an I18nProvider');
  }
  return context;
}
