'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export interface OfficerProfile {
  nip: string;
  nama: string;
  jabatan: string;
  instansi: string;
}

interface AdminLoginFormProps {
  onLoginSuccess: (officer: OfficerProfile) => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const { toast } = useToast();
  const [nip, setNip] = useState('');
  const [pin, setPin] = useState('');
  const [instansi, setInstansi] = useState('Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
  const [errorMsg, setErrorMsg] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (!nip.trim()) {
      setErrorMsg('Mohon masukkan NIP petugas Anda.');
      return;
    }
    if (!pin.trim()) {
      setErrorMsg('Mohon masukkan PIN / sandi dinas.');
      return;
    }

    const officer: OfficerProfile = {
      nip: nip.trim(),
      nama: 'Petugas Teknis Lapangan',
      jabatan: 'Verifikator & Operator Dinas',
      instansi,
    };

    onLoginSuccess(officer);
    toast.success('Autentikasi Berhasil', `Selamat bertugas, ${officer.nama}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100">
      {/* Tombol Navigasi Kembali ke Beranda */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Kembali ke Beranda TRACE</span>
        </Link>
      </div>

      {/* Kartu Form Login Admin Bersih & Minimalis (Tanpa Gradient & Tanpa AI-look) */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-xl space-y-6">
        {/* Header Bersih dengan Logo Resmi & Tipografi Putih Biru */}
        <div className="pb-5 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={36}
                height={36}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-[11px] font-mono font-semibold tracking-wider text-blue-400 uppercase">
                Portal Petugas
              </span>
              <h1 className="text-lg sm:text-xl font-bold text-white tracking-tight leading-tight">
                Konsol Administrasi Dinas
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Sistem verifikasi, penugasan teknis, dan pelaporan bukti penanganan fisik Kota Bengkulu.
          </p>
        </div>

        {/* Pesan Kesalahan Validasi */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form Login Utama */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Nomor Induk Pegawai (NIP)
            </label>
            <input
              type="text"
              value={nip}
              onChange={(e) => {
                setNip(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Contoh: 198704122011011003"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              Instansi Dinas Terkait
            </label>
            <select
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            >
              <option value="Dinas Pekerjaan Umum & Penataan Ruang (PUPR)">
                Dinas Pekerjaan Umum & Penataan Ruang (PUPR)
              </option>
              <option value="Dinas Lingkungan Hidup (DLH)">
                Dinas Lingkungan Hidup (DLH)
              </option>
              <option value="Dinas Perhubungan (Dishub)">
                Dinas Perhubungan (Dishub)
              </option>
              <option value="Satuan Polisi Pamong Praja (Satpol PP)">
                Satuan Polisi Pamong Praja (Satpol PP)
              </option>
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300 block">
              PIN / Sandi Keamanan
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => {
                setPin(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="Masukkan sandi dinas (Demo: 123456)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
            />
          </div>

          <button
            type="submit"
            className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-semibold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
          >
            <span>Masuk ke Konsol Petugas</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
}
