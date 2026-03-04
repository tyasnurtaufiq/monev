const express = require("express");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");

const router = express.Router();

// GET semua events (filter by bulan dan tahun opsional)
router.get("/", verifyToken, async (req, res) => {
    try {
        const { month, year } = req.query;
        let query = "SELECT * FROM events";
        const conditions = [];
        const params = [];

        if (month) {
            params.push(month);
            conditions.push(`EXTRACT(MONTH FROM event_date) = $${params.length}`);
        }
        if (year) {
            params.push(year);
            conditions.push(`EXTRACT(YEAR FROM event_date) = $${params.length}`);
        }

        if (conditions.length > 0) {
            query += " WHERE " + conditions.join(" AND ");
        }

        query += " ORDER BY event_date, id";

        const result = await pool.query(query, params);
        res.json(result.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// POST tambah event (Admin only)
router.post("/", verifyToken, isAdmin, async (req, res) => {
    const { title, description, event_date, color } = req.body;
    try {
        const result = await pool.query(
            `INSERT INTO events (title, description, event_date, color)
             VALUES ($1, $2, $3, $4) RETURNING *`,
            [title, description || null, event_date, color || 'purple']
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// PUT update event (Admin only)
router.put("/:id", verifyToken, isAdmin, async (req, res) => {
    const { title, description, event_date, color } = req.body;
    try {
        const result = await pool.query(
            `UPDATE events SET title = $1, description = $2, event_date = $3, color = $4
             WHERE id = $5 RETURNING *`,
            [title, description || null, event_date, color || 'purple', req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Event tidak ditemukan" });
        }
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

// DELETE event (Admin only)
router.delete("/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        const result = await pool.query(
            "DELETE FROM events WHERE id = $1 RETURNING *",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "Event tidak ditemukan" });
        }
        res.json({ message: "Event berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
