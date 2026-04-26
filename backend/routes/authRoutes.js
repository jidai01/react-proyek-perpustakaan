const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// REGISTER
router.post("/register", async (req, res) => {
    const { username, password } = req.body; // Abaikan role dari body
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password wajib diisi!" });
    }

    try {
        const hashedPass = await bcrypt.hash(password, 10);
        // Selalu set role ke 'user' saat registrasi mandiri
        db.query("INSERT INTO users (username, password, role) VALUES (?, ?, 'user')",
            [username, hashedPass], (err) => {
                if (err) {
                    if (err.code === 'ER_DUP_ENTRY') {
                        return res.status(400).json({ message: "Username sudah digunakan!" });
                    }
                    return res.status(500).json({ message: "Gagal register" });
                }
                res.json({ message: "User berhasil dibuat! ✅" });
            });
    } catch (err) {
        res.status(500).json({ message: "Terjadi kesalahan server" });
    }
});


// LOGIN
router.post("/login", (req, res) => {
    const { username, password } = req.body;

    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password wajib diisi!" });
    }

    db.query("SELECT * FROM users WHERE username = ?", [username], async (err, hasil) => {
        if (err) return res.status(500).json({ message: "Kesalahan database" });
        if (hasil.length === 0) return res.status(401).json({ message: "User tidak ditemukan" });

        const user = hasil[0];
        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(401).json({ message: "Password salah!" });

        // Buat Token yang berisi ID dan ROLE
        const token = jwt.sign(
            { id: user.id, role: user.role },
            process.env.JWT_SECRET || "RAHASIA_NEGARA",
            { expiresIn: "1h" }
        );

        res.json({ 
            token, 
            user: {
                id: user.id,
                username: user.username,
                role: user.role
            }
        });
    });
});

module.exports = router;