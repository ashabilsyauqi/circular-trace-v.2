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
  PenTool,
  Send,
  XCircle,
} from 'lucide-react';
import { PurchaseOrder, GreenBeanSample } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { OdooControlPanel } from '../odoo/OdooControlPanel';
import { OdooStatusPipeline, OdooPipelineStage } from '../odoo/OdooStatusPipeline';
import { OdooSmartStatButton } from '../odoo/OdooSmartStatButton';
import { OdooChatter } from '../odoo/OdooChatter';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';

// Purchase Order approval flow: Draft -> Pending Approval (digital signature) -> Approved ->
// Received (goods move into Inventory's incoming-QC queue; only after QC "passed" can the
// roaster select the lot in a Work Order).
const PO_PIPELINE_STAGES: OdooPipelineStage[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'pending_approval', label: 'Menunggu Persetujuan' },
  { id: 'approved', label: 'Disetujui' },
  { id: 'received', label: 'Diterima (QC Masuk)' },
];

const STATUS_BADGE: Record<string, { icon: React.ReactNode; className: string; label: string }> = {
  draft: {
    icon: <FileText className="w-3 h-3" />,
    className: 'bg-stone-100 text-stone-700 border-stone-300',
    label: 'Draft',
  },
  pending_approval: {
    icon: <Clock className="w-3 h-3" />,
    className: 'bg-amber-100 text-amber-800 border-amber-300',
    label: 'Menunggu Persetujuan',
  },
  approved: {
    icon: <ShieldCheck className="w-3 h-3" />,
    className: 'bg-blue-100 text-blue-800 border-blue-300',
    label: 'Disetujui',
  },
  received: {
    icon: <CheckCircle2 className="w-3 h-3" />,
    className: 'bg-emerald-100 text-emerald-800 border-emerald-300',
    label: 'Diterima',
  },
  cancelled: {
    icon: <XCircle className="w-3 h-3" />,
    className: 'bg-rose-100 text-rose-800 border-rose-300',
    label: 'Dibatalkan',
  },
};

export const PurchasingModule: React.FC = () => {
  const {
    currentUser,
    purchaseOrders,
    greenBeanSamples,
    warehouseLots,
    submitPurchaseOrderForApproval,
    approvePurchaseOrder,
    rejectPurchaseOrder,
    receivePurchaseOrder,
    createGreenBeanSample,
    updateGreenBeanSample,
    setActiveView,
  } = useCoffee();

  const [activeSubTab, setActiveSubTab] = useState<'orders' | 'samples'>('orders');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'graph'>('table');
  const [isCreateSampleOpen, setIsCreateSampleOpen] = useState(false);
  const [detailModalPO, setDetailModalPO] = useState<PurchaseOrder | null>(null);
  const [signatureModalPO, setSignatureModalPO] = useState<PurchaseOrder | null>(null);
  const [signatureName, setSignatureName] = useState('');
  const [signatureConfirmed, setSignatureConfirmed] = useState(false);

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
  const pendingApprovalCount = purchaseOrders.filter((p) => p.status === 'pending_approval').length;
  const approvedCount = purchaseOrders.filter((p) => p.status === 'approved').length;
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

  const openSignatureModal = (po: PurchaseOrder) => {
    setSignatureModalPO(po);
    setSignatureName(currentUser?.name || '');
    setSignatureConfirmed(false);
  };

  const handleConfirmSignature = () => {
    if (!signatureModalPO || !signatureName.trim() || !signatureConfirmed) return;
    approvePurchaseOrder(signatureModalPO.id, signatureName.trim());
    setSignatureModalPO(null);
    setDetailModalPO(null);
  };

  const renderStatusBadge = (status: string) => {
    const meta = STATUS_BADGE[status] || STATUS_BADGE.draft;
    return (
      <span
        className={`px-2.5 py-1 rounded-full text-[10px] font-bold border inline-flex items-center gap-1 w-fit whitespace-nowrap ${meta.className}`}
      >
        {meta.icon} {meta.label}
      </span>
    );
  };

  // Primary row action, one per lifecycle stage
  const renderRowAction = (po: PurchaseOrder) => {
    if (po.status === 'draft') {
      return (
        <button
          onClick={() => submitPurchaseOrderForApproval(po.id)}
          className="px-3 py-1.5 rounded-xl bg-[#1E2333] hover:bg-slate-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 ml-auto"
        >
          <Send className="w-3.5 h-3.5" />
          Ajukan Persetujuan
        </button>
      );
    }
    if (po.status === 'pending_approval') {
      return (
        <button
          onClick={() => openSignatureModal(po)}
          className="px-3 py-1.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 ml-auto"
        >
          <PenTool className="w-3.5 h-3.5" />
          Tanda Tangani &amp; Setujui
        </button>
      );
    }
    if (po.status === 'approved') {
      return (
        <button
          onClick={() => receivePurchaseOrder(po.id)}
          className="px-3 py-1.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1 ml-auto"
        >
          <CheckCircle2 className="w-3.5 h-3.5" />
          Terima Barang ke Inventory
        </button>
      );
    }
    return (
      <button
        onClick={() => setDetailModalPO(po)}
        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition-colors"
      >
        Detail PO
      </button>
    );
  };

  return (
    <div className="space-y-6">
      {!detailModalPO && (
      <>
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Pembelian (PO)"
          value={`Rp ${totalSpend.toLocaleString()}`}
          subtitle={`${purchaseOrders.length} PO Terbit`}
          trend={{ value: `${receivedCount} Selesai di Silo`, isPositive: true }}
          icon={<DollarSign className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Menunggu Persetujuan"
          value={`${pendingApprovalCount} PO`}
          subtitle="Butuh tanda tangan digital"
          trend={{ value: pendingApprovalCount > 0 ? 'Aksi Diperlukan' : 'Semua Ter-review', isPositive: pendingApprovalCount === 0 }}
          icon={<Clock className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Disetujui, Belum Diterima"
          value={`${approvedCount} PO`}
          subtitle="Menunggu kedatangan fisik"
          trend={{ value: 'Siap Diterima di Silo', isPositive: true }}
          icon={<Truck className="w-5 h-5" />}
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
              ? 'bg-[#1E2333] text-white shadow-xs'
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
              ? 'bg-[#1E2333] text-white shadow-xs'
              : 'text-stone-600 hover:bg-stone-100'
          }`}
        >
          <Sparkles className="w-4 h-4" />
          <span>Evaluasi Sampel Biji ({greenBeanSamples.length})</span>
        </button>
      </div>

      {/* Odoo Control Panel */}
      <OdooControlPanel
        breadcrumbs={[
          { label: 'Pengadaan & Pembelian' },
          { label: activeSubTab === 'orders' ? 'Purchase Orders' : 'Sample Green Bean' },
        ]}
        primaryActionLabel={activeSubTab === 'orders' ? '+ Beli dari Marketplace' : '+ Daftarkan Sampel'}
        onPrimaryAction={() =>
          activeSubTab === 'orders' ? setActiveView('marketplace') : setIsCreateSampleOpen(true)
        }
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={
          activeSubTab === 'orders'
            ? [
                { id: 'all', label: 'Semua Status' },
                { id: 'draft', label: 'Draft' },
                { id: 'pending_approval', label: 'Menunggu Persetujuan' },
                { id: 'approved', label: 'Disetujui' },
                { id: 'received', label: 'Diterima' },
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
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
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
                        <div className="font-mono font-bold text-[#1E2333] group-hover:underline">
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

                      <td className="py-3.5 px-4">{renderStatusBadge(po.status)}</td>

                      <td
                        className="py-3.5 px-4 text-right"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {renderRowAction(po)}
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
                  <span className="font-mono text-xs font-bold text-[#1E2333]">{smp.sampleCode}</span>
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
                    className="px-3 py-1.5 rounded-xl bg-[#1E2333] hover:bg-slate-800 text-white font-bold text-[11px] transition-colors shadow-2xs"
                  >
                    Setujui Kontrak
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
      </>
      )}

      {/* PURCHASE ORDER DETAIL PAGE (breadcrumb + stage pipeline) */}
      {detailModalPO && (
        <div>
          <RecordBreadcrumb
            listLabel="Purchase Orders"
            recordLabel={detailModalPO.poNumber}
            onBack={() => setDetailModalPO(null)}
          />
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <div className="bg-[#F8F9FA] px-6 py-4 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#1E2333] text-orange-400">
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
                  <Package className="w-4 h-4 text-[#1E2333]" /> Detail Item Komoditas
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

              {/* Approval status / digital signature record */}
              {detailModalPO.status === 'draft' && (
                <div className="flex items-center justify-between bg-stone-50 border border-stone-200 rounded-2xl p-4">
                  <p className="text-[11px] text-stone-500 max-w-sm">
                    PO ini masih draft dan belum diajukan untuk persetujuan. Ajukan agar dapat ditanda tangani
                    secara digital oleh pihak berwenang.
                  </p>
                  <button
                    onClick={() => submitPurchaseOrderForApproval(detailModalPO.id)}
                    className="px-5 py-2.5 rounded-xl bg-[#1E2333] hover:bg-slate-800 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <Send className="w-4 h-4" />
                    Ajukan Persetujuan
                  </button>
                </div>
              )}

              {detailModalPO.status === 'pending_approval' && (
                <div className="flex items-center justify-between bg-amber-50 border border-amber-200 rounded-2xl p-4">
                  <p className="text-[11px] text-amber-800 max-w-sm">
                    PO menunggu persetujuan &amp; tanda tangan digital. Setelah disetujui, status berubah menjadi
                    "Disetujui" dan siap diterima secara fisik.
                  </p>
                  <button
                    onClick={() => openSignatureModal(detailModalPO)}
                    className="px-5 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5 shrink-0"
                  >
                    <PenTool className="w-4 h-4" />
                    Tanda Tangani &amp; Setujui
                  </button>
                </div>
              )}

              {(detailModalPO.status === 'approved' || detailModalPO.status === 'received') &&
                detailModalPO.approvalSignedBy && (
                  <div className="flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-2xl p-4 text-[11px] text-blue-800">
                    <PenTool className="w-4 h-4 shrink-0" />
                    <span>
                      Ditanda tangani secara digital oleh <strong>{detailModalPO.approvalSignedBy}</strong>
                      {detailModalPO.approvalSignedAt &&
                        ` pada ${new Date(detailModalPO.approvalSignedAt).toLocaleString('id-ID')}`}
                      .
                    </span>
                  </div>
                )}

              {detailModalPO.status === 'approved' && (
                <div className="flex justify-end">
                  <button
                    onClick={() => {
                      receivePurchaseOrder(detailModalPO.id);
                      setDetailModalPO(null);
                    }}
                    className="px-5 py-2.5 rounded-xl bg-[#00A09D] hover:bg-[#008986] text-white font-bold text-xs transition-all shadow-md flex items-center gap-1.5"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    Konfirmasi Penerimaan Fisik &amp; Kirim ke Inventory
                  </button>
                </div>
              )}

              {detailModalPO.status === 'received' && (
                <p className="text-[11px] text-emerald-700 bg-emerald-50 border border-emerald-200 rounded-2xl p-4 flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  Barang telah diterima dan sedang menunggu QC Masuk di modul Inventory sebelum dapat diolah
                  roaster.
                </p>
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
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#1E2333]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#1E2333]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-[#1E2333]"
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
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#1E2333]"
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

      {/* DIGITAL SIGNATURE MODAL */}
      {signatureModalPO && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-md w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-[#1E2333] text-white px-6 py-5">
              <div className="flex items-center gap-2 text-orange-400 text-xs font-bold uppercase tracking-wider mb-1">
                <PenTool className="w-3.5 h-3.5" />
                Persetujuan &amp; Tanda Tangan Digital
              </div>
              <h2 className="text-lg font-bold">{signatureModalPO.poNumber}</h2>
              <p className="text-xs text-slate-400 mt-1">
                Rp {signatureModalPO.totalAmount.toLocaleString()} • {signatureModalPO.supplierName}
              </p>
            </div>

            <div className="p-6 space-y-4 text-xs">
              <p className="text-stone-500">
                Dengan menandatangani, Anda mengonfirmasi bahwa Purchase Order ini telah ditinjau dan disetujui
                untuk dipesan secara resmi ke supplier.
              </p>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Nama Lengkap (Tanda Tangan Digital)
                </label>
                <input
                  type="text"
                  required
                  value={signatureName}
                  onChange={(e) => setSignatureName(e.target.value)}
                  placeholder="Ketik nama lengkap Anda"
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-orange-400 font-serif italic text-sm"
                />
              </div>

              <label className="flex items-start gap-2.5 bg-stone-50 border border-stone-200 rounded-xl p-3 cursor-pointer">
                <input
                  type="checkbox"
                  checked={signatureConfirmed}
                  onChange={(e) => setSignatureConfirmed(e.target.checked)}
                  className="mt-0.5 accent-orange-500"
                />
                <span className="text-stone-600">
                  Saya menyetujui pembelian ini dan bertanggung jawab penuh atas keputusan pembelian PO
                  {' '}{signatureModalPO.poNumber}.
                </span>
              </label>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setSignatureModalPO(null)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="button"
                  disabled={!signatureName.trim() || !signatureConfirmed}
                  onClick={handleConfirmSignature}
                  className="px-6 py-2.5 rounded-xl bg-orange-500 hover:bg-orange-600 disabled:opacity-40 disabled:cursor-not-allowed text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <PenTool className="w-4 h-4" />
                  Tanda Tangani &amp; Setujui
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
