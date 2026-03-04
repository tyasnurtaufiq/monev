const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua kegiatan (filter by program_id)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { program_id } = req.query;
        let query = `
            SELECT k.*, p.nama_program, p.kode_program
            FROM kegiatan k
            LEFT JOIN program p ON k.program_id = p.id
        `;
        const params = [];

        if (program_id) {
            query += " WHERE k.program_id = $1";
            params.push(program_id);
        }

        query += " ORDER BY k.kode_kegiatan";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET kegiatan by id
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT k.*, p.nama_program, p.kode_program
             FROM kegiatan k
             LEFT JOIN program p ON k.program_id = p.id
             WHERE k.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kegiatan tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah kegiatan
router.post("/", verifyToken, async (req, res) => {
    const { program_id, kode_kegiatan, nama_kegiatan } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO kegiatan (program_id, kode_kegiatan, nama_kegiatan)
             VALUES ($1, $2, $3) RETURNING *`,
            [program_id, kode_kegiatan, nama_kegiatan]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update kegiatan
router.put("/:id", verifyToken, async (req, res) => {
    const { program_id, kode_kegiatan, nama_kegiatan } = req.body;
    try {
        const result = await pool.query(
            `UPDATE kegiatan SET program_id = $1, kode_kegiatan = $2, nama_kegiatan = $3
             WHERE id = $4 RETURNING *`,
            [program_id, kode_kegiatan, nama_kegiatan, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kegiatan tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE kegiatan
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM kegiatan WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Kegiatan tidak ditemukan" });
        }
        res.json({ message: "Kegiatan berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
