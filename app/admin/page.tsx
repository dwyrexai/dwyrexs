'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

export default function Admin() {
  const [password, setPassword] = useState('');
  const [loggedIn, setLoggedIn] = useState(false);
  const [tab, setTab] = useState('dashboard');
  const [contacts, setContacts] = useState([]);
  const [facilities, setFacilities] = useState([]);
  const [gpuRenters, setGpuRenters] = useState([]);
  const [subscribers, setSubscribers] = useState([]);
  const [pageViews, setPageViews] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

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

  async function updateStatus(table, id, status) {
    await supabase.from(table).update({ status }).eq('id', id);
    loadData();
  }

  async function deleteRecord(table, id) {
    if (!confirm('Delete this record?')) return;
    await supabase.from(table).delete().eq('id', id);
    loadData();
    setSelectedItem(null);
  }

  function formatDate(d) {
    return new Date(d).toLocaleDateString('en-US', {
      day: '2-digit', month: 'short', year: 'numeric',
      hour: '2-digit', minute: '2-digit'
    });
  }

  function shortDate(d) {
    return new Date(d).toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  }

  const newContacts = contacts.filter(c => c.status === 'new').length;
  const newFacilities = facilities.filter(f => f.status === 'new').length;
  const newRenters = gpuRenters.filter(g => g.status === 'new').length;
  const totalNew = newContacts + newFacilities + newRenters;
  const totalGpus = facilities.reduce((sum, f) => sum + (f.gpu_count || 0), 0);

  function getDailyViews() {
    const days = {};
    const now = new Date();
    for (let i = 6; i >= 0; i--) {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const key = d.toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      days[key] = 0;
    }
    pageViews.forEach(pv => {
      const key = new Date(pv.created_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit' });
      if (days[key] !== undefined) days[key]++;
    });
    return Object.entries(days).map(([date, count]) => ({ date, count }));
  }

  // ====== LOGIN SCREEN ======
  if (!loggedIn) {
    return (
      <div style={{minHeight:'100vh',background:'#050508',color:'white',
        display:'flex',justifyContent:'center',alignItems:'center',
        fontFamily:'Georgia,serif'}}>
        <div style={{textAlign:'center'}}>
          <div style={{fontSize:'60px',marginBottom:'16px'}}>??</div>
          <h1 style={{color:'#d4af37',fontSize:'28px',marginBottom:'24px',
            letterSpacing:'6px'}}>DWYREX ADMIN</h1>
          <form onSubmit={e=>{e.preventDefault();
            if(password==='dwyrex2025king')setLoggedIn(true);
            else alert('Wrong password');}}>
            <input type="password" placeholder="Admin Password"
              value={password} onChange={e=>setPassword(e.target.value)}
              style={{padding:'14px',borderRadius:'10px',background:'#0a0a10',
                border:'1px solid rgba(212,175,55,0.2)',color:'white',
                fontSize:'16px',width:'280px',textAlign:'center',outline:'none'}} />
            <br/>
            <button type="submit" style={{marginTop:'16px',
              background:'linear-gradient(135deg,#d4af37,#b8860b)',
              color:'#050508',padding:'12px 40px',borderRadius:'8px',
              fontWeight:'bold',fontSize:'14px',border:'none',cursor:'pointer',
              letterSpacing:'2px'}}>LOGIN</button>
          </form>
        </div>
      </div>
    );
  }

  const gold = '#d4af37';
  const menuItems = [
    { key:'dashboard', icon:'??', label:'Dashboard', badge:totalNew },
    { key:'contacts', icon:'??', label:'Contacts', badge:newContacts },
    { key:'facilities', icon:'??', label:'Facilities', badge:newFacilities },
    { key:'gpu-renters', icon:'???', label:'GPU Renters', badge:newRenters },
    { key:'subscribers', icon:'??', label:'Subscribers', badge:0 },
    { key:'analytics', icon:'??', label:'Analytics', badge:0 },
  ];

  const statusColors = {
    new: { bg:'rgba(59,130,246,0.15)', color:'#60a5fa' },
    contacted: { bg:'rgba(245,158,11,0.15)', color:'#fbbf24' },
    in_progress: { bg:'rgba(139,92,246,0.15)', color:'#a78bfa' },
    completed: { bg:'rgba(34,197,94,0.15)', color:'#4ade80' },
    rejected: { bg:'rgba(239,68,68,0.15)', color:'#f87171' },
  };

  const statusLabels = {
    new:'?? New', contacted:'?? Contacted', in_progress:'?? In Progress',
    completed:'? Completed', rejected:'? Rejected'
  };

  // ====== MAIN PANEL ======
  return (
    <div style={{minHeight:'100vh',background:'#050508',color:'white',
      fontFamily:"'Segoe UI',system-ui,sans-serif",display:'flex'}}>

      {/* SIDEBAR */}
      <aside style={{width:'220px',background:'#0a0a12',
        borderRight:'1px solid rgba(212,175,55,0.08)',
        display:'flex',flexDirection:'column',flexShrink:0,
        position:'sticky',top:0,height:'100vh'}}>
        <div style={{padding:'20px',borderBottom:'1px solid rgba(212,175,55,0.08)',
          textAlign:'center'}}>
          <div style={{fontSize:'24px'}}>??</div>
          <div style={{color:gold,fontSize:'14px',fontWeight:'bold',
            letterSpacing:'4px',fontFamily:'Georgia,serif'}}>DWYREX</div>
          <div style={{color:'#333',fontSize:'8px',letterSpacing:'3px'}}>ADMIN PANEL</div>
        </div>
        <nav style={{flex:1,padding:'12px 8px'}}>
          {menuItems.map(item => (
            <button key={item.key} onClick={() => { setTab(item.key); setSelectedItem(null); }}
              style={{display:'flex',alignItems:'center',gap:'10px',
                width:'100%',padding:'10px 14px',borderRadius:'8px',border:'none',
                cursor:'pointer',marginBottom:'4px',textAlign:'left',
                background: tab === item.key ? 'rgba(212,175,55,0.1)' : 'transparent',
                color: tab === item.key ? gold : '#777',fontSize:'13px',
                fontWeight: tab === item.key ? 'bold' : 'normal',position:'relative'}}>
              <span>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {item.badge > 0 && (
                <span style={{background:'#ef4444',color:'white',fontSize:'9px',
                  fontWeight:'bold',padding:'2px 6px',borderRadius:'10px'}}>
                  {item.badge}</span>
              )}
            </button>
          ))}
        </nav>
        <div style={{padding:'12px',borderTop:'1px solid rgba(212,175,55,0.06)'}}>
          <button onClick={() => { setLoggedIn(false); setPassword(''); }}
            style={{width:'100%',padding:'10px',borderRadius:'8px',border:'none',
              background:'rgba(239,68,68,0.1)',color:'#f87171',cursor:'pointer',
              fontSize:'12px'}}>Logout</button>
        </div>
      </aside>

      {/* MAIN */}
      <div style={{flex:1,padding:'24px',overflowY:'auto'}}>

        {/* HEADER */}
        <div style={{display:'flex',justifyContent:'space-between',
          alignItems:'center',marginBottom:'24px'}}>
          <h1 style={{fontSize:'20px',fontFamily:'Georgia,serif',margin:0}}>
            {menuItems.find(m=>m.key===tab)?.icon} {menuItems.find(m=>m.key===tab)?.label}
          </h1>
          <button onClick={loadData}
            style={{background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.15)',
              color:gold,padding:'8px 18px',borderRadius:'8px',fontSize:'12px',
              cursor:'pointer',fontWeight:'bold'}}>
            {loading ? '?' : '??'} Refresh
          </button>
        </div>

        {/* DASHBOARD */}
        {tab === 'dashboard' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(150px,1fr))',
              gap:'14px',marginBottom:'28px'}}>
              {[
                {icon:'??',label:'Contacts',value:contacts.length,n:newContacts,color:'#60a5fa'},
                {icon:'??',label:'Facilities',value:facilities.length,n:newFacilities,color:'#a78bfa'},
                {icon:'???',label:'GPU Renters',value:gpuRenters.length,n:newRenters,color:'#fbbf24'},
                {icon:'??',label:'Subscribers',value:subscribers.length,n:0,color:'#4ade80'},
                {icon:'???',label:'Page Views',value:pageViews.length,n:0,color:'#f472b6'},
                {icon:'?',label:'Total GPUs',value:totalGpus,n:0,color:'#38bdf8'},
              ].map(card => (
                <div key={card.label} style={{background:'rgba(212,175,55,0.02)',
                  border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',padding:'18px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                    <span style={{fontSize:'20px'}}>{card.icon}</span>
                    {card.n > 0 && <span style={{background:'rgba(239,68,68,0.15)',
                      color:'#f87171',fontSize:'10px',padding:'2px 6px',
                      borderRadius:'10px',fontWeight:'bold'}}>+{card.n}</span>}
                  </div>
                  <div style={{fontSize:'26px',fontWeight:'bold',color:card.color,
                    fontFamily:'Georgia,serif'}}>{card.value}</div>
                  <div style={{color:'#555',fontSize:'11px',marginTop:'4px'}}>{card.label}</div>
                </div>
              ))}
            </div>

            {/* CHART */}
            <div style={{background:'rgba(212,175,55,0.02)',
              border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',
              padding:'20px',marginBottom:'20px'}}>
              <h3 style={{fontSize:'14px',color:gold,marginBottom:'16px',
                fontFamily:'Georgia,serif'}}>?? Page Views (7 Days)</h3>
              <div style={{display:'flex',alignItems:'flex-end',gap:'12px',height:'120px'}}>
                {getDailyViews().map(d => {
                  const max = Math.max(...getDailyViews().map(x => x.count), 1);
                  const h = (d.count / max) * 100;
                  return (
                    <div key={d.date} style={{flex:1,textAlign:'center'}}>
                      <div style={{fontSize:'11px',color:gold,marginBottom:'4px',
                        fontWeight:'bold'}}>{d.count}</div>
                      <div style={{height:`${Math.max(h,4)}px`,
                        background:`linear-gradient(to top,${gold},#b8860b)`,
                        borderRadius:'4px 4px 0 0',minHeight:'4px'}} />
                      <div style={{fontSize:'9px',color:'#555',marginTop:'6px'}}>{d.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* RECENT */}
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px'}}>
              <div style={{background:'rgba(212,175,55,0.02)',
                border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',padding:'18px'}}>
                <h3 style={{fontSize:'13px',color:gold,marginBottom:'12px'}}>?? Recent Contacts</h3>
                {contacts.slice(0,5).map(c => (
                  <div key={c.id} style={{display:'flex',justifyContent:'space-between',
                    padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.03)',
                    fontSize:'12px'}}>
                    <span style={{fontWeight:'bold'}}>{c.name}</span>
                    <span style={{color:statusColors[c.status]?.color || '#888',
                      fontSize:'10px'}}>{statusLabels[c.status] || c.status}</span>
                  </div>
                ))}
              </div>
              <div style={{background:'rgba(212,175,55,0.02)',
                border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',padding:'18px'}}>
                <h3 style={{fontSize:'13px',color:gold,marginBottom:'12px'}}>?? Recent Facilities</h3>
                {facilities.slice(0,5).map(f => (
                  <div key={f.id} style={{display:'flex',justifyContent:'space-between',
                    padding:'8px 0',borderBottom:'1px solid rgba(255,255,255,0.03)',
                    fontSize:'12px'}}>
                    <span><strong>{f.owner_name}</strong> - {f.gpu_count} GPU</span>
                    <span style={{color:statusColors[f.status]?.color || '#888',
                      fontSize:'10px'}}>{statusLabels[f.status] || f.status}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* CONTACTS TAB */}
        {tab === 'contacts' && (
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
                {['Date','Name','Email','Type','Status','Actions'].map(h => (
                  <th key={h} style={{padding:'10px',textAlign:'left',color:gold,
                    fontSize:'10px',letterSpacing:'2px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {contacts.map(c => (
                <tr key={c.id} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <td style={{padding:'10px',color:'#888',fontSize:'11px'}}>{shortDate(c.created_at)}</td>
                  <td style={{padding:'10px',fontWeight:'bold'}}>{c.name}</td>
                  <td style={{padding:'10px',color:gold}}>{c.email}</td>
                  <td style={{padding:'10px',color:'#888',fontSize:'11px'}}>{c.type?.substring(0,25)}</td>
                  <td style={{padding:'10px'}}>
                    <select value={c.status} onChange={e=>updateStatus('contacts',c.id,e.target.value)}
                      style={{background:'transparent',color:statusColors[c.status]?.color||'#888',
                        border:`1px solid ${statusColors[c.status]?.color||'#333'}44`,
                        borderRadius:'6px',padding:'3px 6px',fontSize:'11px',cursor:'pointer'}}>
                      {Object.keys(statusLabels).map(s=>(
                        <option key={s} value={s} style={{background:'#111'}}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{padding:'10px'}}>
                    <button onClick={()=>deleteRecord('contacts',c.id)}
                      style={{background:'rgba(239,68,68,0.1)',border:'none',color:'#f87171',
                        padding:'4px 8px',borderRadius:'6px',cursor:'pointer',fontSize:'11px'}}>
                      ???</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* FACILITIES TAB */}
        {tab === 'facilities' && (
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
                {['Date','Owner','Location','GPU','Count','Status','Actions'].map(h => (
                  <th key={h} style={{padding:'10px',textAlign:'left',color:gold,
                    fontSize:'10px',letterSpacing:'2px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {facilities.map(f => (
                <tr key={f.id} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <td style={{padding:'10px',color:'#888',fontSize:'11px'}}>{shortDate(f.created_at)}</td>
                  <td style={{padding:'10px',fontWeight:'bold'}}>{f.owner_name}</td>
                  <td style={{padding:'10px',color:'#aaa'}}>{f.city}, {f.country}</td>
                  <td style={{padding:'10px',color:'#aaa'}}>{f.gpu_type || '-'}</td>
                  <td style={{padding:'10px',color:gold,fontWeight:'bold'}}>{f.gpu_count || '-'}</td>
                  <td style={{padding:'10px'}}>
                    <select value={f.status} onChange={e=>updateStatus('facilities',f.id,e.target.value)}
                      style={{background:'transparent',color:statusColors[f.status]?.color||'#888',
                        border:`1px solid ${statusColors[f.status]?.color||'#333'}44`,
                        borderRadius:'6px',padding:'3px 6px',fontSize:'11px',cursor:'pointer'}}>
                      {Object.keys(statusLabels).map(s=>(
                        <option key={s} value={s} style={{background:'#111'}}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{padding:'10px'}}>
                    <button onClick={()=>deleteRecord('facilities',f.id)}
                      style={{background:'rgba(239,68,68,0.1)',border:'none',color:'#f87171',
                        padding:'4px 8px',borderRadius:'6px',cursor:'pointer',fontSize:'11px'}}>
                      ???</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* GPU RENTERS TAB */}
        {tab === 'gpu-renters' && (
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
                {['Date','Company','Contact','GPU Need','Count','Budget','Status','Actions'].map(h => (
                  <th key={h} style={{padding:'10px',textAlign:'left',color:gold,
                    fontSize:'10px',letterSpacing:'2px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {gpuRenters.map(g => (
                <tr key={g.id} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <td style={{padding:'10px',color:'#888',fontSize:'11px'}}>{shortDate(g.created_at)}</td>
                  <td style={{padding:'10px',fontWeight:'bold'}}>{g.company_name || '-'}</td>
                  <td style={{padding:'10px',color:'#aaa'}}>{g.contact_name}</td>
                  <td style={{padding:'10px',color:'#aaa'}}>{g.gpu_type_needed || '-'}</td>
                  <td style={{padding:'10px',color:gold,fontWeight:'bold'}}>{g.gpu_count_needed || '-'}</td>
                  <td style={{padding:'10px',color:'#4ade80'}}>{g.budget || '-'}</td>
                  <td style={{padding:'10px'}}>
                    <select value={g.status} onChange={e=>updateStatus('gpu_renters',g.id,e.target.value)}
                      style={{background:'transparent',color:statusColors[g.status]?.color||'#888',
                        border:`1px solid ${statusColors[g.status]?.color||'#333'}44`,
                        borderRadius:'6px',padding:'3px 6px',fontSize:'11px',cursor:'pointer'}}>
                      {Object.keys(statusLabels).map(s=>(
                        <option key={s} value={s} style={{background:'#111'}}>{statusLabels[s]}</option>
                      ))}
                    </select>
                  </td>
                  <td style={{padding:'10px'}}>
                    <button onClick={()=>deleteRecord('gpu_renters',g.id)}
                      style={{background:'rgba(239,68,68,0.1)',border:'none',color:'#f87171',
                        padding:'4px 8px',borderRadius:'6px',cursor:'pointer',fontSize:'11px'}}>
                      ???</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* SUBSCRIBERS TAB */}
        {tab === 'subscribers' && (
          <table style={{width:'100%',borderCollapse:'collapse',fontSize:'13px'}}>
            <thead>
              <tr style={{borderBottom:'1px solid rgba(212,175,55,0.15)'}}>
                {['#','Date','Email','Source','Actions'].map(h => (
                  <th key={h} style={{padding:'10px',textAlign:'left',color:gold,
                    fontSize:'10px',letterSpacing:'2px'}}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {subscribers.map(s => (
                <tr key={s.id} style={{borderBottom:'1px solid rgba(255,255,255,0.03)'}}>
                  <td style={{padding:'10px',color:'#555'}}>{s.id}</td>
                  <td style={{padding:'10px',color:'#888',fontSize:'11px'}}>{shortDate(s.created_at)}</td>
                  <td style={{padding:'10px',color:gold}}>{s.email}</td>
                  <td style={{padding:'10px',color:'#888'}}>{s.source}</td>
                  <td style={{padding:'10px'}}>
                    <button onClick={()=>deleteRecord('subscribers',s.id)}
                      style={{background:'rgba(239,68,68,0.1)',border:'none',color:'#f87171',
                        padding:'4px 8px',borderRadius:'6px',cursor:'pointer',fontSize:'11px'}}>
                      ???</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* ANALYTICS TAB */}
        {tab === 'analytics' && (
          <div>
            <div style={{display:'grid',gridTemplateColumns:'repeat(auto-fit,minmax(180px,1fr))',
              gap:'14px',marginBottom:'24px'}}>
              <div style={{background:'rgba(212,175,55,0.02)',
                border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',padding:'18px'}}>
                <div style={{color:'#555',fontSize:'11px',letterSpacing:'2px'}}>TOTAL VIEWS</div>
                <div style={{fontSize:'32px',fontWeight:'bold',color:'#60a5fa',
                  fontFamily:'Georgia,serif'}}>{pageViews.length}</div>
              </div>
              <div style={{background:'rgba(212,175,55,0.02)',
                border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',padding:'18px'}}>
                <div style={{color:'#555',fontSize:'11px',letterSpacing:'2px'}}>TODAY</div>
                <div style={{fontSize:'32px',fontWeight:'bold',color:gold,
                  fontFamily:'Georgia,serif'}}>
                  {pageViews.filter(pv => new Date(pv.created_at).toDateString() === new Date().toDateString()).length}
                </div>
              </div>
              <div style={{background:'rgba(212,175,55,0.02)',
                border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',padding:'18px'}}>
                <div style={{color:'#555',fontSize:'11px',letterSpacing:'2px'}}>SUBSCRIBERS</div>
                <div style={{fontSize:'32px',fontWeight:'bold',color:'#4ade80',
                  fontFamily:'Georgia,serif'}}>{subscribers.length}</div>
              </div>
            </div>

            <div style={{background:'rgba(212,175,55,0.02)',
              border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',
              padding:'24px'}}>
              <h3 style={{fontSize:'14px',color:gold,marginBottom:'20px',
                fontFamily:'Georgia,serif'}}>?? Daily Views (7 Days)</h3>
              <div style={{display:'flex',alignItems:'flex-end',gap:'16px',height:'140px'}}>
                {getDailyViews().map(d => {
                  const max = Math.max(...getDailyViews().map(x => x.count), 1);
                  const h = (d.count / max) * 120;
                  return (
                    <div key={d.date} style={{flex:1,textAlign:'center'}}>
                      <div style={{fontSize:'12px',color:gold,marginBottom:'6px',
                        fontWeight:'bold'}}>{d.count}</div>
                      <div style={{height:`${Math.max(h,4)}px`,
                        background:`linear-gradient(to top,${gold},#b8860b)`,
                        borderRadius:'4px 4px 0 0',minHeight:'4px'}} />
                      <div style={{fontSize:'10px',color:'#555',marginTop:'8px'}}>{d.date}</div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
