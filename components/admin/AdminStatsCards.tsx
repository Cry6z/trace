import React from 'react';
import { AlertCircle, Clock, CheckCircle2 } from 'lucide-react';

interface AdminStatsCardsProps {
  pendingCount: number;
  inProgressCount: number;
  resolvedCount: number;
}

export default function AdminStatsCards({
  pendingCount,
  inProgressCount,
  resolvedCount,
}: AdminStatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {/* Pending */}
      <div className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-amber-600">
            Perlu Verifikasi Cepat
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{pendingCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Laporan baru dari warga</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
          <AlertCircle className="w-6 h-6" />
        </div>
      </div>

      {/* In Progress */}
      <div className="bg-white p-5 rounded-2xl border border-blue-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-blue-600">
            Dalam Pengerjaan Lapangan
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{inProgressCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Sedang ditangani dinas</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
          <Clock className="w-6 h-6" />
        </div>
      </div>

      {/* Resolved */}
      <div className="bg-white p-5 rounded-2xl border border-emerald-200 shadow-2xs flex items-center justify-between">
        <div>
          <div className="text-[11px] font-bold uppercase tracking-wider text-emerald-600">
            Penanganan Tuntas
          </div>
          <div className="text-3xl font-extrabold text-slate-900 mt-1">{resolvedCount}</div>
          <div className="text-xs text-slate-400 mt-0.5">Bukti foto telah terunggah</div>
        </div>
        <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
          <CheckCircle2 className="w-6 h-6" />
        </div>
      </div>
    </div>
  );
}
