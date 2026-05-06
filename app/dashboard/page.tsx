'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { supabase } from '../../lib/supabase';

interface Customer {
  id: string;
  name: string;
  email: string;
  company: string;
  type: string;
  status: string;
  onboarding_step: number;
  created_at: string;
}

function DashboardContent() {
  const searchParams = useSearchParams();
  const token = searchParams.get('token');
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const gold = '#d4af37';

  useEffect(() => {
    if (token) loadCustomer();
    else setNotFound(true);
  }, [token]);

  async function loadCustomer() {
    const { data } = await supabase
      .from('customers')
      .select('*')
      .eq('dashboard_token', token)
      .single();
    if (data) setCustomer(data);
    else setNotFound(true);
    setLoading(false);
  }

  const facilitySteps = [
    { step: 1, icon: '📋', title: 'Başvuru Alındı', desc: 'Tesis bilgileriniz sistemimize kaydedildi.', done: true },
    { step: 2, icon: '🔍', title: 'Değerlendirme', desc: 'Ekibimiz GPU tesislerinizi inceliyor.', done: false },
    { step: 3, icon: '📞', title: 'Görüşme', desc: '48 saat içinde WhatsApp/telefon ile iletişim.', done: false },
    { step: 4, icon: '📝', title: 'Sözleşme', desc: 'Dijital sözleşme imzalama.', done: false },
    { step: 5, icon: '💰', title: 'Aktif & Kazanıyor', desc: 'Aylık garantili ödeme başlıyor.', done: false },
  ];

  const renterSteps = [
    { step: 1, icon: '📋', title: 'Talep Alındı', desc: 'GPU ihtiyacınız sisteme kaydedildi.', done: true },
    { step: 2, icon: '🔍', title: 'Eşleştirme', desc: 'Size uygun GPU\'lar aranıyor.', done: false },
    { step: 3, icon: '💬', title: 'Teklif', desc: '24 saat içinde fiyat teklifi sunulacak.', done: false },
    { step: 4, icon: '📝', title: 'Sözleşme', desc: 'SLA ve erişim bilgileri paylaşılacak.', done: false },
    { step: 5, icon: '🚀', title: 'GPU Erişimi Aktif', desc: 'SSH/Jupyter ile GPU\'larınıza erişin.', done: false },
  ];

  if (loading) return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ color: gold, letterSpacing: '4px', fontSize: '14px' }}>YÜKLENİYOR...</div>
    </div>
  );

  if (notFound) return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column', gap: '16px' }}>
      <div style={{ fontSize: '48px' }}>❌</div>
      <h2 style={{ color: gold, fontFamily: 'Georgia,serif' }}>Dashboard Bulunamadı</h2>
      <p style={{ color: '#555' }}>Geçersiz veya süresi dolmuş token.</p>
      <a href="/" style={{ color: gold, textDecoration: 'none' }}>← Ana Sayfaya Dön</a>
    </div>
  );

  const steps = customer?.type === 'facility' ? facilitySteps : renterSteps;

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
        <span style={{ color: '#555', fontSize: '13px' }}>Müşteri Portalı</span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* WELCOME */}
        <div style={{ background: 'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(0,0,0,0.3))', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '20px', padding: '32px', marginBottom: '32px', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>👑</div>
          <h1 style={{ color: gold, fontSize: '28px', fontFamily: 'Georgia,serif', marginBottom: '8px' }}>
            Hoş Geldiniz, {customer?.name}!
          </h1>
          <p style={{ color: '#777', fontSize: '14px' }}>
            {customer?.type === 'facility' ? '🏭 GPU Tesis Sahibi' : '🖥️ GPU Kiracı'} · {customer?.company || ''}
          </p>
          <div style={{ display: 'inline-block', marginTop: '12px', background: 'rgba(74,222,128,0.1)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '6px 16px' }}>
            <span style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>● Aktif</span>
          </div>
        </div>

        {/* PROGRESS */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '20px', padding: '32px', marginBottom: '24px' }}>
          <h2 style={{ color: gold, fontSize: '18px', fontFamily: 'Georgia,serif', marginBottom: '24px' }}>
            📋 Süreç Durumu
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
            {steps.map((s, i) => (
              <div key={s.step} style={{ display: 'flex', gap: '16px', alignItems: 'flex-start', position: 'relative' }}>
                {/* Line */}
                {i < steps.length - 1 && (
                  <div style={{ position: 'absolute', left: '19px', top: '40px', width: '2px', height: '40px', background: s.done ? gold : 'rgba(255,255,255,0.05)' }} />
                )}
                {/* Icon */}
                <div style={{ width: '40px', height: '40px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, fontSize: '16px', background: s.done ? `linear-gradient(135deg,${gold},#b8860b)` : 'rgba(255,255,255,0.05)', border: `2px solid ${s.done ? gold : 'rgba(255,255,255,0.1)'}` }}>
                  {s.done ? '✓' : s.icon}
                </div>
                <div style={{ paddingBottom: '32px' }}>
                  <div style={{ fontWeight: 'bold', color: s.done ? gold : '#777', fontSize: '15px' }}>{s.title}</div>
                  <div style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>{s.desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '24px' }}>
          <a href="/contract" style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.12)', borderRadius: '14px', padding: '20px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📝</div>
            <div style={{ color: gold, fontWeight: 'bold', marginBottom: '4px' }}>Sözleşme İmzala</div>
            <div style={{ color: '#555', fontSize: '12px' }}>Dijital sözleşmenizi imzalayın</div>
          </a>
          <a href="https://wa.me/905458701196" target="_blank" rel="noopener noreferrer" style={{ background: 'rgba(37,211,102,0.03)', border: '1px solid rgba(37,211,102,0.12)', borderRadius: '14px', padding: '20px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>💬</div>
            <div style={{ color: '#25D366', fontWeight: 'bold', marginBottom: '4px' }}>WhatsApp Destek</div>
            <div style={{ color: '#555', fontSize: '12px' }}>7/24 anlık destek</div>
          </a>
          <a href="/blog" style={{ background: 'rgba(96,165,250,0.03)', border: '1px solid rgba(96,165,250,0.12)', borderRadius: '14px', padding: '20px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📚</div>
            <div style={{ color: '#60a5fa', fontWeight: 'bold', marginBottom: '4px' }}>Rehberler</div>
            <div style={{ color: '#555', fontSize: '12px' }}>GPU kurulum ve kullanım</div>
          </a>
          <a href="/#contact" style={{ background: 'rgba(167,139,250,0.03)', border: '1px solid rgba(167,139,250,0.12)', borderRadius: '14px', padding: '20px', textDecoration: 'none', display: 'block' }}>
            <div style={{ fontSize: '28px', marginBottom: '8px' }}>📧</div>
            <div style={{ color: '#a78bfa', fontWeight: 'bold', marginBottom: '4px' }}>İletişim</div>
            <div style={{ color: '#555', fontSize: '12px' }}>Email ile ulaşın</div>
          </a>
        </div>

        {/* INFO */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
          <p style={{ color: '#555', fontSize: '13px', marginBottom: '8px' }}>
            Sorularınız için 7/24 ulaşabilirsiniz
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '24px', flexWrap: 'wrap' }}>
            <a href="https://wa.me/905458701196" style={{ color: '#25D366', textDecoration: 'none', fontSize: '13px' }}>WhatsApp: +90 545 870 1196</a>
            <a href="mailto:hakan167003077@gmail.com" style={{ color: gold, textDecoration: 'none', fontSize: '13px' }}>hakan167003077@gmail.com</a>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function Dashboard() {
  return (
    <Suspense fallback={
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ color: '#d4af37', letterSpacing: '4px' }}>YÜKLENİYOR...</div>
      </div>
    }>
      <DashboardContent />
    </Suspense>
  );
}