import React, { useEffect, useState } from 'react';
import { motion, useScroll, useTransform, AnimatePresence } from 'framer-motion';
import { ArrowLeft, CheckCircle2, Circle, Clock, Rocket, Shield, Activity, Search, Code, Cpu, Layers, Box, Check } from 'lucide-react';
import { Logo } from './Logo';

export default function ExtensionRoadmap({ onBack }: { onBack: () => void }) {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], [0, 200]);

  const [email, setEmail] = useState('');
  const [joined, setJoined] = useState(false);

  const handleJoinWaitlist = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    // Store in localStorage
    const existing = JSON.parse(localStorage.getItem('threatlens_waitlist') || '[]');
    if (!existing.includes(email)) {
      existing.push({ email, timestamp: new Date().toISOString() });
      localStorage.setItem('threatlens_waitlist', JSON.stringify(existing));
    }
    
    setJoined(true);
    setEmail('');
  };

  const phases = [
    {
      id: 1,
      title: 'Phase 1: Core Architecture',
      status: 'completed',
      date: 'Q3 2026',
      icon: <Code className="w-8 h-8 text-cyan-400" />,
      color: 'from-cyan-400 to-blue-500',
      shadow: 'rgba(34,211,238,0.5)',
      description: 'The foundation of ThreatLens everywhere.',
      items: [
        'Manifest V3 Architecture finalization',
        'Secure communication channel with ThreatLens API',
        'UI injection engine for web pages',
      ]
    },
    {
      id: 2,
      title: 'Phase 2: Real-time Interception',
      status: 'in-progress',
      date: 'Q4 2026',
      icon: <Activity className="w-8 h-8 text-blue-400" />,
      color: 'from-blue-500 to-indigo-500',
      shadow: 'rgba(59,130,246,0.5)',
      description: 'Stop threats before they touch disk.',
      items: [
        'On-the-fly APK download detection',
        'Automatic pre-flight hash matching',
        'User prompts for deep analysis before saving',
      ]
    },
    {
      id: 3,
      title: 'Phase 3: Sandbox Rendering',
      status: 'upcoming',
      date: 'Q1 2027',
      icon: <Layers className="w-8 h-8 text-indigo-400" />,
      color: 'from-indigo-500 to-purple-500',
      shadow: 'rgba(99,102,241,0.5)',
      description: 'Cloud execution directly in your browser.',
      items: [
        'One-click execution in remote Cloud Sandbox',
        'In-browser stream of dynamic analysis results',
        'Memory hook tracing visualized in popup',
      ]
    },
    {
      id: 4,
      title: 'Phase 4: Global Overlay',
      status: 'upcoming',
      date: 'Q2 2027',
      icon: <Search className="w-8 h-8 text-purple-400" />,
      color: 'from-purple-500 to-pink-500',
      shadow: 'rgba(168,85,247,0.5)',
      description: 'Intelligence everywhere you go.',
      items: [
        'Threat intelligence indicators on search results',
        'Community warning integration on download pages',
        'Enterprise deployment management & telemetry',
      ]
    }
  ];

  return (
    <div className="min-h-screen bg-[#020617] text-white font-sans relative overflow-hidden flex flex-col selection:bg-cyan-500/30">
      {/* 3D Grid Background Floor */}
      <div className="absolute inset-0 z-0 bg-[linear-gradient(to_right,#0f172a_1px,transparent_1px),linear-gradient(to_bottom,#0f172a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_80%_at_50%_0%,#000_70%,transparent_100%)] opacity-50" style={{ transform: "perspective(1000px) rotateX(60deg) translateY(-200px) scale(2.5)" }}></div>
      
      {/* Deep Ambient Glows */}
      <div className="absolute top-[-20%] left-[-10%] w-[800px] h-[800px] bg-cyan-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute top-[40%] right-[-10%] w-[600px] h-[600px] bg-indigo-600/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[-10%] left-[20%] w-[700px] h-[700px] bg-blue-600/10 blur-[150px] rounded-full pointer-events-none" />

      {/* Floating 3D Geometric Elements (CSS animations) */}
      <motion.div style={{ y }} className="absolute top-[15%] right-[10%] opacity-20 pointer-events-none hidden lg:block z-0">
        <Box className="w-32 h-32 text-cyan-400 animate-[spin_15s_linear_infinite]" />
      </motion.div>
      <motion.div style={{ y: useTransform(scrollYProgress, [0, 1], [0, -150]) }} className="absolute bottom-[25%] left-[5%] opacity-20 pointer-events-none hidden lg:block z-0">
        <Cpu className="w-40 h-40 text-blue-500 animate-[spin_25s_linear_infinite_reverse]" />
      </motion.div>

      {/* Header */}
      <header className="relative z-30 px-6 py-4 flex items-center justify-between border-b border-white/10 bg-white/5 backdrop-blur-3xl sticky top-0">
        <div className="flex items-center space-x-6">
          <button 
            onClick={onBack}
            className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 hover:border-cyan-500/50 hover:shadow-[0_0_20px_rgba(34,211,238,0.2)] transition-all group"
          >
            <ArrowLeft className="w-6 h-6 text-slate-300 group-hover:text-cyan-400 group-hover:-translate-x-1 transition-all" />
          </button>
          <div className="flex items-center space-x-3">
            <Logo className="w-8 h-8 drop-shadow-md" />
            <span className="font-display font-black text-2xl tracking-tighter">ThreatLens</span>
          </div>
        </div>
        <div className="hidden sm:flex px-4 py-2 rounded-full bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-500/20 text-cyan-400 text-[11px] font-black uppercase tracking-[0.2em] shadow-[inset_0_0_10px_rgba(34,211,238,0.1)]">
          Extension Roadmap
        </div>
      </header>

      {/* Content */}
      <main className="flex-1 relative z-20 max-w-6xl mx-auto w-full px-4 sm:px-6 py-24 pb-40">
        
        {/* Hero Section */}
        <div className="text-center mb-32 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[300px] h-[300px] bg-cyan-400/20 blur-[100px] rounded-full pointer-events-none" />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="inline-flex items-center space-x-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 backdrop-blur-md shadow-xl mb-8"
          >
            <Rocket className="w-4 h-4 text-cyan-400" />
            <span className="text-[12px] font-bold text-slate-300 uppercase tracking-widest">Engineering Master Plan</span>
          </motion.div>
          
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="font-display text-[56px] md:text-[80px] lg:text-[100px] font-black tracking-tighter leading-[0.9] drop-shadow-2xl mb-8"
          >
            The Future of <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-400 filter drop-shadow-[0_0_20px_rgba(34,211,238,0.3)]">Protection</span>
          </motion.h1>
          
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto font-medium leading-relaxed"
          >
            Discover how we are bringing enterprise-grade threat intelligence and on-the-fly dynamic analysis directly into your browser.
          </motion.p>
        </div>

        {/* 3D Roadmap Timeline */}
        <div className="relative">
          {/* Fiber Optic Central Line */}
          <div className="absolute left-[39px] md:left-1/2 top-0 bottom-0 w-[2px] bg-white/5 -translate-x-1/2">
            <motion.div 
              className="absolute top-0 w-full bg-gradient-to-b from-cyan-400 via-blue-500 to-transparent shadow-[0_0_15px_rgba(34,211,238,1)]"
              style={{ height: useTransform(scrollYProgress, [0, 1], ["0%", "100%"]) }}
            />
          </div>

          <div className="space-y-24 md:space-y-32">
            {phases.map((phase, index) => (
              <motion.div 
                key={phase.id}
                initial={{ opacity: 0, y: 50, rotateX: 10 }}
                whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className={`relative flex flex-col md:flex-row items-center ${index % 2 === 0 ? 'md:flex-row-reverse' : ''}`}
                style={{ perspective: 1000 }}
              >
                {/* Node Connector */}
                <div className="absolute left-[39px] md:left-1/2 top-10 md:top-1/2 -translate-x-1/2 md:-translate-y-1/2 z-20">
                  <div className={`w-12 h-12 rounded-xl bg-[#0a152d] border-2 shadow-[0_0_30px_${phase.shadow}] flex items-center justify-center transform rotate-45 border-white/20`}>
                    <div className={`w-4 h-4 rounded bg-gradient-to-br ${phase.color} ${phase.status === 'in-progress' ? 'animate-ping' : ''}`}></div>
                  </div>
                </div>

                {/* Content Card Wrapper */}
                <div className={`w-full md:w-[45%] pl-24 md:pl-0 ${index % 2 === 0 ? 'md:pr-16 md:text-right' : 'md:pl-16'}`}>
                  {/* Phase Date Badge (Floats outside card) */}
                  <div className={`mb-4 flex items-center ${index % 2 === 0 ? 'md:justify-end' : ''}`}>
                     <div className={`px-4 py-1.5 rounded-full text-xs font-black tracking-[0.2em] uppercase border ${
                        phase.status === 'completed' ? 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30' : 
                        phase.status === 'in-progress' ? 'bg-blue-500/10 text-blue-400 border-blue-500/30 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 
                        'bg-white/5 text-slate-400 border-white/10'
                      }`}>
                        {phase.date} • {phase.status.replace('-', ' ')}
                      </div>
                  </div>

                  {/* Glassmorphism Card */}
                  <div className="bg-gradient-to-b from-[#0a152d]/80 to-[#030712]/90 backdrop-blur-[40px] border border-white/10 shadow-[0_30px_60px_rgba(0,0,0,0.5),inset_0_1px_0_rgba(255,255,255,0.1),inset_0_-1px_20px_rgba(0,0,0,0.5)] rounded-[32px] p-8 md:p-10 relative overflow-hidden group hover:scale-[1.02] hover:-translate-y-2 transition-all duration-500">
                    
                    {/* Inner Ambient Light */}
                    <div className={`absolute -top-32 ${index % 2 === 0 ? '-right-32' : '-left-32'} w-64 h-64 bg-gradient-to-br ${phase.color} blur-[100px] opacity-20 group-hover:opacity-40 transition-opacity duration-700 pointer-events-none`}></div>
                    
                    {/* Top Edge Highlight */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-[1px] bg-gradient-to-r from-transparent via-white/20 to-transparent"></div>

                    <div className={`flex items-start mb-6 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'space-x-4'}`}>
                      <div className={`w-16 h-16 rounded-[20px] bg-white/5 border border-white/10 flex items-center justify-center shadow-inner shrink-0 ${index % 2 === 0 ? 'ml-4' : ''}`}>
                        {phase.icon}
                      </div>
                      <div className={index % 2 === 0 ? 'md:text-right' : ''}>
                        <h3 className="text-[28px] font-black text-white leading-tight mb-2 tracking-tight">{phase.title}</h3>
                        <p className="text-[15px] text-cyan-400/80 font-medium">{phase.description}</p>
                      </div>
                    </div>
                    
                    <div className="w-full h-[1px] bg-white/5 mb-6"></div>
                    
                    <ul className="space-y-4">
                      {phase.items.map((item, i) => (
                        <li key={i} className={`flex items-start text-slate-300 ${index % 2 === 0 ? 'md:flex-row-reverse' : 'space-x-3'}`}>
                          <div className={`mt-1 shrink-0 ${index % 2 === 0 ? 'ml-3' : ''}`}>
                            {phase.status === 'completed' ? (
                              <div className="w-5 h-5 rounded-full bg-cyan-500/20 border border-cyan-500 flex items-center justify-center">
                                <div className="w-2 h-2 rounded-full bg-cyan-400"></div>
                              </div>
                            ) : phase.status === 'in-progress' ? (
                              <div className="w-5 h-5 rounded-full bg-blue-500/20 border border-blue-500 flex items-center justify-center relative">
                                <div className="w-2 h-2 rounded-full bg-blue-400 animate-ping absolute"></div>
                                <div className="w-2 h-2 rounded-full bg-blue-400 relative"></div>
                              </div>
                            ) : (
                              <div className="w-5 h-5 rounded-full bg-white/5 border border-white/20"></div>
                            )}
                          </div>
                          <span className="text-[15px] font-medium leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </main>

      {/* Bottom CTA Overlay */}
      <div className="relative z-20 border-t border-white/5 bg-[#020617]/80 backdrop-blur-3xl py-12 px-6">
        <div className="max-w-4xl mx-auto flex flex-col md:flex-row items-center justify-between">
          <div className="mb-6 md:mb-0 text-center md:text-left">
            <h4 className="text-2xl font-bold text-white mb-2 tracking-tight">Want early access?</h4>
            <p className="text-slate-400 text-sm">Join the waitlist to test the extension in beta.</p>
          </div>
          
          <div className="w-full md:w-auto">
            {joined ? (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="flex items-center space-x-3 bg-green-500/10 border border-green-500/30 px-6 py-4 rounded-xl"
              >
                <div className="w-8 h-8 rounded-full bg-green-500/20 flex items-center justify-center">
                  <Check className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-sm font-bold text-green-400 uppercase tracking-widest">You're on the list!</div>
                  <div className="text-[11px] text-green-500/70">We'll notify you when beta access opens.</div>
                </div>
              </motion.div>
            ) : (
              <form onSubmit={handleJoinWaitlist} className="flex flex-col sm:flex-row gap-3">
                <input 
                  type="email" 
                  required 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your work email" 
                  className="px-6 py-4 rounded-xl bg-white/5 border border-white/10 text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan-500/50 focus:ring-1 focus:ring-cyan-500/50 w-full sm:w-[320px] shadow-inner font-medium text-[14px] transition-all"
                />
                <button type="submit" className="relative inline-flex h-[54px] items-center justify-center overflow-hidden rounded-xl bg-cyan-600 px-8 font-bold text-white shadow-[0_0_20px_rgba(8,145,178,0.4)] transition-all hover:scale-[1.02] hover:bg-cyan-500 uppercase tracking-widest text-[12px] whitespace-nowrap">
                  Join Waitlist
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
