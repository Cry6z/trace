'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Report } from '@/lib/types';
import { MapPin, ThumbsUp, ArrowUpRight, ArrowRight } from 'lucide-react';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';

interface FeaturedReportsSectionProps {
  reports: Report[];
  onSelectReport: (report: Report) => void;
  onUpvote: (reportId: string) => void;
}

export default function FeaturedReportsSection({
  reports,
  onSelectReport,
  onUpvote,
}: FeaturedReportsSectionProps) {
  const featured = reports.slice(0, 3);

  return (
    <section className="py-12 sm:py-16 lg:py-20 bg-slate-50/60 border-t border-slate-200/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8 sm:mb-10">
          <div>
            <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
              <span>Transparansi Komunitas</span>
            </div>
            <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
              Laporan Warga Terkini di Bengkulu
            </h2>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-xl">
              Pantau laporan aktif dari berbagai titik kota. Warga dapat memberikan dukungan agar laporan diprioritaskan oleh dinas terkait.
            </p>
          </div>

          <Link
            href="/peta"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-blue-600 hover:text-blue-700 hover:underline shrink-0 self-start sm:self-auto py-1"
          >
            <span>Buka Seluruh Titik di Peta</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {/* 3-Card Grid (Reflow: 1-col on phone, 2-col on tablet, 3-col on desktop) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
          {featured.map((report) => (
            <div
              key={report.id}
              tabIndex={0}
              role="button"
              aria-label={`Lihat rincian laporan ${report.title}`}
              onClick={() => onSelectReport(report)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  e.preventDefault();
                  onSelectReport(report);
                }
              }}
              className="card-hover-lift group cursor-pointer rounded-2xl bg-white border border-slate-200/90 shadow-2xs hover:border-blue-300 focus-visible:outline-2 focus-visible:outline-blue-600 flex flex-col overflow-hidden"
            >
              {/* Photo Container */}
              <div className="relative aspect-16/10 w-full bg-slate-100 overflow-hidden">
                {report.imageUrl ? (
                  <Image
                    src={report.imageUrl}
                    alt={report.title}
                    fill
                    unoptimized
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-300 ease-out"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs">
                    Tanpa Foto
                  </div>
                )}
                <div className="absolute inset-0 bg-linear-to-t from-slate-900/40 via-transparent to-transparent opacity-60" />

                {/* Badges on Image */}
                <div className="absolute top-3 left-3">
                  <CategoryBadge category={report.category} />
                </div>
                <div className="absolute top-3 right-3">
                  <StatusBadge status={report.status} />
                </div>

                <div className="absolute bottom-2.5 left-3 right-3 flex items-center justify-between text-white text-[11px] font-mono drop-shadow-xs">
                  <span>{report.trackingCode}</span>
                  <span className="font-sans text-[10px] bg-slate-900/60 backdrop-blur-xs px-2 py-0.5 rounded-full">
                    {report.reporterAlias}
                  </span>
                </div>
              </div>

              {/* Body Content */}
              <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between space-y-3">
                <div className="space-y-2">
                  <h3 className="font-bold text-sm sm:text-base text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-2 leading-snug">
                    {report.title}
                  </h3>
                  <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                    {report.description}
                  </p>
                </div>

                {/* Location & Interaction Strip */}
                <div className="space-y-3 pt-2">
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                    <span className="truncate">
                      {report.village ? `Kel. ${report.village}, ` : ''}
                      {report.district}
                    </span>
                  </div>

                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between">
                    {/* Upvote Button with Tactile Bounce */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onUpvote(report.id);
                      }}
                      className="group/upvote inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-600 text-xs font-semibold border border-slate-200 hover:border-blue-200 transition-all duration-150 active:scale-90"
                      title="Dukung penanganan laporan ini"
                    >
                      <ThumbsUp className="w-3.5 h-3.5 transition-transform duration-150 group-active/upvote:scale-125" />
                      <span>{report.upvotes} Dukungan</span>
                    </button>

                    {/* View Details Link */}
                    <span className="inline-flex items-center gap-1 text-xs font-semibold text-slate-400 group-hover:text-blue-600 transition-colors">
                      <span>Detail</span>
                      <ArrowUpRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                    </span>
                  </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}
