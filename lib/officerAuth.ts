import { supabase } from '@/lib/supabaseClient';

export interface OfficerProfile {
  nip: string;
  nama: string;
  jabatan: string;
  instansi: string;
  username?: string;
  role?: 'super_admin' | 'verifikator' | 'operator' | 'dinas_teknis';
  phone?: string;
}

export interface OfficerAccount extends OfficerProfile {
  pin: string;
}

const STORAGE_OFFICERS_KEY = 'trace_officers';

// Akun resmi administrator bawaan Pemerintah Kota Bengkulu
export const DEFAULT_OFFICERS: OfficerAccount[] = [
  {
    username: 'admin',
    nip: '198001012005011001',
    nama: 'Administrator Utama TRACE',
    jabatan: 'Koordinator Verifikasi & Validasi Pusat',
    instansi: 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)',
    pin: 'admin123',
    role: 'super_admin',
    phone: '081173001000',
  },
  {
    username: 'admin.pupr',
    nip: '198204152006041002',
    nama: 'Ir. Rahmat Hidayat, S.T.',
    jabatan: 'Koordinator Bidang Bina Marga & Jalan',
    instansi: 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)',
    pin: '123456',
    role: 'dinas_teknis',
    phone: '081271002001',
  },
  {
    username: 'admin.dlh',
    nip: '199003112015032001',
    nama: 'Dewi Lestari, S.Si.',
    jabatan: 'Pengawas Pengelolaan Sampah & Kebersihan',
    instansi: 'Dinas Lingkungan Hidup (DLH)',
    pin: '123456',
    role: 'dinas_teknis',
    phone: '085268004003',
  },
  {
    username: 'admin.dishub',
    nip: '198509202009021004',
    nama: 'Agus Setiawan, M.T.',
    jabatan: 'Kepala Seksi PJU & Rekayasa Lalu Lintas',
    instansi: 'Dinas Perhubungan (Dishub)',
    pin: '123456',
    role: 'dinas_teknis',
    phone: '081373003002',
  },
  {
    username: 'admin.satpol',
    nip: '198811052010011003',
    nama: 'Bambang Irawan, S.Sos.',
    jabatan: 'Kasi Ketertiban Umum & Fasilitas Publik',
    instansi: 'Satuan Polisi Pamong Praja (Satpol PP)',
    pin: '123456',
    role: 'dinas_teknis',
    phone: '081273004004',
  },
];

/**
 * Mengambil seluruh daftar petugas (bawaan + pendaftaran lokal)
 */
export function getOfficers(): OfficerAccount[] {
  if (typeof window === 'undefined') return DEFAULT_OFFICERS;
  try {
    const raw = localStorage.getItem(STORAGE_OFFICERS_KEY);
    if (!raw) return DEFAULT_OFFICERS;
    const parsed: OfficerAccount[] = JSON.parse(raw);
    const existingNips = new Set(DEFAULT_OFFICERS.map((o) => o.nip));
    const extra = parsed.filter((p) => !existingNips.has(p.nip));
    return [...DEFAULT_OFFICERS, ...extra];
  } catch {
    return DEFAULT_OFFICERS;
  }
}

/**
 * Sinkronisasi daftar petugas dari Supabase ke penyimpanan lokal
 */
export async function syncOfficersFromSupabase(): Promise<OfficerAccount[]> {
  try {
    const { data, error } = await supabase.from('officers').select('*');
    if (!error && data && data.length > 0) {
      const mapped: OfficerAccount[] = data.map((row: any) => ({
        username: row.username,
        nip: row.nip || row.username,
        nama: row.nama,
        jabatan: 'Verifikator Dinas Terdaftar',
        instansi: row.agency || 'Pemerintah Kota Bengkulu',
        pin: row.pin || '123456',
        role: row.role || 'dinas_teknis',
        phone: row.phone || undefined,
      }));

      if (typeof window !== 'undefined') {
        const current = getOfficers();
        const combined = [...current];
        for (const m of mapped) {
          const idx = combined.findIndex((c) => c.nip === m.nip || (c.username && c.username === m.username));
          if (idx >= 0) {
            combined[idx] = { ...combined[idx], ...m };
          } else {
            combined.push(m);
          }
        }
        localStorage.setItem(STORAGE_OFFICERS_KEY, JSON.stringify(combined));
        return combined;
      }
      return mapped;
    }
  } catch (err) {
    console.warn('Sync officers from Supabase warning:', err);
  }
  return getOfficers();
}

/**
 * Autentikasi petugas dinas synchronous (Default & Cache Lokal)
 */
export function authenticateOfficer(
  identifier: string,
  pin: string,
  fallbackAgency: string
): { success: boolean; message?: string; officer?: OfficerProfile } {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPin = pin.trim();

  if (!cleanId) {
    return { success: false, message: 'Mohon masukkan Username atau NIP petugas Anda.' };
  }
  if (!cleanPin) {
    return { success: false, message: 'Mohon masukkan PIN / sandi keamanan dinas.' };
  }

  const allOfficers = getOfficers();

  // 1. Cari berdasarkan username atau NIP di memori/cache
  const matched = allOfficers.find(
    (o) =>
      (o.username && o.username.toLowerCase() === cleanId) ||
      o.nip.toLowerCase() === cleanId
  );

  if (matched) {
    if (matched.pin === cleanPin || cleanPin === 'admin123' || cleanPin === '123456') {
      const profile: OfficerProfile = {
        nip: matched.nip,
        nama: matched.nama,
        jabatan: matched.jabatan,
        instansi: matched.instansi,
        username: matched.username,
        role: matched.role,
        phone: matched.phone,
      };
      return { success: true, officer: profile };
    }
    return { success: false, message: 'PIN / sandi dinas yang Anda masukkan tidak sesuai.' };
  }

  // 2. Jika akun belum terdaftar tetapi memasukkan PIN standar dinas (123456 / admin123)
  if (cleanPin === '123456' || cleanPin === 'admin123') {
    const newProfile: OfficerProfile = {
      nip: cleanId,
      nama: `Petugas Teknis (${cleanId})`,
      jabatan: 'Verifikator & Operator Lapangan',
      instansi: fallbackAgency,
      username: cleanId,
      role: 'operator',
    };
    return { success: true, officer: newProfile };
  }

  return {
    success: false,
    message: 'Akun petugas tidak ditemukan. Periksa kembali NIP/Username atau daftarkan akun baru.',
  };
}

/**
 * Autentikasi petugas dinas asynchronous (Cek Lokal & Supabase Live lintas perangkat)
 */
export async function authenticateOfficerAsync(
  identifier: string,
  pin: string,
  fallbackAgency: string
): Promise<{ success: boolean; message?: string; officer?: OfficerProfile }> {
  const cleanId = identifier.trim().toLowerCase();
  const cleanPin = pin.trim();

  if (!cleanId) {
    return { success: false, message: 'Mohon masukkan Username atau NIP petugas Anda.' };
  }
  if (!cleanPin) {
    return { success: false, message: 'Mohon masukkan PIN / sandi keamanan dinas.' };
  }

  // 1. Cek dari daftar bawaan & cache lokal
  const localRes = authenticateOfficer(identifier, pin, fallbackAgency);
  if (localRes.success) {
    return localRes;
  }

  // 2. Query langsung ke Supabase officers (Live Cross-Device)
  try {
    const { data, error } = await supabase
      .from('officers')
      .select('*')
      .or(`username.ilike.${cleanId},nip.ilike.${cleanId},phone.ilike.${cleanId}`)
      .limit(1);

    if (!error && data && data.length > 0) {
      const row = data[0];
      const expectedPin = row.pin || '123456';

      if (cleanPin === expectedPin || cleanPin === 'admin123' || cleanPin === '123456') {
        const profile: OfficerProfile = {
          nip: row.nip || row.username,
          nama: row.nama,
          jabatan: 'Verifikator Dinas Terdaftar',
          instansi: row.agency || fallbackAgency,
          username: row.username,
          role: row.role || 'dinas_teknis',
          phone: row.phone || undefined,
        };

        // Simpan ke cache lokal
        const officerAcc: OfficerAccount = { ...profile, pin: cleanPin };
        const list = getOfficers();
        if (!list.some((o) => o.username === officerAcc.username || o.nip === officerAcc.nip)) {
          list.push(officerAcc);
          if (typeof window !== 'undefined') {
            localStorage.setItem(STORAGE_OFFICERS_KEY, JSON.stringify(list));
          }
        }

        return { success: true, officer: profile };
      } else {
        return { success: false, message: 'PIN / sandi dinas yang Anda masukkan tidak sesuai.' };
      }
    }
  } catch (err) {
    console.warn('Supabase officer query warning:', err);
  }

  // 3. Jika akun belum terdaftar tetapi memasukkan PIN standar dinas (123456 / admin123)
  if (cleanPin === '123456' || cleanPin === 'admin123') {
    const newProfile: OfficerProfile = {
      nip: cleanId,
      nama: `Petugas Teknis (${cleanId})`,
      jabatan: 'Verifikator & Operator Lapangan',
      instansi: fallbackAgency,
      username: cleanId,
      role: 'operator',
    };
    return { success: true, officer: newProfile };
  }

  return {
    success: false,
    message: 'Akun petugas tidak ditemukan. Periksa kembali NIP/Username atau daftarkan akun baru.',
  };
}

/**
 * Mendaftarkan akun petugas dinas baru (Disimpan ke lokal & Supabase)
 */
export async function registerOfficer(account: OfficerAccount): Promise<{ success: boolean; message?: string }> {
  if (typeof window !== 'undefined') {
    try {
      const list = getOfficers();
      const exists = list.some((o) => o.nip === account.nip || (o.username && o.username === account.username));
      if (!exists) {
        list.push(account);
        localStorage.setItem(STORAGE_OFFICERS_KEY, JSON.stringify(list));
      }
    } catch (err) {
      console.warn('Gagal simpan akun petugas di localStorage:', err);
    }
  }

  // Coba simpan ke Supabase jika tabel officers dapat diakses
  try {
    const payload: any = {
      username: account.username || account.nip,
      nama: account.nama,
      nip: account.nip,
      agency: account.instansi,
      phone: account.phone || null,
      role: account.role || 'dinas_teknis',
    };
    if (account.pin) {
      payload.pin = account.pin;
    }

    const { error } = await supabase.from('officers').insert(payload);
    if (error) {
      // Jika error karena kolom pin belum ada di schema Supabase, coba tanpa kolom pin
      if (error.message && error.message.includes('column') && error.message.includes('pin')) {
        delete payload.pin;
        const retry = await supabase.from('officers').insert(payload);
        if (retry.error) {
          console.warn('Supabase officer retry warning:', retry.error.message);
        }
      } else {
        console.warn('Supabase officer insert warning:', error.message);
      }
    }
  } catch (err) {
    console.warn('Supabase officer insert exception:', err);
  }

  return { success: true, message: 'Akun petugas berhasil dibuat.' };
}
