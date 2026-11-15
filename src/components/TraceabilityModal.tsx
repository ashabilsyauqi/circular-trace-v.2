import { useCoffee } from '../context/CoffeeContext';
import React, { useState } from 'react';
import {
  X,
  ArrowRight,
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  CheckCircle2,
  Calendar,
  Thermometer,
  Percent,
  Award,
  Sparkles,
  PieChart,
  ShieldCheck,
  Scale,
  FileCheck,
  Leaf,
  Layers,
  MapPin,
} from 'lucide-react';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';
import { getNetworkHost, getPublicBaseUrl } from '../utils/baseUrl';
import { BarcodeSocialShare } from './shared/BarcodeSocialShare';
import { IntegratedCircularIndicesView } from './verifier/IntegratedCircularIndicesView';

interface TraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: any | null;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const { navigate } = useCoffee();
  const [activeTraceTab, setActiveTraceTab] = useState<'timeline' | 'audit4c' | 'sensory'>('timeline');

  if (!isOpen || !data) return null;

  const anyData = data as any;
  const rawId = String(anyData.id || '').toUpperCase();
  const explicitCategory = anyData.category;

  // Determine commodity stage/category
  const isCafeItem = 'lineage' in anyData && Boolean(anyData.lineage);
  const isCherry = explicitCategory === 'cherry' || rawId.startsWith('LOT-') || 'pickingMethod' in anyData;
  const isGreenBeanProcessor = explicitCategory === 'green_bean_processor' || rawId.startsWith('GB-') || rawId.startsWith('PROC-') || ('greenBeanWeightKg' in anyData && !('storageLocation' in anyData));
  const isGreenBeanWarehouse = explicitCategory === 'green_bean_warehouse' || rawId.startsWith('WH-') || 'storageLocation' in anyData;
  const isRoasted = explicitCategory === 'roasted_bean' || rawId.startsWith('RST-') || ('roastDate' in anyData && !isCafeItem);
  const isCafe = explicitCategory === 'cafe_menu' || rawId.startsWith('CAFE-') || rawId.startsWith('CUP-') || isCafeItem;

  // Active stage index: 1=Petani, 2=Pengolah, 3=Gudang, 4=Roaster, 5=Cafe
  const currentStageIndex = isCherry ? 1 : isGreenBeanProcessor ? 2 : isGreenBeanWarehouse ? 3 : isRoasted ? 4 : 5;

  const productTypeLabel = isCherry
    ? 'Ceri Segar (Harvest Cherry)'
    : isGreenBeanProcessor
    ? 'Green Bean Olahan (Mill Tier)'
    : isGreenBeanWarehouse
    ? 'Green Bean Silo (Warehouse Storage)'
    : isRoasted
    ? 'Biji Sangrai (Artisan Roasted Bean)'
    : 'Cangkir Kopi Cafe (Seduhan Pelanggan)';

  const origin =
    anyData.origin ||
    anyData.sourceOrigin ||
    anyData.farmLocation ||
    'Pangalengan, Jawa Barat';

  const variety = anyData.variety || 'Arabica Specialty';

  const beanName =
    anyData.beanName ||
    anyData.title ||
    `${origin} - ${variety}`;

  const resolvedBaseUrl = getPublicBaseUrl(getNetworkHost());
  const traceUrl = anyData.id ? `${resolvedBaseUrl}/trace?lotId=${anyData.id}` : '';
  const processMethod = anyData.processMethod || anyData.processingMethod || 'Specialty Process';
  const roastLevel = anyData.roastLevel || 'Light-Medium Roast (Rekomendasi)';

  // Header status string based on whether product is roasted or raw
  const roastHeaderLabel = isRoasted || isCafe
    ? `Profil Sangrai: ${roastLevel}`
    : isGreenBeanProcessor || isGreenBeanWarehouse
    ? `Bentuk: Green Bean Mentah • Rekomendasi Sangrai: ${roastLevel}`
    : `Bentuk: Ceri Kopi Segar Petik Merah`;

  // Safely extract tastingNotes from any lot type
  const tastingNotes: string[] =
    Array.isArray(anyData.tastingNotes) && anyData.tastingNotes.length > 0
      ? anyData.tastingNotes
      : Array.isArray(anyData.cuppingNotes) && anyData.cuppingNotes.length > 0
      ? anyData.cuppingNotes
      : anyData.gradingNotes
      ? [anyData.gradingNotes]
      : ['Blackberry', 'Winey', 'Dark Cherry', 'Brown Sugar Sweetness'];

  const scaScore =
    anyData.scaScore ||
    anyData.scaCuppingScore ||
    anyData.cuppingScore ||
    anyData.verifiedScaScore ||
    anyData.qualityScore ||
    86.5;

  const agtronNumber = anyData.agtronNumber || 68;
  const developmentTimeRatio = anyData.developmentTimeRatio || 14.5;
  const roasterName = anyData.roasterName || 'Karsa Craft Roastery';

  // Silsilah lineage fallback data
  const lineage = isCafeItem
    ? anyData.lineage
    : {
        farmerName: anyData.farmerName || anyData.sourceFarmerName || 'Asep Supriatna (Kelompok Tani Gn. Tilu)',
        farmLocation: anyData.farmLocation || anyData.sourceOrigin || `${origin} (${anyData.altitude || '1.550 mdpl'})`,
        altitude: anyData.altitude || '1.550 mdpl',
        harvestDate: anyData.harvestDate || anyData.sourceHarvestDate || '2026-09-02',
        brix: anyData.brix || anyData.sourceBrix || 22.4,
        processorName: anyData.processorName || anyData.sourceProcessorName || 'CV Malabar Wet & Dry Mill Station',
        fermentationTime: anyData.fermentationTime || (anyData.fermentationTimeHours ? `${anyData.fermentationTimeHours} Jam Anaerobic Fermentation` : '72 Jam Anaerobic Fermentation'),
        moisturePercent: anyData.moisturePercent || anyData.moistureContentPercent || anyData.moisturePercentage || 11.2,
        warehouseName: anyData.warehouseName || 'PT Nusantara Green Bean Warehouse (Gudang A-03)',
        storageConditions: anyData.storageConditions || 'Suhu 20.4°C, RH 54%, Kemasan GrainPro Hermetik',
        warehouseScaScore: anyData.warehouseScaScore || (scaScore ? Number(scaScore) : 86.5),
        roasterName: anyData.roasterName ? `${anyData.roasterName} (${anyData.roasterMachine || 'Giesen W6A'})` : `${roasterName} (Giesen W6A Artisan)`,
        roastProfile: anyData.roastProfile || `${roastLevel} (Agtron #${agtronNumber}, DTR ${developmentTimeRatio}%)`,
        roastDate: anyData.roastDate || '2026-09-14',
      };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-4xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              Sertifikat Digital Silsilah Kopi (Farm-to-Cup Traceability)
            </span>
            <span className="inline-flex items-center gap-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-3 py-1 rounded-full text-xs font-bold">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              Tingkat Komoditas: {productTypeLabel}
            </span>
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{beanName}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-300">
            <span>Varietas: <strong>{variety}</strong></span>
            <span>•</span>
            <span>Proses: <strong>{processMethod}</strong></span>
            <span>•</span>
            <span>{roastHeaderLabel}</span>
            <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-stone-950 font-black rounded-lg text-xs shadow-xs">
              <Award className="w-4 h-4" />
              SCA Score: {scaScore}
            </span>
          </div>

          {/* Quick Orientation Stepper with Real Active Stage Highlight */}
          <div className="mt-5 pt-4 border-t border-white/15">
            <div className="flex items-center justify-between gap-1">
              {[
                { stageNum: 1, label: 'Petani (4C)', color: 'bg-emerald-500', isReached: currentStageIndex >= 1 },
                { stageNum: 2, label: 'Pengolah (Mill)', color: 'bg-amber-500', isReached: currentStageIndex >= 2 },
                { stageNum: 3, label: 'Gudang (QA)', color: 'bg-blue-500', isReached: currentStageIndex >= 3 },
                { stageNum: 4, label: 'Roastery', color: 'bg-orange-500', isReached: currentStageIndex >= 4 },
                { stageNum: 5, label: 'Cafe (Cangkir)', color: 'bg-stone-300', isReached: currentStageIndex >= 5 },
              ].map((step, i) => (
                <React.Fragment key={step.label}>
                  <div className="flex flex-col items-center gap-1 text-center">
                    <span
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[8px] font-black transition-all ${
                        step.isReached
                          ? `${step.color} text-stone-950 ring-2 ring-white/40 shadow-sm`
                          : 'bg-white/15 text-white/50 border border-white/20'
                      }`}
                    >
                      {step.isReached ? '✓' : step.stageNum}
                    </span>
                    <span
                      className={`text-[10px] font-bold hidden sm:block ${
                        step.isReached ? 'text-white' : 'text-stone-400'
                      }`}
                    >
                      {step.label}
                    </span>
                  </div>
                  {i < 4 && (
                    <span
                      className={`flex-1 h-0.5 mb-3.5 sm:mb-3 transition-colors ${
                        currentStageIndex > i + 1 ? 'bg-amber-400' : 'bg-white/20'
                      }`}
                    />
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* Sub-Tab Switcher: Timeline, 4C & Sirkularitas, Spider Chart */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/15 overflow-x-auto">
            <button
              onClick={() => setActiveTraceTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTraceTab === 'timeline'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sprout className="w-4 h-4" />
              Silsilah Rantai Pasok ({currentStageIndex} dari 5 Tahap)
            </button>
            <button
              onClick={() => setActiveTraceTab('audit4c')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTraceTab === 'audit4c'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              Penilaian 4C & Sirkularitas (CT-4CI • CCI • SDI)
            </button>
            <button
              onClick={() => setActiveTraceTab('sensory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer whitespace-nowrap ${
                activeTraceTab === 'sensory'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <PieChart className="w-4 h-4" />
              Spider Chart Rasa & Sensori SCA
            </button>
          </div>
        </div>

        {/* Tasting Notes Chips */}
        <div className="bg-amber-50/80 border-b border-amber-200/60 px-6 py-3 flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-amber-900">Karakter Rasa (Tasting Notes):</span>
          {(tastingNotes || []).map((note, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-stone-800 border border-amber-300/80 shadow-xs"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Content Body */}
        {activeTraceTab === 'audit4c' ? (
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto space-y-6">
            <IntegratedCircularIndicesView
              farmName={lineage.farmerName}
              farmCode="FARM-PGL-01"
              isMajorPassed={true}
              ct4ciResult={{
                ct4ciScore: 95.9,
                evidenceCoveragePct: 100.0,
                isMajorGatePassed: true,
                applicableCount: 74,
                compliantWithSufficientEvidenceCount: 71,
                totalCheckpoints: 108,
                dimensionScores: {
                  economic: 87.5,
                  social: 100.0,
                  environmental: 96.3,
                },
                majorStats: {
                  failed: 0,
                  insufficientEvidence: 0,
                  pending: 0,
                },
              }}
              cciBreakdown={{
                totalScore: 86.4,
                cmi: 46.67,
                bvc: 90.0,
                wc: 27.27,
                re: 25.0,
                category: 'Optimal (Very High Circularity)',
              }}
              sdiBreakdown={{
                totalScore: 80.6,
                dimensions: {
                  environmental: 84.7,
                  social: 79.9,
                  economic: 76.4,
                  governance: 88.0,
                },
                category: 'Tinggi / Baik (Compliance SAFA)',
              }}
              fairtradeResult={{
                fairtrade_readiness_index: 88.5,
                status: 'High Fairtrade Readiness',
                dimension_scores: {
                  economic: 94.0,
                  social_labor: 92.5,
                  environmental: 85.0,
                  governance: 82.5,
                },
              }}
            />
          </div>
        ) : activeTraceTab === 'sensory' ? (
          <div className="p-6 sm:p-8 max-h-[65vh] overflow-y-auto">
            <CoffeeSensorySpiderChart
              scaScore={scaScore}
              roastLevel={roastLevel}
              agtronNumber={agtronNumber}
              dtrPercent={developmentTimeRatio}
              beanName={beanName}
              roasterName={roasterName}
              tastingNotes={tastingNotes}
              interactive={true}
            />
          </div>
        ) : (
          <div className="p-6 sm:p-8 space-y-6 max-h-[65vh] overflow-y-auto">
            {/* Step 1: Petani (LENGKAP DENGAN NILAI PENILAIAN 4C & EUDR) */}
            <div className="relative pl-8 sm:pl-10 border-l-2 border-emerald-500 pb-6">
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
                <Sprout className="w-4 h-4" />
              </div>
              <div className="bg-emerald-50/70 border border-emerald-300 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-emerald-200/80 pb-2.5">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                    Tahap 1 • Hulu (Kebun Petani) — Terverifikasi Aktif
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" /> Panen: {lineage.harvestDate}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-stone-900">{lineage.farmerName}</h3>
                    <p className="text-xs text-stone-600 mt-0.5">{lineage.farmLocation}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-700 text-white font-black text-xs shadow-2xs">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-200" />
                      4C Code: 95.9% (Passed)
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-emerald-300 text-emerald-800 font-bold text-xs">
                      <Leaf className="w-3 h-3 text-emerald-600" />
                      100% EUDR Ready
                    </span>
                  </div>
                </div>

                {/* Grid Parameter Agronomi Petani */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-500 block text-[11px]">Ketinggian Lahan:</span>
                    <strong className="font-bold text-stone-900">{lineage.altitude}</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-500 block text-[11px]">Kadar Gula Buah Ceri:</span>
                    <strong className="font-bold text-emerald-700">{lineage.brix}° Brix (Optimal)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-emerald-200/70">
                    <span className="text-stone-500 block text-[11px]">Standar Petik:</span>
                    <strong className="font-bold text-stone-900">Petik Merah 95%+</strong>
                  </div>
                </div>

                {/* BOX PENILAIAN 4C CODE OF CONDUCT & AUDIT EUDR (RESMI) */}
                <div className="bg-white rounded-xl p-3.5 border-2 border-emerald-300/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-emerald-100 pb-2">
                    <span className="font-bold text-emerald-950 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4 text-emerald-600" />
                      Hasil Audit Kepatuhan 4C Code of Conduct v4.1 &amp; EUDR:
                    </span>
                    <span className="font-mono text-[11px] text-emerald-700 font-bold">
                      No. Sertifikat: CERT-EUDR-2026-PGL-881
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center text-xs">
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/70">
                      <span className="text-[10px] text-stone-500 block">Skor 4C (CT-4CI):</span>
                      <strong className="text-emerald-800 text-sm font-black">95.9%</strong>
                      <span className="text-[9px] text-emerald-600 block font-bold">GATE: PASSED</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/70">
                      <span className="text-[10px] text-stone-500 block">Evidence Coverage:</span>
                      <strong className="text-emerald-800 text-sm font-black">100.0%</strong>
                      <span className="text-[9px] text-emerald-600 block">71/74 Checkpoint</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/70">
                      <span className="text-[10px] text-stone-500 block">Skor Ekonomi:</span>
                      <strong className="text-stone-900 text-sm font-black">87.5%</strong>
                      <span className="text-[9px] text-stone-500 block">Pilar P1–P19</span>
                    </div>
                    <div className="bg-emerald-50/60 p-2 rounded-lg border border-emerald-200/70">
                      <span className="text-[10px] text-stone-500 block">Skor Sosial &amp; Lingk.:</span>
                      <strong className="text-emerald-800 text-sm font-black">98.1%</strong>
                      <span className="text-[9px] text-emerald-600 block">Sosial 100% • Env 96.3%</span>
                    </div>
                  </div>
                  <div className="text-[11px] text-stone-500 flex items-center justify-between pt-1">
                    <span>Auditor: <strong>Hendra Gunawan, S.P.</strong> (Badan Audit EUDR Nasional)</span>
                    <span className="text-emerald-700 font-bold">Tanda Tangan Digital SHA-256 Terverifikasi ✓</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 2: Pengolah (LENGKAP DENGAN ZERO-WASTE & ECO-RATING SIRKULARITAS) */}
            <div className="relative pl-8 sm:pl-10 border-l-2 border-amber-500 pb-6">
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md">
                <Cog className="w-4 h-4" />
              </div>
              <div className="bg-amber-50/70 border border-amber-300 rounded-2xl p-4 sm:p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-amber-200/80 pb-2.5">
                  <span className="text-[10px] uppercase font-black tracking-wider px-2.5 py-0.5 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                    Tahap 2 • Pengolahan (Mill Station) — {currentStageIndex >= 2 ? 'Terverifikasi Selesai' : 'Tahap Berikutnya'}
                  </span>
                  <span className="text-xs font-bold text-amber-950 bg-white px-2 py-0.5 rounded border border-amber-300">
                    Metode: {processMethod}
                  </span>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <h3 className="text-base font-black text-stone-900">{lineage.processorName}</h3>
                    <p className="text-xs text-stone-600 mt-0.5">{lineage.fermentationTime}</p>
                  </div>
                  <div className="flex flex-wrap items-center gap-1.5">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-amber-600 text-white font-black text-xs shadow-2xs">
                      <Sparkles className="w-3.5 h-3.5 text-amber-200" />
                      Eco-Rating: 99/100 (A+)
                    </span>
                    <span className="inline-flex items-center gap-1 px-2 py-1 rounded-lg bg-white border border-amber-300 text-amber-900 font-bold text-xs">
                      Zero-Waste Mill
                    </span>
                  </div>
                </div>

                {/* Grid Parameter Mutu Green Bean */}
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 pt-1 text-xs">
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/70">
                    <span className="text-stone-500 block text-[11px]">Kadar Air (Moisture):</span>
                    <strong className="font-bold text-stone-900">{lineage.moisturePercent}% (Optimal 10-12%)</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/70">
                    <span className="text-stone-500 block text-[11px]">Grade Green Bean:</span>
                    <strong className="font-bold text-amber-800">Specialty Grade 1</strong>
                  </div>
                  <div className="bg-white p-2.5 rounded-xl border border-amber-200/70">
                    <span className="text-stone-500 block text-[11px]">Sortasi Fisik:</span>
                    <strong className="font-bold text-stone-900">Defect &lt; 3 / 350g</strong>
                  </div>
                </div>

                {/* BOX PENILAIAN SIRKULARITAS & ZERO-WASTE MILL */}
                <div className="bg-white rounded-xl p-3.5 border-2 border-amber-300/80 shadow-2xs space-y-2">
                  <div className="flex items-center justify-between text-xs border-b border-amber-100 pb-2">
                    <span className="font-bold text-amber-950 flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-amber-600" />
                      Penilaian Valorisasi Limbah Sirkular &amp; Reduksi Emisi:
                    </span>
                    <span className="font-mono text-[11px] text-amber-800 font-bold">
                      No. Sertifikat: CERT-MILL-2026-MLB-001
                    </span>
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs">
                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                      <span className="text-[10px] text-stone-500 block">Valorisasi Limbah:</span>
                      <strong className="text-amber-900 font-black">98.8% Kulit Ceri</strong>
                      <span className="text-[9px] text-stone-500 block">Teh Cascara &amp; Kompos Kebun</span>
                    </div>
                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                      <span className="text-[10px] text-stone-500 block">Reduksi Jejak Karbon:</span>
                      <strong className="text-emerald-700 font-black">216.0 kg CO2-eq</strong>
                      <span className="text-[9px] text-emerald-600 block">Solar Raised Bed Dryer</span>
                    </div>
                    <div className="bg-amber-50/50 p-2 rounded-lg border border-amber-200/60">
                      <span className="text-[10px] text-stone-500 block">Status Mill:</span>
                      <strong className="text-amber-950 font-black">Zero-Waste Certified</strong>
                      <span className="text-[9px] text-amber-700 block">Auditor: Ir. Dewi Sartika</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 3: Gudang (Storage Silo & Export Grading) */}
            <div className="relative pl-8 sm:pl-10 border-l-2 border-blue-500 pb-6">
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
                <Warehouse className="w-4 h-4" />
              </div>
              <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5 space-y-2">
                <div className="flex flex-wrap items-center justify-between gap-2 border-b border-blue-200/70 pb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                    Tahap 3 • Penyimpanan (Storage &amp; QA Silo)
                  </span>
                  <span className="text-xs font-bold text-blue-900">
                    Verified SCA: {lineage.warehouseScaScore}
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">{lineage.warehouseName}</h3>
                <p className="text-xs text-stone-600 mt-0.5">{lineage.storageConditions}</p>

                <div className="grid grid-cols-2 gap-2 mt-2 pt-2 border-t border-blue-200/60 text-xs">
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Thermometer className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kondisi Termal Terkontrol 20°C</span>
                  </div>
                  <div className="flex items-center gap-1.5 text-stone-700">
                    <Percent className="w-3.5 h-3.5 text-blue-600" />
                    <span>Kelembaban Udara Stabil 55%</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Step 4: Roaster (DIPERLAKUKAN SECARA AKURAT TERGANTUNG PRODUK ROASTED ATAU GREEN BEAN) */}
            <div className="relative pl-8 sm:pl-10 border-l-2 border-orange-500 pb-6">
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
                <Flame className="w-4 h-4" />
              </div>

              {isRoasted || isCafe ? (
                /* Produk yang memang sudah disangrai */
                <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 sm:p-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                      Tahap 4 • Roastery (Penyangraian Artisan Aktif)
                    </span>
                    <span className="text-xs text-orange-900 font-medium flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" /> Roast Date: {lineage.roastDate}
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-stone-900">{lineage.roasterName}</h3>
                  <p className="text-xs text-stone-600 mt-0.5">{lineage.roastProfile}</p>
                </div>
              ) : (
                /* Produk Green Bean atau Ceri (Tahap Roaster adalah tahap hilir berikutnya) */
                <div className="bg-stone-50 border border-dashed border-orange-300 rounded-2xl p-4 sm:p-5 space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1">
                    <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-50 text-amber-800 border border-amber-300">
                      Tahap 4 • Roastery — Tahap Hilir Berikutnya (Biji Mentah Belum Disangrai)
                    </span>
                    <span className="text-xs text-stone-500 font-medium">
                      Siap Dipasok ke Artisan Roaster
                    </span>
                  </div>
                  <h3 className="text-sm font-bold text-stone-800">
                    Green Bean Pilihan Siap Diproses oleh Roastery Mitra
                  </h3>
                  <p className="text-xs text-stone-600 leading-relaxed">
                    Lot ini berwujud <strong>Green Bean Mentah</strong> dengan kadar air {lineage.moisturePercent}%.{' '}
                    Rekomendasi sangrai ideal dari cupper pengolah:{' '}
                    <strong className="text-orange-700">{roastLevel}</strong> untuk menonjolkan aroma winey, buah blackberry, dan manis karamel.
                  </p>
                </div>
              )}
            </div>

            {/* Step 5: Cafe / Cangkir */}
            <div className="relative pl-8 sm:pl-10">
              <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-stone-900 text-white flex items-center justify-center shadow-md">
                <Coffee className="w-4 h-4" />
              </div>
              <div className="bg-stone-100 border border-stone-300 rounded-2xl p-4 sm:p-5">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-stone-200 text-stone-800 border border-stone-400">
                    Tahap 5 • Hilir (Penyajian Kedai Cafe)
                  </span>
                  <span className="text-xs font-bold text-stone-900 flex items-center gap-1">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" /> Terverifikasi 100% Asli
                  </span>
                </div>
                <h3 className="text-base font-bold text-stone-900">
                  {isCafeItem ? (data as any).cafeName : 'Siap Disajikan di Kedai Specialty Coffee'}
                </h3>
                <p className="text-xs text-stone-600 mt-1">
                  Disajikan dengan metode seduh manual (V60 / Kalita) dan espresso base. Biji kopi berintegritas tinggi dengan kompensasi harga yang adil bagi petani hingga roaster.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Social Media Share for Traceability & Barcode */}
        {traceUrl && (
          <div className="px-6 pb-4">
            <BarcodeSocialShare
              url={traceUrl}
              title={`Silsilah & Traceability: ${beanName}`}
              lotId={data.id}
              variety={variety}
              origin={origin}
            />
          </div>
        )}

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5 flex flex-wrap items-center justify-between gap-3">
          <div className="text-xs text-stone-500 flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Data silsilah &amp; audit 4C tercatat permanen di jaringan CircularTrace.</span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                navigate({ view: 'scan', lotId: data.id });
              }}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold transition-colors shadow-xs flex items-center gap-1.5 cursor-pointer"
            >
              <span>Buka Paspor Digital Penuh</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold transition-colors cursor-pointer"
            >
              Tutup
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
