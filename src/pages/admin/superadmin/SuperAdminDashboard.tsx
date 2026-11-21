import React, { useState, useMemo } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  ShieldAlert,
  Building2,
  Warehouse,
  Flame,
  Coffee,
  ShieldCheck,
  Package,
  CreditCard,
  Users,
  History,
  TrendingUp,
  Activity,
  Layers,
  ArrowRight,
  ExternalLink,
  CheckCircle2,
  AlertCircle,
  Zap,
  Globe,
  DollarSign,
  QrCode,
  TreePine,
  Sparkles,
  Settings,
  Sliders,
  ChevronRight,
  Store,
  RefreshCw,
  Clock,
  PieChart as PieIcon,
  BarChart3,
  Calendar,
  Filter,
  Eye,
  SlidersHorizontal,
} from 'lucide-react';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  DEFAULT_SERVICE_CONFIGS,
  DEFAULT_SUBSCRIBED_ORGANIZATIONS,
  DEFAULT_ECOSYSTEM_TELEMETRY,
  DEFAULT_SAAS_INVOICES,
  getSavedServiceConfigs,
  getSavedSubscriptions,
  getSavedTelemetry,
} from '../../../data/superAdminData';

// Dynamic Chart Time Ranges
type ChartTimeRange = '6m' | '30d' | '7d';
type MetricViewMode = 'mrr' | 'volume' | 'tenants' | 'scans';
type BarMetricMode = 'volume' | 'gmv' | 'lots';
type DonutMode = 'revenue' | 'tenants' | 'users';

export const SuperAdminDashboard: React.FC = () => {
  const navigate = useNavigate();
  const { users, currentUser } = useCoffee();

  const serviceConfigs = useMemo(() => getSavedServiceConfigs(), []);
  const subscriptions = useMemo(() => getSavedSubscriptions(), []);
  const telemetry = useMemo(() => getSavedTelemetry(), []);
  const invoices = DEFAULT_SAAS_INVOICES;

  // Realtime user counts per service
  const kelompokTaniCount = (users || []).filter(
    (u) =>
      u.role === 'admin_kelompok_tani' ||
      u.role === 'petani' ||
      u.role === 'pengolah' ||
      u.role === 'ict'
  ).length;
  const gudangCount = (users || []).filter((u) => u.role === 'gudang').length;
  const roasterCount = (users || []).filter((u) => u.role === 'roaster').length;
  const cafeCount = (users || []).filter((u) => u.role === 'cafe').length;
  const verifikatorCount = (users || []).filter((u) => u.role === 'verifikator').length;

  const totalMRR = subscriptions
    .filter((s) => s.status === 'active' || s.status === 'trial')
    .reduce((acc, s) => acc + (s.mrrContribution || 0), 0);
  const totalARR = totalMRR * 12;

  // ---------------------------------------------------------------------------
  // INTERACTIVE CHART 1: Dynamic Line / Area Trend Chart State & Data
  // ---------------------------------------------------------------------------
  const [timeRange, setTimeRange] = useState<ChartTimeRange>('6m');
  const [metricMode, setMetricMode] = useState<MetricViewMode>('mrr');
  const [hoveredDataPoint, setHoveredDataPoint] = useState<{
    label: string;
    value: number;
    formatted: string;
    growth: string;
    x: number;
    y: number;
  } | null>(null);

  // Dynamic Series based on Range & Metric
  const lineChartData = useMemo(() => {
    if (timeRange === '6m') {
      if (metricMode === 'mrr') {
        return [
          { label: 'Jun 2026', value: 34200000, formatted: 'Rp 34.200.000', growth: '+8.4%' },
          { label: 'Jul 2026', value: 39500000, formatted: 'Rp 39.500.000', growth: '+15.5%' },
          { label: 'Agu 2026', value: 43800000, formatted: 'Rp 43.800.000', growth: '+10.8%' },
          { label: 'Sep 2026', value: 48200000, formatted: 'Rp 48.200.000', growth: '+10.0%' },
          { label: 'Okt 2026', value: 51400000, formatted: 'Rp 51.400.000', growth: '+6.6%' },
          { label: 'Nov 2026', value: totalMRR, formatted: `Rp ${totalMRR.toLocaleString('id-ID')}`, growth: '+14.2% MoM' },
        ];
      }
      if (metricMode === 'volume') {
        return [
          { label: 'Jun 2026', value: 84.5, formatted: '84.5 Ton', growth: '+12.1%' },
          { label: 'Jul 2026', value: 98.2, formatted: '98.2 Ton', growth: '+16.2%' },
          { label: 'Agu 2026', value: 114.0, formatted: '114.0 Ton', growth: '+16.0%' },
          { label: 'Sep 2026', value: 128.6, formatted: '128.6 Ton', growth: '+12.8%' },
          { label: 'Okt 2026', value: 139.4, formatted: '139.4 Ton', growth: '+8.4%' },
          { label: 'Nov 2026', value: 148.75, formatted: '148.75 Ton', growth: '+6.7%' },
        ];
      }
      if (metricMode === 'tenants') {
        return [
          { label: 'Jun 2026', value: 48, formatted: '48 Org', growth: '+10 Org' },
          { label: 'Jul 2026', value: 59, formatted: '59 Org', growth: '+11 Org' },
          { label: 'Agu 2026', value: 71, formatted: '71 Org', growth: '+12 Org' },
          { label: 'Sep 2026', value: 82, formatted: '82 Org', growth: '+11 Org' },
          { label: 'Okt 2026', value: 89, formatted: '89 Org', growth: '+7 Org' },
          { label: 'Nov 2026', value: subscriptions.length, formatted: `${subscriptions.length} Org`, growth: '+8 Org' },
        ];
      }
      // scans
      return [
        { label: 'Jun 2026', value: 19400, formatted: '19.400 Scans', growth: '+18.4%' },
        { label: 'Jul 2026', value: 24800, formatted: '24.800 Scans', growth: '+27.8%' },
        { label: 'Agu 2026', value: 29500, formatted: '29.500 Scans', growth: '+18.9%' },
        { label: 'Sep 2026', value: 34200, formatted: '34.200 Scans', growth: '+15.9%' },
        { label: 'Okt 2026', value: 38100, formatted: '38.100 Scans', growth: '+11.4%' },
        { label: 'Nov 2026', value: telemetry.totalFarmToCupQrScans, formatted: `${telemetry.totalFarmToCupQrScans.toLocaleString('id-ID')} Scans`, growth: '+10.0%' },
      ];
    }

    if (timeRange === '30d') {
      const base = metricMode === 'mrr' ? 51000000 : metricMode === 'volume' ? 140 : metricMode === 'tenants' ? 90 : 38000;
      return [
        { label: 'Minggu 1', value: base * 0.94, formatted: metricMode === 'mrr' ? `Rp ${(base * 0.94).toLocaleString('id-ID')}` : `${(base * 0.94).toFixed(1)}`, growth: '+2.1%' },
        { label: 'Minggu 2', value: base * 0.96, formatted: metricMode === 'mrr' ? `Rp ${(base * 0.96).toLocaleString('id-ID')}` : `${(base * 0.96).toFixed(1)}`, growth: '+2.8%' },
        { label: 'Minggu 3', value: base * 0.98, formatted: metricMode === 'mrr' ? `Rp ${(base * 0.98).toLocaleString('id-ID')}` : `${(base * 0.98).toFixed(1)}`, growth: '+3.1%' },
        { label: 'Minggu 4', value: base * 1.02, formatted: metricMode === 'mrr' ? `Rp ${(base * 1.02).toLocaleString('id-ID')}` : `${(base * 1.02).toFixed(1)}`, growth: '+4.5%' },
      ];
    }

    // 7 days
    const dailyBase = metricMode === 'mrr' ? 53800000 : metricMode === 'volume' ? 147 : metricMode === 'tenants' ? 96 : 41200;
    return [
      { label: 'Sen', value: dailyBase * 0.98, formatted: 'Hari ke-1', growth: '+0.4%' },
      { label: 'Sel', value: dailyBase * 0.985, formatted: 'Hari ke-2', growth: '+0.5%' },
      { label: 'Rab', value: dailyBase * 0.99, formatted: 'Hari ke-3', growth: '+0.5%' },
      { label: 'Kam', value: dailyBase * 0.995, formatted: 'Hari ke-4', growth: '+0.5%' },
      { label: 'Jum', value: dailyBase * 1.0, formatted: 'Hari ke-5', growth: '+0.6%' },
      { label: 'Sab', value: dailyBase * 1.005, formatted: 'Hari ke-6', growth: '+0.5%' },
      { label: 'Min', value: dailyBase * 1.01, formatted: 'Hari ke-7', growth: '+0.8%' },
    ];
  }, [timeRange, metricMode, totalMRR, subscriptions.length, telemetry.totalFarmToCupQrScans]);

  // SVG Line / Area calculation
  const svgWidth = 650;
  const svgHeight = 220;
  const paddingX = 40;
  const paddingY = 30;

  const { pathD, areaD, points } = useMemo(() => {
    if (lineChartData.length < 2) return { pathD: '', areaD: '', points: [] };

    const values = lineChartData.map((d) => d.value);
    const minVal = Math.min(...values) * 0.92;
    const maxVal = Math.max(...values) * 1.05;
    const range = maxVal - minVal || 1;

    const computedPoints = lineChartData.map((d, i) => {
      const x = paddingX + (i / (lineChartData.length - 1)) * (svgWidth - 2 * paddingX);
      const y = svgHeight - paddingY - ((d.value - minVal) / range) * (svgHeight - 2 * paddingY);
      return { x, y, data: d };
    });

    // Smooth spline curve using Bezier
    let path = `M ${computedPoints[0].x} ${computedPoints[0].y}`;
    for (let i = 0; i < computedPoints.length - 1; i++) {
      const p0 = computedPoints[i];
      const p1 = computedPoints[i + 1];
      const cx = (p0.x + p1.x) / 2;
      path += ` C ${cx} ${p0.y}, ${cx} ${p1.y}, ${p1.x} ${p1.y}`;
    }

    const firstPoint = computedPoints[0];
    const lastPoint = computedPoints[computedPoints.length - 1];
    const area = `${path} L ${lastPoint.x} ${svgHeight - paddingY} L ${firstPoint.x} ${svgHeight - paddingY} Z`;

    return { pathD: path, areaD: area, points: computedPoints };
  }, [lineChartData]);

  // ---------------------------------------------------------------------------
  // INTERACTIVE CHART 2: Bar Chart (Physical Volume & Flow per Pillar)
  // ---------------------------------------------------------------------------
  const [barMetric, setBarMetric] = useState<BarMetricMode>('volume');
  const [selectedPillarId, setSelectedPillarId] = useState<string | null>(null);

  const barData = useMemo(() => {
    return [
      {
        id: 'admin_kelompok_tani',
        label: 'Ceri Hulu (Gapoktan)',
        volumeKg: 85400,
        gmvRp: 128100000,
        lotsCount: 42,
        color: '#f59e0b', // amber
        accentBg: 'bg-amber-500',
        stage: 'Tahap 1: Pemetikan Kebun & Brix 22-25%',
      },
      {
        id: 'pengolah',
        label: 'Wet/Dry Mill (Fermentasi)',
        volumeKg: 58200,
        gmvRp: 145500000,
        lotsCount: 35,
        color: '#d97706', // amber dark
        accentBg: 'bg-amber-600',
        stage: 'Tahap 2: Fermentasi Washed/Natural/Honey',
      },
      {
        id: 'gudang',
        label: 'Gudang QA Hermetik',
        volumeKg: 42150,
        gmvRp: 189675000,
        lotsCount: 28,
        color: '#3b82f6', // blue
        accentBg: 'bg-blue-500',
        stage: 'Tahap 3: Uji Kadar Air < 11.5% & Aw < 0.58',
      },
      {
        id: 'roaster',
        label: 'Artisan Roastery',
        volumeKg: 21200,
        gmvRp: 212000000,
        lotsCount: 32,
        color: '#f97316', // orange
        accentBg: 'bg-orange-500',
        stage: 'Tahap 4: Agtron 55-65 Medium & Sensori 84+',
      },
      {
        id: 'cafe',
        label: 'Retail Cafe & Cangkir',
        volumeKg: 14850,
        gmvRp: 297000000,
        lotsCount: 24,
        color: '#78716c', // stone
        accentBg: 'bg-stone-600',
        stage: 'Tahap 5: 41,920 Cangkir Farm-to-Cup QR',
      },
    ];
  }, []);

  const maxBarValue = useMemo(() => {
    const vals = barData.map((b) =>
      barMetric === 'volume' ? b.volumeKg : barMetric === 'gmv' ? b.gmvRp : b.lotsCount
    );
    return Math.max(...vals);
  }, [barData, barMetric]);

  // Selected bar details card
  const activePillarDetail = useMemo(() => {
    return barData.find((b) => b.id === (selectedPillarId || 'admin_kelompok_tani')) || barData[0];
  }, [barData, selectedPillarId]);

  // ---------------------------------------------------------------------------
  // INTERACTIVE CHART 3: Donut / Radial Chart (Pilar Distribution)
  // ---------------------------------------------------------------------------
  const [donutMode, setDonutMode] = useState<DonutMode>('revenue');
  const [hoveredSlice, setHoveredSlice] = useState<string | null>(null);

  const donutSegments = useMemo(() => {
    if (donutMode === 'revenue') {
      return [
        { id: 'admin_kelompok_tani', label: 'Kelompok Tani', value: 20450000, percent: 37.7, color: '#f59e0b', formatted: 'Rp 20.450.000/bln' },
        { id: 'roaster', label: 'Roastery Lab', value: 14970000, percent: 27.6, color: '#f97316', formatted: 'Rp 14.970.000/bln' },
        { id: 'gudang', label: 'Gudang & QA', value: 9580000, percent: 17.7, color: '#3b82f6', formatted: 'Rp 9.580.000/bln' },
        { id: 'cafe', label: 'Cafe & Kedai', value: 6205000, percent: 11.4, color: '#78716c', formatted: 'Rp 6.205.000/bln' },
        { id: 'verifikator', label: 'Verifikator Mutu', value: 2998000, percent: 5.6, color: '#9333ea', formatted: 'Rp 2.998.000/bln' },
      ];
    }
    if (donutMode === 'tenants') {
      return [
        { id: 'admin_kelompok_tani', label: 'Kelompok Tani', value: 38, percent: 39.2, color: '#f59e0b', formatted: '38 Organisasi' },
        { id: 'roaster', label: 'Roastery Lab', value: 25, percent: 25.8, color: '#f97316', formatted: '25 Organisasi' },
        { id: 'cafe', label: 'Cafe & Kedai', value: 18, percent: 18.6, color: '#78716c', formatted: '18 Organisasi' },
        { id: 'gudang', label: 'Gudang & QA', value: 11, percent: 11.3, color: '#3b82f6', formatted: '11 Organisasi' },
        { id: 'verifikator', label: 'Verifikator Mutu', value: 5, percent: 5.1, color: '#9333ea', formatted: '5 Lembaga' },
      ];
    }
    // users
    return [
      { id: 'admin_kelompok_tani', label: 'Petani & Pengolah Hulu', value: kelompokTaniCount, percent: 45.7, color: '#f59e0b', formatted: `${kelompokTaniCount} Pengguna` },
      { id: 'roaster', label: 'Roastery & Roaster', value: roasterCount, percent: 22.8, color: '#f97316', formatted: `${roasterCount} Pengguna` },
      { id: 'cafe', label: 'Barista & Cafe Crew', value: cafeCount, percent: 17.1, color: '#78716c', formatted: `${cafeCount} Pengguna` },
      { id: 'gudang', label: 'Staff Gudang & QA', value: gudangCount, percent: 8.6, color: '#3b82f6', formatted: `${gudangCount} Pengguna` },
      { id: 'verifikator', label: 'Auditor & Q-Grader', value: verifikatorCount, percent: 5.8, color: '#9333ea', formatted: `${verifikatorCount} Pengguna` },
    ];
  }, [donutMode, kelompokTaniCount, roasterCount, cafeCount, gudangCount, verifikatorCount]);

  // Donut SVG circumference calculation
  const donutRadius = 70;
  const donutCircumference = 2 * Math.PI * donutRadius; // 439.82

  // ---------------------------------------------------------------------------
  // 5 Pillars metadata for cards
  // ---------------------------------------------------------------------------
  const pillars = [
    {
      id: 'admin_kelompok_tani' as const,
      name: 'Kelompok Tani & Hulu',
      subtitle: 'Kebun Petani, Wet/Dry Mill & Tim ICS',
      icon: Building2,
      color: 'amber',
      bgCard: 'bg-amber-50/70 border-amber-200',
      badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
      usersCount: kelompokTaniCount,
      tenantsCount: 6,
      maxUsersPerOrg: serviceConfigs.admin_kelompok_tani.quota.maxUsersPerOrg,
      metricKey: 'Luas Lahan EUDR',
      metricVal: '512.4 Ha (342 Kebun)',
      status: serviceConfigs.admin_kelompok_tani.status,
    },
    {
      id: 'gudang' as const,
      name: 'Gudang & QA Lab',
      subtitle: 'Karung Hermetik, Uji Kadar Air & Aw',
      icon: Warehouse,
      color: 'blue',
      bgCard: 'bg-blue-50/70 border-blue-200',
      badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
      usersCount: gudangCount,
      tenantsCount: 3,
      maxUsersPerOrg: serviceConfigs.gudang.quota.maxUsersPerOrg,
      metricKey: 'Green Bean Stored',
      metricVal: '42.1 Ton (Specialty)',
      status: serviceConfigs.gudang.status,
    },
    {
      id: 'roaster' as const,
      name: 'Artisan Roastery',
      subtitle: 'Profiling Agtron, Work Orders & Sensory',
      icon: Flame,
      color: 'orange',
      bgCard: 'bg-orange-50/70 border-orange-200',
      badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
      usersCount: roasterCount,
      tenantsCount: 4,
      maxUsersPerOrg: serviceConfigs.roaster.quota.maxUsersPerOrg,
      metricKey: 'Roasted Bean Pack',
      metricVal: '21.2 Ton (B2B / Retail)',
      status: serviceConfigs.roaster.status,
    },
    {
      id: 'cafe' as const,
      name: 'Specialty Cafe & Kedai',
      subtitle: 'Seduhan Cangkir, Digital Menu & Retail',
      icon: Coffee,
      color: 'stone',
      bgCard: 'bg-stone-100/70 border-stone-300',
      badgeBg: 'bg-stone-200 text-stone-900 border-stone-400',
      usersCount: cafeCount,
      tenantsCount: 4,
      maxUsersPerOrg: serviceConfigs.cafe.quota.maxUsersPerOrg,
      metricKey: 'Farm-to-Cup Scans',
      metricVal: '41,920 Tamu Kedai',
      status: serviceConfigs.cafe.status,
    },
    {
      id: 'verifikator' as const,
      name: 'Verifikator Mutu (Auditor)',
      subtitle: 'Audit Lapangan & Stempel SHA-256',
      icon: ShieldCheck,
      color: 'purple',
      bgCard: 'bg-purple-50/70 border-purple-200',
      badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
      usersCount: verifikatorCount,
      tenantsCount: 2,
      maxUsersPerOrg: serviceConfigs.verifikator.quota.maxUsersPerOrg,
      metricKey: 'Stempel SHA-256',
      metricVal: '100% Valid & Verified',
      status: serviceConfigs.verifikator.status,
    },
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Executive Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#120B08] via-[#1E110A] to-[#0D0705] text-white p-6 sm:p-8 border border-amber-900/40 shadow-2xl relative overflow-hidden">
        {/* Glow ambient decorations */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/15 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-gradient-to-r from-amber-500 to-amber-600 text-stone-950 font-black shadow-md shadow-amber-950/40 flex items-center gap-1.5">
                <ShieldAlert className="w-3.5 h-3.5 text-stone-950" />
                Super Admin Console
              </span>
              <span className="px-3 py-1 rounded-full text-[11px] font-bold bg-white/10 text-stone-300 border border-white/15">
                🟢 Platform Owner HQ • Live Production
              </span>
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center gap-2">
              <Link
                to="/admin/superadmin/subscriptions"
                className="py-2 px-3.5 rounded-xl bg-purple-900/80 hover:bg-purple-800 text-purple-200 font-bold text-xs border border-purple-700/60 shadow-xs flex items-center gap-1.5 transition-colors"
              >
                <CreditCard className="w-3.5 h-3.5" />
                <span>Subscribed Users</span>
              </Link>

              <Link
                to="/admin/superadmin/packages"
                className="py-2 px-3.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md shadow-amber-950/30 flex items-center gap-1.5 transition-colors"
              >
                <Package className="w-3.5 h-3.5" />
                <span>Katalog Paket SaaS</span>
              </Link>
            </div>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Pusat Kendali Ekosistem &amp; Executive SaaS Dashboard
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              Monitoring holistik platform CircularTrace: visualisasi tren pertumbuhan MRR, diagram aliran komoditas kopi, distribusi pelanggan 5 pilar, dan kepatuhan deforestasi EUDR realtime.
            </p>
          </div>

          {/* 4 Core Executive KPI Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {/* KPI 1: MRR */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Monthly Recurring (MRR)</span>
                <span className="text-emerald-400 font-bold">+14.2% MoM</span>
              </div>
              <div className="text-2xl font-black text-emerald-400">
                Rp {totalMRR.toLocaleString('id-ID')}
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                ARR: <strong className="text-white">Rp {totalARR.toLocaleString('id-ID')}</strong>/thn
              </div>
            </div>

            {/* KPI 2: Subscribed Tenants */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Organisasi Pelanggan</span>
                <span className="text-amber-400 font-bold">5 Pilar</span>
              </div>
              <div className="text-2xl font-black text-white">
                {subscriptions.length} <span className="text-sm font-bold text-stone-400">Tenant</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Retensi: <strong className="text-emerald-400">96.4%</strong> • Churn &lt; 4%
              </div>
            </div>

            {/* KPI 3: Total Users */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Akun Pengguna Terdaftar</span>
                <span className="text-cyan-400 font-bold">Realtime</span>
              </div>
              <div className="text-2xl font-black text-white">
                {users.length} <span className="text-sm font-bold text-stone-400">Pengguna</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Verifikasi: <strong className="text-emerald-400">100% Email Valid</strong>
              </div>
            </div>

            {/* KPI 4: Traced Volume */}
            <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <div className="flex items-center justify-between text-[11px] text-stone-400 font-bold uppercase tracking-wider mb-1">
                <span>Volume Kopi Tertelusur</span>
                <span className="text-purple-400 font-bold">Farm-to-Cup</span>
              </div>
              <div className="text-2xl font-black text-cyan-400">
                {(telemetry.totalTracedVolumeKg / 1000).toFixed(1)}{' '}
                <span className="text-sm font-bold text-stone-300">Ton</span>
              </div>
              <div className="text-[11px] text-stone-400 mt-0.5">
                Scan Tamu: <strong className="text-white">{telemetry.totalFarmToCupQrScans.toLocaleString('id-ID')} QR</strong>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* 2. DYNAMIC INTERACTIVE CHARTS SECTION (USER REQUEST: Line, Bar, Donut) */}
      {/* -------------------------------------------------------------------- */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* CHART 1: Dynamic Line / Area Trend Chart (2 Columns) */}
        <div className="lg:col-span-2 bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5 flex flex-col justify-between">
          <div>
            {/* Header with Metric & Range Controls */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Tren Analisis &amp; Pertumbuhan Platform
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Visualisasi kurva dinamis responsif terhadap data ekosistem
                  </p>
                </div>
              </div>

              {/* Time Range Filter Buttons */}
              <div className="flex items-center bg-stone-100 p-1 rounded-xl text-[11px] font-bold">
                <button
                  type="button"
                  onClick={() => setTimeRange('7d')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '7d' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  7 Hari
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('30d')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '30d' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  30 Hari
                </button>
                <button
                  type="button"
                  onClick={() => setTimeRange('6m')}
                  className={`px-3 py-1 rounded-lg transition-all cursor-pointer ${
                    timeRange === '6m' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
                  }`}
                >
                  6 Bulan
                </button>
              </div>
            </div>

            {/* Metric Mode Selector Tabs */}
            <div className="flex items-center gap-2 pt-1 pb-3 overflow-x-auto text-xs font-bold">
              <button
                type="button"
                onClick={() => setMetricMode('mrr')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  metricMode === 'mrr'
                    ? 'bg-emerald-50 border-emerald-300 text-emerald-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <DollarSign className="w-3.5 h-3.5 text-emerald-600" />
                <span>Pendapatan MRR</span>
              </button>

              <button
                type="button"
                onClick={() => setMetricMode('volume')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  metricMode === 'volume'
                    ? 'bg-cyan-50 border-cyan-300 text-cyan-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Layers className="w-3.5 h-3.5 text-cyan-600" />
                <span>Volume Kopi (Ton)</span>
              </button>

              <button
                type="button"
                onClick={() => setMetricMode('tenants')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  metricMode === 'tenants'
                    ? 'bg-amber-50 border-amber-300 text-amber-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <Users className="w-3.5 h-3.5 text-amber-600" />
                <span>Organisasi Tenant</span>
              </button>

              <button
                type="button"
                onClick={() => setMetricMode('scans')}
                className={`px-3 py-1.5 rounded-xl border transition-all cursor-pointer flex items-center gap-1.5 ${
                  metricMode === 'scans'
                    ? 'bg-purple-50 border-purple-300 text-purple-900 shadow-2xs'
                    : 'bg-stone-50 border-stone-200 text-stone-600 hover:bg-stone-100'
                }`}
              >
                <QrCode className="w-3.5 h-3.5 text-purple-600" />
                <span>QR Consumer Scans</span>
              </button>
            </div>

            {/* Dynamic SVG Curve Chart Area */}
            <div className="relative bg-stone-50/60 rounded-2xl border border-stone-200/80 p-3 overflow-hidden">
              <svg
                viewBox={`0 0 ${svgWidth} ${svgHeight}`}
                className="w-full h-48 sm:h-56 overflow-visible"
              >
                <defs>
                  {/* Linear Gradient for Area Fill */}
                  <linearGradient id="curveGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor={
                        metricMode === 'mrr'
                          ? '#10b981'
                          : metricMode === 'volume'
                          ? '#06b6d4'
                          : metricMode === 'tenants'
                          ? '#f59e0b'
                          : '#a855f7'
                      }
                      stopOpacity="0.35"
                    />
                    <stop
                      offset="100%"
                      stopColor={
                        metricMode === 'mrr'
                          ? '#10b981'
                          : metricMode === 'volume'
                          ? '#06b6d4'
                          : metricMode === 'tenants'
                          ? '#f59e0b'
                          : '#a855f7'
                      }
                      stopOpacity="0.0"
                    />
                  </linearGradient>
                </defs>

                {/* Horizontal Guide Grid Lines */}
                <line x1={paddingX} y1={paddingY} x2={svgWidth - paddingX} y2={paddingY} stroke="#e7e5e4" strokeDasharray="3 3" />
                <line x1={paddingX} y1={(svgHeight - paddingY + paddingY) / 2} x2={svgWidth - paddingX} y2={(svgHeight - paddingY + paddingY) / 2} stroke="#e7e5e4" strokeDasharray="3 3" />
                <line x1={paddingX} y1={svgHeight - paddingY} x2={svgWidth - paddingX} y2={svgHeight - paddingY} stroke="#d6d3d1" />

                {/* Area Polygon */}
                {areaD && (
                  <path d={areaD} fill="url(#curveGradient)" className="transition-all duration-300" />
                )}

                {/* Smooth Curve Line */}
                {pathD && (
                  <path
                    d={pathD}
                    fill="none"
                    stroke={
                      metricMode === 'mrr'
                        ? '#059669'
                        : metricMode === 'volume'
                        ? '#0891b2'
                        : metricMode === 'tenants'
                        ? '#d97706'
                        : '#9333ea'
                    }
                    strokeWidth="3.5"
                    strokeLinecap="round"
                    className="transition-all duration-300"
                  />
                )}

                {/* Data Points */}
                {points.map((pt, idx) => (
                  <g key={idx}>
                    <circle
                      cx={pt.x}
                      cy={pt.y}
                      r="5"
                      fill="#ffffff"
                      stroke={
                        metricMode === 'mrr'
                          ? '#059669'
                          : metricMode === 'volume'
                          ? '#0891b2'
                          : metricMode === 'tenants'
                          ? '#d97706'
                          : '#9333ea'
                      }
                      strokeWidth="3"
                      className="cursor-pointer transition-transform hover:scale-150"
                      onMouseEnter={() =>
                        setHoveredDataPoint({
                          label: pt.data.label,
                          value: pt.data.value,
                          formatted: pt.data.formatted,
                          growth: pt.data.growth,
                          x: pt.x,
                          y: pt.y,
                        })
                      }
                    />
                    {/* X-Axis Labels */}
                    <text
                      x={pt.x}
                      y={svgHeight - 10}
                      textAnchor="middle"
                      className="text-[10px] fill-stone-500 font-bold select-none"
                    >
                      {pt.data.label}
                    </text>
                  </g>
                ))}
              </svg>

              {/* Floating Tooltip if Hovered */}
              {hoveredDataPoint && (
                <div
                  className="absolute bg-stone-900 text-white px-3 py-2 rounded-xl text-xs shadow-xl border border-stone-700 pointer-events-none transition-all z-20 flex flex-col gap-0.5"
                  style={{
                    left: `${Math.min(svgWidth - 120, Math.max(10, (hoveredDataPoint.x / svgWidth) * 100))}%`,
                    top: '15px',
                  }}
                >
                  <span className="text-[10px] text-stone-400 uppercase font-black tracking-wider">
                    {hoveredDataPoint.label}
                  </span>
                  <div className="font-black text-sm text-amber-400">
                    {hoveredDataPoint.formatted}
                  </div>
                  <span className="text-[10px] text-emerald-400 font-bold">
                    {hoveredDataPoint.growth}
                  </span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-2 text-xs text-stone-500 flex items-center justify-between border-t border-stone-100">
            <span>
              Titik akhir berjalan:{' '}
              <strong className="text-stone-900">
                {lineChartData[lineChartData.length - 1]?.formatted}
              </strong>
            </span>
            <span className="text-[11px] text-emerald-700 font-bold bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
              Kompilasi Realtime Berdasarkan Data Ekosistem
            </span>
          </div>
        </div>

        {/* CHART 3: Donut / Radial Breakdown Chart (1 Column) */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <PieIcon className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Proporsi Ekosistem (Donut)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Distribusi 5 pilar rantai pasok kopi
                  </p>
                </div>
              </div>

              {/* Mode switch */}
              <select
                value={donutMode}
                onChange={(e) => setDonutMode(e.target.value as DonutMode)}
                className="bg-stone-50 border border-stone-200 text-stone-800 text-[11px] font-bold px-2 py-1 rounded-lg focus:outline-hidden"
              >
                <option value="revenue">MRR (Rp)</option>
                <option value="tenants">Tenants (Org)</option>
                <option value="users">Users (Akun)</option>
              </select>
            </div>

            {/* SVG Donut Ring Graphic */}
            <div className="relative py-4 flex items-center justify-center">
              <svg viewBox="0 0 200 200" className="w-44 h-44 -rotate-90">
                {/* Background Ring */}
                <circle
                  cx="100"
                  cy="100"
                  r={donutRadius}
                  fill="none"
                  stroke="#f5f5f4"
                  strokeWidth="24"
                />

                {/* Segments calculation */}
                {(() => {
                  let accumulatedPercent = 0;
                  return donutSegments.map((seg) => {
                    const strokeDash = (seg.percent / 100) * donutCircumference;
                    const strokeGap = donutCircumference - strokeDash;
                    const strokeOffset = -(accumulatedPercent / 100) * donutCircumference;
                    accumulatedPercent += seg.percent;

                    const isHighlighted = hoveredSlice === seg.id;

                    return (
                      <circle
                        key={seg.id}
                        cx="100"
                        cy="100"
                        r={donutRadius}
                        fill="none"
                        stroke={seg.color}
                        strokeWidth={isHighlighted ? '28' : '24'}
                        strokeDasharray={`${strokeDash} ${strokeGap}`}
                        strokeDashoffset={strokeOffset}
                        className="transition-all duration-300 cursor-pointer"
                        onMouseEnter={() => setHoveredSlice(seg.id)}
                        onMouseLeave={() => setHoveredSlice(null)}
                      />
                    );
                  });
                })()}
              </svg>

              {/* Donut Center Label */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider">
                  {donutMode === 'revenue' ? 'Total MRR' : donutMode === 'tenants' ? 'Tenants' : 'Users'}
                </span>
                <span className="text-base sm:text-lg font-black text-stone-900">
                  {donutMode === 'revenue'
                    ? `Rp 54.2M`
                    : donutMode === 'tenants'
                    ? `${subscriptions.length} Org`
                    : `${users.length} User`}
                </span>
                <span className="text-[9px] text-emerald-600 font-bold">100% Tercakup</span>
              </div>
            </div>

            {/* Interactive Legend List */}
            <div className="space-y-1.5 pt-1 text-xs">
              {donutSegments.map((seg) => {
                const isHovered = hoveredSlice === seg.id;
                return (
                  <div
                    key={seg.id}
                    onMouseEnter={() => setHoveredSlice(seg.id)}
                    onMouseLeave={() => setHoveredSlice(null)}
                    className={`flex items-center justify-between p-2 rounded-xl transition-all cursor-pointer ${
                      isHovered ? 'bg-stone-100 ring-1 ring-stone-300 font-bold' : 'hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full shrink-0"
                        style={{ backgroundColor: seg.color }}
                      />
                      <span className="font-bold text-stone-800 text-[11px]">{seg.label}</span>
                    </div>
                    <div className="flex items-center gap-2 text-right">
                      <span className="font-mono text-stone-500 text-[10px]">{seg.formatted}</span>
                      <span className="font-black text-stone-900 text-xs w-11 text-right">
                        {seg.percent}%
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-stone-100">
            <Link
              to="/admin/superadmin/subscriptions"
              className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center justify-between hover:underline"
            >
              <span>Lihat Detail Semua Pelanggan</span>
              <ChevronRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------------- */}
      {/* CHART 2: Dynamic Bar Chart: Aliran Komoditas Kopi (Volume / GMV / Lots) */}
      {/* -------------------------------------------------------------------- */}
      <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <BarChart3 className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">
                Alur Fisik &amp; Nilai Komoditas Kopi per Tahapan Rantai Pasok (Bar Chart)
              </h3>
              <p className="text-[11px] text-stone-500">
                Pilih metrik dan klik bar untuk memeriksa detail operasional pilar tersebut
              </p>
            </div>
          </div>

          {/* Metric Selector Buttons */}
          <div className="flex items-center bg-stone-100 p-1 rounded-xl text-xs font-bold">
            <button
              type="button"
              onClick={() => setBarMetric('volume')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                barMetric === 'volume' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              ⚖️ Volume Fisik (Kg)
            </button>
            <button
              type="button"
              onClick={() => setBarMetric('gmv')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                barMetric === 'gmv' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              💰 Nilai Transaksi GMV (Rp)
            </button>
            <button
              type="button"
              onClick={() => setBarMetric('lots')}
              className={`px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                barMetric === 'lots' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
            >
              📑 Jumlah Lot Aktif
            </button>
          </div>
        </div>

        {/* Dynamic Column Bars */}
        <div className="grid grid-cols-5 gap-3 sm:gap-6 items-end pt-4 pb-2 px-2 sm:px-6">
          {barData.map((item) => {
            const rawVal =
              barMetric === 'volume'
                ? item.volumeKg
                : barMetric === 'gmv'
                ? item.gmvRp
                : item.lotsCount;

            const heightPercent = Math.max(15, Math.round((rawVal / (maxBarValue || 1)) * 100));
            const isSelected = (selectedPillarId || 'admin_kelompok_tani') === item.id;

            return (
              <div
                key={item.id}
                onClick={() => setSelectedPillarId(item.id)}
                className="flex flex-col items-center gap-2 group cursor-pointer"
              >
                {/* Numeric Tag over Bar */}
                <div
                  className={`text-[10px] sm:text-xs font-black transition-all ${
                    isSelected ? 'text-stone-900 scale-105' : 'text-stone-500 group-hover:text-stone-900'
                  }`}
                >
                  {barMetric === 'volume'
                    ? `${(item.volumeKg / 1000).toFixed(1)}T`
                    : barMetric === 'gmv'
                    ? `Rp ${(item.gmvRp / 1000000).toFixed(0)}M`
                    : `${item.lotsCount} Lot`}
                </div>

                {/* Vertical Bar Column */}
                <div className="w-full bg-stone-100 rounded-2xl h-44 sm:h-52 p-1.5 flex flex-col justify-end transition-all group-hover:bg-stone-200/80">
                  <div
                    className={`w-full rounded-xl transition-all duration-500 shadow-xs ${
                      isSelected
                        ? 'ring-4 ring-amber-500/30 scale-102'
                        : 'opacity-85 group-hover:opacity-100'
                    }`}
                    style={{
                      height: `${heightPercent}%`,
                      backgroundColor: item.color,
                    }}
                  />
                </div>

                {/* Pillar Label below bar */}
                <div className="text-center">
                  <div
                    className={`text-[11px] sm:text-xs font-bold leading-tight ${
                      isSelected ? 'text-amber-800 font-black' : 'text-stone-700'
                    }`}
                  >
                    {item.label}
                  </div>
                  <div className="text-[9px] text-stone-400 mt-0.5 line-clamp-1">{item.stage}</div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Selected Pillar Callout Detail Card */}
        <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200 flex flex-wrap items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 flex items-center justify-center font-black text-sm">
              ✓
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-amber-900 block">
                Detail Pillar Terpilih:
              </span>
              <h4 className="font-black text-sm text-stone-900">
                {activePillarDetail.label} — {activePillarDetail.stage}
              </h4>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <div>
              <span className="text-[10px] text-stone-500 block">Volume Komoditas:</span>
              <strong className="text-stone-900 font-black">
                {activePillarDetail.volumeKg.toLocaleString('id-ID')} Kg ({(activePillarDetail.volumeKg / 1000).toFixed(1)} Ton)
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-stone-500 block">Nilai Transaksi (GMV):</span>
              <strong className="text-emerald-800 font-black">
                Rp {activePillarDetail.gmvRp.toLocaleString('id-ID')}
              </strong>
            </div>

            <div>
              <span className="text-[10px] text-stone-500 block">Lot Terverifikasi:</span>
              <strong className="text-stone-900 font-black">{activePillarDetail.lotsCount} Lot Aktif</strong>
            </div>

            <Link
              to={`/admin/superadmin/services/${activePillarDetail.id === 'pengolah' ? 'admin_kelompok_tani' : activePillarDetail.id}`}
              className="py-2 px-3.5 rounded-xl bg-stone-900 hover:bg-black text-white font-bold text-xs flex items-center gap-1.5 transition-colors"
            >
              <span>Ubah Kuota &amp; Modul</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        </div>
      </div>

      {/* 3. Pilar Rantai Pasok (5 Service Clusters Overview) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-base sm:text-lg font-black text-stone-900 tracking-tight">
              Status 5 Pilar Layanan Rantai Pasok (Service Control)
            </h2>
            <p className="text-xs text-stone-500">
              Pantau jumlah pengguna, kuota seat per organisasi, dan pengaturan masing-masing service
            </p>
          </div>
          <Link
            to="/admin/superadmin/services/admin_kelompok_tani"
            className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
          >
            <span>Buka Konfigurasi Lengkap</span>
            <ChevronRight className="w-4 h-4" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5">
          {pillars.map((p) => {
            const Icon = p.icon;
            return (
              <div
                key={p.id}
                className={`p-4 rounded-3xl border flex flex-col justify-between transition-all hover:shadow-md ${p.bgCard}`}
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <div className="p-2.5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs">
                      <Icon className="w-5 h-5 text-stone-900" />
                    </div>
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      🟢 {p.status === 'active' ? 'Aktif' : p.status}
                    </span>
                  </div>

                  <h3 className="font-black text-xs text-stone-900 leading-tight">{p.name}</h3>
                  <p className="text-[10px] text-stone-500 mt-0.5 line-clamp-1">{p.subtitle}</p>

                  <div className="my-3 pt-2 border-t border-stone-200/60 space-y-1.5 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">User Terdaftar:</span>
                      <strong className="text-stone-900 font-black">{p.usersCount} Akun</strong>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">Batas/Organisasi:</span>
                      <span className="text-stone-700 font-bold">max {p.maxUsersPerOrg}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] text-stone-500">{p.metricKey}:</span>
                      <span className="text-amber-900 font-bold text-[10px]">{p.metricVal}</span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/admin/superadmin/services/${p.id}`}
                  className="w-full mt-2 py-2 px-3 rounded-xl bg-white hover:bg-stone-50 border border-stone-200 text-stone-800 font-bold text-[11px] flex items-center justify-center gap-1.5 transition-colors shadow-2xs"
                >
                  <Settings className="w-3.5 h-3.5 text-stone-500" />
                  <span>Setting Service</span>
                  <ArrowRight className="w-3 h-3 text-stone-400 ml-auto" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. Bottom Section: Subscriptions Table Preview & Telemetry Highlights */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column (2 cols): Pelanggan Berlangganan Terbaru */}
        <div className="lg:col-span-2 bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden flex flex-col justify-between">
          <div>
            <div className="p-5 border-b border-stone-100 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <CreditCard className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Pelanggan Berlangganan Aktif (Tenant Subscriptions)
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Daftar organisasi dengan status langganan dan siklus billing
                  </p>
                </div>
              </div>

              <Link
                to="/admin/superadmin/subscriptions"
                className="text-xs font-bold text-amber-700 hover:text-amber-800 flex items-center gap-1 hover:underline"
              >
                <span>Lihat Semua Pelanggan ({subscriptions.length})</span>
                <ChevronRight className="w-4 h-4" />
              </Link>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                  <tr>
                    <th className="py-3 px-4">Organisasi Pelanggan</th>
                    <th className="py-3 px-4">Paket SaaS</th>
                    <th className="py-3 px-4">Tagihan</th>
                    <th className="py-3 px-4">Alokasi Seat</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {subscriptions.slice(0, 5).map((sub) => (
                    <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 leading-tight">
                          {sub.organizationName}
                        </div>
                        <div className="text-[10px] text-stone-500">{sub.picName}</div>
                      </td>
                      <td className="py-3 px-4 font-medium text-stone-800">
                        {sub.packageName}
                      </td>
                      <td className="py-3 px-4 font-bold text-stone-900">
                        Rp {sub.pricePerCycle.toLocaleString('id-ID')}
                        <span className="text-[10px] text-stone-400 font-normal block capitalize">
                          {sub.billingCycle}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span className="px-2 py-0.5 rounded bg-stone-100 font-mono text-[11px] font-bold text-stone-800">
                          {sub.userSeatsUsed}/{sub.userSeatsLimit} seats
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                            sub.status === 'active'
                              ? 'bg-emerald-100 text-emerald-800'
                              : sub.status === 'trial'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}
                        >
                          {sub.status === 'active'
                            ? '🟢 Aktif'
                            : sub.status === 'trial'
                            ? '🟡 Trial'
                            : '🔴 Jatuh Tempo'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
            <span className="text-xs text-stone-500">
              Total Kontribusi MRR dari pelanggan aktif:{' '}
              <strong className="text-stone-900">Rp {totalMRR.toLocaleString('id-ID')}</strong>/bulan
            </span>
            <Link
              to="/admin/superadmin/subscriptions"
              className="px-3 py-1.5 rounded-lg bg-stone-900 hover:bg-black text-white font-bold text-xs transition-colors"
            >
              Kelola Billing &amp; Subscription →
            </Link>
          </div>
        </div>

        {/* Right Column: Telemetri Sirkularitas & Quick Actions */}
        <div className="space-y-6">
          {/* Box 1: Dampak Keberlanjutan */}
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm space-y-4">
            <div className="flex items-center gap-2.5 pb-2 border-b border-stone-100">
              <div className="w-8 h-8 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                <TreePine className="w-4 h-4" />
              </div>
              <div>
                <h3 className="font-black text-xs text-stone-900 uppercase tracking-wider">
                  Dampak Lingkungan &amp; EUDR
                </h3>
                <span className="text-[10px] text-stone-400">Zero Deforestation Compliance</span>
              </div>
            </div>

            <div className="space-y-2.5 text-xs">
              <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
                <span className="font-bold">Kepatuhan EUDR:</span>
                <span className="font-black text-base text-emerald-800">
                  {telemetry.eudrComplianceRatePercent}%
                </span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Lahan Terpetakan:</span>
                <span className="font-bold text-stone-900">{telemetry.totalGeofencedHectares} Ha</span>
              </div>

              <div className="flex items-center justify-between py-1 border-b border-stone-100">
                <span className="text-stone-500">Limbah Sirkular:</span>
                <span className="font-bold text-purple-700">
                  {(telemetry.totalCircularWasteDivertedKg / 1000).toFixed(1)} Ton Terolah
                </span>
              </div>

              <div className="flex items-center justify-between py-1">
                <span className="text-stone-500">Skor Sirkularitas:</span>
                <span className="font-bold text-stone-900">
                  {telemetry.circularityScoreAverage} / 100 (Grade A)
                </span>
              </div>
            </div>

            <Link
              to="/admin/superadmin/telemetry"
              className="w-full py-2 px-3 rounded-xl bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border border-cyan-200 font-bold text-xs flex items-center justify-center gap-1.5 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Buka Dasbor Telemetri Lengkap</span>
            </Link>
          </div>

          {/* Box 2: Quick Links Console Super Admin */}
          <div className="bg-[#1C120C] text-white p-5 rounded-3xl border border-amber-900/30 shadow-md space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
              <Sparkles className="w-4 h-4" />
              <span>Akses Cepat Platform Owner</span>
            </div>

            <div className="space-y-1.5">
              <Link
                to="/admin/superadmin/packages"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
              >
                <span>📦 Buat / Ubah Paket SaaS Baru</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                to="/admin/transaksi"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
              >
                <span>📑 Rekap Buku Transaksi Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>

              <Link
                to="/admin/users"
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-xs font-bold transition-colors"
              >
                <span>👥 Master Kelola Semua Pengguna ({users.length})</span>
                <ArrowRight className="w-3.5 h-3.5 text-stone-400" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
