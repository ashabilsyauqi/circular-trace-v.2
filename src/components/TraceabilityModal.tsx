import React, { useState } from 'react';
import {
  X,
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
} from 'lucide-react';
import { RoastedBeanLot, CafeInventoryItem } from '../types/coffee';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';

interface TraceabilityModalProps {
  isOpen: boolean;
  onClose: () => void;
  data: RoastedBeanLot | CafeInventoryItem | null;
}

export const TraceabilityModal: React.FC<TraceabilityModalProps> = ({
  isOpen,
  onClose,
  data,
}) => {
  const [activeTraceTab, setActiveTraceTab] = useState<'timeline' | 'sensory'>('timeline');

  if (!isOpen || !data) return null;

  // Check whether it's CafeInventoryItem or RoastedBeanLot
  const isCafeItem = 'lineage' in data;
  const beanName = isCafeItem ? data.beanName : `${data.origin} - ${data.variety}`;
  const variety = data.variety;
  const processMethod = data.processMethod;
  const roastLevel = data.roastLevel;
  const tastingNotes = data.tastingNotes;
  const scaScore = isCafeItem ? data.scaScore : data.scaCuppingScore;
  const agtronNumber = (data as any).agtronNumber || 68;
  const developmentTimeRatio = (data as any).developmentTimeRatio || 14.5;
  const roasterName = (data as any).roasterName || 'Karsa Craft Roastery';

  // Silsilah lineage fallback data
  const lineage = isCafeItem
    ? data.lineage
    : {
        farmerName: data.farmerName || 'Kelompok Tani Mitra Unggulan',
        farmLocation: `${data.origin} (${data.altitude})`,
        altitude: data.altitude,
        harvestDate: '2026-09-08',
        brix: 21.8,
        processorName: 'CV Malabar Wet & Dry Mill Station',
        fermentationTime: '36 - 72 Jam Fermentasi Terkontrol',
        moisturePercent: 11.0,
        warehouseName: 'PT Nusantara Green Bean Warehouse (Gudang A-03)',
        storageConditions: 'Suhu 20.4°C, RH 54%, Kemasan GrainPro Hermetik',
        warehouseScaScore: 86.5,
        roasterName: `${roasterName} (${(data as any).roasterMachine || 'Giesen W6A'})`,
        roastProfile: `${roastLevel} (Agtron #${agtronNumber}, DTR ${developmentTimeRatio}%)`,
        roastDate: (data as any).roastDate || '2026-09-12',
      };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
      <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
        {/* Modal Header */}
        <div className="bg-linear-to-r from-stone-900 via-amber-950 to-stone-900 text-white p-6 sm:p-8 relative">
          <button
            onClick={onClose}
            className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-3">
            <Sparkles className="w-3.5 h-3.5" />
            Sertifikat Digital Silsilah Kopi (Farm-to-Cup Traceability)
          </div>

          <h2 className="text-2xl sm:text-3xl font-black tracking-tight">{beanName}</h2>
          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-stone-300">
            <span>Varietas: <strong>{variety}</strong></span>
            <span>•</span>
            <span>Proses: <strong>{processMethod}</strong></span>
            <span>•</span>
            <span>Profil Sangrai: <strong>{roastLevel}</strong></span>
            <span className="ml-auto inline-flex items-center gap-1.5 px-3 py-1 bg-amber-500 text-stone-950 font-black rounded-lg text-xs shadow-xs">
              <Award className="w-4 h-4" />
              SCA Score: {scaScore}
            </span>
          </div>

          {/* Quick Orientation Stepper (role colors) */}
          <div className="flex items-center gap-1 mt-5">
            {[
              { label: 'Petani', color: 'bg-emerald-500' },
              { label: 'Pengolah', color: 'bg-amber-500' },
              { label: 'Gudang', color: 'bg-blue-500' },
              { label: 'Roaster', color: 'bg-orange-500' },
              { label: 'Cafe', color: 'bg-stone-300' },
            ].map((step, i) => (
              <React.Fragment key={step.label}>
                <div className="flex flex-col items-center gap-1">
                  <span className={`w-2.5 h-2.5 rounded-full ${step.color}`} />
                  <span className="text-[9px] font-bold text-stone-300 hidden sm:block">{step.label}</span>
                </div>
                {i < 4 && <span className="flex-1 h-px bg-white/20 mb-3.5 sm:mb-3" />}
              </React.Fragment>
            ))}
          </div>

          {/* Sub-Tab Switcher */}
          <div className="flex items-center gap-2 mt-4 pt-4 border-t border-white/15">
            <button
              onClick={() => setActiveTraceTab('timeline')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
                activeTraceTab === 'timeline'
                  ? 'bg-amber-400 text-stone-950 shadow-md'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <Sprout className="w-4 h-4" />
              Silsilah Rantai Pasok (5 Tahap)
            </button>
            <button
              onClick={() => setActiveTraceTab('sensory')}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-2 ${
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
          {tastingNotes.map((note, i) => (
            <span
              key={i}
              className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-white text-stone-800 border border-amber-300/80 shadow-xs"
            >
              {note}
            </span>
          ))}
        </div>

        {/* Content Body */}
        {activeTraceTab === 'sensory' ? (
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
          {/* Step 1: Petani */}
          <div className="relative pl-8 sm:pl-10 border-l-2 border-emerald-500 pb-6">
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-emerald-600 text-white flex items-center justify-center shadow-md">
              <Sprout className="w-4 h-4" />
            </div>
            <div className="bg-emerald-50/70 border border-emerald-200 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 border border-emerald-300">
                  Tahap 1 • Hulu (Kebun Petani)
                </span>
                <span className="text-xs text-emerald-800 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Panen: {lineage.harvestDate}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">{lineage.farmerName}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{lineage.farmLocation}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-emerald-200/60 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Ketinggian:</span>
                  <span className="font-semibold text-stone-800">{lineage.altitude}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Kadar Gula (Brix):</span>
                  <span className="font-semibold text-emerald-700">{lineage.brix}° Brix (Sangat Manis)</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Standar Petik:</span>
                  <span className="font-semibold text-stone-800">Petik Merah 95%+</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 2: Pengolah */}
          <div className="relative pl-8 sm:pl-10 border-l-2 border-amber-500 pb-6">
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-amber-600 text-white flex items-center justify-center shadow-md">
              <Cog className="w-4 h-4" />
            </div>
            <div className="bg-amber-50/70 border border-amber-200 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-300">
                  Tahap 2 • Pengolahan (Mill Station)
                </span>
                <span className="text-xs font-semibold text-amber-900">
                  Metode: {processMethod}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">{lineage.processorName}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{lineage.fermentationTime}</p>

              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3 pt-3 border-t border-amber-200/60 text-xs">
                <div>
                  <span className="text-stone-500 block text-[11px]">Kadar Air (Moisture):</span>
                  <span className="font-semibold text-stone-800">{lineage.moisturePercent}% (Optimal)</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Grade Green Bean:</span>
                  <span className="font-semibold text-amber-800">Specialty Grade 1</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[11px]">Sortasi Fisik:</span>
                  <span className="font-semibold text-stone-800">Defect &lt; 3 / 350g</span>
                </div>
              </div>
            </div>
          </div>

          {/* Step 3: Gudang */}
          <div className="relative pl-8 sm:pl-10 border-l-2 border-blue-500 pb-6">
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-blue-600 text-white flex items-center justify-center shadow-md">
              <Warehouse className="w-4 h-4" />
            </div>
            <div className="bg-blue-50/70 border border-blue-200 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-blue-100 text-blue-800 border border-blue-300">
                  Tahap 3 • Penyimpanan (Storage & QA)
                </span>
                <span className="text-xs font-bold text-blue-900">
                  Verified SCA: {lineage.warehouseScaScore}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">{lineage.warehouseName}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{lineage.storageConditions}</p>

              <div className="grid grid-cols-2 gap-2 mt-3 pt-3 border-t border-blue-200/60 text-xs">
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

          {/* Step 4: Roaster */}
          <div className="relative pl-8 sm:pl-10 border-l-2 border-orange-500 pb-6">
            <div className="absolute -left-[17px] top-0 w-8 h-8 rounded-full bg-orange-600 text-white flex items-center justify-center shadow-md">
              <Flame className="w-4 h-4" />
            </div>
            <div className="bg-orange-50/70 border border-orange-200 rounded-2xl p-4 sm:p-5">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-2">
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 border border-orange-300">
                  Tahap 4 • Roastery (Penyangraian Artisan)
                </span>
                <span className="text-xs text-orange-900 font-medium flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5" /> Roast Date: {lineage.roastDate}
                </span>
              </div>
              <h3 className="text-base font-bold text-stone-900">{lineage.roasterName}</h3>
              <p className="text-xs text-stone-600 mt-0.5">{lineage.roastProfile}</p>
            </div>
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
                {isCafeItem ? data.cafeName : 'Siap Disajikan di Kedai Specialty Cafe'}
              </h3>
              <p className="text-xs text-stone-600 mt-1">
                Disajikan dengan metode seduh manual (V60 / Kalita) dan espresso base. Biji kopi berintegritas tinggi dengan kompensasi harga yang adil bagi petani hingga roaster.
              </p>
            </div>
          </div>
        </div>
        )}

        {/* Modal Footer */}
        <div className="bg-stone-50 border-t border-stone-200 p-4 sm:p-5 flex items-center justify-between">
          <div className="text-xs text-stone-500 flex items-center gap-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            Data silsilah tercatat permanen di jaringan rantai pasok sangrAI.
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-colors shadow-xs"
          >
            Tutup Silsilah
          </button>
        </div>
      </div>
    </div>
  );
};
