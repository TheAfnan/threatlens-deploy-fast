import React from 'react';
import { ShieldAlert, Lock, Sparkles } from 'lucide-react';
import { motion } from 'framer-motion';

interface PaywallOverlayProps {
  featureName: string;
  description: string;
  onUpgrade: () => void;
}

export const PaywallOverlay: React.FC<PaywallOverlayProps> = ({ featureName, description, onUpgrade }) => {
  return (
    <div className="absolute inset-0 z-50 flex items-center justify-center overflow-hidden rounded-2xl">
      {/* Heavy Blur Backdrop */}
      <div className="absolute inset-0 bg-white/20 backdrop-blur-[24px] border border-white/40 z-0"></div>
      
      {/* Content */}
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative z-10 max-w-lg w-full mx-4"
      >
        <div className="bg-white/80 backdrop-blur-3xl rounded-[2rem] p-8 md:p-10 shadow-[0_20px_60px_-15px_rgba(0,0,0,0.1)] border border-white/60 text-center relative overflow-hidden group">
          
          {/* Animated Background Gradients */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden rounded-[2rem] pointer-events-none">
            <div className="absolute -top-20 -left-20 w-64 h-64 bg-sky-400/20 rounded-full mix-blend-multiply filter blur-[40px] opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-blob"></div>
            <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-blue-500/20 rounded-full mix-blend-multiply filter blur-[40px] opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-blob animation-delay-2000"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-purple-400/20 rounded-full mix-blend-multiply filter blur-[40px] opacity-70 group-hover:opacity-100 transition-opacity duration-700 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10">
            <div className="flex justify-center mb-6">
              <div className="relative w-20 h-20 bg-gradient-to-br from-sky-400 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg transform rotate-3 hover:rotate-6 transition-transform">
                <Lock className="w-10 h-10 text-white drop-shadow-md" />
                <div className="absolute -top-2 -right-2 bg-yellow-400 text-yellow-900 rounded-full p-1 shadow-sm border-2 border-white">
                  <Sparkles className="w-4 h-4" />
                </div>
              </div>
            </div>

            <h2 className="text-3xl font-black text-slate-800 mb-4 tracking-tight">
              Unlock <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">{featureName}</span>
            </h2>
            
            <p className="text-slate-600 text-[15px] leading-relaxed mb-8">
              {description}
            </p>

            <button 
              onClick={onUpgrade}
              className="w-full bg-[#0a152d] text-white font-bold text-lg py-4 px-8 rounded-xl shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-2 group relative overflow-hidden"
            >
              <span className="relative z-10 flex items-center">
                Upgrade to Pro Max Ultra
                <ShieldAlert className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
              </span>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-0"></div>
            </button>
            
            <p className="text-xs font-bold text-slate-400 mt-5 uppercase tracking-wider">
              Requires active enterprise license
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
};
