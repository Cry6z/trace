import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, Search, X, Map as MapIcon, List, PlusCircle } from 'lucide-react';

interface PetaHeaderProps {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  mobileTab: 'map' | 'sidebar';
  onMobileTabChange: (tab: 'map' | 'sidebar') => void;
  totalFilteredReports: number;
}

export default function PetaHeader({
  searchQuery,
  onSearchChange,
  mobileTab,
  onMobileTabChange,
  totalFilteredReports,
}: PetaHeaderProps) {
  return (
    <header className="h-16 bg-white border-b border-slate-200/80 px-4 sm:px-6 flex items-center justify-between z-30 shrink-0 shadow-2xs">
      {/* Brand & Back Button */}
      <div className="flex items-center gap-3">
        <Link
          href="/"
          className="p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors"
          title="Kembali ke Beranda"
        >
          <ArrowLeft className="w-5 h-5" />
        </Link>

        <Link href="/" className="flex items-center gap-2.5 group">
          <div className="w-8 h-8 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800/20 shrink-0 group-hover:scale-105 transition-transform">
            <Image
              src="/logo.png"
              alt="TRACE Logo"
              width={32}
              height={32}
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              TRACE
            </span>
            <span className="text-[10px] text-blue-600 font-semibold uppercase ml-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200">
              Peta Penuh
            </span>
          </div>
        </Link>
      </div>

      {/* Center Search Input (Desktop) */}
      <div className="hidden md:flex items-center flex-1 max-w-md mx-6">
        <div className="relative w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Cari isu, alamat, atau kelurahan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-3 top-2.5 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </div>

      {/* Right Action Buttons */}
      <div className="flex items-center gap-2.5">
        {/* Mobile Tab Switcher */}
        <div className="flex md:hidden bg-slate-100 p-1 rounded-xl">
          <button
            type="button"
            onClick={() => onMobileTabChange('map')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              mobileTab === 'map' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Peta</span>
          </button>
          <button
            type="button"
            onClick={() => onMobileTabChange('sidebar')}
            className={`px-3 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 ${
              mobileTab === 'sidebar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
            }`}
          >
            <List className="w-3.5 h-3.5" />
            <span>Daftar ({totalFilteredReports})</span>
          </button>
        </div>

        <Link
          href="/dashboard/buat-laporan"
          className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors"
        >
          <PlusCircle className="w-4 h-4" />
          <span className="hidden sm:inline">Lapor Isu</span>
        </Link>
      </div>
    </header>
  );
}
