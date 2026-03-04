const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua program (filter by tahun_id)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { tahun_id } = req.query;
        let query = `
            SELECT p.*, t.tahun 
            FROM program p
            LEFT JOIN tahun_anggaran t ON p.tahun_id = t.id
        `;
        const params = [];

        if (tahun_id) {
            query += " WHERE p.tahun_id = $1";
            params.push(tahun_id);
        }

        query += " ORDER BY p.kode_program";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET program by id
router.get("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT p.*, t.tahun 
             FROM program p
             LEFT JOIN tahun_anggaran t ON p.tahun_id = t.id
             WHERE p.id = $1`,
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Program tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah program
router.post("/", verifyToken, async (req, res) => {
    const { kode_program, nama_program, tahun_id } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO program (kode_program, nama_program, tahun_id)
             VALUES ($1, $2, $3) RETURNING *`,
            [kode_program, nama_program, tahun_id]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update program
router.put("/:id", verifyToken, async (req, res) => {
    const { kode_program, nama_program, tahun_id } = req.body;
    try {
        const result = await pool.query(
            `UPDATE program SET kode_program = $1, nama_program = $2, tahun_id = $3
             WHERE id = $4 RETURNING *`,
            [kode_program, nama_program, tahun_id, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Program tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE program
router.delete("/:id", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM program WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Program tidak ditemukan" });
        }
        res.json({ message: "Program berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
