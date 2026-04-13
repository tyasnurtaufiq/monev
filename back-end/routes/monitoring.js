const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET monitoring data (filter by output_id dan/atau periode_id)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { output_id, periode_id } = req.query;
        let query = `
            SELECT m.id, m.output_id, m.periode_id, m.target_fisik, m.realisasi_fisik, m.progress, m.hambatan, m.pendorong, 
                   o.nama_output,
                   COALESCE((SELECT SUM(b.pagu) FROM belanja b WHERE b.output_id = o.id), 0) AS pagu,
                   COALESCE((SELECT SUM(mb.target_keuangan) FROM belanja b JOIN monitoring_belanja mb ON b.id = mb.belanja_id WHERE b.output_id = o.id AND mb.periode_id = m.periode_id), 0) AS target_keuangan,
                   COALESCE((SELECT SUM(mb.realisasi_keuangan) FROM belanja b JOIN monitoring_belanja mb ON b.id = mb.belanja_id WHERE b.output_id = o.id AND mb.periode_id = m.periode_id), 0) AS realisasi_keuangan,
                   p.bulan, t.tahun
            FROM monitoring m
            LEFT JOIN output_kegiatan o ON m.output_id = o.id
            LEFT JOIN periode p ON m.periode_id = p.id
            LEFT JOIN tahun_anggaran t ON p.tahun_id = t.id
        `;
        const conditions = [];
        const params = [];

        if (output_id) {
            params.push(output_id);
            conditions.push(`m.output_id = $${params.length}`);
        }
        if (periode_id) {
            params.push(periode_id);
            conditions.push(`m.periode_id = $${params.length}`);
        }

        // Non-admin hanya lihat monitoring untuk output miliknya
        if (req.user.role !== "admin") {
            params.push(req.user.id);
            conditions.push(`o.user_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY p.bulan";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET dashboard monitoring (flat table - user's query)
router.get("/dashboard", verifyToken, async (req, res) => {
    try {
        const { tahun_id } = req.query;
        if (!tahun_id) {
            return res.status(400).json({ message: "tahun_id diperlukan" });
        }

        const params = [tahun_id];

        const result = await pool.query(
            `SELECT
                ta.tahun,
                p.kode_program,
                p.nama_program,
                k.nama_kegiatan,
                sk.nama_sub_kegiatan,
                o.nama_output,
                COALESCE((SELECT SUM(b.pagu) FROM belanja b WHERE b.output_id = o.id), 0) AS pagu,
                pr.bulan,
                m.target_fisik,
                m.realisasi_fisik,
                COALESCE((SELECT SUM(mb.target_keuangan) FROM belanja b JOIN monitoring_belanja mb ON b.id = mb.belanja_id WHERE b.output_id = o.id AND mb.periode_id = pr.id), 0) AS target_keuangan,
                COALESCE((SELECT SUM(mb.realisasi_keuangan) FROM belanja b JOIN monitoring_belanja mb ON b.id = mb.belanja_id WHERE b.output_id = o.id AND mb.periode_id = pr.id), 0) AS realisasi_keuangan
            FROM monitoring m
            JOIN output_kegiatan o ON m.output_id = o.id
            JOIN sub_kegiatan sk ON o.sub_kegiatan_id = sk.id
            JOIN kegiatan k ON sk.kegiatan_id = k.id
            JOIN program p ON k.program_id = p.id
            JOIN tahun_anggaran ta ON p.tahun_id = ta.id
            JOIN periode pr ON m.periode_id = pr.id
            WHERE ta.id = $1
            ORDER BY ta.tahun, pr.bulan`,
            params
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET rekap monitoring per tahun (seluruh hierarki)
router.get("/rekap", verifyToken, async (req, res) => {
    try {
        const { tahun_id } = req.query;
        if (!tahun_id) {
            return res.status(400).json({ message: "tahun_id diperlukan" });
        }

        const params = [tahun_id];

        const result = await pool.query(
            `SELECT 
                pr.id AS program_id, pr.kode_program, pr.nama_program,
                k.id AS kegiatan_id, k.kode_kegiatan, k.nama_kegiatan,
                sk.id AS sub_kegiatan_id, sk.kode_sub_kegiatan, sk.nama_sub_kegiatan,
                o.id AS output_id, o.kode AS kode_output, o.nama_output,
                COALESCE((SELECT SUM(b.pagu) FROM belanja b WHERE b.output_id = o.id), 0) AS pagu,
                m.id AS monitoring_id, m.target_fisik, m.realisasi_fisik,
                COALESCE((SELECT SUM(mb.target_keuangan) FROM belanja b JOIN monitoring_belanja mb ON b.id = mb.belanja_id WHERE b.output_id = o.id AND mb.periode_id = p.id), 0) AS target_keuangan,
                COALESCE((SELECT SUM(mb.realisasi_keuangan) FROM belanja b JOIN monitoring_belanja mb ON b.id = mb.belanja_id WHERE b.output_id = o.id AND mb.periode_id = p.id), 0) AS realisasi_keuangan,
                m.progress, m.hambatan, m.pendorong,
                p.bulan, p.id AS periode_id
             FROM program pr
             LEFT JOIN kegiatan k ON k.program_id = pr.id
             LEFT JOIN sub_kegiatan sk ON sk.kegiatan_id = k.id
             LEFT JOIN output_kegiatan o ON o.sub_kegiatan_id = sk.id
             LEFT JOIN monitoring m ON m.output_id = o.id
             LEFT JOIN periode p ON m.periode_id = p.id
             WHERE pr.tahun_id = $1
             ORDER BY pr.kode_program, k.kode_kegiatan, sk.kode_sub_kegiatan, p.bulan`,
            params
        );

        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST / upsert monitoring
router.post("/", verifyToken, async (req, res) => {
    const {
        output_id, periode_id,
        target_fisik, realisasi_fisik,
        progress, hambatan, pendorong
    } = req.body;

    try {
        // Check reporting window for non-admin users
        if (req.user.role !== "admin") {
            const windowResult = await pool.query(
                `SELECT * FROM reporting_window ORDER BY id DESC LIMIT 1`
            );
            if (windowResult.rows.length === 0) {
                return res.status(403).json({ message: "Belum ada jadwal pelaporan yang dibuka oleh admin" });
            }
            const win = windowResult.rows[0];
            const now = new Date();
            const start = new Date(win.start_date);
            const end = new Date(win.end_date);
            end.setHours(23, 59, 59, 999);
            if (now < start || now > end) {
                return res.status(403).json({ message: "Periode pelaporan sudah ditutup. Hubungi admin untuk membuka kembali." });
            }
        }

        const result = await pool.query(
            `INSERT INTO monitoring 
                (output_id, periode_id, target_fisik, realisasi_fisik, 
                 progress, hambatan, pendorong)
             VALUES ($1, $2, $3, $4, $5, $6, $7)
             ON CONFLICT (output_id, periode_id)
             DO UPDATE SET
                target_fisik = EXCLUDED.target_fisik,
                realisasi_fisik = EXCLUDED.realisasi_fisik,
                progress = EXCLUDED.progress,
                hambatan = EXCLUDED.hambatan,
                pendorong = EXCLUDED.pendorong
             RETURNING *`,
            [output_id, periode_id,
                target_fisik || 0, realisasi_fisik || 0,
                progress, hambatan, pendorong]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update monitoring
router.put("/:id", verifyToken, async (req, res) => {
    const {
        target_fisik, realisasi_fisik,
        progress, hambatan, pendorong
    } = req.body;

    try {
        const result = await pool.query(
            `UPDATE monitoring SET
                target_fisik = $1, realisasi_fisik = $2,
                progress = $3, hambatan = $4, pendorong = $5
             WHERE id = $6 RETURNING *`,
            [target_fisik, realisasi_fisik,
                progress, hambatan, pendorong,
                req.params.id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Monitoring tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE monitoring
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM monitoring WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Monitoring tidak ditemukan" });
        }
        res.json({ message: "Monitoring berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET monitoring_belanja
router.get("/belanja", verifyToken, async (req, res) => {
    try {
        const { belanja_id, periode_id } = req.query;
        let query = `SELECT * FROM monitoring_belanja`;
        const conditions = [];
        const params = [];

        if (belanja_id) {
            params.push(belanja_id);
            conditions.push(`belanja_id = $${params.length}`);
        }
        if (periode_id) {
            params.push(periode_id);
            conditions.push(`periode_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST upsert monitoring_belanja
router.post("/belanja", verifyToken, async (req, res) => {
    const { belanja_id, periode_id, target_keuangan, realisasi_keuangan } = req.body;

    try {
        // Check reporting window for non-admin users
        if (req.user.role !== "admin") {
            const windowResult = await pool.query(
                `SELECT * FROM reporting_window ORDER BY id DESC LIMIT 1`
            );
            if (windowResult.rows.length === 0) {
                return res.status(403).json({ message: "Belum ada jadwal pelaporan yang dibuka oleh admin" });
            }
            const win = windowResult.rows[0];
            const now = new Date();
            const start = new Date(win.start_date);
            const end = new Date(win.end_date);
            end.setHours(23, 59, 59, 999);
            if (now < start || now > end) {
                return res.status(403).json({ message: "Periode pelaporan sudah ditutup. Hubungi admin untuk membuka kembali." });
            }
        }

        const result = await pool.query(
            `INSERT INTO monitoring_belanja 
                (belanja_id, periode_id, target_keuangan, realisasi_keuangan)
             VALUES ($1, $2, $3, $4)
             ON CONFLICT (belanja_id, periode_id)
             DO UPDATE SET
                target_keuangan = EXCLUDED.target_keuangan,
                realisasi_keuangan = EXCLUDED.realisasi_keuangan
             RETURNING *`,
            [belanja_id, periode_id, target_keuangan || 0, realisasi_keuangan || 0]
        );

        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
