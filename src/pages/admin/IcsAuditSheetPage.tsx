import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { IcsChecklistItem, IcsAuditReport } from '../../types/coffee';
import {
  ClipboardCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  MinusCircle,
  ArrowLeft,
  Printer,
  Save,
  ShieldCheck,
  Users,
  TreePine,
  Sprout,
  MapPin,
  Calendar,
  BadgeCheck,
  Info,
  Scale,
  Sparkles,
  FileText,
  RotateCcw,
  Check,
  X,
  Building2,
  Hash,
  Award,
  Layers,
  Leaf,
  Clock,
  Eye,
} from 'lucide-react';

// ============================================================================
// MASTER CHECKLIST DEFINITIONS DENGAN MULTI-FAKTOR AUDIT LAPANGAN ICS
// ============================================================================
const ICS_MASTER_CHECKLISTS: IcsChecklistItem[] = [
  // --------------------------------------------------------------------------
  // 1. AUDIT TERPADU PETANI (5 FAKTOR AUDIT KOMPREHENSIF)
  // --------------------------------------------------------------------------

  // FAKTOR I: ASPEK LEGALITAS & KEPENDUDUKAN ANGGOTA
  {
    id: 'ics-ptn-f1-01',
    category: 'farmer',
    factorId: 'ptn_f1_legalitas',
    factorNumber: 'FAKTOR I',
    factorName: 'Aspek Legalitas & Kependudukan Petani',
    factorDescription: 'Verifikasi keabsahan identitas sipil, keanggotaan kelompok tani, dan pakta integritas resmi.',
    code: 'ICS-PTN-F1-01',
    question: 'Validitas Identitas & NIK 16 Digit (Dukcapil)',
    description: 'NIK 16 digit terverifikasi valid sesuai KTP fisik, database kependudukan nasional, dan tidak terdaftar ganda.',
    standardReference: 'UU No. 24/2013 & SOP Administrasi Kependudukan',
    thresholdOrStandard: 'NIK 16 Digit Valid & Aktif di Dukcapil',
    defaultMeasuredValue: 'KTP Fisik Terverifikasi (NIK Valid)',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f1-02',
    category: 'farmer',
    factorId: 'ptn_f1_legalitas',
    factorNumber: 'FAKTOR I',
    factorName: 'Aspek Legalitas & Kependudukan Petani',
    factorDescription: 'Verifikasi keabsahan identitas sipil, keanggotaan kelompok tani, dan pakta integritas resmi.',
    code: 'ICS-PTN-F1-02',
    question: 'Keaktifan Nomor KTA Kelompok Tani',
    description: 'Petani terdaftar resmi dalam buku register anggota kelompok tani, berdomisili di wilayah binaan, dan iuran aktif.',
    standardReference: 'AD/ART Gapoktan Kopi Mandiri Nusantara',
    thresholdOrStandard: 'Tercatat di Buku Induk Anggota & Iuran Aktif',
    defaultMeasuredValue: 'KTA Aktif Terdaftar di Buku Induk',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f1-03',
    category: 'farmer',
    factorId: 'ptn_f1_legalitas',
    factorNumber: 'FAKTOR I',
    factorName: 'Aspek Legalitas & Kependudukan Petani',
    factorDescription: 'Verifikasi keabsahan identitas sipil, keanggotaan kelompok tani, dan pakta integritas resmi.',
    code: 'ICS-PTN-F1-03',
    question: 'Pakta Integritas Kelompok Tani & Larangan Oplos',
    description: 'Petani telah menandatangani komitmen bermaterai untuk tidak membeli kopi dari luar/ilegal dan tidak mencampur lot panen.',
    standardReference: 'Pedoman Sistem Pengendalian Internal (ICS) Koperasi',
    thresholdOrStandard: 'Surat Pakta Integritas Bermaterai Sah',
    defaultMeasuredValue: 'Pakta Integritas 2026 Tersedia & Ditandatangani',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f1-04',
    category: 'farmer',
    factorId: 'ptn_f1_legalitas',
    factorNumber: 'FAKTOR I',
    factorName: 'Aspek Legalitas & Kependudukan Petani',
    factorDescription: 'Verifikasi keabsahan identitas sipil, keanggotaan kelompok tani, dan pakta integritas resmi.',
    code: 'ICS-PTN-F1-04',
    question: 'Buku Catatan Usaha Tani & Rekam Jejak Panen',
    description: 'Tersedia buku catatan harian usaha tani mencakup riwayat tanggal panen, estimasi volume, dan penjualan kopi.',
    standardReference: 'SNI Organik 6729:2016 & Traceability SOP',
    thresholdOrStandard: 'Tersedia Buku Catatan Produksi Terisi Rapi',
    defaultMeasuredValue: 'Buku Catatan Usaha Tani Terisi Teratur',
    isMandatory: false,
  },

  // FAKTOR II: ASPEK SOSIAL, HAK BURUH & LARANGAN PEKERJA ANAK
  {
    id: 'ics-ptn-f2-01',
    category: 'farmer',
    factorId: 'ptn_f2_sosial',
    factorNumber: 'FAKTOR II',
    factorName: 'Aspek Sosial, Hak Buruh & Larangan Pekerja Anak',
    factorDescription: 'Pemeriksaan kepatuhan etika sosial, pencegahan eksploitasi anak usia sekolah, dan perlindungan buruh.',
    code: 'ICS-PTN-F2-01',
    question: 'Larangan Pekerja Anak (Child Labor Free)',
    description: 'Tidak mempekerjakan anak di bawah usia kerja wajib sekolah (<15 tahun) dalam aktivitas fisik berat atau berbahaya di kebun.',
    standardReference: 'Konvensi ILO No. 138 & 182 / Fairtrade Standard',
    thresholdOrStandard: 'Nol (0) Anak Usia Sekolah Bekerja Berat di Kebun',
    defaultMeasuredValue: '0 Pekerja Anak (Bebas Pekerja Anak)',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f2-02',
    category: 'farmer',
    factorId: 'ptn_f2_sosial',
    factorNumber: 'FAKTOR II',
    factorName: 'Aspek Sosial, Hak Buruh & Larangan Pekerja Anak',
    factorDescription: 'Pemeriksaan kepatuhan etika sosial, pencegahan eksploitasi anak usia sekolah, dan perlindungan buruh.',
    code: 'ICS-PTN-F2-02',
    question: 'Kesetaraan Upah & Perlakuan Adil Buruh Pemetik',
    description: 'Upah buruh pemetik musiman dibayarkan tepat waktu sesuai kesepakatan regional/standar koperasi tanpa diskriminasi.',
    standardReference: 'Pedoman Ketenagakerjaan Koperasi Kopi',
    thresholdOrStandard: 'Upah Pemetik Sesuai Standar Layak (≥ Rp 2.500/kg ceri)',
    defaultMeasuredValue: 'Upah Rp 2.500 - 3.000/kg Terbayar Tepat Waktu',
    isMandatory: false,
  },
  {
    id: 'ics-ptn-f2-03',
    category: 'farmer',
    factorId: 'ptn_f2_sosial',
    factorNumber: 'FAKTOR II',
    factorName: 'Aspek Sosial, Hak Buruh & Larangan Pekerja Anak',
    factorDescription: 'Pemeriksaan kepatuhan etika sosial, pencegahan eksploitasi anak usia sekolah, dan perlindungan buruh.',
    code: 'ICS-PTN-F2-03',
    question: 'Fasilitas Keselamatan & Kesehatan Kerja (K3 APD)',
    description: 'Petani dan buruh panen menggunakan alat pelindung diri dasar (sepatu bot, topi, sarung tangan) dan kotak P3K darurat.',
    standardReference: 'Standar GAP K3 Pertanian Rakyat',
    thresholdOrStandard: 'Tersedia APD Dasar & P3K Lapangan',
    defaultMeasuredValue: 'Pemetik Memakai Sepatu Bot & Pelindung Kepala',
    isMandatory: false,
  },

  // FAKTOR III: ASPEK LAHAN GARAPAN & KEPATUHAN REGULASI EUDR
  {
    id: 'ics-ptn-f3-01',
    category: 'farmer',
    factorId: 'ptn_f3_lahan_eudr',
    factorNumber: 'FAKTOR III',
    factorName: 'Aspek Lahan Garapan & Kepatuhan Regulasi EUDR',
    factorDescription: 'Audit batas poligon kebun, titik koordinat GPS actual, dan kepatuhan bebas deforestasi cut-off 2020.',
    code: 'ICS-PTN-F3-01',
    question: 'Keabsahan Hak Penguasaan Lahan & Bebas Sengketa',
    description: 'Bukti penguasaan lahan sah (SHM/Girik/Surat Izin Garap Desa/Perhutani KTH) dan tidak sedang dalam sengketa tenurial.',
    standardReference: 'Regulasi Agraria BPN & Tata Ruang Kehutanan',
    thresholdOrStandard: 'Bukti Penguasaan Lahan Sah Tanpa Sengketa',
    defaultMeasuredValue: 'Surat Garap / Girik Sah Nomor Terdaftar',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f3-02',
    category: 'farmer',
    factorId: 'ptn_f3_lahan_eudr',
    factorNumber: 'FAKTOR III',
    factorName: 'Aspek Lahan Garapan & Kepatuhan Regulasi EUDR',
    factorDescription: 'Audit batas poligon kebun, titik koordinat GPS actual, dan kepatuhan bebas deforestasi cut-off 2020.',
    code: 'ICS-PTN-F3-02',
    question: 'Titik Koordinat GPS Lapangan & Patok Sudut Poligon',
    description: 'Titik koordinat latitude/longitude diuji di lapangan dengan deviasi <5 meter serta patok sudut fisik terpasang kokoh.',
    standardReference: 'EUDR Geolocation Guidelines (EU 2023/1115)',
    thresholdOrStandard: 'Deviasi GPS < 5 Meter & Minimal 3 Patok Batas',
    defaultMeasuredValue: '4 Patok Terpasang, Deviasi GPS 3.1 Meter',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f3-03',
    category: 'farmer',
    factorId: 'ptn_f3_lahan_eudr',
    factorNumber: 'FAKTOR III',
    factorName: 'Aspek Lahan Garapan & Kepatuhan Regulasi EUDR',
    factorDescription: 'Audit batas poligon kebun, titik koordinat GPS actual, dan kepatuhan bebas deforestasi cut-off 2020.',
    code: 'ICS-PTN-F3-03',
    question: 'Bebas Deforestasi EUDR (Cut-off Date 31 Des 2020)',
    description: 'Lahan terbukti bukan hasil perambahan atau konversi hutan primer/sekunder setelah batas cut-off 31 Desember 2020.',
    standardReference: 'European Deforestation Regulation (EU 2023/1115)',
    thresholdOrStandard: 'Kebun Dikelola Sebelum 31 Desember 2020 (Lolos Satelit)',
    defaultMeasuredValue: 'Kebun Berdiri Sejak 2018 (Bebas Deforestasi)',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f3-04',
    category: 'farmer',
    factorId: 'ptn_f3_lahan_eudr',
    factorNumber: 'FAKTOR III',
    factorName: 'Aspek Lahan Garapan & Kepatuhan Regulasi EUDR',
    factorDescription: 'Audit batas poligon kebun, titik koordinat GPS actual, dan kepatuhan bebas deforestasi cut-off 2020.',
    code: 'ICS-PTN-F3-04',
    question: 'Sempadan Sungai & Buffer Zone Kawasan Lindung',
    description: 'Terdapat jarak aman (buffer zone minimal 50 meter) dari sempadan sungai atau batas kawasan hutan suaka alam/TN.',
    standardReference: 'UU No. 5/1990 Konservasi Sumber Daya Alam Hayati',
    thresholdOrStandard: 'Buffer Zone ≥ 50 Meter dari Sempadan Sungai/Hutan Inti',
    defaultMeasuredValue: 'Jarak Terdekat 75 Meter dari Sempadan Air',
    isMandatory: false,
  },

  // FAKTOR IV: ASPEK BUDIDAYA GAP & KELESTARIAN LINGKUNGAN
  {
    id: 'ics-ptn-f4-01',
    category: 'farmer',
    factorId: 'ptn_f4_budidaya_gap',
    factorNumber: 'FAKTOR IV',
    factorName: 'Aspek Budidaya GAP & Kelestarian Lingkungan',
    factorDescription: 'Penilaian teknik budidaya ramah lingkungan, naungan agroforestri, dan larangan herbisida kimia terlarang.',
    code: 'ICS-PTN-F4-01',
    question: 'Riwayat Pelatihan Good Agricultural Practices (GAP)',
    description: 'Petani telah mengikuti bimbingan teknis budidaya, pemangkasan (pruning), dan sanitasi kebun minimal 1 kali per musim.',
    standardReference: 'Modul Pelatihan GAP Dinas Pertanian & Koperasi',
    thresholdOrStandard: 'Sertifikat / Presensi Bimtek GAP Min. 1x / Musim',
    defaultMeasuredValue: 'Sertifikat Bimtek GAP Koperasi 2025',
    isMandatory: false,
  },
  {
    id: 'ics-ptn-f4-02',
    category: 'farmer',
    factorId: 'ptn_f4_budidaya_gap',
    factorNumber: 'FAKTOR IV',
    factorName: 'Aspek Budidaya GAP & Kelestarian Lingkungan',
    factorDescription: 'Penilaian teknik budidaya ramah lingkungan, naungan agroforestri, dan larangan herbisida kimia terlarang.',
    code: 'ICS-PTN-F4-02',
    question: 'Pohon Penaung & Naungan Agroforestri (≥ 30%)',
    description: 'Tersedia pohon penaung (Lamtoro, Sengon, Alpukat, Jeruk) minimal 30% dari tajuk kebun untuk menjaga iklim mikro.',
    standardReference: 'Standar Specialty Shade-Grown Agroforestry',
    thresholdOrStandard: 'Tutupan Tajuk Pohon Naungan ≥ 30%',
    defaultMeasuredValue: 'Tutupan Tajuk 35% (Lamtoro & Sengon)',
    isMandatory: false,
  },
  {
    id: 'ics-ptn-f4-03',
    category: 'farmer',
    factorId: 'ptn_f4_budidaya_gap',
    factorNumber: 'FAKTOR IV',
    factorName: 'Aspek Budidaya GAP & Kelestarian Lingkungan',
    factorDescription: 'Penilaian teknik budidaya ramah lingkungan, naungan agroforestri, dan larangan herbisida kimia terlarang.',
    code: 'ICS-PTN-F4-03',
    question: 'Konservasi Tanah (Terasering & Rorak Penahan Erosi)',
    description: 'Pada lereng kemiringan >15%, telah dibuat rorak, teras bangku, atau penanaman rumput vetiver penahan erosi.',
    standardReference: 'Pedoman Konservasi DAS Pertanian Lereng',
    thresholdOrStandard: 'Rorak / Teras Bangku Aktif di Lereng Curam',
    defaultMeasuredValue: 'Rorak Berfungsi Baik Menampung Sedimen',
    isMandatory: false,
  },
  {
    id: 'ics-ptn-f4-04',
    category: 'farmer',
    factorId: 'ptn_f4_budidaya_gap',
    factorNumber: 'FAKTOR IV',
    factorName: 'Aspek Budidaya GAP & Kelestarian Lingkungan',
    factorDescription: 'Penilaian teknik budidaya ramah lingkungan, naungan agroforestri, dan larangan herbisida kimia terlarang.',
    code: 'ICS-PTN-F4-04',
    question: 'Larangan Mutlak Herbisida Kimia (Dirty Dozen)',
    description: 'Tidak ada sisa kemasan atau jejak penyemprotan bahan kimia berbahaya (Paraquat, Glyphosate, Brodifacoum) di kebun.',
    standardReference: 'SNI Organik 6729:2016 & Pesticide Action Network',
    thresholdOrStandard: 'Zero Residu Kimia Berbahaya (Babat Rumput Manual)',
    defaultMeasuredValue: 'Pembersihan Rumput Menggunakan Mesin Babat Mekanis',
    isMandatory: true,
  },

  // FAKTOR V: ASPEK DISIPLIN PANEN & KUALITAS MUTU CERI HULU
  {
    id: 'ics-ptn-f5-01',
    category: 'farmer',
    factorId: 'ptn_f5_mutu_panen',
    factorNumber: 'FAKTOR V',
    factorName: 'Aspek Disiplin Panen & Kualitas Mutu Ceri Hulu',
    factorDescription: 'Pemeriksaan standar petik merah selektif, kemanisan brix refraktometer, dan higienitas penyerahan panen.',
    code: 'ICS-PTN-F5-01',
    question: 'Disiplin Selektif Petik Merah Optimal (≥ 95%)',
    description: 'Hasil sortasi sampel visual acak menunjukkan buah ceri yang dipetik 95%+ berwarna merah tua masak fisiologis.',
    standardReference: 'SOP Panen Selektif Specialty Coffee',
    thresholdOrStandard: 'Rasio Buah Merah Matang ≥ 95% dari Sampel',
    defaultMeasuredValue: 'Uji Sampel Petik Merah: 97.5% Merah Marun',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f5-02',
    category: 'farmer',
    factorId: 'ptn_f5_mutu_panen',
    factorNumber: 'FAKTOR V',
    factorName: 'Aspek Disiplin Panen & Kualitas Mutu Ceri Hulu',
    factorDescription: 'Pemeriksaan standar petik merah selektif, kemanisan brix refraktometer, dan higienitas penyerahan panen.',
    code: 'ICS-PTN-F5-02',
    question: 'Uji Kadar Kemanisan Refraktometer Brix (≥ 18.0° Bx)',
    description: 'Uji refraktometer getah buah ceri segar menunjukkan kadar gula minimal 18.0° Bx untuk menjamin potensi cita rasa manis.',
    standardReference: 'Standar Mutu Ceri Kelompok Tani',
    thresholdOrStandard: 'Pembacaan Refraktometer Optik ≥ 18.0° Bx',
    defaultMeasuredValue: 'Hasil Uji Refraktometer: 21.0° Bx',
    isMandatory: true,
  },
  {
    id: 'ics-ptn-f5-03',
    category: 'farmer',
    factorId: 'ptn_f5_mutu_panen',
    factorNumber: 'FAKTOR V',
    factorName: 'Aspek Disiplin Panen & Kualitas Mutu Ceri Hulu',
    factorDescription: 'Pemeriksaan standar petik merah selektif, kemanisan brix refraktometer, dan higienitas penyerahan panen.',
    code: 'ICS-PTN-F5-03',
    question: 'Higienitas Wadah & Jeda Antar ke Wet Mill (< 12 Jam)',
    description: 'Karung goni/wadah bersih bebas kontaminasi oli/minyak dan diserahkan ke wet mill maksimal 12 jam setelah petik.',
    standardReference: 'Protokol Pengendalian Fermentasi Pascapanen',
    thresholdOrStandard: 'Wadah Bersih Food-Grade & Jeda Waktu < 12 Jam',
    defaultMeasuredValue: 'Karung Goni Bersih, Tiba di Mill 4.5 Jam Pasca Petik',
    isMandatory: true,
  },

  // --------------------------------------------------------------------------
  // 2. AUDIT KHUSUS LAHAN KEBUN (4 FAKTOR EVALUASI SPASIAL & EUDR)
  // --------------------------------------------------------------------------
  {
    id: 'ics-farm-f1-01',
    category: 'farm',
    factorId: 'farm_f1_spasial',
    factorNumber: 'FAKTOR I',
    factorName: 'Spasial, Koordinat GPS & Patok Batas Poligon BPN',
    factorDescription: 'Audit presisi titik koordinat GPS actual dan keabsahan patok sudut tapal batas fisik kebun.',
    code: 'ICS-KBN-F1-01',
    question: 'Verifikasi Koordinat GPS Actual Titik Tengah Lapangan',
    description: 'Titik koordinat GPS lintang/bujur dan elevasi mdpl diuji di lokasi kebun dengan toleransi deviasi <5 meter.',
    standardReference: 'EUDR Geolocation Guidelines (EU 2023/1115)',
    thresholdOrStandard: 'Akurasi Koordinat GPS < 5m & Peta Terdaftar',
    defaultMeasuredValue: 'GPS Terkunci: Deviasi 2.4 meter',
    isMandatory: true,
  },
  {
    id: 'ics-farm-f1-02',
    category: 'farm',
    factorId: 'farm_f1_spasial',
    factorNumber: 'FAKTOR I',
    factorName: 'Spasial, Koordinat GPS & Patok Batas Poligon BPN',
    factorDescription: 'Audit presisi titik koordinat GPS actual dan keabsahan patok sudut tapal batas fisik kebun.',
    code: 'ICS-KBN-F1-02',
    question: 'Patok Tapal Batas Sudut Poligon (BPN / Batas Alam)',
    description: 'Terdapat minimal 3-4 patok sudut batas tanah yang terpasang kokoh dan disepakati oleh pemilik lahan bersebelahan.',
    standardReference: 'Peraturan Agraria BPN & Peta Poligon ICS',
    thresholdOrStandard: 'Minimal 3-4 Patok Sudut Poligon Fisik Kokoh',
    defaultMeasuredValue: '4 Patok Beton BPN Terverifikasi di Peta',
    isMandatory: true,
  },
  {
    id: 'ics-farm-f1-03',
    category: 'farm',
    factorId: 'farm_f1_spasial',
    factorNumber: 'FAKTOR I',
    factorName: 'Spasial, Koordinat GPS & Patok Batas Poligon BPN',
    factorDescription: 'Audit presisi titik koordinat GPS actual dan keabsahan patok sudut tapal batas fisik kebun.',
    code: 'ICS-KBN-F1-03',
    question: 'Kesesuaian Luas Riil dengan Peta Digital Poligon',
    description: 'Luas area hektar fisik tanah sesuai dengan kalkulasi poligon koordinat digital (selisih toleransi < 5%).',
    standardReference: 'SOP Pemetaan GIS Kelompok Tani',
    thresholdOrStandard: 'Deviasi Luas Fisik vs Poligon < 5%',
    defaultMeasuredValue: 'Luas Fisik 1.8 Ha Sesuai Luas Poligon 1.82 Ha',
    isMandatory: false,
  },

  {
    id: 'ics-farm-f2-01',
    category: 'farm',
    factorId: 'farm_f2_eudr',
    factorNumber: 'FAKTOR II',
    factorName: 'Kepatuhan Regulasi EUDR Deforestation-Free',
    factorDescription: 'Audit bebas konversi hutan primer pasca cut-off date 2020 dan overlay citra satelit.',
    code: 'ICS-KBN-F2-01',
    question: 'Kepatuhan Bebas Deforestasi (EUDR Cut-off 2020)',
    description: 'Lahan terbukti bukan hasil perambahan atau penggundulan hutan primer/sekunder setelah 31 Desember 2020.',
    standardReference: 'European Deforestation Regulation (EU 2023/1115)',
    thresholdOrStandard: 'Tanpa Konversi Hutan Pasca 31 Des 2020',
    defaultMeasuredValue: 'Lahan Kopi Sejak 2017 (Bebas Deforestasi)',
    isMandatory: true,
  },
  {
    id: 'ics-farm-f2-02',
    category: 'farm',
    factorId: 'farm_f2_eudr',
    factorNumber: 'FAKTOR II',
    factorName: 'Kepatuhan Regulasi EUDR Deforestation-Free',
    factorDescription: 'Audit bebas konversi hutan primer pasca cut-off date 2020 dan overlay citra satelit.',
    code: 'ICS-KBN-F2-02',
    question: 'Verifikasi Overlay Citra Satelit Historis (Canopy Cover)',
    description: 'Pemeriksaan citra satelit Sentinel/Landsat membuktikan tutupan kanopi tidak mengalami alih fungsi hutan lindung.',
    standardReference: 'Global Forest Watch & Platform Traceability EUDR',
    thresholdOrStandard: 'Lolos Verifikasi Citra Satelit Multitemporal',
    defaultMeasuredValue: 'Overlay Satelit Lolos Verifikasi Kerapatan Kanopi',
    isMandatory: true,
  },
  {
    id: 'ics-farm-f2-03',
    category: 'farm',
    factorId: 'farm_f2_eudr',
    factorNumber: 'FAKTOR II',
    factorName: 'Kepatuhan Regulasi EUDR Deforestation-Free',
    factorDescription: 'Audit bebas konversi hutan primer pasca cut-off date 2020 dan overlay citra satelit.',
    code: 'ICS-KBN-F2-03',
    question: 'Jarak Aman (Buffer Zone) dari Kawasan Hutan Lindung/TN',
    description: 'Terdapat zona pembatas yang jelas memisahkan kebun kopi dengan zona inti taman nasional / hutan suaka.',
    standardReference: 'Pedoman Konservasi Kawasan Hutan Nasional',
    thresholdOrStandard: 'Buffer Zone ≥ 50 Meter dari Batas Hutan Inti',
    defaultMeasuredValue: 'Buffer Zone 120 Meter dari Batas Hutan Lindung',
    isMandatory: false,
  },

  {
    id: 'ics-farm-f3-01',
    category: 'farm',
    factorId: 'farm_f3_agroklimat',
    factorNumber: 'FAKTOR III',
    factorName: 'Agroklimat, Elevasi & Tata Ruang Kebun',
    factorDescription: 'Audit kesesuaian agroklimat mikro, ketinggian elevasi mdpl, dan populasi kerapatan tanaman kopi.',
    code: 'ICS-KBN-F3-01',
    question: 'Kesesuaian Ketinggian Elevasi (mdpl) & Varietas',
    description: 'Elevasi lahan terukur sesuai syarat tumbuh varietas (Arabika ≥ 1.000 mdpl, Robusta 400 - 900 mdpl).',
    standardReference: 'Pedoman Budidaya Kopi Berkelanjutan Puslitkoka',
    thresholdOrStandard: 'Arabika ≥ 1.000 mdpl / Robusta 400 - 900 mdpl',
    defaultMeasuredValue: 'Elevasi 1.450 mdpl (Sesuai Arabika Typica/Ateng)',
    isMandatory: true,
  },
  {
    id: 'ics-farm-f3-02',
    category: 'farm',
    factorId: 'farm_f3_agroklimat',
    factorNumber: 'FAKTOR III',
    factorName: 'Agroklimat, Elevasi & Tata Ruang Kebun',
    factorDescription: 'Audit kesesuaian agroklimat mikro, ketinggian elevasi mdpl, dan populasi kerapatan tanaman kopi.',
    code: 'ICS-KBN-F3-02',
    question: 'Populasi Kerapatan Tanaman (1.600 - 2.500 Pohon/Ha)',
    description: 'Kerapatan jarak tanam optimal (2m x 2.5m atau 2m x 3m) untuk sirkulasi udara dan intensitas cahaya matahari.',
    standardReference: 'Standar Jarak Tanam Kopi Specialty',
    thresholdOrStandard: '1.600 - 2.500 Pohon Kopi Produktif per Hektar',
    defaultMeasuredValue: 'Populasi 2.100 Pohon/Ha dengan Jarak Tanam 2x2.5m',
    isMandatory: false,
  },
  {
    id: 'ics-farm-f3-03',
    category: 'farm',
    factorId: 'farm_f3_agroklimat',
    factorNumber: 'FAKTOR III',
    factorName: 'Agroklimat, Elevasi & Tata Ruang Kebun',
    factorDescription: 'Audit kesesuaian agroklimat mikro, ketinggian elevasi mdpl, dan populasi kerapatan tanaman kopi.',
    code: 'ICS-KBN-F3-03',
    question: 'Pohon Pelindung & Naungan Agroforestri (≥ 30%)',
    description: 'Terdapat pohon penaung berakar dalam (Lamtoro, Sengon, Jeruk, Alpukat) untuk mencegah penguapan ekstrem.',
    standardReference: 'Specialty Shade-Grown Agroforestry Standard',
    thresholdOrStandard: 'Tutupan Tajuk Naungan ≥ 30%',
    defaultMeasuredValue: 'Naungan 38% Beragam Spesies Tanaman',
    isMandatory: false,
  },

  {
    id: 'ics-farm-f4-01',
    category: 'farm',
    factorId: 'farm_f4_ekologi',
    factorNumber: 'FAKTOR IV',
    factorName: 'Konservasi Ekologi, Sumber Air & Bebas Agrokimia',
    factorDescription: 'Pemeriksaan sanitasi ekologi, pembuatan rorak terasering, dan larangan herbisida kimia terlarang.',
    code: 'ICS-KBN-F4-01',
    question: 'Konservasi Lereng Curam (Terasering & Rorak Erosi)',
    description: 'Pada lahan berkontur miring, teras bangku atau rorak telah dibuat untuk menahan hanyutan lapisan humus atas.',
    standardReference: 'Standar Konservasi Tanah dan Air Kementan',
    thresholdOrStandard: 'Teras Bangku / Rorak Penahan Humus Aktif',
    defaultMeasuredValue: 'Terasering & Rorak Terawat Baik',
    isMandatory: false,
  },
  {
    id: 'ics-farm-f4-02',
    category: 'farm',
    factorId: 'farm_f4_ekologi',
    factorNumber: 'FAKTOR IV',
    factorName: 'Konservasi Ekologi, Sumber Air & Bebas Agrokimia',
    factorDescription: 'Pemeriksaan sanitasi ekologi, pembuatan rorak terasering, dan larangan herbisida kimia terlarang.',
    code: 'ICS-KBN-F4-02',
    question: 'Perlindungan Sempadan Mata Air & Sungai Alami',
    description: 'Area resapan dan bantaran sungai tidak ditanami hingga bibir air dan bebas dari pembuangan limbah pertanian.',
    standardReference: 'Perlindungan Sumber Daya Air Berkelanjutan',
    thresholdOrStandard: 'Bantaran Aliran Air Terjaga Alami Bebas Polutan',
    defaultMeasuredValue: 'Bantaran Sungai Ditumbuhi Vegetasi Alami',
    isMandatory: false,
  },
  {
    id: 'ics-farm-f4-03',
    category: 'farm',
    factorId: 'farm_f4_ekologi',
    factorNumber: 'FAKTOR IV',
    factorName: 'Konservasi Ekologi, Sumber Air & Bebas Agrokimia',
    factorDescription: 'Pemeriksaan sanitasi ekologi, pembuatan rorak terasering, dan larangan herbisida kimia terlarang.',
    code: 'ICS-KBN-F4-03',
    question: 'Bebas Pestisida & Herbisida Kimia Terlarang (Dirty Dozen)',
    description: 'Bebas dari sisa botol atau semprotan kimia terlarang (Paraquat, Glyphosate, Carbofuran).',
    standardReference: 'SNI 6729:2016 & Pesticide Action Network',
    thresholdOrStandard: 'Zero Residu Kimia Berbahaya di Lingkungan Kebun',
    defaultMeasuredValue: 'Nol Jejak Herbisida Kimia (Penyiangan Ramah Lingkungan)',
    isMandatory: true,
  },

  // --------------------------------------------------------------------------
  // 3. AUDIT KHUSUS MUTU PANEN CERI (4 FAKTOR EVALUASI MUTU & BRIX)
  // --------------------------------------------------------------------------
  {
    id: 'ics-hrv-f1-01',
    category: 'harvest',
    factorId: 'hrv_f1_kematangan',
    factorNumber: 'FAKTOR I',
    factorName: 'Tingkat Kematangan & Sortasi Petik Merah',
    factorDescription: 'Pemeriksaan visual rasio kematangan ceri merah optimal dan ambang toleransi buah hijau.',
    code: 'ICS-PNN-F1-01',
    question: 'Kematangan Petik Merah Optimal (≥ 95%)',
    description: 'Hasil sortasi sampel visual acak menunjukkan buah ceri berwarna merah tua masak optimal minimal 95%.',
    standardReference: 'SOP Panen Selektif Specialty Coffee',
    thresholdOrStandard: 'Rasio Buah Merah Matang ≥ 95% dari Total Bobot Sampel',
    defaultMeasuredValue: 'Hasil Sortasi Visual: 98% Merah Matang',
    isMandatory: true,
  },
  {
    id: 'ics-hrv-f1-02',
    category: 'harvest',
    factorId: 'hrv_f1_kematangan',
    factorNumber: 'FAKTOR I',
    factorName: 'Tingkat Kematangan & Sortasi Petik Merah',
    factorDescription: 'Pemeriksaan visual rasio kematangan ceri merah optimal dan ambang toleransi buah hijau.',
    code: 'ICS-PNN-F1-02',
    question: 'Toleransi Maksimal Buah Hijau / Mengkal (< 3%)',
    description: 'Persentase buah hijau mentah (unripe) atau buah kuning mengkal tidak melebihi 3% dari total sampling lot.',
    standardReference: 'Standar Cacat Fisik Panen Koperasi',
    thresholdOrStandard: 'Ceri Hijau / Mengkal Maksimal ≤ 3%',
    defaultMeasuredValue: 'Buah Hijau Terukur: 1.2% (Memenuhi Syarat)',
    isMandatory: true,
  },
  {
    id: 'ics-hrv-f1-03',
    category: 'harvest',
    factorId: 'hrv_f1_kematangan',
    factorNumber: 'FAKTOR I',
    factorName: 'Tingkat Kematangan & Sortasi Petik Merah',
    factorDescription: 'Pemeriksaan visual rasio kematangan ceri merah optimal dan ambang toleransi buah hijau.',
    code: 'ICS-PNN-F1-03',
    question: 'Keseragaman Ukuran & Integritas Fisik Ceri',
    description: 'Buah ceri memiliki ukuran relatif seragam, tidak pecah kulit (cracked), dan bebas buah kempes/kopong.',
    standardReference: 'Standar Mutu Fisik Buah Kopi Hulu',
    thresholdOrStandard: 'Buah Segar Utuh & Berbobot Seragam',
    defaultMeasuredValue: 'Kulit Buah Utuh, Tidak Ada Ceri Pecah',
    isMandatory: false,
  },

  {
    id: 'ics-hrv-f2-01',
    category: 'harvest',
    factorId: 'hrv_f2_brix',
    factorNumber: 'FAKTOR II',
    factorName: 'Uji Laboratorium Kemanisan Brix Refraktometer',
    factorDescription: 'Pengukuran kadar gula getah ceri menggunakan refraktometer optik/digital untuk jaminan rasa manis.',
    code: 'ICS-PNN-F2-01',
    question: 'Kadar Kemanisan Refraktometer Brix (≥ 18.0° Bx)',
    description: 'Uji refraktometer getah buah ceri segar menunjukkan kadar gula minimal 18.0° Bx untuk potensi cita rasa tinggi.',
    standardReference: 'Standar Mutu Ceri Kelompok Tani',
    thresholdOrStandard: 'Pembacaan Refraktometer Optik ≥ 18.0° Bx',
    defaultMeasuredValue: 'Uji Refraktometer: 21.5° Bx (Manis Optimal)',
    isMandatory: true,
  },
  {
    id: 'ics-hrv-f2-02',
    category: 'harvest',
    factorId: 'hrv_f2_brix',
    factorNumber: 'FAKTOR II',
    factorName: 'Uji Laboratorium Kemanisan Brix Refraktometer',
    factorDescription: 'Pengukuran kadar gula getah ceri menggunakan refraktometer optik/digital untuk jaminan rasa manis.',
    code: 'ICS-PNN-F2-02',
    question: 'Kekentalan & Kepadatan Lendir Getah Mucilage',
    description: 'Cairan getah mucilage bertekstur kental lengket khas ceri yang matang sempurna di pohon (tidak berair tawar).',
    standardReference: 'Indikator Ripeness Sensorik Buah Kopi',
    thresholdOrStandard: 'Getah Kental Manis Alami Beraroma Segar',
    defaultMeasuredValue: 'Getah Mucilage Sangat Lengket & Kental',
    isMandatory: false,
  },
  {
    id: 'ics-hrv-f2-03',
    category: 'harvest',
    factorId: 'hrv_f2_brix',
    factorNumber: 'FAKTOR II',
    factorName: 'Uji Laboratorium Kemanisan Brix Refraktometer',
    factorDescription: 'Pengukuran kadar gula getah ceri menggunakan refraktometer optik/digital untuk jaminan rasa manis.',
    code: 'ICS-PNN-F2-03',
    question: 'Kalibrasi Alat Refraktometer dengan Air Destilasi',
    description: 'Refraktometer telah dikalibrasi titik nol (0.0° Bx) dengan air murni sebelum pengambilan data sampel lot.',
    standardReference: 'Protokol Metrologi Alat Uji Laboratorium Lapangan',
    thresholdOrStandard: 'Kalibrasi Zero Point (0.0° Bx) Terverifikasi',
    defaultMeasuredValue: 'Refraktometer Terkalibrasi Presisi',
    isMandatory: false,
  },

  {
    id: 'ics-hrv-f3-01',
    category: 'harvest',
    factorId: 'hrv_f3_cacat',
    factorNumber: 'FAKTOR III',
    factorName: 'Ambang Cacat Fisik & Bebas Hama PBKo',
    factorDescription: 'Inspeksi toleransi serangan penggerek buah kopi (Hypothenemus hampei), buah berjamur, dan cacat fisik.',
    code: 'ICS-PNN-F3-01',
    question: 'Bebas Hama Penggerek Buah Kopi (PBKo < 2%)',
    description: 'Jumlah buah berlubang hitam akibat hama PBKo tidak melebihi 2% dari total bobot sampel acak karung.',
    standardReference: 'Karantina Tumbuhan & Standar Defect Hulu Koperasi',
    thresholdOrStandard: 'Serangan PBKo Maksimal < 2% per Lot',
    defaultMeasuredValue: 'Tingkat Serangan PBKo: 0.5% (Aman)',
    isMandatory: true,
  },
  {
    id: 'ics-hrv-f3-02',
    category: 'harvest',
    factorId: 'hrv_f3_cacat',
    factorNumber: 'FAKTOR III',
    factorName: 'Ambang Cacat Fisik & Bebas Hama PBKo',
    factorDescription: 'Inspeksi toleransi serangan penggerek buah kopi (Hypothenemus hampei), buah berjamur, dan cacat fisik.',
    code: 'ICS-PNN-F3-02',
    question: 'Toleransi Buah Busuk Air / Berjamur (< 1%)',
    description: 'Tidak terdapat buah busuk air, berjamur putih/hitam, atau berbau asam akibat keterlambatan pascapanen.',
    standardReference: 'Standar Kebersihan Bahan Baku Ceri Koperasi',
    thresholdOrStandard: 'Buah Busuk / Berjamur Maksimal < 1%',
    defaultMeasuredValue: 'Nol (0%) Buah Berjamur Terdeteksi',
    isMandatory: true,
  },
  {
    id: 'ics-hrv-f3-03',
    category: 'harvest',
    factorId: 'hrv_f3_cacat',
    factorNumber: 'FAKTOR III',
    factorName: 'Ambang Cacat Fisik & Bebas Hama PBKo',
    factorDescription: 'Inspeksi toleransi serangan penggerek buah kopi (Hypothenemus hampei), buah berjamur, dan cacat fisik.',
    code: 'ICS-PNN-F3-03',
    question: 'Bebas Kontaminasi Kotoran Fisik (Batu, Tanah, Ranting)',
    description: 'Lot ceri bersih dari kontaminasi tanah basah, kerikil, daun kering, dan serpihan ranting pohon.',
    standardReference: 'Higienitas Pengolahan Basah Wet Mill',
    thresholdOrStandard: 'Bebas Benda Asing / Kotoran Anorganik',
    defaultMeasuredValue: 'Ceri Bersih Bebas Kerikil / Ranting',
    isMandatory: false,
  },

  {
    id: 'ics-hrv-f4-01',
    category: 'harvest',
    factorId: 'hrv_f4_logistik',
    factorNumber: 'FAKTOR IV',
    factorName: 'Higienitas Wadah & Waktu Logistik Wet Mill',
    factorDescription: 'Pemeriksaan kebersihan wadah angkut, akurasi timbangan tera, dan kecepatan serah terima buah ceri.',
    code: 'ICS-PNN-F4-01',
    question: 'Kebersihan Wadah Penampung & Karung Panen',
    description: 'Karung goni / keranjang panen bersih, berventilasi udara baik, dan bebas bau minyak/pestisida.',
    standardReference: 'SOP Higienitas Penanganan Pascapanen',
    thresholdOrStandard: 'Wadah Bersih Bebas Kontaminasi Bahan Kimia',
    defaultMeasuredValue: 'Karung Goni Baru / Keranjang Plastik Bersih',
    isMandatory: false,
  },
  {
    id: 'ics-hrv-f4-02',
    category: 'harvest',
    factorId: 'hrv_f4_logistik',
    factorNumber: 'FAKTOR IV',
    factorName: 'Higienitas Wadah & Waktu Logistik Wet Mill',
    factorDescription: 'Pemeriksaan kebersihan wadah angkut, akurasi timbangan tera, dan kecepatan serah terima buah ceri.',
    code: 'ICS-PNN-F4-02',
    question: 'Jeda Waktu Petik ke Pengolahan (< 12 Jam)',
    description: 'Buah ceri segera dikirim ke stasiun pengolahan basah (wet mill) maksimal 12 jam untuk mencegah fermentasi liar.',
    standardReference: 'Protokol Pengendalian Fermentasi Ceri Segar',
    thresholdOrStandard: 'Waktu Pengiriman < 12 Jam Pasca Petik',
    defaultMeasuredValue: 'Diserahkan ke Wet Mill 3.5 Jam Pasca Petik',
    isMandatory: true,
  },
  {
    id: 'ics-hrv-f4-03',
    category: 'harvest',
    factorId: 'hrv_f4_logistik',
    factorNumber: 'FAKTOR IV',
    factorName: 'Higienitas Wadah & Waktu Logistik Wet Mill',
    factorDescription: 'Pemeriksaan kebersihan wadah angkut, akurasi timbangan tera, dan kecepatan serah terima buah ceri.',
    code: 'ICS-PNN-F4-03',
    question: 'Akurasi Timbangan Netto Sesuai Kalibrasi Tera',
    description: 'Timbangan digital atau jarum yang digunakan telah dikalibrasi berkala dengan segel tera resmi kelompok tani.',
    standardReference: 'Metrologi Legal & Akuntabilitas Timbangan Koperasi',
    thresholdOrStandard: 'Timbangan Terkalibrasi Presisi (Segel Tera Aktif)',
    defaultMeasuredValue: 'Timbangan Digital Ditera Ulang 2026',
    isMandatory: false,
  },
];

export const IcsAuditSheetPage: React.FC = () => {
  const navigate = useNavigate();
  const { targetType: routeTargetType, targetId: routeTargetId } = useParams<{
    targetType?: string;
    targetId?: string;
  }>();
  const [searchParams, setSearchParams] = useSearchParams();

  const {
    users,
    coffeeFarms,
    farmerLots,
    currentUser,
    submitIcsAuditReport,
  } = useCoffee();

  // Active target type: 'farmer' | 'farm' | 'harvest'
  const [targetType, setTargetType] = useState<'farmer' | 'farm' | 'harvest'>(() => {
    const fromParam = routeTargetType || searchParams.get('type');
    if (fromParam === 'farmer' || fromParam === 'farm' || fromParam === 'harvest') {
      return fromParam;
    }
    return 'farmer';
  });

  // Selected target ID
  const [targetId, setTargetId] = useState<string>(() => {
    return routeTargetId || searchParams.get('id') || '';
  });

  // Active factor filter inside Section 2 ('all' or factorId)
  const [selectedFactorFilter, setSelectedFactorFilter] = useState<string>('all');

  // Synchronize URL and states
  useEffect(() => {
    const urlType = routeTargetType || searchParams.get('type');
    const urlId = routeTargetId || searchParams.get('id');
    if (urlType === 'farmer' || urlType === 'farm' || urlType === 'harvest') {
      setTargetType(urlType);
    }
    if (urlId) {
      setTargetId(urlId);
    }
  }, [routeTargetType, routeTargetId, searchParams]);

  // Farmers list
  const farmersList = useMemo(
    () => users.filter((u) => u.role === 'petani' || u.assignedService === 'petani'),
    [users]
  );

  // Set default target ID if none selected
  useEffect(() => {
    if (!targetId) {
      if (targetType === 'farmer' && farmersList.length > 0) {
        setTargetId(farmersList[0].id);
      } else if (targetType === 'farm' && coffeeFarms.length > 0) {
        setTargetId(coffeeFarms[0].id);
      } else if (targetType === 'harvest' && farmerLots.length > 0) {
        setTargetId(farmerLots[0].id);
      }
    }
  }, [targetType, targetId, farmersList, coffeeFarms, farmerLots]);

  // Current object being audited
  const selectedFarmer = useMemo(
    () => (targetType === 'farmer' ? farmersList.find((f) => f.id === targetId) : null),
    [targetType, targetId, farmersList]
  );
  const selectedFarm = useMemo(
    () => (targetType === 'farm' ? coffeeFarms.find((f) => f.id === targetId) : null),
    [targetType, targetId, coffeeFarms]
  );
  const selectedLot = useMemo(
    () => (targetType === 'harvest' ? farmerLots.find((l) => l.id === targetId) : null),
    [targetType, targetId, farmerLots]
  );

  // Associated farms & harvest lots of selected farmer
  const farmerAssociatedFarms = useMemo(() => {
    if (!selectedFarmer) return [];
    return coffeeFarms.filter((f) => f.farmerId === selectedFarmer.id);
  }, [selectedFarmer, coffeeFarms]);

  const farmerAssociatedLots = useMemo(() => {
    if (!selectedFarmer) return [];
    return farmerLots.filter(
      (l) => l.farmerId === selectedFarmer.id || l.farmerName === selectedFarmer.name
    );
  }, [selectedFarmer, farmerLots]);

  // Active Checklists for current category
  const activeChecklist = useMemo(
    () => ICS_MASTER_CHECKLISTS.filter((item) => item.category === targetType),
    [targetType]
  );

  // Distinct Factors in current checklist
  const distinctFactors = useMemo(() => {
    const map = new Map<string, { factorId: string; factorNumber: string; factorName: string; factorDescription: string }>();
    activeChecklist.forEach((item) => {
      if (!map.has(item.factorId)) {
        map.set(item.factorId, {
          factorId: item.factorId,
          factorNumber: item.factorNumber,
          factorName: item.factorName,
          factorDescription: item.factorDescription || '',
        });
      }
    });
    return Array.from(map.values());
  }, [activeChecklist]);

  // Checklist responses state: Record<itemId, 'pass' | 'fail' | 'na'>
  const [responses, setResponses] = useState<Record<string, 'pass' | 'fail' | 'na'>>({});
  const [notes, setNotes] = useState<Record<string, string>>({});
  const [fieldValues, setFieldValues] = useState<Record<string, string>>({});

  // Reset or initialize responses when category/target changes
  useEffect(() => {
    const initialResponses: Record<string, 'pass' | 'fail' | 'na'> = {};
    const initialNotes: Record<string, string> = {};
    const initialFieldValues: Record<string, string> = {};

    activeChecklist.forEach((item) => {
      initialResponses[item.id] = 'pass';
      initialNotes[item.id] = '';
      initialFieldValues[item.id] = item.defaultMeasuredValue || item.thresholdOrStandard || 'Sesuai Standar';
    });

    setResponses(initialResponses);
    setNotes(initialNotes);
    setFieldValues(initialFieldValues);
    setSelectedFactorFilter('all');
  }, [targetType, targetId]);

  // Overall notes and verdict
  const [auditorGeneralNotes, setAuditorGeneralNotes] = useState(
    'Telah dilakukan audit dan pemeriksaan komprehensif seluruh faktor kepatuhan lapangan oleh Petugas Internal Control System (ICS).'
  );
  const [remedialActions, setRemedialActions] = useState('');
  const [manualVerdict, setManualVerdict] = useState<'approved' | 'conditional' | 'rejected'>('approved');
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(false);
  const [lastSubmittedReport, setLastSubmittedReport] = useState<IcsAuditReport | null>(null);

  // Real-time calculations
  const totalItems = activeChecklist.length;
  const passCount = activeChecklist.filter((item) => responses[item.id] === 'pass').length;
  const failCount = activeChecklist.filter((item) => responses[item.id] === 'fail').length;
  const naCount = activeChecklist.filter((item) => responses[item.id] === 'na').length;

  const evaluatedItemsCount = totalItems - naCount;
  const complianceScorePercent =
    evaluatedItemsCount > 0 ? Math.round((passCount / evaluatedItemsCount) * 100) : 100;

  // Mandatory items check
  const mandatoryFailedCount = activeChecklist.filter(
    (item) => item.isMandatory && responses[item.id] === 'fail'
  ).length;

  // Factor breakdown stats
  const factorStats = useMemo(() => {
    return distinctFactors.map((factor) => {
      const itemsInFactor = activeChecklist.filter((item) => item.factorId === factor.factorId);
      const passedInFactor = itemsInFactor.filter((item) => responses[item.id] === 'pass').length;
      const failedInFactor = itemsInFactor.filter((item) => responses[item.id] === 'fail').length;
      const naInFactor = itemsInFactor.filter((item) => responses[item.id] === 'na').length;
      const mandatoryFailInFactor = itemsInFactor.filter((item) => item.isMandatory && responses[item.id] === 'fail').length;

      const evalCount = itemsInFactor.length - naInFactor;
      const score = evalCount > 0 ? Math.round((passedInFactor / evalCount) * 100) : 100;

      return {
        ...factor,
        itemsCount: itemsInFactor.length,
        passedCount: passedInFactor,
        failedCount: failedInFactor,
        naCount: naInFactor,
        mandatoryFailCount: mandatoryFailInFactor,
        score,
        isPassed: mandatoryFailInFactor === 0 && score >= 75,
      };
    });
  }, [distinctFactors, activeChecklist, responses]);

  // Recommended verdict
  const recommendedVerdict: 'approved' | 'conditional' | 'rejected' = useMemo(() => {
    if (mandatoryFailedCount > 0) return 'rejected';
    if (complianceScorePercent >= 90) return 'approved';
    if (complianceScorePercent >= 75) return 'conditional';
    return 'rejected';
  }, [mandatoryFailedCount, complianceScorePercent]);

  // Keep manual verdict aligned with recommendation initially
  useEffect(() => {
    setManualVerdict(recommendedVerdict);
  }, [recommendedVerdict]);

  // Target Title representation
  const targetTitle = useMemo(() => {
    if (targetType === 'farmer' && selectedFarmer) {
      return `Petani: ${selectedFarmer.name} (${selectedFarmer.nik || 'NIK N/A'})`;
    }
    if (targetType === 'farm' && selectedFarm) {
      return `Lahan Kebun: ${selectedFarm.farmName} (${selectedFarm.farmerName})`;
    }
    if (targetType === 'harvest' && selectedLot) {
      return `Panen Ceri Lot: ${selectedLot.id} (${selectedLot.farmerName})`;
    }
    return `Objek Audit ${targetType.toUpperCase()}`;
  }, [targetType, selectedFarmer, selectedFarm, selectedLot]);

  // Handle switching target type
  const handleSwitchTargetType = (newType: 'farmer' | 'farm' | 'harvest') => {
    setTargetType(newType);
    let newId = '';
    if (newType === 'farmer' && farmersList.length > 0) {
      newId = farmersList[0].id;
    } else if (newType === 'farm' && coffeeFarms.length > 0) {
      newId = coffeeFarms[0].id;
    } else if (newType === 'harvest' && farmerLots.length > 0) {
      newId = farmerLots[0].id;
    }
    setTargetId(newId);
    setSearchParams({ type: newType, id: newId });
  };

  // Handle saving the audit worksheet
  const handleSubmitAudit = (e: React.FormEvent) => {
    e.preventDefault();

    const report = submitIcsAuditReport({
      auditDate: new Date().toISOString().split('T')[0],
      auditorId: currentUser?.id || 'usr-ict-1',
      auditorName: currentUser?.name || 'Petugas ICS',
      targetType,
      targetId,
      targetTitle,
      checklistResponses: responses,
      checklistNotes: notes,
      checklistValues: fieldValues,
      totalPassed: passCount,
      totalFailed: failCount,
      totalMandatoryFailed: mandatoryFailedCount,
      complianceScorePercent,
      verdict: manualVerdict,
      auditorNotes: auditorGeneralNotes,
      remedialActions: manualVerdict === 'conditional' ? remedialActions : undefined,
    });

    setLastSubmittedReport(report);
    setIsSubmittedSuccess(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="space-y-6 max-w-6xl mx-auto pb-16 print:max-w-none print:p-0">
      {/* 1. Top Navigation Bar (Back + Print + Breadcrumb) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white p-4 rounded-lg border border-[#d2d6de] shadow-xs print:hidden">
        <div className="flex items-center gap-3">
          <Link
            to="/admin/ict"
            className="p-2 rounded-md hover:bg-stone-100 text-stone-600 transition-colors flex items-center gap-1.5 text-xs font-bold"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Kembali ke Pusat Verifikasi</span>
          </Link>
          <div className="h-4 w-px bg-stone-300 hidden sm:block" />
          <span className="text-xs font-mono font-bold text-blue-700 bg-blue-50 px-2.5 py-1 rounded border border-blue-200">
            FRM-ICS-KOPTAN-2026/REV-03
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handlePrint}
            className="px-3.5 py-2 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-bold flex items-center gap-2 transition-all cursor-pointer border border-stone-300"
          >
            <Printer className="w-4 h-4" />
            <span>Cetak Lembar Kerja (Print)</span>
          </button>
          <Link
            to="/admin/ict"
            className="px-3.5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center gap-2 transition-all shadow-xs"
          >
            <ShieldCheck className="w-4 h-4" />
            <span>Lihat Antrean Audit</span>
          </Link>
        </div>
      </div>

      {/* 2. Official Document Header Card (AdminLTE Box Style) */}
      <div className="bg-white rounded-lg border-2 border-stone-800 shadow-sm p-6 space-y-6">
        {/* Document Header Table */}
        <div className="border-b-2 border-stone-800 pb-5">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-lg bg-stone-900 text-amber-400 flex items-center justify-center font-black text-xl shrink-0">
                <Building2 className="w-8 h-8" />
              </div>
              <div>
                <div className="text-[11px] font-black uppercase tracking-wider text-amber-800">
                  Gapoktan Kopi Mandiri Nusantara • Unit Penjaminan Mutu &amp; Sertifikasi
                </div>
                <h1 className="text-lg sm:text-xl font-black text-stone-900 tracking-tight leading-tight">
                  LEMBAR KERJA INSPEKSI &amp; AUDIT INTERNAL (ICS)
                </h1>
                <p className="text-xs text-stone-600 mt-0.5">
                  Internal Control System • EUDR Deforestation-Free • SNI Organik 6729 • Penilaian Multi-Faktor Hulu
                </p>
              </div>
            </div>

            <div className="border border-stone-300 rounded p-3 text-right bg-stone-50 shrink-0 text-xs font-mono">
              <div>No. Dokumen: <strong>FRM-ICS-KOPTAN-2026</strong></div>
              <div>Tgl. Efektif: <strong>14 November 2026</strong></div>
              <div>Revisi: <strong>03 (Multi-Faktor Terpadu)</strong></div>
            </div>
          </div>
        </div>

        {/* Success Alert if Submitted */}
        {isSubmittedSuccess && lastSubmittedReport && (
          <div className="p-4 rounded-lg bg-emerald-50 border-2 border-emerald-400 text-emerald-950 flex items-start justify-between gap-3 print:hidden">
            <div className="flex items-start gap-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div>
                <div className="font-bold text-sm">
                  Lembar Kerja Audit Berhasil Disahkan &amp; Tersimpan!
                </div>
                <p className="text-xs text-emerald-800 mt-1">
                  Nomor Laporan: <strong className="font-mono">{lastSubmittedReport.reportNumber}</strong> • Skor Kepatuhan: <strong>{lastSubmittedReport.complianceScorePercent}%</strong> ({lastSubmittedReport.verdict.toUpperCase()})
                </p>
                {lastSubmittedReport.stampId && (
                  <p className="text-[11px] text-emerald-700 font-mono mt-1">
                    Stempel Digital Kriptografis Diterbitkan: <strong>{lastSubmittedReport.stampId}</strong>
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={() => setIsSubmittedSuccess(false)}
              className="text-stone-400 hover:text-stone-600 text-xs font-bold"
            >
              ✕
            </button>
          </div>
        )}

        {/* 3. SECTION 1: INFORMASI OBJEK AUDIT & SCOPE EVALUASI */}
        <div className="bg-stone-50/70 p-4 rounded-lg border border-stone-300 space-y-4">
          <div className="flex items-center justify-between border-b border-stone-200 pb-2">
            <h2 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-2">
              <FileText className="w-4 h-4 text-blue-700" />
              <span>1. Informasi Objek Audit &amp; Cakupan Evaluasi Faktor</span>
            </h2>
            <span className="text-xs text-stone-500 font-mono">
              Auditor: <strong>{currentUser?.name || 'Petugas ICS'}</strong>
            </span>
          </div>

          {/* 3 Audit Scope Cards (Clarifying that 1 target has multiple factors) */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 print:hidden">
            <button
              type="button"
              onClick={() => handleSwitchTargetType('farmer')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                targetType === 'farmer'
                  ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-white border-stone-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  targetType === 'farmer' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <Users className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">
                    A. Audit Profil &amp; Tata Kelola Petani
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-black bg-blue-100 text-blue-800 mt-0.5">
                    5 Faktor Evaluasi Terpadu
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                Legalitas KTP/NIK, KTA, Hak Lahan, EUDR, Buruh Tani, GAP, dan Disiplin Panen.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTargetType('farm')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                targetType === 'farm'
                  ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-white border-stone-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  targetType === 'farm' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <TreePine className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">
                    B. Audit Spasial Lahan &amp; EUDR
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-black bg-emerald-100 text-emerald-800 mt-0.5">
                    4 Faktor Evaluasi Lahan
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                Koordinat GPS actual, patok sudut BPN, bebas deforestasi 2020, dan naungan.
              </p>
            </button>

            <button
              type="button"
              onClick={() => handleSwitchTargetType('harvest')}
              className={`p-3.5 rounded-lg border text-left transition-all cursor-pointer ${
                targetType === 'harvest'
                  ? 'bg-blue-50/90 border-blue-500 shadow-xs ring-2 ring-blue-500/20'
                  : 'bg-white border-stone-200 hover:border-blue-300'
              }`}
            >
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                  targetType === 'harvest' ? 'bg-blue-600 text-white' : 'bg-stone-100 text-stone-600'
                }`}>
                  <Sprout className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-bold text-xs text-stone-900">
                    C. Audit Kualitas &amp; Uji Brix Panen
                  </div>
                  <span className="inline-block px-1.5 py-0.2 rounded text-[10px] font-black bg-amber-100 text-amber-800 mt-0.5">
                    4 Faktor Evaluasi Mutu
                  </span>
                </div>
              </div>
              <p className="text-[11px] text-stone-500 mt-2 leading-relaxed">
                Sortasi petik merah 95%+, uji refraktometer brix, toleransi cacat PBKo &lt;2%.
              </p>
            </button>
          </div>

          {/* Target Specific Picker Dropdown */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Pilih 1 Target Data yang Diinspeksi *
              </label>
              {targetType === 'farmer' && (
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {farmersList.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.name} — NIK: {f.nik || 'Belum terisi'} ({f.village || f.location})
                    </option>
                  ))}
                </select>
              )}

              {targetType === 'farm' && (
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {coffeeFarms.map((farm) => (
                    <option key={farm.id} value={farm.id}>
                      {farm.farmName} — Petani: {farm.farmerName} ({farm.landAreaHectares} Ha)
                    </option>
                  ))}
                </select>
              )}

              {targetType === 'harvest' && (
                <select
                  value={targetId}
                  onChange={(e) => setTargetId(e.target.value)}
                  className="w-full bg-white border border-stone-300 rounded-md px-3 py-2 text-xs font-medium text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                >
                  {farmerLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      Lot {lot.id} — {lot.farmerName} ({lot.totalWeightKg} kg, {lot.brix || 21.5}° Bx)
                    </option>
                  ))}
                </select>
              )}
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-mono">
              <div className="p-2.5 rounded bg-white border border-stone-200">
                <div className="text-[10px] text-stone-500 uppercase">Tanggal Audit Lapangan:</div>
                <div className="font-bold text-stone-800 mt-0.5">
                  {new Date().toLocaleDateString('id-ID', {
                    day: 'numeric',
                    month: 'long',
                    year: 'numeric',
                  })}
                </div>
              </div>

              <div className="p-2.5 rounded bg-white border border-stone-200">
                <div className="text-[10px] text-stone-500 uppercase">Petugas Verifikator ICS:</div>
                <div className="font-bold text-stone-800 mt-0.5 truncate">
                  {currentUser?.name || 'Fajar Pratama, S.Kom.'}
                </div>
              </div>
            </div>
          </div>

          {/* Detailed Preview Card of Selected Target (Connecting Farmer to their Farms & Harvests) */}
          {targetType === 'farmer' && selectedFarmer && (
            <div className="p-4 bg-white rounded-lg border border-blue-200 space-y-3">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs border-b border-stone-100 pb-3">
                <div className="flex items-center gap-3">
                  <img
                    src={selectedFarmer.avatar}
                    alt={selectedFarmer.name}
                    className="w-12 h-12 rounded-full object-cover border border-stone-300 shrink-0"
                  />
                  <div>
                    <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                      <span>{selectedFarmer.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-semibold">
                        {selectedFarmer.status === 'inactive' ? 'Nonaktif' : 'Anggota Aktif'}
                      </span>
                    </div>
                    <div className="text-stone-600 mt-0.5 font-mono text-[11px]">
                      NIK: {selectedFarmer.nik || 'Belum Terdata'} • KTA: {selectedFarmer.farmerCardNumber || 'KTA-BELUM-ADA'}
                    </div>
                    <div className="text-stone-500 text-[11px]">
                      Domisili: {selectedFarmer.village ? `Desa ${selectedFarmer.village}` : selectedFarmer.location}
                    </div>
                  </div>
                </div>

                <div className="text-right text-[11px] text-stone-600 shrink-0">
                  <div>Total Garapan: <strong>{selectedFarmer.totalLandAreaHa || 1.5} Ha</strong></div>
                  <div>Buruh Pemetik Binaan: <strong>{selectedFarmer.farmWorkerCount || 3} Orang</strong></div>
                </div>
              </div>

              {/* Cross-entity info: Farms & Harvest Lots under this farmer */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-[11px]">
                <div className="p-2.5 bg-emerald-50/50 rounded border border-emerald-200">
                  <div className="font-bold text-emerald-900 flex items-center gap-1.5 mb-1">
                    <TreePine className="w-3.5 h-3.5 text-emerald-700" />
                    <span>Lahan Kebun Terdaftar ({farmerAssociatedFarms.length} Bidang)</span>
                  </div>
                  {farmerAssociatedFarms.length > 0 ? (
                    <div className="space-y-1 text-emerald-800 font-mono text-[10px]">
                      {farmerAssociatedFarms.map((f) => (
                        <div key={f.id} className="flex justify-between">
                          <span>• {f.farmName} ({f.landAreaHectares} Ha)</span>
                          <span>{f.eudrCompliant ? '✓ EUDR' : '⚠️ Perlu Audit'}</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-stone-500 italic">Belum ada data bidang kebun terdaftar.</div>
                  )}
                </div>

                <div className="p-2.5 bg-amber-50/50 rounded border border-amber-200">
                  <div className="font-bold text-amber-900 flex items-center gap-1.5 mb-1">
                    <Sprout className="w-3.5 h-3.5 text-amber-700" />
                    <span>Riwayat Lot Panen ({farmerAssociatedLots.length} Lot)</span>
                  </div>
                  {farmerAssociatedLots.length > 0 ? (
                    <div className="space-y-1 text-amber-800 font-mono text-[10px]">
                      {farmerAssociatedLots.slice(0, 2).map((l) => (
                        <div key={l.id} className="flex justify-between">
                          <span>• Lot {l.id} ({l.totalWeightKg} kg)</span>
                          <span>Brix: {l.brix || 21.0}° Bx</span>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-stone-500 italic">Belum ada lot panen tercatat di sistem.</div>
                  )}
                </div>
              </div>
            </div>
          )}

          {targetType === 'farm' && selectedFarm && (
            <div className="p-3 bg-white rounded-lg border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <TreePine className="w-4 h-4 text-emerald-600" />
                  <span>{selectedFarm.farmName}</span>
                </div>
                <div className="text-stone-600 mt-0.5 text-[11px]">
                  Petani Penggarap: <strong>{selectedFarm.farmerName}</strong> • {selectedFarm.location}
                </div>
                <div className="text-stone-500 font-mono text-[11px] mt-0.5">
                  GPS: {selectedFarm.coordinates?.latitude || -7.1524}, {selectedFarm.coordinates?.longitude || 107.5932} • Elevasi: {selectedFarm.altitudeDisplay || `${selectedFarm.altitudeMeters} mdpl`}
                </div>
              </div>

              <div className="text-right text-[11px] text-stone-600 shrink-0">
                <div>Patok Tapal Batas: <strong>{selectedFarm.patokList?.length || 4} Titik BPN</strong></div>
                <div>Status EUDR: <strong className={selectedFarm.eudrCompliant ? 'text-emerald-700' : 'text-amber-700'}>
                  {selectedFarm.eudrCompliant ? 'Deforestation-Free Verified' : 'Perlu Audit'}
                </strong></div>
              </div>
            </div>
          )}

          {targetType === 'harvest' && selectedLot && (
            <div className="p-3 bg-white rounded-lg border border-blue-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
              <div>
                <div className="font-bold text-stone-900 text-sm flex items-center gap-1.5">
                  <Sprout className="w-4 h-4 text-amber-600" />
                  <span>Nomor Lot: {selectedLot.id}</span>
                </div>
                <div className="text-stone-600 mt-0.5 text-[11px]">
                  Petani: <strong>{selectedLot.farmerName}</strong> • Asal Kebun: {selectedLot.farmName || selectedLot.farmLocation}
                </div>
                <div className="text-stone-500 text-[11px] mt-0.5">
                  Varietas: <strong>{selectedLot.variety}</strong> • Tanggal Petik: {selectedLot.harvestDate}
                </div>
              </div>

              <div className="text-right text-[11px] text-stone-600 shrink-0">
                <div>Bobot Netto: <strong className="text-stone-900 text-xs font-mono">{selectedLot.totalWeightKg.toLocaleString()} kg</strong></div>
                <div>Uji Brix Kemanisan: <strong className="text-amber-800 text-xs font-mono">{selectedLot.brix || 21.5}° Bx</strong></div>
              </div>
            </div>
          )}
        </div>

        {/* 4. SECTION 2: LEMBAR KERJA MULTI-FAKTOR AUDIT LAPANGAN */}
        <form onSubmit={handleSubmitAudit} className="space-y-6">
          {/* Section Header */}
          <div className="border border-stone-300 rounded-lg overflow-hidden bg-white shadow-xs">
            <div className="bg-stone-900 text-white p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <div className="font-black text-sm uppercase tracking-wider flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-amber-400" />
                  <span>
                    2. Butir Periksa Multi-Faktor Kepatuhan Standar ICS
                  </span>
                </div>
                <p className="text-xs text-stone-300 mt-0.5">
                  Untuk 1 data {targetType === 'farmer' ? 'Petani' : targetType === 'farm' ? 'Lahan Kebun' : 'Lot Panen'}, periksa seluruh faktor standar penjaminan mutu di bawah ini.
                </p>
              </div>

              <div className="flex items-center gap-2 shrink-0">
                <span className="px-3 py-1 rounded bg-stone-800 border border-stone-700 text-xs font-mono font-bold text-amber-400">
                  {distinctFactors.length} Faktor Audit • {totalItems} Butir Teruji
                </span>
              </div>
            </div>

            {/* Quick Faktor Navigation & Scorecard Bar */}
            <div className="p-3 bg-stone-100/80 border-b border-stone-200">
              <div className="text-[11px] font-bold text-stone-700 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-blue-600" />
                <span>Matriks Kepatuhan Faktor Lapangan:</span>
              </div>

              {/* Factors pill grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                {factorStats.map((factor) => (
                  <button
                    key={factor.factorId}
                    type="button"
                    onClick={() =>
                      setSelectedFactorFilter(selectedFactorFilter === factor.factorId ? 'all' : factor.factorId)
                    }
                    className={`p-2 rounded border text-left transition-all cursor-pointer ${
                      selectedFactorFilter === factor.factorId
                        ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                        : factor.score >= 85
                        ? 'bg-white text-stone-800 border-emerald-300 hover:border-emerald-400'
                        : factor.score >= 70
                        ? 'bg-white text-stone-800 border-amber-300 hover:border-amber-400'
                        : 'bg-white text-stone-800 border-red-300 hover:border-red-400'
                    }`}
                  >
                    <div className="text-[10px] font-mono font-black opacity-80">
                      {factor.factorNumber}
                    </div>
                    <div className="text-[11px] font-bold truncate mt-0.5">
                      {factor.factorName.replace(/^Aspek /, '').replace(/^Faktor \w+: /, '')}
                    </div>
                    <div className="flex items-center justify-between mt-1 text-[10px] font-mono">
                      <span>{factor.passedCount}/{factor.itemsCount} Butir</span>
                      <span className={`font-black ${
                        selectedFactorFilter === factor.factorId
                          ? 'text-white'
                          : factor.score >= 85
                          ? 'text-emerald-700'
                          : factor.score >= 70
                          ? 'text-amber-700'
                          : 'text-red-700'
                      }`}>
                        {factor.score}%
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Checklist rendering grouped by FACTOR CARDS */}
            <div className="p-4 space-y-6">
              {distinctFactors
                .filter((f) => selectedFactorFilter === 'all' || selectedFactorFilter === f.factorId)
                .map((factor) => {
                  const factorItems = activeChecklist.filter((item) => item.factorId === factor.factorId);
                  const stat = factorStats.find((s) => s.factorId === factor.factorId);

                  return (
                    <div
                      key={factor.factorId}
                      className="rounded-lg border-2 border-stone-300 overflow-hidden shadow-xs bg-white"
                    >
                      {/* Factor Header */}
                      <div className="bg-stone-100 p-3.5 border-b border-stone-300 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                        <div className="flex items-start gap-2.5">
                          <span className="px-2 py-0.5 rounded text-[11px] font-black uppercase bg-stone-900 text-amber-400 font-mono shrink-0 mt-0.5">
                            {factor.factorNumber}
                          </span>
                          <div>
                            <h3 className="font-black text-xs text-stone-900 uppercase tracking-tight">
                              {factor.factorName}
                            </h3>
                            <p className="text-[11px] text-stone-600 mt-0.5">
                              {factor.factorDescription}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto font-mono text-xs">
                          <span className={`px-2.5 py-1 rounded-full text-[11px] font-black border ${
                            (stat?.score || 0) >= 85
                              ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                              : (stat?.score || 0) >= 70
                              ? 'bg-amber-100 text-amber-900 border-amber-300'
                              : 'bg-red-100 text-red-900 border-red-300'
                          }`}>
                            Skor: {stat?.passedCount}/{stat?.itemsCount} Memenuhi ({stat?.score}%)
                          </span>
                        </div>
                      </div>

                      {/* Factor Checklist Items */}
                      <div className="divide-y divide-stone-200">
                        {factorItems.map((item) => {
                          const currentStatus = responses[item.id] || 'pass';
                          const currentNote = notes[item.id] || '';
                          const currentValue = fieldValues[item.id] || item.defaultMeasuredValue || '';

                          return (
                            <div
                              key={item.id}
                              className={`p-4 transition-colors ${
                                currentStatus === 'fail'
                                  ? 'bg-red-50/50'
                                  : currentStatus === 'pass'
                                  ? 'hover:bg-blue-50/20'
                                  : 'bg-stone-50/50'
                              }`}
                            >
                              <div className="flex flex-col lg:flex-row lg:items-start justify-between gap-4">
                                {/* Left: Code, Question, Description & Threshold Standard */}
                                <div className="flex-1 space-y-1.5">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-mono text-[11px] font-bold text-stone-600 bg-stone-100 px-1.5 py-0.5 rounded border border-stone-200">
                                      {item.code}
                                    </span>
                                    <span className="font-bold text-stone-900 text-xs">
                                      {item.question}
                                    </span>
                                    {item.isMandatory && (
                                      <span className="px-1.5 py-0.2 rounded text-[10px] font-black uppercase bg-red-100 text-red-900 border border-red-300">
                                        Wajib Lolos
                                      </span>
                                    )}
                                    <span className="text-[10px] text-stone-500 bg-stone-50 px-1.5 py-0.2 rounded border border-stone-200 font-mono">
                                      Ref: {item.standardReference}
                                    </span>
                                  </div>

                                  <p className="text-[11px] text-stone-600 leading-relaxed pl-0.5">
                                    {item.description}
                                  </p>

                                  {/* Standard Benchmark / Threshold Badge */}
                                  {item.thresholdOrStandard && (
                                    <div className="flex items-center gap-1.5 text-[11px] pt-1">
                                      <span className="text-[10px] font-bold text-stone-500 uppercase">Standar Baku:</span>
                                      <span className="px-2 py-0.5 bg-blue-50 text-blue-900 rounded font-semibold border border-blue-200 text-[10px] font-mono">
                                        {item.thresholdOrStandard}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {/* Right: Pass / Fail / NA Radio Button Picker */}
                                <div className="flex items-center gap-1.5 shrink-0 select-none">
                                  <button
                                    type="button"
                                    onClick={() => setResponses({ ...responses, [item.id]: 'pass' })}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                                      currentStatus === 'pass'
                                        ? 'bg-emerald-600 text-white border-emerald-700 shadow-xs'
                                        : 'bg-white text-stone-700 border-stone-300 hover:bg-emerald-50'
                                    }`}
                                  >
                                    <Check className="w-3.5 h-3.5" />
                                    <span>Lulus (Pass)</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setResponses({ ...responses, [item.id]: 'fail' })}
                                    className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 border ${
                                      currentStatus === 'fail'
                                        ? 'bg-red-600 text-white border-red-700 shadow-xs'
                                        : 'bg-white text-stone-700 border-stone-300 hover:bg-red-50'
                                    }`}
                                  >
                                    <X className="w-3.5 h-3.5" />
                                    <span>Gagal (Fail)</span>
                                  </button>

                                  <button
                                    type="button"
                                    onClick={() => setResponses({ ...responses, [item.id]: 'na' })}
                                    className={`px-2.5 py-1.5 rounded-md text-xs font-bold transition-all cursor-pointer flex items-center gap-1 border ${
                                      currentStatus === 'na'
                                        ? 'bg-stone-600 text-white border-stone-700 shadow-xs'
                                        : 'bg-white text-stone-500 border-stone-300 hover:bg-stone-100'
                                    }`}
                                  >
                                    <MinusCircle className="w-3.5 h-3.5" />
                                    <span>N/A</span>
                                  </button>
                                </div>
                              </div>

                              {/* Field Inputs: Nilai Aktual Lapangan & Catatan Temuan */}
                              <div className="mt-3 pt-2.5 border-t border-stone-100 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs">
                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">
                                    Hasil Ukur / Nilai Aktual Lapangan (Bukti Fisik):
                                  </label>
                                  <input
                                    type="text"
                                    value={currentValue}
                                    onChange={(e) =>
                                      setFieldValues({ ...fieldValues, [item.id]: e.target.value })
                                    }
                                    placeholder="e.g. 19.5° Bx, 4 Patok BPN, KTP 3204..."
                                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-[11px] font-mono text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>

                                <div>
                                  <label className="block text-[10px] font-bold text-stone-600 uppercase mb-0.5">
                                    Catatan Temuan Lapangan Auditor:
                                  </label>
                                  <input
                                    type="text"
                                    value={currentNote}
                                    onChange={(e) => setNotes({ ...notes, [item.id]: e.target.value })}
                                    placeholder={`Catatan verifikasi kondisi riil untuk ${item.code}...`}
                                    className="w-full px-2.5 py-1.5 bg-white border border-stone-300 rounded text-[11px] text-stone-900 focus:outline-none focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                                  />
                                </div>
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  );
                })}
            </div>
          </div>

          {/* 5. SECTION 3: REKAPITULASI PENILAIAN & KEPUTUSAN AKHIR AUDIT ICS */}
          <div className="bg-stone-50 rounded-lg p-5 border-2 border-stone-400 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="font-bold text-xs uppercase tracking-wider text-stone-900 flex items-center gap-2">
                <Scale className="w-4 h-4 text-blue-700" />
                <span>3. Rekapitulasi Multi-Faktor &amp; Keputusan Akhir ICS</span>
              </h3>
              <div className="flex items-center gap-3 text-xs font-mono font-bold">
                <span className="text-emerald-700">Pass: {passCount}</span>
                <span className="text-red-700">Fail: {failCount}</span>
                <span className="text-stone-500">N/A: {naCount}</span>
              </div>
            </div>

            {/* Scorecard Table of All Factors */}
            <div className="bg-white rounded border border-stone-200 overflow-hidden text-xs">
              <div className="p-2.5 bg-stone-100 font-bold text-[11px] uppercase tracking-wider text-stone-700 flex justify-between">
                <span>Rincian Evaluasi Tiap Faktor</span>
                <span>Status Kepatuhan</span>
              </div>
              <div className="divide-y divide-stone-100">
                {factorStats.map((factor) => (
                  <div key={factor.factorId} className="p-2.5 flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-800">
                        {factor.factorNumber}: {factor.factorName}
                      </div>
                      <div className="text-[10px] text-stone-500 font-mono">
                        {factor.passedCount} dari {factor.itemsCount} butir memenuhi • {factor.mandatoryFailCount > 0 ? `${factor.mandatoryFailCount} butir wajib gagal` : 'Bebas pelanggaran mandatori'}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-xs">{factor.score}%</span>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                        factor.isPassed
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {factor.isPassed ? 'MEMENUHI' : 'BELUM MEMENUHI'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Total Compliance Score Gauge */}
            <div className="bg-white p-4 rounded-lg border border-stone-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div>
                <div className="text-xs text-stone-500 font-bold uppercase">
                  Skor Kepatuhan Gabungan (Total Compliance Score)
                </div>
                <div className="flex items-baseline gap-2 mt-1">
                  <span
                    className={`text-3xl font-black font-mono ${
                      complianceScorePercent >= 90
                        ? 'text-emerald-700'
                        : complianceScorePercent >= 75
                        ? 'text-amber-700'
                        : 'text-red-700'
                    }`}
                  >
                    {complianceScorePercent}%
                  </span>
                  <span className="text-xs text-stone-500">
                    ({passCount} dari {evaluatedItemsCount} butir teruji)
                  </span>
                </div>
              </div>

              {/* Mandatory Items Alert */}
              <div className="shrink-0">
                {mandatoryFailedCount > 0 ? (
                  <div className="p-3 rounded-lg bg-red-100 text-red-950 border border-red-300 text-xs flex items-center gap-2 font-bold">
                    <AlertTriangle className="w-4 h-4 text-red-700 shrink-0" />
                    <span>{mandatoryFailedCount} Butir Mandatori Gagal Dipenuhi!</span>
                  </div>
                ) : (
                  <div className="p-3 rounded-lg bg-emerald-100 text-emerald-950 border border-emerald-300 text-xs flex items-center gap-2 font-bold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
                    <span>Seluruh Butir Kritis Mandatori Lolos Verifikasi</span>
                  </div>
                )}
              </div>
            </div>

            {/* Final Verdict Selector */}
            <div>
              <label className="block text-xs font-bold text-stone-800 uppercase mb-2">
                Rekomendasi Keputusan Akhir Tim ICS *
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <label
                  className={`p-3.5 rounded-lg border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    manualVerdict === 'approved'
                      ? 'bg-emerald-50 border-emerald-600 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="verdict"
                    value="approved"
                    checked={manualVerdict === 'approved'}
                    onChange={() => setManualVerdict('approved')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-black text-xs text-emerald-900 uppercase">
                      Lulus Penuh (Approved)
                    </div>
                    <p className="text-[11px] text-emerald-800 mt-0.5 leading-tight">
                      Menerbitkan Sertifikat Stempel Verifikasi Digital Kriptografis ICS.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-lg border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    manualVerdict === 'conditional'
                      ? 'bg-amber-50 border-amber-500 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="verdict"
                    value="conditional"
                    checked={manualVerdict === 'conditional'}
                    onChange={() => setManualVerdict('conditional')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-black text-xs text-amber-900 uppercase">
                      Lulus Bersyarat (Conditional)
                    </div>
                    <p className="text-[11px] text-amber-800 mt-0.5 leading-tight">
                      Memerlukan perbaikan minor (CAPA) dalam tenggat waktu tertentu.
                    </p>
                  </div>
                </label>

                <label
                  className={`p-3.5 rounded-lg border-2 flex items-start gap-3 cursor-pointer transition-all ${
                    manualVerdict === 'rejected'
                      ? 'bg-red-50 border-red-600 shadow-xs'
                      : 'bg-white border-stone-200 hover:border-stone-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="verdict"
                    value="rejected"
                    checked={manualVerdict === 'rejected'}
                    onChange={() => setManualVerdict('rejected')}
                    className="mt-1"
                  />
                  <div>
                    <div className="font-black text-xs text-red-900 uppercase">
                      Ditolak / Afkir (Rejected)
                    </div>
                    <p className="text-[11px] text-red-800 mt-0.5 leading-tight">
                      Butir mandatori gagal dan memerlukan audit ulang lapangan.
                    </p>
                  </div>
                </label>
              </div>
            </div>

            {/* Auditor General Remarks */}
            <div>
              <label className="block text-xs font-bold text-stone-700 mb-1">
                Catatan Umum / Kesimpulan Lapangan Auditor:
              </label>
              <textarea
                value={auditorGeneralNotes}
                onChange={(e) => setAuditorGeneralNotes(e.target.value)}
                rows={2}
                className="w-full bg-white border border-stone-300 rounded-md p-2.5 text-xs text-stone-800 focus:outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500"
                placeholder="Tuliskan catatan inspeksi, kondisi cuaca, atau rekomendasi..."
              />
            </div>

            {/* Remedial Actions if Conditional */}
            {manualVerdict === 'conditional' && (
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-300">
                <label className="block text-xs font-bold text-amber-900 mb-1">
                  Rencana Tindak Perbaikan (Corrective Action Plan / CAPA):
                </label>
                <input
                  type="text"
                  value={remedialActions}
                  onChange={(e) => setRemedialActions(e.target.value)}
                  placeholder="Contoh: Petani wajib memasang 1 patok sudut tambahan dalam tempo 7 hari..."
                  className="w-full bg-white border border-amber-300 rounded-md p-2 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500"
                />
              </div>
            )}

            {/* Preview of Digital Signature Stamp */}
            <div className="p-3 bg-stone-100 rounded border border-stone-300 flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-700" />
                <span>
                  Tanda Tangan Digital SHA-256 Otomatis Diterbitkan saat Pengesahan Dokumen
                </span>
              </div>
              <span className="text-[11px] text-stone-500">Kriptografis Terverifikasi</span>
            </div>

            {/* Submit & Print Buttons */}
            <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-end gap-3 print:hidden">
              <button
                type="button"
                onClick={handlePrint}
                className="px-4 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-md text-xs font-bold flex items-center justify-center gap-2 border border-stone-300 cursor-pointer"
              >
                <Printer className="w-4 h-4" />
                <span>Cetak / Print Dokumen</span>
              </button>

              <button
                type="submit"
                className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-md text-xs font-bold flex items-center justify-center gap-2 shadow-sm transition-all cursor-pointer"
              >
                <Save className="w-4 h-4" />
                <span>Sahkan &amp; Simpan Lembar Kerja ICS</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
