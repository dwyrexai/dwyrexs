'use client';
const gold = '#d4af37';

const caseStudies = [
  {
    company: 'TechAI Istanbul',
    logo: '🤖',
    type: 'GPU Kiracı',
    location: 'Istanbul, TR',
    gpu: 'RTX 4090 × 50',
    saving: '$62,500/yıl',
    quote: 'DWYREX ile AWS maliyetlerimizi %69 düşürdük. Aynı performans, çok daha düşük maliyet. Model eğitim sürelerimiz değişmedi.',
    author: 'Ahmet Y., CTO',
    results: ['AWS\'den %69 tasarruf', '48 saatte tam kurulum', 'SLA garantili uptime'],
  },
  {
    company: 'Mining Farm Ankara',
    logo: '⛏️',
    type: 'GPU Tesis Sahibi',
    location: 'Ankara, TR',
    gpu: 'RTX 3090 × 200',
    saving: '$50,400/yıl',
    quote: 'Madencilik artık zararda çalışıyordu. DWYREX ile aynı donanımdan garantili gelir elde ediyoruz. Ekibimiz kurulumu 2 günde tamamladı.',
    author: 'Mehmet K., Kurucu',
    results: ['Madencilik zararından çıkıldı', '$4,200/ay garantili gelir', '2 günde kurulum'],
  },
  {
    company: 'DataCenter Dubai',
    logo: '🌍',
    type: 'GPU Tesis Sahibi',
    location: 'Dubai, UAE',
    gpu: 'A100 × 30',
    saving: '$107,640/yıl',
    quote: 'BAE\'deki veri merkezimizin boş kapasitesini değerlendirdik. DWYREX ekibi profesyonel ve hızlıydı. Yüksek performanslı GPU\'larımız şimdi 7/24 çalışıyor.',
    author: 'Ahmed Al-R., CEO',
    results: ['Boş kapasite değerlendirildi', '%99.5 uptime garantisi', 'Uluslararası SLA'],
  },
];

const testimonials = [
  { text: 'GPU fiyatları AWS\'nin çok altında. Aynı iş yükünü çok daha ucuza çalıştırıyoruz.', author: 'ML Engineer, Berlin', rating: 5 },
  { text: 'Kurulum süreci çok kolaydı. DWYREX ekibi her adımda yanımızdaydı.', author: 'Startup Kurucu, Istanbul', rating: 5 },
  { text: 'Madencilikten AI\'ya geçiş kararı aldık, DWYREX bu geçişi çok kolaylaştırdı.', author: 'Tesis Sahibi, Ankara', rating: 5 },
  { text: 'SLA garantisi ve aylık raporlama sistemi çok profesyonel.', author: 'CTO, Dubai', rating: 5 },
  { text: 'WhatsApp desteği çok hızlı yanıt veriyor. 7/24 ulaşabiliyoruz.', author: 'AI Araştırmacı, Paris', rating: 5 },
  { text: 'Fiyat/performans oranı piyasanın en iyisi. Kesinlikle tavsiye ederim.', author: 'Data Scientist, Tokyo', rating: 5 },
];

export default function Customers() {
  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '20px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '4px' }}>DWYREX</a>
        <div style={{ display: 'flex', gap: '20px' }}>
          <a href="/" style={{ color: '#777', textDecoration: 'none', fontSize: '13px' }}>Ana Sayfa</a>
          <a href="/blog" style={{ color: '#777', textDecoration: 'none', fontSize: '13px' }}>Blog</a>
          <a href="/#contact" style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', textDecoration: 'none', letterSpacing: '2px' }}>BAŞLA</a>
        </div>
      </nav>

      {/* HERO */}
      <header style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontFamily: 'Georgia,serif', marginBottom: '16px' }}>
          Müşteri <span style={{ color: gold }}>Başarı Hikayeleri</span>
        </h1>
        <p style={{ color: '#666', fontSize: '16px', lineHeight: '1.7' }}>
          Dünya genelinde GPU tesis sahipleri ve AI şirketleri DWYREX ile nasıl büyüdü?
        </p>
      </header>

      {/* STATS */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '48px', padding: '32px 20px', flexWrap: 'wrap', borderTop: '1px solid rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.06)', maxWidth: '900px', margin: '0 auto 80px' }}>
        {[
          { n: '%70', l: 'Ortalama Tasarruf' },
          { n: '48S', l: 'Kurulum Süresi' },
          { n: '%99.5', l: 'Uptime Garantisi' },
          { n: '7/24', l: 'Destek' },
        ].map((s, i) => (
          <div key={i} style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '32px', fontWeight: 'bold', color: gold, fontFamily: 'Georgia,serif' }}>{s.n}</div>
            <div style={{ color: '#555', fontSize: '12px', letterSpacing: '1px', marginTop: '4px' }}>{s.l}</div>
          </div>
        ))}
      </div>

      {/* CASE STUDIES */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ textAlign: 'center', fontSize: '28px', fontFamily: 'Georgia,serif', marginBottom: '48px' }}>
          Vaka <span style={{ color: gold }}>Çalışmaları</span>
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '32px' }}>
          {caseStudies.map((cs, i) => (
            <div key={i} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '20px', padding: '40px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '20px' }}>
                  <div style={{ fontSize: '40px' }}>{cs.logo}</div>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '18px', color: gold }}>{cs.company}</div>
                    <div style={{ color: '#555', fontSize: '12px' }}>{cs.type} · {cs.location}</div>
                  </div>
                </div>
                <div style={{ background: 'rgba(212,175,55,0.05)', borderLeft: `3px solid ${gold}`, padding: '16px 20px', borderRadius: '0 10px 10px 0', marginBottom: '20px' }}>
                  <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.8', margin: 0, fontStyle: 'italic' }}>"{cs.quote}"</p>
                  <p style={{ color: gold, fontSize: '12px', marginTop: '10px', marginBottom: 0 }}>— {cs.author}</p>
                </div>
              </div>
              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
                  <div style={{ background: 'rgba(212,175,55,0.05)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#555', fontSize: '10px', marginBottom: '4px' }}>GPU</div>
                    <div style={{ color: gold, fontWeight: 'bold', fontSize: '13px' }}>{cs.gpu}</div>
                  </div>
                  <div style={{ background: 'rgba(74,222,128,0.05)', borderRadius: '10px', padding: '14px', textAlign: 'center' }}>
                    <div style={{ color: '#555', fontSize: '10px', marginBottom: '4px' }}>Tasarruf</div>
                    <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '13px' }}>{cs.saving}</div>
                  </div>
                </div>
                <h4 style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', marginBottom: '12px' }}>SONUÇLAR</h4>
                {cs.results.map((r, j) => (
                  <div key={j} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                    <div style={{ color: '#4ade80', fontSize: '14px' }}>✓</div>
                    <span style={{ color: '#aaa', fontSize: '13px' }}>{r}</span>
                  </div>
                ))}
                <a href="/#contact" style={{ display: 'inline-block', marginTop: '20px', background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '12px', textDecoration: 'none', letterSpacing: '2px' }}>
                  SİZ DE BAŞLAYIN →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* TESTIMONIALS */}
      <div style={{ background: 'rgba(212,175,55,0.02)', borderTop: '1px solid rgba(212,175,55,0.06)', borderBottom: '1px solid rgba(212,175,55,0.06)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '1000px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontFamily: 'Georgia,serif', marginBottom: '48px' }}>
            Kullanıcı <span style={{ color: gold }}>Yorumları</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(280px,1fr))', gap: '20px' }}>
            {testimonials.map((t, i) => (
              <div key={i} style={{ background: '#0a0a12', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ color: gold, fontSize: '18px', marginBottom: '12px' }}>{'★'.repeat(t.rating)}</div>
                <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.7', marginBottom: '16px', fontStyle: 'italic' }}>"{t.text}"</p>
                <p style={{ color: '#555', fontSize: '11px', margin: 0 }}>— {t.author}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '32px', fontFamily: 'Georgia,serif', marginBottom: '16px' }}>
          Siz de Bu <span style={{ color: gold }}>Başarının</span> Parçası Olun
        </h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>48 saat içinde ücretsiz değerleme alın.</p>
        <div style={{ display: 'flex', gap: '16px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/#facility-form" style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '16px 36px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', letterSpacing: '2px' }}>
            TESİSİMİ EKLE
          </a>
          <a href="/#rent-form" style={{ border: '1px solid rgba(212,175,55,0.4)', color: gold, padding: '16px 36px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', textDecoration: 'none', letterSpacing: '2px' }}>
            GPU KİRALA
          </a>
        </div>
      </div>

      <footer style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '6px', fontFamily: 'Georgia,serif' }}>DWYREX</p>
        <p style={{ color: '#222', fontSize: '9px', letterSpacing: '3px', marginTop: '8px' }}>© 2025 DWYREX — THE KING OF COMPUTE</p>
      </footer>
    </div>
  );
}