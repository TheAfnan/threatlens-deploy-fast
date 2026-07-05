import React from 'react';
import { Lock, Zap, ArrowRight } from 'lucide-react';

interface PremiumLockProps {
  featureName: string;
  description: string;
  onUpgrade?: () => void;
}

export default function PremiumLock({ featureName, description, onUpgrade }: PremiumLockProps) {
  return (
    <div className="w-full h-full flex items-center justify-center min-h-[600px] p-6">
      <div className="max-w-md w-full bg-white/20 backdrop-blur-2xl border border-white/40 shadow-glass rounded-[40px] p-10 text-center relative overflow-hidden group">
        
        {/* Animated Background Elements */}
        <div className="absolute -top-20 -right-20 w-40 h-40 bg-gradient-to-br from-[#0F357E]/20 to-[#38BDF8]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
        <div className="absolute -bottom-20 -left-20 w-40 h-40 bg-gradient-to-tr from-[#38BDF8]/20 to-[#0F357E]/20 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700 delay-100"></div>

        <div className="relative z-10 flex flex-col items-center">
          <div className="h-20 w-20 bg-gradient-to-br from-[#0a152d] to-[#1e3a8a] rounded-full shadow-lg flex items-center justify-center mb-6">
            <Lock className="h-8 w-8 text-sky-400" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-800 tracking-tight mb-2">
            Enterprise Only
          </h2>
          <h3 className="text-lg font-bold text-[#0F357E] mb-4">
            {featureName} Locked
          </h3>
          
          <p className="text-sm text-slate-600 mb-8 leading-relaxed font-medium">
            {description}
          </p>

          <button onClick={onUpgrade} className="w-full bg-[#0a152d] hover:bg-[#0f244a] text-white py-3.5 px-6 rounded-2xl font-bold shadow-lg transition-all flex items-center justify-center space-x-2 group/btn">
            <Zap className="h-4 w-4 text-sky-400" />
            <span>Upgrade to Premium</span>
            <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
          </button>
          
          <p className="mt-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest">
            Solving real-time security challenges
          </p>
        </div>
      </div>
    </div>
  );
}
