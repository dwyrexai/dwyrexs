'use client';
import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

type Lang = 'en' | 'tr' | 'de' | 'fr' | 'ar' | 'ja' | 'ko';

const blogTranslations = {
  en: { title: 'DWYREX Blog', subtitle: 'Insights on AI, GPU computing, and the future of infrastructure', tag1: 'FEATURED ARTICLE — 2025', tag2: 'GUIDE — 2025', tag3: 'MARKET ANALYSIS — 2025', readMore: 'GET STARTED →', by: 'By', read: 'min read' },
  tr: { title: 'DWYREX Blog', subtitle: 'Yapay zeka, GPU hesaplama ve altyapının geleceği hakkında içgörüler', tag1: 'ÖNE ÇIKAN MAKALE — 2025', tag2: 'REHBER — 2025', tag3: 'PAZAR ANALİZİ — 2025', readMore: 'BAŞLA →', by: 'Yazan', read: 'dk okuma' },
  de: { title: 'DWYREX Blog', subtitle: 'Einblicke in KI, GPU-Computing und die Zukunft der Infrastruktur', tag1: 'FEATURED ARTIKEL — 2025', tag2: 'LEITFADEN — 2025', tag3: 'MARKTANALYSE — 2025', readMore: 'LOSLEGEN →', by: 'Von', read: 'Min Lesen' },
  fr: { title: 'DWYREX Blog', subtitle: 'Perspectives sur l\'IA, le calcul GPU et l\'avenir de l\'infrastructure', tag1: 'ARTICLE VEDETTE — 2025', tag2: 'GUIDE — 2025', tag3: 'ANALYSE DE MARCHE — 2025', readMore: 'COMMENCER →', by: 'Par', read: 'min de lecture' },
  ar: { title: 'مدونة DWYREX', subtitle: 'رؤى حول الذكاء الاصطناعي وحوسبة GPU ومستقبل البنية التحتية', tag1: 'مقال مميز — 2025', tag2: 'دليل — 2025', tag3: 'تحليل السوق — 2025', readMore: 'ابدأ الآن ←', by: 'بقلم', read: 'دقيقة قراءة' },
  ja: { title: 'DWYREXブログ', subtitle: 'AI、GPUコンピューティング、インフラの未来についての洞察', tag1: '注目記事 — 2025', tag2: 'ガイド — 2025', tag3: '市場分析 — 2025', readMore: '始める →', by: '著者', read: '分で読めます' },
  ko: { title: 'DWYREX 블로그', subtitle: 'AI, GPU 컴퓨팅 및 인프라의 미래에 대한 인사이트', tag1: '추천 기사 — 2025', tag2: '가이드 — 2025', tag3: '시장 분석 — 2025', readMore: '시작하기 →', by: '작성자', read: '분 읽기' },
};

const articles = {
  en: [
    { tag: 'FEATURED ARTICLE — 2025', title: 'Why Idle Mining Farms Are the', titleGold: 'Most Valuable Assets in AI Right Now', author: 'DWYREX Team', readTime: '8 min read', paragraphs: ['The AI industry has a massive problem: there aren\'t enough GPUs. While companies like OpenAI, Google, and Meta are spending billions on GPU infrastructure, thousands of perfectly capable GPUs are sitting idle in cryptocurrency mining facilities around the world.', 'The global AI market is projected to reach $2.5 trillion by 2030. Amazon Web Services currently has a 6+ month waitlist for GPU instances. Meanwhile, the cryptocurrency mining industry is experiencing its worst downturn in years.', 'At DWYREX, we connect two desperate markets: mining facility owners with idle GPUs, and AI companies who need GPU compute power at 60-70% lower cost than AWS. CoreWeave, which started as a mining operation, pivoted to AI and is now valued at over $35 billion — proving this model works.'] },
    { tag: 'GUIDE — 2025', title: 'How to Convert Your Mining Farm Into an', titleGold: 'AI Compute Center', author: 'DWYREX Team', readTime: '6 min read', paragraphs: ['Converting a cryptocurrency mining farm into an AI compute center is simpler than most people think. The hardware is largely compatible — the main changes are in software configuration, networking, and management infrastructure.', 'The key metric is VRAM. For most AI applications, you need at minimum 10GB VRAM per GPU. RTX 3080 (10GB) and above are ideal. You\'ll also need at minimum 1Gbps symmetric connectivity.', 'The good news: DWYREX handles all software configuration for you. You provide the hardware and power — we handle the rest. Our team completes final configuration within 48 hours.'] },
    { tag: 'MARKET ANALYSIS — 2025', title: 'GPU Rental Market:', titleGold: 'Why Prices Will Stay High Until 2027', author: 'DWYREX Research', readTime: '5 min read', paragraphs: ['The GPU rental market is experiencing unprecedented demand driven by the AI revolution. NVIDIA\'s manufacturing capacity is the primary bottleneck — TSMC is operating at near-100% capacity.', 'AI model training compute requirements are doubling every 6 months. GPU rental prices are expected to increase 15-25% annually through 2027. Facility owners partnering with DWYREX today are positioned to benefit significantly.', 'By partnering with DWYREX now, facility owners lock in long-term contracts. As market rates increase, your guaranteed payments increase with them. Early partners get priority placement in our growing client network.'] },
  ],
  tr: [
    { tag: 'ÖNE ÇIKAN MAKALE — 2025', title: 'Neden Boşta Duran Madencilik Çiftlikleri', titleGold: 'Yapay Zekada En Değerli Varlıklar', author: 'DWYREX Ekibi', readTime: '8 dk okuma', paragraphs: ['Yapay zeka sektörünün büyük bir sorunu var: yeterli GPU yok. OpenAI, Google ve Meta gibi şirketler GPU altyapısına milyarlar harcarken, kripto madenciliği tesislerinde binlerce GPU boşta duruyor.', 'Küresel yapay zeka pazarının 2030 yılına kadar 2,5 trilyon dolara ulaşması bekleniyor. AWS\'nin GPU instance\'ları için 6+ aylık bekleme listesi var. Bu arada kripto madenciliği en kötü dönemini yaşıyor.', 'DWYREX olarak iki çaresiz pazarı bir araya getiriyoruz: boşta GPU\'su olan madencilik tesis sahipleri ve AWS fiyatlarının yüzde 60-70 altında işlem gücüne ihtiyaç duyan yapay zeka şirketleri.'] },
    { tag: 'REHBER — 2025', title: 'Madencilik Çiftliğinizi Nasıl', titleGold: 'Yapay Zeka Hesaplama Merkezine Dönüştürürsünüz', author: 'DWYREX Ekibi', readTime: '6 dk okuma', paragraphs: ['Bir kripto madenciliği çiftliğini yapay zeka hesaplama merkezine dönüştürmek çoğu insanın düşündüğünden çok daha basit. Donanım büyük ölçüde uyumlu — temel değişiklikler yazılım yapılandırması ve ağ altyapısında.', 'Temel ölçüt VRAM\'dir. Çoğu yapay zeka uygulaması için GPU başına en az 10 GB VRAM gerekir. RTX 3080 ve üzeri idealdir. Ayrıca en az 1 Gbps simetrik bağlantı gereklidir.', 'İyi haber şu: DWYREX tüm yazılım yapılandırmasını sizin için halleder. Siz donanımı ve gücü sağlarsınız, gerisini biz hallederiz.'] },
    { tag: 'PAZAR ANALİZİ — 2025', title: 'GPU Kiralama Pazarı:', titleGold: 'Fiyatlar 2027\'ye Kadar Neden Yüksek Kalacak', author: 'DWYREX Araştırma', readTime: '5 dk okuma', paragraphs: ['GPU kiralama pazarı yapay zeka devrimi tarafından yönlendirilen benzeri görülmemiş bir talep yaşıyor. NVIDIA\'nın üretim kapasitesi temel darboğaz — TSMC neredeyse tam kapasitede çalışıyor.', 'Yapay zeka model eğitimi hesaplama gereksinimleri her 6 ayda bir ikiye katlanıyor. GPU kiralama fiyatlarının 2027\'ye kadar yıllık yüzde 15-25 artması bekleniyor.', 'DWYREX ile şimdi ortaklık kurarak tesis sahipleri uzun vadeli sözleşmeler yapabiliyor. Piyasa fiyatları arttıkça garantili ödemeleriniz de artıyor.'] },
  ],
  de: [
    { tag: 'FEATURED ARTIKEL — 2025', title: 'Warum Leerlaufende Mining-Farmen die', titleGold: 'Wertvollsten KI-Assets sind', author: 'DWYREX Team', readTime: '8 Min Lesen', paragraphs: ['Die KI-Branche hat ein massives Problem: Es gibt nicht genug GPUs. Während Unternehmen wie OpenAI, Google und Meta Milliarden in GPU-Infrastruktur investieren, stehen Tausende von GPUs in Krypto-Mining-Anlagen leer.', 'Der globale KI-Markt soll bis 2030 2,5 Billionen Dollar erreichen. AWS hat eine 6+ monatige Warteliste für GPU-Instanzen. Gleichzeitig erlebt das Krypto-Mining seinen schlimmsten Abschwung.', 'Bei DWYREX verbinden wir zwei verzweifelte Märkte: Mining-Anlagenbetreiber mit leerlaufenden GPUs und KI-Unternehmen, die GPU-Rechenleistung zu 60-70% unter AWS-Preisen benötigen.'] },
    { tag: 'LEITFADEN — 2025', title: 'So wandeln Sie Ihre Mining-Farm in ein', titleGold: 'KI-Rechenzentrum um', author: 'DWYREX Team', readTime: '6 Min Lesen', paragraphs: ['Eine Krypto-Mining-Farm in ein KI-Rechenzentrum umzuwandeln ist einfacher als die meisten denken. Die Hardware ist weitgehend kompatibel — die Hauptänderungen liegen in der Software-Konfiguration und dem Netzwerk.', 'Die wichtigste Kennzahl ist VRAM. Für die meisten KI-Anwendungen benötigen Sie mindestens 10 GB VRAM pro GPU. RTX 3080 und höher sind ideal.', 'Die gute Nachricht: DWYREX übernimmt die gesamte Software-Konfiguration für Sie. Sie stellen die Hardware und den Strom bereit — wir kümmern uns um den Rest.'] },
    { tag: 'MARKTANALYSE — 2025', title: 'GPU-Mietmarkt:', titleGold: 'Warum die Preise bis 2027 hoch bleiben', author: 'DWYREX Forschung', readTime: '5 Min Lesen', paragraphs: ['Der GPU-Mietmarkt erlebt eine beispiellose Nachfrage durch die KI-Revolution. NVIDIAs Fertigungskapazität ist der primäre Engpass — TSMC arbeitet fast bei voller Kapazität.', 'Die Rechenanforderungen für KI-Modelltraining verdoppeln sich alle 6 Monate. GPU-Mietpreise sollen bis 2027 jährlich um 15-25% steigen.', 'Durch eine Partnerschaft mit DWYREX sichern sich Anlagenbetreiber langfristige Verträge. Wenn die Marktpreise steigen, steigen auch Ihre garantierten Zahlungen.'] },
  ],
  fr: [
    { tag: 'ARTICLE VEDETTE — 2025', title: 'Pourquoi les fermes de minage inactives sont les', titleGold: 'actifs les plus précieux dans l\'IA', author: 'Equipe DWYREX', readTime: '8 min de lecture', paragraphs: ['L\'industrie de l\'IA a un problème massif : il n\'y a pas assez de GPUs. Pendant que des entreprises comme OpenAI, Google et Meta dépensent des milliards en infrastructure GPU, des milliers de GPUs sont inactifs dans des installations de minage.', 'Le marché mondial de l\'IA devrait atteindre 2,5 billions de dollars d\'ici 2030. AWS a une liste d\'attente de 6+ mois pour les instances GPU.', 'Chez DWYREX, nous connectons deux marchés désespérés : les propriétaires d\'installations de minage avec des GPUs inactifs et les entreprises IA qui ont besoin de puissance de calcul GPU à 60-70% moins cher qu\'AWS.'] },
    { tag: 'GUIDE — 2025', title: 'Comment convertir votre ferme de minage en', titleGold: 'centre de calcul IA', author: 'Equipe DWYREX', readTime: '6 min de lecture', paragraphs: ['Convertir une ferme de minage de crypto en centre de calcul IA est plus simple que la plupart des gens ne le pensent. Le matériel est largement compatible.', 'La métrique clé est la VRAM. Pour la plupart des applications IA, vous avez besoin d\'au moins 10 Go de VRAM par GPU. RTX 3080 et supérieur sont idéaux.', 'La bonne nouvelle : DWYREX gère toute la configuration logicielle pour vous. Vous fournissez le matériel et l\'alimentation — nous gérons le reste.'] },
    { tag: 'ANALYSE DE MARCHE — 2025', title: 'Marché de location GPU :', titleGold: 'Pourquoi les prix resteront élevés jusqu\'en 2027', author: 'Recherche DWYREX', readTime: '5 min de lecture', paragraphs: ['Le marché de location GPU connaît une demande sans précédent due à la révolution de l\'IA. La capacité de fabrication de NVIDIA est le principal goulot d\'étranglement.', 'Les besoins en calcul pour l\'entraînement des modèles IA doublent tous les 6 mois. Les prix de location GPU devraient augmenter de 15-25% par an jusqu\'en 2027.', 'En s\'associant avec DWYREX maintenant, les propriétaires d\'installations obtiennent des contrats à long terme. À mesure que les prix du marché augmentent, vos paiements garantis augmentent également.'] },
  ],
  ar: [
    { tag: 'مقال مميز — 2025', title: 'لماذا مزارع التعدين الخاملة هي', titleGold: 'أكثر الأصول قيمة في الذكاء الاصطناعي', author: 'فريق DWYREX', readTime: '8 دقائق قراءة', paragraphs: ['تواجه صناعة الذكاء الاصطناعي مشكلة ضخمة: لا توجد وحدات GPU كافية. بينما تنفق شركات مثل OpenAI وGoogle وMeta مليارات على البنية التحتية لـ GPU، تقف آلاف وحدات GPU بلا عمل في منشآت تعدين العملات المشفرة.', 'من المتوقع أن يصل سوق الذكاء الاصطناعي العالمي إلى 2.5 تريليون دولار بحلول 2030. تمتلك AWS قائمة انتظار تزيد على 6 أشهر لمثيلات GPU.', 'في DWYREX، نربط سوقين محتاجين: أصحاب منشآت التعدين ذات وحدات GPU الخاملة، وشركات الذكاء الاصطناعي التي تحتاج إلى قوة حوسبة GPU بتكلفة أقل بنسبة 60-70% من AWS.'] },
    { tag: 'دليل — 2025', title: 'كيفية تحويل مزرعة التعدين إلى', titleGold: 'مركز حوسبة ذكاء اصطناعي', author: 'فريق DWYREX', readTime: '6 دقائق قراءة', paragraphs: ['تحويل مزرعة تعدين العملات المشفرة إلى مركز حوسبة ذكاء اصطناعي أبسط مما يعتقد معظم الناس. الأجهزة متوافقة إلى حد كبير.', 'المقياس الرئيسي هو VRAM. لمعظم تطبيقات الذكاء الاصطناعي، تحتاج إلى 10 جيجابايت على الأقل من VRAM لكل GPU.', 'الخبر السار: يتولى DWYREX جميع تكوينات البرنامج نيابةً عنك. أنت توفر الأجهزة والطاقة — ونحن نتولى الباقي.'] },
    { tag: 'تحليل السوق — 2025', title: 'سوق تأجير GPU:', titleGold: 'لماذا ستظل الأسعار مرتفعة حتى 2027', author: 'أبحاث DWYREX', readTime: '5 دقائق قراءة', paragraphs: ['يشهد سوق تأجير GPU طلباً غير مسبوق مدفوعاً بثورة الذكاء الاصطناعي. طاقة تصنيع NVIDIA هي الاختناق الرئيسي.', 'تتضاعف متطلبات الحوسبة لتدريب نماذج الذكاء الاصطناعي كل 6 أشهر. من المتوقع أن ترتفع أسعار تأجير GPU بنسبة 15-25% سنوياً حتى 2027.', 'من خلال الشراكة مع DWYREX الآن، يحصل أصحاب المنشآت على عقود طويلة الأجل. مع ارتفاع أسعار السوق، ترتفع مدفوعاتك المضمونة أيضاً.'] },
  ],
  ja: [
    { tag: '注目記事 — 2025', title: 'なぜ遊休マイニング農場が', titleGold: 'AIで最も価値あるアセットなのか', author: 'DWYREXチーム', readTime: '8分で読めます', paragraphs: ['AI業界には深刻な問題があります：GPUが足りないのです。OpenAI、Google、MetaなどがGPUインフラに何十億もの投資をする一方、仮想通貨マイニング施設では何千ものGPUが遊休状態です。', 'グローバルAI市場は2030年までに2.5兆ドルに達すると予測されています。AWSにはGPUインスタンスの6ヶ月以上の待機リストがあります。', 'DWYREXでは、遊休GPUを持つマイニング施設オーナーと、AWSの60〜70%安でGPU計算能力を必要とするAI企業という、2つの切実な市場を繋いでいます。'] },
    { tag: 'ガイド — 2025', title: 'マイニング農場をAI計算センターに', titleGold: '変換する方法', author: 'DWYREXチーム', readTime: '6分で読めます', paragraphs: ['仮想通貨マイニング農場をAIコンピューティングセンターに変換することは、ほとんどの人が思うよりも簡単です。ハードウェアは大部分が互換性があります。', '重要な指標はVRAMです。ほとんどのAIアプリケーションでは、GPU1基あたり最低10GBのVRAMが必要です。RTX 3080以上が理想的です。', '朗報：DWYREXがすべてのソフトウェア設定を代行します。ハードウェアと電力を提供するだけで、残りは私たちが対応します。'] },
    { tag: '市場分析 — 2025', title: 'GPUレンタル市場：', titleGold: '2027年まで価格が高止まりする理由', author: 'DWYREX研究', readTime: '5分で読めます', paragraphs: ['GPUレンタル市場はAI革命に牽引され、前例のない需要を経験しています。NVIDIAの製造能力が主なボトルネックです。', 'AIモデルのトレーニング計算要件は6ヶ月ごとに倍増しています。GPUレンタル価格は2027年まで年間15〜25%上昇すると予測されています。', 'DWYREXと今すぐパートナーシップを結ぶことで、施設オーナーは長期契約を確保できます。市場価格が上昇するにつれ、保証支払いも増加します。'] },
  ],
  ko: [
    { tag: '추천 기사 — 2025', title: '유휴 채굴 농장이 왜', titleGold: 'AI에서 가장 가치 있는 자산인가', author: 'DWYREX 팀', readTime: '8분 읽기', paragraphs: ['AI 업계에는 심각한 문제가 있습니다: GPU가 부족합니다. OpenAI, Google, Meta 같은 기업들이 GPU 인프라에 수십억을 투자하는 동안, 수천 개의 GPU가 암호화폐 채굴 시설에서 유휴 상태입니다.', '글로벌 AI 시장은 2030년까지 2.5조 달러에 달할 것으로 예상됩니다. AWS는 GPU 인스턴스에 대해 6개월 이상의 대기자 명단을 보유하고 있습니다.', 'DWYREX는 유휴 GPU를 보유한 채굴 시설 소유자와 AWS보다 60-70% 저렴하게 GPU 컴퓨팅 파워가 필요한 AI 기업이라는 두 절박한 시장을 연결합니다.'] },
    { tag: '가이드 — 2025', title: '채굴 농장을 AI 컴퓨팅 센터로', titleGold: '전환하는 방법', author: 'DWYREX 팀', readTime: '6분 읽기', paragraphs: ['암호화폐 채굴 농장을 AI 컴퓨팅 센터로 전환하는 것은 대부분의 사람들이 생각하는 것보다 훨씬 간단합니다. 하드웨어는 대부분 호환됩니다.', '핵심 지표는 VRAM입니다. 대부분의 AI 애플리케이션에서는 GPU당 최소 10GB VRAM이 필요합니다. RTX 3080 이상이 이상적입니다.', '좋은 소식: DWYREX가 모든 소프트웨어 구성을 대신 처리합니다. 하드웨어와 전력을 제공하면 나머지는 저희가 처리합니다.'] },
    { tag: '시장 분석 — 2025', title: 'GPU 렌탈 시장:', titleGold: '2027년까지 가격이 높게 유지되는 이유', author: 'DWYREX 리서치', readTime: '5분 읽기', paragraphs: ['GPU 렌탈 시장은 AI 혁명으로 인한 전례 없는 수요를 경험하고 있습니다. NVIDIA의 제조 능력이 주요 병목 현상입니다.', 'AI 모델 훈련 컴퓨팅 요구사항은 6개월마다 두 배로 증가하고 있습니다. GPU 렌탈 가격은 2027년까지 연간 15-25% 상승할 것으로 예상됩니다.', 'DWYREX와 지금 파트너십을 맺으면 시설 소유자는 장기 계약을 확보합니다. 시장 가격이 오를수록 보장 지급액도 증가합니다.'] },
  ],
};

function CrownLogoNav() {
  return (
    <svg width="160" height="45" viewBox="0 0 400 100" style={{display:'block'}}>
      <defs>
        <linearGradient id="gN" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37"/><stop offset="100%" stopColor="#ffd700"/>
        </linearGradient>
        <filter id="glN"><feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <polygon points="160,18 167,5 174,12 180,0 186,10 192,0 198,12 205,5 212,18"
        fill="none" stroke="#ffd700" strokeWidth="1.2" strokeLinejoin="round" filter="url(#glN)"/>
      <line x1="160" y1="18" x2="212" y2="18" stroke="#ffd700" strokeWidth="1.2" filter="url(#glN)"/>
      <circle cx="180" cy="0" r="2" fill="#ffd700" filter="url(#glN)"/>
      <circle cx="192" cy="0" r="2" fill="#ffd700" filter="url(#glN)"/>
      <text x="70" y="62" fontFamily="Georgia,serif" fontSize="40" fontWeight="bold"
        fill="url(#gN)" letterSpacing="8" filter="url(#glN)">DWYREX</text>
    </svg>
  );
}

export default function Blog() {
  const [lang, setLang] = useState<Lang>('en');
  const gold = '#d4af37';
  const tx = blogTranslations[lang];
  const arts = articles[lang];

  useEffect(() => {
    const saved = localStorage.getItem('dwyrex_lang') as Lang;
    if (['en','tr','de','fr','ar','ja','ko'].includes(saved)) setLang(saved);
    supabase.from('page_views').insert({
      page: '/blog',
      referrer: document.referrer || 'direct',
      device: /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    });
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem('dwyrex_lang', l);
  }

  const dir = lang === 'ar' ? 'rtl' : 'ltr';

  return (
    <div style={{minHeight:'100vh',background:'#050508',color:'white',fontFamily:"'Segoe UI',system-ui,sans-serif"}} dir={dir}>

      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 40px',borderBottom:'1px solid rgba(212,175,55,0.08)',position:'sticky',top:0,background:'rgba(5,5,8,0.95)',backdropFilter:'blur(20px)',zIndex:100,flexWrap:'wrap',gap:'8px'}}>
        <a href="/" style={{textDecoration:'none'}}><CrownLogoNav/></a>
        <div style={{display:'flex',gap:'16px',alignItems:'center',flexWrap:'wrap'}}>
          <a href="/" style={{color:'#777',textDecoration:'none',fontSize:'13px'}}>Home</a>
          <a href="/blog" style={{color:gold,textDecoration:'none',fontSize:'13px'}}>Blog</a>
          <a href="/#contact" style={{color:'#777',textDecoration:'none',fontSize:'13px'}}>Contact</a>
          <div style={{display:'flex',gap:'2px',background:'rgba(255,255,255,0.04)',borderRadius:'8px',padding:'3px',border:'1px solid rgba(212,175,55,0.1)'}}>
            {(['en','tr','de','fr','ar','ja','ko'] as Lang[]).map(l => (
              <button key={l} onClick={() => switchLang(l)}
                style={{padding:'4px 10px',borderRadius:'6px',border:'none',cursor:'pointer',fontSize:'10px',fontWeight:'bold',
                  background: lang === l ? 'linear-gradient(135deg,#d4af37,#b8860b)' : 'transparent',
                  color: lang === l ? '#050508' : '#666'}}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>
          <a href="/#contact" style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'10px 24px',borderRadius:'6px',fontWeight:'bold',fontSize:'12px',textDecoration:'none',letterSpacing:'2px'}}>
            GET STARTED
          </a>
        </div>
      </nav>

      <header style={{textAlign:'center',padding:'80px 20px 40px',maxWidth:'800px',margin:'0 auto'}}>
        <h1 style={{fontSize:'40px',fontFamily:'Georgia,serif',letterSpacing:'4px',marginBottom:'16px'}}>
          <span style={{color:gold}}>DWYREX</span> {lang === 'ar' ? 'مدونة' : lang === 'ja' ? 'ブログ' : lang === 'ko' ? '블로그' : 'Blog'}
        </h1>
        <p style={{color:'#666',fontSize:'16px'}}>{tx.subtitle}</p>
      </header>

      <main style={{maxWidth:'800px',margin:'0 auto',padding:'0 20px 100px'}}>
        {arts.map((article, idx) => (
          <article key={idx} style={{background:'rgba(212,175,55,0.02)',border:'1px solid rgba(212,175,55,0.08)',borderRadius:'20px',padding:'48px',marginBottom:'40px'}}>
            <div style={{color:gold,fontSize:'11px',letterSpacing:'4px',marginBottom:'16px'}}>{article.tag}</div>
            <h2 style={{fontSize:'28px',fontFamily:'Georgia,serif',lineHeight:'1.3',marginBottom:'20px'}}>
              {article.title} <span style={{color:gold}}>{article.titleGold}</span>
            </h2>
            <div style={{color:'#555',fontSize:'13px',marginBottom:'32px'}}>
              {tx.by} {article.author} · {article.readTime}
            </div>
            <div style={{color:'#aaa',fontSize:'16px',lineHeight:'1.9'}}>
              {article.paragraphs.map((p, i) => (
                <p key={i} style={{marginBottom:'20px'}}>{p}</p>
              ))}
            </div>
            <div style={{marginTop:'40px',textAlign:'center'}}>
              <a href="/#contact" style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'14px 32px',borderRadius:'8px',fontWeight:'bold',fontSize:'14px',textDecoration:'none',letterSpacing:'2px'}}>
                {tx.readMore}
              </a>
            </div>
          </article>
        ))}
      </main>

      <footer style={{textAlign:'center',padding:'40px 20px',borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <p style={{color:gold,fontSize:'12px',letterSpacing:'6px',fontFamily:'Georgia,serif'}}>DWYREX</p>
        <p style={{color:'#222',fontSize:'8px',letterSpacing:'3px',marginTop:'8px'}}>© 2025 DWYREX — THE KING OF COMPUTE</p>
      </footer>
    </div>
  );
}