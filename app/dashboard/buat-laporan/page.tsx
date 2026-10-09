'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Navbar from '@/components/ui/Navbar';
import Footer from '@/components/ui/Footer';
import CategorySelector from '@/components/buat-laporan/CategorySelector';
import LocationStep from '@/components/buat-laporan/LocationStep';
import ReportDetailsStep from '@/components/buat-laporan/ReportDetailsStep';
import UrgencySelector from '@/components/buat-laporan/UrgencySelector';
import { IssueCategory, UrgencyLevel, Report } from '@/lib/types';
import { 
  ArrowLeft, 
  ArrowRight, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Tag, 
  FileText, 
  Check, 
  Lock, 
  LogIn, 
  UserPlus, 
  AlertCircle,
  X 
} from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';
import { getUserSession, UserSession, AUTH_CHANGE_EVENT } from '@/lib/auth';

export default function BuatLaporanPage() {
  const router = useRouter();
  const { toast } = useToast();

  const [userSession, setUserSession] = useState<UserSession | null>(null);
  const [isCheckingAuth, setIsCheckingAuth] = useState<boolean>(true);

  const [currentStep, setCurrentStep] = useState<number>(1);
  const [category, setCategory] = useState<IssueCategory>('jalan');
  const [customCategory, setCustomCategory] = useState<string>('');
  const [urgency, setUrgency] = useState<UrgencyLevel>('sedang');
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [address, setAddress] = useState<string>('');
  const [village, setVillage] = useState<string>('Lempuing');
  const [district, setDistrict] = useState<string>('Ratu Samban');
  const [isAnonymous, setIsAnonymous] = useState<boolean>(true);
  const [imagePreview, setImagePreview] = useState<string>(
    'https://images.unsplash.com/photo-1515162816999-a0c47dc192f7?auto=format&fit=crop&w=800&q=80'
  );
  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: -3.8000,
    lng: 102.2650,
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSuccess, setIsSuccess] = useState<boolean>(false);

  // Periksa sesi aktif
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const syncSession = () => {
        const session = getUserSession();
        setUserSession(session);
        if (session?.kecamatan) setDistrict(session.kecamatan);
        if (session?.kelurahan) setVillage(session.kelurahan);
        setIsCheckingAuth(false);
      };

      syncSession();

      window.addEventListener(AUTH_CHANGE_EVENT, syncSession);
      window.addEventListener('storage', syncSession);

      return () => {
        window.removeEventListener(AUTH_CHANGE_EVENT, syncSession);
        window.removeEventListener('storage', syncSession);
      };
    }
  }, []);

  // Handle Foto Demo
  const handlePhotoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          setImagePreview(reader.result);
          toast.success('Foto Berhasil Dipilih!', 'Pratinjau gambar bukti diperbarui.');
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
        setAddress(`Titik Koordinat (${coords.lat.toFixed(4)}, ${coords.lng.toFixed(4)})`);
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

    if (!userSession) {
      toast.error('Masuk Diperlukan', 'Anda wajib masuk ke akun warga sebelum mengirim laporan.');
      return;
    }

    if (!title.trim()) {
      toast.error('Judul Laporan Kosong', 'Mohon tulis judul ringkas masalah Anda.');
      return;
    }

    setIsSubmitting(true);

    const trackingNumber = Math.floor(1000 + Math.random() * 9000);
    const trackingCode = `TRC-2026-${trackingNumber}`;

    // Gunakan identitas akun aktif yang terverifikasi
    const citizenAlias = isAnonymous
      ? `Warga #${userSession.id ? userSession.id.slice(-4) : trackingNumber}`
      : userSession.nama;

    const newReport: Report = {
      id: `rep-${Date.now()}`,
      trackingCode,
      title: title || 'Laporan Pengaduan Warga',
      description: description || 'Detail masalah fasilitas publik dilaporkan oleh warga.',
      category,
      customCategory: (category === 'lainnya' || category === 'fasilitas') && customCategory.trim() 
        ? customCategory.trim() 
        : undefined,
      status: 'pending',
      urgency,
      latitude: coords.lat,
      longitude: coords.lng,
      address: address || 'Lokasi Terpetakan GPS Kota Bengkulu',
      village: village || userSession.kelurahan || 'Lempuing',
      district: district || userSession.kecamatan || 'Ratu Samban',
      imageUrl: imagePreview,
      reporterAlias: citizenAlias,
      reporterNikMasked: userSession.nikMasked,
      reporterPhoneMasked: userSession.phoneMasked,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      upvotes: 1,
      timeline: [
        {
          id: `tl-${Date.now()}`,
          date: 'Hari ini, Baru saja',
          status: 'pending',
          title: 'Laporan Diterima Sistem',
          note: `Laporan masuk dari akun warga terverifikasi (${userSession.nikMasked}). Menunggu peninjauan petugas verifikator dinas terkait.`,
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

  // Layar Loading Sesi
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-3 text-slate-500 text-xs font-medium">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
          <span>Memeriksa status akun warga...</span>
        </div>
      </div>
    );
  }

  // PROTEKSI AUTH GATE: JIKA BELUM MASUK KE AKUN WARGA
  if (!userSession) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col antialiased">
        <Navbar />

        <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
          <div className="w-full max-w-md bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl space-y-6 text-center animate-in zoom-in-95 duration-200">
            {/* Icon Gembok & Header */}
            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center mx-auto shadow-xs">
              <Lock className="w-8 h-8 stroke-[1.8]" />
            </div>

            <div className="space-y-2">
              <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                Masuk Diperlukan untuk Melapor
              </h1>
              <p className="text-xs sm:text-sm text-slate-500 leading-relaxed max-w-sm mx-auto">
                Demi menjamin validitas pengaduan di Kota Bengkulu dan mencegah laporan palsu/spam, setiap warga wajib masuk atau mendaftarkan akun terverifikasi NIK sebelum membuat laporan.
              </p>
            </div>

            {/* Banner Keamanan */}
            <div className="p-3.5 rounded-2xl bg-blue-50/70 border border-blue-200/80 text-blue-800 text-xs flex items-center gap-2.5 text-left">
              <ShieldCheck className="w-5 h-5 text-blue-600 shrink-0" />
              <span className="leading-relaxed">
                Identitas NIK Anda dilindungi UU PDP. Anda dapat memilih opsi penyamaran nama pada tampilan peta publik.
              </span>
            </div>

            {/* Tombol Masuk & Daftar */}
            <div className="space-y-3 pt-2">
              <Link
                href="/masuk?redirect=/dashboard/buat-laporan"
                className="w-full min-h-12 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <LogIn className="w-4 h-4" />
                <span>Masuk ke Akun Warga Terdaftar</span>
              </Link>

              <Link
                href="/daftar?redirect=/dashboard/buat-laporan"
                className="w-full min-h-11.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 hover:border-slate-300 font-semibold text-xs sm:text-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <UserPlus className="w-4 h-4 text-slate-500" />
                <span>Daftar Akun Baru (KTP Bengkulu)</span>
              </Link>

              <div className="pt-2">
                <Link
                  href="/"
                  className="inline-block text-xs text-slate-400 hover:text-slate-700 font-medium transition-colors"
                >
                  &larr; Beranda Utama
                </Link>
              </div>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  // TAMPILAN FORMULIR PELAPORAN JIKA SUDAH MASUK
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <Navbar />

      <main className="flex-1 pt-6 pb-28 sm:py-10 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto w-full">
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
        <div className="bg-white rounded-2xl sm:rounded-3xl p-4 sm:p-8 lg:p-10 border border-slate-200/80 shadow-xl shadow-slate-200/40">
          {/* Header Wizard Steps */}
          <div className="border-b border-slate-100 pb-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight">
                  Formulir Pengaduan Fasilitas Publik
                </h1>
                <p className="text-xs sm:text-sm text-slate-500 mt-1">
                  Halo, <strong>{userSession.nama}</strong> ({userSession.nikMasked}). Isi rincian masalah dengan jelas agar dinas terkait dapat merespons cepat.
                </p>
              </div>
            </div>

            {/* Stepper Bar */}
            <div className="grid grid-cols-3 gap-2 sm:gap-4">
              {STEPS.map((s) => {
                const Icon = s.icon;
                const isPassed = currentStep > s.num;
                const isCurrent = currentStep === s.num;

                return (
                  <div
                    key={s.num}
                    className={`flex items-center gap-2 p-2 sm:p-3 rounded-xl border transition-all ${
                      isCurrent
                        ? 'border-blue-600 bg-blue-50/50 text-blue-700'
                        : isPassed
                        ? 'border-emerald-200 bg-emerald-50/40 text-emerald-700'
                        : 'border-slate-100 bg-slate-50/50 text-slate-400'
                    }`}
                  >
                    <div
                      className={`w-6 h-6 rounded-lg flex items-center justify-center text-xs font-bold shrink-0 ${
                        isCurrent
                          ? 'bg-blue-600 text-white'
                          : isPassed
                          ? 'bg-emerald-600 text-white'
                          : 'bg-slate-200 text-slate-500'
                      }`}
                    >
                      {isPassed ? <Check className="w-3.5 h-3.5 stroke-3" /> : s.num}
                    </div>
                    <div className="hidden sm:block min-w-0">
                      <div className="text-xs font-bold truncate">{s.label}</div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Form Content Berdasarkan Step */}
          <form onSubmit={handleSubmit} className="space-y-8">
            {/* LANGKAH 1 */}
            {currentStep === 1 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <CategorySelector
                  selectedCategory={category}
                  onSelectCategory={setCategory}
                  customCategory={customCategory}
                  onCustomCategoryChange={setCustomCategory}
                />

                <div className="pt-4 border-t border-slate-100">
                  <UrgencySelector
                    urgency={urgency}
                    onUrgencyChange={setUrgency}
                  />
                </div>
              </div>
            )}

            {/* LANGKAH 2 */}
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

            {/* LANGKAH 3 */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <ReportDetailsStep
                  title={title}
                  onTitleChange={setTitle}
                  description={description}
                  onDescriptionChange={setDescription}
                  imagePreview={imagePreview}
                  onPhotoUpload={handlePhotoUpload}
                  userSession={userSession}
                  isAnonymous={isAnonymous}
                  onIsAnonymousChange={setIsAnonymous}
                />
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-slate-100">
              {currentStep > 1 ? (
                <button
                  type="button"
                  onClick={handlePrevStep}
                  disabled={isSubmitting || isSuccess}
                  className="px-4 sm:px-6 py-2.5 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 font-semibold text-xs sm:text-sm transition-all flex items-center gap-2 cursor-pointer"
                >
                  <ArrowLeft className="w-4 h-4" />
                  <span>Kembali</span>
                </button>
              ) : (
                <div />
              )}

              {currentStep < 3 ? (
                <button
                  type="button"
                  onClick={handleNextStep}
                  className="px-5 sm:px-8 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 active:scale-98 text-white font-semibold text-xs sm:text-sm shadow-md shadow-blue-500/20 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Lanjutkan</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={isSubmitting || isSuccess}
                  className="px-6 sm:px-9 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-98 text-white font-bold text-xs sm:text-sm shadow-md shadow-emerald-600/20 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-60"
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      <span>Menerbitkan Laporan...</span>
                    </>
                  ) : isSuccess ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Berhasil Dikirim!</span>
                    </>
                  ) : (
                    <>
                      <ShieldCheck className="w-4 h-4" />
                      <span>Kirim Laporan Resmi</span>
                    </>
                  )}
                </button>
              )}
            </div>
          </form>
        </div>
      </main>
      <Footer />
    </div>
  );
}
