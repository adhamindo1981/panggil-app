/**
 * Centralized Tri-Lingual Dictionary for "Panggil / نداء"
 * Languages:
 *  - id: Bahasa Indonesia (Primary & Default)
 *  - ar: Arabic (العربية - RTL Direction)
 *  - en: English (Secondary - LTR Direction)
 */

import { AppLanguage } from '@/types/database';

export interface Translations {
  appName: string;
  appTagline: string;
  modes: {
    pagerOnly: string;
    menuPager: string;
    switchMode: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    delete: string;
    edit: string;
    confirm: string;
    close: string;
    search: string;
    status: string;
    total: string;
    price: string;
    quantity: string;
    actions: string;
    print: string;
    downloadPdf: string;
    currency: string;
    switchLang: string;
    online: string;
    offline: string;
    realtimeActive: string;
  };
  statuses: {
    pending: string;
    ready: string;
    completed: string;
    cancelled: string;
  };
  cashier: {
    title: string;
    newOrder: string;
    quickPagerTicket: string;
    orderNumber: string;
    customerName: string;
    customerPhone: string;
    enterOrderNumber: string;
    enterCustomerName: string;
    enterCustomerPhone: string;
    createTicket: string;
    buzzPager: string;
    recallPager: string;
    markCompleted: string;
    activeOrders: string;
    readyOrders: string;
    completedOrders: string;
    totalRevenue: string;
    searchOrders: string;
    filterAll: string;
    filterPending: string;
    filterReady: string;
    filterCompleted: string;
    noOrders: string;
    qrModalTitle: string;
    qrModalSubtitle: string;
    printTicket: string;
    openCustomerView: string;
    copyLink: string;
    linkCopied: string;
    sendWhatsapp: string;
    buzzSuccess: string;
  };
  customer: {
    welcome: string;
    orderTracker: string;
    yourOrderNumber: string;
    forCustomer: string;
    estimatedWait: string;
    minutes: string;
    keepScreenOn: string;
    screenLockActive: string;
    screenLockInactive: string;
    waitingMessage: string;
    readyBanner: string;
    buzzingAlert: string;
    imComing: string;
    muteAlarm: string;
    thankYou: string;
    orderCompletedMessage: string;
    viewReceipt: string;
    needHelp: string;
    vibrateNotice: string;
    speechNotice: string;
    enableSound: string;
    soundEnabled: string;
  };
  menu: {
    title: string;
    allCategories: string;
    addToCart: string;
    cart: string;
    yourCart: string;
    cartEmpty: string;
    notesPlaceholder: string;
    subtotal: string;
    tax: string;
    checkout: string;
    placeOrder: string;
    orderSuccess: string;
    orderSuccessSubtitle: string;
    viewPager: string;
    itemAdded: string;
  };
  invoice: {
    title: string;
    receiptNumber: string;
    date: string;
    cafeName: string;
    cafeAddress: string;
    cafePhone: string;
    customerInfo: string;
    itemDescription: string;
    subtotal: string;
    taxRate: string;
    grandTotal: string;
    paymentMethod: string;
    cash: string;
    thankYouNote: string;
    scanToTrack: string;
  };
  speech: {
    orderReady: (orderNumber: string, customerName?: string) => string;
  };
}

export const translations: Record<AppLanguage, Translations> = {
  id: {
    appName: "Panggil",
    appTagline: "Sistem Pager Digital & Menu Pintar Restoran",
    modes: {
      pagerOnly: "Hanya Panggilan",
      menuPager: "Menu + Panggilan",
      switchMode: "Ubah Mode Sistem",
    },
    common: {
      loading: "Memuat data...",
      save: "Simpan",
      cancel: "Batal",
      delete: "Hapus",
      edit: "Ubah",
      confirm: "Konfirmasi",
      close: "Tutup",
      search: "Cari...",
      status: "Status",
      total: "Total",
      price: "Harga",
      quantity: "Jumlah",
      actions: "Tindakan",
      print: "Cetak",
      downloadPdf: "Unduh PDF",
      currency: "Rp",
      switchLang: "Ganti Bahasa",
      online: "Terhubung Langsung",
      offline: "Mode Offline",
      realtimeActive: "Sinkronisasi Realtime Aktif",
    },
    statuses: {
      pending: "Sedang Disiapkan",
      ready: "Pesanan Siap Diambil!",
      completed: "Selesai",
      cancelled: "Dibatalkan",
    },
    cashier: {
      title: "Dasbor Kasir & Dapur",
      newOrder: "Pesanan Baru",
      quickPagerTicket: "Tiket Pager Cepat",
      orderNumber: "Nomor Pesanan",
      customerName: "Nama Pelanggan",
      customerPhone: "Nomor WhatsApp",
      enterOrderNumber: "Contoh: #A-105",
      enterCustomerName: "Nama pemesan",
      enterCustomerPhone: "Contoh: 08123456789",
      createTicket: "Buat Tiket Pager",
      buzzPager: "PANGGIL SEKARANG (BUZZ)",
      recallPager: "Panggil Ulang (Recall)",
      markCompleted: "Selesai Diambil",
      activeOrders: "Pesanan Aktif",
      readyOrders: "Siap Diambil",
      completedOrders: "Selesai Hari Ini",
      totalRevenue: "Total Pendapatan",
      searchOrders: "Cari nomor atau nama...",
      filterAll: "Semua",
      filterPending: "Menunggu",
      filterReady: "Siap",
      filterCompleted: "Selesai",
      noOrders: "Belum ada pesanan dalam antrean.",
      qrModalTitle: "Pindai Kode QR Pager",
      qrModalSubtitle: "Arahkan kamera smartphone pelanggan untuk membuka pager digital.",
      printTicket: "Cetak Tiket & QR",
      openCustomerView: "Buka Layar Pelanggan",
      copyLink: "Salin Tautan",
      linkCopied: "Tautan berhasil disalin!",
      sendWhatsapp: "Kirim via WhatsApp",
      buzzSuccess: "Sinyal panggilan terkirim ke smartphone pelanggan!",
    },
    customer: {
      welcome: "Selamat Datang di",
      orderTracker: "Pelacak Pesanan Digital",
      yourOrderNumber: "Nomor Pager Anda",
      forCustomer: "Untuk",
      estimatedWait: "Estimasi Waktu Tunggu",
      minutes: "menit",
      keepScreenOn: "Layar Tetap Aktif",
      screenLockActive: "Layar ponsel Anda akan tetap menyala hingga pesanan siap.",
      screenLockInactive: "Ketuk untuk mengaktifkan layar tetap menyala.",
      waitingMessage: "Dapur kami sedang menyiapkan hidangan lezat Anda dengan penuh cinta. Ponsel Anda akan bergetar dan berbunyi saat pesanan siap!",
      readyBanner: "PESANAN ANDA SUDAH SIAP!",
      buzzingAlert: "Silakan menuju kasir untuk mengambil pesanan Anda.",
      imComing: "Saya Sedang Mengambil Pesanan",
      muteAlarm: "Hentikan Suara Alarm",
      thankYou: "Terima Kasih Telah Berkunjung!",
      orderCompletedMessage: "Pesanan Anda telah berhasil diambil. Selamat menikmati!",
      viewReceipt: "Lihat Struk Digital",
      needHelp: "Butuh bantuan? Silakan tanyakan kepada staf kami.",
      vibrateNotice: "Ponsel akan bergetar saat pesanan siap",
      speechNotice: "Pengumuman suara otomatis diaktifkan",
      enableSound: "Aktifkan Suara Pager",
      soundEnabled: "Suara Pager Siap",
    },
    menu: {
      title: "Menu Digital",
      allCategories: "Semua Kategori",
      addToCart: "Tambah",
      cart: "Keranjang",
      yourCart: "Pesanan Anda",
      cartEmpty: "Keranjang masih kosong. Pilih menu lezat favorit Anda!",
      notesPlaceholder: "Catatan khusus (misal: kurangi gula, tanpa es)",
      subtotal: "Subtotal",
      tax: "Pajak (PB1 10%)",
      checkout: "Pesan & Dapatkan Pager",
      placeOrder: "Konfirmasi Pesanan",
      orderSuccess: "Pesanan Berhasil Dibuat!",
      orderSuccessSubtitle: "Tiket pager digital Anda telah siap. Harap tunggu panggilan kami.",
      viewPager: "Buka Pager Digital Saya",
      itemAdded: "Menu ditambahkan ke keranjang",
    },
    invoice: {
      title: "STRUK PEMBELIAN RESMI",
      receiptNumber: "No. Struk",
      date: "Waktu",
      cafeName: "Nama Restoran",
      cafeAddress: "Alamat",
      cafePhone: "Telepon / WA",
      customerInfo: "Informasi Pemesan",
      itemDescription: "Deskripsi Menu",
      subtotal: "Subtotal",
      taxRate: "Pajak Restoran",
      grandTotal: "TOTAL TAGIHAN",
      paymentMethod: "Metode Pembayaran",
      cash: "Tunai / Kasir",
      thankYouNote: "Terima kasih atas kunjungan Anda. Selamat menikmati kembali!",
      scanToTrack: "Pindai untuk lacak status pesanan",
    },
    speech: {
      orderReady: (orderNumber: string, customerName?: string) =>
        `Pesanan nomor ${orderNumber.replace(/[^a-zA-Z0-9]/g, ' ')} ${customerName ? 'atas nama ' + customerName : ''} sudah siap diambil di kasir. Silakan menuju kasir. Terima kasih.`,
    },
  },

  ar: {
    appName: "نداء",
    appTagline: "نظام النداء الإلكتروني الذكي وقائمة الطعام الرقمية للمطاعم والمقاهي",
    modes: {
      pagerOnly: "النداء فقط (Pager Only)",
      menuPager: "القائمة والنداء (Menu + Pager)",
      switchMode: "تغيير نمط التشغيل",
    },
    common: {
      loading: "جاري تحميل البيانات...",
      save: "حفظ",
      cancel: "إلغاء",
      delete: "حذف",
      edit: "تعديل",
      confirm: "تأكيد",
      close: "إغلاق",
      search: "بحث...",
      status: "الحالة",
      total: "المجموع",
      price: "السعر",
      quantity: "الكمية",
      actions: "الإجراءات",
      print: "طباعة",
      downloadPdf: "تحميل PDF",
      currency: "ر.س",
      switchLang: "تغيير اللغة",
      online: "متصل بالشبكة اللحظية",
      offline: "وضع بدون اتصال",
      realtimeActive: "المزامنة اللحظية فائقة السرعة مفعّلة",
    },
    statuses: {
      pending: "قيد التحضير والتجهيز",
      ready: "طلبك جاهز للاستلام الآن!",
      completed: "تم الاستلام بنجاح",
      cancelled: "ملغي",
    },
    cashier: {
      title: "لوحة تحكم الكاشير والمطبخ",
      newOrder: "طلب جديد",
      quickPagerTicket: "تذكرة نداء سريعة",
      orderNumber: "رقم الطلب / التذكرة",
      customerName: "اسم العميل",
      customerPhone: "رقم الواتساب / الهاتف",
      enterOrderNumber: "مثال: #A-105",
      enterCustomerName: "اسم العميل",
      enterCustomerPhone: "مثال: 0501234567",
      createTicket: "إنشاء تذكرة النداء",
      buzzPager: "إطلاق النداء الآن (BUZZ)",
      recallPager: "إعادة النداء (Recall)",
      markCompleted: "تأكيد اكتمال التسليم",
      activeOrders: "طلبات قيد الانتظار",
      readyOrders: "طلبات جاهزة للاستلام",
      completedOrders: "طلبات مكتملة اليوم",
      totalRevenue: "إجمالي المبيعات",
      searchOrders: "ابحث برقم الطلب أو الاسم...",
      filterAll: "الكل",
      filterPending: "قيد التحضير",
      filterReady: "جاهزة",
      filterCompleted: "مكتملة",
      noOrders: "لا توجد طلبات في قائمة الانتظار حالياً.",
      qrModalTitle: "رمز QR الخاص بالبيجر الذكي",
      qrModalSubtitle: "اطلب من العميل مسح الرمز بكاميرا هاتفه لتتبع الطلب واهتزاز البيجر.",
      printTicket: "طباعة تذكرة النداء و QR",
      openCustomerView: "فتح شاشة هاتف العميل",
      copyLink: "نسخ رابط التتبع",
      linkCopied: "تم نسخ الرابط بنجاح!",
      sendWhatsapp: "إرسال عبر الواتساب",
      buzzSuccess: "تم إرسال إشارة النداء والاهتزاز لهاتف العميل بنجاح!",
    },
    customer: {
      welcome: "أهلاً بك في",
      orderTracker: "بيجر النداء الإلكتروني التفاعلي",
      yourOrderNumber: "رقم النداء الخاص بك",
      forCustomer: "باسم",
      estimatedWait: "الوقت المقدر للانتظار",
      minutes: "دقيقة",
      keepScreenOn: "إبقاء الشاشة مضاءة",
      screenLockActive: "شاشة هاتفك ستبقى نشطة ومضاءة تلقائياً حتى استلام طلبك.",
      screenLockInactive: "اضغط لتفعيل بقاء الشاشة نشطة دائماً.",
      waitingMessage: "يقوم طهاتنا بتحضير طلبك بعناية واهتمام. سيهتز هاتفك ويصدر صوتاً تنبيهياً واضحاً فور جهوزية الطلب!",
      readyBanner: "طلبك جاهز للاستلام الآن!",
      buzzingAlert: "يرجى التوجه إلى نقطة الاستلام والكاشير لاستلام طلبك الطازج.",
      imComing: "أنا قادم للاستلام الآن",
      muteAlarm: "إيقاف صوت التنبيه",
      thankYou: "شكراً لزيارتك ونتمنى لك وقتاً ممتعاً!",
      orderCompletedMessage: "تم تسليم طلبك بنجاح. بالهناء والشفاء!",
      viewReceipt: "عرض الفاتورة الرقمية",
      needHelp: "هل تحتاج لمساعدة؟ تفضل بسؤال فريق العمل.",
      vibrateNotice: "سيهتز هاتفك بقوة عند النداء",
      speechNotice: "التنبيه الصوتي الناطق باللغة العربية مفعّل",
      enableSound: "تفعيل صوت البيجر",
      soundEnabled: "صوت البيجر جاهز",
    },
    menu: {
      title: "قائمة الطعام الرقمية",
      allCategories: "كافة الأقسام",
      addToCart: "إضافة للسلة",
      cart: "سلة الطلبات",
      yourCart: "طلباتك المختارة",
      cartEmpty: "سلة الطلبات فارغة، استكشف قائمتنا واختر أصنافك المفضلة!",
      notesPlaceholder: "أي ملاحظات خاصة للتحضير (مثل: بدون سكر، حليب قليل الدسم)",
      subtotal: "المجموع الفرعي",
      tax: "ضريبة القيمة المضافة (15%)",
      checkout: "إرسال الطلب والحصول على البيجر",
      placeOrder: "تأكيد الطلب النهائي",
      orderSuccess: "تم استلام طلبك بنجاح!",
      orderSuccessSubtitle: "تم تعيين بيجر إلكتروني ذكي لك، سيتم تنبيهك عند جاهزية الطلب.",
      viewPager: "فتح شاشة البيجر الإلكتروني",
      itemAdded: "تمت إضافة الصنف للسلة",
    },
    invoice: {
      title: "فاتورة ضريبية مبسطة",
      receiptNumber: "رقم الفاتورة",
      date: "التاريخ والوقت",
      cafeName: "اسم المنشأة",
      cafeAddress: "العنوان",
      cafePhone: "الهاتف / التواصل",
      customerInfo: "بيانات العميل",
      itemDescription: "الصنف والوصف",
      subtotal: "المجموع قبل الضريبة",
      taxRate: "ضريبة القيمة المضافة",
      grandTotal: "الإجمالي النهائي المستحق",
      paymentMethod: "طريقة الدفع",
      cash: "نقداً / عند الكاشير",
      thankYouNote: "شكراً لاختياركم لنا، ونسعد دائماً بخدمتكم!",
      scanToTrack: "امسح الرمز لتتبع حالة الطلب",
    },
    speech: {
      orderReady: (orderNumber: string, customerName?: string) =>
        `الطلب رقم ${orderNumber.replace(/[^a-zA-Z0-9]/g, ' ')} ${customerName ? 'للمستلم ' + customerName : ''} جاهز الآن للاستلام عند الكاشير. شكراً لك.`,
    },
  },

  en: {
    appName: "Panggil",
    appTagline: "Zero-Hardware Digital Pager & Smart Restaurant Menu System",
    modes: {
      pagerOnly: "Pager Only",
      menuPager: "Menu + Pager",
      switchMode: "Switch System Mode",
    },
    common: {
      loading: "Loading data...",
      save: "Save",
      cancel: "Cancel",
      delete: "Delete",
      edit: "Edit",
      confirm: "Confirm",
      close: "Close",
      search: "Search...",
      status: "Status",
      total: "Total",
      price: "Price",
      quantity: "Qty",
      actions: "Actions",
      print: "Print",
      downloadPdf: "Download PDF",
      currency: "Rp",
      switchLang: "Change Language",
      online: "Live Synced",
      offline: "Offline Mode",
      realtimeActive: "Sub-Second Realtime Active",
    },
    statuses: {
      pending: "In Kitchen Preparation",
      ready: "Order Ready for Pickup!",
      completed: "Completed & Picked Up",
      cancelled: "Cancelled",
    },
    cashier: {
      title: "Cashier & Kitchen Dispatch",
      newOrder: "New Order",
      quickPagerTicket: "Quick Pager Ticket",
      orderNumber: "Order / Ticket #",
      customerName: "Customer Name",
      customerPhone: "WhatsApp / Phone",
      enterOrderNumber: "e.g. #A-105",
      enterCustomerName: "Customer name",
      enterCustomerPhone: "e.g. +628123456789",
      createTicket: "Create Pager Ticket",
      buzzPager: "BUZZ PAGER NOW",
      recallPager: "Recall Pager",
      markCompleted: "Complete Pickup",
      activeOrders: "Waiting Queue",
      readyOrders: "Ready for Pickup",
      completedOrders: "Completed Today",
      totalRevenue: "Total Revenue",
      searchOrders: "Search ticket # or name...",
      filterAll: "All",
      filterPending: "Pending",
      filterReady: "Ready",
      filterCompleted: "Completed",
      noOrders: "No active orders in the queue right now.",
      qrModalTitle: "Customer Digital Pager QR",
      qrModalSubtitle: "Customer scans this dynamic QR code with smartphone to track readiness.",
      printTicket: "Print Ticket & QR",
      openCustomerView: "Open Customer View",
      copyLink: "Copy Link",
      linkCopied: "Link copied to clipboard!",
      sendWhatsapp: "Send via WhatsApp",
      buzzSuccess: "Buzz signal & vibration dispatched to customer phone!",
    },
    customer: {
      welcome: "Welcome to",
      orderTracker: "Digital Coaster Pager",
      yourOrderNumber: "Your Pager Number",
      forCustomer: "For",
      estimatedWait: "Estimated Wait Time",
      minutes: "mins",
      keepScreenOn: "Screen Wake Lock Active",
      screenLockActive: "Your smartphone screen will stay awake automatically until order is ready.",
      screenLockInactive: "Tap to keep screen awake while waiting.",
      waitingMessage: "Our baristas and chefs are preparing your order. Your phone will buzz, vibrate, and sound an alert when ready!",
      readyBanner: "YOUR ORDER IS READY!",
      buzzingAlert: "Please proceed to the pickup counter / cashier.",
      imComing: "I'm on My Way to Pickup",
      muteAlarm: "Mute Pager Alarm",
      thankYou: "Thank You for Visiting!",
      orderCompletedMessage: "Your order has been picked up. Enjoy your meal!",
      viewReceipt: "View Digital Receipt",
      needHelp: "Need help? Please ask any staff member.",
      vibrateNotice: "Phone will vibrate when order is called",
      speechNotice: "Automatic voice announcements enabled",
      enableSound: "Enable Pager Sound",
      soundEnabled: "Pager Audio Active",
    },
    menu: {
      title: "Digital Menu",
      allCategories: "All Categories",
      addToCart: "Add to Order",
      cart: "Cart",
      yourCart: "Your Selected Items",
      cartEmpty: "Your cart is empty. Pick your favorite items from our menu!",
      notesPlaceholder: "Special instructions (e.g., less sugar, extra ice)",
      subtotal: "Subtotal",
      tax: "Tax (10%)",
      checkout: "Checkout & Get Pager",
      placeOrder: "Confirm & Submit Order",
      orderSuccess: "Order Successfully Placed!",
      orderSuccessSubtitle: "Your digital pager ticket is ready. Keep this tab open to get notified.",
      viewPager: "Open My Digital Pager",
      itemAdded: "Item added to cart",
    },
    invoice: {
      title: "OFFICIAL DIGITAL RECEIPT",
      receiptNumber: "Receipt #",
      date: "Date & Time",
      cafeName: "Cafe / Restaurant",
      cafeAddress: "Address",
      cafePhone: "Phone / WhatsApp",
      customerInfo: "Customer Details",
      itemDescription: "Item & Description",
      subtotal: "Subtotal",
      taxRate: "Tax",
      grandTotal: "GRAND TOTAL",
      paymentMethod: "Payment Method",
      cash: "Cash / Counter",
      thankYouNote: "Thank you for dining with us. We hope to see you again soon!",
      scanToTrack: "Scan to track order status",
    },
    speech: {
      orderReady: (orderNumber: string, customerName?: string) =>
        `Order number ${orderNumber.replace(/[^a-zA-Z0-9]/g, ' ')} ${customerName ? 'for ' + customerName : ''} is now ready for pickup at the counter. Thank you.`,
    },
  },
};
