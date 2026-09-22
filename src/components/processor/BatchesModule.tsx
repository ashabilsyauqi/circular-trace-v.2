import React, { useState } from 'react';
import {
  Flame,
  PlusCircle,
  Search,
  SlidersHorizontal,
  Clock,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
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
  Droplets,
  Recycle,
  Scale,
  ShieldCheck,
  MapPin,
  Thermometer,
  Percent,
  Check,
  AlertTriangle,
  Printer,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { ProcessingBatch, ProcessingStageId, DryingDayLog } from '../../types/processorErp';
import { PROCESSOR_7_STAGES, validateStageQualityGate, autoCalculateCoffeeGrade } from '../../utils/coffeeQualityGates';
import { calculateBatchMassBalance } from '../../utils/coffeeMassBalance';
import { calculateProcessorEcoRating } from '../../utils/ecoRating';
import { MetricCard } from '../admin/MetricCard';
import { ControlPanel } from '../shared/ControlPanel';
import { StatusPipeline, PipelineStage } from '../shared/StatusPipeline';
import { StatButton } from '../shared/StatButton';
import { RecordBreadcrumb } from '../shared/RecordBreadcrumb';
import { ActivityFeed } from '../shared/ActivityFeed';
import { ProcessorBarcodeModal } from '../ProcessorBarcodeModal';

const PIPELINE_STAGES: PipelineStage[] = PROCESSOR_7_STAGES.map((s) => ({
  id: s.id,
  label: s.shortLabel,
}));

export const BatchesModule: React.FC = () => {
  const {
    processingBatches,
    processorCherryStock,
    farmerLots,
    createProcessingBatch,
    advanceBatchStage,
    addDryingDayLog,
    updateBatchStageLog,
    finalizeBatchAndPublish,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'kanban' | 'table'>('cards');
  const [detailBatch, setDetailBatch] = useState<ProcessingBatch | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'telemetry' | 'milling' | 'grading' | 'mass_balance' | 'waste' | 'eudr'>('overview');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isDryingModalOpen, setIsDryingModalOpen] = useState(false);
  const [isQcModalOpen, setIsQcModalOpen] = useState(false);
  const [isFinalizeModalOpen, setIsFinalizeModalOpen] = useState(false);
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedBatchForBarcode, setSelectedBatchForBarcode] = useState<any>(null);

  // Quick feedback messages
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // Form State: Create Batch
  const [formSourceType, setFormSourceType] = useState<'stock' | 'farmer'>('stock');
  const [formCherryStockId, setFormCherryStockId] = useState('');
  const [formFarmerLotId, setFormFarmerLotId] = useState('');
  const [formCherryKg, setFormCherryKg] = useState<number>(500);
  const [formMethod, setFormMethod] = useState<ProcessingBatch['fermentationLog']['method']>('Anaerobic Natural');
  const [formDryingMethod, setFormDryingMethod] = useState<ProcessingBatch['dryingLog']['dryingMethod']>('Solar Dryer Raised Bed');
  const [formOperator, setFormOperator] = useState('Budi Santoso (Mill Master)');
  const [formNotes, setFormNotes] = useState('Batch olahan ceri petik merah segar.');

  // Form State: Add Daily Drying Log
  const [formDryingDayMoisture, setFormDryingDayMoisture] = useState<number>(11.5);
  const [formDryingDayTemp, setFormDryingDayTemp] = useState<number>(29.5);
  const [formDryingDayRh, setFormDryingDayRh] = useState<number>(54);
  const [formDryingDayFreq, setFormDryingDayFreq] = useState('Tiap 2 Jam');
  const [formDryingDayNotes, setFormDryingDayNotes] = useState('Pembalikan rata di raised bed solar dome.');

  // Form State: QC Grading
  const [formPrimaryDefects, setFormPrimaryDefects] = useState<number>(0);
  const [formSecondaryDefects, setFormSecondaryDefects] = useState<number>(2);
  const [formScreen18Kg, setFormScreen18Kg] = useState<number>(95);
  const [formScreen16Kg, setFormScreen16Kg] = useState<number>(35);
  const [formScreen14Kg, setFormScreen14Kg] = useState<number>(15);
  const [formMoistureQC, setFormMoistureQC] = useState<number>(11.2);
  const [formAwQC, setFormAwQC] = useState<number>(0.56);
  const [formScaScore, setFormScaScore] = useState<number>(88.25);
  const [formCuppingNotes, setFormCuppingNotes] = useState<string>('Dark Cherry, Blackberry Wine, Dark Chocolate, Molasses');

  // Form State: Finalize & Packing
  const [formBaggingType, setFormBaggingType] = useState<ProcessingBatch['packingLog']['baggingType']>('GrainPro 60kg + Karung Goni');
  const [formPricePerKg, setFormPricePerKg] = useState<number>(135000);
  const [formFinalGrade, setFormFinalGrade] = useState<'Specialty Grade 1' | 'Grade 2' | 'Commercial Fine'>('Specialty Grade 1');

  // Filtered batches
  const filteredBatches = processingBatches.filter((b) => {
    const q = searchQuery.toLowerCase();
    const matchSearch =
      b.id.toLowerCase().includes(q) ||
      b.batchCode.toLowerCase().includes(q) ||
      b.variety.toLowerCase().includes(q) ||
      b.sourceFarmerName.toLowerCase().includes(q) ||
      b.sourceOrigin.toLowerCase().includes(q) ||
      b.fermentationLog.method.toLowerCase().includes(q);
    const matchStage = stageFilter === 'all' || b.currentStage === stageFilter;
    return matchSearch && matchStage;
  });

  // KPI calculations
  const totalBatchesCount = processingBatches.length;
  const inProgressBatches = processingBatches.filter((b) => b.status === 'in_progress');
  const totalCherryProcessedKg = processingBatches.reduce((acc, b) => acc + (b.intakeLog?.cherryWeightKg || 0), 0);
  const totalGreenBeanProducedKg = processingBatches.reduce((acc, b) => acc + (b.packingLog?.finalGreenBeanWeightKg || b.millingLog?.outputGreenBeanWeightKg || 0), 0);
  
  const avgYieldPercent = totalCherryProcessedKg > 0
    ? ((totalGreenBeanProducedKg / totalCherryProcessedKg) * 100).toFixed(1)
    : '16.5';

  const availableCherryStock = processorCherryStock.filter((s) => s.availableWeightKg > 0);
  const availableFarmerLots = farmerLots.filter((l) => l.availableWeightKg > 0);

  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newBatch: ProcessingBatch | null = null;

    if (formSourceType === 'stock') {
      const targetStockId = formCherryStockId || availableCherryStock[0]?.id;
      if (!targetStockId) {
        setAlertMessage({ type: 'error', text: 'Stok ceri di gudang kosong. Silakan beli ceri dari Petani atau pilih sumber Langsung Petani.' });
        return;
      }
      newBatch = createProcessingBatch({
        sourceCherryStockId: targetStockId,
        boughtCherryKg: Number(formCherryKg),
        method: formMethod,
        dryingMethod: formDryingMethod,
        operatorName: formOperator,
        notes: formNotes,
      });
    } else {
      const targetLotId = formFarmerLotId || availableFarmerLots[0]?.id;
      if (!targetLotId) {
        setAlertMessage({ type: 'error', text: 'Pilih lot ceri petani yang masih tersedia stoknya.' });
        return;
      }
      newBatch = createProcessingBatch({
        sourceFarmerLotId: targetLotId,
        boughtCherryKg: Number(formCherryKg),
        method: formMethod,
        dryingMethod: formDryingMethod,
        operatorName: formOperator,
        notes: formNotes,
      });
    }

    if (newBatch) {
      setAlertMessage({ type: 'success', text: `Batch baru ${newBatch.batchCode} (${formMethod}) berhasil diinisiasi dari panen ceri!` });
      setIsCreateModalOpen(false);
      setDetailBatch(newBatch);
    }
  };

  const handleAdvanceStage = (batch: ProcessingBatch) => {
    const currentIdx = PROCESSOR_7_STAGES.findIndex((s) => s.id === batch.currentStage);
    if (currentIdx === -1 || currentIdx >= PROCESSOR_7_STAGES.length - 1) {
      setAlertMessage({ type: 'warning', text: 'Batch sudah mencapai tahap akhir (Packing & Penutupan Lot).' });
      return;
    }

    const nextStage = PROCESSOR_7_STAGES[currentIdx + 1].id;
    const result = advanceBatchStage(batch.id, nextStage);

    if (result.success) {
      setAlertMessage({ type: 'success', text: result.message });
      // Update local selected state
      const updated = processingBatches.find((b) => b.id === batch.id);
      if (updated) {
        setDetailBatch({ ...updated, currentStage: nextStage });
      }
    } else {
      setAlertMessage({ type: 'error', text: `Quality Gate Menolak: ${result.message}` });
    }
  };

  const handleAddDryingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailBatch) return;

    const nextDayNum = (detailBatch.dryingLog.dailyLogs?.length || 0) + 1;
    const dayLog: DryingDayLog = {
      dayNumber: nextDayNum,
      date: new Date().toISOString().split('T')[0],
      moisturePercent: Number(formDryingDayMoisture),
      ambientTempCelsius: Number(formDryingDayTemp),
      rhPercent: Number(formDryingDayRh),
      turningFrequency: formDryingDayFreq,
      notes: formDryingDayNotes,
    };

    addDryingDayLog(detailBatch.id, dayLog);
    setIsDryingModalOpen(false);
    setAlertMessage({
      type: 'success',
      text: `Log Penjemuran Hari ke-${nextDayNum} berhasil disimpan! Kadar air saat ini: ${formDryingDayMoisture}%. ${
        formDryingDayMoisture <= 12.5 ? '✓ Lolos Quality Gate (<= 12.5%)' : '⚠ Belum memenuhi Quality Gate (<= 12.5%)'
      }`,
    });

    // Refresh active detail
    setDetailBatch((prev) => {
      if (!prev) return null;
      const updatedDaily = [...prev.dryingLog.dailyLogs, dayLog];
      return {
        ...prev,
        dryingLog: {
          ...prev.dryingLog,
          dailyLogs: updatedDaily,
          finalMoisturePercent: Number(formDryingDayMoisture),
          targetMoisturePassed: Number(formDryingDayMoisture) <= 12.5,
        },
      };
    });
  };

  const handleQcSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailBatch) return;

    const autoGradeResult = autoCalculateCoffeeGrade(
      Number(formPrimaryDefects),
      Number(formSecondaryDefects),
      Number(formMoistureQC),
      Number(formAwQC)
    );

    const notesList = formCuppingNotes
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    const qcData = {
      assessmentDate: new Date().toISOString().split('T')[0],
      inspectorName: 'Q-Grader Stasiun',
      sampleWeightGrams: 350,
      defects: {
        primaryDefects: Number(formPrimaryDefects),
        secondaryDefects: Number(formSecondaryDefects),
        totalScoreValue: autoGradeResult.totalDefectScore,
      },
      screenDistribution: {
        screen18PlusKg: Number(formScreen18Kg),
        screen16_17Kg: Number(formScreen16Kg),
        screen14_15Kg: Number(formScreen14Kg),
        peaberryKg: 0,
      },
      finalMoisturePercent: Number(formMoistureQC),
      waterActivityAw: Number(formAwQC),
      densityGramsPerLiter: 725,
      calculatedGrade: autoGradeResult.grade,
      scaCuppingScore: Number(formScaScore),
      cuppingNotes: notesList.length > 0 ? notesList : ['Clean', 'Sweet'],
      notes: autoGradeResult.gradeDescription,
    };

    updateBatchStageLog(detailBatch.id, 'grading_qc', qcData);
    setIsQcModalOpen(false);
    setAlertMessage({
      type: 'success',
      text: `Uji Mutu Fisik SCA Selesai! Grade Otomatis: ${autoGradeResult.grade} (Score SCA ${formScaScore}).`,
    });

    setDetailBatch((prev) => (prev ? { ...prev, qcAssessment: qcData as any } : null));
  };

  const handleFinalizeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!detailBatch) return;

    const notesList = formCuppingNotes
      .split(',')
      .map((n) => n.trim())
      .filter(Boolean);

    const createdLot = finalizeBatchAndPublish(detailBatch.id, {
      baggingType: formBaggingType,
      pricePerKg: Number(formPricePerKg),
      cuppingNotes: notesList.length > 0 ? notesList : detailBatch.qcAssessment.cuppingNotes,
      grade: formFinalGrade,
      notes: 'Batch ditutup sempurna & diterbitkan ke katalog penjualan.',
    });

    setIsFinalizeModalOpen(false);
    setAlertMessage({
      type: 'success',
      text: `Batch ${detailBatch.batchCode} berhasil ditutup & diterbitkan sebagai Green Bean Lot di Marketplace!`,
    });

    if (createdLot) {
      setSelectedBatchForBarcode(createdLot);
      setBarcodeModalOpen(true);
    }
  };

  return (
    <div className="space-y-5">
      {/* Alert Banner */}
      {alertMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs font-bold flex items-center justify-between shadow-2xs animate-in fade-in ${
            alertMessage.type === 'success'
              ? 'bg-emerald-50 border-emerald-300 text-emerald-950'
              : alertMessage.type === 'error'
              ? 'bg-rose-50 border-rose-300 text-rose-950'
              : 'bg-amber-50 border-amber-300 text-amber-950'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {alertMessage.type === 'success' && <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />}
            {alertMessage.type === 'error' && <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />}
            {alertMessage.type === 'warning' && <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />}
            <span>{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-stone-400 hover:text-stone-700 text-xs font-bold">
            Tutup
          </button>
        </div>
      )}

      {!detailBatch ? (
        <>
          {/* Top Title & Quick Actions */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-xl font-black text-stone-900 tracking-tight flex items-center gap-2">
                <Flame className="w-5 h-5 text-amber-600" />
                Work Orders &amp; 7-Stage Post-Harvest Processing
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Alur manufaktur pengolahan kopi specialty hulu ke hilir dengan kontrol Rendemen (Mass Balance) &amp; Quality Gates.
              </p>
            </div>

            <button
              onClick={() => setIsCreateModalOpen(true)}
              className="px-4 py-2.5 rounded-2xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold flex items-center gap-2 shadow-xs transition-all shrink-0"
            >
              <PlusCircle className="w-4 h-4" />
              <span>Mulai Batch Pengolahan Baru</span>
            </button>
          </div>

          {/* KPI Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Batch Aktif"
              value={inProgressBatches.length}
              subtitle={`Dari ${totalBatchesCount} total siklus olah`}
              icon={<Activity className="w-5 h-5 text-amber-600" />}
              color="amber"
              trend={{ value: 'Operasional', isPositive: true }}
            />
            <MetricCard
              title="Total Ceri Masuk (Intake)"
              value={`${totalCherryProcessedKg.toLocaleString()} kg`}
              subtitle="Volume ceri segar terkelola"
              icon={<Coffee className="w-5 h-5 text-emerald-600" />}
              color="emerald"
            />
            <MetricCard
              title="Rata-rata Rendemen Yield"
              value={`${avgYieldPercent}%`}
              subtitle="Benchmark Arabica 14-18%"
              icon={<TrendingUp className="w-5 h-5 text-blue-600" />}
              color="blue"
              trend={{ value: 'Optimal', isPositive: true }}
            />
            <MetricCard
              title="Output Green Bean"
              value={`${totalGreenBeanProducedKg.toLocaleString()} kg`}
              subtitle="Hasil giling siap gudang/jual"
              icon={<Warehouse className="w-5 h-5 text-purple-600" />}
              color="purple"
            />
          </div>

          {/* Control Panel */}
          <ControlPanel
            breadcrumbs={[{ label: 'Daftar Batch Pengolahan (7 Stages)' }]}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={stageFilter}
            onFilterChange={setStageFilter}
            filterOptions={[
              { id: 'all', label: 'Semua Tahap' },
              { id: 'intake_sorting', label: '1. Intake & Sortasi' },
              { id: 'fermentation', label: '2. Fermentasi' },
              { id: 'drying', label: '3. Penjemuran' },
              { id: 'conditioning', label: '4. Pemeraman' },
              { id: 'milling', label: '5. Hulling Mill' },
              { id: 'grading_qc', label: '6. Grading & QC' },
              { id: 'packing_closure', label: '7. Packing & Rilis' },
            ]}
            viewMode={viewMode === 'cards' ? 'table' : (viewMode as any)}
            onViewModeChange={(m) => setViewMode(m as any)}
            recordCount={filteredBatches.length}
          />

          {/* VIEW 1: CARDS GRID VIEW */}
          {viewMode === 'cards' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBatches.map((batch) => {
                const massBalance = calculateBatchMassBalance(batch);
                const currentStageInfo = PROCESSOR_7_STAGES.find((s) => s.id === batch.currentStage) || PROCESSOR_7_STAGES[0];
                const isCompleted = batch.status === 'completed';

                return (
                  <div
                    key={batch.id}
                    onClick={() => {
                      setDetailBatch(batch);
                      setActiveTab('overview');
                    }}
                    className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      <div className="relative h-44 bg-stone-100 overflow-hidden">
                        <img
                          src={batch.photoUrl}
                          alt={batch.variety}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <div className="absolute top-3 left-3 bg-stone-900/85 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                          {batch.batchCode}
                        </div>
                        <div className="absolute top-3 right-3 flex items-center gap-1.5">
                          <span className="bg-amber-700 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                            {batch.fermentationLog.method}
                          </span>
                          {isCompleted ? (
                            <span className="bg-emerald-600 text-white text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs">
                              Selesai
                            </span>
                          ) : (
                            <span className="bg-amber-500 text-stone-950 text-[10px] font-bold uppercase px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                              Step {currentStageInfo.stepNumber}/7
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center gap-1 text-[11px] text-stone-500 mb-1">
                            <span>Petani Asal:</span>
                            <strong className="text-stone-800">{batch.sourceFarmerName}</strong>
                            <span>({batch.sourceFarmerLotId})</span>
                          </div>
                          <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                            {batch.variety} - {currentStageInfo.shortLabel}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {batch.sourceOrigin} ({batch.altitude})
                          </p>
                        </div>

                        {/* Stage Progress Bar */}
                        <div className="space-y-1">
                          <div className="flex justify-between text-[10px] font-semibold text-stone-500">
                            <span>Tahap: {currentStageInfo.label}</span>
                            <span>{Math.round((currentStageInfo.stepNumber / 7) * 100)}%</span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-2 overflow-hidden">
                            <div
                              className="bg-amber-500 h-2 rounded-full transition-all duration-500"
                              style={{ width: `${(currentStageInfo.stepNumber / 7) * 100}%` }}
                            />
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Ceri Masuk:</span>
                            <span className="font-bold text-stone-800">{batch.intakeLog.cherryWeightKg} kg</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Rendemen:</span>
                            <span className="font-black text-amber-700">{massBalance.actualYieldPercent}% Yield</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Brix Buah:</span>
                            <span className="font-semibold text-stone-800">{batch.intakeLog.brix}° Bx</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Kadar Air:</span>
                            <span className="font-semibold text-stone-800">{batch.dryingLog.finalMoisturePercent}%</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="px-5 pb-5 pt-0">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailBatch(batch);
                          setActiveTab('overview');
                        }}
                        className="w-full py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center justify-center gap-2 transition-colors shadow-2xs"
                      >
                        <FileText className="w-3.5 h-3.5" />
                        <span>Buka Lembar Kerja 7-Stage</span>
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* VIEW 2: KANBAN 7-STAGE VIEW */}
          {viewMode === 'kanban' && (
            <div className="overflow-x-auto pb-4">
              <div className="flex gap-4 min-w-[1400px]">
                {PROCESSOR_7_STAGES.map((stage) => {
                  const stageBatches = processingBatches.filter((b) => b.currentStage === stage.id);
                  return (
                    <div key={stage.id} className="w-80 flex-shrink-0 bg-stone-100/70 rounded-2xl p-3 border border-stone-200/80">
                      <div className="flex items-center justify-between pb-2 mb-3 border-b border-stone-200">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded-full bg-amber-500 text-stone-950 text-[10px] font-black flex items-center justify-center">
                            {stage.stepNumber}
                          </span>
                          <h4 className="font-bold text-xs text-stone-900 truncate">{stage.shortLabel}</h4>
                        </div>
                        <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-white text-stone-600 border border-stone-200">
                          {stageBatches.length}
                        </span>
                      </div>

                      <div className="space-y-3 max-h-[650px] overflow-y-auto pr-1">
                        {stageBatches.length === 0 ? (
                          <div className="p-6 text-center text-stone-400 text-xs italic">
                            Kosong
                          </div>
                        ) : (
                          stageBatches.map((batch) => {
                            const massBalance = calculateBatchMassBalance(batch);
                            return (
                              <div
                                key={batch.id}
                                onClick={() => {
                                  setDetailBatch(batch);
                                  setActiveTab('overview');
                                }}
                                className="bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs hover:border-amber-400 cursor-pointer transition-all space-y-2 group"
                              >
                                <div className="flex items-center justify-between text-[10px]">
                                  <span className="font-mono font-bold text-stone-700 bg-stone-100 px-1.5 py-0.5 rounded">
                                    {batch.batchCode}
                                  </span>
                                  <span className="text-amber-700 font-semibold">{batch.fermentationLog.method}</span>
                                </div>

                                <div>
                                  <h5 className="font-bold text-xs text-stone-900 group-hover:text-amber-800">{batch.variety}</h5>
                                  <p className="text-[10px] text-stone-500">{batch.sourceFarmerName} • {batch.intakeLog.cherryWeightKg}kg</p>
                                </div>

                                <div className="flex items-center justify-between text-[10px] pt-1 border-t border-stone-100">
                                  <span className="text-stone-500">Rendemen:</span>
                                  <span className="font-black text-amber-700">{massBalance.actualYieldPercent}%</span>
                                </div>
                              </div>
                            );
                          })
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* VIEW 3: TABLE VIEW */}
          {viewMode === 'table' && (
            <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[11px]">
                    <tr>
                      <th className="py-3.5 px-4">Batch ID</th>
                      <th className="py-3.5 px-4">Petani &amp; Asal</th>
                      <th className="py-3.5 px-4">Metode Olah</th>
                      <th className="py-3.5 px-4">Tahap Aktif</th>
                      <th className="py-3.5 px-4">Ceri (kg)</th>
                      <th className="py-3.5 px-4">Rendemen %</th>
                      <th className="py-3.5 px-4">Kadar Air</th>
                      <th className="py-3.5 px-4">Status Gate</th>
                      <th className="py-3.5 px-4 text-right">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-stone-100">
                    {filteredBatches.map((batch) => {
                      const massBalance = calculateBatchMassBalance(batch);
                      const currentStageInfo = PROCESSOR_7_STAGES.find((s) => s.id === batch.currentStage) || PROCESSOR_7_STAGES[0];
                      const isDryingPassed = batch.dryingLog.finalMoisturePercent <= 12.5;

                      return (
                        <tr
                          key={batch.id}
                          onClick={() => {
                            setDetailBatch(batch);
                            setActiveTab('overview');
                          }}
                          className="hover:bg-amber-50/50 cursor-pointer transition-colors"
                        >
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-900">{batch.batchCode}</td>
                          <td className="py-3.5 px-4">
                            <strong className="text-stone-900 block">{batch.sourceFarmerName}</strong>
                            <span className="text-[10px] text-stone-500">{batch.variety}</span>
                          </td>
                          <td className="py-3.5 px-4 font-semibold text-stone-800">{batch.fermentationLog.method}</td>
                          <td className="py-3.5 px-4">
                            <span className="px-2.5 py-1 rounded-full bg-amber-100 text-amber-900 text-[10px] font-bold">
                              Step {currentStageInfo.stepNumber}: {currentStageInfo.shortLabel}
                            </span>
                          </td>
                          <td className="py-3.5 px-4 font-mono font-bold text-stone-800">{batch.intakeLog.cherryWeightKg}</td>
                          <td className="py-3.5 px-4 font-black text-amber-700">{massBalance.actualYieldPercent}%</td>
                          <td className="py-3.5 px-4 font-mono">{batch.dryingLog.finalMoisturePercent}%</td>
                          <td className="py-3.5 px-4">
                            {isDryingPassed ? (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-emerald-700">
                                <CheckCircle2 className="w-3.5 h-3.5" /> Lolos
                              </span>
                            ) : (
                              <span className="flex items-center gap-1 text-[10px] font-bold text-amber-600">
                                <AlertTriangle className="w-3.5 h-3.5" /> Jemur ({batch.dryingLog.finalMoisturePercent}%)
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                setDetailBatch(batch);
                                setActiveTab('overview');
                              }}
                              className="px-3 py-1 bg-stone-900 hover:bg-stone-800 text-amber-400 text-xs font-bold rounded-lg transition-colors"
                            >
                              Detail
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </>
      ) : (
        /* ========================================================================= */
        /* ENTERPRISE DOCUMENT DETAIL SHEET (7 STAGES, MASS BALANCE, TELEMETRY, QC) */
        /* ========================================================================= */
        <div>
          <RecordBreadcrumb
            listLabel="Daftar Batch Pengolahan"
            recordLabel={detailBatch.batchCode}
            onBack={() => setDetailBatch(null)}
          />

          <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-sm">
            {/* Header & Status Pipeline */}
            <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                  <Flame className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-black text-stone-900 font-mono tracking-tight">
                      {detailBatch.batchCode}
                    </h3>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-600 text-white">
                      {detailBatch.fermentationLog.method}
                    </span>
                  </div>
                  <p className="text-xs text-stone-500 mt-0.5">
                    Petani: <strong className="text-stone-800">{detailBatch.sourceFarmerName}</strong> • Asal:{' '}
                    {detailBatch.sourceOrigin} ({detailBatch.altitude})
                  </p>
                </div>
              </div>

              {/* Status Chevron Pipeline */}
              <div className="w-full lg:w-auto overflow-x-auto pb-1">
                <StatusPipeline
                  stages={PIPELINE_STAGES}
                  currentStageId={detailBatch.currentStage}
                />
              </div>
            </div>

            {/* Smart Stat Buttons Header */}
            {(() => {
              const mb = calculateBatchMassBalance(detailBatch);
              const isMoistureSafe = detailBatch.dryingLog.finalMoisturePercent <= 12.5;

              return (
                <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-2.5 items-center justify-between">
                  <div className="flex flex-wrap gap-2.5">
                    <StatButton
                      icon={<Coffee className="w-4 h-4" />}
                      value={`${detailBatch.intakeLog.cherryWeightKg} kg`}
                      label="Ceri Segar (Intake)"
                      color="stone"
                    />
                    <StatButton
                      icon={<TrendingUp className="w-4 h-4" />}
                      value={`${mb.actualYieldPercent}%`}
                      label="Rendemen Yield"
                      color="amber"
                    />
                    <StatButton
                      icon={<Droplets className="w-4 h-4" />}
                      value={`${detailBatch.dryingLog.finalMoisturePercent}%`}
                      label={isMoistureSafe ? 'Kadar Air (Lolos)' : 'Kadar Air (Gate >12.5%)'}
                      color={isMoistureSafe ? 'blue' : 'amber'}
                    />
                    <StatButton
                      icon={<Award className="w-4 h-4" />}
                      value={detailBatch.qcAssessment.calculatedGrade}
                      label={`SCA ${detailBatch.qcAssessment.scaCuppingScore}`}
                      color="purple"
                    />
                    <StatButton
                      icon={<Recycle className="w-4 h-4" />}
                      value={`${detailBatch.wasteManagement.weightKgOrLiters} kg`}
                      label="Limbah Sirkular"
                      color="emerald"
                    />
                  </div>

                  {/* Stage Action Controls */}
                  <div className="flex items-center gap-2">
                    {detailBatch.currentStage === 'drying' && (
                      <button
                        onClick={() => setIsDryingModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-amber-50 border border-amber-300 hover:bg-amber-100 text-amber-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <PlusCircle className="w-3.5 h-3.5 text-amber-700" />
                        <span>Input Log Harian Penjemuran</span>
                      </button>
                    )}

                    {detailBatch.currentStage === 'grading_qc' && (
                      <button
                        onClick={() => setIsQcModalOpen(true)}
                        className="px-3.5 py-2 rounded-xl bg-purple-50 border border-purple-300 hover:bg-purple-100 text-purple-900 font-bold text-xs flex items-center gap-1.5 transition-colors"
                      >
                        <Award className="w-3.5 h-3.5 text-purple-700" />
                        <span>Uji Mutu Sensori &amp; Defect</span>
                      </button>
                    )}

                    {detailBatch.currentStage === 'packing_closure' && (
                      <button
                        onClick={() => setIsFinalizeModalOpen(true)}
                        className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Finalisasi &amp; Rilis Marketplace</span>
                      </button>
                    )}

                    {detailBatch.currentStage !== 'packing_closure' && (
                      <button
                        onClick={() => handleAdvanceStage(detailBatch)}
                        className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-colors shadow-2xs"
                      >
                        <span>Lanjut ke Tahap Berikutnya</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })()}

            {/* Document Tabs */}
            <div className="px-6 pt-3 border-b border-stone-200 bg-stone-50/50 flex flex-wrap gap-2">
              {[
                { id: 'overview', label: '1. Silsilah Ceri & Fermentasi', icon: Coffee },
                { id: 'telemetry', label: '2. Log Harian Penjemuran', icon: Droplets },
                { id: 'milling', label: '3. Resting & Hulling Mill', icon: Warehouse },
                { id: 'grading', label: '4. Grading & QC SCA', icon: Award },
                { id: 'mass_balance', label: '5. Mass Balance & Rendemen', icon: Scale },
                { id: 'waste', label: '6. Alokasi Limbah Sirkular', icon: Recycle },
                { id: 'eudr', label: '7. QR Code & Traceability', icon: QrCode },
              ].map((tab) => {
                const TabIcon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id as any)}
                    className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all ${
                      isActive
                        ? 'border-amber-600 text-amber-900 bg-white shadow-2xs'
                        : 'border-transparent text-stone-500 hover:text-stone-800 hover:bg-stone-100/60'
                    }`}
                  >
                    <TabIcon className={`w-3.5 h-3.5 ${isActive ? 'text-amber-600' : 'text-stone-400'}`} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Document Body */}
            <div className="p-6 text-xs space-y-6">
              {/* TAB 1: OVERVIEW & INTAKE & FERMENTATION */}
              {activeTab === 'overview' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stage 1 Intake */}
                  <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Coffee className="w-4 h-4 text-amber-600" /> Stage 1: Penerimaan &amp; Sortasi Ceri Segar
                    </h4>
                    <div className="space-y-2 text-stone-700">
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Lot Sumber Petani:</span>
                        <span className="font-mono font-bold text-stone-900">{detailBatch.sourceFarmerLotId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Nama Petani Mitra:</span>
                        <span className="font-bold text-stone-900">{detailBatch.sourceFarmerName}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Total Berat Ceri:</span>
                        <span className="font-mono font-bold text-stone-900">{detailBatch.intakeLog.cherryWeightKg} kg</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Kadar Gula Buah:</span>
                        <span className="font-bold text-emerald-700">{detailBatch.intakeLog.brix}° Brix (Refraktometer)</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Uji Apung (Sinkers vs Floaters):</span>
                        <span className="font-medium text-stone-800">
                          {detailBatch.intakeLog.sinkersWeightKg}kg Dense / {detailBatch.intakeLog.floatersWeightKg}kg Float
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-500">Standar Petik:</span>
                        <span className="font-semibold text-stone-900">{detailBatch.intakeLog.visualQualityGrade}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 2 Fermentation */}
                  <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Flame className="w-4 h-4 text-amber-600" /> Stage 2: Pengolahan &amp; Fermentasi
                    </h4>
                    <div className="space-y-2 text-stone-700">
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Metode Pengolahan:</span>
                        <span className="font-bold text-amber-800">{detailBatch.fermentationLog.method}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Tangki Fermentasi:</span>
                        <span className="font-mono font-bold text-stone-900">{detailBatch.fermentationLog.tankId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Durasi Fermentasi:</span>
                        <span className="font-mono font-bold text-stone-900">{detailBatch.fermentationLog.durationHours} Jam</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Kurva pH Asidifikasi:</span>
                        <span className="font-bold text-stone-900">
                          pH {detailBatch.fermentationLog.startPh} → pH {detailBatch.fermentationLog.endPh} (Optimal)
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Suhu Slurry / Ambient:</span>
                        <span className="font-medium text-stone-800">
                          {detailBatch.fermentationLog.slurryTempCelsius}°C / {detailBatch.fermentationLog.ambientTempCelsius}°C
                        </span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-500">Inokulan Ragi / Yeast:</span>
                        <span className="font-semibold text-stone-900">{detailBatch.fermentationLog.inoculumYeast}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 2: DAILY DRYING LOGS */}
              {activeTab === 'telemetry' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        Stage 3: Log Pengeringan Harian ({detailBatch.dryingLog.dryingMethod})
                      </h4>
                      <p className="text-stone-500 text-[11px]">
                        Lokasi Bed: <strong>{detailBatch.dryingLog.bedId}</strong> • Ambang Quality Gate Maksimal 12.5%
                      </p>
                    </div>

                    <button
                      onClick={() => setIsDryingModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <PlusCircle className="w-3.5 h-3.5" />
                      <span>Tambah Log Hari Ini</span>
                    </button>
                  </div>

                  <div className="border border-stone-200 rounded-xl overflow-hidden">
                    <table className="w-full text-left text-xs">
                      <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase text-[10px]">
                        <tr>
                          <th className="py-2.5 px-4">Hari Ke</th>
                          <th className="py-2.5 px-4">Tanggal</th>
                          <th className="py-2.5 px-4">Kadar Air (%)</th>
                          <th className="py-2.5 px-4">Suhu Dome (°C)</th>
                          <th className="py-2.5 px-4">Kelembaban RH%</th>
                          <th className="py-2.5 px-4">Frekuensi Balik</th>
                          <th className="py-2.5 px-4">Catatan</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-stone-100">
                        {detailBatch.dryingLog.dailyLogs.map((log) => (
                          <tr key={log.dayNumber} className="hover:bg-stone-50/80">
                            <td className="py-2.5 px-4 font-bold text-stone-900">Hari #{log.dayNumber}</td>
                            <td className="py-2.5 px-4 text-stone-600">{log.date}</td>
                            <td className="py-2.5 px-4 font-black font-mono text-amber-800">
                              {log.moisturePercent}%
                            </td>
                            <td className="py-2.5 px-4 font-mono">{log.ambientTempCelsius}°C</td>
                            <td className="py-2.5 px-4 font-mono">{log.rhPercent}%</td>
                            <td className="py-2.5 px-4 text-stone-700">{log.turningFrequency}</td>
                            <td className="py-2.5 px-4 text-stone-500 italic">{log.notes || '-'}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 3: RESTING & MILLING */}
              {activeTab === 'milling' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Stage 4 Conditioning */}
                  <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Warehouse className="w-4 h-4 text-amber-600" /> Stage 4: Pemeraman / Resting Gabah Kering
                    </h4>
                    <div className="space-y-2 text-stone-700">
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Silo / Bin ID:</span>
                        <span className="font-mono font-bold text-stone-900">{detailBatch.conditioningLog.siloBinId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Wadah Penyimpanan:</span>
                        <span className="font-semibold text-stone-800">{detailBatch.conditioningLog.packagingType}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Masa Pemeraman (Hari):</span>
                        <span className="font-mono font-bold text-amber-800">
                          {detailBatch.conditioningLog.completedDays} / {detailBatch.conditioningLog.targetRestingDays} Hari
                        </span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Kadar Air Terstabilisasi:</span>
                        <span className="font-bold text-stone-900">{detailBatch.conditioningLog.moistureStabilizedPercent}%</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-500">Aktivitas Air (aW):</span>
                        <span className="font-mono font-bold text-emerald-700">{detailBatch.conditioningLog.waterActivityAw} aw</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage 5 Dry Milling */}
                  <div className="bg-stone-50/80 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Sliders className="w-4 h-4 text-amber-600" /> Stage 5: Dry Milling &amp; Hulling
                    </h4>
                    <div className="space-y-2 text-stone-700">
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Mesin Huller:</span>
                        <span className="font-bold text-stone-900">{detailBatch.millingLog.machineId}</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Input Gabah / Dried Pods:</span>
                        <span className="font-mono font-bold text-stone-900">{detailBatch.millingLog.inputParchmentWeightKg} kg</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Output Green Bean:</span>
                        <span className="font-mono font-bold text-emerald-700">{detailBatch.millingLog.outputGreenBeanWeightKg} kg</span>
                      </div>
                      <div className="flex justify-between py-1 border-b border-stone-200/60">
                        <span className="text-stone-500">Limbah Kulit Tanduk (Husk):</span>
                        <span className="font-mono font-bold text-amber-800">{detailBatch.millingLog.outputHuskWeightKg} kg</span>
                      </div>
                      <div className="flex justify-between py-1">
                        <span className="text-stone-500">Efisiensi Pengupasan:</span>
                        <span className="font-black text-stone-900">{detailBatch.millingLog.millingEfficiencyPercent}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 4: GRADING & QC SCA */}
              {activeTab === 'grading' && (
                <div className="space-y-5">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-stone-900 text-sm">
                        Stage 6: Lembar Evaluasi Mutu Fisik &amp; Sensori SCA (Sample 350g)
                      </h4>
                      <p className="text-stone-500 text-[11px]">
                        Grade Otomatis Terkalkulasi: <strong className="text-purple-800">{detailBatch.qcAssessment.calculatedGrade}</strong>
                      </p>
                    </div>

                    <button
                      onClick={() => setIsQcModalOpen(true)}
                      className="px-3.5 py-1.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-2xs"
                    >
                      <Award className="w-3.5 h-3.5" />
                      <span>Ubah Hasil Uji QC</span>
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Defect Cacat Fisik / 350g</span>
                      <div className="text-xl font-black text-stone-900">
                        {detailBatch.qcAssessment.defects.totalScoreValue} Defect
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Primer: {detailBatch.qcAssessment.defects.primaryDefects} • Sekunder:{' '}
                        {detailBatch.qcAssessment.defects.secondaryDefects}
                      </p>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Distribusi Ukuran Ayakan (Screen)</span>
                      <div className="text-xl font-black text-stone-900">
                        Screen 18+: {detailBatch.qcAssessment.screenDistribution.screen18PlusKg} kg
                      </div>
                      <p className="text-[11px] text-stone-600">
                        Screen 16-17: {detailBatch.qcAssessment.screenDistribution.screen16_17Kg}kg • Screen 14-15:{' '}
                        {detailBatch.qcAssessment.screenDistribution.screen14_15Kg}kg
                      </p>
                    </div>

                    <div className="bg-stone-50 p-4 rounded-xl border border-stone-200 space-y-2">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">SCA Cupping Score</span>
                      <div className="text-xl font-black text-purple-700">
                        {detailBatch.qcAssessment.scaCuppingScore} Points
                      </div>
                      <div className="flex flex-wrap gap-1 pt-1">
                        {detailBatch.qcAssessment.cuppingNotes.map((note, i) => (
                          <span key={i} className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 text-[10px] font-bold">
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 5: MASS BALANCE & RENDEMEN INTEGRITY */}
              {activeTab === 'mass_balance' && (() => {
                const mb = calculateBatchMassBalance(detailBatch);
                return (
                  <div className="space-y-6">
                    <div className="bg-amber-50/60 p-5 rounded-2xl border border-amber-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Scale className="w-4 h-4 text-amber-700" />
                          Integritas Neraca Massa (Mass Balance) &amp; Rendemen
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">{mb.notes}</p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 block uppercase font-bold">Rendemen Aktual</span>
                        <span className="text-2xl font-black text-amber-700">{mb.actualYieldPercent}%</span>
                      </div>
                    </div>

                    {/* Visual Bar Breakdown */}
                    <div className="space-y-2">
                      <span className="text-xs font-bold text-stone-700">Komposisi Fraksi Massa Total ({mb.inputCherryKg} kg):</span>
                      <div className="w-full h-8 bg-stone-200 rounded-xl overflow-hidden flex shadow-inner text-[11px] font-black text-white text-center leading-8">
                        <div style={{ width: `${mb.breakdownShares.greenBeanPercent}%` }} className="bg-emerald-600" title="Green Bean">
                          {mb.breakdownShares.greenBeanPercent}% GB
                        </div>
                        <div style={{ width: `${mb.breakdownShares.pulpPercent}%` }} className="bg-rose-600" title="Pulp / Kulit">
                          {mb.breakdownShares.pulpPercent}% Pulp
                        </div>
                        <div style={{ width: `${mb.breakdownShares.huskPercent}%` }} className="bg-amber-600" title="Sekam / Husk">
                          {mb.breakdownShares.huskPercent}% Husk
                        </div>
                        <div style={{ width: `${mb.breakdownShares.evaporationPercent}%` }} className="bg-sky-500" title="Evaporasi Air">
                          {mb.breakdownShares.evaporationPercent}% Evaporasi
                        </div>
                      </div>
                    </div>

                    {/* Material Details Table */}
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-emerald-950">
                        <span className="text-[10px] font-bold uppercase block text-emerald-700">Green Bean Output</span>
                        <strong className="text-lg font-black">{mb.greenBeanOutputKg} kg</strong>
                        <span className="block text-[10px] text-emerald-600 mt-0.5">{mb.breakdownShares.greenBeanPercent}% dari ceri</span>
                      </div>
                      <div className="p-4 bg-rose-50 rounded-xl border border-rose-200 text-rose-950">
                        <span className="text-[10px] font-bold uppercase block text-rose-700">Pulp / Kulit Ceri</span>
                        <strong className="text-lg font-black">{mb.pulpCascaraKg} kg</strong>
                        <span className="block text-[10px] text-rose-600 mt-0.5">{mb.breakdownShares.pulpPercent}% dari ceri</span>
                      </div>
                      <div className="p-4 bg-amber-50 rounded-xl border border-amber-200 text-amber-950">
                        <span className="text-[10px] font-bold uppercase block text-amber-700">Kulit Tanduk (Husk)</span>
                        <strong className="text-lg font-black">{mb.huskSekamKg} kg</strong>
                        <span className="block text-[10px] text-amber-600 mt-0.5">{mb.breakdownShares.huskPercent}% dari ceri</span>
                      </div>
                      <div className="p-4 bg-sky-50 rounded-xl border border-sky-200 text-sky-950">
                        <span className="text-[10px] font-bold uppercase block text-sky-700">Susut Air (Evaporasi)</span>
                        <strong className="text-lg font-black">{mb.waterEvaporationKg} kg</strong>
                        <span className="block text-[10px] text-sky-600 mt-0.5">{mb.breakdownShares.evaporationPercent}% dari ceri</span>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 6: CIRCULAR WASTE ALLOCATION */}
              {activeTab === 'waste' && (() => {
                const eco = calculateProcessorEcoRating(
                  detailBatch.wasteManagement,
                  detailBatch.intakeLog.cherryWeightKg,
                  detailBatch.packingLog.finalGreenBeanWeightKg || 100
                );

                return (
                  <div className="space-y-5">
                    <div className="bg-emerald-50/70 p-5 rounded-2xl border border-emerald-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-200/80 px-2.5 py-0.5 rounded-full uppercase">
                          Zero-Waste Circular Standard
                        </span>
                        <h4 className="font-bold text-base text-stone-900 mt-1">
                          Alokasi &amp; Pemanfaatan Limbah Olahan Kopi
                        </h4>
                        <p className="text-xs text-stone-600 mt-0.5">
                          Penerima: <strong>{detailBatch.wasteManagement.recipientOrLocation}</strong>
                        </p>
                      </div>

                      <div className="text-right">
                        <span className="text-[10px] text-stone-500 uppercase font-bold block">Eco Score</span>
                        <span className="text-2xl font-black text-emerald-700">{eco.ecoScore} / 100</span>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-400 uppercase">Jenis &amp; Volume Limbah</span>
                        <strong className="text-stone-900 block text-sm">{detailBatch.wasteManagement.wasteType}</strong>
                        <p className="text-stone-600 text-xs font-mono font-bold">
                          {detailBatch.wasteManagement.weightKgOrLiters} kg terkelola secara sirkular ({eco.diversionRatePercent}% diversion)
                        </p>
                      </div>

                      <div className="p-4 bg-white rounded-xl border border-stone-200 space-y-1.5">
                        <span className="text-[10px] font-bold text-stone-400 uppercase">Pemanfaatan Nilai Tambah</span>
                        <strong className="text-stone-900 block text-sm">{detailBatch.wasteManagement.utilization}</strong>
                        <p className="text-stone-600 text-xs">
                          Metode: {detailBatch.wasteManagement.processingMethod}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })()}

              {/* TAB 7: EUDR & QR CODE */}
              {activeTab === 'eudr' && (
                <div className="space-y-6">
                  <div className="bg-stone-900 text-white p-6 rounded-2xl flex flex-col md:flex-row items-center justify-between gap-6 shadow-sm">
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-5 h-5 text-emerald-400" />
                        <h4 className="font-bold text-base">EUDR &amp; Farm-to-Cup Digital Passport</h4>
                      </div>
                      <p className="text-stone-300 text-xs max-w-lg">
                        Lot ini terikat dengan koordinat poligon kebun {detailBatch.sourceFarmerName}, bebas deforestasi, dan lolos uji mutu 7-tahap.
                      </p>
                    </div>

                    <button
                      onClick={() => {
                        setSelectedBatchForBarcode(detailBatch);
                        setBarcodeModalOpen(true);
                      }}
                      className="px-5 py-3 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs flex items-center gap-2 shrink-0 transition-colors shadow-xs"
                    >
                      <Printer className="w-4 h-4" />
                      <span>Cetak Stiker QR Barcode Karung</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* CREATE BATCH MODAL */}
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
              <div className="p-3 rounded-2xl bg-amber-100 text-amber-800">
                <Flame className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Mulai Batch Pengolahan Baru (7-Stage)</h3>
                <p className="text-xs text-stone-500">Inisiasi siklus olah pasca panen dari lot ceri petani.</p>
              </div>
            </div>

            <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block font-bold text-stone-700 uppercase tracking-wider">
                    Sumber Bahan Baku Ceri
                  </label>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => setFormSourceType('stock')}
                      className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] transition-colors ${
                        formSourceType === 'stock'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Stok Gudang ({availableCherryStock.length})
                    </button>
                    <button
                      type="button"
                      onClick={() => setFormSourceType('farmer')}
                      className={`px-2.5 py-0.5 rounded-lg font-bold text-[10px] transition-colors ${
                        formSourceType === 'farmer'
                          ? 'bg-amber-600 text-white'
                          : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                      }`}
                    >
                      Beli Langsung Petani
                    </button>
                  </div>
                </div>

                {formSourceType === 'stock' ? (
                  availableCherryStock.length > 0 ? (
                    <select
                      value={formCherryStockId || availableCherryStock[0]?.id}
                      onChange={(e) => {
                        setFormCherryStockId(e.target.value);
                        const selected = availableCherryStock.find((s) => s.id === e.target.value);
                        if (selected) {
                          setFormCherryKg(Math.min(selected.availableWeightKg, 500));
                        }
                      }}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
                    >
                      {availableCherryStock.map((stock) => (
                        <option key={stock.id} value={stock.id}>
                          {stock.id} - {stock.variety} ({stock.farmerName}, Stok {stock.availableWeightKg}kg, {stock.brix}° Brix)
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-amber-900 text-xs">
                      Stok ceri di gudang kosong. Silakan beralih ke tab <em>"Beli Langsung Petani"</em> atau lakukan pembelian melalui menu Sourcing Ceri.
                    </div>
                  )
                ) : (
                  <select
                    value={formFarmerLotId || availableFarmerLots[0]?.id}
                    onChange={(e) => {
                      setFormFarmerLotId(e.target.value);
                      const selected = availableFarmerLots.find((l) => l.id === e.target.value);
                      if (selected) {
                        setFormCherryKg(Math.min(selected.availableWeightKg, 500));
                      }
                    }}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800 focus:outline-none focus:border-amber-500"
                  >
                    {availableFarmerLots.map((lot) => (
                      <option key={lot.id} value={lot.id}>
                        {lot.id} - {lot.farmerName} ({lot.variety}, Tersedia {lot.availableWeightKg}kg, {lot.brix}° Bx)
                      </option>
                    ))}
                  </select>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Volume Ceri Masuk (kg)
                  </label>
                  <input
                    type="number"
                    value={formCherryKg}
                    onChange={(e) => setFormCherryKg(Number(e.target.value))}
                    min={50}
                    max={2000}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Metode Pengolahan
                  </label>
                  <select
                    value={formMethod}
                    onChange={(e) => setFormMethod(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800"
                  >
                    <option value="Anaerobic Natural">Anaerobic Natural</option>
                    <option value="Full Washed">Full Washed</option>
                    <option value="Natural / Dry">Natural / Dry</option>
                    <option value="Honey (Yellow/Red/Black)">Honey Process</option>
                    <option value="Wet Hulled (Giling Basah)">Wet Hulled (Giling Basah)</option>
                    <option value="Wine Process">Wine Process</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Metode Pengeringan (Stage 3)
                </label>
                <select
                  value={formDryingMethod}
                  onChange={(e) => setFormDryingMethod(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800"
                >
                  <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (African Bed)</option>
                  <option value="Greenhouse Solar Dome">Greenhouse Solar Dome</option>
                  <option value="Patio Penjemuran">Patio Penjemuran</option>
                  <option value="Mechanical Controlled Dryer">Mechanical Controlled Dryer</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Operator / Mill Master
                </label>
                <input
                  type="text"
                  value={formOperator}
                  onChange={(e) => setFormOperator(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white text-stone-800 font-semibold"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-600 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs shadow-xs"
                >
                  Inisiasi Batch Pengolahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DAILY DRYING MODAL */}
      {isDryingModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl relative my-8 animate-in fade-in">
            <button
              onClick={() => setIsDryingModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-3 rounded-2xl bg-blue-100 text-blue-800">
                <Droplets className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Input Log Harian Penjemuran</h3>
                <p className="text-xs text-stone-500">Ambang batas maksimal lolos Quality Gate: &le; 12.5%</p>
              </div>
            </div>

            <form onSubmit={handleAddDryingSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kadar Air Hasil Ukur (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formDryingDayMoisture}
                    onChange={(e) => setFormDryingDayMoisture(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Suhu Dome / Ambient (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={formDryingDayTemp}
                    onChange={(e) => setFormDryingDayTemp(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Kelembaban Udara (RH %)
                  </label>
                  <input
                    type="number"
                    value={formDryingDayRh}
                    onChange={(e) => setFormDryingDayRh(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Frekuensi Pembalikan
                  </label>
                  <input
                    type="text"
                    value={formDryingDayFreq}
                    onChange={(e) => setFormDryingDayFreq(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-medium text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Catatan Pengeringan
                </label>
                <input
                  type="text"
                  value={formDryingDayNotes}
                  onChange={(e) => setFormDryingDayNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 text-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsDryingModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-600 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs"
                >
                  Simpan Log Pengeringan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* QC GRADING MODAL */}
      {isQcModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 border border-stone-200 shadow-2xl relative my-8 animate-in fade-in">
            <button
              onClick={() => setIsQcModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-3 rounded-2xl bg-purple-100 text-purple-800">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Uji Mutu Fisik SCA &amp; Cupping Lab (Stage 6)</h3>
                <p className="text-xs text-stone-500">Standar sampel 350g untuk auto-kalkulasi Grade &amp; Defect.</p>
              </div>
            </div>

            <form onSubmit={handleQcSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Cacat Primer (Black/Sour/Mold)
                  </label>
                  <input
                    type="number"
                    value={formPrimaryDefects}
                    onChange={(e) => setFormPrimaryDefects(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Cacat Sekunder (Broken/Insect/Husk)
                  </label>
                  <input
                    type="number"
                    value={formSecondaryDefects}
                    onChange={(e) => setFormSecondaryDefects(Number(e.target.value))}
                    min={0}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Screen 18+ (kg)
                  </label>
                  <input
                    type="number"
                    value={formScreen18Kg}
                    onChange={(e) => setFormScreen18Kg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Screen 16-17 (kg)
                  </label>
                  <input
                    type="number"
                    value={formScreen16Kg}
                    onChange={(e) => setFormScreen16Kg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Screen 14-15 (kg)
                  </label>
                  <input
                    type="number"
                    value={formScreen14Kg}
                    onChange={(e) => setFormScreen14Kg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    SCA Cupping Score
                  </label>
                  <input
                    type="number"
                    step="0.25"
                    value={formScaScore}
                    onChange={(e) => setFormScaScore(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-purple-700"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Aktivitas Air (aW)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={formAwQC}
                    onChange={(e) => setFormAwQC(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Tasting &amp; Cupping Notes (Pisahkan Koma)
                </label>
                <input
                  type="text"
                  value={formCuppingNotes}
                  onChange={(e) => setFormCuppingNotes(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-semibold text-stone-800"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsQcModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-600 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-700 text-white font-bold text-xs shadow-xs"
                >
                  Simpan &amp; Tetapkan Grade
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* FINALIZE & PACKING MODAL */}
      {isFinalizeModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 border border-stone-200 shadow-2xl relative my-8 animate-in fade-in">
            <button
              onClick={() => setIsFinalizeModalOpen(false)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-400 hover:text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2.5 mb-5 pb-3 border-b border-stone-100">
              <div className="p-3 rounded-2xl bg-emerald-100 text-emerald-800">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-base font-bold text-stone-900">Finalisasi Batch &amp; Rilis ke Marketplace (Stage 7)</h3>
                <p className="text-xs text-stone-500">Tutup batch olahan dan terbitkan sebagai Green Bean siap jual.</p>
              </div>
            </div>

            <form onSubmit={handleFinalizeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Kemasan Hermetik / Karung
                </label>
                <select
                  value={formBaggingType}
                  onChange={(e) => setFormBaggingType(e.target.value as any)}
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800"
                >
                  <option value="GrainPro 60kg + Karung Goni">GrainPro 60kg + Karung Goni Luar</option>
                  <option value="Ecotact 30kg">Ecotact Hermetic 30kg</option>
                  <option value="Vacuum Bag 20kg">Vacuum Bag 20kg</option>
                  <option value="Jute Bag 60kg Standard">Jute Bag 60kg Standard</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Harga Jual per kg (Rp)
                  </label>
                  <input
                    type="number"
                    step={1000}
                    value={formPricePerKg}
                    onChange={(e) => setFormPricePerKg(Number(e.target.value))}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 font-mono font-bold text-stone-800"
                  />
                </div>
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Grade Akhir
                  </label>
                  <select
                    value={formFinalGrade}
                    onChange={(e) => setFormFinalGrade(e.target.value as any)}
                    className="w-full px-3.5 py-2.5 rounded-xl border border-stone-200 bg-white font-semibold text-stone-800"
                  >
                    <option value="Specialty Grade 1">Specialty Grade 1</option>
                    <option value="Grade 2">Grade 2 (Premium)</option>
                    <option value="Commercial Fine">Commercial Fine</option>
                  </select>
                </div>
              </div>

              <div className="pt-3 border-t border-stone-100 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsFinalizeModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-200 hover:bg-stone-50 font-bold text-stone-600 text-xs"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-xs"
                >
                  Finalisasi &amp; Terbitkan Lot
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Barcode Modal */}
      {selectedBatchForBarcode && (
        <ProcessorBarcodeModal
          isOpen={barcodeModalOpen}
          onClose={() => {
            setBarcodeModalOpen(false);
            setSelectedBatchForBarcode(null);
          }}
          lot={selectedBatchForBarcode}
        />
      )}
    </div>
  );
};
