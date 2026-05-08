'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';

interface Ticket {
  id: string;
  ticket_number: string;
  customer_name: string;
  customer_email: string;
  subject: string;
  message: string;
  priority: string;
  status: string;
  category: string;
  created_at: string;
}

interface Reply {
  id: string;
  ticket_id: string;
  author: string;
  message: string;
  is_admin: boolean;
  created_at: string;
}

function generateTicketNumber() {
  const date = new Date();
  const rand = Math.floor(Math.random() * 9000) + 1000;
  return `TKT-${date.getFullYear()}${String(date.getMonth()+1).padStart(2,'0')}-${rand}`;
}

export default function Support() {
  const [view, setView] = useState<'new' | 'track' | 'detail'>('new');
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [selectedTicket, setSelectedTicket] = useState<Ticket | null>(null);
  const [replies, setReplies] = useState<Reply[]>([]);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [trackEmail, setTrackEmail] = useState('');
  const [replyMsg, setReplyMsg] = useState('');
  const [newTicket, setNewTicket] = useState({ name: '', email: '', subject: '', message: '', priority: 'normal', category: 'general' });
  const gold = '#d4af37';

  async function submitTicket() {
    if (!newTicket.name || !newTicket.email || !newTicket.subject || !newTicket.message) {
      alert('Tüm alanları doldurun!'); return;
    }
    setLoading(true);
    const { error } = await supabase.from('support_tickets').insert({
      ...newTicket,
      ticket_number: generateTicketNumber(),
    });
    if (error) { alert('Hata: ' + error.message); setLoading(false); return; }

    // Email bildirimi
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        type: 'contact',
        data: { name: newTicket.name, email: newTicket.email, type: `Destek Talebi [${newTicket.priority}]`, message: `${newTicket.subject}: ${newTicket.message}` }
      })
    });

    setSubmitted(true);
    setLoading(false);
  }

  async function trackTickets() {
    if (!trackEmail) return;
    setLoading(true);
    const { data } = await supabase.from('support_tickets').select('*').eq('customer_email', trackEmail).order('created_at', { ascending: false });
    if (data) setTickets(data);
    setLoading(false);
  }

  async function openTicket(ticket: Ticket) {
    setSelectedTicket(ticket);
    const { data } = await supabase.from('ticket_replies').select('*').eq('ticket_id', ticket.id).order('created_at');
    if (data) setReplies(data);
    setView('detail');
  }

  async function sendReply() {
    if (!replyMsg || !selectedTicket) return;
    await supabase.from('ticket_replies').insert({
      ticket_id: selectedTicket.id,
      author: selectedTicket.customer_name,
      message: replyMsg,
      is_admin: false,
    });
    setReplyMsg('');
    const { data } = await supabase.from('ticket_replies').select('*').eq('ticket_id', selectedTicket.id).order('created_at');
    if (data) setReplies(data);
  }

  const inputStyle = {
    width: '100%', padding: '12px', background: '#0a0a10',
    border: '1px solid rgba(212,175,55,0.15)', borderRadius: '8px',
    color: 'white', fontSize: '13px', outline: 'none',
    marginBottom: '12px', boxSizing: 'border-box' as 'border-box',
  };

  const statusColor: Record<string, string> = {
    open: '#60a5fa', in_progress: '#fbbf24', resolved: '#4ade80', closed: '#555'
  };
  const priorityColor: Record<string, string> = {
    low: '#555', normal: '#60a5fa', high: '#fbbf24', urgent: '#f87171'
  };

  return (
    <div style={{ minHeight: '100vh', background: '#050508', color: 'white', fontFamily: "'Segoe UI',system-ui,sans-serif" }}>

      {/* NAV */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '12px 24px', borderBottom: '1px solid rgba(212,175,55,0.08)', background: 'rgba(5,5,8,0.95)', backdropFilter: 'blur(20px)', position: 'sticky', top: 0, zIndex: 100 }}>
        <a href="/" style={{ color: gold, textDecoration: 'none', fontSize: '18px', fontFamily: 'Georgia,serif', fontWeight: 'bold', letterSpacing: '3px' }}>DWYREX</a>
        <div style={{ display: 'flex', gap: '16px', alignItems: 'center' }}>
          <a href="https://wa.me/905458701196" target="_blank" rel="noopener noreferrer" style={{ color: '#25D366', textDecoration: 'none', fontSize: '13px' }}>💬 WhatsApp</a>
          <a href="/" style={{ color: '#777', textDecoration: 'none', fontSize: '12px' }}>← Ana Sayfa</a>
        </div>
      </nav>

      <div style={{ maxWidth: '800px', margin: '0 auto', padding: '40px 20px' }}>

        {/* HEADER */}
        <div style={{ textAlign: 'center', marginBottom: '40px' }}>
          <div style={{ fontSize: '48px', marginBottom: '12px' }}>🎫</div>
          <h1 style={{ fontSize: '32px', fontFamily: 'Georgia,serif', color: gold, marginBottom: '8px' }}>Destek Merkezi</h1>
          <p style={{ color: '#555', fontSize: '14px' }}>Ortalama yanıt süresi: 2-4 saat | 7/24 WhatsApp desteği</p>
        </div>

        {/* TABS */}
        {view !== 'detail' && (
          <div style={{ display: 'flex', gap: '8px', marginBottom: '32px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', padding: '4px' }}>
            {[{ v: 'new', l: '➕ Yeni Talep' }, { v: 'track', l: '🔍 Taleplerim' }].map(t => (
              <button key={t.v} onClick={() => { setView(t.v as any); setSubmitted(false); }}
                style={{ flex: 1, padding: '10px', borderRadius: '10px', border: 'none', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold',
                  background: view === t.v ? 'rgba(212,175,55,0.15)' : 'transparent',
                  color: view === t.v ? gold : '#777' }}>
                {t.l}
              </button>
            ))}
          </div>
        )}

        {/* NEW TICKET */}
        {view === 'new' && !submitted && (
          <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '20px', padding: '32px' }}>
            <h2 style={{ color: gold, fontSize: '18px', marginBottom: '24px', fontFamily: 'Georgia,serif' }}>Yeni Destek Talebi</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>ADINIZ *</label>
                <input placeholder="Ad Soyad" value={newTicket.name} onChange={e => setNewTicket({ ...newTicket, name: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>EMAIL *</label>
                <input type="email" placeholder="email@example.com" value={newTicket.email} onChange={e => setNewTicket({ ...newTicket, email: e.target.value })} style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>KATEGORİ</label>
                <select value={newTicket.category} onChange={e => setNewTicket({ ...newTicket, category: e.target.value })} style={{ ...inputStyle, color: '#d4af37' }}>
                  <option value="general">Genel</option>
                  <option value="technical">Teknik Sorun</option>
                  <option value="billing">Fatura / Ödeme</option>
                  <option value="access">Erişim Sorunu</option>
                  <option value="contract">Sözleşme</option>
                </select>
              </div>
              <div>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>ÖNCELİK</label>
                <select value={newTicket.priority} onChange={e => setNewTicket({ ...newTicket, priority: e.target.value })} style={{ ...inputStyle, color: '#d4af37' }}>
                  <option value="low">Düşük</option>
                  <option value="normal">Normal</option>
                  <option value="high">Yüksek</option>
                  <option value="urgent">Acil</option>
                </select>
              </div>
            </div>
            <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>KONU *</label>
            <input placeholder="Sorunuzu kısaca özetleyin" value={newTicket.subject} onChange={e => setNewTicket({ ...newTicket, subject: e.target.value })} style={inputStyle} />
            <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '6px' }}>MESAJ *</label>
            <textarea rows={5} placeholder="Sorununuzu detaylıca açıklayın..." value={newTicket.message} onChange={e => setNewTicket({ ...newTicket, message: e.target.value })}
              style={{ ...inputStyle, resize: 'vertical' as 'vertical' }} />
            <button onClick={submitTicket} disabled={loading}
              style={{ width: '100%', background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '14px', borderRadius: '10px', fontWeight: 'bold', fontSize: '14px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
              {loading ? 'GÖNDERİLİYOR...' : '🎫 TALEBİ GÖNDER'}
            </button>
          </div>
        )}

        {/* SUCCESS */}
        {view === 'new' && submitted && (
          <div style={{ background: 'rgba(74,222,128,0.05)', border: '1px solid rgba(74,222,128,0.2)', borderRadius: '20px', padding: '48px', textAlign: 'center' }}>
            <div style={{ fontSize: '64px', marginBottom: '16px' }}>✅</div>
            <h2 style={{ color: '#4ade80', fontSize: '24px', fontFamily: 'Georgia,serif', marginBottom: '12px' }}>Talebiniz Alındı!</h2>
            <p style={{ color: '#aaa', marginBottom: '8px' }}>2-4 saat içinde email ile yanıt alacaksınız.</p>
            <p style={{ color: '#555', fontSize: '13px', marginBottom: '24px' }}>Acil durumlar için WhatsApp: +90 545 870 1196</p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button onClick={() => { setSubmitted(false); setNewTicket({ name: '', email: '', subject: '', message: '', priority: 'normal', category: 'general' }); }}
                style={{ background: 'rgba(212,175,55,0.1)', border: '1px solid rgba(212,175,55,0.2)', color: gold, padding: '12px 24px', borderRadius: '8px', cursor: 'pointer', fontSize: '13px' }}>
                Yeni Talep
              </button>
              <button onClick={() => setView('track')}
                style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '13px', border: 'none' }}>
                Taleplerim →
              </button>
            </div>
          </div>
        )}

        {/* TRACK */}
        {view === 'track' && (
          <div>
            <div style={{ display: 'flex', gap: '12px', marginBottom: '24px' }}>
              <input type="email" placeholder="Email adresinizi girin..." value={trackEmail} onChange={e => setTrackEmail(e.target.value)}
                style={{ ...inputStyle, marginBottom: 0, flex: 1 }} />
              <button onClick={trackTickets} disabled={loading}
                style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '12px 24px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', whiteSpace: 'nowrap' }}>
                {loading ? '...' : '🔍 Ara'}
              </button>
            </div>
            {tickets.length > 0 && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {tickets.map(ticket => (
                  <div key={ticket.id} onClick={() => openTicket(ticket)}
                    style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '20px', cursor: 'pointer', transition: 'border-color 0.2s' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                      <div>
                        <span style={{ color: gold, fontSize: '11px', fontFamily: 'monospace' }}>{ticket.ticket_number}</span>
                        <div style={{ fontWeight: 'bold', marginTop: '4px' }}>{ticket.subject}</div>
                      </div>
                      <div style={{ display: 'flex', gap: '6px' }}>
                        <span style={{ background: `rgba(${priorityColor[ticket.priority] === '#f87171' ? '239,68,68' : '96,165,250'},0.1)`, color: priorityColor[ticket.priority], padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' }}>
                          {ticket.priority.toUpperCase()}
                        </span>
                        <span style={{ background: `rgba(96,165,250,0.1)`, color: statusColor[ticket.status], padding: '3px 10px', borderRadius: '20px', fontSize: '10px', fontWeight: 'bold' }}>
                          {ticket.status === 'open' ? 'AÇIK' : ticket.status === 'in_progress' ? 'İŞLEMDE' : ticket.status === 'resolved' ? 'ÇÖZÜLDÜ' : 'KAPALTI'}
                        </span>
                      </div>
                    </div>
                    <div style={{ color: '#555', fontSize: '12px' }}>{new Date(ticket.created_at).toLocaleDateString('tr-TR')}</div>
                  </div>
                ))}
              </div>
            )}
            {tickets.length === 0 && trackEmail && !loading && (
              <div style={{ textAlign: 'center', padding: '40px', color: '#555' }}>Bu email ile kayıtlı talep bulunamadı.</div>
            )}
          </div>
        )}

        {/* DETAIL */}
        {view === 'detail' && selectedTicket && (
          <div>
            <button onClick={() => setView('track')}
              style={{ background: 'transparent', border: 'none', color: '#777', cursor: 'pointer', fontSize: '13px', marginBottom: '20px', padding: 0 }}>
              ← Geri
            </button>
            <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '16px', padding: '24px', marginBottom: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '12px' }}>
                <span style={{ color: gold, fontFamily: 'monospace', fontSize: '12px' }}>{selectedTicket.ticket_number}</span>
                <span style={{ color: statusColor[selectedTicket.status], fontSize: '12px', fontWeight: 'bold' }}>
                  {selectedTicket.status === 'open' ? '🔵 AÇIK' : selectedTicket.status === 'resolved' ? '✅ ÇÖZÜLDÜ' : '🟡 İŞLEMDE'}
                </span>
              </div>
              <h2 style={{ fontSize: '18px', marginBottom: '8px' }}>{selectedTicket.subject}</h2>
              <p style={{ color: '#aaa', fontSize: '14px', lineHeight: '1.7' }}>{selectedTicket.message}</p>
            </div>

            {/* REPLIES */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '20px' }}>
              {replies.map(reply => (
                <div key={reply.id} style={{ background: reply.is_admin ? 'rgba(212,175,55,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${reply.is_admin ? 'rgba(212,175,55,0.15)' : 'rgba(255,255,255,0.05)'}`, borderRadius: '12px', padding: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ fontWeight: 'bold', color: reply.is_admin ? gold : 'white', fontSize: '13px' }}>
                      {reply.is_admin ? '👑 DWYREX Destek' : reply.author}
                    </span>
                    <span style={{ color: '#555', fontSize: '11px' }}>{new Date(reply.created_at).toLocaleString('tr-TR')}</span>
                  </div>
                  <p style={{ color: '#aaa', fontSize: '13px', lineHeight: '1.7', margin: 0 }}>{reply.message}</p>
                </div>
              ))}
            </div>

            {/* REPLY INPUT */}
            {selectedTicket.status !== 'closed' && (
              <div style={{ background: 'rgba(212,175,55,0.02)', border: '1px solid rgba(212,175,55,0.08)', borderRadius: '14px', padding: '20px' }}>
                <label style={{ color: '#777', fontSize: '11px', letterSpacing: '2px', display: 'block', marginBottom: '8px' }}>YANIT EKLE</label>
                <textarea rows={4} placeholder="Mesajınızı yazın..." value={replyMsg} onChange={e => setReplyMsg(e.target.value)}
                  style={{ ...inputStyle, resize: 'vertical' as 'vertical' }} />
                <button onClick={sendReply}
                  style={{ background: 'linear-gradient(135deg,#d4af37,#b8860b)', color: '#050508', padding: '12px 28px', borderRadius: '8px', fontWeight: 'bold', fontSize: '13px', border: 'none', cursor: 'pointer', letterSpacing: '2px' }}>
                  GÖNDER →
                </button>
              </div>
            )}
          </div>
        )}

        {/* QUICK HELP */}
        {view === 'new' && !submitted && (
          <div style={{ marginTop: '24px', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(200px,1fr))', gap: '12px' }}>
            {[
              { icon: '💬', title: 'WhatsApp', desc: 'Anlık destek', link: 'https://wa.me/905458701196', color: '#25D366' },
              { icon: '📧', title: 'Email', desc: 'hakan167003077@gmail.com', link: 'mailto:hakan167003077@gmail.com', color: '#60a5fa' },
              { icon: '📖', title: 'Rehberler', desc: 'Kurulum dökümanları', link: '/blog', color: gold },
            ].map(item => (
              <a key={item.title} href={item.link} target={item.link.startsWith('http') ? '_blank' : undefined} rel="noopener noreferrer"
                style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '16px', textDecoration: 'none', display: 'block' }}>
                <div style={{ fontSize: '24px', marginBottom: '6px' }}>{item.icon}</div>
                <div style={{ color: item.color, fontWeight: 'bold', fontSize: '13px', marginBottom: '2px' }}>{item.title}</div>
                <div style={{ color: '#555', fontSize: '11px' }}>{item.desc}</div>
              </a>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}