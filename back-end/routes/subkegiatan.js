const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua sub kegiatan (filter by kegiatan_id)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { kegiatan_id } = req.query;
        let query = `
            SELECT sk.*, k.nama_kegiatan, k.kode_kegiatan
            FROM sub_kegiatan sk
            LEFT JOIN kegiatan k ON sk.kegiatan_id = k.id
        `;
        const params = [];

        if (kegiatan_id) {
            query += " WHERE sk.kegiatan_id = $1";
            params.push(kegiatan_id);
        }

        query += " ORDER BY sk.kode_sub_kegiatan";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET sub kegiatan by id
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT sk.*, k.nama_kegiatan, k.kode_kegiatan
             FROM sub_kegiatan sk
             LEFT JOIN kegiatan k ON sk.kegiatan_id = k.id
             WHERE sk.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Sub kegiatan tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah sub kegiatan
router.post("/", verifyToken, async (req, res) => {
    const { kegiatan_id, kode_sub_kegiatan, nama_sub_kegiatan } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO sub_kegiatan (kegiatan_id, kode_sub_kegiatan, nama_sub_kegiatan)
             VALUES ($1, $2, $3) RETURNING *`,
            [kegiatan_id, kode_sub_kegiatan, nama_sub_kegiatan]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update sub kegiatan
router.put("/:id", verifyToken, async (req, res) => {
    const { kegiatan_id, kode_sub_kegiatan, nama_sub_kegiatan } = req.body;
    try {
        const result = await pool.query(
            `UPDATE sub_kegiatan SET kegiatan_id = $1, kode_sub_kegiatan = $2, nama_sub_kegiatan = $3
             WHERE id = $4 RETURNING *`,
            [kegiatan_id, kode_sub_kegiatan, nama_sub_kegiatan, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Sub kegiatan tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE sub kegiatan
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM sub_kegiatan WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Sub kegiatan tidak ditemukan" });
        }
        res.json({ message: "Sub kegiatan berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
