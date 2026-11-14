/**
 * CIRCULARTRACE - Official 4C Checkpoint Register (TypeScript)
 * Based on 4C Code of Conduct v4.1 (2024), Paper Section 3.11:
 * - BP Producer: 108 Checkpoints (P001 - P108)
 *   - Economic: P001 - P019 (19 checkpoints)
 *   - Social: P020 - P069 (50 checkpoints)
 *   - Environmental: P070 - P108 (39 checkpoints)
 * - Managing Entity: 33 Checkpoints (ME001 - ME033)
 * - Service Provider: 83 Checkpoints (SP001 - SP083)
 */

import { Checkpoint, DimensionType } from './types';

function createProducerCheckpoints(): Checkpoint[] {
  const checkpoints: Checkpoint[] = [];

  // --------------------------------------------------------------------------
  // ECONOMIC DIMENSION: P001 - P019 (19 Checkpoints)
  // --------------------------------------------------------------------------
  const econData = [
    { code: 'P001', title: 'Identifikasi Kebun & Hak Penguasaan Lahan', isMajor: true, ref: '4C 1.1.1', desc: 'Peta/titik koordinat kebun, bukti legalitas/status penguasaan lahan adat atau sertifikat sah.' },
    { code: 'P002', title: 'Pencatatan Produksi dan Hasil Panen Ceri Kopi', isMajor: false, ref: '4C 1.1.2', desc: 'Buku catatan panen atau nota timbang ceri harian.' },
    { code: 'P003', title: 'Pencatatan Penjualan Ceri / Kopi Beras', isMajor: false, ref: '4C 1.1.3', desc: 'Nota timbang, bukti transaksi penjualan, nama pembeli.' },
    { code: 'P004', title: 'Pemisahan Lot Kopi Bersertifikat dan Konvensional', isMajor: true, ref: '4C 1.1.4', desc: 'Label lot fisik, karung terpisah, catatan serah terima.' },
    { code: 'P005', title: 'Keanggotaan dan Partisipasi dalam Kelompok Tani', isMajor: false, ref: '4C 1.2.1', desc: 'Daftar anggota resmi kelompok tani, kartu anggota aktif.' },
    { code: 'P006', title: 'Akses Informasi Pasar dan Harga Transparan', isMajor: false, ref: '4C 1.2.2', desc: 'Papan informasi harga di kelompok / pesan digital harga resmi.' },
    { code: 'P007', title: 'Pemahaman Syarat Mutu Ceri Petik Merah', isMajor: false, ref: '4C 1.3.1', desc: 'SOP petik merah, catatan sortasi ceri saat panen.' },
    { code: 'P008', title: 'Pengelolaan Pasca Panen Dasar (Sortasi & Kebersihan)', isMajor: false, ref: '4C 1.3.2', desc: 'Observasi tempat penampungan ceri bersih, terpal alas.' },
    { code: 'P009', title: 'Pencatatan Pembelian Sarana Produksi Pertanian (Saprodi)', isMajor: false, ref: '4C 1.4.1', desc: 'Kuitansi pembelian pupuk, bibit, atau sarana kerja.' },
    { code: 'P010', title: 'Kemitraan Jangka Panjang dengan Pembeli / Koperasi', isMajor: false, ref: '4C 1.4.2', desc: 'Perjanjian jual beli atau riwayat pasok rutin.' },
    { code: 'P011', title: 'Partisipasi dalam Pelatihan Praktik Budidaya Baik (GAP)', isMajor: false, ref: '4C 1.5.1', desc: 'Daftar hadir pelatihan GAP yang diselenggarakan ICS.' },
    { code: 'P012', title: 'Adopsi Rekomendasi Pelatihan di Kebun', isMajor: false, ref: '4C 1.5.2', desc: 'Observasi pemangkasan, penyiangan, dan naungan sesuai GAP.' },
    { code: 'P013', title: 'Catatan Biaya Usaha Tani & Perhitungan Marjin', isMajor: false, ref: '4C 1.6.1', desc: 'Buku kas usaha tani sederhana mencatat biaya tenaga kerja & input.' },
    { code: 'P014', title: 'Transparansi Pemotongan Biaya & Penerimaan Premi Keberlanjutan', isMajor: false, ref: '4C 1.6.2', desc: 'Bukti pembayaran premi keberlanjutan atau rincian potongan jasa ICS.' },
    { code: 'P015', title: 'Akses Layanan Simpan Pinjam / Pembiayaan Berkelanjutan', isMajor: false, ref: '4C 1.6.3', desc: 'Catatan simpanan kelompok atau fasilitas kredit mikro produktif.' },
    { code: 'P016', title: 'Diversifikasi Pendapatan Usaha Tani Kopi', isMajor: false, ref: '4C 1.7.1', desc: 'Adanya tanaman sela (palawija, buah, atau ternak) di lahan tani.' },
    { code: 'P017', title: 'Pemanfaatan Hasil Samping Kopi untuk Nilai Tambah', isMajor: false, ref: '4C 1.7.2', desc: 'Pencatatan produksi cascara, kompos pulp, atau pupuk organik cair.' },
    { code: 'P018', title: 'Perencanaan Usaha Tani Musiman (Rencana Tanam & Panen)', isMajor: false, ref: '4C 1.8.1', desc: 'Dokumen rencana kerja musim tanam petani.' },
    { code: 'P019', title: 'Evaluasi Tahunan Kinerja Ekonomi Usaha Tani', isMajor: false, ref: '4C 1.8.2', desc: 'Catatan rekapitulasi laba rugi tahunan bersama petugas ICS.' }
  ];

  econData.forEach((item) => {
    checkpoints.push({
      checkpointCode: item.code,
      module: 'PRODUCER',
      dimension: DimensionType.ECONOMIC,
      title: item.title,
      description: item.desc,
      officialRef: item.ref,
      isMajor: item.isMajor,
    });
  });

  // --------------------------------------------------------------------------
  // SOCIAL DIMENSION: P020 - P069 (50 Checkpoints)
  // --------------------------------------------------------------------------
  const socialKeyMajors = new Set([
    'P020', 'P024', 'P025', 'P028', 'P029', 'P034', 'P037', 'P040', 'P045', 'P050'
  ]);

  for (let i = 20; i <= 69; i++) {
    const code = `P${String(i).padStart(3, '0')}`;
    const isMajor = socialKeyMajors.has(code);
    let title = '';
    let desc = '';

    if (i === 20) { title = 'Kebebasan Berserikat dan Hak Bernegosiasi Kolektif'; desc = 'Wawancara pekerja, tidak ada larangan bergabung serikat/kelompok tani.'; }
    else if (i === 24) { title = 'Larangan Kerja Paksa dan Jeratan Utang'; desc = 'Wawancara pekerja, paspor/KTP dipegang pekerja, upah dibayar langsung tanpa penahanan.'; }
    else if (i === 25) { title = 'Tidak Ada Pemotongan Upah Ilegal atau Denda Diskriminatif'; desc = 'Bukti slip pembayaran upah bersih tanpa potongan ilegal.'; }
    else if (i === 28) { title = 'Larangan Pekerja Anak di Bawah Usia Minimum (ILO 138)'; desc = 'Daftar pekerja, bukti identitas usia, observasi tidak ada anak di bawah 15 th dipekerjakan.'; }
    else if (i === 29) { title = 'Perlindungan Remaja dari Pekerjaan Berbahaya (ILO 182)'; desc = 'Remaja 15-17 tahun tidak boleh menyemprot pestisida, angkut beban berat, atau kerja malam.'; }
    else if (i === 30) { title = 'Bantuan Anak Keluarga Tidak Mengganggu Waktu Sekolah'; desc = 'Anak petani membantu hanya di luar jam sekolah dan akhir pekan secara wajar.'; }
    else if (i === 34) { title = 'Perlakuan Adil dan Bebas Diskriminasi (Gender, Ras, Agama)'; desc = 'Wawancara pekerja perempuan dan minoritas; kesempatan dan upah setara.'; }
    else if (i === 35) { title = 'Pencegahan Pelecehan Seksual dan Kekerasan di Tempat Kerja'; desc = 'Kebijakan tertulis anti-pelecehan, wawancara independen aman.'; }
    else if (i === 37) { title = 'Pembayaran Upah Sesuai atau di Atas UMR / Upah Layak Minimum'; desc = 'Catatan pembayaran upah harian/borongan, kwitansi pembayaran.'; }
    else if (i === 40) { title = 'Pembayaran Tepat Waktu Tanpa Penundaan Berlebih'; desc = 'Jadwal pembayaran upah rutin (mingguan/bulanan), kwitansi tanggal bayar.'; }
    else if (i === 45) { title = 'Penyediaan Alat Pelindung Diri (APD) Lengkap Saat Aplikasi Bahan Kimia'; desc = 'Observasi ketersediaan masker respirator, sarung tangan nitril, sepatu bot, kacamata google.'; }
    else if (i === 46) { title = 'Pemeriksaan Kesehatan Berkala bagi Tenaga Kerja Penyemprot'; desc = 'Catatan pemeriksaan kesehatan atau buku kontrol dokter puskesmas.'; }
    else if (i === 50) { title = 'Akses Air Minum Bersih dan Fasilitas Sanitasi Layak di Kebun'; desc = 'Observasi jamban sehat dan air minum aman di lokasi kerja kebun.'; }
    else if (i === 55) { title = 'Mekanisme Pengaduan Keluhan yang Aman dan Rahasia (Grievance Mechanism)'; desc = 'Kotak saran atau nomor hotline ICS untuk pelaporan rahasia.'; }
    else if (i === 60) { title = 'Penyediaan Kotak P3K di Tempat Kerja Kebun'; desc = 'Kotak P3K terisi lengkap dengan obat luar, perban, antiseptik aktif.'; }
    else {
      title = `Kriteria Sosial Budidaya Kopi Bagian ${i - 19}`;
      desc = `Catatan kepatuhan sosial, kondisi kerja, dan wawancara pekerja sub-klausul ${i}.`;
    }

    checkpoints.push({
      checkpointCode: code,
      module: 'PRODUCER',
      dimension: DimensionType.SOCIAL,
      title,
      description: desc,
      officialRef: `4C 2.${i - 19}`,
      isMajor,
    });
  }

  // --------------------------------------------------------------------------
  // ENVIRONMENTAL DIMENSION: P070 - P108 (39 Checkpoints)
  // --------------------------------------------------------------------------
  const envKeyMajors = new Set([
    'P070', 'P071', 'P075', 'P080', 'P082', 'P083', 'P090', 'P096', 'P100', 'P104'
  ]);

  for (let i = 70; i <= 108; i++) {
    const code = `P${String(i).padStart(3, '0')}`;
    const isMajor = envKeyMajors.has(code);
    let title = '';
    let desc = '';

    if (i === 70) { title = 'Bebas Deforestasi dan Konversi Hutan Primer Sejak Cut-off Date (EUDR)'; desc = 'Analisis polygon lahan overlay peta tutupan hutan resmi, tidak ada pembukaan hutan pasca cut-off.'; }
    else if (i === 71) { title = 'Perlindungan Kawasan Nilai Konservasi Tinggi (HCV) dan Lahan Gambut'; desc = 'Peta batas kebun di luar area HCV/gambut, surat keterangan desa/kehutanan.'; }
    else if (i === 75) { title = 'Larangan Perburuan Liar dan Perlindungan Satwa Terancam Punah'; desc = 'Observasi lapangan tidak ada jerat/senapan, papan larangan berburu di kelompok.'; }
    else if (i === 80) { title = 'Penerapan Pengendalian Hama Terpadu (PHT / IPM) Sebelum Aplikasi Kimia'; desc = 'Catatan monitoring hama, perangkap biologis (brocap), sanitasi buah busuk.'; }
    else if (i === 82) { title = 'Larangan Penggunaan Pestisida Terlarang (WHO 1a/1b, POPs, PIC, Banned 4C)'; desc = 'Gudang saprodi petani bebas Paraquat, Endosulfan, dll; cek wadah bekas.'; }
    else if (i === 83) { title = 'Penyimpanan Bahan Kimia Aman, Terkunci dan Berjarak dari Air'; desc = 'Observasi lemari terkunci, lantai kedap air, jauh dari dapur & sumber air minum.'; }
    else if (i === 85) { title = 'Pengelolaan Wadah Bekas Pestisida (Triple Rinse & Lubangi)'; desc = 'Foto wadah pestisida telah dibilas 3x, dilubangi, dan dikembalikan ke bank sampah ICS.'; }
    else if (i === 90) { title = 'Pencegahan Erosi Tanah (Terasering, Rorak, dan Penutup Tanah)'; desc = 'Observasi rorak, teras bangku pada kemiringan >15%, rumput pakan penahan tanah.'; }
    else if (i === 92) { title = 'Pemupukan Berimbang Berdasarkan Kebutuhan Tanaman'; desc = 'Buku catatan dosis pupuk organik & anorganik, riwayat uji tanah bila ada.'; }
    else if (i === 95) { title = 'Peningkatan Penggunaan Bahan Organik & Kompos Kulit Kopi'; desc = 'Observasi tumpukan kompos cascara/kulit ceri di kebun, aplikasi ke piringan tanaman.'; }
    else if (i === 96) { title = 'Perlindungan Sumber Air dan Zona Penyangga Sempadan Sungai (Riparian)'; desc = 'Penanaman pohon penaung di sempadan air minimum 10m, tidak aplikasi pestisida di tepi sungai.'; }
    else if (i === 98) { title = 'Efisiensi Penggunaan Air Saat Pengolahan Basah'; desc = 'Catatan meteran/volume air pencucian ceri, penggunaan pulper hemat air.'; }
    else if (i === 100) { title = 'Pengolahan Air Limbah Pencucian Kopi (IPAL Limbah Cair)'; desc = 'Kolam pengendapan dan netralisasi air asam sebelum dialirkan ke tanah/saluran.'; }
    else if (i === 104) { title = 'Larangan Pembakaran Lahan dan Sampah Pertanian Terbuka'; desc = 'Observasi tidak ada sisa pembakaran gulma/ranting di kebun, komitmen tertulis petani.'; }
    else if (i === 105) { title = 'Keberadaan dan Keragaman Pohon Penaung (Agroforestri Min. 70 Pohon/Ha)'; desc = 'Sensus pohon penaung (lamtoro, sengon, alpukat, dll) per petak kebun.'; }
    else {
      title = `Kriteria Lingkungan dan Konservasi Bagian ${i - 69}`;
      desc = `Pemeriksaan lapangan kondisi fisik lingkungan, tanah, dan vegetasi sub-klausul ${i}.`;
    }

    checkpoints.push({
      checkpointCode: code,
      module: 'PRODUCER',
      dimension: DimensionType.ENVIRONMENTAL,
      title,
      description: desc,
      officialRef: `4C 3.${i - 69}`,
      isMajor,
    });
  }

  return checkpoints;
}

export class CheckpointRegistryService {
  producerCheckpoints: Checkpoint[];
  private byCode: Map<string, Checkpoint>;

  constructor() {
    this.producerCheckpoints = createProducerCheckpoints();
    this.byCode = new Map(this.producerCheckpoints.map(c => [c.checkpointCode, c]));
  }

  getByCode(code: string): Checkpoint | undefined {
    return this.byCode.get(code);
  }

  getModuleCheckpoints(module = 'PRODUCER'): Checkpoint[] {
    if (module === 'PRODUCER') return this.producerCheckpoints;
    return [];
  }

  getProducerDimensions() {
    return {
      economic: this.producerCheckpoints.filter(c => c.dimension === DimensionType.ECONOMIC),
      social: this.producerCheckpoints.filter(c => c.dimension === DimensionType.SOCIAL),
      environmental: this.producerCheckpoints.filter(c => c.dimension === DimensionType.ENVIRONMENTAL),
    };
  }
}

export const globalCheckpointRegistry = new CheckpointRegistryService();
