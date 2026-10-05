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
    <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {/* Total */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Tampilkan semua pengaduan"
        onClick={() => onSelectFilter('all')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectFilter('all');
          }
        }}
        className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
          filterStatus === 'all'
            ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Total Pengaduan
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 mt-1">
          {totalCount}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Semua riwayat laporan</div>
        {filterStatus === 'all' && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Aktif</span>
          </div>
        )}
      </div>

      {/* Pending */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Filter status menunggu verifikasi"
        onClick={() => onSelectFilter('pending')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectFilter('pending');
          }
        }}
        className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-600 ${
          filterStatus === 'pending'
            ? 'bg-white border-amber-500 shadow-md ring-2 ring-amber-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-amber-600">
          Menunggu Verifikasi
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-amber-600 mt-1">
          {pendingCount}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Dalam antrean petugas</div>
        {filterStatus === 'pending' && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            <span>Aktif</span>
          </div>
        )}
      </div>

      {/* In Progress */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Filter status sedang ditangani"
        onClick={() => onSelectFilter('in_progress')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectFilter('in_progress');
          }
        }}
        className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
          filterStatus === 'in_progress'
            ? 'bg-white border-blue-600 shadow-md ring-2 ring-blue-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-blue-600">
          Sedang Ditangani
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-blue-600 mt-1">
          {inProgressCount}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Tim teknis lapangan</div>
        {filterStatus === 'in_progress' && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            <span>Aktif</span>
          </div>
        )}
      </div>

      {/* Resolved */}
      <div
        tabIndex={0}
        role="button"
        aria-label="Filter status tuntas selesai"
        onClick={() => onSelectFilter('resolved')}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onSelectFilter('resolved');
          }
        }}
        className={`p-3.5 sm:p-5 rounded-2xl border transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
          filterStatus === 'resolved'
            ? 'bg-white border-emerald-600 shadow-md ring-2 ring-emerald-100'
            : 'bg-white border-slate-200/80 hover:border-slate-300'
        }`}
      >
        <div className="text-[10px] sm:text-[11px] font-bold uppercase tracking-wider text-emerald-600">
          Tuntas Selesai
        </div>
        <div className="text-xl sm:text-2xl md:text-3xl font-extrabold text-emerald-600 mt-1">
          {resolvedCount}
        </div>
        <div className="text-[10px] sm:text-[11px] text-slate-500 mt-0.5">Sudah diperbaiki rapi</div>
        {filterStatus === 'resolved' && (
          <div className="mt-2 inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600" />
            <span>Aktif</span>
          </div>
        )}
      </div>
    </div>
  );
}
