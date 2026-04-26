# 📖 Panduan Belajar Membangun "PerpusKu" dari Nol

Selamat datang di Panduan Belajar Proyek **PerpusKu**! Dokumen ini ditulis secara mendalam bagi Anda yang ingin menguasai bagaimana aplikasi berskala penuh (*Full-Stack*) dirancang, dibangun, dan dihubungkan satu sama lain.

---

## 🏛️ 1. Mengapa Proyek Ini Dibagi Menjadi 3 Folder? (Arsitektur Monorepo)

Mungkin Anda bertanya-tanya, *"Mengapa tidak mencampur semua kodenya di dalam satu folder saja?"*

Dalam dunia *Software Engineering* profesional, kita memisahkan proyek menjadi **Frontend**, **Backend**, dan **Mobile** karena prinsip **Separation of Concerns (Pemisahan Tanggung Jawab)**:
1. **Backend (`/backend`)** murni bekerja sebagai pelayan (*Server/API*). Ia tidak peduli bagaimana tombol digambar di layar; tugasnya hanya memvalidasi data dan membaca/menulis ke *Database*.
2. **Frontend (`/frontend`)** dan **Mobile (`/mobile`)** murni bekerja sebagai wajah aplikasi (*Client*). Mereka tidak terhubung ke *Database* secara langsung. Mereka hanya tahu cara meminta data ke *Backend* dan menggambarkannya secara estetik di layar Web atau HP.

**Keuntungan arsitektur ini:** Jika besok Anda ingin membuat versi Desktop (misal pakai Electron) atau mengganti desain Web secara radikal, kode *Backend* (sistem database dan logika bisnis) tidak perlu diubah satu baris pun!

---

## 🛠️ 2. Senjata yang Digunakan (Framework & Libraries)

Proyek ini menggunakan ekosistem JavaScript (Node.js) di semua sisinya agar mudah dipelajari (satu bahasa untuk semua).

### A. Backend
- **Express.js**: Framework untuk membuat API. Sangat ringan dan mudah dipahami.
- **MySQL2**: Driver untuk menghubungkan aplikasi ke *database* MySQL.
- **Bcrypt**: Mengenkripsi (mengacak) *password* pengguna sebelum disimpan ke *database* agar tidak bisa dicuri.
- **JSON Web Token (JWT)**: Untuk membuat "tiket digital". Setelah pengguna *login*, mereka mendapat tiket JWT. Tiket ini harus dibawa jika ingin meminta data rahasia.
- **Helmet & Express Rate Limit**: Pengawal keamanan. Mencegah aplikasi dibombardir oleh ribuan *request* (*DDoS*) dan memblokir celah keamanan HTTP umum.

### B. Frontend (Web)
- **React 19 & Vite**: React berfungsi membuat komponen antarmuka, dan Vite adalah *bundler* yang membuat kode React berjalan sekilat kilat di *browser*.
- **Tailwind CSS**: Framework CSS. Daripada membuat file `.css` terpisah, kita mendesain elemen langsung menggunakan *class* (misal: `bg-blue-500 rounded-lg`).
- **Axios**: Kurir data. Berfungsi mengirim *request* HTTP (GET, POST, PUT, DELETE) ke *Backend*.
- **SweetAlert2**: Untuk menampilkan pop-up (*alert*) yang jauh lebih cantik daripada `alert()` bawaan *browser*.
- **DataTables**: Mengatur tabel buku/pengguna agar otomatis memiliki fitur *Search* dan *Pagination* tanpa perlu kita *coding* dari nol.

### C. Mobile (HP)
- **React Native & Expo**: Membuat aplikasi yang bisa dijalankan di Android dan iOS sekaligus dengan satu kode.
- **React Navigation**: Mengatur perpindahan layar (*Stack*) dan tab menu di bawah (*Bottom Tabs*).
- **AsyncStorage**: Mirip seperti gudang lokal di HP untuk menyimpan Token JWT agar pengguna tidak perlu *login* setiap kali membuka aplikasi.

---

## 🗄️ 3. Struktur Database (MySQL)

Sistem ini sangat sederhana namun kokoh, hanya menggunakan 2 tabel utama:

### Tabel `users` (Manajemen Akun)
Tabel ini menyimpan data siapa saja yang berhak masuk ke aplikasi.
- `id` (INT, Primary Key, Auto Increment): ID unik pengguna.
- `username` (VARCHAR): Nama login pengguna (harus unik).
- `password` (VARCHAR): Kata sandi yang **sudah dienkripsi** (Bcrypt). JANGAN menyimpan *password* asli.
- `role` (ENUM): Nilainya hanya bisa `'admin'` atau `'user'`. Inilah penentu hak akses (RBAC).
- `created_at` (TIMESTAMP): Waktu akun dibuat.

### Tabel `buku` (Katalog Perpustakaan)
- `id` (INT, Primary Key, Auto Increment): ID unik buku.
- `judul` (VARCHAR): Judul buku.
- `penulis` (VARCHAR): Nama penulis buku.
- `created_at` & `updated_at` (TIMESTAMP): Pencatatan riwayat penambahan/perubahan buku.

---

## 📂 4. Bedah Anatomi Folder Secara Rinci

Mari kita intip isi file penting di dalam masing-masing folder:

### 🧩 Folder Backend
```text
/backend
 ├── /middleware
 │    └── auth.js       -> Petugas tiket. Memeriksa apakah Token JWT valid dan apakah dia seorang Admin.
 ├── /routes
 │    ├── authRoutes.js -> Mengatur URL /register dan /login.
 │    └── bukuRoutes.js -> Mengatur URL CRUD buku (/api/buku).
 ├── db.js              -> File konektor ke database MySQL.
 ├── server.js          -> Jantung server. Tempat semua 'routes' dan 'middleware' dirakit.
 └── seed.js            -> Script untuk memasukkan data awal (akun Admin pertama) ke database kosong.
```

### 🧩 Folder Frontend
```text
/frontend
 ├── /src
 │    ├── /components
 │    │    └── Layout.jsx   -> Rangka luar web (Sidebar/Navbar) yang membungkus semua halaman.
 │    ├── /pages
 │    │    ├── Login.jsx    -> Halaman masuk. Memanggil API dan menyimpan Token di localStorage.
 │    │    ├── Dashboard.jsx-> Halaman daftar buku. Terdapat logika "Sembunyikan tombol Edit jika role bukan Admin".
 │    │    └── Users.jsx    -> Halaman rahasia. Hanya bisa dirender jika role = Admin.
 │    ├── App.jsx           -> Penjaga gerbang (Router). Jika belum login, dilempar ke halaman Landing.
 │    └── main.jsx          -> File yang menempelkan React ke dalam file HTML asli.
```

### 🧩 Folder Mobile
```text
/mobile
 ├── /src
 │    ├── /api
 │    │    └── client.js    -> Pengaturan Axios khusus. Memiliki 'Interceptor' yang diam-diam menempelkan Token JWT di setiap request.
 │    ├── /navigation
 │    │    └── AppNavigator.js -> Peta aplikasi. Menentukan ke mana layar berpindah.
 │    ├── /screens
 │    │    └── [Halaman]    -> File tampilan layar (Mirip folder /pages di Frontend).
 └── app.json               -> File konfigurasi Expo (Nama aplikasi, logo, SDK version).
```

---

## 🔐 5. Alur Logika: Bagaimana RBAC (Hak Akses) Bekerja?

*Role-Based Access Control* (RBAC) di proyek ini diterapkan berlapis (Di Client dan di Server):

1. **Proteksi Lapis 1 (UI - Frontend/Mobile):**
   Jika Anda login sebagai `user`, aplikasi membaca nilai `role: "user"` dari memori (LocalStorage/AsyncStorage). Aplikasi **menyembunyikan** tombol hapus, mengunci tab "Manajemen User", dan hanya menampilkan tombol lihat.
   
2. **Proteksi Lapis 2 (Server - Backend):**
   Bagaimana jika pengguna tipe `user` iseng meretas dengan mengirimkan perintah `DELETE /api/buku/1` menggunakan Postman atau Terminal?
   **Backend akan menolaknya.** Di dalam `bukuRoutes.js`, proses `DELETE` dilindungi oleh `verifikasiAdmin`. Middleware ini membongkar Token JWT, melihat isinya, dan mendapati bahwa pengirimnya adalah `user`, sehingga koneksi langsung diputus dengan pesan *"Akses Ditolak"*.

Oleh karena itu, keamanan selalu bergantung pada Backend, sementara Frontend hanya bertugas membuat UI lebih nyaman.

---

## 🎯 6. Ringkasan & Saran Belajar Selanjutnya

Untuk menguasai kode ini, berhentilah sekadar membaca dan mulailah merusaknya!
1. **Langkah 1:** Coba paksa ubah *password* Anda di database langsung menjadi "123". Anda tidak akan bisa *login* karena *password* 123 tidak sesuai dengan enkripsi *Bcrypt*!
2. **Langkah 2:** Tambahkan satu kolom baru bernama `tahun_terbit` di tabel `buku`. Ubah *Backend* agar mau menerima dan menyimpan kolom tersebut.
3. **Langkah 3:** Ubah `Dashboard.jsx` di Frontend agar menampilkan tabel tambahan untuk `tahun_terbit`.

*Selamat bereksplorasi! Jangan takut merusak kode lokal Anda, perbaikan hanya sejarak "Git Undo".*
