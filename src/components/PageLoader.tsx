import React from 'react';
import { motion } from 'framer-motion';
import { Logo } from './Logo';

export const PageLoader = () => {
  return (
    <div className="flex-grow flex items-center justify-center min-h-[60vh]">
      <div className="relative flex flex-col items-center space-y-4">
        <Logo className="w-16 h-16 animate-pulse-slow drop-shadow-[0_0_20px_rgba(34,211,238,0.4)]" />
        
        <div className="flex items-center space-x-1">
          <motion.div
            className="w-1.5 h-1.5 bg-blue-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-cyan-400 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.2 }}
          />
          <motion.div
            className="w-1.5 h-1.5 bg-purple-500 rounded-full"
            animate={{ scale: [1, 1.5, 1], opacity: [0.3, 1, 0.3] }}
            transition={{ duration: 1, repeat: Infinity, delay: 0.4 }}
          />
        </div>
        <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Loading Module</span>
      </div>
    </div>
  );
};
