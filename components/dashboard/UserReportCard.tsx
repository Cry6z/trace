'use client';

import React from 'react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/ToastProvider';
import { Eye, MapPin, ArrowRight, Copy } from 'lucide-react';

interface UserReportCardProps {
  report: Report;
  onViewDetail: (report: Report) => void;
}

export default function UserReportCard({
  report,
  onViewDetail,
}: UserReportCardProps) {
  const { toast } = useToast();
  const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;
  const latestTimelineEvent = report.timeline[report.timeline.length - 1];

  const handleCopyCode = (e: React.MouseEvent) => {
    e.stopPropagation();
    navigator.clipboard.writeText(report.trackingCode);
    toast.copied('Kode Tiket Disalin', report.trackingCode);
  };

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-4 sm:space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          <span
            className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full shrink-0"
            style={{ backgroundColor: category.colorHex }}
          />
          <span className="text-xs font-bold text-slate-800">{category.name}</span>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="min-h-[34px] flex items-center gap-1.5 text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100 px-2.5 py-1 rounded-lg transition-colors group focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
            title="Salin Kode Tiket"
            aria-label={`Salin kode tiket ${report.trackingCode}`}
          >
            <span>{report.trackingCode}</span>
            <Copy className="w-3.5 h-3.5 opacity-60 group-hover:opacity-100" />
          </button>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2">
          <StatusBadge status={report.status} size="md" />
          <button
            type="button"
            onClick={() => onViewDetail(report)}
            className="min-w-[36px] min-h-[36px] p-2 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
            title="Buka Detail Lengkap"
            aria-label="Buka Detail Lengkap"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Content & Photo */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-5">
        <div className="w-full sm:w-44 md:w-48 h-40 sm:h-32 rounded-xl sm:rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
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

        <div className="flex-1 space-y-1.5 sm:space-y-2 min-w-0">
          <h3 className="font-bold text-sm sm:text-base text-slate-900 leading-snug line-clamp-2">
            {report.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {report.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-500 pt-0.5">
            <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span className="truncate">
              {report.address}, Kel. {report.village}, Kec. {report.district}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Stepper Progres */}
      <div className="bg-slate-50 rounded-2xl p-3 sm:p-4 border border-slate-100">
        <div className="text-[10px] sm:text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2 sm:mb-2.5">
          Status Terakhir
        </div>
        <div className="flex items-start gap-2.5 sm:gap-3">
          <div className="w-2.5 h-2.5 sm:w-3 sm:h-3 rounded-full bg-blue-600 mt-1 shrink-0 ring-4 ring-blue-100" />
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between text-xs gap-2">
              <span className="font-bold text-slate-800 truncate">
                {latestTimelineEvent?.title || 'Laporan Diproses'}
              </span>
              <span className="text-[10px] sm:text-[11px] text-slate-400 font-mono shrink-0">
                {latestTimelineEvent?.date}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-0.5 sm:mt-1 leading-relaxed">
              {latestTimelineEvent?.note}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="pt-1 flex flex-col xs:flex-row items-start xs:items-center justify-between gap-2 text-xs text-slate-500">
        <div>
          Dukungan Warga: <strong className="text-slate-800">{report.upvotes} suara</strong>
        </div>
        <button
          type="button"
          onClick={() => onViewDetail(report)}
          className="min-h-[38px] px-3 py-1.5 rounded-xl font-semibold text-blue-600 hover:text-blue-700 hover:bg-blue-50 flex items-center gap-1.5 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-blue-600 self-end xs:self-auto"
        >
          <span>Lihat Riwayat Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
