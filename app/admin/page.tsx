'use client';

import React, { useState, useEffect } from 'react';
import AdminSidebar, { AdminMenuId } from '@/components/admin/AdminSidebar';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminReportsTable from '@/components/admin/AdminReportsTable';
import AdminActionModal from '@/components/admin/AdminActionModal';
import AdminLoginForm, { OfficerProfile } from '@/components/admin/AdminLoginForm';
import ReportDetailModal from '@/components/ui/ReportDetailModal';
import AdminOverviewView from '@/components/admin/views/AdminOverviewView';
import AdminPendingQueueView from '@/components/admin/views/AdminPendingQueueView';
import AdminInProgressView from '@/components/admin/views/AdminInProgressView';
import AdminResolvedView from '@/components/admin/views/AdminResolvedView';
import AdminMapDistributionView from '@/components/admin/views/AdminMapDistributionView';
import { Report, ReportStatus } from '@/lib/types';
import { getReports, getCachedReports, updateReportStatusInSupabase, DUMMY_TRACKING_CODES } from '@/lib/services/reportService';

export default function AdminDashboardPage() {
  const [officer, setOfficer] = useState<OfficerProfile | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);

  // Active Menu: Default ke 'dashboard' (Dashboard Awal)
  const [activeMenu, setActiveMenu] = useState<AdminMenuId>('dashboard');

  const [reports, setReports] = useState<Report[]>([]);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalReport, setDetailModalReport] = useState<Report | null>(null);

  // Filter States untuk Tabel Semua Pengaduan
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Action Form States inside Admin modal
  const [actionStatus, setActionStatus] = useState<ReportStatus>('in_progress');
  const [actionAgency, setActionAgency] = useState<string>('Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
  const [actionNote, setActionNote] = useState<string>('');
  const [actionEvidenceUrl, setActionEvidenceUrl] = useState<string>('');
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

  // Load real-time reports from Supabase & Local Cache
  useEffect(() => {
    let isMounted = true;

    // Hidrasi instan dari cache (0ms)
    const cached = getCachedReports();
    if (cached.length > 0) {
      setReports(cached);
    }

    const fetchReports = async () => {
      try {
        const dbReports = await getReports();
        if (!isMounted) return;

        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('trace_user_reports');
          if (stored) {
            try {
              const local: Report[] = JSON.parse(stored);
              const cleanLocal = local.filter((r) => !DUMMY_TRACKING_CODES.has(r.trackingCode) && !DUMMY_TRACKING_CODES.has(r.id));
              const dbCodes = new Set(dbReports.map((r) => r.trackingCode));
              const freshLocal = cleanLocal.filter((r) => !dbCodes.has(r.trackingCode));
              setReports([...freshLocal, ...dbReports]);
              return;
            } catch {}
          }
        }

        setReports(dbReports);
      } catch (err) {
        console.error('Error fetching admin reports:', err);
      }
    };

    fetchReports();

    return () => {
      isMounted = false;
    };
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

  const handleOpenActionModal = (report: Report, targetStatus?: ReportStatus) => {
    setSelectedReport(report);
    setActionStatus(targetStatus || (report.status === 'pending' ? 'in_progress' : report.status));
    setActionAgency(officer?.instansi || report.assignedAgency || 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
    setActionNote(report.adminNote || '');
    setActionEvidenceUrl(report.resolvedImageUrl || '');
    setUpdateSuccess(false);
  };

  const handleSaveAction = async (e: React.FormEvent) => {
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

    const officerActorName = officer 
      ? `${officer.nama} (${officer.instansi.split(' ')[0]} ${officer.instansi.split(' ')[1] || ''})` 
      : actionAgency;

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
      evidenceUrl: actionStatus === 'resolved' && actionEvidenceUrl ? actionEvidenceUrl : undefined,
    };

    const resolvedImg = actionStatus === 'resolved' && actionEvidenceUrl ? actionEvidenceUrl : selectedReport.resolvedImageUrl;

    // 1. Simpan perubahan ke database Supabase
    try {
      await updateReportStatusInSupabase(
        selectedReport.id,
        actionStatus,
        actionAgency,
        actionNote || undefined,
        resolvedImg,
        newTimelineEvent,
        selectedReport.trackingCode
      );
    } catch (err) {
      console.error('Gagal sinkron update status ke Supabase:', err);
    }

    // 2. Perbarui state lokal & cache localStorage
    const updated = reports.map((r) => {
      if (r.id === selectedReport.id) {
        return {
          ...r,
          status: actionStatus,
          assignedAgency: actionAgency,
          adminNote: actionNote || r.adminNote,
          resolvedImageUrl: resolvedImg,
          timeline: [...r.timeline, newTimelineEvent],
          updatedAt: new Date().toISOString(),
        };
      }
      return r;
    });

    setReports(updated);
    if (typeof window !== 'undefined') {
      localStorage.setItem('trace_user_reports', JSON.stringify(updated));
    }

    setIsUpdating(false);
    setUpdateSuccess(true);

    setTimeout(() => {
      setSelectedReport(null);
    }, 1000);
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
    <div className="h-screen w-full overflow-hidden flex bg-slate-50/70 antialiased">
      {/* 1. Sidebar Khusus Petugas Dinas (Terkunci Diam di Tempat Saat Scroll) */}
      {officer && (
        <AdminSidebar
          activeMenu={activeMenu}
          onMenuSelect={(menu) => setActiveMenu(menu)}
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

      {/* 2. Area Konten Utama Kanan: Memiliki Independent Scrollbar Sehingga Sidebar Selalu Diam di Tempat */}
      <div className="flex-1 h-full min-w-0 flex flex-col overflow-y-auto">
        {/* Header Atas Panel Dinas */}
        {officer && (
          <AdminHeader
            officer={officer}
            activeMenu={activeMenu}
            onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
            onLogout={handleLogout}
          />
        )}

        {/* Konten Halaman Admin Berdasarkan Menu yang Dipilih */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto space-y-6 pb-16">
          {/* MENU 1: DASHBOARD UTAMA (RINGKASAN & METRIK AWAL) */}
          {activeMenu === 'dashboard' && (
            <AdminOverviewView
              reports={reports}
              officer={officer!}
              onNavigateMenu={(menuId) => setActiveMenu(menuId as AdminMenuId)}
              onOpenAction={handleOpenActionModal}
              onViewDetail={(r) => setDetailModalReport(r)}
            />
          )}

          {/* MENU 2: SEMUA PENGADUAN (DATABASE TABEL & MULTI-FILTER) */}
          {activeMenu === 'all_reports' && (
            <>
              {/* Metrik Cepat */}
              <AdminStatsCards
                pendingCount={pendingCount}
                inProgressCount={inProgressCount}
                resolvedCount={resolvedCount}
                totalCount={reports.length}
                activeFilter={statusFilter}
                onSelectFilter={(st) => setStatusFilter(statusFilter === st ? 'all' : st)}
              />

              {/* Workspace Terpadu Tabel Pengaduan */}
              <AdminReportsTable
                reports={filteredReports}
                totalReportsCount={reports.length}
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                categoryFilter={categoryFilter}
                onCategoryChange={setCategoryFilter}
                onOpenAction={handleOpenActionModal}
                onViewDetail={(r: Report) => setDetailModalReport(r)}
                onResetFilters={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setCategoryFilter('all');
                }}
              />
            </>
          )}

          {/* MENU 3: ANTREAN VERIFIKASI (TRIAGE & VALIDASI MASUK) */}
          {activeMenu === 'pending' && (
            <AdminPendingQueueView
              reports={reports}
              onOpenAction={handleOpenActionModal}
              onViewDetail={(r) => setDetailModalReport(r)}
            />
          )}

          {/* MENU 4: SEDANG DITANGANI (MONITORING PENGERJAAN LAPANGAN) */}
          {activeMenu === 'in_progress' && (
            <AdminInProgressView
              reports={reports}
              onOpenAction={handleOpenActionModal}
              onViewDetail={(r) => setDetailModalReport(r)}
            />
          )}

          {/* MENU 5: TUNTAS SELESAI (ARSIP & BUKTI FISIK SEBELUM/SESUDAH) */}
          {activeMenu === 'resolved' && (
            <AdminResolvedView
              reports={reports}
              onViewDetail={(r) => setDetailModalReport(r)}
            />
          )}

          {/* MENU 6: SEBARAN WILAYAH & GIS (ANALISIS PER KECAMATAN) */}
          {activeMenu === 'map_distribution' && (
            <AdminMapDistributionView
              reports={reports}
              onNavigateToReports={(cat?: string) => {
                if (cat) setCategoryFilter(cat);
                setActiveMenu('all_reports');
              }}
            />
          )}
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
