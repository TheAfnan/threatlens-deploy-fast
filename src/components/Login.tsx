import React, { useState } from 'react';
import { ShieldCheck, Lock, Mail, Server, Building2, ChevronRight } from 'lucide-react';
import { motion } from 'motion/react';

interface LoginProps {
  onLogin: (email: string) => void;
}

export default function Login({ onLogin }: LoginProps) {
  const [email, setEmail] = useState('security.officer@sbi.co.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      onLogin(email);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col md:flex-row font-sans text-[#0F172A]" id="login-screen">
      {/* Left Panel: High Fidelity Illustration & Value Prop */}
      <div className="w-full md:w-1/2 bg-gradient-to-br from-[#0F172A] to-[#1E293B] text-white p-8 md:p-16 flex flex-col justify-between relative overflow-hidden border-r border-[#E2E8F0]/10">
        {/* Abstract cybergrid in background */}
        <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#2563EB_1px,transparent_1px)] [background-size:16px_16px]"></div>

        {/* Brand Header */}
        <div className="flex items-center space-x-3 z-10" id="brand-logo-login">
          <div className="p-2.5 bg-[#2563EB] rounded-lg shadow-lg flex items-center justify-center">
            <ShieldCheck className="h-6 w-6 text-white" />
          </div>
          <div>
            <span className="font-mono tracking-wider text-xs uppercase text-[#2563EB] font-bold">Cyber Defense Platform</span>
            <h1 className="text-xl font-extrabold tracking-tight">THREATLENS <span className="text-[#2563EB]">AI</span></h1>
          </div>
        </div>

        {/* Illustration container */}
        <div className="my-12 flex flex-col items-center justify-center text-center z-10">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="w-full max-w-sm mb-8 bg-white/5 p-4 rounded-2xl border border-white/10 backdrop-blur-sm shadow-2xl"
          >
            <img 
              src="/src/assets/images/banking_security_illustration_1782721080565.jpg" 
              alt="Secure Banking Shield Illustration" 
              className="w-full h-auto rounded-xl shadow-lg mix-blend-lighten object-cover"
              referrerPolicy="no-referrer"
            />
          </motion.div>
          <div className="max-w-md">
            <h2 className="text-2xl font-bold tracking-tight mb-3">Enterprise Malware Guard</h2>
            <p className="text-sm text-slate-400 leading-relaxed">
              Automated reverse engineering, static sandboxing, and banking fraud signature mapping built explicitly for regulatory and banking security operations.
            </p>
          </div>
        </div>

        {/* Footer badges */}
        <div className="z-10 border-t border-white/10 pt-6">
          <p className="text-xs font-mono text-slate-500 uppercase tracking-widest mb-3">Trusted by Elite Institutions</p>
          <div className="grid grid-cols-4 gap-4 items-center opacity-60 grayscale hover:grayscale-0 transition-all duration-300">
            <div className="flex items-center space-x-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">SBI</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">HDFC</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">ICICI</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <Building2 className="h-4 w-4 text-slate-400" />
              <span className="text-xs font-semibold text-slate-400">BOI</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right Panel: Clean Professional Login Form */}
      <div className="w-full md:w-1/2 flex items-center justify-center p-6 md:p-16">
        <div className="w-full max-w-md" id="login-card">
          <div className="mb-8">
            <h2 className="text-3xl font-extrabold tracking-tight text-[#0F172A] mb-1">Sign In</h2>
            <p className="text-sm text-slate-500">Access ThreatLens AI Security Operations dashboard</p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-700 mb-2">Corporate Email</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Mail className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  placeholder="name@institution.com"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-700">Access Key</label>
                <a href="#forgot" className="text-xs font-semibold text-[#2563EB] hover:underline" onClick={(e) => e.preventDefault()}>Forgot Access Key?</a>
              </div>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-3.5 pointer-events-none">
                  <Lock className="h-4 w-4 text-slate-400" />
                </span>
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg text-sm text-[#0F172A] placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-[#2563EB] focus:border-transparent transition-all"
                  placeholder="••••••••••••"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <label className="flex items-center space-x-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="rounded text-[#2563EB] focus:ring-[#2563EB] h-4 w-4 border-[#E2E8F0]"
                />
                <span className="text-xs font-medium text-slate-600">Remember my terminal ID</span>
              </label>
              <div className="flex items-center space-x-1 font-mono text-[10px] text-slate-400">
                <Server className="h-3 w-3" />
                <span>MOCK_GATEWAY:3000</span>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 px-4 bg-[#2563EB] hover:bg-[#2563EB]/90 disabled:bg-[#2563EB]/50 text-white rounded-lg text-sm font-semibold shadow-md hover:shadow-lg transition-all flex items-center justify-center space-x-2 mt-4 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                  <span>Authenticating via AD...</span>
                </>
              ) : (
                <>
                  <span>Sign In with Active Directory</span>
                  <ChevronRight className="h-4 w-4" />
                </>
              )}
            </button>

            <div className="relative my-6 flex py-2 items-center">
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
              <span className="flex-shrink mx-4 text-xs font-bold text-slate-400 uppercase tracking-widest">or</span>
              <div className="flex-grow border-t border-[#E2E8F0]"></div>
            </div>

            <button
              type="button"
              onClick={() => onLogin('sso.ciso.officer@sbi.co.in')}
              className="w-full py-2.5 px-4 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] hover:bg-white/40 backdrop-blur-md text-slate-700 rounded-lg text-xs font-semibold shadow-glass transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              <span>Authenticate using Hardware Security Key (SSO / YubiKey)</span>
            </button>
          </form>

          <div className="mt-12 text-center">
            <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-widest block">System Clearance: LEVEL 4</span>
            <span className="text-[10px] text-slate-400 block mt-1">Authorized Audit Log ID: TLS-2026-629A</span>
          </div>
        </div>
      </div>
    </div>
  );
}
