-- Migration: Tambah tabel belanja dan hapus kolom pagu dari output_kegiatan
-- Jalankan di PostgreSQL

-- 1. Buat tabel belanja
CREATE TABLE IF NOT EXISTS belanja (
    id SERIAL PRIMARY KEY,
    output_id INTEGER NOT NULL REFERENCES output_kegiatan(id) ON DELETE CASCADE,
    nama_belanja VARCHAR(255) NOT NULL,
    pagu DECIMAL(15,2) DEFAULT 0
);

-- 2. Hapus kolom pagu dari output_kegiatan
ALTER TABLE output_kegiatan DROP COLUMN IF EXISTS pagu;
