# Circular Trace v.2 (CCT-Coffee Supply Chain Platform)

> **Platform Digital Terpadu Rantai Pasok Kopi Sirkular (Farm-to-Cup Digital Product Passport & E-Commerce)**  
> Menghubungkan seluruh aktor komoditas kopi mulai dari **Petani Hulu**, **Stasiun Pengolah (Mill)**, **Gudang & Ekspor (Silo)**, **Artisan Roastery**, hingga **Kedai Kopi (Cafe Barista)** dengan transparansi data, pelacakan silsilah QR, kepatuhan EUDR, dan skor sirkularitas keberlanjutan.

---

## 🌟 Fitur Utama Ekosistem CCT-Coffee

### 1. **Katalog E-Commerce Terpadu & Multi-Actor Admin Panels**
- **Dasbor Mandiri Berbasis Peran (Role-Based Scope Access)**:
  - 🌿 **Petani (Farm Hulu)**: Input hasil panen ceri basah, varietas, elevasi kebun (mdpl), kadar gula brix, metode petik, dan cetak stiker karung goni.
  - ⚙️ **Pengolah (Mill Station)**: Beli ceri petani, catat metode proses (Washed, Natural, Honey, Anaerobic), uji kadar air/aW, alokasikan limbah sirkular (Cascara & Kompos), dan cetak stiker karung green bean.
  - 🏢 **Gudang (Warehouse & Storage)**: Grading mutu SNI/SCA (Grade 1 Super Premium s/d Grade 4 Basic Commercial), kalkulator margin laba & harga jual dinamis, serta manajemen silo hermetik.
  - 🔥 **Roaster (Roastery Artisan)**: Profil sangrai (Agtron tile, DTR ratio, Roast level), uji cupping SCA, dan pembuatan pack ritel untuk cafe.
  - ☕ **Pemilik Cafe (Barista Bar)**: Kelola stok bar, cetak label barcode cup satuan maupun batch A4, dan berikan pengalaman digital farm-to-cup untuk pengunjung.

### 2. **Sistem Paspor Produk Digital & Dual Circular Gauge UI**
- **Circular Economy (CCI - Coffee Circularity Index v2.1)**:
  - Skor sirkularitas terverifikasi berdasarkan riset saintifik (Diversi limbah, valorisasi cascara, bio-fertilizer, pengeringan surya 100%, agroforestri).
- **ESG Sustainability (CSDI - Coffee Sustainable Development Index)**:
  - Triple-Bottom-Line ESG: Lingkungan (40%), Ekonomi (+28% direct price premium ke petani), dan Sosial (100% Chain-of-Custody).
- **Material Balance & Biomass Conservation**:
  - Pelacakan neraca massa dari 1.000 kg ceri hingga green bean, cascara teh, biochar, dan reduksi emisi metana CO₂e.
- **SCA Lab & EUDR Compliance**:
  - Kepatuhan sertifikat ICO, uji bebas deforestasi satelit Sentinel-2, dan verifikasi integritas kriptografis SHA-256.

### 3. **Visualisasi Data Spider Chart (Radar Chart) Profil Sensori Rasa**
- Visualisasi poligon 6 sumbu berstandar Specialty Coffee Association (SCA):
  - **Aroma & Fragrance**, **Flavor & Taste Profile**, **Acidity**, **Sweetness**, **Body**, **Aftertaste**.
- Dilengkapi simulator profil sangrai dinamis (*Actual, Light Filter, Medium Balance, Dark Bold*), indikator Agtron, dan DTR ratio.

### 4. **Sistem Cetak Barcode & Stiker Fisik**
- Stiker Karung Ceri Petani (QR Code spek panen).
- Stiker Karung Green Bean Pengolah (QR Code riwayat ceri & limbah).
- Stiker Karung Silo Gudang (QR Code grading mutu SCA & SNI tanpa harga beli).
- Stiker Gelas Kafe (Cup Label: Single, 4x Grid, dan 8x Lembar A4).

---

## 🚀 Teknologi yang Digunakan

- **Frontend Core**: React 19 + TypeScript
- **Styling & Design System**: Tailwind CSS v4 + Lucide React Icons
- **Build Tool**: Vite v8
- **QR Code Engine**: `qrcode` library
- **Quality Assurance**: Oxlint + TypeScript Strict Compiler

---

## 🛠️ Instalasi & Menjalankan Lokal

```bash
# Clone repository
git clone https://github.com/ashabilsyauqi/circular-trace-v.2.git
cd circular-trace-v.2

# Install dependencies
npm install

# Jalankan server pengembangan lokal (tersedia di LAN untuk scan via smartphone)
npm run dev -- --host 0.0.0.0 --port 5173

# Build untuk produksi
npm run build
```

---

## 🌿 Struktur Cabang (Git Branches)

- **`release`**: Versi produksi live yang bersih, siap digunakan untuk deployment operasional.
- **`development`**: Cabang pengembangan aktif yang memuat seluruh alat uji coba, simulasi, dan fitur eksperimental terbaru.

---

© 2026 CCT-Coffee Ecosystem • Circular Coffee Traceability Platform.
