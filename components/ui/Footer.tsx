import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 py-8 px-4 sm:px-6 lg:px-8 text-center sm:text-left">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
        <div className="flex items-center gap-2.5">
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
          <span className="text-slate-300">/</span>
          <span>Tracking Reports & Aggregating Community Environmental Issues</span>
        </div>

        <div className="flex items-center gap-4 text-xs">
          <Link href="/peta" className="hover:text-blue-600 transition-colors">
            Peta Publik
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/dashboard/buat-laporan" className="hover:text-blue-600 transition-colors">
            Buat Laporan
          </Link>
          <span className="text-slate-300">•</span>
          <Link href="/admin" className="hover:text-blue-600 transition-colors">
            Portal Petugas
          </Link>
        </div>
      </div>
    </footer>
  );
}

