import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { RegisterModal } from './RegisterModal';
import {
  Sprout,
  Cog,
  Warehouse,
  Flame,
  Coffee,
  Sparkles,
  ArrowRight,
  Activity,
  ShieldCheck,
  CheckCircle2,
  Store,
  History,
  QrCode,
  Layers,
  Leaf,
  BarChart3,
  TrendingUp,
  Award,
  Scale,
  Zap,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Globe,
  Compass,
  Check,
  Building2,
  Play,
  Share2,
  Eye,
  Sliders,
  Thermometer,
  Droplets,
  HeartHandshake,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { setActiveView, loginAsRole } = useCoffee();
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerRole, setRegisterRole] = useState<UserRole>('roaster');
  const [activeTabService, setActiveTabService] = useState<UserRole>('roaster');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const openRegister = (role: UserRole = 'roaster') => {
    setRegisterRole(role);
    setIsRegisterOpen(true);
  };

  // Pipeline simulation stages
  const pipelineStages = [
    {
      step: 1,
      role: 'petani' as UserRole,
      title: 'Panen Ceri Petik Merah',
      actor: 'Pak Asep (Petani Pangalengan)',
      badge: 'Kebun Kopi • 1.550 mdpl',
      metric: 'Brix 22.4°Bx • 98% Petik Merah',
      desc: 'Pencatatan varietas Ateng Super & Sigarar Utang langsung dari lereng timur kebun.',
      color: 'text-emerald-600 bg-emerald-50 border-emerald-300',
      tagColor: 'bg-emerald-500 text-white',
      lotCode: 'LOT-PTN-001',
    },
    {
      step: 2,
      role: 'pengolah' as UserRole,
      title: 'Eco-Processing & Fermentasi',
      actor: 'CV Malabar Wet Mill Station',
      badge: 'Anaerobic Natural • Eco 5.0★',
      metric: 'Kadar Air 11.2% • Aw 0.58',
      desc: 'Fermentasi 72 jam terkontrol dan pemanfaatan 100% limbah pulp menjadi pupuk kompos & cascara.',
      color: 'text-amber-600 bg-amber-50 border-amber-300',
      tagColor: 'bg-amber-500 text-stone-950',
      lotCode: 'LOT-GB-001',
    },
    {
      step: 3,
      role: 'gudang' as UserRole,
      title: 'Silo Storage & SCA QA',
      actor: 'PT Nusantara Green Bean Silo',
      badge: 'GrainPro Hermetik • 20°C / RH 55%',
      metric: 'SCA Score: 87.25 • Grade 1 Super',
      desc: 'Penyimpanan terstandarisasi untuk menjaga stabilitas organoleptik biji kopi specialty.',
      color: 'text-blue-600 bg-blue-50 border-blue-300',
      tagColor: 'bg-blue-500 text-white',
      lotCode: 'LOT-WH-001',
    },
    {
      step: 4,
      role: 'roaster' as UserRole,
      title: 'Artisan Roasting Intelligence',
      actor: 'Karsa Craft Roastery',
      badge: 'Light-Medium • Agtron 65',
      metric: 'DTR 14.8% • First Crack @ 08:30',
      desc: 'Penyangraian presisi dengan sensoris spider chart 8 parameter dan rekomendasi resting 7 hari.',
      color: 'text-orange-600 bg-orange-50 border-orange-300',
      tagColor: 'bg-orange-500 text-white',
      lotCode: 'LOT-ROAST-001',
    },
    {
      step: 5,
      role: 'cafe' as UserRole,
      title: 'Specialty Cup & QR Story',
      actor: 'Seduh Teduh Specialty Coffee',
      badge: 'Filter V60 • Single Origin',
      metric: '100% Traceability ke Konsumen',
      desc: 'Pelanggan memindai QR Code di cangkir untuk melihat seluruh perjalanan terroir dari kebun Pak Asep.',
      color: 'text-stone-700 bg-stone-100 border-stone-300',
      tagColor: 'bg-stone-900 text-amber-400',
      lotCode: 'CUP-TEDUH-2026',
    },
  ];

  const faqs = [
    {
      q: 'Apa itu CCT-Coffee (Circular Trace Coffee)?',
      a: 'CCT-Coffee adalah platform sistem informasi rantai pasok kopi hulu-ke-hilir yang mengintegrasikan perdagangan B2B, pelacakan lot digital (Lot Traceability), standarisasi sensoris SCA, hingga manajemen limbah sirkular (Zero-Waste Eco-Processing).',
    },
    {
      q: 'Bagaimana cara kerja QR Traceability untuk konsumen cafe?',
      a: 'Setiap lot roasted bean yang diseduh di cafe menghasilkan kode unik. Barista mencetak stiker QR untuk cangkir atau kemasan ritel. Konsumen cukup memindai dengan kamera ponsel untuk membaca riwayat petani, ketinggian kebun, profil fermentasi, kurva sangrai, hingga uji rasa.',
    },
    {
      q: 'Apa manfaat modul Circular Economy & Eco-Rating bagi Pengolah (Mill)?',
      a: 'Modul ini mencatat pengalihan limbah organik ceri kopi (kulit/pulp dan air fermentasi) menjadi produk bernilai tambah seperti teh cascara, briket arang, dan pupuk kompos organik. Sistem secara otomatis menghitung skor Eco-Rating dan estimasi reduksi karbon.',
    },
    {
      q: 'Apakah roastery dapat menggunakan simulator kurva dan formulasi rasa AI?',
      a: 'Ya, modul Roaster ERP kami dilengkapi simulator profil sangrai (Agtron, DTR, RoR), radar sensori 8 parameter SCA, Work Order produksi, serta asisten cerdas Qrema AI untuk rekomendasi seduh dan resting.',
    },
    {
      q: 'Bagaimana cara memulai dan mendaftarkan entitas bisnis kopi saya?',
      a: 'Klik tombol "Daftar Akun", pilih peran usaha Anda (Petani, Pengolah, Gudang, Roastery, atau Cafe), dan Anda akan langsung mendapatkan akses ke panel operasional serta katalog marketplace terpadu.',
    },
  ];

  return (
    <div className="bg-[#FAF7F2] text-stone-900 overflow-x-hidden selection:bg-amber-500 selection:text-stone-950 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: HERO SECTION (homesections)                         */}
      {/* ------------------------------------------------------------- */}
      <section className="relative pt-12 pb-20 md:pt-20 md:pb-32 overflow-hidden border-b border-stone-200/80">
        {/* Background Subtle Gradient Blobs */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] bg-gradient-to-b from-amber-200/40 via-orange-100/20 to-transparent blur-3xl -z-10 pointer-events-none"></div>
        <div className="absolute top-40 right-10 w-80 h-80 bg-emerald-200/20 rounded-full blur-3xl -z-10 pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Pill Tag */}
          <div className="flex justify-center mb-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/90 border border-stone-300/80 shadow-xs backdrop-blur-md">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
              <span className="text-xs font-bold text-stone-800 tracking-tight">
                Platform Rantai Pasok Kopi Specialty & Traceability #1
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                CIRCULAR TRACE
              </span>
            </div>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.1]">
              Hubungkan Setiap Biji Kopi:{' '}
              <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                Dari Kebun Petani
              </span>{' '}
              Hingga Secangkir Kopi di Cafe Anda.
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              Ekosistem digital terpadu untuk <strong>Petani, Pengolah Mill, Silo Gudang, Artisan Roastery</strong>, dan <strong>Pemilik Cafe</strong>. Dilengkapi pelacakan 100% QR Traceability, standar cupping SCA, dan integrasi sirkular ramah lingkungan.
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => openRegister('roaster')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-amber-400 hover:text-amber-300 font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 border border-stone-800 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>Daftar Akun / Mulai Demo</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('marketplace')}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-stone-950" />
                <span>Jelajahi B2B Marketplace</span>
              </button>

              <button
                onClick={() => setActiveView('transactions')}
                className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-sm border border-stone-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <History className="w-4 h-4 text-stone-500" />
                <span>Log Transaksi</span>
              </button>
            </div>

            {/* Trust Ticker Microcopy */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                Standar Penilaian SCA 100 Poin
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                Zero Waste Circular Eco-Rating
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                QR Code Tanpa Install Aplikasi
              </span>
            </div>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">5 Pilar</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Rantai Pasok Terintegrasi Penuh
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">100%</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Farm-to-Cup QR Traceability
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">87.5+</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Rata-rata Skor Cupping SCA
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">0 Calo</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                Pasar B2B Langsung & Transparan
              </p>
            </div>
          </div>

          {/* INTERACTIVE HERO SHOWCASE: LIVE PIPELINE STEPPER */}
          <div className="mt-14 max-w-5xl mx-auto bg-[#1C120C] text-stone-200 rounded-3xl p-6 sm:p-8 border border-stone-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>

            {/* Stepper Header */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-800 pb-5">
              <div>
                <div className="inline-flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  <Activity className="w-3.5 h-3.5" />
                  Simulator Alur Fisik & Data Lot (Chain of Custody)
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  Klik Tahap untuk Melihat Jejak Riwayat Biji Kopi
                </h3>
              </div>
              <div className="text-xs font-mono text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 shrink-0">
                Status: <span className="text-emerald-400 font-bold">Terverifikasi Real-Time</span>
              </div>
            </div>

            {/* 5 Stage Navigation Pills */}
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 pt-6">
              {pipelineStages.map((stage, idx) => {
                const isActive = activePipelineStep === idx;
                return (
                  <button
                    key={stage.step}
                    onClick={() => setActivePipelineStep(idx)}
                    className={`p-3 rounded-2xl text-left transition-all border ${
                      isActive
                        ? 'bg-amber-500 text-stone-950 border-amber-400 shadow-md font-bold'
                        : 'bg-stone-900/90 text-stone-300 border-stone-800 hover:bg-stone-800 hover:text-white'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[11px] font-mono mb-1">
                      <span>TAHAP 0{stage.step}</span>
                      {isActive && <span className="w-2 h-2 rounded-full bg-stone-950 animate-ping"></span>}
                    </div>
                    <div className="text-xs font-black truncate">{stage.title}</div>
                  </button>
                );
              })}
            </div>

            {/* Selected Stage Detail Display */}
            {(() => {
              const current = pipelineStages[activePipelineStep];
              return (
                <div className="mt-6 bg-stone-900/80 border border-stone-800 rounded-2xl p-5 sm:p-6 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                  <div className="md:col-span-2 space-y-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`text-[11px] font-black uppercase px-2.5 py-0.5 rounded-md ${current.tagColor}`}>
                        Tahap {current.step}: {current.title}
                      </span>
                      <span className="text-xs font-mono bg-stone-800 text-amber-300 px-2 py-0.5 rounded border border-stone-700">
                        {current.lotCode}
                      </span>
                    </div>
                    <h4 className="text-xl font-black text-white">{current.actor}</h4>
                    <p className="text-sm text-stone-300 leading-relaxed">{current.desc}</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-xs">
                      <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2">
                        <Award className="w-4 h-4 text-amber-400 shrink-0" />
                        <span className="text-stone-200 font-semibold">{current.badge}</span>
                      </div>
                      <div className="bg-stone-950/60 p-2.5 rounded-xl border border-stone-800 flex items-center gap-2">
                        <BarChart3 className="w-4 h-4 text-emerald-400 shrink-0" />
                        <span className="text-stone-200 font-semibold">{current.metric}</span>
                      </div>
                    </div>
                  </div>

                  {/* Stage Action Card */}
                  <div className="bg-stone-950 p-4 rounded-2xl border border-stone-800/80 text-center space-y-3">
                    <div className="w-12 h-12 rounded-xl bg-amber-500/10 text-amber-400 flex items-center justify-center mx-auto border border-amber-500/20">
                      {current.role === 'petani' && <Sprout className="w-6 h-6" />}
                      {current.role === 'pengolah' && <Cog className="w-6 h-6" />}
                      {current.role === 'gudang' && <Warehouse className="w-6 h-6" />}
                      {current.role === 'roaster' && <Flame className="w-6 h-6" />}
                      {current.role === 'cafe' && <Coffee className="w-6 h-6" />}
                    </div>
                    <div>
                      <span className="text-xs font-bold text-white block">Akses Operasional Peran Ini</span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        Buka simulator & dashboard mandiri
                      </span>
                    </div>
                    <button
                      onClick={() => loginAsRole(current.role)}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>Coba Panel {current.role.toUpperCase()}</span>
                      <ChevronRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              );
            })()}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 2: SERVICES KITA (5 Pilar Layanan & Fitur Sistem)      */}
      {/* ------------------------------------------------------------- */}
      <section id="services" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              Layanan & Fitur Komprehensif
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              5 Pilar Ekosistem Kopi CCT-Coffee
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              Setiap pemangku kepentingan memiliki modul khusus yang saling tersambung secara otomatis dalam satu basis data terdesentralisasi.
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {[
              { id: 'petani' as UserRole, label: '1. Petani Kopi', icon: <Sprout className="w-4 h-4" /> },
              { id: 'pengolah' as UserRole, label: '2. Pengolah Mill', icon: <Cog className="w-4 h-4" /> },
              { id: 'gudang' as UserRole, label: '3. Gudang & Silo QA', icon: <Warehouse className="w-4 h-4" /> },
              { id: 'roaster' as UserRole, label: '4. Artisan Roastery', icon: <Flame className="w-4 h-4" /> },
              { id: 'cafe' as UserRole, label: '5. Pemilik Cafe', icon: <Coffee className="w-4 h-4" /> },
            ].map((tab) => {
              const isActive = activeTabService === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTabService(tab.id)}
                  className={`px-4 py-2.5 rounded-2xl text-xs sm:text-sm font-black transition-all flex items-center gap-2 cursor-pointer ${
                    isActive
                      ? 'bg-amber-500 text-stone-950 shadow-md scale-105'
                      : 'bg-stone-100 hover:bg-stone-200 text-stone-700'
                  }`}
                >
                  {tab.icon}
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          {/* Service Tab Dynamic Content */}
          <div className="bg-[#FAF7F2] rounded-3xl p-6 sm:p-10 border border-stone-300 shadow-sm max-w-5xl mx-auto">
            {activeTabService === 'petani' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-800 border border-emerald-300 px-3 py-1 rounded-full text-xs font-bold">
                    <Sprout className="w-3.5 h-3.5 text-emerald-600" />
                    Pilar 1: Hulu Pertanian & Panen
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Digitalisasi Panen Ceri Kopi dari Lereng Kebun
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Petani dapat mendokumentasikan hasil panen dengan parameter ilmiah: elevasi mdpl, varietas pohon (Typica, Ateng, Sigarar Utang), tingkat kemanisan buah (Brix 20°Bx+), serta metode petik merah 98% untuk mendapatkan harga jual optimal.
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Pencatatan batch panen instan dan otomatis terbit ID Lot Unik.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Penjualan langsung ke stasiun pengolah mill tanpa potongan tengkulak.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      Cetak kartu barcode fisik untuk ditempel pada karung ceri segar.
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('petani')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Panel Petani</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('petani')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      Daftar Kelompok Tani
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">Preview Kartu Lot Panen Petani</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      LOT-PTN-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Nama Petani</span>
                      <span className="font-bold text-stone-900">Asep Supriatna</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Lokasi Kebun</span>
                      <span className="font-bold text-stone-900">Pangalengan, Gn. Tilu (1.550 mdpl)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Varietas Terpilih</span>
                      <span className="font-bold text-emerald-700">Ateng Super & Sigarar Utang</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Kadar Gula Buah</span>
                      <span className="font-bold text-amber-600">22.4 °Brix (Optimal)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Kualitas Petik</span>
                      <span className="font-bold text-stone-900">Petik Merah Optimal (98%)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTabService === 'pengolah' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-800 border border-amber-300 px-3 py-1 rounded-full text-xs font-bold">
                    <Cog className="w-3.5 h-3.5 text-amber-600" />
                    Pilar 2: Wet & Dry Mill Station
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Manajemen Fermentasi & Eco-Processing Sirkular
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Stasiun pengolahan dapat mencatat metode proses (Full Washed, Natural, Honey, Anaerobic, Wine), mengontrol kadar air (10-12%), water activity, defect count, serta mencatat pemanfaatan 100% limbah organik ceri.
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      Konversi bobot ceri ke green bean terukur dengan rasio rendemen akurat.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      Pencatatan alokasi limbah cascara dan pupuk kompos bersertifikat Zero Waste.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      Kalkulasi rating Eco-Rating 5.0 bintang untuk daya tarik pembeli green bean.
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('pengolah')}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Panel Pengolah</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('pengolah')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      Daftar Stasiun Mill
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">Spesifikasi Green Bean Olahan</span>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                      LOT-GB-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Metode Proses</span>
                      <span className="font-bold text-amber-700">Anaerobic Natural (72 Jam)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Kadar Air & Water Activity</span>
                      <span className="font-bold text-stone-900">11.2% Moisture • 0.58 Aw</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Defect Count</span>
                      <span className="font-bold text-emerald-700">0 Defect (Specialty Grade 1)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Eco-Rating Sirkular</span>
                      <span className="font-bold text-emerald-600">★★★★★ 5.0 (Zero Waste Standard)</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Pemanfaatan Limbah</span>
                      <span className="font-bold text-stone-900">Teh Cascara & Kompos Organik Kebun</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTabService === 'gudang' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-blue-100 text-blue-800 border border-blue-300 px-3 py-1 rounded-full text-xs font-bold">
                    <Warehouse className="w-3.5 h-3.5 text-blue-600" />
                    Pilar 3: Silo Pergudangan & Quality Assurance
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Silo Iklim Terkendali & Sertifikasi Skor Cupping SCA
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Pengelola gudang menjaga integritas green bean dengan monitoring suhu dan kelembaban (RH), kemasan hermetik GrainPro, serta verifikasi skor cupping SCA dan pembagian grade tier komoditas.
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      Manajemen stok silo dengan perlindungan kemasan hermetik GrainPro.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      Audit dan verifikasi skor cupping SCA terakreditasi (85+ Specialty).
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      Penyaluran green bean tersertifikasi langsung ke roastery di seluruh Indonesia.
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('gudang')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Panel Gudang</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('gudang')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      Daftar Fasilitas Silo
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">Status Inventaris Silo Gudang</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      LOT-WH-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Kondisi Ruang Silo</span>
                      <span className="font-bold text-blue-700">20°C Suhu • 55% Kelembaban RH</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Tipe Kemasan</span>
                      <span className="font-bold text-stone-900">GrainPro Hermetic Sealed</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Skor Cupping SCA Terverifikasi</span>
                      <span className="font-bold text-amber-600">87.25 (Specialty Grade 1)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Tasting Notes Karakteristik</span>
                      <span className="font-bold text-stone-900">Bergamot, Peach, Honeycomb</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Status Ketersediaan</span>
                      <span className="font-bold text-emerald-600">Ready Stock (Siap Kirim ke Roaster)</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTabService === 'roaster' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-orange-100 text-orange-800 border border-orange-300 px-3 py-1 rounded-full text-xs font-bold">
                    <Flame className="w-3.5 h-3.5 text-orange-600" />
                    Pilar 4: Artisan Roastery ERP
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Presisi Profil Sangrai, Spider Radar, & Qrema AI
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Roastery dapat mengelola jadwal Work Order sangrai, menautkan nomor warna Agtron, rasio DTR, sensory spider radar 8 dimensi, serta mendapatkan bantuan formulasi rasa dari asisten cerdas Qrema AI.
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      Simulator kurva sangrai interaktif (Rate of Rise / RoR & First Crack).
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      Spider radar sensoris 8 aspek (Fragrance, Flavor, Acidity, Body, dll).
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      Manajemen kemasan retail 250g / 1kg dan rekomendasi waktu resting seduh.
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('roaster')}
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Panel Roastery</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('roaster')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      Daftar Roastery
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">Spesifikasi Batch Sangrai</span>
                    <span className="text-[10px] font-mono bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">
                      LOT-ROAST-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Tingkat Sangrai (Roast Level)</span>
                      <span className="font-bold text-orange-700">Light to Medium (Filter Profile)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Agtron Scale & DTR</span>
                      <span className="font-bold text-stone-900">Agtron 65 • DTR 14.8%</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Catatan Rasa Sensoris</span>
                      <span className="font-bold text-amber-700">Jasmine, Blueberry, Brown Sugar</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Rekomendasi Resting</span>
                      <span className="font-bold text-stone-900">7 - 14 Hari Pasca Sangrai</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Rekomendasi Metode Seduh</span>
                      <span className="font-bold text-stone-900">V60, Origami, Aeropress</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTabService === 'cafe' && (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <div className="inline-flex items-center gap-2 bg-stone-200 text-stone-800 border border-stone-300 px-3 py-1 rounded-full text-xs font-bold">
                    <Coffee className="w-3.5 h-3.5 text-stone-700" />
                    Pilar 5: Cafe, Barista, & Konsumen Akhir
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    Smart POS, Cetak Label Barcode, & Kisah Asal-Usul Kopi
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    Pemilik cafe dapat menyajikan kopi dengan nilai tambah cerita autentik. Barista dapat mencetak label stiker barcode/QR untuk setiap cangkir atau kantong biji kopi ritel yang dipesan pelanggan.
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-stone-900 shrink-0" />
                      Generator QR Code cangkir seduh instan untuk edukasi penikmat kopi.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-stone-900 shrink-0" />
                      Manajemen stok biji kopi kedai dan ritel beans kemasan konsumen.
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-stone-900 shrink-0" />
                      Membangun loyalitas pelanggan melalui transparansi direct trade nyata.
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('cafe')}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>Buka Panel Cafe</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('cafe')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      Daftar Kedai Kopi
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">Passport QR Cup Konsumen</span>
                    <span className="text-[10px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">
                      CUP-TEDUH-2026
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Menu Minuman</span>
                      <span className="font-bold text-stone-900">Manual Brew Filter V60</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Asal Biji (Single Origin)</span>
                      <span className="font-bold text-stone-900">Gunung Tilu Pangalengan</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Petani & Ketinggian</span>
                      <span className="font-bold text-emerald-700">Asep Supriatna (1.550 mdpl)</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">Roastery Sangrai</span>
                      <span className="font-bold text-orange-700">Karsa Craft Roastery</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">Scan QR Terintegrasi</span>
                      <span className="font-bold text-amber-600">✓ Siap Ditampilkan ke Ponsel Pelanggan</span>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: KELEBIHAN KITA (Value Propositions & Advantages)    */}
      {/* ------------------------------------------------------------- */}
      <section id="advantages" className="py-20 bg-[#FAF7F2] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              Keunggulan Kompetitif Kami
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              Mengapa Industri Kopi Memilih CCT-Coffee?
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              Menyatukan presisi data teknis, transparansi harga yang adil, serta kepedulian lingkungan hidup dalam satu platform modern.
            </p>
          </div>

          {/* 6 Advantages Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Card 1: End-to-End QR Traceability */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-black">
                <QrCode className="w-6 h-6 text-amber-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                1. 100% End-to-End Lot Traceability
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Setiap karung dan cangkir memiliki identitas unik yang dapat dilacak balik hingga ke koordinat kebun, tanggal panen, profil sangrai, dan varietas pohon.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-700">
                <span>Transparansi tanpa manipulasi data</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Circular Economy & Zero Waste */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Leaf className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                2. Circular Economy & Eco-Rating
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Modul pelacakan pemanfaatan limbah kulit ceri (pulp) menjadi teh cascara dan pupuk kompos organik, mengurangi emisi karbon dan menjaga kesuburan tanah.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span>Audit sertifikat Zero Waste 5.0★</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: SCA Sensory Spider Radar */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-black">
                <BarChart3 className="w-6 h-6 text-orange-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                3. Sensory Spider Radar 8 Dimensi
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Visualisasi interaktif profil sensori standar SCA (Aroma, Flavor, Acidity, Body, Sweetness, Clean Cup, Balance, Aftertaste) yang langsung tersambung ke setiap lot.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-orange-700">
                <span>Standar cupping 100 poin internasional</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Multi-Role Direct B2B Commerce */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                <Store className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                4. Multi-Role B2B Marketplace Terpadu
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Katalog pasar terintegrasi untuk 4 komoditas (Ceri Kopi, Green Bean Mill, Silo Pergudangan, & Roasted Bean Sangrai) dengan auto-ledger transaksi instan.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-700">
                <span>Perdagangan langsung tanpa perantara gelap</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Precision Silo & Quality Control */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
                <Thermometer className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                5. Kontrol Iklim & Kemasan GrainPro
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Parameter suhu 20°C, kelembaban RH 55%, kadar air 10-12%, dan water activity $A_w \le 0.60$ dipantau untuk menjaga kesegaran biji kopi hijau hingga 12 bulan.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-indigo-700">
                <span>Zero mold & zero moisture defect</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 6: AI Roasting & Qrema Assistant */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                <Zap className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                6. Qrema AI & Roaster Intelligence
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Asisten AI cerdas untuk menghitung rasio susut (shrinkage), rekomendasi waktu resting beans, formulasi Agtron roast profile, serta panduan seduh presisi.
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-rose-700">
                <span>Otomatisasi konsistensi batch sangrai</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4: DRAFT BACKGROUND KITA (Story, Visi & Misi Kami)     */}
      {/* ------------------------------------------------------------- */}
      <section id="background" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Left Narrative */}
            <div className="space-y-6">
              <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold">
                <Compass className="w-3.5 h-3.5 text-amber-600" />
                Latar Belakang & Cerita Kami
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                Membangun Keadilan & Keberlanjutan dalam Setiap Tetesan Kopi
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Kopi specialty Indonesia diakui di seluruh dunia, namun di balik kelezatan rasa terdapat tantangan besar: <strong>rantai pasok yang terfragmentasi, asimetri harga di tingkat petani, hilangnya riwayat terroir saat sampai ke barista</strong>, serta timbunan limbah pengolahan basah yang belum terkelola optimal.
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                <strong>CCT-Coffee (Circular Trace Coffee)</strong> lahir sebagai jawaban: sebuah platform yang mengembalikan kehormatan dan transparansi kepada para penanam kopi, memberikan kepastian mutu dan data kepada roaster, serta menyuguhkan integritas cerita kepada setiap penikmat kopi di kedai.
              </p>

              {/* Core Mission Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <HeartHandshake className="w-4 h-4" />
                    <span>Keadilan Nilai (Direct Equity)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Memastikan petani mendapatkan margin yang layak sesuai dedikasi panen petik merah optimal.
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                    <Leaf className="w-4 h-4" />
                    <span>Ekonomi Sirkular (Zero Waste)</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    Mengolah 100% produk sampingan ceri kopi menjadi pupuk organik dan cascara bernilai tinggi.
                  </p>
                </div>
              </div>
            </div>

            {/* Right Story Card / Quote */}
            <div className="bg-[#1C120C] text-stone-200 rounded-3xl p-8 sm:p-10 border border-stone-800 shadow-xl relative overflow-hidden space-y-6">
              <div className="absolute -bottom-10 -right-10 w-64 h-64 bg-amber-600/10 rounded-full blur-3xl pointer-events-none"></div>

              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-xl shadow-md">
                  ☕
                </div>
                <div>
                  <h4 className="text-white font-black text-lg">Filosofi Circular Trace</h4>
                  <span className="text-amber-400 text-xs font-mono">From Farm Soil back to Farm Soil</span>
                </div>
              </div>

              <blockquote className="text-stone-300 text-sm sm:text-base italic leading-relaxed border-l-2 border-amber-500 pl-4">
                &ldquo;Kami percaya bahwa secangkir kopi terasa paling nikmat saat mereka yang menanam, mengolah, dan menyangrainya dihargai secara adil pada setiap tegukan. Teknologi kami hadir bukan untuk menggantikan sentuhan pengrajin kopi, melainkan untuk merayakan karya mereka.&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-stone-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block">Jejak Karbon</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">-32% Emisi Olahan</span>
                </div>
                <div>
                  <span className="text-stone-400 block">Kemitraan Petani</span>
                  <span className="text-amber-400 font-bold font-mono text-sm">100% Transparan</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 5: CTA TO REGISTER (Call to Action & Onboarding)       */}
      {/* ------------------------------------------------------------- */}
      <section id="register" className="py-20 bg-[#1C120C] text-stone-200 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-500/20 text-amber-300 border border-amber-500/30 px-4 py-1.5 rounded-full text-xs font-bold">
              <Sparkles className="w-4 h-4 text-amber-400" />
              Mulai Transformasi Digital Sekarang
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              Siap Mengembangkan Usaha Kopi Anda Bersama CCT-Coffee?
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Bergabunglah dengan ribuan petani, pengolah mill, pengelola silo gudang, artisan roastery, dan barista cafe di seluruh Indonesia. Gratis tanpa biaya aktivasi awal.
            </p>
          </div>

          {/* 5 Role Selection Cards for Fast Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {[
              {
                role: 'petani' as UserRole,
                name: 'Petani Kopi',
                desc: 'Upload panen ceri & jual langsung ke mill',
                icon: <Sprout className="w-5 h-5 text-emerald-400" />,
                btnColor: 'bg-emerald-600 hover:bg-emerald-500',
              },
              {
                role: 'pengolah' as UserRole,
                name: 'Pengolah Mill',
                desc: 'Fermentasi, uji mutu & kelola limbah sirkular',
                icon: <Cog className="w-5 h-5 text-amber-400" />,
                btnColor: 'bg-amber-600 hover:bg-amber-500',
              },
              {
                role: 'gudang' as UserRole,
                name: 'Gudang & Silo QA',
                desc: 'Kelola stok silo GrainPro & sertifikasi SCA',
                icon: <Warehouse className="w-5 h-5 text-blue-400" />,
                btnColor: 'bg-blue-600 hover:bg-blue-500',
              },
              {
                role: 'roaster' as UserRole,
                name: 'Artisan Roastery',
                desc: 'Work order, kurva Agtron & Qrema AI',
                icon: <Flame className="w-5 h-5 text-orange-400" />,
                btnColor: 'bg-orange-600 hover:bg-orange-500',
              },
              {
                role: 'cafe' as UserRole,
                name: 'Pemilik Cafe',
                desc: 'Beli roasted beans & cetak QR cup seduh',
                icon: <Coffee className="w-5 h-5 text-amber-300" />,
                btnColor: 'bg-stone-800 hover:bg-stone-700',
              },
            ].map((card) => (
              <div
                key={card.role}
                className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 hover:bg-stone-850 transition-all text-left"
              >
                <div className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center">
                    {card.icon}
                  </div>
                  <div>
                    <h4 className="text-white font-black text-sm">{card.name}</h4>
                    <p className="text-[11px] text-stone-400 mt-1 leading-snug">{card.desc}</p>
                  </div>
                </div>

                <button
                  onClick={() => openRegister(card.role)}
                  className={`w-full py-2 px-3 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer ${card.btnColor}`}
                >
                  <span>Daftar {card.name.split(' ')[0]}</span>
                  <ChevronRight className="w-3.5 h-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Central Callout Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                Coba Seluruh Fitur Tanpa Komitmen
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 max-w-lg">
                Pilih peran Anda sekarang untuk menjelajahi simulasi marketplace B2B, manajemen lot, dan generator QR code.
              </p>
            </div>
            <button
              onClick={() => openRegister('roaster')}
              className="px-8 py-4 bg-stone-950 hover:bg-stone-900 text-amber-400 hover:text-amber-300 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Buka Formulir Pendaftaran</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-16 max-w-3xl mx-auto space-y-3">
            <h3 className="text-xl font-black text-white text-center mb-6">
              Pertanyaan yang Sering Diajukan (FAQ)
            </h3>
            {faqs.map((faq, index) => {
              const isOpen = openFaqIndex === index;
              return (
                <div
                  key={index}
                  className="bg-stone-900/80 border border-stone-800 rounded-2xl overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setOpenFaqIndex(isOpen ? null : index)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-bold text-xs sm:text-sm text-white hover:text-amber-400 transition-colors cursor-pointer"
                  >
                    <span>{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-amber-400 shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-stone-400 shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-4 pb-5 sm:px-5 sm:pb-5 text-xs text-stone-300 leading-relaxed border-t border-stone-800/80 pt-3">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Registration Modal Component */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialRole={registerRole}
      />
    </div>
  );
};
