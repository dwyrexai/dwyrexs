'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { translations, Lang } from '../lib/translations';

// ====== LOGO ======
function CrownLogo({ size = 'large' }: { size?: 'large' | 'nav' }) {
  if (size === 'nav') {
    return (
      <svg width="160" height="45" viewBox="0 0 400 100" style={{display:'block'}}>
        <defs>
          <linearGradient id="gN" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#d4af37"/>
            <stop offset="100%" stopColor="#ffd700"/>
          </linearGradient>
          <filter id="glN">
            <feGaussianBlur stdDeviation="1.5" result="b"/>
            <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
          </filter>
        </defs>
        <polygon points="160,18 167,5 174,12 180,0 186,10 192,0 198,12 205,5 212,18"
          fill="none" stroke="#ffd700" strokeWidth="1.2"
          strokeLinejoin="round" filter="url(#glN)"/>
        <line x1="160" y1="18" x2="212" y2="18"
          stroke="#ffd700" strokeWidth="1.2" filter="url(#glN)"/>
        <circle cx="180" cy="0" r="2" fill="#ffd700" filter="url(#glN)"/>
        <circle cx="192" cy="0" r="2" fill="#ffd700" filter="url(#glN)"/>
        <text x="70" y="62" fontFamily="Georgia,serif" fontSize="40"
          fontWeight="bold" fill="url(#gN)" letterSpacing="8"
          filter="url(#glN)">DWYREX</text>
      </svg>
    );
  }
  return (
    <svg width="460" height="200" viewBox="0 0 500 220" style={{maxWidth:'100%'}}>
      <defs>
        <linearGradient id="gL" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37"/>
          <stop offset="100%" stopColor="#ffd700"/>
        </linearGradient>
        <filter id="glL">
          <feGaussianBlur stdDeviation="2.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <g opacity="0.05">
        {[30,70,110,380,420,460].map((x,i)=>(
          <circle key={i} cx={x} cy={12+(i%3)*18} r="1.2" fill="#d4af37"/>
        ))}
      </g>
      <polygon points="200,48 212,20 224,36 236,5 248,28 260,5 272,36 284,20 296,48"
        fill="none" stroke="#ffd700" strokeWidth="2.5"
        strokeLinejoin="round" filter="url(#glL)"/>
      <line x1="200" y1="48" x2="296" y2="48"
        stroke="#ffd700" strokeWidth="2.5" filter="url(#glL)"/>
      <circle cx="236" cy="5" r="3.5" fill="#ffd700" filter="url(#glL)"/>
      <circle cx="260" cy="5" r="3.5" fill="#ffd700" filter="url(#glL)"/>
      <circle cx="248" cy="28" r="2" fill="#ffd700" filter="url(#glL)" opacity="0.5"/>
      <text x="82" y="130" fontFamily="Georgia,serif" fontSize="68"
        fontWeight="bold" fill="url(#gL)" letterSpacing="18"
        filter="url(#glL)">DWYREX</text>
      <line x1="82" y1="148" x2="440" y2="148"
        stroke="#ffd700" strokeWidth="1" filter="url(#glL)" opacity="0.25"/>
      <text x="135" y="178" fontFamily="Georgia,serif" fontSize="14"
        fill="#ffd700" letterSpacing="10" fontStyle="italic"
        filter="url(#glL)" opacity="0.65">THE KING OF COMPUTE</text>
      <circle cx="82" cy="200" r="1.8" fill="#d4af37" filter="url(#glL)" opacity="0.25"/>
      <circle cx="250" cy="200" r="1.8" fill="#ffd700" filter="url(#glL)" opacity="0.25"/>
      <circle cx="440" cy="200" r="1.8" fill="#d4af37" filter="url(#glL)" opacity="0.25"/>
    </svg>
  );
}

// ====== BİLDİRİM FONKSİYONU ======
async function sendNotification(type: string, data: Record<string,any>) {
  try {
    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ type, data }),
    });
  } catch (err) {
    console.error('Notification error:', err);
  }
}

// ====== ANA SAYFA ======
export default function Home() {
  const [lang, setLang] = useState<Lang>('en');
  const [gpu, setGpu] = useState('rtx3090');
  const [count, setCount] = useState(100);
  const [formSent, setFormSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [email, setEmail] = useState('');
  const [subbed, setSubbed] = useState(false);
  const [mobileMenu, setMobileMenu] = useState(false);

  const tx = translations[lang];

  const p: Record<string,{n:string;m:number;r:number}> = {
    rtx3090:{n:'RTX 3090',m:-200,r:252},
    rtx4090:{n:'RTX 4090',m:-100,r:396},
    a100:{n:'A100 40GB',m:-300,r:1073},
    h100:{n:'H100 80GB',m:-500,r:1800},
  };
  const s = p[gpu];
  const rent = s.r*(count/100);
  const year = rent*12;
  const loss = s.m*(count/100);

  const inputStyle: React.CSSProperties = {
    padding:'15px', borderRadius:'10px', background:'#0a0a10',
    border:'1px solid rgba(212,175,55,0.15)', color:'white',
    fontSize:'15px', width:'100%', outline:'none', boxSizing:'border-box',
  };

  // Dil localStorage'dan al
  useEffect(() => {
    const saved = localStorage.getItem('dwyrex_lang') as Lang;
    if (['en','tr','de','fr','ar','ja','ko'].includes(saved)) setLang(saved);
  }, []);

  function switchLang(l: Lang) {
    setLang(l);
    localStorage.setItem('dwyrex_lang', l);
  }

  // Page view tracking
  useEffect(() => {
    supabase.from('page_views').insert({
      page: '/',
      referrer: document.referrer || 'direct',
      device: /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    });
  }, []);

  // ====== CONTACT FORM ======
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSending(true);
    const fd = new FormData(e.currentTarget);
    const contactData = {
      name: fd.get('name') as string,
      email: fd.get('email') as string,
      phone: fd.get('phone') as string,
      type: fd.get('type') as string,
      message: fd.get('message') as string,
    };
    const { error } = await supabase.from('contacts').insert(contactData);
    if (error) {
      console.error(error);
      alert('An error occurred. Please try again.');
    } else {
      setFormSent(true);
      await sendNotification('contact', contactData);
    }
    setSending(false);
  }

  // ====== SUBSCRIBE ======
  async function handleSubscribe(e: React.FormEvent) {
    e.preventDefault();
    if (!email) return;
    const { error } = await supabase.from('subscribers').insert({
      email, source: 'homepage',
    });
    if (error) {
      alert('Subscription failed. Please try again.');
    } else {
      setSubbed(true);
      setEmail('');
      await sendNotification('subscriber', { email, source: 'homepage' });
    }
  }

  // ====== FACILITY FORM ======
  function FacilityForm() {
    const [fSent, setFSent] = useState(false);
    const [fSending, setFSending] = useState(false);
    const f = tx.facilityForm;

    async function handleFacilitySubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setFSending(true);
      const fd = new FormData(e.currentTarget);
      const data = {
        owner_name: fd.get('owner_name') as string,
        owner_email: fd.get('owner_email') as string,
        owner_phone: fd.get('owner_phone') as string,
        country: fd.get('country') as string,
        city: fd.get('city') as string,
        gpu_type: fd.get('gpu_type') as string,
        gpu_count: parseInt(fd.get('gpu_count') as string)||0,
        gpu_condition: fd.get('gpu_condition') as string,
        has_cooling: fd.get('has_cooling') === 'yes',
        has_internet: fd.get('has_internet') === 'yes',
        electricity_cost: fd.get('electricity_cost') as string,
        facility_size: fd.get('facility_size') as string,
        monthly_rent_expectation: fd.get('monthly_rent_expectation') as string,
        notes: fd.get('notes') as string,
      };
      const { error } = await supabase.from('facilities').insert(data);
      if (error) { alert('Error. Please try again.'); }
      else { setFSent(true); await sendNotification('facility', data); }
      setFSending(false);
    }

    if (fSent) return (
      <div style={{background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',
        borderRadius:'16px',padding:'40px',textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'12px'}}>🏭</div>
        <h3 style={{color:'#d4af37',fontSize:'22px',fontFamily:'Georgia,serif'}}>
          {f.successTitle}</h3>
        <p style={{color:'#777',marginTop:'8px'}}>{f.successSub}</p>
      </div>
    );

    return (
      <form onSubmit={handleFacilitySubmit}
        style={{display:'grid',gap:'14px',background:'rgba(212,175,55,0.02)',
          border:'1px solid rgba(212,175,55,0.08)',borderRadius:'20px',padding:'32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <input name="owner_name" placeholder={f.ownerName} required style={inputStyle}/>
          <input name="owner_email" placeholder={f.ownerEmail} type="email" required style={inputStyle}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <input name="owner_phone" placeholder={f.ownerPhone} style={inputStyle}/>
          <input name="country" placeholder={f.country} required style={inputStyle}/>
        </div>
        <input name="city" placeholder={f.city} style={inputStyle}/>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <select name="gpu_type" style={{...inputStyle,color:'#777'}}>
            <option value="">{f.gpuType}</option>
            {['RTX 3070','RTX 3080','RTX 3090','RTX 4090','A100','H100','Mixed'].map(g=>(
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
          <input name="gpu_count" placeholder={f.gpuCount} type="number" required style={inputStyle}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <select name="gpu_condition" style={{...inputStyle,color:'#777'}}>
            <option value="">{f.gpuCondition}</option>
            <option value="new">{lang==='tr'?'Yeni (Kullanılmamış)':'New (Unused)'}</option>
            <option value="like_new">{lang==='tr'?'Yeni Gibi':'Like New'}</option>
            <option value="good">{lang==='tr'?'İyi (Kullanılmış)':'Good (Used)'}</option>
            <option value="fair">{lang==='tr'?'Orta':'Fair'}</option>
          </select>
          <input name="electricity_cost" placeholder={f.electricityCost} style={inputStyle}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <select name="has_cooling" style={{...inputStyle,color:'#777'}}>
            <option value="no">{f.coolingQ}</option>
            <option value="yes">{f.yes}</option>
            <option value="no">{f.no}</option>
          </select>
          <select name="has_internet" style={{...inputStyle,color:'#777'}}>
            <option value="no">{f.internetQ}</option>
            <option value="yes">{f.yes}</option>
            <option value="no">{f.no}</option>
          </select>
        </div>
        <input name="facility_size" placeholder={f.facilitySize} style={inputStyle}/>
        <input name="monthly_rent_expectation" placeholder={f.rentExpect} style={inputStyle}/>
        <textarea name="notes" placeholder={f.notes} rows={3}
          style={{...inputStyle,resize:'vertical'}}/>
        <button type="submit" disabled={fSending}
          style={{background:fSending?'#666':'linear-gradient(135deg,#d4af37,#b8860b)',
            color:'#050508',padding:'16px',borderRadius:'10px',fontWeight:'bold',
            fontSize:'15px',border:'none',cursor:fSending?'wait':'pointer',
            letterSpacing:'3px',fontFamily:'Georgia,serif'}}>
          {fSending ? f.submitting : f.submit}
        </button>
      </form>
    );
  }

  // ====== GPU RENT FORM ======
  function GpuRentForm() {
    const [rSent, setRSent] = useState(false);
    const [rSending, setRSending] = useState(false);
    const r = tx.rentForm;

    async function handleRentSubmit(e: React.FormEvent<HTMLFormElement>) {
      e.preventDefault();
      setRSending(true);
      const fd = new FormData(e.currentTarget);
      const data = {
        company_name: fd.get('company_name') as string,
        contact_name: fd.get('contact_name') as string,
        email: fd.get('email') as string,
        phone: fd.get('phone') as string,
        gpu_type_needed: fd.get('gpu_type_needed') as string,
        gpu_count_needed: parseInt(fd.get('gpu_count_needed') as string)||0,
        usage_type: fd.get('usage_type') as string,
        budget: fd.get('budget') as string,
        duration: fd.get('duration') as string,
        notes: fd.get('notes') as string,
      };
      const { error } = await supabase.from('gpu_renters').insert(data);
      if (error) { alert('Error. Please try again.'); }
      else { setRSent(true); await sendNotification('gpu_renter', data); }
      setRSending(false);
    }

    if (rSent) return (
      <div style={{background:'rgba(212,175,55,0.08)',border:'1px solid rgba(212,175,55,0.2)',
        borderRadius:'16px',padding:'40px',textAlign:'center'}}>
        <div style={{fontSize:'48px',marginBottom:'12px'}}>🖥️</div>
        <h3 style={{color:'#d4af37',fontSize:'22px',fontFamily:'Georgia,serif'}}>
          {r.successTitle}</h3>
        <p style={{color:'#777',marginTop:'8px'}}>{r.successSub}</p>
      </div>
    );

    return (
      <form onSubmit={handleRentSubmit}
        style={{display:'grid',gap:'14px',background:'rgba(212,175,55,0.02)',
          border:'1px solid rgba(212,175,55,0.08)',borderRadius:'20px',padding:'32px'}}>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <input name="company_name" placeholder={r.company} style={inputStyle}/>
          <input name="contact_name" placeholder={r.contact} required style={inputStyle}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <input name="email" placeholder={r.email} type="email" required style={inputStyle}/>
          <input name="phone" placeholder={r.phone} style={inputStyle}/>
        </div>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <select name="gpu_type_needed" style={{...inputStyle,color:'#777'}}>
            <option value="">{r.gpuType}</option>
            {['RTX 3090 (24GB)','RTX 4090 (24GB)','A100 (40GB/80GB)','H100 (80GB)',
              lang==='tr'?'Herhangi Biri':'Any Available'].map((g,i)=>(
              <option key={i} value={g.split(' ')[0]}>{g}</option>
            ))}
          </select>
          <input name="gpu_count_needed" placeholder={r.gpuCount}
            type="number" required style={inputStyle}/>
        </div>
        <select name="usage_type" style={{...inputStyle,color:'#777'}}>
          <option value="">{r.usage}</option>
          {r.usageOptions.map(o=>(
            <option key={o.v} value={o.v}>{o.l}</option>
          ))}
        </select>
        <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:'14px'}}>
          <select name="budget" style={{...inputStyle,color:'#777'}}>
            <option value="">{r.budget}</option>
            {r.budgetOptions.map(o=>(
              <option key={o.v} value={o.v}>{o.l}</option>
            ))}
          </select>
          <select name="duration" style={{...inputStyle,color:'#777'}}>
            <option value="">{r.duration}</option>
            {r.durationOptions.map(o=>(
              <option key={o.v} value={o.v}>{o.l}</option>
            ))}
          </select>
        </div>
        <textarea name="notes" placeholder={r.notes} rows={3}
          style={{...inputStyle,resize:'vertical'}}/>
        <button type="submit" disabled={rSending}
          style={{background:rSending?'#666':'linear-gradient(135deg,#d4af37,#b8860b)',
            color:'#050508',padding:'16px',borderRadius:'10px',fontWeight:'bold',
            fontSize:'15px',border:'none',cursor:rSending?'wait':'pointer',
            letterSpacing:'3px',fontFamily:'Georgia,serif'}}>
          {rSending ? r.submitting : r.submit}
        </button>
      </form>
    );
  }

  // ====== EXIT INTENT POPUP ======
  const [showPopup, setShowPopup] = useState(false);
  const [popupShown, setPopupShown] = useState(false);

  useEffect(() => {
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !popupShown) {
        setShowPopup(true);
        setPopupShown(true);
      }
    };
    document.addEventListener('mouseleave', handleMouseLeave);
    return () => document.removeEventListener('mouseleave', handleMouseLeave);
  }, [popupShown]);

  // ====== REFERRAL BOX ======
  function ReferralBox({ lang }: { lang: Lang }) {
    const [refEmail, setRefEmail] = useState('');
    const [refCode, setRefCode] = useState('');
    const [loading, setLoading] = useState(false);

    async function getCode() {
      if (!refEmail) return alert(lang === 'tr' ? 'Email girin' : 'Enter email');
      setLoading(true);
      const res = await fetch('/api/referral', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'create', referrer_email: refEmail }),
      });
      const data = await res.json();
      if (data.success) setRefCode(data.code);
      else alert('Hata: ' + data.error);
      setLoading(false);
    }

    return (
      <div style={{background:'rgba(212,175,55,0.03)',border:'1px solid rgba(212,175,55,0.12)',
        borderRadius:'16px',padding:'28px'}}>
        {!refCode ? (
          <>
            <input type="email" placeholder={lang==='tr'?'Email adresiniz':'Your email'}
              value={refEmail} onChange={e=>setRefEmail(e.target.value)}
              style={{padding:'14px',borderRadius:'10px',background:'#0a0a10',
                border:'1px solid rgba(212,175,55,0.15)',color:'white',fontSize:'14px',
                width:'100%',outline:'none',boxSizing:'border-box',marginBottom:'12px'}}/>
            <button onClick={getCode} disabled={loading}
              style={{width:'100%',background:'linear-gradient(135deg,#d4af37,#b8860b)',
                color:'#050508',padding:'14px',borderRadius:'10px',fontWeight:'bold',
                fontSize:'14px',border:'none',cursor:'pointer',letterSpacing:'2px'}}>
              {loading ? '...' : lang==='tr'?'REFERRAL KODU AL':'GET MY CODE'}
            </button>
          </>
        ) : (
          <>
            <p style={{color:'#4ade80',marginBottom:'12px',fontSize:'14px'}}>
              ✅ {lang==='tr'?'Referral kodunuz hazır!':'Your referral code is ready!'}
            </p>
            <div style={{background:'#0a0a10',border:'1px solid rgba(212,175,55,0.3)',
              borderRadius:'10px',padding:'16px',fontSize:'24px',fontWeight:'bold',
              color:'#d4af37',letterSpacing:'4px',fontFamily:'Georgia,serif',
              marginBottom:'12px'}}>
              {refCode}
            </div>
            <p style={{color:'#666',fontSize:'12px'}}>
              {lang==='tr'
                ? 'Bu kodu arkadaşlarınla paylaş. Kullandıklarında $50 komisyon kazanırsın!'
                : 'Share this code with friends. Earn $50 when they use it!'}
            </p>
            <button onClick={() => {navigator.clipboard.writeText(refCode); alert('Kopyalandı!');}}
              style={{marginTop:'12px',background:'rgba(212,175,55,0.1)',border:'1px solid rgba(212,175,55,0.2)',
                color:'#d4af37',padding:'10px 24px',borderRadius:'8px',cursor:'pointer',fontSize:'13px'}}>
              📋 {lang==='tr'?'Kopyala':'Copy'}
            </button>
          </>
        )}
      </div>
    );
  }

  // ====== RETURN ======
  return (
    <div style={{minHeight:'100vh',background:'#050508',color:'white',
      fontFamily:"'Segoe UI',system-ui,sans-serif"}}>

      {/* ====== NAVBAR ====== */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',
        padding:'12px 40px',borderBottom:'1px solid rgba(212,175,55,0.08)',
        position:'sticky',top:0,background:'rgba(5,5,8,0.95)',
        backdropFilter:'blur(20px)',zIndex:100,flexWrap:'wrap',gap:'8px'}}>

        <a href="#" style={{textDecoration:'none'}}><CrownLogo size="nav"/></a>

        {/* Desktop Menü */}
        <div style={{display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
          {[
            {label:tx.nav.howItWorks,href:'#how'},
            {label:tx.nav.calculator,href:'#calc'},
            {label:tx.nav.gpuPricing,href:'#gpupricing'},
            {label:tx.nav.listFacility,href:'#facility-form'},
            {label:tx.nav.rentGpus,href:'#rent-form'},
            {label:tx.nav.blog,href:'/blog'},
            {label:tx.nav.contact,href:'#contact'},
          ].map(link=>(
            <a key={link.label} href={link.href}
              style={{color:'#777',textDecoration:'none',
                fontSize:'13px',letterSpacing:'1px'}}>
              {link.label}
            </a>
          ))}

          {/* Dil Seçici */}
          <div style={{display:'flex',gap:'2px',background:'rgba(255,255,255,0.04)',
            borderRadius:'8px',padding:'3px',border:'1px solid rgba(212,175,55,0.1)'}}>
            {(['en','tr','de','fr','ar','ja','ko'] as Lang[]).map(l => (
              <button key={l} onClick={() => switchLang(l)}
                style={{padding:'6px 14px',borderRadius:'6px',border:'none',
                  cursor:'pointer',fontSize:'11px',fontWeight:'bold',
                  letterSpacing:'2px',transition:'all 0.2s',
                  background: lang === l
                    ? 'linear-gradient(135deg,#d4af37,#b8860b)'
                    : 'transparent',
                  color: lang === l ? '#050508' : '#666'}}>
                {l.toUpperCase()}
              </button>
            ))}
          </div>

          <a href="#contact"
            style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',
              color:'#050508',padding:'10px 24px',borderRadius:'6px',
              fontWeight:'bold',fontSize:'12px',textDecoration:'none',
              letterSpacing:'2px'}}>
            {tx.nav.getStarted}
          </a>
        </div>
      </nav>

      {/* ====== HERO ====== */}
      <header style={{textAlign:'center',padding:'100px 20px 80px',
        maxWidth:'900px',margin:'0 auto',position:'relative'}}>
        <div style={{position:'absolute',top:'50%',left:'50%',
          transform:'translate(-50%,-50%)',width:'600px',height:'400px',
          background:'radial-gradient(ellipse,rgba(212,175,55,0.05)0%,transparent 70%)',
          pointerEvents:'none'}}/>
        <CrownLogo size="large"/>
        <p style={{fontSize:'19px',color:'#8892b0',maxWidth:'640px',
          margin:'28px auto 0',lineHeight:'1.8'}}>
          {tx.hero.subtitle}
          <br/>
          <span style={{color:'#d4af37'}}>{tx.hero.highlight}</span>
        </p>
        <div style={{display:'flex',gap:'16px',justifyContent:'center',
          marginTop:'36px',flexWrap:'wrap'}}>
          <a href="#calc"
            style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',
              color:'#050508',padding:'16px 36px',borderRadius:'8px',
              fontWeight:'bold',fontSize:'15px',textDecoration:'none',
              letterSpacing:'2px'}}>
            {tx.hero.calcBtn}
          </a>
          <a href="#contact"
            style={{border:'1px solid rgba(212,175,55,0.4)',color:'#d4af37',
              padding:'16px 36px',borderRadius:'8px',fontWeight:'bold',
              fontSize:'15px',textDecoration:'none',letterSpacing:'2px'}}>
            {tx.hero.contactBtn}
          </a>
        </div>
      </header>

      {/* ====== STATS ====== */}
      <section style={{display:'flex',justifyContent:'center',gap:'50px',
        padding:'45px 20px',flexWrap:'wrap',
        borderTop:'1px solid rgba(212,175,55,0.06)',
        borderBottom:'1px solid rgba(212,175,55,0.06)',
        maxWidth:'900px',margin:'0 auto'}}>
        {tx.stats.map((s,i)=>(
          <div key={i} style={{textAlign:'center'}}>
            <div style={{fontSize:'13px',marginBottom:'4px'}}>{s.i}</div>
            <div style={{fontSize:'30px',fontWeight:'bold',color:'#d4af37',
              fontFamily:'Georgia,serif'}}>{s.n}</div>
            <div style={{fontSize:'11px',color:'#555',maxWidth:'130px',
              letterSpacing:'1px'}}>{s.l}</div>
          </div>
        ))}
      </section>

      {/* ====== PROBLEM / SOLUTION ====== */}
      <section style={{padding:'90px 20px',maxWidth:'1000px',margin:'0 auto'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'50px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.problem.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.problem.titleGold}</span>
        </h2>
        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(300px,1fr))',gap:'24px'}}>
          <div style={{background:'linear-gradient(145deg,rgba(255,50,50,0.04),rgba(0,0,0,0.3))',
            border:'1px solid rgba(255,50,50,0.12)',borderRadius:'16px',padding:'32px'}}>
            <h3 style={{color:'#ff6b6b',fontSize:'20px',marginBottom:'16px',
              fontFamily:'Georgia,serif'}}>{tx.problem.miningTitle}</h3>
            <ul style={{listStyle:'none',padding:0,lineHeight:'2.2',
              color:'#888',fontSize:'14px'}}>
              {tx.problem.mining.map(t=>(
                <li key={t}>📉 {t}</li>
              ))}
            </ul>
          </div>
          <div style={{background:'linear-gradient(145deg,rgba(212,175,55,0.04),rgba(0,0,0,0.3))',
            border:'1px solid rgba(212,175,55,0.12)',borderRadius:'16px',padding:'32px'}}>
            <h3 style={{color:'#d4af37',fontSize:'20px',marginBottom:'16px',
              fontFamily:'Georgia,serif'}}>{tx.problem.dwyrexTitle}</h3>
            <ul style={{listStyle:'none',padding:0,lineHeight:'2.2',
              color:'#ccc',fontSize:'14px'}}>
              {tx.problem.dwyrex.map(t=>(
                <li key={t}>✅ {t}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {/* ====== HOW IT WORKS ====== */}
      <section id="how" style={{padding:'90px 20px',maxWidth:'800px',margin:'0 auto'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'50px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.how.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.how.titleGold}</span>
        </h2>
        <div style={{display:'grid',gap:'16px'}}>
          {tx.how.steps.map(item=>(
            <div key={item.s} style={{display:'flex',gap:'20px',alignItems:'center',
              background:'rgba(212,175,55,0.02)',
              border:'1px solid rgba(212,175,55,0.06)',
              borderRadius:'12px',padding:'24px'}}>
              <div style={{background:'linear-gradient(135deg,#d4af37,#050508)',
                width:'50px',height:'50px',borderRadius:'10px',display:'flex',
                alignItems:'center',justifyContent:'center',fontWeight:'bold',
                fontSize:'13px',flexShrink:0,fontFamily:'Georgia,serif',
                color:'#050508'}}>{item.s}</div>
              <div>
                <div style={{fontSize:'18px',fontWeight:'bold',marginBottom:'3px',
                  fontFamily:'Georgia,serif'}}>{item.i} {item.t}</div>
                <div style={{color:'#777',fontSize:'13px'}}>{item.d}</div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== CALCULATOR ====== */}
      <section id="calc" style={{padding:'90px 20px',maxWidth:'680px',margin:'0 auto'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'50px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.calc.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.calc.titleGold}</span>
        </h2>
        <div style={{background:'linear-gradient(145deg,rgba(212,175,55,0.03),rgba(0,0,0,0.4))',
          border:'1px solid rgba(212,175,55,0.12)',borderRadius:'20px',padding:'36px'}}>
          <div style={{marginBottom:'24px'}}>
            <label style={{display:'block',marginBottom:'8px',color:'#777',
              fontSize:'12px',letterSpacing:'2px'}}>{tx.calc.gpuType}</label>
            <select value={gpu} onChange={e=>setGpu(e.target.value)}
              style={{...inputStyle,color:'#d4af37',fontFamily:'Georgia,serif'}}>
              <option value="rtx3090">NVIDIA RTX 3090 (24GB)</option>
              <option value="rtx4090">NVIDIA RTX 4090 (24GB)</option>
              <option value="a100">NVIDIA A100 (40GB)</option>
              <option value="h100">NVIDIA H100 (80GB)</option>
            </select>
          </div>
          <div style={{marginBottom:'32px'}}>
            <label style={{display:'block',marginBottom:'8px',color:'#777',
              fontSize:'12px',letterSpacing:'2px'}}>
              {tx.calc.gpuCount}:{' '}
              <span style={{color:'#d4af37',fontSize:'22px',
                fontFamily:'Georgia,serif'}}>{count}</span>
            </label>
            <input type="range" min="10" max="1000" step="10" value={count}
              onChange={e=>setCount(Number(e.target.value))}
              style={{width:'100%',accentColor:'#d4af37'}}/>
            <div style={{display:'flex',justifyContent:'space-between',
              color:'#333',fontSize:'10px'}}>
              <span>10</span><span>250</span><span>500</span>
              <span>750</span><span>1000</span>
            </div>
          </div>
          <div style={{background:'rgba(255,50,50,0.05)',borderRadius:'12px',
            padding:'18px',marginBottom:'14px',
            border:'1px solid rgba(255,50,50,0.08)'}}>
            <div style={{color:'#ff6b6b',fontSize:'11px',letterSpacing:'2px'}}>
              {tx.calc.miningLabel}</div>
            <div style={{fontSize:'32px',fontWeight:'bold',color:'#ff6b6b',
              fontFamily:'Georgia,serif'}}>
              ${loss.toLocaleString()}<span style={{fontSize:'14px'}}>/mo</span>
            </div>
          </div>
          <div style={{background:'rgba(212,175,55,0.05)',borderRadius:'12px',
            padding:'18px',marginBottom:'14px',
            border:'1px solid rgba(212,175,55,0.12)'}}>
            <div style={{color:'#d4af37',fontSize:'11px',letterSpacing:'2px'}}>
              {tx.calc.dwyrexLabel}</div>
            <div style={{fontSize:'32px',fontWeight:'bold',color:'#d4af37',
              fontFamily:'Georgia,serif'}}>
              ${rent.toLocaleString()}<span style={{fontSize:'14px'}}>/mo</span>
            </div>
          </div>
          <div style={{background:'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(255,215,0,0.04))',
            borderRadius:'12px',padding:'22px',
            border:'1px solid rgba(212,175,55,0.2)'}}>
            <div style={{color:'#ffd700',fontSize:'11px',letterSpacing:'2px'}}>
              {tx.calc.annualLabel}</div>
            <div style={{fontSize:'42px',fontWeight:'bold',color:'#ffd700',
              fontFamily:'Georgia,serif'}}>
              ${year.toLocaleString()}<span style={{fontSize:'16px'}}>/yr</span>
            </div>
          </div>
        </div>
      </section>

      {/* ====== CANLI GPU FİYATLARI ====== */}
      <section id="gpupricing" style={{padding:'90px 20px',maxWidth:'900px',
        margin:'0 auto',borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'20px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.pricing.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.pricing.titleGold}</span>?
        </h2>
        <p style={{textAlign:'center',color:'#666',marginBottom:'50px',fontSize:'16px'}}>
          {tx.pricing.subtitle}</p>
        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(200px,1fr))',gap:'20px'}}>
          <div style={{display:'flex',alignItems:'center',gap:'8px',justifyContent:'center',marginBottom:'24px'}}>
            <div style={{width:'8px',height:'8px',borderRadius:'50%',background:'#4ade80',
              animation:'pulse 2s infinite'}}/>
            <span style={{color:'#4ade80',fontSize:'12px',letterSpacing:'2px'}}>CANLI FİYATLAR</span>
          </div>
          {[
            {g:'RTX 3090',v:'24GB',h:'$0.35/hr',a:'$1.10/hr',sv:'68%',owner:'$0.14/hr'},
            {g:'RTX 4090',v:'24GB',h:'$0.55/hr',a:'$1.80/hr',sv:'69%',owner:'$0.22/hr'},
            {g:'A100',v:'40GB',h:'$1.49/hr',a:'$4.10/hr',sv:'64%',owner:'$0.60/hr'},
            {g:'H100',v:'80GB',h:'$2.49/hr',a:'$8.00/hr',sv:'69%',owner:'$1.00/hr'},
          ].map(item=>(
            <div key={item.g} style={{background:'rgba(212,175,55,0.02)',
              border:'1px solid rgba(212,175,55,0.08)',borderRadius:'14px',
              padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'20px',fontWeight:'bold',color:'#d4af37',
                fontFamily:'Georgia,serif'}}>{item.g}</div>
              <div style={{color:'#555',fontSize:'12px',marginBottom:'12px'}}>
                {item.v} VRAM</div>
              <div style={{fontSize:'28px',fontWeight:'bold',color:'#ffd700',
                fontFamily:'Georgia,serif'}}>{item.h}</div>
              <div style={{color:'#ff6b6b',fontSize:'11px',marginTop:'8px',
                textDecoration:'line-through'}}>AWS: {item.a}</div>
              <div style={{color:'#d4af37',fontSize:'13px',fontWeight:'bold',
                marginTop:'4px'}}>
                {lang==='tr'?'Tasarruf':'Save'} {item.sv}
              </div>
             
            </div>
          ))}
        </div>
      </section>

      {/* ====== TRUST ====== */}
      <section style={{padding:'90px 20px',maxWidth:'900px',margin:'0 auto'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'50px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.trust.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.trust.titleGold}</span>
        </h2>
        <div style={{display:'grid',
          gridTemplateColumns:'repeat(auto-fit,minmax(240px,1fr))',gap:'20px'}}>
          {tx.trust.items.map(item=>(
            <div key={item.t} style={{background:'rgba(212,175,55,0.02)',
              border:'1px solid rgba(212,175,55,0.06)',borderRadius:'14px',
              padding:'24px',textAlign:'center'}}>
              <div style={{fontSize:'28px',marginBottom:'10px'}}>{item.i}</div>
              <div style={{fontSize:'15px',fontWeight:'bold',marginBottom:'6px',
                fontFamily:'Georgia,serif',color:'#d4af37'}}>{item.t}</div>
              <div style={{color:'#777',fontSize:'12px',lineHeight:'1.6'}}>{item.d}</div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== REFERRAL ====== */}
      <section style={{padding:'60px 20px',maxWidth:'600px',margin:'0 auto',textAlign:'center',
        borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <div style={{fontSize:'40px',marginBottom:'12px'}}>🤝</div>
        <h2 style={{fontSize:'28px',fontFamily:'Georgia,serif',marginBottom:'12px'}}>
          {lang==='tr'?'Arkadaşını Getir':'Refer & Earn'}
          {' '}<span style={{color:'#d4af37'}}>{lang==='tr'?'$50 Kazan':'$50 Commission'}</span>
        </h2>
        <p style={{color:'#666',fontSize:'14px',marginBottom:'28px'}}>
          {lang==='tr'
            ? 'Her başarılı yönlendirme için $50 komisyon kazan. Tesis sahibi veya GPU kiracısı olsun.'
            : 'Earn $50 for every successful referral. Whether facility owner or GPU renter.'}
        </p>
        <ReferralBox lang={lang}/>
      </section>

      {/* ====== SUBSCRIBE ====== */}
      <section style={{padding:'60px 20px',maxWidth:'500px',
        margin:'0 auto',textAlign:'center'}}>
        <h3 style={{fontSize:'22px',fontFamily:'Georgia,serif',marginBottom:'12px'}}>
          📧 {tx.subscribe.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.subscribe.titleGold}</span>
        </h3>
        <p style={{color:'#666',fontSize:'14px',marginBottom:'20px'}}>
          {tx.subscribe.subtitle}</p>
        {subbed ? (
          <p style={{color:'#d4af37',fontSize:'16px'}}>{tx.subscribe.success}</p>
        ) : (
          <form onSubmit={handleSubscribe} style={{display:'flex',gap:'10px'}}>
            <input type="email" placeholder={tx.subscribe.placeholder}
              value={email} onChange={e=>setEmail(e.target.value)} required
              style={{...inputStyle,flex:1}}/>
            <button type="submit"
              style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',
                color:'#050508',padding:'15px 24px',borderRadius:'10px',
                fontWeight:'bold',fontSize:'14px',border:'none',
                cursor:'pointer',whiteSpace:'nowrap'}}>
              {tx.subscribe.btn}
            </button>
          </form>
        )}
      </section>

      {/* ====== FACILITY FORM ====== */}
      <section id="facility-form" style={{padding:'90px 20px',maxWidth:'680px',
        margin:'0 auto',borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'12px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.facilityForm.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.facilityForm.titleGold}</span>
        </h2>
        <p style={{textAlign:'center',color:'#555',marginBottom:'36px',fontSize:'14px'}}>
          {tx.facilityForm.subtitle}</p>
        <FacilityForm />
      </section>

      {/* ====== GPU RENT FORM ====== */}
      <section id="rent-form" style={{padding:'90px 20px',maxWidth:'680px',
        margin:'0 auto',borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'12px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.rentForm.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.rentForm.titleGold}</span>
        </h2>
        <p style={{textAlign:'center',color:'#555',marginBottom:'36px',fontSize:'14px'}}>
          {tx.rentForm.subtitle}</p>
        <GpuRentForm />
      </section>

      {/* ====== CONTACT FORM ====== */}
      <section id="contact" style={{padding:'90px 20px',maxWidth:'580px',
        margin:'0 auto'}}>
        <h2 style={{textAlign:'center',fontSize:'34px',marginBottom:'12px',
          fontFamily:'Georgia,serif',letterSpacing:'3px'}}>
          {tx.contact.title}{' '}
          <span style={{color:'#d4af37'}}>{tx.contact.titleGold}</span>
        </h2>
        <p style={{textAlign:'center',color:'#555',marginBottom:'36px',fontSize:'14px'}}>
          {tx.contact.subtitle}</p>

        {formSent ? (
          <div style={{background:'rgba(212,175,55,0.08)',
            border:'1px solid rgba(212,175,55,0.2)',
            borderRadius:'16px',padding:'40px',textAlign:'center'}}>
            <div style={{fontSize:'48px',marginBottom:'12px'}}>👑</div>
            <h3 style={{color:'#d4af37',fontSize:'22px',fontFamily:'Georgia,serif'}}>
              {tx.contact.successTitle}</h3>
            <p style={{color:'#777',marginTop:'8px'}}>{tx.contact.successSub}</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{display:'grid',gap:'14px'}}>
            <input name="name" placeholder={tx.contact.name}
              required style={inputStyle}/>
            <input name="email" placeholder={tx.contact.email}
              type="email" required style={inputStyle}/>
            <input name="phone" placeholder={tx.contact.phone}
              type="tel" style={inputStyle}/>
            <select name="type" style={{...inputStyle,color:'#777'}}>
              {tx.contact.typeOptions.map(o=>(
                <option key={o}>{o}</option>
              ))}
            </select>
            <textarea name="message" placeholder={tx.contact.message}
              rows={4} style={{...inputStyle,resize:'vertical'}}/>
            <button type="submit" disabled={sending}
              style={{background:sending
                ?'#666':'linear-gradient(135deg,#d4af37,#b8860b)',
                color:'#050508',padding:'16px',borderRadius:'10px',
                fontWeight:'bold',fontSize:'15px',border:'none',
                cursor:sending?'wait':'pointer',
                letterSpacing:'3px',fontFamily:'Georgia,serif'}}>
              {sending ? tx.contact.submitting : tx.contact.submit}
            </button>
          </form>
        )}
      </section>

      {/* ====== WHATSAPP BUTONU ====== */}
      <a href="https://wa.me/905458701196" target="_blank" rel="noopener noreferrer"
        style={{position:'fixed',bottom:'24px',right:'24px',zIndex:9999,
          background:'#25D366',borderRadius:'50%',width:'60px',height:'60px',
          display:'flex',alignItems:'center',justifyContent:'center',
          boxShadow:'0 4px 20px rgba(37,211,102,0.4)',textDecoration:'none',
          transition:'transform 0.2s ease'}}
        onMouseEnter={e=>(e.currentTarget.style.transform='scale(1.1)')}
        onMouseLeave={e=>(e.currentTarget.style.transform='scale(1)')}>
        <svg width="32" height="32" viewBox="0 0 24 24" fill="white">
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
        </svg>
      </a>

      {/* ====== EXIT INTENT POPUP ====== */}
      {showPopup && (
        <div style={{position:'fixed',inset:0,background:'rgba(0,0,0,0.8)',zIndex:10000,
          display:'flex',alignItems:'center',justifyContent:'center',padding:'20px'}}>
          <div style={{background:'#0a0a10',border:'1px solid rgba(212,175,55,0.3)',
            borderRadius:'20px',padding:'48px',maxWidth:'480px',width:'100%',textAlign:'center',
            position:'relative'}}>
            <button onClick={() => setShowPopup(false)}
              style={{position:'absolute',top:'16px',right:'16px',background:'transparent',
                border:'none',color:'#555',fontSize:'24px',cursor:'pointer',lineHeight:1}}>×</button>
            <div style={{fontSize:'48px',marginBottom:'16px'}}>⚡</div>
            <h2 style={{color:'#d4af37',fontSize:'28px',fontFamily:'Georgia,serif',
              marginBottom:'12px'}}>Bekle!</h2>
            <p style={{color:'#aaa',fontSize:'16px',lineHeight:'1.7',marginBottom:'28px'}}>
              GPU tesisini boşa harcama. <strong style={{color:'white'}}>Ücretsiz değerleme</strong> için şimdi iletişime geç — 48 saat içinde sana özel teklif hazırlayalım.
            </p>
            <div style={{display:'flex',gap:'12px',flexDirection:'column'}}>
              <a href="#contact" onClick={() => setShowPopup(false)}
                style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',
                  padding:'16px',borderRadius:'10px',fontWeight:'bold',fontSize:'15px',
                  textDecoration:'none',letterSpacing:'2px'}}>
                ÜCRETSİZ DEĞERLEMEYİ AL
              </a>
              <button onClick={() => setShowPopup(false)}
                style={{background:'transparent',border:'none',color:'#444',
                  fontSize:'13px',cursor:'pointer',padding:'8px'}}>
                Hayır, gerek yok
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ====== FOOTER ====== */}
      <footer style={{textAlign:'center',padding:'50px 20px',
        borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <p style={{color:'#d4af37',fontSize:'14px',letterSpacing:'8px',
          fontFamily:'Georgia,serif'}}>D W Y R E X</p>
        <p style={{color:'#333',fontSize:'9px',letterSpacing:'4px',marginTop:'8px'}}>
          {tx.footer.tagline}</p>
        <div style={{marginTop:'20px',display:'flex',justifyContent:'center',gap:'20px'}}>
          {[
            {name:'Twitter',url:'https://twitter.com/dwyrex'},
            {name:'LinkedIn',url:'https://linkedin.com/company/dwyrex'},
            {name:'Discord',url:'#'},
            {name:'GitHub',url:'https://github.com/dwyrex'},
          ].map(s=>(
            <a key={s.name} href={s.url} target="_blank" rel="noopener noreferrer"
              style={{color:'#444',fontSize:'11px',textDecoration:'none',
                letterSpacing:'2px'}}>{s.name}</a>
          ))}
        </div>

        {/* Dil seçici footer'da da */}
        <div style={{marginTop:'16px',display:'flex',justifyContent:'center',gap:'4px'}}>
         {(['en','tr','de','fr','ar','ja','ko'] as Lang[]).map(l => (
              <button key={l} onClick={() => switchLang(l)}
              style={{padding:'4px 12px',borderRadius:'6px',border:'none',
                cursor:'pointer',fontSize:'10px',fontWeight:'bold',
                letterSpacing:'2px',
                background: lang === l
                  ? 'rgba(212,175,55,0.2)' : 'transparent',
                color: lang === l ? '#d4af37' : '#333'}}>
              {l.toUpperCase()}
            </button>
          ))}
        </div>

        <p style={{color:'#1a1a1a',fontSize:'8px',letterSpacing:'3px',marginTop:'12px'}}>
          © 2025 DWYREX — ALL RIGHTS RESERVED</p>
      </footer>
    </div>
  );
}