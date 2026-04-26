# 📖 Panduan Belajar Membangun "PerpusKu" dari Nol

Selamat datang di Panduan Belajar Proyek **PerpusKu**! Dokumen ini ditulis khusus bagi Anda (atau developer lain) yang ingin mempelajari bagaimana aplikasi skala penuh (*Full-Stack*) dibangun mulai dari desain arsitektur, pembuatan API (*Backend*), antarmuka web (*Frontend*), hingga aplikasi ponsel pintar (*Mobile*).

Mari kita bedah proyek ini langkah demi langkah!

---

## 🏗️ 1. Memahami Arsitektur (Monorepo)

Proyek ini tidak hanya berisi satu aplikasi, melainkan **Tiga Aplikasi** yang hidup di dalam satu folder besar (*Monorepo*). 

**Struktur Folder:**
```text
/proyek-perpustakaan
├── /backend      -> Otak sistem (Node.js + Express)
├── /frontend     -> Wajah sistem untuk web (React 19 + Vite)
└── /mobile       -> Wajah sistem untuk HP (React Native + Expo)
```

**Alur Kerja (*Workflow*):**
1. **Frontend / Mobile** mengirimkan permintaan data (misal: "Minta daftar buku!") ke **Backend**.
2. **Backend** memeriksa apakah permintaan itu sah, lalu mencarinya di **Database MySQL**.
3. **Backend** merespons dengan data, dan **Frontend / Mobile** menampilkannya dengan cantik.

---

## 🧠 2. Membedah Backend (Node.js & Express)

Di dalam folder `/backend`, Anda akan menemukan pusat logika aplikasi.

### Konsep Penting:
- **`server.js`:** Ini adalah titik awal aplikasi. Ia menyiapkan *server* di Port 5000 dan menghubungkan rute-rute (URL).
- **`db.js`:** Mengatur koneksi ke database MySQL menggunakan library `mysql2`.
- **RBAC (Role-Based Access Control):** Sistem ini mengenal dua jenis aktor: `Admin` dan `User`.
- **JWT (JSON Web Token):** Saat Anda berhasil login, server memberikan sebuah tiket (Token JWT). Tiket ini harus Anda bawa setiap kali meminta data rahasia.

### Rute Utama (`/routes`):
- **`/api/auth/register` & `/login`:** Untuk membuat akun dan mendapatkan Token JWT. Kata sandi diamankan menggunakan `bcrypt`.
- **`/api/buku`:** Menyediakan fungsi CRUD (Create, Read, Update, Delete) untuk daftar buku. Penambahan/Penghapusan dilindungi *middleware* khusus Admin.
- **`/api/users`:** Menyediakan fungsi manajemen pengguna (Hanya Admin).

---

## 💻 3. Membedah Frontend (React & Vite)

Folder `/frontend` adalah aplikasi Web yang super cepat menggunakan React 19 dan bundler Vite.

### Konsep Penting:
- **`App.jsx`:** Pengatur jalan raya (*Router*). Jika Anda belum login, ia memaksa Anda ke halaman `/` (Landing). Jika Anda sudah login, Anda boleh masuk ke `/dashboard`.
- **State Management:** Menggunakan React Hooks seperti `useState` dan `useEffect` untuk menyimpan data buku sementara dan merespons perubahan.
- **Keamanan Halaman Web (`Layout.jsx`):** Saat *logout*, ia tidak hanya memindahkan URL, tapi menggunakan `window.location.href` untuk "menyegarkan" paksa sistem agar token benar-benar dibersihkan dari memori React.
- **Role-Based UI (`Dashboard.jsx` & `Users.jsx`):** 
  Jika yang login adalah **User Biasa**, tombol edit/hapus buku dan form tambah buku akan otomatis disembunyikan menggunakan *conditional rendering* (`{isAdmin && <form>...}`).

### Styling (Desain):
Menggunakan **Tailwind CSS**. Daripada menulis CSS di file terpisah, kita menggunakan *class* langsung di HTML (seperti `bg-dark`, `text-white`, `rounded-xl`). Tabel dibangun menggunakan **DataTables** yang kita modifikasi agar tetap elegan.

---

## 📱 4. Membedah Mobile App (React Native & Expo)

Aplikasi di folder `/mobile` memungkinkan sistem berjalan di Android & iOS.

### Konsep Penting:
- **Navigasi (*AppNavigator.js*):** Menggunakan React Navigation. Kita membuat `MainTabs` untuk tab bar di bawah layar, dan `Stack` untuk perpindahan layar penuh.
- **Penyimpanan Lokal (`AsyncStorage`):** Pengganti `localStorage` web untuk menyimpan token JWT di memori HP.
- **Axios Interceptor (`client.js`):** Sangat penting! Kode ini otomatis mencegat setiap *request* yang akan keluar dari HP dan menyisipkan tiket Token JWT ke dalamnya. Anda tidak perlu repot memasukkan token satu per satu.
- **SVG Transformer:** Pada Expo/React Native, logo `.svg` tidak bisa langsung dibaca. Kita memasang `react-native-svg-transformer` dan menyesuaikan `metro.config.js` agar file SVG bisa diimpor selayaknya komponen React.

---

## 🧪 5. Mengapa Kita Melakukan Testing?

Di proyek ini, kita mengatur `Vitest` (Frontend) dan `Jest` (Backend/Mobile).
Kenapa *testing* penting?
- Saat kode bertambah besar, mengubah fitur A bisa merusak fitur B tanpa Anda sadari.
- *Test script* (seperti `npm test`) adalah "robot" yang akan memeriksa ulang semua tombol dan fungsi penting dalam hitungan detik. Jika Anda merusak sesuatu, robot ini akan memperingatkan Anda (*Failed*).

---

## 🎯 Ringkasan & Saran Belajar Selanjutnya

Untuk benar-benar menguasai proyek ini, cobalah tantangan berikut secara berurutan:
1. **Pemanasan:** Coba ganti teks "Katalog Buku" di halaman Dashboard (Frontend) dengan kata lain.
2. **Menengah:** Coba buat tabel/database baru bernama `kategori_buku`. Lalu tambahkan rute `GET /api/kategori` di Backend.
3. **Ahli:** Hubungkan rute `/api/kategori` tersebut agar muncul sebagai opsi *dropdown* di aplikasi Web maupun Mobile.

*Selamat bereksplorasi dan membedah kode! Jangan takut melakukan kesalahan, karena versi kode asli yang stabil sudah dicadangkan secara aman di Git/GitHub.*
