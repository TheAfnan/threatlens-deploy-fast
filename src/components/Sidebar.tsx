import React, { useEffect } from 'react';
import { 
  Home, 
  Clock, 
  Bug, 
  ShieldAlert, 
  FileCode, 
  RefreshCw, 
  Settings, 
  Info,
  ChevronLeft,
  ChevronRight,
  User
} from 'lucide-react';
import { Logo } from './Logo';

interface SidebarProps {
  currentView: string;
  onNavigate: (view: string) => void;
  onLogout?: () => void;
  userEmail?: string;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({ 
  currentView, 
  onNavigate,
  isOpen,
  onToggle
}: SidebarProps) {
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onToggle();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onToggle]);
  
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'analyze', label: 'Upload & Analyze', icon: Bug },
    { id: 'static-analysis', label: 'Static Analysis', icon: FileCode },
    { id: 'sandbox', label: 'Dynamic Sandbox', icon: RefreshCw },
    { id: 'threat-intel', label: 'Threat Intelligence', icon: ShieldAlert },
    { id: 'investigate', label: 'AI Investigation', icon: Info },
    { id: 'risk', label: 'Risk Reports', icon: ShieldAlert },
    { id: 'history', label: 'Recent History', icon: Clock },
    { id: 'settings', label: 'Settings', icon: Settings },
    { id: 'profile', label: 'My Profile', icon: User },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-[45] bg-[#050b14]/50 backdrop-blur-sm md:hidden"
          onClick={onToggle}
        />
      )}

      <aside 
        className={`
          fixed md:sticky top-0 left-0 h-screen z-[50] flex flex-col flex-shrink-0 transition-all duration-500 ease-in-out shadow-glass bg-white/70 backdrop-blur-3xl border-r border-white/50 text-slate-700 font-sans
          ${isOpen ? 'w-64 translate-x-0' : 'w-64 -translate-x-full md:w-20 md:translate-x-0'}
        `} 
        id="enterprise-sidebar"
      >
        {/* Side Handle - Desktop Only */}
        <button 
          onClick={onToggle}
          className="hidden md:flex absolute -right-3 top-8 h-6 w-6 bg-white/40 backdrop-blur-xl border border-white/50 rounded-full items-center justify-center text-slate-500 hover:text-[#0F357E] hover:scale-110 shadow-sm z-50 transition-all cursor-pointer"
        >
          {isOpen ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
        </button>

      <div className="flex flex-col flex-grow overflow-y-auto overflow-x-hidden">
        {/* Brand Logo Header */}
        <div className={`p-6 flex items-center ${isOpen ? 'space-x-3' : 'justify-center px-0'} mb-2 transition-all duration-500`}>
          <div className="flex items-center group cursor-pointer hover-lift">
            <Logo className="h-10 w-10 flex-shrink-0 drop-shadow-md group-hover:scale-105 transition-transform" />
            {isOpen && <h1 className="text-2xl font-black tracking-tight text-gradient ml-3 whitespace-nowrap drop-shadow-sm">ThreatLens</h1>}
          </div>
        </div>

        {/* Menu Navigation */}
        <nav className="space-y-0 flex-grow">
          {menuItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = currentView === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                title={!isOpen ? item.label : undefined}
                className={`w-full flex items-center ${isOpen ? 'px-6' : 'justify-center px-0'} py-3.5 text-[14px] font-medium transition-all duration-300 ease-out cursor-pointer relative group ${
                  isActive 
                    ? 'bg-white/60 text-[#0F357E] font-bold shadow-sm backdrop-blur-sm' 
                    : 'text-slate-600 hover:bg-white/40 hover:text-slate-900'
                }`}
              >
                {isActive && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-4/5 w-1.5 rounded-r-md bg-gradient-to-b from-[#0F357E] to-[#38BDF8] shadow-[0_0_8px_rgba(56,189,248,0.5)] transition-all duration-300" />
                )}
                <IconComponent className={`h-[20px] w-[20px] flex-shrink-0 transition-transform duration-300 group-hover:scale-110 ${isActive ? 'text-[#0F357E] scale-110' : 'text-slate-500'}`} />
                {isOpen && <span className="ml-4 truncate whitespace-nowrap group-hover:translate-x-1 transition-transform duration-300">{item.label}</span>}
              </button>
            );
          })}
        </nav>
      </div>
    </aside>
    </>
  );
}
