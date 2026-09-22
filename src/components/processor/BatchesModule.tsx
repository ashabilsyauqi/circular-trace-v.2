import React, { useState, useEffect } from 'react';
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
  Save,
  Plus,
  Trash2,
} from 'lucide-react';
import { useCoffee } from '../../context/CoffeeContext';
import { ProcessedGreenBeanLot } from '../../types/coffee';
import { ProcessingBatch, ProcessingStageId, DryingDayLog, ProcessingMethod, DryingMethod } from '../../types/processorErp';
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
    updateBatchFull,
    finalizeBatchAndPublish,
    activeProcessingBatchId,
    setActiveProcessingBatchId,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [stageFilter, setStageFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'cards' | 'kanban' | 'table'>('cards');
  const [detailBatch, setDetailBatch] = useState<ProcessingBatch | null>(null);
  const [activeTab, setActiveTab] = useState<'stage1' | 'stage2' | 'stage3' | 'stage4' | 'stage5' | 'stage6' | 'stage7'>('stage1');

  // Local editable worksheet state
  const [editedBatch, setEditedBatch] = useState<ProcessingBatch | null>(null);
  const [newCuppingNote, setNewCuppingNote] = useState('');
  const [alertMessage, setAlertMessage] = useState<{ type: 'success' | 'error' | 'warning'; text: string } | null>(null);

  // New Daily Log Form inline in Stage 3
  const [newLogMoisture, setNewLogMoisture] = useState<number>(11.5);
  const [newLogTemp, setNewLogTemp] = useState<number>(29.5);
  const [newLogRh, setNewLogRh] = useState<number>(55);
  const [newLogFreq, setNewLogFreq] = useState('Tiap 2 Jam');
  const [newLogNotes, setNewLogNotes] = useState('Pembalikan rata di solar dome.');

  // Create Batch Form state (for list view "+ Inisiasi Batch Baru")
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [createSourceType, setCreateSourceType] = useState<'stock' | 'farmer'>('stock');
  const [createCherryStockId, setCreateCherryStockId] = useState('');
  const [createFarmerLotId, setCreateFarmerLotId] = useState('');
  const [createCherryKg, setCreateCherryKg] = useState<number>(500);
  const [createMethod, setCreateMethod] = useState<ProcessingMethod>('Natural / Dry');
  const [createDryingMethod, setCreateDryingMethod] = useState<DryingMethod>('Solar Dryer Raised Bed');
  const [createOperator, setCreateOperator] = useState('Budi Santoso (Mill Master)');
  const [createNotes, setCreateNotes] = useState('Batch olahan ceri petik merah segar.');

  // Barcode Modal
  const [barcodeModalOpen, setBarcodeModalOpen] = useState(false);
  const [selectedBatchForBarcode, setSelectedBatchForBarcode] = useState<any>(null);

  // Auto load active batch if signaled from Sourcing or Inventory
  useEffect(() => {
    if (activeProcessingBatchId) {
      const found = processingBatches.find((b) => b.id === activeProcessingBatchId);
      if (found) {
        setDetailBatch(found);
        setEditedBatch(JSON.parse(JSON.stringify(found)));
      }
    }
  }, [activeProcessingBatchId, processingBatches]);

  // Sync editedBatch when detailBatch is selected
  const handleSelectBatch = (batch: ProcessingBatch) => {
    setDetailBatch(batch);
    setEditedBatch(JSON.parse(JSON.stringify(batch)));
    setActiveProcessingBatchId(batch.id);

    // Auto navigate to current stage's tab
    if (batch.currentStage === 'intake_sorting') setActiveTab('stage1');
    else if (batch.currentStage === 'fermentation') setActiveTab('stage2');
    else if (batch.currentStage === 'drying') setActiveTab('stage3');
    else if (batch.currentStage === 'conditioning') setActiveTab('stage4');
    else if (batch.currentStage === 'milling') setActiveTab('stage5');
    else if (batch.currentStage === 'grading_qc') setActiveTab('stage6');
    else if (batch.currentStage === 'packing_closure') setActiveTab('stage7');
  };

  const handleBackToList = () => {
    setDetailBatch(null);
    setEditedBatch(null);
    setActiveProcessingBatchId(null);
  };

  // Save changes to current worksheet
  const handleSaveWorksheet = () => {
    if (!editedBatch) return;

    // Recalculate auto grade for stage 6
    const gradeResult = autoCalculateCoffeeGrade(
      editedBatch.qcAssessment.defects.primaryDefects,
      editedBatch.qcAssessment.defects.secondaryDefects,
      editedBatch.dryingLog.finalMoisturePercent,
      editedBatch.qcAssessment.scaCuppingScore
    );

    const batchToSave: ProcessingBatch = {
      ...editedBatch,
      qcAssessment: {
        ...editedBatch.qcAssessment,
        calculatedGrade: gradeResult.grade,
      },
    };

    updateBatchFull(batchToSave);
    setDetailBatch(batchToSave);
    setEditedBatch(batchToSave);
    setAlertMessage({ type: 'success', text: 'Data Lembar Kerja Batch berhasil disimpan!' });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Advance stage with Quality Gate check
  const handleAdvanceStage = () => {
    if (!editedBatch) return;

    const currentIdx = PROCESSOR_7_STAGES.findIndex((s) => s.id === editedBatch.currentStage);
    if (currentIdx === -1 || currentIdx >= PROCESSOR_7_STAGES.length - 1) {
      setAlertMessage({ type: 'warning', text: 'Batch sudah mencapai tahap akhir (Packing & Rilis Pasar).' });
      return;
    }

    const nextStage = PROCESSOR_7_STAGES[currentIdx + 1].id;
    const validation = validateStageQualityGate(editedBatch, nextStage);

    if (!validation.canAdvance) {
      setAlertMessage({ type: 'error', text: `Quality Gate Menolak: ${validation.blockingErrors.join(' ')}` });
      return;
    }

    const result = advanceBatchStage(editedBatch.id, nextStage);
    if (result.success) {
      const updated: ProcessingBatch = {
        ...editedBatch,
        currentStage: nextStage,
      };
      updateBatchFull(updated);
      setDetailBatch(updated);
      setEditedBatch(updated);

      // Advance active tab
      const nextTabMap: Record<ProcessingStageId, typeof activeTab> = {
        intake_sorting: 'stage1',
        fermentation: 'stage2',
        drying: 'stage3',
        conditioning: 'stage4',
        milling: 'stage5',
        grading_qc: 'stage6',
        packing_closure: 'stage7',
      };
      setActiveTab(nextTabMap[nextStage]);

      setAlertMessage({ type: 'success', text: `Berhasil! Batch melaju ke tahap "${nextStage}". Silakan isi lembar kerja tahap ini.` });
      setTimeout(() => setAlertMessage(null), 5000);
    } else {
      setAlertMessage({ type: 'error', text: result.message });
    }
  };

  // Add daily drying log row
  const handleAddDailyLog = () => {
    if (!editedBatch) return;

    const currentDaily = editedBatch.dryingLog.dailyLogs || [];
    const nextDayNum = currentDaily.length + 1;
    const newEntry: DryingDayLog = {
      dayNumber: nextDayNum,
      date: new Date().toISOString().split('T')[0],
      moisturePercent: Number(newLogMoisture),
      ambientTempCelsius: Number(newLogTemp),
      rhPercent: Number(newLogRh),
      turningFrequency: newLogFreq,
      notes: newLogNotes,
    };

    const updatedDaily = [...currentDaily, newEntry];
    const updatedBatch: ProcessingBatch = {
      ...editedBatch,
      dryingLog: {
        ...editedBatch.dryingLog,
        dailyLogs: updatedDaily,
        finalMoisturePercent: Number(newLogMoisture),
        targetMoisturePassed: Number(newLogMoisture) <= 12.5,
      },
    };

    setEditedBatch(updatedBatch);
    updateBatchFull(updatedBatch);
    setDetailBatch(updatedBatch);

    setAlertMessage({
      type: 'success',
      text: `Log Penjemuran Hari #${nextDayNum} berhasil dicatat! Kadar air terkini: ${newLogMoisture}%. ${
        newLogMoisture <= 12.5 ? '✓ Lolos Quality Gate (≤ 12.5%)' : '⚠ Belum memenuhi Quality Gate (≤ 12.5%)'
      }`,
    });
    setTimeout(() => setAlertMessage(null), 4000);
  };

  // Delete a daily drying log row
  const handleDeleteDailyLog = (index: number) => {
    if (!editedBatch) return;
    const updatedDaily = editedBatch.dryingLog.dailyLogs.filter((_, i) => i !== index);
    const lastMoisture = updatedDaily.length > 0 ? updatedDaily[updatedDaily.length - 1].moisturePercent : 52.0;

    const updatedBatch: ProcessingBatch = {
      ...editedBatch,
      dryingLog: {
        ...editedBatch.dryingLog,
        dailyLogs: updatedDaily,
        finalMoisturePercent: lastMoisture,
        targetMoisturePassed: lastMoisture <= 12.5,
      },
    };

    setEditedBatch(updatedBatch);
    updateBatchFull(updatedBatch);
    setDetailBatch(updatedBatch);
  };

  // Add cupping flavor note
  const handleAddCuppingNote = () => {
    if (!editedBatch || !newCuppingNote.trim()) return;
    const currentNotes = editedBatch.qcAssessment.cuppingNotes || [];
    if (!currentNotes.includes(newCuppingNote.trim())) {
      const updatedNotes = [...currentNotes, newCuppingNote.trim()];
      setEditedBatch({
        ...editedBatch,
        qcAssessment: {
          ...editedBatch.qcAssessment,
          cuppingNotes: updatedNotes,
        },
      });
      setNewCuppingNote('');
    }
  };

  const handleRemoveCuppingNote = (noteToRemove: string) => {
    if (!editedBatch) return;
    const updatedNotes = (editedBatch.qcAssessment.cuppingNotes || []).filter((n) => n !== noteToRemove);
    setEditedBatch({
      ...editedBatch,
      qcAssessment: {
        ...editedBatch.qcAssessment,
        cuppingNotes: updatedNotes,
      },
    });
  };

  // Finalize Batch and publish to green bean inventory + marketplace
  const handleFinalizeBatch = () => {
    if (!editedBatch) return;

    const gradeString = editedBatch.qcAssessment.calculatedGrade || 'Specialty Grade 1';
    const mappedGrade: ProcessedGreenBeanLot['grade'] =
      gradeString === 'Specialty Grade 1'
        ? 'Specialty Grade 1'
        : gradeString.includes('Grade 2')
        ? 'Grade 2'
        : 'Commercial Fine';

    const published = finalizeBatchAndPublish(editedBatch.id, {
      baggingType: editedBatch.packingLog.baggingType,
      pricePerKg: editedBatch.targetMarketplacePricePerKg || 125000,
      cuppingNotes: editedBatch.qcAssessment.cuppingNotes || ['Specialty Clean Cup'],
      grade: mappedGrade,
      notes: editedBatch.packingLog.notes || 'Batch pengolahan 7-stage selesai diverifikasi.',
    });

    if (published) {
      setAlertMessage({
        type: 'success',
        text: `Batch ${editedBatch.batchCode} sukses difinalisasi! Menghasilkan ${published.greenBeanWeightKg} kg Green Bean (${published.grade}) dan otomatis terbit di Gudang & Marketplace.`,
      });
      setTimeout(() => setAlertMessage(null), 6000);
      handleBackToList();
    }
  };

  // Create Batch Submit
  const handleCreateSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    let newBatch: ProcessingBatch | null = null;
    if (createSourceType === 'stock') {
      const targetStockId = createCherryStockId || processorCherryStock[0]?.id;
      if (!targetStockId) {
        setAlertMessage({ type: 'error', text: 'Stok ceri di gudang kosong. Silakan beli ceri dari Petani terlebih dahulu.' });
        return;
      }
      newBatch = createProcessingBatch({
        sourceCherryStockId: targetStockId,
        boughtCherryKg: Number(createCherryKg),
        method: createMethod,
        dryingMethod: createDryingMethod,
        operatorName: createOperator,
        notes: createNotes,
      });
    } else {
      const targetLotId = createFarmerLotId || farmerLots.find((l) => l.availableWeightKg > 0)?.id;
      if (!targetLotId) {
        setAlertMessage({ type: 'error', text: 'Pilih lot ceri petani yang masih tersedia stoknya.' });
        return;
      }
      newBatch = createProcessingBatch({
        sourceFarmerLotId: targetLotId,
        boughtCherryKg: Number(createCherryKg),
        method: createMethod,
        dryingMethod: createDryingMethod,
        operatorName: createOperator,
        notes: createNotes,
      });
    }

    if (newBatch) {
      setIsCreateOpen(false);
      handleSelectBatch(newBatch);
      setAlertMessage({
        type: 'success',
        text: `Batch ${newBatch.batchCode} (${createMethod}) berhasil dibuat! Lembar kerja 7-Stage siap diisi.`,
      });
    }
  };

  // Filtered Batches
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

  // KPIs
  const totalBatchesCount = processingBatches.length;
  const inProgressBatches = processingBatches.filter((b) => b.status === 'in_progress');
  const totalCherryProcessedKg = processingBatches.reduce((acc, b) => acc + (b.intakeLog?.cherryWeightKg || 0), 0);
  const totalGreenBeanProducedKg = processingBatches.reduce(
    (acc, b) => acc + (b.packingLog?.finalGreenBeanWeightKg || b.millingLog?.outputGreenBeanWeightKg || 0),
    0
  );
  const avgYieldPercent =
    totalCherryProcessedKg > 0 ? ((totalGreenBeanProducedKg / totalCherryProcessedKg) * 100).toFixed(1) : '16.5';

  return (
    <div className="space-y-6 animate-in fade-in duration-200">
      {/* Toast Alert Banner */}
      {alertMessage && (
        <div
          className={`p-4 rounded-2xl text-xs font-bold flex items-center justify-between border shadow-2xs ${
            alertMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : alertMessage.type === 'error'
              ? 'bg-rose-50 text-rose-950 border-rose-300'
              : 'bg-amber-50 text-amber-950 border-amber-300'
          }`}
        >
          <div className="flex items-center gap-2">
            {alertMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
            ) : alertMessage.type === 'error' ? (
              <AlertCircle className="w-4 h-4 text-rose-700 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-amber-700 shrink-0" />
            )}
            <span>{alertMessage.text}</span>
          </div>
          <button onClick={() => setAlertMessage(null)} className="text-stone-400 hover:text-stone-700 text-xs">
            Tutup
          </button>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 1: BATCHES LIST VIEW (TABLE / KANBAN / CARDS)                        */}
      {/* ========================================================================= */}
      {!detailBatch ? (
        <>
          {/* Top Metric Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <MetricCard
              title="Total Batches Olahan"
              value={`${totalBatchesCount} Batch`}
              subtitle={`${inProgressBatches.length} batch aktif berjalan`}
              icon={<Flame className="w-5 h-5 text-amber-600" />}
              color="amber"
              trend={{ value: `${inProgressBatches.length} Active MRP`, isPositive: true }}
            />
            <MetricCard
              title="Ceri Terolah di Stasiun"
              value={`${totalCherryProcessedKg.toLocaleString()} kg`}
              subtitle="Bahan baku ceri masuk intake"
              icon={<Coffee className="w-5 h-5 text-emerald-600" />}
              color="emerald"
              trend={{ value: 'Full Traced', isPositive: true }}
            />
            <MetricCard
              title="Green Bean Dihasilkan"
              value={`${totalGreenBeanProducedKg.toLocaleString()} kg`}
              subtitle="Siap jual ke gudang & roastery"
              icon={<Warehouse className="w-5 h-5 text-blue-600" />}
              color="blue"
              badge="Specialty"
            />
            <MetricCard
              title="Rata-rata Rendemen Yield"
              value={`${avgYieldPercent}%`}
              subtitle="Standar Kopi Arabika 15% - 17%"
              icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
              color="purple"
              trend={{ value: 'Mass Balance Valid', isPositive: true }}
            />
          </div>

          {/* Quick Create Batch Form Card (if toggled) */}
          {isCreateOpen && (
            <div className="bg-[#FAF7F2] p-6 rounded-3xl border border-amber-300 shadow-sm space-y-4 animate-in fade-in">
              <div className="flex items-center justify-between pb-3 border-b border-stone-200">
                <div className="flex items-center gap-2.5">
                  <div className="p-2.5 rounded-2xl bg-amber-600 text-white">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-stone-900">Inisiasi Lembar Kerja Batch Baru</h3>
                    <p className="text-xs text-stone-500">Pilih sumber ceri dan mulai lembar kerja 7-Stage</p>
                  </div>
                </div>
                <button onClick={() => setIsCreateOpen(false)} className="p-2 rounded-xl text-stone-400 hover:text-stone-700">
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateSubmit} className="space-y-4 text-xs">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Sumber Bahan Baku</label>
                    <select
                      value={createSourceType}
                      onChange={(e) => setCreateSourceType(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                    >
                      <option value="stock">Stok Ceri di Gudang ({processorCherryStock.length} Lot)</option>
                      <option value="farmer">Beli Langsung dari Petani ({farmerLots.filter((l) => l.availableWeightKg > 0).length} Lot)</option>
                    </select>
                  </div>

                  {createSourceType === 'stock' ? (
                    <div>
                      <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Pilih Lot Stok Gudang</label>
                      <select
                        value={createCherryStockId}
                        onChange={(e) => setCreateCherryStockId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                      >
                        {processorCherryStock.map((s) => (
                          <option key={s.id} value={s.id}>
                            {s.id} — {s.variety} ({s.availableWeightKg} kg tersedia • {s.farmerName})
                          </option>
                        ))}
                      </select>
                    </div>
                  ) : (
                    <div>
                      <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Pilih Panen Petani</label>
                      <select
                        value={createFarmerLotId}
                        onChange={(e) => setCreateFarmerLotId(e.target.value)}
                        className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                      >
                        {farmerLots
                          .filter((l) => l.availableWeightKg > 0)
                          .map((l) => (
                            <option key={l.id} value={l.id}>
                              {l.id} — {l.variety} ({l.availableWeightKg} kg • {l.farmerName})
                            </option>
                          ))}
                      </select>
                    </div>
                  )}

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Volume Ceri Diolah (kg)</label>
                    <input
                      type="number"
                      min="10"
                      value={createCherryKg}
                      onChange={(e) => setCreateCherryKg(Number(e.target.value))}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Metode Pengolahan</label>
                    <select
                      value={createMethod}
                      onChange={(e) => setCreateMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                    >
                      <option value="Natural / Dry">1. Natural (Dry) — Ceri Utuh Langsung Jemur</option>
                      <option value="Full Washed">2. Washed (Wet) — Depulper, Tangki Fermentasi & Cuci</option>
                      <option value="Honey (Yellow/Red/Black)">3. Honey (Pulped Natural) — Depulper Biji Berlendir</option>
                      <option value="Wet Hulled (Giling Basah)">4. Wet Hulled (Giling Basah) — Hulling Lembek ~30-40%</option>
                      <option value="Anaerobic Natural">Anaerobic Natural — Fermentasi Ragi Kedap Udara</option>
                      <option value="Wine Process">Wine Process — Extended Fermentation</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Metode Pengeringan</label>
                    <select
                      value={createDryingMethod}
                      onChange={(e) => setCreateDryingMethod(e.target.value as any)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                    >
                      <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (African Bed)</option>
                      <option value="Greenhouse Solar Dome">Greenhouse Solar Dome</option>
                      <option value="Patio Penjemuran">Patio Penjemuran</option>
                      <option value="Mechanical Controlled Dryer">Mechanical Controlled Dryer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">Operator Penanggung Jawab</label>
                    <input
                      type="text"
                      value={createOperator}
                      onChange={(e) => setCreateOperator(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                    />
                  </div>
                </div>

                <div className="pt-2 flex justify-end gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCreateOpen(false)}
                    className="px-4 py-2.5 rounded-xl border border-stone-300 font-bold text-stone-600 hover:bg-stone-100"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold shadow-xs flex items-center gap-2"
                  >
                    <Flame className="w-4 h-4" />
                    <span>Mulai Lembar Kerja Batch →</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* Control Panel: Filters & View Modes */}
          <ControlPanel
            breadcrumbs={[{ label: 'Processing Mill' }, { label: '7-Stage Work Orders' }]}
            primaryActionLabel="+ Inisiasi Batch Baru"
            onPrimaryAction={() => setIsCreateOpen(true)}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            activeFilter={stageFilter}
            onFilterChange={setStageFilter}
            filterOptions={[
              { id: 'all', label: 'Semua Tahap' },
              { id: 'intake_sorting', label: '1. Intake' },
              { id: 'fermentation', label: '2. Fermentasi' },
              { id: 'drying', label: '3. Penjemuran' },
              { id: 'conditioning', label: '4. Resting Silo' },
              { id: 'milling', label: '5. Hulling Mill' },
              { id: 'grading_qc', label: '6. Grading QC' },
              { id: 'packing_closure', label: '7. Kemas & Rilis' },
            ]}
            viewMode={viewMode === 'cards' ? 'kanban' : viewMode}
            onViewModeChange={(m) => setViewMode(m === 'table' ? 'table' : 'cards')}
            recordCount={filteredBatches.length}
          />

          {/* LIST VIEW: CARDS / GRID */}
          {filteredBatches.length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Flame className="w-12 h-12 text-amber-400 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">Belum ada batch pengolahan aktif</h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto mb-4">
                Mulai batch baru dari stok ceri gudang atau pengadaan petani untuk mengaktifkan lembar kerja 7-Stage.
              </p>
              <button
                onClick={() => setIsCreateOpen(true)}
                className="px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs inline-flex items-center gap-2 shadow-xs"
              >
                <PlusCircle className="w-4 h-4" />
                <span>Inisiasi Batch Baru</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredBatches.map((batch) => {
                const mb = calculateBatchMassBalance(batch);
                const currentStageInfo = PROCESSOR_7_STAGES.find((s) => s.id === batch.currentStage);

                return (
                  <div
                    key={batch.id}
                    onClick={() => handleSelectBatch(batch)}
                    className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md hover:border-amber-400 transition-all flex flex-col justify-between cursor-pointer group"
                  >
                    <div>
                      {/* Header bar */}
                      <div className="p-4 bg-gradient-to-r from-stone-900 to-amber-950 text-white flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <span className="font-mono font-bold text-amber-300 text-xs">{batch.batchCode}</span>
                        </div>
                        <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase bg-amber-600/80 text-white border border-amber-400/30">
                          {batch.fermentationLog.method}
                        </span>
                      </div>

                      {/* Content */}
                      <div className="p-5 space-y-3">
                        <div>
                          <div className="flex items-center justify-between text-[11px] text-stone-500 mb-1">
                            <span>Petani: <strong className="text-stone-800">{batch.sourceFarmerName}</strong></span>
                            <span className="font-mono text-emerald-700 font-bold">{batch.intakeLog.brix}° Brix</span>
                          </div>
                          <h3 className="font-bold text-base text-stone-900 group-hover:text-amber-800 transition-colors">
                            {batch.variety}
                          </h3>
                          <p className="text-xs text-stone-500 flex items-center gap-1 mt-0.5">
                            <MapPin className="w-3.5 h-3.5 text-stone-400" />
                            {batch.sourceOrigin} ({batch.altitude})
                          </p>
                        </div>

                        {/* Stage Progress Pill */}
                        <div className="p-2.5 rounded-xl bg-amber-50/80 border border-amber-200 text-amber-950 text-xs">
                          <div className="flex items-center justify-between font-bold text-[11px]">
                            <span>Tahap Aktif:</span>
                            <span className="text-amber-800">{currentStageInfo?.label}</span>
                          </div>
                        </div>

                        <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Ceri Masuk:</span>
                            <span className="font-bold text-stone-800">{batch.intakeLog.cherryWeightKg} kg</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Kadar Air:</span>
                            <span className={`font-bold ${batch.dryingLog.finalMoisturePercent <= 12.5 ? 'text-emerald-700' : 'text-amber-700'}`}>
                              {batch.dryingLog.finalMoisturePercent}%
                            </span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Estimasi Yield:</span>
                            <span className="font-bold text-stone-800">{mb.actualYieldPercent}%</span>
                          </div>
                          <div>
                            <span className="text-[10px] text-stone-400 block font-semibold">Target Grade:</span>
                            <span className="font-bold text-purple-700">{batch.qcAssessment.calculatedGrade}</span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Footer */}
                    <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                      <span className="text-[11px] text-stone-500 font-medium">Mulai: {batch.startDate}</span>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectBatch(batch);
                        }}
                        className="px-3.5 py-1.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 transition-all shadow-2xs"
                      >
                        <span>Buka Lembar Kerja</span>
                        <ChevronRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      ) : (
        /* ========================================================================= */
        /* MODE 2: INTERACTIVE 7-STAGE PROCESSING WORKSHEET (LEMBAR KERJA PENGOLAHAN)*/
        /* ========================================================================= */
        editedBatch && (
          <div className="space-y-4 animate-in fade-in duration-200">
            {/* Breadcrumb Navigation */}
            <RecordBreadcrumb
              listLabel="Daftar Batch Pengolahan"
              recordLabel={editedBatch.batchCode}
              onBack={handleBackToList}
            />

            <div className="bg-white rounded-3xl border border-stone-200/90 shadow-sm overflow-hidden">
              {/* Header & Status Pipeline */}
              <div className="bg-[#FAF7F2] px-6 py-5 border-b border-stone-200 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                <div className="flex items-center gap-3.5">
                  <div className="p-3 rounded-2xl bg-amber-500 text-stone-950 font-bold shadow-xs">
                    <Flame className="w-6 h-6" />
                  </div>
                  <div>
                    <div className="flex flex-wrap items-center gap-2">
                      <h2 className="text-xl sm:text-2xl font-black text-stone-900 font-mono tracking-tight">
                        {editedBatch.batchCode}
                      </h2>
                      <span className="px-3 py-0.5 rounded-full text-xs font-bold uppercase bg-amber-600 text-white shadow-2xs">
                        {editedBatch.fermentationLog.method}
                      </span>
                    </div>
                    <p className="text-xs text-stone-500 mt-1">
                      Petani Asal: <strong className="text-stone-800">{editedBatch.sourceFarmerName}</strong> • {editedBatch.sourceOrigin} ({editedBatch.altitude})
                    </p>
                  </div>
                </div>

                {/* Status Pipeline */}
                <div className="w-full lg:w-auto overflow-x-auto pb-1">
                  <StatusPipeline stages={PIPELINE_STAGES} currentStageId={editedBatch.currentStage} />
                </div>
              </div>

              {/* Action Bar & Stat Buttons */}
              <div className="px-6 py-4 bg-white border-b border-stone-100 flex flex-wrap gap-3 items-center justify-between">
                {/* Stat Buttons */}
                <div className="flex flex-wrap gap-2">
                  <StatButton
                    icon={<Coffee className="w-4 h-4" />}
                    value={`${editedBatch.intakeLog.cherryWeightKg} kg`}
                    label="Ceri Intake"
                    color="stone"
                  />
                  <StatButton
                    icon={<TrendingUp className="w-4 h-4" />}
                    value={`${calculateBatchMassBalance(editedBatch).actualYieldPercent}%`}
                    label="Rendemen Yield"
                    color="amber"
                  />
                  <StatButton
                    icon={<Droplets className="w-4 h-4" />}
                    value={`${editedBatch.dryingLog.finalMoisturePercent}%`}
                    label={editedBatch.dryingLog.finalMoisturePercent <= 12.5 ? 'Kadar Air (Lulus ≤12.5%)' : 'Kadar Air (>12.5%)'}
                    color={editedBatch.dryingLog.finalMoisturePercent <= 12.5 ? 'emerald' : 'amber'}
                  />
                  <StatButton
                    icon={<Award className="w-4 h-4" />}
                    value={editedBatch.qcAssessment.calculatedGrade}
                    label={`SCA ${editedBatch.qcAssessment.scaCuppingScore}`}
                    color="purple"
                  />
                  <StatButton
                    icon={<Recycle className="w-4 h-4" />}
                    value={`${editedBatch.wasteManagement.weightKgOrLiters} kg`}
                    label="Limbah Terkelola"
                    color="emerald"
                  />
                </div>

                {/* Primary Action Buttons */}
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    onClick={handleSaveWorksheet}
                    className="px-4 py-2 rounded-xl border border-stone-300 bg-white hover:bg-stone-100 text-stone-800 font-bold text-xs flex items-center gap-1.5 shadow-2xs transition-colors"
                  >
                    <Save className="w-4 h-4 text-stone-600" />
                    <span>Simpan Perubahan</span>
                  </button>

                  {editedBatch.currentStage === 'packing_closure' ? (
                    <button
                      onClick={handleFinalizeBatch}
                      className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all animate-pulse"
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      <span>Rilis Green Bean ke Marketplace 🚀</span>
                    </button>
                  ) : (
                    <button
                      onClick={handleAdvanceStage}
                      className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs flex items-center gap-1.5 shadow-sm transition-all"
                    >
                      <span>Lanjut Tahap Berikutnya</span>
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  )}
                </div>
              </div>

              {/* 7-Stage Interactive Worksheet Tabs */}
              <div className="px-6 pt-3 border-b border-stone-200 bg-stone-50/50 flex flex-wrap gap-1.5 overflow-x-auto">
                {[
                  { id: 'stage1', label: '1. Intake & Sortasi Ceri', icon: Coffee },
                  { id: 'stage2', label: '2. Pengolahan & Fermentasi', icon: Flame },
                  { id: 'stage3', label: '3. Penjemuran & Log Air', icon: Droplets },
                  { id: 'stage4', label: '4. Resting & Pemeraman', icon: Warehouse },
                  { id: 'stage5', label: '5. Hulling & Dry Milling', icon: Sliders },
                  { id: 'stage6', label: '6. Grading & SCA QC', icon: Award },
                  { id: 'stage7', label: '7. Kemas & Rilis Pasar', icon: Store },
                ].map((tab) => {
                  const TabIcon = tab.icon;
                  const isActive = activeTab === tab.id;
                  return (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id as any)}
                      className={`px-4 py-2.5 rounded-t-xl text-xs font-bold flex items-center gap-2 border-b-2 transition-all whitespace-nowrap ${
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

              {/* Worksheet Form Container */}
              <div className="p-6 text-xs space-y-6">
                {/* ------------------------------------------------------------------------- */}
                {/* TAB 1: INTAKE & SORTASI CERI (STAGE 1)                                   */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage1' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Coffee className="w-4 h-4 text-amber-600" /> Timbangan &amp; Refraktometer Brix
                        </h4>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-full">
                          Stage 1 Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Total Bobot Ceri (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.intakeLog.cherryWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                intakeLog: { ...editedBatch.intakeLog, cherryWeightKg: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Kadar Gula Buah (°Bx)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.intakeLog.brix}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                intakeLog: { ...editedBatch.intakeLog, brix: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Ceri Tenggelam / Sinkers (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.intakeLog.sinkersWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                intakeLog: { ...editedBatch.intakeLog, sinkersWeightKg: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Ceri Terapung / Floaters (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.intakeLog.floatersWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                intakeLog: { ...editedBatch.intakeLog, floatersWeightKg: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Standar Petik Visual</label>
                        <select
                          value={editedBatch.intakeLog.visualQualityGrade}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              intakeLog: { ...editedBatch.intakeLog, visualQualityGrade: e.target.value as any },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                        >
                          <option value="A (95%+ Petik Merah)">A (95%+ Petik Merah)</option>
                          <option value="B (85-94% Merah)">B (85-94% Merah)</option>
                          <option value="C (Campur)">C (Campur)</option>
                        </select>
                      </div>
                    </div>

                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                        Silsilah Asal Petani &amp; Operator
                      </h4>

                      <div className="space-y-2 text-stone-600">
                        <div className="flex justify-between py-1 border-b border-stone-200/60">
                          <span>Lot Sumber:</span>
                          <span className="font-mono font-bold text-stone-900">{editedBatch.sourceFarmerLotId}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200/60">
                          <span>Nama Petani:</span>
                          <span className="font-bold text-stone-900">{editedBatch.sourceFarmerName}</span>
                        </div>
                        <div className="flex justify-between py-1 border-b border-stone-200/60">
                          <span>Varietas &amp; Elevasi:</span>
                          <span className="font-semibold text-stone-800">{editedBatch.variety} ({editedBatch.altitude})</span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Operator Petugas Intake</label>
                        <input
                          type="text"
                          value={editedBatch.intakeLog.operatorName}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              intakeLog: { ...editedBatch.intakeLog, operatorName: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Catatan Sortasi Penerimaan</label>
                        <textarea
                          rows={2}
                          value={editedBatch.intakeLog.notes}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              intakeLog: { ...editedBatch.intakeLog, notes: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------------- */}
                {/* TAB 2: PENGOLAHAN & FERMENTASI (STAGE 2)                                 */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage2' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Flame className="w-4 h-4 text-amber-600" /> Parameter Pengolahan &amp; Fermentasi
                        </h4>
                        <span className="text-[10px] font-bold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full">
                          Stage 2 Active
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Pilih Metode Olah</label>
                        <select
                          value={editedBatch.fermentationLog.method}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              fermentationLog: { ...editedBatch.fermentationLog, method: e.target.value as any },
                            })
                          }
                          className="w-full px-3 py-2.5 rounded-xl border border-stone-300 bg-white font-bold text-amber-900 text-xs"
                        >
                          <option value="Natural / Dry">1. Natural (Dry) — Ceri Utuh Langsung Jemur (Sun Dried)</option>
                          <option value="Full Washed">2. Washed (Wet) — Depulper, Tangki Fermentasi & Cuci</option>
                          <option value="Honey (Yellow/Red/Black)">3. Honey (Pulped Natural) — Depulper, Sisakan Lendir Lengket</option>
                          <option value="Wet Hulled (Giling Basah)">4. Wet Hulled (Giling Basah) — Hulling Lembek pada Moisture ~30-40%</option>
                          <option value="Anaerobic Natural">Anaerobic Natural — Fermentasi Ragi Kedap Udara</option>
                          <option value="Wine Process">Wine Process — Extended Fermentation</option>
                        </select>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">ID Tangki Fermentasi</label>
                          <input
                            type="text"
                            value={editedBatch.fermentationLog.tankId}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                fermentationLog: { ...editedBatch.fermentationLog, tankId: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Durasi Fermentasi (Jam)</label>
                          <input
                            type="number"
                            value={editedBatch.fermentationLog.durationHours}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                fermentationLog: { ...editedBatch.fermentationLog, durationHours: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">pH Awal Fermentasi</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.fermentationLog.startPh}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                fermentationLog: { ...editedBatch.fermentationLog, startPh: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">pH Akhir (Asidifikasi)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.fermentationLog.endPh}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                fermentationLog: { ...editedBatch.fermentationLog, endPh: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                        Suhu, Ragi Inokulasi &amp; Air Cuci
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Suhu Slurry Adukan (°C)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.fermentationLog.slurryTempCelsius}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                fermentationLog: { ...editedBatch.fermentationLog, slurryTempCelsius: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Suhu Ruang Ambient (°C)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.fermentationLog.ambientTempCelsius}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                fermentationLog: { ...editedBatch.fermentationLog, ambientTempCelsius: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Inokulum Ragi / Kultur</label>
                        <input
                          type="text"
                          value={editedBatch.fermentationLog.inoculumYeast}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              fermentationLog: { ...editedBatch.fermentationLog, inoculumYeast: e.target.value },
                            })
                          }
                          placeholder="Contoh: Lalcafe Intenso Yeast / Ragi Liar Terkontrol"
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Debit Air Pencucian Lendir (Liter)</label>
                        <input
                          type="number"
                          value={editedBatch.fermentationLog.washWaterLiters}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              fermentationLog: { ...editedBatch.fermentationLog, washWaterLiters: Number(e.target.value) },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                        />
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Catatan Fermentasi</label>
                        <textarea
                          rows={2}
                          value={editedBatch.fermentationLog.notes}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              fermentationLog: { ...editedBatch.fermentationLog, notes: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------------- */}
                {/* TAB 3: PENJEMURAN & LOG HARIAN KADAR AIR (STAGE 3)                       */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage3' && (
                  <div className="space-y-6">
                    {/* Header Spec */}
                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80">
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Metode Penjemuran</label>
                          <select
                            value={editedBatch.dryingLog.dryingMethod}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                dryingLog: { ...editedBatch.dryingLog, dryingMethod: e.target.value as any },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          >
                            <option value="Solar Dryer Raised Bed">Solar Dryer Raised Bed (African Bed)</option>
                            <option value="Greenhouse Solar Dome">Greenhouse Solar Dome</option>
                            <option value="Patio Penjemuran">Patio Penjemuran</option>
                            <option value="Mechanical Controlled Dryer">Mechanical Controlled Dryer</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Nomor / ID Bed Jemur</label>
                          <input
                            type="text"
                            value={editedBatch.dryingLog.bedId}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                dryingLog: { ...editedBatch.dryingLog, bedId: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">
                            Kadar Air Final Terkini (%)
                          </label>
                          <div className="flex items-center gap-2">
                            <input
                              type="number"
                              step="0.1"
                              value={editedBatch.dryingLog.finalMoisturePercent}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  dryingLog: {
                                    ...editedBatch.dryingLog,
                                    finalMoisturePercent: Number(e.target.value),
                                    targetMoisturePassed: Number(e.target.value) <= 12.5,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-amber-900 text-sm"
                            />
                            <span
                              className={`px-3 py-2 rounded-xl text-xs font-bold shrink-0 ${
                                editedBatch.dryingLog.finalMoisturePercent <= 12.5
                                  ? 'bg-emerald-100 text-emerald-900 border border-emerald-300'
                                  : 'bg-amber-100 text-amber-900 border border-amber-300'
                              }`}
                            >
                              {editedBatch.dryingLog.finalMoisturePercent <= 12.5 ? '✓ Lulus Gate' : 'Belum Lulus (>12.5%)'}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Interactive Daily Log Input Form */}
                    <div className="bg-amber-50/70 p-5 rounded-2xl border border-amber-200 space-y-4">
                      <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                        <h4 className="font-bold text-amber-950 text-sm flex items-center gap-2">
                          <PlusCircle className="w-4 h-4 text-amber-700" /> Form Input Log Harian Penjemuran
                        </h4>
                        <span className="text-[11px] text-amber-800">
                          Catat penurunan kadar air harian secara live
                        </span>
                      </div>

                      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Kadar Air (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newLogMoisture}
                            onChange={(e) => setNewLogMoisture(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-amber-950"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Suhu Dome (°C)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={newLogTemp}
                            onChange={(e) => setNewLogTemp(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Kelembaban RH (%)</label>
                          <input
                            type="number"
                            value={newLogRh}
                            onChange={(e) => setNewLogRh(Number(e.target.value))}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Frekuensi Balik</label>
                          <input
                            type="text"
                            value={newLogFreq}
                            onChange={(e) => setNewLogFreq(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Catatan</label>
                          <input
                            type="text"
                            value={newLogNotes}
                            onChange={(e) => setNewLogNotes(e.target.value)}
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800"
                          />
                        </div>
                      </div>

                      <div className="flex justify-end pt-1">
                        <button
                          type="button"
                          onClick={handleAddDailyLog}
                          className="px-4 py-2 rounded-xl bg-amber-700 hover:bg-amber-800 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs"
                        >
                          <Plus className="w-4 h-4" />
                          <span>+ Catat Log Hari Ini ke Tabel</span>
                        </button>
                      </div>
                    </div>

                    {/* Daily Logs Table */}
                    <div className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-2xs">
                      <div className="px-5 py-3.5 bg-stone-50 border-b border-stone-200 flex items-center justify-between">
                        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider">
                          Daftar Log Harian Penjemuran Terdaftar ({editedBatch.dryingLog.dailyLogs?.length || 0} Hari)
                        </h4>
                      </div>

                      <div className="overflow-x-auto">
                        <table className="w-full text-left text-xs">
                          <thead className="bg-[#FAF7F2] text-stone-600 font-bold border-b border-stone-200 uppercase text-[10px]">
                            <tr>
                              <th className="py-3 px-4">Hari Ke</th>
                              <th className="py-3 px-4">Tanggal</th>
                              <th className="py-3 px-4">Kadar Air (%)</th>
                              <th className="py-3 px-4">Suhu Dome (°C)</th>
                              <th className="py-3 px-4">Kelembaban (RH%)</th>
                              <th className="py-3 px-4">Frekuensi Balik</th>
                              <th className="py-3 px-4">Catatan</th>
                              <th className="py-3 px-4 text-right">Aksi</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-stone-100">
                            {(editedBatch.dryingLog.dailyLogs || []).map((log, index) => (
                              <tr key={index} className="hover:bg-amber-50/40">
                                <td className="py-3 px-4 font-bold text-stone-900">Hari #{log.dayNumber}</td>
                                <td className="py-3 px-4 text-stone-600">{log.date}</td>
                                <td className="py-3 px-4 font-mono font-black text-amber-900">
                                  {log.moisturePercent}%
                                </td>
                                <td className="py-3 px-4 font-mono">{log.ambientTempCelsius}°C</td>
                                <td className="py-3 px-4 font-mono">{log.rhPercent}%</td>
                                <td className="py-3 px-4 text-stone-700">{log.turningFrequency}</td>
                                <td className="py-3 px-4 text-stone-500 italic">{log.notes || '-'}</td>
                                <td className="py-3 px-4 text-right">
                                  <button
                                    type="button"
                                    onClick={() => handleDeleteDailyLog(index)}
                                    className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 transition-colors"
                                    title="Hapus baris log"
                                  >
                                    <Trash2 className="w-3.5 h-3.5" />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------------- */}
                {/* TAB 4: PEMERAMAN / RESTING SILO (STAGE 4)                                */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage4' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Warehouse className="w-4 h-4 text-amber-600" /> Parameter Pemeraman (Resting Gabah)
                        </h4>
                        <span className="text-[10px] font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded-full">
                          Stage 4 Active
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">ID Silo / Bin</label>
                          <input
                            type="text"
                            value={editedBatch.conditioningLog.siloBinId}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: { ...editedBatch.conditioningLog, siloBinId: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-mono font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Wadah Hermetik</label>
                          <select
                            value={editedBatch.conditioningLog.packagingType}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: { ...editedBatch.conditioningLog, packagingType: e.target.value as any },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          >
                            <option value="GrainPro Hermetic 50kg">GrainPro Hermetic 50kg</option>
                            <option value="Ecotact 50kg">Ecotact 50kg</option>
                            <option value="Wooden Bin (Pine)">Wooden Bin (Pine)</option>
                          </select>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Target Resting (Hari)</label>
                          <input
                            type="number"
                            value={editedBatch.conditioningLog.targetRestingDays}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: {
                                  ...editedBatch.conditioningLog,
                                  targetRestingDays: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Hari Selesai Berjalan</label>
                          <input
                            type="number"
                            value={editedBatch.conditioningLog.completedDays}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: { ...editedBatch.conditioningLog, completedDays: Number(e.target.value) },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-amber-900"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                        Stabilisasi Kadar Air &amp; Lingkungan
                      </h4>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Kadar Air Stabil (%)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.conditioningLog.moistureStabilizedPercent}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: {
                                  ...editedBatch.conditioningLog,
                                  moistureStabilizedPercent: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Water Activity (aW)</label>
                          <input
                            type="number"
                            step="0.01"
                            value={editedBatch.conditioningLog.waterActivityAw}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: {
                                  ...editedBatch.conditioningLog,
                                  waterActivityAw: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Suhu Silo (°C)</label>
                          <input
                            type="number"
                            step="0.1"
                            value={editedBatch.conditioningLog.ambientTempCelsius}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: {
                                  ...editedBatch.conditioningLog,
                                  ambientTempCelsius: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Kelembaban Silo (RH%)</label>
                          <input
                            type="number"
                            value={editedBatch.conditioningLog.ambientRhPercent}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                conditioningLog: {
                                  ...editedBatch.conditioningLog,
                                  ambientRhPercent: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------------- */}
                {/* TAB 5: DRY MILLING & HULLING (STAGE 5)                                   */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage5' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                        <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                          <Sliders className="w-4 h-4 text-amber-600" /> Mesin Huller &amp; Bobot Gabah Masuk
                        </h4>
                        <span className="text-[10px] font-bold text-blue-700 bg-blue-100 px-2 py-0.5 rounded-full">
                          Stage 5 Active
                        </span>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Mesin Pengupas (Huller ID)</label>
                        <input
                          type="text"
                          value={editedBatch.millingLog.machineId}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              millingLog: { ...editedBatch.millingLog, machineId: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Input Gabah Kering (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.millingLog.inputParchmentWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                millingLog: {
                                  ...editedBatch.millingLog,
                                  inputParchmentWeightKg: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Output Green Bean (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.millingLog.outputGreenBeanWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                millingLog: {
                                  ...editedBatch.millingLog,
                                  outputGreenBeanWeightKg: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-emerald-700"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Output Sekam/Husk (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.millingLog.outputHuskWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                millingLog: {
                                  ...editedBatch.millingLog,
                                  outputHuskWeightKg: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Output Debu / Loss (kg)</label>
                          <input
                            type="number"
                            value={editedBatch.millingLog.outputDustWeightKg}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                millingLog: {
                                  ...editedBatch.millingLog,
                                  outputDustWeightKg: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          />
                        </div>
                      </div>
                    </div>

                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                      <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                        Kalkulasi Rendemen &amp; Efisiensi Mesin
                      </h4>

                      <div className="p-4 rounded-xl bg-white border border-stone-200 space-y-2">
                        <div className="flex justify-between">
                          <span className="text-stone-500">Rasio Rendemen Ceri ke Green Bean:</span>
                          <span className="font-mono font-black text-stone-900">
                            {((editedBatch.millingLog.outputGreenBeanWeightKg / editedBatch.intakeLog.cherryWeightKg) * 100).toFixed(1)}%
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-stone-500">Efisiensi Pengupasan Mesin:</span>
                          <span className="font-mono font-bold text-emerald-700">
                            {editedBatch.millingLog.millingEfficiencyPercent}%
                          </span>
                        </div>
                      </div>

                      <div>
                        <label className="block font-bold text-stone-700 uppercase mb-1">Catatan Hulling Mill</label>
                        <textarea
                          rows={2}
                          value={editedBatch.millingLog.notes}
                          onChange={(e) =>
                            setEditedBatch({
                              ...editedBatch,
                              millingLog: { ...editedBatch.millingLog, notes: e.target.value },
                            })
                          }
                          className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white text-stone-800"
                        />
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------------- */}
                {/* TAB 6: GRADING & SCA QC (STAGE 6)                                        */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage6' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* Defect SCA 350g */}
                      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Award className="w-4 h-4 text-purple-600" /> Cacat Fisik SCA (Sample 350g)
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Cacat Primer (Count)</label>
                            <input
                              type="number"
                              value={editedBatch.qcAssessment.defects.primaryDefects}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    defects: {
                                      ...editedBatch.qcAssessment.defects,
                                      primaryDefects: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Cacat Sekunder (Count)</label>
                            <input
                              type="number"
                              value={editedBatch.qcAssessment.defects.secondaryDefects}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    defects: {
                                      ...editedBatch.qcAssessment.defects,
                                      secondaryDefects: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                            />
                          </div>
                        </div>

                        <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl text-purple-950 font-bold flex justify-between items-center">
                          <span>Grade Terkalkulasi:</span>
                          <span className="text-purple-900 text-xs font-black">
                            {editedBatch.qcAssessment.calculatedGrade}
                          </span>
                        </div>
                      </div>

                      {/* Screen Distribution */}
                      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Sliders className="w-4 h-4 text-blue-600" /> Ayakan Fisik (Screen Size)
                        </h4>
                        <div className="grid grid-cols-2 gap-2.5">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Screen 18+ (kg)</label>
                            <input
                              type="number"
                              value={editedBatch.qcAssessment.screenDistribution.screen18PlusKg}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    screenDistribution: {
                                      ...editedBatch.qcAssessment.screenDistribution,
                                      screen18PlusKg: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Screen 16-17 (kg)</label>
                            <input
                              type="number"
                              value={editedBatch.qcAssessment.screenDistribution.screen16_17Kg}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    screenDistribution: {
                                      ...editedBatch.qcAssessment.screenDistribution,
                                      screen16_17Kg: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Screen 14-15 (kg)</label>
                            <input
                              type="number"
                              value={editedBatch.qcAssessment.screenDistribution.screen14_15Kg}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    screenDistribution: {
                                      ...editedBatch.qcAssessment.screenDistribution,
                                      screen14_15Kg: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Peaberry / Lanang (kg)</label>
                            <input
                              type="number"
                              value={editedBatch.qcAssessment.screenDistribution.peaberryKg}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    screenDistribution: {
                                      ...editedBatch.qcAssessment.screenDistribution,
                                      peaberryKg: Number(e.target.value),
                                    },
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                            />
                          </div>
                        </div>
                      </div>

                      {/* SCA Sensory Score & Water Activity */}
                      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                        <h4 className="font-bold text-stone-900 text-xs uppercase tracking-wider flex items-center gap-1.5">
                          <Sparkles className="w-4 h-4 text-amber-600" /> Skor Cupping SCA (0-100 Pts)
                        </h4>
                        <div>
                          <label className="block font-bold text-stone-700 mb-1">Skor Sensori Cupping</label>
                          <input
                            type="number"
                            step="0.25"
                            value={editedBatch.qcAssessment.scaCuppingScore}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                qcAssessment: {
                                  ...editedBatch.qcAssessment,
                                  scaCuppingScore: Number(e.target.value),
                                },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-purple-700 text-base"
                          />
                        </div>

                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Kadar Air Final (%)</label>
                            <input
                              type="number"
                              step="0.1"
                              value={editedBatch.qcAssessment.finalMoisturePercent}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    finalMoisturePercent: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 mb-1">Water Activity (aW)</label>
                            <input
                              type="number"
                              step="0.01"
                              value={editedBatch.qcAssessment.waterActivityAw}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  qcAssessment: {
                                    ...editedBatch.qcAssessment,
                                    waterActivityAw: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                            />
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Flavor Notes Tag Input */}
                    <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-3">
                      <h4 className="font-bold text-stone-900 text-sm">Cupping Flavor Notes</h4>
                      <div className="flex flex-wrap gap-1.5 items-center">
                        {(editedBatch.qcAssessment.cuppingNotes || []).map((note, i) => (
                          <span
                            key={i}
                            className="px-3 py-1 rounded-xl text-xs font-bold bg-amber-100 text-amber-950 border border-amber-300 flex items-center gap-1.5 shadow-2xs"
                          >
                            <span>{note}</span>
                            <button
                              type="button"
                              onClick={() => handleRemoveCuppingNote(note)}
                              className="text-amber-800 hover:text-rose-600"
                            >
                              <X className="w-3.5 h-3.5" />
                            </button>
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center gap-2 max-w-md pt-1">
                        <input
                          type="text"
                          value={newCuppingNote}
                          onChange={(e) => setNewCuppingNote(e.target.value)}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              e.preventDefault();
                              handleAddCuppingNote();
                            }
                          }}
                          placeholder="Ketik rasa (cth: Jasmine, Citrus, Brown Sugar)..."
                          className="flex-1 px-3 py-2 rounded-xl border border-stone-300 bg-white text-xs font-semibold"
                        />
                        <button
                          type="button"
                          onClick={handleAddCuppingNote}
                          className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs"
                        >
                          + Tambah
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {/* ------------------------------------------------------------------------- */}
                {/* TAB 7: PENGEMASAN & RILIS MARKETPLACE (STAGE 7)                           */}
                {/* ------------------------------------------------------------------------- */}
                {activeTab === 'stage7' && (
                  <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                        <div className="flex items-center justify-between border-b border-stone-200 pb-2">
                          <h4 className="font-bold text-stone-900 text-sm flex items-center gap-2">
                            <Store className="w-4 h-4 text-emerald-600" /> Spesifikasi Kemas &amp; Listing Jual
                          </h4>
                          <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded-full">
                            Tahap Akhir
                          </span>
                        </div>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Jenis Karung / Kemasan</label>
                          <select
                            value={editedBatch.packingLog.baggingType}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                packingLog: { ...editedBatch.packingLog, baggingType: e.target.value as any },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          >
                            <option value="GrainPro 60kg + Karung Goni">GrainPro 60kg + Karung Goni</option>
                            <option value="GrainPro 30kg Box">GrainPro 30kg Box</option>
                            <option value="Vacuum Pack 5kg Foil">Vacuum Pack 5kg Foil</option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 uppercase mb-1">Total Karung (Bags)</label>
                            <input
                              type="number"
                              value={editedBatch.packingLog.totalBags}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  packingLog: { ...editedBatch.packingLog, totalBags: Number(e.target.value) },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-900"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 uppercase mb-1">Harga Jual / kg (Rp)</label>
                            <input
                              type="number"
                              step="5000"
                              value={editedBatch.targetMarketplacePricePerKg || 125000}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  targetMarketplacePricePerKg: Number(e.target.value),
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-black text-emerald-800 text-sm"
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                          <input
                            type="checkbox"
                            id="eudrCheck"
                            checked={editedBatch.packingLog.eudrComplianceVerified}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                packingLog: {
                                  ...editedBatch.packingLog,
                                  eudrComplianceVerified: e.target.checked,
                                },
                              })
                            }
                            className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                          />
                          <label htmlFor="eudrCheck" className="text-xs font-bold text-stone-800">
                            Kepatuhan EUDR Anti-Deforestasi &amp; Geolocation Terverifikasi
                          </label>
                        </div>
                      </div>

                      <div className="bg-stone-50/70 p-5 rounded-2xl border border-stone-200/80 space-y-4">
                        <h4 className="font-bold text-stone-900 text-sm border-b border-stone-200 pb-2">
                          Alokasi Limbah Sirkular &amp; Eco-Credit
                        </h4>

                        <div>
                          <label className="block font-bold text-stone-700 uppercase mb-1">Pemanfaatan Limbah</label>
                          <select
                            value={editedBatch.wasteManagement.utilization}
                            onChange={(e) =>
                              setEditedBatch({
                                ...editedBatch,
                                wasteManagement: { ...editedBatch.wasteManagement, utilization: e.target.value },
                              })
                            }
                            className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                          >
                            <option value="Bahan Baku Minuman Teh Cascara & Kompos Sirkular">
                              Bahan Baku Minuman Teh Cascara &amp; Kompos Sirkular
                            </option>
                            <option value="Dekomposisi Pupuk Organik Cair & Padat Kebun">
                              Dekomposisi Pupuk Organik Cair &amp; Padat Kebun
                            </option>
                            <option value="Pakan Ternak & Bahan Briket Arang Biomassa">
                              Pakan Ternak &amp; Bahan Briket Arang Biomassa
                            </option>
                          </select>
                        </div>

                        <div className="grid grid-cols-2 gap-3">
                          <div>
                            <label className="block font-bold text-stone-700 uppercase mb-1">Berat Limbah (kg)</label>
                            <input
                              type="number"
                              value={editedBatch.wasteManagement.weightKgOrLiters}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  wasteManagement: {
                                    ...editedBatch.wasteManagement,
                                    weightKgOrLiters: Number(e.target.value),
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-bold text-stone-800"
                            />
                          </div>

                          <div>
                            <label className="block font-bold text-stone-700 uppercase mb-1">Penerima Limbah</label>
                            <input
                              type="text"
                              value={editedBatch.wasteManagement.recipientOrLocation}
                              onChange={(e) =>
                                setEditedBatch({
                                  ...editedBatch,
                                  wasteManagement: {
                                    ...editedBatch.wasteManagement,
                                    recipientOrLocation: e.target.value,
                                  },
                                })
                              }
                              className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white font-semibold text-stone-800"
                            />
                          </div>
                        </div>

                        {/* Rilis CTA */}
                        <div className="pt-3">
                          <button
                            type="button"
                            onClick={handleFinalizeBatch}
                            className="w-full py-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-black text-sm flex items-center justify-center gap-2 shadow-md transition-all hover:scale-[1.01]"
                          >
                            <Store className="w-5 h-5" />
                            <span>🚀 Selesaikan Batch &amp; Terbitkan Green Bean ke Marketplace</span>
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
      )}

      {/* Barcode Modal (if printing bag barcode) */}
      <ProcessorBarcodeModal
        isOpen={barcodeModalOpen}
        onClose={() => setBarcodeModalOpen(false)}
        lot={selectedBatchForBarcode}
        isNewProcess={false}
      />
    </div>
  );
};
