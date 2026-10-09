'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  Plus, 
  User, 
  LayoutDashboard, 
  Clock, 
  ShieldCheck 
} from 'lucide-react';
import { getUserSession, AUTH_CHANGE_EVENT, UserSession } from '@/lib/auth';

interface NavbarProps {
  activeTab?: string;
}

export default function Navbar({}: NavbarProps = {}) {
  const pathname = usePathname();
  const [userName, setUserName] = useState<string | null>(null);
  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false);
  const profileRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const syncUser = () => {
      const user = getUserSession();
      if (user?.nama) {
        setUserSession(user);
        const firstName = user.nama.split(' ')[0];
        setUserName(firstName);
      } else {
        setUserSession(null);
        setUserName(null);
        setIsProfileOpen(false);
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

  // Menutup dropdown profil saat klik di luar
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Menutup dropdown saat berpindah halaman
  useEffect(() => {
    setIsProfileOpen(false);
  }, [pathname]);

  return (
    <header className="sticky top-2 sm:top-3.5 z-50 w-full px-3 sm:px-6 lg:px-8 transition-all">
      <div className="max-w-7xl mx-auto">
        <div className="rounded-full bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_rgba(15,23,42,0.08),0_1px_3px_rgba(15,23,42,0.04),inset_0_1px_1px_rgba(255,255,255,0.9)] ring-1 ring-slate-900/5 px-3.5 sm:px-6 py-2 sm:py-2.5 flex items-center justify-between transition-all duration-300">
          
          {/* Logo & Brand */}
          <Link href="/" className="flex items-center gap-2.5 sm:gap-3 group shrink-0 focus-visible:outline-2 focus-visible:outline-blue-600 rounded-full">
            <div className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800/20 shrink-0 group-hover:scale-105 transition-transform duration-200">
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
              <span className="text-xs text-slate-500 font-normal hidden lg:inline max-w-xs xl:max-w-md truncate">
                Tracking Reports & Aggregating Community Environmental Issues
              </span>
            </div>
          </Link>

          {/* Right Navigation & Action CTA (Desktop) */}
          <div className="hidden md:flex items-center gap-2.5 sm:gap-3">
            {/* Peta Publik Link */}
            <Link
              href="/peta"
              className={`text-sm font-semibold transition-colors focus-visible:outline-2 focus-visible:outline-blue-600 rounded-full px-3.5 py-1.5 ${
                pathname.startsWith('/peta')
                  ? 'text-blue-600 font-bold bg-blue-50/80'
                  : 'text-slate-600 hover:text-blue-600 hover:bg-slate-100/60'
              }`}
            >
              Peta Publik
            </Link>

            {/* Primary Action Button (Lapor Masalah) */}
            <Link
              href="/dashboard/buat-laporan"
              className="inline-flex items-center gap-1.5 text-sm font-bold px-4.5 py-2 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-md shadow-blue-500/20 transition-all focus-visible:outline-2 focus-visible:outline-blue-600"
            >
              <Plus className="w-4 h-4 stroke-[2.5]" />
              <span>Lapor Masalah</span>
            </Link>

            {/* Profil Warga (Icon Avatar saja di sebelah kanan Lapor Masalah) */}
            {userName ? (
              <div className="relative" ref={profileRef}>
                <button
                  type="button"
                  onClick={() => setIsProfileOpen(!isProfileOpen)}
                  className={`w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer focus-visible:outline-2 focus-visible:outline-blue-600 active:scale-95 ${
                    isProfileOpen
                      ? 'ring-3 ring-blue-500/30 scale-105 shadow-xs'
                      : 'hover:scale-105 hover:ring-2 hover:ring-slate-300'
                  }`}
                  aria-expanded={isProfileOpen}
                  aria-haspopup="true"
                  title={`Profil Akun: ${userSession?.nama || userName}`}
                >
                  <div className="w-full h-full rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-xs border border-white/80">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                </button>

                {/* Dropdown Menu Profil Terstruktur */}
                {isProfileOpen && (
                  <div className="absolute right-0 top-full mt-2.5 w-72 rounded-2xl bg-white border border-slate-200/90 shadow-xl shadow-slate-200/40 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                    {/* Ringkasan Akun Warga */}
                    <div className="p-3 rounded-xl bg-slate-50/80 border border-slate-100/90 space-y-1.5 mb-1.5">
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-xs font-bold text-slate-900 truncate">
                          {userSession?.nama || userName}
                        </span>
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-emerald-50 border border-emerald-200 text-[10px] font-bold text-emerald-700 shrink-0">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 shrink-0" />
                          <span>Terverifikasi</span>
                        </span>
                      </div>
                      <div className="text-[11px] font-mono text-slate-400 truncate">
                        NIK: {userSession?.nikMasked || '1771**********01'}
                      </div>
                      {userSession?.kecamatan && (
                        <div className="text-[10px] text-slate-500 truncate pt-1 border-t border-slate-200/60">
                          Domisili: Kec. {userSession.kecamatan}
                        </div>
                      )}
                    </div>

                    {/* Menu Navigasi Terstruktur */}
                    <div className="space-y-0.5">
                      <Link
                        href="/dashboard"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 group-hover:bg-blue-100 flex items-center justify-center shrink-0">
                          <LayoutDashboard className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900 group-hover:text-blue-700">Dashboard Warga</div>
                          <div className="text-[10px] text-slate-400">Pantau progres laporan aktif</div>
                        </div>
                      </Link>

                      <Link
                        href="/dashboard?tab=riwayat"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 flex items-center justify-center shrink-0">
                          <Clock className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900">Riwayat & Arsip Tiket</div>
                          <div className="text-[10px] text-slate-400">Daftar semua keluhan tersimpan</div>
                        </div>
                      </Link>

                      <Link
                        href="/dashboard?tab=profil"
                        onClick={() => setIsProfileOpen(false)}
                        className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs font-medium text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors group"
                      >
                        <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-600 group-hover:bg-slate-200/80 flex items-center justify-center shrink-0">
                          <User className="w-3.5 h-3.5" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <div className="font-bold text-slate-900">Profil & Keamanan PIN</div>
                          <div className="text-[10px] text-slate-400">Rincian identitas & ganti PIN</div>
                        </div>
                      </Link>
                    </div>
                  </div>
                )}
              </div>
            ) : null}
          </div>

          {/* Right Mobile Action: Lapor Cepat & Avatar */}
          <div className="flex md:hidden items-center gap-2">
            <Link
              href="/dashboard/buat-laporan"
              className="inline-flex items-center gap-1 text-xs font-bold px-3 py-1.5 rounded-full bg-blue-600 hover:bg-blue-700 active:scale-95 text-white shadow-xs transition-all"
            >
              <Plus className="w-3.5 h-3.5 stroke-[2.5]" />
              <span>Lapor</span>
            </Link>
            {userName ? (
              <Link
                href="/dashboard"
                className="w-8 h-8 rounded-full bg-linear-to-br from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shrink-0 shadow-xs ring-2 ring-white"
                title="Buka Dashboard"
              >
                {userName.charAt(0).toUpperCase()}
              </Link>
            ) : null}
          </div>

        </div>
      </div>
    </header>
  );
}
