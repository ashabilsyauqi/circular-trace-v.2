import { RemedialActionItem } from './types';

/**
 * CIRCULARTRACE - 4C Remedial Action Playbook (Katalog Tindakan Perbaikan 4C)
 * Menyediakan panduan langkah aksi konkret, bukti fisik yang dibutuhkan,
 * dan estimasi biaya perbaikan untuk memenuhi kriteria 4C Code of Conduct v4.1 (CT-4CI).
 */

export const REMEDIAL_ACTION_PLAYBOOK: RemedialActionItem[] = [
  {
    id: 'ACT-01-BANNED-CHEMICALS',
    title: 'Eliminasi Total Penggunaan Bahan Kimia Terlarang (Bebas Paraquat/Gramoxone)',
    domain: 'PEST_CHEMICAL',
    domainName: '🧪 Pengelolaan Hama & Bahan Kimia',
    checkpoints: ['P075', 'P082'],
    isMajor: true,
    currentProblem:
      'Petani terindikasi menggunakan herbisida kontak berbahan aktif Paraquat (seperti Gramoxone) untuk penyiangan rumput secara instan.',
    actionSteps: [
      'Hentikan seketika seluruh pembelian, penyimpanan, dan aplikasi herbisida berbahan aktif Paraquat / Gramoxone di seluruh petak kebun.',
      'Kumpulkan dan serahkan seluruh sisa kemasan racun ke posko bank sampah / titik kumpul kelompok tani ICS untuk dimusnahkan secara aman.',
      'Beralih 100% ke penyiangan mekanis menggunakan mesin babat rumput atau arit manual, serta mempertahankan mulsa seresah penutup tanah.',
      'Buat dan isi Buku Logbook Pengendalian Gulma yang ditandatangani oleh petugas pendamping lapangan ICS.',
    ],
    requiredEvidence: [
      'Berita Acara Penyerahan & Pemusnahan Limbah Pestisida Terlarang ke Pengurus ICS.',
      'Foto fisik kebun bebas gulma hasil babat mekanis tanpa residu semprotan herbisida kuning mengering.',
      'Nota kuitansi sewa mesin babat rumput atau pembelian saprodi ramah lingkungan terdaftar resmi.',
    ],
    estimatedCostIdr: 350000,
    completionProofTemplate: 'DOC-BA-PEMUSNAHAN-PARAQUAT-ICS-2026.pdf',
    expectedImpact:
      'Menghilangkan temuan Major Kritis P075 & P082, membuka kunci Major Gate dari UNRESOLVED menjadi PASSED.',
  },
  {
    id: 'ACT-02-DEFORESTATION-BOUNDARY',
    title: 'Verifikasi Batas Kebun Bebas Deforestasi (EUDR & 4C Cut-Off 2020)',
    domain: 'WATER_WASTE_ENV',
    domainName: '💧 Konservasi Lingkungan & Hutan',
    checkpoints: ['P070', 'P071'],
    isMajor: true,
    currentProblem:
      'Plot kebun belum memiliki poligon batas terverifikasi atau berada dekat perbatasan kawasan hutan lindung pasca cut-off date 2020.',
    actionSteps: [
      'Lakukan deliniasi dan perekaman titik koordinat GPS poligon keliling batas petak lahan bersama surveyor ICS.',
      'Lakukan uji tumpang-susun (overlay spatial) terhadap peta tutupan hutan KLHK per 31 Desember 2020 dan peta acuan EUDR.',
      'Pasang patok batas fisik permanen dari kayu ulin / beton di setiap sudut batas kepemilikan lahan.',
      'Tandatangani Surat Pernyataan / Pakta Integritas Bebas Deforestasi bersama pengurus kelompok tani di atas meterai.',
    ],
    requiredEvidence: [
      'Berkas GeoJSON / Shapefile poligon batas kebun yang telah divalidasi tanpa tumpang tindih kawasan lindung.',
      'Peta visualisasi hasil analisis tutupan lahan EUDR dan status kawasan hutan KLHK.',
      'Foto patok batas kebun dengan geotag koordinat GPS presisi.',
      'Pakta Integritas Nol Deforestasi bermeterai.',
    ],
    estimatedCostIdr: 150000,
    completionProofTemplate: 'GEO-BOUNDARY-POLYGON-SLK-VERIFIED.geojson',
    expectedImpact:
      'Menutup ketidaksesuaian Major Mutlak P070 & P071, menjamin kepatuhan penuh terhadap EUDR dan 4C.',
  },
  {
    id: 'ACT-03-CHILD-LABOR-PROTECTION',
    title: 'Pemberantasan Pekerja Anak & Perlindungan Pemuda dari Pekerjaan Berbahaya',
    domain: 'LABOR_SAFETY',
    domainName: '👥 Ketenagakerjaan & Hak Asasi',
    checkpoints: ['P028', 'P029'],
    isMajor: true,
    currentProblem:
      'Ditemukan anak di bawah 15 tahun bekerja sebagai buruh upahan saat musim panen atau remaja 15–17 tahun mengangkut beban berat.',
    actionSteps: [
      'Lakukan verifikasi identitas (KTP / Kartu Keluarga / Akta Kelahiran) terhadap seluruh pekerja buruh yang dipekerjakan di kebun.',
      'Pasang papan aturan tertulis di titik kumpul yang melarang keras mempekerjakan anak di bawah usia 15 tahun sebagai buruh.',
      'Pastikan anak-anak petani tetap bersekolah dan hanya membantu kegiatan ringan keluarga di luar jam belajar.',
      'Batasi tugas pekerja muda (15–17 tahun): dilarang menyemprot bahan kimia, dilarang memanggul beban >15 kg, dan dilarang kerja malam.',
    ],
    requiredEvidence: [
      'Buku register ketenagakerjaan kebun dengan fotokopi dokumen identitas pekerja dewasa.',
      'Surat komitmen bersama perlindungan hak anak kelompok tani.',
      'Bukti surat keterangan bersekolah / rapor anak petani.',
    ],
    estimatedCostIdr: 50000,
    completionProofTemplate: 'DOC-CHILD-LABOR-AUDIT-REGISTER-2026.pdf',
    expectedImpact: 'Menutup temuan Major Mutlak P028 & P029 sesuai Konvensi ILO 138 & 182.',
  },
  {
    id: 'ACT-04-ZERO-BURNING',
    title: 'Penghentian Total Pembakaran Lahan (Zero Burning) & Pembuatan Rorak Serasah',
    domain: 'WATER_WASTE_ENV',
    domainName: '💧 Air, Limbah & Lingkungan',
    checkpoints: ['P104'],
    isMajor: true,
    currentProblem:
      'Ditemukan praktik pembakaran serasah daun kopi, semak belukar, atau sisa pangkasan ranting di petak kebun.',
    actionSteps: [
      'Hentikan seluruh aktivitas pembakaran terbuka di area kebun kopi.',
      'Gali rorak penampung serasah di antara barisan tanaman kopi (panjang 2m, lebar 40cm, dalam 60cm).',
      'Cacah ranting dan dedaunan pangkasan untuk dimasukkan ke dalam rorak atau dihamparkan sebagai mulsa penutup tanah.',
      'Pasang plang tanda peringatan "Kawasan Bebas Pembakaran / Zero Burning" di pintu masuk kebun.',
    ],
    requiredEvidence: [
      'Foto petak kebun bersih bebas bekas abu atau arang pembakaran.',
      'Foto rorak aktif yang terisi mulsa seresah daun kopi dan potongan ranting lapuk.',
      'Plang peringatan larangan membakar di petak kebun.',
    ],
    estimatedCostIdr: 100000,
    completionProofTemplate: 'IMG-RORAK-MULSA-NO-BURN.jpg',
    expectedImpact: 'Menutup temuan Major Mutlak P104 dan mendukung indikator sirkularitas bahan organik.',
  },
  {
    id: 'ACT-05-CHEMICAL-STORAGE-PPE',
    title: 'Pengadaan Lemari Penyimpanan Terkunci & Alat Pelindung Diri (APD) Lengkap',
    domain: 'PEST_CHEMICAL',
    domainName: '🧪 Pengelolaan Hama & Bahan Kimia',
    checkpoints: ['P083', 'P045'],
    isMajor: true,
    currentProblem:
      'Pestisida disimpan sembarangan di pondok/dapur terbuka dan penyemprot tidak mengenakan APD standar.',
    actionSteps: [
      'Sediakan lemari khusus dari kayu atau plat besi berpintu kunci gembok, berlantai kedap air, dan berventilasi udara cukup.',
      'Letakkan lemari di bangunan terpisah yang jauh dari jangkauan anak-anak, bahan makanan, dan sumber air minum.',
      'Beli dan sediakan 1 set APD lengkap: masker respirator kimia, kacamata goggle, sarung tangan karet nitril, dan sepatu bot.',
      'Wajibkan operator mengenakan APD lengkap setiap kali menangani dan mengaplikasikan saprodi kimia.',
    ],
    requiredEvidence: [
      'Foto lemari penyimpanan pestisida dengan gembok terpasang dan label bahaya racun.',
      'Foto operator mengenakan APD lengkap (masker, kacamata, sarung tangan, sepatu bot).',
      'Nota kuitansi pembelian set perlengkapan APD berstandar SNI.',
    ],
    estimatedCostIdr: 450000,
    completionProofTemplate: 'IMG-LEMARI-TERKUNCI-DAN-APD.jpg',
    expectedImpact: 'Menutup temuan Major K3 P083 dan memenuhi kepatuhan keselamatan kerja P045.',
  },
  {
    id: 'ACT-06-WATER-BUFFER-WASTEWATER',
    title: 'Konservasi Sempadan Air (10m) & Pembuatan IPAL Resapan Limbah Pulper',
    domain: 'WATER_WASTE_ENV',
    domainName: '💧 Air, Limbah & Konservasi',
    checkpoints: ['P096', 'P100'],
    isMajor: true,
    currentProblem:
      'Tanaman kopi disemprot hingga bibir sungai dan/atau air limbah pencucian ceri dibuang langsung tanpa pengolahan.',
    actionSteps: [
      'Tetapkan dan tandai zona penyangga sempadan mata air dan sungai minimal 10 meter.',
      'Tanam vegetasi pohon penahan erosi (bambu, vetiver, rumput gajah) dan dilarang mengaplikasikan bahan kimia di zona sempadan.',
      'Buat kolam pengendapan limbah cair bertingkat sederhana (kolam sedimentasi, netralisasi abu/kapur, dan resapan tanah).',
      'Atau alihkan pengolahan basah ceri ke Unit Pengolah Bersama (UPB) Koperasi yang memiliki fasilitas IPAL terpusat.',
    ],
    requiredEvidence: [
      'Foto patok pembatas zona sempadan 10m dengan tanaman penahan tebing sungai.',
      'Foto instalasi kolam pengendapan limbah cair pulper sederhana bertahap.',
      'Surat tanda terima penyerahan ceri ke UPB Koperasi terverifikasi IPAL.',
    ],
    estimatedCostIdr: 600000,
    completionProofTemplate: 'IMG-ZONA-SEMPADAN-DAN-IPAL.jpg',
    expectedImpact: 'Menutup temuan Major P096 & P100 untuk mencegah kontaminasi perairan umum.',
  },
  {
    id: 'ACT-07-WATER-FIRST-AID',
    title: 'Penyediaan Air Minum Bersih & Kotak P3K Lengkap di Kebun',
    domain: 'LABOR_SAFETY',
    domainName: '👥 Ketenagakerjaan & Keselamatan',
    checkpoints: ['P050', 'P060'],
    isMajor: true,
    currentProblem:
      'Pekerja kebun tidak disediakan akses air minum higienis dan tidak ada sarana pertolongan pertama kecelakaan.',
    actionSteps: [
      'Sediakan galon air minum higienis atau termos air masak di pondok kebun yang dapat diakses cuma-cuma oleh seluruh pekerja.',
      'Pasang kotak P3K darurat di dinding pondok kebun.',
      'Lengkapi isi kotak P3K: obat antiseptik luka (Povidone Iodine), perban kasa steril, plester cepat, kapas, dan minyak pereda gigitan serangga.',
      'Latih minimal 1 orang petani/mandor cara dasar penanganan darurat luka sayat arit dan gigitan hewan.',
    ],
    requiredEvidence: [
      'Foto kotak P3K terpasang di pondok kebun dengan isi obat lengkap dan masa kedaluwarsa berlaku.',
      'Foto dispenser/galon wadah air minum pekerja di lokasi istirahat kebun.',
    ],
    estimatedCostIdr: 120000,
    completionProofTemplate: 'IMG-KOTAK-P3K-DAN-AIR-BERSIH.jpg',
    expectedImpact: 'Menutup temuan Major P050 dan memenuhi kriteria darurat P060.',
  },
  {
    id: 'ACT-08-SOIL-EROSION-SHADE',
    title: 'Tindakan Konservasi Erosi (Teras Bangku/Rorak) & Kerapatan Pohon Penaung',
    domain: 'SOIL_PLANT',
    domainName: '🌾 Pengelolaan Tanah & Tanaman',
    checkpoints: ['P090', 'P012', 'P105'],
    isMajor: true,
    currentProblem:
      'Kebun di lereng curam (>15%) rawan erosi topsoil dan kerapatan pohon penaung di bawah standar 4C (<70 pohon/Ha).',
    actionSteps: [
      'Buat teras bangku atau teras kontur mengikuti garis tinggi tanah pada petak kebun dengan kemiringan >15%.',
      'Gali rorak penahan aliran air dan endapan seresah secara merata di sepanjang lereng.',
      'Tanam bibit pohon penaung leguminosa (Gamal, Lamtoro) atau pohon buah bernilai ekonomi (Alpukat, Petai) hingga mencapai minimal 70 pohon per hektar.',
      'Lakukan sensus pohon penaung per plot dan catat jenis serta jumlahnya bersama petugas ICS.',
    ],
    requiredEvidence: [
      'Foto fisik terasering kontur dan rorak endapan air di lereng kebun kopi.',
      'Lembar sensus tegakan pohon penaung per plot yang diverifikasi petugas ICS.',
      'Foto tanaman penaung hidup yang tumbuh menaungi kopi.',
    ],
    estimatedCostIdr: 300000,
    completionProofTemplate: 'DOC-SENSUS-PENAUNG-TERAS-LERENG.pdf',
    expectedImpact:
      'Menutup temuan Major P090 & P012, serta meningkatkan resiliensi kebun terhadap perubahan iklim mikro.',
  },
  {
    id: 'ACT-09-LOT-SEPARATION',
    title: 'Pemisahan Fisik Lot Kopi 4C & Keterlacakan Transaksi Panen',
    domain: 'SOIL_PLANT',
    domainName: '🌾 Pengelolaan Tanah & Ketertelusuran',
    checkpoints: ['P004', 'P003'],
    isMajor: true,
    currentProblem:
      'Ceri kopi 4C tercampur dengan ceri dari kebun non-sertifikasi tanpa label identitas lot yang jelas.',
    actionSteps: [
      'Gunakan karung khusus berlabel identitas lot 4C (mencantumkan kode petani, kode plot, tanggal petik).',
      'Pisahkan tempat transit penyimpanan karung ceri 4C dari kopi non-sertifikasi di titik kumpul.',
      'Pastikan setiap transaksi penimbangan ceri dicatat dalam nota timbang bernomor seri rangkap 2.',
      'Serahkan rekapan transaksi mingguan ke koordinator ICS kelompok tani.',
    ],
    requiredEvidence: [
      'Foto karung ceri bertanda label lot 4C di titik kumpul.',
      'Fotokopi buku register penimbangan ceri dan nota transaksi penjualan.',
      'Kartu kendali lot kopi kelompok tani.',
    ],
    estimatedCostIdr: 50000,
    completionProofTemplate: 'IMG-KARUNG-LABEL-LOT-4C.jpg',
    expectedImpact: 'Menutup temuan Major P004 dan memastikan keterlacakan rantai pasok P003.',
  },
];

/**
 * Mencari panduan aksi remedial standar berdasarkan kode checkpoint 4C
 */
export function getRemedialActionForCheckpoint(checkpointCode: string): RemedialActionItem | null {
  const normalized = (checkpointCode || '').trim().toUpperCase();
  return (
    REMEDIAL_ACTION_PLAYBOOK.find((act) =>
      act.checkpoints.map((c) => c.toUpperCase()).includes(normalized)
    ) || null
  );
}
