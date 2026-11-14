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
  const totalWarehouseStaff = users.filter((u) => u.assignedService === 'gudang' || u.role === 'gudang').length;
  const totalRoasters = users.filter((u) => u.assignedService === 'roaster' || u.role === 'roaster').length;
  const totalBaristas = users.filter((u) => u.assignedService === 'cafe' || u.role === 'cafe').length;
  const totalActiveStaff = totalFarmers + totalProcessors + totalWarehouseStaff + totalRoasters + totalBaristas;

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
              Supervisi terpadu scope hulu &amp; pengolahan kopi kelompok tani: Kebun &amp; Panen Ceri Petani &rarr; Stasiun Pengolah Wet Mill Green Bean &rarr; Rilis ke Marketplace.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <Link
              to="/admin/users"
              className="px-4 py-2 rounded-md bg-[#343a40] hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-2 transition-colors shadow-xs"
            >
              <Users className="w-4 h-4 text-emerald-400" />
              <span>Kelola Master Users</span>
              <span className="px-1.5 py-0.2 rounded-full bg-emerald-500 text-white font-bold text-[10px]">
                {totalFarmers + totalProcessors}
              </span>
            </Link>
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
          <span className="text-[11px] text-stone-500">2 Unit Layanan + Saluran Distribusi Pasar</span>
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
              <p className="text-xs text-blue-100 font-semibold mt-0.5">3. Rilis Marketplace</p>
              <div className="text-[10px] text-blue-200 mt-2 font-medium">
                Produk Ceri &amp; Green Bean Kelompok Tani
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
              to="/transactions"
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
              <span>Distribusi Staf Kelompok Tani (Scope Petani &amp; Pengolah)</span>
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
                desc: 'Petani anggota pengelola plot lahan kebun kopi',
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
                <span className="text-stone-500">Role Verifikator:</span>
                <span className="font-semibold text-stone-400 italic">Non-aktif Sementara</span>
              </div>
            </div>
          </div>

          <Link
            to="/transactions"
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
