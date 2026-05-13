'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function GDPR() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [deleteReq, setDeleteReq] = useState(false);
  const gold = '#d4af37';

  async function handleConsent(type: string) {
    if (!email) { alert('Email girin'); return; }
    setLoading(true);
    await supabase.from('gdpr_consents').insert({
      email,
      consent_type: type,
      consent_given: true,
    });
    setSubmitted(true);
    setLoading(false);
  }

  async function handleDeleteRequest() {
    if (!email) { alert('Email girin'); return; }
    setLoading(true);
    await supabase.from('gdpr_consents').insert({
      email,
      consent_type: 'deletion_request',
      consent_given: false,
    });

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        data: { name: 'GDPR Silme Talebi', email, type: 'GDPR', message: `${email} için veri silme talebi` }
      })
    });

    setDeleteReq(true);
    setLoading(false);
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)' }}>
        <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
        <a href="/" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>← Ana Sayfa</a>
      </nav>

      <div style={{ maxWidth: '700px', margin: '0 auto', padding: '60px 20px' }}>
        <div style={{ textAlign: 'center', marginBottom: '48px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🔒</div>
          <h1 style={{ fontSize: '32px', fontFamily: 'Georgia,serif', color: gold, marginBottom: '8px' }}>GDPR & KVKK</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Veri koruma haklarınız ve gizlilik tercihleriniz</p>
        </div>

        {/* HAKLAR */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ color: gold, fontSize: '16px', marginBottom: '20px', fontFamily: 'Georgia,serif' }}>📋 Haklarınız</h2>
          {[
            { icon: '👁️', title: 'Erişim Hakkı', desc: 'Hakkınızda sakladığımız tüm verilere erişebilirsiniz.' },
            { icon: '✏️', title: 'Düzeltme Hakkı', desc: 'Yanlış veya eksik verilerinizin düzeltilmesini talep edebilirsiniz.' },
            { icon: '🗑️', title: 'Silme Hakkı', desc: 'Verilerinizin silinmesini talep edebilirsiniz ("unutulma hakkı").' },
            { icon: '📦', title: 'Taşınabilirlik', desc: 'Verilerinizi makine okunabilir formatta alabilirsiniz.' },
            { icon: '🚫', title: 'İtiraz Hakkı', desc: 'Veri işlemeye itiraz edebilirsiniz.' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', gap: '12px', padding: '12px 0', borderBottom: i < 4 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <span style={{ fontSize: '20px', flexShrink: 0 }}>{item.icon}</span>
              <div>
                <div style={{ fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ color: '#555', fontSize: '12px' }}>{item.desc}</div>
              </div>
            </div>
          ))}
        </div>

        {/* VERİ TOPLAMA */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
          <h2 style={{ color: gold, fontSize: '16px', marginBottom: '20px', fontFamily: 'Georgia,serif' }}>📊 Topladığımız Veriler</h2>
          {[
            { cat: 'İletişim', data: 'Ad, email, telefon — Form doldurduğunuzda' },
            { cat: 'Teknik', data: 'IP adresi, tarayıcı — Site ziyaretinde' },
            { cat: 'Ticari', data: 'GPU bilgileri, sözleşme — Hizmet sürecinde' },
            { cat: 'Analitik', data: 'Sayfa görüntüleme — Google Analytics' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: i < 3 ? '1px solid rgba(255,255,255,0.03)' : 'none', fontSize: '13px' }}>
              <span style={{ color: gold, fontWeight: 'bold' }}>{item.cat}</span>
              <span style={{ color: '#555', textAlign: 'right', maxWidth: '400px' }}>{item.data}</span>
            </div>
          ))}
        </div>

        {/* TALEP FORMU */}
        {!submitted && !deleteReq && (
          <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '28px', marginBottom: '24px' }}>
            <h2 style={{ color: gold, fontSize: '16px', marginBottom: '20px', fontFamily: 'Georgia,serif' }}>✉️ Talep Gönderin</h2>
            <input type="email" placeholder="Email adresiniz" value={email} onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '12px', background: '#0a0a10', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px', color: 'white', fontSize: '13px', outline: 'none', marginBottom: '16px', boxSizing: 'border-box' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <button onClick={() => handleConsent('data_access')} disabled={loading}
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: gold, padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                📋 Verilerimi Görmek İstiyorum
              </button>
              <button onClick={handleDeleteRequest} disabled={loading}
                style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', color: '#f87171', padding: '12px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}>
                🗑️ Verilerimi Sil
              </button>
            </div>
          </div>
        )}

        {(submitted || deleteReq) && (
          <div style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '16px', padding: '32px', textAlign: 'center' }}>
            <div style={{ fontSize: '48px', marginBottom: '12px' }}>✅</div>
            <h2 style={{ color: '#4ade80', fontSize: '20px', marginBottom: '8px' }}>Talebiniz Alındı</h2>
            <p style={{ color: '#555', fontSize: '13px' }}>30 gün içinde yanıtlanacaktır. KVKK madde 13 gereği.</p>
          </div>
        )}

        {/* KVKK BİLGİ */}
        <div style={{ background: 'rgba(96,165,250,0.03)', border: '1px solid rgba(96,165,250,0.1)', borderRadius: '16px', padding: '24px', marginTop: '24px' }}>
          <h3 style={{ color: '#60a5fa', fontSize: '14px', marginBottom: '12px' }}>🇹🇷 KVKK Bilgilendirme</h3>
          <p style={{ color: '#555', fontSize: '12px', lineHeight: '1.8' }}>
            6698 sayılı Kişisel Verilerin Korunması Kanunu kapsamında kişisel verileriniz DWYREX tarafından işlenmektedir.
            Veri sorumlusu: DWYREX Platform. İletişim: hakan167003077@gmail.com
            Verileriniz; hizmet sunumu, iletişim ve yasal yükümlülükler amacıyla işlenmekte olup üçüncü taraflarla paylaşılmamaktadır.
            Haklarınızı kullanmak için yukarıdaki formu kullanabilir veya doğrudan bizimle iletişime geçebilirsiniz.
          </p>
        </div>
      </div>
    </div>
  );
}