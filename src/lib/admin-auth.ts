/**
 * Admin Authentication & RBAC Service for "Panggil / نداء"
 * Provides secure session management, permission checking, and Supabase auth fallback.
 */

import { PlatformUser, PlatformPermissions } from '@/types/database';
import { dataService } from './data-layer';
import { supabase, isSupabaseConfigured } from './supabase/client';

const ADMIN_SESSION_KEY = 'panggil_admin_session';

export interface AdminAuthResult {
  success: boolean;
  user?: PlatformUser;
  error?: string;
}

export class AdminAuthService {
  /**
   * Get the currently logged-in platform user from localStorage
   */
  public getCurrentUser(): PlatformUser | null {
    if (typeof window === 'undefined') return null;
    try {
      const stored = localStorage.getItem(ADMIN_SESSION_KEY);
      if (!stored) return null;
      const user = JSON.parse(stored) as PlatformUser;
      if (!user.is_active) {
        this.logout();
        return null;
      }
      return user;
    } catch {
      return null;
    }
  }

  /**
   * Check if an active session exists
   */
  public isAuthenticated(): boolean {
    return this.getCurrentUser() !== null;
  }

  /**
   * Authenticate admin staff with email & password
   */
  public async login(email: string, password: string): Promise<AdminAuthResult> {
    const cleanEmail = email.trim().toLowerCase();
    const cleanPassword = password.trim();

    // 1. Try Supabase Auth if fully configured
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
          email: cleanEmail,
          password: cleanPassword,
        });

        if (!authError && authData.user) {
          const users = await dataService.getPlatformUsers();
          const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);
          if (matched && matched.is_active) {
            this.setSession(matched);
            return { success: true, user: matched };
          }
        }
      } catch (e) {
        console.warn('Supabase auth attempt failed, falling back to local credentials:', e);
      }
    }

    // 2. Local/Demo platform users verification
    const users = await dataService.getPlatformUsers();
    const matched = users.find((u) => u.email.toLowerCase() === cleanEmail);

    if (!matched) {
      return { success: false, error: 'البريد الإلكتروني غير مسجل في النظام' };
    }

    if (!matched.is_active) {
      return { success: false, error: 'تم تعطيل هذا الحساب. يرجى التواصل مع مالك المنصة' };
    }

    if (matched.password && matched.password !== cleanPassword) {
      return { success: false, error: 'كلمة المرور غير صحيحة' };
    }

    // Update last login timestamp
    const updated = await dataService.updatePlatformUser(matched.id, {
      last_login_at: new Date().toISOString(),
    });

    const activeUser = updated || matched;
    this.setSession(activeUser);
    return { success: true, user: activeUser };
  }

  /**
   * Set user session in localStorage and dispatch event
   */
  public setSession(user: PlatformUser): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem(ADMIN_SESSION_KEY, JSON.stringify(user));
      window.dispatchEvent(new CustomEvent('panggil_admin_session_changed', { detail: user }));
    } catch (e) {
      console.error('Failed to store admin session:', e);
    }
  }

  /**
   * Clear user session and sign out
   */
  public logout(): void {
    if (typeof window === 'undefined') return;
    try {
      localStorage.removeItem(ADMIN_SESSION_KEY);
      if (isSupabaseConfigured && supabase) {
        supabase.auth.signOut().catch(() => {});
      }
      window.dispatchEvent(new CustomEvent('panggil_admin_session_changed', { detail: null }));
    } catch (e) {
      console.error('Failed to clear admin session:', e);
    }
  }

  /**
   * Granular RBAC permission check
   * Super Admin has all permissions automatically.
   */
  public hasPermission(
    user: PlatformUser | null,
    permission: keyof PlatformPermissions
  ): boolean {
    if (!user || !user.is_active) return false;
    if (user.role === 'super_admin') return true;
    return Boolean(user.permissions?.[permission]);
  }
}

export const adminAuth = new AdminAuthService();
