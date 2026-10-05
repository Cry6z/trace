import React from 'react';
import Link from 'next/link';
import { User, ShieldCheck, PlusCircle } from 'lucide-react';

interface UserProfileBannerProps {
  nama: string;
  nikMasked: string;
  phoneMasked: string;
}

export default function UserProfileBanner({
  nama,
  nikMasked,
  phoneMasked,
}: UserProfileBannerProps) {
  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 lg:p-8 border border-slate-200/80 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4 sm:gap-6">
      <div className="flex items-center gap-3.5 sm:gap-4">
        <div className="w-12 h-12 sm:w-14 sm:h-14 lg:w-16 lg:h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-lg sm:text-xl shadow-md shadow-blue-500/20 shrink-0">
          <User className="w-6 h-6 sm:w-7 sm:h-7" />
        </div>

        <div className="space-y-1 min-w-0">
          <div className="flex flex-wrap items-center gap-2">
            <h1 className="text-lg sm:text-xl md:text-2xl font-extrabold text-slate-900 tracking-tight truncate">
              {nama}
            </h1>
            <span className="inline-flex items-center gap-1 text-[10px] sm:text-[11px] font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              <span>Warga Terverifikasi</span>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-3 sm:gap-x-4 gap-y-0.5 text-xs text-slate-500">
            <span className="font-mono text-[11px] sm:text-xs">NIK: {nikMasked}</span>
            <span className="text-slate-300 hidden xs:inline">•</span>
            <span className="text-[11px] sm:text-xs">No. HP: {phoneMasked}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3 shrink-0">
        <Link
          href="/dashboard/buat-laporan"
          className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 px-5 py-2.5 sm:py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <PlusCircle className="w-4 h-4 shrink-0" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>
    </div>
  );
}
