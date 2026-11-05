/**
 * Unified Data & Realtime Layer for "Panggil / نداء"
 * Production-ready hybrid service:
 *  1. Supabase PostgreSQL & Realtime channel if credentials configured.
 *  2. Robust LocalStorage & Cross-Tab BroadcastChannel fallback with zero setup needed.
 */

import {
  Cafe,
  MenuCategory,
  MenuItem,
  Order,
  OrderStatus,
  CreateOrderPayload,
} from '@/types/database';
import { supabase, isSupabaseConfigured } from './supabase/client';
import type { RealtimeChannel } from '@supabase/supabase-js';
import { cloudRelay } from './cloud-relay';

// Initial Mock Cafes
export const INITIAL_CAFES: Cafe[] = [
  {
    id: '00000000-0000-0000-0000-000000000001',
    name: 'Kopi Nusantara / قهوة نوسانتارا',
    slug: 'kopi-nusantara',
    mode: 'menu_pager',
    default_lang: 'id',
    subscription_tier: 'gold',
    custom_branding: {
      logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
      primary_color: '#f59e0b',
      hide_powered_by: true,
    },
    logo_url: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=300&auto=format&fit=crop&q=80',
    phone: '+62 812-3456-7890',
    address: 'Jl. Senopati No. 45, Jakarta Selatan',
    currency_symbol: 'Rp',
    google_maps_url: 'https://maps.google.com/?q=Senopati+Jakarta+Coffee',
    cashier_pin: '1234',
  },
  {
    id: '00000000-0000-0000-0000-000000000002',
    name: 'Nedaa Express / نداء إكسبريس',
    slug: 'nedaa-express',
    mode: 'pager_only',
    default_lang: 'ar',
    subscription_tier: 'bronze',
    logo_url: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=300&auto=format&fit=crop&q=80',
    phone: '+966 50 123 4567',
    address: 'طريق الملك فهد، العليا، الرياض',
    currency_symbol: 'SAR',
    google_maps_url: 'https://maps.google.com/?q=Riyadh+Coffee+Express',
    cashier_pin: '1234',
  },
  {
    id: '00000000-0000-0000-0000-000000000003',
    name: 'Quick Pager Cafe / كافيه بيجر الأساسي',
    slug: 'basic-cafe',
    mode: 'pager_only',
    default_lang: 'ar',
    subscription_tier: 'basic',
    phone: '+966 55 000 1111',
    address: 'شارع التحلية، الرياض',
    currency_symbol: 'SAR',
    cashier_pin: '1234',
  },
  {
    id: '00000000-0000-0000-0000-000000000004',
    name: 'Silver Lounge / سيلفر لاونج',
    slug: 'silver-cafe',
    mode: 'menu_pager',
    default_lang: 'en',
    subscription_tier: 'silver',
    phone: '+966 55 222 3333',
    address: 'King Abdullah Financial District, Riyadh',
    currency_symbol: 'SAR',
    google_maps_url: 'https://maps.google.com/?q=KAFD+Riyadh',
    cashier_pin: '1234',
  },
];

// Initial Categories for Kopi Nusantara
export const INITIAL_CATEGORIES: MenuCategory[] = [
  {
    id: '10000000-0000-0000-0000-000000000001',
    cafe_id: '00000000-0000-0000-0000-000000000001',
    name_id: 'Kopi Signature',
    name_ar: 'القهوة المختصة',
    name_en: 'Signature Coffee',
    display_order: 1,
  },
  {
    id: '10000000-0000-0000-0000-000000000002',
    cafe_id: '00000000-0000-0000-0000-000000000001',
    name_id: 'Minuman Non-Kopi',
    name_ar: 'المشروبات المنعشة',
    name_en: 'Non-Coffee Drinks',
    display_order: 2,
  },
  {
    id: '10000000-0000-0000-0000-000000000003',
    cafe_id: '00000000-0000-0000-0000-000000000001',
    name_id: 'Makanan Berat',
    name_ar: 'الوجبات الرئيسية',
    name_en: 'Main Meals',
    display_order: 3,
  },
  {
    id: '10000000-0000-0000-0000-000000000004',
    cafe_id: '00000000-0000-0000-0000-000000000001',
    name_id: 'Camilan & Roti',
    name_ar: 'الحلويات والمخبوزات',
    name_en: 'Snacks & Pastries',
    display_order: 4,
  },
];

// Initial Menu Items
export const INITIAL_MENU_ITEMS: MenuItem[] = [
  {
    id: '20000000-0000-0000-0000-000000000001',
    category_id: '10000000-0000-0000-0000-000000000001',
    name_id: 'Es Kopi Susu Gula Aren',
    name_ar: 'قهوة مثلجة بحليب وسكر النخيل',
    name_en: 'Iced Palm Sugar Latte',
    price: 22000,
    image_url: 'https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000002',
    category_id: '10000000-0000-0000-0000-000000000001',
    name_id: 'Americano Double Shot',
    name_ar: 'أمريكانو دبل شوت',
    name_en: 'Double Shot Americano',
    price: 18000,
    image_url: 'https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000003',
    category_id: '10000000-0000-0000-0000-000000000001',
    name_id: 'Spanish Latte Creamy',
    name_ar: 'سبانش لاتيه كريمي',
    name_en: 'Creamy Spanish Latte',
    price: 28000,
    image_url: 'https://images.unsplash.com/photo-1541167760496-1628856ab772?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000004',
    category_id: '10000000-0000-0000-0000-000000000002',
    name_id: 'Matcha Latte Premium',
    name_ar: 'ماتشا لاتيه فاخر',
    name_en: 'Premium Matcha Latte',
    price: 26000,
    image_url: 'https://images.unsplash.com/photo-1536256263959-770b48d82b0a?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000005',
    category_id: '10000000-0000-0000-0000-000000000002',
    name_id: 'Signature Artisan Chocolate',
    name_ar: 'شوكولاتة حرفية مميزة',
    name_en: 'Artisan Dark Chocolate',
    price: 25000,
    image_url: 'https://images.unsplash.com/photo-1542990253-0d0f5be5f0ed?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000006',
    category_id: '10000000-0000-0000-0000-000000000003',
    name_id: 'Nasi Goreng Kampung Spesial',
    name_ar: 'أرز مقلي إندونيسي خاص',
    name_en: 'Special Kampung Fried Rice',
    price: 35000,
    image_url: 'https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000007',
    category_id: '10000000-0000-0000-0000-000000000003',
    name_id: 'Crispy Chicken Mentai Rice',
    name_ar: 'دجاج مقرمش بصلصة مينتاي',
    name_en: 'Crispy Chicken Mentai',
    price: 38000,
    image_url: 'https://images.unsplash.com/photo-1562967914-608f82629710?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000008',
    category_id: '10000000-0000-0000-0000-000000000004',
    name_id: 'Kentang Goreng Truffle & Keju',
    name_ar: 'بطاطس مقلية بالكمأة والجبن',
    name_en: 'Truffle Parmesan Fries',
    price: 24000,
    image_url: 'https://images.unsplash.com/photo-1576107232684-1279f3908594?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
  {
    id: '20000000-0000-0000-0000-000000000009',
    category_id: '10000000-0000-0000-0000-000000000004',
    name_id: 'Croissant Butter Perancis',
    name_ar: 'كرواسون زبدة فرنسي طازج',
    name_en: 'French Butter Croissant',
    price: 20000,
    image_url: 'https://images.unsplash.com/photo-1555507036-ab1f4038808a?w=500&auto=format&fit=crop&q=80',
    is_available: true,
  },
];

// Initial Orders
const INITIAL_ORDERS: Order[] = [
  {
    id: '30000000-0000-0000-0000-000000000001',
    cafe_id: '00000000-0000-0000-0000-000000000001',
    order_number: '#A-101',
    customer_name: 'Budi Santoso / بودي',
    customer_phone: '+628129876543',
    status: 'pending',
    total_amount: 44000,
    items: [
      {
        id: '20000000-0000-0000-0000-000000000001',
        name_id: 'Es Kopi Susu Gula Aren',
        name_ar: 'قهوة مثلجة بحليب وسكر النخيل',
        name_en: 'Iced Palm Sugar Latte',
        price: 22000,
        quantity: 2,
      },
    ],
    created_at: new Date(Date.now() - 4 * 60000).toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000002',
    cafe_id: '00000000-0000-0000-0000-000000000001',
    order_number: '#A-102',
    customer_name: 'Siti Rahma / سارة',
    customer_phone: '+628131122334',
    status: 'ready',
    total_amount: 59000,
    items: [
      {
        id: '20000000-0000-0000-0000-000000000006',
        name_id: 'Nasi Goreng Kampung Spesial',
        name_ar: 'أرز مقلي إندونيسي خاص',
        name_en: 'Special Kampung Fried Rice',
        price: 35000,
        quantity: 1,
      },
      {
        id: '20000000-0000-0000-0000-000000000008',
        name_id: 'Kentang Goreng Truffle & Keju',
        name_ar: 'بطاطس مقلية بالكمأة والجبن',
        name_en: 'Truffle Parmesan Fries',
        price: 24000,
        quantity: 1,
      },
    ],
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    ready_at: new Date(Date.now() - 1 * 60000).toISOString(),
  },
  {
    id: '30000000-0000-0000-0000-000000000003',
    cafe_id: '00000000-0000-0000-0000-000000000002',
    order_number: '#E-201',
    customer_name: 'فهد الشمري / Fahad',
    customer_phone: '+966501234567',
    status: 'pending',
    total_amount: 0,
    items: [],
    created_at: new Date(Date.now() - 3 * 60000).toISOString(),
  },
];

// BroadcastChannel for cross-tab realtime sync (Sub-second latency)
const broadcastChannel =
  typeof window !== 'undefined' && 'BroadcastChannel' in window
    ? new BroadcastChannel('panggil_realtime_orders')
    : null;

class PanggilDataService {
  private getLocalOrders(): Order[] {
    if (typeof window === 'undefined') {
      const g = global as unknown as { __GLOBAL_PANGGIL_ORDERS__?: Order[] };
      return g.__GLOBAL_PANGGIL_ORDERS__ || INITIAL_ORDERS;
    }
    try {
      const stored = localStorage.getItem('panggil_orders');
      if (!stored) {
        localStorage.setItem('panggil_orders', JSON.stringify(INITIAL_ORDERS));
        return INITIAL_ORDERS;
      }
      return JSON.parse(stored);
    } catch {
      return INITIAL_ORDERS;
    }
  }

  private saveLocalOrders(orders: Order[]) {
    if (typeof window === 'undefined') return;
    try {
      localStorage.setItem('panggil_orders', JSON.stringify(orders));
      // Notify other tabs immediately
      broadcastChannel?.postMessage({ type: 'ORDERS_UPDATED', orders });
      window.dispatchEvent(new CustomEvent('panggil_local_order_updated', { detail: orders }));
    } catch (e) {
      console.error('Failed to save local orders:', e);
    }
  }

  public async getCafeBySlug(slug: string): Promise<Cafe | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('cafes')
        .select('*')
        .eq('slug', slug)
        .single();
      if (!error && data) return data as Cafe;
    }
    // Fallback to local
    return INITIAL_CAFES.find((c) => c.slug === slug) || INITIAL_CAFES[0];
  }

  public async updateCafeMode(cafeId: string, mode: 'pager_only' | 'menu_pager'): Promise<void> {
    if (isSupabaseConfigured && supabase) {
      await supabase.from('cafes').update({ mode }).eq('id', cafeId);
    }
    const cafe = INITIAL_CAFES.find(c => c.id === cafeId);
    if (cafe) {
      cafe.mode = mode;
      broadcastChannel?.postMessage({ type: 'CAFE_UPDATED', cafeId, mode });
    }
  }

  public async getMenuCategories(cafeId: string): Promise<MenuCategory[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('menu_categories')
        .select('*')
        .eq('cafe_id', cafeId)
        .order('display_order', { ascending: true });
      if (!error && data) return data as MenuCategory[];
    }
    return INITIAL_CATEGORIES.filter((c) => c.cafe_id === cafeId);
  }

  public async getMenuItems(cafeId: string): Promise<MenuItem[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('menu_items')
        .select('*')
        .order('created_at', { ascending: true });
      if (!error && data) return data as MenuItem[];
    }
    return INITIAL_MENU_ITEMS;
  }

  public async getOrders(cafeId: string): Promise<Order[]> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('cafe_id', cafeId)
        .order('created_at', { ascending: false });
      if (!error && data) return data as Order[];
    }

    if (typeof window !== 'undefined') {
      try {
        const [apiRes, cloudOrders] = await Promise.all([
          fetch(`/api/orders?cafe_id=${cafeId}`).then((r) => r.ok ? r.json() : null).catch(() => null),
          cloudRelay.fetchRecentCafeOrders(cafeId),
        ]);

        const serverOrders = (apiRes?.orders && Array.isArray(apiRes.orders)) ? apiRes.orders as Order[] : [];
        const localOrders = this.getLocalOrders();
        const map = new Map<string, Order>();

        serverOrders.forEach((o) => map.set(o.id, o));
        cloudOrders.forEach((o) => map.set(o.id, o));
        localOrders.forEach((o) => {
          if (o.cafe_id === cafeId) {
            map.set(o.id, o);
          }
        });

        return Array.from(map.values()).sort(
          (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
        );
      } catch {}
    }

    const local = this.getLocalOrders();
    return local.filter((o) => o.cafe_id === cafeId);
  }

  public async getOrderById(orderId: string): Promise<Order | null> {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .eq('id', orderId)
        .single();
      if (!error && data) return data as Order;
    }
    const local = this.getLocalOrders();
    const found = local.find((o) => o.id === orderId);
    if (found) return found;

    // Client-side fallback to server API store if not present in phone's local storage
    if (typeof window !== 'undefined') {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) return data.order as Order;
        }
      } catch {}
    }

    return null;
  }

  public async createOrder(payload: CreateOrderPayload): Promise<Order> {
    const orderNumber =
      payload.order_number ||
      `#P-${Math.floor(100 + Math.random() * 900)}`;

    const newOrder: Order = {
      id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'order-' + Date.now(),
      cafe_id: payload.cafe_id,
      order_number: orderNumber,
      customer_name: payload.customer_name,
      customer_phone: payload.customer_phone,
      status: 'pending',
      total_amount: payload.total_amount || 0,
      items: payload.items || [],
      notes: payload.notes,
      created_at: new Date().toISOString(),
    };

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from('orders')
        .insert([newOrder])
        .select()
        .single();
      if (!error && data) return data as Order;
    }

    // Always register order on server API store for seamless multi-device & QR sync
    if (typeof window !== 'undefined') {
      try {
        fetch('/api/orders', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(newOrder),
        }).catch(() => {});
      } catch {}
    }

    // Publish to Universal Cloud Relay for instant multi-device recognition
    cloudRelay.publish(newOrder.id, {
      type: 'ORDER_CREATED',
      orderId: newOrder.id,
      orderNumber: newOrder.order_number,
      status: newOrder.status,
    });

    // Broadcast new order to Cashier Dashboard via Cafe channel
    cloudRelay.publishCafeOrder(newOrder.cafe_id, newOrder);

    const localOrders = this.getLocalOrders();
    const updated = [newOrder, ...localOrders];
    this.saveLocalOrders(updated);
    return newOrder;
  }

  public async updateOrderStatus(
    orderId: string,
    status: OrderStatus
  ): Promise<Order | null> {
    const readyAt = status === 'ready' ? new Date().toISOString() : undefined;
    const completedAt = status === 'completed' ? new Date().toISOString() : undefined;

    // 1. Notify Server API for Cross-Device / Mobile sync
    if (typeof window !== 'undefined') {
      try {
        fetch(`/api/orders/${orderId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status }),
        }).catch(() => {});
      } catch {}
    }

    // 2. Publish to Universal Cloud Relay (Cross-Device: Cashier PC -> Customer Phone)
    cloudRelay.publish(orderId, {
      type: 'STATUS_CHANGED',
      orderId,
      status,
    });

    if (isSupabaseConfigured && supabase) {
      const updateData: Partial<Order> = { status };
      if (readyAt) updateData.ready_at = readyAt;
      if (completedAt) updateData.completed_at = completedAt;

      const { data, error } = await supabase
        .from('orders')
        .update(updateData)
        .eq('id', orderId)
        .select()
        .single();

      if (!error && data) return data as Order;
    }

    const localOrders = this.getLocalOrders();
    const index = localOrders.findIndex((o) => o.id === orderId);
    if (index === -1) return null;

    const updatedOrder: Order = {
      ...localOrders[index],
      status,
      ready_at: readyAt || localOrders[index].ready_at,
      completed_at: completedAt || localOrders[index].completed_at,
    };

    localOrders[index] = updatedOrder;
    this.saveLocalOrders([...localOrders]);
    return updatedOrder;
  }

  /**
   * Buzz order: Trigger readiness and send instant realtime buzz signal across devices
   */
  public async buzzOrder(orderId: string): Promise<Order | null> {
    const updated = await this.updateOrderStatus(orderId, 'ready');

    // Notify server buzz API immediately
    if (typeof window !== 'undefined') {
      try {
        fetch(`/api/orders/${orderId}/buzz`, { method: 'POST' }).catch(() => {});
      } catch {}
    }

    // Publish high-priority buzz event to Universal Cloud Relay (<100ms delivery to Customer Phone)
    cloudRelay.publish(orderId, {
      type: 'ORDER_BUZZED',
      orderId,
      status: 'ready',
      buzzedAt: Date.now(),
    });

    // Send immediate buzz event for connected client listeners
    if (broadcastChannel) {
      broadcastChannel.postMessage({
        type: 'ORDER_BUZZED',
        orderId,
        timestamp: Date.now(),
      });
    }
    return updated;
  }

  /**
   * Subscribe to all orders for a cafe with realtime updates & server polling fallback
   */
  public subscribeToOrders(
    cafeId: string,
    onChange: () => void
  ): () => void {
    // 1. Supabase Realtime channel if available
    let supabaseChannel: RealtimeChannel | null = null;
    if (isSupabaseConfigured && supabase) {
      supabaseChannel = supabase
        .channel(`orders_cafe_${cafeId}`)
        .on(
          'postgres_changes',
          { event: '*', schema: 'public', table: 'orders', filter: `cafe_id=eq.${cafeId}` },
          () => onChange()
        )
        .subscribe();
    }

    // 2. BroadcastChannel & Local Event listeners for cross-tab sync
    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'ORDERS_UPDATED' || event.data?.type === 'ORDER_BUZZED') {
        onChange();
      }
    };

    const handleLocalEvent = () => onChange();

    broadcastChannel?.addEventListener('message', handleBroadcast);
    window.addEventListener('panggil_local_order_updated', handleLocalEvent);

    // 3. Universal Cloud Relay for Table Orders (Customer Phone -> Cashier Dashboard)
    const unsubCloudCafe = cloudRelay.subscribeCafeOrders(cafeId, (newOrder) => {
      const local = this.getLocalOrders();
      if (!local.some((o) => o.id === newOrder.id)) {
        this.saveLocalOrders([newOrder, ...local]);
      }
      onChange();
    });

    // 4. Fast Server Polling (every 2.5s) for multi-device sync
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders?cafe_id=${cafeId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.orders) {
            onChange();
          }
        }
      } catch {}
    }, 2500);

    return () => {
      unsubCloudCafe();
      clearInterval(pollInterval);
      supabaseChannel?.unsubscribe();
      broadcastChannel?.removeEventListener('message', handleBroadcast);
      window.removeEventListener('panggil_local_order_updated', handleLocalEvent);
    };
  }

  /**
   * Subscribe to a single order for the customer pager view (Mobile Device Realtime)
   */
  public subscribeToOrder(
    orderId: string,
    onUpdate: (order: Order, wasBuzzed?: boolean) => void
  ): () => void {
    let lastKnownStatus: OrderStatus | null = null;
    let lastKnownBuzzedAt: number | undefined = undefined;

    let supabaseChannel: RealtimeChannel | null = null;
    if (isSupabaseConfigured && supabase) {
      supabaseChannel = supabase
        .channel(`order_single_${orderId}`)
        .on(
          'postgres_changes',
          { event: 'UPDATE', schema: 'public', table: 'orders', filter: `id=eq.${orderId}` },
          (payload) => {
            const updated = payload.new as Order;
            lastKnownStatus = updated.status;
            onUpdate(updated, updated.status === 'ready');
          }
        )
        .subscribe();
    }

    const handleBroadcast = (event: MessageEvent) => {
      if (event.data?.type === 'ORDER_BUZZED' && event.data?.orderId === orderId) {
        this.getOrderById(orderId).then((ord) => {
          if (ord) {
            lastKnownStatus = ord.status;
            onUpdate(ord, true);
          }
        });
      } else if (event.data?.type === 'ORDERS_UPDATED') {
        this.getOrderById(orderId).then((ord) => {
          if (ord) {
            lastKnownStatus = ord.status;
            onUpdate(ord, ord.status === 'ready');
          }
        });
      }
    };

    const handleLocalEvent = () => {
      this.getOrderById(orderId).then((ord) => {
        if (ord) {
          lastKnownStatus = ord.status;
          onUpdate(ord, ord.status === 'ready');
        }
      });
    };

    broadcastChannel?.addEventListener('message', handleBroadcast);
    window.addEventListener('panggil_local_order_updated', handleLocalEvent);

    // 4. Universal Cloud Realtime Relay (Direct SSE Stream from Cashier PC with <100ms latency)
    const unsubCloudRelay = cloudRelay.subscribe(orderId, (msg) => {
      const isBuzz = msg.type === 'ORDER_BUZZED' || msg.status === 'ready';
      const buzzedTime = msg.buzzedAt || (isBuzz ? Date.now() : undefined);
      lastKnownStatus = msg.status;
      if (buzzedTime) lastKnownBuzzedAt = buzzedTime;

      this.getOrderById(orderId).then((ord) => {
        const fallback: Order = ord || {
          id: orderId,
          cafe_id: '',
          order_number: msg.orderNumber || `#${orderId.slice(0, 5)}`,
          customer_name: 'Pelanggan / عميل',
          customer_phone: '',
          status: msg.status,
          total_amount: 0,
          items: [],
          created_at: new Date().toISOString(),
          buzzed_at: buzzedTime,
        };
        onUpdate(
          { ...fallback, status: msg.status, buzzed_at: buzzedTime },
          isBuzz
        );
      });
    });

    // 5. Ultra-Fast Sub-Second Mobile Server Polling (every 600ms) to sync PC cashier buzz to phone instantly
    const pollInterval = setInterval(async () => {
      try {
        const res = await fetch(`/api/orders/${orderId}`);
        if (res.ok) {
          const data = await res.json();
          if (data.order) {
            const freshOrder = data.order as Order;
            const statusChangedToReady = lastKnownStatus !== 'ready' && freshOrder.status === 'ready';
            const wasReBuzzed = !!(freshOrder.buzzed_at && freshOrder.buzzed_at !== lastKnownBuzzedAt);

            if (freshOrder.status !== lastKnownStatus || statusChangedToReady || wasReBuzzed) {
              lastKnownStatus = freshOrder.status;
              lastKnownBuzzedAt = freshOrder.buzzed_at;
              onUpdate(freshOrder, statusChangedToReady || wasReBuzzed || freshOrder.status === 'ready');
            }
          }
        }
      } catch {}
    }, 600);

    return () => {
      unsubCloudRelay();
      clearInterval(pollInterval);
      supabaseChannel?.unsubscribe();
      broadcastChannel?.removeEventListener('message', handleBroadcast);
      window.removeEventListener('panggil_local_order_updated', handleLocalEvent);
    };
  }
}

export const dataService = new PanggilDataService();
