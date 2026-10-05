'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Report, CATEGORIES_CONFIG, IssueCategory } from '@/lib/types';
import PetaReportCard from './PetaReportCard';
import { Filter, ChevronDown, Check, X } from 'lucide-react';

interface PetaReportListProps {
  reports: Report[];
  filteredReports: Report[];
  selectedReportId: string | null;
  onSelectReport: (report: Report) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function PetaReportList({
  reports,
  filteredReports,
  selectedReportId,
  onSelectReport,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
}: PetaReportListProps) {
  const [isCategoryOpen, setIsCategoryOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown on outside click or Escape key
  useEffect(() => {
    const handleOutsideClick = (e: MouseEvent | TouchEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsCategoryOpen(false);
    };

    document.addEventListener('mousedown', handleOutsideClick);
    document.addEventListener('touchstart', handleOutsideClick);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('mousedown', handleOutsideClick);
      document.removeEventListener('touchstart', handleOutsideClick);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const activeCategory =
    selectedCategory !== 'all'
      ? CATEGORIES_CONFIG[selectedCategory as IssueCategory]
      : null;

  return (
    <div className="h-full flex flex-col">
      {/* Compact Filter Header */}
      <div className="p-3 border-b border-slate-100 bg-white shrink-0 relative z-20 space-y-2">
        <div className="flex items-center gap-2">
          {/* Category Dropdown (Compact) */}
          <div className="relative flex-1" ref={dropdownRef}>
            <button
              type="button"
              onClick={() => setIsCategoryOpen(!isCategoryOpen)}
              className="w-full min-h-[38px] px-3.5 py-2 rounded-xl bg-slate-50 hover:bg-slate-100/90 border border-slate-200 text-xs font-semibold text-slate-800 flex items-center justify-between transition-colors shadow-2xs active:scale-98 focus-visible:outline-2 focus-visible:outline-blue-600"
              aria-expanded={isCategoryOpen}
              aria-haspopup="listbox"
            >
              <div className="flex items-center gap-2 truncate">
                {activeCategory ? (
                  <>
                    <span
                      className="w-2.5 h-2.5 rounded-full shrink-0"
                      style={{ backgroundColor: activeCategory.colorHex }}
                    />
                    <span className="truncate">{activeCategory.name}</span>
                  </>
                ) : (
                  <>
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-600 shrink-0" />
                    <span className="truncate">Semua Kategori ({reports.length})</span>
                  </>
                )}
              </div>
              <ChevronDown
                className={`w-4 h-4 text-slate-400 shrink-0 transition-transform duration-150 ${
                  isCategoryOpen ? 'rotate-180 text-blue-600' : ''
                }`}
              />
            </button>

            {/* Dropdown Menu Card */}
            {isCategoryOpen && (
              <div className="dropdown-spring-enter absolute left-0 right-0 top-full mt-2 bg-white/98 backdrop-blur-xl rounded-2xl border border-slate-200/90 shadow-[0_12px_36px_rgba(15,23,42,0.16)] p-1.5 z-30 space-y-0.5">
                {/* All Option */}
                <button
                  type="button"
                  onClick={() => {
                    onSelectCategory('all');
                    setIsCategoryOpen(false);
                  }}
                  className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                    selectedCategory === 'all'
                      ? 'bg-blue-50 text-blue-700 font-bold shadow-xs'
                      : 'text-slate-700 hover:bg-slate-100/90'
                  }`}
                >
                  <div className="flex items-center gap-2 transition-transform duration-150 group-hover:translate-x-1">
                    <span className="w-2 h-2 rounded-full bg-blue-600 shadow-xs" />
                    <span>Semua Kategori</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <span className="text-[11px] font-mono text-slate-400 group-hover:text-slate-600 font-bold">({reports.length})</span>
                    {selectedCategory === 'all' && <Check className="w-3.5 h-3.5 text-blue-600 active-dot-pop" />}
                  </div>
                </button>

                {/* Categories */}
                {Object.values(CATEGORIES_CONFIG).map((cat) => {
                  const count = reports.filter((r) => r.category === cat.id).length;
                  const isSelected = selectedCategory === cat.id;
                  return (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => {
                        onSelectCategory(cat.id);
                        setIsCategoryOpen(false);
                      }}
                      className={`group w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-semibold transition-all duration-150 active:scale-[0.98] ${
                        isSelected
                          ? 'bg-slate-900 text-white shadow-xs'
                          : 'text-slate-700 hover:bg-slate-100/90'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate transition-transform duration-150 group-hover:translate-x-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-xs"
                          style={{ backgroundColor: cat.colorHex }}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span
                          className={`text-[11px] font-mono ${
                            isSelected ? 'text-slate-300' : 'text-slate-400'
                          }`}
                        >
                          ({count})
                        </span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-white active-dot-pop" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Quick Reset if Active */}
          {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
            <button
              type="button"
              onClick={() => {
                onSelectCategory('all');
                onSelectStatus('all');
              }}
              className="min-h-[38px] px-3 py-2 rounded-xl text-xs font-bold text-rose-600 bg-rose-50 hover:bg-rose-100 transition-colors flex items-center gap-1 shrink-0 active:scale-95"
              title="Reset Semua Filter"
            >
              <X className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}
        </div>

        {/* Status Row (Compact) */}
        <div className="flex items-center justify-between text-xs text-slate-500 gap-2 overflow-x-auto no-scrollbar pt-0.5">
          <div className="flex items-center gap-1.5 shrink-0">
            <span className="text-[11px] font-semibold text-slate-400">Status:</span>
            <div className="flex items-center gap-1">
              {[
                { id: 'all', label: 'Semua' },
                { id: 'pending', label: 'Pending', dot: 'bg-amber-400' },
                { id: 'in_progress', label: 'Dikerjakan', dot: 'bg-blue-500' },
                { id: 'resolved', label: 'Selesai', dot: 'bg-emerald-500' },
              ].map((st) => (
                <button
                  key={st.id}
                  type="button"
                  onClick={() => onSelectStatus(st.id)}
                  className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all flex items-center gap-1 active:scale-95 ${
                    selectedStatus === st.id
                      ? 'bg-slate-900 text-white shadow-2xs'
                      : 'bg-slate-100/80 text-slate-600 hover:bg-slate-200/80'
                  }`}
                >
                  {st.dot && (
                    <span
                      className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                        selectedStatus === st.id ? 'bg-white' : st.dot
                      }`}
                    />
                  )}
                  <span>{st.label}</span>
                </button>
              ))}
            </div>
          </div>

          <span className="text-[11px] font-mono text-slate-400 shrink-0">
            {filteredReports.length} laporan
          </span>
        </div>
      </div>

      {/* Scrollable Report Card List */}
      <div className="flex-1 overflow-y-auto p-4 pb-24 md:pb-4 space-y-3 divide-y divide-slate-100">
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 px-4 space-y-3">
            <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
              <Filter className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-slate-800">
              Tidak Ada Laporan yang Cocok
            </h4>
            <p className="text-xs text-slate-500 max-w-xs mx-auto leading-relaxed">
              Tidak ditemukan laporan dengan filter kategori atau status ini. Anda dapat mereset filter untuk melihat seluruh laporan.
            </p>
            {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  onSelectStatus('all');
                }}
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-xs transition-colors"
              >
                <span>Reset Semua Filter</span>
              </button>
            )}
          </div>
        ) : (
          filteredReports.map((report) => (
            <PetaReportCard
              key={report.id}
              report={report}
              isSelected={selectedReportId === report.id}
              onSelect={onSelectReport}
            />
          ))
        )}
      </div>
    </div>
  );
}
