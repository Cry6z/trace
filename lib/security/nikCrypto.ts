import crypto from 'crypto';

// Pepper rahasia untuk HMAC NIK (di lingkungan produksi, disimpan di process.env.NIK_SECRET_PEPPER)
const NIK_PEPPER = process.env.NIK_SECRET_PEPPER || 'trace-secure-pepper-salt-2026-indonesia-pdp';
const ENCRYPTION_KEY = process.env.NIK_ENCRYPTION_KEY || '0123456789abcdef0123456789abcdef'; // 32 bytes hex/string
const ALGORITHM = 'aes-256-gcm';

/**
 * Hash satu arah untuk NIK menggunakan HMAC-SHA256 + Pepper.
 * Digunakan untuk identifikasi duplikasi tanpa menyimpan NIK mentah.
 */
export function hashNik(nik: string): string {
  if (!nik) return '';
  const cleanNik = nik.replace(/\D/g, '').trim();
  return crypto.createHmac('sha256', NIK_PEPPER).update(cleanNik).digest('hex');
}

/**
 * Masking NIK agar ramah privasi di antarmuka (Client-side & Server-side).
 * Contoh input: '3171021405900001' -> Output: '3171**********01'
 */
export function maskNik(nik: string): string {
  if (!nik) return '';
  const clean = nik.replace(/\D/g, '');
  if (clean.length < 6) return clean;
  const first = clean.slice(0, 4);
  const last = clean.slice(-2);
  const maskedCount = Math.max(clean.length - 6, 6);
  return `${first}${'*'.repeat(maskedCount)}${last}`;
}

/**
 * Masking Nomor Telepon/WhatsApp
 * Contoh input: '081234567890' -> Output: '0812****7890'
 */
export function maskPhone(phone: string): string {
  if (!phone) return '';
  const clean = phone.replace(/\D/g, '');
  if (clean.length < 8) return clean;
  const first = clean.slice(0, 4);
  const last = clean.slice(-4);
  return `${first}****${last}`;
}

/**
 * Enkripsi reversible dengan AES-256-GCM jika data NIK wajib disimpan 
 * untuk integrasi instansi pemerintah/Dukcapil.
 */
export function encryptNik(nik: string): string {
  const iv = crypto.randomBytes(12);
  const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
  const cipher = crypto.createCipheriv(ALGORITHM, key, iv);
  
  let encrypted = cipher.update(nik.trim(), 'utf8', 'hex');
  encrypted += cipher.final('hex');
  const tag = cipher.getAuthTag().toString('hex');
  
  // Format: iv:tag:encrypted
  return `${iv.toString('hex')}:${tag}:${encrypted}`;
}

/**
 * Dekripsi NIK dengan verifikasi Authentication Tag (GCM mode)
 */
export function decryptNik(payload: string): string | null {
  try {
    const [ivHex, tagHex, encryptedData] = payload.split(':');
    if (!ivHex || !tagHex || !encryptedData) return null;
    
    const key = crypto.createHash('sha256').update(ENCRYPTION_KEY).digest();
    const iv = Buffer.from(ivHex, 'hex');
    const tag = Buffer.from(tagHex, 'hex');
    
    const decipher = crypto.createDecipheriv(ALGORITHM, key, iv);
    decipher.setAuthTag(tag);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return decrypted;
  } catch {
    return null;
  }
}
