"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { audioEngine } from '@/lib/audio-engine';
import {
  BellRing,
  Coffee,
  Smartphone,
  Volume2,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Check,
  X,
  Star,
  QrCode,
  Clock,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  Activity,
  Layers,
  Sparkles,
  Zap,
  TrendingDown,
  RotateCcw,
  Sliders,
  Store,
  ExternalLink,
  Flame,
  Radio,
  Share2,
  ThumbsUp,
  Award,
} from 'lucide-react';

type Lang = 'id' | 'ar' | 'en';
type Currency = 'IDR' | 'SAR' | 'USD';

export default function HomePage() {
  const [lang, setLang] = useState<Lang>('id');
  const [currency, setCurrency] = useState<Currency>('IDR');
  const [billingCycle, setBillingCycle] = useState<'annual' | 'monthly'>('annual');

  // Interactive Live Pager Simulator State
  const [simStep, setSimStep] = useState<1 | 2 | 3 | 4>(2);
  const [isSimBuzzing, setIsSimBuzzing] = useState<boolean>(false);
  const [hasTestedAudio, setHasTestedAudio] = useState<boolean>(false);

  // Interactive ROI Calculator State
  const [hardwarePagerCount, setHardwarePagerCount] = useState<number>(20);
  const [dailyOrderCount, setDailyOrderCount] = useState<number>(120);

  // FAQ Accordion State
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const isRtl = lang === 'ar';

  // Currency Exchange Rates (Base: IDR)
  // 1 SAR ≈ 4,200 IDR | 1 USD ≈ 15,800 IDR
  const rates = {
    IDR: 1,
    SAR: 4200,
    USD: 15800,
  };

  const formatPrice = (idrAmount: number, targetCurr: Currency) => {
    if (targetCurr === 'IDR') {
      return `Rp ${idrAmount.toLocaleString('id-ID')}`;
    }
    if (targetCurr === 'SAR') {
      const sar = Math.round(idrAmount / rates.SAR);
      return `${sar.toLocaleString()} ر.س`;
    }
    const usd = Math.round(idrAmount / rates.USD);
    return `$${usd.toLocaleString()}`;
  };

  // Sound triggering for the simulator
  const handleTriggerBuzzer = async () => {
    setIsSimBuzzing(true);
    setSimStep(3);
    setHasTestedAudio(true);
    try {
      await audioEngine.unlockAudioAndKeepAlive();
      audioEngine.startAlarmLoop(750);
      if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
        navigator.vibrate([300, 150, 300, 150, 300]);
      }
    } catch {}

    setTimeout(() => {
      audioEngine.stopAlarmLoop();
      setIsSimBuzzing(false);
    }, 5000);
  };

  const handleStopBuzzer = () => {
    audioEngine.stopAlarmLoop();
    setIsSimBuzzing(false);
  };

  // Calculate annual savings
  // Average physical pager costs Rp 380.000 ($24 / 95 SAR), 25% lost/broken annually
  const hardwareUnitCostIDR = 380000;
  const initialHardwareSavedIDR = hardwarePagerCount * hardwareUnitCostIDR;
  const annualMaintenanceSavedIDR = Math.round(hardwarePagerCount * hardwareUnitCostIDR * 0.25);
  const totalSavingsIDR = initialHardwareSavedIDR + annualMaintenanceSavedIDR;

  // Multilingual Copy Dictionary
  const content = {
    id: {
      badge: "SISTEM PAGER DIGITAL & MENU CERDAS BERBASIS WEB",
      heroTitlePrefix: "Ubah Ponsel Pelanggan Menjadi Pager.",
      heroTitleHighlight: "Tanpa Perangkat Fisik.",
      heroSubtitle:
        "Solusi nirkabel berkinerja tinggi untuk kafe, restoran, food court, dan pusat layanan. Pelanggan cukup scan QR pada struk atau meja, menunggu tanpa cemas, dan ponsel mereka berdering kencang saat pesanan siap. Dilengkapi menu digital interaktif dan pendorong ulasan bintang 5 Google Maps.",
      ctaDemo: "Buka Demo Kasir (POS)",
      ctaCustomer: "Layar Tamu / Pelanggan",
      ctaTestBuzzer: "Uji Suara Pager",
      simTitle: "Simulasi Langsung Layar Pelanggan",
      simDesc: "Interaksi real-time di browser tanpa perlu mengunduh aplikasi apapun:",
      simSwitchLangLabel: "Bahasa Tampilan Layar:",
      step1: "1. Scan QR",
      step2: "2. Menunggu",
      step3: "3. Pager Bunyi",
      step4: "4. Ulasan Google",
      orderLabel: "NOMOR PESANAN",
      orderStatusPreparing: "Sedang Disiapkan",
      orderWaiting: "Santai saja… Pesanan sedang diracik barista",
      orderReady: "Pesanan Anda Siap Diambil!",
      orderPickupAt: "Silakan ambil di Counter Pengambilan",
      orderAction: "Bunyikan Pager (Simulasi)",
      orderStop: "Hentikan Suara Sirene",
      reviewTitle: "Bagikan Pengalaman Anda!",
      reviewDesc: "Kopi nikmat? Bantu kafe kami dengan memberi ulasan bintang 5 di Google Maps.",
      metricsAppFree: "0 Aplikasi Diunduh",
      metricsAppFreeDesc: "100% Web-Native di Safari & Chrome",
      metricsLatency: "< 150ms Latensi",
      metricsLatencyDesc: "Koneksi WebSocket real-time instan",
      metricsSavings: "Hemat s/d 85%",
      metricsSavingsDesc: "Bebas biaya beli & ganti pager fisik",
      bentoTag: "ARSITEKTUR & FITUR UTAMA",
      bentoTitle: "Satu Platform Utuh untuk Menggantikan Seluruh Pager Fisik",
      bentoSubtitle: "Didesain dengan presisi Swiss: cepat, higienis, andal, dan mengeliminasi antrean menumpuk.",
      bento1Tag: "DISPATCHER KASIR REAL-TIME",
      bento1Title: "Manajemen Antrean Pesanan POS Satu-Klik",
      bento1Desc: "Kasir melihat seluruh tiket antrean secara real-time. Cukup klik tombol panggil, sirene di ponsel pelanggan langsung berbunyi dan bergetar tanpa hambatan jarak.",
      bento2Tag: "STAND AKRILIK MEJA ZERO-HARDWARE",
      bento2Title: "Scan QR Langsung Buka Tiket",
      bento2Desc: "Pelanggan menggunakan kamera ponsel bawaan. Tidak ada alat pager yang harus dicuci, dicas, atau takut hilang dibawa pulang.",
      bento3Tag: "PENGUMPUL ULASAN OTOMATIS",
      bento3Title: "Booster Rating 5-Bintang Google Maps",
      bento3Desc: "Begitu pesanan diambil, layar secara otomatis mengajak pelanggan memberikan ulasan bintang 5, mendongkrak peringkat lokal kafe Anda.",
      bento4Tag: "MENU DIGITAL & UPSELLING",
      bento4Title: "Katalog Menu Interaktif Terintegrasi",
      bento4Desc: "Pelanggan dapat menjelajahi foto menu beresolusi tinggi, memilih varian kopi (less sugar, oat milk), dan melakukan pesanan tambahan selagi menunggu.",
      bento5Tag: "AUDIO KEEP-ALIVE SURVIVAL",
      bento5Title: "Tetap Berdering Walau Layar Terkunci",
      bento5Desc: "Teknologi audio background survival menjaga koneksi WebSocket tetap hidup di iOS Safari & Android saat ponsel dimasukkan ke saku.",
      bento6Tag: "GOVERNANCE MULTI-CABANG",
      bento6Title: "Kontrol Terpusat untuk Franchise & Jaringan",
      bento6Desc: "Pantau waktu tunggu rata-rata, volume pesanan, dan hak akses staf kasir di seluruh cabang dalam satu dashboard admin tunggal.",
      calcTag: "KALKULATOR ROI",
      calcTitle: "Hitung Berapa Biaya yang Anda Hemat Setiap Tahun",
      calcSubtitle: "Bandingkan biaya modal membeli perangkat pager fisik plastik vs berlangganan cloud Panggil",
      sliderPagers: "Jumlah Pager Fisik yang Digunakan:",
      sliderOrders: "Rata-rata Pesanan per Hari:",
      calcSavedHeading: "Total Estimasi Penghematan:",
      calcPerYear: "di tahun pertama (bebas pembelian alat, baterai cadangan, dan penggantian pager rusak)",
      cmpTag: "ANALISIS KOMPARASI",
      cmpTitle: "Panggil Digital vs Pager Fisik Plastik Tradisional",
      cmpSubtitle: "Perbandingan objektif parameter biaya, higienitas, jangkauan sinyal, dan fungsionalitas",
      pricingTag: "TRANSPARAN & TANPA BIAYA TERSEMBUNYI",
      pricingTitle: "Pilihan Paket Langganan Sesuai Skala Bisnis",
      pricingSubtitle: "Mulai dari kedai kopi independen hingga jaringan franchise puluhan cabang",
      pricingAnnualNote: "Hemat 20% dengan paket tahunan",
      btnChoosePlan: "Pilih Paket Ini",
      faqTag: "TANYA JAWAB",
      faqTitle: "Pertanyaan yang Sering Diajukan (FAQ)",
      ctaBottomTitle: "Siap Menghapus Biaya Pager Plastik dari Pengeluaran Anda?",
      ctaBottomSubtitle: "Bergabunglah dengan ratusan pengusaha kafe dan restoran modern di Jakarta, Bali, dan Riyadh.",
      whatsappBtn: "Konsultasi Cepat via WhatsApp",
    },
    ar: {
      badge: "المنظومة السحابية الأذكى للبيجر الرقمي والمنيو التفاعلي",
      heroTitlePrefix: "حوّل هاتف عميلك إلى جهاز نداء.",
      heroTitleHighlight: "بدون أي أجهزة إضافية.",
      heroSubtitle:
        "منظومة لاسلكية عالية الكفاءة للمطاعم، المقاهي، مجمعات الطعام، ومراكز الخدمة. يمسح العميل رمز QR على الفاتورة أو الطاولة، ويستريح في سيارته أو مقعده، ليرن جواله ويهتز فور جهوزية طلبه. مدعومة بمنيو رقمي تفاعلي ومحرك تقييمات Google Maps التلقائي.",
      ctaDemo: "تجربة لوحة الكاشير (POS)",
      ctaCustomer: "شاشة استدعاء الزبون",
      ctaTestBuzzer: "اختبر صوت الرنين",
      simTitle: "محاكاة حية وتفاعلية لشاشة العميل",
      simDesc: "تجربة واقعية تعمل مباشرة في المتصفح دون تنزيل أي برنامج:",
      simSwitchLangLabel: "لغة شاشة البيجر المحاكية:",
      step1: "1. مسح QR",
      step2: "2. في الانتظار",
      step3: "3. رنين البيجر",
      step4: "4. تقييم Google",
      orderLabel: "رقم الطلب",
      orderStatusPreparing: "جاري التحضير",
      orderWaiting: "خذ راحتك… طلبك يتم تحضيره بعناية من قِبل الباريستا",
      orderReady: "طلبك جاهز للاستلام الآن!",
      orderPickupAt: "تفضل بالاستلام من نافذة التسليم الرئيسية",
      orderAction: "إطلاق رنين التنبيه (تجربة)",
      orderStop: "إيقاف صوت الرنين",
      reviewTitle: "رأيك يصنع الفرق الكبير!",
      reviewDesc: "استمتعت بقهوتك؟ ادعمنا بدقيقة واحدة عبر تقييم منشأتنا على خرائط Google.",
      metricsAppFree: "0 تطبيق يتم تنزيله",
      metricsAppFreeDesc: "يعمل 100% داخل Safari و Chrome فوراً",
      metricsLatency: "استجابة < 150ms",
      metricsLatencyDesc: "اتصال WebSocket لحظي سحابي",
      metricsSavings: "توفير حتى 85%",
      metricsSavingsDesc: "وداعاً لشراء وصيانة أجهزة البيجر البلاستيكية",
      bentoTag: "البنية البرمجية والمزايا الأساسية",
      bentoTitle: "منظومة متكاملة تُغنيك عن أجهزة البيجر البلاستيكية للأبد",
      bentoSubtitle: "صُممت بمعايير السلاسة السويسرية: دقيقة، صحية، فائقة السرعة، وتقضي على التزاحم.",
      bento1Tag: "لوحة توزيع الكاشير اللحظية",
      bento1Title: "إدارة طابور الطلبات بنقرة زر واحدة",
      bento1Desc: "يشاهد الكاشير جميع التذاكر النشطة في شاشة واحدة. بلمسة واحدة ينطلق الرنين والاهتزاز في جوال العميل دون قيود المسافة أو الجدران العازلة.",
      bento2Tag: "ستاند الطاولة الأكريليك الذكي",
      bento2Title: "مسح QR يفتح شاشة الطلب في 0.4 ثانية",
      bento2Desc: "يعتمد العميل كاميرا جواله الأصلية. لا أجهزة تتطلب شحناً كهربائياً مستمراً أو تتعرض للكسر أو الضياع.",
      bento3Tag: "محرك التقييم التلقائي",
      bento3Title: "مضاعفة تقييمات خرائط Google بخمس نجوم",
      bento3Desc: "فور تأكيد استلام الطلب، تظهر نافذة ذكية تدعو العميل لتقييم المنشأة بـ 5 نجوم لرفع ترتيب مقهاك في محركات البحث المحلية.",
      bento4Tag: "منيو رقمي ومبيعات إضافية",
      bento4Title: "قائمة طعام تفاعلية متزامنة بالكامل",
      bento4Desc: "يتصفح العميل صور الأطباق العالية الدقة، ويختار التعديلات (حليب شوفان، سكر قليل)، مما يرفع متوسط قيمة الفاتورة بنسبة 28%.",
      bento5Tag: "استقرار الصوت في الخلفية",
      bento5Title: "يرن ويهتز حتى لو كان الهاتف في الجيب أو مقفلاً",
      bento5Desc: "بروتوكول Audio Keep-Alive المتطور يحافظ على استمرار نفق WebSocket نشطاً في خلفية المتصفح على iOS و Android.",
      bento6Tag: "إدارة الفروع المركزية",
      bento6Title: "تحكم شامل لسلاسل الفروع والمطابخ السحابية",
      bento6Desc: "مراقبة متوسط فترات الانتظار، أحجام المبيعات، وصلاحيات طاقم الكاشير برمز PIN لجميع الفروع في لوحة إدارة مركزية موحدة.",
      calcTag: "حاسبة العائد المالي",
      calcTitle: "احسب كم ستوفّر منشأتك سنوياً عند الاستغناء عن البيجر",
      calcSubtitle: "مقارنة تكلفة شراء وصيانة أجهزة النداء البلاستيكية باشتراك سحابي ذكي",
      sliderPagers: "عدد أجهزة البيجر البلاستيكية الحالية:",
      sliderOrders: "متوسط عدد الطلبات اليومية:",
      calcSavedHeading: "إجمالي الوفورات السنوية التقديرية:",
      calcPerYear: "في السنة الأولى (توفير شراء أجهزة جديدة، واستبدال البطاريات، وتكاليف الفقدان والتلف)",
      cmpTag: "جدول المقارنة الموضوعية",
      cmpTitle: "نظام نداء الرقمي مقابل أجهزة البيجر التقليدية",
      cmpSubtitle: "مقارنة تحليلية دقيقة توضح الفوارق الجوهرية في التكلفة، الصحة، المدى، وهوية العلامة",
      pricingTag: "شفافية مطلقة بدون رسوم خفية",
      pricingTitle: "باقات اشتراك مصممة لمختلف أحجام الأعمال",
      pricingSubtitle: "من المقاهي الفردية الناشئة وحتى سلاسل الامتياز التجاري المتعددة",
      pricingAnnualNote: "وفّر 20% عند اختيار الاشتراك السنوي",
      btnChoosePlan: "اختر هذه الباقة",
      faqTag: "الأسئلة الأكثر شيوعاً",
      faqTitle: "الأسئلة الشائعة حول المنظومة (FAQ)",
      ctaBottomTitle: "هل أنت مستعد للتخلص من تكاليف البيجر البلاستيكي؟",
      ctaBottomSubtitle: "انضم إلى نخبة المقاهي والمطاعم الرائدة في إندونيسيا والخليج اليوم.",
      whatsappBtn: "تحدث مع فريق المبيعات عبر واتساب",
    },
    en: {
      badge: "WEB-NATIVE DIGITAL COASTER PAGER & SMART MENU",
      heroTitlePrefix: "Turn Customer Phones into Pagers.",
      heroTitleHighlight: "Zero Hardware Required.",
      heroSubtitle:
        "High-performance cloud paging system for cafes, restaurants, food courts, and service centers. Guests scan a QR code on receipt or table, wait comfortably anywhere, and their phone rings & vibrates when orders are ready. Built-in digital menu & automated 5-star Google review booster.",
      ctaDemo: "Open POS Cashier Demo",
      ctaCustomer: "Guest Screen Demo",
      ctaTestBuzzer: "Test Pager Chime",
      simTitle: "Live Interactive Guest Screen Simulator",
      simDesc: "Test the exact mobile web experience with real audio buzzer & haptics:",
      simSwitchLangLabel: "Simulator Language:",
      step1: "1. Scan QR",
      step2: "2. Waiting",
      step3: "3. Pager Chime",
      step4: "4. Google Review",
      orderLabel: "ORDER NUMBER",
      orderStatusPreparing: "In Preparation",
      orderWaiting: "Sit back and relax… Baristas are crafting your order",
      orderReady: "Your Order is Ready for Pickup!",
      orderPickupAt: "Please proceed to Counter 01",
      orderAction: "Trigger Buzzer (Simulation)",
      orderStop: "Stop Siren Sound",
      reviewTitle: "Share Your Experience!",
      reviewDesc: "Loved your coffee? Help us shine by leaving a 5-star review on Google Maps.",
      metricsAppFree: "0 App Downloads",
      metricsAppFreeDesc: "100% Web-Native in Safari & Chrome",
      metricsLatency: "< 150ms Latency",
      metricsLatencyDesc: "Instant cloud WebSocket connection",
      metricsSavings: "Save up to 85%",
      metricsSavingsDesc: "Zero hardware purchase & battery fees",
      bentoTag: "CORE ARCHITECTURE & CAPABILITIES",
      bentoTitle: "An All-in-One Cloud Engine to Retire Hardware Pagers",
      bentoSubtitle: "Engineered with Swiss precision: clean, hygienic, resilient, and eliminates service counter congestion.",
      bento1Tag: "REAL-TIME CASHIER DISPATCHER",
      bento1Title: "One-Click POS Order Queue Governance",
      bento1Desc: "Cashiers manage all active tickets in a unified live queue. A single tap triggers an audible buzzer and vibration directly on the customer's phone.",
      bento2Tag: "ZERO-HARDWARE ACRYLIC STAND",
      bento2Title: "Native Camera Scan Opens Ticket in 0.4s",
      bento2Desc: "Customers use their native camera. No plastic discs to sanitize, charge on bulky charging racks, or lose to accidental takeaway.",
      bento3Tag: "AUTOMATED FEEDBACK LOOP",
      bento3Title: "5-Star Google Maps Review Multiplier",
      bento3Desc: "As soon as the customer confirms pickup, an elegant prompt routes satisfied guests directly to your Google Maps listing.",
      bento4Tag: "INTEGRATED DIGITAL MENU",
      bento4Title: "Visual Upselling & High-Res Catalog",
      bento4Desc: "Guests browse signature drinks, select modifiers (oat milk, less sugar), and place repeat orders while waiting, lifting ticket sizes by 28%.",
      bento5Tag: "BACKGROUND AUDIO KEEP-ALIVE",
      bento5Title: "Alerts Sound Even With Pocketed & Locked Screens",
      bento5Desc: "Our proprietary audio keep-alive protocol keeps the WebSocket stream alive in iOS Safari and Android Chrome when the screen sleeps.",
      bento6Tag: "MULTI-OUTLET GOVERNANCE",
      bento6Title: "Centralized Multi-Branch Enterprise Console",
      bento6Desc: "Track average wait times, ticket volumes, and staff security PIN permissions across every franchise location from one central cockpit.",
      calcTag: "ROI CALCULATOR",
      calcTitle: "Calculate Your Venue’s Exact Annual Cost Savings",
      calcSubtitle: "Compare the capital expense of buying plastic hardware pagers against Panggil SaaS",
      sliderPagers: "Physical Pagers Currently in Use:",
      sliderOrders: "Average Daily Orders:",
      calcSavedHeading: "Total Estimated Annual Savings:",
      calcPerYear: "in year one (zero equipment replacement, charging stations, or lost disc fees)",
      cmpTag: "OBJECTIVE COMPARISON",
      cmpTitle: "Panggil Digital vs Traditional Plastic Hardware Pagers",
      cmpSubtitle: "A side-by-side breakdown of operational cost, hygiene, signal radius, and brand ownership",
      pricingTag: "TRANSPARENT & PREDICTABLE",
      pricingTitle: "Simple Plans Built for Hospitality Scale",
      pricingSubtitle: "From single-counter specialty coffee shops to multi-branch franchise operations",
      pricingAnnualNote: "Save 20% with annual billing",
      btnChoosePlan: "Select This Plan",
      faqTag: "FAQ",
      faqTitle: "Frequently Asked Questions",
      ctaBottomTitle: "Ready to Eliminate Plastic Pagers from Your Balance Sheet?",
      ctaBottomSubtitle: "Join modern cafes and cloud kitchens in Jakarta, Bali, and Riyadh today.",
      whatsappBtn: "Chat with Sales on WhatsApp",
    },
  };

  const t = content[lang];

  // Pricing Plans Definition
  const plans = [
    {
      id: 'bronze',
      tier: 'Bronze',
      name: { id: 'Dasar (Basic)', ar: 'الأساسية (Basic)', en: 'Basic Essential' },
      priceAnnualIDR: 1990000,
      priceMonthlyIDR: 210000,
      desc: {
        id: 'Cocok untuk kedai kopi permulaan yang ingin sistem panggil tanpa ribet.',
        ar: 'مثالية للمقاهي الناشئة التي تبحث عن نظام نداء فوري بأقل تكلفة.',
        en: 'Perfect for single-counter cafes seeking instant zero-hardware paging.',
      },
      features: {
        id: [
          'Pager digital tanpa batas pemanggilan',
          'Dashboard kasir berbasis web cepat',
          'Notifikasi suara, getar, & visual',
          'Cetak QR order otomatis',
          'Analitik waktu tunggu dasar',
          'Dukungan standar via chat',
        ],
        ar: [
          'نداء بيجر رقمي غير محدود للعملاء',
          'لوحة تحكم كاشير ويب فائقة السرعة',
          'تنبيهات صوتية واهتزاز وشاشة بصرية',
          'توليد وطباعة أكواد QR للطلبات',
          'تقارير أساسية لمعدل فترات الانتظار',
          'دعم فني قياسي عبر المحادثة',
        ],
        en: [
          'Unlimited digital coaster pager calls',
          'Lightning-fast web cashier dashboard',
          'Audio siren, vibration, & visual flashes',
          'Automated QR code order generation',
          'Basic wait-time analytics',
          'Standard chat support',
        ],
      },
      highlight: false,
    },
    {
      id: 'silver',
      tier: 'Silver',
      name: { id: 'Beridentitas (Branded)', ar: 'المصممة بهويتك (Branded)', en: 'Branded Identity' },
      priceAnnualIDR: 2890000,
      priceMonthlyIDR: 290000,
      desc: {
        id: 'Pilihan paling populer. Tampilkan logo kafe dan integrasikan ulasan Google.',
        ar: 'الباقة الأكثر طلباً ورواجاً. تبرز شعار وهوية مقهاك مع جمع تقييمات Google.',
        en: 'Our most popular plan. Showcase your brand identity & gather Google Reviews.',
      },
      features: {
        id: [
          'Semua fitur paket Dasar',
          'Kustomisasi Logo & Warna Kafe (Branded)',
          'Integrasi Ulasan Bintang 5 Google Maps',
          'Menu Digital Interaktif (Katalog produk & foto)',
          'Tampilan tanpa watermark / White-label',
          'Prioritas antrian server 99.9% uptime',
        ],
        ar: [
          'جميع ميزات الباقة الأساسية',
          'تخصيص كامل بشعار وألوان مقهاك (White-Label)',
          'دعوة تلقائية لتقييم المنشأة على خرائط Google',
          'منيو إلكتروني تفاعلي لعرض الأطباق والأسعار',
          'واجهة خالية تماماً من العلامات الخارجية',
          'أولوية معالجة في السيرفر بنسبة تواجد 99.9%',
        ],
        en: [
          'Everything in Basic Plan',
          'Full Cafe Logo & Color Customization (Branded)',
          'Automated 5-Star Google Maps Review Prompts',
          'Interactive Digital Menu (Photos & Descriptions)',
          'White-label customer screens (No Panggil badge)',
          'High-priority server uptime guarantee (99.9%)',
        ],
      },
      highlight: true,
      badge: { id: 'Paling Populer', ar: 'الأكثر طلباً', en: 'Most Popular' },
    },
    {
      id: 'gold',
      tier: 'Gold',
      name: { id: 'Bisnis Pro (Full Suite)', ar: 'الذهبية المتكاملة (Pro)', en: 'Business Pro' },
      priceAnnualIDR: 3990000,
      priceMonthlyIDR: 390000,
      desc: {
        id: 'Solusi lengkap dengan Dual-Mode POS, multi-kasir, dan kit akrilik meja.',
        ar: 'المنظومة الشاملة مع كاشير POS الداخلي، وتعدد الصلاحيات، وحاملات الأكريليك.',
        en: 'The complete hospitality suite with built-in POS, staff roles, and table kits.',
      },
      features: {
        id: [
          'Semua fitur paket Beridentitas',
          'Dual-Mode POS Kasir (Tiket cepat + Pilih menu)',
          'Multi-Kasir & Multi-Staf dengan PIN akses',
          'Kit Desain Stand Meja Akrilik siap cetak',
          'Kustomisasi audio suara panggil & jingle kafe',
          'Dukungan VIP 24/7 & Dedicated onboarding',
        ],
        ar: [
          'جميع ميزات باقة الهوية المخصصة',
          'نظام كاشير متكامل (Dual-Mode POS) لاختيار الوجبات',
          'تعدد أجهزة الكاشير والموظفين برمز PIN أمان',
          'حزمة تصاميم ستاندات الطاولات الأكريليك الجاهزة للطباعة',
          'تخصيص نغمات الرنين وصوت المناداة الخاص بالمتجر',
          'دعم فني VIP فوري على مدار الساعة',
        ],
        en: [
          'Everything in Branded Plan',
          'Dual-Mode Cashier POS (Quick ticket + Menu selection)',
          'Multi-staff accounts with secure Cashier PIN',
          'Printable Acrylic Table Stand Design Kit',
          'Custom brand chime audio & custom call sound',
          '24/7 VIP Priority support & dedicated onboarding',
        ],
      },
      highlight: false,
    },
    {
      id: 'enterprise',
      tier: 'Enterprise',
      name: { id: 'Jaringan Multi-Cabang', ar: 'الشركات وسلاسل الفروع', en: 'Multi-Outlet Chain' },
      priceAnnualIDR: 0,
      priceMonthlyIDR: 0,
      desc: {
        id: 'Untuk jaringan kafe, franchise, dan food court dengan puluhan cabang.',
        ar: 'مخصصة للعلامات التجارية وسلاسل الفروع الكبرى ومجمعات المطاعم.',
        en: 'For franchise cafe networks, cloud kitchens, and multi-branch food courts.',
      },
      features: {
        id: [
          'Lisensi multi-cabang terpusat (Centralized Dashboard)',
          'Integrasi API langsung ke POS (Moka, Pawoon, Odoo, Foodics)',
          'Server khusus & SLA 99.99% ketersediaan',
          'Manajer Akun Khusus (Dedicated Account Manager)',
          'Pelatihan staf langsung & setup onsite',
        ],
        ar: [
          'لوحة تحكم مركزية موحدة لجميع الفروع',
          'تكامل API مباشر مع برامج الكاشير (Foodics, Odoo, Moka)',
          'سيرفرات سحابية مخصصة وضمان تشغيل 99.99%',
          'مدير حساب تنفيذي مخصص لمنشأتك',
          'تدريب طاقم العمل وتجهيز الفروع',
        ],
        en: [
          'Centralized multi-outlet management dashboard',
          'Direct REST API integrations with POS (Odoo, Foodics, Moka)',
          'Dedicated server cluster & 99.99% SLA guarantee',
          'Dedicated Enterprise Account Executive',
          'Comprehensive staff onboarding & rollout',
        ],
      },
      highlight: false,
      isCustom: true,
    },
  ];

  // Comparison Matrix Data
  const comparisonData = [
    {
      label: { id: 'Biaya Investasi Awal', ar: 'تكلفة الاستثمار والتأسيس', en: 'Initial Setup Investment' },
      panggil: { id: 'Rp 0 (Gunakan perangkat yang ada)', ar: '0 ر.س (بدون شراء أي أجهزة)', en: '$0 (Use existing mobile devices)' },
      hardware: { id: 'Rp 5.000.000 - Rp 15.000.000+ untuk beli pager', ar: 'تكلفة باهظة (3,000 - 8,000 ر.س للبيجر)', en: '$400 - $1,200+ for hardware set' },
    },
    {
      label: { id: 'Jangkauan Pemanggilan (Range)', ar: 'مدى ونطاق التغطية', en: 'Signal Range' },
      panggil: { id: 'Tanpa batas (Bisa tunggu di mobil / ruko sebelah)', ar: 'غير محدود إطلاقاً (يعمل بالإنترنت والجوال)', en: 'Unlimited (Customer can wait in car or nearby shops)' },
      hardware: { id: 'Terbatas 50 - 100m sinyal radio terputus', ar: 'محدود جداً (50-100 متر وتفقد الإشارة)', en: 'Limited to 50-100 meters, walls block signal' },
    },
    {
      label: { id: 'Kebersihan & Higienitas', ar: 'النظافة والتعقيم والصحة', en: 'Hygiene & Cleanliness' },
      panggil: { id: '100% Higienis (Pelanggan pegang HP sendiri)', ar: '100% صحي (كل عميل يمسك هاتفه الخاص)', en: '100% Hygienic (Customers hold their own phones)' },
      hardware: { id: 'Dipegang bergantian ratusan orang, butuh disinfeksi', ar: 'يتناقله مئات الأشخاص يومياً ويحتاج تعقيم دائم', en: 'Passed through hundreds of hands, requires constant sanitizing' },
    },
    {
      label: { id: 'Kehilangan & Kerusakan Alat', ar: 'تلف وفقدان الأجهزة', en: 'Loss & Breakage Costs' },
      panggil: { id: '0% risiko hilang (Pelanggan bawa HP sendiri)', ar: 'صفر مخاطر فقدان أو تلف', en: 'Zero risk of loss or broken discs' },
      hardware: { id: 'Sering terjatuh pecah, hilang dibawa pulang', ar: 'سقوط متكرر، بطاريات تالفة، وفقدان مستمر', en: 'High attrition: dropped, cracked, stolen accidentally' },
    },
    {
      label: { id: 'Branding & Identitas Merek', ar: 'الهوية البصرية للمنشأة', en: 'Branding & Identity' },
      panggil: { id: 'Layar elegan penuh warna, logo kafe, & foto menu', ar: 'صفحة أنيقة متكاملة بشعارك وألوان مقهاك وقائمتك', en: 'Stunning full-screen interface with your logo and menu' },
      hardware: { id: 'Kotak plastik hitam kusam tanpa identitas', ar: 'جهاز بلاستيكي عام خالي من أي طابع جمالي', en: 'Generic black plastic coaster with sticky sticker' },
    },
    {
      label: { id: 'Pengumpulan Ulasan Google Maps', ar: 'تقييمات خرائط Google', en: 'Google Maps Reviews' },
      panggil: { id: 'Otomatis minta rating bintang 5 setelah ambil pesanan', ar: 'دعوة مباشرة وفورية للتقييم بعد استلام الطلب', en: 'Automated 5-star review collection upon pickup' },
      hardware: { id: 'Tidak ada cara untuk meminta ulasan', ar: 'لا يتيح أي إمكانية لجمع التقييمات', en: 'Impossible to gather customer feedback' },
    },
    {
      label: { id: 'Katalog Menu Digital Terpadu', ar: 'منيو إلكتروني وقائمة طعام', en: 'Integrated Digital Menu' },
      panggil: { id: 'Tersedia! Pelanggan bisa jelajah menu & pesan lagi', ar: 'متوفر ومدمج بالكامل مع الصور والأسعار والأقسام', en: 'Included! Customers can browse rich photos & re-order' },
      hardware: { id: 'Tidak ada (Hanya pager nomor)', ar: 'غير موجود (مجرد لمبة ورقم)', en: 'None (Plain number buzzer)' },
    },
  ];

  // FAQs
  const faqs = [
    {
      q: {
        id: 'Apakah pelanggan perlu mengunduh aplikasi untuk menerima panggilan?',
        ar: 'هل يحتاج العميل لتحميل أي تطبيق على هاتفه لاستقبال النداء؟',
        en: 'Does the customer need to install an app to receive alerts?',
      },
      a: {
        id: 'Sama sekali tidak! Pelanggan cukup mengarahkan kamera ponsel ke kode QR pada struk atau meja. Halaman tiket pager akan langsung terbuka di browser mereka dalam 0,4 detik.',
        ar: 'إطلاقاً! يمسح العميل رمز الـ QR بكاميرا هاتفه الذكي فقط، فتفتح صفحة تتبع الطلب في المتصفح فوراً خلال 0.4 ثانية دون تحميل تطبيق أو إنشاء حساب.',
        en: 'Not at all! The customer simply points their mobile camera at the QR code. The live pager page opens instantly in their browser in under 0.4 seconds.',
      },
    },
    {
      q: {
        id: 'Bagaimana jika ponsel pelanggan dalam mode saku atau layar terkunci?',
        ar: 'ماذا لو كان جوال العميل في جيبه أو كانت الشاشة مقفلة؟',
        en: 'What if the customer locks their screen or puts their phone in their pocket?',
      },
      a: {
        id: 'Panggil dilengkapi teknologi Audio Keep-Alive canggih yang mempertahankan koneksi WebSocket tetap hidup di Safari iOS dan Chrome Android, sehingga bunyi sirene dan getaran tetap berbunyi saat pesanan siap.',
        ar: 'تم تزويد نظام نداء بتقنية صوتية مبتكرة (Audio Keep-Alive) تحافظ على اتصال WebSocket نشطاً في خلفية المتصفح على أجهزة iPhone و Android، فيرن التنبيه ويهتز الهاتف حتى والشاشة مقفلة.',
        en: 'Panggil is engineered with background audio survival protocols that keep the WebSocket connection alive on iOS Safari and Android Chrome, ensuring the siren sounds even when screen is pocketed.',
      },
    },
    {
      q: {
        id: 'Bagaimana cara kasir membuat tiket panggilan?',
        ar: 'كيف يقوم موظف الكاشير بإنشاء تذكرة استدعاء جديدة؟',
        en: 'How does the cashier generate a pager ticket?',
      },
      a: {
        id: 'Kasir cukup membuka Dashboard Kasir di browser (bisa lewat tablet, laptop, atau ponsel POS). Tersedia tombol "Auto #" untuk pembuatan nomor sekejap atau memasukkan nomor struk dari kasir Anda.',
        ar: 'يفتح الكاشير لوحة التحكم من أي جهاز (تابلت، لابتوب، أو جوال). يمكنه إدخال رقم الفاتورة أو الضغط على زر "Auto #" لتوليد تذكرة فورية وطباعة أو عرض الباركود للزبون.',
        en: 'The cashier simply opens the web dashboard on any tablet, PC, or POS phone. They can type the receipt number or tap "Auto #" for instant sequential ticket generation.',
      },
    },
    {
      q: {
        id: 'Apakah bisa digunakan untuk banyak cabang sekaligus?',
        ar: 'هل يمكن تشغيل النظام في سلاسل الفروع المتعددة والمطابخ السحابية؟',
        en: 'Can Panggil support multiple branches and franchises?',
      },
      a: {
        id: 'Ya, paket Enterprise kami mendukung manajemen multi-outlet terpusat dengan analitik waktu tunggu per cabang, pembatasan staf via PIN kasir, dan integrasi POS.',
        ar: 'نعم بالتأكيد! تدعم المنظومة إدارة فروع متعددة مركزياً مع تقارير أداء لكل فرع، وحماية شاشات الكاشير برمز PIN، والربط مع أنظمة نقاط البيع المختلفة.',
        en: 'Yes! Our Enterprise tier supports centralized multi-outlet governance, per-branch wait metrics, cashier PIN isolation, and custom POS integration.',
      },
    },
  ];

  return (
    <div
      dir={isRtl ? 'rtl' : 'ltr'}
      className="min-h-screen bg-[#FAFAFA] text-[#09090B] flex flex-col justify-between selection:bg-orange-600 selection:text-white font-sans antialiased overflow-x-hidden"
    >
      {/* ======================================================== */}
      {/* 1. TOP NAVIGATION BAR (SWISS MINIMALIST) */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#FAFAFA]/90 border-b border-zinc-200 backdrop-blur-md px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl border border-zinc-300 overflow-hidden bg-white shadow-xs group-hover:border-zinc-500 transition-colors flex items-center justify-center p-0.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/panggil-logo.jpg"
                alt="Panggil Official Logo"
                className="w-full h-full object-cover rounded-lg"
              />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-lg font-bold tracking-tight text-[#09090B] font-mono">
                  PANGGIL
                </span>
                <span className="text-xs font-medium text-zinc-500 font-arabic">/ نداء</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-md text-[10px] font-mono font-medium bg-zinc-100 text-zinc-700 border border-zinc-200 uppercase">
                  v2.4
                </span>
              </div>
              <p className="text-[11px] text-zinc-500 font-medium">Digital Coaster & Smart Menu</p>
            </div>
          </Link>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden lg:flex items-center gap-7 text-xs font-semibold text-zinc-600 font-mono">
            <a href="#simulator" className="hover:text-[#09090B] transition-colors">
              {lang === 'id' ? 'SIMULATOR' : lang === 'ar' ? 'المحاكي' : 'SIMULATOR'}
            </a>
            <a href="#bento" className="hover:text-[#09090B] transition-colors">
              {lang === 'id' ? 'FITUR' : lang === 'ar' ? 'المزايا' : 'FEATURES'}
            </a>
            <a href="#calculator" className="hover:text-[#09090B] transition-colors">
              {lang === 'id' ? 'KALKULATOR ROI' : lang === 'ar' ? 'حاسبة التوفير' : 'ROI CALCULATOR'}
            </a>
            <a href="#comparison" className="hover:text-[#09090B] transition-colors">
              {lang === 'id' ? 'KOMPARASI' : lang === 'ar' ? 'المقارنة' : 'COMPARISON'}
            </a>
            <a href="#pricing" className="hover:text-[#09090B] transition-colors">
              {lang === 'id' ? 'HARGA' : lang === 'ar' ? 'الباقات' : 'PRICING'}
            </a>
          </nav>

          {/* Controls: Currency, Language & Admin Portal */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-[11px] font-mono font-semibold">
              {(['IDR', 'SAR', 'USD'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer ${
                    currency === curr
                      ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {curr === 'IDR' ? 'Rp' : curr === 'SAR' ? 'SAR' : '$'}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex bg-zinc-100 p-0.5 rounded-lg border border-zinc-200 text-[11px] font-mono font-semibold">
              {(['id', 'ar', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-md transition-colors cursor-pointer uppercase ${
                    lang === l
                      ? 'bg-zinc-950 text-white shadow-xs'
                      : 'text-zinc-500 hover:text-zinc-950'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Admin Login Button */}
            <Link
              href="/admin/login"
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-white hover:bg-zinc-100 border border-zinc-200 text-zinc-900 font-mono font-medium text-xs transition-colors"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-zinc-700" />
              <span>{lang === 'ar' ? 'الإدارة' : lang === 'id' ? 'Admin' : 'Admin'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* 2. HERO SECTION (2-COLUMN SWISS EDITORIAL LAYOUT) */}
      {/* ======================================================== */}
      <section className="relative pt-10 pb-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-12 items-center">
          {/* COLUMN 1: DIRECT VALUE HEADLINE & CTAS (7 COLS) */}
          <div className="lg:col-span-7 space-y-6">
            {/* System Status Tag */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-zinc-100 border border-zinc-200 text-xs font-mono font-medium text-zinc-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse" />
              <span>{t.badge}</span>
            </div>

            {/* Swiss High-Contrast Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-[#09090B] leading-[1.12]">
              {t.heroTitlePrefix}{' '}
              <span className="text-orange-600 underline decoration-orange-600/30 underline-offset-8">
                {t.heroTitleHighlight}
              </span>
            </h1>

            {/* Authoritative Subheading */}
            <p className="text-base sm:text-lg text-zinc-600 font-normal leading-relaxed max-w-2xl">
              {t.heroSubtitle}
            </p>

            {/* CTA Group */}
            <div className="pt-2 flex flex-wrap items-center gap-3">
              <Link
                href="/c/ubk/cashier"
                target="_blank"
                className="py-3.5 px-6 bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Zap className="w-4 h-4 fill-white" />
                <span>{t.ctaDemo}</span>
                <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
              </Link>

              <Link
                href="/c/ubk/menu"
                target="_blank"
                className="py-3.5 px-5 bg-white hover:bg-zinc-50 text-zinc-900 border border-zinc-300 font-mono font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Smartphone className="w-4 h-4 text-zinc-700" />
                <span>{t.ctaCustomer}</span>
              </Link>

              <button
                onClick={handleTriggerBuzzer}
                className="py-3.5 px-4 bg-zinc-100 hover:bg-zinc-200 text-zinc-900 border border-zinc-200 font-mono font-semibold text-sm rounded-xl transition-colors flex items-center gap-2 cursor-pointer"
              >
                <Volume2 className="w-4 h-4 text-orange-600" />
                <span>{t.ctaTestBuzzer}</span>
              </button>
            </div>

            {/* Micro Metrics Line */}
            <div className="pt-4 grid grid-cols-3 gap-4 border-t border-zinc-200 text-zinc-600">
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#09090B]">0</p>
                <p className="text-xs text-zinc-500 font-medium">{t.metricsAppFreeDesc}</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-emerald-600">&lt; 150ms</p>
                <p className="text-xs text-zinc-500 font-medium">{t.metricsLatencyDesc}</p>
              </div>
              <div>
                <p className="font-mono text-xl sm:text-2xl font-bold text-[#09090B]">85%</p>
                <p className="text-xs text-zinc-500 font-medium">{t.metricsSavingsDesc}</p>
              </div>
            </div>
          </div>

          {/* COLUMN 2: LIVE REACT PHONE SIMULATOR COMPONENT (5 COLS) */}
          <div id="simulator" className="lg:col-span-5 flex flex-col items-center">
            {/* Phone Exterior Frame */}
            <div
              className={`w-full max-w-[340px] sm:max-w-[360px] rounded-[42px] p-3.5 bg-white border-2 border-zinc-300 shadow-xl transition-all duration-300 ${
                isSimBuzzing ? 'ring-4 ring-orange-600/40 border-orange-600' : ''
              }`}
            >
              {/* Phone Inner Display */}
              <div className="bg-[#FAFAFA] rounded-[32px] p-5 border border-zinc-200 text-center relative overflow-hidden min-h-[460px] flex flex-col justify-between">
                {/* Speaker Notch & Dynamic Clock */}
                <div>
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-500 px-1 mb-2">
                    <span>12:45</span>
                    <div className="w-16 h-3 bg-zinc-200 rounded-full mx-auto" />
                    <span>5G · 98%</span>
                  </div>

                  {/* Simulator Language Switcher Bar */}
                  <div className="flex items-center justify-center gap-1 bg-white p-1 rounded-lg border border-zinc-200 text-[10px] font-mono mb-3">
                    <span className="text-zinc-500 text-[9px] mr-1">Lang:</span>
                    {(['id', 'ar', 'en'] as Lang[]).map((simLang) => (
                      <button
                        key={simLang}
                        onClick={() => setLang(simLang)}
                        className={`px-2 py-0.5 rounded cursor-pointer transition-colors ${
                          lang === simLang
                            ? 'bg-orange-600 text-white font-bold'
                            : 'text-zinc-600 hover:text-zinc-950'
                        }`}
                      >
                        {simLang.toUpperCase()}
                      </button>
                    ))}
                  </div>

                  {/* Step Selector Pills */}
                  <div className="grid grid-cols-4 gap-1 mb-4 text-[10px] font-mono">
                    {[
                      { s: 1, label: t.step1.split('.')[1] || 'Scan' },
                      { s: 2, label: t.step2.split('.')[1] || 'Wait' },
                      { s: 3, label: t.step3.split('.')[1] || 'Buzzer' },
                      { s: 4, label: t.step4.split('.')[1] || 'Review' },
                    ].map(({ s, label }) => (
                      <button
                        key={s}
                        onClick={() => {
                          setSimStep(s as 1 | 2 | 3 | 4);
                          if (s !== 3) handleStopBuzzer();
                        }}
                        className={`py-1 px-1 rounded border transition-colors cursor-pointer truncate ${
                          simStep === s
                            ? 'bg-zinc-900 text-white border-zinc-900 font-bold'
                            : 'bg-white text-zinc-600 border-zinc-200 hover:bg-zinc-100'
                        }`}
                      >
                        {label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SIMULATOR SCREEN CONTENT (DYNAMIC STEPS) */}
                <div className="my-auto py-2">
                  {/* STEP 1: SCAN QR */}
                  {simStep === 1 && (
                    <div className="space-y-3 animate-in fade-in">
                      <div className="w-16 h-16 mx-auto bg-white p-2 rounded-xl border border-zinc-300 shadow-xs flex items-center justify-center">
                        <QrCode className="w-12 h-12 text-zinc-900" />
                      </div>
                      <h3 className="font-bold text-zinc-950 text-sm">
                        {lang === 'id'
                          ? 'Scan QR di Meja / Struk'
                          : lang === 'ar'
                          ? 'امسح رمز QR على الطاولة'
                          : 'Scan QR at Table / Receipt'}
                      </h3>
                      <p className="text-xs text-zinc-500 leading-normal max-w-[220px] mx-auto">
                        {lang === 'id'
                          ? 'Kamera otomatis membuka tiket pesanan web tanpa instal aplikasi.'
                          : lang === 'ar'
                          ? 'تفتح صفحة تتبع الطلب مباشرة في متصفح جوالك بدون أي تطبيق.'
                          : 'Camera instantly launches web ticket without installing apps.'}
                      </p>
                      <button
                        onClick={() => setSimStep(2)}
                        className="mt-2 px-3 py-1.5 bg-orange-600 hover:bg-orange-700 text-white font-mono text-xs font-semibold rounded-lg cursor-pointer"
                      >
                        {lang === 'id' ? 'Lanjut ke Antrean →' : lang === 'ar' ? 'التالي: شاشة الانتظار ←' : 'Next: Waiting Screen →'}
                      </button>
                    </div>
                  )}

                  {/* STEP 2: WAITING IN QUEUE */}
                  {simStep === 2 && (
                    <div className="space-y-2 animate-in fade-in">
                      <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-200/70 border border-zinc-300 text-[10px] font-mono text-zinc-700 font-semibold">
                        <Clock className="w-3 h-3 text-zinc-600" />
                        <span>{t.orderStatusPreparing}</span>
                      </div>

                      <div className="py-2">
                        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                          {t.orderLabel}
                        </p>
                        <p className="text-5xl font-mono font-black text-zinc-950 tracking-tight">
                          #27
                        </p>
                      </div>

                      <div className="p-2.5 bg-white border border-zinc-200 rounded-xl text-xs text-zinc-700 space-y-1 shadow-xs">
                        <Coffee className="w-4 h-4 text-orange-600 mx-auto" />
                        <p className="font-medium text-xs">{t.orderWaiting}</p>
                      </div>

                      <p className="text-[11px] text-zinc-500 font-mono">
                        Kopi Kenangan · Grand Indonesia
                      </p>
                    </div>
                  )}

                  {/* STEP 3: ORDER READY / PANGGIL BUZZER */}
                  {simStep === 3 && (
                    <div className="space-y-2 animate-in zoom-in">
                      {/* Status Ready Emerald Badge */}
                      <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-100 border border-emerald-300 text-emerald-800 text-[11px] font-mono font-bold">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.orderReady}</span>
                      </div>

                      {/* Buzzer Chime Siren Icon */}
                      <div className="relative w-16 h-16 mx-auto my-1">
                        <div className="w-16 h-16 rounded-2xl bg-orange-600 text-white flex items-center justify-center shadow-md animate-pulse">
                          <BellRing className="w-8 h-8 animate-bounce" />
                        </div>
                      </div>

                      <div>
                        <p className="text-[10px] font-mono uppercase tracking-widest text-zinc-500">
                          {t.orderLabel}
                        </p>
                        <p className="text-5xl font-mono font-black text-orange-600 tracking-tight">
                          #27
                        </p>
                      </div>

                      <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-xs font-semibold text-emerald-900">
                        {t.orderPickupAt}
                      </div>
                    </div>
                  )}

                  {/* STEP 4: 5-STAR GOOGLE REVIEW */}
                  {simStep === 4 && (
                    <div className="space-y-2.5 animate-in fade-in">
                      <div className="flex justify-center gap-1 text-amber-500">
                        {[1, 2, 3, 4, 5].map((i) => (
                          <Star key={i} className="w-5 h-5 fill-amber-400" />
                        ))}
                      </div>
                      <h4 className="font-bold text-zinc-950 text-sm">{t.reviewTitle}</h4>
                      <p className="text-xs text-zinc-500 leading-normal max-w-[210px] mx-auto">
                        {t.reviewDesc}
                      </p>
                      <div className="p-2 bg-white border border-zinc-200 rounded-lg text-xs font-mono font-bold text-zinc-800">
                        ⭐ 4.9/5 · Google Maps Rating
                      </div>
                    </div>
                  )}
                </div>

                {/* Simulator Interaction Trigger */}
                <div className="pt-2 border-t border-zinc-200">
                  {!isSimBuzzing ? (
                    <button
                      onClick={handleTriggerBuzzer}
                      className="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 text-white font-mono font-bold text-xs rounded-xl shadow-xs flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <BellRing className="w-4 h-4" />
                      <span>{t.orderAction}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopBuzzer}
                      className="w-full py-2.5 px-4 bg-zinc-900 hover:bg-zinc-800 text-white font-mono font-bold text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer transition-colors"
                    >
                      <X className="w-4 h-4 text-red-400" />
                      <span>{t.orderStop}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
            <p className="text-xs text-zinc-400 font-mono mt-3 text-center">
              {lang === 'id' ? '↑ Coba klik tombol di atas untuk uji suara' : lang === 'ar' ? '↑ اضغط الزر بالأعلى لتجربة الرنين الصوتي' : '↑ Tap button to trigger real audio siren'}
            </p>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 3. ASYMMETRIC BENTO GRID (REAL UI SNAPSHOTS & FEATURES) */}
      {/* ======================================================== */}
      <section id="bento" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200">
        <div className="mb-12 space-y-2">
          <span className="text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
            {t.bentoTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#09090B] tracking-tight">
            {t.bentoTitle}
          </h2>
          <p className="text-sm sm:text-base text-zinc-600 max-w-3xl">
            {t.bentoSubtitle}
          </p>
        </div>

        {/* The Asymmetric Bento Grid Container */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-5">
          {/* BENTO CARD 1: LARGE CASHIER POS DISPATCHER (SPAN 8) */}
          <div className="md:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <div className="flex items-center justify-between mb-4">
                <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider">
                  {t.bento1Tag}
                </span>
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-emerald-50 border border-emerald-200 text-[10px] font-mono font-bold text-emerald-800">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
                  Live WebSocket
                </span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold text-[#09090B] mb-2">
                {t.bento1Title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {t.bento1Desc}
              </p>
            </div>

            {/* REALISTIC POS QUEUE INTERFACE MOCKUP */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 font-mono text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-zinc-200 text-zinc-500 text-[11px]">
                <span>ANTREAN KASIR (4 AKTIF)</span>
                <span className="text-zinc-700 font-semibold">Cabang Grand Indonesia</span>
              </div>
              <div className="divide-y divide-zinc-200">
                {/* Order Item 1 - Buzzed */}
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-orange-600">#27</span>
                    <div>
                      <p className="font-sans font-semibold text-zinc-900 text-xs">Latte Aren + Croissant</p>
                      <p className="text-[10px] text-zinc-400">Tamu: Adham · 0812***</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 font-bold text-[10px]">
                      SIAP DIAMBIL
                    </span>
                    <button className="px-2.5 py-1 rounded bg-orange-600 text-white font-bold text-[10px] hover:bg-orange-700 transition-colors">
                      PANGGIL ULANG
                    </button>
                  </div>
                </div>

                {/* Order Item 2 - In Preparation */}
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-zinc-800">#28</span>
                    <div>
                      <p className="font-sans font-semibold text-zinc-900 text-xs">V60 Gayo Wine Manual Brew</p>
                      <p className="text-[10px] text-zinc-400">Tamu: Walk-in Meja 04</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded bg-zinc-200 text-zinc-700 font-medium text-[10px]">
                      DIRACIK (2m)
                    </span>
                    <button className="px-2.5 py-1 rounded bg-zinc-900 text-white font-bold text-[10px] hover:bg-zinc-800 transition-colors">
                      PANGGIL
                    </button>
                  </div>
                </div>

                {/* Order Item 3 - Inbound */}
                <div className="py-2.5 flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-sm text-zinc-800">#29</span>
                    <div>
                      <p className="font-sans font-semibold text-zinc-900 text-xs">Matcha Oat Latte</p>
                      <p className="text-[10px] text-zinc-400">Tamu: Online QR</p>
                    </div>
                  </div>
                  <span className="px-2 py-0.5 rounded bg-zinc-100 text-zinc-500 font-medium text-[10px]">
                    BARU MASUK
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 2: ZERO-HARDWARE ACRYLIC TABLE STAND (SPAN 4) */}
          <div className="md:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
                {t.bento2Tag}
              </span>
              <h3 className="text-xl font-bold text-[#09090B] mb-2">
                {t.bento2Title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {t.bento2Desc}
              </p>
            </div>

            {/* ACRYLIC STAND GRAPHIC MOCKUP */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 flex flex-col items-center justify-center text-center">
              <div className="w-24 h-32 bg-white border-2 border-zinc-300 rounded-lg p-2 shadow-sm flex flex-col justify-between items-center relative">
                <div className="w-6 h-6 rounded-md bg-zinc-100 border border-zinc-200 flex items-center justify-center">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src="/panggil-logo.jpg" alt="Logo" className="w-full h-full object-cover rounded-md" />
                </div>
                <div className="w-14 h-14 bg-zinc-900 rounded p-1 flex items-center justify-center">
                  <QrCode className="w-full h-full text-white" />
                </div>
                <span className="text-[8px] font-mono font-bold text-zinc-500">MEJA 12</span>
              </div>
              <p className="text-xs font-mono font-semibold text-zinc-700 mt-3">
                100% Bebas Cuci & Baterai
              </p>
            </div>
          </div>

          {/* BENTO CARD 3: 5-STAR GOOGLE REVIEW BOOSTER (SPAN 4) */}
          <div className="md:col-span-4 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
                {t.bento3Tag}
              </span>
              <h3 className="text-xl font-bold text-[#09090B] mb-2">
                {t.bento3Title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {t.bento3Desc}
              </p>
            </div>

            {/* REVIEW MODAL INTERACTION MOCKUP */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 space-y-2.5">
              <div className="flex justify-between items-center text-xs font-mono text-zinc-500">
                <span>KONVERSI ULASAN</span>
                <span className="text-emerald-700 font-bold">+35% REVIEW</span>
              </div>
              <div className="bg-white p-3 rounded-lg border border-zinc-200 text-center shadow-xs">
                <div className="flex justify-center gap-1 text-amber-500 mb-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star key={s} className="w-4 h-4 fill-amber-400" />
                  ))}
                </div>
                <p className="text-xs font-bold text-zinc-900">Ulasan Google Maps</p>
                <p className="text-[10px] text-zinc-500">Buka Google Maps otomatis saat rating 5★</p>
              </div>
            </div>
          </div>

          {/* BENTO CARD 4: INTERACTIVE DIGITAL MENU (SPAN 8) */}
          <div className="md:col-span-8 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
                {t.bento4Tag}
              </span>
              <h3 className="text-xl sm:text-2xl font-bold text-[#09090B] mb-2">
                {t.bento4Title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {t.bento4Desc}
              </p>
            </div>

            {/* DIGITAL MENU PREVIEW GRID */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4">
              <div className="flex gap-2 mb-3 overflow-x-auto pb-1 text-xs font-mono">
                <span className="px-2.5 py-1 bg-zinc-900 text-white rounded-md font-semibold">Semua</span>
                <span className="px-2.5 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-md">Kopi</span>
                <span className="px-2.5 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-md">Pastry</span>
                <span className="px-2.5 py-1 bg-white text-zinc-600 border border-zinc-200 rounded-md">Makanan</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="bg-white p-3 rounded-lg border border-zinc-200 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="font-semibold text-xs text-zinc-900">Spanish Latte Signature</p>
                    <p className="text-[11px] font-mono text-zinc-500">Rp 38.000 / 9.5 ر.س</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-orange-100 text-orange-800 rounded">
                    BEST SELLER
                  </span>
                </div>
                <div className="bg-white p-3 rounded-lg border border-zinc-200 flex items-center justify-between shadow-xs">
                  <div>
                    <p className="font-semibold text-xs text-zinc-900">Butter Croissant Almond</p>
                    <p className="text-[11px] font-mono text-zinc-500">Rp 32.000 / 8 ر.س</p>
                  </div>
                  <span className="text-[10px] font-mono font-bold px-1.5 py-0.5 bg-zinc-100 text-zinc-700 rounded">
                    FRESH BAKE
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* BENTO CARD 5: AUDIO KEEP-ALIVE SURVIVAL (SPAN 6) */}
          <div className="md:col-span-6 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
                {t.bento5Tag}
              </span>
              <h3 className="text-xl font-bold text-[#09090B] mb-2">
                {t.bento5Title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {t.bento5Desc}
              </p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 font-mono text-xs text-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <span>iOS Safari Silent WebAudio Loop</span>
                <span className="text-emerald-700 font-bold">ACTIVE</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Android Vibration Haptic API</span>
                <span className="text-emerald-700 font-bold">SUPPORTED</span>
              </div>
            </div>
          </div>

          {/* BENTO CARD 6: MULTI-OUTLET GOVERNANCE (SPAN 6) */}
          <div className="md:col-span-6 bg-white border border-zinc-200 rounded-2xl p-6 sm:p-7 flex flex-col justify-between shadow-xs">
            <div>
              <span className="text-[11px] font-mono font-bold text-orange-600 uppercase tracking-wider block mb-4">
                {t.bento6Tag}
              </span>
              <h3 className="text-xl font-bold text-[#09090B] mb-2">
                {t.bento6Title}
              </h3>
              <p className="text-sm text-zinc-600 leading-relaxed mb-6">
                {t.bento6Desc}
              </p>
            </div>
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-4 font-mono text-xs text-zinc-700 space-y-2">
              <div className="flex items-center justify-between">
                <span>Multi-Tenant Branch Switcher</span>
                <span className="text-zinc-900 font-bold">Jakarta · Bali · Riyadh</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Cashier Staff Isolation PIN</span>
                <span className="text-zinc-900 font-bold">4-Digit Security</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 4. INTERACTIVE ROI CALCULATOR (SWISS MINIMALIST CARDS) */}
      {/* ======================================================== */}
      <section id="calculator" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full border-t border-zinc-200">
        <div className="bg-white border border-zinc-200 rounded-2xl p-6 sm:p-10 shadow-xs">
          <div className="text-center max-w-2xl mx-auto mb-10 space-y-2">
            <span className="text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
              {t.calcTag}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">
              {t.calcTitle}
            </h2>
            <p className="text-sm text-zinc-600">{t.calcSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Input Column */}
            <div className="space-y-6">
              {/* Slider 1: Hardware Pager Count */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="font-semibold text-zinc-700">{t.sliderPagers}</span>
                  <span className="font-bold text-orange-600 text-sm bg-orange-50 px-2.5 py-0.5 rounded border border-orange-200">
                    {hardwarePagerCount} unit
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="100"
                  step="5"
                  value={hardwarePagerCount}
                  onChange={(e) => setHardwarePagerCount(Number(e.target.value))}
                  className="w-full accent-orange-600 cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                />
              </div>

              {/* Slider 2: Daily Order Count */}
              <div>
                <div className="flex justify-between items-center text-xs font-mono mb-2">
                  <span className="font-semibold text-zinc-700">{t.sliderOrders}</span>
                  <span className="font-bold text-zinc-900 text-sm bg-zinc-100 px-2.5 py-0.5 rounded border border-zinc-200">
                    {dailyOrderCount} order/hari
                  </span>
                </div>
                <input
                  type="range"
                  min="20"
                  max="500"
                  step="10"
                  value={dailyOrderCount}
                  onChange={(e) => setDailyOrderCount(Number(e.target.value))}
                  className="w-full accent-zinc-900 cursor-pointer h-2 bg-zinc-200 rounded-lg appearance-none"
                />
              </div>

              <div className="p-4 bg-zinc-50 border border-zinc-200 rounded-xl text-xs text-zinc-600 font-mono space-y-1">
                <p>• Estimasi harga beli 1 pager fisik: Rp 380.000 (~$24 / 95 ر.س)</p>
                <p>• Rata-rata kerusakan & baterai drop: 25% per tahun</p>
              </div>
            </div>

            {/* Savings Result Card */}
            <div className="bg-zinc-50 border border-zinc-200 rounded-xl p-6 sm:p-8 text-center space-y-3">
              <span className="text-xs font-mono font-bold uppercase tracking-wider text-zinc-500">
                {t.calcSavedHeading}
              </span>
              <div className="text-3xl sm:text-4xl lg:text-5xl font-mono font-black text-emerald-700">
                {formatPrice(totalSavingsIDR, currency)}
              </div>
              <p className="text-xs text-zinc-600 max-w-xs mx-auto leading-relaxed">
                {t.calcPerYear}
              </p>
              <div className="pt-2">
                <a
                  href="#pricing"
                  className="inline-block py-2.5 px-6 bg-zinc-950 hover:bg-zinc-800 text-white font-mono font-bold text-xs rounded-xl transition-colors cursor-pointer"
                >
                  {lang === 'id' ? 'Lihat Pilihan Paket →' : lang === 'ar' ? 'عرض باقات الاشتراك ←' : 'Explore Plans →'}
                </a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 5. SIDE-BY-SIDE COMPARISON MATRIX */}
      {/* ======================================================== */}
      <section id="comparison" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full border-t border-zinc-200">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
            {t.cmpTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">
            {t.cmpTitle}
          </h2>
          <p className="text-sm text-zinc-600">{t.cmpSubtitle}</p>
        </div>

        {/* Clean Swiss Comparison Table */}
        <div className="overflow-x-auto bg-white border border-zinc-200 rounded-2xl shadow-xs">
          <table className="w-full text-left rtl:text-right text-xs">
            <thead>
              <tr className="border-b border-zinc-200 bg-zinc-50 text-zinc-700 font-mono">
                <th className="py-4 px-6 font-bold uppercase w-1/3">Parameter</th>
                <th className="py-4 px-6 font-bold uppercase w-1/3 text-orange-700 bg-orange-50/50">
                  PANGGIL (DIGITAL)
                </th>
                <th className="py-4 px-6 font-bold uppercase w-1/3 text-zinc-500">
                  PAGER FISIK PLASTIK
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 font-sans">
              {comparisonData.map((row, idx) => (
                <tr key={idx} className="hover:bg-zinc-50/60 transition-colors">
                  <td className="py-3.5 px-6 font-bold text-zinc-900">
                    {row.label[lang]}
                  </td>
                  <td className="py-3.5 px-6 font-semibold text-emerald-800 bg-orange-50/20">
                    <div className="flex items-center gap-2">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      <span>{row.panggil[lang]}</span>
                    </div>
                  </td>
                  <td className="py-3.5 px-6 text-zinc-500">
                    <div className="flex items-center gap-2">
                      <X className="w-4 h-4 text-red-500 shrink-0" />
                      <span>{row.hardware[lang]}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 6. TRANSPARENT PRICING PLANS */}
      {/* ======================================================== */}
      <section id="pricing" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
            {t.pricingTag}
          </span>
          <h2 className="text-3xl sm:text-4xl font-black text-[#09090B] tracking-tight">
            {t.pricingTitle}
          </h2>
          <p className="text-sm text-zinc-600">{t.pricingSubtitle}</p>

          {/* Billing Cycle Toggle */}
          <div className="pt-2 flex justify-center">
            <div className="inline-flex items-center bg-zinc-100 p-1 rounded-xl border border-zinc-200 text-xs font-mono font-semibold">
              <button
                onClick={() => setBillingCycle('annual')}
                className={`py-1.5 px-4 rounded-lg transition-colors cursor-pointer flex items-center gap-1.5 ${
                  billingCycle === 'annual'
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                <span>{lang === 'id' ? 'Tahunan (Hemat 20%)' : lang === 'ar' ? 'سنوي (وفر 20%)' : 'Annual (Save 20%)'}</span>
                <span className="w-2 h-2 rounded-full bg-emerald-600" />
              </button>
              <button
                onClick={() => setBillingCycle('monthly')}
                className={`py-1.5 px-4 rounded-lg transition-colors cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-zinc-950 shadow-xs border border-zinc-200'
                    : 'text-zinc-600 hover:text-zinc-950'
                }`}
              >
                {lang === 'id' ? 'Bulanan' : lang === 'ar' ? 'شهري' : 'Monthly'}
              </button>
            </div>
          </div>
        </div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((p) => {
            const price = billingCycle === 'annual' ? p.priceAnnualIDR : p.priceMonthlyIDR;
            return (
              <div
                key={p.id}
                className={`bg-white rounded-2xl p-6 border flex flex-col justify-between transition-colors shadow-xs ${
                  p.highlight
                    ? 'border-orange-600 ring-2 ring-orange-600/10'
                    : 'border-zinc-200 hover:border-zinc-300'
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-zinc-500">
                      {p.tier}
                    </span>
                    {p.badge && (
                      <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-orange-100 text-orange-800 border border-orange-200">
                        {p.badge[lang]}
                      </span>
                    )}
                  </div>
                  <h3 className="text-xl font-bold text-zinc-950 mb-1">{p.name[lang]}</h3>
                  <p className="text-xs text-zinc-500 mb-5 leading-normal">{p.desc[lang]}</p>

                  <div className="mb-6 pb-6 border-b border-zinc-200">
                    {!p.isCustom ? (
                      <>
                        <div className="text-3xl font-mono font-black text-zinc-950">
                          {formatPrice(price, currency)}
                        </div>
                        <span className="text-[11px] font-mono text-zinc-500">
                          {billingCycle === 'annual'
                            ? lang === 'id'
                              ? '/ tahun (Rp ' + Math.round(price / 12).toLocaleString('id-ID') + '/bln)'
                              : lang === 'ar'
                              ? '/ سنوياً'
                              : '/ year'
                            : lang === 'id'
                            ? '/ bulan'
                            : lang === 'ar'
                            ? '/ شهرياً'
                            : '/ month'}
                        </span>
                      </>
                    ) : (
                      <>
                        <div className="text-2xl font-mono font-bold text-zinc-900">Custom Quote</div>
                        <span className="text-[11px] text-zinc-500 font-mono">
                          {lang === 'id' ? 'Sesuai jumlah cabang' : lang === 'ar' ? 'بحسب عدد الفروع' : 'Per outlet scale'}
                        </span>
                      </>
                    )}
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-2.5 text-xs text-zinc-700 mb-8">
                    {p.features[lang].map((f, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <a
                  href={`https://wa.me/966553865899?text=${encodeURIComponent(
                    `Halo Panggil App, saya tertarik berlangganan paket ${p.tier} (${billingCycle})`
                  )}`}
                  target="_blank"
                  rel="noreferrer"
                  className={`w-full py-3 px-4 rounded-xl text-center font-mono font-bold text-xs transition-colors cursor-pointer ${
                    p.highlight
                      ? 'bg-orange-600 hover:bg-orange-700 text-white shadow-xs'
                      : 'bg-zinc-900 hover:bg-zinc-800 text-white'
                  }`}
                >
                  {t.btnChoosePlan}
                </a>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 7. FREQUENTLY ASKED QUESTIONS (FAQ) */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full border-t border-zinc-200">
        <div className="text-center max-w-xl mx-auto mb-10 space-y-2">
          <span className="text-xs font-mono font-semibold text-orange-600 uppercase tracking-wider">
            {t.faqTag}
          </span>
          <h2 className="text-2xl sm:text-3xl font-black text-[#09090B] tracking-tight">
            {t.faqTitle}
          </h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-white border border-zinc-200 rounded-xl overflow-hidden transition-colors shadow-xs"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full py-4 px-6 text-left rtl:text-right flex items-center justify-between gap-4 font-bold text-sm text-zinc-900 cursor-pointer"
                >
                  <span>{faq.q[lang]}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-orange-600 shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-6 pb-4 pt-1 text-xs text-zinc-600 leading-relaxed border-t border-zinc-100">
                    {faq.a[lang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* 8. BOTTOM CALL TO ACTION */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full border-t border-zinc-200">
        <div className="bg-zinc-900 text-white rounded-3xl p-8 sm:p-12 text-center space-y-6">
          <div className="max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-4xl font-black tracking-tight">
              {t.ctaBottomTitle}
            </h2>
            <p className="text-sm text-zinc-400">
              {t.ctaBottomSubtitle}
            </p>
          </div>

          <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
            <a
              href="https://wa.me/966553865899?text=Halo%20Panggil%20App,%20saya%20ingin%20berlangganan%20sistem%20pager"
              target="_blank"
              rel="noreferrer"
              className="py-3.5 px-6 bg-emerald-600 hover:bg-emerald-700 text-white font-mono font-bold text-sm rounded-xl shadow-xs transition-colors flex items-center gap-2 cursor-pointer"
            >
              <MessageCircle className="w-4 h-4" />
              <span>{t.whatsappBtn}</span>
            </a>

            <Link
              href="/c/ubk/cashier"
              target="_blank"
              className="py-3.5 px-6 bg-white/10 hover:bg-white/20 text-white font-mono font-semibold text-sm rounded-xl border border-white/20 transition-colors cursor-pointer"
            >
              {t.ctaDemo}
            </Link>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* 9. SWISS MINIMALIST FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-zinc-200 bg-white py-10 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg overflow-hidden border border-zinc-300 shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/panggil-logo.jpg"
                alt="Panggil Official Logo"
                className="w-full h-full object-cover"
              />
            </div>
            <div>
              <p className="font-bold text-zinc-900 font-sans">Panggil / نداء © 2026</p>
              <p className="text-[11px] text-zinc-500">Zero-Hardware Coaster Pager & Smart Menu</p>
            </div>
          </div>

          <div className="flex items-center gap-6">
            <Link href="/admin/login" className="hover:text-zinc-950 transition-colors">
              Admin Portal
            </Link>
            <Link href="/c/ubk/cashier" className="hover:text-zinc-950 transition-colors">
              Demo POS
            </Link>
            <Link href="/c/ubk/menu" className="hover:text-zinc-950 transition-colors">
              Demo Menu
            </Link>
          </div>

          <div className="text-center md:text-right rtl:md:text-left text-[11px] text-zinc-400">
            <span>Swiss Minimalist Precision · Southeast Asia & GCC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
