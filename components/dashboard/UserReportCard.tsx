'use client';

import React from 'react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/ToastProvider';
import { 
  Eye, 
  MapPin, 
  ArrowRight, 
  Copy, 
  Check, 
  Clock, 
  Wrench, 
  CheckCircle2, 
  Building2, 
  ThumbsUp
} from 'lucide-react';

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

  // Kalkulasi Milestone Progress
  const isRejected = report.status === 'rejected';
  const getStepStatus = (stepIndex: number) => {
    if (isRejected) return 'rejected';
    if (report.status === 'pending') {
      return stepIndex === 0 ? 'current' : 'upcoming';
    }
    if (report.status === 'in_progress') {
      if (stepIndex <= 1) return 'completed';
      if (stepIndex === 2) return 'current';
      return 'upcoming';
    }
    if (report.status === 'resolved') {
      return 'completed';
    }
    return 'upcoming';
  };

  const STEPS = [
    { label: 'Terkirim', icon: Check },
    { label: 'Verifikasi', icon: Clock },
    { label: 'Penanganan', icon: Wrench },
    { label: 'Selesai', icon: CheckCircle2 },
  ];

  return (
    <article
      aria-label={`Laporan: ${report.title}`}
      className="bg-white rounded-3xl p-4 sm:p-7 lg:p-8 border border-slate-200/80 shadow-xs hover:border-slate-300 hover:shadow-md transition-all space-y-5 sm:space-y-6"
    >
      {/* 1. Header Row: Kategori, Kode Tiket, Tanggal, & Status Badge */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 sm:gap-3 pb-3 sm:pb-4 border-b border-slate-100">
        <div className="flex items-center gap-2 sm:gap-2.5 flex-wrap">
          {/* Badge Kategori */}
          <span
            className="inline-flex items-center gap-1.5 px-2.5 sm:px-3 py-1 rounded-full text-[11px] sm:text-xs font-bold"
            style={{
              backgroundColor: `${category.colorHex}15`,
              color: category.colorHex,
            }}
          >
            <span
              className="w-2 h-2 rounded-full shrink-0"
              style={{ backgroundColor: category.colorHex }}
            />
            {report.customCategory || category.name}
          </span>

          {/* Kode Tiket Pelacakan */}
          <button
            type="button"
            onClick={handleCopyCode}
            className="min-h-8 inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-slate-700 hover:text-blue-600 bg-slate-100 hover:bg-blue-50 px-2.5 sm:px-3 py-1 rounded-lg transition-colors group focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
            title="Salin Kode Pelacakan"
            aria-label={`Salin kode tiket ${report.trackingCode}`}
          >
            <span>{report.trackingCode}</span>
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
          </button>

          <span className="text-slate-300 hidden md:inline" aria-hidden="true">•</span>

          <span className="text-[11px] sm:text-xs text-slate-400">
            {new Date(report.createdAt).toLocaleDateString('id-ID', {
              day: 'numeric',
              month: 'short',
              year: 'numeric'
            })}
          </span>
        </div>

        <div className="flex items-center justify-between sm:justify-end gap-2.5">
          <StatusBadge status={report.status} size="md" />
        </div>
      </div>

      {/* 2. Middle Row: Foto Bukti & Detail Keterangan */}
      <div className="flex flex-col sm:flex-row gap-4 sm:gap-6">
        {/* Gambar Foto Bukti */}
        <div className="w-full sm:w-52 md:w-56 lg:w-64 h-44 sm:h-38 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0 relative group">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={report.imageUrl}
            alt={report.title}
            className="w-full h-full object-cover group-hover:scale-102 transition-transform duration-300"
            onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
              e.currentTarget.src =
                'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80';
            }}
          />
        </div>

        {/* Info Konten */}
        <div className="flex-1 space-y-2 sm:space-y-2.5 min-w-0">
          <h2 className="text-sm sm:text-base lg:text-lg font-bold text-slate-900 leading-snug tracking-tight">
            {report.title}
          </h2>

          <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
            {report.description}
          </p>

          <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 pt-1">
            <div className="flex items-center gap-1.5 min-w-0">
              <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span className="truncate">
                {report.address}, Kel. {report.village}
              </span>
            </div>

            {report.assignedAgency && (
              <div className="flex items-center gap-1.5 text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-100">
                <Building2 className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="font-semibold truncate max-w-45">{report.assignedAgency}</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* 3. Visual Milestone Stepper (Pelacakan Alur Penanganan) */}
      <div className="bg-slate-50/80 rounded-2xl p-3.5 sm:p-5 border border-slate-100 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between text-xs">
          <span className="font-bold uppercase tracking-wider text-slate-500 text-[10px] sm:text-[11px]">
            Tahapan Penanganan Progres
          </span>
          <span className="text-[10px] sm:text-[11px] font-medium text-slate-400">
            {isRejected ? 'Laporan Ditolak' : report.status === 'resolved' ? '100% Selesai' : 'Sedang Berlangsung'}
          </span>
        </div>

        {/* Baris Step Icons (Responsif di Layar HP) */}
        <div className="grid grid-cols-4 gap-1.5 sm:gap-4 relative">
          {STEPS.map((step, idx) => {
            const st = getStepStatus(idx);
            const Icon = step.icon;

            const isDone = st === 'completed';
            const isCurr = st === 'current';

            return (
              <div key={step.label} className="flex flex-col items-center text-center gap-1.5 sm:gap-2">
                <div
                  className={`w-8 h-8 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center transition-all ${
                    isDone
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : isCurr
                      ? 'bg-blue-600 text-white shadow-md shadow-blue-500/20 ring-3 ring-blue-100'
                      : 'bg-slate-200/90 text-slate-400'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 sm:w-4.5 sm:h-4.5 stroke-[2.2]" />
                </div>
                <span
                  className={`text-[10px] sm:text-xs font-semibold leading-tight ${
                    isDone
                      ? 'text-emerald-700'
                      : isCurr
                      ? 'text-blue-700 font-bold'
                      : 'text-slate-400'
                  }`}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>

        {/* Catatan Terakhir dari Petugas / Sistem */}
        {latestTimelineEvent && (
          <div className="pt-2.5 sm:pt-3 border-t border-slate-200/60 flex items-start gap-2.5 text-xs text-slate-600">
            <div className="w-2 h-2 rounded-full bg-blue-600 mt-1 shrink-0" />
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between gap-2">
                <span className="font-bold text-slate-800 truncate text-[11px] sm:text-xs">
                  {latestTimelineEvent.title}
                </span>
                <span className="text-[10px] sm:text-[11px] text-slate-400 shrink-0 font-mono">
                  {latestTimelineEvent.date}
                </span>
              </div>
              <p className="text-slate-500 mt-0.5 leading-relaxed text-[11px] sm:text-xs">
                {latestTimelineEvent.note}
              </p>
            </div>
          </div>
        )}
      </div>

      {/* 4. Footer Action Bar: Dukungan Warga & Tombol Detail */}
      <div className="pt-1 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-2.5 sm:gap-3 text-xs text-slate-500">
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 border border-slate-200/80 self-start">
          <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
          <span>
            Didukung <strong className="text-slate-800">{report.upvotes} warga</strong>
          </span>
        </div>

        <button
          type="button"
          onClick={() => onViewDetail(report)}
          className="min-h-11 px-4 py-2 rounded-xl font-semibold text-blue-600 hover:text-white hover:bg-blue-600 active:scale-95 transition-all border border-blue-200 hover:border-blue-600 flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <span>Lihat Riwayat & Log Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </article>
  );
}
