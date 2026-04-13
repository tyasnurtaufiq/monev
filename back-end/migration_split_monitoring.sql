-- Migration: Pisah monitoring fisik dan keuangan
-- Fisik di level output (tabel monitoring), keuangan di level belanja (tabel monitoring_belanja)

-- 1. Buat tabel monitoring_belanja
CREATE TABLE IF NOT EXISTS monitoring_belanja (
    id SERIAL PRIMARY KEY,
    belanja_id INTEGER NOT NULL REFERENCES belanja(id) ON DELETE CASCADE,
    periode_id INTEGER NOT NULL REFERENCES periode(id) ON DELETE CASCADE,
    target_keuangan DECIMAL(15,2) DEFAULT 0,
    realisasi_keuangan DECIMAL(15,2) DEFAULT 0,
    UNIQUE(belanja_id, periode_id)
);
