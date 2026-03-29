'use client';
import { useState, useEffect } from 'react';
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

export default function Blog() {

  useEffect(() => {
    supabase.from('page_views').insert({
      page: '/blog',
      referrer: document.referrer || 'direct',
      device: /Mobile/i.test(navigator.userAgent) ? 'mobile' : 'desktop',
    });
  }, []);

  return (
    <div style={{minHeight:'100vh',background:'#050508',color:'white',
      fontFamily:"'Segoe UI',system-ui,sans-serif"}}>

      {/* NAV */}
      <nav style={{display:'flex',justifyContent:'space-between',alignItems:'center',
        padding:'12px 40px',borderBottom:'1px solid rgba(212,175,55,0.08)',
        position:'sticky',top:0,background:'rgba(5,5,8,0.95)',
        backdropFilter:'blur(20px)',zIndex:100}}>
        <a href="/" style={{textDecoration:'none'}}><CrownLogoNav/></a>
        <div style={{display:'flex',gap:'28px',alignItems:'center',flexWrap:'wrap'}}>
          {[
            {label:'Home',href:'/'},
            {label:'How It Works',href:'/#how'},
            {label:'Calculator',href:'/#calc'},
            {label:'GPU Pricing',href:'/#gpupricing'},
            {label:'Blog',href:'/blog'},
            {label:'Contact',href:'/#contact'},
          ].map(link=>(
            <a key={link.label} href={link.href} style={{color:'#777',textDecoration:'none',
              fontSize:'13px',letterSpacing:'1px'}}>{link.label}</a>
          ))}
          <a href="/#contact" style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',
            color:'#050508',padding:'10px 24px',borderRadius:'6px',fontWeight:'bold',
            fontSize:'12px',textDecoration:'none',letterSpacing:'2px'}}>GET STARTED</a>
        </div>
      </nav>

      {/* BLOG HEADER */}
      <header style={{textAlign:'center',padding:'80px 20px 40px',maxWidth:'800px',margin:'0 auto'}}>
        <h1 style={{fontSize:'40px',fontFamily:'Georgia,serif',letterSpacing:'4px',marginBottom:'16px'}}>
          <span style={{color:'#d4af37'}}>DWYREX</span> Blog</h1>
        <p style={{color:'#666',fontSize:'16px'}}>Insights on AI, GPU computing, and the future of infrastructure</p>
      </header>

      {/* ARTICLE 1 */}
      <article style={{maxWidth:'750px',margin:'0 auto',padding:'40px 20px 100px'}}>
        <div style={{background:'rgba(212,175,55,0.02)',border:'1px solid rgba(212,175,55,0.08)',
          borderRadius:'20px',padding:'48px',marginBottom:'40px'}}>

          <div style={{color:'#d4af37',fontSize:'11px',letterSpacing:'4px',marginBottom:'16px'}}>
            FEATURED ARTICLE — JUNE 2025</div>

          <h2 style={{fontSize:'32px',fontFamily:'Georgia,serif',lineHeight:'1.3',marginBottom:'20px'}}>
            Why Idle Mining Farms Are the <span style={{color:'#d4af37'}}>Most Valuable Assets</span> in AI Right Now</h2>

          <div style={{color:'#555',fontSize:'13px',marginBottom:'32px'}}>
            By DWYREX Team · 8 min read</div>

          <div style={{color:'#aaa',fontSize:'16px',lineHeight:'1.9'}}>

            <p style={{marginBottom:'24px'}}>
              The AI industry has a massive problem that nobody is talking about: <strong style={{color:'#d4af37'}}>there
              aren&apos;t enough GPUs</strong>. While companies like OpenAI, Google, and Meta are spending billions
              on GPU infrastructure, thousands of perfectly capable GPUs are sitting idle in
              cryptocurrency mining facilities around the world.</p>

            <h3 style={{color:'white',fontSize:'22px',fontFamily:'Georgia,serif',margin:'36px 0 16px'}}>
              The $2.5 Trillion Opportunity</h3>

            <p style={{marginBottom:'24px'}}>
              The global AI market is projected to reach $2.5 trillion by 2030. But there&apos;s a
              critical bottleneck: GPU availability. Amazon Web Services currently has a 6+ month
              waitlist for GPU instances. Microsoft Azure and Google Cloud face similar shortages.</p>

            <p style={{marginBottom:'24px'}}>
              Meanwhile, the cryptocurrency mining industry is experiencing its worst downturn in years.
              Bitcoin halving events, rising electricity costs, and increased mining difficulty have pushed
              most mining operations into negative profitability. The result? Thousands of facilities
              with hundreds of thousands of GPUs are either operating at a loss or completely shut down.</p>

            <div style={{background:'rgba(212,175,55,0.06)',border:'1px solid rgba(212,175,55,0.12)',
              borderRadius:'12px',padding:'24px',margin:'32px 0'}}>
              <p style={{color:'#d4af37',fontStyle:'italic',fontSize:'18px',
                fontFamily:'Georgia,serif',lineHeight:'1.6',margin:0}}>
                &ldquo;The irony is staggering: one industry can&apos;t find GPUs at any price, while
                another industry is sitting on warehouses full of them, losing money every day.&rdquo;</p>
            </div>

            <h3 style={{color:'white',fontSize:'22px',fontFamily:'Georgia,serif',margin:'36px 0 16px'}}>
              Mining GPUs vs AI GPUs: The Truth</h3>

            <p style={{marginBottom:'24px'}}>
              A common misconception is that mining GPUs can&apos;t be used for AI workloads. This is
              completely false. NVIDIA RTX 3090s, which are among the most common mining GPUs,
              have 24GB of VRAM — more than enough for most AI model training and inference tasks.</p>

            <p style={{marginBottom:'24px'}}>The key specifications that matter for AI:</p>

            <ul style={{marginBottom:'24px',paddingLeft:'24px',lineHeight:'2.2'}}>
              <li><strong style={{color:'white'}}>VRAM:</strong> 10GB+ needed. RTX 3090 has 24GB ✅</li>
              <li><strong style={{color:'white'}}>CUDA Cores:</strong> More is better. RTX 3090 has 10,496 ✅</li>
              <li><strong style={{color:'white'}}>Tensor Cores:</strong> Essential for AI. RTX 3090 has 328 ✅</li>
              <li><strong style={{color:'white'}}>Memory Bandwidth:</strong> 936 GB/s on RTX 3090 ✅</li>
            </ul>

            <h3 style={{color:'white',fontSize:'22px',fontFamily:'Georgia,serif',margin:'36px 0 16px'}}>
              The DWYREX Model</h3>

            <p style={{marginBottom:'24px'}}>
              At DWYREX, we&apos;ve built a platform that connects two desperate markets:</p>

            <p style={{marginBottom:'12px'}}>
              <strong style={{color:'#d4af37'}}>Supply side:</strong> Mining facility owners with idle
              GPUs, paying electricity bills for equipment that generates no revenue.</p>

            <p style={{marginBottom:'24px'}}>
              <strong style={{color:'#d4af37'}}>Demand side:</strong> AI companies, researchers, and
              startups who need GPU compute power but can&apos;t afford AWS prices or can&apos;t
              get through their waitlists.</p>

            <p style={{marginBottom:'24px'}}>
              Our model is simple: we lease mining facilities, transform them into AI compute
              centers, and connect them to our global network. Facility owners receive guaranteed
              monthly lease payments. GPU renters get compute power at 60-70% lower cost than
              major cloud providers.</p>

            <h3 style={{color:'white',fontSize:'22px',fontFamily:'Georgia,serif',margin:'36px 0 16px'}}>
              Real Numbers</h3>

            <p style={{marginBottom:'24px'}}>Let&apos;s look at a typical scenario:</p>

            <div style={{background:'rgba(255,255,255,0.03)',borderRadius:'12px',
              padding:'24px',margin:'24px 0',fontFamily:'monospace',fontSize:'14px',lineHeight:'2'}}>
              <div>Facility: 100x NVIDIA RTX 3090</div>
              <div>Current mining income: <span style={{color:'#ff6b6b'}}>-$200/month (LOSS)</span></div>
              <div>DWYREX lease payment: <span style={{color:'#d4af37'}}>$1,800/month (GUARANTEED)</span></div>
              <div>Annual income: <span style={{color:'#ffd700'}}>$21,600/year</span></div>
              <div style={{marginTop:'8px',color:'#d4af37'}}>Swing from loss to profit: $2,000+/month</div>
            </div>

            <h3 style={{color:'white',fontSize:'22px',fontFamily:'Georgia,serif',margin:'36px 0 16px'}}>
              The CoreWeave Precedent</h3>

            <p style={{marginBottom:'24px'}}>
              This isn&apos;t theoretical. CoreWeave, a company that started as a cryptocurrency
              mining operation, pivoted to AI cloud computing and is now valued at over
              <strong style={{color:'#d4af37'}}> $35 billion</strong>. They proved that mining
              infrastructure can be successfully repurposed for AI workloads.</p>

            <p style={{marginBottom:'24px'}}>
              Other companies like Hut 8, Hive Digital, and Applied Digital have made similar
              pivots, transforming their mining operations into AI compute facilities.</p>

            <h3 style={{color:'white',fontSize:'22px',fontFamily:'Georgia,serif',margin:'36px 0 16px'}}>
              What&apos;s Next</h3>

            <p style={{marginBottom:'24px'}}>
              The AI GPU shortage is expected to continue for at least the next 3-5 years.
              NVIDIA&apos;s CEO Jensen Huang has repeatedly stated that demand far exceeds supply.
              This means the window of opportunity for mining facility owners is wide open.</p>

            <p style={{marginBottom:'24px'}}>
              If you own a mining facility with NVIDIA GPUs (RTX 3070 or above), you&apos;re
              sitting on a gold mine — just not the kind you originally intended. The AI
              industry needs your hardware, and DWYREX is the bridge that connects you to
              guaranteed, stable revenue.</p>

            <div style={{background:'linear-gradient(135deg,rgba(212,175,55,0.08),rgba(0,0,0,0.3))',
              border:'1px solid rgba(212,175,55,0.2)',borderRadius:'12px',padding:'28px',
              margin:'40px 0',textAlign:'center'}}>
              <p style={{color:'#d4af37',fontSize:'18px',fontFamily:'Georgia,serif',margin:'0 0 16px'}}>
                Ready to transform your mining facility?</p>
              <a href="/#contact" style={{background:'linear-gradient(135deg,#d4af37,#b8860b)',
                color:'#050508',padding:'14px 32px',borderRadius:'8px',fontWeight:'bold',
                fontSize:'14px',textDecoration:'none',letterSpacing:'2px'}}>
                👑 GET STARTED TODAY</a>
            </div>
          </div>
        </div>
      </article>

      {/* FOOTER */}
      <footer style={{textAlign:'center',padding:'40px 20px',
        borderTop:'1px solid rgba(212,175,55,0.06)'}}>
        <p style={{color:'#d4af37',fontSize:'12px',letterSpacing:'6px',
          fontFamily:'Georgia,serif'}}>DWYREX</p>
        <p style={{color:'#222',fontSize:'8px',letterSpacing:'3px',marginTop:'8px'}}>
          © 2025 DWYREX — THE KING OF COMPUTE</p>
      </footer>
    </div>
  );
}