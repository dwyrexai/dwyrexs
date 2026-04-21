'use client';
import { useEffect } from 'react';
import { supabase } from '../../lib/supabase';

function CrownLogoNav() {
  return (
    <svg width="160" height="45" viewBox="0 0 400 100" style={{display:'block'}}>
      <defs>
        <linearGradient id="gN" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#d4af37"/><stop offset="100%" stopColor="#ffd700"/>
        </linearGradient>
        <filter id="glN"><feGaussianBlur stdDeviation="1.5" result="b"/>
          <feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge>
        </filter>
      </defs>
      <polygon points="160,18 167,5 174,12 180,0 186,10 192,0 198,12 205,5 212,18"
        fill="none" stroke="#ffd700" strokeWidth="1.2" strokeLinejoin="round" filter="url(#glN)"/>
      <line x1="160" y1="18" x2="212" y2="18" stroke="#ffd700" strokeWidth="1.2" filter="url(#glN)"/>
      <circle cx="180" cy="0" r="2" fill="#ffd700" filter="url(#glN)"/>
      <circle cx="192" cy="0" r="2" fill="#ffd700" filter="url(#glN)"/>
      <text x="70" y="62" fontFamily="Georgia,serif" fontSize="40" fontWeight="bold"
        fill="url(#gN)" letterSpacing="8" filter="url(#glN)">DWYREX</text>
    </svg>
  );
}

const articles = [
  {
    id: 1,
    tag: 'FEATURED ARTICLE — 2025',
    title: 'Why Idle Mining Farms Are the',
    titleGold: 'Most Valuable Assets in AI Right Now',
    author: 'DWYREX Team',
    readTime: '8 min read',
    content: [
      { type: 'p', text: 'The AI industry has a massive problem: there aren\'t enough GPUs. While companies like OpenAI, Google, and Meta are spending billions on GPU infrastructure, thousands of perfectly capable GPUs are sitting idle in cryptocurrency mining facilities around the world.' },
      { type: 'h3', text: 'The $2.5 Trillion Opportunity' },
      { type: 'p', text: 'The global AI market is projected to reach $2.5 trillion by 2030. Amazon Web Services currently has a 6+ month waitlist for GPU instances. Meanwhile, the cryptocurrency mining industry is experiencing its worst downturn in years — pushing most operations into negative profitability.' },
      { type: 'quote', text: 'The irony is staggering: one industry can\'t find GPUs at any price, while another is sitting on warehouses full of them, losing money every day.' },
      { type: 'h3', text: 'Mining GPUs vs AI GPUs: The Truth' },
      { type: 'p', text: 'A common misconception is that mining GPUs can\'t be used for AI workloads. NVIDIA RTX 3090s have 24GB of VRAM — more than enough for most AI model training and inference tasks.' },
      { type: 'h3', text: 'The DWYREX Model' },
      { type: 'p', text: 'At DWYREX, we connect two desperate markets: mining facility owners with idle GPUs paying electricity bills for no revenue, and AI companies who need GPU compute power at 60-70% lower cost than AWS.' },
      { type: 'code', lines: ['Facility: 100x NVIDIA RTX 3090', 'Current mining income: -$200/month (LOSS)', 'DWYREX monthly payment: $1,800/month (GUARANTEED)', 'Annual income: $21,600/year', 'Swing from loss to profit: $2,000+/month'] },
      { type: 'h3', text: 'The CoreWeave Precedent' },
      { type: 'p', text: 'CoreWeave, a company that started as a cryptocurrency mining operation, pivoted to AI cloud computing and is now valued at over $35 billion. They proved that mining infrastructure can be successfully repurposed for AI workloads.' },
    ]
  },
  {
    id: 2,
    tag: 'GUIDE — 2025',
    title: 'How to Convert Your Mining Farm Into an',
    titleGold: 'AI Compute Center',
    author: 'DWYREX Team',
    readTime: '6 min read',
    content: [
      { type: 'p', text: 'Converting a cryptocurrency mining farm into an AI compute center is simpler than most people think. The hardware is largely compatible — the main changes are in software configuration, networking, and management infrastructure.' },
      { type: 'h3', text: 'Step 1: Hardware Assessment' },
      { type: 'p', text: 'Not all mining GPUs are equally suited for AI workloads. The key metric is VRAM. For most AI applications, you need at minimum 10GB VRAM per GPU. RTX 3070 (8GB) is borderline, RTX 3080 (10GB) and above are ideal.' },
      { type: 'h3', text: 'Step 2: Networking Upgrade' },
      { type: 'p', text: 'AI workloads require significantly more bandwidth than mining. Mining rigs typically use consumer-grade networking. You\'ll need at minimum 1Gbps symmetric connectivity, with 10Gbps recommended for larger facilities.' },
      { type: 'h3', text: 'Step 3: Software Stack' },
      { type: 'p', text: 'Mining software needs to be replaced with AI-ready software stack: Ubuntu Server 22.04, CUDA 12.x drivers, Docker with NVIDIA Container Toolkit, and monitoring tools like Prometheus and Grafana.' },
      { type: 'quote', text: 'The good news: DWYREX handles all software configuration for you. You provide the hardware and power — we handle the rest.' },
      { type: 'h3', text: 'Step 4: Register with DWYREX' },
      { type: 'p', text: 'Once your hardware is assessed and networking is in place, register your facility with DWYREX. Our team will complete the final configuration, connect you to our client network, and begin your guaranteed monthly payments within 48 hours.' },
    ]
  },
  {
    id: 3,
    tag: 'MARKET ANALYSIS — 2025',
    title: 'GPU Rental Market:',
    titleGold: 'Why Prices Will Stay High Until 2027',
    author: 'DWYREX Research',
    readTime: '5 min read',
    content: [
      { type: 'p', text: 'The GPU rental market is experiencing unprecedented demand driven by the AI revolution. Understanding why prices will remain elevated through 2027 is crucial for facility owners making long-term decisions.' },
      { type: 'h3', text: 'Supply Constraints' },
      { type: 'p', text: 'NVIDIA\'s manufacturing capacity is the primary bottleneck. TSMC, which manufactures NVIDIA\'s chips, is operating at near-100% capacity. New fab capacity won\'t come online until late 2026 at the earliest.' },
      { type: 'h3', text: 'Demand Acceleration' },
      { type: 'p', text: 'AI model training compute requirements are doubling every 6 months. GPT-4 required approximately 25,000 A100 GPUs for training. The next generation models will require 10x more compute.' },
      { type: 'quote', text: 'We are in the early innings of a multi-decade AI infrastructure build-out. The demand for GPU compute will only accelerate.' },
      { type: 'h3', text: 'The DWYREX Advantage' },
      { type: 'p', text: 'By partnering with DWYREX now, facility owners lock in long-term contracts at today\'s rates. As market rates increase, your guaranteed payments increase with them. Early partners get priority placement in our growing client network.' },
      { type: 'h3', text: 'Price Projections' },
      { type: 'p', text: 'Based on current market trajectory, GPU rental prices are expected to increase 15-25% annually through 2027. Facility owners partnering with DWYREX today are positioned to benefit significantly from this appreciation.' },
    ]
  },
];

export default function Blog() {
  useEffect(() => {
    supabase.from('page_views').insert({
      page: '/blog',
      referrer: document.referrer || 'direct',
      device: /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    });
  }, []);

  const gold = '#d4af37';

  return (
    <div style={{minHeight:'100vh',background:'#050508',color:'white',fontFamily:"'Segoe UI',system-ui,sans-serif"}}>

      {/* NAV */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',padding:'12px 40px',borderBottom:'1px solid rgba(212,175,55,0.08)',position:'sticky',top:0,background:'rgba(5,5,8,0.95)',backdropFilter:'blur(20px)',zIndex:100,flexWrap:'wrap',gap:'8px'}}>
        <a href="/" style={{textDecoration:'none'}}><CrownLogoNav/></a>
        <div style={{display:'flex',gap:'20px',alignItems:'center',flexWrap:'wrap'}}>
          {[{label:'Ana Sayfa',href:'/'},{label:'Nasıl Çalışır',href:'/#how'},{label:'Hesaplama',href:'/#calc'},{label:'GPU Fiyatları',href:'/#gpupricing'},{label:'Blog',href:'/blog'},{label:'İletişim',href:'/#contact'}].map(link=>(
            <a key={link.label} href={link.href} style={{color:'#777',textDecoration:'none',fontSize:'13px',letterSpacing:'1px'}}>{link.label}</a>
          ))}
          <a href="/#contact" style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'10px 24px',borderRadius:'6px',fontWeight:'bold',fontSize:'12px',textDecoration:'none',letterSpacing:'2px'}}>BAŞLA</a>
        </div>
      </nav>

      {/* HEADER */}
      <header style={{textAlign:'center',padding:'80px 20px 40px',maxWidth:'800px',margin:'0 auto'}}>
        <h1 style={{fontSize:'40px',fontFamily:'Georgia,serif',letterSpacing:'4px',marginBottom:'16px'}}>
          <span style={{color:gold}}>DWYREX</span> Blog
        </h1>
        <p style={{color:'#666',fontSize:'16px'}}>GPU computing, AI altyapısı ve geleceğin veri merkezleri hakkında içgörüler</p>
      </header>

      {/* ARTICLES */}
      <main style={{maxWidth:'800px',margin:'0 auto',padding:'0 20px 100px'}}>
        {articles.map((article, idx) => (
          <article key={article.id} style={{background:'rgba(212,175,55,0.02)',border:'1px solid rgba(212,175,55,0.08)',borderRadius:'20px',padding:'48px',marginBottom:'40px'}}>

            <div style={{color:gold,fontSize:'11px',letterSpacing:'4px',marginBottom:'16px'}}>{article.tag}</div>

            <h2 style={{fontSize:'28px',fontFamily:'Georgia,serif',lineHeight:'1.3',marginBottom:'20px'}}>
              {article.title} <span style={{color:gold}}>{article.titleGold}</span>
            </h2>

            <div style={{color:'#555',fontSize:'13px',marginBottom:'32px'}}>
              By {article.author} · {article.readTime}
            </div>

            <div style={{color:'#aaa',fontSize:'16px',lineHeight:'1.9'}}>
              {article.content.map((block, i) => {
                if (block.type === 'p') return <p key={i} style={{marginBottom:'24px'}}>{block.text}</p>;
                if (block.type === 'h3') return <h3 key={i} style={{color:'white',fontSize:'20px',fontFamily:'Georgia,serif',margin:'32px 0 14px'}}>{block.text}</h3>;
                if (block.type === 'quote') return (
                  <div key={i} style={{background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.12)',borderRadius:'12px',padding:'24px',margin:'28px 0'}}>
                    <p style={{color:gold,fontStyle:'italic',fontSize:'17px',fontFamily:'Georgia,serif',lineHeight:'1.7',margin:0}}>"{block.text}"</p>
                  </div>
                );
                if (block.type === 'code') return (
                  <div key={i} style={{background:'rgba(255,255,255,0.03)',borderRadius:'12px',padding:'24px',margin:'24px 0',fontFamily:'monospace',fontSize:'14px',lineHeight:'2'}}>
                    {block.lines?.map((line, j) => <div key={j}>{line}</div>)}
                  </div>
                );
                return null;
              })}
            </div>

            <div style={{marginTop:'40px',textAlign:'center'}}>
              <a href="/#contact" style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',color:'#050508',padding:'14px 32px',borderRadius:'8px',fontWeight:'bold',fontSize:'14px',textDecoration:'none',letterSpacing:'2px'}}>
                BAŞLA →
              </a>
            </div>
          </article>
        ))}
      </main>

      {/* FOOTER */}
      <footer style={{textAlign:'center',padding:'40px 20px',borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <p style={{color:gold,fontSize:'12px',letterSpacing:'6px',fontFamily:'Georgia,serif'}}>DWYREX</p>
        <p style={{color:'#222',fontSize:'8px',letterSpacing:'3px',marginTop:'8px'}}>© 2025 DWYREX — THE KING OF COMPUTE</p>
      </footer>
    </div>
  );
}