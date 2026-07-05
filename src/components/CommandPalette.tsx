import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { Search, MonitorPlay, ShieldAlert, Cpu, FileJson, History } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export const CommandPalette = () => {
  const { isCommandPaletteOpen, setCommandPaletteOpen } = useAppStore();
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setCommandPaletteOpen(true);
      }
      if (e.key === 'Escape') {
        setCommandPaletteOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [setCommandPaletteOpen]);

  const runCommand = (path: string) => {
    navigate(path);
    setCommandPaletteOpen(false);
  };

  return (
    <AnimatePresence>
      {isCommandPaletteOpen && (
        <div className="fixed inset-0 z-[150] flex items-start justify-center pt-[15vh] px-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }} 
            className="absolute inset-0 bg-[#050b14]/80 backdrop-blur-sm"
            onClick={() => setCommandPaletteOpen(false)}
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: -20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -20 }}
            className="relative w-full max-w-2xl bg-[#0f172a]/95 backdrop-blur-3xl border border-white/20 rounded-2xl shadow-[0_0_80px_rgba(29,78,216,0.2)] overflow-hidden"
          >
            <div className="flex items-center px-4 py-4 border-b border-white/10">
              <Search className="w-5 h-5 text-slate-400 mr-3" />
              <input 
                autoFocus
                placeholder="Search commands or navigate..."
                className="w-full bg-transparent text-white placeholder:text-slate-500 focus:outline-none text-[15px]"
              />
              <div className="px-2 py-1 bg-white/10 rounded text-[10px] text-slate-400 tracking-widest font-mono">ESC</div>
            </div>
            
            <div className="max-h-[60vh] overflow-y-auto p-2">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 uppercase tracking-widest">Navigation</div>
              <CommandItem icon={<MonitorPlay />} title="Dashboard" shortcut="D" onClick={() => runCommand('/dashboard')} />
              <CommandItem icon={<Cpu />} title="Dynamic Sandbox" shortcut="S" onClick={() => runCommand('/sandbox')} />
              <CommandItem icon={<ShieldAlert />} title="Threat Intelligence" shortcut="T" onClick={() => runCommand('/threat-intel')} />
              <CommandItem icon={<FileJson />} title="Static Analysis" shortcut="A" onClick={() => runCommand('/static-analysis')} />
              <CommandItem icon={<History />} title="Analysis History" shortcut="H" onClick={() => runCommand('/history')} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

const CommandItem = ({ icon, title, shortcut, onClick }: any) => (
  <button 
    onClick={onClick}
    className="w-full flex items-center justify-between px-3 py-3 rounded-xl hover:bg-blue-600/20 hover:text-white text-slate-300 transition-colors group text-left"
  >
    <div className="flex items-center space-x-3">
      <div className="text-slate-400 group-hover:text-blue-400">{React.cloneElement(icon, { className: 'w-4 h-4' })}</div>
      <span className="text-sm font-medium">{title}</span>
    </div>
    {shortcut && <div className="px-2 py-1 bg-white/5 rounded text-[10px] text-slate-500 font-mono group-hover:bg-blue-500/20 group-hover:text-blue-300">{shortcut}</div>}
  </button>
);
