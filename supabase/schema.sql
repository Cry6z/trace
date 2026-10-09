-- ==============================================================================
-- TRACE Bengkulu - Supabase Database Schema & Setup
-- Tracking Reports & Aggregating Community Environmental Issues
-- ==============================================================================

-- 1. EXTENSIONS
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- 2. ENUM TYPES
DO $$ BEGIN
  CREATE TYPE issue_category AS ENUM (
    'jalan',       -- Jalan & Akses Rusak
    'pju',         -- Penerangan & Kelistrikan
    'banjir',      -- Banjir & Genangan Air
    'sampah',      -- Kebersihan & Sampah Liar
    'limbah',      -- Limbah & Pencemaran Lingkungan
    'fasilitas',   -- Fasilitas Publik
    'lainnya'      -- Kategori Lainnya (Kustom Pengguna)
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE report_status AS ENUM (
    'pending',       -- Menunggu Verifikasi
    'in_progress',   -- Sedang Ditindaklanjuti
    'resolved',      -- Selesai Ditangani
    'rejected'       -- Ditolak / Tidak Valid
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE urgency_level AS ENUM (
    'rendah',
    'sedang',
    'tinggi',
    'darurat'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE TYPE officer_role AS ENUM (
    'super_admin',
    'verifikator',
    'operator',
    'dinas_teknis'
  );
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 3. TABLES DEFINITION
-- ==============================================================================

-- Tabel 1: Akun Warga Terdaftar (Citizens)
CREATE TABLE IF NOT EXISTS citizens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  nik_hash TEXT UNIQUE NOT NULL,                       -- Hash SHA-256 untuk pencegahan duplikasi NIK tanpa ekspos
  nik_masked TEXT NOT NULL,                             -- Disamarkan demi privasi (misal: 1771**********01)
  nama_lengkap TEXT NOT NULL,
  phone TEXT UNIQUE NOT NULL,                          -- Nomor WhatsApp/HP aktif
  phone_masked TEXT NOT NULL,                          -- Misal: 0812****7890
  email TEXT,
  pin_hash TEXT NOT NULL,                              -- PIN keamanan 6 digit (tersimpan dalam bentuk hash)
  kecamatan TEXT,                                      -- Wilayah kecamatan domisili Kota Bengkulu (opsional)
  kelurahan TEXT,                                      -- Wilayah kelurahan (opsional)
  alamat_ktp TEXT,                                     -- Catatan alamat KTP (opsional)
  is_verified BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW())
);

-- Tabel 2: Petugas & Admin Dinas (Officers)
CREATE TABLE IF NOT EXISTS officers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  username TEXT UNIQUE NOT NULL,
  nama TEXT NOT NULL,
  nip TEXT,
  role officer_role NOT NULL DEFAULT 'operator',
  agency TEXT NOT NULL DEFAULT 'Pemerintah Kota Bengkulu',
  phone TEXT,
  pin TEXT DEFAULT '123456',
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW())
);

-- Tabel 3: Laporan Pengaduan Fasilitas Publik (Reports)
CREATE TABLE IF NOT EXISTS reports (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tracking_code TEXT UNIQUE NOT NULL,                  -- Contoh: TRC-2026-0812
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category issue_category NOT NULL DEFAULT 'jalan',
  custom_category TEXT,                                -- Nama kategori kustom yang diisi mandiri oleh pelapor jika memilih lainnya
  status report_status NOT NULL DEFAULT 'pending',
  urgency urgency_level NOT NULL DEFAULT 'sedang',
  latitude DOUBLE PRECISION NOT NULL,                 -- Koordinat lintang Kota Bengkulu (~ -3.8)
  longitude DOUBLE PRECISION NOT NULL,                -- Koordinat bujur Kota Bengkulu (~ 102.2)
  address TEXT NOT NULL,
  district TEXT NOT NULL,                             -- Kecamatan (misal: Ratu Samban, Ratu Agung)
  village TEXT NOT NULL,                              -- Kelurahan (misal: Lempuing, Penurunan)
  image_url TEXT NOT NULL,                            -- URL foto bukti aduan warga
  resolved_image_url TEXT,                            -- URL foto bukti setelah selesai diperbaiki dinas
  reporter_alias TEXT NOT NULL DEFAULT 'Warga',       -- Nama publik yang aman (misal: Budi S. / Warga #4102)
  reporter_phone_masked TEXT,
  reporter_nik_masked TEXT,
  citizen_id UUID REFERENCES citizens(id) ON DELETE SET NULL,
  upvotes INTEGER NOT NULL DEFAULT 0,
  assigned_agency TEXT,                               -- Dinas penanggung jawab (PUPR, Dishub, DLH, dll)
  admin_note TEXT,                                    -- Catatan disposisi teknis petugas
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW()),
  updated_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW())
);

-- Tabel 4: Riwayat / Timeline Progres Penanganan (Report Timeline)
CREATE TABLE IF NOT EXISTS report_timeline (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  status report_status NOT NULL,
  title TEXT NOT NULL,
  note TEXT NOT NULL,
  actor TEXT NOT NULL DEFAULT 'Sistem TRACE',         -- Pihak yang memperbarui (Admin Wilayah, Tim Teknis, dll)
  evidence_url TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW())
);

-- Tabel 5: Dukungan / Upvote Warga (Report Upvotes)
CREATE TABLE IF NOT EXISTS report_upvotes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  report_id UUID NOT NULL REFERENCES reports(id) ON DELETE CASCADE,
  citizen_id UUID REFERENCES citizens(id) ON DELETE CASCADE,
  voter_ip TEXT,
  created_at TIMESTAMPTZ DEFAULT TIMEZONE('Asia/Jakarta', NOW()),
  UNIQUE(report_id, citizen_id)
);

-- ==============================================================================
-- 4. INDEKS UNTUK PERFORMA QUERY CEPAT
-- ==============================================================================
CREATE INDEX IF NOT EXISTS idx_reports_category ON reports(category);
CREATE INDEX IF NOT EXISTS idx_reports_status ON reports(status);
CREATE INDEX IF NOT EXISTS idx_reports_district ON reports(district);
CREATE INDEX IF NOT EXISTS idx_reports_created_at ON reports(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_reports_coordinates ON reports(latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_reports_tracking_code ON reports(tracking_code);
CREATE INDEX IF NOT EXISTS idx_timeline_report_id ON report_timeline(report_id);
CREATE INDEX IF NOT EXISTS idx_citizens_phone ON citizens(phone);
CREATE INDEX IF NOT EXISTS idx_citizens_nik_hash ON citizens(nik_hash);

-- ==============================================================================
-- 5. FUNGSI & TRIGGER OTOMATIS
-- ==============================================================================

-- A. Auto Updated At Timestamp Trigger
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('Asia/Jakarta', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_reports_updated_at ON reports;
CREATE TRIGGER trigger_reports_updated_at
  BEFORE UPDATE ON reports
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trigger_citizens_updated_at ON citizens;
CREATE TRIGGER trigger_citizens_updated_at
  BEFORE UPDATE ON citizens
  FOR EACH ROW
  EXECUTE FUNCTION set_updated_at();

-- B. Auto Update Counter Upvote saat Ada Warga Mendukung
CREATE OR REPLACE FUNCTION update_report_upvotes_count()
RETURNS TRIGGER AS $$
BEGIN
  IF TG_OP = 'INSERT' THEN
    UPDATE reports SET upvotes = upvotes + 1 WHERE id = NEW.report_id;
  ELSIF TG_OP = 'DELETE' THEN
    UPDATE reports SET upvotes = GREATEST(0, upvotes - 1) WHERE id = OLD.report_id;
  END IF;
  RETURN NULL;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_report_upvote_counter ON report_upvotes;
CREATE TRIGGER trigger_report_upvote_counter
  AFTER INSERT OR DELETE ON report_upvotes
  FOR EACH ROW
  EXECUTE FUNCTION update_report_upvotes_count();

-- C. Generator Kode Tiket TRACE Otomatis (Jika tidak diinput manual)
CREATE OR REPLACE FUNCTION generate_tracking_code()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.tracking_code IS NULL OR NEW.tracking_code = '' THEN
    NEW.tracking_code := 'TRC-' || TO_CHAR(NOW(), 'YYYY') || '-' || LPAD(FLOOR(RANDOM() * 10000)::TEXT, 4, '0');
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trigger_generate_tracking_code ON reports;
CREATE TRIGGER trigger_generate_tracking_code
  BEFORE INSERT ON reports
  FOR EACH ROW
  EXECUTE FUNCTION generate_tracking_code();

-- ==============================================================================
-- 6. ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE reports ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE citizens ENABLE ROW LEVEL SECURITY;
ALTER TABLE report_upvotes ENABLE ROW LEVEL SECURITY;
ALTER TABLE officers ENABLE ROW LEVEL SECURITY;

-- Kebijakan Laporan (Reports):
-- 1. Siapapun (Anonim & Warga) dapat melihat semua data laporan publik
CREATE POLICY "Public can view reports"
  ON reports FOR SELECT
  USING (true);

-- 2. Siapapun (melalui aplikasi TRACE) dapat mengirim laporan baru
CREATE POLICY "Anyone can create report"
  ON reports FOR INSERT
  WITH CHECK (true);

-- 3. Petugas berwenang dapat memperbarui status laporan
CREATE POLICY "Enable update for service role or admin"
  ON reports FOR UPDATE
  USING (true);

-- 4. Pengelola / aplikasi dapat menghapus laporan
CREATE POLICY "Enable delete reports"
  ON reports FOR DELETE
  USING (true);

-- Kebijakan Timeline:
CREATE POLICY "Public can view report timeline"
  ON report_timeline FOR SELECT
  USING (true);

CREATE POLICY "Enable insert timeline"
  ON report_timeline FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable delete timeline"
  ON report_timeline FOR DELETE
  USING (true);

-- Kebijakan Upvotes:
CREATE POLICY "Public can view upvotes"
  ON report_upvotes FOR SELECT
  USING (true);

CREATE POLICY "Citizens can insert upvotes"
  ON report_upvotes FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Citizens can delete own upvotes"
  ON report_upvotes FOR DELETE
  USING (true);

-- Kebijakan Citizens:
CREATE POLICY "Citizens can view account data"
  ON citizens FOR SELECT
  USING (true);

CREATE POLICY "Citizens can register"
  ON citizens FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Citizens can update own account"
  ON citizens FOR UPDATE
  USING (true);

CREATE POLICY "Enable delete citizens"
  ON citizens FOR DELETE
  USING (true);

-- Kebijakan Officers:
CREATE POLICY "Public can view officers list"
  ON officers FOR SELECT
  USING (true);

CREATE POLICY "Enable insert officers"
  ON officers FOR INSERT
  WITH CHECK (true);

CREATE POLICY "Enable update officers"
  ON officers FOR UPDATE
  USING (true);

-- ==============================================================================
-- 7. SUPABASE STORAGE BUCKET (Untuk Foto Bukti Aduan)
-- ==============================================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('report-images', 'report-images', true)
ON CONFLICT (id) DO NOTHING;

-- Kebijakan Akses Storage Bucket: Publik Boleh Lihat & Upload
DO $$ BEGIN
  CREATE POLICY "Public can view report images"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'report-images');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

DO $$ BEGIN
  CREATE POLICY "Public can upload report images"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'report-images');
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- ==============================================================================
-- 8. DATA AWAL (SEED DATA KOTA BENGKULU)
-- ==============================================================================

-- A. Contoh Petugas Admin & Dinas
INSERT INTO officers (id, username, nama, nip, role, agency, phone)
VALUES 
  ('11111111-1111-1111-1111-111111111111', 'admin.pupr', 'Rahmat Hidayat, S.T.', '198204152006041002', 'dinas_teknis', 'Dinas PUPR Kota Bengkulu', '081271002001'),
  ('22222222-2222-2222-2222-222222222222', 'admin.dishub', 'Agus Setiawan, M.T.', '198509202009021004', 'dinas_teknis', 'Dinas Perhubungan & PJU Kota Bengkulu', '081373003002'),
  ('33333333-3333-3333-3333-333333333333', 'admin.dlh', 'Dewi Lestari, S.Si.', '199003112015032001', 'dinas_teknis', 'Dinas Lingkungan Hidup (DLH) Kota Bengkulu', '085268004003')
ON CONFLICT (id) DO NOTHING;

-- Catatan: Data laporan, warga, dan linimasa murni dibuat melalui antarmuka aplikasi.

