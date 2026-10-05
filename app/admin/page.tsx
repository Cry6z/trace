'use client';

import React, { useState, useEffect } from 'react';
import Navbar from '@/components/ui/Navbar';
import ReportDetailModal from '@/components/ui/ReportDetailModal';
import AdminHeader from '@/components/admin/AdminHeader';
import AdminStatsCards from '@/components/admin/AdminStatsCards';
import AdminFilterBar from '@/components/admin/AdminFilterBar';
import AdminReportsTable from '@/components/admin/AdminReportsTable';
import AdminActionModal from '@/components/admin/AdminActionModal';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { Report, ReportStatus } from '@/lib/types';

export default function AdminDashboardPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReport, setSelectedReport] = useState<Report | null>(null);
  const [detailModalReport, setDetailModalReport] = useState<Report | null>(null);

  // Filter States
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Action Form States inside Admin modal
  const [actionStatus, setActionStatus] = useState<ReportStatus>('in_progress');
  const [actionAgency, setActionAgency] = useState<string>('Dinas Lingkungan Hidup');
  const [actionNote, setActionNote] = useState<string>('');
  const [actionEvidenceUrl, setActionEvidenceUrl] = useState<string>(
    'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80'
  );
  const [isUpdating, setIsUpdating] = useState<boolean>(false);
  const [updateSuccess, setUpdateSuccess] = useState<boolean>(false);

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
    setActionAgency(report.assignedAgency || 'Dinas Bina Marga');
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
      actor: actionAgency || 'Petugas Verifikator TRACE',
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

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-6">
        {/* Header Admin */}
        <AdminHeader />

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

        {/* Table Laporan Admin */}
        <AdminReportsTable
          reports={filteredReports}
          onViewDetail={(rep) => setDetailModalReport(rep)}
          onOpenAction={handleOpenActionModal}
        />
      </main>

      {/* Modal Tindak Lanjut Admin */}
      {selectedReport && (
        <AdminActionModal
          report={selectedReport}
          onClose={() => setSelectedReport(null)}
          actionStatus={actionStatus}
          onStatusChange={setActionStatus}
          actionAgency={actionAgency}
          onAgencyChange={setActionAgency}
          actionNote={actionNote}
          onNoteChange={setActionNote}
          actionEvidenceUrl={actionEvidenceUrl}
          onEvidenceUrlChange={setActionEvidenceUrl}
          isUpdating={isUpdating}
          updateSuccess={updateSuccess}
          onSubmit={handleSaveAction}
        />
      )}

      {/* Detail Modal */}
      <ReportDetailModal
        report={detailModalReport}
        onClose={() => setDetailModalReport(null)}
      />
    </div>
  );
}
