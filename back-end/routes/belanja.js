const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// GET semua belanja (filter by output_id + user ownership)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { output_id } = req.query;
        let query = `
            SELECT b.*, o.nama_output, o.sub_kegiatan_id, u.name as user_name
            FROM belanja b
            LEFT JOIN output_kegiatan o ON b.output_id = o.id
            LEFT JOIN users u ON o.user_id = u.id
        `;
        const conditions = [];
        const params = [];

        if (output_id) {
            params.push(output_id);
            conditions.push(`b.output_id = $${params.length}`);
        }

        // Non-admin hanya lihat belanja dari output miliknya
        if (req.user.role !== "admin") {
            params.push(req.user.id);
            conditions.push(`o.user_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY b.id";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET belanja by id
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT b.*, o.nama_output
             FROM belanja b
             LEFT JOIN output_kegiatan o ON b.output_id = o.id
             WHERE b.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Belanja tidak ditemukan" });
        }

        // Non-admin check ownership via output
        if (req.user.role !== "admin") {
            const output = await pool.query(
                "SELECT user_id FROM output_kegiatan WHERE id = $1",
                [result.rows[0].output_id]
            );
            if (output.rows.length > 0 && output.rows[0].user_id !== req.user.id) {
                return res.status(403).json({ message: "Akses ditolak." });
            }
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah belanja (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
    const { output_id, nama_belanja, kode, pagu } = req.body;

    try {
        const result = await pool.query(
            `INSERT INTO belanja (output_id, nama_belanja, kode, pagu)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [output_id, nama_belanja, kode, pagu || 0]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update belanja (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    const { output_id, nama_belanja, kode, pagu } = req.body;
    try {
        const existing = await pool.query(
            "SELECT * FROM belanja WHERE id = $1",
            [req.params.id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Belanja tidak ditemukan" });
        }

        const result = await pool.query(
            `UPDATE belanja SET output_id = $1, nama_belanja = $2, kode = $3, pagu = $4
             WHERE id = $5 RETURNING *`,
            [output_id, nama_belanja, kode, pagu || 0, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE belanja (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const existing = await pool.query(
            "SELECT * FROM belanja WHERE id = $1",
            [req.params.id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Belanja tidak ditemukan" });
        }

        await pool.query(
            "DELETE FROM belanja WHERE id = $1",
            [req.params.id]
        );
        res.json({ message: "Belanja berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
