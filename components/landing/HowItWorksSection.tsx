'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Camera, ShieldCheck, Building2, CheckCircle2, ArrowRight } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Camera,
    title: 'Tandai Lokasi & Ambil Foto',
    description:
      'Pilih kategori isu dan tentukan titik jalan atau fasilitas publik langsung di peta interaktif. Ambil foto bukti dari ponsel Anda dengan posisi akurat.',
    preview: {
      label: 'Sistem Deteksi Geospasial',
      detail: 'Koordinat GPS Kota Bengkulu terkunci otomatis',
      accent: 'text-blue-600 bg-blue-50/70 border-blue-100',
    },
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Verifikasi Cepat & Validasi Laporan',
    description:
      'Sistem memverifikasi keabsahan data laporan warga, memfilter duplikasi secara otomatis, dan memastikan identitas pelapor terlindungi.',
    preview: {
      label: 'Validasi Integritas Data',
      detail: 'Laporan tervalidasi • NIK Terenkripsi UU PDP',
      accent: 'text-indigo-600 bg-indigo-50/70 border-indigo-100',
    },
  },
  {
    number: '03',
    icon: Building2,
    title: 'Disposisi ke Instansi Terkait',
    description:
      'Tiket laporan diteruskan otomatis ke dinas teknis berwenang (PUPR, Dishub, atau DLH) sesuai jenis kerusakan dan wilayah kelurahan.',
    preview: {
      label: 'Routing Terintegrasi Pemkot',
      detail: 'Disposisi otomatis ke Dinas PUPR / Dishub Kota Bengkulu',
      accent: 'text-amber-700 bg-amber-50/70 border-amber-200/70',
    },
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Pantau Progres & Bukti Penanganan Tuntas',
    description:
      'Warga dapat memantau linimasa pengerjaan secara real-time hingga dinas terkait mengunggah foto perbaikan fisik yang telah selesai dikerjakan.',
    preview: {
      label: 'Transparansi Hasil Nyata',
      detail: 'Pengerjaan 100% Selesai • Foto Bukti Fisik Terverifikasi',
      accent: 'text-emerald-700 bg-emerald-50/70 border-emerald-200/70',
    },
  },
];

export default function HowItWorksSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [cardsInView, setCardsInView] = useState<boolean[]>([true, false, false, false]);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useEffect(() => {
    const observers: IntersectionObserver[] = [];

    cardRefs.current.forEach((el, index) => {
      if (!el) return;
      const obs = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            setCardsInView((prev) => {
              const next = [...prev];
              next[index] = true;
              return next;
            });
            setActiveStep(index);
          }
        },
        {
          threshold: 0.35,
          rootMargin: '0px 0px -10% 0px',
        }
      );
      obs.observe(el);
      observers.push(obs);
    });

    return () => {
      observers.forEach((obs) => obs.disconnect());
    };
  }, []);

  const handleScrollToCard = (index: number) => {
    setActiveStep(index);
    const target = cardRefs.current[index];
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
      });
    }
  };

  return (
    <section id="cara-kerja" className="bg-slate-50/60 py-16 sm:py-24 border-t border-slate-200/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          
          {/* Kolom Kiri: Sticky Header & Navigator Alur */}
          <div className="lg:col-span-5 lg:sticky lg:top-24 space-y-8">
            <div>
              <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-3">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block animate-pulse" />
                <span>Alur Pelaporan Warga</span>
              </div>
              
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold text-slate-900 tracking-tight leading-tight">
                Transparan dari Titik Lapor hingga Tuntas
              </h2>
              
              <p className="mt-3.5 text-sm sm:text-base text-slate-500 leading-relaxed">
                Tidak ada birokrasi berbelit. Setiap pengaduan warga memiliki kode pelacakan unik yang dapat dipantau bersama secara terbuka dan akuntabel.
              </p>
            </div>

            {/* Vertical Navigator (Desktop) */}
            <div className="hidden lg:flex flex-col gap-1.5 p-2 rounded-2xl bg-white border border-slate-200/80 shadow-2xs">
              {STEPS.map((step, idx) => {
                const isActive = activeStep === idx;
                return (
                  <button
                    key={step.number}
                    type="button"
                    onClick={() => handleScrollToCard(idx)}
                    className={`flex items-center gap-3.5 p-3 rounded-xl text-left transition-all duration-200 cursor-pointer ${
                      isActive
                        ? 'bg-blue-50/80 text-blue-900 font-semibold'
                        : 'hover:bg-slate-50 text-slate-600'
                    }`}
                  >
                    <div
                      className={`w-8 h-8 rounded-lg flex items-center justify-center font-mono text-xs font-bold transition-all ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-xs'
                          : 'bg-slate-100 text-slate-500'
                      }`}
                    >
                      {step.number}
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className={`text-xs block truncate ${isActive ? 'font-bold text-blue-950' : 'text-slate-700'}`}>
                        {step.title}
                      </span>
                    </div>
                    {isActive && (
                      <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0" />
                    )}
                  </button>
                );
              })}
            </div>

            {/* CTA Button */}
            <div className="pt-1">
              <Link
                href="/dashboard/buat-laporan"
                className="inline-flex items-center gap-2 text-sm font-bold px-6 py-3 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-500/20 transition-all"
              >
                <span>Laporkan Masalah Sekarang</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>

          {/* Kolom Kanan: Vertical Timeline Interaktif dengan Card Modern Minimalist */}
          <div className="lg:col-span-7 relative">
            {/* Garis Vertikal Linimasa */}
            <div className="absolute left-4.5 sm:left-5 top-8 bottom-8 w-0.5 bg-slate-200" />

            <div className="space-y-6 sm:space-y-8">
              {STEPS.map((step, idx) => {
                const Icon = step.icon;
                const isActive = activeStep === idx;
                const isSeen = cardsInView[idx];

                return (
                  <div
                    key={step.number}
                    ref={(el) => {
                      cardRefs.current[idx] = el;
                    }}
                    className={`relative pl-12 sm:pl-14 transition-all duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] ${
                      isSeen
                        ? 'opacity-100 translate-y-0'
                        : 'opacity-0 translate-y-12'
                    }`}
                  >
                    {/* Node Lingkaran Menyala pada Garis Vertikal */}
                    <div
                      className={`absolute left-4.5 sm:left-5 top-6 -translate-x-1/2 w-8 h-8 sm:w-9 sm:h-9 rounded-full flex items-center justify-center transition-all duration-300 z-10 ${
                        isActive
                          ? 'bg-blue-600 text-white shadow-lg shadow-blue-500/35 ring-4 ring-blue-100 scale-110'
                          : 'bg-white border-2 border-slate-300 text-slate-400'
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    {/* Card Konten (Tanpa badge GPS Otomatis dll., Bersih & Modern Minimalist) */}
                    <div
                      onClick={() => handleScrollToCard(idx)}
                      className={`rounded-2xl bg-white border p-6 sm:p-7 transition-all duration-300 cursor-pointer ${
                        isActive
                          ? 'border-blue-500/80 shadow-xl shadow-blue-500/8 ring-1 ring-blue-500/20'
                          : 'border-slate-200/80 hover:border-slate-300 hover:shadow-md'
                      }`}
                    >
                      {/* Baris Atas: Nomor Langkah Bersih */}
                      <div className="flex items-center justify-between mb-3.5">
                        <span
                          className={`font-mono text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors ${
                            isActive ? 'text-blue-600' : 'text-slate-300'
                          }`}
                        >
                          {step.number}
                        </span>
                        <span className="font-mono text-xs text-slate-400 font-medium">
                          Tahap {idx + 1} dari 4
                        </span>
                      </div>

                      {/* Judul & Keterangan */}
                      <h3
                        className={`text-base sm:text-lg font-bold transition-colors leading-snug mb-2 ${
                          isActive ? 'text-slate-900' : 'text-slate-800'
                        }`}
                      >
                        {step.title}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-500 leading-relaxed mb-4">
                        {step.description}
                      </p>

                      {/* Micro Preview Box (Elemen Visual Interaktif Canggih) */}
                      <div className={`p-3 rounded-xl border text-xs flex items-center gap-2.5 transition-colors ${step.preview.accent}`}>
                        <span className="w-2 h-2 rounded-full bg-current animate-pulse shrink-0" />
                        <div className="min-w-0">
                          <span className="font-semibold block text-slate-800">{step.preview.label}</span>
                          <span className="text-[11px] opacity-80 block truncate mt-0.5">{step.preview.detail}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
