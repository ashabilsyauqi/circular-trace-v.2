import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Building2,
  Sprout,
  Cog,
  ShieldCheck,
  Warehouse,
  Thermometer,
  Scale,
  Truck,
  Flame,
  Activity,
  Coffee,
  QrCode,
  Store,
  HeartHandshake,
  Sparkles,
  ArrowRight,
  Layers,
  Award,
  PackageCheck,
  Sliders,
  MapPin,
  CheckCircle2,
  Check,
  Droplets,
  Eye,
  ChevronRight,
  Compass,
  FileCheck,
  ExternalLink,
  Play,
  RotateCcw,
  Plus,
  Minus,
  Smartphone,
  Share2,
  CheckCircle,
  HelpCircle,
  TrendingUp,
  Cpu,
  Radio,
  Zap,
} from 'lucide-react';

// Custom Intersection Observer Hook for on-scroll animations
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
  const [sec1Ref, sec1Visible] = useScrollReveal(0.1);
  const [sec2Ref, sec2Visible] = useScrollReveal(0.1);
  const [sec3Ref, sec3Visible] = useScrollReveal(0.1);
  const [sec4Ref, sec4Visible] = useScrollReveal(0.1);

  // =========================================================================
  // SECTION 1 INTERACTIVE STATES: Agro-Satellite & EUDR Polygon Studio
  // =========================================================================
  const [activeFarmMode, setActiveFarmMode] = useState<'satelit' | 'brix' | 'mill'>('satelit');
  const [activePlotMarker, setActivePlotMarker] = useState<'A' | 'B' | 'C' | 'D'>('A');
  const [cherryRipeness, setCherryRipeness] = useState<number>(98.6);

  // =========================================================================
  // SECTION 2 INTERACTIVE STATES: Hermetic Climate & SCA Defect Simulator
  // =========================================================================
  const [warehouseViewTab, setWarehouseViewTab] = useState<'sensors' | 'triase'>('sensors');
  const [primaryDefects, setPrimaryDefects] = useState<number>(0);
  const [secondaryDefects, setSecondaryDefects] = useState<number>(2);

  const getScaGrade = () => {
    if (primaryDefects === 0 && secondaryDefects <= 5) {
      return {
        label: 'SPECIALTY GRADE 1',
        desc: 'Standar Mutu Tertinggi • Lolos Ekspor & Cupping SCA 85+',
        color: 'text-emerald-400 bg-emerald-950/80 border-emerald-600/50',
      };
    } else if (primaryDefects <= 1 && secondaryDefects <= 8) {
      return {
        label: 'PREMIUM GRADE 2',
        desc: 'Mutu Bagus Komersial Terseleksi • Cupping 80-84',
        color: 'text-blue-400 bg-blue-950/80 border-blue-600/50',
      };
    } else {
      return {
        label: 'COMMERCIAL GRADE',
        desc: 'Di Bawah Standar Specialty • Memerlukan Sortasi Ulang',
        color: 'text-amber-400 bg-amber-950/80 border-amber-600/50',
      };
    }
  };

  // =========================================================================
  // SECTION 3 INTERACTIVE STATES: Roaster Scrubber & 10-Attribute SCA Radar
  // =========================================================================
  const [roastStep, setRoastStep] = useState<number>(4); // 0 to 4
  const [selectedNote, setSelectedNote] = useState<string>('Jasmine');

  const roastTimeline = [
    {
      time: '00:00',
      temp: '200°C',
      phase: 'Charge',
      ror: '--',
      color: '#7fa364', // Green
      name: 'Green Raw Bean',
      desc: 'Biji mentah kadar air 11.4% masuk ke drum terkalibrasi.',
    },
    {
      time: '01:15',
      temp: '95°C',
      phase: 'Turning Point',
      ror: '18.5°C/m',
      color: '#a3b56a', // Pale yellow green
      name: 'Turning Point',
      desc: 'Titik balik suhu terendah sebelum akumulasi panas drum.',
    },
    {
      time: '04:30',
      temp: '150°C',
      phase: 'Yellowing Phase',
      ror: '14.2°C/m',
      color: '#d4aa5d', // Golden tan
      name: 'Drying & Maillard',
      desc: 'Aroma roti panggang, degradasi klorofil, dan reduksi gula.',
    },
    {
      time: '09:12',
      temp: '196°C',
      phase: '1st Crack',
      ror: '8.4°C/m',
      color: '#9e5630', // Cinnamon
      name: 'First Crack!',
      desc: 'Pelepasan uap seluler intensif, karamelisasi asam organik.',
    },
    {
      time: '11:20',
      temp: '208°C',
      phase: 'Drop (Discharge)',
      ror: '5.6°C/m',
      color: '#4e2415', // Rich roast brown
      name: 'Medium-Light Specialty',
      desc: 'Selesai disangrai! DTR 15.2%, Agtron #56.4 terkalibrasi.',
    },
  ];

  const flavorNotesData: Record<string, { desc: string; source: string }> = {
    Jasmine: {
      desc: 'Aroma bunga putih lembut dan bergamot elegan di cangkir seduh.',
      source: 'Dipicu varietas Typica di elevasi 1.550 mdpl Gunung Tilu.',
    },
    Bergamot: {
      desc: 'Keasaman sitrat segar dan sparkling yang bersih (*clean finish*).',
      source: 'Hasil sortasi 98.6% ceri petik merah segar sebelum fermentasi.',
    },
    'Wild Honey': {
      desc: 'Manis madu hutan alami dengan body seduhan yang lembut menyelimuti lidah.',
      source: 'Pengolahan Anaerobic Washed 72 jam dengan kontrol pH 4.15.',
    },
    'Peach Blossom': {
      desc: 'Aroma buah persik matang dan aprikot yang manis aromatik.',
      source: 'Penyimpanan hermetik GrainPro menjaga kestabilan ester buah.',
    },
    'Earl Grey Finish': {
      desc: 'Aftertaste panjang teh hitam bergamot yang berkarakter mewah.',
      source: 'Profil sangrai presisi dengan RoR terkendali saat First Crack.',
    },
  };

  // =========================================================================
  // SECTION 4 INTERACTIVE STATES: Smart Brew Station & Fair-Price Slider
  // =========================================================================
  const [activeBrewMethod, setActiveBrewMethod] = useState<'v60' | 'espresso' | 'japanese'>('v60');
  const [coffeeDose, setCoffeeDose] = useState<number>(15);
  const [cupPrice, setCupPrice] = useState<number>(35000);
  const [isQrPassportActive, setIsQrPassportActive] = useState<boolean>(false);

  // Compute fair trade shares from cup price
  const farmerShare = Math.round(cupPrice * 0.62);
  const millShare = Math.round(cupPrice * 0.18);
  const roasterShare = Math.round(cupPrice * 0.20);

  return (
    <div id="services" className="w-full bg-[#090C0A] text-stone-100 overflow-hidden scroll-mt-12 select-none">
      {/* ============================================================== */}
      {/* 0. SECTION OVERVIEW HEADER                                     */}
      {/* ============================================================== */}
      <section
        ref={headerRef}
        className={`w-full py-16 sm:py-24 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#14100D] via-[#0D110E] to-[#090C0A] transition-all duration-700 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Ekosistem Digital Circular Trace • 4 Studio Interaktif</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Eksplorasi Ruang Kerja Digital Tiap Rantai Pasok
          </h2>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Klik dan operasikan simulasi interaktif di bawah. Rasakan kecanggihan fitur audit EUDR, IoT klimatisasi gudang,
            profiling kurva roasting SCA, hingga paspor transparansi digital meja kafe.
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-4 text-xs font-semibold text-stone-400">
            <span className="flex items-center gap-1.5 bg-emerald-950/60 border border-emerald-700/50 px-3 py-1 rounded-full text-emerald-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              <span>EUDR 2023/1115 Deforestation-Free</span>
            </span>
            <span className="flex items-center gap-1.5 bg-blue-950/60 border border-blue-700/50 px-3 py-1 rounded-full text-blue-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-blue-400" />
              <span>IoT Hermetik &amp; SCA Defect Grading</span>
            </span>
            <span className="flex items-center gap-1.5 bg-amber-950/60 border border-amber-700/50 px-3 py-1 rounded-full text-amber-300">
              <CheckCircle2 className="w-3.5 h-3.5 text-amber-400" />
              <span>RoR Simulator &amp; Paspor QR Meja</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 1: KELOMPOK TANI & KOPERASI (HULU PERKEBUNAN)          */}
      {/* Layout: Text Left (7 cols), Graphic UI Right (5 cols)          */}
      {/* ============================================================== */}
      <section
        ref={sec1Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden"
      >
        {/* Background Image with Deep Emerald Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524350876685-274059332603?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec1Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.16,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#06150d] via-[#071f13]/95 to-[#06150d]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06150d] via-transparent to-[#090c0a] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* COLUMN 1: EDITORIAL & NARRATIVE (7 of 12 cols) */}
            <div
              className={`lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${
                sec1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  <Sprout className="w-3.5 h-3.5 text-emerald-400" />
                  Tahap 1 • Hulu Perkebunan &amp; Olah Basah
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/80 text-emerald-300 border border-emerald-700/60 text-[11px] font-bold">
                  <Sparkles className="w-3 h-3 text-emerald-400" />
                  Bundle Terpadu (3-in-1 Included)
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Kelompok Tani &amp; Koperasi Kopi
                </h3>
                <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed">
                  Solusi digitalisasi hulu kebun terpadu untuk Gapoktan, koperasi tani, dan konsorsium perkebunan rakyat.
                  Otomatisasi pencatatan ratusan petani, pemetaan koordinat GPS poligon anti-deforestasi EUDR, hingga stempel audit mutu panen ceri segar.
                </p>
              </div>

              {/* 3 Included Pillars Modular Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5 pt-2">
                <div className="bg-[#0b2417]/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center font-bold text-xs">
                    <Sprout className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">1. Unit Petani</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Pendataan profil petani, hektar kebun, batas GPS EUDR &amp; panen ceri petik merah.
                  </p>
                </div>

                <div className="bg-[#0b2417]/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs">
                    <Cog className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">2. Unit Wet Mill</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Penerimaan ceri timbang, 7 fermentasi sirkular, rendemen, dan pengelolaan cascara.
                  </p>
                </div>

                <div className="bg-[#0b2417]/80 border border-emerald-500/30 rounded-2xl p-4 space-y-2 backdrop-blur-xs">
                  <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-300 flex items-center justify-center font-bold text-xs">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">3. Verifikator Mutu</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Internal Control System (ICS), uji brix di pohon, inspeksi GAP, &amp; stempel mutu.
                  </p>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/kelompok-tani')}
                  className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Daftarkan Kelompok Tani (Bundle 3 Layanan)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Coba Demo Panel Hulu</span>
                </button>
              </div>
            </div>

            {/* COLUMN 2: HIGH-TECH AGRO-SATELLITE STUDIO (5 of 12 cols) */}
            <div
              className={`lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-[#0b1c12]/95 rounded-3xl border border-emerald-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4 relative overflow-hidden">
                {/* Glow Accent */}
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />

                {/* Studio Header & Interactive Mode Tabs */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-200 font-mono">
                      AGRO-SATELLITE STUDIO v2.4
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md font-mono">
                    ONLINE • GPS SYNC
                  </span>
                </div>

                {/* 3 Interactive Mode Tabs */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/50 rounded-xl border border-emerald-900/80 text-[11px] font-bold">
                  <button
                    onClick={() => setActiveFarmMode('satelit')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeFarmMode === 'satelit'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>🛰️ Poligon GPS</span>
                  </button>
                  <button
                    onClick={() => setActiveFarmMode('brix')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeFarmMode === 'brix'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>🍒 Uji Brix Ceri</span>
                  </button>
                  <button
                    onClick={() => setActiveFarmMode('mill')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1 ${
                      activeFarmMode === 'mill'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <span>⚙️ Wet Mill</span>
                  </button>
                </div>

                {/* MODE 1: INTERACTIVE SATELIT TOPOGRAPHIC POLYGON MAP */}
                {activeFarmMode === 'satelit' && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Topographic Vector Canvas with Polygon Overlay */}
                    <div className="relative h-44 w-full rounded-2xl bg-[#06150e] border border-emerald-600/40 overflow-hidden p-3 flex flex-col justify-between">
                      {/* Grid & Topo contour background */}
                      <div className="absolute inset-0 opacity-25 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:14px_14px]" />
                      
                      {/* Vector Polygon SVG */}
                      <svg className="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 320 160">
                        {/* Topo contour lines */}
                        <path d="M 0 50 Q 80 20, 160 45 T 320 30" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.3" />
                        <path d="M 0 100 Q 100 80, 200 110 T 320 90" fill="none" stroke="#059669" strokeWidth="0.8" opacity="0.3" />
                        
                        {/* Farm Polygon Boundary (Plot #PTN-01) */}
                        <polygon
                          points="60,35 240,40 270,120 90,130"
                          fill="rgba(16, 185, 129, 0.18)"
                          stroke="#10b981"
                          strokeWidth="2"
                          strokeDasharray="4 2"
                        />
                        {/* Shaded Area Accent */}
                        <circle cx="165" cy="85" r="28" fill="rgba(16, 185, 129, 0.12)" />
                      </svg>

                      {/* Interactive Vertex Markers (Clickable A, B, C, D) */}
                      <div className="relative z-10 flex items-center justify-between text-[10px]">
                        <span className="font-mono text-emerald-300 font-bold bg-black/70 px-2 py-0.5 rounded border border-emerald-500/40 flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-emerald-400" />
                          <span>Plot #PTN-01 • 2.4 Hektar</span>
                        </span>
                        <span className="font-mono text-emerald-400 font-bold bg-emerald-950/80 px-2 py-0.5 rounded border border-emerald-600/50">
                          Elevasi 1.550 mdpl
                        </span>
                      </div>

                      {/* Interactive Corner Selector Pins */}
                      <div className="relative z-10 flex items-center justify-center gap-2 pt-8">
                        {(['A', 'B', 'C', 'D'] as const).map((m) => (
                          <button
                            key={m}
                            onClick={() => setActivePlotMarker(m)}
                            className={`w-7 h-7 rounded-lg text-[10px] font-black font-mono transition-all cursor-pointer ${
                              activePlotMarker === m
                                ? 'bg-emerald-500 text-stone-950 shadow-md scale-110 ring-2 ring-emerald-300'
                                : 'bg-black/60 text-emerald-300 hover:bg-emerald-900 border border-emerald-700/60'
                            }`}
                          >
                            Pt-{m}
                          </button>
                        ))}
                      </div>

                      {/* Active Point Coordinates Display */}
                      <div className="relative z-10 flex items-center justify-between text-[10px] bg-black/80 px-2.5 py-1.5 rounded-xl border border-emerald-800/80 font-mono">
                        <span className="text-stone-300">
                          Titik {activePlotMarker}: {activePlotMarker === 'A' ? '-7.1428° S, 107.4190° E' : activePlotMarker === 'B' ? '-7.1432° S, 107.4215° E' : activePlotMarker === 'C' ? '-7.1450° S, 107.4208° E' : '-7.1445° S, 107.4182° E'}
                        </span>
                        <span className="text-emerald-400 font-bold">Akurasi ±1.2m</span>
                      </div>
                    </div>

                    {/* EUDR Compliance Stamp */}
                    <div className="p-3 rounded-2xl bg-emerald-950/70 border border-emerald-600/40 flex items-center justify-between text-xs">
                      <div className="space-y-0.5">
                        <span className="text-[10px] uppercase font-bold text-stone-400 block">Kepatuhan EUDR 2023/1115</span>
                        <span className="font-bold text-emerald-300 flex items-center gap-1.5">
                          <CheckCircle className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Status: Bebas Deforestasi (Lolos Cut-Off 2020)</span>
                        </span>
                      </div>
                      <div className="text-right font-mono text-[10px] text-stone-400">
                        <span>SHA-256 Validated</span>
                        <span className="block text-emerald-400 font-bold">#8f2a...c941</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* MODE 2: INTERACTIVE BRIX REFRACTOMETER & CHERRY RIPENESS SCANNER */}
                {activeFarmMode === 'brix' && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="p-4 rounded-2xl bg-black/50 border border-emerald-800/80 space-y-3">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-stone-200">Simulasi Sortasi Petik Ceri:</span>
                        <span className="font-mono font-black text-amber-400 bg-amber-950/80 px-2 py-0.5 rounded border border-amber-600/50">
                          {cherryRipeness.toFixed(1)}% Petik Merah
                        </span>
                      </div>

                      {/* Interactive Slider */}
                      <input
                        type="range"
                        min="80"
                        max="100"
                        step="0.2"
                        value={cherryRipeness}
                        onChange={(e) => setCherryRipeness(parseFloat(e.target.value))}
                        className="w-full accent-emerald-500 cursor-pointer"
                      />

                      {/* Dynamic Visual Spectrum Bar */}
                      <div className="flex items-center justify-between text-[10px] text-stone-400 font-mono">
                        <span>80% (Ceri Campur)</span>
                        <span className="text-emerald-400 font-bold">98%+ (Specialty Standard)</span>
                        <span>100% (Strict Selection)</span>
                      </div>

                      {/* Refractometer Readout */}
                      <div className="grid grid-cols-2 gap-2.5 pt-1 text-center font-mono">
                        <div className="p-2.5 rounded-xl bg-[#081a10] border border-emerald-700/60">
                          <span className="text-[10px] text-stone-400 block">KADAR KEMANISAN</span>
                          <span className="text-base font-black text-amber-400 mt-0.5 block">
                            {(18.5 + (cherryRipeness - 80) * 0.22).toFixed(1)}° Brix
                          </span>
                        </div>
                        <div className="p-2.5 rounded-xl bg-[#081a10] border border-emerald-700/60">
                          <span className="text-[10px] text-stone-400 block">PREDIKSI SCORE</span>
                          <span className="text-base font-black text-emerald-400 mt-0.5 block">
                            {cherryRipeness >= 95 ? '86.5+ PTS' : '82.0+ PTS'}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-emerald-950/50 border border-emerald-700/40 text-[11px] text-stone-300 flex items-center gap-2">
                      <Sparkles className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>Ceri dengan brix &gt; 22° menghasilkan keasaman malat buah yang seimbang saat difermentasi.</span>
                    </div>
                  </div>
                )}

                {/* MODE 3: WET MILL ZERO-WASTE FERMENTATION LOG */}
                {activeFarmMode === 'mill' && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    <div className="p-3.5 rounded-2xl bg-black/50 border border-emerald-800/80 space-y-2.5 text-xs">
                      <div className="flex items-center justify-between text-[11px] font-bold">
                        <span className="text-stone-200">Stasiun Olah Basah #WET-042</span>
                        <span className="text-amber-400 font-mono">Anaerobic Honey 72 Jam</span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-center font-mono text-[10px]">
                        <div className="p-2 rounded-xl bg-[#081a10] border border-emerald-900">
                          <span className="text-stone-400 block">pH TANGKI</span>
                          <span className="text-sm font-bold text-emerald-400">4.12 pH</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#081a10] border border-emerald-900">
                          <span className="text-stone-400 block">SUHU AIR</span>
                          <span className="text-sm font-bold text-blue-400">18.4°C</span>
                        </div>
                        <div className="p-2 rounded-xl bg-[#081a10] border border-emerald-900">
                          <span className="text-stone-400 block">RENDEMEN</span>
                          <span className="text-sm font-bold text-amber-400">18.4%</span>
                        </div>
                      </div>

                      {/* Zero-Waste Cascara Allocation */}
                      <div className="pt-1 space-y-1">
                        <div className="flex justify-between text-[10px] text-stone-300">
                          <span>Alokasi Limbah Kulit Ceri Sirkular (100% Zero-Waste):</span>
                          <span className="text-emerald-400 font-bold">Tervalidasi</span>
                        </div>
                        <div className="h-2 w-full rounded-full bg-stone-900 overflow-hidden flex">
                          <div className="bg-amber-500 h-full w-[45%]" title="45% Teh Cascara Specialty" />
                          <div className="bg-emerald-500 h-full w-[55%]" title="55% Bio-Kompos Organik" />
                        </div>
                        <div className="flex justify-between text-[9px] text-stone-400">
                          <span>45% Teh Cascara Premium</span>
                          <span>55% Pupuk Kompos Kebun</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Footer Status */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400 border-t border-emerald-900/60 font-mono">
                  <span className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Terhubung ke Registri Paspor Kopi</span>
                  </span>
                  <span>Telemetry Live</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: GUDANG PENYIMPANAN & QA (LOGISTIK & GREEN BEAN)     */}
      {/* Layout: Graphic UI Left (5 cols), Text Right (7 cols)          */}
      {/* ============================================================== */}
      <section
        ref={sec2Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden"
      >
        {/* Background Image with Deep Slate Blue Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec2Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.16,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#070e18] via-[#091524]/95 to-[#070e18]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-[#06150d] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* COLUMN 1: INTERACTIVE HERMETIC IOT & SCA DEFECT SIMULATOR (5 of 12 cols - Desktop Left) */}
            <div
              className={`order-2 lg:order-1 lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-[#091322]/95 rounded-3xl border border-blue-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4 relative overflow-hidden">
                {/* Glow Accent */}
                <div className="absolute -top-16 -left-16 w-44 h-44 bg-blue-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-blue-800/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
                    <span className="text-xs font-bold text-blue-200 font-mono">
                      HERMETIC CLIMATE &amp; QA LAB
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md font-mono">
                    GRAINPRO HERMETIC
                  </span>
                </div>

                {/* Sub-tabs: Sensors vs Interactive Defect Calculator */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/50 rounded-xl border border-blue-900/80 text-[11px] font-bold">
                  <button
                    onClick={() => setWarehouseViewTab('sensors')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      warehouseViewTab === 'sensors'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Thermometer className="w-3.5 h-3.5" />
                    <span>IoT Sensor Iklim</span>
                  </button>
                  <button
                    onClick={() => setWarehouseViewTab('triase')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer flex items-center justify-center gap-1.5 ${
                      warehouseViewTab === 'triase'
                        ? 'bg-blue-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    <Scale className="w-3.5 h-3.5" />
                    <span>Simulator Triase SCA</span>
                  </button>
                </div>

                {/* VIEW 1: IOT TELEMETRY & 24H STABILITY SPARKLINE */}
                {warehouseViewTab === 'sensors' && (
                  <div className="space-y-3 animate-in fade-in duration-200">
                    <div className="grid grid-cols-2 gap-2.5">
                      <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="flex items-center gap-1">
                            <Thermometer className="w-3 h-3 text-blue-400" />
                            <span>Suhu Ruangan</span>
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">18–22°C</span>
                        </div>
                        <div className="text-xl font-black text-white font-mono">19.6°C</div>
                        <div className="text-[10px] text-emerald-400">✓ Kestabilan Optimal</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="flex items-center gap-1">
                            <Droplets className="w-3 h-3 text-cyan-400" />
                            <span>Kelembapan (RH)</span>
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">55–65%</span>
                        </div>
                        <div className="text-xl font-black text-white font-mono">58.2%</div>
                        <div className="text-[10px] text-emerald-400">✓ Aman dari Jamur</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="flex items-center gap-1">
                            <Scale className="w-3 h-3 text-amber-400" />
                            <span>Kadar Air Biji</span>
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">10–12%</span>
                        </div>
                        <div className="text-xl font-black text-white font-mono">11.3%</div>
                        <div className="text-[10px] text-emerald-400">✓ Moisture Meter SNI</div>
                      </div>

                      <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-stone-400">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-purple-400" />
                            <span>Water Activity</span>
                          </span>
                          <span className="text-emerald-400 font-bold font-mono">&lt; 0.60</span>
                        </div>
                        <div className="text-xl font-black text-white font-mono">0.57 Aw</div>
                        <div className="text-[10px] text-emerald-400">✓ Bebas Ochratoxin A</div>
                      </div>
                    </div>

                    {/* 24-Hour Sparkline Curve */}
                    <div className="p-3 rounded-2xl bg-black/50 border border-blue-900/80 space-y-1.5">
                      <div className="flex items-center justify-between text-[10px]">
                        <span className="text-stone-300 font-bold">Kestabilan Sensor 24 Jam (GrainPro Hermetik)</span>
                        <span className="font-mono text-blue-400 font-bold">Deviasi ±0.3°C</span>
                      </div>
                      <div className="h-10 w-full relative flex items-center">
                        <svg className="w-full h-full" viewBox="0 0 300 40">
                          <path
                            d="M 0 20 Q 50 18, 100 21 T 200 19 T 300 20"
                            fill="none"
                            stroke="#3b82f6"
                            strokeWidth="2"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                )}

                {/* VIEW 2: INTERACTIVE SCA GREEN BEAN DEFECT SIMULATOR */}
                {warehouseViewTab === 'triase' && (
                  <div className="space-y-3.5 animate-in fade-in duration-200">
                    {/* Live Calculated Grade Banner */}
                    <div className={`p-3 rounded-2xl border ${getScaGrade().color} space-y-0.5 text-center`}>
                      <span className="text-sm font-black tracking-wider block font-mono">
                        {getScaGrade().label}
                      </span>
                      <p className="text-[11px] opacity-90">{getScaGrade().desc}</p>
                    </div>

                    {/* Interactive Clickable Counters */}
                    <div className="grid grid-cols-2 gap-3 text-xs">
                      {/* Primary Defect */}
                      <div className="p-3 rounded-2xl bg-black/50 border border-blue-900/80 space-y-2 text-center">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">
                          Defect Primer (Black/Sour)
                        </span>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setPrimaryDefects(Math.max(0, primaryDefects - 1))}
                            className="w-7 h-7 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 flex items-center justify-center font-bold cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-black text-xl text-white">{primaryDefects}</span>
                          <button
                            onClick={() => setPrimaryDefects(primaryDefects + 1)}
                            className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] text-stone-400 block">Max 0 untuk Specialty</span>
                      </div>

                      {/* Secondary Defect */}
                      <div className="p-3 rounded-2xl bg-black/50 border border-blue-900/80 space-y-2 text-center">
                        <span className="text-[10px] font-bold uppercase text-stone-400 block">
                          Defect Sekunder (Broken/Hole)
                        </span>
                        <div className="flex items-center justify-center gap-3">
                          <button
                            onClick={() => setSecondaryDefects(Math.max(0, secondaryDefects - 1))}
                            className="w-7 h-7 rounded-lg bg-stone-800 text-stone-200 hover:bg-stone-700 flex items-center justify-center font-bold cursor-pointer"
                          >
                            <Minus className="w-3.5 h-3.5" />
                          </button>
                          <span className="font-mono font-black text-xl text-white">{secondaryDefects}</span>
                          <button
                            onClick={() => setSecondaryDefects(secondaryDefects + 1)}
                            className="w-7 h-7 rounded-lg bg-blue-600 text-white hover:bg-blue-500 flex items-center justify-center font-bold cursor-pointer"
                          >
                            <Plus className="w-3.5 h-3.5" />
                          </button>
                        </div>
                        <span className="text-[9px] text-stone-400 block">Max 5 untuk Specialty</span>
                      </div>
                    </div>

                    <button
                      onClick={() => {
                        setPrimaryDefects(0);
                        setSecondaryDefects(2);
                      }}
                      className="w-full py-2 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 border border-blue-700/50 text-blue-200 text-xs font-bold transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset ke Sampel Baku Specialty (0 / 2)</span>
                    </button>
                  </div>
                )}

                {/* Warehouse Lot Status */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-blue-900/60 flex items-center justify-between text-[11px] font-mono">
                  <span className="text-stone-400">Lot #CCT-GUD-084:</span>
                  <span className="text-blue-200 font-bold">120 Karung • Sertifikat KT-9 Ekspor Siap</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: EDITORIAL & NARRATIVE (7 of 12 cols - Desktop Right) */}
            <div
              className={`order-1 lg:order-2 lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${
                sec2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  <Warehouse className="w-3.5 h-3.5 text-blue-400" />
                  Tahap 2 &amp; 3 • Logistik &amp; QA Mutu Green Bean
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-700/60 text-[11px] font-bold">
                  <PackageCheck className="w-3 h-3 text-blue-400" />
                  Standarisasi Karung GrainPro
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Gudang Penyimpanan &amp; QA Green Bean
                </h3>
                <p className="text-blue-100/90 text-sm sm:text-base leading-relaxed">
                  Sistem kontrol iklim hermetik dengan sensor suhu dan kelembaban ruangan (RH) otomatis. Lengkap dengan lembar uji grading fisik green bean SCA dan sertifikasi karantina ekspor KT-9.
                </p>
              </div>

              {/* 3 Capabilities */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0b1728]/70 border border-blue-500/30">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Pemantauan Sensor Iklim Ruang Hermetik IoT
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Menjaga kestabilan biji mentah dalam kantong GrainPro pada suhu 18–22°C dan kelembaban 55–65% RH agar tidak terjadi degradasi rasa (past crop).
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0b1728]/70 border border-blue-500/30">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                    <Scale className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Lembar Sortasi Fisik &amp; Kalkulasi Defect SCA
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Pencatatan kadar air moisture meter presisi (10–12%), uji water activity Aw, dan klasifikasi defect primer/sekunder berstandar ekspor.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#0b1728]/70 border border-blue-500/30">
                  <div className="p-2 rounded-xl bg-blue-500/20 text-blue-400 shrink-0 mt-0.5">
                    <Truck className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Manajemen Inbound Ceri Giling &amp; Outbound Roastery
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Penerimaan lot kopi dari stasiun pengolah serta surat jalan pengiriman terverifikasi ke seluruh mitra roastery pelanggan.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/gudang')}
                  className="py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Daftar Sebagai Mitra Gudang &amp; QA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Coba Demo Panel Gudang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: ARTISAN ROASTERY & CUPPING LAB                      */}
      {/* Layout: Text Left (7 cols), Graphic UI Right (5 cols)          */}
      {/* ============================================================== */}
      <section
        ref={sec3Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden"
      >
        {/* Background Image with Dark Roast Espresso Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec3Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.17,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-r from-[#110704] via-[#1c0d06]/95 to-[#110704]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#110704] via-transparent to-[#070e18] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* COLUMN 1: EDITORIAL & NARRATIVE (7 of 12 cols) */}
            <div
              className={`lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${
                sec3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 border border-orange-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5 text-orange-400" />
                  Tahap 4 • Penyangraian &amp; Lab Cupping
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-950/80 text-orange-300 border border-orange-700/60 text-[11px] font-bold">
                  <Award className="w-3 h-3 text-orange-400" />
                  Q-Grader Cupping 10-Atribut
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Artisan Roastery &amp; Cupping Lab
                </h3>
                <p className="text-orange-100/90 text-sm sm:text-base leading-relaxed">
                  Software ERP artisan sangrai, profiling kurva Agtron dan Rate of Rise (RoR), kalibrasi sensoris cupping SCA, serta penerbitan stempel QR paspor digital pada kemasan retail.
                </p>
              </div>

              {/* 3 Capabilities */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#200e08]/70 border border-orange-500/30">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                    <Activity className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Kurva Suhu RoR &amp; Perintah Kerja Sangrai (Work Orders)
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Jadwal roasting harian otomatis, pemantauan DTR (Development Time Ratio 14–16%), dan replikasi kurva referensi secara presisi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#200e08]/70 border border-orange-500/30">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Lembar Uji Sensori Spider Chart 10-Atribut SCA
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Form cupping digital resmi Specialty Coffee Association (SCA) dengan spider chart aroma, flavor, acidity, body, dan score total 80+.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#200e08]/70 border border-orange-500/30">
                  <div className="p-2 rounded-xl bg-orange-500/20 text-orange-400 shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Generator Label Kemasan Retail Ber-QR Paspor Digital
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Satu klik cetak stiker kemasan berisi QR code. Pelanggan dapat memindai untuk melihat identitas petani, proses fermentasi, dan profil seduh.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/roaster')}
                  className="py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Buka Akun Artisan Roastery</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-200 border border-orange-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Coba Demo Panel Roaster</span>
                </button>
              </div>
            </div>

            {/* COLUMN 2: INTERACTIVE ROAST SCRUBBER & SENSORY ENGINE (5 of 12 cols) */}
            <div
              className={`lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-[#180b06]/95 rounded-3xl border border-orange-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4 relative overflow-hidden">
                {/* Glow Accent */}
                <div className="absolute -top-16 -right-16 w-44 h-44 bg-orange-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-orange-800/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-orange-400 animate-pulse" />
                    <span className="text-xs font-bold text-orange-200 font-mono">
                      CROPSTER-GRADE ROAST INTELLIGENCE
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-md font-mono">
                    BATCH #ROAST-214
                  </span>
                </div>

                {/* Interactive Roasting Curve & Bean Color Visualizer */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-orange-900/80 space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-stone-200 flex items-center gap-1.5">
                      <Flame className="w-3.5 h-3.5 text-orange-400" />
                      <span>Linimasa Roasting Interaktif (Scrubber):</span>
                    </span>
                    <span className="font-mono text-orange-400 font-bold">
                      {roastTimeline[roastStep].time} ({roastTimeline[roastStep].temp})
                    </span>
                  </div>

                  {/* SVG Curve with Active Step Point */}
                  <div className="h-24 w-full relative">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 320 85">
                      {/* Grid Lines */}
                      <line x1="0" y1="20" x2="320" y2="20" stroke="#3d1b0d" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="320" y2="50" stroke="#3d1b0d" strokeDasharray="3 3" />
                      {/* RoR Curve */}
                      <path
                        d="M 10 20 Q 50 15, 90 35 T 170 52 T 250 64 T 310 70"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      {/* Bean Temperature Curve */}
                      <path
                        d="M 10 75 Q 50 82, 80 65 T 160 42 T 240 24 T 310 16"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                      />
                      {/* 5 Milestone Points along curve */}
                      {[
                        { cx: 10, cy: 75, idx: 0 },
                        { cx: 80, cy: 65, idx: 1 },
                        { cx: 160, cy: 42, idx: 2 },
                        { cx: 240, cy: 24, idx: 3 },
                        { cx: 310, cy: 16, idx: 4 },
                      ].map((pt) => (
                        <circle
                          key={pt.idx}
                          cx={pt.cx}
                          cy={pt.cy}
                          r={roastStep === pt.idx ? 5.5 : 3.5}
                          fill={roastStep === pt.idx ? '#ffffff' : '#f97316'}
                          stroke={roastStep === pt.idx ? '#f97316' : '#ffffff'}
                          strokeWidth="2"
                          className="cursor-pointer transition-all"
                          onClick={() => setRoastStep(pt.idx)}
                        />
                      ))}
                    </svg>
                  </div>

                  {/* Dynamic Bean Swatch & Details */}
                  <div className="p-3 rounded-xl bg-[#220f08] border border-orange-800/60 flex items-center gap-3">
                    {/* Simulated 3D Morphing Bean Swatch */}
                    <div
                      className="w-12 h-12 rounded-2xl shadow-lg border-2 border-white/20 transition-all duration-300 flex items-center justify-center shrink-0"
                      style={{ backgroundColor: roastTimeline[roastStep].color }}
                    >
                      <Coffee className="w-6 h-6 text-white/80" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center justify-between text-xs">
                        <span className="font-bold text-white font-mono">{roastTimeline[roastStep].name}</span>
                        <span className="text-[10px] text-orange-300 font-mono font-bold">
                          RoR: {roastTimeline[roastStep].ror}
                        </span>
                      </div>
                      <p className="text-[11px] text-stone-300 leading-tight mt-0.5 truncate">
                        {roastTimeline[roastStep].desc}
                      </p>
                    </div>
                  </div>

                  {/* 5 Step Milestone Buttons */}
                  <div className="grid grid-cols-5 gap-1 pt-1 font-mono text-[9px] text-center">
                    {roastTimeline.map((item, idx) => (
                      <button
                        key={item.phase}
                        onClick={() => setRoastStep(idx)}
                        className={`py-1.5 px-1 rounded-lg transition-all cursor-pointer truncate ${
                          roastStep === idx
                            ? 'bg-orange-600 text-white font-black shadow-xs'
                            : 'bg-black/40 text-stone-400 hover:text-stone-200'
                        }`}
                      >
                        {item.time}
                      </button>
                    ))}
                  </div>
                </div>

                {/* SCA Cupping Radar & Interactive Flavor Note Explorer */}
                <div className="p-3.5 rounded-2xl bg-orange-950/60 border border-orange-700/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-orange-200">SCA Cupping Lab • 10-Atribut Sensori</span>
                    <span className="text-sm font-black text-amber-400 font-mono bg-amber-950/90 px-2.5 py-0.5 rounded-md border border-amber-600/50">
                      87.50 PTS
                    </span>
                  </div>

                  {/* Interactive Flavor Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-0.5">
                    {Object.keys(flavorNotesData).map((note) => (
                      <button
                        key={note}
                        onClick={() => setSelectedNote(note)}
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full transition-all cursor-pointer ${
                          selectedNote === note
                            ? 'bg-amber-400 text-stone-950 shadow-xs scale-105'
                            : 'bg-orange-900/60 text-orange-200 hover:bg-orange-800 border border-orange-600/40'
                        }`}
                      >
                        {note}
                      </button>
                    ))}
                  </div>

                  {/* Note Provenance Box */}
                  <div className="p-2.5 rounded-xl bg-black/40 border border-orange-900/70 text-[11px] space-y-0.5 animate-in fade-in duration-150">
                    <div className="font-bold text-amber-300 flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-400" />
                      <span>{selectedNote}: {flavorNotesData[selectedNote].desc}</span>
                    </div>
                    <p className="text-[10px] text-stone-400 font-mono">
                      Asal Provenance: {flavorNotesData[selectedNote].source}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: COFFEE SHOP & BARISTA (HILIR & KONSUMEN)            */}
      {/* Layout: Graphic UI Left (5 cols), Text Right (7 cols)          */}
      {/* ============================================================== */}
      <section
        ref={sec4Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Background Image with Roasted Latte Overlay */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec4Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.17,
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-l from-[#100a06] via-[#1a120a]/95 to-[#100b07]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705] via-transparent to-[#110704] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* COLUMN 1: SMART BREW STATION & FAIR-PRICE SIMULATOR (5 of 12 cols - Desktop Left) */}
            <div
              className={`order-2 lg:order-1 lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="bg-[#1a120a]/95 rounded-3xl border border-amber-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-xl space-y-4 relative overflow-hidden">
                {/* Glow Accent */}
                <div className="absolute -top-16 -left-16 w-44 h-44 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />

                <div className="flex items-center justify-between pb-3 border-b border-amber-800/60">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400 animate-pulse" />
                    <span className="text-xs font-bold text-amber-200 font-mono">
                      SMART BREW &amp; PASSPORT SIMULATOR
                    </span>
                  </div>
                  <span className="text-[10px] font-black uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md font-mono">
                    MEJA #04 ACTIVE
                  </span>
                </div>

                {/* Sub-tab Brew Methods */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/50 rounded-xl border border-amber-900/80 text-[11px] font-bold">
                  <button
                    onClick={() => setActiveBrewMethod('v60')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeBrewMethod === 'v60'
                        ? 'bg-amber-600 text-stone-950 font-black shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Filter V60
                  </button>
                  <button
                    onClick={() => setActiveBrewMethod('espresso')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeBrewMethod === 'espresso'
                        ? 'bg-amber-600 text-stone-950 font-black shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Espresso 1:2
                  </button>
                  <button
                    onClick={() => setActiveBrewMethod('japanese')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeBrewMethod === 'japanese'
                        ? 'bg-amber-600 text-stone-950 font-black shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Japanese Iced
                  </button>
                </div>

                {/* Dynamic Brew Calculator */}
                <div className="p-3.5 rounded-2xl bg-black/50 border border-amber-900/80 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="font-bold text-stone-200">Kalkulator Dosis Biji &amp; Air:</span>
                    <div className="flex items-center gap-1.5">
                      {[12, 15, 18, 20].map((d) => (
                        <button
                          key={d}
                          onClick={() => setCoffeeDose(d)}
                          className={`w-6 h-6 rounded-md text-[10px] font-mono font-bold transition-all cursor-pointer ${
                            coffeeDose === d
                              ? 'bg-amber-500 text-stone-950 shadow-xs'
                              : 'bg-stone-800 text-stone-300 hover:bg-stone-700'
                          }`}
                        >
                          {d}g
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center font-mono text-[11px] pt-1">
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                      <span className="text-[9px] text-stone-400 block">TOTAL AIR</span>
                      <span className="font-bold text-amber-300">
                        {activeBrewMethod === 'v60' ? `${coffeeDose * 15} ml` : activeBrewMethod === 'espresso' ? `${coffeeDose * 2} g` : `${coffeeDose * 13} ml`}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                      <span className="text-[9px] text-stone-400 block">SUHU SEDUH</span>
                      <span className="font-bold text-amber-300">
                        {activeBrewMethod === 'espresso' ? '93.5°C (9 Bar)' : '92.0°C'}
                      </span>
                    </div>
                    <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                      <span className="text-[9px] text-stone-400 block">TARGET TDS</span>
                      <span className="font-bold text-amber-300">
                        {activeBrewMethod === 'espresso' ? '9.5% TDS' : '1.36% TDS'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Interactive Fair-Price Transparency Slider */}
                <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-700/40 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-200">Transparansi Bagi Hasil (Fair Trade):</span>
                    <span className="text-amber-400 font-mono">Rp {cupPrice.toLocaleString('id-ID')} / Cup</span>
                  </div>

                  {/* Cup Price Range Slider */}
                  <input
                    type="range"
                    min="25000"
                    max="50000"
                    step="1000"
                    value={cupPrice}
                    onChange={(e) => setCupPrice(parseInt(e.target.value))}
                    className="w-full accent-amber-500 cursor-pointer"
                  />

                  {/* Dynamic Shares Breakdown */}
                  <div className="h-2.5 w-full rounded-full bg-black/60 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[62%]" title="Petani 62%" />
                    <div className="bg-blue-500 h-full w-[18%]" title="Pengolah & QA 18%" />
                    <div className="bg-orange-500 h-full w-[20%]" title="Roastery 20%" />
                  </div>

                  <div className="grid grid-cols-3 gap-1 text-[10px] text-stone-300 font-mono text-center">
                    <div className="bg-black/40 p-1.5 rounded-lg border border-emerald-900/60">
                      <span className="text-[9px] text-emerald-400 block font-bold">PETANI (62%)</span>
                      <span className="font-bold text-white">Rp {farmerShare.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="bg-black/40 p-1.5 rounded-lg border border-blue-900/60">
                      <span className="text-[9px] text-blue-400 block font-bold">MILL &amp; QA (18%)</span>
                      <span className="font-bold text-white">Rp {millShare.toLocaleString('id-ID')}</span>
                    </div>
                    <div className="bg-black/40 p-1.5 rounded-lg border border-orange-900/60">
                      <span className="text-[9px] text-orange-400 block font-bold">ROASTER (20%)</span>
                      <span className="font-bold text-white">Rp {roasterShare.toLocaleString('id-ID')}</span>
                    </div>
                  </div>
                </div>

                {/* Scan Table Passport Trigger Button */}
                <button
                  type="button"
                  onClick={() => setIsQrPassportActive(!isQrPassportActive)}
                  className="w-full py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 border border-amber-500/40 text-amber-200 text-xs font-bold transition-all flex items-center justify-center gap-2 cursor-pointer shadow-sm"
                >
                  <QrCode className="w-4 h-4 text-amber-400" />
                  <span>{isQrPassportActive ? 'Tutup Pratinjau Paspor' : 'Simulasi Scan Paspor Meja Konsumen'}</span>
                </button>

                {/* Simulated Smartphone Screen Pop-up */}
                {isQrPassportActive && (
                  <div className="p-3.5 rounded-2xl bg-black/80 border border-amber-400/60 space-y-2 text-xs animate-in zoom-in-95 duration-150">
                    <div className="flex items-center justify-between text-[11px] font-bold text-amber-300">
                      <span className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span>Paspor Kopi Konsumen • QR Terbuka</span>
                      </span>
                      <span className="text-emerald-400 font-mono">100% Verified</span>
                    </div>
                    <p className="text-[11px] text-stone-300 leading-relaxed">
                      "Secangkir kopi ini berasal dari kebun Pak Asep di Gunung Tilu (1.550 mdpl), varietas Sigarar Utang, difermentasi Anaerobic Washed selama 72 jam, dan disangrai dengan profil Medium-Light oleh Karsa Roastery."
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* COLUMN 2: EDITORIAL & NARRATIVE (7 of 12 cols - Desktop Right) */}
            <div
              className={`order-1 lg:order-2 lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${
                sec4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  <Coffee className="w-3.5 h-3.5 text-amber-400" />
                  Tahap 5 • Hilir &amp; Seduh Konsumen
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-950/80 text-amber-300 border border-amber-700/60 text-[11px] font-bold">
                  <Store className="w-3 h-3 text-amber-400" />
                  B2B Roasted Beans &amp; QR Meja
                </span>
              </div>

              <div className="space-y-3">
                <h3 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
                  Coffee Shop &amp; Barista
                </h3>
                <p className="text-amber-100/90 text-sm sm:text-base leading-relaxed">
                  Sajikan setiap cangkir kopi spesialti dengan transparansi penuh dari kebun hingga ke meja seduh. Tingkatkan loyalitas pelanggan kedai kopi melalui narasi asal-usul otentik dan komitmen fair price.
                </p>
              </div>

              {/* 3 Capabilities */}
              <div className="space-y-3 pt-2 text-xs sm:text-sm text-stone-300">
                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1d120a]/70 border border-amber-500/30">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <Store className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Akses Pasokan Roasted Beans Kualitas Terjamin
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Langsung terhubung dengan roastery artisan terverifikasi. Transaksi transparan dengan sertifikat uji cupping dan profil sangrai resmi.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1d120a]/70 border border-amber-500/30">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Paspor Digital QR Code Meja Pengunjung
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Pajang standee QR di meja kafe. Pengunjung dapat memindai via smartphone untuk melihat kisah petani, foto kebun, dan panduan tasting notes seduhan.
                    </p>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-3 rounded-2xl bg-[#1d120a]/70 border border-amber-500/30">
                  <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400 shrink-0 mt-0.5">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="font-bold text-white text-xs uppercase tracking-wider">
                      Sertifikat Transparansi Harga Berkeadilan (Fair Price)
                    </h4>
                    <p className="text-stone-300 text-xs mt-0.5 leading-relaxed">
                      Buktikan integritas kedai kopi Anda dengan sertifikat digital yang membuktikan bahwa petani hulu menerima bagi hasil yang layak dan bermartabat.
                    </p>
                  </div>
                </div>
              </div>

              {/* CTAs */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/coffee-shop')}
                  className="py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/60 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Daftarkan Coffee Shop Anda</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Coba Demo Panel Kafe</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ServicesShowcaseSection;
