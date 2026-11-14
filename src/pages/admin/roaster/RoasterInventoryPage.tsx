import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { RoastedBeanLot, WarehouseLot } from '../../../types/coffee';
import {
  Flame,
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
  Coffee,
  Warehouse,
  History,
  Eye,
  Sliders,
  Play,
  RotateCcw,
} from 'lucide-react';
import { RoasterBarcodeModal } from '../../../components/roaster/RoasterBarcodeModal';
import { TraceabilityModal } from '../../../components/TraceabilityModal';

export const RoasterInventoryPage: React.FC = () => {
  const {
    roastedLots,
    warehouseLots,
    currentUser,
    toggleReleaseRoastedLotToMarketplace,
  } = useCoffee();
  const navigate = useNavigate();

  // Default active tab to 'all' so master data is IMMEDIATELY visible upon page load
  const [activeTab, setActiveTab] = useState<'all' | 'ready_deploy' | 'released' | 'cupping_pending' | 'green_stock'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRoastLevel, setSelectedRoastLevel] = useState<string>('all');

  // Modals
  const [barcodeLot, setBarcodeLot] = useState<RoastedBeanLot | null>(null);
  const [traceModalLot, setTraceModalLot] = useState<RoastedBeanLot | null>(null);

  // Available Green Beans ready for roasting (from Warehouse lots / Marketplace purchases)
  const availableGreenBeans = warehouseLots.filter((lot) => (lot.availableWeightKg || 0) > 0);

  // Filter lots belonging to current roaster or all if admin
  const userRoastedLots = roastedLots.filter(
    (lot) => !currentUser || currentUser.role === 'admin_kelompok_tani' || lot.roasterId === currentUser.id
  );

  // Segregated categories with robust boolean coercion
  const readyDeployLots = userRoastedLots.filter(
    (lot) => !Boolean(lot.isReleasedToMarketplace) && lot.roastStatus !== 'cupping_pending' && (lot.availablePacks || 0) > 0
  );
  const releasedLots = userRoastedLots.filter(
    (lot) => Boolean(lot.isReleasedToMarketplace) && (lot.availablePacks || 0) > 0
  );
  const cuppingPendingLots = userRoastedLots.filter(
    (lot) => lot.roastStatus === 'cupping_pending'
  );

  // Tab filtered lots for roasted beans
  const tabFilteredRoastedLots = userRoastedLots.filter((lot) => {
    if (activeTab === 'ready_deploy') return !Boolean(lot.isReleasedToMarketplace) && lot.roastStatus !== 'cupping_pending' && (lot.availablePacks || 0) > 0;
    if (activeTab === 'released') return Boolean(lot.isReleasedToMarketplace) && (lot.availablePacks || 0) > 0;
    if (activeTab === 'cupping_pending') return lot.roastStatus === 'cupping_pending';
    return true; // 'all'
  });

  // Filter search & roast level for roasted beans
  const displayedRoastedLots = tabFilteredRoastedLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.origin.toLowerCase().includes(q) ||
      lot.farmerName.toLowerCase().includes(q) ||
      lot.roasterMachine.toLowerCase().includes(q);

    const matchLevel = selectedRoastLevel === 'all' || lot.roastLevel === selectedRoastLevel;
    return matchSearch && matchLevel;
  });

  // Filter search for green bean materials
  const displayedGreenBeans = availableGreenBeans.filter((lot) => {
    const q = searchQuery.toLowerCase();
    return (
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.origin.toLowerCase().includes(q) ||
      (lot.sourceProcessorName && lot.sourceProcessorName.toLowerCase().includes(q)) ||
      (lot.storageLocation && lot.storageLocation.toLowerCase().includes(q))
    );
  });

  // Calculate Metrics
  const totalGreenStockKg = availableGreenBeans.reduce((acc, l) => acc + (l.availableWeightKg || 0), 0);
  const totalReadyDeployPacks = readyDeployLots.reduce((acc, l) => acc + (l.availablePacks || 0), 0);
  const totalReleasedPacks = releasedLots.reduce((acc, l) => acc + (l.availablePacks || 0), 0);
  const totalRoastedPacks = userRoastedLots.reduce((acc, l) => acc + (l.availablePacks || 0), 0);

  return (
    <div className="space-y-6">
      {/* 1. AdminLTE Content Header & Breadcrumb */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs text-stone-500 mb-1">
            <Link to="/admin/roaster/inventory" className="hover:text-amber-600">
              {currentUser?.organization || 'Roastery ERP'}
            </Link>
            <span>/</span>
            <span>Layanan Roaster</span>
            <span>/</span>
            <span className="font-bold text-stone-800">Master Data Stok Green &amp; Roasted Beans</span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 tracking-tight flex items-center gap-2.5">
            <Flame className="w-7 h-7 text-orange-600" />
            <span>Inventaris Roastery &amp; Rantai Produksi Biji Sangrai</span>
          </h1>
          <p className="text-xs text-stone-500 mt-0.5">
            Sistem ERP sangrai terpadu: Pengadaan green bean dari marketplace, lembar kerja roasting &amp; cupping SCA bertahap, dan opsi rilis pasar vs simpan di rak roastery.
          </p>
        </div>

        <div className="flex items-center gap-2.5">
          <Link
            to="/admin/roaster/pengadaan"
            className="px-3.5 py-2 rounded-md bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ShoppingCart className="w-4 h-4 text-emerald-200" />
            <span>Pengadaan Green Beans</span>
          </Link>

          <Link
            to="/admin/roaster/production"
            className="px-3.5 py-2 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <Flame className="w-4 h-4 text-amber-200" />
            <span>Jadwalkan Sangrai Baru</span>
          </Link>

          <Link
            to="/admin/roaster/cupping"
            className="px-3.5 py-2 rounded-md bg-[#343a40] hover:bg-stone-900 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs transition-colors"
          >
            <ClipboardCheck className="w-4 h-4 text-amber-400" />
            <span>Lembar Kerja Cupping SCA</span>
          </Link>
        </div>
      </div>

      {/* 2. AdminLTE 5 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
        {/* Box 1: Total Semua Batch (Master Data) */}
        <div
          onClick={() => setActiveTab('all')}
          className={`cursor-pointer rounded-lg p-3.5 border transition-all ${
            activeTab === 'all'
              ? 'bg-stone-800 text-white border-stone-900 shadow-md ring-2 ring-stone-600'
              : 'bg-white border-stone-200 hover:border-stone-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'all' ? 'text-stone-300' : 'text-stone-600'}`}>
              Semua Batch Master
            </span>
            <Coffee className={`w-4 h-4 ${activeTab === 'all' ? 'text-white' : 'text-stone-600'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-black">{userRoastedLots.length}</span>
            <span className="text-xs font-semibold opacity-80">Batch ({totalRoastedPacks} Pk)</span>
          </div>
          <div className={`mt-1 text-[11px] ${activeTab === 'all' ? 'text-stone-300' : 'text-stone-500'}`}>
            Master Data Biji Sangrai
          </div>
        </div>

        {/* Box 2: Bahan Baku Green Bean (Inbound Marketplace) */}
        <div
          onClick={() => setActiveTab('green_stock')}
          className={`cursor-pointer rounded-lg p-3.5 border transition-all ${
            activeTab === 'green_stock'
              ? 'bg-amber-600 text-white border-amber-700 shadow-md ring-2 ring-amber-400'
              : 'bg-white border-stone-200 hover:border-amber-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'green_stock' ? 'text-amber-100' : 'text-amber-700'}`}>
              Bahan Baku Green Bean
            </span>
            <Warehouse className={`w-4 h-4 ${activeTab === 'green_stock' ? 'text-white' : 'text-amber-600'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-black">{totalGreenStockKg.toLocaleString()}</span>
            <span className="text-xs font-semibold opacity-90">kg</span>
          </div>
          <div className={`mt-1 text-[11px] ${activeTab === 'green_stock' ? 'text-amber-100' : 'text-stone-500'}`}>
            {availableGreenBeans.length} Lot Siap Masuk Sangrai
          </div>
        </div>

        {/* Box 3: Menunggu Cupping SCA */}
        <div
          onClick={() => setActiveTab('cupping_pending')}
          className={`cursor-pointer rounded-lg p-3.5 border transition-all ${
            activeTab === 'cupping_pending'
              ? 'bg-orange-600 text-white border-orange-700 shadow-md ring-2 ring-orange-400'
              : 'bg-white border-stone-200 hover:border-orange-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'cupping_pending' ? 'text-orange-100' : 'text-orange-700'}`}>
              Menunggu Cupping
            </span>
            <Clock className={`w-4 h-4 ${activeTab === 'cupping_pending' ? 'text-white' : 'text-orange-500'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-black">{cuppingPendingLots.length}</span>
            <span className="text-xs font-semibold opacity-90">Batch</span>
          </div>
          <div className={`mt-1 text-[11px] ${activeTab === 'cupping_pending' ? 'text-orange-100' : 'text-stone-500'}`}>
            {cuppingPendingLots.length > 0 ? 'Perlu Uji Rasa Sensori SCA' : 'Semua Batch Sudah Diuji'}
          </div>
        </div>

        {/* Box 4: Biji Sangrai Siap Rilis (Deploy Ready) */}
        <div
          onClick={() => setActiveTab('ready_deploy')}
          className={`cursor-pointer rounded-lg p-3.5 border transition-all ${
            activeTab === 'ready_deploy'
              ? 'bg-blue-600 text-white border-blue-700 shadow-md ring-2 ring-blue-400'
              : 'bg-white border-stone-200 hover:border-blue-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'ready_deploy' ? 'text-blue-100' : 'text-blue-700'}`}>
              Deploy Ready (Inventory)
            </span>
            <Rocket className={`w-4 h-4 ${activeTab === 'ready_deploy' ? 'text-white' : 'text-blue-500'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-black">{totalReadyDeployPacks.toLocaleString()}</span>
            <span className="text-xs font-semibold opacity-90">Pack</span>
          </div>
          <div className={`mt-1 text-[11px] ${activeTab === 'ready_deploy' ? 'text-blue-100' : 'text-stone-500'}`}>
            {readyDeployLots.length} Batch Tersimpan di Rak
          </div>
        </div>

        {/* Box 5: Live di Marketplace */}
        <div
          onClick={() => setActiveTab('released')}
          className={`cursor-pointer rounded-lg p-3.5 border transition-all ${
            activeTab === 'released'
              ? 'bg-emerald-600 text-white border-emerald-700 shadow-md ring-2 ring-emerald-400'
              : 'bg-white border-stone-200 hover:border-emerald-400 text-stone-800'
          }`}
        >
          <div className="flex items-center justify-between">
            <span className={`text-[10px] font-bold uppercase tracking-wider ${activeTab === 'released' ? 'text-emerald-100' : 'text-emerald-700'}`}>
              Live di Marketplace
            </span>
            <Store className={`w-4 h-4 ${activeTab === 'released' ? 'text-white' : 'text-emerald-500'}`} />
          </div>
          <div className="mt-1.5 flex items-baseline gap-1.5">
            <span className="text-xl font-black">{totalReleasedPacks.toLocaleString()}</span>
            <span className="text-xs font-semibold opacity-90">Pack</span>
          </div>
          <div className={`mt-1 text-[11px] ${activeTab === 'released' ? 'text-emerald-100' : 'text-stone-500'}`}>
            {releasedLots.length} Batch Aktif Dapat Dipesan
          </div>
        </div>
      </div>

      {/* 3. Filter Navigation Tabs & Search Toolbar */}
      <div className="bg-white rounded-lg shadow-sm border border-stone-200 p-4 space-y-3">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-stone-100 pb-3">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-1.5">
            {[
              { id: 'all' as const, label: 'Semua Master Data Batch', count: userRoastedLots.length, badgeBg: 'bg-stone-200 text-stone-900 border-stone-400' },
              { id: 'ready_deploy' as const, label: 'Siap Rilis (Deploy Ready)', count: readyDeployLots.length, badgeBg: 'bg-blue-100 text-blue-900 border-blue-300' },
              { id: 'released' as const, label: 'Live di Marketplace', count: releasedLots.length, badgeBg: 'bg-emerald-100 text-emerald-900 border-emerald-300' },
              { id: 'cupping_pending' as const, label: 'Menunggu Cupping SCA', count: cuppingPendingLots.length, badgeBg: 'bg-orange-100 text-orange-950 border-orange-300' },
              { id: 'green_stock' as const, label: 'Bahan Baku Green Bean', count: availableGreenBeans.length, badgeBg: 'bg-amber-100 text-amber-900 border-amber-300' },
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
            <QrCode className="w-4 h-4 text-orange-600 shrink-0" />
            <span>Farm-to-Cup Traceability QR Code Terintegrasi</span>
          </div>
        </div>

        {/* Search & Roast Filter Row */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari ID Batch, varietas, origin, profil rasa, mesin sangrai..."
              className="w-full text-xs pl-9 pr-3 py-2 rounded-md border border-stone-300 focus:outline-none focus:border-orange-500"
            />
          </div>

          {activeTab !== 'green_stock' && (
            <div className="flex items-center gap-2 w-full sm:w-auto shrink-0">
              <Filter className="w-4 h-4 text-stone-400" />
              <select
                value={selectedRoastLevel}
                onChange={(e) => setSelectedRoastLevel(e.target.value)}
                className="text-xs py-2 px-3 rounded-md border border-stone-300 bg-white focus:outline-none focus:border-orange-500"
              >
                <option value="all">Semua Roast Level</option>
                <option value="Light Roast">Light Roast (Filter)</option>
                <option value="Light-Medium">Light-Medium (Omni)</option>
                <option value="Medium Roast">Medium Roast (Espresso)</option>
                <option value="Medium-Dark">Medium-Dark</option>
                <option value="Dark Roast">Dark Roast</option>
              </select>
            </div>
          )}
        </div>
      </div>

      {/* 4. Table Content: Green Bean Raw Materials vs Roasted Bean Batches */}
      {activeTab === 'green_stock' ? (
        /* TAB GREEN BEAN MATERIAL */
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div>
              <h3 className="font-bold text-sm text-stone-900">
                Stok Bahan Baku Biji Hijau (Green Beans) ({displayedGreenBeans.length} Lot)
              </h3>
              <p className="text-[11px] text-stone-500 mt-0.5">
                Bahan baku mentah yang dibeli dari katalog Marketplace atau gudang penyimpanan siap dialokasikan ke mesin sangrai.
              </p>
            </div>
            <Link
              to="/admin/roaster/pengadaan"
              className="text-xs font-bold text-amber-800 hover:text-amber-900 bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-md flex items-center gap-1.5 transition-colors"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              <span>+ Beli Green Bean dari Marketplace</span>
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs min-w-[1050px]">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4 whitespace-nowrap">ID Green Bean</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Komoditas &amp; Asal</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Sumber Pengadaan</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Kualitas &amp; Kadar Air</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Stok Tersedia</th>
                  <th className="py-3.5 px-4 whitespace-nowrap">Harga Beli</th>
                  <th className="py-3.5 px-4 text-center whitespace-nowrap">Lembar Kerja &amp; Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {displayedGreenBeans.map((gb) => (
                  <tr key={gb.id} className="hover:bg-amber-50/40 transition-colors">
                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-mono font-bold text-stone-900">{gb.id}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        {gb.storageLocation || 'Silo Inbound Roastery'}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-stone-900">{gb.variety}</div>
                      <div className="text-[11px] text-stone-600 mt-0.5">{gb.origin} • {gb.processMethod}</div>
                      <div className="text-[10px] text-stone-500 mt-0.5">
                        Petani: <strong className="text-stone-700">{gb.sourceFarmerName}</strong>
                      </div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 whitespace-nowrap shrink-0">
                        <Store className="w-3 h-3 text-emerald-600 shrink-0" />
                        <span>{gb.warehouseName || 'Marketplace Kopi'}</span>
                      </span>
                      <span className="text-[10px] text-stone-400 block mt-0.5 whitespace-nowrap">
                        {gb.packagingType || 'GrainPro Hermetik'}
                      </span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <span className="text-stone-800 font-medium">H₂O: <strong>{gb.moistureContentPercent}%</strong></span>
                      <span className="text-stone-500 block text-[10px]">Grade: {gb.gradeTier} • SCA {gb.verifiedScaScore}</span>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-black text-sm text-stone-900">{gb.availableWeightKg} kg</div>
                    </td>

                    <td className="py-3.5 px-4 whitespace-nowrap">
                      <div className="font-bold text-stone-800">Rp {gb.pricePerKg.toLocaleString()}/kg</div>
                    </td>

                    <td className="py-3.5 px-4 text-center whitespace-nowrap">
                      <div className="inline-flex items-center gap-1.5 whitespace-nowrap shrink-0">
                        {/* Direct Stage 1 -> Stage 2 Roasting Worksheet Link */}
                        <Link
                          to={`/admin/roaster/production?greenLotId=${gb.id}`}
                          className="px-3 py-1.5 rounded-md bg-orange-600 hover:bg-orange-700 text-white font-bold text-[11px] inline-flex items-center gap-1 shadow-xs transition-colors whitespace-nowrap shrink-0"
                          title="Buka Lembar Kerja Jadwal & Simulator Roasting untuk lot ini"
                        >
                          <Flame className="w-3.5 h-3.5 text-amber-200 shrink-0" />
                          <span>🔥 Sangrai Batch Ini</span>
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        /* TAB ROASTED BEAN BATCHES (MASTER DATA) */
        <div className="bg-white rounded-lg shadow-sm border border-stone-200 overflow-hidden">
          <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50/70">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-sm text-stone-900">
                Master Data Batch Biji Sangrai ({displayedRoastedLots.length} Batch)
              </h3>
              {activeTab === 'all' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 font-bold border border-stone-400">
                  Semua Alur Terintegrasi
                </span>
              )}
              {activeTab === 'ready_deploy' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-blue-100 text-blue-900 font-bold border border-blue-300">
                  Deploy Ready (Tersimpan di Rak Roastery)
                </span>
              )}
              {activeTab === 'released' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 font-bold border border-emerald-300">
                  Live di Marketplace (Dapat Dipesan Cafe)
                </span>
              )}
              {activeTab === 'cupping_pending' && (
                <span className="text-[10px] px-2 py-0.5 rounded-full bg-orange-100 text-orange-950 font-bold border border-orange-300">
                  Menunggu Lembar Kerja Cupping SCA
                </span>
              )}
            </div>

            <span className="text-xs text-stone-500">
              Total Stok Ritel: <strong>{displayedRoastedLots.reduce((acc, l) => acc + (l.availablePacks || 0), 0).toLocaleString()} pack</strong>
            </span>
          </div>

          {displayedRoastedLots.length === 0 ? (
            <div className="text-center py-16 px-4">
              <Coffee className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h4 className="font-bold text-stone-800 text-sm">Tidak ada batch kopi sangrai pada kategori ini</h4>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Silakan lakukan batch sangrai baru dari modul produksi atau alokasikan dari stok bahan baku green bean.
              </p>
              <Link
                to="/admin/roaster/production"
                className="mt-4 inline-flex items-center gap-2 px-4 py-2 rounded-md bg-orange-600 text-white text-xs font-bold hover:bg-orange-700 transition-colors"
              >
                <Flame className="w-4 h-4 text-amber-200" />
                <span>Mulai Batch Sangrai</span>
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[1150px]">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3.5 px-4 whitespace-nowrap">ID Batch &amp; Tanggal</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Komoditas &amp; Roastery</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Profil Sangrai &amp; Mesin</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Skor Cupping SCA</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Stok Pack (250g)</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Harga Jual</th>
                    <th className="py-3.5 px-4 whitespace-nowrap">Tahap &amp; Status Alur</th>
                    <th className="py-3.5 px-4 text-center whitespace-nowrap">Lembar Kerja &amp; Aksi Operasional</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {displayedRoastedLots.map((lot) => {
                    const isPendingCupping = lot.roastStatus === 'cupping_pending';
                    const isReleased = Boolean(lot.isReleasedToMarketplace);
                    const isReadyDeploy = !isReleased && !isPendingCupping && (lot.availablePacks || 0) > 0;

                    return (
                      <tr key={lot.id} className="hover:bg-orange-50/30 transition-colors">
                        {/* 1. ID Batch & Tanggal */}
                        <td className="py-3.5 px-4">
                          <div className="font-mono font-bold text-stone-900">{lot.id}</div>
                          <div className="text-[11px] text-stone-500 mt-0.5">Sangrai: {lot.roastDate}</div>
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            Resting: <strong>{lot.restingRecommendationDays} hari</strong>
                          </div>
                        </td>

                        {/* 2. Komoditas & Roastery */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-900">{lot.marketplaceTitle || lot.variety}</div>
                          <div className="text-[11px] text-stone-600 mt-0.5">
                            {lot.marketplaceTitle ? `${lot.variety} • ` : ''}{lot.origin} • {lot.processMethod}
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            Petani: <strong className="text-stone-700">{lot.farmerName}</strong>
                          </div>
                        </td>

                        {/* 3. Mesin & Profil Sangrai */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-stone-800 flex items-center gap-1.5">
                            <Flame className="w-3.5 h-3.5 text-orange-600 shrink-0" />
                            <span>{lot.roastLevel}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 mt-0.5">
                            Agtron #{lot.agtronNumber} • DTR {lot.developmentTimeRatio}%
                          </div>
                          <div className="text-[10px] text-stone-400 mt-0.5">
                            Mesin: {lot.roasterMachine}
                          </div>
                        </td>

                        {/* 4. Skor Cupping SCA */}
                        <td className="py-3.5 px-4">
                          {isPendingCupping ? (
                            <span className="text-[11px] text-amber-700 font-bold bg-amber-50 border border-amber-200 px-2 py-0.5 rounded inline-block">
                              Menunggu Evaluasi
                            </span>
                          ) : (
                            <>
                              <div className="font-black text-sm text-amber-800 flex items-center gap-1">
                                <Award className="w-4 h-4 text-amber-500" />
                                <span>{(lot.scaCuppingScore || 85.0).toFixed(2)}</span>
                              </div>
                              {lot.tastingNotes && lot.tastingNotes.length > 0 && (
                                <div className="flex flex-wrap gap-1 mt-1 max-w-[170px]">
                                  {lot.tastingNotes.slice(0, 2).map((note, idx) => (
                                    <span key={idx} className="text-[9px] px-1.5 py-0.2 rounded bg-amber-50 text-amber-900 border border-amber-200">
                                      {note}
                                    </span>
                                  ))}
                                </div>
                              )}
                            </>
                          )}
                        </td>

                        {/* 5. Stok Pack */}
                        <td className="py-3.5 px-4">
                          <div className="font-black text-sm text-stone-900">
                            {lot.availablePacks} <span className="text-xs font-normal text-stone-500">pack</span>
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Kemasan {lot.packageWeightGrams}g ({(((lot.availablePacks || 0) * (lot.packageWeightGrams || 250)) / 1000).toFixed(1)} kg)
                          </div>
                        </td>

                        {/* 6. Harga Jual */}
                        <td className="py-3.5 px-4">
                          <div className="font-bold text-emerald-700">
                            Rp {(lot.pricePerPack || 95000).toLocaleString()}/pack
                          </div>
                          <div className="text-[10px] text-stone-400">
                            (Rp {Math.round(((lot.pricePerPack || 95000) / (lot.packageWeightGrams || 250)) * 1000).toLocaleString()}/kg)
                          </div>
                        </td>

                        {/* 7. Tahap & Status Alur */}
                        <td className="py-3.5 px-4 whitespace-nowrap">
                          {isPendingCupping && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-950 border border-amber-300 whitespace-nowrap shrink-0">
                              <Clock className="w-3 h-3 text-amber-600 animate-spin shrink-0" />
                              <span>Tahap 2: Menunggu Cupping SCA</span>
                            </span>
                          )}

                          {isReadyDeploy && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-950 border border-blue-300 whitespace-nowrap shrink-0">
                              <Rocket className="w-3 h-3 text-blue-600 shrink-0" />
                              <span>Tahap 3: Deploy Ready (Rak Inventory)</span>
                            </span>
                          )}

                          {isReleased && (
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-950 border border-emerald-300 whitespace-nowrap shrink-0">
                              <CheckCircle2 className="w-3 h-3 text-emerald-600 shrink-0" />
                              <span>Tahap 4: Live di Marketplace (Siap Order)</span>
                            </span>
                          )}
                        </td>

                        {/* 8. Lembar Kerja & Aksi Operasional */}
                        <td className="py-3.5 px-4 text-center whitespace-nowrap">
                          <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap whitespace-nowrap shrink-0">
                            {/* Link Lembar Kerja Cupping SCA */}
                            {isPendingCupping ? (
                              <Link
                                to={`/admin/roaster/cupping/${lot.id}`}
                                className="px-3 py-1.5 rounded-md font-bold text-[11px] bg-amber-600 hover:bg-amber-700 text-white shadow-xs flex items-center gap-1.5 transition-colors"
                                title="Buka Lembar Kerja Uji Sensori Rasa SCA"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5 text-amber-200" />
                                <span>📋 Isi Cupping SCA</span>
                              </Link>
                            ) : (
                              <Link
                                to={`/admin/roaster/cupping/${lot.id}`}
                                className="px-2.5 py-1.5 rounded-md font-bold text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-700 border border-stone-300 flex items-center gap-1 transition-colors"
                                title="Review Lembar Kerja Cupping SCA & Radar Chart"
                              >
                                <ClipboardCheck className="w-3.5 h-3.5 text-stone-500" />
                                <span>Lembar Kerja</span>
                              </Link>
                            )}

                            {/* Tombol Deploy Ready -> Rilis ke Marketplace */}
                            {isReadyDeploy && (
                              <button
                                type="button"
                                onClick={() => toggleReleaseRoastedLotToMarketplace(lot.id)}
                                className="px-2.5 py-1.5 rounded-md font-bold text-[11px] bg-blue-600 hover:bg-blue-700 text-white flex items-center gap-1 shadow-xs transition-colors cursor-pointer"
                                title="Rilis batch ini ke etalase Marketplace sekarang"
                              >
                                <Rocket className="w-3.5 h-3.5" />
                                <span>🚀 Rilis Pasar</span>
                              </button>
                            )}

                            {/* Tombol Tarik dari Marketplace */}
                            {isReleased && (
                              <button
                                type="button"
                                onClick={() => toggleReleaseRoastedLotToMarketplace(lot.id)}
                                className="px-2.5 py-1.5 rounded-md font-bold text-[11px] bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 flex items-center gap-1 transition-colors cursor-pointer"
                                title="Tarik kembali ke rak roastery (sembunyikan dari etalase)"
                              >
                                <span>Tarik</span>
                              </button>
                            )}

                            {/* Tombol Label Kemasan & QR Traceability */}
                            <button
                              type="button"
                              onClick={() => setBarcodeLot(lot)}
                              className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 transition-colors cursor-pointer"
                              title="Cetak Label Kemasan Ritel & Barcode QR Traceability"
                            >
                              <QrCode className="w-3.5 h-3.5 text-orange-600" />
                            </button>

                            {/* Tombol Silsilah Farm-to-Cup */}
                            <button
                              type="button"
                              onClick={() => setTraceModalLot(lot)}
                              className="p-1.5 rounded-md bg-stone-100 hover:bg-stone-200 text-stone-600 border border-stone-300 transition-colors cursor-pointer"
                              title="Lihat Silsilah Rantai Pasok (Farm to Cup Traceability)"
                            >
                              <Eye className="w-3.5 h-3.5 text-blue-600" />
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
      )}

      {/* 5. Barcode Packaging Modal */}
      {barcodeLot && (
        <RoasterBarcodeModal
          isOpen={true}
          lot={barcodeLot}
          onClose={() => setBarcodeLot(null)}
        />
      )}

      {/* 6. Traceability Silsilah Modal */}
      {traceModalLot && (
        <TraceabilityModal
          isOpen={true}
          data={traceModalLot}
          onClose={() => setTraceModalLot(null)}
        />
      )}
    </div>
  );
};
