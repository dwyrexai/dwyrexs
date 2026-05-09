'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function StatusPage() {
  const [servers, setServers] = useState<any[]>([]);
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const gold = '#d4af37';

  useEffect(() => {
    loadStatus();
    const interval = setInterval(loadStatus, 60000);
    return () => clearInterval(interval);
  }, []);

  async function loadStatus() {
    const { data } = await supabase.from('gpu_servers').select('name, status, uptime_percent, gpu_type, location, gpu_usage, gpu_temp').order('name');
    if (data) setServers(data);
    setLastUpdate(new Date());
  }

  const allOnline = servers.every(s => s.status === 'online');
  const hasWarning = servers.some(s => s.status === 'warning');
  const hasOffline = servers.some(s => s.status === 'offline');

  const overallStatus = hasOffline ? 'degraded' : hasWarning ? 'warning' : 'operational';
  const overallColor = overallStatus === 'operational' ? '#4ade80' : overallStatus === 'warning' ? '#fbbf24' : '#f87171';
  const overallText = overallStatus === 'operational' ? 'Tüm Sistemler Çalışıyor' : overallStatus === 'warning' ? 'Kısmi Sorun' : 'Sistem Sorunu';

  const services = [
    { name: 'API Gateway', status: 'operational', uptime: '99.98%' },
    { name: 'Dashboard', status: 'operational', uptime: '99.99%' },
    { name: 'SSH Erişim', status: 'operational', uptime: '99.95%' },
    { name: 'Fatura Sistemi', status: 'operational', uptime: '100%' },
    { name: 'Email Bildirimleri', status: 'operational', uptime: '99.90%' },
    { name: 'Destek Sistemi', status: 'operational', uptime: '99.99%' },
  ];

  const incidents = [
    { date: '2025-04-15', title: 'Planlı Bakım', desc: 'Sistem güncellemesi başarıyla tamamlandı.', resolved: true },
    { date: '2025-03-22', title: 'Ağ Gecikmesi', desc: 'Avrupa bölgesinde kısa süreli gecikme yaşandı. Çözüldü.', resolved: true },
  ];

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)' }}>
        <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
        <span style={{ color: '#555', fontSize: '13px' }}>System Status</span>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '48px 20px' }}>

        {/* OVERALL STATUS */}
        <div style={{ background: `rgba(${overallStatus === 'operational' ? '74,222,128' : overallStatus === 'warning' ? '251,191,36' : '239,68,68'},0.05)`, border: `1px solid ${overallColor}33`, borderRadius: '20px', padding: '40px', textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: overallColor, margin: '0 auto 20px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '28px', animation: overallStatus === 'operational' ? 'pulse 2s infinite' : 'none' }}>
            {overallStatus === 'operational' ? '✓' : overallStatus === 'warning' ? '!' : '✗'}
          </div>
          <h1 style={{ fontSize: '28px', fontFamily: 'Georgia,serif', color: overallColor, marginBottom: '8px' }}>{overallText}</h1>
          <p style={{ color: '#555', fontSize: '13px' }}>Son güncelleme: {lastUpdate.toLocaleTimeString('tr-TR')}</p>
        </div>

        {/* UPTIME STATS */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '14px', marginBottom: '32px' }}>
          {[
            { label: 'Son 30 Gün Uptime', value: '99.95%', color: '#4ade80' },
            { label: 'Online Sunucu', value: `${servers.filter(s=>s.status==='online').length}/${servers.length}`, color: gold },
            { label: 'Ortalama GPU Kullanım', value: `${Math.round(servers.filter(s=>s.status==='online').reduce((a,s)=>a+s.gpu_usage,0)/Math.max(servers.filter(s=>s.status==='online').length,1))}%`, color: '#60a5fa' },
          ].map(s => (
            <div key={s.label} style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '20px', textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: s.color, fontFamily: 'Georgia,serif' }}>{s.value}</div>
              <div style={{ color: '#555', fontSize: '11px', marginTop: '4px' }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* GPU SERVERS */}
        {servers.length > 0 && (
          <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
            <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
              <h2 style={{ color: gold, fontSize: '14px', margin: 0, letterSpacing: '2px' }}>GPU SUNUCULARI</h2>
            </div>
            {servers.map((server, i) => {
              const sc = server.status === 'online' ? '#4ade80' : server.status === 'warning' ? '#fbbf24' : '#f87171';
              return (
                <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 20px', borderBottom: i < servers.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '14px' }}>{server.name}</div>
                    <div style={{ color: '#555', fontSize: '11px', marginTop: '2px' }}>{server.gpu_type} · {server.location}</div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ textAlign: 'right' }}>
                      <div style={{ color: '#555', fontSize: '10px' }}>Uptime</div>
                      <div style={{ color: '#4ade80', fontSize: '12px', fontWeight: 'bold' }}>{server.uptime_percent}%</div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', background: `${sc}11`, padding: '4px 12px', borderRadius: '20px' }}>
                      <div style={{ width: '7px', height: '7px', borderRadius: '50%', background: sc, animation: server.status === 'online' ? 'pulse 2s infinite' : 'none' }} />
                      <span style={{ color: sc, fontSize: '11px', fontWeight: 'bold' }}>{server.status.toUpperCase()}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* SERVICES */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', overflow: 'hidden', marginBottom: '32px' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
            <h2 style={{ color: gold, fontSize: '14px', margin: 0, letterSpacing: '2px' }}>SERVİSLER</h2>
          </div>
          {services.map((service, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 20px', borderBottom: i < services.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <span style={{ fontSize: '13px' }}>{service.name}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <span style={{ color: '#555', fontSize: '11px' }}>{service.uptime}</span>
                <div style={{ display: 'flex', alignItems: 'center', gap: '5px', background: 'rgba(74,222,128,0.1)', padding: '3px 10px', borderRadius: '20px' }}>
                  <div style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#4ade80' }} />
                  <span style={{ color: '#4ade80', fontSize: '10px', fontWeight: 'bold' }}>ÇALIŞIYOR</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* INCIDENTS */}
        <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid rgba(212,175,55,0.08)' }}>
            <h2 style={{ color: gold, fontSize: '14px', margin: 0, letterSpacing: '2px' }}>SON OLAYLAR</h2>
          </div>
          {incidents.map((inc, i) => (
            <div key={i} style={{ padding: '16px 20px', borderBottom: i < incidents.length - 1 ? '1px solid rgba(255,255,255,0.03)' : 'none' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                <span style={{ fontWeight: 'bold', fontSize: '13px' }}>{inc.title}</span>
                <span style={{ color: '#555', fontSize: '11px' }}>{inc.date}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ color: '#555', fontSize: '12px' }}>{inc.desc}</span>
                {inc.resolved && <span style={{ color: '#4ade80', fontSize: '10px', fontWeight: 'bold', background: 'rgba(74,222,128,0.1)', padding: '2px 8px', borderRadius: '10px' }}>ÇÖZÜLDÜ</span>}
              </div>
            </div>
          ))}
        </div>

        <div style={{ textAlign: 'center', marginTop: '32px' }}>
          <p style={{ color: '#333', fontSize: '12px' }}>Sorun bildirmek için: <a href="/support" style={{ color: gold, textDecoration: 'none' }}>Destek Talebi Oluştur</a></p>
        </div>
      </div>
    </div>
  );
}