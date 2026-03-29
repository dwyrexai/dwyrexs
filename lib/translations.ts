export type Lang = 'en' | 'tr';

export const translations = {
  en: {
    nav: {
      howItWorks: 'How It Works',
      calculator: 'Calculator',
      gpuPricing: 'GPU Pricing',
      listFacility: 'List Facility',
      rentGpus: 'Rent GPUs',
      blog: 'Blog',
      contact: 'Contact',
      getStarted: 'Get Started'
    },
    hero: {
      subtitle: 'Transform idle mining infrastructure into profitable AI compute centers.',
      highlight: 'The King of Compute',
      calcBtn: 'Calculate Profit',
      contactBtn: 'Contact Us'
    },
    stats: [
      { i: '🌍', n: 'Global', l: 'Network' },
      { i: '⚡', n: '99.9%', l: 'Uptime' },
      { i: '🔒', n: 'Enterprise', l: 'Security' },
      { i: '💎', n: 'Premium', l: 'Support' }
    ],
    problem: {
      title: 'The Problem',
      titleGold: 'vs The Solution',
      miningTitle: 'Traditional Mining',
      mining: ['High electricity costs', 'Hardware depreciation', 'Network difficulty increases', 'Low profitability'],
      dwyrexTitle: 'DWYREX Model',
      dwyrex: ['Zero electricity cost', 'Guaranteed rental income', 'AI market demand surge', 'Passive revenue stream']
    },
    how: {
      title: 'How It',
      titleGold: 'Works',
      steps: [
        { s: '01', i: '📋', t: 'Apply', d: 'Submit your facility or GPU rental request.' },
        { s: '02', i: '🔍', t: 'Verify', d: 'Our team verifies your hardware and location.' },
        { s: '03', i: '🤝', t: 'Agreement', d: 'Sign a secure, transparent rental contract.' },
        { s: '04', i: '🚀', t: 'Deploy', d: 'We connect your GPUs to our AI compute network.' },
        { s: '05', i: '💰', t: 'Earn', d: 'Receive monthly payouts automatically.' }
      ]
    },
    calc: {
      title: 'Profit',
      titleGold: 'Calculator',
      gpuType: 'Select GPU Model',
      gpuCount: 'Number of GPUs',
      miningLabel: 'Traditional Mining Loss',
      dwyrexLabel: 'DWYREX Rental Income',
      annualLabel: 'Annual Projected Revenue'
    },
    pricing: {
      title: 'GPU',
      titleGold: 'Pricing',
      subtitle: 'Compare our rates with major cloud providers. Save up to 70%.'
    },
    trust: {
      title: 'Why',
      titleGold: 'Trust Us',
      items: [
        { i: '🛡️', t: 'Secure Contracts', d: 'Legally binding agreements with transparent terms.' },
        { i: '⚡', t: 'Instant Payouts', d: 'Monthly automated payments directly to your account.' },
        { i: '🌐', t: 'Global Network', d: 'Connected to top AI research and enterprise clients.' },
        { i: '🔧', t: '24/7 Support', d: 'Dedicated technical and account management team.' }
      ]
    },
    subscribe: {
      title: 'Stay',
      titleGold: 'Updated',
      subtitle: 'Get the latest AI compute market insights and rental opportunities.',
      placeholder: 'Enter your email',
      btn: 'Subscribe',
      success: 'Thank you! You have been subscribed successfully.'
    },
    facilityForm: {
      title: 'List Your',
      titleGold: 'Facility',
      subtitle: 'Turn your idle mining farm into a profitable AI data center.',
      ownerName: 'Owner Name',
      ownerEmail: 'Owner Email',
      ownerPhone: 'Owner Phone',
      country: 'Country',
      city: 'City',
      gpuType: 'GPU Type',
      gpuCount: 'GPU Count',
      gpuCondition: 'GPU Condition',
      electricityCost: 'Electricity Cost ($/kWh)',
      coolingQ: 'Cooling System?',
      internetQ: 'High-Speed Internet?',
      yes: 'Yes',
      no: 'No',
      facilitySize: 'Facility Size (sqm)',
      rentExpect: 'Monthly Rent Expectation ($)',
      notes: 'Additional Notes',
      submit: 'Submit Application',
      submitting: 'Submitting...',
      successTitle: 'Application Received',
      successSub: 'Our team will review your facility and contact you within 24 hours.'
    },
    rentForm: {
      title: 'Rent',
      titleGold: 'GPUs',
      subtitle: 'Access high-performance GPUs for your AI workloads at competitive rates.',
      company: 'Company Name',
      contact: 'Contact Name',
      email: 'Email',
      phone: 'Phone',
      gpuType: 'GPU Type Needed',
      gpuCount: 'GPU Count Needed',
      usage: 'Usage Type',
      usageOptions: [
        { v: 'ai_training', l: 'AI Training' },
        { v: 'inference', l: 'Inference' },
        { v: 'rendering', l: '3D Rendering' },
        { v: 'other', l: 'Other' }
      ],
      budget: 'Budget Range',
      budgetOptions: [
        { v: '1k-5k', l: '$1,000 - $5,000' },
        { v: '5k-20k', l: '$5,000 - $20,000' },
        { v: '20k+', l: '$20,000+' }
      ],
      duration: 'Rental Duration',
      durationOptions: [
        { v: '1-3m', l: '1-3 Months' },
        { v: '3-6m', l: '3-6 Months' },
        { v: '6-12m', l: '6-12 Months' },
        { v: '12m+', l: '12+ Months' }
      ],
      notes: 'Project Details / Notes',
      submit: 'Request Quote',
      submitting: 'Sending...',
      successTitle: 'Request Submitted',
      successSub: 'We will prepare a custom quote and contact you shortly.'
    },
    contact: {
      title: 'Contact',
      titleGold: 'Us',
      subtitle: 'Have questions? Reach out to our team.',
      name: 'Your Name',
      email: 'Your Email',
      phone: 'Phone Number',
      typeOptions: ['General Inquiry', 'Facility Listing', 'GPU Rental', 'Partnership', 'Support'],
      message: 'Your Message',
      submit: 'Send Message',
      submitting: 'Sending...',
      successTitle: 'Message Sent',
      successSub: 'Thank you! We will get back to you within 24 hours.'
    },
    footer: {
      tagline: 'THE KING OF COMPUTE'
    }
  },
  tr: {
    nav: {
      howItWorks: 'Nasıl Çalışır',
      calculator: 'Hesaplayıcı',
      gpuPricing: 'GPU Fiyatları',
      listFacility: 'Tesis Listele',
      rentGpus: 'GPU Kirala',
      blog: 'Blog',
      contact: 'İletişim',
      getStarted: 'Başlayın'
    },
    hero: {
      subtitle: 'Boşta kalan madencilik altyapısını kârlı AI hesaplama merkezlerine dönüştürün.',
      highlight: 'Hesaplamanın Kralı',
      calcBtn: 'Kârı Hesapla',
      contactBtn: 'Bize Ulaşın'
    },
    stats: [
      { i: '🌍', n: 'Global', l: 'Ağ' },
      { i: '⚡', n: '%99.9', l: 'Çalışma Süresi' },
      { i: '🔒', n: 'Kurumsal', l: 'Güvenlik' },
      { i: '💎', n: 'Premium', l: 'Destek' }
    ],
    problem: {
      title: 'Sorun',
      titleGold: 'vs Çözüm',
      miningTitle: 'Geleneksel Madencilik',
      mining: ['Yüksek elektrik maliyetleri', 'Donanım değer kaybı', 'Artan ağ zorluğu', 'Düşük kârlılık'],
      dwyrexTitle: 'DWYREX Modeli',
      dwyrex: ['Sıfır elektrik maliyeti', 'Garantili kira geliri', 'AI pazar talebi artışı', 'Pasif gelir akışı']
    },
    how: {
      title: 'Nasıl',
      titleGold: 'Çalışır',
      steps: [
        { s: '01', i: '📋', t: 'Başvuru', d: 'Tesis veya GPU kiralama talebinizi gönderin.' },
        { s: '02', i: '🔍', t: 'Doğrulama', d: 'Ekibimiz donanımınızı ve konumunuzu doğrular.' },
        { s: '03', i: '🤝', t: 'Sözleşme', d: 'Güvenli ve şeffaf bir kira sözleşmesi imzalayın.' },
        { s: '04', i: '🚀', t: 'Dağıtım', d: 'GPU\'larınızı AI hesaplama ağımıza bağlarız.' },
        { s: '05', i: '💰', t: 'Kazanç', d: 'Aylık ödemeleri otomatik olarak alın.' }
      ]
    },
    calc: {
      title: 'Kâr',
      titleGold: 'Hesaplayıcı',
      gpuType: 'GPU Modeli Seçin',
      gpuCount: 'GPU Adedi',
      miningLabel: 'Geleneksel Madencilik Zararı',
      dwyrexLabel: 'DWYREX Kira Geliri',
      annualLabel: 'Yıllık Tahmini Gelir'
    },
    pricing: {
      title: 'GPU',
      titleGold: 'Fiyatlandırma',
      subtitle: 'Oranlarımızı büyük bulut sağlayıcılarla karşılaştırın. %70\'e varan tasarruf.'
    },
    trust: {
      title: 'Neden',
      titleGold: 'Güvenin',
      items: [
        { i: '🛡️', t: 'Güvenli Sözleşmeler', d: 'Şeffaf koşullarla yasal bağlayıcı anlaşmalar.' },
        { i: '⚡', t: 'Anında Ödemeler', d: 'Hesabınıza doğrudan aylık otomatik ödemeler.' },
        { i: '🌐', t: 'Global Ağ', d: 'En iyi AI araştırma ve kurumsal müşterilere bağlı.' },
        { i: '🔧', t: '7/24 Destek', d: 'Özel teknik ve hesap yönetim ekibi.' }
      ]
    },
    subscribe: {
      title: 'Güncel',
      titleGold: 'Kalın',
      subtitle: 'AI hesaplama pazarı içgörüleri ve kiralama fırsatları için abone olun.',
      placeholder: 'E-posta adresinizi girin',
      btn: 'Abone Ol',
      success: 'Teşekkürler! Başarıyla abone oldunuz.'
    },
    facilityForm: {
      title: 'Tesisinizi',
      titleGold: 'Listeleyin',
      subtitle: 'Boşta kalan madencilik çiftliğinizi kârlı bir AI veri merkezine dönüştürün.',
      ownerName: 'Sahip Adı',
      ownerEmail: 'Sahip E-posta',
      ownerPhone: 'Sahip Telefon',
      country: 'Ülke',
      city: 'Şehir',
      gpuType: 'GPU Tipi',
      gpuCount: 'GPU Adedi',
      gpuCondition: 'GPU Durumu',
      electricityCost: 'Elektrik Maliyeti ($/kWh)',
      coolingQ: 'Soğutma Sistemi?',
      internetQ: 'Yüksek Hızlı İnternet?',
      yes: 'Evet',
      no: 'Hayır',
      facilitySize: 'Tesis Büyüklüğü (m²)',
      rentExpect: 'Aylık Kira Beklentisi ($)',
      notes: 'Ek Notlar',
      submit: 'Başvuruyu Gönder',
      submitting: 'Gönderiliyor...',
      successTitle: 'Başvuru Alındı',
      successSub: 'Ekibimiz tesisinizi inceleyecek ve 24 saat içinde sizinle iletişime geçecek.'
    },
    rentForm: {
      title: 'GPU',
      titleGold: 'Kiralayın',
      subtitle: 'AI iş yükleriniz için rekabetçi oranlarla yüksek performanslı GPU\'lara erişin.',
      company: 'Şirket Adı',
      contact: 'İletişim Kişisi',
      email: 'E-posta',
      phone: 'Telefon',
      gpuType: 'İstenen GPU Tipi',
      gpuCount: 'İstenen GPU Adedi',
      usage: 'Kullanım Türü',
      usageOptions: [
        { v: 'ai_training', l: 'AI Eğitimi' },
        { v: 'inference', l: 'Çıkarım' },
        { v: 'rendering', l: '3D Render' },
        { v: 'other', l: 'Diğer' }
      ],
      budget: 'Bütçe Aralığı',
      budgetOptions: [
        { v: '1k-5k', l: '$1,000 - $5,000' },
        { v: '5k-20k', l: '$5,000 - $20,000' },
        { v: '20k+', l: '$20,000+' }
      ],
      duration: 'Kiralama Süresi',
      durationOptions: [
        { v: '1-3m', l: '1-3 Ay' },
        { v: '3-6m', l: '3-6 Ay' },
        { v: '6-12m', l: '6-12 Ay' },
        { v: '12m+', l: '12+ Ay' }
      ],
      notes: 'Proje Detayları / Notlar',
      submit: 'Teklif İste',
      submitting: 'Gönderiliyor...',
      successTitle: 'Talep Gönderildi',
      successSub: 'Özel bir teklif hazırlayıp sizinle kısa sürede iletişime geçeceğiz.'
    },
    contact: {
      title: 'Bize',
      titleGold: 'Ulaşın',
      subtitle: 'Sorularınız mı var? Ekibimizle iletişime geçin.',
      name: 'Adınız',
      email: 'E-posta Adresiniz',
      phone: 'Telefon Numaranız',
      typeOptions: ['Genel Soru', 'Tesis Listeleme', 'GPU Kiralama', 'İş Birliği', 'Destek'],
      message: 'Mesajınız',
      submit: 'Mesaj Gönder',
      submitting: 'Gönderiliyor...',
      successTitle: 'Mesaj Gönderildi',
      successSub: 'Teşekkürler! 24 saat içinde size dönüş yapacağız.'
    },
    footer: {
      tagline: 'HESAPLAMANIN KRALI'
    }
  }
};