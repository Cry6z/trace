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
    <div className="bg-white rounded-3xl p-6 border border-slate-200/80 shadow-xs hover:shadow-md transition-shadow space-y-5">
      {/* Header Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2.5">
          <span
            className="w-3 h-3 rounded-full shrink-0"
            style={{ backgroundColor: category.colorHex }}
          />
          <span className="text-xs font-bold text-slate-800">{category.name}</span>
          <span className="text-slate-300">•</span>
          <button
            type="button"
            onClick={handleCopyCode}
            className="flex items-center gap-1 text-xs font-mono font-semibold text-blue-600 hover:text-blue-700 bg-blue-50/70 hover:bg-blue-100 px-2 py-0.5 rounded transition-colors group"
            title="Salin Kode Tiket"
          >
            <span>{report.trackingCode}</span>
            <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          <StatusBadge status={report.status} size="md" />
          <button
            type="button"
            onClick={() => onViewDetail(report)}
            className="p-1.5 rounded-lg text-slate-400 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Buka Detail Lengkap"
          >
            <Eye className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Middle: Content & Photo */}
      <div className="flex flex-col md:flex-row gap-5">
        <div className="w-full md:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
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

        <div className="flex-1 space-y-2">
          <h3 className="font-bold text-base text-slate-900 leading-snug">
            {report.title}
          </h3>
          <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
            {report.description}
          </p>
          <div className="flex items-center gap-1.5 text-xs text-slate-400 pt-1">
            <MapPin className="w-3.5 h-3.5 text-slate-500" />
            <span>
              {report.address}, Kel. {report.village}, Kec. {report.district}
            </span>
          </div>
        </div>
      </div>

      {/* Timeline Stepper Progres */}
      <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100">
        <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
          Status Terakhir
        </div>
        <div className="flex items-start gap-3">
          <div className="w-3 h-3 rounded-full bg-blue-600 mt-1 shrink-0 ring-4 ring-blue-100" />
          <div className="flex-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-800">
                {latestTimelineEvent?.title || 'Laporan Diproses'}
              </span>
              <span className="text-[11px] text-slate-400 font-mono">
                {latestTimelineEvent?.date}
              </span>
            </div>
            <p className="text-xs text-slate-600 mt-1">
              {latestTimelineEvent?.note}
            </p>
          </div>
        </div>
      </div>

      {/* Card Footer Action */}
      <div className="pt-2 flex items-center justify-between text-xs text-slate-500">
        <div>
          Dukungan Warga: <strong className="text-slate-800">{report.upvotes} suara</strong>
        </div>
        <button
          type="button"
          onClick={() => onViewDetail(report)}
          className="font-semibold text-blue-600 hover:text-blue-700 flex items-center gap-1 active:scale-95 transition-all"
        >
          <span>Lihat Riwayat Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
