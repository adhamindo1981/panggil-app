import { Order, OrderStatus, CreateOrderPayload } from '@/types/database';
import { INITIAL_CAFES } from './data-layer';

// In-Memory Global Server Store for Multi-Device Cross-Network Synchronization
// Survives across API routes and serves all connected devices (Cashier PC & Customer Phone)
declare global {
  // eslint-disable-next-line no-var
  var __GLOBAL_PANGGIL_ORDERS__: Order[] | undefined;
}

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

if (!global.__GLOBAL_PANGGIL_ORDERS__) {
  global.__GLOBAL_PANGGIL_ORDERS__ = [...SEED_ORDERS];
}

export function getServerOrders(cafeId?: string): Order[] {
  const all = global.__GLOBAL_PANGGIL_ORDERS__ || SEED_ORDERS;
  if (cafeId) {
    return all.filter((o) => o.cafe_id === cafeId);
  }
  return all;
}

export function getServerOrderById(orderId: string): Order | null {
  const all = global.__GLOBAL_PANGGIL_ORDERS__ || SEED_ORDERS;
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

  if (!global.__GLOBAL_PANGGIL_ORDERS__) {
    global.__GLOBAL_PANGGIL_ORDERS__ = [...SEED_ORDERS];
  }
  global.__GLOBAL_PANGGIL_ORDERS__ = [newOrder, ...global.__GLOBAL_PANGGIL_ORDERS__];
  return newOrder;
}

export function updateServerOrderStatus(
  orderId: string,
  status: OrderStatus,
  options?: { buzzed?: boolean }
): Order | null {
  if (!global.__GLOBAL_PANGGIL_ORDERS__) {
    global.__GLOBAL_PANGGIL_ORDERS__ = [...SEED_ORDERS];
  }

  const idx = global.__GLOBAL_PANGGIL_ORDERS__.findIndex((o) => o.id === orderId);
  if (idx === -1) return null;

  const current = global.__GLOBAL_PANGGIL_ORDERS__[idx];
  const updated: Order = {
    ...current,
    status,
    ready_at: status === 'ready' ? (current.ready_at || new Date().toISOString()) : current.ready_at,
    completed_at: status === 'completed' ? new Date().toISOString() : current.completed_at,
    buzzed_at: options?.buzzed ? Date.now() : current.buzzed_at,
  };

  global.__GLOBAL_PANGGIL_ORDERS__[idx] = updated;
  return updated;
}
