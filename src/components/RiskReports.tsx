import React from 'react';
import { 
  Gauge, 
  ShieldAlert, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Sparkles, 
  HelpCircle,
  FileCheck,
  ShieldAlert as AlertIcon
} from 'lucide-react';
import { APKReport } from '../types';

interface RiskReportsProps {
  apkReports: APKReport[];
  selectedAPKId: string | null;
  onSelectAPK: (id: string) => void;
  onNavigateToReport: (id: string) => void;
}

export default function RiskReports({
  apkReports,
  selectedAPKId,
  onSelectAPK,
  onNavigateToReport
}: RiskReportsProps) {
  const currentId = selectedAPKId || 'apk-01';
  const report = apkReports.find(r => r.id === currentId) || apkReports[0];

  // Gauge calculations
  const score = report.riskScore;
  const radius = 70;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (score / 100) * circumference;

  const getRiskColor = (level: string) => {
    switch (level) {
      case 'Critical': return '#DC2626'; // Red
      case 'High': return '#F59E0B'; // Amber
      case 'Medium': return '#2563EB'; // Blue
      default: return '#16A34A'; // Green
    }
  };

  const riskColor = getRiskColor(report.riskLevel);

  // Generate customized risk reasons dynamically for authentic feel
  const getRiskReasons = (rep: APKReport) => {
    const reasons = [];
    
    // Check dangerous permissions
    const dangerousPerms = rep.permissions.filter(p => p.dangerous);
    if (dangerousPerms.length > 0) {
      reasons.push({
        title: `${dangerousPerms.length} Dangerous Manifest Permissions`,
        desc: `Requests access to high-risk APIs: ${dangerousPerms.map(p => p.name.split('.').pop()).join(', ')}.`,
        weight: dangerousPerms.length * 10,
        type: 'high'
      });
    }

    // Check suspicious APIs
    if (rep.suspiciousApis.length > 0) {
      reasons.push({
        title: `${rep.suspiciousApis.length} Suspicious Dalvik API Hooks`,
        desc: `Matched critical trojan bytecode patterns like reflection APIs or SMS intercept triggers.`,
        weight: 25,
        type: 'high'
      });
    }

    // Check domains
    const c2Domains = rep.extractedUrls.filter(u => u.category === 'C2 Server');
    if (c2Domains.length > 0) {
      reasons.push({
        title: 'Command and Control URL Matches',
        desc: `Discovered hardcoded links matching blacklisted IPs: ${c2Domains.map(u => u.url.replace('https://', '')).join(', ')}.`,
        weight: 30,
        type: 'critical'
      });
    }

    // Check cert
    if (rep.certInfo.issuer.includes('Bypass') || rep.certInfo.issuer.includes('Unknown')) {
      reasons.push({
        title: 'Untrusted/Reused SSL Signing Certificate',
        desc: 'Reuses certificates commonly registered inside phishing droppers to spoof legitimate app signing schemes.',
        weight: 15,
        type: 'medium'
      });
    } else {
      reasons.push({
        title: 'Valid Self-Signed Certificate',
        desc: 'Uses a generic self-signed signature, typical of early sandbox droppers but not yet associated with specific blacklists.',
        weight: 5,
        type: 'low'
      });
    }

    // Check obfuscation difficulty
    if (rep.obfuscation.isObfuscated) {
      reasons.push({
        title: 'Anti-Decompilation Obfuscation Active',
        desc: `DexGuard/ProGuard class renaming detected, indicating advanced evasion designed to confuse static antiviruses.`,
        weight: 10,
        type: 'medium'
      });
    }

    return reasons;
  };

  const riskReasons = getRiskReasons(report);

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="risk-score-page">
      {/* Selector Header Bar */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Vulnerability & Risk Indexing</h2>
          <p className="text-sm text-slate-500 mt-1">Review the mathematical scoring breakdown and threat weights applied to decompiled source packages</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex-shrink-0">Selected APK:</span>
          <select 
            value={report.id}
            onChange={(e) => onSelectAPK(e.target.value)}
            className="px-3 py-2 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-700 focus:outline-none focus:ring-1 focus:ring-[#2563EB] max-w-[280px]"
          >
            {apkReports.map(r => (
              <option key={r.id} value={r.id}>{r.filename} ({r.riskLevel})</option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Circular Gauge */}
        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col items-center justify-center text-center space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Calculated Security Risk</h3>
            <span className="text-xs text-slate-400">Threat weight compilation index</span>
          </div>

          {/* SVG Gauge */}
          <div className="relative flex items-center justify-center">
            <svg className="w-44 h-44 transform -rotate-90">
              {/* Gray background track */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke="#F1F5F9"
                strokeWidth="12"
                fill="transparent"
              />
              {/* Color indicator arc */}
              <circle
                cx="88"
                cy="88"
                r={radius}
                stroke={riskColor}
                strokeWidth="12"
                fill="transparent"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                className="transition-all duration-1000 ease-out"
              />
            </svg>
            {/* Centered label */}
            <div className="absolute text-center space-y-0.5">
              <div className="text-4xl font-extrabold tracking-tight" style={{ color: riskColor }}>
                {score}
              </div>
              <div className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold">
                {report.riskLevel} Risk
              </div>
            </div>
          </div>

          {/* Risk Level guide */}
          <div className="w-full grid grid-cols-5 gap-1.5 pt-4 text-center text-[10px] font-bold border-t border-white/30 font-mono">
            <div className="space-y-1">
              <span className="h-2 w-full rounded-full bg-[#16A34A] block opacity-40" />
              <span className="text-slate-400">Safe</span>
            </div>
            <div className="space-y-1">
              <span className="h-2 w-full rounded-full bg-[#2563EB] block opacity-40" />
              <span className="text-slate-400">Low</span>
            </div>
            <div className="space-y-1">
              <span className="h-2 w-full rounded-full bg-[#3B82F6] block opacity-40" />
              <span className="text-slate-400">Med</span>
            </div>
            <div className="space-y-1">
              <span className="h-2 w-full rounded-full bg-[#F59E0B] block opacity-40" />
              <span className="text-slate-400">High</span>
            </div>
            <div className="space-y-1">
              <span className="h-2 w-full rounded-full bg-[#DC2626] block opacity-40" />
              <span className="text-slate-400">Crit</span>
            </div>
          </div>
        </div>

        {/* Right Details: Scoring Factors */}
        <div className="bg-white/20 backdrop-blur-xl p-6 rounded-xl border border-[#E2E8F0] shadow-glass md:col-span-2 space-y-6 flex flex-col justify-between">
          <div className="space-y-4">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Threat Weight Factors</h3>
              <span className="text-xs text-slate-400">Individual metrics comprising the calculated score of {score}/100</span>
            </div>

            {/* List reasons */}
            <div className="space-y-3 max-h-72 overflow-y-auto pr-1">
              {riskReasons.map((reason, idx) => (
                <div 
                  key={idx}
                  className="p-3.5 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-xl flex items-start justify-between gap-4 hover:border-slate-300 transition-all"
                >
                  <div className="space-y-1">
                    <h4 className="text-xs font-extrabold text-slate-800">{reason.title}</h4>
                    <p className="text-xs text-slate-500 leading-normal">{reason.desc}</p>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase flex-shrink-0 ${
                    reason.type === 'critical' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                    reason.type === 'high' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                    reason.type === 'medium' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                    'bg-[#16A34A]/10 text-[#16A34A]'
                  }`}>
                    +{reason.weight}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Action CTA */}
          <div className="pt-4 border-t border-white/30 flex flex-col sm:flex-row items-center justify-between gap-4">
            <span className="text-xs text-slate-500 font-mono">ID: SEC_RISK_AUDIT_MATCH_TLS_2026</span>
            <button
              onClick={() => onNavigateToReport(report.id)}
              className="w-full sm:w-auto px-4 py-2.5 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-glass transition-all flex items-center justify-center space-x-1.5 cursor-pointer"
            >
              <FileCheck className="h-4 w-4" />
              <span>Generate Comprehensive PDF Report</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
