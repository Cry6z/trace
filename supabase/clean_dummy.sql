-- ==============================================================================
-- SKRIP PEMBERSIHAN DATA DUMMY DATABASE TRACE (KOTA BENGKULU)
-- Jalankan skrip ini langsung di Supabase SQL Editor
-- (Dashboard Supabase -> SQL Editor -> New Query -> Run)
-- ==============================================================================

-- 1. Hapus seluruh riwayat timeline laporan dummy
DELETE FROM report_timeline;

-- 2. Hapus seluruh data dukungan (upvotes) laporan dummy
DELETE FROM report_upvotes;

-- 3. Hapus seluruh data laporan pengaduan dummy
DELETE FROM reports;

-- 4. Hapus data akun warga dummy pengujian
DELETE FROM citizens WHERE nik_hash IN (
  'budi_hash_nik_1771_001', 
  'siti_hash_nik_1771_002', 
  'ahmad_hash_nik_1771_003'
);

-- 5. Buka izin DELETE pada RLS agar aplikasi / pengelola dapat mereset data jika dibutuhkan
DROP POLICY IF EXISTS "Enable delete reports" ON reports;
CREATE POLICY "Enable delete reports" ON reports FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable delete timeline" ON report_timeline;
CREATE POLICY "Enable delete timeline" ON report_timeline FOR DELETE USING (true);

DROP POLICY IF EXISTS "Enable delete citizens" ON citizens;
CREATE POLICY "Enable delete citizens" ON citizens FOR DELETE USING (true);

-- 6. Verifikasi tabel telah bersih
SELECT count(*) AS total_laporan FROM reports;
SELECT count(*) AS total_warga FROM citizens;
