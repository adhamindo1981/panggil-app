import { Order, OrderStatus, CreateOrderPayload } from '@/types/database';
import { readServerJson, writeServerJson } from './server-storage-utils';

declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_ORDERS__: Order[] | undefined;
}

const ORDERS_FILE = 'orders.json';

const SEED_ORDERS: Order[] = [
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
    ],
    created_at: new Date(Date.now() - 12 * 60000).toISOString(),
    ready_at: new Date(Date.now() - 1 * 60000).toISOString(),
  },
];

function loadOrders(): Order[] {
  const disk = readServerJson<Order[]>(ORDERS_FILE, []);
  if (Array.isArray(disk) && disk.length > 0) {
    return disk;
  }
  writeServerJson(ORDERS_FILE, SEED_ORDERS);
  return [...SEED_ORDERS];
}

if (!global.__GLOBAL_PANGGIL_ORDERS__ || global.__GLOBAL_PANGGIL_ORDERS__.length === 0) {
  global.__GLOBAL_PANGGIL_ORDERS__ = loadOrders();
}

/**
 * Normalizes cafe identifiers for bulletproof cross-device matching
 * (e.g., 'cafe-ubk', 'ubk', and 'UBK' all map to the same base slug)
 */
function isCafeMatch(orderCafeId: string, targetCafeId: string): boolean {
  if (!orderCafeId || !targetCafeId) return false;
  if (orderCafeId === targetCafeId) return true;

  const cleanOrder = orderCafeId.replace(/^cafe-/, '').trim().toLowerCase();
  const cleanTarget = targetCafeId.replace(/^cafe-/, '').trim().toLowerCase();
  return cleanOrder === cleanTarget;
}

export function getServerOrders(cafeId?: string): Order[] {
  if (!global.__GLOBAL_PANGGIL_ORDERS__ || global.__GLOBAL_PANGGIL_ORDERS__.length === 0) {
    global.__GLOBAL_PANGGIL_ORDERS__ = loadOrders();
  }
  const all = global.__GLOBAL_PANGGIL_ORDERS__;
  if (cafeId) {
    return all.filter((o) => isCafeMatch(o.cafe_id, cafeId));
  }
  return all;
}

export function getServerOrderById(orderId: string): Order | null {
  const all = getServerOrders();
  return all.find((o) => o.id === orderId) || null;
}

export function createServerOrder(payload: CreateOrderPayload): Order {
  const orderNumber =
    payload.order_number || `#P-${Math.floor(100 + Math.random() * 900)}`;

  const newOrder: Order = {
    id: payload.id || (typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'order-' + Date.now()),
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

  const all = getServerOrders();
  // Avoid duplicate by id
  const filtered = all.filter((o) => o.id !== newOrder.id);
  const updated = [newOrder, ...filtered];
  global.__GLOBAL_PANGGIL_ORDERS__ = updated;
  writeServerJson(ORDERS_FILE, updated);
  return newOrder;
}

export function updateServerOrderStatus(
  orderId: string,
  status: OrderStatus,
  options?: { buzzed?: boolean }
): Order | null {
  const all = getServerOrders();
  const idx = all.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const current = all[idx];
  const updated: Order = {
    ...current,
    status,
    ready_at: status === 'ready' ? (current.ready_at || new Date().toISOString()) : current.ready_at,
    completed_at: status === 'completed' ? new Date().toISOString() : current.completed_at,
    buzzed_at: options?.buzzed ? Date.now() : current.buzzed_at,
  };

  all[idx] = updated;
  global.__GLOBAL_PANGGIL_ORDERS__ = [...all];
  writeServerJson(ORDERS_FILE, all);
  return updated;
}
