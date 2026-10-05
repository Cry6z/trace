import React from 'react';
import { Camera } from 'lucide-react';

interface ReportDetailsStepProps {
  title: string;
  onTitleChange: (val: string) => void;
  description: string;
  onDescriptionChange: (val: string) => void;
  imagePreview: string;
  onPhotoUpload: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

export default function ReportDetailsStep({
  title,
  onTitleChange,
  description,
  onDescriptionChange,
  imagePreview,
  onPhotoUpload,
}: ReportDetailsStepProps) {
  return (
    <div className="space-y-4">
      <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
        3. Judul, Rincian, & Foto Bukti
      </label>

      {/* Judul Singkat */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Judul Singkat Laporan
        </label>
        <input
          type="text"
          required
          placeholder="Contoh: Lubang Aspal Dalam Menganga Membahayakan Pengendara"
          value={title}
          onChange={(e) => onTitleChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none"
        />
      </div>

      {/* Deskripsi Lengkap */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-1">
          Deskripsi Lengkap Masalah
        </label>
        <textarea
          required
          rows={3}
          placeholder="Jelaskan kondisi masalah, dampak terhadap warga sekitar, dan sudah berapa lama terjadi..."
          value={description}
          onChange={(e) => onDescriptionChange(e.target.value)}
          className="w-full px-4 py-2.5 rounded-xl border border-slate-200 text-sm focus:ring-2 focus:ring-blue-500 outline-none resize-none"
        />
      </div>

      {/* Upload Foto */}
      <div>
        <label className="block text-[11px] font-semibold text-slate-600 mb-2">
          Foto Bukti Kejadian / Kerusakan
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
