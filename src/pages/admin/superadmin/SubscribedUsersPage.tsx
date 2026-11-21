import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Users,
  CreditCard,
  TrendingUp,
  Search,
  Filter,
  CheckCircle2,
  AlertCircle,
  Clock,
  Sparkles,
  Building2,
  Warehouse,
  Flame,
  Coffee,
  ShieldCheck,
  Edit2,
  Calendar,
  RotateCcw,
  Plus,
  Send,
  Lock,
  Unlock,
  Package,
  Layers,
  ChevronRight,
  ExternalLink,
} from 'lucide-react';
import {
  SubscribedOrganization,
  SubscriptionStatus,
  BillingCycle,
  SuperAdminServiceId,
} from '../../../types/superAdminTypes';
import {
  getSavedSubscriptions,
  saveSubscriptions,
  updateSubscriptionRecord,
} from '../../../data/superAdminData';

const SERVICE_BADGES: Record<
  SuperAdminServiceId,
  { label: string; bg: string; icon: React.ComponentType<{ className?: string }> }
> = {
  admin_kelompok_tani: {
    label: 'Kelompok Tani',
    bg: 'bg-amber-100 text-amber-900 border-amber-300',
    icon: Building2,
  },
  gudang: {
    label: 'Gudang & QA',
    bg: 'bg-blue-100 text-blue-900 border-blue-300',
    icon: Warehouse,
  },
  roaster: {
    label: 'Roastery',
    bg: 'bg-orange-100 text-orange-900 border-orange-300',
    icon: Flame,
  },
  cafe: {
    label: 'Cafe & Kedai',
    bg: 'bg-stone-200 text-stone-900 border-stone-300',
    icon: Coffee,
  },
  verifikator: {
    label: 'Verifikator',
    bg: 'bg-amber-100 text-amber-950 border-amber-300',
    icon: ShieldCheck,
  },
};

const STATUS_PILLS: Record<
  SubscriptionStatus,
  { label: string; bg: string; text: string; icon: string }
> = {
  active: {
    label: 'Aktif Berlangganan',
    bg: 'bg-emerald-100 border-emerald-300',
    text: 'text-emerald-900',
    icon: '🟢',
  },
  trial: {
    label: 'Masa Trial (Gratis)',
    bg: 'bg-yellow-100 border-yellow-300',
    text: 'text-yellow-900',
    icon: '🟡',
  },
  past_due: {
    label: 'Jatuh Tempo (Past Due)',
    bg: 'bg-red-100 border-red-300',
    text: 'text-red-900',
    icon: '🔴',
  },
  suspended: {
    label: 'Dibekukan (Suspended)',
    bg: 'bg-stone-200 border-stone-300',
    text: 'text-stone-700',
    icon: '⚪',
  },
  cancelled: {
    label: 'Dibatalkan',
    bg: 'bg-stone-100 border-stone-200',
    text: 'text-stone-500',
    icon: '✕',
  },
};

export const SubscribedUsersPage: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<SubscribedOrganization[]>(() =>
    getSavedSubscriptions()
  );

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedService, setSelectedService] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');

  // Edit / Upgrade Modal State
  const [editingSub, setEditingSub] = useState<SubscribedOrganization | null>(null);
  const [editStatus, setEditStatus] = useState<SubscriptionStatus>('active');
  const [editBillingCycle, setEditBillingCycle] = useState<BillingCycle>('monthly');
  const [editSeatsLimit, setEditSeatsLimit] = useState<number>(10);
  const [editRenewalDate, setEditRenewalDate] = useState<string>('');

  const [notification, setNotification] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  // Filtered List
  const filteredList = useMemo(() => {
    return subscriptions.filter((sub) => {
      const matchSearch =
        !searchQuery.trim() ||
        sub.organizationName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.picName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
        sub.packageName.toLowerCase().includes(searchQuery.toLowerCase());

      const matchService = selectedService === 'all' || sub.serviceId === selectedService;
      const matchStatus = selectedStatus === 'all' || sub.status === selectedStatus;

      return matchSearch && matchService && matchStatus;
    });
  }, [subscriptions, searchQuery, selectedService, selectedStatus]);

  // Aggregate SaaS Metrics
  const totalSubscribers = subscriptions.length;
  const activeSubscribers = subscriptions.filter((s) => s.status === 'active').length;
  const totalMRR = subscriptions
    .filter((s) => s.status === 'active' || s.status === 'trial')
    .reduce((acc, s) => acc + (s.mrrContribution || 0), 0);
  const totalARR = totalMRR * 12;

  const handleOpenEdit = (sub: SubscribedOrganization) => {
    setEditingSub(sub);
    setEditStatus(sub.status);
    setEditBillingCycle(sub.billingCycle);
    setEditSeatsLimit(sub.userSeatsLimit);
    setEditRenewalDate(sub.renewalDate);
  };

  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingSub) return;

    const next = updateSubscriptionRecord(editingSub.id, {
      status: editStatus,
      billingCycle: editBillingCycle,
      userSeatsLimit: Number(editSeatsLimit),
      renewalDate: editRenewalDate,
    });

    setSubscriptions(next);
    setEditingSub(null);
    setNotification({
      type: 'success',
      message: `Langganan ${editingSub.organizationName} berhasil diperbarui!`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleToggleSuspend = (sub: SubscribedOrganization) => {
    const nextStatus: SubscriptionStatus = sub.status === 'suspended' ? 'active' : 'suspended';
    const next = updateSubscriptionRecord(sub.id, { status: nextStatus });
    setSubscriptions(next);
    setNotification({
      type: 'success',
      message: `${sub.organizationName} berhasil ${nextStatus === 'suspended' ? 'dibekukan' : 'diaktifkan kembali'}.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  const handleSendReminder = (sub: SubscribedOrganization) => {
    setNotification({
      type: 'success',
      message: `Pemberitahuan invoice & penagihan telah dikirimkan ke email PIC: ${sub.email}.`,
    });
    setTimeout(() => setNotification(null), 3500);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Hero Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#120B08] via-[#1E110A] to-[#100906] text-white p-6 sm:p-8 border border-amber-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/4 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-amber-500/20 text-amber-300 border border-amber-400/30 shadow-2xs">
                SaaS Subscription &amp; Tenant Hub
              </span>
              <span className="text-xs text-stone-400">
                Manajemen Pelanggan Berlangganan &amp; Billing
              </span>
            </div>

            <Link
              to="/admin/superadmin/packages"
              className="py-2.5 px-4 rounded-xl bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-stone-950 font-black text-xs shadow-md shadow-amber-950/30 transition-all flex items-center gap-2"
            >
              <Package className="w-4 h-4" />
              <span>Katalog Paket &amp; Harga</span>
            </Link>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Daftar Pelanggan Berlangganan (Subscribed Users)
            </h1>
            <p className="text-xs sm:text-sm text-stone-300 max-w-3xl mt-1 leading-relaxed">
              Pantau seluruh entitas bisnis (Kelompok Tani, Gudang, Roastery, Cafe) yang aktif berlangganan lisensi SaaS CircularTrace, status tagihan, pemakaian kuota, dan masa perpanjangan.
            </p>
          </div>

          {/* KPI Summary Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Total Organisasi Pelanggan
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">{totalSubscribers}</span>
                <span className="text-[11px] text-emerald-400 font-bold">
                  ({activeSubscribers} Aktif)
                </span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Monthly Recurring Revenue
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-emerald-400">
                  Rp {totalMRR.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-400">/bln</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Annual Run Rate (ARR)
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-xl font-black text-amber-400">
                  Rp {totalARR.toLocaleString('id-ID')}
                </span>
                <span className="text-[10px] text-stone-400">/thn</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-stone-400 font-bold uppercase tracking-wider block">
                Tingkat Retensi Berlangganan
              </span>
              <div className="flex items-baseline gap-2 mt-1">
                <span className="text-2xl font-black text-white">96.4%</span>
                <span className="text-[10px] text-stone-400">Churn &lt; 4%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Notification Toast */}
      {notification && (
        <div
          className={`p-4 rounded-2xl border text-xs flex items-center justify-between gap-3 shadow-md transition-all ${
            notification.type === 'success'
              ? 'bg-emerald-50 text-emerald-950 border-emerald-300'
              : 'bg-red-50 text-red-950 border-red-300'
          }`}
        >
          <div className="flex items-center gap-2.5">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
            <span className="font-bold">{notification.message}</span>
          </div>
          <button
            onClick={() => setNotification(null)}
            className="text-stone-400 hover:text-stone-700 font-bold text-xs"
          >
            ✕
          </button>
        </div>
      )}

      {/* 2. Filter & Search Toolbar */}
      <div className="bg-white p-4 rounded-2xl border border-stone-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2.5 flex-1">
          {/* Search Box */}
          <div className="w-full sm:w-64 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Cari organisasi, PIC, paket..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 rounded-xl border border-stone-300 text-xs text-stone-900 focus:outline-hidden focus:border-amber-500"
            />
          </div>

          {/* Filter by Service */}
          <select
            value={selectedService}
            onChange={(e) => setSelectedService(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:outline-hidden focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Semua Service Pilar</option>
            <option value="admin_kelompok_tani">Kelompok Tani</option>
            <option value="gudang">Gudang &amp; QA</option>
            <option value="roaster">Roastery</option>
            <option value="cafe">Cafe &amp; Kedai</option>
            <option value="verifikator">Verifikator Mutu</option>
          </select>

          {/* Filter by Status */}
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-3 py-2 rounded-xl border border-stone-300 text-xs font-bold text-stone-800 focus:outline-hidden focus:border-amber-500 cursor-pointer"
          >
            <option value="all">Semua Status Langganan</option>
            <option value="active">🟢 Aktif</option>
            <option value="trial">🟡 Trial</option>
            <option value="past_due">🔴 Jatuh Tempo</option>
            <option value="suspended">⚪ Suspended</option>
          </select>
        </div>

        <div className="text-xs text-stone-500 font-medium">
          Menampilkan <strong>{filteredList.length}</strong> dari {subscriptions.length} entitas
        </div>
      </div>

      {/* 3. Subscribed Users Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">Organisasi &amp; PIC</th>
                <th className="py-3 px-4">Pilar Service</th>
                <th className="py-3 px-4">Paket &amp; Billing</th>
                <th className="py-3 px-4">Nilai Tagihan (MRR)</th>
                <th className="py-3 px-4">Utilisasi Kuota</th>
                <th className="py-3 px-4">Jatuh Tempo (Renewal)</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredList.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-10 text-center text-stone-400 text-xs">
                    Tidak ada pelanggan yang sesuai dengan filter.
                  </td>
                </tr>
              ) : (
                filteredList.map((sub) => {
                  const serviceMeta = SERVICE_BADGES[sub.serviceId];
                  const statusMeta = STATUS_PILLS[sub.status];
                  const Icon = serviceMeta.icon;
                  const seatPercent = Math.min(
                    100,
                    Math.round((sub.userSeatsUsed / (sub.userSeatsLimit || 1)) * 100)
                  );

                  return (
                    <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                      {/* 1. Organisasi & PIC */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-xs leading-tight">
                          {sub.organizationName}
                        </div>
                        <div className="text-[11px] text-stone-600 mt-0.5">{sub.picName}</div>
                        <div className="text-[10px] text-stone-400 font-mono">{sub.location}</div>
                      </td>

                      {/* 2. Pilar Service */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${serviceMeta.bg}`}
                        >
                          <Icon className="w-3.5 h-3.5" />
                          <span>{serviceMeta.label}</span>
                        </span>
                      </td>

                      {/* 3. Paket & Billing */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-900 text-xs">{sub.packageName}</div>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-stone-500">
                          <span className="capitalize font-mono">
                            {sub.billingCycle === 'yearly' ? '📅 Tahunan' : '🗓️ Bulanan'}
                          </span>
                          {sub.autoRenew && (
                            <span className="text-emerald-700 font-bold">• Auto-renew</span>
                          )}
                        </div>
                      </td>

                      {/* 4. Nilai Tagihan (MRR) */}
                      <td className="py-3.5 px-4">
                        <div className="font-black text-stone-900 text-xs">
                          Rp {sub.pricePerCycle.toLocaleString('id-ID')}
                        </div>
                        <div className="text-[10px] text-stone-400">
                          MRR: Rp {Math.round(sub.mrrContribution).toLocaleString('id-ID')}
                        </div>
                      </td>

                      {/* 5. Utilisasi Kuota */}
                      <td className="py-3.5 px-4 min-w-44">
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-[11px]">
                            <span className="text-stone-500">Seats Pengguna:</span>
                            <span className="font-bold text-stone-900">
                              {sub.userSeatsUsed} / {sub.userSeatsLimit}
                            </span>
                          </div>
                          <div className="w-full bg-stone-100 rounded-full h-1.5 overflow-hidden">
                            <div
                              className={`h-full rounded-full ${
                                seatPercent > 80 ? 'bg-orange-500' : 'bg-emerald-500'
                              }`}
                              style={{ width: `${seatPercent}%` }}
                            />
                          </div>
                          <div className="text-[10px] text-stone-400">
                            Lot Terbit: {sub.lotsQuotaUsed} lot
                          </div>
                        </div>
                      </td>

                      {/* 6. Jatuh Tempo (Renewal) */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-stone-800 text-xs font-mono">
                          {sub.renewalDate}
                        </div>
                        <div className="text-[10px] text-stone-400">Mulai: {sub.startDate}</div>
                      </td>

                      {/* 7. Status */}
                      <td className="py-3.5 px-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-bold border ${statusMeta.bg} ${statusMeta.text}`}
                        >
                          <span>{statusMeta.icon}</span>
                          <span>{statusMeta.label}</span>
                        </span>
                      </td>

                      {/* 8. Aksi */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(sub)}
                            className="p-1.5 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-700 transition-colors cursor-pointer"
                            title="Edit / Upgrade Paket"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleSendReminder(sub)}
                            className="p-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 transition-colors cursor-pointer"
                            title="Kirim Invoice / Reminder"
                          >
                            <Send className="w-3.5 h-3.5" />
                          </button>

                          <button
                            type="button"
                            onClick={() => handleToggleSuspend(sub)}
                            className={`p-1.5 rounded-lg transition-colors cursor-pointer ${
                              sub.status === 'suspended'
                                ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800'
                                : 'bg-red-50 hover:bg-red-100 text-red-700'
                            }`}
                            title={
                              sub.status === 'suspended' ? 'Aktifkan Akun' : 'Bekukan Akun (Suspend)'
                            }
                          >
                            {sub.status === 'suspended' ? (
                              <Unlock className="w-3.5 h-3.5" />
                            ) : (
                              <Lock className="w-3.5 h-3.5" />
                            )}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit / Upgrade Modal */}
      {editingSub && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-5 shadow-2xl border border-stone-200 animate-in fade-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between pb-3 border-b border-stone-100">
              <div>
                <h3 className="font-black text-base text-stone-900">
                  Kelola Langganan Organisasi
                </h3>
                <p className="text-xs text-stone-500">{editingSub.organizationName}</p>
              </div>
              <button
                type="button"
                onClick={() => setEditingSub(null)}
                className="text-stone-400 hover:text-stone-700 font-bold"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 mb-1">Status Langganan:</label>
                <select
                  value={editStatus}
                  onChange={(e) => setEditStatus(e.target.value as SubscriptionStatus)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-800"
                >
                  <option value="active">🟢 Aktif Berlangganan</option>
                  <option value="trial">🟡 Masa Trial (Gratis)</option>
                  <option value="past_due">🔴 Jatuh Tempo (Past Due)</option>
                  <option value="suspended">⚪ Dibekukan (Suspended)</option>
                  <option value="cancelled">✕ Dibatalkan (Cancelled)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">Billing Cycle:</label>
                <select
                  value={editBillingCycle}
                  onChange={(e) => setEditBillingCycle(e.target.value as BillingCycle)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-800"
                >
                  <option value="monthly">🗓️ Bulanan</option>
                  <option value="yearly">📅 Tahunan (Hemat Diskon)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Batas Alokasi User Seats:
                </label>
                <input
                  type="number"
                  min="1"
                  max="500"
                  value={editSeatsLimit}
                  onChange={(e) => setEditSeatsLimit(Number(e.target.value))}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-800"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 mb-1">
                  Tanggal Jatuh Tempo (Renewal Date):
                </label>
                <input
                  type="date"
                  value={editRenewalDate}
                  onChange={(e) => setEditRenewalDate(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 font-bold text-stone-800"
                />
              </div>

              <div className="pt-3 flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditingSub(null)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 text-stone-700 font-bold hover:bg-stone-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black shadow-sm"
                >
                  Simpan Perubahan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
