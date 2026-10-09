export type IssueCategory = 
  | 'jalan'       // Jalan & Akses Rusak (Rose/Red)
  | 'pju'         // Penerangan & Kelistrikan (Amber/Yellow)
  | 'banjir'      // Banjir & Genangan Air (Ocean Azure)
  | 'sampah'      // Kebersihan & Sampah Liar (Emerald Green)
  | 'limbah'      // Limbah & Pencemaran (Deep Violet)
  | 'fasilitas'   // Fasilitas Umum (Slate Indigo)
  | 'lainnya';    // Kategori Lainnya (Teal - Kustom Pengguna)

export type ReportStatus = 
  | 'pending'       // Menunggu Verifikasi
  | 'in_progress'   // Sedang Ditindaklanjuti
  | 'resolved'      // Selesai Ditangani
  | 'rejected';     // Ditolak / Tidak Valid

export type UrgencyLevel = 'rendah' | 'sedang' | 'tinggi' | 'darurat';

export interface TimelineEvent {
  id: string;
  date: string;
  status: ReportStatus;
  title: string;
  note: string;
  actor: string; // e.g. "Sistem TRACE", "Admin Kelurahan", "Tim Teknis Dinas Bina Marga"
  evidenceUrl?: string;
}

export interface Report {
  id: string;
  trackingCode: string; // e.g. "TRC-2026-0891"
  title: string;
  description: string;
  category: IssueCategory;
  customCategory?: string; // Kategori khusus yang diinput pengguna jika memilih kustom/lainnya
  status: ReportStatus;
  urgency: UrgencyLevel;
  latitude: number;
  longitude: number;
  address: string;
  district: string; // Kecamatan
  village: string;  // Kelurahan / Desa
  imageUrl: string;
  resolvedImageUrl?: string;
  reporterAlias: string; // e.g. "Warga #2941" atau "Budi S." (Privasi terlindungi)
  reporterPhoneMasked?: string; // e.g. "0812****8920"
  reporterNikMasked?: string;  // e.g. "3171**********12"
  createdAt: string;
  updatedAt: string;
  upvotes: number;
  assignedAgency?: string; // e.g. "Dinas Lingkungan Hidup", "Dinas Sumber Daya Air"
  adminNote?: string;
  timeline: TimelineEvent[];
}

export interface CategoryMeta {
  id: IssueCategory;
  name: string;
  description: string;
  colorHex: string;
  bgClass: string;
  textClass: string;
  borderClass: string;
  pinBadgeClass: string;
  iconName: string;
}

export const CATEGORIES_CONFIG: Record<IssueCategory, CategoryMeta> = {
  jalan: {
    id: 'jalan',
    name: 'Jalan & Akses Rusak',
    description: 'Jalan berlubang, aspal amblas, trotoar hancur, jembatan rusak',
    colorHex: '#EF4444',
    bgClass: 'bg-rose-50',
    textClass: 'text-rose-600',
    borderClass: 'border-rose-200',
    pinBadgeClass: 'bg-rose-500',
    iconName: 'AlertTriangle',
  },
  pju: {
    id: 'pju',
    name: 'Penerangan & Kelistrikan',
    description: 'Lampu jalan (PJU) padam, tiang miring, kabel menjuntai',
    colorHex: '#F59E0B',
    bgClass: 'bg-amber-50',
    textClass: 'text-amber-600',
    borderClass: 'border-amber-200',
    pinBadgeClass: 'bg-amber-500',
    iconName: 'Lightbulb',
  },
  banjir: {
    id: 'banjir',
    name: 'Banjir & Genangan Air',
    description: 'Drainase tersumbat, genangan jalan, tanggul rembes/rusak',
    colorHex: '#0284C7',
    bgClass: 'bg-sky-50',
    textClass: 'text-sky-600',
    borderClass: 'border-sky-200',
    pinBadgeClass: 'bg-sky-500',
    iconName: 'Droplets',
  },
  sampah: {
    id: 'sampah',
    name: 'Kebersihan & Sampah',
    description: 'Tumpukan sampah liar, TPS overload, ranting pohon tumbang',
    colorHex: '#10B981',
    bgClass: 'bg-emerald-50',
    textClass: 'text-emerald-600',
    borderClass: 'border-emerald-200',
    pinBadgeClass: 'bg-emerald-500',
    iconName: 'Trash2',
  },
  limbah: {
    id: 'limbah',
    name: 'Limbah & Pencemaran',
    description: 'Pembuangan limbah got, pencemaran air sungai, bau menyengat',
    colorHex: '#8B5CF6',
    bgClass: 'bg-purple-50',
    textClass: 'text-purple-600',
    borderClass: 'border-purple-200',
    pinBadgeClass: 'bg-purple-500',
    iconName: 'Biohazard',
  },
  fasilitas: {
    id: 'fasilitas',
    name: 'Fasilitas Umum',
    description: 'Halte bus, jembatan penyeberangan (JPO), rambu roboh',
    colorHex: '#6366F1',
    bgClass: 'bg-indigo-50',
    textClass: 'text-indigo-600',
    borderClass: 'border-indigo-200',
    pinBadgeClass: 'bg-indigo-500',
    iconName: 'Building2',
  },
  lainnya: {
    id: 'lainnya',
    name: 'Kategori Lainnya',
    description: 'Masalah fasilitas publik lainnya yang dapat Anda kustom sendiri',
    colorHex: '#0D9488',
    bgClass: 'bg-teal-50',
    textClass: 'text-teal-600',
    borderClass: 'border-teal-200',
    pinBadgeClass: 'bg-teal-500',
    iconName: 'Sparkles',
  },
};

export const STATUS_CONFIG: Record<ReportStatus, { label: string; bg: string; text: string; dot: string }> = {
  pending: {
    label: 'Menunggu Verifikasi',
    bg: 'bg-amber-50 border-amber-200',
    text: 'text-amber-800',
    dot: 'bg-amber-500',
  },
  in_progress: {
    label: 'Sedang Ditindaklanjuti',
    bg: 'bg-blue-50 border-blue-200',
    text: 'text-blue-800',
    dot: 'bg-blue-500',
  },
  resolved: {
    label: 'Selesai Ditangani',
    bg: 'bg-emerald-50 border-emerald-200',
    text: 'text-emerald-800',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Ditolak / Tidak Valid',
    bg: 'bg-slate-100 border-slate-200',
    text: 'text-slate-600',
    dot: 'bg-slate-400',
  },
};

export const STATUS_OPTIONS = [
  { id: 'all', label: 'Semua Status', dotClass: 'bg-slate-400' },
  { id: 'pending', label: 'Menunggu Verifikasi', dotClass: 'bg-amber-500' },
  { id: 'in_progress', label: 'Sedang Ditangani', dotClass: 'bg-blue-500' },
  { id: 'resolved', label: 'Selesai Ditangani', dotClass: 'bg-emerald-500' },
] as const;

export const LEGEND_SHORT_NAMES: Record<string, string> = {
  jalan: 'Jalan Rusak',
  pju: 'Penerangan',
  banjir: 'Banjir',
  sampah: 'Kebersihan',
  limbah: 'Limbah',
  fasilitas: 'Fasilitas',
  lainnya: 'Lainnya',
};
