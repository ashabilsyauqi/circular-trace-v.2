import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { landingContent } from '../i18n/landingContent';
import { ServicesShowcaseSection } from './landing/ServicesShowcaseSection';
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
  ChevronLeft,
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
  Truck,
  PackageCheck,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const navigate = useNavigate();
  const { language, setActiveView } = useCoffee();
  const content = landingContent[language];
  const [activeTabService, setActiveTabService] = useState<UserRole>('roaster');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  useEffect(() => {
    if (window.location.hash === '#services') {
      const el = document.getElementById('services');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, []);

  const scrollToServices = () => {
    const el = document.getElementById('services');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    } else {
      navigate('/#services');
    }
  };

  const openRegister = (role: UserRole = 'roaster') => {
    if (role === 'admin_kelompok_tani' || role === 'petani' || role === 'pengolah') {
      navigate('/register/kelompok-tani');
    } else if (role === 'gudang') {
      navigate('/register/gudang');
    } else if (role === 'roaster') {
      navigate('/register/roaster');
    } else if (role === 'cafe') {
      navigate('/register/coffee-shop');
    } else {
      scrollToServices();
    }
  };

  // Pipeline simulation stages
  const pipelineStages = content.pipelineStages;

  const faqs = content.faqs;

  return (
    <div className="bg-[#FAF7F2] text-stone-900 overflow-x-hidden selection:bg-amber-500 selection:text-stone-950 font-sans">
      {/* ------------------------------------------------------------- */}
      {/* SECTION 1: HERO SECTION (Farm-to-Cup Custom Artwork Banner)    */}
      {/* ------------------------------------------------------------- */}
      <section
        className="relative pt-10 pb-20 md:pt-14 md:pb-24 overflow-hidden bg-[#0a160f] text-white border-b border-stone-800 select-none"
      >
        {/* Farm-to-Cup Coffee Traceability Artwork Background */}
        <div
          className="absolute inset-0 bg-cover bg-no-repeat bg-[center_right] sm:bg-[right_center]"
          style={{
            backgroundImage: "url('/hero-coffee-trace.jpg')",
          }}
        />

        {/* Layered Gradient Overlays for Supreme Left Contrast */}
        {/* 1. Deep moody forest-green/espresso shadow on the left to perfectly match the artwork */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#07130c]/98 via-[#07130c]/90 md:via-[#07130c]/75 lg:via-[#07130c]/45 to-transparent pointer-events-none" />

        {/* 2. Top and bottom soft vignettes */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#07130c]/80 via-transparent to-[#07130c]/95 pointer-events-none" />

        {/* 3. Subtle ambient warm glow on headline */}
        <div className="absolute top-1/4 left-10 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center pt-2 sm:pt-4">
            {/* Left Column: Left-aligned Text, Headlines, Actions, and Trust (Col 1-8) */}
            <div className="lg:col-span-7 xl:col-span-8 text-left space-y-6">
              {/* Top Pill Tag */}
              <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-stone-900/80 border border-amber-500/40 shadow-lg backdrop-blur-md">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  <span className="text-xs font-bold text-stone-200 tracking-tight">
                    {content.hero.pillLabel}
                  </span>
                  <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                    {content.hero.circularTag}
                  </span>
                </div>

                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-950/70 border border-emerald-500/30 backdrop-blur-md text-xs text-emerald-300">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="font-semibold">Farm-to-Cup Traceability</span>
                </div>
              </div>

              {/* Main Headline */}
              <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl font-black text-white tracking-tight leading-[1.1] drop-shadow-lg">
                {content.hero.titlePart1}{' '}
                <span className="bg-gradient-to-r from-amber-400 via-amber-300 to-yellow-200 bg-clip-text text-transparent">
                  {content.hero.titleHighlight}
                </span>{' '}
                {content.hero.titlePart2}
              </h1>

              {/* Subtitle */}
              <p className="text-sm sm:text-base lg:text-lg text-stone-200 max-w-xl leading-relaxed drop-shadow-md">
                {content.hero.subtitlePre}<strong className="text-white font-semibold">{content.hero.subtitleStrong1}</strong>{content.hero.subtitleMid}<strong className="text-amber-300 font-semibold">{content.hero.subtitleStrong2}</strong>{content.hero.subtitleEnd}
              </p>

              {/* Main Action Buttons (Left Aligned) */}
              <div className="pt-1 flex flex-wrap items-center gap-3 sm:gap-4">
                <button
                  onClick={scrollToServices}
                  className="px-6 sm:px-7 py-3.5 rounded-2xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-sm sm:text-base shadow-xl shadow-amber-500/25 hover:shadow-2xl hover:scale-102 transition-all flex items-center gap-2.5 border border-amber-400 group cursor-pointer"
                >
                  <Sparkles className="w-4 h-4 text-stone-950 group-hover:scale-110 transition-transform" />
                  <span>{content.hero.ctaRegister}</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </button>

                <button
                  onClick={() => setActiveView('marketplace')}
                  className="px-5 sm:px-6 py-3.5 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-bold text-sm sm:text-base shadow-lg border border-white/25 backdrop-blur-md hover:scale-102 transition-all flex items-center gap-2 cursor-pointer"
                >
                  <Store className="w-4 h-4 text-amber-400" />
                  <span>{content.hero.ctaMarketplace}</span>
                </button>

                <button
                  onClick={() => setActiveView('transactions')}
                  className="px-4 sm:px-5 py-3.5 rounded-2xl bg-black/40 hover:bg-black/60 text-stone-200 hover:text-white font-semibold text-sm border border-white/15 backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <History className="w-4 h-4 text-stone-400" />
                  <span>{content.hero.ctaLedger}</span>
                </button>
              </div>

              {/* Trust Ticker Microcopy (Left Aligned) */}
              <div className="pt-2 flex flex-wrap items-center gap-2.5 sm:gap-3 text-xs text-stone-300">
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                  {content.hero.trust1}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-amber-400" />
                  {content.hero.trust2}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/40 border border-white/10 backdrop-blur-xs">
                  <CheckCircle2 className="w-4 h-4 text-sky-400" />
                  {content.hero.trust3}
                </span>
              </div>
            </div>

            {/* Right Column: Clean Negative Space allowing the Farm-to-Cup artwork to shine */}
            <div className="lg:col-span-5 xl:col-span-4 hidden lg:flex flex-col items-end justify-between self-stretch py-2 min-h-[360px]">
              {/* Top Right Live Route Indicator */}
              <div className="p-4 rounded-2xl bg-black/40 backdrop-blur-md border border-white/15 text-right shadow-2xl max-w-xs space-y-1">
                <div className="inline-flex items-center gap-1.5 text-[10px] uppercase font-black tracking-wider text-amber-400">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                  <span>Rantai Pasok Terpadu</span>
                </div>
                <div className="text-xs font-bold text-white leading-tight">
                  Kebun &bull; Pengolah &bull; Silo &bull; Roastery &bull; Kafe
                </div>
                <p className="text-[11px] text-stone-300 leading-snug">
                  Jalur ketertelusuran 100% transparan berstandar SCA Specialty &amp; EUDR.
                </p>
              </div>

              {/* Bottom Right Floating Badge near the coffee cup */}
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-black/50 backdrop-blur-md border border-amber-400/30 text-amber-300 text-xs font-semibold shadow-lg">
                <Coffee className="w-4 h-4 text-amber-400" />
                <span>100% Farm-to-Cup QR Traceability</span>
              </div>
            </div>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="mt-12 sm:mt-16 grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-5xl">
            <div className="bg-stone-950/70 hover:bg-stone-950/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl text-left transition-all group">
              <div className="text-3xl sm:text-4xl font-black text-white tracking-tight group-hover:scale-105 transition-transform">{content.hero.stats[0].value}</div>
              <p className="text-xs text-stone-300 font-medium mt-1">
                {content.hero.stats[0].label}
              </p>
            </div>
            <div className="bg-stone-950/70 hover:bg-stone-950/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl text-left transition-all group">
              <div className="text-3xl sm:text-4xl font-black text-amber-400 tracking-tight group-hover:scale-105 transition-transform">{content.hero.stats[1].value}</div>
              <p className="text-xs text-stone-300 font-medium mt-1">
                {content.hero.stats[1].label}
              </p>
            </div>
            <div className="bg-stone-950/70 hover:bg-stone-950/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl text-left transition-all group">
              <div className="text-3xl sm:text-4xl font-black text-emerald-400 tracking-tight group-hover:scale-105 transition-transform">{content.hero.stats[2].value}</div>
              <p className="text-xs text-stone-300 font-medium mt-1">
                {content.hero.stats[2].label}
              </p>
            </div>
            <div className="bg-stone-950/70 hover:bg-stone-950/90 backdrop-blur-md p-4 sm:p-5 rounded-2xl border border-white/10 shadow-xl text-left transition-all group">
              <div className="text-3xl sm:text-4xl font-black text-sky-400 tracking-tight group-hover:scale-105 transition-transform">{content.hero.stats[3].value}</div>
              <p className="text-xs text-stone-300 font-medium mt-1">
                {content.hero.stats[3].label}
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
                  {content.hero.pipeline.simulatorLabel}
                </div>
                <h3 className="text-xl sm:text-2xl font-black text-white mt-1">
                  {content.hero.pipeline.title}
                </h3>
              </div>
              <div className="text-xs font-mono text-stone-400 bg-stone-900 px-3 py-1.5 rounded-xl border border-stone-800 shrink-0">
                {content.hero.pipeline.statusLabel} <span className="text-emerald-400 font-bold">{content.hero.pipeline.statusValue}</span>
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
                      <span>{content.hero.pipeline.stepLabel(stage.step)}</span>
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
                        {content.hero.pipeline.stagePrefix} {current.step}: {current.title}
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
                      <span className="text-xs font-bold text-white block">{content.hero.pipeline.accessTitle}</span>
                      <span className="text-[11px] text-stone-400 block mt-0.5">
                        {content.hero.pipeline.accessSubtitle}
                      </span>
                    </div>
                    <button
                      onClick={() => navigate('/login')}
                      className="w-full py-2 px-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs rounded-xl transition-all shadow-sm flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <span>{content.hero.pipeline.tryPanelPrefix} {current.role.toUpperCase()}</span>
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
      {/* SECTION 2: 4 SOLUSI UTAMA (Ekosistem Digital Circular Trace)   */}
      {/* ------------------------------------------------------------- */}
      <ServicesShowcaseSection />

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: KELEBIHAN KITA (Value Propositions & Advantages)    */}
      {/* ------------------------------------------------------------- */}
      <section id="advantages" className="py-20 bg-[#FAF7F2] border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-16">
            <div className="inline-flex items-center gap-2 bg-emerald-100 text-emerald-900 border border-emerald-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Award className="w-3.5 h-3.5 text-emerald-600" />
              {content.advantages.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {content.advantages.title}
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              {content.advantages.subtitle}
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
                {content.advantages.cards[0].title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {content.advantages.cards[0].desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-amber-700">
                <span>{content.advantages.cards[0].footer}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 2: Circular Economy & Zero Waste */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-black">
                <Leaf className="w-6 h-6 text-emerald-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {content.advantages.cards[1].title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {content.advantages.cards[1].desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-emerald-700">
                <span>{content.advantages.cards[1].footer}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 3: SCA Sensory Spider Radar */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-orange-100 text-orange-800 flex items-center justify-center font-black">
                <BarChart3 className="w-6 h-6 text-orange-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {content.advantages.cards[2].title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {content.advantages.cards[2].desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-orange-700">
                <span>{content.advantages.cards[2].footer}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 4: Multi-Role Direct B2B Commerce */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-800 flex items-center justify-center font-black">
                <Store className="w-6 h-6 text-blue-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {content.advantages.cards[3].title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {content.advantages.cards[3].desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-blue-700">
                <span>{content.advantages.cards[3].footer}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 5: Precision Warehouse & Quality Control */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-indigo-100 text-indigo-800 flex items-center justify-center font-black">
                <Thermometer className="w-6 h-6 text-indigo-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {content.advantages.cards[4].title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {content.advantages.cards[4].desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-indigo-700">
                <span>{content.advantages.cards[4].footer}</span>
                <ChevronRight className="w-3.5 h-3.5" />
              </div>
            </div>

            {/* Card 6: AI Roasting & CircularCoffee Assistant */}
            <div className="bg-white p-7 rounded-3xl border border-stone-200 shadow-xs hover:shadow-md transition-all space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-800 flex items-center justify-center font-black">
                <Zap className="w-6 h-6 text-rose-700" />
              </div>
              <h3 className="text-lg font-black text-stone-900">
                {content.advantages.cards[5].title}
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                {content.advantages.cards[5].desc}
              </p>
              <div className="pt-2 flex items-center gap-2 text-xs font-bold text-rose-700">
                <span>{content.advantages.cards[5].footer}</span>
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
                {content.background.badge}
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                {content.background.title}
              </h2>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                {content.background.para1Pre}<strong>{content.background.para1Strong}</strong>{content.background.para1Post}
              </p>
              <p className="text-stone-600 text-sm leading-relaxed">
                <strong>CircularCoffee</strong>{content.background.para2Rest}
              </p>

              {/* Core Mission Pillars */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-emerald-700 font-bold text-xs">
                    <HeartHandshake className="w-4 h-4" />
                    <span>{content.background.pillars[0].title}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {content.background.pillars[0].desc}
                  </p>
                </div>

                <div className="bg-[#FAF7F2] p-4 rounded-2xl border border-stone-200 space-y-1.5">
                  <div className="flex items-center gap-2 text-amber-700 font-bold text-xs">
                    <Leaf className="w-4 h-4" />
                    <span>{content.background.pillars[1].title}</span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-snug">
                    {content.background.pillars[1].desc}
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
                  <h4 className="text-white font-black text-lg">{content.background.storyTitle}</h4>
                  <span className="text-amber-400 text-xs font-mono">{content.background.storyTag}</span>
                </div>
              </div>

              <blockquote className="text-stone-300 text-sm sm:text-base italic leading-relaxed border-l-2 border-amber-500 pl-4">
                &ldquo;{content.background.quote}&rdquo;
              </blockquote>

              <div className="pt-4 border-t border-stone-800 grid grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-stone-400 block">{content.background.statCarbonLabel}</span>
                  <span className="text-emerald-400 font-bold font-mono text-sm">{content.background.statCarbonValue}</span>
                </div>
                <div>
                  <span className="text-stone-400 block">{content.background.statPartnerLabel}</span>
                  <span className="text-amber-400 font-bold font-mono text-sm">{content.background.statPartnerValue}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4.5: AUDITOR & VERIFIKATOR HOOK ("Anda Seorang Verifikator?") */}
      {/* ------------------------------------------------------------- */}
      <section id="verifikator" className="py-20 bg-gradient-to-br from-[#0c071e] via-[#140b2e] to-[#221045] text-white relative overflow-hidden border-t border-b border-purple-900/40">
        {/* Ambient lighting glows */}
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -right-24 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[300px] bg-purple-500/10 rounded-full blur-[100px] pointer-events-none" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          {/* Section Header */}
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 bg-purple-500/20 text-purple-300 border border-purple-500/40 px-4 py-1.5 rounded-full text-xs font-bold shadow-lg backdrop-blur-md">
              <ShieldCheck className="w-4 h-4 text-purple-400" />
              <span>PORTAL AUDITOR &amp; AKREDITASI INDEPENDEN</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight">
              Anda Seorang <span className="bg-gradient-to-r from-purple-400 via-pink-300 to-indigo-300 bg-clip-text text-transparent">Verifikator Mutu</span> atau <span className="bg-gradient-to-r from-amber-300 to-yellow-200 bg-clip-text text-transparent">Q-Grader</span>?
            </h2>

            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              Bergabunglah dengan dewan auditor independen ekosistem Circular Coffee Trace. Validasi kepatuhan deforestasi EUDR, lakukan inspeksi sanitasi stasiun olah, evaluasi sensori SCA 10-atribut, dan terbitkan stempel verifikasi digital berstandar global.
            </p>
          </div>

          {/* 4 Feature Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-12">
            {/* Card 1: EUDR */}
            <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md hover:border-purple-400/50 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md">
                  <Globe className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-emerald-400 px-2 py-0.5 rounded-full bg-emerald-950/60 border border-emerald-500/30">
                    Regulasi EU 2023/1115
                  </span>
                  <h3 className="text-white font-bold text-base mt-2.5">
                    Audit Kepatuhan Bebas Deforestasi (EUDR)
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    Verifikasi koordinat GPS polygon kebun, audit legalitas lahan petani, dan pastikan kepatuhan nol deforestasi untuk ekspor kopi ke Uni Eropa.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-900/40 mt-4 flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-emerald-400" />
                <span>Geolokasi &amp; Polygon Terverifikasi</span>
              </div>
            </div>

            {/* Card 2: Standarisasi Olah */}
            <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md hover:border-purple-400/50 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md">
                  <Layers className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-amber-300 px-2 py-0.5 rounded-full bg-amber-950/60 border border-amber-500/30">
                    Inspeksi Stasiun Mill
                  </span>
                  <h3 className="text-white font-bold text-base mt-2.5">
                    Standarisasi Olah &amp; Parameter Fisik
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    Inspeksi sanitasi stasiun olah, verifikasi 7 metode fermentasi, serta kalibrasi kadar air 10–12% dan water activity (Aw ≤ 0.60).
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-900/40 mt-4 flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-amber-400" />
                <span>Zero Defect &amp; Lab Standard</span>
              </div>
            </div>

            {/* Card 3: Evaluasi Sensori SCA */}
            <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md hover:border-purple-400/50 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md">
                  <Award className="w-6 h-6 text-purple-300" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-purple-300 px-2 py-0.5 rounded-full bg-purple-950/60 border border-purple-500/30">
                    SCA Cupping 10-Atribut
                  </span>
                  <h3 className="text-white font-bold text-base mt-2.5">
                    Evaluasi Sensori &amp; Q-Grader Score
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    Input skor cupping 10 atribut spesifik SCA (Fragrance, Flavor, Acidity, Body, Cleanliness, Balance) yang langsung menghasilkan Spider Radar Chart realtime.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-900/40 mt-4 flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-purple-400" />
                <span>Radar Sensorik Otomatis</span>
              </div>
            </div>

            {/* Card 4: Stempel Digital */}
            <div className="bg-white/5 border border-purple-500/20 rounded-2xl p-6 backdrop-blur-md hover:border-purple-400/50 hover:bg-white/10 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-xl bg-purple-900/60 border border-purple-500/30 flex items-center justify-center text-purple-300 shadow-md">
                  <CheckCircle2 className="w-6 h-6 text-cyan-400" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase tracking-wider text-cyan-300 px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
                    Stempel Anti-Tamper
                  </span>
                  <h3 className="text-white font-bold text-base mt-2.5">
                    Penerbitan Stempel Verifikasi Digital
                  </h3>
                  <p className="text-xs text-stone-300 mt-2 leading-relaxed">
                    Terbitkan sertifikat dan stempel digital terotentikasi SHA-256 pada Paspor Kopi untuk menjamin keaslian data bagi pembeli internasional.
                  </p>
                </div>
              </div>
              <div className="pt-4 border-t border-purple-900/40 mt-4 flex items-center gap-1.5 text-[11px] text-purple-300 font-semibold">
                <Check className="w-3.5 h-3.5 text-cyan-400" />
                <span>SHA-256 Validated Signature</span>
              </div>
            </div>
          </div>

          {/* Action Callout Banner Box */}
          <div className="bg-gradient-to-r from-purple-950/90 via-[#231248] to-indigo-950/90 border border-purple-500/30 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 backdrop-blur-md">
            <div className="space-y-3 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-200 text-xs font-bold">
                <Sparkles className="w-3.5 h-3.5 text-purple-300" />
                <span>Formulir Khusus Kredensial Auditor</span>
              </div>
              <h3 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
                Daftarkan Lisensi Auditor &amp; Q-Grader Anda
              </h3>
              <p className="text-stone-300 text-xs sm:text-sm max-w-xl leading-relaxed">
                Registrasi verifikator dilengkapi validasi nomor lisensi resmi, instansi sertifikasi penguji, portofolio keahlian, dan pakta integritas independensi.
              </p>
            </div>

            <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
              <button
                onClick={() => navigate('/register-verifikator')}
                className="w-full sm:w-auto px-7 py-4 rounded-2xl bg-gradient-to-r from-purple-600 via-indigo-600 to-purple-600 hover:from-purple-500 hover:to-indigo-500 text-white font-black text-sm shadow-xl shadow-purple-900/50 hover:shadow-2xl hover:scale-102 transition-all flex items-center justify-center gap-2 cursor-pointer border border-purple-400/50"
              >
                <span>Daftar sebagai Verifikator Resmi</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => navigate('/login')}
                className="w-full sm:w-auto px-5 py-4 rounded-2xl bg-white/10 hover:bg-white/15 text-purple-200 hover:text-white font-bold text-sm border border-purple-400/30 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <ShieldCheck className="w-4 h-4 text-purple-300" />
                <span>Masuk Portal Verifikator</span>
              </button>
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
              {content.cta.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white tracking-tight">
              {content.cta.title}
            </h2>
            <p className="text-stone-300 text-sm sm:text-base leading-relaxed">
              {content.cta.subtitle}
            </p>
          </div>

          {/* 4 Supply Chain Role Selection Cards for Fast Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {(
              [
                { role: 'admin_kelompok_tani' as UserRole, icon: <Building2 className="w-5 h-5 text-emerald-400" />, btnColor: 'bg-emerald-600 hover:bg-emerald-500' },
                { role: 'gudang' as UserRole, icon: <Warehouse className="w-5 h-5 text-blue-400" />, btnColor: 'bg-blue-600 hover:bg-blue-500' },
                { role: 'roaster' as UserRole, icon: <Flame className="w-5 h-5 text-orange-400" />, btnColor: 'bg-orange-600 hover:bg-orange-500' },
                { role: 'cafe' as UserRole, icon: <Coffee className="w-5 h-5 text-amber-300" />, btnColor: 'bg-stone-800 hover:bg-stone-700' },
              ] as { role: UserRole; icon: React.ReactNode; btnColor: string }[]
            ).map((cardMeta) => {
              const card = content.cta.roleCards.find((c) => c.role === cardMeta.role);
              if (!card) return null;
              return (
                <div
                  key={card.role}
                  className="bg-stone-900/90 border border-stone-800 rounded-2xl p-5 flex flex-col justify-between space-y-4 hover:border-amber-500/50 hover:bg-stone-850 transition-all text-left"
                >
                  <div className="space-y-3">
                    <div className="w-10 h-10 rounded-xl bg-stone-950 border border-stone-800 flex items-center justify-center">
                      {cardMeta.icon}
                    </div>
                    <div>
                      <h4 className="text-white font-black text-sm">{card.name}</h4>
                      <p className="text-[11px] text-stone-400 mt-1 leading-snug">{card.desc}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => openRegister(card.role)}
                    className={`w-full py-2 px-3 rounded-xl text-white font-bold text-xs transition-all flex items-center justify-center gap-1 shadow-xs cursor-pointer ${cardMeta.btnColor}`}
                  >
                    <span>{card.registerLabel}</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              );
            })}
          </div>

          {/* Quick Notice to Verifier Registration */}
          <div className="bg-purple-950/30 border border-purple-500/30 rounded-2xl p-4 sm:p-5 mb-12 flex flex-col sm:flex-row items-center justify-between gap-4 backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-purple-900/50 border border-purple-500/40 flex items-center justify-center text-purple-300 shrink-0">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-xs sm:text-sm font-bold text-purple-200">
                  Mendaftar sebagai Auditor atau Q-Grader?
                </p>
                <p className="text-[11px] text-purple-300/70">
                  Verifikator independen memiliki formulir registrasi khusus kredensial &amp; lisensi sertifikasi.
                </p>
              </div>
            </div>
            <button
              onClick={() => navigate('/register-verifikator')}
              className="w-full sm:w-auto px-4 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-1.5 shrink-0 cursor-pointer"
            >
              <span>Form Registrasi Verifikator</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Central Callout Banner */}
          <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 rounded-3xl p-8 sm:p-10 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-6 max-w-4xl mx-auto">
            <div className="space-y-2 text-center md:text-left">
              <h3 className="text-2xl sm:text-3xl font-black tracking-tight">
                {content.cta.bannerTitle}
              </h3>
              <p className="text-xs sm:text-sm font-semibold text-stone-900 max-w-lg">
                {content.cta.bannerDesc}
              </p>
            </div>
            <button
              onClick={() => openRegister('roaster')}
              className="px-8 py-4 bg-stone-950 hover:bg-stone-900 text-amber-400 hover:text-amber-300 font-black text-sm rounded-2xl shadow-xl transition-all flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>{content.cta.bannerBtn}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

          {/* FAQ Accordion */}
          <div className="mt-16 max-w-3xl mx-auto space-y-3">
            <h3 className="text-xl font-black text-white text-center mb-6">
              {content.cta.faqTitle}
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

      {/* End of Sections */}
    </div>
  );
};
