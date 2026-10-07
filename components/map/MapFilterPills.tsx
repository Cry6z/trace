'use client';

import React, { useState, useRef, useEffect } from 'react';
import { ChevronDown, SlidersHorizontal, Check, X } from 'lucide-react';
import { Report, CATEGORIES_CONFIG, IssueCategory } from '@/lib/types';
import MapTypeSwitch from './MapTypeSwitch';

interface MapFilterPillsProps {
  reports: Report[];
  filteredCount: number;
  selectedCategory: string;
  onSelectCategory: (cat: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
  mapType: 'street' | 'satellite';
  onMapTypeChange: (type: 'street' | 'satellite') => void;
}

export default function MapFilterPills({
  reports,
  filteredCount,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
  mapType,
  onMapTypeChange,
}: MapFilterPillsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const isFilterActive = selectedCategory !== 'all' || selectedStatus !== 'all';
  const activeCatConfig =
    selectedCategory !== 'all'
      ? CATEGORIES_CONFIG[selectedCategory as IssueCategory]
      : null;

  // Click outside to dismiss dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('touchstart', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [isOpen]);

  const handleReset = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSelectCategory('all');
    onSelectStatus('all');
    setIsOpen(false);
  };

  return (
    <div className="absolute top-2.5 sm:top-3 inset-x-2.5 sm:inset-x-4 z-20 pointer-events-auto flex items-center justify-between gap-2">
      {/* Sisi Kiri: Dropdown Filter Kategori Compact */}
      <div className="relative shrink-0 flex items-center gap-1.5" ref={dropdownRef}>
        {/* Tombol Pemicu Dropdown */}
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className={`h-9 px-3 rounded-xl border shadow-md flex items-center gap-1.5 text-xs font-bold transition-all active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 ${
            selectedCategory === 'all'
              ? 'bg-white/95 backdrop-blur-md border-slate-200/90 text-slate-800 hover:bg-slate-50 shadow-slate-900/5'
              : 'bg-slate-900 border-slate-800 text-white shadow-slate-900/15'
          }`}
          aria-expanded={isOpen}
          title="Filter Kategori Laporan"
        >
          {selectedCategory === 'all' ? (
            <>
              <SlidersHorizontal className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="truncate max-w-28 sm:max-w-none">Kategori</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-blue-50 text-blue-600 font-mono font-bold shrink-0">
                {reports.length}
              </span>
            </>
          ) : (
            <>
              <span
                className="w-2 h-2 rounded-full shrink-0 animate-pulse"
                style={{ backgroundColor: activeCatConfig?.colorHex }}
              />
              <span className="truncate max-w-25 sm:max-w-none">
                {activeCatConfig?.name.split(' ')[0]}
              </span>
              <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-white/20 text-white font-mono font-bold shrink-0">
                {filteredCount}
              </span>
            </>
          )}
          <ChevronDown
            className={`w-3.5 h-3.5 transition-transform duration-200 shrink-0 ${
              selectedCategory === 'all' ? 'text-slate-400' : 'text-slate-300'
            } ${isOpen ? 'rotate-180' : ''}`}
          />
        </button>

        {/* Tombol Reset Cepat (Bila Filter Sedang Aktif) */}
        {isFilterActive && (
          <button
            type="button"
            onClick={handleReset}
            className="w-9 h-9 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200/90 text-slate-400 hover:text-rose-600 hover:bg-rose-50 flex items-center justify-center shadow-md shadow-slate-900/5 transition-all active:scale-95"
            title="Reset ke Semua Kategori"
            aria-label="Reset ke Semua Kategori"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}

        {/* Menu Dropdown Mengambang dengan Animasi Spring */}
        {isOpen && (
          <div className="dropdown-spring-enter absolute top-full left-0 mt-2 w-60 sm:w-64 bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.16)] rounded-2xl p-1.5 z-40">
            <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100/90 flex items-center justify-between">
              <span>Pilih Kategori</span>
              <span className="font-mono text-slate-500">{reports.length} Total</span>
            </div>

            <div className="mt-1 space-y-0.5 max-h-64 overflow-y-auto pr-0.5 no-scrollbar">
              {/* Pilihan: Semua Kategori */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  setIsOpen(false);
                }}
                className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                    : 'text-slate-700 hover:bg-slate-100/90'
                }`}
              >
                <div className="flex items-center gap-2 transition-transform duration-150 group-hover:translate-x-1">
                  <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0 shadow-xs" />
                  <span>Semua Kategori</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold group-hover:bg-white transition-colors">
                    {reports.length}
                  </span>
                  {selectedCategory === 'all' && (
                    <Check className="w-3.5 h-3.5 text-blue-600 active-dot-pop shrink-0" />
                  )}
                </div>
              </button>

              {/* Pilihan per Kategori */}
              {Object.values(CATEGORIES_CONFIG).map((cat) => {
                const isSelected = selectedCategory === cat.id;
                const count = reports.filter((r) => r.category === cat.id).length;
                return (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => {
                      onSelectCategory(cat.id);
                      setIsOpen(false);
                    }}
                    className={`group w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                      isSelected
                        ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                        : 'text-slate-700 hover:bg-slate-100/90'
                    }`}
                  >
                    <div className="flex items-center gap-2 transition-transform duration-150 group-hover:translate-x-1">
                      <span
                        className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                        style={{ backgroundColor: cat.colorHex }}
                      />
                      <span>{cat.name}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded-md bg-slate-100 text-slate-600 font-bold group-hover:bg-white transition-colors">
                        {count}
                      </span>
                      {isSelected && (
                        <Check className="w-3.5 h-3.5 text-blue-600 active-dot-pop shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      {/* Sisi Kanan: Map Type Switch (Jalan / Satelit) */}
      <div className="shrink-0 bg-white/95 backdrop-blur-md p-0.5 rounded-xl border border-slate-200/90 shadow-md shadow-slate-900/5 transition-transform active:scale-95">
        <MapTypeSwitch mapType={mapType} onChange={onMapTypeChange} />
      </div>
    </div>
  );
}
