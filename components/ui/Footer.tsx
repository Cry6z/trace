import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200/80 pt-16 sm:pt-20 pb-28 md:pb-14 text-slate-600 transition-colors">
      <div className="max-w-7xl mx-auto px-6 sm:px-8 lg:px-12">
        {/* Main Grid Section dengan Garis Pembatas Vertikal Rapi */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-10 md:gap-0 pb-14 border-b border-slate-200/80">
          
          {/* Kolom 1: Identitas & Deskripsi TRACE (5 Cols) */}
          <div className="md:col-span-5 md:pr-10 lg:pr-14 md:border-r md:border-slate-200/80 space-y-3.5">
            <Link href="/" className="inline-flex items-center gap-3 group">
              <div className="w-8.5 h-8.5 rounded-xl bg-slate-950 overflow-hidden flex items-center justify-center shadow-xs border border-slate-800/30 shrink-0 group-hover:scale-105 transition-transform duration-200">
                <Image
                  src="/logo.png"
                  alt="TRACE Logo"
                  width={34}
                  height={34}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="flex flex-col">
                <span className="text-lg font-extrabold tracking-tight text-slate-900 group-hover:text-blue-600 transition-colors">
                  TRACE
                </span>
                <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">
                  Kota Bengkulu
                </span>
              </div>
            </Link>

            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm pt-1">
              Tracking Reports & Aggregating Community Environmental Issues. Platform pemantauan, verifikasi, dan agregasi data pelaporan kerusakan fasilitas publik untuk transparansi penanganan wilayah Kota Bengkulu.
            </p>
          </div>

          {/* Kolom 2: Navigasi Layanan Tanpa Emoji/Icon (3 Cols) */}
          <div className="md:col-span-3 md:px-8 lg:px-12 md:border-r md:border-slate-200/80 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Akses Layanan
            </h4>
            <ul className="space-y-2.5 text-xs sm:text-sm">
              <li>
                <Link
                  href="/peta"
                  className="text-slate-500 hover:text-blue-600 transition-colors block"
                >
                  Peta Publik Interaktif
                </Link>
              </li>
              <li>
                <Link
                  href="/dashboard/buat-laporan"
                  className="text-slate-500 hover:text-blue-600 transition-colors block"
                >
                  Formulir Lapor Masalah
                </Link>
              </li>
              <li>
                <Link
                  href="/#cara-kerja"
                  className="text-slate-500 hover:text-blue-600 transition-colors block"
                >
                  Alur & Mekanisme Pengaduan
                </Link>
              </li>
              <li>
                <Link
                  href="/masuk"
                  className="text-slate-500 hover:text-blue-600 transition-colors block"
                >
                  Portal Masuk Warga
                </Link>
              </li>
            </ul>
          </div>

          {/* Kolom 3: Kredit Resmi PKM-KC Tanpa Badge/Pill (4 Cols) */}
          <div className="md:col-span-4 md:pl-8 lg:pl-12 space-y-3.5">
            <h4 className="text-xs font-bold text-slate-900 uppercase tracking-wider">
              Kredit Pengembangan
            </h4>
            <div className="space-y-2">
              <h5 className="text-sm font-bold text-slate-900 tracking-tight leading-snug">
                Kelompok 11 PKM-KC Informatika Universitas Bengkulu
              </h5>
              <p className="text-xs text-slate-500 leading-relaxed">
                Dikembangkan sebagai inovasi Program Kreativitas Mahasiswa bidang Karsa Cipta (PKM-KC) oleh mahasiswa Jurusan Informatika, Fakultas Teknik, Universitas Bengkulu.
              </p>
            </div>
          </div>

        </div>

        {/* Bottom Bar: Copyright & Garis Halus Bersih */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-400 text-center sm:text-left">
          <p>
            &copy; {new Date().getFullYear()} TRACE Bengkulu. Dikelola oleh Kelompok 11 PKM-KC Informatika Universitas Bengkulu.
          </p>
          <p>
            Privasi Warga Terlindungi (UU PDP No. 27/2022)
          </p>
        </div>
      </div>
    </footer>
  );
}
