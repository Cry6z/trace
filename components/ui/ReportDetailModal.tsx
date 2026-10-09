'use client';

import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Report } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { useToast } from '@/components/ui/ToastProvider';
import Link from 'next/link';
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
  ArrowRight,
  Building2,
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
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Keyboard accessibility (Escape key to close) and COMPLETE background scroll lock
  useEffect(() => {
    if (!report) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    // Lock both document body and html to completely prevent any background movement
    const originalBodyOverflow = document.body.style.overflow;
    const originalHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = 'hidden';
    document.documentElement.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      document.body.style.overflow = originalBodyOverflow;
      document.documentElement.style.overflow = originalHtmlOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [report, onClose]);

  if (!report || !mounted) return null;

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

  return createPortal(
    <div
      className="fixed inset-0 z-100 overflow-hidden flex items-center justify-center p-3 sm:p-6 pointer-events-auto"
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
        width: '100vw',
        height: '100vh',
      }}
    >
      {/* Backdrop Blur */}
      <div
        className="fixed inset-0 bg-slate-950/60 backdrop-blur-md modal-backdrop-animate cursor-pointer"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Card Laporan Centered di Viewport - Minimalist & Spacious */}
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="report-modal-title"
        className="relative z-10 w-full max-w-3xl max-h-[86vh] bg-white rounded-3xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col modal-spring-animate"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header Bar - Clean & Roomy */}
        <div className="shrink-0 flex items-center justify-between px-6 py-4 border-b border-slate-100 bg-white z-10">
          <div className="flex items-center gap-3">
            <CategoryBadge category={report.category} />
            <button
              type="button"
              onClick={handleCopyCode}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200/80 text-xs font-mono font-bold text-slate-700 transition-colors group cursor-pointer"
              title="Klik untuk salin kode tiket"
            >
              <span>{report.trackingCode}</span>
              {isCopied ? (
                <Check className="w-3.5 h-3.5 text-emerald-600" />
              ) : (
                <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600" />
              )}
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleCopyLink}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-all duration-150 active:scale-90 hover:scale-105 cursor-pointer"
              title="Salin Tautan Laporan"
            >
              <Share2 className="w-3.5 h-3.5" />
            </button>
            <button
              type="button"
              onClick={onClose}
              className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500 hover:text-slate-900 flex items-center justify-center transition-all duration-200 hover:rotate-90 active:scale-90 cursor-pointer"
              title="Tutup Modal"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Modal Scrollable Content - Sleek Minimal Scrollbar & Generous Padding */}
        <div className="modal-scroll-area flex-1 min-h-0 overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Photo Banner */}
          <div className="relative rounded-2xl overflow-hidden bg-slate-100 aspect-video sm:aspect-21/9 max-h-60 sm:max-h-72 border border-slate-200/80 shadow-2xs shrink-0">
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
            <div className="absolute bottom-3 left-3 bg-slate-900/60 backdrop-blur-md px-3 py-1 rounded-full text-white text-[11px] font-mono">
              Koordinat: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
            </div>
          </div>

          {/* Title & Metadata Strip */}
          <div className="space-y-3">
            <h2 id="report-modal-title" className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight leading-snug">
              {report.title}
            </h2>
            <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span>
                  {report.address}, Kel. {report.village}, Kec. {report.district}
                </span>
              </div>
              <div className="flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>
                  {new Date(report.createdAt).toLocaleDateString('id-ID', { dateStyle: 'long' })}
                </span>
              </div>
              <div className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-slate-100 text-slate-600 font-medium">
                <Building2 className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                <span>{report.assignedAgency || 'Dinas PUPR / DLH'}</span>
              </div>
            </div>
          </div>

          {/* Description - Editorial & Clean */}
          <div className="space-y-2 bg-slate-50/70 p-5 rounded-2xl border border-slate-100">
            <h3 className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">
              Rincian Masalah
            </h3>
            <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
              {report.description}
            </p>
          </div>

          {/* Selesai / Foto Bukti Perbaikan Jika Sudah Resolved */}
          {report.status === 'resolved' && report.resolvedImageUrl && (
            <div className="p-5 rounded-2xl bg-emerald-50/60 border border-emerald-200 space-y-3">
              <div className="flex items-center gap-2 text-emerald-800 font-bold text-sm">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                <span>Bukti Penanganan Tuntas oleh Petugas</span>
              </div>
              <div className="rounded-xl overflow-hidden aspect-video max-h-56 border border-emerald-300">
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
            <div className="p-4 rounded-2xl border border-slate-200/80 bg-white flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold shrink-0">
                <UserCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wide">
                  Pelapor Terverifikasi
                </div>
                <div className="font-bold text-slate-800 text-sm">{report.reporterAlias}</div>
              </div>
            </div>

            <div className="p-4 rounded-2xl border border-emerald-200/80 bg-emerald-50/40 flex items-center gap-3 shadow-2xs">
              <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold shrink-0">
                <ShieldCheck className="w-4.5 h-4.5" />
              </div>
              <div>
                <div className="text-[10px] text-emerald-600 font-semibold uppercase tracking-wide">
                  Identitas NIK Terverifikasi
                </div>
                <div className="font-mono text-emerald-900 text-sm font-bold">
                  {report.reporterNikMasked || '1771**********01'}
                </div>
              </div>
            </div>
          </div>

          {/* Timeline Progres Penanganan */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
              <Clock className="w-4 h-4 text-blue-600" />
              <span>Kronologi & Status Tindak Lanjut</span>
            </h3>

            <div className="space-y-5 pl-2 border-l-2 border-slate-200 ml-3">
              {report.timeline.map((event, idx) => {
                const isLast = idx === report.timeline.length - 1;
                return (
                  <div key={event.id} className="relative pl-6">
                    <div
                      className={`absolute left-[-1.3rem] top-0.5 w-4 h-4 rounded-full border-2 border-white shadow-xs flex items-center justify-center ${
                        isLast ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'
                      }`}
                    />
                    <div className="space-y-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-slate-900">{event.title}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{event.date}</span>
                      </div>
                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {event.note}
                      </p>
                      <div className="text-[11px] text-blue-600 font-medium">
                        Oleh: {event.actor}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Footer Actions - Spacious, Balanced & Beautiful */}
        <div className="shrink-0 px-6 py-4 bg-slate-50 border-t border-slate-200/80 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            {/* Interactive Upvote Button */}
            <button
              type="button"
              onClick={handleUpvoteClick}
              className={`min-h-11 inline-flex items-center justify-center gap-2 px-4.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold transition-all duration-150 shadow-xs hover:shadow-md active:scale-95 cursor-pointer ${
                hasVoted
                  ? 'bg-blue-700 text-white shadow-blue-600/30 ring-2 ring-blue-600/20'
                  : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
              }`}
            >
              <ThumbsUp className={`w-4 h-4 shrink-0 ${hasVoted ? 'fill-white' : ''}`} />
              <span>{hasVoted ? 'Sudah Didukung' : 'Dukung Isu'} ({report.upvotes})</span>
            </button>

            {/* WhatsApp Share Button */}
            <button
              type="button"
              onClick={handleWhatsAppShare}
              className="min-h-11 inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-white hover:bg-emerald-50 text-emerald-700 hover:text-emerald-800 text-xs sm:text-sm font-bold border border-slate-200 hover:border-emerald-200 transition-all duration-150 shadow-2xs active:scale-95 cursor-pointer"
              title="Bagikan ke WhatsApp Grup Warga"
            >
              <MessageCircle className="w-4 h-4 shrink-0 text-emerald-600" />
              <span>Bagikan WA</span>
            </button>
          </div>

          <div>
            {/* Primary CTA: Buka Halaman Detail Penuh */}
            <Link
              href={`/laporan/${report.id}`}
              onClick={onClose}
              className="w-full sm:w-auto min-h-11 inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-slate-900 hover:bg-blue-600 text-white text-xs sm:text-sm font-bold transition-all duration-200 shadow-xs hover:shadow-md active:scale-95 group cursor-pointer"
            >
              <span>Buka Halaman Detail</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform text-blue-300 group-hover:text-white" />
            </Link>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
