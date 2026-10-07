import React from 'react';
import { Camera, ShieldCheck, EyeOff, UserCheck } from 'lucide-react';
import { UserSession } from '@/lib/auth';

interface ReportDetailsStepProps {
  title: string;
  onTitleChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  imagePreview: string;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
  userSession?: UserSession | null;
  isAnonymous?: boolean;
  onIsAnonymousChange?: (val: boolean) => void;
}

export default function ReportDetailsStep({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  imagePreview,
  onPhotoUpload,
  userSession,
  isAnonymous = true,
  onIsAnonymousChange,
}: ReportDetailsStepProps) {
  return (
    <div className="space-y-5">
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
        3. Rincian Laporan & Identitas Pelapor
      </label>

      {/* Informasi Identitas Akun Pelapor */}
      {userSession && (
        <div className="p-4 rounded-2xl bg-blue-50/70 border border-blue-200/80 space-y-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              <span className="text-xs font-bold text-slate-900">
                Akun Pelapor Terverifikasi
              </span>
            </div>
            <span className="text-[10px] font-semibold bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              Terikat Akun NIK
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1.5 text-slate-700">
              <UserCheck className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <span className="font-semibold truncate">{userSession.nama}</span>
            </div>
            <div className="text-slate-500 font-mono">
              NIK: <span className="font-bold text-slate-700">{userSession.nikMasked}</span>
            </div>
          </div>

          {/* Pengaturan Privasi Publik */}
          {onIsAnonymousChange && (
            <div className="pt-2 border-t border-blue-200/60">
              <label className="flex items-start gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => onIsAnonymousChange(e.target.checked)}
                  className="mt-0.5 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
                />
                <div className="space-y-0.5">
                  <div className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
                    <EyeOff className="w-3.5 h-3.5 text-slate-500" />
                    <span>Samarkan Nama Saya di Peta Publik</span>
                  </div>
                  <p className="text-[11px] text-slate-500 leading-snug">
                    {isAnonymous
                      ? 'Nama Anda akan tampil sebagai "Warga #XXXX" di publik. Dinas verifikator tetap dapat memverifikasi aduan secara internal.'
                      : `Nama lengkap Anda ("${userSession.nama}") akan ditampilkan secara terbuka pada kartu laporan publik.`}
                  </p>
                </div>
              </label>
            </div>
          )}
        </div>
      )}

      {/* Judul Singkat */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Judul Singkat Laporan <span className="text-rose-500">*</span>
        </label>
        <input
          type="text"
          required
          placeholder="Contoh: Lubang Aspal Dalam Menganga Membahayakan Pengendara"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none transition-all"
        />
      </div>

      {/* Deskripsi Lengkap */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Deskripsi Lengkap Masalah <span className="text-rose-500">*</span>
        </label>
        <textarea
          required
          rows={3}
          placeholder="Jelaskan kondisi masalah, dampak terhadap warga sekitar, dan sudah berapa lama terjadi..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-xs sm:text-sm text-slate-900 placeholder:text-slate-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-600 outline-none resize-none transition-all"
        />
      </div>

      {/* Upload Foto */}
      <div className="space-y-1.5">
        <label className="block text-xs font-bold text-slate-700">
          Foto Bukti Kerusakan / Kejadian
        </label>
        <div className="flex flex-col sm:flex-row items-center gap-4">
          <div className="w-full sm:w-48 h-32 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shrink-0">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={imagePreview}
              alt="Preview Masalah"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="flex-1 w-full">
            <label className="cursor-pointer border-2 border-dashed border-slate-200 hover:border-blue-400 p-4 rounded-2xl flex flex-col items-center justify-center gap-1 transition-colors text-center bg-slate-50/50">
              <Camera className="w-6 h-6 text-slate-400" />
              <span className="text-xs font-semibold text-blue-600">
                Klik untuk unggah foto dari ponsel / galeri
              </span>
              <span className="text-[10px] text-slate-400">
                Format JPG, PNG (Maks 10 MB)
              </span>
              <input
                type="file"
                accept="image/*"
                onChange={onPhotoUpload}
                className="hidden"
              />
            </label>
          </div>
        </div>
      </div>
    </div>
  );
}
