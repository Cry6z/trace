'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowLeft, ArrowRight, AlertCircle, ShieldCheck, UserPlus, KeyRound, CheckCircle2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { 
  OfficerProfile, 
  OfficerAccount, 
  authenticateOfficer, 
  authenticateOfficerAsync,
  registerOfficer 
} from '@/lib/officerAuth';

export type { OfficerProfile };

interface AdminLoginFormProps {
  onLoginSuccess: (officer: OfficerProfile) => void;
}

export default function AdminLoginForm({ onLoginSuccess }: AdminLoginFormProps) {
  const { toast } = useToast();
  const [mode, setMode] = useState<'login' | 'register'>('login');

  // State Login
  const [identifier, setIdentifier] = useState('admin');
  const [pin, setPin] = useState('admin123');
  const [instansi, setInstansi] = useState('Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
  const [errorMsg, setErrorMsg] = useState('');

  // State Register Akun Baru
  const [regNama, setRegNama] = useState('');
  const [regNip, setRegNip] = useState('');
  const [regUsername, setRegUsername] = useState('');
  const [regJabatan, setRegJabatan] = useState('Verifikator & Operator Dinas');
  const [regInstansi, setRegInstansi] = useState('Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
  const [regPin, setRegPin] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle Login Petugas
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsSubmitting(true);

    try {
      const res = await authenticateOfficerAsync(identifier, pin, instansi);
      setIsSubmitting(false);

      if (!res.success || !res.officer) {
        setErrorMsg(res.message || 'Gagal masuk. Periksa kembali NIP/Username dan PIN Anda.');
        return;
      }

      onLoginSuccess(res.officer);
      toast.success('Autentikasi Berhasil', `Selamat bertugas, ${res.officer.nama}`);
    } catch {
      setIsSubmitting(false);
      setErrorMsg('Terjadi kendala autentikasi. Silakan periksa koneksi Anda.');
    }
  };

  // Handle Pendaftaran Akun Petugas Baru
  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (!regNama.trim()) {
      setErrorMsg('Mohon isi nama lengkap petugas.');
      return;
    }
    if (!regNip.trim()) {
      setErrorMsg('Mohon isi NIP pegawai dinas.');
      return;
    }
    if (!regPin.trim()) {
      setErrorMsg('Mohon buat PIN / sandi pengaman akun.');
      return;
    }

    setIsSubmitting(true);

    const newOfficer: OfficerAccount = {
      nama: regNama.trim(),
      nip: regNip.trim(),
      username: regUsername.trim() || regNip.trim(),
      jabatan: regJabatan.trim() || 'Verifikator Dinas',
      instansi: regInstansi,
      pin: regPin.trim(),
      role: 'dinas_teknis',
    };

    const res = await registerOfficer(newOfficer);

    setIsSubmitting(false);
    if (res.success) {
      toast.success('Akun Petugas Dibuat!', `Selamat datang, ${newOfficer.nama}`);
      onLoginSuccess(newOfficer);
    } else {
      setErrorMsg(res.message || 'Gagal membuat akun petugas.');
    }
  };

  const handleFillMasterAdmin = () => {
    setIdentifier('admin');
    setPin('admin123');
    setInstansi('Dinas Pekerjaan Umum & Penataan Ruang (PUPR)');
    setErrorMsg('');
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-center items-center px-4 py-12 text-slate-100 selection:bg-blue-600 selection:text-white">
      {/* Tombol Navigasi Kembali ke Beranda */}
      <div className="w-full max-w-md mb-6 flex items-center justify-between">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-slate-500" />
          <span>Kembali ke Beranda TRACE</span>
        </Link>

        <span className="text-[11px] font-mono text-blue-400 font-semibold bg-blue-950/80 border border-blue-900/60 px-2 py-0.5 rounded-md">
          Portal Resmi Dinas
        </span>
      </div>

      {/* Kartu Form Login/Register Admin */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6">
        {/* Header Konsol Dinas */}
        <div className="pb-4 border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-slate-950 border border-slate-800 overflow-hidden flex items-center justify-center shrink-0 shadow-xs">
              <Image
                src="/logo.png"
                alt="TRACE Logo"
                width={40}
                height={40}
                className="w-full h-full object-cover"
                priority
              />
            </div>
            <div>
              <span className="text-[10px] font-mono font-bold tracking-wider text-blue-400 uppercase">
                Pemerintah Kota Bengkulu
              </span>
              <h1 className="text-lg sm:text-xl font-extrabold text-white tracking-tight leading-tight">
                Konsol Administrasi Dinas
              </h1>
            </div>
          </div>
          <p className="text-xs text-slate-400 mt-2.5 leading-relaxed">
            Portal verifikasi penanganan pengaduan fasilitas publik dan penerbitan bukti fisik lapangan.
          </p>
        </div>

        {/* Tab Switcher: Masuk vs Buat Akun Baru */}
        <div className="grid grid-cols-2 gap-1.5 bg-slate-950 p-1 rounded-xl border border-slate-800 text-xs font-semibold">
          <button
            type="button"
            onClick={() => {
              setMode('login');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'login'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <KeyRound className="w-3.5 h-3.5" />
            <span>Masuk Petugas</span>
          </button>
          <button
            type="button"
            onClick={() => {
              setMode('register');
              setErrorMsg('');
            }}
            className={`py-2 px-3 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
              mode === 'register'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>Buat Akun Petugas</span>
          </button>
        </div>

        {/* Pesan Kesalahan Validasi */}
        {errorMsg && (
          <div className="p-3 rounded-xl bg-rose-950/40 border border-rose-900/60 text-rose-300 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* MODE 1: FORM MASUK PETUGAS */}
        {mode === 'login' && (
          <form onSubmit={handleLogin} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Username atau NIP Pegawai
              </label>
              <input
                type="text"
                required
                value={identifier}
                onChange={(e) => {
                  setIdentifier(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Contoh: admin atau 198001012005011001"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-semibold text-slate-300 block">
                Instansi / Dinas Penanggung Jawab
              </label>
              <select
                value={instansi}
                onChange={(e) => setInstansi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
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
              <label className="text-xs font-semibold text-slate-300 block">
                PIN / Sandi Keamanan
              </label>
              <input
                type="password"
                required
                value={pin}
                onChange={(e) => {
                  setPin(e.target.value);
                  if (errorMsg) setErrorMsg('');
                }}
                placeholder="Masukkan sandi dinas"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              className="w-full h-11 rounded-xl bg-blue-600 hover:bg-blue-500 active:scale-[0.99] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-blue-600/20"
            >
              <span>Masuk ke Konsol Petugas</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Kotak Info Akun Administrator Resmi */}
            <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2 mt-4">
              <div className="flex items-center justify-between text-slate-400 font-semibold text-[11px]">
                <span className="flex items-center gap-1.5 text-blue-400">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  <span>Akun Administrator Bawaan:</span>
                </span>
                <button
                  type="button"
                  onClick={handleFillMasterAdmin}
                  className="text-blue-400 hover:text-blue-300 font-bold underline cursor-pointer"
                >
                  Isi Otomatis
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-[11px] font-mono text-slate-300 bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                <div>
                  <span className="text-slate-500 block text-[10px]">USERNAME</span>
                  <span className="font-bold text-white">admin</span>
                </div>
                <div>
                  <span className="text-slate-500 block text-[10px]">SANDI / PIN</span>
                  <span className="font-bold text-emerald-400">admin123</span>
                </div>
              </div>
            </div>
          </form>
        )}

        {/* MODE 2: FORM PENDAFTARAN AKUN PETUGAS BARU */}
        {mode === 'register' && (
          <form onSubmit={handleRegister} className="space-y-3.5">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Nama Lengkap Petugas <span className="text-rose-400">*</span>
              </label>
              <input
                type="text"
                required
                value={regNama}
                onChange={(e) => setRegNama(e.target.value)}
                placeholder="Contoh: Ir. Rudi Hartono, S.T."
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  NIP Pegawai <span className="text-rose-400">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={regNip}
                  onChange={(e) => setRegNip(e.target.value)}
                  placeholder="Contoh: 198512122010011005"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                />
              </div>

              <div className="space-y-1">
                <label className="text-xs font-semibold text-slate-300 block">
                  Username Akun
                </label>
                <input
                  type="text"
                  value={regUsername}
                  onChange={(e) => setRegUsername(e.target.value)}
                  placeholder="Contoh: rudi.pupr"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Instansi Dinas Penugasan <span className="text-rose-400">*</span>
              </label>
              <select
                value={regInstansi}
                onChange={(e) => setRegInstansi(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors cursor-pointer"
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

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                Jabatan / Peran Petugas
              </label>
              <input
                type="text"
                value={regJabatan}
                onChange={(e) => setRegJabatan(e.target.value)}
                placeholder="Contoh: Pengawas Lapangan & Verifikator"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-slate-300 block">
                PIN / Sandi Keamanan Petugas <span className="text-rose-400">*</span>
              </label>
              <input
                type="password"
                required
                value={regPin}
                onChange={(e) => setRegPin(e.target.value)}
                placeholder="Buat sandi keamanan dinas (minimal 6 karakter)"
                className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-white text-xs placeholder:text-slate-600 focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-colors font-mono"
              />
            </div>

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full h-11 rounded-xl bg-emerald-600 hover:bg-emerald-500 active:scale-[0.99] text-white font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-md shadow-emerald-600/20 disabled:opacity-50 mt-2"
            >
              <CheckCircle2 className="w-4 h-4" />
              <span>{isSubmitting ? 'Mendaftarkan Petugas...' : 'Daftarkan & Masuk Langsung'}</span>
            </button>
          </form>
        )}
      </div>
    </div>
  );
}
