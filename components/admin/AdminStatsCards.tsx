import React from 'react';

interface AdminStatsCardsProps {
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
  totalCount?: number;
  onSelectFilter?: (status: string) => void;
  activeFilter?: string;
}

export default function AdminStatsCards({
  pendingCount,
  inProgressCount,
  resolvedCount,
  onSelectFilter,
  activeFilter = 'all',
}: AdminStatsCardsProps) {
  const METRICS = [
    {
      id: 'pending',
      label: 'Butuh Verifikasi',
      count: pendingCount,
      dot: 'bg-amber-500',
      desc: 'Laporan baru warga',
    },
    {
      id: 'in_progress',
      label: 'Sedang Ditangani',
      count: inProgressCount,
      dot: 'bg-blue-600',
      desc: 'Proses dinas teknis',
    },
    {
      id: 'resolved',
      label: 'Selesai Tuntas',
      count: resolvedCount,
      dot: 'bg-emerald-600',
      desc: 'Bukti fisik terunggah',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
      {METRICS.map((metric) => {
        const isSelected = activeFilter === metric.id;
        return (
          <div
            key={metric.id}
            onClick={() => onSelectFilter?.(metric.id)}
            className={`bg-white p-4 sm:p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
              isSelected
                ? 'border-blue-500 ring-1 ring-blue-500/20 shadow-xs'
                : 'border-slate-200/80 hover:border-slate-300 hover:shadow-2xs'
            }`}
          >
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <span className={`w-2 h-2 rounded-full ${metric.dot} shrink-0`} />
                <span className="text-xs font-semibold text-slate-600">
                  {metric.label}
                </span>
              </div>
              <span className="text-[11px] text-slate-400 font-mono">
                {metric.desc}
              </span>
            </div>

            <div className="text-2xl sm:text-3xl font-extrabold text-slate-900 font-mono tracking-tight">
              {metric.count}
            </div>
          </div>
        );
      })}
    </div>
  );
}
