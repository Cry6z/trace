'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  PlusCircle,
  Clock,
  ShieldCheck,
  MapPin,
  Home,
  LogOut,
  X,
  ChevronRight,
  User
} from 'lucide-react';

export type UserDashboardTab = 'monitoring' | 'riwayat' | 'profil';

interface UserSidebarProps {
  activeTab: UserDashboardTab;
  onTabChange: (tab: UserDashboardTab) => void;
  userName: string;
  nikMasked: string;
  totalReports: number;
  onOpenLogout: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export default function UserSidebar({
  activeTab,
  onTabChange,
  userName,
  nikMasked,
  totalReports,
  onOpenLogout,
  isMobileOpen,
  onCloseMobile,
}: UserSidebarProps) {
  const pathname = usePathname();
  const initial = userName ? userName.charAt(0).toUpperCase() : 'W';

  const NAV_ITEMS = [
    {
      id: 'monitoring' as UserDashboardTab,
      label: 'Pemantauan Laporan',
      desc: 'Pantau status & progres',
      icon: LayoutDashboard,
      badge: totalReports > 0 ? totalReports : undefined,
    },
    {
      id: 'riwayat' as UserDashboardTab,
      label: 'Riwayat & Tiket',
      desc: 'Arsip seluruh pengaduan',
      icon: Clock,
    },
    {
      id: 'profil' as UserDashboardTab,
      label: 'Profil & Identitas KTP',
      desc: 'Rincian akun & PIN',
      icon: User,
    },
  ];

  return (
    <>
      {/* Backdrop Gelap untuk Mobile Drawer */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Utama: h-[100dvh] & max-w-[85vw] untuk responsivitas mobile */}
      <aside
        aria-label="Navigasi Menu Pengguna"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] h-dvh bg-white border-r border-slate-200/80 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* 1. Header Sidebar: Brand TRACE & Tutup Mobile */}
        <div className="h-18 sm:h-20 px-5 sm:px-6 border-b border-slate-100 flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-blue-600 rounded-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center shadow-md border border-slate-800/20 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-base font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  TRACE
                </span>
                <span className="text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                  Warga
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Kota Bengkulu
              </span>
            </div>
          </Link>

          {/* Tombol Tutup Khusus Mobile Drawer */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden w-10 h-10 rounded-xl text-slate-400 hover:text-slate-700 hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            aria-label="Tutup menu sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Tombol Aksi Primer: Buat Laporan Baru */}
        <div className="px-5 pt-4 pb-2 shrink-0">
          <Link
            href="/dashboard/buat-laporan"
            onClick={onCloseMobile}
            className="w-full min-h-11.5 flex items-center justify-center gap-2 px-4 py-2.5 rounded-2xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Buat Laporan Baru</span>
          </Link>
        </div>

        {/* 3. Daftar Navigasi Menu Sidebar (Scrollable & min-h-0) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-3 space-y-5">
          {/* Kelompok Menu Utama */}
          <div className="space-y-1.5">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Menu Dashboard
            </div>
            {NAV_ITEMS.map((item) => {
              const isActive = activeTab === item.id && pathname === '/dashboard';
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onTabChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left min-h-11.5 px-3.5 py-2.5 rounded-2xl transition-all flex items-center justify-between group focus-visible:outline-2 focus-visible:outline-blue-600 ${
                    isActive
                      ? 'bg-blue-50/80 text-blue-700 font-bold shadow-2xs'
                      : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900 font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 group-hover:text-slate-700'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm leading-tight truncate">
                        {item.label}
                      </div>
                      <div className="text-[11px] text-slate-400 font-normal leading-tight mt-0.5 truncate hidden sm:block">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  {item.badge !== undefined && (
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                        isActive
                          ? 'bg-blue-600 text-white'
                          : 'bg-slate-100 text-slate-600'
                      }`}
                    >
                      {item.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Kelompok Navigasi Publik */}
          <div className="space-y-1.5 pt-2 border-t border-slate-100">
            <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Jelajah Publik
            </div>

            <Link
              href="/peta"
              onClick={onCloseMobile}
              className="min-h-11 px-3.5 py-2 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-between group text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Peta Komunitas</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
            </Link>

            <Link
              href="/"
              onClick={onCloseMobile}
              className="min-h-11 px-3.5 py-2 rounded-2xl text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors flex items-center justify-between group text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-100 text-slate-500 group-hover:bg-slate-200/80 flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <span>Beranda TRACE</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-slate-500" />
            </Link>
          </div>
        </div>

        {/* 4. Footer Sidebar: Selalu Terlihat & Aman dari Safe Area Bawah */}
        <div className="p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-100 bg-slate-50/70 shrink-0 space-y-3">
          {/* Card Info Pengguna */}
          <div className="p-3 rounded-2xl bg-white border border-slate-200/80 shadow-2xs flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {initial}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-slate-900 truncate">
                  {userName}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0" title="Sesi Terverifikasi" />
              </div>
              <div className="text-[10px] font-mono text-slate-400 truncate">
                NIK: {nikMasked}
              </div>
            </div>
          </div>

          {/* Tombol Keluar Sistem */}
          <button
            type="button"
            onClick={() => {
              onCloseMobile();
              onOpenLogout();
            }}
            className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-rose-200 text-rose-700 bg-rose-50/60 hover:bg-rose-100/80 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 focus-visible:outline-2 focus-visible:outline-rose-600 shadow-2xs"
          >
            <LogOut className="w-4 h-4 text-rose-600" />
            <span>Keluar Sistem</span>
          </button>
        </div>
      </aside>
    </>
  );
}
