import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Sprout,
  ShieldCheck,
  Warehouse,
  Flame,
  Coffee,
  QrCode,
  Store,
  HeartHandshake,
  ArrowRight,
  Layers,
  CheckCircle2,
  Droplets,
  Eye,
  Plus,
  Minus,
  X,
  Info
} from 'lucide-react';

// Custom Intersection Observer Hook for on-scroll reveal
function useScrollReveal(threshold = 0.12) {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = elementRef.current;
    if (!el) return;

    if (!('IntersectionObserver' in window)) {
      setIsVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
        }
      },
      { threshold }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return [elementRef, isVisible] as const;
}

export const ServicesShowcaseSection: React.FC = () => {
  const navigate = useNavigate();

  // Scroll reveal references
  const [headerRef, headerVisible] = useScrollReveal(0.15);
  const [sec1Ref, sec1Visible] = useScrollReveal(0.08);
  const [sec2Ref, sec2Visible] = useScrollReveal(0.08);
  const [sec3Ref, sec3Visible] = useScrollReveal(0.08);
  const [sec4Ref, sec4Visible] = useScrollReveal(0.08);

  // =========================================================================
  // SECTION 1 (KEBUN / HULU) INTERACTIVE STATES
  // =========================================================================
  const [activePin1, setActivePin1] = useState<number | null>(1);
  const [showHotspots1, setShowHotspots1] = useState<boolean>(true);
  const [originPreset, setOriginPreset] = useState<'gayo' | 'toraja' | 'kintamani' | 'tilu'>('kintamani');
  const [brixValue, setBrixValue] = useState<number>(21.8);

  const originDetails = {
    gayo: { name: 'Gayo Highlands, Aceh', alt: '1.450 mdpl', var: 'Ateng Super & Tim-Tim', farmer: 'Aman Rayyan (Koperasi Gayo Berkah)' },
    toraja: { name: 'Toraja Sapan, Sulsel', alt: '1.600 mdpl', var: 'Typica & S-795', farmer: 'Mama Agustina (KT Rante Karua)' },
    kintamani: { name: 'Kintamani, Bali', alt: '1.350 mdpl', var: 'Kopyol & USDA 762', farmer: 'Pak Wayan Sudirta (Subak Abian Manik Tirta)' },
    tilu: { name: 'Gunung Tilu, Pangalengan', alt: '1.550 mdpl', var: 'Kartika & Sigarar Utang', farmer: 'Kang Asep (LMDH Tilu Lestari)' },
  };

  const ripenessPercent = Math.min(100, Math.round(((brixValue - 14) / (24 - 14)) * 100));
  const estimatedSweetness = (7.8 + ((brixValue - 16) * 0.18)).toFixed(1);
  const farmerPriceBonus = Math.max(0, Math.round((brixValue - 17) * 750));

  // =========================================================================
  // SECTION 2 (GUDANG & QA) INTERACTIVE STATES
  // =========================================================================
  const [activePin2, setActivePin2] = useState<number | null>(2);
  const [showHotspots2, setShowHotspots2] = useState<boolean>(true);
  const [sackType, setSackType] = useState<'hermetic' | 'jute'>('hermetic');
  const [primaryDefects, setPrimaryDefects] = useState<number>(0);
  const [secondaryDefects, setSecondaryDefects] = useState<number>(2);

  const getScaGrade = () => {
    if (primaryDefects === 0 && secondaryDefects <= 5) {
      return {
        label: 'SPECIALTY GRADE 1',
        status: 'Lolos Ekspor & Cupping 85+',
        badgeColor: 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40',
      };
    } else if (primaryDefects <= 2 && secondaryDefects <= 8) {
      return {
        label: 'PREMIUM GRADE 2',
        status: 'Mutu Terseleksi • Cupping 80-84',
        badgeColor: 'bg-blue-500/20 text-blue-400 border-blue-500/40',
      };
    } else {
      return {
        label: 'COMMERCIAL GRADE',
        status: 'Di Bawah Standar Ekspor • Perlu Sortasi Ulang',
        badgeColor: 'bg-amber-500/20 text-amber-400 border-amber-500/40',
      };
    }
  };

  // =========================================================================
  // SECTION 3 (ROASTERY) INTERACTIVE STATES
  // =========================================================================
  const [activePin3, setActivePin3] = useState<number | null>(1);
  const [showHotspots3, setShowHotspots3] = useState<boolean>(true);
  const [roastLevel, setRoastLevel] = useState<'light' | 'medium' | 'medium-dark'>('light');
  const [activeFlavor, setActiveFlavor] = useState<string>('Jasmine');

  const roastProfiles = {
    light: {
      name: 'Light Roast (Filter / Pour Over)',
      agtron: '#65 Gourmet',
      dropTemp: '202°C',
      cuppingScore: '88.5',
      notes: [
        { name: 'Jasmine', desc: 'Aroma bunga melati putih elegan khas dataran tinggi.' },
        { name: 'Bergamot', desc: 'Sensasi kesegaran sitrat bersih menyegarkan lidah.' },
        { name: 'Peach Blossom', desc: 'Manis buah persik segar dengan aftertaste floral halus.' },
        { name: 'Wild Honey', desc: 'Kekayaan rasa madu hutan alami dari ceri brix tinggi.' },
      ],
    },
    medium: {
      name: 'Medium Roast (Omni / Aeropress & Cold Brew)',
      agtron: '#54 Gourmet',
      dropTemp: '210°C',
      cuppingScore: '87.2',
      notes: [
        { name: 'Red Apple', desc: 'Keasaman malat manis renyah seperti apel merah segar.' },
        { name: 'Caramel', desc: 'Karamelisasi sukrosa optimal di drum pemanggang.' },
        { name: 'Milk Chocolate', desc: 'Rasa cokelat susu manis dan lembut menyelimuti mulut.' },
        { name: 'Roasted Hazelnut', desc: 'Aroma kacang panggang hangat yang gurih seimbang.' },
      ],
    },
    'medium-dark': {
      name: 'Medium-Dark (Espresso & Milk-Based)',
      agtron: '#45 Commercial',
      dropTemp: '218°C',
      cuppingScore: '86.0',
      notes: [
        { name: 'Dark Cocoa', desc: 'Cokelat hitam pekat 85% dengan aftertaste manis panjang.' },
        { name: 'Toasted Almond', desc: 'Karakter nutty pekat yang sangat tebal di sajian espresso.' },
        { name: 'Molasses', desc: 'Gula tetes tebu kental dengan aroma karamel pekat.' },
        { name: 'Spiced Cedar', desc: 'Sentuhan rempah kayu manis dan kayu cedar hangat.' },
      ],
    },
  };

  // =========================================================================
  // SECTION 4 (COFFEE SHOP) INTERACTIVE STATES
  // =========================================================================
  const [activePin4, setActivePin4] = useState<number | null>(1);
  const [showHotspots4, setShowHotspots4] = useState<boolean>(true);
  const [cafeTab, setCafeTab] = useState<'calculator' | 'fairtrade'>('calculator');
  const [cupServings, setCupServings] = useState<number>(1);
  const [cupPrice, setCupPrice] = useState<number>(36000);
  const [showQrModal, setShowQrModal] = useState<boolean>(false);

  // Split of cup price
  const farmerShare = Math.round(cupPrice * 0.38);
  const logisticsShare = Math.round(cupPrice * 0.14);
  const roasterShare = Math.round(cupPrice * 0.22);
  const cafeShare = Math.round(cupPrice * 0.26);

  return (
    <div id="services" className="w-full bg-[#070908] text-stone-100 overflow-hidden scroll-mt-12 select-none">
      {/* ============================================================== */}
      {/* 0. SECTION OVERVIEW HEADER                                     */}
      {/* ============================================================== */}
      <section
        ref={headerRef}
        className={`w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#140F0B] via-[#0E120F] to-[#070908] transition-all duration-700 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Perjalanan Nyata Biji Kopi • Dari Kebun ke Cangkir</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Eksplorasi Objek Nyata &amp; Data Tiap Rantai Pasok
          </h2>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Klik pin hotspot pada foto objek kopi di bawah untuk melihat rincian fisik, atau mainkan simulator interaktif di sebelahnya untuk membuktikan transparansi data kualitas.
          </p>

          {/* Quick jump anchor bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold">
            <a
              href="#sec-kebun"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500 transition-all"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>1. Hulu &amp; Kebun</span>
            </a>
            <a
              href="#sec-gudang"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-950/70 border border-sky-600/40 text-sky-300 hover:bg-sky-900/60 hover:border-sky-500 transition-all"
            >
              <Warehouse className="w-4 h-4 text-sky-400" />
              <span>2. Gudang &amp; QA</span>
            </a>
            <a
              href="#sec-roastery"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/70 border border-amber-600/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500 transition-all"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>3. Roastery</span>
            </a>
            <a
              href="#sec-cafe"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-300 hover:bg-rose-900/60 hover:border-rose-500 transition-all"
            >
              <Coffee className="w-4 h-4 text-rose-400" />
              <span>4. Cafe &amp; Barista</span>
            </a>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 1. TAHAP 1: HULU & KELOMPOK TANI                               */}
      {/* ============================================================== */}
      <section
        id="sec-kebun"
        ref={sec1Ref}
        className={`w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#070908] via-[#06190e] to-[#070908] scroll-mt-14 transition-all duration-700 ease-out ${
          sec1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Real Cutout Image with Hotspots */}
            <div className="lg:col-span-6 relative flex flex-col items-center">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Hotspot Toggle Pill */}
              <div className="w-full flex items-center justify-between mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Objek Nyata: Buah Ceri Kopi Merah (Petik Merah)</span>
                </div>
                <button
                  onClick={() => setShowHotspots1(!showHotspots1)}
                  className="text-xs text-stone-400 hover:text-emerald-400 flex items-center gap-1.5 transition-colors bg-stone-900/70 px-2.5 py-1 rounded-lg border border-stone-800 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHotspots1 ? 'Sembunyikan Pin' : 'Tampilkan Pin'}</span>
                </button>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center p-4 z-10">
                <img
                  src="/images/coffee_cherries.png"
                  alt="Buah Ceri Kopi Merah Segar (Petik Merah)"
                  className="w-full h-auto max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(239,68,68,0.28)] animate-cct-float"
                />

                {/* Hotspot Pins */}
                {showHotspots1 && (
                  <>
                    {/* Pin 1: Kematangan Ceri */}
                    <div className="absolute top-[22%] left-[34%] z-30">
                      <button
                        onClick={() => setActivePin1(activePin1 === 1 ? null : 1)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail kematangan ceri"
                      >
                        <span className="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin1 === 1 ? 'bg-emerald-400 text-stone-950 border-white scale-110' : 'bg-emerald-950/90 text-emerald-300 border-emerald-400 hover:scale-105'
                        }`}>
                          1
                        </span>
                      </button>
                      {activePin1 === 1 && (
                        <div className="absolute top-10 left-0 sm:-left-12 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-emerald-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">Kematangan Ceri (Brix 21.8°)</span>
                            <button onClick={() => setActivePin1(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Sortasi petik merah 98.4% memastikan kandungan gula sukrosa tinggi, memberi profil seduhan manis alami dan asam seimbang.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 2: Batas Lahan EUDR */}
                    <div className="absolute top-[38%] right-[16%] z-30">
                      <button
                        onClick={() => setActivePin1(activePin1 === 2 ? null : 2)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail kepatuhan EUDR"
                      >
                        <span className="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin1 === 2 ? 'bg-emerald-400 text-stone-950 border-white scale-110' : 'bg-emerald-950/90 text-emerald-300 border-emerald-400 hover:scale-105'
                        }`}>
                          2
                        </span>
                      </button>
                      {activePin1 === 2 && (
                        <div className="absolute top-10 right-0 sm:-right-8 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-emerald-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">Poligon Lahan EUDR 2023/1115</span>
                            <button onClick={() => setActivePin1(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Koordinat GPS poligon membuktikan lahan tidak pernah mengalami deforestasi sejak baseline 31 Des 2020. Bebas denda ekspor Uni Eropa.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 3: Pengolahan Basah Wet Mill */}
                    <div className="absolute bottom-[22%] left-[54%] z-30">
                      <button
                        onClick={() => setActivePin1(activePin1 === 3 ? null : 3)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail proses wet mill"
                      >
                        <span className="absolute -inset-2 rounded-full bg-emerald-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin1 === 3 ? 'bg-emerald-400 text-stone-950 border-white scale-110' : 'bg-emerald-950/90 text-emerald-300 border-emerald-400 hover:scale-105'
                        }`}>
                          3
                        </span>
                      </button>
                      {activePin1 === 3 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-emerald-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-emerald-400 uppercase tracking-wide">Proses Wet Mill &amp; pH</span>
                            <button onClick={() => setActivePin1(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Depulping cepat &lt; 6 jam pasca petik untuk mencegah fermentasi liar, dilanjutkan perendaman air bersih dengan pH konstan 4.15.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom hint */}
              <p className="text-xs text-stone-400 text-center mt-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-emerald-400" />
                <span>Klik angka 1, 2, atau 3 pada gambar untuk membaca penjelasan fisik.</span>
              </p>
            </div>

            {/* Right Column: Interactive Studio Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Tahap 01 • Hulu / Petani &amp; Kebun</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Petik Merah Optimal &amp; Verifikasi Lahan EUDR
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Kualitas specialty dimulai dari pohon. Petani mitra mencatat kematangan buah dan titik batas kebun untuk menjamin kepatuhan pasar global serta mendapatkan kompensasi harga yang adil.
                </p>
              </div>

              {/* Origin Presets */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                  Pilih Wilayah Terverifikasi:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {(['kintamani', 'gayo', 'toraja', 'tilu'] as const).map((key) => {
                    const item = originDetails[key];
                    const active = originPreset === key;
                    return (
                      <button
                        key={key}
                        onClick={() => setOriginPreset(key)}
                        className={`px-3 py-2 rounded-xl text-left text-xs font-bold border transition-all cursor-pointer ${
                          active
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/60 shadow-md'
                            : 'bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-white hover:bg-stone-800'
                        }`}
                      >
                        <div className="truncate">{key.toUpperCase()}</div>
                        <div className="text-[10px] text-stone-400 font-normal">{item.alt}</div>
                      </button>
                    );
                  })}
                </div>
                <div className="p-2.5 rounded-lg bg-stone-950/70 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
                  <div>
                    <span className="font-bold text-white">{originDetails[originPreset].name}</span> • {originDetails[originPreset].var}
                  </div>
                  <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/80 px-2 py-0.5 rounded-full border border-emerald-800">
                    EUDR Verified
                  </span>
                </div>
              </div>

              {/* Interactive Brix Sugar Slider */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Droplets className="w-4 h-4 text-emerald-400" />
                    <span className="text-xs font-bold text-stone-200 uppercase tracking-wide">Simulasi Kematangan Gula (Brix Refraktometer)</span>
                  </div>
                  <span className="text-sm font-black text-emerald-400 bg-emerald-950/80 px-2.5 py-0.5 rounded-lg border border-emerald-700/50">
                    {brixValue.toFixed(1)}° Brix
                  </span>
                </div>

                <input
                  type="range"
                  min="16"
                  max="24"
                  step="0.2"
                  value={brixValue}
                  onChange={(e) => setBrixValue(parseFloat(e.target.value))}
                  className="w-full accent-emerald-500 cursor-pointer"
                />

                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <div className="text-[11px] text-stone-400">Petik Merah</div>
                    <div className="text-base font-black text-white mt-0.5">{ripenessPercent}%</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <div className="text-[11px] text-stone-400">Estimasi Rasa Manis</div>
                    <div className="text-base font-black text-emerald-400 mt-0.5">{estimatedSweetness} / 10</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80">
                    <div className="text-[11px] text-stone-400">Bonus Petani / kg</div>
                    <div className="text-base font-black text-amber-400 mt-0.5">+Rp {farmerPriceBonus.toLocaleString()}</div>
                  </div>
                </div>
              </div>

              {/* Direct Farmer Payout Guarantee Badge */}
              <div className="p-3.5 rounded-xl bg-gradient-to-r from-emerald-950/40 via-stone-900 to-stone-900 border border-emerald-800/40 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2.5">
                  <ShieldCheck className="w-5 h-5 text-emerald-400 shrink-0" />
                  <div>
                    <div className="font-bold text-stone-200">Garansi Pembayaran Transparan (Bank Direct)</div>
                    <div className="text-stone-400 text-[11px]">
                      {originDetails[originPreset].farmer} • Rekening BRI Kelompok Tani
                    </div>
                  </div>
                </div>
                <button
                  onClick={() => navigate('/register?role=collector')}
                  className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-1 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Daftar</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 2. TAHAP 2: GUDANG, SORTASI & LOGISTIK EKSPOR                  */}
      {/* ============================================================== */}
      <section
        id="sec-gudang"
        ref={sec2Ref}
        className={`w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#070908] via-[#081522] to-[#070908] scroll-mt-14 transition-all duration-700 ease-out ${
          sec2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Interactive Studio Controls */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-black uppercase tracking-wider">
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>Tahap 02 • Gudang, Sortasi &amp; QA</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Penyimpanan Hermetik &amp; Standar Mutu Ekspor SCA
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Biji hijau (*green beans*) sangat rentan menyerap bau dan lembab. Circular Trace mengawasi kadar air, water activity, dan ambang cacat fisik agar memenuhi standar ekspor internasional.
                </p>
              </div>

              {/* Hermetic vs Jute Comparison Toggle */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                  Simulasi Karung Hermetik vs Goni Konvensional:
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setSackType('hermetic')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      sackType === 'hermetic'
                        ? 'bg-sky-500/20 text-sky-300 border-sky-500/60 shadow-md'
                        : 'bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-white'
                    }`}
                  >
                    ✨ Karung Hermetik CircularTrace
                  </button>
                  <button
                    onClick={() => setSackType('jute')}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      sackType === 'jute'
                        ? 'bg-amber-500/20 text-amber-300 border-amber-500/60 shadow-md'
                        : 'bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-white'
                    }`}
                  >
                    ⚠️ Karung Goni Biasa (Tanpa Liner)
                  </button>
                </div>

                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[11px] text-stone-400">Kadar Air (MC)</div>
                    <div className={`text-base font-black mt-0.5 ${sackType === 'hermetic' ? 'text-sky-400' : 'text-amber-400'}`}>
                      {sackType === 'hermetic' ? '11.2%' : '14.8%'}
                    </div>
                    <div className="text-[10px] text-stone-400">{sackType === 'hermetic' ? 'Ideal (10-12%)' : 'Rentan Jamur'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[11px] text-stone-400">Resiko Cacat Jamur</div>
                    <div className={`text-base font-black mt-0.5 ${sackType === 'hermetic' ? 'text-emerald-400' : 'text-rose-400'}`}>
                      {sackType === 'hermetic' ? '0.0%' : '38.5%'}
                    </div>
                    <div className="text-[10px] text-stone-400">{sackType === 'hermetic' ? 'Aman Ekspor' : 'Ditolak Bea Cukai'}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[11px] text-stone-400">Masa Kesegaran</div>
                    <div className={`text-base font-black mt-0.5 ${sackType === 'hermetic' ? 'text-sky-400' : 'text-stone-400'}`}>
                      {sackType === 'hermetic' ? '24 Bulan' : '4 Bulan'}
                    </div>
                    <div className="text-[10px] text-stone-400">{sackType === 'hermetic' ? 'Aroma Terkunci' : 'Aging Cepat'}</div>
                  </div>
                </div>
              </div>

              {/* Defect Sorting Matrix */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-stone-200 uppercase tracking-wide">
                    Uji Standar Cacat Fisik SCA (Per 350 Gram):
                  </span>
                  <span className={`text-xs font-black px-2.5 py-0.5 rounded-full border ${getScaGrade().badgeColor}`}>
                    {getScaGrade().label}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Cacat Primer (Hitam/Kutu):</span>
                      <span className="font-bold text-white">{primaryDefects} biji</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setPrimaryDefects(Math.max(0, primaryDefects - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="4"
                        value={primaryDefects}
                        onChange={(e) => setPrimaryDefects(parseInt(e.target.value))}
                        className="w-full accent-sky-500 cursor-pointer"
                      />
                      <button
                        onClick={() => setPrimaryDefects(Math.min(4, primaryDefects + 1))}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800/80 space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-stone-400">Cacat Sekunder (Pecah/Kulit):</span>
                      <span className="font-bold text-white">{secondaryDefects} biji</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => setSecondaryDefects(Math.max(0, secondaryDefects - 1))}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Minus className="w-3.5 h-3.5" />
                      </button>
                      <input
                        type="range"
                        min="0"
                        max="12"
                        value={secondaryDefects}
                        onChange={(e) => setSecondaryDefects(parseInt(e.target.value))}
                        className="w-full accent-sky-500 cursor-pointer"
                      />
                      <button
                        onClick={() => setSecondaryDefects(Math.min(12, secondaryDefects + 1))}
                        className="w-7 h-7 rounded-lg bg-stone-800 hover:bg-stone-700 flex items-center justify-center text-white cursor-pointer"
                      >
                        <Plus className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[11px] text-stone-400 flex items-center gap-1.5 pt-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-sky-400" />
                  <span>{getScaGrade().status}</span>
                </div>
              </div>

              {/* Warehouse Action Button */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-sky-950/40 border border-sky-800/40 text-xs">
                <div className="text-stone-300">
                  Kelola batch gudang &amp; cetak label QR karung otomatis.
                </div>
                <button
                  onClick={() => navigate('/register?role=processor')}
                  className="px-3.5 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Daftar Akun Gudang</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Real Cutout Image with Hotspots */}
            <div className="lg:col-span-6 relative flex flex-col items-center order-1 lg:order-2">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Hotspot Toggle Pill */}
              <div className="w-full flex items-center justify-between mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-950/80 border border-sky-500/40 text-sky-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>Objek Nyata: Biji Kopi Beras (Green Bean)</span>
                </div>
                <button
                  onClick={() => setShowHotspots2(!showHotspots2)}
                  className="text-xs text-stone-400 hover:text-sky-400 flex items-center gap-1.5 transition-colors bg-stone-900/70 px-2.5 py-1 rounded-lg border border-stone-800 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHotspots2 ? 'Sembunyikan Pin' : 'Tampilkan Pin'}</span>
                </button>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center p-4 z-10">
                <img
                  src="/images/green_beans.png"
                  alt="Biji Kopi Beras Mentah (Green Beans)"
                  className="w-full h-auto max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(16,185,129,0.25)] animate-cct-float-slow"
                />

                {/* Hotspot Pins */}
                {showHotspots2 && (
                  <>
                    {/* Pin 1: Kadar Air Green Bean */}
                    <div className="absolute top-[28%] left-[46%] z-30">
                      <button
                        onClick={() => setActivePin2(activePin2 === 1 ? null : 1)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail kadar air green bean"
                      >
                        <span className="absolute -inset-2 rounded-full bg-sky-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin2 === 1 ? 'bg-sky-400 text-stone-950 border-white scale-110' : 'bg-sky-950/90 text-sky-300 border-sky-400 hover:scale-105'
                        }`}>
                          1
                        </span>
                      </button>
                      {activePin2 === 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-sky-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-sky-400 uppercase tracking-wide">Kadar Air Green Bean (11.2%)</span>
                            <button onClick={() => setActivePin2(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Biji hijau dikeringkan terukur hingga kadar air 10-12% dan nilai Water Activity (aW) 0.56, menghentikan pertumbuhan jamur dan mengunci mutu fisik.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 2: Sortasi Fisik SCA */}
                    <div className="absolute bottom-[30%] left-[26%] z-30">
                      <button
                        onClick={() => setActivePin2(activePin2 === 2 ? null : 2)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail sortasi fisik green bean"
                      >
                        <span className="absolute -inset-2 rounded-full bg-sky-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin2 === 2 ? 'bg-sky-400 text-stone-950 border-white scale-110' : 'bg-sky-950/90 text-sky-300 border-sky-400 hover:scale-105'
                        }`}>
                          2
                        </span>
                      </button>
                      {activePin2 === 2 && (
                        <div className="absolute bottom-10 left-0 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-sky-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-sky-400 uppercase tracking-wide">Sortasi Fisik Specialty SCA</span>
                            <button onClick={() => setActivePin2(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Standar Specialty Grade 1 mewajibkan 0 cacat primer (biji hitam/kutu) dan maksimal 5 cacat sekunder per sampel 350 gram.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 3: Sertifikat Ekspor KT-9 */}
                    <div className="absolute bottom-[28%] right-[24%] z-30">
                      <button
                        onClick={() => setActivePin2(activePin2 === 3 ? null : 3)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail sertifikat ekspor"
                      >
                        <span className="absolute -inset-2 rounded-full bg-sky-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin2 === 3 ? 'bg-sky-400 text-stone-950 border-white scale-110' : 'bg-sky-950/90 text-sky-300 border-sky-400 hover:scale-105'
                        }`}>
                          3
                        </span>
                      </button>
                      {activePin2 === 3 && (
                        <div className="absolute bottom-10 right-0 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-sky-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-sky-400 uppercase tracking-wide">Sertifikat Phyto KT-9 Karantina</span>
                            <button onClick={() => setActivePin2(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Hasil uji karantina bebas serangga hama bubuk buah kopi (*Hypothenemus hampei*) tersimpan otomatis di paspor batch QR.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom hint */}
              <p className="text-xs text-stone-400 text-center mt-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-sky-400" />
                <span>Klik pin angka 1, 2, atau 3 pada gambar untuk melihat spesifikasi karung ekspor.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 3. TAHAP 3: PENYANGRAIAN / ARTISAN ROASTERY                    */}
      {/* ============================================================== */}
      <section
        id="sec-roastery"
        ref={sec3Ref}
        className={`w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#070908] via-[#1a0c06] to-[#070908] scroll-mt-14 transition-all duration-700 ease-out ${
          sec3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Real Cutout Image with Hotspots */}
            <div className="lg:col-span-6 relative flex flex-col items-center">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Hotspot Toggle Pill */}
              <div className="w-full flex items-center justify-between mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-950/80 border border-amber-500/40 text-amber-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Objek Nyata: Biji Kopi Sangrai (Roasted Beans)</span>
                </div>
                <button
                  onClick={() => setShowHotspots3(!showHotspots3)}
                  className="text-xs text-stone-400 hover:text-amber-400 flex items-center gap-1.5 transition-colors bg-stone-900/70 px-2.5 py-1 rounded-lg border border-stone-800 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHotspots3 ? 'Sembunyikan Pin' : 'Tampilkan Pin'}</span>
                </button>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center p-4 z-10">
                <img
                  src="/images/roasted_beans.png"
                  alt="Biji Kopi Sangrai Specialty (Roasted Beans)"
                  className="w-full h-auto max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(245,158,11,0.25)] animate-cct-float"
                />

                {/* Hotspot Pins */}
                {showHotspots3 && (
                  <>
                    {/* Pin 1: First Crack */}
                    <div className="absolute top-[32%] left-[26%] z-30">
                      <button
                        onClick={() => setActivePin3(activePin3 === 1 ? null : 1)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail First Crack"
                      >
                        <span className="absolute -inset-2 rounded-full bg-amber-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin3 === 1 ? 'bg-amber-400 text-stone-950 border-white scale-110' : 'bg-amber-950/90 text-amber-300 border-amber-400 hover:scale-105'
                        }`}>
                          1
                        </span>
                      </button>
                      {activePin3 === 1 && (
                        <div className="absolute top-10 left-0 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-wide">First Crack (196.4°C)</span>
                            <button onClick={() => setActivePin3(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Momen letupan suara 'pop' pertama ketika uap air seluler keluar dan karamelisasi gula melepaskan aroma floral dan keasaman buah segar.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 2: Agtron Color Scale */}
                    <div className="absolute top-[48%] right-[28%] z-30">
                      <button
                        onClick={() => setActivePin3(activePin3 === 2 ? null : 2)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail warna Agtron"
                      >
                        <span className="absolute -inset-2 rounded-full bg-amber-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin3 === 2 ? 'bg-amber-400 text-stone-950 border-white scale-110' : 'bg-amber-950/90 text-amber-300 border-amber-400 hover:scale-105'
                        }`}>
                          2
                        </span>
                      </button>
                      {activePin3 === 2 && (
                        <div className="absolute top-10 right-0 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-wide">Skala Warna Agtron NIR</span>
                            <button onClick={() => setActivePin3(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Sensor spektrum inframerah memverifikasi keseragaman warna luar dan dalam biji sangrai agar tidak terpanggang gosong di luar namun mentah di dalam.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 3: Degassing Window */}
                    <div className="absolute bottom-[20%] left-[45%] z-30">
                      <button
                        onClick={() => setActivePin3(activePin3 === 3 ? null : 3)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail degassing"
                      >
                        <span className="absolute -inset-2 rounded-full bg-amber-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin3 === 3 ? 'bg-amber-400 text-stone-950 border-white scale-110' : 'bg-amber-950/90 text-amber-300 border-amber-400 hover:scale-105'
                        }`}>
                          3
                        </span>
                      </button>
                      {activePin3 === 3 && (
                        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-amber-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-amber-400 uppercase tracking-wide">Jendela Degassing CO2</span>
                            <button onClick={() => setActivePin3(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Kopi specialty membutuhkan masa istirahat 7-10 hari setelah sangrai di kemasan *one-way valve* agar gas karbon dioksida keluar tanpa menghilangkan aroma volatil.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom hint */}
              <p className="text-xs text-stone-400 text-center mt-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-amber-400" />
                <span>Klik angka 1, 2, atau 3 pada biji sangrai untuk mempelajari profil fisik roasting.</span>
              </p>
            </div>

            {/* Right Column: Interactive Studio Controls */}
            <div className="lg:col-span-6 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Tahap 03 • Artisan Roastery</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Profil Roasting Presisi &amp; Spektrum Cita Rasa
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Suhu drum, laju peningkatan panas (RoR), dan waktu pelepasan menentukan apakah kopi menonjolkan aroma melati sitrat yang cerah atau karamel cokelat yang pekat.
                </p>
              </div>

              {/* Roast Level Selector */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                  Pilih Tingkat Kematangan Sangrai (Roast Level):
                </label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    onClick={() => {
                      setRoastLevel('light');
                      setActiveFlavor('Jasmine');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      roastLevel === 'light'
                        ? 'bg-amber-500/25 text-amber-300 border-amber-500/70 shadow-md'
                        : 'bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-white'
                    }`}
                  >
                    🟡 Light Roast
                  </button>
                  <button
                    onClick={() => {
                      setRoastLevel('medium');
                      setActiveFlavor('Red Apple');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      roastLevel === 'medium'
                        ? 'bg-amber-600/25 text-amber-300 border-amber-600/70 shadow-md'
                        : 'bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-white'
                    }`}
                  >
                    🟠 Medium Roast
                  </button>
                  <button
                    onClick={() => {
                      setRoastLevel('medium-dark');
                      setActiveFlavor('Dark Cocoa');
                    }}
                    className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all text-center cursor-pointer ${
                      roastLevel === 'medium-dark'
                        ? 'bg-amber-700/25 text-amber-300 border-amber-700/70 shadow-md'
                        : 'bg-stone-800/60 text-stone-400 border-stone-700/60 hover:text-white'
                    }`}
                  >
                    🟤 Medium-Dark
                  </button>
                </div>

                {/* Profile Metrics */}
                <div className="grid grid-cols-3 gap-2.5 pt-2">
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[11px] text-stone-400">Agtron Scale</div>
                    <div className="text-sm font-black text-white mt-0.5">{roastProfiles[roastLevel].agtron}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[11px] text-stone-400">Drop Temperature</div>
                    <div className="text-sm font-black text-amber-400 mt-0.5">{roastProfiles[roastLevel].dropTemp}</div>
                  </div>
                  <div className="p-2.5 rounded-xl bg-stone-950 border border-stone-800 text-center">
                    <div className="text-[11px] text-stone-400">Skor Cupping SCA</div>
                    <div className="text-sm font-black text-emerald-400 mt-0.5">{roastProfiles[roastLevel].cuppingScore} / 100</div>
                  </div>
                </div>

                <div className="p-2 rounded-lg bg-stone-950/70 border border-stone-800 text-xs text-stone-300 flex items-center justify-between">
                  <span className="font-semibold text-white">Rekomendasi Seduh:</span>
                  <span className="text-amber-400 font-bold">{roastProfiles[roastLevel].name.split('(')[1].replace(')', '')}</span>
                </div>
              </div>

              {/* Interactive Flavor Wheel Selector */}
              <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-3">
                <label className="text-xs font-bold text-stone-300 block uppercase tracking-wider">
                  Catatan Rasa Cangkir (Klik untuk Mengetahui Asal Mula Rasanya):
                </label>
                <div className="flex flex-wrap gap-2">
                  {roastProfiles[roastLevel].notes.map((note) => {
                    const active = activeFlavor === note.name;
                    return (
                      <button
                        key={note.name}
                        onClick={() => setActiveFlavor(note.name)}
                        className={`px-3 py-1.5 rounded-full text-xs font-bold border transition-all cursor-pointer ${
                          active
                            ? 'bg-amber-500 text-stone-950 border-white shadow-md'
                            : 'bg-stone-800 text-stone-300 border-stone-700 hover:border-amber-500'
                        }`}
                      >
                        ✨ {note.name}
                      </button>
                    );
                  })}
                </div>

                {/* Flavor Detail Card */}
                <div className="p-3 rounded-xl bg-amber-950/20 border border-amber-800/40 text-xs space-y-1 animate-in fade-in duration-150">
                  <div className="font-bold text-amber-300 flex items-center gap-1.5">
                    <span>Deskripsi Rasa {activeFlavor}:</span>
                  </div>
                  <p className="text-stone-300 text-xs leading-relaxed">
                    {roastProfiles[roastLevel].notes.find((n) => n.name === activeFlavor)?.desc ||
                      'Aroma unik yang terkunci berkat pemantauan kurva suhu digital.'}
                  </p>
                </div>
              </div>

              {/* Roastery Action Button */}
              <div className="flex items-center justify-between p-3.5 rounded-xl bg-amber-950/40 border border-amber-800/40 text-xs">
                <div className="text-stone-300">
                  Sinkronisasi profil roasting artisan dengan nomor batch produk.
                </div>
                <button
                  onClick={() => navigate('/register?role=roaster')}
                  className="px-3.5 py-1.5 rounded-lg bg-amber-600 hover:bg-amber-500 text-white font-bold flex items-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Daftar Akun Roastery</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 4. TAHAP 4: HILIR / COFFEE SHOP & MEJA KONSUMEN               */}
      {/* ============================================================== */}
      <section
        id="sec-cafe"
        ref={sec4Ref}
        className={`w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#070908] via-[#160c09] to-[#070908] scroll-mt-14 transition-all duration-700 ease-out ${
          sec4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
            {/* Left Column: Interactive Studio Controls */}
            <div className="lg:col-span-6 space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5" />
                  <span>Tahap 04 • Hilir / Coffee Shop &amp; Barista</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Transparansi Meja Konsumen &amp; Resep Presisi Seduh
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Sajikan lebih dari sekadar secangkir kafein. Konsumen Anda dapat memindai kartu QR di atas meja untuk membaca cerita petani, keaslian varietas, serta transparansi pembagian harga yang adil.
                </p>
              </div>

              {/* Mode Switcher Tabs */}
              <div className="flex rounded-xl bg-stone-900 p-1 border border-stone-800">
                <button
                  onClick={() => setCafeTab('calculator')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    cafeTab === 'calculator'
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <Coffee className="w-3.5 h-3.5" />
                  <span>Kalkulator Seduh Barista</span>
                </button>
                <button
                  onClick={() => setCafeTab('fairtrade')}
                  className={`flex-1 py-2 text-xs font-bold rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    cafeTab === 'fairtrade'
                      ? 'bg-amber-600 text-white shadow-sm'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  <HeartHandshake className="w-3.5 h-3.5" />
                  <span>Transparansi Harga Adil</span>
                </button>
              </div>

              {/* Tab 1: Barista Brew Calculator */}
              {cafeTab === 'calculator' && (
                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-300 uppercase tracking-wider">
                      Jumlah Porsi Cangkir Seduhan:
                    </label>
                    <div className="flex items-center gap-2">
                      {[1, 2, 4].map((count) => (
                        <button
                          key={count}
                          onClick={() => setCupServings(count)}
                          className={`w-8 h-8 rounded-lg font-bold text-xs border transition-all cursor-pointer ${
                            cupServings === count
                              ? 'bg-rose-600 text-white border-white'
                              : 'bg-stone-800 text-stone-300 border-stone-700 hover:text-white'
                          }`}
                        >
                          {count}x
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <div className="text-[10px] text-stone-400 uppercase tracking-wide">Gramasi Biji</div>
                      <div className="text-lg font-black text-white mt-0.5">{cupServings * 15} gr</div>
                      <div className="text-[10px] text-rose-400">Medium Coarse</div>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <div className="text-[10px] text-stone-400 uppercase tracking-wide">Air Panas</div>
                      <div className="text-lg font-black text-rose-400 mt-0.5">{cupServings * 225} ml</div>
                      <div className="text-[10px] text-stone-400">Rasio 1:15</div>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <div className="text-[10px] text-stone-400 uppercase tracking-wide">Suhu Air</div>
                      <div className="text-lg font-black text-amber-400 mt-0.5">92°C</div>
                      <div className="text-[10px] text-stone-400">TDS 120 ppm</div>
                    </div>
                    <div className="p-3 rounded-xl bg-stone-950 border border-stone-800 text-center">
                      <div className="text-[10px] text-stone-400 uppercase tracking-wide">Waktu Tuang</div>
                      <div className="text-lg font-black text-emerald-400 mt-0.5">2m 30s</div>
                      <div className="text-[10px] text-stone-400">3 Tahap Pour</div>
                    </div>
                  </div>

                  <p className="text-xs text-stone-400 leading-relaxed bg-stone-950/70 p-2.5 rounded-xl border border-stone-800/80">
                    💡 <strong className="text-white">Kiat Barista:</strong> Tuangkan 45ml air untuk blooming selama 35 detik pertama untuk meratakan hidrasi grounds sebelum ekstraksi utama.
                  </p>
                </div>
              )}

              {/* Tab 2: Fair-Price Transparency Breakdown */}
              {cafeTab === 'fairtrade' && (
                <div className="p-4 rounded-2xl bg-stone-900/80 border border-stone-800 space-y-4 animate-in fade-in duration-200">
                  <div className="flex items-center justify-between">
                    <label className="text-xs font-bold text-stone-300 uppercase tracking-wide">
                      Simulasi Harga Cangkir di Kafe Anda:
                    </label>
                    <span className="text-sm font-black text-amber-400 bg-amber-950/80 px-2.5 py-0.5 rounded-lg border border-amber-700/50">
                      Rp {cupPrice.toLocaleString()} / cangkir
                    </span>
                  </div>

                  <input
                    type="range"
                    min="25000"
                    max="50000"
                    step="1000"
                    value={cupPrice}
                    onChange={(e) => setCupPrice(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />

                  {/* Stacked bar visualization */}
                  <div className="w-full h-3 rounded-full overflow-hidden flex bg-stone-800">
                    <div style={{ width: '38%' }} className="bg-emerald-500" title="Petani Kebun 38%" />
                    <div style={{ width: '14%' }} className="bg-sky-500" title="Gudang & Logistik 14%" />
                    <div style={{ width: '22%' }} className="bg-amber-500" title="Artisan Roastery 22%" />
                    <div style={{ width: '26%' }} className="bg-rose-500" title="Cafe & Barista 26%" />
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-emerald-900/40 text-center">
                      <div className="text-[10px] text-emerald-400 font-bold uppercase">Petani (38%)</div>
                      <div className="text-sm font-black text-white mt-0.5">Rp {farmerShare.toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-sky-900/40 text-center">
                      <div className="text-[10px] text-sky-400 font-bold uppercase">Gudang (14%)</div>
                      <div className="text-sm font-black text-white mt-0.5">Rp {logisticsShare.toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-amber-900/40 text-center">
                      <div className="text-[10px] text-amber-400 font-bold uppercase">Roaster (22%)</div>
                      <div className="text-sm font-black text-white mt-0.5">Rp {roasterShare.toLocaleString()}</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-stone-950 border border-rose-900/40 text-center">
                      <div className="text-[10px] text-rose-400 font-bold uppercase">Kafe (26%)</div>
                      <div className="text-sm font-black text-white mt-0.5">Rp {cafeShare.toLocaleString()}</div>
                    </div>
                  </div>

                  <p className="text-[11px] text-stone-400 flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span>Petani menerima margin 45% lebih tinggi dibanding sistem tengkulak non-transparan.</span>
                  </p>
                </div>
              )}

              {/* Demo QR Scanner & Cafe CTA */}
              <div className="flex flex-col sm:flex-row items-center gap-3">
                <button
                  onClick={() => setShowQrModal(true)}
                  className="w-full sm:flex-1 py-3 px-4 rounded-xl bg-stone-800 hover:bg-stone-700 text-white font-bold text-xs flex items-center justify-center gap-2 border border-stone-700 transition-all cursor-pointer"
                >
                  <QrCode className="w-4 h-4 text-rose-400" />
                  <span>Simulasi Tampilan HP Konsumen (Scan QR)</span>
                </button>
                <button
                  onClick={() => navigate('/register?role=retailer')}
                  className="w-full sm:w-auto py-3 px-5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shrink-0 cursor-pointer"
                >
                  <span>Daftar Akun Kafe</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Right Column: Real Cutout Image with Hotspots */}
            <div className="lg:col-span-6 relative flex flex-col items-center order-1 lg:order-2">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Hotspot Toggle Pill */}
              <div className="w-full flex items-center justify-between mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-950/80 border border-rose-500/40 text-rose-300 text-xs font-bold">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>Objek Nyata: Cangkir Keramik &amp; Latte Art</span>
                </div>
                <button
                  onClick={() => setShowHotspots4(!showHotspots4)}
                  className="text-xs text-stone-400 hover:text-rose-400 flex items-center gap-1.5 transition-colors bg-stone-900/70 px-2.5 py-1 rounded-lg border border-stone-800 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>{showHotspots4 ? 'Sembunyikan Pin' : 'Tampilkan Pin'}</span>
                </button>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-lg aspect-[4/3] flex items-center justify-center p-4 z-10">
                <img
                  src="/images/coffee_cup.png"
                  alt="Cangkir Kopi Keramik dengan Latte Art"
                  className="w-full h-auto max-h-[380px] object-contain drop-shadow-[0_20px_40px_rgba(244,63,94,0.22)] animate-cct-float-slow"
                />

                {/* Hotspot Pins */}
                {showHotspots4 && (
                  <>
                    {/* Pin 1: Silky Latte Foam Art */}
                    <div className="absolute top-[35%] left-[38%] z-30">
                      <button
                        onClick={() => setActivePin4(activePin4 === 1 ? null : 1)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail latte foam"
                      >
                        <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin4 === 1 ? 'bg-rose-400 text-stone-950 border-white scale-110' : 'bg-rose-950/90 text-rose-300 border-rose-400 hover:scale-105'
                        }`}>
                          1
                        </span>
                      </button>
                      {activePin4 === 1 && (
                        <div className="absolute top-10 left-1/2 -translate-x-1/2 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-rose-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-rose-400 uppercase tracking-wide">Microfoam &amp; Sweet Crema</span>
                            <button onClick={() => setActivePin4(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Susu di-steam pada suhu 60-65°C untuk melarutkan laktosa alami, berpadu dengan crema espresso 9 bar tanpa rasa pahit abu.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 2: Paspor Meja Digital */}
                    <div className="absolute bottom-[22%] left-[22%] z-30">
                      <button
                        onClick={() => setActivePin4(activePin4 === 2 ? null : 2)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail QR meja"
                      >
                        <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin4 === 2 ? 'bg-rose-400 text-stone-950 border-white scale-110' : 'bg-rose-950/90 text-rose-300 border-rose-400 hover:scale-105'
                        }`}>
                          2
                        </span>
                      </button>
                      {activePin4 === 2 && (
                        <div className="absolute bottom-10 left-0 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-rose-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-bottom-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-rose-400 uppercase tracking-wide">QR Table Tent Interaktif</span>
                            <button onClick={() => setActivePin4(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Kartu barcode akrilik di setiap meja kafe yang dapat di-scan pengunjung untuk melihat foto kebun dan peta asal usul kopi mereka.
                          </p>
                        </div>
                      )}
                    </div>

                    {/* Pin 3: Transparansi Harga Adil */}
                    <div className="absolute top-[28%] right-[18%] z-30">
                      <button
                        onClick={() => setActivePin4(activePin4 === 3 ? null : 3)}
                        className="relative group focus:outline-hidden cursor-pointer"
                        title="Klik untuk detail harga adil"
                      >
                        <span className="absolute -inset-2 rounded-full bg-rose-500/40 animate-ping" />
                        <span className={`relative flex items-center justify-center w-8 h-8 rounded-full border-2 font-black text-xs shadow-lg transition-transform ${
                          activePin4 === 3 ? 'bg-rose-400 text-stone-950 border-white scale-110' : 'bg-rose-950/90 text-rose-300 border-rose-400 hover:scale-105'
                        }`}>
                          3
                        </span>
                      </button>
                      {activePin4 === 3 && (
                        <div className="absolute top-10 right-0 w-64 p-3 bg-stone-900/95 backdrop-blur-md border border-rose-500/50 rounded-xl shadow-2xl z-40 text-left animate-in fade-in slide-in-from-top-2 duration-200">
                          <div className="flex items-center justify-between pb-1 border-b border-stone-800 mb-1.5">
                            <span className="text-xs font-black text-rose-400 uppercase tracking-wide">Sertifikasi Fair Share</span>
                            <button onClick={() => setActivePin4(null)} className="text-stone-400 hover:text-white cursor-pointer"><X className="w-3.5 h-3.5" /></button>
                          </div>
                          <p className="text-stone-300 text-xs leading-relaxed">
                            Kafe membuktikan kepedulian etis kepada generasi muda penikmat kopi bahwa setiap tegukan mendukung kesejahteraan keluarga petani.
                          </p>
                        </div>
                      )}
                    </div>
                  </>
                )}
              </div>

              {/* Bottom hint */}
              <p className="text-xs text-stone-400 text-center mt-2 flex items-center gap-1.5">
                <Info className="w-3.5 h-3.5 text-rose-400" />
                <span>Klik pin angka 1, 2, atau 3 pada cangkir untuk melihat fitur transparansi meja kafe.</span>
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* 5. POPUP MODAL: HP CONSUMER SMARTPHONE QR SCAN PREVIEW          */}
      {/* ============================================================== */}
      {showQrModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-in fade-in duration-200">
          <div className="relative w-full max-w-sm rounded-[36px] bg-stone-950 border-4 border-stone-800 p-4 shadow-2xl space-y-4">
            {/* Phone Speaker Notch */}
            <div className="w-24 h-4 bg-stone-900 rounded-full mx-auto flex items-center justify-center">
              <div className="w-12 h-1 bg-stone-700 rounded-full" />
            </div>

            {/* Simulated Mobile Header */}
            <div className="text-center space-y-1 pb-2 border-b border-stone-800">
              <div className="text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Paspor Kopi Terverifikasi</span>
              </div>
              <h4 className="text-base font-black text-white">Kintamani Carbonic Natural</h4>
              <p className="text-xs text-stone-400">Subak Abian Manik Tirta • Elevasi 1.350 mdpl</p>
            </div>

            {/* Verification Card in Mobile Preview */}
            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-bold uppercase">Petani Penanam:</div>
                <div className="font-bold text-white">Pak Wayan Sudirta (Kelompok Tani)</div>
                <div className="text-emerald-400 text-[11px]">✓ EUDR Verified (Bebas Deforestasi)</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-bold uppercase">Profil Roasting &amp; Cita Rasa:</div>
                <div className="font-bold text-amber-400">Light-Medium • Agtron #58</div>
                <div className="text-stone-300 text-[11px]">Catatan: Jeruk Bali, Melati, Madu Liar</div>
              </div>

              <div className="p-3 rounded-xl bg-stone-900 border border-stone-800 space-y-1">
                <div className="text-[10px] text-stone-400 font-bold uppercase">Harga Adil Petani:</div>
                <div className="font-bold text-white">Rp 18.500 / kg ceri basah</div>
                <div className="text-stone-400 text-[10px]">Langsung masuk ke rekening bank kelompok tani</div>
              </div>
            </div>

            {/* Close Modal Button */}
            <button
              onClick={() => setShowQrModal(false)}
              className="w-full py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs transition-colors cursor-pointer"
            >
              Tutup Pratinjau HP
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
