'use client';

import React, { useState } from 'react';
import LocationPicker from '@/components/map/LocationPicker';
import { LocateFixed, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface LocationStepProps {
  lat: number;
  lng: number;
  onLocationChange: (lat: number, lng: number) => void;
  address: string;
  onAddressChange: (val: string) => void;
  village: string;
  onVillageChange: (val: string) => void;
  district: string;
  onDistrictChange: (val: string) => void;
}

export default function LocationStep({
  lat,
  lng,
  onLocationChange,
  address,
  onAddressChange,
  village,
  onVillageChange,
  district,
  onDistrictChange,
}: LocationStepProps) {
  const { toast } = useToast();
  const [isLocating, setIsLocating] = useState(false);

  const handleQuickLocate = () => {
    if (!navigator.geolocation) {
      toast.error('Perangkat tidak mendukung GPS');
      return;
    }

    setIsLocating(true);
    toast.info('Mendeteksi titik koordinat Anda...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        onLocationChange(latitude, longitude);
        if (!village) onVillageChange('Lempuing');
        if (!district) onDistrictChange('Ratu Agung');
        if (!address) onAddressChange('Lokasi Terdeteksi GPS');
        toast.success('Lokasi GPS Terpasang!', 'Titik peta diperbarui ke koordinat Anda.');
      },
      () => {
        setIsLocating(false);
        toast.error('Gagal mengakses GPS', 'Silakan geser pin manual pada peta.');
      },
      { timeout: 8000, enableHighAccuracy: true }
    );
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
          Titik Lokasi Masalah
        </label>

        <button
          type="button"
          onClick={handleQuickLocate}
          disabled={isLocating}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-semibold border border-blue-200 transition-colors active:scale-95 disabled:opacity-50"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5 text-blue-600" />
          )}
          <span>Gunakan Lokasi GPS Saya</span>
        </button>
      </div>

      <LocationPicker
        initialLat={lat}
        initialLng={lng}
        onLocationChange={onLocationChange}
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2">
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Detail Alamat / Patokan Jalan
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Jl. Danau Dendang Tak Sudah"
            value={address}
            onChange={(e) => onAddressChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Kelurahan / Desa
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Lempuing"
            value={village}
            onChange={(e) => onVillageChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
        <div>
          <label className="block text-[11px] font-semibold text-slate-600 mb-1">
            Kecamatan / Kota
          </label>
          <input
            type="text"
            required
            placeholder="Contoh: Ratu Agung"
            value={district}
            onChange={(e) => onDistrictChange(e.target.value)}
            className="w-full px-3.5 py-2 rounded-xl border border-slate-200 text-xs focus:ring-2 focus:ring-blue-500 outline-none"
          />
        </div>
      </div>
    </div>
  );
}
