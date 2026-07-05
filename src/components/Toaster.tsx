import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAppStore } from '../lib/store';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const icons = {
  success: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
  error: <AlertCircle className="w-5 h-5 text-red-400" />,
  info: <Info className="w-5 h-5 text-blue-400" />,
  warning: <AlertTriangle className="w-5 h-5 text-amber-400" />
};

export const Toaster = () => {
  const { toasts, removeToast } = useAppStore();

  return (
    <div className="fixed bottom-0 right-0 z-[200] p-6 flex flex-col gap-3 pointer-events-none w-full max-w-sm">
      <AnimatePresence>
        {toasts.map((toast) => (
          <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
        ))}
      </AnimatePresence>
    </div>
  );
};

const ToastItem = ({ toast, onRemove }: { key?: string | number, toast: any, onRemove: () => void }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove();
    }, 5000);
    return () => clearTimeout(timer);
  }, [onRemove]);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
      className="pointer-events-auto bg-[#0a1122]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-4 shadow-[0_10px_40px_rgba(0,0,0,0.5)] flex items-start gap-3"
    >
      <div className="shrink-0 mt-0.5">{icons[toast.type as keyof typeof icons]}</div>
      <div className="flex-1">
        <h4 className="text-[13px] font-bold text-white tracking-wide">{toast.title}</h4>
        {toast.description && <p className="text-[12px] text-slate-400 mt-1 font-medium">{toast.description}</p>}
      </div>
      <button onClick={onRemove} className="shrink-0 text-slate-500 hover:text-white transition-colors">
        <X className="w-4 h-4" />
      </button>
    </motion.div>
  );
};
