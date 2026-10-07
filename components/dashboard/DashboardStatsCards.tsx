'use client';

import React from 'react';
import { Layers, Clock, Wrench, CheckCircle2 } from 'lucide-react';

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
  const cards = [
    {
      id: 'all',
      title: 'Total Pengaduan',
      count: totalCount,
      desc: 'Semua riwayat laporan Anda',
      icon: Layers,
      colorText: 'text-slate-900',
      badgeBg: 'bg-slate-100 text-slate-700',
      activeRing: 'ring-2 ring-blue-600 border-blue-600 bg-white shadow-md shadow-blue-500/5',
      iconColor: 'text-slate-500',
      iconBg: 'bg-slate-100',
    },
    {
      id: 'pending',
      title: 'Menunggu Verifikasi',
      count: pendingCount,
      desc: 'Dalam antrean telaah dinas',
      icon: Clock,
      colorText: 'text-amber-600',
      badgeBg: 'bg-amber-50 text-amber-700 border border-amber-200/80',
      activeRing: 'ring-2 ring-amber-500 border-amber-500 bg-white shadow-md shadow-amber-500/5',
      iconColor: 'text-amber-600',
      iconBg: 'bg-amber-50',
    },
    {
      id: 'in_progress',
      title: 'Sedang Ditangani',
      count: inProgressCount,
      desc: 'Tindakan tim lapangan',
      icon: Wrench,
      colorText: 'text-blue-600',
      badgeBg: 'bg-blue-50 text-blue-700 border border-blue-200/80',
      activeRing: 'ring-2 ring-blue-600 border-blue-600 bg-white shadow-md shadow-blue-500/5',
      iconColor: 'text-blue-600',
      iconBg: 'bg-blue-50',
    },
    {
      id: 'resolved',
      title: 'Tuntas Selesai',
      count: resolvedCount,
      desc: 'Perbaikan rampung tervalidasi',
      icon: CheckCircle2,
      colorText: 'text-emerald-600',
      badgeBg: 'bg-emerald-50 text-emerald-700 border border-emerald-200/80',
      activeRing: 'ring-2 ring-emerald-600 border-emerald-600 bg-white shadow-md shadow-emerald-500/5',
      iconColor: 'text-emerald-600',
      iconBg: 'bg-emerald-50',
    },
  ];

  return (
    <section aria-label="Ringkasan Statistik Pemantauan">
      {/* 2 Kolom di Mobile, 4 Kolom di Desktop untuk layout yang seimbang dan tidak memanjang */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-5">
        {cards.map((card) => {
          const isSelected = filterStatus === card.id;
          const Icon = card.icon;

          return (
            <div
              key={card.id}
              tabIndex={0}
              role="button"
              aria-pressed={isSelected}
              aria-label={`Filter pengaduan: ${card.title} (${card.count})`}
              onClick={() => onSelectFilter(card.id)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectFilter(card.id);
                }
              }}
              className={`p-3.5 sm:p-5 lg:p-6 rounded-2xl sm:rounded-3xl border transition-all cursor-pointer select-none focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-98 ${
                isSelected
                  ? card.activeRing
                  : 'bg-white border-slate-200/80 hover:border-slate-300 hover:shadow-xs'
              }`}
            >
              <div className="flex items-center justify-between gap-2 mb-2 sm:mb-4">
                <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider text-slate-500 truncate leading-tight">
                  {card.title}
                </span>
                <div className={`w-7 h-7 sm:w-9 sm:h-9 rounded-lg sm:rounded-xl flex items-center justify-center shrink-0 ${card.iconBg} ${card.iconColor}`}>
                  <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                </div>
              </div>

              <div className="flex items-baseline justify-between gap-1 sm:gap-2">
                <div className={`text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight ${card.colorText}`}>
                  {card.count}
                </div>
                {isSelected && (
                  <span className={`text-[10px] sm:text-[11px] font-bold px-2 py-0.5 rounded-full ${card.badgeBg}`}>
                    Aktif
                  </span>
                )}
              </div>

              <p className="text-[10px] sm:text-xs text-slate-500 mt-1 sm:mt-2 line-clamp-1 hidden xs:block">
                {card.desc}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}
