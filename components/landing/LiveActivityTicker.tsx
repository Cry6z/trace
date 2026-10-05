'use client';

import React, { useState, useEffect } from 'react';
import { ArrowRight, ChevronLeft, ChevronRight, Activity } from 'lucide-react';

export interface ActivityEvent {
  id: string;
  reportId?: string;
  trackingCode: string;
  timeAgo: string;
  category: string;
  categoryColor: string;
  agencyOrActor: string;
  actionText: string;
  location: string;
}

const LIVE_EVENTS: ActivityEvent[] = [
  {
    id: 'act-1',
    reportId: 'rep-1',
    trackingCode: 'TRC-2026-1049',
    timeAgo: 'Baru saja',
    category: 'Jalan Rusak',
    categoryColor: '#ef4444',
    agencyOrActor: 'Dinas PUPR',
    actionText: 'Tim teknis menuju lokasi untuk penambalan aspal',
    location: 'Kel. Lempuing',
  },
  {
    id: 'act-2',
    reportId: 'rep-2',
    trackingCode: 'TRC-2026-2180',
    timeAgo: '4 menit lalu',
    category: 'PJU Padam',
    categoryColor: '#f59e0b',
    agencyOrActor: 'Warga #4102',
    actionText: 'Menambahkan 1 dukungan warga untuk penggantian bohlam',
    location: 'Jl. Pari, Pasar Berkas',
  },
  {
    id: 'act-3',
    reportId: 'rep-3',
    trackingCode: 'TRC-2026-3042',
    timeAgo: '14 menit lalu',
    category: 'Sampah Liar',
    categoryColor: '#10b981',
    agencyOrActor: 'Dinas LH Bengkulu',
    actionText: 'Pengangkutan armada sampah selesai & lokasi bersih',
    location: 'Pasar Minggu',
  },
  {
    id: 'act-4',
    reportId: 'rep-4',
    trackingCode: 'TRC-2026-4891',
    timeAgo: '28 menit lalu',
    category: 'Banjir / Drainase',
    categoryColor: '#3b82f6',
    agencyOrActor: 'Petugas Lapangan',
    actionText: 'Pembersihan sedimentasi parit sedang berlangsung',
    location: 'Kec. Ratu Agung',
  },
  {
    id: 'act-5',
    reportId: 'rep-5',
    trackingCode: 'TRC-2026-5510',
    timeAgo: '45 menit lalu',
    category: 'Fasilitas',
    categoryColor: '#8b5cf6',
    agencyOrActor: 'Sistem TRACE',
    actionText: 'Laporan baru warga terverifikasi dan masuk peta publik',
    location: 'Gading Cempaka',
  },
];

interface LiveActivityTickerProps {
  onSelectReportId?: (reportId: string) => void;
}

export default function LiveActivityTicker({ onSelectReportId }: LiveActivityTickerProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
    }, 4500);

    return () => clearInterval(interval);
  }, [isPaused]);

  const current = LIVE_EVENTS[currentIndex];

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev - 1 + LIVE_EVENTS.length) % LIVE_EVENTS.length);
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev + 1) % LIVE_EVENTS.length);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="w-full bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-sm p-2 sm:p-2.5 flex items-center justify-between gap-3 text-xs transition-all hover:border-blue-200 hover:shadow-md"
    >
      {/* Left Badge: Live Ticker Indicator */}
      <div className="flex items-center gap-2 shrink-0 pl-1 sm:pl-2">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <div className="hidden sm:flex items-center gap-1.5 font-bold uppercase tracking-wider text-[10px] text-slate-700 bg-slate-100 px-2 py-0.5 rounded-full">
          <Activity className="w-3 h-3 text-blue-600" />
          <span>Aktivitas Langsung</span>
        </div>
      </div>

      {/* Center Event Text (Animated) */}
      <div
        key={current.id}
        onClick={() => {
          if (current.reportId && onSelectReportId) {
            onSelectReportId(current.reportId);
          }
        }}
        className="flex-1 min-w-0 flex items-center gap-2 cursor-pointer group animate-in fade-in slide-in-from-right-3 duration-300"
      >
        <span
          className="w-1.5 h-1.5 rounded-full shrink-0"
          style={{ backgroundColor: current.categoryColor }}
        />
        <span className="font-mono text-[11px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded shrink-0">
          {current.trackingCode}
        </span>
        <span className="font-semibold text-slate-800 shrink-0 hidden md:inline">
          {current.agencyOrActor}:
        </span>
        <span className="text-slate-600 truncate group-hover:text-blue-700 transition-colors">
          {current.actionText}
        </span>
        <span className="text-slate-400 shrink-0 text-[11px] hidden lg:inline">
          ({current.location})
        </span>
        <span className="text-[10px] font-medium text-slate-400 bg-slate-50 border border-slate-200/60 px-1.5 py-0.5 rounded-full shrink-0">
          {current.timeAgo}
        </span>
        <ArrowRight className="w-3.5 h-3.5 text-slate-400 opacity-0 group-hover:opacity-100 -translate-x-1 group-hover:translate-x-0 transition-all shrink-0 hidden sm:inline" />
      </div>

      {/* Right Controls: Previous / Next Carousel Buttons */}
      <div className="flex items-center gap-1 shrink-0 pr-1">
        <button
          type="button"
          onClick={handlePrev}
          className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          title="Aktivitas Sebelumnya"
          aria-label="Sebelumnya"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
        </button>
        <span className="text-[10px] font-medium text-slate-400 select-none">
          {currentIndex + 1}/{LIVE_EVENTS.length}
        </span>
        <button
          type="button"
          onClick={handleNext}
          className="w-6 h-6 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-700 flex items-center justify-center transition-colors"
          title="Aktivitas Selanjutnya"
          aria-label="Selanjutnya"
        >
          <ChevronRight className="w-3.5 h-3.5" />
        </button>
      </div>
    </div>
  );
}
