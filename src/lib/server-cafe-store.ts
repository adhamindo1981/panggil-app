import fs from 'fs';
import path from 'path';
import { Cafe, SubscriptionTier } from '@/types/database';
import { INITIAL_CAFES } from './data-layer';

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_CAFES__: Cafe[] | undefined;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CAFES_FILE = path.join(DATA_DIR, 'cafes.json');

// Ensure data directory exists
function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {
    // Read-only filesystem fallback
  }
}

// Load cafes from disk or memory fallback
function loadCafesFromDisk(): Cafe[] {
  try {
    ensureDataDir();
    if (fs.existsSync(CAFES_FILE)) {
      const content = fs.readFileSync(CAFES_FILE, 'utf-8');
      const parsed = JSON.parse(content) as Cafe[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    // Disk read fallback
  }
  return [...INITIAL_CAFES];
}

// Save cafes to disk
function saveCafesToDisk(cafes: Cafe[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(CAFES_FILE, JSON.stringify(cafes, null, 2), 'utf-8');
  } catch (e) {
    // Read-only filesystem fallback
  }
}

// Initialize server memory store
if (!global.__GLOBAL_PANGGIL_CAFES__) {
  global.__GLOBAL_PANGGIL_CAFES__ = loadCafesFromDisk();
}

/**
 * Get all cafes on the server
 */
export function getServerCafes(): Cafe[] {
  if (!global.__GLOBAL_PANGGIL_CAFES__ || global.__GLOBAL_PANGGIL_CAFES__.length === 0) {
    global.__GLOBAL_PANGGIL_CAFES__ = loadCafesFromDisk();
  }
  return global.__GLOBAL_PANGGIL_CAFES__;
}

/**
 * Find cafe by slug on the server
 */
export function getServerCafeBySlug(slug: string): Cafe | null {
  const cleanSlug = slug.trim().toLowerCase();
  const all = getServerCafes();
  const found = all.find((c) => c.slug.toLowerCase() === cleanSlug);
  if (found) return found;

  // Also check initial cafes fallback
  const initial = INITIAL_CAFES.find((c) => c.slug.toLowerCase() === cleanSlug);
  return initial || null;
}

/**
 * Resilient Dynamic Cafe generator - Guarantees 404 is NEVER thrown
 */
export function getOrCreateDynamicCafe(slug: string): Cafe {
  const cleanSlug = slug.trim().toLowerCase();
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
    subscription_tier: 'silver',
    subscription_status: 'active',
    subscription_expires_at: new Date(Date.now() + 365 * 24 * 3600 * 1000).toISOString(),
    cashier_pin: '1234',
    created_at: new Date().toISOString(),
    support_notes: [],
  };

  // Add to server memory and disk
  saveServerCafe(newCafe);
  return newCafe;
}

/**
 * Save or update a cafe on the server
 */
export function saveServerCafe(cafe: Cafe): Cafe {
  const all = getServerCafes();
  const index = all.findIndex((c) => c.id === cafe.id || c.slug.toLowerCase() === cafe.slug.toLowerCase());

  if (index >= 0) {
    all[index] = { ...all[index], ...cafe };
  } else {
    all.unshift(cafe);
  }

  global.__GLOBAL_PANGGIL_CAFES__ = [...all];
  saveCafesToDisk(all);
  return cafe;
}

/**
 * Delete a cafe from the server
 */
export function deleteServerCafe(id: string): boolean {
  const all = getServerCafes().filter((c) => c.id !== id);
  global.__GLOBAL_PANGGIL_CAFES__ = all;
  saveCafesToDisk(all);
  return true;
}
