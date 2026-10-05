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
      <div className="grid grid-cols-4 gap-2">
        {URGENCIES.map((lvl) => (
          <button
            key={lvl}
            type="button"
            onClick={() => onUrgencyChange(lvl)}
            className={`py-2 px-3 rounded-xl text-xs font-bold uppercase transition-all ${
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
