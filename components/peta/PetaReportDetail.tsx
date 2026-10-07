'use client';

import React, { useState } from 'react';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import StatusBadge from '@/components/ui/StatusBadge';
import CategoryBadge from '@/components/ui/CategoryBadge';
import { useToast } from '@/components/ui/ToastProvider';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  Clock,
  CheckCircle2,
  ThumbsUp,
  Copy,
  Check,
  MessageCircle,
} from 'lucide-react';

interface PetaReportDetailProps {
  report: Report;
  onBack: () => void;
  onToggleUpvote: (reportId: string) => void;
}

export default function PetaReportDetail({
  report,
  onBack,
  onToggleUpvote,
}: PetaReportDetailProps) {
  const { toast } = useToast();
  const [hasVoted, setHasVoted] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const categoryConfig = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(report.trackingCode);
    setIsCopied(true);
    toast.copied('Kode Tiket Disalin', report.trackingCode);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleWhatsAppShare = () => {
    const text = `Halo, mohon bantu dukung laporan "${report.title}" di Kel. ${report.village} (${report.trackingCode}) via TRACE Bengkulu.`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    toast.info('Membuka WhatsApp...', 'Terima kasih telah menyebarkan informasi!');
  };

  const handleUpvote = () => {
    if (hasVoted) {
      toast.info('Sudah Didukung', 'Anda telah memberikan dukungan untuk laporan ini.');
      return;
    }
    setHasVoted(true);
    onToggleUpvote(report.id);
    toast.success('Dukungan Terkirim', 'Dukungan warga mempercepat penanganan dinas.');
  };

  return (
    <div className="h-full flex flex-col">
      {/* Back to List Navigation */}
      <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between bg-white sticky top-0 z-10 gap-2">
        <button
          type="button"
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors min-h-11 px-2 py-2 rounded-xl hover:bg-slate-100 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
        >
          <ArrowLeft className="w-4 h-4 shrink-0" />
          <span className="truncate">Kembali ke Daftar</span>
        </button>

        <button
          type="button"
          onClick={handleCopyCode}
          className="flex items-center gap-1.5 px-3 py-2 min-h-10 rounded-xl hover:bg-slate-100 transition-colors group shrink-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
          title="Salin Kode Tiket"
        >
          <span
            className="w-2.5 h-2.5 rounded-full shrink-0"
            style={{ backgroundColor: categoryConfig.colorHex }}
          />
          <span className="text-xs font-mono font-bold text-blue-600">
            {report.trackingCode}
          </span>
          {isCopied ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
          ) : (
            <Copy className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 shrink-0" />
          )}
        </button>
      </div>

      {/* Scrollable Detail Body */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-5 sm:space-y-6">
        {/* Photo Evidence */}
        <div className="relative rounded-2xl overflow-hidden bg-slate-100 h-48 sm:h-56 border border-slate-200 shadow-2xs">
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
          <div className="absolute top-3 left-3">
            <CategoryBadge category={report.category} />
          </div>
          <div className="absolute top-3 right-3">
            <StatusBadge status={report.status} />
          </div>
        </div>

        {/* Title & Metadata */}
        <div>
          <h2 className="text-xl font-extrabold text-slate-900 leading-snug">
            {report.title}
          </h2>
          <div className="mt-2 space-y-1 text-xs text-slate-500">
            <div className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span>
                {report.address}, Kel. {report.village}, Kec. {report.district}
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
              <span>
                Dilaporkan pada:{' '}
                {new Date(report.createdAt).toLocaleDateString('id-ID', {
                  dateStyle: 'long',
                })}
              </span>
            </div>
          </div>
        </div>

        {/* Description Box */}
        <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-500">
            Keterangan Masalah
          </div>
          <p className="text-xs text-slate-700 leading-relaxed whitespace-pre-line">
            {report.description}
          </p>
        </div>

        {/* Evidence of Resolution (If resolved) */}
        {report.status === 'resolved' && report.resolvedImageUrl && (
          <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200 space-y-3">
            <div className="flex items-center gap-2 text-emerald-900 font-bold text-xs">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Foto Bukti Pekerjaan Selesai oleh Petugas</span>
            </div>
            <div className="rounded-xl overflow-hidden h-40 border border-emerald-300">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={report.resolvedImageUrl}
                alt="Bukti Selesai"
                className="w-full h-full object-cover"
              />
            </div>
            {report.adminNote && (
              <p className="text-xs text-emerald-800 italic">
                &ldquo;{report.adminNote}&rdquo;
              </p>
            )}
          </div>
        )}

        {/* Privacy & Reporter Information */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 text-xs">
          <div className="p-3 rounded-xl border border-slate-200 bg-white">
            <div className="text-[10px] text-slate-400 font-semibold uppercase">
              Pelapor Terverifikasi
            </div>
            <div className="font-bold text-slate-800 mt-0.5 truncate">
              {report.reporterAlias}
            </div>
          </div>

          <div className="p-3 rounded-xl border border-emerald-100 bg-emerald-50/40">
            <div className="text-[10px] text-emerald-600 font-semibold uppercase">
              Verifikasi NIK Terdata
            </div>
            <div className="font-mono text-emerald-900 font-medium mt-0.5 truncate">
              {report.reporterNikMasked || '3171**********12'}
            </div>
          </div>
        </div>

        {/* Timeline Stepper Progres */}
        <div className="space-y-3">
          <div className="text-xs font-bold uppercase tracking-wider text-slate-800 flex items-center gap-1.5">
            <Clock className="w-3.5 h-3.5 text-blue-600" />
            <span>Kronologi & Status Tindak Lanjut</span>
          </div>

          <div className="space-y-4 pl-2 border-l-2 border-slate-200 ml-3">
            {report.timeline.map((event, idx) => {
              const isLast = idx === report.timeline.length - 1;
              return (
                <div key={event.id} className="relative pl-5">
                  <div
                    className={`absolute -left-5 top-0.5 w-3.5 h-3.5 rounded-full border-2 border-white shadow-xs ${
                      isLast ? 'bg-blue-600 ring-4 ring-blue-100' : 'bg-slate-300'
                    }`}
                  />
                  <div>
                    <div className="flex items-center justify-between text-xs">
                      <span className="font-bold text-slate-900">{event.title}</span>
                      <span className="text-[10px] text-slate-400">{event.date}</span>
                    </div>
                    <p className="text-xs text-slate-600 mt-0.5 leading-relaxed">
                      {event.note}
                    </p>
                    <div className="text-[10px] text-blue-600 font-medium mt-0.5">
                      Pelaksana: {event.actor}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Sticky Action */}
      <div className="p-3 pb-24 md:pb-4 sm:p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between gap-2.5">
        <button
          type="button"
          onClick={handleWhatsAppShare}
          className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-1.5 min-h-11 px-3.5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white text-xs font-semibold transition-all shadow-xs focus-visible:outline-2 focus-visible:outline-emerald-600"
          title="Bagikan ke WhatsApp"
        >
          <MessageCircle className="w-4 h-4 shrink-0" />
          <span>Bagikan WA</span>
        </button>

        <button
          type="button"
          onClick={handleUpvote}
          className={`flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 min-h-11 px-4 py-2.5 rounded-xl text-xs font-bold transition-all shadow-xs active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 ${
            hasVoted
              ? 'bg-blue-700 text-white'
              : 'bg-blue-600 hover:bg-blue-700 text-white'
          }`}
        >
          <ThumbsUp className={`w-4 h-4 shrink-0 ${hasVoted ? 'fill-white' : ''}`} />
          <span>{hasVoted ? 'Didukung' : 'Dukung Isu'} ({report.upvotes})</span>
        </button>
      </div>
    </div>
  );
}
