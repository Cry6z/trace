
import React from 'react';
import Link from 'next/link';
import { FileText, ArrowRight, Maximize2 } from 'lucide-react';

interface HeroSectionProps {
  totalReports?: number;
}

export default function HeroSection({ totalReports = 6 }: HeroSectionProps) {
  return (
    <div className="flex flex-col justify-center space-y-5 sm:space-y-6">
      <div className="space-y-4 sm:space-y-5">
        {/* Headline */}
        <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-[2.65rem] xl:text-[2.85rem] font-extrabold tracking-tight text-slate-900 leading-[1.18] sm:leading-[1.14]">
          Pantau dan Laporkan Fasilitas Publik di Sekitar Anda
        </h1>

        {/* Narrative Description */}
        <p className="text-xs sm:text-sm md:text-base text-slate-600 leading-relaxed font-normal max-w-xl">
          Platform terbuka warga Kota Bengkulu untuk mengawal perbaikan jalan, penerangan umum, kebersihan, dan drainase lingkungan secara transparan dan terverifikasi.
        </p>

        {/* Primary & Secondary Actions */}
        <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-2.5 sm:gap-3">
          <Link
            href="/dashboard/buat-laporan"
            className="min-h-11 inline-flex items-center justify-center gap-2 px-5 sm:px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-600/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600 group"
          >
            <FileText className="w-4 h-4 text-blue-100 shrink-0" />
            <span>Laporkan Masalah Sekarang</span>
            <ArrowRight className="w-4 h-4 text-blue-200 shrink-0 group-hover:translate-x-0.5 transition-transform" />
          </Link>

          <Link
            href="/peta"
            className="min-h-11 inline-flex items-center justify-center gap-2 px-4.5 sm:px-5 py-3 rounded-full bg-white hover:bg-slate-50 active:scale-95 text-slate-700 font-semibold text-xs sm:text-sm border border-slate-200 shadow-2xs transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <Maximize2 className="w-4 h-4 text-slate-500 shrink-0" />
            <span>Mode Peta Penuh</span>
          </Link>
        </div>
      </div>
    </div>
  );
}


