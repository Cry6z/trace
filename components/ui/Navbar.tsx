'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { FileText, User, ChevronDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  activeTab?: 'map' | 'about' | 'stats';
}

export default function Navbar({ activeTab = 'map' }: NavbarProps) {
  const [userName, setUserName] = useState<string | null>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

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

  return (
    <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-slate-100 transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-3 group shrink-0">
            <div className="w-9 h-9 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <span className="text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
              TRACE
            </span>
          </Link>

          {/* Center Navigation Links (Minimalist with Bottom Active Line Indicator) */}
          <nav className="hidden md:flex items-center gap-8 lg:gap-10 text-sm font-medium">
            <Link
              href="/"
              className={`relative py-2 transition-colors ${
                activeTab === 'map'
                  ? 'text-slate-900 font-semibold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              <span>Beranda</span>
              {activeTab === 'map' && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 rounded-full" />
              )}
            </Link>

            <Link
              href="/peta"
              className="py-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              Peta Penuh
            </Link>

            <Link
              href="/#cara-kerja"
              className="py-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              Cara Melapor
            </Link>

            <Link
              href="/#keamanan-nik"
              className="py-2 text-slate-600 hover:text-blue-600 transition-colors"
            >
              Privasi NIK
            </Link>
          </nav>

          {/* Right Action CTA (White & Blue Theme) */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Primary Action Button (Biru Putih) */}
            <Link
              href="/masuk"
              className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-500/20 active:scale-95 transition-all"
            >
              <FileText className="w-4 h-4" />
              <span>Buat Laporan</span>
            </Link>

            {/* Tombol User Profile dengan Chevron */}
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 px-3 py-2 rounded-full text-slate-700 hover:text-blue-600 hover:bg-slate-50 transition-colors text-sm font-medium group"
              title="Dashboard User"
            >
              <User className="w-4 h-4 text-slate-600 group-hover:text-blue-600 transition-colors" />
              <span className="hidden sm:inline">{userName || 'User'}</span>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-blue-600 transition-colors" />
            </Link>

            {/* Mobile Hamburger Toggle */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen((prev) => !prev)}
              className="md:hidden p-2 rounded-full text-slate-600 hover:text-slate-900 hover:bg-slate-100 transition-colors"
              aria-label="Toggle Navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Card */}
        {mobileMenuOpen && (
          <div className="md:hidden pb-4 pt-2 border-t border-slate-100 space-y-1">
            <Link
              href="/"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2 rounded-lg text-sm font-semibold ${
                activeTab === 'map' ? 'text-blue-600 bg-blue-50' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              Beranda
            </Link>
            <Link
              href="/peta"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Peta Penuh
            </Link>
            <Link
              href="/#cara-kerja"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Cara Melapor
            </Link>
            <Link
              href="/#keamanan-nik"
              onClick={() => setMobileMenuOpen(false)}
              className="block px-3 py-2 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50"
            >
              Privasi NIK
            </Link>
          </div>
        )}

      </div>
    </header>
  );
}
