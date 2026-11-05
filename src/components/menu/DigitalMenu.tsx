"use client";

import React, { useState } from 'react';
import { Cafe, MenuCategory, MenuItem, OrderItem } from '@/types/database';
import { useI18n } from '@/lib/i18n/context';
import { dataService } from '@/lib/data-layer';
import { useRouter } from 'next/navigation';
import {
  ShoppingBag,
  Plus,
  Minus,
  Check,
  ArrowRight,
  Sparkles,
  X,
  Coffee,
  UtensilsCrossed,
} from 'lucide-react';

interface DigitalMenuProps {
  cafe: Cafe;
  categories: MenuCategory[];
  items: MenuItem[];
}

export function DigitalMenu({ cafe, categories, items }: DigitalMenuProps) {
  const { t, lang, formatCurrency, isRtl } = useI18n();
  const router = useRouter();

  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [cart, setCart] = useState<OrderItem[]>([]);
  const [isCartOpen, setIsCartOpen] = useState<boolean>(false);
  const [customerName, setCustomerName] = useState<string>('');
  const [notes, setNotes] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Filter items by category
  const filteredItems =
    selectedCategory === 'all'
      ? items
      : items.filter((item) => item.category_id === selectedCategory);

  // Cart operations
  const addToCart = (item: MenuItem) => {
    setCart((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          id: item.id,
          name_id: item.name_id,
          name_ar: item.name_ar,
          name_en: item.name_en,
          price: item.price,
          quantity: 1,
        },
      ];
    });
  };

  const updateQuantity = (itemId: string, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === itemId) {
            const newQty = item.quantity + delta;
            return newQty > 0 ? { ...item, quantity: newQty } : null;
          }
          return item;
        })
        .filter(Boolean) as OrderItem[]
    );
  };

  const totalItemsCount = cart.reduce((acc, curr) => acc + curr.quantity, 0);
  const subtotal = cart.reduce((acc, curr) => acc + curr.price * curr.quantity, 0);
  const taxRate = typeof cafe.tax_rate === 'number' ? cafe.tax_rate : 10;
  const tax = Math.round((subtotal * taxRate) / 100);
  const grandTotal = subtotal + tax;

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0 || !customerName.trim() || isSubmitting) return;

    setIsSubmitting(true);
    try {
      const order = await dataService.createOrder({
        cafe_id: cafe.id,
        customer_name: customerName.trim(),
        items: cart,
        total_amount: grandTotal,
        notes: notes.trim() || undefined,
      });

      // Redirect directly to customer's live pager view with order number and name
      router.push(
        `/c/${cafe.slug}/pager/${order.id}?num=${encodeURIComponent(order.order_number)}&name=${encodeURIComponent(order.customer_name || '')}`
      );
    } catch (err) {
      console.error('Checkout error:', err);
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-5xl mx-auto pb-36">
      {/* Category Pills Navigation */}
      <div className="sticky top-16 z-30 bg-[#070a13]/90 backdrop-blur-xl py-3 px-4 -mx-4 border-b border-zinc-800/80 mb-7 shadow-lg">
        <div className="flex gap-2.5 overflow-x-auto scrollbar-none py-1">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
              selectedCategory === 'all'
                ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 scale-102 font-black'
                : 'bg-[#0d121e] border border-zinc-800 text-zinc-400 hover:text-white'
            }`}
          >
            {t.menu.allCategories}
          </button>
          {categories.map((cat) => {
            const catName =
              lang === 'id' ? cat.name_id : lang === 'ar' ? cat.name_ar : cat.name_en;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-5 py-2.5 rounded-2xl text-xs font-bold whitespace-nowrap transition-all duration-200 ${
                  selectedCategory === cat.id
                    ? 'bg-amber-500 text-zinc-950 shadow-lg shadow-amber-500/20 scale-102 font-black'
                    : 'bg-[#0d121e] border border-zinc-800 text-zinc-400 hover:text-white'
                }`}
              >
                {catName}
              </button>
            );
          })}
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filteredItems.map((item) => {
          const itemName =
            lang === 'id' ? item.name_id : lang === 'ar' ? item.name_ar : item.name_en;
          const inCartItem = cart.find((i) => i.id === item.id);

          return (
            <div
              key={item.id}
              className="bg-[#0d121e] border border-zinc-800/90 rounded-3xl overflow-hidden shadow-xl hover:border-zinc-700 hover:shadow-2xl transition-all flex flex-col justify-between group"
            >
              {/* Product Image with Gradient Overlay */}
              {item.image_url && (
                <div className="relative h-48 w-full bg-zinc-900 overflow-hidden">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={item.image_url}
                    alt={itemName}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0d121e] via-transparent to-transparent opacity-90" />
                </div>
              )}

              {/* Product Info */}
              <div className="p-5 flex-1 flex flex-col justify-between">
                <div>
                  <h3 className="font-extrabold text-white text-base mb-1.5 line-clamp-1">
                    {itemName}
                  </h3>
                  <p className="text-amber-400 font-black text-lg font-mono">
                    {formatCurrency(item.price, cafe.currency_symbol)}
                  </p>
                </div>

                {/* Add to Cart / Quantity Selector */}
                <div className="mt-5 pt-3 border-t border-zinc-800/80 flex items-center justify-between">
                  {inCartItem ? (
                    <div className="flex items-center gap-3 bg-[#070a13] border border-zinc-800 rounded-2xl px-3 py-1.5 shadow-inner">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="text-sm font-black text-amber-400 font-mono w-5 text-center">
                        {inCartItem.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="p-1 text-zinc-400 hover:text-white transition-colors"
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => addToCart(item)}
                      className="w-full py-2.5 px-4 bg-zinc-800/80 hover:bg-amber-500 hover:text-zinc-950 text-zinc-100 text-xs font-black rounded-2xl transition-all duration-200 flex items-center justify-center gap-2 active:scale-95 shadow-md"
                    >
                      <Plus className="w-4 h-4" />
                      <span>{t.menu.addToCart}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Floating Bottom Cart Bar */}
      {totalItemsCount > 0 && (
        <div className="fixed bottom-6 inset-x-4 max-w-md mx-auto z-40 animate-in slide-in-from-bottom duration-300">
          <button
            onClick={() => setIsCartOpen(true)}
            className="w-full py-4 px-6 bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 hover:from-amber-400 hover:to-orange-300 text-zinc-950 font-black rounded-3xl shadow-2xl shadow-amber-500/40 flex items-center justify-between transition-transform active:scale-98 ring-2 ring-white/20"
          >
            <div className="flex items-center gap-3.5">
              <div className="relative p-2.5 bg-zinc-950 text-amber-400 rounded-2xl shadow-md">
                <ShoppingBag className="w-5 h-5" />
                <span className="absolute -top-2 -right-2 bg-red-600 text-white text-[11px] w-5 h-5 rounded-full flex items-center justify-center font-black">
                  {totalItemsCount}
                </span>
              </div>
              <div className="text-left">
                <p className="text-xs uppercase tracking-wider text-zinc-950 font-black">
                  {t.menu.cart}
                </p>
                <p className="text-xs text-zinc-900 font-bold opacity-90">
                  {totalItemsCount} items
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-base font-black font-mono">
                {formatCurrency(grandTotal, cafe.currency_symbol)}
              </span>
              <ArrowRight className="w-5 h-5" />
            </div>
          </button>
        </div>
      )}

      {/* Slide-over Cart Drawer Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/85 backdrop-blur-md animate-in fade-in">
          <div className="w-full max-w-lg bg-[#0d121e] border border-zinc-800 rounded-t-3xl sm:rounded-3xl shadow-2xl flex flex-col max-h-[90vh] overflow-hidden">
            {/* Header */}
            <div className="p-5 border-b border-zinc-800 flex items-center justify-between bg-[#070a13]/80">
              <div className="flex items-center gap-2.5">
                <div className="p-2 bg-amber-500/10 text-amber-400 rounded-xl">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <h3 className="font-black text-white text-lg">{t.menu.yourCart}</h3>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="p-1.5 text-zinc-400 hover:text-white bg-zinc-800 rounded-xl"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-5 overflow-y-auto flex-1 space-y-3.5">
              {cart.map((item) => {
                const itemName =
                  lang === 'id' ? item.name_id : lang === 'ar' ? item.name_ar : item.name_en;
                return (
                  <div
                    key={item.id}
                    className="p-4 bg-[#070a13] border border-zinc-800 rounded-2xl flex items-center justify-between shadow-inner"
                  >
                    <div>
                      <p className="text-sm font-bold text-white">{itemName}</p>
                      <p className="text-xs text-amber-400 font-black font-mono mt-0.5">
                        {formatCurrency(item.price, cafe.currency_symbol)}
                      </p>
                    </div>
                    <div className="flex items-center gap-2.5 bg-zinc-900 border border-zinc-800 rounded-xl px-2.5 py-1">
                      <button
                        onClick={() => updateQuantity(item.id, -1)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-xs font-mono font-black text-white w-5 text-center">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.id, 1)}
                        className="text-zinc-400 hover:text-white"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}

              {/* Customer Checkout Form */}
              <form onSubmit={handleCheckout} className="mt-5 pt-5 border-t border-zinc-800 space-y-3.5">
                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t.cashier.customerName} *
                  </label>
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder={t.cashier.enterCustomerName}
                    className="w-full px-4 py-2.5 text-xs bg-[#070a13] border border-zinc-800 rounded-2xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-zinc-300 uppercase tracking-wider mb-1.5">
                    {t.menu.notesPlaceholder}
                  </label>
                  <input
                    type="text"
                    value={notes}
                    onChange={(e) => setNotes(e.target.value)}
                    placeholder="e.g. less sugar, extra cup"
                    className="w-full px-4 py-2.5 text-xs bg-[#070a13] border border-zinc-800 rounded-2xl text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                {/* Subtotal & Taxes Summary */}
                <div className="pt-3 text-xs space-y-2 border-t border-zinc-800">
                  <div className="flex justify-between text-zinc-400">
                    <span>{t.menu.subtotal}</span>
                    <span className="font-mono font-bold text-zinc-200">
                      {formatCurrency(subtotal, cafe.currency_symbol)}
                    </span>
                  </div>
                  <div className="flex justify-between text-zinc-400">
                    <span>{t.menu.tax} {taxRate > 0 ? `(${taxRate}%)` : '(0%)'}</span>
                    <span className="font-mono font-bold text-zinc-200">
                      {formatCurrency(tax, cafe.currency_symbol)}
                    </span>
                  </div>
                  <div className="flex justify-between font-black text-base text-white pt-2 border-t border-zinc-800">
                    <span>{t.common.total}</span>
                    <span className="font-mono text-amber-400">
                      {formatCurrency(grandTotal, cafe.currency_symbol)}
                    </span>
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={isSubmitting || !customerName.trim()}
                  className="w-full mt-4 py-4 px-5 rounded-2xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-400 hover:from-amber-400 hover:to-orange-300 disabled:opacity-50 text-zinc-950 font-black text-sm shadow-xl shadow-amber-500/20 transition-all active:scale-98 flex items-center justify-center gap-2"
                >
                  <Sparkles className="w-4 h-4" />
                  <span>{isSubmitting ? t.common.loading : t.menu.checkout}</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
