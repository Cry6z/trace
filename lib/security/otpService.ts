import crypto from 'crypto';

interface OtpRecord {
  code: string;
  expiresAt: number;
  attempts: number;
  requestTimes: number[];
}

// In-memory OTP storage (di lingkungan skala multi-server, ini disimpan di Redis)
const otpStore = new Map<string, OtpRecord>();

const OTP_TTL_MS = 3 * 60 * 1000; // 3 menit
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MS = 10 * 60 * 1000; // 10 menit
const MAX_REQUESTS_PER_WINDOW = 3;

export interface RequestOtpResult {
  success: boolean;
  message: string;
  debugCode?: string; // Hanya untuk kemudahan pengujian demo lokal
  cooldownSeconds?: number;
}

export interface VerifyOtpResult {
  success: boolean;
  message: string;
}

/**
 * Generate dan kirim OTP ke nomor HP
 */
export function requestOtp(phoneNumber: string): RequestOtpResult {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  if (cleanPhone.length < 9) {
    return { success: false, message: 'Nomor telepon tidak valid.' };
  }

  const now = Date.now();
  const existing = otpStore.get(cleanPhone);

  // Cek Rate Limiting (Maksimal 3 permintaan per 10 menit)
  if (existing) {
    // Bersihkan request timestamp yang lebih lama dari 10 menit
    const recentRequests = existing.requestTimes.filter(t => now - t < RATE_LIMIT_WINDOW_MS);
    if (recentRequests.length >= MAX_REQUESTS_PER_WINDOW) {
      const oldest = recentRequests[0];
      const waitSeconds = Math.ceil((RATE_LIMIT_WINDOW_MS - (now - oldest)) / 1000);
      return {
        success: false,
        message: `Terlalu banyak permintaan OTP. Silakan coba lagi dalam ${waitSeconds} detik.`,
        cooldownSeconds: waitSeconds,
      };
    }
  }

  // Buat kode 6 digit kriptografis aman
  const randomInt = crypto.randomInt(100000, 999999);
  const code = randomInt.toString();

  const prevRequests = existing ? existing.requestTimes.filter(t => now - t < RATE_LIMIT_WINDOW_MS) : [];

  otpStore.set(cleanPhone, {
    code,
    expiresAt: now + OTP_TTL_MS,
    attempts: 0,
    requestTimes: [...prevRequests, now],
  });

  return {
    success: true,
    message: 'Kode OTP 6-digit berhasil dikirimkan.',
    debugCode: code, // Dipermudah untuk simulasi uji coba langsung
  };
}

/**
 * Verifikasi kode OTP yang dimasukkan pengguna
 */
export function verifyOtp(phoneNumber: string, codeInput: string): VerifyOtpResult {
  const cleanPhone = phoneNumber.replace(/\D/g, '');
  const record = otpStore.get(cleanPhone);

  if (!record) {
    return { success: false, message: 'Kode OTP tidak ditemukan atau belum diminta.' };
  }

  const now = Date.now();
  if (now > record.expiresAt) {
    otpStore.delete(cleanPhone);
    return { success: false, message: 'Kode OTP telah kedaluwarsa. Silakan minta kode baru.' };
  }

  if (record.attempts >= MAX_ATTEMPTS) {
    otpStore.delete(cleanPhone);
    return {
      success: false,
      message: 'Batas percobaan salah terlampaui. Nomor dikunci sementara demi keamanan.',
    };
  }

  if (record.code !== codeInput.trim()) {
    record.attempts += 1;
    const remaining = MAX_ATTEMPTS - record.attempts;
    return {
      success: false,
      message: `Kode OTP salah. Sisa kesempatan: ${remaining} kali.`,
    };
  }

  // Berhasil: Hapus OTP dari memory agar tidak bisa digunakan ulang (one-time)
  otpStore.delete(cleanPhone);
  return { success: true, message: 'Verifikasi berhasil.' };
}
