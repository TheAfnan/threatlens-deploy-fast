import React, { useEffect } from 'react';
import { BookOpen, Shield, Code, ArrowLeft } from 'lucide-react';

interface DocsProps {
  onBack: () => void;
}

export default function Docs({ onBack }: DocsProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onBack();
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [onBack]);

  return (
    <div className="min-h-screen bg-[#f8fafc] relative overflow-x-hidden font-sans pb-20">
      {/* Absolute Blurred Background */}
      <div className="absolute inset-0 bg-[url('/ultra_bg.png')] bg-cover bg-center filter blur-[40px] scale-110 opacity-70 z-0 fixed"></div>

      {/* Docs Header */}
      <header className="relative z-20 sticky top-0 bg-white/30 backdrop-blur-xl border-b border-white/50 px-8 py-4 flex items-center justify-between shadow-glass">
        <div className="flex items-center space-x-4">
          <button 
            onClick={onBack}
            className="h-10 w-10 bg-white/40 border border-white/50 rounded-xl flex items-center justify-center text-slate-700 hover:bg-white/60 transition-colors shadow-glass"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div className="flex flex-col">
            <h1 className="text-xl font-black text-slate-800">Documentation</h1>
            <span className="text-sm text-slate-600 font-medium">ThreatLens Platform Guidelines</span>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 container mx-auto px-6 pt-12 max-w-4xl space-y-12">
        {/* Intro */}
        <section className="bg-white/30 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-glass">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 bg-[#0F357E]/10 rounded-xl flex items-center justify-center">
              <BookOpen className="h-6 w-6 text-[#0F357E]" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Getting Started</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            ThreatLens is a next-generation binary security analysis platform. It allows security researchers to decompile, map, and dynamically execute Android (APK) files in a secure, AI-monitored sandbox.
          </p>
          <p className="text-slate-600 leading-relaxed">
            By leveraging our proprietary Secure Compiler and Dynamic Sandbox technologies, you can identify zero-day threats, fraud attack vectors, and malware families in seconds.
          </p>
        </section>

        {/* Feature 1 */}
        <section className="bg-white/30 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-glass">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 bg-sky-500/10 rounded-xl flex items-center justify-center">
              <Code className="h-6 w-6 text-sky-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Secure Compiler (Static Analysis)</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            The static analysis engine inspects the raw `.dex` and `AndroidManifest.xml` files without executing the code. 
          </p>
          <ul className="list-disc list-inside text-slate-600 space-y-2 ml-4">
            <li>Extracts all exported and unexported components (Activities, Services).</li>
            <li>Maps requested permissions against known malware signatures.</li>
            <li>Identifies hardcoded API keys and secrets via entropy scanning.</li>
          </ul>
        </section>

        {/* Feature 2 */}
        <section className="bg-white/30 backdrop-blur-xl border border-white/50 p-8 rounded-2xl shadow-glass">
          <div className="flex items-center space-x-4 mb-6">
            <div className="h-12 w-12 bg-amber-500/10 rounded-xl flex items-center justify-center">
              <Shield className="h-6 w-6 text-amber-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-800">Dynamic Sandbox</h2>
          </div>
          <p className="text-slate-600 leading-relaxed mb-4">
            If an application is heavily obfuscated, you can push it to our hardware-level sandbox. The app is executed in a controlled emulator where network traffic, memory dumps, and API hooks are logged in real-time.
          </p>
          <div className="bg-white/40 border border-white/50 p-4 rounded-xl shadow-inner mt-4">
            <code className="text-sm text-[#0F357E] font-bold">
              // Example Sandbox Hook Configuration<br />
              {'{'}<br />
              &nbsp;&nbsp;"intercept_ssl": true,<br />
              &nbsp;&nbsp;"hook_crypto": true,<br />
              &nbsp;&nbsp;"dump_memory_on_exit": false<br />
              {'}'}
            </code>
          </div>
        </section>
      </main>
    </div>
  );
}
