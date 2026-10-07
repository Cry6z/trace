'use client';

import React from 'react';
import Link from 'next/link';
import { User, ShieldCheck, PlusCircle } from 'lucide-react';

interface UserProfileBannerProps {
  nama: string;
  nikMasked: string;
  phoneMasked: string;
  totalReports: number;
  onOpenLogout?: () => void;
}

export default function UserProfileBanner({
  nama,
  nikMasked,
  phoneMasked,
  totalReports,
}: UserProfileBannerProps) {
  const initial = nama ? nama.charAt(0).toUpperCase() : 'W';

  return (
    <section
      aria-label="Informasi Profil Pengguna"
      className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-7 lg:p-9 border border-slate-200/80 shadow-xs transition-all hover:border-slate-300/80"
    >
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5 sm:gap-8">
        {/* Kolom Kiri: Profil & Kredensial Pengguna */}
        <div className="flex items-start sm:items-center gap-3.5 sm:gap-6 min-w-0">
          {/* Avatar Inisial Elegan */}
          <div className="w-12 h-12 sm:w-16 sm:h-16 lg:w-18 lg:h-18 rounded-2xl bg-linear-to-br from-blue-600 to-indigo-700 text-white flex items-center justify-center font-extrabold text-lg sm:text-2xl shadow-lg shadow-blue-600/20 ring-4 ring-blue-50 shrink-0">
            {initial}
          </div>

          <div className="space-y-1.5 sm:space-y-2 min-w-0 flex-1">
            {/* Nama & Badge Verifikasi */}
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="text-lg sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight truncate">
                {nama}
              </h1>
              <span className="inline-flex items-center gap-1 text-[11px] sm:text-xs font-semibold px-2.5 py-0.5 sm:py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Warga Terverifikasi</span>
              </span>
            </div>

            {/* Keterangan NIK & Nomor HP dengan Masking Privasi */}
            <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-1 text-xs text-slate-500">
              <span className="inline-flex items-center gap-1 font-mono text-slate-600">
                <span className="text-slate-400 font-sans">NIK:</span> {nikMasked}
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>
              <span className="inline-flex items-center gap-1 text-slate-600">
                <span className="text-slate-400">WhatsApp:</span> {phoneMasked}
              </span>
              <span className="text-slate-300 hidden sm:inline" aria-hidden="true">•</span>
              <span className="text-blue-600 font-medium bg-blue-50/80 px-2 py-0.5 rounded-md border border-blue-100">
                {totalReports} Pengaduan
              </span>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Tombol Aksi Tunggal (Buat Laporan Baru) */}
        <div className="flex items-center shrink-0 pt-2 lg:pt-0 border-t lg:border-t-0 border-slate-100 w-full sm:w-auto">
          <Link
            href="/dashboard/buat-laporan"
            className="w-full sm:w-auto min-h-11.5 inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span>Buat Laporan Baru</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
