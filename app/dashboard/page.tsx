'use client';

import React, { useState, useEffect, useMemo, useCallback } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import UserSidebar, { UserDashboardTab } from '@/components/dashboard/UserSidebar';
import UserHeader from '@/components/dashboard/UserHeader';
import UserProfileBanner from '@/components/dashboard/UserProfileBanner';
import DashboardStatsCards from '@/components/dashboard/DashboardStatsCards';
import MonitoringFilterBar from '@/components/dashboard/MonitoringFilterBar';
import UserReportCard from '@/components/dashboard/UserReportCard';
import UserTicketsView from '@/components/dashboard/UserTicketsView';
import LogoutConfirmModal from '@/components/dashboard/LogoutConfirmModal';
import ReportDetailModal from '@/components/ui/ReportDetailModal';
import UserProfileView from '@/components/dashboard/UserProfileView';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { Report } from '@/lib/types';
import { PlusCircle, Inbox, Lock, ArrowRight, ArrowLeft, ShieldCheck, UserCheck } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { 
  getUserSession, 
  setUserSession, 
  logoutUser, 
  AUTH_CHANGE_EVENT, 
  UserSession, 
  INITIAL_REGISTERED_CITIZENS 
} from '@/lib/auth';

export default function UserDashboardPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [userInfo, setUserInfo] = useState<UserSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [activeTab, setActiveTab] = useState<UserDashboardTab>('monitoring');
  const [isMobileSidebarOpen, setIsMobileSidebarOpen] = useState<boolean>(false);
  const [reports, setReports] = useState<Report[]>([]);
  const [activeReportModal, setActiveReportModal] = useState<Report | null>(null);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState<boolean>(false);
  const [isLoggingOut, setIsLoggingOut] = useState<boolean>(false);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Filter & Search states
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // 1. Muat Sesi Autentikasi Pengguna
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncAuth = () => {
        const user = getUserSession();
        setUserInfo(user);

        // Baca query parameter tab jika diarahkan dari menu profil navbar
        const params = new URLSearchParams(window.location.search);
        const tabParam = params.get('tab') as UserDashboardTab;
        if (tabParam && ['monitoring', 'riwayat', 'profil'].includes(tabParam)) {
          setActiveTab(tabParam);
        }
      };

      syncAuth();

      // Muat data laporan
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
      setReports([...customReports, ...baseReports]);
      setIsCheckingAuth(false);

      window.addEventListener(AUTH_CHANGE_EVENT, syncAuth);
      window.addEventListener('storage', syncAuth);

      return () => {
        window.removeEventListener(AUTH_CHANGE_EVENT, syncAuth);
        window.removeEventListener('storage', syncAuth);
      };
    }
  }, []);

  // Handle Segarkan Data Laporan
  const handleRefresh = () => {
    setIsRefreshing(true);
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const storedReports = localStorage.getItem('trace_user_reports');
        let customReports: Report[] = [];
        if (storedReports) {
          try {
            customReports = JSON.parse(storedReports);
          } catch {
            // ignore
          }
        }
        setReports([...customReports, ...INITIAL_REPORTS.slice(0, 3)]);
      }
      setIsRefreshing(false);
      toast.success('Status Terkini Dimuat', 'Data pemantauan pengaduan telah diperbarui.');
    }, 500);
  };

  // Handle Masuk Cepat Akun Demo untuk Pengujian
  const handleUseDemoAccount = () => {
    const demo = INITIAL_REGISTERED_CITIZENS[0];
    const demoProfile: UserSession = {
      id: demo.id,
      nama: demo.namaLengkap,
      nikMasked: demo.nikMasked,
      phoneMasked: demo.phoneMasked,
      nikHash: demo.nikHash,
      kecamatan: demo.kecamatan,
      kelurahan: demo.kelurahan,
      isLoggedIn: true,
      loginAt: new Date().toISOString(),
    };
    setUserSession(demoProfile);
    setUserInfo(demoProfile);
    toast.success('Sesi Demo Aktif', `Selamat datang kembali, ${demo.namaLengkap}.`);
  };

  // Handle Log Out Sistem (Bebas Macet / Stuck)
  const handleConfirmLogout = () => {
    setIsLoggingOut(true);
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    logoutUser();
    setIsLogoutModalOpen(false);
    toast.success('Berhasil Keluar', 'Sesi akun TRACE Anda telah diakhiri.');

    // Hard redirect untuk memastikan seluruh state dan memori terefresh bersih
    setTimeout(() => {
      window.location.href = '/';
    }, 200);
  };

  // Filter dan Pencarian Laporan
  const filteredReports = useMemo(() => {
    return reports.filter((r) => {
      if (filterStatus !== 'all' && r.status !== filterStatus) return false;
      if (selectedCategory !== 'all' && r.category !== selectedCategory) return false;
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase();
        const matchTitle = r.title.toLowerCase().includes(q);
        const matchTracking = r.trackingCode.toLowerCase().includes(q);
        const matchAddress = r.address.toLowerCase().includes(q);
        const matchVillage = r.village.toLowerCase().includes(q);
        const matchDistrict = r.district.toLowerCase().includes(q);
        return matchTitle || matchTracking || matchAddress || matchVillage || matchDistrict;
      }
      return true;
    });
  }, [reports, filterStatus, selectedCategory, searchQuery]);

  const pendingCount = reports.filter((r) => r.status === 'pending').length;
  const inProgressCount = reports.filter((r) => r.status === 'in_progress').length;
  const resolvedCount = reports.filter((r) => r.status === 'resolved').length;

  const handleResetFilters = () => {
    setFilterStatus('all');
    setSelectedCategory('all');
    setSearchQuery('');
  };

  // Layar Loading Sesi
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-xs font-medium">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span>Memeriksa sesi warga...</span>
        </div>
      </div>
    );
  }

  // JIKA BELUM LOGIN / SUDAH LOGOUT: Tampilkan Layar Masuk yang Minimalis & Tegas
  if (!userInfo) {
    return (
      <div className="min-h-screen bg-slate-50/80 flex flex-col justify-center items-center p-4 sm:p-6 lg:p-8 antialiased">
        <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 lg:p-9 border border-slate-200/80 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
          {/* Icon Gembok & Header */}
          <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
            <Lock className="w-8 h-8 stroke-[1.8]" />
          </div>

          <div className="space-y-2">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
              Akses Masuk Warga TRACE
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
              Anda belum masuk ke sistem. Silakan verifikasi NIK dan nomor WhatsApp Anda untuk memantau progres pengaduan secara personal.
            </p>
          </div>

          {/* Status Sistem */}
          <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-800 text-xs flex items-center gap-2.5 text-left">
            <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
            <span className="leading-relaxed">
              Sistem TRACE menjamin verifikasi pelaporan warga Kota Bengkulu yang valid dan terpercaya.
            </span>
          </div>

          {/* Tombol Aksi */}
          <div className="space-y-3 pt-2">
            <Link
              href="/masuk"
              className="w-full min-h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <span>Masuk dengan NIK & OTP</span>
              <ArrowRight className="w-4 h-4" />
            </Link>

            <button
              type="button"
              onClick={handleUseDemoAccount}
              className="w-full min-h-11.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 focus-visible:outline-2 focus-visible:outline-slate-600"
            >
              <UserCheck className="w-4 h-4 text-slate-500" />
              <span>Gunakan Sesi Demo (Budi Santoso)</span>
            </button>

            <div className="pt-2">
              <Link
                href="/"
                className="inline-block text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
              >
                &larr; Beranda Utama
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // TAMPILAN DASHBOARD PENUH JIKA SUDAH MASUK (LOGGED IN)
  return (
    <div className="min-h-screen bg-slate-50/60 flex antialiased">
      {/* 1. Sidebar Navigasi Kiri (Fixed Desktop & Off-Canvas Mobile) */}
      <UserSidebar
        activeTab={activeTab}
        onTabChange={(tab) => setActiveTab(tab)}
        userName={userInfo.nama}
        nikMasked={userInfo.nikMasked}
        totalReports={reports.length}
        onOpenLogout={() => setIsLogoutModalOpen(true)}
        isMobileOpen={isMobileSidebarOpen}
        onCloseMobile={() => setIsMobileSidebarOpen(false)}
      />

      {/* 2. Area Konten Utama Kanan (Spacious & Breathable Layout) */}
      <div className="flex-1 md:pl-72 flex flex-col min-h-screen w-full min-w-0">
        {/* Header Atas Navigasi & Mobile Toggle */}
        <UserHeader
          activeTab={activeTab}
          userName={userInfo.nama}
          onOpenMobileSidebar={() => setIsMobileSidebarOpen(true)}
          onOpenLogout={() => setIsLogoutModalOpen(true)}
        />

        {/* Konten Halaman Sesuai Tab Aktif */}
        <main className="flex-1 p-3.5 sm:p-8 lg:p-10 max-w-7xl w-full mx-auto space-y-6 sm:space-y-10">
          {/* TAB 1: PEMANTAUAN PROGRES LAPORAN (DEFAULT FEED) */}
          {activeTab === 'monitoring' && (
            <div className="space-y-6 sm:space-y-10 animate-in fade-in duration-200">
              {/* Profil Banner Pengguna */}
              <UserProfileBanner
                nama={userInfo.nama}
                nikMasked={userInfo.nikMasked}
                phoneMasked={userInfo.phoneMasked}
                totalReports={reports.length}
              />

              {/* 4 Kartu Metrik Status (2 Kolom Mobile yang Rapi & Seimbang) */}
              <DashboardStatsCards
                totalCount={reports.length}
                pendingCount={pendingCount}
                inProgressCount={inProgressCount}
                resolvedCount={resolvedCount}
                filterStatus={filterStatus}
                onSelectFilter={setFilterStatus}
              />

              {/* Filter & Search Bar */}
              <MonitoringFilterBar
                searchQuery={searchQuery}
                onSearchChange={setSearchQuery}
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                filteredCount={filteredReports.length}
                totalCount={reports.length}
                onResetFilters={handleResetFilters}
                onRefresh={handleRefresh}
                isRefreshing={isRefreshing}
              />

              {/* Feed Laporan Pengaduan */}
              <section aria-label="Daftar Pengaduan Warga" className="space-y-5 sm:space-y-6">
                <div className="flex items-center justify-between">
                  <h2 className="text-base sm:text-xl font-bold text-slate-900 tracking-tight">
                    Progres & Milestone Penanganan
                  </h2>
                  <span className="text-xs text-slate-500 font-medium">
                    Menampilkan {filteredReports.length} laporan
                  </span>
                </div>

                {filteredReports.length === 0 ? (
                  <div className="bg-white rounded-3xl p-8 sm:p-14 text-center border border-slate-200/80 shadow-xs space-y-4 max-w-xl mx-auto">
                    <div className="w-14 sm:w-16 h-14 sm:h-16 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-xs">
                      <Inbox className="w-7 sm:w-8 h-7 sm:h-8 stroke-[1.8]" />
                    </div>
                    <div className="space-y-1.5">
                      <h3 className="font-bold text-slate-900 text-base sm:text-lg">
                        Tidak Ada Pengaduan yang Cocok
                      </h3>
                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-md mx-auto">
                        Belum ada laporan yang sesuai dengan filter atau kata kunci pencarian Anda. Anda dapat mereset filter atau membuat laporan baru.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 pt-2">
                      <button
                        type="button"
                        onClick={handleResetFilters}
                        className="min-h-11 px-4 py-2 rounded-xl border border-slate-200 text-slate-700 text-xs font-semibold hover:bg-slate-50 transition-all"
                      >
                        Reset Semua Filter
                      </button>
                      <Link
                        href="/dashboard/buat-laporan"
                        className="min-h-11 inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold shadow-md shadow-blue-500/20 active:scale-95 transition-all"
                      >
                        <PlusCircle className="w-4 h-4" />
                        <span>Buat Pengaduan Baru</span>
                      </Link>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-5 sm:space-y-6">
                    {filteredReports.map((report) => (
                      <UserReportCard
                        key={report.id}
                        report={report}
                        onViewDetail={(rep) => setActiveReportModal(rep)}
                      />
                    ))}
                  </div>
                )}
              </section>
            </div>
          )}

          {/* TAB 2: RIWAYAT & ARSIP SELURUH TIKET */}
          {activeTab === 'riwayat' && (
            <UserTicketsView
              reports={reports}
              onViewDetail={(rep) => setActiveReportModal(rep)}
            />
          )}

          {/* TAB 3: PROFIL & IDENTITAS KTP WARGA */}
          {activeTab === 'profil' && (
            <UserProfileView
              user={userInfo}
              totalReports={reports.length}
            />
          )}
        </main>
      </div>

      {/* Modal Detail & Riwayat Pengaduan */}
      <ReportDetailModal
        report={activeReportModal}
        onClose={() => setActiveReportModal(null)}
      />

      {/* Modal Konfirmasi Log Out Sistem (Z-Index Tinggi z-[90]) */}
      <LogoutConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleConfirmLogout}
        userName={userInfo.nama}
        isLoading={isLoggingOut}
      />
    </div>
  );
}
