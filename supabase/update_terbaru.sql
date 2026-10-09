-- ==============================================================================
-- TRACE BENGKULU - SKRIP PEMBARUAN DATABASE LENGKAP (SQL TERBARU)
-- Jalankan skrip ini langsung di:
-- Dashboard Supabase -> SQL Editor -> New Query -> Tempel (Paste) -> Klik Run
-- ==============================================================================

-- 1. Tambah Nilai 'lainnya' ke Enum issue_category jika belum ada
DO $$ BEGIN
  ALTER TYPE issue_category ADD VALUE IF NOT EXISTS 'lainnya';
EXCEPTION
  WHEN duplicate_object THEN null;
END $$;

-- 2. Tambah Kolom custom_category pada Tabel Laporan (Reports)
ALTER TABLE reports ADD COLUMN IF NOT EXISTS custom_category TEXT;

-- 3. Tambah Kolom PIN pada Tabel Petugas (Officers)
ALTER TABLE officers ADD COLUMN IF NOT EXISTS pin TEXT DEFAULT '123456';

-- 4. Buka Izin RLS INSERT & UPDATE Petugas Dinas (Agar Registrasi Admin Lintas Perangkat Berfungsi)
DROP POLICY IF EXISTS "Enable insert officers" ON officers;
CREATE POLICY "Enable insert officers" ON officers FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Enable update officers" ON officers;
CREATE POLICY "Enable update officers" ON officers FOR UPDATE USING (true);

-- 5. Pastikan Izin RLS Tabel Warga (Citizens) Terbuka Sempurna
DROP POLICY IF EXISTS "Citizens can view account data" ON citizens;
CREATE POLICY "Citizens can view account data" ON citizens FOR SELECT USING (true);

DROP POLICY IF EXISTS "Citizens can register" ON citizens;
CREATE POLICY "Citizens can register" ON citizens FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Citizens can update own account" ON citizens;
CREATE POLICY "Citizens can update own account" ON citizens FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Enable delete citizens" ON citizens;
CREATE POLICY "Enable delete citizens" ON citizens FOR DELETE USING (true);

-- 6. Tambahkan / Sinkronkan Akun Administrator Resmi Kota Bengkulu
INSERT INTO officers (username, nama, nip, role, agency, phone, pin)
VALUES 
  ('admin', 'Administrator Utama TRACE', '198001012005011001', 'super_admin', 'Pemerintah Kota Bengkulu', '081173001000', 'admin123')
ON CONFLICT (username) DO UPDATE 
SET 
  nama = EXCLUDED.nama, 
  nip = EXCLUDED.nip, 
  role = EXCLUDED.role, 
  agency = EXCLUDED.agency,
  phone = EXCLUDED.phone,
  pin = EXCLUDED.pin;

INSERT INTO officers (username, nama, nip, role, agency, phone, pin)
VALUES 
  ('admin.pupr', 'Ir. Rahmat Hidayat, S.T.', '198204152006041002', 'dinas_teknis', 'Dinas Pekerjaan Umum & Penataan Ruang (PUPR)', '081271002001', '123456'),
  ('admin.dlh', 'Dewi Lestari, S.Si.', '199003112015032001', 'dinas_teknis', 'Dinas Lingkungan Hidup (DLH)', '085268004003', '123456'),
  ('admin.dishub', 'Agus Setiawan, M.T.', '198509202009021004', 'dinas_teknis', 'Dinas Perhubungan (Dishub)', '081373003002', '123456'),
  ('admin.satpol', 'Bambang Irawan, S.Sos.', '198811052010011003', 'dinas_teknis', 'Satuan Polisi Pamong Praja (Satpol PP)', '081273004004', '123456')
ON CONFLICT (username) DO UPDATE
SET pin = EXCLUDED.pin;

-- 7. Verifikasi Status Pembaruan Database
SELECT 'Akun Petugas Terdaftar' AS info, count(*) AS total FROM officers
UNION ALL
SELECT 'Akun Warga Terdaftar' AS info, count(*) AS total FROM citizens
UNION ALL
SELECT 'Total Laporan Terdata' AS info, count(*) AS total FROM reports;
