import React, { useState } from 'react';
import { useCoffee } from '../../context/CoffeeContext';
import { SUBSCRIPTION_PLANS } from '../../data/mockSubscriptions';
import { UserSubscription, SubscriptionTierId, SubscriptionStatus } from '../../types/subscription';
import {
  CreditCard,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Clock,
  AlertTriangle,
  UserCheck,
  Plus,
  RefreshCw,
  Download,
  Zap,
  TrendingUp,
  DollarSign,
  Users,
  ShieldCheck,
  ChevronRight,
  Receipt,
} from 'lucide-react';

export const SuperAdminSubscriptionsTab: React.FC = () => {
  const {
    subscriptions,
    users,
    extendSubscription,
    updateSubscriptionTier,
    cancelOrSuspendSubscription,
    subscribeUser,
  } = useCoffee();

  const [searchQuery, setSearchQuery] = useState('');
  const [tierFilter, setTierFilter] = useState<string>('all');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Modal: Add Manual Subscription
  const [manualModalOpen, setManualModalOpen] = useState(false);
  const [manualUserId, setManualUserId] = useState(users[0]?.id || '');
  const [manualTier, setManualTier] = useState<SubscriptionTierId>('3_months');
  const [manualCycle, setManualCycle] = useState<'monthly' | 'yearly'>('monthly');

  // Calculate MRR (Monthly Recurring Revenue)
  const totalMRR = subscriptions.reduce((acc, sub) => {
    if (sub.status === 'expired') return acc;
    const plan = SUBSCRIPTION_PLANS.find((p) => p.id === sub.tierId);
    return acc + (plan?.pricePerMonth || 0);
  }, 0);

  const activeCount = subscriptions.filter((s) => s.status === 'active' || s.status === 'trial').length;
  const expiringSoonCount = subscriptions.filter((s) => s.status === 'expiring_soon').length;

  const filteredSubs = subscriptions.filter((sub) => {
    if (tierFilter !== 'all' && sub.tierId !== tierFilter) return false;
    if (statusFilter !== 'all' && sub.status !== statusFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = sub.userName.toLowerCase().includes(q);
      const matchOrg = sub.organization.toLowerCase().includes(q);
      const matchEmail = sub.userEmail.toLowerCase().includes(q);
      const matchTier = sub.tierName.toLowerCase().includes(q);
      if (!matchName && !matchOrg && !matchEmail && !matchTier) return false;
    }
    return true;
  });

  const handleExtend = (subId: string, days: number) => {
    const res = extendSubscription(subId, days);
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleSuspend = (subId: string) => {
    const res = cancelOrSuspendSubscription(subId);
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleManualSubscribeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const res = subscribeUser({
      userId: manualUserId,
      tierId: manualTier,
      billingCycle: manualCycle,
      paymentMethod: 'bank_transfer',
    });
    setActionNotice(res.message);
    setManualModalOpen(false);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6">
      {/* Toast Notice */}
      {actionNotice && (
        <div className="p-4 rounded-2xl bg-emerald-50 border border-emerald-300 text-emerald-950 font-bold text-xs flex items-center justify-between shadow-xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>{actionNotice}</span>
          </div>
          <button onClick={() => setActionNotice(null)} className="underline cursor-pointer">
            Tutup
          </button>
        </div>
      )}

      {/* KPI METRIC CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-black">
            <DollarSign className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              MRR (Pendapatan Bulanan)
            </span>
            <span className="text-xl font-black text-stone-900">Rp {totalMRR.toLocaleString()}</span>
            <span className="text-[10px] text-emerald-600 block font-bold">+18.5% dari bulan lalu</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-700 flex items-center justify-center font-black">
            <Users className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Pelanggan Aktif
            </span>
            <span className="text-xl font-black text-stone-900">{activeCount} Tenant</span>
            <span className="text-[10px] text-stone-500 block">Dari total {subscriptions.length} langganan</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-black">
            <Clock className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Jatuh Tempo (H-7)
            </span>
            <span className="text-xl font-black text-amber-600">{expiringSoonCount} Akun</span>
            <span className="text-[10px] text-amber-700 block font-semibold">Perlu notifikasi perpanjangan</span>
          </div>
        </div>

        <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center font-black">
            <TrendingUp className="w-6 h-6" />
          </div>
          <div>
            <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider block">
              Paket Terfavorit
            </span>
            <span className="text-sm font-black text-stone-900">Kelompok Tani &amp; Mill</span>
            <span className="text-[10px] text-purple-700 block font-semibold">Sentra Kopi Terbanyak</span>
          </div>
        </div>
      </div>

      {/* FILTER & SEARCH TOOLBAR */}
      <div className="bg-white p-5 rounded-3xl border border-stone-200/80 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari tenant, nama PIC, email, atau paket..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs focus:ring-2 focus:ring-amber-500 bg-white"
            />
          </div>

          <button
            type="button"
            onClick={() => setManualModalOpen(true)}
            className="px-4 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs transition-all cursor-pointer shadow-xs flex items-center justify-center gap-2 whitespace-nowrap"
          >
            <Plus className="w-4 h-4" />
            <span>+ Berikan Langganan Manual</span>
          </button>
        </div>

        {/* Filter Chips */}
        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 text-xs">
          <span className="font-bold text-stone-500 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Filter Paket:
          </span>
          {[
            { id: 'all', label: 'Semua Paket' },
            { id: '1_month', label: 'Bundle 1 Bulan' },
            { id: '3_months', label: 'Bundle 3 Bulan (Musim Panen)' },
            { id: '6_months', label: 'Bundle 6 Bulan (Semester)' },
            { id: '1_year', label: 'Bundle 1 Tahun (Best Value)' },
          ].map((f) => (
            <button
              key={f.id}
              onClick={() => setTierFilter(f.id)}
              className={`px-3 py-1 rounded-lg font-medium transition-all cursor-pointer ${
                tierFilter === f.id
                  ? 'bg-amber-500 text-stone-950 font-black'
                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      {/* SUBSCRIBERS TABLE */}
      <div className="bg-white rounded-3xl border border-stone-200/80 shadow-xs overflow-hidden">
        <div className="p-5 border-b border-stone-200 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-stone-900">
              Daftar Langganan Aktif Tenant &amp; Kelompok Tani ({filteredSubs.length})
            </h3>
            <p className="text-xs text-stone-500">
              Pantau masa aktif, tanggal mulai, tenggat waktu (due date), dan kelola hak akses paket.
            </p>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-xs text-left">
            <thead className="bg-stone-50 text-stone-600 uppercase tracking-wider font-bold border-b border-stone-200">
              <tr>
                <th className="px-4 py-3.5">Tenant / Pelanggan</th>
                <th className="px-4 py-3.5">Paket Layanan</th>
                <th className="px-4 py-3.5">Tgl Mulai</th>
                <th className="px-4 py-3.5">Tenggat Waktu</th>
                <th className="px-4 py-3.5">Sisa Hari</th>
                <th className="px-4 py-3.5">Biaya Sewa</th>
                <th className="px-4 py-3.5">Status</th>
                <th className="px-4 py-3.5 text-right">Aksi Admin</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-200">
              {filteredSubs.map((sub) => {
                const plan = SUBSCRIPTION_PLANS.find((p) => p.id === sub.tierId);

                return (
                  <tr key={sub.id} className="hover:bg-stone-50/80 transition-colors">
                    {/* Tenant Info */}
                    <td className="px-4 py-3.5">
                      <div className="font-bold text-stone-900">{sub.organization}</div>
                      <div className="text-[11px] text-stone-500">
                        {sub.userName} • {sub.userEmail}
                      </div>
                      {sub.location && <div className="text-[10px] text-stone-400">{sub.location}</div>}
                    </td>

                    {/* Tier Plan */}
                    <td className="px-4 py-3.5">
                      <span className="font-bold text-stone-900 block">{sub.tierName}</span>
                      <span className="text-[10px] uppercase font-mono text-stone-500">
                        {sub.billingCycle === 'yearly' ? 'Tahunan' : 'Bulanan'}
                      </span>
                    </td>

                    {/* Start Date */}
                    <td className="px-4 py-3.5 font-mono text-stone-600">{sub.startDate}</td>

                    {/* Expiry Date (Tenggat) */}
                    <td className="px-4 py-3.5 font-mono font-bold text-stone-900">{sub.expiryDate}</td>

                    {/* Days Remaining */}
                    <td className="px-4 py-3.5 font-bold">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-black ${
                          sub.daysRemaining > 14
                            ? 'bg-emerald-100 text-emerald-950'
                            : sub.daysRemaining > 0
                            ? 'bg-amber-100 text-amber-950 animate-pulse'
                            : 'bg-rose-100 text-rose-950'
                        }`}
                      >
                        {sub.daysRemaining > 0 ? `${sub.daysRemaining} Hari` : 'Expired'}
                      </span>
                    </td>

                    {/* Price Paid */}
                    <td className="px-4 py-3.5 font-mono font-bold text-stone-900">
                      Rp {sub.pricePaid.toLocaleString()}
                      <span className="block text-[10px] uppercase font-mono text-stone-500 font-normal">
                        via {sub.paymentMethod}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="px-4 py-3.5">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${
                          sub.status === 'active'
                            ? 'bg-emerald-100 text-emerald-950 border border-emerald-300'
                            : sub.status === 'expiring_soon'
                            ? 'bg-amber-100 text-amber-950 border border-amber-300'
                            : sub.status === 'trial'
                            ? 'bg-blue-100 text-blue-950 border border-blue-300'
                            : 'bg-rose-100 text-rose-950 border border-rose-300'
                        }`}
                      >
                        {sub.status}
                      </span>
                    </td>

                    {/* Admin Actions */}
                    <td className="px-4 py-3.5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => handleExtend(sub.id, 30)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-50 hover:bg-emerald-100 text-emerald-900 border border-emerald-300 font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap"
                          title="Perpanjang +30 Hari"
                        >
                          +30 Hari
                        </button>
                        <button
                          type="button"
                          onClick={() => handleExtend(sub.id, 365)}
                          className="px-2 py-1 rounded-lg bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 font-bold text-[11px] transition-all cursor-pointer whitespace-nowrap"
                          title="Perpanjang +1 Tahun"
                        >
                          +1 Thn
                        </button>
                        <button
                          type="button"
                          onClick={() => handleSuspend(sub.id)}
                          className="px-2 py-1 rounded-lg bg-stone-100 hover:bg-rose-100 text-stone-700 hover:text-rose-900 border border-stone-200 text-[11px] transition-all cursor-pointer"
                          title="Suspend / Toggle Status"
                        >
                          Suspend
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

      {/* MODAL: ADD MANUAL SUBSCRIPTION */}
      {manualModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl animate-in fade-in">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-900">Beri Langganan Manual (Super Admin)</h3>
              <button
                onClick={() => setManualModalOpen(false)}
                className="w-7 h-7 rounded-full bg-stone-100 flex items-center justify-center font-bold text-stone-500 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleManualSubscribeSubmit} className="space-y-4 text-xs">
              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Pilih Pengguna / Mitra</label>
                <select
                  value={manualUserId}
                  onChange={(e) => setManualUserId(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  {users.map((u) => (
                    <option key={u.id} value={u.id}>
                      {u.name} ({u.organization}) - {u.role}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Paket Layanan</label>
                <select
                  value={manualTier}
                  onChange={(e) => setManualTier(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  {SUBSCRIPTION_PLANS.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.name} - Rp {p.pricePerMonth.toLocaleString()}/bln
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-stone-700 uppercase mb-1">Siklus</label>
                <select
                  value={manualCycle}
                  onChange={(e) => setManualCycle(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 bg-white"
                >
                  <option value="monthly">Bulanan (30 Hari)</option>
                  <option value="yearly">Tahunan (365 Hari)</option>
                </select>
              </div>

              <div className="pt-2 flex gap-2">
                <button
                  type="button"
                  onClick={() => setManualModalOpen(false)}
                  className="flex-1 py-2.5 rounded-xl border border-stone-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-stone-950 font-black cursor-pointer shadow-xs"
                >
                  Simpan &amp; Aktifkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
