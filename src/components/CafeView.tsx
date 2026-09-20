import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Coffee,
  ShoppingCart,
  Layers,
  History,
  CheckCircle2,
  TrendingUp,
  Sparkles,
  QrCode,
  Eye,
  PlusCircle,
  Package,
  X,
  ArrowRight,
  Search,
  SlidersHorizontal,
  Calculator,
  DollarSign,
  Tag,
  Award,
  Printer,
  ChevronRight,
  Flame,
  Store,
  Receipt,
  FileSpreadsheet,
} from 'lucide-react';
import { CafeInventoryItem } from '../types/coffee';
import { TraceabilityModal } from './TraceabilityModal';
import { CafeCupBarcodeModal } from './CafeCupBarcodeModal';
import { MetricCard } from './admin/MetricCard';

export const CafeView: React.FC = () => {
  const {
    currentUser,
    cafeInventory,
    cafeProducts,
    addCafeRetailProduct,
    transactions,
    setActiveView,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'inventory' | 'create_product' | 'my_products' | 'calculator' | 'history'>('inventory');
  const [searchQuery, setSearchQuery] = useState('');
  const [traceModalData, setTraceModalData] = useState<any | null>(null);
  const [tableCardItem, setTableCardItem] = useState<CafeInventoryItem | null>(null);
  const [cupBarcodeItem, setCupBarcodeItem] = useState<CafeInventoryItem | null>(null);

  // Form State for Cafe Retail Product
  const [prodName, setProdName] = useState('Seduh Teduh House Blend Espresso 250g');
  const [prodOrigin, setProdOrigin] = useState('Pangalengan Java x Gayo');
  const [prodVariety, setProdVariety] = useState('Typica & Ateng Super Blend');
  const [prodRoastLevel, setProdRoastLevel] = useState('Medium Roast');
  const [prodPrice, setProdPrice] = useState<number>(110000);
  const [prodUnit, setProdUnit] = useState('Pack (250g)');
  const [prodStock, setProdStock] = useState<number>(40);
  const [prodDesc, setProdDesc] = useState('Signature blend cafe untuk seduhan espresso, cappuccino, dan cold drip.');
  const [noteInput, setNoteInput] = useState('');
  const [prodNotes, setProdNotes] = useState<string[]>(['Milk Chocolate', 'Caramel', 'Sweet Toffee']);
  const [successMsg, setSuccessMsg] = useState('');

  // Barista Recipe & Cup Margin Calculator State
  const [calcSelectedBean, setCalcSelectedBean] = useState<string>('');
  const [calcDoseGrams, setCalcDoseGrams] = useState<number>(15);
  const [calcCupPrice, setCalcCupPrice] = useState<number>(32000);
  const [calcExtraCost, setCalcExtraCost] = useState<number>(4500); // cup, milk, ice, sleeve

  const myCafeInventory = cafeInventory.filter(
    (item) => item.cafeId === currentUser?.id || true
  );

  const myCafeProducts = cafeProducts.filter(
    (prod) => prod.cafeId === currentUser?.id || true
  );

  const myCafeTransactions = transactions.filter(
    (t) => t.fromName === currentUser?.name || t.toName === currentUser?.name || t.fromRole === 'cafe' || t.toRole === 'cafe'
  );

  const totalPacksInStock = myCafeInventory.reduce((acc, curr) => acc + curr.packsInStock, 0);
  const totalWeightKg = myCafeInventory.reduce((acc, curr) => acc + (curr.packsInStock * curr.packWeightGrams) / 1000, 0);
  const totalSpend = myCafeTransactions
    .filter((t) => t.toRole === 'cafe')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

  const retailInventoryValue = myCafeProducts.reduce(
    (acc, curr) => acc + curr.price * curr.availableStock,
    0
  );

  // Filtered Inventory
  const filteredInventory = myCafeInventory.filter((item) => {
    const q = searchQuery.toLowerCase();
    return (
      item.beanName.toLowerCase().includes(q) ||
      item.roasterName.toLowerCase().includes(q) ||
      item.variety.toLowerCase().includes(q) ||
      item.processMethod.toLowerCase().includes(q)
    );
  });

  // Selected item for calculator
  const activeCalcItem = myCafeInventory.find((i) => i.id === calcSelectedBean) || myCafeInventory[0] || null;
  const costPerGram = activeCalcItem ? activeCalcItem.costPerPack / activeCalcItem.packWeightGrams : 480;
  const beanCostPerCup = costPerGram * calcDoseGrams;
  const totalCostPerCup = beanCostPerCup + calcExtraCost;
  const profitPerCup = calcCupPrice - totalCostPerCup;
  const marginPercentage = calcCupPrice > 0 ? (profitPerCup / calcCupPrice) * 100 : 0;
  const estimatedCupsPerPack = activeCalcItem ? Math.floor(activeCalcItem.packWeightGrams / calcDoseGrams) : 16;
  const totalRevenuePerPack = estimatedCupsPerPack * calcCupPrice;
  const totalProfitPerPack = estimatedCupsPerPack * profitPerCup;

  const handleAddNote = () => {
    if (noteInput.trim() && !prodNotes.includes(noteInput.trim())) {
      setProdNotes([...prodNotes, noteInput.trim()]);
      setNoteInput('');
    }
  };

  const handleRemoveNote = (note: string) => {
    setProdNotes(prodNotes.filter((n) => n !== note));
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    addCafeRetailProduct({
      name: prodName,
      origin: prodOrigin,
      variety: prodVariety,
      roastLevel: prodRoastLevel,
      tastingNotes: prodNotes.length > 0 ? prodNotes : ['Balanced Sweetness', 'Rich Body'],
      price: Number(prodPrice),
      packageUnit: prodUnit,
      totalStock: Number(prodStock),
      description: prodDesc,
      photoUrl: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=600&auto=format&fit=crop&q=80',
    });

    setSuccessMsg(`Sukses menambahkan ${prodName} ke Katalog Menu & Toko Kedai Anda!`);
    setActiveTab('my_products');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Cruip Hero Header */}
      <div className="relative overflow-hidden bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 rounded-3xl border border-stone-800 p-6 lg:p-8 text-white shadow-xl">
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold mb-3 backdrop-blur-sm">
            <Coffee className="w-3.5 h-3.5 text-amber-400" />
            <span>Barista Bar Station & Coffee Shop Management</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          </div>

          <h1 className="text-2xl lg:text-3xl font-black tracking-tight text-white">
            Kelola Bar Seduh & Etalase Kedai Specialty
          </h1>
          <p className="mt-2 text-stone-300 text-xs lg:text-sm leading-relaxed">
            Sajikan pengalaman kopi berkelas dengan transparansi silsilah biji <em>(Farm-to-Cup)</em>. Cetak stiker QR gelas, pasang kartu meja interaktif, hitung HPP per cup otomatis, dan terbitkan produk retail ke toko kedai Anda.
          </p>

          <div className="mt-5 flex flex-wrap gap-3">
            <button
              onClick={() => setActiveView('marketplace')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 active:scale-95"
            >
              <ShoppingCart className="w-4 h-4" />
              Restok Beans di Marketplace
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setActiveTab('calculator')}
              className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold text-xs border border-white/10 transition-colors"
            >
              <Calculator className="w-4 h-4 text-amber-300" />
              Kalkulator Dosing & Margin Cup
            </button>
          </div>
        </div>

        {/* Ambient Decorative Background */}
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-12 opacity-10 pointer-events-none text-white">
          <Coffee className="w-96 h-96" />
        </div>
      </div>

      {/* Cruip KPI Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Stok Biji di Bar"
          value={`${totalPacksInStock} Pack`}
          subtitle={`${totalWeightKg.toFixed(1)} kg total biji siap diseduh`}
          trend={{ value: 'Stok Aman', isPositive: true }}
          icon={<Coffee className="w-5 h-5" />}
          color="amber"
          progress={{ current: totalPacksInStock, total: 60 }}
        />
        <MetricCard
          title="Varian Single Origin"
          value={`${myCafeInventory.length} Varian`}
          subtitle="Tersertifikasi SCA & Direct Trade"
          trend={{ value: '100% Traceable', isPositive: true }}
          icon={<Layers className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Etalase Retail Kedai"
          value={`${myCafeProducts.length} Produk`}
          subtitle={`Nilai Rp ${retailInventoryValue.toLocaleString()}`}
          trend={{ value: '+4 Penjualan Pekan Ini', isPositive: true }}
          icon={<Store className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Total Belanja Beans"
          value={`Rp ${totalSpend.toLocaleString()}`}
          subtitle={`${myCafeTransactions.length} Pengadaan langsung`}
          trend={{ value: 'Direct Trade HPP', isPositive: true }}
          icon={<TrendingUp className="w-5 h-5" />}
          color="stone"
        />
      </div>

      {/* Success Notification Alert */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs font-semibold flex items-center justify-between shadow-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>{successMsg}</span>
          </div>
          <button onClick={() => setSuccessMsg('')} className="text-emerald-700 hover:text-emerald-900">
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <div className="bg-white rounded-2xl p-1.5 border border-stone-200 shadow-xs flex flex-wrap gap-1">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'inventory'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Coffee className="w-4 h-4" />
          <span>Barista Bar ({myCafeInventory.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('calculator')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'calculator'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Calculator className="w-4 h-4 text-amber-400" />
          <span>Kalkulator Seduh & Margin</span>
        </button>

        <button
          onClick={() => setActiveTab('my_products')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'my_products'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Package className="w-4 h-4" />
          <span>Etalase Retail Toko ({myCafeProducts.length})</span>
        </button>

        <button
          onClick={() => setActiveTab('create_product')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'create_product'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          <span>+ Rilis Menu / Retail</span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`flex-1 min-w-[140px] py-2.5 px-4 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 ${
            activeTab === 'history'
              ? 'bg-stone-900 text-white shadow-xs'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Buku Pengeluaran ({myCafeTransactions.length})</span>
        </button>
      </div>

      {/* TAB 1: BARISTA BAR INVENTARIS */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          {/* Action Toolbar */}
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari biji kopi, roastery, profil..."
                className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
              <span className="text-xs text-stone-500 font-medium">
                Menampilkan <strong>{filteredInventory.length}</strong> varian di bar
              </span>
              <button
                onClick={() => setActiveView('marketplace')}
                className="px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
              >
                <ShoppingCart className="w-3.5 h-3.5" />
                Belanja Beans
              </button>
            </div>
          </div>

          {/* Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredInventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between group"
              >
                <div>
                  {/* Card Header */}
                  <div className="p-5 bg-gradient-to-br from-amber-50/70 via-stone-50 to-white border-b border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Ready at Bar
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-black bg-stone-900 text-amber-300 px-2.5 py-0.5 rounded-md shadow-xs">
                        <Award className="w-3 h-3 text-amber-400" />
                        SCA {item.scaScore}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 leading-tight group-hover:text-amber-800 transition-colors">
                      {item.beanName}
                    </h3>
                    <div className="flex items-center gap-2 text-xs text-stone-500 mt-1">
                      <span>Roaster: <strong className="text-stone-700">{item.roasterName}</strong></span>
                      <span>•</span>
                      <span className="px-1.5 py-0.5 bg-stone-100 rounded text-[11px] font-medium text-stone-600">
                        {item.roastLevel}
                      </span>
                    </div>
                  </div>

                  {/* Flavor Notes & Metadata */}
                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 uppercase tracking-wider block mb-1.5">
                        Tasting Profile:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.tastingNotes.map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200/70"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Silsilah Summary Box */}
                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/70 text-xs space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Petani / Asal:</span>
                        <strong className="text-stone-800 truncate max-w-[160px]">{item.lineage.farmerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Ketinggian Kebun:</span>
                        <strong className="text-emerald-700 font-semibold">{item.lineage.altitude}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Metode Fermentasi:</span>
                        <strong className="text-stone-800">{item.processMethod}</strong>
                      </div>
                    </div>

                    {/* Quick Tools & Tracing */}
                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => setCupBarcodeItem(item)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-stone-900 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-xs"
                      >
                        <QrCode className="w-4 h-4 text-amber-300" />
                        🏷️ Cetak Stiker QR Gelas (Takeaway Cup)
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setTableCardItem(item)}
                          className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-stone-300"
                        >
                          <Printer className="w-3.5 h-3.5 text-stone-600" />
                          Kartu Meja
                        </button>

                        <button
                          onClick={() => setTraceModalData(item)}
                          className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-stone-300"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          Silsilah Lengkap
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Footer Stok */}
                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Stok di Bar:</span>
                    <span className="text-sm font-black text-amber-900">
                      {item.packsInStock} Pack
                      <span className="text-xs font-normal text-stone-500"> ({((item.packsInStock * item.packWeightGrams) / 1000).toFixed(1)} kg)</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-medium">HPP Pembelian:</span>
                    <span className="text-xs font-bold text-stone-800">
                      Rp {item.costPerPack.toLocaleString()} / pack
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: KALKULATOR DOSING & MARGIN SEDUH */}
      {activeTab === 'calculator' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Input Controls */}
          <div className="lg:col-span-6 bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-5">
            <div className="flex items-center gap-2 border-b border-stone-100 pb-4">
              <div className="p-2.5 rounded-xl bg-amber-50 text-amber-700">
                <Calculator className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-bold text-stone-900">Kalkulator Dosing & HPP per Cup</h2>
                <p className="text-xs text-stone-500">Hitung profitabilitas seduh manual brew, espresso, atau milk-based drink.</p>
              </div>
            </div>

            {/* Select Bean */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                Pilih Biji Kopi di Bar
              </label>
              <select
                value={calcSelectedBean || (activeCalcItem?.id || '')}
                onChange={(e) => setCalcSelectedBean(e.target.value)}
                className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-medium text-stone-800 focus:ring-2 focus:ring-amber-500"
              >
                {myCafeInventory.map((item) => (
                  <option key={item.id} value={item.id}>
                    {item.beanName} (Rp {item.costPerPack.toLocaleString()} / {item.packWeightGrams}g)
                  </option>
                ))}
              </select>
            </div>

            {/* Gram Dose */}
            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label className="text-xs font-bold text-stone-700 uppercase tracking-wider">
                  Dosis Biji Kopi per Gelas (Gram)
                </label>
                <span className="text-xs font-mono font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-md border border-amber-200">
                  {calcDoseGrams} g / cup
                </span>
              </div>
              <input
                type="range"
                min="10"
                max="25"
                step="0.5"
                value={calcDoseGrams}
                onChange={(e) => setCalcDoseGrams(Number(e.target.value))}
                className="w-full accent-amber-600"
              />
              <div className="flex justify-between text-[10px] text-stone-400 mt-1">
                <span>10g (Light Filter)</span>
                <span>15g (V60 Standard)</span>
                <span>18g-20g (Double Espresso)</span>
                <span>25g (Bold / Iced)</span>
              </div>
            </div>

            {/* Extra Cost (Milk, Cup, Ice, etc.) */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Biaya Kemasan & Add-on (Rp)
                </label>
                <input
                  type="number"
                  step="500"
                  value={calcExtraCost}
                  onChange={(e) => setCalcExtraCost(Number(e.target.value))}
                  placeholder="Cup, sedotan, susu..."
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Cup takeaway + sedotan + susu</span>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1.5">
                  Harga Jual Minuman di Menu (Rp)
                </label>
                <input
                  type="number"
                  step="1000"
                  value={calcCupPrice}
                  onChange={(e) => setCalcCupPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-xs font-semibold text-stone-800 focus:ring-2 focus:ring-amber-500"
                />
                <span className="text-[10px] text-stone-400 mt-1 block">Harga tertera di menu kasir</span>
              </div>
            </div>
          </div>

          {/* Results Summary Card */}
          <div className="lg:col-span-6 bg-gradient-to-br from-stone-900 to-amber-950 text-white rounded-3xl p-6 shadow-xl flex flex-col justify-between border border-stone-800">
            <div>
              <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-5">
                <span className="text-xs uppercase font-bold tracking-widest text-amber-400">
                  Estimasi Profitabilitas Seduh
                </span>
                <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                  Margin: {marginPercentage.toFixed(1)}%
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">HPP Biji Kopi / Cup:</span>
                  <span className="text-lg font-black text-amber-300">
                    Rp {Math.round(beanCostPerCup).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">({calcDoseGrams}g @ Rp {Math.round(costPerGram)}/g)</span>
                </div>

                <div className="bg-white/5 p-4 rounded-2xl border border-white/10">
                  <span className="text-[10px] text-stone-400 uppercase font-semibold block">Total HPP per Gelas:</span>
                  <span className="text-lg font-black text-stone-200">
                    Rp {Math.round(totalCostPerCup).toLocaleString()}
                  </span>
                  <span className="text-[10px] text-stone-400 block mt-0.5">+ Biaya cup & bahan Rp {calcExtraCost.toLocaleString()}</span>
                </div>
              </div>

              {/* Profit per cup */}
              <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-4 mb-5">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-xs text-emerald-300 font-bold block">Gross Profit per Cup:</span>
                    <span className="text-2xl font-black text-emerald-400">
                      Rp {Math.round(profitPerCup).toLocaleString()}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-xs text-stone-400 block">Harga Jual Menu:</span>
                    <span className="text-base font-black text-white">
                      Rp {calcCupPrice.toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>

              {/* Yield per Pack */}
              <div className="space-y-2 text-xs border-t border-white/10 pt-4">
                <div className="flex justify-between text-stone-300">
                  <span>Hasil Seduh per Pack ({activeCalcItem?.packWeightGrams || 250}g):</span>
                  <strong className="text-white font-mono">{estimatedCupsPerPack} Gelas</strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Potensi Omzet per Pack:</span>
                  <strong className="text-amber-300 font-mono">Rp {totalRevenuePerPack.toLocaleString()}</strong>
                </div>
                <div className="flex justify-between text-stone-300">
                  <span>Estimasi Laba Bersih per Pack:</span>
                  <strong className="text-emerald-400 font-mono">Rp {Math.round(totalProfitPerPack).toLocaleString()}</strong>
                </div>
              </div>
            </div>

            <div className="pt-4 mt-4 border-t border-white/10 text-[11px] text-stone-400 italic">
              💡 Transparansi cerita silsilah di kartu meja terbukti meningkatkan konversi penjualan menu specialty hingga 40%.
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: ETALASE PRODUK CAFE */}
      {activeTab === 'my_products' && (
        <div className="space-y-4">
          <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Katalog Menu & Retail Pack Kedai ({myCafeProducts.length})
              </h2>
              <p className="text-xs text-stone-500">
                Produk yang aktif ditampilkan di etalase toko dan menu pesanan kedai Anda.
              </p>
            </div>
            <button
              onClick={() => setActiveTab('create_product')}
              className="px-3.5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Tambah Produk Retail
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCafeProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-stone-900">
                    <img
                      src={prod.photoUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {prod.id}
                    </div>
                    <div className="absolute top-3 right-3 bg-white text-stone-900 text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {prod.packageUnit}
                    </div>
                  </div>

                  <div className="p-5 space-y-2.5">
                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      {prod.name}
                    </h3>
                    <p className="text-xs text-stone-500">
                      {prod.origin} • {prod.roastLevel}
                    </p>

                    <div className="flex flex-wrap gap-1 pt-1">
                      {prod.tastingNotes.map((note, i) => (
                        <span
                          key={i}
                          className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                        >
                          {note}
                        </span>
                      ))}
                    </div>

                    <p className="text-xs text-stone-600 line-clamp-2 italic pt-1">
                      "{prod.description}"
                    </p>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block font-medium">Harga Jual:</span>
                    <span className="text-sm font-black text-stone-900">
                      Rp {prod.price.toLocaleString()}
                      <span className="text-xs font-normal text-stone-500"> / {prod.packageUnit}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block font-medium">Stok Retail:</span>
                    <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-md border border-emerald-200">
                      {prod.availableStock} / {prod.totalStock} tersedia
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: TAMBAH PRODUK BARU */}
      {activeTab === 'create_product' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-3xl">
          <div className="mb-6 pb-4 border-b border-stone-100">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              Rilis Menu / Retail Pack ke Toko Kedai
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Sebagai pemilik cafe, Anda dapat menjual signature house blend, cold brew bottle, drip bag, atau merchandise ke pengunjung dan ekosistem.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Produk Kopi / Menu
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Seduh Teduh House Blend Espresso 250g"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Asal Daerah (Origin)
                </label>
                <input
                  type="text"
                  required
                  value={prodOrigin}
                  onChange={(e) => setProdOrigin(e.target.value)}
                  placeholder="Contoh: Pangalengan x Aceh Gayo"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Varietas
                </label>
                <input
                  type="text"
                  required
                  value={prodVariety}
                  onChange={(e) => setProdVariety(e.target.value)}
                  placeholder="Contoh: Typica & Ateng Blend"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Profil Sangrai
                </label>
                <select
                  value={prodRoastLevel}
                  onChange={(e) => setProdRoastLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Light Roast">Light Roast (Filter)</option>
                  <option value="Light-Medium">Light-Medium Roast</option>
                  <option value="Medium Roast">Medium Roast (Omni / Espresso)</option>
                  <option value="Dark Roast">Dark Roast (Bold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Format Kemasan
                </label>
                <input
                  type="text"
                  required
                  value={prodUnit}
                  onChange={(e) => setProdUnit(e.target.value)}
                  placeholder="Pack (250g), Box (5 Drip Bags), Botol (500ml)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Harga Jual Satuan (Rp)
                </label>
                <input
                  type="number"
                  required
                  step="1000"
                  value={prodPrice}
                  onChange={(e) => setProdPrice(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Jumlah Stok Rilis
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 font-semibold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Deskripsi Menu / Produk
              </label>
              <textarea
                rows={2}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
              />
            </div>

            {/* Tasting Notes */}
            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Karakter Rasa (Tasting Notes)
              </label>
              <div className="flex gap-2 mb-2">
                <input
                  type="text"
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddNote();
                    }
                  }}
                  placeholder="Ketik aroma (misal: Milk Chocolate, Toffee)..."
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500"
                />
                <button
                  type="button"
                  onClick={handleAddNote}
                  className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors"
                >
                  Tambah
                </button>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {prodNotes.map((note) => (
                  <span
                    key={note}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-100 text-amber-900 border border-amber-300"
                  >
                    {note}
                    <button
                      type="button"
                      onClick={() => handleRemoveNote(note)}
                      className="hover:text-red-700 ml-1 text-sm font-bold"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-3 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Terbitkan ke Katalog Kedai
              </button>
            </div>
          </form>
        </div>
      )}

      {/* TAB 5: RIWAYAT TRANSAKSI & PENGELUARAN */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-2 border-b border-stone-100">
            <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
              <History className="w-5 h-5 text-stone-800" />
              Buku Pengeluaran & Transaksi Cafe
            </h2>
            <span className="text-xs text-stone-500 font-medium">
              Total Pengeluaran: <strong>Rp {totalSpend.toLocaleString()}</strong>
            </span>
          </div>

          {myCafeTransactions.length === 0 ? (
            <div className="text-center py-12 text-stone-400">
              <Receipt className="w-10 h-10 mx-auto mb-2 opacity-50" />
              <p className="text-xs">Belum ada riwayat transaksi pengadaan.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. TRX</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pengirim</th>
                    <th className="py-3 px-4">Penerima</th>
                    <th className="py-3 px-4">Komoditas Beans</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Total Biaya</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myCafeTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/50 transition-colors">
                      <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                      <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.fromName}</td>
                      <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                      <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                      <td className="py-3 px-4 font-bold text-stone-800">{trx.quantity}</td>
                      <td className="py-3 px-4 font-black text-stone-900">
                        Rp {trx.totalAmount.toLocaleString()}
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                          {trx.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Modal Digital Table Card untuk Pelanggan Cafe */}
      {tableCardItem && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-[#FAF6F0] rounded-3xl max-w-md w-full shadow-2xl border-4 border-amber-900/20 overflow-hidden my-8 p-6 text-stone-900 text-center">
            <button
              onClick={() => setTableCardItem(null)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="w-12 h-12 rounded-2xl bg-amber-900 text-amber-200 flex items-center justify-center mx-auto mb-3 shadow-md">
              <Coffee className="w-7 h-7" />
            </div>

            <div className="text-[10px] uppercase font-bold tracking-widest text-amber-800">
              {tableCardItem.cafeName}
            </div>
            <h2 className="text-xl font-black mt-1 text-stone-950">
              {tableCardItem.beanName}
            </h2>
            <div className="text-xs text-stone-600 mb-4">
              {tableCardItem.variety} • {tableCardItem.processMethod} • {tableCardItem.roastLevel}
            </div>

            {/* Flavor chips */}
            <div className="flex flex-wrap justify-center gap-1 mb-5">
              {tableCardItem.tastingNotes.map((note, i) => (
                <span
                  key={i}
                  className="px-3 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-900 border border-amber-300"
                >
                  {note}
                </span>
              ))}
            </div>

            {/* Story Lineage Box */}
            <div className="bg-white rounded-2xl p-4 text-left text-xs space-y-2 border border-stone-200/80 shadow-xs mb-5">
              <div className="flex items-center gap-2 font-bold text-stone-900 border-b pb-2">
                <Sparkles className="w-4 h-4 text-amber-600" />
                <span>Cerita Perjalanan Biji Kopi (Direct Trade)</span>
              </div>
              <div className="text-[11px] text-stone-600">
                <span className="font-semibold block text-stone-900">Petani:</span>
                {tableCardItem.lineage.farmerName} ({tableCardItem.lineage.altitude})
              </div>
              <div className="text-[11px] text-stone-600">
                <span className="font-semibold block text-stone-900">Stasiun Pengolah:</span>
                {tableCardItem.lineage.processorName} ({tableCardItem.lineage.fermentationTime})
              </div>
              <div className="text-[11px] text-stone-600">
                <span className="font-semibold block text-stone-900">Penyangrai (Roastery):</span>
                {tableCardItem.lineage.roasterName} • {tableCardItem.lineage.roastProfile}
              </div>
              <div className="pt-1 flex items-center justify-between text-xs font-bold text-amber-900">
                <span>Cupping Score:</span>
                <span>{tableCardItem.scaScore} / 100 (SCA Specialty)</span>
              </div>
            </div>

            <button
              onClick={() => {
                setTableCardItem(null);
                setTraceModalData(tableCardItem);
              }}
              className="w-full py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors flex items-center justify-center gap-2"
            >
              <Eye className="w-4 h-4 text-amber-400" />
              Buka Timeline Interaktif Lengkap
            </button>
          </div>
        </div>
      )}

      {/* Silsilah Traceability Modal */}
      <TraceabilityModal
        isOpen={!!traceModalData}
        onClose={() => setTraceModalData(null)}
        data={traceModalData}
      />

      {/* Stiker Barcode Gelas Kopi Pelanggan Modal */}
      <CafeCupBarcodeModal
        isOpen={!!cupBarcodeItem}
        onClose={() => setCupBarcodeItem(null)}
        item={cupBarcodeItem}
      />
    </div>
  );
};

