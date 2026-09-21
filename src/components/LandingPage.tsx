import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import { UserRole } from '../types/coffee';
import { RegisterModal } from './RegisterModal';
import { landingContent } from '../i18n/landingContent';
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
  const { language, setActiveView, loginAsRole } = useCoffee();
  const content = landingContent[language];
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
  const pipelineStages = content.pipelineStages;

  const faqs = content.faqs;

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
                {content.hero.pillLabel}
              </span>
              <span className="text-[10px] uppercase font-black px-2 py-0.5 rounded-full bg-amber-500 text-stone-950">
                {content.hero.circularTag}
              </span>
            </div>
          </div>

          {/* Main Headline & Subtitle */}
          <div className="text-center max-w-4xl mx-auto space-y-6">
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-black text-stone-950 tracking-tight leading-[1.1]">
              {content.hero.titlePart1}{' '}
              <span className="bg-gradient-to-r from-amber-700 via-amber-600 to-amber-500 bg-clip-text text-transparent">
                {content.hero.titleHighlight}
              </span>{' '}
              {content.hero.titlePart2}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 max-w-2xl mx-auto leading-relaxed">
              {content.hero.subtitlePre}<strong>{content.hero.subtitleStrong1}</strong>{content.hero.subtitleMid}<strong>{content.hero.subtitleStrong2}</strong>{content.hero.subtitleEnd}
            </p>

            {/* Main Action Buttons */}
            <div className="pt-2 flex flex-wrap items-center justify-center gap-3 sm:gap-4">
              <button
                onClick={() => openRegister('roaster')}
                className="px-6 sm:px-8 py-3.5 sm:py-4 rounded-2xl bg-stone-950 hover:bg-stone-800 text-amber-400 hover:text-amber-300 font-black text-sm sm:text-base shadow-xl hover:shadow-2xl transition-all flex items-center gap-2.5 border border-stone-800 group cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-amber-400 group-hover:scale-110 transition-transform" />
                <span>{content.hero.ctaRegister}</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <button
                onClick={() => setActiveView('marketplace')}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
              >
                <Store className="w-4 h-4 text-stone-950" />
                <span>{content.hero.ctaMarketplace}</span>
              </button>

              <button
                onClick={() => setActiveView('transactions')}
                className="px-5 sm:px-6 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-700 font-bold text-sm border border-stone-300 shadow-xs transition-all flex items-center gap-2 cursor-pointer"
              >
                <History className="w-4 h-4 text-stone-500" />
                <span>{content.hero.ctaLedger}</span>
              </button>
            </div>

            {/* Trust Ticker Microcopy */}
            <div className="pt-4 flex flex-wrap items-center justify-center gap-6 text-xs text-stone-500">
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                {content.hero.trust1}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-amber-600" />
                {content.hero.trust2}
              </span>
              <span className="flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-blue-600" />
                {content.hero.trust3}
              </span>
            </div>
          </div>

          {/* Key Metrics Stats Grid */}
          <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 max-w-5xl mx-auto">
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">{content.hero.stats[0].value}</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                {content.hero.stats[0].label}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-amber-600 tracking-tight">{content.hero.stats[1].value}</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                {content.hero.stats[1].label}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-emerald-600 tracking-tight">{content.hero.stats[2].value}</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
                {content.hero.stats[2].label}
              </p>
            </div>
            <div className="bg-white/80 backdrop-blur-md p-5 rounded-2xl border border-stone-200/80 shadow-xs text-center">
              <div className="text-3xl sm:text-4xl font-black text-blue-600 tracking-tight">{content.hero.stats[3].value}</div>
              <p className="text-xs text-stone-500 font-medium mt-1">
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
                      onClick={() => loginAsRole(current.role)}
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
      {/* SECTION 2: SERVICES KITA (5 Pilar Layanan & Fitur Sistem)      */}
      {/* ------------------------------------------------------------- */}
      <section id="services" className="py-20 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              {content.servicesHeader.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl font-black text-stone-900 tracking-tight">
              {content.servicesHeader.title}
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base">
              {content.servicesHeader.subtitle}
            </p>
          </div>

          {/* Role Navigation Tabs */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-10">
            {(
              [
                { id: 'petani' as UserRole, icon: <Sprout className="w-4 h-4" /> },
                { id: 'pengolah' as UserRole, icon: <Cog className="w-4 h-4" /> },
                { id: 'gudang' as UserRole, icon: <Warehouse className="w-4 h-4" /> },
                { id: 'roaster' as UserRole, icon: <Flame className="w-4 h-4" /> },
                { id: 'cafe' as UserRole, icon: <Coffee className="w-4 h-4" /> },
              ] as { id: UserRole; icon: React.ReactNode }[]
            ).map((tab) => {
              const isActive = activeTabService === tab.id;
              const label = content.roleTabs.find((t) => t.id === tab.id)?.label ?? '';
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
                  <span>{label}</span>
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
                    {content.servicePanels.petani.badge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {content.servicePanels.petani.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {content.servicePanels.petani.desc}
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      {content.servicePanels.petani.bullets[0]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      {content.servicePanels.petani.bullets[1]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                      {content.servicePanels.petani.bullets[2]}
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('petani')}
                      className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{content.servicePanels.petani.ctaOpen}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('petani')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      {content.servicePanels.petani.ctaRegister}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">{content.servicePanels.petani.previewTitle}</span>
                    <span className="text-[10px] font-mono bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded font-bold">
                      LOT-PTN-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.petani.previewRows[0].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.petani.previewRows[0].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.petani.previewRows[1].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.petani.previewRows[1].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.petani.previewRows[2].label}</span>
                      <span className="font-bold text-emerald-700">{content.servicePanels.petani.previewRows[2].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.petani.previewRows[3].label}</span>
                      <span className="font-bold text-amber-600">{content.servicePanels.petani.previewRows[3].value}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">{content.servicePanels.petani.previewRows[4].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.petani.previewRows[4].value}</span>
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
                    {content.servicePanels.pengolah.badge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {content.servicePanels.pengolah.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {content.servicePanels.pengolah.desc}
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      {content.servicePanels.pengolah.bullets[0]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      {content.servicePanels.pengolah.bullets[1]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-amber-600 shrink-0" />
                      {content.servicePanels.pengolah.bullets[2]}
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('pengolah')}
                      className="px-5 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{content.servicePanels.pengolah.ctaOpen}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('pengolah')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      {content.servicePanels.pengolah.ctaRegister}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">{content.servicePanels.pengolah.previewTitle}</span>
                    <span className="text-[10px] font-mono bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">
                      LOT-GB-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.pengolah.previewRows[0].label}</span>
                      <span className="font-bold text-amber-700">{content.servicePanels.pengolah.previewRows[0].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.pengolah.previewRows[1].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.pengolah.previewRows[1].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.pengolah.previewRows[2].label}</span>
                      <span className="font-bold text-emerald-700">{content.servicePanels.pengolah.previewRows[2].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.pengolah.previewRows[3].label}</span>
                      <span className="font-bold text-emerald-600">{content.servicePanels.pengolah.previewRows[3].value}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">{content.servicePanels.pengolah.previewRows[4].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.pengolah.previewRows[4].value}</span>
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
                    {content.servicePanels.gudang.badge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {content.servicePanels.gudang.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {content.servicePanels.gudang.desc}
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      {content.servicePanels.gudang.bullets[0]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      {content.servicePanels.gudang.bullets[1]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-blue-600 shrink-0" />
                      {content.servicePanels.gudang.bullets[2]}
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('gudang')}
                      className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{content.servicePanels.gudang.ctaOpen}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('gudang')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      {content.servicePanels.gudang.ctaRegister}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">{content.servicePanels.gudang.previewTitle}</span>
                    <span className="text-[10px] font-mono bg-blue-100 text-blue-800 px-2 py-0.5 rounded font-bold">
                      LOT-WH-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.gudang.previewRows[0].label}</span>
                      <span className="font-bold text-blue-700">{content.servicePanels.gudang.previewRows[0].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.gudang.previewRows[1].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.gudang.previewRows[1].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.gudang.previewRows[2].label}</span>
                      <span className="font-bold text-amber-600">{content.servicePanels.gudang.previewRows[2].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.gudang.previewRows[3].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.gudang.previewRows[3].value}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">{content.servicePanels.gudang.previewRows[4].label}</span>
                      <span className="font-bold text-emerald-600">{content.servicePanels.gudang.previewRows[4].value}</span>
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
                    {content.servicePanels.roaster.badge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {content.servicePanels.roaster.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {content.servicePanels.roaster.desc}
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      {content.servicePanels.roaster.bullets[0]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      {content.servicePanels.roaster.bullets[1]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-orange-600 shrink-0" />
                      {content.servicePanels.roaster.bullets[2]}
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('roaster')}
                      className="px-5 py-2.5 rounded-xl bg-orange-600 hover:bg-orange-500 text-white font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{content.servicePanels.roaster.ctaOpen}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('roaster')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      {content.servicePanels.roaster.ctaRegister}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">{content.servicePanels.roaster.previewTitle}</span>
                    <span className="text-[10px] font-mono bg-orange-100 text-orange-800 px-2 py-0.5 rounded font-bold">
                      LOT-ROAST-001
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.roaster.previewRows[0].label}</span>
                      <span className="font-bold text-orange-700">{content.servicePanels.roaster.previewRows[0].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.roaster.previewRows[1].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.roaster.previewRows[1].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.roaster.previewRows[2].label}</span>
                      <span className="font-bold text-amber-700">{content.servicePanels.roaster.previewRows[2].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.roaster.previewRows[3].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.roaster.previewRows[3].value}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">{content.servicePanels.roaster.previewRows[4].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.roaster.previewRows[4].value}</span>
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
                    {content.servicePanels.cafe.badge}
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-stone-900 tracking-tight">
                    {content.servicePanels.cafe.title}
                  </h3>
                  <p className="text-stone-600 text-sm leading-relaxed">
                    {content.servicePanels.cafe.desc}
                  </p>
                  <ul className="space-y-2.5 text-xs text-stone-700">
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-stone-900 shrink-0" />
                      {content.servicePanels.cafe.bullets[0]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-stone-900 shrink-0" />
                      {content.servicePanels.cafe.bullets[1]}
                    </li>
                    <li className="flex items-center gap-2 font-medium">
                      <Check className="w-4 h-4 text-stone-900 shrink-0" />
                      {content.servicePanels.cafe.bullets[2]}
                    </li>
                  </ul>
                  <div className="pt-2 flex items-center gap-3">
                    <button
                      onClick={() => loginAsRole('cafe')}
                      className="px-5 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-amber-400 font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer"
                    >
                      <span>{content.servicePanels.cafe.ctaOpen}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => openRegister('cafe')}
                      className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer"
                    >
                      {content.servicePanels.cafe.ctaRegister}
                    </button>
                  </div>
                </div>

                <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-sm space-y-4">
                  <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                    <span className="text-xs font-bold text-stone-800">{content.servicePanels.cafe.previewTitle}</span>
                    <span className="text-[10px] font-mono bg-stone-100 text-stone-800 px-2 py-0.5 rounded font-bold">
                      CUP-TEDUH-2026
                    </span>
                  </div>
                  <div className="space-y-2 text-xs">
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.cafe.previewRows[0].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.cafe.previewRows[0].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.cafe.previewRows[1].label}</span>
                      <span className="font-bold text-stone-900">{content.servicePanels.cafe.previewRows[1].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.cafe.previewRows[2].label}</span>
                      <span className="font-bold text-emerald-700">{content.servicePanels.cafe.previewRows[2].value}</span>
                    </div>
                    <div className="flex justify-between py-1 border-b border-stone-100">
                      <span className="text-stone-500">{content.servicePanels.cafe.previewRows[3].label}</span>
                      <span className="font-bold text-orange-700">{content.servicePanels.cafe.previewRows[3].value}</span>
                    </div>
                    <div className="flex justify-between py-1">
                      <span className="text-stone-500">{content.servicePanels.cafe.previewRows[4].label}</span>
                      <span className="font-bold text-amber-600">{content.servicePanels.cafe.previewRows[4].value}</span>
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

            {/* Card 5: Precision Silo & Quality Control */}
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

            {/* Card 6: AI Roasting & sangrAI Assistant */}
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
                <strong>sangrAI</strong>{content.background.para2Rest}
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

          {/* 5 Role Selection Cards for Fast Registration */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-12">
            {(
              [
                { role: 'petani' as UserRole, icon: <Sprout className="w-5 h-5 text-emerald-400" />, btnColor: 'bg-emerald-600 hover:bg-emerald-500' },
                { role: 'pengolah' as UserRole, icon: <Cog className="w-5 h-5 text-amber-400" />, btnColor: 'bg-amber-600 hover:bg-amber-500' },
                { role: 'gudang' as UserRole, icon: <Warehouse className="w-5 h-5 text-blue-400" />, btnColor: 'bg-blue-600 hover:bg-blue-500' },
                { role: 'roaster' as UserRole, icon: <Flame className="w-5 h-5 text-orange-400" />, btnColor: 'bg-orange-600 hover:bg-orange-500' },
                { role: 'cafe' as UserRole, icon: <Coffee className="w-5 h-5 text-amber-300" />, btnColor: 'bg-stone-800 hover:bg-stone-700' },
              ] as { role: UserRole; icon: React.ReactNode; btnColor: string }[]
            ).map((cardMeta) => {
              const card = content.cta.roleCards.find((c) => c.role === cardMeta.role)!;
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

      {/* Registration Modal Component */}
      <RegisterModal
        isOpen={isRegisterOpen}
        onClose={() => setIsRegisterOpen(false)}
        initialRole={registerRole}
      />
    </div>
  );
};
