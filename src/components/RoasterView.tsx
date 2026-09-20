import React, { useState } from 'react';
import { useCoffee } from '../context/CoffeeContext';
import {
  Flame,
  ShoppingCart,
  Layers,
  History,
  CheckCircle2,
  TrendingUp,
  Award,
  Sparkles,
  X,
  Coffee,
  Crown,
  ShieldCheck,
  Filter,
  Search,
  Sliders,
  Calendar,
} from 'lucide-react';
import { WarehouseLot, RoastedBeanLot, WarehouseGradeTier } from '../types/coffee';
import { TraceabilityModal } from './TraceabilityModal';
import { CoffeeSensorySpiderChart } from './CoffeeSensorySpiderChart';
import { MetricCard } from './admin/MetricCard';

export const RoasterView: React.FC = () => {
  const {
    currentUser,
    warehouseLots,
    roastedLots,
    buyWarehouseBeanAndRoast,
    transactions,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'catalog' | 'marketplace' | 'history'>('catalog');
  const [selectedWarehouseLot, setSelectedWarehouseLot] = useState<WarehouseLot | null>(null);
  const [traceModalLot, setTraceModalLot] = useState<RoastedBeanLot | null>(null);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | WarehouseGradeTier>('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Form state for Roasting Lab
  const [boughtGreenBeanKg, setBoughtGreenBeanKg] = useState<number>(20);
  const [roasterMachine, setRoasterMachine] = useState('Giesen W6A Artisan');
  const [roastLevel, setRoastLevel] = useState<RoastedBeanLot['roastLevel']>('Light-Medium');
  const [agtronNumber, setAgtronNumber] = useState<number>(68);
  const [developmentTimeRatio, setDevelopmentTimeRatio] = useState<number>(14.5);
  const [scaCuppingScore, setScaCuppingScore] = useState<number>(87.5);
  const [packageWeightGrams, setPackageWeightGrams] = useState<number>(250);
  const [totalPacks, setTotalPacks] = useState<number>(68);
  const [pricePerPack, setPricePerPack] = useState<number>(95000);
  const [restingDays, setRestingDays] = useState<number>(10);
  const [recommendedBrew, setRecommendedBrew] = useState<string[]>([
    'V60 Ceramic',
    'Aeropress',
    'Origami Dripper',
  ]);
  const [tastingNoteInput, setTastingNoteInput] = useState('');
  const [tastingNotes, setTastingNotes] = useState<string[]>([
    'Jasmine Floral',
    'Peach',
    'Cane Sugar',
  ]);
  const [successMsg, setSuccessMsg] = useState('');

  // Data
  const availableWarehouseLots = warehouseLots.filter((lot) => lot.availableWeightKg > 0);
  const myRoastedLots = roastedLots.filter(
    (lot) => lot.roasterId === currentUser?.id || true
  );

  const myRoasterTransactions = transactions.filter(
    (t) =>
      t.fromName === currentUser?.name ||
      t.toName === currentUser?.name ||
      t.fromRole === 'roaster' ||
      t.toRole === 'roaster'
  );

  const totalRoastedPacks = myRoastedLots.reduce((acc, curr) => acc + curr.totalPacks, 0);
  const availablePacks = myRoastedLots.reduce((acc, curr) => acc + curr.availablePacks, 0);

  const handleOpenRoastingModal = (lot: WarehouseLot) => {
    setSelectedWarehouseLot(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 20);
    setBoughtGreenBeanKg(defaultBuy);
    const roastedKg = defaultBuy * 0.85;
    setTotalPacks(Math.floor((roastedKg * 1000) / 250));
    setScaCuppingScore(Number((lot.verifiedScaScore + 0.5).toFixed(2)));
  };

  const handleAddTastingNote = () => {
    if (tastingNoteInput.trim() && !tastingNotes.includes(tastingNoteInput.trim())) {
      setTastingNotes([...tastingNotes, tastingNoteInput.trim()]);
      setTastingNoteInput('');
    }
  };

  const handleRemoveTastingNote = (note: string) => {
    setTastingNotes(tastingNotes.filter((n) => n !== note));
  };

  const handleConfirmRoast = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedWarehouseLot) return;

    buyWarehouseBeanAndRoast(selectedWarehouseLot.id, boughtGreenBeanKg, {
      roasterMachine,
      roastLevel,
      agtronNumber: Number(agtronNumber),
      developmentTimeRatio: Number(developmentTimeRatio),
      tastingNotes: tastingNotes.length > 0 ? tastingNotes : ['Balanced Sweetness', 'Clean Finish'],
      scaCuppingScore: Number(scaCuppingScore),
      packageWeightGrams: Number(packageWeightGrams),
      totalPacks: Number(totalPacks),
      pricePerPack: Number(pricePerPack),
      restingRecommendationDays: Number(restingDays),
      recommendedBrew,
    });

    setSuccessMsg(
      `Sukses menyangrai ${boughtGreenBeanKg} kg green bean menjadi ${totalPacks} pack Roasted Beans (${roastLevel})! Siap dipesan oleh Pemilik Cafe.`
    );
    setSelectedWarehouseLot(null);
    setActiveTab('catalog');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  const filteredRoastedLots = myRoastedLots.filter((bean) => {
    const q = searchQuery.toLowerCase();
    return (
      bean.id.toLowerCase().includes(q) ||
      bean.variety.toLowerCase().includes(q) ||
      bean.origin.toLowerCase().includes(q) ||
      bean.roastLevel.toLowerCase().includes(q)
    );
  });

  return (
    <div className="space-y-6">
      {/* Top Banner Hero (Cruip Orange / Slate Gradient) */}
      <div className="bg-linear-to-r from-orange-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden border border-orange-900/60">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-3 border border-orange-400/30 backdrop-blur-xs">
            <Flame className="w-4 h-4 text-orange-400" />
            <span>Roasting Tier 4 • Artisan Roastery Lab</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Roasting Lab & Profiling Sensory Biji Sangrai
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Pilih green bean bersertifikat dari gudang, tentukan kurva sangrai (Agtron tile, DTR %, Roast level), evaluasi cita rasa radar SCA, dan distribusikan biji kopi siap seduh ke coffee shop mitra.
          </p>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Flame className="w-48 h-48" />
        </div>
      </div>

      {/* 4 Cruip-Style Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Green Bean di Gudang"
          value={`${availableWarehouseLots.reduce((a, b) => a + b.availableWeightKg, 0).toLocaleString()} kg`}
          subtitle="Bahan baku siap sangrai"
          icon={<ShoppingCart className="w-5 h-5 text-blue-600" />}
          color="blue"
          badge="Silo QA"
        />

        <MetricCard
          title="Total Pack Diproduksi"
          value={`${totalRoastedPacks.toLocaleString()} Pack`}
          subtitle="Biji sangrai artisan"
          icon={<Layers className="w-5 h-5 text-orange-600" />}
          color="orange"
          trend={{ value: '+21.5%', isPositive: true, label: 'MoM' }}
        />

        <MetricCard
          title="Pack Siap Kirim Cafe"
          value={`${availablePacks.toLocaleString()} Pack`}
          subtitle="Tersedia di Roastery"
          icon={<CheckCircle2 className="w-5 h-5 text-emerald-600" />}
          color="emerald"
          badge="Stok Ritel"
        />

        <MetricCard
          title="Log Transaksi Roastery"
          value={`${myRoasterTransactions.length} Log`}
          subtitle="Beli green bean & jual ke cafe"
          icon={<TrendingUp className="w-5 h-5 text-purple-600" />}
          color="purple"
          trend={{ value: '100% Selesai', isPositive: true }}
        />
      </div>

      {/* Cruip Styled Navigation Tabs */}
      <div className="bg-white p-1.5 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center gap-1.5">
        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <Coffee className="w-4 h-4 text-orange-400" />
          <span>Katalog Roasted Beans Saya</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-orange-500/20 text-orange-300">
            {myRoastedLots.length}
          </span>
        </button>

        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'marketplace'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          <span>Beli Green Bean Gudang</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
            {availableWarehouseLots.length} Lot
          </span>
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-2.5 px-4 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'bg-stone-900 text-white shadow-xs font-black'
              : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
          }`}
        >
          <History className="w-4 h-4" />
          <span>Log Transaksi Roastery</span>
          <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-stone-100 text-stone-700">
            {myRoasterTransactions.length}
          </span>
        </button>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-orange-50 border border-orange-300 text-orange-950 text-xs font-bold flex items-center justify-between shadow-2xs">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-orange-700" />
            <span>{successMsg}</span>
          </div>
          <button
            onClick={() => setSuccessMsg('')}
            className="text-stone-400 hover:text-stone-700 text-xs font-bold"
          >
            Tutup
          </button>
        </div>
      )}

      {/* TAB 1: KATALOG ROASTED BEANS SAYA */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded-2xl border border-stone-200/90 shadow-2xs flex flex-wrap items-center justify-between gap-3">
            <div className="relative flex-1 min-w-[240px]">
              <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Cari roasted bean, varietas, origin, atau profil sangrai..."
                className="w-full pl-10 pr-4 py-2 rounded-xl border border-stone-200 text-xs focus:ring-2 focus:ring-orange-500 focus:outline-hidden"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {filteredRoastedLots.map((bean) => (
              <div
                key={bean.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-stone-900 overflow-hidden">
                    <img
                      src={bean.photoUrl}
                      alt={bean.variety}
                      className="w-full h-full object-cover opacity-85"
                    />
                    <div className="absolute top-3 left-3 bg-black/70 backdrop-blur-xs text-white text-[11px] font-mono px-2.5 py-0.5 rounded-md">
                      {bean.id}
                    </div>
                    <div className="absolute top-3 right-3 bg-orange-600 text-white text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full shadow-xs">
                      {bean.roastLevel}
                    </div>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-orange-900 bg-orange-100 px-2 py-0.5 rounded-full">
                          {bean.roasterMachine}
                        </span>
                        <span className="inline-flex items-center gap-1 text-xs font-black text-amber-700">
                          <Award className="w-3.5 h-3.5" />
                          SCA: {bean.scaCuppingScore}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-stone-900 mt-1.5">
                        {bean.origin} - {bean.variety}
                      </h3>
                      <p className="text-xs text-stone-500">
                        Proses: {bean.processMethod} • Agtron #{bean.agtronNumber} (DTR {bean.developmentTimeRatio}%)
                      </p>
                    </div>

                    {/* Tasting notes */}
                    <div>
                      <span className="text-[10px] font-bold text-stone-400 block mb-1">
                        Tasting Notes:
                      </span>
                      <div className="flex flex-wrap gap-1">
                        {bean.tastingNotes.map((note, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-amber-50 text-amber-900 border border-amber-200"
                          >
                            {note}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="text-[11px] text-stone-500 py-1.5 border-t border-stone-100 flex items-center justify-between">
                      <span>Kemasan: {bean.packageWeightGrams}g</span>
                      <span>Rest: min {bean.restingRecommendationDays} hari</span>
                    </div>

                    <button
                      onClick={() => setTraceModalLot(bean)}
                      className="w-full py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold transition-colors flex items-center justify-center gap-1.5 border border-stone-300"
                    >
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Silsilah Traceability (Farm-to-Cup)
                    </button>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Harga ke Cafe:</span>
                    <span className="text-sm font-black text-stone-900">
                      Rp {bean.pricePerPack.toLocaleString()}
                      <span className="text-xs font-normal text-stone-500"> / pack</span>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] text-stone-400 block">Stok Tersedia:</span>
                    <span className="text-xs font-bold text-orange-700">
                      {bean.availablePacks} / {bean.totalPacks} Pack
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 2: MARKETPLACE GREEN BEAN GUDANG */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pilih Green Bean Bersertifikasi Grade Gudang untuk Disangrai
              </h2>
              <p className="text-xs text-stone-500">
                Pilih berdasarkan grade mutu, verified SCA score, dan target pasar sangrai.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {availableWarehouseLots.map((lot) => (
              <div
                key={lot.id}
                className="bg-white rounded-2xl border border-stone-200/90 overflow-hidden shadow-2xs hover:shadow-md transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="p-4 bg-stone-50 border-b border-stone-100 flex items-center justify-between">
                    <span className="font-mono text-xs font-bold text-stone-700 bg-stone-200 px-2 py-0.5 rounded">
                      {lot.id}
                    </span>
                    <span className="text-xs font-black bg-stone-900 text-amber-400 px-2.5 py-0.5 rounded-lg">
                      SCA: {lot.verifiedScaScore}
                    </span>
                  </div>

                  <div className="p-5 space-y-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-blue-900 bg-blue-100 px-2 py-0.5 rounded-md">
                        {lot.gradeTier || 'Grade 1'}
                      </span>
                      <h3 className="font-bold text-base text-stone-900 mt-1">{lot.variety}</h3>
                      <p className="text-xs text-stone-500">{lot.origin} • {lot.processMethod}</p>
                    </div>

                    <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">Defect:</span>
                        <strong className="text-stone-800">{lot.defectCount} defect/350g</strong>
                      </div>
                      <div>
                        <span className="text-[10px] text-stone-400 block font-semibold">Screen:</span>
                        <strong className="text-stone-800 truncate block">{lot.screenSize}</strong>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                  <div>
                    <span className="text-[10px] text-stone-400 block">Harga Green Bean:</span>
                    <span className="text-sm font-black text-stone-900">
                      Rp {lot.pricePerKg.toLocaleString()} / kg
                    </span>
                  </div>

                  <button
                    onClick={() => handleOpenRoastingModal(lot)}
                    className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs transition-colors shadow-2xs flex items-center gap-1.5"
                  >
                    <Flame className="w-3.5 h-3.5" />
                    Beli & Sangrai
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: LOG TRANSAKSI */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200/90 shadow-2xs space-y-4">
          <h2 className="text-base font-bold text-stone-900 flex items-center gap-2">
            <History className="w-5 h-5 text-orange-600" />
            Log Transaksi Roastery
          </h2>
          <div className="overflow-x-auto rounded-xl border border-stone-200">
            <table className="w-full text-left text-xs">
              <thead className="bg-stone-50 text-stone-600 font-bold border-b border-stone-200 uppercase tracking-wider">
                <tr>
                  <th className="py-3 px-4">No. TRX</th>
                  <th className="py-3 px-4">Tanggal</th>
                  <th className="py-3 px-4">Pengirim</th>
                  <th className="py-3 px-4">Penerima</th>
                  <th className="py-3 px-4">Barang</th>
                  <th className="py-3 px-4">Volume</th>
                  <th className="py-3 px-4">Total Nilai</th>
                  <th className="py-3 px-4">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-stone-100">
                {myRoasterTransactions.map((trx) => (
                  <tr key={trx.id} className="hover:bg-stone-50/70 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-stone-800">{trx.id}</td>
                    <td className="py-3 px-4 text-stone-600">{trx.date}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{trx.fromName}</td>
                    <td className="py-3 px-4 font-semibold text-stone-900">{trx.toName}</td>
                    <td className="py-3 px-4 text-stone-700">{trx.itemName}</td>
                    <td className="py-3 px-4 font-bold text-orange-800">{trx.quantity}</td>
                    <td className="py-3 px-4 font-black text-stone-900">
                      Rp {trx.totalAmount.toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className="px-2.5 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                        {trx.status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Roasting Workstation */}
      {selectedWarehouseLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/75 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
          <div className="relative bg-white rounded-3xl max-w-3xl w-full shadow-2xl border border-stone-200 overflow-hidden my-8">
            <div className="bg-linear-to-r from-orange-950 to-stone-900 text-white p-6 relative">
              <button
                onClick={() => setSelectedWarehouseLot(null)}
                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-white transition-colors"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="inline-flex items-center gap-1.5 bg-orange-500/20 text-orange-300 border border-orange-500/30 px-3 py-1 rounded-full text-xs font-semibold mb-2">
                <Flame className="w-3.5 h-3.5" />
                Workstation Penyangraian Biji Kopi (Roasting Lab)
              </div>
              <h2 className="text-xl sm:text-2xl font-black">
                Sangrai Batch: {selectedWarehouseLot.variety} ({selectedWarehouseLot.origin})
              </h2>
            </div>

            <form onSubmit={handleConfirmRoast} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto text-xs">
              {/* Pembelian */}
              <div className="bg-orange-50/80 border border-orange-200 rounded-2xl p-4 space-y-3">
                <h3 className="font-bold text-orange-900 uppercase">1. Pengadaan Green Bean Gudang</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-stone-700 font-semibold mb-1">
                      Beli Green Bean (kg) - Maks: {selectedWarehouseLot.availableWeightKg} kg
                    </label>
                    <input
                      type="number"
                      required
                      min="5"
                      max={selectedWarehouseLot.availableWeightKg}
                      value={boughtGreenBeanKg}
                      onChange={(e) => {
                        const val = Number(e.target.value);
                        setBoughtGreenBeanKg(val);
                        const roastedKg = val * 0.85;
                        setTotalPacks(Math.floor((roastedKg * 1000) / packageWeightGrams));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-stone-500">Biaya Pembelian Green Bean:</span>
                    <strong className="text-base font-black text-orange-900">
                      Rp {(boughtGreenBeanKg * selectedWarehouseLot.pricePerKg).toLocaleString()}
                    </strong>
                  </div>
                </div>
              </div>

              {/* Roasting Profiling */}
              <div>
                <h3 className="font-bold text-stone-800 uppercase mb-3">2. Parameter Roasting Artisan</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Mesin Roaster</label>
                    <input
                      type="text"
                      required
                      value={roasterMachine}
                      onChange={(e) => setRoasterMachine(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Profil Sangrai</label>
                    <select
                      value={roastLevel}
                      onChange={(e) => setRoastLevel(e.target.value as any)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                    >
                      <option value="Light Roast">Light Roast (Filter)</option>
                      <option value="Light-Medium">Light-Medium Roast</option>
                      <option value="Medium Roast">Medium Roast (Omni)</option>
                      <option value="Medium-Dark">Medium-Dark Roast</option>
                      <option value="Dark Roast">Dark Roast (Bold)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Warna Agtron (#)</label>
                    <input
                      type="number"
                      required
                      value={agtronNumber}
                      onChange={(e) => setAgtronNumber(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                </div>
              </div>

              {/* Packaging & Pricing */}
              <div>
                <h3 className="font-bold text-stone-800 uppercase mb-3">3. Kemasan Pack & Harga ke Cafe</h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Ukuran Kemasan</label>
                    <select
                      value={packageWeightGrams}
                      onChange={(e) => {
                        const g = Number(e.target.value);
                        setPackageWeightGrams(g);
                        const roastedKg = boughtGreenBeanKg * 0.85;
                        setTotalPacks(Math.floor((roastedKg * 1000) / g));
                      }}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm bg-white"
                    >
                      <option value="200">200g</option>
                      <option value="250">250g (Ritel)</option>
                      <option value="500">500g</option>
                      <option value="1000">1000g (1kg Cafe)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Hasil Pack (Estimasi)</label>
                    <input
                      type="number"
                      required
                      value={totalPacks}
                      onChange={(e) => setTotalPacks(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block font-bold text-stone-700 mb-1">Harga per Pack (Rp)</label>
                    <input
                      type="number"
                      required
                      value={pricePerPack}
                      onChange={(e) => setPricePerPack(Number(e.target.value))}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-sm font-black"
                    />
                  </div>
                </div>
              </div>

              <div className="pt-2 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setSelectedWarehouseLot(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 font-bold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold"
                >
                  Konfirmasi Roasting & Terbitkan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Traceability Modal */}
      <TraceabilityModal
        isOpen={!!traceModalLot}
        onClose={() => setTraceModalLot(null)}
        data={traceModalLot}
      />
    </div>
  );
};
