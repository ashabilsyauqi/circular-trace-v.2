import React, { useState } from 'react';
import {
  Flame,
  PlusCircle,
  Search,
  SlidersHorizontal,
  LayoutGrid,
  List,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  Activity,
  Layers,
  ChevronRight,
  Calendar,
  User,
  Coffee,
  Filter,
  X,
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, MasterRoastProfile } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { ArtisanRoastSimulatorModal } from './ArtisanRoastSimulatorModal';

interface WorkOrdersModuleProps {
  onNavigateToQC?: (wo: WorkOrder) => void;
  openCreateModalDirectly?: boolean;
}

export const WorkOrdersModule: React.FC<WorkOrdersModuleProps> = ({
  onNavigateToQC,
  openCreateModalDirectly = false,
}) => {
  const {
    workOrders,
    warehouseLots,
    masterProfiles,
    roasterMachines,
    createWorkOrder,
    updateWorkOrderStatus,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | WorkOrderStatus>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban'>('table');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(openCreateModalDirectly);
  const [activeRoastModalWO, setActiveRoastModalWO] = useState<WorkOrder | null>(null);

  // Form State for Creating Work Order
  const [formGreenLotId, setFormGreenLotId] = useState('');
  const [formTargetGreenKg, setFormTargetGreenKg] = useState<number>(30);
  const [formProfileId, setFormProfileId] = useState('');
  const [formMachine, setFormMachine] = useState(roasterMachines[0]?.name || 'Giesen W6A Artisan');
  const [formRoaster, setFormRoaster] = useState('Agus Roastmaster');
  const [formDueDate, setFormDueDate] = useState(
    new Date(Date.now() + 86400000).toISOString().split('T')[0]
  );
  const [formNotes, setFormNotes] = useState('Pesanan batch sangrai specialty untuk menu cafe.');

  // Filtering
  const filteredWorkOrders = workOrders.filter((wo) => {
    const matchesQuery =
      wo.woNumber.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.greenBeanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.origin.toLowerCase().includes(searchQuery.toLowerCase()) ||
      wo.masterProfileName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (wo.customerName && wo.customerName.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus = statusFilter === 'all' || wo.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  // KPI Calculations
  const totalWos = workOrders.length;
  const inProductionCount = workOrders.filter(
    (w) => w.status === 'in_production' || w.status === 'roasting'
  ).length;
  const qcPendingCount = workOrders.filter((w) => w.status === 'qc_pending').length;
  const totalRoastedKgToday = workOrders.reduce((acc, curr) => acc + curr.actualRoastedKg, 0);

  const completedWosWithLoss = workOrders.filter((w) => w.weightLossPercent > 0);
  const avgRoastLoss =
    completedWosWithLoss.length > 0
      ? (
          completedWosWithLoss.reduce((acc, w) => acc + w.weightLossPercent, 0) /
          completedWosWithLoss.length
        ).toFixed(1)
      : '14.5';

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedLot = warehouseLots.find((l) => l.id === formGreenLotId) || warehouseLots[0];
    const selectedProf =
      masterProfiles.find((p) => p.id === formProfileId) || masterProfiles[0];

    if (!selectedLot || !selectedProf) return;

    createWorkOrder({
      scheduledDate: new Date().toISOString().split('T')[0],
      dueDate: formDueDate,
      status: 'scheduled',
      greenLotId: selectedLot.id,
      greenBeanName: `${selectedLot.origin} - ${selectedLot.variety}`,
      origin: selectedLot.origin,
      variety: selectedLot.variety,
      processMethod: selectedLot.processMethod,
      targetGreenKg: Number(formTargetGreenKg),
      targetRoastedKg: Number((formTargetGreenKg * 0.855).toFixed(1)),
      masterProfileId: selectedProf.id,
      masterProfileName: selectedProf.name,
      targetRoastLevel: selectedProf.targetRoastLevel,
      targetAgtron: selectedProf.agtronGourmet,
      targetDtr: selectedProf.targetDtr,
      assignedMachine: formMachine,
      assignedRoaster: formRoaster,
      notes: formNotes,
    });

    setIsCreateModalOpen(false);
  };

  const STATUS_BADGE: Record<
    WorkOrderStatus,
    { label: string; bg: string; text: string; border: string; dot: string }
  > = {
    draft: { label: 'Draft', bg: 'bg-stone-100', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400' },
    scheduled: { label: 'Scheduled', bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-500' },
    in_production: { label: 'In Production', bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', dot: 'bg-amber-500' },
    roasting: { label: 'Roasting Live', bg: 'bg-orange-50', text: 'text-orange-700', border: 'border-orange-300', dot: 'bg-orange-500 animate-pulse' },
    qc_pending: { label: 'QC Pending', bg: 'bg-purple-50', text: 'text-purple-700', border: 'border-purple-200', dot: 'bg-purple-500' },
    completed: { label: 'Completed', bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-500' },
    cancelled: { label: 'Cancelled', bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-400' },
  };

  return (
    <div className="space-y-6">
      {/* Top Cruip Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Work Orders"
          value={`${totalWos} Batch`}
          subtitle={`${inProductionCount} aktif dalam antrean sangrai`}
          trend={{ value: `${inProductionCount} In Progress`, isPositive: true }}
          icon={<Flame className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Output Sangrai (Roasted)"
          value={`${totalRoastedKgToday.toFixed(1)} kg`}
          subtitle="Total hasil roasted coffee siap kemas"
          trend={{ value: '+18.4% vs pekan lalu', isPositive: true }}
          icon={<Coffee className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Rata-rata Roast Loss"
          value={`${avgRoastLoss}%`}
          subtitle="Standar SCA Specialty (13.5% - 15.5%)"
          trend={{ value: 'Optimal Yield', isPositive: true }}
          icon={<TrendingDown className="w-5 h-5" />}
          color="blue"
        />
        <MetricCard
          title="Menunggu Uji QC"
          value={`${qcPendingCount} Batch`}
          subtitle="Perlu validasi skor SCA & Agtron"
          trend={{ value: 'Prioritas Cupping', isPositive: qcPendingCount === 0 }}
          icon={<Sparkles className="w-5 h-5" />}
          color="purple"
        />
      </div>

      {/* Toolbar & Status Tabs */}
      <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          {/* Search Box */}
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari No. WO, origin, profil, mesin..."
              className="w-full pl-9 pr-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-xs focus:ring-2 focus:ring-amber-500 focus:bg-white transition-all"
            />
          </div>

          {/* Action Buttons & View Toggle */}
          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <div className="flex items-center bg-stone-100 p-1 rounded-xl border border-stone-200">
              <button
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Tampilan Tabel Data"
              >
                <List className="w-4 h-4" />
                <span className="hidden sm:inline">Tabel</span>
              </button>
              <button
                onClick={() => setViewMode('kanban')}
                className={`p-1.5 rounded-lg text-xs font-bold transition-all flex items-center gap-1 ${
                  viewMode === 'kanban'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-800'
                }`}
                title="Tampilan Papan Kanban"
              >
                <LayoutGrid className="w-4 h-4" />
                <span className="hidden sm:inline">Kanban</span>
              </button>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold text-xs transition-colors flex items-center gap-1.5 shadow-xs shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>+ Buat Work Order</span>
            </button>
          </div>
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 border-t border-stone-100 pt-3 text-xs">
          {[
            { id: 'all', label: 'Semua Status', count: workOrders.length },
            { id: 'scheduled', label: 'Scheduled', count: workOrders.filter((w) => w.status === 'scheduled').length },
            { id: 'in_production', label: 'In Production', count: workOrders.filter((w) => w.status === 'in_production').length },
            { id: 'roasting', label: 'Roasting Live', count: workOrders.filter((w) => w.status === 'roasting').length },
            { id: 'qc_pending', label: 'QC Pending', count: workOrders.filter((w) => w.status === 'qc_pending').length },
            { id: 'completed', label: 'Completed', count: workOrders.filter((w) => w.status === 'completed').length },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setStatusFilter(tab.id as any)}
              className={`px-3 py-1.5 rounded-xl font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
                statusFilter === tab.id
                  ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                  : 'text-stone-600 hover:bg-stone-100'
              }`}
            >
              <span>{tab.label}</span>
              <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                statusFilter === tab.id ? 'bg-amber-200 text-amber-950 font-black' : 'bg-stone-200 text-stone-600'
              }`}>
                {tab.count}
              </span>
            </button>
          ))}
        </div>
      </div>

      {/* VIEW 1: DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Work Order</th>
                  <th className="py-3.5 px-4">Komoditas Green Bean</th>
                  <th className="py-3.5 px-4">Master Profile</th>
                  <th className="py-3.5 px-4">Mesin & Roaster</th>
                  <th className="py-3.5 px-4">Target / Aktual (Kg)</th>
                  <th className="py-3.5 px-4">Susut (Loss %)</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4 text-right">Aksi Operasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredWorkOrders.map((wo) => {
                  const badge = STATUS_BADGE[wo.status];
                  const progressPct =
                    wo.targetGreenKg > 0
                      ? Math.min(100, Math.round((wo.actualGreenKg / wo.targetGreenKg) * 100))
                      : 0;

                  return (
                    <tr key={wo.id} className="hover:bg-stone-50/70 transition-colors">
                      {/* WO Number & Date */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-black text-stone-900">{wo.woNumber}</div>
                        <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due: {wo.dueDate}
                        </div>
                      </td>

                      {/* Green Bean */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900">{wo.greenBeanName}</div>
                        <div className="text-[11px] text-stone-500">
                          {wo.variety} • {wo.processMethod}
                        </div>
                      </td>

                      {/* Profile & Target */}
                      <td className="py-3.5 px-4">
                        <div className="font-semibold text-stone-800">{wo.masterProfileName}</div>
                        <div className="text-[10px] text-stone-400">
                          Agtron #{wo.targetAgtron} • DTR {wo.targetDtr}%
                        </div>
                      </td>

                      {/* Machine & Operator */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-800">{wo.assignedMachine}</div>
                        <div className="text-[10px] text-stone-400 flex items-center gap-1">
                          <User className="w-3 h-3" /> {wo.assignedRoaster}
                        </div>
                      </td>

                      {/* Weight Progress */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center justify-between font-mono text-[11px] mb-1">
                          <span>{wo.actualGreenKg} / {wo.targetGreenKg} kg</span>
                          <span className="text-amber-700 font-bold">({wo.actualRoastedKg} kg Rst)</span>
                        </div>
                        <div className="w-28 bg-stone-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-600 h-1.5 rounded-full"
                            style={{ width: `${progressPct}%` }}
                          />
                        </div>
                      </td>

                      {/* Weight Loss */}
                      <td className="py-3.5 px-4 font-mono font-bold text-stone-800">
                        {wo.weightLossPercent > 0 ? (
                          <span className="text-stone-900">{wo.weightLossPercent}%</span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          {wo.status !== 'completed' && (
                            <button
                              onClick={() => setActiveRoastModalWO(wo)}
                              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all flex items-center gap-1 shadow-xs"
                            >
                              <Flame className="w-3.5 h-3.5" />
                              Mulai Sangrai
                            </button>
                          )}

                          {wo.status === 'qc_pending' && onNavigateToQC && (
                            <button
                              onClick={() => onNavigateToQC(wo)}
                              className="px-2.5 py-1.5 rounded-xl bg-purple-100 hover:bg-purple-200 text-purple-900 font-bold text-xs transition-colors border border-purple-300 flex items-center gap-1"
                            >
                              <Sparkles className="w-3 h-3 text-purple-700" />
                              QC Cupping
                            </button>
                          )}

                          {wo.status === 'completed' && (
                            <span className="text-[11px] text-emerald-700 font-bold flex items-center gap-1">
                              <CheckCircle2 className="w-3.5 h-3.5" /> Selesai
                            </span>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* VIEW 2: KANBAN BOARD VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['scheduled', 'in_production', 'qc_pending', 'completed'] as WorkOrderStatus[]).map(
            (colStatus) => {
              const colWos = filteredWorkOrders.filter((w) => w.status === colStatus);
              const badge = STATUS_BADGE[colStatus];

              return (
                <div
                  key={colStatus}
                  className="bg-stone-100/70 rounded-3xl p-4 border border-stone-200/80 flex flex-col justify-between min-h-[500px]"
                >
                  <div>
                    {/* Column Header */}
                    <div className="flex items-center justify-between pb-3 mb-3 border-b border-stone-200">
                      <div className="flex items-center gap-2">
                        <span className={`w-2 h-2 rounded-full ${badge.dot}`} />
                        <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800">
                          {badge.label}
                        </h4>
                      </div>
                      <span className="px-2 py-0.5 rounded-full bg-white text-stone-700 text-[11px] font-mono font-bold border border-stone-200">
                        {colWos.length}
                      </span>
                    </div>

                    {/* Cards Stack */}
                    <div className="space-y-3">
                      {colWos.map((wo) => (
                        <div
                          key={wo.id}
                          className="bg-white rounded-2xl p-4 border border-stone-200/90 shadow-2xs hover:shadow-md transition-all space-y-2.5"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono font-black text-xs text-amber-900">
                              {wo.woNumber}
                            </span>
                            <span className="text-[10px] text-stone-400 font-medium">
                              {wo.dueDate}
                            </span>
                          </div>

                          <div>
                            <h5 className="font-bold text-xs text-stone-900 leading-tight">
                              {wo.greenBeanName}
                            </h5>
                            <p className="text-[11px] text-stone-500 mt-0.5">
                              {wo.masterProfileName}
                            </p>
                          </div>

                          <div className="bg-stone-50 p-2.5 rounded-xl border border-stone-100 text-[11px] space-y-1">
                            <div className="flex justify-between">
                              <span className="text-stone-500">Target Green:</span>
                              <strong className="text-stone-800">{wo.targetGreenKg} kg</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Output Roasted:</span>
                              <strong className="text-amber-700">{wo.actualRoastedKg} kg</strong>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-stone-500">Mesin Sangrai:</span>
                              <span className="text-stone-700 truncate max-w-[120px]">{wo.assignedMachine}</span>
                            </div>
                          </div>

                          {/* Quick Action Button */}
                          <div className="pt-1">
                            {wo.status !== 'completed' ? (
                              <button
                                onClick={() => setActiveRoastModalWO(wo)}
                                className="w-full py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs transition-colors flex items-center justify-center gap-1.5 shadow-xs"
                              >
                                <Flame className="w-3.5 h-3.5" />
                                Mulai Roasting
                              </button>
                            ) : (
                              <div className="text-center py-1 text-[11px] font-bold text-emerald-700 flex items-center justify-center gap-1">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Batch Selesai
                              </div>
                            )}
                          </div>
                        </div>
                      ))}

                      {colWos.length === 0 && (
                        <div className="text-center py-10 text-stone-400 text-xs italic">
                          Tidak ada work order di kolom ini.
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}

      {/* CREATE WORK ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-2xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-2.5 rounded-xl bg-amber-100 text-amber-800">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Buat Work Order Baru</h3>
                <p className="text-xs text-stone-500">Jadwalkan batch sangrai dengan alokasi lot green bean dan master profile.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              {/* Green Bean Lot Select */}
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Pilih Lot Green Bean di Gudang
                </label>
                <select
                  required
                  value={formGreenLotId}
                  onChange={(e) => setFormGreenLotId(e.target.value)}
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                >
                  <option value="">-- Pilih Lot Green Coffee --</option>
                  {warehouseLots.map((lot) => (
                    <option key={lot.id} value={lot.id}>
                      {lot.origin} ({lot.variety}, {lot.processMethod}) — Tersedia: {lot.availableWeightKg} kg (SCA: {lot.verifiedScaScore})
                    </option>
                  ))}
                </select>
              </div>

              {/* Target Kg & Master Profile */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Target Berat Green Bean (Kg)
                  </label>
                  <input
                    type="number"
                    min="1"
                    step="0.5"
                    required
                    value={formTargetGreenKg}
                    onChange={(e) => setFormTargetGreenKg(Number(e.target.value))}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-amber-500"
                  />
                  <span className="text-[10px] text-stone-400 mt-0.5 block">
                    Estimasi Roasted: ~{(formTargetGreenKg * 0.855).toFixed(1)} kg (@ 14.5% shrink)
                  </span>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Master Roast Profile (Resep)
                  </label>
                  <select
                    required
                    value={formProfileId}
                    onChange={(e) => setFormProfileId(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    <option value="">-- Pilih Master Profile --</option>
                    {masterProfiles.map((p) => (
                      <option key={p.id} value={p.id}>
                        {p.name} ({p.targetRoastLevel}, Agtron #{p.agtronGourmet})
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Machine & Operator */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Mesin Sangrai (Roaster Fleet)
                  </label>
                  <select
                    value={formMachine}
                    onChange={(e) => setFormMachine(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  >
                    {roasterMachines.map((m) => (
                      <option key={m.id} value={m.name}>
                        {m.name} ({m.capacityKg}kg / batch)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Operator / Roastmaster
                  </label>
                  <input
                    type="text"
                    required
                    value={formRoaster}
                    onChange={(e) => setFormRoaster(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              {/* Due Date & Notes */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Batas Waktu Target (Due Date)
                  </label>
                  <input
                    type="date"
                    required
                    value={formDueDate}
                    onChange={(e) => setFormDueDate(e.target.value)}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Catatan Instruksi Khusus
                  </label>
                  <input
                    type="text"
                    value={formNotes}
                    onChange={(e) => setFormNotes(e.target.value)}
                    placeholder="Instruksi kemasan, profiling..."
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-amber-500"
                  />
                </div>
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-stone-900 hover:bg-amber-800 text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <PlusCircle className="w-4 h-4" />
                  Jadwalkan Work Order
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ARTISAN ROASTING SIMULATOR MODAL */}
      <ArtisanRoastSimulatorModal
        isOpen={!!activeRoastModalWO}
        onClose={() => setActiveRoastModalWO(null)}
        workOrder={activeRoastModalWO}
      />
    </div>
  );
};
