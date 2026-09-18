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
} from 'lucide-react';
import { WarehouseLot, RoastedBeanLot, WarehouseGradeTier } from '../types/coffee';
import { TraceabilityModal } from './TraceabilityModal';

export const RoasterView: React.FC = () => {
  const {
    currentUser,
    warehouseLots,
    roastedLots,
    buyWarehouseBeanAndRoast,
    transactions,
  } = useCoffee();

  const [activeTab, setActiveTab] = useState<'marketplace' | 'catalog' | 'history'>('marketplace');
  const [selectedWarehouseLot, setSelectedWarehouseLot] = useState<WarehouseLot | null>(null);
  const [traceModalLot, setTraceModalLot] = useState<RoastedBeanLot | null>(null);
  const [selectedGradeFilter, setSelectedGradeFilter] = useState<'all' | WarehouseGradeTier>('all');

  // Form state for Roasting Lab
  const [boughtGreenBeanKg, setBoughtGreenBeanKg] = useState<number>(20);
  const [roasterMachine, setRoasterMachine] = useState('Giesen W6A Artisan');
  const [roastLevel, setRoastLevel] = useState<RoastedBeanLot['roastLevel']>('Light-Medium');
  const [agtronNumber, setAgtronNumber] = useState<number>(68);
  const [developmentTimeRatio, setDevelopmentTimeRatio] = useState<number>(14.5);
  const [scaCuppingScore, setScaCuppingScore] = useState<number>(87.5);
  const [packageWeightGrams, setPackageWeightGrams] = useState<number>(250);
  const [totalPacks, setTotalPacks] = useState<number>(68); // 20kg with 15% weight loss = 17kg / 0.25 = 68 packs
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

  // Available lots from warehouse
  const availableWarehouseLots = warehouseLots.filter((lot) => lot.availableWeightKg > 0);
  const myRoastedLots = roastedLots.filter(
    (lot) => lot.roasterId === currentUser?.id || true
  );

  const myRoasterTransactions = transactions.filter(
    (t) => t.fromName === currentUser?.name || t.toName === currentUser?.name || t.fromRole === 'roaster' || t.toRole === 'roaster'
  );

  const totalRoastedPacks = myRoastedLots.reduce((acc, curr) => acc + curr.totalPacks, 0);
  const availablePacks = myRoastedLots.reduce((acc, curr) => acc + curr.availablePacks, 0);

  const handleOpenRoastingModal = (lot: WarehouseLot) => {
    setSelectedWarehouseLot(lot);
    const defaultBuy = Math.min(lot.availableWeightKg, 20);
    setBoughtGreenBeanKg(defaultBuy);
    // 15% roast moisture loss
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
      `Sukses menyangrai ${boughtGreenBeanKg} kg green bean menjadi ${totalPacks} pack Roasted Beans (${roastLevel})! Kini siap dipesan oleh Pemilik Cafe.`
    );
    setSelectedWarehouseLot(null);
    setActiveTab('catalog');
    setTimeout(() => setSuccessMsg(''), 6000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-linear-to-r from-orange-950 via-stone-900 to-amber-950 text-white rounded-3xl p-6 sm:p-8 shadow-md relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-orange-500/20 text-orange-300 text-xs font-semibold mb-3 border border-orange-400/30">
            <Flame className="w-4 h-4 text-orange-400" />
            Dasbor Artisan Roastery • Penyangraian & Profiling (Roast Tier)
          </span>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight">
            Roasting Lab & Penjualan ke Pemilik Cafe
          </h1>
          <p className="mt-2 text-stone-300 text-xs sm:text-sm leading-relaxed">
            Pilih green bean bersertifikasi dari gudang, sangrai dengan profil spesifik (Agtron, DTR, Roast Level), uji sensory tasting notes & cupping score, lalu distribusikan roasted beans ke jaringan kedai kopi.
          </p>
        </div>

        <div className="absolute right-4 -bottom-6 opacity-10 text-white pointer-events-none">
          <Flame className="w-48 h-48" />
        </div>
      </div>

      {/* Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Green Bean di Gudang</span>
            <ShoppingCart className="w-4 h-4 text-blue-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {availableWarehouseLots.reduce((a, b) => a + b.availableWeightKg, 0).toLocaleString()} kg
          </div>
          <span className="text-[11px] text-blue-600 font-medium">Siap disangrai</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Total Pack Diproduksi</span>
            <Layers className="w-4 h-4 text-orange-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{totalRoastedPacks.toLocaleString()} Pack</div>
          <span className="text-[11px] text-orange-600 font-medium">Biji sangrai artisan</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Pack Siap Kirim Cafe</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="text-2xl font-black text-stone-900">{availablePacks.toLocaleString()} Pack</div>
          <span className="text-[11px] text-emerald-600 font-medium">Tersedia di Roastery</span>
        </div>

        <div className="bg-white p-5 rounded-2xl border border-stone-200 shadow-xs">
          <div className="flex items-center justify-between text-stone-500 text-xs mb-1">
            <span>Log Transaksi</span>
            <TrendingUp className="w-4 h-4 text-stone-700" />
          </div>
          <div className="text-2xl font-black text-stone-900">
            {myRoasterTransactions.length} Log
          </div>
          <span className="text-[11px] text-stone-500 font-medium">Beli green bean & jual ke cafe</span>
        </div>
      </div>

      {/* Success Notification */}
      {successMsg && (
        <div className="p-4 rounded-2xl bg-orange-100 border border-orange-300 text-orange-950 text-xs font-semibold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-orange-700" />
          {successMsg}
        </div>
      )}

      {/* Tabs */}
      <div className="flex border-b border-stone-200">
        <button
          onClick={() => setActiveTab('marketplace')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'marketplace'
              ? 'border-orange-600 text-orange-900 bg-orange-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <ShoppingCart className="w-4 h-4" />
          Marketplace Green Bean Gudang ({availableWarehouseLots.length} Lot)
        </button>

        <button
          onClick={() => setActiveTab('catalog')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'catalog'
              ? 'border-orange-600 text-orange-900 bg-orange-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <Coffee className="w-4 h-4" />
          Katalog Roasted Beans Saya ({myRoastedLots.length})
        </button>

        <button
          onClick={() => setActiveTab('history')}
          className={`py-3 px-5 text-xs sm:text-sm font-bold border-b-2 flex items-center gap-2 transition-all ${
            activeTab === 'history'
              ? 'border-orange-600 text-orange-900 bg-orange-50/50'
              : 'border-transparent text-stone-500 hover:text-stone-800'
          }`}
        >
          <History className="w-4 h-4" />
          Log Transaksi Roastery ({myRoasterTransactions.length})
        </button>
      </div>

      {/* Tab 1: Marketplace Green Bean Gudang */}
      {activeTab === 'marketplace' && (
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Pilih Green Bean Bersertifikasi Grade Gudang
              </h2>
              <p className="text-xs text-stone-500">
                Pilih green bean berdasarkan klasifikasi grade mutu (Super Premium hingga Basic Commercial) untuk profil sangrai Anda.
              </p>
            </div>

            {/* Grade Filter Pill for Roasters */}
            <div className="flex flex-wrap items-center gap-1.5 bg-stone-100 p-1.5 rounded-2xl border border-stone-200 text-xs">
              <span className="text-stone-400 text-[11px] font-bold px-1.5 flex items-center gap-1">
                <Filter className="w-3 h-3" /> Grade:
              </span>
              <button
                onClick={() => setSelectedGradeFilter('all')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all ${
                  selectedGradeFilter === 'all'
                    ? 'bg-white text-stone-900 shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Semua
              </button>
              <button
                onClick={() => setSelectedGradeFilter('Grade 1 - Super Premium')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  selectedGradeFilter === 'Grade 1 - Super Premium'
                    ? 'bg-amber-500 text-stone-950 shadow-xs'
                    : 'text-stone-600 hover:text-amber-900'
                }`}
              >
                <Crown className="w-3 h-3 text-amber-800" />
                Super Premium
              </button>
              <button
                onClick={() => setSelectedGradeFilter('Grade 2 - Premium Grade')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  selectedGradeFilter === 'Grade 2 - Premium Grade'
                    ? 'bg-purple-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-purple-900'
                }`}
              >
                <Award className="w-3 h-3" />
                Premium
              </button>
              <button
                onClick={() => setSelectedGradeFilter('Grade 3 - Medium Commercial')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  selectedGradeFilter === 'Grade 3 - Medium Commercial'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-stone-600 hover:text-blue-900'
                }`}
              >
                <ShieldCheck className="w-3 h-3" />
                Medium
              </button>
              <button
                onClick={() => setSelectedGradeFilter('Grade 4 - Basic Commercial')}
                className={`px-2.5 py-1 rounded-xl font-bold transition-all flex items-center gap-1 ${
                  selectedGradeFilter === 'Grade 4 - Basic Commercial'
                    ? 'bg-stone-700 text-white shadow-xs'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Layers className="w-3 h-3" />
                Basic
              </button>
            </div>
          </div>

          {availableWarehouseLots.filter((l) => selectedGradeFilter === 'all' || l.gradeTier === selectedGradeFilter).length === 0 ? (
            <div className="bg-white rounded-3xl p-12 text-center border border-stone-200">
              <Sparkles className="w-12 h-12 text-stone-300 mx-auto mb-3" />
              <h3 className="text-base font-bold text-stone-800">
                Tidak ada green bean yang cocok dengan filter grade ini
              </h3>
              <p className="text-xs text-stone-500 mt-1 max-w-sm mx-auto">
                Silakan pilih filter grade lain atau login ke akun Gudang untuk menambah inventaris baru.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {availableWarehouseLots
                .filter((l) => selectedGradeFilter === 'all' || l.gradeTier === selectedGradeFilter)
                .map((lot) => {
                  const isSuperPremium = lot.gradeTier === 'Grade 1 - Super Premium';
                  const isPremium = lot.gradeTier === 'Grade 2 - Premium Grade';
                  const isMedium = lot.gradeTier === 'Grade 3 - Medium Commercial';

                  return (
                    <div
                      key={lot.id}
                      className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-all flex flex-col justify-between"
                    >
                      <div>
                        <div className="p-5 bg-gradient-to-b from-stone-100 to-white border-b border-stone-100">
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-mono text-xs font-bold text-stone-700 bg-stone-200 px-2.5 py-0.5 rounded-md">
                              {lot.id}
                            </span>
                            <span className="inline-flex items-center gap-1 text-xs font-black bg-stone-900 text-white px-2.5 py-0.5 rounded-lg shadow-xs">
                              <Award className="w-3.5 h-3.5 text-amber-400" />
                              SCA: {lot.verifiedScaScore}
                            </span>
                          </div>

                          {/* Grade Badge */}
                          <div className="mb-2">
                            <span
                              className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-lg text-xs font-black border shadow-xs ${
                                isSuperPremium
                                  ? 'bg-amber-100 text-amber-950 border-amber-300'
                                  : isPremium
                                  ? 'bg-purple-100 text-purple-950 border-purple-300'
                                  : isMedium
                                  ? 'bg-blue-100 text-blue-950 border-blue-300'
                                  : 'bg-stone-200 text-stone-800 border-stone-300'
                              }`}
                            >
                              {isSuperPremium && <Crown className="w-3.5 h-3.5 text-amber-700" />}
                              {isPremium && <Award className="w-3.5 h-3.5 text-purple-700" />}
                              {isMedium && <ShieldCheck className="w-3.5 h-3.5 text-blue-700" />}
                              {!isSuperPremium && !isPremium && !isMedium && (
                                <Layers className="w-3.5 h-3.5 text-stone-600" />
                              )}
                              {lot.gradeTier || 'Grade 1 - Super Premium'}
                            </span>
                          </div>

                          <h3 className="font-bold text-base text-stone-900">{lot.variety}</h3>
                          <p className="text-xs text-stone-500 mt-0.5">
                            {lot.origin} ({lot.altitude}) • {lot.processMethod}
                          </p>
                        </div>

                        <div className="p-5 space-y-3">
                          {/* Target Market Info */}
                          {lot.targetMarket && (
                            <div className="text-[11px] bg-stone-50 text-stone-700 p-2 rounded-xl border border-stone-200/80">
                              <span className="font-bold text-stone-900 block mb-0.5">
                                🎯 Saran Profil & Pasar:
                              </span>
                              <span>{lot.targetMarket}</span>
                            </div>
                          )}

                          <div className="grid grid-cols-2 gap-2 text-xs py-2 border-y border-stone-100">
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">
                                Cacat (Defect):
                              </span>
                              <span className="font-bold text-stone-800">
                                {lot.defectCount ?? 2} defect/350g
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">
                                Ukuran Biji:
                              </span>
                              <span className="font-bold text-stone-800 truncate block">
                                {lot.screenSize || 'Screen 17-18'}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">
                                Stasiun Gudang:
                              </span>
                              <span className="font-semibold text-blue-800 truncate block">
                                {lot.warehouseName}
                              </span>
                            </div>
                            <div>
                              <span className="text-[10px] text-stone-400 block font-semibold">
                                Kondisi Silo:
                              </span>
                              <span className="font-semibold text-stone-800">
                                {lot.temperatureCelsius}°C / {lot.humidityPercent}% RH
                              </span>
                            </div>
                          </div>

                          <div className="text-[11px] text-stone-500 space-y-0.5 pt-1">
                            <div>Petani Asal: <strong>{lot.sourceFarmerName}</strong></div>
                            <div>Pengolah Asal: <strong>{lot.sourceProcessorName}</strong></div>
                          </div>

                          {lot.notes && (
                            <p className="text-xs text-stone-600 italic line-clamp-2">
                              "{lot.notes}"
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="p-4 bg-stone-50 border-t border-stone-100 flex items-center justify-between">
                        <div>
                          <span className="text-[10px] text-stone-400 block">Harga Green Bean:</span>
                          <span className="text-sm font-black text-stone-900">
                            Rp {lot.pricePerKg.toLocaleString()}
                            <span className="text-xs font-normal text-stone-500"> / kg</span>
                          </span>
                        </div>

                        <button
                          onClick={() => handleOpenRoastingModal(lot)}
                          className="px-4 py-2 rounded-xl bg-orange-700 hover:bg-orange-800 text-white font-bold text-xs transition-colors shadow-xs flex items-center gap-1.5"
                        >
                          <Flame className="w-3.5 h-3.5" />
                          Beli & Sangrai
                        </button>
                      </div>
                    </div>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Tab 2: Katalog Roasted Beans Saya */}
      {activeTab === 'catalog' && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-base font-bold text-stone-900">
                Katalog Roasted Beans Siap Jual ke Pemilik Cafe ({myRoastedLots.length})
              </h2>
              <p className="text-xs text-stone-500">
                Biji kopi siap seduh yang dapat langsung dipesan oleh kedai kopi mitra.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {myRoastedLots.map((bean) => (
              <div
                key={bean.id}
                className="bg-white rounded-2xl border border-stone-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-44 bg-stone-900">
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
                      <span className="text-[11px] font-semibold text-stone-500 block mb-1">
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
                      Lihat Silsilah Traceability (Farm-to-Cup)
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

      {/* Tab 3: Log Transaksi Roastery */}
      {activeTab === 'history' && (
        <div className="bg-white rounded-3xl p-6 border border-stone-200 shadow-xs">
          <h2 className="text-base font-bold text-stone-900 mb-4 flex items-center gap-2">
            <History className="w-5 h-5 text-orange-600" />
            Log Transaksi Roastery
          </h2>

          {myRoasterTransactions.length === 0 ? (
            <p className="text-xs text-stone-500 py-6 text-center">
              Belum ada log transaksi roastery.
            </p>
          ) : (
            <div className="overflow-x-auto">
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
                    <tr key={trx.id} className="hover:bg-stone-50/50">
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
          )}
        </div>
      )}

      {/* Modal: Roasting Workstation */}
      {selectedWarehouseLot && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-stone-950/70 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6 animate-in fade-in duration-200">
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
              <p className="text-xs text-stone-300 mt-1">
                Gudang Asal: {selectedWarehouseLot.warehouseName} • Petani Asal: {selectedWarehouseLot.sourceFarmerName}
              </p>
            </div>

            <form onSubmit={handleConfirmRoast} className="p-6 sm:p-8 space-y-6 max-h-[70vh] overflow-y-auto">
              {/* Bagian 1: Beli Green Bean dari Gudang */}
              <div className="bg-orange-50/70 border border-orange-200/80 rounded-2xl p-4 space-y-3">
                <h3 className="text-xs font-bold text-orange-900 uppercase tracking-wider">
                  1. Volume Pembelian Green Bean dari Gudang
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
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
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500 bg-white"
                    />
                  </div>
                  <div className="flex flex-col justify-center">
                    <span className="text-xs text-stone-500">Biaya Pembelian Green Bean:</span>
                    <span className="text-base font-black text-orange-900">
                      Rp {(boughtGreenBeanKg * selectedWarehouseLot.pricePerKg).toLocaleString()}
                    </span>
                    <span className="text-[11px] text-stone-500">
                      (Rp {selectedWarehouseLot.pricePerKg.toLocaleString()}/kg ke Gudang)
                    </span>
                  </div>
                </div>
              </div>

              {/* Bagian 2: Profil Roasting Artisan */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  2. Parameter Roasting & Sensory Profiling
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Mesin Roaster
                    </label>
                    <input
                      type="text"
                      required
                      value={roasterMachine}
                      onChange={(e) => setRoasterMachine(e.target.value)}
                      placeholder="Contoh: Giesen W6A Artisan, Probat UG15"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Profil Sangrai (Roast Level)
                    </label>
                    <select
                      value={roastLevel}
                      onChange={(e) =>
                        setRoastLevel(e.target.value as RoastedBeanLot['roastLevel'])
                      }
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="Light Roast">Light Roast (Filter Specialty)</option>
                      <option value="Light-Medium">Light-Medium Roast (Balanced Filter)</option>
                      <option value="Medium Roast">Medium Roast (Modern Espresso / Omni)</option>
                      <option value="Medium-Dark">Medium-Dark Roast (Full Body Espresso)</option>
                      <option value="Dark Roast">Dark Roast (Traditional Bold)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Warna Sangrai (Agtron Number)
                    </label>
                    <input
                      type="number"
                      required
                      value={agtronNumber}
                      onChange={(e) => setAgtronNumber(Number(e.target.value))}
                      placeholder="68"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-[11px] text-stone-500">Agtron #65 - #75 = Light/Light-Medium</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Development Time Ratio (DTR %)
                    </label>
                    <input
                      type="number"
                      step="0.1"
                      required
                      value={developmentTimeRatio}
                      onChange={(e) => setDevelopmentTimeRatio(Number(e.target.value))}
                      placeholder="14.5"
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                    <span className="text-[11px] text-stone-500">Optimal DTR Specialty: 13% - 16%</span>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Cupping Score Akhir (SCA)
                    </label>
                    <input
                      type="number"
                      step="0.25"
                      required
                      value={scaCuppingScore}
                      onChange={(e) => setScaCuppingScore(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Rekomendasi Resting (Hari)
                    </label>
                    <input
                      type="number"
                      required
                      value={restingDays}
                      onChange={(e) => setRestingDays(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 3: Kemasan & Penawaran ke Pemilik Cafe */}
              <div>
                <h3 className="text-xs font-bold text-stone-800 uppercase tracking-wider mb-3">
                  3. Kemasan Pack & Harga Jual ke Cafe
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Ukuran Kemasan
                    </label>
                    <select
                      value={packageWeightGrams}
                      onChange={(e) => {
                        const grams = Number(e.target.value);
                        setPackageWeightGrams(grams);
                        const roastedKg = boughtGreenBeanKg * 0.85;
                        setTotalPacks(Math.floor((roastedKg * 1000) / grams));
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500 bg-white"
                    >
                      <option value="200">200 gram</option>
                      <option value="250">250 gram (Retail Standard)</option>
                      <option value="500">500 gram</option>
                      <option value="1000">1000 gram (1 kg HoReCa Cafe)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Jumlah Pack Dihasilkan
                    </label>
                    <input
                      type="number"
                      required
                      min="1"
                      value={totalPacks}
                      onChange={(e) => setTotalPacks(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-stone-700 mb-1">
                      Harga per Pack ke Cafe (Rp)
                    </label>
                    <input
                      type="number"
                      required
                      step="1000"
                      value={pricePerPack}
                      onChange={(e) => setPricePerPack(Number(e.target.value))}
                      className="w-full px-4 py-2.5 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                    />
                  </div>
                </div>
              </div>

              {/* Bagian 4: Tasting Notes Tag Input */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-1">
                  Karakter Rasa (Tasting Notes)
                </label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={tastingNoteInput}
                    onChange={(e) => setTastingNoteInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleAddTastingNote();
                      }
                    }}
                    placeholder="Contoh: Peach, Bergamot, Dark Chocolate, Vanilla..."
                    className="flex-1 px-4 py-2 rounded-xl border border-stone-300 text-sm focus:ring-2 focus:ring-orange-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddTastingNote}
                    className="px-4 py-2 rounded-xl bg-stone-800 hover:bg-stone-900 text-white text-xs font-bold transition-colors"
                  >
                    Tambah
                  </button>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  {tastingNotes.map((note) => (
                    <span
                      key={note}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium bg-orange-100 text-orange-900 border border-orange-300"
                    >
                      {note}
                      <button
                        type="button"
                        onClick={() => handleRemoveTastingNote(note)}
                        className="hover:text-red-700 ml-1"
                      >
                        &times;
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              {/* Bagian 5: Rekomendasi Metode Seduh */}
              <div>
                <label className="block text-xs font-bold text-stone-700 mb-2">
                  Rekomendasi Metode Seduh (Pilih Metode):
                </label>
                <div className="flex flex-wrap gap-2">
                  {['V60 Ceramic', 'Aeropress', 'Origami Dripper', 'Kalita Wave', 'Espresso Base', 'French Press'].map(
                    (brew) => {
                      const isSelected = recommendedBrew.includes(brew);
                      return (
                        <button
                          key={brew}
                          type="button"
                          onClick={() => {
                            if (isSelected) {
                              setRecommendedBrew(recommendedBrew.filter((b) => b !== brew));
                            } else {
                              setRecommendedBrew([...recommendedBrew, brew]);
                            }
                          }}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all border ${
                            isSelected
                              ? 'bg-orange-100 text-orange-900 border-orange-400 font-bold'
                              : 'bg-stone-50 text-stone-600 border-stone-200 hover:bg-stone-100'
                          }`}
                        >
                          {isSelected ? '✓ ' : '+ '}
                          {brew}
                        </button>
                      );
                    }
                  )}
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="pt-4 border-t border-stone-200 flex items-center justify-between">
                <button
                  type="button"
                  onClick={() => setSelectedWarehouseLot(null)}
                  className="px-5 py-2.5 rounded-xl border border-stone-300 text-stone-700 text-xs font-bold hover:bg-stone-100 transition-colors"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-orange-700 hover:bg-orange-800 text-white text-xs font-bold transition-colors shadow-md flex items-center gap-1.5"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  Konfirmasi Roasting & Terbitkan ke Marketplace Cafe
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
