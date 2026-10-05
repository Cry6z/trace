import React from 'react';

interface DashboardStatsCardsProps {
  totalCount: number;
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  filterStatus: string;
  onSelectFilter: (status: string) => void;
}

export default function DashboardStatsCards({
  totalCount,
  pendingCount,
  inProgressCount,
  resolvedCount,
  filterStatus,
  onSelectFilter,
}: DashboardStatsCardsProps) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
      {/* Total */}
      <div
        onClick={() => onSelectFilter('all')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
          filterStatus === 'all'
            ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Total Pengaduan
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">
          {totalCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">Semua riwayat laporan</div>
      </div>

      {/* Pending */}
      <div
        onClick={() => onSelectFilter('pending')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
          filterStatus === 'pending'
            ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
          Menunggu Verifikasi
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-amber-600 mt-1">
          {pendingCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">Dalam antrean petugas</div>
      </div>

      {/* In Progress */}
      <div
        onClick={() => onSelectFilter('in_progress')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
          filterStatus === 'in_progress'
            ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
          Sedang Ditangani
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-blue-600 mt-1">
          {inProgressCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">Tim teknis di lapangan</div>
      </div>

      {/* Resolved */}
      <div
        onClick={() => onSelectFilter('resolved')}
        className={`p-5 rounded-2xl border transition-all cursor-pointer ${
          filterStatus === 'resolved'
            ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          Tuntas Selesai
        </div>
        <div className="text-2xl sm:text-3xl font-extrabold text-emerald-600 mt-1">
          {resolvedCount}
        </div>
        <div className="text-[11px] text-slate-500 mt-0.5">Sudah diperbaiki rapi</div>
      </div>
    </div>
  );
}
