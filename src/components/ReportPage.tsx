import React from 'react';
import { 
  FileText, 
  Printer, 
  Download, 
  ShieldAlert, 
  Building2, 
  Award, 
  Shield, 
  FileCheck,
  ChevronRight,
  UserCheck
} from 'lucide-react';
import { APKReport } from '../types';
import AIReverseEngineeringReport from './AIReverseEngineeringReport';

interface ReportPageProps {
  apkReports: APKReport[];
  selectedAPKId: string | null;
  onSelectAPK: (id: string) => void;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function ReportPage({
  apkReports,
  selectedAPKId,
  onSelectAPK,
  triggerToast
}: ReportPageProps) {
  const currentId = selectedAPKId || 'apk-01';
  const report = apkReports.find(r => r.id === currentId) || apkReports[0];

  const handlePrint = () => {
    window.print();
    triggerToast('Print Initiated', 'Dispensing physical report document...', 'info');
  };

  const handleExportJSON = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute("href", dataStr);
    downloadAnchor.setAttribute("download", `ThreatLens_${report.filename}_Forensic_Report.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    triggerToast('JSON Exported', 'Downloaded complete forensic JSON schema successfully.', 'success');
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="pdf-report-page">
      {/* Top Controls Bar (hidden during printing) */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 print:hidden">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Executive Security Dossier</h2>
          <p className="text-sm text-slate-500 mt-1">Generate a board-ready physical PDF report compiling CERT-In guidelines, Trojan payloads, and signature indicators</p>
        </div>
        
        <div className="flex flex-wrap items-center gap-3.5">
          <select 
            value={report.id}
            onChange={(e) => onSelectAPK(e.target.value)}
            className="px-3 py-2 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-700 focus:outline-none max-w-[200px]"
          >
            {apkReports.map(r => (
              <option key={r.id} value={r.id}>{r.filename}</option>
            ))}
          </select>

          <button
            onClick={handlePrint}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-glass transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Printer className="h-4 w-4" />
            <span>Print Report</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3.5 py-2 bg-white/20 backdrop-blur-xl hover:bg-white/40 backdrop-blur-md border border-[#E2E8F0] text-slate-700 text-xs font-bold uppercase tracking-wider rounded-lg shadow-glass transition-all flex items-center space-x-1.5 cursor-pointer"
          >
            <Download className="h-4 w-4" />
            <span>Export Raw JSON</span>
          </button>
        </div>
      </div>

      {/* PAPER DOCUMENT CONTAINER */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#D1D5DB] rounded-none shadow-xl max-w-4xl mx-auto p-12 space-y-12 print:border-none print:shadow-none print:p-0" id="formal-pdf-canvas">
        {/* Classified Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E3A8A] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#1E3A8A] text-white rounded font-mono font-black text-sm tracking-widest">TL</div>
            <div>
              <h1 className="text-base font-black tracking-tight uppercase text-[#1E3A8A]">ThreatLens AI Forensic Suite</h1>
              <span className="text-[9px] font-mono font-bold text-slate-400 block tracking-widest">CYBER RECONNAISSANCE CORE & TELEMETRY</span>
            </div>
          </div>
          <div className="text-right">
            <span className="inline-block px-3 py-1 bg-[#DC2626]/15 border border-[#DC2626]/20 text-[#DC2626] font-mono text-[10px] font-bold uppercase tracking-widest rounded">
              CLASSIFIED - RESTRICTED DISTRIBUTION
            </span>
            <span className="text-[9px] font-mono block mt-1 text-slate-400">SOC-REF: TLS-REP-2026-{report.id.toUpperCase()}</span>
          </div>
        </div>

        {/* Cover Page Metadata Block */}
        <div className="space-y-6">
          <div className="space-y-2">
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-black">Malware Reverse Engineering Assessment</span>
            <h2 className="text-3xl font-black text-slate-900 leading-tight">
              Forensic Source Code & Static Auditing Report: {report.filename}
            </h2>
            <p className="text-sm text-slate-500 leading-relaxed max-w-2xl">
              This intelligence document details bytecode signatures, manifest declarations, background payload capabilities, and threat indicators parsed from the target Android application. Distributed exclusively for the Board of Governors and Chief Information Security Officers (CISOs).
            </p>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-white/40 backdrop-blur-md border border-white/40">
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase font-black text-slate-400">Target Platform</span>
              <div className="text-xs font-bold text-slate-800">Android OS API v34+</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase font-black text-slate-400">Decompiler Engine</span>
              <div className="text-xs font-bold text-slate-800">ThreatLens Decompiler v3.5</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase font-black text-slate-400">Analysis Completed</span>
              <div className="text-xs font-bold text-slate-800">{report.uploadedAt} UTC</div>
            </div>
            <div className="space-y-1">
              <span className="text-[9px] font-mono uppercase font-black text-slate-400">Vulnerability Index</span>
              <div className="text-xs font-black text-[#DC2626]">{report.riskScore}/100 ({report.riskLevel})</div>
            </div>
          </div>
        </div>

        {/* SECTION 1: Hashes & Signatures */}
        <div className="space-y-3.5">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-white/40 pb-1.5 flex items-center space-x-1.5">
            <Award className="h-4 w-4" />
            <span>1. Package Integrity & Hash Summary</span>
          </h3>

          <div className="space-y-2 text-xs">
            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-white/30">
              <span className="font-mono text-slate-400 font-bold">Package Name</span>
              <span className="col-span-2 font-mono font-bold text-slate-800">{report.packageName}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-white/30">
              <span className="font-mono text-slate-400 font-bold">Application Size</span>
              <span className="col-span-2 font-bold text-slate-800">{report.size}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-white/30">
              <span className="font-mono text-slate-400 font-bold">Package Checksum (SHA256)</span>
              <span className="col-span-2 font-mono font-bold text-slate-800 break-all">{report.hash}</span>
            </div>
            <div className="grid grid-cols-3 gap-2 py-1.5 border-b border-white/30">
              <span className="font-mono text-slate-400 font-bold">Signing Issuer</span>
              <span className="col-span-2 font-mono font-bold text-[#DC2626] break-all">{report.certInfo.issuer}</span>
            </div>
          </div>
        </div>

        {/* SECTION 2: Permission Audit */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-white/40 pb-1.5 flex items-center space-x-1.5">
            <Shield className="h-4 w-4" />
            <span>2. Dangerous API Permissions Audit</span>
          </h3>

          <div className="border border-white/40 rounded overflow-hidden">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-white/60 backdrop-blur-lg border-b border-white/40 font-mono text-[9px] font-black uppercase text-slate-500">
                  <th className="p-2.5">Declared Android Permission</th>
                  <th className="p-2.5 text-center">Threat Rating</th>
                  <th className="p-2.5">Documented Abuse Vectors inside Phishing campaigns</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 text-slate-700">
                {report.permissions.map((perm, i) => (
                  <tr key={i}>
                    <td className="p-2.5 font-mono font-bold break-all max-w-[200px]">{perm.name}</td>
                    <td className="p-2.5 text-center">
                      <span className={`px-1.5 py-0.5 rounded text-[8px] font-mono font-bold uppercase ${
                        perm.dangerous ? 'bg-[#DC2626]/10 text-[#DC2626]' : 'bg-white/60 backdrop-blur-lg text-slate-500'
                      }`}>
                        {perm.dangerous ? 'Dangerous' : 'Standard'}
                      </span>
                    </td>
                    <td className="p-2.5 text-[11px] leading-relaxed">
                      {perm.dangerous ? perm.abuseScenario : perm.description}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* SECTION 3: Extracted IoCs */}
        <div className="space-y-4">
          <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-white/40 pb-1.5 flex items-center space-x-1.5">
            <ShieldAlert className="h-4 w-4" />
            <span>3. Embedded C2 Servers & Cryptographic Keys</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-xs">
            {/* Left URL block */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-black">Identified blacklisted domains</span>
              <div className="border border-white/40 rounded divide-y divide-slate-200">
                {report.extractedUrls.map((link, i) => (
                  <div key={i} className="p-2.5 bg-white/20 backdrop-blur-xl space-y-1">
                    <div className="font-mono font-bold text-slate-800 break-all">{link.url}</div>
                    <div className="flex items-center justify-between text-[10px] font-mono text-slate-400">
                      <span>TYPE: {link.category}</span>
                      <span className="font-bold text-[#DC2626]">{link.reputation}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Keys block */}
            <div className="space-y-2">
              <span className="text-[9px] font-mono uppercase tracking-widest text-slate-400 font-black">Decompiled Cryptographic Keys</span>
              <div className="border border-white/40 rounded divide-y divide-slate-200">
                {report.hardcodedKeys.length > 0 ? (
                  report.hardcodedKeys.map((key, i) => (
                    <div key={i} className="p-2.5 bg-white/20 backdrop-blur-xl space-y-1">
                      <div className="font-bold text-slate-700">{key.type}</div>
                      <div className="font-mono text-[10px] text-slate-500 break-all bg-white/40 backdrop-blur-md p-1 rounded border border-white/30">{key.key}</div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-slate-400 italic">No leaked credentials discovered in strings table</div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Sign-off Seal Section */}
        <div className="border-t border-slate-300 pt-8 flex items-end justify-between">
          <div className="space-y-1 text-xs">
            <div className="font-black text-slate-800">Assessed by: ThreatLens Forensics Core Engine</div>
            <div className="text-slate-400 font-mono text-[10px]">VERIFICATION_UUID: TL-DEC-9981-2200-A2</div>
            <div className="text-slate-400 font-mono text-[10px]">SECURE HASH MATCH SHA256 WITH RSA ASSIGNER</div>
          </div>

          {/* Official Seal Design */}
          <div className="flex flex-col items-center justify-center text-center p-3 border-2 border-[#1E3A8A] rounded-full w-24 h-24 text-[#1E3A8A] font-mono font-bold text-[8px] tracking-tight relative leading-none">
            <span className="absolute -top-1.5 bg-white/20 backdrop-blur-xl px-1 text-[7px] font-black uppercase text-[#1E3A8A]">APPROVED</span>
            <Building2 className="h-5 w-5 mb-1 text-[#1E3A8A]" />
            <span>THREATLENS</span>
            <span>SECURE SEAL</span>
            <span className="text-[6px] text-slate-400 mt-1">2026 AUDIT</span>
          </div>
        </div>
      </div>
      
      {/* Dynamic AI Reverse Engineering Report Module */}
      <AIReverseEngineeringReport apkReport={report} triggerToast={triggerToast} />
    </div>
  );
}
