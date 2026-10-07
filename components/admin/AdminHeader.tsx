'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, MapPin, LogOut, ShieldCheck, Building2 } from 'lucide-react';
import { OfficerProfile } from './AdminLoginForm';

interface AdminHeaderProps {
  officer: OfficerProfile;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  officer,
  onOpenMobileSidebar,
  onLogout,
}: AdminHeaderProps) {
  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-8 lg:px-10 flex items-center justify-between transition-all">
      {/* Kolom Kiri: Mobile Burger & Judul Panel */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {/* Tombol Hamburger Khusus Mobile (Tap Target 44px+) */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden min-w-11 min-h-11 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
          aria-label="Buka menu navigasi admin"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="min-w-0">
          <div className="flex items-center gap-2">
            <h1 className="text-sm sm:text-base lg:text-lg font-extrabold text-slate-900 tracking-tight truncate leading-tight">
              Manajemen Pengaduan
            </h1>
            <span className="hidden lg:inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200 text-[11px] font-bold">
              <ShieldCheck className="w-3 h-3 text-blue-600" />
              <span>Otoritas Resmi</span>
            </span>
          </div>

          <p className="text-[11px] sm:text-xs text-slate-500 flex items-center gap-1.5 truncate mt-0.5">
            <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">{officer.instansi}</span>
            <span className="text-slate-300 hidden sm:inline">•</span>
            <span className="font-mono text-slate-400 hidden sm:inline">NIP: {officer.nip}</span>
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Aksi Cepat (Peta Publik & Keluar Sesi Petugas) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Tautan Peta Publik */}
        <Link
          href="/peta"
          className="min-h-10 sm:min-h-11 px-3 sm:px-4 py-2 rounded-xl border border-slate-200 hover:border-blue-500 text-slate-700 hover:text-blue-600 text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
          title="Tinjau sebaran peta publik"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Peta Publik</span>
        </Link>

        {/* Tombol Logout Petugas (Terlihat Jelas di HP & Desktop) */}
        <button
          type="button"
          onClick={onLogout}
          className="min-h-10 sm:min-h-11 px-2.5 sm:px-3.5 py-2 rounded-xl bg-rose-50/80 hover:bg-rose-100/90 text-rose-700 border border-rose-200 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 focus-visible:outline-2 focus-visible:outline-rose-600 active:scale-95 shadow-2xs"
          title="Keluar dari sesi petugas dinas"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">Keluar</span>
        </button>
      </div>
    </header>
  );
}
