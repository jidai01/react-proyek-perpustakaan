/**
 * @file bukuRoutes.js
 * @description Definisi rute dan endpoint API untuk bukuRoutes.js.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
const express = require("express");
const router = express.Router();
const db = require("../db");
const { verifikasiToken, verifikasiAdmin } = require("../middleware/auth");

// 1. Ambil Semua + Pencarian + Pagination (Bisa diakses user & admin yang sudah login)
router.get("/", verifikasiToken, (req, res, next) => {

  const { cari } = req.query;
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;

  let countQuery = "SELECT COUNT(*) AS total FROM buku";
  let query = "SELECT * FROM buku";
  let params = [];

  if (cari) {
    const filter = " WHERE judul LIKE ? OR penulis LIKE ?";
    countQuery += filter;
    query += filter;
    params = [`%${cari}%`, `%${cari}%`];
  }

  // Langkah A: Hitung total
  db.query(countQuery, params, (err, countResult) => {
    if (err) return next(err);

    const totalData = countResult[0]?.total || 0;
    const totalHalaman = Math.ceil(totalData / limit) || 1;

    // Langkah B: Ambil data dengan LIMIT & OFFSET
    const sqlData = `${query} LIMIT ? OFFSET ?`;
    const dataParams = [...params, limit, offset];

    db.query(sqlData, dataParams, (err, hasil) => {
      if (err) return next(err);

      res.json({
        data: hasil || [],
        pagination: {
          totalData,
          totalHalaman,
          halamanSaatIni: page,
          limit,
        },
      });
    });
  });
});

// 2. Tambah Buku (Hanya Admin)
router.post("/", verifikasiAdmin, (req, res, next) => {
  const { judul, penulis } = req.body;
  const sqlCek = "SELECT * FROM buku WHERE judul = ? AND penulis = ?";
  db.query(sqlCek, [judul, penulis], (err, hasil) => {
    if (err) return next(err);
    if (hasil.length > 0) {
      return res.status(400).json({ message: "Buku ini sudah terdaftar! ⚠️" });
    }
    const sqlInsert = "INSERT INTO buku (judul, penulis) VALUES (?, ?)";
    db.query(sqlInsert, [judul, penulis], (err, hasilInsert) => {
      if (err) return next(err);
      res.json({
        message: "Buku berhasil ditambahkan! ✅",
        id: hasilInsert.insertId,
      });
    });
  });
});

// 3. Update Buku (Hanya Admin)
router.put("/:id", verifikasiAdmin, (req, res, next) => {
  const { id } = req.params;
  const { judul, penulis } = req.body;
  const sqlCek =
    "SELECT * FROM buku WHERE judul = ? AND penulis = ? AND id != ?";
  db.query(sqlCek, [judul, penulis, id], (err, hasil) => {
    if (err) return next(err);
    if (hasil.length > 0) {
      return res
        .status(400)
        .json({
          message: "Gagal update! Judul & penulis sudah ada di buku lain. ⚠️",
        });
    }
    const sqlUpdate = "UPDATE buku SET judul = ?, penulis = ? WHERE id = ?";
    db.query(sqlUpdate, [judul, penulis, id], (err) => {
      if (err) return next(err);
      res.json({ message: "Buku berhasil diperbarui! 📝" });
    });
  });
});

// 4. Hapus Buku (Hanya Admin)
router.delete("/:id", verifikasiAdmin, (req, res, next) => {
  const { id } = req.params;
  db.query("DELETE FROM buku WHERE id = ?", [id], (err) => {
    if (err) return next(err);
    res.json({ message: "Buku berhasil dihapus! 🗑️" });
  });
});

module.exports = router;

