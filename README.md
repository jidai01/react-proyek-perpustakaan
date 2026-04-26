# 📚 PerpusKu - Sistem Perpustakaan Digital Tercanggih

Selamat datang di repositori **PerpusKu**, sebuah sistem manajemen perpustakaan modern berskala penuh yang dibangun dengan teknologi terkini. Sistem ini memiliki 3 subsistem utama: **Backend** (RESTful API), **Frontend** (Web App untuk Admin & Pengunjung), dan **Mobile** (Aplikasi Native untuk Pengguna).

![Project Architecture](https://img.shields.io/badge/Architecture-Monorepo-blue.svg)
![React Version](https://img.shields.io/badge/React-19.x-61dafb.svg)
![React Native Version](https://img.shields.io/badge/Expo-SDK%2054-000020.svg)
![Express Version](https://img.shields.io/badge/Express-4.x-lightgrey.svg)
![License](https://img.shields.io/badge/License-MIT-green.svg)

---

## ✨ Fitur Utama

- **Role-Based Access Control (RBAC):** Sistem mengelola hak akses secara cerdas antara `Admin` dan `User`.
- **Manajemen Katalog Buku:** Tambah, Edit, Hapus, dan Cari buku secara instan.
- **Manajemen Pengguna (Admin Only):** Admin dapat membuat, memodifikasi, dan menghapus akun pengguna (namun dicegah untuk menghapus akun Admin lainnya).
- **Keamanan Lapis Ganda:** API dilindungi oleh autentikasi JWT (JSON Web Tokens), enkripsi *password* menggunakan Bcrypt, dan *interceptors* untuk memblokir akses tanpa token valid.
- **Testing Otomatis:** Dilengkapi dengan sistem tes otomatis menggunakan Jest, Vitest, dan React Native Testing Library.
- **Responsif & Premium UI:** Dirancang dengan estetika minimalis, mode *clean-dark/light*, serta efek transisi modern menggunakan Tailwind CSS.

---

## 🛠️ Tech Stack

### 1. Backend (`/backend`)
- **Framework:** Node.js + Express.js
- **Database:** MySQL
- **Keamanan:** JWT (`jsonwebtoken`), Bcrypt, Dotenv, Helmet, Express Rate Limit
- **Testing:** Jest + Supertest

### 2. Frontend (`/frontend`)
- **Framework:** React 19 + Vite
- **Styling:** Tailwind CSS + SweetAlert2 + Bootstrap Icons
- **HTTP Client:** Axios
- **State/Routing:** React Router v7
- **Testing:** Vitest + React Testing Library (JSDOM)

### 3. Mobile App (`/mobile`)
- **Framework:** React Native + Expo (SDK 54)
- **Styling:** Vanilla StyleSheet + SVG Support (`react-native-svg-transformer`)
- **Navigasi:** React Navigation (Stack + Bottom Tabs)
- **HTTP Client:** Axios (dengan Interceptor JWT)
- **Testing:** Jest + React Test Renderer

---

## 💻 Persyaratan Sistem (Requirements)

Sebelum melakukan instalasi dan *cloning*, pastikan komputer Anda telah memenuhi perangkat lunak (*software*) berikut:

1. **Git:** v2.x atau lebih baru (Untuk melakukan cloning).
2. **Node.js:** v18.x LTS atau lebih baru (Disarankan menggunakan NVM).
3. **NPM / Yarn:** Bawaan dari instalasi Node.js.
4. **MySQL:** v8.x atau MariaDB yang setara (Bisa menggunakan XAMPP/MAMP).
5. **Expo Go:** Aplikasi mobile yang di-install di *smartphone* Anda (Tersedia di PlayStore / AppStore) jika ingin melakukan pengujian versi *mobile*.

---

## 📥 Tutorial Cloning & Persiapan Awal

Langkah-langkah berikut akan membantu Anda mengunduh (*clone*) kode sumber dari repositori Git ke mesin lokal Anda:

1. **Buka Terminal / Command Prompt** di direktori tujuan Anda.
2. **Jalankan perintah Clone:**
   ```bash
   git clone https://github.com/jidai01/perpusku.git
   ```
   *(Catatan: Gantilah URL di atas dengan URL repositori asli Anda)*
3. **Masuk ke dalam Folder Proyek:**
   ```bash
   cd perpusku
   ```
4. **Buka Code Editor:** 
   Sangat direkomendasikan menggunakan Visual Studio Code (VSCode).
   ```bash
   code .
   ```

Setelah tahap *cloning* berhasil dilakukan, silakan ikuti Panduan Instalasi di bawah ini untuk mengonfigurasi masing-masing sisi sistem (*Backend*, *Frontend*, dan *Mobile*).

---

## 🚀 Panduan Instalasi & Menjalankan Aplikasi

Pastikan Anda memiliki **Node.js** dan **MySQL** yang telah berjalan di mesin lokal Anda.

### A. Persiapan Database
1. Buka MySQL / phpMyAdmin Anda.
2. Buat database baru bernama `perpustakaan_db` (sesuai nama DB di *backend*).
3. Import atau jalankan *query* tabel yang dibutuhkan.

### B. Menjalankan Backend
1. Masuk ke folder backend: `cd backend`
2. Instal dependensi: `npm install`
3. Konfigurasi Environment: 
   Buat file `.env` di dalam folder `backend`:
   ```env
   PORT=5000
   DB_HOST=localhost
   DB_USER=root
   DB_PASSWORD=password_database_anda
   DB_NAME=perpustakaan_db
   JWT_SECRET=rahasia_super_aman
   ```
4. Jalankan server: `npm run dev` atau `node server.js`

### C. Menjalankan Frontend Web
1. Masuk ke folder frontend: `cd frontend`
2. Instal dependensi: `npm install`
3. Konfigurasi API:
   Pastikan file `.env` di folder `frontend` berisi:
   ```env
   VITE_API_URL=http://localhost:5000/api
   VITE_APP_NAME=PerpusKu
   ```
4. Jalankan web: `npm run dev`
5. Buka `http://localhost:5173` di *browser*.

### D. Menjalankan Mobile App
1. Masuk ke folder mobile: `cd mobile`
2. Instal dependensi: `npm install`
3. Sesuaikan URL API: 
   Buka `src/api/client.js` dan pastikan `baseURL` mengarah ke IP Address komputer Anda (bukan `localhost`), contoh: `http://192.168.1.x:5000/api`.
4. Jalankan Expo: `npx expo start --clear`
5. Scan QR Code menggunakan aplikasi **Expo Go** di *smartphone* Anda.

---

## 🧪 Skrip Pengujian (Testing)

Proyek ini menjunjung tinggi kualitas kode (*Code Quality*). Berikut cara menjalankan tes di masing-masing lingkungan:

**1. Backend:**
```bash
cd backend
npm test
```

**2. Frontend:**
```bash
cd frontend
npm test
```

**3. Mobile:**
```bash
cd mobile
npm test
```

---

## 🔐 Logika Otorisasi (RBAC)

- **Admin:** Dapat mengakses semua halaman (`/dashboard`, `/users`). Dapat menambah, mengedit, dan menghapus Buku serta Pengguna.
- **User:** Hanya dapat mengakses Dashboard (`/dashboard`). Tidak dapat melihat form penambahan, maupun tombol Edit & Hapus buku. Jika mencoba masuk secara paksa ke `/users` (via URL), akan dicegat oleh proteksi halaman (Tampil peringatan "Akses Terbatas").

---

*Dikembangkan dengan penuh ketelitian dan fokus pada skalabilitas serta kenyamanan pengalaman pengguna (UX).*
