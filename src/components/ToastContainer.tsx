import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useApp();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none">
      {toasts.map((toast) => {
        const iconMap = {
          success: <CheckCircle2 className="w-4 h-4 text-[#10B981] shrink-0" />,
          info: <Info className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] shrink-0" />,
          warning: <AlertTriangle className="w-4 h-4 text-[#F59E0B] shrink-0" />,
          error: <AlertCircle className="w-4 h-4 text-[#EF4444] shrink-0" />,
        };
        return (
          <div
            key={toast.id}
            className="pointer-events-auto p-3.5 rounded-2xl card-premium shadow-2xl flex items-start justify-between gap-3"
          >
            <div className="flex items-start gap-2.5">
              {iconMap[toast.type]}
              <div>
                <div className="font-display text-xs font-bold text-[#0F172A] dark:text-[#F8FAFC]">
                  {toast.title}
                </div>
                <div className="text-xs text-[#475569] dark:text-[#94A3B8] mt-0.5 leading-relaxed">
                  {toast.message}
                </div>
              </div>
            </div>
            <button
              onClick={() => dismissToast(toast.id)}
              aria-label="Dismiss notification"
              className="text-[#475569] dark:text-[#94A3B8] hover:text-[#0F172A] dark:hover:text-white p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
