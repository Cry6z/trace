'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  MapPin,
  Home,
  LogOut,
  X,
  ChevronRight
} from 'lucide-react';
import { OfficerProfile } from './AdminLoginForm';

interface AdminSidebarProps {
  statusFilter: string;
  onStatusChange: (status: string) => void;
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
  statusFilter,
  onStatusChange,
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
      id: 'all',
      label: 'Semua Pengaduan',
      desc: 'Seluruh arsip masuk',
      icon: FileText,
      count: totalCount,
      countColor: 'bg-slate-100 text-slate-700',
    },
    {
      id: 'pending',
      label: 'Menunggu Verifikasi',
      desc: 'Antrean butuh validasi',
      icon: Clock,
      count: pendingCount,
      countColor: 'bg-amber-100 text-amber-800',
    },
    {
      id: 'in_progress',
      label: 'Sedang Ditangani',
      desc: 'Tindakan tim lapangan',
      icon: Wrench,
      count: inProgressCount,
      countColor: 'bg-blue-100 text-blue-800',
    },
    {
      id: 'resolved',
      label: 'Tuntas Selesai',
      desc: 'Perbaikan terverifikasi',
      icon: CheckCircle2,
      count: resolvedCount,
      countColor: 'bg-emerald-100 text-emerald-800',
    },
  ];

  return (
    <>
      {/* Backdrop Mobile Drawer */}
      {isMobileOpen && (
        <div
          role="presentation"
          onClick={onCloseMobile}
          className="fixed inset-0 z-40 bg-slate-950/60 backdrop-blur-xs md:hidden animate-in fade-in duration-200"
        />
      )}

      {/* Sidebar Admin Utama: h-dvh & max-w-[85vw] untuk ponsel */}
      <aside
        aria-label="Navigasi Menu Petugas Dinas"
        className={`fixed top-0 bottom-0 left-0 z-50 w-72 max-w-[85vw] h-dvh bg-slate-900 text-slate-200 border-r border-slate-800 flex flex-col transition-transform duration-300 ease-in-out md:translate-x-0 ${
          isMobileOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'
        }`}
      >
        {/* 1. Header Sidebar: Logo & Label Petugas Dinas */}
        <div className="h-18 sm:h-20 px-5 sm:px-6 border-b border-slate-800/80 flex items-center justify-between shrink-0">
          <Link
            href="/"
            className="flex items-center gap-3 group focus-visible:outline-2 focus-visible:outline-blue-500 rounded-xl"
          >
            <div className="w-10 h-10 rounded-2xl bg-slate-950 overflow-hidden flex items-center justify-center shadow-lg border border-slate-800 shrink-0 group-hover:scale-105 transition-transform">
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
                <span className="text-base font-extrabold tracking-tight text-white group-hover:text-blue-400 transition-colors">
                  TRACE
                </span>
                <span className="text-[10px] font-bold text-amber-300 bg-amber-950/80 px-1.5 py-0.5 rounded border border-amber-800">
                  Panel Dinas
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-medium">
                Kota Bengkulu
              </span>
            </div>
          </Link>

          {/* Tombol Tutup Mobile */}
          <button
            type="button"
            onClick={onCloseMobile}
            className="md:hidden w-10 h-10 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-500"
            aria-label="Tutup menu admin"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* 2. Menu Navigasi Filter & Manajemen (Scrollable & min-h-0) */}
        <div className="flex-1 min-h-0 overflow-y-auto px-4 py-4 sm:py-6 space-y-6">
          {/* Kelompok Menu Pengaduan */}
          <div className="space-y-1.5">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Filter Penanganan Dinas
            </div>

            {MENU_ITEMS.map((item) => {
              const isActive = statusFilter === item.id;
              const Icon = item.icon;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    onStatusChange(item.id);
                    onCloseMobile();
                  }}
                  className={`w-full text-left min-h-11.5 px-3.5 py-2.5 rounded-2xl transition-all flex items-center justify-between group focus-visible:outline-2 focus-visible:outline-blue-500 active:scale-98 ${
                    isActive
                      ? 'bg-blue-600 text-white font-bold shadow-md shadow-blue-600/20'
                      : 'text-slate-300 hover:bg-slate-800/80 hover:text-white font-medium'
                  }`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 transition-colors ${
                        isActive
                          ? 'bg-white/20 text-white'
                          : 'bg-slate-800 text-slate-400 group-hover:text-slate-200'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-xs sm:text-sm leading-tight truncate">
                        {item.label}
                      </div>
                      <div className="text-[11px] opacity-70 font-normal leading-tight mt-0.5 truncate hidden sm:block">
                        {item.desc}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full shrink-0 ${
                      isActive ? 'bg-white text-blue-900' : item.countColor
                    }`}
                  >
                    {item.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Kelompok Navigasi GIS & Publik */}
          <div className="space-y-1.5 pt-3 border-t border-slate-800">
            <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              Peta & Publik
            </div>

            <Link
              href="/peta"
              onClick={onCloseMobile}
              className="min-h-11 px-3.5 py-2 rounded-2xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between group text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0">
                  <MapPin className="w-4 h-4" />
                </div>
                <span>Peta GIS Wilayah</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </Link>

            <Link
              href="/"
              onClick={onCloseMobile}
              className="min-h-11 px-3.5 py-2 rounded-2xl text-slate-300 hover:bg-slate-800 hover:text-white transition-colors flex items-center justify-between group text-xs sm:text-sm font-medium focus-visible:outline-2 focus-visible:outline-blue-500"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-800 text-slate-400 group-hover:text-white flex items-center justify-center shrink-0">
                  <Home className="w-4 h-4" />
                </div>
                <span>Portal Publik</span>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-500 group-hover:text-slate-300" />
            </Link>
          </div>
        </div>

        {/* 3. Footer Sidebar: Profil Petugas & Log Out (Safe Area Bottom) */}
        <div className="p-4 pb-[max(1.25rem,env(safe-area-inset-bottom))] border-t border-slate-800 bg-slate-950/60 shrink-0 space-y-3">
          {/* Card Info Petugas Dinas */}
          <div className="p-3 rounded-2xl bg-slate-900 border border-slate-800 flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0">
              {officer.nama.charAt(0)}
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-bold text-white truncate">
                  {officer.nama}
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" title="Petugas Aktif" />
              </div>
              <div className="text-[10px] text-slate-400 font-mono truncate">
                NIP: {officer.nip}
              </div>
              <div className="text-[10px] text-blue-400 truncate leading-tight mt-0.5">
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
            className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-rose-900/60 text-rose-300 bg-rose-950/40 hover:bg-rose-900/60 text-xs font-bold transition-all flex items-center justify-center gap-2 active:scale-98 focus-visible:outline-2 focus-visible:outline-rose-500 shadow-2xs"
          >
            <LogOut className="w-4 h-4" />
            <span>Log Out Petugas</span>
          </button>
        </div>
      </aside>
    </>
  );
}
