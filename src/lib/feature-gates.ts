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
  priceMonthly: { sar: number; idr: number; usd: number };
  popular?: boolean;
}

export const TIERS_META: Record<SubscriptionTier, TierMeta> = {
  basic: {
    tier: 'basic',
    name: {
      ar: 'الباقة الأساسية',
      id: 'Paket Dasar',
      en: 'Basic Tier',
    },
    badgeColor: 'bg-zinc-800 text-zinc-300 border-zinc-700',
    borderColor: 'border-zinc-800',
    tagline: {
      ar: 'بيجر رقمي فوري لتنبيه الزبائن بدون أجهزة',
      id: 'Pager digital instan tanpa perangkat keras',
      en: 'Instant zero-hardware coaster pager alert',
    },
    priceMonthly: { sar: 49, idr: 199000, usd: 14 },
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
      id: 'Pager digital + konversi ulasan bintang 5 Google Maps',
      en: 'Digital pager + 5-star Google Maps review conversion',
    },
    priceMonthly: { sar: 99, idr: 399000, usd: 27 },
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
      ar: 'بيجر + تقييم Google + منيو إلكتروني تفاعلي وفواتير WhatsApp/PDF',
      id: 'Pager + ulasan Google + menu digital interaktif & struk WhatsApp',
      en: 'Pager + Google reviews + digital menu & digital invoices',
    },
    priceMonthly: { sar: 179, idr: 749000, usd: 49 },
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
      id: 'Akses penuh + identitas visual custom logo cafe & warna brand',
      en: 'Full suite + custom brand logo, primary colors & white-label',
    },
    priceMonthly: { sar: 299, idr: 1249000, usd: 79 },
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
