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
} from 'lucide-react';

// Custom Intersection Observer Hook for on-scroll animations
function useScrollReveal(threshold = 0.15) {
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

  // Active sub-tabs inside interactive UI components
  const [activeFarmTab, setActiveFarmTab] = useState<'petani' | 'mill' | 'ics'>('petani');
  const [activeBrewTab, setActiveBrewTab] = useState<'v60' | 'espresso'>('v60');

  // Scroll reveal references for each section
  const [headerRef, headerVisible] = useScrollReveal(0.2);
  const [sec1Ref, sec1Visible] = useScrollReveal(0.12);
  const [sec2Ref, sec2Visible] = useScrollReveal(0.12);
  const [sec3Ref, sec3Visible] = useScrollReveal(0.12);
  const [sec4Ref, sec4Visible] = useScrollReveal(0.12);

  return (
    <div id="services" className="w-full bg-[#0a0d0a] text-stone-100 overflow-hidden scroll-mt-12 select-none">
      {/* ============================================================== */}
      {/* 0. SECTION OVERVIEW HEADER                                     */}
      {/* ============================================================== */}
      <section
        ref={headerRef}
        className={`w-full py-16 sm:py-20 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 bg-gradient-to-b from-[#120F0D] to-[#0A0E0C] transition-all duration-700 ease-out ${
          headerVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6'
        }`}
      >
        <div className="max-w-5xl mx-auto text-center space-y-4">
          <div className="inline-flex items-center gap-2 bg-amber-500/10 text-amber-400 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider shadow-xs">
            <Layers className="w-3.5 h-3.5 text-amber-400" />
            <span>Ekosistem Digital Circular Trace • 4 Solusi Terintegrasi</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-tight">
            Platform Terpadu Sesuai Peran Bisnis Kopi Anda
          </h2>

          <p className="text-stone-300 text-sm sm:text-base max-w-3xl mx-auto leading-relaxed">
            Dari kebun lereng gunung hingga cangkir seduh barista, setiap pelaku rantai pasok memiliki ruang operasional
            khusus dengan alat otomasi cerdas, kepatuhan regulasi EUDR, dan audit sensori SCA berstandar dunia.
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-center gap-3 text-xs text-stone-400">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>EUDR 2023/1115 Deforestation-Free</span>
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-blue-400" />
              <span>SCA Specialty Cupping 10-Atribut</span>
            </span>
            <span className="text-stone-600">•</span>
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-amber-400" />
              <span>Paspor Digital QR Farm-to-Cup</span>
            </span>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 1: KELOMPOK TANI & KOPERASI (HULU PERKEBUNAN)          */}
      {/* Layout: Text Left (col-span-7), UI Component Right (col-span-5)*/}
      {/* ============================================================== */}
      <section
        ref={sec1Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden"
      >
        {/* Thematic Faded Photographic Background (Lush Highland Coffee Plantation) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1524350876685-274059332603?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec1Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.16,
          }}
        />
        {/* Color Gradient Overlay Fading into Deep Forest Emerald */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#06150d] via-[#081e13]/95 to-[#07160e]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#06150d] via-transparent to-[#0a0e0c] pointer-events-none" />

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
                  Tahap 1 • Hulu Perkebunan
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
                  Solusi digitalisasi hulu perkebunan terpadu untuk Gapoktan, koperasi tani, dan konsorsium perkebunan rakyat.
                  Otomatisasi pencatatan petani, pemetaan koordinat GPS poligon lahan anti-deforestasi, hingga pengolahan pasca panen sirkular.
                </p>
              </div>

              {/* 3 Included Pillars breakdown */}
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

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/kelompok-tani')}
                  className="py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-emerald-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Daftarkan Kelompok Tani (Bundle 3 Layanan)</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-emerald-950/60 hover:bg-emerald-900/80 text-emerald-200 border border-emerald-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Demo Panel Hulu</span>
                </button>
              </div>
            </div>

            {/* COLUMN 2: ANIMATED ON-SCROLL UI COMPONENT (5 of 12 cols) */}
            <div
              className={`lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec1Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Interactive Live Farm Terminal Card */}
              <div className="bg-[#0a1a11]/90 rounded-3xl border border-emerald-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-md space-y-4">
                {/* Terminal Header */}
                <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-emerald-500 animate-pulse" />
                    <span className="text-xs font-bold text-emerald-200">
                      Telemetry Hulu • Gapoktan Barokah
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-md">
                    Live Geotagged
                  </span>
                </div>

                {/* Sub-tab interactive switch */}
                <div className="grid grid-cols-3 gap-1.5 p-1 bg-black/40 rounded-xl border border-emerald-900/80 text-[11px] font-bold">
                  <button
                    onClick={() => setActiveFarmTab('petani')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeFarmTab === 'petani'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Plot Petani
                  </button>
                  <button
                    onClick={() => setActiveFarmTab('mill')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeFarmTab === 'mill'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Wet Mill
                  </button>
                  <button
                    onClick={() => setActiveFarmTab('ics')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeFarmTab === 'ics'
                        ? 'bg-emerald-600 text-white shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Audit ICS
                  </button>
                </div>

                {/* Dynamic Tab Body */}
                {activeFarmTab === 'petani' && (
                  <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                    {/* Simulated Polygon Map Card */}
                    <div className="p-3.5 rounded-2xl bg-emerald-950/70 border border-emerald-600/30 space-y-2.5">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-400 flex items-center gap-1.5">
                          <MapPin className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Koordinat Poligon Lahan</span>
                        </span>
                        <span className="font-mono text-emerald-300 font-bold">
                          -7.1428° S, 107.4190° E
                        </span>
                      </div>
                      <div className="h-16 w-full rounded-xl bg-[#06170e] border border-emerald-800/60 relative overflow-hidden flex items-center justify-center">
                        <div className="absolute inset-0 opacity-30 bg-[radial-gradient(#10b981_1px,transparent_1px)] [background-size:12px_12px]" />
                        <div className="relative z-10 flex items-center gap-2 bg-emerald-900/80 px-3 py-1 rounded-full border border-emerald-500/50 text-[10px] text-emerald-200 font-bold">
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                          <span>Status: Bebas Deforestasi EUDR Terverifikasi</span>
                        </div>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-center">
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60">
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">Elevasi Kebun</span>
                        <span className="text-sm font-black text-white mt-0.5 block font-mono">1.480 mdpl</span>
                      </div>
                      <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60">
                        <span className="text-[10px] text-stone-400 block uppercase font-bold">Sortasi Petik</span>
                        <span className="text-sm font-black text-emerald-400 mt-0.5 block font-mono">98.5% Ceri Merah</span>
                      </div>
                    </div>
                  </div>
                )}

                {activeFarmTab === 'mill' && (
                  <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                    <div className="p-3.5 rounded-2xl bg-amber-950/50 border border-amber-600/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-stone-300 font-bold">Batch Olah Basah #WET-042</span>
                        <span className="text-amber-400 font-mono font-bold">Anaerobic Washed</span>
                      </div>
                      <div className="space-y-1.5 pt-1 text-[11px] text-stone-300">
                        <div className="flex justify-between">
                          <span>Durasi Fermentasi:</span>
                          <span className="font-mono text-white font-bold">72 Jam Terkontrol</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Kadar Brix Awal:</span>
                          <span className="font-mono text-amber-300 font-bold">22.8° Brix</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Pengelolaan Limbah:</span>
                          <span className="font-mono text-emerald-300 font-bold">Cascara Tea &amp; Bio-Kompos</span>
                        </div>
                      </div>
                    </div>

                    <div className="p-2.5 rounded-xl bg-black/40 border border-emerald-900/60 flex items-center justify-between text-[11px]">
                      <span className="text-stone-400">Rendemen Ceri ke Gabah:</span>
                      <span className="font-black text-emerald-400 font-mono">18.4% (Optimal)</span>
                    </div>
                  </div>
                )}

                {activeFarmTab === 'ics' && (
                  <div className="space-y-3 animate-in fade-in duration-200 text-xs">
                    <div className="p-3.5 rounded-2xl bg-purple-950/50 border border-purple-600/30 space-y-2">
                      <div className="flex items-center justify-between text-[11px]">
                        <span className="text-purple-300 font-bold">Stempel Audit Internal (ICS)</span>
                        <span className="text-emerald-400 font-mono font-bold">LOLOS VERIFIKASI</span>
                      </div>
                      <ul className="space-y-1.5 pt-1 text-[11px] text-stone-300">
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Pohon pelindung &gt; 30% area kanopi</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Bebas herbisida glifosat pasca-2022</span>
                        </li>
                        <li className="flex items-center gap-1.5">
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span>Uji triase ceri apung &lt; 2% defect</span>
                        </li>
                      </ul>
                    </div>

                    <div className="p-2 rounded-xl bg-purple-900/30 border border-purple-700/50 text-[10px] text-purple-200 text-center font-mono font-bold">
                      ID Verifikasi: ICS-GAP-2026-X9921
                    </div>
                  </div>
                )}

                {/* Footer Telemetry Badge */}
                <div className="pt-1 flex items-center justify-between text-[10px] text-stone-400 border-t border-emerald-900/60">
                  <span className="flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>Terhubung ke Registri Traceability</span>
                  </span>
                  <span>Update Realtime</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 2: GUDANG PENYIMPANAN & QA (LOGISTIK & GREEN BEAN)     */}
      {/* Layout: UI Component Left (col-span-5), Text Right (col-span-7)*/}
      {/* ============================================================== */}
      <section
        ref={sec2Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden"
      >
        {/* Thematic Faded Background (Hermetic Warehouse & Burlap Green Bean Sacks) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec2Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.16,
          }}
        />
        {/* Color Gradient Overlay Fading into Deep Slate Blue */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#070e18] via-[#0b1728]/95 to-[#070f1a]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#070e18] via-transparent to-[#06150d] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* COLUMN 1: ANIMATED ON-SCROLL UI COMPONENT (5 of 12 cols - on Desktop Left) */}
            <div
              className={`order-2 lg:order-1 lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Hermetic Warehouse Climate & SCA QA Terminal */}
              <div className="bg-[#0a1424]/90 rounded-3xl border border-blue-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-blue-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-blue-500 animate-pulse" />
                    <span className="text-xs font-bold text-blue-200">
                      Sensor Iklim Ruang Hermetik GrainPro
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-blue-500/20 text-blue-300 border border-blue-500/40 px-2 py-0.5 rounded-md">
                    IoT Online
                  </span>
                </div>

                {/* 4 Climate Gauges */}
                <div className="grid grid-cols-2 gap-2.5">
                  <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Thermometer className="w-3 h-3 text-blue-400" />
                        <span>Suhu Ruangan</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Optimal</span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">19.5°C</div>
                    <div className="text-[10px] text-stone-400">Target: 18 – 22°C</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Droplets className="w-3 h-3 text-cyan-400" />
                        <span>Kelembapan (RH)</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Stabil</span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">58.2%</div>
                    <div className="text-[10px] text-stone-400">Target: 55 – 65% RH</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <Scale className="w-3 h-3 text-amber-400" />
                        <span>Kadar Air Biji</span>
                      </span>
                      <span className="text-emerald-400 font-bold">SCA Grade</span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">11.4%</div>
                    <div className="text-[10px] text-stone-400">Standar: 10 – 12%</div>
                  </div>

                  <div className="p-3 rounded-2xl bg-black/40 border border-blue-900/60 space-y-1">
                    <div className="flex items-center justify-between text-[10px] text-stone-400">
                      <span className="flex items-center gap-1">
                        <ShieldCheck className="w-3 h-3 text-purple-400" />
                        <span>Water Activity</span>
                      </span>
                      <span className="text-emerald-400 font-bold">Aman</span>
                    </div>
                    <div className="text-xl font-black text-white font-mono">0.58 Aw</div>
                    <div className="text-[10px] text-stone-400">Anti-Kapang Ochratoxin</div>
                  </div>
                </div>

                {/* Defect Triase Sheet Summary */}
                <div className="p-3.5 rounded-2xl bg-blue-950/60 border border-blue-700/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-blue-300">Hasil Triase Fisik Green Bean (350g)</span>
                    <span className="text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-700/60 font-mono">
                      SPECIALTY GRADE 1
                    </span>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[11px] text-stone-300 text-center font-mono">
                    <div className="p-1.5 rounded-lg bg-black/30">
                      <span className="text-[9px] text-stone-400 block">DEFECT PRIMER</span>
                      <span className="font-bold text-emerald-400">0 Biji</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30">
                      <span className="text-[9px] text-stone-400 block">DEFECT SEKUNDER</span>
                      <span className="font-bold text-emerald-400">2 Biji</span>
                    </div>
                    <div className="p-1.5 rounded-lg bg-black/30">
                      <span className="text-[9px] text-stone-400 block">SCREEN SIZE 16+</span>
                      <span className="font-bold text-blue-300">92%</span>
                    </div>
                  </div>
                </div>

                {/* Warehouse Inventory Batch */}
                <div className="p-2.5 rounded-xl bg-black/40 border border-blue-900/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Stok Lot Siap Kirim:</span>
                  <span className="font-mono text-blue-200 font-bold">120 Karung • Lot #CCT-GUD-084</span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: EDITORIAL & NARRATIVE (7 of 12 cols - on Desktop Right) */}
            <div
              className={`order-1 lg:order-2 lg:col-span-7 space-y-6 transition-all duration-700 ease-out ${
                sec2Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              <div className="flex flex-wrap items-center gap-2.5">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/40 text-[11px] font-extrabold uppercase tracking-wider">
                  <Warehouse className="w-3.5 h-3.5 text-blue-400" />
                  Tahap 2 &amp; 3 • Logistik &amp; QA Mutu
                </span>
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-950/80 text-blue-300 border border-blue-700/60 text-[11px] font-bold">
                  <PackageCheck className="w-3 h-3 text-blue-400" />
                  Standarisasi Green Bean SCA
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

              {/* 3 Key Capabilities */}
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

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/gudang')}
                  className="py-3.5 px-6 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-blue-900/40 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Daftar Sebagai Mitra Gudang &amp; QA</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-blue-950/60 hover:bg-blue-900/80 text-blue-200 border border-blue-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Demo Panel Gudang</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 3: ARTISAN ROASTERY & CUPPING LAB                      */}
      {/* Layout: Text Left (col-span-7), UI Component Right (col-span-5)*/}
      {/* ============================================================== */}
      <section
        ref={sec3Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 border-b border-stone-800/80 overflow-hidden"
      >
        {/* Thematic Faded Background (Roaster Machine Drum & Roasted Beans) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1509785307050-d4066910ec1e?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec3Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.17,
          }}
        />
        {/* Color Gradient Overlay Fading into Dark Roast Espresso & Ember Flame */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#110704] via-[#1b0d07]/95 to-[#120804]/90 pointer-events-none" />
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

              {/* 3 Key Capabilities */}
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

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/roaster')}
                  className="py-3.5 px-6 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-orange-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Buka Akun Artisan Roastery</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-orange-950/60 hover:bg-orange-900/80 text-orange-200 border border-orange-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Demo Panel Roaster</span>
                </button>
              </div>
            </div>

            {/* COLUMN 2: ANIMATED ON-SCROLL UI COMPONENT (5 of 12 cols) */}
            <div
              className={`lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec3Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Roastery RoR & SCA Spider Chart Terminal */}
              <div className="bg-[#170a05]/90 rounded-3xl border border-orange-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-orange-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-orange-500 animate-pulse" />
                    <span className="text-xs font-bold text-orange-200">
                      RoR Profile &amp; SCA Sensory Engine
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-orange-500/20 text-orange-300 border border-orange-500/40 px-2 py-0.5 rounded-md">
                    Batch #ROAST-214
                  </span>
                </div>

                {/* Simulated RoR Curve Graphic */}
                <div className="p-3.5 rounded-2xl bg-black/40 border border-orange-900/60 space-y-2">
                  <div className="flex items-center justify-between text-[11px]">
                    <span className="text-stone-300 font-bold flex items-center gap-1.5">
                      <Activity className="w-3.5 h-3.5 text-orange-400" />
                      <span>Kurva Suhu Drum &amp; Rate of Rise (RoR)</span>
                    </span>
                    <span className="font-mono text-orange-400 font-bold">DTR: 15.2%</span>
                  </div>

                  {/* SVG Line Curve Illustration */}
                  <div className="h-20 w-full relative flex items-center">
                    <svg className="w-full h-full overflow-visible" viewBox="0 0 300 80">
                      {/* Grid lines */}
                      <line x1="0" y1="20" x2="300" y2="20" stroke="#33180c" strokeDasharray="3 3" />
                      <line x1="0" y1="50" x2="300" y2="50" stroke="#33180c" strokeDasharray="3 3" />
                      {/* Bean Temp Curve */}
                      <path
                        d="M 10 70 Q 50 78, 90 60 T 170 38 T 240 22 T 290 14"
                        fill="none"
                        stroke="#f97316"
                        strokeWidth="2.5"
                      />
                      {/* RoR Curve */}
                      <path
                        d="M 10 20 Q 50 15, 90 35 T 170 50 T 240 62 T 290 70"
                        fill="none"
                        stroke="#fb923c"
                        strokeWidth="1.5"
                        strokeDasharray="4 2"
                      />
                      {/* First crack mark */}
                      <circle cx="240" cy="22" r="3.5" fill="#f97316" />
                      <text x="220" y="14" fill="#fbbf24" fontSize="9" fontWeight="bold">
                        1st Crack
                      </text>
                    </svg>
                  </div>

                  <div className="grid grid-cols-3 gap-2 pt-1 text-[10px] text-stone-400 text-center font-mono">
                    <div>Turning: 1:15 (95°C)</div>
                    <div>Yellowing: 4:30 (150°C)</div>
                    <div className="text-orange-300 font-bold">Drop: 11:20 (208°C)</div>
                  </div>
                </div>

                {/* SCA Cupping Radar Summary */}
                <div className="p-3.5 rounded-2xl bg-orange-950/60 border border-orange-700/40 space-y-2.5">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-orange-200">SCA Specialty Cupping Score</span>
                    <span className="text-sm font-black text-amber-400 font-mono bg-amber-950/80 px-2.5 py-0.5 rounded-md border border-amber-600/50">
                      87.50 PTS
                    </span>
                  </div>

                  {/* Flavor Notes Tags */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Jasmine', 'Bergamot', 'Wild Honey', 'Peach Blossom', 'Earl Grey Finish'].map((note) => (
                      <span
                        key={note}
                        className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-orange-900/60 text-orange-200 border border-orange-600/40"
                      >
                        {note}
                      </span>
                    ))}
                  </div>

                  <div className="flex items-center justify-between text-[11px] pt-1 text-stone-300">
                    <span>Agtron Gourmet Scale:</span>
                    <span className="font-mono text-amber-300 font-bold">#56.8 (Medium-Light)</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-orange-900/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Status Label Kemasan:</span>
                  <span className="font-mono text-emerald-400 font-bold flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>QR Code Retail Siap Cetak</span>
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ============================================================== */}
      {/* SECTION 4: COFFEE SHOP & BARISTA (HILIR & KONSUMEN)            */}
      {/* Layout: UI Component Left (col-span-5), Text Right (col-span-7)*/}
      {/* ============================================================== */}
      <section
        ref={sec4Ref}
        className="relative w-full py-20 sm:py-28 px-4 sm:px-6 lg:px-8 overflow-hidden"
      >
        {/* Thematic Faded Background (Specialty Coffee Bar & Pour Over Craft) */}
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-transform duration-1000 ease-out pointer-events-none"
          style={{
            backgroundImage: `url('https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1600&auto=format&fit=crop&q=85')`,
            transform: sec4Visible ? 'scale(1)' : 'scale(1.05)',
            opacity: 0.17,
          }}
        />
        {/* Color Gradient Overlay Fading into Roasted Latte & Amber */}
        <div className="absolute inset-0 bg-gradient-to-l from-[#100a06] via-[#1a110a]/95 to-[#100b07]/90 pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0a0705] via-transparent to-[#110704] pointer-events-none" />

        <div className="relative max-w-7xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* COLUMN 1: ANIMATED ON-SCROLL UI COMPONENT (5 of 12 cols - on Desktop Left) */}
            <div
              className={`order-2 lg:order-1 lg:col-span-5 transition-all duration-700 delay-150 ease-out ${
                sec4Visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
              }`}
            >
              {/* Coffee Shop Table Passport Card */}
              <div className="bg-[#19110a]/90 rounded-3xl border border-amber-500/40 shadow-2xl p-5 sm:p-6 backdrop-blur-md space-y-4">
                <div className="flex items-center justify-between pb-3 border-b border-amber-800/60">
                  <div className="flex items-center gap-2.5">
                    <div className="w-3 h-3 rounded-full bg-amber-500 animate-pulse" />
                    <span className="text-xs font-bold text-amber-200">
                      Paspor Digital Meja Konsumen • Meja #04
                    </span>
                  </div>
                  <span className="text-[10px] font-extrabold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/40 px-2 py-0.5 rounded-md">
                    Scan Active
                  </span>
                </div>

                {/* Sub-tab interactive switch: V60 vs Espresso */}
                <div className="grid grid-cols-2 gap-1.5 p-1 bg-black/40 rounded-xl border border-amber-900/80 text-[11px] font-bold">
                  <button
                    onClick={() => setActiveBrewTab('v60')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeBrewTab === 'v60'
                        ? 'bg-amber-600 text-stone-950 font-black shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Resep Filter V60
                  </button>
                  <button
                    onClick={() => setActiveBrewTab('espresso')}
                    className={`py-1.5 px-2 rounded-lg transition-all cursor-pointer ${
                      activeBrewTab === 'espresso'
                        ? 'bg-amber-600 text-stone-950 font-black shadow-xs'
                        : 'text-stone-400 hover:text-stone-200'
                    }`}
                  >
                    Resep Espresso 1:2
                  </button>
                </div>

                {/* Brew Recipe Preview */}
                {activeBrewTab === 'v60' ? (
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-900/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-300 font-bold">Panduan Seduh Barista (V60)</span>
                      <span className="text-amber-400 font-mono font-bold">Rasio 1:15</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                        <span className="text-[9px] text-stone-400 block">SUHU AIR</span>
                        <span className="font-bold text-amber-300">92°C</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                        <span className="text-[9px] text-stone-400 block">WAKTU SEDUH</span>
                        <span className="font-bold text-amber-300">2m 30s</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                        <span className="text-[9px] text-stone-400 block">TARGET TDS</span>
                        <span className="font-bold text-amber-300">1.35%</span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="p-3.5 rounded-2xl bg-black/40 border border-amber-900/60 space-y-2 text-xs">
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="text-stone-300 font-bold">Kalibrasi Espresso Portafilter</span>
                      <span className="text-amber-400 font-mono font-bold">Tekanan 9 Bar</span>
                    </div>
                    <div className="grid grid-cols-3 gap-2 pt-1 text-center font-mono text-[11px]">
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                        <span className="text-[9px] text-stone-400 block">DOSE (IN)</span>
                        <span className="font-bold text-amber-300">18.5g</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                        <span className="text-[9px] text-stone-400 block">YIELD (OUT)</span>
                        <span className="font-bold text-amber-300">37.0g</span>
                      </div>
                      <div className="p-2 rounded-xl bg-amber-950/40 border border-amber-800/40">
                        <span className="text-[9px] text-stone-400 block">EXT. TIME</span>
                        <span className="font-bold text-amber-300">27 Detik</span>
                      </div>
                    </div>
                  </div>
                )}

                {/* Fair Price Transparency Breakdown */}
                <div className="p-3.5 rounded-2xl bg-amber-950/60 border border-amber-700/40 space-y-2 text-xs">
                  <div className="flex items-center justify-between text-[11px] font-bold">
                    <span className="text-amber-200">Transparansi Harga Berkeadilan</span>
                    <span className="text-emerald-400">FAIR TRADE VERIFIED</span>
                  </div>

                  {/* Multi-tier progress bar */}
                  <div className="h-2.5 w-full rounded-full bg-black/60 overflow-hidden flex">
                    <div className="bg-emerald-500 h-full w-[62%]" title="Petani 62%" />
                    <div className="bg-blue-500 h-full w-[18%]" title="Pengolah & QA 18%" />
                    <div className="bg-orange-500 h-full w-[20%]" title="Roastery 20%" />
                  </div>

                  <div className="flex items-center justify-between text-[10px] text-stone-300 pt-1">
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-emerald-500" />
                      <span>Petani (62%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-blue-500" />
                      <span>Pengolah (18%)</span>
                    </span>
                    <span className="flex items-center gap-1">
                      <span className="w-2 h-2 rounded-full bg-orange-500" />
                      <span>Roaster (20%)</span>
                    </span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-black/40 border border-amber-900/60 flex items-center justify-between text-[11px]">
                  <span className="text-stone-400">Scan QR Paspor Asal-Usul:</span>
                  <span className="font-mono text-amber-300 font-bold flex items-center gap-1">
                    <QrCode className="w-3.5 h-3.5" />
                    <span>Cerita Petani Ditampilkan</span>
                  </span>
                </div>
              </div>
            </div>

            {/* COLUMN 2: EDITORIAL & NARRATIVE (7 of 12 cols - on Desktop Right) */}
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

              {/* 3 Key Capabilities */}
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

              {/* Actions */}
              <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5">
                <button
                  onClick={() => navigate('/register/coffee-shop')}
                  className="py-3.5 px-6 rounded-xl bg-amber-600 hover:bg-amber-500 text-stone-950 font-black text-xs sm:text-sm shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center gap-2 cursor-pointer group"
                >
                  <span>Daftarkan Coffee Shop Anda</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>
                <button
                  onClick={() => navigate('/login')}
                  className="py-3.5 px-5 rounded-xl bg-amber-950/60 hover:bg-amber-900/80 text-amber-200 border border-amber-700/50 font-bold text-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Eye className="w-3.5 h-3.5" />
                  <span>Lihat Demo Panel Kafe</span>
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
