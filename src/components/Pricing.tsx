import React, { useState, useEffect } from 'react';
import { CheckCircle2, ArrowLeft, Code, Zap, Server } from 'lucide-react';
import { useAppStore } from '../lib/store';

interface PricingProps {
  onBack: () => void;
}

export default function Pricing({ onBack }: PricingProps) {
  const [annual, setAnnual] = useState(true);
  const { upgradeToPro, addToast } = useAppStore();

  const [isRedirecting, setIsRedirecting] = useState(false);

  const handleUpgrade = async (tierName: string) => {
    if (tierName === 'Enterprise') {
      addToast({ title: 'Contact Sales', description: 'Enterprise plans require custom provisioning.', type: 'info' });
      return;
    }
    
    setIsRedirecting(true);
    addToast({ title: 'Connecting to Billing', description: 'Redirecting to secure Stripe checkout...', type: 'info' });

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: 'demo-user-123' }) // In production, use Clerk userId
      });
      
      const data = await response.json();
      if (data.success && data.url) {
        window.location.href = data.url;
      } else {
        throw new Error(data.error || 'Failed to create checkout session');
      }
    } catch (err: any) {
      addToast({ title: 'Checkout Failed', description: err.message, type: 'error' });
      setIsRedirecting(false);
    }
  };

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onBack]);

  return (
    <div className="min-h-screen app-bg-container relative overflow-x-hidden font-sans pb-32 pt-10">
      <div className="app-bg animate-breathe z-0" />
      
      {/* Background Glows */}
      <div className="pointer-events-none absolute z-0 rounded-full w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/10 to-purple-500/10 blur-[100px] opacity-70 top-0 left-1/2 -translate-x-1/2" />

      <div className="relative z-10 container mx-auto px-6 max-w-[1200px]">
        {/* Header */}
        <button 
          onClick={onBack}
          className="flex items-center space-x-2 text-slate-500 hover:text-slate-800 transition-colors mb-12 bg-white/40 backdrop-blur-md px-4 py-2 rounded-full border border-white/50 w-fit"
        >
          <ArrowLeft className="h-4 w-4" />
          <span className="text-sm font-bold">Back to Platform</span>
        </button>

        <div className="text-center mb-16">
          <h1 className="font-display text-[42px] md:text-[56px] font-bold tracking-tight text-[#0a1b33] mb-4">
            Scale your security.
          </h1>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Transparent pricing for teams of all sizes. Upgrade to unlock dedicated hardware nodes and global threat feeds.
          </p>
          
          <div className="flex items-center justify-center mt-8">
            <div className="bg-white/40 backdrop-blur-xl border border-white/60 p-1 rounded-full flex items-center shadow-sm">
              <button 
                onClick={() => setAnnual(false)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${!annual ? 'bg-white shadow-sm text-[#0a1b33]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Monthly
              </button>
              <button 
                onClick={() => setAnnual(true)}
                className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${annual ? 'bg-white shadow-sm text-[#0a1b33]' : 'text-slate-500 hover:text-slate-700'}`}
              >
                Annually <span className="text-green-500 ml-1">-20%</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          {/* Developer Tier */}
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-glass rounded-[40px] p-10 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Code className="h-6 w-6 text-slate-600" />
            </div>
            <h3 className="text-2xl font-bold text-[#0a1b33] mb-2">Developer</h3>
            <p className="text-slate-500 text-sm mb-6">Perfect for individual researchers analyzing single binaries.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-[#0a1b33]">$0</span>
              <span className="text-slate-500 font-medium">/forever</span>
            </div>
            <button onClick={onBack} className="w-full py-3 px-6 rounded-full font-bold bg-white border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors mb-8 shadow-sm">
              Current Plan
            </button>
            <div className="space-y-4 flex-1">
              {['Basic Static Analysis', 'Local Report Generation', 'Community Signatures', 'Community Support'].map(f => (
                <div key={f} className="flex items-center space-x-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-slate-400" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Pro Tier */}
          <div className="bg-gradient-to-br from-[#0a152d] to-[#1e3a8a] border border-[#1e3a8a]/50 shadow-[0_20px_50px_-10px_rgba(15,53,126,0.3)] rounded-[40px] p-10 flex flex-col relative transform md:-translate-y-4 hover:-translate-y-6 transition-transform duration-300">
            <div className="absolute top-0 inset-x-0 h-1 bg-gradient-to-r from-sky-400 to-indigo-500 rounded-t-[40px]"></div>
            <div className="h-12 w-12 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
              <Zap className="h-6 w-6 text-sky-400" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Professional</h3>
            <p className="text-sky-200/80 text-sm mb-6">Advanced threat hunting with AI and hardware isolation.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-white">${annual ? '499' : '599'}</span>
              <span className="text-sky-200/80 font-medium">/month</span>
            </div>
            <button disabled={isRedirecting} onClick={() => handleUpgrade('Professional')} className="w-full py-3 px-6 rounded-full font-bold bg-sky-500 text-white hover:bg-sky-400 disabled:opacity-50 transition-colors mb-8 shadow-lg shadow-sky-500/30 flex items-center justify-center gap-2">
              {isRedirecting ? 'Redirecting...' : 'Upgrade to Professional'}
            </button>
            <div className="space-y-4 flex-1">
              {['Dynamic Hardware Sandbox', 'AI Exploit Vector Analysis', 'Live IOC Streaming', 'Priority Email Support', 'Unlimited APK Scans'].map(f => (
                <div key={f} className="flex items-center space-x-3 text-sm text-sky-100 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-sky-400" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Enterprise Tier */}
          <div className="bg-white/40 backdrop-blur-2xl border border-white/60 shadow-glass rounded-[40px] p-10 flex flex-col hover:-translate-y-2 transition-transform duration-300">
            <div className="h-12 w-12 bg-slate-100 rounded-2xl flex items-center justify-center mb-6">
              <Server className="h-6 w-6 text-[#0F357E]" />
            </div>
            <h3 className="text-2xl font-bold text-[#0a1b33] mb-2">Enterprise</h3>
            <p className="text-slate-500 text-sm mb-6">Custom infrastructure for massive scale operations.</p>
            <div className="mb-8">
              <span className="text-5xl font-black text-[#0a1b33]">Custom</span>
            </div>
            <button onClick={() => handleUpgrade('Enterprise')} className="w-full py-3 px-6 rounded-full font-bold bg-white border-2 border-slate-200 text-[#0a1b33] hover:border-[#0a1b33] transition-colors mb-8">
              Upgrade to Enterprise
            </button>
            <div className="space-y-4 flex-1">
              {['Dedicated Sandbox Nodes', 'On-Premise Deployment', 'Custom YARA Rule Uploads', '24/7 Dedicated Support', 'SLA Guarantees'].map(f => (
                <div key={f} className="flex items-center space-x-3 text-sm text-slate-600 font-medium">
                  <CheckCircle2 className="h-5 w-5 text-[#0F357E]" />
                  <span>{f}</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
