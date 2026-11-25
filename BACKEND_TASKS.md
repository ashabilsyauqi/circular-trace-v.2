# PANDUAN TEKNIS & INSTRUKSI PENGERJAAN BACKEND API
## Proyek: sangrAI / Circular Trace (CCT-Coffee)
**Target Stack:** PHP 8.x • PDO (SQLite File-Based Default & MySQL cPanel) • REST API JSON  
**Direktori Kode Backend:** `public/api/`  
**Database Schema:** `database/schema.sql` | `public/api/data/cct_database.sqlite`

---

## 📌 1. KONTEKS DOMAIN & MODEL BISNIS
Sistem ini berfokus pada **Kelompok Tani / Gapoktan** sebagai entitas induk (*Tenant*) produsen kopi spesialti yang membawahi 3 pilar operasional internal:
1. **Petani (Hulu Kebun):** Registrasi lahan, koordinat poligon EUDR, dan pencatatan panen ceri merah.
2. **Pengolah (Wet/Dry Mill):** Penerimaan ceri, 7 metode olah/fermentasi, pencatatan rendemen & limbah sirkular, produksi green bean.
3. **Verifikator Mutu / Petugas ICS (Internal Control System):** Audit lahan bebas deforestasi, uji brix ceri, audit sertifikasi CT-4CI/Fairtrade, dan penerbitan stempel mutu digital.

Sedangkan pihak hilir adalah **Mitra Pembeli (*Commercial Buyers/Partners*)**:
* **Gudang (Warehouse QA):** Penyimpanan hermetik klimatik, sortasi defect, kadar air, grading SCA.
* **Roaster (Roastery ERP):** Penyangraian artisan, kurva RoR/Agtron, lembar cupping SCA.
* **Cafe & Barista:** Penjualan retail seduh, pencetakan QR paspor digital cangkir konsumen.
* **Super Admin:** Pengelola paket layanan, kuota tenant, dan telemetri ekosistem.

---

## 🎯 2. TUJUAN UTAMA BACKEND REFACTORING
1. **Menghapus Seluruh Celah Keamanan Fatal** (Bypass password, OTP bocor di response JSON, endpoint tanpa proteksi).
2. **Menerapkan Middleware Autentikasi Berbasis Token** (Bearer Token / Session Token di header HTTP).
3. **Menerapkan Multi-Tenancy Ketat (`kelompok_tani_id`)** agar data antar kelompok tani terisolasi penuh.
4. **Menerapkan Approval Gate 3 Pilar:** Pendaftar Petani, Pengolah, dan Verifikator berstatus `pending` dan wajib di-approve oleh Ketua Kelompok Tani sebelum memiliki hak akses aktif.
5. **Integritas Transaksi Rantai Pasok (Atomic Transactions):** Pembelian ceri harus memotong saldo lot panen secara transaksional, dan penelusuran QR publik (`trace.php`) harus mengambil data asli dari database (bukan fallback data fiktif).

---

## 🗄️ 3. TAHAP 1: SKEMA DATABASE & MIGRASI

Buka dan perbarui file database (`database/schema.sql` dan inisialisasi di `public/api/config.php`):

### A. Tabel `users`
Pastikan kolom berikut ada dan berindeks:
```sql
ALTER TABLE `users` ADD COLUMN `kelompok_tani_id` VARCHAR(50) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `kelompok_tani_name` VARCHAR(150) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `verification_status` VARCHAR(20) DEFAULT 'pending'; -- 'pending', 'verified', 'rejected'
ALTER TABLE `users` ADD COLUMN `verified_by` VARCHAR(100) DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `verified_at` DATETIME DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `verification_notes` TEXT DEFAULT NULL;
ALTER TABLE `users` ADD COLUMN `is_email_verified` TINYINT(1) DEFAULT 0;
ALTER TABLE `users` ADD COLUMN `status` VARCHAR(20) DEFAULT 'active'; -- 'active', 'suspended', 'inactive'
```

### B. Tabel `user_tokens` (Session & API Token)
Buat tabel baru untuk token login aktif:
```sql
CREATE TABLE IF NOT EXISTS `user_tokens` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT, -- (Gunakan INT AUTO_INCREMENT untuk MySQL)
    `user_id` VARCHAR(50) NOT NULL,
    `token` VARCHAR(128) NOT NULL UNIQUE,
    `role` VARCHAR(30) NOT NULL,
    `kelompok_tani_id` VARCHAR(50) DEFAULT NULL,
    `ip_address` VARCHAR(45),
    `user_agent` TEXT,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS `idx_user_tokens_token` ON `user_tokens`(`token`);
CREATE INDEX IF NOT EXISTS `idx_user_tokens_user_id` ON `user_tokens`(`user_id`);
```

### C. Tabel `password_resets` (Manajemen OTP Aman)
```sql
CREATE TABLE IF NOT EXISTS `password_resets` (
    `id` INTEGER PRIMARY KEY AUTOINCREMENT,
    `email` VARCHAR(150) NOT NULL,
    `otp_hash` VARCHAR(255) NOT NULL,
    `attempts` INTEGER DEFAULT 0,
    `is_used` TINYINT(1) DEFAULT 0,
    `expires_at` DATETIME NOT NULL,
    `created_at` DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE INDEX IF NOT EXISTS `idx_password_resets_email` ON `password_resets`(`email`);
```

### D. Multi-Tenancy Foreign Keys pada Tabel Rantai Pasok
Pastikan tabel berikut memiliki kolom `kelompok_tani_id` untuk isolasi data:
* `farmer_harvest_lots` (`kelompok_tani_id` VARCHAR(50))
* `coffee_farms` (`kelompok_tani_id` VARCHAR(50))
* `processing_batches` (`kelompok_tani_id` VARCHAR(50))
* `processed_green_bean_lots` (`kelompok_tani_id` VARCHAR(50))

---

## 🔒 4. TAHAP 2: AUTENTIKASI, KEAMANAN & MIDDLEWARE (`public/api/config.php`)

Tambahkan fungsi pembantu keamanan di `public/api/config.php`:

### 1. Fungsi Ekstraksi Token dari Header
```php
function getBearerToken() {
    $headers = null;
    if (isset($_SERVER['Authorization'])) {
        $headers = trim($_SERVER['Authorization']);
    } else if (isset($_SERVER['HTTP_AUTHORIZATION'])) {
        $headers = trim($_SERVER['HTTP_AUTHORIZATION']);
    } elseif (function_exists('apache_request_headers')) {
        $requestHeaders = apache_request_headers();
        $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
        if (isset($requestHeaders['Authorization'])) {
            $headers = trim($requestHeaders['Authorization']);
        }
    }
    
    if (!empty($headers)) {
        if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
            return $matches[1];
        }
    }
    return null;
}
```

### 2. Middleware `requireAuth()`
Wajib memeriksa token yang valid dan belum expired:
```php
function requireAuth($pdo, $allowedRoles = []) {
    $token = getBearerToken();
    if (!$token) {
        sendError('Akses ditolak. Token otentikasi (Bearer Token) tidak ditemukan.', 401);
    }

    $stmt = $pdo->prepare("SELECT ut.*, u.name, u.email, u.status as user_status, u.verification_status 
                           FROM `user_tokens` ut 
                           JOIN `users` u ON ut.user_id = u.id 
                           WHERE ut.token = :t AND ut.expires_at > CURRENT_TIMESTAMP LIMIT 1");
    $stmt->execute(['t' => $token]);
    $auth = $stmt->fetch();

    if (!$auth) {
        sendError('Sesi login telah kedaluwarsa atau tidak valid. Silakan login kembali.', 401);
    }

    if ($auth['user_status'] === 'suspended') {
        sendError('Akun Anda sedang dinonaktifkan oleh pengurus.', 403);
    }

    // Cek pembatasan role jika ditentukan
    if (!empty($allowedRoles) && !in_array($auth['role'], $allowedRoles)) {
        sendError('Anda tidak memiliki hak akses (Role: ' . $auth['role'] . ') untuk endpoint ini.', 403);
    }

    return $auth; // Berisi user_id, role, kelompok_tani_id, verification_status
}
```

### 3. Middleware `requireTenant($auth)`
Memastikan entitas hanya bisa membaca/menulis data milik kelompok taninya sendiri:
```php
function requireTenant($auth) {
    if ($auth['role'] === 'super_admin') {
        return null; // Super admin bypass tenant restriction
    }
    if (empty($auth['kelompok_tani_id'])) {
        // Jika user bukan super_admin dan tidak punya kelompok tani
        return $auth['user_id'];
    }
    return $auth['kelompok_tani_id'];
}
```

---

## 👥 5. TAHAP 3: REFACTOR `public/api/auth.php`

### Endpoint 1: `POST /api/auth.php?action=login`
* **Logika:**
  1. Cari user berdasarkan email.
  2. Verifikasi kata sandi hanya via `password_verify($password, $user['password'])`.
  3. **HAPUS SEMUA BYPASS:** Dilarang ada pengecualian password `password123` / `admin123`.
  4. Generate token acak 64 karakter (`bin2hex(random_bytes(32))`).
  5. Simpan ke tabel `user_tokens` dengan masa aktif 30 hari.
  6. Return response:
     ```json
     {
       "success": true,
       "data": {
         "token": "a1b2c3d4...",
         "user": {
           "id": "user-petani-01",
           "name": "Asep Supriatna",
           "email": "asep@petani.id",
           "role": "petani",
           "kelompokTaniId": "kt-01",
           "kelompokTaniName": "Gapoktan Mandiri",
           "verificationStatus": "verified"
         }
       }
     }
     ```

### Endpoint 2: `POST /api/auth.php?action=register`
* **Logika Pembagian Role:**
  * Jika `role` adalah **`petani`**, **`pengolah`**, atau **`verifikator`**:
    * Wajib mengirimkan `kelompokTaniId` yang valid.
    * Status default di-set: `verification_status = 'pending'`.
  * Jika `role` adalah **`roaster`**, **`gudang`**, atau **`cafe`**:
    * Mendaftar sebagai mitra hilir/buyer. Status default: `verification_status = 'verified'`.
  * **Role `super_admin` & `admin_kelompok_tani`:** DITOLAK jika didaftarkan via endpoint registrasi publik!
* **Hash Password:** Wajib menggunakan `password_hash($password, PASSWORD_BCRYPT)`.
* **Kirim Notifikasi Verifikasi Email:** Tetap jalankan via `mailer.php`.

### Endpoint 3: `GET /api/auth.php?action=pending-approvals`
* **Akses:** Wajib login sebagai `admin_kelompok_tani` atau `super_admin`.
* **Query:** Ambil semua user dengan `verification_status = 'pending'` yang `kelompok_tani_id`-nya sesuai dengan admin yang sedang login.

### Endpoint 4: `POST /api/auth.php?action=verify-user` (Approval Gate)
* **Akses:** Wajib login sebagai `admin_kelompok_tani`.
* **Payload:** `{ "userId": "...", "status": "verified" | "rejected", "notes": "..." }`
* **Validasi:** Pastikan user yang disetujui memang berada di bawah `kelompok_tani_id` admin tersebut. Update `verified_by` dengan nama admin dan `verified_at = CURRENT_TIMESTAMP`.

### Endpoint 5: `POST /api/auth.php?action=forgot-password` (PERBAIKAN KEAMANAN)
* **Aturan Kritis:**
  * Generate OTP 6 angka acak.
  * Hash OTP dengan `password_hash($otp, PASSWORD_BCRYPT)`.
  * Simpan hash ke `password_resets` (`expires_at = +15 menit`).
  * Kirim OTP lewat email via `sendSystemEmail()`.
  * **DILARANG KERAS** mengembalikan kode OTP di respon JSON!
  * Respon JSON hanya berupa:
    ```json
    { "success": true, "message": "Kode OTP reset kata sandi telah dikirim ke email Anda." }
    ```

### Endpoint 6: `POST /api/auth.php?action=reset-password` (PERBAIKAN KEAMANAN)
* **Payload:** `{ "email": "...", "otp": "123456", "newPassword": "..." }`
* **Validasi:**
  1. Cari record `password_resets` terbaru untuk email tersebut yang belum digunakan (`is_used = 0`) dan belum expired.
  2. Batasi percobaan salah maksimal 5x. Jika melebihi, batalkan OTP.
  3. Verifikasi OTP via `password_verify($otp, $record['otp_hash'])`.
  4. Jika cocok, update password di tabel `users` dengan `password_hash($newPassword, PASSWORD_BCRYPT)`.
  5. Tandai OTP sebagai telah digunakan (`is_used = 1`) dan hapus token sesi user lama di `user_tokens`.

---

## 🌾 6. TAHAP 4: MULTI-TENANCY & ATOMIC RANTAI PASOK

### A. Panen Ceri Petani (`public/api/harvests.php`)
* **GET:**
  * Ekstrak `$auth = requireAuth($pdo)`.
  * Jika Petani: Filter `WHERE farmer_id = :uid`.
  * Jika Admin Kelompok Tani / ICS: Filter `WHERE kelompok_tani_id = :ktid`.
  * Jika Pengolah / Buyer: Hanya tampilkan lot yang `status = 'available'`.
* **POST (Simpan Lot Panen):**
  * Wajib mengisi `kelompok_tani_id` dari `$auth['kelompok_tani_id']`.
  * `total_weight_kg` dan `available_weight_kg` diinisialisasi sama.

### B. Batch Pengolahan Wet Mill (`public/api/batches.php`)
* **POST (Pembelian Ceri & Mulai Batch Olah):**
  * Gunakan **Database Transaction (`$pdo->beginTransaction()`)**:
    1. Periksa ketersediaan ceri di `farmer_harvest_lots` (`available_weight_kg >= $weightNeeded`).
    2. Kurangi `available_weight_kg` pada lot petani. Jika habis, ubah status lot menjadi `'sold'` atau `'in_processing'`.
    3. Simpan record baru di `processing_batches`.
    4. Catat record di `transactions` (Debit/Kredit kas kelompok tani & petani).
    5. `$pdo->commit()`.
  * Jika gagal/stok kurang, lakukan `$pdo->rollBack()` dan kembalikan error `400 Bad Request`.

### C. Gudang & Roastery (`warehouse.php` & `roastery.php`)
* Wajib dilindungi dengan `requireAuth()`.
* Lot yang dibeli oleh Roaster harus mengikat `source_warehouse_lot_id`.
* Lembar sortasi fisik gudang harus mengupdate status mutu green bean (`defect_count`, `grade_tier`, `moisture_content`).

### D. QR Code Traceability Publik (`public/api/trace.php`)
* **Akses Publik (Tanpa Token):** Siapa pun boleh mengakses endpoint ini dengan menyertakan parameter `?lot_id=...`.
* **ATURAN INTEGRITAS:**
  1. Query database secara berantai:
     - Cari di `cafe_inventory` -> jika ada, ambil `roasted_lot_id`.
     - Cari di `roasted_bean_lots` -> ambil `source_warehouse_lot_id`.
     - Cari di `warehouse_lots` -> ambil `source_green_bean_id`.
     - Cari di `processed_green_bean_lots` -> ambil `source_farmer_lot_id`.
     - Cari di `farmer_harvest_lots` -> ambil kebun & koordinat poligon EUDR di `coffee_farms`.
  2. **Jika Lot ID Tidak Ditemukan:**
     Kembalikan respon JSON `404 Not Found`:
     ```json
     {
       "success": false,
       "message": "Data lot kopi tidak ditemukan atau belum diverifikasi oleh auditor mutu."
     }
     ```
     **DILARANG** mengembalikan data tiruan/fiktif!

---

## 👑 7. TAHAP 5: PENGAMANAN SUPER ADMIN (`public/api/superadmin.php`)

* **Wajib Proteksi:**
  ```php
  $auth = requireAuth($pdo, ['super_admin']);
  ```
  Setiap request GET/POST untuk konfigurasi kuota, harga paket, atau telemetri wajib ditolak dengan HTTP 403 Forbidden jika role pengguna bukan `super_admin`.

---

## 📋 8. CHECKLIST VERIFIKASI SELESAI PENGERJAAN (TESTING)

Jalankan pengujian menggunakan `curl` atau Postman untuk memastikan backend siap:

| # | Skenario Pengujian | Target Respon | Status |
|---|---|---|---|
| 1 | Akses `/api/harvests.php` tanpa header Authorization | HTTP 401 Unauthorized | [ ] |
| 2 | Login dengan password salah / hardcoded `password123` | HTTP 401 "Password salah" | [ ] |
| 3 | Request `forgot-password` | HTTP 200 (OTP dikirim ke email, TIDAK ada OTP di body JSON) | [ ] |
| 4 | Request `reset-password` dengan OTP salah | HTTP 400 "Kode OTP salah atau kedaluwarsa" | [ ] |
| 5 | Registrasi Petani / Pengolah / Verifikator baru | HTTP 201 (`verificationStatus: "pending"`) | [ ] |
| 6 | Admin A melihat daftar panen Kelompok Tani B | HTTP 200 (Data kosong / hanya muncul lot Kelompok A) | [ ] |
| 7 | Scan lot publik acak `/api/trace.php?lot_id=LOT-TIDAK-ADA` | HTTP 404 (Bukan data Asep Supriatna) | [ ] |
| 8 | Non-superadmin memanggil `/api/superadmin.php` | HTTP 403 Forbidden | [ ] |

---
**Catatan untuk Backend Engineer/Chat:**
Kerjakan tahap demi tahap sesuai nomor urut di atas. Pastikan file `public/api/config.php` diselesaikan terlebih dahulu karena file tersebut merupakan pondasi fungsi database dan middleware otentikasi untuk semua endpoint lainnya.
