const jwt = require("jsonwebtoken");

// 1. Verifikasi Token (Hanya cek apakah user sudah login)
const verifikasiToken = (req, res, next) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];

    if (!token) return res.status(401).json({ message: "Akses ditolak! Silakan login terlebih dahulu. 🔒" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || "RAHASIA_NEGARA");
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ message: "Sesi Anda telah berakhir atau token tidak sah." });
    }
};

// 2. Verifikasi Admin (Cek apakah user login DAN memiliki role admin)
const verifikasiAdmin = (req, res, next) => {
    verifikasiToken(req, res, () => {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: "Akses ditolak! Fitur ini khusus untuk Administrator. 🚫" });
        }
        next();
    });
};

module.exports = { verifikasiToken, verifikasiAdmin };