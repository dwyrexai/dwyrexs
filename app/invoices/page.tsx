'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Invoice {
  id: string;
  invoice_number: string;
  client_name: string;
  client_email: string;
  server_name: string;
  gpu_type: string;
  gpu_count: number;
  unit_price: number;
  total_amount: number;
  status: string;
  due_date: string;
  paid_at: string;
  period_start: string;
  period_end: string;
  created_at: string;
}

export default function Invoices() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [filter, setFilter] = useState('all');
  const [form, setForm] = useState({
    client_name: '', client_email: '', server_name: '',
    gpu_type: 'RTX 3090', gpu_count: 100, unit_price: 350,
    due_days: 15,
  });
  const gold = '#d4af37';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      setAuthLoading(false);
      if (session) loadInvoices();
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError('Hatali email veya sifre');
    else { setLoggedIn(true); loadInvoices(); }
  }

  async function loadInvoices() {
    setLoading(true);
    const { data } = await supabase.from('invoices').select('*').order('created_at', { ascending: false });
    if (data) setInvoices(data);
    setLoading(false);
  }

  function generateInvoiceNumber() {
    const date = new Date();
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const rand = Math.floor(Math.random() * 9000) + 1000;
    return `DWX-${year}${month}-${rand}`;
  }

  async function createInvoice() {
    if (!form.client_name || !form.client_email) {
      alert('Musteri bilgilerini doldurun!'); return;
    }
    const now = new Date();
    const due = new Date();
    due.setDate(due.getDate() + form.due_days);
    const periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
    const periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    const total = form.unit_price * (form.gpu_count / 100);

    const { error } = await supabase.from('invoices').insert({
      invoice_number: generateInvoiceNumber(),
      client_name: form.client_name,
      client_email: form.client_email,
      server_name: form.server_name,
      gpu_type: form.gpu_type,
      gpu_count: form.gpu_count,
      unit_price: form.unit_price,
      total_amount: total,
      status: 'pending',
      due_date: due.toISOString(),
      period_start: periodStart.toISOString(),
      period_end: periodEnd.toISOString(),
    });

    if (error) alert('Hata: ' + error.message);
    else {
      setShowAdd(false);
      loadInvoices();
      alert('Fatura olusturuldu!');
    }
  }

  async function markPaid(id: string) {
    await supabase.from('invoices').update({ status: 'paid', paid_at: new Date().toISOString() }).eq('id', id);
    loadInvoices();
  }

  async function sendInvoiceEmail(inv: Invoice) {
    const res = await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        data: {
          name: inv.client_name,
          email: inv.client_email,
          type: 'Fatura',
          message: `Fatura No: ${inv.invoice_number} | Tutar: $${inv.total_amount} | Son Odeme: ${new Date(inv.due_date).toLocaleDateString('tr-TR')}`,
        }
      }),
    });
    if (res.ok) alert('Fatura emaili gonderildi!');
    else alert('Email gonderilemedi!');
  }

  function printInvoice(inv: Invoice) {
    const win = window.open('', '_blank');
    if (!win) return;
    win.document.write(`
      <!DOCTYPE html>
      <html>
      <head>
        <title>Fatura ${inv.invoice_number}</title>
        <style>
          body { font-family: Georgia, serif; background: #fff; color: #000; padding: 40px; max-width: 700px; margin: 0 auto; }
          .header { text-align: center; border-bottom: 3px solid #d4af37; padding-bottom: 20px; margin-bottom: 30px; }
          .title { font-size: 32px; color: #d4af37; letter-spacing: 8px; }
          .subtitle { font-size: 12px; color: #999; letter-spacing: 4px; }
          .info { display: flex; justify-content: space-between; margin-bottom: 30px; }
          .box { border: 1px solid #eee; padding: 16px; border-radius: 8px; width: 45%; }
          .label { font-size: 10px; color: #999; text-transform: uppercase; letter-spacing: 2px; }
          .value { font-size: 14px; font-weight: bold; margin-top: 4px; }
          table { width: 100%; border-collapse: collapse; margin-bottom: 30px; }
          th { background: #f9f6ee; padding: 10px; text-align: left; font-size: 11px; text-transform: uppercase; letter-spacing: 2px; color: #b8860b; }
          td { padding: 12px 10px; border-bottom: 1px solid #eee; font-size: 13px; }
          .total { text-align: right; font-size: 22px; font-weight: bold; color: #d4af37; }
          .status { display: inline-block; padding: 6px 16px; border-radius: 20px; font-size: 12px; font-weight: bold; background: ${inv.status === 'paid' ? '#e8f5e9' : '#fff8e1'}; color: ${inv.status === 'paid' ? '#388e3c' : '#f57f17'}; }
          .footer { text-align: center; margin-top: 40px; padding-top: 20px; border-top: 1px solid #eee; color: #999; font-size: 11px; }
        </style>
      </head>
      <body>
        <div class="header">
          <div class="title">DWYREX</div>
          <div class="subtitle">THE KING OF COMPUTE</div>
          <div style="margin-top:12px;font-size:18px;font-weight:bold;">FATURA</div>
          <div style="font-size:13px;color:#999;margin-top:4px;">${inv.invoice_number}</div>
        </div>
        <div class="info">
          <div class="box">
            <div class="label">Fatura Kesen</div>
            <div class="value">DWYREX Platform</div>
            <div style="font-size:12px;color:#999;margin-top:4px;">dwyrex.vercel.app</div>
            <div style="font-size:12px;color:#999;">hakan167003077@gmail.com</div>
          </div>
          <div class="box">
            <div class="label">Fatura Kesilen</div>
            <div class="value">${inv.client_name}</div>
            <div style="font-size:12px;color:#999;margin-top:4px;">${inv.client_email}</div>
          </div>
        </div>
        <div class="info">
          <div>
            <div class="label">Fatura Tarihi</div>
            <div class="value">${new Date(inv.created_at).toLocaleDateString('tr-TR')}</div>
          </div>
          <div>
            <div class="label">Son Odeme Tarihi</div>
            <div class="value" style="color:${inv.status === 'paid' ? '#388e3c' : '#f57f17'}">${new Date(inv.due_date).toLocaleDateString('tr-TR')}</div>
          </div>
          <div>
            <div class="label">Durum</div>
            <div class="status">${inv.status === 'paid' ? 'ODENDI' : 'BEKLIYOR'}</div>
          </div>
        </div>
        <table>
          <thead>
            <tr>
              <th>Hizmet</th>
              <th>Donem</th>
              <th>GPU</th>
              <th>Adet</th>
              <th>Tutar</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>GPU Kiralama Hizmeti<br><small style="color:#999">${inv.server_name || 'DWYREX Network'}</small></td>
              <td>${inv.period_start ? new Date(inv.period_start).toLocaleDateString('tr-TR') : ''} - ${inv.period_end ? new Date(inv.period_end).toLocaleDateString('tr-TR') : ''}</td>
              <td>${inv.gpu_type}</td>
              <td>${inv.gpu_count}</td>
              <td><strong>$${inv.total_amount}</strong></td>
            </tr>
          </tbody>
        </table>
        <div class="total">TOPLAM: $${inv.total_amount} USD</div>
        <div class="footer">
          <p>DWYREX Platform — GPU Kiralama & AI Altyapi Hizmetleri</p>
          <p>GDPR & KVKK Uyumlu | dwyrex.vercel.app | +90 545 870 1196</p>
          <p style="margin-top:8px;font-size:10px;">Bu fatura dijital olarak olusturulmustur ve gecerli bir belge niteligindedir.</p>
        </div>
      </body>
      </html>
    `);
    win.document.close();
    win.print();
  }

  const filtered = filter === 'all' ? invoices : invoices.filter(i => i.status === filter);
  const totalRevenue = invoices.filter(i => i.status === 'paid').reduce((s, i) => s + i.total_amount, 0);
  const pending = invoices.filter(i => i.status === 'pending').reduce((s, i) => s + i.total_amount, 0);

  const inputStyle = {
    width: '100%', padding: '10px', background: '#0a0a10',
    border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px',
    color: 'white', fontSize: '13px', outline: 'none',
    marginBottom: '10px', boxSizing: 'border-box' as 'border-box',
  };

  if (authLoading) return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ color: gold, letterSpacing: '4px' }}>YUKLENIYOR...</div>
    </div>
  );

  if (!loggedIn) return (
    <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
      <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '40px' }}>
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🧾</div>
        <h1 style={{ color: gold, fontSize: '22px', letterSpacing: '4px', fontFamily: 'Georgia,serif', marginBottom: '32px' }}>FATURA SISTEMI</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loginError && <div style={{ color: '#f87171', padding: '10px', borderRadius: '8px', background: 'rgba(239,68,68,0.1)', fontSize: '13px' }}>{loginError}</div>}
          <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required style={inputStyle} />
          <input type="password" placeholder="Sifre" value={password} onChange={e => setPassword(e.target.value)} required style={inputStyle} />
          <button type="submit" style={{ background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#050508', padding: '14px', borderRadius: '8px', fontWeight: 'bold', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
            GIRIS YAP
          </button>
        </form>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#777', fontSize: '13px' }}>🧾 Fatura Sistemi</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/ssh" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>🔐 SSH</a>
          <a href="/monitoring" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>📡 Monitoring</a>
          <a href="/admin" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>👑 Admin</a>
        </div>
      </nav>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontFamily: 'Georgia,serif', margin: 0, color: gold }}>Fatura Yoneticisi</h1>
            <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>Musteri faturalarini olustur, gonder ve takip et</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)}
            style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
            ➕ Yeni Fatura
          </button>
        </div>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { icon: '🧾', label: 'Toplam Fatura', value: invoices.length, color: gold },
            { icon: '✅', label: 'Odenen', value: invoices.filter(i => i.status === 'paid').length, color: '#4ade80' },
            { icon: '⏳', label: 'Bekleyen', value: invoices.filter(i => i.status === 'pending').length, color: '#fbbf24' },
            { icon: '💰', label: 'Tahsil Edilen', value: `$${totalRevenue.toLocaleString()}`, color: '#4ade80' },
            { icon: '📋', label: 'Bekleyen Tutar', value: `$${pending.toLocaleString()}`, color: '#fbbf24' },
          ].map(card => (
            <div key={card.label} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ fontSize: '22px', fontWeight: 'bold', color: card.color, fontFamily: 'Georgia,serif' }}>{card.value}</div>
              <div style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* ADD FORM */}
        {showAdd && (
          <div style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: gold, marginBottom: '20px', fontSize: '15px' }}>🧾 Yeni Fatura Olustur</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>MUSTERI ADI *</label>
                <input placeholder="Ahmet Yilmaz" value={form.client_name} onChange={e => setForm({ ...form, client_name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>MUSTERI EMAIL *</label>
                <input type="email" placeholder="musteri@email.com" value={form.client_email} onChange={e => setForm({ ...form, client_email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>SUNUCU ADI</label>
                <input placeholder="Istanbul-Farm-01" value={form.server_name} onChange={e => setForm({ ...form, server_name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>GPU TIPI</label>
                <select value={form.gpu_type} onChange={e => {
                  const prices: Record<string, number> = { 'RTX 3090': 350, 'RTX 4090': 550, 'A100': 1490, 'H100': 2500 };
                  setForm({ ...form, gpu_type: e.target.value, unit_price: prices[e.target.value] || 350 });
                }} style={{ ...inputStyle, color: '#d4af37' }}>
                  <option value="RTX 3090">RTX 3090 — $350/100 GPU/ay</option>
                  <option value="RTX 4090">RTX 4090 — $550/100 GPU/ay</option>
                  <option value="A100">A100 — $1,490/100 GPU/ay</option>
                  <option value="H100">H100 — $2,500/100 GPU/ay</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>GPU ADEDI</label>
                <input type="number" value={form.gpu_count} onChange={e => setForm({ ...form, gpu_count: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>ODEME VADESI (GUN)</label>
                <select value={form.due_days} onChange={e => setForm({ ...form, due_days: Number(e.target.value) })} style={{ ...inputStyle, color: '#d4af37' }}>
                  <option value={7}>7 Gun</option>
                  <option value={15}>15 Gun</option>
                  <option value={30}>30 Gun</option>
                </select>
              </div>
            </div>
            <div style={{ background: 'rgba(212,175,55,0.05)', borderRadius: '10px', padding: '16px', marginBottom: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ color: '#777' }}>Fatura Tutari:</span>
              <span style={{ color: gold, fontSize: '24px', fontWeight: 'bold', fontFamily: 'Georgia,serif' }}>
                ${(form.unit_price * (form.gpu_count / 100)).toLocaleString()} USD
              </span>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button onClick={createInvoice}
                style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
                FATURA OLUSTUR
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#777', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                Iptal
              </button>
            </div>
          </div>
        )}

        {/* FILTER */}
        <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
          {[{ v: 'all', l: 'Tumu' }, { v: 'pending', l: 'Bekleyen' }, { v: 'paid', l: 'Odenen' }].map(f => (
            <button key={f.v} onClick={() => setFilter(f.v)}
              style={{ padding: '6px 18px', borderRadius: '20px', border: 'none', cursor: 'pointer', fontSize: '12px', fontWeight: 'bold',
                background: filter === f.v ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.03)',
                color: filter === f.v ? gold : '#777' }}>
              {f.l}
            </button>
          ))}
        </div>

        {/* INVOICE LIST */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(212,175,55,0.03)' }}>
                  {['Fatura No', 'Musteri', 'GPU', 'Tutar', 'Son Odeme', 'Durum', 'Islemler'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: gold, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr><td colSpan={7} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Fatura bulunamadi</td></tr>
                ) : filtered.map(inv => (
                  <tr key={inv.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 16px', fontFamily: 'monospace', color: gold, fontSize: '12px' }}>{inv.invoice_number}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ fontWeight: 'bold' }}>{inv.client_name}</div>
                      <div style={{ color: '#555', fontSize: '11px' }}>{inv.client_email}</div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#aaa' }}>
                      {inv.gpu_type} × {inv.gpu_count}
                    </td>
                    <td style={{ padding: '12px 16px', color: gold, fontWeight: 'bold', fontSize: '15px' }}>
                      ${inv.total_amount?.toLocaleString()}
                    </td>
                    <td style={{ padding: '12px 16px', color: inv.status === 'paid' ? '#4ade80' : '#fbbf24', fontSize: '12px' }}>
                      {inv.due_date ? new Date(inv.due_date).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: inv.status === 'paid' ? 'rgba(74,222,128,0.1)' : 'rgba(251,191,36,0.1)',
                        color: inv.status === 'paid' ? '#4ade80' : '#fbbf24',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                      }}>
                        {inv.status === 'paid' ? '✅ Odendi' : '⏳ Bekliyor'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        <button onClick={() => printInvoice(inv)}
                          style={{ background: 'rgba(212,175,55,0.08)', border: 'none', color: gold, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                          🖨️ Yazdir
                        </button>
                        <button onClick={() => sendInvoiceEmail(inv)}
                          style={{ background: 'rgba(96,165,250,0.08)', border: 'none', color: '#60a5fa', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                          📧 Email
                        </button>
                        {inv.status === 'pending' && (
                          <button onClick={() => markPaid(inv.id)}
                            style={{ background: 'rgba(74,222,128,0.08)', border: 'none', color: '#4ade80', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                            ✅ Odendi
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}