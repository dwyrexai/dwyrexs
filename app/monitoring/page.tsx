'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Server {
  id: string;
  name: string;
  ip_address: string;
  location: string;
  owner_email: string;
  gpu_type: string;
  gpu_count: number;
  status: string;
  cpu_usage: number;
  ram_usage: number;
  gpu_usage: number;
  gpu_temp: number;
  uptime_percent: number;
  monthly_revenue: number;
  last_ping: string;
}

export default function Monitoring() {
  const [servers, setServers] = useState<Server[]>([]);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loggedIn, setLoggedIn] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const gold = '#d4af37';

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setLoggedIn(!!session);
      if (session) loadServers();
    });
  }, []);

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoginError('');
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setLoginError('Hatalı email veya şifre');
    else { setLoggedIn(true); loadServers(); }
  }

  async function loadServers() {
    setLoading(true);
    const { data } = await supabase.from('gpu_servers').select('*').order('status');
    if (data) setServers(data);
    setLastUpdate(new Date());
    setLoading(false);
  }

  useEffect(() => {
    if (!loggedIn) return;
    const interval = setInterval(loadServers, 30000);
    return () => clearInterval(interval);
  }, [loggedIn]);

  function StatusBadge({ status }: { status: string }) {
    const colors: Record<string, { bg: string; color: string; dot: string }> = {
      online: { bg: 'rgba(74,222,128,0.1)', color: '#4ade80', dot: '#4ade80' },
      warning: { bg: 'rgba(251,191,36,0.1)', color: '#fbbf24', dot: '#fbbf24' },
      offline: { bg: 'rgba(239,68,68,0.1)', color: '#f87171', dot: '#f87171' },
    };
    const s = colors[status] || colors.offline;
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px',
        background: s.bg, padding: '4px 10px', borderRadius: '20px', width: 'fit-content' }}>
        <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: s.dot,
          animation: status === 'online' ? 'pulse 2s infinite' : 'none' }} />
        <span style={{ color: s.color, fontSize: '11px', fontWeight: 'bold', textTransform: 'uppercase' }}>
          {status}
        </span>
      </div>
    );
  }

  function UsageBar({ value, color }: { value: number; color: string }) {
    const barColor = value > 90 ? '#f87171' : value > 70 ? '#fbbf24' : color;
    return (
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
          <span style={{ fontSize: '10px', color: '#555' }}></span>
          <span style={{ fontSize: '11px', color: barColor, fontWeight: 'bold' }}>{value}%</span>
        </div>
        <div style={{ background: '#1a1a1a', borderRadius: '4px', height: '5px', overflow: 'hidden' }}>
          <div style={{ width: `${value}%`, height: '100%', background: barColor,
            borderRadius: '4px', transition: 'width 0.5s ease' }} />
        </div>
      </div>
    );
  }

  const totalGPUs = servers.reduce((s, sv) => s + sv.gpu_count, 0);
  const onlineServers = servers.filter(s => s.status === 'online').length;
  const totalRevenue = servers.reduce((s, sv) => s + sv.monthly_revenue, 0);
  const avgUptime = servers.length ? (servers.reduce((s, sv) => s + sv.uptime_percent, 0) / servers.length).toFixed(1) : '0';

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <div style={{ textAlign: 'center', width: '100%', maxWidth: '380px', padding: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '8px' }}>📡</div>
          <h1 style={{ color: gold, fontSize: '22px', letterSpacing: '4px', fontFamily: 'Georgia,serif', marginBottom: '8px' }}>MONITORING</h1>
          <p style={{ color: '#555', fontSize: '12px', marginBottom: '32px' }}>DWYREX GPU Infrastructure</p>
          <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {loginError && <div style={{ color: '#f87171', fontSize: '13px', background: 'rgba(239,68,68,0.1)', padding: '10px', borderRadius: '8px' }}>{loginError}</div>}
            <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)} required
              style={{ padding: '14px', borderRadius: '10px', background: '#0a0a10', border: '1px solid rgba(212,175,55,0.2)', color: 'white', fontSize: '15px', outline: 'none' }} />
            <input type="password" placeholder="Şifre" value={password} onChange={e => setPassword(e.target.value)} required
              style={{ padding: '14px', borderRadius: '10px', background: '#0a0a10', border: '1px solid rgba(212,175,55,0.2)', color: 'white', fontSize: '15px', outline: 'none' }} />
            <button type="submit"
              style={{ background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#050508', padding: '14px', borderRadius: '8px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
              GİRİŞ YAP
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
          <span style={{ color: '#333' }}>|</span>
          <span style={{ color: '#777', fontSize: '13px' }}>📡 Monitoring Dashboard</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#4ade80', animation: 'pulse 2s infinite' }} />
            <span style={{ color: '#4ade80', fontSize: '11px' }}>CANLI</span>
          </div>
          <span style={{ color: '#555', fontSize: '11px' }}>Son: {lastUpdate.toLocaleTimeString('tr-TR')}</span>
          <button onClick={loadServers} style={{ background: 'rgba(212,175,55,0.08)', border: '1px solid rgba(212,175,55,0.15)', color: gold, padding: '6px 16px', borderRadius: '6px', fontSize: '12px', cursor: 'pointer' }}>
            🔄 Yenile
          </button>
          <a href="/admin" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>Admin →</a>
        </div>
      </nav>

      <div style={{ padding: '24px' }}>

        {/* STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(160px,1fr))', gap: '14px', marginBottom: '24px' }}>
          {[
            { icon: '🖥️', label: 'Toplam GPU', value: totalGPUs, color: gold },
            { icon: '✅', label: 'Online Sunucu', value: `${onlineServers}/${servers.length}`, color: '#4ade80' },
            { icon: '💰', label: 'Aylık Gelir', value: `$${totalRevenue.toLocaleString()}`, color: '#ffd700' },
            { icon: '⬆️', label: 'Ortalama Uptime', value: `%${avgUptime}`, color: '#60a5fa' },
          ].map(card => (
            <div key={card.label} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '18px' }}>
              <div style={{ fontSize: '20px', marginBottom: '8px' }}>{card.icon}</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: card.color, fontFamily: 'Georgia,serif' }}>{card.value}</div>
              <div style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>{card.label}</div>
            </div>
          ))}
        </div>

        {/* SERVER CARDS */}
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px', color: '#555' }}>Yükleniyor...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(320px,1fr))', gap: '16px' }}>
            {servers.map(server => (
              <div key={server.id} style={{ background: 'rgba(212,175,55,0.02)', border: `1px solid ${server.status === 'online' ? 'rgba(74,222,128,0.15)' : server.status === 'warning' ? 'rgba(251,191,36,0.15)' : 'rgba(239,68,68,0.15)'}`, borderRadius: '16px', padding: '20px' }}>

                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '15px', marginBottom: '4px' }}>{server.name}</div>
                    <div style={{ color: '#555', fontSize: '11px' }}>📍 {server.location}</div>
                    <div style={{ color: '#444', fontSize: '10px', marginTop: '2px' }}>👤 {server.owner_email}</div>
                  </div>
                  <StatusBadge status={server.status} />
                </div>

                {/* GPU Info */}
                <div style={{ display: 'flex', gap: '8px', marginBottom: '16px' }}>
                  <div style={{ background: 'rgba(212,175,55,0.08)', borderRadius: '8px', padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                    <div style={{ color: gold, fontWeight: 'bold', fontSize: '16px' }}>{server.gpu_count}</div>
                    <div style={{ color: '#555', fontSize: '10px' }}>GPU Adet</div>
                  </div>
                  <div style={{ background: 'rgba(96,165,250,0.08)', borderRadius: '8px', padding: '8px 12px', flex: 2, textAlign: 'center' }}>
                    <div style={{ color: '#60a5fa', fontWeight: 'bold', fontSize: '13px' }}>{server.gpu_type}</div>
                    <div style={{ color: '#555', fontSize: '10px' }}>Model</div>
                  </div>
                  <div style={{ background: 'rgba(74,222,128,0.08)', borderRadius: '8px', padding: '8px 12px', flex: 1, textAlign: 'center' }}>
                    <div style={{ color: '#4ade80', fontWeight: 'bold', fontSize: '14px' }}>${(server.monthly_revenue/1000).toFixed(1)}K</div>
                    <div style={{ color: '#555', fontSize: '10px' }}>Aylık</div>
                  </div>
                </div>

                {/* Usage Bars */}
                {server.status !== 'offline' && (
                  <div style={{ display: 'grid', gap: '8px', marginBottom: '12px' }}>
                    <div>
                      <div style={{ color: '#555', fontSize: '10px', marginBottom: '3px' }}>GPU Kullanım</div>
                      <UsageBar value={server.gpu_usage} color='#d4af37' />
                    </div>
                    <div>
                      <div style={{ color: '#555', fontSize: '10px', marginBottom: '3px' }}>CPU Kullanım</div>
                      <UsageBar value={server.cpu_usage} color='#60a5fa' />
                    </div>
                    <div>
                      <div style={{ color: '#555', fontSize: '10px', marginBottom: '3px' }}>RAM Kullanım</div>
                      <UsageBar value={server.ram_usage} color='#a78bfa' />
                    </div>
                  </div>
                )}

                {/* Footer */}
                <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid rgba(255,255,255,0.04)', paddingTop: '10px' }}>
                  <div style={{ fontSize: '11px', color: '#555' }}>
                    🌡️ {server.gpu_temp > 0 ? `${server.gpu_temp}°C` : 'N/A'}
                  </div>
                  <div style={{ fontSize: '11px', color: server.uptime_percent > 99 ? '#4ade80' : server.uptime_percent > 97 ? '#fbbf24' : '#f87171' }}>
                    ⬆️ %{server.uptime_percent} uptime
                  </div>
                  <div style={{ fontSize: '11px', color: '#444' }}>
                    🔗 {server.ip_address}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* ADD SERVER */}
        <div style={{ marginTop: '24px', background: 'rgba(212,175,55,0.02)', border: '1px dashed rgba(212,175,55,0.2)', borderRadius: '16px', padding: '24px', textAlign: 'center' }}>
          <div style={{ fontSize: '32px', marginBottom: '8px' }}>➕</div>
          <p style={{ color: '#555', fontSize: '14px', marginBottom: '16px' }}>Yeni GPU sunucusu ekle</p>
          <a href="/admin" style={{ background: `linear-gradient(135deg,${gold},#b8860b)`, color: '#050508', padding: '10px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', textDecoration: 'none', letterSpacing: '2px' }}>
            ADMIN PANELİNDEN EKLE
          </a>
        </div>
      </div>
    </div>
  );
}