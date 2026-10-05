import React from 'react';
import { UrgencyLevel } from '@/lib/types';

interface UrgencySelectorProps {
  urgency: UrgencyLevel;
  onUrgencyChange: (lvl: UrgencyLevel) => void;
}

const URGENCIES: UrgencyLevel[] = ['rendah', 'sedang', 'tinggi', 'darurat'];

export default function UrgencySelector({
  urgency,
  onUrgencyChange,
}: UrgencySelectorProps) {
  return (
    <div>
      <label className="block text-[11px] font-semibold text-slate-600 mb-1.5">
        Tingkat Urgensi Penanganan
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2" role="radiogroup" aria-label="Tingkat Urgensi Penanganan">
        {URGENCIES.map((lvl) => (
          <button
            key={lvl}
            type="button"
            role="radio"
            aria-checked={urgency === lvl}
            onClick={() => onUrgencyChange(lvl)}
            className={`min-h-11 py-2.5 px-3 rounded-xl text-xs font-bold uppercase transition-all focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 ${
              urgency === lvl
                ? lvl === 'darurat'
                  ? 'bg-rose-600 text-white shadow-sm'
                  : 'bg-blue-600 text-white shadow-sm'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            {lvl}
          </button>
        ))}
      </div>
    </div>
  );
}
