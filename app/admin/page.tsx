'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminFilterBar from '@/components/admin/AdminFilterBar';
import AdminReportsTable from '@/components/admin/AdminReportsTable';
import AdminActionModal from '@/components/admin/AdminActionModal';
import AdminLoginForm, { OfficerProfile } from '@/components/admin/AdminLoginForm';
import ReportDetailModal from '@/components/ui/ReportDetailModal';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { Report, ReportStatus } from '@/lib/types';
import { ShieldCheck } from 'lucide-react';

export default function AdminDashboardPage() {
  const [officer, setOfficer] = useState<OfficerProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalReport, setDetailModalReport] = useState<Report | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Action Form States inside Admin modal
  const [actionStatus, setActionStatus] = useState<ReportStatus>('in_progress');
  const [actionAgency, setActionAgency] = useState<string>('Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
  const [actionNote, setActionNote] = useState<string>('');
  const [actionEvidenceUrl, setActionEvidenceUrl] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80'
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

  // Cek sesi login petugas dinas
  useEffect(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedOfficer = sessionStorage.getItem('trace_admin_officer');
        if (storedOfficer) {
          const parsed = JSON.parse(storedOfficer);
          if (parsed?.nip) {
            setOfficer(parsed);
            setActionAgency(parsed.instansi || 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
          }
        }
      } catch {
        // ignore
      }
      setIsCheckingAuth(false);
    }
  }, []);

  // Load custom reports if any
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('trace_user_reports');
      if (stored) {
        try {
          const custom = JSON.parse(stored);
          const combined = [...custom, ...INITIAL_REPORTS];
          queueMicrotask(() => {
            setReports(combined);
          });
        } catch {
          // ignore
        }
      }
    }
  }, []);

  const handleLoginSuccess = (profile: OfficerProfile) => {
    setOfficer(profile);
    setActionAgency(profile.instansi);
    if (typeof window !== 'undefined') {
      sessionStorage.setItem('trace_admin_officer', JSON.stringify(profile));
    }
  };

  const handleLogout = () => {
    setOfficer(null);
    if (typeof window !== 'undefined') {
      sessionStorage.removeItem('trace_admin_officer');
    }
  };

  const filteredReports = reports.filter((r) => {
    const matchStatus = statusFilter === 'all' || r.status === statusFilter;
    const matchCat = categoryFilter === 'all' || r.category === categoryFilter;
    const matchSearch =
      searchQuery.trim() === '' ||
      r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.trackingCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.village.toLowerCase().includes(searchQuery.toLowerCase());

    return matchStatus && matchCat && matchSearch;
  });

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const handleOpenActionModal = (report: Report) => {
    setSelectedReport(report);
    setActionStatus(report.status === 'pending' ? 'in_progress' : report.status);
    setActionAgency(officer?.instansi || report.assignedAgency || 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
    setActionNote('');
    setUpdateSuccess(false);
  };

  const handleSaveAction = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedReport) return;

    setIsUpdating(true);

    const nowFormatted = new Date().toLocaleString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });

    const officerActorName = officer ? `${officer.nama} (${officer.instansi.split(' ')[0]} ${officer.instansi.split(' ')[1] || ''})` : actionAgency;

    const newTimelineEvent = {
      id: `tl-${Date.now()}`,
      date: nowFormatted,
      status: actionStatus,
      title:
        actionStatus === 'in_progress'
          ? 'Tindak Lanjut Dimulai oleh Petugas'
          : actionStatus === 'resolved'
          ? 'Penanganan Selesai & Terverifikasi'
          : 'Status Laporan Diperbarui',
      note:
        actionNote ||
        (actionStatus === 'resolved'
          ? 'Masalah telah diselesaikan tuntas oleh tim dinas.'
          : 'Sedang dalam penanganan petugas lapangan.'),
      actor: officerActorName,
      evidenceUrl: actionStatus === 'resolved' ? actionEvidenceUrl : undefined,
    };

    const updated = reports.map((r) => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          status: actionStatus,
          assignedAgency: actionAgency,
          adminNote: actionNote || r.adminNote,
          resolvedImageUrl: actionStatus === 'resolved' ? actionEvidenceUrl : r.resolvedImageUrl,
          timeline: [...r.timeline, newTimelineEvent],
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    setTimeout(() => {
      setReports(updated);
      setIsUpdating(false);
      setUpdateSuccess(true);

      setTimeout(() => {
        setSelectedReport(null);
      }, 1000);
    }, 600);
  };

  // Jika belum login sebagai petugas dinas, tampilkan layar login petugas aman
  if (!isCheckingAuth && !officer) {
    return <AdminLoginForm onLoginSuccess={handleLoginSuccess} />;
  }

  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center text-slate-400 text-xs font-mono">
        Memeriksa otorisasi petugas dinas...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50/70 flex antialiased">
      {/* 1. Sidebar Khusus Petugas Dinas */}
      {officer && (
        <AdminSidebar
          statusFilter={statusFilter}
          onStatusChange={setStatusFilter}
          officer={officer}
          onLogout={handleLogout}
          isMobileOpen={isMobileSidebarOpen}
          onCloseMobile={() => setIsMobileSidebarOpen(false)}
          pendingCount={pendingCount}
          inProgressCount={inProgressCount}
          resolvedCount={resolvedCount}
          totalCount={reports.length}
        />
      )}

      {/* 2. Area Konten Utama Kanan (Spacious & Breathable Layout) */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen">
        {/* Header Atas Panel Dinas */}
        {officer && (
          <AdminHeader
            officer={officer}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {/* Konten Halaman Admin */}
        <main className="flex-1 p-5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-8 sm:space-y-10">
          {/* Banner Selamat Datang Petugas */}
          <section className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs flex flex-col lg:flex-row lg:items-center justify-between gap-5">
            <div className="space-y-1.5">
              <div className="flex items-center gap-2">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-50 text-amber-800 border border-amber-200 text-xs font-bold">
                  <ShieldCheck className="w-3.5 h-3.5 text-amber-600" />
                  <span>Portal Komando Petugas Dinas Kota Bengkulu</span>
                </span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Pusat Disposisi & Eksekusi Lapangan
              </h2>
              <p className="text-xs sm:text-sm text-slate-500 max-w-2xl leading-relaxed">
                Tinjau bukti foto dari warga, ubah status penanganan lapangan secara transparan, dan unggah dokumentasi perbaikan setelah pekerjaan selesai.
              </p>
            </div>

            <div className="text-xs font-medium text-slate-500 bg-slate-50 p-4 rounded-2xl border border-slate-200/80 shrink-0">
              <div>Status Filter: <strong className="text-blue-700 uppercase">{statusFilter}</strong></div>
              <div className="mt-1">Menampilkan: <strong className="text-slate-800">{filteredReports.length}</strong> laporan</div>
            </div>
          </section>

          {/* Counter Stats Admin */}
          <AdminStatsCards
            pendingCount={pendingCount}
            inProgressCount={inProgressCount}
            resolvedCount={resolvedCount}
          />

          {/* Filter & Search Bar */}
          <AdminFilterBar
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            statusFilter={statusFilter}
            onStatusChange={setStatusFilter}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
          />

          {/* Table List of Reports (Spacious Table View) */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-xs overflow-hidden">
            <AdminReportsTable
              reports={filteredReports}
              onOpenAction={handleOpenActionModal}
              onViewDetail={(r: Report) => setDetailModalReport(r)}
            />
          </div>
        </main>
      </div>

      {/* Modal Eksekusi & Update Status oleh Petugas */}
      {selectedReport && (
        <AdminActionModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          onSubmit={handleSaveAction}
          isUpdating={isUpdating}
          updateSuccess={updateSuccess}
          actionStatus={actionStatus}
          onStatusChange={setActionStatus}
          actionAgency={actionAgency}
          onAgencyChange={setActionAgency}
          actionNote={actionNote}
          onNoteChange={setActionNote}
          actionEvidenceUrl={actionEvidenceUrl}
          onEvidenceUrlChange={setActionEvidenceUrl}
        />
      )}

      {/* Modal Detail Laporan */}
      <ReportDetailModal
        report={detailModalReport}
        onClose={() => setDetailModalReport(null)}
      />
    </div>
  );
}
