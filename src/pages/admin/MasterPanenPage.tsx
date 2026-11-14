import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useCoffee } from '../../context/CoffeeContext';
import { FarmerHarvestLot } from '../../types/coffee';
import {
  Package,
  PlusCircle,
  Search,
  Filter,
  MapPin,
  QrCode,
  Store,
  ArrowRight,
  Printer,
  CheckCircle2,
  XCircle,
  Trash2,
  Scale,
  Sparkles,
  DollarSign,
  Users,
  TreePine,
  Check,
  Eye,
  ChevronRight,
  ShieldCheck,
  Warehouse,
} from 'lucide-react';
import { FarmerBarcodeModal } from '../../components/FarmerBarcodeModal';

export const MasterPanenPage: React.FC = () => {
  const {
    users,
    coffeeFarms,
    farmerLots,
    toggleReleaseHarvestLotToMarketplace,
    sendHarvestLotToProcessor,
  } = useCoffee();

  const allFarmers = users.filter((u) => u.role === 'petani' || u.assignedService === 'petani');

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFarmerFilter, setSelectedFarmerFilter] = useState<string>('all');
  const [selectedStageFilter, setSelectedStageFilter] = useState<
    'all' | 'inventory' | 'released' | 'processor'
  >('all');
  const [selectedBarcodeLot, setSelectedBarcodeLot] = useState<FarmerHarvestLot | null>(null);

  // Filtered harvest lots
  const filteredLots = farmerLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchQuery =
      lot.id.toLowerCase().includes(q) ||
      lot.farmerName.toLowerCase().includes(q) ||
      (lot.farmName && lot.farmName.toLowerCase().includes(q)) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.farmLocation.toLowerCase().includes(q);

    const matchFarmer = selectedFarmerFilter === 'all' || lot.farmerId === selectedFarmerFilter;

    let matchStage = true;
    if (selectedStageFilter === 'inventory') {
      matchStage = !lot.isReleasedToMarketplace && !lot.sentToProcessor;
    } else if (selectedStageFilter === 'released') {
      matchStage = Boolean(lot.isReleasedToMarketplace);
    } else if (selectedStageFilter === 'processor') {
      matchStage = Boolean(lot.sentToProcessor);
    }

    return matchQuery && matchFarmer && matchStage;
  });

  // KPI Calculations
  const totalVolumeKg = farmerLots.reduce((acc, l) => acc + (l.totalWeightKg || 0), 0);
  const inventoryLots = farmerLots.filter((l) => !l.isReleasedToMarketplace && !l.sentToProcessor);
  const inventoryKg = inventoryLots.reduce((acc, l) => acc + (l.availableWeightKg || l.totalWeightKg || 0), 0);
  const releasedLots = farmerLots.filter((l) => l.isReleasedToMarketplace);
  const releasedKg = releasedLots.reduce((acc, l) => acc + (l.availableWeightKg || l.totalWeightKg || 0), 0);
  const totalEstimatedValue = farmerLots.reduce(
    (acc, l) => acc + (l.totalWeightKg || 0) * (l.pricePerKg || 15000),
    0
  );

  return (
    <div className="space-y-6">
      {/* 1. Header Banner & Action Button */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-black shadow-xs shrink-0">
            <Package className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-stone-900 tracking-tight">
              Data Hasil Panen Ceri Kopi
            </h1>
            <p className="text-xs text-stone-500 mt-0.5">
              Pencatatan lot ceri segar, timbangan, uji brix kematangan, dan opsi rilis ke marketplace vs gudang petani.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            to="/admin/panen/tambah"
            className="px-4 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-md shadow-xs flex items-center gap-2 transition-all active:scale-95"
          >
            <PlusCircle className="w-4 h-4" />
            <span>+ Catat Panen Baru (3-Step)</span>
          </Link>
        </div>
      </div>

      {/* 2. KPI Summary Stat Cards (AdminLTE Style) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Panen */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Scale className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Total Panen Ceri
            </span>
            <div className="text-2xl font-black text-stone-900 leading-tight">
              {totalVolumeKg.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">kg</span>
            </div>
            <span className="text-[10px] text-emerald-600 font-medium">
              Dari {farmerLots.length} Lot Tercatat
            </span>
          </div>
        </div>

        {/* Card 2: Keep ke Gudang Petani (Inventory) */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-stone-100 text-stone-700 flex items-center justify-center shrink-0">
            <Warehouse className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Gudang Petani (Inventory)
            </span>
            <div className="text-2xl font-black text-stone-800 leading-tight">
              {inventoryKg.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">kg</span>
            </div>
            <span className="text-[10px] text-stone-500 font-medium">
              {inventoryLots.length} Lot Disimpan Internal
            </span>
          </div>
        </div>

        {/* Card 3: Rilis Langsung ke Marketplace */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Store className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Rilis Marketplace
            </span>
            <div className="text-2xl font-black text-amber-700 leading-tight">
              {releasedKg.toLocaleString()}{' '}
              <span className="text-xs font-normal text-stone-500">kg</span>
            </div>
            <span className="text-[10px] text-amber-600 font-medium">
              {releasedLots.length} Lot Siap Dipesan Pembeli
            </span>
          </div>
        </div>

        {/* Card 4: Estimasi Nilai Penjualan */}
        <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 flex items-center gap-4">
          <div className="w-12 h-12 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <DollarSign className="w-6 h-6" />
          </div>
          <div className="min-w-0">
            <span className="text-[11px] font-bold uppercase text-stone-400 block tracking-wider">
              Estimasi Nilai Ceri
            </span>
            <div className="text-xl font-black text-stone-900 font-mono leading-tight">
              Rp {(totalEstimatedValue / 1000000).toFixed(1)} Jt
            </div>
            <span className="text-[10px] text-blue-600 font-medium">Potensi Perputaran Modal</span>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Stage Tabs */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] p-4 space-y-3">
        {/* Stage Filter Buttons */}
        <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
          <span className="text-xs font-bold text-stone-600 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-stone-400" />
            <span>Target Distribusi:</span>
          </span>

          <button
            type="button"
            onClick={() => setSelectedStageFilter('all')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors ${
              selectedStageFilter === 'all'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Lot ({farmerLots.length})
          </button>

          <button
            type="button"
            onClick={() => setSelectedStageFilter('inventory')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              selectedStageFilter === 'inventory'
                ? 'bg-stone-700 text-white'
                : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
            }`}
          >
            <Warehouse className="w-3.5 h-3.5" />
            <span>Keep ke Gudang Petani ({inventoryLots.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStageFilter('released')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              selectedStageFilter === 'released'
                ? 'bg-amber-600 text-white'
                : 'bg-amber-50 text-amber-800 hover:bg-amber-100'
            }`}
          >
            <Store className="w-3.5 h-3.5" />
            <span>Rilis Langsung ke Marketplace ({releasedLots.length})</span>
          </button>

          <button
            type="button"
            onClick={() => setSelectedStageFilter('processor')}
            className={`px-3 py-1.5 text-xs font-bold rounded-md transition-colors flex items-center gap-1.5 ${
              selectedStageFilter === 'processor'
                ? 'bg-blue-600 text-white'
                : 'bg-blue-50 text-blue-800 hover:bg-blue-100'
            }`}
          >
            <span>Terkirim ke Pengolah ({farmerLots.filter((l) => l.sentToProcessor).length})</span>
          </button>
        </div>

        {/* Filter Inputs: Farmer & Search */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
          <div className="flex flex-wrap items-center gap-3">
            <div className="relative">
              <select
                value={selectedFarmerFilter}
                onChange={(e) => setSelectedFarmerFilter(e.target.value)}
                className="bg-white text-xs border border-stone-300 rounded-md px-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium text-stone-700"
              >
                <option value="all">Semua Petani ({allFarmers.length} Anggota)</option>
                {allFarmers.map((f) => (
                  <option key={f.id} value={f.id}>
                    {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="relative min-w-[240px]">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari Lot ID, varietas, kebun..."
                className="w-full bg-white text-xs border border-stone-300 rounded-md pl-8 pr-3 py-1.5 focus:outline-none focus:border-emerald-500 font-medium text-stone-800 placeholder-stone-400"
              />
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
            </div>
          </div>

          <span className="text-xs text-stone-400">
            Menampilkan <strong>{filteredLots.length}</strong> lot panen
          </span>
        </div>
      </div>

      {/* 4. Main Harvest Lots Table */}
      <div className="bg-white rounded-lg shadow-xs border border-[#d2d6de] overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse min-w-[1100px]">
            <thead>
              <tr className="bg-[#f4f6f9] text-stone-600 border-b border-[#d2d6de] font-bold text-[11px] uppercase tracking-wider whitespace-nowrap">
                <th className="py-3 px-4 whitespace-nowrap">Lot ID &amp; Tanggal</th>
                <th className="py-3 px-4 whitespace-nowrap">Petani &amp; Lahan Blok</th>
                <th className="py-3 px-4 whitespace-nowrap">Timbangan &amp; Brix</th>
                <th className="py-3 px-4 whitespace-nowrap">Varietas &amp; Petik</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Opsi Distribusi</th>
                <th className="py-3 px-4 text-center whitespace-nowrap">Status Alur</th>
                <th className="py-3 px-4 text-right whitespace-nowrap">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredLots.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-16 text-stone-400 text-xs">
                    Tidak ditemukan data lot hasil panen yang cocok.
                  </td>
                </tr>
              ) : (
                filteredLots.map((lot) => {
                  const isReleased = Boolean(lot.isReleasedToMarketplace);

                  return (
                    <tr key={lot.id} className="hover:bg-emerald-50/40 transition-colors group">
                      {/* 1. Lot ID & Tanggal */}
                      <td className="py-3 px-4">
                        <div className="font-bold font-mono text-stone-900 group-hover:text-emerald-700">
                          {lot.id}
                        </div>
                        <div className="text-[11px] text-stone-500 mt-0.5">
                          {lot.harvestDate || '2026-11-14'}
                        </div>
                      </td>

                      {/* 2. Petani & Lahan */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-800">{lot.farmerName}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1 mt-0.5">
                          <TreePine className="w-3 h-3 text-amber-600" />
                          <span className="truncate max-w-[180px]">
                            {lot.farmName || lot.farmLocation}
                          </span>
                        </div>
                      </td>

                      {/* 3. Timbangan & Brix */}
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 font-mono text-xs">
                          {lot.totalWeightKg.toLocaleString()} kg
                        </div>
                        <div className="flex items-center gap-1 text-[11px] text-amber-700 font-bold mt-0.5">
                          <Sparkles className="w-3 h-3 text-amber-500" />
                          <span>{lot.brix ? `${lot.brix}° Bx` : '21.5° Bx'}</span>
                        </div>
                      </td>

                      {/* 4. Varietas & Petik */}
                      <td className="py-3 px-4">
                        <div className="font-medium text-stone-800 truncate max-w-[160px]">
                          {lot.variety}
                        </div>
                        <div className="text-[10px] text-stone-500 truncate max-w-[160px]">
                          {lot.pickingMethod || 'Petik Merah'}
                        </div>
                      </td>

                      {/* 5. Opsi Distribusi (EXACTLY 2 OPTIONS WITH 1-CLICK TOGGLE) */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap whitespace-nowrap">
                          {isReleased ? (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-900 border border-amber-300 whitespace-nowrap shrink-0">
                              <Store className="w-3 h-3 text-amber-600 shrink-0" />
                              <span>Rilis Marketplace</span>
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold bg-stone-100 text-stone-700 border border-stone-300 whitespace-nowrap shrink-0">
                              <Warehouse className="w-3 h-3 text-stone-500 shrink-0" />
                              <span>Gudang Petani</span>
                            </span>
                          )}

                          {/* Quick 1-Click Toggle Button */}
                          <button
                            type="button"
                            onClick={() => toggleReleaseHarvestLotToMarketplace(lot.id)}
                            className="px-2 py-0.5 rounded bg-stone-100 hover:bg-stone-200 text-stone-700 hover:text-stone-900 text-[10px] font-bold border border-stone-300 transition-colors whitespace-nowrap shrink-0 cursor-pointer"
                          >
                            {isReleased ? '← Tarik ke Gudang' : '→ Rilis ke Pasar'}
                          </button>
                        </div>
                      </td>

                      {/* 6. Status Alur & QC ICT */}
                      <td className="py-3 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center justify-center gap-1.5 flex-nowrap whitespace-nowrap">
                          {lot.sentToProcessor ? (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-blue-100 text-blue-800 whitespace-nowrap shrink-0">
                              Di Wet Mill
                            </span>
                          ) : (
                            <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 whitespace-nowrap shrink-0">
                              Di Petani
                            </span>
                          )}

                          {lot.verificationStatus === 'verified' ? (
                            <Link
                              to="/admin/ict"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold bg-blue-100 text-blue-900 border border-blue-200 hover:bg-blue-200 transition-colors whitespace-nowrap shrink-0"
                              title="Lolos Uji Mutu & Brix oleh Tim ICT"
                            >
                              <ShieldCheck className="w-2.5 h-2.5 text-blue-700 shrink-0" />
                              <span>QC ICT Valid</span>
                            </Link>
                          ) : lot.verificationStatus === 'rejected' ? (
                            <Link
                              to="/admin/ict"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold bg-red-100 text-red-900 border border-red-200 hover:bg-red-200 transition-colors whitespace-nowrap shrink-0"
                              title="Afkir / Ditolak oleh Tim ICT"
                            >
                              <XCircle className="w-2.5 h-2.5 text-red-700 shrink-0" />
                              <span>Afkir ICT</span>
                            </Link>
                          ) : (
                            <Link
                              to="/admin/ict"
                              className="inline-flex items-center gap-1 px-2 py-1 rounded text-[9px] font-bold bg-amber-50 text-amber-800 border border-amber-200 hover:bg-amber-100 transition-colors whitespace-nowrap shrink-0"
                              title="Menunggu Uji Mutu Tim ICT"
                            >
                              <span>Audit ICT</span>
                            </Link>
                          )}
                        </div>
                      </td>

                      {/* 7. Action Buttons */}
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <div className="inline-flex items-center justify-end gap-1 flex-nowrap shrink-0">
                          {/* Lembar Detail Traceability */}
                          <Link
                            to={`/admin/panen/detail/${lot.id}`}
                            title="Lembar Detail Traceability"
                            className="p-1.5 text-stone-500 hover:text-emerald-700 hover:bg-emerald-50 rounded transition-colors shrink-0"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>

                          {/* Cetak Barcode Karung */}
                          <button
                            type="button"
                            onClick={() => setSelectedBarcodeLot(lot)}
                            title="Cetak Barcode Karung & QR EUDR"
                            className="p-1.5 text-stone-500 hover:text-stone-800 hover:bg-stone-100 rounded transition-colors shrink-0 cursor-pointer"
                          >
                            <QrCode className="w-4 h-4" />
                          </button>

                          {/* Transfer ke Pengolah */}
                          {!lot.sentToProcessor && (
                            <button
                              type="button"
                              onClick={() => {
                                if (confirm(`Kirim Lot ${lot.id} ke Stasiun Pengolah (Wet Mill)?`)) {
                                  sendHarvestLotToProcessor(lot.id);
                                }
                              }}
                              title="Kirim ke Stasiun Pengolah"
                              className="p-1.5 text-stone-500 hover:text-amber-700 hover:bg-amber-50 rounded transition-colors"
                            >
                              <ArrowRight className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Barcode & QR Code Modal */}
      {selectedBarcodeLot && (
        <FarmerBarcodeModal
          isOpen={true}
          lot={selectedBarcodeLot}
          onClose={() => setSelectedBarcodeLot(null)}
        />
      )}
    </div>
  );
};

export default MasterPanenPage;
