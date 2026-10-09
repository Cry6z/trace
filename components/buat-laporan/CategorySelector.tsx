'use client';

import React from 'react';
import { IssueCategory, CATEGORIES_CONFIG } from '@/lib/types';
import { Sparkles, Tag } from 'lucide-react';

interface CategorySelectorProps {
  selectedCategory: IssueCategory;
  onSelectCategory: (category: IssueCategory) => void;
  customCategory?: string;
  onCustomCategoryChange?: (val: string) => void;
}

const QUICK_SUGGESTIONS = [
  'Taman Kota',
  'Sarana Olahraga',
  'Rambu Roboh',
  'Pohon Lapuk / Tumbang',
  'Fasilitas Pasar',
  'Halte Rusak',
];

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
  customCategory = '',
  onCustomCategoryChange,
}: CategorySelectorProps) {
  // Aktifkan input kustom jika user memilih 'lainnya' atau 'fasilitas'
  const isCustomizable = selectedCategory === 'lainnya' || selectedCategory === 'fasilitas';

  return (
    <div className="space-y-3.5">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
          1. Pilih Kategori Masalah
        </label>
        <span className="text-[11px] font-semibold text-slate-500">
          Tersedia opsi kustom mandiri
        </span>
      </div>

      <div
        className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3"
        role="radiogroup"
        aria-label="Pilih Kategori Masalah"
      >
        {Object.values(CATEGORIES_CONFIG).map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const isLainnya = cat.id === 'lainnya';

          return (
            <div
              key={cat.id}
              tabIndex={0}
              role="radio"
              aria-checked={isSelected}
              onClick={() => onSelectCategory(cat.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectCategory(cat.id);
                }
              }}
              className={`p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-98 relative ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/50 shadow-xs ring-1 ring-blue-500/20'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              } ${isLainnya ? 'col-span-2 sm:col-span-1 border-dashed' : ''}`}
            >
              <div>
                <div className="flex items-center justify-between gap-1 mb-1.5 sm:mb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shrink-0 shadow-2xs"
                      style={{ backgroundColor: cat.colorHex }}
                    />
                    <span className="text-xs font-bold text-slate-900 leading-snug truncate">
                      {cat.name}
                    </span>
                  </div>
                  {isLainnya && (
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-teal-50 text-teal-700 border border-teal-200 shrink-0">
                      Kustom
                    </span>
                  )}
                </div>
                <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2">
                  {cat.description}
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Bagian Input Kategori Kustom Dinamis Saat Memilih 'Lainnya' atau 'Fasilitas' */}
      {isCustomizable && onCustomCategoryChange && (
        <div className="p-4 rounded-2xl bg-linear-to-br from-teal-50/70 via-white to-blue-50/50 border border-teal-200/90 shadow-2xs space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0 shadow-xs">
                <Sparkles className="w-3.5 h-3.5" />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-900 flex items-center gap-1.5">
                  <span>Nama Kategori Kustom Pilihan Anda</span>
                  <span className="text-rose-500">*</span>
                </label>
                <p className="text-[10px] text-slate-500">
                  Ketik nama kategori fasilitas spesifik yang ingin Anda laporkan
                </p>
              </div>
            </div>
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-teal-100 text-teal-800 shrink-0">
              Kustom Pengguna
            </span>
          </div>

          <div className="relative">
            <input
              type="text"
              value={customCategory}
              onChange={(e) => onCustomCategoryChange(e.target.value)}
              placeholder="Contoh: Taman Bermain Rusak, Rambu Roboh, Fasilitas Olahraga..."
              className="w-full px-3.5 py-2.5 rounded-xl border border-teal-300/80 bg-white text-xs font-semibold text-slate-900 placeholder:text-slate-400 placeholder:font-normal focus:ring-2 focus:ring-teal-500 focus:border-teal-500 outline-none transition-all shadow-2xs"
            />
          </div>

          {/* Quick Suggestions Chips */}
          <div className="flex items-center gap-1.5 flex-wrap pt-1">
            <span className="text-[10px] font-semibold text-teal-900 flex items-center gap-1">
              <Tag className="w-2.5 h-2.5 text-teal-600" />
              <span>Saran cepat:</span>
            </span>
            {QUICK_SUGGESTIONS.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => onCustomCategoryChange(tag)}
                className={`text-[10px] px-2 py-0.5 rounded-lg border transition-all cursor-pointer ${
                  customCategory === tag
                    ? 'bg-teal-600 text-white border-teal-600 font-bold'
                    : 'bg-white text-teal-800 border-teal-200 hover:bg-teal-50 hover:border-teal-300'
                }`}
              >
                +{tag}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
