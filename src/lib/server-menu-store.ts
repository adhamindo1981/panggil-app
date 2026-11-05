import { MenuCategory, MenuItem } from '@/types/database';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS } from './data-layer';
import { readServerJson, writeServerJson } from './server-storage-utils';

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_CATEGORIES__: MenuCategory[] | undefined;
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_MENU_ITEMS__: MenuItem[] | undefined;
}

const CATEGORIES_FILE = 'menu_categories.json';
const ITEMS_FILE = 'menu_items.json';

function isCafeMatch(catCafeId: string, targetCafeId: string): boolean {
  if (!catCafeId || !targetCafeId) return false;
  if (catCafeId === targetCafeId) return true;

  const cleanCat = catCafeId.replace(/^cafe-/, '').trim().toLowerCase();
  const cleanTarget = targetCafeId.replace(/^cafe-/, '').trim().toLowerCase();
  if (cleanCat === cleanTarget) return true;

  if (cleanCat.startsWith('ubk') && cleanTarget.startsWith('ubk')) return true;
  return false;
}

function loadCategories(): MenuCategory[] {
  const disk = readServerJson<MenuCategory[]>(CATEGORIES_FILE, []);
  if (Array.isArray(disk) && disk.length > 0) return disk;
  writeServerJson(CATEGORIES_FILE, INITIAL_CATEGORIES);
  return [...INITIAL_CATEGORIES];
}

function loadItems(): MenuItem[] {
  const disk = readServerJson<MenuItem[]>(ITEMS_FILE, []);
  if (Array.isArray(disk) && disk.length > 0) return disk;
  writeServerJson(ITEMS_FILE, INITIAL_MENU_ITEMS);
  return [...INITIAL_MENU_ITEMS];
}

if (!global.__GLOBAL_PANGGIL_CATEGORIES__ || global.__GLOBAL_PANGGIL_CATEGORIES__.length === 0) {
  global.__GLOBAL_PANGGIL_CATEGORIES__ = loadCategories();
}

if (!global.__GLOBAL_PANGGIL_MENU_ITEMS__ || global.__GLOBAL_PANGGIL_MENU_ITEMS__.length === 0) {
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = loadItems();
}

/**
 * Get categories, optionally filtered by cafeId
 */
export function getServerCategories(cafeId?: string): MenuCategory[] {
  if (!global.__GLOBAL_PANGGIL_CATEGORIES__ || global.__GLOBAL_PANGGIL_CATEGORIES__.length === 0) {
    global.__GLOBAL_PANGGIL_CATEGORIES__ = loadCategories();
  }
  const all = global.__GLOBAL_PANGGIL_CATEGORIES__;
  if (!cafeId) return all;
  return all.filter((c) => isCafeMatch(c.cafe_id, cafeId)).sort((a, b) => a.display_order - b.display_order);
}

/**
 * Get menu items, optionally filtered by cafeId (via its categories)
 */
export function getServerMenuItems(cafeId?: string): MenuItem[] {
  if (!global.__GLOBAL_PANGGIL_MENU_ITEMS__ || global.__GLOBAL_PANGGIL_MENU_ITEMS__.length === 0) {
    global.__GLOBAL_PANGGIL_MENU_ITEMS__ = loadItems();
  }
  const all = global.__GLOBAL_PANGGIL_MENU_ITEMS__;
  if (!cafeId) return all;

  const categories = getServerCategories(cafeId);
  const catIds = new Set(categories.map((c) => c.id));
  return all.filter((i) => catIds.has(i.category_id));
}

/**
 * Add or update category on server
 */
export function saveServerCategory(category: MenuCategory): MenuCategory {
  const all = getServerCategories();
  const index = all.findIndex((c) => c.id === category.id);
  if (index >= 0) {
    all[index] = { ...all[index], ...category };
  } else {
    all.push(category);
  }
  global.__GLOBAL_PANGGIL_CATEGORIES__ = [...all];
  writeServerJson(CATEGORIES_FILE, all);
  return category;
}

/**
 * Delete category and all its items on server
 */
export function deleteServerCategory(catId: string): boolean {
  const all = getServerCategories().filter((c) => c.id !== catId);
  global.__GLOBAL_PANGGIL_CATEGORIES__ = all;
  writeServerJson(CATEGORIES_FILE, all);

  const items = getServerMenuItems().filter((i) => i.category_id !== catId);
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = items;
  writeServerJson(ITEMS_FILE, items);
  return true;
}

/**
 * Add or update menu item on server
 */
export function saveServerMenuItem(item: MenuItem): MenuItem {
  const all = getServerMenuItems();
  const index = all.findIndex((i) => i.id === item.id);
  if (index >= 0) {
    all[index] = { ...all[index], ...item };
  } else {
    all.push(item);
  }
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = [...all];
  writeServerJson(ITEMS_FILE, all);
  return item;
}

/**
 * Update menu item on server
 */
export function updateServerMenuItem(itemId: string, updates: Partial<MenuItem>): MenuItem | null {
  const all = getServerMenuItems();
  const index = all.findIndex((i) => i.id === itemId);
  if (index === -1) return null;

  const updated: MenuItem = { ...all[index], ...updates };
  all[index] = updated;
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = [...all];
  writeServerJson(ITEMS_FILE, all);
  return updated;
}

/**
 * Delete menu item on server
 */
export function deleteServerMenuItem(itemId: string): boolean {
  const all = getServerMenuItems().filter((i) => i.id !== itemId);
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = all;
  writeServerJson(ITEMS_FILE, all);
  return true;
}

/**
 * Starter menu seed for newly created cafes if none exists
 */
export function seedStarterMenuForCafe(cafeId: string): { categories: MenuCategory[]; items: MenuItem[] } {
  const existingCats = getServerCategories(cafeId);
  if (existingCats.length > 0) {
    return {
      categories: existingCats,
      items: getServerMenuItems(cafeId),
    };
  }

  const cat1: MenuCategory = {
    id: `cat-${cafeId}-1`,
    cafe_id: cafeId,
    name_ar: 'المشروبات والقهوة',
    name_id: 'Minuman & Kopi',
    name_en: 'Drinks & Coffee',
    display_order: 1,
    created_at: new Date().toISOString(),
  };

  const cat2: MenuCategory = {
    id: `cat-${cafeId}-2`,
    cafe_id: cafeId,
    name_ar: 'المأكولات والحلويات',
    name_id: 'Makanan & Dessert',
    name_en: 'Food & Desserts',
    display_order: 2,
    created_at: new Date().toISOString(),
  };

  const item1: MenuItem = {
    id: `item-${cafeId}-1`,
    category_id: cat1.id,
    name_ar: 'قهوة مميزة (Signature)',
    name_id: 'Signature Coffee',
    name_en: 'Special Coffee',
    price: 25000,
    is_available: true,
    created_at: new Date().toISOString(),
  };

  const item2: MenuItem = {
    id: `item-${cafeId}-2`,
    category_id: cat2.id,
    name_ar: 'كرواسون طازج',
    name_id: 'Fresh Croissant',
    name_en: 'Fresh Croissant',
    price: 20000,
    is_available: true,
    created_at: new Date().toISOString(),
  };

  saveServerCategory(cat1);
  saveServerCategory(cat2);
  saveServerMenuItem(item1);
  saveServerMenuItem(item2);

  return {
    categories: [cat1, cat2],
    items: [item1, item2],
  };
}
