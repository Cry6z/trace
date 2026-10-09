'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Wrench,
  Search,
  CheckCircle2,
  MapPin,
  Calendar,
  Building2,
  FileEdit,
  Eye,
  Check,
  Clock,
} from 'lucide-react';
import { Report } from '@/lib/types';
import CategoryBadge from '@/components/ui/CategoryBadge';

interface AdminInProgressViewProps {
  reports: Report[];
  onOpenAction: (report: Report) => void;
  onViewDetail: (report: Report) => void;
}

export default function AdminInProgressView({
  reports,
  onOpenAction,
  onViewDetail,
}: AdminInProgressViewProps) {
  const inProgressReports = reports.filter((r) => r.status === 'in_progress');
  const [search, setSearch] = useState<string>('');
  const [agencyFilter, setAgencyFilter] = useState<string>('all');

  // Daftar instansi unik yang sedang menangani
  const agencies = Array.from(
    new Set(
      inProgressReports
        .map((r) => r.assignedAgency)
        .filter((a): a is string => Boolean(a))
    )
  );

  const filtered = inProgressReports.filter((r) => {
    const matchSearch =
      search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      r.village.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());

    const matchAgency = agencyFilter === 'all' || r.assignedAgency === agencyFilter;

    return matchSearch && matchAgency;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman Monitoring Lapangan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold text-slate-500">
              Operasional & Konstruksi Lapangan
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Monitoring Penanganan Tim Dinas
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Pantau perkembangan penanganan fisik infrastruktur yang sedang dikerjakan oleh tim dinas teknis di lapangan hingga siap dituntaskan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="bg-blue-50 border border-blue-200 px-3.5 py-2 rounded-xl text-blue-800 flex items-center gap-2">
            <Wrench className="w-4 h-4 text-blue-600" />
            <span className="text-xs sm:text-sm font-bold font-mono">
              {inProgressReports.length} Pekerjaan Berjalan
            </span>
          </div>
        </div>
      </div>

      {/* 2. Toolbar Pencarian & Filter Instansi */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode tracking, jalan, atau instruksi..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select
            value={agencyFilter}
            onChange={(e) => setAgencyFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-hidden w-full md:w-auto cursor-pointer"
          >
            <option value="all">Semua Instansi Pelaksana</option>
            {agencies.map((agency) => (
              <option key={agency} value={agency}>
                {agency}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* 3. Daftar Lembar Kerja Progres (Work Orders) */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {inProgressReports.length === 0
              ? 'Tidak Ada Pekerjaan Lapangan yang Berlangsung'
              : 'Tidak Ada Pekerjaan yang Cocok'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {inProgressReports.length === 0
              ? 'Semua laporan dinas telah diselesaikan atau masih berada di antrean verifikasi.'
              : 'Cobalah gunakan kata kunci lain untuk mencari pekerjaan lapangan.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-2xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Kolom Kiri: Informasi Pekerjaan */}
              <div className="flex flex-col sm:flex-row items-start gap-4 min-w-0 flex-1">
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => onViewDetail(report)}
                  onKeyDown={(e) => e.key === 'Enter' && onViewDetail(report)}
                  className="relative w-full sm:w-44 h-36 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200 cursor-pointer group"
                >
                  <Image
                    src={report.imageUrl}
                    alt={report.title}
                    fill
                    unoptimized
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-slate-950/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white text-xs font-semibold gap-1">
                    <Eye className="w-4 h-4" />
                    <span>Lihat Bukti Awal</span>
                  </div>
                </div>

                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {report.trackingCode}
                    </span>
                    <CategoryBadge category={report.category} />
                    <span className="text-[10px] font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md flex items-center gap-1">
                      <Wrench className="w-3 h-3" />
                      Dalam Penanganan
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {report.title}
                  </h3>

                  {/* Catatan Lapangan / Instansi */}
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200/80 text-xs space-y-1">
                    <div className="flex items-center gap-1.5 font-bold text-slate-800">
                      <Building2 className="w-3.5 h-3.5 text-blue-600" />
                      <span>{report.assignedAgency || 'Dinas Teknis Ditugaskan'}</span>
                    </div>
                    <p className="text-slate-600 italic">
                      {report.adminNote
                        ? `"${report.adminNote}"`
                        : '"Tim teknis lapangan sedang melakukan pemeriksaan dan persiapan perbaikan."'}
                    </p>
                  </div>

                  <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-xs">{report.address}</span>
                    </div>
                    <div className="text-slate-400">
                      Kel. {report.village}, Kec. {report.district}
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Aksi Kanan: Tombol Progres & Tuntas */}
              <div className="flex sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenAction(report)}
                  className="min-h-10 px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Selesaikan & Unggah Bukti</span>
                </button>

                <button
                  type="button"
                  onClick={() => onOpenAction(report)}
                  className="min-h-10 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-blue-300 text-slate-700 hover:text-blue-700 hover:bg-blue-50/50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <FileEdit className="w-3.5 h-3.5 text-slate-400" />
                  <span>Perbarui Catatan Lapangan</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetail(report)}
                  className="min-h-9 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-500 hover:bg-slate-50 text-xs font-medium transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3 h-3 text-slate-400" />
                  <span>Detail Berkas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
