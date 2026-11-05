import fs from 'fs';
import path from 'path';
import { MenuCategory, MenuItem } from '@/types/database';
import { INITIAL_CATEGORIES, INITIAL_MENU_ITEMS } from './data-layer';

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_CATEGORIES__: MenuCategory[] | undefined;
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_MENU_ITEMS__: MenuItem[] | undefined;
}

const DATA_DIR = path.join(process.cwd(), 'data');
const CATEGORIES_FILE = path.join(DATA_DIR, 'menu_categories.json');
const ITEMS_FILE = path.join(DATA_DIR, 'menu_items.json');

function ensureDataDir() {
  try {
    if (!fs.existsSync(DATA_DIR)) {
      fs.mkdirSync(DATA_DIR, { recursive: true });
    }
  } catch (e) {}
}

function loadCategoriesFromDisk(): MenuCategory[] {
  try {
    ensureDataDir();
    if (fs.existsSync(CATEGORIES_FILE)) {
      const content = fs.readFileSync(CATEGORIES_FILE, 'utf-8');
      const parsed = JSON.parse(content) as MenuCategory[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_CATEGORIES];
}

function saveCategoriesToDisk(categories: MenuCategory[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(CATEGORIES_FILE, JSON.stringify(categories, null, 2), 'utf-8');
  } catch (e) {}
}

function loadItemsFromDisk(): MenuItem[] {
  try {
    ensureDataDir();
    if (fs.existsSync(ITEMS_FILE)) {
      const content = fs.readFileSync(ITEMS_FILE, 'utf-8');
      const parsed = JSON.parse(content) as MenuItem[];
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    }
  } catch (e) {}
  return [...INITIAL_MENU_ITEMS];
}

function saveItemsToDisk(items: MenuItem[]) {
  try {
    ensureDataDir();
    fs.writeFileSync(ITEMS_FILE, JSON.stringify(items, null, 2), 'utf-8');
  } catch (e) {}
}

// Initialize server memory stores
if (!global.__GLOBAL_PANGGIL_CATEGORIES__) {
  global.__GLOBAL_PANGGIL_CATEGORIES__ = loadCategoriesFromDisk();
}

if (!global.__GLOBAL_PANGGIL_MENU_ITEMS__) {
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = loadItemsFromDisk();
}

/**
 * Get categories, optionally filtered by cafeId
 */
export function getServerCategories(cafeId?: string): MenuCategory[] {
  if (!global.__GLOBAL_PANGGIL_CATEGORIES__ || global.__GLOBAL_PANGGIL_CATEGORIES__.length === 0) {
    global.__GLOBAL_PANGGIL_CATEGORIES__ = loadCategoriesFromDisk();
  }
  const all = global.__GLOBAL_PANGGIL_CATEGORIES__;
  if (!cafeId) return all;
  return all.filter((c) => c.cafe_id === cafeId).sort((a, b) => a.display_order - b.display_order);
}

/**
 * Get menu items, optionally filtered by cafeId (via its categories)
 */
export function getServerMenuItems(cafeId?: string): MenuItem[] {
  if (!global.__GLOBAL_PANGGIL_MENU_ITEMS__ || global.__GLOBAL_PANGGIL_MENU_ITEMS__.length === 0) {
    global.__GLOBAL_PANGGIL_MENU_ITEMS__ = loadItemsFromDisk();
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
  saveCategoriesToDisk(all);
  return category;
}

/**
 * Delete category and all its items on server
 */
export function deleteServerCategory(catId: string): boolean {
  const all = getServerCategories().filter((c) => c.id !== catId);
  global.__GLOBAL_PANGGIL_CATEGORIES__ = all;
  saveCategoriesToDisk(all);

  const items = getServerMenuItems().filter((i) => i.category_id !== catId);
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = items;
  saveItemsToDisk(items);
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
  saveItemsToDisk(all);
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
  saveItemsToDisk(all);
  return updated;
}

/**
 * Delete menu item on server
 */
export function deleteServerMenuItem(itemId: string): boolean {
  const all = getServerMenuItems().filter((i) => i.id !== itemId);
  global.__GLOBAL_PANGGIL_MENU_ITEMS__ = all;
  saveItemsToDisk(all);
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
