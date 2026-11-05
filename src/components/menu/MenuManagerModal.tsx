'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Cafe, MenuCategory, MenuItem, AppLanguage } from '@/types/database';
import { dataService } from '@/lib/data-layer';
import {
  X,
  Plus,
  Trash2,
  UtensilsCrossed,
  Layers,
  Check,
  ToggleLeft,
  ToggleRight,
  Upload,
  Image as ImageIcon,
  DollarSign,
  AlertCircle,
  Edit2,
  Sparkles,
} from 'lucide-react';

interface MenuManagerModalProps {
  cafe: Cafe | null;
  isOpen: boolean;
  onClose: () => void;
  lang?: AppLanguage;
  isCashier?: boolean;
}

export function MenuManagerModal({
  cafe,
  isOpen,
  onClose,
  lang = 'ar',
  isCashier = false,
}: MenuManagerModalProps) {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);

  // New Category State
  const [newCatAr, setNewCatAr] = useState('');
  const [newCatId, setNewCatId] = useState('');
  const [newCatEn, setNewCatEn] = useState('');
  const [showAddCat, setShowAddCat] = useState(false);

  // New Item State
  const [showAddItem, setShowAddItem] = useState(false);
  const [selectedCatId, setSelectedCatId] = useState('');
  const [newItemAr, setNewItemAr] = useState('');
  const [newItemId, setNewItemId] = useState('');
  const [newItemEn, setNewItemEn] = useState('');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemPrice, setNewItemPrice] = useState(25000);
  const [newItemImageUrl, setNewItemImageUrl] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const isRtl = lang === 'ar';

  useEffect(() => {
    if (!cafe || !isOpen) return;
    loadMenu();
  }, [cafe, isOpen]);

  const loadMenu = async () => {
    if (!cafe) return;
    setLoading(true);
    try {
      const [cats, menuItems] = await Promise.all([
        dataService.getMenuCategories(cafe.id),
        dataService.getMenuItems(cafe.id),
      ]);
      setCategories(cats);
      setItems(menuItems);
      if (cats.length > 0 && !selectedCatId) {
        setSelectedCatId(cats[0].id);
      }
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !cafe) return null;

  // Handle Item photo upload from device
  const handleItemPhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
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
        setNewItemImageUrl(base64);
      }
    };
    reader.readAsDataURL(file);
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCatId.trim() && !newCatAr.trim()) return;

    const created = await dataService.createCategory({
      cafe_id: cafe.id,
      name_id: newCatId.trim() || newCatAr.trim(),
      name_ar: newCatAr.trim() || newCatId.trim(),
      name_en: newCatEn.trim() || newCatId.trim(),
      display_order: categories.length + 1,
    });

    setCategories((prev) => [...prev, created]);
    if (!selectedCatId) setSelectedCatId(created.id);
    setNewCatAr('');
    setNewCatId('');
    setNewCatEn('');
    setShowAddCat(false);
  };

  const handleDeleteCategory = async (catId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا القسم؟ سيتم حذف جميع الأصناف التابعة له.')) return;
    await dataService.deleteCategory(catId);
    setCategories((prev) => prev.filter((c) => c.id !== catId));
    setItems((prev) => prev.filter((i) => i.category_id !== catId));
    if (selectedCatId === catId) {
      const remaining = categories.filter((c) => c.id !== catId);
      setSelectedCatId(remaining.length > 0 ? remaining[0].id : '');
    }
  };

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedCatId || (!newItemId.trim() && !newItemAr.trim())) return;

    const created = await dataService.createMenuItem({
      category_id: selectedCatId,
      name_id: newItemId.trim() || newItemAr.trim(),
      name_ar: newItemAr.trim() || newItemId.trim(),
      name_en: newItemEn.trim() || newItemId.trim(),
      description: newItemDesc.trim() || undefined,
      description_ar: newItemDesc.trim() || undefined,
      price: Number(newItemPrice) || 0,
      image_url: newItemImageUrl || undefined,
      is_available: true,
    });

    setItems((prev) => [...prev, created]);
    setNewItemAr('');
    setNewItemId('');
    setNewItemEn('');
    setNewItemDesc('');
    setNewItemPrice(25000);
    setNewItemImageUrl('');
    setShowAddItem(false);
  };

  const handleToggleAvailability = async (item: MenuItem) => {
    const updated = await dataService.updateMenuItem(item.id, {
      is_available: !item.is_available,
    });
    if (updated) {
      setItems((prev) => prev.map((i) => (i.id === item.id ? updated : i)));
    }
  };

  const handleDeleteItem = async (itemId: string) => {
    if (!confirm('هل أنت متأكد من حذف هذا الصنف من القائمة؟')) return;
    await dataService.deleteMenuItem(itemId);
    setItems((prev) => prev.filter((i) => i.id !== itemId));
  };

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn"
    >
      <div className="bg-[#0d121e] border border-stone-800 rounded-3xl w-full max-w-3xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-stone-800 flex items-center justify-between bg-stone-900/50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
              <UtensilsCrossed className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-stone-100 flex items-center gap-2">
                <span>إدارة قائمة الطعام والمنتجات (Menu Manager)</span>
                {isCashier && (
                  <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30">
                    لوحة الكاشير
                  </span>
                )}
              </h3>
              <p className="text-xs text-stone-400">{cafe.name} — إضافة وتعديل الأصناف والأسعار وتوفرها</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-xl text-stone-400 hover:text-stone-100 hover:bg-stone-800 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {loading ? (
            <div className="flex items-center justify-center py-12 text-stone-500 text-xs">
              <div className="w-5 h-5 border-2 border-amber-500 border-t-transparent rounded-full animate-spin mr-2" />
              <span>جاري تحميل قائمة الطعام...</span>
            </div>
          ) : (
            <>
              {/* Category Pills Bar */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-amber-400 uppercase tracking-wider">
                    <Layers className="w-3.5 h-3.5" />
                    <span>أقسام القائمة (الفئات) ({categories.length})</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddCat(!showAddCat)}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة قسم جديد</span>
                  </button>
                </div>

                {/* Add Category Form */}
                {showAddCat && (
                  <form
                    onSubmit={handleAddCategory}
                    className="p-4 mb-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-3 animate-fadeIn"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                      <input
                        type="text"
                        value={newCatAr}
                        onChange={(e) => setNewCatAr(e.target.value)}
                        placeholder="الاسم بالعربية (مثال: قهوة ساخنة)"
                        className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                      />
                      <input
                        type="text"
                        value={newCatId}
                        onChange={(e) => setNewCatId(e.target.value)}
                        placeholder="Nama Bahasa (e.g. Kopi Panas)"
                        className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 text-left dir-ltr"
                      />
                      <input
                        type="text"
                        value={newCatEn}
                        onChange={(e) => setNewCatEn(e.target.value)}
                        placeholder="English Name (e.g. Hot Coffee)"
                        className="bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 text-left dir-ltr"
                      />
                    </div>
                    <div className="flex justify-end gap-2">
                      <button
                        type="button"
                        onClick={() => setShowAddCat(false)}
                        className="px-3 py-1.5 rounded-lg border border-stone-800 text-xs text-stone-400 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                      >
                        إضافة القسم
                      </button>
                    </div>
                  </form>
                )}

                {/* Category Badges */}
                <div className="flex flex-wrap gap-2">
                  {categories.map((cat) => (
                    <div
                      key={cat.id}
                      className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-xl border text-xs transition-all ${
                        selectedCatId === cat.id
                          ? 'bg-amber-500/10 border-amber-500/40 text-amber-300 font-bold'
                          : 'bg-stone-900 border-stone-800 text-stone-400 hover:text-stone-200'
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => setSelectedCatId(cat.id)}
                        className="cursor-pointer"
                      >
                        {lang === 'ar' ? cat.name_ar : lang === 'id' ? cat.name_id : cat.name_en}
                      </button>
                      <button
                        type="button"
                        onClick={() => handleDeleteCategory(cat.id)}
                        className="text-stone-600 hover:text-red-400 transition-colors cursor-pointer"
                        title="حذف القسم"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                  {categories.length === 0 && (
                    <p className="text-xs text-stone-500">لا توجد أقسام مسجلة حتى الآن.</p>
                  )}
                </div>
              </div>

              {/* Items Section */}
              <div className="pt-4 border-t border-stone-800">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-xs font-bold text-stone-300">
                    <UtensilsCrossed className="w-3.5 h-3.5 text-amber-400" />
                    <span>
                      الأصناف والمنتجات (
                      {items.filter((i) => !selectedCatId || i.category_id === selectedCatId).length}
                      )
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setShowAddItem(!showAddItem)}
                    disabled={categories.length === 0}
                    className="text-xs text-amber-400 hover:text-amber-300 font-semibold flex items-center gap-1 cursor-pointer disabled:opacity-40"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>إضافة منتج جديد</span>
                  </button>
                </div>

                {/* Add Item Form with Device Photo Upload */}
                {showAddItem && (
                  <form
                    onSubmit={handleAddItem}
                    className="p-4 mb-4 rounded-2xl bg-stone-900 border border-stone-800 space-y-4 animate-fadeIn"
                  >
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">القسم التابع له</label>
                        <select
                          value={selectedCatId}
                          onChange={(e) => setSelectedCatId(e.target.value)}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                        >
                          {categories.map((c) => (
                            <option key={c.id} value={c.id}>
                              {c.name_ar} / {c.name_id}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">
                          السعر ({cafe.currency_symbol || 'Rp'})
                        </label>
                        <input
                          type="number"
                          value={newItemPrice}
                          onChange={(e) => setNewItemPrice(Number(e.target.value))}
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 font-mono text-left dir-ltr"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">اسم الصنف (بالعربية)</label>
                        <input
                          type="text"
                          value={newItemAr}
                          onChange={(e) => setNewItemAr(e.target.value)}
                          placeholder="مثال: لاتيه مثلج كلاسيك"
                          required
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100"
                        />
                      </div>

                      <div>
                        <label className="block text-[11px] text-stone-400 mb-1">Nama Produk (Indonesian)</label>
                        <input
                          type="text"
                          value={newItemId}
                          onChange={(e) => setNewItemId(e.target.value)}
                          placeholder="e.g. Iced Latte"
                          className="w-full bg-stone-950 border border-stone-800 rounded-xl px-3 py-2 text-xs text-stone-100 text-left dir-ltr"
                        />
                      </div>

                      <div className="sm:col-span-2">
                        <label className="block text-[11px] text-amber-400 font-semibold mb-1">
                          وصف المنتج ومكوناته (Product Description)
                        </label>
                        <textarea
                          rows={2}
                          value={newItemDesc}
                          onChange={(e) => setNewItemDesc(e.target.value)}
                          placeholder="اكتب وصفاً جذاباً للمنتج ومكوناته، مثل: أرز مقلي بالدجاج والبيض وصلصة الصويا التقليدية مع خضار طازجة..."
                          className="w-full bg-stone-950 border border-stone-800 focus:border-amber-500 rounded-xl px-3 py-2 text-xs text-stone-100 resize-none transition-colors"
                        />
                      </div>
                    </div>

                    {/* Image Upload Box */}
                    <div className="p-3 bg-stone-950/80 rounded-2xl border border-stone-800 space-y-2">
                      <label className="block text-[11px] text-stone-300 font-semibold">
                        صورة الصنف (اختياري - رفع من الجهاز أو رابط)
                      </label>

                      <div className="flex items-center gap-3">
                        {/* Thumbnail */}
                        <div className="w-14 h-14 rounded-xl bg-stone-900 border border-stone-800 flex items-center justify-center overflow-hidden shrink-0 relative group">
                          {newItemImageUrl ? (
                            <>
                              {/* eslint-disable-next-line @next/next/no-img-element */}
                              <img src={newItemImageUrl} alt="Dish" className="w-full h-full object-cover" />
                              <button
                                type="button"
                                onClick={() => setNewItemImageUrl('')}
                                className="absolute inset-0 bg-red-950/80 text-red-300 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </>
                          ) : (
                            <ImageIcon className="w-6 h-6 text-stone-600" />
                          )}
                        </div>

                        <div className="flex-1 space-y-1.5">
                          <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleItemPhotoUpload}
                            accept="image/*"
                            className="hidden"
                          />
                          <button
                            type="button"
                            onClick={() => fileInputRef.current?.click()}
                            className="px-3 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/30 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all cursor-pointer"
                          >
                            <Upload className="w-3.5 h-3.5" />
                            <span>رفع صورة من جهازك</span>
                          </button>

                          <input
                            type="url"
                            value={newItemImageUrl}
                            onChange={(e) => setNewItemImageUrl(e.target.value)}
                            placeholder="أو ضع رابط صورة مباشر (https://...)"
                            className="w-full bg-stone-900 border border-stone-800 rounded-lg px-2.5 py-1 text-[11px] text-stone-200 text-left dir-ltr font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="flex justify-end gap-2 pt-2">
                      <button
                        type="button"
                        onClick={() => setShowAddItem(false)}
                        className="px-3 py-1.5 rounded-lg border border-stone-800 text-xs text-stone-400 cursor-pointer"
                      >
                        إلغاء
                      </button>
                      <button
                        type="submit"
                        className="px-4 py-1.5 rounded-lg bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs cursor-pointer"
                      >
                        إضافة المنتج للقائمة
                      </button>
                    </div>
                  </form>
                )}

                {/* Items List */}
                <div className="space-y-2">
                  {items
                    .filter((item) => !selectedCatId || item.category_id === selectedCatId)
                    .map((item) => (
                      <div
                        key={item.id}
                        className="p-3 rounded-2xl bg-stone-900/80 border border-stone-800 flex items-center justify-between"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-xl bg-stone-800 border border-stone-700/60 flex items-center justify-center text-stone-400 overflow-hidden shrink-0">
                            {item.image_url ? (
                              // eslint-disable-next-line @next/next/no-img-element
                              <img src={item.image_url} alt={item.name_ar} className="w-full h-full object-cover" />
                            ) : (
                              <UtensilsCrossed className="w-5 h-5 text-stone-500" />
                            )}
                          </div>
                          <div>
                            <p className="text-xs font-bold text-stone-200">
                              {lang === 'ar'
                                ? item.name_ar
                                : lang === 'id'
                                ? item.name_id
                                : item.name_en}
                            </p>
                            {(item.description || item.description_ar) && (
                              <p className="text-[10px] text-stone-400 line-clamp-1 max-w-[280px] mt-0.5">
                                {item.description || item.description_ar}
                              </p>
                            )}
                            <p className="text-[11px] text-amber-400 font-mono font-bold mt-0.5">
                              {(item.price || 0).toLocaleString()} {cafe.currency_symbol || 'Rp'}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleToggleAvailability(item)}
                            className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-stone-800 text-xs text-stone-300 hover:text-stone-100 transition-colors cursor-pointer"
                            title="تغيير حالة التوفر في المنيو"
                          >
                            {item.is_available ? (
                              <>
                                <ToggleRight className="w-4 h-4 text-emerald-400" />
                                <span className="text-[10px] text-emerald-400 font-bold">متوفر</span>
                              </>
                            ) : (
                              <>
                                <ToggleLeft className="w-4 h-4 text-stone-500" />
                                <span className="text-[10px] text-stone-500 font-bold">غير متوفر</span>
                              </>
                            )}
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDeleteItem(item.id)}
                            className="p-2 rounded-xl text-stone-500 hover:text-red-400 hover:bg-stone-800 transition-colors cursor-pointer"
                            title="حذف الصنف"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>
                    ))}
                  {items.filter((i) => !selectedCatId || i.category_id === selectedCatId).length === 0 && (
                    <div className="p-8 text-center text-xs text-stone-500 bg-stone-900/40 rounded-2xl border border-stone-800">
                      لا توجد أصناف مسجلة في هذا القسم بعد. اضغط على زر "إضافة منتج جديد" لإضافة أول صنف!
                    </div>
                  )}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-stone-800 flex justify-end">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-800 hover:bg-stone-700 text-stone-200 text-xs font-semibold transition-colors cursor-pointer"
          >
            إغلاق
          </button>
        </div>
      </div>
    </div>
  );
}
