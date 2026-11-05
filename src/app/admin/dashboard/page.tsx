'use client';

import React, { useState, useEffect } from 'react';
import {
  Cafe,
  PlatformUser,
  SubscriptionTier,
  SubscriptionStatus,
  AppLanguage,
} from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { adminAuth } from '@/lib/admin-auth';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import {
  Store,
  Users,
  MessageSquare,
  BarChart3,
  Plus,
  Search,
  ExternalLink,
  Edit2,
  Trash2,
  Share2,
  UtensilsCrossed,
  ShieldAlert,
  ShieldCheck,
  CheckCircle2,
  Clock,
  KeyRound,
  Phone,
  Mail,
  Activity,
  AlertTriangle,
  Sparkles,
  DollarSign,
  TrendingUp,
} from 'lucide-react';
import { TenantWizardModal } from '../components/TenantWizardModal';
import { OnboardingKitModal } from '../components/OnboardingKitModal';
import { TenantMenuModal } from '../components/TenantMenuModal';
import { TenantSupportModal } from '../components/TenantSupportModal';
import { StaffModal } from '../components/StaffModal';
import { LiveDiagnosticsModal } from '../components/LiveDiagnosticsModal';

type AdminTab = 'overview' | 'tenants' | 'crm' | 'staff';

export default function AdminDashboardPage() {
  const [currentUser, setCurrentUser] = useState<PlatformUser | null>(null);
  const [lang, setLang] = useState<AppLanguage>('ar');
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');

  const [cafes, setCafes] = useState<Cafe[]>([]);
  const [staffUsers, setStaffUsers] = useState<PlatformUser[]>([]);
  const [loading, setLoading] = useState(true);

  // Search & Filter State for Tenants
  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Search for CRM
  const [crmSearchQuery, setCrmSearchQuery] = useState('');

  // Modals state
  const [wizardModalOpen, setWizardModalOpen] = useState(false);
  const [editingCafe, setEditingCafe] = useState<Cafe | null>(null);

  const [onboardingKitCafe, setOnboardingKitCafe] = useState<Cafe | null>(null);
  const [menuModalCafe, setMenuModalCafe] = useState<Cafe | null>(null);
  const [supportModalCafe, setSupportModalCafe] = useState<Cafe | null>(null);
  const [diagnosticsCafe, setDiagnosticsCafe] = useState<Cafe | null>(null);

  const [staffModalOpen, setStaffModalOpen] = useState(false);
  const [editingStaff, setEditingStaff] = useState<PlatformUser | null>(null);

  useEffect(() => {
    const user = adminAuth.getCurrentUser();
    setCurrentUser(user);
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setLoading(true);
    try {
      const [allCafes, allStaff] = await Promise.all([
        dataService.getAllCafes(),
        dataService.getPlatformUsers(),
      ]);
      setCafes(allCafes);
      setStaffUsers(allStaff);
    } finally {
      setLoading(false);
    }
  };

  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  // Permissions helpers
  const canCreateTenant = adminAuth.hasPermission(currentUser, 'can_create_tenant');
  const canEditTier = adminAuth.hasPermission(currentUser, 'can_edit_tier');
  const canSuspendTenant = adminAuth.hasPermission(currentUser, 'can_suspend_tenant');
  const canManageMenu = adminAuth.hasPermission(currentUser, 'can_manage_menu');
  const canViewCrm = adminAuth.hasPermission(currentUser, 'can_view_crm');
  const canManageStaff =
    currentUser?.role === 'super_admin' ||
    adminAuth.hasPermission(currentUser, 'can_manage_staff');

  // KPI Calculations
  const totalTenants = cafes.length;
  const activeTenants = cafes.filter((c) => (c.subscription_status || 'active') === 'active').length;
  const basicCount = cafes.filter((c) => c.subscription_tier === 'basic').length;
  const bronzeCount = cafes.filter((c) => c.subscription_tier === 'bronze').length;
  const silverCount = cafes.filter((c) => c.subscription_tier === 'silver').length;
  const goldCount = cafes.filter((c) => c.subscription_tier === 'gold').length;

  const now = new Date();
  const expiringSoonCount = cafes.filter((c) => {
    if (!c.subscription_expires_at) return false;
    const exp = new Date(c.subscription_expires_at);
    const diffDays = (exp.getTime() - now.getTime()) / (1000 * 3600 * 24);
    return diffDays >= 0 && diffDays <= 30;
  }).length;

  // Monthly Revenue Estimate in IDR
  const mrrEstimate =
    basicCount * 99000 +
    bronzeCount * 199000 +
    silverCount * 349000 +
    goldCount * 599000;

  // Filtered cafes
  const filteredCafes = cafes.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.slug.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.phone && c.phone.includes(searchQuery)) ||
      (c.owner_name && c.owner_name.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesTier = tierFilter === 'all' || c.subscription_tier === tierFilter;
    const matchesStatus =
      statusFilter === 'all' || (c.subscription_status || 'active') === statusFilter;

    return matchesSearch && matchesTier && matchesStatus;
  });

  // Filtered CRM Directory
  const filteredCrmCafes = cafes.filter((c) => {
    return (
      (c.owner_name && c.owner_name.toLowerCase().includes(crmSearchQuery.toLowerCase())) ||
      c.name.toLowerCase().includes(crmSearchQuery.toLowerCase()) ||
      (c.owner_phone && c.owner_phone.includes(crmSearchQuery)) ||
      (c.owner_email && c.owner_email.toLowerCase().includes(crmSearchQuery.toLowerCase()))
    );
  });

  // Actions
  const handleToggleSuspend = async (cafe: Cafe) => {
    const currentStatus = cafe.subscription_status || 'active';
    const newStatus: SubscriptionStatus = currentStatus === 'suspended' ? 'active' : 'suspended';
    const updated = await dataService.updateCafe(cafe.id, { subscription_status: newStatus });
    if (updated) {
      setCafes((prev) => prev.map((c) => (c.id === cafe.id ? updated : c)));
    }
  };

  const handleDeleteCafe = async (cafeId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه المنشأة نهائياً من المنصة؟')) return;
    await dataService.deleteCafe(cafeId);
    setCafes((prev) => prev.filter((c) => c.id !== cafeId));
  };

  const handleCafeSaved = (savedCafe: Cafe) => {
    setCafes((prev) => {
      const idx = prev.findIndex((c) => c.id === savedCafe.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedCafe;
        return next;
      }
      return [savedCafe, ...prev];
    });
  };

  const handleStaffSaved = (savedStaff: PlatformUser) => {
    setStaffUsers((prev) => {
      const idx = prev.findIndex((u) => u.id === savedStaff.id);
      if (idx >= 0) {
        const next = [...prev];
        next[idx] = savedStaff;
        return next;
      }
      return [savedStaff, ...prev];
    });
  };

  return (
    <div className="space-y-6">
      {/* Navigation Tabs Bar */}
      <div className="flex flex-wrap items-center justify-between gap-4 border-b border-stone-800/80 pb-4">
        <div className="flex items-center gap-2 bg-[#0d121e] p-1.5 rounded-2xl border border-stone-800">
          <button
            type="button"
            onClick={() => setActiveTab('overview')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'overview'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>{t.navigation.overview}</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('tenants')}
            className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
              activeTab === 'tenants'
                ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                : 'text-stone-400 hover:text-stone-200'
            }`}
          >
            <Store className="w-4 h-4" />
            <span>{t.navigation.tenants}</span>
            <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-800 text-stone-300">
              {cafes.length}
            </span>
          </button>

          {canViewCrm && (
            <button
              type="button"
              onClick={() => setActiveTab('crm')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'crm'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <MessageSquare className="w-4 h-4" />
              <span>{t.navigation.crm}</span>
            </button>
          )}

          {canManageStaff && (
            <button
              type="button"
              onClick={() => setActiveTab('staff')}
              className={`px-4 py-2 rounded-xl text-xs font-bold flex items-center gap-2 transition-all cursor-pointer ${
                activeTab === 'staff'
                  ? 'bg-amber-500 text-stone-950 shadow-md shadow-amber-500/20'
                  : 'text-stone-400 hover:text-stone-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>{t.navigation.staff}</span>
              <span className="px-1.5 py-0.5 rounded-md text-[10px] bg-stone-800 text-stone-300">
                {staffUsers.length}
              </span>
            </button>
          )}
        </div>

        {/* Global CTA */}
        {canCreateTenant && (
          <button
            type="button"
            onClick={() => {
              setEditingCafe(null);
              setWizardModalOpen(true);
            }}
            className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>{t.tenants.addNew}</span>
          </button>
        )}
      </div>

      {/* TAB 1: OVERVIEW & KPIS */}
      {activeTab === 'overview' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Top KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-5 rounded-3xl bg-[#0d121e] border border-stone-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">{t.kpis.totalTenants}</span>
                <Store className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-stone-100 font-mono">{totalTenants}</p>
              <p className="text-[11px] text-emerald-400 mt-2 flex items-center gap-1 font-semibold">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{activeTenants} نشطة وتعمل بكفاءة</span>
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0d121e] border border-stone-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">{t.kpis.expiringSoon}</span>
                <Clock className="w-4 h-4 text-amber-400" />
              </div>
              <p className="text-3xl font-black text-amber-400 font-mono">{expiringSoonCount}</p>
              <p className="text-[11px] text-stone-500 mt-2">بحاجة للتواصل والتجديد</p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0d121e] border border-stone-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">{t.kpis.monthlyRevenueEstimate}</span>
                <TrendingUp className="w-4 h-4 text-emerald-400" />
              </div>
              <p className="text-2xl font-black text-emerald-400 font-mono">
                Rp {mrrEstimate.toLocaleString()}
              </p>
              <p className="text-[11px] text-stone-500 mt-2 font-mono">
                ~ SAR {(mrrEstimate / 4200).toFixed(0)} شهرياً
              </p>
            </div>

            <div className="p-5 rounded-3xl bg-[#0d121e] border border-stone-800 relative overflow-hidden">
              <div className="flex items-center justify-between text-stone-400 mb-2">
                <span className="text-xs font-semibold">فريق العمل النشط</span>
                <Users className="w-4 h-4 text-purple-400" />
              </div>
              <p className="text-3xl font-black text-purple-400 font-mono">
                {staffUsers.filter((u) => u.is_active).length}
              </p>
              <p className="text-[11px] text-stone-500 mt-2">بصلاحيات مركزية آمنة</p>
            </div>
          </div>

          {/* Subscription Tiers Breakdown */}
          <div className="p-6 rounded-3xl bg-[#0d121e] border border-stone-800">
            <h3 className="text-sm font-bold text-stone-200 mb-4 flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-amber-400" />
              <span>{t.kpis.tierBreakdownTitle}</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Basic */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
                <div>
                  <p className="text-xs text-stone-400 font-semibold">{t.kpis.basicCount}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">بيجر فقط (Rp 99k)</p>
                </div>
                <span className="text-2xl font-black text-stone-200 font-mono">{basicCount}</span>
              </div>

              {/* Bronze */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-amber-900/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-400 font-semibold">{t.kpis.bronzeCount}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">بيجر + تقييم (Rp 199k)</p>
                </div>
                <span className="text-2xl font-black text-amber-400 font-mono">{bronzeCount}</span>
              </div>

              {/* Silver */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-slate-700/50 flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-300 font-semibold">{t.kpis.silverCount}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">بيجر + منيو (Rp 349k)</p>
                </div>
                <span className="text-2xl font-black text-slate-300 font-mono">{silverCount}</span>
              </div>

              {/* Gold */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-amber-500/30 flex items-center justify-between">
                <div>
                  <p className="text-xs text-amber-300 font-semibold">{t.kpis.goldCount}</p>
                  <p className="text-[11px] text-stone-500 mt-0.5">شامل وهُوِيَّة (Rp 599k)</p>
                </div>
                <span className="text-2xl font-black text-amber-300 font-mono">{goldCount}</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: TENANTS & SUBSCRIPTIONS */}
      {activeTab === 'tenants' && (
        <div className="space-y-4 animate-fadeIn">
          {/* Filters Bar */}
          <div className="flex flex-col sm:flex-row items-center gap-3 bg-[#0d121e] p-4 rounded-3xl border border-stone-800">
            <div className="relative flex-1 w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t.tenants.searchPlaceholder}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-all"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <select
                value={tierFilter}
                onChange={(e) => setTierFilter(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">{t.tenants.allTiers}</option>
                <option value="basic">Basic (الأساسية)</option>
                <option value="bronze">Bronze (البرونزية)</option>
                <option value="silver">Silver (الفضية)</option>
                <option value="gold">Gold (الذهبية)</option>
              </select>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-300 focus:outline-none focus:border-amber-500"
              >
                <option value="all">{t.tenants.allStatuses}</option>
                <option value="active">Active (نشط)</option>
                <option value="trial">Trial (تجريبي)</option>
                <option value="expired">Expired (منتهي)</option>
                <option value="suspended">Suspended (موقوف)</option>
              </select>
            </div>
          </div>

          {/* Tenants Data Table */}
          <div className="bg-[#0d121e] rounded-3xl border border-stone-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-900/60 border-b border-stone-800 text-stone-400 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">{t.tenants.columns.cafe}</th>
                    <th className="py-3.5 px-4">{t.tenants.columns.tier}</th>
                    <th className="py-3.5 px-4">{t.tenants.columns.status}</th>
                    <th className="py-3.5 px-4">{t.tenants.columns.pin}</th>
                    <th className="py-3.5 px-4">{t.tenants.columns.expiresAt}</th>
                    <th className="py-3.5 px-4 text-center">{t.tenants.columns.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-200">
                  {filteredCafes.map((cafe) => {
                    const status = cafe.subscription_status || 'active';
                    return (
                      <tr key={cafe.id} className="hover:bg-stone-900/40 transition-colors">
                        {/* Name & Slug */}
                        <td className="py-4 px-4">
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center text-stone-300 overflow-hidden shrink-0">
                              {cafe.logo_url ? (
                                <img
                                  src={cafe.logo_url}
                                  alt={cafe.name}
                                  className="w-full h-full object-cover"
                                />
                              ) : (
                                <Store className="w-4 h-4 text-amber-400" />
                              )}
                            </div>
                            <div>
                              <p className="font-bold text-stone-100">{cafe.name}</p>
                              <p className="text-[10px] text-stone-500 font-mono">
                                /c/{cafe.slug}
                              </p>
                            </div>
                          </div>
                        </td>

                        {/* Tier */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-bold uppercase tracking-wider ${
                              cafe.subscription_tier === 'gold'
                                ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                                : cafe.subscription_tier === 'silver'
                                ? 'bg-slate-500/20 text-slate-300 border border-slate-500/40'
                                : cafe.subscription_tier === 'bronze'
                                ? 'bg-orange-500/20 text-orange-400 border border-orange-500/40'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {cafe.subscription_tier}
                          </span>
                        </td>

                        {/* Status */}
                        <td className="py-4 px-4">
                          <span
                            className={`px-2.5 py-1 rounded-lg text-[10px] font-semibold ${
                              status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : status === 'trial'
                                ? 'bg-blue-500/10 text-blue-400 border border-blue-500/20'
                                : status === 'suspended'
                                ? 'bg-red-500/10 text-red-400 border border-red-500/20'
                                : 'bg-stone-800 text-stone-400'
                            }`}
                          >
                            {t.tenants.badges[status]}
                          </span>
                        </td>

                        {/* Cashier PIN */}
                        <td className="py-4 px-4 font-mono font-bold text-amber-400">
                          {cafe.cashier_pin || '1234'}
                        </td>

                        {/* Expiration */}
                        <td className="py-4 px-4 text-stone-400 font-mono text-[11px]">
                          {cafe.subscription_expires_at
                            ? new Date(cafe.subscription_expires_at).toLocaleDateString()
                            : 'دائم'}
                        </td>

                        {/* Action Buttons */}
                        <td className="py-4 px-4">
                          <div className="flex items-center justify-center gap-1.5">
                            {/* Onboarding Kit */}
                            <button
                              type="button"
                              onClick={() => setOnboardingKitCafe(cafe)}
                              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-emerald-400 transition-colors"
                              title={t.tenants.actions.onboardingKit}
                            >
                              <Share2 className="w-3.5 h-3.5" />
                            </button>

                            {/* Menu Builder (Silver / Gold) */}
                            {canManageMenu && (cafe.subscription_tier === 'silver' || cafe.subscription_tier === 'gold') && (
                              <button
                                type="button"
                                onClick={() => setMenuModalCafe(cafe)}
                                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 transition-colors"
                                title={t.tenants.actions.menuBuilder}
                              >
                                <UtensilsCrossed className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Live Diagnostics */}
                            <button
                              type="button"
                              onClick={() => setDiagnosticsCafe(cafe)}
                              className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-cyan-400 transition-colors"
                              title="فحص حالة الطابور المباشر"
                            >
                              <Activity className="w-3.5 h-3.5" />
                            </button>

                            {/* Edit Cafe */}
                            {canEditTier && (
                              <button
                                type="button"
                                onClick={() => {
                                  setEditingCafe(cafe);
                                  setWizardModalOpen(true);
                                }}
                                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors"
                                title={t.tenants.actions.edit}
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Suspend / Activate */}
                            {canSuspendTenant && (
                              <button
                                type="button"
                                onClick={() => handleToggleSuspend(cafe)}
                                className={`p-2 rounded-xl transition-colors ${
                                  status === 'suspended'
                                    ? 'bg-emerald-950/40 text-emerald-400 hover:bg-emerald-900/40'
                                    : 'bg-red-950/40 text-red-400 hover:bg-red-900/40'
                                }`}
                                title={
                                  status === 'suspended'
                                    ? t.tenants.actions.activate
                                    : t.tenants.actions.suspend
                                }
                              >
                                <ShieldAlert className="w-3.5 h-3.5" />
                              </button>
                            )}

                            {/* Delete */}
                            {currentUser?.role === 'super_admin' && (
                              <button
                                type="button"
                                onClick={() => handleDeleteCafe(cafe.id)}
                                className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-500 hover:text-red-400 transition-colors"
                                title={t.tenants.actions.delete}
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            )}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {filteredCafes.length === 0 && (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-stone-500">
                        لا توجد منشآت مطابقة لشروط البحث.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: CRM & CUSTOMER SUPPORT HUB */}
      {activeTab === 'crm' && (
        <div className="space-y-4 animate-fadeIn">
          {/* CRM Search Bar */}
          <div className="bg-[#0d121e] p-4 rounded-3xl border border-stone-800">
            <div className="relative">
              <input
                type="text"
                value={crmSearchQuery}
                onChange={(e) => setCrmSearchQuery(e.target.value)}
                placeholder={t.crm.searchPlaceholder}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-4 py-2.5 pl-10 text-xs text-stone-100 placeholder:text-stone-600 focus:outline-none focus:border-amber-500 transition-all"
              />
              <Search className="w-4 h-4 text-stone-500 absolute left-3 top-3" />
            </div>
          </div>

          {/* CRM Directory Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredCrmCafes.map((cafe) => {
              const cleanPhone = (cafe.owner_phone || '').replace(/[^\d+]/g, '');
              const notesCount = (cafe.support_notes || []).length;
              return (
                <div
                  key={cafe.id}
                  className="p-5 rounded-3xl bg-[#0d121e] border border-stone-800 flex flex-col justify-between space-y-4 shadow-xl hover:border-stone-700 transition-all"
                >
                  <div>
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-stone-100 text-sm">{cafe.name}</h4>
                        <p className="text-xs text-amber-400 mt-0.5 font-medium">
                          {cafe.owner_name || 'المالك غير محدد'}
                        </p>
                      </div>
                      <span className="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase bg-stone-900 text-stone-300 border border-stone-800">
                        {cafe.subscription_tier}
                      </span>
                    </div>

                    <div className="mt-3 space-y-1 text-xs text-stone-400 font-mono">
                      {cafe.owner_phone && (
                        <p className="flex items-center gap-1.5">
                          <Phone className="w-3.5 h-3.5 text-stone-500" />
                          <span>{cafe.owner_phone}</span>
                        </p>
                      )}
                      {cafe.owner_email && (
                        <p className="flex items-center gap-1.5">
                          <Mail className="w-3.5 h-3.5 text-stone-500" />
                          <span>{cafe.owner_email}</span>
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Actions & Follow up */}
                  <div className="pt-3 border-t border-stone-800/80 flex items-center justify-between gap-2">
                    <button
                      type="button"
                      onClick={() => setSupportModalCafe(cafe)}
                      className="flex-1 py-2 px-3 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                    >
                      <MessageSquare className="w-3.5 h-3.5" />
                      <span>{t.crm.logNote} ({notesCount})</span>
                    </button>

                    {cleanPhone && (
                      <a
                        href={`https://wa.me/${cleanPhone.replace('+', '')}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white transition-colors"
                        title="مراسلة واتساب"
                      >
                        <Phone className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 4: STAFF & ROLES (RBAC) */}
      {activeTab === 'staff' && canManageStaff && (
        <div className="space-y-4 animate-fadeIn">
          <div className="flex items-center justify-between bg-[#0d121e] p-4 rounded-3xl border border-stone-800">
            <div>
              <h3 className="font-bold text-sm text-stone-100">{t.staff.title}</h3>
              <p className="text-xs text-stone-400">{t.staff.subtitle}</p>
            </div>
            <button
              type="button"
              onClick={() => {
                setEditingStaff(null);
                setStaffModalOpen(true);
              }}
              className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{t.staff.addNew}</span>
            </button>
          </div>

          {/* Staff Table */}
          <div className="bg-[#0d121e] rounded-3xl border border-stone-800 overflow-hidden shadow-2xl">
            <div className="overflow-x-auto">
              <table className="w-full text-right text-xs">
                <thead className="bg-stone-900/60 border-b border-stone-800 text-stone-400 font-semibold">
                  <tr>
                    <th className="py-3.5 px-4">{t.staff.columns.member}</th>
                    <th className="py-3.5 px-4">{t.staff.columns.role}</th>
                    <th className="py-3.5 px-4">{t.staff.columns.status}</th>
                    <th className="py-3.5 px-4">{t.staff.columns.lastLogin}</th>
                    <th className="py-3.5 px-4 text-center">{t.staff.columns.actions}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-800/60 text-stone-200">
                  {staffUsers.map((member) => (
                    <tr key={member.id} className="hover:bg-stone-900/40 transition-colors">
                      <td className="py-4 px-4">
                        <div className="flex items-center gap-2.5">
                          <div className="w-8 h-8 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <p className="font-bold text-stone-100">{member.name}</p>
                            <p className="text-[10px] text-stone-500 font-mono">{member.email}</p>
                          </div>
                        </div>
                      </td>

                      <td className="py-4 px-4 font-semibold text-purple-300">
                        {t.staff.roles[member.role] || member.role}
                      </td>

                      <td className="py-4 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            member.is_active
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : 'bg-red-500/10 text-red-400 border border-red-500/20'
                          }`}
                        >
                          {member.is_active ? t.staff.active : t.staff.disabled}
                        </span>
                      </td>

                      <td className="py-4 px-4 text-stone-400 font-mono text-[11px]">
                        {member.last_login_at
                          ? new Date(member.last_login_at).toLocaleDateString()
                          : 'لم يسجل دخول'}
                      </td>

                      <td className="py-4 px-4 text-center">
                        <button
                          type="button"
                          onClick={() => {
                            setEditingStaff(member);
                            setStaffModalOpen(true);
                          }}
                          className="p-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-stone-300 transition-colors"
                          title={t.staff.editMember}
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ALL MODALS */}
      {wizardModalOpen && (
        <TenantWizardModal
          cafe={editingCafe}
          isOpen={wizardModalOpen}
          onClose={() => setWizardModalOpen(false)}
          onSaved={handleCafeSaved}
          lang={lang}
        />
      )}

      {onboardingKitCafe && (
        <OnboardingKitModal
          cafe={onboardingKitCafe}
          isOpen={!!onboardingKitCafe}
          onClose={() => setOnboardingKitCafe(null)}
          lang={lang}
        />
      )}

      {menuModalCafe && (
        <TenantMenuModal
          cafe={menuModalCafe}
          isOpen={!!menuModalCafe}
          onClose={() => setMenuModalCafe(null)}
          lang={lang}
        />
      )}

      {supportModalCafe && (
        <TenantSupportModal
          cafe={supportModalCafe}
          currentUser={currentUser}
          isOpen={!!supportModalCafe}
          onClose={() => setSupportModalCafe(null)}
          lang={lang}
          onNoteAdded={(newNote) => {
            setCafes((prev) =>
              prev.map((c) =>
                c.id === supportModalCafe.id
                  ? { ...c, support_notes: [newNote, ...(c.support_notes || [])] }
                  : c
              )
            );
          }}
        />
      )}

      {diagnosticsCafe && (
        <LiveDiagnosticsModal
          cafe={diagnosticsCafe}
          isOpen={!!diagnosticsCafe}
          onClose={() => setDiagnosticsCafe(null)}
          lang={lang}
        />
      )}

      {staffModalOpen && (
        <StaffModal
          user={editingStaff}
          isOpen={staffModalOpen}
          onClose={() => setStaffModalOpen(false)}
          onSaved={handleStaffSaved}
          lang={lang}
        />
      )}
    </div>
  );
}
