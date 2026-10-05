'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import type { Map as LeafletMap, LayerGroup, TileLayer, Marker as LeafletMarker } from 'leaflet';
import { Report, CATEGORIES_CONFIG } from '@/lib/types';
import MapTypeSwitch from './MapTypeSwitch';
import { fixLeafletDefaultIcons, buildCustomMarkerHtml } from './mapUtils';
import { Plus, Minus, LocateFixed, Compass, Loader2 } from 'lucide-react';
import { useToast } from '@/components/ui/ToastProvider';

interface FullCommunityMapProps {
  reports: Report[];
  selectedReportId: string | null;
  onSelectReport: (report: Report) => void;
  selectedCategory: string;
  onCategoryChange: (cat: string) => void;
}

export default function FullCommunityMap({
  reports,
  selectedReportId,
  onSelectReport,
}: FullCommunityMapProps) {
  const { toast } = useToast();
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<LeafletMap | null>(null);
  const markersLayerRef = useRef<LayerGroup | null>(null);
  const userMarkerRef = useRef<LeafletMarker | null>(null);

  const [mapType, setMapType] = useState<'street' | 'satellite'>('street');
  const [isLocating, setIsLocating] = useState<boolean>(false);

  const tileLayersRef = useRef<{
    street: TileLayer | null;
    satellite: TileLayer | null;
    satelliteLabels: TileLayer | null;
  }>({ street: null, satellite: null, satelliteLabels: null });

  // Switch between Street map and Satellite imagery
  useEffect(() => {
    const map = mapInstanceRef.current;
    const { street, satellite, satelliteLabels } = tileLayersRef.current;
    if (!map || !street || !satellite) return;

    if (mapType === 'satellite') {
      if (map.hasLayer(street)) map.removeLayer(street);
      if (!map.hasLayer(satellite)) {
        map.addLayer(satellite);
        satellite.bringToBack();
      }
      if (satelliteLabels && !map.hasLayer(satelliteLabels)) {
        map.addLayer(satelliteLabels);
      }
    } else {
      if (map.hasLayer(satellite)) map.removeLayer(satellite);
      if (satelliteLabels && map.hasLayer(satelliteLabels)) map.removeLayer(satelliteLabels);
      if (!map.hasLayer(street)) {
        map.addLayer(street);
        street.bringToBack();
      }
    }
  }, [mapType]);

  // Handler: Locate Me (GPS)
  const handleLocateMe = useCallback(() => {
    if (!navigator.geolocation) {
      toast.error('Perangkat tidak mendukung geolokasi GPS');
      return;
    }

    setIsLocating(true);
    toast.info('Mendeteksi koordinat lokasi Anda...');

    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setIsLocating(false);
        const { latitude, longitude } = pos.coords;
        const map = mapInstanceRef.current;

        if (map) {
          import('leaflet').then((L) => {
            if (userMarkerRef.current) {
              map.removeLayer(userMarkerRef.current);
            }

            const userIcon = L.divIcon({
              html: `
                <div class="relative flex items-center justify-center w-8 h-8">
                  <div class="absolute inset-0 rounded-full user-location-pulse bg-blue-500/40"></div>
                  <div class="w-4 h-4 rounded-full bg-blue-600 border-2 border-white shadow-md"></div>
                </div>
              `,
              className: 'custom-user-marker',
              iconSize: [32, 32],
              iconAnchor: [16, 16],
            });

            const marker = L.marker([latitude, longitude], { icon: userIcon })
              .bindTooltip('Lokasi Anda', {
                permanent: true,
                direction: 'top',
                offset: [0, -14],
                className: 'trace-tooltip',
              })
              .addTo(map);

            userMarkerRef.current = marker;
            map.flyTo([latitude, longitude], 15, { duration: 1.2 });
            toast.success('Lokasi GPS Ditemukan!');
          });
        }
      },
      () => {
        setIsLocating(false);
        toast.error('Gagal mengakses GPS', 'Periksa izin lokasi di browser Anda');
      },
      { timeout: 10000, enableHighAccuracy: true }
    );
  }, [toast]);

  // Handler: Reset Map View (Kota Bengkulu)
  const handleResetView = useCallback(() => {
    const map = mapInstanceRef.current;
    if (map) {
      map.flyTo([-3.8000, 102.2650], 13, { duration: 0.9 });
    }
  }, []);

  // Handler: Zoom In & Out
  const handleZoom = useCallback((direction: 'in' | 'out') => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (direction === 'in') map.zoomIn();
    else map.zoomOut();
  }, []);

  // Render Markers
  const renderMarkers = useCallback(
    (L: typeof import('leaflet'), layer: LayerGroup, data: Report[], currentSelectedId: string | null) => {
      layer.clearLayers();

      data.forEach((report) => {
        const isSelected = report.id === currentSelectedId;
        const config = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;
        const customHtml = buildCustomMarkerHtml(report, isSelected);

        const customIcon = L.divIcon({
          html: customHtml,
          className: 'custom-full-map-marker',
          iconSize: [36, 42],
          iconAnchor: [18, 40],
          popupAnchor: [0, -38],
        });

        const marker = L.marker([report.latitude, report.longitude], {
          icon: customIcon,
          zIndexOffset: isSelected ? 1000 : 0,
        });

        // Hover tooltip
        marker.bindTooltip(
          `
            <div style="display:flex;align-items:center;gap:6px;">
              <span style="width:7px;height:7px;border-radius:50%;background-color:${config.colorHex};display:inline-block;flex-shrink:0;"></span>
              <span style="font-weight:700;">${config.name.split(' ')[0]}:</span>
              <span style="max-width:180px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${report.title}</span>
            </div>
          `,
          {
            direction: 'top',
            offset: [0, -38],
            className: 'trace-tooltip',
            opacity: 0.98,
          }
        );

        marker.on('click', () => {
          onSelectReport(report);
        });

        marker.addTo(layer);
      });
    },
    [onSelectReport]
  );

  // Inisialisasi Peta
  useEffect(() => {
    if (!mapContainerRef.current) return;
    if (mapInstanceRef.current) return;

    let isMounted = true;

    import('leaflet').then((L) => {
      if (!isMounted || !mapContainerRef.current) return;

      fixLeafletDefaultIcons(L);

      const map = L.map(mapContainerRef.current, {
        center: [-3.8000, 102.2650],
        zoom: 13,
        zoomControl: false,
      });

      // OpenStreetMap Standard Tile Layer
      const streetLayer = L.tileLayer(
        'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
        {
          subdomains: ['a', 'b', 'c'],
          maxZoom: 19,
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> kontributor',
        }
      );

      const satelliteLayer = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: 'Tiles &copy; Esri',
          maxZoom: 19,
        }
      );

      const satelliteLabelsLayer = L.tileLayer(
        'https://services.arcgisonline.com/ArcGIS/rest/services/Reference/World_Boundaries_and_Places/MapServer/tile/{z}/{y}/{x}',
        {
          maxZoom: 19,
        }
      );

      tileLayersRef.current = {
        street: streetLayer,
        satellite: satelliteLayer,
        satelliteLabels: satelliteLabelsLayer,
      };

      streetLayer.addTo(map);

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      renderMarkers(L, markersLayer, reports, selectedReportId);
    });

    return () => {
      isMounted = false;
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Update marker saat reports atau selectedReportId berubah
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import('leaflet').then((L) => {
      renderMarkers(L, markersLayerRef.current!, reports, selectedReportId);
    });
  }, [reports, selectedReportId, renderMarkers]);

  // Terbang (flyTo) ke koordinat laporan terpilih jika ada
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedReportId) return;

    const target = reports.find((r) => r.id === selectedReportId);
    if (target) {
      mapInstanceRef.current.flyTo([target.latitude, target.longitude], 15, {
        duration: 1.0,
      });
    }
  }, [selectedReportId, reports]);

  return (
    <div className="relative w-full h-full bg-slate-100">
      {/* Floating Map Type Switch in Top Right */}
      <div className="absolute top-4 right-4 z-20 pointer-events-auto bg-white/95 backdrop-blur-xl border border-slate-200/80 p-1 rounded-full shadow-md">
        <MapTypeSwitch mapType={mapType} onChange={setMapType} />
      </div>

      {/* Floating Action Controls in Bottom Right */}
      <div className="absolute bottom-4 right-4 z-20 pointer-events-auto flex flex-col items-center gap-1.5">
        {/* GPS Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-8.5 h-8.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
          title="Lokasi Saya"
        >
          {isLocating ? (
            <Loader2 className="w-3.5 h-3.5 text-blue-600 animate-spin" />
          ) : (
            <LocateFixed className="w-3.5 h-3.5" />
          )}
        </button>

        {/* Reset Bengkulu View */}
        <button
          type="button"
          onClick={handleResetView}
          className="w-8.5 h-8.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all active:scale-95"
          title="Pusatkan ke Kota Bengkulu"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>

        {/* Zoom In & Out */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="w-8.5 h-8.5 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors border-b border-slate-100"
            title="Perbesar"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="w-8.5 h-8.5 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-colors"
            title="Perkecil"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Container Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
