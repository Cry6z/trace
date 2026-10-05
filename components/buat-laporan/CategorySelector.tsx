import React from 'react';
import { IssueCategory, CATEGORIES_CONFIG } from '@/lib/types';

interface CategorySelectorProps {
  selectedCategory: IssueCategory;
  onSelectCategory: (category: IssueCategory) => void;
}

export default function CategorySelector({
  selectedCategory,
  onSelectCategory,
}: CategorySelectorProps) {
  return (
    <div className="space-y-3">
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
        1. Pilih Kategori Masalah
      </label>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 sm:gap-3" role="radiogroup" aria-label="Pilih Kategori Masalah">
        {Object.values(CATEGORIES_CONFIG).map((cat) => {
          const isSelected = selectedCategory === cat.id;
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
              className={`p-3 sm:p-3.5 rounded-2xl border-2 cursor-pointer transition-all flex flex-col justify-between focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-98 ${
                isSelected
                  ? 'border-blue-600 bg-blue-50/40 shadow-xs'
                  : 'border-slate-200 hover:border-slate-300 bg-white'
              }`}
            >
              <div className="flex items-center gap-2 mb-1.5 sm:mb-2">
                <span
                  className="w-3 h-3 sm:w-3.5 sm:h-3.5 rounded-full shrink-0"
                  style={{ backgroundColor: cat.colorHex }}
                />
                <span className="text-xs font-bold text-slate-800 leading-snug">
                  {cat.name}
                </span>
              </div>
              <p className="text-[10px] sm:text-[11px] text-slate-500 line-clamp-2">
                {cat.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
