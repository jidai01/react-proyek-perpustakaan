/**
 * @file db.js
 * @description Konfigurasi koneksi ke database MySQL.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
require("dotenv").config();
const mysql = require("mysql2");

// Menggunakan Pool agar lebih stabil dan mendukung promise()
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

// Tes koneksi saat startup
pool.getConnection((err, connection) => {
  if (err) {
    console.error("Gagal terhubung ke database: ❌", err.message);
  } else {
    console.log("Database terhubung! 🗄️");
    connection.release();
  }
});

module.exports = pool;

