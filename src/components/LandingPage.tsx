import { getMarketplaceBaseUrl } from '../utils/baseUrl';
import { SubscriptionPricingCards } from './subscription/SubscriptionPricingCards';
import React, { useState, useEffect, useRef } from 'react';
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
  ShoppingCart,
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
  Tag,
  Truck,
  Droplets,
  HeartHandshake,
} from 'lucide-react';


// ---------------------------------------------------------------------------
// ScrollReveal Helper Component (IntersectionObserver Animated On Scroll)
// ---------------------------------------------------------------------------
const ScrollReveal: React.FC<{
  children: React.ReactNode;
  className?: string;
  direction?: 'up' | 'left' | 'right' | 'fade';
  delay?: number;
}> = ({ children, className = '', direction = 'up', delay = 0 }) => {
  const [isVisible, setIsVisible] = useState(false);
  const elementRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (elementRef.current) {
            observer.unobserve(elementRef.current);
          }
        }
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    if (elementRef.current) {
      observer.observe(elementRef.current);
    }

    return () => observer.disconnect();
  }, []);

  const getAnimationClass = () => {
    if (isVisible) return 'opacity-100 translate-x-0 translate-y-0 scale-100';
    switch (direction) {
      case 'left':
        return 'opacity-0 -translate-x-8 sm:-translate-x-12';
      case 'right':
        return 'opacity-0 translate-x-8 sm:translate-x-12';
      case 'up':
        return 'opacity-0 translate-y-8 sm:translate-y-12';
      case 'fade':
      default:
        return 'opacity-0 scale-95';
    }
  };

  return (
    <div
      ref={elementRef}
      style={{ transitionDelay: `${delay}ms` }}
      className={`transition-all duration-700 ease-out transform ${getAnimationClass()} ${className}`}
    >
      {children}
    </div>
  );
};

export const LandingPage: React.FC = () => {
  const { language, setActiveView, loginAsRole, navigate } = useCoffee();
  const content = landingContent[language];
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerRole, setRegisterRole] = useState<UserRole>('roaster');
  const [activeTabService, setActiveTabService] = useState<UserRole>('roaster');
  const [activePipelineStep, setActivePipelineStep] = useState<number>(0);
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);

  const pillarsData = [
    {
      id: 'petani' as UserRole,
      badgeIcon: <Sprout className="w-3.5 h-3.5 text-emerald-600" />,
      badgeClass: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      buttonColor: 'bg-emerald-600 hover:bg-emerald-500 text-white',
      checkColor: 'text-emerald-600',
      lotCode: 'LOT-PTN-001',
      lotBadgeClass: 'bg-emerald-100 text-emerald-800',
      image: 'https://images.unsplash.com/photo-1611854779393-1b2da9d400fe?w=1200&auto=format&fit=crop&q=85',
      imageAlt: 'Petani memanen ceri kopi merah segar di lereng kebun',
      panel: content.servicePanels.petani,
      loginBtnText: 'Login ke Panel Petani',
      align: 'left' as const,
    },
    {
      id: 'pengolah' as UserRole,
      badgeIcon: <Cog className="w-3.5 h-3.5 text-amber-600" />,
      badgeClass: 'bg-amber-100 text-amber-800 border-amber-300',
      buttonColor: 'bg-amber-600 hover:bg-amber-500 text-white',
      checkColor: 'text-amber-600',
      lotCode: 'LOT-GB-001',
      lotBadgeClass: 'bg-amber-100 text-amber-800',
      image: 'https://images.unsplash.com/photo-1791570923483-648a8f84290f?w=1200&auto=format&fit=crop&q=85',
      imageAlt: 'Proses pengeringan kopi parchment di raised drying beds',
      panel: content.servicePanels.pengolah,
      loginBtnText: 'Login ke Panel Pengolah',
      align: 'right' as const,
    },
    {
      id: 'gudang' as UserRole,
      badgeIcon: <Warehouse className="w-3.5 h-3.5 text-blue-600" />,
      badgeClass: 'bg-blue-100 text-blue-800 border-blue-300',
      buttonColor: 'bg-blue-600 hover:bg-blue-500 text-white',
      checkColor: 'text-blue-600',
      lotCode: 'LOT-WH-001',
      lotBadgeClass: 'bg-blue-100 text-blue-800',
      image: 'https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=1200&auto=format&fit=crop&q=85',
      imageAlt: 'Gudang penyimpanan green bean kopi hermetik dan QA cupping',
      panel: content.servicePanels.gudang,
      loginBtnText: 'Login ke Panel Gudang',
      align: 'left' as const,
    },
    {
      id: 'roaster' as UserRole,
      badgeIcon: <Flame className="w-3.5 h-3.5 text-orange-600" />,
      badgeClass: 'bg-orange-100 text-orange-800 border-orange-300',
      buttonColor: 'bg-orange-600 hover:bg-orange-500 text-white',
      checkColor: 'text-orange-600',
      lotCode: 'LOT-ROAST-001',
      lotBadgeClass: 'bg-orange-100 text-orange-800',
      image: 'https://images.unsplash.com/photo-1521302200778-33500795e128?w=1200&auto=format&fit=crop&q=85',
      imageAlt: 'Mesin artisan roasting drum mengeluarkan biji kopi sangrai',
      panel: content.servicePanels.roaster,
      loginBtnText: 'Login ke Panel Roastery',
      align: 'right' as const,
    },
    {
      id: 'cafe' as UserRole,
      badgeIcon: <Coffee className="w-3.5 h-3.5 text-stone-700" />,
      badgeClass: 'bg-stone-200 text-stone-800 border-stone-300',
      buttonColor: 'bg-stone-900 hover:bg-stone-800 text-amber-400',
      checkColor: 'text-stone-900',
      lotCode: 'CUP-TEDUH-2026',
      lotBadgeClass: 'bg-stone-100 text-stone-800',
      image: 'https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=1200&auto=format&fit=crop&q=85',
      imageAlt: 'Barista kafe menyeduh specialty coffee dengan transparansi QR',
      panel: content.servicePanels.cafe,
      loginBtnText: 'Login ke Panel Kafe',
      align: 'left' as const,
    },
  ];

  const getRowValueColor = (role: UserRole, index: number): string => {
    if (role === 'petani') {
      if (index === 2) return 'text-emerald-700';
      if (index === 3) return 'text-amber-600';
    } else if (role === 'pengolah') {
      if (index === 0) return 'text-amber-700';
      if (index === 2) return 'text-emerald-700';
      if (index === 3) return 'text-emerald-600';
    } else if (role === 'gudang') {
      if (index === 0) return 'text-blue-700';
      if (index === 2) return 'text-amber-600';
      if (index === 4) return 'text-emerald-600';
    } else if (role === 'roaster') {
      if (index === 0) return 'text-orange-700';
      if (index === 2) return 'text-amber-700';
    } else if (role === 'cafe') {
      if (index === 2) return 'text-emerald-700';
      if (index === 3) return 'text-orange-700';
      if (index === 4) return 'text-amber-600';
    }
    return 'text-stone-900';
  };

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

              <a
                href="#pricing"
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-white hover:bg-stone-100 text-stone-900 border border-stone-300 font-black text-sm sm:text-base shadow-xs hover:shadow-md transition-all flex items-center gap-2 cursor-pointer"
              >
                <Layers className="w-4 h-4 text-amber-600" />
                <span>Lihat Paket Bundle</span>
              </a>
              <button
                onClick={() => {
                  const targetUrl = getMarketplaceBaseUrl();
                  if (targetUrl.startsWith('http')) {
                    window.open(targetUrl, '_blank');
                  } else {
                    setActiveView('marketplace');
                  }
                }}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                title="Buka Platform Marketplace B2B (Direncanakan pada Domain Terpisah)"
              >
                <Store className="w-4 h-4 text-stone-950" />
                <span>{content.hero.ctaMarketplace}</span>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.5 rounded-md bg-stone-950 text-amber-300 font-extrabold flex items-center gap-0.5">
                  <span>Beda Domain</span>
                  <span>↗</span>
                </span>
              </button>

              <button
                onClick={() => {
                  const targetUrl = getMarketplaceBaseUrl() + '/buyer';
                  if (targetUrl.startsWith('http')) {
                    window.open(targetUrl, '_blank');
                  } else {
                    setActiveView('buyer');
                  }
                }}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                title="Buka Portal Akun Pembeli Resmi di Marketplace"
              >
                <ShoppingCart className="w-4 h-4 text-white" />
                <span>Portal Pembeli (Marketplace ↗)</span>
              </button>

              <button
                onClick={() => {
                  navigate({ view: 'dashboard', service: 'verifikator', subRoute: 'petani' });
                }}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-purple-900/90 hover:bg-purple-800 text-purple-200 border border-purple-500/50 font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer"
                title="Portal Auditor Independen Pihak Ketiga"
              >
                <ShieldCheck className="w-4 h-4 text-purple-300" />
                <span>Portal Verifikator (Pihak Ketiga ↗)</span>
              </button>

              <button
                onClick={() => loginAsRole('petani')}
                className="px-6 sm:px-7 py-3.5 sm:py-4 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-black text-sm sm:text-base shadow-lg hover:shadow-xl transition-all flex items-center gap-2 cursor-pointer border border-emerald-500/40"
                title="Quick Login 1-Klik Langsung ke Dashboard Kelompok Tani (Asep Supriatna - Kelompok Tani Gn. Tilu)"
              >
                <Sprout className="w-4 h-4 text-emerald-300" />
                <span>Quick Login: Kelompok Tani</span>
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
                      <span>Masuk Panel {current.role.toUpperCase()}</span>
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
      {/* SECTION 2: SERVICES KITA (5 Pilar Ekosistem Selang-Seling)    */}
      {/* ------------------------------------------------------------- */}
      <section id="services" className="py-24 bg-[#FAF7F2] border-b border-stone-200/80 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header */}
          <ScrollReveal direction="up" className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-3.5 py-1 rounded-full text-xs font-bold mb-3 shadow-xs">
              <Layers className="w-3.5 h-3.5 text-amber-600" />
              {content.servicesHeader.badge}
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-900 tracking-tight">
              {content.servicesHeader.title}
            </h2>
            <p className="mt-3 text-stone-600 text-sm sm:text-base leading-relaxed">
              {content.servicesHeader.subtitle}
            </p>
          </ScrollReveal>

          {/* Quick Jump Navigation Anchor Pills */}
          <div className="flex flex-wrap justify-center gap-2 sm:gap-3 mb-16 lg:mb-24 sticky top-20 z-30 bg-[#FAF7F2]/90 backdrop-blur-md py-3 px-4 rounded-2xl border border-stone-200/80 shadow-md max-w-fit mx-auto">
            {pillarsData.map((tab) => {
              const label = content.roleTabs.find((t) => t.id === tab.id)?.label ?? '';
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    const el = document.getElementById(`pillar-${tab.id}`);
                    if (el) {
                      el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                  }}
                  className="px-3 sm:px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all flex items-center gap-2 cursor-pointer bg-white hover:bg-stone-100 text-stone-700 hover:text-stone-900 border border-stone-200/70 shadow-xs hover:shadow-sm"
                >
                  {tab.badgeIcon}
                  <span>{label}</span>
                </button>
              );
            })}
          </div>

          {/* 5 Alternating Zigzag Modern Sections */}
          <div className="space-y-24 sm:space-y-32 lg:space-y-36">
            {pillarsData.map((pillar) => {
              const isImageRight = pillar.align === 'left';
              return (
                <div
                  key={pillar.id}
                  id={`pillar-${pillar.id}`}
                  className="scroll-mt-32"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
                    
                    {/* Text Column [ tulisan ] */}
                    <ScrollReveal
                      direction={isImageRight ? 'left' : 'right'}
                      className={`lg:col-span-6 space-y-5 ${
                        isImageRight ? 'order-1 lg:order-1' : 'order-1 lg:order-2'
                      }`}
                    >
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border ${pillar.badgeClass}`}>
                        {pillar.badgeIcon}
                        <span>{pillar.panel.badge}</span>
                      </div>

                      <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-stone-900 tracking-tight leading-tight">
                        {pillar.panel.title}
                      </h3>

                      <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                        {pillar.panel.desc}
                      </p>

                      <ul className="space-y-2.5 text-xs sm:text-sm text-stone-700 pt-1">
                        {pillar.panel.bullets.map((bullet, bIdx) => (
                          <li key={bIdx} className="flex items-start gap-2.5 font-medium">
                            <Check className={`w-4 h-4 shrink-0 mt-0.5 ${pillar.checkColor}`} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>

                      <div className="pt-3 flex flex-wrap items-center gap-3">
                        <button
                          onClick={() => loginAsRole(pillar.id)}
                          className={`px-5 py-2.5 rounded-xl font-bold text-xs shadow-md transition-all flex items-center gap-1.5 cursor-pointer hover:shadow-lg ${pillar.buttonColor}`}
                        >
                          <span>{pillar.loginBtnText}</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => openRegister(pillar.id)}
                          className="px-4 py-2.5 rounded-xl bg-white border border-stone-300 text-stone-700 font-bold text-xs hover:bg-stone-100 transition-all cursor-pointer shadow-xs"
                        >
                          {pillar.panel.ctaRegister}
                        </button>
                      </div>
                    </ScrollReveal>

                    {/* Image Column with Fade Out ke Tengah [ tulisan ] & Floating Live Preview Card */}
                    <ScrollReveal
                      direction={isImageRight ? 'right' : 'left'}
                      delay={120}
                      className={`lg:col-span-6 ${
                        isImageRight ? 'order-2 lg:order-2' : 'order-2 lg:order-1'
                      }`}
                    >
                      <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/80 group bg-stone-900 min-h-[460px] sm:min-h-[500px] flex flex-col justify-end">
                        {/* High-Resolution Authentic Photography */}
                        <img
                          src={pillar.image}
                          alt={pillar.imageAlt}
                          className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                          loading="lazy"
                        />

                        {/* Modern Gradient Fade Out to Center [ tulisan ] */}
                        {isImageRight ? (
                          // Right Image: fades to the left towards the center text column
                          <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent z-10 pointer-events-none hidden lg:block" />
                        ) : (
                          // Left Image: fades to the right towards the center text column
                          <div className="absolute inset-y-0 right-0 w-1/2 bg-gradient-to-l from-[#FAF7F2] via-[#FAF7F2]/60 to-transparent z-10 pointer-events-none hidden lg:block" />
                        )}

                        {/* Mobile/Tablet top edge subtle blend */}
                        <div className="absolute inset-x-0 top-0 h-16 bg-gradient-to-b from-[#FAF7F2]/80 to-transparent z-10 pointer-events-none lg:hidden" />

                        {/* Bottom cinematic gradient overlay for preview card contrast */}
                        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/85 via-stone-950/30 to-transparent z-10 pointer-events-none" />

                        {/* Floating Live Telemetry Preview Card */}
                        <div className="relative z-20 p-4 sm:p-6">
                          <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-2xl border border-white/80 shadow-2xl space-y-3.5">
                            <div className="flex items-center justify-between border-b border-stone-200/70 pb-3">
                              <span className="text-xs sm:text-sm font-bold text-stone-900 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                                {pillar.panel.previewTitle}
                              </span>
                              <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${pillar.lotBadgeClass}`}>
                                {pillar.lotCode}
                              </span>
                            </div>

                            <div className="space-y-2 text-xs">
                              {pillar.panel.previewRows.map((row, rIdx) => (
                                <div
                                  key={rIdx}
                                  className={`flex justify-between items-center py-1.5 ${
                                    rIdx < pillar.panel.previewRows.length - 1 ? 'border-b border-stone-100' : ''
                                  }`}
                                >
                                  <span className="text-stone-500 font-medium">{row.label}</span>
                                  <span className={`font-bold ${getRowValueColor(pillar.id, rIdx)}`}>
                                    {row.value}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                      </div>
                    </ScrollReveal>

                  </div>
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 3: KELEBIHAN KITA (Value Propositions & Advantages)    */}
      {/* ------------------------------------------------------------- */}
      <section id="advantages" className="py-24 bg-white border-b border-stone-200/80">
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
      {/* SECTION: TIER 1 BUYER PORTAL (Direct Coffee Commerce & Cart) */}
      {/* ------------------------------------------------------------- */}
      <section id="buyer-portal" className="py-20 bg-gradient-to-b from-[#FAF7F2] to-emerald-50/50 border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="p-8 sm:p-12 rounded-3xl bg-gradient-to-r from-emerald-950 via-stone-900 to-teal-950 text-white shadow-2xl border border-emerald-600/40 relative overflow-hidden">
            <div className="absolute right-0 top-0 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 space-y-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-400/20 text-emerald-300 border border-emerald-400/30 text-xs font-black uppercase tracking-wider">
                    <ShoppingCart className="w-3.5 h-3.5" />
                    <span>VISITOR TIER 1 &bull; KHUSUS PEMBELI &amp; KEDAI KOPI (BUYER MEMBER)</span>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-black text-white mt-2 tracking-tight">
                    Akun Pembeli Resmi (Direct Coffee Commerce)
                  </h3>
                  <p className="text-stone-300 text-xs sm:text-sm max-w-2xl mt-1 leading-relaxed">
                    Sesuai instruksi Circular Trace, pengunjung maupun pengusaha kedai kopi wajib memiliki <strong>Akun Member Pembeli Terverifikasi</strong> untuk dapat memesan komoditas kopi langsung dari petani &amp; mill resmi.
                  </p>
                </div>

                <div className="flex items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => {
                      const targetUrl = getMarketplaceBaseUrl() + '/buyer';
                      if (targetUrl.startsWith('http')) {
                        window.open(targetUrl, '_blank');
                      } else {
                        setActiveView('buyer');
                      }
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#00AA5B] hover:bg-[#03AC0E] text-white font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center gap-2"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    <span>Buka Portal Pembeli (Marketplace ↗)</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveView('marketplace')}
                    className="px-5 py-3 rounded-2xl bg-white/10 hover:bg-white/20 text-white border border-white/20 font-bold text-xs sm:text-sm transition-all cursor-pointer"
                  >
                    Buka Marketplace Bebas
                  </button>
                </div>
              </div>

              {/* 3 Value Pillars for Buyer */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-emerald-500/20 text-emerald-300 flex items-center justify-center font-black">
                    <ShieldCheck className="w-5 h-5 text-emerald-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">1. Wajib Akun Terverifikasi</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Transaksi komoditas diamankan dengan persetujuan Circular Trace untuk mencegah pesanan fiktif &amp; melindungi para petani.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center font-black">
                    <Tag className="w-5 h-5 text-amber-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">2. Biaya Layanan Transparan</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Platform fee pembeli Rp 2.500 / order yang transparan untuk pemeliharaan stempel paspor ketelusuran (traceability) dan lab cupping.
                  </p>
                </div>

                <div className="p-4 rounded-2xl bg-white/5 border border-white/10 space-y-2">
                  <div className="w-9 h-9 rounded-xl bg-blue-500/20 text-blue-300 flex items-center justify-center font-black">
                    <Truck className="w-5 h-5 text-blue-400" />
                  </div>
                  <h4 className="font-bold text-sm text-white">3. Kurir Ekspedisi &amp; Resi</h4>
                  <p className="text-[11px] text-stone-300 leading-relaxed">
                    Pengiriman dengan J&amp;T Cargo, JNE, dan SiCepat lengkap dengan nomor resi kurir real-time dan barcode ketelusuran farm-to-cup.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* ------------------------------------------------------------- */}
      {/* SECTION: PRICING BUNDLE ALL-IN-ONE (1 Bulan s/d 1 Tahun)      */}
      {/* ------------------------------------------------------------- */}
      <section id="pricing" className="py-24 bg-white border-b border-stone-200/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center max-w-3xl mx-auto mb-14 space-y-4">
            <div className="inline-flex items-center gap-2 bg-amber-100 text-amber-900 border border-amber-300 px-4 py-1.5 rounded-full text-xs font-black uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-amber-600" />
              <span>Paket Berlangganan Ekosistem sangrAI</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-stone-950 tracking-tight">
              Satu Paket Bundle, Semua Layanan Aktif
            </h2>
            <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
              Tidak perlu sewa modul terpisah satu per satu. Pilih varian durasi yang sesuai untuk operasional perkebunan, stasiun mill, roastery, hingga kafe Anda &mdash; semua layanan terbuka 100% langsung aktif.
            </p>
          </div>

          <SubscriptionPricingCards showAllInclusiveBanner={true} />
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
