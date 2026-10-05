'use client';

import React, { createContext, useContext, useState, useCallback, useMemo } from 'react';
import { CheckCircle2, Info, AlertCircle, X, Sparkles } from 'lucide-react';

export type ToastType = 'success' | 'info' | 'error' | 'copied';

export interface ToastItem {
  id: string;
  type: ToastType;
  message: string;
  description?: string;
}

interface ToastContextType {
  toast: {
    success: (message: string, description?: string) => void;
    info: (message: string, description?: string) => void;
    error: (message: string, description?: string) => void;
    copied: (message: string, description?: string) => void;
  };
}

const ToastContext = createContext<ToastContextType | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return { toast: context.toast, ...context.toast };
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const addToast = useCallback((type: ToastType, message: string, description?: string) => {
    const id = `toast-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
    setToasts((prev) => [...prev.slice(-3), { id, type, message, description }]);

    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 3600);
  }, []);

  const removeToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const toastMethods = useMemo(
    () => ({
      success: (msg: string, desc?: string) => addToast('success', msg, desc),
      info: (msg: string, desc?: string) => addToast('info', msg, desc),
      error: (msg: string, desc?: string) => addToast('error', msg, desc),
      copied: (msg: string, desc?: string) => addToast('copied', msg, desc),
    }),
    [addToast]
  );

  return (
    <ToastContext.Provider value={{ toast: toastMethods }}>
      {children}

      {/* Floating Modern Toast Stack (Top-Center Docked Pill) */}
      <div
        aria-live="polite"
        className="fixed top-5 left-1/2 -translate-x-1/2 z-50 flex flex-col items-center gap-2 pointer-events-none w-full max-w-sm px-4"
      >
        {toasts.map((item) => (
          <div
            key={item.id}
            className="pointer-events-auto w-auto max-w-full flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-slate-900/95 backdrop-blur-xl border border-slate-700/60 text-white shadow-2xl shadow-slate-900/30 text-xs animate-in fade-in slide-in-from-top-3 duration-200 transition-all hover:scale-[1.02]"
          >
            {/* Icon by Type */}
            {item.type === 'success' && (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            )}
            {item.type === 'copied' && (
              <Sparkles className="w-4 h-4 text-blue-400 shrink-0" />
            )}
            {item.type === 'info' && (
              <Info className="w-4 h-4 text-sky-400 shrink-0" />
            )}
            {item.type === 'error' && (
              <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
            )}

            {/* Message Body */}
            <div className="flex flex-col min-w-0 pr-1">
              <span className="font-semibold text-slate-100 truncate">{item.message}</span>
              {item.description && (
                <span className="text-[11px] text-slate-400 truncate">{item.description}</span>
              )}
            </div>

            {/* Dismiss Button */}
            <button
              type="button"
              onClick={() => removeToast(item.id)}
              className="text-slate-400 hover:text-white p-0.5 rounded-full hover:bg-slate-800 transition-colors ml-1"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}
