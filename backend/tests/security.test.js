/**
 * @file security.test.js
 * @description Modul pendukung untuk logika bisnis atau utilitas proyek.
 * Dokumentasi ini digenerate secara otomatis untuk mempermudah navigasi kode.
 */
const request = require("supertest");
const app = require("../server");
const db = require("../db");

describe("Security & API Integration Tests", () => {
  
  // Test 1: Proteksi Route (Sekarang harus gagal karena kita sudah pasang verifikasiToken)
  test("Harus menolak akses ke /api/buku tanpa token (401)", async () => {
    const res = await request(app).get("/api/buku");
    expect(res.statusCode).toBe(401);
  });

  // Test 2: Invalid Login
  test("Harus menolak login dengan user yang tidak ada", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "user_palsu_123", password: "wrongpassword" });
    
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("User tidak ditemukan");
  });

  test("Harus menolak login dengan password salah", async () => {
    // Kita asumsikan ada user 'admin' dari seeder
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "admin", password: "password_salah" });
    
    expect(res.statusCode).toBe(401);
    expect(res.body.message).toBe("Password salah!");
  });

  // Test 3: SQL Injection Prevention (Basic check)
  test("Harus aman dari SQL Injection sederhana pada login", async () => {
    const res = await request(app)
      .post("/api/auth/login")
      .send({ username: "' OR '1'='1", password: "' OR '1'='1" });
    
    expect(res.statusCode).toBe(401);
  });

  // Test 4: Header security (Helmet)
  test("Header security (Helmet) harus terpasang", async () => {
    const res = await request(app).get("/");
    // Supertest menggunakan lowercase untuk keys di headers
    expect(res.headers).toHaveProperty("x-content-type-options");
    expect(res.headers).toHaveProperty("x-frame-options");
  });
});

afterAll(async () => {
  await db.end();
});
