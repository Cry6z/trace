'use client';

import React from 'react';
import Link from 'next/link';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/ToastProvider';
import { Copy, Eye, MapPin, PlusCircle, Inbox } from 'lucide-react';

interface UserTicketsViewProps {
  reports: Report[];
  onViewDetail: (report: Report) => void;
}

export default function UserTicketsView({
  reports,
  onViewDetail,
}: UserTicketsViewProps) {
  const { toast } = useToast();

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.copied('Kode Tiket Disalin', code);
  };

  if (reports.length === 0) {
    return (
      <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-lg mx-auto">
        <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
          <Inbox className="w-7 h-7" />
        </div>
        <div className="space-y-1">
          <h3 className="font-bold text-slate-900 text-base">Belum Ada Tiket Laporan</h3>
          <p className="text-xs text-slate-500">Anda belum mengajukan pengaduan fasilitas lingkungan.</p>
        </div>
        <Link
          href="/dashboard/buat-laporan"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-sm"
        >
          <PlusCircle className="w-4 h-4" />
          <span>Buat Pengaduan Pertama</span>
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden animate-in fade-in duration-200">
      <div className="p-4 sm:p-7 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
            Daftar Seluruh Tiket Pelacakan Anda
          </h2>
          <p className="text-xs text-slate-500 mt-0.5 sm:mt-1">
            Total {reports.length} tiket terdaftar di basis data TRACE Kota Bengkulu
          </p>
        </div>
      </div>

      {/* 1. Tampilan Khusus Ponsel: Card List yang Nyaman Tanpa Scroll Horizontal */}
      <div className="block md:hidden divide-y divide-slate-100">
        {reports.map((report) => {
          const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

          return (
            <div key={report.id} className="p-4 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <button
                  type="button"
                  onClick={() => handleCopyCode(report.trackingCode)}
                  className="font-mono font-bold text-xs text-blue-600 bg-blue-50/70 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span>{report.trackingCode}</span>
                  <Copy className="w-3 h-3 text-slate-400" />
                </button>
                <StatusBadge status={report.status} size="sm" />
              </div>

              <div>
                <h3 className="font-bold text-sm text-slate-900 line-clamp-1">
                  {report.title}
                </h3>
                <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-1 truncate">
                  <MapPin className="w-3 h-3 shrink-0" />
                  <span className="truncate">{report.address}, Kel. {report.village}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-1 text-xs">
                <span
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold"
                  style={{
                    backgroundColor: `${category.colorHex}15`,
                    color: category.colorHex,
                  }}
                >
                  <span
                    className="w-1.5 h-1.5 rounded-full"
                    style={{ backgroundColor: category.colorHex }}
                  />
                  <span>{category.name}</span>
                </span>

                <button
                  type="button"
                  onClick={() => onViewDetail(report)}
                  className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-200 text-blue-600 font-semibold text-xs active:scale-95"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Detail</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* 2. Tampilan Desktop & Tablet: Full Width Table */}
      <div className="hidden md:block overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/70 border-b border-slate-100 text-[11px] font-bold uppercase tracking-wider text-slate-400">
              <th className="py-4 px-6">Kode Tiket</th>
              <th className="py-4 px-6">Masalah & Lokasi</th>
              <th className="py-4 px-6">Kategori</th>
              <th className="py-4 px-6">Status Terkini</th>
              <th className="py-4 px-6">Tanggal</th>
              <th className="py-4 px-6 text-right">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 text-xs text-slate-600">
            {reports.map((report) => {
              const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

              return (
                <tr key={report.id} className="hover:bg-slate-50/80 transition-colors group">
                  {/* Kode Tiket */}
                  <td className="py-4 px-6">
                    <button
                      type="button"
                      onClick={() => handleCopyCode(report.trackingCode)}
                      className="font-mono font-bold text-blue-600 hover:text-blue-800 bg-blue-50/70 px-2.5 py-1 rounded-lg inline-flex items-center gap-1.5 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
                      title="Salin Kode Tiket"
                    >
                      <span>{report.trackingCode}</span>
                      <Copy className="w-3 h-3 opacity-60 group-hover:opacity-100" />
                    </button>
                  </td>

                  {/* Judul & Alamat */}
                  <td className="py-4 px-6 max-w-xs">
                    <div className="font-bold text-slate-900 line-clamp-1">
                      {report.title}
                    </div>
                    <div className="text-[11px] text-slate-400 flex items-center gap-1 mt-0.5 truncate">
                      <MapPin className="w-3 h-3 shrink-0" />
                      <span className="truncate">{report.address}, Kel. {report.village}</span>
                    </div>
                  </td>

                  {/* Kategori */}
                  <td className="py-4 px-6">
                    <span
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold"
                      style={{
                        backgroundColor: `${category.colorHex}15`,
                        color: category.colorHex,
                      }}
                    >
                      <span
                        className="w-1.5 h-1.5 rounded-full"
                        style={{ backgroundColor: category.colorHex }}
                      />
                      <span>{category.name}</span>
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-6">
                    <StatusBadge status={report.status} size="sm" />
                  </td>

                  {/* Tanggal */}
                  <td className="py-4 px-6 text-slate-400 font-mono text-[11px] whitespace-nowrap">
                    {new Date(report.createdAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </td>

                  {/* Aksi */}
                  <td className="py-4 px-6 text-right">
                    <button
                      type="button"
                      onClick={() => onViewDetail(report)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-blue-600 text-slate-600 hover:text-blue-600 font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Detail</span>
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
