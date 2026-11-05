/**
 * Universal Multi-Device Cloud Realtime Relay for "Panggil / نداء"
 * Enables instant (<100ms) cross-device signaling (Cashier PC <-> Customer Phone)
 * across any network (Wi-Fi, 4G/5G, NATs) without requiring external server setup.
 */

import { OrderStatus } from '@/types/database';

export interface RelayMessage {
  type: 'ORDER_CREATED' | 'ORDER_BUZZED' | 'STATUS_CHANGED';
  orderId: string;
  orderNumber?: string;
  status: OrderStatus;
  buzzedAt?: number;
  timestamp: number;
}

class UniversalCloudRelay {
  private getTopic(orderId: string): string {
    // Sanitize topic name for valid URI characters
    const cleanId = orderId.replace(/[^a-zA-Z0-9_-]/g, '').slice(0, 48);
    return `panggil-order-${cleanId}`;
  }

  /**
   * Publish an event to the cloud relay (Cashier PC -> Customer Phone)
   */
  public async publish(orderId: string, payload: Partial<RelayMessage>): Promise<boolean> {
    const topic = this.getTopic(orderId);
    const message: RelayMessage = {
      type: payload.type || 'STATUS_CHANGED',
      orderId,
      orderNumber: payload.orderNumber,
      status: payload.status || 'pending',
      buzzedAt: payload.buzzedAt || (payload.type === 'ORDER_BUZZED' ? Date.now() : undefined),
      timestamp: Date.now(),
    };

    try {
      if (typeof window !== 'undefined') {
        const response = await fetch(`https://ntfy.sh/${topic}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Title': `Panggil Alert: ${message.orderNumber || orderId}`,
            'Priority': message.type === 'ORDER_BUZZED' ? 'high' : 'default',
            'Tags': message.type === 'ORDER_BUZZED' ? 'bell,warning' : 'receipt',
          },
          body: JSON.stringify(message),
        });

        // Also broadcast to ticket number topic if available for keypad lookup compatibility
        if (payload.orderNumber) {
          const cleanNum = payload.orderNumber.replace(/[^a-zA-Z0-9_-]/g, '').toLowerCase();
          if (cleanNum) {
            const ticketTopic = this.getTopic(`ticket-${cleanNum}`);
            fetch(`https://ntfy.sh/${ticketTopic}`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(message),
            }).catch(() => {});
          }
        }

        return response.ok;
      }
      return true;
    } catch (e) {
      console.warn('Cloud relay publish notice:', e);
      return false;
    }
  }

  /**
   * Subscribe to live events on the customer mobile device (Customer Phone <- Cashier PC)
   */
  public subscribe(
    orderId: string,
    onMessage: (msg: RelayMessage) => void
  ): () => void {
    if (typeof window === 'undefined') {
      return () => {};
    }

    const topic = this.getTopic(orderId);
    let eventSource: EventSource | null = null;
    let isSubscribed = true;

    // 1. Initial State Poll: Retrieve latest message in case phone opened after Cashier buzzed
    this.fetchLatestState(orderId).then((latest) => {
      if (isSubscribed && latest) {
        onMessage(latest);
      }
    });

    // 2. Open Persistent Server-Sent Events (SSE) Stream
    try {
      eventSource = new EventSource(`https://ntfy.sh/${topic}/sse`);

      eventSource.onmessage = (event) => {
        if (!isSubscribed) return;
        try {
          const parsed = JSON.parse(event.data);
          // If ntfy wrapper, actual message is in parsed.message
          let dataObj: RelayMessage | null = null;
          if (parsed.message) {
            try {
              dataObj = JSON.parse(parsed.message);
            } catch {
              if (parsed.message.includes('ready')) {
                dataObj = {
                  type: 'ORDER_BUZZED',
                  orderId,
                  status: 'ready',
                  buzzedAt: Date.now(),
                  timestamp: Date.now(),
                };
              }
            }
          } else if (parsed.type && parsed.orderId) {
            dataObj = parsed;
          }

          if (dataObj && dataObj.orderId === orderId) {
            onMessage(dataObj);
          }
        } catch (err) {
          console.warn('Error parsing relay event:', err);
        }
      };

      eventSource.onerror = () => {
        // SSE auto-reconnects automatically by browser spec
      };
    } catch (e) {
      console.warn('EventSource initialization warning:', e);
    }

    // 3. Fallback High-Frequency Poll (every 1.5s) to guarantee arrival even if SSE is blocked by proxy
    const pollInterval = setInterval(async () => {
      if (!isSubscribed) return;
      const latest = await this.fetchLatestState(orderId);
      if (isSubscribed && latest) {
        onMessage(latest);
      }
    }, 1500);

    return () => {
      isSubscribed = false;
      clearInterval(pollInterval);
      if (eventSource) {
        eventSource.close();
      }
    };
  }

  /**
   * Fetch the most recent message from the relay for this order
   */
  public async fetchLatestState(orderId: string): Promise<RelayMessage | null> {
    if (typeof window === 'undefined') return null;
    const topic = this.getTopic(orderId);
    try {
      const res = await fetch(`https://ntfy.sh/${topic}/json?poll=1&since=30m`, {
        cache: 'no-store',
      });
      if (!res.ok) return null;

      const text = await res.text();
      const lines = text.trim().split('\n').filter(Boolean);
      if (lines.length === 0) return null;

      // Scan from latest line backwards
      for (let i = lines.length - 1; i >= 0; i--) {
        try {
          const item = JSON.parse(lines[i]);
          if (item.message) {
            const dataObj = JSON.parse(item.message) as RelayMessage;
            if (dataObj.orderId === orderId) {
              return dataObj;
            }
          }
        } catch {}
      }
    } catch {}
    return null;
  }
}

export const cloudRelay = new UniversalCloudRelay();
