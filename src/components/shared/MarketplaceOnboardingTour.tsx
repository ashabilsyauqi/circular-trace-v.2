import React, { useState, useEffect } from 'react';
import {
  X,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  Coffee,
  Search,
  ArrowUpDown,
  Filter,
  Layers,
  MapPin,
  Award,
  ShieldCheck,
  ShoppingCart,
  QrCode,
  Receipt,
  Truck,
  CheckCircle2,
  HelpCircle,
  Building2,
  Sprout,
  Check,
  Eye,
  ArrowRight,
  CreditCard,
} from 'lucide-react';

const STORAGE_KEY = 'cct_onboarding_tour_v1';

interface TourStep {
  id: string;
  stepNumber: number;
  title: string;
  subtitle: string;
  tag: string;
  icon: React.ReactNode;
  content: {
    description: string;
    points: { icon: React.ReactNode; title: string; desc: string }[];
    proTip: string;
  };
  mockPreview: React.ReactNode;
}

export const MarketplaceOnboardingTour: React.FC<{
  isOpen?: boolean;
  onClose?: () => void;
  forceOpen?: boolean;
}> = ({ isOpen: controlledIsOpen, onClose: controlledOnClose, forceOpen = false }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);

  // Auto-trigger on first visit using Cache Management
  useEffect(() => {
    if (forceOpen) {
      setIsOpen(true);
      setCurrentStepIndex(0);
      return;
    }

    if (controlledIsOpen !== undefined) {
      setIsOpen(controlledIsOpen);
      return;
    }

    if (typeof window !== 'undefined') {
      const hasSeen = localStorage.getItem(STORAGE_KEY);
      if (!hasSeen) {
        const timer = setTimeout(() => {
          setIsOpen(true);
        }, 600);
        return () => clearTimeout(timer);
      }
    }
  }, [controlledIsOpen, forceOpen]);

  const handleClose = (markCompleted: boolean = true) => {
    if (markCompleted && typeof window !== 'undefined') {
      try {
        localStorage.setItem(STORAGE_KEY, 'true');
      } catch (e) {
        console.error('Failed to set tour cache', e);
      }
    }
    setIsOpen(false);
    if (controlledOnClose) controlledOnClose();
  };

  const handleNext = () => {
    if (currentStepIndex < TOUR_STEPS.length - 1) {
      setCurrentStepIndex((prev) => prev + 1);
    } else {
      handleClose(true);
    }
  };

  const handlePrev = () => {
    if (currentStepIndex > 0) {
      setCurrentStepIndex((prev) => prev - 1);
    }
  };

  // TOUR STEPS SPECIFICATION (Lengkap dari Search, Filter, Bundle Cart, hingga Paspor Traceability)
  const TOUR_STEPS: TourStep[] = [
    {
      id: 'welcome',
      stepNumber: 1,
      title: 'Selamat Datang di CircularTrace Marketplace',
      subtitle: 'Pasar Komoditas Kopi Specialty & Rantai Pasok Sirkular Nusantara',
      tag: 'Pengenalan Ekosistem',
      icon: <Coffee className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Platform ini menghubungkan langsung kelompok tani, pengolah paska-panen, gudang sertifikasi, roastery artisan, hingga pembeli retail secara transparan.',
        points: [
          {
            icon: <Sprout className="w-4 h-4 text-emerald-600" />,
            title: 'Langsung dari Hulu Petani',
            desc: 'Setiap lot kopi memiliki identitas petani, elevasi kebun, dan data panen riil.',
          },
          {
            icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
            title: 'Kepatuhan Regulasi EUDR',
            desc: 'Bebas deforestasi terverifikasi oleh Prof. Novizar Nazir (TPHP Universitas Andalas).',
          },
          {
            icon: <QrCode className="w-4 h-4 text-emerald-600" />,
            title: 'Paspor Digital & Barcode GS1-128',
            desc: 'Silsilah dari kebun hingga ke cangkir dapat dilacak melalui QR trace publik.',
          },
        ],
        proTip: 'Semua harga penawaran bersifat transparan tanpa biaya tersembunyi bagi pembeli.',
      },
      mockPreview: (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-3">
          <div className="flex items-center justify-between text-xs font-bold text-slate-800">
            <span className="flex items-center gap-1.5 text-emerald-800">
              <Sparkles className="w-4 h-4 text-emerald-600" />
              <span>Alur Rantai Pasok Terpadu (Farm-to-Cup)</span>
            </span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px]">
              100% Sirkular
            </span>
          </div>
          <div className="grid grid-cols-4 gap-2 text-center text-[11px]">
            <div className="p-2.5 bg-orange-50 rounded-xl border border-orange-200">
              <div className="font-bold text-orange-800">1. Petani</div>
              <div className="text-[10px] text-orange-600 mt-0.5">Ceri Brix 22°</div>
            </div>
            <div className="p-2.5 bg-emerald-50 rounded-xl border border-emerald-200">
              <div className="font-bold text-emerald-800">2. Mill Olah</div>
              <div className="text-[10px] text-emerald-600 mt-0.5">Honey / Anaerob</div>
            </div>
            <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200">
              <div className="font-bold text-teal-800">3. Gudang QA</div>
              <div className="text-[10px] text-teal-600 mt-0.5">Green Bean G1</div>
            </div>
            <div className="p-2.5 bg-amber-50 rounded-xl border border-amber-200">
              <div className="font-bold text-amber-800">4. Roaster</div>
              <div className="text-[10px] text-amber-600 mt-0.5">Biji Sangrai</div>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'search-sort',
      stepNumber: 2,
      title: 'Pencarian Cerdas & Pengurutan Mutu',
      subtitle: 'Temukan Lot Kopi Berdasarkan Varietas, Koperasi, & Mutu Tertinggi',
      tag: 'Pencarian Cepat',
      icon: <Search className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Kolom pencarian cerdas kami memahami kata kunci komprehensif mulai dari nama varietas, elevasi, hingga nama daerah origin.',
        points: [
          {
            icon: <Search className="w-4 h-4 text-emerald-600" />,
            title: 'Pencarian Multi-Atribut',
            desc: 'Ketik varietas (Typica, Bourbon, Ateng), origin (Solok, Gayo), atau nama koperasi penjual.',
          },
          {
            icon: <ArrowUpDown className="w-4 h-4 text-emerald-600" />,
            title: 'Urutkan Sesuai Kebutuhan',
            desc: 'Pilihan sortir: Rekomendasi, Harga Termurah/Termahal, Skor SCA Tertinggi, atau Stok Terbanyak.',
          },
          {
            icon: <Check className="w-4 h-4 text-emerald-600" />,
            title: 'Tag Filter Aktif',
            desc: 'Filter yang Anda pilih muncul sebagai chip aktif di bawah searchbar yang dapat dihapus dengan 1 klik.',
          },
        ],
        proTip: 'Gunakan kata kunci spesifik seperti "Honey" atau "87" untuk menemukan lot kopi dengan proses spesifik.',
      },
      mockPreview: (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
          <div className="flex gap-2">
            <div className="relative flex-1 bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs flex items-center gap-2 text-slate-800 shadow-2xs">
              <Search className="w-3.5 h-3.5 text-slate-400" />
              <span className="font-mono text-emerald-800 font-semibold">Typica Solok Radjo</span>
            </div>
            <div className="bg-white border border-slate-200 rounded-xl px-3 py-2 text-xs font-bold text-slate-700 flex items-center gap-1.5 shadow-2xs">
              <ArrowUpDown className="w-3 h-3 text-slate-400" />
              <span>Skor SCA: Tertinggi</span>
            </div>
          </div>
          <div className="flex items-center gap-1.5 text-[11px]">
            <span className="text-slate-400">Filter Aktif:</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200 font-bold">
              Asal: Solok Radjo &times;
            </span>
            <span className="px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-200 font-bold">
              SCA &ge; 86 &times;
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'category-filter',
      stepNumber: 3,
      title: 'Filter Kategori Komoditas (Warna Semantik)',
      subtitle: 'Standar Token Desain v1.0 Membedakan Bentuk Komoditas Kopi',
      tag: 'Kategori Komoditas',
      icon: <Layers className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Sidebar filter di sisi kiri mengelompokkan komoditas kopi berdasarkan tahapan pasoknya dengan kode warna seragam:',
        points: [
          {
            icon: <div className="w-3 h-3 rounded-full bg-orange-500" />,
            title: 'Ceri Kopi Segar (Panen Hulu) - Oranye',
            desc: 'Ceri petik merah dengan kadar Brix tinggi untuk prosesor dan pabrik pengolahan.',
          },
          {
            icon: <div className="w-3 h-3 rounded-full bg-emerald-500" />,
            title: 'Green Bean Olahan & Ekspor - Hijau Emerald',
            desc: 'Biji kopi mentah siap sangrai (Grade 1 Specialty) untuk roastery dan eksportir.',
          },
          {
            icon: <div className="w-3 h-3 rounded-full bg-amber-500" />,
            title: 'Biji Kopi Sangrai (Roasted) - Amber',
            desc: 'Biji sangrai artisan kemasan pouch siap saji untuk kedai kopi dan penikmat rumah.',
          },
        ],
        proTip: 'Border aksen hijau di sisi kiri menandai kategori yang aktif. Opsi bernilai 0 otomatis dinonaktifkan.',
      },
      mockPreview: (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-1.5 text-xs">
          <div className="font-bold text-slate-900 pb-1.5 border-b border-slate-100 flex items-center justify-between">
            <span>Kategori Komoditas</span>
            <span className="text-[10px] text-emerald-700 font-bold">Sidebar Filter</span>
          </div>
          <div className="p-2 rounded-xl bg-emerald-50 border-l-4 border-emerald-600 text-emerald-900 font-bold flex items-center justify-between">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-600" />
              Green Bean Olahan (Mill)
            </span>
            <span className="text-[10px] bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full">
              12 Lot
            </span>
          </div>
          <div className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-between border-l-4 border-transparent">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-orange-400" />
              Ceri Kopi Segar (Panen)
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              6 Lot
            </span>
          </div>
          <div className="p-2 rounded-xl text-slate-600 hover:bg-slate-50 flex items-center justify-between border-l-4 border-transparent">
            <span className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              Biji Kopi Sangrai (Roasted)
            </span>
            <span className="text-[10px] bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full">
              8 Lot
            </span>
          </div>
        </div>
      ),
    },
    {
      id: 'origin-filter',
      stepNumber: 4,
      title: 'Filter Wilayah Origin Nusantara (Faceted Origin)',
      subtitle: '5 Kawasan Penghasil Kopi Unggulan Indonesia',
      tag: 'Wilayah Asal',
      icon: <MapPin className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Sistem pencarian terhubung dengan 5 wilayah origin terdaftar lengkap dengan profil elevasi dan karakter terroir:',
        points: [
          {
            icon: <MapPin className="w-4 h-4 text-slate-500" />,
            title: 'Pangalengan (Jawa Barat)',
            desc: 'Elevasi 1.400 - 1.600 mdpl. Karakter floral, black tea, bright citrus, dan clean wash.',
          },
          {
            icon: <MapPin className="w-4 h-4 text-slate-500" />,
            title: 'Aceh Gayo (Sumatera)',
            desc: 'Elevasi 1.300 - 1.700 mdpl. Karakter full-bodied, herbal spicy, dan dark chocolate.',
          },
          {
            icon: <MapPin className="w-4 h-4 text-slate-500" />,
            title: 'Kintamani (Bali)',
            desc: 'Elevasi 1.200 - 1.500 mdpl. Karakter citrus orange, sweet caramel, dan acidity lembut.',
          },
          {
            icon: <MapPin className="w-4 h-4 text-slate-500" />,
            title: 'Bajawa Flores & Solok Radjo',
            desc: 'Flores (nutty floral) & Solok Radjo (berry sweetness, anaerobic fermentasi khas Minang).',
          },
        ],
        proTip: 'Hitungan faceted dinamis memastikan filter origin tidak pernah menghasilkan halaman kosong (zero-result trap).',
      },
      mockPreview: (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2">
          <div className="text-xs font-bold text-slate-800 flex items-center justify-between">
            <span>Pilihan Origin Terpopuler</span>
            <span className="text-[10px] text-slate-500 font-normal">Faceted Count</span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs font-bold text-slate-800 flex justify-between">
              <span>Pangalengan (Jabar)</span>
              <span className="text-emerald-700">8</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs font-bold text-slate-800 flex justify-between">
              <span>Aceh Gayo (Sumatera)</span>
              <span className="text-emerald-700">7</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs font-bold text-slate-800 flex justify-between">
              <span>Kintamani (Bali)</span>
              <span className="text-emerald-700">5</span>
            </div>
            <div className="p-2.5 bg-white rounded-xl border border-slate-200 shadow-2xs font-bold text-slate-800 flex justify-between">
              <span>Solok Radjo (Sumbar)</span>
              <span className="text-emerald-700">6</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'sca-eudr-price',
      stepNumber: 5,
      title: 'Filter Mutu SCA, Standar EUDR & Rentang Harga',
      subtitle: 'Kurasi Mutu Fisik, Skor Cupping, & Sertifikasi Bebas Deforestasi',
      tag: 'Spesifikasi & Mutu',
      icon: <Award className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Pastikan Anda membeli komoditas kopi yang sesuai dengan standar audit dan batas anggaran operasional:',
        points: [
          {
            icon: <Award className="w-4 h-4 text-amber-600" />,
            title: 'Skor Cupping SCA 84+ & 86+',
            desc: 'Filter lot kelas Specialty Standard (84+) hingga Specialty Superior (86+) bersertifikat Q-Grader.',
          },
          {
            icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
            title: 'Kepatuhan Regulasi EUDR',
            desc: 'Centang "Terverifikasi Audit" untuk komoditas dengan sertifikat zero-deforestation resmi.',
          },
          {
            icon: <CreditCard className="w-4 h-4 text-slate-600" />,
            title: 'Rentang Harga Transparan',
            desc: 'Masukkan harga minimum dan maksimum per kilogram untuk menyesuaikan pesanan.',
          },
        ],
        proTip: 'Format harga satuan telah distandarkan tanpa typo: contoh "Rp 145.000 / kg".',
      },
      mockPreview: (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-3 text-xs">
          <div className="flex items-center justify-between pb-2 border-b border-slate-100">
            <span className="font-bold text-slate-900">Kurasi Standar Mutu</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              EUDR Compliant
            </span>
          </div>
          <div className="space-y-1.5">
            <label className="flex items-center gap-2 font-medium text-slate-700">
              <input type="radio" checked readOnly className="accent-emerald-600" />
              <span>SCA 86+ (Specialty Superior &bull; Defect &le; 3/350g)</span>
            </label>
            <label className="flex items-center gap-2 font-medium text-slate-700">
              <input type="checkbox" checked readOnly className="accent-emerald-600" />
              <span>Hanya Produk Terverifikasi Audit (Prof. Novizar Nazir)</span>
            </label>
          </div>
          <div className="pt-2 border-t border-slate-100 flex items-center justify-between font-mono text-[11px] text-slate-600">
            <span>Rp 100.000 - Rp 250.000 / kg</span>
            <span className="text-emerald-700 font-bold">Terapkan Filter</span>
          </div>
        </div>
      ),
    },
    {
      id: 'bundle-cart',
      stepNumber: 6,
      title: 'Keranjang Belanja & Pembayaran Bundle Dinamis',
      subtitle: 'Hanya Bayar Komoditas yang Diberi Tanda Centang (Checklist)',
      tag: 'Bundle Payment',
      icon: <ShoppingCart className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Sistem keranjang belanja kami mendukung pembayaran bundle dengan perhitungan biaya yang sepenuhnya dinamis:',
        points: [
          {
            icon: <CheckCircle2 className="w-4 h-4 text-emerald-600" />,
            title: 'Checklist Bundle Dinamis',
            desc: 'Gunakan checkbox untuk memilih produk yang ingin dibayar sekarang. Produk lain tetap aman tersimpan.',
          },
          {
            icon: <Truck className="w-4 h-4 text-emerald-600" />,
            title: 'Kargo Khusus Kopi',
            desc: 'Pilihan kurir ekspedisi J&T Cargo, JNE Express, atau SiCepat Cargo dengan estimasi biaya transparan.',
          },
          {
            icon: <Eye className="w-4 h-4 text-emerald-600" />,
            title: 'Hover Preview Cepat di Navbar',
            desc: 'Arahkan kursor ke ikon keranjang di kanan atas navbar untuk melihat 4 produk terakhir tanpa pindah halaman.',
          },
        ],
        proTip: 'Jika belum ada produk yang dicentang, tombol checkout otomatis non-aktif untuk mencegah kesalahan bayar.',
      },
      mockPreview: (
        <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="flex items-center justify-between font-bold text-slate-900 border-b border-slate-200/80 pb-2">
            <span className="flex items-center gap-1.5">
              <input type="checkbox" checked readOnly className="accent-emerald-600" />
              <span>Pilih Semua (3 Produk)</span>
            </span>
            <span className="text-emerald-800 font-bold">2 Dipilih untuk Bundle</span>
          </div>
          <div className="space-y-1.5">
            <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="accent-emerald-600" />
                <span className="font-semibold text-slate-800">Robusta Pesisir Selatan (2 kg)</span>
              </span>
              <span className="font-bold text-slate-900">Rp 290.000</span>
            </div>
            <div className="p-2 bg-white rounded-xl border border-slate-200 flex items-center justify-between">
              <span className="flex items-center gap-2">
                <input type="checkbox" checked readOnly className="accent-emerald-600" />
                <span className="font-semibold text-slate-800">Arabika Solok Radjo (1 kg)</span>
              </span>
              <span className="font-bold text-slate-900">Rp 175.000</span>
            </div>
          </div>
          <div className="p-2.5 bg-emerald-600 text-white rounded-xl text-center font-bold text-xs shadow-xs">
            Bayar Bundle (2 Produk) &bull; Rp 477.500
          </div>
        </div>
      ),
    },
    {
      id: 'collapse-table-trace',
      stepNumber: 7,
      title: 'Tabel Akordeon Silsilah & Paspor Digital Barcode',
      subtitle: 'Inspeksi Lengkap Sebelum Bayar & Pelacakan Setelah Transaksi',
      tag: 'Transparansi & Traceability',
      icon: <QrCode className="w-5 h-5 text-emerald-600" />,
      content: {
        description:
          'Setiap lot kopi dilengkapi dokumen silsilah terakreditasi sebelum dan sesudah Anda melakukan transaksi:',
        points: [
          {
            icon: <Building2 className="w-4 h-4 text-emerald-600" />,
            title: 'Tabel Collapse Akordeon per Produk',
            desc: 'Buka rincian di keranjang untuk melihat nomor lot, kadar air 11.5%, jam fermentasi, dan Brix.',
          },
          {
            icon: <QrCode className="w-4 h-4 text-emerald-600" />,
            title: 'Modal Paspor QR & Barcode GS1-128',
            desc: 'Di halaman Riwayat Transaksi, klik tombol [Lacak QR Trace] untuk membuka sertifikat paspor dan barcode fisik.',
          },
          {
            icon: <Receipt className="w-4 h-4 text-emerald-600" />,
            title: 'Pemisahan Halaman Transaksi yang Jelas',
            desc: 'Keranjang belanja khusus untuk seleksi & checkout, sedangkan Riwayat Transaksi khusus arsip faktur & resi.',
          },
        ],
        proTip: 'Anda dapat mencetak paspor fisik atau memindai QR code langsung dari kamera smartphone.',
      },
      mockPreview: (
        <div className="bg-white p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
          <div className="p-2.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
            <span className="font-mono font-bold text-slate-800">Lot: BATCH-PSS-2026-HNY02</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
              Barcode Valid
            </span>
          </div>
          <div className="border border-slate-200 rounded-xl overflow-hidden text-[11px]">
            <div className="p-1.5 bg-slate-100 font-bold text-slate-700 flex justify-between">
              <span>Parameter Silsilah</span>
              <span>Data Spesifikasi</span>
            </div>
            <div className="p-1.5 border-t border-slate-100 flex justify-between">
              <span className="text-slate-500">Mutu SCA</span>
              <span className="font-bold text-amber-900">SCA 86.5 (Specialty)</span>
            </div>
            <div className="p-1.5 border-t border-slate-100 flex justify-between">
              <span className="text-slate-500">Kepatuhan EUDR</span>
              <span className="font-bold text-emerald-800">Zero-Deforestation (UNAND)</span>
            </div>
          </div>
          <div className="p-2 bg-emerald-50 text-emerald-900 border border-emerald-200 rounded-xl flex items-center justify-center gap-1.5 font-bold text-[11px]">
            <QrCode className="w-3.5 h-3.5 text-emerald-700" />
            <span>[ ⛶ Lacak QR Trace Paspor ]</span>
          </div>
        </div>
      ),
    },
  ];

  if (!isOpen) return null;

  const currentStep = TOUR_STEPS[currentStepIndex];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/75 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto animate-in fade-in duration-200">
      <div className="bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden my-auto flex flex-col max-h-[92vh]">
        
        {/* HEADER BAR */}
        <div className="p-5 sm:p-6 bg-gradient-to-r from-emerald-900 via-emerald-800 to-teal-900 text-white flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-black uppercase tracking-wider flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-emerald-400" />
                <span>Panduan Interaktif Marketplace</span>
              </span>
              <span className="text-[10px] bg-white/10 text-emerald-100 px-2.5 py-0.5 rounded-full font-mono font-bold">
                Langkah {currentStepIndex + 1} dari {TOUR_STEPS.length}
              </span>
            </div>
            <h2 className="text-lg sm:text-xl font-black text-white leading-tight">
              {currentStep.title}
            </h2>
            <p className="text-xs text-emerald-100/90 max-w-xl">
              {currentStep.subtitle}
            </p>
          </div>

          <button
            type="button"
            onClick={() => handleClose(true)}
            className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-emerald-100 hover:text-white transition-colors cursor-pointer shrink-0"
            title="Tutup panduan"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* STEP PROGRESS NAVIGATION TABS */}
        <div className="px-5 py-2.5 bg-slate-50 border-b border-slate-200 flex items-center justify-between gap-1 overflow-x-auto">
          {TOUR_STEPS.map((step, idx) => {
            const isCurrent = idx === currentStepIndex;
            const isPassed = idx < currentStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStepIndex(idx)}
                className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 cursor-pointer ${
                  isCurrent
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : isPassed
                    ? 'bg-emerald-100/70 text-emerald-800 hover:bg-emerald-100'
                    : 'text-slate-500 hover:bg-slate-200/70'
                }`}
              >
                <span>{step.stepNumber}. {step.tag}</span>
              </button>
            );
          })}
        </div>

        {/* BODY AREA */}
        <div className="p-5 sm:p-6 space-y-5 overflow-y-auto flex-1">
          {/* Main Description */}
          <p className="text-xs sm:text-sm text-slate-700 leading-relaxed font-medium">
            {currentStep.content.description}
          </p>

          {/* Grid Layout: Key Points (Left) + Interactive Visual Preview (Right) */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-start">
            {/* Key Bullet Points (Left 7 Cols) */}
            <div className="md:col-span-7 space-y-3">
              {currentStep.content.points.map((pt, i) => (
                <div
                  key={i}
                  className="p-3 rounded-2xl bg-slate-50 border border-slate-200/90 flex items-start gap-3 hover:border-emerald-300 transition-colors"
                >
                  <div className="p-2 rounded-xl bg-white border border-slate-200 text-emerald-600 shadow-2xs shrink-0 mt-0.5">
                    {pt.icon}
                  </div>
                  <div className="space-y-0.5">
                    <h4 className="text-xs font-bold text-slate-900">{pt.title}</h4>
                    <p className="text-[11px] text-slate-600 leading-relaxed">{pt.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Interactive Visual Preview (Right 5 Cols) */}
            <div className="md:col-span-5 space-y-3">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-400 flex items-center gap-1">
                <Eye className="w-3.5 h-3.5 text-emerald-600" />
                <span>Simulasi Tampilan Fitur</span>
              </div>
              {currentStep.mockPreview}

              {/* Pro Tip Callout */}
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-[11px] text-emerald-900 flex items-start gap-2">
                <span className="font-bold shrink-0 text-emerald-700">💡 Tips:</span>
                <span className="leading-snug">{currentStep.content.proTip}</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER ACTIONS BAR */}
        <div className="p-4 sm:p-5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
          {/* Skip Button */}
          <button
            type="button"
            onClick={() => handleClose(true)}
            className="text-xs font-semibold text-slate-500 hover:text-slate-800 transition-colors cursor-pointer"
          >
            Lewati Tutorial (Tutup)
          </button>

          {/* Step Dots & Next/Prev Controls */}
          <div className="flex items-center gap-2">
            {/* Prev Button */}
            <button
              type="button"
              disabled={currentStepIndex === 0}
              onClick={handlePrev}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1 ${
                currentStepIndex === 0
                  ? 'text-slate-300 cursor-not-allowed'
                  : 'bg-white hover:bg-slate-100 text-slate-700 border border-slate-200 shadow-2xs cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Sebelumnya</span>
            </button>

            {/* Next / Finish Button */}
            <button
              type="button"
              onClick={handleNext}
              className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-[0.98] text-white text-xs font-bold transition-all shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>
                {currentStepIndex === TOUR_STEPS.length - 1
                  ? 'Selesai & Mulai Belanja'
                  : 'Lanjut (Next)'}
              </span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
