'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Navbar from '@/components/ui/Navbar';
import ReportDetailModal from '@/components/ui/ReportDetailModal';
import UserProfileBanner from '@/components/dashboard/UserProfileBanner';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import UserReportCard from '@/components/dashboard/UserReportCard';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { Report } from '@/lib/types';
import { PlusCircle, AlertCircle } from 'lucide-react';

export default function UserDashboardPage() {
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReportModal, setActiveReportModal] = useState<Report | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const [userInfo, setUserInfo] = useState<{
    nama: string;
    nikMasked: string;
    phoneMasked: string;
  }>({
    nama: 'Budi Santoso',
    nikMasked: '3174**********03',
    phoneMasked: '0812****8821',
  });

  useEffect(() => {
    // Muat session user jika ada
    if (typeof window !== 'undefined') {
      const storedUser = sessionStorage.getItem('trace_user');
      let parsedUser: typeof userInfo | null = null;
      if (storedUser) {
        try {
          parsedUser = JSON.parse(storedUser);
        } catch {
          // ignore
        }
      }

      // Gabungkan laporan custom user dengan mock data awal
      const storedReports = localStorage.getItem('trace_user_reports');
      let customReports: Report[] = [];
      if (storedReports) {
        try {
          customReports = JSON.parse(storedReports);
        } catch {
          // ignore
        }
      }

      const baseReports = INITIAL_REPORTS.slice(0, 3);
      const combined = [...customReports, ...baseReports];

      queueMicrotask(() => {
        if (parsedUser) setUserInfo(parsedUser);
        setReports(combined);
      });
    }
  }, []);

  const filteredReports = reports.filter((r) => {
    if (filterStatus === 'all') return true;
    return r.status === filterStatus;
  });

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-6 pb-28 md:py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6 sm:space-y-8">
        {/* Top Profile Banner */}
        <UserProfileBanner
          nama={userInfo.nama}
          nikMasked={userInfo.nikMasked}
          phoneMasked={userInfo.phoneMasked}
        />

        {/* Metrics Counter */}
        <DashboardStatsCards
          totalCount={reports.length}
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
          resolvedCount={resolvedCount}
          filterStatus={filterStatus}
          onSelectFilter={setFilterStatus}
        />

        {/* List of Reports & Timeline Monitoring */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Pemantauan Progres Pengaduan Anda
            </h2>
            <span className="text-xs text-slate-500">
              Menampilkan {filteredReports.length} laporan
            </span>
          </div>

          {filteredReports.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-slate-200 space-y-3">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto">
                <AlertCircle className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-slate-800 text-sm">
                Belum Ada Pengaduan dalam Kategori Ini
              </h3>
              <p className="text-xs text-slate-500 max-w-sm mx-auto">
                Anda dapat membuat pengaduan baru terkait fasilitas atau kebersihan lingkungan sekarang juga.
              </p>
              <Link
                href="/dashboard/buat-laporan"
                className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Buat Pengaduan Baru</span>
              </Link>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredReports.map((report) => (
                <UserReportCard
                  key={report.id}
                  report={report}
                  onViewDetail={(rep) => setActiveReportModal(rep)}
                />
              ))}
            </div>
          )}
        </div>
      </main>

      {/* Modal Detail & Timeline Lengkap */}
      <ReportDetailModal
        report={activeReportModal}
        onClose={() => setActiveReportModal(null)}
      />
    </div>
  );
}
