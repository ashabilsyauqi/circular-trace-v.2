import React, { useState, useEffect, useMemo } from 'react';
import {
  Package,
  Plus,
  Search,
  Filter,
  Check,
  X,
  Sparkles,
  Edit2,
  Trash2,
  Archive,
  RefreshCw,
  TrendingUp,
  Building2,
  Layers,
  Flame,
  Warehouse,
  Coffee,
  ShieldCheck,
  Zap,
  Globe,
  Sliders,
  AlertCircle,
  CheckCircle2,
  Eye,
  Tag,
  QrCode,
  MapPin,
  Bot,
  ShoppingCart,
  Lock,
  ArrowRight,
  RotateCcw,
  SlidersHorizontal,
  LayoutGrid,
  Table as TableIcon,
} from 'lucide-react';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  ServicePackage,
  PackageTargetRole,
  PackageStatus,
  PackageFeatureFlags,
} from '../../../types/coffee';
import { cctApi } from '../../../services/api';
import { INITIAL_SERVICE_PACKAGES } from '../../../data/mockData';

const TARGET_ROLE_OPTIONS: { value: PackageTargetRole; label: string; icon: React.ReactNode; color: string }[] = [
  { value: 'all', label: 'Semua / Konsorsium Enterprise', icon: <Globe className="w-3.5 h-3.5 text-amber-600" />, color: 'bg-amber-100 text-amber-950 border-amber-300' },
  { value: 'admin_kelompok_tani', label: 'Kelompok Tani & Gapoktan', icon: <Building2 className="w-3.5 h-3.5 text-amber-600" />, color: 'bg-amber-100 text-amber-900 border-amber-300' },
  { value: 'roaster', label: 'Roastery & Coffee Lab', icon: <Flame className="w-3.5 h-3.5 text-orange-600" />, color: 'bg-orange-100 text-orange-900 border-orange-300' },
  { value: 'gudang', label: 'Gudang Hermetik & QA', icon: <Warehouse className="w-3.5 h-3.5 text-blue-600" />, color: 'bg-blue-100 text-blue-900 border-blue-300' },
  { value: 'cafe', label: 'Specialty Cafe & Brew Bar', icon: <Coffee className="w-3.5 h-3.5 text-stone-600" />, color: 'bg-stone-200 text-stone-900 border-stone-300' },
];

export const PlatformPackagesPage: React.FC = () => {
  const { currentUser } = useCoffee();

  // State: packages data
  const [packages, setPackages] = useState<ServicePackage[]>(() => {
    const saved = localStorage.getItem('cct_service_packages');
    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      } catch (_) {}
    }
    return INITIAL_SERVICE_PACKAGES;
  });

  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // Filter & Search Controls
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('all_filter');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly');
  const [viewMode, setViewMode] = useState<'grid' | 'table'>('grid');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPackage, setEditingPackage] = useState<ServicePackage | null>(null);

  // Form Fields
  const [formId, setFormId] = useState('');
  const [formName, setFormName] = useState('');
  const [formTargetRole, setFormTargetRole] = useState<PackageTargetRole>('admin_kelompok_tani');
  const [formPriceMonthly, setFormPriceMonthly] = useState<number>(299000);
  const [formPriceYearly, setFormPriceYearly] = useState<number>(2990000);
  const [formDiscountPercent, setFormDiscountPercent] = useState<number>(17);
  const [formIsPopular, setFormIsPopular] = useState<boolean>(false);
  const [formStatus, setFormStatus] = useState<PackageStatus>('active');

  // Form Feature Flags
  const [formQuotaLots, setFormQuotaLots] = useState<string>('Unlimited');
  const [formIsLotsUnlimited, setFormIsLotsUnlimited] = useState<boolean>(true);
  const [formQuotaQrBarcodes, setFormQuotaQrBarcodes] = useState<string>('Unlimited');
  const [formIsQrUnlimited, setFormIsQrUnlimited] = useState<boolean>(true);
  const [formEudrPolygon, setFormEudrPolygon] = useState<boolean>(true);
  const [formAiCuppingRadar, setFormAiCuppingRadar] = useState<boolean>(true);
  const [formMarketplaceAccess, setFormMarketplaceAccess] = useState<boolean>(true);
  const [formWarehouseHermeticQa, setFormWarehouseHermeticQa] = useState<boolean>(false);
  const [formApiIntegration, setFormApiIntegration] = useState<boolean>(false);
  const [formCustomBrandingLogo, setFormCustomBrandingLogo] = useState<boolean>(true);
  const [formDedicatedSupport, setFormDedicatedSupport] = useState<boolean>(false);

  // Delete Confirm Modal
  const [deleteCandidate, setDeleteCandidate] = useState<ServicePackage | null>(null);

  // Helper to persist in localStorage
  const persistPackages = (newPackages: ServicePackage[]) => {
    setPackages(newPackages);
    localStorage.setItem('cct_service_packages', JSON.stringify(newPackages));
  };

  // Fetch from API
  const fetchPackages = async (silent: boolean = false) => {
    if (!silent) setLoading(true);
    setRefreshing(true);
    try {
      const res = await cctApi.packages.getAll();
      if (res.success && Array.isArray(res.data) && res.data.length > 0) {
        persistPackages(res.data);
      }
    } catch (err) {
      console.warn('Could not fetch packages from API, using cached state', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchPackages(true);
  }, []);

  // Filtered packages
  const filteredPackages = useMemo(() => {
    return packages.filter((pkg) => {
      // Search by name or ID
      const matchesSearch =
        pkg.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        pkg.id.toLowerCase().includes(searchQuery.toLowerCase());

      // Filter by role
      const matchesRole =
        selectedRole === 'all_filter'
          ? true
          : selectedRole === 'all'
          ? pkg.targetRole === 'all'
          : pkg.targetRole === selectedRole || pkg.targetRole === 'all';

      // Filter by status
      const matchesStatus =
        selectedStatus === 'all' ? true : pkg.status === selectedStatus;

      return matchesSearch && matchesRole && matchesStatus;
    });
  }, [packages, searchQuery, selectedRole, selectedStatus]);

  // Financial & Subscription Analytics
  const stats = useMemo(() => {
    const total = packages.length;
    const active = packages.filter((p) => p.status === 'active').length;
    const archived = packages.filter((p) => p.status === 'archived').length;
    const popularCount = packages.filter((p) => p.isPopular).length;

    // Projected Monthly Recurring Revenue based on mock subscribers count
    const totalSubscribers = packages.reduce((acc, p) => acc + (p.subscribersCount || 10), 0);
    const estimatedMrr = packages.reduce(
      (acc, p) => acc + (p.status === 'active' ? (p.subscribersCount || 10) * p.priceMonthly : 0),
      0
    );
    const estimatedArr = estimatedMrr * 12;

    return {
      total,
      active,
      archived,
      popularCount,
      totalSubscribers,
      estimatedMrr,
      estimatedArr,
    };
  }, [packages]);

  // Open modal for Create
  const handleOpenCreateModal = () => {
    setEditingPackage(null);
    setFormId('');
    setFormName('');
    setFormTargetRole('admin_kelompok_tani');
    setFormPriceMonthly(350000);
    setFormPriceYearly(3500000);
    setFormDiscountPercent(17);
    setFormIsPopular(false);
    setFormStatus('active');

    setFormQuotaLots('100 Lot / Bulan');
    setFormIsLotsUnlimited(false);
    setFormQuotaQrBarcodes('1.000 QR / Bulan');
    setFormIsQrUnlimited(false);
    setFormEudrPolygon(true);
    setFormAiCuppingRadar(true);
    setFormMarketplaceAccess(true);
    setFormWarehouseHermeticQa(false);
    setFormApiIntegration(false);
    setFormCustomBrandingLogo(true);
    setFormDedicatedSupport(false);

    setIsModalOpen(true);
  };

  // Open modal for Edit
  const handleOpenEditModal = (pkg: ServicePackage) => {
    setEditingPackage(pkg);
    setFormId(pkg.id);
    setFormName(pkg.name);
    setFormTargetRole(pkg.targetRole || pkg.target_role || 'all');
    setFormPriceMonthly(pkg.priceMonthly ?? pkg.price_monthly ?? 0);
    setFormPriceYearly(pkg.priceYearly ?? pkg.price_yearly ?? 0);
    setFormDiscountPercent(pkg.discountPercent ?? pkg.discount_percent ?? 0);
    setFormIsPopular(!!(pkg.isPopular ?? pkg.is_popular));
    setFormStatus(pkg.status || 'active');

    const feat = pkg.featuresJson || pkg.features_json || {};
    const lotsVal = feat.quotaLots !== undefined ? String(feat.quotaLots) : 'Unlimited';
    setFormQuotaLots(lotsVal);
    setFormIsLotsUnlimited(lotsVal.toLowerCase().includes('unlimited'));

    const qrVal = feat.quotaQrBarcodes !== undefined ? String(feat.quotaQrBarcodes) : 'Unlimited';
    setFormQuotaQrBarcodes(qrVal);
    setFormIsQrUnlimited(qrVal.toLowerCase().includes('unlimited'));

    setFormEudrPolygon(!!feat.eudrPolygon);
    setFormAiCuppingRadar(!!feat.aiCuppingRadar);
    setFormMarketplaceAccess(feat.marketplaceAccess !== false);
    setFormWarehouseHermeticQa(!!feat.warehouseHermeticQa);
    setFormApiIntegration(!!feat.apiIntegration);
    setFormCustomBrandingLogo(!!feat.customBrandingLogo);
    setFormDedicatedSupport(!!feat.dedicatedSupport);

    setIsModalOpen(true);
  };

  // Auto calculate yearly discount percentage
  const handleCalculateDiscount = () => {
    if (formPriceMonthly > 0 && formPriceYearly > 0) {
      const full12 = formPriceMonthly * 12;
      if (full12 > formPriceYearly) {
        const disc = Math.round(((full12 - formPriceYearly) / full12) * 100);
        setFormDiscountPercent(disc);
      }
    }
  };

  // Save Package (Create or Update)
  const handleSavePackage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName.trim()) {
      setFeedbackMessage({ type: 'error', text: 'Nama paket wajib diisi' });
      return;
    }

    const targetId = formId.trim() || `PKG-${formTargetRole.toUpperCase().replace('ADMIN_', '')}-${Date.now().toString().slice(-4)}`;

    const featureFlagsPayload: PackageFeatureFlags = {
      quotaLots: formIsLotsUnlimited ? 'Unlimited (Tanpa Batas)' : formQuotaLots,
      quotaQrBarcodes: formIsQrUnlimited ? 'Unlimited' : formQuotaQrBarcodes,
      eudrPolygon: formEudrPolygon,
      aiCuppingRadar: formAiCuppingRadar,
      marketplaceAccess: formMarketplaceAccess,
      warehouseHermeticQa: formWarehouseHermeticQa,
      apiIntegration: formApiIntegration,
      customBrandingLogo: formCustomBrandingLogo,
      dedicatedSupport: formDedicatedSupport,
    };

    const packagePayload: ServicePackage = {
      id: targetId,
      name: formName.trim(),
      targetRole: formTargetRole,
      target_role: formTargetRole,
      priceMonthly: Number(formPriceMonthly),
      price_monthly: Number(formPriceMonthly),
      priceYearly: Number(formPriceYearly),
      price_yearly: Number(formPriceYearly),
      discountPercent: Number(formDiscountPercent),
      discount_percent: Number(formDiscountPercent),
      featuresJson: featureFlagsPayload,
      features_json: featureFlagsPayload,
      isPopular: formIsPopular,
      is_popular: formIsPopular,
      status: formStatus,
      subscribersCount: editingPackage ? editingPackage.subscribersCount : 1,
      createdAt: editingPackage?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    try {
      // API call
      const res = await cctApi.packages.save(packagePayload);
      if (res.success && res.data?.package) {
        const saved = res.data.package;
        const exists = packages.some((p) => p.id === saved.id);
        const updatedList = exists
          ? packages.map((p) => (p.id === saved.id ? saved : p))
          : [saved, ...packages];
        persistPackages(updatedList);
      } else {
        // Fallback local update
        const exists = packages.some((p) => p.id === targetId);
        const updatedList = exists
          ? packages.map((p) => (p.id === targetId ? packagePayload : p))
          : [packagePayload, ...packages];
        persistPackages(updatedList);
      }

      setFeedbackMessage({
        type: 'success',
        text: `Paket "${packagePayload.name}" berhasil ${editingPackage ? 'diperbarui' : 'dibuat'}!`,
      });
      setIsModalOpen(false);
    } catch (err) {
      console.error('Failed to save package', err);
      // Fallback
      const exists = packages.some((p) => p.id === targetId);
      const updatedList = exists
        ? packages.map((p) => (p.id === targetId ? packagePayload : p))
        : [packagePayload, ...packages];
      persistPackages(updatedList);

      setFeedbackMessage({
        type: 'success',
        text: `Paket "${packagePayload.name}" berhasil disimpan ke sistem offline.`,
      });
      setIsModalOpen(false);
    }
  };

  // Quick toggle status active/archived
  const handleToggleStatus = async (pkg: ServicePackage) => {
    const nextStatus: PackageStatus = pkg.status === 'active' ? 'archived' : 'active';
    const updated = { ...pkg, status: nextStatus, updatedAt: new Date().toISOString() };

    const updatedList = packages.map((p) => (p.id === pkg.id ? updated : p));
    persistPackages(updatedList);

    try {
      await cctApi.packages.update({ id: pkg.id, status: nextStatus });
    } catch (e) {
      console.warn('API sync failed', e);
    }

    setFeedbackMessage({
      type: 'success',
      text: `Status paket "${pkg.name}" diubah menjadi ${nextStatus === 'active' ? 'Aktif' : 'Diarsipkan'}.`,
    });
  };

  // Quick toggle isPopular
  const handleTogglePopular = async (pkg: ServicePackage) => {
    const nextPopular = !pkg.isPopular;
    const updated = { ...pkg, isPopular: nextPopular, is_popular: nextPopular, updatedAt: new Date().toISOString() };

    const updatedList = packages.map((p) => (p.id === pkg.id ? updated : p));
    persistPackages(updatedList);

    try {
      await cctApi.packages.update({ id: pkg.id, isPopular: nextPopular });
    } catch (e) {
      console.warn('API sync failed', e);
    }
  };

  // Delete Package
  const handleConfirmDelete = async () => {
    if (!deleteCandidate) return;
    const target = deleteCandidate;
    setDeleteCandidate(null);

    const updatedList = packages.filter((p) => p.id !== target.id);
    persistPackages(updatedList);

    try {
      await cctApi.packages.delete(target.id, true);
    } catch (e) {
      console.warn('API delete failed', e);
    }

    setFeedbackMessage({
      type: 'success',
      text: `Paket "${target.name}" (${target.id}) berhasil dihapus permanen.`,
    });
  };

  // Format IDR Currency
  const formatIdr = (val: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0,
    }).format(val);
  };

  const getRoleBadge = (role: PackageTargetRole) => {
    const found = TARGET_ROLE_OPTIONS.find((o) => o.value === role);
    if (!found) {
      return (
        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-stone-100 text-stone-800 border border-stone-300">
          <Globe className="w-3 h-3 text-stone-500" />
          <span>{role}</span>
        </span>
      );
    }
    return (
      <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold border ${found.color}`}>
        {found.icon}
        <span>{found.label}</span>
      </span>
    );
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header & Title Banner */}
      <div className="bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950/90 rounded-2xl p-6 text-white shadow-xl border border-amber-900/30 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none -mr-20 -mt-20" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-400/30">
              <Sparkles className="w-3.5 h-3.5 text-amber-400" />
              <span>Super Admin / Platform Admin CircularTrace</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white flex items-center gap-2.5">
              <span>Katalog &amp; Konfigurasi Paket Layanan SaaS</span>
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500 text-stone-950 font-extrabold uppercase">
                Paket 2
              </span>
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Kelola penawaran komersial SaaS CircularTrace untuk 4 pilar rantai pasok (Kelompok Tani, Roastery, Gudang, Cafe) dan paket Konsorsium Enterprise.
            </p>
          </div>

          <div className="flex items-center gap-2.5 shrink-0">
            <button
              type="button"
              onClick={() => fetchPackages(false)}
              disabled={refreshing}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-bold border border-white/15 transition-all flex items-center gap-2 cursor-pointer shadow-xs disabled:opacity-60"
              title="Segarkan data dari server"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${refreshing ? 'animate-spin' : ''}`} />
              <span className="hidden sm:inline">Segarkan</span>
            </button>

            <button
              type="button"
              onClick={handleOpenCreateModal}
              className="px-4 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black transition-all flex items-center gap-2 shadow-md hover:shadow-lg shadow-amber-950/30 cursor-pointer transform hover:-translate-y-0.5"
            >
              <Plus className="w-4 h-4" />
              <span>Buat Paket Baru</span>
            </button>
          </div>
        </div>
      </div>

      {/* Feedback Toast Banner */}
      {feedbackMessage && (
        <div
          className={`p-4 rounded-xl text-xs font-medium flex items-center justify-between shadow-xs border animate-in fade-in duration-200 ${
            feedbackMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-900 border-emerald-300'
              : 'bg-rose-50 text-rose-900 border-rose-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {feedbackMessage.type === 'success' ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            )}
            <span>{feedbackMessage.text}</span>
          </div>
          <button
            type="button"
            onClick={() => setFeedbackMessage(null)}
            className="text-stone-500 hover:text-stone-800 cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* 2. Top Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <Package className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500">Total Paket SaaS</div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {stats.total}{' '}
              <span className="text-xs font-medium text-emerald-600 font-sans">
                ({stats.active} Aktif)
              </span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">
              {stats.archived} diarsipkan
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-amber-100 text-amber-700 flex items-center justify-center shrink-0">
            <Sparkles className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500">Paket Unggulan</div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {stats.popularCount}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">
              Berlabel "Paling Populer"
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500">Proyeksi MRR</div>
            <div className="text-base sm:text-lg font-black text-emerald-700 mt-0.5 truncate">
              {formatIdr(stats.estimatedMrr)}
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5 truncate">
              ARR: {formatIdr(stats.estimatedArr)}
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex items-center gap-3.5">
          <div className="w-11 h-11 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center shrink-0">
            <Building2 className="w-5 h-5" />
          </div>
          <div>
            <div className="text-[11px] font-semibold text-stone-500">Total Pelanggan</div>
            <div className="text-xl sm:text-2xl font-black text-stone-900 mt-0.5">
              {stats.totalSubscribers}{' '}
              <span className="text-xs font-normal text-stone-500">Organisasi</span>
            </div>
            <div className="text-[10px] text-stone-400 mt-0.5">
              Di 5 klaster rantai pasok
            </div>
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Mode Toggle */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs space-y-3">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          {/* Search Box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari nama paket atau ID (e.g. GAPOKTAN, PRO)..."
              className="w-full text-xs bg-stone-50 border border-stone-300 rounded-xl pl-9 pr-3 py-2 text-stone-900 placeholder-stone-400 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Billing Cycle Preview Switch */}
            <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200 text-xs">
              <button
                type="button"
                onClick={() => setBillingCycle('monthly')}
                className={`px-3 py-1 rounded-lg font-bold transition-all cursor-pointer ${
                  billingCycle === 'monthly'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Bulanan
              </button>
              <button
                type="button"
                onClick={() => setBillingCycle('yearly')}
                className={`px-3 py-1 rounded-lg font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                  billingCycle === 'yearly'
                    ? 'bg-stone-900 text-amber-300 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <span>Tahunan</span>
                <span className="text-[10px] px-1 py-0.2 rounded bg-amber-400 text-stone-950 font-black">
                  Hemat 17%
                </span>
              </button>
            </div>

            {/* View Mode Grid/Table */}
            <div className="inline-flex items-center p-1 rounded-xl bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => setViewMode('grid')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'grid'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Tampilan Kartu"
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setViewMode('table')}
                className={`p-1.5 rounded-lg transition-all cursor-pointer ${
                  viewMode === 'table'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-500 hover:text-stone-900'
                }`}
                title="Tampilan Tabel"
              >
                <TableIcon className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Stakeholder Category Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 pt-2 border-t border-stone-100 text-xs">
          <span className="text-stone-400 text-[11px] font-bold mr-1 flex items-center gap-1">
            <Filter className="w-3 h-3" /> Filter:
          </span>
          <button
            type="button"
            onClick={() => setSelectedRole('all_filter')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer ${
              selectedRole === 'all_filter'
                ? 'bg-stone-900 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            Semua Target
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('admin_kelompok_tani')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedRole === 'admin_kelompok_tani'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Building2 className="w-3 h-3" />
            <span>Kelompok Tani</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('roaster')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedRole === 'roaster'
                ? 'bg-orange-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Flame className="w-3 h-3" />
            <span>Roastery</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('gudang')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedRole === 'gudang'
                ? 'bg-blue-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Warehouse className="w-3 h-3" />
            <span>Gudang</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('cafe')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedRole === 'cafe'
                ? 'bg-stone-700 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Coffee className="w-3 h-3" />
            <span>Cafe</span>
          </button>
          <button
            type="button"
            onClick={() => setSelectedRole('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-colors cursor-pointer flex items-center gap-1 ${
              selectedRole === 'all'
                ? 'bg-amber-600 text-white'
                : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
            }`}
          >
            <Globe className="w-3 h-3" />
            <span>Enterprise All</span>
          </button>

          <div className="ml-auto flex items-center gap-1.5">
            <span className="text-[11px] text-stone-400">Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="text-xs bg-stone-100 border border-stone-200 rounded-lg px-2 py-1 text-stone-700 focus:outline-none"
            >
              <option value="all">Semua Status</option>
              <option value="active">Aktif Saja</option>
              <option value="archived">Diarsipkan</option>
            </select>
          </div>
        </div>
      </div>

      {/* 4. Content: Grid or Table View */}
      {filteredPackages.length === 0 ? (
        <div className="bg-white rounded-2xl border border-stone-200 p-12 text-center space-y-3">
          <div className="w-14 h-14 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <Package className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-stone-800">
            Tidak ada paket yang sesuai dengan filter
          </h3>
          <p className="text-xs text-stone-500 max-w-md mx-auto">
            Coba ubah kata kunci pencarian atau reset filter target stakeholder untuk melihat daftar paket lainnya.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery('');
              setSelectedRole('all_filter');
              setSelectedStatus('all');
            }}
            className="px-4 py-2 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1.5"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset Filter</span>
          </button>
        </div>
      ) : viewMode === 'grid' ? (
        /* GRID CARDS VIEW */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPackages.map((pkg) => {
            const isYearly = billingCycle === 'yearly';
            const price = isYearly ? pkg.priceYearly : pkg.priceMonthly;
            const effectiveMonthly = isYearly ? Math.round(pkg.priceYearly / 12) : pkg.priceMonthly;
            const feat = pkg.featuresJson || pkg.features_json || {};

            return (
              <div
                key={pkg.id}
                className={`bg-white rounded-2xl border transition-all duration-200 flex flex-col justify-between overflow-hidden relative shadow-xs hover:shadow-md ${
                  pkg.isPopular
                    ? 'border-amber-400 ring-2 ring-amber-400/20'
                    : 'border-stone-200'
                } ${pkg.status === 'archived' ? 'opacity-70 bg-stone-50/60' : ''}`}
              >
                {/* Popular Glow Header Pill */}
                {pkg.isPopular && (
                  <div className="bg-gradient-to-r from-amber-600 via-amber-500 to-amber-600 text-stone-950 text-[10.5px] font-black uppercase tracking-wider py-1 text-center shadow-xs flex items-center justify-center gap-1.5">
                    <Sparkles className="w-3 h-3 text-stone-950" />
                    <span>Paling Diminati &bull; Recommended</span>
                  </div>
                )}

                <div className="p-5 sm:p-6 space-y-4 flex-1">
                  {/* Top Meta: Role Badge + Status Switch */}
                  <div className="flex items-center justify-between gap-2">
                    {getRoleBadge(pkg.targetRole || pkg.target_role || 'all')}

                    <div className="flex items-center gap-1.5">
                      <button
                        type="button"
                        onClick={() => handleTogglePopular(pkg)}
                        className={`p-1 rounded-md transition-colors cursor-pointer text-xs ${
                          pkg.isPopular
                            ? 'text-amber-500 hover:text-amber-600'
                            : 'text-stone-300 hover:text-stone-500'
                        }`}
                        title={pkg.isPopular ? 'Batalkan status Populer' : 'Tandai sebagai Populer'}
                      >
                        <Sparkles className="w-4 h-4 fill-current" />
                      </button>

                      <button
                        type="button"
                        onClick={() => handleToggleStatus(pkg)}
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                          pkg.status === 'active'
                            ? 'bg-emerald-50 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
                            : 'bg-stone-200 text-stone-700 border-stone-300 hover:bg-stone-300'
                        }`}
                        title="Klik untuk mengubah status aktif/arsip"
                      >
                        {pkg.status === 'active' ? '● Aktif' : '○ Arsip'}
                      </button>
                    </div>
                  </div>

                  {/* Package Name & Code */}
                  <div>
                    <span className="font-mono text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                      {pkg.id}
                    </span>
                    <h2 className="text-lg font-black text-stone-900 tracking-tight leading-snug mt-0.5">
                      {pkg.name}
                    </h2>
                  </div>

                  {/* Pricing Box */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200/80 space-y-1">
                    <div className="flex items-baseline gap-1.5">
                      <span className="text-2xl font-black text-stone-900">
                        {formatIdr(price)}
                      </span>
                      <span className="text-xs font-semibold text-stone-500">
                        / {isYearly ? 'tahun' : 'bulan'}
                      </span>
                    </div>

                    {isYearly && pkg.discountPercent > 0 && (
                      <div className="flex items-center justify-between text-[11px] pt-1 border-t border-stone-200/60">
                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                          <Check className="w-3 h-3" /> Hemat {pkg.discountPercent}%
                        </span>
                        <span className="text-stone-500 font-medium">
                          Setara {formatIdr(effectiveMonthly)}/bln
                        </span>
                      </div>
                    )}

                    <div className="text-[10.5px] text-stone-400 pt-0.5 flex items-center justify-between">
                      <span>Terdaftar: {pkg.subscribersCount || 10} organisasi</span>
                      <span className="text-stone-500 font-semibold">SaaS Lisensi</span>
                    </div>
                  </div>

                  {/* Feature Checklist Matrix */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
                    <div className="text-[11px] font-bold text-stone-800 uppercase tracking-wider flex items-center justify-between">
                      <span>Matriks Fitur &amp; Kuota</span>
                    </div>

                    <ul className="space-y-2 text-stone-700">
                      {/* Kuota Lot */}
                      <li className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900">Kuota Lot Panen/Batch: </span>
                          <span className="text-stone-600">{feat.quotaLots || 'Unlimited'}</span>
                        </div>
                      </li>

                      {/* Kuota Barcode QR */}
                      <li className="flex items-start gap-2 text-xs">
                        <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                        <div>
                          <span className="font-bold text-stone-900">Cetak QR Traceability: </span>
                          <span className="text-stone-600">{feat.quotaQrBarcodes || 'Unlimited'}</span>
                        </div>
                      </li>

                      {/* EUDR Polygon */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.eudrPolygon ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.eudrPolygon ? 'text-stone-800' : 'text-stone-400 line-through'}>
                          Peta Poligon Lahan EUDR &amp; GPS Patok
                        </span>
                      </li>

                      {/* AI Cupping SCA */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.aiCuppingRadar ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.aiCuppingRadar ? 'text-stone-800 font-semibold' : 'text-stone-400 line-through'}>
                          AI Spider Cupping Radar SCA &amp; Agtron
                        </span>
                      </li>

                      {/* B2B Marketplace */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.marketplaceAccess !== false ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.marketplaceAccess !== false ? 'text-stone-800' : 'text-stone-400 line-through'}>
                          Marketplace B2B &amp; Direct Trade Kopi
                        </span>
                      </li>

                      {/* Gudang Hermetik & QA */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.warehouseHermeticQa ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.warehouseHermeticQa ? 'text-stone-800' : 'text-stone-400 line-through'}>
                          Manajemen Gudang Hermetik &amp; Defect QA
                        </span>
                      </li>

                      {/* API Integrasi */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.apiIntegration ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.apiIntegration ? 'text-stone-900 font-bold' : 'text-stone-400 line-through'}>
                          Akses REST API &amp; Webhook Eksternal
                        </span>
                      </li>

                      {/* Custom Branding Logo */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.customBrandingLogo ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.customBrandingLogo ? 'text-stone-800' : 'text-stone-400 line-through'}>
                          Kustomisasi Logo &amp; Stempel Sertifikat
                        </span>
                      </li>

                      {/* Dedicated Support */}
                      <li className="flex items-center gap-2 text-xs">
                        {feat.dedicatedSupport ? (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                        ) : (
                          <X className="w-4 h-4 text-stone-300 shrink-0" />
                        )}
                        <span className={feat.dedicatedSupport ? 'text-stone-800 font-semibold' : 'text-stone-400 line-through'}>
                          Dedicated Support 24/7 SLA Priority
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                {/* Card Footer Actions */}
                <div className="px-5 py-3.5 bg-stone-50 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => handleOpenEditModal(pkg)}
                      className="px-3 py-1.5 rounded-lg bg-white hover:bg-stone-100 text-stone-800 text-xs font-bold border border-stone-300 transition-colors flex items-center gap-1.5 cursor-pointer shadow-2xs"
                    >
                      <Edit2 className="w-3.5 h-3.5 text-stone-600" />
                      <span>Ubah</span>
                    </button>

                    <button
                      type="button"
                      onClick={() => handleToggleStatus(pkg)}
                      className="px-2.5 py-1.5 rounded-lg text-stone-600 hover:text-stone-900 text-xs font-medium hover:bg-stone-200 transition-colors cursor-pointer"
                      title={pkg.status === 'active' ? 'Arsipkan paket' : 'Aktifkan paket'}
                    >
                      <Archive className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <button
                    type="button"
                    onClick={() => setDeleteCandidate(pkg)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                    title="Hapus paket permanen"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* TABLE VIEW */
        <div className="bg-white rounded-2xl border border-stone-200 shadow-xs overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-100/90 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider text-[10.5px]">
                <tr>
                  <th className="py-3 px-4">Paket ID &amp; Nama</th>
                  <th className="py-3 px-4">Target Stakeholder</th>
                  <th className="py-3 px-4">Harga Bulanan</th>
                  <th className="py-3 px-4">Harga Tahunan</th>
                  <th className="py-3 px-4">Diskon</th>
                  <th className="py-3 px-4">Fitur Inti</th>
                  <th className="py-3 px-4">Status</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredPackages.map((pkg) => {
                  const feat = pkg.featuresJson || pkg.features_json || {};
                  return (
                    <tr
                      key={pkg.id}
                      className={`hover:bg-stone-50/80 transition-colors ${
                        pkg.status === 'archived' ? 'bg-stone-50/50 text-stone-400' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-bold text-stone-900 flex items-center gap-2">
                          <span>{pkg.name}</span>
                          {pkg.isPopular && (
                            <span className="px-1.5 py-0.2 rounded-full bg-amber-100 text-amber-900 text-[9px] font-black border border-amber-300">
                              ⭐ Populer
                            </span>
                          )}
                        </div>
                        <span className="font-mono text-[10px] text-stone-400">{pkg.id}</span>
                      </td>

                      <td className="py-3 px-4">
                        {getRoleBadge(pkg.targetRole || pkg.target_role || 'all')}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-800">
                        {formatIdr(pkg.priceMonthly)}
                      </td>

                      <td className="py-3 px-4 font-mono font-bold text-stone-800">
                        {formatIdr(pkg.priceYearly)}
                      </td>

                      <td className="py-3 px-4">
                        {pkg.discountPercent > 0 ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            {pkg.discountPercent}%
                          </span>
                        ) : (
                          <span className="text-stone-400">-</span>
                        )}
                      </td>

                      <td className="py-3 px-4 text-stone-600">
                        <div className="text-[11px] space-y-0.5">
                          <div>Lot: {feat.quotaLots || 'Unlimited'}</div>
                          <div className="text-stone-400">
                            {feat.eudrPolygon ? 'EUDR ✓ ' : ''}
                            {feat.aiCuppingRadar ? 'AI SCA ✓ ' : ''}
                            {feat.apiIntegration ? 'API ✓ ' : ''}
                          </div>
                        </div>
                      </td>

                      <td className="py-3 px-4">
                        <button
                          type="button"
                          onClick={() => handleToggleStatus(pkg)}
                          className={`px-2 py-0.5 rounded-full text-[10px] font-bold border transition-colors cursor-pointer ${
                            pkg.status === 'active'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-stone-200 text-stone-700 border-stone-300'
                          }`}
                        >
                          {pkg.status === 'active' ? 'Aktif' : 'Arsip'}
                        </button>
                      </td>

                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEditModal(pkg)}
                            className="p-1.5 rounded-lg text-stone-600 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                            title="Ubah paket"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteCandidate(pkg)}
                            className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer"
                            title="Hapus paket"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* 5. MODAL TAMBAH / UBAH PAKET */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-4xl w-full border border-stone-200 shadow-2xl overflow-hidden my-8 max-h-[90vh] flex flex-col">
            {/* Modal Header */}
            <div className="px-6 py-4 bg-gradient-to-r from-stone-950 via-stone-900 to-amber-950 text-white flex items-center justify-between shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-300 flex items-center justify-center border border-amber-400/30">
                  <Package className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-black tracking-tight">
                    {editingPackage ? 'Ubah Konfigurasi Paket Layanan' : 'Buat Paket Layanan SaaS Baru'}
                  </h3>
                  <p className="text-xs text-stone-300">
                    Konfigurasi skema harga komersial, batas kuota, dan matriks hak akses modul.
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Body Form */}
            <form onSubmit={handleSavePackage} className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* SECTION A: INFORMASI DASAR */}
              <div>
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">
                    1
                  </span>
                  <span>Informasi Identitas &amp; Target Stakeholder</span>
                </h4>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      ID Paket Layanan (Kode Unik)
                    </label>
                    <input
                      type="text"
                      value={formId}
                      onChange={(e) => setFormId(e.target.value.toUpperCase())}
                      placeholder="e.g. PKG-GAPOKTAN-CUSTOM"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-400 mt-0.5 block">
                      Kosongkan untuk generate otomatis.
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Nama Paket Komersial <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      required
                      value={formName}
                      onChange={(e) => setFormName(e.target.value)}
                      placeholder="e.g. Paket Starter Gapoktan Mandiri"
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Target Stakeholder Rantai Pasok
                    </label>
                    <select
                      value={formTargetRole}
                      onChange={(e) => setFormTargetRole(e.target.value as PackageTargetRole)}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-semibold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    >
                      {TARGET_ROLE_OPTIONS.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Status Publikasi
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <label
                        className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          formStatus === 'active'
                            ? 'bg-emerald-50 border-emerald-400 text-emerald-900 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="formStatus"
                          value="active"
                          checked={formStatus === 'active'}
                          onChange={() => setFormStatus('active')}
                          className="sr-only"
                        />
                        <span>Aktif Dijual</span>
                      </label>
                      <label
                        className={`p-2 rounded-xl border text-center font-bold cursor-pointer transition-all ${
                          formStatus === 'archived'
                            ? 'bg-stone-200 border-stone-400 text-stone-900 shadow-xs'
                            : 'bg-stone-50 border-stone-200 text-stone-600'
                        }`}
                      >
                        <input
                          type="radio"
                          name="formStatus"
                          value="archived"
                          checked={formStatus === 'archived'}
                          onChange={() => setFormStatus('archived')}
                          className="sr-only"
                        />
                        <span>Diarsipkan</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Popular Toggle Checkbox */}
                <div className="mt-3 p-3 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-amber-600 shrink-0" />
                    <div>
                      <span className="text-xs font-bold text-amber-950 block">
                        Tandai Sebagai "Paling Populer" (Rekomendasi)
                      </span>
                      <span className="text-[10px] text-amber-800">
                        Menampilkan badge highlight bersinar dan posisi terdepan di tabel harga pelanggan.
                      </span>
                    </div>
                  </div>
                  <input
                    type="checkbox"
                    checked={formIsPopular}
                    onChange={(e) => setFormIsPopular(e.target.checked)}
                    className="w-4 h-4 text-amber-600 rounded border-stone-300 focus:ring-amber-500 cursor-pointer"
                  />
                </div>
              </div>

              {/* SECTION B: PRICING & DISKON */}
              <div className="pt-4 border-t border-stone-100">
                <div className="flex items-center justify-between mb-3">
                  <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">
                      2
                    </span>
                    <span>Struktur Harga Langganan (IDR)</span>
                  </h4>

                  <button
                    type="button"
                    onClick={handleCalculateDiscount}
                    className="text-[11px] font-bold text-amber-700 hover:text-amber-900 underline cursor-pointer"
                  >
                    Hitung Diskon Otomatis dari 12 Bulan
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Harga Bulanan (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={formPriceMonthly}
                      onChange={(e) => setFormPriceMonthly(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      {formatIdr(formPriceMonthly)} / bln
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Harga Tahunan (Rp)
                    </label>
                    <input
                      type="number"
                      min={0}
                      step={1000}
                      value={formPriceYearly}
                      onChange={(e) => setFormPriceYearly(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      {formatIdr(formPriceYearly)} / thn
                    </span>
                  </div>

                  <div>
                    <label className="block font-bold text-stone-700 mb-1">
                      Persentase Diskon Tahunan (%)
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={100}
                      value={formDiscountPercent}
                      onChange={(e) => setFormDiscountPercent(Number(e.target.value))}
                      className="w-full bg-stone-50 border border-stone-300 rounded-xl px-3 py-2 text-stone-900 font-mono font-bold focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
                    />
                    <span className="text-[10px] text-stone-500 mt-0.5 block">
                      Badge hemat yang ditampilkan ke user
                    </span>
                  </div>
                </div>
              </div>

              {/* SECTION C: FEATURE FLAGS CONFIGURATOR */}
              <div className="pt-4 border-t border-stone-100">
                <h4 className="text-xs font-black uppercase tracking-wider text-amber-950 flex items-center gap-2 mb-3">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-900 flex items-center justify-center text-[10px] font-bold">
                    3
                  </span>
                  <span>Matriks Fitur &amp; Pembatasan Kuota (Feature Flags)</span>
                </h4>

                <div className="space-y-3.5 text-xs">
                  {/* Kuota Lot Panen */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-900 block">
                        Batas Kuota Lot Panen / Batch Sangrai
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Maksimal entri lot per bulan yang dapat dibuat oleh pemegang lisensi ini.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-stone-700">
                        <input
                          type="checkbox"
                          checked={formIsLotsUnlimited}
                          onChange={(e) => {
                            setFormIsLotsUnlimited(e.target.checked);
                            if (e.target.checked) setFormQuotaLots('Unlimited (Tanpa Batas)');
                          }}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <span>Unlimited</span>
                      </label>

                      {!formIsLotsUnlimited && (
                        <input
                          type="text"
                          value={formQuotaLots}
                          onChange={(e) => setFormQuotaLots(e.target.value)}
                          placeholder="e.g. 50 Lot / Bulan"
                          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-medium w-36"
                        />
                      )}
                    </div>
                  </div>

                  {/* Kuota Barcode QR */}
                  <div className="p-3.5 rounded-xl bg-stone-50 border border-stone-200 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <div className="space-y-0.5">
                      <span className="font-bold text-stone-900 block">
                        Batas Kuota Cetak Barcode QR Traceability
                      </span>
                      <span className="text-[11px] text-stone-500">
                        Kapasitas penerbitan kode QR unik verifikasi mutu Farm-to-Cup.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <label className="flex items-center gap-1.5 cursor-pointer font-bold text-stone-700">
                        <input
                          type="checkbox"
                          checked={formIsQrUnlimited}
                          onChange={(e) => {
                            setFormIsQrUnlimited(e.target.checked);
                            if (e.target.checked) setFormQuotaQrBarcodes('Unlimited');
                          }}
                          className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                        />
                        <span>Unlimited</span>
                      </label>

                      {!formIsQrUnlimited && (
                        <input
                          type="text"
                          value={formQuotaQrBarcodes}
                          onChange={(e) => setFormQuotaQrBarcodes(e.target.value)}
                          placeholder="e.g. 1.000 QR / Bulan"
                          className="bg-white border border-stone-300 rounded-lg px-2.5 py-1 text-xs text-stone-900 font-medium w-36"
                        />
                      )}
                    </div>
                  </div>

                  {/* Feature Toggles Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    {/* EUDR Polygon */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          Peta Poligon Lahan EUDR &amp; GPS Patok
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Kepatuhan deforestasi &amp; batas kebun BPN
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formEudrPolygon}
                        onChange={(e) => setFormEudrPolygon(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>

                    {/* AI Cupping Radar */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          AI Spider Cupping Radar &amp; Agtron
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Sensory evaluation SCA 10 atribut digital
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formAiCuppingRadar}
                        onChange={(e) => setFormAiCuppingRadar(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>

                    {/* Marketplace Access */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          Akses Marketplace B2B Kopi
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Jual ceri merah, green bean, atau retail
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formMarketplaceAccess}
                        onChange={(e) => setFormMarketplaceAccess(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>

                    {/* Warehouse Hermetic QA */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          Gudang Hermetik &amp; Defect QA
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Sensor suhu RH, GrainPro, &amp; defect sorting
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formWarehouseHermeticQa}
                        onChange={(e) => setFormWarehouseHermeticQa(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>

                    {/* API Integration */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          Akses REST API &amp; Webhook
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Sinkronisasi ERP enterprise pihak ketiga
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formApiIntegration}
                        onChange={(e) => setFormApiIntegration(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>

                    {/* Custom Branding Logo */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          Kustomisasi Logo &amp; Stempel
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Branding resmi di paspor cetak QR
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formCustomBrandingLogo}
                        onChange={(e) => setFormCustomBrandingLogo(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>

                    {/* Dedicated Support */}
                    <label className="p-3 rounded-xl border border-stone-200 hover:border-amber-400 bg-white flex items-center justify-between cursor-pointer transition-colors shadow-2xs sm:col-span-2">
                      <div>
                        <span className="font-bold text-stone-900 block">
                          Dukungan Dedicated Support 24/7 SLA Priority
                        </span>
                        <span className="text-[10px] text-stone-500">
                          Account manager khusus dan penanganan insiden prioritas tinggi
                        </span>
                      </div>
                      <input
                        type="checkbox"
                        checked={formDedicatedSupport}
                        onChange={(e) => setFormDedicatedSupport(e.target.checked)}
                        className="w-4 h-4 text-amber-600 rounded focus:ring-amber-500"
                      />
                    </label>
                  </div>
                </div>
              </div>

              {/* Modal Actions */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-end gap-3 shrink-0">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2.5 rounded-xl border border-stone-300 hover:bg-stone-100 text-stone-700 text-xs font-bold transition-colors cursor-pointer"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 text-xs font-black transition-all shadow-md hover:shadow-lg shadow-amber-950/20 cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingPackage ? 'Simpan Perubahan' : 'Terbitkan Paket Layanan'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 6. MODAL KONFIRMASI HAPUS */}
      {deleteCandidate && (
        <div className="fixed inset-0 z-50 bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 border border-stone-200 shadow-2xl space-y-4">
            <div className="w-12 h-12 rounded-2xl bg-rose-100 text-rose-600 flex items-center justify-center">
              <Trash2 className="w-6 h-6" />
            </div>

            <div>
              <h3 className="text-base font-black text-stone-900">
                Hapus Paket Layanan Ini?
              </h3>
              <p className="text-xs text-stone-600 mt-1 leading-relaxed">
                Anda akan menghapus paket komersial{' '}
                <strong className="text-stone-900 font-bold">"{deleteCandidate.name}"</strong> (
                {deleteCandidate.id}). Tindakan ini tidak dapat dibatalkan.
              </p>
            </div>

            <div className="pt-2 flex items-center justify-end gap-2.5">
              <button
                type="button"
                onClick={() => setDeleteCandidate(null)}
                className="px-4 py-2 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors cursor-pointer"
              >
                Batal
              </button>
              <button
                type="button"
                onClick={handleConfirmDelete}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold transition-colors shadow-xs cursor-pointer"
              >
                Ya, Hapus Permanen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PlatformPackagesPage;
