'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Map as LeafletMap, Marker as LeafletMarker, LeafletMouseEvent } from 'leaflet';
import { Navigation, MapPin, CheckCircle2, Crosshair } from 'lucide-react';

interface LocationPickerProps {
  initialLat?: number;
  initialLng?: number;
  onLocationChange: (lat: number, lng: number) => void;
}

export default function LocationPicker({
  initialLat = -3.8000,
  initialLng = 102.2650,
  onLocationChange,
}: LocationPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markerRef = useRef<LeafletMarker | null>(null);
  const onLocationChangeRef = useRef(onLocationChange);

  // Selalu perbarui ref callback agar tidak memicu re-render map
  useEffect(() => {
    onLocationChangeRef.current = onLocationChange;
  }, [onLocationChange]);

  const [coords, setCoords] = useState<{ lat: number; lng: number }>({
    lat: initialLat,
    lng: initialLng,
  });
  const [isLocating, setIsLocating] = useState<boolean>(false);
  const [isMapReady, setIsMapReady] = useState<boolean>(false);

  // 1. Inisialisasi Peta HANYA SEKALI saat Komponen Dipasang (Mounting)
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current || mapInstanceRef.current) return;

      // Inisialisasi Instance Peta
      const map = L.map(mapContainerRef.current, {
        center: [initialLat, initialLng],
        zoom: 14,
        zoomControl: true,
      });

      // Tile Layer OpenStreetMap
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
        maxZoom: 19,
        subdomains: ['a', 'b', 'c'],
      }).addTo(map);

      // Desain Ikon Pin Penunjuk Lokasi Presisi & Berdenyut
      const createPinIcon = () =>
        L.divIcon({
          html: `
            <div class="relative flex flex-col items-center justify-center cursor-pointer pointer-events-auto" style="width: 36px; height: 46px;">
              <!-- Gelombang Radar Sonar (Pulse Animation) -->
              <div class="absolute -top-1 w-10 h-10 rounded-full border-2 border-blue-500 animate-ping opacity-60 pointer-events-none"></div>
              <div class="absolute top-0 w-8 h-8 rounded-full bg-blue-500/30 blur-xs pointer-events-none"></div>

              <!-- Kepala Pin Bulat -->
              <div class="relative w-8 h-8 rounded-full bg-blue-600 border-2.5 border-white shadow-xl flex items-center justify-center transition-transform hover:scale-110 active:scale-95">
                <div class="w-2.5 h-2.5 rounded-full bg-white shadow-xs"></div>
                <!-- Jarum Runcing Penunjuk Titik Presisi -->
                <div class="absolute -bottom-1.5 left-1/2 -translate-x-1/2 w-3.5 h-3.5 bg-blue-600 rotate-45 border-r-2 border-b-2 border-white"></div>
              </div>

              <!-- Bayangan di Permukaan Peta -->
              <div class="absolute -bottom-0.5 w-4 h-1.5 bg-slate-900/35 rounded-full blur-[1px]"></div>
            </div>
          `,
          className: 'custom-picker-pin',
          iconSize: [36, 46],
          iconAnchor: [18, 46], // Ujung jarum tepat di koordinat piksel
          popupAnchor: [0, -42],
        });

      // Tambahkan Marker yang Dapat Digeser (Draggable)
      const marker = L.marker([initialLat, initialLng], {
        icon: createPinIcon(),
        draggable: true,
        zIndexOffset: 1000,
      }).addTo(map);

      // Tooltip Pembantu Interaktif
      marker.bindTooltip('Titik Terpilih (Geser atau klik peta untuk memindahkan)', {
        direction: 'top',
        offset: [0, -44],
        className: 'trace-tooltip',
        opacity: 0.95,
      });

      // Event Saat Marker Selesai Digeser
      marker.on('dragend', () => {
        const pos = marker.getLatLng();
        setCoords({ lat: pos.lat, lng: pos.lng });
        onLocationChangeRef.current(pos.lat, pos.lng);
      });

      // Event Saat Peta Diklik di Titik Baru
      map.on('click', (e: LeafletMouseEvent) => {
        const { lat, lng } = e.latlng;
        marker.setLatLng([lat, lng]);
        map.panTo([lat, lng], { animate: true, duration: 0.4 });
        setCoords({ lat, lng });
        onLocationChangeRef.current(lat, lng);
      });

      markerRef.current = marker;
      mapInstanceRef.current = map;
      setIsMapReady(true);

      // Pastikan ukuran canvas peta terhitung sempurna setelah render
      setTimeout(() => {
        map.invalidateSize();
      }, 150);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
        markerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Run ONCE on mount

  // 2. Sinkronkan Perubahan Koordinat dari Luar (Misal via GPS atau Props Perubahan Eksternal)
  useEffect(() => {
    if (!mapInstanceRef.current || !markerRef.current) return;

    // Hanya update jika selisih jarak cukup signifikan untuk mencegah looping
    const currentPos = markerRef.current.getLatLng();
    const latDiff = Math.abs(currentPos.lat - initialLat);
    const lngDiff = Math.abs(currentPos.lng - initialLng);

    if (latDiff > 0.00005 || lngDiff > 0.00005) {
      markerRef.current.setLatLng([initialLat, initialLng]);
      mapInstanceRef.current.setView([initialLat, initialLng], mapInstanceRef.current.getZoom(), {
        animate: true,
      });
      setCoords({ lat: initialLat, lng: initialLng });
    }
  }, [initialLat, initialLng]);

  // 3. ResizeObserver agar peta selalu menyesuaikan ukuran saat tab/kontainer berubah
  useEffect(() => {
    if (!mapContainerRef.current) return;

    const resizeObserver = new ResizeObserver(() => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.invalidateSize();
      }
    });

    resizeObserver.observe(mapContainerRef.current);

    return () => {
      resizeObserver.disconnect();
    };
  }, []);

  // 4. Deteksi Lokasi GPS Otomatis Browser
  const handleUseCurrentLocation = useCallback(() => {
    if (!navigator.geolocation) {
      alert('Perangkat Anda tidak mendukung fitur geolokasi GPS.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        setCoords({ lat: latitude, lng: longitude });
        onLocationChangeRef.current(latitude, longitude);

        if (mapInstanceRef.current && markerRef.current) {
          mapInstanceRef.current.flyTo([latitude, longitude], 16, { duration: 1.2 });
          markerRef.current.setLatLng([latitude, longitude]);
        }
      },
      () => {
        setIsLocating(false);
      },
      { enableHighAccuracy: true, timeout: 8000 }
    );
  }, []);

  // 5. Pusatkan Kembali ke Pin
  const handleCenterOnMarker = useCallback(() => {
    if (mapInstanceRef.current && markerRef.current) {
      mapInstanceRef.current.flyTo([coords.lat, coords.lng], 16, { duration: 0.8 });
    }
  }, [coords]);

  return (
    <div className="space-y-2.5">
      {/* Header Petunjuk Interaktif */}
      <div className="flex items-center justify-between gap-2">
        <span className="text-xs font-semibold text-slate-700 flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-blue-600" />
          <span>Klik sembarang tempat di peta atau geser pin</span>
        </span>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handleCenterOnMarker}
            title="Pusatkan Peta ke Pin"
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-600 transition-colors cursor-pointer"
          >
            <Crosshair className="w-3.5 h-3.5" />
          </button>

          <button
            type="button"
            onClick={handleUseCurrentLocation}
            disabled={isLocating}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blue-50 text-blue-700 hover:bg-blue-100/90 text-xs font-bold transition-all disabled:opacity-50 cursor-pointer shadow-2xs active:scale-95"
          >
            <Navigation className={`w-3.5 h-3.5 ${isLocating ? 'animate-spin' : ''}`} />
            <span>{isLocating ? 'Mencari GPS...' : 'Gunakan GPS Saya'}</span>
          </button>
        </div>
      </div>

      {/* Kontainer Peta Interaktif Leaflet */}
      <div className="relative w-full h-72 sm:h-80 rounded-2xl overflow-hidden border border-slate-200 shadow-xs bg-slate-100">
        <div ref={mapContainerRef} className="w-full h-full z-10" />

        {/* Overlay Indikator Titik Aktif */}
        <div className="absolute top-3 left-3 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200/90 shadow-md flex items-center gap-2">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-[11px] font-bold text-slate-800">
              Pin Lokasi Siap
            </span>
          </div>
        </div>
      </div>

      {/* Footer Info Koordinat Terpilih */}
      <div className="flex items-center justify-between text-[11px] text-slate-600 bg-slate-50 px-3 py-2 rounded-xl border border-slate-200/60 font-mono">
        <div className="flex items-center gap-1.5 text-blue-700 font-semibold">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
          <span>Titik Terpilih:</span>
        </div>
        <div className="flex items-center gap-3">
          <span>Lat: <strong className="text-slate-900">{coords.lat.toFixed(5)}</strong></span>
          <span>Lng: <strong className="text-slate-900">{coords.lng.toFixed(5)}</strong></span>
        </div>
      </div>
    </div>
  );
}
