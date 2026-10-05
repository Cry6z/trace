import React, { useRef, useState, useEffect } from 'react';
import { ChevronDown, Check, X } from 'lucide-react';
import { Report, IssueCategory, CATEGORIES_CONFIG, STATUS_OPTIONS } from '@/lib/types';
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
  const [isCategoryOpen, setIsCategoryOpen] = useState<boolean>(false);
  const [isStatusOpen, setIsStatusOpen] = useState<boolean>(false);
  const categoryRef = useRef<HTMLDivElement>(null);
  const statusRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(e.target as Node)) {
        setIsCategoryOpen(false);
      }
      if (statusRef.current && !statusRef.current.contains(e.target as Node)) {
        setIsStatusOpen(false);
      }
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsCategoryOpen(false);
        setIsStatusOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  return (
    <div className="absolute top-3 sm:top-4 inset-x-3 sm:inset-x-4 z-20 pointer-events-none flex flex-wrap items-center justify-between gap-2">
      {/* Left: Unified Filter Controls Pill */}
      <div className="pointer-events-auto flex items-center gap-1 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-md shadow-slate-900/5 p-1 rounded-full">
        {/* Category Dropdown Pill */}
        <div className="relative" ref={categoryRef}>
          <button
            type="button"
            onClick={() => {
              setIsCategoryOpen(!isCategoryOpen);
              setIsStatusOpen(false);
            }}
            className={`h-7 sm:h-7.5 px-3 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedCategory !== 'all'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100/70'
            }`}
          >
            <span
              className="w-2 h-2 rounded-full inline-block shrink-0"
              style={{
                backgroundColor:
                  selectedCategory === 'all'
                    ? '#3b82f6'
                    : CATEGORIES_CONFIG[selectedCategory as IssueCategory]?.colorHex || '#3b82f6',
              }}
            />
            <span className="truncate max-w-24 sm:max-w-36">
              {selectedCategory === 'all'
                ? 'Semua Isu'
                : CATEGORIES_CONFIG[selectedCategory as IssueCategory]?.name || selectedCategory}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                isCategoryOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Kategori */}
          {isCategoryOpen && (
            <div className="absolute top-full left-0 mt-2 w-60 sm:w-64 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/10 p-1.5 z-30 animate-in fade-in duration-100">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Kategori
              </div>

              {/* Option: Semua Isu */}
              <button
                type="button"
                onClick={() => {
                  onSelectCategory('all');
                  setIsCategoryOpen(false);
                }}
                className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                  selectedCategory === 'all'
                    ? 'bg-blue-50 font-semibold text-blue-700'
                    : 'text-slate-600 hover:bg-slate-50'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-blue-600 inline-block shrink-0" />
                  <span>Semua Isu</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <span className="text-[10px] text-slate-400">{reports.length}</span>
                  {selectedCategory === 'all' && (
                    <Check className="w-3.5 h-3.5 text-blue-600" />
                  )}
                </div>
              </button>

              <div className="my-1 border-t border-slate-100" />

              {/* Individual Categories */}
              <div className="max-h-60 overflow-y-auto space-y-0.5">
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
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        <span
                          className="w-2 h-2 rounded-full inline-block shrink-0"
                          style={{ backgroundColor: cat.colorHex }}
                        />
                        <span className="truncate">{cat.name}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400">{count}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        <span className="w-px h-4 bg-slate-200" />

        {/* Status Dropdown Pill */}
        <div className="relative" ref={statusRef}>
          <button
            type="button"
            onClick={() => {
              setIsStatusOpen(!isStatusOpen);
              setIsCategoryOpen(false);
            }}
            className={`h-7 sm:h-7.5 px-3 rounded-full text-xs font-medium transition-all flex items-center gap-1.5 ${
              selectedStatus !== 'all'
                ? 'bg-blue-50 text-blue-700 font-semibold'
                : 'text-slate-700 hover:bg-slate-100/70'
            }`}
          >
            {selectedStatus !== 'all' && (
              <span
                className={`w-2 h-2 rounded-full inline-block shrink-0 ${
                  STATUS_OPTIONS.find((s) => s.id === selectedStatus)?.dotClass || 'bg-slate-400'
                }`}
              />
            )}
            <span className="truncate max-w-24 sm:max-w-32">
              {selectedStatus === 'all'
                ? 'Semua Status'
                : STATUS_OPTIONS.find((s) => s.id === selectedStatus)?.label || selectedStatus}
            </span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-slate-400 transition-transform duration-150 ${
                isStatusOpen ? 'rotate-180 text-blue-600' : ''
              }`}
            />
          </button>

          {/* Dropdown Menu Status */}
          {isStatusOpen && (
            <div className="absolute top-full left-0 mt-2 w-52 sm:w-56 bg-white/98 backdrop-blur-md rounded-2xl border border-slate-200/80 shadow-xl shadow-slate-900/10 p-1.5 z-30 animate-in fade-in duration-100">
              <div className="px-2.5 py-1 text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                Status
              </div>

              <div className="space-y-0.5">
                {STATUS_OPTIONS.map((opt) => {
                  const isSelected = selectedStatus === opt.id;
                  const count =
                    opt.id === 'all'
                      ? reports.length
                      : reports.filter((r) => r.status === opt.id).length;

                  return (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => {
                        onSelectStatus(opt.id);
                        setIsStatusOpen(false);
                      }}
                      className={`w-full px-2.5 py-1.5 rounded-xl text-left text-xs flex items-center justify-between transition-colors ${
                        isSelected
                          ? 'bg-slate-100 font-semibold text-slate-900'
                          : 'text-slate-600 hover:bg-slate-50'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate mr-2">
                        <span className={`w-2 h-2 rounded-full inline-block shrink-0 ${opt.dotClass}`} />
                        <span className="truncate">{opt.label}</span>
                      </div>
                      <div className="flex items-center gap-1.5 shrink-0">
                        <span className="text-[10px] text-slate-400">{count}</span>
                        {isSelected && <Check className="w-3.5 h-3.5 text-slate-900" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Minimalist Reset Button */}
        {(selectedCategory !== 'all' || selectedStatus !== 'all') && (
          <button
            type="button"
            onClick={() => {
              onSelectCategory('all');
              onSelectStatus('all');
            }}
            className="h-7 px-2 rounded-full text-[11px] font-semibold text-rose-600 hover:bg-rose-50 transition-colors flex items-center gap-0.5"
            title="Reset Filter"
          >
            <X className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset</span>
          </button>
        )}
      </div>

      {/* Right: Unified Map View & Live Counter Pill */}
      <div className="pointer-events-auto flex items-center gap-1.5 bg-white/95 backdrop-blur-xl border border-slate-200/80 shadow-md shadow-slate-900/5 p-1 rounded-full">
        <MapTypeSwitch mapType={mapType} onChange={onMapTypeChange} />

        <div className="px-2.5 py-1 text-xs text-slate-600 flex items-center gap-1.5 font-medium">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="font-semibold text-slate-800">{filteredCount}</span>
          <span className="text-slate-400 hidden sm:inline">Laporan</span>
        </div>
      </div>
    </div>
  );
}
