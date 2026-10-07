'use client';

import React from 'react';
import { Search, X, Filter, RotateCcw } from 'lucide-react';
import { IssueCategory, CATEGORIES_CONFIG } from '@/lib/types';

interface MonitoringFilterBarProps {
  searchQuery: string;
  onSearchChange: (q: string) => void;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  filteredCount: number;
  totalCount: number;
  onResetFilters: () => void;
  onRefresh: () => void;
  isRefreshing?: boolean;
}

export default function MonitoringFilterBar({
  searchQuery,
  onSearchChange,
  selectedCategory,
  onSelectCategory,
  filteredCount,
  totalCount,
  onResetFilters,
  onRefresh,
  isRefreshing = false,
}: MonitoringFilterBarProps) {
  const isFiltered = searchQuery.trim() !== '' || selectedCategory !== 'all';

  return (
    <div className="bg-white rounded-3xl p-5 sm:p-6 border border-slate-200/80 shadow-xs space-y-4">
      {/* Baris Atas: Input Pencarian & Dropdown Kategori & Refresh */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 sm:gap-4">
        {/* Kolom Pencarian */}
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Cari kode tiket (TRC-...), judul, atau lokasi..."
            className="w-full min-h-11 pl-10 pr-9 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 focus:border-transparent transition-all"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600"
              aria-label="Hapus teks pencarian"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Filter Kategori & Tombol Aksi */}
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap sm:flex-nowrap">
          {/* Dropdown Kategori */}
          <div className="relative min-w-42.5 flex-1 sm:flex-initial">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Filter className="w-3.5 h-3.5" />
            </div>
            <select
              value={selectedCategory}
              onChange={(e) => onSelectCategory(e.target.value)}
              aria-label="Filter berdasarkan kategori masalah"
              className="w-full min-h-11 pl-9 pr-8 py-2.5 rounded-2xl bg-slate-50 border border-slate-200/90 text-xs sm:text-sm text-slate-800 font-medium focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer appearance-none transition-all"
            >
              <option value="all">Semua Kategori</option>
              {Object.keys(CATEGORIES_CONFIG).map((key) => (
                <option key={key} value={key}>
                  {CATEGORIES_CONFIG[key as IssueCategory].name}
                </option>
              ))}
            </select>
            <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400">
              <span className="text-[10px]">▼</span>
            </div>
          </div>

          {/* Tombol Segarkan / Refresh Progres */}
          <button
            type="button"
            onClick={onRefresh}
            disabled={isRefreshing}
            className="min-h-11 px-3.5 py-2 rounded-2xl border border-slate-200 text-slate-600 hover:text-blue-600 hover:bg-slate-50 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600"
            title="Segarkan status pengaduan terbaru"
          >
            <RotateCcw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
            <span className="hidden xs:inline">Segarkan</span>
          </button>

          {/* Reset Filter Jika Aktif */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="min-h-11 px-3 py-2 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 hover:bg-rose-100 active:scale-95 transition-all text-xs font-semibold flex items-center gap-1"
              title="Reset seluruh filter pencarian"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>
      </div>

      {/* Baris Bawah: Status Count Indicator */}
      <div className="flex items-center justify-between text-xs text-slate-500 pt-2 border-t border-slate-100">
        <div className="flex items-center gap-2">
          <span>
            Menampilkan <strong className="text-slate-800">{filteredCount}</strong> dari{' '}
            <strong className="text-slate-800">{totalCount}</strong> laporan Anda
          </span>
          {isFiltered && (
            <span className="text-[10px] font-semibold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
              Filter Diterapkan
            </span>
          )}
        </div>
        <span className="text-[11px] text-slate-400 hidden sm:inline">
          Diperbarui secara real-time
        </span>
      </div>
    </div>
  );
}
