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
} from 'lucide-react';
import { CafeInventoryItem } from '../types/coffee';
import { TraceabilityModal } from './TraceabilityModal';
import { CafeCupBarcodeModal } from './CafeCupBarcodeModal';

export const CafeView: React.FC = () => {
  const {
    currentUser,
    cafeInventory,
    cafeProducts,
    addCafeRetailProduct,
    transactions,
    setActiveView,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'inventory' | 'create_product' | 'my_products' | 'history'>('inventory');
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
  const totalSpend = myCafeTransactions
    .filter((t) => t.toRole === 'cafe')
    .reduce((acc, curr) => acc + curr.totalAmount, 0);

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
      {/* Top Banner */}
      <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-semibold mb-3 border border-amber-400/30">
            <Coffee className="w-4 h-4 text-amber-400" />
            Dasbor Coffee Shop Owner • Barista Bar & Toko Kedai (Cafe Tier)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Manajemen Barista Bar & Toko Kedai Kopi
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Kelola inventaris biji kopi specialty di bar kedai Anda, cetak kartu meja transparansi silsilah (Farm-to-Cup) untuk pengunjung cafe, serta sediakan menu minuman dan kemasan retail untuk pelanggan kedai Anda sendiri.
          </p>

          <div className="mt-4 pt-2">
            <button
              onClick={() => setActiveView('marketplace')}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 text-xs font-bold transition-colors shadow-xs flex items-center gap-2"
            >
              <ShoppingCart className="w-4 h-4" />
              Buka Marketplace Terpadu untuk Belanja Beans
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Coffee className="w-48 h-48" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Stok Beans di Bar</span>
            <Coffee className="w-4 h-4 text-amber-700" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalPacksInStock.toLocaleString()} Pack</div>
          <span className="text-[11px] text-amber-700 font-medium">Siap seduh untuk tamu</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Varian Menu Aktif</span>
            <Layers className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{myCafeInventory.length} Single Origin</div>
          <span className="text-[11px] text-blue-600 font-medium">Lengkap dengan Traceability</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Menu & Retail Kedai</span>
            <Package className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{myCafeProducts.length} Item</div>
          <span className="text-[11px] text-orange-600 font-medium">Di Etalase Toko Sendiri</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Belanja Bahan</span>
            <TrendingUp className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            Rp {totalSpend.toLocaleString()}
          </div>
          <span className="text-[11px] text-stone-500 font-medium">{myCafeTransactions.length} Pembelian</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-amber-100 border border-amber-300 text-amber-950 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-amber-700" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('inventory')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'inventory'
              ? 'border-stone-900 text-stone-900 bg-stone-100/70 font-black'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Barista Bar & Menu Seduh ({myCafeInventory.length})
        </button>

        <button
          onClick={() => setActiveTab('create_product')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'create_product'
              ? 'border-stone-900 text-stone-900 bg-stone-100/70 font-black'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <PlusCircle className="w-4 h-4" />
          Tambah Menu / Retail Toko
        </button>

        <button
          onClick={() => setActiveTab('my_products')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'my_products'
              ? 'border-stone-900 text-stone-900 bg-stone-100/70 font-black'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Package className="w-4 h-4" />
          Etalase Toko Cafe ({myCafeProducts.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'border-stone-900 text-stone-900 bg-stone-100/70 font-black'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <History className="w-4 h-4" />
          Riwayat Pengeluaran ({myCafeTransactions.length})
        </button>
      </div>

      {/* Tab 1: Barista Bar Inventaris */}
      {activeTab === 'inventory' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Menu Kopi Aktif & Inventaris Barista ({myCafeInventory.length})
              </h2>
              <p className="text-xs text-stone-500">
                Biji kopi siap seduh untuk disajikan kepada pengunjung kedai specialty Anda.
              </p>
            </div>
            <button
              onClick={() => setActiveView('marketplace')}
              className="text-xs font-bold text-amber-900 bg-amber-100 hover:bg-amber-200 px-3 py-1.5 rounded-lg border border-amber-300 flex items-center gap-1"
            >
              <ShoppingCart className="w-3.5 h-3.5" />
              Beli Beans Tambahan di Marketplace
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCafeInventory.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="p-5 bg-linear-to-br from-amber-50 via-stone-50 to-white border-b border-stone-100">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                        <CheckCircle2 className="w-3 h-3" /> Aktif di Bar
                      </span>
                      <span className="inline-flex items-center gap-1 text-xs font-black bg-stone-900 text-amber-400 px-2 py-0.5 rounded-md">
                        SCA: {item.scaScore}
                      </span>
                    </div>

                    <h3 className="font-bold text-base text-stone-900 leading-tight">
                      {item.beanName}
                    </h3>
                    <p className="text-xs text-stone-500 mt-1">
                      Roaster: <strong>{item.roasterName}</strong> • {item.roastLevel}
                    </p>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] font-semibold text-stone-400 block mb-1">
                        Karakter Rasa Menu:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {item.tastingNotes.map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-medium bg-amber-50 text-amber-900 border border-amber-200"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="bg-stone-50 p-3 rounded-xl border border-stone-200/80 text-xs space-y-1">
                      <div className="flex justify-between">
                        <span className="text-stone-500">Petani Asal:</span>
                        <strong className="text-stone-800 truncate max-w-[170px]">{item.lineage.farmerName}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Ketinggian Kebun:</span>
                        <strong className="text-emerald-700">{item.lineage.altitude}</strong>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-500">Metode Proses:</span>
                        <strong className="text-stone-800">{item.processMethod}</strong>
                      </div>
                    </div>

                    <div className="space-y-2 pt-1">
                      <button
                        onClick={() => setCupBarcodeItem(item)}
                        className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-amber-600 via-stone-900 to-amber-700 hover:from-amber-700 hover:to-amber-800 text-white text-xs font-black transition-all flex items-center justify-center gap-2 shadow-sm"
                      >
                        <QrCode className="w-4 h-4 text-amber-300" />
                        🏷️ Cetak Stiker Barcode Gelas (Cup)
                      </button>

                      <div className="grid grid-cols-2 gap-2">
                        <button
                          onClick={() => setTraceModalData(item)}
                          className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-stone-300"
                        >
                          <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                          Silsilah Lengkap
                        </button>

                        <button
                          onClick={() => setTableCardItem(item)}
                          className="py-2 px-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1 border border-stone-300"
                        >
                          <Coffee className="w-3.5 h-3.5 text-stone-600" />
                          Kartu Meja
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Stok Cafe Tersedia:</span>
                    <span className="text-sm font-black text-amber-900">
                      {item.packsInStock} Pack
                      <span className="text-xs font-normal text-stone-500"> ({(item.packsInStock * item.packWeightGrams) / 1000} kg)</span>
                    </span>
                  </div>

                  <span className="text-[11px] text-stone-500 font-medium">
                    Rp {item.costPerPack.toLocaleString()} / pack
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Form Rilis Produk Baru ke Marketplace Terpadu */}
      {activeTab === 'create_product' && (
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-stone-200 shadow-sm max-w-3xl">
          <div className="mb-6">
            <h2 className="text-lg font-bold text-stone-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              Rilis Produk / Retail Pack ke Marketplace Terpadu
            </h2>
            <p className="text-xs text-stone-500 mt-1">
              Sebagai pemilik coffee shop, Anda dapat menjual signature house blend, drip bag, cold brew bottle, atau produk kopi kemasan ke seluruh pengguna di ekosistem kopi.
            </p>
          </div>

          <form onSubmit={handleCreateProduct} className="space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Produk Kopi
                </label>
                <input
                  type="text"
                  required
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                  placeholder="Contoh: Seduh Teduh House Blend Espresso 250g"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Asal Daerah / Asal Biji (Origin)
                </label>
                <input
                  type="text"
                  required
                  value={prodOrigin}
                  onChange={(e) => setProdOrigin(e.target.value)}
                  placeholder="Contoh: Pangalengan x Aceh Gayo"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Profil Sangrai
                </label>
                <select
                  value={prodRoastLevel}
                  onChange={(e) => setProdRoastLevel(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500 bg-white"
                >
                  <option value="Light Roast">Light Roast (Filter)</option>
                  <option value="Light-Medium">Light-Medium Roast</option>
                  <option value="Medium Roast">Medium Roast (Omni / Espresso)</option>
                  <option value="Dark Roast">Dark Roast (Bold)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Format Kemasan (Satuan)
                </label>
                <input
                  type="text"
                  required
                  value={prodUnit}
                  onChange={(e) => setProdUnit(e.target.value)}
                  placeholder="Pack (250g), Box (5 Drip Bags), Botol (500ml)"
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
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
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Stok Tersedia
                </label>
                <input
                  type="number"
                  required
                  min="1"
                  value={prodStock}
                  onChange={(e) => setProdStock(Number(e.target.value))}
                  className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-stone-700 uppercase tracking-wider mb-1">
                Deskripsi Produk Cafe
              </label>
              <textarea
                rows={2}
                value={prodDesc}
                onChange={(e) => setProdDesc(e.target.value)}
                className="w-full px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
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
                  className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-amber-500"
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
                      className="hover:text-red-700 ml-1"
                    >
                      &times;
                    </button>
                  </span>
                ))}
              </div>
            </div>

            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="px-6 py-3 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs sm:text-sm transition-all shadow-md flex items-center gap-2"
              >
                <PlusCircle className="w-4 h-4" />
                Terbitkan ke Marketplace Terpadu
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Tab 3: Produk Cafe Saya di Marketplace Terpadu */}
      {activeTab === 'my_products' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-base font-bold text-stone-900">
              Produk Cafe yang Sedang Dijual di Marketplace ({myCafeProducts.length})
            </h2>
            <button
              onClick={() => setActiveTab('create_product')}
              className="text-xs font-bold text-stone-800 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-lg border border-stone-300 flex items-center gap-1"
            >
              <PlusCircle className="w-3.5 h-3.5" />
              Tambah Produk Baru
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myCafeProducts.map((prod) => (
              <div
                key={prod.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-40 bg-stone-900">
                    <img
                      src={prod.photoUrl}
                      alt={prod.name}
                      className="w-full h-full object-cover opacity-90"
                    />
                    <div className="absolute top-3 left-3 bg-black/80 backdrop-blur-xs text-white text-[10px] font-mono px-2 py-0.5 rounded-md">
                      {prod.id}
                    </div>
                    <div className="absolute top-3 right-3 bg-stone-200 text-stone-900 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded-full border border-stone-400">
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
                    <span className="text-[10px] text-stone-400 block">Harga Jual:</span>
                    <span className="text-sm font-black text-stone-900">
                      Rp {prod.price.toLocaleString()}
                      <span className="text-xs font-normal text-stone-500"> / {prod.packageUnit}</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Sisa Stok:</span>
                    <span className="text-xs font-bold text-emerald-700">
                      {prod.availableStock} / {prod.totalStock}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 4: Riwayat Transaksi */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-stone-800" />
            Catatan Transaksi Cafe
          </h2>

          {myCafeTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              Belum ada riwayat pesanan.
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                  <tr>
                    <th className="py-3 px-4">No. TRX</th>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pengirim</th>
                    <th className="py-3 px-4">Penerima</th>
                    <th className="py-3 px-4">Komoditas</th>
                    <th className="py-3 px-4">Jumlah</th>
                    <th className="py-3 px-4">Total Biaya</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {myCafeTransactions.map((trx) => (
                    <tr key={trx.id} className="hover:bg-stone-50/50">
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
