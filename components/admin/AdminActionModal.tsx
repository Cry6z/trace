'use client';

import React, { useEffect, useState, useRef } from 'react';
import { Report, ReportStatus } from '@/lib/types';
import { 
  X, 
  CheckCircle2, 
  UploadCloud, 
  Link as LinkIcon, 
  Trash2, 
  RefreshCw, 
  ImageIcon 
} from 'lucide-react';

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
  const [uploadMode, setUploadMode] = useState<'local' | 'url'>('local');
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [isProcessingFile, setIsProcessingFile] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  // Compress and read image file to high-efficiency data URL
  const processImageFile = (file: File) => {
    if (!file.type.startsWith('image/')) return;
    setIsProcessingFile(true);

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === 'string') {
        const img = new window.Image();
        img.onload = () => {
          try {
            const canvas = document.createElement('canvas');
            const MAX_DIMENSION = 1280;
            let width = img.width;
            let height = img.height;

            if (width > height) {
              if (width > MAX_DIMENSION) {
                height = Math.round((height * MAX_DIMENSION) / width);
                width = MAX_DIMENSION;
              }
            } else {
              if (height > MAX_DIMENSION) {
                width = Math.round((width * MAX_DIMENSION) / height);
                height = MAX_DIMENSION;
              }
            }

            canvas.width = width;
            canvas.height = height;
            const ctx = canvas.getContext('2d');
            if (ctx) {
              ctx.drawImage(img, 0, 0, width, height);
              const compressed = canvas.toDataURL('image/jpeg', 0.85);
              onEvidenceUrlChange(compressed);
            } else {
              onEvidenceUrlChange(reader.result as string);
            }
          } catch {
            onEvidenceUrlChange(reader.result as string);
          } finally {
            setIsProcessingFile(false);
          }
        };
        img.onerror = () => {
          onEvidenceUrlChange(reader.result as string);
          setIsProcessingFile(false);
        };
        img.src = reader.result;
      }
    };
    reader.readAsDataURL(file);
  };

  const handleLocalFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processImageFile(e.target.files[0]);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processImageFile(e.dataTransfer.files[0]);
    }
  };

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
            className="w-10 h-10 min-w-10 min-h-10 rounded-full bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 cursor-pointer"
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
                className={`min-h-11 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-amber-600 ${
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
                className={`min-h-11 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 ${
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
                className={`min-h-11 py-2 px-3 rounded-xl text-xs font-bold border transition-all flex items-center justify-center cursor-pointer focus-visible:outline-2 focus-visible:outline-emerald-600 ${
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
              <option value="Dinas Pekerjaan Umum & Penataan Ruang (PUPR)">Dinas Pekerjaan Umum & Penataan Ruang (PUPR)</option>
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
              placeholder="Contoh: Regu Satgas Bina Marga telah menyelesaikan pengaspalan dan pemadatan jalan..."
              value={actionNote}
              onChange={(e) => onNoteChange(e.target.value)}
              className="w-full min-h-21 p-3 rounded-xl border border-slate-200 text-base sm:text-xs focus:ring-2 focus:ring-blue-500 outline-none resize-none"
            />
          </div>

          {/* Bukti Foto Penyelesaian (Jika status selesai) */}
          {actionStatus === 'resolved' && (
            <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <label className="block text-xs font-bold text-emerald-950">
                    Foto Bukti Penyelesaian Lapangan
                  </label>
                  <p className="text-[10px] text-emerald-700/80">
                    Dokumentasikan bukti fisik sebelum laporan ditutup tuntas
                  </p>
                </div>
                {/* Mode Switch: Lokal vs URL */}
                <div className="flex items-center gap-1 bg-emerald-100/80 p-0.5 rounded-lg text-[10px] font-bold">
                  <button
                    type="button"
                    onClick={() => setUploadMode('local')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      uploadMode === 'local'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    Upload Lokal
                  </button>
                  <button
                    type="button"
                    onClick={() => setUploadMode('url')}
                    className={`px-2 py-0.5 rounded-md transition-all cursor-pointer ${
                      uploadMode === 'url'
                        ? 'bg-white text-emerald-800 shadow-2xs'
                        : 'text-emerald-700 hover:text-emerald-900'
                    }`}
                  >
                    Tautan URL
                  </button>
                </div>
              </div>

              {/* Input Mode: UPLOAD LOKAL */}
              {uploadMode === 'local' && (
                <div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleLocalFileSelect}
                    className="hidden"
                  />

                  {actionEvidenceUrl ? (
                    <div className="space-y-2">
                      <div className="relative w-full h-44 rounded-xl overflow-hidden border-2 border-emerald-300 bg-slate-900 shadow-2xs">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={actionEvidenceUrl}
                          alt="Bukti Penyelesaian Lapangan"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute top-2 left-2 bg-emerald-600/95 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md shadow-xs flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Foto Bukti Siap Diterbitkan</span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between gap-2 pt-1">
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-emerald-300 text-emerald-800 text-xs font-semibold hover:bg-emerald-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <RefreshCw className="w-3.5 h-3.5" />
                          <span>Ganti Foto Lokal</span>
                        </button>
                        <button
                          type="button"
                          onClick={() => onEvidenceUrlChange('')}
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white border border-rose-200 text-rose-700 text-xs font-semibold hover:bg-rose-50 active:scale-95 transition-all cursor-pointer shadow-2xs"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Hapus Foto</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      className={`border-2 border-dashed ${
                        isDragging ? 'border-emerald-500 bg-emerald-100/50' : 'border-emerald-300 hover:border-emerald-500 bg-white hover:bg-emerald-50/50'
                      } p-6 rounded-2xl cursor-pointer text-center flex flex-col items-center justify-center gap-2 transition-all group`}
                    >
                      <div className="w-12 h-12 rounded-2xl bg-emerald-100/70 text-emerald-700 flex items-center justify-center group-hover:scale-105 transition-transform shadow-2xs">
                        {isProcessingFile ? (
                          <div className="w-6 h-6 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin" />
                        ) : (
                          <UploadCloud className="w-6 h-6 stroke-[2.2]" />
                        )}
                      </div>
                      <div>
                        <div className="text-xs font-bold text-emerald-950">
                          {isProcessingFile ? 'Memproses Foto...' : 'Klik atau Tarik Foto dari Komputer / Ponsel'}
                        </div>
                        <div className="text-[10px] text-emerald-700/80 mt-0.5">
                          Format JPG, PNG, WEBP (Otomatis diproses & dioptimalkan)
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Input Mode: TAUTAN URL */}
              {uploadMode === 'url' && (
                <div className="space-y-2">
                  <div className="relative">
                    <input
                      type="url"
                      value={actionEvidenceUrl}
                      onChange={(e) => onEvidenceUrlChange(e.target.value)}
                      placeholder="https://images.unsplash.com/..."
                      className="w-full min-h-11 px-3 py-2 rounded-xl border border-emerald-300 bg-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 shadow-2xs"
                    />
                  </div>

                  {actionEvidenceUrl && (
                    <div className="relative w-full h-36 rounded-xl overflow-hidden border border-emerald-300 bg-slate-100">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src={actionEvidenceUrl}
                        alt="Preview Bukti Selesai"
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          e.currentTarget.style.display = 'none';
                        }}
                      />
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Submit Action */}
          <div className="pt-2 flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              className="min-h-11 px-4 py-2.5 rounded-xl border border-slate-200 text-xs font-bold text-slate-600 hover:bg-slate-100 active:scale-95 transition-all focus-visible:outline-2 focus-visible:outline-slate-400 cursor-pointer"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={isUpdating}
              className="min-h-11 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 disabled:opacity-50 transition-all focus-visible:outline-2 focus-visible:outline-blue-600 flex items-center justify-center cursor-pointer"
            >
              {isUpdating ? 'Menyimpan...' : 'Simpan Pembaruan'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
