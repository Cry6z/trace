'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Shield, KeyRound, UserCheck, ArrowRight, ArrowLeft, Lock, AlertCircle } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export interface OfficerProfile {
  nip: string;
  nama: string;
  jabatan: string;
  instansi: string;
}

const DEMO_OFFICERS: OfficerProfile[] = [
  {
    nip: '198704122011011003',
    nama: 'Ir. Hendra Gunawan, S.T.',
    jabatan: 'Koordinator Bidang Bina Marga & Jalan',
    instansi: 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)',
  },
  {
    nip: '199008242015022001',
    nama: 'Siti Rahmawati, S.Si.',
    jabatan: 'Pengawas Pengelolaan Sampah & Drainase',
    instansi: 'Dinas Lingkungan Hidup (DLH)',
  },
];

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
      setErrorMsg('Mohon masukkan PIN / sandi keamanan dinas.');
      return;
    }

    const matched = DEMO_OFFICERS.find((o) => o.nip === nip.trim());
    const officer: OfficerProfile = matched || {
      nip: nip.trim(),
      nama: 'Petugas Teknis Lapangan',
      jabatan: 'Verifikator & Operator Dinas',
      instansi,
    };

    onLoginSuccess(officer);
    toast.success('Autentikasi Berhasil', `Selamat datang, ${officer.nama}`);
  };

  const handleQuickDemo = (officer: OfficerProfile) => {
    setNip(officer.nip);
    setPin('123456');
    setInstansi(officer.instansi);
    setErrorMsg('');
    onLoginSuccess(officer);
    toast.success('Masuk Sebagai Petugas Demo', `Selamat bertugas, ${officer.nama}`);
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 relative overflow-hidden">
      {/* Background glow effects */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-blue-600/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 left-10 w-72 h-72 bg-indigo-600/10 rounded-full blur-3xl pointer-events-none" />

      {/* Back to Home Link */}
      <div className="w-full max-w-md mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Beranda Publik TRACE</span>
        </Link>
      </div>

      <div className="w-full max-w-md bg-slate-900/90 backdrop-blur-xl border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl relative z-10 space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3 pb-5 border-b border-slate-800">
          <div className="w-11 h-11 rounded-2xl bg-blue-600/20 border border-blue-500/30 flex items-center justify-center shrink-0">
            <Shield className="w-5 h-5 text-blue-400" />
          </div>
          <div>
            <div className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-wider text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded-full border border-blue-500/20 mb-1">
              <Lock className="w-2.5 h-2.5" />
              <span>Akses Terbatas / Restriktif</span>
            </div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Konsol Petugas Satgas
            </h1>
            <p className="text-xs text-slate-400">
              TRACE Kota Bengkulu
            </p>
          </div>
        </div>

        {/* Notice */}
        <div className="p-3 rounded-xl bg-slate-800/60 border border-slate-700/60 text-xs text-slate-400 leading-relaxed">
          Halaman ini khusus untuk personel dinas teknis (PUPR, DLH, Dishub) untuk verifikasi laporan dan penerbitan bukti tuntas.
        </div>

        {/* Error message */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/50 border border-rose-800 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              NIP / Nomor Identitas Pegawai
            </label>
            <input
              type="text"
              value={nip}
              onChange={(e) => setNip(e.target.value)}
              placeholder="Contoh: 198704122011011003"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-mono"
            />
          </div>

          <div className="space-y-1.5">
            <label className="text-xs font-semibold text-slate-300">
              Instansi / Satuan Kerja
            </label>
            <select
              value={instansi}
              onChange={(e) => setInstansi(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
            <label className="text-xs font-semibold text-slate-300">
              PIN / Sandi Keamanan Petugas
            </label>
            <input
              type="password"
              value={pin}
              onChange={(e) => setPin(e.target.value)}
              placeholder="Masukkan sandi dinas (Demo: 123456)"
              className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-slate-100 text-xs placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            />
          </div>

          <button
            type="submit"
            className="w-full min-h-11 py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-blue-600/30 transition-all focus-visible:outline-2 focus-visible:outline-blue-500"
          >
            <UserCheck className="w-4 h-4" />
            <span>Masuk ke Konsol Petugas</span>
            <ArrowRight className="w-4 h-4 ml-auto" />
          </button>
        </form>

        {/* Quick Demo Officer Logins */}
        <div className="pt-4 border-t border-slate-800/80 space-y-2.5">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block">
            Pintasan Akun Petugas Demo:
          </span>
          <div className="space-y-1.5">
            {DEMO_OFFICERS.map((officer) => (
              <button
                key={officer.nip}
                type="button"
                onClick={() => handleQuickDemo(officer)}
                className="w-full text-left p-2.5 rounded-xl bg-slate-800/40 hover:bg-slate-800 border border-slate-700/50 hover:border-blue-500/50 transition-all flex items-center justify-between group active:scale-98"
              >
                <div>
                  <div className="text-xs font-bold text-slate-200 group-hover:text-blue-400 transition-colors">
                    {officer.nama}
                  </div>
                  <div className="text-[10px] text-slate-400 font-mono">
                    {officer.instansi.split(' ')[0]} {officer.instansi.split(' ')[1]} • NIP: {officer.nip}
                  </div>
                </div>
                <span className="text-[10px] font-semibold text-blue-400 bg-blue-500/10 px-2 py-1 rounded-lg shrink-0">
                  Gunakan
                </span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
