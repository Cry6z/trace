import React from 'react';
import { ShieldCheck, Lock, EyeOff, FileCheck } from 'lucide-react';

export default function SecuritySection() {
  return (
    <section id="keamanan-nik" className="py-16 sm:py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="rounded-3xl bg-white border border-slate-200/90 shadow-xs p-8 sm:p-12 lg:p-14">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
          
          {/* Left Column: Context & Legal Assurance */}
          <div className="lg:col-span-7 space-y-6">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-medium">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              <span>Kepatuhan UU Pelindungan Data Pribadi No. 27/2022</span>
            </div>

            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-extrabold tracking-tight text-slate-900 leading-tight">
              Kerahasiaan Identitas Warga Dijamin Sepenuhnya
            </h2>

            <p className="text-sm sm:text-base text-slate-600 leading-relaxed font-normal">
              NIK hanya digunakan oleh sistem untuk memverifikasi keabsahan laporan dan mencegah spam bot. Data sensitif ini tidak pernah ditampilkan kepada publik maupun pihak luar.
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center mb-3">
                  <EyeOff className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 mb-1">Masking Otomatis</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Angka tengah NIK langsung disensor sebelum rekaman disimpan.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center mb-3">
                  <Lock className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 mb-1">Enkripsi Berlapis</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Penyimpanan data terenkripsi dan tidak ada plaintext tersisa.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70">
                <div className="w-8 h-8 rounded-lg bg-blue-100/70 text-blue-700 flex items-center justify-center mb-3">
                  <FileCheck className="w-4 h-4" />
                </div>
                <div className="font-bold text-sm text-slate-900 mb-1">Anonimitas Publik</div>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Pada peta warga hanya berlabel alias aman seperti Warga #4102.
                </p>
              </div>
            </div>
          </div>

          {/* Right Column: Visual Masking Architecture Spec */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-slate-200 bg-slate-50/70 p-6 space-y-5">
              <div className="flex items-center justify-between text-xs pb-3 border-b border-slate-200/70">
                <span className="font-mono font-semibold text-slate-500">Mekanisme Sensor TRACE</span>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/60">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                  Aktif
                </span>
              </div>

              {/* Step 1: Input Level */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                  1. Input Warga Saat Melapor (Privat)
                </div>
                <div className="p-3 rounded-xl bg-white border border-slate-200 text-xs font-mono text-slate-800 flex items-center justify-between">
                  <span>1771020405900001</span>
                  <span className="text-[10px] text-slate-400 font-sans">16 Digit</span>
                </div>
              </div>

              {/* Arrow */}
              <div className="text-center text-slate-300 text-xs font-mono">
                ↓ enkripsi satu arah & masking otomatis ↓
              </div>

              {/* Step 2: Public Level */}
              <div className="space-y-1.5">
                <div className="text-[11px] font-semibold text-blue-600 uppercase tracking-wider">
                  2. Tampilan Publik di Peta & Detail Laporan
                </div>
                <div className="p-3 rounded-xl bg-blue-50/60 border border-blue-200/80 text-xs font-mono text-blue-950 flex items-center justify-between">
                  <span className="font-bold">1771 •••• •••• 0001</span>
                  <span className="text-[10px] bg-blue-100 text-blue-700 font-sans px-1.5 py-0.5 rounded font-medium">
                    Tersensor
                  </span>
                </div>
              </div>

              {/* Public Badge */}
              <div className="pt-2 border-t border-slate-200/70 flex items-center justify-between text-xs text-slate-500">
                <span>Nama di Peta:</span>
                <span className="font-medium text-slate-800 bg-white px-2 py-0.5 rounded border border-slate-200">
                  Warga #4102 (Terverifikasi)
                </span>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

