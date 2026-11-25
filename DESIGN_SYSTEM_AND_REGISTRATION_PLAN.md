# DOKUMEN MASTER: DESIGN SYSTEM & ARSITEKTUR ALUR PENDAFTARAN 4 LAYANAN
## Proyek: sangrAI / Circular Trace (CCT-Coffee)
**Versi:** 2.0 (Design System & Route-Driven Registration)  
**Status:** Ditetapkan & Siap Eksekusi  

---

## 🎨 BAGIAN 1: DESIGN SYSTEM & VISUAL GUIDELINES

Sistem desain Circular Trace memadukan kehangatan industri kopi spesialti (**Artisan Specialty Coffee**) dengan ketegasan platform teknologi rantai pasok modern (**Enterprise Agritech & Traceability**).

---

### 1. Tipografi (Typography System)

Aplikasi menggunakan **`Plus Jakarta Sans`** sebagai font utama antarmuka, didukung font monospace untuk data teknis lot, koordinat GPS, dan transaksi.

* **Primary Font Family:** `'Plus Jakarta Sans', system-ui, -apple-system, sans-serif`
  * *Karakter:* Geometrik modern, memiliki *x-height* optimal, sangat mudah dibaca pada layar mobile maupun desktop.
* **Monospace Font Family:** `'JetBrains Mono', 'Fira Code', 'Courier New', monospace`
  * *Penggunaan:* ID Lot (`LOT-PTN-001`, `GB-PGL-002`), Hash Kriptografi EUDR, Titik Koordinat GPS, Nilai Brix, dan Nomor NIK/KTA.

#### Skala Hirarki Tipografi:
| Tingkat | Kelas Tailwind | Ukuran (px) | Ketebalan (*Weight*) | *Letter Spacing* | Penggunaan |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display / Hero** | `text-4xl lg:text-5xl` | 36px – 48px | Black (900) | `-0.025em` (tight) | Judul Utama Beranda & Banner Form |
| **Section Title** | `text-2xl sm:text-3xl` | 24px – 30px | Extra Bold (800) | `-0.02em` | Judul Section Layanan di Beranda |
| **Card Heading** | `text-lg sm:text-xl` | 18px – 20px | Bold (700) | Normal | Judul Layanan di Kartu Showcase |
| **Section Eyebrow** | `text-xs uppercase` | 11px – 12px | Black (900) | `+0.05em` (wider) | Label Kategori / Badge Penanda Layanan |
| **Body Primary** | `text-sm sm:text-base` | 14px – 15px | Medium (500) | Normal | Paragraf Deskripsi & Label Input |
| **Body Secondary** | `text-xs` | 12px – 13px | Normal (400) | Normal | Keterangan Tambahan, Helper Text |
| **Microcopy / Badge**| `text-[10px] – text-[11px]` | 10px – 11px | Extra Bold (800) | `+0.04em` | Tag Status, Pil Sertifikasi, Chip Indikator |

---

### 2. Palet Warna (Specialty Coffee Palette)

Warna dibagi menjadi **Warna Netral (Canvas & Surface)** dan **Warna Karakter Khusus 4 Layanan**.

#### A. Warna Netral & Surface
* **Base Canvas Background:** `#F8F5F0` (Linen / Warm Parchment)
  * *Filosofi:* Warna kertas kopi alami & karung goni bersih. Hangat, tidak menyilaukan mata seperti putih murni (`#FFFFFF`).
* **Card Surface:** `#FFFFFF` murni dengan border hangat `#E6DFD5` (*Warm Stone Border*).
* **Deep Roasted Surface:** `#18110D` (Dark Roasted Espresso) & `#291B13` (Deep Mocha) untuk header hero, footer, dan bar navigasi eksklusif.
* **Teks Utama:** `#1C1917` (Stone 900) untuk kontras tinggi dan kenyamanan membaca.
* **Teks Sekunder:** `#57534E` (Stone 600) untuk deskripsi dan placeholder.

---

#### B. Palet Karakteristik 4 Layanan Utama

Setiap layanan memiliki aksen warna distingtif agar pengunjung langsung merasakan identitas bidang usahanya:

```text
┌────────────────────────────────────────────────────────────────────────┐
│ 1. KELOMPOK TANI (BUNDLE: Petani, Pengolah, Verifikator)               │
│    Warna Primer : Forest Emerald (#059669) & Golden Harvest (#D97706)  │
│    Background   : bg-emerald-50/70 border-emerald-200                  │
│    Aksen Tag    : Hijau Daun Kopi + Emas Hasil Panen                   │
│    Kesan        : Berkelanjutan, Subur, Kemitraan Agrikultur, EUDR     │
├────────────────────────────────────────────────────────────────────────┤
│ 2. GUDANG (Warehouse QA & Logistik)                                    │
│    Warna Primer : Steel Slate (#334155) & Cold Storage Blue (#2563EB)  │
│    Background   : bg-blue-50/70 border-blue-200                        │
│    Aksen Tag    : Biru Hermetik GrainPro & Silver Presisi              │
│    Kesan        : Kontrol Iklim Presisi, Standarisasi QC, Karantina    │
├────────────────────────────────────────────────────────────────────────┤
│ 3. ROASTER (Artisan Roastery ERP)                                      │
│    Warna Primer : Artisan Terracotta (#EA580C) & Flame Amber (#F59E0B) │
│    Background   : bg-orange-50/70 border-orange-200                    │
│    Aksen Tag    : Nyala Api Sangrai & Agtron Roast Tone                │
│    Kesan        : Presisi Profiling, Sains Kurva RoR, Specialty Lab    │
├────────────────────────────────────────────────────────────────────────┤
│ 4. COFFEE SHOP (Kedai Kopi & Barista)                                  │
│    Warna Primer : Warm Crema Brown (#B45309) & Deep Charcoal (#1C1917) │
│    Background   : bg-amber-50/60 border-amber-200                      │
│    Aksen Tag    : Crema Espresso & Paspor QR Meja Seduh                │
│    Kesan        : Hangat, Ramah Barista, Transparan ke Konsumen        │
└────────────────────────────────────────────────────────────────────────┘
```

---

### 3. Gaya Kartu & Kontainer (Card & Container Language)

Bentuk kartu dirancang modern dengan sentuhan arsitektur web modern:

* **Border Radius:**
  * Kontainer Kartu Utama: `rounded-3xl` (24px) untuk kartu showcase besar, `rounded-2xl` (16px) untuk kartu form.
  * Field Input Form: `rounded-xl` (12px) dengan padding nyaman `px-4 py-3`.
  * Tombol CTA: `rounded-xl` (12px) font-bold dengan padding `px-5 py-3.5`.
  * Badge / Tag Pills: `rounded-full` (9999px) dengan padding `px-3 py-1`.
* **Border & Garis Tepi:**
  * Garis tipis 1px presisi: `border border-stone-200/90` atau `border border-[#E6DFD5]`.
  * Efek saat hover: Border bertransisi menjadi lebih kontras (`border-stone-400` atau warna aksen masing-masing service).
* **Bayangan & Kedalaman (Shadows & Elevation):**
  * Standar: `shadow-xs` / `shadow-sm` untuk tampilan bersih (*flat-first*).
  * Hover State: `hover:shadow-lg hover:-translate-y-1 transition-all duration-300` agar terasa interaktif saat diarahkan kursor.
* **Floating Icon Box:**
  * Setiap kartu layanan memiliki ikon mengambang berukuran `w-12 h-12 rounded-2xl` dengan latar belakang lembut dan border tipis senada warna layanan.

---

## 🚀 BAGIAN 2: ALUR PENDAFTARAN 4 LAYANAN BERBASIS BERANDA (FRONTPAGE-DRIVEN)

Meniadakan halaman kartu pemilih peran generik di `/register`, dan memindahkan seluruh pintu pendaftaran ke **Beranda (Frontpage)** yang mengarahkan langsung ke **4 Formulir Mandiri**.

---

### 1. Tampilan Showcase 4 Layanan di Beranda (`LandingPage.tsx`)

Di beranda, dibuat sebuah section komprehensif berjudul:  
**"Pilih Solusi yang Sesuai dengan Ekosistem Bisnis Kopi Anda"**

Section ini menampilkan 4 Kartu Layanan Mandiri yang ditata rapi:

#### KARTU 1: KELOMPOK TANI / GAPOKTAN (Bundle 3 Layanan Terpadu)
* **Visual Identity:** Border Emerald + Aksen Amber + Icon `Building2` & `Sprout`.
* **Badge:** `Bundle Terpadu (3-in-1 Included)`
* **Judul:** Kelompok Tani & Koperasi Kopi
* **Deskripsi:** Solusi digitalisasi hulu perkebunan kopi terintegrasi untuk Gapoktan, koperasi tani, dan konsorsium perkebunan rakyat.
* **Penjabaran 3 Layanan Bundle (Included):**
  * 🌿 **Unit Petani Kopi:** Pendataan profil petani, luas hektar, poligon batas kebun anti-deforestasi EUDR, dan pencatatan panen ceri petik merah.
  * ⚙️ **Unit Pengolah (Wet Mill):** Penerimaan ceri, 7 metode olah/fermentasi, pencatatan rendemen & pengelolaan limbah sirkular.
  * 🛡️ **Unit Verifikator Mutu (ICS):** Tim audit internal kebun, uji brix ceri di pohon, inspeksi GAP, dan penerbitan stempel resmi mutu kelompok tani.
* **Tombol CTA:**  
  `[ Daftarkan Kelompok Tani (Bundle 3 Layanan) ➔ ]`  
  *Mengarah langsung ke URL:* `/register/kelompok-tani`

---

#### KARTU 2: GUDANG & QA (Warehouse Management)
* **Visual Identity:** Border Steel Slate + Aksen Cold Blue + Icon `Warehouse`.
* **Badge:** `Logistik & Mutu Green Bean`
* **Judul:** Gudang Penyimpanan & QA
* **Deskripsi:** Sistem kontrol iklim hermetik, uji grading fisik green bean SCA, dan manajemen karantina ekspor.
* **Daftar Fitur:**
  * Pemantauan suhu & kelembapan ruangan (*RH*) karung GrainPro.
  * Lembar sortasi fisik: uji kadar air, defect count, dan *screen size*.
  * Modul penerimaan ceri giling (*inbound*) dari stasiun pengolahan.
* **Tombol CTA:**  
  `[ Daftar Sebagai Mitra Gudang ➔ ]`  
  *Mengarah langsung ke URL:* `/register/gudang`

---

#### KARTU 3: ARTISAN ROASTERY (Roastery ERP)
* **Visual Identity:** Border Flame Toast + Aksen Terracotta + Icon `Flame`.
* **Badge:** `Penyangraian & Cupping Lab`
* **Judul:** Artisan Roastery
* **Deskripsi:** Software ERP artisan sangrai, profiling kurva Agtron/RoR, uji cita rasa cupping SCA, dan integrasi paspor digital kemasan retail.
* **Daftar Fitur:**
  * Jadwal Work Orders sangrai, DTR, dan kalibrasi kurva suhu.
  * Lembar uji sensori *spider chart* 10 atribut standar SCA.
  * Cetak label kemasan retail ber-QR traceability langsung ke petani.
* **Tombol CTA:**  
  `[ Buka Akun Roastery ➔ ]`  
  *Mengarah langsung ke URL:* `/register/roaster`

---

#### KARTU 4: COFFEE SHOP & KEDAI KOPI (Retail & Barista)
* **Visual Identity:** Border Crema Latte + Aksen Dark Mocha + Icon `Coffee`.
* **Badge:** `Hilir & Seduh Konsumen`
* **Judul:** Coffee Shop & Barista
* **Deskripsi:** Sajikan setiap cangkir kopi spesialti dengan transparansi penuh dari kebun hingga ke meja seduh konsumen.
* **Daftar Fitur:**
  * Akses langsung beli roasted beans berkualitas tinggi dari mitra roastery.
  * Paspor digital QR Code meja agar pengunjung dapat menelusuri kisah petani di balik cangkirnya.
  * Sertifikat transparansi harga berkeadilan (*fair price*).
* **Tombol CTA:**  
  `[ Daftarkan Coffee Shop Anda ➔ ]`  
  *Mengarah langsung ke URL:* `/register/coffee-shop`

---

### 2. Spesifikasi 4 Halaman Formulir Mandiri (`Dedicated Pages`)

Setiap halaman memiliki URL tersendiri, layout bersih 2 kolom (Kolom Kiri: Form Input, Kolom Kanan: Rangkuman Fitur & Nilai Tambah).

---

#### FORMULIR 1: `/register/kelompok-tani`
* **Header:**
  * Judul: *"Pendaftaran Kelompok Tani / Gapoktan / Koperasi"*
  * Subjudul: *"Mendaftarkan organisasi induk perkebunan kopi terpadu beserta 3 pilar layanan operasional (Petani, Pengolah Wet Mill, dan Verifikator ICS)."*
* **Informasi Khusus (Callout Banner):**
  > ℹ️ **Bundle 3 Layanan Termasuk:**  
  > Dengan mendaftarkan Kelompok Tani, akun Anda otomatis memiliki hak mengalokasikan akun bagi **Petani anggota kebun**, **Operator stasiun basah/mill**, dan **Petugas verifikator ICS** melalui panel admin.
* **Input Fields:**
  1. *Nama Kelompok Tani / Koperasi* (e.g. Gapoktan Kopi Mandiri Nusantara)
  2. *Wilayah Sentra Kebun* (Kecamatan, Kabupaten, Provinsi - e.g. Pangalengan, Bandung, Jawa Barat)
  3. *Perkiraan Jumlah Petani Binaan Awal* (Pilihan angka: < 20, 20-50, 50-100, > 100 petani)
  4. *Nama Lengkap Ketua / Pengurus Utama*
  5. *Nomor WhatsApp Aktif* (untuk notifikasi & verifikasi)
  6. *Alamat Email Resmi Organisasi*
  7. *Kata Sandi & Konfirmasi Sandi*
* **Tombol Submit:** `[ Daftarkan Kelompok Tani Sekarang ➔ ]`

---

#### FORMULIR 2: `/register/gudang`
* **Header:**
  * Judul: *"Pendaftaran Mitra Gudang & Warehouse QA"*
  * Subjudul: *"Kelola pergudangan klimatik hermetik, uji mutu grading green bean fisik, dan distribusi ke roastery."*
* **Input Fields:**
  1. *Nama Fasilitas Gudang / Perusahaan* (e.g. PT Sentra Kopi Priangan Storage)
  2. *Lokasi / Kota Gudang* (e.g. Gedebage, Kota Bandung)
  3. *Estimasi Kapasitas Gudang (Ton)* (e.g. 50 Ton)
  4. *Nama Kepala Gudang / QC Manager*
  5. *Nomor WhatsApp Aktif*
  6. *Alamat Email Bisnis*
  7. *Kata Sandi & Konfirmasi Sandi*
* **Tombol Submit:** `[ Buka Akun Mitra Gudang ➔ ]`

---

#### FORMULIR 3: `/register/roaster`
* **Header:**
  * Judul: *"Pendaftaran Artisan Roastery"*
  * Subjudul: *"Akses software kurva sangrai, artisan sensory cupping SCA, dan integrasi kemasan retail farm-to-cup."*
* **Input Fields:**
  1. *Nama Brand Roastery / Lab Sangrai* (e.g. Karsa Craft Roastery & Lab)
  2. *Kota / Lokasi Roastery* (e.g. Bandung)
  3. *Tipe Mesin Roasting Utama* (e.g. Giesen W6A, Probat UG22, Froco, Berto)
  4. *Nama Head Roaster / Penanggung Jawab*
  5. *Nomor WhatsApp Aktif*
  6. *Alamat Email Bisnis*
  7. *Kata Sandi & Konfirmasi Sandi*
* **Tombol Submit:** `[ Mulai Akun Roastery ➔ ]`

---

#### FORMULIR 4: `/register/coffee-shop`
* **Header:**
  * Judul: *"Pendaftaran Kedai Kopi & Coffee Shop"*
  * Subjudul: *"Sajikan kopi dengan narasi keterlacakan digital dan transparansi dari petani hingga cangkir konsumen."*
* **Input Fields:**
  1. *Nama Kedai Kopi / Cafe* (e.g. Seduh Teduh Specialty Coffee)
  2. *Alamat & Kota Kedai* (e.g. Jl. Riau No. 45, Bandung)
  3. *Jumlah Bar / Cabang* (e.g. 1 Bar, 2-3 Cabang, > 3 Cabang)
  4. *Nama Pemilik / Manajer Kedai*
  5. *Nomor WhatsApp Aktif*
  6. *Alamat Email Bisnis*
  7. *Kata Sandi & Konfirmasi Sandi*
* **Tombol Submit:** `[ Daftarkan Coffee Shop Anda ➔ ]`

---

### 3. Navigasi Header (Navbar) yang Baru

Pada `Navbar.tsx`, tombol pendaftaran disesuaikan:
* Tombol **"Daftar Akun ▾"** berupa menu dropdown bersih dengan 4 pilihan:
  1. 🏢 **Kelompok Tani / Gapoktan** *(Bundle Petani, Pengolah, Verifikator)*
  2. 📦 **Gudang & QA**
  3. 🔥 **Artisan Roastery**
  4. ☕ **Coffee Shop / Kedai**
* Menu navigasi **"Layanan"** di Navbar otomatis melakukan *smooth-scroll* langsung ke Section 4 Layanan di Beranda.

---

## 🛠️ BAGIAN 3: LANGKAH KERJA TEKNIS (EXECUTION STEPS)

1. **Pembaruan Rute di `src/App.tsx`:**
   * Tambahkan rute:
     * `/register/kelompok-tani`
     * `/register/gudang`
     * `/register/roaster`
     * `/register/coffee-shop`
   * Alihkan rute lama `/register` agar me-redirect pengguna ke section layanan di Beranda (`/#services`).
2. **Penyempurnaan Section Beranda di `src/components/LandingPage.tsx`:**
   * Tampilkan 4 kartu showcase layanan dengan gaya desain baru (Plus Jakarta Sans, warna signature, badge bundle Kelompok Tani).
   * Sambungkan tombol CTA masing-masing kartu ke 4 URL di atas.
3. **Penyusunan Komponen Formulir Mandiri:**
   * Buat modul formulir yang bersih, elegan, dan bebas dari kartu pilihan peran.
   * Sertakan tombol `"← Kembali ke Beranda"` di bagian atas formulir.
4. **Pembaruan Dropdown Navbar di `src/components/Navbar.tsx`:**
   * Implementasikan dropdown 4 pilihan pada tombol registrasi atas.
