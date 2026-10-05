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
    default:
      // Building / Infrastructure
      return '<path d="M6 22V4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18ZM6 12H4a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h2Zm12 0h2a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2h-2Zm-8-4h.01M14 8h.01M10 12h.01M14 12h.01M10 16h.01M14 16h.01" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/>';
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
          ? `<div class="absolute -inset-2.5 rounded-full bg-blue-500/35 animate-ping"></div>`
          : isPending
          ? `<div class="absolute -inset-1 rounded-full trace-marker-pulse" style="background-color: ${config.colorHex}; opacity: 0.35;"></div>`
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
