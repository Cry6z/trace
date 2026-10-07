'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowLeft, ShieldCheck, LogIn, UserPlus } from 'lucide-react';
import LoginForm from './LoginForm';
import RegisterForm from './RegisterForm';

interface AuthContainerProps {
  initialTab?: 'masuk' | 'daftar';
}

const SLOGANS = [
  'Suara Warga, Aksi Nyata untuk Kota Bengkulu.',
  'Pantau, Laporkan, dan Kawal Fasilitas Publik Bersama.',
  'Transparansi Pembangunan di Ujung Jari Anda.',
  'Wujudkan Lingkungan Kota yang Lebih Nyaman dan Tertata.',
];

export default function AuthContainer({ initialTab = 'masuk' }: AuthContainerProps) {
  const [activeTab, setActiveTab] = useState<'masuk' | 'daftar'>(initialTab);

  // Logika Animasi Mesin Ketik (Typewriter Effect) Berotasi
  const [sloganIndex, setSloganIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentSlogan = SLOGANS[sloganIndex];
    let timer: NodeJS.Timeout;

    if (!isDeleting) {
      if (displayText.length < currentSlogan.length) {
        timer = setTimeout(() => {
          setDisplayText(currentSlogan.slice(0, displayText.length + 1));
        }, 65);
      } else {
        // Selesai mengetik satu slogan penuh, jeda 2.2 detik agar terbaca jelas
        timer = setTimeout(() => {
          setIsDeleting(true);
        }, 2200);
      }
    } else {
      if (displayText.length > 0) {
        timer = setTimeout(() => {
          setDisplayText(currentSlogan.slice(0, displayText.length - 1));
        }, 30);
      } else {
        // Selesai menghapus mundur, beralih ke slogan berikutnya
        setIsDeleting(false);
        setSloganIndex((prev) => (prev + 1) % SLOGANS.length);
      }
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, sloganIndex]);

  return (
    <div className="min-h-screen lg:h-screen lg:overflow-hidden w-full bg-white grid grid-cols-1 lg:grid-cols-12 antialiased">
      {/* SISI KIRI: Civic Branding & Rotating Typewriter Slogan Panel (Fixed Desktop Only) */}
      <div className="hidden lg:flex lg:col-span-5 xl:col-span-5 bg-slate-950 text-white relative flex-col justify-between p-12 xl:p-16 overflow-hidden h-full">
        {/* Subtle Ambient Glow Effects */}
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-600/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-32 -right-32 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />

        {/* Top Header: Navigasi & Identitas (Tanpa Card Bengkulu) */}
        <div className="relative z-10 space-y-8">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span>Kembali ke Peta Publik</span>
          </Link>

          <div className="flex items-center gap-3.5">
            <div className="w-11 h-11 rounded-2xl bg-white/10 p-0.5 border border-white/20 backdrop-blur-md flex items-center justify-center shrink-0 shadow-lg">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover rounded-xl"
                priority
              />
            </div>
            <div>
              <span className="text-xl font-extrabold tracking-tight text-white block">
                TRACE
              </span>
              <p className="text-xs text-slate-400 font-medium max-w-xs leading-relaxed">
                Tracking Reports & Aggregating Community Environmental Issues
              </p>
            </div>
          </div>
        </div>

        {/* Center: Rotating Typewriter Slogan (Cuma ini saja sesuai permintaan pengguna) */}
        <div className="relative z-10 my-auto py-12">
          <div className="min-h-24 sm:min-h-28 flex items-center">
            <h2 className="text-2xl sm:text-3xl xl:text-4xl font-extrabold tracking-tight text-white leading-tight">
              {displayText}
              <span className="inline-block w-0.75 h-7 xl:h-9 ml-1.5 bg-blue-400 animate-pulse align-middle" />
            </h2>
          </div>
        </div>

        {/* Bottom Attribution: PKM-KC Credits */}
        <div className="relative z-10 pt-6 border-t border-slate-800/80 text-xs text-slate-400 space-y-1">
          <p className="font-semibold text-slate-200">
            Kelompok 11 PKM-KC Informatika Universitas Bengkulu
          </p>
          <p className="text-[11px] text-slate-400">
            Program Kreativitas Mahasiswa Karsa Cipta · Jurusan Informatika, Fakultas Teknik
          </p>
        </div>
      </div>

      {/* SISI KANAN: Spacious Clean Minimalist Form Workspace (Scrollable on Desktop) */}
      <div className="lg:col-span-7 xl:col-span-7 flex flex-col items-center py-10 sm:py-12 lg:py-16 px-6 sm:px-12 lg:px-16 xl:px-20 bg-slate-50/60 min-h-screen lg:min-h-0 lg:h-full lg:overflow-y-auto scroll-smooth">
        <div className="w-full max-w-lg space-y-8 my-auto">
          
          {/* Mobile Back Button & Brand Header */}
          <div className="lg:hidden flex items-center justify-between pb-2">
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Kembali</span>
            </Link>

            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-lg bg-slate-950 overflow-hidden flex items-center justify-center">
                <Image
                  src="/logo.png"
                  alt="TRACE Logo"
                  width={28}
                  height={28}
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-base font-bold text-slate-900 tracking-tight">TRACE</span>
            </div>
          </div>

          {/* Form Header Title */}
          <div className="space-y-2 text-left">
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
              {activeTab === 'masuk' ? 'Masuk ke Akun Warga' : 'Pendaftaran Akun Warga'}
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              {activeTab === 'masuk'
                ? 'Masukkan NIK atau No WhatsApp terdaftar untuk memantau progres aduan dan membuat laporan baru.'
                : 'Lengkapi identitas NIK dan domisili Kota Bengkulu Anda untuk mulai berpartisipasi.'}
            </p>
          </div>

          {/* Navigation Pill Switcher (Clean, Spacious, Not Crowded) */}
          <div className="flex rounded-2xl bg-slate-200/70 p-1.5 border border-slate-200/80">
            <button
              type="button"
              onClick={() => setActiveTab('masuk')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'masuk'
                  ? 'bg-white text-blue-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <LogIn className="w-4 h-4" />
              <span>Masuk Akun</span>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('daftar')}
              className={`flex-1 py-2.5 text-xs sm:text-sm font-bold rounded-xl transition-all flex items-center justify-center gap-2 cursor-pointer ${
                activeTab === 'daftar'
                  ? 'bg-white text-blue-700 shadow-sm shadow-slate-200'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserPlus className="w-4 h-4" />
              <span>Daftar Warga Baru</span>
            </button>
          </div>

          {/* Card Form Container - Spacious, Clean, and Modern */}
          <div className="bg-white p-7 sm:p-10 rounded-3xl border border-slate-200/80 shadow-xl shadow-slate-200/40">
            {activeTab === 'masuk' ? (
              <LoginForm onSwitchToRegister={() => setActiveTab('daftar')} />
            ) : (
              <RegisterForm onSwitchToLogin={() => setActiveTab('masuk')} />
            )}
          </div>

          {/* Footer Sub-info */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 pt-2">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>Kerahasiaan data terjamin (UU PDP No. 27/2022)</span>
            </div>
            <span className="text-[11px] text-slate-400">
              Kelompok 11 PKM-KC UNIB
            </span>
          </div>

        </div>
      </div>
    </div>
  );
}
