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
  return (
    <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
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
            {reports.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-12 text-center text-slate-400">
                  Tidak ada laporan yang sesuai dengan filter.
                </td>
              </tr>
            ) : (
              reports.map((report) => {
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
                    <td className="py-4 px-6 text-right space-x-2">
                      <button
                        type="button"
                        onClick={() => onViewDetail(report)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-100 text-slate-600 transition-colors font-semibold"
                        title="Lihat Detail"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenAction(report)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold transition-colors shadow-2xs"
                      >
                        Tindak Lanjut
                      </button>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
