import { IssueCategory, Report, CATEGORIES_CONFIG } from '@/lib/types';

/**
 * Generate SVG icon string for Leaflet DivIcon based on category
 */
export function getCategorySvgPath(category: IssueCategory): string {
  switch (category) {
    case 'jalan':
      // Hazard / Warning Triangle
      return '<path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4m0 4h.01" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'pju':
      // Lightbulb
      return '<path d="M9 18h6m-4 4h2M12 2a7 7 0 0 0-7 7c0 2.38 1.19 4.47 3 5.74V17a1 1 0 0 0 1 1h6a1 1 0 0 0 1-1v-2.26c1.81-1.27 3-3.36 3-5.74a7 7 0 0 0-7-7z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'banjir':
      // Water Droplets
      return '<path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'sampah':
      // Trash Can
      return '<path d="M3 6h18m-2 0v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6m3 0V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2m-6 5v6m4-6v6" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'limbah':
      // Biohazard / Flask
      return '<path d="M10 2v7.31L4.67 19.34A2 2 0 0 0 6.4 22h11.2a2 2 0 0 0 1.73-2.66L14 9.31V2m-5 0h6m-7 12h8" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'fasilitas':
      // Building / Infrastructure
      return '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2Zm12 0h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2Zm-8-4h.01M14 8h.01M10 12h.01M14 12h.01M10 16h.01M14 16h.01" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
    case 'lainnya':
    default:
      // Sparkles / Custom Pin Icon
      return '<path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
  }
}

/**
 * Fix default Leaflet marker asset paths when loaded via bundler
 */
export function fixLeafletDefaultIcons(L: typeof import('leaflet')) {
  if (!L || !L.Icon || !L.Icon.Default) return;
  delete (L.Icon.Default.prototype as { _getIconUrl?: unknown })._getIconUrl;
  L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png',
    iconUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    shadowUrl: 'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png',
  });
}

/**
 * Threshold jarak (dalam meter) untuk menggabungkan laporan berdekatan menjadi centroid
 */
export const CENTROID_CLUSTER_MAX_DISTANCE_METERS = 75;

/**
 * Level zoom di mana klaster terurai menjadi titik biasa (ketika di-zoom dekat)
 * Zoom < 17: laporan berdekatan <= 75m digabung menjadi 1 titik centroid
 * Zoom >= 17: laporan ditampilkan sebagai titik biasa terpisah
 */
export const CENTROID_CLUSTER_ZOOM_THRESHOLD = 17;

export interface CentroidCluster {
  id: string;
  latitude: number;
  longitude: number;
  reports: Report[];
  count: number;
  categories: IssueCategory[];
}

export type MapMarkerItem =
  | { type: 'single'; report: Report; latitude: number; longitude: number }
  | { type: 'cluster'; cluster: CentroidCluster; latitude: number; longitude: number };

/**
 * Menghitung jarak antara 2 koordinat geografis dalam meter menggunakan formula Haversine
 */
export function getDistanceInMeters(
  lat1: number,
  lon1: number,
  lat2: number,
  lon2: number
): number {
  const R = 6371000; // Radius bumi dalam meter
  const toRad = (deg: number) => (deg * Math.PI) / 180;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

/**
 * Mengelompokkan laporan yang berdekatan (radius <= 75m) menjadi centroid cluster
 */
export function clusterReportsByDistance(
  reports: Report[],
  maxDistanceMeters: number = CENTROID_CLUSTER_MAX_DISTANCE_METERS
): MapMarkerItem[] {
  const visited = new Set<string>();
  const items: MapMarkerItem[] = [];

  for (let i = 0; i < reports.length; i++) {
    const reportA = reports[i];
    if (visited.has(reportA.id)) continue;

    const group: Report[] = [reportA];
    visited.add(reportA.id);

    // Kumpulkan laporan lain yang berjarak <= maxDistanceMeters dari salah satu anggota grup
    for (let j = 0; j < reports.length; j++) {
      if (i === j) continue;
      const reportB = reports[j];
      if (visited.has(reportB.id)) continue;

      const isNearGroup = group.some((member) => {
        const d = getDistanceInMeters(
          member.latitude,
          member.longitude,
          reportB.latitude,
          reportB.longitude
        );
        return d <= maxDistanceMeters;
      });

      if (isNearGroup) {
        group.push(reportB);
        visited.add(reportB.id);
      }
    }

    if (group.length === 1) {
      items.push({
        type: 'single',
        report: reportA,
        latitude: reportA.latitude,
        longitude: reportA.longitude,
      });
    } else {
      // Hitung koordinat centroid rata-rata dari seluruh laporan di grup
      const avgLat = group.reduce((sum, r) => sum + r.latitude, 0) / group.length;
      const avgLon = group.reduce((sum, r) => sum + r.longitude, 0) / group.length;
      const uniqueCategories = Array.from(new Set(group.map((r) => r.category)));

      items.push({
        type: 'cluster',
        latitude: avgLat,
        longitude: avgLon,
        cluster: {
          id: `cluster-${group.map((r) => r.id).join('-')}`,
          latitude: avgLat,
          longitude: avgLon,
          reports: group,
          count: group.length,
          categories: uniqueCategories,
        },
      });
    }
  }

  return items;
}

/**
 * Generates custom HTML for Leaflet DivIcon with category coloring, SVG icon, and status indicators
 */
export function buildCustomMarkerHtml(report: Report, isSelected: boolean = false): string {
  const config = CATEGORIES_CONFIG[report.category] || CATEGORIES_CONFIG.jalan;
  const isPending = report.status === 'pending';
  const isResolved = report.status === 'resolved';

  return `
    <div class="relative group cursor-pointer flex flex-col items-center" style="width: 36px; height: 42px;">
      ${
        isSelected
          ? `
            <!-- Efek Sonar Terpilih (Biru Presisi di Kepala Pin) -->
            <div class="trace-sonar-wave" style="border-color: #2563eb; box-shadow: 0 0 10px rgba(37,99,235,0.6);"></div>
            <div class="trace-sonar-soft-glow" style="background-color: #3b82f6; filter: blur(3px);"></div>
          `
          : isPending
          ? `
            <!-- Cincin Gelombang Radar Sonar Presisi (Konsentris di Lingkaran Kepala Pin 32px) -->
            <div class="trace-sonar-wave" style="border-color: ${config.colorHex}; box-shadow: 0 0 6px ${config.colorHex}55;"></div>
            <div class="trace-sonar-wave trace-sonar-wave-delayed" style="border-color: ${config.colorHex}; box-shadow: 0 0 6px ${config.colorHex}35;"></div>
            <div class="trace-sonar-soft-glow" style="background-color: ${config.colorHex}; filter: blur(2px);"></div>
          `
          : ''
      }
      
      <!-- Circular Pin Body -->
      <div 
        class="relative flex items-center justify-center transition-all duration-200 group-hover:scale-115 ${
          isSelected ? 'scale-120 ring-4 ring-blue-500/40 shadow-xl' : 'shadow-md shadow-slate-900/20'
        }"
        style="
          width: 32px; 
          height: 32px; 
          background-color: ${config.colorHex}; 
          border: 2px solid #ffffff; 
          border-radius: 9999px;
        "
      >
        <!-- Category Icon -->
        <svg width="15" height="15" viewBox="0 0 24 24" fill="none" class="text-white shrink-0">
          ${getCategorySvgPath(report.category)}
        </svg>

        <!-- Small Needle Tip Below -->
        <div 
          class="absolute -bottom-1 w-2.5 h-2.5 rotate-45 border-r border-b border-white"
          style="background-color: ${config.colorHex};"
        ></div>
      </div>
      
      <!-- Resolved Checkmark Badge -->
      ${
        isResolved
          ? `<div class="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border border-white flex items-center justify-center text-white shadow-xs">
              <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.5" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="20 6 9 17 4 12"></polyline>
              </svg>
             </div>`
          : ''
      }
    </div>
  `;
}

/**
 * Generates custom HTML for Leaflet DivIcon Centroid Cluster (ketika scroll jauh & jarak <= 75m)
 */
export function buildCentroidMarkerHtml(
  cluster: CentroidCluster,
  isSelected: boolean = false
): string {
  const categoryDotsHtml = cluster.categories
    .slice(0, 3)
    .map((cat) => {
      const color = CATEGORIES_CONFIG[cat]?.colorHex || '#3b82f6';
      return `<span style="width: 6px; height: 6px; border-radius: 9999px; background-color: ${color}; display: inline-block;"></span>`;
    })
    .join('');

  return `
    <div class="relative group cursor-pointer flex flex-col items-center" style="width: 44px; height: 48px;">
      <!-- Gelombang Sonar Radar Presisi Centroid (Konsentris di Pusat 38px) -->
      <div class="trace-sonar-wave" style="top: 0; left: 3px; width: 38px; height: 38px; border-color: #2563eb; box-shadow: 0 0 8px rgba(37,99,235,0.45);"></div>
      <div class="trace-sonar-wave trace-sonar-wave-delayed" style="top: 0; left: 3px; width: 38px; height: 38px; border-color: #6366f1; box-shadow: 0 0 8px rgba(99,102,241,0.35);"></div>
      <div class="trace-sonar-soft-glow" style="top: 0; left: 3px; width: 38px; height: 38px; background-color: #3b82f6; filter: blur(3px);"></div>

      ${
        isSelected
          ? `<div class="absolute -inset-2.5 rounded-full bg-indigo-500/40 animate-ping"></div>`
          : ''
      }

      <!-- Badan Pin Centroid (Gradien Biru-Indigo dengan Cincin Putih Tebal) -->
      <div 
        class="relative flex flex-col items-center justify-center transition-all duration-200 group-hover:scale-110 ${
          isSelected ? 'ring-4 ring-indigo-500/50 scale-115' : ''
        }"
        style="
          width: 38px;
          height: 38px;
          background: linear-gradient(135deg, #1d4ed8 0%, #3b82f6 50%, #4f46e5 100%);
          border: 2.5px solid #ffffff;
          border-radius: 9999px;
          box-shadow: 0 6px 18px rgba(30, 58, 138, 0.45);
        "
      >
        <!-- Jumlah Laporan di Titik Centroid -->
        <div style="color: #ffffff; font-weight: 800; font-size: 13px; line-height: 1; letter-spacing: -0.02em;">
          ${cluster.count}
        </div>
        <div style="color: #bfdbfe; font-size: 7.5px; font-weight: 700; text-transform: uppercase; line-height: 1; letter-spacing: 0.02em; margin-top: 1px;">
          TITIK
        </div>

        <!-- Ujung Jarum Pin di Bawah -->
        <div 
          style="
            position: absolute;
            bottom: -3px;
            width: 8px;
            height: 8px;
            transform: rotate(45deg);
            background-color: #3b82f6;
            border-right: 2px solid #ffffff;
            border-bottom: 2px solid #ffffff;
          "
        ></div>
      </div>

      <!-- Badge Indikator Jarak Radius ≤75m di Atas -->
      <div 
        style="
          position: absolute;
          top: -7px;
          display: flex;
          align-items: center;
          gap: 3px;
          padding: 1px 5px;
          background: rgba(15, 23, 42, 0.88);
          backdrop-filter: blur(4px);
          border-radius: 9999px;
          border: 1px solid rgba(255, 255, 255, 0.6);
          box-shadow: 0 2px 6px rgba(0, 0, 0, 0.2);
        "
      >
        ${categoryDotsHtml}
        <span style="font-size: 7.5px; font-weight: 800; color: #ffffff; line-height: 1;">≤75m</span>
      </div>
    </div>
  `;
}

/**
 * Tooltip informatif untuk Titik Centroid
 */
export function buildCentroidTooltipHtml(cluster: CentroidCluster): string {
  const reportsList = cluster.reports
    .slice(0, 4)
    .map((r) => {
      const config = CATEGORIES_CONFIG[r.category] || CATEGORIES_CONFIG.jalan;
      return `
        <div style="display:flex;align-items:center;gap:6px;margin-top:2px;">
          <span style="width:6px;height:6px;border-radius:50%;background-color:${config.colorHex};display:inline-block;flex-shrink:0;"></span>
          <span style="font-weight:700;color:#1e293b;font-size:10px;">${config.name.split(' ')[0]}:</span>
          <span style="max-width:160px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;font-size:10px;color:#475569;">${r.title}</span>
        </div>
      `;
    })
    .join('');

  return `
    <div style="min-width: 190px; padding: 2px 0;">
      <div style="display:flex;align-items:center;justify-content:space-between;border-bottom:1px solid #e2e8f0;padding-bottom:4px;margin-bottom:4px;">
        <span style="font-weight:800;color:#1e40af;font-size:11px;">📍 Titik Centroid</span>
        <span style="background:#dbeafe;color:#1e40af;font-size:9.5px;font-weight:800;padding:1px 6px;border-radius:9999px;">${cluster.count} Laporan</span>
      </div>
      <div style="font-size:9px;color:#64748b;margin-bottom:2px;">Berdekatan (radius ≤ 75m):</div>
      ${reportsList}
      <div style="margin-top:6px;padding-top:4px;border-top:1px dashed #cbd5e1;font-size:9px;color:#2563eb;font-weight:700;text-align:center;">
        🔍 Klik / Zoom Dekat untuk Buka Titik
      </div>
    </div>
  `;
}
