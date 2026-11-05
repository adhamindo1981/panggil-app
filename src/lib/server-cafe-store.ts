import { Cafe } from '@/types/database';
import { INITIAL_CAFES } from './data-layer';
import { readServerJson, writeServerJson } from './server-storage-utils';

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_CAFES__: Cafe[] | undefined;
}

const CAFES_FILE = 'cafes.json';

// Default seeded cafes including UBK
const SEEDED_CAFES: Cafe[] = [
  ...INITIAL_CAFES,
  {
    id: 'cafe-ubk',
    name: 'UBK Cafe',
    slug: 'ubk',
    mode: 'menu_pager',
    default_lang: 'ar',
    subscription_tier: 'gold',
    subscription_status: 'active',
    subscription_expires_at: '2027-12-31T23:59:59Z',
    cashier_pin: '1981',
    tax_rate: 10,
    billing_cycle: 'annual',
    owner_name: 'Adham',
    owner_phone: '+966500001981',
    currency_symbol: 'ر.س',
    created_at: '2026-02-01T00:00:00Z',
    support_notes: [],
  },
  {
    id: 'cafe-ubkcaffe',
    name: 'UBK Caffe',
    slug: 'ubkcaffe',
    mode: 'menu_pager',
    default_lang: 'ar',
    subscription_tier: 'gold',
    subscription_status: 'active',
    subscription_expires_at: '2027-12-31T23:59:59Z',
    cashier_pin: '1981',
    tax_rate: 10,
    billing_cycle: 'annual',
    owner_name: 'Adham',
    owner_phone: '+966500001981',
    currency_symbol: 'ر.س',
    created_at: '2026-02-01T00:00:00Z',
    support_notes: [],
  },
];

function loadCafes(): Cafe[] {
  const disk = readServerJson<Cafe[]>(CAFES_FILE, []);
  if (Array.isArray(disk) && disk.length > 0) {
    // Ensure UBK has cashier_pin = 1981 if present
    const ubk = disk.find((c) => c.slug.toLowerCase() === 'ubk' || c.slug.toLowerCase() === 'ubkcaffe');
    if (ubk && (!ubk.cashier_pin || ubk.cashier_pin === '1234')) {
      ubk.cashier_pin = '1981';
      writeServerJson(CAFES_FILE, disk);
    }
    return disk;
  }
  writeServerJson(CAFES_FILE, SEEDED_CAFES);
  return [...SEEDED_CAFES];
}

// Initialize server memory store
if (!global.__GLOBAL_PANGGIL_CAFES__ || global.__GLOBAL_PANGGIL_CAFES__.length === 0) {
  global.__GLOBAL_PANGGIL_CAFES__ = loadCafes();
}

/**
 * Get all cafes on the server
 */
export function getServerCafes(): Cafe[] {
  if (!global.__GLOBAL_PANGGIL_CAFES__ || global.__GLOBAL_PANGGIL_CAFES__.length === 0) {
    global.__GLOBAL_PANGGIL_CAFES__ = loadCafes();
  }
  return global.__GLOBAL_PANGGIL_CAFES__;
}

/**
 * Find cafe by slug on the server
 */
export function getServerCafeBySlug(slug: string): Cafe | null {
  const cleanSlug = (slug || '').trim().toLowerCase();
  if (!cleanSlug) return null;

  const all = getServerCafes();
  const found = all.find((c) => c.slug && c.slug.toLowerCase() === cleanSlug);
  if (found) return found;

  const seeded = SEEDED_CAFES.find((c) => c.slug.toLowerCase() === cleanSlug);
  if (seeded) {
    saveServerCafe(seeded);
    return seeded;
  }

  return null;
}

/**
 * Resilient Dynamic Cafe generator - Guarantees 404 is NEVER thrown
 */
export function getOrCreateDynamicCafe(slug: string): Cafe {
  const cleanSlug = (slug || '').trim().toLowerCase();
  const existing = getServerCafeBySlug(cleanSlug);
  if (existing) return existing;

  const formattedName = cleanSlug
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (char) => char.toUpperCase());

  const newCafe: Cafe = {
    id: 'cafe-' + cleanSlug,
    name: formattedName,
    slug: cleanSlug,
    mode: 'menu_pager',
    default_lang: 'ar',
    subscription_tier: 'gold',
    subscription_status: 'active',
    subscription_expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    cashier_pin: cleanSlug === 'ubk' || cleanSlug === 'ubkcaffe' ? '1981' : '1234',
    tax_rate: 10,
    created_at: new Date().toISOString(),
    support_notes: [],
  };

  saveServerCafe(newCafe);
  return newCafe;
}

/**
 * Save or update a cafe on the server
 */
export function saveServerCafe(cafe: Cafe): Cafe {
  const cleanSlug = (cafe.slug || '').trim().toLowerCase();
  const all = getServerCafes();
  const index = all.findIndex(
    (c) => c.id === cafe.id || (c.slug && c.slug.toLowerCase() === cleanSlug)
  );

  const mergedCafe: Cafe = {
    ...cafe,
    id: cafe.id || 'cafe-' + cleanSlug,
    slug: cleanSlug,
  };

  if (index >= 0) {
    all[index] = { ...all[index], ...mergedCafe };
  } else {
    all.unshift(mergedCafe);
  }

  global.__GLOBAL_PANGGIL_CAFES__ = [...all];
  writeServerJson(CAFES_FILE, all);
  return mergedCafe;
}

/**
 * Delete a cafe from the server
 */
export function deleteServerCafe(id: string): boolean {
  const all = getServerCafes().filter((c) => c.id !== id);
  global.__GLOBAL_PANGGIL_CAFES__ = all;
  writeServerJson(CAFES_FILE, all);
  return true;
}
