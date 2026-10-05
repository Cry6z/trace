'use client';

import React, { useState, useMemo, useEffect } from 'react';
import FullCommunityMap from '@/components/map/FullCommunityMap';
import PetaHeader from '@/components/peta/PetaHeader';
import PetaReportList from '@/components/peta/PetaReportList';
import PetaReportDetail from '@/components/peta/PetaReportDetail';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { Report } from '@/lib/types';

export default function FullPetaPage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [selectedReportId, setSelectedReportId] = useState<string | null>(null);

  // Filter States
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [mobileTab, setMobileTab] = useState<'map' | 'sidebar'>('map');

  // Load custom reports if any from localStorage
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

  // Filtered reports
  const filteredReports = useMemo(() => {
    return reports.filter((item) => {
      const matchCat = selectedCategory === 'all' || item.category === selectedCategory;
      const matchStatus = selectedStatus === 'all' || item.status === selectedStatus;
      const matchSearch =
        searchQuery.trim() === '' ||
        item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.address.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.village.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.trackingCode.toLowerCase().includes(searchQuery.toLowerCase());

      return matchCat && matchStatus && matchSearch;
    });
  }, [reports, selectedCategory, selectedStatus, searchQuery]);

  const activeReport = useMemo(() => {
    return reports.find((r) => r.id === selectedReportId) || null;
  }, [reports, selectedReportId]);

  const handleSelectReport = (report: Report) => {
    setSelectedReportId(report.id);
    setMobileTab('sidebar');
  };

  const handleToggleUpvote = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
  };

  return (
    <div className="h-screen w-screen flex flex-col bg-slate-50 overflow-hidden font-sans text-slate-900">
      {/* Top Header Bar */}
      <PetaHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        mobileTab={mobileTab}
        onMobileTabChange={setMobileTab}
        totalFilteredReports={filteredReports.length}
      />

      {/* Main Split Workspace */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* Left Sidebar: Report List or Full Detail */}
        <aside
          className={`w-full md:w-110 lg:w-120 bg-white border-r border-slate-200/80 flex flex-col z-20 shrink-0 transition-transform ${
            mobileTab === 'sidebar' ? 'flex' : 'hidden md:flex'
          }`}
        >
          {activeReport ? (
            <PetaReportDetail
              report={activeReport}
              onBack={() => setSelectedReportId(null)}
              onToggleUpvote={handleToggleUpvote}
            />
          ) : (
            <PetaReportList
              reports={reports}
              filteredReports={filteredReports}
              selectedReportId={selectedReportId}
              onSelectReport={handleSelectReport}
              selectedCategory={selectedCategory}
              onSelectCategory={setSelectedCategory}
              selectedStatus={selectedStatus}
              onSelectStatus={setSelectedStatus}
            />
          )}
        </aside>

        {/* Right Canvas: Interactive Fullscreen Leaflet Map */}
        <main
          className={`flex-1 h-full relative ${
            mobileTab === 'map' ? 'block' : 'hidden md:block'
          }`}
        >
          <FullCommunityMap
            reports={filteredReports}
            selectedReportId={selectedReportId}
            onSelectReport={handleSelectReport}
            selectedCategory={selectedCategory}
            onCategoryChange={(cat) => setSelectedCategory(cat)}
          />
        </main>
      </div>
    </div>
  );
}
