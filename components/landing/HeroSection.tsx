import React from 'react';
import Link from 'next/link';
import {
  FileText,
  ArrowRight,
  Maximize2,
  Shield,
  Eye,
  CheckCircle,
} from 'lucide-react';

interface HeroSectionProps {
  totalReports?: number;
}

export default function HeroSection({ totalReports = 6 }: HeroSectionProps) {
  return (
    <div className="flex flex-col justify-center space-y-7">
      <div className="space-y-5">
        
        {/* Headline */}
        <h1 className="text-3xl sm:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-extrabold tracking-tight text-slate-900 leading-[1.14]">
          Pantau dan Laporkan Fasilitas Publik di Sekitar Anda
        </h1>

        {/* Narrative Description */}
        <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
          Platform terbuka warga Kota Bengkulu untuk mengawal perbaikan jalan, penerangan umum, kebersihan, dan drainase lingkungan secara transparan dan terverifikasi.
        </p>

        {/* Primary & Secondary Actions */}
        <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Link
            href="/dashboard/buat-laporan"
            className="inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all"
          >
            <FileText className="w-4 h-4 text-blue-100" />
            <span>Laporkan Masalah Sekarang</span>
            <ArrowRight className="w-4 h-4 text-blue-200" />
          </Link>

          <Link
            href="/peta"
            className="inline-flex items-center justify-center gap-2 px-5 py-3.5 rounded-full bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all"
          >
            <Maximize2 className="w-4 h-4 text-slate-500" />
            <span>Mode Peta Penuh</span>
          </Link>
        </div>

      </div>

      {/* Civic Reassurance Strip */}
      <div className="pt-6 border-t border-slate-200/80 flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-slate-500">
        <div className="flex items-center gap-1.5">
          <Eye className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Akses Terbuka</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">·</span>
        <div className="flex items-center gap-1.5">
          <Shield className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>Sensor NIK Otomatis</span>
        </div>
        <span className="text-slate-300 hidden sm:inline">·</span>
        <div className="flex items-center gap-1.5">
          <CheckCircle className="w-3.5 h-3.5 text-slate-400 shrink-0" />
          <span>{totalReports} Titik Terpantau</span>
        </div>
      </div>
    </div>
  );
}


