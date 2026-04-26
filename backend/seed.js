const db = require("./db");
const bcrypt = require("bcryptjs");

const bukuValues = [
  ["Filosofi Teras", "Henry Manampiring"],
  ["Atomic Habits", "James Clear"],
  ["Bumi", "Tere Liye"],
  ["Laskar Pelangi", "Andrea Hirata"],
  ["Sapiens", "Yuval Noah Harari"],
  ["Rich Dad Poor Dad", "Robert Kiyosaki"],
  ["The Psychology of Money", "Morgan Housel"],
  ["Dunia Sophie", "Jostein Gaarder"],
  ["Negeri 5 Menara", "A. Fuadi"],
  ["Start With Why", "Simon Sinek"],
  ["Man's Search for Meaning", "Viktor Frankl"],
  ["Ikigai", "Héctor García"],
  ["The Alchemist", "Paulo Coelho"],
  ["Grit", "Angela Duckworth"],
  ["Deep Work", "Cal Newport"],
  ["Madre", "Dee Lestari"],
  ["Pulang", "Leila S. Chudori"],
  ["Cantik Itu Luka", "Eka Kurniawan"],
  ["Hujan", "Tere Liye"],
  ["Sepatu Dahlan", "Khrisna Pabichara"],
  ["The 5 AM Club", "Robin Sharma"],
  ["Thinking, Fast and Slow", "Daniel Kahneman"],
  ["Zero to One", "Peter Thiel"],
  ["The Lean Startup", "Eric Ries"],
  ["Good to Great", "Jim Collins"],
  ["Harry Potter", "J.K. Rowling"],
  ["The Hobbit", "J.R.R. Tolkien"],
  ["Sherlock Holmes", "Sir Arthur Conan Doyle"],
  ["1984", "George Orwell"],
  ["Brave New World", "Aldous Huxley"]
];


const seedData = async () => {
  try {
    console.log("Memulai proses reset dan seeding database... ⏳");

    // Matikan pemeriksaan foreign key sementara
    await db.promise().query("SET FOREIGN_KEY_CHECKS = 0");

    // 1. Hapus Tabel Lama (jika ada)
    await db.promise().query("DROP TABLE IF EXISTS buku");
    await db.promise().query("DROP TABLE IF EXISTS users");
    console.log("Tabel lama berhasil dihapus. 🗑️");

    // 2. Buat Tabel 'users' dari Nol
    const sqlCreateUsers = `
      CREATE TABLE users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(50) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'user') DEFAULT 'user'
      )
    `;
    await db.promise().query(sqlCreateUsers);
    console.log("Tabel 'users' berhasil dibuat ulang. ✅");

    // 3. Buat Tabel 'buku' dari Nol
    const sqlCreateBuku = `
      CREATE TABLE buku (
        id INT AUTO_INCREMENT PRIMARY KEY,
        judul VARCHAR(100) NOT NULL,
        penulis VARCHAR(100) NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `;
    await db.promise().query(sqlCreateBuku);
    console.log("Tabel 'buku' berhasil dibuat ulang. ✅");

    // 4. Masukkan Data User (Admin & Dummy)
    const hashedPass = await bcrypt.hash("admin123", 10);
    const sqlInsertUser = "INSERT INTO users (username, password, role) VALUES (?, ?, ?)";

    await db.promise().query(sqlInsertUser, ["admin", hashedPass, "admin"]);
    await db.promise().query(sqlInsertUser, ["user1", hashedPass, "user"]);
    await db.promise().query(sqlInsertUser, ["user2", hashedPass, "user"]);
    await db.promise().query(sqlInsertUser, ["user3", hashedPass, "user"]);
    await db.promise().query(sqlInsertUser, ["user4", hashedPass, "user"]);
    await db.promise().query(sqlInsertUser, ["user5", hashedPass, "user"]);
    await db.promise().query(sqlInsertUser, ["user6", hashedPass, "user"]);
    console.log("Seeder User selesai (admin, user1-user6). 👤");

    // 5. Masukkan Data Buku
    const sqlInsertBuku = "INSERT INTO buku (judul, penulis) VALUES ?";
    const [hasilBuku] = await db.promise().query(sqlInsertBuku, [bukuValues]);
    console.log(`Seeder Buku selesai. Berhasil menambahkan ${hasilBuku.affectedRows} buku. 📚`);

    // Hidupkan kembali pemeriksaan foreign key
    await db.promise().query("SET FOREIGN_KEY_CHECKS = 1");

    console.log("\nDatabase berhasil di-reset dan di-seed dengan sukses! 🚀");
    process.exit();
  } catch (err) {
    console.error("\nTerjadi kesalahan saat proses seeding: ❌", err.message);
    await db.promise().query("SET FOREIGN_KEY_CHECKS = 1");
    process.exit(1);
  }
};

seedData();
