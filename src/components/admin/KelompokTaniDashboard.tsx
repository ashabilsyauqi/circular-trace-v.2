import React from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import {
  Building2,
  Users,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  ArrowRight,
  TrendingUp,
  Package,
  Layers,
  Sparkles,
  QrCode,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowUpRight,
  Activity,
  UserPlus,
  Printer,
  Lock,
  Globe,
} from 'lucide-react';
import { OperationalService } from '../../types/coffee';

export const KelompokTaniDashboard: React.FC = () => {
  const {
    currentUser,
    users,
    farmerLots,
    coffeeFarms,
    processingBatches,
    processedLots,
    warehouseLots,
    roastedLots,
    cafeInventory,
    cafeProducts,
    transactions,
  } = useCoffee();
  const navigate = useNavigate();

  // Metrics calculations
  const totalFarmers = users.filter((u) => u.assignedService === 'petani' || u.role === 'petani').length;
  const totalProcessors = users.filter((u) => u.assignedService === 'pengolah' || u.role === 'pengolah').length;
  const totalIcsOfficers = users.filter((u) => u.role === 'ict' || (u.assignedService as unknown) === 'ict').length;
  const totalActiveStaff = totalFarmers + totalProcessors + totalIcsOfficers;

  const totalCherryKg = farmerLots.reduce((acc, l) => acc + (l.totalWeightKg || 0), 0);
  const totalGreenBeanKg = processedLots.reduce((acc, l) => acc + (l.greenBeanWeightKg || 0), 0);
  const totalWarehouseKg = warehouseLots.reduce((acc, l) => acc + (l.weightKg || 0), 0);
  const totalRoastedKg = Math.round(
    roastedLots.reduce((acc, l) => acc + ((l.totalPacks * (l.packageWeightGrams || 1000)) / 1000 || 0), 0)
  );

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* 1. AdminLTE Hero Card: Identitas Kelompok Tani */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 border-t-4 border-t-emerald-600 p-5 sm:p-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-950 border border-emerald-300">
                Pusat Kendali Kelompok Tani
              </span>
              <span className="text-xs text-stone-500 font-medium">SK Gapoktan: 521.1/KP-2026</span>
            </div>
            <h2 className="text-2xl font-black text-stone-900 tracking-tight">
              {currentUser?.organization || 'Gapoktan Kopi Mandiri Nusantara'}
            </h2>
            <p className="text-xs text-stone-500 max-w-2xl leading-relaxed">
              Lingkup inti Kelompok Tani terdiri dari <strong>1. Petani</strong> (memproduksi ceri kopi segar), <strong>2. Pengolah</strong> (mengolah ceri menjadi green bean), dan <strong>3. Petugas ICS</strong> (audit internal kebun, poligon EUDR, &amp; mutu panen ceri). Ceri dipasarkan secara eksklusif bagi sesama kelompok tani &amp; pengolah, sedangkan Green Bean dipasarkan secara global di marketplace.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin/forms"
              className="px-3.5 py-2 rounded-md bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-xs"
              title="Cetak & Download Blanko Formulir Fisik Lapangan (A4)"
            >
              <Printer className="w-4 h-4 text-amber-600" />
              <span>Blanko Formulir (A4)</span>
            </Link>

            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-md bg-[#343a40] hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Kelola Master Users</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                {totalActiveStaff}
              </span>
            </Link>
          </div>
        </div>

        {/* 1.1 Alur Rantai Nilai Eksklusif vs Global Scope Kelompok Tani */}
        <div className="mt-5 pt-4 border-t border-stone-200">
          <div className="text-[11px] font-bold uppercase tracking-wider text-stone-400 mb-2">
            Struktur Rantai Pasok Lingkup Kelompok Tani (3 Pilar Inti):
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {/* Pilar 1: Petani -> Ceri */}
            <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-emerald-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-emerald-950">1. Petani &bull; Ceri Kopi</span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-amber-200 text-amber-900 border border-amber-300 flex items-center gap-1">
                    <Lock className="w-2.5 h-2.5" />
                    <span>Eksklusif KT</span>
                  </span>
                </div>
                <p className="text-[11px] text-emerald-800 mt-0.5 leading-relaxed">
                  Panen ceri petik merah matang. Ceri bersifat <strong>sangat eksklusif</strong> bagi sesama Kelompok Tani &amp; Pengolah.
                </p>
              </div>
            </div>

            {/* Pilar 2: Pengolah -> Green Bean */}
            <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-amber-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <Cog className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-amber-950">2. Pengolah &bull; Green Bean</span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-blue-100 text-blue-900 border border-blue-300 flex items-center gap-1">
                    <Globe className="w-2.5 h-2.5" />
                    <span>Pasar Global</span>
                  </span>
                </div>
                <p className="text-[11px] text-amber-800 mt-0.5 leading-relaxed">
                  Menyerap ceri petani &amp; memprosesnya 7 metode menjadi <strong>Green Bean</strong> yang <strong>dipasarkan global</strong>.
                </p>
              </div>
            </div>

            {/* Pilar 3: Petugas ICS -> Audit Mutu & EUDR */}
            <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-start gap-3">
              <div className="w-8 h-8 rounded-md bg-blue-600 text-white flex items-center justify-center shrink-0 mt-0.5">
                <ShieldCheck className="w-4 h-4" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-bold text-blue-950">3. Petugas ICS &bull; Verifikasi</span>
                  <span className="px-2 py-0.2 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-900 border border-emerald-300 flex items-center gap-1">
                    <ShieldCheck className="w-2.5 h-2.5" />
                    <span>Audit Internal</span>
                  </span>
                </div>
                <p className="text-[11px] text-blue-800 mt-0.5 leading-relaxed">
                  Audit internal data petani (NIK/KTA), peta poligon kebun EUDR, &amp; validasi mutu brix panen ceri.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. AdminLTE Classic Small-Boxes (Scope Kelompok Tani: Petani, Pengolah & Saluran Distribusi) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-bold text-stone-800 uppercase tracking-wider flex items-center gap-2">
            <Activity className="w-4 h-4 text-emerald-600" />
            <span>Scope Operasional Kelompok Tani</span>
          </h3>
          <span className="text-[11px] text-stone-500">3 Pilar Inti: Petani (Ceri), Pengolah (Green Bean), &amp; Petugas ICS (Audit)</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {/* Box 1: Petani (bg-emerald-600) */}
          <div className="bg-emerald-600 rounded-lg shadow-sm text-white overflow-hidden relative flex flex-col justify-between">
            <div className="p-4 relative z-10">
              <h4 className="text-2xl font-black tracking-tight">{totalCherryKg.toLocaleString()} <span className="text-xs font-normal">kg</span></h4>
              <p className="text-xs text-emerald-100 font-semibold mt-0.5">1. Layanan Petani (Hulu Ceri)</p>
              <div className="text-[10px] text-emerald-200 mt-2 font-medium">
                {totalFarmers} Petani Anggota • {coffeeFarms.length} Lahan Kebun
              </div>
              <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-emerald-800/80 text-[9px] text-amber-200 font-bold">
                <Lock className="w-2.5 h-2.5" />
                <span>Audience: Eksklusif Kelompok Tani &amp; Pengolah</span>
              </div>
            </div>
            <Sprout className="w-16 h-16 text-white/20 absolute top-2 right-2 z-0 pointer-events-none" />
            <Link
              to="/admin/petani"
              className="bg-black/15 hover:bg-black/25 text-white/95 text-xs py-1.5 px-4 flex items-center justify-between transition-colors z-10 font-bold"
            >
              <span>Buka Layanan Petani</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Box 2: Pengolah (bg-amber-600) */}
          <div className="bg-amber-600 rounded-lg shadow-sm text-white overflow-hidden relative flex flex-col justify-between">
            <div className="p-4 relative z-10">
              <h4 className="text-2xl font-black tracking-tight">{totalGreenBeanKg.toLocaleString()} <span className="text-xs font-normal">kg</span></h4>
              <p className="text-xs text-amber-100 font-semibold mt-0.5">2. Stasiun Pengolah (Wet Mill)</p>
              <div className="text-[10px] text-amber-200 mt-2 font-medium">
                {totalProcessors} Operator • {processingBatches.length} Batch Olah (7 Metode)
              </div>
              <div className="mt-1 inline-flex items-center gap-1 px-1.5 py-0.5 rounded bg-amber-800/80 text-[9px] text-blue-100 font-bold">
                <Globe className="w-2.5 h-2.5" />
                <span>Green Bean: Pasar Global Terbuka</span>
              </div>
            </div>
            <Cog className="w-16 h-16 text-white/20 absolute top-2 right-2 z-0 pointer-events-none" />
            <Link
              to="/admin/pengolah"
              className="bg-black/15 hover:bg-black/25 text-white/95 text-xs py-1.5 px-4 flex items-center justify-between transition-colors z-10 font-bold"
            >
              <span>Buka Stasiun Pengolah</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          {/* Box 3: Marketplace (bg-blue-600) */}
          <div className="bg-blue-600 rounded-lg shadow-sm text-white overflow-hidden relative flex flex-col justify-between">
            <div className="p-4 relative z-10">
              <h4 className="text-2xl font-black tracking-tight">
                {farmerLots.filter((l) => l.isReleasedToMarketplace ?? true).length +
                  processedLots.filter((l) => l.availableWeightKg > 0).length}{' '}
                <span className="text-xs font-normal">Lot Live</span>
              </h4>
              <p className="text-xs text-blue-100 font-semibold mt-0.5">3. Rilis Marketplace Terpadu</p>
              <div className="text-[10px] text-blue-200 mt-2 font-medium">
                Ceri (Eksklusif KT) &bull; Green Bean (Global)
              </div>
            </div>
            <Package className="w-16 h-16 text-white/20 absolute top-2 right-2 z-0 pointer-events-none" />
            <a
              href="https://marketplace.circulartrace.id/"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-black/15 hover:bg-black/25 text-white/95 text-xs py-1.5 px-4 flex items-center justify-between transition-colors z-10 font-bold"
            >
              <span>Buka Marketplace</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </a>
          </div>

          {/* Box 4: Ledger & Transaksi (bg-stone-800) */}
          <div className="bg-stone-800 rounded-lg shadow-sm text-white overflow-hidden relative flex flex-col justify-between">
            <div className="p-4 relative z-10">
              <h4 className="text-2xl font-black tracking-tight font-mono">
                Rp{' '}
                {Math.round(
                  transactions.reduce((acc, t) => acc + (t.totalAmount || 0), 0) / 1000
                ).toLocaleString()}{' '}
                <span className="text-xs font-normal">rb</span>
              </h4>
              <p className="text-xs text-stone-300 font-semibold mt-0.5">4. Buku Kas &amp; Ledger</p>
              <div className="text-[10px] text-stone-400 mt-2 font-medium">
                {transactions.length} Mutasi Transaksi Rantai Pasok
              </div>
            </div>
            <TrendingUp className="w-16 h-16 text-white/20 absolute top-2 right-2 z-0 pointer-events-none" />
            <Link
              to="/admin/transaksi"
              className="bg-black/20 hover:bg-black/35 text-white/95 text-xs py-1.5 px-4 flex items-center justify-between transition-colors z-10 font-bold"
            >
              <span>Buka Ledger Transaksi</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Dua Kolom: Distribusi Penugasan Akun & Alur Rantai Nilai */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Kolom 1 (2 span): Distribusi Penugasan Akun */}
        <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border border-stone-200 border-t-2 border-t-emerald-600 p-5">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-4">
            <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
              <Users className="w-4 h-4 text-emerald-700" />
              <span>Distribusi Staf Kelompok Tani (3 Pilar Layanan)</span>
            </h3>
            <Link
              to="/admin/users"
              className="text-xs font-bold text-emerald-800 hover:text-emerald-900 flex items-center gap-1"
            >
              <span>Kelola Akun</span>
              <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {[
              {
                label: 'Layanan 1: Petani (Kebun & Panen Ceri)',
                count: totalFarmers,
                desc: 'Petani anggota pengelola plot lahan kebun kopi & panen ceri',
                color: 'bg-emerald-500',
                path: '/admin/petani',
              },
              {
                label: 'Layanan 2: Pengolah (Wet Mill & Green Bean)',
                count: totalProcessors,
                desc: 'Operator stasiun fermentasi, penjemuran, dan hulling 7 metode',
                color: 'bg-amber-500',
                path: '/admin/pengolah',
              },
              {
                label: 'Layanan 3: Petugas ICS (Internal Control System)',
                count: totalIcsOfficers,
                desc: 'Auditor internal verifikasi NIK/KTA petani, poligon EUDR, & inspeksi mutu ceri',
                color: 'bg-blue-500',
                path: '/admin/ict',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="flex items-center justify-between p-3.5 rounded-lg bg-stone-50 border border-stone-200/80 hover:bg-stone-100 transition-colors"
              >
                <div className="flex items-center gap-3">
                  <div className={`w-3.5 h-3.5 rounded-full ${item.color} shrink-0`} />
                  <div>
                    <Link
                      to={item.path}
                      className="text-xs font-bold text-stone-900 hover:text-emerald-700 block"
                    >
                      {item.label}
                    </Link>
                    <span className="text-[11px] text-stone-500 block">{item.desc}</span>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-xs font-black text-stone-900 bg-white px-2.5 py-1 rounded border border-stone-200">
                    {item.count} Operator
                  </span>
                  <Link to={item.path} className="text-stone-400 hover:text-emerald-700">
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Kolom 2 (1 span): Kartu Cepat Transaksi & Status */}
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 border-t-2 border-t-emerald-500 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100 mb-3">
              <h3 className="font-bold text-sm text-stone-900 flex items-center gap-2">
                <TrendingUp className="w-4 h-4 text-emerald-600" />
                <span>Status Keterhubungan</span>
              </h3>
            </div>

            <p className="text-xs text-stone-500 leading-relaxed mb-4">
              Semua komoditas tercatat dalam buku besar rantai pasok dengan validasi kriptografis terdesentralisasi.
            </p>

            <div className="space-y-2 text-xs">
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">Total Transaksi:</span>
                <span className="font-bold text-stone-900">{transactions.length} Mutasi</span>
              </div>
              <div className="flex justify-between py-1.5 border-b border-stone-100">
                <span className="text-stone-500">QR Traceability:</span>
                <span className="font-bold text-emerald-700">Aktif &amp; Terbaca</span>
              </div>
              <div className="flex justify-between py-1.5">
                <span className="text-stone-500">Petugas ICS:</span>
                <span className="font-bold text-blue-700">{totalIcsOfficers} Personil Internal</span>
              </div>
            </div>
          </div>

          <Link
            to="/admin/transaksi"
            className="w-full mt-4 py-2 px-3 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-xs text-center block transition-colors border border-stone-200"
          >
            Buka Riwayat Transaksi Lengkap &rarr;
          </Link>
        </div>
      </div>
    </div>
  );
};

export default KelompokTaniDashboard;
