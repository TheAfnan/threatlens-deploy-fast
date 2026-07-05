import React, { useState, useEffect, useRef } from 'react';
import { 
  Play, 
  Square, 
  Smartphone, 
  Activity, 
  Terminal, 
  AlertTriangle, 
  CheckCircle,
  FileText,
  Globe,
  MessageSquare,
  Accessibility,
  Eye,
  RefreshCw,
  Clock
} from 'lucide-react';
import { APKReport, TimelineEvent } from '../types';
import { mockTimelineEvents } from '../mockData';
import { useAppStore } from '../lib/store';
import { PaywallOverlay } from './PaywallOverlay';

interface DynamicSandboxProps {
  apkReports: APKReport[];
  selectedAPKId: string | null;
  onSelectAPK: (id: string) => void;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function DynamicSandbox({ 
  apkReports, 
  selectedAPKId, 
  onSelectAPK,
  triggerToast,
  onUpgrade
}: DynamicSandboxProps & { onUpgrade?: () => void }) {
  const { isProUser } = useAppStore();
  
  const currentId = selectedAPKId || 'apk-01';
  const report = apkReports.find(r => r.id === currentId) || apkReports[0];

  const [isRunning, setIsRunning] = useState(false);
  const [visibleEvents, setVisibleEvents] = useState<TimelineEvent[]>([]);
  const [stats, setStats] = useState({
    fileWrites: 0,
    networkRequests: 0,
    accessibilityAbuses: 0,
    smsInterceptions: 0,
    overlaysSpawned: 0
  });

  const eventIndexRef = useRef(0);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // Stop running if selected APK changes
  useEffect(() => {
    stopSandbox();
    setVisibleEvents([]);
    setStats({
      fileWrites: 0,
      networkRequests: 0,
      accessibilityAbuses: 0,
      smsInterceptions: 0,
      overlaysSpawned: 0
    });
  }, [currentId]);

  // Cleanup timer on unmount to prevent memory leaks
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
      }
    };
  }, []);

  const startSandbox = () => {
    if (isRunning) return;

    setIsRunning(true);
    setVisibleEvents([]);
    eventIndexRef.current = 0;
    
    setStats({
      fileWrites: 0,
      networkRequests: 0,
      accessibilityAbuses: 0,
      smsInterceptions: 0,
      overlaysSpawned: 0
    });

    triggerToast('Sandbox Initialized', `Booting simulated environment for ${report.filename}`, 'info');

    // Customized timeline events mapping of Sova-like or Anubis-like malware behaviors
    const eventsToSimulate = [...mockTimelineEvents];

    const runSimulationStep = () => {
      if (eventIndexRef.current >= eventsToSimulate.length) {
        stopSandbox();
        triggerToast('Simulation Complete', 'Sandbox run has terminated successfully. No more events.', 'success');
        return;
      }

      const nextEvent = eventsToSimulate[eventIndexRef.current];
      setVisibleEvents(prev => [nextEvent, ...prev]);

      // Update counters
      setStats(prev => {
        const nextStats = { ...prev };
        if (nextEvent.type === 'File') nextStats.fileWrites += 1;
        if (nextEvent.type === 'Network') nextStats.networkRequests += 1;
        if (nextEvent.type === 'Accessibility') nextStats.accessibilityAbuses += 1;
        if (nextEvent.type === 'SMS') nextStats.smsInterceptions += 1;
        if (nextEvent.type === 'Overlay') nextStats.overlaysSpawned += 1;
        return nextStats;
      });

      // Show toast on critical dynamic alert
      if (nextEvent.severity === 'Critical') {
        triggerToast('CRITICAL RUNTIME EVENT', nextEvent.details, 'error');
      }

      eventIndexRef.current += 1;
      // Schedule next event with varying fast delays for dynamic UI experience
      const delay = Math.floor(Math.random() * 1200) + 800;
      timerRef.current = setTimeout(runSimulationStep, delay);
    };

    timerRef.current = setTimeout(runSimulationStep, 1000);
  };

  const stopSandbox = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current);
      timerRef.current = null;
    }
    setIsRunning(false);
  };

  const clearSandbox = () => {
    stopSandbox();
    setVisibleEvents([]);
    setStats({
      fileWrites: 0,
      networkRequests: 0,
      accessibilityAbuses: 0,
      smsInterceptions: 0,
      overlaysSpawned: 0
    });
    triggerToast('Sandbox Cleared', 'Flushed trace cache memory logs.', 'info');
  };

  return (
    <div className="relative">
      {!isProUser && (
        <PaywallOverlay 
          featureName="Dynamic Hardware Sandbox"
          description="Real-time execution of evasive 0-day payloads requires dedicated hardware virtualization nodes. Upgrade to Premium to instantly spin up isolated environments and trace memory hooks live."
          onUpgrade={() => onUpgrade?.()}
        />
      )}
      
      <div className={`space-y-6 ${!isProUser ? 'opacity-40 pointer-events-none select-none blur-sm' : ''} font-sans text-[#0F172A]`} id="dynamic-sandbox-page">
      {/* Top Selector Card */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Dynamic Sandbox Environment</h2>
          <p className="text-sm text-slate-500 mt-1">Run threat packages inside simulated device containers to record live execution vectors and trace accessibility APIs</p>
        </div>
        <div className="flex items-center space-x-3">
          <span className="text-xs font-bold text-slate-500 uppercase tracking-widest flex-shrink-0">Target Binary:</span>
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

      {/* Control Station & Live Device */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Side: Dynamic Control panel & Metrics */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-6">
          <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Sandbox Control Desk</h3>
          
          {/* Controls */}
          <div className="flex flex-col gap-3">
            {!isRunning ? (
              <button
                onClick={startSandbox}
                className="w-full py-3 bg-[#16A34A] hover:bg-[#16A34A]/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-glass transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Play className="h-4 w-4" />
                <span>Deploy & Execute Sandbox</span>
              </button>
            ) : (
              <button
                onClick={stopSandbox}
                className="w-full py-3 bg-[#DC2626] hover:bg-[#DC2626]/90 text-white text-xs font-bold uppercase tracking-widest rounded-lg shadow-glass transition-all flex items-center justify-center space-x-2 cursor-pointer"
              >
                <Square className="h-4 w-4" />
                <span>Halt Active Simulation</span>
              </button>
            )}

            <button
              onClick={clearSandbox}
              disabled={visibleEvents.length === 0}
              className="w-full py-2 bg-white/20 backdrop-blur-xl hover:bg-white/40 backdrop-blur-md disabled:bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs font-semibold text-slate-700 shadow-glass transition-all flex items-center justify-center space-x-1.5 cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className="h-3.5 w-3.5" />
              <span>Clear Terminal logs</span>
            </button>
          </div>

          {/* Sandbox Status Badge */}
          <div className="p-4 bg-white/40 backdrop-blur-md rounded-xl border border-[#E2E8F0] flex items-center justify-between">
            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-widest">Container State:</span>
            <span className={`inline-flex items-center space-x-1.5 font-mono text-xs font-bold uppercase ${
              isRunning ? 'text-[#16A34A] animate-pulse' : 'text-slate-500'
            }`}>
              <span className={`h-2 w-2 rounded-full ${isRunning ? 'bg-[#16A34A]' : 'bg-slate-400'}`} />
              <span>{isRunning ? 'SIMULATING_RUN' : 'TERMINATED_IDLE'}</span>
            </span>
          </div>

          {/* Metrics Grid */}
          <div className="space-y-3">
            <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 font-bold block">Telemetry Scrapers</span>
            
            <div className="grid grid-cols-2 gap-3.5">
              <div className="p-3 bg-white/40 backdrop-blur-md rounded-lg border border-[#E2E8F0] text-center">
                <FileText className="h-4 w-4 text-[#2563EB] mx-auto mb-1" />
                <div className="text-lg font-bold tracking-tight">{stats.fileWrites}</div>
                <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold">File Writes</div>
              </div>

              <div className="p-3 bg-white/40 backdrop-blur-md rounded-lg border border-[#E2E8F0] text-center">
                <Globe className="h-4 w-4 text-[#16A34A] mx-auto mb-1" />
                <div className="text-lg font-bold tracking-tight">{stats.networkRequests}</div>
                <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold">Network Req</div>
              </div>

              <div className="p-3 bg-white/40 backdrop-blur-md rounded-lg border border-[#E2E8F0] text-center">
                <Accessibility className="h-4 w-4 text-[#F59E0B] mx-auto mb-1" />
                <div className="text-lg font-bold tracking-tight">{stats.accessibilityAbuses}</div>
                <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold">Access Hook</div>
              </div>

              <div className="p-3 bg-white/40 backdrop-blur-md rounded-lg border border-[#E2E8F0] text-center">
                <MessageSquare className="h-4 w-4 text-[#DC2626] mx-auto mb-1" />
                <div className="text-lg font-bold tracking-tight">{stats.smsInterceptions}</div>
                <div className="text-[9px] uppercase font-mono tracking-wider text-slate-400 font-bold">SMS Sniffed</div>
              </div>
            </div>

            <div className="p-3 bg-white/40 backdrop-blur-md rounded-lg border border-[#E2E8F0] flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <Eye className="h-4 w-4 text-[#2563EB]" />
                <span className="font-bold text-slate-700">Fake Overlays Spawned</span>
              </div>
              <span className="font-mono font-bold bg-[#2563EB]/10 text-[#2563EB] px-2 py-0.5 rounded">{stats.overlaysSpawned}</span>
            </div>
          </div>
        </div>

        {/* Right Side: Execution trace timeline */}
        <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass lg:col-span-2 flex flex-col space-y-4">
          <div className="flex items-center justify-between border-b border-white/30 pb-3">
            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-wider text-slate-700">Trace Logs & Runtime Thread</h3>
              <span className="text-xs text-slate-400">Chronological list of background service hooks</span>
            </div>
            <div className="flex items-center space-x-1 font-mono text-[11px] text-[#2563EB] font-bold">
              <Activity className="h-3.5 w-3.5 animate-pulse" />
              <span>THREAD_FEED_LIVE</span>
            </div>
          </div>

          {/* Scrolling timeline trace */}
          <div className="flex-grow min-h-96 max-h-[500px] overflow-y-auto pr-1 space-y-3 scrollbar-thin">
            {visibleEvents.length === 0 ? (
              <div className="h-96 flex flex-col items-center justify-center text-center p-6 border border-dashed border-[#E2E8F0] rounded-xl bg-white/40 backdrop-blur-md">
                <Terminal className="h-12 w-12 text-slate-300 mb-3" />
                <p className="text-sm font-bold text-slate-600">Sandbox Ready for Deployment</p>
                <p className="text-xs text-slate-400 max-w-sm mt-1">Deploy the APK package to initialize active hardware-isolated monitors. The sandbox logs live telemetry callbacks including overlay hooks and OTP interceptions.</p>
              </div>
            ) : (
              visibleEvents.map((event) => {
                const getEventBadgeClass = () => {
                  switch (event.severity) {
                    case 'Critical': return 'bg-[#DC2626]/10 text-[#DC2626] border-[#DC2626]/10';
                    case 'Warning': return 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/10';
                    case 'Alert': return 'bg-[#2563EB]/10 text-[#2563EB] border-[#2563EB]/10';
                    default: return 'bg-white/60 backdrop-blur-lg text-slate-500 border-white/40';
                  }
                };

                const getIcon = () => {
                  if (event.type === 'SMS') return MessageSquare;
                  if (event.type === 'Network') return Globe;
                  if (event.type === 'Accessibility') return Accessibility;
                  if (event.type === 'Overlay') return Eye;
                  return Terminal;
                };

                const Icon = getIcon();

                return (
                  <div 
                    key={event.id}
                    className="p-3.5 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg shadow-glass hover:shadow transition-all flex items-start space-x-3.5 group"
                  >
                    {/* Timestamp column */}
                    <div className="flex items-center space-x-1 text-slate-400 font-mono text-[10px] font-bold mt-0.5 flex-shrink-0">
                      <Clock className="h-3 w-3" />
                      <span>{event.timestamp}</span>
                    </div>

                    {/* Left Icon badge */}
                    <div className={`p-2 rounded-full border flex-shrink-0 ${getEventBadgeClass()}`}>
                      <Icon className="h-3.5 w-3.5" />
                    </div>

                    {/* Action & Details */}
                    <div className="space-y-1 min-w-0 flex-grow">
                      <div className="flex items-center justify-between flex-wrap gap-1.5">
                        <span className="text-xs font-extrabold text-slate-800 uppercase tracking-tight">{event.action}</span>
                        <span className={`px-2 py-0.5 rounded text-[8px] font-bold font-mono uppercase ${getEventBadgeClass()}`}>
                          {event.type} • {event.severity}
                        </span>
                      </div>
                      <p className="text-xs text-slate-600 leading-relaxed break-words">{event.details}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
      </div>
    </div>
  );
}
