'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, PlusCircle, LogOut, ShieldCheck } from 'lucide-react';
import { UserDashboardTab } from './UserSidebar';

interface UserHeaderProps {
  activeTab: UserDashboardTab;
  userName: string;
  onOpenMobileSidebar: () => void;
  onOpenLogout: () => void;
}

export default function UserHeader({
  activeTab,
  userName,
  onOpenMobileSidebar,
  onOpenLogout,
}: UserHeaderProps) {
  const getTabTitle = () => {
    switch (activeTab) {
      case 'monitoring':
        return 'Pemantauan Pengaduan';
      case 'riwayat':
        return 'Riwayat & Arsip Tiket';
      case 'profil':
        return 'Profil Akun & Identitas Warga';
      default:
        return 'Dashboard Warga';
    }
  };

  return (
    <header className="sticky top-0 z-30 h-16 sm:h-20 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-3.5 sm:px-8 lg:px-10 flex items-center justify-between transition-all">
      {/* Kolom Kiri: Mobile Burger & Judul Seksi */}
      <div className="flex items-center gap-2.5 sm:gap-4 min-w-0">
        {/* Tombol Hamburger Khusus Mobile (Tap Target 44px+) */}
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden min-w-11 min-h-11 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
          aria-label="Buka menu navigasi"
        >
          <Menu className="w-5 h-5 stroke-[2.2]" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-xl font-extrabold text-slate-900 tracking-tight truncate leading-tight">
            {getTabTitle()}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-400 font-medium hidden sm:block truncate mt-0.5">
            Halo, <strong className="text-slate-700">{userName}</strong> • Sistem Partisipasi Warga Kota Bengkulu
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Aksi Cepat (Buat Laporan & Keluar Langsung) */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        {/* Badge Status Verifikasi Warga */}
        <div className="hidden lg:inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          <span>Terverifikasi NIK</span>
        </div>

        {/* Tombol Buat Laporan */}
        <Link
          href="/dashboard/buat-laporan"
          className="min-h-10 sm:min-h-11 inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-xs shadow-blue-500/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span className="hidden xs:inline">Buat Laporan</span>
          <span className="xs:hidden text-[11px]">Lapor</span>
        </Link>

        {/* Tombol Keluar Cepat (Terlihat Jelas di HP & Desktop) */}
        <button
          type="button"
          onClick={onOpenLogout}
          className="min-h-10 sm:min-h-11 px-2.5 sm:px-3.5 py-2 rounded-xl border border-rose-200 bg-rose-50/70 hover:bg-rose-100/80 text-rose-700 hover:text-rose-800 transition-colors flex items-center justify-center gap-1.5 text-xs font-bold focus-visible:outline-2 focus-visible:outline-rose-600 active:scale-95 shadow-2xs"
          title="Keluar dari sesi akun Anda"
          aria-label="Keluar sistem"
        >
          <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
          <span className="text-[11px] sm:text-xs">Keluar</span>
        </button>
      </div>
    </header>
  );
}
