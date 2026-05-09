'use client';
const gold = '#d4af37';

const gpuPrices = [
  { gpu: 'RTX 3090 (24GB)', dwyrex: '$0.35/hr', lambda: '$0.50/hr', vast: '$0.45/hr', aws: '$1.10/hr', save: '%68' },
  { gpu: 'RTX 4090 (24GB)', dwyrex: '$0.55/hr', lambda: '$0.80/hr', vast: '$0.75/hr', aws: '$1.80/hr', save: '%69' },
  { gpu: 'A100 (40GB)', dwyrex: '$1.49/hr', lambda: '$1.99/hr', vast: '$1.89/hr', aws: '$4.10/hr', save: '%64' },
  { gpu: 'H100 (80GB)', dwyrex: '$2.49/hr', lambda: '$3.50/hr', vast: '$3.20/hr', aws: '$8.00/hr', save: '%69' },
];

const features = [
  { feature: 'Türkçe Destek', dwyrex: true, lambda: false, vast: false, aws: false },
  { feature: 'KVKK Uyumu', dwyrex: true, lambda: false, vast: false, aws: false },
  { feature: 'Tesis Sahibi Programı', dwyrex: true, lambda: false, vast: true, aws: false },
  { feature: 'Garantili Ödeme', dwyrex: true, lambda: false, vast: false, aws: false },
  { feature: 'Dijital Sözleşme', dwyrex: true, lambda: true, vast: false, aws: true },
  { feature: '7/24 WhatsApp Destek', dwyrex: true, lambda: false, vast: false, aws: false },
  { feature: 'Özel Fiyatlandırma', dwyrex: true, lambda: false, vast: true, aws: true },
  { feature: 'GPU Monitoring', dwyrex: true, lambda: true, vast: true, aws: true },
  { feature: 'SSH Erişim', dwyrex: true, lambda: true, vast: true, aws: true },
  { feature: 'Referral Programı', dwyrex: true, lambda: false, vast: false, aws: false },
];

export default function Compare() {
  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 40px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '20px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '4px' }}>DWYREX</a>
        <a href="/#contact" style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '8px 20px', borderRadius: '6px', fontWeight: 'bold', fontSize: '12px', textDecoration: 'none', letterSpacing: '2px' }}>BAŞLA</a>
      </nav>

      <header style={{ textAlign: 'center', padding: '80px 20px 60px', maxWidth: '800px', margin: '0 auto' }}>
        <h1 style={{ fontSize: '40px', fontFamily: 'Georgia,serif', marginBottom: '16px' }}>
          DWYREX vs <span style={{ color: gold }}>Rakipler</span>
        </h1>
        <p style={{ color: '#666', fontSize: '16px' }}>Neden DWYREX? Rakiplerle tarafsız karşılaştırma.</p>
      </header>

      {/* PRICE TABLE */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 60px' }}>
        <h2 style={{ fontSize: '22px', fontFamily: 'Georgia,serif', marginBottom: '24px', textAlign: 'center' }}>
          💰 Fiyat <span style={{ color: gold }}>Karşılaştırması</span>
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                {['GPU', 'DWYREX', 'Lambda Labs', 'Vast.ai', 'AWS', 'Tasarruf'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: i === 0 ? 'left' : 'center', color: i === 1 ? gold : '#555', fontSize: '11px', letterSpacing: '2px', background: i === 1 ? 'rgba(212,175,55,0.05)' : 'transparent' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpuPrices.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '14px 16px', fontWeight: 'bold' }}>{row.gpu}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: gold, fontWeight: 'bold', fontSize: '15px', background: 'rgba(212,175,55,0.03)' }}>{row.dwyrex}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#777' }}>{row.lambda}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#777' }}>{row.vast}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#f87171', textDecoration: 'line-through' }}>{row.aws}</td>
                  <td style={{ padding: '14px 16px', textAlign: 'center', color: '#4ade80', fontWeight: 'bold' }}>{row.save}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <p style={{ color: '#333', fontSize: '11px', textAlign: 'center', marginTop: '12px' }}>* Fiyatlar yaklaşık olup piyasa koşullarına göre değişebilir. Son güncelleme: 2025</p>
      </div>

      {/* FEATURE TABLE */}
      <div style={{ maxWidth: '1000px', margin: '0 auto', padding: '0 20px 80px' }}>
        <h2 style={{ fontSize: '22px', fontFamily: 'Georgia,serif', marginBottom: '24px', textAlign: 'center' }}>
          ⚡ Özellik <span style={{ color: gold }}>Karşılaştırması</span>
        </h2>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.2)' }}>
                {['Özellik', 'DWYREX', 'Lambda Labs', 'Vast.ai', 'AWS'].map((h, i) => (
                  <th key={h} style={{ padding: '14px 16px', textAlign: i === 0 ? 'left' : 'center', color: i === 1 ? gold : '#555', fontSize: '11px', letterSpacing: '2px', background: i === 1 ? 'rgba(212,175,55,0.05)' : 'transparent' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {features.map((row, i) => (
                <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  <td style={{ padding: '12px 16px', color: '#aaa' }}>{row.feature}</td>
                  {[row.dwyrex, row.lambda, row.vast, row.aws].map((val, j) => (
                    <td key={j} style={{ padding: '12px 16px', textAlign: 'center', background: j === 0 ? 'rgba(212,175,55,0.03)' : 'transparent' }}>
                      {val ? <span style={{ color: '#4ade80', fontSize: '16px' }}>✓</span> : <span style={{ color: '#333', fontSize: '16px' }}>✗</span>}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* WHY DWYREX */}
      <div style={{ background: 'rgba(212,175,55,0.02)', borderTop: '1px solid rgba(212,175,55,0.06)', padding: '80px 20px' }}>
        <div style={{ maxWidth: '900px', margin: '0 auto' }}>
          <h2 style={{ textAlign: 'center', fontSize: '28px', fontFamily: 'Georgia,serif', marginBottom: '48px' }}>
            Neden <span style={{ color: gold }}>DWYREX?</span>
          </h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(250px,1fr))', gap: '20px' }}>
            {[
              { icon: '🇹🇷', title: 'Türkiye\'nin İlk GPU Aracısı', desc: 'KVKK uyumlu, Türkçe destek, yerel ödeme seçenekleri.' },
              { icon: '🤝', title: 'İki Taraflı Pazar', desc: 'Hem tesis sahiplerine hem kiracılara hizmet veren tek platform.' },
              { icon: '💰', title: 'Garantili Gelir', desc: 'Tesis sahipleri için garantili aylık ödeme — sıfır risk.' },
              { icon: '🚀', title: '48 Saatte Kurulum', desc: 'AWS\'nin 6+ aylık bekleme listesine karşın 48 saatte aktif.' },
            ].map((item, i) => (
              <div key={i} style={{ background: '#0a0a12', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '24px' }}>
                <div style={{ fontSize: '32px', marginBottom: '12px' }}>{item.icon}</div>
                <div style={{ color: gold, fontWeight: 'bold', fontSize: '15px', marginBottom: '8px' }}>{item.title}</div>
                <div style={{ color: '#777', fontSize: '13px', lineHeight: '1.6' }}>{item.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* CTA */}
      <div style={{ textAlign: 'center', padding: '80px 20px' }}>
        <h2 style={{ fontSize: '28px', fontFamily: 'Georgia,serif', marginBottom: '16px' }}>
          Hemen <span style={{ color: gold }}>Başla</span>
        </h2>
        <p style={{ color: '#666', marginBottom: '32px' }}>Ücretsiz değerleme — 48 saat içinde yanıt.</p>
        <a href="/#contact" style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '16px 48px', borderRadius: '8px', fontWeight: 'bold', fontSize: '15px', textDecoration: 'none', letterSpacing: '2px' }}>
          ÜCRETSİZ BAŞLA →
        </a>
      </div>

      <footer style={{ textAlign: 'center', padding: '32px', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
        <p style={{ color: gold, fontSize: '12px', letterSpacing: '6px', fontFamily: 'Georgia,serif' }}>DWYREX</p>
        <p style={{ color: '#222', fontSize: '9px', letterSpacing: '3px', marginTop: '8px' }}>© 2025 DWYREX — THE KING OF COMPUTE</p>
      </footer>
    </div>
  );
}