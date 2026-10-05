'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Plus, Sparkles } from 'lucide-react';

export default function FloatingQuickReportFAB() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 380) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div
      className={`fixed bottom-6 right-6 z-40 transition-all duration-300 ${
        isVisible
          ? 'opacity-100 translate-y-0 pointer-events-auto'
          : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <Link
        href="/dashboard/buat-laporan"
        className="group flex items-center gap-2.5 px-4.5 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xl shadow-blue-600/30 border border-blue-400/40 backdrop-blur-md text-xs font-bold transition-all"
        title="Buat Laporan Baru Cepat"
      >
        <span className="w-5 h-5 rounded-full bg-white/20 flex items-center justify-center shrink-0 group-hover:rotate-90 transition-transform duration-200">
          <Plus className="w-3.5 h-3.5 text-white" />
        </span>
        <span className="tracking-tight">Lapor Masalah</span>
        <span className="flex items-center gap-1 text-[10px] font-semibold bg-blue-500/60 px-2 py-0.5 rounded-full text-blue-100 hidden sm:inline-flex">
          <Sparkles className="w-2.5 h-2.5 text-blue-200" />
          <span>Cepat & Aman</span>
        </span>
      </Link>
    </div>
  );
}
