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
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-6">
      <div className="flex items-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-blue-600 text-white flex items-center justify-center font-bold text-xl shadow-md shadow-blue-500/20 shrink-0">
          <User className="w-8 h-8" />
        </div>

        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              {nama}
            </h1>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              <ShieldCheck className="w-3 h-3 text-emerald-600" />
              Warga Terverifikasi
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
            <span className="font-mono">NIK: {nikMasked}</span>
            <span>•</span>
            <span>No. HP: {phoneMasked}</span>
          </div>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/dashboard/buat-laporan"
          className="inline-flex items-center gap-2 px-5 py-3 rounded-2xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs shadow-md shadow-blue-500/20 active:scale-95 transition-all"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Laporan Baru</span>
        </Link>
      </div>
    </div>
  );
}
