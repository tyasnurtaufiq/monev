const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// GET current reporting window status
router.get("/status", verifyToken, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM reporting_window ORDER BY id DESC LIMIT 1`
        );
        if (result.rows.length === 0) {
            return res.json({ is_open: false, message: "Belum ada jadwal pelaporan" });
        }

        const window = result.rows[0];
        const now = new Date();
        const start = new Date(window.start_date);
        const end = new Date(window.end_date);
        // Set end to end of day
        end.setHours(23, 59, 59, 999);

        const is_open = now >= start && now <= end;

        res.json({
            ...window,
            is_open,
            server_time: now.toISOString()
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// GET all windows (Admin only)
router.get("/", verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            `SELECT * FROM reporting_window ORDER BY id DESC`
        );
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST create new reporting window (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
    const { title, start_date, end_date } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO reporting_window (title, start_date, end_date)
             VALUES ($1, $2, $3) RETURNING *`,
            [title || 'Periode Pelaporan', start_date, end_date]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update reporting window (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    const { title, start_date, end_date } = req.body;
    try {
        const result = await pool.query(
            `UPDATE reporting_window SET title = $1, start_date = $2, end_date = $3
             WHERE id = $4 RETURNING *`,
            [title || 'Periode Pelaporan', start_date, end_date, req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Window tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE reporting window (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM reporting_window WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Window tidak ditemukan" });
        }
        res.json({ message: "Jadwal pelaporan berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
