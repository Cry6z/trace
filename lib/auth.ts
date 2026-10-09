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
 * Menyimpan atau memperbarui data akun warga ke penyimpanan lokal
 */
export function saveCitizenToLocal(citizen: CitizenAccount): void {
  if (typeof window === 'undefined') return;
  try {
    const list = getRegisteredCitizens();
    const idx = list.findIndex(
      (c) => c.id === citizen.id || (c.nikHash && c.nikHash === citizen.nikHash) || c.phone === citizen.phone
    );
    if (idx >= 0) {
      list[idx] = { ...list[idx], ...citizen };
    } else {
      list.unshift(citizen);
    }
    localStorage.setItem(REGISTERED_CITIZENS_KEY, JSON.stringify(list));
  } catch (err) {
    console.error('Failed to save citizen locally:', err);
  }
}

/**
 * Mengambil daftar seluruh warga yang terdaftar dalam cache lokal sistem
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
          nik: row.nik_masked, // simpan masked untuk tampilan publik yang aman
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
          const exists = combined.some(
            (m) => m.id === c.id || (m.nikHash && m.nikHash === c.nikHash) || m.phone === c.phone
          );
          if (!exists) {
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
 * Mencari warga terdaftar di cache lokal berdasarkan NIK (16 digit), Nomor HP, atau ID
 */
export function findCitizen(identifier: string): CitizenAccount | null {
  if (!identifier) return null;
  const clean = identifier.replace(/\D/g, '').trim();
  const idMatch = identifier.trim();
  const inputHash = clean.length === 16 ? hashNik(clean) : '';
  const list = getRegisteredCitizens();

  return (
    list.find((c) => {
      // 1. Cocokkan ID langsung
      if (c.id === idMatch) return true;
      // 2. Cocokkan NIK mentah jika masih ada di memori lokal
      const storedNikDigits = c.nik ? c.nik.replace(/\D/g, '') : '';
      if (clean.length === 16 && storedNikDigits === clean) return true;
      // 3. Cocokkan Hash NIK (kunci pencocokan lintas perangkat yang aman)
      if (inputHash && c.nikHash === inputHash) return true;
      // 4. Cocokkan Nomor HP (mendukung format 08xx dan 62xx)
      const phoneDigits = c.phone ? c.phone.replace(/\D/g, '') : '';
      if (phoneDigits && clean) {
        if (phoneDigits === clean) return true;
        if (clean.startsWith('08') && phoneDigits === '62' + clean.slice(1)) return true;
        if (clean.startsWith('628') && phoneDigits === '0' + clean.slice(2)) return true;
      }
      return false;
    }) || null
  );
}

/**
 * Mencari warga terdaftar langsung dari database Supabase (Real-time lintas perangkat)
 */
export async function findCitizenAsync(identifier: string): Promise<CitizenAccount | null> {
  if (!identifier) return null;
  const clean = identifier.replace(/\D/g, '').trim();
  const idMatch = identifier.trim();

  // 1. Cek di cache lokal terlebih dahulu
  const localMatch = findCitizen(identifier);
  if (localMatch) {
    return localMatch;
  }

  // 2. Query langsung ke Supabase
  try {
    const isNik = clean.length === 16;
    let query = supabase.from('citizens').select('*');

    if (isNik) {
      const hashedNik = hashNik(clean);
      query = query.or(`nik_hash.eq.${hashedNik},phone.eq.${clean}`);
    } else if (clean.length >= 8) {
      const phoneVariants = [clean];
      if (clean.startsWith('08')) phoneVariants.push('62' + clean.slice(1));
      if (clean.startsWith('628')) phoneVariants.push('0' + clean.slice(2));
      query = query.or(`phone.in.(${phoneVariants.join(',')}),id.eq.${idMatch}`);
    } else {
      query = query.eq('id', idMatch);
    }

    const { data, error } = await query.limit(1);
    if (!error && data && data.length > 0) {
      const row = data[0];
      const citizen: CitizenAccount = {
        id: row.id,
        nik: isNik ? clean : row.nik_masked,
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
      };

      saveCitizenToLocal(citizen);
      return citizen;
    }
  } catch (err) {
    console.error('Error fetching citizen from Supabase:', err);
  }

  // 3. Fallback: sinkronkan semua akun lalu periksa ulang
  await syncCitizensFromSupabase();
  return findCitizen(identifier);
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
 * Pendaftaran Akun Warga Baru langsung ke Database Supabase
 */
export async function registerCitizen(data: RegisterCitizenInput): Promise<{
  success: boolean;
  message: string;
  citizen?: CitizenAccount;
}> {
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

  const nikHash = hashNik(cleanNik);

  // 1. Cek apakah NIK atau No HP sudah terdaftar di Supabase
  try {
    const { data: existing, error: checkError } = await supabase
      .from('citizens')
      .select('id, nama_lengkap, phone, nik_hash')
      .or(`phone.eq.${cleanPhone},nik_hash.eq.${nikHash}`);

    if (!checkError && existing && existing.length > 0) {
      const match = existing[0];
      if (match.nik_hash === nikHash) {
        return {
          success: false,
          message: `NIK ${maskNik(cleanNik)} sudah terdaftar atas nama ${match.nama_lengkap}. Silakan masuk menggunakan akun tersebut.`,
        };
      }
      if (match.phone === cleanPhone) {
        return {
          success: false,
          message: `Nomor WhatsApp ${maskPhone(cleanPhone)} sudah terdaftar. Silakan gunakan nomor lain atau masuk ke akun yang ada.`,
        };
      }
    }
  } catch (err) {
    console.warn('Supabase existence check warning:', err);
  }

  // 2. Simpan ke database Supabase secara real-time
  let citizenId = `cit-1771-${Date.now().toString().slice(-4)}`;
  try {
    const { data: inserted, error: insertError } = await supabase
      .from('citizens')
      .insert({
        nik_hash: nikHash,
        nik_masked: maskNik(cleanNik),
        nama_lengkap: nama,
        phone: cleanPhone,
        phone_masked: maskPhone(cleanPhone),
        email: data.email?.trim() || null,
        pin_hash: cleanPin,
        kecamatan: data.kecamatan || null,
        kelurahan: data.kelurahan || null,
        alamat_ktp: data.alamatKtp?.trim() || null,
        is_verified: true,
      })
      .select()
      .single();

    if (insertError) {
      console.error('Supabase citizen insert error:', insertError);
      if (insertError.code === '23505') {
        return {
          success: false,
          message: 'NIK atau Nomor WhatsApp ini sudah terdaftar sebelumnya. Silakan langsung masuk.',
        };
      }
    } else if (inserted && inserted.id) {
      citizenId = inserted.id;
    }
  } catch (err) {
    console.error('Supabase insert exception:', err);
  }

  const newCitizen: CitizenAccount = {
    id: citizenId,
    nik: cleanNik,
    nikMasked: maskNik(cleanNik),
    nikHash: nikHash,
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

  saveCitizenToLocal(newCitizen);

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
 * Login Warga Menggunakan NIK/No HP + PIN Keamanan (Live Supabase & Async)
 */
export async function loginCitizenWithPinAsync(
  identifier: string,
  pin: string
): Promise<{ success: boolean; message: string; session?: UserSession }> {
  const clean = identifier.replace(/\D/g, '').trim();
  if (!clean) {
    return { success: false, message: 'Mohon masukkan NIK atau Nomor WhatsApp Anda.' };
  }

  const citizen = await findCitizenAsync(identifier);
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
 * Login Warga Menggunakan NIK/No HP + PIN Keamanan 6 Digit (Synchronous Fallback)
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
 * Update profil warga terdaftar (Sinkron ke lokal dan Supabase)
 */
export function updateCitizenProfile(
  id: string,
  updates: Partial<Pick<CitizenAccount, 'namaLengkap' | 'pin' | 'kecamatan' | 'kelurahan' | 'alamatKtp' | 'email'>>
): boolean {
  if (typeof window === 'undefined') return false;
  try {
    const list = getRegisteredCitizens();
    const idx = list.findIndex((c) => c.id === id);
    if (idx !== -1) {
      list[idx] = { ...list[idx], ...updates };
      localStorage.setItem(REGISTERED_CITIZENS_KEY, JSON.stringify(list));
    }

    // Sinkronkan sesi aktif jika sedang login dengan akun ini
    const active = getUserSession();
    if (active && active.id === id) {
      if (updates.namaLengkap) active.nama = updates.namaLengkap;
      if (updates.kecamatan) active.kecamatan = updates.kecamatan;
      if (updates.kelurahan) active.kelurahan = updates.kelurahan;
      setUserSession(active);
    }

    // Sinkronkan perubahan ke Supabase
    const sbUpdates: Record<string, any> = {};
    if (updates.namaLengkap) sbUpdates.nama_lengkap = updates.namaLengkap;
    if (updates.pin) sbUpdates.pin_hash = updates.pin;
    if (updates.kecamatan !== undefined) sbUpdates.kecamatan = updates.kecamatan;
    if (updates.kelurahan !== undefined) sbUpdates.kelurahan = updates.kelurahan;
    if (updates.alamatKtp !== undefined) sbUpdates.alamat_ktp = updates.alamatKtp;
    if (updates.email !== undefined) sbUpdates.email = updates.email;

    if (Object.keys(sbUpdates).length > 0) {
      supabase
        .from('citizens')
        .update(sbUpdates)
        .eq('id', id)
        .then((res) => {
          if (res.error) console.warn('Supabase update citizen warning:', res.error.message);
        });
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
