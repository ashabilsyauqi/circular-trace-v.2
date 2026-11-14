import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { WarehouseLot, WarehouseGradeTier } from '../../../types/coffee';
import {
  Warehouse,
  ShoppingCart,
  ClipboardCheck,
  CheckCircle2,
  Clock,
  Rocket,
  ArrowRight,
  Search,
  Filter,
  Layers,
  Thermometer,
  Droplets,
  QrCode,
  Tag,
  ShieldCheck,
  Sparkles,
  TrendingUp,
  Store,
  ExternalLink,
  Crown,
  Award,
} from 'lucide-react';
import { WarehouseBarcodeModal } from '../../../components/WarehouseBarcodeModal';
import { GRADE_TIERS_CONFIG } from '../../../components/WarehouseView';

export const WarehouseInventoryPage: React.FC = () => {
  const {
    warehouseLots,
    currentUser,
    toggleReleaseWarehouseLotToMarketplace,
  } = useCoffee();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'temporary' | 'ready_deploy' | 'released' | 'all'>('temporary');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedGrade, setSelectedGrade] = useState<string>('all');
  const [barcodeLot, setBarcodeLot] = useState<WarehouseLot | null>(null);

  // Filter lots belonging to current warehouse operator or show all if admin
  const userWarehouseLots = warehouseLots.filter(
    (lot) => !currentUser || currentUser.role === 'admin_kelompok_tani' || lot.warehouseId === currentUser.id
  );

  // Segregated categories
  const temporaryLots = userWarehouseLots.filter(
    (lot) => lot.sortingStatus === 'pending_sorting'
  );
  const readyDeployLots = userWarehouseLots.filter(
    (lot) => lot.sortingStatus === 'sorted' && lot.isReleasedToMarketplace === false && lot.availableWeightKg > 0
  );
  const releasedLots = userWarehouseLots.filter(
    (lot) => lot.sortingStatus === 'sorted' && lot.isReleasedToMarketplace === true && lot.availableWeightKg > 0
  );

  // Tab filtered lots
  const tabFilteredLots = userWarehouseLots.filter((lot) => {
    if (activeTab === 'temporary') return lot.sortingStatus === 'pending_sorting';
    if (activeTab === 'ready_deploy') return lot.sortingStatus === 'sorted' && lot.isReleasedToMarketplace === false && lot.availableWeightKg > 0;
    if (activeTab === 'released') return lot.sortingStatus === 'sorted' && lot.isReleasedToMarketplace === true && lot.availableWeightKg > 0;
    return true;
  });

  // Search & Grade filter
  const displayedLots = tabFilteredLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.sourceProcessorName.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q) ||
      lot.origin.toLowerCase().includes(q) ||
      lot.storageLocation.toLowerCase().includes(q);

    const matchGrade = selectedGrade === 'all' || lot.gradeTier === selectedGrade;
    return matchSearch && matchGrade;
  });

  // Calculate Metrics
  const totalWeightKg = userWarehouseLots.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);
  const temporaryWeightKg = temporaryLots.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);
  const readyDeployWeightKg = readyDeployLots.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);
  const releasedWeightKg = releasedLots.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. AdminLTE Content Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link to="/admin/overview" className="hover:text-amber-600">Pusat Kendali</Link>
            <span>/</span>
            <span>Layanan Gudang</span>
            <span>/</span>
            <span className="font-bold text-stone-800">Data Master Stok &amp; Gudang Sementara</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Warehouse className="w-7 h-7 text-stone-700" />
            <span>Inventaris &amp; Gudang Karantina Transit</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Manajemen stok green bean: Penerimaan Inbound &rarr; Gudang Sementara (Menunggu Sortir) &rarr; Lembar Kerja Sortir &rarr; Deploy ke Marketplace.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/gudang/pengadaan"
            className="px-3.5 py-2 rounded-md bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Pengadaan Green Bean Baru</span>
          </Link>

          <Link
            to="/admin/gudang/sortir"
            className="px-3.5 py-2 rounded-md bg-[#343a40] hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            <span>Lembar Kerja Sortir</span>
          </Link>
        </div>
      </div>

      {/* 2. AdminLTE 4 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Box 1: Gudang Sementara (Menunggu Sortir) */}
        <div
          onClick={() => setActiveTab('temporary')}
          className={`cursor-pointer rounded-lg p-4 border transition-all ${
            activeTab === 'temporary'
              ? 'bg-amber-500 text-white border-amber-600 shadow-md ring-2 ring-amber-400'
              : 'bg-white border-stone-200 hover:border-amber-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'temporary' ? 'text-amber-100' : 'text-amber-700'}`}>
              Gudang Sementara
            </span>
            <Clock className={`w-5 h-5 ${activeTab === 'temporary' ? 'text-white' : 'text-amber-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black">{temporaryLots.length}</span>
            <span className="text-xs font-semibold opacity-90">Lot Inbound</span>
          </div>
          <div className={`mt-1 text-xs ${activeTab === 'temporary' ? 'text-amber-100' : 'text-stone-500'}`}>
            Total: <strong>{temporaryWeightKg.toLocaleString()} kg</strong> menunggu uji sortir
          </div>
        </div>

        {/* Box 2: Stok Siap Rilis (Deploy Ready) */}
        <div
          onClick={() => setActiveTab('ready_deploy')}
          className={`cursor-pointer rounded-lg p-4 border transition-all ${
            activeTab === 'ready_deploy'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400'
              : 'bg-white border-stone-200 hover:border-blue-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'ready_deploy' ? 'text-blue-100' : 'text-blue-700'}`}>
              Siap Dikirim / Rilis
            </span>
            <Rocket className={`w-5 h-5 ${activeTab === 'ready_deploy' ? 'text-white' : 'text-blue-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black">{readyDeployLots.length}</span>
            <span className="text-xs font-semibold opacity-90">Lot Deploy Ready</span>
          </div>
          <div className={`mt-1 text-xs ${activeTab === 'ready_deploy' ? 'text-blue-100' : 'text-stone-500'}`}>
            Total: <strong>{readyDeployWeightKg.toLocaleString()} kg</strong> siap dideploy
          </div>
        </div>

        {/* Box 3: Aktif di Marketplace */}
        <div
          onClick={() => setActiveTab('released')}
          className={`cursor-pointer rounded-lg p-4 border transition-all ${
            activeTab === 'released'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
              : 'bg-white border-stone-200 hover:border-emerald-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'released' ? 'text-emerald-100' : 'text-emerald-700'}`}>
              Live di Marketplace
            </span>
            <Store className={`w-5 h-5 ${activeTab === 'released' ? 'text-white' : 'text-emerald-500'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black">{releasedLots.length}</span>
            <span className="text-xs font-semibold opacity-90">Lot Aktif</span>
          </div>
          <div className={`mt-1 text-xs ${activeTab === 'released' ? 'text-emerald-100' : 'text-stone-500'}`}>
            Total: <strong>{releasedWeightKg.toLocaleString()} kg</strong> dapat dibeli roaster
          </div>
        </div>

        {/* Box 4: Total Stok Fisik Gudang */}
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer rounded-lg p-4 border transition-all ${
            activeTab === 'all'
              ? 'bg-stone-800 text-white border-stone-900 shadow-md ring-2 ring-stone-600'
              : 'bg-white border-stone-200 hover:border-stone-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[11px] font-bold uppercase tracking-wider ${activeTab === 'all' ? 'text-stone-300' : 'text-stone-600'}`}>
              Total Semua Stok
            </span>
            <Layers className={`w-5 h-5 ${activeTab === 'all' ? 'text-white' : 'text-stone-600'}`} />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-2xl font-black">{totalWeightKg.toLocaleString()}</span>
            <span className="text-xs font-semibold opacity-90">kg</span>
          </div>
          <div className={`mt-1 text-xs ${activeTab === 'all' ? 'text-stone-300' : 'text-stone-500'}`}>
            {userWarehouseLots.length} Lot Tersimpan di Seluruh Silo
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation Tabs & Search Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'temporary' as const, label: 'Gudang Sementara (Menunggu Sortir)', count: temporaryLots.length, badgeBg: 'bg-amber-100 text-amber-800 border-amber-300' },
              { id: 'ready_deploy' as const, label: 'Siap Rilis ke Marketplace', count: readyDeployLots.length, badgeBg: 'bg-blue-100 text-blue-800 border-blue-300' },
              { id: 'released' as const, label: 'Live di Marketplace', count: releasedLots.length, badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300' },
              { id: 'all' as const, label: 'Semua Stok', count: userWarehouseLots.length, badgeBg: 'bg-stone-100 text-stone-700 border-stone-300' },
            ].map((tab) => {
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-3 py-1.5 rounded-md text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-[#343a40] text-white shadow-xs'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-600'
                  }`}
                >
                  <span>{tab.label}</span>
                  <span className={`px-1.5 py-0.2 rounded-full text-[10px] font-bold border ${tab.badgeBg}`}>
                    {tab.count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Quick Notice */}
          <div className="text-[11px] text-stone-500 flex items-center gap-1.5">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Standar SNI 01-2907 &amp; SCA Hermetic Storage</span>
          </div>
        </div>

        {/* Search & Grade Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID Lot, varietas, pengolah, lokasi gudang..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:border-amber-500"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
            <Filter className="w-4 h-4 text-stone-400" />
            <select
              value={selectedGrade}
              onChange={(e) => setSelectedGrade(e.target.value)}
              className="text-xs py-2 px-3 rounded-md border border-stone-300 bg-white focus:outline-none focus:border-amber-500"
            >
              <option value="all">Semua Grade Tier</option>
              <option value="Grade 1 - Super Premium">Grade 1: Super Premium</option>
              <option value="Grade 2 - Premium Grade">Grade 2: Premium Grade</option>
              <option value="Grade 3 - Medium Commercial">Grade 3: Medium Commercial</option>
              <option value="Grade 4 - Basic Commercial">Grade 4: Basic Commercial</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Table List of Warehouse Lots */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
        <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
          <div className="flex items-center gap-2">
            <h3 className="font-bold text-sm text-stone-900">
              Daftar Stok Green Bean ({displayedLots.length} Rekam)
            </h3>
            {activeTab === 'temporary' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-100 text-amber-900 font-bold border border-amber-300 animate-pulse">
                Menunggu Penyortiran
              </span>
            )}
            {activeTab === 'ready_deploy' && (
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-300">
                Deploy Ready (Siap Rilis)
              </span>
            )}
          </div>

          <span className="text-xs text-stone-500">
            Total Bobot: <strong>{displayedLots.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0).toLocaleString()} kg</strong>
          </span>
        </div>

        {displayedLots.length === 0 ? (
          <div className="text-center py-16 px-4">
            <Warehouse className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h4 className="font-bold text-stone-800 text-sm">Tidak ada lot kopi pada filter ini</h4>
            <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
              {activeTab === 'temporary'
                ? 'Semua green bean inbound telah disortir, atau belum ada pembelian baru dari pengolah.'
                : 'Silakan sesuaikan filter pencarian atau lakukan pengadaan green bean baru.'}
            </p>
            {activeTab === 'temporary' && (
              <Link
                to="/admin/gudang/pengadaan"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 transition-colors"
              >
                <ShoppingCart className="w-4 h-4" />
                <span>Beli Green Bean dari Pengolah</span>
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[1100px]">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">ID &amp; Lokasi Silo</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Komoditas &amp; Asal</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Kualitas Fisik</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Grade &amp; SCA</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Stok (kg)</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Harga Modal &amp; Jual</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Status Alur</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap">Aksi Operasional</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displayedLots.map((lot) => {
                  const isPendingSorting = lot.sortingStatus === 'pending_sorting';
                  const isReadyDeploy = lot.sortingStatus === 'sorted' && lot.isReleasedToMarketplace === false;
                  const isReleased = lot.sortingStatus === 'sorted' && lot.isReleasedToMarketplace === true;

                  const gradeConfig = GRADE_TIERS_CONFIG[lot.gradeTier] || GRADE_TIERS_CONFIG['Grade 2 - Premium Grade'];
                  const GradeIcon = gradeConfig.icon;

                  return (
                    <tr key={lot.id} className="hover:bg-amber-50/40 transition-colors">
                      {/* 1. ID & Lokasi Silo */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-stone-900">{lot.id}</div>
                        <div className="text-[11px] text-stone-500 mt-0.5 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-stone-400"></span>
                          <span className="truncate max-w-[140px]">{lot.storageLocation}</span>
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5">
                          Masuk: {lot.storedDate}
                        </div>
                      </td>

                      {/* 2. Komoditas & Asal */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{lot.marketplaceTitle || lot.variety}</div>
                        <div className="text-[11px] text-stone-600 mt-0.5">
                          {lot.marketplaceTitle ? `${lot.variety} • ` : ''}{lot.origin} • {lot.processMethod}
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Mill: <strong className="text-stone-700">{lot.sourceProcessorName}</strong>
                        </div>
                      </td>

                      {/* 3. Kualitas Fisik */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <span className="text-[11px] text-stone-700">
                            H₂O: <strong>{lot.moistureContentPercent || 11.0}%</strong>
                          </span>
                          <span className="text-[11px] text-stone-700">
                            aW: <strong>{lot.waterActivityAw || 0.55}</strong>
                          </span>
                        </div>
                        <div className="text-[10px] text-stone-500 mt-0.5">
                          Cacat: <strong className="text-amber-800">{lot.defectCount} / 350g</strong> • {lot.screenSize}
                        </div>
                        {lot.hasHealthCertificate && (
                          <div className="text-[10px] text-emerald-700 font-bold flex items-center gap-1 mt-0.5">
                            <ShieldCheck className="w-3 h-3" />
                            <span>Health Cert: {lot.healthCertificateNumber}</span>
                          </div>
                        )}
                      </td>

                      {/* 4. Grade & SCA */}
                      <td className="py-3.5 px-4">
                        <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-bold border ${gradeConfig.badgeBg} ${gradeConfig.badgeText} ${gradeConfig.badgeBorder}`}>
                          <GradeIcon className="w-3 h-3" />
                          <span>{gradeConfig.shortLabel}</span>
                        </span>
                        <div className="text-[11px] font-bold text-amber-700 mt-1">
                          SCA {lot.verifiedScaScore.toFixed(2)}
                        </div>
                      </td>

                      {/* 5. Stok (kg) */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-sm text-stone-900">
                          {lot.availableWeightKg.toLocaleString()} <span className="text-xs font-normal text-stone-500">kg</span>
                        </div>
                        <div className="text-[10px] text-stone-400">
                          Total Awal: {lot.weightKg} kg
                        </div>
                      </td>

                      {/* 6. Harga Modal & Jual */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-emerald-700">
                          Rp {lot.pricePerKg.toLocaleString()}/kg
                        </div>
                        <div className="text-[10px] text-stone-500">
                          Modal: Rp {(lot.purchasePricePerKg || lot.pricePerKg * 0.75).toLocaleString()}/kg
                        </div>
                      </td>

                      {/* 7. Status Alur */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        {isPendingSorting && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                            <Clock className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
                            <span>Gudang Sementara (Belum Disortir)</span>
                          </span>
                        )}

                        {isReadyDeploy && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-900 border border-blue-300 whitespace-nowrap shrink-0">
                            <Rocket className="w-3 h-3 text-blue-600 shrink-0" />
                            <span>Deploy Ready (Tersimpan di Inventory)</span>
                          </span>
                        )}

                        {isReleased && (
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-900 border border-emerald-300 whitespace-nowrap shrink-0">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                            <span>Live di Marketplace (Siap Beli)</span>
                          </span>
                        )}
                      </td>

                      {/* 8. Aksi Operasional */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0">
                          {/* Tombol Lembar Kerja Sortir (Jika pending sorting atau ingin re-sortir) */}
                          <Link
                            to={`/admin/gudang/sortir/${lot.id}`}
                            className={`px-2.5 py-1.5 rounded-md font-bold text-[11px] flex items-center gap-1 transition-colors ${
                              isPendingSorting
                                ? 'bg-amber-600 hover:bg-amber-700 text-white shadow-xs'
                                : 'bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300'
                            }`}
                            title={isPendingSorting ? 'Isi Lembar Kerja Penyortiran & Grading' : 'Re-sortir / Edit Lembar Kerja'}
                          >
                            <ClipboardCheck className="w-3.5 h-3.5" />
                            <span>{isPendingSorting ? 'Uji Sortir' : 'Re-Sortir'}</span>
                          </Link>

                          {/* Tombol Deploy Ready -> Rilis ke Marketplace */}
                          {isReadyDeploy && (
                            <button
                              type="button"
                              onClick={() => {
                                toggleReleaseWarehouseLotToMarketplace(lot.id);
                              }}
                              className="px-2.5 py-1.5 rounded-md font-bold text-[11px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                              title="Rilis lot ini ke etalase Marketplace sekarang"
                            >
                              <Rocket className="w-3.5 h-3.5" />
                              <span>Rilis Pasar</span>
                            </button>
                          )}

                          {/* Tombol Tarik dari Marketplace */}
                          {isReleased && (
                            <button
                              type="button"
                              onClick={() => {
                                toggleReleaseWarehouseLotToMarketplace(lot.id);
                              }}
                              className="px-2.5 py-1.5 rounded-md font-bold text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
                              title="Tarik kembali ke inventaris gudang (sembunyikan dari etalase)"
                            >
                              <span>Tarik</span>
                            </button>
                          )}

                          {/* Tombol Barcode QR Hermetik */}
                          <button
                            type="button"
                            onClick={() => setBarcodeLot(lot)}
                            className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 transition-colors cursor-pointer"
                            title="Cetak Barcode / Label QR Pallet Hermetik"
                          >
                            <QrCode className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* 5. Barcode & Hermetic Label Modal */}
      {barcodeLot && (
        <WarehouseBarcodeModal
          isOpen={true}
          lot={barcodeLot}
          onClose={() => setBarcodeLot(null)}
        />
      )}
    </div>
  );
};

export default WarehouseInventoryPage;
