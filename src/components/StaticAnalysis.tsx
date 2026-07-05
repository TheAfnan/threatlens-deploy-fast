import React, { useState } from 'react';
import { 
  Shield, 
  ShieldAlert, 
  FileCode, 
  Globe, 
  Cpu, 
  Key, 
  Award, 
  Lock, 
  ChevronDown, 
  ChevronUp, 
  Info, 
  AlertTriangle, 
  CheckCircle,
  FolderOpen
} from 'lucide-react';
import { APKReport } from '../types';

interface StaticAnalysisProps {
  apkReports: APKReport[];
  selectedAPKId: string | null;
  onSelectAPK: (id: string) => void;
}

export default function StaticAnalysis({ 
  apkReports, 
  selectedAPKId, 
  onSelectAPK 
}: StaticAnalysisProps) {
  
  // Default to the first report if none is specified
  const currentId = selectedAPKId || 'apk-01';
  const report = apkReports.find(r => r.id === currentId) || apkReports[0];

  // Accordion toggle states
  const [openAccordions, setOpenAccordions] = useState<Record<string, boolean>>({
    permissions: true,
    manifest: false,
    urls: true,
    apis: false,
    keys: false,
    certificates: false,
    obfuscation: false
  });

  const toggleAccordion = (section: string) => {
    setOpenAccordions(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const dangerousPermissions = report.permissions.filter(p => p.dangerous);
  const normalPermissions = report.permissions.filter(p => !p.dangerous);

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="static-analysis-panel">
      {/* Selector Header Bar */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Static Manifest Inspection</h2>
          <p className="text-sm text-slate-500 mt-1">Audit decompiled package code, structural resources, and permission maps</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex-shrink-0">Selected File:</span>
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

      {/* APK Meta Card */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 p-5 bg-white/20 backdrop-blur-xl rounded-xl border border-[#E2E8F0] shadow-glass">
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Package Identifier</span>
          <div className="text-xs font-mono font-bold text-slate-800 break-all">{report.packageName}</div>
        </div>
        <div className="space-y-1">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">SHA256 Signature</span>
          <div className="text-xs font-mono font-bold text-slate-800 break-all">{report.hash.substring(0, 32)}...</div>
        </div>
        <div className="space-y-1 text-left md:text-center">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Size & Version</span>
          <div className="text-xs font-mono font-bold text-slate-800">{report.size} / v{report.version}</div>
        </div>
        <div className="space-y-1 text-left md:text-right">
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest font-bold">Consolidated Risk</span>
          <div>
            <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono font-bold text-[10px] ${
              report.riskLevel === 'Critical' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
              report.riskLevel === 'High' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
              report.riskLevel === 'Medium' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
              'bg-[#16A34A]/10 text-[#16A34A]'
            }`}>
              {report.riskScore}/100 - {report.riskLevel}
            </span>
          </div>
        </div>
      </div>

      {/* ACCORDION 1: Permissions */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('permissions')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <Shield className={`h-5 w-5 ${dangerousPermissions.length > 0 ? 'text-[#DC2626]' : 'text-[#16A34A]'}`} />
            <div>
              <span className="text-sm font-extrabold text-slate-800">Declared Manifest Permissions</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3 flex-shrink-0">({report.permissions.length} total • {dangerousPermissions.length} dangerous)</span>
            </div>
          </div>
          {openAccordions.permissions ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.permissions && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50 space-y-4">
            {/* Dangerous list */}
            {dangerousPermissions.length > 0 && (
              <div className="space-y-2.5">
                <span className="text-[10px] font-mono uppercase tracking-widest text-[#DC2626] font-extrabold flex items-center space-x-1">
                  <ShieldAlert className="h-3.5 w-3.5" />
                  <span>HIGH-RISK EXPLOITABLE PERMISSIONS</span>
                </span>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
                  {dangerousPermissions.map((perm, idx) => (
                    <div key={idx} className="p-3.5 bg-[#DC2626]/5 border border-[#DC2626]/10 rounded-lg space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-xs font-extrabold text-[#DC2626] break-all">{perm.name}</span>
                        <span className="px-1.5 py-0.5 bg-[#DC2626]/10 text-[#DC2626] text-[8px] font-bold rounded font-mono uppercase">Dangerous</span>
                      </div>
                      <p className="text-xs text-slate-700 font-medium">{perm.description}</p>
                      <div className="bg-white/50 p-2 rounded border border-[#DC2626]/5 text-[11px] text-slate-500 font-mono">
                        <span className="font-extrabold text-[#DC2626] uppercase">Abuse Scenario:</span> {perm.abuseScenario}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Normal list */}
            {normalPermissions.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Standard / low-risk permissions</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                  {normalPermissions.map((perm, idx) => (
                    <div key={idx} className="p-3 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg">
                      <span className="font-mono text-[11px] font-bold text-slate-700 truncate block" title={perm.name}>{perm.name}</span>
                      <p className="text-[11px] text-slate-500 mt-1">{perm.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACCORDION 2: Manifest components (Activities, Services, Receivers) */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('manifest')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <FileCode className="h-5 w-5 text-[#2563EB]" />
            <div>
              <span className="text-sm font-extrabold text-slate-800">Android Manifest Components</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3">({report.manifest.activities.length} activities • {report.manifest.services.length} services • {report.manifest.receivers.length} receivers)</span>
            </div>
          </div>
          {openAccordions.manifest ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.manifest && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50 grid grid-cols-1 md:grid-cols-3 gap-5">
            {/* Activities */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block border-b border-[#E2E8F0] pb-1">Activities (UI Screens)</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {report.manifest.activities.map((act, i) => (
                  <div key={i} className="p-2 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded font-mono text-[11px] text-slate-700 flex items-center space-x-1.5 truncate">
                    <span className="h-1.5 w-1.5 bg-[#2563EB] rounded-full flex-shrink-0" />
                    <span className="truncate">{act}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Services */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block border-b border-[#E2E8F0] pb-1">Services (Background Tasks)</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {report.manifest.services.map((ser, i) => (
                  <div key={i} className="p-2 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded font-mono text-[11px] text-slate-700 flex items-center space-x-1.5 truncate">
                    <span className="h-1.5 w-1.5 bg-[#F59E0B] rounded-full flex-shrink-0" />
                    <span className="truncate">{ser}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Receivers */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 font-bold block border-b border-[#E2E8F0] pb-1">Broadcast Receivers (Event Listeners)</span>
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {report.manifest.receivers.length > 0 ? (
                  report.manifest.receivers.map((rec, i) => (
                    <div key={i} className="p-2 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded font-mono text-[11px] text-slate-700 flex items-center space-x-1.5 truncate">
                      <span className="h-1.5 w-1.5 bg-[#DC2626] rounded-full flex-shrink-0" />
                      <span className="truncate">{rec}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-[11px] text-slate-400 italic">No receivers declared</p>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACCORDION 3: Extracted URLs & Domains */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('urls')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <Globe className="h-5 w-5 text-[#2563EB]" />
            <div>
              <span className="text-sm font-extrabold text-slate-800">Hardcoded Network Domains & URL Targets</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3">({report.extractedUrls.length} links parsed)</span>
            </div>
          </div>
          {openAccordions.urls ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.urls && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50">
            <div className="grid grid-cols-1 gap-2.5">
              {report.extractedUrls.map((link, idx) => (
                <div key={idx} className="p-3 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center space-x-2.5 min-w-0">
                    <span className={`p-1 rounded ${
                      link.category === 'C2 Server' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                      link.category === 'Suspicious' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#16A34A]/10 text-[#16A34A]'
                    }`}>
                      <Globe className="h-3.5 w-3.5" />
                    </span>
                    <span className="font-mono text-xs text-slate-700 truncate block font-bold max-w-sm sm:max-w-md md:max-w-2xl">{link.url}</span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase font-mono ${
                      link.category === 'C2 Server' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                      link.category === 'Suspicious' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                      'bg-[#16A34A]/10 text-[#16A34A]'
                    }`}>
                      {link.category}
                    </span>
                    <span className="text-xs text-slate-400 font-mono font-bold">{link.reputation}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* ACCORDION 4: Suspicious APIs */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('apis')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <Cpu className="h-5 w-5 text-[#F59E0B]" />
            <div>
              <span className="text-sm font-extrabold text-slate-800">Critical JVM & Dalvik API Calls</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3">({report.suspiciousApis.length} threat signatures matched)</span>
            </div>
          </div>
          {openAccordions.apis ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.apis && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50 space-y-3">
            {report.suspiciousApis.length > 0 ? (
              report.suspiciousApis.map((api, idx) => (
                <div key={idx} className="p-3.5 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg flex items-start justify-between gap-3">
                  <div className="space-y-1">
                    <div className="font-mono text-xs font-bold text-slate-800 break-all">{api.api}</div>
                    <div className="text-xs text-slate-500 font-medium">{api.purpose}</div>
                  </div>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-bold font-mono uppercase flex-shrink-0 ${
                    api.severity === 'Critical' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                    api.severity === 'High' ? 'bg-[#DC2626]/5 text-[#DC2626]/80' :
                    api.severity === 'Medium' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                    'bg-[#2563EB]/10 text-[#2563EB]'
                  }`}>
                    {api.severity} severity
                  </span>
                </div>
              ))
            ) : (
              <p className="text-xs text-slate-400 italic">No suspicious API calls identified in bytecode decompilation.</p>
            )}
          </div>
        )}
      </div>

      {/* ACCORDION 5: Hardcoded Cryptographic Keys */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('keys')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <Key className="h-5 w-5 text-[#2563EB]" />
            <div>
              <span className="text-sm font-extrabold text-slate-800">Leaked Cryptographic Credentials & Private Keys</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3">({report.hardcodedKeys.length} leaks identified)</span>
            </div>
          </div>
          {openAccordions.keys ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.keys && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50">
            {report.hardcodedKeys.length > 0 ? (
              <div className="grid grid-cols-1 gap-3">
                {report.hardcodedKeys.map((k, idx) => (
                  <div key={idx} className="p-3.5 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-extrabold text-slate-700">{k.type}</span>
                      <span className="px-2 py-0.5 bg-[#DC2626]/10 text-[#DC2626] text-[9px] font-bold rounded font-mono uppercase">{k.risk}</span>
                    </div>
                    <div className="p-2.5 bg-white/40 backdrop-blur-md rounded border border-[#E2E8F0] font-mono text-xs text-slate-600 break-all select-all">
                      {k.key}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-5 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg text-center">
                <CheckCircle className="h-8 w-8 text-[#16A34A] mx-auto mb-2" />
                <p className="text-xs font-bold text-slate-600">No cryptographic secret leaks</p>
                <p className="text-[11px] text-slate-400 mt-0.5">Scanning did not discover any hardcoded API keys, certificates or RSA credentials inside manifest resources.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* ACCORDION 6: Certificates */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('certificates')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <Award className="h-5 w-5 text-[#16A34A]" />
            <div>
              <span className="text-sm font-extrabold text-slate-800">APK Signature & SSL Developer Certificates</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3">({report.certInfo.issuer.includes('Bypass') ? 'ALERT: REUSED SIGNATURE' : 'VERIFIED SCHEME'})</span>
            </div>
          </div>
          {openAccordions.certificates ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.certificates && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50">
            <div className="p-4 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg space-y-4">
              <div className="flex items-start justify-between flex-wrap gap-2 border-b border-white/30 pb-3">
                <div className="space-y-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Issuer Certificate Authority</span>
                  <div className={`text-xs font-mono font-bold ${report.certInfo.issuer.includes('Bypass') || report.certInfo.issuer.includes('Unknown') ? 'text-[#DC2626]' : 'text-slate-800'}`}>
                    {report.certInfo.issuer}
                  </div>
                </div>
                {report.certInfo.issuer.includes('Bypass') && (
                  <span className="px-2.5 py-1 bg-[#DC2626]/10 text-[#DC2626] text-[10px] font-bold rounded font-mono uppercase animate-pulse">Suspicious Issuer</span>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Serial Number</span>
                  <div className="font-bold text-slate-800 truncate">{report.certInfo.serialNumber}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Validity Span</span>
                  <div className="font-bold text-slate-800 text-[11px]">{report.certInfo.validFrom} to {report.certInfo.validTo}</div>
                </div>
                <div className="space-y-1">
                  <span className="text-[10px] uppercase text-slate-400 font-bold">Signing Algorithm</span>
                  <div className="font-bold text-[#16A34A]">{report.certInfo.signatureAlgorithm}</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ACCORDION 7: Obfuscation */}
      <div className="bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-xl shadow-glass overflow-hidden">
        <button
          onClick={() => toggleAccordion('obfuscation')}
          className="w-full p-4 flex items-center justify-between hover:bg-white/40 backdrop-blur-md transition-colors text-left font-bold"
        >
          <div className="flex items-center space-x-3">
            <Lock className="h-5 w-5 text-[#2563EB]" />
            <div>
              <span className="text-sm font-extrabold text-slate-800">Anti-Decompilation & Code Obfuscation Filters</span>
              <span className="text-xs text-slate-400 font-mono font-bold ml-3">(Obfuscated: {report.obfuscation.isObfuscated ? 'YES' : 'NO'})</span>
            </div>
          </div>
          {openAccordions.obfuscation ? <ChevronUp className="h-4 w-4 text-slate-400" /> : <ChevronDown className="h-4 w-4 text-slate-400" />}
        </button>

        {openAccordions.obfuscation && (
          <div className="p-5 border-t border-[#E2E8F0] bg-white/40 backdrop-blur-md/50">
            <div className="p-4 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <span className="text-xs font-extrabold uppercase text-slate-500">Security Guard Status</span>
                  <span className={`px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase ${
                    report.obfuscation.isObfuscated ? 'bg-[#16A34A]/10 text-[#16A34A]' : 'bg-[#DC2626]/10 text-[#DC2626]'
                  }`}>
                    {report.obfuscation.isObfuscated ? 'Shields Active' : 'Unobfuscated Code'}
                  </span>
                </div>

                <p className="text-xs text-slate-600 leading-relaxed">
                  {report.obfuscation.isObfuscated 
                    ? 'This application has been processed with heavy anti-decompilation filters. Standard class names, parameters, and debug outputs have been cryptographically mapped to disrupt static signatures.'
                    : 'The codebase is completely clear text and does not use any standard obfuscators. This usually indicates amateur construction or dropper packaging that relies entirely on lazy-loaded assets.'
                  }
                </p>
              </div>

              {report.obfuscation.isObfuscated && (
                <div className="space-y-2">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Identified Techniques</span>
                  <div className="flex flex-wrap gap-2">
                    {report.obfuscation.techniques.map((tech, idx) => (
                      <span key={idx} className="px-2.5 py-1.5 bg-white/60 backdrop-blur-lg border border-[#E2E8F0] rounded font-mono text-[10px] text-slate-700 font-bold">
                        {tech}
                      </span>
                    ))}
                  </div>
                  <div className="text-xs text-slate-500 font-mono mt-2">
                    <span className="font-extrabold text-[#F59E0B]">AI Note:</span> Reverse engineering difficulty level is estimated as <span className="font-bold text-[#F59E0B] uppercase">{report.obfuscation.riskFactor}</span>.
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
