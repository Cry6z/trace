import React from 'react';
import { KeyRound } from 'lucide-react';

interface OtpVerificationFormProps {
  debugOtp: string;
  otpCode: string;
  onOtpCodeChange: (val: string) => void;
  countdown: number;
  isLoading: boolean;
  onBackToInput: () => void;
  onResendOtp: () => void;
  onSubmit: (e: React.FormEvent) => void;
}

export default function OtpVerificationForm({
  debugOtp,
  otpCode,
  onOtpCodeChange,
  countdown,
  isLoading,
  onBackToInput,
  onResendOtp,
  onSubmit,
}: OtpVerificationFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-5">
      {/* OTP Simulation Notification */}
      {debugOtp && (
        <div className="p-3.5 rounded-2xl bg-amber-50 border border-amber-200 text-amber-900 text-xs space-y-1">
          <div className="font-bold flex items-center gap-1.5 text-amber-800">
            <KeyRound className="w-4 h-4" />
            <span>Mode Simulasi OTP (Pengujian Cepat)</span>
          </div>
          <p>
            Kode OTP Anda:{' '}
            <strong className="font-mono text-sm tracking-widest text-slate-900 bg-white px-2 py-0.5 rounded border border-amber-300">
              {debugOtp}
            </strong>
          </p>
          <button
            type="button"
            onClick={() => onOtpCodeChange(debugOtp)}
            className="text-[11px] text-blue-600 hover:underline font-semibold"
          >
            Tempel Otomatis
          </button>
        </div>
      )}

      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-2 text-center">
          Masukkan 6-Digit Kode OTP
        </label>
        <input
          type="text"
          maxLength={6}
          required
          autoFocus
          placeholder="• • • • • •"
          value={otpCode}
          onChange={(e) => onOtpCodeChange(e.target.value.replace(/\D/g, ''))}
          className="w-full text-center tracking-[0.5em] text-2xl font-mono py-3 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all text-slate-900"
        />
      </div>

      {/* Countdown Timer */}
      <div className="flex items-center justify-between text-xs text-slate-500">
        <span>Masa aktif kode:</span>
        <span className="font-mono font-semibold text-slate-700">
          {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')}
        </span>
      </div>

      {/* Submit Verification Button */}
      <button
        type="submit"
        disabled={isLoading || otpCode.length !== 6}
        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isLoading ? 'Memvalidasi...' : 'Verifikasi & Lanjutkan'}
      </button>

      {/* Ganti Nomor / Kirim Ulang */}
      <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
        <button
          type="button"
          onClick={onBackToInput}
          className="text-slate-500 hover:text-slate-800"
        >
          Ubah NIK / No HP
        </button>

        <button
          type="button"
          disabled={countdown > 0}
          onClick={onResendOtp}
          className={`font-semibold ${
            countdown > 0
              ? 'text-slate-300 cursor-not-allowed'
              : 'text-blue-600 hover:underline'
          }`}
        >
          Kirim Ulang OTP
        </button>
      </div>
    </form>
  );
}
