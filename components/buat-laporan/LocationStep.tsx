'use client';

import React, { useState, useEffect, useRef } from 'react';
import LocationPicker from '@/components/map/LocationPicker';
import { MapPin, Loader2, Sparkles } from 'lucide-react';

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
  const [isResolving, setIsResolving] = useState<boolean>(false);
  const prevCoordsRef = useRef<{ lat: number; lng: number } | null>(null);

  // Otomatis deteksi alamat dari koordinat peta (Reverse Geocoding OSM Nominatim via Internal API)
  useEffect(() => {
    // Hindari request duplikat jika pergeseran koordinat sangat kecil
    if (
      prevCoordsRef.current &&
      Math.abs(prevCoordsRef.current.lat - lat) < 0.00005 &&
      Math.abs(prevCoordsRef.current.lng - lng) < 0.00005
    ) {
      return;
    }

    prevCoordsRef.current = { lat, lng };

    let isCancelled = false;
    const fetchAddressFromMap = async () => {
      setIsResolving(true);
      try {
        const res = await fetch(`/api/geocode/reverse?lat=${lat}&lng=${lng}`);
        if (!res.ok) throw new Error('Gagal mengambil alamat');
        const data = await res.json();

        if (isCancelled) return;

        if (data.success && data.address) {
          onAddressChange(data.address);
          if (data.village) onVillageChange(data.village);
          if (data.district) onDistrictChange(data.district);
        } else {
          onAddressChange(data.address || `Titik Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      } catch {
        if (!isCancelled) {
          onAddressChange(`Titik Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`);
        }
      } finally {
        if (!isCancelled) {
          setIsResolving(false);
        }
      }
    };

    fetchAddressFromMap();

    return () => {
      isCancelled = true;
    };
  }, [lat, lng, onAddressChange, onVillageChange, onDistrictChange]);

  return (
    <div className="space-y-4">
      {/* Header Langkah */}
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold uppercase tracking-wide text-slate-700">
          2. Titik Lokasi Masalah
        </label>
        <span className="text-[11px] font-semibold text-blue-600 flex items-center gap-1">
          <Sparkles className="w-3 h-3" />
          <span>Deteksi Alamat Otomatis</span>
        </span>
      </div>

      {/* Komponen Peta Interaktif Leaflet */}
      <LocationPicker
        initialLat={lat}
        initialLng={lng}
        onLocationChange={onLocationChange}
      />

      {/* Kartu Informasi Alamat Otomatis (Tanpa Perlu Ketik Manual) */}
      <div className="p-4 rounded-2xl bg-linear-to-br from-blue-50/70 via-white to-slate-50 border border-blue-100 shadow-xs space-y-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-8 h-8 rounded-xl bg-blue-600 text-white flex items-center justify-center shrink-0 shadow-xs">
              <MapPin className="w-4 h-4" />
            </div>
            <div className="min-w-0">
              <div className="text-xs font-bold text-slate-900 flex items-center gap-1.5 truncate">
                <span>Alamat Terdeteksi Otomatis</span>
                {isResolving && <Loader2 className="w-3 h-3 text-blue-600 animate-spin shrink-0" />}
              </div>
              <div className="text-[11px] text-slate-500 truncate">
                Tersinkronisasi langsung dari titik pin / GPS peta
              </div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 shrink-0">
            ✓ Otomatis dari Peta
          </span>
        </div>

        {/* Alamat Utama / Nama Jalan */}
        <div className="p-3.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
          <div className="text-[10px] font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Alamat / Patokan Wilayah
          </div>
          <div className="text-sm font-bold text-slate-900 leading-snug">
            {isResolving ? (
              <span className="text-slate-400 italic font-normal flex items-center gap-1.5">
                <Loader2 className="w-3.5 h-3.5 animate-spin text-blue-600" />
                Mendeteksi nama jalan & wilayah dari peta...
              </span>
            ) : (
              address || `Titik Koordinat (${lat.toFixed(4)}, ${lng.toFixed(4)})`
            )}
          </div>
        </div>

        {/* Ringkasan Kelurahan & Kecamatan Terdeteksi */}
        <div className="grid grid-cols-2 gap-2 text-xs">
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-medium text-slate-400">Kelurahan / Desa</div>
            <div className="font-bold text-slate-800 truncate mt-0.5">
              {isResolving ? '...' : (village || 'Kota Bengkulu')}
            </div>
          </div>
          <div className="p-2.5 rounded-xl bg-white border border-slate-200/80 shadow-2xs">
            <div className="text-[10px] font-medium text-slate-400">Kecamatan / Kota</div>
            <div className="font-bold text-slate-800 truncate mt-0.5">
              {isResolving ? '...' : (district || 'Kota Bengkulu')}
            </div>
          </div>
        </div>

        <p className="text-[11px] text-slate-500 italic">
          * Alamat di atas otomatis terisi sesuai pergeseran pin peta Anda. Anda tidak perlu mengetik alamat secara manual.
        </p>
      </div>
    </div>
  );
}
