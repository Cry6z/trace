import React from 'react';

interface MapTypeSwitchProps {
  mapType: 'street' | 'satellite';
  onChange: (type: 'street' | 'satellite') => void;
  className?: string;
}

export default function MapTypeSwitch({ mapType, onChange, className = '' }: MapTypeSwitchProps) {
  return (
    <div
      className={`flex items-center rounded-full bg-slate-100/90 p-0.5 border border-slate-200/60 ${className}`}
    >
      <button
        type="button"
        onClick={() => onChange('street')}
        className={`h-7 px-2.5 rounded-full font-medium text-xs transition-all flex items-center gap-1 ${
          mapType === 'street'
            ? 'bg-blue-600 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Peta Vektor Bersih"
      >
        <span>Peta</span>
      </button>
      <button
        type="button"
        onClick={() => onChange('satellite')}
        className={`h-7 px-2.5 rounded-full font-medium text-xs transition-all flex items-center gap-1 ${
          mapType === 'satellite'
            ? 'bg-blue-600 text-white shadow-xs font-semibold'
            : 'text-slate-600 hover:text-slate-900'
        }`}
        title="Citra Satelit Resolusi Tinggi"
      >
        <span>Satelit</span>
      </button>
    </div>
  );
}
