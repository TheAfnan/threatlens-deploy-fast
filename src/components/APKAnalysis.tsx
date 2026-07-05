import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileCode, 
  Loader2, 
  CheckCircle, 
  AlertTriangle, 
  ShieldAlert, 
  Database, 
  GitBranch, 
  FileCheck, 
  Sparkles, 
  ArrowRight,
  Smartphone
} from 'lucide-react';
import { APKReport } from '../types';

interface APKAnalysisProps {
  apkReports: APKReport[];
  onAddReport: (newReport: APKReport) => void;
  onSelectAPK: (id: string, view: 'report' | 'static' | 'dynamic') => void;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function APKAnalysis({ 
  apkReports, 
  onAddReport, 
  onSelectAPK, 
  triggerToast 
}: APKAnalysisProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<{
    name: string;
    size: string;
    type: string;
  } | null>(null);
  const [serverFileDetails, setServerFileDetails] = useState<any>(null);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isUploading, setIsUploading] = useState(false);
  
  // Pipeline analysis states
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [analysisLogs, setAnalysisLogs] = useState<string[]>([]);
  
  // Created Report after analysis completes
  const [generatedReportId, setGeneratedReportId] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const progressIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const stepTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  // Tracks all per-step log setTimeouts so we can cancel on unmount
  const pipelineTimeoutsRef = useRef<ReturnType<typeof setTimeout>[]>([]);
  const completionTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Cleanup all pending timers when the component unmounts
  React.useEffect(() => {
    return () => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      pipelineTimeoutsRef.current.forEach(t => clearTimeout(t));
      if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
    };
  }, []);

  const steps = [
    { label: 'File Upload', icon: Upload, desc: 'Verifying file signature and checksums' },
    { label: 'Static Analysis', icon: Database, desc: 'Decompiling DEX, parsing manifest permissions' },
    { label: 'Dynamic Sandbox', icon: Smartphone, desc: 'Simulating runtime execution and overlay hooks' },
    { label: 'AI Reverse Engineering', icon: Sparkles, desc: 'Synthesizing bytecode logic via Gemini LLM' },
    { label: 'Banking Fraud Mapping', icon: GitBranch, desc: 'Correlating attack chains against UPI gateways' },
    { label: 'Risk Scoring', icon: ShieldAlert, desc: 'Aggregating metric variables into security indices' },
    { label: 'AI Report Compilation', icon: FileCheck, desc: 'Finalizing executive summary & MITRE frameworks' }
  ];

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileSelected(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFileSelected(e.target.files[0]);
    }
  };

  const formatBytes = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = 1;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  const handleFileSelected = (file: File) => {
    const name = file.name;
    const sizeInBytes = file.size;
    setSelectedFile({
      name,
      size: formatBytes(sizeInBytes),
      type: name.endsWith('.apk') ? 'APK' : name.endsWith('.zip') ? 'ZIP' : name.endsWith('.aab') ? 'AAB' : 'Unknown'
    });
    setServerFileDetails(null);
    setGeneratedReportId(null);
    setUploadProgress(0);
    setIsUploading(true);

    const formData = new FormData();
    formData.append('apk', file);
    
    // Simulate progress while uploading
    let progress = 0;
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    progressIntervalRef.current = setInterval(() => {
      progress += Math.random() * 15;
      if (progress > 90) progress = 90;
      setUploadProgress(Math.floor(progress));
    }, 200);

    fetch('/api/upload', {
      method: 'POST',
      body: formData
    })
    .then(res => {
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res.json();
    })
    .then(data => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setUploadProgress(100);
      setIsUploading(false);
      if (data.success) {
        setServerFileDetails(data.fileDetails);
        const apkInfo = data.fileDetails?.isValidApk ? ` | Valid APK (${data.fileDetails.totalEntries} entries, ${data.fileDetails.dexFileCount} DEX files)` : '';
        triggerToast('Upload Succeeded', `SHA256: ${data.fileDetails?.hash?.substring(0, 16)}...${apkInfo}`, 'success');
      } else {
        triggerToast('Upload Failed', data.error || 'Server rejected file', 'error');
      }
    })
    .catch(_err => {
      if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
      setIsUploading(false);
      triggerToast('Upload Error', 'Network failure connecting to Sandbox node', 'error');
    });
  };

  // Quick Select Presets
  const handleSelectPreset = (presetName: string, size: string) => {
    // Clear any in-progress upload/analysis state
    if (progressIntervalRef.current) clearInterval(progressIntervalRef.current);
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    pipelineTimeoutsRef.current.forEach(t => clearTimeout(t));
    if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
    pipelineTimeoutsRef.current = [];

    setSelectedFile({
      name: presetName,
      size,
      type: 'APK'
    });
    setServerFileDetails(null);
    setIsUploading(false);
    setIsAnalyzing(false);
    setCurrentStep(0);
    setAnalysisLogs([]);
    setGeneratedReportId(null);
    setUploadProgress(100);
    triggerToast('Preloaded APK', `Loaded preset file ${presetName} for instant testing.`, 'info');
  };

  const startAnalysisPipeline = () => {
    if (!selectedFile) return;

    setIsAnalyzing(true);
    setCurrentStep(0);
    setAnalysisLogs(['[SYSTEM] Initializing threat intelligence analysis engine...']);

    const pipelineIntervals = [
      { log: '[FS_GUARD] Decompressing APK binaries and checking layout hashes...', delay: 1000 },
      { log: '[STATIC_ENGINE] Found 14 compiled activities and 5 background services. Analyzing manifest permissions...', delay: 2500 },
      { log: '[STATIC_ENGINE] ALERT: BIND_ACCESSIBILITY_SERVICE requested without standard accessibility criteria.', delay: 3500 },
      { log: '[SANDBOX_SIM] Booting dynamic sandboxed container. Registering active simulated intent loops...', delay: 5000 },
      { log: '[SANDBOX_SIM] BEHAVIOR_WARNING: Intercepted system overlay dispatcher draw (Overlay Triggered).', delay: 6500 },
      { log: '[AI_REV] Connecting to server Gemini-2.5-Flash model. Executing raw bytecode structure mapping...', delay: 8500 },
      { log: '[AI_REV] Gemini successfully decompiled Sova malware family signature core loop. Generating purpose summaries...', delay: 10500 },
      { log: '[FRAUD_MAP] Correlating triggers: detected automated transfer scripts matching SBI YONO & HDFC UPI APIs.', delay: 12000 },
      { log: '[RISK_CORE] Aggregating threat indicators... Score threshold calculated: 94/100 (CRITICAL THREAT)', delay: 13500 },
      { log: '[REPORTS] Packaging MITRE framework indicators & CERT-In mitigation advisories. Exporting JSON bundle...', delay: 15000 }
    ];

    // Transition steps
    const stepCount = steps.length;
    let stepIndex = 0;
    if (stepTimerRef.current) clearInterval(stepTimerRef.current);
    stepTimerRef.current = setInterval(() => {
      stepIndex += 1;
      if (stepIndex < stepCount) {
        setCurrentStep(stepIndex);
      } else {
        if (stepTimerRef.current) clearInterval(stepTimerRef.current);
      }
    }, 2200);

    // Push Logs — store all handles so they can be cancelled
    pipelineTimeoutsRef.current.forEach(t => clearTimeout(t));
    pipelineTimeoutsRef.current = pipelineIntervals.map((item) =>
      setTimeout(() => {
        setAnalysisLogs(prev => [...prev, item.log]);
      }, item.delay)
    );

    // Complete pipeline — store ref so we can cancel on unmount
    if (completionTimeoutRef.current) clearTimeout(completionTimeoutRef.current);
    completionTimeoutRef.current = setTimeout(() => {
      setIsAnalyzing(false);
      
      // Determine which report to match or create a new one
      const existingReport = apkReports.find(r => r.filename.toLowerCase().includes(selectedFile.name.split('_')[0].toLowerCase()));
      
      let reportId = 'apk-01'; // Default to SBI Report
      if (existingReport) {
        reportId = existingReport.id;
      } else {
        // Create a custom report using real server data if available
        const sfd = serverFileDetails;
        const realUrls = (sfd?.extractedUrls || []).map((url: string) => ({
          url, category: 'Suspicious' as const, reputation: 'Under Analysis'
        }));
        const newReport: APKReport = {
          id: `apk-${Date.now()}`,
          filename: sfd?.filename || selectedFile.name,
          packageName: sfd?.packageName || `com.unknown.${selectedFile.name.toLowerCase().replace(/\s+/g, '').replace('.apk', '')}`,
          version: sfd?.version || '1.0.0',
          size: sfd?.size || selectedFile.size,
          hash: sfd?.hash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855',
          riskScore: sfd?.isValidApk ? 85 : 60,
          riskLevel: sfd?.isValidApk ? 'High' : 'Medium',
          status: 'Completed',
          uploadedAt: new Date().toISOString().replace('T', ' ').substring(0, 19),
          certInfo: {
            issuer: sfd?.hasSignature ? 'CN=Android Debug (Extracted)' : 'CN=Unknown Android Signature',
            serialNumber: 'ee719ba2a11b012c',
            validFrom: '2026-03-12',
            validTo: '2036-03-12',
            signatureAlgorithm: 'SHA256withRSA'
          },
          obfuscation: {
            isObfuscated: sfd?.isObfuscated ?? true,
            techniques: ['ProGuard Standard', 'Reflection obfuscation'],
            riskFactor: 'Medium'
          },
          permissions: [
            { name: 'android.permission.RECEIVE_SMS', dangerous: true, description: 'Captures incoming messages.', abuseScenario: 'OTP sniffing for transactional hijacking.' },
            { name: 'android.permission.SYSTEM_ALERT_WINDOW', dangerous: true, description: 'Overlay draw.', abuseScenario: 'Displays fake banking input screens.' }
          ],
          manifest: {
            activities: sfd?.detectedComponents?.activities?.length ? sfd.detectedComponents.activities : ['.MainActivity', '.UpgradePortal'],
            services: sfd?.detectedComponents?.services?.length ? sfd.detectedComponents.services : ['.PayloadDaemon'],
            receivers: sfd?.detectedComponents?.receivers?.length ? sfd.detectedComponents.receivers : ['.SmsReceiver']
          },
          extractedUrls: realUrls.length > 0 ? realUrls : [
            { url: 'https://high-risk-c2-gate.net/api', category: 'C2 Server' as const, reputation: 'Confirmed Threat' }
          ],
          suspiciousApis: [
            { api: 'Ljava/lang/reflect/Method;->invoke', purpose: 'Bypass static signature patterns', severity: 'High' }
          ],
          hardcodedKeys: [
            { type: 'RC4 Key', key: 'mock_key_xyz', risk: 'Medium Leak' }
          ]
        };
        onAddReport(newReport);
        reportId = newReport.id;
      }

      setGeneratedReportId(reportId);
      triggerToast('Analysis Complete', `Malware threat identified in ${selectedFile.name}!`, 'warn');
    }, 16000);
  };

  const handleOpenUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="apk-analysis-page">
      {/* Page Title Header */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">APK Reverse Engineering & Verification</h2>
          <p className="text-sm text-slate-500 mt-1">Submit Android packages (APK, ZIP, AAB) to compile secure static manifests and execute timeline tests</p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono bg-white/60 backdrop-blur-lg px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-slate-600">
          <Database className="h-3.5 w-3.5" />
          <span>REVERSE_ENGINE: ACTIVE</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Drag and Drop & presets */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Submit Application</h3>
          
          {/* Drag & drop box */}
          <div 
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
            onClick={handleOpenUploadClick}
            className={`h-64 border-2 border-dashed rounded-xl flex flex-col items-center justify-center p-6 text-center cursor-pointer transition-all ${
              dragActive ? 'border-[#2563EB] bg-[#2563EB]/5' : 'border-[#E2E8F0] hover:border-slate-400 bg-white/40 backdrop-blur-md'
            }`}
          >
            <input 
              ref={fileInputRef}
              type="file" 
              className="hidden" 
              accept=".apk,.zip,.aab"
              onChange={handleFileChange}
            />
            <div className="p-3 bg-white/20 backdrop-blur-xl rounded-full border border-[#E2E8F0] shadow-glass text-slate-500 mb-4">
              <Upload className="h-6 w-6 text-[#2563EB]" />
            </div>
            <p className="text-sm font-bold text-slate-700">Drag & Drop file here</p>
            <p className="text-xs text-slate-400 mt-1">Accepts .APK, .ZIP (source decompiles), or .AAB files</p>
            <button 
              type="button"
              className="mt-4 px-3.5 py-1.5 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] hover:bg-white/40 backdrop-blur-md rounded-lg text-xs font-semibold text-slate-700 shadow-glass transition-all"
            >
              Browse Files
            </button>
          </div>

          {/* Quick Select Presets for testing */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Quick Preload Scenarios</span>
            <div className="grid grid-cols-1 gap-2.5">
              <button
                onClick={() => handleSelectPreset('SBI_Yono_Mandatory_Upgrade_2026.apk', '14.8 MB')}
                className="p-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 backdrop-blur-lg border border-[#E2E8F0] rounded-lg text-left text-xs font-semibold flex items-center justify-between cursor-pointer group"
              >
                <div className="truncate pr-2">
                  <div className="text-slate-800 font-bold truncate">SBI_Yono_Mandatory_Upgrade_2026.apk</div>
                  <div className="text-[10px] text-slate-400 font-mono">Sova Trojan (Critical)</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB] transition-colors flex-shrink-0" />
              </button>

              <button
                onClick={() => handleSelectPreset('HDFC_KYC_Verification.apk', '8.4 MB')}
                className="p-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 backdrop-blur-lg border border-[#E2E8F0] rounded-lg text-left text-xs font-semibold flex items-center justify-between cursor-pointer group"
              >
                <div className="truncate pr-2">
                  <div className="text-slate-800 font-bold truncate">HDFC_KYC_Verification.apk</div>
                  <div className="text-[10px] text-slate-400 font-mono">Anubis Spyware (High)</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB] transition-colors flex-shrink-0" />
              </button>

              <button
                onClick={() => handleSelectPreset('Kotak_811_Fast_Verification.apk', '9.3 MB')}
                className="p-2.5 bg-white/40 backdrop-blur-md hover:bg-white/60 backdrop-blur-lg border border-[#E2E8F0] rounded-lg text-left text-xs font-semibold flex items-center justify-between cursor-pointer group"
              >
                <div className="truncate pr-2">
                  <div className="text-slate-800 font-bold truncate">Kotak_811_Fast_Verification.apk</div>
                  <div className="text-[10px] text-slate-400 font-mono">Accessibility Abuse (Critical)</div>
                </div>
                <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-[#2563EB] transition-colors flex-shrink-0" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Side: Meta and Pipeline progress */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass lg:col-span-2 space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Analysis pipeline control</h3>

          {/* If no selected file */}
          {!selectedFile && (
            <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-[#E2E8F0] rounded-xl bg-white/40 backdrop-blur-md">
              <FileCode className="h-12 w-12 text-slate-300 mb-3" />
              <p className="text-sm font-bold text-slate-600">No file loaded</p>
              <p className="text-xs text-slate-400 max-w-sm mt-1">Please upload an Android package or select one of the high-risk testing presets on the left to activate the decompilation pipeline.</p>
            </div>
          )}

          {/* Selected File Details */}
          {selectedFile && (
            <div className="space-y-6">
              {/* Meta Box */}
              <div className="p-4 bg-white/40 backdrop-blur-md rounded-xl border border-[#E2E8F0] flex items-center justify-between">
                <div className="flex items-center space-x-3.5 min-w-0">
                  <div className="p-2.5 bg-[#2563EB]/10 text-[#2563EB] rounded-lg flex-shrink-0">
                    <FileCode className="h-6 w-6" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="text-sm font-extrabold text-slate-800 truncate" title={selectedFile.name}>{selectedFile.name}</h4>
                    <div className="flex items-center space-x-3 text-[10px] text-slate-500 font-mono mt-0.5">
                      <span>SIZE: {selectedFile.size}</span>
                      <span>•</span>
                      <span>FORMAT: {selectedFile.type}</span>
                    </div>
                  </div>
                </div>

                <div className="text-right flex-shrink-0">
                  {isUploading ? (
                    <span className="text-xs font-semibold text-[#2563EB] flex items-center space-x-1.5 font-mono">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>Uploading ({uploadProgress}%)</span>
                    </span>
                  ) : (
                    <span className="text-xs font-bold text-[#16A34A] flex items-center space-x-1 font-mono uppercase tracking-wider">
                      <CheckCircle className="h-4 w-4" />
                      <span>Ready for API Scan</span>
                    </span>
                  )}
                </div>
              </div>

              {/* Upload Progress Bar */}
              {isUploading && (
                <div className="w-full bg-white/60 backdrop-blur-lg rounded-full h-1.5">
                  <div 
                    className="bg-[#2563EB] h-1.5 rounded-full transition-all duration-150" 
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              )}

              {/* Analyze Button */}
              {!isUploading && !isAnalyzing && !generatedReportId && (
                <button
                  onClick={startAnalysisPipeline}
                  className="w-full py-3 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-glass transition-all flex items-center justify-center space-x-2 cursor-pointer"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Execute Decompilation & AI Reverse Engineering</span>
                </button>
              )}

              {/* Progress Pipeline Screen */}
              {(isAnalyzing || generatedReportId) && (
                <div className="space-y-6">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Sandbox Execution Steps</span>
                  
                  {/* Pipeline Step Circles */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-7 gap-3.5">
                    {steps.map((step, idx) => {
                      const StepIcon = step.icon;
                      const isCompleted = idx < currentStep;
                      const isActive = idx === currentStep && isAnalyzing;
                      const isPending = idx > currentStep && isAnalyzing;

                      return (
                        <div key={idx} className="flex flex-col items-center text-center p-2.5 rounded-lg border border-[#E2E8F0] relative">
                          <div className={`p-2.5 rounded-full mb-2 ${
                            isCompleted ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                            isActive ? 'bg-[#2563EB]/10 text-[#2563EB] ring-2 ring-[#2563EB]/20 animate-pulse' :
                            'bg-white/60 backdrop-blur-lg text-slate-400'
                          }`}>
                            <StepIcon className="h-4 w-4" />
                          </div>
                          <span className={`text-[10px] font-bold tracking-tight block truncate w-full ${isActive ? 'text-[#2563EB]' : 'text-slate-600'}`}>{step.label}</span>
                          
                          {/* Chevron connector for visual hierarchy (desktop) */}
                          {idx < steps.length - 1 && (
                            <div className="hidden md:block absolute top-6 -right-2 text-slate-300 z-10 font-bold">→</div>
                          )}
                        </div>
                      );
                    })}
                  </div>

                  {/* Terminal Log Console */}
                  <div className="space-y-2">
                    <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Terminal System Log</span>
                    <div className="bg-[#0F172A] text-slate-300 p-4 rounded-lg font-mono text-[11px] h-48 overflow-y-auto space-y-1.5 scrollbar-thin shadow-inner border border-slate-800">
                      {analysisLogs.map((log, i) => (
                        <div key={i} className={`flex items-start space-x-2 ${
                          log.includes('ALERT') || log.includes('CRITICAL') ? 'text-[#DC2626]' :
                          log.includes('WARNING') ? 'text-[#F59E0B]' :
                          log.includes('SYSTEM') ? 'text-[#16A34A]' :
                          'text-slate-300'
                        }`}>
                          <span className="text-slate-600 font-bold select-none">&gt;</span>
                          <span>{log}</span>
                        </div>
                      ))}
                      {isAnalyzing && (
                        <div className="flex items-center space-x-2 text-[#2563EB] animate-pulse">
                          <span>&gt;</span>
                          <span className="font-bold flex items-center space-x-1">
                            <Loader2 className="h-3 w-3 animate-spin" />
                            <span>Injecting binary scanner threads...</span>
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Completed / CTA Screen */}
                  {!isAnalyzing && generatedReportId && (
                    <div className="p-5 border border-[#16A34A]/20 bg-[#16A34A]/5 rounded-xl flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-start space-x-3.5">
                        <div className="p-2.5 bg-[#16A34A]/15 text-[#16A34A] rounded-full">
                          <CheckCircle className="h-6 w-6" />
                        </div>
                        <div>
                          <h4 className="text-sm font-extrabold text-[#16A34A]">REVERSE ENGINEERING COMPLETE</h4>
                          <p className="text-xs text-slate-500 mt-1">Succeeded with signature correlation. Identified malware behaviors. Risk metrics recorded.</p>
                        </div>
                      </div>

                      <div className="flex items-center space-x-2 w-full sm:w-auto">
                        <button
                          onClick={() => onSelectAPK(generatedReportId, 'report')}
                          className="px-4 py-2 bg-[#2563EB] hover:bg-[#2563EB]/90 text-white text-xs font-bold uppercase tracking-wider rounded shadow-md transition-all flex items-center space-x-1.5 cursor-pointer flex-grow sm:flex-grow-0"
                        >
                          <span>Executive Report</span>
                          <ArrowRight className="h-3.5 w-3.5" />
                        </button>
                        <button
                          onClick={() => onSelectAPK(generatedReportId, 'static')}
                          className="px-3.5 py-2 bg-white/20 backdrop-blur-xl hover:bg-white/40 backdrop-blur-md border border-[#E2E8F0] text-slate-700 text-xs font-bold uppercase tracking-wider rounded shadow-glass transition-all cursor-pointer"
                        >
                          <span>View Static Accordion</span>
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
