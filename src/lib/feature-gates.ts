import { SubscriptionTier, Cafe } from '@/types/database';

export interface PlanFeatures {
  canUseMenu: boolean;
  canUseGoogleReview: boolean;
  canUseCustomBranding: boolean;
  maxOrdersPerMonth: number | 'unlimited';
}

/**
 * Returns the feature flags for a given subscription tier
 */
export function getPlanFeatures(tier: SubscriptionTier = 'basic'): PlanFeatures {
  switch (tier) {
    case 'gold':
      return {
        canUseMenu: true,
        canUseGoogleReview: true,
        canUseCustomBranding: true,
        maxOrdersPerMonth: 'unlimited',
      };
    case 'silver':
      return {
        canUseMenu: true,
        canUseGoogleReview: true,
        canUseCustomBranding: false,
        maxOrdersPerMonth: 'unlimited',
      };
    case 'bronze':
      return {
        canUseMenu: false,
        canUseGoogleReview: true,
        canUseCustomBranding: false,
        maxOrdersPerMonth: 'unlimited',
      };
    case 'basic':
    default:
      return {
        canUseMenu: false,
        canUseGoogleReview: false,
        canUseCustomBranding: false,
        maxOrdersPerMonth: 'unlimited',
      };
  }
}

export interface TierMeta {
  tier: SubscriptionTier;
  name: { ar: string; id: string; en: string };
  badgeColor: string;
  borderColor: string;
  tagline: { ar: string; id: string; en: string };
  priceMonthly: { idr: number; sar: number; usd: number };
  priceAnnual: { idr: number; sar: number; usd: number };
  popular?: boolean;
}

export const TIERS_META: Record<SubscriptionTier, TierMeta> = {
  basic: {
    tier: 'basic',
    name: {
      ar: 'الباقة الأساسية',
      id: 'Paket Basic',
      en: 'Basic Tier',
    },
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    borderColor: 'border-zinc-800',
    tagline: {
      ar: 'بيجر رقمي فوري لتنبيه الزبائن بدون أجهزة',
      id: 'Sistem bel coaster pager digital tanpa perangkat keras',
      en: 'Instant zero-hardware coaster pager alert',
    },
    priceMonthly: { idr: 99000, sar: 25, usd: 7 },
    priceAnnual: { idr: 990000, sar: 250, usd: 70 },
  },
  bronze: {
    tier: 'bronze',
    name: {
      ar: 'الباقة البرونزية',
      id: 'Paket Bronze',
      en: 'Bronze Tier',
    },
    badgeColor: 'bg-amber-950/60 text-amber-400 border-amber-800/60',
    borderColor: 'border-amber-900/50',
    tagline: {
      ar: 'بيجر رقمي + تحويل الزبائن لتقييم 5 نجوم في خرائط Google',
      id: 'Pager digital + konversi otomatis ulasan bintang 5 Google Maps',
      en: 'Digital pager + 5-star Google Maps review conversion',
    },
    priceMonthly: { idr: 149000, sar: 39, usd: 10 },
    priceAnnual: { idr: 1490000, sar: 390, usd: 100 },
  },
  silver: {
    tier: 'silver',
    name: {
      ar: 'الباقة الفضية',
      id: 'Paket Silver',
      en: 'Silver Tier',
    },
    badgeColor: 'bg-slate-800/80 text-cyan-300 border-cyan-700/60',
    borderColor: 'border-cyan-800/50',
    popular: true,
    tagline: {
      ar: 'بيجر + تقييم Google + منيو إلكتروني تفاعلي وفواتير PDF',
      id: 'Pager + ulasan Google + menu digital lengkap & struk cetak PDF',
      en: 'Pager + Google reviews + digital menu & PDF invoices',
    },
    priceMonthly: { idr: 199000, sar: 50, usd: 14 },
    priceAnnual: { idr: 1990000, sar: 500, usd: 140 },
  },
  gold: {
    tier: 'gold',
    name: {
      ar: 'الباقة الذهبية الملكية',
      id: 'Paket Gold VIP',
      en: 'Gold Enterprise',
    },
    badgeColor: 'bg-gradient-to-r from-amber-500/20 to-yellow-500/20 text-yellow-300 border-yellow-500/50',
    borderColor: 'border-yellow-500/50',
    tagline: {
      ar: 'كامل الميزات + هوية بصرية مخصصة بشعار المقهى وألوان علامتك التجارية',
      id: 'Akses penuh + custom logo kafe, warna brand & struk eksklusif',
      en: 'Full suite + custom brand logo, primary colors & white-label',
    },
    priceMonthly: { idr: 249000, sar: 65, usd: 18 },
    priceAnnual: { idr: 2490000, sar: 650, usd: 180 },
  },
};

/**
 * Helper to get styling variables for custom branding
 */
export function getCustomBrandingStyle(cafe: Cafe): React.CSSProperties {
  const features = getPlanFeatures(cafe.subscription_tier);
  if (!features.canUseCustomBranding || !cafe.custom_branding?.primary_color) {
    return {};
  }
  return {
    ['--brand-primary' as string]: cafe.custom_branding.primary_color,
  };
}

/**
 * Resolves the canonical base URL for generating customer links and QR codes
 * Ensures that if accessed via an ephemeral or outdated Vercel preview branch,
 * the generated QR code always points to the live production domain (https://panggil.adhamnur.site)
 */
export function getAppBaseUrl(): string {
  if (typeof window === 'undefined') {
    return 'https://panggil.adhamnur.site';
  }
  const origin = window.location.origin;
  if (origin.includes('localhost') || origin.includes('127.0.0.1')) {
    return origin;
  }
  if (origin.includes('panggil.adhamnur.site')) {
    return origin;
  }
  // Fallback to canonical production URL to prevent stale preview deployment 404s
  return 'https://panggil.adhamnur.site';
}
