'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  CheckCircle2,
  Search,
  MapPin,
  Calendar,
  Building2,
  Eye,
  Sparkles,
  ShieldCheck,
} from 'lucide-react';
import { Report } from '@/lib/types';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';

interface AdminResolvedViewProps {
  reports: Report[];
  onViewDetail: (report: Report) => void;
}

export default function AdminResolvedView({
  reports,
  onViewDetail,
}: AdminResolvedViewProps) {
  const resolvedReports = reports.filter((r) => r.status === 'resolved');
  const [search, setSearch] = useState<string>('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  const filtered = resolvedReports.filter((r) => {
    const matchSearch =
      search.trim() === '' ||
      r.title.toLowerCase().includes(search.toLowerCase()) ||
      r.trackingCode.toLowerCase().includes(search.toLowerCase()) ||
      r.village.toLowerCase().includes(search.toLowerCase()) ||
      r.address.toLowerCase().includes(search.toLowerCase());

    const matchCategory = categoryFilter === 'all' || r.category === categoryFilter;

    return matchSearch && matchCategory;
  });

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman Arsip Tuntas */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-emerald-500" />
            <span className="text-xs font-semibold text-slate-500">
              Dokumentasi & Audit Bukti Fisik
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Arsip Pengaduan Tuntas Terverifikasi
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Koleksi perbaikan fisik infrastruktur yang telah rampung dikerjakan oleh dinas terkait, dilengkapi dokumentasi komparasi Sebelum dan Sesudah pengerjaan.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <div className="bg-emerald-50 border border-emerald-200 px-3.5 py-2 rounded-xl text-emerald-800 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span className="text-xs sm:text-sm font-bold font-mono">
              {resolvedReports.length} Laporan Tuntas
            </span>
          </div>
        </div>
      </div>

      {/* 2. Toolbar Pencarian */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-4 shadow-2xs flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari arsip laporan tuntas..."
            className="w-full h-10 pl-9 pr-3 rounded-xl bg-slate-50 border border-slate-200 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 text-xs sm:text-sm text-slate-800 placeholder-slate-400 transition-all outline-hidden"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="h-10 px-3 rounded-xl bg-slate-50 border border-slate-200 text-xs font-medium text-slate-700 focus:bg-white focus:border-blue-600 focus:ring-1 focus:ring-blue-600 transition-all outline-hidden w-full sm:w-auto cursor-pointer"
          >
            <option value="all">Semua Kategori</option>
            <option value="jalan">Jalan Rusak</option>
            <option value="pju">Penerangan / PJU</option>
            <option value="banjir">Banjir & Drainase</option>
            <option value="sampah">Sampah Liar</option>
            <option value="limbah">Limbah</option>
            <option value="fasilitas">Fasilitas Publik</option>
          </select>
        </div>
      </div>

      {/* 3. Grid Komparasi Sebelum & Sesudah */}
      {filtered.length === 0 ? (
        <div className="bg-white border border-slate-200/90 rounded-2xl p-12 text-center shadow-2xs">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-500 flex items-center justify-center mx-auto mb-3">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            {resolvedReports.length === 0 ? 'Belum Ada Arsip Laporan Tuntas' : 'Arsip Tidak Ditemukan'}
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 mt-1 max-w-md mx-auto">
            {resolvedReports.length === 0
              ? 'Laporan yang telah diselesaikan oleh dinas teknis akan terarsip otomatis di halaman ini beserta bukti fisiknya.'
              : 'Gunakan kata kunci atau kategori lain untuk menemukan arsip yang diinginkan.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
          {filtered.map((report) => {
            const resolvedImg =
              report.resolvedImageUrl ||
              'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80';

            return (
              <div
                key={report.id}
                className="bg-white border border-slate-200/90 hover:border-slate-300 rounded-2xl overflow-hidden shadow-2xs transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Foto Komparasi: Sebelum vs Sesudah */}
                  <div className="grid grid-cols-2 gap-1.5 p-3 bg-slate-50 border-b border-slate-100">
                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80">
                      <Image
                        src={report.imageUrl}
                        alt="Kondisi Sebelum"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded">
                        Sebelum
                      </span>
                    </div>

                    <div className="relative aspect-4/3 rounded-xl overflow-hidden bg-slate-200 border border-slate-200/80">
                      <Image
                        src={resolvedImg}
                        alt="Kondisi Sesudah"
                        fill
                        unoptimized
                        className="object-cover"
                      />
                      <span className="absolute bottom-2 left-2 bg-emerald-700/90 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" />
                        Sesudah (Tuntas)
                      </span>
                    </div>
                  </div>

                  {/* Detail Konten */}
                  <div className="p-5 space-y-3">
                    <div className="flex items-center justify-between gap-2 flex-wrap">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-blue-700 bg-blue-50 px-2 py-0.5 rounded-md border border-blue-200">
                          {report.trackingCode}
                        </span>
                        <CategoryBadge category={report.category} />
                      </div>
                      <StatusBadge status="resolved" />
                    </div>

                    <h3 className="text-base font-bold text-slate-900 leading-snug">
                      {report.title}
                    </h3>

                    {/* Instansi & Catatan Selesai */}
                    <div className="p-3 rounded-xl bg-emerald-50/50 border border-emerald-100 text-xs space-y-1">
                      <div className="flex items-center gap-1.5 font-bold text-emerald-900">
                        <Building2 className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{report.assignedAgency || 'Dinas Terkait'}</span>
                      </div>
                      <p className="text-slate-600">
                        {report.adminNote || 'Penanganan fisik tuntas sesuai standar operasional dinas.'}
                      </p>
                    </div>

                    <div className="flex items-center gap-1 text-xs text-slate-500 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                      <span className="truncate">{report.address}</span>
                    </div>
                  </div>
                </div>

                {/* Footer Card */}
                <div className="px-5 py-3.5 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-medium">
                    <Calendar className="w-3 h-3" />
                    Tuntas:{' '}
                    {new Date(report.updatedAt).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </span>

                  <button
                    type="button"
                    onClick={() => onViewDetail(report)}
                    className="min-h-8 px-3 py-1 rounded-lg border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-bold transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                  >
                    <Eye className="w-3.5 h-3.5 text-slate-400" />
                    <span>Audit Lengkap</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
