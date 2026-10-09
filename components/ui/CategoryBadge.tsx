import React from 'react';
import { IssueCategory, CATEGORIES_CONFIG } from '@/lib/types';

interface CategoryBadgeProps {
  category: IssueCategory;
  size?: 'sm' | 'md';
  short?: boolean;
  className?: string;
}

export default function CategoryBadge({
  category,
  size = 'sm',
  short = false,
  className = '',
}: CategoryBadgeProps) {
  const meta = CATEGORIES_CONFIG[category] || CATEGORIES_CONFIG.jalan;
  const sizeClasses = size === 'md' ? 'text-xs px-2.5 py-1' : 'text-[10px] px-2 py-0.5';
  const displayName = short ? meta.name.split(' ')[0] : meta.name;

  return (
    <span
      className={`inline-flex items-center font-bold rounded-md text-white shadow-xs ${sizeClasses} ${className}`}
      style={{ backgroundColor: meta.colorHex }}
    >
      {displayName}
    </span>
  );
}
