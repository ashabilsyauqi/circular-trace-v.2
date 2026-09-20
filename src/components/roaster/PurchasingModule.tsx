import React, { useState } from 'react';
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
} from 'lucide-react';
import { PurchaseOrder, GreenBeanSample, POItem } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';

export const PurchasingModule: React.FC = () => {
  const {
    purchaseOrders,
    greenBeanSamples,
    warehouseLots,
    createPurchaseOrder,
    receivePurchaseOrder,
    createGreenBeanSample,
    updateGreenBeanSample,
  } = useCoffee();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'samples'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);
  const [isCreateSampleOpen, setIsCreateSampleOpen] = useState(false);

  // Form State for PO
  const [poSupplierName, setPoSupplierName] = useState('Silo QA Hub Java & Sumatera');
  const [poSupplierRole, setPoSupplierRole] = useState<'petani' | 'pengolah' | 'gudang'>('gudang');
  const [poGreenName, setPoGreenName] = useState('Java Pangalengan Anaerobic Natural');
  const [poOrigin, setPoOrigin] = useState('Pangalengan, Jawa Barat');
  const [poVariety, setPoVariety] = useState('Typica & Ateng Super');
  const [poProcess, setPoProcess] = useState('Anaerobic Natural');
  const [poBags, setPoBags] = useState<number>(2);
  const [poWeightPerBag, setPoWeightPerBag] = useState<number>(60);
  const [poPricePerKg, setPoPricePerKg] = useState<number>(140000);
  const [poFreight, setPoFreight] = useState<number>(450000);
  const [poDeliveryDate, setPoDeliveryDate] = useState(
    new Date(Date.now() + 86400000 * 3).toISOString().split('T')[0]
  );
  const [poNotes, setPoNotes] = useState('Kemasan GrainPro hermetic, sertifikat moisture 11.2%.');

  // Form State for Sample
  const [sampleName, setSampleName] = useState('Kerinci Mount Natural Anaerobic 1.700m');
  const [sampleSupplier, setSampleSupplier] = useState('Koperasi Koerintji Barokah');
  const [sampleOrigin, setSampleOrigin] = useState('Gunung Kerinci, Jambi');
  const [sampleVariety, setSampleVariety] = useState('Andung Sari & Sigarar Utang');
  const [sampleProcess, setSampleProcess] = useState('Anaerobic Natural');
  const [sampleAltitude, setSampleAltitude] = useState('1.700 mdpl');
  const [sampleScore, setSampleScore] = useState<number>(88.25);
  const [sampleMoisture, setSampleMoisture] = useState<number>(11.4);
  const [sampleNotes, setSampleNotes] = useState('Wild strawberry jam, red apple, sweet cane sugar.');

  // Metrics
  const totalSpend = purchaseOrders.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const inTransitCount = purchaseOrders.filter((p) => p.status === 'in_transit' || p.status === 'ordered').length;
  const receivedCount = purchaseOrders.filter((p) => p.status === 'received').length;
  const approvedSamplesCount = greenBeanSamples.filter((s) => s.status === 'approved_to_buy').length;

  const handleCreatePoSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const totalWeight = poBags * poWeightPerBag;
    const itemTotal = totalWeight * poPricePerKg;

    const newItem: POItem = {
      id: `poi-${Date.now().toString().slice(-4)}`,
      greenBeanName: poGreenName,
      origin: poOrigin,
      variety: poVariety,
      processMethod: poProcess,
      bagCount: Number(poBags),
      weightPerBagKg: Number(poWeightPerBag),
      totalWeightKg: totalWeight,
      pricePerKg: Number(poPricePerKg),
      totalPrice: itemTotal,
    };

    createPurchaseOrder({
      supplierName: poSupplierName,
      supplierRole: poSupplierRole,
      orderDate: new Date().toISOString().split('T')[0],
      expectedDeliveryDate: poDeliveryDate,
      status: 'ordered',
      items: [newItem],
      subtotal: itemTotal,
      freightCost: Number(poFreight),
      totalAmount: itemTotal + Number(poFreight),
      paymentStatus: 'paid',
      notes: poNotes,
    });

    setIsCreatePoOpen(false);
  };

  const handleCreateSampleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    createGreenBeanSample({
      sampleName,
      supplierName: sampleSupplier,
      origin: sampleOrigin,
      variety: sampleVariety,
      processMethod: sampleProcess,
      altitude: sampleAltitude,
      sampleCuppingScore: Number(sampleScore),
      moisturePercent: Number(sampleMoisture),
      screenSize: 'Screen 17-18',
      status: Number(sampleScore) >= 85 ? 'approved_to_buy' : 'pending_evaluation',
      evaluationNotes: sampleNotes,
      cuppingNotes: ['Berry Jam', 'Jasmine', 'Cane Sugar'],
    });

    setIsCreateSampleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Metric KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Nilai Pengadaan (PO)"
          value={`Rp ${totalSpend.toLocaleString()}`}
          subtitle={`${purchaseOrders.length} Pesanan tercatat`}
          trend={{ value: 'HPP Direct Trade', isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          color="stone"
        />
        <MetricCard
          title="Pengiriman Berjalan"
          value={`${inTransitCount} PO`}
          subtitle="Dalam proses transit ekspedisi"
          trend={{ value: 'Truk Pendingin', isPositive: true }}
          icon={<Truck className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Green Bean Diterima"
          value={`${receivedCount} PO Masuk`}
          subtitle="Tersimpan di Silo & Bay Gudang"
          trend={{ value: '100% Hermetic', isPositive: true }}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Sampel Lolos Kurasi"
          value={`${approvedSamplesCount} Sampel`}
          subtitle="Skor Cupping SCA ≥ 85.0"
          trend={{ value: 'Siap Kontrak PO', isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          color="amber"
        />
      </div>

      {/* Navigation Sub-Tabs & Actions */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-1 bg-stone-100 p-1 rounded-xl border border-stone-200">
          <button
            onClick={() => setActiveSubTab('orders')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'orders'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span>Purchase Orders ({purchaseOrders.length})</span>
          </button>
          <button
            onClick={() => setActiveSubTab('samples')}
            className={`px-4 py-2 rounded-lg text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeSubTab === 'samples'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span>Manajemen Sampel ({greenBeanSamples.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          {activeSubTab === 'orders' ? (
            <button
              onClick={() => setIsCreatePoOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Purchase Order</span>
            </button>
          ) : (
            <button
              onClick={() => setIsCreateSampleOpen(true)}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Daftarkan Sampel Biji</span>
            </button>
          )}
        </div>
      </div>

      {/* SUBTAB 1: PURCHASE ORDERS TABLE */}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. PO</th>
                  <th className="py-3.5 px-4">Supplier & Peran</th>
                  <th className="py-3.5 px-4">Komoditas Biji</th>
                  <th className="py-3.5 px-4">Volume (Karung / Kg)</th>
                  <th className="py-3.5 px-4">Total Biaya (Rp)</th>
                  <th className="py-3.5 px-4">Status Pengiriman</th>
                  <th className="py-3.5 px-4 text-right">Aksi Penerimaan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {purchaseOrders.map((po) => {
                  const item = po.items[0];
                  return (
                    <tr key={po.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-stone-900">{po.poNumber}</div>
                        <div className="text-[10px] text-stone-400">{po.orderDate}</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{po.supplierName}</div>
                        <div className="text-[10px] text-stone-400 capitalize">{po.supplierRole} Partner</div>
                      </td>

                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{item?.greenBeanName}</div>
                        <div className="text-[11px] text-stone-500">{item?.variety} • {item?.processMethod}</div>
                      </td>

                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                        {item ? `${item.bagCount} Karung (${item.totalWeightKg} kg)` : '-'}
                      </td>

                      <td className="py-3.5 px-4 font-black text-stone-900">
                        Rp {po.totalAmount.toLocaleString()}
                      </td>

                      <td className="py-3.5 px-4">
                        {po.status === 'received' && (
                          <span className="px-2.5 py-1 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold border border-emerald-300 flex items-center gap-1 w-fit">
                            <CheckCircle2 className="w-3 h-3" /> Diterima di Silo
                          </span>
                        )}
                        {po.status === 'in_transit' && (
                          <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold border border-blue-300 flex items-center gap-1 w-fit">
                            <Truck className="w-3 h-3" /> Dalam Perjalanan
                          </span>
                        )}
                        {po.status === 'ordered' && (
                          <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold border border-amber-300 flex items-center gap-1 w-fit">
                            <Clock className="w-3 h-3" /> Dipesan
                          </span>
                        )}
                      </td>

                      <td className="py-3.5 px-4 text-right">
                        {po.status !== 'received' ? (
                          <button
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 ml-auto"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terima & Masuk Stok
                          </button>
                        ) : (
                          <span className="text-[11px] text-emerald-700 font-bold">Stok Aktif</span>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* SUBTAB 2: SAMPLE EVALUATION CARDS */}
      {activeSubTab === 'samples' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {greenBeanSamples.map((smp) => (
            <div
              key={smp.id}
              className="bg-white rounded-2xl p-5 border border-stone-200 shadow-xs flex flex-col justify-between"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-stone-500">{smp.sampleCode}</span>
                  <span
                    className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                      smp.status === 'approved_to_buy'
                        ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                        : smp.status === 'rejected'
                        ? 'bg-rose-100 text-rose-800 border border-rose-300'
                        : 'bg-amber-100 text-amber-800 border border-amber-300'
                    }`}
                  >
                    {smp.status === 'approved_to_buy'
                      ? '✓ Disetujui Beli'
                      : smp.status === 'rejected'
                      ? '✕ Ditolak'
                      : '⏳ Menunggu Uji'}
                  </span>
                </div>

                <div>
                  <h4 className="font-bold text-sm text-stone-900">{smp.sampleName}</h4>
                  <p className="text-xs text-stone-500 mt-0.5">Supplier: {smp.supplierName}</p>
                </div>

                <div className="bg-stone-50 p-3 rounded-xl border border-stone-100 text-xs space-y-1">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Skor Cupping:</span>
                    <strong className="text-amber-800 font-mono">SCA {smp.sampleCuppingScore}</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Kadar Air:</span>
                    <strong className="text-stone-800">{smp.moisturePercent}%</strong>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-stone-500">Screen Ayakan:</span>
                    <strong className="text-stone-800">{smp.screenSize}</strong>
                  </div>
                </div>

                <p className="text-xs text-stone-600 italic">"{smp.evaluationNotes}"</p>
              </div>

              <div className="pt-4 border-t border-stone-100 mt-4 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">Masuk: {smp.receivedDate}</span>
                {smp.status === 'pending_evaluation' && (
                  <button
                    onClick={() => updateGreenBeanSample(smp.id, 'approved_to_buy')}
                    className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-stone-800 text-white font-bold text-[11px] transition-colors"
                  >
                    Setujui Kontrak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE PO MODAL */}
      {isCreatePoOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900">
            <button
              onClick={() => setIsCreatePoOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-2.5 rounded-xl bg-stone-900 text-white">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Buat Purchase Order Green Coffee</h3>
                <p className="text-xs text-stone-500">Kirim PO resmi ke petani, pengolah, atau gudang mitra.</p>
              </div>
            </div>

            <form onSubmit={handleCreatePoSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Supplier Mitra
                  </label>
                  <input
                    type="text"
                    required
                    value={poSupplierName}
                    onChange={(e) => setPoSupplierName(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Peran Supplier
                  </label>
                  <select
                    value={poSupplierRole}
                    onChange={(e) => setPoSupplierRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="gudang">Gudang / QA Hub</option>
                    <option value="pengolah">Stasiun Pengolah (Mill)</option>
                    <option value="petani">Kelompok Tani Kebun</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Komoditas Green Bean
                </label>
                <input
                  type="text"
                  required
                  value={poGreenName}
                  onChange={(e) => setPoGreenName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Jumlah Karung
                  </label>
                  <input
                    type="number"
                    min="1"
                    required
                    value={poBags}
                    onChange={(e) => setPoBags(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kg / Karung
                  </label>
                  <input
                    type="number"
                    required
                    value={poWeightPerBag}
                    onChange={(e) => setPoWeightPerBag(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Harga Beli / Kg (Rp)
                  </label>
                  <input
                    type="number"
                    step="1000"
                    required
                    value={poPricePerKg}
                    onChange={(e) => setPoPricePerKg(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-black focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Total Volume:</span>
                  <span className="text-sm font-black text-amber-950">{poBags * poWeightPerBag} Kg Green Bean</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-amber-800 uppercase font-bold block">Total Estimasi PO:</span>
                  <span className="text-sm font-black text-amber-950">
                    Rp {((poBags * poWeightPerBag * poPricePerKg) + Number(poFreight)).toLocaleString()}
                  </span>
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreatePoOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Terbitkan Purchase Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE SAMPLE MODAL */}
      {isCreateSampleOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-lg w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900">
            <button
              onClick={() => setIsCreateSampleOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Daftarkan Sampel Biji Hijau</h3>
                <p className="text-xs text-stone-500">Evaluasi sampel sebelum memutuskan pembelian partai besar.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSampleSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Sampel Biji
                </label>
                <input
                  type="text"
                  required
                  value={sampleName}
                  onChange={(e) => setSampleName(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Supplier Pengirim
                  </label>
                  <input
                    type="text"
                    required
                    value={sampleSupplier}
                    onChange={(e) => setSampleSupplier(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Skor Cupping Uji
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    required
                    value={sampleScore}
                    onChange={(e) => setSampleScore(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Catatan Evaluasi / Aroma
                </label>
                <textarea
                  rows={2}
                  value={sampleNotes}
                  onChange={(e) => setSampleNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateSampleOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan Evaluasi Sampel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
