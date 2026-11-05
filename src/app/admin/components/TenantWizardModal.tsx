'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cafe, SubscriptionTier, CafeMode, SubscriptionStatus, AppLanguage } from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import {
  X,
  Save,
  Store,
  User,
  Shield,
  Palette,
  MapPin,
  Upload,
  Percent,
  Calendar,
  Image as ImageIcon,
  Trash2,
} from 'lucide-react';

interface TenantWizardModalProps {
  cafe?: Cafe | null; // if provided, editing existing; otherwise creating new
  isOpen: boolean;
  onClose: () => void;
  onSaved: (cafe: Cafe) => void;
  lang: AppLanguage;
}

export function TenantWizardModal({
  cafe,
  isOpen,
  onClose,
  onSaved,
  lang,
}: TenantWizardModalProps) {
  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';
  const isEditing = !!cafe;
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [name, setName] = useState(cafe?.name || '');
  const [slug, setSlug] = useState(cafe?.slug || '');
  const [tier, setTier] = useState<SubscriptionTier>(cafe?.subscription_tier || 'silver');
  const [mode, setMode] = useState<CafeMode>(cafe?.mode || 'menu_pager');
  const [pin, setPin] = useState(cafe?.cashier_pin || '1234');
  const [status, setStatus] = useState<SubscriptionStatus>(cafe?.subscription_status || 'active');

  // Item 1: Tax Rate %
  const [taxRate, setTaxRate] = useState<number>(cafe?.tax_rate ?? 10);

  // Item 3: Subscription Duration (Monthly vs Annual) & Auto-calculated Expiration
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>(cafe?.billing_cycle || 'annual');
  const [expiresAt, setExpiresAt] = useState(
    cafe?.subscription_expires_at
      ? cafe.subscription_expires_at.slice(0, 10)
      : new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
  );

  // Owner CRM
  const [ownerName, setOwnerName] = useState(cafe?.owner_name || '');
  const [ownerPhone, setOwnerPhone] = useState(cafe?.owner_phone || '');
  const [ownerEmail, setOwnerEmail] = useState(cafe?.owner_email || '');

  // Item 4: Branding, Logo URL / Device Upload, and Google Maps
  const [googleMapsUrl, setGoogleMapsUrl] = useState(cafe?.google_maps_url || '');
  const [logoUrl, setLogoUrl] = useState(cafe?.logo_url || cafe?.custom_branding?.logo_url || '');
  const [primaryColor, setPrimaryColor] = useState(cafe?.custom_branding?.primary_color || '#f59e0b');

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state whenever cafe changes or modal opens
  useEffect(() => {
    if (cafe) {
      setName(cafe.name || '');
      setSlug(cafe.slug || '');
      setTier(cafe.subscription_tier || 'silver');
      setMode(cafe.mode || 'menu_pager');
      setPin(cafe.cashier_pin || '1234');
      setStatus(cafe.subscription_status || 'active');
      setTaxRate(typeof cafe.tax_rate === 'number' ? cafe.tax_rate : 10);
      setBillingCycle(cafe.billing_cycle || 'annual');
      setExpiresAt(
        cafe.subscription_expires_at
          ? cafe.subscription_expires_at.slice(0, 10)
          : new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10)
      );
      setOwnerName(cafe.owner_name || '');
      setOwnerPhone(cafe.owner_phone || '');
      setOwnerEmail(cafe.owner_email || '');
      setGoogleMapsUrl(cafe.google_maps_url || '');
      setLogoUrl(cafe.logo_url || cafe.custom_branding?.logo_url || '');
      setPrimaryColor(cafe.custom_branding?.primary_color || '#f59e0b');
    } else {
      setName('');
      setSlug('');
      setTier('silver');
      setMode('menu_pager');
      setPin('1234');
      setStatus('active');
      setTaxRate(10);
      setBillingCycle('annual');
      setExpiresAt(new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString().slice(0, 10));
      setOwnerName('');
      setOwnerPhone('');
      setOwnerEmail('');
      setGoogleMapsUrl('');
      setLogoUrl('');
      setPrimaryColor('#f59e0b');
    }
    setError(null);
  }, [cafe, isOpen]);

  if (!isOpen) return null;

  // Auto-calculate expiration date when changing billing cycle
  const handleBillingCycleChange = (cycle: 'monthly' | 'annual') => {
    setBillingCycle(cycle);
    const now = new Date();
    if (cycle === 'monthly') {
      const nextMonth = new Date(now.setMonth(now.getMonth() + 1));
      setExpiresAt(nextMonth.toISOString().slice(0, 10));
    } else {
      const nextYear = new Date(now.setFullYear(now.getFullYear() + 1));
      setExpiresAt(nextYear.toISOString().slice(0, 10));
    }
  };

  // Auto-slug from name if empty
  const handleNameChange = (val: string) => {
    setName(val);
    if (!isEditing && (!slug || slug === '')) {
      const generated = val
        .toLowerCase()
        .replace(/[^\w\s-]/g, '')
        .replace(/\s+/g, '-')
        .replace(/--+/g, '-');
      if (generated) setSlug(generated);
    }
  };

  const handleTierChange = (newTier: SubscriptionTier) => {
    setTier(newTier);
    if (newTier === 'basic' || newTier === 'bronze') {
      setMode('pager_only');
    } else {
      setMode('menu_pager');
    }
  };

  // Handle Logo file upload from device
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.size > 4 * 1024 * 1024) {
      alert('حجم الصورة كبير جداً، يرجى اختيار صورة أقل من 4 ميجابايت');
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      const base64 = event.target?.result as string;
      if (base64) {
        setLogoUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('يرجى إدخال اسم المنشأة أو المقهى');
      return;
    }
    const cleanSlug = (slug || name.toLowerCase().replace(/\s+/g, '-'))
      .trim()
      .replace(/[^\w-]/g, '');

    if (!cleanSlug) {
      setError('يرجى إدخال معرف صحيح للرابط (Slug)');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      const expirationIso = new Date(expiresAt + 'T23:59:59Z').toISOString();

      if (isEditing && cafe) {
        const updated = await dataService.updateCafe(cafe.id, {
          name,
          slug: cleanSlug,
          subscription_tier: tier,
          mode,
          cashier_pin: pin,
          tax_rate: Number(taxRate) || 0,
          billing_cycle: billingCycle,
          subscription_status: status,
          subscription_expires_at: expirationIso,
          owner_name: ownerName,
          owner_phone: ownerPhone,
          owner_email: ownerEmail,
          google_maps_url: googleMapsUrl,
          logo_url: logoUrl,
          custom_branding: {
            logo_url: logoUrl,
            primary_color: primaryColor,
            hide_powered_by: tier === 'gold',
          },
        });
        if (updated) onSaved(updated);
      } else {
        const created = await dataService.createCafe({
          name,
          slug: cleanSlug,
          mode,
          default_lang: lang,
          subscription_tier: tier,
          subscription_status: status,
          subscription_expires_at: expirationIso,
          cashier_pin: pin,
          tax_rate: Number(taxRate) || 0,
          billing_cycle: billingCycle,
          owner_name: ownerName,
          owner_phone: ownerPhone,
          owner_email: ownerEmail,
          google_maps_url: googleMapsUrl,
          logo_url: logoUrl,
          custom_branding: {
            logo_url: logoUrl,
            primary_color: primaryColor,
            hide_powered_by: tier === 'gold',
          },
          support_notes: [],
        });
        onSaved(created);
      }
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'حدث خطأ أثناء حفظ البيانات');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d121e] border border-stone-800 rounded-3xl w-full max-w-2xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Modal Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <Store className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100">
                {isEditing ? t.tenantWizard.editTitle : t.tenantWizard.createTitle}
              </h3>
              <p className="text-xs text-stone-400">
                {isEditing ? cafe?.name : 'إعداد منشأة جديدة وتعيين الخصائص'}
              </p>
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

        {/* Modal Body / Scrollable Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-6">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}

          {/* Section 1: Venue Basic Info */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-800/80 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Store className="w-3.5 h-3.5" />
              <span>{t.tenantWizard.basicInfo}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.nameLabel} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => handleNameChange(e.target.value)}
                  placeholder={t.tenantWizard.namePlaceholder}
                  required
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.slugLabel} <span className="text-red-400">*</span>
                </label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder={t.tenantWizard.slugPlaceholder}
                  required
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all font-mono text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.tierLabel}
                </label>
                <select
                  value={tier}
                  onChange={(e) => handleTierChange(e.target.value as SubscriptionTier)}
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all"
                >
                  <option value="basic">الأساسية (Basic - Rp 99.000) - بيجر فقط</option>
                  <option value="bronze">البرونزية (Bronze - Rp 199.000) - بيجر + تقييم جوجل</option>
                  <option value="silver">الفضية (Silver - Rp 349.000) - بيجر + تقييم + منيو وفواتير</option>
                  <option value="gold">الذهبية (Gold - Rp 599.000) - المزايا كاملة + هوية بصرية مخصصة</option>
                </select>
              </div>

              {/* Item 2: Cashier PIN */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.pinLabel}
                </label>
                <input
                  type="text"
                  maxLength={6}
                  value={pin}
                  onChange={(e) => setPin(e.target.value)}
                  placeholder="1234"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-amber-400 font-bold focus:outline-none focus:border-amber-500 transition-all font-mono text-center"
                />
              </div>

              {/* Item 1: Tax Rate % Field */}
              <div className="md:col-span-2">
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  نسبة الضريبة المضافة المطبقة (%) (Tax Rate)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    min="0"
                    max="100"
                    step="0.5"
                    value={taxRate}
                    onChange={(e) => setTaxRate(Number(e.target.value))}
                    placeholder="10"
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 pl-10 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all font-mono"
                  />
                  <Percent className="w-4 h-4 text-stone-500 absolute left-3.5 top-3" />
                </div>
                <p className="text-[10px] text-stone-500 mt-1">
                  تُحسب هذه النسبة تلقائياً في شاشة الفاتورة والمنيو الرقمي (ضع 0 إذا كانت الأسعار معفاة من الضريبة).
                </p>
              </div>
            </div>
          </div>

          {/* Section 2: Owner Contact & CRM */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-800/80 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <User className="w-3.5 h-3.5" />
              <span>{t.tenantWizard.ownerInfo}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.ownerNameLabel}
                </label>
                <input
                  type="text"
                  value={ownerName}
                  onChange={(e) => setOwnerName(e.target.value)}
                  placeholder="مثال: فهد الشمري"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.ownerPhoneLabel}
                </label>
                <input
                  type="tel"
                  value={ownerPhone}
                  onChange={(e) => setOwnerPhone(e.target.value)}
                  placeholder="+966501234567"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all font-mono text-left dir-ltr"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.ownerEmailLabel}
                </label>
                <input
                  type="email"
                  value={ownerEmail}
                  onChange={(e) => setOwnerEmail(e.target.value)}
                  placeholder="owner@cafe.com"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all font-mono text-left dir-ltr"
                />
              </div>
            </div>
          </div>

          {/* Section 3: Item 3 - Subscription Plan Duration (Monthly / Annual) & Status */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-800/80 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>صلاحية وخطة الاشتراك</span>
            </div>

            <div className="space-y-4">
              {/* Plan Duration Toggle (شهري / سنوي) */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-2">
                  مدة الاشتراك وخطة الدفع
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => handleBillingCycleChange('monthly')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      billingCycle === 'monthly'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4" />
                    <span>خطة شهرية (1 شهر)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => handleBillingCycleChange('annual')}
                    className={`py-3 px-4 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                      billingCycle === 'annual'
                        ? 'bg-amber-500/15 border-amber-500 text-amber-300 shadow-md'
                        : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Calendar className="w-4 h-4 text-amber-400" />
                    <span>خطة سنوية (سنة كاملة)</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
                      شهران مجاناً
                    </span>
                  </button>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    حالة الاشتراك
                  </label>
                  <select
                    value={status}
                    onChange={(e) => setStatus(e.target.value as SubscriptionStatus)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all"
                  >
                    <option value="active">نشط (Active)</option>
                    <option value="trial">تجريبي (Trial)</option>
                    <option value="expired">منتهي (Expired)</option>
                    <option value="suspended">موقوف (Suspended)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-300 mb-1">
                    تاريخ انتهاء الاشتراك (يُحسب تلقائياً ويمكن تعديله)
                  </label>
                  <input
                    type="date"
                    value={expiresAt}
                    onChange={(e) => setExpiresAt(e.target.value)}
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all font-mono text-left dir-ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Section 4: Item 4 - Branding & Logo (File Upload from Device OR URL) */}
          <div>
            <div className="flex items-center gap-2 mb-3 pb-1 border-b border-stone-800/80 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Palette className="w-3.5 h-3.5" />
              <span>{t.tenantWizard.brandingTitle}</span>
            </div>

            <div className="space-y-4">
              {/* Logo Upload Box (File Upload or URL) */}
              <div className="p-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3">
                <label className="block text-xs font-semibold text-stone-300">
                  شعار المقهى / المنشأة (Logo)
                </label>

                <div className="flex items-start gap-4">
                  {/* Preview Thumbnail */}
                  <div className="w-20 h-20 rounded-2xl bg-stone-950 border border-stone-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
                    {logoUrl ? (
                      <>
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src={logoUrl} alt="Logo" className="w-full h-full object-cover" />
                        <button
                          type="button"
                          onClick={() => setLogoUrl('')}
                          className="absolute inset-0 bg-red-950/80 text-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                          title="حذف الشعار"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </>
                    ) : (
                      <ImageIcon className="w-8 h-8 text-stone-600" />
                    )}
                  </div>

                  <div className="flex-1 space-y-2">
                    {/* Device Upload Button */}
                    <div>
                      <input
                        type="file"
                        ref={fileInputRef}
                        onChange={handleFileChange}
                        accept="image/*"
                        className="hidden"
                      />
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="px-4 py-2 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
                      >
                        <Upload className="w-3.5 h-3.5" />
                        <span>رفع الشعار من جهازك (ملف صورة)</span>
                      </button>
                    </div>

                    {/* Or URL input */}
                    <div className="pt-1">
                      <p className="text-[11px] text-stone-500 mb-1">أو أدخل رابط الشعار مباشرة (URL):</p>
                      <input
                        type="url"
                        value={logoUrl}
                        onChange={(e) => setLogoUrl(e.target.value)}
                        placeholder="https://example.com/logo.png"
                        className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-200 focus:outline-none focus:border-amber-500 text-left dir-ltr font-mono"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Google Maps URL */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.googleMapsUrl}
                </label>
                <div className="relative">
                  <input
                    type="url"
                    value={googleMapsUrl}
                    onChange={(e) => setGoogleMapsUrl(e.target.value)}
                    placeholder="https://maps.google.com/?q=..."
                    className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-sm text-stone-100 focus:outline-none focus:border-amber-500 transition-all text-left dir-ltr font-mono text-xs"
                  />
                  <MapPin className="w-4 h-4 text-stone-500 absolute right-3 top-3" />
                </div>
              </div>

              {/* Primary Color Accent */}
              <div>
                <label className="block text-xs font-semibold text-stone-300 mb-1">
                  {t.tenantWizard.primaryColor}
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="color"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                  />
                  <input
                    type="text"
                    value={primaryColor}
                    onChange={(e) => setPrimaryColor(e.target.value)}
                    className="flex-1 bg-stone-900 border border-stone-800 rounded-xl px-3 py-2 text-sm text-stone-100 font-mono text-left dir-ltr"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modal Footer */}
          <div className="pt-4 border-t border-stone-800 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2.5 rounded-xl border border-stone-800 text-stone-300 hover:bg-stone-800 text-sm font-semibold transition-all"
            >
              {t.tenantWizard.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-sm shadow-lg shadow-amber-500/20 flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50"
            >
              <Save className="w-4 h-4" />
              <span>{saving ? t.tenantWizard.saving : t.tenantWizard.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
