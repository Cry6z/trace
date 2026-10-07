'use client';

import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileText, CheckCircle2, AlertCircle } from 'lucide-react';

interface UserPrivacyViewProps {
  nama: string;
  nikMasked: string;
  phoneMasked: string;
  nikHash?: string;
}

export default function UserPrivacyView({
  nama,
  nikMasked,
  phoneMasked,
  nikHash,
}: UserPrivacyViewProps) {
  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. Header Banner Privasi */}
      <div className="bg-white rounded-3xl p-6 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xs space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-bold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sertifikasi Pelindungan Data Pribadi (UU PDP No. 27/2022)</span>
        </div>

        <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
          Bagaimana TRACE Melindungi Identitas NIK Anda?
        </h2>

        <p className="text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
          Nomor Induk Kependudukan (NIK) adalah data pribadi spesifik yang wajib dilindungi. Sistem TRACE dirancang dengan prinsip <em>Privacy-by-Design</em> untuk memastikan pelaporan fasilitas publik dapat dipertanggungjawabkan tanpa pernah mengekspos identitas asli Anda ke publik.
        </p>

        {/* Status Kredensial Saat Ini */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-4 border-t border-slate-100">
          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nama Terdaftar</span>
            <div className="font-bold text-slate-800 text-sm">{nama}</div>
            <div className="text-[10px] text-emerald-600 flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" />
              <span>Terverifikasi NIK</span>
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Tampilan NIK di Sistem</span>
            <div className="font-mono font-bold text-slate-800 text-sm">{nikMasked}</div>
            <div className="text-[10px] text-slate-500">10 digit tengah disensor otomatis</div>
          </div>

          <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
            <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">Nomor WhatsApp / HP</span>
            <div className="font-mono font-bold text-slate-800 text-sm">{phoneMasked}</div>
            <div className="text-[10px] text-slate-500">Hanya untuk pengiriman OTP</div>
          </div>
        </div>
      </div>

      {/* 2. Tiga Pilar Keamanan Kriptografi */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Pilar 1 */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center">
            <EyeOff className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Anonimitas di Peta Publik
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Pada peta komunitas publik, nama dan NIK Anda disamarkan menjadi alias unik (contoh: <em>Warga #3921</em>). Warga lain dan pengunjung publik tidak dapat melihat siapa pelapor sebenarnya.
          </p>
        </div>

        {/* Pilar 2 */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
            <Lock className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            Enkripsi AES-256 GCM
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Penyimpanan data sensitif dilindungi menggunakan algoritma enkripsi standar militer AES-256-GCM dengan kunci acak terotentikasi (*Auth Tag*). Data mentah tidak pernah disimpan polos (*plaintext*).
          </p>
        </div>

        {/* Pilar 3 */}
        <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-purple-50 text-purple-600 flex items-center justify-center">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-base font-bold text-slate-900">
            One-Way HMAC Hash
          </h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Untuk mencegah laporan palsu berulang, sistem menggunakan sidik jari kriptografi *HMAC-SHA256* ber-pepper. Sistem dapat mengenali pelapor tanpa harus mendekripsi atau menyimpan NIK asli.
          </p>
        </div>
      </div>

      {/* 3. Detail Kriptografi Sesi Saat Ini */}
      {nikHash && (
        <div className="bg-slate-900 text-slate-300 rounded-3xl p-6 sm:p-8 space-y-3 shadow-xl">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
              Identifier Hash Sesi Anda (SHA-256)
            </span>
            <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-800">
              Kriptografis Aman
            </span>
          </div>
          <div className="font-mono text-xs text-slate-200 bg-slate-950 p-4 rounded-2xl border border-slate-800 break-all select-all">
            {nikHash}
          </div>
          <p className="text-[11px] text-slate-400 leading-relaxed">
            Hash ini digunakan server untuk memvalidasi bahwa laporan benar-benar berasal dari warga terverifikasi yang sah tanpa membongkar angka NIK asli Anda.
          </p>
        </div>
      )}
    </div>
  );
}
