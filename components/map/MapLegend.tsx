import React, { useState } from 'react';
import { Layers, ChevronDown } from 'lucide-react';
import { Report, CATEGORIES_CONFIG, LEGEND_SHORT_NAMES } from '@/lib/types';

interface MapLegendProps {
  reports: Report[];
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  className?: string;
}

export default function MapLegend({
  reports,
  selectedCategory,
  onSelectCategory,
  className = '',
}: MapLegendProps) {
  const [showLegend, setShowLegend] = useState<boolean>(true);

  return (
    <div className={`pointer-events-auto ${className}`}>
      <div className="bg-white/92 backdrop-blur-md rounded-xl border border-slate-200/70 p-2.5 shadow-md shadow-slate-900/5 transition-all w-44 sm:w-48">
        <div
          className={`flex items-center justify-between ${
            showLegend ? 'pb-1.5 border-b border-slate-100/80' : ''
          }`}
        >
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span className="text-xs font-semibold text-slate-800 tracking-tight">
              Legenda
            </span>
          </div>
          <button
            type="button"
            onClick={() => setShowLegend(!showLegend)}
            className="text-slate-400 hover:text-slate-600 p-0.5 rounded transition-colors"
            title={showLegend ? 'Kecilkan Legenda' : 'Buka Legenda'}
          >
            <ChevronDown
              className={`w-3.5 h-3.5 transition-transform duration-150 ${
                showLegend ? 'rotate-180' : ''
              }`}
            />
          </button>
        </div>

        {showLegend && (
          <div className="mt-1.5 space-y-0.5">
            {Object.values(CATEGORIES_CONFIG).map((cat) => {
              const count = reports.filter((r) => r.category === cat.id).length;
              const isSelected = selectedCategory === cat.id;
              const shortName = LEGEND_SHORT_NAMES[cat.id] || cat.name.split(' ')[0];

              return (
                <div
                  key={cat.id}
                  onClick={() =>
                    onSelectCategory(selectedCategory === cat.id ? 'all' : cat.id)
                  }
                  className={`flex items-center justify-between px-2 py-1 rounded-lg text-[11px] cursor-pointer transition-colors ${
                    isSelected
                      ? 'bg-slate-100/90 font-semibold text-slate-900 ring-1 ring-slate-200/50'
                      : 'hover:bg-slate-50 text-slate-600'
                  }`}
                >
                  <div className="flex items-center gap-1.5 truncate mr-1.5">
                    <span
                      className="w-1.5 h-1.5 rounded-full inline-block shrink-0"
                      style={{ backgroundColor: cat.colorHex }}
                    />
                    <span className="truncate">{shortName}</span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono shrink-0">
                    {count}
                  </span>
                </div>
              );
            })}

            <div className="pt-1.5 mt-1.5 border-t border-slate-100/80 flex items-center justify-between text-[10px] text-slate-400 px-0.5">
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-rose-500 animate-pulse inline-block" />
                <span>Baru</span>
              </div>
              <div className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
                <span>Tuntas</span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
