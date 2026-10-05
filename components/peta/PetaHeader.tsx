'use client';

import React, { useState } from 'react';
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
  const [mobileSearchOpen, setMobileSearchOpen] = useState(false);

  return (
    <header className="bg-white border-b border-slate-200/80 z-30 shrink-0 shadow-2xs">
      <div className="h-16 px-3 sm:px-6 flex items-center justify-between gap-2">
        {/* Brand & Back Button */}
        <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
          <Link
            href="/"
            className="min-w-[40px] min-h-[40px] p-2 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            title="Kembali ke Beranda"
            aria-label="Kembali ke Beranda"
          >
            <ArrowLeft className="w-5 h-5" />
          </Link>

          <Link href="/" className="flex items-center gap-2 group focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg">
            <div className="w-8 h-8 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800/20 shrink-0 group-hover:scale-105 transition-transform">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={32}
                height={32}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="hidden xs:flex items-center">
              <span className="font-bold text-base sm:text-lg tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                TRACE
              </span>
              <span className="text-[10px] text-blue-600 font-semibold uppercase ml-1.5 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200 hidden sm:inline-block">
                Peta Penuh
              </span>
            </div>
          </Link>
        </div>

        {/* Center Search Input (Desktop & Tablet) */}
        <div className="hidden md:flex items-center flex-1 max-w-md mx-4 lg:mx-6">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Cari isu, jalan, atau kelurahan di Bengkulu..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-10 pr-9 py-2 rounded-xl border border-slate-200 bg-slate-50/70 text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Hapus pencarian"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Right Action Buttons */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Mobile Search Toggle Button */}
          <button
            type="button"
            onClick={() => setMobileSearchOpen((prev) => !prev)}
            className="md:hidden min-w-9.5 min-h-[38px] p-2 rounded-xl text-slate-600 hover:text-slate-900 hover:bg-slate-100 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            title="Cari Laporan"
            aria-label="Cari Laporan"
          >
            {mobileSearchOpen ? <X className="w-4 h-4 text-blue-600" /> : <Search className="w-4 h-4" />}
          </button>

          {/* Mobile Tab Switcher */}
          <div className="flex md:hidden bg-slate-100 p-1 rounded-xl">
            <button
              type="button"
              onClick={() => onMobileTabChange('map')}
              className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                mobileTab === 'map' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <MapIcon className="w-3.5 h-3.5" />
              <span>Peta</span>
            </button>
            <button
              type="button"
              onClick={() => onMobileTabChange('sidebar')}
              className={`min-h-[34px] px-2.5 py-1 rounded-lg text-xs font-semibold flex items-center gap-1 transition-all ${
                mobileTab === 'sidebar' ? 'bg-white text-blue-600 shadow-xs' : 'text-slate-600'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Daftar ({totalFilteredReports})</span>
            </button>
          </div>

          <Link
            href="/dashboard/buat-laporan"
            className="inline-flex items-center gap-1.5 px-3 sm:px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <PlusCircle className="w-4 h-4 shrink-0" />
            <span className="hidden sm:inline">Lapor Isu</span>
          </Link>
        </div>
      </div>

      {/* Expandable Mobile Search Bar */}
      {mobileSearchOpen && (
        <div className="md:hidden px-3.5 pb-3 pt-1 border-t border-slate-100 bg-slate-50/80 animate-in slide-in-from-top-1 duration-150">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              autoFocus
              placeholder="Cari isu, jalan, atau kelurahan..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="w-full pl-9 pr-8 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-2.5 top-2 text-slate-400 hover:text-slate-600 p-1"
                aria-label="Hapus kata kunci"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
