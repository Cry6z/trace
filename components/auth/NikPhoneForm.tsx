import React from 'react';
import { Lock, Smartphone, ShieldCheck } from 'lucide-react';
import { maskNik } from '@/lib/security/nikCrypto';

interface NikPhoneFormProps {
  namaLengkap: string;
  onNamaChange: (val: string) => void;
  nik: string;
  onNikChange: (val: string) => void;
  phone: string;
  onPhoneChange: (val: string) => void;
  isLoading: boolean;
  onSubmit: (e: React.FormEvent) => void;
}

export default function NikPhoneForm({
  namaLengkap,
  onNamaChange,
  nik,
  onNikChange,
  phone,
  onPhoneChange,
  isLoading,
  onSubmit,
}: NikPhoneFormProps) {
  return (
    <form onSubmit={onSubmit} className="space-y-4">
      {/* Nama Lengkap */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          Nama Lengkap (Sesuai KTP)
        </label>
        <input
          type="text"
          required
          placeholder="Contoh: Budi Santoso"
          value={namaLengkap}
          onChange={(e) => onNamaChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
        />
      </div>

      {/* NIK Input */}
      <div>
        <div className="flex items-center justify-between mb-1.5">
          <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide">
            Nomor Induk Kependudukan (NIK)
          </label>
          <span className="text-[11px] font-mono text-slate-400">
            {nik.length}/16
          </span>
        </div>
        <div className="relative">
          <input
            type="text"
            required
            maxLength={16}
            placeholder="16 digit angka KTP Anda"
            value={nik}
            onChange={(e) => onNikChange(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm font-mono tracking-wider focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <div className="absolute right-3 top-3 text-slate-400">
            <Lock className="w-4 h-4" />
          </div>
        </div>

        {/* Preview Masking NIK Otomatis */}
        {nik.length > 4 && (
          <div className="mt-1.5 text-[11px] text-emerald-600 flex items-center gap-1 font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Tersimpan aman sebagai: {maskNik(nik)}</span>
          </div>
        )}
      </div>

      {/* Nomor WhatsApp / HP */}
      <div>
        <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5">
          Nomor WhatsApp / HP Aktif
        </label>
        <div className="relative">
          <input
            type="tel"
            required
            placeholder="Contoh: 081234567890"
            value={phone}
            onChange={(e) => onPhoneChange(e.target.value.replace(/\D/g, ''))}
            className="w-full px-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50/50 text-slate-900 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:bg-white transition-all"
          />
          <div className="absolute right-3 top-3 text-slate-400">
            <Smartphone className="w-4 h-4" />
          </div>
        </div>
        <p className="text-[11px] text-slate-400 mt-1">
          Kode OTP 6-digit akan dikirimkan untuk konfirmasi autentikasi.
        </p>
      </div>

      {/* Jaminan Privasi */}
      <div className="p-3 rounded-2xl bg-blue-50/60 border border-blue-100 flex items-start gap-2.5">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
        <p className="text-[11px] text-blue-800 leading-relaxed">
          <strong>Privasi Dijamin:</strong> NIK Anda dilindungi enkripsi AES-256 dan tidak pernah dipublikasikan di peta publik.
        </p>
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={isLoading}
        className="w-full py-3 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm shadow-md shadow-blue-500/20 active:scale-[0.98] transition-all disabled:opacity-50"
      >
        {isLoading ? 'Memproses Permintaan...' : 'Kirim Kode OTP'}
      </button>
    </form>
  );
}
