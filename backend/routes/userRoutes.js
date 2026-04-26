const express = require("express");
const router = express.Router();
const db = require("../db");
const bcrypt = require("bcryptjs");
const { verifikasiAdmin } = require("../middleware/auth");

// Semua route di sini diproteksi oleh verifikasiAdmin
router.use(verifikasiAdmin);

// 1. Ambil Semua User (Dengan Pagination & Pencarian)
router.get("/", async (req, res, next) => {
    console.log("LOG: Mengambil daftar user... 🔍");
    const { cari } = req.query;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const offset = (page - 1) * limit;

    try {
        let countQuery = "SELECT COUNT(*) AS total FROM users";
        let dataQuery = "SELECT id, username, role FROM users";
        let params = [];

        if (cari) {
            countQuery += " WHERE username LIKE ?";
            dataQuery += " WHERE username LIKE ?";
            params.push(`%${cari}%`);
        }

        // A. Hitung total data
        const [totalResult] = await db.promise().query(countQuery, params);
        const totalData = totalResult[0].total;
        const totalHalaman = Math.ceil(totalData / limit) || 1;

        // B. Ambil data dengan limit & offset
        dataQuery += " LIMIT ? OFFSET ?";
        const [hasil] = await db.promise().query(dataQuery, [...params, limit, offset]);

        console.log(`LOG: Berhasil mengambil ${hasil.length} user (Halaman ${page}). ✅`);
        res.json({
            data: hasil,

            pagination: {
                totalData,
                totalHalaman,
                halamanSaatIni: page,
                limit
            }
        });
    } catch (err) {
        console.error("LOG ERROR: Gagal mengambil user:", err.message);
        next(err);
    }
});


// 2. Tambah User Baru
router.post("/", async (req, res, next) => {
    const { username, password, role } = req.body;
    console.log(`LOG: Menambahkan user baru: ${username} (${role})... ➕`);
    
    if (!username || !password) {
        return res.status(400).json({ message: "Username dan password wajib diisi!" });
    }

    try {
        const hashedPass = await bcrypt.hash(password, 10);
        await db.promise().query("INSERT INTO users (username, password, role) VALUES (?, ?, ?)",
            [username, hashedPass, role || 'user']);
        console.log("LOG: User berhasil ditambahkan. ✅");
        res.json({ message: "User berhasil ditambahkan! ✅" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.warn(`LOG WARNING: Username ${username} sudah ada.`);
            return res.status(400).json({ message: "Username sudah digunakan!" });
        }
        console.error("LOG ERROR: Gagal tambah user:", err.message);
        next(err);
    }
});

// 3. Update User
router.put("/:id", async (req, res, next) => {
    const { id } = req.params;
    const { username, password, role } = req.body;
    console.log(`LOG: Memperbarui user ID ${id}: ${username}... 📝`);

    if (!username || !role) {
        return res.status(400).json({ message: "Username dan role wajib diisi!" });
    }

    try {
        let sql = "UPDATE users SET username = ?, role = ?";
        let params = [username, role];

        if (password && password.trim() !== "") {
            const hashedPass = await bcrypt.hash(password, 10);
            sql += ", password = ?";
            params.push(hashedPass);
        }

        sql += " WHERE id = ?";
        params.push(id);

        await db.promise().query(sql, params);
        console.log("LOG: User berhasil diperbarui. ✅");
        res.json({ message: "User berhasil diperbarui! 📝" });
    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            console.warn(`LOG WARNING: Username ${username} sudah ada.`);
            return res.status(400).json({ message: "Username sudah digunakan!" });
        }
        console.error("LOG ERROR: Gagal update user:", err.message);
        next(err);
    }
});

// 4. Hapus User
router.delete("/:id", async (req, res, next) => {
    const { id } = req.params;
    console.log(`LOG: Menghapus user ID ${id}... 🗑️`);
    
    if (req.user.id == id) {
        return res.status(400).json({ message: "Anda tidak bisa menghapus akun Anda sendiri!" });
    }

    try {
        await db.promise().query("DELETE FROM users WHERE id = ?", [id]);
        console.log("LOG: User berhasil dihapus. ✅");
        res.json({ message: "User berhasil dihapus! 🗑️" });
    } catch (err) {
        console.error("LOG ERROR: Gagal hapus user:", err.message);
        next(err);
    }
});

module.exports = router;


