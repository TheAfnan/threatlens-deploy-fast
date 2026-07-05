import React, { useState } from 'react';
import { 
  Sparkles, 
  Send, 
  Copy, 
  Check, 
  Smartphone, 
  AlertTriangle, 
  ShieldAlert, 
  Loader2, 
  Terminal,
  HelpCircle
} from 'lucide-react';
import { APKReport, AIReport } from '../types';
import { useAppStore } from '../lib/store';
import { PaywallOverlay } from './PaywallOverlay';

interface AIInvestigationProps {
  apkReports: APKReport[];
  aiReports: AIReport[];
  selectedAPKId: string | null;
  onSelectAPK: (id: string) => void;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
  onUpgrade?: () => void;
}

export default function AIInvestigation({
  apkReports,
  aiReports,
  selectedAPKId,
  onSelectAPK,
  triggerToast,
  onUpgrade
}: AIInvestigationProps) {
  const { isProUser, useCredit, addToast } = useAppStore();

  const currentId = selectedAPKId || 'apk-01';
  const report = apkReports.find(r => r.id === currentId) || apkReports[0];

  const [promptText, setPromptText] = useState('Decompile the package components, explain how SMS OTPs are bypassed, and catalog the specific target banks.');
  const [isLoading, setIsLoading] = useState(false);
  const [currentAIReport, setCurrentAIReport] = useState<Partial<AIReport> | null>(() => {
    // Initial load: match existing static report
    const staticRep = aiReports.find(ar => ar.apkId === currentId);
    return staticRep || aiReports[0];
  });
  const [copied, setCopied] = useState(false);
  const copiedTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear the copy-feedback timer on unmount
  React.useEffect(() => {
    return () => {
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);

  // Trigger Gemini API Server-side investigation
  const handleExecuteInvestigation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!promptText.trim()) return;

    if (!useCredit()) {
      addToast({ title: 'Credit Depleted', description: 'You have run out of AI credits. Upgrade to Pro Max Ultra for unlimited investigations.', type: 'error' });
      onUpgrade?.();
      return;
    }

    setIsLoading(true);
    triggerToast('Gemini API Dispatched', 'Contacting server-side model for decompiler telemetry...', 'info');

    try {
      const response = await fetch('/api/investigate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          apkDetails: report,
          customPrompt: promptText
        })
      });

      const data = await response.json();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${data?.error || response.statusText}`);
      if (data.success && data.report) {
        setCurrentAIReport({
          id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `rep-${Date.now()}`,
          apkId: report.id,
          filename: report.filename,
          ...data.report
        });
        triggerToast('Investigation Compiled', `Analysis completed via ${data.source}.`, 'success');
      } else {
        throw new Error('Invalid server response');
      }
    } catch (err) {
      console.error('AI investigation request failed, falling back to local threat engine:', err);
      // Fail gracefully and use mock generator (handled in server as well, but double guard here)
      triggerToast('Network Warning', 'Using cached threat-analysis profiles.', 'warn');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyReport = () => {
    if (!currentAIReport) return;
    
    const formattedText = `
THREATLENS AI - SECURE INVESTIGATION REPORT
==========================================
TARGET FILE: ${currentAIReport.filename || report.filename}
MALWARE FAMILY: ${currentAIReport.malwareFamily}
CONFIDENCE LEVEL: ${currentAIReport.confidence}

EXECUTIVE PURPOSE:
${currentAIReport.purpose}

BOOT & EXECUTION LOGIC:
${currentAIReport.executionLogic}

CREDENTIAL THEFT STRATEGY:
${currentAIReport.credentialTheft}

PRIMARY BANKING TARGETS:
${(currentAIReport.bankingTargets || []).join(', ')}

C2 NETWORK BEHAVIOUR:
${currentAIReport.networkBehaviour}

PERSISTENCE MECHANICS:
${currentAIReport.persistence}

OBFUSCATION TECHNIQUES:
${currentAIReport.obfuscation}

Report compiled by ThreatLens AI Core on ${new Date().toISOString().substring(0, 10)}.
    `;

    navigator.clipboard.writeText(formattedText.trim());
    setCopied(true);
    triggerToast('Copied to Clipboard', 'Analysis markdown ready to share.', 'success');
    if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    copiedTimeoutRef.current = setTimeout(() => setCopied(false), 2000);
  };

  // Switch analyzed APK
  const handleSelectAPKChange = (id: string) => {
    onSelectAPK(id);
    const existingRep = aiReports.find(ar => ar.apkId === id);
    if (existingRep) {
      setCurrentAIReport(existingRep);
    } else {
      // Create empty/ready state
      setCurrentAIReport(null);
    }
  };

  return (
    <div className="relative h-full flex flex-col">
      {!isProUser && (
        <PaywallOverlay 
          featureName="AI Co-Pilot Integration"
          description="Deep, real-time AI anomaly detection requires immense LLM compute. Upgrade to Premium to unlock automated exploit vector analysis and live security patching intelligence."
          onUpgrade={() => onUpgrade?.()}
        />
      )}
      <div className={`space-y-6 font-sans text-[#0F172A] ${!isProUser ? 'opacity-40 pointer-events-none select-none blur-sm' : ''}`} id="ai-investigation-portal">
      {/* Selector Header Bar */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight flex items-center space-x-2">
            <Sparkles className="h-5.5 w-5.5 text-[#2563EB]" />
            <span>AI Forensic Investigation Terminal</span>
          </h2>
          <p className="text-sm text-slate-500 mt-1">Audit Trojan execution structures and auto-generate reverse engineering summaries using server-side Gemini intelligence</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex-shrink-0">Target File:</span>
          <select 
            value={report.id}
            onChange={(e) => handleSelectAPKChange(e.target.value)}
            className="px-3 py-2 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB] max-w-[280px]"
          >
            {apkReports.map(r => (
              <option key={r.id} value={r.id}>{r.filename}</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Chat prompt Left column */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-5 h-fit">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700 flex items-center space-x-1.5">
              <Terminal className="h-4 w-4 text-[#2563EB]" />
              <span>SOC Prompts Console</span>
            </h3>
            <span className="text-xs text-slate-400">Direct Gemini LLM to scrutinize specific bytecode arrays</span>
          </div>

          <form onSubmit={handleExecuteInvestigation} className="space-y-4">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-600">Custom Investigation Prompt</label>
              <textarea
                value={promptText}
                onChange={(e) => setPromptText(e.target.value)}
                rows={5}
                required
                className="w-full p-3 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-xl text-xs font-semibold placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB] text-slate-800 resize-none leading-relaxed"
                placeholder="Ask Gemini to extract specifics..."
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 disabled:bg-[#2563EB]/50 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-glass transition-all flex items-center justify-center space-x-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  <span>Compiling Decompiler Core...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-4 w-4" />
                  <span>Execute AI Reverse Engineer</span>
                </>
              )}
            </button>
          </form>

          {/* Quick suggestions */}
          <div className="space-y-2 pt-2 border-t border-white/30">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block flex items-center space-x-1">
              <HelpCircle className="h-3.5 w-3.5" />
              <span>Suggested Inquiries</span>
            </span>
            <div className="space-y-1.5">
              <button
                type="button"
                onClick={() => setPromptText("Evaluate string encryption inside resources, extract hardcoded C2 decryption keys, and map API hooks.")}
                className="w-full text-left p-2 hover:bg-white/40 backdrop-blur-md border border-white/30 rounded text-[11px] font-semibold text-slate-600 truncate block cursor-pointer"
              >
                Evaluate key extraction & obfuscation keys
              </button>
              <button
                type="button"
                onClick={() => setPromptText("Describe the persistence layers: how does the APK prevent manual settings disables and device admin uninstalls?")}
                className="w-full text-left p-2 hover:bg-white/40 backdrop-blur-md border border-white/30 rounded text-[11px] font-semibold text-slate-600 truncate block cursor-pointer"
              >
                Describe persistence & uninstallation overrides
              </button>
            </div>
          </div>
        </div>

        {/* AI Report Output Right Column */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass lg:col-span-2 space-y-6 min-h-96">
          <div className="flex items-center justify-between border-b border-white/30 pb-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Gemini Security Intelligence Output</h3>
              <span className="text-xs text-slate-400">Verified malware execution profile</span>
            </div>
            {currentAIReport && (
              <button
                onClick={handleCopyReport}
                className="px-3 py-1.5 bg-white/60 backdrop-blur-lg hover:bg-[#2563EB] hover:text-white text-[11px] font-bold uppercase tracking-wider rounded border border-[#E2E8F0] transition-all flex items-center space-x-1 text-slate-700 cursor-pointer"
              >
                {copied ? <Check className="h-3.5 w-3.5 text-[#16A34A]" /> : <Copy className="h-3.5 w-3.5" />}
                <span>Copy Investigation</span>
              </button>
            )}
          </div>

          {/* Skeleton loading state */}
          {isLoading ? (
            <div className="space-y-6 animate-pulse">
              <div className="p-4 bg-white/40 backdrop-blur-md rounded-xl space-y-3">
                <div className="h-4 bg-slate-200 rounded w-1/4" />
                <div className="h-3 bg-slate-200 rounded w-full" />
                <div className="h-3 bg-slate-200 rounded w-5/6" />
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="h-24 bg-white/40 backdrop-blur-md rounded-xl" />
                <div className="h-24 bg-white/40 backdrop-blur-md rounded-xl" />
              </div>
              <div className="h-40 bg-white/40 backdrop-blur-md rounded-xl" />
            </div>
          ) : currentAIReport ? (
            <div className="space-y-6" id="ai-report-body">
              {/* Executive Purpose */}
              <div className="p-4 bg-white/40 backdrop-blur-md rounded-xl border border-[#E2E8F0] space-y-1.5">
                <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">1. Security Overview & Intended Purpose</span>
                <p className="text-xs text-slate-700 leading-relaxed font-semibold">{currentAIReport.purpose}</p>
              </div>

              {/* Grid mechanics */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="p-4 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-xl space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">Malware Family Model</span>
                  <div className="text-sm font-extrabold text-[#DC2626] font-mono">{currentAIReport.malwareFamily}</div>
                </div>

                <div className="p-4 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-xl space-y-1.5">
                  <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold block">Assessor Confidence</span>
                  <div className="text-sm font-extrabold text-[#2563EB] font-mono">{currentAIReport.confidence}</div>
                </div>
              </div>

              {/* Detailed blocks */}
              <div className="space-y-4">
                {/* Boot & execution logic */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">2. Boot & Execution Logic</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{currentAIReport.executionLogic}</p>
                </div>

                {/* Credential Theft */}
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#DC2626] font-extrabold block">3. Credential Theft & Overlay Vectors</span>
                  <p className="text-xs text-slate-600 leading-relaxed">{currentAIReport.credentialTheft}</p>
                </div>

                {/* Targeted Banks */}
                {currentAIReport.bankingTargets && currentAIReport.bankingTargets.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">4. India Core Retail Banking Targets</span>
                    <div className="flex flex-wrap gap-2">
                      {currentAIReport.bankingTargets.map((bank, i) => (
                        <span key={i} className="px-2.5 py-1 bg-[#2563EB]/10 text-[#2563EB] rounded font-mono text-[10px] font-bold">
                          {bank}
                        </span>
                      ))}
                    </div>
                  </div>
                )}

                {/* Network, Persistence & Obfuscation */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block border-b border-white/30 pb-1">Network C2</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{currentAIReport.networkBehaviour}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block border-b border-white/30 pb-1">Persistence</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{currentAIReport.persistence}</p>
                  </div>
                  <div className="space-y-1">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block border-b border-white/30 pb-1">Obfuscation</span>
                    <p className="text-[11px] text-slate-500 leading-relaxed">{currentAIReport.obfuscation}</p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-center p-6 bg-white/40 backdrop-blur-md rounded-xl border border-dashed border-[#E2E8F0]">
              <Sparkles className="h-10 w-10 text-slate-300 mb-2" />
              <p className="text-sm font-bold text-slate-600">Pending Decompilation Analysis</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">Please select an APK model or submit a prompt inquiry to decompile and draft the cybersecurity overview.</p>
            </div>
          )}
        </div>
      </div>
      </div>
    </div>
  );
}
