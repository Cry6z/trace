import React from 'react';
import { Camera, ShieldCheck, Building2, CheckCircle2 } from 'lucide-react';

const STEPS = [
  {
    number: '01',
    icon: Camera,
    title: 'Tandai Lokasi & Ambil Foto',
    description:
      'Pilih kategori isu dan tentukan titik jalan atau fasilitas di peta. Unggah foto langsung dari ponsel Anda.',
    highlight: 'GPS Otomatis',
  },
  {
    number: '02',
    icon: ShieldCheck,
    title: 'Verifikasi Cepat & Validasi Laporan',
    description:
      'Sistem memvalidasi keabsahan data pengaduan dan mencegah laporan spam secara otomatis.',
    highlight: 'Resmi & Valid',
  },
  {
    number: '03',
    icon: Building2,
    title: 'Disposisi ke Instansi Terkait',
    description:
      'Laporan disalurkan ke petugas dinas teknis (PUPR, Dishub, atau LH) sesuai wewenang dan wilayah kerja.',
    highlight: 'Langsung ke Petugas',
  },
  {
    number: '04',
    icon: CheckCircle2,
    title: 'Pantau Progres & Foto Tuntas',
    description:
      'Ikuti pembaruan status pengerjaan secara transparan hingga petugas melampirkan foto hasil perbaikan.',
    highlight: 'Bukti Nyata',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="cara-kerja" className="bg-white py-12 sm:py-16 lg:py-20 border-t border-slate-200/70">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Heading */}
        <div className="max-w-2xl mb-10 sm:mb-12 lg:mb-16">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-blue-600 uppercase tracking-wider mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600 inline-block" />
            <span>Alur Pelaporan Warga</span>
          </div>
          <h2 className="text-xl sm:text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight">
            Transparan dari Titik Lapor hingga Tuntas
          </h2>
          <p className="mt-2 text-xs sm:text-sm md:text-base text-slate-500 leading-relaxed">
            Tidak ada birokrasi berbelit. Setiap laporan memiliki kode lacak unik yang bisa dipantau siapa saja tanpa perlu masuk akun.
          </p>
        </div>

        {/* Multi-step Responsive Editorial Flow: 1-col mobile, 2-col tablet, 4-col desktop */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8 relative">
          {STEPS.map((step, idx) => {
            const Icon = step.icon;
            return (
              <div
                key={step.number}
                className="group relative flex flex-col justify-between pt-4 border-t-2 border-slate-100 hover:border-blue-500 transition-all duration-300"
              >
                <div>
                  {/* Step Header: Number & Tag */}
                  <div className="flex items-center justify-between mb-4">
                    <span className="font-mono text-2xl font-bold text-slate-300 group-hover:text-blue-600 transition-all duration-200 group-hover:scale-105 inline-block">
                      {step.number}
                    </span>
                    <span className="text-[11px] font-medium text-slate-500 bg-slate-50 border border-slate-200/80 px-2 py-0.5 rounded-full group-hover:border-blue-200 group-hover:text-blue-700 transition-colors duration-200">
                      {step.highlight}
                    </span>
                  </div>

                  {/* Icon & Title */}
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white group-hover:scale-110 transition-all duration-200 shadow-2xs">
                      <Icon className="w-4 h-4" />
                    </div>
                    <h3 className="font-bold text-base text-slate-900 group-hover:text-blue-950 transition-colors leading-snug">
                      {step.title}
                    </h3>
                  </div>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                    {step.description}
                  </p>
                </div>

                {/* Subdued Bottom Indicator */}
                <div className="mt-6 pt-3 border-t border-slate-100 flex items-center text-[11px] text-slate-400 font-mono">
                  <span>Tahap {idx + 1} dari 4</span>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </section>
  );
}

