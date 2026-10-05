import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-8 pb-24 md:pb-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500 text-center sm:text-left">
        <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-2.5">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shrink-0 border border-slate-800/20">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={20}
                height={20}
                className="w-full h-full object-cover"
              />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">TRACE</span>
          </div>
          <span className="hidden sm:inline text-slate-300">/</span>
          <span className="text-[11px] sm:text-xs text-slate-500 max-w-sm sm:max-w-none">
            Tracking Reports & Aggregating Community Environmental Issues
          </span>
        </div>

        <nav aria-label="Footer Navigation" className="flex flex-wrap items-center justify-center gap-1 sm:gap-3 text-xs font-medium">
          <Link
            href="/peta"
            className="min-h-11 inline-flex items-center px-2.5 py-1 text-slate-600 hover:text-blue-600 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Peta Publik
          </Link>
          <span className="text-slate-300 hidden sm:inline">•</span>
          <Link
            href="/dashboard/buat-laporan"
            className="min-h-11 inline-flex items-center px-2.5 py-1 text-slate-600 hover:text-blue-600 transition-colors rounded-lg focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            Buat Laporan
          </Link>
        </nav>
      </div>
    </footer>
  );
}

