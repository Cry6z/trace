'use client';

import { maskNik, maskPhone, hashNik } from '@/lib/security/nikCrypto';
import { verifyOtp, requestOtp } from '@/lib/security/otpService';
import { supabase } from '@/lib/supabaseClient';

export interface CitizenAccount {
  id: string;
  nik: string; // 16 digit angka KTP
  nikMasked: string; // misal: 1771**********01
  nikHash: string;
  namaLengkap: string;
  phone: string; // Nomor WhatsApp / HP
  phoneMasked: string; // misal: 0812****7890
  email?: string;
  pin: string; // 6 digit PIN pengaman akun
  kecamatan?: string; // Domisili Bengkulu (opsional)
  kelurahan?: string;
  alamatKtp?: string;
  isVerified: boolean;
  createdAt: string;
}

export interface UserSession {
  id?: string;
  nama: string;
  nikMasked: string;
  phoneMasked: string;
  nikHash?: string;
  kecamatan?: string;
  kelurahan?: string;
  isLoggedIn?: boolean;
  loginAt?: string;
}

const STORAGE_KEY = 'trace_user';
const REGISTERED_CITIZENS_KEY = 'trace_registered_citizens';
export const AUTH_CHANGE_EVENT = 'trace_auth_changed';

// Akun bawaan dummy telah dihapus. Seluruh akun warga murni berasal dari pendaftaran mandiri warga.
export const INITIAL_REGISTERED_CITIZENS: CitizenAccount[] = [];

const DUMMY_CITIZEN_IDS = new Set([
  'cit-1771-001',
  'cit-1771-002',
  'cit-1771-003',
  'aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa',
  'bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb',
  'cccccccc-cccc-cccc-cccc-cccccccccccc',
]);
const DUMMY_PHONES = new Set(['081234567890', '085273112233', '082198765432']);

/**
 * Mengambil daftar seluruh warga yang terdaftar dalam sistem
 */
export function getRegisteredCitizens(): CitizenAccount[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(REGISTERED_CITIZENS_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed)) {
      const realCitizens = parsed.filter(
        (c) => !DUMMY_CITIZEN_IDS.has(c.id) && !DUMMY_PHONES.has(c.phone)
      );
      if (realCitizens.length !== parsed.length) {
        localStorage.setItem(REGISTERED_CITIZENS_KEY, JSON.stringify(realCitizens));
      }
      return realCitizens;
    }
    return [];
  } catch (err) {
    console.error('Failed to get registered citizens:', err);
    return [];
  }
}

/**
 * Mengambil dan mensinkronkan daftar warga dari Supabase ke penyimpanan lokal
 */
export async function syncCitizensFromSupabase(): Promise<CitizenAccount[]> {
  try {
    const { data, error } = await supabase.from('citizens').select('*');
    if (!error && data && data.length > 0) {
      const mapped: CitizenAccount[] = data
        .filter((row) => !DUMMY_CITIZEN_IDS.has(row.id) && !DUMMY_PHONES.has(row.phone))
        .map((row) => ({
          id: row.id,
          nik: row.nik_hash || '1771000000000000',
          nikMasked: row.nik_masked,
          nikHash: row.nik_hash,
          namaLengkap: row.nama_lengkap,
          phone: row.phone,
          phoneMasked: row.phone_masked,
          email: row.email || undefined,
          pin: row.pin_hash || '123456',
          kecamatan: row.kecamatan || undefined,
          kelurahan: row.kelurahan || undefined,
          alamatKtp: row.alamat_ktp || undefined,
          isVerified: row.is_verified ?? true,
          createdAt: row.created_at,
        }));

      if (typeof window !== 'undefined') {
        const current = getRegisteredCitizens();
        const combined = [...mapped];
        for (const c of current) {
          if (!combined.some((m) => m.phone === c.phone || m.nik === c.nik)) {
            combined.push(c);
          }
        }
        localStorage.setItem(REGISTERED_CITIZENS_KEY, JSON.stringify(combined));
        return combined;
      }
      return mapped;
    }
  } catch (err) {
    console.error('Failed to sync citizens from Supabase:', err);
  }
  return getRegisteredCitizens();
}

/**
 * Mencari warga terdaftar berdasarkan NIK (16 digit) atau Nomor HP
 */
export function findCitizen(identifier: string): CitizenAccount | null {
  if (!identifier) return null;
  const clean = identifier.replace(/\D/g, '').trim();
  const list = getRegisteredCitizens();

  return (
    list.find((c) => {
      const citizenNik = c.nik.replace(/\D/g, '');
      const citizenPhone = c.phone.replace(/\D/g, '');
      return citizenNik === clean || citizenPhone === clean;
    }) || null
  );
}

export interface RegisterCitizenInput {
  namaLengkap: string;
  nik: string;
  phone: string;
  email?: string;
  pin: string;
  kecamatan?: string;
  kelurahan?: string;
  alamatKtp?: string;
}

/**
 * Pendaftaran Akun Warga Baru
 */
export function registerCitizen(data: RegisterCitizenInput): {
  success: boolean;
  message: string;
  citizen?: CitizenAccount;
} {
  const cleanNik = data.nik.replace(/\D/g, '');
  const cleanPhone = data.phone.replace(/\D/g, '');
  const cleanPin = data.pin.replace(/\D/g, '');
  const nama = data.namaLengkap.trim();

  if (nama.length < 3) {
    return { success: false, message: 'Nama lengkap wajib diisi minimal 3 karakter sesuai KTP.' };
  }

  if (cleanNik.length !== 16) {
    return { success: false, message: 'NIK harus berjumlah tepat 16 digit angka sesuai e-KTP.' };
  }

  if (cleanPhone.length < 10 || cleanPhone.length > 14) {
    return { success: false, message: 'Nomor WhatsApp / HP tidak valid (10-14 digit).' };
  }

  if (cleanPin.length !== 6) {
    return { success: false, message: 'PIN keamanan harus berjumlah tepat 6 digit angka.' };
  }

  const list = getRegisteredCitizens();

  // Cek apakah NIK sudah pernah terdaftar
  const existingNik = list.find((c) => c.nik.replace(/\D/g, '') === cleanNik);
  if (existingNik) {
    return {
      success: false,
      message: `NIK ${maskNik(cleanNik)} sudah terdaftar atas nama ${existingNik.namaLengkap}. Silakan masuk menggunakan akun tersebut.`,
    };
  }

  // Cek apakah No HP sudah pernah terdaftar
  const existingPhone = list.find((c) => c.phone.replace(/\D/g, '') === cleanPhone);
  if (existingPhone) {
    return {
      success: false,
      message: `Nomor WhatsApp ${maskPhone(cleanPhone)} sudah terdaftar. Silakan gunakan nomor lain atau masuk ke akun yang ada.`,
    };
  }

  const newCitizen: CitizenAccount = {
    id: `cit-1771-${Date.now().toString().slice(-4)}`,
    nik: cleanNik,
    nikMasked: maskNik(cleanNik),
    nikHash: hashNik(cleanNik),
    namaLengkap: nama,
    phone: cleanPhone,
    phoneMasked: maskPhone(cleanPhone),
    email: data.email?.trim() || undefined,
    pin: cleanPin,
    kecamatan: data.kecamatan || undefined,
    kelurahan: data.kelurahan || undefined,
    alamatKtp: data.alamatKtp?.trim() || undefined,
    isVerified: true,
    createdAt: new Date().toISOString(),
  };

  list.unshift(newCitizen);

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(REGISTERED_CITIZENS_KEY, JSON.stringify(list));
    } catch (err) {
      console.error('Failed to save registered citizen:', err);
      return { success: false, message: 'Gagal menyimpan data akun ke penyimpanan lokal.' };
    }
  }

  // Sinkronkan akun baru ke database Supabase secara real-time
  try {
    supabase.from('citizens').insert({
      nik_hash: newCitizen.nikHash,
      nik_masked: newCitizen.nikMasked,
      nama_lengkap: newCitizen.namaLengkap,
      phone: newCitizen.phone,
      phone_masked: newCitizen.phoneMasked,
      email: newCitizen.email || null,
      pin_hash: newCitizen.pin,
      kecamatan: newCitizen.kecamatan || null,
      kelurahan: newCitizen.kelurahan || null,
      alamat_ktp: newCitizen.alamatKtp || null,
      is_verified: true,
    }).then((res) => {
      if (res.error) console.warn('Supabase citizen insert warning:', res.error.message);
    });
  } catch (err) {
    console.warn('Supabase async sync citizen error:', err);
  }

  // Buat sesi otomatis setelah daftar
  const session: UserSession = {
    id: newCitizen.id,
    nama: newCitizen.namaLengkap,
    nikMasked: newCitizen.nikMasked,
    phoneMasked: newCitizen.phoneMasked,
    nikHash: newCitizen.nikHash,
    kecamatan: newCitizen.kecamatan,
    kelurahan: newCitizen.kelurahan,
    isLoggedIn: true,
    loginAt: new Date().toISOString(),
  };
  setUserSession(session);

  return {
    success: true,
    message: 'Pendaftaran akun warga berhasil diverifikasi!',
    citizen: newCitizen,
  };
}

/**
 * Login Warga Menggunakan NIK/No HP + PIN Keamanan 6 Digit
 */
export function loginCitizenWithPin(
  identifier: string,
  pin: string
): { success: boolean; message: string; session?: UserSession } {
  const clean = identifier.replace(/\D/g, '').trim();
  if (!clean) {
    return { success: false, message: 'Mohon masukkan NIK atau Nomor WhatsApp Anda.' };
  }

  const citizen = findCitizen(clean);
  if (!citizen) {
    return {
      success: false,
      message: 'Identitas NIK atau No HP ini belum terdaftar dalam TRACE. Silakan daftar akun warga terlebih dahulu.',
    };
  }

  const cleanPin = pin.replace(/\D/g, '').trim();
  if (cleanPin !== citizen.pin) {
    return { success: false, message: 'PIN keamanan 6 digit yang Anda masukkan tidak sesuai.' };
  }

  const session: UserSession = {
    id: citizen.id,
    nama: citizen.namaLengkap,
    nikMasked: citizen.nikMasked,
    phoneMasked: citizen.phoneMasked,
    nikHash: citizen.nikHash,
    kecamatan: citizen.kecamatan,
    kelurahan: citizen.kelurahan,
    isLoggedIn: true,
    loginAt: new Date().toISOString(),
  };

  setUserSession(session);
  return { success: true, message: `Selamat datang kembali, ${citizen.namaLengkap}!`, session };
}

/**
 * Login Warga Menggunakan NIK/No HP + Kode OTP
 */
export function loginCitizenWithOtp(
  identifier: string,
  otpCode: string
): { success: boolean; message: string; session?: UserSession } {
  const clean = identifier.replace(/\D/g, '').trim();
  if (!clean) {
    return { success: false, message: 'Mohon masukkan NIK atau Nomor WhatsApp Anda.' };
  }

  const citizen = findCitizen(clean);
  if (!citizen) {
    return {
      success: false,
      message: 'Identitas NIK atau No HP ini belum terdaftar dalam TRACE. Silakan daftar akun warga terlebih dahulu.',
    };
  }

  const verifyRes = verifyOtp(citizen.phone, otpCode);
  if (!verifyRes.success) {
    return { success: false, message: verifyRes.message };
  }

  const session: UserSession = {
    id: citizen.id,
    nama: citizen.namaLengkap,
    nikMasked: citizen.nikMasked,
    phoneMasked: citizen.phoneMasked,
    nikHash: citizen.nikHash,
    kecamatan: citizen.kecamatan,
    kelurahan: citizen.kelurahan,
    isLoggedIn: true,
    loginAt: new Date().toISOString(),
  };

  setUserSession(session);
  return { success: true, message: `Verifikasi OTP berhasil. Selamat datang, ${citizen.namaLengkap}!`, session };
}

/**
 * Update profil warga terdaftar
 */
export function updateCitizenProfile(
  id: string,
  updates: Partial<Pick<CitizenAccount, 'namaLengkap' | 'pin' | 'kecamatan' | 'kelurahan' | 'alamatKtp' | 'email'>>
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getRegisteredCitizens();
    const idx = list.findIndex((c) => c.id === id);
    if (idx === -1) return false;

    list[idx] = { ...list[idx], ...updates };
    localStorage.setItem(REGISTERED_CITIZENS_KEY, JSON.stringify(list));

    // Sinkronkan sesi aktif jika sedang login dengan akun ini
    const active = getUserSession();
    if (active && active.id === id) {
      if (updates.namaLengkap) active.nama = updates.namaLengkap;
      if (updates.kecamatan) active.kecamatan = updates.kecamatan;
      if (updates.kelurahan) active.kelurahan = updates.kelurahan;
      setUserSession(active);
    }
    return true;
  } catch {
    return false;
  }
}

/**
 * Mengambil sesi pengguna saat ini dari sessionStorage atau localStorage
 */
export function getUserSession(): UserSession | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY) || localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    return parsed && typeof parsed.nama === 'string' && parsed.nama.trim().length > 0 ? parsed : null;
  } catch {
    return null;
  }
}

/**
 * Menyimpan sesi pengguna ke storage dan menyiarkan event perubahan
 */
export function setUserSession(user: UserSession): void {
  if (typeof window === 'undefined') return;
  try {
    const serialized = JSON.stringify(user);
    sessionStorage.setItem(STORAGE_KEY, serialized);
    localStorage.setItem(STORAGE_KEY, serialized);
    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to set user session:', err);
  }
}

/**
 * Menghapus seluruh sesi pengguna (Logout) dengan aman dan membersihkan efek scroll
 */
export function logoutUser(): void {
  if (typeof window === 'undefined') return;
  try {
    sessionStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(STORAGE_KEY);

    // Pastikan scroll body tidak terkunci jika ada modal yang tertinggal
    if (typeof document !== 'undefined' && document.body) {
      document.body.style.overflow = '';
    }

    window.dispatchEvent(new Event(AUTH_CHANGE_EVENT));
  } catch (err) {
    console.error('Failed to clear user session:', err);
  }
}
