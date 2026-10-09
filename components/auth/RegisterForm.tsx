'use client';

import React, { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  User, 
  CreditCard, 
  Phone, 
  Lock, 
  ShieldCheck, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight,
  Eye,
  EyeOff
} from 'lucide-react';
import { registerCitizen } from '@/lib/auth';
import { useToast } from '@/components/ui/ToastProvider';

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export default function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const { toast } = useToast();

  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [nik, setNik] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [pinConfirm, setPinConfirm] = useState<string>('');
  const [agreeTerms, setAgreeTerms] = useState<boolean>(true);
  const [showPin, setShowPin] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const cleanNik = nik.replace(/\D/g, '');
    if (cleanNik.length !== 16) {
      setErrorMsg('NIK harus berjumlah tepat 16 digit angka sesuai e-KTP.');
      return;
    }

    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Nomor WhatsApp / HP tidak valid (minimal 10 digit).');
      return;
    }

    const cleanPin = pin.replace(/\D/g, '');
    if (cleanPin.length !== 6) {
      setErrorMsg('PIN keamanan harus terdiri dari 6 digit angka.');
      return;
    }

    if (cleanPin !== pinConfirm.replace(/\D/g, '')) {
      setErrorMsg('Konfirmasi PIN tidak sesuai dengan PIN utama.');
      return;
    }

    if (!agreeTerms) {
      setErrorMsg('Anda wajib menyetujui ketentuan verifikasi data kependudukan.');
      return;
    }

    setIsLoading(true);

    try {
      const result = await registerCitizen({
        namaLengkap,
        nik: cleanNik,
        phone: cleanPhone,
        pin: cleanPin,
      });

      setIsLoading(false);

      if (result.success) {
        setIsSuccess(true);
        toast.success(
          'Pendaftaran Berhasil!',
          `Akun ${namaLengkap} telah terdaftar dan terverifikasi di TRACE Bengkulu.`
        );

        setTimeout(() => {
          router.push(redirectUrl);
        }, 1000);
      } else {
        setErrorMsg(result.message);
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err?.message || 'Terjadi kesalahan sistem saat mendaftarkan akun. Silakan coba kembali.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-in fade-in duration-200">
      {/* Banner Pesan Error */}
      {errorMsg && (
        <div className="p-3.5 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2.5 animate-in shake duration-200">
          <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
          <span className="leading-relaxed">{errorMsg}</span>
        </div>
      )}

      {/* Banner Berhasil */}
      {isSuccess && (
        <div className="p-3.5 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2.5">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-medium">
            Akun warga terverifikasi! Mengalihkan ke {redirectUrl === '/dashboard/buat-laporan' ? 'formulir pelaporan' : 'dashboard'}...
          </span>
        </div>
      )}

      {/* 1. Nama Lengkap (Sesuai KTP) */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Nama Lengkap (Sesuai e-KTP) <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <User className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            value={namaLengkap}
            onChange={(e) => setNamaLengkap(e.target.value)}
            placeholder="Contoh: Budi Santoso"
            disabled={isLoading || isSuccess}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-slate-50"
          />
        </div>
      </div>

      {/* 2. NIK (16 Digit) */}
      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <label className="block text-xs font-bold text-slate-700">
            Nomor Induk Kependudukan (NIK) <span className="text-rose-500">*</span>
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {nik.replace(/\D/g, '').length}/16 digit
          </span>
        </div>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <CreditCard className="w-4 h-4" />
          </div>
          <input
            type="text"
            required
            maxLength={16}
            value={nik}
            onChange={(e) => setNik(e.target.value.replace(/\D/g, ''))}
            placeholder="Contoh: 1771011205850001"
            disabled={isLoading || isSuccess}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-slate-50"
          />
        </div>
        <p className="text-[10px] text-slate-400">
          NIK dilindungi UU PDP. Di publik, NIK Anda akan disamarkan menjadi <code>1771**********01</code>.
        </p>
      </div>

      {/* 3. Nomor WhatsApp / HP */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Nomor WhatsApp / HP Aktif <span className="text-rose-500">*</span>
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Phone className="w-4 h-4" />
          </div>
          <input
            type="tel"
            required
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Contoh: 081234567890"
            disabled={isLoading || isSuccess}
            className="w-full pl-10 pr-3.5 py-2.5 rounded-xl border border-slate-200 bg-white text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 transition-all disabled:bg-slate-50"
          />
        </div>
      </div>

      {/* 4. PIN Keamanan 6 Digit */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between">
            <label className="block text-xs font-bold text-slate-700">
              PIN Akun (6 Digit) <span className="text-rose-500">*</span>
            </label>
            <button
              type="button"
              onClick={() => setShowPin(!showPin)}
              className="text-[10px] text-blue-600 hover:text-blue-700 font-semibold inline-flex items-center gap-1 cursor-pointer"
            >
              {showPin ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
              <span>{showPin ? 'Sembunyikan' : 'Lihat'}</span>
            </button>
          </div>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              type={showPin ? 'text' : 'password'}
              required
              maxLength={6}
              value={pin}
              onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
              placeholder="6 angka rahasia"
              disabled={isLoading || isSuccess}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
            />
          </div>
        </div>

        <div className="space-y-1.5">
          <label className="block text-xs font-bold text-slate-700">
            Ulangi PIN (6 Digit) <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400">
              <Lock className="w-3.5 h-3.5" />
            </div>
            <input
              type={showPin ? 'text' : 'password'}
              required
              maxLength={6}
              value={pinConfirm}
              onChange={(e) => setPinConfirm(e.target.value.replace(/\D/g, ''))}
              placeholder="Konfirmasi 6 angka"
              disabled={isLoading || isSuccess}
              className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-500/20 disabled:bg-slate-50"
            />
          </div>
        </div>
      </div>

      {/* Persetujuan Privasi */}
      <div className="pt-1">
        <label className="flex items-start gap-2.5 cursor-pointer text-left">
          <input
            type="checkbox"
            checked={agreeTerms}
            onChange={(e) => setAgreeTerms(e.target.checked)}
            className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
          />
          <span className="text-[11px] text-slate-500 leading-tight">
            Saya menyetujui data identitas kependudukan ini digunakan secara sah untuk verifikasi pelaporan fasilitas publik Kota Bengkulu sesuai standar keamanan <strong>UU PDP No. 27/2022</strong>.
          </span>
        </label>
      </div>

      {/* Tombol Daftar */}
      <button
        type="submit"
        disabled={isLoading || isSuccess}
        className="w-full min-h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
      >
        {isLoading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Memverifikasi Akun Warga...</span>
          </>
        ) : (
          <>
            <span>Daftar Akun Warga Bengkulu</span>
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      {/* Beralih ke Login */}
      <div className="pt-2 text-center">
        <p className="text-xs text-slate-500">
          Sudah memiliki akun terdaftar?{' '}
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Masuk ke Akun
          </button>
        </p>
      </div>
    </form>
  );
}
