'use client';

import React, { useState } from 'react';
import { 
  User, 
  ShieldCheck, 
  CreditCard, 
  Phone, 
  MapPin, 
  Lock, 
  KeyRound, 
  CheckCircle2, 
  AlertCircle, 
  Loader2, 
  Eye, 
  EyeOff,
  Building2,
  Calendar,
  Sparkles
} from 'lucide-react';
import { UserSession, updateCitizenProfile, findCitizen } from '@/lib/auth';
import { useToast } from '@/components/ui/ToastProvider';

interface UserProfileViewProps {
  user: UserSession;
  totalReports: number;
}

export default function UserProfileView({ user, totalReports }: UserProfileViewProps) {
  const { toast } = useToast();
  const citizen = user.id ? findCitizen(user.id) : null;

  const [isChangingPin, setIsChangingPin] = useState<boolean>(false);
  const [oldPin, setOldPin] = useState<string>('');
  const [newPin, setNewPin] = useState<string>('');
  const [confirmPin, setConfirmPin] = useState<string>('');
  const [showPin, setShowPin] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [pinError, setPinError] = useState<string>('');
  const [pinSuccess, setPinSuccess] = useState<string>('');

  const handleUpdatePin = (e: React.FormEvent) => {
    e.preventDefault();
    setPinError('');
    setPinSuccess('');

    const cleanOld = oldPin.replace(/\D/g, '');
    const cleanNew = newPin.replace(/\D/g, '');
    const cleanConfirm = confirmPin.replace(/\D/g, '');

    if (cleanNew.length !== 6) {
      setPinError('PIN baru harus berjumlah tepat 6 digit angka.');
      return;
    }

    if (cleanNew !== cleanConfirm) {
      setPinError('Konfirmasi PIN baru tidak cocok.');
      return;
    }

    if (citizen && citizen.pin !== cleanOld) {
      setPinError('PIN lama yang Anda masukkan salah.');
      return;
    }

    setIsLoading(true);

    setTimeout(() => {
      if (user.id) {
        const ok = updateCitizenProfile(user.id, { pin: cleanNew });
        setIsLoading(false);
        if (ok) {
          setPinSuccess('PIN keamanan berhasil diperbarui!');
          toast.success('PIN Berhasil Diperbarui', 'Gunakan PIN baru ini saat masuk berikutnya.');
          setOldPin('');
          setNewPin('');
          setConfirmPin('');
          setTimeout(() => {
            setIsChangingPin(false);
            setPinSuccess('');
          }, 1500);
        } else {
          setPinError('Gagal memperbarui PIN di sistem.');
        }
      } else {
        setIsLoading(false);
        setPinSuccess('PIN berhasil diperbarui.');
        setIsChangingPin(false);
      }
    }, 500);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-200">
      {/* 1. KARTU DIGITAL WARGA BENGKULU (KTP DIGITAL STYLE) */}
      <div className="relative overflow-hidden rounded-3xl bg-linear-to-br from-slate-900 via-blue-950 to-slate-900 text-white p-6 sm:p-8 lg:p-10 shadow-2xl border border-blue-500/20">
        {/* Glow Ambient Effect */}
        <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500/15 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-indigo-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header Card */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center font-black text-blue-400 text-base shadow-inner">
                T
              </div>
              <div>
                <div className="text-xs font-bold uppercase tracking-wider text-blue-300">
                  Pemerintah Kota Bengkulu
                </div>
                <div className="text-sm font-extrabold tracking-tight text-white">
                  Identitas Digital Warga Terverifikasi TRACE
                </div>
              </div>
            </div>

            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-xs font-bold backdrop-blur-md">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>Terverifikasi e-KTP & NIK</span>
            </div>
          </div>

          {/* Body KTP Digital */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Avatar & Nama */}
            <div className="flex items-center gap-4 md:col-span-2">
              <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-linear-to-tr from-blue-600 to-indigo-500 text-white flex items-center justify-center font-black text-2xl sm:text-3xl shadow-lg ring-4 ring-white/10 shrink-0">
                {user.nama ? user.nama.charAt(0).toUpperCase() : 'W'}
              </div>
              <div className="space-y-1 min-w-0">
                <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight truncate">
                  {user.nama}
                </h2>
                <div className="font-mono text-xs sm:text-sm text-blue-200 tracking-wider">
                  NIK: <strong className="text-white">{user.nikMasked}</strong>
                </div>
                <div className="flex flex-wrap items-center gap-3 text-xs text-slate-300 pt-1">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400 shrink-0" />
                    <span>
                      Kec. {user.kecamatan || 'Ratu Samban'}, Kel. {user.kelurahan || 'Lempuing'}
                    </span>
                  </span>
                </div>
              </div>
            </div>

            {/* Statistik Partisipasi Warga */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md space-y-1 text-center md:text-right">
              <span className="text-[11px] uppercase tracking-wider text-slate-400 font-bold">
                Kontribusi Pengaduan
              </span>
              <div className="text-2xl font-black text-white">
                {totalReports} Laporan
              </div>
              <div className="text-[10px] text-emerald-400 font-medium">
                Aktif Mengawal Fasilitas Publik
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. RINCIAN AKUN & PENGATURAN KEAMANAN */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom Kiri & Tengah: Rincian Data Kependudukan */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xs space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4">
              <h3 className="text-base font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                <span>Rincian Akun Terdaftar</span>
              </h3>
              <span className="text-xs text-slate-400">
                Terhubung ke basis data kependudukan
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nama Lengkap (KTP)
                </span>
                <div className="font-bold text-slate-800 text-sm">{user.nama}</div>
                <div className="text-[10px] text-emerald-600 flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>Sesuai Identitas Resmi</span>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nomor Induk Kependudukan (NIK)
                </span>
                <div className="font-mono font-bold text-slate-800 text-sm">{user.nikMasked}</div>
                <div className="text-[10px] text-slate-500">Disamarkan demi privasi (UU PDP)</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Nomor WhatsApp Terhubung
                </span>
                <div className="font-mono font-bold text-slate-800 text-sm">{user.phoneMasked}</div>
                <div className="text-[10px] text-slate-500">Notifikasi status penanganan aduan</div>
              </div>

              <div className="p-4 rounded-2xl bg-slate-50 border border-slate-200/70 space-y-1">
                <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
                  Domisili Kota Bengkulu
                </span>
                <div className="font-bold text-slate-800 text-sm">
                  {user.kecamatan ? `Kec. ${user.kecamatan}` : 'Kota Bengkulu'}
                </div>
                <div className="text-[10px] text-slate-500">
                  Kelurahan: {user.kelurahan || 'Lempuing'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Pengaturan Keamanan PIN */}
        <div className="space-y-6">
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-slate-200/80 shadow-xs space-y-4">
            <div className="flex items-center gap-2 text-slate-900 font-extrabold text-base">
              <KeyRound className="w-4 h-4 text-blue-600" />
              <span>Keamanan PIN Akun</span>
            </div>

            <p className="text-xs text-slate-500 leading-relaxed">
              PIN 6 digit digunakan untuk masuk secara instan ke sistem TRACE tanpa menunggu SMS/WhatsApp OTP.
            </p>

            {!isChangingPin ? (
              <button
                type="button"
                onClick={() => setIsChangingPin(true)}
                className="w-full py-2.5 px-4 rounded-xl border border-blue-200 bg-blue-50/80 hover:bg-blue-100 text-blue-700 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <Lock className="w-3.5 h-3.5" />
                <span>Ubah PIN Keamanan 6 Digit</span>
              </button>
            ) : (
              <form onSubmit={handleUpdatePin} className="space-y-3 pt-2">
                {pinError && (
                  <div className="p-2.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs flex items-center gap-2">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    <span>{pinError}</span>
                  </div>
                )}

                {pinSuccess && (
                  <div className="p-2.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-emerald-600" />
                    <span>{pinSuccess}</span>
                  </div>
                )}

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">
                    PIN Lama (6 Digit)
                  </label>
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={oldPin}
                    onChange={(e) => setOldPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Contoh: 123456"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">
                    PIN Baru (6 Digit)
                  </label>
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={newPin}
                    onChange={(e) => setNewPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="6 angka rahasia"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-[11px] font-bold text-slate-600">
                    Konfirmasi PIN Baru
                  </label>
                  <input
                    type={showPin ? 'text' : 'password'}
                    required
                    maxLength={6}
                    value={confirmPin}
                    onChange={(e) => setConfirmPin(e.target.value.replace(/\D/g, ''))}
                    placeholder="Ulangi 6 angka"
                    className="w-full px-3 py-2 rounded-xl border border-slate-200 font-mono text-xs text-slate-900 focus:outline-none focus:border-blue-600"
                  />
                </div>

                <div className="flex items-center justify-between pt-1">
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="text-[10px] text-blue-600 font-semibold"
                  >
                    {showPin ? 'Sembunyikan Angka' : 'Tampilkan Angka'}
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setIsChangingPin(false)}
                      className="px-3 py-1.5 rounded-lg border border-slate-200 text-xs text-slate-600 hover:bg-slate-50 cursor-pointer"
                    >
                      Batal
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs cursor-pointer disabled:opacity-50"
                    >
                      {isLoading ? 'Menyimpan...' : 'Simpan'}
                    </button>
                  </div>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
