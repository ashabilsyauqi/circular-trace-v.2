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
  Zap,
  Tag,
  FileText,
  Sliders,
  Award,
  Warehouse,
  Store,
  QrCode,
} from 'lucide-react';
import { WorkOrder, WorkOrderStatus, MasterRoastProfile } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { ArtisanRoastSimulatorModal } from './ArtisanRoastSimulatorModal';
import { PublishToMarketplaceModal } from './PublishToMarketplaceModal';
import { RoasterBarcodeModal } from './RoasterBarcodeModal';
import { ControlPanel } from '../shared/ControlPanel';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { StatButton } from '../shared/StatButton';
import { ActivityFeed } from '../shared/ActivityFeed';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';

interface WorkOrdersModuleProps {
  onNavigateToQC?: (wo: WorkOrder) => void;
  openCreateModalDirectly?: boolean;
}

const WO_PIPELINE_STAGES: PipelineStage[] = [
  { id: 'draft', label: 'Draft' },
  { id: 'scheduled', label: 'Terjadwal' },
  { id: 'in_production', label: 'Produksi' },
  { id: 'roasting', label: 'Sangrai Live' },
  { id: 'qc_pending', label: 'QC Lab' },
  { id: 'completed', label: 'Selesai' },
];

export const WorkOrdersModule: React.FC<WorkOrdersModuleProps> = ({
  onNavigateToQC,
  openCreateModalDirectly = false,
}) => {
  const {
    workOrders,
    warehouseLots,
    masterProfiles,
    roasterMachines,
    roastedLots,
    createWorkOrder,
    updateWorkOrderStatus,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [groupBy, setGroupBy] = useState<string>('none');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'graph'>('table');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(openCreateModalDirectly);
  const [publishModalWO, setPublishModalWO] = useState<WorkOrder | null>(null);
  const [qrLot, setQrLot] = useState<import('../../types/coffee').RoastedBeanLot | null>(null);
  const [activeRoastModalWO, setActiveRoastModalWO] = useState<WorkOrder | null>(null);
  const [detailModalWO, setDetailModalWO] = useState<WorkOrder | null>(null);

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
      {!detailModalWO && (
      <>
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

      {/* Toolbar / Control Panel */}
      <ControlPanel
        breadcrumbs={[
          { label: 'Roastery MRP' },
          { label: 'Work Orders' },
        ]}
        primaryActionLabel="+ Work Order"
        onPrimaryAction={() => setIsCreateModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { id: 'all', label: 'Semua Status' },
          { id: 'scheduled', label: 'Scheduled' },
          { id: 'in_production', label: 'In Production' },
          { id: 'roasting', label: 'Roasting Live' },
          { id: 'qc_pending', label: 'QC Pending' },
          { id: 'completed', label: 'Completed' },
        ]}
        activeGroupBy={groupBy}
        onGroupByChange={setGroupBy}
        groupByOptions={[
          { id: 'none', label: 'Tanpa Pengelompokan' },
          { id: 'status', label: 'Kelompokkan Status' },
          { id: 'machine', label: 'Kelompokkan Mesin' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        recordCount={filteredWorkOrders.length}
      />

      {/* VIEW 1: DATA TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-4 px-5">No. Work Order</th>
                  <th className="py-4 px-5">Komoditas Green Bean</th>
                  <th className="py-4 px-5">Master Profile</th>
                  <th className="py-4 px-5">Mesin & Roaster</th>
                  <th className="py-4 px-5">Target / Aktual (Kg)</th>
                  <th className="py-4 px-5">Susut (Loss %)</th>
                  <th className="py-4 px-5">Status</th>
                  <th className="py-4 px-5 text-right">Aksi Operasi</th>
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
                    <tr
                      key={wo.id}
                      className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                      onClick={() => setDetailModalWO(wo)}
                    >
                      {/* WO Number & Date */}
                      <td className="py-4 px-5">
                        <div className="font-mono font-bold text-sm text-[#EA580C] group-hover:underline">
                          {wo.woNumber}
                        </div>
                        <div className="text-[10px] text-stone-400 mt-0.5 flex items-center gap-1">
                          <Calendar className="w-3 h-3" /> Due: {wo.dueDate}
                        </div>
                      </td>

                      {/* Green Bean */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-stone-900">{wo.greenBeanName}</div>
                        <div className="text-[11px] text-stone-500">
                          {wo.origin} • <span className="font-medium">{wo.variety}</span>
                        </div>
                      </td>

                      {/* Master Profile */}
                      <td className="py-4 px-5">
                        <div className="font-bold text-stone-800">{wo.masterProfileName}</div>
                        <div className="text-[10px] text-stone-500 mt-0.5 flex items-center gap-1.5">
                          <span className="font-semibold text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                            {wo.targetRoastLevel}
                          </span>
                          <span>Agtron #{wo.targetAgtron}</span>
                        </div>
                      </td>

                      {/* Machine & Operator */}
                      <td className="py-4 px-5">
                        <div className="font-semibold text-stone-900">{wo.assignedMachine}</div>
                        <div className="text-[11px] text-stone-500 flex items-center gap-1">
                          <User className="w-3 h-3 text-stone-400" /> {wo.assignedRoaster}
                        </div>
                      </td>

                      {/* Target / Actual Weight */}
                      <td className="py-4 px-5">
                        <div className="font-mono font-bold text-sm text-stone-900">
                          {wo.actualGreenKg > 0 ? wo.actualGreenKg : wo.targetGreenKg} kg Green
                        </div>
                        <div className="text-[10px] text-stone-500 font-mono">
                          ➜ {wo.actualRoastedKg > 0 ? `${wo.actualRoastedKg} kg Roasted` : `Est. ${wo.targetRoastedKg} kg`}
                        </div>
                        {wo.status === 'in_production' && (
                          <div className="w-24 bg-stone-100 rounded-full h-1.5 mt-1 overflow-hidden">
                            <div
                              className="bg-amber-500 h-full rounded-full transition-all"
                              style={{ width: `${progressPct}%` }}
                            />
                          </div>
                        )}
                      </td>

                      {/* Weight Loss */}
                      <td className="py-4 px-5">
                        {wo.weightLossPercent > 0 ? (
                          <div className="inline-flex items-center gap-1 font-mono font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-lg border border-emerald-200">
                            <span>{wo.weightLossPercent}%</span>
                          </div>
                        ) : (
                          <span className="text-stone-400 font-mono text-[11px]">-</span>
                        )}
                      </td>

                      {/* Status */}
                      <td className="py-4 px-5">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${badge.bg} ${badge.text} ${badge.border}`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${badge.dot}`} />
                          {badge.label}
                        </span>
                      </td>

                      {/* Action Buttons */}
                      <td
                        className="py-4 px-5 text-right space-x-1.5 whitespace-nowrap"
                        onClick={(e) => e.stopPropagation()}
                      >
                        {wo.status === 'scheduled' && (
                          <button
                            onClick={() => updateWorkOrderStatus(wo.id, 'in_production')}
                            className="px-2.5 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-xl font-bold text-[11px] transition-colors shadow-2xs"
                          >
                            Mulai Batch
                          </button>
                        )}

                        {wo.status === 'in_production' && (
                          <button
                            onClick={() => {
                              setActiveRoastModalWO(wo);
                              updateWorkOrderStatus(wo.id, 'roasting');
                            }}
                            className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-[11px] transition-all shadow-2xs animate-pulse flex items-center gap-1 inline-flex"
                          >
                            <Flame className="w-3.5 h-3.5" />
                            Live Artisan
                          </button>
                        )}

                        {wo.status === 'roasting' && (
                          <button
                            onClick={() => setActiveRoastModalWO(wo)}
                            className="px-2.5 py-1.5 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-bold text-[11px] transition-colors shadow-2xs inline-flex items-center gap-1"
                          >
                            <Activity className="w-3.5 h-3.5" />
                            Artisan Sync
                          </button>
                        )}

                        {wo.status === 'qc_pending' && onNavigateToQC && (
                          <button
                            onClick={() => onNavigateToQC(wo)}
                            className="px-2.5 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold text-[11px] transition-colors shadow-2xs inline-flex items-center gap-1"
                          >
                            <Sparkles className="w-3.5 h-3.5" />
                            Uji Cupping Lab
                          </button>
                        )}

                        {wo.status === 'completed' && (() => {
                          const publishedLot = roastedLots.find((r) => r.sourceWorkOrderId === wo.id);
                          return publishedLot ? (
                            <button
                              onClick={() => setQrLot(publishedLot)}
                              className="px-2.5 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            >
                              <QrCode className="w-3.5 h-3.5" />
                              Lihat QR / Marketplace
                            </button>
                          ) : (
                            <button
                              onClick={() => setPublishModalWO(wo)}
                              className="px-2.5 py-1.5 bg-orange-500 hover:bg-orange-600 text-white rounded-xl font-bold text-[11px] transition-colors inline-flex items-center gap-1"
                            >
                              <Store className="w-3.5 h-3.5" />
                              Jual ke Marketplace
                            </button>
                          );
                        })()}
                        {wo.status === 'completed' && (
                          <button
                            onClick={() => setDetailModalWO(wo)}
                            className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition-colors"
                          >
                            Detail
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

      {/* VIEW 2: KANBAN VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {(['scheduled', 'in_production', 'qc_pending', 'completed'] as WorkOrderStatus[]).map(
            (colStatus) => {
              const colWos = filteredWorkOrders.filter((w) =>
                colStatus === 'in_production'
                  ? w.status === 'in_production' || w.status === 'roasting'
                  : w.status === colStatus
              );
              const badge = STATUS_BADGE[colStatus];

              return (
                <div
                  key={colStatus}
                  className="bg-[#FAF7F2] rounded-3xl p-4 border border-stone-200/80 space-y-3 flex flex-col"
                >
                  <div className="flex items-center justify-between pb-2 border-b border-stone-200/60">
                    <div className="flex items-center gap-2">
                      <span className={`w-2.5 h-2.5 rounded-full ${badge.dot}`} />
                      <span className="font-bold text-xs text-stone-800 uppercase tracking-wider">
                        {badge.label}
                      </span>
                    </div>
                    <span className="px-2 py-0.5 rounded-full bg-white text-stone-700 text-[10px] font-black border border-stone-200 shadow-2xs">
                      {colWos.length}
                    </span>
                  </div>

                  <div className="space-y-2.5 flex-1">
                    {colWos.length === 0 ? (
                      <div className="p-6 text-center text-[11px] text-stone-400 border border-dashed border-stone-200 rounded-2xl">
                        Tidak ada antrean
                      </div>
                    ) : (
                      colWos.map((wo) => (
                        <div
                          key={wo.id}
                          onClick={() => setDetailModalWO(wo)}
                          className="bg-white p-3.5 rounded-2xl border border-stone-200/80 shadow-2xs hover:shadow-md transition-all cursor-pointer space-y-2 group"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-mono text-sm font-bold text-[#EA580C] group-hover:underline">
                              {wo.woNumber}
                            </span>
                            <span className="text-[10px] text-stone-400">{wo.dueDate}</span>
                          </div>

                          <div>
                            <div className="text-xs font-bold text-stone-900 leading-snug">
                              {wo.greenBeanName}
                            </div>
                            <div className="text-[10px] text-stone-500">{wo.masterProfileName}</div>
                          </div>

                          <div className="flex items-center justify-between pt-2 border-t border-stone-100 text-[11px]">
                            <span className="font-mono font-bold text-sm text-stone-700">
                              {wo.targetGreenKg} kg Green
                            </span>
                            <span className="text-stone-500 font-medium">{wo.assignedMachine}</span>
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              );
            }
          )}
        </div>
      )}
      </>
      )}

      {/* WORK ORDER DETAIL PAGE (breadcrumb + stage pipeline, in-page record view) */}
      {detailModalWO && (
        <div>
          <RecordBreadcrumb
            listLabel="Work Orders"
            recordLabel={detailModalWO.woNumber}
            onBack={() => setDetailModalWO(null)}
          />
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            {/* Detail Page Header & Status Pipeline */}
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-orange-100 text-orange-600">
                  <Flame className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-black text-stone-900 font-mono">
                    {detailModalWO.woNumber}
                  </h3>
                  <p className="text-[10px] text-stone-500">
                    Dibuat: {detailModalWO.scheduledDate} • Batas: {detailModalWO.dueDate}
                  </p>
                </div>
              </div>

              {/* Status Chevron Pipeline */}
              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <StatusPipeline
                  stages={WO_PIPELINE_STAGES}
                  currentStageId={detailModalWO.status}
                />
              </div>
            </div>

            {/* Smart Stat Buttons Header */}
            <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5">
              <StatButton
                icon={<Warehouse className="w-4 h-4" />}
                value={`${detailModalWO.targetGreenKg} kg`}
                label="Bahan Baku Green"
                color="stone"
              />
              <StatButton
                icon={<Flame className="w-4 h-4" />}
                value={`#${detailModalWO.targetAgtron}`}
                label={detailModalWO.targetRoastLevel}
                color="amber"
              />
              <StatButton
                icon={<TrendingDown className="w-4 h-4" />}
                value={detailModalWO.weightLossPercent > 0 ? `${detailModalWO.weightLossPercent}%` : 'Est. 14.5%'}
                label="Roast Loss %"
                color="blue"
              />
              <StatButton
                icon={<Sparkles className="w-4 h-4" />}
                value={detailModalWO.status === 'completed' ? '88.5 SCA' : 'Pending Uji'}
                label="Quality Score"
                color="purple"
              />
            </div>

            {/* Modal Body Content */}
            <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              {/* Core Information Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 bg-stone-50/60 p-5 rounded-2xl border border-stone-200/70">
                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Coffee className="w-4 h-4 text-[#EA580C]" /> Spesifikasi Bahan Baku
                  </h4>
                  <div className="space-y-1.5 text-stone-700">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="text-stone-500">Nama Komoditas:</span>
                      <span className="font-bold text-stone-900">{detailModalWO.greenBeanName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="text-stone-500">Origin / Varietas:</span>
                      <span className="font-medium">{detailModalWO.origin} • {detailModalWO.variety}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="text-stone-500">Metode Proses:</span>
                      <span className="font-medium">{detailModalWO.processMethod}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Target Roasted Output:</span>
                      <span className="font-mono font-bold text-stone-900">{detailModalWO.targetRoastedKg} kg</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sliders className="w-4 h-4 text-[#059669]" /> Profil & Mesin Roaster
                  </h4>
                  <div className="space-y-1.5 text-stone-700">
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="text-stone-500">Master Roast Profile:</span>
                      <span className="font-bold text-stone-900">{detailModalWO.masterProfileName}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="text-stone-500">Target DTR (%):</span>
                      <span className="font-mono font-bold text-amber-800">{detailModalWO.targetDtr}%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-200/60">
                      <span className="text-stone-500">Armada Mesin:</span>
                      <span className="font-medium">{detailModalWO.assignedMachine}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Roastmaster:</span>
                      <span className="font-medium text-stone-900">{detailModalWO.assignedRoaster}</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Actions in Detail Modal */}
              <div className="flex flex-wrap items-center gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => {
                    setActiveRoastModalWO(detailModalWO);
                    setDetailModalWO(null);
                  }}
                  className="px-5 py-2.5 bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm rounded-2xl transition-all shadow-sm flex items-center gap-2"
                >
                  <Activity className="w-4 h-4 text-amber-200" />
                  Buka Artisan Roasting Simulator
                </button>

                {detailModalWO.status === 'qc_pending' && onNavigateToQC && (
                  <button
                    type="button"
                    onClick={() => {
                      onNavigateToQC(detailModalWO);
                      setDetailModalWO(null);
                    }}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-2xl transition-all shadow-sm flex items-center gap-2"
                  >
                    <Sparkles className="w-4 h-4" />
                    Buka Lembar Uji QC Cupping
                  </button>
                )}
              </div>

              {/* Internal Notes & Activity Feed */}
              <div className="pt-4 border-t border-stone-200">
                <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] mb-3 flex items-center gap-1.5">
                  <FileText className="w-4 h-4 text-[#EA580C]" /> Log Aktivitas & Catatan Batch
                </h4>
                <ActivityFeed
                  documentTitle={`Work Order #${detailModalWO.woNumber}`}
                  initialMessages={[
                    {
                      id: 'm1',
                      author: detailModalWO.assignedRoaster,
                      type: 'note',
                      content: `Batch dibuat dengan master profile ${detailModalWO.masterProfileName}. Instruksi: ${detailModalWO.notes || 'Standar specialty roast.'}`,
                      timestamp: detailModalWO.scheduledDate,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* CREATE WORK ORDER MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-stone-200 shadow-2xl relative my-8 animate-in fade-in">
            <button
              onClick={() => setIsCreateModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-3 rounded-2xl bg-orange-100 text-orange-600">
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
                  className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#EA580C]"
                >
                  <option value="">-- Pilih Lot Green Coffee --</option>
                  {warehouseLots
                    .filter((lot) => (lot.qcStatus ?? 'passed') === 'passed' && lot.availableWeightKg > 0)
                    .map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.origin} ({lot.variety}, {lot.processMethod}) — Tersedia: {lot.availableWeightKg} kg (SCA: {lot.verifiedScaScore})
                      </option>
                    ))}
                </select>
                <p className="text-[10px] text-stone-400 mt-1">
                  Hanya lot yang sudah lulus QC Masuk di Inventory yang muncul di sini.
                </p>
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-bold focus:ring-2 focus:ring-[#EA580C]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#EA580C]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#EA580C]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#EA580C]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#EA580C]"
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
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#EA580C]"
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
                  className="px-6 py-3 rounded-2xl bg-orange-600 hover:bg-orange-700 text-white font-bold text-sm transition-all shadow-md flex items-center gap-2"
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

      {/* PUBLISH TO MARKETPLACE (final step of a completed roast) */}
      <PublishToMarketplaceModal
        isOpen={!!publishModalWO}
        onClose={() => setPublishModalWO(null)}
        workOrder={publishModalWO}
        onPublished={(lot) => {
          setPublishModalWO(null);
          setQrLot(lot);
        }}
      />

      {/* QR / BARCODE FOR THE PUBLISHED ROASTED LOT */}
      <RoasterBarcodeModal isOpen={!!qrLot} onClose={() => setQrLot(null)} lot={qrLot} />
    </div>
  );
};
