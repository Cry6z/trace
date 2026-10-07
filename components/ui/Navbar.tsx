'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { LogOut, Plus } from 'lucide-react';
import { getUserSession, logoutUser, AUTH_CHANGE_EVENT } from '@/lib/auth';
import { useToast } from '@/components/ui/ToastProvider';

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({}: NavbarProps = {}) {
  const pathname = usePathname();
  const { toast } = useToast();
  const [userName, setUserName] = useState<string | null>(null);

  useEffect(() => {
    const syncUser = () => {
      const user = getUserSession();
      if (user?.nama) {
        const firstName = user.nama.split(' ')[0];
        setUserName(firstName);
      } else {
        setUserName(null);
      }
    };

    syncUser();

    window.addEventListener(AUTH_CHANGE_EVENT, syncUser);
    window.addEventListener('storage', syncUser);

    return () => {
      window.removeEventListener(AUTH_CHANGE_EVENT, syncUser);
      window.removeEventListener('storage', syncUser);
    };
  }, []);

  const handleNavbarLogout = () => {
    if (typeof document !== 'undefined') {
      document.body.style.overflow = '';
    }
    logoutUser();
    setUserName(null);
    toast.success('Berhasil Keluar', 'Sesi akun TRACE Anda telah diakhiri.');
    if (pathname.startsWith('/dashboard')) {
      setTimeout(() => {
        window.location.href = '/';
      }, 150);
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
            <div className="flex items-center gap-2 sm:gap-2.5">
              <span className="text-lg sm:text-xl font-bold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                TRACE
              </span>
              <span className="text-slate-300 hidden md:inline text-sm">/</span>
              <span className="text-xs text-slate-500 font-normal hidden lg:inline max-w-sm xl:max-w-md truncate">
                Tracking Reports & Aggregating Community Environmental Issues
              </span>
            </div>
          </Link>

          {/* Right Navigation & Action CTA (Disembunyikan di Mobile karena sudah ada Menu Bawah) */}
          <div className="hidden md:flex items-center gap-4 lg:gap-5">
            {/* Peta Publik Link */}
            <Link
              href="/peta"
              className={`text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 rounded-lg px-2.5 py-1.5 ${
                pathname.startsWith('/peta')
                  ? 'text-blue-600 font-bold'
                  : 'text-slate-600 hover:text-blue-600'
              }`}
            >
              Peta Publik
            </Link>

            {/* User Profile jika sudah login */}
            {userName ? (
              <div className="flex items-center gap-2">
                {/* User Profile Link */}
                <Link
                  href="/dashboard"
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-slate-200/90 bg-slate-50/80 hover:bg-slate-100 text-slate-700 hover:text-blue-600 transition-colors text-sm font-semibold active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
                  title="Buka Dashboard Pengaduan"
                >
                  <div className="w-6 h-6 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs shrink-0 ring-1 ring-blue-200">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                  <span className="truncate max-w-28">{userName}</span>
                </Link>

                {/* Tombol Logout Cepat di Navbar */}
                <button
                  type="button"
                  onClick={handleNavbarLogout}
                  className="min-h-9 px-3 py-1.5 rounded-full border border-rose-200 bg-rose-50/80 hover:bg-rose-100 text-rose-700 text-xs font-bold transition-all flex items-center gap-1.5 active:scale-95 focus-visible:outline-2 focus-visible:outline-rose-600 cursor-pointer shadow-2xs"
                  title="Keluar dari akun Anda"
                  aria-label="Keluar akun"
                >
                  <LogOut className="w-3.5 h-3.5 text-rose-600 shrink-0" />
                  <span>Keluar</span>
                </button>
              </div>
            ) : null}

            {/* Primary Action Button: 1 Card Button Bersih Tanpa Card Tambahan di Dalam */}
            <Link
              href="/dashboard/buat-laporan"
              className="inline-flex items-center gap-2 text-sm font-bold px-5 py-2.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-500/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Lapor Masalah</span>
            </Link>
          </div>

        </div>
      </div>
    </header>
  );
}
