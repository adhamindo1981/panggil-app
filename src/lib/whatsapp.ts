/**
 * WhatsApp Fallback Integration for "Panggil / نداء"
 * Generates direct wa.me notification links for cafes and customers.
 */

import { AppLanguage } from '@/types/database';

export function formatPhoneNumber(phone: string): string {
  // Strip non-digits
  let cleaned = phone.replace(/\D/g, '');
  // If starts with 08 (Indonesian local format), convert to 628
  if (cleaned.startsWith('08')) {
    cleaned = '62' + cleaned.substring(1);
  }
  // If starts with 05 (Saudi local format), convert to 9665
  else if (cleaned.startsWith('05')) {
    cleaned = '966' + cleaned.substring(1);
  }
  return cleaned;
}

export function generateWhatsAppReadyUrl(
  phone: string,
  orderNumber: string,
  customerName: string | undefined,
  cafeName: string,
  pagerUrl: string,
  lang: AppLanguage = 'id'
): string {
  const cleanPhone = formatPhoneNumber(phone);
  let message = '';

  if (lang === 'id') {
    message = `Halo ${customerName || 'Pelanggan'}! 🔔\n\nPesanan Anda *${orderNumber}* di *${cafeName}* sudah SIAP untuk diambil di kasir/counter.\n\nLihat status dan struk pesanan Anda di sini:\n${pagerUrl}\n\nTerima kasih!`;
  } else if (lang === 'ar') {
    message = `مرحباً ${customerName || 'عزيزنا العميل'}! 🔔\n\nطلبك رقم *${orderNumber}* لدى *${cafeName}* جاهز للاستلام الآن من نقطة الكاشير.\n\nتفضل بمتابعة التذكرة وتفاصيل الفاتورة من هنا:\n${pagerUrl}\n\nشكراً لزيارتك!`;
  } else {
    message = `Hello ${customerName || 'Customer'}! 🔔\n\nYour order *${orderNumber}* at *${cafeName}* is now READY for pickup at the counter.\n\nView your digital ticket and receipt here:\n${pagerUrl}\n\nThank you!`;
  }

  return `https://wa.me/${cleanPhone}?text=${encodeURIComponent(message)}`;
}
