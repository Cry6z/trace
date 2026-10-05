import React from 'react';
import { Report } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { ThumbsUp } from 'lucide-react';

interface PetaReportCardProps {
  report: Report;
  isSelected: boolean;
  onSelect: (report: Report) => void;
}

export default function PetaReportCard({
  report,
  isSelected,
  onSelect,
}: PetaReportCardProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(report)}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          onSelect(report);
        }
      }}
      className={`pt-3 first:pt-0 cursor-pointer rounded-2xl p-3 transition-all focus-visible:outline-2 focus-visible:outline-blue-600 focus-visible:outline-offset-1 ${
        isSelected
          ? 'bg-blue-50/70 border border-blue-200 shadow-2xs'
          : 'hover:bg-slate-50 border border-transparent'
      }`}
    >
      <div className="flex gap-3">
        {/* Thumbnail */}
        <div className="w-20 h-20 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-full object-cover"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Info */}
        <div className="flex-1 min-w-0 space-y-1">
          <div className="flex items-center justify-between gap-1">
            <CategoryBadge category={report.category} short />
            <StatusBadge status={report.status} showDot={false} />
          </div>

          <h4 className="font-bold text-xs text-slate-900 leading-snug line-clamp-1">
            {report.title}
          </h4>

          <p className="text-[11px] text-slate-500 line-clamp-1">
            {report.address}
          </p>

          <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400">
            <span className="font-mono text-blue-600">{report.trackingCode}</span>
            <div className="flex items-center gap-1 font-semibold text-slate-600">
              <ThumbsUp className="w-3 h-3 text-slate-400" />
              <span>{report.upvotes}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
