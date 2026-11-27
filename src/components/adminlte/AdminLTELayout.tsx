import React, { useState } from 'react';
import { useLocation, Navigate, Outlet } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { AdminLTENavbar } from './AdminLTENavbar';
import { AdminLTESidebar } from './AdminLTESidebar';
import { AdminLTEContentHeader } from './AdminLTEContentHeader';
import { AdminLTEFooter } from './AdminLTEFooter';
import { SubscriptionPaywallModal } from './SubscriptionPaywallModal';
import { WelcomeCelebrationModal } from './WelcomeCelebrationModal';

export const AdminLTELayout: React.FC = () => {
  const { currentUser } = useCoffee();
  const location = useLocation();
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.innerWidth < 1024;
    }
    return false;
  });

  // Auto-collapse on small screens when route changes
  React.useEffect(() => {
    if (typeof window !== 'undefined' && window.innerWidth < 768) {
      setIsSidebarCollapsed(true);
    }
  }, [location.pathname]);

  // Auth Guard: if not authenticated, redirect to login
  if (!currentUser) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  const userRole = currentUser.role;

  const getHomePath = () => {
    switch (userRole) {
      case 'super_admin':
        return '/admin/superadmin/packages';
      case 'roaster':
        return '/admin/roaster/inventory';
      case 'gudang':
        return '/admin/gudang/inventory';
      case 'pengolah':
        return '/admin/pengolah';
      case 'cafe':
        return '/admin/cafe';
      case 'petani':
        return '/admin/petani';
      case 'ict':
        return '/admin/ict';
      case 'verifikator':
        return '/admin/verifikator';
      default:
        return '/admin/overview';
    }
  };

  const isPathAllowed = (path: string): boolean => {
    if (!userRole || userRole === 'admin_kelompok_tani' || userRole === 'super_admin') return true;
    if (path.startsWith('/admin/transaksi')) return true;
    if (path.startsWith('/admin/forms') || path.includes('/blanko')) return true;
    if (path.startsWith('/admin/seller')) {
      return ['roaster', 'gudang', 'pengolah', 'petani', 'admin_kelompok_tani'].includes(userRole);
    }
    switch (userRole) {
      case 'roaster':
        return path.startsWith('/admin/roaster');
      case 'gudang':
        return path.startsWith('/admin/gudang');
      case 'pengolah':
        return path.startsWith('/admin/pengolah');
      case 'cafe':
        return path.startsWith('/admin/cafe');
      case 'petani':
        return (
          path.startsWith('/admin/petani') ||
          path.startsWith('/admin/kebun') ||
          path.startsWith('/admin/panen') ||
          path.startsWith('/admin/ledger')
        );
      case 'ict':
        return (
          path.startsWith('/admin/ict') ||
          path.startsWith('/admin/petani') ||
          path.startsWith('/admin/kebun') ||
          path.startsWith('/admin/panen')
        );
      case 'verifikator':
        return (
          path.startsWith('/admin/verifikator') ||
          path.startsWith('/admin/ict')
        );
      default:
        return false;
    }
  };

  // Route security guard: non-admin attempting to access unauthorized page or root /admin
  if (!isPathAllowed(location.pathname)) {
    return <Navigate to={getHomePath()} replace />;
  }

  // Derive page header based on current route and role
  const getHeaderMeta = () => {
    const path = location.pathname;

    const rootBreadcrumb = (() => {
      switch (userRole) {
        case 'super_admin':
          return { label: 'CircularTrace SaaS HQ', path: '/admin/superadmin/packages' };
        case 'roaster':
          return { label: currentUser.organization || 'Roastery ERP', path: '/admin/roaster/inventory' };
        case 'gudang':
          return { label: currentUser.organization || 'Gudang & Silo QA', path: '/admin/gudang/inventory' };
        case 'pengolah':
          return { label: currentUser.organization || 'Stasiun Pengolah', path: '/admin/pengolah' };
        case 'cafe':
          return { label: currentUser.organization || 'Coffee Shop & Cafe', path: '/admin/cafe' };
        case 'petani':
          return { label: 'Layanan Petani Kopi', path: '/admin/petani' };
        case 'ict':
          return { label: 'Pusat Verifikasi ICT', path: '/admin/ict' };
        case 'verifikator':
          return { label: 'Lembar Kerja Verifikasi Mutu', path: '/admin/verifikator' };
        default:
          return { label: 'Kelompok Tani', path: '/admin/overview' };
      }
    })();

    // 1. Roaster Sub-pages
    if (path.includes('/admin/roaster/inventory')) {
      return {
        title: 'Stok & Inventaris Roasted Beans',
        subtitle: 'Manajemen batch sangrai komoditas, kemasan ritel, stok siap deploy ke marketplace.',
        breadcrumbs: [rootBreadcrumb, { label: 'Stok Roasted Beans' }],
      };
    }
    if (path.includes('/admin/roaster/production')) {
      return {
        title: 'Jadwal Produksi & Simulator Roasting Artisan',
        subtitle: 'Kurva sangrai real-time (BT, ET, RoR), pemantauan First Crack, dan kontrol profil mesin.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Stok Beans', path: '/admin/roaster/inventory' },
          { label: 'Jadwal & Artisan Roasting' },
        ],
      };
    }
    if (path.includes('/admin/roaster/cupping')) {
      return {
        title: 'Lembar Kerja Cupping SCA (Specialty Coffee Association)',
        subtitle: 'Evaluasi 10 atribut sensori, spider radar chart, deteksi defect, dan opsi rilis produk.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Stok Beans', path: '/admin/roaster/inventory' },
          { label: 'Lembar Kerja Cupping SCA' },
        ],
      };
    }
    if (path.includes('/admin/roaster/pengadaan')) {
      return {
        title: 'Pengadaan Green Beans (Inbound Sourcing)',
        subtitle: 'Pemesanan biji hijau dari gudang penyimpanan dengan identitas traceability lot transparan.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Stok Beans', path: '/admin/roaster/inventory' },
          { label: 'Pengadaan Green Beans' },
        ],
      };
    }
    if (path.startsWith('/admin/roaster')) {
      return {
        title: 'Layanan Roastery Artisan (ERP)',
        subtitle: 'Siklus lengkap sangrai artisan, uji citarasa SCA, dan distribusi ritel.',
        breadcrumbs: [rootBreadcrumb],
      };
    }

    // 2. Gudang Sub-pages
    if (path.includes('/admin/gudang/inventory')) {
      return {
        title: 'Stok & Gudang Green Bean Sementara',
        subtitle: 'Penyimpanan hermetik, klimatisasi suhu/kelembaban, dan antrian lot sebelum sortir.',
        breadcrumbs: [rootBreadcrumb, { label: 'Stok & Gudang Sementara' }],
      };
    }
    if (path.includes('/admin/gudang/pengadaan')) {
      return {
        title: 'Pengadaan Green Bean dari Stasiun Olah',
        subtitle: 'Penerimaan inbound green bean dari stasiun wet mill untuk sortasi dan standarisasi gudang.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Stok Gudang', path: '/admin/gudang/inventory' },
          { label: 'Pengadaan Green Bean' },
        ],
      };
    }
    if (path.includes('/admin/gudang/sortir')) {
      return {
        title: 'Lembar Kerja Sortasi Mutu Fisik Green Bean',
        subtitle: 'Pemeriksaan kadar air, visual defect triase, penentuan grade, dan opsi deploy marketplace.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Stok Gudang', path: '/admin/gudang/inventory' },
          { label: 'Lembar Kerja Sortir' },
        ],
      };
    }
    if (path.startsWith('/admin/gudang')) {
      return {
        title: 'Layanan Gudang & Silo Klimatisasi (QA)',
        subtitle: 'Penyimpanan terstandar, sortasi mutu fisik, dan sertifikasi grade komoditas.',
        breadcrumbs: [rootBreadcrumb],
      };
    }

    // 3. Cafe Sub-pages
    if (path.startsWith('/admin/cafe')) {
      return {
        title: 'Layanan Coffee Shop & Barista Station',
        subtitle: 'Penyajian seduhan espresso / manual brew, manajemen stok beans, resep seduh, dan cetak QR Farm-to-Cup.',
        breadcrumbs: [rootBreadcrumb],
      };
    }

    // 4. Pengolah Sub-pages
    if (path.startsWith('/admin/pengolah')) {
      return {
        title: 'Layanan Stasiun Pengolah (Wet Mill)',
        subtitle: 'Penerimaan ceri panen, 7 metode proses fermentasi, hulling, dan rilis green bean terverifikasi.',
        breadcrumbs: [rootBreadcrumb],
      };
    }

    // 5. Admin Kelompok Tani / Petani / ICT Sub-pages
    if (path.includes('/admin/users')) {
      return {
        title: 'Master Users & Penugasan Layanan',
        subtitle: 'Daftar staf/anggota kelompok tani dengan aturan 1 akun = 1 layanan operasional.',
        breadcrumbs: [rootBreadcrumb, { label: 'Master Users' }],
      };
    }
    if (path.includes('/admin/petani/tambah')) {
      return {
        title: 'Pendaftaran Petani Baru',
        subtitle: 'Pencatatan biodata lengkap, 16 digit NIK, nomor KTA, dan upload foto profil.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Master Petani', path: '/admin/petani' },
          { label: 'Pendaftaran Petani' },
        ],
      };
    }
    if (path.includes('/admin/petani/edit')) {
      return {
        title: 'Edit Data Petani Anggota',
        subtitle: 'Perbarui nomor telepon, alamat domisili, data garapan, dan sertifikasi petani.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Master Petani', path: '/admin/petani' },
          { label: 'Edit Petani' },
        ],
      };
    }
    if (path.startsWith('/admin/petani')) {
      return {
        title: 'Data Master Petani Anggota',
        subtitle: 'Daftar resmi petani anggota kelompok tani, nomor KTA, dan verifikasi profil.',
        breadcrumbs: [rootBreadcrumb, { label: 'Data Master Petani' }],
      };
    }
    if (path.includes('/admin/kebun/tambah')) {
      return {
        title: 'Pendaftaran Lahan Kebun Baru',
        subtitle: 'Pemetaan koordinat GPS actual, elevasi ketinggian, dan batas patok poligon BPN.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Master Kebun', path: '/admin/kebun' },
          { label: 'Tambah Lahan' },
        ],
      };
    }
    if (path.includes('/admin/kebun/edit')) {
      return {
        title: 'Edit Lahan Kebun Kopi',
        subtitle: 'Perbarui data varietas, luas lahan, jumlah pohon, dan titik patok sudut.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Master Kebun', path: '/admin/kebun' },
          { label: 'Edit Lahan' },
        ],
      };
    }
    if (path.includes('/admin/kebun/peta')) {
      return {
        title: 'Peta Geolokasi & Poligon EUDR',
        subtitle: 'Visualisasi peta batas lahan, titik patok sudut, dan verifikasi Deforestation-Free.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Master Kebun', path: '/admin/kebun' },
          { label: 'Peta Geolokasi' },
        ],
      };
    }
    if (path.startsWith('/admin/kebun')) {
      return {
        title: 'Data Master Lahan & Kebun Kopi',
        subtitle: 'Daftar blok lahan kebun terdaftar, elevasi mdpl, luas hektar, dan sertifikasi EUDR.',
        breadcrumbs: [rootBreadcrumb, { label: 'Data Master Kebun' }],
      };
    }
    if (path.includes('/admin/panen/tambah')) {
      return {
        title: 'Pencatatan Panen Ceri Baru',
        subtitle: 'Wizard 3 langkah: Petani pemilik, blok kebun, timbangan, brix, dan opsi distribusi.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Hasil Panen', path: '/admin/panen' },
          { label: 'Catat Panen' },
        ],
      };
    }
    if (path.includes('/admin/panen/detail')) {
      return {
        title: 'Lembar Detail Traceability Lot Panen',
        subtitle: 'Paspor digital komoditas, alur 4 tahap, sertifikasi EUDR, dan barcode karung.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Data Hasil Panen', path: '/admin/panen' },
          { label: 'Detail Lot' },
        ],
      };
    }
    if (path.startsWith('/admin/panen')) {
      return {
        title: 'Data Hasil Panen Ceri Kopi',
        subtitle: 'Daftar lot ceri masuk, uji kematangan brix, dan opsi rilis marketplace vs gudang petani.',
        breadcrumbs: [rootBreadcrumb, { label: 'Data Hasil Panen' }],
      };
    }
    if (path.startsWith('/admin/ledger')) {
      return {
        title: 'Buku Kas & Ledger Petani',
        subtitle: 'Rekapitulasi transaksi penjualan ceri kopi dari petani ke stasiun pengolah dan pembeli.',
        breadcrumbs: [rootBreadcrumb, { label: 'Buku Kas & Ledger' }],
      };
    }
    if (path.includes('/admin/ict/ct-dashboard')) {
      return {
        title: 'Audit & Sertifikasi Kesiapan Kebun (CT Index Engine)',
        subtitle: 'Pengukuran terpadu CT-4CI (108 Checkpoints 4C), CT-CCI Sirkularitas, dan CT-SDI Keberlanjutan.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Pusat Verifikasi ICT', path: '/admin/ict' },
          { label: 'Sertifikasi Kebun (CT Index)' },
        ],
      };
    }
    if (path.includes('/admin/ict/audit')) {
      return {
        title: 'Lembar Kerja Audit ICS (Internal Control System)',
        subtitle: 'Dokumen inspeksi dan checklist kepatuhan standar EUDR Deforestation-Free, SNI Organik, & Mutu Ceri.',
        breadcrumbs: [
          rootBreadcrumb,
          { label: 'Pusat Verifikasi ICT', path: '/admin/ict' },
          { label: 'Lembar Kerja Audit ICS' },
        ],
      };
    }
    if (path.startsWith('/admin/verifikator')) {
      return {
        title: 'Lembar Kerja Verifikasi Mutu & Auditor CT',
        subtitle: 'Pusat verifikasi berjenjang multi-tahap: Tab master data petani & kebun EUDR, stasiun pengolah, gudang QA, uji sensori cupping roaster, dan cafe.',
        breadcrumbs: [rootBreadcrumb, { label: 'Lembar Kerja Verifikasi' }],
      };
    }
    if (path.startsWith('/admin/ict')) {
      return {
        title: 'Pusat Audit & Verifikasi ICT Kelompok Tani',
        subtitle: 'Verifikasi identitas petani, validasi koordinat GPS & patok EUDR kebun, serta uji standar mutu ceri.',
        breadcrumbs: [rootBreadcrumb, { label: 'Verifikasi ICT' }],
      };
    }

    if (path.startsWith('/admin/transaksi')) {
      return {
        title: 'Buku Transaksi & Rekapitulasi Marketplace',
        subtitle: 'Buku besar pencatatan riwayat transaksi dan rekapitulasi penjualan yang berhasil diselesaikan di marketplace kopi.',
        breadcrumbs: [rootBreadcrumb, { label: 'Buku Transaksi' }],
      };
    }
    if (path.startsWith('/admin/seller')) {
      return {
        title: 'Seller Panel & Monitoring Penjualan',
        subtitle: 'Pusat manajemen pesanan marketplace, margin laba kotor, dan integrasi lot terverifikasi.',
        breadcrumbs: [rootBreadcrumb, { label: 'Seller Panel' }],
      };
    }
    if (path.startsWith('/admin/forms')) {
      return {
        title: 'Formulir Blanko Fisik Lapangan (A4)',
        subtitle: 'Unduh dan cetak formulir standar A4 untuk pencatatan manual petani, pengolah, gudang, roastery, dan audit ICS.',
        breadcrumbs: [rootBreadcrumb, { label: 'Blanko Formulir (A4)' }],
      };
    }
    if (path.startsWith('/admin/superadmin')) {
      return {
        title: 'Super Admin - Manajemen Layanan SaaS & Billing',
        subtitle: 'Konfigurasi paket tiering langganan, fitur per service, kuota, dan harga jual Circular Coffee Trace.',
        breadcrumbs: [rootBreadcrumb, { label: 'Paket & Layanan' }],
      };
    }

    // Default: Overview for Admin Kelompok Tani
    return {
      title: 'Control Tower Kelompok Tani',
      subtitle: `Selamat datang di pusat kendali operasional ${currentUser.organization || 'Kelompok Tani'}.`,
      breadcrumbs: [
        { label: 'Kelompok Tani', path: '/admin/overview' },
        { label: 'Dashboard Control Tower' },
      ],
    };
  };

  const sanitizeBreadcrumbs = (items: { label: string; path?: string }[]) => {
    const sanitized: { label: string; path?: string }[] = [];
    for (const item of items) {
      if (!item || !item.label) continue;
      const prev = sanitized[sanitized.length - 1];
      if (
        prev &&
        ((prev.path && item.path && prev.path === item.path) ||
          prev.label.trim().toLowerCase() === item.label.trim().toLowerCase())
      ) {
        continue;
      }
      sanitized.push(item);
    }
    return sanitized;
  };

  const rawHeaderMeta = getHeaderMeta();
  const headerMeta = {
    ...rawHeaderMeta,
    breadcrumbs: sanitizeBreadcrumbs(rawHeaderMeta.breadcrumbs),
  };

  const isPaidRole = ['admin_kelompok_tani', 'gudang', 'roaster', 'cafe'].includes(userRole);
  const hasJustPaid = typeof window !== 'undefined' && sessionStorage.getItem('cct_show_welcome_modal') === 'true';
  const isPendingPayment = !hasJustPaid && isPaidRole && currentUser.subscriptionStatus === 'pending_payment';

  const [showWelcomeModal, setShowWelcomeModal] = useState(() => {
    if (typeof window !== 'undefined') {
      return sessionStorage.getItem('cct_show_welcome_modal') === 'true';
    }
    return false;
  });

  const handleCloseWelcomeModal = () => {
    setShowWelcomeModal(false);
    try {
      sessionStorage.removeItem('cct_show_welcome_modal');
    } catch (_) {}
  };

  return (
    <div className="min-h-screen flex bg-[#FAF7F2] font-sans antialiased text-stone-900 print:bg-white print:block">
      {/* 0. Subscription Paywall Guard (Active if pending payment) */}
      {isPendingPayment && <SubscriptionPaywallModal />}

      {/* 0.1 Welcome Celebration Modal on First Payment / Activation */}
      {showWelcomeModal && !isPendingPayment && (
        <WelcomeCelebrationModal user={currentUser} onClose={handleCloseWelcomeModal} />
      )}

      {/* 1. AdminLTE Dark Sidebar (Hidden on Print) */}
      <div className="print:hidden no-print self-start sticky top-0 h-screen max-h-screen z-40 shrink-0">
        <AdminLTESidebar isCollapsed={isSidebarCollapsed} />
      </div>

      {/* 2. Main Column: Navbar + Content + Footer */}
      <div className="flex-1 flex flex-col min-w-0 print:w-full print:max-w-none print:p-0 print:m-0 print:block">
        {/* Top Navbar (Hidden on Print) */}
        <div className="print:hidden no-print">
          <AdminLTENavbar
            onToggleSidebar={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
            isSidebarCollapsed={isSidebarCollapsed}
          />
        </div>

        {/* Dynamic Content Header & Breadcrumbs (Hidden on Print) */}
        <div className="print:hidden no-print">
          <AdminLTEContentHeader
            title={headerMeta.title}
            subtitle={headerMeta.subtitle}
            breadcrumbs={headerMeta.breadcrumbs}
            homePath={getHomePath()}
          />
        </div>

        {/* Content Body (AdminLTE #f4f6f9 Canvas) */}
        <main className="flex-1 p-4 sm:p-6 max-w-7xl w-full mx-auto print:p-0 print:m-0 print:max-w-none print:w-full print:bg-white print:block">
          <Outlet />
        </main>

        {/* Bottom Footer (Hidden on Print) */}
        <div className="print:hidden no-print">
          <AdminLTEFooter />
        </div>
      </div>
    </div>
  );
};

export default AdminLTELayout;
