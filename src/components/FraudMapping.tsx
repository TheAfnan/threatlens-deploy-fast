import React, { useState } from 'react';
import { 
  GitBranch, 
  ChevronRight, 
  ShieldCheck, 
  ShieldAlert, 
  Lock, 
  Smartphone, 
  MessageSquare, 
  Send, 
  Building,
  AlertTriangle,
  Info
} from 'lucide-react';
import { mockBankingThreatScenarios } from '../mockData';

export default function FraudMapping() {
  const [activeStep, setActiveStep] = useState(0);

  const fraudSteps = [
    {
      title: '1. Credential Theft',
      sub: 'Initial Harvesting',
      icon: Lock,
      color: '#2563EB',
      desc: 'The Trojan monitors the device background. When a retail banking app is launched, it harvests account details.',
      mechanics: 'Abuses Accessibility APIs to scrape user fields, or intercepts clipboard contents when copy-pasting customer login passwords.',
      threatMatch: 'Axis KYC Verification RAT, PNB One Phisher',
      mitigation: 'Implement secure virtual keypads that randomize layouts and mask touch inputs. Zero-trust clipboard access audits.'
    },
    {
      title: '2. Overlay Attack',
      sub: 'Visual Hijacking',
      icon: Smartphone,
      color: '#3B82F6',
      desc: 'Malware spawns a transparent, fully-drawn fake interface exactly mimicking the target bank on top of the legitimate app.',
      mechanics: 'Launches full-screen SYSTEM_ALERT_WINDOW triggers. Prevents user from dismissing the overlay, collecting credit card PINs and ATM keys.',
      threatMatch: 'HDFC Security App Overlay, IDFC First Overlay Prompt',
      mitigation: 'Enforce Android window secure layout flags (FLAG_SECURE) to prevent screenshots, overlays, or remote recording threads.'
    },
    {
      title: '3. OTP Theft',
      sub: '2FA Interception',
      icon: MessageSquare,
      color: '#F59E0B',
      desc: 'The Trojan sniffs incoming carrier text messages to bypass standard bank authentication protocols silently.',
      mechanics: 'Abuses RECEIVE_SMS and READ_SMS broadcast receivers. Automatically forwards OTP strings to C2 and suppresses native push alarms.',
      threatMatch: 'Canara ai1 SMS Forwarder, Federal Bank OTP Interceptor',
      mitigation: 'Deprecate SMS-based OTPs. Migrate banking networks to cryptographic secure hardware tokens or in-app biometric signatures.'
    },
    {
      title: '4. UPI Abuse',
      sub: 'Automated Transfer (ATS)',
      icon: Send,
      color: '#E11D48',
      desc: 'Using accessibility dispatchers, the botnet executes silent payments out of retail payment accounts (GPay, PhonePe, BHIM).',
      mechanics: 'Automates user touch sequences inside payment windows while device screens are locked or dimmed during late-night cycles.',
      threatMatch: 'ICICI UPI Reward Phishing, Kotak 811 Verification Trojan',
      mitigation: 'Integrate active Accessibility abuse scanners on transaction checkout pages. Require biometrics for every UPI transfer.'
    },
    {
      title: '5. Account Takeover',
      sub: 'Full Drain / Hijack',
      icon: Building,
      color: '#DC2626',
      desc: 'Complete control over customer netbanking. Malware updates registered phone numbers and drains total fund balance.',
      mechanics: 'Utilizes RAT backdoors to manage accounts, registers new UPI bindings, and secures permanent backdoor handles.',
      threatMatch: 'Union Bank Assistant RAT, Fake Yono SBI APK Upgrade',
      mitigation: 'Implement real-time device reputation checks, multi-factor behavioral analysis, and out-of-band banking account lock alerts.'
    }
  ];

  const currentDetail = fraudSteps[activeStep];

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="fraud-mapping-page">
      {/* Title Header */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Banking Fraud Mapping</h2>
          <p className="text-sm text-slate-500 mt-1">Interactive flowchart tracking how Android Trojans execute multi-phase banking theft and bypass SMS two-factor verification</p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono bg-[#DC2626]/10 px-3 py-1.5 rounded-lg border border-[#DC2626]/10 text-[#DC2626] font-bold">
          <GitBranch className="h-3.5 w-3.5" />
          <span>ATTACK_PATH: HIGH_RISK</span>
        </div>
      </div>

      {/* INTERACTIVE FLOWCHART NODES */}
      <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-[#E2E8F0] shadow-glass space-y-6">
        <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block text-center sm:text-left">Click a node to audit threat vectors</span>
        
        {/* Horizontal Node Flow */}
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 md:gap-2 pt-2 pb-6 border-b border-white/30 overflow-x-auto">
          {fraudSteps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = idx === activeStep;

            return (
              <React.Fragment key={idx}>
                {/* Node Button */}
                <button
                  onClick={() => setActiveStep(idx)}
                  className={`w-full md:w-48 p-4 rounded-xl border text-left transition-all cursor-pointer relative ${
                    isActive 
                      ? 'border-[#2563EB] bg-[#2563EB]/5 shadow-md ring-2 ring-[#2563EB]/10' 
                      : 'border-[#E2E8F0] hover:border-slate-300 bg-white/20 backdrop-blur-xl shadow-glass'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div 
                      className="p-2 rounded-lg flex-shrink-0 text-white"
                      style={{ backgroundColor: step.color }}
                    >
                      <StepIcon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs font-extrabold text-slate-800 truncate">{step.title}</div>
                      <div className="text-[10px] text-slate-400 font-mono mt-0.5">{step.sub}</div>
                    </div>
                  </div>
                  {/* Absolute active top dot indicator */}
                  {isActive && (
                    <span className="absolute -top-1 right-3 h-2 w-2 rounded-full bg-[#2563EB] animate-ping" />
                  )}
                </button>

                {/* Arrow Connector */}
                {idx < fraudSteps.length - 1 && (
                  <div className="hidden md:block text-slate-300 text-lg font-bold select-none px-1">
                    <ChevronRight className="h-5 w-5" />
                  </div>
                )}
              </React.Fragment>
            );
          })}
        </div>

        {/* ACTIVE STEP DETAILED INSPECTION */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
          {/* Node Mechanics */}
          <div className="md:col-span-2 space-y-5">
            <div>
              <span className="text-xs font-bold text-[#2563EB] uppercase tracking-wider">Exploit Mechanics</span>
              <h3 className="text-lg font-extrabold text-slate-800 mt-0.5">{currentDetail.title} ({currentDetail.sub})</h3>
              <p className="text-sm text-slate-600 mt-2 leading-relaxed">{currentDetail.desc}</p>
            </div>

            {/* Technical analysis blocks */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center space-x-1">
                  <ShieldAlert className="h-3.5 w-3.5 text-[#DC2626]" />
                  <span>How Trojan Executes</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentDetail.mechanics}</p>
              </div>

              <div className="p-4 bg-[#16A34A]/5 border border-[#16A34A]/10 rounded-xl space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold flex items-center space-x-1">
                  <ShieldCheck className="h-3.5 w-3.5 text-[#16A34A]" />
                  <span>Indian Banking Defenses</span>
                </span>
                <p className="text-xs text-slate-700 leading-relaxed font-medium">{currentDetail.mitigation}</p>
              </div>
            </div>

            {/* Active campaigns match */}
            <div className="p-3.5 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-xl flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 font-bold uppercase text-[10px]">Identified Matching Campaigns:</span>
              <span className="text-slate-700 font-extrabold text-[#DC2626] uppercase">{currentDetail.threatMatch}</span>
            </div>
          </div>

          {/* Connected India Threat Scenarios sidebar */}
          <div className="p-4 bg-[#0F172A] text-slate-300 rounded-xl border border-slate-800 space-y-4">
            <div className="space-y-0.5">
              <h4 className="text-xs font-extrabold text-white uppercase tracking-wider flex items-center space-x-1.5">
                <AlertTriangle className="h-3.5 w-3.5 text-[#F59E0B]" />
                <span>Active Indian Scenarios</span>
              </h4>
              <span className="text-[10px] text-slate-400 font-mono block">Real-world cases mapping this step</span>
            </div>

            <div className="space-y-3 max-h-64 overflow-y-auto pr-1">
              {mockBankingThreatScenarios
                .filter(scen => {
                  if (activeStep === 0) return scen.threatVector.toLowerCase().includes('rat') || scen.threatVector.toLowerCase().includes('phishing');
                  if (activeStep === 1) return scen.threatVector.toLowerCase().includes('overlay');
                  if (activeStep === 2) return scen.threatVector.toLowerCase().includes('sms');
                  if (activeStep === 3) return scen.threatVector.toLowerCase().includes('ats') || scen.threatVector.toLowerCase().includes('bypas') || scen.threatVector.toLowerCase().includes('auto');
                  return true;
                })
                .slice(0, 3)
                .map((scen, idx) => (
                  <div key={idx} className="p-3 bg-white/5 border border-white/10 rounded-lg space-y-1 hover:border-white/20 transition-all">
                    <div className="text-xs font-extrabold text-[#F59E0B] tracking-tight">{scen.name}</div>
                    <p className="text-[11px] text-slate-400 leading-normal">{scen.description.substring(0, 100)}...</p>
                    <div className="text-[10px] text-[#2563EB] font-bold font-mono">Targets: {scen.targetBanks.join(', ')}</div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
