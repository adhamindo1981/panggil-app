"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { audioEngine } from '@/lib/audio-engine';
import {
  BellRing,
  Coffee,
  Smartphone,
  Radio,
  Volume2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
  Sliders,
  Utensils,
  Layers,
  Zap,
  Flame,
  ArrowUpRight,
  Check,
  X,
  Star,
  Crown,
  Lock,
  Globe,
  DollarSign,
  TrendingDown,
  RotateCcw,
  QrCode,
  MapPin,
  Clock,
  PhoneCall,
  ChevronDown,
  ChevronUp,
  MessageCircle,
  HelpCircle,
  Award,
  Share2,
  ThumbsUp,
  HeartHandshake,
  Activity,
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
    }, 4500);
  };

  const handleStopBuzzer = () => {
    audioEngine.stopAlarmLoop();
    setIsSimBuzzing(false);
  };

  // Calculate annual savings
  // Average physical pager costs Rp 350.000 ($22 / 90 SAR), 20% lost/broken annually
  const hardwareUnitCostIDR = 380000;
  const initialHardwareSavedIDR = hardwarePagerCount * hardwareUnitCostIDR;
  const annualMaintenanceSavedIDR = Math.round(hardwarePagerCount * hardwareUnitCostIDR * 0.25);
  const totalSavingsIDR = initialHardwareSavedIDR + annualMaintenanceSavedIDR;

  // Language Copy Dictionary
  const content = {
    id: {
      badge: "Sistem Pager Digital & Menu Cerdas No. 1 di Asia Tenggara",
      heroTitlePrefix: "HP Pelanggan Adalah",
      heroTitleHighlight: "Pager Anda.",
      heroSubtitle:
        "Tinggalkan pager fisik kuno yang mahal, cepat rusak, dan ribet dicas. Panggil mengubah ponsel pelanggan menjadi pager nirkabel instan lewat scan QR tanpa instal aplikasi. Dilengkapi menu digital interaktif dan pengumpul ulasan bintang 5 Google Maps.",
      ctaDemo: "Coba Demo Kasir (POS)",
      ctaCustomer: "Lihat Layar Pelanggan",
      ctaTestBuzzer: "Uji Suara Pager",
      simTitle: "Simulasi Langsung: Rasakan Bunyi & Getaran Pager",
      simDesc: "Klik tombol di bawah untuk membunyikan pager virtual di ponsel:",
      step1: "1. Scan QR",
      step2: "2. Menunggu",
      step3: "3. Pager Bunyi",
      step4: "4. Ulasan Google",
      orderLabel: "NOMOR PESANAN",
      orderWaiting: "Santai saja… Pesanan sedang diracik barista",
      orderReady: "Pesanan Anda Siap Diambil!",
      orderAction: "Bunyikan Pager Sekarang",
      orderStop: "Hentikan Suara",
      reviewTitle: "Bagikan Pengalaman Anda!",
      reviewDesc: "Kopi nikmat? Bantu kafe kami dengan memberi ulasan bintang 5 di Google Maps.",
      calcTitle: "Hitung Berapa Biaya yang Anda Hemat",
      calcSubtitle: "Bandingkan pengeluaran beli perangkat pager fisik vs berlangganan sistem Panggil",
      sliderPagers: "Jumlah Pager Fisik yang Digunakan:",
      sliderOrders: "Rata-rata Pesanan per Hari:",
      calcSavedHeading: "Total Penghematan Kafe Anda:",
      calcPerYear: "di tahun pertama (bebas beli alat & ganti baterai)",
      featuresTitle: "Kenapa Ratusan Kafe Beralih ke Panggil?",
      featuresSubtitle: "Satu platform terintegrasi yang meningkatkan efisiensi dan kepuasan pelanggan",
      cmpTitle: "Panggil vs Pager Fisik Plastik Tradisional",
      cmpSubtitle: "Perbandingan jelas antara sistem modern berbasis ponsel dan pager kuno",
      pricingTitle: "Pilihan Paket yang Fleksibel & Terjangkau",
      pricingSubtitle: "Mulai dengan paket dasar atau jadikan pengalaman beridentitas penuh merek Anda",
      pricingAnnualNote: "Hemat 20% dengan langganan tahunan",
      btnChoosePlan: "Mulai Berlangganan",
      faqTitle: "Pertanyaan yang Sering Diajukan (FAQ)",
      ctaBottomTitle: "Siap Tinggalkan Pager Plastik Kuno?",
      ctaBottomSubtitle: "Bergabunglah dengan kafe modern di Jakarta, Bali, dan Riyadh hari ini.",
      whatsappBtn: "Hubungi Tim Sales via WhatsApp",
    },
    ar: {
      badge: "المنظومة السحابية الأذكى للبيجر الرقمي والمنيو التفاعلي",
      heroTitlePrefix: "جوال عميلك هو",
      heroTitleHighlight: "جهاز ندائك.",
      heroSubtitle:
        "ودّع أجهزة البيجر البلاستيكية المكلفة سريعة التلف وكثيرة الصيانة. يحوّل نظام نداء (Panggil) هاتف العميل إلى بيجر رقمي فوري بمجرد مسح رمز QR دون أي تحميل لتطبيق، مع منيو إلكتروني تفاعلي ودعوة تلقائية للتقييم على خرائط Google.",
      ctaDemo: "تجربة لوحة الكاشير (POS)",
      ctaCustomer: "شاشة استدعاء الزبون",
      ctaTestBuzzer: "اختبر صوت الرنين",
      simTitle: "محاكاة تفاعلية مباشرة: استمع لرنين واهتزاز البيجر",
      simDesc: "اضغط على الزر لتجربة تنبيه استدعاء العميل في شاشة الهاتف مباشرة:",
      step1: "1. مسح QR",
      step2: "2. انتظار",
      step3: "3. رنين البيجر",
      step4: "4. تقييم Google",
      orderLabel: "رقم الطلب",
      orderWaiting: "خذ راحتك… طلبك يتم تحضيره بعناية",
      orderReady: "طلبك جاهز للاستلام الآن!",
      orderAction: "إطلاق رنين التنبيه الآن",
      orderStop: "إيقاف صوت الرنين",
      reviewTitle: "رأيك يهمنا ويصنع الفرق!",
      reviewDesc: "استمتعت بقهوتك؟ ساعدنا بدقيقة واحدة عبر تقييم منشأتنا على خرائط Google.",
      calcTitle: "احسب كم ستوفّر منشأتك مع نظام نداء",
      calcSubtitle: "قارن تكلفة شراء وصيانة أجهزة البيجر البلاستيكية باشتراك سحابي ذكي",
      sliderPagers: "عدد أجهزة البيجر البلاستيكية الحالية:",
      sliderOrders: "متوسط عدد الطلبات اليومية:",
      calcSavedHeading: "إجمالي وفورات مقهاك التقديرية:",
      calcPerYear: "في السنة الأولى (توفير شراء أجهزة وبطاريات وصيانة)",
      featuresTitle: "لماذا تتخلى المقاهي الرائدة عن البيجر البلاستيكي؟",
      featuresSubtitle: "منظومة واحدة ذكية ترفع كفاءة تسليم الطلبات وسرعة دوران الطاولات",
      cmpTitle: "نظام نداء (Panggil) مقابل أجهزة البيجر التقليدية",
      cmpSubtitle: "مقارنة دقيقة توضح الفوارق الجوهرية في التكلفة والمدى والصيانة",
      pricingTitle: "باقات اشتراك شفافة تناسب مختلف الاحتياجات",
      pricingSubtitle: "اختر الباقة الأساسية أو خصص التجربة بالكامل بهوية مقهاك البصرية",
      pricingAnnualNote: "وفر 20% عند اختيار الاشتراك السنوي",
      btnChoosePlan: "ابدأ الاشتراك الآن",
      faqTitle: "الأسئلة الشائعة حول المنظومة (FAQ)",
      ctaBottomTitle: "هل أنت مستعد لنقل تجربة عملائك للمستوى التالي؟",
      ctaBottomSubtitle: "انضم إلى نخبة المقاهي والمطابخ السحابية في إندونيسيا والخليج اليوم.",
      whatsappBtn: "تواصل مع فريق المبيعات عبر واتساب",
    },
    en: {
      badge: "The #1 Zero-Hardware Smart Coaster Pager & Digital Menu",
      heroTitlePrefix: "Your Customer’s Phone is",
      heroTitleHighlight: "Your Pager.",
      heroSubtitle:
        "Replace expensive, breakable plastic pagers with a sleek digital coaster system. Customers scan a QR code with zero app downloads, receive instant buzzing alerts when orders are ready, browse your digital menu, and leave 5-star Google Reviews.",
      ctaDemo: "Try Cashier POS Demo",
      ctaCustomer: "View Customer Screen",
      ctaTestBuzzer: "Test Pager Sound",
      simTitle: "Live Interactive Simulator: Feel the Sound & Haptics",
      simDesc: "Click below to trigger the real buzzer siren on the simulated mobile device:",
      step1: "1. Scan QR",
      step2: "2. Relax & Wait",
      step3: "3. Buzz Alert",
      step4: "4. Google Review",
      orderLabel: "ORDER NUMBER",
      orderWaiting: "Sit back and relax… Baristas are crafting your order",
      orderReady: "Your Order is Ready for Pickup!",
      orderAction: "Buzz Customer Pager Now",
      orderStop: "Stop Siren Sound",
      reviewTitle: "Share Your Experience!",
      reviewDesc: "Loved your coffee? Help us shine by leaving a 5-star review on Google Maps.",
      calcTitle: "Calculate Your Venue’s Cost Savings",
      calcSubtitle: "Compare the steep cost of purchasing hardware pagers against Panggil SaaS",
      sliderPagers: "Physical Pagers Currently in Use:",
      sliderOrders: "Average Daily Orders:",
      calcSavedHeading: "Total Estimated Venue Savings:",
      calcPerYear: "in year one (zero hardware purchases & replacement fees)",
      featuresTitle: "Why Modern Cafes are Replacing Hardware Pagers",
      featuresSubtitle: "An integrated cloud solution that speeds up table turnover and customer happiness",
      cmpTitle: "Panggil Digital vs Traditional Plastic Hardware Pagers",
      cmpSubtitle: "A side-by-side breakdown of cost, operating range, hygiene, and branding",
      pricingTitle: "Simple, Transparent & Value-Driven Plans",
      pricingSubtitle: "Start with essentials or customize the entire interface with your cafe brand",
      pricingAnnualNote: "Save 20% with annual billing",
      btnChoosePlan: "Subscribe to Plan",
      faqTitle: "Frequently Asked Questions (FAQ)",
      ctaBottomTitle: "Ready to Retire the Clunky Plastic Pager?",
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
          'Dukungan standar via email & chat',
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
          'Standard email & chat support',
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
        id: 'Sama sekali tidak! Pelanggan cukup mengarahkan kamera ponsel ke kode QR pada struk atau meja. Halaman tiket pager akan langsung terbuka di browser mereka dalam 0,5 detik.',
        ar: 'إطلاقاً! يمسح العميل رمز الـ QR بكاميرا هاتفه الذكي فقط، فتفتح صفحة تتبع الطلب في المتصفح فوراً خلال نصف ثانية دون تحميل تطبيق أو إنشاء حساب.',
        en: 'Not at all! The customer simply points their mobile camera at the QR code. The live pager page opens instantly in their browser in under half a second.',
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
      className="min-h-screen bg-[#060911] text-zinc-100 flex flex-col justify-between selection:bg-[#FF6B2C] selection:text-white font-sans antialiased overflow-x-hidden"
    >
      {/* ======================================================== */}
      {/* TOP NAVIGATION BAR */}
      {/* ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#060911]/90 border-b border-white/10 backdrop-blur-xl px-4 sm:px-8 py-3.5 transition-all">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          {/* Logo & Brand Mark */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative w-10 h-10 rounded-2xl bg-gradient-to-tr from-[#FF6B2C] via-[#F59E0B] to-amber-300 p-0.5 shadow-lg shadow-[#FF6B2C]/25 group-hover:scale-105 transition-transform flex items-center justify-center">
              <div className="w-full h-full bg-[#0b101d] rounded-[14px] flex items-center justify-center">
                <BellRing className="w-5 h-5 text-[#FF6B2C] group-hover:rotate-12 transition-transform" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-black tracking-tight text-white font-mono">
                  PANGGIL
                </span>
                <span className="text-xs font-bold text-zinc-400">/ نداء</span>
                <span className="hidden sm:inline-block px-2 py-0.5 rounded-full text-[9px] font-black bg-[#FF6B2C]/15 text-[#FF6B2C] border border-[#FF6B2C]/30 uppercase tracking-widest">
                  Smart SaaS
                </span>
              </div>
              <p className="text-[10px] text-zinc-400 font-medium">Digital Coaster & Smart Menu</p>
            </div>
          </Link>

          {/* Quick Nav Links (Desktop) */}
          <nav className="hidden md:flex items-center gap-7 text-xs font-bold text-zinc-300">
            <a href="#simulator" className="hover:text-[#FF6B2C] transition-colors">
              {lang === 'id' ? 'Simulasi Pager' : lang === 'ar' ? 'محاكاة البيجر' : 'Live Simulator'}
            </a>
            <a href="#calculator" className="hover:text-[#FF6B2C] transition-colors">
              {lang === 'id' ? 'Hitung Penghematan' : lang === 'ar' ? 'حاسبة التوفير' : 'Savings Calculator'}
            </a>
            <a href="#comparison" className="hover:text-[#FF6B2C] transition-colors">
              {lang === 'id' ? 'Bandingkan' : lang === 'ar' ? 'المقارنة' : 'Comparison'}
            </a>
            <a href="#pricing" className="hover:text-[#FF6B2C] transition-colors">
              {lang === 'id' ? 'Beli / Paket' : lang === 'ar' ? 'الباقات والأسعار' : 'Pricing'}
            </a>
          </nav>

          {/* Actions & Switchers */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Currency Selector */}
            <div className="flex bg-[#0d1322] p-1 rounded-xl border border-white/10 text-[11px] font-bold">
              {(['IDR', 'SAR', 'USD'] as Currency[]).map((curr) => (
                <button
                  key={curr}
                  onClick={() => setCurrency(curr)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer font-mono ${
                    currency === curr
                      ? 'bg-[#FF6B2C] text-white shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {curr === 'IDR' ? 'Rp' : curr === 'SAR' ? 'SAR' : '$'}
                </button>
              ))}
            </div>

            {/* Language Switcher */}
            <div className="flex bg-[#0d1322] p-1 rounded-xl border border-white/10 text-[11px] font-bold">
              {(['id', 'ar', 'en'] as Lang[]).map((l) => (
                <button
                  key={l}
                  onClick={() => setLang(l)}
                  className={`px-2 py-1 rounded-lg transition-all cursor-pointer uppercase ${
                    lang === l
                      ? 'bg-white text-zinc-950 font-black shadow-md'
                      : 'text-zinc-400 hover:text-white'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>

            {/* Admin Login Shortcut */}
            <Link
              href="/admin/login"
              className="hidden lg:flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold text-xs transition-all cursor-pointer"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-[#FF6B2C]" />
              <span>{lang === 'ar' ? 'دخول الإدارة' : lang === 'id' ? 'Panel Admin' : 'Admin'}</span>
            </Link>
          </div>
        </div>
      </header>

      {/* ======================================================== */}
      {/* HERO SECTION WITH AUTHENTIC BESPOKE ART DIRECTION */}
      {/* ======================================================== */}
      <section className="relative pt-12 pb-20 px-4 sm:px-8 max-w-7xl mx-auto w-full overflow-hidden">
        {/* Ambient Glows */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-[#FF6B2C]/20 via-[#F59E0B]/10 to-transparent blur-[140px] pointer-events-none -z-10" />

        <div className="text-center max-w-3xl mx-auto space-y-6">
          {/* Eyebrow Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#0d1322] border border-[#FF6B2C]/30 text-xs font-bold text-zinc-200 shadow-xl shadow-[#FF6B2C]/5 animate-pulse">
            <Sparkles className="w-3.5 h-3.5 text-[#FF6B2C]" />
            <span>{t.badge}</span>
          </div>

          {/* Editorial Headline */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.15]">
            {t.heroTitlePrefix}{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FF6B2C] via-[#FFA336] to-amber-300">
              {t.heroTitleHighlight}
            </span>
          </h1>

          {/* Authoritative Subheading */}
          <p className="text-base sm:text-lg text-zinc-300 font-normal leading-relaxed max-w-2xl mx-auto">
            {t.heroSubtitle}
          </p>

          {/* Quick CTA Buttons */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-3.5">
            <Link
              href="/c/ubk/cashier"
              target="_blank"
              className="py-4 px-7 bg-gradient-to-r from-[#FF6B2C] to-[#FFA336] hover:from-[#f55a1b] hover:to-[#f09525] text-white font-black text-sm rounded-2xl shadow-2xl shadow-[#FF6B2C]/30 transition-all hover:scale-102 active:scale-98 flex items-center gap-2.5 cursor-pointer"
            >
              <Zap className="w-4 h-4 fill-white" />
              <span>{t.ctaDemo}</span>
              <ArrowRight className={`w-4 h-4 ${isRtl ? 'rotate-180' : ''}`} />
            </Link>

            <Link
              href="/c/ubk/menu"
              target="_blank"
              className="py-4 px-6 bg-[#0d1322] hover:bg-[#131c30] text-zinc-200 border border-white/15 font-bold text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Smartphone className="w-4 h-4 text-[#10B981]" />
              <span>{t.ctaCustomer}</span>
            </Link>

            <a
              href="#simulator"
              className="py-4 px-5 bg-white/5 hover:bg-white/10 text-amber-300 border border-amber-500/30 font-bold text-sm rounded-2xl transition-all flex items-center gap-2 cursor-pointer"
            >
              <Volume2 className="w-4 h-4 animate-bounce" />
              <span>{t.ctaTestBuzzer}</span>
            </a>
          </div>

          {/* Micro Social Proof Row */}
          <div className="pt-6 flex flex-wrap items-center justify-center gap-6 text-xs text-zinc-400 font-medium">
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{lang === 'id' ? '100% Tanpa Unduh Aplikasi' : lang === 'ar' ? 'بدون تحميل أي تطبيق للعميل' : 'Zero App Downloads Required'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{lang === 'id' ? 'Aktif dalam 5 Menit' : lang === 'ar' ? 'تفعيل فوري خلال 5 دقائق' : 'Ready in 5 Minutes'}</span>
            </div>
            <div className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#10B981]" />
              <span>{lang === 'id' ? 'Garansi Uptime 99.9%' : lang === 'ar' ? 'ضمان استقرار 99.9%' : '99.9% Uptime Guarantee'}</span>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* INTERACTIVE LIVE PAGER SIMULATOR (OUT OF THE BOX) */}
      {/* ======================================================== */}
      <section id="simulator" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-b from-[#0d1322] to-[#070b14] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          <div className="text-center max-w-xl mx-auto mb-8 space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6B2C]">
              {lang === 'id' ? 'Uji Coba Langsung di Browser' : lang === 'ar' ? 'تجربة حية ومباشرة' : 'Interactive Live Demo'}
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-white">{t.simTitle}</h2>
            <p className="text-xs sm:text-sm text-zinc-400">{t.simDesc}</p>
          </div>

          {/* Interactive Steps Tabs */}
          <div className="flex items-center justify-center gap-2 mb-8 overflow-x-auto pb-2">
            {[
              { s: 1, label: t.step1 },
              { s: 2, label: t.step2 },
              { s: 3, label: t.step3 },
              { s: 4, label: t.step4 },
            ].map(({ s, label }) => (
              <button
                key={s}
                onClick={() => {
                  setSimStep(s as 1 | 2 | 3 | 4);
                  if (s !== 3) handleStopBuzzer();
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap ${
                  simStep === s
                    ? 'bg-[#FF6B2C] text-white shadow-lg shadow-[#FF6B2C]/20 scale-105'
                    : 'bg-white/5 text-zinc-400 hover:text-white border border-white/5'
                }`}
              >
                {label}
              </button>
            ))}
          </div>

          {/* Phone Frame Mockup */}
          <div className="flex flex-col items-center justify-center">
            <div
              className={`w-full max-w-xs sm:max-w-sm rounded-[40px] p-3.5 bg-gradient-to-b from-zinc-700 via-zinc-900 to-black border-2 border-zinc-700 shadow-2xl transition-all duration-300 ${
                isSimBuzzing ? 'ring-4 ring-[#FF6B2C] animate-bounce shadow-[#FF6B2C]/40' : ''
              }`}
            >
              {/* Phone Inner Screen */}
              <div className="bg-[#060911] rounded-[32px] p-6 border border-zinc-800 text-center relative overflow-hidden min-h-[380px] flex flex-col justify-between">
                {/* Speaker Notch */}
                <div className="w-20 h-4 bg-zinc-900 rounded-full mx-auto mb-4 border border-zinc-800/80 flex items-center justify-center">
                  <div className="w-3 h-3 rounded-full bg-zinc-800" />
                </div>

                {/* STEP 1: SCAN QR */}
                {simStep === 1 && (
                  <div className="space-y-4 my-auto animate-in fade-in">
                    <div className="w-20 h-20 mx-auto bg-white p-2 rounded-2xl shadow-xl">
                      <QrCode className="w-full h-full text-zinc-950" />
                    </div>
                    <h3 className="font-extrabold text-white text-base">
                      {lang === 'id' ? 'Arahkan Kamera ke QR' : lang === 'ar' ? 'امسح الرمز بكاميرا الجوال' : 'Scan QR at Table'}
                    </h3>
                    <p className="text-xs text-zinc-400">
                      {lang === 'id'
                        ? 'Cukup buka kamera bawaan, tanpa unduh aplikasi apapun.'
                        : lang === 'ar'
                        ? 'افتح كاميرا الهاتف فقط، دون تنزيل أي برنامج.'
                        : 'Use native camera, zero app downloads.'}
                    </p>
                    <button
                      onClick={() => setSimStep(2)}
                      className="mt-3 px-4 py-2 bg-[#FF6B2C] text-white text-xs font-bold rounded-xl cursor-pointer"
                    >
                      {lang === 'id' ? 'Lanjut ke Antrean' : lang === 'ar' ? 'التالي: شاشة الانتظار' : 'Next: Waiting Screen'}
                    </button>
                  </div>
                )}

                {/* STEP 2: WAITING */}
                {simStep === 2 && (
                  <div className="space-y-3 my-auto animate-in fade-in">
                    <span className="text-[10px] uppercase font-black tracking-widest text-[#FF6B2C]">
                      {t.orderLabel}
                    </span>
                    <div className="text-6xl font-black font-mono text-white tracking-wider my-2">
                      #27
                    </div>
                    <div className="p-3 bg-[#0d1322] border border-white/10 rounded-2xl text-xs text-zinc-300">
                      <Coffee className="w-5 h-5 text-[#F59E0B] mx-auto mb-1.5" />
                      <p className="font-bold">{t.orderWaiting}</p>
                    </div>
                    <p className="text-[11px] text-zinc-500">Kopi Kenangan / مقهى روعة</p>
                  </div>
                )}

                {/* STEP 3: BUZZING ALERT */}
                {simStep === 3 && (
                  <div className="space-y-3 my-auto animate-in zoom-in">
                    <div className="w-16 h-16 rounded-3xl bg-red-600/20 border border-red-500/40 flex items-center justify-center text-red-500 mx-auto animate-ping">
                      <BellRing className="w-8 h-8" />
                    </div>
                    <span className="text-[11px] uppercase font-black tracking-widest text-red-400">
                      SIRENE AKTIF · BUZZING
                    </span>
                    <div className="text-6xl font-black font-mono text-white tracking-wider">
                      #27
                    </div>
                    <div className="p-3 bg-red-950/60 border border-red-500/60 rounded-2xl text-xs text-red-200 font-bold">
                      {t.orderReady}
                    </div>
                  </div>
                )}

                {/* STEP 4: GOOGLE REVIEWS */}
                {simStep === 4 && (
                  <div className="space-y-3 my-auto animate-in fade-in">
                    <div className="flex justify-center gap-1 text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} className="w-5 h-5 fill-amber-400" />
                      ))}
                    </div>
                    <h3 className="font-extrabold text-white text-base">{t.reviewTitle}</h3>
                    <p className="text-xs text-zinc-400">{t.reviewDesc}</p>
                    <div className="p-3 bg-[#10B981]/10 border border-[#10B981]/30 rounded-2xl text-xs text-[#10B981] font-bold">
                      ⭐ 4.9/5 di Google Maps
                    </div>
                  </div>
                )}

                {/* Interactive Simulator Controller */}
                <div className="pt-3 border-t border-zinc-800/80">
                  {!isSimBuzzing ? (
                    <button
                      onClick={handleTriggerBuzzer}
                      className="w-full py-3 px-4 bg-gradient-to-r from-[#FF6B2C] to-[#FFA336] text-white font-black text-xs rounded-xl shadow-lg shadow-[#FF6B2C]/30 flex items-center justify-center gap-2 cursor-pointer hover:opacity-90 active:scale-95"
                    >
                      <BellRing className="w-4 h-4" />
                      <span>{t.orderAction}</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleStopBuzzer}
                      className="w-full py-3 px-4 bg-zinc-800 text-zinc-200 font-black text-xs rounded-xl flex items-center justify-center gap-2 cursor-pointer hover:bg-zinc-700"
                    >
                      <X className="w-4 h-4 text-red-400" />
                      <span>{t.orderStop}</span>
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* INTERACTIVE ROI / SAVINGS CALCULATOR */}
      {/* ======================================================== */}
      <section id="calculator" className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-[#0b101d] border border-white/10 rounded-3xl p-6 sm:p-10 shadow-2xl space-y-8">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <span className="text-[11px] font-black uppercase tracking-widest text-[#10B981]">
              {lang === 'id' ? 'Kalkulator ROI & Penghematan' : lang === 'ar' ? 'حاسبة التوفير الذكية' : 'Smart ROI Calculator'}
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-white">{t.calcTitle}</h2>
            <p className="text-xs sm:text-sm text-zinc-400">{t.calcSubtitle}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            {/* Sliders Input */}
            <div className="space-y-6 bg-[#060911] p-6 rounded-2xl border border-white/5">
              {/* Slider 1: Hardware Pager Count */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-300">{t.sliderPagers}</label>
                  <span className="font-mono text-lg font-black text-[#FF6B2C]">
                    {hardwarePagerCount} Pager
                  </span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="60"
                  step="5"
                  value={hardwarePagerCount}
                  onChange={(e) => setHardwarePagerCount(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#FF6B2C]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>5 pager</span>
                  <span>30 pager</span>
                  <span>60 pager</span>
                </div>
              </div>

              {/* Slider 2: Daily Order Count */}
              <div>
                <div className="flex justify-between items-center mb-2">
                  <label className="text-xs font-bold text-zinc-300">{t.sliderOrders}</label>
                  <span className="font-mono text-lg font-black text-[#10B981]">
                    {dailyOrderCount} Pesanan/hari
                  </span>
                </div>
                <input
                  type="range"
                  min="30"
                  max="500"
                  step="10"
                  value={dailyOrderCount}
                  onChange={(e) => setDailyOrderCount(Number(e.target.value))}
                  className="w-full h-2 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-[#10B981]"
                />
                <div className="flex justify-between text-[10px] text-zinc-500 mt-1">
                  <span>30</span>
                  <span>250</span>
                  <span>500+</span>
                </div>
              </div>
            </div>

            {/* Results Card */}
            <div className="bg-gradient-to-br from-[#10B981]/15 via-[#0d1322] to-[#060911] border border-[#10B981]/40 rounded-2xl p-6 sm:p-8 text-center relative overflow-hidden shadow-2xl">
              <TrendingDown className="w-8 h-8 text-[#10B981] mx-auto mb-2" />
              <p className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                {t.calcSavedHeading}
              </p>
              <div className="text-3xl sm:text-5xl font-black font-mono text-[#10B981] my-3">
                {formatPrice(totalSavingsIDR, currency)}
              </div>
              <p className="text-xs text-zinc-400 font-medium mb-4">{t.calcPerYear}</p>

              <div className="pt-4 border-t border-white/10 grid grid-cols-2 gap-3 text-left rtl:text-right text-xs">
                <div>
                  <span className="text-zinc-500 text-[10px] block">
                    {lang === 'id' ? 'Biaya Beli Alat Awal:' : lang === 'ar' ? 'تكلفة شراء الأجهزة:' : 'Hardware Unit Saved:'}
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {formatPrice(initialHardwareSavedIDR, currency)}
                  </span>
                </div>
                <div>
                  <span className="text-zinc-500 text-[10px] block">
                    {lang === 'id' ? 'Penggantian Rusak/Hilang:' : lang === 'ar' ? 'صيانة واستبدال سنوي:' : 'Annual Breakage Saved:'}
                  </span>
                  <span className="font-mono font-bold text-zinc-200">
                    {formatPrice(annualMaintenanceSavedIDR, currency)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* COMPARISON MATRIX (PANGGIL VS HARDWARE PAGERS) */}
      {/* ======================================================== */}
      <section id="comparison" className="py-16 px-4 sm:px-8 max-w-6xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-12 space-y-2">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#FF6B2C]">
            {lang === 'id' ? 'Analisis Komparatif' : lang === 'ar' ? 'مقارنة دقيقة وشاملة' : 'Head-to-Head Comparison'}
          </span>
          <h2 className="text-2xl sm:text-4xl font-black text-white">{t.cmpTitle}</h2>
          <p className="text-xs sm:text-sm text-zinc-400">{t.cmpSubtitle}</p>
        </div>

        <div className="bg-[#0b101d] border border-white/10 rounded-3xl overflow-hidden shadow-2xl">
          <div className="grid grid-cols-1 md:grid-cols-3 bg-[#0d1322] border-b border-white/10 p-4 sm:p-6 text-xs sm:text-sm font-black text-zinc-400">
            <div>{lang === 'id' ? 'Faktor Penilaian' : lang === 'ar' ? 'وجه المقارنة' : 'Comparison Factor'}</div>
            <div className="text-[#FF6B2C] flex items-center gap-1.5 mt-2 md:mt-0 font-bold">
              <CheckCircle2 className="w-4 h-4 text-[#FF6B2C]" />
              <span>{lang === 'id' ? 'Panggil (Pager Digital)' : lang === 'ar' ? 'نظام نداء (Panggil)' : 'Panggil Digital System'}</span>
            </div>
            <div className="text-zinc-500 flex items-center gap-1.5 mt-2 md:mt-0">
              <X className="w-4 h-4 text-red-500" />
              <span>{lang === 'id' ? 'Pager Plastik Tradisional' : lang === 'ar' ? 'البيجر البلاستيكي القديم' : 'Traditional Plastic Pagers'}</span>
            </div>
          </div>

          <div className="divide-y divide-white/5">
            {comparisonData.map((row, idx) => (
              <div
                key={idx}
                className="grid grid-cols-1 md:grid-cols-3 p-4 sm:p-6 gap-2 md:gap-4 hover:bg-white/[0.02] transition-colors text-xs sm:text-sm"
              >
                <div className="font-bold text-zinc-200">{row.label[lang]}</div>
                <div className="text-zinc-200 font-medium flex items-start gap-2 bg-[#FF6B2C]/5 p-2.5 rounded-xl border border-[#FF6B2C]/20">
                  <Check className="w-4 h-4 text-[#10B981] shrink-0 mt-0.5" />
                  <span>{row.panggil[lang]}</span>
                </div>
                <div className="text-zinc-400 flex items-start gap-2 p-2.5">
                  <X className="w-4 h-4 text-red-400 shrink-0 mt-0.5" />
                  <span>{row.hardware[lang]}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* PRICING PLANS SECTION */}
      {/* ======================================================== */}
      <section id="pricing" className="py-16 px-4 sm:px-8 max-w-7xl mx-auto w-full">
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <span className="text-[11px] font-black uppercase tracking-widest text-[#F59E0B]">
            {lang === 'id' ? 'Harga Transparan' : lang === 'ar' ? 'باقات شفافة ومدروسة' : 'Transparent Pricing'}
          </span>
          <h2 className="text-3xl sm:text-5xl font-black text-white">{t.pricingTitle}</h2>
          <p className="text-xs sm:text-sm text-zinc-400">{t.pricingSubtitle}</p>

          {/* Billing Cycle Switcher */}
          <div className="inline-flex items-center p-1 bg-[#0d1322] border border-white/10 rounded-2xl text-xs font-bold mt-4">
            <button
              onClick={() => setBillingCycle('annual')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                billingCycle === 'annual'
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFA336] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {lang === 'id' ? 'Tahunan (Hemat 20%)' : lang === 'ar' ? 'سنوي (خصم 20%)' : 'Annual (Save 20%)'}
            </button>
            <button
              onClick={() => setBillingCycle('monthly')}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                billingCycle === 'monthly'
                  ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFA336] text-white shadow-md'
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              {lang === 'id' ? 'Bulanan' : lang === 'ar' ? 'شهري' : 'Monthly'}
            </button>
          </div>
        </div>

        {/* 4 Pricing Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => {
            const rawPrice =
              billingCycle === 'annual' ? plan.priceAnnualIDR : plan.priceMonthlyIDR;
            const periodLabel =
              billingCycle === 'annual'
                ? lang === 'id'
                  ? '/ tahun'
                  : lang === 'ar'
                  ? '/ سنة'
                  : '/ year'
                : lang === 'id'
                ? '/ bulan'
                : lang === 'ar'
                ? '/ شهر'
                : '/ month';

            return (
              <div
                key={plan.id}
                className={`rounded-3xl p-6 sm:p-7 flex flex-col justify-between relative transition-all duration-300 ${
                  plan.highlight
                    ? 'bg-gradient-to-b from-[#131d33] to-[#0a101d] border-2 border-[#FF6B2C] shadow-2xl shadow-[#FF6B2C]/20 scale-102 lg:-translate-y-2'
                    : 'bg-[#0b101d] border border-white/10 hover:border-white/20'
                }`}
              >
                {plan.badge && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-gradient-to-r from-[#FF6B2C] to-[#FFA336] text-white font-black text-[10px] rounded-full uppercase tracking-wider shadow-lg">
                    {plan.badge[lang]}
                  </div>
                )}

                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-black uppercase tracking-wider text-zinc-400">
                      {plan.tier}
                    </span>
                    {plan.highlight && <Crown className="w-4 h-4 text-[#F59E0B]" />}
                  </div>

                  <h3 className="text-lg font-black text-white mt-1">{plan.name[lang]}</h3>
                  <p className="text-xs text-zinc-400 mt-2 min-h-[36px]">{plan.desc[lang]}</p>

                  {/* Price display */}
                  <div className="my-5 pb-5 border-b border-white/10">
                    {!plan.isCustom ? (
                      <>
                        <div className="flex items-baseline gap-1">
                          <span className="text-2xl sm:text-3xl font-black font-mono text-white">
                            {formatPrice(rawPrice, currency)}
                          </span>
                          <span className="text-xs text-zinc-400 font-bold">{periodLabel}</span>
                        </div>
                        {/* Sub-equivalents in other currencies */}
                        <div className="text-[11px] font-mono text-zinc-400 mt-1">
                          {currency !== 'SAR' && `≈ ${formatPrice(rawPrice, 'SAR')} `}
                          {currency !== 'USD' && `· ${formatPrice(rawPrice, 'USD')}`}
                        </div>
                      </>
                    ) : (
                      <div className="text-2xl font-black text-white my-2">
                        {lang === 'id' ? 'Kustomisasi' : lang === 'ar' ? 'حسب الفروع' : 'Custom Quote'}
                      </div>
                    )}
                  </div>

                  {/* Feature List */}
                  <ul className="space-y-2.5 text-xs text-zinc-300">
                    {plan.features[lang].map((f, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <Check className="w-3.5 h-3.5 text-[#10B981] shrink-0 mt-0.5" />
                        <span>{f}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="mt-7 pt-4 border-t border-white/5">
                  <a
                    href="https://wa.me/966553865899?text=Halo%20Panggil%20App,%20saya%20tertarik%20dengan%20paket%20langganan"
                    target="_blank"
                    rel="noreferrer"
                    className={`w-full py-3 px-4 rounded-xl font-black text-xs text-center flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      plan.highlight
                        ? 'bg-gradient-to-r from-[#FF6B2C] to-[#FFA336] text-white shadow-lg shadow-[#FF6B2C]/25 hover:opacity-95'
                        : 'bg-white/10 hover:bg-white/20 text-white'
                    }`}
                  >
                    <span>{t.btnChoosePlan}</span>
                    <ArrowRight className={`w-3.5 h-3.5 ${isRtl ? 'rotate-180' : ''}`} />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* FAQ ACCORDION SECTION */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-4xl mx-auto w-full">
        <div className="text-center mb-10 space-y-2">
          <HelpCircle className="w-8 h-8 text-[#FF6B2C] mx-auto mb-1" />
          <h2 className="text-2xl sm:text-3xl font-black text-white">{t.faqTitle}</h2>
        </div>

        <div className="space-y-3">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx;
            return (
              <div
                key={idx}
                className="bg-[#0b101d] border border-white/10 rounded-2xl overflow-hidden transition-all"
              >
                <button
                  onClick={() => setOpenFaq(isOpen ? null : idx)}
                  className="w-full p-5 text-left rtl:text-right flex items-center justify-between text-sm font-bold text-white cursor-pointer hover:bg-white/[0.02]"
                >
                  <span>{faq.q[lang]}</span>
                  {isOpen ? (
                    <ChevronUp className="w-4 h-4 text-[#FF6B2C] shrink-0" />
                  ) : (
                    <ChevronDown className="w-4 h-4 text-zinc-400 shrink-0" />
                  )}
                </button>
                {isOpen && (
                  <div className="px-5 pb-5 text-xs text-zinc-400 leading-relaxed border-t border-white/5 pt-3 animate-in fade-in">
                    {faq.a[lang]}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ======================================================== */}
      {/* BOTTOM CTA BANNER & WHATSAPP PIPELINE */}
      {/* ======================================================== */}
      <section className="py-16 px-4 sm:px-8 max-w-5xl mx-auto w-full">
        <div className="bg-gradient-to-r from-[#FF6B2C]/20 via-[#F59E0B]/10 to-[#10B981]/15 border border-[#FF6B2C]/40 rounded-3xl p-8 sm:p-12 text-center relative overflow-hidden shadow-2xl">
          <div className="max-w-2xl mx-auto space-y-4">
            <h2 className="text-3xl sm:text-4xl font-black text-white">{t.ctaBottomTitle}</h2>
            <p className="text-sm text-zinc-300 font-medium">{t.ctaBottomSubtitle}</p>
            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://wa.me/966553865899?text=Halo%20Panggil%20App,%20saya%20ingin%20berlangganan%20untuk%20kafe%20saya"
                target="_blank"
                rel="noreferrer"
                className="py-4 px-8 bg-[#25D366] hover:bg-[#20bd5a] text-zinc-950 font-black text-sm rounded-2xl shadow-xl shadow-[#25D366]/20 transition-all hover:scale-102 flex items-center gap-2 cursor-pointer"
              >
                <MessageCircle className="w-5 h-5 fill-zinc-950" />
                <span>{t.whatsappBtn}</span>
              </a>

              <Link
                href="/c/ubk/cashier"
                target="_blank"
                className="py-4 px-6 bg-white/10 hover:bg-white/15 text-white font-bold text-sm rounded-2xl border border-white/15 transition-all cursor-pointer"
              >
                {t.ctaDemo}
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* ======================================================== */}
      {/* FOOTER */}
      {/* ======================================================== */}
      <footer className="border-t border-white/10 bg-[#04060c] py-12 px-4 sm:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6 text-xs text-zinc-500">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-[#FF6B2C]/20 border border-[#FF6B2C]/40 flex items-center justify-center text-[#FF6B2C]">
              <BellRing className="w-4 h-4" />
            </div>
            <div>
              <p className="font-bold text-zinc-300">Panggil / نداء © 2026</p>
              <p className="text-[10px]">Smart Digital Pager & Interactive Menu Platform</p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-zinc-400">
            <Link href="/admin/login" className="hover:text-white transition-colors">
              Admin Portal
            </Link>
            <Link href="/c/ubk/cashier" className="hover:text-white transition-colors">
              Demo POS
            </Link>
            <Link href="/c/ubk/menu" className="hover:text-white transition-colors">
              Demo Menu
            </Link>
          </div>

          <div className="text-center md:text-right rtl:md:text-left text-[11px]">
            <span>Designed for Modern Hospitality in Southeast Asia & GCC</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
