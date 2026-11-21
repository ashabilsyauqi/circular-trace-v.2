import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Sparkles,
  TreePine,
  QrCode,
  Recycle,
  Server,
  Database,
  ShieldCheck,
  TrendingUp,
  Receipt,
  FileCheck2,
  MapPin,
  CheckCircle2,
  Calendar,
} from 'lucide-react';
import {
  DEFAULT_ECOSYSTEM_TELEMETRY,
  DEFAULT_SAAS_INVOICES,
} from '../../../data/superAdminData';

export const EcosystemTelemetryPage: React.FC = () => {
  const telemetry = DEFAULT_ECOSYSTEM_TELEMETRY;
  const invoices = DEFAULT_SAAS_INVOICES;

  return (
    <div className="space-y-6 pb-16">
      {/* 1. Header Banner */}
      <div className="rounded-3xl bg-gradient-to-br from-[#0F172A] via-[#1E293B] to-[#0F172A] text-white p-6 sm:p-8 border border-cyan-900/40 shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -bottom-10 left-1/3 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-4">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-[11px] font-black tracking-wider uppercase bg-cyan-950 text-cyan-300 border border-cyan-800/60 shadow-2xs">
              Global Platform Telemetry
            </span>
            <span className="text-xs text-slate-400">
              Metrik Ekosistem, Dampak Sirkularitas &amp; Log Penagihan
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Telemetri Ekosistem &amp; Dampak Keberlanjutan
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 max-w-3xl mt-1 leading-relaxed">
              Ringkasan data analitik real-time seluruh rantai pasok kopi terintegrasi CircularTrace: volume ketertelusuran farm-to-cup, pemetaan deforestasi EUDR, dan sirkularitas limbah.
            </p>
          </div>

          {/* KPI Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Total Kopi Tertelusur
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-cyan-400">
                  {(telemetry.totalTracedVolumeKg / 1000).toFixed(1)}
                </span>
                <span className="text-xs text-slate-300">Ton Biji Kopi</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Farm-to-Cup QR Scans
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-emerald-400">
                  {telemetry.totalFarmToCupQrScans.toLocaleString('id-ID')}
                </span>
                <span className="text-xs text-slate-300">Konsumen</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Lahan Terpetakan EUDR
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-amber-400">
                  {telemetry.totalGeofencedHectares}
                </span>
                <span className="text-xs text-slate-300">Hektar Kebun</span>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-xs">
              <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">
                Limbah Terolah Sirkular
              </span>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="text-2xl font-black text-amber-400">
                  {(telemetry.totalCircularWasteDivertedKg / 1000).toFixed(1)}
                </span>
                <span className="text-xs text-slate-300">Ton Cascara/Kompos</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 2. Visual Impact Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Card 1: Volume Per Tahapan */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Layers className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">Distribusi Volume Rantai Pasok</h3>
              <p className="text-[11px] text-stone-500">Rekapitulasi fisik komoditas kopi</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-stone-700">1. Ceri Panen Petani:</span>
                <span className="font-black text-stone-900">
                  {(telemetry.totalCherryVolumeKg / 1000).toFixed(1)} Ton
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-amber-600 h-2 rounded-full" style={{ width: '57%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-stone-700">2. Green Bean Gudang:</span>
                <span className="font-black text-stone-900">
                  {(telemetry.totalGreenBeanVolumeKg / 1000).toFixed(1)} Ton
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-blue-600 h-2 rounded-full" style={{ width: '28%' }} />
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-1">
                <span className="font-bold text-stone-700">3. Roasted Bean Sangrai:</span>
                <span className="font-black text-stone-900">
                  {(telemetry.totalRoastedBeanVolumeKg / 1000).toFixed(1)} Ton
                </span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-2">
                <div className="bg-orange-600 h-2 rounded-full" style={{ width: '15%' }} />
              </div>
            </div>
          </div>
        </div>

        {/* Card 2: EUDR & Deforestasi */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold">
              <TreePine className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">Kepatuhan Geofencing EUDR</h3>
              <p className="text-[11px] text-stone-500">Regulasi Anti-Deforestasi Uni Eropa</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-emerald-50 border border-emerald-200 text-emerald-950 flex items-center justify-between">
              <span className="font-bold">Tingkat Kepatuhan EUDR:</span>
              <span className="font-black text-base text-emerald-800">
                {telemetry.eudrComplianceRatePercent}%
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Kebun Kopi Terpetakan:</span>
              <span className="font-bold text-stone-900">{telemetry.totalGeofencedFarmsCount} Kebun</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Total Luas Lahan Poligon:</span>
              <span className="font-bold text-stone-900">{telemetry.totalGeofencedHectares} Ha</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500">Status Deforestasi Cut-off:</span>
              <span className="font-bold text-emerald-700">✓ Zero Deforestation Post-2020</span>
            </div>
          </div>
        </div>

        {/* Card 3: Sirkularitas & Infrastruktur */}
        <div className="bg-white p-6 rounded-3xl border border-stone-200 shadow-sm space-y-4">
          <div className="flex items-center gap-3 pb-3 border-b border-stone-100">
            <div className="w-10 h-10 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center font-bold">
              <Recycle className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">Sirkularitas &amp; Infrastruktur</h3>
              <p className="text-[11px] text-stone-500">Circular Trace Index &amp; Uptime</p>
            </div>
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 rounded-2xl bg-amber-50 border border-amber-200 text-amber-950 flex items-center justify-between">
              <span className="font-bold">Indeks Sirkularitas CT:</span>
              <span className="font-black text-base text-amber-900">
                {telemetry.circularityScoreAverage} / 100
              </span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Uptime Server &amp; API:</span>
              <span className="font-bold text-emerald-700">{telemetry.serverUptimePercent}%</span>
            </div>

            <div className="flex items-center justify-between py-1 border-b border-stone-100">
              <span className="text-stone-500">Total Akun Terdaftar:</span>
              <span className="font-bold text-stone-900">{telemetry.activePlatformUsers} User</span>
            </div>

            <div className="flex items-center justify-between py-1">
              <span className="text-stone-500">Database Engine:</span>
              <span className="font-bold text-stone-900 font-mono">SQLite (Encrypted)</span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. Invoices History Table */}
      <div className="bg-white rounded-3xl border border-stone-200 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-stone-100 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-stone-100 text-stone-800 flex items-center justify-center font-bold">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-black text-sm text-stone-900">
                Riwayat Penagihan &amp; Invoice SaaS Terbaru
              </h3>
              <p className="text-[11px] text-stone-500">
                Log penerbitan invoice perpanjangan lisensi komersial
              </p>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-stone-50 border-b border-stone-200 text-stone-600 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-3 px-4">No. Invoice</th>
                <th className="py-3 px-4">Organisasi Pelanggan</th>
                <th className="py-3 px-4">Deskripsi Paket</th>
                <th className="py-3 px-4">Nominal Tagihan</th>
                <th className="py-3 px-4">Tgl Terbit / Jatuh Tempo</th>
                <th className="py-3 px-4">Status &amp; Metode</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {invoices.map((inv) => (
                <tr key={inv.id} className="hover:bg-stone-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-amber-900 text-xs">
                    {inv.invoiceNumber}
                  </td>
                  <td className="py-3.5 px-4 font-bold text-stone-900">{inv.organizationName}</td>
                  <td className="py-3.5 px-4 text-stone-600">{inv.packageName}</td>
                  <td className="py-3.5 px-4 font-black text-stone-900 text-xs">
                    Rp {inv.amount.toLocaleString('id-ID')}
                  </td>
                  <td className="py-3.5 px-4 text-stone-500 font-mono text-[11px]">
                    <div>Terbit: {inv.issueDate}</div>
                    <div className="text-[10px] text-stone-400">Tempo: {inv.dueDate}</div>
                  </td>
                  <td className="py-3.5 px-4">
                    <div className="flex items-center gap-2">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          inv.status === 'paid'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {inv.status === 'paid' ? '🟢 Lunas' : '🟡 Menunggu'}
                      </span>
                      <span className="text-[10px] text-stone-400">{inv.paymentMethod}</span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
