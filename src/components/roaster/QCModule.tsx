import React, { useState } from 'react';
import {
  Sparkles,
  PlusCircle,
  Award,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Search,
  Filter,
  Layers,
  Thermometer,
  Activity,
  FileCheck,
  X,
  Coffee,
  Calendar,
  FileText,
  Sliders,
} from 'lucide-react';
import { QCCuppingSession, WorkOrder } from '../../types/roasterErp';
import { useCoffee } from '../../context/CoffeeContext';
import { MetricCard } from '../admin/MetricCard';
import { OdooControlPanel } from '../odoo/OdooControlPanel';
import { OdooStatusPipeline, OdooPipelineStage } from '../odoo/OdooStatusPipeline';
import { OdooSmartStatButton } from '../odoo/OdooSmartStatButton';
import { OdooChatter } from '../odoo/OdooChatter';

interface QCModuleProps {
  initialWorkOrder?: WorkOrder | null;
}

const QC_PIPELINE_STAGES: OdooPipelineStage[] = [
  { id: 'draft', label: 'Persiapan Meja' },
  { id: 'cupping', label: 'Uji Sensori SCA' },
  { id: 'physical', label: 'Analisis Fisik Agtron' },
  { id: 'approved', label: 'Rilis Specialty' },
];

export const QCModule: React.FC<QCModuleProps> = ({ initialWorkOrder }) => {
  const { qcSessions, workOrders, createCuppingSession } = useCoffee();

  const [isCuppingModalOpen, setIsCuppingModalOpen] = useState(!!initialWorkOrder);
  const [selectedWorkOrderId, setSelectedWorkOrderId] = useState(initialWorkOrder?.id || '');
  const [detailModalQC, setDetailModalQC] = useState<QCCuppingSession | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'table' | 'kanban' | 'graph'>('kanban');

  // Form State for SCA Cupping Session
  const [sessionName, setSessionName] = useState('Uji Pelepasan Batch Sangrai Baru');
  const [beanName, setBeanName] = useState(
    initialWorkOrder ? initialWorkOrder.greenBeanName : 'Java Pangalengan Anaerobic Natural'
  );
  const [origin, setOrigin] = useState(
    initialWorkOrder ? initialWorkOrder.origin : 'Pangalengan, Jawa Barat'
  );
  const [cupperName, setCupperName] = useState('Hendra Q-Grader');

  // 10 SCA Criteria Scores
  const [fragrance, setFragrance] = useState<number>(8.75);
  const [flavor, setFlavor] = useState<number>(8.75);
  const [aftertaste, setAftertaste] = useState<number>(8.5);
  const [acidity, setAcidity] = useState<number>(8.75);
  const [body, setBody] = useState<number>(8.5);
  const [balance, setBalance] = useState<number>(8.5);
  const [cleanCup, setCleanCup] = useState<number>(10.0);
  const [sweetness, setSweetness] = useState<number>(10.0);
  const [uniformity, setUniformity] = useState<number>(10.0);
  const [overall, setOverall] = useState<number>(8.75);
  const [defects, setDefects] = useState<number>(0);

  // Physical QA
  const [moisturePercent, setMoisturePercent] = useState<number>(1.8);
  const [waterActivityAw, setWaterActivityAw] = useState<number>(0.52);
  const [agtronWhole, setAgtronWhole] = useState<number>(78);
  const [agtronGround, setAgtronGround] = useState<number>(82);
  const [qcNotes, setQcNotes] = useState('Karakter asam malik segar, manis gula tebu dan aroma melati kuat.');

  // Live Total SCA Score Calculation
  const totalScaScore = Number(
    (
      fragrance +
      flavor +
      aftertaste +
      acidity +
      body +
      balance +
      cleanCup +
      sweetness +
      uniformity +
      overall -
      defects
    ).toFixed(2)
  );

  const getQcStatus = (score: number): QCCuppingSession['status'] => {
    if (score >= 85.0) return 'approved_specialty';
    if (score >= 80.0) return 'approved_commercial';
    return 'quarantine';
  };

  const handleCreateCuppingSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const status = getQcStatus(totalScaScore);

    createCuppingSession({
      sessionName,
      workOrderId: selectedWorkOrderId || undefined,
      batchNumber: 1,
      beanName,
      origin,
      roastDate: new Date().toISOString().split('T')[0],
      cupperName,
      fragranceScore: fragrance,
      flavorScore: flavor,
      aftertasteScore: aftertaste,
      acidityScore: acidity,
      bodyScore: body,
      balanceScore: balance,
      cleanCupScore: cleanCup,
      sweetnessScore: sweetness,
      uniformityScore: uniformity,
      overallScore: overall,
      defectsPenalty: defects,
      totalScaScore,
      tastingNotes: ['Bergamot', 'Jasmine', 'Cranberry', 'Sweet Cane Sugar'],
      moisturePercent: Number(moisturePercent),
      waterActivityAw: Number(waterActivityAw),
      agtronWhole: Number(agtronWhole),
      agtronGround: Number(agtronGround),
      status,
      notes: qcNotes,
    });

    setIsCuppingModalOpen(false);
  };

  // Metrics
  const avgScaScore =
    qcSessions.length > 0
      ? (qcSessions.reduce((acc, q) => acc + q.totalScaScore, 0) / qcSessions.length).toFixed(2)
      : '87.75';
  const approvedSpecialtyCount = qcSessions.filter(
    (q) => q.status === 'approved_specialty'
  ).length;

  const filteredQc = qcSessions.filter((qc) => {
    const matchesQuery =
      qc.sessionCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qc.sessionName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qc.beanName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      qc.cupperName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'all' || qc.status === statusFilter;
    return matchesQuery && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Sesi QC Cupping"
          value={`${qcSessions.length} Sesi`}
          subtitle="Protokol SCA 100-Point Standard"
          trend={{ value: 'Tervalidasi Q-Grader', isPositive: true }}
          icon={<Award className="w-5 h-5" />}
          color="amber"
        />
        <MetricCard
          title="Rata-rata Skor SCA"
          value={`SCA ${avgScaScore}`}
          subtitle="Specialty Grade Quality Level"
          trend={{ value: 'Target: ≥ 85.0', isPositive: true }}
          icon={<Sparkles className="w-5 h-5" />}
          color="purple"
        />
        <MetricCard
          title="Lolos Specialty Tier"
          value={`${approvedSpecialtyCount} Batch`}
          subtitle="100% Lolos Uji Cacat Fisik"
          trend={{ value: 'Zero Defect', isPositive: true }}
          icon={<CheckCircle2 className="w-5 h-5" />}
          color="emerald"
        />
        <MetricCard
          title="Kadar Air Biji Sangrai"
          value="1.8% aw 0.52"
          subtitle="Batas Aman Segar & Awet"
          trend={{ value: 'Optimal Freshness', isPositive: true }}
          icon={<Activity className="w-5 h-5" />}
          color="blue"
        />
      </div>

      {/* Odoo 19 Control Panel */}
      <OdooControlPanel
        breadcrumbs={[
          { label: 'Quality Control' },
          { label: 'SCA Cupping Sessions' },
        ]}
        primaryActionLabel="+ Sesi Cupping"
        onPrimaryAction={() => setIsCuppingModalOpen(true)}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        activeFilter={statusFilter}
        onFilterChange={setStatusFilter}
        filterOptions={[
          { id: 'all', label: 'Semua Status' },
          { id: 'approved_specialty', label: 'Specialty Grade (≥85)' },
          { id: 'approved_commercial', label: 'Commercial Grade (80-84)' },
          { id: 'quarantine', label: 'Karantina (<80)' },
        ]}
        viewMode={viewMode}
        onViewModeChange={setViewMode}
        recordCount={filteredQc.length}
      />

      {/* VIEW 1: KANBAN / CARDS VIEW */}
      {viewMode === 'kanban' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          {filteredQc.map((qc) => (
            <div
              key={qc.id}
              onClick={() => setDetailModalQC(qc)}
              className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer flex flex-col justify-between space-y-4 group"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="font-mono text-xs font-bold text-[#714B67] group-hover:underline">
                    {qc.sessionCode} • {qc.date}
                  </span>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-black border flex items-center gap-1 ${
                      qc.status === 'approved_specialty'
                        ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                        : qc.status === 'approved_commercial'
                        ? 'bg-blue-100 text-blue-900 border-blue-300'
                        : 'bg-rose-100 text-rose-900 border-rose-300'
                    }`}
                  >
                    <Award className="w-3.5 h-3.5" />
                    SCA {qc.totalScaScore} ({qc.status === 'approved_specialty' ? 'Specialty Grade' : 'Commercial'})
                  </span>
                </div>

                <h4 className="text-base font-bold text-stone-900">{qc.sessionName}</h4>
                <p className="text-xs text-stone-500 mt-0.5">
                  {qc.beanName} • Cupper: <strong>{qc.cupperName}</strong>
                </p>

                {/* 6-Core Scores Breakdown */}
                <div className="grid grid-cols-3 sm:grid-cols-6 gap-2 mt-4 bg-[#F8F9FA] p-3 rounded-2xl border border-stone-200/80 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Fragrance</span>
                    <strong className="text-stone-800 font-mono">{qc.fragranceScore}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Flavor</span>
                    <strong className="text-stone-800 font-mono">{qc.flavorScore}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Acidity</span>
                    <strong className="text-stone-800 font-mono">{qc.acidityScore}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Body</span>
                    <strong className="text-stone-800 font-mono">{qc.bodyScore}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Clean Cup</span>
                    <strong className="text-emerald-700 font-mono">{qc.cleanCupScore}</strong>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-400 block">Sweetness</span>
                    <strong className="text-amber-700 font-mono">{qc.sweetnessScore}</strong>
                  </div>
                </div>

                {/* Flavor tags */}
                <div className="flex flex-wrap gap-1 mt-3">
                  {qc.tastingNotes.map((note, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-[#714B67]/10 text-[#714B67] border border-[#714B67]/20"
                    >
                      {note}
                    </span>
                  ))}
                </div>

                {qc.notes && (
                  <p className="text-xs text-stone-600 mt-2 italic bg-stone-50 p-2 rounded-xl border border-stone-100">
                    "{qc.notes}"
                  </p>
                )}
              </div>

              {/* Physical QA Footnote */}
              <div className="pt-3 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
                <span>Agtron Whole #{qc.agtronWhole} / Ground #{qc.agtronGround}</span>
                <span className="text-[11px] font-bold text-emerald-700 flex items-center gap-1">
                  <FileCheck className="w-3.5 h-3.5" /> Sertifikat Rilis Valid
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* VIEW 2: TABLE VIEW */}
      {viewMode === 'table' && (
        <div className="bg-white rounded-3xl border border-stone-200/90 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#F8F9FA] text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3.5 px-4">No. Sesi</th>
                  <th className="py-3.5 px-4">Komoditas & Batch</th>
                  <th className="py-3.5 px-4">Evaluator Q-Grader</th>
                  <th className="py-3.5 px-4">Skor SCA</th>
                  <th className="py-3.5 px-4">Agtron (W/G)</th>
                  <th className="py-3.5 px-4">Status Kelayakan</th>
                  <th className="py-3.5 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredQc.map((qc) => (
                  <tr
                    key={qc.id}
                    onClick={() => setDetailModalQC(qc)}
                    className="hover:bg-stone-50/80 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4 font-mono font-bold text-[#714B67] group-hover:underline">
                      {qc.sessionCode}
                    </td>
                    <td className="py-3.5 px-4">
                      <div className="font-bold text-stone-900">{qc.beanName}</div>
                      <div className="text-[10px] text-stone-500">{qc.sessionName}</div>
                    </td>
                    <td className="py-3.5 px-4 font-medium text-stone-800">{qc.cupperName}</td>
                    <td className="py-3.5 px-4 font-mono font-black text-amber-800">
                      SCA {qc.totalScaScore}
                    </td>
                    <td className="py-3.5 px-4 font-mono text-stone-700">
                      #{qc.agtronWhole} / #{qc.agtronGround}
                    </td>
                    <td className="py-3.5 px-4">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          qc.status === 'approved_specialty'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {qc.status === 'approved_specialty' ? 'Specialty Grade' : 'Commercial Grade'}
                      </span>
                    </td>
                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setDetailModalQC(qc);
                        }}
                        className="px-2.5 py-1.5 bg-stone-100 hover:bg-stone-200 text-stone-700 rounded-xl font-bold text-[11px] transition-colors"
                      >
                        Lembar Cupping
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ODOO 19 QC DETAIL MODAL */}
      {detailModalQC && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-3xl max-w-3xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 animate-in fade-in zoom-in-95">
            <div className="bg-[#F8F9FA] px-6 py-4 border-b border-stone-200 flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-[#714B67] text-white">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-base font-black text-stone-900 font-mono">{detailModalQC.sessionCode}</h3>
                  <p className="text-[10px] text-stone-500">{detailModalQC.sessionName} • {detailModalQC.date}</p>
                </div>
              </div>

              <div className="flex items-center gap-3 w-full md:w-auto justify-between md:justify-end">
                <OdooStatusPipeline
                  stages={QC_PIPELINE_STAGES}
                  currentStageId="approved"
                />
                <button
                  onClick={() => setDetailModalQC(null)}
                  className="p-1.5 rounded-full hover:bg-stone-200 text-stone-500 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Smart Stat Buttons */}
            <div className="px-6 py-3 bg-white border-b border-stone-100 flex flex-wrap gap-2">
              <OdooSmartStatButton
                icon={<Award className="w-4 h-4" />}
                value={`SCA ${detailModalQC.totalScaScore}`}
                label="Skor Sensori"
                color="purple"
              />
              <OdooSmartStatButton
                icon={<Activity className="w-4 h-4" />}
                value={`#${detailModalQC.agtronGround}`}
                label="Agtron Ground"
                color="amber"
              />
              <OdooSmartStatButton
                icon={<Thermometer className="w-4 h-4" />}
                value={`${detailModalQC.moisturePercent}%`}
                label="Kadar Air Biji"
                color="blue"
              />
              <OdooSmartStatButton
                icon={<FileCheck className="w-4 h-4" />}
                value="Zero Defect"
                label="Status Fisik"
                color="emerald"
              />
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-6 text-xs max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-[#F8F9FA] p-4 rounded-2xl border border-stone-200/80 text-center">
                <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Fragrance / Aroma</span>
                  <span className="text-base font-bold font-mono text-[#714B67]">{detailModalQC.fragranceScore}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Flavor</span>
                  <span className="text-base font-bold font-mono text-[#714B67]">{detailModalQC.flavorScore}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Acidity</span>
                  <span className="text-base font-bold font-mono text-[#714B67]">{detailModalQC.acidityScore}</span>
                </div>
                <div className="p-2 bg-white rounded-xl border border-stone-200/60">
                  <span className="text-[10px] text-stone-400 block">Clean Cup</span>
                  <span className="text-base font-bold font-mono text-emerald-700">{detailModalQC.cleanCupScore}</span>
                </div>
              </div>

              {/* Odoo Chatter */}
              <div className="pt-4 border-t border-stone-200">
                <OdooChatter
                  documentTitle={`QC Cupping #${detailModalQC.sessionCode}`}
                  initialMessages={[
                    {
                      id: 'qc-c1',
                      author: detailModalQC.cupperName,
                      type: 'note',
                      content: `Hasil cupping memuaskan dengan total skor SCA ${detailModalQC.totalScaScore}. Profil rasa: ${detailModalQC.tastingNotes.join(', ')}. Catatan: ${detailModalQC.notes}`,
                      timestamp: detailModalQC.date,
                    },
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SCA 100-POINT DIGITAL CUPPING MODAL */}
      {isCuppingModalOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8 p-6 text-stone-900 max-h-[90vh] flex flex-col">
            <button
              onClick={() => setIsCuppingModalOpen(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-stone-100 hover:bg-stone-200 flex items-center justify-center text-stone-700 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center justify-between pb-4 mb-4 border-b border-stone-100 shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="p-2.5 rounded-xl bg-[#714B67]/10 text-[#714B67]">
                  <Award className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-900">Form Skor Cupping SCA 100-Point</h3>
                  <p className="text-xs text-stone-500">Evaluasi sensori dan instrumen fisik batch sangrai.</p>
                </div>
              </div>

              {/* Live Score Pill */}
              <div className="text-right bg-gradient-to-r from-[#714B67] to-[#5A3950] text-white px-4 py-2 rounded-2xl shadow-md">
                <span className="text-[10px] text-purple-200 uppercase tracking-widest block font-bold">Total Skor SCA:</span>
                <span className="text-xl font-black text-amber-300 font-mono">{totalScaScore} / 100</span>
              </div>
            </div>

            <form onSubmit={handleCreateCuppingSubmit} className="space-y-4 text-xs overflow-y-auto pr-1">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Sesi / Batch
                  </label>
                  <input
                    type="text"
                    required
                    value={sessionName}
                    onChange={(e) => setSessionName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>

                <div>
                  <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                    Nama Q-Grader / Evaluator
                  </label>
                  <input
                    type="text"
                    required
                    value={cupperName}
                    onChange={(e) => setCupperName(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 font-medium focus:ring-2 focus:ring-[#714B67]"
                  />
                </div>
              </div>

              {/* 10 Criteria Sliders */}
              <div className="bg-[#F8F9FA] p-4 rounded-2xl border border-stone-200/80 space-y-3">
                <h4 className="font-bold text-xs uppercase tracking-wider text-stone-800 flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#714B67]" /> Penilaian 10 Parameter SCA (Skala 6.00 - 10.00)
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>1. Fragrance / Dry Aroma:</span>
                      <strong className="text-[#714B67] font-mono">{fragrance}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={fragrance}
                      onChange={(e) => setFragrance(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>2. Flavor:</span>
                      <strong className="text-[#714B67] font-mono">{flavor}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={flavor}
                      onChange={(e) => setFlavor(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>3. Aftertaste:</span>
                      <strong className="text-[#714B67] font-mono">{aftertaste}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={aftertaste}
                      onChange={(e) => setAftertaste(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>4. Acidity:</span>
                      <strong className="text-[#714B67] font-mono">{acidity}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={acidity}
                      onChange={(e) => setAcidity(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>5. Body / Mouthfeel:</span>
                      <strong className="text-[#714B67] font-mono">{body}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={body}
                      onChange={(e) => setBody(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>6. Balance:</span>
                      <strong className="text-[#714B67] font-mono">{balance}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={balance}
                      onChange={(e) => setBalance(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>7. Overall Impression:</span>
                      <strong className="text-[#714B67] font-mono">{overall}</strong>
                    </div>
                    <input
                      type="range"
                      min="6.0"
                      max="10.0"
                      step="0.25"
                      value={overall}
                      onChange={(e) => setOverall(Number(e.target.value))}
                      className="w-full accent-[#714B67]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between font-semibold mb-1">
                      <span>8. Cacat / Defects (Penalty):</span>
                      <strong className="text-rose-600 font-mono">-{defects} pt</strong>
                    </div>
                    <input
                      type="number"
                      min="0"
                      max="10"
                      value={defects}
                      onChange={(e) => setDefects(Number(e.target.value))}
                      className="w-full px-2 py-1 bg-white border border-stone-200 rounded-lg text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Physical QA Testing */}
              <div className="grid grid-cols-4 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Kadar Air (%)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    value={moisturePercent}
                    onChange={(e) => setMoisturePercent(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Water Activity (aw)
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    value={waterActivityAw}
                    onChange={(e) => setWaterActivityAw(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Agtron Whole
                  </label>
                  <input
                    type="number"
                    value={agtronWhole}
                    onChange={(e) => setAgtronWhole(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-stone-600 mb-1">
                    Agtron Ground
                  </label>
                  <input
                    type="number"
                    value={agtronGround}
                    onChange={(e) => setAgtronGround(Number(e.target.value))}
                    className="w-full px-2.5 py-1.5 bg-stone-50 border border-stone-200 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase tracking-wider mb-1">
                  Catatan Sensori & Karakter Rasa
                </label>
                <textarea
                  rows={2}
                  value={qcNotes}
                  onChange={(e) => setQcNotes(e.target.value)}
                  className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-xl text-stone-900 focus:ring-2 focus:ring-[#714B67]"
                />
              </div>

              <div className="pt-3 flex justify-end gap-2 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setIsCuppingModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#714B67] hover:bg-[#5A3950] text-white font-bold transition-all shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Simpan & Terbitkan Sertifikat QC
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
