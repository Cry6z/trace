import React from 'react';
import { ReportStatus, STATUS_CONFIG } from '@/lib/types';

interface StatusBadgeProps {
  status: ReportStatus;
  size?: 'sm' | 'md';
  showDot?: boolean;
  className?: string;
}

export default function StatusBadge({
  status,
  size = 'sm',
  showDot = true,
  className = '',
}: StatusBadgeProps) {
  const meta = STATUS_CONFIG[status] || STATUS_CONFIG.pending;
  const sizeClasses = size === 'md' ? 'text-xs px-3 py-1' : 'text-[10px] sm:text-[11px] px-2.5 py-0.5';

  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full font-bold border transition-colors ${meta.bg} ${meta.text} ${sizeClasses} ${className}`}
    >
      {showDot && <span className={`w-1.5 h-1.5 rounded-full shrink-0 ${meta.dot}`} />}
      <span>{meta.label}</span>
    </span>
  );
}
