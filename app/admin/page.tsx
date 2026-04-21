'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [contacts, setContacts] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [gpuRenters, setGpuRenters] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  async function loadData() {
    setLoading(true);
    const [c, f, g, s, p] = await Promise.all([
      supabase.from('contacts').select('*').order('created_at', { ascending: false }),
      supabase.from('facilities').select('*').order('created_at', { ascending: false }),
      supabase.from('gpu_renters').select('*').order('created_at', { ascending: false }),
      supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
      supabase.from('page_views').select('*').order('created_at', { ascending: false }),
    ]);
    if (c.data) setContacts(c.data);
    if (f.data) setFacilities(f.data);
    if (g.data) setGpuRenters(g.data);
    if (s.data) setSubscribers(s.data);
    if (p.data) setPageViews(p.data);
    setLoading(false);
  }

  useEffect(() => { if (loggedIn) loadData(); }, [loggedIn]);

  async function updateStatus(table: string, id: string, status: string) {
    await supabase.from(table).update({ status }).eq('id', id);
    loadData();
  }

  async function deleteRecord(table: string, id: string) {
    if (!confirm('Silmek istediğinize emin misiniz?')) return;
    await supabase.from(table).delete().eq('id', id);
    loadData();
  }

  function formatDate(d: string) {
    return new Date(d).toLocaleDateString('tr-TR', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function getDailyViews() {
    const days: Record<string, number> = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('tr-TR', { month: 'short', day: '2-digit' });
      days[key] = 0;
    }
    pageViews.forEach(pv => {
      const key = new Date(pv.created_at).toLocaleDateString('tr-TR', { month: 'short', day: '2-digit' });
      if (days[key] !== undefined) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }

  const gold = '#d4af37';
  const newContacts = contacts.filter(c => c.status === 'new').length;
  const newFacilities = facilities.filter(f => f.status === 'new').length;
  const newRenters = gpuRenters.filter(g => g.status === 'new').length;
  const totalNew = newContacts + newFacilities + newRenters;
  const totalGpus = facilities.reduce((sum, f) => sum + (f.gpu_count || 0), 0);

  const statusColors: Record<string, { bg: string; color: string }> = {
    new: { bg: 'rgba(59,130,246,0.15)', color: '#60a5fa' },
    contacted: { bg: 'rgba(245,158,11,0.15)', color: '#fbbf24' },
    in_progress: { bg: 'rgba(139,92,246,0.15)', color: '#a78bfa' },
    completed: { bg: 'rgba(34,197,94,0.15)', color: '#4ade80' },
    rejected: { bg: 'rgba(239,68,68,0.15)', color: '#f87171' },
  };

  const statusLabels: Record<string, string> = {
    new: '🔵 Yeni', contacted: '🟡 İletişime Geçildi',
    in_progress: '🟣 Devam Ediyor', completed: '✅ Tamamlandı', rejected: '❌ Reddedildi'
  };

  const menuItems = [
    { key: 'dashboard', icon: '📊', label: 'Dashboard', badge: totalNew },
    { key: 'contacts', icon: '📧', label: 'İletişim', badge: newContacts },
    { key: 'facilities', icon: '🏭', label: 'Tesisler', badge: newFacilities },
    { key: 'gpu-renters', icon: '🖥️', label: 'GPU Kiracılar', badge: newRenters },
    { key: 'subscribers', icon: '📮', label: 'Aboneler', badge: 0 },
    { key: 'analytics', icon: '📈', label: 'Analitik', badge: 0 },
  ];

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>👑</div>
          <h1 style={{ color: gold, fontSize: '24px', letterSpacing: '6px', fontFamily: 'Georgia,serif', marginBottom: '32px' }}>DWYREX ADMIN</h1>
          <form onSubmit={e => { e.preventDefault(); if (password === 'dwyrex2025king') setLoggedIn(true); else alert('Hatalı şifre'); }}>
            <input type="password" placeholder="Admin Şifresi" value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ padding: '14px', borderRadius: '10px', background: '#0a0a10', border: `1px solid rgba(212,175,55,0.2)`, color: 'white', fontSize: '16px', width: '100%', outline: 'none', marginBottom: '12px' }} />
            <button type="submit" style={{ width: '100%', background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#050508', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
              GİRİŞ YAP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif", display: 'flex' }}>

      {/* SIDEBAR */}
      <aside style={{ width: '220px', background: '#0a0a12', borderRight: '1px solid rgba(212,175,55,0.08)', display: 'flex', flexDirection: 'column', flexShrink: 0, position: 'sticky', top: 0, height: '100vh' }}>
        <div style={{ padding: '20px', borderBottom: '1px solid rgba(212,175,55,0.08)', textAlign: 'center' }}>
          <div style={{ fontSize: '24px' }}>👑</div>
          <div style={{ color: gold, fontSize: '14px', fontWeight: 'bold', letterSpacing: '4px', fontFamily: 'Georgia,serif' }}>DWYREX</div>
          <div style={{ color: '#333', fontSize: '8px', letterSpacing: '3px' }}>ADMIN PANEL</div>
        </div>
        <nav style={{ flex: 1, padding: '12px 8px' }}>
          {menuItems.map(item => (
            <button key={item.key} onClick={() => setTab(item.key)}
              style={{ display: 'flex', alignItems: 'center', gap: '10px', width: '100%', padding: '10px 14px', borderRadius: '8px', border: 'none', cursor: 'pointer', marginBottom: '4px', textAlign: 'left', background: tab === item.key ? 'rgba(212,175,55,0.1)' : 'transparent', color: tab === item.key ? gold : '#777', fontSize: '13px', fontWeight: tab === item.key ? 'bold' : 'normal' }}>
              <span>{item.icon}</span>
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge > 0 && <span style={{ background: '#ef4444', color: 'white', fontSize: '9px', fontWeight: 'bold', padding: '2px 6px', borderRadius: '10px' }}>{item.badge}</span>}
            </button>
          ))}
        </nav>
        <div style={{ padding: '12px', borderTop: '1px solid rgba(212,175,55,0.06)' }}>
          <button onClick={() => { setLoggedIn(false); setPassword(''); }}
            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: 'none', background: 'rgba(239,68,68,0.1)', color: '#f87171', cursor: 'pointer', fontSize: '12px' }}>
            Çıkış Yap
          </button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{ flex: 1, padding: '24px', overflowY: 'auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', gap: '12px', flexWrap: 'wrap' }}>
          <h1 style={{ fontSize: '20px', fontFamily: 'Georgia,serif', margin: 0 }}>
            {menuItems.find(m => m.key === tab)?.icon} {menuItems.find(m => m.key === tab)?.label}
          </h1>
          <div style={{ display: 'flex', gap: '8px' }}>
            <input placeholder="Ara..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ padding: '8px 14px', borderRadius: '8px', background: '#0a0a10', border: '1px solid rgba(212,175,55,0.1)', color: 'white', fontSize: '12px', outline: 'none', width: '180px' }} />
            <button onClick={loadData}
              style={{ background: 'rgba(212,175,55,0.08)', border: `1px solid rgba(212,175,55,0.15)`, color: gold, padding: '8px 18px', borderRadius: '8px', fontSize: '12px', cursor: 'pointer', fontWeight: 'bold' }}>
              {loading ? '⏳' : '🔄'} Yenile
            </button>
          </div>
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(150px,1fr))', gap: '14px', marginBottom: '28px' }}>
              {[
                { icon: '📧', label: 'İletişim', value: contacts.length, n: newContacts, color: '#60a5fa' },
                { icon: '🏭', label: 'Tesisler', value: facilities.length, n: newFacilities, color: '#a78bfa' },
                { icon: '🖥️', label: 'GPU Kiracı', value: gpuRenters.length, n: newRenters, color: '#fbbf24' },
                { icon: '📮', label: 'Abone', value: subscribers.length, n: 0, color: '#4ade80' },
                { icon: '👁️', label: 'Görüntülenme', value: pageViews.length, n: 0, color: '#f472b6' },
                { icon: '⚡', label: 'Toplam GPU', value: totalGpus, n: 0, color: '#38bdf8' },
              ].map(card => (
                <div key={card.label} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontSize: '20px' }}>{card.icon}</span>
                    {card.n > 0 && <span style={{ background: 'rgba(239,68,68,0.15)', color: '#f87171', fontSize: '10px', padding: '2px 6px', borderRadius: '10px', fontWeight: 'bold' }}>+{card.n}</span>}
                  </div>
                  <div style={{ fontSize: '26px', fontWeight: 'bold', color: card.color, fontFamily: 'Georgia,serif' }}>{card.value}</div>
                  <div style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* CHART */}
            <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '20px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '14px', color: gold, marginBottom: '16px', fontFamily: 'Georgia,serif' }}>📈 Sayfa Görüntülenmeleri (7 Gün)</h3>
              <ResponsiveContainer width="100%" height={160}>
                <BarChart data={getDailyViews()}>
                  <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0a0a10', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={gold} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* RECENT */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '18px' }}>
                <h3 style={{ fontSize: '13px', color: gold, marginBottom: '12px' }}>📧 Son İletişimler</h3>
                {contacts.slice(0, 5).map(c => (
                  <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px' }}>
                    <span style={{ fontWeight: 'bold' }}>{c.name}</span>
                    <span style={{ color: statusColors[c.status]?.color || '#888', fontSize: '10px' }}>{statusLabels[c.status] || c.status}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '18px' }}>
                <h3 style={{ fontSize: '13px', color: gold, marginBottom: '12px' }}>🏭 Son Tesisler</h3>
                {facilities.slice(0, 5).map(f => (
                  <div key={f.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid rgba(255,255,255,0.03)', fontSize: '12px' }}>
                    <span><strong>{f.owner_name}</strong> — {f.gpu_count} GPU</span>
                    <span style={{ color: statusColors[f.status]?.color || '#888', fontSize: '10px' }}>{statusLabels[f.status] || f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS */}
        {tab === 'contacts' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Tarih', 'İsim', 'Email', 'Tür', 'Mesaj', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={{ padding: '10px', textAlign: 'left', color: gold, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {contacts.filter(c => !search || c.name?.toLowerCase().includes(search.toLowerCase()) || c.email?.toLowerCase().includes(search.toLowerCase())).map(c => (
                  <tr key={c.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px', color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(c.created_at)}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{c.name}</td>
                    <td style={{ padding: '10px', color: gold }}>{c.email}</td>
                    <td style={{ padding: '10px', color: '#aaa', fontSize: '11px' }}>{c.type?.substring(0, 20)}</td>
                    <td style={{ padding: '10px', color: '#666', fontSize: '11px', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{c.message}</td>
                    <td style={{ padding: '10px' }}>
                      <select value={c.status} onChange={e => updateStatus('contacts', c.id, e.target.value)}
                        style={{ background: 'transparent', color: statusColors[c.status]?.color || '#888', border: `1px solid ${statusColors[c.status]?.color || '#333'}44`, borderRadius: '6px', padding: '3px 6px', fontSize: '11px', cursor: 'pointer' }}>
                        {Object.keys(statusLabels).map(s => (
                          <option key={s} value={s} style={{ background: '#111' }}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => deleteRecord('contacts', c.id)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* FACILITIES */}
        {tab === 'facilities' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Tarih', 'Sahip', 'Konum', 'GPU', 'Adet', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={{ padding: '10px', textAlign: 'left', color: gold, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {facilities.filter(f => !search || f.owner_name?.toLowerCase().includes(search.toLowerCase())).map(f => (
                  <tr key={f.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px', color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(f.created_at)}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{f.owner_name}</td>
                    <td style={{ padding: '10px', color: '#aaa' }}>{f.city}, {f.country}</td>
                    <td style={{ padding: '10px', color: '#aaa' }}>{f.gpu_type || '—'}</td>
                    <td style={{ padding: '10px', color: gold, fontWeight: 'bold' }}>{f.gpu_count || '—'}</td>
                    <td style={{ padding: '10px' }}>
                      <select value={f.status} onChange={e => updateStatus('facilities', f.id, e.target.value)}
                        style={{ background: 'transparent', color: statusColors[f.status]?.color || '#888', border: `1px solid ${statusColors[f.status]?.color || '#333'}44`, borderRadius: '6px', padding: '3px 6px', fontSize: '11px', cursor: 'pointer' }}>
                        {Object.keys(statusLabels).map(s => (
                          <option key={s} value={s} style={{ background: '#111' }}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => deleteRecord('facilities', f.id)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* GPU RENTERS */}
        {tab === 'gpu-renters' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Tarih', 'Şirket', 'Kişi', 'GPU İhtiyacı', 'Adet', 'Bütçe', 'Durum', 'İşlem'].map(h => (
                    <th key={h} style={{ padding: '10px', textAlign: 'left', color: gold, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {gpuRenters.filter(g => !search || g.company_name?.toLowerCase().includes(search.toLowerCase()) || g.contact_name?.toLowerCase().includes(search.toLowerCase())).map(g => (
                  <tr key={g.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px', color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(g.created_at)}</td>
                    <td style={{ padding: '10px', fontWeight: 'bold' }}>{g.company_name || '—'}</td>
                    <td style={{ padding: '10px', color: '#aaa' }}>{g.contact_name}</td>
                    <td style={{ padding: '10px', color: '#aaa' }}>{g.gpu_type_needed || '—'}</td>
                    <td style={{ padding: '10px', color: gold, fontWeight: 'bold' }}>{g.gpu_count_needed || '—'}</td>
                    <td style={{ padding: '10px', color: '#4ade80' }}>{g.budget || '—'}</td>
                    <td style={{ padding: '10px' }}>
                      <select value={g.status} onChange={e => updateStatus('gpu_renters', g.id, e.target.value)}
                        style={{ background: 'transparent', color: statusColors[g.status]?.color || '#888', border: `1px solid ${statusColors[g.status]?.color || '#333'}44`, borderRadius: '6px', padding: '3px 6px', fontSize: '11px', cursor: 'pointer' }}>
                        {Object.keys(statusLabels).map(s => (
                          <option key={s} value={s} style={{ background: '#111' }}>{statusLabels[s]}</option>
                        ))}
                      </select>
                    </td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => deleteRecord('gpu_renters', g.id)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* SUBSCRIBERS */}
        {tab === 'subscribers' && (
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.15)' }}>
                  {['Tarih', 'Email', 'Kaynak', 'İşlem'].map(h => (
                    <th key={h} style={{ padding: '10px', textAlign: 'left', color: gold, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {subscribers.filter(s => !search || s.email?.toLowerCase().includes(search.toLowerCase())).map(s => (
                  <tr key={s.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '10px', color: '#888', fontSize: '11px', whiteSpace: 'nowrap' }}>{formatDate(s.created_at)}</td>
                    <td style={{ padding: '10px', color: gold }}>{s.email}</td>
                    <td style={{ padding: '10px', color: '#888' }}>{s.source}</td>
                    <td style={{ padding: '10px' }}>
                      <button onClick={() => deleteRecord('subscribers', s.id)}
                        style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '4px 8px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>🗑️</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* ANALYTICS */}
        {tab === 'analytics' && (
          <div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(180px,1fr))', gap: '14px', marginBottom: '24px' }}>
              {[
                { label: 'TOPLAM GÖRÜNTÜLENME', value: pageViews.length, color: '#60a5fa' },
                { label: 'BUGÜN', value: pageViews.filter(pv => new Date(pv.created_at).toDateString() === new Date().toDateString()).length, color: gold },
                { label: 'ABONELER', value: subscribers.length, color: '#4ade80' },
                { label: 'TOPLAM FORM', value: contacts.length + facilities.length + gpuRenters.length, color: '#f472b6' },
              ].map(card => (
                <div key={card.label} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '18px' }}>
                  <div style={{ color: '#555', fontSize: '10px', letterSpacing: '2px', marginBottom: '8px' }}>{card.label}</div>
                  <div style={{ fontSize: '32px', fontWeight: 'bold', color: card.color, fontFamily: 'Georgia,serif' }}>{card.value}</div>
                </div>
              ))}
            </div>
            <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '24px' }}>
              <h3 style={{ fontSize: '14px', color: gold, marginBottom: '20px', fontFamily: 'Georgia,serif' }}>📈 Günlük Görüntülenme (7 Gün)</h3>
              <ResponsiveContainer width="100%" height={200}>
                <BarChart data={getDailyViews()}>
                  <XAxis dataKey="date" tick={{ fill: '#555', fontSize: 11 }} />
                  <YAxis tick={{ fill: '#555', fontSize: 11 }} />
                  <Tooltip contentStyle={{ background: '#0a0a10', border: '1px solid rgba(212,175,55,0.2)', borderRadius: '8px' }} />
                  <Bar dataKey="count" fill={gold} radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}