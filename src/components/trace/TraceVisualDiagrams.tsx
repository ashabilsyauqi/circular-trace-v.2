import React from 'react';
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
  // SVG Donut Helper Component
  const DonutRing = ({
    score,
    strokeColor,
    label,
    subLabel,
    icon: Icon,
    isMajor = false,
  }: {
    score: number;
    strokeColor: string;
    label: string;
    subLabel: string;
    icon: any;
    isMajor?: boolean;
  }) => {
    const clamped = Math.min(100, Math.max(0, score));
    return (
      <div className="flex flex-col items-center text-center p-2 sm:p-2.5 rounded-xl bg-white/80 border border-stone-200/70 hover:border-emerald-300 transition-all shadow-2xs space-y-1">
        <div className="flex items-center gap-1 text-[11px] font-bold text-stone-900">
          <Icon className="w-3 h-3 text-emerald-700 shrink-0" />
          <span className="truncate">{label}</span>
        </div>

        {/* Circular Donut Gauge - Compact */}
        <div className="relative w-16 h-16 sm:w-20 sm:h-20 my-0.5">
          <svg viewBox="0 0 36 36" className="w-16 h-16 sm:w-20 sm:h-20 transform -rotate-90">
            {/* Background Track */}
            <path
              className="stroke-stone-200"
              strokeWidth="3.2"
              fill="none"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
            />
            {/* Progress Arc */}
            <path
              className={`${strokeColor} transition-all duration-1000 ease-out`}
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
              {score.toFixed(1)}%
            </span>
            <span className="text-[7px] font-bold uppercase tracking-tight text-emerald-700 mt-0.5">
              {isMajor ? 'MAJOR' : 'PASS'}
            </span>
          </div>
        </div>

        <span className="text-[9px] text-stone-500 font-medium leading-tight line-clamp-1">
          {subLabel}
        </span>
      </div>
    );
  };

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

      {/* 4 Percentage Donut Rings Grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        {/* Donut 1: Overall CT-4CI */}
        <DonutRing
          score={ct4ciScore}
          strokeColor="stroke-emerald-600"
          label="CT-4CI Readiness"
          subLabel={`${compliantCount}/${applicableCount} Checkpoint • EC ${evidenceCoveragePct}%`}
          icon={Award}
          isMajor={true}
        />

        {/* Donut 2: Lingkungan */}
        <DonutRing
          score={dimensionScores.environmental}
          strokeColor="stroke-teal-600"
          label="Pilar Lingkungan"
          subLabel="Zero Deforestasi & Zero Agrokimia B3"
          icon={Leaf}
        />

        {/* Donut 3: Sosial */}
        <DonutRing
          score={dimensionScores.social}
          strokeColor="stroke-sky-600"
          label="Pilar Sosial & K3"
          subLabel="Bebas Pekerja Anak & APD Petani"
          icon={Users}
        />

        {/* Donut 4: Ekonomi */}
        <DonutRing
          score={dimensionScores.economic}
          strokeColor="stroke-amber-600"
          label="Pilar Ekonomi GAP"
          subLabel="Harga Transparan & Buku Panen"
          icon={TrendingUp}
        />
      </div>

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
