'use client';

import React, { useState } from 'react';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CommunityMap from '@/components/map/CommunityMap';
import ReportDetailModal from '@/components/ui/ReportDetailModal';
import HeroSection from '@/components/landing/HeroSection';
import FeaturedReportsSection from '@/components/landing/FeaturedReportsSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { Report } from '@/lib/types';

export default function HomePage() {
  const [reports, setReports] = useState<Report[]>(INITIAL_REPORTS);
  const [activeReportModal, setActiveReportModal] = useState<Report | null>(null);

  const handleUpvote = (reportId: string) => {
    setReports((prev) =>
      prev.map((r) => (r.id === reportId ? { ...r, upvotes: r.upvotes + 1 } : r))
    );
    if (activeReportModal && activeReportModal.id === reportId) {
      setActiveReportModal((prev) => (prev ? { ...prev, upvotes: prev.upvotes + 1 } : null));
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 flex flex-col selection:bg-blue-100 selection:text-blue-900">
      <Navbar activeTab="map" />

      {/* Main Content Body */}
      <main className="flex-1">
        {/* HERO + PETA KOMUNITAS (Side-by-Side Split Hero Layout) */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8 lg:gap-10 xl:gap-12 items-center">
            
            {/* Left Column: Hero Content & Call to Actions */}
            <div className="lg:col-span-5 xl:col-span-5 flex flex-col justify-center">
              <HeroSection totalReports={reports.length} />
            </div>

            {/* Right Column: GIS Community Map */}
            <div className="lg:col-span-7 xl:col-span-7 flex flex-col">
              {/* Community Map Component */}
              <div className="w-full h-97.5 sm:h-115 lg:h-130 xl:h-135">
                <CommunityMap 
                  reports={reports} 
                  onSelectReport={(rep) => setActiveReportModal(rep)}
                  className="h-full w-full min-h-90 sm:min-h-110 lg:min-h-120"
                />
              </div>
            </div>

          </div>
        </section>

        {/* 2. Laporan Warga Terkini (Interactive Civic Showcase) */}
        <FeaturedReportsSection 
          reports={reports} 
          onSelectReport={(rep) => setActiveReportModal(rep)} 
          onUpvote={handleUpvote} 
        />

        {/* 3. Cara Kerja & Alur Pelaporan */}
        <HowItWorksSection />
      </main>

      {/* Footer */}
      <Footer />

      {/* Detail Modal Dialog */}
      <ReportDetailModal 
        report={activeReportModal} 
        onClose={() => setActiveReportModal(null)} 
        onUpvote={handleUpvote}
      />
    </div>
  );
}

