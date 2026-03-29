'use client';

import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { useRouter } from 'next/navigation';

export default function AdminPage() {
  const router = useRouter();
  const [loggedIn, setLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [password, setPassword] = useState('');
  const [activeTab, setActiveTab] = useState('dashboard');

  // ✅ never[] hatasını çözmek için açıkça any[] tipledik
  const [contacts, setContacts] = useState<any[]>([]);
  const [facilities, setFacilities] = useState<any[]>([]);
  const [gpuRenters, setGpuRenters] = useState<any[]>([]);
  const [subscribers, setSubscribers] = useState<any[]>([]);
  const [pageViews, setPageViews] = useState<any[]>([]);

  useEffect(() => {
    const session = localStorage.getItem('dwyrex_admin_session');
    if (session === 'true') {
      setLoggedIn(true);
      loadData();
    } else {
      setLoading(false);
    }
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [c, f, g, s, p] = await Promise.all([
        supabase.from('contacts').select('*').order('created_at', { ascending: false }),
        supabase.from('facilities').select('*').order('created_at', { ascending: false }),
        supabase.from('gpu_renters').select('*').order('created_at', { ascending: false }),
        supabase.from('subscribers').select('*').order('created_at', { ascending: false }),
        supabase.from('page_views').select('*').order('created_at', { ascending: false }),
      ]);

      setContacts(c.data || []);
      setFacilities(f.data || []);
      setGpuRenters(g.data || []);
      setSubscribers(s.data || []);
      setPageViews(p.data || []);
    } catch (err) {
      console.error('Load error:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'dwyrex2025king') {
      localStorage.setItem('dwyrex_admin_session', 'true');
      setLoggedIn(true);
      loadData();
    } else {
      alert('Incorrect password');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('dwyrex_admin_session');
    setLoggedIn(false);
    router.push('/');
  };

  // ✅ Bileşen içinde tanımlandı, tipleri açıkça verildi
  const updateStatus = async (table: string, id: number, status: string) => {
    setLoading(true);
    await supabase.from(table).update({ status }).eq('id', id);
    loadData();
  };

  const deleteItem = async (table: string, id: number) => {
    if (!confirm('Delete this item?')) return;
    setLoading(true);
    await supabase.from(table).delete().eq('id', id);
    loadData();
  };

  if (!loggedIn) {
    return (
      <div style={{ minHeight: '100vh', background: '#050508', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <form onSubmit={handleLogin} style={{ background: '#111', padding: '40px', borderRadius: '16px', border: '1px solid rgba(212,175,55,0.2)', width: '320px' }}>
          <h2 style={{ color: '#d4af37', textAlign: 'center', marginBottom: '20px', fontFamily: 'Georgia, serif' }}>Admin Login</h2>
          <input type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Enter password" style={{ width: '100%', padding: '12px', marginBottom: '16px', background: '#0a0a10', border: '1px solid #333', color: '#fff', borderRadius: '8px', boxSizing: 'border-box' }} />
          <button type="submit" style={{ width: '100%', padding: '12px', background: '#d4af37', color: '#000', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer' }}>Login</button>
        </form>
      </div>
    );
  }

  const tabs = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'contacts', label: 'Contacts' },
    { id: 'facilities', label: 'Facilities' },
    { id: 'gpu_renters', label: 'GPU Renters' },
    { id: 'subscribers', label: 'Subscribers' },
    { id: 'analytics', label: 'Analytics' },
  ];

  const currentData = activeTab === 'dashboard' ? [] : 
    activeTab === 'contacts' ? contacts :
    activeTab === 'facilities' ? facilities :
    activeTab === 'gpu_renters' ? gpuRenters :
    activeTab === 'subscribers' ? subscribers : pageViews;

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: '#fff', padding: '40px 20px', fontFamily: "'Segoe UI', system-ui, sans-serif" }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '30px' }}>
          <h1 style={{ color: '#d4af37', fontFamily: 'Georgia, serif', fontSize: '28px' }}>DWYREX Admin</h1>
          <button onClick={handleLogout} style={{ padding: '8px 16px', background: 'transparent', border: '1px solid #d4af37', color: '#d4af37', borderRadius: '6px', cursor: 'pointer' }}>Logout</button>
        </div>

        <div style={{ display: 'flex', gap: '10px', marginBottom: '30px', flexWrap: 'wrap' }}>
          {tabs.map(tab => (
            <button key={tab.id} onClick={() => setActiveTab(tab.id)} style={{ padding: '10px 20px', background: activeTab === tab.id ? '#d4af37' : '#111', color: activeTab === tab.id ? '#000' : '#888', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: 'bold' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {loading ? (
          <p style={{ textAlign: 'center', color: '#666' }}>Loading...</p>
        ) : activeTab === 'dashboard' ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
            {[
              { label: 'Contacts', count: contacts.length, color: '#4ade80' },
              { label: 'Facilities', count: facilities.length, color: '#60a5fa' },
              { label: 'GPU Renters', count: gpuRenters.length, color: '#f472b6' },
              { label: 'Subscribers', count: subscribers.length, color: '#fbbf24' },
              { label: 'Page Views', count: pageViews.length, color: '#a78bfa' },
            ].map(stat => (
              <div key={stat.label} style={{ background: '#111', padding: '24px', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)', textAlign: 'center' }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: stat.color }}>{stat.count}</div>
                <div style={{ color: '#888', marginTop: '8px' }}>{stat.label}</div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ background: '#111', borderRadius: '12px', border: '1px solid rgba(212,175,55,0.1)', overflow: 'hidden' }}>
            {currentData.length === 0 ? (
              <p style={{ padding: '40px', textAlign: 'center', color: '#666' }}>No data found.</p>
            ) : (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '14px' }}>
                  <thead>
                    <tr style={{ background: '#0a0a10', borderBottom: '1px solid #333' }}>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#d4af37' }}>ID</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#d4af37' }}>Data</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#d4af37' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'left', color: '#d4af37' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentData.map((item: any) => (
                      <tr key={item.id} style={{ borderBottom: '1px solid #222' }}>
                        <td style={{ padding: '12px', color: '#888' }}>#{item.id}</td>
                        <td style={{ padding: '12px', color: '#ccc' }}>{item.name || item.email || item.company || item.path || 'N/A'}</td>
                        <td style={{ padding: '12px' }}>
                          <select value={item.status || 'new'} onChange={e => updateStatus(activeTab, item.id, e.target.value)} style={{ background: '#0a0a10', color: '#fff', border: '1px solid #444', padding: '4px 8px', borderRadius: '4px' }}>
                            <option value="new">New</option>
                            <option value="reviewed">Reviewed</option>
                            <option value="approved">Approved</option>
                            <option value="rejected">Rejected</option>
                          </select>
                        </td>
                        <td style={{ padding: '12px' }}>
                          <button onClick={() => deleteItem(activeTab, item.id)} style={{ background: '#ff4444', color: '#fff', border: 'none', padding: '4px 12px', borderRadius: '4px', cursor: 'pointer', fontSize: '12px' }}>Delete</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}