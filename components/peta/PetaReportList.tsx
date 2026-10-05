import React from 'react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import PetaReportCard from './PetaReportCard';
import { Filter } from 'lucide-react';

interface PetaReportListProps {
  reports: Report[];
  filteredReports: Report[];
  selectedReportId: string | null;
  onSelectReport: (report: Report) => void;
  selectedCategory: string;
  onSelectCategory: (category: string) => void;
  selectedStatus: string;
  onSelectStatus: (status: string) => void;
}

export default function PetaReportList({
  reports,
  filteredReports,
  selectedReportId,
  onSelectReport,
  selectedCategory,
  onSelectCategory,
  selectedStatus,
  onSelectStatus,
}: PetaReportListProps) {
  return (
    <div className="h-full flex flex-col">
      {/* Category Filter Horizontal Pills */}
      <div className="p-3 border-b border-slate-100 bg-white">
        <div className="flex flex-wrap items-center gap-1.5 pb-1">
          <button
            type="button"
            onClick={() => onSelectCategory('all')}
            className={`px-3 py-1.5 rounded-xl text-xs font-semibold whitespace-nowrap transition-all ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-2xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            Semua ({reports.length})
          </button>

          {Object.values(CATEGORIES_CONFIG).map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => onSelectCategory(cat.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-medium whitespace-nowrap transition-all flex items-center gap-1.5 ${
                selectedCategory === cat.id
                  ? 'bg-slate-900 text-white shadow-2xs'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: cat.colorHex }}
              />
              <span>{cat.name.split(' ')[0]}</span>
            </button>
          ))}
        </div>

        {/* Status Bar */}
        <div className="flex items-center justify-between pt-2 text-[11px] text-slate-500">
          <div className="flex items-center gap-1">
            <Filter className="w-3 h-3 text-slate-400" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => onSelectStatus(e.target.value)}
              className="bg-transparent font-semibold text-slate-800 outline-none cursor-pointer"
            >
              <option value="all">Semua Status</option>
              <option value="pending">Menunggu Verifikasi</option>
              <option value="in_progress">Sedang Ditangani</option>
              <option value="resolved">Selesai Ditangani</option>
            </select>
          </div>

          <span>{filteredReports.length} laporan ditemukan</span>
        </div>
      </div>

      {/* Scrollable Report Card List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-3 divide-y divide-slate-100">
        {filteredReports.length === 0 ? (
          <div className="text-center py-16 text-slate-400 text-xs">
            Tidak ada laporan yang sesuai dengan filter.
          </div>
        ) : (
          filteredReports.map((report) => (
            <PetaReportCard
              key={report.id}
              report={report}
              isSelected={selectedReportId === report.id}
              onSelect={onSelectReport}
            />
          ))
        )}
      </div>
    </div>
  );
}
