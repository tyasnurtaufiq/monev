const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua periode (filter by tahun_id)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { tahun_id } = req.query;
        let query = `
            SELECT p.*, t.tahun
            FROM periode p
            LEFT JOIN tahun_anggaran t ON p.tahun_id = t.id
        `;
        const params = [];

        if (tahun_id) {
            query += " WHERE p.tahun_id = $1";
            params.push(tahun_id);
        }

        query += " ORDER BY p.bulan";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST generate 12 periode untuk 1 tahun
router.post("/generate", verifyToken, async (req, res) => {
    const { tahun_id } = req.body;
    try {
        // Cek apakah tahun_id valid
        const tahunCheck = await pool.query(
            "SELECT * FROM tahun_anggaran WHERE id = $1",
            [tahun_id]
        );
        if (tahunCheck.rows.length === 0) {
            return res.status(404).json({ message: "Tahun tidak ditemukan" });
        }

        // Generate 12 bulan
        const values = [];
        const placeholders = [];
        for (let bulan = 1; bulan <= 12; bulan++) {
            const idx = values.length;
            placeholders.push(`($${idx + 1}, $${idx + 2})`);
            values.push(tahun_id, bulan);
        }

        const result = await pool.query(
            `INSERT INTO periode (tahun_id, bulan) VALUES ${placeholders.join(", ")}
             ON CONFLICT (tahun_id, bulan) DO NOTHING
             RETURNING *`,
            values
        );

        // Return all periodes for this year
        const allPeriodes = await pool.query(
            "SELECT * FROM periode WHERE tahun_id = $1 ORDER BY bulan",
            [tahun_id]
        );

        res.status(201).json(allPeriodes.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
