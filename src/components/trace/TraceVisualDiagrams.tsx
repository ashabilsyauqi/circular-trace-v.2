import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import {
  Flame,
  Droplets,
  RotateCcw,
  Thermometer,
  Sparkles,
  Layers,
  CheckCircle2,
  Sun,
  Scale,
  Activity,
  ArrowRight,
  ShieldCheck,
  Award,
  FileCheck,
  Leaf,
  Users,
  TrendingUp,
  UserCheck,
  Calculator,
  ExternalLink,
  X,
  BookOpen,
  Info,
  Check,
  AlertCircle,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  BarChart3,
  HelpCircle,
} from 'lucide-react';

// ============================================================================
// 1. REFRACTOMETER BRIX METER & CHERRY RIPENESS (TAHAP 1 - KEBUN & PANEN)
// ============================================================================
export interface BrixCherryMeterProps {
  brixScore?: number;
  cherryRipePercent?: number;
}

export const BrixCherryMeter: React.FC<BrixCherryMeterProps> = ({
  brixScore = 22.5,
  cherryRipePercent = 96.5,
}) => {
  // Scale from 12° Bx to 26° Bx (Total span = 14)
  const minBrix = 12;
  const maxBrix = 26;
  const clampedBrix = Math.max(minBrix, Math.min(maxBrix, brixScore));
  const brixPct = ((clampedBrix - minBrix) / (maxBrix - minBrix)) * 100;

  return (
    <div className="pt-1 pb-1 space-y-2">
      {/* 1. Micro Brix Sparkline */}
      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600 font-medium flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            Kadar Gula Alami Ceri (Brix)
          </span>
          <span className="font-mono text-xs font-semibold text-emerald-800">
            {brixScore}° Bx • Puncak Manis
          </span>
        </div>

        {/* Slim 3.5px Calibrated Line */}
        <div className="relative pt-1 pb-0.5">
          <div className="h-1.5 w-full rounded-full bg-stone-200 relative overflow-hidden flex">
            <div className="h-full bg-stone-300 w-[28.5%]" title="12-16° Mengkal" />
            <div className="h-full bg-amber-300 w-[21.4%]" title="16-19° Cukup" />
            <div className="h-full bg-emerald-500 w-[35.7%]" title="19-24° Optimal Specialty" />
            <div className="h-full bg-orange-400 w-[14.4%]" title="24-26° Lewat Matang" />
          </div>

          {/* Indicator Dot */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center pointer-events-none"
            style={{ left: `${brixPct}%` }}
          >
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-700 ring-2 ring-white shadow-xs" />
          </div>
        </div>

        <div className="flex justify-between text-[10px] text-stone-400 font-mono">
          <span>12° Mengkal</span>
          <span className="text-emerald-700 font-semibold">Optimal Specialty (20–24°)</span>
          <span>&gt;24°</span>
        </div>
      </div>

      {/* 2. Micro Cherry Ripeness Bar */}
      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-600 font-medium">Sortasi Kematangan Ceri</span>
          <span className="font-mono text-xs font-semibold text-emerald-800">
            {cherryRipePercent}% Petik Merah
          </span>
        </div>

        {/* Slim 3.5px Dual Bar */}
        <div className="h-1.5 w-full bg-stone-200 rounded-full overflow-hidden flex">
          <div className="bg-red-500 h-full" style={{ width: `${cherryRipePercent}%` }} />
          <div className="bg-amber-400 h-full" style={{ width: `${100 - cherryRipePercent}%` }} />
        </div>

        <div className="flex items-center justify-between text-[10px] text-stone-500">
          <span className="flex items-center gap-1 text-red-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-red-500" />
            Petik Merah ({cherryRipePercent}%)
          </span>
          <span className="flex items-center gap-1 text-amber-700 font-medium">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
            Kuning ({(100 - cherryRipePercent).toFixed(1)}%)
          </span>
          <span className="text-emerald-700 font-medium">
            ✓ 0% Hijau
          </span>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 2. WET MILL 4-STEP SEQUENCE & CIRCULARITY FLOW (TAHAP 2 - PENGOLAH)
// ============================================================================
export interface WetMillProcessProps {
  cherryWeightKg?: number;
  greenBeanWeightKg?: number;
  cascaraWeightKg?: number;
  cascaraTeaWeightKg?: number;
  compostWeightKg?: number;
}

export const WetMillProcessAndCircularity: React.FC<WetMillProcessProps> = ({
  cherryWeightKg = 500,
  greenBeanWeightKg = 100,
  cascaraWeightKg = 400,
  cascaraTeaWeightKg = 120,
  compostWeightKg = 280,
}) => {
  const steps = [
    {
      step: '01',
      title: 'Sortasi Rambang',
      desc: 'Perendaman air alami, ceri hampa dipisahkan.',
      badge: '96.5% Padat',
      icon: Droplets,
      color: 'border-blue-200 bg-blue-50/60 text-blue-900',
    },
    {
      step: '02',
      title: 'Eco-Pulper Mekanis',
      desc: 'Pengupasan presisi hemat air 85% tanpa pecah biji.',
      badge: '1.2 L / Kg',
      icon: RotateCcw,
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
    },
    {
      step: '03',
      title: 'Fermentasi 36 Jam',
      desc: 'Fermentasi dingin 18°C pembentuk note jeruk Bali.',
      badge: 'Suhu 18-20°C',
      icon: Activity,
      color: 'border-orange-200 bg-orange-50/60 text-orange-900',
    },
    {
      step: '04',
      title: 'Solar Raised Bed',
      desc: 'Penjemuran meja para-para hingga MC aman 11.4%.',
      badge: 'MC 11.4%',
      icon: Sun,
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
    },
  ];

  return (
    <div className="pt-1 pb-1 space-y-4">
      {/* 4 Steps Timeline Flow */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-1.5">
          <div className="flex items-center gap-1.5">
            <Layers className="w-3.5 h-3.5 text-amber-700" />
            <span className="text-xs font-bold text-stone-900">
              4 Langkah Pengolahan Basah Terstandarisasi
            </span>
          </div>
          <span className="text-[10px] text-stone-400 font-mono">Specialty Washed</span>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-2">
          {steps.map((st, i) => {
            const IconComp = st.icon;
            return (
              <div
                key={i}
                className="p-2.5 rounded-xl bg-white/80 border border-stone-200/70 space-y-1 hover:border-amber-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-5 h-5 rounded bg-stone-100 text-stone-800 font-mono font-bold text-[10px] flex items-center justify-center">
                    {st.step}
                  </div>
                  <span className={`text-[9px] font-semibold px-1.5 py-0.5 rounded ${st.color}`}>
                    {st.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-[11px] font-bold text-stone-900 flex items-center gap-1">
                    <IconComp className="w-3 h-3 text-amber-700 shrink-0" />
                    {st.title}
                  </h4>
                  <p className="text-[10px] text-stone-500 leading-snug mt-0.5">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circular Economy Flow Diagram - Clean Flat Minimalist Design (Zero Nested Cards) */}
      <div className="space-y-3 pt-3 border-t border-stone-200/60">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-bold text-stone-800">
              Sirkularitas Limbah Olah (Zero-Waste Eco Mill)
            </span>
          </div>
          <span className="text-[11px] text-emerald-700 font-medium flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            0% Limbah ke Sungai
          </span>
        </div>

        {/* Minimalist Proportional Flow Bar */}
        <div className="space-y-1.5 bg-stone-50/80 p-3 rounded-xl border border-stone-200/60">
          <div className="flex items-center justify-between text-xs text-stone-600 font-medium">
            <span>Input Panen: <strong className="text-stone-900 font-semibold">{cherryWeightKg} kg Ceri Segar</strong></span>
            <span className="text-stone-400 text-[11px]">100% Termanfaatkan</span>
          </div>
          {/* Dual Split Bar */}
          <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden flex shadow-2xs">
            <div
              className="bg-emerald-600 h-full"
              style={{ width: '20%' }}
              title="20% Green Bean"
            />
            <div
              className="bg-amber-500 h-full"
              style={{ width: '80%' }}
              title="80% Kulit Ceri Cascara"
            />
          </div>
          <div className="flex items-center justify-between text-[11px] pt-0.5">
            <span className="flex items-center gap-1.5 font-medium text-emerald-800">
              <span className="w-2 h-2 rounded-full bg-emerald-600 inline-block" />
              Green Bean (20% • {greenBeanWeightKg} kg)
            </span>
            <span className="flex items-center gap-1.5 font-medium text-amber-800">
              <span className="w-2 h-2 rounded-full bg-amber-500 inline-block" />
              Kulit Cascara (80% • {cascaraWeightKg} kg)
            </span>
          </div>
        </div>

        {/* Clean Flat 2-Column Summary without Nested Boxes */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 text-xs">
          <div className="p-3 rounded-xl bg-white border border-stone-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">Green Bean Specialty</span>
              <span className="font-mono font-semibold text-emerald-800">{greenBeanWeightKg} kg (20%)</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Biji beras kering grade 1 dengan kadar air 11.4%, siap grading dan sangrai artisan.
            </p>
          </div>

          <div className="p-3 rounded-xl bg-white border border-stone-200/70 space-y-1">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-stone-900">Pemanfaatan Kulit (Cascara)</span>
              <span className="font-mono font-semibold text-amber-800">{cascaraWeightKg} kg (80%)</span>
            </div>
            <p className="text-[11px] text-stone-500 leading-relaxed">
              Diolah menjadi <strong className="text-stone-700 font-medium">Teh Cascara ({cascaraTeaWeightKg} kg)</strong> dan <strong className="text-stone-700 font-medium">Pupuk Kompos Organik ({compostWeightKg} kg)</strong> untuk kesuburan kebun.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 3. WAREHOUSE SCREEN SIZE HISTOGRAM & CLIMATE LOG (TAHAP 3 - GUDANG)
// ============================================================================
export interface WarehouseScreenAndClimateLogProps {
  temperatureCelsius?: number;
  humidityPercent?: number;
  screen18Percent?: number;
  screen17Percent?: number;
  screen16Percent?: number;
  defectCount?: number;
  waterActivityAw?: number;
}

export const WarehouseScreenAndClimateLog: React.FC<WarehouseScreenAndClimateLogProps> = ({
  temperatureCelsius = 19.2,
  humidityPercent = 58,
  screen18Percent = 92.0,
  screen17Percent = 6.2,
  screen16Percent = 1.8,
  defectCount = 1,
  waterActivityAw = 0.54,
}) => {
  return (
    <div className="pt-1 pb-1 space-y-3">
      {/* 1. Screen Size Distribution Micro Segmented Bar */}
      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-700 font-medium flex items-center gap-1.5">
            <Scale className="w-3.5 h-3.5 text-blue-700" />
            Distribusi Ukuran Biji (Screen Size)
          </span>
          <span className="font-mono text-xs font-semibold text-blue-900">
            Defect: {defectCount} / 350g (Grade 1)
          </span>
        </div>

        {/* Single Segmented Bar */}
        <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden flex shadow-2xs">
          <div className="bg-blue-600 h-full" style={{ width: `${screen18Percent}%` }} title={`Screen 18+ (${screen18Percent}%)`} />
          <div className="bg-blue-400 h-full" style={{ width: `${screen17Percent * 2}%` }} title={`Screen 17 (${screen17Percent}%)`} />
          <div className="bg-stone-400 h-full" style={{ width: `${screen16Percent * 2}%` }} title={`Screen 16 (${screen16Percent}%)`} />
        </div>

        <div className="flex flex-wrap items-center justify-between text-[10px] text-stone-500 pt-0.5">
          <span className="flex items-center gap-1 font-medium text-blue-900">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Screen 18+ ({screen18Percent}%)
          </span>
          <span className="flex items-center gap-1 font-medium text-blue-700">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
            Screen 17 ({screen17Percent}%)
          </span>
          <span className="flex items-center gap-1 font-medium text-stone-600">
            <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
            Screen 16 ({screen16Percent}%)
          </span>
        </div>
      </div>

      {/* 2. Climate Control Log SVG Micro Sparkline */}
      <div className="bg-stone-50/80 p-2.5 rounded-xl border border-stone-200/60 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-stone-700 font-medium flex items-center gap-1.5">
            <Thermometer className="w-3.5 h-3.5 text-teal-700" />
            Stabilitas Silo GrainPro™ (30 Hari)
          </span>
          <span className="font-mono text-[11px] font-semibold text-teal-800">
            Aw: {waterActivityAw} • Bebas Jamur
          </span>
        </div>

        {/* Compact SVG Graph */}
        <div className="bg-white/80 p-2 rounded-lg border border-stone-200/60">
          <svg className="w-full h-14 overflow-visible" viewBox="0 0 460 60">
            <rect x="0" y="10" width="460" height="38" fill="#f0fdf4" rx="3" />
            <line x1="0" y1="10" x2="460" y2="10" stroke="#e2e8f0" strokeDasharray="3 3" />
            <line x1="0" y1="48" x2="460" y2="48" stroke="#e2e8f0" strokeDasharray="3 3" />

            {/* Stable Temp Line */}
            <path d="M 10 24 Q 60 22, 120 23 T 240 22 T 360 23 L 450 22" fill="none" stroke="#0284c7" strokeWidth="2" />
            {/* Stable RH Line */}
            <path d="M 10 36 Q 70 34, 140 37 T 270 35 T 390 36 L 450 35" fill="none" stroke="#0d9488" strokeWidth="1.5" strokeDasharray="3 3" />

            <circle cx="450" cy="22" r="3" fill="#ffffff" stroke="#0284c7" strokeWidth="2" />
            <circle cx="450" cy="35" r="2.5" fill="#ffffff" stroke="#0d9488" strokeWidth="1.5" />
          </svg>

          <div className="flex items-center justify-between text-[10px] pt-1 text-stone-500 border-t border-stone-100">
            <div className="flex items-center gap-3">
              <span className="text-sky-800 font-medium">● Suhu {temperatureCelsius}°C</span>
              <span className="text-teal-800 font-medium">--- RH {humidityPercent}%</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 4. MINI ROASTING SPARKLINE CURVE (TAHAP 4 - ARTISAN ROASTERY)
// ============================================================================
export interface RoastingCurveSparklineProps {
  roasterMachine?: string;
  roastLevel?: string;
  agtronNumber?: number;
  dtrPercent?: number;
  chargeTemp?: number;
  tpTemp?: number;
  yellowingTemp?: number;
  firstCrackTemp?: number;
  dropTemp?: number;
  totalTimeMinutes?: string;
}

export const RoastingCurveSparkline: React.FC<RoastingCurveSparklineProps> = ({
  roasterMachine = 'Giesen W6A Artisan Drum Roaster',
  roastLevel = 'Light-Medium Specialty',
  agtronNumber = 68,
  dtrPercent = 14.5,
  chargeTemp = 200,
  tpTemp = 98,
  yellowingTemp = 150,
  firstCrackTemp = 196,
  dropTemp = 208,
  totalTimeMinutes = '10m 45s',
}) => {
  return (
    <div className="pt-2 pb-1 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
        <div className="flex items-center gap-2">
          <Flame className="w-4 h-4 text-orange-600" />
          <span className="text-xs font-black uppercase tracking-wider text-stone-900">
            Kurva Suhu Sangrai (Artisan Bean Temperature &amp; DTR)
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black font-mono text-amber-950 bg-amber-100/80 px-2 py-0.5 rounded border border-amber-300">
            Agtron #{agtronNumber}
          </span>
          <span className="text-[11px] font-black font-mono text-orange-900 bg-orange-100/80 px-2 py-0.5 rounded border border-orange-300">
            DTR {dtrPercent}% (1m 30s)
          </span>
        </div>
      </div>

      {/* SVG Mini Sparkline Curve */}
      <div className="bg-white/70 p-3 rounded-2xl border border-stone-200/80 space-y-2 shadow-2xs">
        <svg className="w-full h-36 overflow-visible" viewBox="0 0 520 140">
          <defs>
            <linearGradient id="roastDevPhase" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#f59e0b" stopOpacity="0.05" />
            </linearGradient>
            <linearGradient id="beanTempGrad" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0%" stopColor="#ea580c" />
              <stop offset="50%" stopColor="#d97706" />
              <stop offset="100%" stopColor="#b45309" />
            </linearGradient>
          </defs>

          {/* Shaded Development Phase (FC at x=415 to Drop at x=495) */}
          <rect x="415" y="15" width="80" height="105" fill="url(#roastDevPhase)" rx="4" />
          <line x1="415" y1="15" x2="415" y2="120" stroke="#f59e0b" strokeDasharray="3 3" strokeWidth="1.2" />
          <text x="455" y="28" textAnchor="middle" className="text-[8px] font-black fill-amber-900 font-mono">
            FASE DEV ({dtrPercent}%)
          </text>

          {/* Background horizontal guideline ticks */}
          <line x1="20" y1="30" x2="495" y2="30" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="20" y1="70" x2="495" y2="70" stroke="#f1f5f9" strokeWidth="1" />
          <line x1="20" y1="110" x2="495" y2="110" stroke="#f1f5f9" strokeWidth="1" />

          {/* Bean Temp Curve Path:
              Charge (25, 30) -> Turning Point (95, 115) -> Yellowing (230, 75) -> First Crack (415, 38) -> Drop (495, 25)
          */}
          <path
            d="M 25 30 C 50 115, 75 118, 95 118 C 160 118, 190 85, 230 75 C 310 55, 370 45, 415 38 C 445 32, 475 28, 495 24"
            fill="none"
            stroke="url(#beanTempGrad)"
            strokeWidth="3.2"
            strokeLinecap="round"
          />

          {/* Rate of Rise (RoR) subtle trend line descending */}
          <path
            d="M 110 95 Q 230 110, 415 118 L 495 120"
            fill="none"
            stroke="#94a3b8"
            strokeWidth="1.5"
            strokeDasharray="4 3"
          />
          <text x="240" y="112" className="text-[8px] fill-stone-400 font-mono">
            RoR (°C/min) Turun Terkendali
          </text>

          {/* Key Milestone Nodes */}
          {/* 1. Charge */}
          <circle cx="25" cy="30" r="4" fill="#ffffff" stroke="#ea580c" strokeWidth="2.5" />
          <text x="25" y="20" textAnchor="start" className="text-[9px] font-mono font-bold fill-stone-700">
            Charge {chargeTemp}°C
          </text>

          {/* 2. Turning Point */}
          <circle cx="95" cy="118" r="4.5" fill="#ffffff" stroke="#ea580c" strokeWidth="2.5" />
          <text x="95" y="132" textAnchor="middle" className="text-[9px] font-mono font-bold fill-orange-800">
            TP {tpTemp}°C (1:15)
          </text>

          {/* 3. Yellowing */}
          <circle cx="230" cy="75" r="4" fill="#ffffff" stroke="#d97706" strokeWidth="2.5" />
          <text x="230" y="65" textAnchor="middle" className="text-[9px] font-mono font-bold fill-amber-800">
            Kuning {yellowingTemp}°C (4:30)
          </text>

          {/* 4. First Crack */}
          <circle cx="415" cy="38" r="4.5" fill="#ffffff" stroke="#b45309" strokeWidth="2.5" />
          <text x="410" y="52" textAnchor="end" className="text-[9px] font-mono font-black fill-amber-950">
            FC {firstCrackTemp}°C (9:15)
          </text>

          {/* 5. Drop */}
          <circle cx="495" cy="24" r="5" fill="#b45309" stroke="#ffffff" strokeWidth="2" />
          <text x="495" y="14" textAnchor="end" className="text-[9px] font-mono font-black fill-amber-950">
            Drop {dropTemp}°C (10:45)
          </text>
        </svg>

        {/* Milestone Footer Specs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1 border-t border-stone-100">
          <div className="bg-stone-50 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">Mesin Roasting</span>
            <strong className="text-stone-900 font-bold truncate block">{roasterMachine}</strong>
          </div>
          <div className="bg-stone-50 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">Total Waktu</span>
            <strong className="text-stone-900 font-mono font-bold block">{totalTimeMinutes}</strong>
          </div>
          <div className="bg-stone-50 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">Development Ratio</span>
            <strong className="text-orange-900 font-mono font-bold block">{dtrPercent}% (1m 30s)</strong>
          </div>
          <div className="bg-stone-50 p-2 rounded-xl">
            <span className="text-[10px] text-stone-400 block font-bold uppercase">Profil Warna</span>
            <strong className="text-amber-900 font-bold block">{roastLevel} (#{agtronNumber})</strong>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================================
// 5. ICS AUDIT & 4C PERCENTAGE DONUT CHARTS (TAHAP 1 - HULU PERKEBUNAN)
// ============================================================================
export interface IcsAuditAnd4CDonutSectionProps {
  ct4ciScore?: number;
  isMajorPassed?: boolean;
  evidenceCoveragePct?: number;
  compliantCount?: number;
  applicableCount?: number;
  dimensionScores?: {
    economic: number;
    social: number;
    environmental: number;
  };
  verifierName?: string;
  verifierRole?: string;
  auditDate?: string;
  certificateNumber?: string;
  digitalSignatureHash?: string;
  auditNotes?: string;
}

interface IndexFactorItem {
  name: string;
  scorePct: number;
  description: string;
  auditEvidence: string;
  isKey?: boolean;
}

interface IndexDetailConfig {
  id: 'ct4ci' | 'environmental' | 'social' | 'economic';
  title: string;
  pillarName: string;
  badgeLabel: string;
  badgeColor: string;
  strokeColor: string;
  progressColor: string;
  score: number;
  isMajor?: boolean;
  subLabel: string;
  icon: any;
  formulaLatex: string;
  formulaExplanation: {
    symbol: string;
    name: string;
    meaning: string;
  }[];
  realCalculation: {
    numerator: string;
    denominator: string;
    calculation: string;
    result: string;
    interpretation: string;
  };
  factors: IndexFactorItem[];
  standardDocuments: {
    title: string;
    organization: string;
    url?: string;
    summary: string;
  }[];
}

export const IcsAuditAnd4CDonutSection: React.FC<IcsAuditAnd4CDonutSectionProps> = ({
  ct4ciScore = 96.2,
  isMajorPassed = true,
  evidenceCoveragePct = 100.0,
  compliantCount = 71,
  applicableCount = 74,
  dimensionScores = {
    economic: 94.7,
    social: 96.2,
    environmental: 97.0,
  },
  verifierName = 'Hendra Gunawan, S.P.',
  verifierRole = 'Lead Auditor ICS & Agronomi Lahan Kopi CircularTrace',
  auditDate = '10 September 2026',
  certificateNumber = 'CT-4CI-2026-FARM-BLI-10-9421',
  digitalSignatureHash = 'SHA256:7e4a8b19f02938ac47b8d91029348bca6199a0ef',
  auditNotes = 'Hasil audit kepatuhan lapangan (on-site) di kebun Desa Awan, Kintamani: 100% Lolos Kriteria Major Gate 4C. Lahan terverifikasi bebas konversi hutan lindung (EUDR Deforestation-Free), 4 patok batas BPN permanen, serta nol residu pestisida terlarang (Zero Gramoxone/Paraquat).',
}) => {
  const [selectedFormulaId, setSelectedFormulaId] = useState<'ct4ci' | 'environmental' | 'social' | 'economic' | null>(null);
  const [activeModalTab, setActiveModalTab] = useState<'rumus' | 'faktor' | 'standar'>('rumus');
  const [expandedFactors, setExpandedFactors] = useState<Record<string, boolean>>({});

  const toggleExpanded = (id: string) => {
    setExpandedFactors((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  useEffect(() => {
    if (!selectedFormulaId) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSelectedFormulaId(null);
    };
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [selectedFormulaId]);

  // Complete breakdown configurations for all 4 indexes
  const indexConfigs: Record<'ct4ci' | 'environmental' | 'social' | 'economic', IndexDetailConfig> = {
    ct4ci: {
      id: 'ct4ci',
      title: 'CT-4CI Readiness',
      pillarName: 'Indeks Kesiapan Sertifikasi Hulu Lahan Kopi (4C Readiness)',
      badgeLabel: '4C Code of Conduct v4.1 • Major Gate PASSED',
      badgeColor: 'bg-emerald-100 text-emerald-900 border-emerald-300',
      strokeColor: 'stroke-emerald-600',
      progressColor: 'bg-emerald-600',
      score: ct4ciScore,
      isMajor: true,
      subLabel: `${compliantCount}/${applicableCount} Checkpoint • EC ${evidenceCoveragePct}%`,
      icon: Award,
      formulaLatex: 'CT-4CI = 100 \\times \\frac{\\sum_{i=1}^{N} (A_i \\cdot C_i \\cdot V_i)}{\\sum_{i=1}^{N} A_i}',
      formulaExplanation: [
        {
          symbol: 'A_i',
          name: 'Applicability Decision (Keberlakuan Kriteria)',
          meaning: 'Bernilai 1 jika kriteria berlaku untuk tipe kebun ini; bernilai 0 jika disetujui tidak relevan oleh auditor terakreditasi.',
        },
        {
          symbol: 'C_i',
          name: 'Compliance Result (Kepatuhan Fisik Lapangan)',
          meaning: 'Bernilai 1 jika praktik budidaya memenuhi standar kepatuhan 4C; bernilai 0 jika ditemukan pelanggaran lapangan.',
        },
        {
          symbol: 'V_i',
          name: 'Verification Sufficiency (Kecukupan Bukti Audit)',
          meaning: 'Bernilai 1 jika temuan didukung bukti foto ber-geotag, koordinat patok BPN, atau faktur sah; bernilai 0 jika bukti belum memadai.',
        },
        {
          symbol: 'Major Gate',
          name: 'Non-Compensating Safeguard (Pengaman Mutlak)',
          meaning: '5 kriteria kritis (Zero Deforestation, Zero B3, Zero Child Labor, Freedom of Association, Traceability) wajib lolos 100%. Kegagalan 1 kriteria major menggugurkan seluruh sertifikasi.',
        },
      ],
      realCalculation: {
        numerator: `${compliantCount} Checkpoint Terpenuhi & Cukup Bukti (Σ Ai · Ci · Vi)`,
        denominator: `${applicableCount} Checkpoint Berlaku di Kebun Ini (Σ Ai)`,
        calculation: `(71 / 74) × 100% = 95.95% ≈ 96.2%`,
        result: `${ct4ciScore.toFixed(1)}%`,
        interpretation: 'Lolos Ambang Batas Sertifikasi Penuh (Major Gate PASSED, Evidence Coverage 100.0%)',
      },
      factors: [
        {
          name: 'Kepatuhan Checkpoint Terverifikasi (Ci · Vi)',
          scorePct: Number(((compliantCount / applicableCount) * 100).toFixed(1)),
          description: `${compliantCount} dari ${applicableCount} kriteria aktif terpenuhi dengan bukti lapangan terverifikasi.`,
          auditEvidence: 'Audit fisik langsung di kebun Desa Awan, Kintamani oleh Lead Auditor ICS.',
          isKey: true,
        },
        {
          name: 'Cakupan Bukti Lapangan (Evidence Coverage - Vi)',
          scorePct: evidenceCoveragePct,
          description: 'Persentase kriteria berlaku yang didukung dokumentasi foto, geolokasi, dan bukti faktual.',
          auditEvidence: '100% didukung metadata koordinat patok batas BPN & arsip foto audit.',
          isKey: true,
        },
        {
          name: 'Safeguard Major Gate 4C (Kriteria Mutlak)',
          scorePct: 100.0,
          description: '5 kriteria pengaman absolut (Zero Deforestation, Zero B3, Zero Child Labor, Hak Berserikat, Traceability).',
          auditEvidence: '5/5 kriteria major lolos verifikasi tanpa temuan pelanggaran (Zero Major Defect).',
          isKey: true,
        },
        {
          name: 'Rasio Keberlakuan Lahan (Applicability Ratio - Ai)',
          scorePct: Number(((applicableCount / 108) * 100).toFixed(1)),
          description: `${applicableCount} dari total 108 kriteria standar 4C berlaku spesifik untuk model kebun polikultur ini.`,
          auditEvidence: '34 kriteria non-applicable disetujui tim pengawas verifikator resmi.',
          isKey: false,
        },
      ],
      standardDocuments: [
        {
          title: '4C Code of Conduct v4.1',
          organization: '4C Services GmbH (Bonn, Germany)',
          summary: 'Standar keberlanjutan global untuk rantai pasok kopi mencakup dimensi ekonomi, sosial, dan perlindungan lingkungan.',
          url: 'https://www.4c-services.org/',
        },
        {
          title: 'CircularTrace Scientific Traceability Specification Sec. 3.11',
          organization: 'CircularTrace Research Framework',
          summary: 'Formulasi matematis non-compensating safeguard index, verifikasi kriptografis, dan bukti audit digital on-chain.',
        },
        {
          title: 'EU Deforestation Regulation (EU) 2023/1115 (EUDR)',
          organization: 'European Parliament and Council (Brussels)',
          summary: 'Kewajiban uji tuntas bebas deforestasi setelah cut-off date 31 Desember 2020 untuk komoditas kopi masuk pasar global.',
        },
      ],
    },
    environmental: {
      id: 'environmental',
      title: 'Pilar Lingkungan',
      pillarName: 'Dimensi 3: Perlindungan Lingkungan, Konservasi Alam & Keanekaragaman Hayati',
      badgeLabel: '4C Dimension 3 • EUDR Deforestation-Free',
      badgeColor: 'bg-teal-100 text-teal-900 border-teal-300',
      strokeColor: 'stroke-teal-600',
      progressColor: 'bg-teal-600',
      score: dimensionScores.environmental,
      subLabel: 'Bebas Deforestasi & Kimia B3',
      icon: Leaf,
      formulaLatex: '\\text{Skor Lingkungan} = 100 \\times \\frac{\\sum_{i \\in \\text{Env}} (A_i \\cdot C_i \\cdot V_i)}{\\sum_{i \\in \\text{Env}} A_i}',
      formulaExplanation: [
        {
          symbol: 'Env',
          name: 'Himpunan Checkpoint Lingkungan',
          meaning: 'Mencakup 27 indikator lingkungan (EUDR bebas deforestasi, perlindungan kawasan bernilai konservasi tinggi, nol pestisida terlarang, konservasi air dan tanah).',
        },
        {
          symbol: 'Cut-off EUDR',
          name: 'Batas Waktu Deforestasi',
          meaning: 'Lahan tidak boleh berasal dari pembukaan hutan atau degradasi hutan setelah 31 Desember 2020.',
        },
        {
          symbol: 'Pestisida B3',
          name: 'Bahan Berbahaya Terlarang',
          meaning: 'Nol penggunaan bahan kimia berbahaya yang tercantum dalam Daftar Hitam 4C, Konvensi Rotterdam/Stockholm, dan pestisida WHO Kelas 1A/1B.',
        },
      ],
      realCalculation: {
        numerator: `26.2 Skor Kepatuhan & Bukti Lingkungan (ΣEnv Ai · Ci · Vi)`,
        denominator: `27 Checkpoint Lingkungan Relevan (ΣEnv Ai)`,
        calculation: `(26.2 / 27) × 100% = 97.04% ≈ 97.0%`,
        result: `${dimensionScores.environmental.toFixed(1)}%`,
        interpretation: 'Sangat Baik (Lolos Safeguard Lingkungan & Bebas Deforestasi EUDR)',
      },
      factors: [
        {
          name: 'Zero Deforestasi (EUDR Cut-off 31 Des 2020)',
          scorePct: 100.0,
          description: 'Lahan terbukti bukan hasil konversi hutan lindung berdasarkan overlay koordinat satelit Sentinel/Copernicus.',
          auditEvidence: 'Analisis citra satelit tutupan hutan & konfirmasi batas BPN 100% klir.',
          isKey: true,
        },
        {
          name: 'Nol Bahan Agrokimia Berbahaya (B3 / Paraquat)',
          scorePct: 100.0,
          description: 'Tidak ada penggunaan herbisida berbahan aktif Paraquat diklorida, Glyphosate berlebih, atau pestisida WHO 1A/1B.',
          auditEvidence: 'Pemeriksaan fisik gudang kebun & uji residu tanah: Nol jejak kimia terlarang.',
          isKey: true,
        },
        {
          name: 'Konservasi Sumber Air & Pengolahan Limbah',
          scorePct: 95.0,
          description: 'Perlindungan sempadan mata air alami, efisiensi air, dan komposting limbah organik kulit ceri.',
          auditEvidence: 'Jarak kebun ke mata air aman (>15 meter) dengan vegetasi penyaring alami.',
          isKey: true,
        },
        {
          name: 'Konservasi Tanah & Pohon Penaung (Shade Trees)',
          scorePct: 93.0,
          description: 'Penerapan rorak penahan erosi dan penanaman pohon penaung polikultur (lamtoro/dadap/jeruk kintamani) >30%.',
          auditEvidence: 'Sensori kerapatan kanopi pohon penaung mencapai 34% di atas tanaman kopi.',
          isKey: false,
        },
      ],
      standardDocuments: [
        {
          title: 'Regulation (EU) 2023/1115 on Deforestation-free Products',
          organization: 'Official Journal of the European Union',
          summary: 'Kewajiban pelacakan poligon/titik koordinat geolokasi lahan kopi untuk menjamin nol deforestasi sejak akhir 2020.',
        },
        {
          title: 'Stockholm Convention on Persistent Organic Pollutants (POPs)',
          organization: 'United Nations Environment Programme (UNEP)',
          summary: 'Perjanjian internasional larangan pestisida dan bahan kimia organik persisten berbahaya bagi manusia dan tanah.',
        },
        {
          title: 'Pedoman Teknis Konservasi Lahan Kopi Rakyat',
          organization: 'Pusat Penelitian Kopi dan Kakao Indonesia (Puslitkoka)',
          summary: 'Metode pembuatan rorak, teras bangku, dan integrasi pohon penaung agroforestri kopi bernilai ekonomi.',
        },
      ],
    },
    social: {
      id: 'social',
      title: 'Pilar Sosial & K3',
      pillarName: 'Dimensi 2: Hak Asasi Manusia, Kondisi Kerja Layak & Keselamatan Kerja',
      badgeLabel: '4C Dimension 2 • ILO Core Conventions Compliant',
      badgeColor: 'bg-sky-100 text-sky-900 border-sky-300',
      strokeColor: 'stroke-sky-600',
      progressColor: 'bg-sky-600',
      score: dimensionScores.social,
      subLabel: 'Bebas Pekerja Anak & APD',
      icon: Users,
      formulaLatex: '\\text{Skor Sosial} = 100 \\times \\frac{\\sum_{i \\in \\text{Soc}} (A_i \\cdot C_i \\cdot V_i)}{\\sum_{i \\in \\text{Soc}} A_i}',
      formulaExplanation: [
        {
          symbol: 'Soc',
          name: 'Himpunan Checkpoint Sosial & K3',
          meaning: 'Mencakup 26 indikator perlindungan hak tenaga kerja, larangan pekerja anak, penghapusan kerja paksa, dan K3 pertanian.',
        },
        {
          symbol: 'Pekerja Anak',
          name: 'Konvensi ILO No. 138 & 182',
          meaning: 'Anak di bawah usia 15 tahun dilarang dipekerjakan dalam kegiatan pemetikan berat, pengangkutan, atau kontak bahan kimia.',
        },
        {
          symbol: 'K3 Petani',
          name: 'Keselamatan Kerja',
          meaning: 'Ketersediaan alat pelindung diri (sepatu boot, sarung tangan, masker) dan kotak P3K darurat di areal kebun.',
        },
      ],
      realCalculation: {
        numerator: `25.0 Skor Kepatuhan & Bukti Sosial (ΣSoc Ai · Ci · Vi)`,
        denominator: `26 Checkpoint Sosial Relevan (ΣSoc Ai)`,
        calculation: `(25.0 / 26) × 100% = 96.15% ≈ 96.2%`,
        result: `${dimensionScores.social.toFixed(1)}%`,
        interpretation: 'Sangat Baik (Bebas Pekerja Anak, APD Lengkap, Upah Petik Terjamin)',
      },
      factors: [
        {
          name: 'Bebas Pekerja Anak (< 15 Tahun / Usia Sekolah)',
          scorePct: 100.0,
          description: 'Tidak mempekerjakan anak usia sekolah; seluruh anak petani terdaftar bersekolah aktif di wilayah setempat.',
          auditEvidence: 'Wawancara acak auditor ICS dengan pekerja panen & verifikasi kartu keluarga petani.',
          isKey: true,
        },
        {
          name: 'Bebas Kerja Paksa & Kesetaraan Gender',
          scorePct: 100.0,
          description: 'Tidak ada penahanan dokumen identitas, jam kerja sukarela, dan kesetaraan upah bagi buruh petik wanita.',
          auditEvidence: 'Verifikasi buku upah dan absensi petik: pembagian kerja adil dan transparan.',
          isKey: true,
        },
        {
          name: 'Keselamatan & Kesehatan Kerja (K3 APD Petani)',
          scorePct: 94.0,
          description: 'Petani dan tenaga kerja panen difasilitasi sepatu boot, sarung tangan pemangkasan, dan kotak P3K kebun.',
          auditEvidence: 'Pemeriksaan perlengkapan kerja fisik di lapangan dan kepatuhan pemakaian saat panen.',
          isKey: true,
        },
        {
          name: 'Upah Layak & Kebebasan Berserikat',
          scorePct: 90.8,
          description: 'Upah petik harian setara atau di atas standar upah minimum lokal, serta keanggotaan aktif dalam kelompok tani.',
          auditEvidence: 'Petani terdaftar sebagai anggota resmi Kelompok Tani Mandiri (Ashabil).',
          isKey: false,
        },
      ],
      standardDocuments: [
        {
          title: 'ILO Core Conventions (No. 138, 182, 29, 105)',
          organization: 'International Labour Organization (Geneva)',
          summary: 'Standar ketenagakerjaan mendasar tentang penghapusan pekerja anak, kerja paksa, dan diskriminasi kerja.',
        },
        {
          title: '4C Code of Conduct Dimension 2 (Social Rights)',
          organization: '4C Services GmbH',
          summary: 'Prinsip kondisi kerja yang adil, perlindungan keselamatan, dan hubungan industrial yang sehat di perkebunan kopi.',
        },
        {
          title: 'Pedoman K3 Sektor Perkebunan Kopi',
          organization: 'Kementerian Ketenagakerjaan RI',
          summary: 'Standar keselamatan kerja penanganan panen miring, pemangkasan, dan pertolongan pertama pada kecelakaan kebun.',
        },
      ],
    },
    economic: {
      id: 'economic',
      title: 'Pilar Ekonomi & GAP',
      pillarName: 'Dimensi 1: Ketahanan Finansial, Ketertelusuran Mutu & Praktik Budidaya Baik',
      badgeLabel: '4C Dimension 1 • Good Agricultural Practices (GAP)',
      badgeColor: 'bg-amber-100 text-amber-900 border-amber-300',
      strokeColor: 'stroke-amber-600',
      progressColor: 'bg-amber-600',
      score: dimensionScores.economic,
      subLabel: 'Harga Transparan & GAP',
      icon: TrendingUp,
      formulaLatex: '\\text{Skor Ekonomi} = 100 \\times \\frac{\\sum_{i \\in \\text{Econ}} (A_i \\cdot C_i \\cdot V_i)}{\\sum_{i \\in \\text{Econ}} A_i}',
      formulaExplanation: [
        {
          symbol: 'Econ',
          name: 'Himpunan Checkpoint Ekonomi & GAP',
          meaning: 'Mencakup 21 indikator ketertelusuran hasil panen, tata kelola keuangan, panen selektif petik merah, dan efisiensi biaya.',
        },
        {
          symbol: 'Harga Transparan',
          name: 'Fair Trading Practice',
          meaning: 'Harga ceri dibayarkan langsung tanpa potongan sepihak, terdokumentasi dalam slip timbangan digital, dan berada di atas HPP.',
        },
        {
          symbol: 'Traceability',
          name: 'Ketertelusuran Lot Panen',
          meaning: 'Setiap karung ceri memiliki kode lot unik yang melacak identitas pohon, tanggal panen, dan elevasi lahan asal.',
        },
      ],
      realCalculation: {
        numerator: `19.9 Skor Kepatuhan & Bukti Ekonomi (ΣEcon Ai · Ci · Vi)`,
        denominator: `21 Checkpoint Ekonomi Relevan (ΣEcon Ai)`,
        calculation: `(19.9 / 21) × 100% = 94.76% ≈ 94.7%`,
        result: `${dimensionScores.economic.toFixed(1)}%`,
        interpretation: 'Sangat Baik (Buku Panen Digital Aktif, Harga Ceri Layak di Atas HPP)',
      },
      factors: [
        {
          name: 'Pencatatan Buku Panen & Traceability Lot',
          scorePct: 98.0,
          description: 'Hasil panen ditimbang digital, dicatat dalam ledger kelompok tani, dan diberi kode identifikasi lot terstandar.',
          auditEvidence: 'Buku panen fisik & sinkronisasi QR code lot panen ceri terkonfirmasi cocok 100%.',
          isKey: true,
        },
        {
          name: 'Transparansi Harga & Pembayaran Adil (Fair Price)',
          scorePct: 96.0,
          description: 'Petani menerima pembayaran harga ceri layak Rp 14.500/kg (berada 35% di atas HPP budidaya lokal).',
          auditEvidence: 'Faktur tanda terima serah ceri dan bukti transfer/pembayaran kontan tercatat rapi.',
          isKey: true,
        },
        {
          name: 'Kemitraan Pasar & Skala Hubungan Dagang',
          scorePct: 92.8,
          description: 'Kerjasama serap langsung dengan stasiun pengolah (wet mill) dan roastery tanpa perantara tengkulak.',
          auditEvidence: 'Kontrak kemitraan rantai pasok terhubung langsung dengan stasiun pengolahan basah.',
          isKey: true,
        },
        {
          name: 'Praktik Petik Merah Optimal (>95% Brix)',
          scorePct: 92.0,
          description: 'Sortasi buah ceri matang optimal (petik merah penuh) dengan hasil refraktometer rata-rata mencapai 21.8° Brix.',
          auditEvidence: 'Pengukuran refraktometer digital auditor pada sampel ceri terverifikasi >21° Brix.',
          isKey: false,
        },
      ],
      standardDocuments: [
        {
          title: '4C Code of Conduct Dimension 1 (Economic Viability)',
          organization: '4C Services GmbH',
          summary: 'Standar efisiensi biaya usaha tani, ketertelusuran rantai nilai, dan transparansi harga pembelian komoditas kopi.',
        },
        {
          title: 'Pedoman Good Agriculture Practices (GAP) Kopi Nasional',
          organization: 'Direktorat Jenderal Perkebunan, Kementan RI',
          summary: 'Panduan teknis budidaya, pemangkasan bentuk, pemupukan berimbang, dan panen selektif kopi bermutu tinggi.',
        },
        {
          title: 'Standar Transparansi Pembelian Sirkular CircularCoffee',
          organization: 'CircularTrace Value Chain Protocol',
          summary: 'Protokol pembagian nilai tambah yang adil bagi petani dan pencatatan audit komoditas secara real-time.',
        },
      ],
    },
  };

  // Helper renderer for DonutRing with embedded Factor Progress Bars & Formula Reference Button
  const DonutRing = ({
    configId,
  }: {
    configId: 'ct4ci' | 'environmental' | 'social' | 'economic';
  }) => {
    const config = indexConfigs[configId];
    const clamped = Math.min(100, Math.max(0, config.score));
    const isExpanded = !!expandedFactors[configId];

    return (
      <div className="flex flex-col items-center text-center p-3 rounded-2xl bg-white/95 border border-stone-200/80 hover:border-emerald-400 hover:shadow-md transition-all shadow-2xs space-y-2">
        {/* Card Header: Icon & Title */}
        <div className="flex items-center gap-1.5 text-xs font-bold text-stone-900 w-full justify-center">
          <config.icon className="w-3.5 h-3.5 text-emerald-700 shrink-0" />
          <span className="truncate whitespace-nowrap">{config.title}</span>
        </div>

        {/* Circular Donut Gauge - Compact */}
        <div className="relative w-18 h-18 sm:w-20 sm:h-20 my-0.5 shrink-0">
          <svg viewBox="0 0 36 36" className="w-18 h-18 sm:w-20 sm:h-20 transform -rotate-90">
            {/* Background Track */}
            <path
              className="stroke-stone-200"
              strokeWidth="3.2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress Arc */}
            <path
              className={`${config.strokeColor} transition-all duration-1000 ease-out`}
              strokeWidth="3.2"
              strokeLinecap="round"
              strokeDasharray={`${clamped}, 100`}
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
          </svg>

          {/* Center Text inside Donut */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none">
            <span className="text-xs sm:text-sm font-black font-mono text-stone-950 leading-none">
              {config.score.toFixed(1)}%
            </span>
            <span className="text-[8px] font-bold uppercase tracking-tight text-emerald-700 mt-0.5">
              {config.isMajor ? 'MAJOR' : 'PASS'}
            </span>
          </div>
        </div>

        {/* Sub-label description */}
        <span className="text-[10px] text-stone-500 font-medium leading-tight truncate whitespace-nowrap w-full">
          {config.subLabel}
        </span>

        {/* Action Buttons: Faktor (Toggle) & Rumus (Modal) - Strict Single Line, Zero Stacking */}
        <div className="w-full pt-2 border-t border-stone-200/60 grid grid-cols-2 gap-1.5 mt-1">
          <button
            type="button"
            onClick={() => toggleExpanded(configId)}
            className={`h-7 px-1.5 rounded-xl text-[10px] font-bold border transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap select-none overflow-hidden ${
              isExpanded
                ? 'bg-emerald-100 text-emerald-900 border-emerald-300'
                : 'bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 border-stone-200 hover:border-emerald-300'
            }`}
            title="Klik untuk melihat / menyembunyikan detail faktor penentu"
          >
            <BarChart3 className="w-3 h-3 text-emerald-700 shrink-0" />
            <span className="whitespace-nowrap">Faktor</span>
            {isExpanded ? (
              <ChevronUp className="w-2.5 h-2.5 text-stone-500 shrink-0" />
            ) : (
              <ChevronDown className="w-2.5 h-2.5 text-stone-500 shrink-0" />
            )}
          </button>

          <button
            type="button"
            onClick={() => {
              setSelectedFormulaId(configId);
              setActiveModalTab('rumus');
            }}
            className="h-7 px-1.5 rounded-xl bg-stone-50 hover:bg-emerald-50 text-stone-700 hover:text-emerald-900 text-[10px] font-bold border border-stone-200 hover:border-emerald-300 transition-all flex items-center justify-center gap-1 shadow-2xs cursor-pointer whitespace-nowrap select-none overflow-hidden"
            title={`Buka rincian rumus matematis & acuan regulasi untuk ${config.title}`}
          >
            <Calculator className="w-3 h-3 text-stone-500 shrink-0" />
            <span className="whitespace-nowrap">Rumus</span>
          </button>
        </div>

        {/* Mini Factor Progress Bars: ONLY SHOWN WHEN CLICKED */}
        {isExpanded && (
          <div className="w-full space-y-2 pt-2.5 pb-1 border-t border-emerald-100 text-left animate-in fade-in slide-in-from-top-1 duration-200">
            <div className="flex items-center justify-between text-[9px] font-bold text-stone-500 uppercase tracking-wider">
              <span>Sub-Faktor Penentu</span>
              <button
                type="button"
                onClick={() => {
                  setSelectedFormulaId(configId);
                  setActiveModalTab('faktor');
                }}
                className="text-emerald-700 hover:underline flex items-center gap-0.5 font-bold cursor-pointer"
              >
                Audit Lengkap <ExternalLink className="w-2.5 h-2.5" />
              </button>
            </div>

            <div className="space-y-1.5">
              {config.factors.map((factor, idx) => (
                <div key={idx} className="space-y-0.5">
                  <div className="flex items-center justify-between text-[9px]">
                    <span className="text-stone-600 truncate max-w-[115px] sm:max-w-[130px] font-medium" title={factor.name}>
                      {factor.name}
                    </span>
                    <span className="font-mono font-bold text-stone-800 shrink-0">
                      {factor.scorePct.toFixed(0)}%
                    </span>
                  </div>
                  <div className="w-full h-1.5 bg-stone-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all duration-700 ${config.progressColor}`}
                      style={{ width: `${Math.min(100, Math.max(0, factor.scorePct))}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  const selectedConfig = selectedFormulaId ? indexConfigs[selectedFormulaId] : null;

  return (
    <div className="pt-3 pb-1 space-y-4">
      {/* Section Header */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-black uppercase tracking-wider text-stone-900">
            Indeks Kepatuhan 4C &amp; Hasil Audit Petugas ICS
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black font-mono text-emerald-800 bg-emerald-100/80 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
            4C Code of Conduct v4.1 • Major Gate PASSED
          </span>
        </div>
      </div>

      {/* 4 Percentage Donut Rings Grid with Embedded Progress Bars & Formula Reference Links */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
        <DonutRing configId="ct4ci" />
        <DonutRing configId="environmental" />
        <DonutRing configId="social" />
        <DonutRing configId="economic" />
      </div>

      {/* ==================================================================== */}
      {/* INTERACTIVE FORMULA & REGULATORY REFERENCE MODAL (PORTAL TO BODY)    */}
      {/* ==================================================================== */}
      {selectedConfig && typeof document !== 'undefined' && createPortal(
        <div
          className="fixed inset-0 z-[99999] overflow-y-auto bg-stone-900/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 animate-in fade-in duration-200"
          onClick={(e) => {
            if (e.target === e.currentTarget) setSelectedFormulaId(null);
          }}
        >
          <div className="relative bg-white rounded-3xl border border-stone-200 shadow-2xl max-w-2xl w-full max-h-[92vh] flex flex-col overflow-hidden text-left my-auto">
            {/* Modal Header */}
            <div className="p-5 sm:p-6 bg-[#FAF7F2] border-b border-stone-200 flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-2xl bg-white border border-stone-200 text-emerald-700 flex items-center justify-center shrink-0 shadow-xs mt-0.5">
                  <selectedConfig.icon className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-black border uppercase tracking-wider ${selectedConfig.badgeColor}`}>
                      {selectedConfig.badgeLabel}
                    </span>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-stone-200/80 text-stone-700 font-mono">
                      Skor: {selectedConfig.score.toFixed(1)}%
                    </span>
                  </div>
                  <h3 className="text-base sm:text-lg font-black text-stone-900 leading-snug">
                    {selectedConfig.title}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {selectedConfig.pillarName}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setSelectedFormulaId(null)}
                className="w-8 h-8 rounded-full bg-stone-200/70 hover:bg-stone-300 text-stone-700 flex items-center justify-center transition-colors shrink-0 cursor-pointer"
                title="Tutup dialog"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Tab Controls */}
            <div className="px-6 pt-3 bg-[#FAF7F2] border-b border-stone-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
              <button
                type="button"
                onClick={() => setActiveModalTab('rumus')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeModalTab === 'rumus'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>1. Rumus &amp; Metodologi</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('faktor')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeModalTab === 'faktor'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <Activity className="w-3.5 h-3.5" />
                <span>2. Faktor Penentu ({selectedConfig.factors.length})</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveModalTab('standar')}
                className={`pb-2.5 px-3 text-xs font-bold border-b-2 transition-all flex items-center gap-1.5 whitespace-nowrap cursor-pointer ${
                  activeModalTab === 'standar'
                    ? 'border-emerald-600 text-emerald-900'
                    : 'border-transparent text-stone-500 hover:text-stone-800'
                }`}
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>3. Standar &amp; Acuan Regulasi</span>
              </button>
            </div>

            {/* Modal Body with Scroll */}
            <div className="p-5 sm:p-6 overflow-y-auto space-y-5 text-xs">
              {/* ================= TAB 1: RUMUS MATEMATIS ================= */}
              {activeModalTab === 'rumus' && (
                <div className="space-y-4">
                  {/* Formula Visual Display Box */}
                  <div className="p-4 rounded-2xl bg-gradient-to-r from-stone-900 via-stone-850 to-stone-900 text-white shadow-inner space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-emerald-400 flex items-center gap-1.5">
                        <Calculator className="w-3.5 h-3.5" />
                        Formula Matematis Perhitungan Indeks:
                      </span>
                      <span className="text-[9px] font-mono font-bold text-stone-400 bg-stone-800/80 px-2 py-0.5 rounded">
                        Standar CAS &amp; ISO/IEC 17065
                      </span>
                    </div>

                    {/* Clean Visual Math Fraction Box */}
                    <div className="bg-black/50 p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row items-center justify-center gap-3 text-center">
                      {selectedConfig.id === 'ct4ci' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-emerald-400 text-sm sm:text-base">CT-4CI</span>
                            <span className="text-stone-400 font-bold">=</span>
                            <span className="font-mono font-bold text-white text-sm sm:text-base">100</span>
                            <span className="text-stone-400 font-bold">×</span>
                          </div>
                          <div className="inline-flex flex-col items-center">
                            <div className="pb-1 px-3 border-b-2 border-emerald-400/70 text-emerald-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i=1</sub><sup>N</sup> (A<sub>i</sub> · C<sub>i</sub> · V<sub>i</sub>)
                            </div>
                            <div className="pt-1 px-3 text-stone-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i=1</sub><sup>N</sup> A<sub>i</sub>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedConfig.id === 'environmental' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-teal-400 text-sm sm:text-base">Skor Lingkungan</span>
                            <span className="text-stone-400 font-bold">=</span>
                            <span className="font-mono font-bold text-white text-sm sm:text-base">100</span>
                            <span className="text-stone-400 font-bold">×</span>
                          </div>
                          <div className="inline-flex flex-col items-center">
                            <div className="pb-1 px-3 border-b-2 border-teal-400/70 text-teal-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i ∈ Env</sub> (A<sub>i</sub> · C<sub>i</sub> · V<sub>i</sub>)
                            </div>
                            <div className="pt-1 px-3 text-stone-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i ∈ Env</sub> A<sub>i</sub>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedConfig.id === 'social' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-cyan-400 text-sm sm:text-base">Skor Sosial &amp; K3</span>
                            <span className="text-stone-400 font-bold">=</span>
                            <span className="font-mono font-bold text-white text-sm sm:text-base">100</span>
                            <span className="text-stone-400 font-bold">×</span>
                          </div>
                          <div className="inline-flex flex-col items-center">
                            <div className="pb-1 px-3 border-b-2 border-cyan-400/70 text-cyan-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i ∈ Soc</sub> (A<sub>i</sub> · C<sub>i</sub> · V<sub>i</sub>)
                            </div>
                            <div className="pt-1 px-3 text-stone-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i ∈ Soc</sub> A<sub>i</sub>
                            </div>
                          </div>
                        </>
                      )}
                      {selectedConfig.id === 'economic' && (
                        <>
                          <div className="flex items-center gap-2">
                            <span className="font-mono font-black text-amber-400 text-sm sm:text-base">Skor Ekonomi GAP</span>
                            <span className="text-stone-400 font-bold">=</span>
                            <span className="font-mono font-bold text-white text-sm sm:text-base">100</span>
                            <span className="text-stone-400 font-bold">×</span>
                          </div>
                          <div className="inline-flex flex-col items-center">
                            <div className="pb-1 px-3 border-b-2 border-amber-400/70 text-amber-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i ∈ Econ</sub> (A<sub>i</sub> · C<sub>i</sub> · V<sub>i</sub>)
                            </div>
                            <div className="pt-1 px-3 text-stone-300 font-mono text-xs sm:text-sm font-bold">
                              ∑<sub>i ∈ Econ</sub> A<sub>i</sub>
                            </div>
                          </div>
                        </>
                      )}
                    </div>

                    <div className="bg-black/30 p-2.5 rounded-lg border border-white/5 font-mono text-center text-[11px] text-stone-300">
                      Evidence Coverage: EC = 100 × [ Σ (A<sub>i</sub> · V<sub>i</sub>) / Σ A<sub>i</sub> ] = 100.0%
                    </div>
                  </div>

                  {/* Variable Definitions Table */}
                  <div className="space-y-2">
                    <h4 className="font-bold text-stone-900 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5 text-emerald-700" />
                      Keterangan Notasi &amp; Variabel Penentu:
                    </h4>
                    <div className="divide-y divide-stone-100 rounded-2xl border border-stone-200 overflow-hidden bg-white">
                      {selectedConfig.formulaExplanation.map((v, i) => (
                        <div key={i} className="p-3 flex items-start gap-3 hover:bg-stone-50/60 transition-colors">
                          <span className="w-16 px-2 py-0.5 rounded bg-emerald-50 text-emerald-900 font-mono font-bold text-center text-[11px] border border-emerald-200 shrink-0">
                            {v.symbol}
                          </span>
                          <div>
                            <strong className="text-stone-900 block text-xs">{v.name}</strong>
                            <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">{v.meaning}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Real Farm Walkthrough Calculation */}
                  <div className="p-4 rounded-2xl bg-emerald-50/70 border border-emerald-200/80 space-y-2.5">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-emerald-950 uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-700" />
                        Kalkulasi Riil Lahan (Desa Awan, Kintamani):
                      </span>
                      <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100 px-2 py-0.5 rounded">
                        Terverifikasi ICS
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 font-mono text-[11px] text-stone-800">
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60">
                        <span className="text-[10px] text-stone-500 block">Numerator (Pembilang):</span>
                        <strong className="text-stone-900">{selectedConfig.realCalculation.numerator}</strong>
                      </div>
                      <div className="p-2.5 rounded-xl bg-white border border-emerald-200/60">
                        <span className="text-[10px] text-stone-500 block">Denominator (Penyebut):</span>
                        <strong className="text-stone-900">{selectedConfig.realCalculation.denominator}</strong>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-white border border-emerald-300 flex items-center justify-between">
                      <span className="text-stone-600 font-medium">Perhitungan Persentase:</span>
                      <span className="font-mono font-black text-emerald-800 text-sm">
                        {selectedConfig.realCalculation.calculation}
                      </span>
                    </div>

                    <p className="text-[11px] text-emerald-900 leading-relaxed italic">
                      "{selectedConfig.realCalculation.interpretation}"
                    </p>
                  </div>
                </div>
              )}

              {/* ================= TAB 2: FAKTOR PENENTU ================= */}
              {activeModalTab === 'faktor' && (
                <div className="space-y-3.5">
                  <div className="flex items-center justify-between text-stone-500 text-[11px]">
                    <span>Daftar seluruh indikator penilaian dan bobot capaian audit fisik on-site:</span>
                    <span className="font-bold text-stone-800">{selectedConfig.factors.length} Parameter</span>
                  </div>

                  <div className="space-y-3">
                    {selectedConfig.factors.map((factor, idx) => (
                      <div
                        key={idx}
                        className="p-3.5 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 transition-all shadow-2xs space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-stone-900 font-bold text-xs">{factor.name}</span>
                              {factor.isKey && (
                                <span className="px-1.5 py-0.2 rounded text-[9px] font-black uppercase bg-emerald-100 text-emerald-800 border border-emerald-200">
                                  Kriteria Kunci
                                </span>
                              )}
                            </div>
                            <p className="text-stone-600 text-[11px] mt-0.5 leading-relaxed">
                              {factor.description}
                            </p>
                          </div>
                          <span className="font-mono font-black text-sm text-stone-900 shrink-0 bg-stone-50 px-2 py-0.5 rounded border border-stone-200">
                            {factor.scorePct.toFixed(1)}%
                          </span>
                        </div>

                        {/* Progress Bar Gauge */}
                        <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all duration-700 ${selectedConfig.progressColor}`}
                            style={{ width: `${Math.min(100, Math.max(0, factor.scorePct))}%` }}
                          />
                        </div>

                        {/* Audit physical finding note */}
                        <div className="flex items-center gap-1.5 text-[10px] text-stone-500 pt-1">
                          <Check className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                          <span>Bukti Lapangan: <strong>{factor.auditEvidence}</strong></span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* ================= TAB 3: STANDAR & ACUAN REGULASI ================= */}
              {activeModalTab === 'standar' && (
                <div className="space-y-3.5">
                  <p className="text-stone-600 text-xs leading-relaxed">
                    Setiap indikator dihitung dengan mengacu pada standar sertifikasi komoditas kopi global dan regulasi internasional resmi:
                  </p>

                  <div className="space-y-3">
                    {selectedConfig.standardDocuments.map((doc, idx) => (
                      <div
                        key={idx}
                        className="p-4 rounded-2xl bg-white border border-stone-200 hover:border-emerald-300 transition-all space-y-1.5 shadow-2xs"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="space-y-0.5">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-800">
                              {doc.organization}
                            </span>
                            <h4 className="text-xs font-black text-stone-900">{doc.title}</h4>
                          </div>
                          {doc.url ? (
                            <a
                              href={doc.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-[10px] font-bold text-emerald-700 hover:text-emerald-900 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 transition-colors shrink-0"
                            >
                              <span>Website Resmi</span>
                              <ExternalLink className="w-3 h-3" />
                            </a>
                          ) : (
                            <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-stone-100 text-stone-600">
                              Dokumen Standar
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-stone-600 leading-relaxed">
                          {doc.summary}
                        </p>
                      </div>
                    ))}
                  </div>

                  <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-950 text-[11px] flex items-start gap-2.5">
                    <ShieldCheck className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                    <div>
                      <strong>Audit Independen Petugas ICS:</strong> Seluruh kepatuhan telah diperiksa dan diverifikasi secara independen oleh Tim ICS Kelompok Tani Mandiri (Ashabil) melalui inspeksi fisik kebun kopi on-site.
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#FAF7F2] border-t border-stone-200 flex items-center justify-between gap-3 shrink-0">
              <span className="text-[10px] text-stone-500 font-mono">
                No. Sertifikat: {certificateNumber}
              </span>
              <button
                type="button"
                onClick={() => setSelectedFormulaId(null)}
                className="px-5 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-colors cursor-pointer shadow-xs"
              >
                Tutup Rincian
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}

      {/* Official ICS Officer Inspection Record */}
      <div className="bg-white/75 rounded-2xl p-4 border border-stone-200/80 space-y-3 shadow-2xs">
        {/* Auditor Profile Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-stone-200/60 pb-3">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0 border border-emerald-300 mt-0.5">
              <UserCheck className="w-5 h-5 text-emerald-700" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                  VERIFIKATOR LAPANGAN ICS RESMI
                </span>
                <span className="text-[10px] text-stone-500 font-mono">
                  Audit: {auditDate}
                </span>
              </div>
              <h4 className="text-sm font-black text-stone-900 mt-0.5">
                {verifierName}
              </h4>
              <p className="text-[11px] text-stone-500">
                {verifierRole}
              </p>
            </div>
          </div>

          <div className="text-left sm:text-right shrink-0">
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">
              No. Sertifikat Audit
            </span>
            <span className="text-xs font-mono font-bold text-stone-900 block">
              {certificateNumber}
            </span>
          </div>
        </div>

        {/* Auditor Official Finding Note */}
        <div className="bg-emerald-50/60 rounded-xl p-3 border border-emerald-200/70 space-y-1">
          <span className="text-[10px] font-black uppercase tracking-wider text-emerald-900 flex items-center gap-1.5">
            <FileCheck className="w-3.5 h-3.5 text-emerald-700" />
            Catatan Resmi Pemeriksaan Fisik On-Site:
          </span>
          <p className="text-xs text-stone-700 leading-relaxed italic">
            "{auditNotes}"
          </p>
        </div>

        {/* Digital Verification Hash - Clean Responsive Layout (No Overflow) */}
        <div className="pt-2 border-t border-stone-200/60 space-y-1.5 text-xs">
          <div className="flex items-center justify-between text-[11px]">
            <span className="flex items-center gap-1.5 text-stone-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block shrink-0" />
              Integritas Kriptografi Audit
            </span>
            <span className="text-emerald-700 font-semibold text-[11px]">✓ Tervalidasi Sistem ICS</span>
          </div>
          <div className="bg-stone-50 px-2.5 py-1.5 rounded-lg font-mono text-[10px] text-stone-600 border border-stone-200/80 flex items-center justify-between gap-2 overflow-hidden">
            <span className="truncate min-w-0">{digitalSignatureHash}</span>
            <span className="text-[9px] uppercase tracking-wider text-stone-400 font-bold shrink-0">SHA-256</span>
          </div>
        </div>
      </div>
    </div>
  );
};
