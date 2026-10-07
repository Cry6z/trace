import { Metadata } from 'next';
import { Suspense } from 'react';
import AuthContainer from '@/components/auth/AuthContainer';

export const metadata: Metadata = {
  title: 'Daftar Akun Warga | TRACE Bengkulu',
  description: 'Daftarkan identitas akun warga Kota Bengkulu untuk mengajukan dan mengawal laporan perbaikan fasilitas publik.',
};

export default function DaftarPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-slate-50 flex items-center justify-center">
          <div className="w-8 h-8 rounded-full border-2 border-blue-600 border-t-transparent animate-spin" />
        </div>
      }
    >
      <AuthContainer initialTab="daftar" />
    </Suspense>
  );
}
