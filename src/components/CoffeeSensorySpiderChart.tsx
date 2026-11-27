import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
  ChevronDown,
} from 'lucide-react';

export interface SensoryAttribute {
  key: string;
  name: string;
  shortLabel: string;
  score: number; // 5.0 - 10.0
  icon: string;
  description: string;
  flavorTones: string[];
}

export interface CoffeeSensorySpiderChartProps {
  scaScore?: number;
  roastLevel?: string;
  agtronNumber?: number;
  dtrPercent?: number;
  beanName?: string;
  roasterName?: string;
  tastingNotes?: string[];
  customAttributes?: {
    aroma?: number;
    flavor?: number;
    acidity?: number;
    sweetness?: number;
    body?: number;
    aftertaste?: number;
  };
  interactive?: boolean;
  flat?: boolean;
}

export const CoffeeSensorySpiderChart: React.FC<CoffeeSensorySpiderChartProps> = ({
  scaScore = 87.5,
  roastLevel = 'Light-Medium',
  agtronNumber = 68,
  dtrPercent = 14.5,
  beanName = 'Pangalengan Java Preanger - Typica Floral',
  roasterName = 'Karsa Craft Roastery',
  tastingNotes = ['Jasmine Floral', 'Lemon Zest', 'Peach Blossom', 'Cane Sugar Sweetness'],
  customAttributes,
  interactive = true,
  flat = false,
}) => {
  const [selectedRoastPreset, setSelectedRoastPreset] = useState<'actual' | 'light' | 'medium' | 'dark'>('actual');
  const [activeHoverAxis, setActiveHoverAxis] = useState<number | null>(null);

  // Baseline values based on roast preset or custom attributes
  const getDynamicScore = (base: number, key: string): number => {
    if (selectedRoastPreset === 'actual') {
      if (customAttributes && (customAttributes as any)[key] !== undefined) {
        return (customAttributes as any)[key];
      }
      return base;
    }

    if (selectedRoastPreset === 'light') {
      if (key === 'aroma') return 9.2;
      if (key === 'acidity') return 9.4;
      if (key === 'flavor') return 8.9;
      if (key === 'sweetness') return 8.5;
      if (key === 'body') return 7.6;
      if (key === 'aftertaste') return 8.6;
    }

    if (selectedRoastPreset === 'medium') {
      if (key === 'aroma') return 8.8;
      if (key === 'acidity') return 8.4;
      if (key === 'flavor') return 8.8;
      if (key === 'sweetness') return 9.2;
      if (key === 'body') return 8.7;
      if (key === 'aftertaste') return 8.9;
    }

    if (selectedRoastPreset === 'dark') {
      if (key === 'aroma') return 8.2;
      if (key === 'acidity') return 6.8;
      if (key === 'flavor') return 8.3;
      if (key === 'sweetness') return 8.4;
      if (key === 'body') return 9.5;
      if (key === 'aftertaste') return 8.5;
    }

    return base;
  };

  const attributes: SensoryAttribute[] = [
    {
      key: 'aroma',
      name: 'Aroma & Fragrance',
      shortLabel: 'Aroma',
      score: getDynamicScore(8.85, 'aroma'),
      icon: '🌸',
      description: 'Intensitas wangi uap seduhan kering dan basah (floral melati & teh putih).',
      flavorTones: ['Jasmine Floral', 'Bergamot', 'White Tea Blossom'],
    },
    {
      key: 'flavor',
      name: 'Flavor & Complexity',
      shortLabel: 'Flavor',
      score: getDynamicScore(8.70, 'flavor'),
      icon: '🍓',
      description: 'Kombinasi kompleksitas rasa di lidah saat kopi disesap pada suhu optimal.',
      flavorTones: ['Peach Fruit', 'Yellow Plum', 'Wild Honey'],
    },
    {
      key: 'sweetness',
      name: 'Sweetness & Sugars',
      shortLabel: 'Sweetness',
      score: getDynamicScore(9.10, 'sweetness'),
      icon: '🍯',
      description: 'Kemanisan karamelisasi alami fruktosa & sukrosa buah ceri matang optimal.',
      flavorTones: ['Cane Sugar', 'Caramelized Fig', 'Maple Syrup'],
    },
    {
      key: 'body',
      name: 'Body & Mouthfeel',
      shortLabel: 'Body',
      score: getDynamicScore(8.25, 'body'),
      icon: '☕',
      description: 'Tekstur kelembutan dan sensasi kekentalan seduhan di dalam rongga mulut.',
      flavorTones: ['Silky Smooth', 'Medium-Light Juicy', 'Velvety'],
    },
    {
      key: 'aftertaste',
      name: 'Aftertaste & Finish',
      shortLabel: 'Aftertaste',
      score: getDynamicScore(8.60, 'aftertaste'),
      icon: '✨',
      description: 'Panjangnya sensasi rasa manis bersih yang tertinggal di tenggorokan setelah diminum.',
      flavorTones: ['Lingering Sweet', 'Crisp Clean', 'Refreshing Citrus'],
    },
    {
      key: 'acidity',
      name: 'Acidity (Keasaman Buah)',
      shortLabel: 'Acidity',
      score: getDynamicScore(8.75, 'acidity'),
      icon: '🍋',
      description: 'Kecerahan asam sitrun dan malat alami yang menyegarkan seperti buah segar.',
      flavorTones: ['Lemon Zest', 'Crisp Green Apple', 'Sparkling Citric'],
    },
  ];

  // Commercial coffee benchmark scores for comparison
  const commercialBenchmarkMap: Record<string, number> = {
    aroma: 6.2,
    flavor: 6.0,
    sweetness: 5.8,
    body: 6.8,
    aftertaste: 5.9,
    acidity: 5.6,
  };

  // Spider Chart Mathematical Constants
  const cx = 190;
  const cy = 160;
  const maxRadius = 95;
  const minScore = 5.0;
  const maxScore = 10.0;
  const numAxes = attributes.length;

  // Grid levels at 6.0, 7.0, 8.0, 9.0, 10.0
  const gridLevels = [6.0, 7.0, 8.0, 9.0, 10.0];

  const getCoordinates = (index: number, score: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    const normalized = Math.max(0, Math.min(1, (score - minScore) / (maxScore - minScore)));
    const r = normalized * maxRadius;
    const x = cx + r * Math.cos(angle);
    const y = cy + r * Math.sin(angle);
    return { x, y, angle };
  };

  const getLabelCoordinates = (index: number) => {
    const angle = -Math.PI / 2 + (index * 2 * Math.PI) / numAxes;
    const labelDistance = maxRadius + 32;
    const x = cx + labelDistance * Math.cos(angle);
    const y = cy + (labelDistance - 4) * Math.sin(angle);
    return { x, y, angle };
  };

  // Polygon points path string for specialty coffee
  const polygonPoints = attributes
    .map((attr, idx) => {
      const { x, y } = getCoordinates(idx, attr.score);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  // Polygon points path string for commercial coffee benchmark
  const commercialPolygonPoints = attributes
    .map((attr, idx) => {
      const commScore = commercialBenchmarkMap[attr.key] || 6.0;
      const { x, y } = getCoordinates(idx, commScore);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const averageSensoryScore = Number(
    (attributes.reduce((sum, a) => sum + a.score, 0) / attributes.length).toFixed(2)
  );

  return (
    <div
      className={
        flat
          ? 'space-y-6 pt-2'
          : 'bg-gradient-to-br from-amber-950/10 via-stone-50 to-amber-50/40 rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-sm space-y-6'
      }
    >
      {/* Header Profile Info */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-amber-200/60 pb-4">
        <div className="space-y-1">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/15 text-amber-900 text-xs font-black border border-amber-300">
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              SENSORY SPIDER CHART • HASIL ROASTING
            </span>
            <span className="px-2.5 py-0.5 rounded-full bg-stone-900 text-amber-300 text-xs font-black flex items-center gap-1">
              <Award className="w-3.5 h-3.5 text-amber-400" />
              SCA Score: {scaScore}
            </span>
          </div>

          <h3 className="text-lg sm:text-xl font-black text-stone-950 tracking-tight mt-1">
            Visualisasi Radar Profil Rasa & Karakter Sensori
          </h3>
          <p className="text-xs text-stone-600">
            Hasil uji seduh cupping resmi untuk <strong className="text-stone-900">{beanName}</strong> oleh <span className="font-semibold text-stone-800">{roasterName}</span> pada profil sangrai <span className="font-bold text-amber-900">{roastLevel}</span>.
          </p>
        </div>

        {/* Roasting Spec Badges / Clean Row */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className={flat ? 'text-right' : 'bg-white px-3.5 py-2 rounded-2xl border border-amber-200 text-center shadow-2xs'}>
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Agtron Tile</span>
            <span className="text-base font-black text-stone-900 font-mono">#{agtronNumber}</span>
            <span className="text-[9px] text-amber-700 font-semibold block">{roastLevel}</span>
          </div>
          <div className={flat ? 'text-right pl-3 border-l border-stone-200' : 'bg-white px-3.5 py-2 rounded-2xl border border-amber-200 text-center shadow-2xs'}>
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">DTR Ratio</span>
            <span className="text-base font-black text-amber-900 font-mono">{dtrPercent}%</span>
            <span className="text-[9px] text-stone-500 font-semibold block">Dev. Time</span>
          </div>
        </div>
      </div>

      {/* Preset Simulator Switcher (Compact Single-Row Non-sliding & Non-stacking Dropdown) */}
      {interactive && (
        <div className="flex items-center justify-between gap-3 bg-white/90 p-2.5 rounded-2xl border border-amber-200/80 shadow-2xs">
          <div className="flex items-center gap-2 shrink-0">
            <Flame className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-950">
              Profil Sangrai:
            </span>
          </div>

          <div className="relative shrink-0 max-w-[200px] sm:max-w-none">
            <select
              value={selectedRoastPreset}
              onChange={(e) => setSelectedRoastPreset(e.target.value as any)}
              className="appearance-none bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs py-1.5 pl-3 pr-8 rounded-xl shadow-xs transition-colors cursor-pointer border border-amber-700 focus:outline-none focus:ring-2 focus:ring-amber-500 truncate"
            >
              <option value="actual">⭐ Profil Aktual ({roastLevel})</option>
              <option value="light">🍋 Light Filter (Cerah)</option>
              <option value="medium">🍯 Medium Balance (Seimbang)</option>
              <option value="dark">🍫 Dark Bold (Mantap)</option>
            </select>
            <ChevronDown className="w-3.5 h-3.5 text-white absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      )}

      {/* Main Chart & Attribute Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Spider Chart SVG Graphic (7 Cols) */}
        <div className={flat ? 'lg:col-span-6 flex flex-col items-center justify-center relative overflow-hidden py-2' : 'lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-amber-200/70 shadow-2xs flex flex-col items-center justify-center relative overflow-hidden'}>
          <svg
            className="w-full max-w-[380px] h-auto aspect-square overflow-visible"
            viewBox="0 0 380 340"
          >
            <defs>
              {/* Radial warm gold gradient */}
              <radialGradient id="spiderAmberGlow" cx="50%" cy="50%" r="50%">
                <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.5" />
                <stop offset="60%" stopColor="#d97706" stopOpacity="0.3" />
                <stop offset="100%" stopColor="#b45309" stopOpacity="0.15" />
              </radialGradient>
              <filter id="glowDrop" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#d97706" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* 1. Concentric Polygons (Web Background) */}
            {gridLevels.map((lvl) => {
              const pts = Array.from({ length: numAxes })
                .map((_, i) => {
                  const { x, y } = getCoordinates(i, lvl);
                  return `${x.toFixed(2)},${y.toFixed(2)}`;
                })
                .join(' ');
              return (
                <polygon
                  key={lvl}
                  points={pts}
                  fill={lvl === 10.0 ? '#fafaf9' : 'none'}
                  stroke={lvl === 10.0 ? '#d6d3d1' : '#e7e5e4'}
                  strokeWidth={lvl === 10.0 ? '1.5' : '1'}
                  strokeDasharray={lvl === 10.0 ? undefined : '3,3'}
                />
              );
            })}

            {/* Concentric Level Indicators */}
            {gridLevels.map((lvl) => {
              const { y } = getCoordinates(0, lvl);
              return (
                <text
                  key={`lvl-text-${lvl}`}
                  x={cx + 4}
                  y={y + 11}
                  className="text-[9px] fill-stone-400 font-mono font-semibold"
                >
                  {lvl.toFixed(0)}
                </text>
              );
            })}

            {/* 2. Spoke Lines from Center to Outer Vertex */}
            {attributes.map((_, idx) => {
              const { x, y } = getCoordinates(idx, maxScore);
              return (
                <line
                  key={`spoke-${idx}`}
                  x1={cx}
                  y1={cy}
                  x2={x}
                  y2={y}
                  stroke="#e7e5e4"
                  strokeWidth="1.2"
                />
              );
            })}

            {/* 3a. Commercial Coffee Benchmark Polygon (Dashed Slate) */}
            <polygon
              points={commercialPolygonPoints}
              fill="rgba(148, 163, 184, 0.12)"
              stroke="#94a3b8"
              strokeWidth="1.8"
              strokeDasharray="4,4"
              strokeLinejoin="round"
            />
            {attributes.map((attr, idx) => {
              const commScore = commercialBenchmarkMap[attr.key] || 6.0;
              const { x, y } = getCoordinates(idx, commScore);
              return (
                <circle
                  key={`comm-vertex-${idx}`}
                  cx={x}
                  cy={y}
                  r={3}
                  fill="#ffffff"
                  stroke="#94a3b8"
                  strokeWidth="1.5"
                />
              );
            })}

            {/* 3b. The Filled Specialty Spider Data Polygon */}
            <polygon
              points={polygonPoints}
              fill="url(#spiderAmberGlow)"
              stroke="#b45309"
              strokeWidth="2.8"
              strokeLinejoin="round"
              filter="url(#glowDrop)"
              className="transition-all duration-700 ease-out"
            />

            {/* 4. Dots on Data Vertices with Hover Highlighting */}
            {attributes.map((attr, idx) => {
              const { x, y } = getCoordinates(idx, attr.score);
              const isHovered = activeHoverAxis === idx;
              return (
                <g
                  key={`vertex-${idx}`}
                  className="cursor-pointer transition-transform duration-300"
                  onMouseEnter={() => setActiveHoverAxis(idx)}
                  onMouseLeave={() => setActiveHoverAxis(null)}
                >
                  <circle
                    cx={x}
                    cy={y}
                    r={isHovered ? 7 : 5}
                    fill="#ffffff"
                    stroke="#b45309"
                    strokeWidth={isHovered ? 3.5 : 2.5}
                    className="transition-all duration-300"
                  />
                  {/* Score badge bubble on vertex */}
                  <rect
                    x={x - 14}
                    y={y - (isHovered ? 26 : 22)}
                    width="28"
                    height="16"
                    rx="6"
                    fill={isHovered ? '#78350f' : '#ffffff'}
                    stroke="#b45309"
                    strokeWidth="1"
                    className="shadow-xs transition-all"
                  />
                  <text
                    x={x}
                    y={y - (isHovered ? 15 : 11)}
                    textAnchor="middle"
                    className={`text-[10px] font-mono font-black ${
                      isHovered ? 'fill-amber-200' : 'fill-stone-900'
                    }`}
                  >
                    {attr.score.toFixed(1)}
                  </text>
                </g>
              );
            })}

            {/* 5. Axis Labels Around Circumference */}
            {attributes.map((attr, idx) => {
              const { x, y, angle } = getLabelCoordinates(idx);
              const isHovered = activeHoverAxis === idx;
              // Text anchor adjustment based on angle
              let textAnchor: 'start' | 'middle' | 'end' = 'middle';
              if (Math.cos(angle) > 0.3) textAnchor = 'start';
              if (Math.cos(angle) < -0.3) textAnchor = 'end';

              return (
                <g
                  key={`label-${idx}`}
                  className="cursor-pointer"
                  onMouseEnter={() => setActiveHoverAxis(idx)}
                  onMouseLeave={() => setActiveHoverAxis(null)}
                >
                  <text
                    x={x}
                    y={y - 2}
                    textAnchor={textAnchor}
                    className={`text-xs font-black transition-all ${
                      isHovered ? 'fill-amber-900 text-sm' : 'fill-stone-800'
                    }`}
                  >
                    {attr.icon} {attr.shortLabel}
                  </text>
                  <text
                    x={x}
                    y={y + 11}
                    textAnchor={textAnchor}
                    className="text-[10px] font-mono font-bold fill-amber-700"
                  >
                    {attr.score.toFixed(2)} / 10
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Center Specialty Score Tag & Benchmark Legend */}
          <div className="mt-3 text-center space-y-1.5">
            <div>
              <span className="text-[11px] text-stone-500 font-semibold">
                Rata-Rata Karakter Sensori: <strong className="text-stone-950 font-black font-mono">{averageSensoryScore} / 10.00</strong>
              </span>
            </div>

            {/* Benchmark Legend: Specialty vs Commercial Coffee */}
            <div className="flex flex-wrap items-center justify-center gap-3 pt-1 text-[11px]">
              <div className="flex items-center gap-1.5 font-bold text-amber-950">
                <span className="w-3.5 h-2 rounded bg-amber-600 inline-block border border-amber-800 shadow-2xs" />
                <span>Specialty ({averageSensoryScore})</span>
              </div>
              <div className="flex items-center gap-1.5 text-stone-500 font-medium">
                <span className="w-3.5 h-0.5 border-t-2 border-dashed border-stone-400 inline-block" />
                <span>Komersial (6.05)</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Attribute Breakdown Cards / Key-Value List */}
        <div className={flat ? 'lg:col-span-6 space-y-3' : 'lg:col-span-5 space-y-2.5'}>
          <div className="flex items-center justify-between border-b border-stone-200/80 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950">
              Rincian 6 Parameter Cita Rasa:
            </span>
            <span className="text-[10px] text-stone-500 font-mono">Protokol SCA / WCE</span>
          </div>

          <div className="space-y-2.5 pt-1">
            {attributes.map((attr, idx) => {
              const isHovered = activeHoverAxis === idx;
              const pct = Math.max(0, Math.min(100, ((attr.score - 5) / 5) * 100));

              if (flat) {
                return (
                  <div
                    key={idx}
                    onMouseEnter={() => setActiveHoverAxis(idx)}
                    onMouseLeave={() => setActiveHoverAxis(null)}
                    className={`py-2 px-3 rounded-xl transition-all cursor-pointer ${
                      isHovered ? 'bg-amber-100/70' : 'hover:bg-stone-100/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2">
                        <span>{attr.icon}</span>
                        <strong className="text-stone-900 font-bold">{attr.name}</strong>
                      </div>
                      <div className="flex items-center gap-2.5">
                        <div className="w-16 sm:w-24 bg-stone-200/80 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-amber-600 h-full rounded-full transition-all duration-300"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <div className="flex items-center gap-1 font-mono text-xs font-black text-amber-900 w-20 justify-end">
                          <span>{attr.score.toFixed(2)}</span>
                          <span className="text-[9px] text-emerald-700 font-bold bg-emerald-50 px-1 py-0.2 rounded border border-emerald-200/80" title="Kenaikan vs Benchmark Kopi Komersial">
                            +{((attr.score - (commercialBenchmarkMap[attr.key] || 6.0))).toFixed(1)}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center justify-between text-[11px] text-stone-500 mt-1">
                      <span className="truncate pr-2">{attr.description}</span>
                      <span className="text-amber-800 font-semibold shrink-0 text-[10px]">
                        {attr.flavorTones.slice(0, 2).join(', ')}
                      </span>
                    </div>
                  </div>
                );
              }

              return (
                <div
                  key={idx}
                  onMouseEnter={() => setActiveHoverAxis(idx)}
                  onMouseLeave={() => setActiveHoverAxis(null)}
                  className={`p-3 rounded-2xl border transition-all duration-200 cursor-pointer ${
                    isHovered
                      ? 'bg-amber-100/80 border-amber-400 shadow-xs translate-x-1'
                      : 'bg-white/90 border-stone-200 hover:border-amber-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1.5 font-black text-xs text-stone-900">
                      <span>{attr.icon}</span>
                      <span>{attr.name}</span>
                    </div>
                    <span className="font-mono text-xs font-black text-amber-900 bg-amber-100 px-2 py-0.5 rounded-md border border-amber-300">
                      {attr.score.toFixed(2)}
                    </span>
                  </div>

                  <p className="text-[11px] text-stone-600 mt-1 leading-snug">
                    {attr.description}
                  </p>

                  <div className="flex flex-wrap gap-1 mt-1.5">
                    {attr.flavorTones.map((tone, tIdx) => (
                      <span
                        key={tIdx}
                        className="text-[9px] font-bold px-2 py-0.5 bg-amber-50 text-amber-950 rounded-full border border-amber-200"
                      >
                        {tone}
                      </span>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tasting Notes Chips */}
      <div className={flat ? 'pt-2 space-y-2' : 'bg-white/90 rounded-2xl p-4 border border-amber-200/80 space-y-2'}>
        <span className="text-xs font-black text-stone-800 uppercase tracking-wider block">
          🎯 Dominan Flavour Notes &amp; Karakter Cup:
        </span>
        <div className="flex flex-wrap gap-2">
          {tastingNotes.map((note, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-full text-xs font-bold bg-amber-100/70 text-amber-950 border border-amber-300/80 shadow-2xs flex items-center gap-1.5"
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-600" />
              {note}
            </span>
          ))}
        </div>
      </div>
    </div>
  );
};
