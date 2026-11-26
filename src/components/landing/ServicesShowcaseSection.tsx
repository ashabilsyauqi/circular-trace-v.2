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
  Scale,
  FileCheck,
  Activity,
  Award,
  Globe2,
  Thermometer,
  Cpu,
  BadgeCheck
} from 'lucide-react';

// Custom Intersection Observer Hook for on-scroll reveal
function useScrollReveal(threshold = 0.1) {
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

  // Scroll reveal references for smooth scroll appearance
  const [headerRef, headerVisible] = useScrollReveal(0.12);
  const [sec1Ref, sec1Visible] = useScrollReveal(0.08);
  const [sec2Ref, sec2Visible] = useScrollReveal(0.08);
  const [sec3Ref, sec3Visible] = useScrollReveal(0.08);
  const [sec4Ref, sec4Visible] = useScrollReveal(0.08);

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
            <span>Ekosistem Rantai Pasok Kopi Sirkular • Seed to Cup</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight leading-tight">
            Cakupan Layanan Digital Terintegrasi
          </h2>

          <p className="text-stone-300 text-sm sm:text-base md:text-lg max-w-3xl mx-auto leading-relaxed">
            Circular Trace menghubungkan setiap mata rantai industri kopi specialty—dari verifikasi kebun petani, standardisasi mutu green bean di gudang, kontrol profil sangrai roastery, hingga transparansi paspor meja konsumen di kafe.
          </p>

          {/* Quick jump anchor bar */}
          <div className="pt-4 flex flex-wrap items-center justify-center gap-2 sm:gap-3 text-xs font-bold">
            <a
              href="#sec-kebun"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-emerald-950/70 border border-emerald-600/40 text-emerald-300 hover:bg-emerald-900/60 hover:border-emerald-500 transition-all cursor-pointer"
            >
              <Sprout className="w-4 h-4 text-emerald-400" />
              <span>1. Hulu / Kelompok Tani</span>
            </a>
            <a
              href="#sec-gudang"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-sky-950/70 border border-sky-600/40 text-sky-300 hover:bg-sky-900/60 hover:border-sky-500 transition-all cursor-pointer"
            >
              <Warehouse className="w-4 h-4 text-sky-400" />
              <span>2. Gudang &amp; QA Logistik</span>
            </a>
            <a
              href="#sec-roastery"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-amber-950/70 border border-amber-600/40 text-amber-300 hover:bg-amber-900/60 hover:border-amber-500 transition-all cursor-pointer"
            >
              <Flame className="w-4 h-4 text-amber-400" />
              <span>3. Artisan Roastery</span>
            </a>
            <a
              href="#sec-cafe"
              className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-rose-950/70 border border-rose-600/40 text-rose-300 hover:bg-rose-900/60 hover:border-rose-500 transition-all cursor-pointer"
            >
              <Coffee className="w-4 h-4 text-rose-400" />
              <span>4. Coffee Shop &amp; Retail</span>
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
            {/* Left Column: Visual Real Cutout Image (Red Coffee Cherries) */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Status Badge */}
              <div className="w-full flex items-center justify-start mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/90 border border-emerald-500/50 text-emerald-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                  <span>Tahap 01: Buah Ceri Kopi Merah (Petik Merah)</span>
                </div>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4 z-10">
                <img
                  src="/images/fresh_cherries_branch.png"
                  alt="Buah Ceri Kopi Merah Segar Petik Kebun"
                  className="w-full h-auto max-h-[360px] object-contain drop-shadow-[0_20px_45px_rgba(239,68,68,0.35)] animate-cct-float"
                />
              </div>

              {/* Metadata Chip */}
              <div className="mt-2 text-center text-xs text-stone-400 bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                <span className="text-emerald-400 font-bold">Standard Mutu:</span> Sortasi Petik Merah 95%+ • Kadar Brix Gula 20°–24°
              </div>
            </div>

            {/* Right Column: Clear Service Scope & Coverage */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-black uppercase tracking-wider">
                  <Sprout className="w-3.5 h-3.5" />
                  <span>Layanan Hulu • Petani, Kebun &amp; Kelompok Tani</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Manajemen Kebun, Audit Lahan EUDR &amp; Mutu Panen Ceri
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Layanan komprehensif bagi kelompok tani (Gapoktan) dan koperasi untuk mendigitalkan data kepemilikan lahan, pencatatan harian panen, serta kepatuhan standar ekspor internasional sejak dari pohon.
                </p>
              </div>

              {/* 4 Scope Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. EUDR Compliance */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Globe2 className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Pemetaan Poligon GPS &amp; EUDR</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Perekaman koordinat poligon batas lahan kebun untuk verifikasi bebas deforestasi sesuai regulasi Uni Eropa (EUDR 2023/1115).
                  </p>
                </div>

                {/* 2. Harvest & Brix Log */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Droplets className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sortasi Petik Merah &amp; Uji Brix</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Pencatatan volume ceri harian per varietas, persentase petik merah, dan uji kadar kematangan gula refraktometer untuk mutu specialty.
                  </p>
                </div>

                {/* 3. Wet Mill Process Tracking */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <Activity className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Log Pascapanen &amp; Fermentasi</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Pencatatan batch pulping dalam kurun waktu 6 jam, durasi fermentasi terkontrol, dan pemantauan pH perendaman secara digital.
                  </p>
                </div>

                {/* 4. Direct Payout & Ledger */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-emerald-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                    <ShieldCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Buku Kas &amp; Pembayaran Adil</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Buku kas digital pembelian ceri transparan dengan transfer langsung ke rekening kelompok tani, memutus rantai tengkulak liar.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate('/register/kelompok-tani')}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Daftar Layanan Kelompok Tani</span>
                  <ArrowRight className="w-3.5 h-3.5" />
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
            {/* Left Column: Clear Service Scope & Coverage */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-sky-500/10 border border-sky-500/30 text-sky-400 text-xs font-black uppercase tracking-wider">
                  <Warehouse className="w-3.5 h-3.5" />
                  <span>Layanan Tengah • Gudang, Sortasi &amp; QA Logistik</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Manajemen Gudang Green Bean, Uji Mutu SCA &amp; Ekspor
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Platform manajemen inventori green bean profesional bagi prosesor, gudang kering (*dry mill*), dan eksportir untuk menjaga stabilitas kadar air serta kelulusan dokumen karantina internasional.
                </p>
              </div>

              {/* 4 Scope Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Moisture & Water Activity */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-sky-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Monitoring Kadar Air &amp; aW</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Pengawasan kadar air green bean (standar 10-12%) dan Water Activity di bawah 0.60 untuk mencegah pertumbuhan jamur aflatoksin.
                  </p>
                </div>

                {/* 2. SCA Defect Grading */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-sky-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <Scale className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Standar Grading Fisik SCA</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Inspeksi cacat primer dan sekunder per 350 gram sampel sesuai protokol Specialty Coffee Association untuk sertifikasi Grade 1 Ekspor.
                  </p>
                </div>

                {/* 3. Barcode Labeling & Hermetic */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-sky-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Label QR Karung &amp; Liner Hermetik</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Penerbitan label barcode QR unik per karung goni/GrainPro 60 kg untuk melacak nomor lot, asal subak, tanggal panen, dan riwayat gudang.
                  </p>
                </div>

                {/* 4. Quarantine & Export Cert */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-sky-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-sky-500/20 text-sky-400 flex items-center justify-center">
                    <FileCheck className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sertifikat Phyto KT-9 &amp; Ekspor</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Integrasi dokumen karantina tumbuhan bebas serangga hama bubuk kopi serta sertifikat asal barang (SKA) siap kirim ke buyer global.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate('/register/gudang')}
                  className="px-5 py-2.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Daftar Layanan Gudang &amp; QA</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Real Cutout Image (Green Coffee Beans) */}
            <div className="lg:col-span-5 relative flex flex-col items-center order-1 lg:order-2">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-sky-500/15 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Status Badge */}
              <div className="w-full flex items-center justify-start mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-sky-950/90 border border-sky-500/50 text-sky-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-sky-400 animate-ping" />
                  <span>Tahap 02: Biji Kopi Beras Mentah (Green Beans)</span>
                </div>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4 z-10">
                <img
                  src="/images/green_beans.png"
                  alt="Biji Kopi Beras Mentah Green Beans Specialty"
                  className="w-full h-auto max-h-[340px] object-contain drop-shadow-[0_20px_45px_rgba(16,185,129,0.28)] animate-cct-float-slow"
                />
              </div>

              {/* Metadata Chip */}
              <div className="mt-2 text-center text-xs text-stone-400 bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                <span className="text-sky-400 font-bold">Standard Mutu:</span> Kadar Air 11.2% • Lolos Sertifikasi SCA Specialty Grade 1
              </div>
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
            {/* Left Column: Visual Real Cutout Image (Roasted Coffee Beans) */}
            <div className="lg:col-span-5 relative flex flex-col items-center">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-amber-500/20 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Status Badge */}
              <div className="w-full flex items-center justify-start mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-950/90 border border-amber-500/50 text-amber-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-amber-400 animate-ping" />
                  <span>Tahap 03: Biji Kopi Sangrai (Roasted Beans)</span>
                </div>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4 z-10">
                <img
                  src="/images/roasted_beans.png"
                  alt="Biji Kopi Sangrai Roasted Beans Specialty"
                  className="w-full h-auto max-h-[340px] object-contain drop-shadow-[0_20px_45px_rgba(245,158,11,0.30)] animate-cct-float"
                />
              </div>

              {/* Metadata Chip */}
              <div className="mt-2 text-center text-xs text-stone-400 bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                <span className="text-amber-400 font-bold">Standard Mutu:</span> First Crack Terkalibrasi • Spektrum Warna Agtron #54–#65
              </div>
            </div>

            {/* Right Column: Clear Service Scope & Coverage */}
            <div className="lg:col-span-7 space-y-6">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-black uppercase tracking-wider">
                  <Flame className="w-3.5 h-3.5" />
                  <span>Layanan Hilir 1 • Artisan Roastery &amp; Cupping Lab</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Profil Penyangraian, Uji Cupping &amp; Kemasan QR
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Solusi manajemen produksi lengkap bagi rumah sangrai (*roastery*) untuk mencatat profil kurva panas, evaluasi skor sensorik rasa, serta otomatisasi label kemasan ritel ber-QR code.
                </p>
              </div>

              {/* 4 Scope Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Roast Profile Logging */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Flame className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Log Profil Sangrai Digital</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Pencatatan suhu pengisian (Charge), Turning Point, First Crack, rasio pengembangan DTR, dan susut bobot (*weight loss %*).
                  </p>
                </div>

                {/* 2. Cupping Form & Flavor Spectrum */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Award className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Laboratorium Cupping Sensorik</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Form digital evaluasi rasa 10 atribut SCA (Aroma, Acidity, Sweetness, Body, Aftertaste, dll.) dengan skor kumulatif terverifikasi.
                  </p>
                </div>

                {/* 3. Batch Inventory & Degassing */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <Cpu className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Manajemen Batch &amp; Degassing</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Pengendalian stok biji matang per nomor lot produksi dan estimasi tanggal konsumsi puncak (*peak brewing window*) 7–30 hari.
                  </p>
                </div>

                {/* 4. Consumer QR Passport Generator */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-amber-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Penerbitan QR Paspor Kemasan</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Cetak barcode QR siap tempel di kantong retail yang langsung menautkan pembeli ke sertifikat asal usul kebun petani aslinya.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate('/register/roaster')}
                  className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Daftar Layanan Roastery</span>
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
            {/* Left Column: Clear Service Scope & Coverage */}
            <div className="lg:col-span-7 space-y-6 order-2 lg:order-1">
              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-black uppercase tracking-wider">
                  <Store className="w-3.5 h-3.5" />
                  <span>Layanan Hilir 2 • Coffee Shop, Barista &amp; Konsumen</span>
                </div>
                <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white tracking-tight">
                  Transparansi Meja Konsumen, Resep Seduh &amp; Sourcing B2B
                </h3>
                <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
                  Membantu kafe dan kedai kopi menyajikan transparansi etis bernilai tinggi kepada pelanggan—membuktikan asal usul varietas, keaslian single origin, serta dukungan langsung bagi petani lokal.
                </p>
              </div>

              {/* 4 Scope Capability Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* 1. Table Tent QR */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-rose-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <QrCode className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">QR Paspor Meja Konsumen</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Kartu barcode akrilik di meja kafe yang dapat dipindai pengunjung menggunakan HP untuk membaca cerita petani dan riwayat kebun.
                  </p>
                </div>

                {/* 2. Barista Recipe Guide */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-rose-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Coffee className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Resep Seduh &amp; Dial-in Barista</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Panduan rasio seduh, suhu air optimal, dan ukuran gilingan (*grind size*) terkalibrasi khusus dari roastery untuk rasa terbaik.
                  </p>
                </div>

                {/* 3. Fair-Price Share Verification */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-rose-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <HeartHandshake className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sertifikasi Nilai Adil (Fair Share)</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Transparansi pembagian margin kepada penikmat kopi bahwa setiap cangkir memberikan kompensasi adil bagi keluarga petani.
                  </p>
                </div>

                {/* 4. Curated B2B Sourcing */}
                <div className="p-4 rounded-2xl bg-stone-900/90 border border-stone-800 space-y-2 hover:border-rose-500/40 transition-colors">
                  <div className="w-8 h-8 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <Store className="w-4 h-4" />
                  </div>
                  <h4 className="text-sm font-bold text-white">Sourcing B2B Langsung Terverifikasi</h4>
                  <p className="text-xs text-stone-300 leading-relaxed">
                    Akses pengadaan biji sangrai konsisten dari berbagai roastery terakreditasi dengan jaminan kualitas dan ketersediaan stok.
                  </p>
                </div>
              </div>

              {/* Action Button */}
              <div className="pt-2 flex items-center gap-3">
                <button
                  onClick={() => navigate('/register/coffee-shop')}
                  className="px-5 py-2.5 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-bold text-xs flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <span>Daftar Layanan Coffee Shop</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Right Column: Visual Real Cutout Image (Ceramic Cup & Latte Art) */}
            <div className="lg:col-span-5 relative flex flex-col items-center order-1 lg:order-2">
              {/* Soft radial glow */}
              <div className="absolute inset-0 max-w-md mx-auto h-72 sm:h-96 bg-rose-500/15 rounded-full blur-3xl pointer-events-none animate-cct-pulse-glow" />

              {/* Status Badge */}
              <div className="w-full flex items-center justify-start mb-4 z-20">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-rose-950/90 border border-rose-500/50 text-rose-300 text-xs font-bold shadow-md">
                  <span className="w-2 h-2 rounded-full bg-rose-400 animate-ping" />
                  <span>Tahap 04: Cangkir Seduh &amp; Meja Konsumen</span>
                </div>
              </div>

              {/* Image Frame */}
              <div className="relative w-full max-w-md aspect-square flex items-center justify-center p-4 z-10">
                <img
                  src="/images/coffee_cup.png"
                  alt="Cangkir Kopi Keramik dengan Latte Art Specialty"
                  className="w-full h-auto max-h-[340px] object-contain drop-shadow-[0_20px_45px_rgba(244,63,94,0.30)] animate-cct-float-slow"
                />
              </div>

              {/* Metadata Chip */}
              <div className="mt-2 text-center text-xs text-stone-400 bg-stone-900/80 px-4 py-2 rounded-xl border border-stone-800">
                <span className="text-rose-400 font-bold">Standard Penyajian:</span> Paspor Digital QR Meja • Keterlacakan 100% Asal Kebun
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};
