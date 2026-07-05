import React, { useState } from 'react';
import { 
  Network, 
  ShieldAlert, 
  Filter, 
  Search, 
  Globe, 
  CheckCircle, 
  AlertTriangle, 
  Tag, 
  ExternalLink,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { mockThreatIndicators } from '../mockData';
import PremiumLock from './PremiumLock';

export default function ThreatIntel({ onUpgrade }: { onUpgrade?: () => void }) {
  const [activeFeed, setActiveFeed] = useState<'vt' | 'cert' | 'mitre' | 'yara' | 'cve'>('vt');
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState<'ALL' | 'IP' | 'Domain' | 'Hash' | 'Certificate'>('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  // All hooks must be declared before any conditional return (Rules of Hooks).
  // PremiumLock gate sits here, after hooks.
  if (true) {
    return <PremiumLock onUpgrade={onUpgrade} featureName="Global Threat Intel Feeds" description="Streaming live IOCs (Indicators of Compromise) and real-time malicious signatures from global honeypots is restricted to Enterprise networks. Upgrade to connect to the live grid and solve zero-day threats instantly." />;
  }

  // Filtered Indicators
  const filteredIndicators = mockThreatIndicators.filter(ind => {
    const matchesSearch = ind.value.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          ind.threatActor.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          ind.associatedMalware.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = typeFilter === 'ALL' || ind.type === typeFilter;
    const matchesFeed = activeFeed === 'vt' ? ind.source === 'VirusTotal' :
                        activeFeed === 'cert' ? ind.source === 'CERT-In' :
                        activeFeed === 'mitre' ? ind.source === 'MITRE ATT&CK' :
                        activeFeed === 'yara' ? ind.source === 'YARA Rule Team' : true;
    
    return matchesSearch && matchesType && matchesFeed;
  });

  const totalPages = Math.ceil(filteredIndicators.length / itemsPerPage) || 1;
  const paginatedIndicators = filteredIndicators.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const feeds = [
    { id: 'vt', name: 'VirusTotal API', logo: 'VT', desc: 'Global signature file scans and active DNS IP reputational records.' },
    { id: 'cert', name: 'CERT-In Feed', logo: 'CERT', desc: 'Indian Computer Emergency Response Team localized Trojan and phishing IoCs.' },
    { id: 'mitre', name: 'MITRE ATT&CK Matrix', logo: 'MITRE', desc: 'Android mobile technique mapping, threat actor profiling, and mitigations.' },
    { id: 'yara', name: 'YARA Signatures', logo: 'YARA', desc: 'Bytecode pattern-matching rules tracking Sova and Xenomorph binaries.' },
    { id: 'cve', name: 'CVE Vulnerability DB', logo: 'CVE', desc: 'National vulnerability entries tracking zero-day Android security exploits.' }
  ];

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="threat-intel-intelligence">
      {/* Title Header */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">External Threat Intelligence Feeds</h2>
          <p className="text-sm text-slate-500 mt-1">Cross-reference local APK artifacts with global cybersecurity databases, CERT-In logs, and MITRE behavioral indexes</p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono bg-[#16A34A]/10 px-3 py-1.5 rounded-lg border border-[#16A34A]/10 text-[#16A34A] font-bold">
          <Database className="h-3.5 w-3.5" />
          <span>FEEDS: SYNCHRONIZED</span>
        </div>
      </div>

      {/* FEED INTEGRATIONS TABS */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3" id="intel-feeds-tabs">
        {feeds.map((feed) => {
          const isActive = feed.id === activeFeed;
          return (
            <button
              key={feed.id}
              onClick={() => {
                setActiveFeed(feed.id as any);
                setCurrentPage(1);
              }}
              className={`p-4 rounded-xl border text-left transition-all cursor-pointer ${
                isActive 
                  ? 'border-[#2563EB] bg-[#2563EB]/5 shadow-glass' 
                  : 'border-[#E2E8F0] hover:border-slate-300 bg-white/20 backdrop-blur-xl'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-[10px] font-mono font-bold uppercase px-1.5 py-0.5 rounded ${
                  isActive ? 'bg-[#2563EB] text-white' : 'bg-white/60 backdrop-blur-lg text-slate-500'
                }`}>{feed.logo}</span>
                <ExternalLink className="h-3 w-3 text-slate-300" />
              </div>
              <h4 className="text-xs font-extrabold text-slate-800 mt-3">{feed.name}</h4>
              <p className="text-[10px] text-slate-400 mt-1 leading-snug line-clamp-2">{feed.desc}</p>
            </button>
          );
        })}
      </div>

      {/* CENTRAL INTEL DASHBOARD */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass space-y-5">
        {/* Active Feed Stats Card */}
        <div className="p-4 bg-white/40 backdrop-blur-md rounded-xl border border-[#E2E8F0] flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1">
            <h3 className="text-sm font-extrabold text-slate-800">
              {feeds.find(f => f.id === activeFeed)?.name} Integration
            </h3>
            <p className="text-xs text-slate-500">
              Showing active IoCs (Indicators of Compromise) synchronized from this provider.
            </p>
          </div>

          {/* Filters Bar */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="relative">
              <span className="absolute inset-y-0 left-0 flex items-center pl-2.5 pointer-events-none">
                <Search className="h-3.5 w-3.5 text-slate-400" />
              </span>
              <input 
                type="text"
                placeholder="Search indicators..."
                value={searchTerm}
                onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
                className="pl-8 pr-3 py-1.5 bg-white/20 backdrop-blur-xl border border-[#E2E8F0] rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB] w-48"
              />
            </div>

            <div className="flex items-center space-x-1.5 bg-white/20 backdrop-blur-xl px-2 py-1 border border-[#E2E8F0] rounded-lg">
              <Filter className="h-3 w-3 text-slate-400" />
              <select
                value={typeFilter}
                onChange={(e) => { setTypeFilter(e.target.value as any); setCurrentPage(1); }}
                className="bg-transparent text-xs text-slate-700 outline-none pr-1.5 font-semibold"
              >
                <option value="ALL">All Types</option>
                <option value="IP">IP Addresses</option>
                <option value="Domain">Domains</option>
                <option value="Hash">Hashes</option>
                <option value="Certificate">Certificates</option>
              </select>
            </div>
          </div>
        </div>

        {/* INDICATORS TABLE */}
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-[#E2E8F0] text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                  <th className="py-2.5 font-bold">Indicator / Value</th>
                  <th className="py-2.5 font-bold">Type</th>
                  <th className="py-2.5 font-bold">Threat Actor / Campaign</th>
                  <th className="py-2.5 font-bold text-center">Confidence</th>
                  <th className="py-2.5 font-bold text-center">Status</th>
                  <th className="py-2.5 font-bold text-right">Verification</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#E2E8F0]">
                {paginatedIndicators.length > 0 ? (
                  paginatedIndicators.map((ind) => (
                    <tr key={ind.id} className="hover:bg-white/40 backdrop-blur-md transition-colors font-sans text-slate-700">
                      <td className="py-3 font-mono font-semibold text-[#0F172A] break-all max-w-[280px]" title={ind.value}>
                        {ind.value}
                      </td>
                      <td className="py-3">
                        <span className="px-1.5 py-0.5 bg-white/60 backdrop-blur-lg text-slate-600 rounded text-[9px] font-bold font-mono">
                          {ind.type}
                        </span>
                      </td>
                      <td className="py-3">
                        <div className="font-bold text-slate-800">{ind.associatedMalware}</div>
                        <div className="text-[10px] text-slate-400 font-mono">Actor: {ind.threatActor}</div>
                      </td>
                      <td className="py-3 text-center">
                        <div className="font-bold font-mono text-[#2563EB]">{ind.confidence}%</div>
                        <div className="w-16 bg-white/60 backdrop-blur-lg h-1 rounded-full mx-auto overflow-hidden mt-1">
                          <div className="bg-[#2563EB] h-1" style={{ width: `${ind.confidence}%` }} />
                        </div>
                      </td>
                      <td className="py-3 text-center">
                        <span className={`inline-flex items-center space-x-1 font-mono text-[9px] font-bold px-2 py-0.5 rounded-full ${
                          ind.status === 'Active' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                          ind.status === 'Mitigated' ? 'bg-[#16A34A]/10 text-[#16A34A]' :
                          'bg-[#F59E0B]/10 text-[#F59E0B]'
                        }`}>
                          {ind.status}
                        </span>
                      </td>
                      <td className="py-3 text-right font-mono text-[10px] font-bold text-slate-400">
                        {ind.source} SECURE
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-400 italic">
                      No matching Indicators found in this synchronised segment. Try updating your filters.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* PAGINATION PANEL */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between border-t border-white/30 pt-3 text-xs">
              <span className="text-slate-500">
                Showing Page <span className="font-semibold text-slate-700">{currentPage}</span> of <span className="font-semibold text-slate-700">{totalPages}</span> ({filteredIndicators.length} IoCs matched)
              </span>
              <div className="flex items-center space-x-1">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                  className="p-1 border border-[#E2E8F0] rounded hover:bg-white/40 backdrop-blur-md cursor-pointer disabled:opacity-40"
                >
                  <ChevronLeft className="h-4 w-4" />
                </button>
                <button
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                  className="p-1 border border-[#E2E8F0] rounded hover:bg-white/40 backdrop-blur-md cursor-pointer disabled:opacity-40"
                >
                  <ChevronRight className="h-4 w-4" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
