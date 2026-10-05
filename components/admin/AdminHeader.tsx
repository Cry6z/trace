import React from 'react';
import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function AdminHeader() {
  return (
    <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div className="space-y-1">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full bg-blue-100 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
            Portal Resmi Petugas
          </span>
          <span className="text-xs text-slate-400">•</span>
          <span className="text-xs text-slate-500 font-medium">Satgas Penanganan Kota</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
          Pusat Tindak Lanjut & Disposisi Laporan
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Verifikasi keabsahan laporan warga, disposisikan ke dinas terkait, dan laporkan bukti pekerjaan fisik.
        </p>
      </div>

      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-100 text-xs font-semibold transition-colors"
        >
          <MapPin className="w-4 h-4 text-blue-600" />
          <span>Lihat Peta Publik</span>
        </Link>
      </div>
    </div>
  );
}
