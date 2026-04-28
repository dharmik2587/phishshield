'use client';

import { useRef, useState, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

interface AnalysisResult {
  verdict: string;
  confidence: number;
  reasons: string[];
  action_advice: string;
}

const contributors = [
  { name: 'Dharmik', role: 'Backend Developer', icon: '⚡' },
  { name: 'Aayasha', role: 'Frontend Developer', icon: '🎨' },
  { name: 'Sanyam', role: 'Product Director', icon: '📊' },
  { name: 'Jenil', role: 'Testing & Debugging', icon: '🛡️' },
];

const liveThreats = [
  { domain: 'metamask-support.eth-secure.com', risk: 98, type: 'Typosquatting' },
  { domain: 'coinbace-login.verify-ac.net', risk: 96, type: 'Phishing' },
  { domain: 'ledger-live.firmware-update.io', risk: 99, type: 'Critical' },
  { domain: 'trustwallet-app.claims-fix.com', risk: 94, type: 'Homoglyph' },
  { domain: 'phantom-wallet.recovery-seed.xyz', risk: 97, type: 'Drainer' },
  { domain: 'binance-verify.account-lock.com', risk: 95, type: 'Impersonation' },
  { domain: 'opensea-offer.accept-bid.net', risk: 93, type: 'Malicious' },
  { domain: 'uniswap-v3.swap-claims.org', risk: 92, type: 'Phishing' },
  { domain: 'metamask.io-security.claims', risk: 98, type: 'Critical' },
  { domain: 'pancakeswap.finance-claims.net', risk: 91, type: 'Drainer' },
];

export default function Home() {
  const [url, setUrl] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState('');

  const heroRef = useRef(null);

  useEffect(() => {
    const ctx = gsap.context(() => {
      // Entry animations
      gsap.from('.nav-reveal', { y: -50, opacity: 0, duration: 1.2, ease: 'power4.out' });
      gsap.from('.hero-reveal', { y: 100, opacity: 0, duration: 1.5, stagger: 0.2, ease: 'power4.out' });

      // Scroll reveals
      gsap.utils.toArray('.scroll-reveal').forEach((elem: any) => {
        gsap.fromTo(elem, 
          { y: 80, opacity: 0 },
          { 
            y: 0, 
            opacity: 1, 
            duration: 1, 
            scrollTrigger: {
              trigger: elem,
              start: 'top 85%',
            }
          }
        );
      });
    });
    return () => ctx.revert();
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!url.trim()) return;

    setLoading(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to analyze');
      setResult(data);
      
      gsap.fromTo('.result-container', 
        { y: 30, opacity: 0, scale: 0.95 },
        { y: 0, opacity: 1, scale: 1, duration: 0.6, ease: 'power3.out' }
      );
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen relative w-full bg-dark">
      <div className="bg-mesh" />
      <div className="grid-overlay" />

      {/* Premium Navbar */}
      <nav className="premium-nav premium-glass nav-reveal">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center border border-primary/20">
            <span className="text-xl">🛡️</span>
          </div>
          <span className="font-bold tracking-tighter text-lg uppercase hidden sm:block">Phish<span className="opacity-50">Shield</span></span>
        </div>
        <div className="flex gap-1 sm:gap-2 items-center">
          <button onClick={() => scrollTo('landing')} className="nav-link">Initiate</button>
          <button onClick={() => scrollTo('process')} className="nav-link">Process</button>
          <button onClick={() => scrollTo('threats')} className="nav-link">Threats</button>
          <button onClick={() => scrollTo('features')} className="nav-link">Future</button>
          <button onClick={() => scrollTo('team')} className="nav-link">Team</button>
        </div>
      </nav>

      <main className="w-full flex flex-col items-center">
        {/* 1. Landing Page Section (Hero + Analyzer) */}
        <section id="landing" className="section-premium flex flex-col items-center justify-center min-h-screen text-center pt-32">
          <div className="hero-reveal mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-[10px] uppercase tracking-[0.4em] font-mono mb-8">
              <span className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              Autonomous Neural Security Platform
            </div>
            <h1 className="text-5xl sm:text-7xl md:text-8xl font-extrabold mb-8 tracking-tighter leading-[0.9]">
              <span className="premium-text-gradient">Engineered</span><br />
              <span className="text-white">Defense</span>
            </h1>
            <p className="text-base sm:text-lg text-white/50 max-w-2xl mx-auto leading-relaxed font-light mb-12 px-4">
              PhishShield AI leverages state-of-the-art neural patterns to detect 
              malicious domains before they reach your wallet. Precision. Speed. Protection.
            </p>
          </div>

          <div className="hero-reveal w-full max-w-4xl premium-glass relative overflow-hidden">
            <div className="scanline" />
            <div className="p-6 sm:p-12 md:p-16">
              <form onSubmit={handleSubmit} className="flex flex-col md:flex-row gap-4 mb-8">
                <div className="relative flex-grow">
                  <input
                    type="text"
                    placeholder="Enter target URL for verification..."
                    className="premium-input pr-12"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    disabled={loading}
                  />
                  <div className="absolute right-6 top-1/2 -translate-y-1/2 opacity-20">
                    <span className="text-xs font-mono">URL_SCAN</span>
                  </div>
                </div>
                <button type="submit" className="btn-premium btn-premium-primary min-w-[180px]" disabled={loading}>
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      Analyzing
                    </span>
                  ) : 'Run Scan'}
                </button>
              </form>

              {error && (
                <div className="p-6 rounded-2xl bg-danger/10 border border-danger/20 text-danger text-xs font-mono text-left">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                    <span className="font-bold">[CRITICAL_FAILURE]</span>
                  </div>
                  {error}
                </div>
              )}

              {result && (
                <div className="result-container mt-12 space-y-8 text-left">
                  <div className={`p-8 sm:p-12 rounded-[32px] border transition-all ${
                    result.verdict === 'Safe' 
                      ? 'bg-success/5 border-success/30 text-success' 
                      : 'bg-danger/5 border-danger/30 text-danger'
                  }`}>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-8">
                      <div className="text-7xl">{result.verdict === 'Safe' ? '🛡️' : '🚫'}</div>
                      <div>
                        <h2 className="text-4xl sm:text-5xl font-black uppercase tracking-tighter mb-2">{result.verdict} VERDICT</h2>
                        <div className="flex items-center gap-3 opacity-60">
                          <span className="text-[10px] font-mono uppercase tracking-widest">Confidence Score</span>
                          <div className="flex-grow h-px bg-current w-12 opacity-20" />
                          <span className="text-sm font-bold font-mono">{result.confidence}.00%</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="premium-glass p-8 border-l-4 border-l-primary bg-white/2">
                      <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-8 flex items-center gap-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                        Inference_Log:
                      </h3>
                      <div className="space-y-6">
                        {result.reasons.map((r, i) => (
                          <div key={i} className="flex gap-4 text-sm font-light text-white/80 leading-relaxed font-mono">
                            <span className="text-primary opacity-50">[0{i+1}]</span> {r}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="flex flex-col gap-6">
                      <div className="p-8 rounded-3xl bg-white/5 border border-white/10 flex-grow">
                        <h3 className="text-[10px] font-mono uppercase tracking-[0.3em] opacity-40 mb-6">Security_Advisory:</h3>
                        <p className="text-white/80 text-sm italic font-light leading-relaxed">
                          {result.action_advice}
                        </p>
                      </div>
                      <button 
                        onClick={() => { setUrl(''); setResult(null); }}
                        className="btn-premium w-full text-xs opacity-50 hover:opacity-100"
                      >
                        Reset Analysis
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </section>

        {/* 2. How It Works Section */}
        <section id="process" className="section-premium scroll-reveal w-full">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Tactical Workflow</h2>
            <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.6em]">Architectural Execution Path</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 w-full">
            {[
              { id: '01', title: 'Data Ingestion', desc: 'Securely ingesting target URLs via encrypted channel for neural inspection.' },
              { id: '02', title: 'Pattern Extraction', desc: 'Claude Haiku 4.5 AI parses homoglyphs and hidden vectors across 30+ scan parameters.' },
              { id: '03', title: 'Verdict Consensus', desc: 'Immediate delivery of risk assessment with actionable mitigation protocols.' }
            ].map((step) => (
              <div key={step.id} className="premium-glass p-12 group hover:-translate-y-4 transition-all duration-500">
                <div className="text-8xl font-black text-white/5 mb-8 group-hover:text-primary transition-all duration-500 font-mono leading-none">{step.id}</div>
                <h3 className="text-2xl font-bold mb-4 uppercase tracking-tight">{step.title}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">{step.desc}</p>
                <div className="mt-12 w-12 h-1 bg-white/5 group-hover:w-full group-hover:bg-primary transition-all duration-700" />
              </div>
            ))}
          </div>
        </section>

        {/* 3. Top 10 Phishing Site Section */}
        <section id="threats" className="section-premium scroll-reveal w-full">
          <div className="premium-glass w-full overflow-hidden">
            <div className="p-8 sm:p-12 md:p-16">
              <div className="mb-12">
                <h2 className="text-4xl sm:text-5xl font-bold mb-4 tracking-tight uppercase">Live Threat Feed</h2>
                <div className="flex items-center gap-3">
                  <span className="w-2 h-2 rounded-full bg-danger animate-pulse" />
                  <p className="text-danger font-mono text-[10px] tracking-[0.4em] uppercase">Active Monitoring</p>
                </div>
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {liveThreats.map((site, i) => (
                  <a 
                    key={i} 
                    href={`https://${site.domain}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="p-6 rounded-2xl bg-white/5 border border-white/5 hover:border-danger/30 hover:bg-white/10 transition-all group flex flex-col justify-between"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <div className="text-xs font-mono text-white/80 group-hover:text-white transition-colors break-all pr-4">
                        {site.domain}
                      </div>
                      <span className="text-[10px] font-mono text-danger opacity-0 group-hover:opacity-100 transition-opacity">
                        [VISIT]
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-4 border-t border-white/5">
                      <span className="text-[9px] font-bold text-danger/80 uppercase tracking-tighter">{site.type}</span>
                      <span className="text-[10px] font-mono text-white/50">{site.risk}% RISK</span>
                    </div>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 4. Future Scope (Upcoming Features) */}
        <section id="features" className="section-premium scroll-reveal w-full">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">Future Scope</h2>
            <p className="text-white/30 font-mono text-[10px] uppercase tracking-[0.6em]">Platform Evolution Roadmap</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
            {[
              { t: 'Universal Extension', d: 'Native browser integration for real-time traffic interception.' },
              { t: 'Neural Map v2', d: 'Global visualization of active phishing nodes across all continents.' },
              { t: 'Wallet Sentry', d: 'Automated seed phrase detection within browser storage vectors.' },
              { t: 'Mobile Shield', d: 'Direct iOS/Android core for native application protection.' },
              { t: 'Decentralized Feed', d: 'On-chain community reporting for immediate global blacklisting.' },
              { t: 'AI Vision Core', d: 'Visual analysis of website screenshots to detect impersonation.' }
            ].map((f, i) => (
              <div key={i} className="premium-glass p-10 hover:bg-white/5 group transition-all duration-500 border-white/5 hover:border-primary/20">
                <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center mb-8 group-hover:bg-primary group-hover:rotate-12 transition-all duration-500">
                  <span className="text-[10px] font-mono font-bold">0{i+1}</span>
                </div>
                <h3 className="text-xl font-bold mb-4 uppercase tracking-tight">{f.t}</h3>
                <p className="text-white/40 text-sm leading-relaxed font-light">{f.d}</p>
              </div>
            ))}
          </div>
        </section>

        {/* 5. Team Section (At last) */}
        <section id="team" className="section-premium scroll-reveal w-full pb-40">
          <div className="text-center mb-24">
            <h2 className="text-4xl md:text-6xl font-black mb-6 tracking-tighter uppercase">The Codifiers</h2>
            <div className="flex items-center justify-center gap-4">
              <div className="h-px bg-primary/30 w-12" />
              <p className="text-primary font-mono text-[10px] uppercase tracking-[0.5em]">Engineering_Personnel</p>
              <div className="h-px bg-primary/30 w-12" />
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full">
            {contributors.map((member) => (
              <div key={member.name} className="premium-glass p-12 text-center group hover:border-primary/50 hover:bg-white/5 transition-all relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-primary/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                <div className="w-24 h-24 mx-auto rounded-[2rem] bg-white/5 flex items-center justify-center text-5xl mb-8 grayscale group-hover:grayscale-0 group-hover:scale-110 transition-all duration-500 border border-white/5 group-hover:border-primary/20">
                  {member.icon}
                </div>
                <h3 className="text-2xl font-black mb-2 uppercase tracking-tighter group-hover:text-primary transition-colors">{member.name}</h3>
                <p className="text-white/40 font-mono text-[10px] uppercase tracking-widest mb-8">{member.role}</p>
                <div className="flex justify-center gap-3">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className={`w-1 h-1 rounded-full bg-white/10 group-hover:bg-primary transition-all duration-${i * 300}`} />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      </main>

      <footer className="py-24 border-t border-white/5 relative overflow-hidden">
         <div className="bg-mesh opacity-30" />
         <div className="container mx-auto px-6 relative z-10">
           <div className="flex flex-col md:flex-row justify-between items-center gap-12">
             <div className="text-left">
               <div className="flex items-center gap-3 mb-4">
                 <div className="w-8 h-8 rounded-lg bg-primary/10 flex items-center justify-center border border-primary/20">
                   <span className="text-lg">🛡️</span>
                 </div>
                 <span className="font-bold tracking-tighter text-xl uppercase">Phish<span className="opacity-50">Shield</span></span>
               </div>
               <p className="text-white/40 text-sm max-w-xs leading-relaxed font-light">
                 Advancing the frontier of decentralized security through autonomous neural pattern recognition.
               </p>
             </div>
             
             <div className="flex gap-8">
                <a href="https://github.com/dharmik2587" target="_blank" rel="noopener noreferrer" className="text-xs text-white/40 hover:text-primary transition-colors uppercase tracking-widest font-mono">GitHub</a>
              </div>
           </div>
         </div>
       </footer>
    </div>
  );
}
