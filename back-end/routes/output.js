const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// GET semua output (filter by sub_kegiatan_id + user ownership)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { sub_kegiatan_id } = req.query;
        let query = `
            SELECT o.*, sk.nama_sub_kegiatan, sk.kode_sub_kegiatan, u.name as user_name, u.username as user_username
            FROM output_kegiatan o
            LEFT JOIN sub_kegiatan sk ON o.sub_kegiatan_id = sk.id
            LEFT JOIN users u ON o.user_id = u.id
        `;
        const conditions = [];
        const params = [];

        if (sub_kegiatan_id) {
            params.push(sub_kegiatan_id);
            conditions.push(`o.sub_kegiatan_id = $${params.length}`);
        }

        // Non-admin hanya lihat output miliknya
        if (req.user.role !== "admin") {
            params.push(req.user.id);
            conditions.push(`o.user_id = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY o.id";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET output by id (with ownership check)
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT o.*, sk.nama_sub_kegiatan, sk.kode_sub_kegiatan
             FROM output_kegiatan o
             LEFT JOIN sub_kegiatan sk ON o.sub_kegiatan_id = sk.id
             WHERE o.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Output tidak ditemukan" });
        }

        // Non-admin hanya bisa lihat output miliknya
        if (req.user.role !== "admin" && result.rows[0].user_id !== req.user.id) {
            return res.status(403).json({ message: "Akses ditolak. Anda tidak memiliki output ini." });
        }

        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah output (Admin only, user_id wajib dari body)
router.post("/", verifyToken, isAdmin, async (req, res) => {
    const { sub_kegiatan_id, nama_output, pagu, user_id } = req.body;

    if (!user_id) {
        return res.status(400).json({ message: "User wajib dipilih" });
    }

    try {
        const result = await pool.query(
            `INSERT INTO output_kegiatan (sub_kegiatan_id, nama_output, pagu, user_id)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [sub_kegiatan_id, nama_output, pagu, user_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update output (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    const { sub_kegiatan_id, nama_output, pagu, user_id } = req.body;
    try {
        const existing = await pool.query(
            "SELECT * FROM output_kegiatan WHERE id = $1",
            [req.params.id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Output tidak ditemukan" });
        }

        const result = await pool.query(
            `UPDATE output_kegiatan SET sub_kegiatan_id = $1, nama_output = $2, pagu = $3, user_id = $4
             WHERE id = $5 RETURNING *`,
            [sub_kegiatan_id, nama_output, pagu, user_id, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE output (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const existing = await pool.query(
            "SELECT * FROM output_kegiatan WHERE id = $1",
            [req.params.id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "Output tidak ditemukan" });
        }

        await pool.query(
            "DELETE FROM output_kegiatan WHERE id = $1",
            [req.params.id]
        );
        res.json({ message: "Output berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
