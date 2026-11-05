'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import { AppLanguage } from '@/types/database';
import {
  ShieldCheck,
  Lock,
  Mail,
  ArrowRight,
  Sparkles,
  UserCheck,
  Radio,
  Globe,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState<AppLanguage>('ar');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  useEffect(() => {
    // If already logged in, jump straight to dashboard
    if (adminAuth.isAuthenticated()) {
      router.replace('/admin/dashboard');
    }
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    setLoading(true);
    setError(null);

    const result = await adminAuth.login(email, password);
    setLoading(false);

    if (result.success) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.error || 'فشل تسجيل الدخول. تحقق من البيانات المدخلة');
    }
  };

  const handleQuickDemoLogin = async (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
    setLoading(true);
    setError(null);

    const result = await adminAuth.login(demoEmail, demoPass);
    setLoading(false);

    if (result.success) {
      router.replace('/admin/dashboard');
    } else {
      setError(result.error || 'فشل تسجيل الدخول بالحساب التجريبي');
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070a13] text-stone-100 flex flex-col justify-between font-sans selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Top Header Bar */}
      <header className="px-6 py-4 flex items-center justify-between border-b border-stone-800/80 bg-[#0d121e]/80 backdrop-blur-md sticky top-0 z-50">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-lg shadow-amber-500/20 overflow-hidden">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src="/panggil-logo.jpg"
              alt="Panggil Official Logo"
              className="w-full h-full object-cover rounded-[10px]"
            />
          </div>
          <div>
            <h1 className="font-bold text-base tracking-wide flex items-center gap-2">
              <span>Panggil</span>
              <span className="text-amber-400 font-normal">| Super Admin</span>
            </h1>
            <p className="text-xs text-stone-400">بوابة الإدارة المركزية والتحكم</p>
          </div>
        </div>

        {/* Language Switcher */}
        <div className="flex items-center gap-1.5 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
          <Globe className="w-3.5 h-3.5 text-stone-400 mx-1.5" />
          <button
            type="button"
            onClick={() => setLang('ar')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              lang === 'ar' ? 'bg-amber-500 text-stone-950 font-bold shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            العربية
          </button>
          <button
            type="button"
            onClick={() => setLang('id')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              lang === 'id' ? 'bg-amber-500 text-stone-950 font-bold shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            Bahasa
          </button>
          <button
            type="button"
            onClick={() => setLang('en')}
            className={`px-2.5 py-1 rounded-lg font-medium transition-all ${
              lang === 'en' ? 'bg-amber-500 text-stone-950 font-bold shadow-sm' : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            English
          </button>
        </div>
      </header>

      {/* Main Login Card */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 my-6">
        <div className="w-full max-w-md bg-[#0d121e] border border-stone-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          {/* Subtle Accent Glow */}
          <div className="absolute top-0 right-0 w-48 h-48 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-blue-500/10 rounded-full blur-3xl pointer-events-none -ml-20 -mb-20" />

          {/* Heading */}
          <div className="relative text-center mb-8">
            <div className="inline-flex p-3 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 mb-3">
              <Lock className="w-6 h-6" />
            </div>
            <h2 className="text-2xl font-black text-stone-100 tracking-tight">{t.login.title}</h2>
            <p className="text-xs text-stone-400 mt-1 max-w-xs mx-auto leading-relaxed">{t.login.subtitle}</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-3.5 rounded-xl bg-red-950/40 border border-red-500/30 text-red-200 text-xs flex items-center gap-2.5 animate-fadeIn">
              <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="space-y-4 relative">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                {t.login.emailLabel}
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t.login.emailPlaceholder}
                  required
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-3 pl-10 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-left dir-ltr"
                />
                <Mail className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1.5">
                {t.login.passwordLabel}
              </label>
              <div className="relative">
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder={t.login.passwordPlaceholder}
                  required
                  className="w-full bg-stone-900/90 border border-stone-800 rounded-xl px-4 py-3 pl-10 text-sm text-stone-100 placeholder:text-stone-600 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500 transition-all text-left dir-ltr"
                />
                <Lock className="w-4 h-4 text-stone-500 absolute left-3.5 top-3.5" />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-3 px-4 bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold rounded-xl text-sm shadow-lg shadow-amber-500/20 flex items-center justify-center gap-2 transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-stone-950 border-t-transparent rounded-full animate-spin" />
                  <span>{t.login.loggingIn}</span>
                </>
              ) : (
                <>
                  <span>{t.login.submitButton}</span>
                  <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
                </>
              )}
            </button>
          </form>

          {/* Quick Demo Accounts Selector */}
          <div className="mt-8 pt-6 border-t border-stone-800/80 relative">
            <div className="flex items-center gap-1.5 mb-3 text-xs font-semibold text-stone-400">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>{t.login.demoAccountsTitle}</span>
            </div>

            <div className="grid grid-cols-1 gap-2">
              <button
                type="button"
                onClick={() => handleQuickDemoLogin('admin@panggil.id', 'admin123')}
                className="w-full p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-amber-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400 group-hover:scale-105 transition-transform">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200 group-hover:text-amber-400 transition-colors">
                      {t.login.roles.superAdmin}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono">admin@panggil.id (كامل الصلاحيات)</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-stone-600 group-hover:text-amber-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('onboarding@panggil.id', 'staff123')}
                className="w-full p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-blue-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-blue-500/10 flex items-center justify-center text-blue-400 group-hover:scale-105 transition-transform">
                    <Radio className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200 group-hover:text-blue-400 transition-colors">
                      {t.login.roles.onboardingStaff}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono">onboarding@panggil.id (تفعيل المقاهي والمنيو)</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-stone-600 group-hover:text-blue-400 transition-colors" />
              </button>

              <button
                type="button"
                onClick={() => handleQuickDemoLogin('support@panggil.id', 'support123')}
                className="w-full p-2.5 rounded-xl bg-stone-900 hover:bg-stone-850 border border-stone-800 hover:border-emerald-500/40 text-left transition-all flex items-center justify-between group cursor-pointer"
              >
                <div className="flex items-center gap-2.5">
                  <div className="w-7 h-7 rounded-lg bg-emerald-500/10 flex items-center justify-center text-emerald-400 group-hover:scale-105 transition-transform">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-stone-200 group-hover:text-emerald-400 transition-colors">
                      {t.login.roles.supportAgent}
                    </p>
                    <p className="text-[10px] text-stone-500 font-mono">support@panggil.id (خدمة العملاء وCRM)</p>
                  </div>
                </div>
                <UserCheck className="w-4 h-4 text-stone-600 group-hover:text-emerald-400 transition-colors" />
              </button>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-900">
        Panggil / نداء &copy; {new Date().getFullYear()} — Enterprise Multi-Tenant Pager System
      </footer>
    </div>
  );
}
