'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { ArrowLeft, AlertCircle, CheckCircle2 } from 'lucide-react';
import { maskNik, maskPhone } from '@/lib/security/nikCrypto';
import { requestOtp, verifyOtp } from '@/lib/security/otpService';
import NikPhoneForm from '@/components/auth/NikPhoneForm';
import OtpVerificationForm from '@/components/auth/OtpVerificationForm';

export default function MasukPage() {
  const router = useRouter();

  // State Step 1: NIK & No HP
  const [step, setStep] = useState<'input_nik' | 'verify_otp'>('input_nik');
  const [nik, setNik] = useState<string>('');
  const [namaLengkap, setNamaLengkap] = useState<string>('');
  const [phone, setPhone] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string>('');
  
  // State Step 2: OTP
  const [otpCode, setOtpCode] = useState<string>('');
  const [debugOtp, setDebugOtp] = useState<string>('');
  const [countdown, setCountdown] = useState<number>(180); // 3 menit
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Timer Countdown untuk OTP
  useEffect(() => {
    let timer: NodeJS.Timeout | undefined;
    if (step === 'verify_otp' && countdown > 0) {
      timer = setInterval(() => {
        setCountdown((prev) => prev - 1);
      }, 1000);
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [step, countdown]);

  // Handle Submit NIK & Request OTP
  const handleRequestOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    // Validasi NIK (16 digit)
    const cleanNik = nik.replace(/\D/g, '');
    if (cleanNik.length !== 16) {
      setErrorMsg('NIK harus berjumlah tepat 16 digit angka.');
      return;
    }

    // Validasi No Telepon (minimal 10 digit)
    const cleanPhone = phone.replace(/\D/g, '');
    if (cleanPhone.length < 10) {
      setErrorMsg('Nomor WhatsApp / HP tidak valid (minimal 10 digit).');
      return;
    }

    setIsLoading(true);

    // Simulasi pengiriman OTP
    setTimeout(() => {
      const res = requestOtp(cleanPhone);
      setIsLoading(false);

      if (res.success) {
        setStep('verify_otp');
        setCountdown(180);
        if (res.debugCode) {
          setDebugOtp(res.debugCode);
        }
      } else {
        setErrorMsg(res.message);
      }
    }, 600);
  };

  // Handle Verify OTP
  const handleVerifyOtp = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (otpCode.length !== 6) {
      setErrorMsg('Kode OTP harus berjumlah 6 digit.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      const res = verifyOtp(phone, otpCode);
      setIsLoading(false);

      if (res.success) {
        setIsSuccess(true);
        // Simpan sesi lokal ringkas untuk demo
        if (typeof window !== 'undefined') {
          sessionStorage.setItem(
            'trace_user',
            JSON.stringify({
              nama: namaLengkap || 'Warga Terverifikasi',
              nikMasked: maskNik(nik),
              phoneMasked: maskPhone(phone),
              isLoggedIn: true,
            })
          );
        }

        setTimeout(() => {
          router.push('/dashboard');
        }, 1000);
      } else {
        setErrorMsg(res.message);
      }
    }, 600);
  };

  const handleResendOtp = () => {
    const res = requestOtp(phone);
    if (res.success) {
      setCountdown(180);
      if (res.debugCode) setDebugOtp(res.debugCode);
    } else {
      setErrorMsg(res.message);
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      {/* Tombol Kembali ke Beranda */}
      <div className="sm:mx-auto sm:w-full sm:max-w-md px-4 mb-4">
        <Link 
          href="/" 
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Kembali ke Peta Komunitas</span>
        </Link>
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-slate-950 overflow-hidden shadow-lg shadow-slate-900/15 mb-1 border border-slate-800/30">
            <Image
              src="/logo.png"
              alt="TRACE Logo"
              width={56}
              height={56}
              className="w-full h-full object-cover"
              priority
            />
          </div>
          <h2 className="text-2xl font-extrabold tracking-tight text-slate-900">
            {step === 'input_nik' ? 'Akses Masuk & Pelaporan TRACE' : 'Verifikasi Kode OTP'}
          </h2>
          <p className="text-xs text-slate-500 max-w-xs mx-auto">
            {step === 'input_nik'
              ? 'Warga cukup memasukkan NIK & nomor HP untuk membuat dan memantau progres penanganan laporan.'
              : `Kode OTP 6-digit telah dikirimkan ke nomor ${maskPhone(phone)}`}
          </p>
        </div>

        {/* Card Box */}
        <div className="mt-8 bg-white py-8 px-6 shadow-xl shadow-slate-200/50 rounded-3xl border border-slate-200/80 sm:px-10">
          {/* Banner Error */}
          {errorMsg && (
            <div className="mb-5 p-3 rounded-2xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-start gap-2 animate-in fade-in">
              <AlertCircle className="w-4 h-4 shrink-0 mt-0.5 text-rose-600" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Banner Success */}
          {isSuccess && (
            <div className="mb-5 p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Verifikasi Berhasil! Mengalihkan ke Dashboard Warga...</span>
            </div>
          )}

          {/* STEP 1: FORM INPUT NIK & NO HP */}
          {step === 'input_nik' && (
            <NikPhoneForm
              namaLengkap={namaLengkap}
              onNamaChange={setNamaLengkap}
              nik={nik}
              onNikChange={setNik}
              phone={phone}
              onPhoneChange={setPhone}
              isLoading={isLoading}
              onSubmit={handleRequestOtp}
            />
          )}

          {/* STEP 2: FORM VERIFIKASI OTP */}
          {step === 'verify_otp' && (
            <OtpVerificationForm
              debugOtp={debugOtp}
              otpCode={otpCode}
              onOtpCodeChange={setOtpCode}
              countdown={countdown}
              isLoading={isLoading}
              onBackToInput={() => {
                setStep('input_nik');
                setOtpCode('');
                setErrorMsg('');
              }}
              onResendOtp={handleResendOtp}
              onSubmit={handleVerifyOtp}
            />
          )}
        </div>
      </div>
    </div>
  );
}
