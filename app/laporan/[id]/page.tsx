'use client';

import React, { useState, useEffect, use } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CategoryBadge from '@/components/ui/CategoryBadge';
import StatusBadge from '@/components/ui/StatusBadge';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import { INITIAL_REPORTS } from '@/lib/mockData';
import { useToast } from '@/components/ui/ToastProvider';
import {
  ArrowLeft,
  MapPin,
  Calendar,
  ShieldCheck,
  ThumbsUp,
  Share2,
  Copy,
  Check,
  MessageCircle,
  Clock,
  UserCheck,
  Building2,
  ArrowUpRight,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';

interface ReportDetailPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default function ReportDetailPage({ params }: ReportDetailPageProps) {
  const router = useRouter();
  const resolvedParams = use(params);
  const reportId = resolvedParams.id;
  const { toast } = useToast();

  const [report, setReport] = useState<Report | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [hasVoted, setHasVoted] = useState<boolean>(false);
  const [isCopied, setIsCopied] = useState<boolean>(false);
  const [voteCount, setVoteCount] = useState<number>(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // 1. Cari di local storage
      const stored = localStorage.getItem('trace_user_reports');
      let customReports: Report[] = [];
      if (stored) {
        try {
          customReports = JSON.parse(stored);
        } catch {
          // ignore
        }
      }

      const allReports = [...customReports, ...INITIAL_REPORTS];
      const found = allReports.find(
        (r) => r.id === reportId || r.trackingCode.toLowerCase() === reportId.toLowerCase()
      );

      if (found) {
        setReport(found);
        setVoteCount(found.upvotes);
      }
      setLoading(false);
    }
  }, [reportId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 flex items-center justify-center py-20">
          <div className="flex flex-col items-center gap-3">
            <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
            <p className="text-xs text-slate-500 font-medium">Memuat detail laporan...</p>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (!report) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col">
        <Navbar />
        <main className="flex-1 max-w-xl mx-auto w-full px-4 py-20 text-center">
          <div className="p-8 bg-white rounded-3xl border border-slate-200/80 shadow-sm space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto">
              <AlertTriangle className="w-6 h-6" />
            </div>
            <h1 className="text-xl font-extrabold text-slate-900">
              Laporan Tidak Ditemukan
            </h1>
            <p className="text-xs text-slate-500 leading-relaxed">
              Laporan dengan ID atau kode tiket <code>{reportId}</code> tidak terdaftar dalam sistem TRACE Bengkulu.
            </p>
            <div className="pt-2 flex items-center justify-center gap-3">
              <Link
                href="/"
                className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-bold shadow-sm hover:bg-blue-700 transition-colors"
              >
                Kembali ke Beranda
              </Link>
              <Link
                href="/peta"
                className="px-4 py-2 rounded-xl bg-slate-100 text-slate-700 text-xs font-semibold hover:bg-slate-200 transition-colors"
              >
                Buka Peta Wilayah
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const category = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;

  const handleCopyCode = () => {
    navigator.clipboard.writeText(report.trackingCode);
    setIsCopied(true);
    toast.copied('Kode Tiket Disalin', report.trackingCode);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleCopyLink = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    navigator.clipboard.writeText(shareUrl);
    toast.copied('Tautan Laporan Disalin', 'Tautan siap dibagikan ke warga');
  };

  const handleWhatsAppShare = () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : '';
    const text = `Halo, mohon bantu dukung laporan warga "${report.title}" di Kel. ${report.village} (Kode: ${report.trackingCode}) via TRACE Bengkulu:\n${shareUrl}`;
    const waUrl = `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`;
    window.open(waUrl, '_blank', 'noopener,noreferrer');
    toast.info('Membuka WhatsApp...', 'Terima kasih atas partisipasi aktif Anda.');
  };

  const handleUpvoteClick = () => {
    if (hasVoted) {
      toast.info('Sudah Didukung', 'Anda telah memberikan dukungan untuk laporan ini.');
      return;
    }
    setHasVoted(true);
    setVoteCount((prev) => prev + 1);
    toast.success('Dukungan Diterima', 'Suara Anda membantu meningkatkan prioritas penanganan dinas terkait.');
  };

  return (
    <div className="min-h-screen bg-slate-50/70 flex flex-col antialiased page-transition">
      <Navbar />

      <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8 py-8 sm:py-10">
        {/* Top Breadcrumb & Back Link */}
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => router.back()}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-600 hover:text-blue-600 transition-colors py-1 px-2 rounded-lg hover:bg-slate-100 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali</span>
            </button>
            <span className="text-slate-300">/</span>
            <Link href="/" className="text-xs text-slate-500 hover:text-blue-600 transition-colors">
              Beranda
            </Link>
            <span className="text-slate-300">/</span>
            <span className="text-xs font-mono font-semibold text-slate-700">
              {report.trackingCode}
            </span>
          </div>

          <div className="flex items-center gap-2 self-start sm:self-auto">
            <button
              type="button"
              onClick={handleCopyLink}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="Salin Tautan"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Bagikan</span>
            </button>
            <Link
              href="/peta"
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold transition-colors"
            >
              <span>Peta Wilayah</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>

        {/* 2-Column Responsive Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* SISI KIRI (8 Kolom): Detail Laporan, Foto, & Kronologi */}
          <div className="lg:col-span-8 space-y-6">
            
            {/* Header Informasi Utama */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <CategoryBadge category={report.category} />
                <StatusBadge status={report.status} />
                {report.urgency === 'darurat' && (
                  <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-rose-600 text-white shadow-2xs">
                    Prioritas Darurat
                  </span>
                )}
                <button
                  type="button"
                  onClick={handleCopyCode}
                  className="ml-auto inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 font-mono text-xs font-bold text-slate-700 transition-colors cursor-pointer"
                  title="Salin Kode Tiket"
                >
                  <span>{report.trackingCode}</span>
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>

              <h1 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-snug">
                {report.title}
              </h1>

              <div className="flex flex-wrap items-center gap-y-2 gap-x-4 text-xs text-slate-500 pt-1 border-t border-slate-100">
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                  <span>{report.address}, Kel. {report.village}, Kec. {report.district}</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{new Date(report.createdAt).toLocaleDateString('id-ID', { dateStyle: 'full' })}</span>
                </div>
              </div>
            </div>

            {/* Foto Bukti Kerusakan */}
            <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-xs">
              <div className="relative aspect-16/10 sm:aspect-video w-full bg-slate-100">
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
                <div className="absolute bottom-3 left-3 bg-slate-900/70 backdrop-blur-md px-3 py-1 rounded-full text-white text-xs font-mono">
                  Koordinat: {report.latitude.toFixed(4)}, {report.longitude.toFixed(4)}
                </div>
              </div>
            </div>

            {/* Rincian Deskripsi Masalah */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-3">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Deskripsi Lengkap Kerusakan
              </h2>
              <p className="text-sm sm:text-base text-slate-700 leading-relaxed whitespace-pre-line">
                {report.description}
              </p>
            </div>

            {/* Bukti Penanganan Tuntas Jika Resolved */}
            {report.status === 'resolved' && report.resolvedImageUrl && (
              <div className="bg-emerald-50/60 p-6 sm:p-8 rounded-3xl border border-emerald-200 space-y-4">
                <div className="flex items-center gap-2.5 text-emerald-800 font-bold text-base">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>Bukti Penanganan Tuntas oleh Petugas</span>
                </div>
                <div className="rounded-2xl overflow-hidden aspect-video border border-emerald-300">
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

            {/* Linimasa Kronologi & Penanganan */}
            <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200/80 shadow-xs space-y-5">
              <h2 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
                <Clock className="w-4 h-4 text-blue-600" />
                <span>Kronologi & Riwayat Penanganan</span>
              </h2>

              <div className="space-y-6 pl-2 border-l-2 border-slate-200 ml-3">
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

          {/* SISI KANAN (4 Kolom): Tindakan Interaktif & Informasi Verifikasi */}
          <div className="lg:col-span-4 space-y-6">
            
            {/* Card Tindakan Interaktif */}
            <div className="bg-white p-6 sm:p-7 rounded-3xl border border-slate-200/80 shadow-xs space-y-5 sticky top-24">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block mb-1">
                  Dukungan Warga
                </span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl font-extrabold text-slate-900">
                    {voteCount}
                  </span>
                  <span className="text-xs text-slate-500 font-medium">
                    warga telah mendukung
                  </span>
                </div>
              </div>

              {/* Tombol Upvote */}
              <button
                type="button"
                onClick={handleUpvoteClick}
                className={`w-full min-h-12 rounded-xl font-bold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-md active:scale-95 ${
                  hasVoted
                    ? 'bg-blue-700 text-white shadow-blue-600/30 ring-2 ring-blue-600/20'
                    : 'bg-blue-600 hover:bg-blue-700 text-white shadow-blue-500/20'
                }`}
              >
                <ThumbsUp className={`w-4 h-4 ${hasVoted ? 'fill-white' : ''}`} />
                <span>{hasVoted ? 'Laporan Telah Anda Dukung' : 'Dukung Laporan Ini'}</span>
              </button>

              {/* Tombol Share WhatsApp */}
              <button
                type="button"
                onClick={handleWhatsAppShare}
                className="w-full min-h-11 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer shadow-xs active:scale-95"
              >
                <MessageCircle className="w-4 h-4" />
                <span>Sebarkan ke Grup WhatsApp</span>
              </button>

              <hr className="border-slate-100" />

              {/* Informasi Dinas Penanggung Jawab */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Dinas Penanggung Jawab
                </span>
                <div className="p-3.5 rounded-2xl bg-slate-50 border border-slate-200/80 flex items-start gap-3">
                  <Building2 className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold text-xs text-slate-900 block">
                      {report.assignedAgency || 'Dinas PUPR / DLH Kota Bengkulu'}
                    </span>
                    <span className="text-[11px] text-slate-500 mt-0.5 block leading-relaxed">
                      Laporan ini terintegrasi langsung dengan koordinat wilayah tugas dinas teknis.
                    </span>
                  </div>
                </div>
              </div>

              {/* Status Pelapor & Verifikasi NIK */}
              <div className="space-y-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 block">
                  Kredensial Pelapor
                </span>
                <div className="p-3.5 rounded-2xl bg-emerald-50/50 border border-emerald-200/70 space-y-1.5">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <UserCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>{report.reporterAlias}</span>
                  </div>
                  <div className="flex items-center gap-2 text-[11px] text-emerald-700 font-mono">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    <span>NIK: {report.reporterNikMasked || '1771**********01'} (Terverifikasi)</span>
                  </div>
                </div>
              </div>

              {/* Buka Peta Penuh */}
              <Link
                href={`/peta`}
                className="w-full py-2.5 rounded-xl border border-slate-200 hover:border-blue-300 hover:bg-blue-50/50 text-slate-700 hover:text-blue-600 font-semibold text-xs transition-colors flex items-center justify-center gap-1.5"
              >
                <span>Lihat Sebaran di Peta Publik</span>
                <ArrowUpRight className="w-3.5 h-3.5" />
              </Link>
            </div>

          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}
