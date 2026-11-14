import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { WarehouseLot } from '../../../types/coffee';
import { PurchaseOrder, GreenBeanSample } from '../../../types/roasterErp';
import {
  ShoppingCart,
  PlusCircle,
  Truck,
  CheckCircle2,
  Clock,
  Search,
  Filter,
  Package,
  Layers,
  Sparkles,
  ArrowRight,
  X,
  Award,
  DollarSign,
  FileText,
  ShieldCheck,
  Building,
  Calendar,
  Warehouse,
  Flame,
  Droplets,
  Thermometer,
  QrCode,
  Tag,
} from 'lucide-react';
import { WarehouseBarcodeModal } from '../../../components/WarehouseBarcodeModal';

export const RoasterSourcingPage: React.FC = () => {
  const {
    currentUser,
    warehouseLots,
    purchaseOrders,
    greenBeanSamples,
    buyWarehouseBeanAndRoast,
    createPurchaseOrder,
  } = useCoffee();
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState<'catalog' | 'orders' | 'samples'>('catalog');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedProcessFilter, setSelectedProcessFilter] = useState<string>('all');
  const [buyingLot, setBuyingLot] = useState<WarehouseLot | null>(null);
  const [buyKg, setBuyKg] = useState<number>(30);
  const [traceLot, setTraceLot] = useState<WarehouseLot | null>(null);
  const [purchaseSuccess, setPurchaseSuccess] = useState<string | null>(null);

  // Filter warehouse lots ready for roasting (green beans)
  const availableWarehouseLots = warehouseLots.filter((lot) => lot.availableWeightKg > 0);

  const filteredLots = availableWarehouseLots.filter((lot) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      lot.id.toLowerCase().includes(q) ||
      lot.variety.toLowerCase().includes(q) ||
      lot.origin.toLowerCase().includes(q) ||
      lot.sourceProcessorName.toLowerCase().includes(q) ||
      lot.sourceFarmerName.toLowerCase().includes(q);

    const matchProcess =
      selectedProcessFilter === 'all' || lot.processMethod === selectedProcessFilter;
    return matchSearch && matchProcess;
  });

  const myPOs = purchaseOrders.filter((p) => !p.roasterId || p.roasterId === currentUser?.id);
  const mySamples = greenBeanSamples.filter((s) => !s.roasterId || s.roasterId === currentUser?.id);

  // Handle direct buy green beans for roastery
  const handleConfirmBuy = (e: React.FormEvent) => {
    e.preventDefault();
    if (!buyingLot) return;

    // Use context method to purchase green bean lot
    buyWarehouseBeanAndRoast(buyingLot.id, buyKg, {
      roasterMachine: 'Giesen W6A Artisan',
      roastLevel: 'Medium Roast',
      agtronNumber: 65,
      developmentTimeRatio: 14.5,
      tastingNotes: ['Brown Sugar', 'Orange Citrus', 'Milk Chocolate'],
      scaCuppingScore: 85.5,
      packageWeightGrams: 250,
      totalPacks: Math.floor((buyKg * 0.85 * 1000) / 250),
      pricePerPack: 95000,
      restingRecommendationDays: 10,
      recommendedBrew: ['V60', 'Aeropress'],
    });

    setPurchaseSuccess(
      `Pengadaan ${buyKg} kg green bean ${buyingLot.variety} dari ${buyingLot.warehouseName} berhasil disimpan ke stok sangrai!`
    );
    setBuyingLot(null);

    setTimeout(() => {
      setPurchaseSuccess(null);
    }, 4000);
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-emerald-100 text-emerald-900 border border-emerald-300">
              Pengadaan Bahan Baku Kopi Mentah (Green Beans)
            </span>
            <span className="text-xs text-stone-600 font-medium flex items-center gap-1">
              <Building className="w-3.5 h-3.5" /> Sourcing Langsung dari Gudang & Pengolah
            </span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <ShoppingCart className="w-7 h-7 text-emerald-600" />
            Pengadaan Green Beans Roastery
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Beli green bean bersertifikat mutu SCA & SNI dari gudang mitra untuk stok produksi roasting.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/admin/roaster/production"
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
          >
            <Flame className="w-4 h-4" />
            Ke Jadwal Roasting
          </Link>
          <Link
            to="/admin/roaster/inventory"
            className="px-3.5 py-2.5 rounded-xl border border-stone-300 text-stone-700 hover:bg-stone-50 text-xs font-bold transition-all flex items-center gap-1.5"
          >
            <Warehouse className="w-4 h-4 text-stone-500" />
            Rak Inventory
          </Link>
        </div>
      </div>

      {/* SUCCESS NOTIFICATION */}
      {purchaseSuccess && (
        <div className="p-4 rounded-xl bg-emerald-500 text-white font-bold flex items-center gap-3 shadow-lg animate-pulse">
          <CheckCircle2 className="w-6 h-6 flex-shrink-0" />
          <span>{purchaseSuccess}</span>
        </div>
      )}

      {/* NAVIGATION TABS */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          type="button"
          onClick={() => setActiveTab('catalog')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'catalog'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Katalog Green Bean Gudang ({availableWarehouseLots.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'orders'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <FileText className="w-4 h-4" />
          Purchase Orders ({myPOs.length})
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('samples')}
          className={`px-4 py-2 rounded-xl text-xs font-black transition-all flex items-center gap-2 ${
            activeTab === 'samples'
              ? 'bg-stone-900 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Award className="w-4 h-4" />
          Uji Sampel Green Bean ({mySamples.length})
        </button>
      </div>

      {/* TAB 1: CATALOG GREEN BEANS READY TO BUY */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          {/* SEARCH & PROCESS FILTER */}
          <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
              <input
                type="text"
                placeholder="Cari lot, varietas, asal, gudang..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-emerald-500 focus:outline-none"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto">
              <span className="text-xs font-bold text-stone-600 flex items-center gap-1 flex-shrink-0">
                <Filter className="w-3.5 h-3.5" /> Proses:
              </span>
              {['all', 'Natural', 'Washed', 'Honey', 'Anaerobic Natural'].map((proc) => (
                <button
                  key={proc}
                  type="button"
                  onClick={() => setSelectedProcessFilter(proc)}
                  className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                    selectedProcessFilter === proc
                      ? 'bg-emerald-600 text-white shadow-sm'
                      : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                  }`}
                >
                  {proc === 'all' ? 'Semua Proses' : proc}
                </button>
              ))}
            </div>
          </div>

          {/* CATALOG GRID */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-stone-200 shadow-sm hover:border-emerald-300 transition-all p-5 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex items-center justify-between text-xs mb-2">
                    <span className="font-mono font-black text-stone-900 bg-stone-100 px-2 py-0.5 rounded border border-stone-200">
                      {lot.id}
                    </span>
                    <span className="px-2 py-0.5 rounded-full font-black text-[11px] bg-emerald-100 text-emerald-900 border border-emerald-300">
                      Grade 1 Specialty
                    </span>
                  </div>

                  <h3 className="text-base font-black text-stone-900">
                    {lot.variety} • {lot.processMethod}
                  </h3>
                  <p className="text-xs text-stone-600 mt-0.5">
                    {lot.origin} • {lot.altitude} mdpl
                  </p>
                  <p className="text-[11px] text-stone-600 mt-1">
                    Gudang: <strong>{lot.warehouseName}</strong> (Mitra Petani: {lot.sourceFarmerName})
                  </p>

                  {/* Physical metrics */}
                  <div className="grid grid-cols-3 gap-2 mt-3 p-2.5 bg-stone-50 rounded-xl border border-stone-200 text-center text-xs">
                    <div>
                      <span className="text-[10px] text-stone-600 block">Kadar Air</span>
                      <span className="font-mono font-bold text-stone-900">{lot.moistureContentPercent || 11.2}%</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-600 block">Defect</span>
                      <span className="font-mono font-bold text-stone-900">{lot.defectCount} butir</span>
                    </div>
                    <div>
                      <span className="text-[10px] text-stone-600 block">Stok Gudang</span>
                      <span className="font-mono font-bold text-emerald-700">{lot.availableWeightKg} kg</span>
                    </div>
                  </div>
                </div>

                <div className="pt-2 border-t border-stone-100 space-y-3">
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs text-stone-600 font-bold">Harga per kg:</span>
                    <span className="text-lg font-black font-mono text-emerald-700">
                      Rp {lot.pricePerKg.toLocaleString('id-ID')}
                    </span>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <button
                      type="button"
                      onClick={() => setTraceLot(lot)}
                      className="py-2 px-3 rounded-xl border border-stone-200 text-stone-700 hover:bg-stone-50 font-bold text-xs flex items-center justify-center gap-1.5"
                    >
                      <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
                      Lacak Asal
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setBuyingLot(lot);
                        setBuyKg(Math.min(30, lot.availableWeightKg));
                      }}
                      className="py-2 px-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-xs shadow-md shadow-emerald-600/20 flex items-center justify-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Beli Green Bean
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: PURCHASE ORDERS LIST */}
      {activeTab === 'orders' && (
        <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
          <div className="p-4 bg-stone-50 border-b border-stone-200">
            <h3 className="text-sm font-black text-stone-900">Riwayat Purchase Order Roastery</h3>
          </div>
          <table className="w-full text-xs text-left min-w-[950px]">
            <thead className="bg-stone-100 text-stone-600 font-bold uppercase tracking-wider text-[10px] whitespace-nowrap">
              <tr>
                <th className="p-3 whitespace-nowrap">No. PO</th>
                <th className="p-3 whitespace-nowrap">Tanggal</th>
                <th className="p-3 whitespace-nowrap">Supplier / Gudang</th>
                <th className="p-3 whitespace-nowrap">Item Kopi</th>
                <th className="p-3 whitespace-nowrap">Jumlah (kg)</th>
                <th className="p-3 whitespace-nowrap">Total Harga</th>
                <th className="p-3 whitespace-nowrap">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100 font-medium">
              {myPOs.map((po) => (
                <tr key={po.id} className="hover:bg-stone-50">
                  <td className="p-3 font-mono font-bold text-stone-900 whitespace-nowrap">{po.poNumber}</td>
                  <td className="p-3 text-stone-600 whitespace-nowrap">{po.orderDate}</td>
                  <td className="p-3 font-bold text-stone-800 whitespace-nowrap">{po.supplierName}</td>
                  <td className="p-3 whitespace-nowrap">{po.items[0]?.variety || 'Arabica'} ({po.items[0]?.processMethod || 'Natural'})</td>
                  <td className="p-3 font-mono font-bold whitespace-nowrap">{po.items.reduce((acc, it) => acc + (it.totalWeightKg || 0), 0)} kg</td>
                  <td className="p-3 font-mono font-bold text-emerald-700 whitespace-nowrap">Rp {po.totalAmount.toLocaleString('id-ID')}</td>
                  <td className="p-3 whitespace-nowrap">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 whitespace-nowrap shrink-0">
                      {po.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* TAB 3: SAMPLE EVALUATION LIST */}
      {activeTab === 'samples' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {mySamples.map((sample) => (
            <div key={sample.id} className="bg-white rounded-2xl p-5 border border-stone-200 shadow-sm space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-mono text-stone-600 uppercase block">{sample.id}</span>
                  <h4 className="text-sm font-black text-stone-900">{sample.sampleName}</h4>
                  <p className="text-xs text-stone-600">{sample.supplierName} • {sample.origin}</p>
                </div>
                <span className="px-2.5 py-1 rounded-xl text-xs font-mono font-black bg-amber-100 text-amber-900 border border-amber-300">
                  {sample.sampleCuppingScore} SCA
                </span>
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                <span className="text-[10px] text-stone-600 font-bold block mb-1">Catatan Rasa Cupping:</span>
                <p className="text-stone-700 italic">"{sample.cuppingNotes?.join(', ') || sample.evaluationNotes}"</p>
              </div>

              <div className="flex justify-between items-center text-xs text-stone-600 pt-1">
                <span>Moisture: <strong>{sample.moisturePercent}%</strong></span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800">
                  {sample.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BUY CONFIRMATION MODAL */}
      {buyingLot && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-md w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <ShoppingCart className="w-5 h-5 text-emerald-600" />
                  Konfirmasi Pengadaan Green Bean
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">Beli dari Gudang untuk Stok Sangrai Roastery.</p>
              </div>
              <button
                type="button"
                onClick={() => setBuyingLot(null)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            <form onSubmit={handleConfirmBuy} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50 rounded-xl border border-emerald-200 space-y-1">
                <span className="font-black text-emerald-950 block">{buyingLot.variety} ({buyingLot.processMethod})</span>
                <p className="text-stone-600">Asal: {buyingLot.origin} • Gudang: {buyingLot.warehouseName}</p>
                <p className="font-mono font-bold text-emerald-800">
                  Harga: Rp {buyingLot.pricePerKg.toLocaleString('id-ID')} / kg (Tersedia: {buyingLot.availableWeightKg} kg)
                </p>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Jumlah yang Ingin Dibeli (kg)
                </label>
                <input
                  type="number"
                  min="5"
                  max={buyingLot.availableWeightKg}
                  value={buyKg}
                  onChange={(e) => setBuyKg(Number(e.target.value))}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-mono font-bold text-sm focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="p-3 bg-stone-50 rounded-xl border border-stone-200 flex justify-between items-center font-bold">
                <span className="text-stone-600">Total Pembayaran:</span>
                <span className="font-mono font-black text-base text-emerald-700">
                  Rp {(buyKg * buyingLot.pricePerKg).toLocaleString('id-ID')}
                </span>
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setBuyingLot(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-black shadow-md shadow-emerald-600/20"
                >
                  Konfirmasi Pembelian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* WAREHOUSE BARCODE & TRACEABILITY MODAL */}
      {traceLot && (
        <WarehouseBarcodeModal
          isOpen={!!traceLot}
          onClose={() => setTraceLot(null)}
          lot={traceLot}
        />
      )}
    </div>
  );
};
