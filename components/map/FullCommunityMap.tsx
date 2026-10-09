'use client';

import React, { useEffect, useRef, useState, useCallback } from 'react';
import Image from 'next/image';
import type { Map as LeafletMap, LayerGroup, TileLayer, Marker as LeafletMarker } from 'leaflet';
import { Report, CATEGORIES_CONFIG, STATUS_CONFIG } from '@/lib/types';
import MapTypeSwitch from './MapTypeSwitch';
import {
  fixLeafletDefaultIcons,
  buildCustomMarkerHtml,
  buildCentroidMarkerHtml,
  buildCentroidTooltipHtml,
  clusterReportsByDistance,
  CENTROID_CLUSTER_ZOOM_THRESHOLD,
} from './mapUtils';
import { Plus, Minus, LocateFixed, Compass, Loader2, Clock, ThumbsUp, ArrowRight, X } from 'lucide-react';
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
  const [activePreviewReport, setActivePreviewReport] = useState<Report | null>(null);
  const [currentZoom, setCurrentZoom] = useState<number>(13);

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

  // Render Markers (Centroid Cluster saat zoom jauh < 17 & jarak <= 75m; titik biasa saat zoom dekat >= 17)
  const renderMarkers = useCallback(
    (
      L: typeof import('leaflet'),
      layer: LayerGroup,
      data: Report[],
      currentSelectedId: string | null,
      zoom: number
    ) => {
      layer.clearLayers();

      // Mode Scroll Jauh: Klasterkan laporan dengan jarak radius <= 75m jadi 1 titik centroid
      if (zoom < CENTROID_CLUSTER_ZOOM_THRESHOLD) {
        const clusterItems = clusterReportsByDistance(data, 75);

        clusterItems.forEach((item) => {
          if (item.type === 'single') {
            const report = item.report;
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
              setActivePreviewReport(report);
              const map = mapInstanceRef.current;
              if (map) {
                map.flyTo([report.latitude, report.longitude], 15, { duration: 0.8 });
              }
            });

            marker.addTo(layer);
          } else {
            // Render Centroid Cluster Marker
            const cluster = item.cluster;
            const isSelected = cluster.reports.some((r) => r.id === currentSelectedId);
            const centroidHtml = buildCentroidMarkerHtml(cluster, isSelected);

            const centroidIcon = L.divIcon({
              html: centroidHtml,
              className: 'custom-centroid-marker',
              iconSize: [44, 48],
              iconAnchor: [22, 46],
              popupAnchor: [0, -44],
            });

            const marker = L.marker([cluster.latitude, cluster.longitude], {
              icon: centroidIcon,
              zIndexOffset: isSelected ? 1000 : 0,
            });

            marker.bindTooltip(buildCentroidTooltipHtml(cluster), {
              direction: 'top',
              offset: [0, -44],
              className: 'trace-tooltip',
              opacity: 0.98,
            });

            // Klik Centroid: Zoom mendekat agar terurai menjadi titik biasa
            marker.on('click', () => {
              const map = mapInstanceRef.current;
              if (map) {
                map.flyTo([cluster.latitude, cluster.longitude], 17, { duration: 0.8 });
              }
              if (cluster.reports.length > 0) {
                setActivePreviewReport(cluster.reports[0]);
              }
            });

            marker.addTo(layer);
          }
        });
      } else {
        // Mode Scroll Dekat: Laporan tampil sebagai titik biasa individual
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
            setActivePreviewReport(report);
            const map = mapInstanceRef.current;
            if (map) {
              map.flyTo([report.latitude, report.longitude], 17, { duration: 0.8 });
            }
          });

          marker.addTo(layer);
        });
      }
    },
    []
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

      // Deteksi perubahan zoom (scroll jauh / dekat)
      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      const markersLayer = L.layerGroup().addTo(map);
      markersLayerRef.current = markersLayer;
      mapInstanceRef.current = map;

      renderMarkers(L, markersLayer, reports, selectedReportId, 13);
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

  // Update marker saat reports, selectedReportId, atau zoom level berubah
  useEffect(() => {
    if (!mapInstanceRef.current || !markersLayerRef.current) return;

    import('leaflet').then((L) => {
      renderMarkers(L, markersLayerRef.current!, reports, selectedReportId, currentZoom);
    });
  }, [reports, selectedReportId, currentZoom, renderMarkers]);

  // Terbang (flyTo) ke koordinat laporan terpilih jika ada
  useEffect(() => {
    if (!mapInstanceRef.current || !selectedReportId) return;

    const target = reports.find((r) => r.id === selectedReportId);
    if (target) {
      setActivePreviewReport(target);
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
      <div className="absolute bottom-20 md:bottom-4 right-3 sm:right-4 z-20 pointer-events-auto flex flex-col items-center gap-1.5">
        {/* GPS Button */}
        <button
          type="button"
          onClick={handleLocateMe}
          disabled={isLocating}
          className="w-8.5 h-8.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 active:scale-90"
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
          className="w-8.5 h-8.5 rounded-full bg-white/95 backdrop-blur-md border border-slate-200/90 shadow-md flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 active:scale-90"
          title="Pusatkan ke Kota Bengkulu"
        >
          <Compass className="w-3.5 h-3.5" />
        </button>

        {/* Zoom In & Out */}
        <div className="flex flex-col bg-white/95 backdrop-blur-md rounded-full border border-slate-200/90 shadow-md overflow-hidden">
          <button
            type="button"
            onClick={() => handleZoom('in')}
            className="w-8.5 h-8.5 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 active:scale-90 border-b border-slate-100"
            title="Perbesar"
          >
            <Plus className="w-3.5 h-3.5" />
          </button>
          <button
            type="button"
            onClick={() => handleZoom('out')}
            className="w-8.5 h-8.5 flex items-center justify-center text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-150 active:scale-90"
            title="Perkecil"
          >
            <Minus className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Bottom Floating Interactive Preview Card (Slides up on marker click) */}
      {/* Floating Preview Card with Spring Slide-up */}
      {activePreviewReport && (
        <div className="card-slide-up absolute bottom-20 md:bottom-6 left-1/2 z-30 w-[calc(100%-1.5rem)] max-w-md pointer-events-auto">
          <div className="bg-white/95 backdrop-blur-xl border border-slate-200/90 shadow-2xl shadow-slate-900/15 rounded-2xl p-2.5 sm:p-3.5 flex gap-2.5 sm:gap-3.5 items-center relative">
            {/* Image Thumbnail with Category Tag */}
            <div className="w-16 h-16 sm:w-18 sm:h-18 rounded-xl overflow-hidden relative shrink-0 bg-slate-100 border border-slate-200/70 group/thumb">
              <Image
                src={activePreviewReport.imageUrl}
                alt={activePreviewReport.title}
                width={72}
                height={72}
                unoptimized
                className="w-full h-full object-cover transition-transform duration-300 group-hover/thumb:scale-105"
              />
              <div className="absolute top-1 left-1">
                <span
                  className="text-[9px] font-bold px-1.5 py-0.5 rounded-md text-white shadow-xs leading-none"
                  style={{
                    backgroundColor:
                      CATEGORIES_CONFIG[activePreviewReport.category]?.colorHex || '#3b82f6',
                  }}
                >
                  {activePreviewReport.customCategory || CATEGORIES_CONFIG[activePreviewReport.category]?.name.split(' ')[0]}
                </span>
              </div>
            </div>

            {/* Info Body */}
            <div className="flex-1 min-w-0 pr-6">
              <div className="flex items-center gap-2 text-[11px] text-slate-500 mb-0.5">
                <span className="font-mono font-semibold text-blue-600 truncate">
                  {activePreviewReport.trackingCode}
                </span>
                <span>•</span>
                <span className="truncate">{activePreviewReport.village}</span>
              </div>

              <h4 className="font-bold text-xs sm:text-sm text-slate-900 truncate leading-snug">
                {activePreviewReport.title}
              </h4>

              <div className="flex items-center gap-1.5 text-[11px] text-slate-500 mt-0.5">
                <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                <span className="truncate">{activePreviewReport.createdAt}</span>
                <span>•</span>
                <span className="font-medium text-emerald-600 shrink-0">
                  {STATUS_CONFIG[activePreviewReport.status]?.label || 'Proses'}
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 mt-2">
                <button
                  type="button"
                  onClick={() => {
                    onSelectReport(activePreviewReport);
                  }}
                  className="group/cta px-3.5 py-1.5 min-h-8 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold flex items-center gap-1.5 shadow-xs transition-all shrink-0 active:scale-95 focus-visible:outline-2 focus-visible:outline-blue-600"
                >
                  <span>Buka Rincian Lengkap</span>
                  <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover/cta:translate-x-0.5" />
                </button>

                <div className="text-[11px] text-slate-600 flex items-center gap-1 font-medium bg-slate-100 px-2 py-1 rounded-xl shrink-0 transition-transform active:scale-90">
                  <ThumbsUp className="w-3.5 h-3.5 text-blue-600" />
                  <span>{activePreviewReport.upvotes}</span>
                </div>
              </div>
            </div>

            {/* Close Button with smooth rotation */}
            <button
              type="button"
              onClick={() => setActivePreviewReport(null)}
              className="absolute top-2 right-2 min-w-8 min-h-8 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-100 flex items-center justify-center transition-all duration-200 hover:rotate-90 active:scale-90"
              title="Tutup Preview"
              aria-label="Tutup Preview"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Container Leaflet */}
      <div ref={mapContainerRef} className="w-full h-full" />
    </div>
  );
}
