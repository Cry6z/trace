'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { FileText, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  activeTab?: 'map' | 'about' | 'stats';
}

export default function Navbar({ activeTab = 'map' }: NavbarProps) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    try {
      const stored = sessionStorage.getItem('trace_user');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed?.nama) {
          const firstName = parsed.nama.split(' ')[0];
          queueMicrotask(() => {
            setUserName(firstName);
          });
        }
      }
    } catch {
      // ignore
    }
  }, []);

  // Animasi scroll halus saat ditekan
  const handleScrollTo = (e: React.MouseEvent<HTMLAnchorElement>, targetId: string) => {
    if (pathname === '/') {
      e.preventDefault();
      if (targetId === 'top') {
        window.scrollTo({ top: 0, behavior: 'smooth' });
        window.history.pushState(null, '', '/');
      } else {
        const element = document.getElementById(targetId);
        if (element) {
          const navOffset = 85;
          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
          window.scrollTo({
            top: elementPosition - navOffset,
            behavior: 'smooth',
          });
          window.history.pushState(null, '', `/#${targetId}`);
        }
      }
    }
  };

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-200/80 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-18 lg:h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg">
            <div className="w-8.5 h-8.5 sm:w-9 sm:h-9 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  TRACE
                </span>
                <span className="text-[10px] font-semibold text-blue-600 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200/60 hidden xs:inline-block">
                  Bengkulu
                </span>
              </div>
            </div>
          </Link>

          {/* Center Navigation Links (Desktop & Tablet Wide) */}
          <nav className="hidden md:flex items-center gap-5 lg:gap-7 xl:gap-8 text-sm font-medium">
            {/* 1. Beranda (Smooth scroll to top) */}
            <a
              href="/"
              onClick={(e) => handleScrollTo(e, 'top')}
              className={`relative py-2 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 rounded cursor-pointer ${
                activeTab === 'map' && pathname === '/'
                  ? 'text-slate-900 font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>Beranda</span>
              {activeTab === 'map' && pathname === '/' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </a>

            {/* 2. Cara Melapor (Smooth scroll to #cara-kerja) */}
            <a
              href="/#cara-kerja"
              onClick={(e) => handleScrollTo(e, 'cara-kerja')}
              className="py-2 text-slate-600 hover:text-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 rounded cursor-pointer"
            >
              Cara Melapor
            </a>

            {/* 3. Privasi NIK (Smooth scroll to #keamanan-nik) */}
            <a
              href="/#keamanan-nik"
              onClick={(e) => handleScrollTo(e, 'keamanan-nik')}
              className="py-2 text-slate-600 hover:text-blue-600 transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 rounded cursor-pointer"
            >
              Privasi NIK
            </a>

            {/* 4. Peta Penuh (Paling Kanan & Berwarna Biru karena Route ke Halaman Lain) */}
            <Link
              href="/peta"
              className={`inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shadow-2xs active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600 ${
                pathname.startsWith('/peta')
                  ? 'bg-blue-600 text-white shadow-sm shadow-blue-500/20'
                  : 'text-blue-600 bg-blue-50 hover:bg-blue-100 hover:text-blue-700 border border-blue-200/80'
              }`}
              title="Buka Peta Wilayah Penuh Kota Bengkulu"
            >
              <span>Peta Penuh</span>
              <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </nav>

          {/* Right Action CTA & User Link (Direct, No Dropdowns) */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Primary Action Button */}
            <Link
              href="/dashboard/buat-laporan"
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm font-semibold px-3.5 sm:px-5 py-2 sm:py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-sm shadow-blue-500/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <FileText className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />
              <span className="hidden xs:inline">Buat Laporan</span>
              <span className="xs:hidden">Lapor</span>
            </Link>

            {/* User Profile Direct Link */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50/70 hover:bg-slate-100/90 text-slate-700 hover:text-blue-600 transition-colors text-xs sm:text-sm font-semibold active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
              title="Buka Dashboard Pengaduan"
            >
              <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-blue-200">
                {userName ? userName.charAt(0).toUpperCase() : 'W'}
              </div>
              <span className="truncate max-w-28 hidden sm:inline">{userName || 'Warga'}</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
