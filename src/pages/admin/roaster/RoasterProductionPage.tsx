import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import { useCoffee } from '../../../context/CoffeeContext';
import { WorkOrder, WorkOrderStatus, MasterRoastProfile } from '../../../types/roasterErp';
import { RoastedBeanLot } from '../../../types/coffee';
import {
  Flame,
  PlusCircle,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  Search,
  Filter,
  X,
  Zap,
  Tag,
  FileText,
  Sliders,
  Award,
  Warehouse,
  Store,
  QrCode,
  Thermometer,
  Gauge,
  Play,
  Calendar,
  Coffee,
  CheckSquare,
} from 'lucide-react';
import { ArtisanRoastSimulatorModal } from '../../../components/roaster/ArtisanRoastSimulatorModal';
import { RoasterBarcodeModal } from '../../../components/roaster/RoasterBarcodeModal';
import { TraceabilityModal } from '../../../components/TraceabilityModal';

export const RoasterProductionPage: React.FC = () => {
  const {
    currentUser,
    workOrders,
    warehouseLots,
    masterProfiles,
    roasterMachines,
    roastedLots,
    createWorkOrder,
    updateWorkOrderStatus,
  } = useCoffee();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const urlGreenLotId = searchParams.get('greenLotId');

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [activeSimulatorWO, setActiveSimulatorWO] = useState<WorkOrder | null>(null);
  const [isCreateWOOpen, setIsCreateWOOpen] = useState(false);
  const [barcodeLot, setBarcodeLot] = useState<RoastedBeanLot | null>(null);
  const [traceLot, setTraceLot] = useState<RoastedBeanLot | null>(null);

  // Form State for New Work Order
  const [formGreenLotId, setFormGreenLotId] = useState(warehouseLots[0]?.id || '');
  const [formTargetGreenKg, setFormTargetGreenKg] = useState<number>(30);
  const [formProfileId, setFormProfileId] = useState(masterProfiles[0]?.id || '');
  const [formMachine, setFormMachine] = useState(roasterMachines[0]?.name || 'Giesen W6A Artisan');
  const [formRoaster, setFormRoaster] = useState('Agus Roastmaster');
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('Batch sangrai specialty standar SCA.');

  // Auto-open modal if greenLotId param is present
  useEffect(() => {
    if (urlGreenLotId) {
      setFormGreenLotId(urlGreenLotId);
      setIsCreateWOOpen(true);
    }
  }, [urlGreenLotId]);

  // Filtering
  const myWorkOrders = workOrders.filter((w) => !w.roasterId || w.roasterId === currentUser?.id);
  const availableGreenLots = warehouseLots.filter((lot) => lot.availableWeightKg > 0);

  const filteredWorkOrders = myWorkOrders.filter((wo) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      wo.woNumber.toLowerCase().includes(q) ||
      wo.greenBeanName.toLowerCase().includes(q) ||
      wo.origin.toLowerCase().includes(q) ||
      wo.variety.toLowerCase().includes(q) ||
      wo.assignedMachine.toLowerCase().includes(q);

    const matchStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchSearch && matchStatus;
  });

  // Calculate Metrics
  const totalOrders = myWorkOrders.length;
  const inProductionOrders = myWorkOrders.filter((w) => w.status === 'in_production' || w.status === 'roasting').length;
  const qcPendingOrders = myWorkOrders.filter((w) => w.status === 'qc_pending').length;
  const completedOrders = myWorkOrders.filter((w) => w.status === 'completed').length;
  const totalGreenProcessed = myWorkOrders.reduce((sum, w) => sum + (w.actualGreenKg || 0), 0);

  // Handle New Work Order submission
  const handleCreateWOSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const greenLot = warehouseLots.find((w) => w.id === formGreenLotId);
    const profile = masterProfiles.find((p) => p.id === formProfileId);

    createWorkOrder({
      roasterId: currentUser?.id,
      scheduledDate: new Date().toISOString().split('T')[0],
      dueDate: formDueDate,
      status: 'scheduled',
      greenLotId: formGreenLotId,
      greenBeanName: greenLot ? `${greenLot.variety} (${greenLot.processMethod})` : 'Green Bean Specialty',
      origin: greenLot?.origin || 'Indonesia',
      variety: greenLot?.variety || 'Arabica',
      processMethod: greenLot?.processMethod || 'Natural',
      targetGreenKg: Number(formTargetGreenKg),
      targetRoastedKg: Number((formTargetGreenKg * 0.855).toFixed(1)),
      masterProfileId: profile?.id || formProfileId || 'mp-001',
      masterProfileName: profile?.name || 'Standard Medium Profile',
      targetRoastLevel: profile?.targetRoastLevel || 'Medium Roast',
      targetAgtron: profile?.agtronCommercial || 65,
      targetDtr: profile?.targetDtr || 14.5,
      assignedMachine: formMachine,
      assignedRoaster: formRoaster,
      notes: formNotes,
    });

    setIsCreateWOOpen(false);
  };

  const getStatusBadge = (status: WorkOrderStatus) => {
    switch (status) {
      case 'draft':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-stone-100 text-stone-700 border border-stone-200">Draft</span>;
      case 'scheduled':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-blue-100 text-blue-800 border border-blue-200">Terjadwal</span>;
      case 'in_production':
      case 'roasting':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-amber-100 text-amber-800 border border-amber-200 animate-pulse flex items-center gap-1"><Flame className="w-3 h-3" /> Sedang Disangrai</span>;
      case 'qc_pending':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-800 border border-purple-200 flex items-center gap-1"><Coffee className="w-3 h-3" /> Siap Cupping SCA</span>;
      case 'completed':
        return <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1"><CheckCircle2 className="w-3 h-3" /> Selesai</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-16">
      {/* HEADER SECTION */}
      <div className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider bg-orange-100 text-orange-900 border border-orange-300">
              Roastery Production & Batch Control
            </span>
            <span className="text-xs text-stone-600 font-medium flex items-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Operasional Mesin & Simulator Artisan
            </span>
          </div>
          <h1 className="text-2xl font-black text-stone-900 flex items-center gap-2">
            <Flame className="w-7 h-7 text-amber-600" />
            Jadwal Sangrai & Simulasi Roasting Artisan
          </h1>
          <p className="text-sm text-stone-600 mt-1">
            Eksekusi batch sangrai dengan telemetri live Artisan (BT, ET, RoR, Turning Point, First Crack) hingga pelepasan cupping.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={() => setIsCreateWOOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-black shadow-md shadow-amber-600/20 transition-all flex items-center gap-1.5"
          >
            <PlusCircle className="w-4 h-4" />
            Buat Jadwal Roasting Baru
          </button>
          <Link
            to="/admin/roaster/cupping"
            className="px-3.5 py-2.5 rounded-xl bg-purple-50 hover:bg-purple-100 text-purple-900 border border-purple-200 text-xs font-black transition-all flex items-center gap-1.5"
          >
            <Award className="w-4 h-4 text-purple-600" />
            Lembar Kerja Cupping SCA
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

      {/* METRIC SUMMARY CARDS */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center font-bold">
            <Flame className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-600 block">Total Work Orders</span>
            <span className="text-2xl font-black text-stone-900">{totalOrders}</span>
            <span className="text-[10px] text-amber-700 block font-bold">{inProductionOrders} Batch Aktif</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-bold">
            <Coffee className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-600 block">Antrean Uji Cupping</span>
            <span className="text-2xl font-black text-purple-700">{qcPendingOrders}</span>
            <span className="text-[10px] text-stone-600 block">Menunggu Rilis SCA</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-600 block">Green Bean Disangrai</span>
            <span className="text-2xl font-black text-stone-900">{totalGreenProcessed} kg</span>
            <span className="text-[10px] text-blue-700 block font-bold">Dari Gudang Mitra</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-sm flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold">
            <CheckCircle2 className="w-6 h-6" />
          </div>
          <div>
            <span className="text-xs text-stone-600 block">Batch Selesai</span>
            <span className="text-2xl font-black text-emerald-700">{completedOrders}</span>
            <span className="text-[10px] text-stone-600 block">Tersertifikasi QR</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH BAR */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-sm flex flex-col sm:flex-row gap-3 items-center justify-between">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-stone-400" />
          <input
            type="text"
            placeholder="Cari nomor WO, asal, varietas, mesin..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-stone-50 border border-stone-300 rounded-xl text-xs font-medium focus:ring-2 focus:ring-amber-500 focus:outline-none"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          <span className="text-xs font-bold text-stone-600 flex items-center gap-1 flex-shrink-0">
            <Filter className="w-3.5 h-3.5" /> Status:
          </span>
          {['all', 'scheduled', 'in_production', 'qc_pending', 'completed'].map((status) => (
            <button
              key={status}
              type="button"
              onClick={() => setStatusFilter(status)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex-shrink-0 ${
                statusFilter === status
                  ? 'bg-amber-600 text-white shadow-sm'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {status === 'all' && 'Semua WO'}
              {status === 'scheduled' && 'Terjadwal'}
              {status === 'in_production' && 'Sedang Disangrai'}
              {status === 'qc_pending' && 'Antrean Cupping'}
              {status === 'completed' && 'Selesai'}
            </button>
          ))}
        </div>
      </div>

      {/* WORK ORDER LISTING */}
      <div className="space-y-4">
        {filteredWorkOrders.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-stone-200">
            <Flame className="w-12 h-12 text-stone-300 mx-auto mb-3" />
            <h3 className="text-base font-bold text-stone-700">Tidak ada Work Order ditemukan</h3>
            <p className="text-xs text-stone-600 mt-1">
              Silakan sesuaikan filter pencarian atau buat perintah kerja roasting baru.
            </p>
          </div>
        ) : (
          filteredWorkOrders.map((wo) => {
            const progressPercent = Math.min(
              100,
              Math.round(((wo.actualGreenKg || 0) / wo.targetGreenKg) * 100)
            );
            const matchingRoastedLot = roastedLots.find((r) => r.sourceWorkOrderId === wo.id);

            return (
              <div
                key={wo.id}
                className="bg-white rounded-2xl p-6 border border-stone-200 shadow-sm hover:border-amber-300 transition-all space-y-4"
              >
                {/* Top Row: Info & Status */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-600 border border-orange-200 flex items-center justify-center font-black">
                      <Flame className="w-5 h-5" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono font-black text-sm text-stone-900">{wo.woNumber}</span>
                        {getStatusBadge(wo.status)}
                      </div>
                      <h3 className="text-base font-black text-stone-900 mt-0.5">
                        {wo.greenBeanName} • {wo.origin}
                      </h3>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-start sm:self-auto">
                    {/* BUTTON A: SIMULASI ROASTING ARTISAN */}
                    {wo.status !== 'completed' && (
                      <button
                        type="button"
                        onClick={() => setActiveSimulatorWO(wo)}
                        className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all shadow-md shadow-amber-500/20 flex items-center gap-1.5"
                      >
                        <Play className="w-3.5 h-3.5 fill-current" />
                        Simulasi Roasting Artisan
                      </button>
                    )}

                    {/* BUTTON B: LINK KE LEMBAR KERJA CUPPING SCA */}
                    {(wo.status === 'qc_pending' || wo.status === 'in_production' || wo.batches.length > 0) && (
                      <Link
                        to={matchingRoastedLot ? `/admin/roaster/cupping/${matchingRoastedLot.id}` : `/admin/roaster/cupping`}
                        className="px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-black text-xs transition-all shadow-md shadow-purple-600/20 flex items-center gap-1.5"
                      >
                        <Award className="w-3.5 h-3.5" />
                        Isi Lembar Cupping SCA
                      </Link>
                    )}

                    {/* BARCODE MODAL TRIGGER IF COMPLETED */}
                    {matchingRoastedLot && (
                      <button
                        type="button"
                        onClick={() => setBarcodeLot(matchingRoastedLot)}
                        className="p-2 rounded-xl border border-stone-200 text-stone-600 hover:bg-stone-50"
                        title="Lihat QR Code Traceability"
                      >
                        <QrCode className="w-4 h-4 text-stone-800" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Middle Row: Technical Parameters Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-3 p-3.5 bg-stone-50 rounded-xl border border-stone-200 text-xs">
                  <div>
                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Mesin Sangrai</span>
                    <span className="font-bold text-stone-900">{wo.assignedMachine}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Target Profil & Agtron</span>
                    <span className="font-bold text-stone-900">{wo.targetRoastLevel} (#{wo.targetAgtron})</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Target DTR</span>
                    <span className="font-mono font-bold text-amber-700">{wo.targetDtr}%</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Operator</span>
                    <span className="font-bold text-stone-900">{wo.assignedRoaster}</span>
                  </div>

                  <div>
                    <span className="text-[10px] text-stone-600 font-bold uppercase tracking-wider block">Jatuh Tempo</span>
                    <span className="font-bold text-stone-900">{wo.dueDate}</span>
                  </div>
                </div>

                {/* Bottom Row: Progress & Batches */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-1">
                  <div className="flex-1 max-w-md">
                    <div className="flex justify-between text-xs mb-1">
                      <span className="font-bold text-stone-700">Realisasi Sangrai Batch:</span>
                      <span className="font-mono font-bold text-amber-700">
                        {wo.actualGreenKg || 0} kg / {wo.targetGreenKg} kg ({progressPercent}%)
                      </span>
                    </div>
                    <div className="w-full bg-stone-200 rounded-full h-2 overflow-hidden">
                      <div
                        className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${progressPercent}%` }}
                      />
                    </div>
                  </div>

                  <div className="flex items-center gap-3 text-xs text-stone-600">
                    <span className="flex items-center gap-1 font-bold">
                      <Layers className="w-3.5 h-3.5 text-stone-600" />
                      {wo.batches.length} Batch Selesai
                    </span>
                    {wo.weightLossPercent && (
                      <span className="flex items-center gap-1 font-bold text-stone-700">
                        <TrendingDown className="w-3.5 h-3.5 text-amber-600" />
                        Susut Bobot: {wo.weightLossPercent}%
                      </span>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE WORK ORDER MODAL */}
      {isCreateWOOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl border border-stone-200 space-y-5 animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-black text-stone-900 flex items-center gap-2">
                  <PlusCircle className="w-5 h-5 text-amber-600" />
                  Buat Jadwal Work Order Roasting Baru
                </h3>
                <p className="text-xs text-stone-600 mt-0.5">Tentukan bahan baku green bean gudang dan resep profil sangrai.</p>
              </div>
              <button
                type="button"
                onClick={() => setIsCreateWOOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center"
              >
                <X className="w-4 h-4 text-stone-600" />
              </button>
            </div>

            <form onSubmit={handleCreateWOSubmit} className="space-y-4 text-xs">
              <div>
                <label className="font-bold text-stone-700 block mb-1">
                  Pilih Lot Bahan Baku Green Bean (Dari Gudang)
                </label>
                <select
                  value={formGreenLotId}
                  onChange={(e) => setFormGreenLotId(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  required
                >
                  {availableGreenLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.id} - {lot.variety} ({lot.origin}) [Sisa: {lot.availableWeightKg} kg]
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Target Green Bean (kg)</label>
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={formTargetGreenKg}
                    onChange={(e) => setFormTargetGreenKg(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold font-mono"
                    required
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Jatuh Tempo</label>
                  <input
                    type="date"
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">Profil Master Sangrai</label>
                  <select
                    value={formProfileId}
                    onChange={(e) => setFormProfileId(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  >
                    {masterProfiles.map((prof) => (
                      <option key={prof.id} value={prof.id}>
                        {prof.name} ({prof.targetRoastLevel})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">Mesin Roasting</label>
                  <select
                    value={formMachine}
                    onChange={(e) => setFormMachine(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  >
                    {roasterMachines.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.capacityKg} kg)
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Operator Roaster</label>
                <input
                  type="text"
                  value={formRoaster}
                  onChange={(e) => setFormRoaster(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-bold"
                  required
                />
              </div>

              <div>
                <label className="font-bold text-stone-700 block mb-1">Instruksi Khusus / Catatan Batch</label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-300 rounded-xl font-medium"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateWOOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-black shadow-md shadow-amber-600/20"
                >
                  Jadwalkan Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTISAN ROASTING SIMULATOR MODAL */}
      {activeSimulatorWO && (
        <ArtisanRoastSimulatorModal
          isOpen={!!activeSimulatorWO}
          onClose={() => setActiveSimulatorWO(null)}
          workOrder={activeSimulatorWO}
          onRoastComplete={() => {
            setActiveSimulatorWO(null);
          }}
        />
      )}

      {/* BARCODE MODAL */}
      {barcodeLot && (
        <RoasterBarcodeModal
          isOpen={!!barcodeLot}
          onClose={() => setBarcodeLot(null)}
          lot={barcodeLot}
        />
      )}
    </div>
  );
};
