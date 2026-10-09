'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  Clock,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  MapPin,
  Calendar,
  UserCheck,
  ShieldCheck,
  ArrowRight,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { Report, IssueCategory } from '@/lib/types';
import CategoryBadge from '@/components/ui/CategoryBadge';

interface AdminPendingQueueViewProps {
  reports: Report[];
  onOpenAction: (report: Report) => void;
  onViewDetail: (report: Report) => void;
}

export default function AdminPendingQueueView({
  reports,
  onOpenAction,
  onViewDetail,
}: AdminPendingQueueViewProps) {
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const [search, setSearch] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedUrgency, setSelectedUrgency] = useState<string>('all');

  const filtered = pendingReports.filter((r) => {
    const matchSearch =
      search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      r.village.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());

    const matchCategory = selectedCategory === 'all' || r.category === selectedCategory;
    const matchUrgency = selectedUrgency === 'all' || r.urgency === selectedUrgency;

    return matchSearch && matchCategory && matchUrgency;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman Antrean Verifikasi */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-amber-500" />
            <span className="text-xs font-semibold text-slate-500">
              Antrean Triage Petugas
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Antrean Verifikasi Pengaduan Masuk
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Tinjau keabsahan bukti foto dan data laporan warga, lalu teruskan disposisi ke dinas teknis terkait untuk segera ditindaklanjuti di lapangan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="bg-amber-50 border border-amber-200 px-3.5 py-2 rounded-xl text-amber-800 flex items-center gap-2">
            <Clock className="w-4 h-4 text-amber-600" />
            <span className="text-xs sm:text-sm font-bold font-mono">
              {pendingReports.length} Laporan Menunggu
            </span>
          </div>
        </div>
      </div>

      {/* 2. Toolbar Penyaringan Antrean */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari kode tracking, jalan, kelurahan, atau kata kunci..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto shrink-0">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-hidden w-1/2 md:w-auto cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="jalan">Jalan Rusak</option>
            <option value="pju">Penerangan / PJU</option>
            <option value="banjir">Banjir & Drainase</option>
            <option value="sampah">Sampah Liar</option>
            <option value="limbah">Limbah</option>
            <option value="fasilitas">Fasilitas Publik</option>
          </select>

          <select
            value={selectedUrgency}
            onChange={(e) => setSelectedUrgency(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-hidden w-1/2 md:w-auto cursor-pointer"
          >
            <option value="all">Semua Urgensi</option>
            <option value="darurat">Darurat</option>
            <option value="tinggi">Tinggi</option>
            <option value="sedang">Sedang</option>
            <option value="rendah">Rendah</option>
          </select>
        </div>
      </div>

      {/* 3. Daftar Kartu Triage Verifikasi */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {pendingReports.length === 0 ? 'Semua Laporan Telah Terverifikasi' : 'Tidak Ada Laporan yang Cocok'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {pendingReports.length === 0
              ? 'Tidak ada antrean validasi yang tertunda saat ini. Semua pengaduan warga telah ditindaklanjuti.'
              : 'Cobalah ubah filter pencarian atau kategori untuk melihat laporan lainnya.'}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filtered.map((report) => (
            <div
              key={report.id}
              className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl p-5 sm:p-6 shadow-2xs transition-all flex flex-col lg:flex-row lg:items-center justify-between gap-5"
            >
              {/* Kolom Info Kiri: Foto & Detail Pelapor */}
              <div className="flex flex-col sm:flex-row items-start gap-4 min-w-0 flex-1">
                {/* Foto Bukti Warga */}
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
                    <span>Lihat Foto</span>
                  </div>
                </div>

                {/* Deskripsi & Metadata */}
                <div className="min-w-0 flex-1 space-y-2">
                  <div className="flex items-center gap-2 flex-wrap">
                    <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                      {report.trackingCode}
                    </span>
                    <CategoryBadge category={report.category} />
                    {report.urgency === 'darurat' && (
                      <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-2 py-0.5 rounded-md uppercase">
                        Darurat
                      </span>
                    )}
                    {report.urgency === 'tinggi' && (
                      <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md uppercase">
                        Urgensi Tinggi
                      </span>
                    )}
                    <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                      <Calendar className="w-3 h-3" />
                      {new Date(report.createdAt).toLocaleDateString('id-ID', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </span>
                  </div>

                  <h3 className="text-base font-bold text-slate-900 leading-snug">
                    {report.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-slate-600 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>

                  <div className="pt-1 flex flex-wrap items-center gap-x-4 gap-y-1.5 text-xs text-slate-500">
                    <div className="flex items-center gap-1 text-slate-600">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate max-w-xs">{report.address}</span>
                    </div>
                    <div className="text-slate-400">
                      Kel. {report.village}, Kec. {report.district}
                    </div>
                    <div className="flex items-center gap-1 text-slate-500 font-medium">
                      <UserCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>{report.reporterAlias} (Terverifikasi)</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Kolom Aksi Kanan: Tombol Tindakan Cepat Petugas */}
              <div className="flex sm:flex-row lg:flex-col items-stretch gap-2 shrink-0 border-t lg:border-t-0 pt-3 lg:pt-0 border-slate-100">
                <button
                  type="button"
                  onClick={() => onOpenAction(report)}
                  className="min-h-10 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center justify-center gap-2 cursor-pointer active:scale-98"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Validasi & Disposisi</span>
                </button>

                <button
                  type="button"
                  onClick={() => onViewDetail(report)}
                  className="min-h-10 px-3.5 py-2 rounded-xl border border-slate-200 hover:border-slate-300 text-slate-700 hover:bg-slate-50 text-xs font-semibold transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5 text-slate-400" />
                  <span>Tinjau Berkas</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
