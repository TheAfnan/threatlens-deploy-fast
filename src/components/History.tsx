import React, { useState } from 'react';
import { 
  History as HistoryIcon, 
  Search, 
  Filter, 
  FileCheck, 
  FileCode, 
  Smartphone, 
  Trash2,
  ChevronLeft,
  ChevronRight,
  Database
} from 'lucide-react';
import { APKReport } from '../types';

interface HistoryProps {
  apkReports: APKReport[];
  onSelectAPK: (id: string, view: 'report' | 'static' | 'dynamic') => void;
  onDeleteReport: (id: string) => void;
  triggerToast: (title: string, message: string, type: 'info' | 'success' | 'warn' | 'error') => void;
}

export default function History({ 
  apkReports, 
  onSelectAPK, 
  onDeleteReport,
  triggerToast
}: HistoryProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [riskFilter, setRiskFilter] = useState<'ALL' | 'Critical' | 'High' | 'Medium' | 'Safe'>('ALL');
  
  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  // Search & filter
  const filteredReports = apkReports.filter(report => {
    const matchesSearch = report.filename.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          report.packageName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRisk = riskFilter === 'ALL' || report.riskLevel === riskFilter;
    return matchesSearch && matchesRisk;
  });

  const totalPages = Math.ceil(filteredReports.length / itemsPerPage) || 1;
  const paginatedReports = filteredReports.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleDeleteClick = (id: string, name: string) => {
    if (window.confirm(`Are you sure you want to purge the security record for ${name}?`)) {
      onDeleteReport(id);
      triggerToast('Record Purged', `Successfully deleted history log for ${name}`, 'success');
      // Adjust pagination if needed
      if (paginatedReports.length === 1 && currentPage > 1) {
        setCurrentPage(currentPage - 1);
      }
    }
  };

  return (
    <div className="space-y-6 font-sans text-[#0F172A]" id="assessment-history-page">
      {/* Title Header */}
      <div className="bg-white/20 backdrop-blur-xl p-5 rounded-xl border border-[#E2E8F0] shadow-glass flex items-center justify-between">
        <div>
          <h2 className="text-xl font-extrabold tracking-tight">Binary Audit Log</h2>
          <p className="text-sm text-slate-500 mt-1">Audit complete historical scans, integrity checksum records, and generated threat metrics</p>
        </div>
        <div className="flex items-center space-x-1 text-xs font-mono bg-white/60 backdrop-blur-lg px-3 py-1.5 rounded-lg border border-[#E2E8F0] text-slate-600 font-bold">
          <Database className="h-3.5 w-3.5" />
          <span>RECORDS: {apkReports.length} SCAFFOLDED</span>
        </div>
      </div>

      {/* FILTER CONTROL BAR */}
      <div className="p-4 bg-white/20 backdrop-blur-xl rounded-xl border border-[#E2E8F0] shadow-glass flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div className="flex items-center space-x-2">
          <HistoryIcon className="h-5 w-5 text-slate-400" />
          <span className="text-xs font-bold uppercase text-slate-600">Scan Repositories</span>
        </div>

        {/* Filter inputs */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative">
            <span className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-3.5 w-3.5 text-slate-400" />
            </span>
            <input 
              type="text"
              placeholder="Search reports..."
              value={searchTerm}
              onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
              className="pl-9 pr-3 py-1.5 bg-white/40 backdrop-blur-md border border-[#E2E8F0] rounded-lg text-xs placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-[#2563EB] w-52"
            />
          </div>

          <div className="flex items-center space-x-1.5 bg-white/40 backdrop-blur-md px-2 py-1.5 border border-[#E2E8F0] rounded-lg">
            <Filter className="h-3.5 w-3.5 text-slate-400" />
            <select
              value={riskFilter}
              onChange={(e) => { setRiskFilter(e.target.value as any); setCurrentPage(1); }}
              className="bg-transparent text-xs text-slate-700 outline-none pr-1.5 font-semibold"
            >
              <option value="ALL">All Risk Levels</option>
              <option value="Critical">Critical Threat</option>
              <option value="High">High Threat</option>
              <option value="Medium">Medium Threat</option>
              <option value="Safe">Safe / Clean</option>
            </select>
          </div>
        </div>
      </div>

      {/* MAIN DATA TABLE */}
      <div className="bg-white/20 backdrop-blur-xl rounded-xl border border-[#E2E8F0] shadow-glass overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-white/40 backdrop-blur-md border-b border-[#E2E8F0] text-slate-400 uppercase tracking-wider font-mono text-[10px]">
                <th className="p-4 font-bold">Target Filename</th>
                <th className="p-4 font-bold">Package ID</th>
                <th className="p-4 font-bold text-center">Security Score</th>
                <th className="p-4 font-bold text-center">Vulnerability Rating</th>
                <th className="p-4 font-bold text-center">Analyzed Date</th>
                <th className="p-4 font-bold text-center">Status</th>
                <th className="p-4 font-bold text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E2E8F0]">
              {paginatedReports.length > 0 ? (
                paginatedReports.map((report) => (
                  <tr key={report.id} className="hover:bg-white/40 backdrop-blur-md/50 transition-colors">
                    <td className="p-4">
                      <div className="font-extrabold text-slate-800 tracking-tight break-all max-w-[200px]" title={report.filename}>
                        {report.filename}
                      </div>
                      <div className="text-[10px] font-mono text-slate-400 mt-0.5">SIZE: {report.size}</div>
                    </td>
                    <td className="p-4 font-mono text-slate-600 break-all max-w-[200px]" title={report.packageName}>
                      {report.packageName}
                    </td>
                    <td className="p-4 text-center font-mono font-extrabold text-slate-800">
                      {report.riskScore}/100
                    </td>
                    <td className="p-4 text-center">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full font-mono font-bold text-[9px] ${
                        report.riskLevel === 'Critical' ? 'bg-[#DC2626]/10 text-[#DC2626]' :
                        report.riskLevel === 'High' ? 'bg-[#F59E0B]/10 text-[#F59E0B]' :
                        report.riskLevel === 'Medium' ? 'bg-[#2563EB]/10 text-[#2563EB]' :
                        'bg-[#16A34A]/10 text-[#16A34A]'
                      }`}>
                        {report.riskLevel}
                      </span>
                    </td>
                    <td className="p-4 text-center font-mono text-slate-500">
                      {report.uploadedAt.substring(0, 10)}
                    </td>
                    <td className="p-4 text-center">
                      <span className="inline-flex items-center space-x-1 text-[#16A34A] text-[10px] font-bold font-mono">
                        <span className="h-1.5 w-1.5 bg-[#16A34A] rounded-full" />
                        <span>Completed</span>
                      </span>
                    </td>
                    <td className="p-4 text-right">
                      <div className="flex items-center justify-end space-x-1.5">
                        <button
                          onClick={() => onSelectAPK(report.id, 'report')}
                          title="View Executive Report"
                          className="p-1.5 text-slate-500 hover:text-[#2563EB] hover:bg-white/60 backdrop-blur-lg rounded transition-colors cursor-pointer"
                        >
                          <FileCheck className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onSelectAPK(report.id, 'static')}
                          title="View Decompiled Manifest"
                          className="p-1.5 text-slate-500 hover:text-[#F59E0B] hover:bg-white/60 backdrop-blur-lg rounded transition-colors cursor-pointer"
                        >
                          <FileCode className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => onSelectAPK(report.id, 'dynamic')}
                          title="View Sandbox Trace"
                          className="p-1.5 text-slate-500 hover:text-[#16A34A] hover:bg-white/60 backdrop-blur-lg rounded transition-colors cursor-pointer"
                        >
                          <Smartphone className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(report.id, report.filename)}
                          title="Purge Record"
                          className="p-1.5 text-slate-400 hover:text-[#DC2626] hover:bg-white/60 backdrop-blur-lg rounded transition-colors cursor-pointer"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400 italic">
                    No historical logs found matching the specified filter keywords.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* PAGINATION PANEL */}
        {totalPages > 1 && (
          <div className="p-4 bg-white/40 backdrop-blur-md border-t border-[#E2E8F0] flex items-center justify-between text-xs">
            <span className="text-slate-500">
              Showing Page <span className="font-semibold text-slate-700">{currentPage}</span> of <span className="font-semibold text-slate-700">{totalPages}</span> ({filteredReports.length} records)
            </span>
            <div className="flex items-center space-x-1">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                className="p-1.5 border border-[#E2E8F0] rounded hover:bg-white/20 backdrop-blur-xl bg-white/40 backdrop-blur-md cursor-pointer disabled:opacity-40"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                className="p-1.5 border border-[#E2E8F0] rounded hover:bg-white/20 backdrop-blur-xl bg-white/40 backdrop-blur-md cursor-pointer disabled:opacity-40"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
