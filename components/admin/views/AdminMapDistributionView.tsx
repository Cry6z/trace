'use client';

import React from 'react';
import Link from 'next/link';
import {
  MapPin,
  ExternalLink,
  Layers,
  Building2,
  AlertTriangle,
  CheckCircle2,
  Clock,
  Wrench,
  Navigation,
} from 'lucide-react';
import { Report } from '@/lib/types';
import CategoryBadge from '@/components/ui/CategoryBadge';

interface AdminMapDistributionViewProps {
  reports: Report[];
  onNavigateToReports: (category?: string) => void;
}

export default function AdminMapDistributionView({
  reports,
  onNavigateToReports,
}: AdminMapDistributionViewProps) {
  // Kompilasi data kecamatan di Kota Bengkulu
  const KECAMATAN_LIST = [
    'Ratu Samban',
    'Gading Cempaka',
    'Ratu Agung',
    'Selebar',
    'Singaran Pati',
    'Muara Bangkahulu',
    'Teluk Segara',
    'Sungai Serut',
    'Kampung Melayu',
  ];

  const districtData = KECAMATAN_LIST.map((kec) => {
    const list = reports.filter((r) => r.district.toLowerCase() === kec.toLowerCase());
    const pending = list.filter((r) => r.status === 'pending').length;
    const inProgress = list.filter((r) => r.status === 'in_progress').length;
    const resolved = list.filter((r) => r.status === 'resolved').length;

    // Cari kategori paling dominan
    const catCounts: Record<string, number> = {};
    list.forEach((r) => {
      catCounts[r.category] = (catCounts[r.category] || 0) + 1;
    });
    const topCategory = Object.entries(catCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || '-';

    return {
      name: kec,
      total: list.length,
      pending,
      inProgress,
      resolved,
      topCategory,
    };
  }).sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-6">
      {/* 1. Header Halaman Sebaran Wilayah */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-5 sm:p-6 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="w-2 h-2 rounded-full bg-blue-600" />
            <span className="text-xs font-semibold text-slate-500">
              Analisis Geospasial Wilayah
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
            Sebaran Titik Pengaduan Per Kecamatan
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 mt-0.5 max-w-2xl">
            Distribusi spasial laporan infrastruktur di 9 wilayah kecamatan Kota Bengkulu untuk memprioritaskan alokasi armada dan regu teknis dinas.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start md:self-auto shrink-0">
          <Link
            href="/peta"
            className="min-h-10 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs sm:text-sm font-bold transition-all shadow-xs flex items-center gap-2 active:scale-98"
          >
            <Navigation className="w-4 h-4" />
            <span>Buka Peta GIS Publik (Layar Penuh)</span>
            <ExternalLink className="w-3.5 h-3.5 opacity-80" />
          </Link>
        </div>
      </div>

      {/* 2. Banner Informasi Peta Interaktif */}
      <div className="bg-blue-50/70 border border-blue-200/80 rounded-2xl p-5 sm:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-2xs">
            <MapPin className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-blue-950">
              Tinjauan Spasial Koordinat Lapangan
            </h3>
            <p className="text-xs text-blue-800/80 mt-0.5 max-w-xl">
              Setiap laporan warga telah diverifikasi dengan koordinat GPS akurat. Anda dapat melihat klaster titik masalah secara interaktif di peta publik Kota Bengkulu.
            </p>
          </div>
        </div>

        <Link
          href="/peta"
          className="min-h-9 px-3.5 py-2 rounded-xl bg-white border border-blue-200 hover:border-blue-400 text-blue-700 text-xs font-bold transition-all shadow-2xs self-start sm:self-auto shrink-0 flex items-center gap-1.5"
        >
          <span>Eksplorasi Peta Interaktif</span>
          <ExternalLink className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* 3. Tabel Distribusi Per Kecamatan */}
      <div className="bg-white border border-slate-200/90 rounded-2xl overflow-hidden shadow-2xs">
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-slate-900 tracking-tight">
              Matriks Laporan Per Kecamatan (9 Wilayah)
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              Rekapitulasi volume masalah dan progres penanganan per wilayah
            </p>
          </div>
          <span className="text-xs font-mono font-bold text-slate-500 bg-slate-100 px-2.5 py-1 rounded-md">
            Total {reports.length} Titik
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="bg-slate-50/80 text-slate-600 border-b border-slate-100 uppercase tracking-wider font-bold text-[11px]">
                <th className="py-3 px-5">Kecamatan</th>
                <th className="py-3 px-4 text-center">Total Titik</th>
                <th className="py-3 px-4 text-center">Menunggu Validasi</th>
                <th className="py-3 px-4 text-center">Sedang Ditangani</th>
                <th className="py-3 px-4 text-center">Tuntas Selesai</th>
                <th className="py-3 px-5">Isu Terbanyak</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {districtData.map((d) => (
                <tr key={d.name} className="hover:bg-slate-50/70 transition-colors">
                  <td className="py-3.5 px-5">
                    <div className="font-bold text-slate-900 text-sm">
                      Kec. {d.name}
                    </div>
                    <span className="text-[11px] text-slate-400">Kota Bengkulu</span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    <span className="font-mono text-sm font-bold text-slate-900 bg-slate-100 px-2.5 py-1 rounded-md">
                      {d.total}
                    </span>
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {d.pending > 0 ? (
                      <span className="font-mono font-bold text-amber-700 bg-amber-50 border border-amber-200 px-2 py-0.5 rounded-md">
                        {d.pending}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">0</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {d.inProgress > 0 ? (
                      <span className="font-mono font-bold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-md">
                        {d.inProgress}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">0</span>
                    )}
                  </td>

                  <td className="py-3.5 px-4 text-center">
                    {d.resolved > 0 ? (
                      <span className="font-mono font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-md">
                        {d.resolved}
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">0</span>
                    )}
                  </td>

                  <td className="py-3.5 px-5">
                    {d.topCategory !== '-' ? (
                      <div className="flex items-center gap-1.5">
                        <CategoryBadge category={d.topCategory as any} />
                      </div>
                    ) : (
                      <span className="text-slate-400 text-[11px] italic">Nihil Laporan</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
