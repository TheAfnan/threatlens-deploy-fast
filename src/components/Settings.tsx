import React, { useState } from 'react';
import { 
  Settings as SettingsIcon, 
  Key, 
  Building2, 
  BellRing, 
  Terminal, 
  CheckCircle,
  HelpCircle,
  Cpu
} from 'lucide-react';

interface SettingsProps {
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function Settings({ triggerToast }: SettingsProps) {
  // Local config state
  const [apiKey, setApiKey] = useState(() => {
    try { return localStorage.getItem('soc_apiKey') || ''; } catch { return ''; }
  });
  const [vtKey, setVtKey] = useState(() => {
    try { return localStorage.getItem('soc_vtKey') || ''; } catch { return ''; }
  });
  const [certThreshold, setCertThreshold] = useState(() => {
    try { return Number(localStorage.getItem('soc_certThreshold')) || 80; } catch { return 80; }
  });
  const [sandboxTimeout, setSandboxTimeout] = useState(() => {
    try { return Number(localStorage.getItem('soc_sandboxTimeout')) || 30; } catch { return 30; }
  });
  
  // Defended Banks
  const [defendedBanks, setDefendedBanks] = useState(() => {
    try {
      const saved = localStorage.getItem('soc_defendedBanks');
      if (saved) return JSON.parse(saved);
    } catch {
      // Storage value was corrupted — silently fall back to defaults
    }
    return {
      sbi: true,
      hdfc: true,
      icici: true,
      boi: false,
      canara: true,
      kotak: false
    };
  });

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    localStorage.setItem('soc_apiKey', apiKey);
    localStorage.setItem('soc_vtKey', vtKey);
    localStorage.setItem('soc_certThreshold', certThreshold.toString());
    localStorage.setItem('soc_sandboxTimeout', sandboxTimeout.toString());
    localStorage.setItem('soc_defendedBanks', JSON.stringify(defendedBanks));
    triggerToast('Configuration Saved', 'System variables updated inside local state storage.', 'success');
  };

  const toggleBank = (key: keyof typeof defendedBanks) => {
    setDefendedBanks(prev => {
      const newState = { ...prev, [key]: !prev[key] };
      localStorage.setItem('soc_defendedBanks', JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="system-settings-page">
      {/* Title Header */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">SOC System Settings</h2>
          <p className="text-sm text-slate-500 mt-1">Configure automated reporting thresholds, Gemini API credentials, and active financial defense targets</p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono bg-[#2563EB]/10 px-3 py-1.5 rounded-lg border border-[#2563EB]/10 text-[#2563EB] font-bold">
          <Cpu className="h-3.5 w-3.5" />
          <span>SYS_CONF: OK</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Core settings form */}
        <form onSubmit={handleSaveConfigs} className="lg:col-span-2 space-y-6">
          {/* API Keys */}
          <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Key className="h-4 w-4 text-[#2563EB]" />
              <span>External API Integrations</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Gemini 2.5 API Key</label>
                <input 
                  type="password"
                  value={apiKey}
                  onChange={(e) => setApiKey(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-slate-700"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Required for real-time decompiler summaries.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">VirusTotal Enterprise key</label>
                <input 
                  type="text"
                  value={vtKey}
                  onChange={(e) => setVtKey(e.target.value)}
                  className="w-full px-3.5 py-2 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-slate-700 font-mono"
                />
                <span className="text-[10px] text-slate-400 block mt-0.5">Used for matching compiled checksum logs.</span>
              </div>
            </div>
          </div>

          {/* Threshold configurations */}
          <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-4">
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <BellRing className="h-4 w-4 text-[#F59E0B]" />
              <span>Automated CERT-In Report Thresholds</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Reporting Risk Score Limit</label>
                <div className="flex items-center space-x-3">
                  <input 
                    type="range"
                    min="1"
                    max="100"
                    value={certThreshold}
                    onChange={(e) => setCertThreshold(Number(e.target.value))}
                    className="flex-grow accent-[#2563EB]"
                  />
                  <span className="font-mono font-bold text-slate-700 w-8">{certThreshold}</span>
                </div>
                <span className="text-[10px] text-slate-400 block">Auto-generates draft reports when APK exceeds this rating.</span>
              </div>

              <div className="space-y-1.5">
                <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Sandbox Execution timeout (sec)</label>
                <input 
                  type="number"
                  min="10"
                  max="120"
                  value={sandboxTimeout}
                  onChange={(e) => setSandboxTimeout(Number(e.target.value))}
                  className="w-full px-3.5 py-2 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-slate-700 font-mono"
                />
                <span className="text-[10px] text-slate-400 block">Determines standard timeout for dynamic thread traces.</span>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="px-5 py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-glass transition-all cursor-pointer"
          >
            Save SOC Configurations
          </button>
        </form>

        {/* Right defended institutions selection card */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-4">
          <div>
            <h3 className="text-xs font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-2">
              <Building2 className="h-4 w-4 text-[#16A34A]" />
              <span>Protected Retail Banks</span>
            </h3>
            <span className="text-xs text-slate-400 block mt-0.5">Toggle active layout scrapers for Indian banking modules</span>
          </div>

          <div className="space-y-2">
            <button
              onClick={() => toggleBank('sbi')}
              type="button"
              className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                defendedBanks.sbi ? 'border-[#16A34A] bg-[#16A34A]/5 font-bold' : 'border-white/40 bg-white/20 backdrop-blur-xl text-slate-400'
              }`}
            >
              <span>State Bank of India (SBI)</span>
              <span className={`h-2.5 w-2.5 rounded-full ${defendedBanks.sbi ? 'bg-[#16A34A]' : 'bg-slate-300'}`} />
            </button>

            <button
              onClick={() => toggleBank('hdfc')}
              type="button"
              className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                defendedBanks.hdfc ? 'border-[#16A34A] bg-[#16A34A]/5 font-bold' : 'border-white/40 bg-white/20 backdrop-blur-xl text-slate-400'
              }`}
            >
              <span>HDFC Bank Limited</span>
              <span className={`h-2.5 w-2.5 rounded-full ${defendedBanks.hdfc ? 'bg-[#16A34A]' : 'bg-slate-300'}`} />
            </button>

            <button
              onClick={() => toggleBank('icici')}
              type="button"
              className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                defendedBanks.icici ? 'border-[#16A34A] bg-[#16A34A]/5 font-bold' : 'border-white/40 bg-white/20 backdrop-blur-xl text-slate-400'
              }`}
            >
              <span>ICICI Bank Corporation</span>
              <span className={`h-2.5 w-2.5 rounded-full ${defendedBanks.icici ? 'bg-[#16A34A]' : 'bg-slate-300'}`} />
            </button>

            <button
              onClick={() => toggleBank('boi')}
              type="button"
              className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                defendedBanks.boi ? 'border-[#16A34A] bg-[#16A34A]/5 font-bold' : 'border-white/40 bg-white/20 backdrop-blur-xl text-slate-400'
              }`}
            >
              <span>Bank of India (BOI)</span>
              <span className={`h-2.5 w-2.5 rounded-full ${defendedBanks.boi ? 'bg-[#16A34A]' : 'bg-slate-300'}`} />
            </button>

            <button
              onClick={() => toggleBank('canara')}
              type="button"
              className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                defendedBanks.canara ? 'border-[#16A34A] bg-[#16A34A]/5 font-bold' : 'border-white/40 bg-white/20 backdrop-blur-xl text-slate-400'
              }`}
            >
              <span>Canara Bank</span>
              <span className={`h-2.5 w-2.5 rounded-full ${defendedBanks.canara ? 'bg-[#16A34A]' : 'bg-slate-300'}`} />
            </button>

            <button
              onClick={() => toggleBank('kotak')}
              type="button"
              className={`w-full p-3 border rounded-xl flex items-center justify-between text-xs transition-all cursor-pointer ${
                defendedBanks.kotak ? 'border-[#16A34A] bg-[#16A34A]/5 font-bold' : 'border-white/40 bg-white/20 backdrop-blur-xl text-slate-400'
              }`}
            >
              <span>Kotak Mahindra Bank</span>
              <span className={`h-2.5 w-2.5 rounded-full ${defendedBanks.kotak ? 'bg-[#16A34A]' : 'bg-slate-300'}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
