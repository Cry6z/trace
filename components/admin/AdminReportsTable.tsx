import React from 'react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';

interface AdminReportsTableProps {
  reports: Report[];
  onViewDetail: (report: Report) => void;
  onOpenAction: (report: Report) => void;
}

export default function AdminReportsTable({
  reports,
  onViewDetail,
  onOpenAction,
}: AdminReportsTableProps) {
  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-3xl border border-slate-200/80 p-8 sm:p-12 text-center text-slate-400 text-xs">
        Tidak ada laporan yang sesuai dengan filter.
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Mobile Card View (< sm) */}
      <div className="sm:hidden space-y-3">
        {reports.map((report) => {
          const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

          return (
            <div
              key={report.id}
              className="bg-white rounded-2xl border border-slate-200 p-4 space-y-3 shadow-2xs"
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-mono font-bold text-blue-600 text-xs">
                  {report.trackingCode}
                </span>
                <StatusBadge status={report.status} />
              </div>

              <div>
                <div className="flex items-center gap-1.5 mb-1">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: category.colorHex }}
                  />
                  <span className="font-semibold text-slate-700 text-[11px]">
                    {category.name}
                  </span>
                </div>
                <h4 className="font-bold text-slate-900 text-sm">{report.title}</h4>
                <p className="text-xs text-slate-500 line-clamp-2 mt-0.5">{report.description}</p>
              </div>

              <div className="text-xs text-slate-500 flex flex-wrap items-center gap-x-3 gap-y-1 pt-1 border-t border-slate-100">
                <span>📍 Kel. {report.village}, {report.district}</span>
                <span className="text-slate-300">•</span>
                <span>
                  {new Date(report.createdAt).toLocaleDateString('id-ID', {
                    dateStyle: 'medium',
                  })}
                </span>
              </div>

              <div className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold inline-block">
                Dinas: {report.assignedAgency || 'Belum Ditugaskan'}
              </div>

              <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => onViewDetail(report)}
                  className="min-h-11 py-2 px-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  Detail
                </button>
                <button
                  type="button"
                  onClick={() => onOpenAction(report)}
                  className="min-h-11 py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  Tindak Lanjut
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Desktop / Tablet Table View (>= sm) */}
      <div className="hidden sm:block bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/70 text-slate-500 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-4 px-6">Kode & Tanggal</th>
                <th className="py-4 px-6">Kategori & Masalah</th>
                <th className="py-4 px-6">Lokasi</th>
                <th className="py-4 px-6">Dinas Terkait</th>
                <th className="py-4 px-6">Status</th>
                <th className="py-4 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
              {reports.map((report) => {
                const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

                return (
                  <tr key={report.id} className="hover:bg-slate-50/60 transition-colors">
                    {/* Kode & Tanggal */}
                    <td className="py-4 px-6">
                      <div className="font-mono font-bold text-blue-600">{report.trackingCode}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', {
                          dateStyle: 'medium',
                        })}
                      </div>
                    </td>

                    {/* Kategori & Masalah */}
                    <td className="py-4 px-6 max-w-xs">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span
                          className="w-2.5 h-2.5 rounded-full shrink-0"
                          style={{ backgroundColor: category.colorHex }}
                        />
                        <span className="font-bold text-slate-800 text-[11px]">
                          {category.name}
                        </span>
                      </div>
                      <div className="font-bold text-slate-900 line-clamp-1">{report.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1">{report.description}</div>
                    </td>

                    {/* Lokasi */}
                    <td className="py-4 px-6">
                      <div className="font-semibold text-slate-800">{report.village}</div>
                      <div className="text-[11px] text-slate-500">{report.district}</div>
                    </td>

                    {/* Dinas Terkait */}
                    <td className="py-4 px-6">
                      <span className="text-[11px] px-2.5 py-1 rounded-lg bg-slate-100 text-slate-700 font-semibold inline-block">
                        {report.assignedAgency || 'Belum Ditugaskan'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* Tindakan */}
                    <td className="py-4 px-6 text-right space-x-2 whitespace-nowrap">
                      <button
                        type="button"
                        onClick={() => onViewDetail(report)}
                        className="min-h-[38px] px-3 py-1.5 rounded-xl border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors font-semibold focus-visible:outline-2 focus-visible:outline-blue-600"
                        title="Lihat Detail"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenAction(report)}
                        className="min-h-[38px] px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-2xs focus-visible:outline-2 focus-visible:outline-blue-600"
                      >
                        Tindak Lanjut
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
