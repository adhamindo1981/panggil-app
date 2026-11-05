'use client';

import React, { useState } from 'react';
import {
  PlatformUser,
  PlatformUserRole,
  PlatformPermissions,
  AppLanguage,
} from '@/types/database';
import { dataService } from '@/lib/data-layer';
import { ADMIN_TRANSLATIONS } from '@/lib/i18n/admin-translations';
import {
  X,
  Save,
  Users,
  Shield,
  CheckSquare,
  Square,
  Lock,
  Mail,
  User,
} from 'lucide-react';

interface StaffModalProps {
  user?: PlatformUser | null;
  isOpen: boolean;
  onClose: () => void;
  onSaved: (user: PlatformUser) => void;
  lang: AppLanguage;
}

const DEFAULT_PERMISSIONS: Record<PlatformUserRole, PlatformPermissions> = {
  super_admin: {
    can_create_tenant: true,
    can_edit_tier: true,
    can_suspend_tenant: true,
    can_manage_menu: true,
    can_view_crm: true,
    can_manage_staff: true,
  },
  onboarding_staff: {
    can_create_tenant: true,
    can_edit_tier: true,
    can_suspend_tenant: false,
    can_manage_menu: true,
    can_view_crm: true,
    can_manage_staff: false,
  },
  support_agent: {
    can_create_tenant: false,
    can_edit_tier: false,
    can_suspend_tenant: false,
    can_manage_menu: false,
    can_view_crm: true,
    can_manage_staff: false,
  },
};

export function StaffModal({
  user,
  isOpen,
  onClose,
  onSaved,
  lang,
}: StaffModalProps) {
  const isEditing = !!user;
  const t = ADMIN_TRANSLATIONS[lang];
  const isRtl = lang === 'ar';

  const [name, setName] = useState(user?.name || '');
  const [email, setEmail] = useState(user?.email || '');
  const [password, setPassword] = useState(user?.password || 'staff123');
  const [role, setRole] = useState<PlatformUserRole>(user?.role || 'onboarding_staff');
  const [isActive, setIsActive] = useState(user?.is_active ?? true);
  const [permissions, setPermissions] = useState<PlatformPermissions>(
    user?.permissions || DEFAULT_PERMISSIONS.onboarding_staff
  );

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleRoleChange = (newRole: PlatformUserRole) => {
    setRole(newRole);
    setPermissions(DEFAULT_PERMISSIONS[newRole]);
  };

  const togglePermission = (key: keyof PlatformPermissions) => {
    setPermissions((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    setSaving(true);
    setError(null);

    try {
      if (isEditing && user) {
        const updated = await dataService.updatePlatformUser(user.id, {
          name,
          email: email.trim().toLowerCase(),
          password,
          role,
          is_active: isActive,
          permissions,
        });
        if (updated) onSaved(updated);
      } else {
        const created = await dataService.createPlatformUser({
          name,
          email: email.trim().toLowerCase(),
          password,
          role,
          is_active: isActive,
          permissions,
        });
        onSaved(created);
      }
      onClose();
    } catch (err: unknown) {
      setError((err as Error).message || 'حدث خطأ أثناء حفظ بيانات العضو');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d121e] border border-stone-800 rounded-3xl w-full max-w-xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400">
              <Users className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100">
                {isEditing ? t.staff.editMember : t.staff.addNew}
              </h3>
              <p className="text-xs text-stone-400">
                {isEditing ? user?.email : 'إضافة موظف جديد وتخصيص صلاحيات الوصول'}
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

        {/* Content Form */}
        <form onSubmit={handleSave} className="flex-1 overflow-y-auto p-6 space-y-5">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-500/30 rounded-xl text-xs text-red-200">
              {error}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                اسم الموظف <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="مثال: أحمد علي"
                  required
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
                />
                <User className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                البريد الإلكتروني <span className="text-red-400">*</span>
              </label>
              <div className="relative">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="staff@panggil.id"
                  required
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 text-left dir-ltr"
                />
                <Mail className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                كلمة المرور
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500 text-left dir-ltr font-mono"
                />
                <Lock className="w-3.5 h-3.5 text-stone-500 absolute left-3 top-3" />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-stone-300 mb-1">
                الدور الوظيفي
              </label>
              <select
                value={role}
                onChange={(e) => handleRoleChange(e.target.value as PlatformUserRole)}
                className="w-full bg-stone-900 border border-stone-800 rounded-xl px-3.5 py-2.5 text-xs text-stone-100 focus:outline-none focus:border-amber-500"
              >
                <option value="super_admin">{t.staff.roles.super_admin}</option>
                <option value="onboarding_staff">{t.staff.roles.onboarding_staff}</option>
                <option value="support_agent">{t.staff.roles.support_agent}</option>
              </select>
            </div>
          </div>

          {/* Active Status Toggle */}
          <div className="p-3.5 rounded-2xl bg-stone-900 border border-stone-800 flex items-center justify-between">
            <div>
              <p className="text-xs font-bold text-stone-200">حالة الحساب</p>
              <p className="text-[11px] text-stone-500">تمكين أو تعطيل دخول الموظف للنظام</p>
            </div>
            <button
              type="button"
              onClick={() => setIsActive(!isActive)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                isActive
                  ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/30'
                  : 'bg-red-500/10 text-red-400 border border-red-500/30'
              }`}
            >
              {isActive ? t.staff.active : t.staff.disabled}
            </button>
          </div>

          {/* Granular Permissions Checkboxes */}
          <div>
            <div className="flex items-center gap-2 mb-3 text-xs font-bold text-amber-400 uppercase tracking-wider">
              <Shield className="w-3.5 h-3.5" />
              <span>الصلاحيات الدقيقة الممنوحة (Granular Permissions)</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {(
                Object.keys(DEFAULT_PERMISSIONS.super_admin) as (keyof PlatformPermissions)[]
              ).map((permKey) => (
                <button
                  type="button"
                  key={permKey}
                  onClick={() => togglePermission(permKey)}
                  className={`p-3 rounded-xl border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    permissions[permKey]
                      ? 'bg-amber-500/10 border-amber-500/40 text-stone-100'
                      : 'bg-stone-900 border-stone-800 text-stone-500 hover:text-stone-300'
                  }`}
                >
                  {permissions[permKey] ? (
                    <CheckSquare className="w-4 h-4 text-amber-400 shrink-0" />
                  ) : (
                    <Square className="w-4 h-4 shrink-0" />
                  )}
                  <span className="text-xs font-medium">
                    {t.staff.permissions[permKey] || permKey}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="pt-4 border-t border-stone-800 flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl border border-stone-800 text-xs text-stone-400 hover:bg-stone-800 transition-colors"
            >
              {t.staff.cancel}
            </button>
            <button
              type="submit"
              disabled={saving}
              className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-bold text-xs flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{saving ? 'جاري الحفظ...' : t.staff.save}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
