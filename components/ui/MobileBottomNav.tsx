'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, MapPin, Plus, LayoutDashboard, Shield } from 'lucide-react';

export default function MobileBottomNav() {
  const pathname = usePathname();

  // Sembunyikan di halaman login masuk dan area khusus petugas /admin
  if (pathname === '/masuk' || pathname.startsWith('/admin')) return null;

  const isHome = pathname === '/';
  const isPeta = pathname.startsWith('/peta');
  const isLapor = pathname.startsWith('/dashboard/buat-laporan');
  const isDashboard = pathname === '/dashboard' && !isLapor;

  return (
    <nav
      aria-label="Navigasi Bawah Mobile"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 backdrop-blur-xl border-t border-slate-200/90 shadow-[0_-4px_24px_rgba(15,23,42,0.08)] pb-[max(0.35rem,env(safe-area-inset-bottom))] pt-1"
    >
      <div className="flex items-center justify-between px-3 max-w-md mx-auto h-14">
        {/* Grup Navigasi Kiri & Tengah: Beranda, Peta, Status (Sejajar, Seimbang, & Presisi) */}
        <div className="flex items-center justify-around flex-1 pr-2">
          {/* 1. Beranda */}
          <Link
            href="/"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 active:scale-90 ${
              isHome ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <Home className={`w-5 h-5 transition-transform duration-150 ${isHome ? 'scale-105' : ''}`} strokeWidth={isHome ? 2.5 : 2} />
              {isHome && (
                <span className="active-dot-pop absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 leading-none font-medium">Beranda</span>
          </Link>

          {/* 2. Peta */}
          <Link
            href="/peta"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 active:scale-90 ${
              isPeta ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <MapPin className={`w-5 h-5 transition-transform duration-150 ${isPeta ? 'scale-105' : ''}`} strokeWidth={isPeta ? 2.5 : 2} />
              {isPeta && (
                <span className="active-dot-pop absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 leading-none font-medium">Peta</span>
          </Link>

          {/* 3. Status Laporan */}
          <Link
            href="/dashboard"
            className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-150 active:scale-90 ${
              isDashboard ? 'text-blue-600 font-bold' : 'text-slate-500 hover:text-slate-800'
            }`}
          >
            <div className="relative">
              <LayoutDashboard className={`w-5 h-5 transition-transform duration-150 ${isDashboard ? 'scale-105' : ''}`} strokeWidth={isDashboard ? 2.5 : 2} />
              {isDashboard && (
                <span className="active-dot-pop absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 bg-blue-600 rounded-full" />
              )}
            </div>
            <span className="text-[10px] tracking-tight mt-1 leading-none font-medium">Status</span>
          </Link>
        </div>

        {/* Pemisah Halus */}
        <div className="h-6 w-px bg-slate-200/80 mr-1.5 shrink-0" aria-hidden="true" />

        {/* Sudut Kanan: Tombol Lapor Lebih Besar, Terintegrasi di Footbar & Muncul ke Atas */}
        <div className="relative shrink-0 flex flex-col items-center justify-center w-16">
          <Link
            href="/dashboard/buat-laporan"
            className="group flex flex-col items-center justify-center active:scale-95 transition-transform duration-150"
            title="Buat Laporan Baru"
          >
            {/* Lingkaran Action Lebih Besar & Menyembul Mantap ke Atas */}
            <div className="-translate-y-4.5 w-14 h-14 rounded-full bg-linear-to-tr from-blue-700 via-blue-600 to-indigo-600 text-white flex items-center justify-center shadow-[0_10px_25px_rgba(37,99,235,0.45)] ring-[5px] ring-white group-hover:scale-105 active:scale-90 transition-transform duration-150">
              <Plus className="w-7 h-7 stroke-[2.8] transition-transform duration-300 group-hover:rotate-90 group-active:rotate-90 ease-out" />
            </div>
            {/* Teks Label Sejajar Presisi dengan Navigasi Lainnya */}
            <span
              className={`-translate-y-3 text-[11px] font-extrabold tracking-tight leading-none ${
                isLapor ? 'text-blue-600' : 'text-slate-800'
              }`}
            >
              Lapor
            </span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
