'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import CategorySelector from '@/components/buat-laporan/CategorySelector';
import LocationStep from '@/components/buat-laporan/LocationStep';
import ReportDetailsStep from '@/components/buat-laporan/ReportDetailsStep';
import UrgencySelector from '@/components/buat-laporan/UrgencySelector';
import { IssueCategory, UrgencyLevel, Report } from '@/lib/types';
import { ArrowLeft, ArrowRight, ShieldCheck, CheckCircle2, MapPin, Tag, FileText, Check } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

export default function BuatLaporanPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [category, setCategory] = useState<IssueCategory>('jalan');
  const [urgency, setUrgency] = useState<UrgencyLevel>('sedang');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [village, setVillage] = useState<string>('');
  const [district, setDistrict] = useState<string>('');
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: -3.8000,
    lng: 102.2650,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Handle Foto Demo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          toast.success('Foto Berhasil Dipilih!', 'Pratinjau gambar diperbarui.');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleNextStep = () => {
    if (currentStep === 1) {
      setCurrentStep(2);
    } else if (currentStep === 2) {
      if (!address.trim()) {
        toast.error('Alamat Belum Diisi', 'Mohon isi detail alamat atau gunakan tombol GPS.');
        return;
      }
      setCurrentStep(3);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      toast.error('Judul Laporan Kosong', 'Mohon tulis judul ringkas masalah Anda.');
      return;
    }

    setIsSubmitting(true);

    const trackingNumber = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `TRC-2026-${trackingNumber}`;

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      trackingCode,
      title: title || 'Laporan Pengaduan Warga',
      description: description || 'Detail masalah fasilitas publik dilaporkan oleh warga.',
      category,
      status: 'pending',
      urgency,
      latitude: coords.lat,
      longitude: coords.lng,
      address: address || 'Lokasi Terpetakan GPS',
      village: village || 'Lempuing',
      district: district || 'Ratu Agung',
      imageUrl: imagePreview,
      reporterAlias: 'Warga #3921 (Anda)',
      reporterNikMasked: '3174**********03',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 1,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: 'Hari ini, Baru saja',
          status: 'pending',
          title: 'Laporan Diterima Sistem',
          note: 'Laporan Anda telah berhasil masuk dan langsung tampil di Peta Komunitas publik.',
          actor: 'Sistem TRACE',
        },
      ],
    };

    // Simpan ke local storage agar terbaca di dashboard
    setTimeout(() => {
      if (typeof window !== 'undefined') {
        const stored = localStorage.getItem('trace_user_reports');
        const list = stored ? JSON.parse(stored) : [];
        list.unshift(newReport);
        localStorage.setItem('trace_user_reports', JSON.stringify(list));
      }

      setIsSubmitting(false);
      setIsSuccess(true);
      toast.success('Laporan Berhasil Diterbitkan', `Kode Pelacakan Anda: ${trackingCode}`);

      setTimeout(() => {
        router.push('/dashboard');
      }, 1600);
    }, 700);
  };

  const STEPS = [
    { num: 1, label: 'Kategori & Urgensi', icon: Tag },
    { num: 2, label: 'Titik Lokasi GPS', icon: MapPin },
    { num: 3, label: 'Foto & Rincian', icon: FileText },
  ];

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 py-8 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
        {/* Navigasi Balik */}
        <div className="mb-6 flex items-center justify-between">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-500 hover:text-blue-600 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali ke Dashboard Warga</span>
          </Link>

          <span className="text-xs text-slate-400 font-medium">
            Langkah {currentStep} dari 3
          </span>
        </div>

        {/* Card Form */}
        <div className="bg-white rounded-3xl p-6 sm:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40">
          {/* Header */}
          <div className="mb-6 space-y-1">
            <span className="text-xs font-bold uppercase tracking-wider text-blue-600">
              Formulir Pengaduan Masyarakat
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight">
              Laporkan Masalah Lingkungan / Fasilitas
            </h1>
            <p className="text-xs sm:text-sm text-slate-500">
              Laporan Anda akan diverifikasi oleh dinas terkait dan langsung dipetakan pada peta komunitas TRACE.
            </p>
          </div>

          {/* Stepper Progress Bar */}
          <div className="mb-8 p-3 rounded-2xl bg-slate-50 border border-slate-100">
            <div className="grid grid-cols-3 gap-2">
              {STEPS.map((s) => {
                const isCurrent = currentStep === s.num;
                const isPast = currentStep > s.num;
                const Icon = s.icon;

                return (
                  <button
                    key={s.num}
                    type="button"
                    onClick={() => {
                      if (isPast) setCurrentStep(s.num);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-xl text-left transition-all ${
                      isCurrent
                        ? 'bg-blue-600 text-white shadow-xs'
                        : isPast
                        ? 'bg-blue-50 text-blue-700 cursor-pointer hover:bg-blue-100'
                        : 'text-slate-400 opacity-70 cursor-not-allowed'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-white/20 text-white'
                          : isPast
                          ? 'bg-blue-200/80 text-blue-800'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPast ? <Check className="w-3.5 h-3.5" /> : s.num}
                    </div>
                    <div className="min-w-0 hidden sm:block">
                      <div className="text-[10px] uppercase font-bold opacity-80 leading-none">
                        Tahap {s.num}
                      </div>
                      <div className="text-xs font-semibold truncate leading-tight mt-0.5">
                        {s.label}
                      </div>
                    </div>
                    <Icon className="w-4 h-4 ml-auto shrink-0 opacity-70 hidden md:block" />
                  </button>
                );
              })}
            </div>
          </div>

          {isSuccess && (
            <div className="mb-6 p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-sm flex items-center gap-3 animate-in fade-in duration-200">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
              <div>
                <p className="font-bold">Laporan Berhasil Diajukan!</p>
                <p className="text-xs">Mengalihkan ke dashboard Anda untuk memantau progres penanganan...</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* TAHAP 1: Kategori & Tingkat Urgensi */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <CategorySelector
                  selectedCategory={category}
                  onSelectCategory={setCategory}
                />

                <div className="pt-2 border-t border-slate-100">
                  <UrgencySelector
                    urgency={urgency}
                    onUrgencyChange={setUrgency}
                  />
                </div>
              </div>
            )}

            {/* TAHAP 2: Titik Lokasi Peta GPS */}
            {currentStep === 2 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <LocationStep
                  lat={coords.lat}
                  lng={coords.lng}
                  onLocationChange={(lat, lng) => setCoords({ lat, lng })}
                  address={address}
                  onAddressChange={setAddress}
                  village={village}
                  onVillageChange={setVillage}
                  district={district}
                  onDistrictChange={setDistrict}
                />
              </div>
            )}

            {/* TAHAP 3: Judul, Rincian, & Foto Bukti */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ReportDetailsStep
                  title={title}
                  onTitleChange={setTitle}
                  description={description}
                  onDescriptionChange={setDescription}
                  imagePreview={imagePreview}
                  onPhotoUpload={handlePhotoUpload}
                />

                {/* Privasi Reminder */}
                <div className="p-3.5 rounded-2xl bg-emerald-50/60 border border-emerald-100 flex items-center gap-3 text-xs text-emerald-800">
                  <ShieldCheck className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>
                    Identitas NIK Anda terlindungi secara kriptografis (UU PDP No. 27/2022) dan tidak akan pernah ditampilkan ke khalayak umum.
                  </span>
                </div>
              </div>
            )}

            {/* Tombol Navigasi Wizard */}
            <div className="pt-4 border-t border-slate-100 flex items-center justify-between">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-700 text-xs font-bold hover:bg-slate-100 transition-colors flex items-center gap-1.5"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Langkah Sebelumnya</span>
                </button>
              ) : (
                <Link
                  href="/dashboard"
                  className="px-5 py-2.5 rounded-xl border border-slate-200 text-slate-600 text-xs font-bold hover:bg-slate-100 transition-colors"
                >
                  Batal
                </Link>
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all flex items-center gap-1.5"
                >
                  <span>
                    {currentStep === 1 ? 'Lanjut ke Lokasi GPS' : 'Lanjut ke Foto & Rincian'}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-7 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-md shadow-blue-500/20 active:scale-95 transition-all disabled:opacity-50 flex items-center gap-1.5"
                >
                  <span>{isSubmitting ? 'Mengirimkan...' : 'Kirim Laporan Sekarang'}</span>
                  <CheckCircle2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
    </div>
  );
}
