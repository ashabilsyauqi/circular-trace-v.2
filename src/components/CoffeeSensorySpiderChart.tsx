import React, { useState } from 'react';
import {
  Sparkles,
  Flame,
  Award,
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
      score: getDynamicScore(9.10, 'Sweetness'),
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

  // Polygon points path string
  const polygonPoints = attributes
    .map((attr, idx) => {
      const { x, y } = getCoordinates(idx, attr.score);
      return `${x.toFixed(2)},${y.toFixed(2)}`;
    })
    .join(' ');

  const averageSensoryScore = Number(
    (attributes.reduce((sum, a) => sum + a.score, 0) / attributes.length).toFixed(2)
  );

  return (
    <div className="bg-gradient-to-br from-amber-950/10 via-stone-50 to-amber-50/40 rounded-3xl p-5 sm:p-7 border border-amber-200/80 shadow-sm space-y-6">
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

        {/* Roasting Spec Badges */}
        <div className="flex items-center gap-2.5 shrink-0">
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-amber-200 text-center shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">Agtron Tile</span>
            <span className="text-base font-black text-stone-900 font-mono">#{agtronNumber}</span>
            <span className="text-[9px] text-amber-700 font-semibold block">{roastLevel}</span>
          </div>
          <div className="bg-white px-3.5 py-2 rounded-2xl border border-amber-200 text-center shadow-2xs">
            <span className="text-[10px] text-stone-400 font-bold block uppercase tracking-wider">DTR Ratio</span>
            <span className="text-base font-black text-amber-900 font-mono">{dtrPercent}%</span>
            <span className="text-[9px] text-stone-500 font-semibold block">Dev. Time</span>
          </div>
        </div>
      </div>

      {/* Preset Simulator Switcher (Optional Interactive Filter) */}
      {interactive && (
        <div className="flex flex-wrap items-center justify-between gap-3 bg-white/80 p-2.5 rounded-2xl border border-amber-200/80">
          <div className="flex items-center gap-2">
            <Flame className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-black uppercase tracking-wider text-amber-950">
              Profil Profil Sangrai:
            </span>
          </div>

          <div className="flex items-center gap-1.5 overflow-x-auto">
            <button
              type="button"
              onClick={() => setSelectedRoastPreset('actual')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                selectedRoastPreset === 'actual'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              ⭐ Profil Aktual ({roastLevel})
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoastPreset('light')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                selectedRoastPreset === 'light'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              🍋 Light Filter (Cerah)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoastPreset('medium')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                selectedRoastPreset === 'medium'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              🍯 Medium Balance (Seimbang)
            </button>
            <button
              type="button"
              onClick={() => setSelectedRoastPreset('dark')}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all shrink-0 flex items-center gap-1 ${
                selectedRoastPreset === 'dark'
                  ? 'bg-amber-600 text-white shadow-xs font-black'
                  : 'text-stone-600 hover:bg-amber-100/60'
              }`}
            >
              🍫 Dark Bold (Mantap)
            </button>
          </div>
        </div>
      )}

      {/* Main Chart & Attribute Details Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
        {/* Left Spider Chart SVG Graphic (7 Cols) */}
        <div className="lg:col-span-7 bg-white rounded-3xl p-4 sm:p-6 border border-amber-200/70 shadow-2xs flex flex-col items-center justify-center relative overflow-hidden">
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

            {/* 3. The Filled Spider Data Polygon */}
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

          {/* Center Specialty Score Tag */}
          <div className="mt-2 text-center">
            <span className="text-[11px] text-stone-500 font-semibold">
              Rata-Rata Karakter Sensori: <strong className="text-stone-950 font-black font-mono">{averageSensoryScore} / 10.00</strong>
            </span>
          </div>
        </div>

        {/* Right Attribute Breakdown Cards (5 Cols) */}
        <div className="lg:col-span-5 space-y-2.5">
          <div className="flex items-center justify-between border-b border-amber-200 pb-2">
            <span className="text-xs font-black uppercase tracking-wider text-amber-950">
              Rincian 6 Parameter Cita Rasa:
            </span>
            <span className="text-[10px] text-stone-500 font-mono">Protokol SCA / WCE</span>
          </div>

          <div className="space-y-2 max-h-[320px] overflow-y-auto pr-1">
            {attributes.map((attr, idx) => {
              const isHovered = activeHoverAxis === idx;
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
      <div className="bg-white/90 rounded-2xl p-4 border border-amber-200/80 space-y-2">
        <span className="text-xs font-black text-stone-800 uppercase tracking-wider block">
          🎯 Dominan Flavour Notes & Karakter Cup:
        </span>
        <div className="flex flex-wrap gap-2">
          {tastingNotes.map((note, idx) => (
            <span
              key={idx}
              className="px-3.5 py-1.5 rounded-xl text-xs font-black bg-gradient-to-r from-amber-50 to-orange-50 text-amber-950 border border-amber-300 shadow-2xs flex items-center gap-1.5"
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
