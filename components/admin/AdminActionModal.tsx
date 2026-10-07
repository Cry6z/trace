import React, { useEffect } from 'react';
import { Report, ReportStatus } from '@/lib/types';
import { X, CheckCircle2 } from 'lucide-react';

interface AdminActionModalProps {
  report: Report;
  onClose: () => void;
  actionStatus: ReportStatus;
  onStatusChange: (status: ReportStatus) => void;
  actionAgency: string;
  onAgencyChange: (agency: string) => void;
  actionNote: string;
  onNoteChange: (note: string) => void;
  actionEvidenceUrl: string;
  onEvidenceUrlChange: (url: string) => void;
  isUpdating: boolean;
  updateSuccess: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function AdminActionModal({
  report,
  onClose,
  actionStatus,
  onStatusChange,
  actionAgency,
  onAgencyChange,
  actionNote,
  onNoteChange,
  actionEvidenceUrl,
  onEvidenceUrlChange,
  isUpdating,
  updateSuccess,
  onSubmit,
}: AdminActionModalProps) {
  // Escape key and scroll lock
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = originalOverflow;
    };
  }, [onClose]);

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="admin-action-title"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/50 backdrop-blur-sm flex items-end sm:items-center justify-center p-0 sm:p-4 animate-in fade-in"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="relative w-full max-w-lg bg-white rounded-t-3xl sm:rounded-3xl shadow-2xl border border-slate-100 p-5 sm:p-6 space-y-5 max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex items-center justify-between pb-3 border-b border-slate-100">
          <div>
            <span className="text-xs font-mono font-bold text-blue-600">
              {report.trackingCode}
            </span>
            <h3 id="admin-action-title" className="font-extrabold text-base text-slate-900">
              Tindak Lanjut & Update Status
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Tutup modal"
            className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {updateSuccess && (
          <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Perubahan status dan timeline berhasil disimpan!</span>
          </div>
        )}

        <form onSubmit={onSubmit} className="space-y-4">
          {/* Ubah Status */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
              Update Status Penanganan
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => onStatusChange('pending')}
                className={`min-h-11 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-amber-600 ${
                  actionStatus === 'pending'
                    ? 'border-amber-500 bg-amber-50 text-amber-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Pending Verifikasi
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('in_progress')}
                className={`min-h-11 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-blue-600 ${
                  actionStatus === 'in_progress'
                    ? 'border-blue-500 bg-blue-50 text-blue-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Sedang Dikerjakan
              </button>
              <button
                type="button"
                onClick={() => onStatusChange('resolved')}
                className={`min-h-11 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center focus-visible:outline-2 focus-visible:outline-emerald-600 ${
                  actionStatus === 'resolved'
                    ? 'border-emerald-500 bg-emerald-50 text-emerald-800 shadow-2xs'
                    : 'border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                Tuntas Selesai
              </button>
            </div>
          </div>

          {/* Disposisi Dinas */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
              Instansi / Dinas Penanggung Jawab
            </label>
            <select
              value={actionAgency}
              onChange={(e) => onAgencyChange(e.target.value)}
              className="w-full min-h-11 px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 text-xs font-semibold text-slate-800 outline-none focus:bg-white focus:ring-2 focus:ring-blue-500"
            >
              <option value="Dinas Bina Marga Provinsi">Dinas Bina Marga (Jalan & Jembatan)</option>
              <option value="Dinas Lingkungan Hidup (DLH)">Dinas Lingkungan Hidup (Sampah & Kebersihan)</option>
              <option value="Dinas Sumber Daya Air">Dinas Sumber Daya Air (Banjir & Drainase)</option>
              <option value="Dinas Perhubungan (Dishub)">Dinas Perhubungan (Lampu Jalan & Rambu)</option>
              <option value="Satpol PP & Ketertiban">Satpol PP & Ketertiban Umum</option>
            </select>
          </div>

          {/* Catatan Tindak Lanjut */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-slate-700 mb-1.5">
              Catatan Resmi Petugas (Tampil di Timeline Warga)
            </label>
            <textarea
              required
              rows={3}
              placeholder="Contoh: Regu 2 Satgas Bina Marga telah diterjunkan untuk pengaspalan darurat..."
              value={actionNote}
              onChange={(e) => onNoteChange(e.target.value)}
              className="w-full min-h-21 p-3 rounded-xl border border-slate-200 text-base sm:text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Bukti Foto Penyelesaian (Jika status selesai) */}
          {actionStatus === 'resolved' && (
            <div className="p-3.5 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-2">
              <label className="block text-xs font-bold text-emerald-900">
                URL Foto Bukti Penyelesaian Fisik Lapangan
              </label>
              <input
                type="url"
                value={actionEvidenceUrl}
                onChange={(e) => onEvidenceUrlChange(e.target.value)}
                placeholder="https://..."
                className="w-full min-h-11 px-3 py-2 rounded-xl border border-emerald-300 bg-white text-base sm:text-xs outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="w-full h-28 rounded-lg overflow-hidden border border-emerald-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={actionEvidenceUrl}
                  alt="Preview Selesai"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-slate-400"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="min-h-11 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all focus-visible:outline-2 focus-visible:outline-blue-600 flex items-center justify-center"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Pembaruan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
