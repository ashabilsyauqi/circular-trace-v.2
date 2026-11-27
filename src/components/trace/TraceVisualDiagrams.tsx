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
    <div className="pt-2 pb-1 space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-emerald-700" />
          <span className="text-xs font-black uppercase tracking-wider text-stone-900">
            Refraktometer Digital &amp; Indeks Kematangan Ceri
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-black font-mono text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded-md border border-emerald-300">
            {brixScore}° Bx • Puncak Manis Optimal
          </span>
          <span className="text-[11px] font-black font-mono text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded-md border border-amber-300">
            {cherryRipePercent}% Petik Merah
          </span>
        </div>
      </div>

      {/* SVG Brix Meter Horizontal Calibrated Gauge */}
      <div className="space-y-2">
        <div className="flex items-center justify-between text-[11px] text-stone-500 font-medium">
          <span>Skala Kadar Gula Alami Buah (Refraktometer Brix)</span>
          <span className="font-mono text-emerald-800 font-bold">Optimal Specialty: 20 - 24° Bx</span>
        </div>

        <div className="relative pt-6 pb-2">
          {/* Calibrated Gradient Bar */}
          <div className="h-4 w-full rounded-full bg-stone-200 relative overflow-hidden flex">
            {/* 12-16: Mengkal */}
            <div className="h-full bg-stone-300/80 w-[28.5%]" title="12 - 16° Bx: Mengkal" />
            {/* 16-19: Matang Standar */}
            <div className="h-full bg-amber-300/80 w-[21.4%]" title="16 - 19° Bx: Matang Cukup" />
            {/* 19-24: Puncak Manis Optimal Specialty */}
            <div className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 w-[35.7%]" title="19 - 24° Bx: Specialty Peak Sweetness" />
            {/* 24-26: Lewat Matang */}
            <div className="h-full bg-orange-400/80 w-[14.4%]" title="24 - 26° Bx: Lewat Matang" />
          </div>

          {/* Calibrated Tick Marks */}
          <div className="flex justify-between text-[10px] font-mono text-stone-400 mt-1 px-1">
            <span>12°</span>
            <span>16°</span>
            <span>19°</span>
            <span className="text-emerald-700 font-bold">22.5° Bx</span>
            <span>24°</span>
            <span>26°</span>
          </div>

          {/* Current Needle Indicator Pin */}
          <div
            className="absolute top-0 -translate-x-1/2 flex flex-col items-center transition-all duration-700"
            style={{ left: `${brixPct}%` }}
          >
            <div className="bg-emerald-900 text-white text-[10px] font-mono font-black px-2 py-0.5 rounded shadow-sm flex items-center gap-1 border border-emerald-400">
              <Sparkles className="w-2.5 h-2.5 text-amber-300" />
              {brixScore}° Bx
            </div>
            <div className="w-0 h-0 border-l-[4px] border-l-transparent border-r-[4px] border-r-transparent border-t-[5px] border-t-emerald-900" />
            <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 ring-2 ring-white shadow-xs mt-0.5" />
          </div>
        </div>

        {/* Qualitative Zone Labels */}
        <div className="grid grid-cols-4 gap-1 text-center text-[10px] text-stone-500 pt-0.5">
          <div className="py-1 px-1 bg-stone-100 rounded text-stone-500 font-medium">12-16° Mengkal</div>
          <div className="py-1 px-1 bg-amber-50 rounded text-amber-800 font-medium">16-19° Cukup</div>
          <div className="py-1 px-1 bg-emerald-50 rounded text-emerald-800 font-bold border border-emerald-200">
            20-24° Super Sweet ★
          </div>
          <div className="py-1 px-1 bg-orange-50 rounded text-orange-800 font-medium">&gt;24° Lewat Matang</div>
        </div>
      </div>

      {/* Cherry Picking Sortation Bar */}
      <div className="pt-2 border-t border-stone-200/60 space-y-1.5">
        <div className="flex items-center justify-between text-[11px]">
          <span className="text-stone-600 font-medium">Rasio Sortasi Kematangan Ceri di Kebun:</span>
          <span className="font-mono text-emerald-800 font-bold">96.5% Lolos Sortasi Petik Merah</span>
        </div>
        <div className="h-3 w-full bg-stone-200 rounded-full overflow-hidden flex shadow-2xs">
          <div
            className="bg-red-600 h-full transition-all duration-500"
            style={{ width: `${cherryRipePercent}%` }}
            title="96.5% Ceri Merah Matang Sempurna"
          />
          <div
            className="bg-amber-400 h-full transition-all duration-500"
            style={{ width: `${100 - cherryRipePercent}%` }}
            title="3.5% Ceri Oranye (Toleransi Sortasi)"
          />
        </div>
        <div className="flex items-center justify-between text-[10px] text-stone-500 pt-0.5">
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-red-600 inline-block" />
            Petik Merah Segar ({cherryRipePercent}%)
          </span>
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-amber-400 inline-block" />
            Kuning / Oranye ({(100 - cherryRipePercent).toFixed(1)}%)
          </span>
          <span className="flex items-center gap-1 text-emerald-700 font-bold">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            0% Ceri Hijau (Ditolak)
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
      title: 'Sortasi Rambang (Floating)',
      desc: 'Ceri direndam dalam bak air pegunungan Kintamani. Ceri padat tenggelam (96.5%), ceri hampa otomatis terapung dan dipisahkan.',
      badge: '96.5% Ceri Padat',
      icon: Droplets,
      color: 'border-blue-200 bg-blue-50/60 text-blue-900',
    },
    {
      step: '02',
      title: 'Eco-Pulper Mekanis',
      desc: 'Pengupasan kulit merah dengan mesin pulper presisi tanpa memecah biji bertanduk. Hemat konsumsi air hingga 85% dibanding mesin lama.',
      badge: '1.2 L Air / Kg',
      icon: RotateCcw,
      color: 'border-amber-200 bg-amber-50/60 text-amber-900',
    },
    {
      step: '03',
      title: 'Fermentasi Ganda 36 Jam',
      desc: 'Fermentasi basah dua tahap terkontrol memecah lendir mucilage alami secara higienis, membentuk keasaman sitrun jeruk Kintamani.',
      badge: 'Suhu 18-20°C',
      icon: Activity,
      color: 'border-orange-200 bg-orange-50/60 text-orange-900',
    },
    {
      step: '04',
      title: 'Solar Raised Bed',
      desc: 'Penjemuran di atas rak meja jaring para-para dengan sirkulasi udara 360° terlindung hujan hingga MC turun perlahan ke batas aman 11.4%.',
      badge: 'MC 11.4% Target',
      icon: Sun,
      color: 'border-emerald-200 bg-emerald-50/60 text-emerald-900',
    },
  ];

  return (
    <div className="pt-2 pb-1 space-y-6">
      {/* 4 Steps Timeline Flow */}
      <div className="space-y-3">
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-amber-700" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-900">
              Alur 4 Langkah Pengolahan Basah Terstandarisasi
            </span>
          </div>
          <span className="text-[10px] text-stone-500 font-mono">Specialty Washed Protocol</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {steps.map((st, i) => {
            const IconComp = st.icon;
            return (
              <div
                key={i}
                className="p-3 rounded-2xl bg-white/70 border border-stone-200/80 space-y-2 hover:border-amber-300 transition-all shadow-2xs"
              >
                <div className="flex items-center justify-between">
                  <div className="w-7 h-7 rounded-lg bg-stone-100 text-stone-800 font-mono font-black text-xs flex items-center justify-center">
                    {st.step}
                  </div>
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.color}`}>
                    {st.badge}
                  </span>
                </div>
                <div>
                  <h4 className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
                    <IconComp className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                    {st.title}
                  </h4>
                  <p className="text-[11px] text-stone-600 leading-relaxed mt-1">
                    {st.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Circular Economy Flow Diagram (Zero-Waste Sankey Model) */}
      <div className="space-y-3 pt-3 border-t border-stone-200/70">
        <div className="flex items-center justify-between border-b border-stone-200/60 pb-2">
          <div className="flex items-center gap-2">
            <RotateCcw className="w-4 h-4 text-emerald-700" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-900">
              Diagram Alir Sirkularitas Limbah (Zero-Waste Eco Mill)
            </span>
          </div>
          <span className="text-[11px] font-bold text-emerald-800 bg-emerald-100/70 px-2.5 py-0.5 rounded-full border border-emerald-300 flex items-center gap-1">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            0% Limbah ke Sungai
          </span>
        </div>

        {/* Visual Clean Flow Row */}
        <div className="bg-stone-50/70 rounded-2xl p-4 border border-stone-200/80 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
            {/* Input Lot Ceri (4 Cols) */}
            <div className="md:col-span-4 bg-white p-3.5 rounded-xl border border-stone-200 shadow-2xs space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-stone-400 block">
                Bahan Baku Hulu (100%)
              </span>
              <div className="flex items-baseline gap-2">
                <span className="text-xl font-black font-mono text-stone-900">{cherryWeightKg} kg</span>
                <span className="text-xs font-bold text-red-700">Buah Ceri Merah Segar</span>
              </div>
              <p className="text-[11px] text-stone-500">
                Panen optimal dari kebun Komang Adiarta (Desa Awan, Kintamani).
              </p>
            </div>

            {/* Split Arrow Indicator (1 Col) */}
            <div className="md:col-span-1 hidden md:flex items-center justify-center text-stone-400">
              <ArrowRight className="w-5 h-5" />
            </div>

            {/* Output Fractions (7 Cols) */}
            <div className="md:col-span-7 space-y-2.5">
              {/* Branch 1: Green Bean 20% */}
              <div className="bg-white p-3 rounded-xl border border-emerald-200 shadow-2xs flex items-center justify-between gap-3">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-emerald-800 bg-emerald-100/80 px-2 py-0.5 rounded">
                      20% Biji Utama
                    </span>
                    <strong className="text-xs font-bold text-stone-900">Green Bean Specialty</strong>
                  </div>
                  <p className="text-[11px] text-stone-500">
                    Biji kopi beras kering siap grading ke gudang silo &amp; ekspor.
                  </p>
                </div>
                <div className="text-right shrink-0">
                  <span className="text-base font-black font-mono text-emerald-800 block">
                    {greenBeanWeightKg} kg
                  </span>
                  <span className="text-[10px] font-semibold text-stone-400">MC 11.4% • Gr.1</span>
                </div>
              </div>

              {/* Branch 2: Cascara & Upcycling 80% */}
              <div className="bg-white p-3 rounded-xl border border-amber-200 shadow-2xs space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 bg-amber-100/80 px-2 py-0.5 rounded">
                      80% Sirkularitas
                    </span>
                    <strong className="text-xs font-bold text-stone-900">Kulit Ceri (Cascara Upcycled)</strong>
                  </div>
                  <span className="text-base font-black font-mono text-amber-900">{cascaraWeightKg} kg</span>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-stone-100 text-[11px]">
                  <div className="bg-amber-50/70 p-2 rounded-lg border border-amber-200/60">
                    <span className="text-stone-500 font-medium block">Teh Cascara Artisan:</span>
                    <strong className="text-xs font-bold text-amber-950 font-mono block mt-0.5">
                      {cascaraTeaWeightKg} kg
                    </strong>
                    <span className="text-[10px] text-amber-800">Dijual premium kaya polifenol</span>
                  </div>
                  <div className="bg-emerald-50/70 p-2 rounded-lg border border-emerald-200/60">
                    <span className="text-stone-500 font-medium block">Kompos Organik Kebun:</span>
                    <strong className="text-xs font-bold text-emerald-950 font-mono block mt-0.5">
                      {compostWeightKg} kg
                    </strong>
                    <span className="text-[10px] text-emerald-800">Menyuburkan tanah Desa Awan</span>
                  </div>
                </div>
              </div>
            </div>
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
    <div className="pt-2 pb-1 space-y-6">
      {/* 1. Screen Size Distribution Histogram */}
      <div className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
          <div className="flex items-center gap-2">
            <Scale className="w-4 h-4 text-blue-700" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-900">
              Histogram Distribusi Ukuran Biji (Screen Size Grading)
            </span>
          </div>
          <span className="text-[11px] font-bold text-blue-900 bg-blue-100/70 px-2.5 py-0.5 rounded-full border border-blue-300">
            Total Defect: {defectCount} / 350g (Grade 1 Super Screen)
          </span>
        </div>

        {/* Clean Vector Bars */}
        <div className="space-y-2.5 pt-1">
          {/* Screen 18+ */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-stone-900 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-600 inline-block" />
                Screen 18+ (Super Screen • &gt;7.14 mm)
              </span>
              <span className="font-mono font-black text-blue-900 text-xs">{screen18Percent}%</span>
            </div>
            <div className="h-2.5 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-600 h-full rounded-full transition-all duration-700"
                style={{ width: `${screen18Percent}%` }}
              />
            </div>
            <p className="text-[10px] text-stone-500">
              Keseragaman biji 92% menjamin transfer panas konveksi merata saat sangrai (zero scorching).
            </p>
          </div>

          {/* Screen 17 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-blue-400 inline-block" />
                Screen 17 (Large Screen • 6.75 mm)
              </span>
              <span className="font-mono font-bold text-stone-800 text-xs">{screen17Percent}%</span>
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="bg-blue-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${screen17Percent * 5}%` }}
              />
            </div>
          </div>

          {/* Screen 16 */}
          <div className="space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-stone-700 flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded bg-stone-400 inline-block" />
                Screen 16 (Medium Screen • 6.35 mm)
              </span>
              <span className="font-mono font-bold text-stone-800 text-xs">{screen16Percent}%</span>
            </div>
            <div className="h-2 w-full bg-stone-200 rounded-full overflow-hidden">
              <div
                className="bg-stone-400 h-full rounded-full transition-all duration-700"
                style={{ width: `${screen16Percent * 5}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* 2. Climate Control Log SVG Sparkline (Suhu 19.2°C & RH 58% GrainPro) */}
      <div className="space-y-3 pt-3 border-t border-stone-200/70">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-stone-200/60 pb-2">
          <div className="flex items-center gap-2">
            <Thermometer className="w-4 h-4 text-teal-700" />
            <span className="text-xs font-black uppercase tracking-wider text-stone-900">
              Grafik Stabilitas Suhu &amp; Kelembaban Silo (Climate Log 30 Hari)
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-stone-600 bg-stone-100 px-2 py-0.5 rounded border border-stone-300">
              GrainPro™ Hermetic Barrier
            </span>
            <span className="text-[10px] font-black font-mono text-teal-800 bg-teal-50 px-2 py-0.5 rounded border border-teal-300">
              Aw: {waterActivityAw} (Aman dari Jamur)
            </span>
          </div>
        </div>

        {/* Clean SVG Graph */}
        <div className="bg-white/70 p-3 rounded-2xl border border-stone-200/80 space-y-2 shadow-2xs">
          <svg className="w-full h-24 overflow-visible" viewBox="0 0 460 90">
            <defs>
              <linearGradient id="climateTempGlow" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#0284c7" stopOpacity="0.2" />
                <stop offset="100%" stopColor="#0284c7" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Safe Envelope Band (Y: 20 to 65) */}
            <rect x="0" y="20" width="460" height="45" fill="#f0fdf4" rx="4" />
            <text x="8" y="32" className="text-[8px] fill-emerald-700 font-semibold">
              Zona Aman Kopi Specialty (18-21°C • RH 55-62%)
            </text>

            {/* Horizontal Grid lines */}
            <line x1="0" y1="20" x2="460" y2="20" stroke="#e2e8f0" strokeDasharray="3 3" />
            <line x1="0" y1="45" x2="460" y2="45" stroke="#e2e8f0" strokeDasharray="3 3" />
            <line x1="0" y1="65" x2="460" y2="65" stroke="#e2e8f0" strokeDasharray="3 3" />

            {/* Stable Temp Line (~19.2°C at y=36) */}
            <path
              d="M 10 38 Q 60 36, 120 37 T 240 36 T 360 37 L 450 36"
              fill="none"
              stroke="#0284c7"
              strokeWidth="2.4"
            />

            {/* Stable RH Line (~58% at y=52) */}
            <path
              d="M 10 53 Q 70 51, 140 54 T 270 52 T 390 53 L 450 52"
              fill="none"
              stroke="#0d9488"
              strokeWidth="2"
              strokeDasharray="4 3"
            />

            {/* Current Datapoints */}
            <circle cx="450" cy="36" r="4" fill="#ffffff" stroke="#0284c7" strokeWidth="2.5" />
            <circle cx="450" cy="52" r="3.5" fill="#ffffff" stroke="#0d9488" strokeWidth="2" />

            {/* Callout Badges on Right Edge */}
            <text x="445" y="27" textAnchor="end" className="text-[9px] font-mono font-black fill-sky-800">
              Suhu: {temperatureCelsius}°C
            </text>
            <text x="445" y="70" textAnchor="end" className="text-[9px] font-mono font-black fill-teal-800">
              RH: {humidityPercent}%
            </text>
          </svg>

          {/* Graph Legend */}
          <div className="flex flex-wrap items-center justify-between text-[11px] pt-1 border-t border-stone-100">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-1.5 font-bold text-sky-900">
                <span className="w-3.5 h-1 rounded bg-sky-600 inline-block" />
                <span>Suhu Ruang ({temperatureCelsius}°C)</span>
              </div>
              <div className="flex items-center gap-1.5 font-bold text-teal-800">
                <span className="w-3.5 h-0.5 border-t-2 border-dashed border-teal-600 inline-block" />
                <span>Kelembaban Relatif ({humidityPercent}% RH)</span>
              </div>
            </div>
            <span className="text-[10px] text-stone-500">Sensor IoT Telemetri Real-Time</span>
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
