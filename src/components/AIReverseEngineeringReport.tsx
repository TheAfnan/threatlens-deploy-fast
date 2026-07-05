import React, { useState, useEffect } from 'react';
import { Bot, ChevronDown, ChevronUp, Copy, Download, ShieldAlert, Activity, Crosshair, Fingerprint, FileText, FileWarning } from 'lucide-react';
import { APKReport, AIReverseEngineeringReport as AIReportType } from '../types';

interface AIReverseEngineeringReportProps {
  apkReport: APKReport;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

const LOADING_MESSAGES = [
  "Analyzing AndroidManifest...",
  "Reverse Engineering Classes...",
  "Evaluating Banking Risks...",
  "Correlating Threat Intelligence...",
  "Generating AI Investigation Report..."
];

export default function AIReverseEngineeringReport({ apkReport, triggerToast }: AIReverseEngineeringReportProps) {
  const [report, setReport] = useState<AIReportType | null>(null);
  const [loading, setLoading] = useState(false);
  const [loadingMsgIndex, setLoadingMsgIndex] = useState(0);
  const loadingIntervalRef = React.useRef<ReturnType<typeof setInterval> | null>(null);
  const copiedTimeoutRef = React.useRef<ReturnType<typeof setTimeout> | null>(null);

  // Clear timers on unmount
  React.useEffect(() => {
    return () => {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      if (copiedTimeoutRef.current) clearTimeout(copiedTimeoutRef.current);
    };
  }, []);
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    summary: true,
    behaviour: true,
    threats: true,
    justification: true,
    ioc: false,
    mitre: false,
    recommendations: true
  });
  
  const [typewriterText, setTypewriterText] = useState("");

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
  };

  const generateReport = async () => {
    setLoading(true);
    setLoadingMsgIndex(0);
    setTypewriterText("");
    
    // Simulate loading messages progression
    if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
    loadingIntervalRef.current = setInterval(() => {
      setLoadingMsgIndex(prev => {
        if (prev < LOADING_MESSAGES.length - 1) return prev + 1;
        return prev;
      });
    }, 1500);

    try {
      const response = await fetch('/api/generate-ai-report', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ apkDetails: apkReport }),
      });
      
      const data = await response.json();
      if (!response.ok) throw new Error(`HTTP ${response.status}: ${data?.error || response.statusText}`);
      if (data.success && data.report) {
        setReport(data.report);
        triggerToast('AI Report Generated', 'Reverse engineering analysis complete.', 'success');
      } else {
        triggerToast('Generation Failed', 'Failed to generate AI report.', 'error');
      }
    } catch (error) {
      console.error(error);
      triggerToast('Network Error', 'Could not reach the AI service.', 'error');
    } finally {
      if (loadingIntervalRef.current) clearInterval(loadingIntervalRef.current);
      setLoading(false);
    }
  };

  // Typewriter effect for loading messages
  useEffect(() => {
    if (loading) {
      const currentMsg = LOADING_MESSAGES[loadingMsgIndex];
      let i = 0;
      setTypewriterText("");
      const typingInterval = setInterval(() => {
        if (i < currentMsg.length) {
          setTypewriterText(currentMsg.substring(0, i + 1));
          i++;
        } else {
          clearInterval(typingInterval);
        }
      }, 50);
      return () => clearInterval(typingInterval);
    }
  }, [loading, loadingMsgIndex]);

  const handleCopy = () => {
    if (report) {
      navigator.clipboard.writeText(JSON.stringify(report, null, 2));
      triggerToast('Copied', 'AI Report copied to clipboard.', 'info');
    }
  };

  const handleExportPDF = () => {
    window.print();
    triggerToast('Print Initiated', 'Dispensing AI report document...', 'info');
  };

  const renderBadge = (level: string) => {
    let colorClass = "bg-slate-100 text-slate-600 border-slate-200";
    if (level === 'Critical' || level === 'High') colorClass = "bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/20";
    if (level === 'Medium') colorClass = "bg-orange-500/10 text-orange-600 border-orange-500/20";
    if (level === 'Low') colorClass = "bg-blue-500/10 text-blue-600 border-blue-500/20";
    
    return (
      <span className={`px-2 py-0.5 rounded text-[10px] font-mono font-bold uppercase border ${colorClass}`}>
        {level}
      </span>
    );
  };

  return (
    <div className="mt-8 space-y-6 font-sans text-[#0F172A]">
      <div className="bg-white/20 backdrop-blur-xl border border-[#D1D5DB] shadow-xl p-8 max-w-4xl mx-auto space-y-6 relative print:border-none print:shadow-none print:p-0">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b-2 border-[#1E3A8A] pb-4">
          <div className="flex items-center space-x-3">
            <div className="p-2.5 bg-[#1E3A8A] text-white rounded flex items-center justify-center">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h2 className="text-xl font-black tracking-tight uppercase text-[#1E3A8A] flex items-center gap-2">
                🤖 AI Reverse Engineering Report
              </h2>
              <span className="text-[9px] font-mono font-bold text-slate-500 block tracking-widest">
                GEMINI GENERATIVE ANALYSIS MODULE
              </span>
            </div>
          </div>
          <div className="flex space-x-2 print:hidden">
            <button 
              onClick={handleCopy} 
              disabled={!report || loading}
              className="p-2 bg-white/40 hover:bg-white/60 rounded text-slate-700 transition-colors disabled:opacity-50"
              title="Copy JSON"
            >
              <Copy className="h-4 w-4" />
            </button>
            <button 
              onClick={handleExportPDF} 
              disabled={!report || loading}
              className="p-2 bg-white/40 hover:bg-white/60 rounded text-slate-700 transition-colors disabled:opacity-50"
              title="Export PDF"
            >
              <Download className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Not Generated Yet / Loading State */}
        {!report && !loading && (
          <div className="text-center py-12 space-y-4 print:hidden">
            <Bot className="h-12 w-12 text-slate-400 mx-auto opacity-50" />
            <p className="text-sm text-slate-500 font-mono">Run dynamic AI analysis on this evidence?</p>
            <button 
              onClick={generateReport}
              className="px-6 py-2.5 bg-[#1E3A8A] hover:bg-[#1E3A8A]/90 text-white text-xs font-bold uppercase tracking-wider rounded-lg shadow-lg transition-all"
            >
              Start AI Investigation
            </button>
          </div>
        )}

        {loading && (
          <div className="py-16 flex flex-col items-center justify-center space-y-6 print:hidden">
            <div className="relative h-16 w-16">
              <div className="absolute inset-0 border-4 border-[#1E3A8A]/20 rounded-full"></div>
              <div className="absolute inset-0 border-4 border-[#1E3A8A] rounded-full border-t-transparent animate-spin"></div>
              <Bot className="absolute inset-0 m-auto h-6 w-6 text-[#1E3A8A] animate-pulse" />
            </div>
            <div className="text-sm font-mono font-bold text-[#1E3A8A] h-6 flex items-center">
              {typewriterText}<span className="animate-ping ml-1">_</span>
            </div>
          </div>
        )}

        {/* Report Content */}
        {report && !loading && (
          <div className="space-y-6">
            
            {/* 1. Executive Summary */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('summary')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <FileText className="h-4 w-4" />
                  <span>1. Executive Summary</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.summary ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.summary && (
                <div className="text-sm text-slate-700 leading-relaxed bg-white/40 p-4 rounded border border-white/40 print:border-none print:p-0">
                  {report.executiveSummary}
                </div>
              )}
            </div>

            {/* 2. Malware Behaviour Analysis */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('behaviour')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <Activity className="h-4 w-4" />
                  <span>2. Malware Behaviour Analysis</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.behaviour ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.behaviour && (
                <div className="grid gap-3">
                  {report.malwareBehaviour?.map((b, i) => (
                    <div key={i} className="bg-white/40 p-3 rounded border border-white/40">
                      <div className="font-mono text-xs font-bold text-slate-800 mb-1">{b.item}</div>
                      <div className="text-[13px] text-slate-600">{b.explanation}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 3. Banking Threat Assessment */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('threats')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <ShieldAlert className="h-4 w-4" />
                  <span>3. Banking Threat Assessment</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.threats ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.threats && (
                <div className="overflow-x-auto border border-white/50 rounded">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-white/60 font-mono text-[10px] uppercase text-slate-500 border-b border-white/50">
                        <th className="p-2.5 font-bold">Identified Threat</th>
                        <th className="p-2.5 font-bold">Likelihood</th>
                        <th className="p-2.5 font-bold">Confidence</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-white/50 bg-white/30">
                      {report.bankingThreatAssessment?.map((t, i) => (
                        <tr key={i}>
                          <td className="p-2.5 font-bold text-slate-700">{t.threat}</td>
                          <td className="p-2.5">{renderBadge(t.likelihood)}</td>
                          <td className="p-2.5 font-mono text-slate-600">{t.confidence}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>

            {/* 4. Risk Justification */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('justification')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <FileWarning className="h-4 w-4" />
                  <span>4. Risk Justification</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.justification ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.justification && (
                <div className="flex gap-4 p-4 bg-white/40 rounded border border-white/40 items-start">
                  <div className="flex-shrink-0 flex flex-col items-center justify-center p-3 border-2 border-[#DC2626]/20 bg-[#DC2626]/5 rounded-xl">
                    <span className="text-[10px] font-mono text-slate-500 font-bold uppercase mb-1">Score</span>
                    <span className="text-2xl font-black text-[#DC2626] leading-none">{report.riskJustification.score}</span>
                  </div>
                  <ul className="list-disc pl-5 text-[13px] text-slate-700 space-y-1.5 flex-1">
                    {report.riskJustification?.reasons?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 5. Indicators of Compromise */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('ioc')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <Fingerprint className="h-4 w-4" />
                  <span>5. Indicators of Compromise (IoCs)</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.ioc ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.ioc && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {report.indicatorsOfCompromise?.map((ioc, i) => (
                    <div key={i} className="flex justify-between items-center p-2 bg-white/40 rounded border border-white/40">
                      <span className="text-[10px] font-mono font-bold text-slate-500 uppercase">{ioc.type}</span>
                      <span className="text-[11px] font-mono font-bold text-[#DC2626] break-all text-right max-w-[70%]">{ioc.value}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 6. MITRE ATT&CK Mapping */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('mitre')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <Crosshair className="h-4 w-4" />
                  <span>6. MITRE ATT&CK Mapping</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.mitre ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.mitre && (
                <div className="space-y-2">
                  {report.mitreAttackMapping?.map((m, i) => (
                    <div key={i} className="p-3 bg-white/40 rounded border border-white/40">
                      <div className="text-xs font-bold text-slate-800 font-mono mb-1">{m.technique}</div>
                      <div className="text-[13px] text-slate-600">{m.description}</div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* 7. Analyst Recommendations */}
            <div className="space-y-2">
              <button onClick={() => toggleSection('recommendations')} className="w-full flex items-center justify-between text-left group">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A] border-b border-slate-300 pb-1 flex-1 flex items-center space-x-1.5">
                  <Activity className="h-4 w-4" />
                  <span>7. Analyst Recommendations</span>
                </h3>
                <div className="ml-2 text-slate-400 group-hover:text-[#1E3A8A] print:hidden">
                  {expandedSections.recommendations ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </div>
              </button>
              {expandedSections.recommendations && (
                <div className="bg-white/40 p-4 rounded border border-white/40">
                  <ul className="list-disc pl-5 text-[13px] text-slate-700 space-y-2">
                    {report.analystRecommendations?.map((r, i) => (
                      <li key={i}>{r}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            {/* 8 & 9. Conclusion & Confidence */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 border-t border-slate-300">
              <div className="md:col-span-2 space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A]">8. Executive Conclusion</h3>
                <p className="text-[13px] text-slate-700 leading-relaxed italic border-l-2 border-[#1E3A8A] pl-3">
                  "{report.executiveConclusion}"
                </p>
              </div>
              <div className="space-y-2">
                <h3 className="text-xs font-black uppercase tracking-wider text-[#1E3A8A]">9. AI Confidence</h3>
                <div className="bg-white/40 p-3 rounded border border-white/40 text-center space-y-1">
                  <div className="text-2xl font-black text-[#1E3A8A]">{report.aiConfidence.score}%</div>
                  <div className="text-[10px] text-slate-500 font-mono uppercase tracking-tight leading-tight">
                    {report.aiConfidence.explanation}
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}
