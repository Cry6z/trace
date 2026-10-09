'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { 
  CreditCard, 
  Lock, 
  Smartphone, 
  AlertCircle, 
  CheckCircle2, 
  Loader2, 
  ArrowRight, 
  UserPlus,
  Eye,
  EyeOff
} from 'lucide-react';
import { 
  findCitizen, 
  loginCitizenWithPin, 
  loginCitizenWithOtp, 
  CitizenAccount,
  syncCitizensFromSupabase
} from '@/lib/auth';
import { requestOtp } from '@/lib/security/otpService';
import { useToast } from '@/components/ui/ToastProvider';

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export default function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectUrl = searchParams.get('redirect') || '/dashboard';
  const { toast } = useToast();

  const [authMethod, setAuthMethod] = useState<'pin' | 'otp'>('pin');
  const [identifier, setIdentifier] = useState<string>('');
  const [pin, setPin] = useState<string>('');
  const [otpCode, setOtpCode] = useState<string>('');
  const [debugOtp, setDebugOtp] = useState<string>('');
  const [isOtpSent, setIsOtpSent] = useState<boolean>(false);
  const [countdown, setCountdown] = useState<number>(180);
  const [showPin, setShowPin] = useState<boolean>(false);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string>('');
  const [isNotRegistered, setIsNotRegistered] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Timer Countdown OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (isOtpSent && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [isOtpSent, countdown]);

  // Sinkronkan akun terdaftar dari Supabase saat form dibuka
  useEffect(() => {
    syncCitizensFromSupabase().catch(() => {});
  }, []);

  // Handle Pilih Akun Demo Cepat
  const handleSelectDemoAccount = (demo: CitizenAccount) => {
    setIdentifier(demo.nik);
    setPin(demo.pin);
    setAuthMethod('pin');
    setErrorMsg('');
    setIsNotRegistered(false);
  };

  // Handle Kirim OTP WhatsApp
  const handleRequestOtp = () => {
    setErrorMsg('');
    setIsNotRegistered(false);

    const clean = identifier.replace(/\D/g, '').trim();
    if (!clean) {
      setErrorMsg('Mohon masukkan NIK atau Nomor WhatsApp Anda.');
      return;
    }

    const citizen = findCitizen(clean);
    if (!citizen) {
      setIsNotRegistered(true);
      setErrorMsg('Identitas NIK atau No HP belum terdaftar dalam sistem TRACE. Anda harus mendaftar akun terlebih dahulu.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = requestOtp(citizen.phone);
      setIsLoading(false);

      if (res.success) {
        setIsOtpSent(true);
        setCountdown(180);
        if (res.debugCode) {
          setDebugOtp(res.debugCode);
        }
        toast.success('Kode OTP Terkirim', `Kode 6-digit dikirimkan ke ${citizen.phoneMasked}`);
      } else {
        setErrorMsg(res.message);
      }
    }, 500);
  };

  // Handle Submit Login
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsNotRegistered(false);

    const clean = identifier.replace(/\D/g, '').trim();
    if (!clean) {
      setErrorMsg('Mohon masukkan NIK atau Nomor WhatsApp Anda.');
      return;
    }

    // Periksa apakah akun terdaftar (cek lokal & Supabase)
    let citizen = findCitizen(clean);
    if (!citizen) {
      setIsLoading(true);
      await syncCitizensFromSupabase();
      citizen = findCitizen(clean);
      setIsLoading(false);
    }

    if (!citizen) {
      setIsNotRegistered(true);
      setErrorMsg('Identitas NIK atau No HP ini belum terdaftar dalam sistem TRACE.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (authMethod === 'pin') {
        const res = loginCitizenWithPin(clean, pin);
        setIsLoading(false);

        if (res.success) {
          setIsSuccess(true);
          toast.success('Masuk Berhasil!', res.message);
          setTimeout(() => {
            router.push(redirectUrl);
          }, 800);
        } else {
          setErrorMsg(res.message);
        }
      } else {
        // Mode OTP
        if (!isOtpSent) {
          setIsLoading(false);
          handleRequestOtp();
          return;
        }

        const res = loginCitizenWithOtp(clean, otpCode);
        setIsLoading(false);

        if (res.success) {
          setIsSuccess(true);
          toast.success('Verifikasi Berhasil!', res.message);
          setTimeout(() => {
            router.push(redirectUrl);
          }, 800);
        } else {
          setErrorMsg(res.message);
        }
      }
    }, 500);
  };

  return (
    <div className="space-y-6">
      {/* Banner Pesan Error */}
      {errorMsg && (
        <div className="p-4 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs sm:text-sm flex flex-col gap-2.5 animate-in fade-in duration-200">
          <div className="flex items-start gap-2.5">
            <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
            <span className="leading-relaxed">{errorMsg}</span>
          </div>
          {isNotRegistered && (
            <button
              type="button"
              onClick={onSwitchToRegister}
              className="mt-1 self-start inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs shadow-xs transition-colors cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>Daftar Akun Baru Sekarang &rarr;</span>
            </button>
          )}
        </div>
      )}

      {/* Banner Berhasil */}
      {isSuccess && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs sm:text-sm flex items-center gap-2.5 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span className="font-semibold">
            Sesi terverifikasi! Mengalihkan ke {redirectUrl === '/dashboard/buat-laporan' ? 'formulir pelaporan' : 'dashboard'}...
          </span>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* 1. NIK atau No WhatsApp */}
        <div className="space-y-2">
          <label className="block text-xs sm:text-sm font-bold text-slate-800">
            NIK (16 Digit) atau Nomor WhatsApp <span className="text-rose-500">*</span>
          </label>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
              <CreditCard className="w-4 h-4" />
            </div>
            <input
              type="text"
              required
              value={identifier}
              onChange={(e) => {
                setIdentifier(e.target.value);
                setIsNotRegistered(false);
                setErrorMsg('');
              }}
              placeholder="Contoh: 1771012304950001 atau 0812..."
              disabled={isLoading || isSuccess}
              className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 transition-all shadow-xs"
            />
          </div>
        </div>

        {/* 2. MODE PIN 6 DIGIT */}
        {authMethod === 'pin' ? (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                PIN Keamanan (6 Digit) <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => setShowPin(!showPin)}
                className="text-xs text-slate-500 hover:text-blue-600 font-medium inline-flex items-center gap-1 cursor-pointer transition-colors"
              >
                {showPin ? <EyeOff className="w-3.5 h-3.5" /> : <Eye className="w-3.5 h-3.5" />}
                <span>{showPin ? 'Sembunyikan' : 'Lihat'}</span>
              </button>
            </div>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
                <Lock className="w-4 h-4" />
              </div>
              <input
                type={showPin ? 'text' : 'password'}
                required
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value.replace(/\D/g, ''))}
                placeholder="Masukkan 6 angka PIN Anda"
                disabled={isLoading || isSuccess}
                className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 bg-white font-mono text-xs sm:text-sm text-slate-900 placeholder:font-sans placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 transition-all shadow-xs tracking-wider"
              />
            </div>

            {/* Alternatif Opsi OTP (Discreet Link, bukan Tab Berdesakan) */}
            <div className="pt-1 flex items-center justify-between text-xs">
              <span className="text-slate-400">Lupa PIN atau nomor baru?</span>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('otp');
                  setErrorMsg('');
                  setIsNotRegistered(false);
                }}
                className="font-semibold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
              >
                Masuk lewat OTP WhatsApp &rarr;
              </button>
            </div>
          </div>
        ) : (
          /* MODE KODE OTP WHATSAPP */
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="block text-xs sm:text-sm font-bold text-slate-800">
                Verifikasi OTP WhatsApp <span className="text-rose-500">*</span>
              </label>
              <button
                type="button"
                onClick={() => {
                  setAuthMethod('pin');
                  setErrorMsg('');
                  setIsNotRegistered(false);
                }}
                className="text-xs text-blue-600 hover:text-blue-700 font-semibold cursor-pointer"
              >
                &larr; Kembali ke PIN
              </button>
            </div>

            {!isOtpSent ? (
              <button
                type="button"
                onClick={handleRequestOtp}
                disabled={isLoading || isSuccess}
                className="w-full py-3 px-4 rounded-xl border border-blue-200 bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs sm:text-sm font-bold transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60 shadow-xs"
              >
                {isLoading ? (
                  <Loader2 className="w-4 h-4 animate-spin" />
                ) : (
                  <Smartphone className="w-4 h-4" />
                )}
                <span>Kirim Kode OTP WhatsApp</span>
              </button>
            ) : (
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-500 font-mono">
                  <span>Masukkan 6 Digit OTP:</span>
                  <span>
                    Berlaku {Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, '0')}
                  </span>
                </div>
                <input
                  type="text"
                  required
                  maxLength={6}
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))}
                  placeholder="6 digit angka"
                  disabled={isLoading || isSuccess}
                  className="w-full py-3 px-4 rounded-xl border border-slate-200 bg-white text-center font-mono tracking-widest text-lg font-bold text-slate-900 focus:outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-500/10 disabled:bg-slate-50 shadow-xs"
                />

                {debugOtp && (
                  <div className="p-2.5 rounded-xl bg-amber-50 border border-amber-200 text-amber-800 text-xs flex items-center justify-between">
                    <span>Simulasi Kode OTP Pengujian:</span>
                    <strong className="font-mono bg-amber-100 px-2 py-0.5 rounded text-amber-900">
                      {debugOtp}
                    </strong>
                  </div>
                )}
              </div>
            )}
          </div>
        )}

        {/* Tombol Submit Utama */}
        <button
          type="submit"
          disabled={isLoading || isSuccess}
          className="w-full min-h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-bold text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 disabled:opacity-60 cursor-pointer mt-2"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Memverifikasi Identitas...</span>
            </>
          ) : (
            <>
              <span>Masuk ke Akun TRACE</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>



      {/* Link ke Pendaftaran */}
      <div className="pt-1 text-center">
        <p className="text-xs sm:text-sm text-slate-500">
          Belum memiliki akun warga terdaftar?{' '}
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="font-bold text-blue-600 hover:text-blue-700 hover:underline cursor-pointer"
          >
            Daftar Akun Baru Sekarang
          </button>
        </p>
      </div>
    </div>
  );
}
