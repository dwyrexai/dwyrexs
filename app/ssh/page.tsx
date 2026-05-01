'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface SSHAccess {
  id: string;
  server_id: string;
  client_email: string;
  ssh_user: string;
  ssh_host: string;
  ssh_port: number;
  status: string;
  expires_at: string;
  created_at: string;
}

interface Server {
  id: string;
  name: string;
  ip_address: string;
  gpu_type: string;
}

export default function SSHManager() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [authLoading, setAuthLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [accesses, setAccesses] = useState<SSHAccess[]>([]);
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({
    server_id: '', client_email: '', ssh_user: 'dwyrex',
    ssh_host: '', ssh_port: 22, expires_days: 30,
  });
  const gold = '#d4af37';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      setAuthLoading(false);
      if (session) loadData();
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError('Hatali email veya sifre');
    else { setLoggedIn(true); loadData(); }
  }

  async function loadData() {
    setLoading(true);
    const [a, s] = await Promise.all([
      supabase.from('ssh_access').select('*').order('created_at', { ascending: false }),
      supabase.from('gpu_servers').select('id, name, ip_address, gpu_type'),
    ]);
    if (a.data) setAccesses(a.data);
    if (s.data) setServers(s.data);
    setLoading(false);
  }

  async function addAccess() {
    if (!form.server_id || !form.client_email || !form.ssh_host) {
      alert('Tum alanlari doldurun!'); return;
    }
    const expires_at = new Date();
    expires_at.setDate(expires_at.getDate() + form.expires_days);
    const { error } = await supabase.from('ssh_access').insert({
      ...form, expires_at: expires_at.toISOString(),
    });
    if (error) alert('Hata: ' + error.message);
    else { setShowAdd(false); loadData(); }
  }

  async function revokeAccess(id: string) {
    if (!confirm('Bu erisimi iptal etmek istediginize emin misiniz?')) return;
    await supabase.from('ssh_access').update({ status: 'revoked' }).eq('id', id);
    loadData();
  }

  function copyCommand(access: SSHAccess) {
    const cmd = `ssh ${access.ssh_user}@${access.ssh_host} -p ${access.ssh_port}`;
    navigator.clipboard.writeText(cmd);
    alert('SSH komutu kopyalandi!');
  }

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
        <div style={{ fontSize: '48px', marginBottom: '8px' }}>🔐</div>
        <h1 style={{ color: gold, fontSize: '22px', letterSpacing: '4px', fontFamily: 'Georgia,serif', marginBottom: '32px' }}>SSH MANAGER</h1>
        <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          {loginError && <div style={{ color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>{loginError}</div>}
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

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#777', fontSize: '13px' }}>🔐 SSH Erisim Yoneticisi</span>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <a href="/monitoring" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>📡 Monitoring</a>
          <a href="/admin" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>👑 Admin</a>
        </div>
      </nav>

      <div style={{ padding: '24px', maxWidth: '1200px', margin: '0 auto' }}>

        {/* HEADER */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h1 style={{ fontSize: '22px', fontFamily: 'Georgia,serif', margin: 0, color: gold }}>SSH Erisim Yoneticisi</h1>
            <p style={{ color: '#555', fontSize: '13px', marginTop: '4px' }}>Musteri GPU erisimlerini guvenli sekilde yonet</p>
          </div>
          <button onClick={() => setShowAdd(!showAdd)}
            style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
            ➕ Yeni Erisim Ekle
          </button>
        </div>

        {/* ADD FORM */}
        {showAdd && (
          <div style={{ background: 'rgba(212,175,55,0.03)', border: '1px solid rgba(212,175,55,0.15)', borderRadius: '16px', padding: '24px', marginBottom: '24px' }}>
            <h3 style={{ color: gold, marginBottom: '20px', fontSize: '15px' }}>🔑 Yeni SSH Erisimi Tanimla</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>SUNUCU</label>
                <select value={form.server_id} onChange={e => {
                  const server = servers.find(s => s.id === e.target.value);
                  setForm({ ...form, server_id: e.target.value, ssh_host: server?.ip_address || '' });
                }} style={{ ...inputStyle, color: '#d4af37' }}>
                  <option value="">Sunucu secin...</option>
                  {servers.map(s => <option key={s.id} value={s.id}>{s.name} — {s.gpu_type}</option>)}
                </select>
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>MUSTERI EMAIL</label>
                <input placeholder="musteri@email.com" value={form.client_email}
                  onChange={e => setForm({ ...form, client_email: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>SSH HOST (IP)</label>
                <input placeholder="185.220.101.1" value={form.ssh_host}
                  onChange={e => setForm({ ...form, ssh_host: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>SSH KULLANICI</label>
                <input placeholder="dwyrex" value={form.ssh_user}
                  onChange={e => setForm({ ...form, ssh_user: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>PORT</label>
                <input type="number" placeholder="22" value={form.ssh_port}
                  onChange={e => setForm({ ...form, ssh_port: Number(e.target.value) })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>SURE (GUN)</label>
                <select value={form.expires_days} onChange={e => setForm({ ...form, expires_days: Number(e.target.value) })}
                  style={{ ...inputStyle, color: '#d4af37' }}>
                  <option value={7}>7 Gun</option>
                  <option value={30}>30 Gun</option>
                  <option value={90}>90 Gun</option>
                  <option value={365}>1 Yil</option>
                </select>
              </div>
            </div>
            <div style={{ display: 'flex', gap: '12px', marginTop: '8px' }}>
              <button onClick={addAccess}
                style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
                ERISIMI OLUSTUR
              </button>
              <button onClick={() => setShowAdd(false)}
                style={{ background: 'rgba(255,255,255,0.05)', color: '#777', padding: '12px 20px', borderRadius: '8px', fontSize: '13px', border: 'none', cursor: 'pointer' }}>
                Iptal
              </button>
            </div>
          </div>
        )}

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(140px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { icon: '🔑', label: 'Toplam Erisim', value: accesses.length, color: gold },
            { icon: '✅', label: 'Aktif', value: accesses.filter(a => a.status === 'active').length, color: '#4ade80' },
            { icon: '❌', label: 'Iptal', value: accesses.filter(a => a.status === 'revoked').length, color: '#f87171' },
            { icon: '🖥️', label: 'Sunucu', value: servers.length, color: '#60a5fa' },
          ].map(card => (
            <div key={card.label} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '16px' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: card.color, fontFamily: 'Georgia,serif' }}>{card.value}</div>
              <div style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* ACCESS LIST */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h3 style={{ color: gold, fontSize: '14px', margin: 0 }}>🔑 SSH Erisim Listesi</h3>
            <button onClick={loadData} style={{ background: 'rgba(212,175,55,0.08)', border: 'none', color: gold, padding: '6px 14px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
              {loading ? '⏳' : '🔄'} Yenile
            </button>
          </div>
          <div style={{ overflowX: 'auto' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
                  {['Musteri', 'SSH Komutu', 'Sunucu', 'Bitis', 'Durum', 'Islem'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: gold, fontSize: '10px', letterSpacing: '2px' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {accesses.length === 0 ? (
                  <tr><td colSpan={6} style={{ padding: '40px', textAlign: 'center', color: '#555' }}>Henuz SSH erisimi tanimlanmamis</td></tr>
                ) : accesses.map(access => (
                  <tr key={access.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '12px 16px', color: gold }}>{access.client_email}</td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ background: '#0a0a10', border: '1px solid rgba(212,175,55,0.1)', borderRadius: '6px', padding: '6px 10px', fontFamily: 'monospace', fontSize: '11px', color: '#4ade80', display: 'inline-block' }}>
                        ssh {access.ssh_user}@{access.ssh_host} -p {access.ssh_port}
                      </div>
                    </td>
                    <td style={{ padding: '12px 16px', color: '#aaa', fontSize: '12px' }}>
                      {servers.find(s => s.id === access.server_id)?.name || '—'}
                    </td>
                    <td style={{ padding: '12px 16px', color: '#777', fontSize: '11px' }}>
                      {access.expires_at ? new Date(access.expires_at).toLocaleDateString('tr-TR') : '—'}
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <span style={{
                        background: access.status === 'active' ? 'rgba(74,222,128,0.1)' : 'rgba(239,68,68,0.1)',
                        color: access.status === 'active' ? '#4ade80' : '#f87171',
                        padding: '3px 10px', borderRadius: '20px', fontSize: '11px', fontWeight: 'bold'
                      }}>
                        {access.status === 'active' ? '✅ Aktif' : '❌ Iptal'}
                      </span>
                    </td>
                    <td style={{ padding: '12px 16px' }}>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <button onClick={() => copyCommand(access)}
                          style={{ background: 'rgba(212,175,55,0.08)', border: 'none', color: gold, padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                          📋 Kopyala
                        </button>
                        {access.status === 'active' && (
                          <button onClick={() => revokeAccess(access.id)}
                            style={{ background: 'rgba(239,68,68,0.1)', border: 'none', color: '#f87171', padding: '4px 10px', borderRadius: '6px', cursor: 'pointer', fontSize: '11px' }}>
                            ❌ Iptal
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

        {/* GUIDE */}
        <div style={{ marginTop: '24px', background: 'rgba(96,165,250,0.03)', border: '1px solid rgba(96,165,250,0.1)', borderRadius: '16px', padding: '24px' }}>
          <h3 style={{ color: '#60a5fa', fontSize: '14px', marginBottom: '16px' }}>📖 Musteri SSH Kurulum Rehberi</h3>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            {[
              { step: '1', title: 'SSH Baglantisi', code: 'ssh dwyrex@185.220.101.1 -p 22' },
              { step: '2', title: 'GPU Kontrolu', code: 'nvidia-smi' },
              { step: '3', title: 'Docker GPU', code: 'docker run --gpus all nvidia/cuda:12.3.0-base-ubuntu22.04 nvidia-smi' },
              { step: '4', title: 'Jupyter Lab', code: 'jupyter lab --ip=0.0.0.0 --port=8888 --no-browser' },
            ].map(item => (
              <div key={item.step} style={{ background: '#0a0a10', borderRadius: '10px', padding: '14px' }}>
                <div style={{ color: '#60a5fa', fontSize: '11px', marginBottom: '6px', fontWeight: 'bold' }}>Adim {item.step}: {item.title}</div>
                <div style={{ fontFamily: 'monospace', fontSize: '11px', color: '#4ade80', background: '#050508', padding: '8px', borderRadius: '6px' }}>
                  {item.code}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}