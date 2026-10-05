'use client';

import React, { useState } from 'react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import { useToast } from '@/components/ui/ToastProvider';
import {
  X,
  MapPin,
  Calendar,
  ShieldCheck,
  ThumbsUp,
  CheckCircle2,
  Clock,
  UserCheck,
  Copy,
  Check,
  MessageCircle,
  Share2,
} from 'lucide-react';

interface ReportDetailModalProps {
  report: Report | null;
  onClose: () => void;
  onUpvote?: (id: string) => void;
}

export default function ReportDetailModal({ report, onClose, onUpvote }: ReportDetailModalProps) {
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);

  if (!report) return null;

  const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(report.trackingCode);
    setIsCopied(true);
    toast.copied(`Kode Tiket Disalin`, report.trackingCode);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyLink = () => {
    const shareUrl = typeof window !== 'undefined' ? `${window.location.origin}/?track=${report.trackingCode}` : '';
    navigator.clipboard.writeText(shareUrl);
    toast.copied(`Tautan Laporan Disalin`, 'Bagikan tautan ini ke grup warga Anda');
  };

  const handleWhatsAppShare = () => {
    const text = `Halo Bapak/Ibu, mohon bantu dukung penanganan pengaduan warga "${report.title}" di Kel. ${report.village} (Kode: ${report.trackingCode}) via TRACE Bengkulu.`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    toast.info('Membuka WhatsApp...', 'Terima kasih telah menyebarkan informasi publik!');
  };

  const handleUpvoteClick = () => {
    if (hasVoted) {
      toast.info('Sudah Didukung', 'Anda telah memberikan dukungan untuk laporan ini.');
      return;
    }
    setHasVoted(true);
    if (onUpvote) onUpvote(report.id);
    toast.success('Dukungan Terkirim', 'Setiap suara warga mempercepat prioritas tindak lanjut dinas.');
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/40 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div
        className="relative w-full max-w-2xl bg-white rounded-3xl shadow-2xl border border-slate-100 overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white sticky top-0 z-10">
          <div className="flex items-center gap-2.5">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: category.colorHex }}
            />
            <button
              type="button"
              onClick={handleCopyCode}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-md hover:bg-slate-100 text-xs font-mono font-semibold text-slate-600 transition-colors group"
              title="Klik untuk salin kode tiket"
            >
              <span>{report.trackingCode}</span>
              {isCopied ? (
                <Check className="w-3 h-3 text-emerald-600" />
              ) : (
                <Copy className="w-3 h-3 text-slate-400 group-hover:text-blue-600" />
              )}
            </button>
            <span className="text-slate-300">•</span>
            <span className="text-xs font-semibold text-slate-700">
              {category.name}
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors"
              title="Salin Tautan Laporan"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-8 h-8 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-colors"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content */}
        <div className="overflow-y-auto p-6 space-y-6">
          {/* Main Photo Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-64 sm:h-72 border border-slate-200">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={report.imageUrl}
              alt={report.title}
              className="w-full h-full object-cover"
              onError={(e: React.SyntheticEvent<HTMLImageElement, Event>) => {
                e.currentTarget.src =
                  'https://images.unsplash.com/photo-1541888946425-d0fbb18f15f6?auto=format&fit=crop&w=800&q=80';
              }}
            />
            <div className="absolute top-4 left-4">
              <StatusBadge status={report.status} size="md" />
            </div>
            {report.urgency === 'darurat' && (
              <div className="absolute top-4 right-4">
                <span className="px-3 py-1 rounded-full text-xs font-bold bg-rose-600 text-white shadow-sm animate-pulse">
                  Prioritas Darurat
                </span>
              </div>
            )}
          </div>

          {/* Title & Info */}
          <div>
            <h2 className="text-xl sm:text-2xl font-bold text-slate-900 leading-snug">
              {report.title}
            </h2>
            <div className="mt-2 flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600" />
                <span>
                  {report.address}, Kel. {report.village}, Kec. {report.district}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400" />
                <span>
                  {new Date(report.createdAt).toLocaleDateString('id-ID', { dateStyle: 'medium' })}
                </span>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200/70">
            <h3 className="text-xs font-bold text-slate-700 uppercase tracking-wide mb-1">
              Rincian Masalah
            </h3>
            <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Selesai / Foto Bukti Perbaikan Jika Sudah Resolved */}
          {report.status === 'resolved' && report.resolvedImageUrl && (
            <div className="p-4 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                <span>Bukti Penanganan Tuntas oleh Petugas</span>
              </div>
              <div className="rounded-xl overflow-hidden h-48 border border-emerald-300">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={report.resolvedImageUrl}
                  alt="Bukti Selesai"
                  className="w-full h-full object-cover"
                />
              </div>
              {report.adminNote && (
                <p className="text-xs text-emerald-900 italic">
                  &ldquo;{report.adminNote}&rdquo;
                </p>
              )}
            </div>
          )}

          {/* Pelapor & Perlindungan NIK */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3.5 rounded-xl border border-slate-200 bg-white flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                <UserCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase">
                  Pelapor Terverifikasi
                </div>
                <div className="font-bold text-slate-800">{report.reporterAlias}</div>
              </div>
            </div>

            <div className="p-3.5 rounded-xl border border-emerald-100 bg-emerald-50/40 flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 font-semibold uppercase">
                  Privasi NIK Terlindungi
                </div>
                <div className="font-mono text-emerald-900">
                  {report.reporterNikMasked || '3171**********01'}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Progres Penanganan */}
          <div>
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Kronologi & Status Tindak Lanjut</span>
            </h3>

            <div className="space-y-4 pl-2 border-l-2 border-slate-200 ml-3">
              {report.timeline.map((event, idx) => {
                const isLast = idx === report.timeline.length - 1;
                return (
                  <div key={event.id} className="relative pl-6">
                    {/* Stepper Dot */}
                    <div
                      className={`absolute left-[-1.3rem] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-sm flex items-center justify-center ${
                        isLast ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'
                      }`}
                    />

                    <div>
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{event.title}</span>
                        <span className="text-[11px] text-slate-400">{event.date}</span>
                      </div>
                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {event.note}
                      </p>
                      <div className="mt-1 text-[11px] text-blue-600 font-medium">
                        Oleh: {event.actor}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-slate-500">
            Dinas Terkait:{' '}
            <span className="font-semibold text-slate-800">
              {report.assignedAgency || 'Dinas PUPR / DLH'}
            </span>
          </div>

          <div className="flex items-center gap-2">
            {/* 1-Click WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-xs"
              title="Bagikan ke WhatsApp Grup Warga"
            >
              <MessageCircle className="w-3.5 h-3.5" />
              <span>Bagikan WA</span>
            </button>

            {/* Interactive Upvote Button */}
            <button
              type="button"
              onClick={handleUpvoteClick}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-sm active:scale-95 ${
                hasVoted
                  ? 'bg-blue-700 text-white shadow-blue-600/30'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <ThumbsUp className={`w-3.5 h-3.5 ${hasVoted ? 'fill-white' : ''}`} />
              <span>{hasVoted ? 'Sudah Didukung' : 'Dukung Isu Ini'} ({report.upvotes})</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
