'use client';

import React from 'react';
import Link from 'next/link';
import { Menu, MapPin, LogOut } from 'lucide-react';
import { OfficerProfile } from './AdminLoginForm';
import { AdminMenuId } from './AdminSidebar';

interface AdminHeaderProps {
  officer: OfficerProfile;
  activeMenu: AdminMenuId;
  onOpenMobileSidebar: () => void;
  onLogout: () => void;
}

export default function AdminHeader({
  officer,
  activeMenu,
  onOpenMobileSidebar,
  onLogout,
}: AdminHeaderProps) {
  const HEADER_TITLES: Record<AdminMenuId, { title: string; subtitle: string }> = {
    dashboard: {
      title: 'Dashboard Operasional Dinas',
      subtitle: `${officer.instansi} • Kota Bengkulu`,
    },
    all_reports: {
      title: 'Database Semua Pengaduan Warga',
      subtitle: 'Pencarian, penyaringan multikategori, dan manajemen arsip',
    },
    pending: {
      title: 'Antrean Verifikasi Pengaduan',
      subtitle: 'Triage keabsahan laporan warga sebelum diteruskan ke tim dinas',
    },
    in_progress: {
      title: 'Monitoring Pengerjaan Lapangan',
      subtitle: 'Pemantauan perkembangan perbaikan fisik oleh tim teknis dinas',
    },
    resolved: {
      title: 'Arsip Laporan Tuntas Terverifikasi',
      subtitle: 'Dokumentasi komparasi bukti fisik Sebelum dan Sesudah pengerjaan',
    },
    map_distribution: {
      title: 'Sebaran Wilayah & Analisis GIS',
      subtitle: 'Distribusi titik masalah di 9 kecamatan Kota Bengkulu',
    },
  };

  const currentInfo = HEADER_TITLES[activeMenu] || {
    title: 'Panel Petugas Dinas',
    subtitle: `${officer.instansi} • Kota Bengkulu`,
  };

  return (
    <header className="sticky top-0 z-20 h-18 bg-white/95 backdrop-blur-md border-b border-slate-200/80 px-4 sm:px-6 lg:px-8 flex items-center justify-between shrink-0 transition-all">
      {/* Kolom Kiri: Mobile Burger & Judul Halaman Dinamis */}
      <div className="flex items-center gap-3 sm:gap-4 min-w-0">
        <button
          type="button"
          onClick={onOpenMobileSidebar}
          className="md:hidden min-w-10 min-h-10 rounded-xl text-slate-700 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200/80 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
          aria-label="Buka menu navigasi admin"
        >
          <Menu className="w-5 h-5" />
        </button>

        <div className="min-w-0">
          <h1 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 tracking-tight truncate leading-tight">
            {currentInfo.title}
          </h1>
          <p className="text-[11px] sm:text-xs text-slate-500 truncate mt-0.5">
            {currentInfo.subtitle}
          </p>
        </div>
      </div>

      {/* Kolom Kanan: Aksi Cepat */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <Link
          href="/peta"
          className="min-h-9 px-3 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-blue-600 text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 shadow-2xs"
          title="Tinjau sebaran peta publik"
        >
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span className="hidden sm:inline">Peta GIS Publik</span>
        </Link>

        <button
          type="button"
          onClick={onLogout}
          className="min-h-9 px-3 sm:px-3.5 py-1.5 rounded-xl border border-slate-200 hover:border-rose-200 hover:bg-rose-50 text-slate-600 hover:text-rose-700 text-xs font-semibold transition-colors flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-rose-600 active:scale-95 shadow-2xs cursor-pointer"
          title="Keluar dari sesi petugas dinas"
        >
          <LogOut className="w-3.5 h-3.5 text-slate-400 group-hover:text-rose-600" />
          <span className="hidden xs:inline">Keluar</span>
        </button>
      </div>
    </header>
  );
}
