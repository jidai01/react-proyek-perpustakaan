/**
 * @file server.js
 * @description Titik masuk utama (Entry point) untuk server Express backend.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
require("dotenv").config();
const express = require("express");
const cors = require("cors");
const helmet = require("helmet");
const rateLimit = require("express-rate-limit");
const bukuRoutes = require("./routes/bukuRoutes");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");

const app = express();

// 1. Security Headers
app.use(helmet({
  crossOriginResourcePolicy: false, // Izinkan resource diakses lintas origin (penting untuk mobile)
}));

// 2. Rate Limiting (Mencegah Brute Force & DDoS)
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, 
  max: 100, 
  message: { message: "Terlalu banyak permintaan, coba lagi nanti. ⚠️" }
});
app.use("/api/", limiter); 

// 3. CORS Configuration
const allowedOrigins = [
  process.env.FRONTEND_URL,
  "http://localhost:5173",
  "http://localhost:8081",
  "http://127.0.0.1:8081",
  "http://192.168.1.8:8081" // IP Lokal Anda
];

app.use(cors({
    origin: allowedOrigins,
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true
}));



app.use(express.json());

// --- ROUTES ---
app.use("/api/auth", authRoutes);
app.use("/api/buku", bukuRoutes);
app.use("/api/users", userRoutes);

app.get("/", (req, res) => {
  res.send(`${process.env.APP_NAME || 'API Perpustakaan'} berjalan lancar! 🚀`);
});

// --- ERROR HANDLING ---
app.use((err, req, res, next) => {
  console.error("LOG ERROR:", err.stack);
  res.status(err.status || 500).json({
    success: false,
    message: err.message || "Terjadi kesalahan pada server! ⚠️",
  });
});

const PORT = process.env.PORT || 5000;
if (process.env.NODE_ENV !== 'test') {
  app.listen(PORT, () => {
    console.log(`Server ${process.env.APP_NAME || 'PerpusKu'} berjalan di port ${PORT} 🚀`);
  });
}

module.exports = app;