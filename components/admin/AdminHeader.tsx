'use client';

import React from 'react';
import Link from 'next/link';
import { MapPin, LogOut, ShieldCheck, User } from 'lucide-react';
import { OfficerProfile } from './AdminLoginForm';

interface AdminHeaderProps {
  officer: OfficerProfile;
  onLogout: () => void;
}

export default function AdminHeader({ officer, onLogout }: AdminHeaderProps) {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
      {/* Title & Institutional Scope */}
      <div className="space-y-1.5 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
            <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />
            <span>Portal Petugas Dinas</span>
          </span>
          <span className="text-xs text-slate-300">•</span>
          <span className="text-xs text-emerald-700 font-semibold flex items-center gap-1">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Sesi Terautentikasi</span>
          </span>
        </div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pusat Tindak Lanjut & Disposisi Lapangan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 max-w-2xl">
          Verifikasi keabsahan laporan warga Kota Bengkulu, mulai pengerjaan teknis, dan terbitkan bukti foto tuntas.
        </p>
      </div>

      {/* Officer Profile Card & Logout Action */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 shrink-0 pt-3 lg:pt-0 border-t lg:border-t-0 border-slate-100">
        <div className="flex items-center gap-3 p-2.5 pr-4 rounded-2xl bg-slate-50 border border-slate-200/80">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
            <User className="w-5 h-5" />
          </div>
          <div className="min-w-0">
            <div className="font-extrabold text-xs text-slate-900 truncate">
              {officer.nama}
            </div>
            <div className="text-[10px] text-slate-500 truncate font-mono">
              NIP: {officer.nip}
            </div>
            <div className="text-[10px] text-blue-600 font-medium truncate">
              {officer.instansi}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Link
            href="/"
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors active:scale-95"
            title="Buka Peta Publik Warga"
          >
            <MapPin className="w-3.5 h-3.5 text-blue-600" />
            <span>Peta Publik</span>
          </Link>

          <button
            type="button"
            onClick={onLogout}
            className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 px-3.5 py-2.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 text-xs font-semibold transition-colors active:scale-95"
            title="Keluar dari sesi petugas"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar Sesi</span>
          </button>
        </div>
      </div>
    </div>
  );
}
