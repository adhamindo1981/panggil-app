/**
 * Tri-Lingual Dictionary for Super Admin Portal (/app/admin/*)
 * Languages:
 *  - ar: العربية (Arabic) - Primary & Default for Admin
 *  - id: Bahasa Indonesia
 *  - en: English
 */

import { AppLanguage } from '@/types/database';

export interface AdminTranslations {
  portalTitle: string;
  portalSubtitle: string;
  login: {
    title: string;
    subtitle: string;
    emailLabel: string;
    emailPlaceholder: string;
    passwordLabel: string;
    passwordPlaceholder: string;
    submitButton: string;
    loggingIn: string;
    demoAccountsTitle: string;
    quickLoginAs: string;
    roles: {
      superAdmin: string;
      onboardingStaff: string;
      supportAgent: string;
    };
  };
  navigation: {
    overview: string;
    tenants: string;
    crm: string;
    staff: string;
    logout: string;
    loggedAs: string;
    backToHome: string;
  };
  kpis: {
    totalTenants: string;
    activeTenants: string;
    expiringSoon: string;
    liveOrdersToday: string;
    tierBreakdownTitle: string;
    basicCount: string;
    bronzeCount: string;
    silverCount: string;
    goldCount: string;
    monthlyRevenueEstimate: string;
  };
  tenants: {
    title: string;
    subtitle: string;
    addNew: string;
    searchPlaceholder: string;
    allTiers: string;
    allStatuses: string;
    columns: {
      cafe: string;
      tier: string;
      status: string;
      pin: string;
      expiresAt: string;
      actions: string;
    };
    actions: {
      onboardingKit: string;
      edit: string;
      menuBuilder: string;
      suspend: string;
      activate: string;
      delete: string;
      openCashier: string;
      openMenu: string;
    };
    badges: {
      active: string;
      trial: string;
      expired: string;
      suspended: string;
    };
  };
  onboardingKit: {
    title: string;
    subtitle: string;
    copyAll: string;
    copied: string;
    cashierUrl: string;
    qrKitUrl: string;
    menuUrl: string;
    pinCode: string;
    whatsappShare: string;
    close: string;
  };
  tenantWizard: {
    createTitle: string;
    editTitle: string;
    basicInfo: string;
    nameLabel: string;
    namePlaceholder: string;
    slugLabel: string;
    slugPlaceholder: string;
    tierLabel: string;
    modeLabel: string;
    pinLabel: string;
    ownerInfo: string;
    ownerNameLabel: string;
    ownerPhoneLabel: string;
    ownerEmailLabel: string;
    subscriptionPeriod: string;
    expiresAtLabel: string;
    brandingTitle: string;
    googleMapsUrl: string;
    logoUrl: string;
    primaryColor: string;
    save: string;
    cancel: string;
    saving: string;
  };
  crm: {
    title: string;
    subtitle: string;
    searchPlaceholder: string;
    ownerDirectory: string;
    callOwner: string;
    emailOwner: string;
    logNote: string;
    viewNotes: string;
    activeQueue: string;
    diagnostics: string;
    noteAuthor: string;
    noteType: string;
    noteContent: string;
    addNoteTitle: string;
    saveNote: string;
    types: {
      general: string;
      support: string;
      billing: string;
      onboarding: string;
    };
  };
  staff: {
    title: string;
    subtitle: string;
    addNew: string;
    columns: {
      member: string;
      role: string;
      permissions: string;
      status: string;
      lastLogin: string;
      actions: string;
    };
    roles: {
      super_admin: string;
      onboarding_staff: string;
      support_agent: string;
    };
    permissions: {
      can_create_tenant: string;
      can_edit_tier: string;
      can_suspend_tenant: string;
      can_manage_menu: string;
      can_view_crm: string;
      can_manage_staff: string;
    };
    active: string;
    disabled: string;
    editMember: string;
    save: string;
    cancel: string;
  };
  menuModal: {
    title: string;
    categories: string;
    items: string;
    addCategory: string;
    addItem: string;
    categoryNameAr: string;
    categoryNameId: string;
    categoryNameEn: string;
    itemNameAr: string;
    itemNameId: string;
    itemNameEn: string;
    price: string;
    available: string;
    save: string;
    cancel: string;
    close: string;
  };
}

export const ADMIN_TRANSLATIONS: Record<AppLanguage, AdminTranslations> = {
  ar: {
    portalTitle: 'بوابة الإدارة المركزية والتحكم',
    portalSubtitle: 'منظومة إدارة المشتركين، الفروع، الصلاحيات، وخدمة العملاء',
    login: {
      title: 'تسجيل دخول الإدارة',
      subtitle: 'يرجى إدخال بيانات حساب المشرف أو الموظف المعتمد',
      emailLabel: 'البريد الإلكتروني للإدارة',
      emailPlaceholder: 'admin@panggil.id',
      passwordLabel: 'كلمة المرور',
      passwordPlaceholder: '••••••••',
      submitButton: 'دخول لوحة التحكم',
      loggingIn: 'جاري التحقق من الصلاحيات...',
      demoAccountsTitle: 'حسابات تجريبية سريعة بنقرة واحدة:',
      quickLoginAs: 'دخول سريع بصفتك:',
      roles: {
        superAdmin: 'مالك المنصة (Super Admin)',
        onboardingStaff: 'موظف تفعيل المقاهي (Onboarding)',
        supportAgent: 'وكيل الدعم الفني (Support)',
      },
    },
    navigation: {
      overview: 'نظرة عامة ومؤشرات الأداء',
      tenants: 'المشتركين والاشتراكات',
      crm: 'مركز خدمة العملاء والدعم',
      staff: 'فريق العمل والصلاحيات',
      logout: 'تسجيل الخروج',
      loggedAs: 'مرحباً،',
      backToHome: 'العودة للصفحة الرئيسية',
    },
    kpis: {
      totalTenants: 'إجمالي المقاهي والمراكز',
      activeTenants: 'المقاهي النشطة حالياً',
      expiringSoon: 'اشتراكات تنتهي قريباً (أقل من 30 يوم)',
      liveOrdersToday: 'طلبات اليوم المكتملة',
      tierBreakdownTitle: 'توزيع المقاهي حسب الباقات:',
      basicCount: 'الأساسية (Basic)',
      bronzeCount: 'البرونزية (Bronze)',
      silverCount: 'الفضية (Silver)',
      goldCount: 'الذهبية (Gold)',
      monthlyRevenueEstimate: 'العائد الشهري المتوقع (MRR)',
    },
    tenants: {
      title: 'إدارة المشتركين وتفعيل المنشآت',
      subtitle: 'إنشاء المقاهي الجديدة، تعديل الباقات، استخراج كود التفعيل، والتحكم بالحسابات',
      addNew: 'إضافة مقهى / مشترك جديد',
      searchPlaceholder: 'بحث باسم المقهى، المعرف (Slug)، أو رقم الهاتف...',
      allTiers: 'جميع الباقات',
      allStatuses: 'جميع الحالات',
      columns: {
        cafe: 'المنشأة والمعرف',
        tier: 'الباقة الحالية',
        status: 'حالة الاشتراك',
        pin: 'رمز PIN الكاشير',
        expiresAt: 'تاريخ انتهاء الاشتراك',
        actions: 'إجراءات الإدارة',
      },
      actions: {
        onboardingKit: 'حقيبة الترحيب والروابط',
        edit: 'تعديل البيانات والباقة',
        menuBuilder: 'إدارة قائمة الطعام',
        suspend: 'تعطيل الحساب',
        activate: 'تفعيل الحساب',
        delete: 'حذف',
        openCashier: 'فتح شاشة الكاشير',
        openMenu: 'معاينة القائمة الرقمية',
      },
      badges: {
        active: 'نشط',
        trial: 'تجريبي',
        expired: 'منتهي',
        suspended: 'موقوف',
      },
    },
    onboardingKit: {
      title: 'حقيبة تدشين المقهى للعميل',
      subtitle: 'انسخ هذه الرسالة وشاركها مع صاحب المقهى فور تفعيله لبدء التشغيل فوراً',
      copyAll: 'نسخ نص الرسالة بالكامل',
      copied: 'تم النسخ بنجاح للحافظة!',
      cashierUrl: 'رابط لوحة الكاشير:',
      qrKitUrl: 'رابط أدوات طباعة الباركود والستاندات:',
      menuUrl: 'رابط المنيو الرقمي للزبائن:',
      pinCode: 'رمز PIN السري للكاشير:',
      whatsappShare: 'إرسال عبر واتساب للمالك',
      close: 'إغلاق',
    },
    tenantWizard: {
      createTitle: 'إضافة منشأة / مقهى جديد إلى المنصة',
      editTitle: 'تعديل بيانات المنشأة والاشتراك',
      basicInfo: 'البيانات الأساسية للمنشأة',
      nameLabel: 'اسم المنشأة أو المقهى (عربي / إندونيسي)',
      namePlaceholder: 'مثال: نداء كافيه / Nedaa Cafe',
      slugLabel: 'المعرف المخصص في الرابط (Slug)',
      slugPlaceholder: 'nedaa-cafe',
      tierLabel: 'باقة الاشتراك',
      modeLabel: 'نمط العمل',
      pinLabel: 'رمز PIN شاشة الكاشير (4 أرقام)',
      ownerInfo: 'بيانات مالك المنشأة والمتابعة',
      ownerNameLabel: 'اسم المالك أو المسؤول',
      ownerPhoneLabel: 'رقم هاتف / واتساب المالك',
      ownerEmailLabel: 'البريد الإلكتروني للتواصل',
      subscriptionPeriod: 'صلاحية وفترة الاشتراك',
      expiresAtLabel: 'تاريخ انتهاء الاشتراك',
      brandingTitle: 'الهوية البصرية والموقع (للباقة الذهبية)',
      googleMapsUrl: 'رابط تقييم خرائط جوجل (Google Maps)',
      logoUrl: 'رابط شعار المقهى (Logo Image URL)',
      primaryColor: 'اللون الرئيسي للعلامة التجارية',
      save: 'حفظ وتأكيد البيانات',
      cancel: 'إلغاء',
      saving: 'جاري الحفظ...',
    },
    crm: {
      title: 'مركز علاقات العملاء والدعم الفني (CRM)',
      subtitle: 'متابعة أصحاب المنشآت، تسجيل الملاحظات وتذاكر الدعم، وفحص حالة الأجهزة المباشرة',
      searchPlaceholder: 'بحث في سجلات أصحاب المقاهي...',
      ownerDirectory: 'دليل أصحاب المقاهي والمشتركين',
      callOwner: 'اتصال / واتساب',
      emailOwner: 'إرسال بريد إلكتروني',
      logNote: 'إضافة ملاحظة متابعة',
      viewNotes: 'سجل الملاحظات والمتابعات',
      activeQueue: 'فحص الطابور المباشر',
      diagnostics: 'فحص أداء البيجر',
      noteAuthor: 'الموظف:',
      noteType: 'التصنيف:',
      noteContent: 'محتوى الملاحظة أو الاستفسار:',
      addNoteTitle: 'تسجيل ملاحظة متابعة جديدة',
      saveNote: 'حفظ الملاحظة في السجل',
      types: {
        general: 'عام',
        support: 'دعم فني',
        billing: 'اشتراكات وفواتير',
        onboarding: 'تدشين وتدريب',
      },
    },
    staff: {
      title: 'إدارة فريق العمل والصلاحيات المركزية (RBAC)',
      subtitle: 'إضافة المشرفين، تحديد الأدوار، والتحكم الدقيق في صلاحيات كل موظف',
      addNew: 'إضافة عضو جديد للفريق',
      columns: {
        member: 'الموظف / البريد',
        role: 'الدور الوظيفي',
        permissions: 'الصلاحيات الممنوحة',
        status: 'حالة الحساب',
        lastLogin: 'آخر تسجيل دخول',
        actions: 'الإجراءات',
      },
      roles: {
        super_admin: 'مالك المنصة (Super Admin)',
        onboarding_staff: 'مسؤول تفعيل المقاهي (Onboarding Staff)',
        support_agent: 'وكيل دعم فني (Support Agent)',
      },
      permissions: {
        can_create_tenant: 'إنشاء مشتركين جدد',
        can_edit_tier: 'ترقية وتعديل الباقات',
        can_suspend_tenant: 'تعطيل وإيقاف الحسابات',
        can_manage_menu: 'تعديل قوائم الطعام',
        can_view_crm: 'عرض وتدوين ملاحظات CRM',
        can_manage_staff: 'إدارة الموظفين والصلاحيات',
      },
      active: 'نشط',
      disabled: 'معطل',
      editMember: 'تعديل الصلاحيات',
      save: 'حفظ التعديلات',
      cancel: 'إلغاء',
    },
    menuModal: {
      title: 'إدارة قائمة الطعام والمنتجات',
      categories: 'أقسام القائمة (الفئات)',
      items: 'المنتجات والأصناف',
      addCategory: 'إضافة قسم جديد',
      addItem: 'إضافة منتج جديد',
      categoryNameAr: 'اسم القسم (عربي)',
      categoryNameId: 'اسم القسم (إندونيسي)',
      categoryNameEn: 'اسم القسم (إنجليزي)',
      itemNameAr: 'اسم المنتج (عربي)',
      itemNameId: 'اسم المنتج (إندونيسي)',
      itemNameEn: 'اسم المنتج (إنجليزي)',
      price: 'السعر',
      available: 'متوفر للطلب',
      save: 'حفظ التعديلات',
      cancel: 'إلغاء',
      close: 'إغلاق القائمة',
    },
  },
  id: {
    portalTitle: 'Portal Admin & Manajemen Platform',
    portalSubtitle: 'Pusat kontrol onboarding kafe, kelola langganan, hak akses staf, dan CRM bantuan.',
    login: {
      title: 'Login Super Admin & Staf',
      subtitle: 'Silakan masukkan kredensial akun platform Panggil yang sah.',
      emailLabel: 'Email Admin',
      emailPlaceholder: 'admin@panggil.id',
      passwordLabel: 'Kata Sandi',
      passwordPlaceholder: '••••••••',
      submitButton: 'Masuk ke Dashboard',
      loggingIn: 'Memverifikasi hak akses...',
      demoAccountsTitle: 'Akun Demo Sekali Klik:',
      quickLoginAs: 'Masuk cepat sebagai:',
      roles: {
        superAdmin: 'Pemilik Platform (Super Admin)',
        onboardingStaff: 'Staf Onboarding Kafe',
        supportAgent: 'Agen Bantuan Pelanggan',
      },
    },
    navigation: {
      overview: 'Ringkasan & KPI',
      tenants: 'Pelanggan & Langganan',
      crm: 'Pusat CRM & Bantuan',
      staff: 'Staf & Hak Akses',
      logout: 'Keluar',
      loggedAs: 'Halo,',
      backToHome: 'Kembali ke Beranda',
    },
    kpis: {
      totalTenants: 'Total Kafe & Kantor',
      activeTenants: 'Kafe Aktif Saat Ini',
      expiringSoon: 'Langganan Segera Berakhir (<30 hari)',
      liveOrdersToday: 'Pesanan Selesai Hari Ini',
      tierBreakdownTitle: 'Distribusi Paket Langganan:',
      basicCount: 'Paket Basic',
      bronzeCount: 'Paket Bronze',
      silverCount: 'Paket Silver',
      goldCount: 'Paket Gold',
      monthlyRevenueEstimate: 'Estimasi Pendapatan Bulanan (MRR)',
    },
    tenants: {
      title: 'Kelola Kafe & Langganan Mitra',
      subtitle: 'Onboarding kafe baru, ubah paket langganan, salin paket sambutan, dan kontrol status.',
      addNew: 'Tambah Kafe Baru',
      searchPlaceholder: 'Cari nama kafe, slug, atau nomor telepon...',
      allTiers: 'Semua Paket',
      allStatuses: 'Semua Status',
      columns: {
        cafe: 'Nama Kafe & Slug',
        tier: 'Paket',
        status: 'Status',
        pin: 'PIN Kasir',
        expiresAt: 'Berlaku Hingga',
        actions: 'Tindakan',
      },
      actions: {
        onboardingKit: 'Kit Sambutan & Tautan',
        edit: 'Edit Data & Paket',
        menuBuilder: 'Kelola Buku Menu',
        suspend: 'Nonaktifkan Akun',
        activate: 'Aktifkan Akun',
        delete: 'Hapus',
        openCashier: 'Buka Kasir',
        openMenu: 'Pratinjau Menu',
      },
      badges: {
        active: 'Aktif',
        trial: 'Uji Coba',
        expired: 'Kedaluwarsa',
        suspended: 'Ditangguhkan',
      },
    },
    onboardingKit: {
      title: 'Kit Sambutan & Aktivasi Mitra',
      subtitle: 'Salin pesan ini dan kirimkan ke pemilik kafe segera setelah akun diaktifkan.',
      copyAll: 'Salin Seluruh Teks Pesan',
      copied: 'Berhasil disalin ke papan klip!',
      cashierUrl: 'Tautan Layar Kasir:',
      qrKitUrl: 'Tautan Cetak Barcode & Stand Meja:',
      menuUrl: 'Tautan Menu Digital Pelanggan:',
      pinCode: 'Kode PIN Rahasia Kasir:',
      whatsappShare: 'Kirim via WhatsApp ke Pemilik',
      close: 'Tutup',
    },
    tenantWizard: {
      createTitle: 'Daftarkan Kafe / Kantor Baru',
      editTitle: 'Edit Data Mitra & Langganan',
      basicInfo: 'Informasi Dasar Usaha',
      nameLabel: 'Nama Usaha / Kafe',
      namePlaceholder: 'Contoh: Kopi Nusantara',
      slugLabel: 'URL Slug Khusus',
      slugPlaceholder: 'kopi-nusantara',
      tierLabel: 'Pilihan Paket Langganan',
      modeLabel: 'Mode Operasional',
      pinLabel: 'Kode PIN Kasir (4 Angka)',
      ownerInfo: 'Kontak Pemilik Usaha',
      ownerNameLabel: 'Nama Pemilik / Manajer',
      ownerPhoneLabel: 'No. HP / WhatsApp Pemilik',
      ownerEmailLabel: 'Email Korespondensi',
      subscriptionPeriod: 'Masa Berlaku Langganan',
      expiresAtLabel: 'Tanggal Berakhir',
      brandingTitle: 'Identitas Visual & Peta (Khusus Paket Gold)',
      googleMapsUrl: 'Tautan Ulasan Google Maps',
      logoUrl: 'URL Gambar Logo Kafe',
      primaryColor: 'Warna Utama Brand (Hex Code)',
      save: 'Simpan Data',
      cancel: 'Batal',
      saving: 'Menyimpan...',
    },
    crm: {
      title: 'Pusat Layanan Pelanggan (CRM)',
      subtitle: 'Pantau pemilik kafe, catat log tindak lanjut bantuan, dan cek diagnostik pager antrean.',
      searchPlaceholder: 'Cari dalam basis data pemilik kafe...',
      ownerDirectory: 'Direktori Pemilik Mitra',
      callOwner: 'Telepon / WhatsApp',
      emailOwner: 'Kirim Email',
      logNote: 'Tambah Catatan',
      viewNotes: 'Riwayat Catatan Bantuan',
      activeQueue: 'Cek Antrean Aktif',
      diagnostics: 'Diagnostik Pager',
      noteAuthor: 'Oleh Staf:',
      noteType: 'Kategori:',
      noteContent: 'Isi Catatan Bantuan:',
      addNoteTitle: 'Buat Catatan Tindak Lanjut Baru',
      saveNote: 'Simpan Catatan',
      types: {
        general: 'Umum',
        support: 'Bantuan Teknis',
        billing: 'Langganan & Tagihan',
        onboarding: 'Pelatihan & Aktivasi',
      },
    },
    staff: {
      title: 'Manajemen Staf & Hak Akses (RBAC)',
      subtitle: 'Tambah anggota tim, tentukan peran, dan atur hak akses secara terperinci.',
      addNew: 'Tambah Anggota Tim',
      columns: {
        member: 'Nama / Email Staf',
        role: 'Peran',
        permissions: 'Hak Akses Diberikan',
        status: 'Status Akun',
        lastLogin: 'Login Terakhir',
        actions: 'Tindakan',
      },
      roles: {
        super_admin: 'Pemilik Platform (Super Admin)',
        onboarding_staff: 'Staf Onboarding Kafe',
        support_agent: 'Agen Bantuan Pelanggan',
      },
      permissions: {
        can_create_tenant: 'Bisa Buat Kafe Baru',
        can_edit_tier: 'Bisa Ubah Paket Langganan',
        can_suspend_tenant: 'Bisa Bekukan Akun Mitra',
        can_manage_menu: 'Bisa Edit Buku Menu',
        can_view_crm: 'Bisa Akses & Catat CRM',
        can_manage_staff: 'Bisa Kelola Staf & Hak Akses',
      },
      active: 'Aktif',
      disabled: 'Nonaktif',
      editMember: 'Edit Hak Akses',
      save: 'Simpan Perubahan',
      cancel: 'Batal',
    },
    menuModal: {
      title: 'Manajemen Menu & Kategori Produk',
      categories: 'Kategori Menu',
      items: 'Daftar Produk Menu',
      addCategory: 'Tambah Kategori',
      addItem: 'Tambah Produk',
      categoryNameAr: 'Nama Kategori (Arab)',
      categoryNameId: 'Nama Kategori (Indonesia)',
      categoryNameEn: 'Nama Kategori (Inggris)',
      itemNameAr: 'Nama Produk (Arab)',
      itemNameId: 'Nama Produk (Indonesia)',
      itemNameEn: 'Nama Produk (Inggris)',
      price: 'Harga Jual',
      available: 'Tersedia Dijual',
      save: 'Simpan Perubahan',
      cancel: 'Batal',
      close: 'Tutup Buku Menu',
    },
  },
  en: {
    portalTitle: 'Platform Central Admin Portal',
    portalSubtitle: 'Tenant onboarding, subscription lifecycle, RBAC staff management, and CRM support.',
    login: {
      title: 'Super Admin & Staff Login',
      subtitle: 'Please sign in with your authorized platform credentials.',
      emailLabel: 'Admin Email',
      emailPlaceholder: 'admin@panggil.id',
      passwordLabel: 'Password',
      passwordPlaceholder: '••••••••',
      submitButton: 'Sign In to Control Center',
      loggingIn: 'Verifying permissions...',
      demoAccountsTitle: 'One-Click Demo Accounts:',
      quickLoginAs: 'Quick login as:',
      roles: {
        superAdmin: 'Platform Owner (Super Admin)',
        onboardingStaff: 'Onboarding Staff',
        supportAgent: 'Support Agent',
      },
    },
    navigation: {
      overview: 'Overview & KPIs',
      tenants: 'Tenants & Subscriptions',
      crm: 'CRM & Support Hub',
      staff: 'Staff & Roles',
      logout: 'Sign Out',
      loggedAs: 'Welcome,',
      backToHome: 'Back to Home',
    },
    kpis: {
      totalTenants: 'Total Cafes & Offices',
      activeTenants: 'Active Tenants',
      expiringSoon: 'Expiring Soon (<30 Days)',
      liveOrdersToday: 'Orders Completed Today',
      tierBreakdownTitle: 'Subscription Tier Breakdown:',
      basicCount: 'Basic Tier',
      bronzeCount: 'Bronze Tier',
      silverCount: 'Silver Tier',
      goldCount: 'Gold Tier',
      monthlyRevenueEstimate: 'Estimated MRR',
    },
    tenants: {
      title: 'Tenants & Subscription Management',
      subtitle: 'Onboard new venues, manage tiers, retrieve onboarding kits, and toggle status.',
      addNew: 'Add New Tenant',
      searchPlaceholder: 'Search by venue name, slug, or phone...',
      allTiers: 'All Tiers',
      allStatuses: 'All Statuses',
      columns: {
        cafe: 'Venue & Slug',
        tier: 'Tier',
        status: 'Status',
        pin: 'Cashier PIN',
        expiresAt: 'Expires At',
        actions: 'Actions',
      },
      actions: {
        onboardingKit: 'Onboarding Kit & Links',
        edit: 'Edit Details & Tier',
        menuBuilder: 'Manage Digital Menu',
        suspend: 'Suspend Account',
        activate: 'Activate Account',
        delete: 'Delete',
        openCashier: 'Open Cashier',
        openMenu: 'Preview Menu',
      },
      badges: {
        active: 'Active',
        trial: 'Trial',
        expired: 'Expired',
        suspended: 'Suspended',
      },
    },
    onboardingKit: {
      title: 'Tenant Welcome & Onboarding Kit',
      subtitle: 'Copy and send this message to the venue owner immediately after activation.',
      copyAll: 'Copy Entire Message',
      copied: 'Copied to clipboard!',
      cashierUrl: 'Cashier Dashboard URL:',
      qrKitUrl: 'Table QR & Stand Printable Kit:',
      menuUrl: 'Customer Digital Menu URL:',
      pinCode: 'Secret Cashier PIN Code:',
      whatsappShare: 'Send via WhatsApp to Owner',
      close: 'Close',
    },
    tenantWizard: {
      createTitle: 'Onboard New Venue / Office',
      editTitle: 'Edit Venue Details & Subscription',
      basicInfo: 'Basic Venue Information',
      nameLabel: 'Venue Name',
      namePlaceholder: 'e.g. Nedaa Signature Lounge',
      slugLabel: 'Custom Slug',
      slugPlaceholder: 'nedaa-lounge',
      tierLabel: 'Subscription Tier',
      modeLabel: 'Operating Mode',
      pinLabel: 'Cashier PIN Code (4 Digits)',
      ownerInfo: 'Owner & Support Details',
      ownerNameLabel: 'Owner / Manager Name',
      ownerPhoneLabel: 'Owner Phone / WhatsApp',
      ownerEmailLabel: 'Correspondence Email',
      subscriptionPeriod: 'Subscription Duration',
      expiresAtLabel: 'Expiration Date',
      brandingTitle: 'Visual Branding (Gold Tier Only)',
      googleMapsUrl: 'Google Maps Review URL',
      logoUrl: 'Logo Image URL',
      primaryColor: 'Primary Accent Color (Hex)',
      save: 'Save Venue',
      cancel: 'Cancel',
      saving: 'Saving...',
    },
    crm: {
      title: 'Customer Relationship Hub (CRM)',
      subtitle: 'Follow up with cafe owners, log support interactions, and inspect live pager queues.',
      searchPlaceholder: 'Search tenant owner directory...',
      ownerDirectory: 'Venue Owner Directory',
      callOwner: 'Call / WhatsApp',
      emailOwner: 'Send Email',
      logNote: 'Add Follow-up Note',
      viewNotes: 'Support History',
      activeQueue: 'Inspect Live Queue',
      diagnostics: 'Pager Diagnostics',
      noteAuthor: 'Staff Member:',
      noteType: 'Category:',
      noteContent: 'Note Details:',
      addNoteTitle: 'Log Support / Follow-up Note',
      saveNote: 'Save Note to History',
      types: {
        general: 'General',
        support: 'Technical Support',
        billing: 'Subscription & Billing',
        onboarding: 'Onboarding & Training',
      },
    },
    staff: {
      title: 'Staff & Role-Based Access Control (RBAC)',
      subtitle: 'Add platform team members, assign operational roles, and toggle granular permissions.',
      addNew: 'Add Team Member',
      columns: {
        member: 'Staff Member / Email',
        role: 'Role',
        permissions: 'Granted Permissions',
        status: 'Status',
        lastLogin: 'Last Login',
        actions: 'Actions',
      },
      roles: {
        super_admin: 'Platform Owner (Super Admin)',
        onboarding_staff: 'Onboarding Staff',
        support_agent: 'Customer Support Agent',
      },
      permissions: {
        can_create_tenant: 'Can Create Tenants',
        can_edit_tier: 'Can Edit Tiers',
        can_suspend_tenant: 'Can Suspend Tenants',
        can_manage_menu: 'Can Manage Menus',
        can_view_crm: 'Can View & Log CRM',
        can_manage_staff: 'Can Manage Staff & Roles',
      },
      active: 'Active',
      disabled: 'Disabled',
      editMember: 'Edit Permissions',
      save: 'Save Changes',
      cancel: 'Cancel',
    },
    menuModal: {
      title: 'Digital Menu & Product Management',
      categories: 'Menu Categories',
      items: 'Menu Products',
      addCategory: 'Add Category',
      addItem: 'Add Product',
      categoryNameAr: 'Category Name (Arabic)',
      categoryNameId: 'Category Name (Indonesian)',
      categoryNameEn: 'Category Name (English)',
      itemNameAr: 'Product Name (Arabic)',
      itemNameId: 'Product Name (Indonesian)',
      itemNameEn: 'Product Name (English)',
      price: 'Unit Price',
      available: 'Available for Ordering',
      save: 'Save Changes',
      cancel: 'Cancel',
      close: 'Close Menu',
    },
  },
};
