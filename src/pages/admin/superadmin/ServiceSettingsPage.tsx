import React, { useState, useEffect, useMemo } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import {
  Building2,
  Warehouse,
  Flame,
  Coffee,
  ShieldCheck,
  Users,
  Settings,
  DollarSign,
  ToggleLeft,
  ToggleRight,
  Save,
  CheckCircle2,
  AlertCircle,
  Shield,
  Layers,
  ArrowRight,
  TrendingUp,
  Sliders,
  Sparkles,
  Lock,
  Unlock,
  Check,
  Search,
  RefreshCw,
  ExternalLink,
  ShieldAlert,
} from 'lucide-react';
import { useCoffee } from '../../../context/CoffeeContext';
import {
  SuperAdminServiceId,
  ServiceConfig,
  ServiceStatus,
} from '../../../types/superAdminTypes';
import {
  getSavedServiceConfigs,
  saveServiceConfig,
} from '../../../data/superAdminData';

const SERVICE_NAV_ITEMS: {
  id: SuperAdminServiceId;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  badgeBg: string;
}[] = [
  {
    id: 'admin_kelompok_tani',
    label: 'Kelompok Tani & Hulu',
    icon: Building2,
    color: 'text-amber-500',
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
  },
  {
    id: 'gudang',
    label: 'Gudang Hermetik & QA',
    icon: Warehouse,
    color: 'text-blue-500',
    badgeBg: 'bg-blue-100 text-blue-900 border-blue-300',
  },
  {
    id: 'roaster',
    label: 'Artisan Roastery',
    icon: Flame,
    color: 'text-orange-500',
    badgeBg: 'bg-orange-100 text-orange-900 border-orange-300',
  },
  {
    id: 'cafe',
    label: 'Specialty Cafe & Kedai',
    icon: Coffee,
    color: 'text-stone-600',
    badgeBg: 'bg-stone-200 text-stone-900 border-stone-300',
  },
  {
    id: 'verifikator',
    label: 'Verifikator Mutu (Auditor)',
    icon: ShieldCheck,
    color: 'text-purple-600',
    badgeBg: 'bg-purple-100 text-purple-900 border-purple-300',
  },
];

export const ServiceSettingsPage: React.FC = () => {
  const { serviceId } = useParams<{ serviceId?: string }>();
  const navigate = useNavigate();
  const { users } = useCoffee();

  // Selected Service (default to admin_kelompok_tani)
  const activeServiceId: SuperAdminServiceId = useMemo(() => {
    if (
      serviceId &&
      ['admin_kelompok_tani', 'gudang', 'roaster', 'cafe', 'verifikator'].includes(serviceId)
    ) {
      return serviceId as SuperAdminServiceId;
    }
    return 'admin_kelompok_tani';
  }, [serviceId]);

  // All service configs loaded from storage / default
  const [configs, setConfigs] = useState<Record<SuperAdminServiceId, ServiceConfig>>(() =>
    getSavedServiceConfigs()
  );

  const currentConfig = configs[activeServiceId];

  // Active Tab inside the service settings page
  const [activeTab, setActiveTab] = useState<'quota' | 'pricing' | 'features' | 'users'>('quota');

  // Form State for Quota Settings
  const [maxUsersPerOrg, setMaxUsersPerOrg] = useState<number>(currentConfig?.quota?.maxUsersPerOrg || 50);
  const [maxOrganizations, setMaxOrganizations] = useState<number>(currentConfig?.quota?.maxOrganizationsInPlatform || 100);
  const [allowPublicReg, setAllowPublicReg] = useState<boolean>(currentConfig?.quota?.allowPublicRegistration ?? true);
  const [requireVerification, setRequireVerification] = useState<boolean>(currentConfig?.quota?.requireManualVerification ?? false);
  const [maxLotsPerMonth, setMaxLotsPerMonth] = useState<string>(String(currentConfig?.quota?.maxLotsPerMonthPerOrg || 'Unlimited'));
  const [maxQrTagsPerMonth, setMaxQrTagsPerMonth] = useState<string>(String(currentConfig?.quota?.maxQrTagsPerMonthPerOrg || '2,500 Tag/Bulan'));

  // Form State for Pricing Settings
  const [basePrice, setBasePrice] = useState<number>(currentConfig?.pricing?.baseMonthlyPrice || 0);
  const [additionalSeatPrice, setAdditionalSeatPrice] = useState<number>(currentConfig?.pricing?.additionalSeatPriceMonthly || 25000);
  const [marketplaceFee, setMarketplaceFee] = useState<number>(currentConfig?.pricing?.marketplaceFeePercent || 1.5);
  const [customDomainPrice, setCustomDomainPrice] = useState<number>(currentConfig?.pricing?.customDomainAddonPrice || 150000);
  const [supportLevel, setSupportLevel] = useState<'community' | 'standard' | 'priority_sla_24_7'>(
    currentConfig?.pricing?.supportLevel || 'standard'
  );

  // Form State for Feature Toggles
  const [featuresList, setFeaturesList] = useState(currentConfig?.features || []);

  // Service Status state
  const [serviceStatus, setServiceStatus] = useState<ServiceStatus>(currentConfig?.status || 'active');

  // Feedback banner
  const [saveMessage, setSaveMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  // User search filter in Tab 4
  const [userSearch, setUserSearch] = useState('');

  // Sync state when active service changes
  useEffect(() => {
    if (currentConfig) {
      setMaxUsersPerOrg(currentConfig.quota.maxUsersPerOrg);
      setMaxOrganizations(currentConfig.quota.maxOrganizationsInPlatform);
      setAllowPublicReg(currentConfig.quota.allowPublicRegistration);
      setRequireVerification(currentConfig.quota.requireManualVerification);
      setMaxLotsPerMonth(String(currentConfig.quota.maxLotsPerMonthPerOrg));
      setMaxQrTagsPerMonth(String(currentConfig.quota.maxQrTagsPerMonthPerOrg));

      setBasePrice(currentConfig.pricing.baseMonthlyPrice);
      setAdditionalSeatPrice(currentConfig.pricing.additionalSeatPriceMonthly);
      setMarketplaceFee(currentConfig.pricing.marketplaceFeePercent);
      setCustomDomainPrice(currentConfig.pricing.customDomainAddonPrice);
      setSupportLevel(currentConfig.pricing.supportLevel);

      setFeaturesList(currentConfig.features);
      setServiceStatus(currentConfig.status);
      setSaveMessage(null);
    }
  }, [activeServiceId, currentConfig]);

  // Calculate actual registered users matching this service
  const serviceUsers = useMemo(() => {
    return (users || []).filter((u) => {
      if (activeServiceId === 'admin_kelompok_tani') {
        return (
          u.role === 'admin_kelompok_tani' ||
          u.role === 'petani' ||
          u.role === 'pengolah' ||
          u.role === 'ict'
        );
      }
      return u.role === activeServiceId;
    });
  }, [users, activeServiceId]);

  const filteredServiceUsers = useMemo(() => {
    if (!userSearch.trim()) return serviceUsers;
    const q = userSearch.toLowerCase();
    return serviceUsers.filter(
      (u) =>
        u.name?.toLowerCase().includes(q) ||
        u.email?.toLowerCase().includes(q) ||
        u.organization?.toLowerCase().includes(q) ||
        u.location?.toLowerCase().includes(q)
    );
  }, [serviceUsers, userSearch]);

  const handleToggleFeature = (featureId: string) => {
    setFeaturesList((prev) =>
      prev.map((f) => (f.id === featureId ? { ...f, enabled: !f.enabled } : f))
    );
  };

  const handleSaveAll = () => {
    try {
      const updatedConfig: Partial<ServiceConfig> = {
        status: serviceStatus,
        quota: {
          ...currentConfig.quota,
          maxUsersPerOrg: Number(maxUsersPerOrg),
          maxOrganizationsInPlatform: Number(maxOrganizations),
          currentUsersCount: serviceUsers.length,
          allowPublicRegistration: allowPublicReg,
          requireManualVerification: requireVerification,
          maxLotsPerMonthPerOrg: maxLotsPerMonth,
          maxQrTagsPerMonthPerOrg: maxQrTagsPerMonth,
        },
        pricing: {
          ...currentConfig.pricing,
          baseMonthlyPrice: Number(basePrice),
          additionalSeatPriceMonthly: Number(additionalSeatPrice),
          marketplaceFeePercent: Number(marketplaceFee),
          customDomainAddonPrice: Number(customDomainPrice),
          supportLevel: supportLevel,
        },
        features: featuresList,
      };

      const nextConfigs = saveServiceConfig(activeServiceId, updatedConfig);
      setConfigs(nextConfigs);

      // Async sync to backend API
      fetch('/api/superadmin.php?action=update_service', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: activeServiceId,
          name: currentConfig.name,
          status: serviceStatus,
          quota: updatedConfig.quota,
          pricing: updatedConfig.pricing,
          features: featuresList,
        }),
      }).catch(() => {
        // LocalStorage fallback already succeeded
      });

      setSaveMessage({
        type: 'success',
        text: `Konfigurasi ${currentConfig.name} berhasil disimpan dan langsung diterapkan ke seluruh platform!`,
      });

      setTimeout(() => {
        setSaveMessage(null);
      }, 4000);
    } catch (err: any) {
      setSaveMessage({
        type: 'error',
        text: err?.message || 'Gagal menyimpan konfigurasi.',
      });
    }
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#1A0E08] via-[#24130B] to-[#140A06] text-white p-6 sm:p-8 border border-amber-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-purple-900/80 text-purple-200 border border-purple-700/60 flex items-center gap-1.5 shadow-2xs">
                <ShieldAlert className="w-3.5 h-3.5 text-purple-300" />
                Super Admin / Platform Owner
              </span>
              <span className="text-xs text-stone-400">
                Pusat Kendali Pengaturan Layanan Rantai Pasok
              </span>
            </div>

            <button
              onClick={handleSaveAll}
              className="py-2.5 px-5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
            >
              <Save className="w-4 h-4" />
              <span>Simpan Perubahan Service</span>
            </button>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight flex items-center gap-3">
              <span>Pengaturan Service: {currentConfig?.name}</span>
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              {currentConfig?.description}
            </p>
          </div>

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Total User Aktif
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">
                  {serviceUsers.length}
                </span>
                <span className="text-[11px] text-stone-400">
                  / max {maxOrganizations * maxUsersPerOrg} kuota
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Maks Sub-User / Org
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-amber-400">
                  {maxUsersPerOrg}
                </span>
                <span className="text-[11px] text-stone-400">Akun Anggota</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Harga Dasar SaaS
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-xl font-black text-emerald-400">
                  Rp {basePrice.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-400">/bln</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Status Operasional
              </span>
              <div className="mt-1">
                <select
                  value={serviceStatus}
                  onChange={(e) => setServiceStatus(e.target.value as ServiceStatus)}
                  className="bg-[#120B08] text-white text-xs font-bold px-2.5 py-1 rounded-lg border border-white/20 focus:outline-hidden focus:border-amber-400 cursor-pointer"
                >
                  <option value="active">🟢 Aktif & Buka</option>
                  <option value="maintenance">🟡 Pemeliharaan (Maintenance)</option>
                  <option value="invite_only">🟣 Khusus Undangan (Invite Only)</option>
                  <option value="disabled">🔴 Dinonaktifkan (Disabled)</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Save Feedback Banner */}
      {saveMessage && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-md transition-all ${
            saveMessage.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-red-50 text-red-950 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            {saveMessage.type === 'success' ? (
              <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            ) : (
              <AlertCircle className="w-5 h-5 text-red-600 shrink-0" />
            )}
            <span className="font-bold">{saveMessage.text}</span>
          </div>
          <button
            onClick={() => setSaveMessage(null)}
            className="text-stone-400 hover:text-stone-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Service Selection Pills / Tabs Bar */}
      <div className="bg-white p-2.5 rounded-2xl border border-stone-200 shadow-xs">
        <div className="text-[11px] font-black uppercase tracking-wider text-stone-400 px-3 py-1 mb-1">
          Pilih Service yang Ingin Dikonfigurasi:
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
          {SERVICE_NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isSelected = activeServiceId === item.id;
            const userCount = users.filter((u) => {
              if (item.id === 'admin_kelompok_tani') {
                return (
                  u.role === 'admin_kelompok_tani' ||
                  u.role === 'petani' ||
                  u.role === 'pengolah' ||
                  u.role === 'ict'
                );
              }
              return u.role === item.id;
            }).length;

            return (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/admin/superadmin/services/${item.id}`)}
                className={`flex items-center gap-2.5 p-3 rounded-xl border text-left transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-stone-900 text-white border-stone-900 shadow-md ring-2 ring-amber-500/30'
                    : 'bg-stone-50/70 text-stone-700 border-stone-200 hover:bg-stone-100 hover:border-stone-300'
                }`}
              >
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                    isSelected ? 'bg-amber-500 text-stone-950 font-bold' : 'bg-white border border-stone-200'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isSelected ? 'text-stone-950' : item.color}`} />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-bold text-xs truncate leading-tight">{item.label}</div>
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <span
                      className={`text-[10px] font-semibold px-1.5 py-0.2 rounded-full ${
                        isSelected
                          ? 'bg-stone-800 text-stone-300'
                          : 'bg-stone-200/80 text-stone-600'
                      }`}
                    >
                      {userCount} Users
                    </span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Sub-Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-stone-200 pb-2 overflow-x-auto">
        <button
          type="button"
          onClick={() => setActiveTab('quota')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'quota'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Users className="w-4 h-4" />
          <span>1. Kuota &amp; Pengguna Service</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
            {maxUsersPerOrg} / org
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('pricing')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'pricing'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>2. Settingan Harga &amp; Komisi Fee</span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('features')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'features'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Sliders className="w-4 h-4" />
          <span>3. Modul &amp; Fitur Khusus</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-white/20 font-mono">
            {featuresList.filter((f) => f.enabled).length}/{featuresList.length} Aktif
          </span>
        </button>

        <button
          type="button"
          onClick={() => setActiveTab('users')}
          className={`flex items-center gap-2 px-4 py-2.5 rounded-xl font-bold text-xs transition-all cursor-pointer ${
            activeTab === 'users'
              ? 'bg-amber-600 text-white shadow-sm'
              : 'text-stone-600 hover:bg-stone-100 hover:text-stone-900'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>4. Daftar User &amp; Tenant ({serviceUsers.length})</span>
        </button>
      </div>

      {/* 4. Tab Contents */}

      {/* TAB 1: KUOTA & PENGGUNA */}
      {activeTab === 'quota' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Batas Kuota User */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Batas Alokasi Akun &amp; Kuota Pengguna
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Kendalikan jumlah seat maksimal per tenant/organisasi di service ini
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Maksimum Sub-Akun / User per Organisasi:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="500"
                    value={maxUsersPerOrg}
                    onChange={(e) => setMaxUsersPerOrg(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="text-stone-500">
                    User/Anggota (misal: 1 Kelompok Tani = max {maxUsersPerOrg} petani binaan)
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Maksimum Total Organisasi di Platform:
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min="1"
                    max="1000"
                    value={maxOrganizations}
                    onChange={(e) => setMaxOrganizations(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="text-stone-500">
                    Organisasi / Perusahaan yang diizinkan mendaftar
                  </span>
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Kuota Pencatatan Batch / Lot per Bulan:
                </label>
                <input
                  type="text"
                  value={maxLotsPerMonth}
                  onChange={(e) => setMaxLotsPerMonth(e.target.value)}
                  placeholder="e.g. Unlimited atau 100 Lot/Bulan"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Kuota Cetak Tag &amp; QR Farm-to-Cup:
                </label>
                <input
                  type="text"
                  value={maxQrTagsPerMonth}
                  onChange={(e) => setMaxQrTagsPerMonth(e.target.value)}
                  placeholder="e.g. 5,000 Tag/Bulan"
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-hidden focus:border-amber-500"
                />
              </div>
            </div>
          </div>

          {/* Card B: Aturan Pendaftaran & Onboarding */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-800 flex items-center justify-center font-bold">
                  <Shield className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Kebijakan Pendaftaran &amp; Onboarding
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Atur akses publik dan alur verifikasi akun baru untuk peran ini
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-stone-900">
                    Izinkan Registrasi Publik Mandiri
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Jika dinonaktifkan, peran ini tidak akan muncul di form registrasi umum dan hanya dapat dibuat langsung oleh Super Admin (Invite Only).
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setAllowPublicReg(!allowPublicReg)}
                  className={`p-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                    allowPublicReg ? 'text-emerald-600' : 'text-stone-400'
                  }`}
                >
                  {allowPublicReg ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 flex items-start justify-between gap-4">
                <div>
                  <div className="font-bold text-xs text-stone-900">
                    Wajibkan Verifikasi Manual Dokumen
                  </div>
                  <p className="text-[11px] text-stone-500 mt-0.5">
                    Akun baru tidak dapat langsung menerbitkan lot sampai Super Admin / Verifikator memeriksa NIK/KTA dan menyetujui akunnya.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => setRequireVerification(!requireVerification)}
                  className={`p-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                    requireVerification ? 'text-amber-600' : 'text-stone-400'
                  }`}
                >
                  {requireVerification ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>

              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 text-xs text-amber-950 flex items-start gap-2.5">
                <Sparkles className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div className="space-y-1">
                  <span className="font-bold block">Status Realtime di Ekosistem:</span>
                  <p className="text-[11px] text-amber-900 leading-relaxed">
                    Saat ini terdapat <strong>{serviceUsers.length} akun terdaftar</strong> di pilar ini. Seluruh sub-user dapat dipantau pada tab "Daftar User &amp; Tenant".
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: HARGA & KOMISI FEE */}
      {activeTab === 'pricing' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card A: Paket & Seat Pricing */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
                  <DollarSign className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Tarif Berlangganan SaaS &amp; Lisensi
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Tentukan tarif dasar bulanan dan biaya tambahan per user
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Harga Langganan Dasar (Per Bulan):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    value={basePrice}
                    onChange={(e) => setBasePrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Nilai ekuivalen tahunan (diskon standar 17%): Rp {(basePrice * 10).toLocaleString('id-ID')}/tahun
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Biaya Seat Tambahan (Per Sub-User / Bulan):
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Rp</span>
                  <input
                    type="number"
                    step="1000"
                    value={additionalSeatPrice}
                    onChange={(e) => setAdditionalSeatPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Dikenakan jika organisasi melebihi kuota dasar gratis
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Add-on White-Label / Custom Domain:
                </label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-stone-400 font-bold">Rp</span>
                  <input
                    type="number"
                    step="10000"
                    value={customDomainPrice}
                    onChange={(e) => setCustomDomainPrice(Number(e.target.value))}
                    className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Biaya tambahan jika roastery/gapoktan ingin domain brand sendiri (e.g. trace.kopi-malabar.id)
                </span>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Level SLA Layanan Support:
                </label>
                <select
                  value={supportLevel}
                  onChange={(e) => setSupportLevel(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-medium text-stone-900 focus:outline-hidden focus:border-amber-500 cursor-pointer"
                >
                  <option value="community">Community (Forum &amp; Helpdesk Biasa)</option>
                  <option value="standard">Standard SLA (Respon &lt; 24 Jam Kerja)</option>
                  <option value="priority_sla_24_7">Priority SLA 24/7 (Dedicated WhatsApp &amp; Account Manager)</option>
                </select>
              </div>
            </div>
          </div>

          {/* Card B: Marketplace Fee & Hubungan Paket */}
          <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-orange-100 text-orange-800 flex items-center justify-center font-bold">
                  <TrendingUp className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-black text-sm text-stone-900">
                    Komisi Fee Transaksi Marketplace B2B
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    Bagi hasil platform dari transaksi jual beli komoditas kopi
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Persentase Komisi Platform (% per Transaksi):
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    step="0.1"
                    min="0"
                    max="10"
                    value={marketplaceFee}
                    onChange={(e) => setMarketplaceFee(Number(e.target.value))}
                    className="w-32 px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-900 focus:outline-hidden focus:border-amber-500"
                  />
                  <span className="text-stone-700 font-bold">% dari Nilai Penjualan Berhasil</span>
                </div>
                <span className="text-[10px] text-stone-400 mt-1 block">
                  Contoh: Transaksi Rp 10.000.000 dengan fee {marketplaceFee}% menghasilkan fee platform sebesar Rp {(10000000 * marketplaceFee / 100).toLocaleString('id-ID')}.
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <span className="font-bold text-xs text-stone-900 block">
                  Paket Komersial Terhubung:
                </span>
                <p className="text-[11px] text-stone-600">
                  Paket default saat ini: <strong>{currentConfig.pricing.defaultPackageName}</strong> ({currentConfig.pricing.defaultPackageId})
                </p>
                <Link
                  to="/admin/superadmin/packages"
                  className="inline-flex items-center gap-1.5 text-xs font-bold text-amber-700 hover:text-amber-800 hover:underline pt-1"
                >
                  <span>Buka Editor Katalog Paket SaaS Lengkap</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: FITUR & MODUL KHUSUS SERVICE */}
      {activeTab === 'features' && (
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-5">
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-100">
            <div>
              <h3 className="font-black text-sm text-stone-900">
                Matriks Modul &amp; Fitur Khusus: {currentConfig.name}
              </h3>
              <p className="text-[11px] text-stone-500">
                Aktifkan atau nonaktifkan modul fungsional tertentu untuk seluruh organisasi di service ini
              </p>
            </div>
            <button
              onClick={handleSaveAll}
              className="py-2 px-4 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-bold text-xs flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Simpan Modul</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
            {featuresList.map((feature) => (
              <div
                key={feature.id}
                className={`p-4 rounded-2xl border transition-all flex items-start justify-between gap-3 ${
                  feature.enabled
                    ? 'border-amber-300 bg-amber-50/40 ring-1 ring-amber-400/20'
                    : 'border-stone-200 bg-stone-50/60 opacity-80'
                }`}
              >
                <div className="space-y-1 pr-2">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-xs text-stone-900">
                      {feature.name}
                    </span>
                    {feature.isPremium && (
                      <span className="text-[9px] font-black uppercase tracking-wider px-1.5 py-0.2 rounded bg-amber-200 text-amber-900">
                        Add-on
                      </span>
                    )}
                    <span className="text-[9px] font-mono px-1.5 py-0.2 rounded bg-stone-200/80 text-stone-700">
                      {feature.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-stone-600 leading-relaxed">
                    {feature.description}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleToggleFeature(feature.id)}
                  className={`p-1 rounded-full transition-colors cursor-pointer shrink-0 ${
                    feature.enabled ? 'text-amber-600' : 'text-stone-400'
                  }`}
                >
                  {feature.enabled ? (
                    <ToggleRight className="w-8 h-8" />
                  ) : (
                    <ToggleLeft className="w-8 h-8" />
                  )}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 4: DAFTAR USER & TENANT TERDAFTAR */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
          <div className="p-6 border-b border-stone-100 flex flex-wrap items-center justify-between gap-4">
            <div>
              <h3 className="font-black text-sm text-stone-900">
                Pengguna &amp; Organisasi Terdaftar ({serviceUsers.length})
              </h3>
              <p className="text-[11px] text-stone-500">
                Daftar akun yang tergolong dalam service {currentConfig.name}
              </p>
            </div>

            <div className="w-full sm:w-72 relative">
              <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
              <input
                type="text"
                placeholder="Cari nama, email, lokasi..."
                value={userSearch}
                onChange={(e) => setUserSearch(e.target.value)}
                className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
              />
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3 px-4">Pengguna &amp; Organisasi</th>
                  <th className="py-3 px-4">Peran Khusus</th>
                  <th className="py-3 px-4">Lokasi Kebun/Pabrik</th>
                  <th className="py-3 px-4">Kontak / Email</th>
                  <th className="py-3 px-4">Status Akun</th>
                  <th className="py-3 px-4 text-right">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {filteredServiceUsers.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-stone-400 text-xs">
                      Tidak ditemukan pengguna yang cocok dengan pencarian.
                    </td>
                  </tr>
                ) : (
                  filteredServiceUsers.map((u) => (
                    <tr key={u.id} className="hover:bg-stone-50/80 transition-colors">
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={u.avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100'}
                            alt={u.name}
                            className="w-8 h-8 rounded-full object-cover border border-stone-200"
                          />
                          <div>
                            <div className="font-bold text-stone-900">{u.name}</div>
                            <div className="text-[11px] text-stone-500">{u.organization || '-'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-[11px] text-amber-900">
                        <span className="px-2 py-0.5 rounded bg-amber-50 border border-amber-200">
                          {u.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-stone-600">{u.location || '-'}</td>
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-stone-900">{u.email || '-'}</div>
                        <div className="text-[10px] text-stone-400">{u.phone || '-'}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          🟢 Aktif
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-right">
                        <Link
                          to="/admin/users"
                          className="px-2.5 py-1 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-bold text-[11px] transition-colors"
                        >
                          Kelola User →
                        </Link>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};
