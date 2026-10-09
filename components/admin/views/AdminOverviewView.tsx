'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  FileText,
  Clock,
  Wrench,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  TrendingUp,
  ShieldCheck,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import { Report } from '@/lib/types';
import { OfficerProfile } from '../AdminLoginForm';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';

interface AdminOverviewViewProps {
  reports: Report[];
  officer: OfficerProfile;
  onNavigateMenu: (menuId: string) => void;
  onOpenAction: (report: Report) => void;
  onViewDetail: (report: Report) => void;
}

export default function AdminOverviewView({
  reports,
  officer,
  onNavigateMenu,
  onOpenAction,
  onViewDetail,
}: AdminOverviewViewProps) {
  const pendingReports = reports.filter((r) => r.status === 'pending');
  const inProgressReports = reports.filter((r) => r.status === 'in_progress');
  const resolvedReports = reports.filter((r) => r.status === 'resolved');

  const pendingCount = pendingReports.length;
  const inProgressCount = inProgressReports.length;
  const resolvedCount = resolvedReports.length;
  const totalCount = reports.length;

  const resolutionRate = totalCount > 0 ? Math.round((resolvedCount / totalCount) * 100) : 0;

  // 3 Laporan pending terbaru yang mendesak untuk diverifikasi
  const urgentPending = [...pendingReports]
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 3);

  // Kategori distribusi
  const categoriesList = [
    { id: 'jalan', label: 'Jalan & Akses Rusak', count: reports.filter((r) => r.category === 'jalan').length },
    { id: 'pju', label: 'Penerangan & Listrik', count: reports.filter((r) => r.category === 'pju').length },
    { id: 'banjir', label: 'Banjir & Genangan', count: reports.filter((r) => r.category === 'banjir').length },
    { id: 'sampah', label: 'Kebersihan & Sampah', count: reports.filter((r) => r.category === 'sampah').length },
    { id: 'limbah', label: 'Limbah & Sanitasi', count: reports.filter((r) => r.category === 'limbah').length },
    { id: 'fasilitas', label: 'Fasilitas Umum', count: reports.filter((r) => r.category === 'fasilitas').length },
  ];

  // Sebaran kecamatan
  const districtCounts: Record<string, number> = {};
  reports.forEach((r) => {
    districtCounts[r.district] = (districtCounts[r.district] || 0) + 1;
  });
  const topDistricts = Object.entries(districtCounts)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  // Format tanggal hari ini
  const todayFormatted = new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Sambutan Petugas & Ringkasan Hari Ini */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-xs font-semibold text-slate-500">
              Sistem Pengaduan Online • Kota Bengkulu
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Selamat Bertugas, {officer.nama}
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
            {officer.jabatan} • {officer.instansi}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0 self-start sm:self-auto">
          <div className="text-right hidden md:block">
            <div className="text-xs font-semibold text-slate-900">{todayFormatted}</div>
            <div className="text-[11px] text-slate-400 font-mono">
              NIP: {officer.nip}
            </div>
          </div>
          <button
            type="button"
            onClick={() => onNavigateMenu('pending')}
            className="min-h-10 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 cursor-pointer active:scale-98"
          >
            <span>Verifikasi Antrean ({pendingCount})</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Empat Kartu KPI Eksekutif (Bersih, Minimalis, Interaktif) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* KPI 1: Total Pengaduan */}
        <button
          type="button"
          onClick={() => onNavigateMenu('all_reports')}
          className="text-left bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-600 transition-colors">
              Total Pengaduan
            </span>
            <div className="w-8 h-8 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center transition-colors">
              <FileText className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {totalCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">laporan</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Database lengkap</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* KPI 2: Menunggu Verifikasi */}
        <button
          type="button"
          onClick={() => onNavigateMenu('pending')}
          className="text-left bg-white border border-slate-200/90 hover:border-amber-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-amber-700 transition-colors">
              Menunggu Validasi
            </span>
            <div className="w-8 h-8 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center transition-colors">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {pendingCount}
            </span>
            {pendingCount > 0 && (
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 border border-amber-200 px-1.5 py-0.5 rounded-md">
                Perlu Tindakan
              </span>
            )}
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Triage & validasi</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* KPI 3: Sedang Ditangani */}
        <button
          type="button"
          onClick={() => onNavigateMenu('in_progress')}
          className="text-left bg-white border border-slate-200/90 hover:border-blue-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-blue-700 transition-colors">
              Sedang Ditangani
            </span>
            <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center transition-colors">
              <Wrench className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {inProgressCount}
            </span>
            <span className="text-xs text-slate-400 font-medium">proses</span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Pengerjaan lapangan</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>

        {/* KPI 4: Tuntas Selesai */}
        <button
          type="button"
          onClick={() => onNavigateMenu('resolved')}
          className="text-left bg-white border border-slate-200/90 hover:border-emerald-400 rounded-2xl p-4 sm:p-5 transition-all shadow-2xs hover:shadow-xs group cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-500 group-hover:text-emerald-700 transition-colors">
              Tuntas Terselesaikan
            </span>
            <div className="w-8 h-8 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center transition-colors">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              {resolvedCount}
            </span>
            <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-1.5 py-0.5 rounded-md">
              {resolutionRate}% Tuntas
            </span>
          </div>
          <div className="mt-2 text-[11px] text-slate-500 flex items-center gap-1">
            <span>Arsip bukti fisik</span>
            <ChevronRight className="w-3 h-3 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </div>
        </button>
      </div>

      {/* 3. Grid Dua Kolom Utama */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Kolom Kiri: Antrean Mendesak & Linimasa Penanganan (7 Kolom) */}
        <div className="lg:col-span-7 space-y-6">
          {/* Card: Antrean Laporan Baru Butuh Verifikasi Cepat */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Antrean Verifikasi Mendesak
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Laporan warga terbaru yang membutuhkan validasi keabsahan
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateMenu('pending')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Lihat Semua ({pendingCount})</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="divide-y divide-slate-100 mt-2">
              {urgentPending.length === 0 ? (
                <div className="py-8 text-center">
                  <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <p className="text-xs font-semibold text-slate-800">
                    Antrean Bersih
                  </p>
                  <p className="text-[11px] text-slate-400 mt-0.5">
                    Semua laporan warga telah diverifikasi oleh tim petugas.
                  </p>
                </div>
              ) : (
                urgentPending.map((report) => (
                  <div
                    key={report.id}
                    className="py-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 group"
                  >
                    <div className="flex items-start gap-3 min-w-0">
                      <div className="relative w-14 h-14 rounded-xl overflow-hidden bg-slate-100 shrink-0 border border-slate-200/80">
                        <Image
                          src={report.imageUrl}
                          alt={report.title}
                          fill
                          unoptimized
                          className="object-cover group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2 flex-wrap mb-1">
                          <span className="font-mono text-[10px] font-bold text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                            {report.trackingCode}
                          </span>
                          <CategoryBadge category={report.category} />
                          {report.urgency === 'darurat' && (
                            <span className="text-[10px] font-bold text-rose-700 bg-rose-50 border border-rose-200 px-1.5 py-0.5 rounded-md">
                              Darurat
                            </span>
                          )}
                        </div>
                        <h4 className="text-xs sm:text-sm font-bold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors">
                          {report.title}
                        </h4>
                        <p className="text-[11px] text-slate-400 truncate mt-0.5">
                          {report.village}, Kec. {report.district}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0 self-end sm:self-center">
                      <button
                        type="button"
                        onClick={() => onViewDetail(report)}
                        className="px-2.5 py-1.5 rounded-lg border border-slate-200 hover:border-slate-300 text-slate-600 text-xs font-semibold hover:bg-slate-50 transition-colors cursor-pointer"
                      >
                        Detail
                      </button>
                      <button
                        type="button"
                        onClick={() => onOpenAction(report)}
                        className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold transition-colors cursor-pointer shadow-2xs"
                      >
                        Tinjau & Validasi
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Card: Aktivitas Penanganan Terkini */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="pb-4 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Linimasa Aktivitas Terkini
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Rekam jejak tindakan petugas dinas di lapangan
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-4">
              {reports.slice(0, 4).map((r, idx) => {
                const latestTimeline = r.timeline[r.timeline.length - 1];
                return (
                  <div key={r.id + idx} className="flex items-start gap-3 text-xs">
                    <div className="w-2 h-2 rounded-full bg-blue-600 mt-1.5 shrink-0" />
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-bold text-slate-800 truncate">
                          {latestTimeline ? latestTimeline.title : r.title}
                        </span>
                        <span className="text-[10px] text-slate-400 font-mono shrink-0">
                          {latestTimeline ? latestTimeline.date : 'Baru saja'}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-1">
                        {latestTimeline ? latestTimeline.note : r.description}
                      </p>
                      <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                        {r.trackingCode} • {latestTimeline?.actor || r.assignedAgency || 'Sistem TRACE'}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Distribusi Kategori, Sebaran Wilayah, Aksi Cepat (5 Kolom) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Card: Distribusi Kategori Masalah */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="pb-4 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 tracking-tight">
                Distribusi Kategori Pengaduan
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                Frekuensi keluhan infrastruktur warga
              </p>
            </div>

            <div className="mt-4 space-y-3">
              {categoriesList.map((cat) => {
                const pct = totalCount > 0 ? Math.round((cat.count / totalCount) * 100) : 0;
                return (
                  <div key={cat.id} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-medium text-slate-700">{cat.label}</span>
                      <span className="font-mono text-[11px] text-slate-500 font-semibold">
                        {cat.count} ({pct}%)
                      </span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                      <div
                        className="h-full bg-blue-600 rounded-full transition-all duration-500"
                        style={{ width: `${Math.max(pct, 4)}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card: Sebaran Per Kecamatan */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs">
            <div className="pb-3 border-b border-slate-100 flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 tracking-tight">
                  Sebaran Titik Per Kecamatan
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  Konsentrasi laporan di Kota Bengkulu
                </p>
              </div>
              <button
                type="button"
                onClick={() => onNavigateMenu('map_distribution')}
                className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 transition-colors cursor-pointer"
              >
                <span>Lihat GIS</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="mt-3 divide-y divide-slate-100">
              {topDistricts.map(([districtName, count], idx) => (
                <div key={districtName} className="py-2.5 flex items-center justify-between text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-5 h-5 rounded-md bg-slate-100 text-slate-600 font-mono font-bold text-[10px] flex items-center justify-center">
                      #{idx + 1}
                    </span>
                    <span className="font-medium text-slate-800">
                      Kec. {districtName}
                    </span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 bg-slate-50 px-2 py-0.5 rounded border border-slate-200">
                    {count} laporan
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Card: Pintasan Akses Cepat */}
          <div className="bg-white border border-slate-200/90 rounded-2xl p-5 shadow-2xs space-y-2.5">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Pintasan Aksi Dinas
            </h4>

            <Link
              href="/peta"
              className="w-full min-h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex items-center justify-between group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                  <MapPin className="w-3.5 h-3.5" />
                </div>
                <div className="text-left">
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                    Buka Peta GIS Publik
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Tinjau koordinat titik laporan di peta interaktif
                  </div>
                </div>
              </div>
              <ExternalLink className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
            </Link>

            <button
              type="button"
              onClick={() => onNavigateMenu('all_reports')}
              className="w-full min-h-11 px-3.5 py-2.5 rounded-xl border border-slate-200 hover:border-blue-400 hover:bg-blue-50/50 transition-colors flex items-center justify-between group cursor-pointer text-left"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 rounded-lg bg-slate-100 group-hover:bg-blue-50 text-slate-600 group-hover:text-blue-600 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <div className="text-xs font-bold text-slate-800 group-hover:text-blue-700">
                    Buka Database Lengkap
                  </div>
                  <div className="text-[10px] text-slate-400">
                    Cari, saring, dan ekspor seluruh pengaduan
                  </div>
                </div>
              </div>
              <ChevronRight className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
