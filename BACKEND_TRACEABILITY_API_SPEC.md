# PANDUAN TEKNIS API KETERTELUSURAN BERJENJANG (STAGE-AWARE TRACEABILITY)
## Proyek: sangrAI / Circular Trace (CCT-Coffee)
**Target File Backend:** `public/api/trace.php`  
**Metode HTTP:** `GET`  
**Format URL:** `/api/trace.php?lot_id={LOT_ID}`  
**Tujuan:** Menyajikan data keterlacakan (*traceability*) publik yang beradaptasi secara dinamis sesuai tahap fisik produk (Ceri Petani ➔ Green Bean Pengolah ➔ Karung Gudang ➔ Biji Sangrai Roaster / Cangkir Cafe).

---

## 📌 1. PRINSIP UTAMA KETERTELUSURAN BERJENJANG
Data yang dikembalikan backend **wajib sesuai dengan status produk fisik saat QR Code discan**:
1. **Level 1 (Panen Ceri Petani - prefix `LOT-PTN-`):**  
   Hanya menyajikan data Petani, data Kebun beserta koordinat GPS Patok Tanah EUDR, rincian panen ceri basah (brix, varietas), dan akumulasi audit ICS hulu. *(Belum ada data pengolah/roaster)*.
2. **Level 2 (Green Bean Pengolah - prefix `GB-` atau `PROC-`):**  
   Menyajikan Level 1 + Data Stasiun Olah Wet Mill (metode fermentasi, kadar air, limbah sirkular) + Audit ICS pengolahan. *(Belum ada data roaster/cafe)*.
3. **Level 3 (Karung Gudang - prefix `WH-`):**  
   Menyajikan Level 1 & 2 + Data Kontrol Suhu/RH Gudang Hermetik + Hasil Sortasi Fisik Defect & Grading SCA.
4. **Level 4 (Biji Sangrai Roaster & Cangkir Cafe - prefix `RST-` atau `CUP-`):**  
   Menyajikan **FULL LIFECYCLE (Paling Lengkap)** dari hulu sampai hilir: Kebun & Peta Patok + Wet Mill + Gudang + Profil Sangrai Roastery (RoR, Agtron, DTR) + Spider Radar Cupping SCA + Data Kedai Cafe.

> ⚠️ **ATURAN INTEGRITAS:** Jika `lot_id` tidak ditemukan di database, backend **HARUS mengembalikan HTTP 404**. DILARANG mengembalikan data palsu (*fake fallback*)!

---

## 🗄️ 2. RELASI TABEL & LOGIKA QUERY BERANTAI

Tabel yang terlibat dalam penelusuran berantai:
```text
[cafe_inventory / cups] (source_roasted_bean_id)
         │
         ▼
[roasted_bean_lots] (source_warehouse_lot_id)
         │
         ▼
[warehouse_lots] (source_green_bean_id)
         │
         ▼
[processed_green_bean_lots] (source_farmer_lot_id)
         │
         ▼
[farmer_harvest_lots] (farm_id, farmer_id)
         │
         ▼
[coffee_farms] (patok_list, polygon_points, coordinates)
         │
         ▼
[ics_audit_reports] (target_id, verdict, compliance_score)
```

### Algoritma Pencarian Berantai di `public/api/trace.php`:
1. Ambil `$lotId = trim($_GET['lot_id'] ?? '')`.
2. Lakukan pengecekan bertahap:
   - **Cek 1:** Cari di tabel `cafe_inventory` atau `roasted_bean_lots` (Level 4: Roastery/Cafe).
   - **Cek 2:** Jika tidak ada, cari di tabel `warehouse_lots` (Level 3: Gudang).
   - **Cek 3:** Jika tidak ada, cari di tabel `processed_green_bean_lots` (Level 2: Pengolah).
   - **Cek 4:** Jika tidak ada, cari di tabel `farmer_harvest_lots` (Level 1: Petani).
3. Jika di seluruh tabel tidak ditemukan, kembalikan:
   ```php
   sendError('Data lot kopi tidak ditemukan atau belum terdaftar dalam sistem sertifikasi.', 404);
   ```

---

## 📦 3. SPESIFIKASI SKEMA RESPON JSON (OUTPUT API)

### A. Level 1: Panen Ceri Petani (`productStage: "farmer_harvest"`)
```json
{
  "success": true,
  "data": {
    "productStage": "farmer_harvest",
    "stageLabel": "Tahap 1: Panen Ceri Kebun (Hulu)",
    "lotId": "LOT-PTN-001",
    "farmer": {
      "id": "user-petani-1",
      "name": "Asep Supriatna",
      "farmerCardNumber": "KPT-PGL-2026-001",
      "kelompokTaniName": "Gapoktan Kopi Mandiri Nusantara",
      "location": "Pangalengan, Jawa Barat"
    },
    "farm": {
      "id": "FARM-001",
      "farmName": "Blok Pasir Tilu",
      "altitudeMeters": 1550,
      "variety": "Typica Java Preanger",
      "totalAreaHectares": 2.4,
      "coordinates": {
        "latitude": -7.1824,
        "longitude": 107.5612
      },
      "patokList": [
        {
          "id": "PTK-01",
          "name": "Patok 1 (Sudut Utara - Batas Hutan Lindung)",
          "latitude": -7.18168,
          "longitude": 107.56085,
          "elevationMeters": 1575,
          "physicalType": "Patok Beton BPN",
          "condition": "Kondisi Baik & Kokoh",
          "landmarkNote": "Pohon beringin sempadan hutan"
        },
        {
          "id": "PTK-02",
          "name": "Patok 2 (Sudut Timur - Jalan Tani Desa)",
          "latitude": -7.18195,
          "longitude": 107.56205,
          "elevationMeters": 1565,
          "physicalType": "Patok Beton BPN",
          "condition": "Kondisi Baik & Kokoh"
        }
      ],
      "eudrStatus": "Compliant (Bebas Deforestasi)"
    },
    "harvest": {
      "harvestDate": "2026-09-05",
      "pickingMethod": "Petik Merah Optimal (95%+)",
      "brix": 21.8,
      "totalWeightKg": 500,
      "availableWeightKg": 500
    },
    "icsAudit": {
      "reportNumber": "ICS-AUD-2026-001",
      "complianceScorePercent": 96.0,
      "verdict": "approved",
      "auditorName": "Fajar Pratama, S.Kom. (Petugas ICS)",
      "auditDate": "2026-09-06",
      "stampTitle": "Sertifikasi Kepatuhan GAP & EUDR",
      "digitalSignatureHash": "cct-eudr-sha256-88a91f..."
    }
  }
}
```

---

### B. Level 2: Green Bean Pengolah (`productStage: "processed_green_bean"`)
Membawa **seluruh data Level 1**, ditambah objek `processing`:
```json
{
  "success": true,
  "data": {
    "productStage": "processed_green_bean",
    "stageLabel": "Tahap 2: Stasiun Pengolah (Green Bean)",
    "lotId": "GB-PGL-001",
    "farmer": { ... },
    "farm": { ... },
    "harvest": { ... },
    "icsAudit": { ... },
    "processing": {
      "processorName": "CV Malabar Wet Mill Station",
      "processMethod": "Anaerobic Natural",
      "fermentationTimeHours": 72,
      "moistureContentPercent": 11.2,
      "waterActivityAw": 0.54,
      "gradeTier": "Specialty Grade 1",
      "greenBeanWeightKg": 240,
      "circularWasteManagement": {
        "cascaraUsage": "Dikomposkan untuk pupuk organik kebun",
        "wastewaterTreatment": "IPAL Bio-filter & kolam pengendapan"
      }
    }
  }
}
```

---

### C. Level 3: Karung Gudang (`productStage: "warehouse_lot"`)
Membawa **seluruh data Level 1 & Level 2**, ditambah objek `warehouse`:
```json
{
  "success": true,
  "data": {
    "productStage": "warehouse_lot",
    "stageLabel": "Tahap 3: Gudang Penyimpanan & QA",
    "lotId": "WH-PGL-001",
    "farmer": { ... },
    "farm": { ... },
    "harvest": { ... },
    "processing": { ... },
    "warehouse": {
      "warehouseName": "Gudang Sentra Kopi Priangan (Cold Room A-02)",
      "temperatureCelsius": 18.5,
      "humidityPercent": 55,
      "packagingType": "GrainPro Hermetic + Karung Goni 60kg",
      "defectCount": 2,
      "screenSize": "Size 17-18 (Large Screen)",
      "verifiedScaScore": 87.25,
      "storageDate": "2026-09-12"
    }
  }
}
```

---

### D. Level 4: Biji Sangrai Roaster & Cangkir Cafe (`productStage: "retail_cup"`)
Membawa **seluruh data Level 1, 2, 3**, ditambah objek `roastery` dan `cafe`:
```json
{
  "success": true,
  "data": {
    "productStage": "retail_cup",
    "stageLabel": "Tahap 4: Full Farm-to-Cup (Roastery & Cafe)",
    "lotId": "RST-KRS-001",
    "beanName": "Pangalengan Java Preanger - Typica Anaerobic",
    "farmer": { ... },
    "farm": { ... },
    "harvest": { ... },
    "processing": { ... },
    "warehouse": { ... },
    "roastery": {
      "roasterName": "Karsa Craft Roastery",
      "roasterMachine": "Giesen W6A Artisan",
      "roastDate": "2026-09-18",
      "roastLevel": "Light-Medium Roast",
      "agtronNumber": 68,
      "developmentTimeRatio": 14.2,
      "tastingNotes": ["Jasmine Floral", "Peach Blossom", "Crisp Apple", "Brown Sugar"],
      "scaCuppingScore": 87.75,
      "cuppingEvaluation": {
        "fragranceAroma": 8.75,
        "flavor": 8.75,
        "aftertaste": 8.50,
        "acidity": 8.50,
        "body": 8.50,
        "balance": 8.50,
        "cleanCup": 10.0,
        "sweetness": 9.00,
        "totalScore": 87.75
      }
    },
    "cafe": {
      "cafeName": "Seduh Teduh Specialty Coffee",
      "city": "Kota Bandung",
      "baristaName": "Reza Pratama",
      "brewMethod": "V60 Pour Over (92°C)"
    }
  }
}
```

---

## 🛠️ 4. CONTOH KODE IMPLEMENTASI `public/api/trace.php`

```php
<?php
require_once __DIR__ . '/config.php';

$pdo = getDbConnection();
$lotId = trim($_GET['lot_id'] ?? '');

if (!$lotId) {
    sendError('Parameter lot_id wajib disertakan.', 400);
}

// 1. Coba cari di level Roastery / Cafe (Level 4)
$stmt = $pdo->prepare("SELECT * FROM roasted_bean_lots WHERE id = :id LIMIT 1");
$stmt->execute(['id' => $lotId]);
$roasted = $stmt->fetch();

if ($roasted) {
    $whStmt = $pdo->prepare("SELECT * FROM warehouse_lots WHERE id = :id LIMIT 1");
    $whStmt->execute(['id' => $roasted['source_warehouse_lot_id']]);
    $warehouse = $whStmt->fetch();

    $gbStmt = $pdo->prepare("SELECT * FROM processed_green_bean_lots WHERE id = :id LIMIT 1");
    $gbStmt->execute(['id' => $warehouse['source_green_bean_id'] ?? $roasted['source_green_bean_id']]);
    $proc = $gbStmt->fetch();

    $harvestStmt = $pdo->prepare("SELECT * FROM farmer_harvest_lots WHERE id = :id LIMIT 1");
    $harvestStmt->execute(['id' => $proc['source_farmer_lot_id'] ?? '']);
    $harvest = $harvestStmt->fetch();

    $farmStmt = $pdo->prepare("SELECT * FROM coffee_farms WHERE id = :id LIMIT 1");
    $farmStmt->execute(['id' => $harvest['farm_id'] ?? '']);
    $farm = $farmStmt->fetch();

    sendResponse([
        'productStage' => 'retail_cup',
        'stageLabel'   => 'Tahap 4: Full Farm-to-Cup (Paling Lengkap)',
        'lotId'        => $lotId,
        'beanName'     => $roasted['origin'] . ' - ' . $roasted['variety'],
        'farmer'       => formatFarmerData($harvest),
        'farm'         => formatFarmWithPatoks($farm),
        'harvest'      => formatHarvestData($harvest),
        'icsAudit'     => getIcsAuditSummary($pdo, $farm['id'] ?? '', $harvest['id'] ?? ''),
        'processing'   => formatProcessingData($proc),
        'warehouse'    => formatWarehouseData($warehouse),
        'roastery'     => formatRoasteryData($roasted)
    ]);
}

// 2. Coba cari di level Green Bean Pengolah (Level 2)
$stmt = $pdo->prepare("SELECT * FROM processed_green_bean_lots WHERE id = :id LIMIT 1");
$stmt->execute(['id' => $lotId]);
$proc = $stmt->fetch();

if ($proc) {
    $harvestStmt = $pdo->prepare("SELECT * FROM farmer_harvest_lots WHERE id = :id LIMIT 1");
    $harvestStmt->execute(['id' => $proc['source_farmer_lot_id']]);
    $harvest = $harvestStmt->fetch();

    $farmStmt = $pdo->prepare("SELECT * FROM coffee_farms WHERE id = :id LIMIT 1");
    $farmStmt->execute(['id' => $harvest['farm_id'] ?? '']);
    $farm = $farmStmt->fetch();

    sendResponse([
        'productStage' => 'processed_green_bean',
        'stageLabel'   => 'Tahap 2: Stasiun Pengolah (Green Bean)',
        'lotId'        => $lotId,
        'farmer'       => formatFarmerData($harvest),
        'farm'         => formatFarmWithPatoks($farm),
        'harvest'      => formatHarvestData($harvest),
        'icsAudit'     => getIcsAuditSummary($pdo, $farm['id'] ?? '', $harvest['id'] ?? ''),
        'processing'   => formatProcessingData($proc)
    ]);
}

// 3. Coba cari di level Ceri Petani (Level 1)
$stmt = $pdo->prepare("SELECT * FROM farmer_harvest_lots WHERE id = :id LIMIT 1");
$stmt->execute(['id' => $lotId]);
$harvest = $stmt->fetch();

if ($harvest) {
    $farmStmt = $pdo->prepare("SELECT * FROM coffee_farms WHERE id = :id LIMIT 1");
    $farmStmt->execute(['id' => $harvest['farm_id'] ?? '']);
    $farm = $farmStmt->fetch();

    sendResponse([
        'productStage' => 'farmer_harvest',
        'stageLabel'   => 'Tahap 1: Panen Ceri Kebun (Hulu)',
        'lotId'        => $lotId,
        'farmer'       => formatFarmerData($harvest),
        'farm'         => formatFarmWithPatoks($farm),
        'harvest'      => formatHarvestData($harvest),
        'icsAudit'     => getIcsAuditSummary($pdo, $farm['id'] ?? '', $harvest['id'] ?? '')
    ]);
}

// 4. Jika tidak ada di semua level: 404 NOT FOUND
sendError('Data lot kopi tidak ditemukan atau belum terdaftar dalam sistem sertifikasi.', 404);
```

---
**Catatan untuk Backend Developer:**
Gunakan fungsi `formatFarmWithPatoks()` untuk menguraikan kolom `patok_list` dari format JSON string di database menjadi array objek koordinat patok lengkap dengan elevasi dan tipe fisik BPN.
