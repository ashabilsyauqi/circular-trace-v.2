# 📋 PANDUAN IMPLEMENTASI ARSITEKTUR & BISNIS (KATEGORI 2)
**Project**: Circular Coffee Trace (CCT) / CircularTrace  
**Target Repositori**: `/Users/kingashabil/Desktop/CCT-coffee` & `/Users/kingashabil/Documents/Ashabil/marketplace`  
**Status**: Telah Dikonfirmasi & Disetujui oleh User (Ashabil Syauqi) & Prof. Dr. Novizar Nazir  

---

## 📌 KEPUTUSAN ARSITEKTUR & ALUR KERJA (APPROVED DECISIONS)

Berdasarkan konfirmasi resmi, berikut adalah 5 pilar kebijakan implementasi Kategori 2:

1. **[KEBIJAKAN 1] Hak Masuk Akun Baru (Login-First with Pending Badge)**:  
   User yang baru mendaftar **diizinkan langsung login** ke dalam sistem untuk melihat dashboard ekosistem, namun status akun diberi tanda `Menunggu Verifikasi`. Aksi kritikal (seperti rilis transaksi jual beli, pencetakan barcode resmi, atau sertifikasi final) dibatasi sampai disetujui.
2. **[KEBIJAKAN 2] Scope Resmi Menu Admin Kelompok Tani**:  
   Scope operasional Admin Kelompok Tani ditetapkan secara tegas mencakup 3 pilar internal:  
   * **1. Layanan Petani** (Data Master Petani, Data Kebun, Data Hasil Panen, Buku Kas/Ledger, Form Blanko Petani)  
   * **2. Layanan Pengolah** (Stasiun Wet Mill Internal, Penerimaan Ceri, Batch Olah, Stok Green Bean, Rilis Penjualan)  
   * **3. Petugas ICS** (Internal Control System, Verifikasi Lahan EUDR, Sertifikasi Kebun, Audit Lapangan)  
   * *(Menu Gudang Ekspor komersial, Roastery komersial, dan Cafe ritel tidak ditampilkan pada akun kelompok tani).*
3. **[KEBIJAKAN 3] Pendaftaran Petani Kopi Wajib Memilih Kelompok Tani**:  
   Saat mendaftar sebagai `Petani Kopi (Farmer)`, formulir wajib menampilkan dropdown pemilihan Kelompok Tani/Gapoktan tujuan, sehingga data petani otomatis masuk ke antrean verifikasi Ketua Kelompok Tani terkait.
4. **[KEBIJAKAN 4] Konfigurasi SMTP cPanel & Simulasi OTP Dev**:  
   Backend menyediakan pengiriman email berbasis SMTP cPanel resmi (`no-reply@circulartrace.id` port 465 SSL / 587 TLS) yang dikonfigurasi lewat `.env`, dengan fallback simulasi kode OTP di layar/response agar testing lokal tetap berjalan lancar jika server offline.
5. **[KEBIJAKAN 5] Standarisasi Dual-Driver Database (MySQL & SQLite)**:  
   Backend mendukung MySQL dan SQLite secara otomatis (*zero syntax error*). Kode mendeteksi jenis PDO driver dan menjalankan kueri yang valid untuk masing-masing mesin database.

---

## 🛠️ SPESIFIKASI TEKNIS IMPLEMENTASI

---

### 🔹 PILAR 1: Status Akun "Menunggu Verifikasi" & Pembatasan Transaksi
* **File Target**:
  * `public/api/auth.php`
  * `src/types/coffee.ts`
  * `src/context/CoffeeContext.tsx`
  * `src/components/adminlte/AdminLTENavbar.tsx`
* **Spesifikasi Teknis**:
  1. Tambahkan kolom status pada tabel `users` (atau mapping objek User di context):
     * `verification_status`: `'verified' | 'pending' | 'rejected'` (Default saat daftar baru: `'pending'`).
     * `kelompok_tani_id`: ID kelompok tani yang menaungi anggota.
  2. Saat user dengan status `'pending'` login:
     * Login tetap **berhasil (HTTP 200)**.
     * Di navbar bagian atas ditampilkan badge alert:
       ```tsx
       <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500/20 text-amber-800 dark:text-amber-200 border border-amber-300 dark:border-amber-700 rounded-full text-xs font-bold">
         <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />
         Status Akun: Menunggu Verifikasi Ketua Kelompok Tani / Admin
       </span>
       ```
  3. Pembatasan Transaksi:
     * Jika status `'pending'`, aksi tambah panen baru atau transaksi penjualan menampilkan modal info: *"Akun Anda sedang dalam antrean verifikasi oleh Ketua Kelompok Tani. Anda saat ini berada dalam mode jelajah dashboard."*

---

### 🔹 PILAR 2: Penataan Menu Sidebar Admin Kelompok Tani
* **File Target**:
  * `src/components/adminlte/AdminLTESidebar.tsx`
* **Spesifikasi Teknis**:
  1. Perjelas grouping menu di sidebar saat `userRole === 'admin_kelompok_tani'`:
     * **Header Group**: `PUSAT KENDALI GAPOKTAN (INTERNAL)`
     * **1. Layanan Petani** (Petani, Kebun, Panen Ceri, Buku Kas & Ledger)
     * **2. Layanan Pengolah Wet Mill** (Penerimaan Ceri, Fermentasi & Olah, Stok Green Bean Olahan)
     * **3. Petugas ICS Internal** (Verifikasi Lahan EUDR, Penilaian Kebun 4C, Audit Mutu Internal)
     * **Tautan Luar**: Buku Transaksi & Marketplace Kopi.
  2. Pastikan menu yang merupakan entitas komersial eksternal (Pergudangan Ekspor `userRole === 'gudang'`, Roastery Komersial `userRole === 'roaster'`, dan Cafe Pelanggan `userRole === 'cafe'`) **tetap terisolasi** dan hanya muncul untuk peran masing-masing.

---

### 🔹 PILAR 3: Dropdown Pemilihan Kelompok Tani pada Form Registrasi Petani
* **File Target**:
  * `src/components/RegisterModal.tsx`
  * `public/api/auth.php`
  * `src/components/admin/KelompokTaniDashboard.tsx` (Antrean Verifikasi)
* **Spesifikasi Teknis**:
  1. Di `RegisterModal.tsx`, jika user memilih card `selectedRole === 'petani'`:
     * Tampilkan dropdown field: **"Pilih Kelompok Tani / Gapoktan Penaung *"**
     * Opsi dropdown memuat daftar kelompok tani aktif (misal: *Gapoktan Kopi Mandiri Nusantara*, *Kelompok Tani Kopi Tilu Lestari*, *Koperasi Petani Malabar Preanger*).
  2. Simpan `kelompokTaniId` / `organization` pada data pendaftaran user.
  3. Pada dashboard Admin Kelompok Tani:
     * Tambahkan tab atau badge di menu **Data Master Petani**: `"Permohonan Anggota Baru (X Menunggu Persetujuan)"`.
     * Admin Kelompok Tani memiliki tombol aksi:
       * `[Setujui & Verifikasi Petani]` -> Mengubah status menjadi `'verified'`.
       * `[Tolak / Minta Perbaikan]` -> Mengubah status menjadi `'rejected'`.

---

### 🔹 PILAR 4: Modul Mailer SMTP cPanel & Fallback Dev OTP
* **File Target**:
  * `public/api/mailer.php` (Baru)
  * `public/api/config.php`
  * `public/api/auth.php`
* **Spesifikasi Teknis**:
  1. Buat helper `sendSystemEmail($toEmail, $subject, $htmlContent)` di `public/api/mailer.php`:
     * Menggunakan konfigurasi environment:
       * `SMTP_HOST`: e.g. `202.10.43.69` atau `mail.circulartrace.id`
       * `SMTP_PORT`: e.g. `465` (SSL) atau `587` (TLS)
       * `SMTP_USER`: e.g. `no-reply@circulartrace.id`
       * `SMTP_PASS`: e.g. kata sandi email cPanel
     * Menggunakan socket PHP TLS/SSL standar atau PHPMailer untuk mengirimkan email HTML formal.
  2. Fallback Mode Developer:
     * Jika server SMTP tidak merespons dalam 3 detik atau kredensial kosong, sistem mencatat OTP ke log dan mengembalikan parameter `resetCode` di response JSON.
     * Di antarmuka pengguna (`LoginPage.tsx`), muncul banner dev: *"Mode Dev: Kode OTP Verifikasi Anda adalah [XXXXXX]"*.

---

### 🔹 PILAR 5: Kompatibilitas Dual-Driver MySQL & SQLite
* **File Target**:
  * `public/api/config.php`
  * Seluruh file endpoint di `public/api/*.php`
* **Spesifikasi Teknis**:
  1. Di `config.php`:
     * Driver dideteksi otomatis via `$driver = $pdo->getAttribute(PDO::ATTR_DRIVER_NAME)`.
  2. Untuk seluruh operasi Upsert (Insert or Update):
     * **Jika MySQL**:
       ```sql
       INSERT INTO table (id, col1, col2) VALUES (:id, :c1, :c2)
       ON DUPLICATE KEY UPDATE col1 = :c1, col2 = :c2
       ```
     * **Jika SQLite**:
       ```sql
       INSERT INTO table (id, col1, col2) VALUES (:id, :c1, :c2)
       ON CONFLICT(id) DO UPDATE SET col1 = :c1, col2 = :c2
       ```
  3. Dengan pola ini, backend aman dijalankan oleh siapapun baik di server cPanel MySQL maupun di laptop developer lokal dengan SQLite.

---

## 🚀 RENCANA EKSEKUSI

Dokumen ini siap dijadikan acuan pengerjaan langsung. Langkah pengerjaan dapat dilakukan secara bertahap:
1. Penyesuaian `RegisterModal.tsx` (Dropdown Kelompok Tani).
2. Penyesuaian `AdminLTESidebar.tsx` (Pertegas scope Gapoktan vs eksternal).
3. Pembuatan `public/api/mailer.php` & konektor SMTP cPanel.
4. Implementasi dual-driver upsert pada API backend.
5. Verifikasi build (`npm run build`) dan pengujian alur pendaftaran petani hingga disetujui ketua kelompok.
