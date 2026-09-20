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
  Building,
  Calendar,
  Warehouse,
  ChevronRight,
  Zap,
} from 'lucide-react';
import { PurchaseOrder, GreenBeanSample, POItem } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { OdooControlPanel } from '../odoo/OdooControlPanel';
import { OdooStatusPipeline, OdooPipelineStage } from '../odoo/OdooStatusPipeline';
import { OdooSmartStatButton } from '../odoo/OdooSmartStatButton';
import { OdooChatter } from '../odoo/OdooChatter';

const PO_PIPELINE_STAGES: OdooPipelineStage[] = [
  { id: 'draft', label: 'Draft PO' },
  { id: 'ordered', label: 'Dipesan' },
  { id: 'in_transit', label: 'Pengiriman' },
  { id: 'received', label: 'Diterima di Silo' },
];

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
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'graph'>('table');
  const [isCreatePoOpen, setIsCreatePoOpen] = useState(false);
  const [isCreateSampleOpen, setIsCreateSampleOpen] = useState(false);
  const [detailModalPO, setDetailModalPO] = useState<PurchaseOrder | null>(null);

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

  // Filtered lists
  const filteredPOs = purchaseOrders.filter((po) => {
    const matchesQuery =
      po.poNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      po.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (po.items[0]?.greenBeanName || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || po.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  const filteredSamples = greenBeanSamples.filter((smp) => {
    return (
      smp.sampleName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      smp.supplierName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      smp.sampleCode.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

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
      cuppingNotes: ['Wild Berry', 'Citrus', 'Sweet Cane Sugar'],
    });
    setIsCreateSampleOpen(false);
  };

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Pembelian (PO)"
          value={`Rp ${totalSpend.toLocaleString()}`}
          subtitle={`${purchaseOrders.length} Pesanan Terbit`}
          trend={{ value: `${receivedCount} Selesai di Silo`, isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Dalam Pengiriman / Pesan"
          value={`${inTransitCount} PO`}
          subtitle="Estimasi tiba 1 - 3 hari kerja"
          trend={{ value: 'Logistik On-Track', isPositive: true }}
          icon={<Truck className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Stok Lot Gudang Silo"
          value={`${warehouseLots.length} Lot`}
          subtitle="Tersimpan di Silo Berpendingin"
          trend={{ value: 'Hermetic GrainPro', isPositive: true }}
          icon={<Warehouse className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Evaluasi Sampel Lab"
          value={`${greenBeanSamples.length} Sampel`}
          subtitle={`${approvedSamplesCount} Siap Terbit Kontrak`}
          trend={{ value: 'SCA Specialty QA', isPositive: true }}
          icon={<Sparkles className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Subtab Toggle Buttons */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2">
        <button
          onClick={() => setActiveSubTab('orders')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'orders'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Purchase Orders ({purchaseOrders.length})</span>
        </button>

        <button
          onClick={() => setActiveSubTab('samples')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
            activeSubTab === 'samples'
              ? 'bg-[#714B67] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Evaluasi Sampel Biji ({greenBeanSamples.length})</span>
        </button>
      </div>

      {/* Odoo 19 Control Panel */}
      <OdooControlPanel
        breadcrumbs={[
          { label: 'Pengadaan & Pembelian' },
          { label: activeSubTab === 'orders' ? 'Purchase Orders' : 'Sample Green Bean' },
        ]}
        primaryActionLabel={activeSubTab === 'orders' ? '+ Purchase Order' : '+ Daftarkan Sampel'}
        onPrimaryAction={() =>
          activeSubTab === 'orders' ? setIsCreatePoOpen(true) : setIsCreateSampleOpen(true)
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={
          activeSubTab === 'orders'
            ? [
                { id: 'all', label: 'Semua Status' },
                { id: 'ordered', label: 'Dipesan' },
                { id: 'in_transit', label: 'Dalam Perjalanan' },
                { id: 'received', label: 'Diterima di Silo' },
              ]
            : []
        }
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        recordCount={activeSubTab === 'orders' ? filteredPOs.length : filteredSamples.length}
      />

      {/* SUBTAB 1: PURCHASE ORDERS TABLE */}
      {activeSubTab === 'orders' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. PO</th>
                  <th className="py-3.5 px-4">Supplier & Peran</th>
                  <th className="py-3.5 px-4">Komoditas Biji</th>
                  <th className="py-3.5 px-4">Volume (Karung / Kg)</th>
                  <th className="py-3.5 px-4">Total Biaya (Rp)</th>
                  <th className="py-3.5 px-4">Status Odoo</th>
                  <th className="py-3.5 px-4 text-right">Aksi Operasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPOs.map((po) => {
                  const item = po.items[0];
                  return (
                    <tr
                      key={po.id}
                      onClick={() => setDetailModalPO(po)}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                    >
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-[#714B67] group-hover:underline">
                          {po.poNumber}
                        </div>
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

                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {po.status !== 'received' ? (
                          <button
                            onClick={() => receivePurchaseOrder(po.id)}
                            className="px-3 py-1.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 ml-auto"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Terima & Masuk Stok
                          </button>
                        ) : (
                          <button
                            onClick={() => setDetailModalPO(po)}
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition-colors"
                          >
                            Detail PO
                          </button>
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
          {filteredSamples.map((smp) => (
            <div
              key={smp.id}
              className="bg-white rounded-3xl p-5 border border-stone-200/90 shadow-xs flex flex-col justify-between space-y-4"
            >
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-[#714B67]">{smp.sampleCode}</span>
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

                <div className="bg-[#F8F9FA] p-3 rounded-2xl border border-stone-200/80 text-xs space-y-1.5">
                  <div className="flex justify-between">
                    <span className="text-stone-500">Skor Cupping:</span>
                    <strong className="text-amber-800 font-mono font-bold">SCA {smp.sampleCuppingScore}</strong>
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

                <p className="text-xs text-stone-600 italic bg-stone-50 p-2.5 rounded-xl border border-stone-100">
                  "{smp.evaluationNotes}"
                </p>
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-between">
                <span className="text-[10px] text-stone-400">Masuk: {smp.receivedDate}</span>
                {smp.status === 'pending_evaluation' && (
                  <button
                    onClick={() => updateGreenBeanSample(smp.id, 'approved_to_buy')}
                    className="px-3 py-1.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white font-bold text-[11px] transition-colors shadow-2xs"
                  >
                    Setujui Kontrak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ODOO 19 PO DETAIL & INSPECTION MODAL */}
      {detailModalPO && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-[#F8F9FA] px-6 py-4 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#714B67] text-white">
                  <ShoppingCart className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 font-mono">{detailModalPO.poNumber}</h3>
                  <p className="text-[10px] text-stone-500">
                    Vendor: {detailModalPO.supplierName} • Tanggal Order: {detailModalPO.orderDate}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <OdooStatusPipeline
                  stages={PO_PIPELINE_STAGES}
                  currentStageId={detailModalPO.status}
                />
                <button
                  onClick={() => setDetailModalPO(null)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Smart Stat Buttons */}
            <div className="px-6 py-3 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <OdooSmartStatButton
                icon={<Warehouse className="w-4 h-4" />}
                value={`${detailModalPO.items[0]?.totalWeightKg || 0} kg`}
                label="Total Berat Biji"
                color="emerald"
              />
              <OdooSmartStatButton
                icon={<DollarSign className="w-4 h-4" />}
                value={`Rp ${(detailModalPO.totalAmount / 1000000).toFixed(1)}M`}
                label="Total Nilai PO"
                color="purple"
              />
              <OdooSmartStatButton
                icon={<Truck className="w-4 h-4" />}
                value={`Rp ${detailModalPO.freightCost.toLocaleString()}`}
                label="Ongkos Logistik"
                color="blue"
              />
              <OdooSmartStatButton
                icon={<ShieldCheck className="w-4 h-4" />}
                value="GrainPro OK"
                label="Standar Kemasan"
                color="stone"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              <div className="bg-stone-50/70 p-4 rounded-2xl border border-stone-200/80 space-y-2">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Package className="w-4 h-4 text-[#714B67]" /> Detail Item Komoditas
                </h4>
                {detailModalPO.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center py-2 border-b border-stone-200/60 last:border-0">
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{item.greenBeanName}</div>
                      <div className="text-[11px] text-stone-500">
                        {item.origin} • {item.variety} ({item.processMethod})
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-mono font-bold text-stone-900">
                        {item.bagCount} Karung @ {item.weightPerBagKg} kg = {item.totalWeightKg} kg
                      </div>
                      <div className="text-[11px] text-stone-500">
                        @ Rp {item.pricePerKg.toLocaleString()} / kg = Rp {item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {detailModalPO.status !== 'received' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      receivePurchaseOrder(detailModalPO.id);
                      setDetailModalPO(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Penerimaan Fisik di Silo Gudang
                  </button>
                </div>
              )}

              {/* Odoo Chatter */}
              <div className="pt-4 border-t border-stone-200">
                <OdooChatter
                  documentTitle={`PO #${detailModalPO.poNumber}`}
                  initialMessages={[
                    {
                      id: 'po-msg-1',
                      author: detailModalPO.supplierName,
                      type: 'message',
                      content: `PO telah dikonfirmasi dan disiapkan untuk pengiriman ke gudang silo. Instruksi: ${detailModalPO.notes}`,
                      timestamp: detailModalPO.orderDate,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
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
              <div className="p-2.5 rounded-xl bg-[#714B67]/10 text-[#714B67]">
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Peran Supplier
                  </label>
                  <select
                    value={poSupplierRole}
                    onChange={(e) => setPoSupplierRole(e.target.value as any)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-black focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              <div className="bg-[#714B67]/5 p-3 rounded-2xl border border-[#714B67]/20 flex items-center justify-between">
                <div>
                  <span className="text-[10px] text-stone-600 uppercase font-bold block">Total Volume:</span>
                  <span className="text-sm font-black text-[#714B67]">{poBags * poWeightPerBag} Kg Green Bean</span>
                </div>
                <div className="text-right">
                  <span className="text-[10px] text-stone-600 uppercase font-bold block">Total Estimasi PO:</span>
                  <span className="text-sm font-black text-[#714B67]">
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
                  className="px-6 py-2.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
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
              <div className="p-2.5 rounded-xl bg-[#00A09D]/10 text-[#00A09D]">
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
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-[#714B67]"
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#714B67]"
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
                  className="px-6 py-2.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
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
