'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { adminAuth } from '@/lib/admin-auth';
import { PlatformUser, AppLanguage } from '@/types/database';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import {
  ShieldCheck,
  LogOut,
  Globe,
  Home,
  User,
  Radio,
  CheckCircle2,
} from 'lucide-react';
import Link from 'next/link';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin/login';

  const [currentUser, setCurrentUser] = useState<PlatformUser | null>(null);
  const [lang, setLang] = useState<AppLanguage>('ar');
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    const user = adminAuth.getCurrentUser();
    setCurrentUser(user);

    if (!user && !isLoginPage) {
      router.replace('/admin/login');
    }

    const handleSessionChange = (e: CustomEvent<PlatformUser | null>) => {
      setCurrentUser(e.detail);
      if (!e.detail && !isLoginPage) {
        router.replace('/admin/login');
      }
    };

    window.addEventListener(
      'panggil_admin_session_changed',
      handleSessionChange as EventListener
    );
    return () => {
      window.removeEventListener(
        'panggil_admin_session_changed',
        handleSessionChange as EventListener
      );
    };
  }, [router, isLoginPage]);

  const handleLogout = () => {
    adminAuth.logout();
    router.replace('/admin/login');
  };

  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  if (!mounted) {
    return <div className="min-h-screen bg-[#070a13]" />;
  }

  // If on login page, just render children directly
  if (isLoginPage) {
    return <>{children}</>;
  }

  // If unauthenticated and not on login page, don't flash dashboard
  if (!currentUser) {
    return (
      <div className="min-h-screen bg-[#070a13] flex items-center justify-center text-stone-400 text-sm">
        <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2" />
        <span>جاري التحقق من الصلاحيات...</span>
      </div>
    );
  }

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#070a13] text-stone-100 flex flex-col font-sans selection:bg-amber-500/30 selection:text-amber-200"
    >
      {/* Top Admin Header Bar */}
      <header className="px-6 py-3.5 flex items-center justify-between border-b border-stone-800/80 bg-[#0d121e]/90 backdrop-blur-md sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <Link href="/admin/dashboard" className="flex items-center gap-3 group">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-amber-500 to-amber-300 p-0.5 shadow-md shadow-amber-500/10 group-hover:scale-105 transition-transform">
              <div className="w-full h-full bg-[#070a13] rounded-[10px] flex items-center justify-center">
                <ShieldCheck className="w-4 h-4 text-amber-400" />
              </div>
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide flex items-center gap-1.5">
                <span>Panggil</span>
                <span className="text-amber-400 font-normal">| {t.portalTitle}</span>
              </h1>
              <p className="text-[10px] text-stone-400">{t.portalSubtitle}</p>
            </div>
          </Link>
        </div>

        {/* User Badges, Lang Switcher & Actions */}
        <div className="flex items-center gap-3">
          {/* Active User Badge */}
          <div className="hidden sm:flex items-center gap-2 bg-stone-900/90 border border-stone-800 px-3 py-1.5 rounded-xl text-xs">
            <div className="w-6 h-6 rounded-lg bg-amber-500/10 flex items-center justify-center text-amber-400">
              <User className="w-3.5 h-3.5" />
            </div>
            <div className="text-right">
              <p className="font-bold text-stone-200 leading-tight">{currentUser.name}</p>
              <p className="text-[10px] text-amber-400 font-medium">
                {t.login.roles[
                  currentUser.role === 'super_admin'
                    ? 'superAdmin'
                    : currentUser.role === 'onboarding_staff'
                    ? 'onboardingStaff'
                    : 'supportAgent'
                ]}
              </p>
            </div>
          </div>

          {/* Language Switcher */}
          <div className="flex items-center gap-1 bg-stone-900/90 p-1 rounded-xl border border-stone-800 text-xs">
            <Globe className="w-3.5 h-3.5 text-stone-400 mx-1" />
            <button
              type="button"
              onClick={() => setLang('ar')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                lang === 'ar'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              عربي
            </button>
            <button
              type="button"
              onClick={() => setLang('id')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                lang === 'id'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              ID
            </button>
            <button
              type="button"
              onClick={() => setLang('en')}
              className={`px-2 py-0.5 rounded-lg font-medium transition-all ${
                lang === 'en'
                  ? 'bg-amber-500 text-stone-950 font-bold'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              EN
            </button>
          </div>

          {/* Back to Home Link */}
          <Link
            href="/"
            className="hidden md:flex items-center gap-1 px-3 py-1.5 rounded-xl border border-stone-800 text-stone-400 hover:text-stone-200 hover:bg-stone-900 text-xs transition-colors"
          >
            <Home className="w-3.5 h-3.5" />
            <span>{t.navigation.backToHome}</span>
          </Link>

          {/* Logout Button */}
          <button
            type="button"
            onClick={handleLogout}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-red-950/40 hover:bg-red-900/40 border border-red-500/30 text-red-300 hover:text-red-200 text-xs font-semibold transition-all cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">{t.navigation.logout}</span>
          </button>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="flex-1 p-4 sm:p-6 max-w-7xl mx-auto w-full">
        {React.isValidElement(children)
          ? React.cloneElement(children as React.ReactElement<{ currentUser?: PlatformUser; lang?: AppLanguage }>, {
              currentUser,
              lang,
            })
          : children}
      </main>

      {/* Footer */}
      <footer className="py-4 text-center text-xs text-stone-500 border-t border-stone-900">
        Panggil / نداء &copy; {new Date().getFullYear()} — Enterprise Multi-Tenant Pager System
      </footer>
    </div>
  );
}
