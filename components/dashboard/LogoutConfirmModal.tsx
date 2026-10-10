'use client';

import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { LogOut, X, AlertTriangle, Loader2 } from 'lucide-react';

interface LogoutConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  userName?: string;
  isLoading?: boolean;
}

export default function LogoutConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  userName = 'Warga',
  isLoading = false,
}: LogoutConfirmModalProps) {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Tutup dengan tombol Escape & amankan overflow body serta html
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && !isLoading) {
        onClose();
      }
    };

    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose, isLoading]);

  if (!isOpen || !mounted) return null;
  if (typeof document === 'undefined' || !document.body) return null;

  return createPortal(
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4 sm:p-6 overflow-y-auto modal-scroll-area pointer-events-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100dvh',
        zIndex: 9999,
      }}
      onClick={() => {
        if (!isLoading) onClose();
      }}
    >
      {/* Backdrop Gelap & Blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-sm modal-backdrop-animate cursor-pointer"
        aria-hidden="true"
      />

      {/* Card Dialog Konfirmasi Logout - Selalu Presisi di Tengah Layar */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="logout-modal-title"
        className="relative z-10 w-full max-w-md my-auto bg-white rounded-3xl shadow-2xl border border-slate-200/90 p-6 sm:p-8 space-y-5 sm:space-y-6 modal-spring-animate max-h-[90dvh] overflow-y-auto modal-scroll-area"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Icon & Close Button */}
        <div className="flex items-start justify-between">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600 shadow-xs shrink-0">
            <LogOut className="w-6 h-6 stroke-[2.2]" />
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-slate-600 disabled:opacity-50 cursor-pointer"
            aria-label="Tutup modal konfirmasi"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content & Messaging */}
        <div className="space-y-2">
          <h2
            id="logout-modal-title"
            className="text-xl font-bold text-slate-900 tracking-tight"
          >
            Keluar dari Sistem TRACE?
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
            Hai <strong className="text-slate-800">{userName}</strong>, sesi Anda pada perangkat ini akan diakhiri. Anda dapat masuk kembali kapan saja menggunakan identitas NIK terdaftar dan PIN atau OTP.
          </p>
        </div>

        {/* Info Box */}
        <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-xs text-amber-900 flex items-start gap-2.5">
          <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
          <span className="leading-relaxed">
            Laporan yang telah Anda ajukan tetap tersimpan aman di sistem TRACE Kota Bengkulu dan dapat dipantau kembali setelah Anda masuk.
          </span>
        </div>

        {/* Action Buttons: Responsive Full Width Touch Targets on Mobile */}
        <div className="flex flex-col-reverse sm:flex-row items-center gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="w-full sm:flex-1 min-h-12 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 font-semibold text-xs sm:text-sm hover:bg-slate-50 active:scale-98 transition-all focus-visible:outline-2 focus-visible:outline-slate-600 cursor-pointer disabled:opacity-50"
          >
            Batal
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="w-full sm:flex-1 min-h-12 px-4 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-rose-600/20 transition-all flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-rose-600 cursor-pointer disabled:opacity-70"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                <span>Mengakhiri Sesi...</span>
              </>
            ) : (
              <>
                <LogOut className="w-4 h-4" />
                <span>Ya, Keluar Akun</span>
              </>
            )}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
