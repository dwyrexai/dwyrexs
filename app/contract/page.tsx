'use client';
import { useState } from 'react';
import { supabase } from '../../lib/supabase';

export default function Contract() {
  const [step, setStep] = useState(1);
  const [type, setType] = useState('facility');
 const facilityRates: Record<string, number> = {
    'RTX 3090': 140, 'RTX 4090': 220, 'A100': 596, 'H100': 1000,
  };
  const renterRates: Record<string, number> = {
    'RTX 3090': 350, 'RTX 4090': 550, 'A100': 1490, 'H100': 2500,
  };
  const rates = type === 'facility' ? facilityRates : renterRates;

  const [form, setForm] = useState({
    client_name: '', client_email: '', facility_name: '',
    gpu_type: 'RTX 3090', gpu_count: 100, duration_months: 12,
  });

  const monthlyPayment = rates[form.gpu_type] * (form.gpu_count / 100);
  const [signed, setSigned] = useState(false);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const gold = '#d4af37';

  const contractText = type === 'facility' ? `
HİZMET SEVİYESİ ANLAŞMASI (SLA)
DWYREX GPU TESİS KİRALAMA SÖZLEŞMESİ

Taraflar:
- Hizmet Sağlayıcı: DWYREX Platform
- Tesis Sahibi: ${form.client_name} (${form.client_email})
- Tesis Adı: ${form.facility_name || 'Belirtilmedi'}

Sözleşme Detayları:
- GPU Tipi: ${form.gpu_type}
- GPU Adedi: ${form.gpu_count} adet
- Aylık Ödeme: $${monthlyPayment}
- Sözleşme Süresi: ${form.duration_months} ay
- Toplam Değer: $${monthlyPayment * form.duration_months}

Koşullar:
1. DWYREX, GPU'ları yalnızca meşru yapay zeka iş yükleri için kullanacaktır.
2. Aylık ödemeler her ayın 1'inde yapılacaktır.
3. Donanım sigortası DWYREX tarafından karşılanacaktır.
4. Erişim 7/24 izlenecek ve raporlanacaktır.
5. Sözleşme ${form.duration_months} ay süreyle geçerlidir.
6. GDPR ve KVKK uyumluluğu garanti edilmektedir.
7. Her iki taraf 30 gün önceden bildirimle sözleşmeyi feshedebilir.
  ` : `
GPU KİRALAMA HİZMET SÖZLEŞMESİ
DWYREX PLATFORM KULLANIM ANLAŞMASI

Taraflar:
- Hizmet Sağlayıcı: DWYREX Platform
- Müşteri: ${form.client_name} (${form.client_email})

Sözleşme Detayları:
- GPU Tipi: ${form.gpu_type}
- GPU Adedi: ${form.gpu_count} adet
- Aylık Ücret: $${monthlyPayment}
- Kiralama Süresi: ${form.duration_months} ay
- Toplam Tutar: $${monthlyPayment * form.duration_months}

Koşullar:
1. GPU'lar yalnızca yasal iş yükleri için kullanılabilir.
2. Aylık faturalar her ayın 1'inde kesilecektir.
3. %99.5 uptime garantisi verilmektedir.
4. Teknik destek 7/24 sağlanacaktır.
5. Veri gizliliği GDPR/KVKK kapsamında korunacaktır.
6. Sözleşme ${form.duration_months} ay süreyle geçerlidir.
7. Her iki taraf 30 gün önceden bildirimle sözleşmeyi feshedebilir.
  `;

  async function handleSign() {
    if (!agreed) return alert('Lütfen sözleşmeyi onaylayın');
    setLoading(true);
    const { error } = await supabase.from('contracts').insert({
      contract_type: type,
      client_name: form.client_name,
      client_email: form.client_email,
      facility_name: form.facility_name,
      gpu_type: form.gpu_type,
      gpu_count: form.gpu_count,
      monthly_payment: monthlyPayment,
      duration_months: form.duration_months,
      status: 'signed',
      signed_at: new Date().toISOString(),
    });
    if (error) { alert('Hata: ' + error.message); setLoading(false); return; }
    setSigned(true);
    setLoading(false);
  }

  const inputStyle = {
    padding: '12px', borderRadius: '8px', background: '#0a0a10',
    border: '1px solid rgba(212,175,55,0.15)', color: 'white',
    fontSize: '14px', width: '100%', outline: 'none', boxSizing: 'border-box' as 'border-box',
    marginBottom: '12px',
  };

  return (
    <div style={{minHeight:'100vh',background:'#050508',color:'white',fontFamily:"'Segoe UI',system-ui,sans-serif"}}>
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 40px',borderBottom:'1px solid rgba(212,175,55,0.08)',background:'rgba(5,5,8,0.95)',backdropFilter:'blur(20px)'}}>
        <a href="/" style={{color:gold,textDecoration:'none',fontSize:'20px',fontFamily:'Georgia,serif',letterSpacing:'4px',fontWeight:'bold'}}>DWYREX</a>
        <a href="/" style={{color:'#777',textDecoration:'none',fontSize:'13px'}}>← Ana Sayfa</a>
      </nav>

      <div style={{maxWidth:'800px',margin:'0 auto',padding:'60px 20px'}}>
        {signed ? (
          <div style={{textAlign:'center',padding:'80px 20px'}}>
            <div style={{fontSize:'64px',marginBottom:'24px'}}>✅</div>
            <h1 style={{color:gold,fontSize:'36px',fontFamily:'Georgia,serif',marginBottom:'16px'}}>Sözleşme İmzalandı!</h1>
            <p style={{color:'#aaa',fontSize:'18px',marginBottom:'32px'}}>Tebrikler {form.client_name}! Sözleşmeniz başarıyla kaydedildi.</p>
            <div style={{background:'rgba(212,175,55,0.05)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:'16px',padding:'32px',marginBottom:'32px',textAlign:'left'}}>
              <h3 style={{color:gold,marginBottom:'16px'}}>📋 Özet</h3>
              <p>GPU: <strong>{form.gpu_type} × {form.gpu_count}</strong></p>
              <p>Aylık: <strong style={{color:gold}}>${monthlyPayment}</strong></p>
              <p>Süre: <strong>{form.duration_months} ay</strong></p>
              <p>Toplam: <strong style={{color:gold}}>${monthlyPayment * form.duration_months}</strong></p>
            </div>
            <p style={{color:'#666',fontSize:'14px'}}>Ekibimiz 24 saat içinde sizinle iletişime geçecektir.</p>
            <a href="/" style={{display:'inline-block',marginTop:'24px',background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'14px 32px',borderRadius:'8px',fontWeight:'bold',textDecoration:'none',letterSpacing:'2px'}}>
              ANA SAYFAYA DÖN
            </a>
          </div>
        ) : (
          <>
            <div style={{textAlign:'center',marginBottom:'48px'}}>
              <h1 style={{fontSize:'36px',fontFamily:'Georgia,serif',marginBottom:'12px'}}>
                Dijital <span style={{color:gold}}>Sözleşme</span>
              </h1>
              <p style={{color:'#666'}}>Hızlı ve güvenli dijital imza</p>
              <div style={{display:'flex',justifyContent:'center',gap:'8px',marginTop:'24px'}}>
                {[1,2,3].map(s=>(
                  <div key={s} style={{width:'32px',height:'32px',borderRadius:'50%',display:'flex',alignItems:'center',justifyContent:'center',fontSize:'13px',fontWeight:'bold',
                    background: step >= s ? 'linear-gradient(135deg,#d4af37,#b8860b)' : 'rgba(212,175,55,0.1)',
                    color: step >= s ? '#050508' : '#555'}}>{s}</div>
                ))}
              </div>
            </div>

            {step === 1 && (
              <div>
                <h2 style={{fontSize:'22px',marginBottom:'24px',fontFamily:'Georgia,serif'}}>1. Sözleşme Türü</h2>
                <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'16px',marginBottom:'32px'}}>
                  {[
                    {v:'facility',icon:'🏭',t:'Tesis Sahibi',d:'GPU tesisimi DWYREX\'e kirala'},
                    {v:'renter',icon:'🖥️',t:'GPU Kiracı',d:'DWYREX\'den GPU kirala'},
                  ].map(opt=>(
                    <div key={opt.v} onClick={()=>setType(opt.v)}
                      style={{background: type===opt.v ? 'rgba(212,175,55,0.08)' : 'rgba(212,175,55,0.02)',
                        border: `1px solid ${type===opt.v ? 'rgba(212,175,55,0.4)' : 'rgba(212,175,55,0.08)'}`,
                        borderRadius:'14px',padding:'24px',cursor:'pointer',textAlign:'center'}}>
                      <div style={{fontSize:'36px',marginBottom:'8px'}}>{opt.icon}</div>
                      <div style={{fontWeight:'bold',marginBottom:'4px',color: type===opt.v ? gold : 'white'}}>{opt.t}</div>
                      <div style={{color:'#666',fontSize:'13px'}}>{opt.d}</div>
                    </div>
                  ))}
                </div>
                <button onClick={()=>setStep(2)}
                  style={{width:'100%',background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'16px',borderRadius:'10px',fontWeight:'bold',fontSize:'15px',border:'none',cursor:'pointer',letterSpacing:'2px'}}>
                  DEVAM →
                </button>
              </div>
            )}

            {step === 2 && (
              <div>
                <h2 style={{fontSize:'22px',marginBottom:'24px',fontFamily:'Georgia,serif'}}>2. Bilgileriniz</h2>
                <input placeholder="Ad Soyad *" value={form.client_name}
                  onChange={e=>setForm({...form,client_name:e.target.value})} style={inputStyle}/>
                <input placeholder="Email *" type="email" value={form.client_email}
                  onChange={e=>setForm({...form,client_email:e.target.value})} style={inputStyle}/>
                {type==='facility' && <input placeholder="Tesis Adı" value={form.facility_name}
                  onChange={e=>setForm({...form,facility_name:e.target.value})} style={inputStyle}/>}
                <select value={form.gpu_type} onChange={e=>setForm({...form,gpu_type:e.target.value})} style={{...inputStyle,color:'#d4af37'}}>
                  <option value="RTX 3090">RTX 3090 (24GB)</option>
                  <option value="RTX 4090">RTX 4090 (24GB)</option>
                  <option value="A100">A100 (40GB)</option>
                  <option value="H100">H100 (80GB)</option>
                </select>
                <div style={{marginBottom:'12px'}}>
                  <label style={{color:'#777',fontSize:'12px',letterSpacing:'2px',display:'block',marginBottom:'8px'}}>
                    GPU SAYISI: <span style={{color:gold,fontSize:'18px'}}>{form.gpu_count}</span>
                  </label>
                  <input type="range" min="10" max="1000" step="10" value={form.gpu_count}
                    onChange={e=>setForm({...form,gpu_count:Number(e.target.value)})}
                    style={{width:'100%',accentColor:gold}}/>
                </div>
                <select value={form.duration_months} onChange={e=>setForm({...form,duration_months:Number(e.target.value)})} style={{...inputStyle,color:'#d4af37'}}>
                  <option value={1}>1 Ay</option>
                  <option value={3}>3 Ay</option>
                  <option value={6}>6 Ay</option>
                  <option value={12}>12 Ay</option>
                  <option value={24}>24 Ay</option>
                </select>
                <div style={{background:'rgba(212,175,55,0.05)',border:'1px solid rgba(212,175,55,0.15)',borderRadius:'12px',padding:'20px',marginBottom:'20px'}}>
                  <div style={{display:'flex',justifyContent:'space-between',marginBottom:'8px'}}>
                    <span style={{color:'#777'}}>Aylık Ödeme:</span>
                    <span style={{color:gold,fontWeight:'bold',fontSize:'18px'}}>${monthlyPayment}</span>
                  </div>
                  <div style={{display:'flex',justifyContent:'space-between'}}>
                    <span style={{color:'#777'}}>Toplam ({form.duration_months} ay):</span>
                    <span style={{color:'#ffd700',fontWeight:'bold',fontSize:'20px'}}>${monthlyPayment*form.duration_months}</span>
                  </div>
                </div>
                <div style={{display:'flex',gap:'12px'}}>
                  <button onClick={()=>setStep(1)} style={{flex:1,background:'rgba(255,255,255,0.05)',color:'#777',padding:'16px',borderRadius:'10px',fontWeight:'bold',fontSize:'15px',border:'none',cursor:'pointer'}}>← GERİ</button>
                  <button onClick={()=>{if(!form.client_name||!form.client_email)return alert('Ad ve email zorunlu');setStep(3);}}
                    style={{flex:2,background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'16px',borderRadius:'10px',fontWeight:'bold',fontSize:'15px',border:'none',cursor:'pointer',letterSpacing:'2px'}}>
                    DEVAM →
                  </button>
                </div>
              </div>
            )}

            {step === 3 && (
              <div>
                <h2 style={{fontSize:'22px',marginBottom:'24px',fontFamily:'Georgia,serif'}}>3. Sözleşmeyi İncele ve İmzala</h2>
                <div style={{background:'#0a0a10',border:'1px solid rgba(212,175,55,0.15)',borderRadius:'12px',padding:'24px',marginBottom:'24px',maxHeight:'400px',overflowY:'auto',fontFamily:'monospace',fontSize:'13px',lineHeight:'2',color:'#aaa',whiteSpace:'pre-wrap'}}>
                  {contractText}
                </div>
                <div style={{display:'flex',alignItems:'center',gap:'12px',marginBottom:'24px',padding:'16px',background:'rgba(212,175,55,0.03)',border:'1px solid rgba(212,175,55,0.1)',borderRadius:'10px',cursor:'pointer'}}
                  onClick={()=>setAgreed(!agreed)}>
                  <div style={{width:'24px',height:'24px',borderRadius:'6px',border:`2px solid ${agreed?gold:'#444'}`,background:agreed?gold:'transparent',display:'flex',alignItems:'center',justifyContent:'center',flexShrink:0}}>
                    {agreed && <span style={{color:'#050508',fontSize:'16px',fontWeight:'bold'}}>✓</span>}
                  </div>
                  <span style={{color:'#aaa',fontSize:'14px'}}>Yukarıdaki sözleşmeyi okudum ve kabul ediyorum. Dijital imzamın yasal bağlayıcılığını onaylıyorum.</span>
                </div>
                <div style={{display:'flex',gap:'12px'}}>
                  <button onClick={()=>setStep(2)} style={{flex:1,background:'rgba(255,255,255,0.05)',color:'#777',padding:'16px',borderRadius:'10px',fontWeight:'bold',fontSize:'15px',border:'none',cursor:'pointer'}}>← GERİ</button>
                  <button onClick={handleSign} disabled={!agreed||loading}
                    style={{flex:2,background:agreed?'linear-gradient(135deg,#d4af37,#b8860b)':'#333',color:agreed?'#050508':'#666',padding:'16px',borderRadius:'10px',fontWeight:'bold',fontSize:'15px',border:'none',cursor:agreed?'pointer':'not-allowed',letterSpacing:'2px'}}>
                    {loading ? 'İMZALANIYOR...' : '✍️ SÖZLEŞMEYI İMZALA'}
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}