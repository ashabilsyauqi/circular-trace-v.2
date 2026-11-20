# 📋 PANDUAN IMPLEMENTASI REVISI TEKNIS (KATEGORI 1)
**Project**: Circular Coffee Trace (CCT) / CircularTrace  
**Target Repositori**: `/Users/kingashabil/Desktop/CCT-coffee` (dan sinkronisasi ke repositori `marketplace` jika relevan)  
**Tujuan**: Menyelesaikan 5 perbaikan teknis mendesak yang dilaporkan oleh tim QA (Pak Ahmad Ramzi & Prof. Dr. Novizar Nazir) terkait form registrasi, enkripsi password, aksesibilitas modal, kompatibilitas database, dan sinkronisasi lupa password.

---

## 📌 DAFTAR TUGAS KATEGORI 1

1. **[TUGAS 1]** Tambahkan Input Email & Password pada Formulir Registrasi (`RegisterModal.tsx`)
2. **[TUGAS 2]** Aksesibilitas Penutupan Modal Registrasi (Tombol Batal, Keyboard Esc, Klik Backdrop & Reposisi Tombol X)
3. **[TUGAS 3]** Enkripsi Kata Sandi Menggunakan Bcrypt (`public/api/auth.php`)
4. **[TUGAS 4]** Perbaikan 7 Kueri Upsert Database (Kompatibilitas Dual-Driver MySQL & SQLite)
5. **[TUGAS 5]** Sinkronisasi API Pemulihan Kata Sandi (Forgot Password Endpoint)

---

## 🛠️ RINCIAN & INSTRUKSI IMPLEMENTASI

### 🔹 TUGAS 1: Tambahkan Input Email & Password pada Modal Registrasi
* **Lokasi File**: `src/components/RegisterModal.tsx`
* **Latar Belakang Masalah**:
  Saat ini formulir registrasi hanya meminta: Nama Lengkap, Nama Usaha, Lokasi, WhatsApp, dan Bio. Tidak ada input **Email** dan **Password**, sehingga user diarahkan ke `/login` tanpa memiliki kredensial akun.
* **Instruksi Pengerjaan**:
  1. Tambahkan state baru pada komponen:
     ```tsx
     const [email, setEmail] = useState('');
     const [password, setPassword] = useState('');
     const [confirmPassword, setConfirmPassword] = useState('');
     const [showPassword, setShowPassword] = useState(false);
     const [errorMsg, setErrorMsg] = useState<string | null>(null);
     ```
  2. Tambahkan field input baru pada bagian `2. Informasi Profil & Usaha Kopi`:
     * **Alamat Email (Wajib)**: Tipe `email`, ikon `Mail`, placeholder `e.g. nama@perusahaan.com`.
     * **Kata Sandi (Wajib)**: Tipe `password` (toggle show/hide via ikon `Eye`/`EyeOff`), minimal 6 karakter.
     * **Konfirmasi Kata Sandi (Wajib)**: Validasi kecocokan nilai dengan kata sandi utama.
  3. Pada fungsi `handleRegister`:
     * Validasi format email menggunakan regex standar.
     * Validasi minimal panjang kata sandi (min. 6 atau 8 karakter).
     * Validasi bahwa `password === confirmPassword`.
     * Kirimkan `email` dan `password` ke fungsi `registerUser` di `CoffeeContext` dan/atau endpoint backend API `public/api/auth.php?action=register`.
  4. Reset form dan state error saat modal ditutup atau sukses.

---

### 🔹 TUGAS 2: Aksesibilitas Penutupan Modal Registrasi
* **Lokasi File**: `src/components/RegisterModal.tsx`
* **Latar Belakang Masalah**:
  Tombol `X` di sudut kanan atas modal sering tersembunyi atau terpotong pada monitor dengan resolusi tertentu atau rasio layar sempit. Modal tidak memiliki tombol Batal dan tidak bisa ditutup kecuali dengan me-refresh seluruh halaman browser.
* **Instruksi Pengerjaan**:
  1. **Tombol "Batal" di Footer Form**:
     * Tambahkan tombol Batal berdampingan dengan tombol submit "Daftar Akun & Lanjut ke Login":
     ```tsx
     <div className="pt-4 flex flex-col-reverse sm:flex-row items-center justify-end gap-3 border-t border-stone-200">
       <button
         type="button"
         onClick={onClose}
         className="w-full sm:w-auto px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
       >
         Batal
       </button>
       <button
         type="submit"
         className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 text-stone-950 font-black text-xs rounded-xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer"
       >
         <span>Daftar Akun Sekarang</span>
         <ArrowRight className="w-4 h-4" />
       </button>
     </div>
     ```
  2. **Event Listener Keyboard `Escape`**:
     * Pasang `useEffect` untuk mendengarkan penekanan tombol `Esc`:
     ```tsx
     useEffect(() => {
       const handleKeyDown = (e: KeyboardEvent) => {
         if (e.key === 'Escape' && isOpen) {
           onClose();
         }
       };
       window.addEventListener('keydown', handleKeyDown);
       return () => window.removeEventListener('keydown', handleKeyDown);
     }, [isOpen, onClose]);
     ```
  3. **Klik Backdrop Overlay**:
     * Tambahkan `onClick` handler pada div container overlay gelap terluar:
     ```tsx
     <div
       className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-sm flex items-center justify-center p-4 sm:p-6"
       onClick={(e) => {
         if (e.target === e.currentTarget) onClose();
       }}
     >
     ```
  4. **Reposisi Tombol `X`**:
     * Pastikan tombol `X` memiliki styling `z-20`, `top-4 right-4` yang terbungkus aman dalam header modal sehingga tidak terpotong tepi layar.

---

### 🔹 TUGAS 3: Enkripsi Kata Sandi dengan Bcrypt
* **Lokasi File**: `public/api/auth.php`
* **Latar Belakang Masalah**:
  Beberapa password pengguna di tabel `users` masih tersimpan sebagai teks biasa (`password123`). Standar keamanan aplikasi web mengharuskan semua password disimpan dalam bentuk hash satu arah (bcrypt).
* **Instruksi Pengerjaan**:
  1. **Pada Blok Pendaftaran (`action === 'register'`)**:
     * Sebelum kueri `INSERT INTO users`, hash password terlebih dahulu:
     ```php
     $hashedPassword = password_hash($password, PASSWORD_BCRYPT);
     ```
     * Masukkan `$hashedPassword` ke dalam kolom `password` pada database:
     ```php
     $stmt = $pdo->prepare("INSERT INTO `users` (`id`, `name`, `email`, `password`, `role`, `organization`, `location`, `avatar`, `phone`, `balance`, `bio`) VALUES (:id, :name, :email, :password, :role, :org, :location, :avatar, :phone, 0, :bio)");
     $stmt->execute([
         'id'       => $id,
         'name'     => $name,
         'email'    => $email,
         'password' => $hashedPassword,
         // ... parameter lainnya
     ]);
     ```
  2. **Pada Blok Login (`action === 'login'`)**:
     * Pastikan verifikasi login mendukung akun lama yang belum di-hash dan akun baru ber-hash:
     ```php
     $isPasswordCorrect = false;
     if (password_verify($password, $user['password'])) {
         $isPasswordCorrect = true;
     } elseif ($password === $user['password']) {
         // Fallback untuk legacy password lama (plain-text)
         $isPasswordCorrect = true;
         // Opsional: Rehash otomatis ke bcrypt agar data aman
         $newHash = password_hash($password, PASSWORD_BCRYPT);
         $upStmt = $pdo->prepare("UPDATE `users` SET `password` = :p WHERE `id` = :id");
         $upStmt->execute(['p' => $newHash, 'id' => $user['id']]);
     }
     
     if (!$isPasswordCorrect) {
         sendError('Password yang Anda masukkan salah.', 401);
     }
     ```

---

### 🔹 TUGAS 4: Perbaikan 7 Kueri Upsert Database (Kompatibilitas MySQL & SQLite)
* **Latar Belakang Masalah**:
  Kueri di 7 endpoint tulis menggunakan klausa spesifik MySQL: `ON DUPLICATE KEY UPDATE`. Jika dijalankan di SQLite (misal saat testing lokal atau fallback otomatis), SQLite melempar error sintaks fatal (`HY000: near "ON": syntax error`). Akibatnya data tampak tersimpan di frontend browser (karena local state), tapi penyimpanan ke database server gagal tanpa notifikasi jelas.
* **Daftar 7 Lokasi Kueri**:
  1. `public/api/farms.php` (baris ~78)
  2. `public/api/harvests.php` (baris ~81)
  3. `public/api/batches.php` (baris ~73)
  4. `public/api/warehouse.php` (baris ~92)
  5. `public/api/cafe.php` (baris ~80)
  6. `public/api/cafe.php` (baris ~109)
  7. `public/api/roastery.php` (baris ~135)
* **Instruksi Pengerjaan**:
  1. **Buat Helper Function Pendeteksi Driver di `public/api/config.php`**:
     ```php
     function isMysqlConnection($pdo) {
         try {
             return $pdo->getAttribute(PDO::ATTR_DRIVER_NAME) === 'mysql';
         } catch (Exception $e) {
             return false;
         }
     }
     ```
  2. **Sesuaikan Sintaks di Setiap Endpoint**:
     * Contoh pada `public/api/farms.php`:
     ```php
     $isMysql = isMysqlConnection($pdo);

     if ($isMysql) {
         // Kueri MySQL native
         $stmt = $pdo->prepare("INSERT INTO `coffee_farms` 
             (`id`, `farmer_id`, `farmer_name`, `farm_name`, `location`, `province`, `latitude`, `longitude`, `altitude_meters`, `altitude_display`, `land_area_hectares`, `total_trees_count`, `primary_varieties`, `soil_type`, `shade_trees`, `organic_status`, `eudr_compliant`, `weather_data`, `plot_boundary`, `patok_list`, `photo_url`, `established_year`, `notes`, `verification_status`)
             VALUES 
             (:id, :fid, :fname, :farmname, :loc, :prov, :lat, :lng, :alt, :altdisp, :area, :trees, :var, :soil, :shade, :org, :eudr, :wea, :bound, :pat, :photo, :yr, :notes, 'verified')
             ON DUPLICATE KEY UPDATE 
             `farm_name`=:farmname, `location`=:loc, `latitude`=:lat, `longitude`=:lng, `altitude_meters`=:alt, `land_area_hectares`=:area, `notes`=:notes");
     } else {
         // Kueri SQLite native kompatibel (SQLite 3.24+)
         $stmt = $pdo->prepare("INSERT INTO `coffee_farms` 
             (`id`, `farmer_id`, `farmer_name`, `farm_name`, `location`, `province`, `latitude`, `longitude`, `altitude_meters`, `altitude_display`, `land_area_hectares`, `total_trees_count`, `primary_varieties`, `soil_type`, `shade_trees`, `organic_status`, `eudr_compliant`, `weather_data`, `plot_boundary`, `patok_list`, `photo_url`, `established_year`, `notes`, `verification_status`)
             VALUES 
             (:id, :fid, :fname, :farmname, :loc, :prov, :lat, :lng, :alt, :altdisp, :area, :trees, :var, :soil, :shade, :org, :eudr, :wea, :bound, :pat, :photo, :yr, :notes, 'verified')
             ON CONFLICT(`id`) DO UPDATE SET 
             `farm_name`=:farmname, `location`=:loc, `latitude`=:lat, `longitude`=:lng, `altitude_meters`=:alt, `land_area_hectares`=:area, `notes`=:notes");
     }
     ```
  3. Lakukan pola kondisional yang sama untuk ke-6 endpoint lainnya (`harvests.php`, `batches.php`, `warehouse.php`, `cafe.php`, `roastery.php`). Dengan cara ini, kode akan berjalan 100% mulus baik di lingkungan MySQL (cPanel produksi / Docker) maupun di lingkungan SQLite (lokal dev).

---

### 🔹 TUGAS 5: Sinkronisasi API Pemulihan Kata Sandi (Forgot Password)
* **Lokasi File**:
  * `public/api/auth.php` (Backend)
  * `src/context/CoffeeContext.tsx` & `src/components/LoginPage.tsx` (Frontend)
* **Latar Belakang Masalah**:
  Saat pengguna (misal `buku@mailinator.com`) meminta kode OTP / reset password di form `LoginPage.tsx`, pengecekan akun hanya mencari di memori frontend/mock data, bukan memeriksa database server secara langsung. Akibatnya user riil yang terdaftar di database mendapatkan pesan error *"Email tidak terdaftar pada direktori Circular Coffee Trace"*.
* **Instruksi Pengerjaan**:
  1. **Tambahkan Action `forgot-password` di `public/api/auth.php`**:
     ```php
     if ($action === 'forgot-password') {
         $email = trim($input['email'] ?? '');
         if (!$email) sendError('Email wajib diisi.', 400);

         $stmt = $pdo->prepare("SELECT `id`, `name`, `email` FROM `users` WHERE `email` = :email LIMIT 1");
         $stmt->execute(['email' => $email]);
         $user = $stmt->fetch();

         if (!$user) {
             sendError('Email tidak terdaftar pada direktori Circular Coffee Trace.', 404);
         }

         // Generate OTP 6 digit
         $otp = strval(rand(100000, 999999));
         $expiry = date('Y-m-d H:i:s', strtotime('+15 minutes'));

         // Simpan OTP ke tabel (atau fallback simulasi dev)
         // Jika tabel users memiliki kolom reset_token/reset_expiry:
         // $upStmt = $pdo->prepare("UPDATE `users` SET `reset_token`=:otp, `reset_expires_at`=:exp WHERE `id`=:id");
         // $upStmt->execute(['otp' => $otp, 'exp' => $expiry, 'id' => $user['id']]);

         sendResponse([
             'message'   => 'Kode OTP verifikasi berhasil dibuat.',
             'resetCode' => $otp, // Disertakan untuk kemudahan testing lokal
             'email'     => $email
         ]);
     }
     ```
  2. **Tambahkan Action `reset-password` di `public/api/auth.php`**:
     ```php
     if ($action === 'reset-password') {
         $email = trim($input['email'] ?? '');
         $newPassword = trim($input['newPassword'] ?? '');

         if (!$email || !$newPassword) {
             sendError('Email dan kata sandi baru wajib diisi.', 400);
         }

         $hashed = password_hash($newPassword, PASSWORD_BCRYPT);
         $stmt = $pdo->prepare("UPDATE `users` SET `password` = :pass WHERE `email` = :email");
         $stmt->execute(['pass' => $hashed, 'email' => $email]);

         sendResponse(['message' => 'Kata sandi berhasil diperbarui. Silakan login.']);
     }
     ```
  3. **Hubungkan Fungsi Frontend di `CoffeeContext.tsx`**:
     * Pada `requestPasswordReset(email)`: Lakukan `fetch('/api/auth.php?action=forgot-password', ...)` terlebih dahulu. Jika API sukses, gunakan kode OTP dari API.
     * Pada `resetPassword(email, newPass)`: Lakukan `fetch('/api/auth.php?action=reset-password', ...)`.

---

## ✅ CHECKLIST VERIFIKASI SEBELUM SELESAI

Setelah pengerjaan selesai, lakukan pengujian berikut:
- [ ] Jalankan `npm run build` dan pastikan kompilasi TypeScript & Vite sukses tanpa error (`exit code 0`).
- [ ] Buka modal registrasi: Pastikan input **Email** dan **Password** tersedia, dapat diisi, dan tombol **Batal** berfungsi menutup modal.
- [ ] Uji penutupan modal dengan menekan tombol keyboard **Esc** dan klik di luar modal (backdrop).
- [ ] Daftarkan akun baru, lalu cek tabel database `users`: Pastikan kolom `password` tersimpan dalam format hash bcrypt (`$2y$10$...`), BUKAN teks biasa.
- [ ] Coba login menggunakan akun baru tersebut di halaman `/login` dan pastikan login berhasil.
- [ ] Uji penulisan data kebun (`farms.php`) dan panen (`harvests.php`) pada database SQLite dan MySQL: Pastikan tidak ada lagi error `near "ON": syntax error`.
- [ ] Coba alur "Lupa Kata Sandi" dengan email akun yang ada di database MySQL: Pastikan email berhasil ditemukan dan kode OTP diproses.
