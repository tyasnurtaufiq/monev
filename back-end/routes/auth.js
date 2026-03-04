const express = require("express");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const pool = require("../db");
const verifyToken = require("../middleware/authMiddleware");
const isAdmin = require("../middleware/roleMiddleware");


const router = express.Router();

/* =========================
   REGISTER USER
========================= */
router.post("/register", async (req, res) => {
    const { username, name, password, role } = req.body;

    try {
        // cek apakah username sudah ada
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (existingUser.rows.length > 0) {
            return res.status(400).json({ message: "Username sudah terdaftar" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // simpan ke database
        const newUser = await pool.query(
            `INSERT INTO users (username, name, password, role)
       VALUES ($1, $2, $3, $4)
       RETURNING id, username, name, role`,
            [username, name, hashedPassword, role]
        );

        res.status(201).json({
            message: "User berhasil dibuat",
            user: newUser.rows[0],
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* =========================
   LOGIN USER
========================= */
router.post("/login", async (req, res) => {
    const { username, password } = req.body;

    try {
        const user = await pool.query(
            "SELECT * FROM users WHERE username = $1",
            [username]
        );

        if (user.rows.length === 0) {
            return res.status(400).json({ message: "User tidak ditemukan" });
        }

        const validPassword = await bcrypt.compare(
            password,
            user.rows[0].password
        );

        if (!validPassword) {
            return res.status(400).json({ message: "Password salah" });
        }

        const token = jwt.sign(
            { id: user.rows[0].id, role: user.rows[0].role },
            process.env.JWT_SECRET,
            { expiresIn: "8h" }
        );

        res.json({
            token,
            user: {
                id: user.rows[0].id,
                name: user.rows[0].name,
                role: user.rows[0].role,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* =========================
   PROFILE (Protected)
========================= */
router.get("/profile", verifyToken, async (req, res) => {
    try {
        const user = await pool.query(
            "SELECT id, username, name, role FROM users WHERE id = $1",
            [req.user.id]
        );

        res.json(user.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* =========================
   CHANGE PASSWORD (Self)
========================= */
router.put("/change-password", verifyToken, async (req, res) => {
    const { currentPassword, newPassword } = req.body;

    try {
        // Get user with password
        const user = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [req.user.id]
        );
        if (user.rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Verify current password
        const validPassword = await bcrypt.compare(currentPassword, user.rows[0].password);
        if (!validPassword) {
            return res.status(400).json({ message: "Password lama salah" });
        }

        // Hash new password and update
        const hashedPassword = await bcrypt.hash(newPassword, 10);
        await pool.query(
            "UPDATE users SET password = $1 WHERE id = $2",
            [hashedPassword, req.user.id]
        );

        res.json({ message: "Password berhasil diubah" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});
/* =========================
   GET ALL USERS (Admin Only)
========================= */
router.get("/users", verifyToken, isAdmin, async (req, res) => {
    try {
        const users = await pool.query(
            "SELECT id, username, name, role FROM users"
        );

        res.json(users.rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* =========================
   UPDATE USER (Admin Only)
========================= */
router.put("/users/:id", verifyToken, isAdmin, async (req, res) => {
    const { username, name, role, password } = req.body;
    try {
        // Cek user exists
        const existing = await pool.query(
            "SELECT * FROM users WHERE id = $1",
            [req.params.id]
        );
        if (existing.rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }

        // Cek username unik (jika berubah)
        if (username && username !== existing.rows[0].username) {
            const usernameCheck = await pool.query(
                "SELECT id FROM users WHERE username = $1 AND id != $2",
                [username, req.params.id]
            );
            if (usernameCheck.rows.length > 0) {
                return res.status(400).json({ message: "Username sudah digunakan" });
            }
        }

        // Build update query
        let query, params;
        if (password && password.trim() !== "") {
            const hashedPassword = await bcrypt.hash(password, 10);
            query = `UPDATE users SET username = $1, name = $2, role = $3, password = $4
                     WHERE id = $5 RETURNING id, username, name, role`;
            params = [username, name, role, hashedPassword, req.params.id];
        } else {
            query = `UPDATE users SET username = $1, name = $2, role = $3
                     WHERE id = $4 RETURNING id, username, name, role`;
            params = [username, name, role, req.params.id];
        }

        const result = await pool.query(query, params);
        res.json(result.rows[0]);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

/* =========================
   DELETE USER (Admin Only)
========================= */
router.delete("/users/:id", verifyToken, isAdmin, async (req, res) => {
    try {
        // Jangan hapus diri sendiri
        if (parseInt(req.params.id) === req.user.id) {
            return res.status(400).json({ message: "Tidak bisa menghapus akun sendiri" });
        }

        const result = await pool.query(
            "DELETE FROM users WHERE id = $1 RETURNING id, username, name, role",
            [req.params.id]
        );
        if (result.rows.length === 0) {
            return res.status(404).json({ message: "User tidak ditemukan" });
        }
        res.json({ message: "User berhasil dihapus" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
});

module.exports = router;
