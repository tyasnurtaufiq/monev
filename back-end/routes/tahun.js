const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");

const router = express.Router();

// GET semua tahun anggaran
router.get("/", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM tahun_anggaran ORDER BY tahun DESC"
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah tahun anggaran
router.post("/", verifyToken, async (req, res) => {
    const { tahun } = req.body;
    try {
        const result = await pool.query(
            "INSERT INTO tahun_anggaran (tahun) VALUES ($1) RETURNING *",
            [tahun]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        if (err.code === "23505") {
            return res.status(400).json({ message: "Tahun sudah ada" });
        }
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
