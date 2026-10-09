'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  LayoutDashboard,
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  MapPin,
  Home,
  LogOut,
  X,
  ChevronRight,
} from 'lucide-react';
import { OfficerProfile } from './AdminLoginForm';

export type AdminMenuId =
  | 'dashboard'
  | 'all_reports'
  | 'pending'
  | 'in_progress'
  | 'resolved'
  | 'map_distribution';

interface AdminSidebarProps {
  activeMenu: AdminMenuId;
  onMenuSelect: (menuId: AdminMenuId) => void;
  officer: OfficerProfile;
  onLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  totalCount: number;
}

export default function AdminSidebar({
  activeMenu,
  onMenuSelect,
  officer,
  onLogout,
  isMobileOpen,
  onCloseMobile,
  pendingCount,
  inProgressCount,
  resolvedCount,
  totalCount,
}: AdminSidebarProps) {
  const MENU_ITEMS = [
    {
      id: 'dashboard' as AdminMenuId,
      label: 'Dashboard Utama',
      desc: 'Ringkasan & metrik dinas',
      icon: LayoutDashboard,
      badge: 'Utama',
      badgeType: 'neutral',
    },
    {
      id: 'all_reports' as AdminMenuId,
      label: 'Semua Pengaduan',
      desc: 'Database arsip lengkap',
      icon: FileText,
      badge: totalCount.toString(),
      badgeType: 'count',
    },
    {
      id: 'pending' as AdminMenuId,
      label: 'Menunggu Verifikasi',
      desc: 'Antrean butuh validasi',
      icon: Clock,
      badge: pendingCount.toString(),
      badgeType: pendingCount > 0 ? 'warning' : 'count',
    },
    {
      id: 'in_progress' as AdminMenuId,
      label: 'Sedang Ditangani',
      desc: 'Tindakan tim lapangan',
      icon: Wrench,
      badge: inProgressCount.toString(),
      badgeType: 'count',
    },
    {
      id: 'resolved' as AdminMenuId,
      label: 'Tuntas Selesai',
      desc: 'Arsip bukti fisik pengerjaan',
      icon: CheckCircle2,
      badge: resolvedCount.toString(),
      badgeType: 'count',
    },
    {
      id: 'map_distribution' as AdminMenuId,
      label: 'Sebaran Wilayah',
      desc: 'Analisis spasial GIS',
      icon: MapPin,
      badge: 'GIS',
      badgeType: 'info',
    },
  ];

  return (
    <>
      {/* Backdrop Drawer Mobile */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/40 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* 
        Sidebar Admin:
        - Di desktop: Menjadi kolom statis/docked h-full w-72 yang terkunci rapat di sisi kiri (diam di tempat saat scroll)
        - Di mobile: Menjadi drawer slide-out yang smooth
      */}
      <aside
        aria-label="Navigasi Menu Petugas Dinas"
        className={`fixed md:sticky top-0 left-0 z-50 md:z-30 w-72 max-w-[85vw] h-dvh md:h-screen bg-white text-slate-800 border-r border-slate-200/90 flex flex-col shrink-0 transition-transform duration-300 ease-in-out shadow-xs select-none ${
          isMobileOpen
            ? 'translate-x-0 shadow-2xl'
            : '-translate-x-full md:translate-x-0'
        }`}
      >
        {/* 1. Header Sidebar: Logo & Label Petugas Dinas */}
        <div className="h-18 px-5 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-blue-600 rounded-xl"
          >
            <div className="w-9 h-9 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-2">
                <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  TRACE
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200/80">
                  Panel Dinas
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Kota Bengkulu
              </span>
            </div>
          </Link>

          {/* Tombol Tutup Khusus Mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden w-9 h-9 rounded-xl text-slate-400 hover:text-slate-800 hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            aria-label="Tutup menu admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Menu Navigasi Berbeda-beda untuk Setiap Bagian */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-5 space-y-6">
          {/* Kelompok Menu Utama Petugas */}
          <div className="space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Pengelolaan Dinas
            </div>

            {MENU_ITEMS.map((item) => {
              const isActive = activeMenu === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onMenuSelect(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left min-h-11 px-3 py-2 rounded-xl transition-all flex items-center justify-between group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-[0.99] ${
                    isActive
                      ? 'bg-blue-50/90 text-blue-700 font-bold border border-blue-200/80 shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/70 group-hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className={`text-xs sm:text-sm leading-tight truncate ${isActive ? 'text-blue-900 font-bold' : 'text-slate-800'}`}>
                        {item.label}
                      </div>
                      <div className="text-[10px] sm:text-[11px] text-slate-400 font-normal leading-tight mt-0.5 truncate hidden sm:block">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {/* Badge Angka / Label */}
                  {item.badgeType === 'warning' ? (
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-800 border border-amber-300 shrink-0">
                      {item.badge}
                    </span>
                  ) : item.badgeType === 'info' ? (
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 text-blue-700 shrink-0">
                      {item.badge}
                    </span>
                  ) : item.badgeType === 'neutral' ? (
                    <span className="text-[10px] font-medium px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-500 shrink-0">
                      {item.badge}
                    </span>
                  ) : (
                    <span
                      className={`text-[11px] font-mono font-bold px-2 py-0.5 rounded-md shrink-0 transition-colors ${
                        isActive
                          ? 'bg-blue-100/90 text-blue-800'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kelompok Navigasi GIS & Publik */}
          <div className="space-y-1 pt-4 border-t border-slate-100">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Akses Portal Publik
            </div>

            <Link
              href="/peta"
              onClick={onCloseMobile}
              className="min-h-10 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between group text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Peta GIS Interaktif</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </Link>

            <Link
              href="/"
              onClick={onCloseMobile}
              className="min-h-10 px-3 py-2 rounded-xl text-slate-600 hover:bg-slate-50 hover:text-blue-600 transition-colors flex items-center justify-between group text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-slate-100 text-slate-500 group-hover:text-blue-600 group-hover:bg-blue-50 flex items-center justify-center shrink-0 transition-colors">
                  <Home className="w-4 h-4" />
                </div>
                <span>Halaman Utama TRACE</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-all" />
            </Link>
          </div>
        </div>

        {/* 3. Footer Sidebar: Profil Petugas & Log Out */}
        <div className="p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 bg-slate-50/70 shrink-0 space-y-3">
          {/* Card Info Petugas Dinas (Putih Bersih) */}
          <div className="p-3 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-700 border border-blue-200 flex items-center justify-center font-bold text-xs shrink-0 shadow-2xs">
              {officer.nama.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {officer.nama}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Petugas Aktif" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                NIP: {officer.nip}
              </div>
              <div className="text-[10px] text-blue-600 font-medium truncate leading-tight mt-0.5">
                {officer.jabatan}
              </div>
            </div>
          </div>

          {/* Tombol Keluar Sesi Petugas */}
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onLogout();
            }}
            className="w-full min-h-10 px-3 py-2 rounded-xl border border-slate-200 hover:border-rose-300 text-slate-600 hover:text-rose-700 bg-white hover:bg-rose-50 text-xs font-bold transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-2xs active:scale-[0.99] focus-visible:outline-2 focus-visible:outline-rose-600"
          >
            <LogOut className="w-4 h-4 text-slate-400 group-hover:text-rose-600" />
            <span>Keluar Sesi Petugas</span>
          </button>
        </div>
      </aside>
    </>
  );
}
