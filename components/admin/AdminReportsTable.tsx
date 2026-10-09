'use client';

import React from 'react';
import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';

interface AdminReportsTableProps {
  reports: Report[];
  totalReportsCount: number;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  statusFilter: string;
  onStatusChange: (status: string) => void;
  categoryFilter: string;
  onCategoryChange: (category: string) => void;
  onViewDetail: (report: Report) => void;
  onOpenAction: (report: Report) => void;
  onResetFilters: () => void;
}

export default function AdminReportsTable({
  reports,
  totalReportsCount,
  searchQuery,
  onSearchChange,
  statusFilter,
  onStatusChange,
  categoryFilter,
  onCategoryChange,
  onViewDetail,
  onOpenAction,
  onResetFilters,
}: AdminReportsTableProps) {
  const isFiltered = searchQuery.trim() !== '' || statusFilter !== 'all' || categoryFilter !== 'all';

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden">
      {/* 1. Integrated Table Toolbar (Satu Kesatuan dengan Tabel, Tanpa Card Terpisah) */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4 bg-slate-50/40">
        {/* Kolom Kiri: Search Input */}
        <div className="relative w-full lg:w-96">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari kode tiket, judul, kelurahan..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-9 pr-9 py-2 rounded-xl border border-slate-200 bg-white text-xs text-slate-800 placeholder:text-slate-400 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => onSearchChange('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 text-slate-400 hover:text-slate-600 rounded-md"
              title="Hapus pencarian"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Kolom Kanan: Dropdowns & Status Counter */}
        <div className="flex flex-wrap items-center gap-2.5 justify-between lg:justify-end">
          {/* Filter Status */}
          <select
            value={statusFilter}
            onChange={(e) => onStatusChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Status</option>
            <option value="pending">Menunggu Verifikasi</option>
            <option value="in_progress">Sedang Ditangani</option>
            <option value="resolved">Selesai Ditangani</option>
          </select>

          {/* Filter Kategori */}
          <select
            value={categoryFilter}
            onChange={(e) => onCategoryChange(e.target.value)}
            className="px-3 py-2 rounded-xl border border-slate-200 bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:border-blue-500 cursor-pointer shadow-2xs"
          >
            <option value="all">Semua Kategori</option>
            {Object.values(CATEGORIES_CONFIG).map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>

          {/* Reset Filters jika ada filter aktif */}
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-500 hover:text-slate-900 hover:bg-slate-100 transition-colors flex items-center gap-1 cursor-pointer"
              title="Reset seluruh filter"
            >
              <SlidersHorizontal className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          )}

          {/* Count Counter Info */}
          <div className="text-xs text-slate-400 font-mono ml-1 hidden sm:block">
            {reports.length} dari {totalReportsCount} data
          </div>
        </div>
      </div>

      {/* 2. Empty State jika data tidak ditemukan */}
      {reports.length === 0 ? (
        <div className="p-12 text-center space-y-3">
          <p className="text-sm font-semibold text-slate-700">Tidak ada laporan yang sesuai kriteria</p>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Coba ubah kata kunci pencarian atau reset filter status dan kategori untuk melihat laporan lainnya.
          </p>
          {isFiltered && (
            <button
              type="button"
              onClick={onResetFilters}
              className="mt-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
            >
              Tampilkan Semua Laporan
            </button>
          )}
        </div>
      ) : (
        <>
          {/* 3. Mobile Card View (< sm) */}
          <div className="sm:hidden divide-y divide-slate-100">
            {reports.map((report) => (
              <div key={report.id} className="p-4 space-y-3 hover:bg-slate-50/50 transition-colors">
                <div className="flex items-center justify-between gap-2">
                  <span className="font-mono font-bold text-blue-600 text-xs">
                    {report.trackingCode}
                  </span>
                  <StatusBadge status={report.status} />
                </div>

                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <CategoryBadge category={report.category} short />
                    <span className="text-[11px] text-slate-400 font-mono">
                      {new Date(report.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                    </span>
                  </div>
                  <h4 className="font-bold text-slate-900 text-sm leading-snug">{report.title}</h4>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">{report.description}</p>
                </div>

                <div className="text-xs text-slate-500 flex items-center justify-between pt-1 text-[11px]">
                  <span>Kel. {report.village}, {report.district}</span>
                  <span className="text-slate-600 font-medium truncate max-w-40">
                    {report.assignedAgency?.split('(')[0] || 'Dinas Terkait'}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2">
                  <button
                    type="button"
                    onClick={() => onViewDetail(report)}
                    className="py-2 px-3 rounded-xl border border-slate-200 hover:bg-slate-50 text-slate-700 font-semibold text-xs flex items-center justify-center transition-colors"
                  >
                    Detail
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAction(report)}
                    className="py-2 px-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-xs flex items-center justify-center transition-colors shadow-2xs"
                  >
                    Tindak Lanjut
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* 4. Desktop / Tablet Unified Table View (>= sm) */}
          <div className="hidden sm:block overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="border-b border-slate-100 bg-slate-50/60 text-slate-400 font-semibold text-[11px] uppercase tracking-wider">
                  <th className="py-3.5 px-5">Kode & Tanggal</th>
                  <th className="py-3.5 px-5">Kategori & Masalah</th>
                  <th className="py-3.5 px-5">Wilayah</th>
                  <th className="py-3.5 px-5">Dinas Terkait</th>
                  <th className="py-3.5 px-5">Status</th>
                  <th className="py-3.5 px-5 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-700 font-medium">
                {reports.map((report) => (
                  <tr key={report.id} className="hover:bg-slate-50/70 transition-colors">
                    {/* Kode & Tanggal */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-mono font-bold text-blue-600">{report.trackingCode}</div>
                      <div className="text-[11px] text-slate-400 mt-0.5">
                        {new Date(report.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                      </div>
                    </td>

                    {/* Kategori & Masalah */}
                    <td className="py-3.5 px-5 max-w-sm">
                      <div className="flex items-center gap-2 mb-1">
                        <CategoryBadge category={report.category} short />
                      </div>
                      <div className="font-bold text-slate-900 leading-snug line-clamp-1">{report.title}</div>
                      <div className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{report.description}</div>
                    </td>

                    {/* Wilayah */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <div className="font-semibold text-slate-800">Kel. {report.village}</div>
                      <div className="text-[11px] text-slate-400">Kec. {report.district}</div>
                    </td>

                    {/* Dinas Terkait (Bersih Tanpa Box Abu-abu Tebal) */}
                    <td className="py-3.5 px-5 max-w-xs">
                      <span className="text-xs text-slate-700 font-medium block truncate" title={report.assignedAgency}>
                        {report.assignedAgency || 'Belum Ditugaskan'}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-3.5 px-5 whitespace-nowrap">
                      <StatusBadge status={report.status} />
                    </td>

                    {/* Aksi */}
                    <td className="py-3.5 px-5 text-right whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5">
                        <button
                          type="button"
                          onClick={() => onViewDetail(report)}
                          className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 text-slate-600 text-xs font-semibold transition-colors cursor-pointer"
                          title="Lihat Rincian Laporan"
                        >
                          Detail
                        </button>
                        <button
                          type="button"
                          onClick={() => onOpenAction(report)}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 active:scale-95 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
                          title="Proses Tindak Lanjut"
                        >
                          Tindak Lanjut
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* 5. Table Footer: Summary Info */}
          <div className="p-3.5 sm:px-5 border-t border-slate-100 flex items-center justify-between text-xs text-slate-400 bg-slate-50/30">
            <span>Menampilkan {reports.length} data pengaduan</span>
            <span className="font-mono text-[11px]">Sistem Terbuka TRACE Bengkulu</span>
          </div>
        </>
      )}
    </div>
  );
}
